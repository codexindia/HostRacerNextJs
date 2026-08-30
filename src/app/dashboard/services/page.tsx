"use client";

import { ArrowRight, ExternalLink, HardDrive, Server } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import {
  EmptyState,
  PageHeader,
  Panel,
  StatusPill,
  UsageBar,
} from "@/components/dashboard/ui";
import {
  daysUntil,
  primaryMetric,
  services,
  type Service,
} from "@/lib/dashboard/mock-data";
import { formatDate } from "@/lib/utils";

/**
 * The list view answers four questions and nothing more: what is it, is it
 * healthy, am I running out of space, and when do I pay again. Everything
 * else — IP, nameservers, every other meter — lives on the detail page.
 */
export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-[1180px] space-y-6">
      <PageHeader
        title="Hosting & servers"
        lede="Your active services. Open the control panel, or manage settings and billing."
        actions={
          <ButtonLink href="/pricing" variant="accent" size="md">
            Add a service
          </ButtonLink>
        }
      />

      {services.length === 0 ? (
        <Panel>
          <EmptyState
            icon={<HardDrive className="size-5" />}
            title="No services yet"
            body="Once you buy a hosting plan or a VPS it'll show up here."
            action={
              <ButtonLink href="/pricing" variant="accent" size="md">
                Browse plans
              </ButtonLink>
            }
          />
        </Panel>
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <ServiceRow key={service.id} service={service} />
          ))}
        </div>
      )}

      <p className="text-[12.5px] text-content-subtle">
        Need something moved or resized? Open a ticket and we&rsquo;ll do it for
        you — there&rsquo;s no charge for either.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function ServiceRow({ service }: { service: Service }) {
  const isVps = service.kind === "vps";
  const days = daysUntil(service.renewsOn);
  const soon = days <= 30;

  const storage = primaryMetric(service);

  return (
    <Panel className="p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-8">
        {/* Identity */}
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-[11px] border border-line bg-canvas text-content-muted">
            {isVps ? (
              <Server className="size-5" />
            ) : (
              <HardDrive className="size-5" />
            )}
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate font-mono text-[16px] font-bold text-content">
                {service.label}
              </h2>
              <StatusPill tone="ok">Active</StatusPill>
            </div>

            <p className="mt-1 text-[13px] text-content-muted">
              {service.planName} {isVps ? "server" : "plan"}
              <span className="mx-1.5 text-content-subtle">·</span>
              <span className={soon ? "text-flag-600 dark:text-flag-300" : ""}>
                Renews {formatDate(service.renewsOn)}
              </span>
              {!service.autoRenew && (
                <>
                  <span className="mx-1.5 text-content-subtle">·</span>
                  <span className="font-medium text-flag-600 dark:text-flag-300">
                    auto-renew off
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* One meter */}
        <div className="w-full shrink-0 lg:w-[220px]">
          <UsageBar
            label="Storage"
            used={storage.used}
            limit={storage.limit}
            unit={storage.unit}
          />
        </div>

        {/* Actions */}
        <div className="flex shrink-0 gap-2.5">
          <ButtonLink
            href={`/dashboard/services/${service.id}`}
            variant="outline"
            size="md"
            className="flex-1 lg:flex-none"
          >
            {isVps ? "Console" : "cPanel"}
            <ExternalLink />
          </ButtonLink>
          <ButtonLink
            href={`/dashboard/services/${service.id}`}
            variant="primary"
            size="md"
            className="flex-1 lg:flex-none"
          >
            Manage
            <ArrowRight />
          </ButtonLink>
        </div>
      </div>
    </Panel>
  );
}
