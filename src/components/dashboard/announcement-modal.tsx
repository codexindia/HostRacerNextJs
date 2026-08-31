"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Megaphone, X } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import {
  dashboardAnnouncement as announcement,
  type AnnouncementTone,
} from "@/config/announcement.config";
import { cn } from "@/lib/utils";

const STORAGE_PREFIX = "hostracer.announcement.";

const tones: Record<AnnouncementTone, { chip: string; eyebrow: string }> = {
  brand: { chip: "bg-brand-50 text-brand-600 dark:bg-brand-500/12 dark:text-brand-300", eyebrow: "text-brand-600 dark:text-brand-400" },
  accent: { chip: "bg-flag-400/15 text-flag-600 dark:text-flag-300", eyebrow: "text-flag-600 dark:text-flag-300" },
  warning: { chip: "bg-amber-500/12 text-amber-600 dark:text-amber-400", eyebrow: "text-amber-600 dark:text-amber-400" },
  success: { chip: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400", eyebrow: "text-emerald-600 dark:text-emerald-400" },
};

/**
 * Reading dismissal state is a side effect, not render state — the server
 * has no storage and would disagree with the client. So the popup starts
 * closed and only opens from an effect, which also gives us the delay.
 */
function storageFor(remember: "forever" | "session"): Storage | null {
  try {
    return remember === "session" ? window.sessionStorage : window.localStorage;
  } catch {
    // Private mode, or a browser configured to block site data.
    return null;
  }
}

/**
 * The post-login announcement popup. Cancelable: the close button, the
 * backdrop, and Escape all dismiss it, and the dismissal is remembered
 * against the announcement's `id` so it appears once, not on every
 * dashboard navigation.
 *
 * Content and on/off live in `src/config/announcement.config.ts`.
 */
export function AnnouncementModal() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusTo = useRef<Element | null>(null);

  const key = `${STORAGE_PREFIX}${announcement.id}`;

  useEffect(() => {
    if (!announcement.active) return;
    if (storageFor(announcement.remember)?.getItem(key)) return;

    const t = setTimeout(() => setOpen(true), announcement.delayMs ?? 600);
    return () => clearTimeout(t);
  }, [key]);

  const dismiss = useCallback(() => {
    setOpen(false);
    try {
      storageFor(announcement.remember)?.setItem(key, String(Date.now()));
    } catch {
      // Storage full or blocked — the popup simply returns next visit.
    }
  }, [key]);

  // Escape to close, and hold the page still underneath while it is open.
  useEffect(() => {
    if (!open) return;

    restoreFocusTo.current = document.activeElement;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", onKey);

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      (restoreFocusTo.current as HTMLElement | null)?.focus?.();
    };
  }, [open, dismiss]);

  if (!announcement.active || !open) return null;

  const { variant, image, cta, title, body, eyebrow, dismissLabel } = announcement;
  const tone = tones[announcement.tone ?? "brand"];
  const isImage = variant === "image" && image;
  const external = cta?.href.startsWith("http");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="announcement-title"
      className="fixed inset-0 z-70 grid place-items-center p-4"
    >
      <button
        aria-label="Close announcement"
        tabIndex={-1}
        onClick={dismiss}
        className="absolute inset-0 cursor-default bg-ink-950/55 backdrop-blur-[2px]"
      />

      <div
        className={cn(
          "animate-race-in relative w-full max-w-[440px] overflow-hidden",
          "rounded-[16px] border border-line bg-surface shadow-2xl",
        )}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={dismiss}
          aria-label="Close announcement"
          className={cn(
            "absolute top-3 right-3 z-10 grid size-9 place-items-center rounded-[9px] transition-colors",
            isImage
              ? "bg-ink-950/45 text-white backdrop-blur-sm hover:bg-ink-950/65"
              : "text-content-muted hover:bg-surface-2 hover:text-content",
          )}
        >
          <X className="size-[18px]" />
        </button>

        {isImage && (
          <Image
            src={image.src}
            width={image.width}
            height={image.height}
            alt={image.alt}
            priority
            className="h-auto w-full"
          />
        )}

        <div className={cn("p-6", isImage && "pt-5")}>
          {!isImage && (
            <span
              className={cn(
                "mb-4 grid size-11 place-items-center rounded-[11px]",
                tone.chip,
              )}
            >
              <Megaphone aria-hidden className="size-[22px]" />
            </span>
          )}

          {eyebrow && (
            <p
              className={cn(
                "mb-1.5 text-[12px] font-bold tracking-[0.08em] uppercase",
                tone.eyebrow,
              )}
            >
              {eyebrow}
            </p>
          )}

          <h2
            id="announcement-title"
            className="pr-8 text-[19px] leading-snug font-bold text-content"
          >
            {title}
          </h2>

          {body && (
            <p className="mt-2 text-[14px] leading-relaxed text-content-muted">
              {body}
            </p>
          )}

          {(cta || dismissLabel) && (
            <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row">
              {dismissLabel && (
                <Button variant="outline" onClick={dismiss} className="sm:flex-1">
                  {dismissLabel}
                </Button>
              )}
              {cta && (
                <ButtonLink
                  href={cta.href}
                  onClick={dismiss}
                  className="sm:flex-1"
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {cta.label}
                </ButtonLink>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
