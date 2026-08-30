import type { Metadata, Viewport } from "next";
import { Sora, Manrope, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { site } from "@/lib/site";
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
  keywords: [
    "web hosting India",
    "cheap hosting India",
    "VPS hosting India",
    "domain registration India",
    "reseller hosting",
    "WordPress hosting",
    "NVMe hosting",
    "cPanel hosting",
  ],
  applicationName: site.name,
  authors: [{ name: site.legalName }],
  creator: site.legalName,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
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
    { media: "(prefers-color-scheme: light)", color: "#fbfaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a12" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      suppressHydrationWarning
      className={`${sora.variable} ${manrope.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
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
