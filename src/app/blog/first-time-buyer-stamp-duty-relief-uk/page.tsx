import Link from "next/link";
import { AuthorSection } from "@/components/blog/AuthorSection";
import type { Metadata } from "next";

import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

const PAGE_PATH = "/blog/first-time-buyer-stamp-duty-relief-uk";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "First-Time Buyer Stamp Duty Relief in England: Who Qualifies?",
  description:
    "Understand first-time buyer stamp duty relief in England and Northern Ireland, when it applies, and when the purchase falls back to the standard residential SDLT bands.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "First-Time Buyer Stamp Duty Relief in England",
    description:
      "A practical guide to first-time buyer SDLT relief, common disqualifiers, and when the standard residential calculation takes over.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "Does every first-time buyer get SDLT relief?",
    answer:
      "No. Relief depends on the transaction meeting the current SDLT rules, including the purchase price and buyer eligibility.",
  },
  {
    question: "What happens if the purchase does not qualify?",
    answer:
      "The transaction usually falls back to the standard residential SDLT bands instead of the relief structure.",
  },
];

export default function FirstTimeBuyerStampDutyReliefUkPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "First-Time Buyer Relief", path: PAGE_PATH },
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
            <li className="text-foreground">First-Time Buyer Relief</li>
          </ol>
        </nav>
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          First-Time Buyer
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          First-Time Buyer Stamp Duty Relief in England: Who Qualifies?
        </h1>
        <div className="pt-2">
          <AuthorSection />
          <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest mt-4 ml-1">
            <span>7 min read</span>
            <span>•</span>
            <span>Published April 2026</span>
          </div>
        </div>
        <p className="text-lg leading-8 text-muted-foreground">
          First-time buyer relief can materially reduce the SDLT bill, but only when the transaction actually qualifies.
          Buyers should test the relief route and the standard residential route before budgeting.
        </p>
      </header>

      <article className="prose prose-slate max-w-none">
        <h2>Relief is valuable, but it is conditional</h2>
        <p>
          Buyers often assume the relief is automatic because they are purchasing their first home. In practice, SDLT
          relief depends on the current eligibility rules and the purchase structure. If the deal falls outside those
          rules, the standard residential bands apply instead.
        </p>

        <h2>Why modeling both outcomes matters</h2>
        <p>
          The safest way to budget is to compare the first-time buyer route with the normal residential route. That
          makes it easier to absorb edge cases without being surprised during conveyancing.
        </p>

        <h2>Use the calculator before offer and before exchange</h2>
        <p>
          The earlier you estimate SDLT, the easier it is to judge deposit pressure, furniture budget, solicitor fees,
          and total cash to complete. Relief changes the tax bill, but the purchase still needs to work as a full
          transaction.
        </p>

        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 not-prose">
          <h3 className="text-xl font-semibold text-slate-900">Check the relief path instantly</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Use the first-time buyer option in the calculator, then compare it with the standard residential result.
          </p>
          <Link
            href="/real-estate/uk-stamp-duty-calculator"
            className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white"
          >
            Open First-Time Buyer SDLT Calculator
          </Link>
        </div>
      </article>
    </div>
  );
}
