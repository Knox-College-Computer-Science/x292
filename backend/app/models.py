from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    profile = relationship("Profile", back_populates="user", uselist=False)
    saved_trials = relationship("SavedTrial", back_populates="user")
    passed_trials = relationship("PassedTrial", back_populates="user")
    swipe_history = relationship("SwipeHistory", back_populates="user")

class Profile(Base):
    __tablename__ = "profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    age = Column(Integer)
    location_city = Column(String)
    location_state = Column(String)
    location_country = Column(String, default="United States")
    condition = Column(String)
    max_distance_miles = Column(Integer, default=50)
    willing_to_travel = Column(Boolean, default=False)
    preferred_phase = Column(String, nullable=True)
    preferred_type = Column(String, nullable=True)
    privacy_show_age = Column(Boolean, default=True)
    privacy_show_location = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="profile")

class Trial(Base):
    __tablename__ = "trials"
    
    id = Column(Integer, primary_key=True, index=True)
    nct_id = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    brief_summary = Column(Text)
    detailed_description = Column(Text, nullable=True)
    condition = Column(String)
    phase = Column(String, nullable=True)
    status = Column(String)
    sponsor = Column(String, nullable=True)
    location_city = Column(String, nullable=True)
    location_state = Column(String, nullable=True)
    location_country = Column(String, nullable=True)
    location_facility = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    min_age = Column(Integer, nullable=True)
    max_age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    compensation = Column(String, nullable=True)
    is_remote = Column(Boolean, default=False)
    start_date = Column(DateTime, nullable=True)
    completion_date = Column(DateTime, nullable=True)
    eligibility_criteria = Column(Text, nullable=True)
    contact_email = Column(String, nullable=True)
    contact_phone = Column(String, nullable=True)
    cached_at = Column(DateTime, default=datetime.utcnow)
    
    saved_by = relationship("SavedTrial", back_populates="trial")
    passed_by = relationship("PassedTrial", back_populates="trial")
    swipe_history = relationship("SwipeHistory", back_populates="trial")

class SavedTrial(Base):
    __tablename__ = "saved_trials"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    trial_id = Column(Integer, ForeignKey("trials.id"), nullable=False)
    saved_at = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text, nullable=True)
    
    user = relationship("User", back_populates="saved_trials")
    trial = relationship("Trial", back_populates="saved_by")

class PassedTrial(Base):
    __tablename__ = "passed_trials"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    trial_id = Column(Integer, ForeignKey("trials.id"), nullable=False)
    passed_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="passed_trials")
    trial = relationship("Trial", back_populates="passed_by")

class SwipeHistory(Base):
    __tablename__ = "swipe_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    trial_id = Column(Integer, ForeignKey("trials.id"), nullable=False)
    action = Column(String, nullable=False)  # 'save', 'pass', 'view'
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="swipe_history")
    trial = relationship("Trial", back_populates="swipe_history")

class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"
    
    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String, nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    trial_id = Column(Integer, ForeignKey("trials.id"), nullable=True)
    event_metadata = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
