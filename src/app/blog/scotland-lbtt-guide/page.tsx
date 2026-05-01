import Link from "next/link";
import type { Metadata } from "next";

import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

const PAGE_PATH = "/blog/scotland-lbtt-guide";
const PAGE_URL = absoluteUrl(PAGE_PATH);
const LAST_UPDATED_ISO = "2026-05-01T00:00:00.000Z";

export const metadata: Metadata = {
  title: "Scotland LBTT Guide: First-Time Buyer Relief and ADS",
  description:
    "Learn how Scotland LBTT works, when the Additional Dwelling Supplement applies, and how to estimate your tax before buying.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Scotland LBTT Guide",
    description:
      "Understand Scottish LBTT, first-time buyer relief, and Additional Dwelling Supplement rules.",
    url: PAGE_URL,
    type: "article",
  },
  other: { "article:modified_time": LAST_UPDATED_ISO },
};

export default function ScotlandLbttGuidePage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Scotland LBTT Guide", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">Scotland LBTT</li>
          </ol>
        </nav>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          Scotland LBTT Guide: First-Time Buyer Relief and ADS
        </h1>
        <p className="text-xl leading-relaxed text-muted-foreground">
          Scottish purchase tax becomes clearer once you separate standard LBTT from first-time buyer relief and the additional dwelling surcharge.
        </p>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p>
          The{" "}
          <Link href="/real-estate/scotland-lbtt-calculator" className="font-semibold text-primary hover:underline">
            Scotland LBTT calculator
          </Link>{" "}
          is the fastest way to estimate the number, but buyers still need to understand why the
          result changes between scenarios.
        </p>
        <h2>First-time buyer relief matters at the margin</h2>
        <p>
          A qualifying first-time buyer may benefit from a different nil-rate structure than a
          repeat buyer, which means two similar transactions can land at different effective tax
          levels.
        </p>
        <h2>ADS is usually the biggest swing factor</h2>
        <p>
          Once the purchase counts as an additional dwelling, the surcharge can change the total
          cash required materially. That is the first scenario to model before exchange.
        </p>
        <h2>Use the right jurisdiction</h2>
        <p>
          Scotland does not use the same property tax as Wales or England. For those, compare the{" "}
          <Link href="/real-estate/wales-ltt-calculator" className="font-semibold text-primary hover:underline">
            Wales LTT calculator
          </Link>{" "}
          and the{" "}
          <Link href="/real-estate/uk-stamp-duty-calculator" className="font-semibold text-primary hover:underline">
            UK stamp duty calculator
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
