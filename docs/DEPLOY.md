# Accord Ledger MVP — 배포 가이드

발표용 데모 기준: **MetaMask 로그인 · Record · Perspective · Record Detail Integrity Panel**  
(Agreement / participant_wallet / 독립 Verify 페이지 없음)

## 추천 스택 (가장 빠른 경로)

| 구분 | 추천 | 이유 |
|------|------|------|
| **Frontend** | [Vercel](https://vercel.com) | Vite SPA 빌드·HTTPS·환경변수·라우팅 rewrite 기본 지원 |
| **Backend** | [Render](https://render.com) | Flask + Gunicorn 무난, 무료 Web Service, Health check |

대안: Frontend **Netlify** (`frontend/netlify.toml` 포함), Backend **Railway** (`backend/Procfile` 동일 사용)

---

## 사전 확인 (로컬)

```powershell
# Frontend build
cd frontend
npm ci
npm run build

# Backend tests
cd ..\backend
.venv\Scripts\activate
pip install -r requirements.txt
pytest tests/ -q
```

---

## 1. Backend 배포 (Render)

### A. Blueprint (PostgreSQL 포함, 권장)

1. GitHub에 `openBlock` 저장소 push
2. [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**
3. 저장소 선택 → `render.yaml` 적용
4. **Environment**에서 `CORS_ORIGIN` 수동 설정 (프론트 배포 URL 확정 후):
   ```
   https://your-app.vercel.app
   ```
5. Deploy 완료 후 API URL 확인:  
   `https://accord-ledger-2.onrender.com`

### B. Web Service만 (SQLite, 빠른 데모 — 재배포 시 DB 초기화 가능)

1. **New Web Service** → Root Directory: `backend`
2. **Build Command:**
   ```bash
   pip install -r requirements.txt && python scripts/init_db.py
   ```
3. **Start Command:**
   ```bash
   gunicorn --bind 0.0.0.0:$PORT --workers 2 --timeout 120 run:app
   ```
4. Environment Variables (아래 표 참고)

### Health check

- `GET https://<api-host>/api/health` → `{"status":"ok","service":"accord-ledger"}`

---

## 2. Frontend 배포 (Vercel)

1. [Vercel](https://vercel.com) → **Add New Project** → GitHub repo
2. **Root Directory:** `frontend`
3. **Framework Preset:** Vite
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`
6. **Environment Variables:**

   | Key | Value |
   |-----|--------|
   | `VITE_API_URL` | `https://<render-api-host>/api` |

7. Deploy 후 생성된 URL을 Render `CORS_ORIGIN`에 반영하고 API 재시작(또는 재배포)

`frontend/vercel.json` — SPA 라우트(`/records/new`, `/records/:id`) 새로고침 대응

### Netlify 대안

- Base directory: `frontend`
- `netlify.toml` 사용
- 동일하게 `VITE_API_URL` 설정

---

## 3. 환경 변수 정리

### Backend (Render / Railway)

| 변수 | 필수 | 설명 |
|------|------|------|
| `FLASK_ENV` | ✅ | `production` |
| `SECRET_KEY` | ✅ | 32자 이상 랜덤 문자열 |
| `JWT_SECRET` | ✅ | 32자 이상 랜덤 문자열 |
| `CORS_ORIGIN` | ✅ | 프론트 URL (쉼표로 복수 가능) |
| `ALLOW_DEV_TEST_SIGNATURE` | ✅ | **`false`** (발표/프로덕션) |
| `DATABASE_URL` | 권장 | Render Postgres 또는 SQLite |
| `JWT_EXPIRES_SECONDS` | 선택 | 기본 `3600` |

### Frontend (Vercel / Netlify)

| 변수 | 필수 | 설명 |
|------|------|------|
| `VITE_API_URL` | ✅ | `https://<api>/api` (끝에 `/api` 포함) |

로컬 개발 시 `VITE_API_URL` 비우면 Vite proxy(`/api` → `localhost:5000`) 사용.

---

## 4. 배포 순서

1. **Backend** Render에 배포 → `/api/health` 확인
2. **Frontend** Vercel에 배포 (임시 `VITE_API_URL`로 1차 빌드 가능)
3. Vercel **Production URL** 확정
4. Render **`CORS_ORIGIN`** = Vercel URL 로 업데이트 → API 재배포
5. MetaMask **실제 지갑**으로 로그인 E2E 테스트

> MetaMask는 **HTTPS** 필수 → Vercel/Render 기본 HTTPS 사용

---

## 5. 배포 후 체크리스트

### API

- [ ] `GET /api/health` → 200 OK
- [ ] `GET /api/auth/login-message?wallet_address=0x...` → message 반환
- [ ] CORS: 브라우저에서 프론트 도메인 → API 요청 시 에러 없음

### Frontend

- [ ] `https://<vercel-app>/` — Dashboard 로드
- [ ] `https://<vercel-app>/login` — MetaMask 카드만 표시 (dev 테스트 로그인 UI 없음)
- [ ] `https://<vercel-app>/records/new` — 로그인 후 Create Record
- [ ] 새로고침 시 `/records/123` 등 deep link 정상 (404 아님)

### E2E (발표 데모)

- [ ] MetaMask 연결 → 로그인 → Dashboard
- [ ] Record 생성 (감정 태그 최대 5개)
- [ ] Record Detail — Timeline + **기록 무결성 확인** 패널
- [ ] 입장 추가 (me / other / correction)
- [ ] Verify 패널 펼치기 → Chain Valid / Hash Summary

### 보안 (프로덕션)

- [ ] `ALLOW_DEV_TEST_SIGNATURE=false`
- [ ] `SECRET_KEY` / `JWT_SECRET` 기본값 미사용

---

## 6. 트러블슈팅

| 증상 | 조치 |
|------|------|
| API CORS 오류 | `CORS_ORIGIN`에 Vercel URL 정확히 입력 (trailing slash 없이) |
| 401 로그인 실패 | MetaMask 네트워크·서명 거부 확인; dev signature 비활성 확인 |
| 빈 Record 목록 | DB 초기화됨 — 새 Record 생성 |
| SPA 404 | `vercel.json` / `netlify.toml` rewrite 확인 |
| Render cold start | 무료 플랜 50초 sleep — 첫 요청 전 health ping |

---

## 파일 맵

```
openBlock/
├── render.yaml              # Render Blueprint (API + Postgres)
├── docs/DEPLOY.md           # 이 문서
├── backend/
│   ├── Procfile             # Railway / Render start
│   ├── runtime.txt
│   ├── requirements.txt     # gunicorn 포함
│   └── .env.example
└── frontend/
    ├── vercel.json          # SPA rewrite
    ├── netlify.toml
    └── .env.example
```
