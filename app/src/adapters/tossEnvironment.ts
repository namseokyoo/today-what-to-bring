import * as TossFramework from "@apps-in-toss/web-framework";
import { knownDeepLinks } from "../constants/deepLinks";

export type OperationalEnvironment = "toss" | "sandbox";

export interface TossEnvironmentInfo {
  readonly operationalEnvironment: OperationalEnvironment | null;
  readonly schemeUri: string | null;
  readonly isKnownSchemeUri: boolean;
}

export interface SafeAreaInsetsValue {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
}

interface SafeAreaInsetsApi {
  readonly get?: () => Partial<SafeAreaInsetsValue> | null | undefined;
  readonly subscribe?: (options: {
    readonly onEvent: (
      insets: Partial<SafeAreaInsetsValue> | null | undefined,
    ) => void;
  }) => (() => void) | void;
}

const fallbackSafeAreaInsets: SafeAreaInsetsValue = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

export function getTossEnvironment(): TossEnvironmentInfo {
  const operationalEnvironment = readOperationalEnvironment();
  const schemeUri = safelyReadString(TossFramework.getSchemeUri);

  return {
    operationalEnvironment,
    schemeUri,
    isKnownSchemeUri:
      schemeUri !== null &&
      (knownDeepLinks as readonly string[]).includes(schemeUri),
  };
}

export function hasTossNativeBridge(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const windowWithBridge = window as Window & {
    readonly ReactNativeWebView?: {
      readonly postMessage?: unknown;
    };
  };

  return typeof windowWithBridge.ReactNativeWebView?.postMessage === "function";
}

export function getSafeAreaInsets(): SafeAreaInsetsValue {
  const safeAreaInsets = getSafeAreaInsetsApi();

  if (!safeAreaInsets?.get) {
    return fallbackSafeAreaInsets;
  }

  try {
    return normalizeSafeAreaInsets(safeAreaInsets.get());
  } catch {
    return fallbackSafeAreaInsets;
  }
}

export function subscribeSafeAreaInsets(
  onChange: (insets: SafeAreaInsetsValue) => void,
): () => void {
  const safeAreaInsets = getSafeAreaInsetsApi();

  if (!safeAreaInsets?.subscribe) {
    return noop;
  }

  try {
    const unsubscribe = safeAreaInsets.subscribe({
      onEvent: (insets) => {
        onChange(normalizeSafeAreaInsets(insets));
      },
    });

    return typeof unsubscribe === "function" ? unsubscribe : noop;
  } catch {
    return noop;
  }
}

function readOperationalEnvironment(): OperationalEnvironment | null {
  try {
    const value = TossFramework.getOperationalEnvironment();

    return value === "toss" || value === "sandbox" ? value : null;
  } catch {
    return null;
  }
}

function safelyReadString(reader: () => string): string | null {
  try {
    const value = reader();

    return typeof value === "string" && value.length > 0 ? value : null;
  } catch {
    return null;
  }
}

function getSafeAreaInsetsApi(): SafeAreaInsetsApi | undefined {
  const frameworkWithSafeArea = TossFramework as typeof TossFramework & {
    readonly SafeAreaInsets?: SafeAreaInsetsApi;
  };

  return frameworkWithSafeArea.SafeAreaInsets;
}

function normalizeSafeAreaInsets(
  insets: Partial<SafeAreaInsetsValue> | null | undefined,
): SafeAreaInsetsValue {
  return {
    top: normalizeInset(insets?.top),
    right: normalizeInset(insets?.right),
    bottom: normalizeInset(insets?.bottom),
    left: normalizeInset(insets?.left),
  };
}

function normalizeInset(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function noop() {}
