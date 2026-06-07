import { Analytics as TossAnalytics } from "@apps-in-toss/web-framework";
import {
  sanitizeAnalyticsPayload,
  type AnalyticsAdapter,
  type AnalyticsEventName,
  type AnalyticsPayload,
  type AnalyticsPrimitive,
} from "./analyticsAdapter";

type TossAnalyticsParams = {
  readonly log_name: string;
} & Record<string, AnalyticsPrimitive>;

const clickEvents: readonly AnalyticsEventName[] = [
  "routine_opened",
  "routine_checked",
  "custom_item_added",
  "custom_item_deleted",
  "custom_item_reordered",
  "view_mode_changed",
  "reset_action_clicked",
];

export function createTossAnalyticsAdapter(): AnalyticsAdapter {
  return {
    source: "toss",
    track(eventName, payload) {
      const params = toTossAnalyticsParams(eventName, payload);
      const logger =
        eventName === "screen_viewed"
          ? TossAnalytics.screen
          : clickEvents.includes(eventName)
            ? TossAnalytics.click
            : TossAnalytics.impression;

      void Promise.resolve(logger(params)).catch(() => undefined);
    },
  };
}

function toTossAnalyticsParams(
  eventName: AnalyticsEventName,
  payload: AnalyticsPayload | undefined,
): TossAnalyticsParams {
  return {
    log_name: eventName,
    ...sanitizeAnalyticsPayload(eventName, payload),
  };
}
