# Changelog

This changelog summarizes the development journey of the project by weekly/sprint entries and highlights the key features, fixes, and merges. Use this as the primary evidence of progress for the final report.

Format: Each entry has the week/sprint dates, goals, implemented changes, and representative commit hashes.

---

## Sprint 0 — Initial scaffold (2026-04-07)

- Goal: Create repository and initial project scaffold.
- Changes: Project initialization, basic folder structure.
- Representative commit: `c74ae0d` (Initial commit)

## Sprint 1 — Backend data & services (2026-04-15 → 2026-04-22)

- Goal: Add backend services to fetch and persist trial data; build matching logic.
- Changes:
  - Added ClinicalTrials.gov integration and cleaning helpers (`app/services/`).
  - Implemented models, CRUD helpers, DB session (`app/models.py`, `app/crud.py`, `app/database.py`).
  - Initial matching algorithm and analytics support.
- Representative commits: `4190f56`, `69e77f5`, `b69441c`

## Sprint 2 — Frontend basics & profile flows (2026-04-22 → 2026-04-27)

- Goal: Build participant/clinic flows and profile creation UX.
- Changes:
  - Login pages for clinic and participant roles.
  - Profile creation endpoints wired; frontend scaffolding for profile setup.
- Representative commits: `1d569b0`, `a53cfeb`, `36d40dd`

## Sprint 3 — Trial listing, interactions, and analytics (2026-04-29 → 2026-05-06)

- Goal: Connect frontend to backend trial data and enable interaction tracking.
- Changes:
  - Connected AllTrials page to backend stored trials and details.
  - Implemented save/pass interactions and analytics endpoint `GET /trials/analytics/stats`.
  - Backend fixes for auth and requirements updates.
- Representative commits: `574ace8`, `4ab3e6b`, `fd237cc`

## Sprint 4 — UI polish and filters (2026-05-03 → 2026-05-06)

- Goal: Improve UI, add filters/preferences, and polish styles.
- Changes:
  - Filters and preferences in the UI.
  - Color updates, navigation fixes, button behavior improvements.
  - Updated `requirements.txt` and front-end styling tweaks.
- Representative commits: `ffcb596`, `ed8d9ae`, `f55e016`

## Sprint 5 — Interaction UX & matching refinements (2026-05-18 → 2026-05-21)

- Goal: Improve trial interaction UX and clarify matching output.
- Changes:
  - Added swipe gesture (hold + drag) for trial cards and fixed arrow clicks.
  - Display match ratings and match reasons on trial cards.
  - Fixed saved-trial display and match scoring presentation.
- Representative commits: `de70507`, `51efe87`, `4bd3b41`, `774720a`

## Sprint 6 — Tooltips, branding, and documentation (2026-05-21 → 2026-05-26)

- Goal: Improve UX with tooltips, add branding, and finalize docs.
- Changes:
  - Introduced a reusable `Tooltip` component (Radix-based) and applied across the UI.
  - Added `ErrorBoundary` to prevent runtime white-screens.
  - Integrated mascot/logo assets and updated `HomeHero`, `HomeNavBar`, and sign-in pages.
  - Updated and expanded README files for onboarding and troubleshooting.
  - Misc fixes: routing improvements, password-reset UI, and copy adjustments (title capitalization).
- Representative commits: `afec05d`, `1378718`, `aec23f5`

---

## How to use this changelog

- For full commit history and precise diffs, run:

```bash
git log --pretty=format:'%h %ad %an %s' --date=short
```

- Use the representative hashes above to anchor each sprint's changes in your report; include diffs or PRs where available.

If you want, I can expand each sprint into a full paragraph with file-level details and exact commit lists (one-line per commit). Would you like that expanded version?
