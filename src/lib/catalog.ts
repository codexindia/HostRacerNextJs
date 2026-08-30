/**
 * Product catalogue. Prices and features mirror hostracer.in, extended into the
 * multi-term structure the cart and checkout need.
 *
 * NOTE: this is the seam for the backend. Every consumer reads through the
 * helpers at the bottom of this file, so swapping these constants for API calls
 * later means changing this module only.
 */

export type BillingCycleId = "1mo" | "12mo" | "24mo" | "48mo";

export type BillingCycle = {
  id: BillingCycleId;
  label: string;
  shortLabel: string;
  months: number;
  /** Marketing ribbon on the term switcher */
  note?: string;
};

export const billingCycles: BillingCycle[] = [
  { id: "1mo", label: "1 month", shortLabel: "Monthly", months: 1 },
  {
    id: "12mo",
    label: "12 months",
    shortLabel: "1 year",
    months: 12,
    note: "Free domain",
  },
  {
    id: "24mo",
    label: "24 months",
    shortLabel: "2 years",
    months: 24,
    note: "Best value",
  },
  { id: "48mo", label: "48 months", shortLabel: "4 years", months: 48 },
];

export const DEFAULT_CYCLE: BillingCycleId = "12mo";

/**
 * Per-term pricing. `monthly` is the advertised rate; `mrpMonthly` is the
 * strike-through.
 *
 * `total` exists because the advertised monthly rate is a rounded figure —
 * ₹1,299/year reads as "₹109/mo", but 109 × 12 is ₹1,308. Where a headline
 * annual price is published, set `total` so checkout charges exactly that.
 * Terms without one fall back to monthly × months.
 */
export type TermPrice = {
  monthly: number;
  mrpMonthly: number;
  total?: number;
};

export type PlanCategory = "shared" | "wordpress" | "reseller" | "vps";

export type PlanSpec = { label: string; value: string };

export type Plan = {
  id: string;
  slug: string;
  name: string;
  category: PlanCategory;
  tagline: string;
  badge?: string;
  /** Highlighted card in the pricing grid */
  featured?: boolean;
  /** Free domain included on terms of 12 months or longer */
  freeDomain: boolean;
  specs: PlanSpec[];
  features: string[];
  prices: Record<BillingCycleId, TermPrice>;
};

/* ------------------------------------------------------------------ */
/* Shared hosting                                                      */
/* ------------------------------------------------------------------ */

