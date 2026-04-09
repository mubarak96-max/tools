import Link from "next/link";
import type { Metadata } from "next";

import BarcodeGenerator from "@/app/utility/barcode-generator/components/BarcodeGenerator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/utility/barcode-generator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is the best barcode format to use?",
    answer:
      "CODE128 is generally the most robust and universal 1D barcode format because it supports all ASCII characters (both letters and numbers) and is highly compact. If you are selling a product in a retail store, you likely need a UPC or EAN-13 barcode.",
  },
  {
    question: "Do I need to pay for a barcode?",
    answer:
      "Generating the barcode image here is completely free. However, if you are selling a commercial product in standard retail stores (like Walmart or Target), you must purchase a certified UPC or EAN number from GS1. You can then use this tool to turn that number into a scannable graphic.",
  },
  {
    question: "Why isn't my barcode generating?",
    answer:
      "Certain barcode formats have strict requirements. For example, a UPC barcode must be exactly 11 or 12 numbers long. An EAN-13 barcode must be exactly 12 or 13 numbers. If you type letters into a number-only format, the image will fail to render.",
  },
  {
    question: "Can I customize the barcode colors?",
    answer:
      "Yes! But please be careful. Standard barcode scanners rely on contrast. The optimal design is always black bars on a pure white background. Using dark backgrounds or light bars may cause laser scanners to fail to read the code.",
  },
];

export const metadata: Metadata = {
  title: "Barcode Generator | Free UPC, EAN & CODE128 Maker",
  description:
    "Free online barcode generator. Create CODE128, UPC, and EAN barcodes instantly. Download high-resolution PNG images for retail, inventory, and shipping.",
  keywords: [
    "barcode generator",
    "free barcode maker",
    "create barcode online",
    "UPC generator",
    "EAN generator",
    "CODE128 barcode",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Free Barcode Generator",
    description:
      "Instantly create CODE128, UPC, and EAN barcodes. Download high-quality PNGs for free.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Barcode Generator",
    description:
      "Generate retail and inventory barcodes instantly in your browser.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Barcode Generator",
    url: PAGE_URL,
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Free browser-based utility to generate 1D barcodes including CODE128, UPC, EAN, and ITF14, with instant PNG downloading.",
    featureList: [
      "Supports CODE128, CODE39, UPC, EAN, ITF14, MSI, Codabar",
      "Adjustable bar width and height",
      "Custom foreground and background colors",
      "100% private browser-side generation",
    ],
  };
}

export default function BarcodeGeneratorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Utility", path: "/utility" },
    { name: "Barcode Generator", path: PAGE_PATH },
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
            <li className="text-foreground">Barcode Generator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Web Utility
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Barcode Generator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Instantly create retail and inventory barcodes. Support for universal formats including CODE128, UPC, EAN, and ITF14. Download the result as a high-resolution PNG.
          </p>
        </div>
      </section>

      <BarcodeGenerator />

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Common Barcode Types Explained</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            If you aren't sure which format you need, here is a quick breakdown of the most common standard templates available in our tool:
          </p>
          <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
            <li>
              <strong className="text-foreground">CODE 128:</strong> The go-to choice for inventory, shipping, and internal tracking. It supports all alphanumeric characters and symbols, making it incredibly versatile.
            </li>
            <li>
              <strong className="text-foreground">UPC:</strong> Universal Product Code. This is the classic 12-digit barcode used almost exclusively for retail products sold in North America.
            </li>
            <li>
              <strong className="text-foreground">EAN-13:</strong> The European Article Number. This is the international equivalent to UPC and is used on commercial products globally.
            </li>
            <li>
              <strong className="text-foreground">ITF-14:</strong> A 14-digit code used primarily for shipping boxes and warehouse pallets. It is specifically designed to be easily read even when printed on rough corrugated cardboard.
            </li>
          </ul>
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
