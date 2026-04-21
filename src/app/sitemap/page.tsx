import Link from "next/link";

import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 14400;

export const metadata = buildMetadata({
  title: "Sitemap for Utility Tools",
  description: "Browse utility tools from one HTML sitemap.",
  path: "/sitemap",
});

const SITEMAP_TOOLS = [
  {
    category: "Health",
    categoryHref: "/health",
    categoryDescription: "Health and nutrition calculators.",
    tools: [
      {
        name: "BMR Calculator",
        href: "/health/bmr-calculator",
        description: "Calculate your Basal Metabolic Rate using the Mifflin-St Jeor Equation.",
        icon: "BMR",
      },
    ],
  },
  {
    category: "Image",
    categoryHref: "/image",
    categoryDescription: "Image editing, conversion, and quick browser-based visual utilities.",
    tools: [
      {
        name: "AI Background Remover",
        href: "/image/ai-background-remover",
        description: "Remove the background from any photo instantly using local WebAssembly AI.",
        icon: "AI",
      },
      {
        name: "Convert Image to Base64",
        href: "/image/convert-image-to-base64",
        description: "Convert any image into a Base64 string or data URL directly in your browser.",
        icon: "B64",
      },
    ],
  },
  {
    category: "Real Estate",
    categoryHref: "/real-estate",
    categoryDescription: "Property calculators for buying costs and transfer taxes.",
    tools: [
      {
        name: "NYC Transfer Tax Calculator",
        href: "/real-estate/nyc-transfer-tax-calculator",
        description: "Estimate New York City real property transfer tax from the transfer price and property type.",
        icon: "NYC",
      },
    ],
  },
  {
    category: "Text",
    categoryHref: "/text",
    categoryDescription: "Text cleanup, transformation, translation, OCR, and analysis tools.",
    tools: [
      {
        name: "Word Frequency Counter",
        href: "/text/word-frequency",
        description: "Analyze repeated words, filter stop words, and surface the most-used terms in any text block.",
        icon: "FREQ",
      },
      {
        name: "Morse Code Translator",
        href: "/text/morse-code-translator",
        description: "Translate text to Morse code and Morse code back to text.",
        icon: "MORSE",
      },
      {
        name: "Binary Code Translator",
        href: "/text/binary-code-translator",
        description: "Translate text to binary and binary back to text with byte validation.",
        icon: "BIN",
      },
      {
        name: "Image to Text OCR",
        href: "/text/convert-image-to-text",
        description: "Extract, clean, copy, and download editable text from images with OCR.",
        icon: "OCR",
      },
      {
        name: "Readability / Flesch-Kincaid Calculator",
        href: "/text/readability-flesch-kincaid-calculator",
        description: "Score pasted text for reading ease, grade level, and sentence complexity.",
        icon: "READ",
      },
    ],
  },
  {
    category: "Utility",
    categoryHref: "/utility",
    categoryDescription: "Formatting, generation, and scanning tools for quick browser work.",
    tools: [
      {
        name: "Free CV Resume Builder",
        href: "/utility/free-cv-resume-builder",
        description: "Build a resume online for free with editable sections, templates, autosave, and print export.",
        icon: "CV",
      },
      {
        name: "QR Code Generator",
        href: "/utility/qr-code-generator",
        description: "Create and download static QR codes with custom colors and zero expiry limits.",
        icon: "QR",
      },
      {
        name: "Barcode Generator",
        href: "/utility/barcode-generator",
        description: "Create CODE128, UPC, and EAN barcodes and download high-quality PNGs.",
        icon: "CODE",
      },
      {
        name: "QR Code Scanner",
        href: "/utility/qr-code-scanner",
        description: "Scan QR codes using your device camera or upload an image.",
        icon: "CAM",
      },
      {
        name: "Barcode Scanner",
        href: "/utility/barcode-scanner",
        description: "Use your webcam or phone to scan 1D retail product barcodes.",
        icon: "SCAN",
      },
    ],
  },
];

const TOOL_COUNT = SITEMAP_TOOLS.reduce((sum, group) => sum + group.tools.length, 0);

export default async function SitemapPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-4 py-2 sm:py-4">

        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Browse tools
        </h1>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              All Tools
            </h2>
          </div>
          <span className="rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground">
            {TOOL_COUNT} tools
          </span>
        </div>

        <div className="mt-6 space-y-6">
          {SITEMAP_TOOLS.map((group) => (
            <section key={group.category} className="rounded-[1.25rem] border border-border bg-background p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{group.category}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{group.categoryDescription}</p>
                </div>
                <Link
                  href={group.categoryHref}
                  className="rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
                >
                  View {group.category}
                </Link>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {group.tools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="flex flex-col rounded-[1rem] border border-border bg-card px-4 py-4 text-sm transition-colors hover:border-primary/20 hover:bg-primary-soft"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold text-foreground">{tool.name}</div>
                      <div className="shrink-0 rounded-lg border border-border bg-muted px-2 py-1">
                        <span className="text-[10px] font-black text-primary">{tool.icon}</span>
                      </div>
                    </div>
                    <div className="mt-2 line-clamp-2 leading-6 text-muted-foreground">{tool.description}</div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
