import Link from "next/link";
import type { Metadata } from "next";

import { PaintCoverageCalculator } from "./components/PaintCoverageCalculator";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

export const metadata: Metadata = {
  title: "Paint Coverage Calculator | Free Construction Tools",
  description: "Calculate the exact number of paint gallons or liters needed to cover walls and ceilings based on room dimensions and coats.",
};

const PAGE_PATH = "/construction/paint-coverage-calculator";

export default function PaintCoverageCalculatorPage() {
  return (
    <div className="space-y-8">
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
            Estimate how much paint you need for your next room makeover. Just input the dimensions of your room, the number of doors and windows, and we'll calculate the footprint in gallons or liters.
          </p>
        </div>

        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <PaintCoverageCalculator />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How do you calculate paint coverage?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Calculating paint coverage is easy once you know your wall dimensions. Our calculator performs the standard "Room Perimeter" calculation automatically:
          </p>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>
              <strong className="text-foreground">1. Find Total Wall Area:</strong> (Room Length + Room Width) × 2 × Ceiling Height
            </li>
            <li>
              <strong className="text-foreground">2. Deduct Obstacles:</strong> Subtract ~21 sq ft (2 sq m) per door and ~15 sq ft (1.4 sq m) per window.
            </li>
            <li>
              <strong className="text-foreground">3. Find Total Paint Need:</strong> Divide the final footage by your paint's spread rate (typically 350 sq ft per gallon or 10 sq m per liter).
            </li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How many coats of paint do I need?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Most interior projects require at least <strong className="text-foreground">two coats</strong> for a durable, true-to-color finish.
          </p>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">1 Coat:</strong> Only suitable when re-painting the exact same color over a clean wall with high-quality paint.</li>
            <li><strong className="text-foreground">2 Coats:</strong> The industry standard. Delivers rich color and covers minor underlying imperfections.</li>
            <li><strong className="text-foreground">3+ Coats:</strong> Necessary when painting over a dark color with a lighter color, or when painting over porous fresh drywall (if not using a separate primer).</li>
          </ul>
        </div>
      </section>

      <RelatedToolsSection category="Construction" categoryHref="/construction" currentPath={PAGE_PATH} />
    </div>
  );
}
