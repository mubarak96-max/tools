import type { Metadata } from "next";
import {
  DM_Sans,
  DM_Serif_Display,
  Inter,
  JetBrains_Mono,
  Space_Grotesk,
  Syne,
} from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";
import { getBaseUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo/metadata";
import { ADSENSE_CLIENT_ID } from "@/lib/consent";

const sansFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});
const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});
const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});
const serifFont = DM_Serif_Display({ subsets: ["latin"], weight: ["400"], variable: "--font-serif" });
const syneFont = Syne({ subsets: ["latin"], weight: ["400", "700", "800"], variable: "--font-syne" });
const dmSansFont = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-dm-sans" });
const dmSerifFont = DM_Serif_Display({ subsets: ["latin"], weight: ["400"], variable: "--font-dm-serif" });

export const metadata: Metadata = {
  metadataBase: getBaseUrl(),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  other: {
    "google-adsense-account": ADSENSE_CLIENT_ID,
    "yandex-verification": "fefe84d52df8498c",
  },
  icons: {
    icon: "/images/favicon.svg",
    shortcut: "/images/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="google-adsense"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          strategy="beforeInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${sansFont.variable} ${displayFont.variable} ${monoFont.variable} ${serifFont.variable} ${syneFont.variable} ${dmSansFont.variable} ${dmSerifFont.variable} font-sans antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        <div className="site-backdrop pointer-events-none fixed inset-0 z-[-1]" />
        <Header />
        <main className="flex-grow pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
        <Footer />

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-056PHFBMP3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-056PHFBMP3');
          `}
        </Script>
      </body>
    </html>
  );
}
