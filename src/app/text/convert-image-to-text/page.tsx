import Link from "next/link";
import type { Metadata } from "next";
import { BookOpen, Briefcase, Contact2, Newspaper, Smartphone, Star, Zap } from "lucide-react";

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

      </section>

      <ImageToText />

      <section className="glass-card rounded-[2.5rem] border border-border/80 p-8 sm:p-12">
        <div className="prose prose-slate max-w-none space-y-16">
          {/* Section 1: Authority Overview */}
          <section>
            <h2 className="text-3xl font-black text-slate-900 mb-6">What is Image to Text (OCR)?</h2>
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="text-slate-600 leading-relaxed space-y-4">
                <p>
                  <strong>Image to Text</strong> is an online utility that uses Optical Character Recognition (OCR) technology to extract textual data trapped inside images. Whether it&apos;s a photo of a printed document, a screenshot of a social media post, or a snapshot of hand-written notes, our converter scans the visual patterns of characters and translates them into editable, machine-readable text.
                </p>
                <p>
                  At FindBest Tools, we have optimized our OCR engine to provide 100% accuracy for clear digital images while maintaining a <strong>privacy-first workflow</strong>. Unlike cloud-based converters that upload your files to their servers, our tool processes your images locally in your browser using WebAssembly. Your data never leaves your device.
                </p>
              </div>
              <div className="bg-primary/5 border border-primary/10 rounded-3xl p-8">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2 italic">Why use an Online OCR?</h4>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex gap-3">
                    <Star className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span><strong>Save Hours:</strong> Eliminate the need for manual retyping and data entry.</span>
                  </li>
                  <li className="flex gap-3">
                    <Star className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span><strong>Searchability:</strong> Turn flat images into searchable TXT or Word-ready content.</span>
                  </li>
                  <li className="flex gap-3">
                    <Star className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span><strong>Accessibility:</strong> Convert visual text into formats compatible with screen readers.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2: Scenario Use Cases */}
          <section>
            <h2 className="text-3xl font-black text-slate-900 mb-8 text-center">Common Use Scenarios</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 not-prose">
              {[
                { title: "Academic & Class Notes", desc: "Students can capture whiteboard photos or book snippets and turn them into digital study guides instantly.", icon: <BookOpen className="w-8 h-8 text-primary" /> },
                { title: "Business Invoices", desc: "Extract line items and totals from receipts or invoices for your accounting and spreadsheet workflows.", icon: <Briefcase className="w-8 h-8 text-primary" /> },
                { title: "Newspaper & Archives", desc: "Digitize historical clippings or printed news into searchable digital archives for research.", icon: <Newspaper className="w-8 h-8 text-primary" /> },
                { title: "Social Media Captions", desc: "Extract text from Instagram stories, Twitter screenshots, or memes for reuse in your own content.", icon: <Smartphone className="w-8 h-8 text-primary" /> },
                { title: "Contact Information", desc: "Found an email or phone number on a physical banner? Snap a photo and copy the text directly.", icon: <Contact2 className="w-8 h-8 text-primary" /> },
                { title: "Data Entry Tasks", desc: "Accelerate your workflow by converting physical forms into editable digital data sets.", icon: <Zap className="w-8 h-8 text-primary" /> },
              ].map((use, i) => (
                <div key={i} className="p-8 bg-white border border-slate-100 rounded-[2.5rem] hover:border-primary/20 hover:shadow-xl transition-all group text-center">
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/5 transition-transform group-hover:scale-110">
                    {use.icon}
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">{use.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{use.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Technical Specs & DPI */}
          <section className="bg-slate-900 text-white rounded-[3rem] p-10 sm:p-16 overflow-hidden relative">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-8 text-white">How to Get 100% OCR Accuracy</h2>
              <p className="text-slate-400 mb-12 max-w-2xl">
                OCR accuracy isn&apos;t just about the software; it&apos;s about the quality of the input. Follow these industry-standard best practices to ensure perfect text extraction.
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">1</div>
                    <div>
                      <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-2">Resolution Matters</h4>
                      <p className="text-sm text-slate-400">Aim for a minimum of <strong>300 DPI</strong>. Images that are too small or pixelated will lead to "character confusion" in the neural network.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">2</div>
                    <div>
                      <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-2">Lighting & Contrast</h4>
                      <p className="text-sm text-slate-400">Ensure text is dark and the background is light. Avoid shadows, glares, or warped paper surfaces.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">3</div>
                    <div>
                      <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-2">The "Horizontal Rule"</h4>
                      <p className="text-sm text-slate-400">Always rotate your image so the text lines are horizontal. Even a 5-degree tilt can significantly drop the extraction success rate.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">4</div>
                    <div>
                      <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-2">Correct Language</h4>
                      <p className="text-sm text-slate-400">Select the correct source language in the settings. OCR models use dictionary-based correction to fix minor scanning errors.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Formats & Compatibility */}
          <section>
            <h2 className="text-3xl font-black text-slate-900 mb-6">Wide Format Compatibility</h2>
            <p className="text-slate-600 mb-8">
              Our online OCR converter is designed to be universal. We support all modern image extensions to ensure you can extract text regardless of your device.
            </p>
            <div className="flex flex-wrap gap-3 not-prose">
              {[".JPG", ".JPEG", ".PNG", ".WEBP", ".BMP", ".TIFF", ".HEIC"].map((ext) => (
                <span key={ext} className="px-5 py-2 bg-slate-100 rounded-xl text-slate-600 font-mono text-sm font-bold">{ext}</span>
              ))}
            </div>
            <div className="mt-8 grid md:grid-cols-2 gap-8">
              <div className="p-6 border border-slate-100 rounded-3xl">
                <h4 className="font-bold text-slate-900 mb-2">JPG to Text</h4>
                <p className="text-xs text-slate-500">The most common choice for photos taken with mobile phones. Ideal for receipts and documents.</p>
              </div>
              <div className="p-6 border border-slate-100 rounded-3xl">
                <h4 className="font-bold text-slate-900 mb-2">PNG to Text</h4>
                <p className="text-xs text-slate-500">Best for digital screenshots from computers or social media. Provides the highest clarity for OCR engines.</p>
              </div>
            </div>
          </section>

          {/* Section 5: Step-by-Step */}
          <section className="border-t border-slate-100 pt-16">
            <h2 className="text-3xl font-black text-slate-900 mb-10 text-center">How to Convert Image to Text</h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Upload", text: "Drag your images into the drop zone or click to select files." },
                { step: "02", title: "Select Language", text: "Choose the language used in the image for better accuracy." },
                { step: "03", title: "Extract", text: "Wait a few seconds while the OCR neural network scans the pixels." },
                { step: "04", title: "Copy & Use", text: "Copy the editable text or download it as a professional TXT file." },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl font-black text-primary/10 mb-4 tracking-tighter">{item.step}</div>
                  <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 6: Local-First Technology */}
          <section className="bg-primary/5 rounded-3xl p-10 border border-primary/10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">A Note on Privacy and Technology</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              FindBest Tools uses <strong>Tesseract.js</strong>, a powerful JavaScript port of the legendary Tesseract OCR engine originally developed by HP and maintained by Google. By running this technology via WebAssembly in your browser, we eliminate the security risks associated with uploading sensitive documents to cloud servers. Your private data, invoices, and personal notes stay on your machine — guaranteed.
            </p>
          </section>
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
            },
            {
              name: "Readability / Flesch-Kincaid Calculator",
              href: "/text/readability-flesch-kincaid-calculator",
              description: "Score pasted text for reading ease, grade level, and sentence complexity.",
            },
            {
              name: "Morse Code Translator",
              href: "/text/morse-code-translator",
              description: "Translate text to Morse code and Morse code back to text.",
            },
          ].map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex flex-col gap-3 rounded-2xl border border-white/40 bg-white/40 p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/20 hover:bg-white/60 hover:shadow-hover"
            >
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

