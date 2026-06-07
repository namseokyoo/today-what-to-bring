# 오늘 뭐 챙기지? — Lab Workspace

앱인토스 6월 바이브코딩 챌린지 출품 후보 프로젝트입니다. 상황별 준비물 체크리스트 Toss Mini App을 PRD → 와이어프레임 → MVP 구현 → `.ait` 제출 순서로 개발합니다.

## Workspace

```text
/Volumes/external/project/SidequestLab/projects/today-what-to-bring
```

## 주요 문서

GitHub: https://github.com/namseokyoo/today-what-to-bring

- `PROJECT.md` — Lab 프로젝트 카드
- `docs/prd-today-what-to-bring-mvp-production.md` — MVP/Production PRD
- `docs/community-painpoints-research.md` — 커뮤니티 불편 조사
- `docs/wireframe-production-plan.md` — 와이어프레임 제작 계획
- `docs/plans/development-sequence-and-gates.md` — 개발 순서와 단계별 Gate 체크리스트
- `docs/wireframes/today-what-to-bring-wireframe-spec.md` — Gate 2 와이어프레임 스펙
- `docs/wireframes/today-what-to-bring-wireframe.html` — Gate 2 정적 모바일 와이어프레임
- `docs/wireframes/today-what-to-bring-wireframe-review.md` — Gate 2 PRD 대비 리뷰
- `docs/plans/today-what-to-bring-mvp-implementation-plan.md` — Gate 3 MVP 구현 계획
- `docs/reports/today-what-to-bring-plan-review.md` — Gate 3 구현 계획 리뷰

## 다음 작업

1. Gate 4 Apps in Toss 스캐폴딩 진행
2. `app/` 하위에 공식 템플릿 격리 생성/병합
3. `granite.config.ts`의 `appName`/`displayName` 확인
4. dev/build 기본 동작 검증

## MVP 경계

MVP는 로컬 Storage 기반 체크리스트 앱입니다. 로그인, 서버, 알림, 날씨 API, AI 추천, 결제/광고는 제외합니다.
