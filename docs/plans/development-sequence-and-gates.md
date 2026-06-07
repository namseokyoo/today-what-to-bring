# today-what-to-bring Development Sequence and Gate Checklist

> **For Hermes/Core:** 이 문서는 `오늘 뭐 챙기지?` 개발을 일반적인 제품 개발 순서에 맞춰 진행하기 위한 기준 계획이다. 각 단계는 이전 Gate를 통과한 뒤 다음 단계로 넘어간다.

**작성일:** 2026-06-07 13:44 KST  
**프로젝트:** `today-what-to-bring`  
**제품명:** 오늘 뭐 챙기지?  
**appName:** `today-what-to-bring`  
**Repo:** https://github.com/namseokyoo/today-what-to-bring  
**기준 PRD:** `docs/prd-today-what-to-bring-mvp-production.md`  
**현재 상태:** PRD locked / Wireframe Gate 준비

---

## 0. 운영 원칙

1. **Gate 순서 준수**  
   PRD → 와이어프레임 → 구현계획 → 스캐폴딩 → 데이터 모델 → MVP UI → Storage/SDK → QA → 제출 순서로 진행한다.

2. **MVP 범위 고정**  
   로그인, 서버 동기화, 푸시, 날씨 API, AI 추천, 의료 판단/예약, 리워드/결제/광고는 MVP에서 제외한다.

3. **검증 없는 다음 단계 금지**  
   각 단계는 산출물, 체크리스트, 커밋, 필요 시 리뷰를 남긴 뒤 다음 단계로 이동한다.

4. **작업 단위**  
   기능 구현 단계부터는 작은 커밋 단위로 진행한다. 가능하면 화면/모델/테스트 단위로 나눈다.

5. **Lab 운영 방식**  
   Core가 계획·검증을 담당하고, 실제 구현은 필요 시 Codex/OMX에 명확한 task 단위로 전달한다. Discord thread는 진행 보고, GitHub repo는 산출물 기준점이다.

---

## 전체 개발 흐름

| 순서 | 단계 | 목적 | 핵심 산출물 | 다음 단계 진입 조건 |
|---:|---|---|---|---|
| 1 | PRD Baseline Gate | 요구사항 고정 | PRD, research | PRD 모순/미정 항목 없음 |
| 2 | Wireframe Gate | 화면/상태 확정 | wireframe spec/html/review | PRD 대비 누락·초과 없음 |
| 3 | Implementation Plan Gate | 구현 작업 단위 확정 | MVP implementation plan | 파일 구조/테스트/커밋 단위 명확 |
| 4 | Scaffolding Gate | 앱 프로젝트 생성 | Apps in Toss app skeleton | dev/build 기본 동작 |
| 5 | Domain Model Gate | 데이터/상태 모델 확정 | types, template data, tests | 모델 테스트 통과 |
| 6 | MVP UI Gate | 핵심 화면 구현 | home/search/sheet/custom UI | 주요 사용자 플로우 동작 |
| 7 | Storage & SDK Gate | 플랫폼 기능 연동 | Storage, Navigation, SafeArea, Analytics | 재진입/저장/딥링크 검증 |
| 8 | QA Gate | 품질 검증 | QA report, bugfix commits | 제출 차단 버그 없음 |
| 9 | Build/Submission Gate | 제출 준비 | `.ait` build, submission notes | 제출 패키지 검증 완료 |
| 10 | Post-submit Gate | 회고/다음 버전 준비 | retrospective, roadmap | MVP 이후 범위 정리 |

---

## Gate 1. PRD Baseline Gate

**목적:** 구현자가 더 이상 요구사항을 추측하지 않도록 PRD를 기준 문서로 고정한다.

### 산출물

- `docs/prd-today-what-to-bring-mvp-production.md`
- `docs/community-painpoints-research.md`
- `PROJECT.md`
- `index.json`

### 체크리스트

- [ ] 제품명은 `오늘 뭐 챙기지?`로 통일되어 있다.
- [ ] `project_name`, folder, repo, appName은 `today-what-to-bring`으로 통일되어 있다.
- [ ] MVP 범위와 production scope가 분리되어 있다.
- [ ] MVP 제외 범위가 명확히 적혀 있다.
- [ ] Toss Mini App/Apps in Toss 제약이 PRD에 반영되어 있다.
- [ ] Storage/Analytics/SafeArea/NavigationBar/backEvent 관련 요구가 적혀 있다.
- [ ] 커뮤니티 painpoint 조사 결과가 PRD에 연결되어 있다.
- [ ] 구현 전에 추가 질문이 필요한 미정 항목이 없다.

