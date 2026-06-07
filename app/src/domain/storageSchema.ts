import {
  homeViewModes,
  isHomeViewMode,
  isRoutineId,
  isViewModeGroupId,
  storageSchemaVersion,
} from "./ids";
import type {
  AppStorageV1,
  CardOrderOverrides,
  CustomItem,
  RecentRoutine,
  UserRoutineOverride,
} from "./routine";
import { createDefaultAppStorage } from "./mergeRoutine";

export const appStorageKey = "today-what-to-bring:v1:app-storage";

export type StorageLoadResult =
  | {
      readonly ok: true;
      readonly data: AppStorageV1;
      readonly usedFallback: false;
    }
  | {
      readonly ok: false;
      readonly data: AppStorageV1;
      readonly usedFallback: true;
      readonly error: string;
    };

export function serializeAppStorage(storage: AppStorageV1): string {
  return JSON.stringify(storage);
}

export function parseAppStorage(serialized: string | null): StorageLoadResult {
  if (serialized === null) {
    return {
      ok: true,
      data: createDefaultAppStorage(),
      usedFallback: false,
    };
  }

  try {
    const parsed = JSON.parse(serialized) as unknown;
    const sanitized = sanitizeAppStorage(parsed);

    if (!sanitized) {
      return createFallbackLoadResult("Invalid storage schema");
    }

    return {
      ok: true,
      data: sanitized,
      usedFallback: false,
    };
  } catch (error) {
    return createFallbackLoadResult(
      error instanceof Error ? error.message : "Invalid storage JSON",
    );
  }
}

export function sanitizeAppStorage(value: unknown): AppStorageV1 | null {
  const record = asRecord(value);

  if (!record || record.schemaVersion !== storageSchemaVersion) {
    return null;
  }

  return {
    schemaVersion: storageSchemaVersion,
    homeViewMode: isHomeViewMode(record.homeViewMode)
      ? record.homeViewMode
      : "prepFlow",
    routineOverrides: sanitizeRoutineOverrides(record.routineOverrides),
    cardOrderOverrides: sanitizeCardOrderOverrides(record.cardOrderOverrides),
    recentRoutines: sanitizeRecentRoutines(record.recentRoutines),
  };
}

function sanitizeRoutineOverrides(value: unknown): readonly UserRoutineOverride[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((candidate) => {
    const record = asRecord(candidate);

    if (!record || !isRoutineId(record.routineId)) {
      return [];
    }

    const customItems = sanitizeCustomItems(record.customItems);
    const customItemIds = new Set(customItems.map((item) => item.id));
    const customItemOrder = Array.isArray(record.customItemOrder)
      ? record.customItemOrder.filter(
          (id): id is string => typeof id === "string" && customItemIds.has(id),
        )
      : customItems.map((item) => item.id);

    return [
      {
        routineId: record.routineId,
        customItems,
        customItemOrder,
      },
    ];
  });
}

function sanitizeCustomItems(value: unknown): readonly CustomItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((candidate) => {
    const record = asRecord(candidate);

    if (
      !record ||
      typeof record.id !== "string" ||
      typeof record.label !== "string" ||
      typeof record.createdAt !== "string"
    ) {
      return [];
    }

    return [
      {
        id: record.id,
        label: record.label,
        createdAt: record.createdAt,
      },
    ];
  });
}

function sanitizeCardOrderOverrides(value: unknown): CardOrderOverrides {
  const record = asRecord(value);

  if (!record) {
    return {};
  }

  return homeViewModes.reduce<CardOrderOverrides>((overrides, viewMode) => {
    const modeRecord = asRecord(record[viewMode]);

    if (!modeRecord) {
      return overrides;
    }

    const groupOverrides = Object.entries(modeRecord).reduce<
      NonNullable<CardOrderOverrides[typeof viewMode]>
    >((groups, [groupId, order]) => {
      if (!isViewModeGroupId(groupId) || !Array.isArray(order)) {
        return groups;
      }

      return {
        ...groups,
        [groupId]: order.filter(isRoutineId),
      };
    }, {});

    return {
      ...overrides,
      [viewMode]: groupOverrides,
    };
  }, {});
}

function sanitizeRecentRoutines(value: unknown): readonly RecentRoutine[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((candidate) => {
    const record = asRecord(candidate);

    if (
      !record ||
      !isRoutineId(record.routineId) ||
      typeof record.lastOpenedAt !== "string"
    ) {
      return [];
    }

    return [
      {
        routineId: record.routineId,
        lastOpenedAt: record.lastOpenedAt,
      },
    ];
  });
}

function createFallbackLoadResult(error: string): StorageLoadResult {
  return {
    ok: false,
    data: createDefaultAppStorage(),
    usedFallback: true,
    error,
  };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;
}
