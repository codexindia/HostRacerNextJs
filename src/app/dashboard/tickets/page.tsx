"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, LifeBuoy, MessageSquarePlus } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import {
  EmptyState,
  PageHeader,
  Panel,
  StatusPill,
} from "@/components/dashboard/ui";
import { tickets, type TicketStatus } from "@/lib/dashboard/mock-data";
import { cn } from "@/lib/utils";

const statusTone: Record<TicketStatus, "ok" | "warn" | "brand" | "muted"> = {
  open: "brand",
  "awaiting-reply": "warn",
  answered: "ok",
  closed: "muted",
};

const statusLabel: Record<TicketStatus, string> = {
  open: "Open",
  "awaiting-reply": "Awaiting our reply",
  answered: "Answered",
  closed: "Closed",
};

const filters = ["All", "Open", "Closed"] as const;

function relative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days > 30) return `${Math.floor(days / 30)} mo ago`;
  if (days > 0) return `${days}d ago`;
  const hours = Math.floor(diff / 3_600_000);
  if (hours > 0) return `${hours}h ago`;
  return "just now";
}

export default function TicketsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const visible = tickets.filter((t) =>
    filter === "All"
      ? true
      : filter === "Open"
        ? t.status !== "closed"
        : t.status === "closed",
  );

  return (
    <div className="mx-auto max-w-[1180px] space-y-6">
      <PageHeader
        title="Support tickets"
        lede="Our team is in India and answers 24×7 — no bots, no overnight silence."
        actions={
          <ButtonLink href="/dashboard/tickets/new" variant="accent" size="md">
            <MessageSquarePlus />
            Open a ticket
          </ButtonLink>
        }
      />

      <div className="flex gap-1 rounded-[11px] border border-line bg-surface-2 p-1.5 sm:w-fit">
        {filters.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            className={cn(
              "flex-1 rounded-[8px] px-4 py-2 text-[13.5px] font-semibold transition-all duration-200 sm:flex-none",
              filter === option
                ? "bg-surface text-content shadow-[0_1px_3px_rgba(20,20,31,0.12)]"
                : "text-content-muted hover:text-content",
            )}
          >
            {option}
          </button>
        ))}
      </div>

      <Panel className="overflow-hidden">
        {visible.length === 0 ? (
          <EmptyState
            icon={<LifeBuoy className="size-5" />}
            title={filter === "Closed" ? "No closed tickets" : "No open tickets"}
            body="When you need a hand, open a ticket and someone from the team will pick it up."
            action={
              <ButtonLink
                href="/dashboard/tickets/new"
                variant="accent"
                size="md"
              >
                Open a ticket
              </ButtonLink>
            }
          />
        ) : (
          <ul className="divide-y divide-line">
            {visible.map((ticket) => {
              const last = ticket.messages[ticket.messages.length - 1];

              return (
                <li key={ticket.id}>
                  <Link
                    href={`/dashboard/tickets/${ticket.id}`}
                    className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-surface-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[12.5px] font-semibold text-content-subtle">
                          {ticket.number}
                        </span>
                        <StatusPill tone={statusTone[ticket.status]}>
                          {statusLabel[ticket.status]}
                        </StatusPill>
                        {ticket.priority === "high" && (
                          <StatusPill tone="down" dot={false}>
                            High priority
                          </StatusPill>
                        )}
                      </div>

                      <p className="mt-1.5 text-[14.5px] font-semibold text-content">
                        {ticket.subject}
                      </p>

                      <p className="mt-1 line-clamp-1 text-[13px] text-content-muted">
                        <span className="font-medium">
                          {last.fromStaff ? last.author.split(" —")[0] : "You"}:
                        </span>{" "}
                        {last.body.split("\n")[0]}
                      </p>

                      <p className="mt-1.5 text-[12px] text-content-subtle">
                        {ticket.department} · {ticket.messages.length} messages ·
                        updated {relative(ticket.updatedOn)}
                        {ticket.relatedTo && (
                          <>
                            {" · "}
                            <span className="font-mono">{ticket.relatedTo}</span>
                          </>
                        )}
                      </p>
                    </div>

                    <ChevronRight className="mt-1 size-4 shrink-0 text-content-subtle" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </div>
  );
}
