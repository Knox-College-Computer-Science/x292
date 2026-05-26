# Backend

FastAPI + SQLite API for the class project.

## What this backend does

- Handles auth (register/login)
- Stores user and clinic profiles
- Fetches and caches trial data
- Tracks trial interactions and analytics

## Setup

From the repo root:

```bash
python3 -m venv .venv
source .venv/bin/activate
cd backend
pip install -r requirements.txt
```

## Run

From `backend/`:

```bash
uvicorn app.main:app --reload
```

Server URL: `http://127.0.0.1:8000`

API docs: `http://127.0.0.1:8000/docs`

## Test

From `backend/`:

```bash
pytest
```

Optional local smoke test:

```bash
python test_local.py
```

## Code map

- `app/main.py` — app bootstrap, CORS, router registration
- `app/routes/` — HTTP endpoints
- `app/services/` — external API + matching logic
- `app/crud.py` — DB query helpers
- `app/models.py` — SQLAlchemy models
- `app/schemas.py` — request/response schemas
- `app/database.py` — DB engine/session setup

## Common endpoint paths

- `POST /auth/register`
- `POST /auth/login`
- `GET /users/me`
- `PUT /users/me`
- `GET /trials/`
- `GET /trials/{trial_id}`
- `POST /trials/{trial_id}/save`
- `POST /trials/{trial_id}/pass`
- `GET /trials/analytics/stats`

## Database notes

- SQLite file defaults to `backend/app_v2.db`.
- On startup, tables are created if missing.
- New columns in existing tables are auto-added on startup.

Reset local DB:

```bash
rm app_v2.db
uvicorn app.main:app --reload
```

## Environment variables

- `DATABASE_FILENAME` (default: `app_v2.db`)
- `SECRET_KEY` (default: `change-this-secret`)
- `ALGORITHM` (default: `HS256`)
- `ACCESS_TOKEN_EXPIRE_MINUTES` (default: `60`)

## Troubleshooting

- `401 Invalid credentials`: verify email/password and token usage.
- CORS issues in browser: ensure frontend runs on `localhost:5173`.
- Missing package errors: reactivate `.venv` and reinstall `requirements.txt`.
