"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronLeft, ShoppingCart } from "lucide-react";
import { OrderSummary } from "@/components/checkout/order-summary";
import { StepAccount } from "@/components/checkout/step-account";
import { StepConfigure } from "@/components/checkout/step-configure";
import { StepPayment } from "@/components/checkout/step-payment";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/primitives";
import { useAuth } from "@/lib/auth/store";
import { useCart } from "@/lib/cart/store";
import { useHydrated } from "@/lib/use-hydrated";
import { useLastOrder } from "@/lib/cart/order-store";
import {
  cartTotals,
  domainLabel,
  makeOrderRef,
  type PlanItem,
} from "@/lib/cart/pricing";
import {
  billingCycles,
  getPlan,
  DEFAULT_CYCLE,
  type BillingCycleId,
} from "@/lib/catalog";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "configure", label: "Configure" },
  { id: "account", label: "Account" },
  { id: "payment", label: "Payment" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

const isCycle = (v: string | null): v is BillingCycleId =>
  billingCycles.some((c) => c.id === v);

export function CheckoutClient() {
  const router = useRouter();
  const params = useSearchParams();

  const { items, promoCode, addPlan, setCycle, setDomain, toggleAddon, clear } =
    useCart();
  const hydrated = useHydrated(useCart);
  const user = useAuth((s) => s.user);
  const placeOrder = useLastOrder((s) => s.place);

  const [step, setStep] = useState<StepId>("configure");
  const seeded = useRef(false);

  /* Seed the basket from ?plan= the first time we have storage back. */
  useEffect(() => {
    if (!hydrated || seeded.current) return;
    seeded.current = true;

    const planId = params.get("plan");
    const term = params.get("term");
    if (planId && getPlan(planId)) {
      addPlan({
        planId,
        cycle: isCycle(term) ? term : DEFAULT_CYCLE,
      });
    }
  }, [hydrated, params, addPlan]);

  const totals = useMemo(
    () => cartTotals(items, promoCode),
    [items, promoCode],
  );

  const planItem = items.find((i): i is PlanItem => i.kind === "plan");
  const plan = planItem ? getPlan(planItem.planId) : undefined;

  /* ---------------- Empty basket ---------------- */

  if (hydrated && items.length === 0) {
    return (
      <Container className="py-20">
        <div className="mx-auto max-w-md text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-[15px] border border-line bg-surface text-content-subtle">
            <ShoppingCart className="size-6" />
          </span>
          <h1 className="mt-6 text-[24px] font-bold text-content">
            Your basket is empty
          </h1>
          <p className="mt-2.5 text-[14.5px] leading-relaxed text-content-muted">
            Pick a hosting plan and we&rsquo;ll bring you straight back here to
            finish the order.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/pricing" variant="accent" size="md">
              Browse hosting plans
            </ButtonLink>
            <ButtonLink href="/domains" variant="outline" size="md">
              Search a domain
            </ButtonLink>
          </div>
        </div>
      </Container>
    );
  }

  if (!hydrated) {
    return (
      <Container className="py-20">
        <div className="grid place-items-center py-20">
          <div className="size-8 animate-spin rounded-full border-2 border-line-strong border-t-brand-500" />
        </div>
      </Container>
    );
  }

  /* ---------------- Place order ---------------- */

  function handlePaid(details: {
    method: Parameters<typeof placeOrder>[0]["method"];
  }) {
    const ref = makeOrderRef();

    placeOrder({
      ref,
      placedAt: new Date().toISOString(),
      email: user?.email ?? "",
      fullName: user?.fullName ?? "",
      method: details.method,
      lines: totals.lines.map((l) => ({
        title: l.title,
        meta: l.meta,
        amount: l.lineTotal,
      })),
      subtotal: totals.subtotal,
      discount: totals.discount,
      promoCode: totals.promo?.code,
      gst: totals.gst,
      total: totals.total,
      domain: planItem ? domainLabel(planItem.domain) : null,
    });

    clear();
    router.push(`/checkout/success?ref=${ref}`);
  }

  const activeIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <Container className="py-8 lg:py-12">
      {/* Stepper */}
      <ol className="mx-auto mb-9 flex max-w-2xl items-center">
        {STEPS.map((s, i) => {
          const done = i < activeIndex;
          const active = i === activeIndex;

          return (
            <li key={s.id} className="flex flex-1 items-center last:flex-none">
              <button
                type="button"
                disabled={i > activeIndex}
                onClick={() => i < activeIndex && setStep(s.id)}
                className={cn(
                  "flex items-center gap-2.5",
                  i < activeIndex && "cursor-pointer",
                )}
              >
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full font-mono text-[13px] font-bold transition-colors",
                    done && "bg-signal-ok text-white",
                    active && "bg-ink-950 text-white dark:bg-white dark:text-ink-950",
                    !done && !active && "border border-line-strong text-content-subtle",
                  )}
                >
                  {done ? <Check className="size-4" strokeWidth={3} /> : i + 1}
                </span>
                <span
                  className={cn(
                    "hidden text-[13.5px] font-semibold sm:block",
                    active ? "text-content" : "text-content-subtle",
                  )}
                >
                  {s.label}
                </span>
              </button>

              {i < STEPS.length - 1 && (
                <span
                  aria-hidden
                  className={cn(
                    "mx-3 h-px flex-1 transition-colors",
                    done ? "bg-signal-ok" : "bg-line-strong",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
        {/* Steps */}
        <div>
          {activeIndex > 0 && (
            <button
              type="button"
              onClick={() => setStep(STEPS[activeIndex - 1].id)}
              className="mb-6 flex items-center gap-1.5 text-[13.5px] font-medium text-content-muted transition-colors hover:text-content"
            >
              <ChevronLeft className="size-4" />
              Back to {STEPS[activeIndex - 1].label.toLowerCase()}
            </button>
          )}

          {step === "configure" && planItem && plan && (
            <StepConfigure
              item={planItem}
              plan={plan}
              onCycleChange={(c) => setCycle(planItem.uid, c)}
              onDomainChange={(d) => setDomain(planItem.uid, d)}
              onToggleAddon={(a) => toggleAddon(planItem.uid, a)}
              onContinue={() => setStep("account")}
            />
          )}

          {/* A domain-only basket has nothing to configure. */}
          {step === "configure" && !planItem && (
            <div>
              <h2 className="text-[19px] font-bold text-content">
                Review your basket
              </h2>
              <p className="mt-1.5 text-[13.5px] text-content-muted">
                Everything looks ready. Continue to sign in and pay.
              </p>
              <ButtonLink
                href="#"
                variant="accent"
                size="lg"
                block
                className="mt-6"
                onClick={(e) => {
                  e.preventDefault();
                  setStep("account");
                }}
              >
                Continue to account
              </ButtonLink>
            </div>
          )}

          {step === "account" && (
            <StepAccount onContinue={() => setStep("payment")} />
          )}

          {step === "payment" && (
            <StepPayment total={totals.total} onPaid={handlePaid} />
          )}
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <OrderSummary totals={totals} editable={step !== "payment"} />
        </aside>
      </div>
    </Container>
  );
}
