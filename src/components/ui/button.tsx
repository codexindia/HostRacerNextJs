import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const button = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-semibold leading-none select-none",
    "transition-[transform,background-color,border-color,color,box-shadow] duration-200",
    "ease-[cubic-bezier(0.16,1,0.3,1)]",
    "active:translate-y-px",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        /** Primary action on light surfaces — confident graphite, not a gradient */
        primary:
          "bg-ink-950 text-white hover:bg-ink-800 dark:bg-white dark:text-ink-950 dark:hover:bg-ink-100",
        /** The "go" button: buy, checkout, start. Saffron reads as motion. */
        accent:
          "bg-brand-600 text-white hover:bg-brand-700 shadow-[0_1px_0_0_rgba(0,0,0,0.06)]",
        /** Solid brand blue — the primary CTA on marketing pages */
        brand:
          "bg-brand-600 text-white hover:bg-brand-700 shadow-[0_1px_2px_0_rgba(17,24,39,0.08)]",
        /** Reserved for the single most important CTA on a page */
        racer:
          "bg-gradient-racer text-white hover:brightness-110 shadow-[0_8px_24px_-10px_var(--color-racer-to)]",
        outline:
          "border border-line-strong bg-surface text-content hover:border-ink-400 hover:bg-surface-2",
        /** For use on dark cockpit bands */
        onDark:
          "border border-white/15 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:border-white/25",
        ghost: "text-content-muted hover:bg-surface-2 hover:text-content",
        link: "text-brand-600 underline-offset-4 hover:underline dark:text-brand-400",
      },
      size: {
        sm: "h-9 rounded-[8px] px-3.5 text-[13px] [&_svg]:size-4",
        md: "h-11 rounded-[10px] px-5 text-sm [&_svg]:size-4",
        lg: "h-13 rounded-[11px] px-7 text-[15px] [&_svg]:size-[18px]",
        icon: "size-10 rounded-[10px] [&_svg]:size-[18px]",
        iconSm: "size-9 rounded-[8px] [&_svg]:size-4",
      },
      block: { true: "w-full" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonBaseProps = VariantProps<typeof button>;

export function Button({
  className,
  variant,
  size,
  block,
  ...props
}: ComponentProps<"button"> & ButtonBaseProps) {
  return (
    <button
      className={cn(button({ variant, size, block }), className)}
      {...props}
    />
  );
}

export function ButtonLink({
  className,
  variant,
  size,
  block,
  ...props
}: ComponentProps<typeof Link> & ButtonBaseProps) {
  return (
    <Link
      className={cn(button({ variant, size, block }), className)}
      {...props}
    />
  );
}

export { button as buttonVariants };
