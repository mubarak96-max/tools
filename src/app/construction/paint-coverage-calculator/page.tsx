import Link from "next/link";
import type { Metadata } from "next";

import { PaintCoverageCalculator } from "./components/PaintCoverageCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Free Paint Coverage Calculator - How Much Paint Do I Need?",
  description:
    "Calculate how much paint you need for any room. Enter dimensions, doors, windows, ceiling, and coats to get gallons or liters instantly. Free paint calculator, no sign-up needed.",
  keywords: [
    "paint calculator",
    "paint coverage calculator",
    "how much paint do i need",
    "how many gallons of paint",
    "paint calculator for room",
    "how much paint for a room",
    "paint estimator",
    "interior paint calculator",
    "paint coverage per gallon",
  ],
};

const PAGE_PATH = "/construction/paint-coverage-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How much paint do I need for a 10x10 room?",
    answer:
      "With an 8 ft ceiling, one door, one window, and 2 coats, the estimate is about 1.8 gallons. Actual needs vary by paint spread rate and wall texture.",
  },
  {
    question: "How much paint do I need for a 12x12 room?",
    answer:
      "With an 8 ft ceiling, one door, one window, and 2 coats, the estimate is about 2.2 gallons. Round up to whole containers and keep a little extra for touch-ups.",
  },
  {
    question: "How do I calculate paint coverage?",
    answer:
      "Find wall area from room perimeter and height, subtract doors and windows, multiply by number of coats, then divide by spread rate (often around 350 sq ft per gallon).",
  },
  {
    question: "How much does one gallon of paint cover?",
    answer:
      "Many interior paints are rated around 350-400 square feet per gallon per coat. Primer and exterior products may cover less depending on surface condition.",
  },
  {
    question: "How many gallons of paint do I need for one coat?",
    answer:
      "It depends on paintable area and product spread rate. This calculator computes one-coat and multi-coat needs from your exact room dimensions and deductions.",
  },
  {
    question: "Do I need primer before painting?",
    answer:
      "Primer is often recommended for fresh drywall, patched surfaces, major color changes, and stain-prone walls. It improves adhesion and can reduce the number of finish coats needed.",
  },
  {
    question: "How many coats of paint do I need when changing colors?",
    answer:
      "Two coats are standard. Going from dark to light or painting over porous surfaces can require three coats or a dedicated primer plus two finish coats.",
  },
  {
    question: "Why does this calculator recommend buying extra paint?",
    answer:
      "A 10% overage helps cover texture absorption, roller losses, spills, and future touch-ups. Running short mid-project can cause color and sheen mismatch.",
  },
  {
    question: "What is the standard paint spread rate?",
    answer:
      "A common planning rate is 350 sq ft per gallon (or about 10 sq m per liter), but actual coverage varies by paint type, color, and wall texture.",
  },
  {
    question: "How much paint do I need for a ceiling?",
    answer:
      "Add ceiling area when the ceiling toggle is enabled. Ceiling paint is typically estimated with the same coverage logic but may vary by product and texture.",
  },
];

function buildPaintCalculatorJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Paint Coverage Calculator",
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
      "Free paint calculator for room walls and ceilings with door/window deductions, coat multiplier, and gallon/liter output.",
    featureList: [
      "Imperial and metric input modes",
      "Door and window deduction support",
      "Optional ceiling inclusion",
      "Multi-coat paint estimation",
      "Gallons and liters output",
    ],
  };
}