export const sharedPlans: Plan[] = [
  {
    id: "shared-starter",
    slug: "starter",
    name: "Starter",
    category: "shared",
    tagline: "For a first website that needs to be online today.",
    freeDomain: true,
    specs: [
      { label: "Websites", value: "1" },
      { label: "NVMe storage", value: "5 GB" },
      { label: "Bandwidth", value: "Unmetered" },
      { label: "Databases", value: "5 MySQL" },
      { label: "Email accounts", value: "5" },
    ],
    features: [
      "1 website",
      "5 GB NVMe storage",
      "5 MySQL databases",
      "Free domain for 1 year",
      "5 free email accounts",
      "WordPress ready",
      "Free SSL certificate",
      "Free website migration",
      "24×7 human support",
    ],
    prices: {
      "1mo": { monthly: 149, mrpMonthly: 199 },
      "12mo": { monthly: 59, mrpMonthly: 99, total: 699 },
      "24mo": { monthly: 49, mrpMonthly: 99 },
      "48mo": { monthly: 45, mrpMonthly: 99 },
    },
  },
  {
    id: "shared-premium",
    slug: "premium",
    name: "Premium",
    category: "shared",
    tagline: "Room for a growing site and a proper inbox.",
    badge: "Best deal",
    featured: true,
    freeDomain: true,
    specs: [
      { label: "Websites", value: "2" },
      { label: "NVMe storage", value: "30 GB" },
      { label: "Bandwidth", value: "Unmetered" },
      { label: "Databases", value: "10 MySQL" },
      { label: "Email accounts", value: "Unlimited" },
    ],
    features: [
      "2 websites",
      "30 GB NVMe storage",
      "10 MySQL databases",
      "Free domain for 1 year",
      "Unlimited email accounts",
      "WordPress ready",
      "Free SSL for every website",
      "Daily automated backups",
      "Free website migration",
      "24×7 human support",
    ],
    prices: {
      "1mo": { monthly: 249, mrpMonthly: 329 },
      "12mo": { monthly: 109, mrpMonthly: 199, total: 1299 },
      "24mo": { monthly: 95, mrpMonthly: 199 },
      "48mo": { monthly: 89, mrpMonthly: 199 },
    },
  },
  {
    id: "shared-business",
    slug: "business",
    name: "Business",
    category: "shared",
    tagline: "Unlimited sites with priority queue support.",
    freeDomain: true,
    specs: [
      { label: "Websites", value: "Unlimited" },
      { label: "NVMe storage", value: "100 GB" },
      { label: "Bandwidth", value: "Unmetered" },
      { label: "Databases", value: "20 MySQL" },
      { label: "Email accounts", value: "Unlimited" },
    ],
    features: [
      "Unlimited websites",
      "100 GB NVMe storage",
      "20 MySQL databases",
      "Free domain for 1 year",
      "Unlimited email accounts",
      "WordPress optimised",
      "Free SSL for every website",
      "Daily automated backups",
      "Priority support queue",
      "Free website migration",
    ],
    prices: {
      "1mo": { monthly: 349, mrpMonthly: 449 },
      "12mo": { monthly: 169, mrpMonthly: 299, total: 1999 },
      "24mo": { monthly: 149, mrpMonthly: 299 },
      "48mo": { monthly: 139, mrpMonthly: 299 },
    },
  },
  {
    id: "shared-gopro",
    slug: "gopro-unlimited",
    name: "GoPro Unlimited",
    category: "shared",
    tagline: "Everything uncapped on LiteSpeed, with DDoS protection.",
    badge: "Unlimited",
    freeDomain: true,
    specs: [
      { label: "Websites", value: "1 hosted domain" },
      { label: "SSD storage", value: "Unlimited" },
      { label: "Bandwidth", value: "Unlimited" },
      { label: "Databases", value: "Unlimited" },
      { label: "Web server", value: "LiteSpeed" },
    ],
    features: [
      "1 hosted domain",
      "Unlimited SSD storage",
      "Unlimited bandwidth",
      "Unlimited MySQL databases",
      "LiteSpeed web server",
      "Free SSL + DDoS protection",
      "Daily automated backups",
      "24×7 support",
      "7-day money-back guarantee",
    ],
    prices: {
      "1mo": { monthly: 499, mrpMonthly: 649 },
      "12mo": { monthly: 249, mrpMonthly: 449, total: 2999 },
      "24mo": { monthly: 229, mrpMonthly: 449 },
      "48mo": { monthly: 209, mrpMonthly: 449 },
    },
  },
];

/* ------------------------------------------------------------------ */
/* WordPress hosting                                                   */
/* ------------------------------------------------------------------ */

