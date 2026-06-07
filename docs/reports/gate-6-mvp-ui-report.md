# Gate 6 MVP UI Report

**Date:** 2026-06-07  
**Project:** `today-what-to-bring`  
**Gate:** Gate 6B MVP UI Gate  
**Status:** PASS

## Changed Files

- `app/src/App.tsx`
- `app/src/App.css`
- `app/src/index.css`
- `docs/reports/gate-6-mvp-ui-report.md`

## Checklist

- [x] Home supports recent routines, search, view-mode grouping, and checklist sheet opening.
- [x] Open checklist sheet supports check/uncheck progress and `체크만 지우기`.
- [x] Open checklist sheet supports in-memory custom item add.
- [x] Custom items can be deleted without affecting base items.
- [x] Custom item order can be edited with Korean-accessible `위로 이동` and `아래로 이동` controls.
- [x] Base items are visibly marked as `기본 항목 · 삭제 불가` and have no delete controls.
- [x] Recent routines remain in memory only and reflect merged custom item counts while the session is open.
- [x] Settings/reset entry is visible in the sheet with separated scopes:
  - `체크만 지우기`
  - `이 루틴의 커스텀 항목 초기화`
  - `홈 보기/카드 순서 기본값 안내`
- [x] No real persistence, Toss SDK wiring, login/server/push/weather/AI/payment, deploy, publish, commit, or heavy dependency work was added.

## Verification

Run from `app/`.

```bash
npm run lint
```

Result: PASS. `eslint .` completed with exit code 0.

```bash
npx tsc --noEmit
```

Result: PASS. TypeScript completed with exit code 0.

```bash
npm run build
```

Result: PASS. `ait build` completed with exit code 0 and created `today-what-to-bring.ait`.

Build deploymentId from Core re-run: `019ea1e1-3cfb-70be-bd10-e2b578e1c6c7`.

Manual browser smoke check from Core:

- [x] Local dev server opened in browser at `http://127.0.0.1:5173/`.
- [x] Home headline and recent-routine area rendered.
- [x] Search input accepted `여권` and filtered to `해외여행` with `1개` result.
- [x] Routine card opened the checklist sheet.
- [x] Base checklist items showed `기본 항목 · 삭제 불가` and no delete controls.
- [x] Check/uncheck updated progress from `12개 중 0개 완료` to `12개 중 1개 완료`.
- [x] Custom-item section, add input, order/reset/settings controls, and sticky bottom CTA were visible in the sheet.

## Known Gate 7 Deferrals

- Real persistence through Toss Storage SDK remains deferred.
- Home card reorder UI and reset-to-default behavior remain deferred; Gate 6B only shows the reset scope placeholder/ 안내.
- Analytics, SafeArea, NavigationBar, `backEvent`, and deep links remain deferred.
- Login, server sync, push, weather, AI, payment, and production deployment remain deferred.
- Dedicated automated UI tests are not present in the scaffold.
