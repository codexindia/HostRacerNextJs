import Link from "next/link";
import {
  ArrowRight,
  Award,
  Check,
  Gauge,
  Globe,
  HeadphonesIcon,
  Layers,
  Lock,
  MapPin,
  MoveRight,
  Quote,
  RefreshCw,
  Server,
  ShieldCheck,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { DomainSearch } from "@/components/home/domain-search";
import { TelemetryCard } from "@/components/home/telemetry-card";
import { PlanGrid } from "@/components/pricing/plan-grid";
import { ButtonLink } from "@/components/ui/button";
import {
  CountUp,
  Reveal,
  RevealGroup,
  RevealItem,
} from "@/components/ui/motion";
import {
  Badge,
  Container,
  Eyebrow,
  SectionHeading,
  SpeedRule,
} from "@/components/ui/primitives";
import { sharedPlans, tlds } from "@/lib/catalog";
import { site } from "@/config/site.config";
import { inrNumber } from "@/lib/utils";

/* ================================================================== */
/* Hero                                                                */
/* ================================================================== */

const heroTrust = [
  { Icon: Zap, label: "NVMe storage" },
  { Icon: Globe, label: "Free domain for a year" },
  { Icon: Lock, label: "Free SSL, always" },
  { Icon: RefreshCw, label: "Free migration" },
];

const heroStats = [
  { label: "Happy customers", value: 5000, suffix: "+", group: true },
  { label: "Customer rating", value: 4.9, decimals: 1, suffix: "/5" },
  { label: "Uptime record", value: 99.9, decimals: 1, suffix: "%" },
  { label: "Avg. response", value: 45, suffix: "ms" },
];

function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink-950 text-white">
      {/* Brand glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-24 h-[520px] w-[520px] rounded-full bg-brand-600/25 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-32 -left-40 h-[420px] w-[420px] rounded-full bg-racer-from/12 blur-[120px]"
      />
      <div
        aria-hidden
        className="cockpit-hatch pointer-events-none absolute inset-0"
      />

      <Container className="relative">
        <div className="grid items-center gap-12 py-12 lg:grid-cols-[1.08fr_.92fr] lg:gap-14 lg:py-20">
          {/* Copy — cascades in on load, no scroll trigger above the fold */}
          <div>
            <Eyebrow onDark className="mb-6 animate-race-in">
              <SpeedRule className="w-9" />
              Made in India · {site.stats.states} states served
            </Eyebrow>

            <h1 className="animate-race-in text-[clamp(2.4rem,5.6vw,3.9rem)] leading-[1.04] font-extrabold text-white [animation-delay:90ms]">
              India&rsquo;s fastest hosting,
              <br className="hidden sm:block" /> from{" "}
              <span className="text-gradient-racer">₹59 a month.</span>
            </h1>

            <p className="animate-race-in mt-6 max-w-xl text-[17px] leading-relaxed text-white/65 [animation-delay:180ms]">
              NVMe servers tuned for Indian visitors, a free domain, free SSL and
              a support team that actually picks up. No lock-in, no renewal
              shock.
            </p>

            <div className="animate-race-in mt-9 max-w-xl [animation-delay:270ms]">
              <DomainSearch />
            </div>

            <div className="animate-race-in mt-9 flex flex-wrap gap-x-6 gap-y-3 [animation-delay:360ms]">
              {heroTrust.map(({ Icon, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-2 text-[13.5px] text-white/55"
                >
                  <Icon aria-hidden className="size-4 text-flag-400" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Instrument panel */}
          <div className="animate-race-in [animation-delay:200ms] lg:pl-6">
            <TelemetryCard />
          </div>
        </div>
      </Container>

      {/* Stat strip */}
      <div className="relative border-t border-white/10">
        <Container>
          <dl className="grid grid-cols-2 divide-x divide-white/10 md:grid-cols-4">
            {heroStats.map((stat, i) => (
              <div
                key={stat.label}
                className={`px-4 py-7 text-center ${i === 0 ? "border-l border-white/10 md:border-l-0" : ""}`}
              >
                <dd>
                  <CountUp
                    value={stat.value}
                    decimals={stat.decimals}
                    suffix={stat.suffix}
                    group={stat.group}
                    className="font-mono text-[26px] leading-none font-bold text-white tnum"
                  />
                </dd>
                <dt className="mt-2 text-[12.5px] text-white/45">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </Container>
      </div>
    </section>
  );
}

/* ================================================================== */
/* Products                                                            */
/* ================================================================== */

const products = [
  {
    Icon: Globe,
    title: "Shared Hosting",
    blurb:
      "The simplest way to get a website online. cPanel, NVMe storage and a free domain.",
    price: 59,
    href: "/hosting/shared",
    badge: "Most popular",
  },
  {
    Icon: Layers,
    title: "WordPress Hosting",
    blurb:
      "Managed WordPress with one-click installs, automatic updates and LiteSpeed cache.",
    price: 99,
    href: "/hosting/wordpress",
  },
  {
    Icon: Server,
    title: "VPS Hosting",
    blurb:
      "Dedicated vCPU, full root access and NVMe SSD on AMD EPYC hardware.",
    price: 499,
    href: "/vps",
    badge: "New",
  },
  {
    Icon: Users,
    title: "Reseller Hosting",
    blurb:
      "White-label WHM and cPanel so you can start your own hosting business.",
    price: 299,
    href: "/hosting/reseller",
  },
];

function Products() {
  return (
    <section className="py-14 lg:py-16">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="What we host"
            title="Pick the lane that fits your project"
            lede="Start small on shared hosting and move up to a VPS when your traffic asks for it. Migrations between our plans are free and handled by us."
          />
        </Reveal>

        <RevealGroup className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map(({ Icon, title, blurb, price, href, badge }) => (
            <RevealItem key={title} className="flex">
            <Link
              href={href}
              className="group relative flex flex-1 flex-col rounded-[16px] border border-line bg-surface p-6 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_20px_44px_-26px_rgba(109,64,228,0.45)] dark:hover:border-brand-500/40"
            >
              {badge && (
                <Badge
                  variant="brand"
                  size="sm"
                  className="absolute top-5 right-5"
                >
                  {badge}
                </Badge>
              )}

              <span className="grid size-11 place-items-center rounded-[11px] bg-gradient-racer text-white shadow-[0_8px_20px_-10px_var(--color-racer-to)]">
                <Icon className="size-5" />
              </span>

              <h3 className="mt-5 text-[17px] font-bold text-content">
                {title}
              </h3>
              <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-content-muted">
                {blurb}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                <span className="text-[13px] text-content-subtle">
                  from{" "}
                  <span className="font-mono text-[15px] font-bold text-content tnum">
                    ₹{inrNumber(price)}
                  </span>
                  /mo
                </span>
                <MoveRight className="size-4 text-content-subtle transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand-600 dark:group-hover:text-brand-400" />
              </div>
            </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}

/* ================================================================== */
/* Pricing                                                             */
/* ================================================================== */

function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 py-14 lg:py-16">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Shared hosting"
            title="Honest pricing, printed in full"
            lede="The price you sign up on is the price you renew on. Every plan includes free SSL, free migration and our 7-day money-back guarantee."
            className="mb-9"
          />
        </Reveal>
        <Reveal delay={0.1}>
          <PlanGrid plans={sharedPlans} />
        </Reveal>
      </Container>
    </section>
  );
}

/* ================================================================== */
/* Why Hostracer — dark cockpit band                                   */
/* ================================================================== */

const reasons = [
  {
    Icon: Gauge,
    title: "Servers that answer in 45ms",
    body: "NVMe SSDs, LiteSpeed and AMD EPYC hardware in Indian datacentres — so your visitors in Kolkata or Kochi aren't waiting on a server in Ohio.",
  },
  {
    Icon: HeadphonesIcon,
    title: "Humans, not ticket bots",
    body: "Our support team is in India, works 24×7 and answers on WhatsApp, phone and tickets. No canned replies, no overnight silence.",
  },
  {
    Icon: RefreshCw,
    title: "Renewals at the same price",
    body: "Most hosts hook you with year one then double it. We don't. Your renewal rate is the rate on your invoice today — in writing.",
  },
  {
    Icon: ShieldCheck,
    title: "Backed up and locked down",
    body: "Daily automated backups, free SSL on every domain, DDoS filtering and domain theft protection included on every plan.",
  },
];

function WhyUs() {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-20 text-white lg:py-24">
      <div
        aria-hidden
        className="cockpit-hatch pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 left-1/4 h-[400px] w-[600px] rounded-full bg-brand-600/18 blur-[120px]"
      />

      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              onDark
              align="left"
              eyebrow="Why Hostracer"
              title="Built for Indian businesses, not spreadsheets"
              lede={`${site.stats.customers} businesses across ${site.stats.states} states run on Hostracer — from Kolkata restaurants to Pune agencies.`}
            />
            <ButtonLink
              href="/about"
              variant="onDark"
              size="md"
              className="mt-8"
            >
              About us
              <ArrowRight />
            </ButtonLink>
          </Reveal>

          <RevealGroup className="grid gap-4 sm:grid-cols-2">
            {reasons.map(({ Icon, title, body }) => (
              <RevealItem
                key={title}
                className="h-full rounded-[16px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-sm transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.06]"
              >
                <span className="grid size-10 place-items-center rounded-[10px] border border-white/12 bg-white/5 text-flag-400">
                  <Icon className="size-[19px]" />
                </span>
                <h3 className="mt-4 text-[16px] font-bold text-white">
                  {title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-white/55">
                  {body}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </section>
  );
}

/* ================================================================== */
/* Domains                                                             */
/* ================================================================== */

function Domains() {
  const featured = tlds.slice(0, 6);

  return (
    <section className="py-14 lg:py-16">
      <Container>
        <Reveal className="overflow-hidden rounded-[20px] border border-line bg-surface">
          <div className="grid lg:grid-cols-2">
            {/* Copy + search */}
            <div className="p-8 lg:p-12">
              <Eyebrow className="mb-4">
                <SpeedRule className="w-8" />
                Domains
              </Eyebrow>
              <h2 className="text-[clamp(1.7rem,3.4vw,2.3rem)] leading-[1.12]">
                Claim the name before someone else does
              </h2>
              <p className="mt-4 text-[15.5px] leading-relaxed text-content-muted">
                Search 400+ extensions with free WHOIS privacy, theft protection
                and DNS management included — no upsells at checkout.
              </p>

              <div className="mt-8">
                <DomainSearch onDark={false} />
              </div>

              <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-2.5">
                {[
                  "Free WHOIS privacy",
                  "Domain theft lock",
                  "Easy DNS management",
                  "Email forwarding",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-[13.5px] text-content-muted"
                  >
                    <Check className="size-4 shrink-0 text-brand-600 dark:text-brand-400" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Price list */}
            <div className="border-t border-line bg-surface-2 p-8 lg:border-t-0 lg:border-l lg:p-12">
              <div className="flex items-baseline justify-between">
                <p className="eyebrow text-content-subtle">First year</p>
                <Link
                  href="/domains#pricing"
                  className="text-[13px] font-semibold text-brand-600 underline-offset-4 hover:underline dark:text-brand-400"
                >
                  All extensions
                </Link>
              </div>

              <ul className="mt-5 divide-y divide-line">
                {featured.map((t) => (
                  <li
                    key={t.tld}
                    className="flex items-center justify-between gap-4 py-3.5"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="font-mono text-[16px] font-bold text-content">
                        {t.tld}
                      </span>
                      {t.tag && (
                        <Badge
                          variant={t.tag === "cheapest" ? "flag" : "brand"}
                          size="sm"
                        >
                          {t.tag === "india"
                            ? "India"
                            : t.tag === "cheapest"
                              ? "Cheapest"
                              : t.tag === "popular"
                                ? "Popular"
                                : "New"}
                        </Badge>
                      )}
                    </span>
                    <span className="font-mono text-[14.5px] font-semibold text-content tnum">
                      ₹{inrNumber(t.register)}
                      <span className="text-[12px] font-normal text-content-subtle">
                        /yr
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ================================================================== */
/* Testimonials                                                        */
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
      "I was paying almost triple elsewhere for worse performance. My blog traffic has doubled since the move and the bill actually went down.",
    name: "Priyanka Mukherjee",
    role: "Travel blogger",
    city: "Siliguri",
  },
  {
    quote:
      "cPanel is clean, the WHM access works exactly as documented, and support answers in Hindi or English within minutes. That matters at 2am.",
    name: "Rohan Kulkarni",
    role: "Web developer",
    city: "Pune",
  },
  {
    quote:
      "Our restaurant site went from eight seconds to under two. Free SSL meant we stopped getting the 'not secure' warning that scared customers off.",
    name: "Arnab Banerjee",
    role: "Restaurant owner",
    city: "Howrah",
  },
  {
    quote:
      "No hidden renewal fees is the whole reason I stayed. What I paid in year one is what I paid in year three. Nobody else does that.",
    name: "Kavitha Rajan",
    role: "Education consultant",
    city: "Chennai",
  },
  {
    quote:
      "My portfolio has hundreds of large images and the NVMe storage handles it without a caching plugin. Uptime has been flawless.",
    name: "Saptarshi Ghosh",
    role: "Photographer",
    city: "Durgapur",
  },
];

function Testimonials() {
  return (
    <section className="border-y border-line bg-surface-2 py-14 lg:py-16">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Customer stories"
            title="Rated 4.9 out of 5 by Indian business owners"
            lede={`${site.stats.customers} customers, ${site.stats.states} states, and a support team that has never once told anyone to "clear your cache and try again".`}
          />
        </Reveal>

        <RevealGroup className="mt-11 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <RevealItem key={t.name} className="flex">
            <figure
              className="flex flex-1 flex-col rounded-[16px] border border-line bg-surface p-6"
            >
              <Quote
                aria-hidden
                className="size-6 text-brand-300 dark:text-brand-500/50"
              />
              <blockquote className="mt-4 flex-1 text-[14.5px] leading-relaxed text-content-muted">
                {t.quote}
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-racer font-display text-[14px] font-bold text-white">
                  {t.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[14px] font-semibold text-content">
                    {t.name}
                  </span>
                  <span className="flex items-center gap-1 text-[12.5px] text-content-subtle">
                    {t.role}
                    <span aria-hidden>·</span>
                    <MapPin aria-hidden className="size-3" />
                    {t.city}
                  </span>
                </span>
                <span
                  aria-label="5 out of 5 stars"
                  className="ml-auto flex gap-0.5"
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      aria-hidden
                      className="size-3 fill-flag-400 text-flag-400"
                    />
                  ))}
                </span>
              </figcaption>
            </figure>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}

/* ================================================================== */
/* FAQ                                                                 */
/* ================================================================== */

const faqs = [
  {
    q: "Will my price go up when I renew?",
    a: "No. Your renewal rate is the same rate you signed up on, and it is printed on your invoice. We don't run first-year teaser pricing.",
  },
  {
    q: "Can you move my existing website across?",
    a: "Yes, and it's free. Send us your current host's login and our team migrates your files, databases and email with no downtime — usually within 24 hours.",
  },
  {
    q: "Is the free domain really free?",
    a: "On any plan billed for 12 months or longer, your first year on a .com, .in, .co.in, .net or .xyz is included. After that it renews at our standard rate, which you can see on the domains page before you buy.",
  },
  {
    q: "What happens if I'm not happy?",
    a: `Ask for a refund within ${site.guarantees.refundDays} days of your first payment and we'll return it in full, no questions asked. Domain registration fees are non-refundable because the registry charges us up front.`,
  },
  {
    q: "Do I need technical knowledge to use this?",
    a: "Not for shared or WordPress hosting. You get cPanel with one-click installers for WordPress, and our team will set the first site up for you if you ask. VPS plans do assume you're comfortable with a Linux server.",
  },
  {
    q: "Where are your servers located?",
    a: "In Indian datacentres, which is why response times land around 45ms for visitors in India instead of the 200ms+ typical of US-hosted sites.",
  },
];

function Faq() {
  return (
    <section className="py-14 lg:py-16">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              align="left"
              eyebrow="Questions"
              title="The things people ask before switching"
              lede="Still unsure? Message us on WhatsApp — a real person answers."
            />
            <ButtonLink
              href={site.contact.whatsapp}
              target="_blank"
              rel="noreferrer"
              variant="outline"
              size="md"
              className="mt-8"
            >
              Ask on WhatsApp
              <ArrowRight />
            </ButtonLink>
          </Reveal>

          <Reveal delay={0.08} className="divide-y divide-line border-y border-line">
            {faqs.map((faq) => (
              <details key={faq.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[15.5px] font-semibold text-content [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <span
                    aria-hidden
                    className="mt-1 grid size-5 shrink-0 place-items-center rounded-full border border-line-strong text-content-subtle transition-transform duration-300 group-open:rotate-45"
                  >
                    <svg viewBox="0 0 12 12" className="size-2.5 stroke-current">
                      <path
                        d="M6 1v10M1 6h10"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-content-muted">
                  {faq.a}
                </p>
              </details>
            ))}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/* ================================================================== */
/* Closing CTA                                                         */
/* ================================================================== */

function ClosingCta() {
  return (
    <section className="pb-14 lg:pb-16">
      <Container>
        <Reveal className="relative overflow-hidden rounded-[20px] bg-ink-950 px-8 py-14 text-center text-white lg:px-16 lg:py-20">
          <div
            aria-hidden
            className="cockpit-hatch pointer-events-none absolute inset-0"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-[340px] w-[680px] -translate-x-1/2 rounded-full bg-brand-600/28 blur-[110px]"
          />

          <div className="relative mx-auto max-w-2xl">
            <Badge variant="onDark" size="md" className="mb-6">
              <Award className="size-3.5 text-flag-400" />
              7-day money-back guarantee
            </Badge>

            <h2 className="text-[clamp(1.9rem,4.2vw,2.9rem)] leading-[1.08] text-white">
              Get your site online this evening
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-[16.5px] leading-relaxed text-white/60">
              Pick a plan, point your domain and we&rsquo;ll handle the rest —
              including moving your old site across, free of charge.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href="/register" variant="accent" size="lg">
                Create your account
                <ArrowRight />
              </ButtonLink>
              <ButtonLink href="/pricing" variant="onDark" size="lg">
                Compare all plans
              </ButtonLink>
            </div>

            <p className="mt-6 font-mono text-[12.5px] text-white/40">
              No card required to open an account
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ================================================================== */

export default function HomePage() {
  return (
    <>
      <Hero />
      <Products />
      <Pricing />
      <WhyUs />
      <Domains />
      <Testimonials />
      <Faq />
      <ClosingCta />
    </>
  );
}
