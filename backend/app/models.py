"""SQLAlchemy ORM models."""

import uuid

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base


def gen_uuid() -> str:
    return str(uuid.uuid4())


def default_matching_fields() -> dict[str, bool]:
    return {
        "location": True,
        "health_conditions": True,
        "age_range": True,
        "participation_preference": True,
        "travel_willingness": True,
    }


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=gen_uuid)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    profile = relationship(
        "UserProfile", back_populates="user", uselist=False, cascade="all, delete"
    )
    interactions = relationship(
        "TrialInteraction", back_populates="user", cascade="all, delete"
    )


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    full_name = Column(String, nullable=False, default="Participant")
    phone = Column(String, nullable=True)
    location = Column(String, nullable=True)
    preferred_language = Column(String, default="English")

    age = Column(Integer, nullable=True)
    age_range_min = Column(Integer, nullable=True)
    age_range_max = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    ethnicity = Column(String, nullable=True)
    health_conditions = Column(Text, nullable=True)
    insurance_status = Column(String, nullable=True)
    consent_given = Column(Boolean, default=False)

    trial_interests = Column(Text, nullable=True)
    time_commitment = Column(String, nullable=True)
    notification_preferences = Column(String, default="Email")
    travel_willingness = Column(String, nullable=True)
    participation_preference = Column(String, nullable=True)
    max_distance_miles = Column(Integer, nullable=True)
    preferred_recruitment_status = Column(String, nullable=True)
    preferred_study_phase = Column(String, nullable=True)
    compensation_required = Column(Boolean, default=False)
    accessibility_needs = Column(Text, nullable=True)

    matching_fields_enabled = Column(JSON, default=default_matching_fields)
    profile_completed = Column(Boolean, default=False)

    user = relationship("User", back_populates="profile")


class ClinicProfile(Base):
    __tablename__ = "clinic_profiles"

    id = Column(String, primary_key=True, default=gen_uuid)
    clinic_name = Column(String, nullable=False)
    logo_url = Column(String, nullable=True)
    contact_person = Column(String, nullable=True)
    contact_email = Column(String, nullable=False)
    contact_phone = Column(String, nullable=True)
    location = Column(String, nullable=False)
    sponsor_institution = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    trials = relationship("Trial", back_populates="clinic", cascade="all, delete")


class Trial(Base):
    __tablename__ = "trials"

    id = Column(String, primary_key=True, default=gen_uuid)
    nct_id = Column(String, unique=True, nullable=True, index=True)
    clinic_id = Column(String, ForeignKey("clinic_profiles.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    title = Column(String, nullable=False)
    condition = Column(String, nullable=False)
    category = Column(String, nullable=True)
    location = Column(String, nullable=False)
    study_type = Column(String, nullable=True)
    study_description = Column(Text, nullable=True)
    study_phase = Column(String, nullable=True)
    recruitment_status = Column(String, default="Recruiting")

    compensation = Column(String, nullable=True)

    duration = Column(String, nullable=True)
    visit_frequency = Column(String, nullable=True)
    time_commitment = Column(String, nullable=True)
    start_date = Column(String, nullable=True)
    end_date = Column(String, nullable=True)

    eligibility_age_min = Column(Integer, nullable=True)
    eligibility_age_max = Column(Integer, nullable=True)
    eligibility_gender = Column(String, default="All")
    eligibility_conditions = Column(Text, nullable=True)
    eligibility_summary = Column(Text, nullable=True)

    remote_eligible = Column(Boolean, default=False)

    sponsor = Column(String, nullable=True)
    contact_link = Column(String, nullable=True)

    views_count = Column(Integer, default=0)
    saves_count = Column(Integer, default=0)
    passes_count = Column(Integer, default=0)

    clinic = relationship("ClinicProfile", back_populates="trials")
    interactions = relationship(
        "TrialInteraction", back_populates="trial", cascade="all, delete"
    )


class TrialInteraction(Base):
    __tablename__ = "trial_interactions"

    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    trial_id = Column(String, ForeignKey("trials.id"), nullable=False)
    action = Column(String, nullable=False)
    trial_category = Column(String, nullable=True)
    trial_title = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="interactions")
    trial = relationship("Trial", back_populates="interactions")
