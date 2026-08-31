import type { Metadata } from "next";
import { Check, Clock, Mail, TriangleAlert } from "lucide-react";
import { TransferForm } from "@/components/domains/transfer-form";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/motion";
import {
  Container,
  Eyebrow,
  SectionHeading,
  SpeedRule,
} from "@/components/ui/primitives";
import { tlds } from "@/lib/catalog";
import { inrNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Transfer a domain in",
  description:
    "Move your domain to Hostracer. One year is added to whatever time is left, your site and email keep running, and you only pay when the transfer completes.",
};

const requirements = [
  {
    title: "Registered more than 60 days ago",
    body: "Registries block transfers for 60 days after a registration or a previous transfer. There is no way around it — the request is simply refused.",
  },
  {
    title: "Registrar lock turned off",
    body: "Every domain ships locked. Turn it off in your current registrar's control panel just before you start; you can lock it again here afterwards.",
  },
  {
    title: "An authorisation (EPP) code",
    body: "The password that proves the domain is yours. Your current registrar shows it or emails it on request, sometimes after a day's delay.",
  },
  {
    title: "A working contact email",
    body: "Approval goes to the registrant email in WHOIS. If that address is dead or hidden behind privacy you won't see the request — fix it first.",
  },
  {
    title: "Not expiring in the next 10 days",
    body: "A transfer takes up to a week. Cutting it fine risks the domain expiring mid-move. Renew where it is now, then transfer — the year you paid for comes with it.",
  },
];

const steps = [
  {
    label: "Day 0",
    title: "You start it here",
    body: "Unlock the domain at your current registrar, paste the auth code, and pay. The clock starts.",
  },
  {
    label: "Within an hour",
    title: "The losing registrar emails you",
    body: "They send an approval request to the WHOIS registrant address. Approving it is the single biggest thing you can do to speed this up.",
  },
  {
    label: "Day 1–5",
    title: "The registry moves it",
    body: "If nobody clicks anything the transfer still completes automatically after five days. Your current registrar can also decline it, in which case we refund you in full.",
  },
  {
    label: "On completion",
    title: "It lands in your dashboard",
    body: "A year is added to the expiry date, the domain is locked again, and DNS carries on exactly as it was.",
  },
];

const faqs = [
  {
    q: "Will my website or email go down?",
    a: "No — as long as you don't change the nameservers. A transfer moves who bills and manages the domain, not where it points. DNS records travel with the nameservers, which stay exactly where they are unless you change them yourself.",
  },
  {
    q: "What happens to the time left on my registration?",
    a: "It comes with you, and we add a year on top. If you had 7 months left, you'll have 19 months when the transfer completes. Nothing is lost by moving early in the year.",
  },
  {
    q: "How long does it actually take?",
    a: "Usually under 24 hours if you approve the email from your current registrar. If you ignore it, the registry completes the transfer on its own after five days. .in domains are often faster than .com.",
  },
  {
    q: "My registrar is refusing to release it.",
    a: "That's rare but it happens — usually an unpaid invoice, a recent contact change, or the 60-day lock. They must tell you the reason. Send us the rejection message on a ticket and we'll tell you what to do next.",
  },
  {
    q: "Can I transfer several domains at once?",
    a: "Yes. Check them one at a time here, then start them together from your dashboard. Each still needs its own auth code — registries issue one per domain.",
  },
];

