"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Copy, Wallet } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import {
  DefRow,
  PageHeader,
  Panel,
  PanelHeader,
  StatusPill,
} from "@/components/dashboard/ui";
import {
  affiliate,
  availableCommission,
  commissionRates,
  conversionRate,
  daysUntil,
  lifetimeCommission,
  payouts,
  pendingCommission,
  referrals,
  type ReferralStatus,
} from "@/lib/dashboard/mock-data";
import { site } from "@/config/site.config";
import { cn, formatDate, inr } from "@/lib/utils";

const referralUrl = `${site.url}/?ref=${affiliate.code}`;

const statusTone: Record<
  ReferralStatus,
  { tone: "ok" | "warn" | "muted" | "down"; label: string }
> = {
  pending: { tone: "warn", label: "On hold" },
  approved: { tone: "ok", label: "Cleared" },
  paid: { tone: "muted", label: "Paid out" },
  reversed: { tone: "down", label: "Reversed" },
};

export default function AffiliatesPage() {
  const canRequest = availableCommission >= affiliate.minPayout;
  const shortBy = affiliate.minPayout - availableCommission;

  return (
    <div className="mx-auto max-w-[1180px] space-y-6">
      <PageHeader
        title="Refer &amp; earn"
        lede={`Affiliate since ${formatDate(affiliate.joinedOn)} · code ${affiliate.code}`}
        actions={
          <Button
            variant="accent"
            size="md"
            disabled={!canRequest}
            onClick={() => toast.success("Payout requested — paid within 3 working days")}
          >
            <Wallet />
            Request payout
          </Button>
        }
      />

      <ReferralLinkPanel />

      {/* Balances. Three numbers that mean different things, so they say so. */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Balance
          label="On hold"
          amount={pendingCommission}
          note={`Clears ${affiliate.holdDays} days after each order`}
        />
        <Balance
          label="Available"
          amount={availableCommission}
          note={
            canRequest
              ? "Ready to withdraw"
              : `${inr(shortBy)} short of the ${inr(affiliate.minPayout)} minimum`
          }
          emphasis
        />
        <Balance
          label="Paid to date"
          amount={lifetimeCommission}
          note={`${referrals.length} referrals · ${conversionRate.toFixed(1)}% of clicks`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Panel>
            <PanelHeader
              title="Referrals"
              action={
                <span className="text-[12px] text-content-subtle">
                  {affiliate.clicks.last30.toLocaleString("en-IN")} clicks in 30
                  days
                </span>
              }
            />

            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left">
                <thead>
                  <tr className="border-b border-line text-[11.5px] tracking-wide text-content-subtle uppercase">
                    <th className="px-5 py-2.5 font-semibold">Customer</th>
                    <th className="px-5 py-2.5 font-semibold">Signed up</th>
                    <th className="px-5 py-2.5 font-semibold">Order</th>
                    <th className="px-5 py-2.5 text-right font-semibold">
                      Commission
                    </th>
                    <th className="px-5 py-2.5 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {referrals.map((referral) => {
                    const { tone, label } = statusTone[referral.status];
                    const holdDays = referral.clearsOn
                      ? daysUntil(referral.clearsOn)
                      : 0;

                    return (
                      <tr key={referral.id}>
                        <td className="px-5 py-3.5 font-mono text-[13px] text-content">
                          {referral.customer}
                        </td>
                        <td className="px-5 py-3.5 text-[13px] whitespace-nowrap text-content-muted">
                          {formatDate(referral.signedUpOn)}
                        </td>
                        <td className="px-5 py-3.5 text-[13px] text-content-muted">
                          {referral.product}
                          <span className="mt-0.5 block font-mono text-[12px] text-content-subtle">
                            {inr(referral.orderValue)}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono text-[13.5px] font-semibold text-content tnum">
                          {referral.status === "reversed" ? (
                            <span className="text-content-subtle line-through">
                              {inr(referral.commission)}
                            </span>
                          ) : (
                            inr(referral.commission)
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusPill tone={tone}>{label}</StatusPill>
                          {referral.status === "pending" && holdDays > 0 && (
                            <span className="mt-1 block text-[11.5px] text-content-subtle">
                              {holdDays} days left
                            </span>
                          )}
                          {referral.note && (
                            <span className="mt-1 block text-[11.5px] text-content-subtle">
                              {referral.note}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="border-t border-line px-5 py-3 text-[12px] leading-relaxed text-content-subtle">
              Emails are masked. We share enough to let you recognise your own
              leads, not enough to contact someone who signed up through you.
            </p>
          </Panel>

          <Panel>
            <PanelHeader title="Payout history" />
            {payouts.length === 0 ? (
              <p className="px-5 py-8 text-center text-[13.5px] text-content-muted">
                No payouts yet.
              </p>
            ) : (
              <div className="divide-y divide-line">
                {payouts.map((payout) => (
                  <div
                    key={payout.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-[13.5px] font-semibold text-content">
                        {inr(payout.amount)}
                      </p>
                      <p className="mt-0.5 text-[12.5px] text-content-muted">
                        {payout.method}
                        {payout.reference && (
                          <span className="text-content-subtle">
                            {" · "}
                            {payout.reference}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <StatusPill tone={payout.status === "paid" ? "ok" : "warn"}>
                        {payout.status === "paid" ? "Paid" : "Processing"}
                      </StatusPill>
                      <p className="mt-1 text-[12px] text-content-subtle">
                        {formatDate(payout.paidOn ?? payout.requestedOn)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel>
            <PanelHeader title="What you earn" />
            <dl className="divide-y divide-line px-5 py-1">
              {commissionRates.map((row) => (
                <DefRow key={row.product} label={row.product}>
                  {row.rate}
                </DefRow>
              ))}
            </dl>
            <p className="border-t border-line px-5 py-3 text-[12px] leading-relaxed text-content-subtle">
              Commission is worked out on the ex-GST order value. Upgrades
              inside the first 30 days top up the original commission rather
              than counting as a new referral.
            </p>
          </Panel>

          <Panel>
            <PanelHeader title="The rules, briefly" />
            <ul className="space-y-3 px-5 py-4 text-[13px] leading-relaxed text-content-muted">
              <li>
                The referral cookie lasts{" "}
                <span className="font-semibold text-content">
                  {affiliate.cookieDays} days
                </span>
                . Last link clicked wins.
              </li>
              <li>
                Commission is held for{" "}
                <span className="font-semibold text-content">
                  {affiliate.holdDays} days
                </span>{" "}
                so refunds can settle, then moves to Available.
              </li>
              <li>
                Minimum payout is{" "}
                <span className="font-semibold text-content">
                  {inr(affiliate.minPayout)}
                </span>
                , paid to {affiliate.payoutMethod} within 3 working days.
              </li>
              <li>
                Self-referrals, coupon sites and bidding on
                &ldquo;Hostracer&rdquo; in paid search don&rsquo;t earn
                commission.
              </li>
            </ul>
            <div className="border-t border-line px-5 py-3.5">
              <ButtonLink
                href="/dashboard/tickets/new"
                variant="outline"
                size="sm"
                block
              >
                Ask about the programme
              </ButtonLink>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Balance tile                                                        */
/* ------------------------------------------------------------------ */

function Balance({
  label,
  amount,
  note,
  emphasis,
}: {
  label: string;
  amount: number;
  note: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[13px] border bg-surface px-5 py-4",
        emphasis ? "border-brand-500/45" : "border-line",
      )}
    >
      <p className="text-[12.5px] text-content-muted">{label}</p>
      <p className="mt-1.5 font-mono text-[24px] leading-none font-bold text-content tnum">
        {inr(amount)}
      </p>
      <p className="mt-2 text-[12px] leading-relaxed text-content-subtle">
        {note}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Referral link                                                       */
/* ------------------------------------------------------------------ */

function ReferralLinkPanel() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.info("Copy blocked by the browser — select the link manually");
    }
  }

  return (
    <Panel className="p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <p className="text-[12.5px] font-semibold text-content-muted">
            Your referral link
          </p>
          <p className="mt-1 truncate font-mono text-[14px] text-content">
            {referralUrl}
          </p>
        </div>
        <Button
          variant="outline"
          size="md"
          onClick={copy}
          className="shrink-0 sm:w-[132px]"
        >
          {copied ? <Check /> : <Copy />}
          {copied ? "Copied" : "Copy link"}
        </Button>
      </div>
      <p className="mt-3 text-[12px] leading-relaxed text-content-subtle">
        Add <span className="font-mono">?ref={affiliate.code}</span> to any page
        on the site and it tracks the same — deep links to a plan or a specific
        blog post convert better than the homepage.
      </p>
    </Panel>
  );
}
