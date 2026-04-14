import Link from "next/link";
import type { Metadata } from "next";

import { ConcreteVolumeCalculator } from "./components/ConcreteVolumeCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Free Concrete Volume Calculator - How Many Bags Do I Need?",
  description:
    "Calculate how much concrete you need for slabs, footings, and columns. Instantly see cubic yards, cubic feet, cubic meters, and how many 40, 60, or 80 lb bags to buy.",
  keywords: [
    "concrete calculator",
    "concrete volume calculator",
    "how much concrete do i need",
    "how many bags of concrete",
    "concrete slab calculator",
    "concrete bag calculator",
    "yards of concrete calculator",
    "concrete footing calculator",
    "how many 80lb bags per yard",
  ],
};

const PAGE_PATH = "/construction/concrete-volume-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How do I calculate how much concrete I need?",
    answer:
      "For slabs and square footings, use length x width x depth. For circular columns or holes, use pi x radius squared x depth. Convert cubic feet to cubic yards by dividing by 27.",
  },
  { question: "How many 80 lb bags of concrete make one cubic yard?", answer: "About 45 bags of 80 lb concrete make 1 cubic yard." },
  { question: "How many 60 lb bags of concrete make one cubic yard?", answer: "About 60 bags of 60 lb concrete make 1 cubic yard." },
  { question: "How many 40 lb bags of concrete make one cubic yard?", answer: "About 90 bags of 40 lb concrete make 1 cubic yard." },
  {
    question: "How thick should a concrete slab be?",
    answer:
      "Typical residential guides are 3-4 inches for patios and walkways, 4 inches for driveways, and 4-6 inches for garage floors. Structural pours should follow local code and engineering requirements.",
  },
  {
    question: "How long does concrete take to set?",
    answer:
      "Concrete usually starts setting within a few hours, but practical strength takes longer. Most projects avoid heavy loads for several days, and full curing commonly takes about 28 days.",
  },
  {
    question: "What is a cubic yard of concrete?",
    answer:
      "One cubic yard is 27 cubic feet. It is the standard unit used by ready-mix suppliers and many concrete estimators.",
  },
  {
    question: "Should I order extra concrete?",
    answer:
      "Yes. A small overage helps cover uneven subgrade, spillage, and variations in mixing yield. This page uses a 5% waste factor for bag estimates.",
  },
  {
    question: "How do I calculate concrete for a circular column?",
    answer:
      "Measure diameter and depth, convert diameter to radius, then use pi x radius squared x depth. Multiply by quantity if you have multiple identical columns.",
  },
  {
    question: "What is the Quantity field for?",
    answer:
      "Quantity multiplies the same shape dimensions in one step. For example, if you are pouring 4 identical footings, enter one footing's dimensions and set quantity to 4.",
  },
];

function buildConcreteCalculatorJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Concrete Volume Calculator",
    url: PAGE_URL,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Free concrete calculator for slabs, footings, and columns with cubic yard and bag count estimates including waste factor.",
    featureList: [
      "Slab, footing, and circular column calculation",
      "Imperial and metric input modes",
      "Volume output in cubic feet, cubic yards, and cubic meters",
      "40 lb, 60 lb, and 80 lb bag estimates",
      "5% waste factor support",
    ],
  };
}

