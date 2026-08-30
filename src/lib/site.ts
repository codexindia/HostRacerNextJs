/**
 * Single source of truth for company-level copy, contact details and navigation.
 * Content mirrors hostracer.in — swap freely once the backend lands.
 */

export const site = {
  name: "Hostracer",
  legalName: "CodexIndia Technology Solutions",
  domain: "hostracer.in",
  url: "https://hostracer.in",
  tagline: "All-in-one web hosting, built for speed.",
  description:
    "Fast, reliable and secure hosting for Indian businesses. NVMe storage, free SSL, free domain and 24×7 human support — from ₹59/month.",
  contact: {
    phone: "+91 85094 35513",
    phoneHref: "tel:+918509435513",
    whatsapp: "https://wa.me/918509435513",
    email: "info@hostracer.in",
    emailHref: "mailto:info@hostracer.in",
    hours: "24×7, every day of the year",
  },
  social: {
    instagram: "https://instagram.com/hostracer",
    telegram: "https://t.me/hostracer",
    youtube: "https://youtube.com/channel/UCjep-XC8L_-jXjqjHt5ODSw",
    trustpilot: "https://www.trustpilot.com/review/hostracer.in",
  },
  stats: {
    customers: "5,000+",
    states: "27+",
    rating: "4.9/5",
    uptime: "99.9%",
    responseMs: 45,
    sslGrade: "A+",
  },
  guarantees: {
    refundDays: 7,
    uptime: "99.9%",
  },
} as const;

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
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
