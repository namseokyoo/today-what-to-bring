# today-what-to-bring MVP Implementation Plan

**Project:** `today-what-to-bring`  
**Product:** 오늘 뭐 챙기지?  
**Artifact:** Gate 3 implementation plan  
**Status:** Ready for Gate 3 review  
**Next gate:** Gate 4 Scaffolding Gate  
**Source docs:** `PROJECT.md`, `index.json`, `README.md`, `docs/prd-today-what-to-bring-mvp-production.md`, `docs/community-painpoints-research.md`, `docs/wireframe-production-plan.md`, `docs/plans/development-sequence-and-gates.md`, `docs/wireframes/today-what-to-bring-wireframe-spec.md`, `docs/wireframes/today-what-to-bring-wireframe-review.md`

## 1. Scope Lock

This document is an implementation plan only. Gate 3 must not scaffold or implement the app.

### In Scope

- Sequential implementation plan for a coding executor.
- Source location decision.
- Apps in Toss scaffold strategy that avoids repo root and docs collisions.
- Folder/file structure.
- TypeScript domain model list.
- Template data plan.
- Storage adapter plan.
- Analytics payload allowlist.
- Component map.
- State/reducer map.
- Test strategy.
- QA/build commands.
- Commit sequence.
- Small task decomposition with files, steps, verification, commit suggestion, and stop condition.

### Out of Scope

- Running `npx create-ait-app today-what-to-bring`.
- Creating `app/package.json`, `app/src/`, `app/granite.config.ts`, or any React/Vite/TypeScript source in this gate.
- Implementing app code.
- Adding dependencies.
- Updating app metadata beyond future implementation guidance.

### MVP Exclusions Reconfirmed

MVP explicitly excludes login/account, server sync/backend, weather API/location integration, AI recommendation, push notifications, payment, reward/points, ads, social core flow, and medical advice/recommendation/booking. The `병원` routine remains a personal checklist only.

## 2. Source Location Decision

The app source will live under `app/`.

Reasoning:

- The repo root already contains project governance docs, wireframes, reports, logs, metrics, and artifacts.
- `npx create-ait-app today-what-to-bring` creates an app project with files such as `package.json`, `src/`, and `granite.config.ts`; running it in the repo root would collide with documentation-first project layout.
- `app/` keeps Apps in Toss code, dependencies, build outputs, and tests isolated while preserving root docs as gate artifacts.

Gate 4 must create `app/` from an isolated scaffold and must not overwrite root `README.md`, `PROJECT.md`, `index.json`, `docs/`, `logs/`, `metrics/`, or `artifacts/`.

## 3. Gate 4 Scaffold Strategy

Do not scaffold during Gate 3. In Gate 4, use an isolated temporary parent directory, then move/copy the generated app contents into repo `app/`.

Planned Gate 4 command sequence:

```bash
mkdir -p /tmp/today-what-to-bring-scaffold
cd /tmp/today-what-to-bring-scaffold
npx create-ait-app today-what-to-bring
rsync -a today-what-to-bring/ /Volumes/external/project/SidequestLab/projects/today-what-to-bring/app/
cd /Volumes/external/project/SidequestLab/projects/today-what-to-bring/app
npm install
npm run build
```

After scaffold:

- Confirm `app/granite.config.ts` exists.
- Set `appName` to `today-what-to-bring`.
- Set `displayName` to `오늘 뭐 챙기지?`.
- Keep `permissions: []` unless the official template requires a different empty form.
- Confirm build output stays under `app/`.
- Add or update root `.gitignore` only if generated node/build outputs are not already excluded.

Stop condition for Gate 4 scaffold: stop and report if the generated template structure does not match the official Apps in Toss expectations or if moving into `app/` would lose required scaffold files.

## 4. Planned Folder Structure

