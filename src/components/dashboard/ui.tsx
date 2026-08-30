import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Page header                                                         */
/* ------------------------------------------------------------------ */

export function PageHeader({
  title,
  lede,
  actions,
  className,
}: {
  title: string;
  lede?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="text-[24px] leading-tight font-bold text-content">
          {title}
        </h1>
        {lede && (
          <p className="mt-1.5 text-[14px] text-content-muted">{lede}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 gap-2.5">{actions}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Panel — the standard bordered container                             */
/* ------------------------------------------------------------------ */

export function Panel({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-[14px] border border-line bg-surface",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function PanelHeader({
  title,
  action,
  className,
}: {
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 border-b border-line px-5 py-4",
        className,
      )}
    >
      <h2 className="text-[15px] font-bold text-content">{title}</h2>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Status pill                                                         */
/* ------------------------------------------------------------------ */

const pill = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold whitespace-nowrap",
  {
    variants: {
      tone: {
        ok: "bg-signal-ok/12 text-signal-ok",
        warn: "bg-flag-400/18 text-flag-700 dark:text-flag-300",
        down: "bg-signal-down/12 text-signal-down",
        muted: "bg-surface-2 text-content-muted",
        brand: "bg-brand-500/12 text-brand-700 dark:text-brand-300",
      },
    },
    defaultVariants: { tone: "muted" },
  },
);

export function StatusPill({
  tone,
  dot = true,
  children,
  className,
}: VariantProps<typeof pill> & {
  dot?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn(pill({ tone }), className)}>
      {dot && (
        <span
          aria-hidden
          className={cn(
            "size-1.5 shrink-0 rounded-full",
            tone === "ok" && "bg-signal-ok",
            tone === "warn" && "bg-flag-500",
            tone === "down" && "bg-signal-down",
            tone === "brand" && "bg-brand-500",
            (!tone || tone === "muted") && "bg-content-subtle",
          )}
        />
      )}
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Usage meter                                                         */
/* ------------------------------------------------------------------ */

export function UsageBar({
  label,
  used,
  limit,
  unit,
  className,
}: {
  label: string;
  used: number;
  limit: number | null;
  unit: string;
  className?: string;
}) {
  const pct = limit ? Math.min(100, Math.round((used / limit) * 100)) : null;
  const tight = pct !== null && pct >= 85;
  const warm = pct !== null && pct >= 70 && pct < 85;

  const fmt = (n: number) =>
    Number.isInteger(n) ? n.toLocaleString("en-IN") : n.toFixed(1);

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[12.5px] text-content-muted">{label}</span>
        <span className="font-mono text-[12.5px] font-medium text-content tnum">
          {fmt(used)}
          {unit && unit !== "%" ? ` ${unit}` : unit}
          {limit !== null ? (
            <span className="text-content-subtle">
              {" / "}
              {fmt(limit)}
              {unit && unit !== "%" ? ` ${unit}` : unit}
            </span>
          ) : (
            <span className="text-content-subtle"> used</span>
          )}
        </span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
        {pct !== null ? (
          <div
            className={cn(
              "h-full rounded-full transition-[width] duration-500",
              tight
                ? "bg-signal-down"
                : warm
                  ? "bg-flag-400"
                  : "bg-gradient-racer",
            )}
            style={{ width: `${Math.max(2, pct)}%` }}
          />
        ) : (
          // Unmetered: a fixed sliver reads better than a full or empty bar.
          <div className="h-full w-1/4 rounded-full bg-brand-500/25" />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Empty state                                                         */
/* ------------------------------------------------------------------ */

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-[13px] border border-line bg-canvas text-content-subtle">
        {icon}
      </span>
      <h3 className="mt-5 text-[16px] font-bold text-content">{title}</h3>
      <p className="mt-1.5 max-w-sm text-[13.5px] leading-relaxed text-content-muted">
        {body}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Definition row — label/value pairs used across detail pages         */
/* ------------------------------------------------------------------ */

export function DefRow({
  label,
  children,
  mono,
}: {
  label: string;
  children: ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <dt className="shrink-0 text-[13px] text-content-muted">{label}</dt>
      <dd
        className={cn(
          "min-w-0 text-right text-[13.5px] font-medium break-words text-content",
          mono && "font-mono",
        )}
      >
        {children}
      </dd>
    </div>
  );
}
