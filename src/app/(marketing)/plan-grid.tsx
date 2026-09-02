"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import {
  billingCycles,
  DEFAULT_CYCLE,
  getCycle,
  termMrp,
  termTotal,
  type BillingCycleId,
  type Plan,
} from "@/lib/catalog";
import { cn, inr, inrNumber, percentOff } from "@/lib/utils";

/**
 * The live homepage's pricing layout — term switcher, one card per plan,
 * features listed inside the card — rendered in this preview's flatter
 * language: light surfaces throughout, a brand tint instead of the dark
 * cockpit card, and no saffron (this page's accents are violet and green).
 */

/**
 * Preview-only copy, kept out of the catalog until the direction is signed
 * off. ON MERGE: fold these into `tagline` plus a new `subtagline` field.
 */
const planCopy: Record<string, { tagline: string; sub?: string }> = {
  "shared-gopro": {
    tagline: "No artificial limits. Just more room to grow.",
    sub: "LiteSpeed + DDoS protection included.",
  },
};

/* ------------------------------------------------------------------ */
/* Term switcher                                                       */
/* ------------------------------------------------------------------ */

function TermSwitcher({
  value,
  onChange,
}: {
  value: BillingCycleId;
  onChange: (v: BillingCycleId) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Billing term"
      className="inline-flex flex-wrap gap-1 rounded-[11px] border border-line bg-surface-2 p-1"
    >
      {billingCycles.map((cycle) => {
        const active = cycle.id === value;

        return (
          <button
            key={cycle.id}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(cycle.id)}
            className={cn(
              "rounded-[8px] px-3.5 py-2 text-[13px] font-semibold transition-colors duration-200",
              active
                ? "bg-surface text-content shadow-[0_1px_2px_rgba(20,20,31,0.10)]"
                : "text-content-muted hover:text-content",
            )}
          >
            {cycle.shortLabel}
            {cycle.note && (
              <span
                className={cn(
                  "ml-2 rounded-full px-1.5 py-0.5 font-mono text-[10px] tracking-wide uppercase",
                  active
                    ? "bg-brand-600 text-white"
                    : "bg-brand-500/10 text-brand-600",
                )}
              >
                {cycle.note}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Plan card                                                           */
/* ------------------------------------------------------------------ */

function PlanCard({ plan, cycle }: { plan: Plan; cycle: BillingCycleId }) {
  const copy = planCopy[plan.id];
  const price = plan.prices[cycle];
  const total = termTotal(plan, cycle);
  const mrpTotal = termMrp(plan, cycle);
  const off = percentOff(price.mrpMonthly, price.monthly);
  const months = getCycle(cycle).months;

  return (
    <div
      className={cn(
        "flex flex-col rounded-[12px] border p-6",
        plan.featured
          ? "border-brand-200 border-t-2 border-t-brand-300 bg-brand-50/45"
          : "border-line bg-surface",
      )}
    >
      {/* Reserved whether or not it is filled, so every name sits on one line. */}
      <span className="block h-4 font-mono text-[10.5px] font-bold tracking-[0.12em] text-brand-600 uppercase">
        {plan.featured ? "Most popular" : ""}
      </span>

      <h3 className="mt-2 text-[19px] font-bold text-content">{plan.name}</h3>

      {/*
        Same trick the live PlanGrid uses: a floor under the description so
        the price line lands at the same height in every card.
      */}
      <div className="mt-1.5 min-h-[76px]">
        <p className="text-[13.5px] leading-snug text-content-muted">
          {copy?.tagline ?? plan.tagline}
        </p>
        {copy?.sub && (
          <p className="mt-1.5 text-[12.5px] leading-snug text-content-subtle">
            {copy.sub}
          </p>
        )}
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-1.5">
        <span className="font-mono text-[32px] leading-none font-extrabold text-content tnum">
          ₹{inrNumber(price.monthly)}
        </span>
        <span className="text-[12.5px] text-content-subtle">/mo</span>
        {off > 0 && (
          <span className="ml-auto rounded-[6px] bg-signal-ok/12 px-2 py-1 font-mono text-[11px] font-bold text-signal-ok">
            {off}% off
          </span>
        )}
      </div>

      <p className="mt-2.5 text-[12.5px] leading-relaxed text-content-muted tnum">
        {off > 0 && (
          <span className="text-content-subtle line-through">
            ₹{inrNumber(mrpTotal)}
          </span>
        )}{" "}
        {inr(total)} billed for {months} month{months > 1 ? "s" : ""}
        <br />
        <span className="text-content-subtle">
          renews at ₹{inrNumber(price.mrpMonthly)}/mo
        </span>
      </p>

      <ButtonLink
        href={`/checkout?plan=${plan.id}&term=${cycle}`}
        variant={plan.featured ? "brand" : "outline"}
        size="md"
        block
        className="mt-5"
      >
        Choose {plan.name}
      </ButtonLink>

      {/* Features — the card's job, now that there is no comparison grid. */}
      <ul className="mt-6 space-y-2.5 border-t border-line pt-6">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-2.5 text-[13.5px]">
            <Check
              aria-hidden
              className="mt-0.5 size-4 shrink-0 text-signal-ok"
            />
            <span className="text-content-muted">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Grid                                                                */
/* ------------------------------------------------------------------ */

export function PreviewPlanGrid({ plans }: { plans: Plan[] }) {
  const [cycle, setCycle] = useState<BillingCycleId>(DEFAULT_CYCLE);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <TermSwitcher value={cycle} onChange={setCycle} />
        <p className="font-mono text-[10.5px] font-bold tracking-[0.12em] text-content-subtle uppercase">
          Prices exclude GST
        </p>
      </div>

      {/* Stretched, not `items-start`: ragged card bottoms read as a bug. */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} cycle={cycle} />
        ))}
      </div>
    </div>
  );
}
