import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/primitives";
import { Skeleton } from "@/components/ui/skeleton";
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
      <Skeleton className="mx-auto mb-9 h-8 max-w-2xl rounded-full" />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
        <div className="space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-[13px]" />
          ))}
        </div>
        <Skeleton className="h-[420px] rounded-[16px]" />
      </div>
    </Container>
  );
}
