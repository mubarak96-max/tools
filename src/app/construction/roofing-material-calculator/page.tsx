import Link from "next/link";
import type { Metadata } from "next";

import { RoofingMaterialCalculator } from "./components/RoofingMaterialCalculator";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

export const metadata: Metadata = {
  title: "Roofing Material Calculator | Sheets, Bundles & Squares",
  description: "Calculate squares of shingles and bundles needed for your roof based on base area and pitch multiplier.",
};

const PAGE_PATH = "/construction/roofing-material-calculator";

export default function RoofingMaterialCalculatorPage() {
  return (
    <div className="space-y-8">
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
            Find out exactly how many bundles of shingles you need for a roof replacement. Simply enter your home's footprint, overhang width, and roof pitch to instantly get your total squares, squares with waste, and required bundles.
          </p>
        </div>

        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <RoofingMaterialCalculator />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How does roof pitch affect area?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Roof materials are sloped, which means the true surface area is longer than the flat square footage measured from above. The pitch determines the precise multiplier. A steeper pitch yields a larger surface area over the same home base footprint than a shallow pitch.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">What is a Roofing Square?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            In North America, roofing materials are commonly measured in <strong>squares</strong>. One square is exactly equal to 100 square feet of surface area. 
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            A single bundle of standard 3-tab or architectural shingles typically covers 33.3 square feet, which means it takes <strong>3 bundles to make one square</strong>. Our calculator automatically applies an industry-recommended 10% waste buffer to the bundles to handle cut valleys, rake edges, and hip and ridge gaps.
          </p>
        </div>
      </section>

      <RelatedToolsSection category="Construction" categoryHref="/construction" currentPath={PAGE_PATH} />
    </div>
  );
}
