import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Manrope, IBM_Plex_Mono } from "next/font/google";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { SmoothScroll } from "@/lib/lenis";
import { Theme } from "@/lib/theme";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PersonJsonLd, WebsiteJsonLd } from "@/components/seo/json-ld";
import { Preloader } from "@/components/site/preloader";
import { site } from "@/content/site";
import "./globals.css";

/* Three voices: a display serif, a characterful sans, a plotter-ish mono.
   All self-hosted by next/font — zero external font requests at runtime. */
const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.heroSub,
  keywords: [
    site.name,
    "Software Engineer",
    "Web Designer",
    "UI/UX Designer",
    "Jaffna",
    "Sri Lanka",
    "Framer",
    "Portfolio",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.heroSub,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.heroSub,
  },
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": `${site.url}/feed.xml` },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f4ee" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      // next-themes sets data-theme on <html> before hydration; the attribute
      // legitimately differs from the server render.
      suppressHydrationWarning
      className={`${instrumentSerif.variable} ${manrope.variable} ${plexMono.variable}`}
    >
      <body className="grain antialiased">
        <a
          href="#main"
          className="label sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:text-ink"
        >
          Skip to content
        </a>
        <PersonJsonLd />
        <WebsiteJsonLd />
        <Theme>
          {/* Overlay only — never gates the content underneath it */}
          <Preloader />
          <SmoothScroll>
            <Nav />
            <main id="main">{children}</main>
            <Footer />
          </SmoothScroll>
        </Theme>
        {/*
          Outside <Theme> deliberately: both are invisible script-injectors with
          no styling, so they gain nothing from the provider and stay clear of
          the smooth-scroll subtree. Each no-ops off Vercel.
        */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
