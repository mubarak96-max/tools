import Link from "next/link";
import type { Metadata } from "next";

import ExactTextToolRunner from "@/components/tools/ExactTextTool";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { EXACT_TEXT_TOOL_MAP } from "@/lib/tools/exact-catalog";

export const revalidate = 43200;

const PAGE_PATH = "/text/text-difference-checker";
const PAGE_URL = absoluteUrl(PAGE_PATH);
const tool = EXACT_TEXT_TOOL_MAP["text-difference-checker"];

export const metadata: Metadata = {
  title: "Free Text Difference Checker – Compare Two Text Versions Online",
  description:
    "Compare two text blocks instantly and see added, removed, and changed lines highlighted side by side. Free online diff tool for drafts, AI rewrites, and document reviews.",
  keywords: [
    "text difference checker",
    "compare two texts online",
    "text comparison tool",
    "find differences between two texts",
    "online diff checker",
    "compare text online free",
    "text diff tool",
    "document comparison tool",
    "compare two paragraphs",
    "diff checker for text",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Free Text Difference Checker – Side-by-Side Comparison",
    description:
      "Highlight differences between two text drafts or documents. Word-level highlighting included for precise editing.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Text Difference Checker",
    description:
      "Instantly compare two text blocks and identify changes, additions, and removals.",
  },
};

const faq = [
  {
    question: "What is a text diff?",
    answer:
      "A 'diff' is a technical term for finding the difference between two sequences of data. A text diff tool specifically identifies which lines or words have been added, removed, or modified between two versions of a document, highlighting them for easy review.",
  },
  {
    question: "How do I compare two Word documents?",
    answer:
      "To compare Word documents using this tool, simply open both files, copy the content from the original version and paste it into the 'Original' box, then copy the content from the revised version into the 'Revised' box. The tool will instantly show you all the changes highlighted side-by-side.",
  },
  {
    question: "Can I use this to check plagiarism?",
    answer:
      "No. This tool is designed to find specific differences between two provided pieces of text. It does not search the internet or any database for matching content. For plagiarism detection, you would need a tool that compares your text against a global index of web pages and academic papers.",
  },
  {
    question: "What's the difference between a word diff and a line diff?",
    answer:
      "A line diff identifies whole lines that have changed. A word diff (which our tool also supports) goes deeper, highlighting exactly which specific words within a line were modified, providing much more precision for editing and proofreading.",
  },
  {
    question: "Is this the same as a Git diff?",
    answer:
      "Yes, it works on the same underlying principle as the 'git diff' command used by software developers. However, our tool is optimized for plain text, articles, and documents rather than just source code, providing a cleaner visual interface for non-developers.",
  },
  {
    question: "Can I choose to only see the changes?",
    answer:
      "Yes. By default, we show the full context. However, you can toggle the 'Hide unchanged' button to collapse all sections of the text that are identical, allowing you to focus purely on the revisions.",
  },
  {
    question: "Is my text data saved or stored?",
    answer:
      "No. All comparison processing happens locally in your browser. We do not save, store, or transmit your text to any server. Your content remains completely private.",
  },
  {
    question: "Can I use this for AI-generated content?",
    answer:
      "Absolutely. One of the best uses for this tool is comparing a raw AI output to your edited version. It helps you track exactly how much of the original prompt the AI followed and where you made manual improvements to the flow and tone.",
  },
  {
    question: "Does it support side-by-side or unified view?",
    answer:
      "Currently, we provide a side-by-side comparison view which is generally preferred for document reviews. Added text is highlighted in blue (Revised column) and removed text is highlighted in red (Original column).",
  },
  {
    question: "Can I compare two versions of an email?",
    answer:
      "Yes. Simply paste the drafts into the two boxes. It is an excellent way to see how your tone or word choice shifted during the drafting process.",
  },
];

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Text Difference Checker",
    url: PAGE_URL,
    applicationCategory: "WebApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Free online tool to compare two text blocks and highlight additions, removals, and changes side by side.",
    featureList: [
      "Side-by-side text comparison",
      "Word-level change highlighting",
      "Line-level diffing",
      "One-click 'Swap Sides' feature",
      "Toggle to hide unchanged lines",
      "Word and line change statistics",
    ],
  };
}

