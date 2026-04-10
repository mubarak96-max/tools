import Link from "next/link";
import type { Metadata } from "next";

import StatisticsCalculator from "@/app/utility/statistics-calculator/components/StatisticsCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/utility/statistics-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What statistics does this calculator return?",
    answer:
      "It returns count, sum, mean, median, mode, minimum, maximum, range, population variance, population standard deviation, sample variance, and sample standard deviation.",
  },
  {
    question: "How should I enter numbers?",
    answer:
      "You can separate values with commas, spaces, or line breaks. The calculator extracts numeric values from the input text.",
  },
  {
    question: "What if all values are unique?",
    answer:
      "If no value repeats, the set has no mode and the page shows that explicitly.",
  },
];

export const metadata: Metadata = {
  title: "Statistics Calculator | Mean, Median, Mode, and Standard Deviation",
  description:
    "Calculate descriptive statistics including mean, median, mode, variance, and standard deviation from a list of numbers.",
  keywords: ["statistics calculator", "mean median mode calculator", "standard deviation calculator"],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Statistics Calculator",
    description: "Compute mean, median, mode, variance, and standard deviation from a number set.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Statistics Calculator",
    description: "A quick descriptive statistics calculator for number lists.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Statistics Calculator",
    url: PAGE_URL,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free statistics calculator for descriptive measures and dispersion metrics.",
  };
}

export default function StatisticsCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Utility", path: "/utility" },
    { name: "Statistics Calculator", path: PAGE_PATH },
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
            <li className="text-foreground">Statistics Calculator</li>
          </ol>
        </nav>
        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">Math Utility</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Statistics Calculator</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Paste a list of numbers and calculate the common descriptive statistics used in coursework, reporting, and quick analysis.
          </p>
        </div>
      </section>
      <StatisticsCalculator />
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
