import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { LogoLink } from "@/components/brand/logo";
import { Container } from "@/components/ui/primitives";
import { site } from "@/config/site.config";

/**
 * Single-column auth shell: one centred card, nothing competing with it.
 * The whole job of this page is to get one form filled in.
 */
export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-canvas">
      {/* Soft brand wash behind the card so the page isn't flat white */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-brand-500/10 blur-[120px] dark:bg-brand-600/18"
      />

      <header className="relative">
        <Container className="flex h-18 items-center justify-between gap-4">
          <LogoLink height={28} priority />
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[13.5px] font-medium text-content-muted transition-colors hover:text-content"
          >
            <ArrowLeft className="size-4" />
            Back to site
          </Link>
        </Container>
      </header>

      <main className="relative flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-[480px]">
          <div className="rounded-[18px] border border-line bg-surface p-7 shadow-[0_24px_60px_-32px_rgba(20,20,31,0.28)] sm:p-9">
            {children}
          </div>

          <p className="mt-6 flex items-center justify-center gap-2 text-center text-[12.5px] text-content-subtle">
            <ShieldCheck className="size-4 shrink-0 text-signal-ok" />
            {site.guarantees.refundDays}-day money-back guarantee · 24×7 support
            from India
          </p>
        </div>
      </main>

      <footer className="relative">
        <Container className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-7 text-[12.5px] text-content-subtle">
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
        </Container>
      </footer>
    </div>
  );
}
