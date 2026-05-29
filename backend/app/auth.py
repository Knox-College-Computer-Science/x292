import base64
import hashlib
import hmac
import os
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from . import models
from .database import get_db

SECRET_KEY = os.getenv("SECRET_KEY", "change-this-secret")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
EXPIRE_MIN = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
oauth2_optional_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)
PBKDF2_ITERATIONS = 260_000


def hash_password(plain: str) -> str:
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

    if hashed.startswith("$2"):
        try:
            from passlib.context import CryptContext

            legacy_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
            return legacy_context.verify(plain, hashed)
        except Exception:
            return False

    return False


def create_access_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.now(timezone.utc) + timedelta(minutes=EXPIRE_MIN)
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


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> models.User:
    payload = decode_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def get_current_user_optional(
    token: str | None = Depends(oauth2_optional_scheme), db: Session = Depends(get_db)
) -> models.User | None:
    if not token:
        return None
    try:
        payload = decode_token(token)
    except HTTPException:
        return None

    user_id = payload.get("sub")
    if not user_id:
        return None

    return db.query(models.User).filter(models.User.id == user_id).first()


def require_admin(current_user: models.User = Depends(get_current_user)) -> models.User:
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

#requirement that a user is a clinic (currently unused)
def require_clinic(current_user: models.User = Depends(get_current_user)) -> models.User:
    if current_user.role not in ("clinic", "admin"):
        raise HTTPException(status_code=403, detail="Clinic access required")
    return current_user