import Link from "next/link";
import type { Metadata } from "next";

import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

const PAGE_PATH = "/blog/amazon-fba-fees-uk-guide";
const PAGE_URL = absoluteUrl(PAGE_PATH);
const LAST_UPDATED_ISO = "2026-05-01T00:00:00.000Z";

export const metadata: Metadata = {
  title: "Amazon FBA Fees UK Guide: Referral, Fulfilment, VAT, and Margin",
  description:
    "Learn how Amazon FBA fees work in the UK, including referral fees, fulfilment, VAT, storage, and break-even margin planning.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Amazon FBA Fees UK Guide",
    description:
      "A practical guide to Amazon UK seller fees, VAT, storage, and unit economics.",
    url: PAGE_URL,
    type: "article",
  },
  other: { "article:modified_time": LAST_UPDATED_ISO },
};

export default function AmazonFbaFeesUkGuidePage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Amazon FBA Fees UK Guide", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">Amazon Seller Economics</li>
          </ol>
        </nav>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          Amazon FBA Fees UK Guide: Referral, Fulfilment, VAT, and Margin
        </h1>
        <p className="text-xl leading-relaxed text-muted-foreground">
          Most FBA mistakes come from treating referral fee as the whole cost structure. It is not.
        </p>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p>
          The{" "}
          <Link href="/finance/amazon-fba-calculator-uk" className="font-semibold text-primary hover:underline">
            Amazon FBA calculator UK
          </Link>{" "}
          is the quickest way to model profitability, but the number only makes sense if you
          understand the fee layers underneath it.
        </p>
        <h2>Referral fee is only the first cut</h2>
        <p>
          Sellers often know the category percentage and stop there. Real margin depends on
          fulfilment, storage, prep, inbound shipping, and seller plan costs as well.
        </p>
        <h2>VAT can distort the picture</h2>
        <p>
          For non-VAT-registered sellers, VAT charged on Amazon fees can make an already-thin margin
          even weaker. That is why VAT treatment needs to be part of the model.
        </p>
        <h2>Use break-even logic before you source</h2>
        <p>
          Change the sale price, product cost, and size tier inputs before you commit to inventory.
          A small change in fulfilment fee or storage duration can decide whether a SKU is worth
          launching.
        </p>
      </div>
    </div>
  );
}
