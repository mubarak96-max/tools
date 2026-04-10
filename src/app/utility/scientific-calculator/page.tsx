import Link from "next/link";
import type { Metadata } from "next";

import ScientificCalculator from "@/app/utility/scientific-calculator/components/ScientificCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/utility/scientific-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What functions does this scientific calculator support?",
    answer:
      "It supports arithmetic, parentheses, exponents, factorial, pi, e, sqrt, abs, log, ln, and trigonometric functions including sin, cos, tan, asin, acos, and atan.",
  },
  {
    question: "Can I switch between degrees and radians?",
    answer:
      "Yes. The DEG and RAD toggle changes how the trig functions interpret input and how inverse trig results are shown.",
  },
  {
    question: "Does this calculator handle complex-number output?",
    answer:
      "No. This page focuses on real-number scientific calculations. Expressions that require unsupported domains, like sqrt of a negative number, return an error message instead.",
  },
];

export const metadata: Metadata = {
  title: "Scientific Calculator | Trig, Logs, Powers, and More",
  description:
    "Evaluate arithmetic, powers, trig functions, logarithms, factorials, and scientific expressions in the browser.",
  keywords: ["scientific calculator", "online scientific calculator", "trig calculator", "log calculator"],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Scientific Calculator",
    description: "Evaluate scientific expressions with trig, logs, powers, and constants.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scientific Calculator",
    description: "A browser-based scientific calculator with trig, logs, and powers.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Scientific Calculator",
    url: PAGE_URL,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free scientific calculator for arithmetic, trig, logarithms, and powers.",
  };
}

export default function ScientificCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Utility", path: "/utility" },
    { name: "Scientific Calculator", path: PAGE_PATH },
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
            <li className="text-foreground">Scientific Calculator</li>
          </ol>
        </nav>
        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">Math Utility</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Scientific Calculator</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Evaluate scientific expressions with arithmetic, powers, logarithms, factorials, and trig functions without leaving the browser.
          </p>
        </div>
      </section>
      <ScientificCalculator />
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
      <RelatedToolsSection category="Utility" categoryHref="/utility" currentPath={PAGE_PATH} />
    </div>
  );
}
