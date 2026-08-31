/**
 * ────────────────────────────────────────────────────────────────────
 *  MOCK CLIENT-AREA DATA
 * ────────────────────────────────────────────────────────────────────
 *  Stands in for the billing/provisioning API. Shapes here are what the
 *  UI expects, so wiring the real backend means replacing the exported
 *  constants with fetches and keeping the types.
 *
 *  Dates are anchored to late August 2026 so the "renews in 12 days" and
 *  "overdue" states are actually reachable in the UI.
 * ────────────────────────────────────────────────────────────────────
 */

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

export type ServiceStatus = "active" | "pending" | "suspended" | "cancelled";
export type ServiceKind = "hosting" | "vps" | "reseller";

export type UsageMetric = {
  label: string;
  used: number;
  limit: number | null;
  unit: string;
};

export type Service = {
  id: string;
  kind: ServiceKind;
  planName: string;
  /** Primary domain or hostname the service is known by. */
  label: string;
  status: ServiceStatus;
  /** ISO date the current term ends. */
  renewsOn: string;
  registeredOn: string;
  /** Charged at renewal, before GST. */
  renewalAmount: number;
  termLabel: string;
  autoRenew: boolean;
  datacentre: string;
  ipAddress: string;
  /** cPanel/WHM username, or root user for a VPS. */
  username: string;
  nameservers: string[];
  usage: UsageMetric[];
  /** VPS only */
  specs?: { label: string; value: string }[];
};

