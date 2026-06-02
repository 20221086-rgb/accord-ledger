from datetime import datetime, timezone

from flask import Blueprint, g, request

from app import db
from app.models.user import User
from app.services.auth_service import (
    build_login_message,
    get_or_create_user,
    verify_wallet_signature,
)
from app.utils.jwt_auth import create_token, login_required
from app.utils.responses import error, success

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/metamask/login")
def metamask_login():
    body = request.get_json(silent=True) or {}
    wallet_address = (body.get("wallet_address") or "").strip()
    signature = (body.get("signature") or "").strip()
    message = (body.get("message") or "").strip()

    if not wallet_address or not signature:
        return error(
            "VALIDATION_ERROR",
            "wallet_address and signature are required",
            400,
        )

    expected_message = build_login_message(wallet_address)
    if message and message != expected_message:
        return error("VALIDATION_ERROR", "Invalid login message", 400)

    login_message = message or expected_message
    if not verify_wallet_signature(wallet_address, signature, login_message):
        return error("UNAUTHORIZED", "Invalid wallet signature", 401)

    user = get_or_create_user(wallet_address)
    if user.id is None:
        db.session.add(user)
        db.session.commit()

    token, expires_in = create_token(user.wallet_address)
    return success(
        {
            "wallet_address": user.wallet_address,
            "token": token,
            "expires_in": expires_in,
            "login_message": expected_message,
        },
        "Login successful",
        201,
    )


@auth_bp.get("/login-message")
def login_message():
    """프론트가 서명할 메시지 템플릿 조회 (선택)."""
    wallet_address = (request.args.get("wallet_address") or "").strip()
    if not wallet_address:
        return error("VALIDATION_ERROR", "wallet_address query param required", 400)
    return success({"message": build_login_message(wallet_address)})


@auth_bp.get("/me")
@login_required
def me():
    user = User.query.filter_by(wallet_address=g.wallet_address).first()
    if not user:
        return error("NOT_FOUND", "User not found", 404)
    return success(
        {
            "wallet_address": user.wallet_address,
            "display_name": user.display_name,
            "logged_in_at": datetime.now(timezone.utc).isoformat(),
        },
        "User data retrieved successfully",
    )
