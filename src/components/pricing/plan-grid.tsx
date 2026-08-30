"use client";

import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/primitives";
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
    <div className="flex justify-center">
      <div
        role="radiogroup"
        aria-label="Billing term"
        className="inline-flex flex-wrap justify-center gap-1 rounded-[13px] border border-line bg-surface-2 p-1.5"
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
                "relative rounded-[9px] px-4 py-2 text-[13.5px] font-semibold transition-all duration-200",
                active
                  ? "bg-surface text-content shadow-[0_1px_3px_rgba(20,20,31,0.12)]"
                  : "text-content-muted hover:text-content",
              )}
            >
              {cycle.shortLabel}
              {cycle.note && (
                <span
                  className={cn(
                    "ml-2 rounded-full px-1.5 py-0.5 font-mono text-[10px] tracking-wide uppercase",
                    active
                      ? "bg-flag-400 text-ink-950"
                      : "bg-flag-400/15 text-flag-600 dark:text-flag-300",
                  )}
                >
                  {cycle.note}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Plan card                                                           */
/* ------------------------------------------------------------------ */

function PlanCard({ plan, cycle }: { plan: Plan; cycle: BillingCycleId }) {
  const price = plan.prices[cycle];
  const total = termTotal(plan, cycle);
  const mrpTotal = termMrp(plan, cycle);
  const off = percentOff(price.mrpMonthly, price.monthly);
  const months = getCycle(cycle).months;
  const dark = Boolean(plan.featured);

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-[16px] border p-6 transition-[transform,box-shadow] duration-300",
        dark
          ? "border-ink-800 bg-ink-950 text-white shadow-[0_24px_60px_-28px_rgba(20,20,31,0.7)] lg:-my-3 lg:pt-9 lg:pb-9"
          : "border-line bg-surface hover:shadow-[0_18px_40px_-24px_rgba(20,20,31,0.3)]",
      )}
    >
      {dark && (
        <div
          aria-hidden
          className="cockpit-hatch pointer-events-none absolute inset-0 rounded-[16px]"
        />
      )}

      {plan.badge && (
        <span className="absolute -top-3 left-6">
          <Badge variant="flag" size="md" className="shadow-sm">
            <Sparkles className="size-3" />
            {plan.badge}
          </Badge>
        </span>
      )}

      <div className="relative">
        <h3
          className={cn(
            "text-[19px] font-bold",
            dark ? "text-white" : "text-content",
          )}
        >
          {plan.name}
        </h3>
        <p
          className={cn(
            "mt-1.5 min-h-[40px] text-[13.5px] leading-snug",
            dark ? "text-white/55" : "text-content-muted",
          )}
        >
          {plan.tagline}
        </p>

        {/* Price block */}
        <div className="mt-5">
          <div className="flex items-end gap-2">
            <span
              className={cn(
                "font-mono text-[40px] leading-none font-bold tracking-tight tnum",
                dark ? "text-white" : "text-content",
              )}
            >
              ₹{inrNumber(price.monthly)}
            </span>
            <span
              className={cn(
                "pb-1.5 text-[14px] font-medium",
                dark ? "text-white/45" : "text-content-subtle",
              )}
            >
              /mo
            </span>
            {off > 0 && (
              <span className="mb-1.5 ml-auto rounded-[6px] bg-signal-ok/12 px-2 py-1 font-mono text-[11.5px] font-bold text-signal-ok">
                {off}% OFF
              </span>
            )}
          </div>

          <p
            className={cn(
              "mt-2.5 text-[12.5px] tnum",
              dark ? "text-white/45" : "text-content-subtle",
            )}
          >
            {off > 0 && (
              <span className="line-through">₹{inrNumber(mrpTotal)}</span>
            )}{" "}
            <span className={dark ? "text-white/70" : "text-content-muted"}>
              {inr(total)} billed for {months} month{months > 1 ? "s" : ""}
            </span>
          </p>
        </div>

        <ButtonLink
          href={`/checkout?plan=${plan.id}&term=${cycle}`}
          variant={dark ? "accent" : "outline"}
          size="md"
          block
          className="mt-5"
        >
          Choose {plan.name}
        </ButtonLink>

        <p
          className={cn(
            "mt-3 text-center text-[11.5px]",
            dark ? "text-white/40" : "text-content-subtle",
          )}
        >
          {months >= 12 && plan.freeDomain
            ? "Free domain included · 7-day refund"
            : "7-day money-back guarantee"}
        </p>

        {/* Features */}
        <ul
          className={cn(
            "mt-6 space-y-2.5 border-t pt-6",
            dark ? "border-white/10" : "border-line",
          )}
        >
          {plan.features.map((feature) => (
            <li key={feature} className="flex gap-2.5 text-[13.5px]">
              <Check
                aria-hidden
                className={cn(
                  "mt-0.5 size-4 shrink-0",
                  dark ? "text-flag-400" : "text-brand-600 dark:text-brand-400",
                )}
              />
              <span className={dark ? "text-white/75" : "text-content-muted"}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Grid                                                                */
/* ------------------------------------------------------------------ */

export function PlanGrid({
  plans,
  defaultCycle = DEFAULT_CYCLE,
  columns = 4,
}: {
  plans: Plan[];
  defaultCycle?: BillingCycleId;
  columns?: 3 | 4;
}) {
  const [cycle, setCycle] = useState<BillingCycleId>(defaultCycle);

  return (
    <div>
      <TermSwitcher value={cycle} onChange={setCycle} />

      <div
        className={cn(
          "mt-9 grid gap-5 sm:grid-cols-2",
          columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
        )}
      >
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} cycle={cycle} />
        ))}
      </div>

      <p className="mt-7 text-center text-[13px] text-content-subtle">
        Prices exclude 18% GST. Renewals are billed at the same rate you signed
        up on —{" "}
        <span className="font-semibold text-content-muted">guaranteed.</span>
      </p>
    </div>
  );
}