export default function TextDiffCheckerPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Text", path: "/text" },
    { name: "Text Difference Checker", path: PAGE_PATH },
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
            <li>
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/text" className="hover:text-primary">
                Text
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground">Text Difference Checker</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Editing Tool
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Text Difference Checker
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Compare two pieces of text and instantly see exactly what changed. Our free online diff tool uses word-level highlighting to show additions, deletions, and edits side by side.
          </p>
        </div>
      </section>

      <ExactTextToolRunner tool={tool} />

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Why Use a Text Comparison Tool?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            A text diff tool is more than just a developer utility; it is a powerful assistant for anyone working with digital documents. Whether you are reviewing a legal contract, checking an AI rewrite, or managing blog post revisions, manually scanning for small changes is prone to human error.
          </p>
          
          <h3 className="mt-8 text-xl font-semibold tracking-tight text-foreground">Common Use Cases</h3>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 text-base leading-7 text-muted-foreground">
              <p><strong>AI Content Rewrites:</strong> Compare a raw AI output to your manually edited version to track exactly which improvements were made to the flow and tone.</p>
              <p><strong>Legal & Contract Reviews:</strong> Quickly identify small clauses or word changes between two versions of an agreement or policy document.</p>
              <p><strong>Editorial Rounds:</strong> Proofread article drafts and see exactly what feedback was incorporated between the first and final versions.</p>
            </div>
            <div className="space-y-4 text-base leading-7 text-muted-foreground">
              <p><strong>Code & Config Checks:</strong> While lightweight, this tool is perfect for checking small JSON snippets, CSS blocks, or environment variables.</p>
              <p><strong>Academic Revisions:</strong> Track changes made to an essay or thesis during the peer review or feedback process.</p>
              <p><strong>Translation Staging:</strong> Compare different machine translation outputs or check a translated text against the previous revision.</p>
            </div>
          </div>

          <h2 className="mt-12 text-2xl font-semibold tracking-tight text-foreground">How to Use the Diff Tool</h2>
          <div className="mt-6 space-y-4">
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">1</div>
              <div>
                <p className="font-semibold text-foreground">Paste Source Text</p>
                <p className="text-sm text-muted-foreground">Paste your original version into the left box titled &quot;Original text&quot;.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">2</div>
              <div>
                <p className="font-semibold text-foreground">Paste Revised Text</p>
                <p className="text-sm text-muted-foreground">Paste the new version into the right box titled &quot;Revised text&quot;.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">3</div>
              <div>
                <p className="font-semibold text-foreground">Review Highlights</p>
                <p className="text-sm text-muted-foreground">Look at the comparison preview below. Added text will be highlighted in the Revised column, while removals show in the Original column.</p>
              </div>
            </div>
          </div>

          <h2 className="mt-12 text-2xl font-semibold tracking-tight text-foreground">Key Features</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-7 text-muted-foreground">
            <li><strong>Side-by-Side Comparison:</strong> Classic dual-pane layout for intuitive document review.</li>
            <li><strong>Word-Level Highlighting:</strong> Goes beyond line-by-line checks to show specific changes within a sentence.</li>
            <li><strong>Dynamic Statistics:</strong> Real-time counts of changed, added, and removed lines, plus a word count delta.</li>
            <li><strong>One-Click Side Swap:</strong> Effortlessly switch the original and revised inputs to see the diff from a different perspective.</li>
            <li><strong>Unchanged Line Toggle:</strong> Hide matching text to focus only on the revisions in long documents.</li>
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

      <RelatedToolsSection category="Text" categoryHref="/text" currentPath={PAGE_PATH} />
    </div>
  );
}
