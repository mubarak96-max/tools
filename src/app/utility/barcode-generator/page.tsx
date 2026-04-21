import Link from "next/link";
import type { Metadata } from "next";

import BarcodeGenerator from "@/app/utility/barcode-generator/components/BarcodeGenerator";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/utility/barcode-generator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Free Barcode Generator – Create UPC, EAN-13 & CODE128 Barcodes Online",
  description:
    "Generate free barcodes online instantly. Supports CODE128, UPC, EAN-13, EAN-8, ITF-14 and more. Customize colors and size, then download as a high-resolution PNG.",
  keywords: [
    "barcode generator free",
    "barcode maker online",
    "free upc barcode generator",
    "ean-13 barcode generator",
    "code 128 barcode generator",
    "barcode generator for products",
    "barcode generator download",
    "barcode creator online free",
    "free barcode generator for inventory",
    "amazon barcode generator",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Free Barcode Generator – Unlimited Barcodes, No Sign-up",
    description:
      "Generate retail and inventory barcodes instantly in your browser. Download high-quality PNGs ready for printing.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Barcode Generator Online",
    description:
      "Generate retail and inventory barcodes instantly in your browser with zero limits.",
  },
};

const faq = [
  {
    question: "Do I need to pay for a barcode?",
    answer:
      "Generating the barcode image here is completely free. However, if you are selling a commercial product in major retail stores (like Amazon, Walmart, or Target), you must purchase a certified UPC or EAN company prefix from GS1. You can then use this tool to turn your assigned numbers into scannable graphics.",
  },
  {
    question: "How do I get a UPC barcode for my product?",
    answer:
      "To get a legitimate UPC barcode for retail sale, you should register with GS1 (Global Standards 1). They will provide you with a unique Company Prefix and the specific numbers for your products. Once you have your numbers, you can use our generator to create the scannable barcode images for your labels.",
  },
  {
    question: "How do I make a barcode for Amazon FBA?",
    answer:
      "Amazon usually requires an EAN or UPC code to list a product. Additionally, for FBA shipments, they often require an FNSKU barcode. You can generate these using the CODE128 format in our tool. Simply enter your FNSKU string, choose CODE128, and download the high-resolution PNG for your product labels.",
  },
  {
    question: "What is the best barcode format for general use?",
    answer:
      "CODE128 is the industry standard for general purposes like shipping, inventory, and asset tracking. It is compact and supports both letters and numbers, making it the most versatile 1D barcode format available today.",
  },
  {
    question: "What size should a barcode be for printing?",
    answer:
      "For standard retail (UPC/EAN), the nominal size is roughly 1.469 inches wide by 1.02 inches high. You can scale this down to 80% if space is tight, but going smaller than that may cause checkout scanners to fail.",
  },
  {
    question: "What is the difference between UPC-A and UPC-E?",
    answer:
      "UPC-A is the standard 12-digit barcode used on most products. UPC-E is a 'zero-suppressed' version that condenses the same information into a smaller 6-digit format, specifically designed for small items like chewing gum or cosmetic pencils.",
  },
  {
    question: "Can I use these barcodes for my Excel or Google Sheets inventory?",
    answer:
      "Yes. Many small businesses use our generator to create barcodes for their internal inventory systems. You can print the barcodes, stick them on your shelves or items, and use a standard USB or Bluetooth scanner to input the data directly into your spreadsheet.",
  },
  {
    question: "What resolution should I download the barcode image at?",
    answer:
      "Our tool generates high-resolution PNGs at 300 DPI, which is the gold standard for professional printing. This ensures that the edges of the bars are sharp and crisp, preventing 'bleeding' during the printing process which can make the code unreadable.",
  },
  {
    question: "Can I customize the barcode colors?",
    answer:
      "Yes, but we strongly recommend sticking to dark bars (black or dark blue) on a light background (white or yellow). Barcode scanners work by measuring the reflection of light off the spaces; if the contrast is too low, the scanner won't be able to distinguish the bars.",
  },
  {
    question: "Why isn't my barcode generating?",
    answer:
      "Most failures happen because of invalid input data for a specific format. For example, UPC barcodes require exactly 11 or 12 digits, and EAN-13 requires 12 or 13 digits. If you enter letters or the wrong number of characters, the generator will not render the image.",
  },
];

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
            Free Online Barcode Generator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Generate a free barcode online in seconds. Enter any number or text, choose a format—including CODE128, UPC, EAN-13, and ITF-14—then download a high-resolution PNG ready for labels, products, or inventory sheets. No account or sign-up needed.
          </p>
        </div>
      </section>

      <BarcodeGenerator />

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Common Barcode Standards Explained</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Our tool supports all 8 major 1D barcode formats used in retail and industry globally. Here is a breakdown of when and where to use each:
          </p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-4">
              <article>
                <h4 className="font-bold text-foreground">CODE 128</h4>
                <p className="text-sm text-muted-foreground">The most versatile standard. Used for shipping, logistics, and internal inventory. It supports all ASCII characters including letters and symbols.</p>
              </article>
              <article>
                <h4 className="font-bold text-foreground">UPC-A</h4>
                <p className="text-sm text-muted-foreground">The classic 12-digit barcode used for retail products in North America. Essential for selling on Amazon or in physical stores.</p>
              </article>
              <article>
                <h4 className="font-bold text-foreground">EAN-13</h4>
                <p className="text-sm text-muted-foreground">The international version of UPC. Used globally for commercial product identification at checkout.</p>
              </article>
              <article>
                <h4 className="font-bold text-foreground">ITF-14</h4>
                <p className="text-sm text-muted-foreground">A 14-digit code designed for corrugated cardboard. Ideal for bulk shipping boxes and warehouse pallets.</p>
              </article>
            </div>
            <div className="space-y-4">
              <article>
                <h4 className="font-bold text-foreground">CODE 39</h4>
                <p className="text-sm text-muted-foreground">Common in automotive, electronics, and defense industries. It is highly readable even on small industrial parts.</p>
              </article>
              <article>
                <h4 className="font-bold text-foreground">EAN-8</h4>
                <p className="text-sm text-muted-foreground">A shortened version of EAN-13 for small packaging (like candy or pencils) where a full EAN-13 won't fit.</p>
              </article>
              <article>
                <h4 className="font-bold text-foreground">MSI</h4>
                <p className="text-sm text-muted-foreground">Primarily used in retail inventory and warehouse shelf labeling to track stock levels quickly.</p>
              </article>
              <article>
                <h4 className="font-bold text-foreground">Codabar</h4>
                <p className="text-sm text-muted-foreground">A legacy format still used in blood banks, libraries, and older FedEx airbills for sequential tracking.</p>
              </article>
            </div>
          </div>

          <h2 className="mt-12 text-2xl font-semibold tracking-tight text-foreground">Who uses our Barcode Maker?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            From small business owners to enterprise warehouse managers, this tool serves a wide range of professional needs:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-7 text-muted-foreground">
            <li><strong>Retail & E-commerce:</strong> Create labels for Amazon FBA, Etsy shops, and brick-and-mortar storefronts.</li>
            <li><strong>Inventory Management:</strong> Generate codes for warehouse stock control and spreadsheet tracking in Excel or Google Sheets.</li>
            <li><strong>Event Management:</strong> Design custom badges and tickets with scannable entry data.</li>
            <li><strong>Asset Tracking:</strong> Securely label IT equipment, laptops, and office supplies with unique internal identifiers.</li>
            <li><strong>Shipping & Logistics:</strong> Print high-resolution labels for pallet tracking and internal product routing.</li>
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

      <section className="mt-16 border-t border-slate-100 pt-16">
        <Link href="/utility" className="secondary-button px-4 py-2 text-xs">
          View All Utility Tools
        </Link>
      </section>
    </div>
  );
}
