import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/primitives";
import { SuccessClient } from "./success-client";

export const metadata: Metadata = {
  title: "Order confirmed",
  description: "Your Hostracer order has been confirmed.",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <Container className="grid place-items-center py-24">
          <div className="size-8 animate-spin rounded-full border-2 border-line-strong border-t-brand-500" />
        </Container>
      }
    >
      <SuccessClient />
    </Suspense>
  );
}
