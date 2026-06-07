# Toss Vibecoding Challenge — 오늘 뭐 챙기지?

| 항목 | 내용 |
|---|---|
| project_name | what-to-bring |
| product_name | 오늘 뭐 챙기지? |
| appName | what-to-bring |
| created_at | 2026-06-07 09:54 KST |
| status | PRD locked / Wireframe planning |
| owner | SidequestLab / Core-directed Lab development |
| canonical_workspace | `/Volumes/external/project/SidequestLab/projects/what-to-bring` |
| previous_workspace | `/Users/namseokyoo/projects/toss-vibecoding-challenge` moved into Lab on 2026-06-07 |
| GitHub | https://github.com/namseokyoo/what-to-bring |

## Description

앱인토스 6월 바이브코딩 챌린지 출품 후보 프로젝트. `오늘 뭐 챙기지?`는 출근, 외출, 운동, 병원, 골프, 캠핑, 국내/해외여행 등 상황별 준비물 체크리스트를 제공하는 Toss Mini App이다.

## Goals

- PRD 기준 MVP 범위를 유지하며 앱인토스 제출 가능한 `.ait` 빌드까지 개발한다.
- 서버/로그인/알림/AI 없이 로컬 Storage 기반의 초경량 체크리스트 경험을 만든다.
- 홈 검색, 보기 모드, 그룹 내부 카드 순서 변경, 체크리스트 바텀시트, 커스텀 항목, 최근 루틴, Analytics 이벤트 계약을 구현한다.

## Non-goals for MVP

- 로그인/서버 동기화
- 푸시 알림
- 위치/날씨 API
- AI 추천 체크리스트
- 의료 판단/병원 추천/예약
- 리워드/포인트/결제/광고

## Stack

- Apps in Toss WebView
- React + TypeScript + Vite
- `@apps-in-toss/web-framework`
- Toss Design System WebView packages
- Apps in Toss Storage API
- Vitest / Testing Library 예정

## Key docs

- PRD: `docs/prd-today-what-to-bring-mvp-production.md`
- Community research: `docs/community-painpoints-research.md`
- Wireframe plan: `docs/wireframe-production-plan.md`

## Current next gate

1. `docs/wireframes/today-what-to-bring-wireframe-spec.md` 작성
2. `docs/wireframes/today-what-to-bring-wireframe.html` 제작
3. `docs/wireframes/today-what-to-bring-wireframe-review.md`로 PRD 대비 리뷰
4. 리뷰 반영 후 Apps in Toss 프로젝트 생성/구현 Gate 진입
