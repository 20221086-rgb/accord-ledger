from datetime import datetime, timezone

from app.models.perspective import Perspective
from app.models.record import Record
from app.services.hash_service import HashService


class VerificationService:
    @staticmethod
    def verify_record(record: Record) -> dict:
        perspectives = (
            Perspective.query.filter_by(record_id=record.id)
            .order_by(Perspective.created_at.asc(), Perspective.id.asc())
            .all()
        )

        items_checked = 1 + len(perspectives)
        tamper_detected = False
        chain_items = []

        record_payload = HashService.build_record_payload(
            title=record.title,
            situation=record.situation,
            emotion_tags=record.emotion_tags,
            creator_wallet=record.creator_wallet,
            created_at=record.created_at,
            previous_hash="",
        )
        record_hash_valid = HashService.verify_hash(record_payload, record.record_hash)
        if not record_hash_valid:
            tamper_detected = True

        chain_items.append(
            {
                "order": 1,
                "kind": "record",
                "id": record.id,
                "hash_valid": record_hash_valid,
                "hash": record.record_hash,
                "previous_hash": "",
            }
        )

        expected_previous = record.record_hash
        latest_hash = record.record_hash

        for index, perspective in enumerate(perspectives, start=2):
            payload = HashService.build_perspective_payload(
                record_id=perspective.record_id,
                perspective_type=perspective.type,
                content=perspective.content,
                author_wallet=perspective.author_wallet,
                previous_hash=perspective.previous_hash,
                created_at=perspective.created_at,
            )
            hash_valid = HashService.verify_hash(payload, perspective.hash)
            chain_valid = perspective.previous_hash == expected_previous
            if not hash_valid or not chain_valid:
                tamper_detected = True

            chain_items.append(
                {
                    "order": index,
                    "kind": "perspective",
                    "id": perspective.id,
                    "type": perspective.type,
                    "hash_valid": hash_valid,
                    "chain_valid": chain_valid,
                    "hash": perspective.hash,
                    "previous_hash": perspective.previous_hash,
                }
            )
            expected_previous = perspective.hash
            latest_hash = perspective.hash

        chain_valid = not tamper_detected

        return {
            "record_id": record.id,
            "chain_valid": chain_valid,
            "tamper_detected": tamper_detected,
            "record_hash": record.record_hash,
            "latest_hash": latest_hash,
            "items_checked": items_checked,
            "last_verified_at": datetime.now(timezone.utc).isoformat(),
            "items": chain_items,
        }
