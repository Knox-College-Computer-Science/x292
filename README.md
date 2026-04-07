# Class Project Starter

A full-stack starter codebase with:

- FastAPI + SQLite backend
- React + TypeScript frontend

## Structure

- backend/ — Python API and database models
- frontend/ — Vite React client

## Backend setup

1. Create and activate a Python virtual environment in backend/.
2. Install dependencies:
   - pip install -r requirements.txt
3. Run the API from backend/:
   - uvicorn app.main:app --reload

The API will be available at http://localhost:8000.

## Frontend setup

1. Install dependencies in frontend/.
2. Run the client:
   - npm run dev

The frontend will be available at http://localhost:5173.

## Notes

- SQLite data is stored in backend/app.db.
- Update the frontend API URL in frontend/src/api.ts if the backend port changes.
