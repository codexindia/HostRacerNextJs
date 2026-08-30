"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const quickTlds = [".com", ".in", ".co.in", ".xyz", ".store"];

/**
 * Hero domain search. Hands off to /domains with the query — the results page
 * owns availability lookup, so this stays a pure navigation control.
 */
export function DomainSearch({ onDark = true }: { onDark?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim().toLowerCase().replace(/\s+/g, "");
    if (!q) return;
    router.push(`/domains?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className="w-full">
      <form
        onSubmit={submit}
        className={cn(
          "flex flex-col gap-2 rounded-[14px] p-2 sm:flex-row sm:items-center sm:gap-2",
          onDark
            ? "border border-white/12 bg-white/[0.06] backdrop-blur-sm"
            : "border border-line-strong bg-surface shadow-sm",
        )}
      >
        <div className="relative flex-1">
          <Search
            aria-hidden
            className={cn(
              "pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2",
              onDark ? "text-white/40" : "text-content-subtle",
            )}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find your domain name"
            aria-label="Search for a domain name"
            spellCheck={false}
            autoComplete="off"
            className={cn(
              "h-12 w-full bg-transparent pr-3 pl-11 text-[15px] outline-none",
              onDark
                ? "text-white placeholder:text-white/40"
                : "text-content placeholder:text-content-subtle",
            )}
          />
        </div>

        <button
          type="submit"
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-[10px] bg-flag-400 px-6 text-[14.5px] font-semibold text-ink-950 transition-[background-color,transform] duration-200 hover:bg-flag-300 active:translate-y-px"
        >
          Search
          <ArrowRight className="size-4" />
        </button>
      </form>

      <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <span
          className={cn(
            "eyebrow",
            onDark ? "text-white/35" : "text-content-subtle",
          )}
        >
          From ₹250
        </span>
        {quickTlds.map((tld) => (
          <button
            key={tld}
            type="button"
            onClick={() => router.push(`/domains?tld=${tld.slice(1)}`)}
            className={cn(
              "font-mono text-[13px] font-medium transition-colors",
              onDark
                ? "text-white/50 hover:text-white"
                : "text-content-muted hover:text-content",
            )}
          >
            {tld}
          </button>
        ))}
      </div>
    </div>
  );
}
