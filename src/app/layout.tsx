import type { Metadata, Viewport } from "next";
import { Sora, Manrope, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { colors, cssVariables, seo, site } from "@/config/site.config";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [...seo.keywords],
  applicationName: site.name,
  authors: [{ name: site.legalName }],
  creator: site.legalName,
  openGraph: {
    type: "website",
    locale: seo.ogLocale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: seo.twitterCard,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: colors.light.canvas },
    { media: "(prefers-color-scheme: dark)", color: colors.dark.canvas },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={site.locale}
      suppressHydrationWarning
      // Tells Next the smooth scrolling in globals.css is intentional, and to
      // suppress it during route transitions.
      data-scroll-behavior="smooth"
      className={`${sora.variable} ${manrope.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <head>
        {/* Brand palette from src/config/site.config.ts. Tailwind's theme in
            globals.css maps onto these properties, so this is what makes the
            config file drive every colour utility on the site. */}
        <style
          id="brand-palette"
          dangerouslySetInnerHTML={{ __html: cssVariables }}
        />
      </head>
      {/* Browser extensions routinely stamp attributes onto <body> before
          React hydrates; suppressing here keeps that noise out of the console. */}
      <body suppressHydrationWarning className="flex min-h-full flex-col">
        <ThemeProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              classNames: {
                toast:
                  "!bg-surface !text-content !border-line !rounded-[10px] !font-sans",
                description: "!text-content-muted",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
