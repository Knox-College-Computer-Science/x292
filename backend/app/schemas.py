from datetime import datetime
from typing import Dict, List, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    role: str = "user"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class PasswordResetRequest(BaseModel):
    email: EmailStr
    new_password: str = Field(min_length=8)
    role: Optional[str] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    role: str
    profile_completed: bool


class MessageResponse(BaseModel):
    message: str


class UserProfileBase(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    preferred_language: Optional[str] = "English"
    age: Optional[int] = None
    age_range_min: Optional[int] = None
    age_range_max: Optional[int] = None
    gender: Optional[str] = None
    ethnicity: Optional[str] = None
    health_conditions: Optional[str] = None
    insurance_status: Optional[str] = None
    consent_given: bool = False
    trial_interests: Optional[str] = None
    time_commitment: Optional[str] = None
    notification_preferences: Optional[str] = "Email"
    travel_willingness: Optional[str] = None
    participation_preference: Optional[str] = None
    max_distance_miles: Optional[int] = None
    preferred_recruitment_status: Optional[str] = None
    preferred_study_phase: Optional[str] = None
    compensation_required: bool = False
    accessibility_needs: Optional[str] = None
    profile_completed: bool = False


class UserProfileCreate(UserProfileBase):
    full_name: str


class UserProfileUpdate(UserProfileBase):
    pass


class PrivacySettingsUpdate(BaseModel):
    matching_fields_enabled: Dict[str, bool]


class UserProfileResponse(UserProfileBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: str
    matching_fields_enabled: Optional[Dict[str, bool]] = None
    created_at: datetime


class ClinicProfileCreate(BaseModel):
    clinic_name: str
    logo_url: Optional[str] = None
    contact_person: Optional[str] = None
    contact_email: EmailStr
    contact_phone: Optional[str] = None
    location: str
    sponsor_institution: Optional[str] = None


class ClinicProfileResponse(ClinicProfileCreate):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: datetime


class TrialCreate(BaseModel):
    nct_id: Optional[str] = None
    title: str
    condition: str
    category: Optional[str] = None
    location: str
    study_type: Optional[str] = None
    study_description: Optional[str] = None
    study_phase: Optional[str] = None
    recruitment_status: str = "Recruiting"
    compensation: Optional[str] = None
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
    model_config = ConfigDict(from_attributes=True)

    id: str
    views_count: int
    saves_count: int
    passes_count: int
    created_at: datetime
    match_score: Optional[float] = None
    match_reasons: Optional[List[str]] = None


class TrialFilterParams(BaseModel):
    condition: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = None
    phase: Optional[str] = None
    participation: Optional[str] = None
    distance_miles: Optional[int] = None
    requires_compensation: Optional[bool] = None


class InteractionCreate(BaseModel):
    trial_id: str
    action: str


class InteractionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    trial_id: str
    user_id: str
    action: str
    created_at: datetime


class TrialAnalyticsStats(BaseModel):
    total_views: int
    total_saves: int
    total_passes: int
    top_trials: List[dict]
    category_popularity: Dict[str, int]
    drop_off_rate: float
    drop_off_by_category: Dict[str, int]
