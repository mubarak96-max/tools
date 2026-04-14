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
    question: "How much does a UAE visa cost?",
    answer:
      "UAE visa cost depends on visa type, duration, sponsor, emirate, application channel, insurance, and whether the applicant is inside or outside the UAE. A short visit visa may cost a few hundred dirhams, while residence, family, and freelance routes can cost several thousand dirhams once medical, Emirates ID, service fees, and sponsor-related charges are included.",
  },
  {
    question: "What is included in the UAE visa cost estimate?",
    answer:
      "The calculator estimates the main cost components: visa or permit fees, typing or service support, inside-UAE status change where relevant, medical fitness for residence visas, Emirates ID for residence visas, and visit visa insurance estimates. It does not guarantee a final quote from an authority, free zone, travel agency, Amer centre, or PRO.",
  },
  {
    question: "Does faster UAE visa processing cost more?",
    answer:
      "Usually yes. Priority, express, or urgent handling can add agency, typing-centre, PRO, or service-provider charges on top of the core visa cost. Availability and pricing vary by visa route and authority, so urgency fees should be treated as planning estimates rather than guaranteed official fees.",
  },
  {
    question: "Why does applying from inside the UAE cost more?",
    answer:
      "Inside-country applications often add status change or in-country processing fees. GDRFA visit visa service schedules also show an additional fee when the sponsored person is already inside the UAE, so the same visa can cost more depending on applicant location.",
  },
  {
    question: "Is medical testing included in tourist visa cost?",
    answer:
      "No. Medical fitness testing and Emirates ID are residence-visa steps. Tourist or visit visas normally involve entry permit fees, insurance, typing or agency support, and sometimes refundable deposits depending on the category.",
  },
  {
    question: "Is Emirates ID included in residence visa cost?",
    answer:
      "It should be included in a full residence visa budget. ICP resident ID card fees are charged by validity period, with additional smart service and delivery-related charges depending on the channel.",
  },
  {
    question: "Can I use this as an official UAE visa quote?",
    answer:
      "No. This calculator is an estimate for planning. UAE visa fees and requirements can change, and final costs vary by authority, emirate, sponsor, nationality, insurance, free zone, urgency, and service provider. Always confirm the final amount with ICP, GDRFA, Amer, a free zone, or a licensed PRO before applying.",
  },
  {
    question: "What is not included in the UAE visa estimate?",
    answer:
      "The estimate does not automatically include every possible charge. Document attestation, health insurance for residence cases, free-zone package extras, sponsor-related compliance costs, tenancy paperwork, courier add-ons, and employer-specific charges may still apply depending on your route.",
  },
];

