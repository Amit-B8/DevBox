import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/site";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "DevBox",
      url: siteConfig.siteUrl,
      logo: `${siteConfig.siteUrl}/devbox-icon.svg`,
      description: siteConfig.defaultDescription,
    },
    {
      "@type": "WebSite",
      name: "DevBox",
      url: siteConfig.siteUrl,
      description: siteConfig.defaultDescription,
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteConfig.siteUrl}/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "DevBox",
    template: "%s | DevBox",
  },
  description: siteConfig.defaultDescription,
  applicationName: siteConfig.siteName,
  authors: [{ name: "DevBox" }],
  keywords: [
    "DevBox",
    "developer tools",
    "engineering tools",
    "medical calculators",
    "finance calculators",
    "JSON converter",
    "JWT inspector",
    "utility suite",
  ],
  openGraph: {
    title: "DevBox",
    description: siteConfig.defaultDescription,
    url: siteConfig.siteUrl,
    siteName: siteConfig.siteName,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevBox",
    description: siteConfig.defaultDescription,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/devbox-icon.svg",
    shortcut: "/devbox-icon.svg",
    apple: "/devbox-icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#030712",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-gray-900"
        >
          Skip to main content
        </a>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <div className="min-h-screen bg-gray-950 text-white">
          <div id="main-content">{children}</div>

          <footer className="border-t border-gray-800 bg-gray-950">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-gray-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p>© 2026 DevBox</p>

              <nav aria-label="Footer" className="flex flex-wrap gap-4">
                <a href="/about" className="transition-colors hover:text-white">About</a>
                <a href="/privacy-policy" className="transition-colors hover:text-white">Privacy Policy</a>
                <a href="/terms" className="transition-colors hover:text-white">Terms</a>
                <a href="/contact" className="transition-colors hover:text-white">Contact</a>
              </nav>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}