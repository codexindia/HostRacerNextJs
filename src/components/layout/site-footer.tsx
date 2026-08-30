import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import {
  InstagramIcon,
  TelegramIcon,
  TrustpilotIcon,
  YoutubeIcon,
} from "@/components/brand/social-icons";
import { Container } from "@/components/ui/primitives";
import { footerNav, legalNav, site } from "@/lib/site";

const socials = [
  { href: site.social.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: site.social.telegram, label: "Telegram", Icon: TelegramIcon },
  { href: site.social.youtube, label: "YouTube", Icon: YoutubeIcon },
  { href: site.social.trustpilot, label: "Trustpilot", Icon: TrustpilotIcon },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-ink-950 text-white">
      <div
        aria-hidden
        className="cockpit-hatch pointer-events-none absolute inset-0"
      />
      {/* Brand light bleeding up from the bottom edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[900px] -translate-x-1/2 rounded-full bg-brand-600/20 blur-[110px]"
      />

      <Container className="relative">
        <div className="grid gap-12 py-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,2fr)] lg:gap-16">
          {/* Brand block */}
          <div>
            <Logo height={30} onDark />
            <p className="mt-5 max-w-sm text-[14.5px] leading-relaxed text-white/60">
              {site.description}
            </p>

            <div className="mt-7 space-y-3">
              <a
                href={site.contact.phoneHref}
                className="flex items-center gap-3 text-[14.5px] text-white/75 transition-colors hover:text-white"
              >
                <span className="grid size-8 place-items-center rounded-[9px] border border-white/10 bg-white/5">
                  <Phone className="size-4" />
                </span>
                <span className="font-mono">{site.contact.phone}</span>
              </a>
              <a
                href={site.contact.emailHref}
                className="flex items-center gap-3 text-[14.5px] text-white/75 transition-colors hover:text-white"
              >
                <span className="grid size-8 place-items-center rounded-[9px] border border-white/10 bg-white/5">
                  <Mail className="size-4" />
                </span>
                {site.contact.email}
              </a>
              <a
                href={site.contact.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-[14.5px] text-white/75 transition-colors hover:text-white"
              >
                <span className="grid size-8 place-items-center rounded-[9px] border border-white/10 bg-white/5">
                  <MessageCircle className="size-4" />
                </span>
                WhatsApp us
              </a>
            </div>

            <div className="mt-7 flex gap-2">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid size-9 place-items-center rounded-[9px] border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white"
                >
                  <Icon className="size-[17px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-6">
            {footerNav.map((column) => (
              <div key={column.heading}>
                <h3 className="eyebrow mb-4 text-white/40">{column.heading}</h3>
                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[14px] text-white/65 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-5 border-t border-white/10 py-7 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1.5 text-[13px] text-white/45 sm:flex-row sm:items-center sm:gap-4">
            <span>
              © {new Date().getFullYear()} {site.name}
            </span>
            <span className="hidden sm:inline text-white/20">·</span>
            <span>A product of {site.legalName}</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
            {legalNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/55 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-white/60">
              Made in India <span aria-hidden>🇮🇳</span>
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
