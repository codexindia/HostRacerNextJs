import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/primitives";
import { CheckoutClient } from "./checkout-client";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Hostracer order.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutClient />
    </Suspense>
  );
}

function CheckoutSkeleton() {
  return (
    <Container className="py-8 lg:py-12">
      <div className="mx-auto mb-9 h-8 max-w-2xl animate-pulse rounded-full bg-surface-2" />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
        <div className="space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-[13px] bg-surface-2"
            />
          ))}
        </div>
        <div className="h-[420px] animate-pulse rounded-[16px] bg-surface-2" />
      </div>
    </Container>
  );
}