export const wordpressPlans: Plan[] = [
  {
    id: "wp-launch",
    slug: "wp-launch",
    name: "WP Launch",
    category: "wordpress",
    tagline: "Managed WordPress for one site, tuned out of the box.",
    freeDomain: true,
    specs: [
      { label: "WordPress sites", value: "1" },
      { label: "NVMe storage", value: "20 GB" },
      { label: "Monthly visits", value: "~25,000" },
      { label: "Cache", value: "LiteSpeed" },
    ],
    features: [
      "1 WordPress site",
      "20 GB NVMe storage",
      "One-click WordPress install",
      "Automatic core & plugin updates",
      "LiteSpeed object cache",
      "Free domain for 1 year",
      "Free SSL certificate",
      "Daily automated backups",
      "Staging environment",
    ],
    prices: {
      "1mo": { monthly: 219, mrpMonthly: 299 },
      "12mo": { monthly: 99, mrpMonthly: 179 },
      "24mo": { monthly: 89, mrpMonthly: 179 },
      "48mo": { monthly: 82, mrpMonthly: 179 },
    },
  },
  {
    id: "wp-scale",
    slug: "wp-scale",
    name: "WP Scale",
    category: "wordpress",
    tagline: "For WooCommerce stores and content sites with traffic.",
    badge: "Most chosen",
    featured: true,
    freeDomain: true,
    specs: [
      { label: "WordPress sites", value: "5" },
      { label: "NVMe storage", value: "60 GB" },
      { label: "Monthly visits", value: "~150,000" },
      { label: "Cache", value: "LiteSpeed + Redis" },
    ],
    features: [
      "5 WordPress sites",
      "60 GB NVMe storage",
      "WooCommerce optimised",
      "Redis object caching",
      "Automatic core & plugin updates",
      "Free domain for 1 year",
      "Free SSL for every site",
      "Daily automated backups",
      "Staging + one-click rollback",
      "Priority support queue",
    ],
    prices: {
      "1mo": { monthly: 429, mrpMonthly: 549 },
      "12mo": { monthly: 199, mrpMonthly: 349 },
      "24mo": { monthly: 179, mrpMonthly: 349 },
      "48mo": { monthly: 165, mrpMonthly: 349 },
    },
  },
  {
    id: "wp-agency",
    slug: "wp-agency",
    name: "WP Agency",
    category: "wordpress",
    tagline: "Manage every client site from one dashboard.",
    freeDomain: true,
    specs: [
      { label: "WordPress sites", value: "25" },
      { label: "NVMe storage", value: "200 GB" },
      { label: "Monthly visits", value: "~500,000" },
      { label: "Cache", value: "LiteSpeed + Redis" },
    ],
    features: [
      "25 WordPress sites",
      "200 GB NVMe storage",
      "White-label client reports",
      "Redis object caching",
      "Dedicated IP address",
      "Free domain for 1 year",
      "Free SSL for every site",
      "Daily automated backups",
      "Staging + one-click rollback",
      "Priority support queue",
    ],
    prices: {
      "1mo": { monthly: 899, mrpMonthly: 1199 },
      "12mo": { monthly: 449, mrpMonthly: 799 },
      "24mo": { monthly: 399, mrpMonthly: 799 },
      "48mo": { monthly: 369, mrpMonthly: 799 },
    },
  },
];

/* ------------------------------------------------------------------ */
/* Reseller hosting                                                    */
/* ------------------------------------------------------------------ */

