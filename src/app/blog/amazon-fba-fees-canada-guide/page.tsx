import Link from "next/link";
import type { Metadata } from "next";

import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

const PAGE_PATH = "/blog/amazon-fba-fees-canada-guide";
const PAGE_URL = absoluteUrl(PAGE_PATH);
const LAST_UPDATED_ISO = "2026-05-01T00:00:00.000Z";

export const metadata: Metadata = {
  title: "Amazon FBA Fees Canada Guide: Amazon.ca Size Tiers and Profit",
  description:
    "Understand Amazon.ca referral fees, size tiers, fulfilment fees, storage, and CAD-based margin planning for Canadian sellers.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Amazon FBA Fees Canada Guide",
    description:
      "A practical guide to Amazon.ca fees, metric size tiers, storage, and profit planning.",
    url: PAGE_URL,
    type: "article",
  },
  other: { "article:modified_time": LAST_UPDATED_ISO },
};

export default function AmazonFbaFeesCanadaGuidePage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Amazon FBA Fees Canada Guide", path: PAGE_PATH },
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <JsonLd data={serializeJsonLd(breadcrumbs)} />

      <header className="mb-12 space-y-4">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/">Home</Link></li>
            <li>/</li>
            <li><Link href="/blog">Blog</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">Amazon.ca Seller Economics</li>
          </ol>
        </nav>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          Amazon FBA Fees Canada Guide: Amazon.ca Size Tiers and Profit
        </h1>
        <p className="text-xl leading-relaxed text-muted-foreground">
          Amazon.ca margin planning breaks if you use a US calculator or forget how metric size tiers change the fee band.
        </p>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p>
          The{" "}
          <Link href="/finance/amazon-fba-canada-calculator" className="font-semibold text-primary hover:underline">
            Amazon FBA calculator Canada
          </Link>{" "}
          is built for the right size tiers and currency, which matters more than many sellers think.
        </p>
        <h2>Metric tiers change the result</h2>
        <p>
          On Amazon.ca, packaged dimensions in centimetres and weight in grams determine whether a
          product stays in a manageable fulfilment band or jumps to a more expensive one.
        </p>
        <h2>Storage and tax still matter</h2>
        <p>
          Referral fee is not enough. Storage, GST or HST on fulfilment, and aged inventory
          surcharges can turn an average product into a weak one.
        </p>
        <h2>Test the SKU before launch</h2>
        <p>
          If the margin only works in the best-case scenario, it is probably too fragile. Stress-test
          different sale prices, tax assumptions, and storage durations first.
        </p>
      </div>
    </div>
  );
}
