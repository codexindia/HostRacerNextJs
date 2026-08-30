"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreditCard,
  Landmark,
  Loader2,
  Lock,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { FormAlert } from "@/components/auth/challenge-step";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/primitives";
import {
  INDIAN_STATES,
  PAYMENT_METHODS,
  type PaymentMethodId,
} from "@/lib/constants";
import { billingSchema, type BillingValues } from "@/lib/validation";
import { cn, inr } from "@/lib/utils";

const methodIcons: Record<string, LucideIcon> = {
  Smartphone,
  CreditCard,
  Landmark,
};

export function StepPayment({
  total,
  onPaid,
}: {
  total: number;
  onPaid: (details: BillingValues & { method: PaymentMethodId }) => void;
}) {
  const [method, setMethod] = useState<PaymentMethodId>("upi");
  const [failure, setFailure] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BillingValues>({
    resolver: zodResolver(billingSchema),
    defaultValues: {
      addressLine: "",
      city: "",
      state: "",
      pincode: "",
      gstin: "",
    },
  });

  async function onSubmit(values: BillingValues) {
    setFailure(null);
    setProcessing(true);

    // Stand-in for the payment gateway round trip.
    await new Promise((r) => setTimeout(r, 1600));

    setProcessing(false);
    onPaid({ ...values, method });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      {failure && <FormAlert>{failure}</FormAlert>}

      {/* Billing address */}
      <section>
        <Heading
          title="Billing address"
          blurb="This appears on your GST invoice."
        />

        <div className="mt-5 space-y-4">
          <Field label="Street address" error={errors.addressLine?.message}>
            {({ id, invalid }) => (
              <Input
                id={id}
                placeholder="12/3 MG Road, Sector 4"
                autoComplete="street-address"
                invalid={invalid}
                {...register("addressLine")}
              />
            )}
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="City" error={errors.city?.message}>
              {({ id, invalid }) => (
                <Input
                  id={id}
                  placeholder="Kolkata"
                  autoComplete="address-level2"
                  invalid={invalid}
                  {...register("city")}
                />
              )}
            </Field>

            <Field label="PIN code" error={errors.pincode?.message}>
              {({ id, invalid }) => (
                <Input
                  id={id}
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="700001"
                  autoComplete="postal-code"
                  invalid={invalid}
                  {...register("pincode")}
                />
              )}
            </Field>
          </div>

          <Field label="State" error={errors.state?.message}>
            {({ id, invalid }) => (
              <select
                id={id}
                aria-invalid={invalid || undefined}
                defaultValue=""
                className={cn(
                  "h-12 w-full rounded-[10px] border bg-surface px-3.5 text-[15px] text-content",
                  "focus:ring-4 focus:outline-none",
                  invalid
                    ? "border-signal-down/60 focus:border-signal-down focus:ring-signal-down/15"
                    : "border-line-strong focus:border-brand-500 focus:ring-brand-500/15",
                )}
                {...register("state")}
              >
                <option value="" disabled>
                  Select your state
                </option>
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            )}
          </Field>

          <Field
            label="GSTIN (optional)"
            error={errors.gstin?.message}
            hint="Add it to claim input tax credit on this invoice."
          >
            {({ id, invalid }) => (
              <Input
                id={id}
                placeholder="19AAAAA0000A1Z5"
                maxLength={15}
                className="font-mono uppercase"
                invalid={invalid}
                {...register("gstin")}
              />
            )}
          </Field>
        </div>
      </section>

      {/* Payment method */}
      <section>
        <Heading
          title="Payment method"
          blurb="All payments are processed over an encrypted connection."
        />

        <div
          role="radiogroup"
          aria-label="Payment method"
          className="mt-5 space-y-2.5"
        >
          {PAYMENT_METHODS.map((option) => {
            const Icon = methodIcons[option.icon] ?? CreditCard;
            const active = method === option.id;

            return (
              <div
                key={option.id}
                className={cn(
                  "rounded-[13px] border transition-all duration-200",
                  active
                    ? "border-brand-500 bg-brand-50/60 ring-4 ring-brand-500/12 dark:bg-brand-500/8"
                    : "border-line-strong bg-surface hover:border-ink-400",
                )}
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setMethod(option.id)}
                  className="flex w-full items-center gap-4 p-4 text-left"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors",
                      active ? "border-brand-600" : "border-line-strong",
                    )}
                  >
                    {active && (
                      <span className="size-2.5 rounded-full bg-brand-600" />
                    )}
                  </span>

                  <Icon
                    aria-hidden
                    className="size-[18px] shrink-0 text-content-subtle"
                  />

                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-[14.5px] font-semibold text-content">
                        {option.label}
                      </span>
                      {option.badge && (
                        <Badge variant="ok" size="sm">
                          {option.badge}
                        </Badge>
                      )}
                    </span>
                    <span className="mt-0.5 block text-[12.5px] text-content-muted">
                      {option.blurb}
                    </span>
                  </span>
                </button>

                {active && (
                  <div className="border-t border-line-strong/60 p-4">
                    <MethodFields method={option.id} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div>
        <Button
          type="submit"
          variant="accent"
          size="lg"
          block
          disabled={processing}
        >
          {processing ? (
            <>
              <Loader2 className="animate-spin" />
              Processing payment…
            </>
          ) : (
            <>
              <Lock />
              Pay {inr(total)}
            </>
          )}
        </Button>

        <p className="mt-3 text-center text-[12px] text-content-subtle">
          By paying you agree to our Terms of Service. Prices include 18% GST.
        </p>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Method-specific fields — all inert in this build                    */
/* ------------------------------------------------------------------ */

function MethodFields({ method }: { method: PaymentMethodId }) {
  const note = (
    <p className="mt-2.5 flex items-start gap-1.5 text-[12px] text-content-subtle">
      <Lock className="mt-px size-3 shrink-0" />
      Demo build — no card is charged and nothing is sent anywhere.
    </p>
  );

  if (method === "upi") {
    return (
      <div>
        <label className="block text-[13px] font-semibold text-content">
          UPI ID
        </label>
        <input
          placeholder="yourname@okhdfcbank"
          autoComplete="off"
          spellCheck={false}
          className="mt-1.5 h-12 w-full rounded-[10px] border border-line-strong bg-surface px-3.5 font-mono text-[14.5px] text-content placeholder:font-sans placeholder:text-content-subtle focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 focus:outline-none"
        />
        {note}
      </div>
    );
  }

  if (method === "card") {
    return (
      <div className="space-y-3">
        <div>
          <label className="block text-[13px] font-semibold text-content">
            Card number
          </label>
          <input
            placeholder="4111 1111 1111 1111"
            inputMode="numeric"
            autoComplete="off"
            className="mt-1.5 h-12 w-full rounded-[10px] border border-line-strong bg-surface px-3.5 font-mono text-[14.5px] tracking-wider text-content placeholder:tracking-normal placeholder:text-content-subtle focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[13px] font-semibold text-content">
              Expiry
            </label>
            <input
              placeholder="MM / YY"
              inputMode="numeric"
              autoComplete="off"
              className="mt-1.5 h-12 w-full rounded-[10px] border border-line-strong bg-surface px-3.5 font-mono text-[14.5px] text-content placeholder:text-content-subtle focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-content">
              CVV
            </label>
            <input
              placeholder="123"
              inputMode="numeric"
              maxLength={4}
              autoComplete="off"
              className="mt-1.5 h-12 w-full rounded-[10px] border border-line-strong bg-surface px-3.5 font-mono text-[14.5px] text-content placeholder:text-content-subtle focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 focus:outline-none"
            />
          </div>
        </div>
        {note}
      </div>
    );
  }

  return (
    <div>
      <label className="block text-[13px] font-semibold text-content">
        Choose your bank
      </label>
      <select
        defaultValue=""
        className="mt-1.5 h-12 w-full rounded-[10px] border border-line-strong bg-surface px-3.5 text-[15px] text-content focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 focus:outline-none"
      >
        <option value="" disabled>
          Select a bank
        </option>
        {[
          "State Bank of India",
          "HDFC Bank",
          "ICICI Bank",
          "Axis Bank",
          "Kotak Mahindra Bank",
          "Punjab National Bank",
          "Bank of Baroda",
          "Canara Bank",
        ].map((bank) => (
          <option key={bank} value={bank}>
            {bank}
          </option>
        ))}
      </select>
      {note}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Heading({ title, blurb }: { title: string; blurb: string }) {
  return (
    <div>
      <h2 className="text-[19px] leading-tight font-bold text-content">
        {title}
      </h2>
      <p className="mt-1.5 text-[13.5px] text-content-muted">{blurb}</p>
    </div>
  );
}
