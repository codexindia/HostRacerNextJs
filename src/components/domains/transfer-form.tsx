"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Check, Info, Loader2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { tlds } from "@/lib/catalog";
import { inrNumber } from "@/lib/utils";

/** A domain, loosely — one or more labels then a TLD of at least two letters. */
const DOMAIN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z]{2,})+$/;

type Result =
  | { state: "eligible"; domain: string; tld: string; price: number }
  | { state: "unsupported"; domain: string; tld: string }
  | { state: "too-new"; domain: string };

function clean(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0];
}

export function TransferForm() {
  const [domain, setDomain] = useState("");
  const [auth, setAuth] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const name = clean(domain);

    if (!DOMAIN.test(name)) {
      setError("Enter the full domain, like yourbusiness.in");
      setResult(null);
      return;
    }
    setError(undefined);
    setBusy(true);
    setResult(null);

    // Stands in for the registry availability + lock-status call.
    await new Promise((r) => setTimeout(r, 700));

    // Longest match wins, so .co.in beats .in.
    const tld = tlds
      .map((t) => t.tld)
      .filter((t) => name.endsWith(t))
      .sort((a, b) => b.length - a.length)[0];

    const priced = tlds.find((t) => t.tld === tld);

    // Registries block a transfer for 60 days after registration. Names
    // registered in the last two months are the commonest rejection, so the
    // mock surfaces it rather than pretending every domain is movable.
    if (name.startsWith("new")) {
      setResult({ state: "too-new", domain: name });
    } else if (!priced) {
      setResult({ state: "unsupported", domain: name, tld: tld ?? "" });
    } else {
      setResult({
        state: "eligible",
        domain: name,
        tld: priced.tld,
        price: priced.transfer,
      });
    }
    setBusy(false);
  }

  return (
    <div>
      <form onSubmit={submit} className="space-y-4">
        <Field
          label="Domain to transfer"
          error={error}
          hint="The name exactly as it is registered elsewhere."
        >
          {({ id, invalid }) => (
            <Input
              id={id}
              invalid={invalid}
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="yourbusiness.in"
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              className="font-mono"
            />
          )}
        </Field>

        <Field
          label="Authorisation (EPP) code"
          hint="Optional here — you can paste it later. Your current registrar gives it to you, usually under a 'transfer' or 'security' menu."
        >
          {({ id }) => (
            <Input
              id={id}
              value={auth}
              onChange={(e) => setAuth(e.target.value)}
              placeholder="Paste the code"
              spellCheck={false}
              autoComplete="off"
              className="font-mono"
            />
          )}
        </Field>

        <Button type="submit" variant="accent" size="lg" block disabled={busy}>
          {busy && <Loader2 className="animate-spin" />}
          {busy ? "Checking with the registry" : "Check this domain"}
        </Button>
      </form>

      {result && <ResultCard result={result} hasAuth={auth.trim().length > 0} />}
    </div>
  );
}

function ResultCard({
  result,
  hasAuth,
}: {
  result: Result;
  hasAuth: boolean;
}) {
  if (result.state === "too-new") {
    return (
      <Notice
        tone="warn"
        Icon={TriangleAlert}
        title="Not transferable yet"
        body={`${result.domain} was registered or transferred within the last 60 days. Registry rules lock it for that window — try again once it has passed, and nothing is lost in the meantime.`}
      />
    );
  }

  if (result.state === "unsupported") {
    return (
      <Notice
        tone="info"
        Icon={Info}
        title="We don't carry that extension yet"
        body={`We can't accept transfers for ${result.tld || "that extension"} at the moment. Raise a ticket and we'll tell you if it's on the way — some are a registry accreditation away.`}
      />
    );
  }

  return (
    <div className="mt-6 rounded-[14px] border border-signal-ok/40 bg-signal-ok/[0.06] p-5">
      <p className="flex items-center gap-2 text-[14px] font-bold text-content">
        <Check className="size-[18px] text-signal-ok" />
        {result.domain} can be transferred
      </p>

      <dl className="mt-4 divide-y divide-line border-y border-line">
        <div className="flex items-center justify-between gap-4 py-2.5">
          <dt className="text-[13px] text-content-muted">Transfer fee</dt>
          <dd className="font-mono text-[13.5px] font-semibold text-content tnum">
            ₹{inrNumber(result.price)} + GST
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4 py-2.5">
          <dt className="text-[13px] text-content-muted">You get</dt>
          <dd className="text-[13.5px] font-medium text-content">
            +1 year on top of the time left
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4 py-2.5">
          <dt className="text-[13px] text-content-muted">Auth code</dt>
          <dd className="text-[13.5px] font-medium text-content">
            {hasAuth ? "Provided" : "Needed before we can start"}
          </dd>
        </div>
      </dl>

      <Button
        variant="accent"
        size="md"
        block
        className="mt-4"
        onClick={() =>
          toast.success(
            hasAuth
              ? "Transfer queued — watch for the approval email from your current registrar"
              : "Saved. Add the auth code from your dashboard to start the transfer",
          )
        }
      >
        Start the transfer
      </Button>

      <p className="mt-3 text-[12px] leading-relaxed text-content-subtle">
        Nothing is charged until the transfer completes. If your current
        registrar rejects it, the order is cancelled and you pay nothing.
      </p>
    </div>
  );
}

function Notice({
  tone,
  Icon,
  title,
  body,
}: {
  tone: "warn" | "info";
  Icon: typeof Info;
  title: string;
  body: string;
}) {
  return (
    <div
      className={
        tone === "warn"
          ? "mt-6 rounded-[14px] border border-flag-400/45 bg-flag-400/10 p-5"
          : "mt-6 rounded-[14px] border border-line bg-surface-2 p-5"
      }
    >
      <p className="flex items-center gap-2 text-[14px] font-bold text-content">
        <Icon
          className={
            tone === "warn"
              ? "size-[18px] text-flag-600 dark:text-flag-400"
              : "size-[18px] text-content-subtle"
          }
        />
        {title}
      </p>
      <p className="mt-2 text-[13.5px] leading-relaxed text-content-muted">
        {body}
      </p>
    </div>
  );
}
