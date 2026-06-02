def test_metamask_login_dev_test_signature(client):
    wallet = "0x1234567890123456789012345678901234567890"
    response = client.post(
        "/api/auth/metamask/login",
        json={
            "wallet_address": wallet,
            "signature": "test-signature",
        },
    )
    assert response.status_code == 201
    body = response.get_json()
    assert body["success"] is True
    assert body["data"]["token"]
    assert body["data"]["wallet_address"] == wallet.lower()


def test_metamask_login_rejects_invalid_signature(client):
    wallet = "0x1234567890123456789012345678901234567890"
    response = client.post(
        "/api/auth/metamask/login",
        json={
            "wallet_address": wallet,
            "signature": "not-a-real-signature",
        },
    )
    assert response.status_code == 401
