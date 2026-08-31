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
  UserRoundX,
} from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import {
  AddRecordButton,
  DNS_PROPAGATION_NOTE,
  DnsRecordsTable,
} from "@/components/dashboard/dns-records";
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
                      variant="ghost"
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
                    <ButtonLink
                      href={`/dashboard/domains/${domain.id}`}
                      variant="outline"
                      size="sm"
                    >
                      Manage
                    </ButtonLink>
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
        <AddRecordButton />
      </div>

      <DnsRecordsTable records={records} className="border-t border-line" />

      <p className="border-t border-line px-5 py-3 text-[12px] text-content-subtle">
        {DNS_PROPAGATION_NOTE}
      </p>
    </div>
  );
}
