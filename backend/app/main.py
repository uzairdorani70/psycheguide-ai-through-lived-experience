from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.core.database import connect_to_mongo, close_mongo_connection
from fastapi.middleware.cors import CORSMiddleware 
from fastapi import APIRouter, HTTPException, Query

from app.api import users
from app.api import chat
from app.api import dashboard  

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()

app = FastAPI(title="PsycheGuide AI Backend", lifespan=lifespan)

# CORS Setup (Frontend se connection ke liye zaroori)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Register Routers ---
app.include_router(users.router, prefix="/auth", tags=["Authentication"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"]) 

@app.get("/")
def root():
    return {"message": "Welcome to PsycheGuide AI Backend is Running!"}