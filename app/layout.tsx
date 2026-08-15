import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Instrument_Serif } from "next/font/google";

import "./globals.css";
import { profile, socials } from "@/content/site";
import { SmoothScroll } from "@/components/fx/smooth-scroll";
import { CursorGlow } from "@/components/fx/cursor-glow";
import { ScrollProgress } from "@/components/fx/scroll-progress";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic", "normal"],
  display: "swap",
  variable: "--font-serif",
});

const description = profile.summary;

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: `${profile.name} — ${profile.roles[0]}`,
    template: `%s — ${profile.name}`,
  },
  description,
  keywords: [
    profile.name,
    "software engineer",
    "backend engineer",
    "distributed systems",
    "FastAPI",
    "Spring Boot",
    "Google Cloud Platform",
    "Vertex AI",
    "LLM integration",
    "PostgreSQL",
    "Grid Dynamics",
    "portfolio",
  ],
  authors: [{ name: profile.name, url: profile.siteUrl }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: profile.siteUrl,
    siteName: `${profile.name} — Portfolio`,
    title: `${profile.name} — ${profile.roles[0]}`,
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.roles[0]}`,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#060607",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: profile.siteUrl,
  email: `mailto:${profile.email}`,
  jobTitle: profile.roles[0],
  description,
  image: profile.portrait ? `${profile.siteUrl}${profile.portrait}` : undefined,
  address: { "@type": "PostalAddress", addressLocality: profile.location },
  worksFor: { "@type": "Organization", name: "Grid Dynamics" },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Motilal Nehru National Institute of Technology, Allahabad",
  },
  knowsAbout: [
    "Backend Engineering",
    "Distributed Systems",
    "Cloud Architecture",
    "System Design",
    "LLM Integration",
    "FastAPI",
    "PostgreSQL",
  ],
  sameAs: socials.filter((s) => s.href.startsWith("http")).map((s) => s.href),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${serif.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-canvas text-ink">
        <script
          type="application/ld+json"
          // Structured data must be injected as raw JSON, not React children.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[80] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-canvas"
        >
          Skip to content
        </a>

        <ScrollProgress />
        <CursorGlow />
        <Nav />

        <SmoothScroll>
          <main id="main">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
