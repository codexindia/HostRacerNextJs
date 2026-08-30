"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/ui/otp-input";
import {
  DEMO_CODE,
  resendCode,
  verifyChallenge,
  type AuthUser,
} from "@/lib/auth/mock-api";

/**
 * The 6-digit verification screen. Shared by the 2FA challenge on sign-in and
 * the SMS OTP step on registration — the only differences are the copy and
 * whether a resend is offered.
 */
export function ChallengeStep({
  ticket,
  hint,
  title,
  icon: Icon,
  backLabel,
  onBack,
  onVerified,
  allowResend = true,
}: {
  ticket: string;
  hint: string;
  title: string;
  icon: LucideIcon;
  backLabel: string;
  onBack: () => void;
  onVerified: (user: AuthUser, token: string) => void;
  allowResend?: boolean;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);

  async function submit(value = code) {
    if (value.length !== 6 || busy) return;
    setBusy(true);
    setError(null);

    const result = await verifyChallenge({ ticket, code: value });
    setBusy(false);

    if (result.ok) {
      onVerified(result.user, result.token);
      return;
    }

    setError("error" in result ? result.error : "Verification failed.");
    setCode("");
  }

  async function resend() {
    setResending(true);
    const { ok } = await resendCode(ticket);
    setResending(false);
    if (ok) toast.success("A new code is on its way");
    else toast.error("That session expired — please start again");
  }

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-7 flex items-center gap-1.5 text-[13.5px] font-medium text-content-muted transition-colors hover:text-content"
      >
        <ArrowLeft className="size-4" />
        {backLabel}
      </button>

      <span className="grid size-12 place-items-center rounded-[13px] bg-gradient-racer text-white shadow-[0_10px_26px_-12px_var(--color-racer-to)]">
        <Icon className="size-[22px]" />
      </span>

      <h1 className="mt-5 text-[26px] leading-tight font-bold text-content">
        {title}
      </h1>
      <p className="mt-2 text-[14.5px] leading-relaxed text-content-muted">
        {hint}
      </p>

      <div className="mt-8">
        <OtpInput
          value={code}
          onChange={(v) => {
            setCode(v);
            if (error) setError(null);
          }}
          onComplete={submit}
          invalid={Boolean(error)}
          disabled={busy}
          autoFocus
        />

        {error && (
          <p
            role="alert"
            className="mt-3 flex items-center gap-1.5 text-[13px] font-medium text-signal-down"
          >
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </p>
        )}

        <p className="mt-4 flex items-start gap-2 rounded-[10px] border border-dashed border-line-strong bg-surface-2 px-3.5 py-2.5 text-[12.5px] text-content-muted">
          <Sparkles className="mt-px size-3.5 shrink-0 text-flag-500" />
          <span>
            Demo build — the code is{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 font-mono font-semibold text-content">
              {DEMO_CODE}
            </code>
          </span>
        </p>
      </div>

      <Button
        onClick={() => submit()}
        variant="accent"
        size="lg"
        block
        className="mt-6"
        disabled={busy || code.length !== 6}
      >
        {busy ? (
          <>
            <Loader2 className="animate-spin" />
            Verifying…
          </>
        ) : (
          <>
            Verify and continue
            <ArrowRight />
          </>
        )}
      </Button>

      {allowResend && (
        <p className="mt-5 text-center text-[13.5px] text-content-muted">
          Didn&rsquo;t get it?{" "}
          <button
            type="button"
            onClick={resend}
            disabled={resending}
            className="font-semibold text-brand-600 underline-offset-4 hover:underline disabled:opacity-60 dark:text-brand-400"
          >
            {resending ? "Sending…" : "Resend code"}
          </button>
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function FormAlert({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-[10px] border border-signal-down/25 bg-signal-down/8 px-3.5 py-3 text-[13.5px] text-signal-down"
    >
      <AlertCircle className="mt-px size-4 shrink-0" />
      {children}
    </div>
  );
}
