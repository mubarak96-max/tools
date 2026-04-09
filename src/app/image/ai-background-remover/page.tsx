import Link from "next/link";
import type { Metadata } from "next";

import AIBackgroundRemover from "@/app/image/ai-background-remover/components/AIBackgroundRemover";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/image/ai-background-remover";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "Is this tool fully free to use?",
    answer:
      "Yes, absolutely. Most background removers charge tokens or monthly fees to use their APIs. Our tool uses cutting edge WebAssembly to run the AI model directly inside your browser. Because it uses your device's power, there are zero server costs for us, making it 100% free for you.",
  },
  {
    question: "Is my private image uploaded to a server?",
    answer:
      "No. This is one of the safest background removers on the internet. Because the AI model runs locally on your device via WebAssembly, your image never leaves your browser and is never uploaded or saved to any external servers.",
  },
  {
    question: "Why does it take a few seconds on the first try?",
    answer:
      "The first time you use the tool, your browser needs to download the AI WebAssembly model file. Once downloaded, it is cached in your browser so subsequent image edits will be almost instantaneous.",
  },
  {
    question: "What types of images work best?",
    answer:
      "The AI is specifically trained to recognize foreground subjects. It works best on portraits of people, pets, cars, and distinct products. Complex intersecting backgrounds may take slightly longer or leave small artifacts.",
  },
];

export const metadata: Metadata = {
  title: "Free AI Background Remover | 100% Private & Local",
  description:
    "Remove backgrounds from photos instantly and 100% free. Uses local in-browser AI meaning your photos are never uploaded to a server. Download transparent PNGs.",
  keywords: [
    "AI background remover",
    "free background remover",
    "remove photo background",
    "transparent PNG maker",
    "cut out background",
    "local AI background removal",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Free AI Background Remover",
    description:
      "Remove image backgrounds instantly in your browser with zero server uploads.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Background Remover",
    description:
      "Remove backgrounds instantly with local WebAssembly AI. 100% free and private.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "AI Background Remover",
    url: PAGE_URL,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All",
    browserRequirements: "Requires WebAssembly and JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Free browser-based AI tool that perfectly cuts out the foreground subject of an image and removes the background without server-side processing.",
    featureList: [
      "100% client-side privacy",
      "WebAssembly accelerated AI",
      "One click instant removal",
      "Transparent PNG download",
    ],
  };
}

export default function AIBackgroundRemoverPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Image Tools", path: "/image" },
    { name: "AI Background Remover", path: PAGE_PATH },
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
            <li><Link href="/image" className="hover:text-primary">Image</Link></li>
            <li>/</li>
            <li className="text-foreground">AI Background Remover</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Premium Image AI
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            AI Background Remover
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Instantly erase the background of any photo leaving a perfect transparent cutout. <strong>100% free and private</strong> — processing happens entirely within your own internet browser using WebAssembly.
          </p>
        </div>
      </section>

      <AIBackgroundRemover />

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How this tool protects your privacy</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Almost all other "AI Photo Tools" on the internet operate by forcing you to upload your personal photos to a remote cloud server. This means they are sending your private media to a third-party, consuming expensive server costs, and in many cases saving your photo to train future models.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            We do things differently. This tool downloads a small, compressed WebAssembly AI model directly into your browser's local memory exactly one time. When you select a photo, your computer or phone's own processor analyses the image and cuts out the background. <strong>Your photo never leaves your physical device.</strong>
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

      <RelatedToolsSection category="Image" categoryHref="/image" currentPath={PAGE_PATH} />
    </div>
  );
}
