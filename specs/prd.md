# Accord Ledger - Product Requirements Document (PRD)

## 1. 프로젝트 개요

**프로젝트명**: Accord Ledger  
**목표**: MetaMask 기반으로 갈등과 관계 기록을 영구 보존하는 Ledger 플랫폼  
**핵심 특징**: Append Only 타임라인, SHA-256 기반 무결성 검증, creator_wallet 기반 사용자 식별

---

## 2. 문제 정의

### 기존의 문제점
- **기록 변조 위험**: 감정과 관계 기록이 사후에 수정될 수 있음
- **신뢰성 부족**: 주관적 입장이 체계적으로 저장되지 않음
- **이력 추적의 어려움**: 갈등과 관계 변화의 흐름이 명확히 남지 않음
- **검증의 어려움**: 기록 무결성을 빠르게 확인할 수 있는 방법이 부족함

---

## 3. 해결 방안

### Accord Ledger의 솔루션
1. **MetaMask 기반 인증**: 지갑 주소를 creator_wallet으로 사용해 사용자 식별
2. **Record + Perspective 중심 모델**: 상황 설명과 입장을 분리해 기록
3. **Append Only 타임라인**: 수정/삭제 없이 새 Perspective를 추가하는 이력 보존
4. **SHA-256 무결성 검증**: Record와 Perspective 간 해시 체인으로 데이터 신뢰성 확보

---

## 4. 주요 사용자 (User Personas)

### 1. 갈등 당사자
- **역할**: 자신의 감정과 입장을 안전하게 기록
- **니즈**: 변조 없는 일관된 기록과 상대 입장 확인

### 2. 관계 관리자 / 중재자
- **역할**: 사건의 흐름과 양측 입장을 비교 분석
- **니즈**: 신뢰할 수 있는 기록 기반으로 상황을 파악

### 3. 감정 기록 사용자
- **역할**: 감정과 관계 이력을 개인적으로 보존
- **니즈**: 기록이 안전하게 저장되고 검증되기를 원함

### 4. 시스템 운영자
- **역할**: 서비스 안정성과 데이터 무결성 관리
- **니즈**: 간단한 구조로 안정적인 운영과 확대 가능성 확보

---

## 5. MVP 기능

### 5.1 인증 및 사용자 식별
- **MetaMask 로그인**만 지원
- **creator_wallet** 기반 사용자 식별
- JWT 또는 세션 토큰을 통해 인증 상태 유지

### 5.2 Record 관리
- **Record 생성**: 제목, 설명, 감정 태그 포함
- **Record 조회**: 목록 및 상세 정보 조회
- **Record 내부 검증**: Record 생성 시 해시 저장

### 5.3 Perspective 관리
- **My Perspective**: 내 입장 기록
- **Other Perspective**: 상대 입장 텍스트 기록
- **Append Only**: Perspective 수정/삭제 불가, 새로운 항목으로 정정
- **타임라인 표현**: 시간순으로 기록 흐름 확인

### 5.4 무결성 검증
- **Record Detail 내부**에서 해시 체인 검증 정보 제공
- **Perspective 간 previous_hash/hash 연결**로 변조 감지
- **정상/비정상 검증 결과 표시**

---

## 6. 제외 범위 (Out of Scope)

### 6.1 MVP에서 제외되는 기능
- **participant_wallet** / **participant_address** 입력 및 관리
- **상대 지갑 주소 입력** 기능
- **shared participation** 기반 참여 구조
- **Agreement/전자서명** 기능
- **signature / signer / signed / pending 상태**
- **/agreements API** 및 Agreement 화면
- **독립적인 Verify 메인 메뉴**

### 6.2 추후 확장으로만 남겨두는 항목
- **상대 직접 참여**: v2에서 선택적 초대/참여 기능으로 검토
- **분산 원장 스마트 컨트랙트**: v2 이후 확장
- **AI 중재 및 감정 분석**: 향후 추가 가능

---

## 7. 기술 요구사항

### 개발 스택
- **Frontend**: React
- **Backend**: Flask
- **Database**: SQLite
- **CORS**: Flask-CORS
- **Hashing**: hashlib SHA-256

### 비기능 요구사항
- **응답 시간**: API < 200ms
- **보안**: HTTPS, CORS 제한, MetaMask 로그인
- **무결성**: 해시 검증 성공률 100%
- **확장성**: SQLite 기반에서 향후 확장 가능

---

## 8. 성공 지표 (KPI)

1. **MVP 기능 구현**: MetaMask 로그인, Record 생성/조회, Perspective 추가, 무결성 검증
2. **무결성 검증률**: 해시 체인 검증 성공률 100%
3. **사용성**: 신규 사용자가 5분 내 Record 생성 및 Perspective 추가 가능
4. **데이터 신뢰**: 기록 변조 감지 시 근거 제공
