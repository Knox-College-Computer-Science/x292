# 🧪 Testing Guide: User & Clinic Account Creation

## ✅ What You Can Test Now (Without Waiting for Teammates)

Your backend is ready to test these features:
- ✅ **User Registration** - Create accounts with email/password
- ✅ **User Login** - Authenticate and get JWT tokens
- ✅ **Profile Management** - Update user profiles (3-step registration)
- ✅ **Clinic Registration** - Create clinic accounts
- ✅ **Privacy Settings** - Toggle which fields are used for matching
- ✅ **Database Creation** - SQLite database auto-creates on startup

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Run Local Tests

Test the database layer without starting the server:

```bash
python test_local.py
```

This will:
- Create all database tables
- Test user registration flow
- Test profile updates (all 3 registration steps)
- Test clinic registration
- Verify password hashing and JWT tokens
- Display a summary of created records

### 3. Start the Backend Server

```bash
uvicorn app.main:app --reload
```

The server runs on `http://localhost:8000`

**Interactive API Docs:** Open `http://localhost:8000/docs` in your browser

---

## 📝 Testing Endpoints with cURL

### 1️⃣ Register a User

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepass123",
    "role": "user"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

💡 **Copy the `access_token` for the next requests!**

---

### 2️⃣ Login (Get Token)

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepass123"
  }'
```

---

### 3️⃣ Update User Profile (Step 1: Basic Info)

```bash
curl -X PUT http://localhost:8000/api/v1/users/me \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN_HERE>" \
  -d '{
    "full_name": "John Doe",
    "phone": "555-1234",
    "location": "San Francisco, CA",
    "preferred_language": "English"
  }'
```

---

### 4️⃣ Update User Profile (Step 2: Health Info)

```bash
curl -X PUT http://localhost:8000/api/v1/users/me \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN_HERE>" \
  -d '{
    "age": 35,
    "gender": "Male",
    "ethnicity": "Caucasian",
    "health_conditions": "Hypertension, Type 2 Diabetes",
    "insurance_status": "Insured",
    "consent_given": true
  }'
```

---

### 5️⃣ Update User Profile (Step 3: Preferences & Complete)

```bash
curl -X PUT http://localhost:8000/api/v1/users/me \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN_HERE>" \
  -d '{
    "trial_interests": "Cardiovascular studies, Diabetes management",
    "time_commitment": "2-3 hours per week",
    "notification_preferences": "Email",
    "travel_willingness": "Local only",
    "participation_preference": "In-person",
    "profile_completed": true
  }'
```

---

### 6️⃣ Get Current User Profile

```bash
curl -X GET http://localhost:8000/api/v1/users/me \
  -H "Authorization: Bearer <YOUR_TOKEN_HERE>"
```

**Response:**
```json
{
  "id": "12345-uuid",
  "email": "john@example.com",
  "full_name": "John Doe",
  "age": 35,
  "location": "San Francisco, CA",
  "health_conditions": "Hypertension, Type 2 Diabetes",
  "profile_completed": true,
  ...
}
```

---

### 7️⃣ Register a Clinic

```bash
curl -X POST http://localhost:8000/api/v1/clinics \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN_HERE>" \
  -d '{
    "clinic_name": "Example Medical Center",
    "contact_person": "Dr. Jane Smith",
    "contact_email": "clinic@example.com",
    "contact_phone": "555-5678",
    "location": "San Francisco, CA",
    "sponsor_institution": "University Medical School"
  }'
```

---

### 8️⃣ Get Clinic Details

```bash
curl -X GET http://localhost:8000/api/v1/clinics/<CLINIC_ID> \
  -H "Authorization: Bearer <YOUR_TOKEN_HERE>"
```

---

### 9️⃣ Get Privacy Settings

```bash
curl -X GET http://localhost:8000/api/v1/users/me/privacy \
  -H "Authorization: Bearer <YOUR_TOKEN_HERE>"
```

---

### 🔟 Update Privacy Settings (Control Data Sharing)

```bash
curl -X PUT http://localhost:8000/api/v1/users/me/privacy \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN_HERE>" \
  -d '{
    "matching_fields_enabled": {
      "location": true,
      "health_conditions": false,
      "age": true,
      "gender": false,
      "participation_preference": true
    }
  }'
```

---

## 🧪 Using Postman

1. **Create a new collection** named "Clinical Trials API"

2. **Create requests** for each endpoint above

3. **Add Authorization Header** to protected routes:
   - Header: `Authorization`
   - Value: `Bearer <your_token>`

4. **Set Collection Variables:**
   - `base_url` = `http://localhost:8000/api/v1`
   - `token` = (paste token from register/login response)
   - `clinic_id` = (paste clinic ID from registration response)

5. **Use in requests:**
   - URL: `{{base_url}}/users/me`
   - Header: `Authorization: Bearer {{token}}`

---

## 📊 Database

**File Location:** `backend/app.db` (SQLite)

**Tables Created:**
- `users` - User accounts (email, password, role)
- `user_profiles` - Extended profiles (health info, preferences, privacy settings)
- `clinic_profiles` - Clinic/researcher accounts
- `trials` - Clinical trial records (created when your teammates provide the schema)
- `trial_interactions` - User actions on trials (views, saves, passes)

**Reset Database:**
```bash
# Delete the database file
rm app/app.db

# Restart the server — it will auto-create tables
uvicorn app.main:app --reload
```

---

## ✨ Key Features You Can Verify

### ✅ User Registration
- Email validation
- Password hashing (bcrypt)
- JWT token generation
- Automatic UserProfile creation

### ✅ 3-Step Registration
- Step 1: Basic info (name, phone, location)
- Step 2: Health info (age, gender, conditions, insurance, consent)
- Step 3: Preferences (trial interests, time commitment, participation format)
- Can update any step independently
- Mark as complete when all steps done

### ✅ Privacy Controls
- Toggle which fields are shared with matching algorithm
- Default: location, health_conditions, age, gender, participation_preference
- Can disable specific fields without deleting data

### ✅ Clinic Registration
- Create clinic profiles
- Link to trials (blocking until teammates add Trial schema)

### ✅ Security
- Passwords hashed with bcrypt
- JWT tokens with 60-minute expiration
- Protected routes require valid token
- Email uniqueness enforced

---

## ⚠️ Known Limitations (Waiting for Teammates)

❌ **Cannot fully test yet:**
- Trial creation (`POST /trials`)
- Trial browsing/filtering (`GET /trials`)
- Trial interactions/swiping (`POST /interactions`)
- Trial matching algorithm
- Analytics dashboard

These require the **Trial and Trial Interaction schemas** that your teammates will provide.

---

## 🐛 Troubleshooting

### Import Error: "No module named 'app'"
```bash
cd backend
# Run from the backend directory
uvicorn app.main:app --reload
```

### Token Invalid / Expired
- Generate a new token: `POST /auth/login`
- Copy the `access_token` value
- Add to request: `Authorization: Bearer <token>`

### Database Locked Error
- Close all other connections to the database
- Delete `app/app.db` and restart

### Port 8000 Already in Use
```bash
uvicorn app.main:app --reload --port 8001
```

---

## 📌 Next Steps

1. ✅ **Run `python test_local.py`** to verify setup
2. ✅ **Start server** with `uvicorn app.main:app --reload`
3. ✅ **Test endpoints** with the curl examples above
4. ✅ **Share database schema** with teammates when ready
5. ⏳ **Wait for Trial schema** to test full matching flow

---

**Happy testing! 🎉**
