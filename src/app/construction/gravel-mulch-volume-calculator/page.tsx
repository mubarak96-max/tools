import Link from "next/link";
import type { Metadata } from "next";

import { GravelMulchVolumeCalculator } from "./components/GravelMulchVolumeCalculator";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

export const metadata: Metadata = {
  title: "Gravel & Mulch Volume Calculator | Cubic Yards Estimator",
  description: "Calculate the exact volume and weight of gravel, crushed stone, mulch, or dirt needed for landscaping.",
};

const PAGE_PATH = "/construction/gravel-mulch-volume-calculator";

export default function GravelMulchVolumeCalculatorPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/construction" className="hover:text-primary">Construction</Link></li>
            <li>/</li>
            <li className="text-foreground">Gravel & Mulch Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Construction Tool
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Gravel & Mulch Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Estimate how many cubic yards of landscaping material to buy. Input your area's dimensions and depth, choose your material, and get the accurate volume along with estimated delivery weight.
          </p>
        </div>

        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <GravelMulchVolumeCalculator />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Why do I need to know the weight?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            While volume (cubic yards or meters) is how material covers physical space, most quarries and landscaping centers charge material by <strong>weight (tons)</strong>. Further, knowing the weight ensures you don't overload your truck or trailer past its payload capacity when picking it up.
          </p>
          
          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Standard Material Densities</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            We use industry standard approximations to estimate weight. Be mindful that water saturation can heavily alter these weights.
          </p>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">Gravel / Crushed Stone:</strong> Very dense. Roughly 1.35 tons per cubic yard.</li>
            <li><strong className="text-foreground">Topsoil / Dirt:</strong> Dense but aerated. Roughly 1.10 tons per cubic yard.</li>
            <li><strong className="text-foreground">Wood Mulch:</strong> Light and porous. Roughly 0.40 tons per cubic yard.</li>
          </ul>
        </div>
      </section>

      <RelatedToolsSection category="Construction" categoryHref="/construction" currentPath={PAGE_PATH} />
    </div>
  );
}
