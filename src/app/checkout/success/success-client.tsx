"use client";

import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Check,
  Download,
  Globe,
  Headphones,
  Mail,
  Server,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/primitives";
import { useLastOrder } from "@/lib/cart/order-store";
import { useHydrated } from "@/lib/use-hydrated";
import { PAYMENT_METHODS } from "@/lib/constants";
import { site } from "@/config/site.config";
import { formatDate, inr } from "@/lib/utils";

export function SuccessClient() {
  const params = useSearchParams();
  const order = useLastOrder((s) => s.order);
  const hydrated = useHydrated(useLastOrder);
  const ref = params.get("ref");

  if (!hydrated) {
    return (
      <Container className="grid place-items-center py-24">
        <div className="size-8 animate-spin rounded-full border-2 border-line-strong border-t-brand-500" />
      </Container>
    );
  }

  /* Landed here without an order — most likely a bookmark or a refresh
     after the session ended. Don't fabricate a receipt. */
  if (!order || (ref && order.ref !== ref)) {
    return (
      <Container className="py-20">
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-[24px] font-bold text-content">
            We can&rsquo;t find that order
          </h1>
          <p className="mt-2.5 text-[14.5px] leading-relaxed text-content-muted">
            Order receipts are only shown once right after payment. Every order
            you&rsquo;ve placed is listed in your dashboard.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/dashboard" variant="accent" size="md">
              Go to dashboard
            </ButtonLink>
            <ButtonLink href="/" variant="outline" size="md">
              Back to site
            </ButtonLink>
          </div>
        </div>
      </Container>
    );
  }

  const method = PAYMENT_METHODS.find((m) => m.id === order.method);

  const nextSteps = [
    {
      Icon: Mail,
      title: "Check your inbox",
      body: `We've sent your invoice and cPanel login details to ${order.email || "your email address"}. They usually arrive within a minute.`,
    },
    {
      Icon: Server,
      title: "Your server is being provisioned",
      body: "Hosting accounts are ready in under 5 minutes. You'll get a second email once yours is live.",
    },
    order.domain
      ? {
          Icon: Globe,
          title: `${order.domain} is being registered`,
          body: "Domain registration completes within 15 minutes, then it points at your new hosting automatically.",
        }
      : {
          Icon: Globe,
          title: "Add a domain when you're ready",
          body: "You can register a new domain or point an existing one from your dashboard at any time.",
        },
    {
      Icon: Headphones,
      title: "Need your old site moved?",
      body: "Migration is free. Reply to your welcome email or message us on WhatsApp and we'll handle it.",
    },
  ];

  return (
    <Container className="py-12 lg:py-16">
      <div className="mx-auto max-w-3xl">
        {/* Confirmation */}
        <div className="text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-signal-ok text-white">
            <Check className="size-7" strokeWidth={3} />
          </span>

          <h1 className="mt-6 text-[clamp(1.8rem,4vw,2.4rem)] leading-tight text-content">
            Payment received — you&rsquo;re all set
          </h1>
          <p className="mt-3 text-[16px] leading-relaxed text-content-muted">
            Thanks{order.fullName ? `, ${order.fullName.split(" ")[0]}` : ""}.
            Your order is confirmed and we&rsquo;re setting things up now.
          </p>

          <div className="mt-7 inline-flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-[13px] border border-line bg-surface px-6 py-4">
            <div className="text-left">
              <p className="eyebrow text-content-subtle">Order</p>
              <p className="mt-1 font-mono text-[16px] font-bold text-content">
                {order.ref}
              </p>
            </div>
            <div className="text-left">
              <p className="eyebrow text-content-subtle">Paid</p>
              <p className="mt-1 font-mono text-[16px] font-bold text-content tnum">
                {inr(order.total)}
              </p>
            </div>
            <div className="text-left">
              <p className="eyebrow text-content-subtle">Method</p>
              <p className="mt-1 text-[15px] font-semibold text-content">
                {method?.label ?? "Card"}
              </p>
            </div>
            <div className="text-left">
              <p className="eyebrow text-content-subtle">Date</p>
              <p className="mt-1 text-[15px] font-semibold text-content">
                {formatDate(order.placedAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Receipt */}
        <div className="mt-10 rounded-[16px] border border-line bg-surface p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[16px] font-bold text-content">
              What you paid for
            </h2>
            <button
              type="button"
              className="flex items-center gap-1.5 text-[13px] font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400"
            >
              <Download className="size-3.5" />
              Invoice
            </button>
          </div>

          <ul className="mt-5 space-y-3">
            {order.lines.map((line) => (
              <li
                key={line.title}
                className="flex items-start justify-between gap-4 border-b border-line pb-3 last:border-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="text-[14.5px] font-semibold text-content">
                    {line.title}
                  </p>
                  <p className="mt-0.5 text-[12.5px] text-content-subtle">
                    {line.meta}
                  </p>
                </div>
                <p className="shrink-0 font-mono text-[14.5px] font-semibold text-content tnum">
                  {inr(line.amount)}
                </p>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-2 border-t border-line pt-5 text-[13.5px]">
            <div className="flex justify-between">
              <dt className="text-content-muted">Subtotal</dt>
              <dd className="font-mono text-content tnum">
                {inr(order.subtotal)}
              </dd>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between">
                <dt className="text-signal-ok">
                  Promo {order.promoCode && `(${order.promoCode})`}
                </dt>
                <dd className="font-mono text-signal-ok tnum">
                  −{inr(order.discount)}
                </dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-content-muted">GST (18%)</dt>
              <dd className="font-mono text-content tnum">{inr(order.gst)}</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-line pt-3">
              <dt className="text-[15px] font-bold text-content">Total paid</dt>
              <dd className="font-mono text-[19px] font-bold text-content tnum">
                {inr(order.total)}
              </dd>
            </div>
          </dl>
        </div>

        {/* Next steps */}
        <div className="mt-10">
          <h2 className="text-[18px] font-bold text-content">
            What happens next
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {nextSteps.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="rounded-[14px] border border-line bg-surface p-5"
              >
                <span className="grid size-9 place-items-center rounded-[10px] bg-gradient-racer text-white">
                  <Icon className="size-[17px]" />
                </span>
                <h3 className="mt-3.5 text-[14.5px] font-bold text-content">
                  {title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-content-muted">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/dashboard" variant="accent" size="lg">
            Go to your dashboard
            <ArrowRight />
          </ButtonLink>
          <ButtonLink
            href={site.contact.whatsapp}
            target="_blank"
            rel="noreferrer"
            variant="outline"
            size="lg"
          >
            Message support
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
