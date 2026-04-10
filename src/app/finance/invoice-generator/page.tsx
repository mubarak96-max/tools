import Link from "next/link";
import type { Metadata } from "next";

import InvoiceGenerator from "@/app/finance/invoice-generator/components/InvoiceGenerator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/invoice-generator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What does this invoice generator calculate?",
    answer:
      "It calculates line totals, subtotal, discount amount, taxable base, tax amount, and final invoice total from the items you enter.",
  },
  {
    question: "Does this replace accounting or tax software?",
    answer:
      "No. This page is a calculation and drafting tool. Tax treatment, invoice numbering, compliance, and filing obligations depend on your jurisdiction and bookkeeping setup.",
  },
  {
    question: "Is discount applied before tax here?",
    answer:
      "Yes. This calculator applies the entered discount amount before tax, which is a common invoice structure.",
  },
];

export const metadata: Metadata = {
  title: "Invoice Generator | Line Items, Tax, Discount, and Total",
  description:
    "Create a simple invoice draft and calculate subtotal, discount, tax, and total from editable line items.",
  keywords: ["invoice generator", "invoice calculator", "invoice subtotal tax total"],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Invoice Generator",
    description:
      "Build a simple invoice draft with line items, tax, discount, and total.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Invoice Generator",
    description:
      "Generate invoice totals from quantities, unit prices, discount, and tax.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Invoice Generator",
    url: PAGE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Free invoice generator and calculator for line items, discount, tax, and totals.",
  };
}

export default function InvoiceGeneratorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "Invoice Generator", path: PAGE_PATH },
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
            <li><Link href="/finance" className="hover:text-primary">Finance</Link></li>
            <li>/</li>
            <li className="text-foreground">Invoice Generator</li>
          </ol>
        </nav>
        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">Business Finance</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Invoice Generator</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Draft a simple invoice, edit line items, and calculate subtotal, discount, tax, and final total without leaving the page.
          </p>
        </div>
      </section>
      <InvoiceGenerator />
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
      <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath={PAGE_PATH} />
    </div>
  );
}