```text
app/
├─ granite.config.ts
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
├─ src/
│  ├─ App.tsx
│  ├─ main.tsx
│  ├─ styles/
│  │  ├─ global.css
│  │  └─ tokens.ts
│  ├─ domain/
│  │  ├─ ids.ts
│  │  ├─ routineTypes.ts
│  │  ├─ templateRoutines.ts
│  │  ├─ grouping.ts
│  │  ├─ search.ts
│  │  ├─ mergeRoutine.ts
│  │  ├─ routineReducer.ts
│  │  ├─ storageSchema.ts
│  │  └─ __tests__/
│  ├─ ports/
│  │  ├─ StoragePort.ts
│  │  └─ AnalyticsPort.ts
│  ├─ adapters/
│  │  ├─ appStorage.ts
│  │  ├─ memoryStorage.ts
│  │  ├─ analytics.ts
│  │  ├─ safeArea.ts
│  │  └─ backEvent.ts
│  ├─ state/
│  │  ├─ appState.ts
│  │  ├─ appReducer.ts
│  │  ├─ useAppController.ts
│  │  └─ selectors.ts
│  ├─ components/
│  │  ├─ AppShell.tsx
│  │  ├─ SearchBox.tsx
│  │  ├─ RecentRoutines.tsx
│  │  ├─ ViewModeSegmentedControl.tsx
│  │  ├─ RoutineGroup.tsx
│  │  ├─ RoutineCard.tsx
│  │  ├─ CardOrderEditor.tsx
│  │  ├─ ChecklistSheet.tsx
│  │  ├─ ChecklistItemRow.tsx
│  │  ├─ CustomItemEditor.tsx
│  │  ├─ DefaultItemsPanel.tsx
│  │  ├─ ResetSettingsPanel.tsx
│  │  └─ Notice.tsx
│  └─ test/
│     ├─ setup.ts
│     └─ fixtures.ts
└─ docs/
   └─ implementation-notes.md
```

`app/docs/` is optional and app-local only. Project-level documentation remains in root `docs/`.

## 5. TypeScript Domain Model List

Create domain types before UI work.

- `RoutineId`: `commute`, `outing`, `workout`, `rainy`, `hospital`, `grocery`, `childSchool`, `businessTrip`, `golf`, `camping`, `domesticTravel`, `overseasTravel`, `hiking`.
- `PrepFlowGroup`: `now`, `todayTomorrow`, `early`.
- `CategoryGroup`: `daily`, `health`, `family`, `work`, `leisure`.
- `HomeViewMode`: `prepFlow`, `category`.
- `ChecklistItemType`: `base`, `custom`.
- `ChecklistItem`: id, label, type.
- `TemplateRoutine`: id, title, hint, prepFlowGroup, categoryGroup, tags, baseItems.
- `CustomItem`: id, label, createdAt.
- `RoutineOverride`: routineId, customItems, customItemOrder.
- `CardOrderOverrides`: per view mode and group routine id arrays.
- `RecentRoutine`: routineId, lastOpenedAt.
- `AppStorageV1`: schemaVersion, homeViewMode, routineOverrides, cardOrderOverrides, recentRoutineIds.
- `SessionCheckState`: open routine id and checked item ids, never persisted.
- `StorageLoadResult`: ok/data or fallback/error.
- `NoticeState`: success/warning/error copy.

## 6. Template Data Plan

`templateRoutines.ts` will export immutable `TemplateRoutine[]` covering the 13 PRD cards. Each routine includes title, hint, prep-flow group, category group, tags, and base item labels.

Template decisions:

- Keep routine titles exactly as PRD/wireframe: `출근`, `외출`, `운동`, `비 오는 날`, `병원`, `퇴근길 장보기`, `아이 등원/등교`, `출장/외근`, `골프`, `캠핑`, `국내여행`, `해외여행`, `등산`.
- Include community-research-backed items already present in the PRD: overseas `멀티어댑터`, camping `세제/수세미/키친타월`, golf `볼마커`, hiking `손전등/헤드랜턴, 선택`.
- Freeze or treat template arrays as readonly. User changes must never mutate template objects.
- Keep base and custom sections separate in MVP.
- Do not include weather API output, AI suggestions, external links, or medical advice.

