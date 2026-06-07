import type { KeyValueStorageAdapter } from "./storageAdapter";

const memoryStorage = new Map<string, string>();

export function createMockStorageAdapter(): KeyValueStorageAdapter {
  return {
    source: "mock",
    async getItem(key) {
      const localStorage = getBrowserLocalStorage();

      return localStorage?.getItem(key) ?? memoryStorage.get(key) ?? null;
    },
    async setItem(key, value) {
      const localStorage = getBrowserLocalStorage();

      if (localStorage) {
        localStorage.setItem(key, value);
        return;
      }

      memoryStorage.set(key, value);
    },
    async removeItem(key) {
      const localStorage = getBrowserLocalStorage();

      if (localStorage) {
        localStorage.removeItem(key);
      }

      memoryStorage.delete(key);
    },
    async clearItems() {
      const localStorage = getBrowserLocalStorage();

      if (localStorage) {
        localStorage.clear();
      }

      memoryStorage.clear();
    },
  };
}

function getBrowserLocalStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const localStorage = window.localStorage;
    const testKey = "today-what-to-bring:storage-test";

    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);

    return localStorage;
  } catch {
    return null;
  }
}
