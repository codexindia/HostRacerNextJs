"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Panel, StatusPill } from "@/components/dashboard/ui";
import {
  getTicket,
  type TicketMessage,
  type TicketStatus,
} from "@/lib/dashboard/mock-data";
import { useAuth } from "@/lib/auth/store";
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

const stamp = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));

export default function TicketThreadPage() {
  const params = useParams<{ id: string }>();
  const user = useAuth((s) => s.user);
  const ticket = getTicket(params.id);

  // Replies added this session live here; the seed thread stays untouched.
  const [replies, setReplies] = useState<TicketMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  if (!ticket) {
    return (
      <div className="mx-auto max-w-[900px]">
        <Panel className="p-10 text-center">
          <h1 className="text-[18px] font-bold text-content">
            Ticket not found
          </h1>
          <ButtonLink
            href="/dashboard/tickets"
            variant="outline"
            size="md"
            className="mt-6"
          >
            Back to tickets
          </ButtonLink>
        </Panel>
      </div>
    );
  }

  const messages = [...ticket.messages, ...replies];
  const closed = ticket.status === "closed";

  async function send() {
    const body = draft.trim();
    if (!body || sending) return;

    setSending(true);
    await new Promise((r) => setTimeout(r, 700));

    setReplies((prev) => [
      ...prev,
      {
        id: `local-${prev.length}`,
        author: user?.fullName ?? "You",
        fromStaff: false,
        sentAt: new Date().toISOString(),
        body,
      },
    ]);
    setDraft("");
    setSending(false);
    toast.success("Reply sent — we usually respond within an hour");
  }

  return (
    <div className="mx-auto max-w-[900px] space-y-6">
      <Link
        href="/dashboard/tickets"
        className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-content-muted transition-colors hover:text-content"
      >
        <ArrowLeft className="size-4" />
        All tickets
      </Link>

      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-mono text-[13px] font-semibold text-content-subtle">
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

        <h1 className="mt-2 text-[22px] leading-tight font-bold text-content">
          {ticket.subject}
        </h1>

        <p className="mt-1.5 text-[13px] text-content-muted">
          {ticket.department} · opened {stamp(ticket.openedOn)}
          {ticket.relatedTo && (
            <>
              {" · "}
              <span className="font-mono">{ticket.relatedTo}</span>
            </>
          )}
        </p>
      </div>

      {/* Thread */}
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "rounded-[14px] border p-5",
              message.fromStaff
                ? "border-brand-200 bg-brand-50/50 dark:border-brand-500/25 dark:bg-brand-500/8"
                : "border-line bg-surface",
            )}
          >
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-full font-display text-[12px] font-bold text-white",
                  message.fromStaff
                    ? "bg-gradient-racer"
                    : "bg-ink-800 dark:bg-ink-700",
                )}
              >
                {message.author
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")}
              </span>

              <span className="text-[13.5px] font-semibold text-content">
                {message.author}
              </span>

              {message.fromStaff && (
                <StatusPill tone="brand" dot={false}>
                  Hostracer team
                </StatusPill>
              )}

              <span className="ml-auto font-mono text-[11.5px] text-content-subtle">
                {stamp(message.sentAt)}
              </span>
            </div>

            <div className="mt-3.5 space-y-3 text-[14px] leading-relaxed text-content-muted">
              {message.body.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Reply */}
      {closed ? (
        <Panel className="p-5 text-center">
          <p className="text-[13.5px] text-content-muted">
            This ticket is closed. If the same issue comes back, reply here and
            it&rsquo;ll reopen automatically.
          </p>
          <Button
            variant="outline"
            size="md"
            className="mt-4"
            onClick={() => toast.info("Ticket reopened")}
          >
            Reopen ticket
          </Button>
        </Panel>
      ) : (
        <Panel className="p-5">
          <label
            htmlFor="reply"
            className="block text-[13.5px] font-semibold text-content"
          >
            Add a reply
          </label>

          <textarea
            id="reply"
            rows={5}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type your message…"
            className="mt-2 w-full resize-y rounded-[10px] border border-line-strong bg-surface px-3.5 py-3 text-[14px] leading-relaxed text-content placeholder:text-content-subtle focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 focus:outline-none"
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[12px] text-content-subtle">
              Average first reply: under 20 minutes.
            </p>
            <Button
              variant="accent"
              size="md"
              onClick={send}
              disabled={sending || !draft.trim()}
            >
              {sending ? (
                <>
                  <Loader2 className="animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send />
                  Send reply
                </>
              )}
            </Button>
          </div>
        </Panel>
      )}
    </div>
  );
}