export const metadata: Metadata = {
  title: "UAE Visa Cost Calculator | Tourist, Residence, Family & Freelance",
  description:
    "Estimate UAE visa costs by visa type, duration, inside/outside UAE status, medical, Emirates ID, insurance, and service fees. Plan tourist, residence, family, and freelance visa costs.",
  keywords: [
    "UAE visa cost calculator",
    "UAE visa cost",
    "Dubai visa price",
    "tourist visa UAE cost",
    "UAE residence visa cost",
    "family visa UAE cost",
    "freelance visa Dubai cost",
    "visa cost UAE",
    "Dubai visa cost",
    "Emirates ID fee",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "UAE Visa Cost Calculator",
    description:
      "Estimate the full cost of UAE tourist, residence, family, and freelance visas with fee breakdowns and inside-UAE status change logic.",
  },
  twitter: {
    card: "summary_large_image",
    title: "UAE Visa Cost Calculator",
    description:
      "Plan UAE visa costs with breakdowns for visa fees, medical, Emirates ID, insurance, and service charges.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
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
      "Free UAE visa cost estimator for tourist, residence, family, and freelance visa planning with fee breakdowns, inside-UAE logic, medical fitness estimates, Emirates ID estimates, and service fees.",
    featureList: [
      "Visa type selector for tourist, residence, family, and freelance routes",
      "Inside UAE vs outside UAE estimate",
      "Visa fee, medical, Emirates ID, insurance, and service fee breakdown",
      "Total estimated cost range",
      "Typical-range comparison and urgency estimate",
      "Disclaimer and variability guidance",
      "UAE relocation and finance workflow links",
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
            UAE visa planning
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            UAE Visa Cost Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Estimate the full cost of a UAE visa before you apply. Choose tourist, residence, family, or freelance
            visa routes and see the likely breakdown across visa fees, medical fitness, Emirates ID, insurance,
            service charges, and inside-UAE status change costs.
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Visa pricing is not one fixed number. The total changes by visa type, stay duration, applicant location,
            sponsor, emirate, processing channel, insurance, and service provider.
          </p>
        </div>
      </section>

      <UAEVisaCostCalculator />

      <section className="grid gap-4 border-t border-border/60 pt-8 md:grid-cols-3">
        <article className="rounded-[1.5rem] border border-border bg-background p-5">
          <h2 className="text-lg font-semibold text-foreground">Tourist visa</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Best for short visits. Budget for the entry permit or visit visa fee, insurance, typing or agency support,
            and possible inside-country fees if the applicant is already in the UAE.
          </p>
        </article>
        <article className="rounded-[1.5rem] border border-border bg-background p-5">
          <h2 className="text-lg font-semibold text-foreground">Residence visa</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Usually includes entry or status processing, medical fitness, Emirates ID, service fees, and sometimes
            insurance or employer/free-zone charges.
          </p>
        </article>
        <article className="rounded-[1.5rem] border border-border bg-background p-5">
          <h2 className="text-lg font-semibold text-foreground">Family or freelance</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            These routes vary most because sponsor documents, attestations, salary requirements, insurance, free-zone
            packages, and PRO service costs can materially change the final total.
          </p>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[1.5rem] border border-border bg-background p-5">
          <h2 className="text-lg font-semibold text-foreground">Tourist visa cost</h2>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">AED 390 - AED 940</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Typical planning range for 30-day to 60-day visit routes using common service support and insurance assumptions.
          </p>
        </article>
        <article className="rounded-[1.5rem] border border-border bg-background p-5">
          <h2 className="text-lg font-semibold text-foreground">Work visa cost</h2>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">AED 3,250 - AED 6,750</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Covers residence processing, medical fitness, Emirates ID, and common handling ranges. Employers often manage this route directly.
          </p>
        </article>
        <article className="rounded-[1.5rem] border border-border bg-background p-5">
          <h2 className="text-lg font-semibold text-foreground">Family visa cost</h2>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">AED 1,850 - AED 3,100</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Usually includes family sponsorship processing, medical fitness, Emirates ID, and standard application support.
          </p>
        </article>
        <article className="rounded-[1.5rem] border border-border bg-background p-5">
          <h2 className="text-lg font-semibold text-foreground">Freelance visa cost</h2>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">AED 4,400 - AED 9,850</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            The widest range because free-zone package pricing, permit fees, and support charges vary a lot.
          </p>
        </article>
      </section>

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">What affects UAE visa cost?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            UAE visa cost is shaped by the type of visa, duration, sponsor, emirate, application channel, urgency,
            insurance requirements, and whether the applicant is inside or outside the UAE. A 30-day visit visa has
            a very different cost structure from a residence visa, family sponsorship, or freelance package.
          </p>

          <h2 className="mt-8 text-xl font-semibold tracking-tight text-foreground">How total UAE visa cost is calculated</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            A realistic visa budget should look at the full journey, not only the headline visa fee:
          </p>
          <div className="mt-4 rounded-[1.25rem] border border-border bg-background p-4 font-mono text-sm text-foreground">
            Total cost = visa or permit fee + service fees + inside-UAE status change + medical + Emirates ID + insurance + optional deposits
          </div>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Tourist and visit visas usually do not require medical fitness or Emirates ID. Residence, employment,
            family, and freelance visa routes normally do. That is why a residence visa estimate can be several
            times higher than a short visit visa.
          </p>

          <h2 className="mt-8 text-xl font-semibold tracking-tight text-foreground">What is included in UAE visa cost?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            A realistic UAE visa estimate should include the core visa or permit fee, typing or service support,
            visit insurance where relevant, inside-UAE status change where relevant, medical fitness for residence
            routes, Emirates ID for residence routes, and any optional deposit that may apply to certain visit cases.
            Many weak calculators show only the headline visa fee. That is not how people experience the real cost.
          </p>

          <h2 className="mt-8 text-xl font-semibold tracking-tight text-foreground">Tourist, work, family, and freelance visa cost ranges</h2>
          <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
            <li>
              <strong className="text-foreground">Tourist visa cost in UAE:</strong> often lands in the few-hundred-dirham range once visa fee,
              insurance, and service support are included.
            </li>
            <li>
              <strong className="text-foreground">Work visa cost in UAE:</strong> usually runs into several thousand dirhams because residence
              processing, medical fitness, Emirates ID, and employer or service handling are part of the journey.
            </li>
            <li>
              <strong className="text-foreground">Family visa cost in UAE:</strong> sits between visit and employment cases, but attestation,
              sponsor documents, and insurance can materially change the final number.
            </li>
            <li>
              <strong className="text-foreground">Freelance visa cost in Dubai or UAE free zones:</strong> is usually the least predictable because
              permit package structures vary so much between providers.
            </li>
          </ul>

          <h2 className="mt-8 text-xl font-semibold tracking-tight text-foreground">Visa type breakdown</h2>
          <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
            <li>
              <strong className="text-foreground">Tourist or visit visa:</strong> usually driven by duration
              (30, 60, or 90 days), insurance, agency or typing fees, and whether the applicant is inside the UAE.
            </li>
            <li>
              <strong className="text-foreground">Employment residence visa:</strong> includes residence processing,
              medical fitness, Emirates ID, and employer or free-zone handling. In many employment cases, the employer
              manages the cost.
            </li>
            <li>
              <strong className="text-foreground">Family residence visa:</strong> depends on sponsor eligibility,
              document attestation, dependent category, insurance, medical testing, Emirates ID, and application channel.
            </li>
            <li>
              <strong className="text-foreground">Freelance visa:</strong> often includes a freelance permit or free-zone
              package plus the residence visa steps, which makes pricing more variable than a basic visit visa.
            </li>
          </ul>

          <h2 className="mt-8 text-xl font-semibold tracking-tight text-foreground">Inside UAE vs outside UAE cost</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Applying from inside the UAE can increase the total because status change or inside-country processing is
            added. This matters most when somebody enters on one status and later converts to another. The same visa
            route can therefore have two very different totals depending on where the applicant starts the process.
          </p>

          <h2 className="mt-8 text-xl font-semibold tracking-tight text-foreground">What this estimate does not include</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Not every visa case stops at government fees. Some applications also need document attestation, tenancy
            proof, salary compliance, private health insurance, courier fees, sponsor-specific paperwork, or free-zone
            package extras. Use this calculator as a planning tool, then verify the final payable amount with the
            authority or provider handling your application.
          </p>

          <h2 className="mt-8 text-xl font-semibold tracking-tight text-foreground">Important limitations</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            This tool is a planning estimator, not an official quote. Government schedules, smart service fees,
            delivery fees, deposits, insurance, free-zone packages, and PRO charges can change. Confirm the final
            amount with official channels such as{" "}
            <a href="https://icp.gov.ae/" className="text-primary hover:underline" rel="noreferrer" target="_blank">
              ICP
            </a>
            ,{" "}
            <a href="https://www.gdrfad.gov.ae/" className="text-primary hover:underline" rel="noreferrer" target="_blank">
              GDRFA
            </a>
            , Amer, a typing centre, free zone authority, or licensed PRO before paying.
          </p>

          <h2 className="mt-8 text-xl font-semibold tracking-tight text-foreground">Common use cases</h2>
          <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">Tourists:</strong> estimate a 30, 60, or 90-day UAE visit budget before booking travel.</li>
            <li><strong className="text-foreground">Expats:</strong> understand the real cost of moving from a visit visa to residence.</li>
            <li><strong className="text-foreground">Families:</strong> plan sponsorship costs for spouse, children, or parents.</li>
            <li><strong className="text-foreground">Freelancers:</strong> compare self-sponsored visa routes and free-zone package ranges.</li>
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
