"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useDevSettings } from "./dev-settings";
import { useDataStore } from "./store";

/**
 * Rehydrates the persisted stores from localStorage once on the client.
 * Render <StoreHydration /> once near the root.
 */
export function StoreHydration() {
  useEffect(() => {
    void useDevSettings.persist.rehydrate();
    void useDataStore.persist.rehydrate();
  }, []);
  return null;
}

const subscribe = (onChange: () => void) => useDataStore.persist.onFinishHydration(onChange);

/** True once saved demo data has been loaded, so UI doesn't flash the seed first. */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => useDataStore.persist.hasHydrated(),
    () => false,
  );
}
