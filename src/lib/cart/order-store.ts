"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { PaymentMethodId } from "@/lib/constants";

export type PlacedOrder = {
  ref: string;
  placedAt: string;
  email: string;
  fullName: string;
  method: PaymentMethodId;
  lines: { title: string; meta: string; amount: number }[];
  subtotal: number;
  discount: number;
  promoCode?: string;
  gst: number;
  total: number;
  /** Domain attached to the order, if any — drives the next-steps copy. */
  domain?: string | null;
};

type OrderState = {
  order: PlacedOrder | null;
  place: (order: PlacedOrder) => void;
  clear: () => void;
};

/**
 * Holds the receipt between "Pay" and the confirmation screen. Session storage
 * rather than local: a past order shouldn't resurface in a new browser session.
 */
export const useLastOrder = create<OrderState>()(
  persist(
    (set) => ({
      order: null,
      place: (order) => set({ order }),
      clear: () => set({ order: null }),
    }),
    {
      name: "hostracer.last-order",
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? localStorage : sessionStorage,
      ),
      partialize: (s) => ({ order: s.order }),
    },
  ),
);
