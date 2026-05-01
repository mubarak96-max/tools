import Link from "next/link";
import type { Metadata } from "next";

import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

const PAGE_PATH = "/blog/hong-kong-stamp-duty-guide";
const PAGE_URL = absoluteUrl(PAGE_PATH);
const LAST_UPDATED_ISO = "2026-05-01T00:00:00.000Z";

const faq = [
  {
    question: "Why is Hong Kong stamp duty hard to estimate manually?",
    answer:
      "Because the residential schedule uses stepped bands and formulas instead of one flat rate.",
  },
  {
    question: "When is a calculator more useful than a quick percentage?",
    answer:
      "When you are comparing property values near different duty bands or need a realistic budget for closing costs.",
  },
];

export const metadata: Metadata = {
  title: "Hong Kong Stamp Duty Guide: How Residential Duty Is Calculated",
  description:
    "Learn how Hong Kong residential stamp duty works, why Scale 2 matters, and how to estimate ad valorem duty before you buy.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Hong Kong Stamp Duty Guide",
    description:
      "Understand Hong Kong residential ad valorem stamp duty and why a band-based estimate matters.",
    url: PAGE_URL,
    type: "article",
  },
  other: {
    "article:modified_time": LAST_UPDATED_ISO,
  },
};

export default function HongKongStampDutyGuidePage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Hong Kong Stamp Duty Guide", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">Hong Kong Property Tax</li>
          </ol>
        </nav>
        <span className="inline-block rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-600">
          Guide · Hong Kong Real Estate
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          Hong Kong Stamp Duty Guide: How Residential Duty Is Calculated
        </h1>
        <p className="text-xl leading-relaxed text-muted-foreground">
          Hong Kong duty estimates break when people assume a single rate. The residential schedule is more technical than that.
        </p>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p>
          The easiest way to estimate a purchase is to use the{" "}
          <Link href="/real-estate/hong-kong-stamp-duty-calculator" className="font-semibold text-primary hover:underline">
            Hong Kong stamp duty calculator
          </Link>
          , because Hong Kong residential duty is not a simple flat percentage.
        </p>
        <h2>Why Scale 2 matters</h2>
        <p>
          Residential ad valorem duty moves through published bands, and some bands use formulas or
          fixed amounts. That makes back-of-the-envelope estimates unreliable.
        </p>
        <h2>Where buyers make mistakes</h2>
        <p>
          The common mistake is pricing a deal with one assumed rate and discovering later that the
          property value sits in a different part of the schedule.
        </p>
        <h2>Best workflow</h2>
        <p>
          Use the calculator first, then add legal fees and financing costs. If you are comparing
          multiple jurisdictions, review the{" "}
          <Link href="/real-estate/wales-ltt-calculator" className="font-semibold text-primary hover:underline">
            Wales LTT calculator
          </Link>{" "}
          and the{" "}
          <Link href="/real-estate/scotland-lbtt-calculator" className="font-semibold text-primary hover:underline">
            Scotland LBTT calculator
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
