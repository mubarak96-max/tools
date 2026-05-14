import Link from "next/link";
import { AuthorSection } from "@/components/blog/AuthorSection";
import type { Metadata } from "next";

import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

const PAGE_PATH = "/blog/buy-to-let-stamp-duty-guide-uk";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Buy-to-Let Stamp Duty in England: SDLT Guide for Landlords",
  description:
    "See how buy-to-let stamp duty works in England and Northern Ireland, why landlords often pay the additional property surcharge, and how to model the true upfront cost.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Buy-to-Let Stamp Duty in England",
    description:
      "A landlord-focused guide to SDLT, additional dwelling surcharges, and the upfront tax burden on buy-to-let purchases.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "Does buy-to-let pay higher stamp duty?",
    answer:
      "In many cases yes. If the landlord already owns a residential property, the purchase often falls into the higher rates for additional dwellings.",
  },
  {
    question: "Should landlords still compare the standard residential amount?",
    answer:
      "Yes. It helps isolate how much the additional property rule is adding to the deal and improves cash-flow planning before completion.",
  },
];

export default function BuyToLetStampDutyGuideUkPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Buy-to-Let Stamp Duty Guide", path: PAGE_PATH },
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
            <li className="text-foreground">Buy-to-Let SDLT</li>
          </ol>
        </nav>
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          Landlord Guide
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Buy-to-Let Stamp Duty in England: SDLT Guide for Landlords
        </h1>
        <div className="pt-2">
          <AuthorSection />
          <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest mt-4 ml-1">
            <span>8 min read</span>
            <span>•</span>
            <span>Published April 2026</span>
          </div>
        </div>
        <p className="text-lg leading-8 text-muted-foreground">
          Buy-to-let deals are often judged on yield, rent, and financing, but the SDLT bill is one of the first major
          cash drains in the whole investment stack.
        </p>
      </header>

      <article className="prose prose-slate max-w-none">
        <h2>Why buy-to-let buyers often pay more upfront tax</h2>
        <p>
          Many landlords already own a residence, so their next purchase is treated as an additional dwelling rather
          than a standard owner-occupier move. That can push SDLT materially higher before renovation, furnishing, or
          mortgage fees even enter the picture.
        </p>

        <h2>Cash-flow planning matters more than just yield</h2>
        <p>
          Two properties with similar rental yields can create very different upfront capital requirements once SDLT is
          included. That is why investors should model the tax bill before they finalize offer strategy or leverage.
        </p>

        <h2>Run the buy-to-let path against the standard path</h2>
        <p>
          Even when the surcharge clearly applies, comparing the landlord path with the standard residential path shows
          exactly how much the additional-property rule is costing you. That makes portfolio decisions easier to stress
          test.
        </p>

        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 not-prose">
          <h3 className="text-xl font-semibold text-slate-900">Estimate buy-to-let SDLT now</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Use the calculator with the additional dwelling option enabled to model the likely landlord purchase route.
          </p>
          <Link
            href="/real-estate/uk-stamp-duty-calculator"
            className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white"
          >
            Open Buy-to-Let SDLT Calculator
          </Link>
        </div>
      </article>
    </div>
  );
}
