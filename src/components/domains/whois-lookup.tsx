"use client";

import { useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  Building2,
  CalendarClock,
  Check,
  Copy,
  Globe,
  Loader2,
  Search,
  Server,
  ShieldCheck,
  ShieldOff,
  X,
} from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/primitives";
import {
  daysUntil,
  normaliseDomain,
  type WhoisOutcome,
  type WhoisRecord,
  type WhoisResult,
  type WhoisStatus,
} from "@/lib/domains/rdap";
import { cn, formatDate } from "@/lib/utils";

type State =
  | { phase: "idle" }
  | { phase: "loading"; domain: string }
  | { phase: "error"; domain: string; message: string }
  | { phase: "done"; result: WhoisResult };

function seed(outcome: WhoisOutcome | null): State {
  if (!outcome) return { phase: "idle" };
  return outcome.status === "error"
    ? { phase: "error", domain: outcome.domain, message: outcome.message }
    : { phase: "done", result: outcome };
}

export function WhoisLookup({
  initialQuery = "",
  /** Resolved on the server when the page was opened with ?domain=. */
  initialResult = null,
}: {
  initialQuery?: string;
  initialResult?: WhoisOutcome | null;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [state, setState] = useState<State>(() => seed(initialResult));
  const resultsRef = useRef<HTMLDivElement>(null);
  // A result from a stale lookup must not overwrite a newer one.
  const requestId = useRef(0);

  async function run(domain: string) {
    const id = ++requestId.current;

    // Keeps the URL shareable without re-rendering the page around us.
    window.history.replaceState(
      null,
      "",
      `/domains/whois?domain=${encodeURIComponent(domain)}`,
    );

    try {
      const res = await fetch(
        `/api/whois?domain=${encodeURIComponent(domain)}`,
        { headers: { Accept: "application/json" } },
      );
      const body = await res.json();
      if (id !== requestId.current) return;

      if (!res.ok) {
        setState({
          phase: "error",
          domain,
          message: body?.error ?? "That lookup failed. Try again in a moment.",
        });
        return;
      }

      setState({ phase: "done", result: body as WhoisResult });
    } catch {
      if (id !== requestId.current) return;
      setState({
        phase: "error",
        domain,
        message: "Could not reach the lookup service. Check your connection.",
      });
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault();

    const domain = normaliseDomain(query);
    if (!domain) {
      toast.error("Enter a full domain, like example.com");
      return;
    }

    setState({ phase: "loading", domain });
    resultsRef.current?.scrollIntoView({ block: "nearest" });
    void run(domain);
  }

  const busy = state.phase === "loading";

  return (
    <div>
      <form
        onSubmit={submit}
        className="flex flex-col gap-2 rounded-[14px] border border-line-strong bg-surface p-2 shadow-sm sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-content-subtle"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="example.com"
            aria-label="Domain to look up"
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            className="h-12 w-full bg-transparent pr-3 pl-11 text-[15px] text-content outline-none placeholder:text-content-subtle"
          />
        </div>
        <Button type="submit" variant="accent" size="md" disabled={busy}>
          {busy ? <Loader2 className="animate-spin" /> : <Search />}
          {busy ? "Looking up" : "Look up"}
        </Button>
      </form>

      <p className="mt-2.5 text-[12.5px] text-content-subtle">
        Type the whole name including the extension. We read the registry
        directly over RDAP — the protocol that replaced port-43 WHOIS — so what
        you see is what the registry publishes right now.
      </p>

      <div ref={resultsRef} aria-live="polite" className="mt-7">
        {state.phase === "loading" && <Skeleton domain={state.domain} />}

        {state.phase === "error" && (
          <div className="flex items-start gap-3 rounded-[14px] border border-signal-down/30 bg-signal-down/5 px-5 py-4">
            <AlertTriangle className="mt-0.5 size-[18px] shrink-0 text-signal-down" />
            <div>
              <p className="font-mono text-[14px] font-bold break-all text-content">
                {state.domain}
              </p>
              <p className="mt-1 text-[13.5px] text-content-muted">
                {state.message}
              </p>
            </div>
          </div>
        )}

        {state.phase === "done" &&
          (state.result.status === "available" ? (
            <Available domain={state.result.domain} />
          ) : (
            <Record record={state.result.record} raw={state.result.raw} />
          ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* States                                                              */
/* ------------------------------------------------------------------ */

function Skeleton({ domain }: { domain: string }) {
  return (
    <div className="rounded-[14px] border border-line bg-surface p-5">
      <p className="font-mono text-[15px] font-bold break-all text-content">
        {domain}
      </p>
      <p className="mt-1 flex items-center gap-2 text-[13px] text-content-subtle">
        <Loader2 className="size-3.5 animate-spin" />
        Asking the registry…
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-20 animate-pulse rounded bg-surface-2" />
            <div className="h-4 w-40 animate-pulse rounded bg-surface-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Available({ domain }: { domain: string }) {
  const sld = domain.slice(0, domain.indexOf("."));

  return (
    <div className="rounded-[14px] border border-signal-ok/30 bg-signal-ok/5 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-[13px] font-semibold text-signal-ok">
            <Check className="size-4" />
            Not registered
          </p>
          <p className="mt-1.5 font-mono text-[18px] font-bold break-all text-content">
            {domain}
          </p>
          <p className="mt-1.5 max-w-md text-[13.5px] leading-relaxed text-content-muted">
            The registry has no record of this name, so it is yours to take.
            Names go fast — a search is not a hold.
          </p>
        </div>
        <ButtonLink
          href={`/domains?q=${encodeURIComponent(sld)}`}
          variant="accent"
          size="md"
          className="shrink-0"
        >
          Register it
        </ButtonLink>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The record                                                          */
/* ------------------------------------------------------------------ */

function Record({ record, raw }: { record: WhoisRecord; raw: unknown }) {
  const expiryDays = record.expires ? daysUntil(record.expires) : null;

  return (
    <div className="overflow-hidden rounded-[14px] border border-line bg-surface">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line bg-surface-2 px-5 py-4">
        <div className="min-w-0">
          <p className="font-mono text-[18px] font-bold break-all text-content">
            {record.domain}
          </p>
          {record.unicodeName && (
            <p className="mt-0.5 text-[13px] text-content-muted">
              {record.unicodeName}
            </p>
          )}
          <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-content-muted">
            <Globe className="size-3.5 shrink-0" />
            Registered
            {record.registrar?.name ? ` with ${record.registrar.name}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {record.dnssec ? (
            <Badge variant="ok" size="sm">
              <ShieldCheck className="size-3.5" />
              DNSSEC on
            </Badge>
          ) : (
            <Badge variant="soft" size="sm">
              <ShieldOff className="size-3.5" />
              No DNSSEC
            </Badge>
          )}
        </div>
      </div>

      {/* Dates and registrar */}
      <dl className="grid gap-x-6 gap-y-5 px-5 py-5 sm:grid-cols-2 lg:grid-cols-4">
        <Fact
          icon={CalendarClock}
          label="Registered"
          value={record.registered ? formatDate(record.registered) : "—"}
        />
        <Fact
          icon={CalendarClock}
          label="Expires"
          value={record.expires ? formatDate(record.expires) : "—"}
          note={
            expiryDays === null
              ? undefined
              : expiryDays < 0
                ? `${Math.abs(expiryDays)} days ago`
                : `in ${expiryDays} days`
          }
          tone={
            expiryDays !== null && expiryDays < 0
              ? "down"
              : expiryDays !== null && expiryDays < 30
                ? "warn"
                : undefined
          }
        />
        <Fact
          icon={CalendarClock}
          label="Last changed"
          value={record.updated ? formatDate(record.updated) : "—"}
          note={
            record.transferred
              ? `transferred ${formatDate(record.transferred)}`
              : undefined
          }
        />
        <Fact
          icon={Building2}
          label="Registrar"
          value={record.registrar?.name ?? "—"}
          note={
            record.registrar?.ianaId
              ? `IANA ID ${record.registrar.ianaId}`
              : undefined
          }
          href={record.registrar?.url}
        />
      </dl>

      {/* Nameservers */}
      <Block title="Nameservers" icon={Server}>
        {record.nameservers.length ? (
          <ul className="flex flex-wrap gap-2">
            {record.nameservers.map((ns) => (
              <li
                key={ns}
                className="rounded-[8px] border border-line bg-surface-2 px-2.5 py-1.5 font-mono text-[12.5px] break-all text-content-muted"
              >
                {ns}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[13.5px] text-content-muted">
            None set. The domain is registered but resolves nowhere.
          </p>
        )}
      </Block>

      {/* Status codes */}
      {record.statuses.length > 0 && (
        <Block title="Registry status" icon={ShieldCheck}>
          <ul className="space-y-2.5">
            {record.statuses.map((status) => (
              <StatusRow key={status.code} status={status} />
            ))}
          </ul>
        </Block>
      )}

      {/* Contacts */}
      <Block title="Contacts" icon={Building2}>
        {record.contacts.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {record.contacts.map((contact) => (
              <div
                key={contact.role}
                className="rounded-[10px] border border-line bg-surface-2 px-4 py-3"
              >
                <p className="text-[11.5px] font-semibold tracking-wide text-content-subtle uppercase">
                  {contact.role}
                </p>
                <div className="mt-1.5 space-y-0.5 text-[13.5px] text-content-muted">
                  {contact.org && (
                    <p className="font-medium text-content">{contact.org}</p>
                  )}
                  {contact.name && contact.name !== contact.org && (
                    <p>{contact.name}</p>
                  )}
                  {contact.address && <p>{contact.address}</p>}
                  {contact.email && (
                    <p className="break-all">{contact.email}</p>
                  )}
                  {contact.phone && <p>{contact.phone}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[13.5px] leading-relaxed text-content-muted">
            The registry publishes no contact details for this domain.{" "}
            {record.domain.endsWith(".com") || record.domain.endsWith(".net")
              ? "Verisign runs .com and .net as a thin registry — it holds the registrar and the dates, and the owner's details sit with the registrar instead."
              : "Personal data is withheld by default under registry privacy policy."}{" "}
            Use the registrar&rsquo;s abuse contact below to reach the owner
            about a genuine issue.
          </p>
        )}
        {record.redacted && (
          <p className="mt-3 text-[12.5px] text-content-subtle">
            The registry marked parts of this record as redacted for privacy.
          </p>
        )}
      </Block>

      {/* Abuse + source */}
      {(record.registrar?.abuseEmail || record.registrar?.abusePhone) && (
        <Block title="Registrar abuse contact" icon={AlertTriangle}>
          <div className="space-y-1 text-[13.5px] text-content-muted">
            {record.registrar.abuseEmail && (
              <p className="break-all">
                <a
                  href={`mailto:${record.registrar.abuseEmail}`}
                  className="text-brand-600 underline-offset-4 hover:underline dark:text-brand-400"
                >
                  {record.registrar.abuseEmail}
                </a>
              </p>
            )}
            {record.registrar.abusePhone && (
              <p>{record.registrar.abusePhone}</p>
            )}
          </div>
        </Block>
      )}

      {/* Raw */}
      <details className="group border-t border-line">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-3.5 text-[13px] font-semibold text-content-muted marker:hidden hover:text-content">
          Raw RDAP response
          <span className="font-mono text-[11.5px] font-normal text-content-subtle">
            JSON
          </span>
        </summary>
        <div className="px-5 pb-5">
          <div className="flex items-center justify-between gap-3 pb-2">
            <p className="truncate font-mono text-[11.5px] text-content-subtle">
              {record.source}
            </p>
            <CopyButton value={JSON.stringify(raw, null, 2)} />
          </div>
          <pre className="max-h-[420px] overflow-auto rounded-[10px] border border-line bg-surface-2 p-4 font-mono text-[12px] leading-relaxed text-content-muted">
            {JSON.stringify(raw, null, 2)}
          </pre>
        </div>
      </details>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function Fact({
  icon: Icon,
  label,
  value,
  note,
  href,
  tone,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  note?: string;
  href?: string;
  tone?: "warn" | "down";
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[11.5px] font-semibold tracking-wide text-content-subtle uppercase">
        <Icon className="size-3.5" />
        {label}
      </dt>
      <dd className="mt-1.5">
        <span className="block text-[14px] font-semibold break-words text-content">
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="underline-offset-4 hover:underline"
            >
              {value}
            </a>
          ) : (
            value
          )}
        </span>
        {note && (
          <span
            className={cn(
              "mt-0.5 block text-[12.5px]",
              tone === "down"
                ? "font-medium text-signal-down"
                : tone === "warn"
                  ? "font-medium text-signal-warn"
                  : "text-content-subtle",
            )}
          >
            {note}
          </span>
        )}
      </dd>
    </div>
  );
}

function Block({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line px-5 py-5">
      <h3 className="flex items-center gap-1.5 text-[11.5px] font-semibold tracking-wide text-content-subtle uppercase">
        <Icon className="size-3.5" />
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function StatusRow({ status }: { status: WhoisStatus }) {
  return (
    <li className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
      <Badge
        variant={
          status.tone === "ok"
            ? "ok"
            : status.tone === "down"
              ? "outline"
              : "soft"
        }
        size="sm"
        className={cn(
          "font-mono",
          status.tone === "down" && "border-signal-down/40 text-signal-down",
          status.tone === "warn" && "text-signal-warn",
        )}
      >
        {status.tone === "down" ? (
          <X className="size-3" />
        ) : status.tone === "ok" ? (
          <Check className="size-3" />
        ) : null}
        {status.code}
      </Badge>
      {status.note && (
        <span className="text-[13px] text-content-muted">{status.note}</span>
      )}
    </li>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Your browser blocked the clipboard");
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={copy} className="shrink-0">
      {copied ? <Check /> : <Copy />}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}
