import Link from "next/link";
import type { Metadata } from "next";

import { FlooringMaterialCalculator } from "./components/FlooringMaterialCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Free Flooring Calculator - How Much Flooring Do I Need? (Sq Ft & Boxes)",
  description:
    "Calculate how much flooring you need for any room. Enter dimensions, choose a waste factor, and get total square footage plus boxes required. Works for hardwood, LVP, laminate, and tile.",
  keywords: [
    "flooring calculator",
    "how much flooring do i need",
    "flooring square footage calculator",
    "laminate flooring calculator",
    "lvp flooring calculator",
    "hardwood flooring calculator",
    "tile flooring calculator",
    "how many boxes of flooring",
    "flooring waste factor",
    "floor calculator square feet",
  ],
};

const PAGE_PATH = "/construction/flooring-material-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How do I calculate how much flooring I need?",
    answer:
      "Measure room length and width, multiply for net area, then add a waste factor based on layout complexity. Divide total needed area by box coverage and always round up to full boxes.",
  },
  {
    question: "What waste factor should I use for flooring?",
    answer:
      "Typical ranges are 5-10% for straight layouts, 10-15% for rooms with more cuts and obstacles, and 20-25% for herringbone or other complex patterns.",
  },
  {
    question: "How much flooring do I need for a 12x12 room?",
    answer:
      "A 12x12 room is 144 sq ft net. At 10% waste, plan about 158.4 sq ft. If each box covers 22 sq ft, you would buy 8 boxes.",
  },
  {
    question: "How many boxes of flooring do I need for 200 sq ft?",
    answer:
      "Divide total area by box coverage. Example: 200 sq ft at 20 sq ft per box = 10 boxes before waste. Add waste first, then divide and round up.",
  },
  {
    question: "What is a dye lot and why does it matter?",
    answer:
      "A dye lot is a production batch. Flooring from different lots can have slight shade differences, so buying all boxes at once from the same lot helps keep color consistent.",
  },
  {
    question: "Should I order extra flooring?",
    answer:
      "Yes. Extra material helps with cutting waste, damaged pieces, future repairs, and color consistency. Running short can delay installation and complicate lot matching.",
  },
  {
    question: "How do I calculate flooring for an irregular shaped room?",
    answer:
      "Split the room into simple rectangles, calculate each section separately, add totals, then apply waste. This gives a practical estimate for L-shaped and offset spaces.",
  },
  {
    question: "What waste factor do I need for herringbone flooring?",
    answer:
      "Herringbone and chevron patterns commonly need around 20-25% waste because they create many directional cuts and short offcuts.",
  },
  {
    question: "How much flooring do I need for stairs?",
    answer:
      "Stairs are typically measured separately from open floor area because each tread and riser creates additional cuts. Add stair material on top of your room estimate.",
  },
  {
    question: "What is the difference between net area and total area needed?",
    answer:
      "Net area is the raw room footprint. Total area needed is net area plus your selected waste factor, which is the number you should use for ordering.",
  },
];

function buildFlooringCalculatorJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Flooring Material Calculator",
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
      "Free flooring calculator for square footage, waste factor, and box-count planning across hardwood, laminate, LVP, and tile projects.",
    featureList: [
      "Imperial and metric input modes",
      "Adjustable waste factor",
      "Optional box coverage input",
      "Net area and total area output",
      "Rounded box-count estimate",
    ],
  };
}

export default function FlooringMaterialCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Construction", path: "/construction" },
    { name: "Flooring Material Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildFlooringCalculatorJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/construction" className="hover:text-primary">Construction</Link></li>
            <li>/</li>
            <li className="text-foreground">Flooring Material Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Construction Tool
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Flooring Material Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Quickly estimate the exact amount of flooring to order by combining room dimensions, waste
            margins, and per-box coverage. This flooring calculator works for hardwood, laminate, LVP,
            and tile planning workflows.
          </p>
        </div>

        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <FlooringMaterialCalculator />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Flooring calculator basics
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Start with room area (length x width), then add waste based on installation complexity. If
            you know the box coverage from your product label, enter it to convert total area into boxes.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            Why do I need a waste factor?
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            A waste factor is extra material added to your order. Offcuts, angled cuts around walls and
            cabinets, pattern alignment, and occasional damaged planks all reduce usable yield.
          </p>
          <div className="mt-4 overflow-x-auto rounded-[1rem] border border-border bg-background">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/60">
                <tr className="text-left text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">Installation type</th>
                  <th className="px-4 py-3 font-semibold">Recommended waste</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 text-foreground">Straight lay, square room</td>
                  <td className="px-4 py-3 text-foreground">5-10%</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 text-foreground">Rooms with obstacles</td>
                  <td className="px-4 py-3 text-foreground">10-15%</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 text-foreground">Diagonal installation</td>
                  <td className="px-4 py-3 text-foreground">~15%</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 text-foreground">Herringbone / chevron</td>
                  <td className="px-4 py-3 text-foreground">20-25%</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 text-foreground">Stairs</td>
                  <td className="px-4 py-3 text-foreground">Add separately per step</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            Understanding box coverage
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Hardwood, LVP, and laminate are usually sold by box/carton instead of exact square feet.
            Each manufacturer packs a specific coverage amount (often around 18-30 sq ft per box).
            This tool divides your total required area by box coverage and rounds up so you do not run
            short.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            <strong className="text-foreground">Worked example:</strong> If your project needs 220 sq ft
            and each box covers 22 sq ft, you need 10 boxes. If each box covers 24 sq ft, 220 / 24 =
            9.17, so you still buy 10 boxes.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            Flooring types and planning differences
          </h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>
              <strong className="text-foreground">Hardwood:</strong> often around 20-25 sq ft per box;
              directional grain and matching increase cut waste.
            </li>
            <li>
              <strong className="text-foreground">LVP:</strong> commonly around 20-24 sq ft per box; more
              forgiving installation, but still plan standard waste.
            </li>
            <li>
              <strong className="text-foreground">Laminate:</strong> similar box coverage to LVP; include
              acclimation and expansion-gap planning.
            </li>
            <li>
              <strong className="text-foreground">Ceramic/porcelain tile:</strong> often sold by area and
              cartons; account for pattern, grout alignment, and breakage.
            </li>
            <li>
              <strong className="text-foreground">Carpet:</strong> typically sold by linear yard/roll
              width, so calculation rules differ from plank/tile products.
            </li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            Irregular room guidance
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            For L-shaped or irregular rooms, split the layout into smaller rectangles, calculate each
            section separately, then add totals before applying waste. This gives more reliable estimates
            than forcing one rectangle over complex geometry.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            Why dye lot matching matters
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            A dye lot is a production batch. Even when product codes match, different lots can show small
            tone differences. Ordering enough material in one purchase improves visual consistency across
            the floor and simplifies future touch-ups.
          </p>
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
