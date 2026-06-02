from datetime import datetime, timezone

from app import db


class Record(db.Model):
    """갈등 사건 — Append Only Ledger의 루트 항목."""

    __tablename__ = "records"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    situation = db.Column(db.Text, nullable=False)
    emotion_tags = db.Column(db.String(500), nullable=True)
    creator_wallet = db.Column(db.String(42), nullable=False, index=True)
    record_hash = db.Column(db.String(64), nullable=False)
    created_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    perspectives = db.relationship(
        "Perspective",
        back_populates="record",
        lazy="dynamic",
        order_by="Perspective.created_at",
    )

    def to_dict(self, include_hash=False):
        data = {
            "id": self.id,
            "title": self.title,
            "situation": self.situation,
            "emotion_tags": self.emotion_tags,
            "creator_wallet": self.creator_wallet,
            "created_at": self.created_at.isoformat(),
        }
        if include_hash:
            data["record_hash"] = self.record_hash
        return data
