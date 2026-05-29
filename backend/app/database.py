from pathlib import Path
import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

BASE_DIR = Path(__file__).resolve().parent.parent
DATABASE_FILENAME = os.getenv("DATABASE_FILENAME", "app_v2.db")
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / DATABASE_FILENAME}")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Dependency for injecting database session into FastAPI routes"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
