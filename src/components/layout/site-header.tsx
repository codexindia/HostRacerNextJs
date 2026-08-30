"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  ArrowLeftRight,
  ArrowRight,
  ChevronDown,
  FileSearch,
  Globe,
  Layers,
  Menu,
  Moon,
  Phone,
  Search,
  Server,
  Sun,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { LogoLink } from "@/components/brand/logo";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge, Container } from "@/components/ui/primitives";
import { primaryNav, site, type NavEntry } from "@/lib/site";
import { cn } from "@/lib/utils";

const icons: Record<string, LucideIcon> = {
  Globe,
  Layers,
  Users,
  Server,
  Activity,
  Search,
  ArrowLeftRight,
  FileSearch,
};

/**
 * Routes whose first section is a dark cockpit band. On these the header starts
 * transparent so the announcement bar, nav and hero read as one block, then
 * turns into light glass on scroll. Add new dark-hero pages here.
 */
const DARK_HERO_ROUTES = new Set([
  "/",
  "/vps",
  "/hosting",
  "/hosting/shared",
  "/hosting/wordpress",
  "/hosting/reseller",
  "/domains",
  "/pricing",
  "/about",
]);

/* ------------------------------------------------------------------ */
/* Announcement bar                                                    */
/* ------------------------------------------------------------------ */

