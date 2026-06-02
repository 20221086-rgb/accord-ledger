# Stitch UI Reference

Google Stitch 원본 HTML export는 리팩터링 과정에서 분리되었습니다.

## Record Detail (Stitch-faithful source)

- `frontend/reference/recovered-record-detail.jsx` — transcript에서 복구한 Stitch 기반 RecordDetailPage
- `frontend/src/components/record/TimelineItem.jsx` — Record 요약 + 타임라인 카드 (ledger-card / correction-card)
- `frontend/src/components/integrity/IntegrityPanel.jsx` — 접힘형 무결성 패널

## 구현 위치

- Login: `src/pages/WalletLoginPage.jsx`
- Dashboard: `src/pages/DashboardPage.jsx`
- Create Record: `src/pages/CreateRecordPage.jsx`
- Record Detail: `src/pages/RecordDetailPage.jsx`

## 디자인 토큰

`tailwind.config.js` — beige/brown palette, Source Serif 4, Hanken Grotesk, spacing tokens
