# today-what-to-bring MVP QA Report

## Gate result

Gate 8 QA Gate: **PASS**

- Date: 2026-06-07 KST
- Executor: Core
- Repo state tested: `main` after Gate 7 + Gate 8 QA plan update
- Must-fix/blocker count: **0**
- Next gate: Gate 9 Build/Submission Gate

## Verification commands

Run from `app/`.

```sh
npm run lint
npx tsc --noEmit
npm run build
```

Result:

```text
npm run lint
→ PASS

npx tsc --noEmit
→ PASS

npm run build
→ PASS
AIT build completed (today-what-to-bring.ait)
deploymentId: 019ea270-3dc7-7c65-935d-f0e64e6534c1
```

## Automated local browser QA

A temporary Playwright smoke script was run against a local Vite server at `http://127.0.0.1:5173/` using Google Chrome.

Server command used for QA:

```sh
npx vite --host 127.0.0.1 --port 5173
```

Smoke result:

```json
{
  "viewportChecks": [
    {
      "width": 360,
      "titleVisible": true,
      "searchVisible": true,
      "horizontalOverflow": false,
      "sheetVisible": true,
      "closeButtonVisible": true
    },
    {
      "width": 390,
      "titleVisible": true,
      "searchVisible": true,
      "horizontalOverflow": false,
      "sheetVisible": true,
      "closeButtonVisible": true
    },
    {
      "width": 420,
      "titleVisible": true,
      "searchVisible": true,
      "horizontalOverflow": false,
      "sheetVisible": true,
      "closeButtonVisible": true
    }
  ],
  "storage": {
    "sheetClosedByEscape": true,
    "recentVisible": true,
    "customVisible": true,
    "checkedAfterReload": false,
    "schemaVersion": 1,
    "hasRoutineOverrides": true,
    "hasRecentRoutines": true,
    "serializedContainsCustomName": true,
    "serializedContainsCheckedState": false
  },
  "backFallback": {
    "searchClearedByEscape": true,
    "secondEscapeNoopStillHome": true
  },
  "emptyState": {
    "emptyStateVisible": true
  },
  "storageWarning": {
    "invalidPayloadWarningVisible": true,
    "usableAfterWarning": true
  }
}
```

## QA matrix

| Area | Check | Result | Evidence |
|---|---|---:|---|
| Build quality | ESLint | PASS | `npm run lint` |
| Build quality | TypeScript no emit | PASS | `npx tsc --noEmit` |
| Build quality | AIT production build | PASS | deploymentId `019ea270-3dc7-7c65-935d-f0e64e6534c1` |
| Mobile layout | 360px viewport home/search/sheet visible | PASS | Playwright `viewportChecks[0]` |
| Mobile layout | 390px viewport home/search/sheet visible | PASS | Playwright `viewportChecks[1]` |
| Mobile layout | 420px viewport home/search/sheet visible | PASS | Playwright `viewportChecks[2]` |
| Mobile layout | No horizontal overflow at 360/390/420 | PASS | Playwright `horizontalOverflow: false` |
| Search | Query with no matching routine shows empty state | PASS | `아직 맞는 루틴이 없어요.` visible |
| Recent routines | Opened routine appears after reload | PASS | `recentVisible: true` |
| Storage | `schemaVersion` remains `1` | PASS | localStorage payload parse |
| Storage | custom item persists after reload | PASS | `customVisible: true` |
| Storage | recent routine persists after reload | PASS | `hasRecentRoutines: true` |
| Session state | checked checklist state does not persist after reload | PASS | `checkedAfterReload: false` |
| Session state | serialized payload does not contain checked/open session keys | PASS | `serializedContainsCheckedState: false` |
| Storage fallback | invalid stored JSON shows warning and app remains usable | PASS | `invalidPayloadWarningVisible: true`, `usableAfterWarning: true` |
| Back fallback | Escape closes open checklist sheet | PASS | `sheetClosedByEscape: true` |
| Back fallback | Escape clears search query | PASS | `searchClearedByEscape: true` |
| Back fallback | Escape on clean home is no-op | PASS | `secondEscapeNoopStillHome: true` |
| Deep links | public/private intoss constants exist | PASS | static source scan |
| Analytics privacy | raw search query not sent | PASS | static analytics call scan |
| Analytics privacy | custom item label not sent | PASS | static analytics call scan |
| Policy/copy | no login/server/push/weather/AI/payment/ad feature copy | PASS | static source scan |
| Medical risk | 병원 card remains checklist/preparation oriented, no diagnosis/treatment/reservation copy | PASS | static source scan |

## Static source scan result

```json
{
  "analyticsUsesQueryLength": true,
  "analyticsDoesNotSendRawQueryKey": true,
  "analyticsDoesNotSendCustomItemLabel": true,
  "allowedPayloadKeysExcludeRawText": true,
  "publicDeepLinkPresent": true,
  "privateDeepLinkPresent": true,
  "policyNoExcludedFeatures": true,
  "medicalCopyHasChecklistOnly": true
}
```

## Acceptance checklist

- [x] PRD acceptance criteria checked for MVP scope.
- [x] Wireframe review has no blocker carried into Gate 8.
- [x] TypeScript typecheck passes.
- [x] Build passes.
- [x] Mobile viewport QA passes at 360/390/420px.
- [x] Search empty state passes.
- [x] Recent routine edge case passes.
- [x] Storage invalid payload fallback warning passes.
- [x] Storage payload excludes `SessionCheckState`.
- [x] Reload restores custom item and recent routine.
- [x] Reload resets checked state.
- [x] Analytics payload does not include raw search query or custom item label.
- [x] Browser Escape fallback priority verified: sheet close → search clear → no-op.
- [x] Deep link constants match code/report: `intoss://today-what-to-bring`, `intoss-private://today-what-to-bring`.
- [x] Safe area/layout basic pass at 360~420px; no horizontal overflow and sheet close CTA visible.
- [x] Dark-pattern, medical judgment, and excluded MVP feature copy scan passes.
- [x] Accessibility basics checked through roles/labels used by Playwright selectors and visible touch controls.

## Issues found

No must-fix or blocker found during Gate 8.

## Deferrals / Gate 9 handoff

- Toss sandbox / real Toss app verification remains a Gate 9 task.
- Native Toss back event and NavigationBar behavior remain sandbox-only confirmation items; browser fallback is verified locally.
- `.ait` package is generated by build, but final submission metadata, console upload, and QR/app scheme testing belong to Gate 9.
