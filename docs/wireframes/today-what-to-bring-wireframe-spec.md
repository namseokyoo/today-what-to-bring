# 오늘 뭐 챙기지? Gate 2 Wireframe Spec

**Project:** `today-what-to-bring`  
**Product:** `오늘 뭐 챙기지?`  
**appName:** `today-what-to-bring`  
**Artifact:** Gate 2 wireframe specification  
**Status:** Ready for Gate 2 review  
**Source docs:** `docs/prd-today-what-to-bring-mvp-production.md`, `docs/community-painpoints-research.md`, `docs/wireframe-production-plan.md`, `docs/plans/development-sequence-and-gates.md`, `PROJECT.md`, `index.json`

## 1. Scope Lock

This wireframe describes only the MVP screens needed before implementation. It does not scaffold the Apps in Toss app, React/Vite source, SDK integration, or runtime data model.

### In Scope

- Home default state with product value, search, recent routines, view mode, grouped routine cards, and settings entry.
- Home view modes: `준비 흐름별` and `카테고리별`.
- Group-internal card order editing with up/down controls.
- Search focus, results, empty result, and clear-query states.
- Recent routines empty and populated states.
- Checklist bottom sheet default, checked, all-complete, reset, custom item, and read-only default-items states.
- Base item vs custom item distinction.
- Reset actions with separate scopes: `체크만 지우기`, `기본값으로 돌리기`, `홈 보기 기본값으로 돌리기`, `카드 순서 초기화`, `저장된 변경값 모두 삭제`.
- Storage load/save failure and template fallback states.
- Toss WebView Safe Area, NavigationBar, bottom operation area, keyboard, and 360-420px mobile constraints.

### Out of Scope

- Login, account, server sync, push notification, location/weather API, AI recommendation, medical judgment, hospital recommendation/booking, social sharing, reward, point, payment, ad, external iframe, or external core flow.
- Full page routine detail. Checklist entry is a bottom sheet.
- Deleting base template items.
- Fully integrated ordering between base items and custom items.
- Persisting checklist checked state after bottom sheet close or app re-entry.

## 2. Canonical Information Architecture

```text
홈
├─ Toss WebView NavigationBar / Safe Area
├─ 서비스 제목과 설명
├─ 최근에 쓴 루틴
├─ 검색
├─ 보기 모드: 준비 흐름별 / 카테고리별
├─ 선택된 보기 모드의 그룹
│  └─ 루틴 카드
├─ 그룹 내부 순서 바꾸기
└─ 저장/초기화/안내

체크리스트 바텀시트
├─ 루틴 제목과 진행률
├─ 기본 준비물
├─ 커스텀 준비물
├─ 항목 추가
├─ 기본값에서 제공하는 준비물 보기
├─ 체크만 지우기
├─ 기본값으로 돌리기
└─ 닫기
```

## 3. Shared Components

| Component | Purpose | Required States | Notes |
|---|---|---|---|
| App shell | Toss WebView mobile surface | normal, storage warning, bottom sheet open | Uses safe-area top/bottom padding and leaves room for Toss navigation/bottom gestures. |
| Search field | Find routine by title/category/tag | idle, focused, typing, results, empty, clear | Raw search text is not stored and not sent to Analytics. |
| Recent routines strip | Repeat entry | empty, 1 item, 2-3 items | Does not reorder main card list. |
| Segmented control | Switch home grouping | prepFlow selected, category selected | Stored locally. Default is `준비 흐름별`. |
| Routine card | Open bottom sheet | normal, recent source, search result, edit mode | Shows title, hint, item count/progress hint. |
| Order controls | Reorder cards or custom items | up/down enabled, boundary disabled, saved, save failed | Use buttons, not drag-only UI. |
| Checklist row | Check item | unchecked, checked, base item, custom item, disabled delete for base | Base and custom item type must be visible beyond color. |
| Bottom sheet | Checklist task | default, partial, complete, default-items read-only, confirm reset | Opens only after user taps a routine. |
| Notice/toast | Feedback | success, warning, error | Short copy only. |
| Confirm panel | Destructive reset | routine reset, full storage delete | Confirm copy must name the data scope. |

## 4. Routine Groups and Card Copy

### 준비 흐름별

| Group | Cards |
|---|---|
| 지금 | 출근, 외출, 운동 |
| 오늘·내일 | 비 오는 날, 병원, 퇴근길 장보기, 아이 등원/등교, 출장/외근 |
| 미리 | 골프, 캠핑, 국내여행, 해외여행, 등산 |

