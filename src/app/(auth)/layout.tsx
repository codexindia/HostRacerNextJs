import Link from "next/link";
import { ArrowLeft, Check, Quote, Star } from "lucide-react";
import { Logo, LogoLink } from "@/components/brand/logo";
import { Eyebrow, SpeedRule } from "@/components/ui/primitives";
import { site } from "@/lib/site";

const perks = [
  "Free domain for a year on annual plans",
  "Free SSL and website migration",
  "24×7 support from a team in India",
  "7-day money-back guarantee",
];

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      {/* ---------------- Form side ---------------- */}
      <div className="flex flex-col px-5 py-8 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between gap-4">
          <LogoLink height={28} priority />
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[13.5px] font-medium text-content-muted transition-colors hover:text-content"
          >
            <ArrowLeft className="size-4" />
            Back to site
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[420px]">{children}</div>
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[12.5px] text-content-subtle">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          <span className="flex gap-5">
            <Link
              href="/legal/privacy"
              className="transition-colors hover:text-content-muted"
            >
              Privacy
            </Link>
            <Link
              href="/legal/terms"
              className="transition-colors hover:text-content-muted"
            >
              Terms
            </Link>
            <a
              href={site.contact.emailHref}
              className="transition-colors hover:text-content-muted"
            >
              Need help?
            </a>
          </span>
        </footer>
      </div>

      {/* ---------------- Cockpit side ---------------- */}
      <aside className="relative hidden overflow-hidden bg-ink-950 text-white lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden
          className="cockpit-hatch pointer-events-none absolute inset-0"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-20 h-[460px] w-[460px] rounded-full bg-brand-600/25 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-24 h-[420px] w-[420px] rounded-full bg-racer-from/15 blur-[120px]"
        />

        <div className="relative p-12">
          <Logo height={26} onDark />
        </div>

        <div className="relative max-w-lg px-12">
          <Eyebrow onDark className="mb-6">
            <SpeedRule className="w-9" />
            {site.stats.customers} businesses on board
          </Eyebrow>

          <h2 className="text-[clamp(1.8rem,2.6vw,2.4rem)] leading-[1.12] text-white">
            Hosting that keeps its promises — including the price.
          </h2>

          <ul className="mt-8 space-y-3.5">
            {perks.map((perk) => (
              <li key={perk} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-flag-400/15">
                  <Check className="size-3 text-flag-400" />
                </span>
                <span className="text-[14.5px] text-white/70">{perk}</span>
              </li>
            ))}
          </ul>

          <figure className="mt-11 rounded-[16px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
            <Quote aria-hidden className="size-5 text-brand-400" />
            <blockquote className="mt-3 text-[14.5px] leading-relaxed text-white/70">
              &ldquo;No hidden renewal fees is the whole reason I stayed. What I
              paid in year one is what I paid in year three.&rdquo;
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
              <span className="grid size-9 place-items-center rounded-full bg-gradient-racer font-display text-[13px] font-bold text-white">
                KR
              </span>
              <span>
                <span className="block text-[13.5px] font-semibold text-white">
                  Kavitha Rajan
                </span>
                <span className="text-[12px] text-white/45">
                  Education consultant · Chennai
                </span>
              </span>
              <span aria-label="5 out of 5" className="ml-auto flex gap-0.5">
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
        </div>

        <div className="relative grid grid-cols-3 gap-4 border-t border-white/10 p-12">
          {[
            { label: "Uptime", value: site.stats.uptime },
            { label: "Response", value: `${site.stats.responseMs}ms` },
            { label: "Rating", value: site.stats.rating },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-mono text-[19px] font-bold text-white tnum">
                {stat.value}
              </p>
              <p className="mt-1 text-[12px] text-white/40">{stat.label}</p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
