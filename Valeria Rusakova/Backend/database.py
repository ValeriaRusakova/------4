"""
database.py
-----------
Connects the server to the MySQL database.

Everything else in the project imports from here:
- engine        -> the actual connection to MySQL
- SessionLocal  -> creates a "session" (a conversation with the DB) per request
- Base          -> parent class for our table models (see models.py)
- get_db()      -> gives each API request its own DB session and closes it afterwards
"""

import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Read the secret settings from the .env file (never write passwords in code!)
load_dotenv()

DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "chatgpt_db")

# The connection address. "mysql+pymysql" = use MySQL through the PyMySQL driver.
# charset=utf8mb4 is needed so Hebrew text is saved correctly.
DATABASE_URL = (
    f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}?charset=utf8mb4"
)

# pool_pre_ping=True checks the connection is still alive before using it.
# init_command: save every time in UTC. The browser converts it to the user's local time.
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    connect_args={"init_command": "SET time_zone = '+00:00'"},
)

SessionLocal = sessionmaker(bind=engine, autoflush=False)

Base = declarative_base()


def get_db():
    """Open a database session for one request, and always close it at the end."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
