import Link from "next/link";

import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 43200;

export const metadata = buildMetadata({
  title: "Text Tools for Analysis, Translation, and OCR",
  description:
    "Free text tools for word frequency analysis, Morse code, binary translation, and image-to-text OCR.",
  path: "/text",
});

type TextToolMeta = {
  name: string;
  href: string;
  description: string;
  icon: string;
};

const TEXT_TOOLS: TextToolMeta[] = [
  {
    name: "Word Frequency Counter",
    href: "/text/word-frequency",
    description: "Analyze repeated words, filter stop words, and surface the most-used terms in any text block.",
    icon: "FREQ",
  },
  {
    name: "Morse Code Translator",
    href: "/text/morse-code-translator",
    description: "Translate text to Morse code and Morse code back to text with support for letters, numbers, and punctuation.",
    icon: "MORSE",
  },
  {
    name: "Binary Code Translator",
    href: "/text/binary-code-translator",
    description: "Translate text to binary and binary back to text with 8-bit byte conversion and validation.",
    icon: "BIN",
  },
  {
    name: "Image to Text OCR",
    href: "/text/convert-image-to-text",
    description: "Extract, clean, copy, and download editable text from JPG, PNG, WEBP, and BMP images with OCR.",
    icon: "OCR",
  },
  {
    name: "Readability / Flesch-Kincaid Calculator",
    href: "/text/readability-flesch-kincaid-calculator",
    description: "Score pasted text for reading ease, grade level, and sentence complexity.",
    icon: "READ",
  },
];

function ToolCard({ tool }: { tool: TextToolMeta }) {
  return (
    <Link
      href={tool.href}
      className="group flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-5 transition-all hover:border-primary/25 hover:shadow-[0_4px_20px_-8px_rgba(79,70,229,0.18)]"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
          {tool.name}
        </h2>
        <div className="shrink-0 rounded-lg border border-border bg-muted p-2">
          <span className="text-[10px] font-black text-primary">{tool.icon}</span>
        </div>
      </div>
      <p className="text-sm leading-6 text-muted-foreground line-clamp-2">{tool.description}</p>
      <span className="mt-auto text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        Open tool →
      </span>
    </Link>
  );
}

export default function TextPage() {
  return (
    <div className="space-y-10 pb-4">
      {/* Header */}
      <section className="rounded-[2rem] border border-border/60 bg-card px-8 py-10 sm:px-10 sm:py-12">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">Text Tools</li>
          </ol>
        </nav>
        <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
          Text · {TEXT_TOOLS.length} tools
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Text tools for analysis, translation, and conversion.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Focused utilities for analyzing word frequency, translating codes, and extracting text from images — all browser-based with no sign-up needed.
        </p>
      </section>



      {/* Tool grid */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            All Text Tools
            <span className="ml-2 text-sm font-normal text-muted-foreground">({TEXT_TOOLS.length})</span>
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {TEXT_TOOLS.map((tool) => (
            <ToolCard key={tool.href} tool={tool} />
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-border/80 bg-card p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Explore other categories</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Image Tools", href: "/image" },
            { label: "Health Tools", href: "/health" },
            { label: "Real Estate Tools", href: "/real-estate" },
            { label: "Utility Tools", href: "/utility" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-border bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
