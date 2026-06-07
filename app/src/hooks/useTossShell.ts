import { useEffect, useRef } from "react";
import {
  registerBackHandler,
  type BackHandler,
} from "../adapters/navigationAdapter";
import {
  getSafeAreaInsets,
  getTossEnvironment,
  subscribeSafeAreaInsets,
  type SafeAreaInsetsValue,
} from "../adapters/tossEnvironment";

interface UseTossShellOptions {
  readonly onBack: BackHandler;
}

const safeAreaCssVariables: Record<keyof SafeAreaInsetsValue, string> = {
  top: "--safe-area-inset-top",
  right: "--safe-area-inset-right",
  bottom: "--safe-area-inset-bottom",
  left: "--safe-area-inset-left",
};

export function useTossShell({ onBack }: UseTossShellOptions): void {
  const onBackRef = useRef(onBack);

  useEffect(() => {
    onBackRef.current = onBack;
  }, [onBack]);

  useEffect(() => {
    applyEnvironmentAttributes();
    applySafeAreaInsets(getSafeAreaInsets());

    const unsubscribeSafeAreaInsets = subscribeSafeAreaInsets((insets) => {
      applySafeAreaInsets(insets);
    });
    const unregisterBackHandler = registerBackHandler(() =>
      onBackRef.current(),
    );

    return () => {
      unsubscribeSafeAreaInsets();
      unregisterBackHandler();
    };
  }, []);
}

function applyEnvironmentAttributes() {
  if (typeof document === "undefined") {
    return;
  }

  const environment = getTossEnvironment();
  const root = document.documentElement;

  root.dataset.tossOperationalEnvironment =
    environment.operationalEnvironment ?? "local";
  root.dataset.tossSchemeUriStatus = environment.schemeUri
    ? environment.isKnownSchemeUri
      ? "known"
      : "unknown"
    : "missing";
}

function applySafeAreaInsets(insets: SafeAreaInsetsValue) {
  if (typeof document === "undefined") {
    return;
  }

  Object.entries(safeAreaCssVariables).forEach(([key, variableName]) => {
    const value = insets[key as keyof SafeAreaInsetsValue];

    document.documentElement.style.setProperty(variableName, `${value}px`);
  });
}