## 7. Storage Adapter Plan

Storage key: `today-what-to-bring:v1:app-storage`.

Create a `StoragePort` interface before Apps in Toss SDK wiring:

```ts
interface StoragePort {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}
```

Adapters:

- `memoryStorage.ts`: local/test adapter for Vitest and non-Toss development.
- `appStorage.ts`: Apps in Toss Storage wrapper using `Storage.getItem`, `Storage.setItem`, and `Storage.removeItem`.
- `storageSchema.ts`: parse, validate, migrate, serialize, and fallback helpers.

Fallback rules:

- Missing key returns default app state.
- Corrupted JSON returns default app state plus non-blocking load warning.
- Schema mismatch attempts migration; if migration fails, fallback to template defaults.
- Save failure keeps in-memory UI state if possible and shows `변경사항을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.`
- Full delete removes only the app storage key and resets in-memory state to template defaults.
- `AsyncStorage` must not be used.

Gate 2 risks covered here: storage fallback and reset scope bugs.

## 8. Analytics Payload Allowlist

All analytics calls must go through `analytics.ts`. Free-form text is never allowed in event payloads. This section intentionally includes the required label: Analytics payload allowlist.

Allowed events and payloads:

| Event | Allowed payload only | Forbidden payload |
|---|---|---|
| `select_routine` | `routine_id`, `source`, `view_mode`, `group_id` | routine title, search query |
| `view_bottom_sheet` | `routine_id`, `base_count`, `custom_count` | item labels |
| `check_item` | `routine_id`, `item_type`, `checked`, `checked_count`, `total_count` | item label, custom label |
| `search_routine` | `query_type`, `result_count`, `matched_routine_ids` | raw query |
| `add_custom_item` | `routine_id`, `custom_count` | custom item label |
| `reset_to_default` | `scope`, `routine_id` optional, `view_mode` optional, `group_id` optional | deleted labels |
| `view_default_items` | `routine_id`, `base_count` | base item labels |
| `reorder_card` | `view_mode`, `group_id`, `routine_id`, `direction` | group label copy |
| `complete_routine` | `routine_id`, `total_count`, `custom_count` | item labels |

Implementation guardrails:

- Export typed event builders with exact payload shapes.
- Reject extra keys in tests.
- Normalize `source` to `home`, `search`, or `recent`.
- Use installed SDK types to choose `Analytics.Press`/`Analytics.Impression`/`Analytics.Area` or `Analytics.click`/`Analytics.impression`.
- Page movement analytics may remain automatic if the SDK provides it.

Gate 2 risk covered here: analytics payload leakage.

## 9. Component Map

| Component | Responsibility | Inputs | Events |
|---|---|---|---|
| `AppShell` | Safe area, NavigationBar-aware layout, notices | app state, safe area | none |
| `SearchBox` | query input, clear, focus state | query, results count | query changed, clear, focus release |
| `RecentRoutines` | max 3 recent routines | recent routine ids | select routine |
| `ViewModeSegmentedControl` | prep-flow/category toggle | selected mode | change mode |
| `RoutineGroup` | group header and card list | group, routines, edit state | enter edit, reset order |
| `RoutineCard` | routine entry card | routine, source | select routine |
| `CardOrderEditor` | up/down card order controls | group order | move card, finish |
| `ChecklistSheet` | bottom sheet shell and progress | open routine state | close, clear checks, reset |
| `ChecklistItemRow` | checkbox row, base/custom distinction | item, checked | check, delete, move custom |
| `CustomItemEditor` | add validation and submit | input state | add custom item |
| `DefaultItemsPanel` | read-only base template panel | routine base items | close |
| `ResetSettingsPanel` | scoped reset/full delete controls | storage summary | reset actions |
| `Notice` | success/warning/error feedback | notice state | dismiss |

Small-screen requirements:

