"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * The hero's terminal. A migration, played back.
 *
 * The whole animation is a pure function of one tick counter rather than a
 * chain of timeouts holding their own state — so there is nothing to get out
 * of sync, pausing is a matter of not incrementing, and the reduced-motion
 * path is simply "render the last frame".
 */

const TICK_MS = 45;

type Line =
  | { kind: "command"; text: string }
  | { kind: "note"; text: string }
  | { kind: "ok"; text: string; value?: string }
  | { kind: "progress"; text: string }
  | { kind: "done"; text: string };

const script: Line[] = [
  { kind: "command", text: "hostracer migrate --from oldhost.in" },
  { kind: "note", text: "Connecting over SFTP…" },
  { kind: "ok", text: "Files copied", value: "1,284 files" },
  { kind: "progress", text: "Importing database" },
  { kind: "ok", text: "Tables imported", value: "12 tables" },
  { kind: "ok", text: "SSL certificate issued", value: "Let's Encrypt" },
  { kind: "ok", text: "DNS switched", value: "ns1.hostracer.in" },
  { kind: "done", text: "Your site is live. That's the whole process." },
];

/** Ticks each line occupies: typing time for the command, dwell for the rest. */
function durationOf(line: Line): number {
  if (line.kind === "command") return line.text.length + 14;
  if (line.kind === "progress") return 26;
  if (line.kind === "done") return 10;
  return 11;
}

const HOLD = 70; // beat at the end before the loop restarts

const timeline = script.map((line, i) => ({
  line,
  start: script.slice(0, i).reduce((sum, l) => sum + durationOf(l), 0),
  duration: durationOf(line),
}));

const TOTAL = timeline.reduce((sum, t) => sum + t.duration, 0) + HOLD;

export function HeroTerminal() {
  // Starts on the final frame: that is what the server renders, what a
  // reduced-motion visitor keeps, and what shows if JS never arrives.
  const [tick, setTick] = useState(TOTAL);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // No reset here: the counter starts on TOTAL, so the first interval wraps
    // it round to 1 on its own. Setting state in the effect body would only
    // cost a cascading render — and trips the React Compiler lint.
    const id = setInterval(() => setTick((t) => (t + 1) % TOTAL), TICK_MS);
    return () => clearInterval(id);
  }, []);

  const frame = useMemo(
    () =>
      timeline.map(({ line, start, duration }) => {
        const elapsed = tick - start;
        return {
          line,
          visible: elapsed >= 0,
          // 0 → 1 across the line's own slice of the timeline.
          progress: Math.max(0, Math.min(1, elapsed / duration)),
          typed:
            line.kind === "command"
              ? Math.max(0, Math.min(line.text.length, elapsed))
              : 0,
        };
      }),
    [tick],
  );

  const running = tick < TOTAL - HOLD;

  return (
    <div className="relative">
      <div
        aria-hidden
        className="tech-grid pointer-events-none absolute -inset-6 opacity-[0.5] dark:opacity-[0.2]"
        style={{
          maskImage:
            "radial-gradient(circle at 60% 40%, #000 40%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(circle at 60% 40%, #000 40%, transparent 78%)",
        }}
      />

      {/*
        The panel has to earn its separation in both themes, and the way it
        does that flips between them. On white it is the dark object in the
        room, so #0B1220 and a soft shadow are enough. In dark mode the page
        is already #0B1220 — an identical panel simply dissolves — so it
        lifts to the next surface up and takes a hairline of white instead of
        a shadow, which is invisible on navy. Same object, opposite tactics.
      */}
      <div className="relative overflow-hidden rounded-[12px] border border-ink-800 bg-ink-950 shadow-[0_18px_40px_-24px_rgba(11,18,32,0.55)] dark:border-white/[0.14] dark:bg-ink-850 dark:shadow-[0_24px_50px_-30px_rgba(0,0,0,0.85)] dark:ring-1 dark:ring-white/[0.04]">
        {/* Title bar — a path and a status, not three coloured circles. */}
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3">
          <span className="font-mono text-[11.5px] text-white/45">
            hostracer@mumbai-1: ~/migrations
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[10.5px] font-bold tracking-[0.1em] text-signal-ok uppercase">
            <span className="size-1.5 rounded-full bg-signal-ok" />
            {running ? "running" : "done"}
          </span>
        </div>

        {/* The transcript is decorative; screen readers get the summary below. */}
        <div
          aria-hidden
          className="min-h-[268px] space-y-2 px-4 py-4 font-mono text-[12.5px] leading-relaxed sm:px-5 dark:bg-ink-950"
        >
          {frame.map(({ line, visible, progress, typed }, i) => {
            if (!visible) return null;

            switch (line.kind) {
              case "command":
                return (
                  <p key={i} className="text-white">
                    <span className="mr-2 text-brand-400">$</span>
                    {line.text.slice(0, typed)}
                    {typed < line.text.length && <Cursor />}
                  </p>
                );

              case "note":
                return (
                  <p key={i} className="text-white/40">
                    {line.text}
                  </p>
                );

              case "ok":
                return (
                  <p key={i} className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-signal-ok">✓</span>
                    <span className="text-white/75">{line.text}</span>
                    {line.value && (
                      <span className="text-blue-400">{line.value}</span>
                    )}
                  </p>
                );

              case "progress": {
                const filled = Math.round(progress * 24);
                return (
                  <p key={i} className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-white/40">{line.text}</span>
                    <span className="text-blue-400">
                      [{"█".repeat(filled)}
                      <span className="text-white/15">
                        {"░".repeat(24 - filled)}
                      </span>
                      ]
                    </span>
                    <span className="text-white/40 tnum">
                      {Math.round(progress * 100)}%
                    </span>
                  </p>
                );
              }

              case "done":
                return (
                  <p
                    key={i}
                    className="pt-1 text-[13px] font-semibold text-signal-ok"
                  >
                    {line.text}
                    <Cursor className="bg-signal-ok" />
                  </p>
                );
            }
          })}
        </div>

        {/* Infrastructure credibility, kept from the rack panel. */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-white/10 bg-white/[0.02] px-4 py-3 sm:px-5 dark:bg-transparent">
          {[
            { label: "Mumbai, IN", tone: "muted" },
            { label: "NVMe storage", tone: "muted" },
            { label: "Free migration", tone: "ok" },
          ].map((item) => (
            <span
              key={item.label}
              className={cn(
                "flex items-center gap-1.5 font-mono text-[11px]",
                item.tone === "ok" ? "text-signal-ok" : "text-white/45",
              )}
            >
              <span
                className={cn(
                  "size-1 rounded-full",
                  item.tone === "ok" ? "bg-signal-ok" : "bg-white/30",
                )}
              />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <p className="sr-only">
        An illustration of a website migration: files copied, database
        imported, SSL certificate issued and DNS switched to Hostracer.
      </p>
    </div>
  );
}

function Cursor({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "ml-0.5 inline-block h-[1em] w-[7px] translate-y-[2px] animate-pulse bg-white",
        className,
      )}
    />
  );
}
