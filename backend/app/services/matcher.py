from typing import Dict, List, Tuple

from sqlalchemy.orm import Session

from .. import crud, models


def _condition_match(profile_condition: str, trial_condition: str) -> int:
    if not profile_condition or not trial_condition:
        return 0

    return (
        1
        if any(
            cond.strip().lower() in trial_condition.lower()
            for cond in profile_condition.split(",")
            if cond.strip()
        )
        else 0
    )


def _location_match(profile_location: str, trial_location: str) -> int:
    if not profile_location or not trial_location:
        return 0

    return 1 if profile_location.lower() in trial_location.lower() else 0


def _recruiting_match(recruitment_status: str) -> int:
    if not recruitment_status:
        return 0

    return 1 if recruitment_status.upper() == "RECRUITING" else 0


def _remote_match(participation_preference: str, remote_eligible: bool) -> int:
    if not remote_eligible:
        return 0

    if participation_preference in [None, "", "Either", "Remote"]:
        return 1

    return 0


def _age_compatible(profile: models.UserProfile, trial: models.Trial) -> bool:
    preferred_min = profile.age_range_min
    preferred_max = profile.age_range_max

    if preferred_min is None and preferred_max is None:
        return True

    trial_min = trial.eligibility_age_min
    trial_max = trial.eligibility_age_max

    if preferred_min is not None and trial_max is not None and trial_max < preferred_min:
        return False
    if preferred_max is not None and trial_min is not None and trial_min > preferred_max:
        return False
    return True


def _build_metrics(profile: models.UserProfile, trial: models.Trial) -> Dict[str, int]:
    enabled = profile.matching_fields_enabled or {}
    use_condition = enabled.get("health_conditions", True)
    use_location = enabled.get("location", True)
    use_participation = enabled.get("participation_preference", True)

    return {
        "condition": _condition_match(profile.health_conditions, trial.condition)
        if use_condition
        else 0,
        "location": _location_match(profile.location, trial.location) if use_location else 0,
        "recruiting": _recruiting_match(trial.recruitment_status),
        "remote": _remote_match(profile.participation_preference, trial.remote_eligible)
        if use_participation
        else 0,
    }


def _dominates(a: Dict[str, int], b: Dict[str, int]) -> bool:
    return all(a[key] >= b[key] for key in a) and any(a[key] > b[key] for key in a)


def _pareto_front(
    trial_metrics: List[Tuple[models.Trial, Dict[str, int]]]
) -> List[Tuple[models.Trial, Dict[str, int]]]:
    front = []

    for i, (trial_a, metrics_a) in enumerate(trial_metrics):
        dominated = False

        for j, (trial_b, metrics_b) in enumerate(trial_metrics):
            if i == j:
                continue

            if _dominates(metrics_b, metrics_a):
                dominated = True
                break

        if not dominated:
            front.append((trial_a, metrics_a))

    return front


def _score_from_metrics(metrics: Dict[str, int]) -> Tuple[float, List[str]]:
    score = 0.0
    reasons = []

    if metrics["condition"]:
        score += 40
        reasons.append("condition match")

    if metrics["location"]:
        score += 30
        reasons.append("location match")

    if metrics["recruiting"]:
        score += 20
        reasons.append("actively recruiting")

    if metrics["remote"]:
        score += 10
        reasons.append("remote eligible")

    return score, reasons


def match_trials(
    db: Session,
    user_id: str,
    trials: List[models.Trial],
) -> List[Tuple[models.Trial, float, List[str]]]:
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user or not user.profile:
        raise Exception("User profile not found")

    profile = user.profile
    candidate_trials = []

    for trial in trials:
        interaction = crud.get_user_interaction(db, user_id, trial.id)
        if interaction and interaction.action in ["save", "pass"]:
            continue

        if not _age_compatible(profile, trial):
            continue

        if profile.preferred_recruitment_status and profile.preferred_recruitment_status.lower() != "any":
            if trial.recruitment_status.lower() != profile.preferred_recruitment_status.lower():
                continue

        if profile.preferred_study_phase and trial.study_phase:
            if profile.preferred_study_phase.lower() not in trial.study_phase.lower():
                continue

        if profile.compensation_required and not trial.compensation:
            continue

        metrics = _build_metrics(profile, trial)
        if sum(metrics.values()) > 0:
            candidate_trials.append((trial, metrics))

    pareto_trials = _pareto_front(candidate_trials)

    matched_trials = []
    for trial, metrics in pareto_trials:
        score, reasons = _score_from_metrics(metrics)
        matched_trials.append((trial, score, reasons))

    matched_trials.sort(key=lambda x: x[1], reverse=True)
    return matched_trials


def get_matched_trials(db: Session, user_id: str, condition: str) -> List[models.Trial]:
    trials = crud.search_trials(db, condition=condition, limit=100)
    scored = match_trials(db, user_id, trials)
    return [trial for trial, _score, _reasons in scored]
