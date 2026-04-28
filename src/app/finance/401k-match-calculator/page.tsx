import Link from "next/link";
import type { Metadata } from "next";

import MatchCalculator from "./components/MatchCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 43200;

const PAGE_PATH = "/finance/401k-match-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faqs = [
  {
    q: "What does 401(k) employer match mean?",
    a: "An employer match is free money your company contributes to your 401(k) based on how much you contribute. For example, a 100% match up to 5% of salary means if you earn $80,000 and contribute 5% ($4,000), your employer adds another $4,000 — doubling your retirement savings at no extra cost to you.",
  },
  {
    q: "How is the 401(k) employer match calculated?",
    a: "The formula is: Employer Match = (Your Contribution % up to Cap) × Match Rate × Salary. Example: $70,000 salary, 50% match on up to 6% of pay = 6% × 50% × $70,000 = $2,100/year employer match.",
  },
  {
    q: "What is the 401(k) contribution limit for 2024?",
    a: "The IRS limit for employee 401(k) contributions in 2024 is $23,000. Workers aged 50+ can add a $7,500 catch-up contribution, bringing their total to $30,500. Our calculator automatically caps your employee contribution at the $23,000 limit.",
  },
  {
    q: "What does vesting mean in a 401(k)?",
    a: "Vesting refers to how long you must work at a company before the employer match is truly 'yours.' Many employers use cliff vesting (you own 0% until year 3, then 100%) or graded vesting (20% per year for 5 years). If you leave before full vesting, you forfeit unvested employer contributions.",
  },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "401(k) Match Calculator 2024 — Free Employer Match Tool",
    description: "Calculate your exact 401(k) employer match, annual savings, and projected retirement balance. Applies 2024 IRS $23,000 limit automatically. Free, no sign-up required.",
    path: PAGE_PATH,
  }),
  keywords: [
    "401k employer match calculator",
    "401k match calculator 2024",
    "how much does my employer match 401k",
    "401k contribution calculator with employer match",
    "how is 401k match calculated",
    "dollar for dollar match calculator",
    "401k vesting calculator",
    "retirement savings calculator with employer match",
    "how to maximize 401k employer match",
    "401k match percentage calculator",
  ],
};

function buildSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "401(k) Employer Match Calculator",
        "url": PAGE_URL,
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "All",
        "browserRequirements": "Requires JavaScript",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "description": "Free 401(k) match calculator with 2024 IRS limits and compound growth projections.",
        "featureList": [
          "2024 IRS $23,000 limit protection",
          "Employer match rate and cap logic",
          "Vesting schedule warnings",
          "Compound growth retirement projection",
          "Monthly and annual savings breakdown"
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map((f) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a },
        })),
      }
    ],
  };
}

export default function Page() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "401(k) Match Calculator", path: PAGE_PATH },
  ]);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <JsonLd data={serializeJsonLd(buildSchema())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />

      <nav aria-label="Breadcrumb" className="mb-10">
        <ol className="flex flex-wrap items-center gap-2 text-[13px] font-medium text-slate-400">
          <li><Link href="/" className="hover:text-primary">Home</Link></li>
          <li>/</li>
          <li><Link href="/finance" className="hover:text-primary">Finance</Link></li>
          <li>/</li>
          <li className="text-slate-900">401(k) Match Calculator</li>
        </ol>
      </nav>

      <MatchCalculator />

      <footer className="mt-20 border-t border-slate-100 pt-12 text-center text-[13px] leading-relaxed text-slate-400">
        <p>
          This calculator is for educational and informational purposes only and does not constitute financial, tax, or investment advice.<br />
          Consult a qualified financial advisor for advice tailored to your specific situation.<br />
          2024 IRS contribution limits used: $23,000 employee limit, $69,000 combined limit.
        </p>
      </footer>
    </div>
  );
}