export const resellerPlans: Plan[] = [
  {
    id: "reseller-start",
    slug: "reseller-start",
    name: "Reseller Start",
    category: "reseller",
    tagline: "Your own hosting brand, without owning a server.",
    freeDomain: false,
    specs: [
      { label: "cPanel accounts", value: "30" },
      { label: "NVMe storage", value: "50 GB" },
      { label: "Bandwidth", value: "500 GB" },
      { label: "Control panel", value: "WHM + cPanel" },
    ],
    features: [
      "30 cPanel accounts",
      "50 GB NVMe storage",
      "500 GB bandwidth",
      "WHM + cPanel included",
      "White-label nameservers",
      "Free SSL for every account",
      "WHMCS licence at cost",
      "24×7 human support",
    ],
    prices: {
      "1mo": { monthly: 449, mrpMonthly: 599 },
      "12mo": { monthly: 299, mrpMonthly: 499 },
      "24mo": { monthly: 269, mrpMonthly: 499 },
      "48mo": { monthly: 249, mrpMonthly: 499 },
    },
  },
  {
    id: "reseller-grow",
    slug: "reseller-grow",
    name: "Reseller Grow",
    category: "reseller",
    tagline: "More accounts and headroom as your client list fills up.",
    badge: "Popular",
    featured: true,
    freeDomain: false,
    specs: [
      { label: "cPanel accounts", value: "80" },
      { label: "NVMe storage", value: "120 GB" },
      { label: "Bandwidth", value: "1.5 TB" },
      { label: "Control panel", value: "WHM + cPanel" },
    ],
    features: [
      "80 cPanel accounts",
      "120 GB NVMe storage",
      "1.5 TB bandwidth",
      "WHM + cPanel included",
      "White-label nameservers",
      "Free SSL for every account",
      "Free WHMCS licence",
      "Daily automated backups",
      "Priority support queue",
    ],
    prices: {
      "1mo": { monthly: 849, mrpMonthly: 1099 },
      "12mo": { monthly: 599, mrpMonthly: 999 },
      "24mo": { monthly: 549, mrpMonthly: 999 },
      "48mo": { monthly: 499, mrpMonthly: 999 },
    },
  },
  {
    id: "reseller-scale",
    slug: "reseller-scale",
    name: "Reseller Scale",
    category: "reseller",
    tagline: "Unlimited accounts on dedicated reseller nodes.",
    freeDomain: false,
    specs: [
      { label: "cPanel accounts", value: "Unlimited" },
      { label: "NVMe storage", value: "300 GB" },
      { label: "Bandwidth", value: "Unmetered" },
      { label: "Control panel", value: "WHM + cPanel" },
    ],
    features: [
      "Unlimited cPanel accounts",
      "300 GB NVMe storage",
      "Unmetered bandwidth",
      "WHM + cPanel included",
      "White-label nameservers",
      "Free SSL for every account",
      "Free WHMCS licence",
      "Dedicated IP address",
      "Daily automated backups",
      "Priority support queue",
    ],
    prices: {
      "1mo": { monthly: 1499, mrpMonthly: 1899 },
      "12mo": { monthly: 1099, mrpMonthly: 1799 },
      "24mo": { monthly: 999, mrpMonthly: 1799 },
      "48mo": { monthly: 929, mrpMonthly: 1799 },
    },
  },
];

/* ------------------------------------------------------------------ */
/* VPS                                                                 */
/* ------------------------------------------------------------------ */

