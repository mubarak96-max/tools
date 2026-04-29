import Link from "next/link";
import type { Metadata } from "next";

import UKStampDutyCalculator from "@/app/real-estate/uk-stamp-duty-calculator/components/UKStampDutyCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/uk-stamp-duty-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "Does this calculator use current UK stamp duty bands?",
    answer:
      "This page uses the current residential SDLT bands for England and Northern Ireland, including first-time buyer relief rules and the main residential surcharge options.",
  },
  {
    question: "Does this work for Scotland and Wales?",
    answer:
      "No. Scotland and Wales use different property transaction taxes, so they need separate calculators. This page is specifically for SDLT in England and Northern Ireland.",
  },
  {
    question: "How does first-time buyer relief work here?",
    answer:
      "The calculator applies first-time buyer relief when the purchase qualifies under the current residential SDLT rules. If the transaction does not qualify, it falls back to the standard residential bands.",
  },
  {
    question: "Can I include the higher rates for additional dwellings?",
    answer:
      "Yes. There is a specific option for the additional dwelling surcharge, and another one for the non-UK resident surcharge.",
  },
  {
    question: "How much extra stamp duty does a second home or buy-to-let purchase pay?",
    answer:
      "Additional dwellings usually pay the higher rates for additional properties on top of the standard residential SDLT bands. That is the rule most buyers mean when they search for second home or buy-to-let stamp duty.",
  },
  {
    question: "Is SDLT the same as stamp duty?",
    answer:
      "In England and Northern Ireland, people still say stamp duty, but the tax is formally Stamp Duty Land Tax, or SDLT. The terms are often used interchangeably in search and day-to-day property conversations.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "UK Stamp Duty Calculator | SDLT for Residential, Second Home, Buy-to-Let, and First-Time Buyers",
    description:
      "Calculate current residential SDLT for England and Northern Ireland, including second home surcharge, buy-to-let rates, and first-time buyer relief.",
    path: PAGE_PATH,
  }),
  keywords: [
    "uk stamp duty calculator",
    "sdlt calculator",
    "england stamp duty calculator",
    "northern ireland sdlt calculator",
    "second home stamp duty calculator",
    "buy to let stamp duty calculator",
    "first time buyer stamp duty calculator",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "UK Stamp Duty Calculator",
    url: PAGE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "GBP",
    },
    description:
      "Free England and Northern Ireland SDLT calculator with first-time buyer relief and surcharge options.",
  };
}

export default function UKStampDutyCalculatorPage() {
  const faqJsonLd = buildFaqJsonLd(faq);
  const supportingGuides = [
    {
      title: "Second Home Stamp Duty in England",
      href: "/blog/uk-stamp-duty-second-home-guide",
      description:
        "Break down the higher rates for additional dwellings and see when a move counts as a replacement of a main residence.",
    },
    {
      title: "What SDLT Means vs Stamp Duty",
      href: "/blog/what-is-sdlt-vs-stamp-duty",
      description:
        "Clarify the difference between the legal term SDLT and the search term stamp duty for England and Northern Ireland.",
    },
    {
      title: "Residential Stamp Duty Bands",
      href: "/blog/residential-stamp-duty-rates-uk",
      description:
        "Review the core residential rate structure before surcharges, reliefs, and edge cases change the final bill.",
    },
    {
      title: "Buy-to-Let Stamp Duty Guide",
      href: "/blog/buy-to-let-stamp-duty-guide-uk",
      description:
        "Focus on additional property rules, cash-flow planning, and why many landlord purchases pay more SDLT than owner-occupier deals.",
    },
    {
      title: "First-Time Buyer Relief Explained",
      href: "/blog/first-time-buyer-stamp-duty-relief-uk",
      description:
        "Understand who qualifies, when relief stops applying, and when the purchase price pushes you back into the standard bands.",
    },
  ];

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Real Estate", path: "/real-estate" },
            { name: "UK Stamp Duty Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Real Estate"
        categoryHref="/real-estate"
        title="UK Stamp Duty Calculator"
        description="Calculate current residential SDLT for England and Northern Ireland with first-time buyer relief and surcharge options."
        faqs={faq}
        learn={
          <div className="prose prose-slate max-w-none">
            <h2>Why this UK stamp duty page is jurisdiction-specific</h2>
            <p>
              Property transaction taxes in the UK are not one national rule. England and Northern Ireland use SDLT,
              while Scotland and Wales use separate systems. This page stays accurate by covering only the SDLT jurisdiction it is built for.
            </p>
            <h2>What this calculator is built to answer</h2>
            <p>
              It is designed for the common residential purchase question: how much SDLT applies once the current bands,
              first-time buyer relief, and surcharge options are taken into account.
            </p>
            <h2>Residential SDLT bands come first</h2>
            <p>
              The starting point is always the standard residential SDLT structure for England and Northern Ireland.
              Reliefs and surcharges are layered on top of that base. That is why buyers searching for
              <strong> residential stamp duty</strong> or <strong>standard SDLT rates</strong> usually need the same
              core calculator before they branch into first-time buyer or landlord scenarios.
            </p>
            <h2>Second home and buy-to-let buyers usually need the higher rates</h2>
            <p>
              Many searches around <strong>second home stamp duty</strong>, <strong>buy-to-let stamp duty</strong>, and
              <strong> additional property SDLT</strong> are really asking the same question: does the extra surcharge
              apply? This page includes that route because it is one of the most common ways the final tax bill changes.
            </p>
            <h2>First-time buyer relief only works when the transaction qualifies</h2>
            <p>
              First-time buyer relief is valuable, but it is not automatic. The purchase price, the buyer&apos;s ownership
              history, and the nature of the property all matter. The calculator applies the relief only when the deal
              fits the current SDLT rules and otherwise falls back to the normal residential bands.
            </p>
            <h2>Why people still search for stamp duty instead of SDLT</h2>
            <p>
              Most home movers still use the phrase <strong>stamp duty</strong>, even though the formal tax name is
              <strong> Stamp Duty Land Tax</strong> or <strong>SDLT</strong>. To match how buyers actually search, this
              page covers both terms and keeps the guidance focused on the practical question: what will the tax bill be?
            </p>
            <h2>Supporting UK SDLT guides</h2>
            <div className="not-prose grid gap-4 md:grid-cols-2">
              {supportingGuides.map((guide) => (
                <Link
                  key={guide.href}
                  href={guide.href}
                  className="rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
                >
                  <h3 className="text-lg font-semibold text-slate-900">{guide.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{guide.description}</p>
                  <span className="mt-4 inline-flex text-sm font-medium text-primary">Read guide</span>
                </Link>
              ))}
            </div>
          </div>
        }
      >
        <UKStampDutyCalculator />
      </ToolPageScaffold>
    </>
  );
}