function AnnouncementBar() {
  return (
    <div className="relative overflow-hidden bg-ink-950 text-white">
      <div
        aria-hidden
        className="cockpit-hatch pointer-events-none absolute inset-0"
      />
      <Container className="relative flex h-9 items-center justify-center gap-3 text-[12.5px]">
        <Badge variant="flag" size="sm" className="hidden sm:inline-flex">
          Sale
        </Badge>
        <p className="truncate text-white/80">
          Up to <strong className="font-semibold text-white">50% off</strong>{" "}
          hosting with a free domain and SSL —{" "}
          <span className="hidden sm:inline">use code </span>
          <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11.5px] font-semibold tracking-wider text-flag-300">
            WELCOME
          </code>
        </p>
        <Link
          href="/pricing"
          className="hidden shrink-0 items-center gap-1 font-semibold text-white underline-offset-4 hover:underline sm:inline-flex"
        >
          View plans
          <ArrowRight className="size-3.5" />
        </Link>
      </Container>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Theme toggle                                                        */
/* ------------------------------------------------------------------ */

function ThemeToggle({ overDark }: { overDark?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();

  // Both icons render and CSS picks the right one, so the markup is identical
  // on server and client — no mounted flag, no hydration mismatch.
  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle colour theme"
      className={cn(
        "grid size-9 place-items-center rounded-[9px] transition-colors",
        overDark
          ? "text-white/70 hover:bg-white/10 hover:text-white"
          : "text-content-muted hover:bg-surface-2 hover:text-content",
      )}
    >
      <Moon className="size-[18px] dark:hidden" />
      <Sun className="hidden size-[18px] dark:block" />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Mega menu panel                                                     */
/* ------------------------------------------------------------------ */

function MegaPanel({
  entry,
  onNavigate,
}: {
  entry: Extract<NavEntry, { type: "mega" }>;
  onNavigate: () => void;
}) {
  return (
    <div className="w-max min-w-[540px] overflow-hidden rounded-[16px] border border-line bg-surface shadow-[0_28px_70px_-30px_rgba(20,20,31,0.45)]">
      <div className="flex gap-8 p-5">
        {entry.columns.map((column) => (
          <div key={column.heading} className="min-w-[250px] flex-1">
            <p className="eyebrow mb-3 px-3 text-content-subtle">
              {column.heading}
            </p>
            <ul className="space-y-0.5">
              {column.items.map((item) => {
                const Icon = icons[item.icon] ?? Globe;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className="group flex gap-3 rounded-[11px] p-3 transition-colors hover:bg-surface-2"
                    >
                      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-[9px] border border-line bg-canvas text-brand-600 transition-colors group-hover:border-brand-200 group-hover:bg-brand-50 dark:text-brand-400 dark:group-hover:border-brand-500/30 dark:group-hover:bg-brand-500/10">
                        <Icon className="size-[18px]" />
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-2">
                          <span className="text-[14.5px] font-semibold text-content">
                            {item.title}
                          </span>
                          {item.badge && (
                            <Badge variant="brand" size="sm">
                              {item.badge}
                            </Badge>
                          )}
                        </span>
                        <span className="mt-0.5 block text-[13px] leading-snug text-content-muted">
                          {item.blurb}
                        </span>
                        {item.price && (
                          <span className="mt-1.5 block font-mono text-[12px] font-semibold text-content-subtle">
                            {item.price}
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {entry.footer && (
        <Link
          href={entry.footer.href}
          onClick={onNavigate}
          className="flex items-center justify-between border-t border-line bg-surface-2 px-6 py-3.5 text-[13.5px] font-semibold text-content transition-colors hover:text-brand-600 dark:hover:text-brand-400"
        >
          {entry.footer.label}
          <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Desktop nav                                                         */
/* ------------------------------------------------------------------ */

function DesktopNav({ overDark }: { overDark?: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(null), 140);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      cancelClose();
    };
  }, []);

  return (
    <nav
      className="hidden items-center gap-1 lg:flex"
      onMouseLeave={scheduleClose}
    >
      {primaryNav.map((entry) => {
        if (entry.type === "link") {
          return (
            <Link
              key={entry.label}
              href={entry.href}
              onMouseEnter={() => {
                cancelClose();
                setOpen(null);
              }}
              className={cn(
                "rounded-[9px] px-3.5 py-2 text-[14.5px] font-semibold transition-colors",
                overDark
                  ? "text-white/75 hover:bg-white/10 hover:text-white"
                  : "text-content-muted hover:bg-surface-2 hover:text-content",
              )}
            >
              {entry.label}
            </Link>
          );
        }

        const isOpen = open === entry.label;

        return (
          <div
            key={entry.label}
            className="relative"
            onMouseEnter={() => {
              cancelClose();
              setOpen(entry.label);
            }}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : entry.label)}
              className={cn(
                "flex items-center gap-1.5 rounded-[9px] px-3.5 py-2 text-[14.5px] font-semibold transition-colors",
                overDark
                  ? isOpen
                    ? "bg-white/12 text-white"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                  : isOpen
                    ? "bg-surface-2 text-content"
                    : "text-content-muted hover:bg-surface-2 hover:text-content",
              )}
            >
              {entry.label}
              <ChevronDown
                className={cn(
                  "size-4 transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </button>

            {isOpen && (
              <div className="absolute top-[calc(100%+10px)] left-1/2 z-50 -translate-x-1/2 pt-1">
                <div className="animate-race-in [animation-duration:0.25s]">
                  <MegaPanel entry={entry} onNavigate={() => setOpen(null)} />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile drawer                                                       */
/* ------------------------------------------------------------------ */

function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <button
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-ink-950/50 backdrop-blur-[2px]"
      />
      <div className="absolute inset-y-0 right-0 flex w-[min(92vw,380px)] flex-col bg-canvas shadow-2xl">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
          <LogoLink height={26} />
          <Button variant="ghost" size="iconSm" onClick={onClose} aria-label="Close menu">
            <X />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
          {primaryNav.map((entry) =>
            entry.type === "link" ? (
              <Link
                key={entry.label}
                href={entry.href}
                onClick={onClose}
                className="flex items-center justify-between border-b border-line py-3.5 text-[15px] font-semibold text-content"
              >
                {entry.label}
                <ArrowRight className="size-4 text-content-subtle" />
              </Link>
            ) : (
              <div key={entry.label} className="border-b border-line py-4">
                <p className="eyebrow mb-3 text-content-subtle">
                  {entry.label}
                </p>
                <ul className="space-y-1">
                  {entry.columns
                    .flatMap((c) => c.items)
                    .map((item) => {
                      const Icon = icons[item.icon] ?? Globe;
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={onClose}
                            className="flex items-center gap-3 rounded-[10px] py-2.5"
                          >
                            <span className="grid size-8 shrink-0 place-items-center rounded-[8px] border border-line bg-surface text-brand-600 dark:text-brand-400">
                              <Icon className="size-4" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-[14.5px] font-semibold text-content">
                                {item.title}
                              </span>
                              {item.price && (
                                <span className="block font-mono text-[11.5px] text-content-subtle">
                                  {item.price}
                                </span>
                              )}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                </ul>
              </div>
            ),
          )}

          <a
            href={site.contact.phoneHref}
            className="mt-5 flex items-center gap-2.5 text-[14px] font-semibold text-content-muted"
          >
            <Phone className="size-4" />
            {site.contact.phone}
          </a>
        </div>

        <div className="shrink-0 space-y-2.5 border-t border-line bg-surface px-5 py-4">
          <ButtonLink href="/login" variant="outline" size="md" block onClick={onClose}>
            Sign in
          </ButtonLink>
          <ButtonLink href="/register" variant="accent" size="md" block onClick={onClose}>
            Create account
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Storing the path the drawer was opened on means a route change closes it
  // for free — including on browser back — with no effect to synchronise.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const mobileOpen = openedAt === pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sit inside the hero's dark band at rest; become light glass once past it.
  const overDark = !scrolled && DARK_HERO_ROUTES.has(pathname);

  return (
    <>
      <AnnouncementBar />
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300",
          scrolled
            ? "border-line bg-canvas/85 shadow-[0_1px_0_0_var(--line)] backdrop-blur-xl"
            : overDark
              ? // No border: the announcement bar, this header and the hero
                // below are all ink-950, so they read as one unbroken band.
                "border-transparent bg-ink-950"
              : "border-transparent bg-canvas",
        )}
      >
        {overDark && (
          <>
            <div
              aria-hidden
              className="cockpit-hatch pointer-events-none absolute inset-0"
            />
            {/* Continues the hero's top-right glow up through the header so
                the two panels don't meet on a visible brightness step. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -bottom-32 h-64 w-[520px] rounded-full bg-brand-600/20 blur-[130px]"
            />
          </>
        )}

        <Container className="relative flex h-16 items-center gap-6">
          <LogoLink height={29} priority onDark={overDark} />

          <DesktopNav overDark={overDark} />

          <div className="ml-auto flex items-center gap-1.5">
            <a
              href={site.contact.phoneHref}
              className={cn(
                "mr-1 hidden items-center gap-2 rounded-[9px] px-2.5 py-2 font-mono text-[13px] font-medium transition-colors xl:flex",
                overDark
                  ? "text-white/65 hover:text-white"
                  : "text-content-muted hover:text-content",
              )}
            >
              <Phone className="size-[15px]" />
              {site.contact.phone}
            </a>

            <ThemeToggle overDark={overDark} />

            <ButtonLink
              href="/login"
              variant="ghost"
              size="sm"
              className={cn(
                "hidden sm:inline-flex",
                overDark
                  ? "text-white/85 hover:bg-white/10 hover:text-white"
                  : "text-content",
              )}
            >
              Sign in
            </ButtonLink>

            <ButtonLink
              href="/register"
              variant="accent"
              size="sm"
              className="hidden sm:inline-flex"
            >
              Get started
            </ButtonLink>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "lg:hidden",
                overDark && "text-white/80 hover:bg-white/10 hover:text-white",
              )}
              onClick={() => setOpenedAt(pathname)}
              aria-label="Open menu"
            >
              <Menu />
            </Button>
          </div>
        </Container>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setOpenedAt(null)} />
    </>
  );
}
