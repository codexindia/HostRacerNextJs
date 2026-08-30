"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  BadgeCheck,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";
import { ChallengeStep, FormAlert } from "@/components/auth/challenge-step";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, PasswordInput } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/store";
import { signIn, signUp, type AuthUser } from "@/lib/auth/mock-api";
import {
  checkoutRegisterSchema,
  loginSchema,
  type CheckoutRegisterValues,
  type LoginValues,
} from "@/lib/validation";
import { cn } from "@/lib/utils";

type Challenge = { kind: "2fa" | "otp"; ticket: string; hint: string } | null;

export function StepAccount({ onContinue }: { onContinue: () => void }) {
  const { user, setSession, signOut } = useAuth();
  const [mode, setMode] = useState<"register" | "login">("register");
  const [challenge, setChallenge] = useState<Challenge>(null);

  function complete(nextUser: AuthUser, token: string) {
    setSession(nextUser, token);
    onContinue();
  }

  /* Verification interstitial */
  if (challenge) {
    return (
      <ChallengeStep
        ticket={challenge.ticket}
        hint={challenge.hint}
        title={
          challenge.kind === "2fa"
            ? "Two-factor verification"
            : "Verify your mobile number"
        }
        icon={challenge.kind === "2fa" ? KeyRound : MessageSquare}
        backLabel="Back to account details"
        allowResend={challenge.kind === "otp"}
        onBack={() => setChallenge(null)}
        onVerified={complete}
      />
    );
  }

  /* Already signed in */
  if (user) {
    return (
      <div>
        <Heading
          title="Your account"
          blurb="This order will be added to the account below."
        />

        <div className="mt-5 flex flex-wrap items-center gap-4 rounded-[13px] border border-line bg-surface-2 p-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-racer font-display text-[15px] font-bold text-white">
            {user.fullName
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")}
          </span>

          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-[15px] font-semibold text-content">
              {user.fullName}
              <BadgeCheck className="size-4 shrink-0 text-signal-ok" />
            </p>
            <p className="truncate text-[13px] text-content-muted">
              {user.email} · +91 {user.phone}
            </p>
          </div>

          <button
            type="button"
            onClick={signOut}
            className="shrink-0 text-[13px] font-semibold text-brand-600 underline-offset-4 hover:underline dark:text-brand-400"
          >
            Not you?
          </button>
        </div>

        <Button
          variant="accent"
          size="lg"
          block
          className="mt-6"
          onClick={onContinue}
        >
          Continue to payment
          <ArrowRight />
        </Button>
      </div>
    );
  }

  /* Signed out */
  return (
    <div>
      <Heading
        title="Your account"
        blurb="You'll use this to manage your hosting, domains and invoices."
      />

      <div
        role="tablist"
        aria-label="Account"
        className="mt-5 grid grid-cols-2 gap-1 rounded-[12px] border border-line bg-surface-2 p-1.5"
      >
        {(["register", "login"] as const).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={cn(
              "rounded-[9px] py-2.5 text-[13.5px] font-semibold transition-all duration-200",
              mode === m
                ? "bg-surface text-content shadow-[0_1px_3px_rgba(20,20,31,0.12)]"
                : "text-content-muted hover:text-content",
            )}
          >
            {m === "register" ? "Create account" : "I have an account"}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {mode === "register" ? (
          <RegisterPane onChallenge={setChallenge} onDone={complete} />
        ) : (
          <LoginPane onChallenge={setChallenge} onDone={complete} />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Register                                                            */
/* ------------------------------------------------------------------ */

function RegisterPane({
  onChallenge,
  onDone,
}: {
  onChallenge: (c: Challenge) => void;
  onDone: (u: AuthUser, t: string) => void;
}) {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutRegisterValues>({
    resolver: zodResolver(checkoutRegisterSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      terms: false,
    },
  });

  async function onSubmit(values: CheckoutRegisterValues) {
    setFormError(null);
    const result = await signUp(values);

    if ("challenge" in result) {
      onChallenge({
        kind: result.challenge,
        ticket: result.ticket,
        hint: result.hint,
      });
      return;
    }
    if (result.ok) {
      onDone(result.user, result.token);
      return;
    }
    if (result.field) setError(result.field, { message: result.error });
    else setFormError(result.error);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {formError && <FormAlert>{formError}</FormAlert>}

      <Field label="Full name" error={errors.fullName?.message}>
        {({ id, invalid }) => (
          <Input
            id={id}
            icon={User}
            placeholder="Priya Sharma"
            autoComplete="name"
            invalid={invalid}
            {...register("fullName")}
          />
        )}
      </Field>

      <Field label="Email address" error={errors.email?.message}>
        {({ id, invalid }) => (
          <Input
            id={id}
            type="email"
            icon={Mail}
            placeholder="you@company.in"
            autoComplete="email"
            invalid={invalid}
            {...register("email")}
          />
        )}
      </Field>

      <Field
        label="Mobile number"
        error={errors.phone?.message}
        hint="We'll text a code to confirm it."
      >
        {({ id, invalid }) => (
          <div className="flex">
            <span className="inline-flex h-12 shrink-0 items-center gap-1.5 rounded-l-[10px] border border-r-0 border-line-strong bg-surface-2 px-3.5 font-mono text-[14px] font-medium text-content-muted">
              <span aria-hidden>🇮🇳</span> +91
            </span>
            <Input
              id={id}
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="98765 43210"
              autoComplete="tel-national"
              invalid={invalid}
              className="rounded-l-none"
              {...register("phone")}
            />
          </div>
        )}
      </Field>

      <Field label="Password" error={errors.password?.message}>
        {({ id, invalid }) => (
          <PasswordInput
            id={id}
            icon={Lock}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            invalid={invalid}
            {...register("password")}
          />
        )}
      </Field>

      <div>
        <label className="flex cursor-pointer items-start gap-2.5">
          <Checkbox {...register("terms")} />
          <span className="text-[13px] leading-relaxed text-content-muted">
            I agree to the{" "}
            <Link
              href="/legal/terms"
              className="font-medium text-brand-600 underline underline-offset-2 dark:text-brand-400"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/legal/privacy"
              className="font-medium text-brand-600 underline underline-offset-2 dark:text-brand-400"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errors.terms && (
          <p className="mt-1.5 text-[12.5px] font-medium text-signal-down">
            {errors.terms.message}
          </p>
        )}
      </div>

      <Button type="submit" variant="accent" size="lg" block disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" />
            Creating account…
          </>
        ) : (
          <>
            Create account and continue
            <ArrowRight />
          </>
        )}
      </Button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Login                                                               */
/* ------------------------------------------------------------------ */

function LoginPane({
  onChallenge,
  onDone,
}: {
  onChallenge: (c: Challenge) => void;
  onDone: (u: AuthUser, t: string) => void;
}) {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    setFormError(null);
    const result = await signIn(values);

    if (result.ok) {
      onDone(result.user, result.token);
      return;
    }
    if ("challenge" in result) {
      onChallenge({
        kind: result.challenge,
        ticket: result.ticket,
        hint: result.hint,
      });
      return;
    }
    if (result.field && result.field !== "phone") {
      setError(result.field, { message: result.error });
    } else {
      setFormError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {formError && <FormAlert>{formError}</FormAlert>}

      <Field label="Email address" error={errors.email?.message}>
        {({ id, invalid }) => (
          <Input
            id={id}
            type="email"
            icon={Mail}
            placeholder="you@company.in"
            autoComplete="email"
            invalid={invalid}
            {...register("email")}
          />
        )}
      </Field>

      <Field
        label="Password"
        error={errors.password?.message}
        action={
          <Link
            href="/forgot-password"
            className="text-[13px] font-medium text-brand-600 underline-offset-4 hover:underline dark:text-brand-400"
          >
            Forgot?
          </Link>
        }
      >
        {({ id, invalid }) => (
          <PasswordInput
            id={id}
            icon={Lock}
            placeholder="Enter your password"
            autoComplete="current-password"
            invalid={invalid}
            {...register("password")}
          />
        )}
      </Field>

      <p className="rounded-[10px] border border-dashed border-line-strong bg-surface-2 px-3.5 py-2.5 text-[12px] text-content-muted">
        Demo:{" "}
        <code className="font-mono font-semibold text-content">
          demo@hostracer.in
        </code>{" "}
        /{" "}
        <code className="font-mono font-semibold text-content">Demo@1234</code>
      </p>

      <Button type="submit" variant="accent" size="lg" block disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" />
            Signing in…
          </>
        ) : (
          <>
            Sign in and continue
            <ArrowRight />
          </>
        )}
      </Button>
    </form>
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
