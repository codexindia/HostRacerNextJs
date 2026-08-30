"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  ChevronDown,
  Globe,
  Lock,
  LockOpen,
  Plus,
  RefreshCw,
  Trash2,
  UserRoundX,
} from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import {
  EmptyState,
  PageHeader,
  Panel,
  StatusPill,
} from "@/components/dashboard/ui";
import { daysUntil, domains, type DnsRecord } from "@/lib/dashboard/mock-data";
import { cn, formatDate, inr } from "@/lib/utils";

export default function DomainsPage() {
  const [expanded, setExpanded] = useState<string | null>(domains[0]?.id ?? null);

  return (
    <div className="mx-auto max-w-[1180px] space-y-6">
      <PageHeader
        title="Domains"
        lede="Renewals, DNS records, transfer locks and privacy — all in one place."
        actions={
          <ButtonLink href="/domains" variant="accent" size="md">
            <Plus />
            Register a domain
          </ButtonLink>
        }
      />

      {domains.length === 0 ? (
        <Panel>
          <EmptyState
            icon={<Globe className="size-5" />}
            title="No domains yet"
            body="Register a new domain or transfer one in, and it'll appear here with full DNS control."
            action={
              <ButtonLink href="/domains" variant="accent" size="md">
                Search for a domain
              </ButtonLink>
            }
          />
        </Panel>
      ) : (
        <div className="space-y-4">
          {domains.map((domain) => {
            const days = daysUntil(domain.expiresOn);
            const soon = days <= 30;
            const open = expanded === domain.id;

            return (
              <Panel key={domain.id} className="overflow-hidden">
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                  <span className="grid size-11 shrink-0 place-items-center rounded-[11px] border border-line bg-canvas text-content-muted">
                    <Globe className="size-5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate font-mono text-[16px] font-bold text-content">
                        {domain.name}
                      </h2>
                      <StatusPill tone={soon ? "warn" : "ok"}>
                        {soon ? `Expires in ${days} days` : "Active"}
                      </StatusPill>
                      {domain.locked ? (
                        <StatusPill tone="muted" dot={false}>
                          <Lock className="size-3" />
                          Locked
                        </StatusPill>
                      ) : (
                        <StatusPill tone="warn" dot={false}>
                          <LockOpen className="size-3" />
                          Unlocked
                        </StatusPill>
                      )}
                      {!domain.privacy && (
                        <StatusPill tone="warn" dot={false}>
                          <UserRoundX className="size-3" />
                          WHOIS public
                        </StatusPill>
                      )}
                    </div>
                    <p className="mt-1 text-[13px] text-content-muted">
                      Registered {formatDate(domain.registeredOn)} · Expires{" "}
                      {formatDate(domain.expiresOn)} · Renews at{" "}
                      <span className="font-mono">{inr(domain.renewalAmount)}</span>
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2.5">
                    {!domain.autoRenew && (
                      <Button
                        variant="accent"
                        size="sm"
                        onClick={() => toast.success("Auto-renew turned on")}
                      >
                        <RefreshCw />
                        Enable auto-renew
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExpanded(open ? null : domain.id)}
                      aria-expanded={open}
                    >
                      DNS
                      <ChevronDown
                        className={cn(
                          "transition-transform duration-200",
                          open && "rotate-180",
                        )}
                      />
                    </Button>
                  </div>
                </div>

                {open && (
                  <DnsPanel
                    records={domain.records}
                    nameservers={domain.nameservers}
                  />
                )}
              </Panel>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* DNS records                                                         */
/* ------------------------------------------------------------------ */

function DnsPanel({
  records,
  nameservers,
}: {
  records: DnsRecord[];
  nameservers: string[];
}) {
  return (
    <div className="border-t border-line bg-surface-2">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
        <div>
          <p className="text-[13.5px] font-bold text-content">DNS records</p>
          <p className="mt-0.5 font-mono text-[12px] text-content-subtle">
            {nameservers.join(" · ")}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.info("Record editor arrives with the DNS API")}
        >
          <Plus />
          Add record
        </Button>
      </div>

      <div className="overflow-x-auto border-t border-line">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-line text-[11.5px] tracking-wide text-content-subtle uppercase">
              <th className="px-5 py-2.5 font-semibold">Type</th>
              <th className="px-5 py-2.5 font-semibold">Host</th>
              <th className="px-5 py-2.5 font-semibold">Value</th>
              <th className="px-5 py-2.5 font-semibold">TTL</th>
              <th className="px-5 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {records.map((record) => (
              <tr key={record.id} className="group">
                <td className="px-5 py-3">
                  <span className="inline-flex rounded-[6px] bg-surface px-2 py-0.5 font-mono text-[11.5px] font-bold text-content">
                    {record.type}
                  </span>
                </td>
                <td className="px-5 py-3 font-mono text-[13px] text-content">
                  {record.host}
                </td>
                <td className="max-w-[280px] truncate px-5 py-3 font-mono text-[13px] text-content-muted">
                  {record.priority !== undefined && (
                    <span className="mr-2 text-content-subtle">
                      [{record.priority}]
                    </span>
                  )}
                  {record.value}
                </td>
                <td className="px-5 py-3 font-mono text-[13px] text-content-subtle tnum">
                  {record.ttl.toLocaleString("en-IN")}
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    type="button"
                    aria-label={`Delete ${record.type} record for ${record.host}`}
                    onClick={() => toast.info("Deleting records needs the DNS API")}
                    className="text-content-subtle opacity-0 transition-opacity group-hover:opacity-100 hover:text-signal-down focus-visible:opacity-100"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="border-t border-line px-5 py-3 text-[12px] text-content-subtle">
        DNS changes usually take effect within 15 minutes, though some networks
        cache for up to 24 hours.
      </p>
    </div>
  );
}
