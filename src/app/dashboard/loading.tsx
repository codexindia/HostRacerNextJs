import { Skeleton, SkeletonPanel } from "@/components/ui/skeleton";

/**
 * Covers every dashboard segment that doesn't ship its own loading file.
 *
 * Shaped like the pages it stands in for — a header, a row of figures, then
 * a panel with rows — so the swap to real content doesn't jump. It is not a
 * spinner: the layout already spins while the session rehydrates, and two
 * spinners in a row reads as one thing being slow twice.
 */
export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-[1180px] space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2.5">
          <Skeleton className="h-7 w-52 rounded-[10px]" />
          <Skeleton className="h-4 w-72 rounded-[6px]" />
        </div>
        <Skeleton className="h-11 w-36 rounded-[10px]" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <SkeletonPanel key={i} className="space-y-3">
            <Skeleton className="h-3.5 w-20 rounded-[6px]" />
            <Skeleton className="h-7 w-28 rounded-[8px]" />
            <Skeleton className="h-3 w-32 rounded-[6px]" />
          </SkeletonPanel>
        ))}
      </div>

      <div className="overflow-hidden rounded-[14px] border border-line bg-surface">
        <div className="border-b border-line px-5 py-4">
          <Skeleton className="h-4 w-32 rounded-[6px]" />
        </div>
        <div className="divide-y divide-line">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <Skeleton className="size-10 shrink-0 rounded-[11px]" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3 rounded-[6px]" />
                <Skeleton className="h-3 w-1/2 rounded-[6px]" />
              </div>
              <Skeleton className="h-8 w-24 shrink-0 rounded-[8px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
