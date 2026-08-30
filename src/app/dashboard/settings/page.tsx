"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  BadgeCheck,
  Bell,
  KeyRound,
  Laptop,
  Lock,
  Mail,
  Monitor,
  ShieldCheck,
  Smartphone,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, PasswordInput } from "@/components/ui/input";
import {
  PageHeader,
  Panel,
  PanelHeader,
  StatusPill,
} from "@/components/dashboard/ui";
import { useAuth } from "@/lib/auth/store";
import { sessions } from "@/lib/dashboard/mock-data";
import type { AuthUser } from "@/lib/auth/mock-api";
import { cn, formatDate } from "@/lib/utils";

/**
 * Panels are declared at module scope on purpose. Nesting them inside the page
 * component would give each one a fresh identity on every parent render, so
 * React would remount them and wipe their form state — toggling 2FA would
 * silently reset a half-typed profile form.
 */
export default function SettingsPage() {
  const user = useAuth((s) => s.user);

  if (!user) return null;

  return (
    <div className="mx-auto max-w-[860px] space-y-6">
      <PageHeader
        title="Account settings"
        lede="Your details, how you sign in, and where you're signed in from."
      />

      <ProfilePanel user={user} />
      <SecurityPanel user={user} />
      <NotificationsPanel />
      <SessionsPanel />
      <DangerPanel />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Profile                                                             */
/* ------------------------------------------------------------------ */

function ProfilePanel({ user }: { user: AuthUser }) {
  const { setSession, token } = useAuth();
  const [name, setName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [saving, setSaving] = useState(false);

  const dirty =
    name !== user.fullName || email !== user.email || phone !== user.phone;

  async function save() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSession({ ...user, fullName: name, email, phone }, token ?? "");
    setSaving(false);
    toast.success("Profile updated");
  }

  return (
    <Panel id="profile">
      <PanelHeader title="Profile" />
      <div className="space-y-4 p-5">
        <Field label="Full name">
          {({ id }) => (
            <Input
              id={id}
              icon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
        </Field>

        <Field
          label="Email address"
          hint={
            user.emailVerified
              ? "Verified — used for invoices and service notices."
              : "Not verified yet."
          }
        >
          {({ id }) => (
            <Input
              id={id}
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
        </Field>

        <Field
          label="Mobile number"
          hint="Used for OTP verification and urgent service alerts."
        >
          {({ id }) => (
            <div className="flex">
              <span className="inline-flex h-12 shrink-0 items-center gap-1.5 rounded-l-[10px] border border-r-0 border-line-strong bg-surface-2 px-3.5 font-mono text-[14px] font-medium text-content-muted">
                <span aria-hidden>🇮🇳</span> +91
              </span>
              <Input
                id={id}
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-l-none"
              />
            </div>
          )}
        </Field>

        <div className="flex justify-end pt-1">
          <Button
            variant="accent"
            size="md"
            disabled={!dirty || saving}
            onClick={save}
          >
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Security                                                            */
/* ------------------------------------------------------------------ */

function SecurityPanel({ user }: { user: AuthUser }) {
  const { setSession, token } = useAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");

  const twoFa = user.twoFactorEnabled;

  function toggle2fa() {
    setSession({ ...user, twoFactorEnabled: !twoFa }, token ?? "");
    toast.success(
      twoFa
        ? "Two-factor authentication turned off"
        : "Two-factor authentication enabled",
    );
  }

  return (
    <Panel id="security">
      <PanelHeader title="Sign-in & security" />

      <div className="divide-y divide-line">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <span
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-[11px]",
              twoFa
                ? "bg-signal-ok/12 text-signal-ok"
                : "bg-surface-2 text-content-subtle",
            )}
          >
            <ShieldCheck className="size-[19px]" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-[14.5px] font-semibold text-content">
                Two-factor authentication
              </p>
              <StatusPill tone={twoFa ? "ok" : "muted"}>
                {twoFa ? "On" : "Off"}
              </StatusPill>
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-content-muted">
              {twoFa
                ? "You'll be asked for a 6-digit code from your authenticator app every time you sign in."
                : "Add a second step at sign-in so a stolen password isn't enough to get into your account."}
            </p>
          </div>

          <Button
            variant={twoFa ? "outline" : "accent"}
            size="md"
            className="shrink-0"
            onClick={toggle2fa}
          >
            {twoFa ? "Turn off" : "Turn on"}
          </Button>
        </div>

        <div className="p-5">
          <div className="flex items-start gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-[11px] bg-surface-2 text-content-subtle">
              <KeyRound className="size-[19px]" />
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-[14.5px] font-semibold text-content">
                Change password
              </p>
              <p className="mt-1 text-[13px] text-content-muted">
                Signing out of other devices is recommended after a change.
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Current password">
                  {({ id }) => (
                    <PasswordInput
                      id={id}
                      icon={Lock}
                      value={current}
                      onChange={(e) => setCurrent(e.target.value)}
                      autoComplete="current-password"
                    />
                  )}
                </Field>
                <Field label="New password">
                  {({ id }) => (
                    <PasswordInput
                      id={id}
                      icon={Lock}
                      value={next}
                      onChange={(e) => setNext(e.target.value)}
                      autoComplete="new-password"
                    />
                  )}
                </Field>
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  size="md"
                  disabled={!current || next.length < 8}
                  onClick={() => {
                    setCurrent("");
                    setNext("");
                    toast.success("Password updated");
                  }}
                >
                  Update password
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Notifications                                                       */
/* ------------------------------------------------------------------ */

const notificationPrefs = [
  {
    id: "invoices",
    label: "Invoices and payment reminders",
    blurb: "Sent 14 days, 3 days and 1 day before a renewal.",
    on: true,
    locked: true,
  },
  {
    id: "service",
    label: "Service and downtime alerts",
    blurb: "Only when something on your account is affected.",
    on: true,
  },
  {
    id: "security",
    label: "Security notices",
    blurb: "New sign-ins, password changes, 2FA changes.",
    on: true,
  },
  {
    id: "offers",
    label: "Offers and product news",
    blurb: "Occasional — no more than once a month.",
    on: false,
  },
];

function NotificationsPanel() {
  return (
    <Panel>
      <PanelHeader
        title="Notifications"
        action={
          <span className="flex items-center gap-1.5 text-[12.5px] text-content-subtle">
            <Bell className="size-3.5" />
            Email
          </span>
        }
      />
      <ul className="divide-y divide-line">
        {notificationPrefs.map((pref) => (
          <li key={pref.id}>
            <label
              className={cn(
                "flex items-start gap-3 p-5",
                pref.locked ? "cursor-default" : "cursor-pointer",
              )}
            >
              <Checkbox
                defaultChecked={pref.on}
                disabled={pref.locked}
                onChange={() => toast.success("Preference saved")}
              />
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-[14px] font-semibold text-content">
                    {pref.label}
                  </span>
                  {pref.locked && (
                    <StatusPill tone="muted" dot={false}>
                      Always on
                    </StatusPill>
                  )}
                </span>
                <span className="mt-0.5 block text-[13px] text-content-muted">
                  {pref.blurb}
                </span>
              </span>
            </label>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Sessions                                                            */
/* ------------------------------------------------------------------ */

function SessionsPanel() {
  return (
    <Panel>
      <PanelHeader
        title="Where you're signed in"
        action={
          <button
            type="button"
            onClick={() => toast.success("Signed out of all other devices")}
            className="text-[13px] font-semibold text-signal-down underline-offset-4 hover:underline"
          >
            Sign out everywhere else
          </button>
        }
      />

      <ul className="divide-y divide-line">
        {sessions.map((session) => (
          <li key={session.id} className="flex items-center gap-4 p-5">
            <span className="grid size-10 shrink-0 place-items-center rounded-[11px] bg-surface-2 text-content-subtle">
              {session.device.includes("iPhone") ? (
                <Smartphone className="size-[18px]" />
              ) : session.device.includes("macOS") ? (
                <Laptop className="size-[18px]" />
              ) : (
                <Monitor className="size-[18px]" />
              )}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[14px] font-semibold text-content">
                  {session.device}
                </p>
                {session.current && (
                  <StatusPill tone="ok">
                    <BadgeCheck className="size-3" />
                    This device
                  </StatusPill>
                )}
              </div>
              <p className="mt-0.5 text-[12.5px] text-content-muted">
                {session.browser} · {session.location} ·{" "}
                <span className="font-mono">{session.ip}</span>
              </p>
              <p className="mt-0.5 text-[12px] text-content-subtle">
                Last active {formatDate(session.lastActive)}
              </p>
            </div>

            {!session.current && (
              <button
                type="button"
                onClick={() => toast.success("Device signed out")}
                className="shrink-0 text-[13px] font-semibold text-content-muted transition-colors hover:text-signal-down"
              >
                Sign out
              </button>
            )}
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Danger zone                                                         */
/* ------------------------------------------------------------------ */

function DangerPanel() {
  return (
    <Panel className="border-signal-down/25">
      <PanelHeader title="Close account" className="border-signal-down/20" />
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        <p className="min-w-0 flex-1 text-[13.5px] leading-relaxed text-content-muted">
          Closing your account cancels every active service at the end of its
          paid term and releases your domains at expiry. Data is deleted 30 days
          after closure and can&rsquo;t be recovered after that.
        </p>
        <Button
          variant="outline"
          size="md"
          className="shrink-0 border-signal-down/40 text-signal-down hover:border-signal-down hover:bg-signal-down/8"
          onClick={() =>
            toast.error("Account closure needs to be confirmed by support")
          }
        >
          Close account
        </Button>
      </div>
    </Panel>
  );
}
