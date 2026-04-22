from sqlalchemy.orm import Session
from . import models, schemas
from typing import Optional, List

#CRUD IS create Read Update Delete

#Adds a new Trial to the database
def create_trial(db: Session, trial: schemas.TrialCreate) -> models.Trial:
    """Create a new trial record in database"""
    db_trial = models.Trial(**trial.dict())
    db.add(db_trial)
    db.commit()
    db.refresh(db_trial)
    return db_trial

#FOr getting the trials by ID
def get_trial(db: Session, trial_id: str) -> Optional[models.Trial]:
    """Get trial by internal ID"""
    return db.query(models.Trial).filter(models.Trial.id == trial_id).first()


def get_trial_by_nct_id(db: Session, nct_id: str) -> Optional[models.Trial]:
    """Get trial by ClinicalTrials.gov NCT ID"""
    return db.query(models.Trial).filter(models.Trial.nct_id == nct_id).first()


def get_all_trials(db: Session, skip: int = 0, limit: int = 50) -> List[models.Trial]:
    """Get all trials with pagination"""
    return db.query(models.Trial).offset(skip).limit(limit).all()

#Find Trials matching filters

def search_trials(
    db: Session,
    condition: Optional[str] = None,
    location: Optional[str] = None,
    status: Optional[str] = None,
    phase: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
) -> List[models.Trial]:
    """
    Search trials by criteria.
    All filters are optional (AND logic).
    """
    query = db.query(models.Trial)
    
    if condition:
        query = query.filter(models.Trial.condition.ilike(f"%{condition}%"))
    if location:
        query = query.filter(models.Trial.location.ilike(f"%{location}%"))
    if status:
        query = query.filter(models.Trial.recruitment_status == status)
    if phase:
        query = query.filter(models.Trial.study_phase == phase)
    
    return query.offset(skip).limit(limit).all()

#Adds 1 to view count

def increment_trial_views(db: Session, trial_id: str) -> models.Trial:
    """Increment view count when user opens trial details"""
    trial = get_trial(db, trial_id)
    if trial:
        trial.views_count += 1
        db.commit()
        db.refresh(trial)
    return trial


# ─────────────────────────────────────────────────────────────────────────────
# TRIAL INTERACTIONS — Save, Pass, View tracking
# ─────────────────────────────────────────────────────────────────────────────

def record_interaction(
    db: Session,
    user_id: str,
    trial_id: str,
    action: str,
    trial_category: Optional[str] = None,
    trial_title: Optional[str] = None,
) -> models.TrialInteraction:
    """
    Record a user's action on a trial (view, save, or pass).
    Automatically updates trial counters.
    """
    # Check if this interaction already exists
    existing = db.query(models.TrialInteraction).filter(
        models.TrialInteraction.user_id == user_id,
        models.TrialInteraction.trial_id == trial_id,
        models.TrialInteraction.action == action,
    ).first()
    
    if existing:
        return existing  # Don't duplicate
    
    # Create new interaction
    interaction = models.TrialInteraction(
        user_id=user_id,
        trial_id=trial_id,
        action=action,
        trial_category=trial_category,
        trial_title=trial_title,
    )
    db.add(interaction)
    
    # Update trial counters
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

#Records that user saved a trial

def save_trial(db: Session, user_id: str, trial_id: str) -> models.TrialInteraction:
    """User saves a trial (swipe right / save button)"""
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
    """User passes on a trial (swipe left / not interested)"""
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
    """User opens trial details"""
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
    """Get a specific user-trial interaction"""
    return db.query(models.TrialInteraction).filter(
        models.TrialInteraction.user_id == user_id,
        models.TrialInteraction.trial_id == trial_id,
    ).first()


def has_user_interacted(db: Session, user_id: str, trial_id: str) -> bool:
    """Check if user has already seen/interacted with trial"""
    return db.query(models.TrialInteraction).filter(
        models.TrialInteraction.user_id == user_id,
        models.TrialInteraction.trial_id == trial_id,
    ).first() is not None

#Get all the trials the user has saved

def get_saved_trials(db: Session, user_id: str, skip: int = 0, limit: int = 50) -> List[models.Trial]:
    """Get all trials saved by a user"""
    interactions = db.query(models.TrialInteraction).filter(
        models.TrialInteraction.user_id == user_id,
        models.TrialInteraction.action == "save",
    ).offset(skip).limit(limit).all()
    
    trial_ids = [i.trial_id for i in interactions]
    if not trial_ids:
        return []
    
    return db.query(models.Trial).filter(models.Trial.id.in_(trial_ids)).all()


def get_passed_trials(db: Session, user_id: str, skip: int = 0, limit: int = 50) -> List[models.Trial]:
    """Get all trials passed by a user"""
    interactions = db.query(models.TrialInteraction).filter(
        models.TrialInteraction.user_id == user_id,
        models.TrialInteraction.action == "pass",
    ).offset(skip).limit(limit).all()
    
    trial_ids = [i.trial_id for i in interactions]
    if not trial_ids:
        return []
    
    return db.query(models.Trial).filter(models.Trial.id.in_(trial_ids)).all()


def get_user_interactions(db: Session, user_id: str) -> List[models.TrialInteraction]:
    """Get all interactions for a user"""
    return db.query(models.TrialInteraction).filter(
        models.TrialInteraction.user_id == user_id,
    ).all()


# ─────────────────────────────────────────────────────────────────────────────
# ANALYTICS — Trial metrics
# ─────────────────────────────────────────────────────────────────────────────

def get_trial_stats(db: Session) -> dict:
    """Get aggregate analytics across all trials"""
    trials = db.query(models.Trial).all()
    
    total_views = sum(t.views_count for t in trials)
    total_saves = sum(t.saves_count for t in trials)
    total_passes = sum(t.passes_count for t in trials)
    
    # Most popular trials by saves
    top_trials = sorted(trials, key=lambda t: t.saves_count, reverse=True)[:10]
    
    # Category popularity (from interactions)
    interactions = db.query(models.TrialInteraction).all()
    category_counts = {}
    for interaction in interactions:
        if interaction.trial_category:
            category_counts[interaction.trial_category] = category_counts.get(interaction.trial_category, 0) + 1
    
    return {
        "total_views": total_views,
        "total_saves": total_saves,
        "total_passes": total_passes,
        "top_trials": [
            {"id": t.id, "title": t.title, "saves": t.saves_count}
            for t in top_trials
        ],
        "category_popularity": category_counts,
    }

"""
User clicks "Save Trial"
       ↓
POST /trials/{trial_id}/save (FastAPI route)
       ↓
crud.save_trial(db, user_id, trial_id)  ← CRUD function
       ↓
[Database: add record to trial_interactions table]
       ↓
Return success to frontend

"""