export const services: Service[] = [
  {
    id: "srv-88214",
    kind: "hosting",
    planName: "Premium",
    label: "sharmaelectronics.in",
    status: "active",
    renewsOn: "2027-03-14",
    registeredOn: "2026-03-14",
    renewalAmount: 1299,
    termLabel: "12 months",
    autoRenew: true,
    datacentre: "Mumbai, IN",
    ipAddress: "103.148.62.17",
    username: "sharmael",
    nameservers: ["ns1.hostracer.in", "ns2.hostracer.in"],
    usage: [
      { label: "Disk", used: 8.24, limit: 30, unit: "GB" },
      { label: "Bandwidth", used: 142.6, limit: null, unit: "GB" },
      { label: "Email accounts", used: 6, limit: null, unit: "" },
      { label: "Databases", used: 3, limit: 10, unit: "" },
    ],
  },
  {
    id: "srv-90733",
    kind: "vps",
    planName: "Racer 2",
    label: "vps-mum-4471",
    status: "active",
    renewsOn: "2026-11-02",
    registeredOn: "2025-11-02",
    renewalAmount: 899,
    termLabel: "12 months",
    autoRenew: true,
    datacentre: "Mumbai, IN",
    ipAddress: "103.148.71.204",
    username: "root",
    nameservers: ["ns1.hostracer.in", "ns2.hostracer.in"],
    usage: [
      { label: "CPU", used: 18, limit: 100, unit: "%" },
      { label: "Memory", used: 2.1, limit: 4, unit: "GB" },
      { label: "Disk", used: 22.4, limit: 80, unit: "GB" },
      { label: "Bandwidth", used: 512, limit: 4096, unit: "GB" },
    ],
    specs: [
      { label: "vCPU", value: "2 cores" },
      { label: "RAM", value: "4 GB DDR4" },
      { label: "Storage", value: "80 GB NVMe" },
      { label: "OS", value: "Ubuntu 24.04 LTS" },
    ],
  },
  {
    id: "srv-91560",
    kind: "hosting",
    planName: "Starter",
    label: "kolkatabakes.com",
    status: "active",
    renewsOn: "2026-09-12",
    registeredOn: "2025-09-12",
    renewalAmount: 699,
    termLabel: "12 months",
    autoRenew: false,
    datacentre: "Mumbai, IN",
    ipAddress: "103.148.62.44",
    username: "kolkatab",
    nameservers: ["ns1.hostracer.in", "ns2.hostracer.in"],
    usage: [
      { label: "Disk", used: 3.12, limit: 5, unit: "GB" },
      { label: "Bandwidth", used: 27.8, limit: null, unit: "GB" },
      { label: "Email accounts", used: 2, limit: 5, unit: "" },
      { label: "Databases", used: 1, limit: 5, unit: "" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Domains                                                             */
/* ------------------------------------------------------------------ */

export type DnsRecord = {
  id: string;
  type: "A" | "AAAA" | "CNAME" | "MX" | "TXT" | "NS";
  host: string;
  value: string;
  ttl: number;
  priority?: number;
};

export type Domain = {
  id: string;
  name: string;
  status: "active" | "expiring" | "expired" | "transfer-in";
  registeredOn: string;
  expiresOn: string;
  autoRenew: boolean;
  /** Registrar lock against unauthorised transfers. */
  locked: boolean;
  privacy: boolean;
  renewalAmount: number;
  nameservers: string[];
  records: DnsRecord[];
  /** Who the registration actually sits with — not all of these are ours. */
  registrar: string;
  /** EPP/auth code. Needed to move the domain to another registrar. */
  authCode: string;
  dnssec: boolean;
  /**
   * Registry rules lock a domain for 60 days after registration or an
   * inbound transfer, so the manage page has to show a date, not a flag.
   */
  transferEligibleOn: string;
  registrant: Registrant;
};

/**
 * WHOIS registrant. One contact is reused across the account here; the
 * real API returns a per-domain contact set (registrant/admin/tech/billing).
 */
export type Registrant = {
  name: string;
  organisation?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
};

const defaultRegistrant: Registrant = {
  name: "Sudipto Bain",
  organisation: "Sharma Electronics",
  email: "billing@sharmaelectronics.in",
  phone: "+91 98304 41127",
  address: "14/2 Jessore Road, Flat 3B",
  city: "Kolkata",
  state: "West Bengal",
  postcode: "700055",
  country: "India",
};

export const domains: Domain[] = [
  {
    id: "dom-3391",
    name: "sharmaelectronics.in",
    status: "active",
    registeredOn: "2026-03-14",
    expiresOn: "2027-03-14",
    autoRenew: true,
    locked: true,
    privacy: true,
    renewalAmount: 799,
    registrar: "Hostracer (Registrar of record: Endurance)",
    authCode: "Hr7#kQ2mZp4x",
    dnssec: false,
    transferEligibleOn: "2026-05-13",
    registrant: defaultRegistrant,
    nameservers: ["ns1.hostracer.in", "ns2.hostracer.in"],
    records: [
      { id: "r1", type: "A", host: "@", value: "103.148.62.17", ttl: 14400 },
      { id: "r2", type: "A", host: "www", value: "103.148.62.17", ttl: 14400 },
      {
        id: "r3",
        type: "MX",
        host: "@",
        value: "mail.sharmaelectronics.in",
        ttl: 14400,
        priority: 10,
      },
      {
        id: "r4",
        type: "TXT",
        host: "@",
        value: "v=spf1 +a +mx +ip4:103.148.62.17 ~all",
        ttl: 14400,
      },
      { id: "r5", type: "CNAME", host: "shop", value: "@", ttl: 14400 },
    ],
  },
  {
    id: "dom-3402",
    name: "kolkatabakes.com",
    status: "expiring",
    registeredOn: "2025-09-12",
    expiresOn: "2026-09-12",
    autoRenew: false,
    locked: true,
    privacy: false,
    renewalAmount: 1250,
    registrar: "Hostracer (transferred in from GoDaddy)",
    authCode: "Bk9$wR6tLn1c",
    dnssec: false,
    transferEligibleOn: "2025-11-11",
    registrant: defaultRegistrant,
    nameservers: ["ns1.hostracer.in", "ns2.hostracer.in"],
    records: [
      { id: "r1", type: "A", host: "@", value: "103.148.62.44", ttl: 14400 },
      { id: "r2", type: "A", host: "www", value: "103.148.62.44", ttl: 14400 },
      {
        id: "r3",
        type: "TXT",
        host: "@",
        value: "google-site-verification=jK2p9xQ4mB",
        ttl: 3600,
      },
    ],
  },
  {
    id: "dom-3517",
    name: "rajtravels.co.in",
    status: "active",
    registeredOn: "2026-01-08",
    expiresOn: "2027-01-08",
    autoRenew: true,
    locked: true,
    privacy: true,
    renewalAmount: 699,
    registrar: "Hostracer (Registrar of record: Endurance)",
    authCode: "Vm3@sD8yTf5q",
    dnssec: true,
    transferEligibleOn: "2026-03-09",
    registrant: defaultRegistrant,
    nameservers: ["ns1.hostracer.in", "ns2.hostracer.in"],
    records: [
      { id: "r1", type: "A", host: "@", value: "103.148.62.17", ttl: 14400 },
      { id: "r2", type: "CNAME", host: "www", value: "@", ttl: 14400 },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Invoices                                                            */
/* ------------------------------------------------------------------ */

export type InvoiceStatus = "paid" | "unpaid" | "overdue" | "refunded";

export type InvoiceLine = {
  description: string;
  period: string;
  amount: number;
};

export type Invoice = {
  id: string;
  number: string;
  status: InvoiceStatus;
  issuedOn: string;
  dueOn: string;
  paidOn?: string;
  lines: InvoiceLine[];
  subtotal: number;
  discount: number;
  promoCode?: string;
  gst: number;
  total: number;
  method?: string;
  transactionId?: string;
};

export const invoices: Invoice[] = [
  {
    id: "inv-0733",
    number: "HR/2026-27/0733",
    status: "unpaid",
    issuedOn: "2026-08-28",
    dueOn: "2026-09-12",
    lines: [
      {
        description: "Starter hosting — kolkatabakes.com",
        period: "12 Sep 2026 – 12 Sep 2027",
        amount: 699,
      },
      {
        description: "Domain renewal — kolkatabakes.com",
        period: "12 Sep 2026 – 12 Sep 2027",
        amount: 1250,
      },
    ],
    subtotal: 1949,
    discount: 0,
    gst: 351,
    total: 2300,
  },
  {
    id: "inv-0518",
    number: "HR/2026-27/0518",
    status: "paid",
    issuedOn: "2026-05-02",
    dueOn: "2026-05-09",
    paidOn: "2026-05-02",
    lines: [
      {
        description: "Racer 2 VPS — vps-mum-4471",
        period: "02 Nov 2025 – 02 Nov 2026",
        amount: 899,
      },
    ],
    subtotal: 899,
    discount: 0,
    gst: 162,
    total: 1061,
    method: "UPI",
    transactionId: "UPI/418823094771",
  },
  {
    id: "inv-0412",
    number: "HR/2025-26/0412",
    status: "paid",
    issuedOn: "2026-03-14",
    dueOn: "2026-03-21",
    paidOn: "2026-03-14",
    lines: [
      {
        description: "Premium hosting — sharmaelectronics.in",
        period: "14 Mar 2026 – 14 Mar 2027",
        amount: 1299,
      },
      {
        description: "Domain registration — sharmaelectronics.in",
        period: "14 Mar 2026 – 14 Mar 2027",
        amount: 0,
      },
    ],
    subtotal: 1299,
    discount: 130,
    promoCode: "WELCOME",
    gst: 210,
    total: 1379,
    method: "Card",
    transactionId: "pay_QK4mB29xLp7Rt",
  },
  {
    id: "inv-0189",
    number: "HR/2025-26/0189",
    status: "paid",
    issuedOn: "2025-09-12",
    dueOn: "2025-09-19",
    paidOn: "2025-09-13",
    lines: [
      {
        description: "Starter hosting — kolkatabakes.com",
        period: "12 Sep 2025 – 12 Sep 2026",
        amount: 699,
      },
      {
        description: "Domain registration — kolkatabakes.com",
        period: "12 Sep 2025 – 12 Sep 2026",
        amount: 1050,
      },
    ],
    subtotal: 1749,
    discount: 0,
    gst: 315,
    total: 2064,
    method: "Net banking",
    transactionId: "NB/HDFC/77219034",
  },
];

/* ------------------------------------------------------------------ */
/* Support tickets                                                     */
/* ------------------------------------------------------------------ */

export type TicketStatus = "open" | "awaiting-reply" | "answered" | "closed";
export type TicketPriority = "low" | "normal" | "high";

export type TicketMessage = {
  id: string;
  author: string;
  /** Staff replies are badged and aligned differently. */
  fromStaff: boolean;
  sentAt: string;
  body: string;
};

export type Ticket = {
  id: string;
  number: string;
  subject: string;
  department: "Technical" | "Billing" | "Sales";
  status: TicketStatus;
  priority: TicketPriority;
  openedOn: string;
  updatedOn: string;
  relatedTo?: string;
  messages: TicketMessage[];
};

export const tickets: Ticket[] = [
  {
    id: "tkt-49107",
    number: "#49107",
    subject: "SSL certificate not renewing on shop subdomain",
    department: "Technical",
    status: "answered",
    priority: "high",
    openedOn: "2026-08-27T09:12:00+05:30",
    updatedOn: "2026-08-28T11:41:00+05:30",
    relatedTo: "sharmaelectronics.in",
    messages: [
      {
        id: "m1",
        author: "You",
        fromStaff: false,
        sentAt: "2026-08-27T09:12:00+05:30",
        body: "The main site loads fine on https but shop.sharmaelectronics.in shows a certificate warning since yesterday. Customers are seeing the browser warning page. Please check.",
      },
      {
        id: "m2",
        author: "Ankit — Hostracer Support",
        fromStaff: true,
        sentAt: "2026-08-27T09:48:00+05:30",
        body: "Thanks for flagging this. The AutoSSL run for that subdomain failed because the CNAME for 'shop' was still pointing at the old host when the certificate was due. I've corrected the record and queued a fresh issuance.\n\nGive it about 15 minutes and clear your browser cache before testing.",
      },
      {
        id: "m3",
        author: "You",
        fromStaff: false,
        sentAt: "2026-08-28T10:20:00+05:30",
        body: "Checked this morning, the warning is gone. Is there anything I should do so it doesn't happen at the next renewal?",
      },
      {
        id: "m4",
        author: "Ankit — Hostracer Support",
        fromStaff: true,
        sentAt: "2026-08-28T11:41:00+05:30",
        body: "Nothing further from your side. Now that the DNS points here, AutoSSL will renew it automatically about 30 days before expiry. I've also added a monitor on that subdomain so we'll catch it before you do if it ever fails again.",
      },
    ],
  },
  {
    id: "tkt-49330",
    number: "#49330",
    subject: "GSTIN missing on invoice HR/2026-27/0518",
    department: "Billing",
    status: "awaiting-reply",
    priority: "normal",
    openedOn: "2026-08-29T16:05:00+05:30",
    updatedOn: "2026-08-30T10:12:00+05:30",
    messages: [
      {
        id: "m1",
        author: "You",
        fromStaff: false,
        sentAt: "2026-08-29T16:05:00+05:30",
        body: "Our accountant needs the GSTIN printed on the May invoice for input credit. It's showing blank. Can you reissue it?",
      },
      {
        id: "m2",
        author: "Meera — Hostracer Billing",
        fromStaff: true,
        sentAt: "2026-08-30T10:12:00+05:30",
        body: "Happy to reissue. The GSTIN field was empty on your billing profile when that invoice was generated, which is why it printed blank.\n\nCould you confirm the GSTIN you'd like on it? Once you reply I'll issue a revised copy the same day — it'll keep the original invoice number with an 'R1' suffix, which is what your accountant will want for the credit claim.",
      },
    ],
  },
  {
    id: "tkt-48213",
    number: "#48213",
    subject: "Migration from previous host — 3 sites",
    department: "Technical",
    status: "closed",
    priority: "normal",
    openedOn: "2026-03-14T12:30:00+05:30",
    updatedOn: "2026-03-16T18:22:00+05:30",
    messages: [
      {
        id: "m1",
        author: "You",
        fromStaff: false,
        sentAt: "2026-03-14T12:30:00+05:30",
        body: "Just signed up for the Premium plan. I have three WordPress sites on my old host that need moving. cPanel login details are in the attached note.",
      },
      {
        id: "m2",
        author: "Ankit — Hostracer Support",
        fromStaff: true,
        sentAt: "2026-03-14T14:05:00+05:30",
        body: "Received, thanks. I'll start with a full backup of all three before touching anything. Expect the copies to be live on our servers by tomorrow evening — I'll set them up on temporary URLs first so you can check everything before we switch the DNS.",
      },
      {
        id: "m3",
        author: "Ankit — Hostracer Support",
        fromStaff: true,
        sentAt: "2026-03-16T18:22:00+05:30",
        body: "All three are live and the DNS has propagated. Two notes: your contact form plugin was three major versions behind so I've updated it, and the old host had PHP 7.4 — you're on 8.3 now, which is why the site feels quicker.\n\nI'll leave this ticket open for a week in case anything surfaces. Nothing to pay for the migration.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Activity feed                                                       */
/* ------------------------------------------------------------------ */

export type ActivityKind =
  | "payment"
  | "service"
  | "domain"
  | "security"
  | "ticket";

export type ActivityEntry = {
  id: string;
  kind: ActivityKind;
  title: string;
  detail: string;
  at: string;
};

export const activity: ActivityEntry[] = [
  {
    id: "a1",
    kind: "ticket",
    title: "Billing replied to your ticket",
    detail: "#49330 — GSTIN missing on invoice HR/2026-27/0518",
    at: "2026-08-30T10:12:00+05:30",
  },
  {
    id: "a2",
    kind: "service",
    title: "Invoice generated",
    detail: "HR/2026-27/0733 for ₹2,300 — due 12 Sep 2026",
    at: "2026-08-28T06:00:00+05:30",
  },
  {
    id: "a3",
    kind: "security",
    title: "New sign-in from Kolkata, IN",
    detail: "Chrome on Windows · 103.211.44.8",
    at: "2026-08-28T21:14:00+05:30",
  },
  {
    id: "a4",
    kind: "domain",
    title: "SSL certificate reissued",
    detail: "shop.sharmaelectronics.in — valid until 26 Nov 2026",
    at: "2026-08-27T10:03:00+05:30",
  },
  {
    id: "a5",
    kind: "service",
    title: "Backup completed",
    detail: "sharmaelectronics.in — 8.2 GB, stored off-site",
    at: "2026-08-27T02:30:00+05:30",
  },
  {
    id: "a6",
    kind: "payment",
    title: "Payment received",
    detail: "₹1,061 via UPI for HR/2026-27/0518",
    at: "2026-05-02T13:41:00+05:30",
  },
];

/* ------------------------------------------------------------------ */
/* Security — sessions the settings page lists                         */
/* ------------------------------------------------------------------ */

export type LoginSession = {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  current: boolean;
};

export const sessions: LoginSession[] = [
  {
    id: "s1",
    device: "Windows 11",
    browser: "Chrome 141",
    location: "Kolkata, IN",
    ip: "103.211.44.8",
    lastActive: "2026-08-31T00:40:00+05:30",
    current: true,
  },
  {
    id: "s2",
    device: "iPhone 15",
    browser: "Safari 18",
    location: "Kolkata, IN",
    ip: "49.37.128.66",
    lastActive: "2026-08-29T19:22:00+05:30",
    current: false,
  },
  {
    id: "s3",
    device: "macOS Sonoma",
    browser: "Firefox 133",
    location: "Pune, IN",
    ip: "117.96.203.11",
    lastActive: "2026-08-14T11:05:00+05:30",
    current: false,
  },
];

/* ------------------------------------------------------------------ */
/* Affiliate programme                                                 */
/* ------------------------------------------------------------------ */

/**
 * A referral is only payable once the customer is past the refund window,
 * which is why "pending" is the busiest state in the table — commission is
 * earned at signup but held until the order can no longer be reversed.
 */
export type ReferralStatus = "pending" | "approved" | "paid" | "reversed";

export type Referral = {
  id: string;
  /** Partly masked: affiliates see enough to recognise a lead, not to contact one. */
  customer: string;
  signedUpOn: string;
  product: string;
  /** Ex-GST value of the first invoice — commission is calculated on this. */
  orderValue: number;
  commission: number;
  status: ReferralStatus;
  /** When the hold clears. Absent once it already has. */
  clearsOn?: string;
  /** Only set on a reversal, so the affiliate knows why it vanished. */
  note?: string;
};

export type PayoutStatus = "paid" | "processing";

export type Payout = {
  id: string;
  requestedOn: string;
  paidOn?: string;
  amount: number;
  method: string;
  reference?: string;
  status: PayoutStatus;
};

export const referrals: Referral[] = [
  {
    id: "ref-2481",
    customer: "a****n@gmail.com",
    signedUpOn: "2026-08-24",
    product: "Premium hosting · 12 months",
    orderValue: 1299,
    commission: 520,
    status: "pending",
    clearsOn: "2026-10-08",
  },
  {
    id: "ref-2477",
    customer: "info@****kart.in",
    signedUpOn: "2026-08-19",
    product: "Racer 2 VPS · 12 months",
    orderValue: 899,
    commission: 180,
    status: "pending",
    clearsOn: "2026-10-03",
  },
  {
    id: "ref-2462",
    customer: "s****a@outlook.com",
    signedUpOn: "2026-08-02",
    product: "Starter hosting · 12 months",
    orderValue: 699,
    commission: 280,
    status: "approved",
  },
  {
    id: "ref-2455",
    customer: "hello@****studio.co.in",
    signedUpOn: "2026-07-28",
    product: "Domain · .in · 2 years",
    orderValue: 1398,
    commission: 100,
    status: "approved",
  },
  {
    id: "ref-2431",
    customer: "r****v@gmail.com",
    signedUpOn: "2026-07-11",
    product: "Business hosting · 12 months",
    orderValue: 2499,
    commission: 1000,
    status: "paid",
  },
  {
    id: "ref-2418",
    customer: "accounts@****foods.com",
    signedUpOn: "2026-06-30",
    product: "Premium hosting · 12 months",
    orderValue: 1299,
    commission: 520,
    status: "paid",
  },
  {
    id: "ref-2402",
    customer: "m****d@yahoo.in",
    signedUpOn: "2026-06-14",
    product: "Starter hosting · 12 months",
    orderValue: 699,
    commission: 280,
    status: "reversed",
    note: "Refunded within 7 days",
  },
];

export const payouts: Payout[] = [
  {
    id: "po-0114",
    requestedOn: "2026-07-01",
    paidOn: "2026-07-04",
    amount: 3200,
    method: "UPI · sudipto@okhdfcbank",
    reference: "UTR 419023774851",
    status: "paid",
  },
  {
    id: "po-0098",
    requestedOn: "2026-04-01",
    paidOn: "2026-04-03",
    amount: 5400,
    method: "Bank transfer · HDFC ••4471",
    reference: "UTR 388154022190",
    status: "paid",
  },
  {
    id: "po-0081",
    requestedOn: "2026-01-02",
    paidOn: "2026-01-06",
    amount: 2100,
    method: "Account credit",
    reference: "CR-88213",
    status: "paid",
  },
];

/**
 * Commission is a share of the first invoice, not of the renewal — the
 * rate differs by product because margins do.
 */
export const commissionRates = [
  { product: "Shared & business hosting", rate: "40% of the first invoice" },
  { product: "VPS and reseller", rate: "20% of the first invoice" },
  { product: "Domain registration", rate: "₹100 flat, per domain" },
  { product: "Renewals", rate: "Not commissionable" },
];

export const affiliate = {
  code: "SUDIPTO24",
  joinedOn: "2025-11-18",
  /** Attribution window for the referral cookie. */
  cookieDays: 60,
  /** Refund window a referral has to clear before it can be paid. */
  holdDays: 45,
  minPayout: 2000,
  /** Clicks on any link carrying the code, deduplicated by IP per day. */
  clicks: { last30: 412, allTime: 3184 },
  payoutMethod: "UPI · sudipto@okhdfcbank",
} as const;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Anchors "days until" maths so the mock data reads consistently. */
export const TODAY = new Date("2026-08-31T00:00:00+05:30");

export function daysUntil(iso: string): number {
  const then = new Date(iso).getTime();
  return Math.ceil((then - TODAY.getTime()) / 86_400_000);
}

export function getService(id: string) {
  return services.find((s) => s.id === id);
}

/**
 * The single meter worth showing in a list view. Storage is the one that
 * actually takes a site down when it runs out, so it beats CPU or memory
 * for an at-a-glance read — and keeps hosting and VPS rows consistent.
 */
export function primaryMetric(service: Service): UsageMetric {
  return service.usage.find((m) => m.label === "Disk") ?? service.usage[0];
}

export function getDomain(id: string) {
  return domains.find((d) => d.id === id);
}

export function getInvoice(id: string) {
  return invoices.find((i) => i.id === id);
}

export function getTicket(id: string) {
  return tickets.find((t) => t.id === id);
}

export const outstandingTotal = invoices
  .filter((i) => i.status === "unpaid" || i.status === "overdue")
  .reduce((sum, i) => sum + i.total, 0);

export function getDomainByName(name: string) {
  return domains.find((d) => d.name === name);
}

/** Held until the refund window closes. */
export const pendingCommission = referrals
  .filter((r) => r.status === "pending")
  .reduce((sum, r) => sum + r.commission, 0);

/** Cleared and requestable, once it is over `affiliate.minPayout`. */
export const availableCommission = referrals
  .filter((r) => r.status === "approved")
  .reduce((sum, r) => sum + r.commission, 0);

/** Everything ever earned, reversals excluded. */
export const lifetimeCommission = referrals
  .filter((r) => r.status !== "reversed")
  .reduce((sum, r) => sum + r.commission, 0);

/** Signups that stuck, as a share of clicks — the number affiliates optimise. */
export const conversionRate =
  (referrals.filter((r) => r.status !== "reversed").length /
    affiliate.clicks.allTime) *
  100;
