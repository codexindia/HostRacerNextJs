/**
 * RDAP — the protocol that replaced port-43 WHOIS.
 *
 * Every registry publishes the same JSON shape (RFC 9083), so one parser
 * covers .com, .in and the other 1,400 extensions. What differs is how much
 * is in it: Verisign runs a *thin* registry for .com and .net, returning the
 * registrar and the dates but no registrant, while .in and most ccTLDs are
 * *thick* and return contacts — usually redacted down to a country.
 *
 * Nothing here is Hostracer data. It is the public registry record, fetched
 * live, which is why the lookup can answer for domains we don't sell.
 */

/* ------------------------------------------------------------------ */
/* Endpoints                                                           */
/* ------------------------------------------------------------------ */

/**
 * Extensions we hit directly, skipping a bootstrap round-trip on the two
 * people search for most. These are the same URLs IANA would hand back.
 */
const KNOWN_SERVICES: Record<string, string> = {
  com: "https://rdap.verisign.com/com/v1/",
  net: "https://rdap.verisign.com/net/v1/",
};

/** IANA's TLD → RDAP server map. Changes about as often as the root zone. */
const BOOTSTRAP_URL = "https://data.iana.org/rdap/dns.json";

/** Follows the bootstrap itself, via redirect. Used when the map fails us. */
const FALLBACK_SERVICE = "https://rdap.org/";

type BootstrapFile = {
  services?: [string[], string[]][];
};

/** Resolves the RDAP base URL for a TLD, e.g. "com" → Verisign's server. */
export async function rdapServiceFor(tld: string): Promise<string> {
  const known = KNOWN_SERVICES[tld];
  if (known) return known;

  try {
    const res = await fetch(BOOTSTRAP_URL, {
      // The root zone moves slowly; a day-old copy is fine, and it keeps us
      // from hammering IANA once per lookup.
      next: { revalidate: 86_400 },
      signal: AbortSignal.timeout(8_000),
    });

    if (res.ok) {
      const data = (await res.json()) as BootstrapFile;
      for (const [tlds, urls] of data.services ?? []) {
        if (!tlds.includes(tld)) continue;
        const base = urls.find((u) => u.startsWith("https://")) ?? urls[0];
        if (base) return base.endsWith("/") ? base : `${base}/`;
      }
    }
  } catch {
    // Bootstrap unreachable or malformed — fall through to the redirector.
  }

  return FALLBACK_SERVICE;
}

/* ------------------------------------------------------------------ */
/* Input                                                               */
/* ------------------------------------------------------------------ */

const LABEL = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

/**
 * Accepts what people actually paste — "https://www.Example.com/pricing?a=1",
 * "example.com.", "hello@example.com" — and returns the bare name, or null if
 * there is no plausible domain in there.
 *
 * IDNs become their A-label ("भारत.in" → "xn--h2brj9c.in"), which is what
 * RDAP servers key on.
 */
