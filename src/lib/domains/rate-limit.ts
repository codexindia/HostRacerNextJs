/**
 * A courtesy limit on WHOIS lookups.
 *
 * Registries rate-limit by IP, and from their side that IP is this server's.
 * One visitor hammering the box would earn *everyone* a 429, so we cap it
 * here first.
 *
 * Per-process and in memory: it resets on deploy and is not shared between
 * PM2 workers. That is fine for what it defends against — it is politeness
 * towards the registry, not a security control.
 */

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 20;
const MAX_TRACKED = 5_000;

const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });

    // Cheap sweep so the map cannot grow without bound.
    if (hits.size > MAX_TRACKED) {
      for (const [key, value] of hits) {
        if (now > value.resetAt) hits.delete(key);
      }
    }
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

/** The visitor's address as seen through nginx or whatever proxies us. */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0].trim() || headers.get("x-real-ip") || "unknown"
  );
}
