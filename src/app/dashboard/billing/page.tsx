"use client";

import Link from "next/link";
import { Download, Receipt } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import {
  EmptyState,
  PageHeader,
  Panel,
  StatusPill,
} from "@/components/dashboard/ui";
import {
  daysUntil,
  invoices,
  outstandingTotal,
  type InvoiceStatus,
} from "@/lib/dashboard/mock-data";
import { formatDate, inr } from "@/lib/utils";

const statusTone: Record<InvoiceStatus, "ok" | "warn" | "down" | "muted"> = {
  paid: "ok",
  unpaid: "warn",
  overdue: "down",
  refunded: "muted",
};

const statusLabel: Record<InvoiceStatus, string> = {
  paid: "Paid",
  unpaid: "Unpaid",
  overdue: "Overdue",
  refunded: "Refunded",
};

export default function BillingPage() {
  const paidThisYear = invoices
    .filter((i) => i.status === "paid" && i.paidOn && i.paidOn >= "2026-04-01")
    .reduce((sum, i) => sum + i.total, 0);

  return (
    <div className="mx-auto max-w-[1180px] space-y-6">
      <PageHeader
        title="Invoices & billing"
        lede="Every invoice on your account, with GST breakdowns you can hand to your accountant."
      />

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Outstanding",
            value: outstandingTotal > 0 ? inr(outstandingTotal) : "—",
            sub:
              outstandingTotal > 0
                ? "Across 1 unpaid invoice"
                : "Nothing due right now",
            warn: outstandingTotal > 0,
          },
          {
            label: "Paid this financial year",
            value: inr(paidThisYear),
            sub: "Since 1 Apr 2026",
          },
          {
            label: "Billing contact",
            value: "GSTIN not set",
            sub: "Add one to claim input credit",
            warn: true,
          },
        ].map((tile) => (
          <Panel key={tile.label} className="p-5">
            <p className="text-[12.5px] text-content-subtle">{tile.label}</p>
            <p
              className={
                tile.warn
                  ? "mt-2 font-mono text-[22px] leading-none font-bold text-flag-600 tnum dark:text-flag-300"
                  : "mt-2 font-mono text-[22px] leading-none font-bold text-content tnum"
              }
            >
              {tile.value}
            </p>
            <p className="mt-2 text-[12.5px] text-content-muted">{tile.sub}</p>
          </Panel>
        ))}
      </div>

      {/* Invoice table */}
      <Panel className="overflow-hidden">
        {invoices.length === 0 ? (
          <EmptyState
            icon={<Receipt className="size-5" />}
            title="No invoices yet"
            body="Once you place your first order, every invoice will be listed here."
            action={
              <ButtonLink href="/pricing" variant="accent" size="md">
                Browse plans
              </ButtonLink>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-line text-[11.5px] tracking-wide text-content-subtle uppercase">
                  <th className="px-5 py-3 font-semibold">Invoice</th>
                  <th className="px-5 py-3 font-semibold">Issued</th>
                  <th className="px-5 py-3 font-semibold">Due</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Amount</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>

              <tbody className="divide-y divide-line">
                {invoices.map((invoice) => {
                  const due = invoice.status !== "paid";
                  const daysLeft = daysUntil(invoice.dueOn);

                  return (
                    <tr
                      key={invoice.id}
                      className="transition-colors hover:bg-surface-2"
                    >
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/dashboard/billing/${invoice.id}`}
                          className="font-mono text-[13.5px] font-semibold text-content hover:text-brand-600 dark:hover:text-brand-400"
                        >
                          {invoice.number}
                        </Link>
                        <p className="mt-0.5 max-w-[260px] truncate text-[12px] text-content-subtle">
                          {invoice.lines[0].description}
                          {invoice.lines.length > 1 &&
                            ` +${invoice.lines.length - 1} more`}
                        </p>
                      </td>

                      <td className="px-5 py-3.5 text-[13px] text-content-muted">
                        {formatDate(invoice.issuedOn)}
                      </td>

                      <td className="px-5 py-3.5 text-[13px] text-content-muted">
                        {formatDate(invoice.dueOn)}
                        {due && daysLeft >= 0 && (
                          <span className="block text-[11.5px] text-flag-600 dark:text-flag-300">
                            in {daysLeft} days
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3.5">
                        <StatusPill tone={statusTone[invoice.status]}>
                          {statusLabel[invoice.status]}
                        </StatusPill>
                      </td>

                      <td className="px-5 py-3.5 text-right font-mono text-[14px] font-semibold text-content tnum">
                        {inr(invoice.total)}
                      </td>

                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        {due ? (
                          <ButtonLink
                            href={`/dashboard/billing/${invoice.id}`}
                            variant="accent"
                            size="sm"
                          >
                            Pay now
                          </ButtonLink>
                        ) : (
                          <Link
                            href={`/dashboard/billing/${invoice.id}`}
                            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-600 hover:underline dark:text-brand-400"
                          >
                            <Download className="size-3.5" />
                            Invoice
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