export const vpsPlans: Plan[] = [
  {
    id: "vps-racer-1",
    slug: "racer-1",
    name: "Racer 1",
    category: "vps",
    tagline: "A dependable box for staging, bots and small apps.",
    freeDomain: false,
    specs: [
      { label: "vCPU", value: "1 core" },
      { label: "RAM", value: "2 GB" },
      { label: "NVMe storage", value: "40 GB" },
      { label: "Bandwidth", value: "2 TB" },
    ],
    features: [
      "1 dedicated vCPU core",
      "2 GB DDR4 RAM",
      "40 GB NVMe SSD",
      "2 TB monthly bandwidth",
      "Full root access",
      "1 dedicated IPv4",
      "Weekly snapshots",
      "AMD EPYC hardware",
    ],
    prices: {
      "1mo": { monthly: 649, mrpMonthly: 799 },
      "12mo": { monthly: 499, mrpMonthly: 799 },
      "24mo": { monthly: 459, mrpMonthly: 799 },
      "48mo": { monthly: 429, mrpMonthly: 799 },
    },
  },
  {
    id: "vps-racer-2",
    slug: "racer-2",
    name: "Racer 2",
    category: "vps",
    tagline: "The sweet spot for a production app plus its database.",
    badge: "Popular",
    featured: true,
    freeDomain: false,
    specs: [
      { label: "vCPU", value: "2 cores" },
      { label: "RAM", value: "4 GB" },
      { label: "NVMe storage", value: "80 GB" },
      { label: "Bandwidth", value: "4 TB" },
    ],
    features: [
      "2 dedicated vCPU cores",
      "4 GB DDR4 RAM",
      "80 GB NVMe SSD",
      "4 TB monthly bandwidth",
      "Full root access",
      "1 dedicated IPv4",
      "Daily snapshots",
      "AMD EPYC hardware",
      "Free setup & migration",
    ],
    prices: {
      "1mo": { monthly: 1099, mrpMonthly: 1399 },
      "12mo": { monthly: 899, mrpMonthly: 1399 },
      "24mo": { monthly: 829, mrpMonthly: 1399 },
      "48mo": { monthly: 779, mrpMonthly: 1399 },
    },
  },
  {
    id: "vps-racer-4",
    slug: "racer-4",
    name: "Racer 4",
    category: "vps",
    tagline: "Headroom for busy stores and multi-service stacks.",
    freeDomain: false,
    specs: [
      { label: "vCPU", value: "4 cores" },
      { label: "RAM", value: "8 GB" },
      { label: "NVMe storage", value: "160 GB" },
      { label: "Bandwidth", value: "8 TB" },
    ],
    features: [
      "4 dedicated vCPU cores",
      "8 GB DDR4 RAM",
      "160 GB NVMe SSD",
      "8 TB monthly bandwidth",
      "Full root access",
      "2 dedicated IPv4",
      "Daily snapshots",
      "AMD EPYC hardware",
      "Free setup & migration",
      "Priority support queue",
    ],
    prices: {
      "1mo": { monthly: 1999, mrpMonthly: 2499 },
      "12mo": { monthly: 1699, mrpMonthly: 2499 },
      "24mo": { monthly: 1579, mrpMonthly: 2499 },
      "48mo": { monthly: 1479, mrpMonthly: 2499 },
    },
  },
  {
    id: "vps-racer-8",
    slug: "racer-8",
    name: "Racer 8",
    category: "vps",
    tagline: "Serious compute for teams running everything in-house.",
    freeDomain: false,
    specs: [
      { label: "vCPU", value: "8 cores" },
      { label: "RAM", value: "16 GB" },
      { label: "NVMe storage", value: "320 GB" },
      { label: "Bandwidth", value: "12 TB" },
    ],
    features: [
      "8 dedicated vCPU cores",
      "16 GB DDR4 RAM",
      "320 GB NVMe SSD",
      "12 TB monthly bandwidth",
      "Full root access",
      "2 dedicated IPv4",
      "Daily snapshots",
      "AMD EPYC hardware",
      "Free setup & migration",
      "Priority support queue",
      "Dedicated account manager",
    ],
    prices: {
      "1mo": { monthly: 3699, mrpMonthly: 4499 },
      "12mo": { monthly: 3199, mrpMonthly: 4499 },
      "24mo": { monthly: 2979, mrpMonthly: 4499 },
      "48mo": { monthly: 2799, mrpMonthly: 4499 },
    },
  },
];

export const allPlans: Plan[] = [
  ...sharedPlans,
  ...wordpressPlans,
  ...resellerPlans,
  ...vpsPlans,
];

/* ------------------------------------------------------------------ */
/* Domains                                                             */
/* ------------------------------------------------------------------ */

export type Tld = {
  tld: string;
  register: number;
  renew: number;
  transfer: number;
  /** Shown as a small tag on the extension chip */
  tag?: "popular" | "cheapest" | "new" | "india";
  blurb: string;
};

export const tlds: Tld[] = [
  {
    tld: ".com",
    register: 1050,
    renew: 1250,
    transfer: 1050,
    tag: "popular",
    blurb: "The default choice, recognised everywhere.",
  },
  {
    tld: ".in",
    register: 666,
    renew: 799,
    transfer: 666,
    tag: "india",
    blurb: "India's national domain — great for local trust.",
  },
  {
    tld: ".co.in",
    register: 570,
    renew: 699,
    transfer: 570,
    tag: "india",
    blurb: "Commercial identity for Indian businesses.",
  },
  {
    tld: ".net",
    register: 700,
    renew: 899,
    transfer: 700,
    blurb: "A solid alternative for tech and infrastructure.",
  },
  {
    tld: ".xyz",
    register: 250,
    renew: 899,
    transfer: 250,
    tag: "cheapest",
    blurb: "Cheapest way to get a project online.",
  },
  {
    tld: ".org",
    register: 899,
    renew: 1050,
    transfer: 899,
    blurb: "Trusted by nonprofits and communities.",
  },
  {
    tld: ".store",
    register: 399,
    renew: 2499,
    transfer: 399,
    blurb: "Say exactly what you do — sell things.",
  },
  {
    tld: ".online",
    register: 299,
    renew: 1899,
    transfer: 299,
    blurb: "Broad and available when .com is taken.",
  },
  {
    tld: ".shop",
    register: 449,
    renew: 2299,
    transfer: 449,
    blurb: "Built for retail and D2C brands.",
  },
  {
    tld: ".tech",
    register: 599,
    renew: 2999,
    transfer: 599,
    tag: "new",
    blurb: "For startups, SaaS and developer tools.",
  },
  {
    tld: ".io",
    register: 3499,
    renew: 3999,
    transfer: 3499,
    blurb: "The developer and startup favourite.",
  },
  {
    tld: ".dev",
    register: 1199,
    renew: 1399,
    transfer: 1199,
    blurb: "HTTPS-only by default, made for builders.",
  },
];