### 통과 기준

- PRD와 메타 문서 내 이름/경로/appName이 충돌하지 않는다.
- MVP 구현에 필요한 화면, 데이터, 정책, 검수 기준이 PRD에 존재한다.

---

## Gate 2. Wireframe Gate

**목적:** 코드 작성 전에 화면 구조와 상태를 확정한다.

### 산출물

- `docs/wireframes/today-what-to-bring-wireframe-spec.md`
- `docs/wireframes/today-what-to-bring-wireframe.html`
- `docs/wireframes/today-what-to-bring-wireframe-review.md`

### 작업 순서

1. PRD 기준 화면 목록을 추출한다.
2. 화면별 상태를 정의한다.
3. 정적 HTML 모바일 와이어프레임을 만든다.
4. PRD 대비 누락/초과 여부를 리뷰한다.
5. 리뷰 결과를 반영하거나 보류 사유를 기록한다.

### 체크리스트

- [ ] 홈 기본 상태가 있다.
- [ ] 준비 흐름별 보기 상태가 있다.
- [ ] 카테고리별 보기 상태가 있다.
- [ ] 검색 focus/results/empty 상태가 있다.
- [ ] 최근 루틴 empty/populated 상태가 있다.
- [ ] 체크리스트 바텀시트 기본/체크됨/전체완료 상태가 있다.
- [ ] 커스텀 항목 추가/삭제/순서 변경 상태가 있다.
- [ ] 기본 항목과 커스텀 항목의 차이가 UI에 드러난다.
- [ ] reset 동작이 `체크만 지우기`, `기본값으로 돌리기`, `저장된 변경 삭제`로 혼동 없이 표현된다.
- [ ] 로그인/서버/AI/날씨/푸시/결제 등 MVP 제외 범위가 와이어프레임에 들어가지 않았다.
- [ ] Toss WebView Safe Area와 하단 조작 영역을 고려했다.
- [ ] 모바일 360~420px 폭에서 읽을 수 있다.

### 통과 기준

- `wireframe-review.md`에서 PRD 대비 누락/초과 항목이 `blocker 없음`으로 결론난다.
- 구현자가 화면 구조를 보고 컴포넌트 단위로 나눌 수 있다.

---

## Gate 3. Implementation Plan Gate

**목적:** 실제 구현을 작은 작업 단위로 쪼개고 테스트/검증 방법을 먼저 정한다.

### 산출물

- `docs/plans/today-what-to-bring-mvp-implementation-plan.md`
- 필요 시 `docs/reports/today-what-to-bring-plan-review.md`

### 구현계획에 포함할 항목

- 프로젝트 폴더 구조
- 라우팅/화면 구조
- 컴포넌트 목록
- TypeScript 타입
- 기본 템플릿 데이터 파일
- Storage adapter
- Analytics event wrapper
- 테스트 전략
- 커밋 순서
- 각 task별 검증 명령

### 체크리스트

- [ ] task가 2~5분 단위의 작은 실행 단위로 나뉘어 있다.
- [ ] 각 task에 수정/생성 파일 경로가 있다.
- [ ] 각 task에 검증 명령이 있다.
- [ ] 타입/데이터 모델 구현이 UI 구현보다 먼저 배치되어 있다.
- [ ] Storage/SDK는 mock adapter로 먼저 검증한 뒤 실제 SDK로 연결한다.
- [ ] 구현 전 plan review gate가 있다.
- [ ] MVP 제외 범위를 다시 확인하는 항목이 있다.

### 통과 기준

- 구현자가 계획서만 보고 순서대로 작업할 수 있다.
- Core가 task 단위로 Codex/OMX에 전달 가능한 수준이다.

---

## Gate 4. Scaffolding Gate

**목적:** Apps in Toss WebView 앱의 기본 프로젝트를 만들고 실행/빌드 기반을 확보한다.

### 예상 작업

```bash
npx create-ait-app today-what-to-bring
```

생성 후 repo 루트와 충돌하지 않도록 실제 생성 위치를 먼저 정한다. 이미 repo 루트가 존재하므로 템플릿 생성 결과를 병합하거나 `app/` 하위로 둘지 Implementation Plan에서 확정한다.

