import Link from "next/link";
import type { Metadata } from "next";

import VATCalculator from "@/app/finance/vat-calculator/components/VATCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { FREE_TOOLS } from "@/lib/tools/registry";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/vat-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How do I add VAT to a net price?",
    answer:
      "Multiply the net price by the VAT rate to get the VAT amount, then add that tax amount to the net price to get the gross price.",
  },
  {
    question: "How do I remove VAT from a gross price?",
    answer:
      "Use the VAT fraction method: gross price multiplied by rate divided by 100 plus rate. This extracts only the tax portion correctly.",
  },
  {
    question: "What is the difference between VAT and GST?",
    answer:
      "The names differ by market, but the calculation structure is usually the same for price-add and price-remove workflows. This tool supports both VAT and GST-style setups.",
  },
  {
    question: "Can I use a custom VAT rate?",
    answer:
      "Yes. You can use the country presets or type your own rate manually when you need a custom setup.",
  },
];

export const metadata: Metadata = {
  title: "VAT Calculator | Add VAT or Remove VAT from Gross Price",
  description:
    "Add VAT to a net price or remove VAT from a gross price with country presets, reduced rates, and custom VAT input.",
  keywords: [
    "VAT calculator",
    "add VAT calculator",
    "remove VAT calculator",
    "VAT removal calculator",
    "gross to net VAT",
    "net to gross VAT",
    "GST calculator",
    "UK VAT calculator",
    "UAE VAT calculator",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "VAT Calculator for Net to Gross and Gross to Net",
    description:
      "Calculate VAT amount, net price, and gross price with country presets and custom rates.",
  },
  twitter: {
    card: "summary_large_image",
    title: "VAT Calculator",
    description:
      "Add VAT or remove VAT from a gross price with presets for major countries.",
  },
};

function buildVatApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "VAT Calculator",
    url: PAGE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Free VAT calculator for adding VAT to a net price or removing VAT from a gross price using country-specific presets and custom rates.",
    featureList: [
      "Add VAT mode",
      "Remove VAT mode",
      "Country VAT presets",
      "Reduced-rate shortcuts",
      "Custom VAT input",
    ],
  };
}

export default function VATCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "VAT Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);
  const vatTool = FREE_TOOLS.find((tool) => tool.href === PAGE_PATH);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildVatApplicationJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/finance" className="hover:text-primary">Finance</Link></li>
            <li>/</li>
            <li className="text-foreground">VAT Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Finance calculator
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            VAT Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Add VAT to a net price or remove VAT from a gross price with presets for major countries, reduced rates, and custom-rate support.
          </p>
          {vatTool ? (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{vatTool.description}</p>
          ) : null}
        </div>
      
        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <VATCalculator />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How VAT calculations work</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            VAT is usually calculated from a net price by multiplying the amount by the VAT rate and adding the result back on top. That gives the final gross price a customer pays.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Removing VAT is slightly different. You do not take a simple percentage of the gross price. Instead, you extract the VAT portion using the VAT fraction method, which correctly separates the tax from the tax-inclusive total.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">When to add VAT vs remove VAT</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Use <strong className="text-foreground">Add VAT</strong> when you are starting from an ex-VAT or net figure.</li>
            <li>Use <strong className="text-foreground">Remove VAT</strong> when the amount already includes VAT and you want the underlying net value.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Why country presets matter</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            VAT and GST rates vary by country, and some countries use reduced or zero rates for specific categories. Presets help you move quickly while still allowing manual rate changes when needed.
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

      <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath={PAGE_PATH} />
    </div>
  );
}


