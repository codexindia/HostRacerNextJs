"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  UserRound,
} from "lucide-react";
import { useTheme } from "next-themes";
import { LogoLink } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/store";
import { activity } from "@/lib/dashboard/mock-data";
import { cn } from "@/lib/utils";

/** Anything in the feed newer than this counts as unread for the bell. */
const UNREAD_SINCE = "2026-08-27T00:00:00+05:30";

export function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();

  const [menu, setMenu] = useState<"none" | "bell" | "account">("none");
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (menu === "none") return;

    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setMenu("none");
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu("none");

    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  const unread = activity.filter((a) => a.at > UNREAD_SINCE).length;
  const initials =
    user?.fullName
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("") ?? "??";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open menu"
          className="grid size-9 shrink-0 place-items-center rounded-[9px] text-content-muted transition-colors hover:bg-surface-2 hover:text-content lg:hidden"
        >
          <Menu className="size-[19px]" />
        </button>

        <div className="lg:hidden">
          <LogoLink height={24} />
        </div>

        <ButtonLink
          href="/pricing"
          variant="outline"
          size="sm"
          className="ml-auto hidden sm:inline-flex"
        >
          Buy hosting
        </ButtonLink>

        <div
          ref={wrapRef}
          className="ml-auto flex items-center gap-1 sm:ml-0"
        >
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label="Toggle colour theme"
            className="grid size-9 place-items-center rounded-[9px] text-content-muted transition-colors hover:bg-surface-2 hover:text-content"
          >
            <Moon className="size-[18px] dark:hidden" />
            <Sun className="hidden size-[18px] dark:block" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenu(menu === "bell" ? "none" : "bell")}
              aria-label={`Notifications${unread ? ` — ${unread} new` : ""}`}
              aria-expanded={menu === "bell"}
              className="relative grid size-9 place-items-center rounded-[9px] text-content-muted transition-colors hover:bg-surface-2 hover:text-content"
            >
              <Bell className="size-[18px]" />
              {unread > 0 && (
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-flag-500 ring-2 ring-surface" />
              )}
            </button>

            {menu === "bell" && (
              <div className="absolute right-0 z-50 mt-2 w-[min(92vw,360px)] overflow-hidden rounded-[13px] border border-line bg-surface shadow-[0_24px_60px_-28px_rgba(20,20,31,0.45)]">
                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                  <p className="text-[14px] font-bold text-content">
                    Notifications
                  </p>
                  {unread > 0 && (
                    <span className="rounded-full bg-flag-400/18 px-2 py-0.5 font-mono text-[11px] font-bold text-flag-700 dark:text-flag-300">
                      {unread} new
                    </span>
                  )}
                </div>

                <ul className="max-h-[320px] divide-y divide-line overflow-y-auto">
                  {activity.slice(0, 5).map((entry) => (
                    <li key={entry.id} className="px-4 py-3">
                      <p className="text-[13.5px] font-semibold text-content">
                        {entry.title}
                      </p>
                      <p className="mt-0.5 text-[12.5px] text-content-muted">
                        {entry.detail}
                      </p>
                      <p className="mt-1 font-mono text-[11px] text-content-subtle">
                        {new Intl.DateTimeFormat("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "numeric",
                          minute: "2-digit",
                        }).format(new Date(entry.at))}
                      </p>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/dashboard"
                  onClick={() => setMenu("none")}
                  className="block border-t border-line bg-surface-2 px-4 py-3 text-center text-[13px] font-semibold text-content transition-colors hover:text-brand-600 dark:hover:text-brand-400"
                >
                  View all activity
                </Link>
              </div>
            )}
          </div>

          {/* Account */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenu(menu === "account" ? "none" : "account")}
              aria-expanded={menu === "account"}
              className={cn(
                "flex items-center gap-2 rounded-[9px] py-1.5 pr-2 pl-1.5 transition-colors",
                menu === "account" ? "bg-surface-2" : "hover:bg-surface-2",
              )}
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-racer font-display text-[12.5px] font-bold text-white">
                {initials}
              </span>
              <span className="hidden max-w-[140px] truncate text-[13.5px] font-semibold text-content sm:block">
                {user?.fullName ?? "Account"}
              </span>
              <ChevronDown className="hidden size-4 text-content-subtle sm:block" />
            </button>

            {menu === "account" && (
              <div className="absolute right-0 z-50 mt-2 w-[260px] overflow-hidden rounded-[13px] border border-line bg-surface shadow-[0_24px_60px_-28px_rgba(20,20,31,0.45)]">
                <div className="border-b border-line px-4 py-3.5">
                  <p className="truncate text-[14px] font-semibold text-content">
                    {user?.fullName}
                  </p>
                  <p className="mt-0.5 truncate text-[12.5px] text-content-muted">
                    {user?.email}
                  </p>
                </div>

                <ul className="p-1.5">
                  {[
                    {
                      label: "Account settings",
                      href: "/dashboard/settings",
                      Icon: Settings,
                    },
                    {
                      label: "Profile & security",
                      href: "/dashboard/settings#security",
                      Icon: UserRound,
                    },
                  ].map(({ label, href, Icon }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        onClick={() => setMenu("none")}
                        className="flex items-center gap-2.5 rounded-[8px] px-3 py-2 text-[13.5px] text-content-muted transition-colors hover:bg-surface-2 hover:text-content"
                      >
                        <Icon className="size-4" />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-line p-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setMenu("none");
                      signOut();
                      router.push("/");
                    }}
                    className="flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2 text-[13.5px] font-medium text-signal-down transition-colors hover:bg-signal-down/8"
                  >
                    <LogOut className="size-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
