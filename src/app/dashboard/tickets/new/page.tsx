"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Paperclip, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/input";
import { PageHeader, Panel } from "@/components/dashboard/ui";
import { services } from "@/lib/dashboard/mock-data";
import { cn } from "@/lib/utils";

const departments = [
  { id: "technical", label: "Technical", blurb: "Something isn't working" },
  { id: "billing", label: "Billing", blurb: "Invoices, refunds, GST" },
  { id: "sales", label: "Sales", blurb: "Upgrades and new services" },
] as const;

const priorities = [
  { id: "low", label: "Low", blurb: "Whenever you get a chance" },
  { id: "normal", label: "Normal", blurb: "Within a few hours" },
  { id: "high", label: "High", blurb: "Site down or urgent" },
] as const;

export default function NewTicketPage() {
  const router = useRouter();

  const [department, setDepartment] =
    useState<(typeof departments)[number]["id"]>("technical");
  const [priority, setPriority] =
    useState<(typeof priorities)[number]["id"]>("normal");
  const [related, setRelated] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const canSend = subject.trim().length >= 5 && body.trim().length >= 20;

  async function submit() {
    if (!canSend || sending) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 900));
    setSending(false);
    toast.success("Ticket opened — we'll reply by email and here");
    router.push("/dashboard/tickets");
  }

  return (
    <div className="mx-auto max-w-[760px] space-y-6">
      <Link
        href="/dashboard/tickets"
        className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-content-muted transition-colors hover:text-content"
      >
        <ArrowLeft className="size-4" />
        All tickets
      </Link>

      <PageHeader
        title="Open a ticket"
        lede="Tell us what's happening and we'll pick it up — usually within 20 minutes."
      />

      <Panel className="space-y-5 p-5">
        {/* Department */}
        <div>
          <p className="text-[13px] font-semibold text-content">Department</p>
          <div className="mt-2 grid gap-2.5 sm:grid-cols-3">
            {departments.map((dept) => (
              <button
                key={dept.id}
                type="button"
                onClick={() => setDepartment(dept.id)}
                aria-pressed={department === dept.id}
                className={cn(
                  "rounded-[11px] border p-3.5 text-left transition-all duration-200",
                  department === dept.id
                    ? "border-brand-500 bg-brand-50/60 ring-4 ring-brand-500/12 dark:bg-brand-500/8"
                    : "border-line-strong bg-surface hover:border-ink-400",
                )}
              >
                <span className="block text-[13.5px] font-semibold text-content">
                  {dept.label}
                </span>
                <span className="mt-0.5 block text-[12px] text-content-muted">
                  {dept.blurb}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Related service */}
        <Field
          label="Related service (optional)"
          hint="Pointing us at the right service saves a round trip."
        >
          {({ id }) => (
            <select
              id={id}
              value={related}
              onChange={(e) => setRelated(e.target.value)}
              className="h-12 w-full rounded-[10px] border border-line-strong bg-surface px-3.5 text-[15px] text-content focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 focus:outline-none"
            >
              <option value="">Not specific to one service</option>
              {services.map((service) => (
                <option key={service.id} value={service.label}>
                  {service.label} — {service.planName}
                </option>
              ))}
            </select>
          )}
        </Field>

        {/* Priority */}
        <div>
          <p className="text-[13px] font-semibold text-content">Priority</p>
          <div className="mt-2 grid gap-2.5 sm:grid-cols-3">
            {priorities.map((level) => (
              <button
                key={level.id}
                type="button"
                onClick={() => setPriority(level.id)}
                aria-pressed={priority === level.id}
                className={cn(
                  "rounded-[11px] border p-3.5 text-left transition-all duration-200",
                  priority === level.id
                    ? "border-brand-500 bg-brand-50/60 ring-4 ring-brand-500/12 dark:bg-brand-500/8"
                    : "border-line-strong bg-surface hover:border-ink-400",
                )}
              >
                <span className="block text-[13.5px] font-semibold text-content">
                  {level.label}
                </span>
                <span className="mt-0.5 block text-[12px] text-content-muted">
                  {level.blurb}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Subject */}
        <Field label="Subject">
          {({ id }) => (
            <input
              id={id}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Short summary of the problem"
              className="h-12 w-full rounded-[10px] border border-line-strong bg-surface px-3.5 text-[15px] text-content placeholder:text-content-subtle focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 focus:outline-none"
            />
          )}
        </Field>

        {/* Message */}
        <Field
          label="What's happening?"
          hint="Error messages, the page it happens on, and when it started all help."
        >
          {({ id }) => (
            <textarea
              id={id}
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Describe the issue in as much detail as you can…"
              className="w-full resize-y rounded-[10px] border border-line-strong bg-surface px-3.5 py-3 text-[14px] leading-relaxed text-content placeholder:text-content-subtle focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 focus:outline-none"
            />
          )}
        </Field>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
          <button
            type="button"
            onClick={() => toast.info("Attachments need the storage API")}
            className="flex items-center gap-1.5 text-[13px] font-medium text-content-muted transition-colors hover:text-content"
          >
            <Paperclip className="size-4" />
            Attach a file
          </button>

          <Button
            variant="accent"
            size="lg"
            onClick={submit}
            disabled={!canSend || sending}
          >
            {sending ? (
              <>
                <Loader2 className="animate-spin" />
                Opening ticket…
              </>
            ) : (
              <>
                <Send />
                Open ticket
              </>
            )}
          </Button>
        </div>
      </Panel>
    </div>
  );
}
