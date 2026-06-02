def _login(client, wallet="0xabcdefabcdefabcdefabcdefabcdefabcdefabcd"):
    res = client.post(
        "/api/auth/metamask/login",
        json={"wallet_address": wallet, "signature": "test-signature"},
    )
    token = res.get_json()["data"]["token"]
    return {"Authorization": f"Bearer {token}"}


def test_record_create_list_detail_perspective_verify(client):
    headers = _login(client)

    create = client.post(
        "/api/records",
        json={
            "title": "팀 내 의견 충돌",
            "description": "프로젝트 방향성에 대한 의견 충돌 상세 설명입니다.",
            "emotion_tag": "불안",
        },
        headers=headers,
    )
    assert create.status_code == 201
    record_id = create.get_json()["data"]["id"]

    listing = client.get("/api/records")
    assert listing.status_code == 200
    records = listing.get_json()["data"]["records"]
    assert any(r["id"] == record_id for r in records)

    detail = client.get(f"/api/records/{record_id}")
    assert detail.status_code == 200
    assert detail.get_json()["data"]["record"]["id"] == record_id

    perspective = client.post(
        f"/api/records/{record_id}/perspectives",
        json={"type": "me", "content": "이것이 나의 입장입니다. 상세한 내용을 기록합니다."},
        headers=headers,
    )
    assert perspective.status_code == 201

    verify = client.get(f"/api/records/{record_id}/verify")
    assert verify.status_code == 200
    assert verify.get_json()["data"]["chain_valid"] is True
