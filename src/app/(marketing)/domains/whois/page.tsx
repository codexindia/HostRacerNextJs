import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import {
  ArrowRightLeft,
  Building2,
  CalendarClock,
  Server,
  ShieldCheck,
} from "lucide-react";
import { WhoisLookup } from "@/components/domains/whois-lookup";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/motion";
import {
  Container,
  Eyebrow,
  SectionHeading,
  SpeedRule,
} from "@/components/ui/primitives";
import {
  lookupDomain,
  normaliseDomain,
  type WhoisOutcome,
} from "@/lib/domains/rdap";
import { clientIp, rateLimited } from "@/lib/domains/rate-limit";

export const metadata: Metadata = {
  title: "WHOIS lookup",
  description:
    "Look up who holds a domain, which registrar it sits with, when it expires and what the registry has locked. Live registry data over RDAP, for every extension.",
};

const returns = [
  {
    Icon: Building2,
    title: "Registrar and abuse contact",
    body: "Which company the domain is managed through, its IANA ID, and the address the registry requires them to publish for abuse reports.",
  },
  {
    Icon: CalendarClock,
    title: "The three dates that matter",
    body: "Registered, last changed and expires — with the countdown to expiry, which is the one people are usually here for.",
  },
  {
    Icon: ShieldCheck,
    title: "Status codes, explained",
    body: "Registries answer in EPP codes like clientTransferProhibited. We print what each one actually means for the domain.",
  },
  {
    Icon: Server,
    title: "Nameservers and DNSSEC",
    body: "Where the domain currently points, and whether the zone is signed. The fastest way to tell which host someone is really on.",
  },
];

const codes = [
  {
    code: "ok / active",
    meaning: "Nothing is blocking the domain. It resolves normally.",
  },
  {
    code: "clientTransferProhibited",
    meaning:
      "Registrar lock is on — the usual state for a healthy domain. The owner turns it off to move registrar.",
  },
  {
    code: "clientHold",
    meaning:
      "The registrar has pulled the domain out of the zone. The site stops loading, often over an unpaid invoice or a complaint.",
  },
  {
    code: "pendingTransfer",
    meaning:
      "A move to another registrar is in flight. It completes on its own after five days if nobody acts.",
  },
  {
    code: "redemptionPeriod",
    meaning:
      "It expired and was deleted. The owner can still recover it, but the registry charges a redemption fee on top of the renewal.",
  },
  {
    code: "pendingDelete",
    meaning:
      "Redemption is over. In about five days the name drops and anyone can register it.",
  },
];

const faqs = [
  {
    q: "Why is the owner's name missing?",
    a: "Two different reasons. For .com and .net, Verisign runs a thin registry — it only holds the registrar and the dates, and the owner's details stay with the registrar. Everywhere else, registries redact personal data by default under privacy rules, showing at most an organisation and a country. A missing name is normal, not an error.",
  },
  {
    q: "Is this the same as WHOIS?",
    a: "It is the replacement for it. RDAP returns the same registry record as port-43 WHOIS but as structured JSON, with proper internationalisation and a documented format. ICANN required registries and registrars to run it, and it is what this page queries.",
  },
  {
    q: "How current is the data?",
    a: "It is read live from the registry each time you search — nothing here is cached between lookups. Registries themselves update on their own schedule, so a change made minutes ago at a registrar may take a short while to show.",
  },
  {
    q: "It says available — is the name really free?",
    a: "The registry has no record of it, which is as authoritative as an answer gets. It is not a hold, though. Premium pricing, registry reservations and trademark claims can still get in the way, and someone else can register it a second later.",
  },
  {
    q: "Can I hide my own details from this?",
    a: "Yes. WHOIS privacy is included free on every domain we register, on the extensions that permit it — your name, address and phone stay out of the public record. .in is the exception: the registry does not allow privacy on it.",
  },
  {
    q: "Why did a lookup fail?",
    a: "A handful of extensions still do not publish RDAP, and some registries rate-limit hard or time out under load. Both come back as an error rather than a wrong answer. Waiting a minute usually fixes it.",
  },
];

/**
 * Resolves ?domain= before the page renders. Crawlers follow shared links
 * too, so the same per-IP limit the API route uses applies here.
 */
async function initialLookup(query?: string): Promise<WhoisOutcome | null> {
  const domain = query ? normaliseDomain(query) : null;
  if (!domain) return null;

  if (rateLimited(clientIp(await headers()))) {
    return {
      status: "error",
      domain,
      message: "Too many lookups. Give it a minute and try again.",
      httpStatus: 429,
    };
  }

  return lookupDomain(domain);
}