export default function DomainTransferPage() {
  const popular = tlds.filter((t) =>
    [".in", ".com", ".co.in", ".net", ".org"].includes(t.tld),
  );

  return (
    <>
      {/* Form */}
      <section className="border-b border-line bg-surface-2">
        <Container>
          <div className="grid items-start gap-10 py-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:py-20">
            <div>
              <Eyebrow className="mb-4">
                <SpeedRule className="w-8" />
                Transfer in
              </Eyebrow>
              <h1 className="text-[clamp(2rem,4.2vw,2.9rem)] leading-[1.08] font-extrabold text-content">
                Bring your domain across
              </h1>
              <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-content-muted">
                One year gets added to whatever time is left. Your site and
                email keep running throughout — a transfer changes who manages
                the domain, not where it points.
              </p>

              <ul className="mt-7 space-y-2.5">
                {[
                  "+1 year added on completion",
                  "No downtime, DNS records untouched",
                  "Charged only when the transfer succeeds",
                  "Free WHOIS privacy once it lands",
                ].map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-2.5 text-[14px] text-content-muted"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-brand-600 dark:text-brand-400" />
                    {line}
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-[13px] border border-line bg-surface p-5">
                <p className="text-[12.5px] font-semibold text-content-muted">
                  Transfer prices
                </p>
                <ul className="mt-3 divide-y divide-line">
                  {popular.map((t) => (
                    <li
                      key={t.tld}
                      className="flex items-center justify-between gap-4 py-2.5"
                    >
                      <span className="font-mono text-[14px] font-bold text-content">
                        {t.tld}
                      </span>
                      <span className="font-mono text-[13.5px] text-content-muted tnum">
                        ₹{inrNumber(t.transfer)}
                        <span className="text-[12px] text-content-subtle">
                          {" "}
                          + a year
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-[18px] border border-line bg-surface p-6 lg:p-8">
              <h2 className="text-[17px] font-bold text-content">
                Check your domain
              </h2>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-content-muted">
                We&rsquo;ll ask the registry whether it can move yet, and what
                it costs.
              </p>
              <div className="mt-6">
                <TransferForm />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Requirements */}
      <section className="py-14 lg:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Before you start"
              title="Five things that decide whether it works"
              lede="Nearly every failed transfer comes down to one of these, and all five are on your current registrar's side rather than ours."
              className="mb-10"
            />
          </Reveal>

          <div className="mx-auto max-w-[820px] divide-y divide-line rounded-[16px] border border-line bg-surface">
            {requirements.map((item, i) => (
              <div key={item.title} className="flex gap-4 px-6 py-5">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-surface-2 font-mono text-[12px] font-bold text-content-muted">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-[14.5px] font-bold text-content">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-content-muted">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Timeline */}
      <section className="border-t border-line bg-surface-2 py-14 lg:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="What happens"
              title="A week at the outside, a day if you help"
              className="mb-10"
            />
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <Reveal
                key={step.title}
                delay={i * 0.06}
                className="rounded-[14px] border border-line bg-surface p-5"
              >
                <p className="font-mono text-[11.5px] font-bold tracking-wide text-brand-600 uppercase dark:text-brand-400">
                  {step.label}
                </p>
                <h3 className="mt-2.5 text-[14.5px] font-bold text-content">
                  {step.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-content-muted">
                  {step.body}
                </p>
              </Reveal>
            ))}
          </div>

          <div className="mx-auto mt-8 flex max-w-[820px] gap-3 rounded-[13px] border border-flag-400/45 bg-flag-400/10 px-5 py-4">
            <TriangleAlert className="mt-0.5 size-[18px] shrink-0 text-flag-600 dark:text-flag-400" />
            <p className="text-[13.5px] leading-relaxed text-content">
              <span className="font-semibold">
                Don&rsquo;t change nameservers on the day you transfer.
              </span>{" "}
              If something breaks you won&rsquo;t know which change caused it.
              Move the domain first, confirm the site still loads, then point
              the DNS wherever you want.
            </p>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-14 lg:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Questions"
              title="Transfers, honestly"
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

          <div className="mx-auto mt-8 flex max-w-[760px] flex-col items-start gap-4 rounded-[14px] border border-line bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <Mail className="mt-0.5 size-[18px] shrink-0 text-content-subtle" />
              <p className="text-[13.5px] leading-relaxed text-content-muted">
                Stuck on a rejection, or moving more than ten domains? Send us
                the details and a human will work through it with you.
              </p>
            </div>
            <ButtonLink
              href="/dashboard/tickets/new"
              variant="outline"
              size="md"
              className="shrink-0"
            >
              Ask for help
            </ButtonLink>
          </div>

          <p className="mx-auto mt-6 flex max-w-[760px] items-center justify-center gap-2 text-[12.5px] text-content-subtle">
            <Clock className="size-3.5" />
            Transfers are processed as they arrive, including weekends.
          </p>
        </Container>
      </section>
    </>
  );
}
