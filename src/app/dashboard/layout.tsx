"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogoLink } from "@/components/brand/logo";
import { Sidebar, SidebarDrawer } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { useAuth } from "@/lib/auth/store";
import { useHydrated } from "@/lib/use-hydrated";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuth((s) => s.user);
  const hydrated = useHydrated(useAuth);

  // Same trick as the marketing header: storing the path the drawer opened on
  // means any navigation closes it, with no effect to keep in sync.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const drawerOpen = openedAt === pathname;

  useEffect(() => {
    if (hydrated && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [hydrated, user, router, pathname]);

  if (!hydrated || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-canvas">
        <div className="size-8 animate-spin rounded-full border-2 border-line-strong border-t-brand-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas">
      {/* Fixed rail on desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[272px] flex-col border-r border-line lg:flex">
        <div className="flex h-16 shrink-0 items-center border-b border-line bg-surface px-6">
          <LogoLink height={26} priority />
        </div>
        <div className="min-h-0 flex-1">
          <Sidebar />
        </div>
      </aside>

      <SidebarDrawer
        open={drawerOpen}
        onClose={() => setOpenedAt(null)}
      />

      <div className="lg:pl-[272px]">
        <Topbar onOpenMenu={() => setOpenedAt(pathname)} />
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
