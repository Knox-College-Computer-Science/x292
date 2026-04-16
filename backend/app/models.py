"""
models.py
---------
SQLAlchemy ORM models.
Each class maps to a database table.

Run migrations after changes:
    alembic revision --autogenerate -m "description"
    alembic upgrade head
"""

from sqlalchemy import Column, String, Integer, Boolean, Float, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
import uuid


def gen_uuid():
    return str(uuid.uuid4())


# ---------------------------------------------------------------------------
# User & Profile
# ---------------------------------------------------------------------------

class User(Base):
    """
    Core authentication table.
    Stores login credentials only — profile data lives in UserProfile.
    """
    __tablename__ = "users"

    id          = Column(String, primary_key=True, default=gen_uuid)
    email       = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    role        = Column(String, default="user")   # "user" | "admin" | "clinic"
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    profile     = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete")
    interactions = relationship("TrialInteraction", back_populates="user", cascade="all, delete")


class UserProfile(Base):
    """
    Extended participant profile.
    Collected across 3 registration steps:
      Step 1 — Basic Info
      Step 2 — Health Info
      Step 3 — Preferences
    """
    __tablename__ = "user_profiles"

    id              = Column(String, primary_key=True, default=gen_uuid)
    user_id         = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    created_at      = Column(DateTime(timezone=True), server_default=func.now())
    updated_at      = Column(DateTime(timezone=True), onupdate=func.now())

    # ── Step 1: Basic Info ──────────────────────────────────────────────────
    full_name           = Column(String, nullable=False)
    phone               = Column(String, nullable=True)
    location            = Column(String, nullable=True)
    preferred_language  = Column(String, default="English")

    # ── Step 2: Health Info ─────────────────────────────────────────────────
    age                 = Column(Integer, nullable=True)
    gender              = Column(String, nullable=True)          # Male | Female | Non-binary | Prefer not to say
    ethnicity           = Column(String, nullable=True)
    health_conditions   = Column(Text, nullable=True)            # Free text
    insurance_status    = Column(String, nullable=True)          # Insured | Uninsured | Student | Other
    consent_given       = Column(Boolean, default=False)

    # ── Step 3: Preferences ─────────────────────────────────────────────────
    trial_interests         = Column(Text, nullable=True)        # Free text
    time_commitment         = Column(String, nullable=True)
    notification_preferences = Column(String, default="Email")  # Email | SMS | Both | None
    travel_willingness      = Column(String, nullable=True)
    participation_preference = Column(String, nullable=True)     # In-person | Remote | Either

    # ── Privacy Controls ────────────────────────────────────────────────────
    # JSON dict: { "location": true, "health_conditions": true, ... }
    # When a field is false, it is EXCLUDED from trial matching algorithm.
    matching_fields_enabled = Column(JSON, default={
        "location": True,
        "health_conditions": True,
        "age": True,
        "gender": True,
        "participation_preference": True,
    })

    profile_completed   = Column(Boolean, default=False)

    user = relationship("User", back_populates="profile")


# ---------------------------------------------------------------------------
# Clinic
# ---------------------------------------------------------------------------

class ClinicProfile(Base):
    """
    Clinic/Researcher registration.
    A clinic can post multiple trials.
    """
    __tablename__ = "clinic_profiles"

    id                  = Column(String, primary_key=True, default=gen_uuid)
    clinic_name         = Column(String, nullable=False)
    logo_url            = Column(String, nullable=True)
    contact_person      = Column(String, nullable=True)
    contact_email       = Column(String, nullable=False)
    contact_phone       = Column(String, nullable=True)
    location            = Column(String, nullable=False)
    sponsor_institution = Column(String, nullable=True)
    created_at          = Column(DateTime(timezone=True), server_default=func.now())

    trials = relationship("Trial", back_populates="clinic", cascade="all, delete")


# ---------------------------------------------------------------------------
# Trial
# ---------------------------------------------------------------------------

class Trial(Base):
    """
    Clinical trial record.
    Can be created by a clinic OR fetched live from ClinicalTrials.gov.
    """
    __tablename__ = "trials"

    id                      = Column(String, primary_key=True, default=gen_uuid)
    clinic_id               = Column(String, ForeignKey("clinic_profiles.id"), nullable=True)
    created_at              = Column(DateTime(timezone=True), server_default=func.now())
    updated_at              = Column(DateTime(timezone=True), onupdate=func.now())

    # ── Core Info ────────────────────────────────────────────────────────────
    title                   = Column(String, nullable=False)
    condition               = Column(String, nullable=False)
    category                = Column(String, nullable=True)
    location                = Column(String, nullable=False)
    study_type              = Column(String, nullable=True)      # Interventional | Observational | etc.
    study_description       = Column(Text, nullable=True)
    study_phase             = Column(String, nullable=True)      # Phase 1-4 | N/A
    recruitment_status      = Column(String, default="Recruiting")

    # ── Compensation ─────────────────────────────────────────────────────────
    # NOTE: compensation may be NULL — frontend shows "not available" when null
    compensation            = Column(String, nullable=True)

    # ── Schedule ─────────────────────────────────────────────────────────────
    duration                = Column(String, nullable=True)
    visit_frequency         = Column(String, nullable=True)
    time_commitment         = Column(String, nullable=True)
    start_date              = Column(String, nullable=True)
    end_date                = Column(String, nullable=True)

    # ── Eligibility ──────────────────────────────────────────────────────────
    eligibility_age_min     = Column(Integer, nullable=True)
    eligibility_age_max     = Column(Integer, nullable=True)
    eligibility_gender      = Column(String, default="All")      # All | Male | Female
    eligibility_conditions  = Column(Text, nullable=True)
    eligibility_summary     = Column(Text, nullable=True)

    # ── Participation ────────────────────────────────────────────────────────
    remote_eligible         = Column(Boolean, default=False)

    # ── Contact ──────────────────────────────────────────────────────────────
    sponsor                 = Column(String, nullable=True)
    contact_link            = Column(String, nullable=True)

    # ── Analytics counters (updated on each interaction) ────────────────────
    views_count             = Column(Integer, default=0)
    saves_count             = Column(Integer, default=0)
    passes_count            = Column(Integer, default=0)

    clinic        = relationship("ClinicProfile", back_populates="trials")
    interactions  = relationship("TrialInteraction", back_populates="trial", cascade="all, delete")


# ---------------------------------------------------------------------------
# Trial Interaction
# ---------------------------------------------------------------------------

class TrialInteraction(Base):
    """
    Records every user action on a trial card:
      - view  → user opened trial details
      - save  → user swiped right / clicked save
      - pass  → user swiped left / clicked not interested

    Used for:
      1. Building the user's saved-trials list (filter action="save")
      2. Excluding already-seen trials from the browse feed
      3. Powering the analytics dashboard
      4. Adjusting future recommendations (save/pass history)
    """
    __tablename__ = "trial_interactions"

    id              = Column(String, primary_key=True, default=gen_uuid)
    user_id         = Column(String, ForeignKey("users.id"), nullable=False)
    trial_id        = Column(String, ForeignKey("trials.id"), nullable=False)
    action          = Column(String, nullable=False)             # view | save | pass
    trial_category  = Column(String, nullable=True)             # denormalized for fast analytics
    trial_title     = Column(String, nullable=True)             # denormalized for fast analytics
    created_at      = Column(DateTime(timezone=True), server_default=func.now())

    user  = relationship("User", back_populates="interactions")
    trial = relationship("Trial", back_populates="interactions")