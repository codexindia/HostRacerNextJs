"use client";

import { useEffect } from "react";
import { ArrowRight, RotateCw } from "lucide-react";
import { LogoLink } from "@/components/brand/logo";
import { Button, ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow, SpeedRule } from "@/components/ui/primitives";
import { site } from "@/config/site.config";

/**
 * Route-level error boundary. Next 16 hands this `retry`, not the `reset`
 * older versions used.
 *
 * The digest is the only handle support has on a specific failure once it is
 * server-side, so it is printed rather than swallowed.
 */
export default function AppError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    // Until an error reporter is wired up, the console is the report.
    console.error(error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-ink-950 text-white">
      <div
        aria-hidden
        className="cockpit-hatch pointer-events-none absolute inset-0"
      />

      <Container className="relative flex h-20 items-center">
        <LogoLink height={28} onDark />
      </Container>

      <Container className="relative flex flex-1 items-center py-16">
        <div className="max-w-xl">
          <Eyebrow onDark className="mb-6">
            <SpeedRule className="w-9" />
            Something broke
          </Eyebrow>

          <h1 className="text-[clamp(1.9rem,4.4vw,2.7rem)] leading-[1.1] text-white">
            That didn&rsquo;t load. Our fault, not yours.
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-white/60">
            The page hit an error on the way out. Trying again usually works —
            if it doesn&rsquo;t, tell us and we&rsquo;ll go and look at it.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button variant="accent" size="lg" onClick={retry}>
              <RotateCw />
              Try again
            </Button>
            <ButtonLink href="/" variant="onDark" size="lg">
              Back to home
              <ArrowRight />
            </ButtonLink>
          </div>

          {error.digest && (
            <p className="mt-10 border-t border-white/10 pt-6 text-[12.5px] text-white/35">
              Quote this if you contact us:{" "}
              <span className="font-mono text-white/60">{error.digest}</span>
            </p>
          )}
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
