import type { AnalyticsAdapter } from "./analyticsAdapter";

export function createMockAnalyticsAdapter(): AnalyticsAdapter {
  return {
    source: "mock",
    track() {
      return undefined;
    },
  };
}
