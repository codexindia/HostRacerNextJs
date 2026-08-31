/**
 * ════════════════════════════════════════════════════════════════════
 *  DASHBOARD ANNOUNCEMENT — the popup shown after a customer signs in
 * ════════════════════════════════════════════════════════════════════
 *
 *  One editable object drives the whole thing. Two shapes:
 *
 *    variant: "message"  — an icon, a headline and a paragraph. Use it
 *                          for maintenance windows, policy changes,
 *                          anything the customer must actually read.
 *
 *    variant: "image"    — a full-bleed creative with an optional
 *                          caption strip. Use it for offers and sales.
 *
 *  Dismissal is remembered against `id`, so **changing the copy is not
 *  enough to re-show it** — bump the `id` and everyone sees it again.
 *  That is deliberate: it stops a typo fix from re-nagging the whole
 *  customer base, and makes "show this again" an explicit decision.
 *
 *  To turn the popup off entirely, set `active: false`.
 * ════════════════════════════════════════════════════════════════════
 */

export type AnnouncementTone = "brand" | "accent" | "warning" | "success";

export type DashboardAnnouncement = {
  /**
   * Dismissal key. Bump it (e.g. `diwali-2026` → `diwali-2026-v2`) to
   * show the popup again to people who already closed the previous one.
   */
  id: string;
  /** The master switch. */
  active: boolean;
  variant: "message" | "image";
  /**
   * "forever"  — dismissed for good (localStorage), until `id` changes.
   * "session"  — comes back on the next browser session (sessionStorage).
   */
  remember: "forever" | "session";
  /**
   * Hold before it appears, in ms. A short beat lets the dashboard paint
   * first, so the popup reads as an arrival rather than a blocked page.
   */
  delayMs?: number;
  /** Tints the icon, eyebrow and primary button. Ignored by "image". */
  tone?: AnnouncementTone;

  eyebrow?: string;
  title: string;
  body?: string;

  /**
   * Required by `variant: "image"`, ignored by "message". `src` is a path
   * under /public — a remote URL needs `images.remotePatterns` adding to
   * next.config.ts first. Width/height are the file's intrinsic pixels
   * and only set the aspect ratio; the image scales to the popup width.
   */
  image?: { src: string; width: number; height: number; alt: string };

  /** Primary button. External links (`http…`) open in a new tab. */
  cta?: { label: string; href: string };
  /** Text on the "no thanks" button. Omit for a single-button popup. */
  dismissLabel?: string;
};

export const dashboardAnnouncement: DashboardAnnouncement = {
  id: "welcome-2026-08",
  active: true,
  variant: "message",
  remember: "forever",
  delayMs: 700,
  tone: "brand",
  eyebrow: "New this month",
  title: "Free migration, now done in under 4 hours",
  body: "Moving in from another host? Raise a migration ticket and our team will move your sites, mail and databases for you — no downtime, no charge.",
  cta: { label: "Start a migration", href: "/dashboard/tickets/new" },
  dismissLabel: "Maybe later",
};

/* --------------------------------------------------------------------
 * Image-banner example — swap it in by replacing the object above.
 *
 * export const dashboardAnnouncement: DashboardAnnouncement = {
 *   id: "monsoon-sale-2026",
 *   active: true,
 *   variant: "image",
 *   remember: "session",
 *   delayMs: 700,
 *   title: "Monsoon sale — 60% off every plan",
 *   body: "Ends 30 September.",
 *   image: {
 *     src: "/banners/monsoon-sale.jpg",
 *     width: 1200,
 *     height: 800,
 *     alt: "Monsoon sale: 60% off all hosting plans until 30 September",
 *   },
 *   cta: { label: "View plans", href: "/pricing" },
 * };
 * ------------------------------------------------------------------ */
