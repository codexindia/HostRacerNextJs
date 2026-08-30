import { z } from "zod";

/** Indian mobile numbers: 10 digits starting 6–9. */
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number");

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email address is required")
  .email("That doesn't look like a valid email address");

export const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters")
  .regex(/[a-z]/, "Include at least one lowercase letter")
  .regex(/[A-Z]/, "Include at least one uppercase letter")
  .regex(/\d/, "Include at least one number");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password"),
  remember: z.boolean().optional(),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Enter your full name")
      .max(60, "That name is too long")
      .regex(/^[\p{L}\s.'-]+$/u, "Use letters only"),
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    terms: z.boolean().refine((v) => v === true, {
      message: "Please accept the terms to continue",
    }),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Both passwords must match",
  });

export type RegisterValues = z.infer<typeof registerSchema>;

export const otpSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter the 6-digit code"),
});

export type OtpValues = z.infer<typeof otpSchema>;

/* ------------------------------------------------------------------ */
/* Password strength — drives the meter under the password field       */
/* ------------------------------------------------------------------ */

export type PasswordStrength = {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  checks: { label: string; met: boolean }[];
};

export function scorePassword(password: string): PasswordStrength {
  const checks = [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "Upper & lowercase", met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { label: "A number", met: /\d/.test(password) },
    { label: "A symbol", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const met = checks.filter((c) => c.met).length;
  // A long password earns the top score even without a symbol.
  const score = Math.min(
    4,
    met + (password.length >= 14 && met >= 3 ? 1 : 0),
  ) as PasswordStrength["score"];

  const labels = ["Too short", "Weak", "Fair", "Good", "Strong"] as const;

  return { score, label: labels[score], checks };
}
