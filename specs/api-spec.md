# Accord Ledger - API Specification

## 1. API 개요

**Base URL**: `http://localhost:5000/api` (개발환경)  
**인증**: MetaMask 지갑 로그인 기반 인증을 사용하며, JWT 또는 세션 기반 인증 토큰으로 보호된 요청을 처리합니다.  
**응답 형식**: JSON  
**CORS**: 활성화됨

---

## 2. HTTP 상태 코드

| 코드 | 의미 |
|------|------|
| 200 | OK - 요청 성공 |
| 201 | Created - 리소스 생성 성공 |
| 400 | Bad Request - 잘못된 요청 |
| 401 | Unauthorized - 접근 권한 없음 |
| 403 | Forbidden - 권한 없음 |
| 404 | Not Found - 리소스 없음 |
| 500 | Internal Server Error - 서버 오류 |

---

## 3. 공통 응답 형식

### 3.1 성공 응답
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

### 3.2 오류 응답
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

---

## 4. 인증 API

### 4.1 POST /api/auth/metamask/login
**설명**: MetaMask 지갑 로그인 처리

**인증**: 없음

**요청 바디**:
```json
{
  "wallet_address": "0xAbC123...",
  "signature": "0xSignatureValue..."
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| wallet_address | string | Y | MetaMask 지갑 주소 |
| signature | string | Y | 지갑 주소 소유권 확인을 위한 서명 값 |

**응답 예시**:
```json
{
  "success": true,
  "data": {
    "wallet_address": "0xAbC123...",
    "token": "eyJhbGciOiJIUzI1NiIsInR5...",
    "expires_in": 3600
  },
  "message": "Login successful"
}
```

---

### 4.2 GET /api/auth/me
**설명**: 현재 로그인한 사용자의 정보 조회

**인증**: 필수 (JWT 또는 세션)

**응답 예시**:
```json
{
  "success": true,
  "data": {
    "wallet_address": "0xAbC123...",
    "display_name": "alice",
    "logged_in_at": "2024-01-15T10:00:00Z"
  },
  "message": "User data retrieved successfully"
}
```

---

## 5. API 엔드포인트 정의

### 4.1 GET /api/records
**설명**: 모든 Record 목록 조회 (페이지네이션 지원)

**인증**: 없음 (MetaMask 지갑 연결은 프론트엔드에서 처리되며, Record 생성 시 creator_wallet 값을 전달함)

**요청 파라미터**:
```
GET /api/records?page=1&limit=10&status=active
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| page | integer | N | 페이지 번호 (기본값: 1) |
| limit | integer | N | 페이지당 항목 수 (기본값: 10) |
| status | string | N | 필터: active, resolved, closed |

**응답 예시**:
```json
{
  "success": true,
  "data": {
    "records": [
      {
        "id": 1,
        "creator_wallet": "0xAbC123...",
        "title": "팀 내 의견 충돌",
        "description": "프로젝트 방향성에 대한 의견 충돌",
        "emotion_tag": "불안",
        "created_at": "2024-01-10T09:00:00Z",
        "perspectives_count": 3
      },
      {
        "id": 2,
        "creator_wallet": "0xDeF456...",
        "title": "계약 조건 분쟁",
        "description": "프로젝트 비용 분담에 대한 분쟁",
        "emotion_tag": "긴장",
        "created_at": "2024-01-12T14:30:00Z",
        "perspectives_count": 2
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 2,
      "pages": 1
    }
  },
  "message": "Records retrieved successfully"
}
```

---

### 4.3 POST /api/records
**설명**: 새로운 Record 생성

**인증**: 필수 (JWT 또는 세션)

**요청 바디**:
```json
{
  "title": "문제의 제목",
  "description": "상세한 설명",
  "emotion_tag": "불안"
}
```

| 필드 | 타입 | 필수 | 설명 |
|-----|------|------|------|
| title | string | Y | Record 제목 (최소 5자, 최대 200자) |
| description | string | Y | 상세 설명 (최소 10자, 최대 2000자) |
| emotion_tag | string | N | 감정 태그 (예: 불안, 긴장, 희망) |

**참고**: `creator_wallet`은 인증된 사용자의 MetaMask 지갑 주소로 서버에서 자동으로 할당됩니다.

**응답 예시 (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": 3,
    "creator_wallet": "0xAbC123...",
    "title": "새로운 분쟁 기록",
    "description": "새로운 분쟁 상황 기록",
    "emotion_tag": "희망",
    "created_at": "2024-01-15T10:00:00Z",
    "hash": "abc123def456..."
  },
  "message": "Record created successfully"
}
```

**오류 응답 (400 Bad Request)**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required and must be at least 5 characters"
  }
}
```

---

### 4.4 GET /api/records/<id>
**설명**: 특정 Record의 상세 정보 조회 (모든 Perspective 포함)

**인증**: 없음

**경로 파라미터**:
```
GET /api/records/1
```

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| id | integer | Y | Record ID |

**응답 예시**:
```json
{
  "success": true,
  "data": {
    "record": {
      "id": 1,
      "creator_wallet": "0xAbC123...",
      "title": "팀 내 의견 충돌",
      "description": "프로젝트 방향성에 대한 의견 충돌",
      "emotion_tag": "불안",
      "created_at": "2024-01-10T09:00:00Z",
      "hash": "record_hash_value..."
    },
    "perspectives": [
      {
        "id": "p_001",
        "record_id": 1,
        "author_label": "A",
        "content": "우리는 신기술 기반의 접근이 필요하다고 생각합니다.",
        "created_at": "2024-01-10T09:30:00Z"
      },
      {
        "id": "p_002",
        "record_id": 1,
        "author_label": "B",
        "content": "비용 효율성을 먼저 고려해야 합니다.",
        "created_at": "2024-01-10T10:00:00Z"
      },
      {
        "id": "p_003",
        "record_id": 1,
        "author_label": "A",
        "content": "비용과 기술의 균형을 맞춰보겠습니다.",
        "created_at": "2024-01-10T10:30:00Z"
      }
    ],
  },
  "message": "Record retrieved successfully"
}
```

