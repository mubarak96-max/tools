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

export const metadata: Metadata = {
  title: "Free QR Code Generator - Static, No Expiry, Instant Download",
  description:
    "Create static QR codes for URLs, Wi-Fi, WhatsApp, business cards, and more. No expiry, no scan limits, instant PNG download, and no sign-up required.",
  keywords: [
    "QR code generator",
    "free QR code maker",
    "create QR code online",
    "QR code without expiry",
    "custom QR code generator",
    "QR code for website",
    "generate qr code for wifi",
    "qr code for business cards",
    "high quality qr code png",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Free QR Code Generator – Unlimited Scans, No Expiry",
    description:
      "Generate custom QR codes that never expire. Instantly download high-quality PNGs with zero limits.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free QR Code Generator Online",
    description:
      "Generate custom QR codes instantly in your browser with zero scan limits or expiry dates.",
  },
};

const faq = [
  {
    question: "Is this QR code generator completely free?",
    answer:
      "Yes, it is 100% free with no hidden costs. We do not place logos inside the QR codes, there are no scan limits, and you don't even need to sign up to download your image.",
  },
  {
    question: "Do these QR codes ever expire?",
    answer:
      "No. These are 'Static' QR codes, meaning the data (like your website URL) is embedded directly into the pattern. As long as your destination website is active, the QR code will work forever without any expiration date.",
  },
  {
    question: "What is the maximum data a QR code can hold?",
    answer:
      "A QR code can hold up to 4,296 alphanumeric characters in ideal conditions, but dense codes can be harder to scan in print. For reliability, keep content concise and use short URLs when possible.",
  },
  {
    question: "Can I use these QR codes for commercial projects?",
    answer:
      "Absolutely! The QR codes you generate here are yours to use for any commercial or personal project, including flyers, business cards, restaurant menus, product packaging, and TV advertisements.",
  },
  {
    question: "What size should my QR code be for printing?",
    answer:
      "For close-range scanning, use at least 2 cm x 2 cm. A practical rule is around a 10:1 scan-distance-to-code-size ratio, and always keep a clear quiet zone around the code.",
  },
  {
    question: "What is QR Code Error Correction?",
    answer:
      "Error correction allows a QR code to remain scannable even if part of it is damaged or obscured. Level 'L' allows for 7% damage, while Level 'H' allows up to 30%. High error correction is recommended for codes that will be printed on physical surfaces.",
  },
  {
    question: "Can I create a QR code for a phone number or email?",
    answer:
      "Yes. Use URI formats like tel:+123456789 and mailto:hello@example.com so scanners can open the dialer or email app directly.",
  },
  {
    question: "Can I put a logo in my QR code?",
    answer:
      "This generator does not embed logos. Logos can reduce scan reliability if they cover too much of the pattern. If you must add one, keep it small, centered, and use high error correction.",
  },
  {
    question: "How do I create a QR code for a Wi-Fi network?",
    answer:
      "To create a Wi-Fi QR code, choose the Wi-Fi option (if available) or format your text as: WIFI:S:MyNetworkName;T:WPA;P:MyPassword;; then generate the code. Scanning it will allow users to join automatically.",
  },
  {
    question: "What's the difference between a QR code and a barcode?",
    answer:
      "A barcode is usually one-dimensional and stores less data. A QR code is two-dimensional, stores more information, and is designed for fast smartphone scanning.",
  },
  {
    question: "Can I change the colors of my QR code?",
    answer:
      "Yes, our generator allows you to customize both the foreground (dots) and background colors. Ensure you maintain high contrast between the dots and the background for the best scanning results.",
  },
  {
    question: "How do I test if my QR code works?",
    answer:
      "You can verify your generated code using our built-in Online QR Code Scanner. Upload your downloaded PNG to confirm it decodes correctly before printing.",
  },
  {
    question: "Can I download SVG instead of PNG?",
    answer:
      "This version exports PNG. If you need vector output, place the PNG in a design tool and rebuild the final print layout at the exact target dimensions.",
  },
];

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
      "Static QR code generation",
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
            Create high-quality static QR codes that never expire. Customize colors, adjust error correction, and download a high-resolution PNG instantly. No sign-up, no logos, and no limits. Already have a code? Use our <Link href="/utility/qr-code-scanner" className="text-primary hover:underline font-medium">Online QR Code Scanner</Link>.
          </p>
        </div>
      </section>

      <QRCodeGenerator />

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Static vs. Dynamic QR Codes: What's the Difference?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Many websites try to trick you into creating "Dynamic" QR codes, only to charge you a massive monthly subscription fee just to keep your code scannable. Our generator is different.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Our tool generates completely <strong>Static QR Codes</strong>. The text or URL you enter is directly hardcoded into the graphic pattern itself. The processing happens instantly right inside your internet browser, ensuring maximum privacy and guaranteeing that the barcode will work forever without relying on our servers. This makes it perfect for print media where longevity is critical.
          </p>
        </div>
      </section>

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">QR code generator use cases</h2>
          <h3 className="mt-6 text-xl font-semibold tracking-tight text-foreground">Website URLs and landing pages</h3>
          <p className="mt-2 text-base leading-7 text-muted-foreground">
            The most common use is sharing a website URL. Keep links short and test the final code after styling. For print campaigns, add a clear call to action near the code, like "Scan to visit".
          </p>

          <h3 className="mt-6 text-xl font-semibold tracking-tight text-foreground">Business cards and vCard sharing</h3>
          <p className="mt-2 text-base leading-7 text-muted-foreground">
            You can point to a digital profile or vCard URL so contacts can save your details quickly. This is especially useful for sales teams, freelancers, and event networking materials.
          </p>

          <h3 className="mt-6 text-xl font-semibold tracking-tight text-foreground">Restaurant menus</h3>
          <p className="mt-2 text-base leading-7 text-muted-foreground">
            Most restaurants place a QR code to a hosted PDF or menu page. Use a stable URL and keep the code at printable size so customers can scan from table distance without zooming.
          </p>

          <h3 className="mt-6 text-xl font-semibold tracking-tight text-foreground">WhatsApp click-to-chat</h3>
          <p className="mt-2 text-base leading-7 text-muted-foreground">
            For WhatsApp, use the format <code>https://wa.me/number</code> (with country code, no plus or spaces). This is popular for support desks, small businesses, and service booking flows.
          </p>

          <h3 className="mt-6 text-xl font-semibold tracking-tight text-foreground">Wi-Fi network access</h3>
          <p className="mt-2 text-base leading-7 text-muted-foreground">
            Wi-Fi QR codes help guests connect without typing long passwords. Format credentials correctly and test across iOS and Android before printing on reception desks or wall signs.
          </p>

          <h3 className="mt-6 text-xl font-semibold tracking-tight text-foreground">Social profiles, phone, and email</h3>
          <p className="mt-2 text-base leading-7 text-muted-foreground">
            QR codes can open Instagram, LinkedIn, phone calls, or prefilled emails. Use URL links for profiles, <code>tel:</code> for calls, and <code>mailto:</code> for email actions.
          </p>
        </div>
      </section>

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">QR code best practices</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Test every code on multiple phones before publishing or printing.</li>
            <li>Use dark foreground on a light background for best scanner compatibility.</li>
            <li>Keep the quiet zone enabled so scanners can detect boundaries correctly.</li>
            <li>For print, start from at least 2 cm x 2 cm and scale based on viewing distance.</li>
            <li>For physical surfaces, prefer higher error correction (Q or H).</li>
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
