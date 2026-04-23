from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from ..models import Trial, AnalyticsEvent
import logging

logger = logging.getLogger(__name__)

class DataCleaner:
    
    @staticmethod
    def clean_old_trials(db: Session, days: int = 30):
        """Remove trials cached more than X days ago"""
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        deleted = db.query(Trial).filter(
            Trial.cached_at < cutoff_date,
            Trial.status != "RECRUITING"
        ).delete()
        db.commit()
        logger.info(f"Cleaned {deleted} old trials from cache")
        return deleted
    
    @staticmethod
    def update_trial_cache(db: Session, trial_data: dict) -> Trial:
        """Update or create a trial in the cache"""
        existing = db.query(Trial).filter(Trial.nct_id == trial_data["nct_id"]).first()
        
        if existing:
            # Update existing trial
            for key, value in trial_data.items():
                setattr(existing, key, value)
            existing.cached_at = datetime.utcnow()
            db.commit()
            db.refresh(existing)
            return existing
        else:
            # Create new trial
            new_trial = Trial(**trial_data, cached_at=datetime.utcnow())
            db.add(new_trial)
            db.commit()
            db.refresh(new_trial)
            return new_trial
    
    @staticmethod
    def clean_old_analytics(db: Session, days: int = 90):
        """Remove analytics events older than X days"""
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        deleted = db.query(AnalyticsEvent).filter(
            AnalyticsEvent.timestamp < cutoff_date
        ).delete()
        db.commit()
        logger.info(f"Cleaned {deleted} old analytics events")
        return deleted

data_cleaner = DataCleaner()
