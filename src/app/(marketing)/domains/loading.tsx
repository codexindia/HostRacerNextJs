import { Container } from "@/components/ui/primitives";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * `/domains` reads `?q=` on the server, so it renders on demand rather than
 * being prefetched as static — the one marketing route with a real pending
 * phase. The search band is drawn at its true height so the header doesn't
 * jump when results arrive.
 */
export default function DomainsLoading() {
  return (
    <section className="border-b border-line bg-surface-2">
      <Container>
        <div className="mx-auto max-w-[720px] py-14 lg:py-20">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-4 w-24 rounded-[6px]" />
            <Skeleton className="h-11 w-4/5 rounded-[10px]" />
            <Skeleton className="h-4 w-3/5 rounded-[6px]" />
          </div>

          <Skeleton className="mt-8 h-16 rounded-[14px]" />

          <div className="mt-7 space-y-px overflow-hidden rounded-[14px] border border-line">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-surface px-5 py-4"
              >
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/5 rounded-[6px]" />
                  <Skeleton className="h-3 w-24 rounded-[6px]" />
                </div>
                <Skeleton className="h-4 w-16 rounded-[6px]" />
                <Skeleton className="h-8 w-[104px] rounded-[8px]" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
