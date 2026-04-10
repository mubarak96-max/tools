import Link from "next/link";
import type { Metadata } from "next";

import { BrickBlockQuantityCalculator } from "./components/BrickBlockQuantityCalculator";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

export const metadata: Metadata = {
  title: "Brick & Block Quantity Calculator | Masonry Tools",
  description: "Calculate the exact number of bricks or concrete blocks required for a wall project including mortar allowance and standard waste.",
};

const PAGE_PATH = "/construction/brick-block-quantity-calculator";

export default function BrickBlockQuantityCalculatorPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/construction" className="hover:text-primary">Construction</Link></li>
            <li>/</li>
            <li className="text-foreground">Brick / Block Quantity Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Construction Tool
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Brick & Block Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            A precise masonry calculator that determines the total number of bricks, retaining wall blocks, or concrete cinder blocks needed based on wall dimensions and mortar gap sizes.
          </p>
        </div>

        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <BrickBlockQuantityCalculator />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How does mortar size change the block count?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            In masonry, the true size of a block is technically its nominal (physical) size plus the size of the mortar joint bounding it on one side and top.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            For example, standard modular bricks in the US are roughly 8" × 2.25". But with a standard 3/8" (0.375") mortar joint, the <em>effective laid size</em> becomes 8.375" × 2.625". Over large walls, this significantly reduces the number of bricks required compared to stacking them dry.
          </p>
          
          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Standard Masonry Sizes</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">Modular Brick (US):</strong> 8" L × 2.25" H</li>
            <li><strong className="text-foreground">Standard Cinder Block (CMU):</strong> 16" L × 8" H (actual is often 15.625" × 7.625" to allow for 3/8" mortar)</li>
            <li><strong className="text-foreground">Metric Brick (UK/AUS):</strong> ~ 215mm L × 65mm H</li>
          </ul>
        </div>
      </section>

      <RelatedToolsSection category="Construction" categoryHref="/construction" currentPath={PAGE_PATH} />
    </div>
  );
}
