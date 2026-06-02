# Accord Ledger - Implementation Plan

## 1. 프로젝트 일정 개요

| 단계 | 기간 | 목표 |
|------|------|------|
| Phase 1: Backend 기초 | Week 1-2 | DB 설계, 기본 API 구현 |
| Phase 2: Backend 고도화 | Week 3-4 | 해시 검증, 비즈니스 로직 완성 |
| Phase 3: Frontend 기초 | Week 5-6 | UI 컴포넌트, 페이지 구성 |
| Phase 4: Frontend 고도화 | Week 7-8 | API 연결, 상태 관리 |
| Phase 5: 통합 테스트 | Week 9 | 엔드투엔드 테스트 |
| Phase 6: 배포 준비 | Week 10 | 성능 최적화, 배포 설정 |

---

## 2. Backend 구현 단계

### Phase 1: Backend 기초 (Week 1-2)

#### 2.1 프로젝트 초기화
- [ ] Python 가상 환경 설정 (venv)
- [ ] Flask 프로젝트 구조 생성
- [ ] 필수 패키지 설치
  - flask
  - flask-cors
  - sqlalchemy
  - python-dotenv

**디렉토리 구조**:
```
backend/
├── app/
│   ├── __init__.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── record.py
│   │   ├── perspective.py
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── records.py
│   │   └── verification.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── hash_service.py
│   │   ├── verification_service.py
│   │   └── user_service.py
│   └── config.py
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_routes.py
│   └── test_hash_service.py
├── requirements.txt
├── .env
├── .env.example
└── run.py
```

#### 2.2 데이터베이스 설계 및 모델 생성
**작업 항목**:
- [ ] SQLite 데이터베이스 스키마 작성
- [ ] SQLAlchemy 모델 정의
  - `User` 모델: id, wallet_address, display_name, created_at
  - `Record` 모델: id, title, description, creator_wallet, emotion_tag, created_at, hash
  - `Perspective` 모델: id, record_id, author_label, content, hash, previous_hash, created_at

**테이블 관계**:
```python
# User - Record (1:N)
# User - Perspective (1:N)
# Record - Perspective (1:N)
```

**마이그레이션**:
- [ ] Flask-Migrate 설정
- [ ] 초기 마이그레이션 파일 생성

#### 2.3 기본 Flask 애플리케이션 설정
- [ ] Flask 앱 초기화 (`app/__init__.py`)
- [ ] 설정 관리 (`app/config.py`)
  - DEBUG 모드
  - DATABASE_URL
  - SECRET_KEY
  - CORS 설정
- [ ] CORS 미들웨어 설정
- [ ] 에러 핸들러 기본 설정

---

### Phase 2: Backend 고도화 (Week 3-4)

#### 2.4 SHA-256 해시 서비스 구현
**파일**: `app/services/hash_service.py`

**기능**:
```python
class HashService:
    @staticmethod
    def calculate_hash(data: dict) -> str:
        """
        데이터를 SHA-256으로 해싱
        - 입력: 딕셔너리
        - 과정: JSON 직렬화 → SHA-256 해시
        - 출력: 16진수 문자열
        """
        pass
    
    @staticmethod
    def verify_hash(data: dict, stored_hash: str) -> bool:
        """
        데이터 무결성 검증
        - 입력: 딕셔너리, 저장된 해시
        - 과정: 재계산 해시 vs 저장 해시 비교
        - 출력: True/False
        """
        pass
    
    @staticmethod
    def verify_chain(items: list) -> dict:
        """
        해시 체인 검증
        - 입력: 모든 항목 리스트
        - 과정: 순차적 해시 검증
        - 출력: { valid: bool, details: [...] }
        """
        pass
```

#### 2.5 인증 API 구현
**파일**: `app/routes/auth.py`

**엔드포인트**:
- [ ] `POST /api/auth/metamask/login`
  - MetaMask 지갑 주소와 서명 데이터를 수신
  - 서명 유효성 검증 및 지갑 소유권 확인
  - JWT 토큰 생성 및 반환
  - 응답: 토큰, wallet_address

