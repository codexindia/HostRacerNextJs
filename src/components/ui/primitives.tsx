import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Container — one page gutter, used everywhere                        */
/* ------------------------------------------------------------------ */

export function Container({
  className,
  as: Tag = "div",
  ...props
}: ComponentProps<"div"> & { as?: "div" | "section" | "header" | "footer" }) {
  return (
    <Tag
      className={cn("mx-auto w-full max-w-[1200px] px-5 sm:px-6", className)}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Badge                                                               */
/* ------------------------------------------------------------------ */

const badge = cva(
  "inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap",
  {
    variants: {
      variant: {
        brand:
          "bg-brand-50 text-brand-700 dark:bg-brand-500/12 dark:text-brand-300",
        flag: "bg-flag-400 text-ink-950",
        soft: "bg-surface-2 text-content-muted",
        outline: "border border-line-strong text-content-muted",
        onDark: "border border-white/15 bg-white/8 text-white/85",
        ok: "bg-signal-ok/10 text-signal-ok",
      },
      size: {
        sm: "px-2 py-0.5 text-[11px]",
        md: "px-2.5 py-1 text-xs",
      },
    },
    defaultVariants: { variant: "soft", size: "md" },
  },
);

export function Badge({
  className,
  variant,
  size,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof badge>) {
  return (
    <span className={cn(badge({ variant, size }), className)} {...props} />
  );
}

/* ------------------------------------------------------------------ */
/* Eyebrow — the small mono kicker above section headings              */
/* ------------------------------------------------------------------ */

export function Eyebrow({
  className,
  onDark,
  ...props
}: ComponentProps<"p"> & { onDark?: boolean }) {
  return (
    <p
      className={cn(
        "eyebrow flex items-center gap-2.5",
        onDark ? "text-brand-300" : "text-brand-600 dark:text-brand-400",
        className,
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/* SpeedRule — the track swoosh from the logo, as a divider            */
/* ------------------------------------------------------------------ */

export function SpeedRule({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("speed-rule block w-16 shrink-0 rounded-full", className)}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Section heading pair                                                */
/* ------------------------------------------------------------------ */

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "center",
  onDark,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "left" | "center";
  onDark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <Eyebrow
          onDark={onDark}
          className={cn("mb-4", align === "center" && "justify-center")}
        >
          <SpeedRule className="w-8" />
          {eyebrow}
        </Eyebrow>
      )}
      <h2
        className={cn(
          "text-[clamp(1.75rem,4vw,2.6rem)] leading-[1.1]",
          onDark ? "text-white" : "text-content",
        )}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={cn(
            "mt-4 text-[16.5px] leading-relaxed",
            onDark ? "text-white/65" : "text-content-muted",
          )}
        >
          {lede}
        </p>
      )}
    </div>
  );
}
