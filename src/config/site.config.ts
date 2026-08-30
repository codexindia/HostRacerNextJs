/**
 * ════════════════════════════════════════════════════════════════════
 *  SITE CONFIGURATION — the single place to edit brand-level values
 * ════════════════════════════════════════════════════════════════════
 *
 *  Everything about *who the site is* lives here: name, logo, colours,
 *  fonts, contact details, social links, headline numbers and navigation.
 *
 *  The colour palette below is the real source of truth. `cssVariables`
 *  turns it into custom properties that the root layout injects, and
 *  `globals.css` maps Tailwind's theme onto those same properties — so
 *  changing a hex here changes every `bg-brand-500`, `text-flag-400`
 *  and so on across the site. There is no second copy to keep in sync.
 *
 *  Rebranding checklist:
 *    1. `identity`  — name, tagline, domain
 *    2. `logo`      — drop a new file in /public/brand and set width/height
 *    3. `colors`    — brand, accent and ink scales
 *    4. `fonts`     — also update the next/font imports in app/layout.tsx
 * ════════════════════════════════════════════════════════════════════
 */

/* ------------------------------------------------------------------ */
/* 1. Identity                                                         */
/* ------------------------------------------------------------------ */

export const identity = {
  name: "Hostracer",
  legalName: "CodexIndia Technology Solutions",
  domain: "hostracer.in",
  url: "https://hostracer.in",
  tagline: "All-in-one web hosting, built for speed.",
  description:
    "Fast, reliable and secure hosting for Indian businesses. NVMe storage, free SSL, free domain and 24×7 human support — from ₹59/month.",
  /** BCP-47 locale, used for <html lang> and number/date formatting. */
  locale: "en-IN",
  /** Currency for every price on the site. */
  currency: "INR",
} as const;

/* ------------------------------------------------------------------ */
/* 2. Logo                                                             */
/* ------------------------------------------------------------------ */

export const logo = {
  /** Path under /public. Transparent PNG or SVG. */
  src: "/brand/logo.png",
  /** Intrinsic pixel size — drives the aspect ratio, never stretch this. */
  width: 1288,
  height: 220,
  alt: identity.name,
  /**
   * The wordmark is a violet→indigo gradient. It reads well on light
   * surfaces but drops to ~3.1:1 at the indigo end on near-black, so on
   * dark bands we knock it out to solid white instead.
   */
  invertOnDark: true,
  /** Default rendered height in the header, in px. */
  headerHeight: 29,
} as const;

/* ------------------------------------------------------------------ */
/* 3. Colours                                                          */
/* ------------------------------------------------------------------ */

export const colors = {
  /** Brand: violet→indigo, sampled from the logo. */
  brand: {
    50: "#f4f1ff",
    100: "#ebe5ff",
    200: "#d9cdff",
    300: "#bfa8ff",
    400: "#a179fb",
    500: "#8b5cf6",
    600: "#6d40e4",
    700: "#5a2fc4",
    800: "#4a289f",
    900: "#3d2480",
  },

  /** The exact endpoints of the logo gradient. */
  racer: {
    from: "#a855f7",
    to: "#4f46e5",
  },

  /** Action accent — saffron. CTAs, badges, "go" cues. */
  flag: {
    50: "#fff8ed",
    100: "#ffedd2",
    200: "#ffd7a4",
    300: "#ffba6b",
    400: "#ff9d2e",
    500: "#f97f0a",
    600: "#e06104",
    700: "#b94608",
    800: "#93380e",
    900: "#78300f",
  },

  /** Graphite — the dark cockpit surfaces. */
  ink: {
    50: "#f6f6f8",
    100: "#ececf0",
    200: "#d6d6e0",
    300: "#b1b1c4",
    400: "#8585a1",
    500: "#676785",
    600: "#52526c",
    700: "#434358",
    800: "#2a2a3c",
    850: "#1e1e2c",
    900: "#14141f",
    950: "#0a0a12",
  },

  /** Status colours — uptime, warnings, outages, form errors. */
  signal: {
    ok: "#16a34a",
    warn: "#d97706",
    down: "#dc2626",
  },

  /** Semantic surfaces for the light theme. */
  light: {
    canvas: "#fbfaf9",
    surface: "#ffffff",
    surface2: "#f5f4f7",
    line: "#e7e5ea",
    lineStrong: "#d5d2dc",
    content: "#14141f",
    contentMuted: "#52526c",
    contentSubtle: "#8585a1",
  },

  /** Semantic surfaces for the dark theme. */
  dark: {
    canvas: "#0a0a12",
    surface: "#14141f",
    surface2: "#1e1e2c",
    line: "#272738",
    lineStrong: "#3a3a50",
    content: "#f4f4f7",
    contentMuted: "#a6a6bd",
    contentSubtle: "#7c7c96",
  },
} as const;