export default function PaintCoverageCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Construction", path: "/construction" },
    { name: "Paint Coverage Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildPaintCalculatorJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/construction" className="hover:text-primary">
                Construction
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground">Paint Coverage Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Construction Tool
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Paint Coverage Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Estimate how much paint you need for your next room project. Enter room dimensions,
            doors, windows, coats, and ceiling preference to get gallons or liters instantly.
          </p>
        </div>

        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <PaintCoverageCalculator />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            How this paint calculator works
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            This paint calculator estimates wall and optional ceiling coverage for interior projects.
            It subtracts standard door and window areas, applies your selected coat count, and converts
            the result into gallons or liters.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            How do you calculate paint coverage?
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Calculating paint coverage is straightforward once you know room dimensions. This page uses
            the standard perimeter method:
          </p>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>
              <strong className="text-foreground">1. Find total wall area:</strong> (Room Length + Room
              Width) x 2 x Ceiling Height
            </li>
            <li>
              <strong className="text-foreground">2. Deduct obstacles:</strong> subtract about 21 sq ft
              (2 sq m) per door and 15 sq ft (1.4 sq m) per window.
            </li>
            <li>
              <strong className="text-foreground">3. Find paint needed:</strong> multiply by coats, then
              divide by spread rate (often 350 sq ft per gallon or 10 sq m per liter).
            </li>
          </ul>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            <strong className="text-foreground">Worked example:</strong> For a 12 ft x 10 ft room with 8
            ft height, 1 door, 1 window, and 2 coats: (12 + 10) x 2 x 8 = 352 sq ft. Minus 21 and 15
            gives 316 sq ft. Multiply by 2 coats = 632 sq ft. Divide by 350 = 1.8 gallons, so buy 2
            gallons.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            Room-size paint reference table
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Quick planning estimates below assume 8 ft ceilings, 1 door, 1 window, and average spread
            rate.
          </p>
          <div className="mt-4 overflow-x-auto rounded-[1rem] border border-border bg-background">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/60">
                <tr className="text-left text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">Room size</th>
                  <th className="px-4 py-3 font-semibold">1 coat</th>
                  <th className="px-4 py-3 font-semibold">2 coats</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 text-foreground">8 x 8 ft</td>
                  <td className="px-4 py-3 text-foreground">~0.7 gal</td>
                  <td className="px-4 py-3 text-foreground">~1.4 gal</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 text-foreground">10 x 10 ft</td>
                  <td className="px-4 py-3 text-foreground">~0.9 gal</td>
                  <td className="px-4 py-3 text-foreground">~1.8 gal</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 text-foreground">12 x 12 ft</td>
                  <td className="px-4 py-3 text-foreground">~1.1 gal</td>
                  <td className="px-4 py-3 text-foreground">~2.2 gal</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 text-foreground">14 x 14 ft</td>
                  <td className="px-4 py-3 text-foreground">~1.3 gal</td>
                  <td className="px-4 py-3 text-foreground">~2.6 gal</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            Paint coverage by paint type
          </h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">Interior latex:</strong> often around 350-400 sq ft per gallon.</li>
            <li><strong className="text-foreground">Primer:</strong> commonly around 200-300 sq ft per gallon.</li>
            <li><strong className="text-foreground">Exterior paint:</strong> often around 250-350 sq ft per gallon.</li>
            <li><strong className="text-foreground">High-hide products:</strong> coverage varies by brand and substrate.</li>
          </ul>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            This tool uses a standard planning rate, but always confirm coverage on your paint can and
            adjust for rough or porous surfaces.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            How many coats of paint do I need?
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Most interior projects need at least <strong className="text-foreground">two coats</strong>{" "}
            for durable, even color.
          </p>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">1 coat:</strong> only for minor refreshes over similar color.</li>
            <li><strong className="text-foreground">2 coats:</strong> standard for most rooms and color changes.</li>
            <li><strong className="text-foreground">3+ coats:</strong> common for dark-to-light transitions or porous surfaces without proper primer.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            Do I need primer before painting?
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Primer is recommended on fresh drywall, repaired patches, stains, glossy surfaces, and major
            color shifts. It improves adhesion and often reduces finish-coat surprises.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            Paint finish types quick guide
          </h2>
          <div className="mt-4 overflow-x-auto rounded-[1rem] border border-border bg-background">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/60">
                <tr className="text-left text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">Finish</th>
                  <th className="px-4 py-3 font-semibold">Typical use</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 text-foreground">Matte / Flat</td>
                  <td className="px-4 py-3 text-muted-foreground">Low-traffic walls and ceilings; hides imperfections well.</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 text-foreground">Eggshell</td>
                  <td className="px-4 py-3 text-muted-foreground">Living rooms and bedrooms; soft sheen with moderate washability.</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 text-foreground">Satin</td>
                  <td className="px-4 py-3 text-muted-foreground">High-traffic interiors, hallways, kids' rooms.</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 text-foreground">Semi-gloss</td>
                  <td className="px-4 py-3 text-muted-foreground">Trim, kitchens, bathrooms; more moisture resistant.</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-4 py-3 text-foreground">Gloss</td>
                  <td className="px-4 py-3 text-muted-foreground">Doors and accents; very reflective and durable.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            Why add a 10% paint overage?
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            A small overage helps with roller losses, textured walls, spills, and touch-ups after
            furniture moves or repairs. It is usually cheaper than matching color later from a new batch.
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
