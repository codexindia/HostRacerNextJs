"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Database,
  ExternalLink,
  FolderOpen,
  Globe,
  KeyRound,
  Mail,
  Power,
  RefreshCw,
  Server,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import {
  DefRow,
  PageHeader,
  Panel,
  PanelHeader,
  StatusPill,
  UsageBar,
} from "@/components/dashboard/ui";
import { daysUntil, getService } from "@/lib/dashboard/mock-data";
import { formatDate, inr } from "@/lib/utils";

export default function ServiceDetailPage() {
  const params = useParams<{ id: string }>();
  const service = getService(params.id);

  if (!service) {
    return (
      <div className="mx-auto max-w-[900px]">
        <Panel className="p-10 text-center">
          <h1 className="text-[18px] font-bold text-content">
            Service not found
          </h1>
          <p className="mt-2 text-[13.5px] text-content-muted">
            That service isn&rsquo;t on your account.
          </p>
          <ButtonLink
            href="/dashboard/services"
            variant="outline"
            size="md"
            className="mt-6"
          >
            Back to services
          </ButtonLink>
        </Panel>
      </div>
    );
  }

  const isVps = service.kind === "vps";
  const days = daysUntil(service.renewsOn);

  const tools = isVps
    ? [
        { label: "Console", Icon: Terminal, blurb: "Browser SSH session" },
        { label: "Reboot", Icon: Power, blurb: "Graceful restart" },
        { label: "Rebuild", Icon: RefreshCw, blurb: "Reinstall the OS" },
        { label: "Firewall", Icon: ShieldCheck, blurb: "Manage rules" },
      ]
    : [
        { label: "cPanel", Icon: Globe, blurb: "Full control panel" },
        { label: "File manager", Icon: FolderOpen, blurb: "Browse and edit" },
        { label: "Databases", Icon: Database, blurb: "MySQL & phpMyAdmin" },
        { label: "Email", Icon: Mail, blurb: "Mailboxes & forwarders" },
      ];

  return (
    <div className="mx-auto max-w-[1180px] space-y-6">
      <Link
        href="/dashboard/services"
        className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-content-muted transition-colors hover:text-content"
      >
        <ArrowLeft className="size-4" />
        All services
      </Link>

      <PageHeader
        title={service.label}
        lede={`${service.planName} · ${service.termLabel} · ${service.datacentre}`}
        actions={
          <>
            <Button
              variant="outline"
              size="md"
              onClick={() => toast.success("Password reset link sent to your email")}
            >
              <KeyRound />
              Reset password
            </Button>
            <Button
              variant="accent"
              size="md"
              onClick={() =>
                toast.info(
                  isVps ? "Opening console…" : "Opening cPanel in a new tab…",
                )
              }
            >
              {isVps ? "Open console" : "Open cPanel"}
              <ExternalLink />
            </Button>
          </>
        }
      />

      {/* Quick tools */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map(({ label, Icon, blurb }) => (
          <button
            key={label}
            type="button"
            onClick={() => toast.info(`${label} — available once the API is wired up`)}
            className="flex items-center gap-3 rounded-[13px] border border-line bg-surface p-4 text-left transition-[border-color,box-shadow] hover:border-line-strong hover:shadow-[0_10px_24px_-18px_rgba(20,20,31,0.35)]"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-brand-500/10 text-brand-600 dark:text-brand-400">
              <Icon className="size-[18px]" />
            </span>
            <span className="min-w-0">
              <span className="block text-[13.5px] font-semibold text-content">
                {label}
              </span>
              <span className="block truncate text-[12px] text-content-subtle">
                {blurb}
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          {/* Usage */}
          <Panel>
            <PanelHeader
              title="Resource usage"
              action={
                <span className="font-mono text-[11.5px] text-content-subtle">
                  updated 4 min ago
                </span>
              }
            />
            <div className="grid gap-5 p-5 sm:grid-cols-2">
              {service.usage.map((metric) => (
                <UsageBar key={metric.label} {...metric} />
              ))}
            </div>
          </Panel>

          {/* Specs (VPS) */}
          {service.specs && (
            <Panel>
              <PanelHeader title="Server specification" />
              <dl className="grid gap-x-8 px-5 py-2 sm:grid-cols-2">
                {service.specs.map((spec) => (
                  <div key={spec.label} className="border-b border-line last:border-0">
                    <DefRow label={spec.label} mono>
                      {spec.value}
                    </DefRow>
                  </div>
                ))}
              </dl>
            </Panel>
          )}

          {/* Connection */}
          <Panel>
            <PanelHeader title="Connection details" />
            <dl className="divide-y divide-line px-5 py-1">
              <DefRow label={isVps ? "SSH user" : "cPanel username"} mono>
                {service.username}
              </DefRow>
              <DefRow label="IP address" mono>
                {service.ipAddress}
              </DefRow>
              <DefRow label="Nameservers" mono>
                <span className="block">{service.nameservers[0]}</span>
                <span className="block">{service.nameservers[1]}</span>
              </DefRow>
              <DefRow label="Datacentre">{service.datacentre}</DefRow>
              {!isVps && (
                <DefRow label="Control panel" mono>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-brand-600 hover:underline dark:text-brand-400"
                  >
                    {service.label}/cpanel
                  </a>
                </DefRow>
              )}
            </dl>
          </Panel>
        </div>

        {/* Billing rail */}
        <div className="space-y-6">
          <Panel>
            <PanelHeader title="Billing" />
            <div className="px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <StatusPill tone={days <= 30 ? "warn" : "ok"}>
                  {days <= 30 ? `Renews in ${days} days` : "Active"}
                </StatusPill>
                <StatusPill tone={service.autoRenew ? "ok" : "warn"} dot={false}>
                  Auto-renew {service.autoRenew ? "on" : "off"}
                </StatusPill>
              </div>

              <dl className="mt-4 divide-y divide-line border-t border-line pt-1">
                <DefRow label="Renewal amount" mono>
                  {inr(service.renewalAmount)} + GST
                </DefRow>
                <DefRow label="Renews on">{formatDate(service.renewsOn)}</DefRow>
                <DefRow label="Started">{formatDate(service.registeredOn)}</DefRow>
                <DefRow label="Term">{service.termLabel}</DefRow>
              </dl>

              <div className="mt-4 space-y-2.5">
                <Button
                  variant={service.autoRenew ? "outline" : "accent"}
                  size="md"
                  block
                  onClick={() =>
                    toast.success(
                      service.autoRenew
                        ? "Auto-renew turned off"
                        : "Auto-renew turned on",
                    )
                  }
                >
                  <RefreshCw />
                  Turn auto-renew {service.autoRenew ? "off" : "on"}
                </Button>
                <ButtonLink
                  href="/dashboard/billing"
                  variant="outline"
                  size="md"
                  block
                >
                  View invoices
                </ButtonLink>
              </div>
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Need a bigger plan?" />
            <div className="px-5 py-4">
              <p className="text-[13.5px] leading-relaxed text-content-muted">
                Upgrades are prorated — you only pay the difference for the
                remainder of your term, and nothing goes offline during the
                move.
              </p>
              <ButtonLink
                href="/pricing"
                variant="outline"
                size="md"
                block
                className="mt-4"
              >
                <Server />
                Compare plans
              </ButtonLink>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
