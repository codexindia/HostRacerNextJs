"use client";

/**
 * TEMPORARY LANDING — replaced by the real client area in the dashboard phase.
 * It exists now so the sign-in and registration flows can be walked end to end.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { LogoLink } from "@/components/brand/logo";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge, Container } from "@/components/ui/primitives";
import { useAuth } from "@/lib/auth/store";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const { user, hydrated, signOut } = useAuth();

  useEffect(() => {
    if (hydrated && !user) router.replace("/login?next=/dashboard");
  }, [hydrated, user, router]);

  if (!hydrated || !user) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-line-strong border-t-brand-500" />
      </div>
    );
  }

  const facts = [
    { Icon: Mail, label: "Email", value: user.email, ok: user.emailVerified },
    {
      Icon: Phone,
      label: "Mobile",
      value: `+91 ${user.phone}`,
      ok: user.phoneVerified,
    },
    {
      Icon: ShieldCheck,
      label: "Two-factor",
      value: user.twoFactorEnabled ? "Enabled" : "Not enabled",
      ok: user.twoFactorEnabled,
    },
    {
      Icon: Smartphone,
      label: "Member since",
      value: formatDate(user.createdAt),
      ok: true,
    },
  ];

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-surface">
        <Container className="flex h-16 items-center justify-between gap-4">
          <LogoLink height={27} />
          <div className="flex items-center gap-3">
            <span className="hidden text-[13.5px] text-content-muted sm:inline">
              {user.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                signOut();
                router.push("/");
              }}
            >
              <LogOut />
              Sign out
            </Button>
          </div>
        </Container>
      </header>

      <Container className="py-14">
        <Badge variant="ok" size="md" className="mb-5">
          <BadgeCheck className="size-3.5" />
          Signed in
        </Badge>

        <h1 className="text-[clamp(1.8rem,3.6vw,2.4rem)] leading-tight">
          Welcome, {user.fullName.split(" ")[0]}
        </h1>
        <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-content-muted">
          Your account is live. The full client area — services, domains, DNS,
          invoices and tickets — is the next phase of the build.
        </p>

        <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map(({ Icon, label, value, ok }) => (
            <div
              key={label}
              className="rounded-[14px] border border-line bg-surface p-5"
            >
              <dt className="flex items-center gap-2 text-[12.5px] text-content-subtle">
                <Icon className="size-4" />
                {label}
              </dt>
              <dd className="mt-2 flex items-center gap-2 text-[14.5px] font-semibold break-all text-content">
                {value}
                {ok && (
                  <BadgeCheck className="size-4 shrink-0 text-signal-ok" />
                )}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/pricing" variant="accent" size="md">
            Browse hosting plans
          </ButtonLink>
          <ButtonLink href="/" variant="outline" size="md">
            Back to site
          </ButtonLink>
        </div>

        <p className="mt-8 font-mono text-[12px] text-content-subtle">
          session: {useAuth.getState().token}
        </p>
      </Container>
    </div>
  );
}
