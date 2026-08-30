"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import {
  DefRow,
  Panel,
  PanelHeader,
  StatusPill,
} from "@/components/dashboard/ui";
import { getInvoice, type InvoiceStatus } from "@/lib/dashboard/mock-data";
import { site } from "@/config/site.config";
import { formatDate, inr } from "@/lib/utils";

const tone: Record<InvoiceStatus, "ok" | "warn" | "down" | "muted"> = {
  paid: "ok",
  unpaid: "warn",
  overdue: "down",
  refunded: "muted",
};

export default function InvoiceDetailPage() {
  const params = useParams<{ id: string }>();
  const invoice = getInvoice(params.id);

  if (!invoice) {
    return (
      <div className="mx-auto max-w-[900px]">
        <Panel className="p-10 text-center">
          <h1 className="text-[18px] font-bold text-content">
            Invoice not found
          </h1>
          <ButtonLink
            href="/dashboard/billing"
            variant="outline"
            size="md"
            className="mt-6"
          >
            Back to invoices
          </ButtonLink>
        </Panel>
      </div>
    );
  }

  const unpaid = invoice.status === "unpaid" || invoice.status === "overdue";

  return (
    <div className="mx-auto max-w-[900px] space-y-6">
      <Link
        href="/dashboard/billing"
        className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-content-muted transition-colors hover:text-content"
      >
        <ArrowLeft className="size-4" />
        All invoices
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-mono text-[22px] font-bold text-content">
              {invoice.number}
            </h1>
            <StatusPill tone={tone[invoice.status]}>
              {invoice.status === "paid"
                ? "Paid"
                : invoice.status === "overdue"
                  ? "Overdue"
                  : invoice.status === "refunded"
                    ? "Refunded"
                    : "Unpaid"}
            </StatusPill>
          </div>
          <p className="mt-1.5 text-[13.5px] text-content-muted">
            Issued {formatDate(invoice.issuedOn)} · Due{" "}
            {formatDate(invoice.dueOn)}
          </p>
        </div>

        <div className="flex shrink-0 gap-2.5">
          <Button
            variant="outline"
            size="md"
            onClick={() => window.print()}
          >
            <Printer />
            Print
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => toast.info("PDF export needs the billing API")}
          >
            <Download />
            PDF
          </Button>
          {unpaid && (
            <Button
              variant="accent"
              size="md"
              onClick={() => toast.success("Redirecting to payment…")}
            >
              Pay {inr(invoice.total)}
            </Button>
          )}
        </div>
      </div>

      {/* The invoice document */}
      <Panel className="overflow-hidden">
        <div className="grid gap-6 border-b border-line p-6 sm:grid-cols-2">
          <div>
            <p className="eyebrow text-content-subtle">From</p>
            <p className="mt-2 text-[14px] font-bold text-content">
              {site.legalName}
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-content-muted">
              {site.name}
              <br />
              {site.contact.email}
              <br />
              <span className="font-mono">{site.contact.phone}</span>
            </p>
          </div>

          <div className="sm:text-right">
            <p className="eyebrow text-content-subtle">Billed to</p>
            <p className="mt-2 text-[14px] font-bold text-content">
              Demo Customer
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-content-muted">
              12/3 MG Road, Sector 4<br />
              Kolkata, West Bengal 700001
              <br />
              India
            </p>
            <p className="mt-2 text-[12.5px] text-content-subtle">
              GSTIN: not provided
            </p>
          </div>
        </div>

        {/* Lines */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="border-b border-line text-[11.5px] tracking-wide text-content-subtle uppercase">
                <th className="px-6 py-3 font-semibold">Description</th>
                <th className="px-6 py-3 font-semibold">Period</th>
                <th className="px-6 py-3 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {invoice.lines.map((line) => (
                <tr key={line.description}>
                  <td className="px-6 py-4 text-[13.5px] font-medium text-content">
                    {line.description}
                  </td>
                  <td className="px-6 py-4 text-[12.5px] whitespace-nowrap text-content-muted">
                    {line.period}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-[13.5px] text-content tnum">
                    {line.amount === 0 ? (
                      <span className="font-semibold text-signal-ok">FREE</span>
                    ) : (
                      inr(line.amount)
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end border-t border-line bg-surface-2 p-6">
          <dl className="w-full max-w-[320px] space-y-2 text-[13.5px]">
            <div className="flex justify-between">
              <dt className="text-content-muted">Subtotal</dt>
              <dd className="font-mono text-content tnum">
                {inr(invoice.subtotal)}
              </dd>
            </div>

            {invoice.discount > 0 && (
              <div className="flex justify-between">
                <dt className="text-signal-ok">
                  Discount{invoice.promoCode && ` (${invoice.promoCode})`}
                </dt>
                <dd className="font-mono text-signal-ok tnum">
                  −{inr(invoice.discount)}
                </dd>
              </div>
            )}

            <div className="flex justify-between">
              <dt className="text-content-muted">IGST @ 18%</dt>
              <dd className="font-mono text-content tnum">{inr(invoice.gst)}</dd>
            </div>

            <div className="flex items-baseline justify-between border-t border-line pt-3">
              <dt className="text-[15px] font-bold text-content">Total</dt>
              <dd className="font-mono text-[20px] font-bold text-content tnum">
                {inr(invoice.total)}
              </dd>
            </div>
          </dl>
        </div>
      </Panel>

      {/* Payment record */}
      <Panel>
        <PanelHeader title="Payment" />
        <dl className="divide-y divide-line px-5 py-1">
          {invoice.status === "paid" ? (
            <>
              <DefRow label="Paid on">{formatDate(invoice.paidOn!)}</DefRow>
              <DefRow label="Method">{invoice.method}</DefRow>
              <DefRow label="Reference" mono>
                {invoice.transactionId}
              </DefRow>
            </>
          ) : (
            <>
              <DefRow label="Status">
                <span className="text-flag-600 dark:text-flag-300">
                  Awaiting payment
                </span>
              </DefRow>
              <DefRow label="Due date">{formatDate(invoice.dueOn)}</DefRow>
              <DefRow label="Late fee">None — we don&rsquo;t charge one</DefRow>
            </>
          )}
        </dl>

        {unpaid && (
          <div className="border-t border-line px-5 py-4">
            <p className="text-[13px] leading-relaxed text-content-muted">
              Services stay online for 7 days past the due date. After that
              they&rsquo;re suspended, not deleted — your data is kept for a
              further 30 days.
            </p>
          </div>
        )}
      </Panel>
    </div>
  );
}
