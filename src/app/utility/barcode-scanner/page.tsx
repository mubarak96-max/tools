import Link from "next/link";
import type { Metadata } from "next";

import BarcodeScanner from "@/app/utility/barcode-scanner/components/BarcodeScanner";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/utility/barcode-scanner";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "Do I need to install an app to scan barcodes?",
    answer:
      "No! You can use this web-based scanner directly in your browser. Just grant camera permissions, point your phone or laptop camera at the barcode, and it will decode instantly.",
  },
  {
    question: "What types of barcodes does this support?",
    answer:
      "This scanner leverages advanced web decoding to read all standard 1D barcodes including UPC, EAN-8, EAN-13, CODE-39, and CODE-128 found on almost all retail products worldwide.",
  },
  {
    question: "Can I scan a barcode from an image on my phone?",
    answer:
      "Yes. If you took a photo of a product barcode, you can use the 'Upload Photo' tab above to select the photo from your device. The scanner will process the image and extract the numerical code.",
  },
  {
    question: "What do I do with the scanned barcode numbers?",
    answer:
      "Once decoded, you can copy the number to your clipboard for inventory management, or use the 'Search Product on Google' button to try and identify the product associated with that UPC code.",
  },
  {
    question: "Are my camera feeds or images saved?",
    answer:
      "No. All camera processing and image decoding happens locally within your browser. 100% of the extraction is done client-side, meaning we never see or save your photos.",
  },
];

export const metadata: Metadata = {
  title: "Barcode Scanner Online | UPC & EAN Camera Reader",
  description:
    "Free online barcode scanner. Scan UPC and EAN retail barcodes directly using your phone camera, or upload an image to decode the product numerical value.",
  keywords: [
    "barcode scanner",
    "scan barcode online",
    "UPC scanner",
    "EAN reader",
    "web barcode scanner",
    "free barcode scanner app",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Barcode Scanner Online",
    description:
      "Use your camera or upload an image to decode product barcodes instantly in your browser.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Barcode Scanner Online",
    description:
      "Scan retail barcodes directly from your browser without installing a specialized app.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Barcode Scanner",
    url: PAGE_URL,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires Camera Permissions and JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "A fast client-side 1D barcode decoder. Scans UPC and EAN codes via connected webcam or decodes uploaded image files.",
    featureList: [
      "Live Camera Video feed decoding",
      "Upload image file decoding",
      "Supports UPC and EAN commercial formats",
      "One click Google Product search",
      "100% private client-side processing",
    ],
  };
}

export default function BarcodeScannerPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Utility", path: "/utility" },
    { name: "Barcode Scanner", path: PAGE_PATH },
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
            <li className="text-foreground">Barcode Scanner</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Web Utility
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Barcode Scanner
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Use your phone or webcam to scan retail product barcodes instantly—no app installation required. You can also upload a photo of a barcode to extract the numerical value.
          </p>
        </div>
      </section>

      <BarcodeScanner />

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How does the web scanner work?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Modern web browsers now allow websites to securely request access to your device camera. Once you grant permission, this web page streams the video feed locally. The Javascript engine in your browser constantly analyses the frames waiting for the signature vertical lines of a 1D barcode.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Once found, it instantly extracts the numerical string and stops the camera. Because <strong>the video feed is processed completely inside your device</strong>, the camera stream is never uploaded or sent over the internet.
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
