import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** ₹1,299 — Indian digit grouping, no decimals unless we have paise. */
export function inr(amount: number, opts?: { decimals?: boolean }) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: opts?.decimals ? 2 : 0,
    maximumFractionDigits: opts?.decimals ? 2 : 0,
  }).format(amount);
}

/** 1,299 — grouped number without the currency symbol. */
export function inrNumber(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(input: string | Date) {
  const d = typeof input === "string" ? new Date(input) : input;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function percentOff(mrp: number, price: number) {
  if (mrp <= 0 || price >= mrp) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}
