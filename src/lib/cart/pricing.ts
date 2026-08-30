/**
 * Cart types and the pricing engine.
 *
 * Every rupee shown anywhere in checkout comes out of `cartTotals`. It is
 * deliberately pure and dependency-free so the backend can mirror it exactly —
 * if the server and the client ever disagree on a total, this is the file to
 * diff against.
 */

import {
  addons,
  findPromo,
  getCycle,
  getPlan,
  getTld,
  GST_RATE,
  termMrp,
  termTotal,
  type BillingCycleId,
  type Promo,
} from "@/lib/catalog";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type DomainChoice =
  /** Register a new domain with us — free on qualifying terms. */
  | { mode: "register"; sld: string; tld: string }
  /** Point an existing domain here; nothing to charge. */
  | { mode: "own"; domain: string }
  /** Skip for now, decide inside the dashboard. */
  | { mode: "later" };

export type PlanItem = {
  uid: string;
  kind: "plan";
  planId: string;
  cycle: BillingCycleId;
  domain: DomainChoice;
  addonIds: string[];
};

export type DomainItem = {
  uid: string;
  kind: "domain";
  sld: string;
  tld: string;
  years: number;
};

export type CartItem = PlanItem | DomainItem;

export type SubLine = {
  label: string;
  amount: number;
  free?: boolean;
  /** What it would have cost — shown struck through next to a free line. */
  strike?: number;
};

export type LineItem = {
  uid: string;
  title: string;
  meta: string;
  amount: number;
  /** List price for the same term, when it is higher than `amount`. */
  strike?: number;
  subLines: SubLine[];
  /** amount + every sub-line */
  lineTotal: number;
};

export type CartTotals = {
  lines: LineItem[];
  /** Sum of every line before discounts and tax. */
  subtotal: number;
  /** What the same basket costs at list price — powers "you save X". */
  listTotal: number;
  promo?: Promo;
  /** Set when a code was entered but does not apply. */
  promoError?: string;
  discount: number;
  taxable: number;
  gst: number;
  total: number;
  /** List-price saving plus any promo discount. */
  savings: number;
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Domains bill in whole years; a monthly plan still buys one year. */
export function yearsForCycle(cycle: BillingCycleId): number {
  return Math.max(1, Math.round(getCycle(cycle).months / 12));
}

/** Add-ons are quoted per year but charged pro-rata to the plan term. */
export function addonTotal(pricePerYear: number, cycle: BillingCycleId): number {
  return Math.round((pricePerYear / 12) * getCycle(cycle).months);
}

/** A free domain needs a qualifying plan, a 12-month-plus term, and a new registration. */
export function domainIsFree(
  planFreeDomain: boolean,
  cycle: BillingCycleId,
  domain: DomainChoice,
): boolean {
  return (
    planFreeDomain && getCycle(cycle).months >= 12 && domain.mode === "register"
  );
}

export function domainLabel(domain: DomainChoice): string | null {
  if (domain.mode === "register") return `${domain.sld}${domain.tld}`;
  if (domain.mode === "own") return domain.domain;
  return null;
}

/* ------------------------------------------------------------------ */
/* Per-item pricing                                                    */
/* ------------------------------------------------------------------ */

export function priceItem(item: CartItem): LineItem | null {
  if (item.kind === "domain") {
    const tld = getTld(item.tld);
    if (!tld) return null;

    const amount = tld.register * item.years;
    return {
      uid: item.uid,
      title: `${item.sld}${item.tld}`,
      meta: `Domain registration · ${item.years} year${item.years > 1 ? "s" : ""}`,
      amount,
      subLines: [],
      lineTotal: amount,
    };
  }

  const plan = getPlan(item.planId);
  if (!plan) return null;

  const cycle = getCycle(item.cycle);
  const amount = termTotal(plan, item.cycle);
  const list = termMrp(plan, item.cycle);
  const subLines: SubLine[] = [];

  /* Domain */
  if (item.domain.mode === "register") {
    const tld = getTld(item.domain.tld);
    const years = yearsForCycle(item.cycle);
    const label = `${item.domain.sld}${item.domain.tld}`;

    if (domainIsFree(plan.freeDomain, item.cycle, item.domain)) {
      subLines.push({
        label: `${label} — first year`,
        amount: 0,
        free: true,
        strike: tld?.register,
      });
    } else if (tld) {
      subLines.push({
        label: `${label} — ${years} year${years > 1 ? "s" : ""}`,
        amount: tld.register * years,
      });
    }
  }

  /* Add-ons */
  for (const addonId of item.addonIds) {
    const addon = addons.find((a) => a.id === addonId);
    if (!addon) continue;
    const total = addonTotal(addon.pricePerYear, item.cycle);
    subLines.push({
      label: addon.name,
      amount: total,
      free: total === 0,
    });
  }

  return {
    uid: item.uid,
    title: `${plan.name} hosting`,
    meta: `${cycle.label} term`,
    amount,
    strike: list > amount ? list : undefined,
    subLines,
    lineTotal: amount + subLines.reduce((sum, s) => sum + s.amount, 0),
  };
}

/* ------------------------------------------------------------------ */
/* Basket totals                                                       */
/* ------------------------------------------------------------------ */

export function cartTotals(
  items: CartItem[],
  promoCode?: string | null,
): CartTotals {
  const lines = items
    .map(priceItem)
    .filter((line): line is LineItem => line !== null);

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);

  const listTotal = lines.reduce(
    (sum, l) =>
      sum +
      (l.strike ?? l.amount) +
      l.subLines.reduce((s, sl) => s + (sl.strike ?? sl.amount), 0),
    0,
  );

  /* Promo */
  let promo: Promo | undefined;
  let promoError: string | undefined;
  let discount = 0;

  if (promoCode?.trim()) {
    const found = findPromo(promoCode);
    if (!found) {
      promoError = "That code isn't valid.";
    } else if (found.minSubtotal && subtotal < found.minSubtotal) {
      promoError = `Spend ₹${found.minSubtotal.toLocaleString("en-IN")} to use this code.`;
    } else {
      promo = found;
      discount = Math.round((subtotal * found.percent) / 100);
    }
  }

  const taxable = Math.max(0, subtotal - discount);
  const gst = Math.round(taxable * GST_RATE);
  const total = taxable + gst;

  return {
    lines,
    subtotal,
    listTotal,
    promo,
    promoError,
    discount,
    taxable,
    gst,
    total,
    savings: Math.max(0, listTotal - subtotal) + discount,
  };
}

/* ------------------------------------------------------------------ */
/* Order reference                                                     */
/* ------------------------------------------------------------------ */

/** HR-7K2M91 — short, unambiguous, easy to read out over the phone. */
export function makeOrderRef(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `HR-${out}`;
}
