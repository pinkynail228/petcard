from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from . import models

# Create database tables
# In production, use Alembic for migrations. For MVP/Phase 1 execution, this auto-creation is acceptable.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PetCard API",
    description="Backend for PetCard Telegram Mini App",
    version="1.0.0"
)

# CORS Configuration
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173",
    "*" # For development mostly; restrict in production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from .routes import auth, pets, clinic, telegram
app.include_router(auth.router)
app.include_router(pets.router)
app.include_router(clinic.router)
app.include_router(telegram.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to PetCard API"}

# Basic health check
@app.get("/health")
def health_check():
    return {"status": "ok"}
