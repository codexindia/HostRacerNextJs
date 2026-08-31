"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRightLeft,
  Check,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Lock,
  LockOpen,
  RefreshCw,
  TriangleAlert,
} from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AddRecordButton,
  DNS_PROPAGATION_NOTE,
  DnsRecordsTable,
} from "@/components/dashboard/dns-records";
import {
  DefRow,
  PageHeader,
  Panel,
  PanelHeader,
  StatusPill,
} from "@/components/dashboard/ui";
import { daysUntil, getDomain } from "@/lib/dashboard/mock-data";
import { cn, formatDate, inr } from "@/lib/utils";

const HOSTRACER_NS = ["ns1.hostracer.in", "ns2.hostracer.in"];

export default function DomainManagePage() {
  const params = useParams<{ id: string }>();
  const domain = getDomain(params.id);

  /* Local mirrors of the registrar flags. The real page will refetch after
     each call; until then optimistic state keeps the toggles honest. */
  const [locked, setLocked] = useState(domain?.locked ?? true);
  const [privacy, setPrivacy] = useState(domain?.privacy ?? true);
  const [autoRenew, setAutoRenew] = useState(domain?.autoRenew ?? true);

  if (!domain) {
    return (
      <div className="mx-auto max-w-[900px]">
        <Panel className="p-10 text-center">
          <h1 className="text-[18px] font-bold text-content">
            Domain not found
          </h1>
          <p className="mt-2 text-[13.5px] text-content-muted">
            That domain isn&rsquo;t on your account.
          </p>
          <ButtonLink
            href="/dashboard/domains"
            variant="outline"
            size="md"
            className="mt-6"
          >
            Back to domains
          </ButtonLink>
        </Panel>
      </div>
    );
  }

  const days = daysUntil(domain.expiresOn);
  const expiringSoon = days <= 30;
  const transferDays = daysUntil(domain.transferEligibleOn);

  return (
    <div className="mx-auto max-w-[1180px] space-y-6">
      <Link
        href="/dashboard/domains"
        className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-content-muted transition-colors hover:text-content"
      >
        <ArrowLeft className="size-4" />
        All domains
      </Link>

      <PageHeader
        title={domain.name}
        lede={`Registered ${formatDate(domain.registeredOn)} · ${domain.registrar}`}
        actions={
          <>
            <ButtonLink
              href={`https://${domain.name}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              size="md"
            >
              Visit
              <ExternalLink />
            </ButtonLink>
            <Button
              variant="accent"
              size="md"
              onClick={() => toast.success("Renewal invoice created — check Invoices")}
            >
              <RefreshCw />
              Renew now
            </Button>
          </>
        }
      />

      {expiringSoon && !autoRenew && (
        <div className="flex flex-col gap-3 rounded-[13px] border border-flag-400/45 bg-flag-400/10 px-5 py-4 sm:flex-row sm:items-center">
          <TriangleAlert className="size-5 shrink-0 text-flag-600 dark:text-flag-400" />
          <p className="flex-1 text-[13.5px] leading-relaxed text-content">
            This domain expires in {days} days and auto-renew is off. After it
            expires you get a 30-day grace period, then a redemption fee of{" "}
            {inr(6500)} applies before it drops.
          </p>
          <Button
            variant="accent"
            size="sm"
            className="shrink-0"
            onClick={() => {
              setAutoRenew(true);
              toast.success("Auto-renew turned on");
            }}
          >
            Turn on auto-renew
          </Button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <NameserverPanel current={domain.nameservers} />

          <Panel>
            <PanelHeader title="DNS records" action={<AddRecordButton />} />
            <DnsRecordsTable records={domain.records} />
            <p className="border-t border-line px-5 py-3 text-[12px] text-content-subtle">
              {DNS_PROPAGATION_NOTE}
            </p>
          </Panel>

          <Panel>
            <PanelHeader title="Transfer & security" />
            <div className="divide-y divide-line">
              <ToggleRow
                title="Registrar lock"
                body="Blocks transfer requests to another registrar. Leave it on unless you are moving the domain out."
                enabled={locked}
                onLabel={
                  <>
                    <Lock className="size-3" />
                    Locked
                  </>
                }
                offLabel={
                  <>
                    <LockOpen className="size-3" />
                    Unlocked
                  </>
                }
                onToggle={() => {
                  setLocked((v) => !v);
                  toast.success(
                    locked ? "Registrar lock removed" : "Registrar lock applied",
                  );
                }}
              />

              <ToggleRow
                title="WHOIS privacy"
                body="Replaces your name, address and phone number in the public WHOIS record with a forwarding address. Not available on .in domains."
                enabled={privacy}
                onLabel="Protected"
                offLabel="Public"
                disabled={domain.name.endsWith(".in")}
                onToggle={() => {
                  setPrivacy((v) => !v);
                  toast.success(
                    privacy ? "WHOIS privacy turned off" : "WHOIS privacy turned on",
                  );
                }}
              />

              <AuthCodeRow code={domain.authCode} />

              <div className="px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-semibold text-content">
                      DNSSEC
                    </p>
                    <p className="mt-1 max-w-lg text-[12.5px] leading-relaxed text-content-muted">
                      Signs your zone so resolvers can detect tampered answers.
                      Only turn it on if your DNS host publishes DS records.
                    </p>
                  </div>
                  <StatusPill tone={domain.dnssec ? "ok" : "muted"}>
                    {domain.dnssec ? "Enabled" : "Not enabled"}
                  </StatusPill>
                </div>
              </div>

              <div className="px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-semibold text-content">
                      Transfer away
                    </p>
                    <p className="mt-1 max-w-lg text-[12.5px] leading-relaxed text-content-muted">
                      {transferDays > 0
                        ? `Locked by the registry until ${formatDate(domain.transferEligibleOn)} — 60 days after registration or an inbound transfer.`
                        : `Eligible since ${formatDate(domain.transferEligibleOn)}. Unlock the domain, copy the auth code, then start the transfer at your new registrar.`}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={transferDays > 0}
                    onClick={() =>
                      toast.info("We'll email the transfer checklist shortly")
                    }
                  >
                    <ArrowRightLeft />
                    Start transfer
                  </Button>
                </div>
              </div>
            </div>
          </Panel>

          <Panel>
            <PanelHeader
              title="Registrant contact"
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast.info("Contact edits go through registry verification")
                  }
                >
                  Edit
                </Button>
              }
            />
            <dl className="divide-y divide-line px-5 py-1">
              <DefRow label="Name">{domain.registrant.name}</DefRow>
              {domain.registrant.organisation && (
                <DefRow label="Organisation">
                  {domain.registrant.organisation}
                </DefRow>
              )}
              <DefRow label="Email" mono>
                {domain.registrant.email}
              </DefRow>
              <DefRow label="Phone" mono>
                {domain.registrant.phone}
              </DefRow>
              <DefRow label="Address">
                <span className="block">{domain.registrant.address}</span>
                <span className="block">
                  {domain.registrant.city} {domain.registrant.postcode}
                </span>
                <span className="block">
                  {domain.registrant.state}, {domain.registrant.country}
                </span>
              </DefRow>
            </dl>
            <p className="border-t border-line px-5 py-3 text-[12px] leading-relaxed text-content-subtle">
              Changing the registrant name or email triggers a verification
              mail from the registry. Ignore it and the domain suspends after
              15 days, so click the link the same day.
            </p>
          </Panel>
        </div>

        {/* Registration rail */}
        <div className="space-y-6">
          <Panel>
            <PanelHeader title="Registration" />
            <div className="px-5 py-4">
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill tone={expiringSoon ? "warn" : "ok"}>
                  {expiringSoon ? `Expires in ${days} days` : "Active"}
                </StatusPill>
                <StatusPill tone={autoRenew ? "ok" : "warn"} dot={false}>
                  Auto-renew {autoRenew ? "on" : "off"}
                </StatusPill>
              </div>

              <dl className="mt-4 divide-y divide-line border-t border-line pt-1">
                <DefRow label="Registered">
                  {formatDate(domain.registeredOn)}
                </DefRow>
                <DefRow label="Expires">{formatDate(domain.expiresOn)}</DefRow>
                <DefRow label="Renewal price" mono>
                  {inr(domain.renewalAmount)} + GST
                </DefRow>
                <DefRow label="Domain ID" mono>
                  {domain.id.toUpperCase()}
                </DefRow>
              </dl>

              <div className="mt-4 space-y-2.5">
                <Button
                  variant={autoRenew ? "outline" : "accent"}
                  size="md"
                  block
                  onClick={() => {
                    setAutoRenew((v) => !v);
                    toast.success(
                      autoRenew ? "Auto-renew turned off" : "Auto-renew turned on",
                    );
                  }}
                >
                  <RefreshCw />
                  Turn auto-renew {autoRenew ? "off" : "on"}
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
            <PanelHeader title="Point this domain somewhere" />
            <div className="space-y-3 px-5 py-4 text-[13px] leading-relaxed text-content-muted">
              <p>
                <span className="font-semibold text-content">
                  Hosting with us?
                </span>{" "}
                Leave the nameservers on Hostracer and add an A record for{" "}
                <span className="font-mono">@</span> pointing at your server IP.
              </p>
              <p>
                <span className="font-semibold text-content">
                  Using Cloudflare, Vercel or Shopify?
                </span>{" "}
                Switch to custom nameservers above — DNS then lives with them,
                and the records on this page stop being used.
              </p>
              <p>
                <span className="font-semibold text-content">
                  Just parking it?
                </span>{" "}
                Delete the A records and it resolves nowhere, which is tidier
                than pointing at a placeholder.
              </p>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Nameservers                                                         */
/* ------------------------------------------------------------------ */

function NameserverPanel({ current }: { current: string[] }) {
  const isDefault =
    current.length === HOSTRACER_NS.length &&
    current.every((ns, i) => ns === HOSTRACER_NS[i]);

  const [mode, setMode] = useState<"default" | "custom">(
    isDefault ? "default" : "custom",
  );
  // Four slots: the registry takes up to four, and two are usually blank.
  const [custom, setCustom] = useState<string[]>(() =>
    isDefault ? ["", "", "", ""] : [...current, "", "", "", ""].slice(0, 4),
  );

  const filled = custom.filter((ns) => ns.trim()).length;

  function save() {
    if (mode === "custom" && filled < 2) {
      toast.error("Enter at least two nameservers");
      return;
    }
    toast.success(
      mode === "default"
        ? "Switched back to Hostracer nameservers"
        : "Nameservers updated — allow up to 24 hours",
    );
  }

  return (
    <Panel>
      <PanelHeader
        title="Nameservers"
        action={
          <span className="text-[12px] text-content-subtle">
            {mode === "default" ? "Hostracer DNS" : "External DNS"}
          </span>
        }
      />

      <div className="space-y-3 p-5">
        <NsOption
          checked={mode === "default"}
          onSelect={() => setMode("default")}
          title="Use Hostracer nameservers"
          body="DNS is managed on this page. Right for anything hosted with us."
          detail={HOSTRACER_NS.join(" · ")}
        />

        <NsOption
          checked={mode === "custom"}
          onSelect={() => setMode("custom")}
          title="Use custom nameservers"
          body="For Cloudflare, Vercel, Google Workspace-managed DNS and the like."
        >
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {custom.map((ns, i) => (
              <Input
                key={i}
                value={ns}
                spellCheck={false}
                autoComplete="off"
                placeholder={
                  i < 2 ? `ns${i + 1}.example.com` : `ns${i + 1} (optional)`
                }
                aria-label={`Nameserver ${i + 1}`}
                onChange={(e) =>
                  setCustom((prev) =>
                    prev.map((v, idx) => (idx === i ? e.target.value : v)),
                  )
                }
                className="h-11 font-mono text-[13.5px]"
              />
            ))}
          </div>
        </NsOption>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3.5">
        <p className="text-[12px] text-content-subtle">
          Nameserver changes propagate for up to 24 hours. Mail keeps flowing as
          long as the new host has your MX records first.
        </p>
        <Button variant="primary" size="sm" onClick={save}>
          Save nameservers
        </Button>
      </div>
    </Panel>
  );
}

function NsOption({
  checked,
  onSelect,
  title,
  body,
  detail,
  children,
}: {
  checked: boolean;
  onSelect: () => void;
  title: string;
  body: string;
  detail?: string;
  children?: React.ReactNode;
}) {
  return (
    <label
      className={cn(
        "block cursor-pointer rounded-[12px] border p-4 transition-colors",
        checked
          ? "border-brand-500/60 bg-brand-500/[0.04]"
          : "border-line hover:border-line-strong",
      )}
    >
      <div className="flex items-start gap-3">
        <input
          type="radio"
          name="nameserver-mode"
          checked={checked}
          onChange={onSelect}
          className="mt-0.5 size-4 shrink-0 accent-brand-500"
        />
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-semibold text-content">{title}</p>
          <p className="mt-0.5 text-[12.5px] leading-relaxed text-content-muted">
            {body}
          </p>
          {detail && (
            <p className="mt-1.5 font-mono text-[12px] text-content-subtle">
              {detail}
            </p>
          )}
          {checked && children}
        </div>
      </div>
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* Rows                                                                */
/* ------------------------------------------------------------------ */

function ToggleRow({
  title,
  body,
  enabled,
  onLabel,
  offLabel,
  onToggle,
  disabled,
}: {
  title: string;
  body: string;
  enabled: boolean;
  onLabel: React.ReactNode;
  offLabel: React.ReactNode;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-[13.5px] font-semibold text-content">{title}</p>
          <StatusPill tone={enabled ? "ok" : "warn"} dot={false}>
            {enabled ? onLabel : offLabel}
          </StatusPill>
        </div>
        <p className="mt-1 max-w-lg text-[12.5px] leading-relaxed text-content-muted">
          {body}
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={onToggle}
        className="shrink-0"
      >
        {enabled ? "Turn off" : "Turn on"}
      </Button>
    </div>
  );
}

function AuthCodeRow({ code }: { code: string }) {
  const [shown, setShown] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard is blocked outside a secure context — reveal it instead.
      setShown(true);
      toast.info("Copy blocked by the browser — select the code manually");
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
      <div className="min-w-0">
        <p className="text-[13.5px] font-semibold text-content">
          Authorisation (EPP) code
        </p>
        <p className="mt-1 max-w-lg text-[12.5px] leading-relaxed text-content-muted">
          The password another registrar needs to pull this domain. Treat it
          like a password — anyone with it and an unlocked domain can move it.
        </p>
        <p className="mt-2 font-mono text-[13.5px] tracking-[0.06em] text-content">
          {shown ? code : "•".repeat(code.length)}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button variant="outline" size="sm" onClick={() => setShown((v) => !v)}>
          {shown ? <EyeOff /> : <Eye />}
          {shown ? "Hide" : "Reveal"}
        </Button>
        <Button variant="outline" size="sm" onClick={copy}>
          {copied ? <Check /> : <Copy />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
    </div>
  );
}
