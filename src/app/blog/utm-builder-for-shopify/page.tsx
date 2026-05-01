import Link from "next/link";
import type { Metadata } from "next";

import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

const PAGE_PATH = "/blog/utm-builder-for-shopify";
const PAGE_URL = absoluteUrl(PAGE_PATH);
const LAST_UPDATED_ISO = "2026-05-01T00:00:00.000Z";

const faq = [
  {
    question: "Which Shopify URLs should get UTM parameters?",
    answer:
      "Tag external campaign links to product pages, collections, landing pages, and promotional flows. Do not add UTM tags to internal navigation.",
  },
  {
    question: "What source and medium values work well for Shopify?",
    answer:
      "Use consistent values such as instagram and paid_social, or klaviyo and email, so GA4 and Shopify reports can be reconciled more cleanly.",
  },
];

export const metadata: Metadata = {
  title: "UTM Builder for Shopify: How to Tag Product and Campaign Links",
  description:
    "Learn how Shopify stores should use a UTM builder for product pages, collection pages, email campaigns, paid social, and GA4 attribution.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "UTM Builder for Shopify",
    description:
      "A practical guide to tagging Shopify campaign URLs for GA4, email, paid social, and product launches.",
    url: PAGE_URL,
    type: "article",
  },
  other: { "article:modified_time": LAST_UPDATED_ISO },
};

export default function UtmBuilderForShopifyPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "UTM Builder for Shopify", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">Shopify Analytics</li>
          </ol>
        </nav>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          UTM Builder for Shopify: How to Tag Product and Campaign Links
        </h1>
        <p className="text-xl leading-relaxed text-muted-foreground">
          Shopify attribution gets cleaner when every external campaign URL is tagged before launch instead of fixed after the report is already broken.
        </p>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p>
          The{" "}
          <Link href="/utility/utm-builder" className="font-semibold text-primary hover:underline">
            UTM Builder
          </Link>{" "}
          is a good fit for Shopify stores because you often need to tag many product, collection,
          and landing-page links quickly.
        </p>
        <h2>What to tag</h2>
        <p>
          Tag external traffic sources only: email campaigns, influencer placements, paid social,
          paid search, affiliates, and launch pages. Do not use UTM parameters on internal site
          links or navigation.
        </p>
        <h2>Keep naming consistent</h2>
        <p>
          Use a fixed source and medium system. For example, `klaviyo` with `email`, or
          `instagram` with `paid_social`. Clean naming is what makes GA4 acquisition reports usable
          later.
        </p>
        <h2>Best workflow</h2>
        <p>
          Build the URL, test the final redirect, publish it, then review the campaign in GA4. If
          you need help reading the report afterward, use our{" "}
          <Link href="/blog/how-to-read-utm-reports-ga4" className="font-semibold text-primary hover:underline">
            GA4 reporting guide
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
