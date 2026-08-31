"use client";

import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DnsRecord } from "@/lib/dashboard/mock-data";
import { cn } from "@/lib/utils";

/**
 * The zone table. Lives here rather than on a page because both the domain
 * list (inline preview) and the manage page render it — one copy means the
 * record editor only has to be wired to the API once.
 */
export function DnsRecordsTable({
  records,
  className,
}: {
  records: DnsRecord[];
  className?: string;
}) {
  return (
    <div className={cn("overflow-x-auto", className)}>
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
  );
}

export function AddRecordButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => toast.info("Record editor arrives with the DNS API")}
    >
      <Plus />
      Add record
    </Button>
  );
}

/**
 * Worth saying on every screen that edits a zone: people change a record,
 * reload once, see the old site and open a ticket.
 */
export const DNS_PROPAGATION_NOTE =
  "DNS changes usually take effect within 15 minutes, though some networks cache for up to 24 hours.";
