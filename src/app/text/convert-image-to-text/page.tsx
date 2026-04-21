import Link from "next/link";
import type { Metadata } from "next";

import ImageToText from "./components/ImageToText";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";

export const revalidate = 43200;

const PAGE_PATH = "/text/convert-image-to-text";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How do I extract text from an image?",
    answer:
      "Upload or drag in a JPG, PNG, WEBP, or BMP image, choose the OCR language, and run extraction. The tool scans the image for readable characters and returns editable text you can copy or download.",
  },
  {
    question: "What is OCR?",
    answer:
      "OCR stands for optical character recognition. It uses pattern recognition and machine-learning models to detect letters, words, and lines inside an image and convert them into machine-readable text.",
  },
  {
    question: "Can OCR read handwriting?",
    answer:
      "It can sometimes read clear handwriting, but printed text is usually more accurate. Handwriting varies by person, so names, numbers, and punctuation should always be reviewed manually.",
  },
  {
    question: "Why is OCR inaccurate sometimes?",
    answer:
      "OCR accuracy depends on image resolution, lighting, contrast, rotation, font clarity, background noise, and language selection. A sharper, straighter image usually produces cleaner text.",
  },
  {
    question: "What image formats are supported?",
    answer:
      "The tool accepts common image formats including JPG, PNG, WEBP, and BMP. For best results, use a clear image where the text is not blurred, warped, or hidden by glare.",
  },
  {
    question: "Can I use the extracted text in other tools?",
    answer:
      "Yes. After extraction, copy the text, download it as a TXT file, clean spacing, or continue with related text tools such as the word counter, character counter, and readability calculator.",
  },
];

export const metadata: Metadata = {
  title: "Image to Text OCR Converter | Extract Text from Image Online",
  description:
    "Extract text from images with a free OCR converter. Convert JPG, PNG, WEBP, and BMP images into editable text, clean the output, and copy or download it.",
  keywords: [
    "convert image to text",
    "ocr converter",
    "ocr",
    "image to text",
    "image to text ocr",
    "ocr text extractor",
    "extract text from image online",
    "photo to text converter",
    "convert image to editable text",
    "copy text from image",
    "jpg to text",
    "png to text",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Image to Text OCR Converter",
    description:
      "Extract text from images online with OCR, clean the output, and continue into writing and analysis workflows.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image to Text OCR Converter",
    description:
      "Convert images into editable text with OCR, confidence feedback, cleanup actions, and TXT download.",
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
      "Free OCR converter that extracts editable text from images, supports multiple image uploads, shows confidence feedback, and provides cleanup and copy actions.",
    featureList: [
      "Extract text from image with OCR",
      "JPG, PNG, WEBP, and BMP support",
      "OCR progress status and staged feedback",
      "Confidence score",
      "Language selection",
      "Batch image upload",
      "Rotate and contrast preprocessing",
      "Copy extracted text",
      "Download TXT output",
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
            Image to Text OCR Converter
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Extract, clean, and use text from images instantly. Upload screenshots, notes, receipts, or document photos, run OCR, then copy, download, or continue the text into editing and analysis tools.
          </p>
        </div>

        <div className="mt-6 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-tight text-success">
            Private and browser-native
          </div>
        </div>
      </section>

      <ImageToText />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">What is OCR image to text?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            OCR means optical character recognition. It is the technology that converts text locked inside an image into editable, searchable, machine-readable text. An OCR converter looks for character shapes, word spacing, and line structure in screenshots, scanned notes, receipts, labels, or document photos. Instead of retyping a page by hand, you can extract text from an image, clean the spacing, and use it in a document, spreadsheet, CMS, research note, or content workflow. OCR works best when the image is sharp, straight, high contrast, and written in the selected language.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How image to text works</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <article className="rounded-[1.25rem] border border-border bg-background p-5">
              <h3 className="text-lg font-semibold text-foreground">1. Preprocess the image</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Rotation and contrast adjustments help the OCR engine see characters more clearly before recognition starts.
              </p>
            </article>
            <article className="rounded-[1.25rem] border border-border bg-background p-5">
              <h3 className="text-lg font-semibold text-foreground">2. Detect text regions</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                The OCR model searches the image for text blocks, lines, words, and character-like shapes.
              </p>
            </article>
            <article className="rounded-[1.25rem] border border-border bg-background p-5">
              <h3 className="text-lg font-semibold text-foreground">3. Recognize characters</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Pattern recognition and language data convert visual marks into letters, numbers, and punctuation.
              </p>
            </article>
            <article className="rounded-[1.25rem] border border-border bg-background p-5">
              <h3 className="text-lg font-semibold text-foreground">4. Clean the output</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                You can preserve line layout, clean paragraphs, fix spacing, copy text, or download the extracted result.
              </p>
            </article>
          </div>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Common OCR use cases</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Students can digitize lecture notes, whiteboard photos, and book snippets for revision.</li>
            <li>Business users can copy text from invoices, receipts, forms, labels, and scanned paperwork.</li>
            <li>Social media teams can extract captions, comments, and screenshot text for editing.</li>
            <li>SEO and content teams can recover image-based copy, then send it to the <Link href="/text/word-frequency" className="text-primary hover:underline">word frequency counter</Link> or <Link href="/text/readability-flesch-kincaid-calculator" className="text-primary hover:underline">readability calculator</Link>.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">JPG to text and PNG to text</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            The converter supports common screenshot and camera formats, including JPG, PNG, WEBP, and BMP. Use JPG to text conversion for photos, receipts, labels, and camera captures. Use PNG to text conversion for screenshots, UI captures, social posts, and clean digital images. For the best OCR result, upload the sharpest version available and rotate the image so text lines are horizontal.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Limitations and trust notes</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            OCR is useful, but it is not a guarantee of perfect transcription. Results may vary depending on image quality, lighting, handwriting, fonts, alignment, compression, and the selected language model. Treat confidence as a review signal, not a final proofread. Images are processed for extraction in the browser workflow and are not stored by this tool.
          </p>
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

      <section className="mt-16 space-y-8 border-t border-slate-100 pt-16">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">More Text Tools</h2>
            <p className="mt-1 text-sm text-slate-500">Other utilities you might find helpful</p>
          </div>
          <Link href="/text" className="secondary-button px-4 py-2 text-xs">View All</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: "Word Frequency Counter",
              href: "/text/word-frequency",
              description: "Analyze repeated words and surface the most-used terms in any text block.",
              icon: "FREQ",
            },
            {
              name: "Readability / Flesch-Kincaid Calculator",
              href: "/text/readability-flesch-kincaid-calculator",
              description: "Score pasted text for reading ease, grade level, and sentence complexity.",
              icon: "READ",
            },
            {
              name: "Morse Code Translator",
              href: "/text/morse-code-translator",
              description: "Translate text to Morse code and Morse code back to text.",
              icon: "MORSE",
            },
          ].map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex flex-col gap-3 rounded-2xl border border-white/40 bg-white/40 p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/20 hover:bg-white/60 hover:shadow-hover"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[11px] font-black text-primary shadow-sm ring-1 ring-black/5">
                {tool.icon}
              </span>
              <div>
                <h3 className="text-[15px] font-bold text-slate-900 transition-colors group-hover:text-primary">
                  {tool.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

