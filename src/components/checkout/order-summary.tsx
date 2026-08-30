"use client";

import { useState } from "react";
import {
  BadgePercent,
  Check,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/primitives";
import { useCart } from "@/lib/cart/store";
import type { CartTotals } from "@/lib/cart/pricing";
import { GST_RATE } from "@/lib/catalog";
import { site } from "@/config/site.config";
import { cn, inr } from "@/lib/utils";

export function OrderSummary({
  totals,
  editable = true,
  className,
}: {
  totals: CartTotals;
  /** Payment step locks the basket so nothing shifts under the pay button. */
  editable?: boolean;
  className?: string;
}) {
  const remove = useCart((s) => s.remove);

  return (
    <div
      className={cn(
        "rounded-[16px] border border-line bg-surface p-5 sm:p-6",
        className,
      )}
    >
      <h2 className="text-[16px] font-bold text-content">Order summary</h2>

      {/* Lines */}
      <ul className="mt-5 space-y-4">
        {totals.lines.map((line) => (
          <li key={line.uid} className="border-b border-line pb-4 last:border-0 last:pb-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[14.5px] font-semibold text-content">
                  {line.title}
                </p>
                <p className="mt-0.5 text-[12.5px] text-content-subtle">
                  {line.meta}
                </p>
              </div>

              <div className="shrink-0 text-right">
                {line.strike && (
                  <p className="text-[12px] text-content-subtle line-through tnum">
                    {inr(line.strike)}
                  </p>
                )}
                <p className="font-mono text-[14.5px] font-semibold text-content tnum">
                  {inr(line.amount)}
                </p>
              </div>
            </div>

            {line.subLines.length > 0 && (
              <ul className="mt-2.5 space-y-1.5 border-l-2 border-line pl-3">
                {line.subLines.map((sub) => (
                  <li
                    key={sub.label}
                    className="flex items-baseline justify-between gap-3 text-[12.5px]"
                  >
                    <span className="min-w-0 truncate text-content-muted">
                      {sub.label}
                    </span>
                    <span className="shrink-0 font-mono tnum">
                      {sub.free ? (
                        <span className="flex items-center gap-1.5">
                          {sub.strike && (
                            <span className="text-content-subtle line-through">
                              {inr(sub.strike)}
                            </span>
                          )}
                          <span className="font-semibold text-signal-ok">
                            FREE
                          </span>
                        </span>
                      ) : (
                        <span className="text-content-muted">
                          {inr(sub.amount)}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {editable && totals.lines.length > 1 && (
              <button
                type="button"
                onClick={() => remove(line.uid)}
                className="mt-2.5 flex items-center gap-1.5 text-[12px] font-medium text-content-subtle transition-colors hover:text-signal-down"
              >
                <Trash2 className="size-3.5" />
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>

      {editable && <PromoField totals={totals} />}

      {/* Totals */}
      <dl className="mt-5 space-y-2.5 border-t border-line pt-5 text-[13.5px]">
        <div className="flex justify-between">
          <dt className="text-content-muted">Subtotal</dt>
          <dd className="font-mono text-content tnum">{inr(totals.subtotal)}</dd>
        </div>

        {totals.discount > 0 && totals.promo && (
          <div className="flex justify-between">
            <dt className="flex items-center gap-1.5 text-signal-ok">
              <BadgePercent className="size-3.5" />
              {totals.promo.code} ({totals.promo.percent}% off)
            </dt>
            <dd className="font-mono text-signal-ok tnum">
              −{inr(totals.discount)}
            </dd>
          </div>
        )}

        <div className="flex justify-between">
          <dt className="text-content-muted">
            GST ({Math.round(GST_RATE * 100)}%)
          </dt>
          <dd className="font-mono text-content tnum">{inr(totals.gst)}</dd>
        </div>

        <div className="flex items-baseline justify-between border-t border-line pt-3">
          <dt className="text-[15px] font-bold text-content">Total due today</dt>
          <dd className="font-mono text-[22px] font-bold text-content tnum">
            {inr(totals.total)}
          </dd>
        </div>
      </dl>

      {totals.savings > 0 && (
        <p className="mt-3 flex items-center justify-center gap-1.5 rounded-[9px] bg-signal-ok/10 px-3 py-2 text-[12.5px] font-semibold text-signal-ok">
          <Check className="size-3.5" />
          You&rsquo;re saving {inr(totals.savings)} on this order
        </p>
      )}

      {/* Reassurance */}
      <ul className="mt-5 space-y-2 border-t border-line pt-5">
        {[
          {
            Icon: RefreshCw,
            text: `${site.guarantees.refundDays}-day money-back guarantee`,
          },
          { Icon: ShieldCheck, text: "Renews at the same price, guaranteed" },
        ].map(({ Icon, text }) => (
          <li
            key={text}
            className="flex items-center gap-2 text-[12.5px] text-content-muted"
          >
            <Icon className="size-3.5 shrink-0 text-signal-ok" />
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Promo code                                                          */
/* ------------------------------------------------------------------ */

function PromoField({ totals }: { totals: CartTotals }) {
  const { promoCode, setPromoCode } = useCart();
  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState(false);
  const [checking, setChecking] = useState(false);

  async function apply() {
    if (!draft.trim()) return;
    setChecking(true);
    // Stand-in for a server-side code lookup.
    await new Promise((r) => setTimeout(r, 450));
    setPromoCode(draft.trim().toUpperCase());
    setChecking(false);
  }

  if (promoCode && totals.promo) {
    return (
      <div className="mt-5 flex items-center justify-between gap-3 rounded-[10px] border border-signal-ok/25 bg-signal-ok/8 px-3.5 py-2.5">
        <span className="flex min-w-0 items-center gap-2 text-[13px]">
          <Tag className="size-3.5 shrink-0 text-signal-ok" />
          <span className="truncate font-mono font-semibold text-signal-ok">
            {totals.promo.code}
          </span>
          <Badge variant="ok" size="sm">
            −{totals.promo.percent}%
          </Badge>
        </span>
        <button
          type="button"
          onClick={() => {
            setPromoCode(null);
            setDraft("");
          }}
          aria-label="Remove promo code"
          className="shrink-0 text-content-subtle transition-colors hover:text-signal-down"
        >
          <X className="size-4" />
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-5 flex items-center gap-1.5 text-[13px] font-semibold text-brand-600 underline-offset-4 hover:underline dark:text-brand-400"
      >
        <Tag className="size-3.5" />
        Have a promo code?
      </button>
    );
  }

  return (
    <div className="mt-5">
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && apply()}
          placeholder="Enter code"
          autoFocus
          spellCheck={false}
          aria-label="Promo code"
          className="h-11 min-w-0 flex-1 rounded-[10px] border border-line-strong bg-surface px-3.5 font-mono text-[13.5px] tracking-wider text-content uppercase placeholder:font-sans placeholder:tracking-normal placeholder:normal-case placeholder:text-content-subtle focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 focus:outline-none"
        />
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={apply}
          disabled={checking || !draft.trim()}
          className="h-11 shrink-0"
        >
          {checking ? <Loader2 className="animate-spin" /> : "Apply"}
        </Button>
      </div>

      {promoCode && totals.promoError && (
        <p className="mt-2 text-[12.5px] font-medium text-signal-down">
          {totals.promoError}
        </p>
      )}

      <p className="mt-2 text-[11.5px] text-content-subtle">
        Try <code className="font-mono font-semibold">WELCOME</code> for 10% off.
      </p>
    </div>
  );
}
