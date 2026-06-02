"""Create all SQLAlchemy tables (idempotent)."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app import create_app, db
from app.models import Perspective, Record, User  # noqa: F401

app = create_app()
with app.app_context():
    db.create_all()
    print("Database tables ready.")
