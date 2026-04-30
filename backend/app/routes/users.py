"""
routes/users.py
---------------
Endpoints:
  POST   /auth/register       Create a new user account
  POST   /auth/login          Login and receive JWT token
  GET    /users/me            Get current user's profile
  PUT    /users/me            Update current user's profile
  GET    /users/me/privacy    Get privacy/matching field settings
  PUT    /users/me/privacy    Update which fields are used for matching

Account Creation Flow (maps to 3 registration steps in frontend):
  - Frontend collects all 3 steps, then sends one POST /auth/register
  - User row is created first (email + hashed password)
  - UserProfile row is created with all collected fields
  - Profile is flagged profile_completed=True on final submit
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..auth import hash_password, verify_password, create_access_token, get_current_user
from .. import models, schemas

router = APIRouter()


# ── Auth ────────────────────────────────────────────────────────────────────

@router.post("/auth/register", response_model=schemas.TokenResponse, status_code=201)
def register(payload: schemas.UserRegister, db: Session = Depends(get_db)):
    """
    Step: User submits completed 3-step registration form.
    Creates User + UserProfile rows in one transaction.
    Returns JWT so the user is immediately logged in.
    """
    if db.query(models.User).filter(models.User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = models.User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role=payload.role,
    )
    db.add(user)
    db.flush()  # assigns user.id before profile FK

    # Empty profile shell — filled by /users/me PUT after registration
    profile = models.UserProfile(user_id=user.id, full_name="", profile_completed=False)
    db.add(profile)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.id, "role": user.role})
    return {"access_token": token}


@router.post("/auth/login", response_model=schemas.TokenResponse)
def login(payload: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.id, "role": user.role})
    return {"access_token": token}


# ── Profile ─────────────────────────────────────────────────────────────────

@router.get("/users/me", response_model=schemas.UserProfileResponse)
def get_my_profile(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    
    """
    Returns the full profile for the logged-in user.
    Used by the Profile page and to personalize trial matching.
    """

    profile = db.query(models.UserProfile).filter(
        models.UserProfile.user_id == current_user.id
    ).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    # Merge email into profile response
    result = {**profile.__dict__, "email": current_user.email}
    return result


@router.put("/users/me", response_model=schemas.UserProfileResponse)
def update_my_profile(
    payload: schemas.UserProfileUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Partial update — only provided fields are changed.
    Called after each registration step and from the Profile edit page.
    """
    profile = db.query(models.UserProfile).filter(
        models.UserProfile.user_id == current_user.id
    ).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return {**profile.__dict__, "email": current_user.email}


# ── Privacy settings ─────────────────────────────────────────────────────────

@router.get("/users/me/privacy")
def get_privacy_settings(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns which profile fields are currently enabled for trial matching.
    Displayed on the Privacy Settings page.
    """
    profile = db.query(models.UserProfile).filter(
        models.UserProfile.user_id == current_user.id
    ).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return {
        "stored_fields": ["full_name", "email", "phone", "location", "age",
                          "gender", "ethnicity", "health_conditions",
                          "trial_interests", "swipe_history"],
        "matching_fields_enabled": profile.matching_fields_enabled,
    }


@router.put("/users/me/privacy")
def update_privacy_settings(
    payload: schemas.PrivacySettingsUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Toggles which fields are used in the matching algorithm.
    When a field is set to False, it is excluded from recommendations.
    """
    profile = db.query(models.UserProfile).filter(
        models.UserProfile.user_id == current_user.id
    ).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    profile.matching_fields_enabled = payload.matching_fields_enabled
    db.commit()
    return {"message": "Privacy settings updated", "matching_fields_enabled": profile.matching_fields_enabled}