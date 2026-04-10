import Link from "next/link";
import type { Metadata } from "next";

import LogarithmCalculator from "@/app/utility/logarithm-calculator/components/LogarithmCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/utility/logarithm-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What values are valid for logarithms?",
    answer:
      "The input value must be positive. For a custom base, the base must also be positive and cannot equal 1.",
  },
  {
    question: "What is the difference between ln and log10?",
    answer:
      "ln means the natural logarithm with base e, while log10 means the common logarithm with base 10.",
  },
  {
    question: "How is log base b calculated?",
    answer:
      "It uses the change-of-base formula: log_b(x) = ln(x) / ln(b).",
  },
];

export const metadata: Metadata = {
  title: "Logarithm Calculator | Custom Base, Natural Log, and Common Log",
  description:
    "Calculate logarithms with a custom base, plus natural log and common log values.",
  keywords: ["logarithm calculator", "log base calculator", "natural log calculator", "common log calculator"],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Logarithm Calculator",
    description: "Calculate logs with a custom base, ln, and log10.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Logarithm Calculator",
    description: "A quick calculator for logarithms and change of base.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Logarithm Calculator",
    url: PAGE_URL,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free logarithm calculator for custom base, natural log, and common log.",
  };
}

export default function LogarithmCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Utility", path: "/utility" },
    { name: "Logarithm Calculator", path: PAGE_PATH },
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
            <li className="text-foreground">Logarithm Calculator</li>
          </ol>
        </nav>
        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">Math Utility</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Logarithm Calculator</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Calculate logarithms using a custom base and compare them against natural log and common log output in the same view.
          </p>
        </div>
      </section>
      <LogarithmCalculator />
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