### 카테고리별

| Group | Cards |
|---|---|
| 일상/외출 | 출근, 외출, 비 오는 날 |
| 건강/운동 | 운동, 병원 |
| 가족/생활 | 퇴근길 장보기, 아이 등원/등교 |
| 업무/출장 | 출장/외근 |
| 레저/여행 | 골프, 캠핑, 국내여행, 해외여행, 등산 |

### Home Card Hints

| Card | Hint |
|---|---|
| 출근 | 사원증, 충전기, 우산까지 |
| 외출 | 집 키, 카드, 보조배터리까지 |
| 운동 | 수건이랑 이어폰 챙겼나요? |
| 비 오는 날 | 우산만 챙기면 끝이 아닐 수도 있어요 |
| 병원 | 신분증부터 복용 중인 약까지 |
| 퇴근길 장보기 | 저녁 재료와 생필품을 한 번 더 |
| 아이 등원/등교 | 물병, 알림장, 여벌옷까지 |
| 출장/외근 | 충전기와 발표자료, 나가기 전에 한 번 더 |
| 골프 | 장갑, 볼마커, 티오프 시간까지 |
| 캠핑 | 랜턴 배터리와 연료처럼 작은 걸 놓치지 않게 |
| 국내여행 | 숙소, 교통편, 충전기까지 |
| 해외여행 | 여권, eSIM, 멀티어댑터까지 |
| 등산 | 물, 간식, 바람막이까지 |

## 5. Screen and State Specs

### S0. Home Default

**Purpose:** User understands within 5 seconds that the app is a lightweight situation-based packing checklist.

**Visible elements:**
- Safe Area top spacer and Toss navigation awareness.
- Title: `오늘 뭐 챙기지?`
- Subtitle: `오늘 나갈 때도, 내일 떠날 때도 빠뜨리지 않게`
- Recent routines section.
- Search field placeholder: `어떤 준비를 찾고 있나요?`
- Segmented control: `준비 흐름별`, `카테고리별`
- Grouped routine card list.
- `순서 바꾸기` action per group.
- Bottom storage/settings entry: `저장과 초기화`

**Default state:** `준비 흐름별` selected, recent empty if no Storage value exists.

**Events:** home screen impression is automatic page analytics; routine tap emits `select_routine`.

**Acceptance:** No automatic bottom sheet, no permission prompt, no ad/reward/server/login affordance.

### S1. Prep-Flow View

**Purpose:** Let users scan from immediate checks to future preparation.

**State rules:**
- Groups are rendered in this order: `지금`, `오늘·내일`, `미리`.
- Cards remain inside their group. MVP does not support cross-group movement.
- `순서 바꾸기` affects only the selected group in the current view mode.

**UI notes:**
- Group label is a section label, not an item.
- More urgent groups appear higher in the scroll.
- Main list order is not affected by recent routines.

**Events:** `reorder_card` when a card moves.

### S2. Category View

**Purpose:** Support users who think by life area rather than preparation time.

**State rules:**
- Recent routines and search remain above the segmented control.
- Same routine card component as prep-flow view.
- Group-internal order can be edited independently from prep-flow order.

**Groups:** `일상/외출`, `건강/운동`, `가족/생활`, `업무/출장`, `레저/여행`.

**Events:** changing view mode is locally stored; card tap uses `select_routine` with `view_mode=category`.

### S3. Search Focus, Results, Empty, Clear

**Purpose:** Find a routine via card title, category, or tag.

| State | UI | Copy |
|---|---|---|
| Focus | Search input active, keyboard-safe result area reserved | `어떤 준비를 찾고 있나요?` |
| Results | Results list independent of current home mode | Example: `라운딩` -> `골프`; `여권` -> `해외여행` |
| Empty | Empty message and guidance to choose nearest routine/customize | `아직 맞는 루틴이 없어요. 직접 항목을 추가해 볼까요?` |
| Clear | Clear button appears when query exists | `검색어 지우기` |

**Storage/Analytics rule:** raw search query is never stored. `search_routine` may include only `query_type`, `result_count`, and matched routine ids.

**Back priority:** Search focus is released before bottom sheet or miniapp navigation handling.

### S4. Recent Routines

**Purpose:** Make repeated routines quick without mutating main card order.

