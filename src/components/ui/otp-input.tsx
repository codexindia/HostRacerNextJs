"use client";

import { useEffect, useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

/**
 * Six-box verification code entry. Handles auto-advance, backspace stepping
 * back, arrow keys and pasting a full code into any box.
 */
export function OtpInput({
  value,
  onChange,
  onComplete,
  invalid,
  disabled,
  autoFocus,
  length = 6,
}: {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  invalid?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  length?: number;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(length, " ").slice(0, length).split("");

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  const commit = (next: string) => {
    const clean = next.replace(/\D/g, "").slice(0, length);
    onChange(clean);
    if (clean.length === length) onComplete?.(clean);
  };

  const focusBox = (i: number) => {
    const el = refs.current[Math.max(0, Math.min(length - 1, i))];
    el?.focus();
    el?.select();
  };

  const handleInput = (index: number, raw: string) => {
    const typed = raw.replace(/\D/g, "");
    if (!typed) return;

    // Typing over a filled box replaces just that digit; pasting fills forward.
    const chars = value.split("");
    for (let i = 0; i < typed.length && index + i < length; i++) {
      chars[index + i] = typed[i];
    }
    commit(chars.join("").trimEnd());
    focusBox(index + typed.length);
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const chars = value.padEnd(length, " ").split("");
      if (chars[index] && chars[index] !== " ") {
        chars[index] = " ";
        commit(chars.join("").replace(/\s+$/, ""));
      } else if (index > 0) {
        chars[index - 1] = " ";
        commit(chars.join("").replace(/\s+$/, ""));
        focusBox(index - 1);
      }
      return;
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusBox(index - 1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      focusBox(index + 1);
    }
  };

  const handlePaste = (index: number, e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    handleInput(index, pasted);
  };

  return (
    <div
      className="flex gap-2 sm:gap-2.5"
      role="group"
      aria-label={`${length}-digit verification code`}
    >
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={length}
          disabled={disabled}
          aria-label={`Digit ${i + 1}`}
          aria-invalid={invalid || undefined}
          value={digit.trim()}
          onChange={(e) => handleInput(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => handlePaste(i, e)}
          onFocus={(e) => e.target.select()}
          className={cn(
            "h-14 w-full min-w-0 rounded-[11px] border bg-surface text-center",
            "font-mono text-[22px] font-bold text-content tnum",
            "transition-[border-color,box-shadow] duration-200",
            "focus:ring-4 focus:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-60",
            invalid
              ? "border-signal-down/60 focus:border-signal-down focus:ring-signal-down/15"
              : "border-line-strong focus:border-brand-500 focus:ring-brand-500/15",
          )}
        />
      ))}
    </div>
  );
}
