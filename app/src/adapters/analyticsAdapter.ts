import {
  categoryGroups,
  homeViewModes,
  prepFlowGroups,
  routineIds,
} from "../domain";
import { createMockAnalyticsAdapter } from "./mockAnalyticsAdapter";
import { createTossAnalyticsAdapter } from "./tossAnalyticsAdapter";
import { getTossEnvironment, hasTossNativeBridge } from "./tossEnvironment";

export type AnalyticsPrimitive = string | number | boolean | null;

export type AnalyticsEventName =
  | "screen_viewed"
  | "routine_opened"
  | "routine_checked"
  | "custom_item_added"
  | "custom_item_deleted"
  | "custom_item_reordered"
  | "search_performed"
  | "view_mode_changed"
  | "reset_action_clicked"
  | "storage_failure";

export type AnalyticsPayloadKey =
  | "routine_id"
  | "category"
  | "prep_flow"
  | "checked"
  | "item_origin"
  | "query_length"
  | "result_count"
  | "view_mode"
  | "reset_scope";

export type AnalyticsPayload = Partial<
  Record<AnalyticsPayloadKey, AnalyticsPrimitive>
>;

export interface AnalyticsAdapter {
  readonly source: "mock" | "toss";
  readonly track: (
    eventName: AnalyticsEventName,
    payload?: AnalyticsPayload,
  ) => void;
}

const allowedEvents: readonly AnalyticsEventName[] = [
  "screen_viewed",
  "routine_opened",
  "routine_checked",
  "custom_item_added",
  "custom_item_deleted",
  "custom_item_reordered",
  "search_performed",
  "view_mode_changed",
  "reset_action_clicked",
  "storage_failure",
];

const allowedPayloadKeysByEvent: Record<
  AnalyticsEventName,
  readonly AnalyticsPayloadKey[]
> = {
  screen_viewed: ["view_mode"],
  routine_opened: ["routine_id", "category", "prep_flow"],
  routine_checked: [
    "routine_id",
    "category",
    "prep_flow",
    "checked",
    "item_origin",
  ],
  custom_item_added: ["routine_id", "category", "prep_flow", "item_origin"],
  custom_item_deleted: ["routine_id", "category", "prep_flow", "item_origin"],
  custom_item_reordered: ["routine_id", "category", "prep_flow", "item_origin"],
  search_performed: ["query_length", "result_count"],
  view_mode_changed: ["view_mode"],
  reset_action_clicked: ["routine_id", "reset_scope"],
  storage_failure: [],
};

const allowedStringValuesByKey: Partial<
  Record<AnalyticsPayloadKey, readonly string[]>
> = {
  routine_id: routineIds,
  category: categoryGroups,
  prep_flow: prepFlowGroups,
  item_origin: ["base", "custom"],
  view_mode: homeViewModes,
  reset_scope: ["checks", "routine_custom_items"],
};

export function createAnalyticsAdapter(): AnalyticsAdapter {
  const environment = getTossEnvironment();

  if (environment.operationalEnvironment && hasTossNativeBridge()) {
    return createTossAnalyticsAdapter();
  }

  return createMockAnalyticsAdapter();
}

export function sanitizeAnalyticsPayload(
  eventName: AnalyticsEventName,
  payload: AnalyticsPayload | undefined,
): AnalyticsPayload {
  if (!allowedEvents.includes(eventName) || !payload) {
    return {};
  }

  const allowedKeys = allowedPayloadKeysByEvent[eventName];

  return allowedKeys.reduce<AnalyticsPayload>((sanitizedPayload, key) => {
    const value = payload[key];

    if (!isAllowedPrimitive(value) || !isAllowedPayloadValue(key, value)) {
      return sanitizedPayload;
    }

    return {
      ...sanitizedPayload,
      [key]: value,
    };
  }, {});
}

function isAllowedPrimitive(
  value: AnalyticsPrimitive | undefined,
): value is AnalyticsPrimitive {
  return (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

function isAllowedPayloadValue(
  key: AnalyticsPayloadKey,
  value: AnalyticsPrimitive,
): boolean {
  if (typeof value === "number") {
    return Number.isFinite(value) && value >= 0;
  }

  if (typeof value !== "string") {
    return true;
  }

  const allowedStringValues = allowedStringValuesByKey[key];

  return Boolean(allowedStringValues?.includes(value));
}