| State | UI | Copy |
|---|---|---|
| Empty | Muted placeholder row | `최근 쓴 루틴이 여기에 보여요` |
| 1 item | One compact routine chip/card | Source payload `recent` |
| 2-3 items | Horizontal compact cards | Max 3, most recent first |

**Rules:**
- A routine is recorded when its checklist bottom sheet opens.
- Recent routines do not remove duplicates from main list.
- Full storage delete clears recent routines.

### S5. Group Card Order Edit

**Purpose:** Let users personalize routine order with an MVP-friendly control.

**States:**
- Edit mode entered from group `순서 바꾸기`.
- `위로` and `아래로` buttons visible per card.
- First card `위로` disabled.
- Last card `아래로` disabled.
- `카드 순서 초기화` restores only the current view mode/group order.
- `완료` exits edit mode.

**Accessibility:** Buttons use labels such as `골프 카드를 위로 이동`.

**Events:** `reorder_card` with `view_mode`, `group_id`, `routine_id`, and `direction`.

### S6. Checklist Bottom Sheet Default

**Purpose:** Let users check routine items without leaving home.

**Visible elements:**
- Sheet handle and close button.
- Routine title, e.g. `골프`.
- Progress text: `9개 중 0개 완료`.
- Progress bar.
- Base item section: `기본 준비물`.
- Custom item section: `내가 추가한 준비물`.
- Add input placeholder: `추가할 준비물을 입력해 주세요`.
- Primary inline action: `항목 추가하기`.
- Read-only default action: `기본값에서 제공하는 준비물 보기`.
- Secondary action: `체크만 지우기`.
- Conditional action if override exists: `기본값으로 돌리기`.

**Height:** Initial 70-80% of viewport; can expand if content overflows. Bottom controls remain inside safe area.

**Events:** `view_bottom_sheet` on open, `select_routine` on source tap.

### S7. Checklist Checked and All-Complete

| State | UI | Copy/Event |
|---|---|---|
| Some checked | Checked rows show checkbox mark and strikethrough; progress text updates | `아직 2개 남았어요.` / `check_item` |
| All complete | Completion banner above list, progress full | `다 챙겼어요. 이제 나가도 좋아요.` / `complete_routine` |
| Clear checks | Current sheet checkmarks clear, items remain | `체크를 모두 지웠어요.` |

**Persistence rule:** check state is session-only. Closing/reopening the sheet resets checks unless later product work explicitly changes that policy.

### S8. Custom Item Add, Delete, and Order

**Purpose:** Let users adapt a template without mutating the base template.

| State | UI | Copy |
|---|---|---|
| Empty input | Add button disabled or validation shown | `항목 이름을 입력해 주세요.` |
| Duplicate | Input error below field | `이미 있는 준비물이에요.` |
| Add success | Custom item appears under custom section | `내가 추가한 준비물` |
| Delete | Delete button only on custom row | `삭제` |
| Reorder | Up/down buttons only within custom section | `위로`, `아래로` |

**Rules:**
- Base items are not deletable.
- Custom items are stored per routine immediately.
- Base and custom items are not fully interleaved in MVP; custom section follows base section.
- Labels are trimmed, consecutive spaces normalized, and length-limited in implementation.

**Events:** `add_custom_item`; custom reorder may use implementation-level reducer tests but is not a separate canonical Analytics event in the Gate 2 required list.

### S9. Base vs Custom Item Distinction

**Purpose:** Prevent confusion about what is app-provided and what the user controls.

**UI treatment:**
- Base section label: `기본 준비물`
- Base row pill: `기본`
- Base row delete area: no delete button; optional note `기본 항목은 삭제할 수 없어요`
- Custom section label: `내가 추가한 준비물`
- Custom row pill: `내 항목`
- Custom row controls: delete and up/down available.

### S10. Default Items Read-Only View

**Purpose:** Let the user inspect original template items without overwriting custom changes.

**Trigger:** `기본값에서 제공하는 준비물 보기`

**UI:**
- Read-only panel inside sheet or nested sheet.
- Title: `기본값에서 제공하는 준비물`
- Base template list only.
- CTA: `닫기`

**Rule:** This action never restores, deletes, or writes data. `view_default_items` event sends only routine id and count, not the item labels array.

### S11. Reset and Storage Settings

**Purpose:** Separate reset scopes clearly enough to avoid data loss.