- Test 360, 390, and 420px widths.
- Touch targets at least 44px.
- Korean copy must wrap without overlapping controls.
- Bottom sheet controls must clear bottom safe area.
- Use text labels for base/custom/error/success, not color alone.

Gate 2 risk covered here: small-screen text fit.

## 10. State and Reducer Map

Use React state plus reducers. Avoid storing derived state when selectors can compute it.

Persistent state:

- `homeViewMode`
- `cardOrderOverrides`
- `routineOverrides`
- `recentRoutineIds`

Session-only state:

- `searchQuery`
- `searchFocused`
- `openRoutineId`
- `checkedItemIds`
- `defaultItemsPanelOpen`
- `cardOrderEditTarget`
- `customItemDraft`
- `notice`
- `storageStatus`

Reducers/actions:

- `loadStorageSucceeded`
- `loadStorageFailedFallback`
- `changeHomeViewMode`
- `openRoutine`
- `closeRoutine`
- `releaseSearchFocus`
- `toggleCheckItem`
- `clearChecks`
- `addCustomItem`
- `deleteCustomItem`
- `moveCustomItem`
- `resetRoutineOverride`
- `moveCardWithinGroup`
- `resetCardOrderGroup`
- `resetHomeViewMode`
- `deleteAllStoredChanges`
- `openDefaultItemsPanel`
- `closeDefaultItemsPanel`
- `setNotice`

Back behavior priority:

1. If search is focused, release focus and keep the user on home.
2. Else if default-items nested panel is open, close that panel.
3. Else if checklist bottom sheet is open, close it and clear `SessionCheckState`.
4. Else let the Toss miniapp default back/close behavior run.

Register `graniteEvent.addEventListener('backEvent')` only after scaffold and SDK verification. Cleanup on unmount is required.

Gate 2 risk covered here: bottom sheet/back behavior.

## 11. Test Strategy

Unit tests first:

- Search matching by title/category/tags.
- Search empty result.
- Search analytics builder excludes raw query.
- Template merge keeps base template immutable.
- Custom item add/delete/reorder.
- Empty/duplicate/custom label validation.
- Reset scopes: `체크만 지우기`, `기본값으로 돌리기`, `홈 보기 기본값으로 돌리기`, `카드 순서 초기화`, `저장된 변경값 모두 삭제`.
- Storage parse/serialize/migration.
- Corrupted JSON fallback.
- Storage API/quota failure fallback.
- Analytics event builders reject extra payload keys.

Component/integration tests:

- Home default renders recent empty, search, view mode, groups.
- View mode switch renders category groups.
- Routine card opens checklist sheet.
- Check/uncheck updates progress and complete banner.
- Custom item validation and section distinction.
- Base item has no delete control.
- Search result card opens same checklist sheet.
- Back behavior priority using mocked back event.

Manual QA:

- Mobile widths: 360, 390, 420px.
- Font enlargement/text wrapping.
- Bottom safe area with sheet open.
- Storage load failure, save failure, full delete.
- Hospital card copy contains no medical advice/recommendation/booking.
- No login/server/weather API/AI/push/payment/reward/ad affordance.

## 12. QA and Build Commands

Commands are future Gate 4+ commands and must be run from `app/` after scaffold:

```bash
npm install
npm test
npx tsc --noEmit
npm run build
```

If scaffold provides different scripts, update this section in a later gate with exact commands while preserving equivalent checks: tests, typecheck, production build, and Apps in Toss `.ait` generation.

Local documentation verification for Gate 3:

```bash
python3 - <<'PY'
from pathlib import Path
required = [
  Path('docs/plans/today-what-to-bring-mvp-implementation-plan.md'),
  Path('docs/reports/today-what-to-bring-plan-review.md'),
]
for path in required:
  assert path.exists(), path
plan = required[0].read_text()
for needle in ['app/', 'StoragePort', 'today-what-to-bring:v1:app-storage', 'Analytics payload allowlist', 'Gate 4', 'npx create-ait-app today-what-to-bring']:
  assert needle in plan, needle
review = required[1].read_text()
assert 'blocker' in review.lower()
assert 'Gate 4' in review
print('Gate 3 artifact verification passed')
PY
```

