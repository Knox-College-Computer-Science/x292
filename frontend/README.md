# Frontend

React + TypeScript (Vite) app for the class project.

## What this frontend does

- Role-based participant/clinic flows
- Trial browsing, filtering, swiping, and detail views
- Profile setup and analytics views
- API integration with the FastAPI backend

## Setup and run

From `frontend/`:

```bash
npm install
npm run dev
```

App URL: `http://localhost:5173`

## Other scripts

From `frontend/`:

```bash
npm run build
npm run preview
```

## Code map

- `src/App.tsx` — app-level navigation/state wiring
- `src/api.ts` — all backend request functions + API types
- `src/components/` — UI pages/cards/controls
- `src/styles.css` — shared/global styling
- `src/main.tsx` — React bootstrap + providers

## Backend integration

- Frontend API base URL is set in `src/api.ts`.
- Expected backend URL is `http://127.0.0.1:8000`.

## Making UI changes safely

1. Keep component logic in `.tsx` and styling in paired `.css` files.
2. Reuse shared components (buttons, tooltip wrapper, cards) when possible.
3. Verify both participant and clinic views after UI edits.
4. Run `npm run build` before committing.

## Troubleshooting

- Blank page: check browser console and terminal for runtime errors.
- API request failures: verify backend is running and API URL matches.
- Dependency issues: run `npm install` again in `frontend/`.
