from typing import List, Dict
from sqlalchemy.orm import Session
from math import radians, cos, sin, asin, sqrt
from ..models import Trial, Profile, User, SwipeHistory, SavedTrial, PassedTrial

class MatchingEngine:
    
    @staticmethod
    def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate distance between two coordinates in miles using Haversine formula"""
        lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
        c = 2 * asin(sqrt(a))
        miles = 3959 * c  # Earth radius in miles
        return miles
    
    @staticmethod
    def get_recommendations(
        db: Session,
        user: User,
        limit: int = 20,
        filters: Dict = None
    ) -> List[Dict]:
        """Get recommended trials for a user with match scoring"""
        
        profile = db.query(Profile).filter(Profile.user_id == user.id).first()
        if not profile:
            return []
        
        # Get trials user hasn't interacted with
        interacted_trial_ids = (
            db.query(SwipeHistory.trial_id)
            .filter(SwipeHistory.user_id == user.id)
            .distinct()
            .subquery()
        )
        
        query = db.query(Trial).filter(
            Trial.status == "RECRUITING",
            ~Trial.id.in_(interacted_trial_ids)
        )
        
        # Apply filters
        if filters:
            if filters.get("condition"):
                query = query.filter(Trial.condition.ilike(f"%{filters['condition']}%"))
            if filters.get("phase"):
                query = query.filter(Trial.phase == filters["phase"])
            if filters.get("is_remote") is not None:
                query = query.filter(Trial.is_remote == filters["is_remote"])
            if filters.get("gender"):
                query = query.filter(
                    (Trial.gender == filters["gender"]) | (Trial.gender == "ALL")
                )
        
        trials = query.limit(200).all()  # Get more for scoring
        
        # Score and rank trials
        scored_trials = []
        for trial in trials:
            score, reasons = MatchingEngine._score_trial(trial, profile)
            distance = None
            
            # Calculate distance if both have coordinates
            if trial.latitude and trial.longitude:
                # Note: We'd need geocoding for user location in production
                # For now, using state matching as proxy
                distance = 0 if trial.location_state == profile.location_state else 100
            
            scored_trials.append({
                "trial": trial,
                "score": score,
                "match_reasons": reasons,
                "distance_miles": distance
            })
        
        # Sort by score (highest first) and return top matches
        scored_trials.sort(key=lambda x: x["score"], reverse=True)
        return scored_trials[:limit]
    
    @staticmethod
    def _score_trial(trial: Trial, profile: Profile) -> tuple:
        """Score a trial based on how well it matches the user profile"""
        score = 0
        reasons = []
        
        # Condition match (highest priority)
        if profile.condition.lower() in trial.condition.lower():
            score += 100
            reasons.append(f"Matches your condition: {profile.condition}")
        
        # Age eligibility
        if trial.min_age and trial.max_age:
            if trial.min_age <= profile.age <= trial.max_age:
                score += 50
                reasons.append("You meet the age requirements")
        elif not trial.min_age and not trial.max_age:
            score += 25  # No age restriction
        
        # Location match
        if trial.location_state == profile.location_state:
            score += 40
            reasons.append(f"Located in {profile.location_state}")
        
        # Remote eligibility
        if trial.is_remote:
            score += 30
            reasons.append("Available remotely")
        
        # Phase preference
        if profile.preferred_phase and trial.phase == profile.preferred_phase:
            score += 20
            reasons.append(f"Matches your preferred phase: {trial.phase}")
        
        # Compensation
        if trial.compensation:
            score += 15
            reasons.append("Offers compensation")
        
        # Recently started (more likely to be actively recruiting)
        if trial.start_date:
            score += 10
        
        return score, reasons
    
    @staticmethod
    def adapt_recommendations(db: Session, user: User) -> Dict:
        """Analyze user behavior to improve future recommendations"""
        
        # Get user's swipe history
        saves = db.query(SavedTrial).filter(SavedTrial.user_id == user.id).all()
        passes = db.query(PassedTrial).filter(PassedTrial.user_id == user.id).all()
        
        # Analyze patterns
        saved_phases = [s.trial.phase for s in saves if s.trial.phase]
        saved_locations = [s.trial.location_state for s in saves if s.trial.location_state]
        
        insights = {
            "total_saves": len(saves),
            "total_passes": len(passes),
            "preferred_phases": list(set(saved_phases)),
            "preferred_states": list(set(saved_locations)),
            "engagement_rate": len(saves) / (len(saves) + len(passes)) if (len(saves) + len(passes)) > 0 else 0
        }
        
        return insights

matching_engine = MatchingEngine()
