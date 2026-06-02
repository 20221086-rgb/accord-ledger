from functools import wraps

import jwt
from flask import current_app, g, request

from app.utils.responses import error


def create_token(wallet_address: str) -> tuple[str, int]:
    expires_in = current_app.config["JWT_EXPIRES_SECONDS"]
    payload = {
        "sub": wallet_address.lower(),
        "wallet_address": wallet_address.lower(),
    }
    token = jwt.encode(
        payload,
        current_app.config["JWT_SECRET"],
        algorithm="HS256",
    )
    return token, expires_in


def decode_token(token: str) -> dict | None:
    try:
        return jwt.decode(
            token,
            current_app.config["JWT_SECRET"],
            algorithms=["HS256"],
        )
    except jwt.PyJWTError:
        return None


def get_bearer_token() -> str | None:
    header = request.headers.get("Authorization", "")
    if header.startswith("Bearer "):
        return header[7:].strip()
    return None


def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_bearer_token()
        if not token:
            return error("UNAUTHORIZED", "Authentication required", 401)
        payload = decode_token(token)
        if not payload:
            return error("UNAUTHORIZED", "Invalid or expired token", 401)
        g.wallet_address = payload.get("wallet_address") or payload.get("sub")
        return f(*args, **kwargs)

    return decorated