- [ ] `GET /api/auth/me`
  - 현재 로그인한 사용자의 지갑 정보 조회
  - 응답: wallet_address, display_name, 로그인 상태

**인증 미들웨어**:
- [ ] JWT 토큰 검증 데코레이터
- [ ] 로그인 사용자 정보 로딩
- [ ] 요청 보호 및 권한 확인

#### 2.6 Record API 구현
**파일**: `app/routes/records.py`

**엔드포인트**:
- [ ] `POST /api/records`
  - 새 Record 생성
  - 입력 검증
  - 해시 생성 및 저장
  - 응답: Record 정보

- [ ] `GET /api/records`
  - 모든 Record 목록 조회
  - 페이지네이션 (page, limit)

  - 특정 Record 상세 조회
  - Perspective 포함
  - 시간순 정렬
  - 응답: Record + Perspective

#### 2.7 Perspective API 구현
**파일**: `app/routes/records.py`

**엔드포인트**:
- [ ] `POST /api/records/<id>/perspectives`
  - Perspective 추가
  - 입력 검증
  - 이전 항목의 해시 참조
  - 새 해시 생성
  - 응답: Perspective 정보

#### 2.8 Verification API 구현
**파일**: `app/routes/verification.py`

**엔드포인트**:
- [ ] `GET /api/records/<id>/verify`
  - 전체 Record 해시 체인 검증
  - 각 항목의 해시 검증
  - 체인 무결성 검증
  - 변조 감지
  - 응답: 상세한 검증 결과

#### 2.9 에러 처리 및 유효성 검사
**파일**: `app/routes/verification.py`

**엔드포인트**:
- [ ] `GET /api/records/<id>/verify`
  - 전체 Record 해시 체인 검증
  - 각 항목의 해시 검증
  - 체인 무결성 검증
  - 변조 감지
  - 응답: 상세한 검증 결과

#### 2.10 에러 처리 및 유효성 검사
- [ ] Request 입력 값 검증 (Flask-Marshmallow)
- [ ] 비즈니스 로직 검증
  - Record 존재 확인
  - 권한 확인
  - 중복 데이터 확인
- [ ] 통일된 에러 응답 형식
- [ ] 에러 로깅

#### 2.11 단위 테스트 (Unit Tests)
**테스트 파일**: `tests/test_hash_service.py`, `tests/test_routes.py`

**테스트 케이스**:
- [ ] 해시 생성 테스트
- [ ] 해시 검증 테스트
- [ ] 해시 체인 검증 테스트
- [ ] API 엔드포인트 테스트 (정상 케이스)
- [ ] API 엔드포인트 테스트 (오류 케이스)
- [ ] 인증 테스트

**테스트 실행**:
```bash
pytest tests/ -v
```

---

## 3. Frontend 구현 단계

### Phase 3: Frontend 기초 (Week 5-6)

#### 3.1 프로젝트 초기화
- [ ] Create React App 또는 Vite로 프로젝트 생성
- [ ] 필수 라이브러리 설치
  - react-router-dom
  - axios
  - tailwindcss (UI 컴포넌트)
  - zustand 또는 redux-toolkit (상태관리)

**디렉토리 구조**:
```
frontend/
├── src/
│   ├── components/
│   │   ├── Common/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Navigation.jsx
│   │   ├── Auth/
│   │   │   └── Login.jsx
│   │   ├── Record/
│   │   │   ├── RecordList.jsx
│   │   │   ├── RecordDetail.jsx
│   │   │   └── CreateRecord.jsx
│   │   ├── Perspective/
│   │   │   ├── PerspectiveList.jsx
│   │   │   └── AddPerspective.jsx
│   │   ├── Verification/
│   │       └── VerificationResult.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── CreateRecord.jsx
│   │   ├── RecordDetail.jsx
│   │   └── Profile.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── records.js
│   ├── store/
│   │   ├── authStore.js
│   │   └── recordStore.js
│   ├── hooks/
│   │   └── useAuth.js
│   ├── styles/
│   │   └── tailwind.css
│   ├── App.jsx
│   └── index.jsx
├── public/
├── package.json
└── .env
```