/* ------------------------------------------------------------------ */
/* 4. Typography                                                       */
/* ------------------------------------------------------------------ */

export const fonts = {
  /** Headings. Loaded via next/font in app/layout.tsx. */
  display: "Sora",
  /** Body copy. */
  sans: "Manrope",
  /** Prices, specs, telemetry — anything that must not jitter. */
  mono: "JetBrains Mono",
} as const;

/* ------------------------------------------------------------------ */
/* 5. Contact & social                                                 */
/* ------------------------------------------------------------------ */

export const contact = {
  phone: "+91 85094 35513",
  phoneHref: "tel:+918509435513",
  whatsapp: "https://wa.me/918509435513",
  email: "info@hostracer.in",
  emailHref: "mailto:info@hostracer.in",
  hours: "24×7, every day of the year",
} as const;

export const social = {
  instagram: "https://instagram.com/hostracer",
  telegram: "https://t.me/hostracer",
  youtube: "https://youtube.com/channel/UCjep-XC8L_-jXjqjHt5ODSw",
  trustpilot: "https://www.trustpilot.com/review/hostracer.in",
} as const;

/* ------------------------------------------------------------------ */
/* 6. Headline numbers & promises                                      */
/* ------------------------------------------------------------------ */

export const stats = {
  customers: "5,000+",
  states: "27+",
  rating: "4.9/5",
  uptime: "99.9%",
  responseMs: 45,
  sslGrade: "A+",
} as const;

export const guarantees = {
  refundDays: 7,
  uptime: "99.9%",
} as const;

/* ------------------------------------------------------------------ */
/* 7. SEO defaults                                                     */
/* ------------------------------------------------------------------ */

export const seo = {
  keywords: [
    "web hosting India",
    "cheap hosting India",
    "VPS hosting India",
    "domain registration India",
    "reseller hosting",
    "WordPress hosting",
    "NVMe hosting",
    "cPanel hosting",
  ],
  /** Open Graph locale. */
  ogLocale: "en_IN",
  twitterCard: "summary_large_image",
} as const;

/* ------------------------------------------------------------------ */
/* 8. Navigation                                                       */
/* ------------------------------------------------------------------ */

export type MegaMenuItem = {
  title: string;
  href: string;
  blurb: string;
  /** lucide-react icon name, resolved at render time */
  icon: string;
  price?: string;
  badge?: string;
};

export type NavEntry =
  | { label: string; href: string; type: "link" }
  | {
      label: string;
      type: "mega";
      columns: { heading: string; items: MegaMenuItem[] }[];
      footer?: { label: string; href: string };
    };

