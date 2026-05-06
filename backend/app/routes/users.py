from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..auth import create_access_token, get_current_user, hash_password, verify_password
from ..database import get_db

router = APIRouter()


@router.post("/auth/register", response_model=schemas.TokenResponse, status_code=201)
def register(payload: schemas.UserRegister, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    role = payload.role if payload.role in {"user", "clinic", "admin"} else "user"

    user = models.User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role=role,
    )
    db.add(user)
    db.flush()

    profile_seed_name = payload.email.split("@")[0].replace(".", " ").title() or "Participant"
    profile = models.UserProfile(
        user_id=user.id,
        full_name=profile_seed_name,
        profile_completed=False,
    )
    db.add(profile)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.id, "role": user.role})
    return {
        "access_token": token,
        "user_id": user.id,
        "role": user.role,
        "profile_completed": bool(user.profile and user.profile.profile_completed),
    }


@router.post("/auth/login", response_model=schemas.TokenResponse)
def login(payload: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.id, "role": user.role})
    return {
        "access_token": token,
        "user_id": user.id,
        "role": user.role,
        "profile_completed": bool(user.profile and user.profile.profile_completed),
    }


@router.get("/users/me", response_model=schemas.UserProfileResponse)
def get_my_profile(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = (
        db.query(models.UserProfile)
        .filter(models.UserProfile.user_id == current_user.id)
        .first()
    )
    if not profile:
        profile = models.UserProfile(
            user_id=current_user.id,
            full_name=current_user.email.split("@")[0].title() or "Participant",
            profile_completed=False,
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)

    result = {**profile.__dict__, "email": current_user.email}
    return result


@router.put("/users/me", response_model=schemas.UserProfileResponse)
def update_my_profile(
    payload: schemas.UserProfileUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = (
        db.query(models.UserProfile)
        .filter(models.UserProfile.user_id == current_user.id)
        .first()
    )
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    update_data = payload.model_dump(exclude_unset=True)
    if (
        "age_range_min" in update_data
        and "age_range_max" in update_data
        and update_data["age_range_min"] is not None
        and update_data["age_range_max"] is not None
        and update_data["age_range_min"] > update_data["age_range_max"]
    ):
        raise HTTPException(status_code=400, detail="Age range min must be <= max")

    for field, value in update_data.items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return {**profile.__dict__, "email": current_user.email}


@router.get("/users/me/privacy")
def get_privacy_settings(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = (
        db.query(models.UserProfile)
        .filter(models.UserProfile.user_id == current_user.id)
        .first()
    )
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    return {
        "stored_fields": [
            "full_name",
            "email",
            "phone",
            "location",
            "age_range_min",
            "age_range_max",
            "health_conditions",
            "trial_interests",
            "participation_preference",
            "travel_willingness",
            "swipe_history",
        ],
        "matching_fields_enabled": profile.matching_fields_enabled,
    }


@router.put("/users/me/privacy")
def update_privacy_settings(
    payload: schemas.PrivacySettingsUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = (
        db.query(models.UserProfile)
        .filter(models.UserProfile.user_id == current_user.id)
        .first()
    )
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    profile.matching_fields_enabled = payload.matching_fields_enabled
    db.commit()

    return {
        "message": "Privacy settings updated",
        "matching_fields_enabled": profile.matching_fields_enabled,
    }
