import type { HomeViewMode, RoutineId, ViewModeGroupId } from "./ids";
import { isRoutineId } from "./ids";
import type {
  AppStorageV1,
  ChecklistItem,
  CustomItem,
  MergedRoutine,
  RoutineCard,
  SessionCheckState,
  TemplateRoutine,
  UserRoutineOverride,
} from "./routine";
import { templateRoutines } from "./templateRoutines";
import { getDefaultRoutineOrder } from "./viewModes";

export const defaultHomeViewMode: HomeViewMode = "prepFlow";
export const maxRecentRoutineCount = 3;
export const maxCustomItemLabelLength = 40;

export function createDefaultSessionCheckState(): SessionCheckState {
  return {
    openRoutineId: null,
    checkedItemIds: [],
  };
}

export function createOpenSessionCheckState(
  routineId: RoutineId,
): SessionCheckState {
  return {
    openRoutineId: routineId,
    checkedItemIds: [],
  };
}

export function createDefaultAppStorage(): AppStorageV1 {
  return {
    schemaVersion: 1,
    homeViewMode: defaultHomeViewMode,
    routineOverrides: [],
    cardOrderOverrides: {},
    recentRoutines: [],
  };
}

export function toRoutineCard(template: TemplateRoutine): RoutineCard {
  return {
    id: template.id,
    title: template.title,
    hint: template.hint,
    itemCount: template.baseItems.length,
    prepFlowGroup: template.prepFlowGroup,
    categoryGroup: template.categoryGroup,
    tags: template.tags,
  };
}

export function mergeRoutine(
  template: TemplateRoutine,
  override?: UserRoutineOverride,
): MergedRoutine {
  const baseItems = template.baseItems.map<ChecklistItem>((label, index) => ({
    id: createBaseItemId(template.id, index),
    label,
    type: "base",
    sourceRoutineId: template.id,
  }));
  const customItems = sortCustomItems(override).map<ChecklistItem>((item) => ({
    id: item.id,
    label: item.label,
    type: "custom",
    sourceRoutineId: template.id,
  }));

  return {
    card: {
      ...toRoutineCard(template),
      itemCount: baseItems.length + customItems.length,
    },
    baseItems,
    customItems,
    allItems: [...baseItems, ...customItems],
    hasOverride: Boolean(override && override.customItems.length > 0),
  };
}

export function mergeTemplateRoutines(
  templates: readonly TemplateRoutine[],
  overrides: readonly UserRoutineOverride[],
): readonly MergedRoutine[] {
  return templates.map((template) =>
    mergeRoutine(
      template,
      overrides.find((override) => override.routineId === template.id),
    ),
  );
}

export function getRoutineCards(
  templates: readonly TemplateRoutine[] = templateRoutines,
): readonly RoutineCard[] {
  return templates.map(toRoutineCard);
}

export function resolveRoutineOrder(
  viewMode: HomeViewMode,
  groupId: ViewModeGroupId,
  storage: AppStorageV1,
): readonly RoutineId[] {
  const overrideOrder = storage.cardOrderOverrides[viewMode]?.[groupId] ?? [];
  const defaultOrder = getDefaultRoutineOrder(viewMode, groupId);
  const defaultSet = new Set<RoutineId>(defaultOrder);
  const validOverrideOrder = overrideOrder.filter(
    (routineId) => isRoutineId(routineId) && defaultSet.has(routineId),
  );
  const remainingDefaultOrder = defaultOrder.filter(
    (routineId) => !validOverrideOrder.includes(routineId),
  );

  return [...validOverrideOrder, ...remainingDefaultOrder];
}

export function normalizeCustomItemLabel(label: string): string {
  return label.trim().replace(/\s+/g, " ").slice(0, maxCustomItemLabelLength);
}

export function createUserRoutineOverride(
  routineId: RoutineId,
  customItems: readonly CustomItem[] = [],
  customItemOrder: readonly string[] = customItems.map((item) => item.id),
): UserRoutineOverride {
  return {
    routineId,
    customItems: [...customItems],
    customItemOrder: [...customItemOrder],
  };
}

export function addCustomItemToOverride(
  override: UserRoutineOverride,
  item: CustomItem,
): UserRoutineOverride {
  const normalizedLabel = normalizeCustomItemLabel(item.label);

  if (normalizedLabel.length === 0) {
    return override;
  }

  const hasDuplicate = override.customItems.some(
    (existing) =>
      normalizeCustomItemLabel(existing.label).toLocaleLowerCase("ko-KR") ===
      normalizedLabel.toLocaleLowerCase("ko-KR"),
  );

  if (hasDuplicate) {
    return override;
  }

  const normalizedItem = {
    ...item,
    label: normalizedLabel,
  };

  return {
    ...override,
    customItems: [...override.customItems, normalizedItem],
    customItemOrder: [...override.customItemOrder, normalizedItem.id],
  };
}

export function removeCustomItemFromOverride(
  override: UserRoutineOverride,
  customItemId: string,
): UserRoutineOverride {
  return {
    ...override,
    customItems: override.customItems.filter((item) => item.id !== customItemId),
    customItemOrder: override.customItemOrder.filter((id) => id !== customItemId),
  };
}

export function clearSessionChecks(
  state: SessionCheckState,
): SessionCheckState {
  return {
    ...state,
    checkedItemIds: [],
  };
}

export function toggleSessionCheck(
  state: SessionCheckState,
  itemId: string,
): SessionCheckState {
  const isChecked = state.checkedItemIds.includes(itemId);

  return {
    ...state,
    checkedItemIds: isChecked
      ? state.checkedItemIds.filter((checkedItemId) => checkedItemId !== itemId)
      : [...state.checkedItemIds, itemId],
  };
}

function createBaseItemId(routineId: RoutineId, index: number): string {
  return `${routineId}:base:${index + 1}`;
}

function sortCustomItems(
  override: UserRoutineOverride | undefined,
): readonly CustomItem[] {
  if (!override) {
    return [];
  }

  const orderIndex = new Map(
    override.customItemOrder.map((id, index) => [id, index]),
  );

  return [...override.customItems].sort((left, right) => {
    const leftIndex = orderIndex.get(left.id) ?? Number.MAX_SAFE_INTEGER;
    const rightIndex = orderIndex.get(right.id) ?? Number.MAX_SAFE_INTEGER;

    if (leftIndex !== rightIndex) {
      return leftIndex - rightIndex;
    }

    return left.createdAt.localeCompare(right.createdAt);
  });
}
