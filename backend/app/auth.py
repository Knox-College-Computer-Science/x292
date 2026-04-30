"""
auth.py
-------
JWT authentication helpers.
Used by routes to protect endpoints and identify the current user.

Flow:
  1. POST /auth/register  → hash password → create User row
  2. POST /auth/login     → verify password → return JWT token
  3. Protected routes     → client sends  Authorization: Bearer <token>
                         → get_current_user() decodes JWT → returns User
"""

import os
import base64
import hashlib
import hmac
import secrets
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from .database import get_db
from . import models

SECRET_KEY = os.getenv("SECRET_KEY", "change-this-secret")
ALGORITHM  = os.getenv("ALGORITHM", "HS256")
EXPIRE_MIN = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

oauth2_scheme  = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")
PBKDF2_ITERATIONS = 260_000


# ── Password helpers ────────────────────────────────────────────────────────

def hash_password(plain: str) -> str:
    """
    PBKDF2-SHA256 password hash format:
      pbkdf2_sha256$<iterations>$<salt_b64>$<digest_b64>
    """
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        plain.encode("utf-8"),
        salt,
        PBKDF2_ITERATIONS,
    )
    salt_b64 = base64.b64encode(salt).decode("utf-8")
    digest_b64 = base64.b64encode(digest).decode("utf-8")
    return f"pbkdf2_sha256${PBKDF2_ITERATIONS}${salt_b64}${digest_b64}"


def verify_password(plain: str, hashed: str) -> bool:
    # Backward compatible check for the new PBKDF2 format.
    if hashed.startswith("pbkdf2_sha256$"):
        try:
            _, iterations, salt_b64, digest_b64 = hashed.split("$", 3)
            salt = base64.b64decode(salt_b64.encode("utf-8"))
            expected = base64.b64decode(digest_b64.encode("utf-8"))
            computed = hashlib.pbkdf2_hmac(
                "sha256",
                plain.encode("utf-8"),
                salt,
                int(iterations),
            )
            return hmac.compare_digest(computed, expected)
        except Exception:
            return False

    # Backward compatibility path for existing bcrypt hashes when available.
    if hashed.startswith("$2"):
        try:
            from passlib.context import CryptContext  # Optional dependency
            legacy_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
            return legacy_context.verify(plain, hashed)
        except Exception:
            return False

    return False


# ── JWT helpers ─────────────────────────────────────────────────────────────

def create_access_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=EXPIRE_MIN)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )


# ── FastAPI dependency ───────────────────────────────────────────────────────

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> models.User:
    """
    Inject as a dependency into any protected route:
        current_user: User = Depends(get_current_user)
    Returns the authenticated User ORM object.
    """
    payload = decode_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def require_admin(current_user: models.User = Depends(get_current_user)) -> models.User:
    """
    Dependency that requires the user to have role='admin'.
    Use for analytics dashboard and admin-only endpoints.
    """
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user
