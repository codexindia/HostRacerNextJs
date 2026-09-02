"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart/store";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";

/**
 * Only appears once there is something to check out — an always-empty cart
 * icon is noise on a hosting site where most visits start from a plan page.
 */
export function CartButton({ overDark }: { overDark?: boolean }) {
  const items = useCart((s) => s.items);
  const hydrated = useHydrated(useCart);

  if (!hydrated || items.length === 0) return null;

  return (
    <Link
      href="/checkout"
      aria-label={`Checkout — ${items.length} item${items.length > 1 ? "s" : ""}`}
      className={cn(
        "relative grid size-9 place-items-center rounded-[9px] transition-colors",
        overDark
          ? "text-white/75 hover:bg-white/10 hover:text-white"
          : "text-content-muted hover:bg-surface-2 hover:text-content",
      )}
    >
      <ShoppingCart className="size-[18px]" />
      <span
        className={cn(
          "absolute -top-0.5 -right-0.5 grid size-[18px] place-items-center rounded-full",
          "bg-brand-600 font-mono text-[10.5px] font-bold text-white",
        )}
      >
        {items.length}
      </span>
    </Link>
  );
}