#### 3.2 UI 컴포넌트 라이브러리 설정
- [ ] Tailwind CSS 설정
- [ ] 기본 색상 팔레트 설정 (따뜻한 파스텔 톤)
  ```css
  primary: #FFB6D9    (파스텔 핑크)
  secondary: #FFD1DC  (라이트 핑크)
  accent: #FFC0D9     (따뜻한 핑크)
  background: #FFF5F8 (오프화이트)
  text: #5A4A42       (따뜻한 갈색)
  ```
- [ ] 기본 컴포넌트 구성
  - Button, Input, Modal, Card, Alert 등

#### 3.3 라우팅 설정
- [ ] React Router 설정
- [ ] 라우트 정의
  - `/` → Dashboard
  - `/login` → Login
  - `/record/new` → CreateRecord
  - `/record/:id` → RecordDetail
  - `/profile` → Profile

#### 3.4 상태 관리 설정
- [ ] 전역 상태 관리 (Zustand 또는 Redux)
  - 사용자 인증 정보
  - Record 목록
  - 현재 Record 상세 정보

#### 3.5 API 서비스 계층 구현
**파일**: `src/services/api.js`

```javascript
// API 베이스 설정
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request/Response 인터셉터
apiClient.interceptors.request.use(config => {
  // 토큰 추가
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    // 에러 처리
    if (error.response?.status === 401) {
      // 토큰 만료, 로그인 페이지로 이동
    }
    return Promise.reject(error);
  }
);
```

**인증 서비스**:
```javascript
// src/services/auth.js
export const authService = {
  loginWithMetaMask: (walletAddress, signature) => {...},
  logout: () => {...},
  getCurrentUser: () => {...}
};
```

**Record 서비스**:
```javascript
// src/services/records.js
export const recordService = {
  getRecords: (page, limit, status, creatorWallet) => {...},
  getRecordDetail: (id) => {...},
  createRecord: (data) => {...},
  addPerspective: (recordId, content) => {...},
  verifyRecord: (id) => {...}
};
```

---

### Phase 4: Frontend 고도화 (Week 7-8)

#### 3.6 인증 페이지 구현
**파일**: `src/pages/Login.jsx`

**Login 페이지**:
- [ ] MetaMask 지갑 연결 버튼 구현
- [ ] 로그인 시 지갑 주소와 서명을 서버로 전송
- [ ] JWT 토큰 저장 및 인증 상태 유지
- [ ] 실패 시 에러 메시지 표시
- [ ] 성공 시 Dashboard로 이동

#### 3.7 Dashboard 페이지 구현
**파일**: `src/pages/Dashboard.jsx`

**기능**:
- [ ] 사용자의 Record 목록 표시
- [ ] 페이지네이션
  - [ ] 필터링
  - [ ] Record 카드 디자인
    - 제목, 설명, 생성일, 입장 수 표시

#### 3.8 Create Record 페이지 구현
**파일**: `src/pages/CreateRecord.jsx`

**기능**:
- [ ] Record 생성 폼
  - 제목 입력
  - 설명 입력
  - 감정 태그 입력
- [ ] 입력 검증
- [ ] 서버 호출
- [ ] 성공 시 RecordDetail 페이지로 이동

#### 3.9 Record Detail 페이지 구현
**파일**: `src/pages/RecordDetail.jsx`

**기능**:
- [ ] Record 정보 표시
  - 제목, 설명, 생성일, 참여자
- [ ] Timeline UI로 Perspective 표시
  - 각 항목의 시간, 작성자, 내용 표시
  - 시간순 정렬
  - 항목별 해시 표시 (검증용)
