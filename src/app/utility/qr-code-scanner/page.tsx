import Link from "next/link";
import type { Metadata } from "next";

import QRCodeScanner from "@/app/utility/qr-code-scanner/components/QRCodeScanner";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/utility/qr-code-scanner";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Free QR Code Scanner Online – Scan from Camera or Image (No App Needed)",
  description:
    "Scan QR codes online for free using your camera or by uploading an image. Works on iPhone, Android, and desktop. No app, no sign-up, 100% private.",
  keywords: [
    "QR code scanner",
    "scan QR code online",
    "QR reader",
    "read QR from image",
    "web QR scanner",
    "free QR scanner",
    "scan qr code from screenshot",
    "qr code scanner no app",
    "scan qr code on laptop",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Free QR Code Scanner Online – No App Needed",
    description:
      "Scan QR codes from your camera or an image file instantly and privately in your browser.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free QR Code Scanner Online",
    description:
      "Scan QR codes directly from your browser without installing a specialized app.",
  },
};

const faq = [
  {
    question: "Do I need to install an app to scan QR codes?",
    answer:
      "No! You can use this web-based scanner directly in your browser. Just grant camera permissions, point your phone or laptop camera at the QR code, and it will decode instantly. This is the best way to scan a QR code without an app.",
  },
  {
    question: "How do I scan a QR code on my iPhone or Android without an app?",
    answer:
      "Simply open this page in Safari (iPhone) or Chrome (Android). Tap 'Scan with Camera', allow camera access when prompted, and point your lens at the code. Most modern smartphones have built-in readers, but this tool provides a secure alternative that works in any mobile browser.",
  },
  {
    question: "Can I scan a QR code from an image or screenshot?",
    answer:
      "Yes. If you have a QR code in a screenshot or saved photo, select the 'Upload Image' tab above. Choose your file, and the scanner will decode the string from the picture locally on your device.",
  },
  {
    question: "What types of QR codes can this scanner read?",
    answer:
      "This scanner supports all standard QR code content, including website URLs, Wi-Fi network credentials (SSID and Password), contact cards (vCard / MeCard), plain text, email addresses, SMS messages, and phone numbers.",
  },
  {
    question: "Why isn't my QR code scanning?",
    answer:
      "Common issues include poor lighting, camera focus, or low resolution. To troubleshoot, ensure the QR code is well-lit, not obscured by glare, and held steady. If you are scanning from an image, make sure the QR code is clearly visible and not cut off.",
  },
  {
    question: "Can I scan a QR code from a PDF file?",
    answer:
      "To scan from a PDF, take a screenshot of the QR code within the document and upload that image to our 'Upload Image' tab. Our tool currently decodes image formats (PNG, JPG, WebP) directly.",
  },
  {
    question: "Is it safe to scan unknown QR codes?",
    answer:
      "Scanning reveals the hidden content. You should always verify the URL before clicking 'Open Website'. Our scanner is 100% private and does all decoding client-side, so your camera feed never leaves your device.",
  },
];

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
      "A fast client-side QR code decoder. Scans via connected webcam/mobile camera or decodes dragged-and-dropped image files. Free, no app needed, and works on all devices.",
    featureList: [
      "Live Camera Video feed decoding",
      "Upload image file (PNG, JPG, WebP) decoding",
      "Decode QR codes from screenshots",
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
            Free Online QR Code Scanner
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Use your phone or webcam to scan QR codes instantly—no app installation required. You can also upload a photo or screenshot of a QR code to decode URLs, text, and Wi-Fi credentials. Need to create one? Use our <Link href="/utility/qr-code-generator" className="text-primary hover:underline font-medium">QR Code Generator</Link>.
          </p>
        </div>
      </section>

      <QRCodeScanner />

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How does the web scanner work?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Many people believe they need to download a sketchy third-party app to scan QR codes on their phone, which often leads to annoying ads and privacy issues. This tool provides a **safe QR code scanner online** that works directly in Safari, Chrome, and Firefox.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Modern web browsers now allow websites to securely request access to your device camera. Once you grant permission, this web page streams the video feed locally. The Javascript engine in your browser constantly analyses the frames looking for the three distinct squares of a QR Code. Once found, it instantly extracts the embedded string and stops the camera. Because <strong>the video feed is processed completely inside your device</strong>, the camera stream is never uploaded or sent over the internet.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">What types of information can a QR Code contain?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            QR codes (Quick Response codes) are incredibly versatile data containers. While most common for sharing website URLs, they can also encode:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-7 text-muted-foreground">
            <li><strong>Wi-Fi Credentials:</strong> Instantly join a network without typing a password.</li>
            <li><strong>vCard / Contact Info:</strong> Add a new contact to your phone in one scan.</li>
            <li><strong>Plain Text:</strong> Share notes, codes, or instructions.</li>
            <li><strong>App Store Links:</strong> Direct users to specific apps on iOS or Android.</li>
            <li><strong>Email & SMS:</strong> Pre-fill a message to a specific recipient.</li>
            <li><strong>Payment Links:</strong> Direct access to PayPal, Venmo, or crypto addresses.</li>
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
