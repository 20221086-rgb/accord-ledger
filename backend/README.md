# Accord Ledger — Backend (MVP)

갈등 사건(Record)과 입장 타임라인(Perspective)을 **Append Only**로 보존하고, SHA-256 해시 체인으로 무결성을 검증하는 Flask API입니다.

## 실행

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

pip install -r requirements.txt
copy .env.example .env

python run.py
```

- API Base: `http://localhost:5000/api`
- Health: `GET http://localhost:5000/api/health`

## MetaMask 로그인

1. `GET /api/auth/login-message?wallet_address=0x...` 로 서명 메시지 조회 (선택)
2. MetaMask로 메시지 서명
3. `POST /api/auth/metamask/login` — `wallet_address`, `signature`, `message`

서명 메시지 형식:

```
Sign in to Accord Ledger
Wallet: 0x...
```

## Perspective 타입

| type | 의미 |
|------|------|
| `me` | 내 입장 |
| `other` | 상대 입장 |
| `correction` | 정정 기록 |

수정/삭제 API는 제공하지 않습니다.

## 테스트

```bash
cd backend
.venv\Scripts\activate
pytest tests/ -v
```
