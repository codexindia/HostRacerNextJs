"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Boxes,
  CreditCard,
  Globe,
  HardDrive,
  LifeBuoy,
  MessageSquare,
  Server,
  ShieldCheck,
  TriangleAlert,
  Wallet,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import {
  DefRow,
  Panel,
  PanelHeader,
  StatusPill,
  UsageBar,
} from "@/components/dashboard/ui";
import { useAuth } from "@/lib/auth/store";
import {
  activity,
  daysUntil,
  domains,
  invoices,
  outstandingTotal,
  primaryMetric,
  services,
  tickets,
  type ActivityKind,
} from "@/lib/dashboard/mock-data";
import { formatDate, inr } from "@/lib/utils";
import { cn } from "@/lib/utils";

const activityIcons: Record<ActivityKind, typeof Server> = {
  payment: Wallet,
  service: Server,
  domain: Globe,
  security: ShieldCheck,
  ticket: MessageSquare,
};

export default function DashboardHome() {
  const user = useAuth((s) => s.user);
  const firstName = user?.fullName.split(" ")[0] ?? "there";

  const dueInvoice = invoices.find(
    (i) => i.status === "unpaid" || i.status === "overdue",
  );
  const expiringDomain = domains.find((d) => daysUntil(d.expiresOn) <= 30);
  const noAutoRenew = services.find((s) => !s.autoRenew);
  const openTickets = tickets.filter((t) => t.status !== "closed");
  const awaitingYou = tickets.filter((t) => t.status === "answered");

  const stats = [
    {
      label: "Active services",
      value: services.filter((s) => s.status === "active").length,
      sub: `${services.filter((s) => s.kind === "hosting").length} hosting · ${services.filter((s) => s.kind === "vps").length} VPS`,
      Icon: Boxes,
      href: "/dashboard/services",
    },
    {
      label: "Domains",
      value: domains.length,
      sub: expiringDomain
        ? `1 expiring in ${daysUntil(expiringDomain.expiresOn)} days`
        : "All renewing normally",
      Icon: Globe,
      href: "/dashboard/domains",
      warn: Boolean(expiringDomain),
    },
    {
      label: "Amount due",
      value: outstandingTotal > 0 ? inr(outstandingTotal) : "—",
      sub: dueInvoice
        ? `Due ${formatDate(dueInvoice.dueOn)}`
        : "Nothing outstanding",
      Icon: CreditCard,
      href: "/dashboard/billing",
      warn: outstandingTotal > 0,
    },
    {
      label: "Open tickets",
      value: openTickets.length,
      sub: awaitingYou.length
        ? `${awaitingYou.length} awaiting your reply`
        : "Nothing needs you",
      Icon: LifeBuoy,
      href: "/dashboard/tickets",
    },
  ];

  return (
    <div className="mx-auto max-w-[1180px] space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-[26px] leading-tight font-bold text-content">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1.5 text-[14px] text-content-muted">
          Everything running on your account, at a glance.
        </p>
      </div>

      {/* Things that need attention — only rendered when there are any */}
      {(dueInvoice || expiringDomain || noAutoRenew) && (
        <div className="space-y-2.5">
          {dueInvoice && (
            <AttentionRow
              tone="warn"
              icon={<CreditCard className="size-[18px]" />}
              title={`Invoice ${dueInvoice.number} is due on ${formatDate(dueInvoice.dueOn)}`}
              body={`${inr(dueInvoice.total)} covering your Starter hosting and domain renewal.`}
              href={`/dashboard/billing/${dueInvoice.id}`}
              cta="Pay now"
            />
          )}

          {expiringDomain && !expiringDomain.autoRenew && (
            <AttentionRow
              tone="down"
              icon={<TriangleAlert className="size-[18px]" />}
              title={`${expiringDomain.name} expires in ${daysUntil(expiringDomain.expiresOn)} days`}
              body="Auto-renew is off for this domain. If it lapses, the name goes back on the open market after the grace period."
              href="/dashboard/domains"
              cta="Turn on auto-renew"
            />
          )}
        </div>
      )}

      {/* Stat tiles */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, sub, Icon, href, warn }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-[14px] border border-line bg-surface p-5 transition-[border-color,box-shadow] hover:border-line-strong hover:shadow-[0_12px_28px_-20px_rgba(20,20,31,0.35)]"
          >
            <div className="flex items-start justify-between">
              <span
                className={cn(
                  "grid size-9 place-items-center rounded-[10px]",
                  warn
                    ? "bg-flag-400/15 text-flag-600 dark:text-flag-300"
                    : "bg-brand-500/10 text-brand-600 dark:text-brand-400",
                )}
              >
                <Icon className="size-[18px]" />
              </span>
              <ArrowUpRight className="size-4 text-content-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>

            <p className="mt-4 font-mono text-[26px] leading-none font-bold text-content tnum">
              {value}
            </p>
            <p className="mt-2 text-[13px] font-semibold text-content">
              {label}
            </p>
            <p className="mt-0.5 text-[12.5px] text-content-subtle">{sub}</p>
          </Link>
        ))}
      </div>

      {/* items-start stops the shorter column being stretched to match the
          taller one, which left a block of dead space under the last service. */}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        {/* Services */}
        <Panel>
          <PanelHeader
            title="Your services"
            action={
              <Link
                href="/dashboard/services"
                className="text-[13px] font-semibold text-brand-600 underline-offset-4 hover:underline dark:text-brand-400"
              >
                Manage all
              </Link>
            }
          />

          <ul className="divide-y divide-line">
            {services.map((service) => {
              const days = daysUntil(service.renewsOn);
              const soon = days <= 30;
              const primary = primaryMetric(service);

              return (
                <li key={service.id}>
                  <Link
                    href={`/dashboard/services/${service.id}`}
                    className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-2"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-[10px] border border-line bg-canvas text-content-muted">
                      {service.kind === "vps" ? (
                        <Server className="size-[18px]" />
                      ) : (
                        <HardDrive className="size-[18px]" />
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate font-mono text-[14px] font-semibold text-content">
                          {service.label}
                        </span>
                        <StatusPill tone={soon ? "warn" : "ok"}>
                          {soon ? `Renews in ${days}d` : "Active"}
                        </StatusPill>
                      </div>
                      <p className="mt-0.5 text-[12.5px] text-content-subtle">
                        {service.planName} · {service.datacentre}
                      </p>
                    </div>

                    <div className="hidden w-[160px] shrink-0 sm:block">
                      <UsageBar
                        label="Storage"
                        used={primary.used}
                        limit={primary.limit}
                        unit={primary.unit}
                      />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Panel>

        {/* Right rail */}
        <div className="space-y-6">
          {/* Next payment */}
          <Panel>
            <PanelHeader title="Next payment" />
            <div className="px-5 py-4">
              {dueInvoice ? (
                <>
                  <p className="font-mono text-[28px] leading-none font-bold text-content tnum">
                    {inr(dueInvoice.total)}
                  </p>
                  <p className="mt-2 text-[13px] text-content-muted">
                    Due {formatDate(dueInvoice.dueOn)} ·{" "}
                    {daysUntil(dueInvoice.dueOn)} days away
                  </p>

                  <dl className="mt-4 divide-y divide-line border-t border-line pt-1">
                    <DefRow label="Invoice" mono>
                      {dueInvoice.number}
                    </DefRow>
                    <DefRow label="Items">
                      {dueInvoice.lines.length} line items
                    </DefRow>
                  </dl>

                  <ButtonLink
                    href={`/dashboard/billing/${dueInvoice.id}`}
                    variant="accent"
                    size="md"
                    block
                    className="mt-4"
                  >
                    Pay {inr(dueInvoice.total)}
                  </ButtonLink>
                </>
              ) : (
                <p className="py-4 text-center text-[13.5px] text-content-muted">
                  Nothing due. Your next renewal is{" "}
                  {formatDate(services[0].renewsOn)}.
                </p>
              )}
            </div>
          </Panel>

          {/* Activity */}
          <Panel>
            <PanelHeader title="Recent activity" />
            <ul className="divide-y divide-line">
              {activity.slice(0, 5).map((entry) => {
                const Icon = activityIcons[entry.kind];
                return (
                  <li key={entry.id} className="flex gap-3 px-5 py-3.5">
                    <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-surface-2 text-content-subtle">
                      <Icon className="size-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-content">
                        {entry.title}
                      </p>
                      <p className="mt-0.5 truncate text-[12.5px] text-content-muted">
                        {entry.detail}
                      </p>
                      <p className="mt-1 font-mono text-[11px] text-content-subtle">
                        {new Intl.DateTimeFormat("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "numeric",
                          minute: "2-digit",
                        }).format(new Date(entry.at))}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function AttentionRow({
  tone,
  icon,
  title,
  body,
  href,
  cta,
}: {
  tone: "warn" | "down";
  icon: React.ReactNode;
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-[13px] border p-4 sm:flex-row sm:items-center",
        tone === "down"
          ? "border-signal-down/25 bg-signal-down/6"
          : "border-flag-400/35 bg-flag-400/8",
      )}
    >
      <span
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-[10px]",
          tone === "down"
            ? "bg-signal-down/12 text-signal-down"
            : "bg-flag-400/20 text-flag-700 dark:text-flag-300",
        )}
      >
        {icon}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold text-content">{title}</p>
        <p className="mt-0.5 text-[13px] text-content-muted">{body}</p>
      </div>

      <ButtonLink
        href={href}
        variant={tone === "down" ? "primary" : "accent"}
        size="sm"
        className="shrink-0"
      >
        {cta}
      </ButtonLink>
    </div>
  );
}
