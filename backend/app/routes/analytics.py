from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta
from ..database import get_db
from ..models import User, Trial, SavedTrial, PassedTrial, SwipeHistory, AnalyticsEvent, Profile
from ..schemas import AnalyticsOverview
from ..auth import get_current_user

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/overview", response_model=AnalyticsOverview)
def get_analytics_overview(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get platform analytics overview (for admin dashboard)"""
    
    # Basic counts
    total_users = db.query(func.count(User.id)).scalar()
    total_trials = db.query(func.count(Trial.id)).scalar()
    total_saves = db.query(func.count(SavedTrial.id)).scalar()
    total_passes = db.query(func.count(PassedTrial.id)).scalar()
    
    # Average swipes per user
    total_swipes = db.query(func.count(SwipeHistory.id)).scalar()
    avg_swipes = total_swipes / total_users if total_users > 0 else 0
    
    # Top conditions
    top_conditions = (
        db.query(
            Profile.condition,
            func.count(Profile.id).label("count")
        )
        .group_by(Profile.condition)
        .order_by(desc("count"))
        .limit(10)
        .all()
    )
    
    top_conditions_list = [
        {"condition": cond, "count": count}
        for cond, count in top_conditions
    ]
    
    # Recent activity (last 24 hours)
    yesterday = datetime.utcnow() - timedelta(days=1)
    recent_events = (
        db.query(AnalyticsEvent)
        .filter(AnalyticsEvent.timestamp >= yesterday)
        .order_by(desc(AnalyticsEvent.timestamp))
        .limit(50)
        .all()
    )
    
    recent_activity = [
        {
            "event_type": event.event_type,
            "timestamp": event.timestamp.isoformat(),
            "user_id": event.user_id
        }
        for event in recent_events
    ]
    
    return {
        "total_users": total_users,
        "total_trials": total_trials,
        "total_saves": total_saves,
        "total_passes": total_passes,
        "avg_swipes_per_user": round(avg_swipes, 2),
        "top_conditions": top_conditions_list,
        "recent_activity": recent_activity
    }

@router.get("/user-insights")
def get_user_insights(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get insights about current user's behavior"""
    
    from ..services.matcher import matching_engine
    insights = matching_engine.adapt_recommendations(db, current_user)
    
    return insights
