from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from .. import crud, models, schemas
from ..auth import get_current_user, get_current_user_optional
from ..database import get_db
from ..services.cleaner import clean_trial
from ..services.clinical_api import fetch_trials
from ..services.matcher import match_trials, score_trial

router = APIRouter(prefix="/trials", tags=["trials"])


DEFAULT_CONDITION = "diabetes"


def _effective_condition(condition: Optional[str], current_user: Optional[models.User]) -> str:
    if condition:
        return condition
    if current_user and current_user.profile and current_user.profile.health_conditions:
        first = current_user.profile.health_conditions.split(",")[0].strip()
        if first:
            return first
    return DEFAULT_CONDITION


def _trial_to_dict(trial: models.Trial, score: float | None = None, reasons: list[str] | None = None) -> dict:
    payload = {
        column.name: getattr(trial, column.name)
        for column in trial.__table__.columns
    }
    payload["match_score"] = score
    payload["match_reasons"] = reasons or []
    return payload


def _history_item_to_dict(
    interaction: models.TrialInteraction,
    trial: Optional[models.Trial],
    score: float | None = None,
    reasons: list[str] | None = None,
) -> dict:
    return {
        "interaction_id": interaction.id,
        "trial_id": interaction.trial_id,
        "action": interaction.action,
        "created_at": interaction.created_at,
        "trial": _trial_to_dict(trial, score=score, reasons=reasons) if trial else None,
    }


def _score_for_user(
    db: Session,
    user_id: str,
    trial: Optional[models.Trial],
) -> tuple[float | None, list[str]]:
    if not trial:
        return None, []

    try:
        return score_trial(db, user_id, trial)
    except Exception:
        return None, []


@router.get("/")
def list_trials(
    condition: Optional[str] = Query(None, description="Medical condition"),
    location: Optional[str] = Query(None, description="Location filter"),
    status: Optional[str] = Query(None, description="Recruitment status"),
    phase: Optional[str] = Query(None, description="Study phase"),
    participation: Optional[str] = Query(None, description="Remote or in-person"),
    requires_compensation: Optional[bool] = Query(
        None, description="Only return trials with compensation information"
    ),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user_optional),
):
    query_condition = _effective_condition(condition, current_user)

    trials = crud.search_trials(
        db,
        condition=query_condition,
        location=location,
        status=status,
        phase=phase,
        participation=participation,
        requires_compensation=requires_compensation,
        skip=skip,
        limit=limit,
    )

    if not trials:
        try:
            raw_data = fetch_trials(query_condition, location)
            studies = raw_data.get("studies", [])

            for study in studies:
                cleaned = clean_trial(study)
                if not cleaned.get("nct_id"):
                    continue

                existing = crud.get_trial_by_nct_id(db, cleaned["nct_id"])
                if not existing:
                    trial_create = schemas.TrialCreate(**cleaned)
                    crud.create_trial(db, trial_create)

        except Exception:
            raise HTTPException(
                status_code=503,
                detail="Live trial data from ClinicalTrials.gov is temporarily unavailable.",
            )

        trials = crud.search_trials(
            db,
            condition=query_condition,
            location=location,
            status=status,
            phase=phase,
            participation=participation,
            requires_compensation=requires_compensation,
            skip=skip,
            limit=limit,
        )

    if not trials:
        raise HTTPException(
            status_code=404,
            detail="No trials matched your filters. Try broadening your criteria.",
        )

    if current_user and current_user.profile:
        try:
            ranked = match_trials(db, current_user.id, trials)
            if ranked:
                return [
                    _trial_to_dict(trial, score=score, reasons=reasons)
                    for trial, score, reasons in ranked
                ]
        except Exception:
            pass

    return [_trial_to_dict(trial) for trial in trials]


@router.get("/me/history")
def get_my_interaction_history(
    actions: Optional[str] = Query(
        "save,pass", description="Comma-separated actions: save,pass,view"
    ),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=300),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    parsed_actions = [action.strip() for action in actions.split(",") if action.strip()]
    if not parsed_actions:
        parsed_actions = ["save", "pass"]

    rows = crud.get_user_interaction_history(
        db,
        user_id=current_user.id,
        actions=parsed_actions,
        skip=skip,
        limit=limit,
    )
    return [
        _history_item_to_dict(
            interaction,
            trial,
            *_score_for_user(db, current_user.id, trial),
        )
        for interaction, trial in rows
    ]


@router.get("/{trial_id}")
def get_trial_details(
    trial_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user_optional),
):
    trial = crud.get_trial(db, trial_id)
    if not trial:
        raise HTTPException(status_code=404, detail="Trial not found")

    if current_user:
        crud.view_trial(db, current_user.id, trial_id)

    return _trial_to_dict(trial)


@router.post("/{trial_id}/save")
def save_trial(
    trial_id: str,
    user_id: Optional[str] = Query(None, description="Deprecated fallback user id"),
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user_optional),
):
    trial = crud.get_trial(db, trial_id)
    if not trial:
        raise HTTPException(status_code=404, detail="Trial not found")

    effective_user_id = current_user.id if current_user else user_id
    if not effective_user_id:
        raise HTTPException(status_code=401, detail="Login required to save trials")

    interaction = crud.save_trial(db, effective_user_id, trial_id)
    return {"status": "saved", "interaction_id": interaction.id}


@router.post("/{trial_id}/pass")
def pass_trial(
    trial_id: str,
    user_id: Optional[str] = Query(None, description="Deprecated fallback user id"),
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user_optional),
):
    trial = crud.get_trial(db, trial_id)
    if not trial:
        raise HTTPException(status_code=404, detail="Trial not found")

    effective_user_id = current_user.id if current_user else user_id
    if not effective_user_id:
        raise HTTPException(status_code=401, detail="Login required to pass trials")

    interaction = crud.pass_trial(db, effective_user_id, trial_id)
    return {"status": "passed", "interaction_id": interaction.id}


@router.get("/me/saved")
def get_my_saved_trials(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    trials = crud.get_saved_trials(db, current_user.id, skip, limit)
    return [
        _trial_to_dict(trial, *_score_for_user(db, current_user.id, trial))
        for trial in trials
    ]


@router.get("/me/passed")
def get_my_passed_trials(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    trials = crud.get_passed_trials(db, current_user.id, skip, limit)
    return [
        _trial_to_dict(trial, *_score_for_user(db, current_user.id, trial))
        for trial in trials
    ]


@router.get("/user/{user_id}/saved")
def get_user_saved_trials(
    user_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    trials = crud.get_saved_trials(db, user_id, skip, limit)
    return [_trial_to_dict(trial) for trial in trials]


@router.get("/user/{user_id}/passed")
def get_user_passed_trials(
    user_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    trials = crud.get_passed_trials(db, user_id, skip, limit)
    return [_trial_to_dict(trial) for trial in trials]


@router.get("/analytics/stats", response_model=schemas.TrialAnalyticsStats)
def get_analytics(db: Session = Depends(get_db)):
    return crud.get_trial_stats(db)
