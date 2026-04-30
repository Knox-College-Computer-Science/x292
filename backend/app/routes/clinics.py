"""
routes/clinics.py
-----------------
Endpoints:
  POST  /clinics         Register a new clinic profile
  GET   /clinics/{id}    Get clinic details
  PUT   /clinics/{id}    Update clinic profile (clinic owner or admin)

A clinic must register before posting trials.
The clinic_id from this registration is linked to trials in trials.py.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..auth import get_current_user
from .. import models, schemas

router = APIRouter()


@router.post("/clinics", response_model=schemas.ClinicProfileResponse, status_code=201)
def register_clinic(
    payload: schemas.ClinicProfileCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Registers a clinic profile.
    After registration, the clinic can post trials via POST /trials.
    """
    clinic = models.ClinicProfile(**payload.model_dump())
    db.add(clinic)
    db.commit()
    db.refresh(clinic)
    return clinic


@router.get("/clinics/{clinic_id}", response_model=schemas.ClinicProfileResponse)
def get_clinic(clinic_id: str, db: Session = Depends(get_db)):
    clinic = db.query(models.ClinicProfile).filter(models.ClinicProfile.id == clinic_id).first()
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")
    return clinic


@router.put("/clinics/{clinic_id}", response_model=schemas.ClinicProfileResponse)
def update_clinic(
    clinic_id: str,
    payload: schemas.ClinicProfileCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    clinic = db.query(models.ClinicProfile).filter(models.ClinicProfile.id == clinic_id).first()
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")
    if current_user.role not in ("admin", "clinic"):
        raise HTTPException(status_code=403, detail="Not authorized")

    for field, value in payload.model_dump().items():
        setattr(clinic, field, value)
    db.commit()
    db.refresh(clinic)
    return clinic