- [ ] "입장 추가" 버튼 (폼 모달)
- [ ] Record Detail 하단에 `기록 무결성 확인` 접힘 패널 표시
- [ ] Edit/Delete 버튼 제거

**Timeline 스타일**:
```
시간: 2024-01-10 09:30
┌─────────────────────────────────┐
│ Perspective (alice)             │
│ "우리는 신기술이 필요합니다"    │
│ Hash: abc123...                 │
└─────────────────────────────────┘
  ↓
시간: 2024-01-10 10:00
┌─────────────────────────────────┐
│ Perspective (bob)               │
│ "비용을 우선 고려합시다"        │
│ Hash: def456...                 │
└─────────────────────────────────┘
```

#### 3.10 Add Perspective 모달 구현
**파일**: `src/components/Perspective/AddPerspective.jsx`

**기능**:
- [ ] 입장 텍스트 입력
- [ ] 입력 검증 (최소 10자)
- [ ] 서버 호출
- [ ] 성공 시 모달 닫기 및 Perspective 추가
- [ ] 오류 시 에러 메시지 표시



#### 3.12 Record Detail 내 검증 패널 구현
**파일**: `src/pages/RecordDetail.jsx`

**기능**:
- [ ] Record Detail에서 `기록 무결성 확인` 접힘 패널 표시
- [ ] 패널은 기본 접힘 상태로 시작
- [ ] 패널 설명: “이 기록은 SHA-256 해시 체인으로 연결되어 있어 변조 여부를 확인할 수 있습니다.”
- [ ] 펼침 시 Chain Valid, Record Hash, Latest Hash, Previous Hash, Tamper Detected, Last Verified At 표시
- [ ] GET /api/records/<id>/verify 호출로 검증 정보 로드
- [ ] 변조 감지 시 경고 메시지
- [ ] 검증 통과 시 '안전' 메시지 표시
- 실패: 0개
- 성공률: 100%

