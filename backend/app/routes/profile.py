from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Profile, AnalyticsEvent
from ..schemas import ProfileCreate, ProfileUpdate, ProfileResponse
from ..auth import get_current_user

router = APIRouter(prefix="/profile", tags=["profile"])

@router.post("", response_model=ProfileResponse, status_code=status.HTTP_201_CREATED)
def create_profile(
    profile_data: ProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create user profile"""
    # Check if profile already exists
    existing = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Profile already exists"
        )
    
    profile = Profile(**profile_data.dict(), user_id=current_user.id)
    db.add(profile)
    db.commit()
    db.refresh(profile)
    
    # Log analytics
    event = AnalyticsEvent(
        event_type="profile_created",
        user_id=current_user.id,
        metadata={"condition": profile_data.condition}
    )
    db.add(event)
    db.commit()
    
    return profile

@router.get("", response_model=ProfileResponse)
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's profile"""
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    return profile

@router.put("", response_model=ProfileResponse)
def update_profile(
    profile_data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    # Update fields
    update_data = profile_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(profile, key, value)
    
    db.commit()
    db.refresh(profile)
    
    # Log analytics
    event = AnalyticsEvent(
        event_type="profile_updated",
        user_id=current_user.id,
        metadata=update_data
    )
    db.add(event)
    db.commit()
    
    return profile
