"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BillingCycleId } from "@/lib/catalog";
import type { CartItem, DomainChoice, PlanItem } from "./pricing";

let seq = 0;
/** Ids only need to be unique within one basket, not globally. */
const uid = () => `ci_${Date.now().toString(36)}${(seq++).toString(36)}`;

type CartState = {
  items: CartItem[];
  promoCode: string | null;

  addPlan: (input: {
    planId: string;
    cycle: BillingCycleId;
    domain?: DomainChoice;
    addonIds?: string[];
  }) => string;
  addDomain: (input: { sld: string; tld: string; years?: number }) => string;

  remove: (uid: string) => void;
  clear: () => void;

  setCycle: (uid: string, cycle: BillingCycleId) => void;
  setDomain: (uid: string, domain: DomainChoice) => void;
  toggleAddon: (uid: string, addonId: string) => void;

  setPromoCode: (code: string | null) => void;
};

const isPlan = (item: CartItem): item is PlanItem => item.kind === "plan";

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,

      addPlan: ({ planId, cycle, domain, addonIds }) => {
        // One hosting plan per basket keeps checkout to a single decision;
        // re-adding the same plan reconfigures the existing line instead.
        const existing = get().items.find(
          (i) => isPlan(i) && i.planId === planId,
        );

        if (existing) {
          set((s) => ({
            items: s.items.map((i) =>
              i.uid === existing.uid && isPlan(i)
                ? { ...i, cycle, domain: domain ?? i.domain }
                : i,
            ),
          }));
          return existing.uid;
        }

        const item: PlanItem = {
          uid: uid(),
          kind: "plan",
          planId,
          cycle,
          domain: domain ?? { mode: "later" },
          addonIds: addonIds ?? [],
        };
        set((s) => ({ items: [...s.items, item] }));
        return item.uid;
      },

      addDomain: ({ sld, tld, years = 1 }) => {
        const existing = get().items.find(
          (i) => i.kind === "domain" && i.sld === sld && i.tld === tld,
        );
        if (existing) return existing.uid;

        const item: CartItem = {
          uid: uid(),
          kind: "domain",
          sld,
          tld,
          years,
        };
        set((s) => ({ items: [...s.items, item] }));
        return item.uid;
      },

      remove: (target) =>
        set((s) => ({ items: s.items.filter((i) => i.uid !== target) })),

      clear: () => set({ items: [], promoCode: null }),

      setCycle: (target, cycle) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.uid === target && isPlan(i) ? { ...i, cycle } : i,
          ),
        })),

      setDomain: (target, domain) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.uid === target && isPlan(i) ? { ...i, domain } : i,
          ),
        })),

      toggleAddon: (target, addonId) =>
        set((s) => ({
          items: s.items.map((i) => {
            if (i.uid !== target || !isPlan(i)) return i;
            const has = i.addonIds.includes(addonId);
            return {
              ...i,
              addonIds: has
                ? i.addonIds.filter((a) => a !== addonId)
                : [...i.addonIds, addonId],
            };
          }),
        })),

      setPromoCode: (code) => set({ promoCode: code }),
    }),
    {
      name: "hostracer.cart",
      partialize: (s) => ({ items: s.items, promoCode: s.promoCode }),
    },
  ),
);

/** Total number of billable lines, for the header badge. */
export const selectCount = (s: CartState) => s.items.length;
