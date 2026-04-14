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
    question: "How do I remove the background from an image?",
    answer:
      "Upload or drag in a PNG, JPG, or WEBP image, wait for the AI model to detect the subject, then download the result as a transparent PNG or a JPG with a replacement background.",
  },
  {
    question: "Is my private image uploaded to a server?",
    answer:
      "No. The background removal model runs locally in your browser with WebAssembly. Your image is processed on your device and is not uploaded, stored, or shared by this tool.",
  },
  {
    question: "Is AI background removal accurate?",
    answer:
      "It is usually accurate when the subject is clear and separated from the background. Hair, fur, shadows, transparent objects, and busy backgrounds can still need manual review.",
  },
  {
    question: "What image formats are supported?",
    answer:
      "You can upload PNG, JPG, and WEBP images. You can export a transparent PNG or a JPG with a white or custom color background.",
  },
  {
    question: "Can I replace the background after removing it?",
    answer:
      "Yes. After removal, choose transparent, white, or a custom color background. You can also add a soft shadow before exporting the final asset.",
  },
  {
    question: "Why does the first run take longer?",
    answer:
      "The browser needs to load the AI model the first time. Once cached, later edits on the same device are usually faster.",
  },
];

export const metadata: Metadata = {
  title: "AI Background Remover | Remove Background from Image Free",
  description:
    "Remove background from images online with a free AI background remover. Make transparent PNGs, replace backgrounds, batch process images, and export PNG or JPG.",
  keywords: [
    "AI background remover",
    "free background remover",
    "remove background from image",
    "background remover online",
    "remove bg free",
    "remove photo background",
    "make background transparent",
    "transparent PNG maker",
    "PNG background remover",
    "JPG background remover",
    "cut out background",
    "local AI background removal",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "AI Background Remover Online",
    description:
      "Remove, replace, and export image backgrounds with local browser AI, before-after preview, and PNG/JPG output.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Background Remover",
    description:
      "Make transparent PNGs, replace backgrounds, and prepare images for e-commerce, social posts, and ads.",
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
      "Free browser-based AI background remover that detects subjects, removes backgrounds, supports before-after preview, background replacement, batch processing, and PNG or JPG export.",
    featureList: [
      "100% client-side privacy",
      "WebAssembly accelerated AI",
      "Before and after comparison",
      "Batch image processing",
      "Background replacement",
      "PNG and JPG export",
      "Edge refinement preview",
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
            Remove, replace, and prepare images for real use. Create transparent PNGs, add white or branded backgrounds, batch process product photos, and export ready-to-use assets with local browser AI.
          </p>
        </div>
      </section>

      <AIBackgroundRemover />

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">What is an AI background remover?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            An AI background remover is an image editing tool that uses computer vision and machine learning to detect the main subject in a photo and separate it from the background. Instead of tracing around a person, product, pet, car, or object by hand, the model analyzes pixels, predicts the foreground mask, and creates a cutout automatically. The result can be exported as a transparent PNG or placed onto a new white, colored, or branded background for product listings, profile images, thumbnails, ads, and social graphics.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How AI background removal works</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <article className="rounded-[1.25rem] border border-border bg-background p-5">
              <h3 className="text-lg font-semibold text-foreground">1. Detect the subject</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                The model looks for the primary object, person, product, pet, or foreground shape.
              </p>
            </article>
            <article className="rounded-[1.25rem] border border-border bg-background p-5">
              <h3 className="text-lg font-semibold text-foreground">2. Segment the image</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                It builds a pixel-level mask that separates foreground from background.
              </p>
            </article>
            <article className="rounded-[1.25rem] border border-border bg-background p-5">
              <h3 className="text-lg font-semibold text-foreground">3. Export the asset</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                You review the before-after result, choose a background, and download PNG or JPG.
              </p>
            </article>
          </div>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Common use cases</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>E-commerce sellers can create clean product photos with white or transparent backgrounds.</li>
            <li>Creators can prepare thumbnails, profile images, stickers, and social graphics faster.</li>
            <li>Marketers can cut out people or products for ads, landing pages, and campaign visuals.</li>
            <li>Teams can remove backgrounds, then continue with the <Link href="/image/image-compressor" className="text-primary hover:underline">image compressor</Link>, <Link href="/image/image-cropper-resizer" className="text-primary hover:underline">cropper and resizer</Link>, or image format converter.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">PNG background remover, JPG background remover, and transparent background maker</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Use PNG export when you need a transparent background for design tools, overlays, mockups, and layered assets. Use JPG export when you want a smaller file with a white or colored background. JPG images do not support transparency, so the exporter fills the background before download. For the cleanest result, upload a high-resolution image with a clear subject and visible edge separation.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Privacy and limitations</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            This tool downloads a WebAssembly AI model into your browser and processes images on your device. Your images are not uploaded or stored by this tool. AI background removal is powerful, but it is not perfect: hair, fur, glass, smoke, shadows, similar foreground and background colors, or cluttered scenes can create artifacts. Review the result before using it in production.
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
