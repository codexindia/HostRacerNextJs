"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

/** The house easing — matches --ease-out-race in globals.css. */
export const EASE_RACE = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/* Reveal — fade + rise as a block scrolls into view, once             */
/* ------------------------------------------------------------------ */

export function Reveal({
  children,
  className,
  delay = 0,
  y = 20,
  duration = 0.65,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration, delay, ease: EASE_RACE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggers direct children of a grid or list. Pair with <RevealItem>.
 * Kept separate from Reveal so a card grid animates per-card, not as a slab.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.07,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  y = 22,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={{
        hidden: reduce ? {} : { opacity: 0, y },
        shown: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: EASE_RACE },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* CountUp — animates a number when it scrolls into view               */
/* ------------------------------------------------------------------ */

/**
 * Drives a MotionValue rather than React state, so counting costs no
 * re-renders and the linter stays happy about setState-in-effect.
 *
 * Formatting is described with plain props rather than a callback: server
 * components render this directly, and functions can't cross that boundary.
 */
export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  group = false,
  duration = 1.5,
  className,
}: {
  value: number;
  /** Fixed decimal places held throughout the count, so width doesn't jump. */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Apply en-IN digit grouping, e.g. 5,000 */
  group?: boolean;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();

  const raw = useMotionValue(reduce ? value : 0);
  const text = useTransform(raw, (n: number) => {
    const body = group
      ? new Intl.NumberFormat("en-IN", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(n)
      : n.toFixed(decimals);
    return `${prefix}${body}${suffix}`;
  });

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(raw, value, { duration, ease: EASE_RACE });
    return () => controls.stop();
  }, [inView, reduce, raw, value, duration]);

  return (
    <motion.span ref={ref} className={className}>
      {text}
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/* Bar / meter fills                                                   */
/* ------------------------------------------------------------------ */

/** A vertical sparkline bar that grows from its baseline. */
export function GrowBar({
  heightPct,
  delay = 0,
  className,
}: {
  heightPct: number;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.span
      style={{ height: `${heightPct}%` }}
      className={cn("origin-bottom", className)}
      initial={reduce ? false : { scaleY: 0, opacity: 0 }}
      whileInView={{ scaleY: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay, ease: EASE_RACE }}
    />
  );
}

/** A horizontal meter fill that wipes in from the left. */
export function FillBar({
  widthPct,
  delay = 0,
  className,
}: {
  widthPct: number;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.span
      style={{ width: `${widthPct}%` }}
      className={cn("block origin-left", className)}
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, delay, ease: EASE_RACE }}
    />
  );
}
