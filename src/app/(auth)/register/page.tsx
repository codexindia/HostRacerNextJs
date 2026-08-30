import type { Metadata } from "next";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Create your account",
  description:
    "Open a free Hostracer account in under a minute. No card required — you only pay when you pick a plan.",
  robots: { index: false, follow: true },
};

export default function RegisterPage() {
  return <RegisterForm />;
}
