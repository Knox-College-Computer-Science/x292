from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routes import trials as trials_router
from .routes import users as users_router
from .routes import clinics as clinics_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Class Project API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


    
app.include_router(trials_router.router)
app.include_router(users_router.router)
app.include_router(clinics_router.router)

