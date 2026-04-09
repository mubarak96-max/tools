import Link from "next/link";
import type { Metadata } from "next";

import UAEVisaCostCalculator from "@/app/finance/uae-visa-cost-calculator/components/UAEVisaCostCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/uae-visa-cost-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What does the UAE government visa fee cover?",
    answer:
      "Government fees (charged by ICP or GDRFA) cover the entry permit and/or residence visa stamping. They vary by visa type, duration, and whether you are applying from inside or outside the UAE.",
  },
  {
    question: "What is the status change fee?",
    answer:
      "If you are already inside the UAE when you apply for a new residence visa, an additional in-country status change fee of approximately AED 1,400–1,600 applies. This is separate from the main government fee.",
  },
  {
    question: "Is the medical fitness test mandatory?",
    answer:
      "Yes, for any residence visa (employment, Green, Golden, or investor) a medical fitness test — blood test and chest X-ray — is required. Standard processing costs roughly AED 300–350; urgent same-day results cost AED 650–800.",
  },
  {
    question: "How much does Emirates ID cost?",
    answer:
      "Emirates ID fees depend on validity: 1 year ≈ AED 170, 2 years ≈ AED 220, 3 years ≈ AED 270, and 4–10 years ≈ AED 370. The validity is linked to your residence visa duration.",
  },
  {
    question: "What is a typing / service centre fee?",
    answer:
      "Typing centres or PRO services charge for submitting and processing visa applications on your behalf. Fees typically range from AED 150 to AED 350 and can vary by emirate, application type, and urgency.",
  },
  {
    question: "Is this calculator accurate?",
    answer:
      "The figures are market averages for 2024–2025 based on ICP and GDRFA published schedules. Government fees are subject to change, and medical / typing fees vary by provider. Always confirm costs with an official PRO service or typing centre before applying.",
  },
];

export const metadata: Metadata = {
  title: "UAE Visa Cost Calculator | Employment, Visit & Golden Visa Fees",
  description:
    "Estimate UAE visa costs for tourist, employment, Green, and Golden visas. Includes government fees, status change, medical, Emirates ID, and typing fees.",
  keywords: [
    "UAE visa cost calculator",
    "Dubai visa cost",
    "UAE employment visa fees",
    "golden visa UAE cost",
    "green visa UAE fees",
    "UAE visa calculator 2025",
    "emirates ID fee",
    "UAE residence visa cost",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "UAE Visa Cost Calculator",
    description:
      "Estimate UAE visa costs across tourist, employment, Green, and Golden visa categories.",
  },
  twitter: {
    card: "summary_large_image",
    title: "UAE Visa Cost Calculator",
    description:
      "Estimate government fees, medical, Emirates ID, and service costs for UAE visas.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "UAE Visa Cost Calculator",
    url: PAGE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "AED",
    },
    description:
      "Free UAE visa cost estimator covering government fees, status change, medical fitness, Emirates ID, and typing centre fees for all major visa types.",
    featureList: [
      "Tourist and visit visa cost estimate",
      "Employment residence visa fees",
      "Green Visa (5-year) cost breakdown",
      "Golden Visa (10-year) cost breakdown",
      "Status change (inside UAE) fee",
      "Medical fitness and Emirates ID fees",
    ],
  };
}

export default function UAEVisaCostCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "UAE Visa Cost Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/finance" className="hover:text-primary">Finance</Link></li>
            <li>/</li>
            <li className="text-foreground">UAE Visa Cost Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Finance calculator
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            UAE Visa Cost Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Estimate the total cost of any UAE visa — from a 30-day tourist visit to a 10-year Golden Visa.
            Covers government fees, status change, medical fitness, Emirates ID, and typing centre charges.
          </p>
        </div>
      </section>

      <UAEVisaCostCalculator />

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">What makes up UAE visa costs?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            UAE visa fees are not a single number — they include several components that add up to the total
            you will need to pay before or during the application process.
          </p>

          <h2 className="mt-8 text-xl font-semibold tracking-tight text-foreground">Key fee components</h2>
          <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
            <li>
              <strong className="text-foreground">Government / ICP fee</strong> — The core charge set by the
              Immigration and Citizenship Authority (ICP) or GDRFA. This varies by visa type and duration.
            </li>
            <li>
              <strong className="text-foreground">Status change fee</strong> — If you are already inside the UAE
              when you apply, an extra charge (~AED 1,400–1,600) applies for in-country status change.
            </li>
            <li>
              <strong className="text-foreground">Medical fitness test</strong> — Mandatory for all residence visas.
              Includes a blood test and chest X-ray. Standard processing costs ~AED 300–350; urgent results cost ~AED 650–800.
            </li>
            <li>
              <strong className="text-foreground">Emirates ID</strong> — Required for all UAE residents. The fee
              depends on the validity period (1–10 years).
            </li>
            <li>
              <strong className="text-foreground">Typing / service centre</strong> — Charged by typing centres or
              PRO services for filing and processing your application. Typically AED 150–350.
            </li>
          </ul>

          <h2 className="mt-8 text-xl font-semibold tracking-tight text-foreground">Visa type guide</h2>
          <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">Visit Visa (30/60/90 days)</strong> — No medical or Emirates ID required. Costs are government fees plus typing only. The 90-day version allows multiple entries.</li>
            <li><strong className="text-foreground">Employment Visa (2–3 years)</strong> — Employer-sponsored. Most costs are usually paid by the employer. Medical, Emirates ID, and status change may apply.</li>
            <li><strong className="text-foreground">Green Visa (5 years)</strong> — Self-sponsored for skilled professionals (min. AED 15,000/month income) and freelancers (min. AED 360,000 total over 2 years). No employer needed.</li>
            <li><strong className="text-foreground">Golden Visa (10 years)</strong> — Long-term residency for investors (AED 2M+ in real estate or approved business), exceptional talent, and outstanding graduates. Highest government fees but longest validity.</li>
            <li><strong className="text-foreground">Investor / Partner Visa</strong> — Not included in this calculator as a standalone option. This visa requires a valid UAE trade license and company ownership. Costs vary significantly (AED 7,000–15,000+) based on mainland vs. free zone, establishment card fees, and PRO service charges. Consult a licensed PRO service for an accurate quote.</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6 border-t border-border/60 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
        <div className="mt-6 space-y-4">
          {faq.map((item, index) => (
            <article key={item.question} className={`py-4 ${index === 0 ? "" : "border-t border-border/50"}`}>
              <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath={PAGE_PATH} />
    </div>
  );
}
