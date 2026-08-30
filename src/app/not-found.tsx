import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { LogoLink } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow, SpeedRule } from "@/components/ui/primitives";
import { site } from "@/lib/site";

const shortcuts = [
  { label: "Shared hosting", href: "/hosting/shared" },
  { label: "VPS hosting", href: "/vps" },
  { label: "Domain search", href: "/domains" },
  { label: "Pricing", href: "/pricing" },
];

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-ink-950 text-white">
      <div
        aria-hidden
        className="cockpit-hatch pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[460px] w-[700px] -translate-x-1/2 rounded-full bg-brand-600/22 blur-[120px]"
      />

      <Container className="relative flex h-20 items-center">
        <LogoLink height={28} onDark />
      </Container>

      <Container className="relative flex flex-1 items-center py-16">
        <div className="max-w-xl">
          <Eyebrow onDark className="mb-6">
            <SpeedRule className="w-9" />
            Error 404
          </Eyebrow>

          <p className="font-mono text-[80px] leading-none font-bold text-white/10 sm:text-[110px]">
            404
          </p>

          <h1 className="mt-2 text-[clamp(1.9rem,4.4vw,2.7rem)] leading-[1.1] text-white">
            This page took a wrong turn
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-white/60">
            The page you asked for isn&rsquo;t here — it may have moved, or the
            link that brought you might be out of date.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/" variant="accent" size="lg">
              Back to home
              <ArrowRight />
            </ButtonLink>
            <ButtonLink href="/support" variant="onDark" size="lg">
              <Compass />
              Get help
            </ButtonLink>
          </div>

          <div className="mt-12 border-t border-white/10 pt-7">
            <p className="eyebrow mb-4 text-white/35">Popular pages</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {shortcuts.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[14px] text-white/65 underline-offset-4 transition-colors hover:text-white hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      <Container className="relative py-7 text-[12.5px] text-white/35">
        Need a hand? Call{" "}
        <a
          href={site.contact.phoneHref}
          className="font-mono text-white/60 hover:text-white"
        >
          {site.contact.phone}
        </a>
      </Container>
    </div>
  );
}
