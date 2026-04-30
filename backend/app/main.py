import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import BASE_DIR, Base, engine
from .routes import trials as trials_router
from .routes import users as users_router
from .schema_compat import migrate_legacy_users_table

migrate_legacy_users_table(BASE_DIR / "app.db")

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Class Project API")

extra_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "").split(",")
    if origin.strip()
]

allow_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
    *extra_origins,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


    
app.include_router(trials_router.router)
app.include_router(users_router.router)
