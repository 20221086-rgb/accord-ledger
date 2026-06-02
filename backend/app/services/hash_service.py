import hashlib
import json
from datetime import datetime, timezone


class HashService:
    """SHA-256 해시 체인 — Record → Perspective 순서로 무결성 연결."""

    @staticmethod
    def _iso_timestamp(value: datetime) -> str:
        """저장/검증 시 동일한 UTC Z 포맷을 사용 (SQLite naive datetime 대응)."""
        if value.tzinfo is not None:
            value = value.astimezone(timezone.utc).replace(tzinfo=None)
        return value.replace(microsecond=0).isoformat() + "Z"

    @staticmethod
    def calculate_hash(payload: dict) -> str:
        normalized = json.dumps(payload, sort_keys=True, separators=(",", ":"))
        return hashlib.sha256(normalized.encode("utf-8")).hexdigest()

    @classmethod
    def build_record_payload(
        cls,
        *,
        title: str,
        situation: str,
        emotion_tags: str | None,
        creator_wallet: str,
        created_at: datetime,
        previous_hash: str = "",
    ) -> dict:
        return {
            "title": title,
            "situation": situation,
            "emotion_tags": emotion_tags or "",
            "creator_wallet": creator_wallet.lower(),
            "created_at": cls._iso_timestamp(created_at),
            "previous_hash": previous_hash,
        }

    @classmethod
    def build_perspective_payload(
        cls,
        *,
        record_id: int,
        perspective_type: str,
        content: str,
        author_wallet: str,
        previous_hash: str,
        created_at: datetime,
    ) -> dict:
        return {
            "record_id": record_id,
            "type": perspective_type,
            "content": content,
            "author_wallet": author_wallet.lower(),
            "previous_hash": previous_hash,
            "created_at": cls._iso_timestamp(created_at),
        }

    @classmethod
    def hash_record(cls, **kwargs) -> str:
        return cls.calculate_hash(cls.build_record_payload(**kwargs))

    @classmethod
    def hash_perspective(cls, **kwargs) -> str:
        return cls.calculate_hash(cls.build_perspective_payload(**kwargs))

    @classmethod
    def verify_hash(cls, payload: dict, stored_hash: str) -> bool:
        return cls.calculate_hash(payload) == stored_hash
