# Class Project Starter

Full-stack class project starter:

- FastAPI + SQLite backend
- React + TypeScript (Vite) frontend

## Who this is for

If you are new to this project, this README gives you everything needed to:

- run the app locally
- understand where code lives
- make and verify changes safely

## Project structure

- backend/ — API, models, services, database code
- frontend/ — React app
- TESTING_GUIDE.md — automated testing notes
- MANUAL_TESTING_GUIDE.md — manual QA checklist

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm 9+

## Quick start

### 1) Backend

From the repo root:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
cd backend
uvicorn app.main:app --reload
```

Backend runs at `http://127.0.0.1:8000`.

### 2) Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Daily development workflow

1. Start backend and frontend in separate terminals.
2. Make your code changes.
3. Verify backend still runs (`/health`) and frontend still loads.
4. Run tests/checks before committing.

### Backend checks

From `backend/`:

```bash
pytest
```

### Frontend checks

From `frontend/`:

```bash
npm run build
```

## Where to make changes

- Backend API routes: `backend/app/routes/`
- Backend domain logic/services: `backend/app/services/`
- Backend models/schemas: `backend/app/models.py` and `backend/app/schemas.py`
- Frontend pages/components: `frontend/src/components/`
- Frontend API client/types: `frontend/src/api.ts`

## API and docs

- Health check: `http://127.0.0.1:8000/health`
- Interactive API docs: `http://127.0.0.1:8000/docs`

## Troubleshooting

- If frontend cannot reach backend, confirm backend is running on `127.0.0.1:8000`.
- If dependency install fails, delete and recreate virtual env / reinstall npm packages.
- If database state is broken during local testing, remove `backend/app_v2.db` and restart backend.

## Notes

- Frontend API base URL is set in `frontend/src/api.ts`.
- Backend CORS allows `http://localhost:5173` and `http://127.0.0.1:5173`.
- SQLite DB defaults to `backend/app_v2.db` (override with `DATABASE_FILENAME`).
