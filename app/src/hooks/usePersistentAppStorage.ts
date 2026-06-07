import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { createAnalyticsAdapter } from "../adapters/analyticsAdapter";
import { createStorageAdapter } from "../adapters/storageAdapter";
import { createDefaultAppStorage } from "../domain";
import type { AppStorageV1 } from "../domain";
import {
  appStorageKey,
  parseAppStorage,
  serializeAppStorage,
} from "../domain/storageSchema";

export interface StorageWarning {
  readonly kind: "load" | "save";
  readonly message: string;
}

export interface PersistentAppStorageState {
  readonly storage: AppStorageV1;
  readonly setStorage: Dispatch<SetStateAction<AppStorageV1>>;
  readonly storageWarning: StorageWarning | null;
}

const storageWarningMessage =
  "저장소 연결이 불안정해요. 지금 화면은 계속 쓸 수 있지만 다시 들어오면 복원이 실패할 수 있어요.";

export function usePersistentAppStorage(): PersistentAppStorageState {
  const adapter = useMemo(() => createStorageAdapter(), []);
  const analytics = useMemo(() => createAnalyticsAdapter(), []);
  const [storage, setStorage] = useState<AppStorageV1>(() =>
    createDefaultAppStorage(),
  );
  const [storageWarning, setStorageWarning] = useState<StorageWarning | null>(
    null,
  );
  const isLoadedRef = useRef(false);
  const lastSerializedStorageRef = useRef<string | null>(null);

  const reportStorageFailure = useCallback(
    (kind: StorageWarning["kind"]) => {
      setStorageWarning({
        kind,
        message: storageWarningMessage,
      });
      analytics.track("storage_failure");
    },
    [analytics],
  );

  useEffect(() => {
    let isDisposed = false;

    async function loadStorage() {
      try {
        const serializedStorage = await adapter.getItem(appStorageKey);
        const loadResult = parseAppStorage(serializedStorage);

        if (isDisposed) {
          return;
        }

        lastSerializedStorageRef.current = serializedStorage;
        setStorage(loadResult.data);
        isLoadedRef.current = true;

        if (!loadResult.ok) {
          reportStorageFailure("load");
        }
      } catch {
        if (isDisposed) {
          return;
        }

        setStorage(createDefaultAppStorage());
        isLoadedRef.current = true;
        reportStorageFailure("load");
      }
    }

    void loadStorage();

    return () => {
      isDisposed = true;
    };
  }, [adapter, reportStorageFailure]);

  useEffect(() => {
    if (!isLoadedRef.current) {
      return;
    }

    const serializedStorage = serializeAppStorage(storage);

    if (serializedStorage === lastSerializedStorageRef.current) {
      return;
    }

    let isDisposed = false;

    async function saveStorage() {
      try {
        await adapter.setItem(appStorageKey, serializedStorage);

        if (!isDisposed) {
          lastSerializedStorageRef.current = serializedStorage;
        }
      } catch {
        if (!isDisposed) {
          reportStorageFailure("save");
        }
      }
    }

    void saveStorage();

    return () => {
      isDisposed = true;
    };
  }, [adapter, reportStorageFailure, storage]);

  return {
    storage,
    setStorage,
    storageWarning,
  };
}