## 13. Commit Sequence

Recommended commits after Gate 3, starting in Gate 4:

1. `docs: add gate 3 implementation plan`
2. `chore: scaffold apps in toss app under app`
3. `test: add domain model and storage schema tests`
4. `feat: add routine templates and search helpers`
5. `feat: add storage and analytics adapters`
6. `feat: build home routine browsing UI`
7. `feat: build checklist sheet and custom items`
8. `feat: wire back behavior and safe area handling`
9. `test: cover mvp flows and reset edge cases`
10. `chore: verify apps in toss build`

Core may squash or reorder commits, but implementation should remain reviewable by gate.

## 14. Sequential Implementation Tasks

### Task 1. Scaffold App in Isolated Directory

- Goal: Create official Apps in Toss template in `app/` without touching repo root docs.
- Files to create/modify: `app/**`, possibly root `.gitignore`.
- Steps: run isolated scaffold strategy from Section 3; copy generated files into `app/`; inspect `granite.config.ts`; install dependencies.
- Verification command/check: `cd app && npm run build`.
- Commit suggestion: `chore: scaffold apps in toss app under app`.
- Stop condition: generated template cannot be safely moved into `app/`, build script is missing, or scaffold requires root-only placement.

### Task 2. Configure App Metadata

- Goal: Align scaffold metadata with PRD.
- Files to create/modify: `app/granite.config.ts`, generated app metadata files if present.
- Steps: set `appName`, `displayName`, empty permissions, primary color, and icon placeholder according to template rules.
- Verification command/check: `cd app && npm run build`; inspect generated config for `today-what-to-bring` and `오늘 뭐 챙기지?`.
- Commit suggestion: `chore: configure apps in toss metadata`.
- Stop condition: template config schema differs from PRD assumptions and official docs/types must be checked.

### Task 3. Add Domain Types and Template Fixtures

- Goal: Lock typed model and immutable routine template data before UI.
- Files to create/modify: `app/src/domain/ids.ts`, `routineTypes.ts`, `templateRoutines.ts`, `grouping.ts`, tests.
- Steps: define type unions; enter 13 routines and items; define prep-flow/category group order; add immutability checks.
- Verification command/check: `cd app && npm test -- template`.
- Commit suggestion: `feat: add routine domain model and templates`.
- Stop condition: PRD and wireframe routine names/items conflict.

### Task 4. Add Search Helpers

- Goal: Implement client-only routine search.
- Files to create/modify: `app/src/domain/search.ts`, search tests.
- Steps: normalize query; search title/category/tags; return ranked routine ids; empty query returns no search mode.
- Verification command/check: `cd app && npm test -- search`.
- Commit suggestion: `feat: add routine search`.
- Stop condition: search requires server/API or raw query persistence.

### Task 5. Add Merge and Routine Reducer

- Goal: Merge template + overrides and handle checklist/custom item operations.
- Files to create/modify: `mergeRoutine.ts`, `routineReducer.ts`, reducer tests.
- Steps: merge base items with custom section; validate custom labels; add/delete/reorder custom items; toggle/clear checks; complete state.
- Verification command/check: `cd app && npm test -- routineReducer`.
- Commit suggestion: `feat: add routine reducer`.
- Stop condition: reducer design would persist session check state.

### Task 6. Add Reset Scope Reducer Tests

- Goal: Prevent Gate 2 reset scope bugs before UI wiring.
- Files to create/modify: `routineReducer.ts`, `appReducer.ts`, reset tests.
- Steps: separately test clear checks, routine default restore, home view default, group card order reset, and full storage delete.
- Verification command/check: `cd app && npm test -- reset`.
- Commit suggestion: `test: cover reset scopes`.
- Stop condition: any reset action affects data outside its documented scope.