| Location | Action | Scope | Confirmation |
|---|---|---|---|
| Checklist | `체크만 지우기` | Current sheet checkmarks only | No destructive confirm needed |
| Checklist | `기본값으로 돌리기` | Current routine override: custom items/order | Confirm if override exists |
| Home settings | `홈 보기 기본값으로 돌리기` | Home view mode only | Simple confirm or direct with undo-like toast |
| Home settings | `카드 순서 초기화` | Current view mode/group card order | Confirm or scoped copy |
| Settings | `저장된 변경값 모두 삭제` | All local storage: overrides, card order, recent | Required destructive confirm |

**Required copy:**
- Storage guide: `입력한 준비물은 이 기기의 앱 저장소에 저장돼요.`
- Full delete confirmation: `저장된 준비물, 카드 순서, 최근 루틴을 모두 삭제할까요? 기본 준비물은 그대로 남아요.`
- Routine reset feedback: `기본 준비물로 되돌렸어요.`

### S12. Storage/Error/Fallback

**Purpose:** Keep the app usable if local storage fails.

| State | UI | Copy |
|---|---|---|
| Storage load fail | Non-blocking warning near top | `저장된 변경값을 불러오지 못했어요. 기본 준비물로 보여드릴게요.` |
| Storage save fail | Inline/toast error near attempted action | `변경사항을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.` |
| Template fallback | Home and sheet still show base template cards/items | Same as load fail when caused by storage parse/API error |
| Empty data impossible state | Fallback uses bundled template list | No blank white screen |

**Implementation handoff:** storage fallback must be testable with corrupted JSON, quota/API failure, and missing keys.

### S13. Toss WebView Safe Area and Mobile Constraints

**Layout requirements:**
- Design around 360x640 to 420x740 logical viewport.
- Mobile reference frame uses 390px width.
- Top content clears Toss NavigationBar/safe-area.
- Bottom sheet controls clear bottom safe-area/gesture area.
- Touch targets are at least 44px.
- Search focus/keyboard does not hide result cards or required actions.
- Do not rely only on color for checked/error/success states.
- Icons are optional in wireframe; text labels are mandatory where action meaning is not obvious.

**Back behavior priority:**
1. Release search focus.
2. Close open bottom sheet or nested read-only default view.
3. Let Toss miniapp default back/close behavior run.

## 6. Analytics Event Mapping

| Event | Trigger | Screen/State | Payload Guardrail |
|---|---|---|---|
| `select_routine` | Routine tapped from home/search/recent | S0-S4 | Send source and ids only. |
| `view_bottom_sheet` | Checklist sheet opens | S6 | Send counts only. |
| `check_item` | Item checked/unchecked | S7 | Send item type, not item label. |
| `search_routine` | Search result state resolves | S3 | No raw query. |
| `add_custom_item` | Custom item added | S8 | No custom label. |
| `reset_to_default` | Routine default restore confirmed | S11 | No deleted item labels. |
| `view_default_items` | Default list opened | S10 | Count only. |
| `reorder_card` | Card moved in group | S5 | Direction/id only. |
| `complete_routine` | All visible items checked | S7 | Counts only. |

## 7. Accessibility and QA Checkpoints

- All checkbox rows have text labels.
- Each up/down/delete button has a specific accessible label.
- Disabled boundary movement buttons are visually and programmatically disabled.
- Progress is available as text and bar.
- Base/custom item type is represented with text labels, not color alone.
- Error states preserve the core flow.
- Bottom sheet can close using explicit close and back behavior.
- Korean copy remains readable at 360px width and with enlarged text.
- Hospital card does not provide medical advice, recommendation, or booking.
- No screen asks for permissions or account login.
- Static HTML wireframe has no external network dependency and can open directly from disk.

## 8. Implementation Handoff Notes

- Recommended component split: `AppShell`, `SearchBox`, `RecentRoutines`, `ViewModeSegmentedControl`, `RoutineGroup`, `RoutineCard`, `CardOrderEditor`, `ChecklistSheet`, `ChecklistItemRow`, `CustomItemEditor`, `DefaultItemsPanel`, `ResetSettingsPanel`, `Notice`.
- State split: home view mode/card order/recent/custom items stored locally; checkmarks are local sheet session state.
- Storage key and schema are implementation-plan work, but the wireframe assumes one app-level storage namespace and schema-versioned JSON.
- Future Gate 3 should define tests for search, template merge, reset scopes, storage fallback, and Analytics payload allowlists before UI implementation.
