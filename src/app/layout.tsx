import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getBaseUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo/metadata";
import { ADSENSE_CLIENT_ID } from "@/lib/consent";
import GoogleServices from "@/components/consent/GoogleServices";
import CookieConsentBanner from "@/components/consent/CookieConsentBanner";

export const metadata: Metadata = {
  metadataBase: getBaseUrl(),
  title: {
    default: SITE_NAME,
    template: `%s`,
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
      <head />
      <body
        className="font-sans antialiased min-h-screen flex flex-col bg-background text-foreground"
      >
        <div className="site-backdrop pointer-events-none fixed inset-0 z-[-1]" />
        <Header />
        <main className="flex-grow pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
        <Footer />

        {/* Google services only load after the user accepts the consent banner */}
        <GoogleServices />
        <CookieConsentBanner />
      </body>
    </html>
  );
}