### 체크리스트

- [ ] `granite.config.ts`가 존재한다.
- [ ] `appName`이 `today-what-to-bring`이다.
- [ ] `displayName`이 `오늘 뭐 챙기지?`이다.
- [ ] React + TypeScript + Vite 구조가 확인된다.
- [ ] `npm install` 또는 지정 패키지 매니저 설치가 성공한다.
- [ ] dev server가 실행된다.
- [ ] production build가 성공한다.
- [ ] repo root, docs, app source 구조가 명확하다.
- [ ] `.gitignore`가 node/build/env 산출물을 제외한다.

### 통과 기준

- 로컬 dev server와 build가 모두 성공한다.
- appName/displayName 설정이 PRD와 일치한다.

---

## Gate 5. Domain Model Gate

**목적:** UI가 흔들리지 않도록 기본 데이터와 상태 모델을 먼저 고정한다.

### 예상 파일

- `src/domain/routine.ts`
- `src/domain/templateRoutines.ts`
- `src/domain/storageSchema.ts`
- `src/domain/viewModes.ts`
- `src/domain/__tests__/routine.test.ts`

### 체크리스트

- [ ] `RoutineCard` 타입이 있다.
- [ ] `ChecklistItem` 타입이 있다.
- [ ] `TemplateRoutine`과 `UserRoutineOverride`가 분리되어 있다.
- [ ] `SessionCheckState`가 Storage 저장 대상과 분리되어 있다.
- [ ] home view mode가 `prepFlow`, `category` 등 명확한 enum으로 표현된다.
- [ ] 그룹별 기본 카드 순서가 정의되어 있다.
- [ ] 검색 태그/카테고리/준비 흐름 메타데이터가 있다.
- [ ] Storage schema version이 있다.
- [ ] 기본 템플릿 병합 테스트가 있다.
- [ ] 사용자 커스텀 항목 병합 테스트가 있다.

### 통과 기준

- 모델/병합/정렬 테스트가 통과한다.
- UI 구현자가 임의 데이터 구조를 만들 필요가 없다.

---

## Gate 6. MVP UI Gate

**목적:** 사용자가 실제로 준비물 체크리스트를 찾고 체크할 수 있는 핵심 UI를 구현한다.

### 구현 순서

1. App shell / layout
2. Home header
3. Search input
4. View mode segmented control
5. Grouped routine list
6. Routine card
7. Checklist bottom sheet
8. Check/uncheck interactions
9. Custom item add/delete
10. Custom item order edit
11. Recent routines
12. Settings/reset entry

### 체크리스트

- [ ] 홈 진입 5초 안에 서비스 목적을 이해할 수 있다.
- [ ] 준비 흐름별/카테고리별 전환이 된다.
- [ ] 검색 결과/empty 상태가 동작한다.
- [ ] 루틴 카드를 누르면 체크리스트 바텀시트가 열린다.
- [ ] 체크박스 상태가 즉시 반영된다.
- [ ] 커스텀 항목 추가/삭제가 된다.
- [ ] 커스텀 항목 순서 변경이 된다.
- [ ] 기본 항목은 삭제 불가임이 UI상 명확하다.
- [ ] 최근 루틴이 노출된다.
- [ ] reset 동작이 오작동 없이 분리되어 있다.
- [ ] 모바일 폭에서 주요 CTA가 가려지지 않는다.

### 통과 기준

- 핵심 happy path가 수동 QA에서 통과한다.
- PRD/와이어프레임 대비 누락 화면이 없다.

---

## Gate 7. Storage & Apps in Toss SDK Gate

**목적:** Toss 환경에서 필요한 저장/네비게이션/분석 연동을 안전하게 붙인다.

### 체크리스트

- [ ] Storage key는 `today-what-to-bring:v1:app-storage`이다.
- [ ] 사용자 커스텀 항목이 재진입 후 복원된다.
- [ ] 체크 상태는 세션성으로 동작한다.
- [ ] 저장 실패 시 fallback UX가 있다.
- [ ] SDK 미사용/로컬 개발 환경에서도 mock adapter로 동작한다.
- [ ] SafeArea가 적용되어 있다.
- [ ] NavigationBar 설정이 적용되어 있다.
- [ ] backEvent가 바텀시트 닫기/앱 뒤로가기와 충돌하지 않는다.
- [ ] Analytics 이벤트 이름과 payload가 PRD와 일치한다.
- [ ] 딥링크 값이 `intoss://today-what-to-bring` / `intoss-private://today-what-to-bring`와 일치한다.

