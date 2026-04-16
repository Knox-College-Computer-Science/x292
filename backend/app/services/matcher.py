#Start of Recommendation logic

def score_trial(trial: dict, user_condition: str):
    score = 0
    reasons = []

    title = (trial.get("title") or "").lower()
    status = (trial.get("status") or "").upper()

    if user_condition.lower() in title:
        score += 5
        reasons.append("Condition match")

    if status == "RECRUITING":
        score += 3
        reasons.append("Recruiting")

    return {
        "score": score,
        "reasons": reasons
    }