**오류 응답 (404 Not Found)**:
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Record with ID 999 not found"
  }
}
```

---

### 4.4 POST /api/records/<id>/perspectives
**설명**: Record에 새로운 Perspective 추가

**인증**: 필수 (JWT 또는 세션)

**경로 파라미터**:
```
POST /api/records/1/perspectives
```

**요청 바디**:
```json
{
  "author_label": "A",
  "content": "이것이 나의 입장입니다. 상세한 내용..."
}
```

| 필드 | 타입 | 필수 | 설명 |
|-----|------|------|------|
| author_label | string | Y | Perspective 작성자 레이블 (예: A, B, 나, 상대) |
| content | string | Y | Perspective 내용 (최소 10자, 최대 5000자) |

**응답 예시 (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": "p_004",
    "record_id": 1,
    "author_label": "B",
    "content": "이것이 나의 입장입니다. 상세한 내용...",
    "created_at": "2024-01-10T12:00:00Z"
  },
  "message": "Perspective added successfully"
}
```

**오류 응답 (400 Bad Request)**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Content must be at least 10 characters long"
  }
}
```

---



---

### 4.6 GET /api/records/<id>/verify
**설명**: Record의 전체 해시 체인 검증 및 무결성 확인

**인증**: 없음

**경로 파라미터**:
```
GET /api/records/1/verify
```

**응답 예시**:
```json
{
  "success": true,
  "data": {
    "record_id": 1,
    "verified_at": "2024-01-10T13:00:00Z",
    "overall_valid": true,
    "verification_summary": {
      "total_items": 5,
      "verified_items": 5,
      "failed_items": 0,
      "verification_percentage": 100
    },
    "items": [
      {
        "order": 1,
        "type": "record",
        "id": 1,
        "title": "팀 내 의견 충돌",
        "hash": "record_hash_value...",
        "hash_valid": true,
        "chain_valid": true
      },
      {
        "order": 2,
        "type": "perspective",
        "id": "p_001",
        "author": "alice",
        "hash": "perspective_hash_1...",
        "previous_hash": "record_hash_value...",
        "hash_valid": true,
        "chain_valid": true,
        "chain_verification": "previous_hash matches parent hash"
      },
      {
        "order": 3,
        "type": "perspective",
        "id": "p_002",
        "author": "bob",
        "hash": "perspective_hash_2...",
        "previous_hash": "perspective_hash_1...",
        "hash_valid": true,
        "chain_valid": true,
        "chain_verification": "previous_hash matches parent hash"
      },
      {
        "order": 4,
        "type": "perspective",
        "id": "p_003",
        "author": "alice",
        "hash": "perspective_hash_3...",
        "previous_hash": "perspective_hash_2...",
        "hash_valid": true,
        "chain_valid": true,
        "chain_verification": "previous_hash matches parent hash"
      }
    ],
    "audit_trail": {
      "created_at": "2024-01-10T09:00:00Z",
      "last_updated_at": "2024-01-10T13:00:00Z",
      "total_actions": 6,
      "participants": ["alice", "bob"]
    }
  },
  "message": "Record verification completed successfully. All items are valid!"
}
```

**검증 실패 응답 (데이터 변조 감지)**:
```json
{
  "success": true,
  "data": {
    "record_id": 1,
    "verified_at": "2024-01-10T13:05:00Z",
    "overall_valid": false,
    "verification_summary": {
      "total_items": 6,
      "verified_items": 5,
      "failed_items": 1,
      "verification_percentage": 83
    },
    "items": [
      ...
      {
        "order": 3,
        "type": "perspective",
        "id": "p_002",
        "author": "bob",
        "hash": "perspective_hash_2_tampered...",
        "stored_hash": "perspective_hash_2...",
        "hash_valid": false,
        "chain_valid": false,
        "chain_verification": "HASH MISMATCH - Data has been tampered!",
        "tampering_detected": true
      }
    ],
    "warnings": [
      "Data tampering detected at item index 2!",
      "Chain integrity broken from perspective p_002 onwards"
    ]
  },
  "message": "WARNING: Verification completed with errors. Potential data tampering detected!"
}
```

---

## 5. 에러 코드 정의

| 에러 코드 | HTTP 상태 | 설명 |
|----------|----------|------|
| VALIDATION_ERROR | 400 | 입력 값 검증 실패 |
| UNAUTHORIZED | 401 | 접근 권한 없음 |
| FORBIDDEN | 403 | 권한 부족 |
| NOT_FOUND | 404 | 리소스 없음 |
| DUPLICATE_ENTRY | 409 | 중복된 데이터 |
| CHAIN_INTEGRITY_ERROR | 422 | 해시 체인 무결성 오류 |
| INTERNAL_ERROR | 500 | 서버 오류 |

---

## 7. Rate Limiting

- **일반 사용자**: 분당 100 요청
- **Error Response**:
  ```json
  {
    "success": false,
    "error": {
      "code": "RATE_LIMIT_EXCEEDED",
      "message": "Too many requests. Please wait before retrying."
    }
  }
  ```

---

## 8. CORS 정책

```
Access-Control-Allow-Origin: http://localhost:3000 (개발)
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

---

## 9. 타임아웃

- **요청 타임아웃**: 30초
- **연결 타임아웃**: 10초

