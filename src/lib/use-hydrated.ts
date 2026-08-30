"use client";

import { useSyncExternalStore } from "react";

type PersistApi = {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (cb: () => void) => () => void;
  };
};

/**
 * Whether a persisted zustand store has finished reading its storage.
 *
 * Reads `hasHydrated()` directly rather than mirroring it into a state flag.
 * An earlier version set that flag from inside `onRehydrateStorage`, which is
 * ordering-sensitive — if the callback fired before the store binding was
 * initialised the flag stuck at false and the UI span forever on a spinner.
 * `useSyncExternalStore` can't get stuck: it always reports the live value and
 * returns `false` on the server so SSR and first paint agree.
 */
export function useHydrated(store: PersistApi): boolean {
  return useSyncExternalStore(
    (onChange) => store.persist.onFinishHydration(onChange),
    () => store.persist.hasHydrated(),
    () => false,
  );
}
