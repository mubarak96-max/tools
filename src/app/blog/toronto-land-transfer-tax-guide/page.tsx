import Link from "next/link";
import type { Metadata } from "next";

import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

const PAGE_PATH = "/blog/toronto-land-transfer-tax-guide";
const PAGE_URL = absoluteUrl(PAGE_PATH);
const LAST_UPDATED_ISO = "2026-05-01T00:00:00.000Z";

const faq = [
  {
    question: "Why is Toronto land transfer tax higher than elsewhere in Ontario?",
    answer:
      "Because Toronto buyers can pay both the Ontario provincial tax and Toronto's municipal land transfer tax on the same purchase.",
  },
  {
    question: "Do first-time buyer rebates reduce both taxes?",
    answer:
      "Qualifying buyers may be eligible for rebate support on both the Ontario and Toronto layers, depending on the purchase structure and eligibility details.",
  },
];

export const metadata: Metadata = {
  title: "Toronto Land Transfer Tax Guide: Ontario LTT, MLTT, and Rebates",
  description:
    "Understand Toronto land transfer tax, Ontario LTT, Toronto MLTT, first-time buyer rebates, and NRST before you budget a purchase.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Toronto Land Transfer Tax Guide",
    description:
      "Learn how Ontario LTT, Toronto MLTT, rebates, and NRST affect Toronto purchase costs.",
    url: PAGE_URL,
    type: "article",
  },
  other: { "article:modified_time": LAST_UPDATED_ISO },
};

export default function TorontoLandTransferTaxGuidePage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Toronto Land Transfer Tax Guide", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <header className="mb-12 space-y-4">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/">Home</Link></li>
            <li>/</li>
            <li><Link href="/blog">Blog</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">Toronto Closing Costs</li>
          </ol>
        </nav>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          Toronto Land Transfer Tax Guide: Ontario LTT, MLTT, and Rebates
        </h1>
        <p className="text-xl leading-relaxed text-muted-foreground">
          Toronto buyers usually need to budget two transfer taxes, not one. That is the main planning mistake this guide is meant to fix.
        </p>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p>
          The{" "}
          <Link href="/real-estate/land-transfer-tax-calculator-toronto" className="font-semibold text-primary hover:underline">
            Toronto land transfer tax calculator
          </Link>{" "}
          is the fastest way to estimate the numbers, but understanding the stack matters before
          you compare neighborhoods or purchase structures.
        </p>
        <h2>Ontario plus Toronto</h2>
        <p>
          A purchase inside Toronto can trigger Ontario land transfer tax and Toronto municipal land
          transfer tax at the same time. A similar property outside the city boundary may only face
          the Ontario layer.
        </p>
        <h2>Rebates can change the budget</h2>
        <p>
          First-time buyer rebates are one of the biggest reasons to model the deal properly,
          especially when ownership is shared or a co-buyer changes eligibility.
        </p>
        <h2>NRST needs separate attention</h2>
        <p>
          For qualifying non-resident residential purchases, NRST can materially increase the total
          cash required on top of the transfer taxes.
        </p>
      </div>
    </div>
  );
}