### 통과 기준

- 저장/복원/뒤로가기/딥링크/분석 이벤트가 로컬 또는 공식 테스트 환경에서 검증된다.

---

## Gate 8. QA Gate

**목적:** 제출 전 차단 버그와 정책 리스크를 제거한다.

### 산출물

- `docs/reports/today-what-to-bring-mvp-qa.md`
- 필요 시 bugfix commits

### 체크리스트

- [ ] PRD acceptance criteria를 모두 확인했다.
- [ ] 와이어프레임 review의 blocker가 없다.
- [ ] TypeScript typecheck가 통과한다.
- [ ] unit tests가 통과한다.
- [ ] build가 통과한다.
- [ ] 모바일 화면 수동 QA가 통과한다.
- [ ] 검색/empty/recent/reset edge case가 통과한다.
- [ ] Storage 장애 fallback을 확인했다.
- [ ] 다크패턴/오해 유발/의료 판단성 문구가 없다.
- [ ] 접근성 기본 기준: 터치 영역, 색 대비, 텍스트 크기를 확인했다.

### 통과 기준

- `must fix` 또는 `blocker`가 0개다.
- 제출 전 남은 이슈는 명시적으로 `defer` 처리되어 있다.

---

## Gate 9. Build / Submission Gate

**목적:** 앱인토스 제출 가능한 패키지와 제출 문구를 준비한다.

### 산출물

- `.ait` build artifact 또는 공식 제출 산출물
- `docs/reports/today-what-to-bring-submission-check.md`
- 제출용 앱 설명/챌린지 설명

### 체크리스트

- [ ] production build가 성공한다.
- [ ] `.ait` 제출 산출물이 생성된다.
- [ ] 앱 이름/설명/appName/displayName/icon/primaryColor가 충돌하지 않는다.
- [ ] 앱인토스 콘솔 설정과 repo 설정이 일치한다.
- [ ] 제출 설명문이 챌린지 주제 “일상이 편해지는 순간”과 연결된다.
- [ ] 개인정보/민감정보 저장 이슈가 없다.
- [ ] 사용자가 오해할 수 있는 의료/위험 상황 문구가 없다.
- [ ] 최종 smoke test가 통과한다.

### 통과 기준

- 제출 파일과 제출 문구가 준비되어 있고, 재현 가능한 빌드 명령이 문서화되어 있다.

---

## Gate 10. Post-submit / Next Version Gate

**목적:** MVP 제출 이후의 개선 범위를 정리하고 production scope로 넘어갈지 판단한다.

### 산출물

- `docs/reports/today-what-to-bring-retrospective.md`
- `docs/plans/today-what-to-bring-post-mvp-roadmap.md`

### 체크리스트

- [ ] 제출 후 발견된 문제를 기록했다.
- [ ] MVP에서 의도적으로 제외한 항목을 다시 검토했다.
- [ ] production 후보 기능을 우선순위화했다.
- [ ] 실제 사용/피드백 기반 개선 항목과 추측 기반 개선 항목을 구분했다.
- [ ] 다음 작업을 `bugfix`, `polish`, `production expansion`으로 분류했다.

### 통과 기준

- MVP 이후 작업이 무작정 확장되지 않고, 다음 실험/개선 단위로 정리되어 있다.

---

## 바로 다음 실행 항목

현재는 Gate 1이 사실상 완료된 상태이므로 다음 작업은 Gate 2다.

1. `docs/wireframes/today-what-to-bring-wireframe-spec.md` 작성
2. `docs/wireframes/today-what-to-bring-wireframe.html` 제작
3. `docs/wireframes/today-what-to-bring-wireframe-review.md` 작성
4. review 통과 후 `docs/plans/today-what-to-bring-mvp-implementation-plan.md` 작성

---

## Gate 진행 로그 템플릿

각 Gate 완료 시 아래 형식으로 해당 report 또는 decision log에 남긴다.

```md
## Gate N 완료 기록

- 완료일:
- 담당:
- 산출물:
- 검증 명령:
- 통과 체크리스트:
- 발견 이슈:
- defer 항목:
- 다음 Gate:
```