export default async function WhoisPage({
  searchParams,
}: {
  searchParams: Promise<{ domain?: string }>;
}) {
  const { domain } = await searchParams;

  // A shared link arrives with the answer already rendered rather than
  // flashing an empty box and fetching from the browser.
  const initialResult = await initialLookup(domain);

  return (
    <>
      {/* Lookup */}
      <section className="border-b border-line bg-surface-2">
        <Container>
          <div className="mx-auto max-w-[760px] py-14 text-center lg:py-20">
            <Eyebrow className="mb-4 justify-center">
              <SpeedRule className="w-8" />
              WHOIS
            </Eyebrow>
            <h1 className="text-[clamp(2rem,4.2vw,2.9rem)] leading-[1.08] font-extrabold text-content">
              Who owns this domain?
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-content-muted">
              Registrar, expiry date, nameservers and every lock the registry
              has on it — read live from the registry, for any extension.
            </p>

            <div className="mt-8 text-left">
              <WhoisLookup
                initialQuery={domain ?? ""}
                initialResult={initialResult}
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Cross-links */}
      <section className="border-b border-line">
        <Container>
          <div className="flex flex-col items-start gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-3 text-[14px] text-content-muted">
              <ArrowRightLeft className="size-[18px] shrink-0 text-content-subtle" />
              Looked yours up and want it here? Moving it in adds a year to
              whatever time is left on it.
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

      {/* What comes back */}
      <section className="py-14 lg:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="In the record"
              title="What a lookup tells you"
              lede="The registry publishes more than most people realise — and rather less than they expect about the owner."
              className="mb-10"
            />
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2">
            {returns.map(({ Icon, title, body }, i) => (
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

      {/* Status codes */}
      <section className="border-t border-line bg-surface-2 py-14 lg:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Status codes"
              title="What the registry is telling you"
              lede="Every domain carries at least one EPP status code. These are the ones you will actually run into."
              className="mb-9"
            />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="overflow-x-auto rounded-[16px] border border-line bg-surface">
              <table className="w-full min-w-[560px] text-left">
                <thead>
                  <tr className="border-b border-line text-[11.5px] tracking-wide text-content-subtle uppercase">
                    <th className="px-5 py-3 font-semibold">Code</th>
                    <th className="px-5 py-3 font-semibold">
                      What it means for the domain
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {codes.map((row) => (
                    <tr key={row.code}>
                      <td className="px-5 py-3.5 align-top font-mono text-[13.5px] font-semibold whitespace-nowrap text-content">
                        {row.code}
                      </td>
                      <td className="px-5 py-3.5 text-[13.5px] leading-relaxed text-content-muted">
                        {row.meaning}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <p className="mt-4 text-[12.5px] text-content-subtle">
            The full list lives at{" "}
            <a
              href="https://icann.org/epp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 underline-offset-4 hover:underline dark:text-brand-400"
            >
              icann.org/epp
            </a>
            . Lookups on this page explain each code inline, so you rarely need
            it.
          </p>
        </Container>
      </section>

      {/* Privacy */}
      <section className="py-14 lg:py-16">
        <Container>
          <Reveal className="overflow-hidden rounded-[18px] border border-line bg-surface">
            <div className="grid lg:grid-cols-[1.2fr_1fr]">
              <div className="p-8 lg:p-10">
                <Eyebrow className="mb-4">
                  <SpeedRule className="w-8" />
                  Your own record
                </Eyebrow>
                <h2 className="text-[clamp(1.5rem,3vw,2rem)] leading-[1.15] font-bold text-content">
                  Everything you just read about someone else is public about
                  you too
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-content-muted">
                  Registering a domain puts your name, postal address, email
                  and phone into a record anyone can query — which is how the
                  spam starts within hours of a new registration. WHOIS privacy
                  swaps those fields for a forwarding contact, and it is
                  included free on every domain we register rather than sold
                  back to you at renewal.
                </p>
                <p className="mt-3 text-[13.5px] leading-relaxed text-content-subtle">
                  The exception is .in — the registry does not permit privacy
                  on it, so those details stay public wherever you register.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <ButtonLink href="/domains" variant="accent" size="md">
                    Register a domain
                  </ButtonLink>
                  <ButtonLink
                    href="/domains/transfer"
                    variant="outline"
                    size="md"
                  >
                    Move one here
                  </ButtonLink>
                </div>
              </div>

              <div className="border-t border-line bg-surface-2 p-8 lg:border-t-0 lg:border-l lg:p-10">
                <p className="eyebrow text-content-subtle">Already with us</p>
                <div className="mt-5 space-y-4">
                  <div className="flex gap-3">
                    <ShieldCheck className="mt-0.5 size-[18px] shrink-0 text-content-subtle" />
                    <p className="text-[13.5px] leading-relaxed text-content-muted">
                      <span className="font-semibold text-content">
                        Privacy and locks
                      </span>{" "}
                      are toggled per domain from{" "}
                      <Link
                        href="/dashboard/domains"
                        className="text-brand-600 underline-offset-4 hover:underline dark:text-brand-400"
                      >
                        your domain list
                      </Link>
                      , along with auth codes.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <CalendarClock className="mt-0.5 size-[18px] shrink-0 text-content-subtle" />
                    <p className="text-[13.5px] leading-relaxed text-content-muted">
                      <span className="font-semibold text-content">
                        Expiry
                      </span>{" "}
                      is handled by auto-renew 30 days out, with an invoice
                      emailed first — so a lookup never surprises you.
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
              title="About WHOIS records"
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
