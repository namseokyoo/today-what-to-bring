import { createMockStorageAdapter } from "./mockStorageAdapter";
import { createTossStorageAdapter } from "./tossStorageAdapter";
import { getTossEnvironment, hasTossNativeBridge } from "./tossEnvironment";

export interface KeyValueStorageAdapter {
  readonly source: "mock" | "toss";
  readonly getItem: (key: string) => Promise<string | null>;
  readonly setItem: (key: string, value: string) => Promise<void>;
  readonly removeItem: (key: string) => Promise<void>;
  readonly clearItems: () => Promise<void>;
}

export function createStorageAdapter(): KeyValueStorageAdapter {
  const environment = getTossEnvironment();

  if (environment.operationalEnvironment && hasTossNativeBridge()) {
    return createTossStorageAdapter();
  }

  return createMockStorageAdapter();
}
