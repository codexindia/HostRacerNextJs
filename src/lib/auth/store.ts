"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "./mock-api";

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  /** False until the persisted session has been read back from storage. */
  hydrated: boolean;
  setSession: (user: AuthUser, token: string) => void;
  signOut: () => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      hydrated: false,
      setSession: (user, token) => set({ user, token }),
      signOut: () => set({ user: null, token: null }),
    }),
    {
      name: "hostracer.session",
      // `hydrated` is runtime-only state — never write it to storage.
      partialize: (s) => ({ user: s.user, token: s.token }),
      onRehydrateStorage: () => () => {
        useAuth.setState({ hydrated: true });
      },
    },
  ),
);

// If rehydration finished before this module subscribed, catch up.
if (typeof window !== "undefined" && useAuth.persist.hasHydrated()) {
  useAuth.setState({ hydrated: true });
}
