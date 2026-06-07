# Gate 8 SDK / Fallback Risk Log

## Summary

Gate 8 risk status: **PASS with sandbox-only confirmation items**

- Must-fix: 0
- Blocker: 0
- Local fallback verified: yes
- Toss sandbox required before submission: yes, in Gate 9

## Risk table

| ID | Area | Status | Risk | Current handling | Gate 9 / follow-up |
|---|---|---|---|---|---|
| SDK-001 | Toss Storage | fallback verified | Local browser cannot prove native Toss Storage behavior. | Adapter selects Toss Storage only when operational Toss environment + bridge are detected; local mock fallback verified. | Upload `.ait` and confirm custom item/recent routine persistence in Toss sandbox. |
| SDK-002 | Storage invalid payload | confirmed | Corrupt or incompatible stored JSON could break app load. | Invalid payload parses to default storage, shows Korean non-blocking warning, app remains usable. | Confirm warning behavior is acceptable in Toss sandbox if storage read returns invalid value. |
| SDK-003 | Session state serialization | confirmed | Checked checklist state could accidentally persist and confuse next visit. | Playwright localStorage check confirms no checked/open session keys are serialized. | None unless schema changes. |
| SDK-004 | Analytics payload privacy | confirmed | Raw search query or custom item labels could leak user text. | Static scan confirms events use `query_length`, `result_count`, routine/category/prep-flow/item origin only. | In sandbox, confirm event ingestion does not require additional raw text fields. |
| SDK-005 | Analytics SDK surface | needs Toss sandbox | Installed SDK exposes `Analytics.screen/click/impression`; actual console ingestion is only visible after launch or sandbox constraints. | Adapter routes event names through guarded wrapper and swallows SDK failures. | Confirm no runtime SDK errors in sandbox; post-launch console data appears next day. |
| SDK-006 | Native back event | needs Toss sandbox | Native Toss backEvent/NavigationBar API surface was not typed/discoverable locally. | Browser `popstate`/Escape fallback verified: sheet close → search clear → no-op. | Confirm native Toss back button behavior; add native bridge subscription only if official API is verified. |
| SDK-007 | NavigationBar overlap | needs Toss sandbox | Real Toss WebView navigation chrome may differ from local Chrome viewport. | Safe-area CSS variables default to `0px`; local 360/390/420px checks show no horizontal overflow and close CTA visible. | Confirm on iOS/Android Toss app with safe-area/notch devices. |
| SDK-008 | Deep links | confirmed | Public/private deep link constants could drift from `appName`. | Code and docs both use `intoss://today-what-to-bring` and `intoss-private://today-what-to-bring`. | Confirm console/submission metadata uses same appName. |
| SDK-009 | Excluded MVP features | confirmed | Challenge submission could be rejected if MVP implies login, medical service, payment, AI, weather, push, or ads. | Static source scan found no excluded feature copy and 병원 card remains preparation/checklist-only. | Re-check submission copy in Gate 9. |
| SDK-010 | Package artifact | Gate 9 확인 | Gate 8 build generates `.ait`, but final upload/QR test is not yet performed. | `npm run build` passes and creates `today-what-to-bring.ait`. | Gate 9: verify artifact size, metadata, console upload, Toss app QR/scheme test. |

## Confirmed locally

- `npm run lint`: PASS
- `npx tsc --noEmit`: PASS
- `npm run build`: PASS, deploymentId `019ea270-3dc7-7c65-935d-f0e64e6534c1`
- Local mobile viewport QA at 360/390/420px: PASS
- Storage persistence/reload/session reset: PASS
- Invalid storage payload warning/fallback: PASS
- Analytics privacy static scan: PASS
- Deep link constants static scan: PASS
- Policy/medical copy static scan: PASS

## Needs Toss sandbox in Gate 9

1. Upload or run the generated `.ait` through the Apps in Toss console/sandbox path.
2. Open in Toss app on iOS and Android if available.
3. Confirm custom item and recent routine persistence through app close/reopen.
4. Confirm native back button behavior:
   - checklist sheet open → back closes sheet
   - search query active → back clears query
   - clean home → native default/no-op behavior is acceptable
5. Confirm safe-area and navigation chrome do not cover bottom actions.
6. Confirm Analytics calls do not throw runtime SDK errors.
7. Confirm appName/deep link/submission metadata all match `today-what-to-bring`.

## Deferred MVP items

These remain intentionally out of scope for MVP/Gate 8:

- login / account binding
- server sync
- push notifications
- weather API
- AI recommendation
- medical judgment, diagnosis, reservation, or treatment guidance
- payments, ads, rewards
- card order editing UI beyond existing Gate 6/Gate 7 placeholder copy
