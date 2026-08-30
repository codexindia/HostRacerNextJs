"use client";

import { forwardRef, useId, useState, type ComponentProps } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Label                                                               */
/* ------------------------------------------------------------------ */

export function Label({ className, ...props }: ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "block text-[13px] font-semibold text-content",
        "select-none",
        className,
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Field — label + control + hint/error, the shape every form uses     */
/* ------------------------------------------------------------------ */

type FieldProps = {
  label?: string;
  hint?: string;
  error?: string;
  /** Rendered on the right of the label row, e.g. a "Forgot?" link */
  action?: React.ReactNode;
  children: (props: { id: string; invalid: boolean }) => React.ReactNode;
  className?: string;
};

export function Field({
  label,
  hint,
  error,
  action,
  children,
  className,
}: FieldProps) {
  const id = useId();
  const invalid = Boolean(error);

  return (
    <div className={cn("space-y-1.5", className)}>
      {(label || action) && (
        <div className="flex items-baseline justify-between gap-3">
          {label ? <Label htmlFor={id}>{label}</Label> : <span />}
          {action}
        </div>
      )}
      {children({ id, invalid })}
      {error ? (
        <p className="text-[12.5px] font-medium text-signal-down">{error}</p>
      ) : hint ? (
        <p className="text-[12.5px] text-content-subtle">{hint}</p>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Input                                                               */
/* ------------------------------------------------------------------ */

const inputBase = [
  "w-full rounded-[10px] border bg-surface text-content",
  "placeholder:text-content-subtle",
  "transition-[border-color,box-shadow,background-color] duration-200",
  "focus:outline-none focus:ring-4",
  "disabled:cursor-not-allowed disabled:opacity-60",
];

type InputProps = ComponentProps<"input"> & {
  invalid?: boolean;
  icon?: LucideIcon;
  /** Static text pinned to the right, e.g. a domain suffix */
  suffix?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, icon: Icon, suffix, ...props },
  ref,
) {
  return (
    <div className="relative">
      {Icon && (
        <Icon
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3.5 size-[17px] -translate-y-1/2 text-content-subtle"
        />
      )}
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          inputBase,
          "h-12 px-3.5 text-[15px]",
          Icon && "pl-11",
          suffix && "pr-24",
          invalid
            ? "border-signal-down/60 focus:border-signal-down focus:ring-signal-down/15"
            : "border-line-strong focus:border-brand-500 focus:ring-brand-500/15",
          className,
        )}
        {...props}
      />
      {suffix && (
        <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 font-mono text-[13px] font-medium text-content-subtle">
          {suffix}
        </span>
      )}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* PasswordInput — input with a show/hide toggle                       */
/* ------------------------------------------------------------------ */

export const PasswordInput = forwardRef<
  HTMLInputElement,
  Omit<InputProps, "type" | "suffix">
>(function PasswordInput({ className, invalid, icon: Icon, ...props }, ref) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      {Icon && (
        <Icon
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3.5 size-[17px] -translate-y-1/2 text-content-subtle"
        />
      )}
      <input
        ref={ref}
        type={visible ? "text" : "password"}
        aria-invalid={invalid || undefined}
        className={cn(
          inputBase,
          "h-12 pr-12 pl-3.5 text-[15px]",
          Icon && "pl-11",
          invalid
            ? "border-signal-down/60 focus:border-signal-down focus:ring-signal-down/15"
            : "border-line-strong focus:border-brand-500 focus:ring-brand-500/15",
          className,
        )}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute top-1/2 right-1.5 grid size-9 -translate-y-1/2 place-items-center rounded-[8px] text-content-subtle transition-colors hover:bg-surface-2 hover:text-content"
      >
        {visible ? (
          <EyeOff className="size-[17px]" />
        ) : (
          <Eye className="size-[17px]" />
        )}
      </button>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* Checkbox                                                            */
/* ------------------------------------------------------------------ */

export const Checkbox = forwardRef<HTMLInputElement, ComponentProps<"input">>(
  function Checkbox({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          "mt-0.5 size-[18px] shrink-0 cursor-pointer appearance-none rounded-[5px]",
          "border border-line-strong bg-surface",
          "checked:border-brand-600 checked:bg-brand-600",
          "checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22 fill=%22none%22 stroke=%22white%22 stroke-width=%222.5%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><polyline points=%223,8.5 6.5,12 13,4.5%22/></svg>')]",
          "checked:bg-center checked:bg-no-repeat",
          "transition-colors duration-150",
          "focus-visible:ring-4 focus-visible:ring-brand-500/15",
          className,
        )}
        {...props}
      />
    );
  },
);
