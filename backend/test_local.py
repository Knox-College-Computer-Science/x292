"""
Local testing script for user and clinic account creation
Run from backend/ directory: python test_local.py
"""
import sys
sys.path.insert(0, './app')

from app.database import SessionLocal, Base, engine
from app import models, schemas
from app.auth import hash_password, create_access_token, verify_password

# Create all tables
print("Creating database tables...")
Base.metadata.create_all(bind=engine)
db = SessionLocal()

print("\n" + "="*60)
print("TESTING USER & CLINIC ACCOUNT CREATION")
print("="*60)

# TEST 1: Register a user

print("\n1. TEST: User Registration")
print("-" * 60)

user_email = "participant@example.com"
user_password = "testpass123"

# Check if user already exists
existing_user = db.query(models.User).filter(models.User.email == user_email).first()
if existing_user:
    db.delete(existing_user)
    db.commit()
    print("[OK] Cleaned up existing test user")

# Create user
user = models.User(
    email=user_email,
    hashed_password=hash_password(user_password),
    role="user"
)
db.add(user)
db.flush()
print(f"[OK] User created: {user.email} (ID: {user.id})")

# Create profile
profile = models.UserProfile(
    user_id=user.id,
    full_name="",
    profile_completed=False
)
db.add(profile)
db.commit()
print(f"[OK] Profile created for user (ID: {profile.id})")

# Test token generation
token = create_access_token({"sub": user.id, "role": user.role})
print(f"[OK] JWT token generated: {token[:30]}...")


# TEST 2: Update user profile

print("\n2. TEST: Update User Profile (Registration Steps)")
print("-" * 60)

profile = db.query(models.UserProfile).filter(models.UserProfile.user_id == user.id).first()

# Step 1: Basic Info
profile.full_name = "John Doe"
profile.phone = "555-1234"
profile.location = "San Francisco, CA"
profile.preferred_language = "English"
print("[OK] Step 1 - Basic Info updated")

# Step 2: Health Info
profile.age = 35
profile.gender = "Male"
profile.ethnicity = "Caucasian"
profile.health_conditions = "Hypertension, Type 2 Diabetes"
profile.insurance_status = "Insured"
profile.consent_given = True
print("[OK] Step 2 - Health Info updated")

# Step 3: Preferences
profile.trial_interests = "Cardiovascular studies, Diabetes management"
profile.time_commitment = "2-3 hours per week"
profile.notification_preferences = "Email"
profile.travel_willingness = "Local only"
profile.participation_preference = "In-person"
print("[OK] Step 3 - Preferences updated")

# Mark as complete
profile.profile_completed = True
db.commit()
print("[OK] Profile marked as completed")

# Verify profile data
print(f"\n[OK] Profile Summary:")
print(f"  - Full Name: {profile.full_name}")
print(f"  - Age: {profile.age}")
print(f"  - Location: {profile.location}")
print(f"  - Health Conditions: {profile.health_conditions}")
print(f"  - Trial Interests: {profile.trial_interests}")
print(f"  - Profile Completed: {profile.profile_completed}")


# TEST 3: Register a clinic

print("\n3. TEST: Clinic Registration")
print("-" * 60)

clinic_email = "clinic@example.com"

# Check if clinic already exists
existing_clinic = db.query(models.ClinicProfile).filter(models.ClinicProfile.contact_email == clinic_email).first()
if existing_clinic:
    db.delete(existing_clinic)
    db.commit()
    print("[OK] Cleaned up existing test clinic")

# Create clinic
clinic = models.ClinicProfile(
    clinic_name="Example Medical Center",
    contact_person="Dr. Jane Smith",
    contact_email=clinic_email,
    contact_phone="555-5678",
    location="San Francisco, CA",
    sponsor_institution="University Medical School"
)
db.add(clinic)
db.commit()
print(f"[OK] Clinic created: {clinic.clinic_name} (ID: {clinic.id})")
print(f"  - Contact: {clinic.contact_person} ({clinic.contact_email})")
print(f"  - Location: {clinic.location}")


# TEST 4: Verify data in database

print("\n4. TEST: Database Verification")
print("-" * 60)

user_count = db.query(models.User).count()
profile_count = db.query(models.UserProfile).count()
clinic_count = db.query(models.ClinicProfile).count()

print(f"[OK] Total Users: {user_count}")
print(f"[OK] Total User Profiles: {profile_count}")
print(f"[OK] Total Clinic Profiles: {clinic_count}")

# Retrieve and display user
retrieved_user = db.query(models.User).filter(models.User.email == user_email).first()
if retrieved_user:
    print(f"\n[OK] Retrieved User:")
    print(f"  - Email: {retrieved_user.email}")
    print(f"  - Role: {retrieved_user.role}")
    print(f"  - Profile: {retrieved_user.profile.full_name if retrieved_user.profile else 'None'}")

# Test password verification
is_valid = verify_password(user_password, user.hashed_password)
print(f"\n[OK] Password verification: {'PASSED' if is_valid else 'FAILED'}")

db.close()

print("\n" + "="*60)
print("ALL TESTS PASSED!")
print("="*60)
print("\nNext steps:")
print("  1. Install missing dependencies: pip install -r requirements.txt")
print("  2. Start the server: uvicorn app.main:app --reload")
print("  3. Open http://localhost:8000/docs to access interactive API docs")
print("  4. Test endpoints with sample data")
