import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightLeft,
  Check,
  Lock,
  Mail,
  RefreshCw,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import { DomainLookup } from "@/components/domains/domain-lookup";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/motion";
import {
  Badge,
  Container,
  Eyebrow,
  SectionHeading,
  SpeedRule,
} from "@/components/ui/primitives";
import { tlds } from "@/lib/catalog";
import { inrNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Register a domain",
  description:
    "Search and register .in, .com, .co.in and 400+ more extensions. Free WHOIS privacy, theft protection and DNS management, with renewal prices published up front.",
};

const included = [
  {
    Icon: ShieldCheck,
    title: "WHOIS privacy, free",
    body: "Your name, address and phone stay out of the public record. Most registrars charge ₹300 a year for this. Not available on .in — the registry doesn't allow it.",
  },
  {
    Icon: Lock,
    title: "Theft protection",
    body: "Registrar lock is on from day one, so nobody can start a transfer without your auth code.",
  },
  {
    Icon: Settings2,
    title: "Full DNS control",
    body: "A, AAAA, CNAME, MX, TXT and SRV records, editable from your dashboard. Or point the nameservers anywhere else.",
  },
  {
    Icon: Mail,
    title: "Email forwarding",
    body: "Forward hello@yourname.in to whichever inbox you already read, without paying for a mailbox.",
  },
];

const faqs = [
  {
    q: "Do I need hosting to register a domain?",
    a: "No. A domain on its own is fine — plenty of people register a name to hold it, or to point at a site hosted elsewhere. You can add hosting later without moving anything.",
  },
  {
    q: "Why is the renewal price higher than the first year?",
    a: "First-year prices on some extensions are promotional, set by the registry rather than by us. We print both prices on this page so the second year isn't a surprise. Renewal is what you'll actually pay every year after the first.",
  },
  {
    q: "How fast does it go live?",
    a: "Registration is instant for most extensions. DNS then takes 15 minutes to a few hours to spread. .in domains occasionally sit in a registry queue for an hour or so.",
  },
  {
    q: "Can I register a name for more than a year?",
    a: "Yes — up to 10 years for most extensions, chosen at checkout. Longer registrations are a mild signal of legitimacy to search engines and mean one less renewal to forget.",
  },
  {
    q: "What happens if I let it expire?",
    a: "You get a 30-day grace period at the normal renewal price. After that it enters redemption for another 30 days, where the registry charges roughly ₹6,500 to pull it back. Then it drops and anyone can take it. Auto-renew is on by default for a reason.",
  },
];

