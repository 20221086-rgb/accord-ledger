from unittest.mock import patch

import pytest

from app.utils.jwt_auth import create_token


@pytest.fixture
def auth_headers(app):
    with app.app_context():
        token, _ = create_token("0x1234567890123456789012345678901234567890")
    return {"Authorization": f"Bearer {token}"}


@patch("app.routes.auth.verify_wallet_signature", return_value=True)
def test_metamask_login_and_create_record(mock_verify, client, auth_headers):
    login_res = client.post(
        "/api/auth/metamask/login",
        json={
            "wallet_address": "0x1234567890123456789012345678901234567890",
            "signature": "0x" + "ab" * 65,
            "message": "Sign in to Accord Ledger\nWallet: 0x1234567890123456789012345678901234567890",
        },
    )
    assert login_res.status_code == 201
    token = login_res.get_json()["data"]["token"]
    headers = {"Authorization": f"Bearer {token}"}

    record_res = client.post(
        "/api/records",
        json={
            "title": "팀 내 의견 충돌",
            "situation": "프로젝트 방향성에 대한 의견 충돌이 발생했습니다.",
            "emotion_tags": "불안,긴장",
        },
        headers=headers,
    )
    assert record_res.status_code == 201
    record_id = record_res.get_json()["data"]["id"]

    me_res = client.post(
        f"/api/records/{record_id}/perspectives",
        json={
            "type": "me",
            "content": "우리는 신기술 기반 접근이 필요하다고 생각합니다.",
        },
        headers=headers,
    )
    assert me_res.status_code == 201

    other_res = client.post(
        f"/api/records/{record_id}/perspectives",
        json={
            "type": "other",
            "content": "비용 효율성을 먼저 고려해야 한다는 입장입니다.",
        },
        headers=headers,
    )
    assert other_res.status_code == 201

    correction_res = client.post(
        f"/api/records/{record_id}/perspectives",
        json={
            "type": "correction",
            "content": "앞서 표현을 정정합니다. 균형 잡힌 접근이 필요합니다.",
        },
        headers=headers,
    )
    assert correction_res.status_code == 201

    detail = client.get(f"/api/records/{record_id}")
    assert detail.status_code == 200
    assert len(detail.get_json()["data"]["perspectives"]) == 3

    verify = client.get(f"/api/records/{record_id}/verify")
    assert verify.status_code == 200
    body = verify.get_json()["data"]
    assert body["chain_valid"] is True
    assert body["tamper_detected"] is False
    assert body["items_checked"] == 4


def test_verify_detects_tampering(client, auth_headers):
    with patch("app.routes.auth.verify_wallet_signature", return_value=True):
        client.post(
            "/api/auth/metamask/login",
            json={
                "wallet_address": "0x1234567890123456789012345678901234567890",
                "signature": "0x" + "ab" * 65,
                "message": "Sign in to Accord Ledger\nWallet: 0x1234567890123456789012345678901234567890",
            },
        )

    record_res = client.post(
        "/api/records",
        json={
            "title": "변조 테스트",
            "situation": "무결성 검증 실패 케이스를 위한 상황 설명입니다.",
        },
        headers=auth_headers,
    )
    record_id = record_res.get_json()["data"]["id"]

    from app import db
    from app.models.record import Record

    record = db.session.get(Record, record_id)
    record.situation = "변조된 상황 설명입니다. 원본과 다릅니다."
    db.session.commit()

    verify = client.get(f"/api/records/{record_id}/verify")
    body = verify.get_json()["data"]
    assert body["chain_valid"] is False
    assert body["tamper_detected"] is True
