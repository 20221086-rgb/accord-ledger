from datetime import datetime, timezone

from app import db

PERSPECTIVE_TYPES = ("me", "other", "correction")


class Perspective(db.Model):
    """입장·정정 기록 — 수정/삭제 없이 타임라인에만 추가."""

    __tablename__ = "perspectives"

    id = db.Column(db.Integer, primary_key=True)
    record_id = db.Column(
        db.Integer, db.ForeignKey("records.id"), nullable=False, index=True
    )
    type = db.Column(db.String(20), nullable=False)
    content = db.Column(db.Text, nullable=False)
    author_wallet = db.Column(db.String(42), nullable=False)
    previous_hash = db.Column(db.String(64), nullable=False)
    hash = db.Column("perspective_hash", db.String(64), nullable=False)
    created_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    record = db.relationship("Record", back_populates="perspectives")

    def to_dict(self, include_hash=False):
        data = {
            "id": self.id,
            "record_id": self.record_id,
            "type": self.type,
            "content": self.content,
            "author_wallet": self.author_wallet,
            "created_at": self.created_at.isoformat(),
        }
        if include_hash:
            data["previous_hash"] = self.previous_hash
            data["hash"] = self.hash
        return data
