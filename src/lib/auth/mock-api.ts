/**
 * ────────────────────────────────────────────────────────────────────
 *  MOCK AUTH BACKEND
 * ────────────────────────────────────────────────────────────────────
 *  Stands in for the real API until the backend lands. Every function
 *  here is async and returns the response envelope the UI already
 *  expects, so swapping the bodies for `fetch()` calls is the whole
 *  migration — no component changes.
 *
 *  DEMO CREDENTIALS
 *    demo@hostracer.in    / Demo@1234   → signs straight in
 *    secure@hostracer.in  / Demo@1234   → asks for a 2FA code
 *    Any OTP / 2FA code   : 123456
 * ────────────────────────────────────────────────────────────────────
 */

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
};

export type AuthResult =
  | { ok: true; user: AuthUser; token: string }
  /** Credentials were fine, but a second factor is required first */
  | { ok: false; challenge: "2fa" | "otp"; ticket: string; hint: string }
  | { ok: false; error: string; field?: "email" | "password" | "phone" };

export const DEMO_CODE = "123456";

type StoredUser = AuthUser & { password: string };

const seedUsers: StoredUser[] = [
  {
    id: "usr_8f21c",
    fullName: "Demo Customer",
    email: "demo@hostracer.in",
    phone: "9876543210",
    password: "Demo@1234",
    emailVerified: true,
    phoneVerified: true,
    twoFactorEnabled: false,
    createdAt: "2025-11-02T09:15:00.000Z",
  },
  {
    id: "usr_3b94a",
    fullName: "Secure Customer",
    email: "secure@hostracer.in",
    phone: "9812345670",
    password: "Demo@1234",
    emailVerified: true,
    phoneVerified: true,
    twoFactorEnabled: true,
    createdAt: "2025-06-18T14:40:00.000Z",
  },
];

/** Registrations made during this browser session live here. */
const runtimeUsers: StoredUser[] = [];

/** Tickets issued for a pending second factor. */
const pendingChallenges = new Map<
  string,
  { user: StoredUser; kind: "2fa" | "otp" }
>();

const allUsers = () => [...seedUsers, ...runtimeUsers];

/**
 * Project a stored record onto the public shape. Written field-by-field on
 * purpose: this is the boundary that keeps credentials out of the client, and
 * a rest-spread would silently leak any secret added to StoredUser later.
 */
const strip = (u: StoredUser): AuthUser => ({
  id: u.id,
  fullName: u.fullName,
  email: u.email,
  phone: u.phone,
  emailVerified: u.emailVerified,
  phoneVerified: u.phoneVerified,
  twoFactorEnabled: u.twoFactorEnabled,
  createdAt: u.createdAt,
});

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Network-ish delay so loading states are actually exercised. */
const latency = () => wait(650 + Math.random() * 450);

const ticketFor = (user: StoredUser, kind: "2fa" | "otp") => {
  const ticket = `tkt_${Math.random().toString(36).slice(2, 11)}`;
  pendingChallenges.set(ticket, { user, kind });
  return ticket;
};

const maskPhone = (phone: string) => `••••• ${phone.slice(-5)}`;

/* ------------------------------------------------------------------ */

export async function signIn(input: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  await latency();

  const email = input.email.trim().toLowerCase();
  const user = allUsers().find((u) => u.email.toLowerCase() === email);

  if (!user) {
    return {
      ok: false,
      error: "No account found with that email address.",
      field: "email",
    };
  }

  if (user.password !== input.password) {
    return {
      ok: false,
      error: "That password doesn't match our records.",
      field: "password",
    };
  }

  if (user.twoFactorEnabled) {
    return {
      ok: false,
      challenge: "2fa",
      ticket: ticketFor(user, "2fa"),
      hint: "Open your authenticator app and enter the current 6-digit code.",
    };
  }

  return { ok: true, user: strip(user), token: `tok_${user.id}` };
}

/* ------------------------------------------------------------------ */

export async function signUp(input: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}): Promise<AuthResult> {
  await latency();

  const email = input.email.trim().toLowerCase();

  if (allUsers().some((u) => u.email.toLowerCase() === email)) {
    return {
      ok: false,
      error: "An account with this email already exists. Try signing in.",
      field: "email",
    };
  }

  if (allUsers().some((u) => u.phone === input.phone)) {
    return {
      ok: false,
      error: "This mobile number is already registered.",
      field: "phone",
    };
  }

  const user: StoredUser = {
    id: `usr_${Math.random().toString(36).slice(2, 8)}`,
    fullName: input.fullName.trim(),
    email,
    phone: input.phone,
    password: input.password,
    emailVerified: false,
    phoneVerified: false,
    twoFactorEnabled: false,
    createdAt: new Date().toISOString(),
  };

  runtimeUsers.push(user);

  // The account exists but stays unverified until the SMS OTP is confirmed.
  return {
    ok: false,
    challenge: "otp",
    ticket: ticketFor(user, "otp"),
    hint: `We sent a 6-digit code to ${maskPhone(user.phone)}.`,
  };
}

/* ------------------------------------------------------------------ */

export async function verifyChallenge(input: {
  ticket: string;
  code: string;
}): Promise<AuthResult> {
  await latency();

  const pending = pendingChallenges.get(input.ticket);

  if (!pending) {
    return {
      ok: false,
      error: "This verification session expired. Please start again.",
    };
  }

  if (input.code.trim() !== DEMO_CODE) {
    return {
      ok: false,
      error: "That code isn't right. Check it and try again.",
    };
  }

  pendingChallenges.delete(input.ticket);

  const { user, kind } = pending;
  if (kind === "otp") {
    user.phoneVerified = true;
    user.emailVerified = true;
  }

  return { ok: true, user: strip(user), token: `tok_${user.id}` };
}

/* ------------------------------------------------------------------ */

export async function resendCode(ticket: string): Promise<{ ok: boolean }> {
  await wait(500);
  return { ok: pendingChallenges.has(ticket) };
}

/* ------------------------------------------------------------------ */

export async function requestPasswordReset(
  email: string,
): Promise<{ ok: true }> {
  await latency();
  void email; // Always reports success so we don't leak which emails exist.
  return { ok: true };
}
