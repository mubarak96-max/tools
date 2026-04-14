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

export const metadata: Metadata = {
  title: "Free Barcode Scanner Online – Scan UPC & EAN Codes (No App Needed)",
  description:
    "Scan barcodes online free using your camera or by uploading a photo. Reads UPC, EAN-13, EAN-8, CODE-128 and more. Works on iPhone, Android, and laptop — no app needed.",
  keywords: [
    "barcode scanner online free",
    "barcode scanner no app",
    "scan barcode from image",
    "upc barcode scanner online",
    "barcode reader from photo",
    "scan barcode on laptop",
    "ean barcode scanner online",
    "UPC scanner",
    "EAN reader",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Free Barcode Scanner Online – No App Needed",
    description:
      "Use your camera or upload an image to decode product barcodes instantly in your browser.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Barcode Scanner Online",
    description:
      "Scan retail barcodes directly from your browser without installing a specialized app.",
  },
};

const faq = [
  {
    question: "Do I need to install an app to scan barcodes?",
    answer:
      "No! You can use this web-based scanner directly in your browser. Just grant camera permissions, point your phone or laptop camera at the barcode, and it will decode instantly. This is the fastest way to scan a barcode without an app.",
  },
  {
    question: "How do I scan a barcode on my iPhone without an app?",
    answer:
      "Open this page in Safari on your iPhone. Tap 'Scan with Camera', allow camera access, and point your lens at the barcode. Our tool scans UPC and EAN codes instantly directly in the browser.",
  },
  {
    question: "How do I scan a barcode from an image or screenshot?",
    answer:
      "If you have a barcode in a photo or screenshot, select the 'Upload Photo' tab. Choose your file, and our tool will process the image locally and extract the barcode numbers.",
  },
  {
    question: "What types of barcodes does this support?",
    answer:
      "This scanner supports all major retail and industrial 1D formats, including UPC-A, UPC-E, EAN-8, EAN-13, CODE-39, CODE-128, and ITF.",
  },
  {
    question: "What is the difference between UPC and EAN barcodes?",
    answer:
      "UPC (Universal Product Code) is the standard for retail in North America (12 digits), while EAN (European Article Number) is the standard used globally (13 digits). Both store product information, and our scanner reads both types.",
  },
  {
    question: "How do I scan a barcode on my laptop or PC?",
    answer:
      "Simply point your computer's webcam at the barcode while the camera feed is active. Ensure there is adequate lighting so the scanner can clearly see the vertical lines of the code.",
  },
  {
    question: "Why isn't my barcode scanning?",
    answer:
      "Common causes include poor lighting, reflections on glossy surfaces, or the barcode being too small in the frame. Try moving the camera closer or farther away to help it focus, and avoid glaring overhead lights.",
  },
  {
    question: "Can I scan a barcode from a PDF?",
    answer:
      "Yes. Take a screenshot of the barcode within the PDF and upload that image to our tool using the 'Upload Photo' tab to decode it.",
  },
  {
    question: "Is it safe to scan barcodes online?",
    answer:
      "Yes. All processing happens 100% locally in your browser. Your camera feed and images are never sent to a server, ensuring total privacy.",
  },
];

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
      "Free browser-based utility to scan retail barcodes. Use your camera or upload images to decode UPC and EAN product codes instantly.",
    featureList: [
      "Live Camera Video feed decoding",
      "Upload image file (PNG, JPG, WebP) decoding",
      "Supports UPC, EAN, CODE-128, and more",
      "No app download required",
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
            Free Online Barcode Scanner
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            This free online barcode scanner lets you read UPC, EAN, and CODE-128 barcodes directly in your browser — no app download required. Use your phone camera, webcam, or upload a photo of a barcode to instantly extract the product code. Need to scan 2D codes? Try our <Link href="/utility/qr-code-scanner" className="text-primary hover:underline font-medium">QR Code Scanner</Link>.
          </p>
        </div>
      </section>

      <BarcodeScanner />

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How does the web scanner work?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Many users are frustrated by having to download ad-heavy apps to scan simple barcodes. This tool provides a **barcode scanner no app** experience that works directly in Safari, Chrome, and desktop browsers.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Once you grant camera permissions, the page streams your video feed locally. The Javascript engine in your browser constantly analyses the frames waiting for the signature vertical lines of a 1D barcode. Once found, it instantly extracts the numerical string and stops the camera. Because <strong>the video feed is processed completely inside your device</strong>, the camera stream is never uploaded or sent over the internet.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Supported Barcode Formats</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Our online scanner is designed to read the most common global standards found on retail products, books, and logistics labels:
          </p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-muted/30 p-5 rounded-2xl border border-border/50">
              <h4 className="font-bold text-foreground mb-2">Retail Formats</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>UPC-A / UPC-E:</strong> 12-digit North American standard.</li>
                <li>• <strong>EAN-8 / EAN-13:</strong> 8 or 13-digit global retail standard.</li>
              </ul>
            </div>
            <div className="bg-muted/30 p-5 rounded-2xl border border-border/50">
              <h4 className="font-bold text-foreground mb-2">Industrial & Logistics</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>CODE-128:</strong> High-density shipping label standard.</li>
                <li>• <strong>CODE-39:</strong> General purpose industrial data code.</li>
                <li>• <strong>ITF:</strong> Shipping and warehouse numbering.</li>
              </ul>
            </div>
          </div>
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
