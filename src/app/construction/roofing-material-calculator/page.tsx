import Link from "next/link";
import type { Metadata } from "next";

import { RoofingMaterialCalculator } from "./components/RoofingMaterialCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Roofing Material Calculator | Shingles, Bundles & Squares",
  description:
    "Free roofing material calculator. Enter roof dimensions, overhang, pitch, and waste factor to estimate squares, bundles, underlayment, drip edge, and more. No sign-up needed.",
  keywords: [
    "roofing calculator",
    "roofing material calculator",
    "roof shingle calculator",
    "how many bundles per square",
    "roof pitch multiplier chart",
    "roofing waste factor",
    "roofing estimate calculator",
  ],
};

const PAGE_PATH = "/construction/roofing-material-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How do I calculate roofing materials for shingles?",
    answer:
      "Start with roof footprint plus overhang, apply pitch multiplier to get true surface area, convert to squares, then add waste. Convert squares to bundles using your shingle profile.",
  },
  {
    question: "How many bundles of shingles are in one square?",
    answer:
      "For most architectural and 3-tab products, one roofing square needs about 3 bundles. Some premium or specialty products can vary, so always verify the product label.",
  },
  {
    question: "What waste factor should I use for a roof?",
    answer:
      "Simple gable layouts often use 5-10%. Roofs with valleys, hips, and more penetrations often need 10-15%. Pattern-heavy layouts may require 20% or more.",
  },
  {
    question: "Why does roof pitch change material quantities?",
    answer:
      "A steeper roof has more actual surface area than the same flat footprint. Pitch multiplier adjusts the estimate so bundle and accessory counts reflect true roof area.",
  },
  {
    question: "What does a roofing square mean?",
    answer:
      "One roofing square equals 100 square feet of roof area. Suppliers use squares to quote shingles and related materials quickly.",
  },
  {
    question: "Should I order extra shingles?",
    answer:
      "Yes. Extra material helps with cut waste, damaged pieces, and future repairs. It is also easier to keep color consistency when everything comes from the same production run.",
  },
  {
    question: "Can this calculator estimate underlayment and drip edge too?",
    answer:
      "Yes. This tool gives quick planning estimates for underlayment rolls, drip edge, starter strip, ridge cap length, and fastener boxes based on your area and waste settings.",
  },
  {
    question: "Does this work for complex roof shapes?",
    answer:
      "It is best for straightforward footprint-based estimating. For very complex roofs with many dormers and offsets, measure sections separately and combine totals.",
  },
];

function buildRoofingCalculatorJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Roofing Material Calculator",
    url: PAGE_URL,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Estimate roof squares, bundles, underlayment rolls, drip edge, ridge cap, starter strip, and fasteners from footprint, overhang, pitch, and waste factor.",
    featureList: [
      "Imperial and metric input modes",
      "Adjustable waste factor",
      "Shingle profile selector",
      "Roof squares and bundle estimates",
      "Accessory material planning output",
      "Copy and print estimate actions",
    ],
  };
}

export default function RoofingMaterialCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Construction", path: "/construction" },
    { name: "Roofing Material Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildRoofingCalculatorJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/construction" className="hover:text-primary">Construction</Link></li>
            <li>/</li>
            <li className="text-foreground">Roofing Material Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Construction Tool
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Roofing Material Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Find out how many shingle bundles and roofing accessories you need for a replacement.
            Enter your home's footprint, overhang, pitch, and waste factor to get quick estimates with
            no sign-up and no contractor lead capture forms.
          </p>
        </div>

        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <RoofingMaterialCalculator />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            How this roofing calculator works
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            The tool starts with roof footprint (including overhang), applies pitch multiplier to convert
            flat area into real roof surface area, then adds your selected waste factor. From there, it
            estimates squares, bundles, and accessory materials.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            How does roof pitch affect area?
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Roof surfaces are sloped, so real material area is larger than flat footprint. Pitch
            multiplier handles this by scaling footprint area to true roof area. A steeper pitch yields
            more area over the same base dimensions.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            Roof pitch multiplier quick chart
          </h2>
          <div className="mt-4 overflow-x-auto rounded-[1rem] border border-border bg-background">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/60">
                <tr className="text-left text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">Pitch</th>
                  <th className="px-4 py-3 font-semibold">Multiplier (approx.)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border"><td className="px-4 py-3 text-foreground">3/12</td><td className="px-4 py-3 text-foreground">1.03</td></tr>
                <tr className="border-t border-border"><td className="px-4 py-3 text-foreground">4/12</td><td className="px-4 py-3 text-foreground">1.05</td></tr>
                <tr className="border-t border-border"><td className="px-4 py-3 text-foreground">6/12</td><td className="px-4 py-3 text-foreground">1.12</td></tr>
                <tr className="border-t border-border"><td className="px-4 py-3 text-foreground">8/12</td><td className="px-4 py-3 text-foreground">1.20</td></tr>
                <tr className="border-t border-border"><td className="px-4 py-3 text-foreground">10/12</td><td className="px-4 py-3 text-foreground">1.30</td></tr>
                <tr className="border-t border-border"><td className="px-4 py-3 text-foreground">12/12</td><td className="px-4 py-3 text-foreground">1.41</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            What is a roofing square?
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            In North America, roofing materials are measured in <strong>squares</strong>. One square is
            exactly 100 square feet of roof surface.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Standard architectural and 3-tab shingles usually need <strong>3 bundles per square</strong>.
            Wood shakes often need more bundles per square, which is why the profile selector changes
            bundle conversion.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            10% vs 15% vs 20% waste factor
          </h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">5-10%:</strong> straightforward gable roof layouts.</li>
            <li><strong className="text-foreground">10-15%:</strong> hips, valleys, penetrations, and more cuts.</li>
            <li><strong className="text-foreground">20%+:</strong> highly complex geometry or pattern-sensitive layouts.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            How to measure your roof footprint quickly
          </h2>
          <ol className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Measure base length and width of the building footprint.</li>
            <li>Add overhang for eaves so edge materials are not undercounted.</li>
            <li>Set pitch and waste factor, then review squares, bundles, and accessories.</li>
          </ol>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            Material assumptions and limitations
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            This calculator is optimized for shingle-based planning and fast takeoffs. Estimates for
            underlayment, ridge cap, starter strip, drip edge, and fasteners are directional planning
            values, not engineered shop drawings. For complex roofs, measure sections separately and
            combine totals.
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
