import Link from "next/link";
import type { Metadata } from "next";

import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

const PAGE_PATH = "/blog/wales-ltt-guide";
const PAGE_URL = absoluteUrl(PAGE_PATH);
const LAST_UPDATED_ISO = "2026-05-01T00:00:00.000Z";

export const metadata: Metadata = {
  title: "Wales LTT Guide: Standard Rates vs Higher Rates",
  description:
    "Understand Wales Land Transaction Tax, when higher rates apply, and how to estimate the tax before you exchange contracts.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Wales LTT Guide",
    description:
      "Learn how Welsh Land Transaction Tax works and when higher rates change the deal.",
    url: PAGE_URL,
    type: "article",
  },
  other: { "article:modified_time": LAST_UPDATED_ISO },
};

export default function WalesLttGuidePage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Wales LTT Guide", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">Wales LTT</li>
          </ol>
        </nav>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          Wales LTT Guide: Standard Rates vs Higher Rates
        </h1>
        <p className="text-xl leading-relaxed text-muted-foreground">
          Welsh property tax planning gets easier once you separate standard residential rates from the higher-rate scenario.
        </p>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p>
          Use the{" "}
          <Link href="/real-estate/wales-ltt-calculator" className="font-semibold text-primary hover:underline">
            Wales LTT calculator
          </Link>{" "}
          when you need the actual estimate. This guide explains why the higher-rate toggle matters so much.
        </p>
        <h2>Standard rates are not the whole story</h2>
        <p>
          Many buyers only budget for the normal main-residence bands. That works until the
          purchase falls into the higher residential rate rules, where the tax can rise quickly.
        </p>
        <h2>Where this changes decisions</h2>
        <p>
          The difference matters most when you are moving from one property to another, buying an
          additional dwelling, or comparing two acquisition structures.
        </p>
        <h2>Compare nearby systems</h2>
        <p>
          Wales is not interchangeable with Scotland or England. If you need those systems, use the{" "}
          <Link href="/real-estate/scotland-lbtt-calculator" className="font-semibold text-primary hover:underline">
            Scotland LBTT calculator
          </Link>{" "}
          or the{" "}
          <Link href="/real-estate/uk-stamp-duty-calculator" className="font-semibold text-primary hover:underline">
            UK stamp duty calculator
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
