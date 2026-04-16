from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import Base, SessionLocal, engine
from .services.clinical_api import fetch_trials
from .services.cleaner import clean_trial

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Class Project API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}

# Fetch clinical trial data from ClinicalTrials.gov based on a condition
@app.get("/trials")
def get_trials(condition: str = "diabetes"):
    # Get raw trial data from the external API
    raw_data = fetch_trials(condition)

    # Pull out the list of studies from the response
    studies = raw_data.get("studies", [])

    # Clean each study into a simpler format for the frontend
    cleaned = [clean_trial(study) for study in studies]

    # Return the cleaned trial list as JSON
    return cleaned

@app.get("/items", response_model=list[schemas.TodoItemRead])
def list_items(db: Session = Depends(get_db)):
    return crud.get_items(db)


@app.post("/items", response_model=schemas.TodoItemRead, status_code=201)
def create_item(item_in: schemas.TodoItemCreate, db: Session = Depends(get_db)):
    return crud.create_item(db, item_in)


@app.patch("/items/{item_id}", response_model=schemas.TodoItemRead)
def update_item(item_id: int, item_in: schemas.TodoItemUpdate, db: Session = Depends(get_db)):
    item = crud.get_item(db, item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return crud.update_item(db, item, item_in)


@app.delete("/items/{item_id}", status_code=204)
def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = crud.get_item(db, item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    crud.delete_item(db, item)
