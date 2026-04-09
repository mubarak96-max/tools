import type { Metadata } from "next";

import MortgageRefinanceCalculator from "@/app/real-estate/mortgage-refinance-calculator/components/MortgageRefinanceCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/mortgage-refinance-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "When does refinancing a mortgage make sense?",
    answer:
      "It usually makes sense when the new loan lowers the payment enough, or reduces the total cost enough, to justify the refinancing fees and the time you expect to stay in the property.",
  },
  {
    question: "What is the break-even point on a refinance?",
    answer:
      "The break-even point is how long it takes the monthly savings from the new loan to recover the refinance costs. If you are likely to sell or move before that point, the refinance may be harder to justify.",
  },
  {
    question: "Can a refinance lower my monthly payment but cost more overall?",
    answer:
      "Yes. Extending the loan term can reduce the payment while increasing the total amount paid across the life of the loan. That is why it helps to look at both the monthly savings and the total remaining cost.",
  },
  {
    question: "Which costs should I include in refinance fees?",
    answer:
      "Include lender fees, legal costs, valuation or appraisal charges, filing costs, and other expenses directly tied to replacing the old loan with the new one.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Mortgage Refinance Calculator | Payment Savings and Break-Even Calculator",
    description:
      "Compare current and refinanced mortgage payments, total remaining cost, and break-even timing.",
    path: PAGE_PATH,
  }),
  keywords: [
    "mortgage refinance calculator",
    "refinance break even calculator",
    "should i refinance calculator",
    "mortgage payment savings calculator",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Mortgage Refinance Calculator",
    url: PAGE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Free mortgage refinance calculator for payment comparison, break-even timing, and total remaining cost.",
  };
}

export default function MortgageRefinanceCalculatorPage() {
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Real Estate", path: "/real-estate" },
            { name: "Mortgage Refinance Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Real Estate"
        categoryHref="/real-estate"
        title="Mortgage Refinance Calculator"
        description="Compare a current mortgage with a refinanced loan and see the payment gap, break-even point, and estimated cost difference."
        faqs={faq}
        learn={
          <div className="prose prose-slate max-w-none">
            <h2>Refinance decisions are usually about timing, not just rate</h2>
            <p>
              The headline rate matters, but the real decision often depends on how long you plan to keep the home and
              whether the refinance costs can be recovered in that time.
            </p>
            <h2>Why monthly savings can be misleading on their own</h2>
            <p>
              A lower payment can feel like a clear win, yet still cost more overall if the loan is stretched over a
              longer term. This is why the monthly result and the total remaining cost need to be viewed together.
            </p>
            <h2>Use this page to screen options before you shop lenders</h2>
            <p>
              This calculator is built for the early decision: whether a refinance is even worth exploring. Once it
              looks promising, the next step is to compare real loan quotes and exact fees.
            </p>
          </div>
        }
      >
        <MortgageRefinanceCalculator />
      </ToolPageScaffold>
    </>
  );
}