export default async function DomainsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <>
      {/* Search */}
      <section className="border-b border-line bg-surface-2">
        <Container>
          <div className="mx-auto max-w-[720px] py-14 text-center lg:py-20">
            <Eyebrow className="mb-4 justify-center">
              <SpeedRule className="w-8" />
              Domains
            </Eyebrow>
            <h1 className="text-[clamp(2rem,4.2vw,2.9rem)] leading-[1.08] font-extrabold text-content">
              Find a name that fits
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-content-muted">
              400+ extensions, renewal prices printed next to the first-year
              price, and privacy included rather than sold back to you.
            </p>

            <div className="mt-8 text-left">
              <DomainLookup initialQuery={q ?? ""} />
            </div>
          </div>
        </Container>
      </section>

      {/* Already own one */}
      <section className="border-b border-line">
        <Container>
          <div className="flex flex-col items-start gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-3 text-[14px] text-content-muted">
              <ArrowRightLeft className="size-[18px] shrink-0 text-content-subtle" />
              Already own the name somewhere else? Move it here and we&rsquo;ll
              add a year to whatever time is left on it.
            </p>
            <ButtonLink
              href="/domains/transfer"
              variant="outline"
              size="sm"
              className="shrink-0"
            >
              Transfer a domain in
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Pricing table */}
      <section id="pricing" className="scroll-mt-24 py-14 lg:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Extensions"
              title="Every price, both years"
              lede="Register, renew and transfer rates for the extensions we're asked about most. All excluding 18% GST."
              className="mb-9"
            />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="overflow-x-auto rounded-[16px] border border-line bg-surface">
              <table className="w-full min-w-[560px] text-left">
                <thead>
                  <tr className="border-b border-line text-[11.5px] tracking-wide text-content-subtle uppercase">
                    <th className="px-5 py-3 font-semibold">Extension</th>
                    <th className="px-5 py-3 text-right font-semibold">
                      Register
                    </th>
                    <th className="px-5 py-3 text-right font-semibold">Renew</th>
                    <th className="px-5 py-3 text-right font-semibold">
                      Transfer
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {tlds.map((t) => (
                    <tr key={t.tld}>
                      <td className="px-5 py-3.5">
                        <span className="flex flex-wrap items-center gap-2.5">
                          <span className="font-mono text-[15px] font-bold text-content">
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
                        <span className="mt-0.5 block text-[12.5px] text-content-muted">
                          {t.blurb}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono text-[14px] font-semibold text-content tnum">
                        ₹{inrNumber(t.register)}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono text-[14px] text-content-muted tnum">
                        ₹{inrNumber(t.renew)}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono text-[14px] text-content-muted tnum">
                        ₹{inrNumber(t.transfer)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <p className="mt-4 text-[12.5px] text-content-subtle">
            Don&rsquo;t see the extension you want? Search for it above — we
            carry over 400, this table is just the ones people ask for.
          </p>
        </Container>
      </section>

      {/* What's included */}
      <section className="border-t border-line bg-surface-2 py-14 lg:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Included"
              title="Nothing sold back to you at checkout"
              lede="The things other registrars turn into line items are part of the price here."
              className="mb-10"
            />
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2">
            {included.map(({ Icon, title, body }, i) => (
              <Reveal
                key={title}
                delay={i * 0.06}
                className="rounded-[14px] border border-line bg-surface p-6"
              >
                <span className="grid size-10 place-items-center rounded-[11px] bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 text-[15.5px] font-bold text-content">
                  {title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-content-muted">
                  {body}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Registering with hosting */}
      <section className="py-14 lg:py-16">
        <Container>
          <Reveal className="overflow-hidden rounded-[18px] border border-line bg-surface">
            <div className="grid lg:grid-cols-[1.2fr_1fr]">
              <div className="p-8 lg:p-10">
                <Eyebrow className="mb-4">
                  <SpeedRule className="w-8" />
                  Buying hosting too?
                </Eyebrow>
                <h2 className="text-[clamp(1.5rem,3vw,2rem)] leading-[1.15] font-bold text-content">
                  The domain comes free with an annual plan
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-content-muted">
                  Pick any 12-month hosting plan and one domain is included for
                  the first year — .in, .com, .co.in and a few others. You
                  choose it during checkout, so there&rsquo;s no need to
                  register it separately here first.
                </p>
                <ul className="mt-6 space-y-2.5">
                  {[
                    "Free for the first year, then the normal renewal price",
                    "DNS is pre-pointed at your hosting, nothing to configure",
                    "Keep the domain if you leave — it's yours, not ours",
                  ].map((line) => (
                    <li
                      key={line}
                      className="flex items-start gap-2.5 text-[13.5px] text-content-muted"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-brand-600 dark:text-brand-400" />
                      {line}
                    </li>
                  ))}
                </ul>
                <ButtonLink href="/pricing" variant="accent" size="md" className="mt-7">
                  See hosting plans
                </ButtonLink>
              </div>

              <div className="border-t border-line bg-surface-2 p-8 lg:border-t-0 lg:border-l lg:p-10">
                <p className="eyebrow text-content-subtle">Already registered</p>
                <div className="mt-5 space-y-4">
                  <div className="flex gap-3">
                    <RefreshCw className="mt-0.5 size-[18px] shrink-0 text-content-subtle" />
                    <p className="text-[13.5px] leading-relaxed text-content-muted">
                      <span className="font-semibold text-content">
                        Renewals
                      </span>{" "}
                      run automatically 30 days before expiry, with an invoice
                      emailed first. Turn it off per domain in the dashboard.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Settings2 className="mt-0.5 size-[18px] shrink-0 text-content-subtle" />
                    <p className="text-[13.5px] leading-relaxed text-content-muted">
                      <span className="font-semibold text-content">
                        DNS and nameservers
                      </span>{" "}
                      are managed from{" "}
                      <Link
                        href="/dashboard/domains"
                        className="text-brand-600 underline-offset-4 hover:underline dark:text-brand-400"
                      >
                        your domain list
                      </Link>
                      , including auth codes for moving out.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* FAQ */}
      <section className="border-t border-line py-14 lg:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Questions"
              title="Before you register"
              className="mb-9"
            />
          </Reveal>

          <div className="mx-auto max-w-[760px] divide-y divide-line rounded-[16px] border border-line bg-surface">
            {faqs.map((faq) => (
              <details key={faq.q} className="group px-6 py-5">
                <summary className="cursor-pointer list-none text-[15px] font-semibold text-content marker:hidden">
                  {faq.q}
                </summary>
                <p className="mt-3 text-[14px] leading-relaxed text-content-muted">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
