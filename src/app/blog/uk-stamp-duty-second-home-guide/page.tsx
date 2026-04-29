import Link from "next/link";
import type { Metadata } from "next";

import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

const PAGE_PATH = "/blog/uk-stamp-duty-second-home-guide";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Second Home Stamp Duty in England: Higher Rates Explained (2026)",
  description:
    "Learn how second home stamp duty works in England and Northern Ireland, when the additional dwelling surcharge applies, and when a replacement main residence avoids it.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Second Home Stamp Duty in England: Higher Rates Explained",
    description:
      "A practical guide to additional dwelling SDLT, replacement main residence rules, and common second home edge cases.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "Do second homes pay extra stamp duty in England?",
    answer:
      "Usually yes. A second home or additional residential property will often pay the higher rates for additional dwellings on top of the standard residential SDLT bands.",
  },
  {
    question: "Does replacing my main home avoid the surcharge?",
    answer:
      "Often yes, but only if the old main residence is sold and the transaction meets the current SDLT replacement rules. Timing matters.",
  },
  {
    question: "Does buy-to-let count as an additional dwelling?",
    answer:
      "In many cases it does. Buyers who already own a home and purchase a buy-to-let property commonly fall into the additional dwelling regime.",
  },
];

export default function UKStampDutySecondHomeGuidePage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Second Home Stamp Duty Guide", path: PAGE_PATH },
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
            <li className="text-foreground">Second Home SDLT</li>
          </ol>
        </nav>
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          UK Real Estate
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Second Home Stamp Duty in England: Higher Rates Explained
        </h1>
        <p className="text-lg leading-8 text-muted-foreground">
          If you already own a residential property, your next purchase may trigger the higher rates for additional
          dwellings. This is the rule many people mean when they search for second home stamp duty.
        </p>
      </header>

      <article className="prose prose-slate max-w-none">
        <h2>The core second home question</h2>
        <p>
          The practical question is not just whether the property is a holiday home. It is whether, at completion, you
          will own more than one residential property and whether the deal qualifies as a replacement of your main
          residence. If it does not, the higher rates usually apply.
        </p>

        <h2>When the surcharge usually applies</h2>
        <p>
          Common cases include a buyer keeping their current home while purchasing another one, an investor buying a
          rental flat after already owning a residence, or a holiday-home buyer adding a second property to their
          portfolio. In all of those situations, SDLT often rises materially.
        </p>

        <h2>Replacement of a main residence is the main exception</h2>
        <p>
          Buyers moving home often avoid the surcharge if the transaction counts as a genuine replacement of their main
          residence. The timing of the sale and purchase matters, which is why many movers run the numbers both ways
          before exchange and completion.
        </p>

        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 not-prose">
          <h3 className="text-xl font-semibold text-slate-900">Run the exact SDLT scenario</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Use the calculator to compare standard residential rates against the additional dwelling path before you
            commit to the transaction structure.
          </p>
          <Link
            href="/real-estate/uk-stamp-duty-calculator"
            className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white"
          >
            Open UK Stamp Duty Calculator
          </Link>
        </div>

        <h2>Related guides</h2>
        <ul>
          <li><Link href="/blog/buy-to-let-stamp-duty-guide-uk">Buy-to-Let Stamp Duty Guide</Link></li>
          <li><Link href="/blog/first-time-buyer-stamp-duty-relief-uk">First-Time Buyer Relief Guide</Link></li>
          <li><Link href="/blog/what-is-sdlt-vs-stamp-duty">What SDLT means vs stamp duty</Link></li>
        </ul>
      </article>
    </div>
  );
}
