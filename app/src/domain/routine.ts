import type {
  CategoryGroup,
  HomeViewMode,
  PrepFlowGroup,
  RoutineId,
  ViewModeGroupId,
} from "./ids";

export type ChecklistItemType = "base" | "custom";

export interface ChecklistItem {
  readonly id: string;
  readonly label: string;
  readonly type: ChecklistItemType;
  readonly sourceRoutineId: RoutineId;
}

export interface RoutineCard {
  readonly id: RoutineId;
  readonly title: string;
  readonly hint: string;
  readonly itemCount: number;
  readonly prepFlowGroup: PrepFlowGroup;
  readonly categoryGroup: CategoryGroup;
  readonly tags: readonly string[];
}

export interface TemplateRoutine {
  readonly id: RoutineId;
  readonly title: string;
  readonly hint: string;
  readonly prepFlowGroup: PrepFlowGroup;
  readonly categoryGroup: CategoryGroup;
  readonly tags: readonly string[];
  readonly baseItems: readonly string[];
}

export interface CustomItem {
  readonly id: string;
  readonly label: string;
  readonly createdAt: string;
}

export interface UserRoutineOverride {
  readonly routineId: RoutineId;
  readonly customItems: readonly CustomItem[];
  readonly customItemOrder: readonly string[];
}

export interface MergedRoutine {
  readonly card: RoutineCard;
  readonly baseItems: readonly ChecklistItem[];
  readonly customItems: readonly ChecklistItem[];
  readonly allItems: readonly ChecklistItem[];
  readonly hasOverride: boolean;
}

export interface SessionCheckState {
  readonly openRoutineId: RoutineId | null;
  readonly checkedItemIds: readonly string[];
}

export interface RecentRoutine {
  readonly routineId: RoutineId;
  readonly lastOpenedAt: string;
}

export type CardOrderOverrides = Partial<
  Record<HomeViewMode, Partial<Record<ViewModeGroupId, readonly RoutineId[]>>>
>;

export interface AppStorageV1 {
  readonly schemaVersion: 1;
  readonly homeViewMode: HomeViewMode;
  readonly routineOverrides: readonly UserRoutineOverride[];
  readonly cardOrderOverrides: CardOrderOverrides;
  readonly recentRoutines: readonly RecentRoutine[];
}