export function normaliseDomain(input: string): string | null {
  let value = input.trim().toLowerCase();
  if (!value) return null;

  value = value
    .replace(/^[a-z][a-z0-9+.-]*:\/\//, "")
    .replace(/^[^@/]*@/, "")
    .split(/[/?#]/)[0]
    .replace(/^www\./, "")
    .replace(/\.$/, "");

  // Drop a trailing port. IPv6 literals also contain colons, but they are
  // rejected by the label check below anyway.
  value = value.split(":")[0];
  if (!value.includes(".")) return null;

  try {
    value = new URL(`http://${value}`).hostname;
  } catch {
    return null;
  }

  if (value.length > 253) return null;

  const labels = value.split(".");
  if (labels.length < 2) return null;
  if (!labels.every((label) => LABEL.test(label))) return null;

  // A TLD is never numeric — that would make this an IP address.
  const tld = labels[labels.length - 1];
  if (!/^(?:[a-z]{2,}|xn--[a-z0-9-]+)$/.test(tld)) return null;

  return value;
}

export function tldOf(domain: string): string {
  return domain.slice(domain.lastIndexOf(".") + 1);
}

/* ------------------------------------------------------------------ */
/* EPP status codes                                                    */
/* ------------------------------------------------------------------ */

/**
 * What a registry can put on a domain, in plain English.
 * Keyed by the RDAP spelling with the spaces taken out. See icann.org/epp.
 */
const STATUS_NOTES: Record<string, string> = {
  active: "Live and in the zone. Nothing is blocking it.",
  ok: "Live and in the zone. Nothing is blocking it.",
  inactive: "No nameservers are set, so the domain resolves nowhere.",
  clientdeleteprohibited:
    "The registrar has blocked deletion. Normal, and a good sign.",
  clienthold:
    "The registrar has pulled it from the zone — the site will not load.",
  clientrenewprohibited: "The registrar has blocked renewal.",
  clienttransferprohibited:
    "Registrar lock is on. Standard theft protection; the owner turns it off to move the domain.",
  clientupdateprohibited: "The registrar has blocked changes to the record.",
  serverdeleteprohibited:
    "The registry has blocked deletion, often during a dispute.",
  serverhold:
    "The registry has pulled it from the zone — the site will not load.",
  serverrenewprohibited: "The registry has blocked renewal, usually pending a dispute.",
  servertransferprohibited: "The registry has blocked transfers.",
  serverupdateprohibited: "The registry has frozen the record.",
  pendingcreate: "Registration is still being processed.",
  pendingdelete:
    "Redemption has ended. The name drops in about five days, and anyone can take it.",
  pendingrenew: "A renewal is in progress.",
  pendingrestore: "The owner has asked to pull it back out of redemption.",
  pendingtransfer: "A transfer to another registrar is under way.",
  pendingupdate: "A change to the record is being applied.",
  addperiod:
    "Registered within the last five days — it can still be refunded and deleted.",
  autorenewperiod:
    "Renewed automatically in the last 45 days; a refund is still possible.",
  renewperiod: "Renewed in the last five days; a refund is still possible.",
  transferperiod: "Transferred in the last five days.",
  redemptionperiod:
    "Expired and deleted. The owner can still buy it back, but the registry charges a redemption fee.",
};

export type WhoisStatus = {
  /** As returned, e.g. "client transfer prohibited". */
  code: string;
  note?: string;
  tone: "ok" | "warn" | "down" | "neutral";
};

const DOWN_STATUSES = new Set([
  "clienthold",
  "serverhold",
  "pendingdelete",
  "inactive",
]);
const WARN_STATUSES = new Set([
  "redemptionperiod",
  "pendingtransfer",
  "pendingrestore",
]);

function toStatus(code: string): WhoisStatus {
  const key = code.toLowerCase().replace(/[\s_-]/g, "");
  return {
    code,
    note: STATUS_NOTES[key],
    tone: DOWN_STATUSES.has(key)
      ? "down"
      : WARN_STATUSES.has(key)
        ? "warn"
        : key === "ok" || key === "active"
          ? "ok"
          : "neutral",
  };
}

/* ------------------------------------------------------------------ */
/* jCard                                                               */
/* ------------------------------------------------------------------ */

type JCardEntry = [string, Record<string, unknown>, string, unknown];

type RdapEntity = {
  roles?: string[];
  handle?: string;
  publicIds?: { type?: string; identifier?: string }[];
  links?: { rel?: string; href?: string; type?: string }[];
  vcardArray?: [string, JCardEntry[]];
  entities?: RdapEntity[];
};

/** Pulls one field out of an entity's jCard, e.g. "fn" or "email". */
function vcard(
  entity: RdapEntity | undefined,
  field: string,
): string | undefined {
  const entries = entity?.vcardArray?.[1];
  if (!Array.isArray(entries)) return undefined;

  for (const entry of entries) {
    if (!Array.isArray(entry) || entry[0] !== field) continue;
    const value = entry[3];

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed) return trimmed;
    }

    // "adr" arrives as seven positional components, most of them empty.
    if (Array.isArray(value)) {
      const joined = value
        .flat()
        .filter(
          (part): part is string =>
            typeof part === "string" && part.trim() !== "",
        )
        .join(", ");
      if (joined) return joined;
    }
  }

  return undefined;
}

function findEntity(entities: RdapEntity[] | undefined, role: string) {
  return entities?.find((e) => e.roles?.includes(role));
}

/* ------------------------------------------------------------------ */
/* Record                                                              */
/* ------------------------------------------------------------------ */

export type WhoisContact = {
  role: string;
  name?: string;
  org?: string;
  email?: string;
  phone?: string;
  address?: string;
};

export type WhoisRecord = {
  domain: string;
  /** Present on IDNs — the readable form of an xn-- name. */
  unicodeName?: string;
  handle?: string;
  statuses: WhoisStatus[];
  registered?: string;
  expires?: string;
  updated?: string;
  transferred?: string;
  registrar?: {
    name?: string;
    ianaId?: string;
    url?: string;
    abuseEmail?: string;
    abusePhone?: string;
  };
  contacts: WhoisContact[];
  nameservers: string[];
  dnssec: boolean;
  /** The registry told us it withheld fields (RFC 9537). */
  redacted: boolean;
  /** Which RDAP server answered. People ask, so we show it. */
  source: string;
};

type RdapDomain = {
  ldhName?: string;
  unicodeName?: string;
  handle?: string;
  status?: string[];
  events?: { eventAction?: string; eventDate?: string }[];
  entities?: RdapEntity[];
  nameservers?: { ldhName?: string; unicodeName?: string }[];
  secureDNS?: { delegationSigned?: boolean; zoneSigned?: boolean };
  redacted?: unknown[];
};

const CONTACT_ROLES: [string, string][] = [
  ["registrant", "Registrant"],
  ["administrative", "Admin"],
  ["technical", "Tech"],
  ["billing", "Billing"],
];

const EVENT_KEYS: Record<
  string,
  "registered" | "expires" | "updated" | "transferred"
> = {
  registration: "registered",
  expiration: "expires",
  "last changed": "updated",
  transfer: "transferred",
};

/** Turns an RDAP domain object into the flat shape the page renders. */
export function parseRdapDomain(json: unknown, source: string): WhoisRecord {
  const data = (json ?? {}) as RdapDomain;

  const record: WhoisRecord = {
    domain: (data.ldhName ?? "").toLowerCase(),
    unicodeName:
      data.unicodeName &&
      data.unicodeName.toLowerCase() !== data.ldhName?.toLowerCase()
        ? data.unicodeName
        : undefined,
    handle: data.handle,
    statuses: (data.status ?? []).map(toStatus),
    contacts: [],
    nameservers: (data.nameservers ?? [])
      .map((ns) => (ns.ldhName ?? "").toLowerCase())
      .filter(Boolean)
      .sort(),
    dnssec: Boolean(data.secureDNS?.delegationSigned),
    redacted: Array.isArray(data.redacted) && data.redacted.length > 0,
    source,
  };

  for (const event of data.events ?? []) {
    const key = EVENT_KEYS[(event.eventAction ?? "").toLowerCase()];
    if (key && event.eventDate) record[key] = event.eventDate;
  }

  const registrar = findEntity(data.entities, "registrar");
  if (registrar) {
    const abuse = findEntity(registrar.entities, "abuse");
    record.registrar = {
      name: vcard(registrar, "fn"),
      ianaId:
        registrar.publicIds?.find((id) => id.type === "IANA Registrar ID")
          ?.identifier ?? registrar.handle,
      url: registrar.links?.find((l) => l.rel === "about")?.href,
      abuseEmail: vcard(abuse, "email"),
      abusePhone: vcard(abuse, "tel")?.replace(/^tel:/, ""),
    };
  }

  for (const [role, label] of CONTACT_ROLES) {
    const entity = findEntity(data.entities, role);
    if (!entity) continue;

    const contact: WhoisContact = {
      role: label,
      name: vcard(entity, "fn"),
      org: vcard(entity, "org"),
      email: vcard(entity, "email"),
      phone: vcard(entity, "tel")?.replace(/^tel:/, ""),
      address: vcard(entity, "adr"),
    };

    // Registries commonly return an entity with every field stripped. An
    // empty card is noise, so only keep one that says something.
    if (
      contact.name ||
      contact.org ||
      contact.email ||
      contact.phone ||
      contact.address
    ) {
      record.contacts.push(contact);
    }
  }

  return record;
}

/* ------------------------------------------------------------------ */
/* Result                                                              */
/* ------------------------------------------------------------------ */

export type WhoisResult =
  | { status: "registered"; record: WhoisRecord; raw: unknown }
  /** RDAP answered 404 — nobody holds this name. */
  | { status: "available"; domain: string; source: string };

export type WhoisOutcome =
  | WhoisResult
  | {
      status: "error";
      domain: string;
      message: string;
      /** What the API route should answer with. */
      httpStatus: number;
    };

/** RDAP servers are slow more often than they are down. */
const UPSTREAM_TIMEOUT_MS = 12_000;

/**
 * One lookup, start to finish. Shared by the API route and the page, so a
 * link shared with ?domain= renders the record server-side and a search typed
 * into the box goes through the exact same parsing.
 *
 * Errors come back as data rather than thrown: every one of them is
 * something the visitor needs to read.
 */
export async function lookupDomain(domain: string): Promise<WhoisOutcome> {
  const service = await rdapServiceFor(tldOf(domain));
  const source = `${service}domain/${domain}`;

  let response: Response;
  try {
    response = await fetch(source, {
      headers: { Accept: "application/rdap+json" },
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
  } catch {
    return {
      status: "error",
      domain,
      message:
        "The registry did not answer in time. That is usually them, not you — try again in a moment.",
      httpStatus: 504,
    };
  }

  // RDAP says 404 when the name is not in the registry, which is the same
  // thing as "you can register it".
  if (response.status === 404) {
    return { status: "available", domain, source };
  }

  if (response.status === 429) {
    return {
      status: "error",
      domain,
      message: "The registry is rate-limiting us. Try again in a minute.",
      httpStatus: 429,
    };
  }

  if (!response.ok) {
    return {
      status: "error",
      domain,
      message: `The registry for .${tldOf(domain)} returned an error (${response.status}). Some extensions do not publish RDAP at all.`,
      httpStatus: 502,
    };
  }

  let raw: unknown;
  try {
    raw = await response.json();
  } catch {
    return {
      status: "error",
      domain,
      message: "The registry sent something we could not read.",
      httpStatus: 502,
    };
  }

  const record = parseRdapDomain(raw, source);
  if (!record.domain) record.domain = domain;

  return { status: "registered", record, raw };
}

/** Whole days from now until an ISO date. Negative once it has passed. */
export function daysUntil(iso: string): number {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return 0;
  return Math.ceil((then - Date.now()) / 86_400_000);
}
