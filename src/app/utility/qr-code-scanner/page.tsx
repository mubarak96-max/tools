import Link from "next/link";
import type { Metadata } from "next";

import QRCodeScanner from "@/app/utility/qr-code-scanner/components/QRCodeScanner";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/utility/qr-code-scanner";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "Do I need to install an app to scan QR codes?",
    answer:
      "No! You can use this web-based scanner directly in your browser. Just grant camera permissions, point your phone or laptop camera at the QR code, and it will decode instantly.",
  },
  {
    question: "Can I scan a barcode from an image on my phone?",
    answer:
      "Yes. If someone sent you a screenshot or image of a QR code, you can use the 'Upload Image' tab above to select the photo from your device. The scanner will read it from the file.",
  },
  {
    question: "Is it safe to scan unknown QR codes?",
    answer:
      "Scanning a QR code simply reveals the text or website hidden inside the image pattern. However, you should always verify the URL before clicking 'Open Website' to ensure it does not go to a malicious or phishing site.",
  },
  {
    question: "Are my camera feeds or images saved?",
    answer:
      "No. All camera processing and image decoding happens locally within your browser. 100% of the extraction is done client-side, meaning we never see or save your photos.",
  },
];

export const metadata: Metadata = {
  title: "QR Code Scanner Online | Free Camera & Image Reader",
  description:
    "Free online QR code scanner. Scan QR codes directly using your phone or webcam, or upload an image to decode web links and text instantly without an app.",
  keywords: [
    "QR code scanner",
    "scan QR code online",
    "QR reader",
    "read QR from image",
    "web QR scanner",
    "free QR scanner",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "QR Code Scanner Online",
    description:
      "Use your camera or upload an image to decode QR Codes completely free in your browser.",
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Code Scanner Online",
    description:
      "Scan QR codes directly from your browser without installing a specialized app.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "QR Code Scanner",
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
      "A fast client-side QR code decoder. Scans via connected webcam/mobile camera or decodes dragged-and-dropped image files.",
    featureList: [
      "Live Camera Video feed decoding",
      "Upload image file decoding",
      "Instant copy to clipboard",
      "100% private client-side processing",
    ],
  };
}

export default function QRCodeScannerPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Utility", path: "/utility" },
    { name: "QR Code Scanner", path: PAGE_PATH },
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
            <li className="text-foreground">QR Code Scanner</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Web Utility
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            QR Code Scanner
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Use your phone or webcam to scan QR codes instantly—no app installation required. You can also upload a photo or screenshot of a QR code to decode the link.
          </p>
        </div>
      </section>

      <QRCodeScanner />

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How does the web scanner work?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Many people believe they need to download a sketchy third-party app to scan QR codes on their phone, which often leads to annoying ads and privacy issues.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Modern web browsers now allow websites to securely request access to your device camera. Once you grant permission, this web page streams the video feed locally. The Javascript engine in your browser constantly analyses the frames looking for the three distinct squares of a QR Code. Once found, it instantly extracts the embedded string and stops the camera. Because <strong>the video feed is processed completely inside your device</strong>, the camera stream is never uploaded or sent over the internet.
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