### Task 7. Add Storage Schema and StoragePort

- Goal: Add schema-versioned local storage without SDK lock-in.
- Files to create/modify: `app/src/ports/StoragePort.ts`, `app/src/domain/storageSchema.ts`, `app/src/adapters/memoryStorage.ts`, tests.
- Steps: define `AppStorageV1`; implement parse/serialize; handle missing key/corrupt JSON; implement memory adapter.
- Verification command/check: `cd app && npm test -- storage`.
- Commit suggestion: `feat: add storage schema and port`.
- Stop condition: storage cannot fallback to template defaults on parse failure.

### Task 8. Add Apps in Toss Storage Adapter

- Goal: Wire `StoragePort` to Apps in Toss Storage API.
- Files to create/modify: `app/src/adapters/appStorage.ts`, storage adapter tests/mocks.
- Steps: wrap SDK `Storage` methods; map errors to typed failures; no `AsyncStorage`.
- Verification command/check: `cd app && npm test -- appStorage && npm run build`.
- Commit suggestion: `feat: add apps in toss storage adapter`.
- Stop condition: installed SDK exposes incompatible Storage API and official docs/types must be checked.

### Task 9. Add Analytics Wrapper

- Goal: Enforce Analytics payload allowlist.
- Files to create/modify: `app/src/ports/AnalyticsPort.ts`, `app/src/adapters/analytics.ts`, analytics tests.
- Steps: create typed event builders; reject extra fields; adapt to installed SDK method names.
- Verification command/check: `cd app && npm test -- analytics && npm run build`.
- Commit suggestion: `feat: add analytics wrapper`.
- Stop condition: Analytics SDK API differs enough to require a gate note.

### Task 10. Add App State Controller

- Goal: Connect domain reducers, storage, analytics, and selectors.
- Files to create/modify: `app/src/state/appState.ts`, `appReducer.ts`, `selectors.ts`, `useAppController.ts`.
- Steps: load storage on mount; fallback warning; persist custom/order/view/recent changes; keep checks session-only.
- Verification command/check: `cd app && npm test -- appState`.
- Commit suggestion: `feat: add app state controller`.
- Stop condition: state controller creates blank screen on storage failure.

### Task 11. Build App Shell and Safe Area

- Goal: Establish Toss WebView-safe layout.
- Files to create/modify: `App.tsx`, `main.tsx`, `styles/*`, `components/AppShell.tsx`, `adapters/safeArea.ts`.
- Steps: render app frame; apply safe-area top/bottom; add notice region; avoid automatic modal.
- Verification command/check: `cd app && npm run build`; manual 360/390/420px visual check.
- Commit suggestion: `feat: add app shell`.
- Stop condition: content overlaps top navigation or bottom gesture area.

### Task 12. Build Home Browsing UI

- Goal: Render home default, recent routines, view modes, and grouped routine cards.
- Files to create/modify: `SearchBox.tsx`, `RecentRoutines.tsx`, `ViewModeSegmentedControl.tsx`, `RoutineGroup.tsx`, `RoutineCard.tsx`, component tests.
- Steps: implement home header; recent empty/populated; prep-flow/category groups; routine card selection.
- Verification command/check: `cd app && npm test -- Home && npm run build`.
- Commit suggestion: `feat: build home browsing ui`.
- Stop condition: MVP-excluded feature appears on home.

### Task 13. Build Search UI

- Goal: Implement focus/results/empty/clear search states.
- Files to create/modify: `SearchBox.tsx`, home selector tests, component tests.
- Steps: show results independent of view mode; clear button; no raw query storage; emit allowlisted search event.
- Verification command/check: `cd app && npm test -- search`.
- Commit suggestion: `feat: build routine search ui`.
- Stop condition: raw query is persisted or sent to analytics.

### Task 14. Build Card Order Editor

