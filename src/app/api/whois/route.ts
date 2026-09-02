import type { NextRequest } from "next/server";
import { lookupDomain, normaliseDomain } from "@/lib/domains/rdap";
import { clientIp, rateLimited } from "@/lib/domains/rate-limit";

/**
 * WHOIS lookup, proxied server-side.
 *
 * The browser could call RDAP directly — the servers do send CORS headers —
 * but going through here means one shape of response for every registry, the
 * parsing lives next to the types, and the visitor's IP never reaches the
 * registry.
 */
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("domain") ?? "";
  const domain = normaliseDomain(query);

  if (!domain) {
    return Response.json(
      { error: "Enter a domain name, like example.com" },
      { status: 400 },
    );
  }

  if (rateLimited(clientIp(request.headers))) {
    return Response.json(
      { error: "Too many lookups. Give it a minute and try again." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  const outcome = await lookupDomain(domain);

  if (outcome.status === "error") {
    return Response.json(
      { error: outcome.message },
      {
        status: outcome.httpStatus,
        headers: outcome.httpStatus === 429 ? { "Retry-After": "60" } : undefined,
      },
    );
  }

  return Response.json(outcome);
}
