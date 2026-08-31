"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  CreditCard,
  Globe,
  HardDrive,
  LayoutGrid,
  LifeBuoy,
  PlayCircle,
  Settings,
  ShoppingBag,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { LogoLink } from "@/components/brand/logo";
import { invoices, services } from "@/lib/dashboard/mock-data";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Nav definition                                                      */
/* ------------------------------------------------------------------ */

type Leaf = { label: string; href: string; badge?: number };

type NavItem =
  | { kind: "link"; label: string; href: string; icon: LucideIcon; badge?: number }
  | { kind: "group"; label: string; icon: LucideIcon; children: Leaf[] };

const activeServices = services.filter((s) => s.status === "active").length;
const openInvoices = invoices.filter(
  (i) => i.status === "unpaid" || i.status === "overdue",
).length;

const nav: NavItem[] = [
  { kind: "link", label: "Home", href: "/dashboard", icon: LayoutGrid },
  {
    kind: "link",
    label: "Hosting",
    href: "/dashboard/services",
    icon: HardDrive,
    badge: activeServices,
  },
  {
    kind: "group",
    label: "Domains",
    icon: Globe,
    children: [
      { label: "My domains", href: "/dashboard/domains" },
      { label: "Register a domain", href: "/domains" },
      { label: "Transfer in", href: "/domains/transfer" },
    ],
  },
  {
    kind: "link",
    label: "Invoices",
    href: "/dashboard/billing",
    icon: CreditCard,
    badge: openInvoices,
  },
  {
    kind: "group",
    label: "Support",
    icon: LifeBuoy,
    children: [
      { label: "My tickets", href: "/dashboard/tickets" },
      { label: "Knowledgebase", href: "/support" },
      { label: "Network status", href: "/status" },
    ],
  },
  { kind: "link", label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const secondary: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Buy hosting", href: "/pricing", icon: ShoppingBag },
  { label: "Refer & earn", href: "/dashboard/affiliates", icon: Users },
  { label: "How-to videos", href: "/support", icon: PlayCircle },
];

/* ------------------------------------------------------------------ */
/* Sidebar                                                             */
/* ------------------------------------------------------------------ */

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  // A group starts open when the current page lives inside it.
  const [openGroups, setOpenGroups] = useState<string[]>(() =>
    nav
      .filter(
        (item) =>
          item.kind === "group" &&
          item.children.some((c) => pathname.startsWith(c.href)),
      )
      .map((item) => item.label),
  );

  const toggle = (label: string) =>
    setOpenGroups((open) =>
      open.includes(label)
        ? open.filter((l) => l !== label)
        : [...open, label],
    );

  // "/dashboard" must not light up for every child route.
  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <div className="flex h-full flex-col bg-surface">
      <nav className="flex-1 overflow-y-auto px-3.5 py-5">
        <ul className="space-y-0.5">
          {nav.map((item) => {
            if (item.kind === "link") {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group flex items-center gap-3.5 rounded-[10px] px-3.5 py-3 text-[14.5px] font-medium transition-colors",
                      active
                        ? "bg-brand-50 text-brand-700 dark:bg-brand-500/12 dark:text-brand-300"
                        : "text-content-muted hover:bg-surface-2 hover:text-content",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "size-[19px] shrink-0",
                        active
                          ? "text-brand-600 dark:text-brand-400"
                          : "text-content-subtle group-hover:text-content-muted",
                      )}
                    />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge ? (
                      <span
                        className={cn(
                          "grid min-w-[22px] place-items-center rounded-full px-1.5 py-0.5 font-mono text-[11.5px] font-bold",
                          active
                            ? "bg-brand-600 text-white"
                            : "bg-surface-2 text-content-muted",
                        )}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            }

            const open = openGroups.includes(item.label);
            const groupActive = item.children.some((c) => isActive(c.href));

            return (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => toggle(item.label)}
                  aria-expanded={open}
                  className={cn(
                    "group flex w-full items-center gap-3.5 rounded-[10px] px-3.5 py-3 text-[14.5px] font-medium transition-colors",
                    groupActive && !open
                      ? "bg-brand-50 text-brand-700 dark:bg-brand-500/12 dark:text-brand-300"
                      : "text-content-muted hover:bg-surface-2 hover:text-content",
                  )}
                >
                  <item.icon
                    className={cn(
                      "size-[19px] shrink-0",
                      groupActive
                        ? "text-brand-600 dark:text-brand-400"
                        : "text-content-subtle group-hover:text-content-muted",
                    )}
                  />
                  <span className="flex-1 truncate text-left">
                    {item.label}
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-content-subtle transition-transform duration-200",
                      open && "rotate-180",
                    )}
                  />
                </button>

                {open && (
                  <ul className="mt-0.5 mb-1 ml-[29px] space-y-0.5 border-l border-line pl-3.5">
                    {item.children.map((child) => {
                      const active = isActive(child.href);
                      return (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={onNavigate}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                              "block rounded-[9px] px-3.5 py-2.5 text-[14px] transition-colors",
                              active
                                ? "bg-brand-50 font-semibold text-brand-700 dark:bg-brand-500/12 dark:text-brand-300"
                                : "text-content-muted hover:bg-surface-2 hover:text-content",
                            )}
                          >
                            {child.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Secondary, pinned to the bottom */}
      <div className="border-t border-line px-3.5 py-4">
        <ul className="space-y-0.5">
          {secondary.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className="flex items-center gap-3.5 rounded-[10px] px-3.5 py-2.5 text-[14px] text-content-muted transition-colors hover:bg-surface-2 hover:text-content"
              >
                <item.icon className="size-[17px] shrink-0 text-content-subtle" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile drawer                                                       */
/* ------------------------------------------------------------------ */

export function SidebarDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 lg:hidden">
      <button
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-ink-950/50 backdrop-blur-[2px]"
      />
      <div className="absolute inset-y-0 left-0 flex w-[min(86vw,296px)] flex-col shadow-2xl">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line bg-surface px-4">
          <LogoLink height={25} />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid size-9 place-items-center rounded-[9px] text-content-muted hover:bg-surface-2"
          >
            <X className="size-[18px]" />
          </button>
        </div>
        <div className="min-h-0 flex-1">
          <Sidebar onNavigate={onClose} />
        </div>
      </div>
    </div>
  );
}
