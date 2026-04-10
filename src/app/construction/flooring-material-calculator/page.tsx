import Link from "next/link";
import type { Metadata } from "next";

import { FlooringMaterialCalculator } from "./components/FlooringMaterialCalculator";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

export const metadata: Metadata = {
  title: "Flooring Material Calculator | Total Sq Ft & Boxes Needed",
  description: "Calculate total square footage, apply standard waste factors, and figure out how many boxes of flooring you need for your remodel or renovation.",
};

const PAGE_PATH = "/construction/flooring-material-calculator";

export default function FlooringMaterialCalculatorPage() {
  return (
    <div className="space-y-8">
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
            Quickly estimate the exact amount of flooring you need to purchase by factoring in room dimensions, waste margins, and box coverage specs.
          </p>
        </div>

        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <FlooringMaterialCalculator />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Why do I need a waste factor?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            A waste factor refers to the extra percentage of flooring you must order. You'll have offcuts, angled cuts around walls or cabinets, and occasionally a damaged plank.
          </p>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">5-10% Waste:</strong> Ideal for standard square or rectangular rooms.</li>
            <li><strong className="text-foreground">15% Waste:</strong> Required for rooms with diagonal installations or multiple obstacles.</li>
            <li><strong className="text-foreground">20%+ Waste:</strong> Best for very custom patterns (like herringbone) or many stairs.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Understanding Box Coverage</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Hardwood, LVP, and laminate flooring is sold by the box/carton, not strictly by the square foot. Each manufacturer packs a specific square footage into a carton (usually between 18 and 30 sq ft). Our calculator divides your total needed square footage by box coverage and always rounds up so you don't run short.
          </p>
        </div>
      </section>

      <RelatedToolsSection category="Construction" categoryHref="/construction" currentPath={PAGE_PATH} />
    </div>
  );
}
