from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from .. import crud, schemas
from ..database import get_db
from ..services.clinical_api import fetch_trials
from ..services.cleaner import clean_trial

router = APIRouter(prefix="/trials", tags=["trials"])

# ───────────────────────────────────────────────────────────────────
# GET /trials — Search and fetch trials
# ───────────────────────────────────────────────────────────────────

@router.get("/")
def list_trials(
    condition: str = Query(..., description="Medical condition"),
    location: Optional[str] = Query(None, description="Location filter"),
    status: Optional[str] = Query(None, description="Recruitment status"),
    phase: Optional[str] = Query(None, description="Study phase"),
    remote_only: Optional[bool] = Query(
        None,
        description="Only include trials that support remote participation",
    ),
    study_type: Optional[str] = Query(None, description="Filter by study type"),
    compensation_required: Optional[bool] = Query(
        None,
        description="Only include trials with compensation details",
    ),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Search trials by condition and filters.
    Fetches from ClinicalTrials.gov if not already stored locally.
    """
    # First search local database
    trials = crud.search_trials(
        db,
        condition=condition,
        location=location,
        status=status,
        phase=phase,
        remote_only=remote_only,
        study_type=study_type,
        compensation_required=compensation_required,
        skip=skip,
        limit=limit,
    )

    if trials:
        return trials

    # If no local results, try ClinicalTrials.gov
    try:
        raw_data = fetch_trials(condition, location)
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
            detail="ClinicalTrials.gov data temporarily unavailable"
        )

    # Re-search after saving fetched trials
    trials = crud.search_trials(
        db,
        condition=condition,
        location=location,
        status=status,
        phase=phase,
        remote_only=remote_only,
        study_type=study_type,
        compensation_required=compensation_required,
        skip=skip,
        limit=limit,
    )

    if not trials:
        raise HTTPException(
            status_code=404,
            detail="No trials matched the selected filters. Try broadening your search."
        )

    return trials

# ───────────────────────────────────────────────────────────────────
# GET /trials/{trial_id} — Get trial details
# ───────────────────────────────────────────────────────────────────

@router.get("/{trial_id}")
def get_trial_details(
    trial_id: str,
    user_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get full trial details and record view"""
    trial = crud.get_trial(db, trial_id)
    if not trial:
        raise HTTPException(status_code=404, detail="Trial not found")
    
    # Record view if user provided
    if user_id:
        crud.view_trial(db, user_id, trial_id)
    
    return trial


# ───────────────────────────────────────────────────────────────────
# POST /trials/{trial_id}/save — User saves trial
# ───────────────────────────────────────────────────────────────────

@router.post("/{trial_id}/save")
def save_trial(
    trial_id: str,
    user_id: str = Query(..., description="User ID"),
    db: Session = Depends(get_db)
):
    """User saves a trial (swipe right / save button)"""
    trial = crud.get_trial(db, trial_id)
    if not trial:
        raise HTTPException(status_code=404, detail="Trial not found")
    
    interaction = crud.save_trial(db, user_id, trial_id)
    return {"status": "saved", "interaction_id": interaction.id}


# ───────────────────────────────────────────────────────────────────
# POST /trials/{trial_id}/pass — User passes on trial
# ───────────────────────────────────────────────────────────────────

@router.post("/{trial_id}/pass")
def pass_trial(
    trial_id: str,
    user_id: str = Query(..., description="User ID"),
    db: Session = Depends(get_db)
):
    """User passes on a trial (swipe left / not interested)"""
    trial = crud.get_trial(db, trial_id)
    if not trial:
        raise HTTPException(status_code=404, detail="Trial not found")
    
    interaction = crud.pass_trial(db, user_id, trial_id)
    return {"status": "passed", "interaction_id": interaction.id}


# ───────────────────────────────────────────────────────────────────
# GET /trials/user/{user_id}/saved — Get user's saved trials
# ───────────────────────────────────────────────────────────────────

@router.get("/user/{user_id}/saved")
def get_user_saved_trials(
    user_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get all trials saved by a user"""
    trials = crud.get_saved_trials(db, user_id, skip, limit)
    return trials


@router.get("/user/{user_id}/passed")
def get_user_passed_trials(
    user_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get all trials passed by a user"""
    trials = crud.get_passed_trials(db, user_id, skip, limit)
    return trials


@router.get("/user/{user_id}/summary")
def get_user_summary(user_id: str, db: Session = Depends(get_db)):
    """Get account-level interaction summary for participant dashboard."""
    return crud.get_user_interaction_summary(db, user_id)


# ───────────────────────────────────────────────────────────────────
# GET /analytics — Get trial statistics
# ───────────────────────────────────────────────────────────────────

@router.get("/analytics/stats")
def get_analytics(db: Session = Depends(get_db)):
    """Get aggregate trial analytics for admin dashboard"""
    stats = crud.get_trial_stats(db)
    return stats
