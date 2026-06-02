# Accord Ledger - System Service Design (SSD)

## 1. 전체 시스템 구조 (Architecture Overview)

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                         │
│  - UI Components (Login, Dashboard, Record, etc)           │
│  - State Management (Redux/Context API)                    │
│  - HTTP Client (Axios)                                     │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/HTTPS
                         │ JSON
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend (Flask)                            │
│  - REST API Endpoints                                      │
│  - Business Logic Layer                                    │
│  - Data Validation & Authorization                         │
│  - Hash Verification Engine                                │
│  - CORS Middleware                                         │
└────────────────────────┬────────────────────────────────────┘
                         │ SQL
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Database (SQLite)                              │
│  - Users Table                                             │
│  - Records Table                                           │
│  - Perspectives Table                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Frontend / Backend / Database 역할

### 2.1 Frontend (React)
**책임**:
- 사용자 인터페이스 제공
- 사용자 입력 수집 및 유효성 검사 (클라이언트 사이드)
- Backend API 호출
- 응답 데이터 렌더링
- MetaMask 지갑 연결
- 연결된 wallet address를 creator_wallet으로 관리

**주요 기능**:
- Login 페이지: MetaMask 인증
- Dashboard: 사용자의 Record 목록
- Create Record: 새 갈등 상황 생성
- Record Detail: Record의 모든 Perspective 표시 및 기록 무결성 확인 패널 포함
- Profile/History: 사용자 활동 이력

---

### 2.2 Backend (Flask)
**책임**:
- REST API 제공
- 비즈니스 로직 처리
- 데이터 검증
- SHA-256 해시 생성 및 검증
- Database와 상호작용
- CORS 정책 관리

**주요 역할**:
- MetaMask 연결 정보 수신 및 사용자 인증 처리
- Record CRUD 작업
- Perspective 추가
- 해시 체인 검증
- 데이터 일관성 유지

---

### 2.3 Database (SQLite)
**책임**:
- 모든 데이터 영구 저장
- 데이터 무결성 보장 (PK, FK, NOT NULL 등)
- 트랜잭션 관리

**주요 테이블**:
- **users**: wallet_address, display_name, created_at
- **records**: 갈등 상황 정보
- **perspectives**: 각 당사자의 입장

---

## 3. 데이터 흐름 (Data Flow)

### 3.1 사용자가 새로운 Perspective를 추가하는 흐름

```
User Input (Frontend)
    │
    ▼
Frontend Validation (클라이언트 사이드)
    │
    ▼
HTTP POST /api/records/<id>/perspectives
    │
    ├─ Request Body: { author_label, content }
    │
    ▼
Backend Receives Request
    │
    ├─ 1. Record 존재 확인
    ├─ 2. 입력 데이터 검증
    │
    ▼
Perspective 생성
    │
    ├─ JSON 직렬화: { record_id, author_label, content, timestamp }
    ├─ 이전 Perspective 항목에 대한 연결 유지
    │
    ▼
Database 저장
    │
    ├─ perspectives 테이블에 INSERT
    │  - id, record_id, author_label, content, timestamp
    │
    ▼
Response 반환
    │
    ├─ HTTP 201 Created
    ├─ Response Body: { id, author_label, content, timestamp }
    │
    ▼
Frontend 업데이트
    │
    └─ UI에 새 Perspective 표시
```

---

## 4. Append Only 구조 설명

### 4.1 핵심 원칙
```
Record 생성
    │
    ▼
┌─────────────────────┐
│ Perspective-1       │
│ Hash: ABC...        │
└─────────────────────┘
    │
    ▼ (이전 해시 참조)
┌─────────────────────┐
│ Perspective-2       │
│ Hash: DEF...        │
│ Prev: ABC...        │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│ Perspective-3       │
│ Hash: GHI...        │
│ Prev: DEF...        │
└─────────────────────┘
```

### 4.2 Append Only의 이점
1. **변조 방지**: 기존 항목 수정 불가능
2. **이력 추적**: 모든 변화 과정이 시간순으로 기록
3. **감사 추적**: 누가, 언제, 무엇을 했는지 명확
4. **신뢰성**: 기록의 신뢰성이 보장됨

### 4.3 구현 방식
- **Perspective 추가만 가능**: INSERT only
- **DELETE, UPDATE 작업 금지**
- **Frontend UI**: Edit/Delete 버튼 제거
- **Backend API**: DELETE/PUT 엔드포인트 미제공

---

## 5. SHA-256 무결성 검증 구조

### 5.1 해시 생성 프로세스

```python
# 각 Perspective 생성 시
data_to_hash = {
    "record_id": <id>,
    "content": <content>,
    "author_wallet": <wallet_address>,
    "created_at": <ISO-8601>,
    "previous_hash": <previous_hash>
}

json_string = json.dumps(data_to_hash, sort_keys=True)
hash = SHA256(json_string.encode()).hexdigest()
```

### 5.2 검증 로직