- Goal: Implement group-internal card ordering.
- Files to create/modify: `CardOrderEditor.tsx`, `RoutineGroup.tsx`, reducer tests.
- Steps: add edit mode; up/down controls; boundary disabled states; reset current group order.
- Verification command/check: `cd app && npm test -- CardOrderEditor`.
- Commit suggestion: `feat: add card order editing`.
- Stop condition: UI supports cross-group movement in MVP.

### Task 15. Build Checklist Bottom Sheet

- Goal: Implement checklist sheet default/partial/complete states.
- Files to create/modify: `ChecklistSheet.tsx`, `ChecklistItemRow.tsx`, component tests.
- Steps: open on routine selection; progress text/bar; base/custom sections; check/uncheck; clear checks; completion banner.
- Verification command/check: `cd app && npm test -- ChecklistSheet`.
- Commit suggestion: `feat: build checklist sheet`.
- Stop condition: checked state persists after sheet close.

### Task 16. Build Custom Item Editor

- Goal: Add user custom item add/delete/reorder.
- Files to create/modify: `CustomItemEditor.tsx`, `ChecklistItemRow.tsx`, reducer tests.
- Steps: trim/normalize/limit labels; empty/duplicate validation; delete only custom rows; move custom rows within custom section.
- Verification command/check: `cd app && npm test -- custom`.
- Commit suggestion: `feat: add custom checklist items`.
- Stop condition: base item can be deleted or custom/base items are interleaved in MVP.

### Task 17. Build Default Items and Reset Settings

- Goal: Implement read-only default view and scoped reset controls.
- Files to create/modify: `DefaultItemsPanel.tsx`, `ResetSettingsPanel.tsx`, reducer/component tests.
- Steps: read-only default list; routine reset confirm; home view reset; group order reset; full delete confirm; scoped copy.
- Verification command/check: `cd app && npm test -- reset`.
- Commit suggestion: `feat: add default view and reset settings`.
- Stop condition: destructive reset lacks scoped confirmation or affects wrong data.

### Task 18. Wire Back Event

- Goal: Implement Toss back behavior priority.
- Files to create/modify: `adapters/backEvent.ts`, `useAppController.ts`, back behavior tests.
- Steps: release search focus; close default panel; close sheet; cleanup listener on unmount; add error handling.
- Verification command/check: `cd app && npm test -- backEvent && npm run build`.
- Commit suggestion: `feat: wire toss back behavior`.
- Stop condition: back listener cannot be cleaned up or blocks default navigation on home.

### Task 19. Mobile QA and Accessibility Pass

- Goal: Verify small-screen fit, text wrapping, and baseline accessibility.
- Files to create/modify: app CSS/components, QA notes as needed.
- Steps: test 360/390/420px; enlarged font; touch targets; labels; bottom safe area; no overlap.
- Verification command/check: `cd app && npm test && npx tsc --noEmit && npm run build`; manual QA checklist.
- Commit suggestion: `fix: polish mobile layout and accessibility`.
- Stop condition: core CTA or sheet controls are hidden on supported viewport widths.

### Task 20. Final MVP Build Gate Prep

- Goal: Prepare for Gate 8/9 QA and `.ait` submission without adding scope.
- Files to create/modify: QA report later, build notes later.
- Steps: run full tests/typecheck/build; inspect bundle output; confirm MVP exclusions; record residual risks.
- Verification command/check: `cd app && npm test && npx tsc --noEmit && npm run build`.
- Commit suggestion: `chore: verify mvp build`.
- Stop condition: `.ait` build fails, policy-risk feature appears, or medical/weather/AI/server scope is introduced.

## 15. Gate 3 Exit Criteria

Gate 3 can proceed to Gate 4 when:

- This implementation plan exists.
- The plan review exists.
- `app/` is selected as the source location.
- The scaffold strategy avoids repo root/docs collision.
- Required storage, analytics, state, component, test, QA, and commit plans are present.
- Gate 2 risk notes are explicitly carried into implementation tasks.
- MVP exclusions are reconfirmed.
- No task requires actual app implementation during Gate 3.
