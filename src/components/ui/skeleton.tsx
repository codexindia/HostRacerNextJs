import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Loading placeholder.
 *
 * One primitive rather than `animate-pulse bg-surface-2` written out at each
 * call site — that had already drifted to three different radii across the
 * login and checkout fallbacks. Size it with utilities: `<Skeleton className="h-8 w-3/5" />`.
 *
 * The global `prefers-reduced-motion` block in globals.css stops the pulse,
 * so the shape still reserves its space without moving.
 */
export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-[8px] bg-surface-2", className)}
      {...props}
    />
  );
}

/**
 * A stack of lines with a short last one, which is what a paragraph of text
 * actually looks like. Anything more elaborate belongs in the route's own
 * loading file, shaped like the content it stands in for.
 */
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2.5", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-3.5 rounded-[6px]", i === lines - 1 && "w-2/3")}
        />
      ))}
    </div>
  );
}

/** The bordered panel shape the dashboard repeats everywhere. */
export function SkeletonPanel({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[14px] border border-line bg-surface p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}