상세 결과
─────────────────────────
1. Record (abc123...)     ✓ PASS
2. Perspective-1 (def...) ✓ PASS
3. Perspective-2 (ghi...) ✓ PASS
4. Perspective-3 (jkl...) ✓ PASS
```

#### 3.13 Profile 페이지 구현
**파일**: `src/pages/Profile.jsx`

**기능**:
- [ ] 사용자 정보 표시 (wallet_address, display_name)
- [ ] 활동 이력 표시
  - 생성한 Record
  - 작성한 Perspective
  - 작성한 Perspective
- [ ] 로그아웃 버튼

---

## 4. API 연결 단계 (Week 8)

#### 4.1 Backend API 검증
- [ ] Postman 또는 curl로 모든 API 엔드포인트 테스트
- [ ] 응답 형식 확인
- [ ] 에러 응답 확인

#### 4.2 Frontend-Backend 통합
- [ ] 각 페이지의 API 호출 연결
- [ ] 요청/응답 데이터 매핑
- [ ] 에러 처리 구현
- [ ] 로딩 상태 처리

#### 4.3 엔드투엔드 흐름 테스트
- [ ] MetaMask 로그인 → Dashboard
- [ ] Record 생성 → 입장 추가 → Record 검증
- [ ] Record 검증 → 검증 결과 확인

---

## 5. 테스트 방법

### 5.1 Backend 단위 테스트
```bash
cd backend
python -m pytest tests/ -v --cov
```

**테스트 범위**:
- [ ] Hash Service 테스트
- [ ] Model 테스트
- [ ] Route 테스트
- [ ] Service 테스트

### 5.2 Frontend 단위 테스트
```bash
cd frontend
npm test
```

**테스트 범위**:
- [ ] Component 렌더링 테스트
- [ ] API 호출 모킹 테스트
- [ ] 사용자 상호작용 테스트

### 5.3 통합 테스트
**테스트 시나리오**:

1. **사용자 인증 흐름**
   - [ ] MetaMask 로그인 성공
   - [ ] 서명 검증 및 토큰 발급 확인
   - [ ] 로그인 상태 유지 확인

2. **Record 관리 흐름**
   - [ ] Record 생성 성공
   - [ ] Record 목록 조회
   - [ ] Record 상세 조회

3. **Perspective 추가 흐름**
   - [ ] Perspective 추가 성공
   - [ ] 해시 생성 확인
   - [ ] 체인 링크 확인

5. **검증 흐름**
   - [ ] 정상 Record 검증 통과
   - [ ] 데이터 변조 감지

### 5.4 성능 테스트
- [ ] API 응답 시간 < 200ms
- [ ] 페이지 로딩 시간 < 2초
- [ ] 대량 데이터 (1000+ Records) 처리

### 5.5 보안 테스트
- [ ] SQL Injection 방지
- [ ] XSS 방지
- [ ] CSRF 방지
- [ ] 인증 토큰 검증

---

## 6. 배포 전 확인사항

### 6.1 Backend 배포 준비
- [ ] `.env` 파일 설정 확인
  ```
  FLASK_ENV=production
  DATABASE_URL=sqlite:///accord_ledger.db
  SECRET_KEY=<strong_secret_key>
  JWT_SECRET=<strong_jwt_secret>
  CORS_ORIGIN=<frontend_url>
  ```
- [ ] 로깅 설정 확인
- [ ] 에러 모니터링 설정
- [ ] Database 백업 계획
- [ ] 성능 최적화
  - [ ] 인덱스 추가
  - [ ] 쿼리 최적화
  - [ ] 캐싱 설정

### 6.2 Frontend 배포 준비
- [ ] `.env.production` 파일 설정
  ```
  REACT_APP_API_URL=https://api.example.com
  ```
- [ ] 프로덕션 빌드
  ```bash
  npm run build
  ```
- [ ] 번들 크기 최적화
- [ ] 이미지 최적화

### 6.3 보안 체크리스트
- [ ] HTTPS 설정
- [ ] 보안 헤더 설정
  - Content-Security-Policy
  - X-Frame-Options
  - X-Content-Type-Options
- [ ] CORS 정책 재확인
- [ ] 비밀번호 정책 확인
- [ ] 레이트 리미팅 확인

### 6.4 문서화
- [ ] API 문서 (Swagger/OpenAPI)
- [ ] 배포 가이드
- [ ] 운영 가이드
- [ ] 문제 해결 가이드

### 6.5 모니터링 설정
- [ ] 서버 상태 모니터링
- [ ] API 성능 모니터링
- [ ] 에러 로깅 및 알림
- [ ] 사용자 활동 분석

---

## 7. 마일스톤 및 체크포인트

| 마일스톤 | 목표 달성 기준 |
|---------|------------|
| M1: Backend MVP | 모든 API 엔드포인트 구현 및 테스트 완료 |
| M2: Frontend MVP | 모든 페이지 구현 및 API 연결 완료 |
| M3: 통합 테스트 | 엔드투엔드 테스트 통과 |
| M4: 프로덕션 배포 | 배포 전 체크리스트 완료 |

---

## 8. 리스크 관리

| 위험 | 영향 | 확률 | 대응책 |
|-----|------|------|--------|
| 데이터 무결성 오류 | 높음 | 중간 | 철저한 해시 검증 테스트 |
| API 성능 저하 | 중간 | 중간 | 데이터베이스 인덱싱 |
| UI/UX 문제 | 중간 | 낮음 | 사용자 테스트 및 피드백 |
| 보안 취약점 | 높음 | 낮음 | 보안 코드 리뷰 |

---

## 9. 성공 기준

1. **기능 완성도**: 모든 MVP 기능 구현 완료
2. **테스트 커버리지**: 80% 이상
3. **버그**: 심각한 버그 0건
4. **성능**: API 응답 < 200ms, 페이지 로딩 < 2s
5. **사용성**: 신규 사용자가 5분 내 사용 가능
