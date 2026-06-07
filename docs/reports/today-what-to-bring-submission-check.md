# Gate 9 Build / Submission Check

## Gate result

Gate 9 Build/Submission Gate: **READY FOR CONSOLE/SANDBOX, NOT YET SUBMITTED**

- Date: 2026-06-07 KST
- Executor: Core
- Commit tested before this report: `426b567`
- Local build artifact: `app/today-what-to-bring.ait`
- Must-fix before actual submission: **0**
- Sandbox-only checks remaining: Toss console upload, QR/app scheme test, iOS/Android Toss app verification

## Build artifact

Run from `app/`:

```sh
npm run build
```

Last verified result from Gate 8 / Gate 9 prep:

```text
AIT build completed (today-what-to-bring.ait)
deploymentId: 019ea3f1-267f-7cdc-8c8b-207febd54575
```

Artifact inspection:

```text
today-what-to-bring.ait 4082665 bytes
uncompressed archive listing total: 22310080 bytes
```

Result:

- `.ait` exists: PASS
- `.ait` compressed size: 4,082,665 bytes: PASS
- `.ait` uncompressed listing size: 22,310,080 bytes: PASS, below 100MB checklist limit
- Archive contains RN 0.84.0 / 0.72.6 iOS+Android bundles and web assets: PASS

## App metadata check

Source: `app/granite.config.ts`, `app/.granite/app.json`

| Field | Value | Result |
|---|---|---:|
| `appName` | `today-what-to-bring` | PASS |
| `.granite/app.json appName` | `today-what-to-bring` | PASS |
| `displayName` | `오늘 뭐 챙기지?` | PASS |
| `primaryColor` | `#E0B20C` | PASS |
| `permissions` | `[]` | PASS |
| `brand.icon` | `https://raw.githubusercontent.com/namseokyoo/today-what-to-bring/main/app/public/app-icon.png` | PASS |
| icon asset | `app/public/app-icon.png`, 512×512 PNG, 5,326 bytes | PASS |

## Submission copy draft

### 앱 이름

```text
오늘 뭐 챙기지?
```

### 한 줄 소개

```text
오늘 나갈 때도, 내일 떠날 때도 빠뜨리지 않게 도와주는 상황별 준비물 체크리스트 미니앱
```

### 챌린지 주제 연결 문구

```text
출근, 외출, 운동처럼 바로 확인할 준비부터 골프, 캠핑, 국내여행, 해외여행, 등산처럼 미리 챙길 준비까지 상황별 프리셋 체크리스트로 관리하는 미니앱입니다. 사용자는 검색으로 필요한 루틴을 빠르게 열고, 준비물을 체크하고, 자기만의 준비물을 추가할 수 있습니다. 반복되는 준비의 기억 부담과 빠뜨림을 줄여 “일상이 편해지는 순간”을 만드는 것이 목표입니다.
```

### 상세 설명 초안

```text
오늘 뭐 챙기지?는 외출·출근·운동·여행처럼 반복되는 상황에서 빠뜨리기 쉬운 준비물을 바로 확인하는 체크리스트 미니앱입니다.

기본 루틴은 준비 흐름별/카테고리별로 볼 수 있고, 검색으로 원하는 상황을 바로 찾을 수 있습니다. 사용자가 직접 추가한 준비물과 최근에 연 루틴은 앱 저장소에 보관되어 다음 방문에도 이어집니다. 체크 완료 상태는 세션성 정보로만 다뤄 앱을 다시 열 때 새 준비를 시작할 수 있게 했습니다.

로그인, 서버 동기화, 의료 판단, 결제, 광고, AI 추천 없이 앱 안에서 완결되는 간단한 준비물 관리 경험에 집중했습니다.
```

### 개인정보/저장 안내 문구

```text
직접 추가한 준비물과 최근에 사용한 루틴은 이 기기의 앱 저장소에만 저장됩니다. 체크 완료 상태는 앱을 다시 열면 초기화됩니다.
```

### 병원 루틴 오해 방지 문구

```text
병원 루틴은 신분증, 복용 중인 약처럼 방문 전 준비물을 확인하기 위한 체크리스트이며, 진료·예약·의료 판단을 제공하지 않습니다.
```

## Submission checklist

| Check | Result | Notes |
|---|---:|---|
| `appName` matches repo/config/PRD | PASS | `today-what-to-bring` |
| display name set | PASS | `오늘 뭐 챙기지?` |
| primary color set | PASS | `#E0B20C` |
| icon URL set | PASS | project-owned GitHub raw URL in `brand.icon` |
| permissions minimal | PASS | `[]` |
| external link/iframe dependency | PASS | none found in app flow |
| 개인정보/위치/연락처/의료정보 수집 | PASS | not collected |
| user input storage notice prepared | PASS | copy above |
| Analytics payload privacy | PASS | raw search/custom labels excluded in Gate 8 |
| medical/reservation confusion | PASS | checklist-only copy, extra submission copy prepared |
| challenge theme linkage | PASS | copy above |
| pre-2026-06-08 existing miniapp resubmission | PASS by project history | new repo/project for this challenge |
| `.ait` generated | PASS | `app/today-what-to-bring.ait` |
| `.ait` under 100MB uncompressed checklist limit | PASS | 22,304,002 bytes listing total |
| local final smoke | PASS | Gate 8 QA report |
| Toss sandbox upload | Gate 9 remaining | requires console/session access |
| Toss QR/app scheme final test | Gate 9 remaining | after console upload |
| iOS/Android Toss app verification | Gate 9 remaining | after console upload |
| native Toss back/NavigationBar confirmation | Gate 9 remaining | after console upload |

## Required next action before console submission

1. Use the committed app icon URL in `brand.icon`:

```text
https://raw.githubusercontent.com/namseokyoo/today-what-to-bring/main/app/public/app-icon.png
```

2. Proceed to Toss console/sandbox upload.
3. Run the QR/app scheme test script below on real Toss app.
4. If Toss console rejects GitHub raw icon URLs, replace `brand.icon` with a Toss-accepted stable hosted URL and rebuild.

## Console/sandbox test script

After upload, run this manual test in Toss app:

1. Open the miniapp through the console QR/app scheme.
2. Confirm first screen shows `오늘 뭐 챙기지?` and no automatic bottom sheet.
3. Switch to `카테고리별`.
4. Search `여권`.
5. Open `해외여행`.
6. Check `여권`.
7. Add custom item `테스트 준비물`.
8. Close sheet with native back; expected: sheet closes, app stays on home.
9. Search again, press native back; expected: query clears.
10. Close/reopen app; expected: custom item/recent routine restored, checked state reset.
11. Confirm bottom actions are not covered by Toss navigation/safe area.
12. Confirm no Analytics/runtime errors in console/sandbox logs if available.

## Gate 9 decision

Local package preparation is ready for Toss console/sandbox upload. Actual submission still requires Toss sandbox upload, QR/app scheme verification, and native back/safe-area checks on the real Toss app.
