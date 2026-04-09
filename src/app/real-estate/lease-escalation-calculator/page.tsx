import type { Metadata } from "next";

import LeaseEscalationCalculator from "@/app/real-estate/lease-escalation-calculator/components/LeaseEscalationCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ToolPageScaffold from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/real-estate/lease-escalation-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is lease escalation?",
    answer:
      "Lease escalation is the planned increase in rent over time written into the lease. It is often expressed as an annual percentage or another recurring increase pattern across the term.",
  },
  {
    question: "Why does escalation matter when comparing lease offers?",
    answer:
      "Two lease offers can start at similar rent levels but diverge sharply over time if one includes stronger annual increases. Looking at only the first year's rent hides that difference.",
  },
  {
    question: "Does this calculator work for commercial and residential leases?",
    answer:
      "Yes. The math is the same for either case. The main requirement is knowing the starting rent, the annual increase percentage, and the length of the term.",
  },
  {
    question: "Can I use this for a lease review before signing?",
    answer:
      "Yes. It is useful for turning a lease clause into a full year-by-year rent picture before you commit to the agreement.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Lease Escalation Calculator | Project Rent Increases Across a Lease Term",
    description:
      "Project year-by-year rent increases from a starting monthly rent, annual escalation percentage, and lease term.",
    path: PAGE_PATH,
  }),
  keywords: [
    "lease escalation calculator",
    "rent escalation calculator",
    "lease increase calculator",
    "commercial lease escalation calculator",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Lease Escalation Calculator",
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
      "Free lease escalation calculator for projecting rent increases across a lease term.",
  };
}

export default function LeaseEscalationCalculatorPage() {
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Real Estate", path: "/real-estate" },
            { name: "Lease Escalation Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Real Estate"
        categoryHref="/real-estate"
        title="Lease Escalation Calculator"
        description="Project rent increases across the full lease term so you can compare lease offers on the total cost, not just the starting year."
        faqs={faq}
        learn={
          <div className="prose prose-slate max-w-none">
            <h2>Why the first-year rent is rarely the full story</h2>
            <p>
              Lease negotiations often focus on the starting rent because it is the easiest number to compare. The real
              cost, though, depends on what happens after the first year once the escalation clause starts compounding.
            </p>
            <h2>What this page helps you see quickly</h2>
            <p>
              This calculator turns a simple annual increase clause into a schedule you can actually review. That makes
              it easier to compare two lease offers or test the long-term impact of a rent negotiation.
            </p>
            <h2>Use the schedule in negotiation, not only after signing</h2>
            <p>
              A lease escalation calculator is most useful before the agreement is final. Once you see the total rent
              difference across the term, small percentage changes can look much more meaningful.
            </p>
          </div>
        }
      >
        <LeaseEscalationCalculator />
      </ToolPageScaffold>
    </>
  );
}
