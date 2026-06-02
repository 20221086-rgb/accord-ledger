import re

from eth_account import Account
from eth_account.messages import encode_defunct
from flask import current_app

from app.models.user import User

_WALLET_RE = re.compile(r"^0x[a-fA-F0-9]{40}$")
DEV_TEST_SIGNATURE = "test-signature"


def build_login_message(wallet_address: str) -> str:
    return f"Sign in to Accord Ledger\nWallet: {wallet_address.lower()}"


def is_dev_test_signature_allowed() -> bool:
    return bool(current_app.config.get("ALLOW_DEV_TEST_SIGNATURE"))


def verify_wallet_signature(wallet_address: str, signature: str, message: str) -> bool:
    if not wallet_address or not signature or not message:
        return False
    if (
        is_dev_test_signature_allowed()
        and signature == DEV_TEST_SIGNATURE
        and _WALLET_RE.match(wallet_address)
    ):
        return True
    try:
        message_hash = encode_defunct(text=message)
        recovered = Account.recover_message(message_hash, signature=signature)
        return recovered.lower() == wallet_address.lower()
    except Exception:
        return False


def get_or_create_user(wallet_address: str) -> User:
    normalized = wallet_address.lower()
    user = User.query.filter_by(wallet_address=normalized).first()
    if user:
        return user
    user = User(
        wallet_address=normalized,
        display_name=f"{normalized[:6]}...{normalized[-4:]}",
    )
    return user