```
GET /api/records/<id>/verify 요청
    │
    ▼
데이터베이스에서 해당 Record의 모든 항목 조회
    │
    ▼
첫 번째 항목부터 순회
    ├─ 항목의 데이터 기반으로 해시 재계산
    ├─ 저장된 해시와 비교
    ├─ 일치 ✓ 또는 불일치 ✗
    │
    ▼
다음 항목의 previous_hash가 이전 항목의 해시와 일치하는지 확인
    │
    ▼
모든 항목 검증 완료
    │
    ▼
검증 결과 반환
    ├─ { valid: true/false, details: [...] }
```

### 5.3 해시 체인의 무결성 보증

```
만약 누군가 과거의 Perspective-1을 변조하려고 시도:

원본:
Perspective-1 Hash: ABC123
Perspective-2 Previous Hash: ABC123 ✓ (일치)

변조 후:
Perspective-1 Hash: XYZ789 (변조됨)
Perspective-2 Previous Hash: ABC123 ✗ (불일치!)
    → 검증 실패!
```

### 5.4 검증 UI 위치
- Verify는 독립 페이지가 아님.
- Record Detail 내부 하단에 `기록 무결성 확인` 접힘 패널로 제공.
- 패널은 기본 접힘 상태로 시작.
- 패널 설명: “이 기록은 SHA-256 해시 체인으로 연결되어 있어 변조 여부를 확인할 수 있습니다.”
- 패널 펼침 시 표시:
  - Chain Valid
  - Record Hash
  - Latest Hash
  - Previous Hash
  - Tamper Detected
  - Last Verified At
- Navigation에 별도 Verify 메뉴 없음.
- Record Detail Timeline 아래에서 Record 생성, 상황 설명, 내 입장, 상대 입장, 정정 기록 후 마지막 요소로 위치.

### 5.5 검증 API
- **GET /api/records/<id>/verify**: 전체 Record의 해시 체인 검증 결과 반환
- 이 API는 Record Detail 내부 `기록 무결성 확인` 접힘 패널에서 호출됨.

---

## 6. 시스템 상호작용 다이어그램

### 6.1 시퀀스: Record 생성 및 Perspective 추가

```
User          Frontend         Backend          Database
  │                │              │                 │
  ├─ 로그인 ──────▶│              │                 │
  │                ├─ 인증 ───────▶│                 │
  │                │◀── Token ─────┤                 │
  │
  ├─ Record 생성 ─▶│              │                 │
  │                ├─ POST /records ──▶│             │
  │                │              ├─ 검증           │
  │                │              ├─ INSERT ───────▶│
  │                │              │◀─ Record ID ────┤
  │                │◀─ Record ─────┤                 │
  │
  ├─ 입장 기록 ───▶│              │                 │
  │                ├─ POST /records/1/perspectives ─▶│
  │                │              ├─ Hash 계산      │
  │                │              ├─ INSERT ───────▶│
  │                │              │◀─ Perspective ──┤
  │                │◀─ Perspective ┤                │
  │
  ├─ 검증 확인 ───▶│              │                 │
  │                ├─ GET /records/1/verify ──────▶│
  │                │              ├─ 모든 항목 조회◀┤
  │                │              ├─ 해시 검증      │
  │                │◀─ 검증 결과 ──┤                 │
```

---

## 7. 데이터 모델

### 7.1 Entity-Relationship Diagram

```
┌─────────────────────────────┐
│          Users              │
├─────────────────────────────┤
│ id (PK)                     │
│ wallet_address              │
│ display_name                │
│ created_at                  │
└─────────────┘
       │1:N
       │
       ├─────────────────────────────────┐
       │                                 │
    1:N                               1:N
    │                                 │
    ▼                                 ▼
┌─────────────────────────────┐    ┌────────────────────────────────┐
│         Records             │    │          Perspectives          │
├─────────────────────────────┤    ├────────────────────────────────┤
│ id (PK)                     │    │ id (PK)                        │
│ title                       │    │ record_id (FK)                 │
│ description                 │    │ author_label                   │
│ emotion_tag                 │    │ content                        │
│ creator_wallet              │    │ previous_hash                  │
│ created_at                  │    │ hash                           │
│ hash                        │    │ created_at                     │
└─────────────────────────────┘    └────────────────────────────────┘

```

---

## 8. 보안 고려사항

1. **인증**: MetaMask 지갑 로그인 기반 인증 유지, JWT 또는 세션 토큰을 사용한 인증 세션 관리
2. **데이터 검증**: 모든 입력값 서버사이드 검증
3. **CORS**: Flask-CORS로 도메인 제한
4. **해시 무결성**: SHA-256으로 데이터 변조 방지
5. **HTTPS**: 프로덕션 환경에서 SSL/TLS 암호화

---

## 9. 확장성 고려사항

- **Database**: SQLite에서 PostgreSQL로 전환 가능
- **Cache**: Redis 캐시층 추가 가능
- **API Gateway**: Kong 등으로 API 관리 가능
- **Blockchain**: 향후 분산 원장 연동 가능
