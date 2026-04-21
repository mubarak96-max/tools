import Link from "next/link";

import ReadabilityCalculator from "../_components/ReadabilityCalculator";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 43200;

const PAGE_PATH = "/text/readability-flesch-kincaid-calculator";

export const metadata = {
  ...buildMetadata({
    title: "Readability / Flesch-Kincaid Calculator",
    description: "Score pasted text for reading ease, grade level, and sentence complexity.",
    path: PAGE_PATH,
  }),
  keywords: [
    "readability calculator",
    "flesch kincaid calculator",
    "reading ease score",
    "grade level calculator",
    "text readability checker",
  ],
};

const faqs = [
  {
    question: "What does the Flesch Reading Ease score mean?",
    answer:
      "It estimates how easy text is to read on a 0 to 100 scale. Higher scores usually mean shorter sentences, simpler words, and easier reading.",
  },
  {
    question: "Do readability scores replace editing?",
    answer:
      "No. Scores are useful signals, but they do not decide whether the text is accurate, persuasive, or appropriate for the audience.",
  },
  {
    question: "What should I change after checking readability?",
    answer:
      "Shorten dense sentences, replace unnecessary complex words, and compare the result with the audience and channel you are writing for.",
  },
];

const relatedTools = [
  {
    name: "Word Frequency Counter",
    href: "/text/word-frequency",
    description: "Analyze repeated words and surface the most-used terms in any text block.",
    icon: "FREQ",
  },
  {
    name: "Binary Code Translator",
    href: "/text/binary-code-translator",
    description: "Translate text to binary and binary back to readable text.",
    icon: "BIN",
  },
  {
    name: "Morse Code Translator",
    href: "/text/morse-code-translator",
    description: "Translate text to Morse code and Morse code back to text.",
    icon: "MORSE",
  },
];

export default function ReadabilityPage() {
  return (
    <div className="space-y-8 sm:space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Readability / Flesch-Kincaid Calculator",
            description: "Score pasted text for reading ease, grade level, and sentence complexity.",
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            url: `https://findbest.tools${PAGE_PATH}`,
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />

      <section className="relative overflow-hidden pt-8 sm:pt-12">
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/text" className="primary-chip rounded-full px-3 py-1 shadow-sm drop-shadow-sm">
              Text
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-tight text-success">
              Private and browser-native
            </div>
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Readability / Flesch-Kincaid Calculator
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
            Paste text to measure reading ease, grade level, sentence complexity, reading time, and related readability scores in one browser-based workspace.
          </p>
          <nav aria-label="Breadcrumb" className="mt-8">
            <ol className="flex flex-wrap items-center gap-2 text-[13px] font-medium text-slate-400">
              <li><Link href="/" className="hover:text-primary">Home</Link></li>
              <li>/</li>
              <li><Link href="/text" className="hover:text-primary">Text</Link></li>
              <li>/</li>
              <li className="text-slate-900">Readability Calculator</li>
            </ol>
          </nav>
        </div>
      </section>

      <ReadabilityCalculator />

      <section className="space-y-4 border-t border-border/60 pt-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">How to use readability scores</h2>
        <p className="max-w-3xl text-base leading-7 text-muted-foreground">
          Readability metrics are best used as editing signals. A high grade level can point to long sentences, dense clauses, and complex vocabulary. A low reading-ease score tells you where to simplify before publishing, teaching, emailing, or handing text to a broader audience.
        </p>
        <p className="max-w-3xl text-base leading-7 text-muted-foreground">
          Use the sentence highlights to find the first concrete edits. Rewrite one hard sentence, check the score again, and keep the changes that preserve meaning while reducing friction for the reader.
        </p>
      </section>

      <section className="mt-16 space-y-8 border-t border-slate-100 pt-16">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Practical Guide and FAQ</h2>
          <p className="mt-2 text-slate-500">What the scores mean and how to act on them.</p>
        </div>
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {faqs.map((item) => (
            <article key={item.question} className="rounded-3xl border border-slate-100 bg-white/30 p-6 shadow-sm backdrop-blur-sm">
              <h3 className="text-[17px] font-bold text-slate-900">{item.question}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">{item.answer}</p>
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
          {relatedTools.map((tool) => (
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
