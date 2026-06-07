# Gate 7 Storage & Apps in Toss SDK Report

## Result

Gate 7 — Storage & Apps in Toss SDK Gate: **PASS**.

This gate connected the Gate 6 MVP UI to a guarded persistence/SDK layer without adding server sync, login, push, weather, AI, payment, deploy, or publish work.

## Checklist

- [x] Added storage adapter layer for Toss Storage with mock local development fallback.
- [x] Persisted and recovered `AppStorageV1` through existing schema helpers and key `today-what-to-bring:v1:app-storage`.
- [x] Kept `SessionCheckState` session-only and outside serialized storage.
- [x] Added non-blocking Korean storage failure warning while keeping checklist and custom item flows usable.
- [x] Added guarded Analytics adapter with allowlisted event names, allowlisted primitive payload keys, and no raw search query or custom item labels.
- [x] Added guarded Toss environment and deep link constants for `intoss://today-what-to-bring` and `intoss-private://today-what-to-bring`.
- [x] Added safe-area CSS variables with `0px` fallback and guarded Toss `SafeAreaInsets` support.
- [x] Added browser `popstate` and Escape back fallback with priority: checklist sheet close, search clear, otherwise no-op.

## Changed Files

- `app/src/constants/deepLinks.ts`
- `app/src/adapters/storageAdapter.ts`
- `app/src/adapters/mockStorageAdapter.ts`
- `app/src/adapters/tossStorageAdapter.ts`
- `app/src/adapters/analyticsAdapter.ts`
- `app/src/adapters/mockAnalyticsAdapter.ts`
- `app/src/adapters/tossAnalyticsAdapter.ts`
- `app/src/adapters/tossEnvironment.ts`
- `app/src/adapters/navigationAdapter.ts`
- `app/src/hooks/usePersistentAppStorage.ts`
- `app/src/hooks/useTossShell.ts`
- `app/src/App.tsx`
- `app/src/App.css`
- `app/src/index.css`
- `docs/reports/gate-7-storage-sdk-report.md`

## Verification

Run from `app/`:

```sh
npm run lint
npx tsc --noEmit
npm run build
```

Core verification result:

```text
npm run lint
→ PASS

npx tsc --noEmit
→ PASS

npm run build
→ PASS
AIT build completed (today-what-to-bring.ait)
deploymentId: 019ea21a-af28-7174-a5aa-017cbfe75872
```

Automated local browser smoke was run with Playwright against the local dev server and Google Chrome executable.

Smoke result:

```json
{
  "sheetClosedByEscape": true,
  "customVisible": true,
  "recentVisible": true,
  "checkedAfterReload": false,
  "storageKeyPresent": true,
  "storageIncludesCustomName": true
}
```

Validated flows:

- Local home renders.
- View mode can switch to category mode.
- Search query `여권` opens the overseas travel routine.
- Checklist sheet can be closed through Escape back fallback.
- Custom item `테스트 준비물` is persisted through reload.
- Recent routine is persisted through reload.
- Checklist checked state resets after reload because `SessionCheckState` is not serialized.
- Local mock storage writes to `today-what-to-bring:v1:app-storage`.

## Deferrals

- No login, server, push, weather, AI, payment, deploy, or publish work was added.
- No card order editing UI was added; existing Gate 6 copy remains.
- No Toss native back event bridge was subscribed because this SDK surface was not typed or discoverable locally; the implementation uses browser fallback only.
- No production Toss/sandbox submission was performed in this gate.
