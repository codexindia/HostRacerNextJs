"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ArrowRight,
  Check,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
  X,
} from "lucide-react";
import { ChallengeStep, FormAlert } from "@/components/auth/challenge-step";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, PasswordInput } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/store";
import { signUp } from "@/lib/auth/mock-api";
import {
  registerSchema,
  scorePassword,
  type RegisterValues,
} from "@/lib/validation";
import { cn } from "@/lib/utils";

type Stage =
  | { name: "details" }
  | { name: "verify"; ticket: string; hint: string };

export function RegisterForm() {
  const router = useRouter();
  const setSession = useAuth((s) => s.setSession);

  const [stage, setStage] = useState<Stage>({ name: "details" });
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const password = useWatch({ control, name: "password" }) ?? "";

  async function onSubmit(values: RegisterValues) {
    setFormError(null);
    const result = await signUp({
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      password: values.password,
    });

    if ("challenge" in result) {
      setStage({ name: "verify", ticket: result.ticket, hint: result.hint });
      return;
    }

    if (result.ok) {
      // The mock always issues an OTP challenge, but handle the direct path
      // so this survives a backend that verifies by email link instead.
      setSession(result.user, result.token);
      router.push("/dashboard");
      return;
    }

    if (result.field) {
      setError(result.field, { message: result.error });
    } else {
      setFormError(result.error);
    }
  }

  /* ---------------- SMS verification ---------------- */

  if (stage.name === "verify") {
    return (
      <ChallengeStep
        ticket={stage.ticket}
        hint={stage.hint}
        title="Verify your mobile number"
        icon={MessageSquare}
        backLabel="Change my details"
        onBack={() => setStage({ name: "details" })}
        onVerified={(user, token) => {
          setSession(user, token);
          toast.success("Account created — welcome to Hostracer");
          router.push("/dashboard");
        }}
      />
    );
  }

  /* ---------------- Details ---------------- */

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-[28px] leading-tight font-bold text-content">
          Create your account
        </h1>
        <p className="mt-2 text-[14.5px] text-content-muted">
          Already with us?{" "}
          <Link
            href="/login"
            className="font-semibold text-brand-600 underline-offset-4 hover:underline dark:text-brand-400"
          >
            Sign in instead
          </Link>
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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
          hint="We'll text a 6-digit code to confirm it's yours."
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
            <>
              <PasswordInput
                id={id}
                icon={Lock}
                placeholder="Create a strong password"
                autoComplete="new-password"
                invalid={invalid}
                {...register("password")}
              />
              {password.length > 0 && <StrengthMeter password={password} />}
            </>
          )}
        </Field>

        <Field label="Confirm password" error={errors.confirmPassword?.message}>
          {({ id, invalid }) => (
            <PasswordInput
              id={id}
              icon={Lock}
              placeholder="Type it once more"
              autoComplete="new-password"
              invalid={invalid}
              {...register("confirmPassword")}
            />
          )}
        </Field>

        <div>
          <label className="flex cursor-pointer items-start gap-2.5">
            <Checkbox {...register("terms")} />
            <span className="text-[13.5px] leading-relaxed text-content-muted">
              I agree to the{" "}
              <Link
                href="/legal/terms"
                className="font-medium text-brand-600 underline underline-offset-2 dark:text-brand-400"
              >
                Terms of Service
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

        <Button
          type="submit"
          variant="accent"
          size="lg"
          block
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" />
              Creating account…
            </>
          ) : (
            <>
              Create account
              <ArrowRight />
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-[12.5px] text-content-subtle">
        No card required. You only pay when you pick a plan.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Password strength meter                                             */
/* ------------------------------------------------------------------ */

function StrengthMeter({ password }: { password: string }) {
  const { score, label, checks } = scorePassword(password);

  const barColour = [
    "bg-signal-down",
    "bg-signal-down",
    "bg-flag-400",
    "bg-flag-500",
    "bg-signal-ok",
  ][score];

  const labelColour = [
    "text-signal-down",
    "text-signal-down",
    "text-flag-600 dark:text-flag-400",
    "text-flag-600 dark:text-flag-400",
    "text-signal-ok",
  ][score];

  return (
    <div className="mt-2.5">
      <div className="flex items-center gap-3">
        <div
          className="flex h-1.5 flex-1 gap-1"
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={4}
          aria-label="Password strength"
        >
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={cn(
                "h-full flex-1 rounded-full transition-colors duration-300",
                i < score ? barColour : "bg-line-strong",
              )}
            />
          ))}
        </div>
        <span className={cn("text-[12px] font-semibold", labelColour)}>
          {label}
        </span>
      </div>

      <ul className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1">
        {checks.map((check) => (
          <li
            key={check.label}
            className={cn(
              "flex items-center gap-1.5 text-[11.5px] transition-colors",
              check.met ? "text-signal-ok" : "text-content-subtle",
            )}
          >
            {check.met ? (
              <Check className="size-3 shrink-0" />
            ) : (
              <X className="size-3 shrink-0" />
            )}
            {check.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
