import type { Metadata } from "next";
import { Space_Grotesk, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";
import { getBaseUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo/metadata";
import { ADSENSE_CLIENT_ID } from "@/lib/consent";

const sansFont = Space_Grotesk({ subsets: ["latin"], variable: "--font-sans" });
const serifFont = Source_Serif_4({ subsets: ["latin"], variable: "--font-serif" });

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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "w93y2y7qkg");
            `,
          }}
        />
      </head>
      <body
        className={`${sansFont.variable} ${serifFont.variable} font-sans antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        <div className="site-backdrop pointer-events-none fixed inset-0 z-[-1]" />
        <Header />
        <main className="flex-grow pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
        <Footer />

        <Script
          id="google-adsense"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />

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
