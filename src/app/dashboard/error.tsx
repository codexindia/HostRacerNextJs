"use client";

import { useEffect } from "react";
import { RotateCw, TriangleAlert } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Panel } from "@/components/dashboard/ui";

/**
 * Dashboard error boundary. Sits inside the layout, so the sidebar, topbar
 * and the customer's session survive — only the panel area is replaced. A
 * failing invoice shouldn't cost someone their whole client area.
 */
export default function DashboardError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-[900px]">
      <Panel className="px-6 py-12 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-[13px] bg-flag-400/15 text-flag-600 dark:text-flag-400">
          <TriangleAlert className="size-6" />
        </span>

        <h1 className="mt-5 text-[18px] font-bold text-content">
          This page didn&rsquo;t load
        </h1>
        <p className="mx-auto mt-2 max-w-md text-[13.5px] leading-relaxed text-content-muted">
          Nothing is wrong with your account or your services — this screen
          failed to fetch. Your sites are unaffected.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          <Button variant="accent" size="md" onClick={retry}>
            <RotateCw />
            Try again
          </Button>
          <ButtonLink href="/dashboard/tickets/new" variant="outline" size="md">
            Report it
          </ButtonLink>
        </div>

        {error.digest && (
          <p className="mt-8 font-mono text-[11.5px] text-content-subtle">
            ref {error.digest}
          </p>
        )}
      </Panel>
    </div>
  );
}
