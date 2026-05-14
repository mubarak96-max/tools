import Link from "next/link";
import { AuthorSection } from "@/components/blog/AuthorSection";
import type { Metadata } from "next";

import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

const PAGE_PATH = "/blog/what-is-sdlt-vs-stamp-duty";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "What Is SDLT? Stamp Duty vs SDLT Explained for Home Buyers",
  description:
    "Understand the difference between stamp duty and SDLT in England and Northern Ireland, and why buyers still search the older phrase even when the legal term is SDLT.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "What Is SDLT? Stamp Duty vs SDLT Explained",
    description:
      "A plain-English explanation of SDLT, why the stamp duty label survives, and which UK jurisdictions use different property taxes.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "Is SDLT the same as stamp duty?",
    answer:
      "For England and Northern Ireland residential property searches, yes in practice. People say stamp duty, but the formal tax name is Stamp Duty Land Tax, or SDLT.",
  },
  {
    question: "Does Scotland use SDLT?",
    answer:
      "No. Scotland uses Land and Buildings Transaction Tax, while Wales uses Land Transaction Tax.",
  },
];

export default function WhatIsSdltVsStampDutyPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "What Is SDLT", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <header className="mb-10 space-y-4">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
            <li>/</li>
            <li className="text-foreground">What Is SDLT</li>
          </ol>
        </nav>
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          SDLT Basics
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          What Is SDLT? Stamp Duty vs SDLT Explained for Home Buyers
        </h1>
        <div className="pt-2">
          <AuthorSection />
          <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest mt-4 ml-1">
            <span>6 min read</span>
            <span>•</span>
            <span>Published January 2026</span>
          </div>
        </div>
        <p className="text-lg leading-8 text-muted-foreground">
          Buyers still search for stamp duty because it is the familiar label, but in England and Northern Ireland the
          tax is formally called Stamp Duty Land Tax, or SDLT.
        </p>
      </header>

      <article className="prose prose-slate max-w-none">
        <h2>Why the names are used interchangeably</h2>
        <p>
          The older phrase stamp duty survived in everyday conversation, estate-agent language, and search behavior. The
          formal legislation and modern conveyancing process use SDLT. For search intent, both terms usually point to
          the same calculator and the same residential property tax rules.
        </p>

        <h2>Where SDLT applies</h2>
        <p>
          SDLT applies in England and Northern Ireland. Scotland and Wales use separate systems, so a UK-wide search
          can easily confuse buyers if the page does not clearly state the jurisdiction.
        </p>

        <h2>Why this matters for ranking and user trust</h2>
        <p>
          People search in different ways: <strong>stamp duty calculator</strong>, <strong>SDLT calculator</strong>,
          <strong> England stamp duty</strong>, and <strong>residential SDLT</strong>. A strong page should explain the
          language difference while keeping the calculation logic anchored to the right jurisdiction.
        </p>

        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 not-prose">
          <h3 className="text-xl font-semibold text-slate-900">Need the actual calculation?</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Use the SDLT calculator for England and Northern Ireland, including first-time buyer relief and additional
            dwelling surcharges.
          </p>
          <Link
            href="/real-estate/uk-stamp-duty-calculator"
            className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white"
          >
            Open SDLT Calculator
          </Link>
        </div>
      </article>
    </div>
  );
}
