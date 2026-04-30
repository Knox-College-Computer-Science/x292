from pydantic import BaseModel, EmailStr
from typing import Optional, Dict
from datetime import datetime


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------

class UserRegister(BaseModel):
    """POST /auth/register"""
    email: EmailStr
    password: str
    role: str = "user"                      # "user" | "admin" | "clinic"


class UserLogin(BaseModel):
    """POST /auth/login"""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ---------------------------------------------------------------------------
# User Profile — mirrors 3 registration steps
# ---------------------------------------------------------------------------

class BasicInfoStep(BaseModel):
    """Step 1 — Basic Info"""
    full_name: str
    phone: Optional[str] = None
    location: Optional[str] = None
    preferred_language: Optional[str] = "English"


class HealthInfoStep(BaseModel):
    """Step 2 — Health Info"""
    age: Optional[int] = None
    gender: Optional[str] = None
    ethnicity: Optional[str] = None
    health_conditions: Optional[str] = None
    insurance_status: Optional[str] = None
    consent_given: bool = False


class PreferencesStep(BaseModel):
    """Step 3 — Preferences"""
    trial_interests: Optional[str] = None
    time_commitment: Optional[str] = None
    notification_preferences: Optional[str] = "Email"
    travel_willingness: Optional[str] = None
    participation_preference: Optional[str] = None


class UserProfileCreate(BasicInfoStep, HealthInfoStep, PreferencesStep):
    """Full profile — all 3 steps combined (used for final submit)"""
    pass


class UserProfileUpdate(BaseModel):
    """PUT /users/me — partial update, all fields optional"""
    full_name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    preferred_language: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    ethnicity: Optional[str] = None
    health_conditions: Optional[str] = None
    insurance_status: Optional[str] = None
    trial_interests: Optional[str] = None
    time_commitment: Optional[str] = None
    notification_preferences: Optional[str] = None
    travel_willingness: Optional[str] = None
    participation_preference: Optional[str] = None
    profile_completed: Optional[bool] = None


class PrivacySettingsUpdate(BaseModel):
    """PUT /privacy — toggle which fields are used for matching"""
    matching_fields_enabled: Dict[str, bool]


class UserProfileResponse(BaseModel):
    id: str
    email: str
    full_name: str
    phone: Optional[str]
    location: Optional[str]
    preferred_language: Optional[str]
    age: Optional[int]
    gender: Optional[str]
    ethnicity: Optional[str]
    health_conditions: Optional[str]
    insurance_status: Optional[str]
    consent_given: bool
    trial_interests: Optional[str]
    time_commitment: Optional[str]
    notification_preferences: Optional[str]
    travel_willingness: Optional[str]
    participation_preference: Optional[str]
    matching_fields_enabled: Optional[Dict[str, bool]]
    profile_completed: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Clinic Profile
# ---------------------------------------------------------------------------

class ClinicProfileCreate(BaseModel):
    """POST /clinics"""
    clinic_name: str
    logo_url: Optional[str] = None
    contact_person: Optional[str] = None
    contact_email: EmailStr
    contact_phone: Optional[str] = None
    location: str
    sponsor_institution: Optional[str] = None


class ClinicProfileResponse(ClinicProfileCreate):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Trial
# ---------------------------------------------------------------------------

class TrialCreate(BaseModel):
    """POST /trials — create a new trial (clinic or admin)"""
    nct_id: Optional[str] = None  
    title: str
    condition: str
    category: Optional[str] = None
    location: str
    study_type: Optional[str] = None
    study_description: Optional[str] = None
    study_phase: Optional[str] = None
    recruitment_status: str = "Recruiting"
    compensation: Optional[str] = None      # nullable — "not available" shown on frontend
    duration: Optional[str] = None
    visit_frequency: Optional[str] = None
    time_commitment: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    eligibility_age_min: Optional[int] = None
    eligibility_age_max: Optional[int] = None
    eligibility_gender: str = "All"
    eligibility_conditions: Optional[str] = None
    eligibility_summary: Optional[str] = None
    remote_eligible: bool = False
    sponsor: Optional[str] = None
    contact_link: Optional[str] = None
    clinic_id: Optional[str] = None


class TrialResponse(TrialCreate):
    id: str
    views_count: int
    saves_count: int
    passes_count: int
    created_at: datetime

    class Config:
        from_attributes = True


class TrialFilterParams(BaseModel):
    """Query parameters for GET /trials"""
    condition: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = None           # Recruiting | etc.
    phase: Optional[str] = None            # Phase 1 | Phase 2 | etc.
    participation: Optional[str] = None    # Remote | In-person


# ---------------------------------------------------------------------------
# Trial Interaction
# ---------------------------------------------------------------------------

class InteractionCreate(BaseModel):
    """POST /interactions"""
    trial_id: str
    action: str                             # view | save | pass


class InteractionResponse(BaseModel):
    id: str
    trial_id: str
    user_id: str
    action: str
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Analytics
# ---------------------------------------------------------------------------

class AnalyticsResponse(BaseModel):
    total_views: int
    total_saves: int
    total_passes: int
    save_rate: float                        # saves / views * 100
    category_breakdown: Dict[str, int]     # { "Oncology": 12, "Cardiology": 8, ... }
    
    
    
class TodoItemBase(BaseModel):
    title: str
    description: Optional[str] = None

class TodoItemCreate(TodoItemBase):
    pass

class TodoItemUpdate(TodoItemBase):
    completed: Optional[bool] = None

class TodoItemRead(TodoItemBase):
    id: int
    completed: bool

    class Config:
        orm_mode = True