from datetime import datetime, timezone

from app import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    wallet_address = db.Column(db.String(42), unique=True, nullable=False, index=True)
    display_name = db.Column(db.String(120), nullable=True)
    created_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    def to_dict(self):
        return {
            "wallet_address": self.wallet_address,
            "display_name": self.display_name,
            "created_at": self.created_at.isoformat(),
        }
