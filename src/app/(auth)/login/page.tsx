import { Suspense } from "react";
import type { Metadata } from "next";
import { Skeleton } from "@/components/ui/skeleton";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to your Hostracer account to manage hosting, domains, invoices and support tickets.",
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}

function FormSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-8 w-3/5 rounded-[10px]" />
      <Skeleton className="h-4 w-2/5 rounded-[6px]" />
      <Skeleton className="h-28 rounded-[12px]" />
      <Skeleton className="h-12 rounded-[10px]" />
      <Skeleton className="h-12 rounded-[10px]" />
      <Skeleton className="h-13 rounded-[11px]" />
    </div>
  );
}
