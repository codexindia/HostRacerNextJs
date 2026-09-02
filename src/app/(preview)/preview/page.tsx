import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { DomainSearch } from "@/components/home/domain-search";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/motion";
import { Container } from "@/components/ui/primitives";
import {
  resellerPlans,
  sharedPlans,
  vpsPlans,
  tlds,
  wordpressPlans,
  type Plan,
} from "@/lib/catalog";
import { site } from "@/config/site.config";
import { cn, inrNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Preview — new landing page",
  description:
    "Design preview of the Hostracer landing page: white, deep navy and electric blue.",
  robots: { index: false, follow: false },
};


/* ================================================================== */
/* Customer quotes — carried over from the live homepage unchanged     */
/* ================================================================== */

const testimonials = [
  {
    quote:
      "We moved our store from a host that kept going down during sales. Hostracer migrated everything free and the site loads noticeably faster now.",
    name: "Subhadeep Das",
    role: "E-commerce owner",
    city: "Kolkata",
  },
  {
    quote:
      "No hidden renewal fees is the whole reason I stayed. What I paid in year one is what I paid in year three.",
    name: "Kavitha Rajan",
    role: "Education consultant",
    city: "Chennai",
  },
  {
    quote:
      "cPanel is clean, WHM works exactly as documented, and support answers in Hindi or English within minutes. That matters at 2am.",
    name: "Rohan Kulkarni",
    role: "Web developer",
    city: "Pune",
  },
];

/* ================================================================== */
/* Hero                                                                */
/* ================================================================== */

function Hero() {
  return (
    <section className="border-b border-line bg-canvas">
      <Container>
        <div className="grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:py-24">
          <div>
            <h1 className="max-w-[16ch] text-[clamp(2.3rem,5vw,3.6rem)] leading-[1.04] font-extrabold tracking-[-0.02em] text-content">
              Your website deserves better than{" "}
              <span className="text-brand-600">
                &ldquo;Please try again later.&rdquo;
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-content-muted">
              Fast NVMe hosting for websites that need to be online, not making
              excuses.
            </p>

            <p className="mt-5 font-mono text-[12.5px] tracking-tight text-content-subtle">
              From ₹59/month · Free migration · Free SSL · 24×7 human support
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/register" variant="brand" size="lg">
                Get Started
                <ArrowRight />
              </ButtonLink>
              <ButtonLink href="/pricing" variant="outline" size="lg">
                See Hosting Plans
              </ButtonLink>
            </div>

            <div className="mt-9 flex items-center gap-3 border-t border-line pt-5">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal-ok/60" />
                <span className="relative inline-flex size-2 rounded-full bg-signal-ok" />
              </span>
              <p className="text-[13px] font-medium text-content-muted">
                Fast servers · Indian infrastructure · Human support
              </p>
            </div>
          </div>

          <RackVisual />
        </div>
      </Container>
    </section>
  );
}

/**
 * The hero visual: a rack readout rather than floating UI cards. Every label
 * here is a product fact — no invented latency or uptime figures.
 */
