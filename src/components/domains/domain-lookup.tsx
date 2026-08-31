"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Check, Loader2, Search, ShoppingCart, X } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/primitives";
import { useCart } from "@/lib/cart/store";
import { tlds } from "@/lib/catalog";
import { checkDomain, normaliseSld, type DomainCheck } from "@/lib/domains/mock-api";
import { cn, inrNumber } from "@/lib/utils";

/** The extensions we offer alongside the one that was searched for. */
const SUGGEST = [".in", ".com", ".co.in", ".net", ".store", ".online"];

type Row = { tld: string; check: DomainCheck | null };

type Search = { sld: string; order: string[] };

/**
 * Turns raw input into a search, or null if it is too short to bother the
 * registry with. A TLD typed into the box wins over the default order — the
 * way people expect when they search "mysite.store" rather than "mysite".
 */
function planSearch(raw: string): Search | null {
  const sld = normaliseSld(raw);
  if (sld.length < 3) return null;

  const typed = raw.trim().toLowerCase().match(/\.[a-z.]+$/)?.[0];
  return {
    sld,
    order: [
      ...(typed && SUGGEST.includes(typed) ? [typed] : []),
      ...SUGGEST.filter((t) => t !== typed),
    ],
  };
}

export function DomainLookup({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const addDomain = useCart((s) => s.addDomain);
  const items = useCart((s) => s.items);

  const [query, setQuery] = useState(initialQuery);
  // Arriving from the header or homepage search starts with results already
  // pending, so the page never flashes an empty state it is about to fill.
  const initial = useMemo(() => planSearch(initialQuery), [initialQuery]);
  const [search, setSearch] = useState<Search | null>(initial);
  const [rows, setRows] = useState<Row[]>(() =>
    initial ? initial.order.map((tld) => ({ tld, check: null })) : [],
  );
  const resultsRef = useRef<HTMLDivElement>(null);

  // Nothing to track separately: a row without a result is a row still in
  // flight, so "checking" falls out of the data.
  const busy = rows.some((row) => !row.check);

  // Sequential rather than parallel: results fill in top-down, which reads as
  // progress instead of six spinners resolving in a random order.
  useEffect(() => {
    if (!search) return;

    let cancelled = false;
    (async () => {
      for (const tld of search.order) {
        const check = await checkDomain(search.sld, tld);
        if (cancelled) return;
        setRows((prev) =>
          prev.map((row) => (row.tld === tld ? { ...row, check } : row)),
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [search]);

  useEffect(() => {
    if (search) resultsRef.current?.scrollIntoView({ block: "nearest" });
  }, [search]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const next = planSearch(query);
    if (!next) {
      toast.error("Enter at least three characters");
      return;
    }
    setSearch(next);
    setRows(next.order.map((tld) => ({ tld, check: null })));
  }

  const inCart = (sld: string, tld: string) =>
    items.some((i) => i.kind === "domain" && i.sld === sld && i.tld === tld);

  function add(sld: string, tld: string) {
    addDomain({ sld, tld });
    toast.success(`${sld}${tld} added to your basket`);
  }

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
            placeholder="yourbusinessname"
            aria-label="Domain name to search"
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            className="h-12 w-full bg-transparent pr-3 pl-11 text-[15px] text-content outline-none placeholder:text-content-subtle"
          />
        </div>
        <Button type="submit" variant="accent" size="md" disabled={busy}>
          {busy ? <Loader2 className="animate-spin" /> : <Search />}
          {busy ? "Checking" : "Search"}
        </Button>
      </form>

      <p className="mt-2.5 text-[12.5px] text-content-subtle">
        Type the name only — we check the popular extensions for you. Hyphens
        are fine; spaces and symbols get stripped.
      </p>

      {search && (
        <div ref={resultsRef} className="mt-7">
          <ul className="divide-y divide-line overflow-hidden rounded-[14px] border border-line bg-surface">
            {rows.map(({ tld, check }, i) => (
              <ResultRow
                key={tld}
                sld={search.sld}
                tld={tld}
                check={check}
                exact={i === 0}
                inCart={inCart(search.sld, tld)}
                onAdd={() => add(search.sld, tld)}
              />
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[12.5px] text-content-subtle">
              Prices are for the first year, excluding GST. Renewal rates are
              in the table below — we don&rsquo;t hide them.
            </p>
            {items.some((i) => i.kind === "domain") && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push("/checkout")}
              >
                <ShoppingCart />
                Go to checkout
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ResultRow({
  sld,
  tld,
  check,
  exact,
  inCart,
  onAdd,
}: {
  sld: string;
  tld: string;
  check: DomainCheck | null;
  exact: boolean;
  inCart: boolean;
  onAdd: () => void;
}) {
  const price = tlds.find((t) => t.tld === tld);
  const available = check?.status === "available";

  return (
    <li
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-4 sm:px-5",
        exact && "bg-surface-2",
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[15.5px] font-bold break-all text-content">
            {sld}
            {tld}
          </span>
          {exact && <Badge size="sm">Your search</Badge>}
        </p>

        {!check ? (
          <span className="mt-1 block text-[12.5px] text-content-subtle">
            Checking…
          </span>
        ) : available ? (
          <span className="mt-1 flex items-center gap-1.5 text-[12.5px] font-medium text-signal-ok">
            <Check className="size-3.5" />
            Available
          </span>
        ) : check.status === "taken" ? (
          <span className="mt-1 flex items-center gap-1.5 text-[12.5px] text-content-muted">
            <X className="size-3.5" />
            Taken — {" "}
            <a
              href={`https://${sld}${tld}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-content"
            >
              see who has it
            </a>
          </span>
        ) : (
          <span className="mt-1 block text-[12.5px] text-signal-down">
            {check.reason}
          </span>
        )}
      </div>

      {price && (
        <div className="text-right">
          <p className="font-mono text-[15px] font-bold text-content tnum">
            ₹{inrNumber(price.register)}
            <span className="text-[12px] font-normal text-content-subtle">
              /yr
            </span>
          </p>
          {price.renew !== price.register && (
            <p className="font-mono text-[11.5px] text-content-subtle">
              renews ₹{inrNumber(price.renew)}
            </p>
          )}
        </div>
      )}

      <div className="w-full sm:w-auto">
        {inCart ? (
          <ButtonLink
            href="/checkout"
            variant="outline"
            size="sm"
            className="w-full sm:w-[104px]"
          >
            <Check />
            In basket
          </ButtonLink>
        ) : (
          <Button
            variant={exact ? "accent" : "outline"}
            size="sm"
            disabled={!available}
            onClick={onAdd}
            className="w-full sm:w-[104px]"
          >
            {available ? "Add" : "—"}
          </Button>
        )}
      </div>
    </li>
  );
}