export const domainFeatures = [
  "Free WHOIS privacy protection",
  "Domain theft lock",
  "Easy DNS management",
  "Email forwarding",
] as const;

/* ------------------------------------------------------------------ */
/* Add-ons offered at checkout                                         */
/* ------------------------------------------------------------------ */

export type Addon = {
  id: string;
  name: string;
  blurb: string;
  icon: string;
  /** Charged per billing term, per year */
  pricePerYear: number;
  recommended?: boolean;
};

export const addons: Addon[] = [
  {
    id: "addon-privacy",
    name: "WHOIS privacy protection",
    blurb: "Keep your name, phone and address out of the public registry.",
    icon: "ShieldCheck",
    pricePerYear: 0,
    recommended: true,
  },
  {
    id: "addon-backup",
    name: "Daily off-site backups",
    blurb: "30 days of restore points stored in a separate datacentre.",
    icon: "DatabaseBackup",
    pricePerYear: 599,
    recommended: true,
  },
  {
    id: "addon-mail",
    name: "Professional email — 5 boxes",
    blurb: "10 GB mailboxes on your own domain, with webmail and IMAP.",
    icon: "Mail",
    pricePerYear: 899,
  },
  {
    id: "addon-seo",
    name: "SEO toolkit",
    blurb: "Rank tracking, keyword research and on-page audits.",
    icon: "TrendingUp",
    pricePerYear: 1199,
  },
];

/* ------------------------------------------------------------------ */
/* Promo codes                                                         */
/* ------------------------------------------------------------------ */

export type Promo = {
  code: string;
  label: string;
  /** Percentage off the subtotal */
  percent: number;
  minSubtotal?: number;
};

export const promos: Promo[] = [
  { code: "WELCOME", label: "10% off your first order", percent: 10 },
  {
    code: "RACER25",
    label: "25% off orders above ₹2,000",
    percent: 25,
    minSubtotal: 2000,
  },
];

export const GST_RATE = 0.18;

/* ------------------------------------------------------------------ */
/* Helpers — the read API the rest of the app uses                     */
/* ------------------------------------------------------------------ */

export function getPlan(id: string): Plan | undefined {
  return allPlans.find((p) => p.id === id);
}

export function getPlanBySlug(
  category: PlanCategory,
  slug: string,
): Plan | undefined {
  return allPlans.find((p) => p.category === category && p.slug === slug);
}

export function plansByCategory(category: PlanCategory): Plan[] {
  return allPlans.filter((p) => p.category === category);
}

export function getCycle(id: BillingCycleId): BillingCycle {
  return billingCycles.find((c) => c.id === id) ?? billingCycles[1];
}

/** Total charged up front for a plan on a given term. */
export function termTotal(plan: Plan, cycle: BillingCycleId): number {
  const price = plan.prices[cycle];
  return price.total ?? price.monthly * getCycle(cycle).months;
}

/** What the same term would have cost at list price. */
export function termMrp(plan: Plan, cycle: BillingCycleId): number {
  return plan.prices[cycle].mrpMonthly * getCycle(cycle).months;
}

export function getTld(tld: string): Tld | undefined {
  return tlds.find((t) => t.tld === tld);
}

export function findPromo(code: string): Promo | undefined {
  const normalised = code.trim().toUpperCase();
  return promos.find((p) => p.code === normalised);
}