export const primaryNav: NavEntry[] = [
  {
    label: "Hosting",
    type: "mega",
    columns: [
      {
        heading: "Web hosting",
        items: [
          {
            title: "Shared Hosting",
            href: "/hosting/shared",
            blurb: "NVMe storage, free SSL and a free domain for a year.",
            icon: "Globe",
            price: "From ₹59/mo",
            badge: "Popular",
          },
          {
            title: "WordPress Hosting",
            href: "/hosting/wordpress",
            blurb: "One-click installs, auto updates and LiteSpeed cache.",
            icon: "Layers",
            price: "From ₹99/mo",
          },
          {
            title: "Reseller Hosting",
            href: "/hosting/reseller",
            blurb: "White-label cPanel/WHM to start your own hosting brand.",
            icon: "Users",
            price: "From ₹299/mo",
          },
        ],
      },
      {
        heading: "Servers",
        items: [
          {
            title: "VPS Hosting",
            href: "/vps",
            blurb: "Full root access, dedicated vCPU and NVMe SSD.",
            icon: "Server",
            price: "From ₹499/mo",
            badge: "New",
          },
          {
            title: "Network Status",
            href: "/status",
            blurb: "Live uptime for every node and datacentre.",
            icon: "Activity",
          },
        ],
      },
    ],
    footer: { label: "Compare every hosting plan", href: "/hosting" },
  },
  {
    label: "Domains",
    type: "mega",
    columns: [
      {
        heading: "Domains",
        items: [
          {
            title: "Register a Domain",
            href: "/domains",
            blurb: "Search 400+ extensions with free WHOIS privacy.",
            icon: "Search",
            price: "From ₹250/yr",
          },
          {
            title: "Transfer a Domain",
            href: "/domains/transfer",
            blurb: "Move in and get a bonus year on most extensions.",
            icon: "ArrowLeftRight",
          },
          {
            title: "WHOIS Lookup",
            href: "/domains/whois",
            blurb: "Check who owns a domain and when it expires.",
            icon: "FileSearch",
          },
        ],
      },
    ],
    footer: { label: "See domain pricing", href: "/domains#pricing" },
  },
  { label: "Pricing", href: "/pricing", type: "link" },
  { label: "Support", href: "/support", type: "link" },
];

export const footerNav = [
  {
    heading: "Hosting",
    links: [
      { label: "Shared Hosting", href: "/hosting/shared" },
      { label: "WordPress Hosting", href: "/hosting/wordpress" },
      { label: "Reseller Hosting", href: "/hosting/reseller" },
      { label: "VPS Hosting", href: "/vps" },
      { label: "Compare plans", href: "/pricing" },
    ],
  },
  {
    heading: "Domains",
    links: [
      { label: "Register a domain", href: "/domains" },
      { label: "Transfer a domain", href: "/domains/transfer" },
      { label: "WHOIS lookup", href: "/domains/whois" },
      { label: "Domain pricing", href: "/domains#pricing" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Create account", href: "/register" },
      { label: "Sign in", href: "/login" },
      { label: "Forgot password", href: "/forgot-password" },
      { label: "Support tickets", href: "/dashboard/tickets" },
      { label: "Affiliates", href: "/affiliates" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Network status", href: "/status" },
      { label: "Knowledgebase", href: "/support" },
      { label: "Announcements", href: "/announcements" },
    ],
  },
] as const;

export const legalNav = [
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms of Service", href: "/legal/terms" },
  { label: "Refund Policy", href: "/legal/refund" },
] as const;

/* ------------------------------------------------------------------ */
/* 9. Aggregate — the shape most components import                     */
/* ------------------------------------------------------------------ */

export const site = {
  ...identity,
  logo,
  contact,
  social,
  stats,
  guarantees,
  seo,
  fonts,
} as const;

/* ------------------------------------------------------------------ */
/* 10. Palette → CSS custom properties                                 */
/* ------------------------------------------------------------------ */

const scaleVars = (prefix: string, scale: Record<string, string>) =>
  Object.entries(scale)
    .map(([step, hex]) => `--${prefix}-${step}:${hex}`)
    .join(";");

const semanticVars = (theme: typeof colors.light | typeof colors.dark) =>
  [
    `--canvas:${theme.canvas}`,
    `--surface:${theme.surface}`,
    `--surface-2:${theme.surface2}`,
    `--line:${theme.line}`,
    `--line-strong:${theme.lineStrong}`,
    `--content:${theme.content}`,
    `--content-muted:${theme.contentMuted}`,
    `--content-subtle:${theme.contentSubtle}`,
  ].join(";");

/**
 * The palette as a CSS string, injected once by the root layout.
 * `globals.css` maps Tailwind's `@theme` onto these properties, so this is
 * what makes the `colors` object above actually drive the site.
 */
export const cssVariables = `
:root{
${scaleVars("brand", colors.brand)};
--racer-from:${colors.racer.from};
--racer-to:${colors.racer.to};
${scaleVars("flag", colors.flag)};
${scaleVars("ink", colors.ink)};
--signal-ok:${colors.signal.ok};
--signal-warn:${colors.signal.warn};
--signal-down:${colors.signal.down};
${semanticVars(colors.light)};
}
.dark{
${semanticVars(colors.dark)};
}
`.replace(/\n/g, "");