export default function ConcreteVolumeCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Construction", path: "/construction" },
    { name: "Concrete Volume Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildConcreteCalculatorJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/construction" className="hover:text-primary">Construction</Link></li>
            <li>/</li>
            <li className="text-foreground">Concrete Volume Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Construction Tool
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Concrete Volume Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Calculate the exact volume of concrete needed for your project. Choose slabs, square footings,
            or circular columns, and instantly estimate cubic yards plus how many 40 lb, 60 lb, or 80 lb
            bags to buy.
          </p>
        </div>

        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <ConcreteVolumeCalculator />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            How to use this concrete calculator
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            This concrete calculator estimates volume for one pour shape at a time. Enter dimensions,
            choose imperial or metric units, and review totals in cubic feet, cubic yards, and cubic
            meters. The bag output includes a 5% waste factor to reduce under-ordering risk.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Use the <strong className="text-foreground">Quantity</strong> field when repeating the same
            pour dimensions, for example 4 identical footings or 6 fence-post holes.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            How much concrete do I need? Formulas and worked examples
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Concrete volume is geometry first, unit conversion second.
          </p>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">Slabs and Footings:</strong> Length x Width x Depth</li>
            <li><strong className="text-foreground">Columns and Holes:</strong> Pi x Radius squared x Depth</li>
          </ul>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            <strong className="text-foreground">Example (slab):</strong> A 10 ft x 10 ft patio at 4 inches
            thick = 10 x 10 x 0.333 = 33.3 cubic feet = 1.23 cubic yards.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            <strong className="text-foreground">Example (column):</strong> A 12 inch diameter, 3 ft deep hole
            has radius 0.5 ft. Volume = pi x 0.5 x 0.5 x 3 = 2.36 cubic feet. For 6 identical holes,
            multiply by quantity to get 14.16 cubic feet.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            How many bags of concrete make a yard?
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            One cubic yard of concrete equals 27 cubic feet. Use this quick reference for common bag sizes.
          </p>
          <div className="mt-4 overflow-x-auto rounded-[1rem] border border-border bg-background">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/60">
                <tr className="text-left text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">Bag size</th>
                  <th className="px-4 py-3 font-semibold">Bags per cubic yard</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 text-foreground">80 lb</td>
                  <td className="px-4 py-3 text-foreground">45 bags</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 text-foreground">60 lb</td>
                  <td className="px-4 py-3 text-foreground">60 bags</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 text-foreground">40 lb</td>
                  <td className="px-4 py-3 text-foreground">90 bags</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            This calculator includes a standard 5% waste factor for premixed bag estimates. It helps
            account for uneven subgrade, spillage, and real-world yield variation.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            Minimum slab thickness guide
          </h2>
          <div className="mt-4 overflow-x-auto rounded-[1rem] border border-border bg-background">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/60">
                <tr className="text-left text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">Application</th>
                  <th className="px-4 py-3 font-semibold">Typical thickness</th>
                  <th className="px-4 py-3 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 text-foreground">Patio / walkway</td>
                  <td className="px-4 py-3 text-foreground">3-4 inches</td>
                  <td className="px-4 py-3 text-muted-foreground">Light foot traffic</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 text-foreground">Driveway</td>
                  <td className="px-4 py-3 text-foreground">4 inches</td>
                  <td className="px-4 py-3 text-muted-foreground">Often thicker near heavy vehicle paths</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 text-foreground">Garage floor</td>
                  <td className="px-4 py-3 text-foreground">4-6 inches</td>
                  <td className="px-4 py-3 text-muted-foreground">Depends on expected loads</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 text-foreground">Structural footing</td>
                  <td className="px-4 py-3 text-foreground">Engineered / code-based</td>
                  <td className="px-4 py-3 text-muted-foreground">Follow local code and engineer specs</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            Concrete mix ratios and when to use them
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            General-purpose concrete is commonly mixed around <strong className="text-foreground">1:2:3</strong>{" "}
            (cement : sand : gravel). Structural applications often use mixes around{" "}
            <strong className="text-foreground">1:1.5:3</strong> or engineered designs. For most DIY pours,
            premixed bags are practical for small jobs, while larger pours usually benefit from ready-mix delivery.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            Ready-mix vs bagged concrete
          </h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>
              <strong className="text-foreground">Bagged concrete:</strong> best for smaller jobs, spot repairs,
              fence posts, and projects around or under 1 cubic yard.
            </li>
            <li>
              <strong className="text-foreground">Ready-mix truck:</strong> usually more efficient for larger pours
              where consistency, speed, and labor savings matter.
            </li>
            <li>If you are near the threshold, compare bag cost + labor against delivery minimums in your area.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            Tips for pouring concrete
          </h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Prep and compact the base before pouring to reduce settlement and cracking.</li>
            <li>Avoid pouring in extreme heat or freezing weather unless you use weather-specific practices.</li>
            <li>Mix to a workable consistency; too much water weakens final strength.</li>
            <li>Keep tools and finishing plan ready because set time starts quickly.</li>
            <li>Order a small overage; running short during a pour is costly and messy.</li>
          </ul>
        </div>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
        <div className="mt-6 space-y-4">
          {faq.map((item) => (
            <article key={item.question} className="rounded-[1.25rem] border border-border bg-background p-5">
              <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <RelatedToolsSection category="Construction" categoryHref="/construction" currentPath={PAGE_PATH} />
    </div>
  );
}
