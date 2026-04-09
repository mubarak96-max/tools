import type { Metadata } from "next";

import SecurityDepositCalculator from "@/app/real-estate/security-deposit-calculator/components/SecurityDepositCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/security-deposit-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How much security deposit should I expect to pay?",
    answer:
      "It depends on the market and the lease terms. Some rentals ask for one month of rent, while others require more, especially where furnished units or commercial spaces are involved.",
  },
  {
    question: "Is the security deposit the same as advance rent?",
    answer:
      "No. The security deposit is usually refundable subject to the lease terms, while advance rent is money paid toward the tenancy itself. Both affect move-in cash, but they serve different purposes.",
  },
  {
    question: "Why is the move-in cost higher than one month of rent?",
    answer:
      "Because tenants often need to pay the deposit, rent in advance, and extra admin or move-in fees at the same time. This calculator combines them so the upfront cash picture is clearer.",
  },
  {
    question: "Can I use this for residential and commercial spaces?",
    answer:
      "Yes. The calculation is flexible enough for either case as long as you know the rent multiple used for the deposit and any upfront fees or advance rent.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Security Deposit Calculator | Estimate Deposit and Move-In Cash",
    description:
      "Estimate security deposit, advance rent, and total move-in cash from monthly rent and upfront fees.",
    path: PAGE_PATH,
  }),
  keywords: [
    "security deposit calculator",
    "move in cost calculator",
    "rent deposit calculator",
    "advance rent calculator",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Security Deposit Calculator",
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
      "Free security deposit calculator for deposit amount, advance rent, and total move-in cash.",
  };
}

export default function SecurityDepositCalculatorPage() {
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Real Estate", path: "/real-estate" },
            { name: "Security Deposit Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Real Estate"
        categoryHref="/real-estate"
        title="Security Deposit Calculator"
        description="Estimate the security deposit, advance rent, and total move-in cash before you commit to a rental."
        faqs={faq}
        learn={
          <div className="prose prose-slate max-w-none">
            <h2>Why renters underestimate move-in cash</h2>
            <p>
              The monthly rent is easy to remember, so it tends to dominate the decision. The real strain often comes
              from the upfront cash stack: deposit, rent in advance, and the smaller fees that still need to be paid at once.
            </p>
            <h2>What this calculator is designed to clarify</h2>
            <p>
              This page turns those separate lines into one move-in figure so you can plan the actual cash requirement,
              not just the ongoing monthly payment.
            </p>
            <h2>Use it before you start viewing rentals seriously</h2>
            <p>
              Knowing the move-in number early helps you filter listings faster. It also makes it easier to judge whether
              a rental that looks affordable month to month is still realistic upfront.
            </p>
          </div>
        }
      >
        <SecurityDepositCalculator />
      </ToolPageScaffold>
    </>
  );
}
