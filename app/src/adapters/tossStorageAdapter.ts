import { Storage as TossStorage } from "@apps-in-toss/web-framework";
import type { KeyValueStorageAdapter } from "./storageAdapter";

export function createTossStorageAdapter(): KeyValueStorageAdapter {
  return {
    source: "toss",
    getItem: (key) => TossStorage.getItem(key),
    setItem: (key, value) => TossStorage.setItem(key, value),
    removeItem: (key) => TossStorage.removeItem(key),
    clearItems: () => TossStorage.clearItems(undefined),
  };
}
