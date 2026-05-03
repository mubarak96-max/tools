import Link from "next/link";
import type { Metadata } from "next";

import QRCodeGenerator from "@/app/utility/create-qr-code-online/components/QRCodeGenerator";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/utility/create-qr-code-online";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Create QR Code Online – Unlimited Scans, No Sign-Up, No Expiry",
  description:
    "Create high-quality static QR codes instantly with our free online QR code generator. No account needed, no scan limits, and codes never expire. Download high-res PNGs for web or print.",
  keywords: [
    "QR code generator",
    "free QR code maker",
    "create QR code online",
    "QR code without expiry",
    "custom QR code generator",
    "make qr online",
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
    title: "Create QR Code Online – Unlimited Scans, No Sign-Up, No Expiry",
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
    question: "Is this QR code generator really free?",
    answer:
      "Yes, entirely. There are no paid tiers, no scan limits, no subscription, and no hidden fees. Every feature available on this page is free to use as many times as you want.",
  },
  {
    question: "Do the QR codes expire?",
    answer:
      "No. Static QR codes have no expiry date. The data is embedded in the pattern permanently. The code will continue to work for as long as your destination URL is active.",
  },
  {
    question: "Can I use these QR codes commercially?",
    answer:
      "Absolutely. Codes generated here are yours to use for any purpose — business cards, product packaging, restaurant menus, advertising, events, and more.",
  },
  {
    question: "What is the maximum content a QR code can store?",
    answer:
      "Up to 4,296 alphanumeric characters in ideal conditions. In practice, longer content makes the pattern denser and harder to scan reliably. For URLs, use a short link if your destination URL is very long.",
  },
  {
    question: "What size should I use for print?",
    answer:
      "A minimum of 2 cm × 2 cm for close-range scanning. For standard marketing print (A5 flyers, business cards), 3–4 cm works well. Scale up for anything meant to be scanned from further away.",
  },
  {
    question: "Can I make a QR code for a phone number or email address?",
    answer:
      "Yes. Use tel:+[countrycode][number] for phone calls and mailto:[address] for email. Scanning will open the dialer or email client directly.",
  },
  {
    question: "Can I add a logo to my QR code?",
    answer:
      "This generator does not embed logos. Adding a logo reduces the scanned area and can cause failures if it covers too much of the pattern. If you need a logo, add it in a design tool afterward and use High error correction to maximize resilience.",
  },
  {
    question: "Can I download an SVG?",
    answer:
      "This tool currently exports PNG. For vector output, import the high-resolution PNG into a design tool and rebuild the layout at your target print dimensions.",
  },
  {
    question: "What is error correction?",
    answer:
      "Error correction is a built-in redundancy that allows a QR code to remain scannable even if part of it is damaged or obscured. Level L allows 7% damage tolerance; Level H allows up to 30%. Use High for codes on physical surfaces.",
  },
  {
    question: "How is this different from dynamic QR code generators?",
    answer:
      "Dynamic generators encode a redirect URL and charge a monthly fee to keep the redirect live. If you stop paying, your codes stop working. Our tool generates static codes that work permanently without any ongoing cost or dependency.",
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

        <div className="max-w-4xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Web Utility
          </p>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Create QR Code Online – Free, No Expiry, No Sign-Up, Instant Download
          </h1>
          <p className="mt-6 text-base leading-7 text-muted-foreground sm:text-lg">
            Create a QR code in seconds with our free online QR code generator. No account needed, no watermarks, no limits — just paste your URL or text and download a high-resolution PNG instantly.
          </p>
        </div>
      </section>

      <QRCodeGenerator />

      <div className="mt-16 space-y-16 border-t border-border/60 pt-16 [&_p]:mb-10 [&_h2]:mt-20 [&_h2]:mb-10 [&_h3]:mt-16 [&_h3]:mb-8 [&_ul]:mb-10 [&_li]:mb-4 prose prose-slate max-w-none dark:prose-invert">
        <section>
          <h2 id="what-is-qr-code">What Is a QR Code?</h2>
          <p>A QR code (short for Quick Response code) is a two-dimensional barcode that smartphones can scan to instantly open a URL, display text, dial a phone number, connect to Wi-Fi, or trigger dozens of other actions. Unlike the traditional one-dimensional barcode you see on product packaging, a QR code square stores data both horizontally and vertically — which means it can hold hundreds of times more information in the same physical space.</p>
          <p>Since every modern smartphone camera can read them natively, QR codes have become one of the most frictionless bridges between the physical and digital world. Businesses use them on business cards, restaurant menus, product labels, event banners, and TV ads. Marketers use them to track campaigns. Individuals use them to share Wi-Fi passwords, contact details, and social profiles without typing a single character.</p>
        </section>

        <hr className="border-border/60" />

        <section>
          <h2 id="why-use-our-generator">Why Use Our Free QR Code Generator?</h2>
          <p>There are dozens of tools that let you create QR code online, but most come with a catch — a subscription fee, a scan limit, a logo you can&apos;t remove, or codes that stop working the moment you cancel your plan. Our generator works differently.</p>
          <p><strong>No sign-up required.</strong> Open the tool, type or paste your content, and generate. There is no account wall between you and your QR code.</p>
          <p><strong>Completely free, forever.</strong> This is not a freemium tool with a hidden upgrade. Every feature — color customization, error correction control, high-resolution download — is free.</p>
          <p><strong>Static codes that never expire.</strong> When you make a QR code online with our tool, the data is embedded directly into the pattern itself. There is no middleman server that your code redirects through. As long as your destination URL is live, your QR code works — permanently.</p>
          <p><strong>Privacy-first, browser-native processing.</strong> The entire generation process happens inside your browser. Your URL or text is never sent to our servers, making this the most private free online QR barcode generator available.</p>
          <p><strong>High-resolution PNG download.</strong> The downloaded file is large enough for professional print use — no pixelation on flyers, posters, or business cards.</p>
        </section>

        <hr className="border-border/60" />

        <section>
          <h2 id="how-to-create">How to Create a QR Code Online — Step by Step</h2>
          <p>Making a custom QR code with our tool takes under 30 seconds:</p>
          <ol className="list-decimal pl-5 space-y-4">
            <li><strong>Enter your content.</strong> Paste a URL, type plain text, enter a phone number with <code>tel:</code> prefix, or use <code>mailto:</code> for email. The live preview updates as you type.</li>
            <li><strong>Choose your colors.</strong> Pick a foreground (dot) color and a background color. For best scan reliability, keep strong contrast between the two — dark dots on a light background is the classic combination.</li>
            <li><strong>Set error correction level.</strong> Choose from Low (7%), Medium (15%), Quartile (25%), or High (30%). For codes that will be printed on physical surfaces or may get partially covered, High is recommended.</li>
            <li><strong>Keep the quiet zone enabled.</strong> The white margin around the QR code square helps scanners detect where the code begins and ends. Disabling it can cause scan failures.</li>
            <li><strong>Download your PNG.</strong> Click the download button to save a high-resolution image ready for web or print use.</li>
          </ol>
          <p className="mt-8">That is all it takes to make QR online — no tutorials, no forms, no waiting.</p>
        </section>

        <hr className="border-border/60" />

        <section>
          <h2 id="static-vs-dynamic">Static vs. Dynamic QR Codes — Which Do You Actually Need?</h2>
          <p>If you have searched for a QR code generator, you have almost certainly seen ads or landing pages pushing &quot;dynamic QR codes&quot; heavily. It is worth understanding what that distinction actually means before you decide.</p>

          <h3 className="text-xl font-bold">Static QR Codes</h3>
          <p>A static QR code has its destination permanently encoded in the pattern. Change the URL and you need a new code. The advantages are significant: the code works forever with no dependencies, it requires no account or subscription to remain functional, it is faster to scan because there is no redirect, and it is more private because no third party logs your scan data.</p>
          <p>Our tool generates static QR codes exclusively, and for the vast majority of use cases — business cards, product packaging, one-off print campaigns, personal use — a static code is exactly what you need.</p>

          <h3 className="text-xl font-bold mt-10">Dynamic QR Codes</h3>
          <p>A dynamic QR code encodes a short redirect URL. Scanning it hits a server that redirects to your actual destination. The benefit is that you can update the destination without reprinting the code. The drawback is that the code only works as long as you continue paying for the service that runs the redirect. Many businesses have been caught out by this: they printed thousands of flyers with dynamic codes, stopped paying the subscription, and their codes went dead overnight.</p>
          <p>Unless you have a genuine, ongoing need to update a destination on already-printed materials — and you are prepared to maintain that subscription indefinitely — a static QR code is the smarter and cheaper choice.</p>
        </section>

        <hr className="border-border/60" />

        <section>
          <h2 id="color-options">Make a Custom QR Code — Color and Style Options</h2>
          <p>Our tool gives you full control over the appearance of your code. You can make custom QR code designs that match your brand colors, complement your marketing materials, or simply look more polished than a plain black-and-white square.</p>

          <h3 className="text-xl font-bold">Foreground Color</h3>
          <p>This controls the color of the dots that make up the QR code pattern. Navy, forest green, deep burgundy, or any brand hex color works well. Avoid light colors for the foreground — pale dots on a white background will not scan reliably.</p>

          <h3 className="text-xl font-bold mt-10">Background Color</h3>
          <p>The background is typically white, but you can set it to match a card, label, or poster background. If the background is already a color, set the QR code background to match and let the foreground dots contrast.</p>

          <h3 className="text-xl font-bold mt-10">Contrast Is Non-Negotiable</h3>
          <p>No matter how stylish you want your QR code to look, the fundamental rule of scanner compatibility is contrast. A beautiful QR code generator that produces codes nobody can scan is useless. Always test your colored code on multiple devices — iPhone, Android, and a dedicated scanner app — before committing it to print.</p>

          <h3 className="text-xl font-bold mt-10">Making a Pretty or Stylish QR Code</h3>
          <p>The simplest way to make a pretty QR code or stylish QR code is to use colors that are consistent with your brand identity while preserving strong contrast. A deep teal on cream, dark charcoal on a pale gold, or navy on white all scan reliably while looking far more considered than a default black-and-white square.</p>
          <p>For a truly beautiful QR code that incorporates a logo or intricate design, you would need a dedicated graphic design tool. Our generator focuses on functional, clean, scannable output — but the PNG it produces can be imported into any design software for further treatment.</p>
        </section>

        <hr className="border-border/60" />

        <section>
          <h2 id="use-cases">QR Code Use Cases</h2>

          <h3 className="text-xl font-bold">Create a Link QR Code for Any Website</h3>
          <p>The most common use case is to create a link QR code that points to a website. Paste your full URL — including <code>https://</code> — and the tool generates a code that opens that page on any smartphone camera scan. This works for homepages, landing pages, product pages, booking pages, portfolio sites, and any publicly accessible URL.</p>
          <p>For marketing campaigns, build your destination URL with UTM parameters first so you can track visits in Google Analytics, then generate the QR code from that tagged URL. This way you get campaign attribution without needing dynamic QR codes at all.</p>

          <h3 className="text-xl font-bold mt-10">Business Cards</h3>
          <p>A QR code on a business card lets contacts save your details, open your LinkedIn profile, or visit your portfolio with one scan. Keep the destination stable — a personal domain that forwards to wherever you want is better than a direct social link that may change.</p>

          <h3 className="text-xl font-bold mt-10">Restaurant Menus</h3>
          <p>Point to a hosted PDF or a mobile-optimized menu page. Use a stable URL, size the printed code large enough for table-distance scanning (at least 3 cm × 3 cm), and test it from multiple angles and in varied lighting before going to print.</p>

          <h3 className="text-xl font-bold mt-10">Wi-Fi Access</h3>
          <p>Format your Wi-Fi credentials as <code>WIFI:S:NetworkName;T:WPA;P:Password;;</code> and generate the code. Guests can scan to connect automatically without ever seeing or typing the password. Test on both iOS and Android before printing on wall signs or reception desks.</p>

          <h3 className="text-xl font-bold mt-10">WhatsApp Click-to-Chat</h3>
          <p>Use <code>https://wa.me/[countrycode][number]</code> (no plus sign, no spaces) as your URL. Scanning opens WhatsApp with a pre-populated chat to that number — popular for customer service, appointment booking, and small business enquiries.</p>

          <h3 className="text-xl font-bold mt-10">Social Media Profiles</h3>
          <p>Direct people to your Instagram, LinkedIn, TikTok, or YouTube channel by encoding the profile URL. Add the QR code square to packaging, receipts, or event materials to grow your following from offline touchpoints.</p>

          <h3 className="text-xl font-bold mt-10">Email and Phone Actions</h3>
          <p>Use <code>mailto:hello@findbest.tools</code> to open the email app with your address pre-filled. Use <code>tel:+971501234567</code> to open the dialer. These are especially useful on printed materials like brochures or packaging where a tap or scan is easier than typing.</p>
        </section>

        <hr className="border-border/60" />

        <section>
          <h2 id="best-practices">QR Code Best Practices for Print and Digital</h2>
          <p>Getting a QR code generated is the easy part. Getting it to scan reliably in the real world requires a few additional considerations.</p>
          <ul className="list-disc pl-5 space-y-4">
            <li><strong>Test on multiple devices before publishing.</strong> A code that scans fine on your iPhone may fail on an older Android. Test on at least two different phones before committing anything to print.</li>
            <li><strong>Size for scanning distance.</strong> A practical rule is a 10:1 ratio — a code meant to be scanned from 30 cm away should be at least 3 cm × 3 cm. Codes on outdoor signage or billboards need to be proportionally larger.</li>
            <li><strong>Maintain the quiet zone.</strong> The blank margin around the QR code square is part of the standard. Cropping it or overlapping it with design elements is a common reason codes fail to scan.</li>
            <li><strong>Use high error correction for physical surfaces.</strong> Physical codes get scratched, stained, and partially obscured. Setting error correction to High (30%) means up to 30% of the pattern can be damaged and the code will still scan correctly.</li>
            <li><strong>Dark on light, always.</strong> Inverted codes — light dots on a dark background — can fail on many scanners. If your design requires this, test exhaustively before printing.</li>
            <li><strong>Keep URLs short.</strong> Longer content means a denser, more complex pattern. A short URL or a redirected short link produces a simpler, more reliable code.</li>
            <li><strong>Verify before you distribute.</strong> Use a QR code scanner — we have one at the link above — to confirm your downloaded PNG decodes correctly before it goes anywhere.</li>
          </ul>
        </section>

        <hr className="border-border/60" />

        <section>
          <h2 id="faq">Frequently asked questions</h2>
          <div className="mt-10 space-y-8">
            {faq.map((item) => (
              <article key={item.question}>
                <h3 className="text-lg font-semibold text-foreground m-0">{item.question}</h3>
                <p className="mt-3 text-base leading-6 text-muted-foreground">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <hr className="border-border/60" />

        <section>
          <h2 id="related-tools">Related Tools</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <Link
              href="/utility/qr-code-scanner"
              className="flex flex-col gap-2 p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <h4 className="font-semibold text-foreground m-0">Online QR Code Scanner</h4>
              <p className="text-sm text-muted-foreground m-0 leading-relaxed">Verify any QR code by uploading a PNG or scanning live with your camera.</p>
            </Link>
            <Link
              href="/utility/utm-builder"
              className="flex flex-col gap-2 p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <h4 className="font-semibold text-foreground m-0">UTM Builder</h4>
              <p className="text-sm text-muted-foreground m-0 leading-relaxed">Build fully tagged campaign URLs before turning them into QR codes for accurate GA4 attribution.</p>
            </Link>
          </div>
        </section>

        <section className="pt-10 border-t border-border/40">
          <p className="italic text-sm text-muted-foreground">All QR code generation happens locally in your browser. No data is sent to our servers. Your URLs and text remain completely private.</p>
        </section>
      </div>

      <section className="mt-16 border-t border-slate-100 pt-16">
        <Link href="/utility" className="secondary-button px-4 py-2 text-xs">
          View All Utility Tools
        </Link>
      </section>
    </div>
  );
}
