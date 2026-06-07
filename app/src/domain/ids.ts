export const routineIds = [
  "commute",
  "outing",
  "workout",
  "rainy",
  "hospital",
  "grocery",
  "childSchool",
  "businessTrip",
  "golf",
  "camping",
  "domesticTravel",
  "overseasTravel",
  "hiking",
] as const;

export type RoutineId = (typeof routineIds)[number];

export const prepFlowGroups = ["now", "todayTomorrow", "early"] as const;

export type PrepFlowGroup = (typeof prepFlowGroups)[number];

export const categoryGroups = [
  "daily",
  "health",
  "family",
  "work",
  "leisure",
] as const;

export type CategoryGroup = (typeof categoryGroups)[number];

export const homeViewModes = ["prepFlow", "category"] as const;

export type HomeViewMode = (typeof homeViewModes)[number];

export type ViewModeGroupId = PrepFlowGroup | CategoryGroup;

export const storageSchemaVersion = 1;

export type StorageSchemaVersion = typeof storageSchemaVersion;

export function isRoutineId(value: unknown): value is RoutineId {
  return isOneOf(routineIds, value);
}

export function isHomeViewMode(value: unknown): value is HomeViewMode {
  return isOneOf(homeViewModes, value);
}

export function isViewModeGroupId(value: unknown): value is ViewModeGroupId {
  return isOneOf(prepFlowGroups, value) || isOneOf(categoryGroups, value);
}

function isOneOf<T extends string>(
  values: readonly T[],
  value: unknown,
): value is T {
  return typeof value === "string" && (values as readonly string[]).includes(value);
}
