import Link from "next/link";
import type { Metadata } from "next";

import ImageToText from "@/app/text/image-to-text/components/ImageToText";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";
import { FREE_TOOLS } from "@/lib/tools/registry";

export const revalidate = 43200;

const PAGE_PATH = "/text/convert-image-to-text";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How do I convert an image to text?",
    answer:
      "Upload an image, run OCR, and the tool will scan the picture for readable text and return the extracted result in plain text form.",
  },
  {
    question: "What does OCR mean?",
    answer:
      "OCR stands for optical character recognition. It is the process of detecting printed characters inside an image and converting them into editable text.",
  },
  {
    question: "What images work best for OCR?",
    answer:
      "High-contrast images with clear printed text work best. Blurry photos, handwriting, shadows, and dense backgrounds reduce recognition accuracy.",
  },
  {
    question: "Can I copy the extracted text directly?",
    answer:
      "Yes. After OCR finishes, you can copy the extracted text with one click and paste it into another app or document.",
  },
];

export const metadata: Metadata = {
  title: "Convert Image to Text | Free Online Convert Image to Text",
  description:
    "Convert image to text online with a free OCR tool. Upload a picture, run OCR, and copy the detected text instantly in the browser.",
  keywords: [
    "convert image to text",
    "ocr",
    "image to text",
    "ocr text extractor",
    "extract text from image online",
    "photo to text converter",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Convert Image to Text",
    description:
      "Convert image to text online with OCR and copy the extracted text instantly.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Convert Image to Text",
    description:
      "Convert image to text online with OCR and copy the result instantly.",
  },
};

function buildImageToTextJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Convert Image to Text",
    url: PAGE_URL,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Free OCR tool to convert image to text online using client-side optical character recognition.",
    featureList: [
      "Convert image to text",
      "OCR progress status",
      "Confidence score",
      "Copy extracted text",
      "Image preview",
    ],
  };
}

export default function ConvertImageToTextPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Text", path: "/text" },
    { name: "Convert Image to Text", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);
  const currentTool = FREE_TOOLS.find((tool) => tool.href === PAGE_PATH);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildImageToTextJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/text" className="hover:text-primary">Text</Link></li>
            <li>/</li>
            <li className="text-foreground">Convert Image to Text</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            OCR utility
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Convert Image to Text
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Convert image to text online with OCR directly in the browser. Upload a picture, extract the readable text, and copy the result into your next document or workflow.
          </p>
          {currentTool ? (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{currentTool.description}</p>
          ) : null}
        </div>

        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <ImageToText />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How OCR image-to-text conversion works</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            OCR, or optical character recognition, scans the visible characters inside an image and turns them into editable text. This is useful when you need to capture text from screenshots, scanned notes, receipts, posters, or document photos without retyping everything manually.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            This tool runs OCR directly in the browser, so you can convert image to text online and immediately copy the result into a document, note, or workflow.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Best use cases</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Converting screenshots and cropped document images into editable text</li>
            <li>Turning posters, signs, or product shots into copy-ready text</li>
            <li>Capturing text from receipts, forms, and printed notes</li>
            <li>Using OCR to avoid manually retyping image-based text</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Tips for better OCR accuracy</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Use clear, high-resolution images with strong contrast.</li>
            <li>Prefer printed text over handwriting for best results.</li>
            <li>Crop the image closely around the text when possible.</li>
            <li>Avoid shadows, glare, and heavy background texture.</li>
          </ul>
        </div>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
        <div className="mt-6 space-y-4">
          {faq.map((item) => (
            <article key={item.question} className="rounded-[1.25rem] border border-border bg-background p-5">
              <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <RelatedToolsSection category="Text" categoryHref="/text" currentPath={PAGE_PATH} />
    </div>
  );
}

