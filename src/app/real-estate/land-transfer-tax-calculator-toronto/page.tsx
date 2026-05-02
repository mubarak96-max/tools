import Link from "next/link";
import type { Metadata } from "next";

import LttCalculator from "@/components/LttCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/land-transfer-tax-calculator-toronto";
const PAGE_URL = absoluteUrl(PAGE_PATH);
const LAST_UPDATED_ISO = "2026-05-01T00:00:00.000Z";

const faq = [
  {
    question: "Does this calculator include both Ontario LTT and Toronto MLTT?",
    answer:
      "Yes. The calculator estimates Ontario land transfer tax and, when the property is inside Toronto, the Toronto municipal land transfer tax as well.",
  },
  {
    question: "Does it account for first-time buyer rebates?",
    answer:
      "Yes. It lets you model Ontario and Toronto first-time buyer rebate scenarios, including shared ownership cases where the rebate may be reduced.",
  },
  {
    question: "Does NRST apply here?",
    answer:
      "Yes. If you toggle the non-resident buyer scenario for a residential purchase, the calculator adds Ontario's Non-Resident Speculation Tax on top of the transfer taxes.",
  },
  {
    question: "Can I use this for homes outside Toronto?",
    answer:
      "Yes. Switch the location to the rest of Ontario to estimate provincial land transfer tax without the Toronto municipal layer.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Toronto Land Transfer Tax Calculator | Ontario LTT and MLTT",
    description:
      "Calculate Ontario land transfer tax and Toronto municipal land transfer tax with first-time buyer rebates and NRST scenarios for 2026 budgeting.",
    path: PAGE_PATH,
  }),
  keywords: [
    "toronto land transfer tax calculator",
    "land transfer tax calculator toronto",
    "ontario land transfer tax calculator",
    "toronto mltt calculator",
    "toronto first time buyer land transfer tax rebate",
    "ontario nrst calculator",
  ],
  openGraph: {
    title: "Toronto Land Transfer Tax Calculator",
    description:
      "Estimate Ontario LTT, Toronto MLTT, first-time buyer rebates, and NRST for Toronto property purchases.",
    url: PAGE_URL,
    type: "website",
  },
  other: {
    "article:modified_time": LAST_UPDATED_ISO,
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Toronto Land Transfer Tax Calculator",
    url: PAGE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "CAD",
    },
    description:
      "Free Toronto land transfer tax calculator for Ontario LTT, Toronto MLTT, first-time buyer rebates, and NRST.",
  };
}

export default function TorontoLandTransferTaxPage() {
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Real Estate", path: "/real-estate" },
            { name: "Toronto Land Transfer Tax Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Real Estate"
        categoryHref="/real-estate"
        title="Toronto Land Transfer Tax Calculator"
        description="Calculate Ontario land transfer tax and Toronto municipal land transfer tax with first-time buyer rebates and NRST scenarios."
        faqs={faq}
        learn={
          <div className="prose prose-slate max-w-none">
            <p className="text-sm font-medium text-slate-500">Last updated: May 2026</p>

            <h2>Why Toronto buyers need a separate calculator</h2>
            <p>
              Buyers inside Toronto often face two land transfer taxes on the same purchase: the
              Ontario provincial tax and the Toronto municipal tax. That makes Toronto closing costs
              materially different from a purchase in Mississauga, Vaughan, or another Ontario city.
            </p>

            <h2>What this calculator models</h2>
            <ul>
              <li>Ontario LTT for Toronto and the rest of Ontario.</li>
              <li>Toronto MLTT for purchases inside city boundaries.</li>
              <li>First-time buyer rebate scenarios, including partial ownership cases.</li>
              <li>NRST for qualifying non-resident residential purchases.</li>
            </ul>

            <h2>Worked example</h2>
            <p>
              A buyer looking at a home in Toronto can compare the full tax stack against the same
              purchase price outside Toronto. That makes the calculator useful for location
              comparisons as well as first-time buyer budgeting.
            </p>

            <h2>Related calculators</h2>
            <p>
              You can also compare broader affordability with{" "}
              <Link href="/real-estate/mortgage-qualifier-canada">Mortgage Qualifier Canada</Link>{" "}
              or review other property tax pages in{" "}
              <Link href="/real-estate">our real estate tools hub</Link>.
            </p>
          </div>
        }
      >
        <LttCalculator />
      </ToolPageScaffold>
    </>
  );
}