function RackVisual() {
  const units = [
    { host: "web-01", role: "LiteSpeed · PHP 8.3", bars: 5 },
    { host: "db-01", role: "MySQL 8", bars: 4 },
    { host: "nvme-01", role: "NVMe storage array", bars: 6 },
    { host: "edge-01", role: "Mumbai, IN", bars: 3 },
  ];

  return (
    <div className="relative">
      <div
        aria-hidden
        className="tech-grid pointer-events-none absolute -inset-6 opacity-[0.55]"
        style={{
          maskImage: "radial-gradient(circle at 60% 40%, #000 40%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(circle at 60% 40%, #000 40%, transparent 78%)",
        }}
      />

      <div className="relative rounded-[12px] border border-line bg-surface shadow-[0_2px_10px_-4px_rgba(17,24,39,0.10)]">
        <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3">
          <span className="font-mono text-[11.5px] text-content-subtle">
            rack · mumbai-1
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[11.5px] font-semibold text-signal-ok">
            <span className="size-1.5 rounded-full bg-signal-ok" />
            OPERATIONAL
          </span>
        </div>

        <div className="divide-y divide-line">
          {units.map((unit) => (
            <div key={unit.host} className="flex items-center gap-4 px-4 py-3.5">
              {/* Drive bay: vents plus an activity LED. */}
              <div className="flex h-9 w-14 shrink-0 items-center gap-[3px] rounded-[6px] border border-line bg-surface-2 px-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <span
                    key={i}
                    className="h-4 w-px flex-1 bg-line-strong"
                    aria-hidden
                  />
                ))}
                <span className="ml-1 size-1.5 shrink-0 rounded-full bg-signal-ok" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-mono text-[13px] font-semibold text-content">
                  {unit.host}
                </p>
                <p className="truncate text-[12px] text-content-muted">
                  {unit.role}
                </p>
              </div>

              {/* Load bars — decorative, deliberately unlabelled. */}
              <div aria-hidden className="flex items-end gap-[3px]">
                {Array.from({ length: 7 }).map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "w-[3px] rounded-full",
                      // Blue is the technical accent: readouts and indicators,
                      // never an action.
                      i < unit.bars ? "bg-blue-500" : "bg-line",
                    )}
                    style={{ height: `${8 + ((i * 5) % 14)}px` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-line bg-surface-2 px-4 py-3">
          {["SSL issued", "Backups nightly", "Migration free"].map((line) => (
            <span
              key={line}
              className="flex items-center gap-1.5 font-mono text-[11px] text-content-muted"
            >
              <Check className="size-3 text-signal-ok" />
              {line}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Proof — product facts only, no invented metrics                     */
/* ================================================================== */

const proof = [
  { value: "₹59", label: "per month, Starter on a 12-month term" },
  { value: `${site.guarantees.refundDays}-day`, label: "money-back guarantee" },
  { value: "Free", label: "SSL, migration and a domain for a year" },
  { value: "24×7", label: "support answered by people" },
];

function Proof() {
  return (
    <section className="border-b border-line bg-surface-2">
      <Container>
        <dl className="grid divide-y divide-line sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
          {proof.map((item, i) => (
            <div
              key={item.value}
              className={cn(
                "py-6 lg:py-7",
                i > 0 && "lg:border-l lg:border-line lg:pl-8",
                i > 0 && i < 3 && "sm:border-l sm:border-line sm:pl-8",
              )}
            >
              <dt className="font-mono text-[26px] leading-none font-bold text-content">
                {item.value}
              </dt>
              <dd className="mt-2 max-w-[24ch] text-[13px] leading-relaxed text-content-muted">
                {item.label}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

/* ================================================================== */
/* Pricing                                                             */
/* ================================================================== */

/** Specs are worded per plan; the table needs one row label for all four. */
function specValue(plan: Plan, pattern: RegExp): string {
  const value = plan.specs.find((s) => pattern.test(s.label))?.value ?? "—";
  // GoPro says "1 hosted domain" where the others say "1" or "Unlimited". The
  // row label already says Websites, so the qualifier only reads as an
  // inconsistency here. (Worth confirming the catalog really does mean 1 site.)
  return value.replace(/^1 hosted domain$/, "1");
}

const priceRows: { label: string; match: RegExp }[] = [
  { label: "Websites", match: /websites|hosted domain/i },
  { label: "Storage", match: /storage/i },
  { label: "Bandwidth", match: /bandwidth/i },
  { label: "Databases", match: /databases/i },
  { label: "Email accounts", match: /email/i },
];

/**
 * Preview-only copy, kept out of the catalog until the direction is signed
 * off. ON MERGE: fold these into `tagline` plus a new `subtagline` field.
 */
const planCopy: Record<string, { tagline: string; sub?: string }> = {
  "shared-gopro": {
    tagline: "No artificial limits. Just more room to grow.",
    sub: "LiteSpeed + DDoS protection included.",
  },
};

/** The featured column's tint and hairlines, repeated down every row. */
const featuredCell = "border-x border-x-brand-200 bg-brand-50/45";

function Pricing() {
  return (
    <section
      id="pricing"
      className="scroll-mt-24 border-b border-line py-16 lg:py-24"
    >
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-[clamp(1.9rem,3.8vw,2.75rem)] leading-[1.08] font-extrabold tracking-[-0.02em] text-content">
            Pick a home for your website.
          </h2>
          <p className="mt-4 text-[16.5px] leading-relaxed text-content-muted">
            No mystery pricing. No hosting gymnastics. Just a plan that fits.
          </p>
        </div>

        <Reveal className="mt-10 overflow-x-auto rounded-[12px] border border-line bg-surface shadow-[0_1px_3px_0_rgba(17,24,39,0.05)]">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr>
                <th className="w-[190px] border-b border-line px-6 py-6 align-bottom">
                  <span className="block font-mono text-[10.5px] font-bold tracking-[0.12em] text-content-subtle uppercase">
                    Compare plans
                  </span>
                  <span className="mt-2 block text-[13px] leading-snug font-normal text-content-muted">
                    On a 12-month term. Prices exclude GST.
                  </span>
                </th>

                {sharedPlans.map((plan) => {
                  const copy = planCopy[plan.id];
                  const price = plan.prices["12mo"];

                  return (
                    <th
                      key={plan.id}
                      className={cn(
                        "border-b border-line px-6 py-6 align-bottom",
                        plan.featured &&
                          `${featuredCell} border-t-2 border-t-brand-300`,
                      )}
                    >
                      <span className="block h-4 font-mono text-[10.5px] font-bold tracking-[0.12em] text-brand-600 uppercase">
                        {plan.featured ? "Most popular" : ""}
                      </span>
                      <span className="mt-2 block text-[19px] font-bold text-content">
                        {plan.name}
                      </span>
                      <span className="mt-1.5 block max-w-[26ch] text-[13.5px] leading-snug font-normal text-content-muted">
                        {copy?.tagline ?? plan.tagline}
                      </span>
                      {copy?.sub && (
                        <span className="mt-1.5 block text-[12.5px] leading-snug font-normal text-content-subtle">
                          {copy.sub}
                        </span>
                      )}

                      <span className="mt-5 flex items-baseline gap-1">
                        <span className="font-mono text-[30px] leading-none font-extrabold text-content">
                          ₹{inrNumber(price.monthly)}
                        </span>
                        <span className="text-[12.5px] font-normal text-content-subtle">
                          /mo
                        </span>
                      </span>
                      <span className="mt-2.5 block text-[12.5px] leading-relaxed font-normal text-content-muted">
                        ₹{inrNumber(price.total ?? price.monthly * 12)} billed
                        yearly
                        <br />
                        renews at ₹{inrNumber(price.mrpMonthly)}/mo
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {priceRows.map((row) => (
                <tr key={row.label} className="border-b border-line">
                  <th className="px-6 py-4 text-[13.5px] font-medium text-content-muted">
                    {row.label}
                  </th>
                  {sharedPlans.map((plan) => (
                    <td
                      key={plan.id}
                      className={cn(
                        "px-6 py-4 text-[14px] font-medium text-content",
                        plan.featured && featuredCell,
                      )}
                    >
                      {specValue(plan, row.match)}
                    </td>
                  ))}
                </tr>
              ))}

              <tr className="border-b border-line">
                <th className="px-6 py-4 text-[13.5px] font-medium text-content-muted">
                  Free domain for a year
                </th>
                {sharedPlans.map((plan) => (
                  <td
                    key={plan.id}
                    className={cn(
                      "px-6 py-4",
                      plan.featured && featuredCell,
                    )}
                  >
                    {plan.freeDomain ? (
                      <Check className="size-[18px] text-signal-ok" />
                    ) : (
                      <span className="text-content-subtle">—</span>
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <th className="px-6 py-6" />
                {sharedPlans.map((plan) => (
                  <td
                    key={plan.id}
                    className={cn(
                      "px-6 py-6",
                      plan.featured && `${featuredCell} border-b-brand-200`,
                    )}
                  >
                    <ButtonLink
                      href={`/checkout?plan=${plan.id}&term=12mo`}
                      variant={plan.featured ? "brand" : "outline"}
                      size="sm"
                      block
                    >
                      Choose plan
                    </ButtonLink>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </Reveal>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-[62ch] text-[13.5px] leading-relaxed text-content-muted">
            Renewal rates are printed above because you will meet them
            eventually — better now than in month thirteen.
          </p>
          <Link
            href="/pricing"
            className="group flex items-center gap-2 text-[13.5px] font-semibold text-brand-600 underline-offset-4 hover:underline"
          >
            View all features
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Container>
    </section>
  );
}

/* ================================================================== */
/* Why Hostracer                                                       */
/* ================================================================== */

const reasons = [
  {
    n: "01",
    title: "Fast where it matters",
    body: "NVMe storage and modern infrastructure, tuned for sites that have to answer quickly.",
  },
  {
    n: "02",
    title: "Humans still exist",
    body: "Something breaks, you reach a real engineer — not a bot asking you to clear your cache again.",
  },
  {
    n: "03",
    title: "No renewal jump scares",
    body: "The renewal price sits next to the first-year price, before you buy. Nothing hides in month thirteen.",
  },
];

function WhyHostracer() {
  return (
    <section className="border-b border-line py-16 lg:py-24">
      <Container>
        <h2 className="max-w-2xl text-[clamp(1.9rem,3.8vw,2.75rem)] leading-[1.08] font-extrabold tracking-[-0.02em] text-content">
          Hosting without the usual nonsense.
        </h2>

        <div className="mt-12 divide-y divide-line border-y border-line">
          {reasons.map((reason) => (
            <Reveal
              key={reason.n}
              className="grid gap-4 py-9 md:grid-cols-[110px_minmax(0,340px)_1fr] md:items-baseline md:gap-10 lg:py-11"
            >
              <span className="font-mono text-[15px] font-bold tracking-[0.08em] text-brand-600">
                {reason.n}
              </span>
              <h3 className="text-[clamp(1.35rem,2.4vw,1.75rem)] leading-tight font-bold tracking-[-0.015em] text-content">
                {reason.title}
              </h3>
              <p className="max-w-[52ch] text-[15.5px] leading-relaxed text-content-muted">
                {reason.body}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ================================================================== */
/* Infrastructure — dark navy datasheet                                */
/* ================================================================== */

const infrastructure = [
  {
    key: "STORAGE",
    value: "NVMe SSD",
    body: "Every plan sits on NVMe, not spinning disks or older SATA drives. Database reads are where you feel it.",
  },
  {
    key: "COMPUTE",
    value: "High-performance processors",
    body: "Modern multi-core hardware with headroom kept in reserve, so a busy neighbour isn't your problem.",
  },
  {
    key: "WEB SERVER",
    value: "LiteSpeed & tuned stacks",
    body: "LiteSpeed on GoPro Unlimited, with caching and PHP versions you can change yourself.",
  },
  {
    key: "NETWORK",
    value: "Indian infrastructure",
    body: "Servers in Mumbai. Traffic from Indian visitors stays in the country instead of crossing an ocean twice.",
  },
];

function Infrastructure() {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-16 text-white lg:py-24">
      <div
        aria-hidden
        className="tech-grid pointer-events-none absolute inset-0 opacity-[0.012]"
      />

      <Container className="relative">
        <div className="flex flex-col gap-6 border-b border-white/12 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-xl text-[clamp(1.9rem,3.8vw,2.75rem)] leading-[1.08] font-extrabold tracking-[-0.02em] text-white">
            Serious hardware. Less serious waiting.
          </h2>
          <p className="max-w-sm text-[14.5px] leading-relaxed text-white/60">
            The specification, in plain words. If a line here matters to you,
            ask us about it before you buy — we&rsquo;ll answer straight.
          </p>
        </div>

        <dl className="divide-y divide-white/10">
          {infrastructure.map((row) => (
            <div
              key={row.key}
              className="grid gap-3 py-8 md:grid-cols-[150px_minmax(0,300px)_1fr] md:items-baseline md:gap-10"
            >
              <dt className="font-mono text-[11.5px] font-bold tracking-[0.14em] text-blue-400">
                {row.key}
              </dt>
              <dd className="text-[19px] leading-tight font-bold text-white">
                {row.value}
              </dd>
              <dd className="max-w-[56ch] text-[14.5px] leading-relaxed text-white/60">
                {row.body}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

/* ================================================================== */
/* Migration                                                           */
/* ================================================================== */

function Migration() {
  const nodes = [
    { label: "OLD HOST", caption: "Wherever it is now" },
    { label: "HOSTRACER", caption: "We do the moving" },
    { label: "WEBSITE LIVE", caption: "Same site, better address" },
  ];

  return (
    <section className="border-b border-line py-16 lg:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
          <div>
            <h2 className="max-w-[16ch] text-[clamp(1.9rem,3.8vw,2.75rem)] leading-[1.08] font-extrabold tracking-[-0.02em] text-content">
              Bring your website. We&rsquo;ll do the boring part.
            </h2>
            <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-content-muted">
              Moving hosts shouldn&rsquo;t require a weekend, three coffees and
              a nervous breakdown. We&rsquo;ll handle the migration for you.
            </p>
            <ButtonLink
              href="/domains/transfer"
              variant="brand"
              size="lg"
              className="mt-8"
            >
              Move My Website
              <ArrowRight />
            </ButtonLink>
          </div>

          {/* Three nodes, thin rules between them — a diagram, not cards. */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
            {nodes.map((node, i) => (
              <div key={node.label} className="contents">
                <div
                  className={cn(
                    "border-t-2 py-5 text-center sm:py-6",
                    i === 1
                      ? "border-t-brand-600"
                      : "border-t-line-strong",
                  )}
                >
                  <p
                    className={cn(
                      "font-mono text-[12.5px] font-bold tracking-[0.1em]",
                      i === 1 ? "text-brand-600" : "text-content",
                    )}
                  >
                    {node.label}
                  </p>
                  <p className="mt-1.5 text-[12px] text-content-muted">
                    {node.caption}
                  </p>
                </div>
                {i < nodes.length - 1 && (
                  <span
                    aria-hidden
                    className="mx-auto my-1 flex items-center justify-center text-content-subtle sm:mx-3 sm:my-0"
                  >
                    <ArrowRight className="size-4 rotate-90 sm:rotate-0" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ================================================================== */
/* Products — editorial list                                           */
/* ================================================================== */

/** Cheapest advertised 12-month rate in a range, so the list can't drift. */
function from(plans: Plan[]): number {
  return Math.min(...plans.map((p) => p.prices["12mo"].monthly));
}

const products = [
  {
    name: "Shared Hosting",
    body: "Your first website, your next website, or the one you keep saying you'll finally launch.",
    from: from(sharedPlans),
    href: "/pricing",
  },
  {
    name: "WordPress Hosting",
    body: "WordPress without the usual plugin, cache and configuration headache.",
    from: from(wordpressPlans),
    href: "/pricing#wordpress",
  },
  {
    name: "VPS",
    body: "Your own resources, root access and room to do things your way.",
    from: from(vpsPlans),
    href: "/pricing#vps",
  },
  {
    name: "Reseller Hosting",
    body: "Sell hosting under your own brand. We'll stay behind the curtain.",
    from: from(resellerPlans),
    href: "/pricing#reseller",
  },
];

function Products() {
  return (
    <section className="border-b border-line bg-surface-2 py-16 lg:py-24">
      <Container>
        <h2 className="max-w-[20ch] text-[clamp(1.9rem,3.8vw,2.75rem)] leading-[1.08] font-extrabold tracking-[-0.02em] text-content">
          Whatever you&rsquo;re building, we&rsquo;ve got a server for it.
        </h2>

        <div className="mt-10 border-t border-line">
          {products.map((product) => (
            <Link
              key={product.name}
              href={product.href}
              className="group grid items-baseline gap-x-10 gap-y-2 border-b border-line py-7 md:grid-cols-[minmax(0,300px)_1fr_auto] lg:py-9"
            >
              <h3 className="text-[clamp(1.3rem,2.2vw,1.6rem)] leading-tight font-bold tracking-[-0.015em] text-content transition-colors group-hover:text-brand-600">
                {product.name}
              </h3>
              <p className="max-w-[58ch] text-[15px] leading-relaxed text-content-muted">
                {product.body}
              </p>
              <span className="flex items-center gap-3 md:justify-end">
                <span className="font-mono text-[13px] whitespace-nowrap text-content-subtle">
                  from ₹{inrNumber(product.from)}/mo
                </span>
                <ArrowRight className="size-4 shrink-0 text-content-subtle transition-transform group-hover:translate-x-1 group-hover:text-brand-600" />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ================================================================== */
/* Domains — the one interactive band on the page                      */
/* ================================================================== */

function DomainBand() {
  return (
    <section className="border-b border-line bg-surface-2 py-16 lg:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-16">
          <div>
            <h2 className="max-w-[18ch] text-[clamp(1.7rem,3.2vw,2.4rem)] leading-[1.1] font-extrabold tracking-[-0.02em] text-content">
              Still calling it &ldquo;my website idea&rdquo;?
            </h2>
            <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-content-muted">
              Give it a name. Free WHOIS privacy, transfer lock and DNS
              management come with every domain — and the renewal price is
              printed next to the first-year one.
            </p>
          </div>

          <div>
            <DomainSearch onDark={false} />
            <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[12.5px] text-content-muted">
              {tlds
                .filter((t) => [".in", ".com", ".co.in"].includes(t.tld))
                .map((t) => (
                  <span key={t.tld} className="font-mono">
                    {t.tld} from ₹{inrNumber(t.register)}
                  </span>
                ))}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ================================================================== */
/* Testimonials — one lead quote, two supporting                       */
/* ================================================================== */

/**
 * Reused verbatim from the live homepage rather than written fresh, so no
 * new claims enter the site. The composition is a pull quote, not a card
 * grid — the wall of six equal boxes was the most template-looking thing
 * on the old page.
 */
function Testimonials() {
  const [lead, ...rest] = testimonials.slice(0, 3);

  return (
    <section className="border-b border-line py-16 lg:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)] lg:gap-16">
          <figure>
            <p className="font-mono text-[10.5px] font-bold tracking-[0.14em] text-content-subtle uppercase">
              From the inbox
            </p>
            <blockquote className="mt-6 text-[clamp(1.4rem,2.6vw,1.95rem)] leading-[1.3] font-bold tracking-[-0.015em] text-content">
              &ldquo;{lead.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 text-[13.5px]">
              <span className="h-px w-8 bg-line-strong" aria-hidden />
              <span className="font-semibold text-content">{lead.name}</span>
              <span className="text-content-muted">
                {lead.role} · {lead.city}
              </span>
            </figcaption>
          </figure>

          <div className="divide-y divide-line border-y border-line">
            {rest.map((t) => (
              <figure key={t.name} className="py-6">
                <blockquote className="text-[14.5px] leading-relaxed text-content-muted">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-3 text-[13px]">
                  <span className="font-semibold text-content">{t.name}</span>
                  <span className="text-content-subtle">
                    {" "}
                    · {t.role}, {t.city}
                  </span>
                </figcaption>
              </figure>
            ))}

            <div className="pt-5">
              <a
                href={site.social.trustpilot}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-[13.5px] font-semibold text-brand-600 underline-offset-4 hover:underline"
              >
                Read the reviews on Trustpilot
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ================================================================== */
/* Closing                                                             */
/* ================================================================== */

function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-20 text-white lg:py-28">
      <div
        aria-hidden
        className="tech-grid pointer-events-none absolute inset-0 opacity-[0.06]"
      />
      <Container className="relative">
        <div className="max-w-3xl">
          <h2 className="text-[clamp(2.1rem,4.6vw,3.2rem)] leading-[1.05] font-extrabold tracking-[-0.025em] text-white">
            Go live. Stay live. Sleep better.
          </h2>
          <p className="mt-5 max-w-xl text-[16.5px] leading-relaxed text-white/65">
            Fast hosting, straightforward pricing and humans when you need them.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <ButtonLink href="/register" variant="brand" size="lg">
              Get Started
              <ArrowRight />
            </ButtonLink>
            <a
              href={site.contact.phoneHref}
              className="font-mono text-[13px] text-white/60 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              or call {site.contact.phone}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ================================================================== */

export default function PreviewLandingPage() {
  return (
    <div className="theme-hr2 bg-canvas">
      {/* split · strip · table · rows · dark · process · search · list ·
          quotes · dark — no two neighbours share a composition. */}
      <Hero />
      <Proof />
      <Pricing />
      <WhyHostracer />
      <Infrastructure />
      <Migration />
      <DomainBand />
      <Products />
      <Testimonials />
      <FinalCta />
    </div>
  );
}
