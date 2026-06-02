from datetime import datetime, timezone

from app.services.hash_service import HashService


def test_record_hash_is_deterministic():
    created_at = datetime(2024, 1, 10, 9, 0, 0, tzinfo=timezone.utc)
    h1 = HashService.hash_record(
        title="팀 내 의견 충돌",
        situation="프로젝트 방향성에 대한 의견 충돌 상황입니다.",
        emotion_tags="불안",
        creator_wallet="0xabc123",
        created_at=created_at,
        previous_hash="",
    )
    h2 = HashService.hash_record(
        title="팀 내 의견 충돌",
        situation="프로젝트 방향성에 대한 의견 충돌 상황입니다.",
        emotion_tags="불안",
        creator_wallet="0xabc123",
        created_at=created_at,
        previous_hash="",
    )
    assert h1 == h2
    assert len(h1) == 64


def test_perspective_chain_links_previous_hash():
    created_at = datetime(2024, 1, 10, 10, 0, 0, tzinfo=timezone.utc)
    record_hash = HashService.hash_record(
        title="테스트 기록",
        situation="상황 설명이 충분히 길어야 합니다.",
        emotion_tags="",
        creator_wallet="0xabc123",
        created_at=created_at,
        previous_hash="",
    )
    perspective_hash = HashService.hash_perspective(
        record_id=1,
        perspective_type="me",
        content="이것은 나의 입장에 대한 상세한 설명입니다.",
        author_wallet="0xabc123",
        previous_hash=record_hash,
        created_at=created_at,
    )
    payload = HashService.build_perspective_payload(
        record_id=1,
        perspective_type="me",
        content="이것은 나의 입장에 대한 상세한 설명입니다.",
        author_wallet="0xabc123",
        previous_hash=record_hash,
        created_at=created_at,
    )
    assert HashService.verify_hash(payload, perspective_hash)
