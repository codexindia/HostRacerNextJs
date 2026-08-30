"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowRight, KeyRound, Loader2, Lock, Mail, Sparkles } from "lucide-react";
import { ChallengeStep, FormAlert } from "@/components/auth/challenge-step";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, PasswordInput } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/store";
import { signIn } from "@/lib/auth/mock-api";
import { loginSchema, type LoginValues } from "@/lib/validation";

type Stage =
  | { name: "credentials" }
  | { name: "twoFactor"; ticket: string; hint: string };

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const setSession = useAuth((s) => s.setSession);

  const [stage, setStage] = useState<Stage>({ name: "credentials" });
  const [formError, setFormError] = useState<string | null>(null);

  const next = params.get("next") || "/dashboard";

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  async function onSubmit(values: LoginValues) {
    setFormError(null);
    const result = await signIn(values);

    if (result.ok) {
      setSession(result.user, result.token);
      toast.success(`Welcome back, ${result.user.fullName.split(" ")[0]}`);
      router.push(next);
      return;
    }

    if ("challenge" in result) {
      setStage({ name: "twoFactor", ticket: result.ticket, hint: result.hint });
      return;
    }

    if (result.field && result.field !== "phone") {
      setError(result.field, { message: result.error });
    } else {
      setFormError(result.error);
    }
  }

  function fillDemo(email: string) {
    setValue("email", email, { shouldValidate: true });
    setValue("password", "Demo@1234", { shouldValidate: true });
    setFormError(null);
  }

  /* ---------------- Second factor ---------------- */

  if (stage.name === "twoFactor") {
    return (
      <ChallengeStep
        ticket={stage.ticket}
        hint={stage.hint}
        title="Two-factor verification"
        icon={KeyRound}
        backLabel="Use a different account"
        allowResend={false}
        onBack={() => setStage({ name: "credentials" })}
        onVerified={(user, token) => {
          setSession(user, token);
          toast.success("Verified — signing you in");
          router.push(next);
        }}
      />
    );
  }

  /* ---------------- Credentials ---------------- */

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-[28px] leading-tight font-bold text-content">
          Sign in to your account
        </h1>
        <p className="mt-2 text-[14.5px] text-content-muted">
          New to Hostracer?{" "}
          <Link
            href="/register"
            className="font-semibold text-brand-600 underline-offset-4 hover:underline dark:text-brand-400"
          >
            Create an account
          </Link>
        </p>
      </header>

      <DemoHint onPick={fillDemo} />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-5"
        noValidate
      >
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
              Forgot password?
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

        <label className="flex cursor-pointer items-start gap-2.5">
          <Checkbox {...register("remember")} />
          <span className="text-[13.5px] text-content-muted">
            Keep me signed in on this device
          </span>
        </label>

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
              Signing in…
            </>
          ) : (
            <>
              Sign in
              <ArrowRight />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function DemoHint({ onPick }: { onPick: (email: string) => void }) {
  const accounts = [
    { email: "demo@hostracer.in", note: "signs straight in" },
    { email: "secure@hostracer.in", note: "asks for a 2FA code" },
  ];

  return (
    <div className="rounded-[12px] border border-dashed border-line-strong bg-surface-2 p-4">
      <p className="eyebrow flex items-center gap-2 text-content-subtle">
        <Sparkles className="size-3.5 text-flag-500" />
        Demo accounts
      </p>

      <div className="mt-3 space-y-1">
        {accounts.map((account) => (
          <button
            key={account.email}
            type="button"
            onClick={() => onPick(account.email)}
            className="flex w-full items-center justify-between gap-3 rounded-[8px] px-2.5 py-2 text-left transition-colors hover:bg-surface"
          >
            <span className="font-mono text-[12.5px] font-medium text-content">
              {account.email}
            </span>
            <span className="shrink-0 text-[11.5px] text-content-subtle">
              {account.note}
            </span>
          </button>
        ))}
      </div>

      <p className="mt-2 px-2.5 text-[11.5px] text-content-subtle">
        Password for both:{" "}
        <code className="font-mono font-semibold text-content-muted">
          Demo@1234
        </code>{" "}
        · click to fill
      </p>
    </div>
  );
}
