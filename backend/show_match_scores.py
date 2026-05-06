import argparse

from app.crud import search_trials
from app.database import SessionLocal
from app.services.matcher import match_trials


def build_parser():
    parser = argparse.ArgumentParser(
        description="Show ranked matchmaking scores for a user and condition."
    )
    parser.add_argument("--user-id", required=True, help="User UUID from the users table")
    parser.add_argument("--condition", required=True, help="Condition to search, e.g. Diabetes")
    parser.add_argument("--limit", type=int, default=5, help="How many ranked matches to show")
    parser.add_argument("--location", help="Optional location filter before scoring")
    parser.add_argument("--status", help="Optional recruitment status filter before scoring")
    parser.add_argument("--phase", help="Optional study phase filter before scoring")
    return parser


def main():
    parser = build_parser()
    args = parser.parse_args()

    db = SessionLocal()
    try:
        trials = search_trials(
            db,
            condition=args.condition,
            location=args.location,
            status=args.status,
            phase=args.phase,
            limit=100,
        )
        matches = match_trials(db, args.user_id, trials)

        if not matches:
            print("No scored matches found for those filters.")
            return

        print("\nMatchmaking Scores")
        print("-" * 40)

        for index, (trial, score, reasons) in enumerate(matches[: args.limit], start=1):
            reason_text = ", ".join(reasons) if reasons else "no reasons recorded"
            print(f"{index}. {trial.title}")
            print(f"   Score: {int(score)}/100")
            print(f"   Reasons: {reason_text}")
            print(f"   Condition: {trial.condition}")
            print(f"   Location: {trial.location}")
            print(f"   Status: {trial.recruitment_status}")
            print(f"   Trial ID: {trial.id}")
            print()
    finally:
        db.close()


if __name__ == "__main__":
    main()
