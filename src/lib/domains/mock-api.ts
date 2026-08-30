/**
 * MOCK DOMAIN LOOKUP — replace with the registrar API when it lands.
 *
 * Results are deterministic per name so a domain doesn't flip between
 * available and taken as you move back and forth through checkout.
 */

export type DomainStatus = "available" | "taken" | "invalid";

export type DomainCheck = {
  sld: string;
  tld: string;
  status: DomainStatus;
  reason?: string;
};

/** Labels: 3–63 chars, alphanumeric and hyphens, no leading/trailing hyphen. */
const LABEL = /^[a-z0-9](?:[a-z0-9-]{1,61}[a-z0-9])?$/;

/** A few obvious names are always taken, so the "unavailable" path is reachable. */
const ALWAYS_TAKEN = new Set([
  "google",
  "facebook",
  "amazon",
  "hostinger",
  "hostracer",
  "test",
  "demo",
  "example",
]);

function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function normaliseSld(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .split(".")[0]
    .replace(/[^a-z0-9-]/g, "");
}

export async function checkDomain(
  sldInput: string,
  tld: string,
): Promise<DomainCheck> {
  const sld = normaliseSld(sldInput);
  await new Promise((r) => setTimeout(r, 500 + Math.random() * 350));

  if (!LABEL.test(sld)) {
    return {
      sld,
      tld,
      status: "invalid",
      reason: "Use 3–63 letters, numbers or hyphens.",
    };
  }

  if (ALWAYS_TAKEN.has(sld) || hash(sld + tld) % 5 === 0) {
    return {
      sld,
      tld,
      status: "taken",
      reason: "That one is already registered.",
    };
  }

  return { sld, tld, status: "available" };
}
