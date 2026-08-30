"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CalendarClock,
  Check,
  CircleSlash,
  DatabaseBackup,
  Globe,
  Loader2,
  Mail,
  ShieldCheck,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/primitives";
import {
  addons as allAddons,
  billingCycles,
  getCycle,
  termTotal,
  tlds,
  type BillingCycleId,
  type Plan,
} from "@/lib/catalog";
import {
  addonTotal,
  domainIsFree,
  yearsForCycle,
  type DomainChoice,
  type PlanItem,
} from "@/lib/cart/pricing";
import { checkDomain, normaliseSld, type DomainCheck } from "@/lib/domains/mock-api";
import { cn, inr, inrNumber, percentOff } from "@/lib/utils";

const addonIcons: Record<string, LucideIcon> = {
  ShieldCheck,
  DatabaseBackup,
  Mail,
  TrendingUp,
};

export function StepConfigure({
  item,
  plan,
  onCycleChange,
  onDomainChange,
  onToggleAddon,
  onContinue,
}: {
  item: PlanItem;
  plan: Plan;
  onCycleChange: (cycle: BillingCycleId) => void;
  onDomainChange: (domain: DomainChoice) => void;
  onToggleAddon: (addonId: string) => void;
  onContinue: () => void;
}) {
  return (
    <div className="space-y-8">
      <TermPicker plan={plan} value={item.cycle} onChange={onCycleChange} />

      <DomainPicker
        plan={plan}
        cycle={item.cycle}
        value={item.domain}
        onChange={onDomainChange}
      />

      <AddonPicker
        cycle={item.cycle}
        selected={item.addonIds}
        onToggle={onToggleAddon}
      />

      <Button variant="accent" size="lg" block onClick={onContinue}>
        Continue to account
        <ArrowRight />
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Billing term                                                        */
/* ------------------------------------------------------------------ */

function TermPicker({
  plan,
  value,
  onChange,
}: {
  plan: Plan;
  value: BillingCycleId;
  onChange: (c: BillingCycleId) => void;
}) {
  return (
    <section>
      <SectionTitle
        step={1}
        title="Choose your billing term"
        blurb="Longer terms lock in a lower monthly rate — and your renewal price never changes."
      />

      <div
        role="radiogroup"
        aria-label="Billing term"
        className="mt-5 space-y-2.5"
      >
        {billingCycles.map((cycle) => {
          const price = plan.prices[cycle.id];
          const off = percentOff(price.mrpMonthly, price.monthly);
          const total = termTotal(plan, cycle.id);
          const active = cycle.id === value;
          const freeDomain = cycle.months >= 12 && plan.freeDomain;

          return (
            <button
              key={cycle.id}
              role="radio"
              aria-checked={active}
              onClick={() => onChange(cycle.id)}
              className={cn(
                "flex w-full items-center gap-4 rounded-[13px] border p-4 text-left transition-all duration-200",
                active
                  ? "border-brand-500 bg-brand-50/60 ring-4 ring-brand-500/12 dark:bg-brand-500/8"
                  : "border-line-strong bg-surface hover:border-ink-400",
              )}
            >
              <Radio checked={active} />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[15px] font-bold text-content">
                    {cycle.label}
                  </span>
                  {off > 0 && (
                    <Badge variant="ok" size="sm">
                      Save {off}%
                    </Badge>
                  )}
                  {freeDomain && (
                    <Badge variant="flag" size="sm">
                      Free domain
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-[12.5px] text-content-subtle tnum">
                  {inr(total)} billed today
                </p>
              </div>

              <div className="shrink-0 text-right">
                {off > 0 && (
                  <p className="font-mono text-[12px] text-content-subtle line-through tnum">
                    ₹{inrNumber(price.mrpMonthly)}
                  </p>
                )}
                <p className="font-mono text-[19px] font-bold text-content tnum">
                  ₹{inrNumber(price.monthly)}
                  <span className="text-[12px] font-normal text-content-subtle">
                    /mo
                  </span>
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Domain                                                              */
/* ------------------------------------------------------------------ */

function DomainPicker({
  plan,
  cycle,
  value,
  onChange,
}: {
  plan: Plan;
  cycle: BillingCycleId;
  value: DomainChoice;
  onChange: (d: DomainChoice) => void;
}) {
  const [sld, setSld] = useState(
    value.mode === "register" ? value.sld : "",
  );
  const [tld, setTld] = useState(
    value.mode === "register" ? value.tld : ".in",
  );
  const [own, setOwn] = useState(value.mode === "own" ? value.domain : "");
  const [check, setCheck] = useState<DomainCheck | null>(null);

  const cleanSld = normaliseSld(sld);
  const shouldCheck = value.mode === "register" && cleanSld.length >= 3;

  // A stored result only means anything for the exact name it was fetched
  // for, so both "no result yet" and "still checking" fall out of the data
  // rather than needing their own state.
  const result =
    shouldCheck && check?.sld === cleanSld && check.tld === tld ? check : null;
  const checking = shouldCheck && !result;

  const years = yearsForCycle(cycle);
  const isFree = domainIsFree(plan.freeDomain, cycle, {
    mode: "register",
    sld: "x",
    tld,
  });
  const tldInfo = tlds.find((t) => t.tld === tld);

  // Debounced availability lookup, re-run whenever the name or TLD settles.
  useEffect(() => {
    if (!shouldCheck) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      const next = await checkDomain(cleanSld, tld);
      if (cancelled) return;
      setCheck(next);
      if (next.status === "available") {
        onChange({ mode: "register", sld: next.sld, tld: next.tld });
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // `onChange` is a fresh closure each render; including it would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldCheck, cleanSld, tld]);

  const options = [
    {
      mode: "register" as const,
      Icon: Globe,
      title: "Register a new domain",
      blurb: isFree
        ? "Included free for the first year with this term."
        : "Add a new domain to this order.",
      badge: isFree ? "Free" : undefined,
    },
    {
      mode: "own" as const,
      Icon: Check,
      title: "I already own a domain",
      blurb: "Point your existing domain here — we'll help you update the DNS.",
    },
    {
      mode: "later" as const,
      Icon: CalendarClock,
      title: "I'll decide later",
      blurb: "Set up hosting now and add a domain from your dashboard.",
    },
  ];

  return (
    <section>
      <SectionTitle
        step={2}
        title="Add your domain"
        blurb="Every plan works with a domain you register here or one you already own."
      />

      <div role="radiogroup" aria-label="Domain option" className="mt-5 space-y-2.5">
        {options.map((option) => {
          const active = value.mode === option.mode;

          return (
            <div
              key={option.mode}
              className={cn(
                "rounded-[13px] border transition-all duration-200",
                active
                  ? "border-brand-500 bg-brand-50/60 ring-4 ring-brand-500/12 dark:bg-brand-500/8"
                  : "border-line-strong bg-surface hover:border-ink-400",
              )}
            >
              <button
                role="radio"
                aria-checked={active}
                onClick={() =>
                  onChange(
                    option.mode === "register"
                      ? { mode: "register", sld: normaliseSld(sld), tld }
                      : option.mode === "own"
                        ? { mode: "own", domain: own }
                        : { mode: "later" },
                  )
                }
                className="flex w-full items-center gap-4 p-4 text-left"
              >
                <Radio checked={active} />
                <option.Icon
                  aria-hidden
                  className="size-[18px] shrink-0 text-content-subtle"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-[14.5px] font-semibold text-content">
                      {option.title}
                    </span>
                    {option.badge && (
                      <Badge variant="flag" size="sm">
                        {option.badge}
                      </Badge>
                    )}
                  </span>
                  <span className="mt-0.5 block text-[12.5px] text-content-muted">
                    {option.blurb}
                  </span>
                </span>
              </button>

              {/* Register */}
              {active && option.mode === "register" && (
                <div className="border-t border-line-strong/60 p-4">
                  <div className="flex gap-2">
                    <input
                      value={sld}
                      onChange={(e) => setSld(e.target.value)}
                      placeholder="yourbusiness"
                      spellCheck={false}
                      autoComplete="off"
                      aria-label="Domain name"
                      className="h-12 min-w-0 flex-1 rounded-[10px] border border-line-strong bg-surface px-3.5 font-mono text-[14.5px] text-content placeholder:font-sans placeholder:text-content-subtle focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 focus:outline-none"
                    />
                    <select
                      value={tld}
                      onChange={(e) => setTld(e.target.value)}
                      aria-label="Domain extension"
                      className="h-12 shrink-0 rounded-[10px] border border-line-strong bg-surface px-3 font-mono text-[14px] font-semibold text-content focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 focus:outline-none"
                    >
                      {tlds.map((t) => (
                        <option key={t.tld} value={t.tld}>
                          {t.tld}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-2.5 min-h-[20px]">
                    {checking ? (
                      <p className="flex items-center gap-1.5 text-[12.5px] text-content-subtle">
                        <Loader2 className="size-3.5 animate-spin" />
                        Checking availability…
                      </p>
                    ) : result?.status === "available" ? (
                      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] font-medium text-signal-ok">
                        <Check className="size-3.5" />
                        {result.sld}
                        {result.tld} is available
                        <span className="font-mono text-content-subtle">
                          {isFree ? (
                            <>
                              <span className="line-through">
                                {inr(tldInfo?.register ?? 0)}
                              </span>{" "}
                              <span className="font-semibold text-signal-ok">
                                FREE for 1 year
                              </span>
                            </>
                          ) : (
                            `${inr((tldInfo?.register ?? 0) * years)} for ${years} year${years > 1 ? "s" : ""}`
                          )}
                        </span>
                      </p>
                    ) : result ? (
                      <p className="flex items-center gap-1.5 text-[12.5px] font-medium text-signal-down">
                        {result.status === "taken" ? (
                          <CircleSlash className="size-3.5" />
                        ) : (
                          <AlertCircle className="size-3.5" />
                        )}
                        {result.reason}
                      </p>
                    ) : (
                      <p className="text-[12.5px] text-content-subtle">
                        Type at least 3 characters to check availability.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Own domain */}
              {active && option.mode === "own" && (
                <div className="border-t border-line-strong/60 p-4">
                  <input
                    value={own}
                    onChange={(e) => {
                      setOwn(e.target.value);
                      onChange({ mode: "own", domain: e.target.value.trim() });
                    }}
                    placeholder="yourbusiness.in"
                    spellCheck={false}
                    autoComplete="off"
                    aria-label="Your existing domain"
                    className="h-12 w-full rounded-[10px] border border-line-strong bg-surface px-3.5 font-mono text-[14.5px] text-content placeholder:font-sans placeholder:text-content-subtle focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 focus:outline-none"
                  />
                  <p className="mt-2.5 text-[12.5px] text-content-subtle">
                    After checkout we&rsquo;ll send you the nameservers to point
                    it here. Migration help is free.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Add-ons                                                             */
/* ------------------------------------------------------------------ */

function AddonPicker({
  cycle,
  selected,
  onToggle,
}: {
  cycle: BillingCycleId;
  selected: string[];
  onToggle: (id: string) => void;
}) {
  const months = getCycle(cycle).months;

  return (
    <section>
      <SectionTitle
        step={3}
        title="Add extras"
        blurb="Optional. You can add or drop any of these later from your dashboard."
      />

      <div className="mt-5 space-y-2.5">
        {allAddons.map((addon) => {
          const Icon = addonIcons[addon.icon] ?? ShieldCheck;
          const active = selected.includes(addon.id);
          const total = addonTotal(addon.pricePerYear, cycle);

          return (
            <button
              key={addon.id}
              type="button"
              role="checkbox"
              aria-checked={active}
              onClick={() => onToggle(addon.id)}
              className={cn(
                "flex w-full items-start gap-4 rounded-[13px] border p-4 text-left transition-all duration-200",
                active
                  ? "border-brand-500 bg-brand-50/60 ring-4 ring-brand-500/12 dark:bg-brand-500/8"
                  : "border-line-strong bg-surface hover:border-ink-400",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "mt-0.5 grid size-5 shrink-0 place-items-center rounded-[6px] border-2 transition-colors",
                  active
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-line-strong",
                )}
              >
                {active && <Check className="size-3" strokeWidth={3} />}
              </span>

              <Icon
                aria-hidden
                className="mt-0.5 size-[18px] shrink-0 text-content-subtle"
              />

              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-[14.5px] font-semibold text-content">
                    {addon.name}
                  </span>
                  {addon.recommended && (
                    <Badge variant="brand" size="sm">
                      Recommended
                    </Badge>
                  )}
                </span>
                <span className="mt-0.5 block text-[12.5px] text-content-muted">
                  {addon.blurb}
                </span>
              </span>

              <span className="shrink-0 text-right">
                {total === 0 ? (
                  <span className="font-mono text-[14px] font-bold text-signal-ok">
                    FREE
                  </span>
                ) : (
                  <>
                    <span className="block font-mono text-[14.5px] font-semibold text-content tnum">
                      {inr(total)}
                    </span>
                    <span className="block text-[11.5px] text-content-subtle">
                      for {months} mo
                    </span>
                  </>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Bits                                                                */
/* ------------------------------------------------------------------ */

function SectionTitle({
  step,
  title,
  blurb,
}: {
  step: number;
  title: string;
  blurb: string;
}) {
  return (
    <div className="flex gap-3.5">
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink-950 font-mono text-[12.5px] font-bold text-white dark:bg-white dark:text-ink-950">
        {step}
      </span>
      <div>
        <h2 className="text-[17px] leading-tight font-bold text-content">
          {title}
        </h2>
        <p className="mt-1 text-[13.5px] text-content-muted">{blurb}</p>
      </div>
    </div>
  );
}

function Radio({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors",
        checked ? "border-brand-600" : "border-line-strong",
      )}
    >
      {checked && <span className="size-2.5 rounded-full bg-brand-600" />}
    </span>
  );
}
