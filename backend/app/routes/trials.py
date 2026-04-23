from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import User, Trial, SavedTrial, PassedTrial, SwipeHistory, AnalyticsEvent
from ..schemas import TrialResponse, TrialAction, SavedTrialResponse, TrialFilters
from ..auth import get_current_user
from ..services.matcher import matching_engine
from ..services.clinical_api import clinical_api
from ..services.cleaner import data_cleaner

router = APIRouter(prefix="/trials", tags=["trials"])

@router.get("/recommendations", response_model=List[TrialResponse])
def get_recommendations(
    limit: int = Query(20, le=50),
    condition: Optional[str] = None,
    phase: Optional[str] = None,
    is_remote: Optional[bool] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get personalized trial recommendations"""
    
    filters = {}
    if condition:
        filters["condition"] = condition
    if phase:
        filters["phase"] = phase
    if is_remote is not None:
        filters["is_remote"] = is_remote
    
    recommendations = matching_engine.get_recommendations(
        db=db,
        user=current_user,
        limit=limit,
        filters=filters
    )
    
    # Convert to response format
    results = []
    for rec in recommendations:
        trial_dict = {
            **{c.name: getattr(rec["trial"], c.name) for c in rec["trial"].__table__.columns},
            "match_reasons": rec["match_reasons"],
            "distance_miles": rec["distance_miles"]
        }
        results.append(TrialResponse(**trial_dict))
    
    # Log analytics
    event = AnalyticsEvent(
        event_type="recommendations_viewed",
        user_id=current_user.id,
        metadata={"count": len(results), "filters": filters}
    )
    db.add(event)
    db.commit()
    
    return results

@router.post("/action")
def perform_action(
    action_data: TrialAction,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Save or pass on a trial"""
    
    trial = db.query(Trial).filter(Trial.id == action_data.trial_id).first()
    if not trial:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trial not found"
        )
    
    # Record swipe history
    swipe = SwipeHistory(
        user_id=current_user.id,
        trial_id=trial.id,
        action=action_data.action
    )
    db.add(swipe)
    
    if action_data.action == "save":
        # Check if already saved
        existing = db.query(SavedTrial).filter(
            SavedTrial.user_id == current_user.id,
            SavedTrial.trial_id == trial.id
        ).first()
        
        if not existing:
            saved = SavedTrial(user_id=current_user.id, trial_id=trial.id)
            db.add(saved)
    
    elif action_data.action == "pass":
        # Check if already passed
        existing = db.query(PassedTrial).filter(
            PassedTrial.user_id == current_user.id,
            PassedTrial.trial_id == trial.id
        ).first()
        
        if not existing:
            passed = PassedTrial(user_id=current_user.id, trial_id=trial.id)
            db.add(passed)
    
    # Log analytics
    event = AnalyticsEvent(
        event_type=f"trial_{action_data.action}",
        user_id=current_user.id,
        trial_id=trial.id
    )
    db.add(event)
    
    db.commit()
    
    return {"status": "success", "action": action_data.action}

@router.get("/saved", response_model=List[SavedTrialResponse])
def get_saved_trials(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's saved trials"""
    
    saved_trials = db.query(SavedTrial).filter(
        SavedTrial.user_id == current_user.id
    ).order_by(SavedTrial.saved_at.desc()).all()
    
    results = []
    for saved in saved_trials:
        trial_dict = {c.name: getattr(saved.trial, c.name) for c in saved.trial.__table__.columns}
        results.append({
            "id": saved.id,
            "trial": TrialResponse(**trial_dict),
            "saved_at": saved.saved_at,
            "notes": saved.notes
        })
    
    return results

@router.delete("/saved/{trial_id}")
def unsave_trial(
    trial_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove a trial from saved"""
    
    saved = db.query(SavedTrial).filter(
        SavedTrial.user_id == current_user.id,
        SavedTrial.trial_id == trial_id
    ).first()
    
    if not saved:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Saved trial not found"
        )
    
    db.delete(saved)
    db.commit()
    
    return {"status": "success"}

@router.get("/{trial_id}", response_model=TrialResponse)
def get_trial_details(
    trial_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get detailed information about a specific trial"""
    
    trial = db.query(Trial).filter(Trial.id == trial_id).first()
    if not trial:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trial not found"
        )
    
    # Record view
    event = AnalyticsEvent(
        event_type="trial_viewed",
        user_id=current_user.id,
        trial_id=trial.id
    )
    db.add(event)
    db.commit()
    
    trial_dict = {c.name: getattr(trial, c.name) for c in trial.__table__.columns}
    return TrialResponse(**trial_dict)

@router.post("/refresh")
def refresh_trials(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Manually refresh trial data from ClinicalTrials.gov API"""
    
    # Get user profile to fetch relevant trials
    profile = db.query(User).filter(User.id == current_user.id).first().profile
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please create a profile first"
        )
    
    # Fetch trials from API
    trials_data = clinical_api.search_trials(
        condition=profile.condition,
        location=profile.location_state
    )
    
    # Update cache
    updated_count = 0
    for trial_data in trials_data:
        data_cleaner.update_trial_cache(db, trial_data)
        updated_count += 1
    
    return {"status": "success", "updated": updated_count}
