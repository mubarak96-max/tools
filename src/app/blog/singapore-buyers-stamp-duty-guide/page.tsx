import Link from "next/link";
import type { Metadata } from "next";

import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

const PAGE_PATH = "/blog/singapore-buyers-stamp-duty-guide";
const PAGE_URL = absoluteUrl(PAGE_PATH);
const LAST_UPDATED_ISO = "2026-05-01T00:00:00.000Z";

const faq = [
  {
    question: "What is the difference between BSD and ABSD in Singapore?",
    answer:
      "BSD is the standard progressive duty on the property value, while ABSD is an extra layer that depends on buyer profile and existing residential ownership.",
  },
  {
    question: "Why does buyer profile change the tax so much?",
    answer:
      "Because Singapore uses different ABSD rates for citizens, permanent residents, foreigners, and entities, and those rates also change depending on how many residential properties are already owned.",
  },
  {
    question: "When should I calculate BSD and ABSD?",
    answer:
      "Before you make an offer, especially if you are comparing purchase structures or deciding whether the deal still works after stamp duty is added.",
  },
];

export const metadata: Metadata = {
  title: "Singapore Buyer's Stamp Duty Guide: BSD and ABSD Explained",
  description:
    "Understand Singapore buyer's stamp duty with a practical guide to BSD, ABSD, worked examples, and how to estimate your total upfront property tax.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Singapore Buyer's Stamp Duty Guide",
    description:
      "A practical guide to BSD, ABSD, buyer profiles, and upfront property tax planning in Singapore.",
    url: PAGE_URL,
    type: "article",
  },
  other: {
    "article:modified_time": LAST_UPDATED_ISO,
  },
};

export default function SingaporeBuyersStampDutyGuidePage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Singapore Buyer's Stamp Duty Guide", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Singapore Buyer's Stamp Duty Guide: BSD and ABSD Explained",
    description:
      "Understand Singapore buyer's stamp duty with a practical guide to BSD, ABSD, worked examples, and how to estimate your total upfront property tax.",
    datePublished: LAST_UPDATED_ISO,
    dateModified: LAST_UPDATED_ISO,
    mainEntityOfPage: PAGE_URL,
    author: { "@type": "Organization", name: "FindBest Tools" },
    publisher: { "@type": "Organization", name: "FindBest Tools" },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <JsonLd data={serializeJsonLd(articleJsonLd)} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <header className="mb-12 space-y-4">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/">Home</Link></li>
            <li>/</li>
            <li><Link href="/blog">Blog</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">Singapore Property Tax</li>
          </ol>
        </nav>
        <span className="inline-block rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-600">
          Guide · Singapore Real Estate
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          Singapore Buyer's Stamp Duty Guide: BSD and ABSD Explained
        </h1>
        <p className="text-xl leading-relaxed text-muted-foreground">
          The real question is not whether stamp duty applies. It is how much ABSD changes the deal once buyer profile and ownership count are factored in.
        </p>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p>
          Singapore buyers usually need to model two taxes at the same time: BSD and ABSD. The{" "}
          <Link href="/real-estate/singapore-buyers-stamp-duty-calculator" className="font-semibold text-primary hover:underline">
            Singapore buyer's stamp duty calculator
          </Link>{" "}
          is the fastest way to compare scenarios, but it helps to understand what is driving the number first.
        </p>

        <h2>BSD is the base layer</h2>
        <p>
          BSD is the standard progressive duty that applies to the purchase. As the property value
          rises, different portions of the price are taxed at different rates.
        </p>

        <h2>ABSD is where the bill can jump</h2>
        <p>
          ABSD is the reason a similar property can have radically different closing costs for two
          buyers. Residency status and existing residential ownership are the main drivers.
        </p>

        <h2>Worked example</h2>
        <p>
          A citizen buying a first home may only pay BSD. A citizen buying a second property adds
          ABSD on top. A foreign buyer may face a much larger ABSD charge on the same purchase
          price. That is why modelling buyer profile before offer stage matters.
        </p>

        <h2>Best workflow</h2>
        <p>
          Estimate the tax first, then compare it with legal fees, down payment, and financing
          costs. If you are also planning the exit side of the transaction, review the{" "}
          <Link href="/real-estate/singapore-sellers-stamp-duty-calculator" className="font-semibold text-primary hover:underline">
            Singapore seller's stamp duty calculator
          </Link>
          .
        </p>

        <section className="rounded-[2rem] border border-border bg-card p-8">
          <h2 className="mt-0">Run the calculation</h2>
          <p className="mb-6 text-muted-foreground">
            Compare buyer profiles and total duty in one place before you commit to the purchase structure.
          </p>
          <Link
            href="/real-estate/singapore-buyers-stamp-duty-calculator"
            className="inline-flex rounded-xl bg-primary px-6 py-3 font-semibold text-white no-underline"
          >
            Open Singapore Buyer's Stamp Duty Calculator
          </Link>
        </section>
      </div>
    </div>
  );
}
