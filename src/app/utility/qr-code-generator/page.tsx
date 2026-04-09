import Link from "next/link";
import type { Metadata } from "next";

import QRCodeGenerator from "@/app/utility/qr-code-generator/components/QRCodeGenerator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/utility/qr-code-generator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "Is this QR code generator completely free?",
    answer:
      "Yes, completely free. We do not place logos inside the QR code, there are no scan limits, and you don't even need to sign up to download.",
  },
  {
    question: "Do these QR codes ever expire?",
    answer:
      "No. These are 'Static' QR codes. The data (like your website URL or text) is embedded directly into the image itself. As long as your website doesn't go offline, the QR code will work forever.",
  },
  {
    question: "What does 'Error Correction' mean?",
    answer:
      "Error correction allows a QR code to remain scannable even if part of it is damaged, dirty, or covered up. A 'High' error correction level means up to 30% of the QR code can be destroyed and it will still scan perfectly.",
  },
  {
    question: "Can I use these QR codes for commercial print?",
    answer:
      "Yes. The downloaded PNGs are generated at high resolution locally in your browser. They are perfect for flyers, business cards, restaurant menus, and product packaging.",
  },
];

export const metadata: Metadata = {
  title: "QR Code Generator | Free Online Maker (No Expiry)",
  description:
    "Free online QR code generator. Create custom QR codes for URLs, text, and contact info instantly. Change colors and download high-resolution PNGs without sign up.",
  keywords: [
    "QR code generator",
    "free QR code maker",
    "create QR code online",
    "QR code without expiry",
    "custom QR code generator",
    "QR code for website",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Free QR Code Generator",
    description:
      "Create custom QR codes that never expire. Instantly download high-quality PNGs with custom colors.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free QR Code Generator",
    description:
      "Generate custom QR codes instantly in your browser with zero scan limits or expiry dates.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "QR Code Generator",
    url: PAGE_URL,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Free browser-based utility to generate static QR codes from URLs and text, with custom color controls and immediate PNG downloading.",
    featureList: [
      "No expiration dates",
      "No scan limits",
      "Custom foreground and background colors",
      "Adjustable Error Correction levels",
      "100% private browser-side generation",
    ],
  };
}

export default function QRCodeGeneratorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Utility", path: "/utility" },
    { name: "QR Code Generator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/utility" className="hover:text-primary">Utility</Link></li>
            <li>/</li>
            <li className="text-foreground">QR Code Generator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Web Utility
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Free QR Code Generator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Create completely free static QR codes that never expire. Customize the colors, adjust error correction, and instantly download a high-resolution PNG image.
          </p>
        </div>
      </section>

      <QRCodeGenerator />

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Why use our QR Code maker?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Many websites try to trick you into creating "Dynamic" QR codes, only to charge you a massive monthly subscription fee just to keep your code scannable.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Our tool generates completely <strong>Static QR Codes</strong>. The text or URL you enter is directly hardcoded into the graphic pattern itself. The processing happens instantly right inside your internet browser, ensuring maximum privacy and guaranteeing that the barcode will work forever without relying on our servers.
          </p>
        </div>
      </section>

      <section className="space-y-6 border-t border-border/60 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
        <div className="mt-6 space-y-4">
          {faq.map((item, index) => (
            <article key={item.question} className={`py-4 ${index === 0 ? "" : "border-t border-border/50"}`}>
              <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <RelatedToolsSection category="Utility" categoryHref="/utility" currentPath={PAGE_PATH} />
    </div>
  );
}
