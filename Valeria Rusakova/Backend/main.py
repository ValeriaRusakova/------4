"""
main.py
-------
The entry point of the server. Run it with:

    uvicorn main:app --reload

It creates the FastAPI app, allows the React site to call it (CORS),
adds a health-check endpoint, and plugs in the conversation routes.
"""

import logging
import os

from dotenv import load_dotenv
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from database import SessionLocal
from routes.conversations import router as conversations_router

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="ValGPT API", description="Simple ChatGPT-style chat server")

# CORS: the browser blocks calls from http://localhost:5173 (React) to
# http://localhost:8000 (this server) unless we explicitly allow it here.
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.exception_handler(SQLAlchemyError)
def handle_database_error(request: Request, error: SQLAlchemyError):
    """If MySQL is down or fails, return a clear message without technical details."""
    logger.error("Database error: %s", type(error).__name__)
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={"detail": "מסד הנתונים אינו זמין כרגע"},
    )


@app.get("/api/health", tags=["Health"])
def health_check():
    """Check that the server is running and can reach MySQL."""
    db = SessionLocal()
    try:
        db.execute(text("SELECT 1"))
    finally:
        db.close()
    return {"status": "ok", "database": "connected"}


app.include_router(conversations_router)
