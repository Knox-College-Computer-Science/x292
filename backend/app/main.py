from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routes import auth_router, profile_router, trials_router, analytics_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Medical Trial Matcher API",
    description="Match patients with relevant clinical trials",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(trials_router)
app.include_router(analytics_router)

@app.get("/")
def root():
    return {
        "message": "Medical Trial Matcher API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
