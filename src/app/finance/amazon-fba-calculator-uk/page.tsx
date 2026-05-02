import Link from "next/link";
import type { Metadata } from "next";

import AmazonFbaCalculator from "@/components/AmazonFbaCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/amazon-fba-calculator-uk";
const PAGE_URL = absoluteUrl(PAGE_PATH);
const LAST_UPDATED_ISO = "2026-05-01T00:00:00.000Z";

const faq = [
  {
    question: "What fees does this Amazon FBA calculator UK include?",
    answer:
      "It helps you model referral fees, FBA fulfilment fees, storage, seller plan costs, and your own unit economics such as cost of goods, prep, and inbound shipping.",
  },
  {
    question: "Does VAT matter when calculating Amazon UK profitability?",
    answer:
      "Yes. VAT can materially change your true margin, especially for non-VAT-registered sellers who cannot reclaim VAT charged on Amazon's fees.",
  },
  {
    question: "Can I compare FBA with merchant fulfilled orders?",
    answer:
      "Yes. Set the FBA-specific costs to zero and move your own shipping and fulfilment costs into the editable cost fields to model a merchant fulfilled scenario.",
  },
  {
    question: "What is a healthy FBA margin in the UK?",
    answer:
      "Many sellers target at least 20% to 30% net margin after all Amazon and product costs, because lower margins become fragile when fees, ads, or supplier costs rise.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Amazon FBA Calculator UK | Fees, Profit and ROI Estimator",
    description:
      "Calculate Amazon UK referral fees, FBA fulfilment, storage, VAT impact, and net profit per unit. Model your Amazon FBA margins before you source inventory.",
    path: PAGE_PATH,
  }),
  keywords: [
    "amazon fba calculator uk",
    "amazon seller fees calculator uk",
    "amazon profit calculator uk",
    "amazon fba fees uk",
    "amazon referral fee calculator uk",
    "amazon fba roi calculator uk",
  ],
  openGraph: {
    title: "Amazon FBA Calculator UK",
    description:
      "Estimate Amazon UK seller fees, VAT impact, profit, and ROI before you launch or restock a product.",
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
    name: "Amazon FBA Calculator UK",
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
      "Free Amazon FBA calculator UK for seller fees, VAT, profit margin, and ROI planning.",
  };
}

export default function AmazonFbaCalculatorUkPage() {
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Finance", path: "/finance" },
            { name: "Amazon FBA Calculator UK", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Finance"
        categoryHref="/finance"
        title="Amazon FBA Calculator UK"
        description="Calculate Amazon UK referral fees, FBA fulfilment, storage, VAT impact, and net profit per unit."
        faqs={faq}
        learn={
          <div className="prose prose-slate max-w-none">
            <p className="text-sm font-medium text-slate-500">Last updated: May 2026</p>

            <h2>Why UK FBA margin math gets missed</h2>
            <p>
              New sellers usually focus on the visible referral fee and forget that net margin is
              squeezed by fulfilment fees, storage, inbound shipping, prep, seller plan costs, and
              VAT treatment. A product that looks profitable at first glance can become weak once the
              full stack is included.
            </p>

            <h2>How to use this calculator well</h2>
            <ul>
              <li>Model your net profit before ordering inventory.</li>
              <li>Stress-test different sale prices and cost prices.</li>
              <li>Compare FBA economics with a merchant fulfilled setup.</li>
              <li>See whether your margin still works after VAT and storage are added.</li>
            </ul>

            <h2>Worked example</h2>
            <p>
              A small consumer product with a healthy gross spread can still disappoint if the size
              tier pushes fulfilment fees up or if months of storage accumulate before Q4. Use the
              calculator to test those scenarios before committing to a purchase order.
            </p>

            <h2>Related calculators</h2>
            <p>
              If you also sell on
              Amazon.ca, compare with the{" "}
              <Link href="/finance/amazon-fba-canada-calculator">
                Amazon FBA calculator Canada
              </Link>
              .
            </p>
          </div>
        }
      >
        <AmazonFbaCalculator />
      </ToolPageScaffold>
    </>
  );
}
