from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routes import trials, users, clinics

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


#THIS MAKES /auth/login,register,me,clinics actually available
app.include_router(trials.router) 
app.include_router(users.router) 
app.include_router(clinics.router)
