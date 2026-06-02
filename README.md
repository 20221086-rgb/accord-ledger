# Accord Ledger (MVP)

MetaMask 기반 갈등/관계 기록 Ledger — Record, Perspective, Append-only Timeline, Integrity Panel.

## 로컬 실행

```powershell
# Backend
cd backend
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python run.py

# Frontend (별도 터미널)
cd frontend
npm install
npm run dev
```

- Frontend: http://localhost:5173  
- API: http://localhost:5000/api  

## 배포

**[docs/DEPLOY.md](docs/DEPLOY.md)** — Vercel (frontend) + Render (backend) 권장, 환경 변수·체크리스트 포함.

## 스펙

- `specs/ssd.md` — MVP source of truth
- `specs/implementation-plan.md`
