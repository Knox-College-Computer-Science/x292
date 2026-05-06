from typing import List, Optional

from sqlalchemy.orm import Session

from . import models, schemas


# CRUD is Create Read Update Delete


def create_trial(db: Session, trial: schemas.TrialCreate) -> models.Trial:
    db_trial = models.Trial(**trial.model_dump())
    db.add(db_trial)
    db.commit()
    db.refresh(db_trial)
    return db_trial


def get_trial(db: Session, trial_id: str) -> Optional[models.Trial]:
    return db.query(models.Trial).filter(models.Trial.id == trial_id).first()


def get_trial_by_nct_id(db: Session, nct_id: str) -> Optional[models.Trial]:
    return db.query(models.Trial).filter(models.Trial.nct_id == nct_id).first()


def search_trials(
    db: Session,
    condition: Optional[str] = None,
    location: Optional[str] = None,
    status: Optional[str] = None,
    phase: Optional[str] = None,
    participation: Optional[str] = None,
    requires_compensation: Optional[bool] = None,
    skip: int = 0,
    limit: int = 50,
) -> List[models.Trial]:
    query = db.query(models.Trial)

    if condition:
        query = query.filter(models.Trial.condition.ilike(f"%{condition}%"))
    if location:
        query = query.filter(models.Trial.location.ilike(f"%{location}%"))
    if status:
        query = query.filter(models.Trial.recruitment_status.ilike(status))
    if phase:
        query = query.filter(models.Trial.study_phase.ilike(f"%{phase}%"))
    if participation:
        normalized = participation.strip().lower()
        if normalized == "remote":
            query = query.filter(models.Trial.remote_eligible.is_(True))
        elif normalized in {"in-person", "in person", "onsite"}:
            query = query.filter(models.Trial.remote_eligible.is_(False))
    if requires_compensation is True:
        query = query.filter(models.Trial.compensation.isnot(None))

    return query.offset(skip).limit(limit).all()


def record_interaction(
    db: Session,
    user_id: str,
    trial_id: str,
    action: str,
    trial_category: Optional[str] = None,
    trial_title: Optional[str] = None,
) -> models.TrialInteraction:
    existing = (
        db.query(models.TrialInteraction)
        .filter(
            models.TrialInteraction.user_id == user_id,
            models.TrialInteraction.trial_id == trial_id,
            models.TrialInteraction.action == action,
        )
        .first()
    )
    if existing:
        return existing

    interaction = models.TrialInteraction(
        user_id=user_id,
        trial_id=trial_id,
        action=action,
        trial_category=trial_category,
        trial_title=trial_title,
    )
    db.add(interaction)

    trial = get_trial(db, trial_id)
    if trial:
        if action == "view":
            trial.views_count += 1
        elif action == "save":
            trial.saves_count += 1
        elif action == "pass":
            trial.passes_count += 1

    db.commit()
    db.refresh(interaction)
    return interaction


def save_trial(db: Session, user_id: str, trial_id: str) -> models.TrialInteraction:
    trial = get_trial(db, trial_id)
    return record_interaction(
        db,
        user_id,
        trial_id,
        "save",
        trial_category=trial.category if trial else None,
        trial_title=trial.title if trial else None,
    )


def pass_trial(db: Session, user_id: str, trial_id: str) -> models.TrialInteraction:
    trial = get_trial(db, trial_id)
    return record_interaction(
        db,
        user_id,
        trial_id,
        "pass",
        trial_category=trial.category if trial else None,
        trial_title=trial.title if trial else None,
    )


def view_trial(db: Session, user_id: str, trial_id: str) -> models.TrialInteraction:
    trial = get_trial(db, trial_id)
    return record_interaction(
        db,
        user_id,
        trial_id,
        "view",
        trial_category=trial.category if trial else None,
        trial_title=trial.title if trial else None,
    )


def get_user_interaction(
    db: Session,
    user_id: str,
    trial_id: str,
) -> Optional[models.TrialInteraction]:
    return (
        db.query(models.TrialInteraction)
        .filter(
            models.TrialInteraction.user_id == user_id,
            models.TrialInteraction.trial_id == trial_id,
        )
        .first()
    )


def get_user_interaction_history(
    db: Session,
    user_id: str,
    actions: Optional[list[str]] = None,
    skip: int = 0,
    limit: int = 100,
) -> List[tuple[models.TrialInteraction, Optional[models.Trial]]]:
    query = (
        db.query(models.TrialInteraction, models.Trial)
        .outerjoin(models.Trial, models.Trial.id == models.TrialInteraction.trial_id)
        .filter(models.TrialInteraction.user_id == user_id)
    )

    if actions:
        query = query.filter(models.TrialInteraction.action.in_(actions))

    return (
        query.order_by(models.TrialInteraction.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_saved_trials(
    db: Session,
    user_id: str,
    skip: int = 0,
    limit: int = 50,
) -> List[models.Trial]:
    interactions = (
        db.query(models.TrialInteraction)
        .filter(
            models.TrialInteraction.user_id == user_id,
            models.TrialInteraction.action == "save",
        )
        .offset(skip)
        .limit(limit)
        .all()
    )

    trial_ids = [i.trial_id for i in interactions]
    if not trial_ids:
        return []

    return db.query(models.Trial).filter(models.Trial.id.in_(trial_ids)).all()


def get_passed_trials(
    db: Session,
    user_id: str,
    skip: int = 0,
    limit: int = 50,
) -> List[models.Trial]:
    interactions = (
        db.query(models.TrialInteraction)
        .filter(
            models.TrialInteraction.user_id == user_id,
            models.TrialInteraction.action == "pass",
        )
        .offset(skip)
        .limit(limit)
        .all()
    )

    trial_ids = [i.trial_id for i in interactions]
    if not trial_ids:
        return []

    return db.query(models.Trial).filter(models.Trial.id.in_(trial_ids)).all()


def get_trial_stats(db: Session) -> dict:
    trials = db.query(models.Trial).all()

    total_views = sum(t.views_count for t in trials)
    total_saves = sum(t.saves_count for t in trials)
    total_passes = sum(t.passes_count for t in trials)

    top_trials = sorted(trials, key=lambda t: t.saves_count, reverse=True)[:10]

    interactions = db.query(models.TrialInteraction).all()
    category_counts: dict[str, int] = {}
    drop_off_by_category: dict[str, int] = {}

    for interaction in interactions:
        if interaction.trial_category:
            category_counts[interaction.trial_category] = (
                category_counts.get(interaction.trial_category, 0) + 1
            )
            if interaction.action == "pass":
                drop_off_by_category[interaction.trial_category] = (
                    drop_off_by_category.get(interaction.trial_category, 0) + 1
                )

    drop_off_rate = 0.0
    if total_views > 0:
        drop_off_rate = round((total_passes / total_views) * 100, 2)

    return {
        "total_views": total_views,
        "total_saves": total_saves,
        "total_passes": total_passes,
        "top_trials": [
            {"id": t.id, "title": t.title, "saves": t.saves_count} for t in top_trials
        ],
        "category_popularity": category_counts,
        "drop_off_rate": drop_off_rate,
        "drop_off_by_category": drop_off_by_category,
    }
