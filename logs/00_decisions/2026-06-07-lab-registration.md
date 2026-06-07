# Lab 프로젝트 등록 결정 — what-to-bring

**일시:** 2026-06-07 09:54 KST  
**결정:** 기존 `/Users/namseokyoo/projects/toss-vibecoding-challenge` 작업 폴더를 SidequestLab 프로젝트로 등록하고 canonical workspace를 Lab 경로 `/Volumes/external/project/SidequestLab/projects/what-to-bring`으로 전환한다.

## 배경

`오늘 뭐 챙기지?` PRD가 출품/구현 착수 가능한 수준으로 정리되었고, 형이 Lab을 통해 개발/출품하는 프로젝트로 운영하라고 지시했다.

## 적용 범위

- canonical workspace: `/Volumes/external/project/SidequestLab/projects/what-to-bring`
- 이전 standalone workspace: `/Users/namseokyoo/projects/toss-vibecoding-challenge`는 Lab 경로로 이동 후 제거
- Lab historian 구조 파일/디렉터리 생성
- `_company/PROJECTS.md`에 진행중 Lab 프로젝트로 등록 예정

## 기준 문서

- PRD: `docs/prd-today-what-to-bring-mvp-production.md`
- 커뮤니티 조사: `docs/community-painpoints-research.md`
- 와이어프레임 플랜: `docs/wireframe-production-plan.md`

## 운영 원칙

- Core는 라우터/검수자 역할을 유지한다.
- Lab 개발은 이 workspace를 기준으로 진행한다.
- MVP 범위는 PRD에 고정한다.
- 와이어프레임 Gate 완료 전에는 앱 구현으로 넘어가지 않는다.

## 다음 Gate

1. 와이어프레임 spec 작성
2. 정적 HTML 와이어프레임 제작
3. PRD 대비 와이어프레임 리뷰
4. 리뷰 반영 후 Apps in Toss MVP 구현 착수
