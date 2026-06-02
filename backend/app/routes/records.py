from datetime import datetime, timezone

from flask import Blueprint, g, request

from app import db
from app.models.perspective import PERSPECTIVE_TYPES, Perspective
from app.models.record import Record
from app.services.hash_service import HashService
from app.services.verification_service import VerificationService
from app.utils.jwt_auth import login_required
from app.utils.responses import error, success

records_bp = Blueprint("records", __name__)


def _validate_record_body(body: dict) -> tuple[str | None, str | None, str | None]:
    title = (body.get("title") or "").strip()
    situation = (body.get("situation") or body.get("description") or "").strip()
    emotion_tags = (body.get("emotion_tags") or body.get("emotion_tag") or "").strip()

    if len(title) < 5:
        return None, None, None
    if len(situation) < 10:
        return None, None, None
    return title, situation, emotion_tags or None


@records_bp.get("")
def list_records():
    page = max(int(request.args.get("page", 1)), 1)
    limit = min(max(int(request.args.get("limit", 10)), 1), 100)
    creator_wallet = (request.args.get("creator_wallet") or "").strip().lower()

    query = Record.query.order_by(Record.created_at.desc())
    if creator_wallet:
        query = query.filter(Record.creator_wallet == creator_wallet)

    total = query.count()
    records = query.offset((page - 1) * limit).limit(limit).all()

    items = []
    for record in records:
        item = record.to_dict()
        item["perspectives_count"] = record.perspectives.count()
        items.append(item)

    pages = (total + limit - 1) // limit if total else 0
    return success(
        {
            "records": items,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "pages": pages,
            },
        },
        "Records retrieved successfully",
    )


@records_bp.post("")
@login_required
def create_record():
    body = request.get_json(silent=True) or {}
    title, situation, emotion_tags = _validate_record_body(body)
    if not title:
        return error(
            "VALIDATION_ERROR",
            "title (min 5 chars) and situation (min 10 chars) are required",
            400,
        )

    created_at = datetime.now(timezone.utc)
    creator_wallet = g.wallet_address.lower()
    record_hash = HashService.hash_record(
        title=title,
        situation=situation,
        emotion_tags=emotion_tags,
        creator_wallet=creator_wallet,
        created_at=created_at,
        previous_hash="",
    )

    record = Record(
        title=title,
        situation=situation,
        emotion_tags=emotion_tags,
        creator_wallet=creator_wallet,
        record_hash=record_hash,
        created_at=created_at,
    )
    db.session.add(record)
    db.session.commit()

    data = record.to_dict(include_hash=True)
    return success(data, "Record created successfully", 201)


@records_bp.get("/<int:record_id>")
def get_record(record_id: int):
    record = db.session.get(Record, record_id)
    if not record:
        return error("NOT_FOUND", f"Record with ID {record_id} not found", 404)

    perspectives = (
        Perspective.query.filter_by(record_id=record.id)
        .order_by(Perspective.created_at.asc(), Perspective.id.asc())
        .all()
    )

    return success(
        {
            "record": record.to_dict(include_hash=True),
            "perspectives": [p.to_dict(include_hash=True) for p in perspectives],
        },
        "Record retrieved successfully",
    )


@records_bp.post("/<int:record_id>/perspectives")
@login_required
def add_perspective(record_id: int):
    record = db.session.get(Record, record_id)
    if not record:
        return error("NOT_FOUND", f"Record with ID {record_id} not found", 404)

    body = request.get_json(silent=True) or {}
    perspective_type = (body.get("type") or "").strip().lower()
    content = (body.get("content") or "").strip()

    if perspective_type not in PERSPECTIVE_TYPES:
        return error(
            "VALIDATION_ERROR",
            f"type must be one of: {', '.join(PERSPECTIVE_TYPES)}",
            400,
        )
    if len(content) < 10:
        return error(
            "VALIDATION_ERROR",
            "content must be at least 10 characters",
            400,
        )

    last_perspective = (
        Perspective.query.filter_by(record_id=record.id)
        .order_by(Perspective.created_at.desc(), Perspective.id.desc())
        .first()
    )
    previous_hash = (
        last_perspective.hash if last_perspective else record.record_hash
    )

    created_at = datetime.now(timezone.utc)
    author_wallet = g.wallet_address.lower()
    perspective_hash = HashService.hash_perspective(
        record_id=record.id,
        perspective_type=perspective_type,
        content=content,
        author_wallet=author_wallet,
        previous_hash=previous_hash,
        created_at=created_at,
    )

    perspective = Perspective(
        record_id=record.id,
        type=perspective_type,
        content=content,
        author_wallet=author_wallet,
        previous_hash=previous_hash,
        hash=perspective_hash,
        created_at=created_at,
    )
    db.session.add(perspective)
    db.session.commit()

    return success(
        perspective.to_dict(include_hash=True),
        "Perspective added successfully",
        201,
    )


@records_bp.get("/<int:record_id>/verify")
def verify_record(record_id: int):
    record = db.session.get(Record, record_id)
    if not record:
        return error("NOT_FOUND", f"Record with ID {record_id} not found", 404)

    result = VerificationService.verify_record(record)
    message = (
        "Record verification completed successfully. All items are valid!"
        if result["chain_valid"]
        else "WARNING: Verification completed with errors. Potential data tampering detected!"
    )
    return success(result, message)
