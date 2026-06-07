# 오늘 뭐 챙기지? Gate 2 PRD-vs-Wireframe Review

**Project:** `today-what-to-bring`  
**Product:** `오늘 뭐 챙기지?`  
**Reviewed artifacts:**  
- `docs/wireframes/today-what-to-bring-wireframe-spec.md`
- `docs/wireframes/today-what-to-bring-wireframe.html`

**Review basis:** `docs/prd-today-what-to-bring-mvp-production.md`, `docs/community-painpoints-research.md`, `docs/wireframe-production-plan.md`, `docs/plans/development-sequence-and-gates.md`, `PROJECT.md`, `index.json`

## 1. Executive Conclusion

**Gate 2 blocker status:** blocker 없음.  
**Gate 2 decision:** Gate 2 can proceed to Gate 3 Implementation Plan.

The wireframe artifacts cover the required MVP screens and states without adding app implementation, login, server sync, AI, weather API, push, payment, reward, ads, or other out-of-scope product work.

## 2. Required Artifact Check

| Requirement | Status | Evidence |
|---|---|---|
| Wireframe spec exists | PASS | `today-what-to-bring-wireframe-spec.md` |
| Static HTML wireframe exists | PASS | `today-what-to-bring-wireframe.html` |
| PRD-vs-wireframe review exists | PASS | This file |
| HTML is self-contained | PASS | Inline CSS only; no external script, font, image, stylesheet, or network URL. |
| HTML includes mobile frame | PASS | `.phone` frame with Safe Area, NavigationBar, bottom Safe Area. |
| Review states blocker status | PASS | Section 1 states `blocker 없음`. |
| Review states Gate 3 readiness | PASS | Section 1 states Gate 2 can proceed to Gate 3. |

## 3. Gate 2 Checklist Review

| Gate 2 item | Status | Notes |
|---|---|---|
| Home default state | PASS | Spec S0 and HTML `Home Default / Prep-Flow View / Recent Empty`. |
| Prep-flow view | PASS | Spec S1 and HTML prep-flow frame show `지금`, `오늘·내일`; spec includes `미리`. |
| Category view | PASS | Spec S2 and HTML category frame. |
| Search focus/results/empty | PASS | Spec S3 and HTML search frame include focus, results, empty, clear, keyboard area. |
| Recent empty/populated | PASS | Spec S4 and HTML home/category frames. |
| Checklist bottom sheet default | PASS | Spec S6 and HTML bottom sheet frame. |
| Checklist checked state | PASS | Spec S7 and HTML checked item rows/progress. |
| Checklist all-complete state | PASS | Spec S7 and HTML all-complete frame. |
| Custom item add/delete/order | PASS | Spec S8 and HTML custom validation/bottom sheet frames. |
| Default-vs-custom distinction | PASS | Spec S9 and HTML `기본` / `내 항목` pills and separate sections. |
| Reset actions are separated | PASS | Spec S11 and HTML settings/reset frames. |
| Storage/error/fallback states | PASS | Spec S12 and HTML settings/save-error frames. |
| Toss Safe Area/mobile constraints | PASS | Spec S13 and every HTML phone frame show Safe Area; target width is 390px. |
| No MVP-excluded features | PASS | No login, server, AI, weather API, push, payment, reward, ads, medical recommendation, or booking UI. |

## 4. PRD Functional Coverage

| PRD feature | Status | Wireframe mapping |
|---|---|---|
| F1 Home screen | PASS | S0-S5; home title, subtitle, search, recent, grouped cards, view modes, order edit. |
| F2 Checklist bottom sheet | PASS | S6-S7, S10-S11; bottom sheet entry, progress, checklist, reset, close. |
| F3 Custom items | PASS | S8-S9; add, duplicate/empty validation, delete, up/down order, base item deletion disallowed. |
| F4 Home view mode and card order | PASS | S1-S2, S5; mode switch, group-internal order, scoped reset. |
| F5 Recent routines | PASS | S4; max 3, source tracking, no main list reorder. |
| F6 User routine storage/default restore | PASS | S8-S12; overrides only, default read-only view, routine reset, storage fallback. |
| F7 Home search | PASS | S3; title/category/tag search, no raw query storage/analytics. |
| F8 Completion feedback | PASS | S7; partial, clear checks, all complete copy. |

