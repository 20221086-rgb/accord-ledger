import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")


def _database_uri() -> str:
    url = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'accord_ledger.db'}")
    # Render/Heroku style postgres URLs
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    return url


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
    JWT_SECRET = os.getenv("JWT_SECRET", os.getenv("SECRET_KEY", "dev-jwt-secret"))
    JWT_EXPIRES_SECONDS = int(os.getenv("JWT_EXPIRES_SECONDS", "3600"))
    SQLALCHEMY_DATABASE_URI = _database_uri()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    FLASK_ENV = os.getenv("FLASK_ENV", "development")
    DEBUG = FLASK_ENV == "development"
    ALLOW_DEV_TEST_SIGNATURE = os.getenv(
        "ALLOW_DEV_TEST_SIGNATURE", "true" if FLASK_ENV == "development" else "false"
    ).lower() in ("1", "true", "yes")
    _cors_default = "http://localhost:5173,http://localhost:3000"
    CORS_ORIGINS = [
        o.strip()
        for o in os.getenv("CORS_ORIGIN", _cors_default).split(",")
        if o.strip()
    ]
