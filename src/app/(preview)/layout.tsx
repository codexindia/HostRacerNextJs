import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

/**
 * The preview lives in its own group so the header and footer sit *inside*
 * `.theme-hr2` — otherwise the chrome keeps the live violet/saffron palette
 * and the page below it reads blue, which is exactly the clash this is
 * meant to be judged on.
 *
 * ON MERGE: delete this group, move the page back under (marketing), and
 * move the palette into site.config.ts so every route gets it.
 */
export default function PreviewLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="theme-hr2 flex min-h-full flex-1 flex-col bg-canvas">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
