import { useMemo, useState, type FormEvent } from "react";
import "./App.css";
import {
  addCustomItemToOverride,
  categoryMetadata,
  clearSessionChecks,
  createDefaultAppStorage,
  createDefaultSessionCheckState,
  createOpenSessionCheckState,
  createUserRoutineOverride,
  homeViewModes,
  homeViewModeLabels,
  maxRecentRoutineCount,
  mergeTemplateRoutines,
  prepFlowMetadata,
  removeCustomItemFromOverride,
  resolveRoutineOrder,
  templateRoutines,
  toggleSessionCheck,
  viewModeGroupOrder,
} from "./domain";
import type {
  AppStorageV1,
  CustomItem,
  HomeViewMode,
  MergedRoutine,
  RecentRoutine,
  RoutineId,
  SessionCheckState,
  UserRoutineOverride,
  ViewModeGroupId,
} from "./domain";

type GroupMeta = {
  readonly id: ViewModeGroupId;
  readonly label: string;
  readonly description?: string;
};

const groupMetaByViewMode: Readonly<
  Record<HomeViewMode, readonly GroupMeta[]>
> = {
  prepFlow: prepFlowMetadata,
  category: categoryMetadata,
};

function App() {
  const [storage, setStorage] = useState<AppStorageV1>(() =>
    createDefaultAppStorage(),
  );
  const [query, setQuery] = useState("");
  const [sessionState, setSessionState] = useState<SessionCheckState>(() =>
    createDefaultSessionCheckState(),
  );

  const routines = useMemo(
    () => mergeTemplateRoutines(templateRoutines, storage.routineOverrides),
    [storage.routineOverrides],
  );

  const routineById = useMemo(
    () => new Map(routines.map((routine) => [routine.card.id, routine])),
    [routines],
  );

  const normalizedQuery = normalizeSearchText(query);
  const isSearching = normalizedQuery.length > 0;
  const searchResults = useMemo(
    () =>
      isSearching
        ? routines.filter((routine) => matchesRoutine(routine, normalizedQuery))
        : [],
    [isSearching, normalizedQuery, routines],
  );

  const selectedRoutine = sessionState.openRoutineId
    ? routineById.get(sessionState.openRoutineId)
    : undefined;

  const checkedItemIds = useMemo(
    () => new Set(sessionState.checkedItemIds),
    [sessionState.checkedItemIds],
  );

  const recentRoutines = storage.recentRoutines
    .map((recent) => routineById.get(recent.routineId))
    .filter((routine): routine is MergedRoutine => Boolean(routine));

  function setViewMode(homeViewMode: HomeViewMode) {
    setStorage((current) => ({
      ...current,
      homeViewMode,
    }));
  }

  function openRoutine(routineId: RoutineId) {
    setSessionState(createOpenSessionCheckState(routineId));
    setStorage((current) => ({
      ...current,
      recentRoutines: createRecentRoutines(current.recentRoutines, routineId),
    }));
  }

  function closeChecklist() {
    setSessionState(createDefaultSessionCheckState());
  }

  function clearChecks() {
    setSessionState((current) => clearSessionChecks(current));
  }

  function toggleCheck(itemId: string) {
    setSessionState((current) => toggleSessionCheck(current, itemId));
  }

  function addCustomItem(routineId: RoutineId, label: string) {
    const customItem: CustomItem = {
      id: createCustomItemId(routineId),
      label,
      createdAt: new Date().toISOString(),
    };

    setStorage((current) => ({
      ...current,
      routineOverrides: upsertRoutineOverride(
        current.routineOverrides,
        addCustomItemToOverride(
          findRoutineOverride(current.routineOverrides, routineId) ??
            createUserRoutineOverride(routineId),
          customItem,
        ),
      ),
    }));
  }

  function deleteCustomItem(routineId: RoutineId, customItemId: string) {
    setStorage((current) => {
      const override = findRoutineOverride(current.routineOverrides, routineId);

      if (!override) {
        return current;
      }

      return {
        ...current,
        routineOverrides: upsertRoutineOverride(
          current.routineOverrides,
          removeCustomItemFromOverride(override, customItemId),
        ),
      };
    });
    setSessionState((current) => ({
      ...current,
      checkedItemIds: current.checkedItemIds.filter(
        (id) => id !== customItemId,
      ),
    }));
  }

  function moveCustomItem(
    routineId: RoutineId,
    customItemId: string,
    direction: "up" | "down",
  ) {
    setStorage((current) => {
      const override = findRoutineOverride(current.routineOverrides, routineId);

      if (!override) {
        return current;
      }

      const order = createCompleteCustomItemOrder(override);
      const currentIndex = order.indexOf(customItemId);
      const nextIndex =
        direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (currentIndex < 0 || nextIndex < 0 || nextIndex >= order.length) {
        return current;
      }

      const nextOrder = [...order];
      const targetId = nextOrder[nextIndex];
      nextOrder[nextIndex] = customItemId;
      nextOrder[currentIndex] = targetId;

      return {
        ...current,
        routineOverrides: upsertRoutineOverride(current.routineOverrides, {
          ...override,
          customItemOrder: nextOrder,
        }),
      };
    });
  }

  function resetRoutineCustomItems(
    routineId: RoutineId,
    customItemIds: readonly string[],
  ) {
    setStorage((current) => ({
      ...current,
      routineOverrides: current.routineOverrides.filter(
        (override) => override.routineId !== routineId,
      ),
    }));
    setSessionState((current) => ({
      ...current,
      checkedItemIds: current.checkedItemIds.filter(
        (id) => !customItemIds.includes(id),
      ),
    }));
  }

  return (
    <div className="app-shell">
      <main className="home-screen" aria-label="오늘 뭐 챙기지 홈">
        <header className="home-header">
          <p className="eyebrow">상황별 준비물 체크리스트</p>
          <h1>오늘 뭐 챙기지?</h1>
          <p>오늘 나갈 때도, 내일 떠날 때도 빠뜨리지 않게.</p>
        </header>

        <section className="recent-section" aria-labelledby="recent-title">
          <div className="section-heading">
            <h2 id="recent-title">최근에 쓴 루틴</h2>
            <span>{recentRoutines.length}/3</span>
          </div>
          {recentRoutines.length > 0 ? (
            <div className="recent-list" aria-label="최근 루틴 목록">
              {recentRoutines.map((routine) => (
                <button
                  className="recent-chip"
                  key={routine.card.id}
                  type="button"
                  onClick={() => openRoutine(routine.card.id)}
                >
                  <strong>{routine.card.title}</strong>
                  <span>{routine.card.itemCount}개</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="recent-empty">최근 쓴 루틴이 여기에 보여요.</p>
          )}
        </section>

        <section className="search-section" aria-label="루틴 검색">
          <label className="search-label" htmlFor="routine-search">
            준비할 상황 찾기
          </label>
          <div className="search-box">
            <input
              id="routine-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="어떤 준비를 찾고 있나요?"
              autoComplete="off"
            />
            {query.length > 0 ? (
              <button
                className="clear-search-button"
                type="button"
                aria-label="검색어 지우기"
                onClick={() => setQuery("")}
              >
                ×
              </button>
            ) : null}
          </div>
        </section>

        {isSearching ? (
          <SearchResults
            query={query}
            routines={searchResults}
            onOpenRoutine={openRoutine}
          />
        ) : (
          <>
            <ViewModeSegmentedControl
              selectedViewMode={storage.homeViewMode}
              onSelect={setViewMode}
            />
            <GroupedRoutineList
              routines={routines}
              routineById={routineById}
              storage={storage}
              onOpenRoutine={openRoutine}
            />
          </>
        )}
      </main>

      {selectedRoutine ? (
        <ChecklistSheet
          checkedItemIds={checkedItemIds}
          routine={selectedRoutine}
          onAddCustomItem={addCustomItem}
          onClearChecks={clearChecks}
          onClose={closeChecklist}
          onDeleteCustomItem={deleteCustomItem}
          onMoveCustomItem={moveCustomItem}
          onResetRoutineCustomItems={resetRoutineCustomItems}
          onToggleCheck={toggleCheck}
        />
      ) : null}
    </div>
  );
}

interface ViewModeSegmentedControlProps {
  readonly selectedViewMode: HomeViewMode;
  readonly onSelect: (viewMode: HomeViewMode) => void;
}

function ViewModeSegmentedControl({
  selectedViewMode,
  onSelect,
}: ViewModeSegmentedControlProps) {
  return (
    <div className="segmented-control" role="group" aria-label="홈 보기 방식">
      {homeViewModes.map((viewMode) => (
        <button
          className={
            viewMode === selectedViewMode ? "segment active" : "segment"
          }
          key={viewMode}
          type="button"
          aria-pressed={viewMode === selectedViewMode}
          onClick={() => onSelect(viewMode)}
        >
          {homeViewModeLabels[viewMode]}
        </button>
      ))}
    </div>
  );
}

interface GroupedRoutineListProps {
  readonly routines: readonly MergedRoutine[];
  readonly routineById: ReadonlyMap<RoutineId, MergedRoutine>;
  readonly storage: AppStorageV1;
  readonly onOpenRoutine: (routineId: RoutineId) => void;
}

function GroupedRoutineList({
  routines,
  routineById,
  storage,
  onOpenRoutine,
}: GroupedRoutineListProps) {
  const groups = groupMetaByViewMode[storage.homeViewMode];

  return (
    <div className="routine-groups">
      {viewModeGroupOrder[storage.homeViewMode].map((groupId) => {
        const groupMeta = groups.find((group) => group.id === groupId);
        const orderedRoutineIds = resolveRoutineOrder(
          storage.homeViewMode,
          groupId,
          storage,
        );
        const groupRoutines = orderedRoutineIds
          .map((routineId) => routineById.get(routineId))
          .filter((routine): routine is MergedRoutine => Boolean(routine));

        if (groupRoutines.length === 0) {
          return null;
        }

        return (
          <section
            className="routine-group"
            key={groupId}
            aria-labelledby={`${groupId}-title`}
          >
            <div className="group-heading">
              <div>
                <h2 id={`${groupId}-title`}>{groupMeta?.label ?? groupId}</h2>
                {groupMeta?.description ? <p>{groupMeta.description}</p> : null}
              </div>
              <span>{groupRoutines.length}개</span>
            </div>
            <div className="routine-card-list">
              {groupRoutines.map((routine) => (
                <RoutineCard
                  key={routine.card.id}
                  routine={routine}
                  onOpenRoutine={onOpenRoutine}
                />
              ))}
            </div>
          </section>
        );
      })}
      <span className="sr-only">
        {routines.length}개의 기본 루틴이 있습니다.
      </span>
    </div>
  );
}

interface SearchResultsProps {
  readonly query: string;
  readonly routines: readonly MergedRoutine[];
  readonly onOpenRoutine: (routineId: RoutineId) => void;
}

function SearchResults({ query, routines, onOpenRoutine }: SearchResultsProps) {
  return (
    <section className="search-results" aria-labelledby="search-results-title">
      <div className="section-heading">
        <h2 id="search-results-title">검색 결과</h2>
        <span>{routines.length}개</span>
      </div>
      {routines.length > 0 ? (
        <div className="routine-card-list">
          {routines.map((routine) => (
            <RoutineCard
              key={routine.card.id}
              routine={routine}
              onOpenRoutine={onOpenRoutine}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state" role="status">
          <strong>아직 맞는 루틴이 없어요.</strong>
          <p>“{query.trim()}”와 가까운 상황을 골라 준비물을 확인해 보세요.</p>
        </div>
      )}
    </section>
  );
}

interface RoutineCardProps {
  readonly routine: MergedRoutine;
  readonly onOpenRoutine: (routineId: RoutineId) => void;
}

function RoutineCard({ routine, onOpenRoutine }: RoutineCardProps) {
  return (
    <button
      className="routine-card"
      type="button"
      onClick={() => onOpenRoutine(routine.card.id)}
      aria-label={`${routine.card.title} 체크리스트 열기`}
    >
      <span className="card-kicker">체크리스트</span>
      <strong>{routine.card.title}</strong>
      <span className="card-hint">{routine.card.hint}</span>
      <span className="card-meta">
        기본 준비물 {routine.baseItems.length}개
        {routine.customItems.length > 0
          ? ` · 추가 ${routine.customItems.length}개`
          : ""}
      </span>
    </button>
  );
}

interface ChecklistSheetProps {
  readonly checkedItemIds: ReadonlySet<string>;
  readonly routine: MergedRoutine;
  readonly onAddCustomItem: (routineId: RoutineId, label: string) => void;
  readonly onClearChecks: () => void;
  readonly onClose: () => void;
  readonly onDeleteCustomItem: (
    routineId: RoutineId,
    customItemId: string,
  ) => void;
  readonly onMoveCustomItem: (
    routineId: RoutineId,
    customItemId: string,
    direction: "up" | "down",
  ) => void;
  readonly onResetRoutineCustomItems: (
    routineId: RoutineId,
    customItemIds: readonly string[],
  ) => void;
  readonly onToggleCheck: (itemId: string) => void;
}

function ChecklistSheet({
  checkedItemIds,
  routine,
  onAddCustomItem,
  onClearChecks,
  onClose,
  onDeleteCustomItem,
  onMoveCustomItem,
  onResetRoutineCustomItems,
  onToggleCheck,
}: ChecklistSheetProps) {
  const [customItemLabel, setCustomItemLabel] = useState("");
  const checkedCount = routine.allItems.filter((item) =>
    checkedItemIds.has(item.id),
  ).length;
  const totalCount = routine.allItems.length;
  const remainingCount = totalCount - checkedCount;
  const progressPercent =
    totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;
  const isComplete = totalCount > 0 && checkedCount === totalCount;
  const customItemIds = routine.customItems.map((item) => item.id);

  function submitCustomItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onAddCustomItem(routine.card.id, customItemLabel);
    setCustomItemLabel("");
  }

  return (
    <div className="sheet-layer">
      <button
        className="sheet-backdrop"
        type="button"
        aria-label="체크리스트 닫기"
        onClick={onClose}
      />
      <section
        className="checklist-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checklist-title"
      >
        <div className="sheet-handle" aria-hidden="true" />
        <div className="sheet-header">
          <div>
            <p>오늘 챙길 준비물</p>
            <h2 id="checklist-title">{routine.card.title}</h2>
          </div>
          <button
            className="sheet-close-button"
            type="button"
            aria-label="체크리스트 닫기"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="progress-block" aria-live="polite">
          <div className="progress-copy">
            <strong>
              {totalCount}개 중 {checkedCount}개 완료
            </strong>
            <span>
              {isComplete
                ? "다 챙겼어요. 이제 나가도 좋아요."
                : remainingCount === totalCount
                  ? "하나씩 체크해 보세요."
                  : `아직 ${remainingCount}개 남았어요.`}
            </span>
          </div>
          <div
            className="progress-track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={totalCount}
            aria-valuenow={checkedCount}
            aria-label={`${routine.card.title} 준비물 진행률`}
          >
            <span style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {isComplete ? (
          <div className="complete-banner" role="status">
            다 챙겼어요. 이제 나가도 좋아요.
          </div>
        ) : null}

        <ChecklistSection
          checkedItemIds={checkedItemIds}
          label="기본 준비물"
          items={routine.baseItems}
          onToggleCheck={onToggleCheck}
        />

        <CustomChecklistSection
          customItemLabel={customItemLabel}
          checkedItemIds={checkedItemIds}
          label="내가 추가한 준비물"
          emptyCopy="아직 추가한 준비물이 없어요."
          items={routine.customItems}
          routineId={routine.card.id}
          onChangeCustomItemLabel={setCustomItemLabel}
          onDeleteCustomItem={onDeleteCustomItem}
          onMoveCustomItem={onMoveCustomItem}
          onSubmitCustomItem={submitCustomItem}
          onToggleCheck={onToggleCheck}
        />

        <section className="reset-panel" aria-labelledby="reset-panel-title">
          <div className="reset-heading">
            <h3 id="reset-panel-title">설정/초기화</h3>
            <span>앱을 닫으면 저장되지 않아요</span>
          </div>
          <div className="reset-scope-list">
            <div className="reset-scope">
              <div>
                <strong>체크만 지우기</strong>
                <p>이 루틴의 완료 표시만 비워요.</p>
              </div>
              <button
                className="secondary-action compact-action"
                type="button"
                disabled={checkedCount === 0}
                onClick={onClearChecks}
              >
                실행
              </button>
            </div>
            <div className="reset-scope">
              <div>
                <strong>이 루틴의 커스텀 항목 초기화</strong>
                <p>직접 추가한 준비물만 삭제하고 기본 항목은 남겨요.</p>
              </div>
              <button
                className="danger-action compact-action"
                type="button"
                disabled={routine.customItems.length === 0}
                onClick={() =>
                  onResetRoutineCustomItems(routine.card.id, customItemIds)
                }
              >
                초기화
              </button>
            </div>
            <div className="reset-scope info-scope">
              <div>
                <strong>홈 보기/카드 순서 기본값 안내</strong>
                <p>카드 순서 편집은 Gate 7 이후에 열릴 예정이에요.</p>
              </div>
              <span>대기</span>
            </div>
          </div>
        </section>

        <div className="sheet-actions">
          <button
            className="secondary-action"
            type="button"
            disabled={checkedCount === 0}
            onClick={onClearChecks}
          >
            체크만 지우기
          </button>
          <button className="primary-action" type="button" onClick={onClose}>
            닫기
          </button>
        </div>
      </section>
    </div>
  );
}

interface ChecklistSectionProps {
  readonly checkedItemIds: ReadonlySet<string>;
  readonly emptyCopy?: string;
  readonly label: string;
  readonly items: MergedRoutine["allItems"];
  readonly onToggleCheck: (itemId: string) => void;
}

function ChecklistSection({
  checkedItemIds,
  emptyCopy,
  label,
  items,
  onToggleCheck,
}: ChecklistSectionProps) {
  return (
    <section className="checklist-section" aria-label={label}>
      <h3>{label}</h3>
      {items.length > 0 ? (
        <div className="checklist-items">
          {items.map((item) => {
            const isChecked = checkedItemIds.has(item.id);

            return (
              <div
                className={
                  isChecked
                    ? "checklist-row base-row checked"
                    : "checklist-row base-row"
                }
                key={item.id}
              >
                <label className="check-toggle">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleCheck(item.id)}
                  />
                  <span className="checkbox-mark" aria-hidden="true" />
                  <span className="item-copy">
                    <span>{item.label}</span>
                    <small>
                      {item.type === "base"
                        ? "기본 항목 · 삭제 불가"
                        : "내가 추가한 항목"}
                    </small>
                  </span>
                </label>
                <span className="locked-badge" aria-hidden="true">
                  기본
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="custom-empty">{emptyCopy}</p>
      )}
    </section>
  );
}

interface CustomChecklistSectionProps extends ChecklistSectionProps {
  readonly customItemLabel: string;
  readonly routineId: RoutineId;
  readonly onChangeCustomItemLabel: (label: string) => void;
  readonly onDeleteCustomItem: (
    routineId: RoutineId,
    customItemId: string,
  ) => void;
  readonly onMoveCustomItem: (
    routineId: RoutineId,
    customItemId: string,
    direction: "up" | "down",
  ) => void;
  readonly onSubmitCustomItem: (event: FormEvent<HTMLFormElement>) => void;
}

function CustomChecklistSection({
  checkedItemIds,
  customItemLabel,
  emptyCopy,
  label,
  items,
  routineId,
  onChangeCustomItemLabel,
  onDeleteCustomItem,
  onMoveCustomItem,
  onSubmitCustomItem,
  onToggleCheck,
}: CustomChecklistSectionProps) {
  return (
    <section className="checklist-section" aria-label={label}>
      <div className="custom-section-heading">
        <h3>{label}</h3>
        <span>{items.length}개</span>
      </div>
      <form className="custom-item-form" onSubmit={onSubmitCustomItem}>
        <label className="sr-only" htmlFor="custom-item-label">
          추가할 준비물 이름
        </label>
        <input
          id="custom-item-label"
          type="text"
          value={customItemLabel}
          onChange={(event) => onChangeCustomItemLabel(event.target.value)}
          placeholder="추가할 준비물"
          maxLength={40}
        />
        <button
          className="primary-action compact-action"
          type="submit"
          disabled={customItemLabel.trim().length === 0}
        >
          추가
        </button>
      </form>
      {items.length > 0 ? (
        <div className="checklist-items custom-items">
          {items.map((item, index) => {
            const isChecked = checkedItemIds.has(item.id);
            const isFirst = index === 0;
            const isLast = index === items.length - 1;

            return (
              <div
                className={
                  isChecked
                    ? "checklist-row custom-row checked"
                    : "checklist-row custom-row"
                }
                key={item.id}
              >
                <label className="check-toggle">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleCheck(item.id)}
                  />
                  <span className="checkbox-mark" aria-hidden="true" />
                  <span className="item-copy">
                    <span>{item.label}</span>
                    <small>내가 추가한 항목</small>
                  </span>
                </label>
                <div
                  className="item-controls"
                  aria-label={`${item.label} 순서 편집`}
                >
                  <button
                    className="icon-action"
                    type="button"
                    disabled={isFirst}
                    aria-label={`${item.label} 위로 이동`}
                    onClick={() => onMoveCustomItem(routineId, item.id, "up")}
                  >
                    위
                  </button>
                  <button
                    className="icon-action"
                    type="button"
                    disabled={isLast}
                    aria-label={`${item.label} 아래로 이동`}
                    onClick={() => onMoveCustomItem(routineId, item.id, "down")}
                  >
                    아래
                  </button>
                  <button
                    className="delete-action"
                    type="button"
                    aria-label={`${item.label} 삭제`}
                    onClick={() => onDeleteCustomItem(routineId, item.id)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="custom-empty">{emptyCopy}</p>
      )}
    </section>
  );
}

function findRoutineOverride(
  overrides: readonly UserRoutineOverride[],
  routineId: RoutineId,
): UserRoutineOverride | undefined {
  return overrides.find((override) => override.routineId === routineId);
}

function upsertRoutineOverride(
  overrides: readonly UserRoutineOverride[],
  nextOverride: UserRoutineOverride,
): readonly UserRoutineOverride[] {
  if (nextOverride.customItems.length === 0) {
    return overrides.filter(
      (override) => override.routineId !== nextOverride.routineId,
    );
  }

  const hasOverride = overrides.some(
    (override) => override.routineId === nextOverride.routineId,
  );

  if (!hasOverride) {
    return [...overrides, nextOverride];
  }

  return overrides.map((override) =>
    override.routineId === nextOverride.routineId ? nextOverride : override,
  );
}

function createCompleteCustomItemOrder(
  override: UserRoutineOverride,
): readonly string[] {
  const customItemIds = override.customItems.map((item) => item.id);
  const customItemIdSet = new Set(customItemIds);
  const orderedIds = override.customItemOrder.filter((id) =>
    customItemIdSet.has(id),
  );
  const missingIds = customItemIds.filter((id) => !orderedIds.includes(id));

  return [...orderedIds, ...missingIds];
}

function createCustomItemId(routineId: RoutineId): string {
  const randomPart =
    "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  return `${routineId}:custom:${randomPart}`;
}

function createRecentRoutines(
  recentRoutines: readonly RecentRoutine[],
  routineId: RoutineId,
): readonly RecentRoutine[] {
  const nextRoutine: RecentRoutine = {
    routineId,
    lastOpenedAt: new Date().toISOString(),
  };

  return [
    nextRoutine,
    ...recentRoutines.filter((recent) => recent.routineId !== routineId),
  ].slice(0, maxRecentRoutineCount);
}

function matchesRoutine(
  routine: MergedRoutine,
  normalizedQuery: string,
): boolean {
  const searchableText = [
    routine.card.title,
    routine.card.hint,
    ...routine.card.tags,
    ...routine.baseItems.map((item) => item.label),
    ...routine.customItems.map((item) => item.label),
  ]
    .map(normalizeSearchText)
    .join(" ");

  return searchableText.includes(normalizedQuery);
}

function normalizeSearchText(value: string): string {
  return value.trim().toLocaleLowerCase("ko-KR");
}

export default App;