## 5. MVP Boundary Review

| Item | Status | Decision |
|---|---|---|
| Login/account | PASS | Not present. |
| Server sync/backend | PASS | Not present; local storage only. |
| Push notification | PASS | Not present. |
| Location/weather API | PASS | Not present; `비 오는 날` remains manual routine card. |
| AI recommendation | PASS | Not present. |
| Medical advice/booking/recommendation | PASS | Not present; hospital remains checklist-only. |
| Rewards/points/payment/ads | PASS | Not present. |
| Social sharing | PASS | Not present. |
| External URL/iframe core flow | PASS | Not present. |
| Actual app scaffold/React/Vite implementation | PASS | Not present; artifacts are docs/static HTML only. |

## 6. Issues and Deferrals

| Type | Status | Detail | Gate impact |
|---|---|---|---|
| ISSUE | PASS | No blocker issues found in PRD coverage. | None. |
| DEFER | DEFER | Drag-and-drop ordering is not designed. Wireframe uses up/down buttons per PRD MVP allowance. | Not a blocker. |
| DEFER | DEFER | Base and custom items are not fully interleaved. This is explicitly v0.2+ in PRD. | Not a blocker. |
| DEFER | DEFER | Persisted checked state is not designed. PRD says checked state is session-only for MVP. | Not a blocker. |
| DEFER | DEFER | Weather/AI/reminder/share/server extensions are not designed. PRD marks them out of MVP or production candidates. | Not a blocker. |

## 7. Toss UX and Policy Review

| Risk | Status | Notes |
|---|---|---|
| Automatic intrusive modal on entry | PASS | Bottom sheet opens only after routine selection. |
| Navigation/Safe Area overlap | PASS | Spec requires Safe Area top/bottom and HTML shows explicit areas. |
| Keyboard hides search results | PASS | Search frame shows keyboard area and states that results stay visible above it. |
| Destructive action confusion | PASS | Reset scopes are named separately and full delete requires confirmation. |
| Permission prompt | PASS | No permission UI or copy. |
| Medical policy confusion | PASS | Hospital is checklist-only; no recommendation/booking/advice. |
| Data privacy | PASS | Raw search/custom item labels excluded from Analytics payload guidance. |

## 8. Implementation Risk Notes for Gate 3

| Risk | Status | Gate 3 recommendation |
|---|---|---|
| Reset scope bugs | ISSUE | Gate 3 should add reducer tests for `체크만 지우기`, `기본값으로 돌리기`, card order reset, and full storage delete separately. Not a Gate 2 blocker. |
| Storage fallback | ISSUE | Gate 3 should test corrupted JSON, Storage API failure, and quota/save failure. Not a Gate 2 blocker. |
| Analytics payload leakage | ISSUE | Gate 3 should define allowlisted event wrappers before UI wiring. Not a Gate 2 blocker. |
| Small-screen text fit | ISSUE | Gate 3 should include 360/390/420px viewport QA and font-size enlargement checks. Not a Gate 2 blocker. |
| Bottom sheet/back behavior | ISSUE | Gate 3 should specify `search focus -> nested sheet -> checklist sheet -> miniapp back` handling and cleanup. Not a Gate 2 blocker. |

## 9. Final Gate 2 Decision

**PASS.** The Gate 2 wireframe set satisfies the documented artifact requirements and required screen-state coverage.  
**Blockers:** none.  
**Proceed:** Gate 2 can proceed to Gate 3 Implementation Plan.
