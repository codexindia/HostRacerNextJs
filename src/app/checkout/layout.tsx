import Link from "next/link";
import { ArrowLeft, Lock, Phone } from "lucide-react";
import { LogoLink } from "@/components/brand/logo";
import { Container } from "@/components/ui/primitives";
import { site } from "@/config/site.config";

/**
 * Deliberately minimal chrome — no mega-menu, no footer links. Once someone
 * is in checkout the only useful exits are "back to plans" and "call us".
 */
export default function CheckoutLayout({
  children,
}: LayoutProps<"/checkout">) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="border-b border-line bg-surface">
        <Container className="flex h-16 items-center gap-4">
          <LogoLink height={27} priority />

          <span className="ml-auto flex items-center gap-1.5 rounded-full border border-signal-ok/25 bg-signal-ok/8 px-3 py-1.5 text-[12.5px] font-semibold text-signal-ok">
            <Lock className="size-3.5" />
            Secure checkout
          </span>

          <a
            href={site.contact.phoneHref}
            className="hidden items-center gap-2 font-mono text-[13px] font-medium text-content-muted transition-colors hover:text-content sm:flex"
          >
            <Phone className="size-[15px]" />
            {site.contact.phone}
          </a>
        </Container>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-line">
        <Container className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-6 text-[12.5px] text-content-subtle">
          <Link
            href="/pricing"
            className="flex items-center gap-1.5 font-medium transition-colors hover:text-content-muted"
          >
            <ArrowLeft className="size-3.5" />
            Back to plans
          </Link>
          <span className="flex gap-5">
            <Link
              href="/legal/terms"
              className="transition-colors hover:text-content-muted"
            >
              Terms
            </Link>
            <Link
              href="/legal/refund"
              className="transition-colors hover:text-content-muted"
            >
              Refund policy
            </Link>
            <a
              href={site.contact.emailHref}
              className="transition-colors hover:text-content-muted"
            >
              Need help?
            </a>
          </span>
        </Container>
      </footer>
    </div>
  );
}
