import Link from "next/link";
import type { Metadata } from "next";

import { ConcreteVolumeCalculator } from "./components/ConcreteVolumeCalculator";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

export const metadata: Metadata = {
  title: "Concrete Volume Calculator | Free Construction Tools",
  description: "Calculate the volume and number of bags of concrete needed for slabs, footings, and columns in cubic yards, cubic meters, and bags.",
};

const PAGE_PATH = "/construction/concrete-volume-calculator";

export default function ConcreteVolumeCalculatorPage() {
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
            Calculate the exact volume of concrete needed for your project. Choose between slabs, square footings, or circular columns, and easily estimate the number of premixed bags required.
          </p>
        </div>

        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <ConcreteVolumeCalculator />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How much concrete do I need?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Calculating concrete volume relies on simple geometric formulas depending on the shape of your pour.
          </p>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>
              <strong className="text-foreground">Slabs and Footings:</strong> Length x Width x Depth
            </li>
            <li>
              <strong className="text-foreground">Columns and Holes:</strong> Pi x Radius² x Depth
            </li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How many bags of concrete make a yard?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            A single cubic yard of concrete is equal to 27 cubic feet. Here is a quick reference for standard bag sizes:
          </p>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>It takes <strong className="text-foreground">45 bags (80 lb)</strong> to make 1 cubic yard.</li>
            <li>It takes <strong className="text-foreground">60 bags (60 lb)</strong> to make 1 cubic yard.</li>
            <li>It takes <strong className="text-foreground">90 bags (40 lb)</strong> to make 1 cubic yard.</li>
          </ul>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Our calculator automatically includes a standard 5% waste factor for pre-mixed bags. It is always wise to buy an extra bag or two since uneven subgrades, spills, and mixing can reduce your true yield.
          </p>
        </div>
      </section>

      <RelatedToolsSection category="Construction" categoryHref="/construction" currentPath={PAGE_PATH} />
    </div>
  );
}
