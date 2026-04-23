from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


# User schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=72)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Profile schemas
class ProfileCreate(BaseModel):
    age: int = Field(..., ge=18, le=120)
    location_city: str
    location_state: str
    location_country: str = "United States"
    condition: str
    max_distance_miles: int = Field(50, ge=0, le=500)
    willing_to_travel: bool = False
    preferred_phase: Optional[str] = None
    preferred_type: Optional[str] = None
    privacy_show_age: bool = True
    privacy_show_location: bool = True

class ProfileUpdate(BaseModel):
    age: Optional[int] = Field(None, ge=18, le=120)
    location_city: Optional[str] = None
    location_state: Optional[str] = None
    location_country: Optional[str] = None
    condition: Optional[str] = None
    max_distance_miles: Optional[int] = Field(None, ge=0, le=500)
    willing_to_travel: Optional[bool] = None
    preferred_phase: Optional[str] = None
    preferred_type: Optional[str] = None
    privacy_show_age: Optional[bool] = None
    privacy_show_location: Optional[bool] = None

class ProfileResponse(BaseModel):
    id: int
    user_id: int
    age: int
    location_city: str
    location_state: str
    location_country: str
    condition: str
    max_distance_miles: int
    willing_to_travel: bool
    preferred_phase: Optional[str]
    preferred_type: Optional[str]
    privacy_show_age: bool
    privacy_show_location: bool
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Trial schemas
class TrialResponse(BaseModel):
    id: int
    nct_id: str
    title: str
    brief_summary: str
    detailed_description: Optional[str]
    condition: str
    phase: Optional[str]
    status: str
    sponsor: Optional[str]
    location_city: Optional[str]
    location_state: Optional[str]
    location_country: Optional[str]
    location_facility: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    min_age: Optional[int]
    max_age: Optional[int]
    gender: Optional[str]
    compensation: Optional[str]
    is_remote: bool
    start_date: Optional[datetime]
    completion_date: Optional[datetime]
    eligibility_criteria: Optional[str]
    contact_email: Optional[str]
    contact_phone: Optional[str]
    match_reasons: Optional[List[str]] = []
    distance_miles: Optional[float] = None
    
    class Config:
        from_attributes = True

class TrialAction(BaseModel):
    trial_id: int
    action: str  # 'save' or 'pass'

class SavedTrialResponse(BaseModel):
    id: int
    trial: TrialResponse
    saved_at: datetime
    notes: Optional[str]
    
    class Config:
        from_attributes = True

# Filter schemas
class TrialFilters(BaseModel):
    condition: Optional[str] = None
    phase: Optional[str] = None
    max_distance: Optional[int] = None
    is_remote: Optional[bool] = None
    gender: Optional[str] = None

# Analytics schemas
class AnalyticsOverview(BaseModel):
    total_users: int
    total_trials: int
    total_saves: int
    total_passes: int
    avg_swipes_per_user: float
    top_conditions: List[dict]
    recent_activity: List[dict]

# Auth response
class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
