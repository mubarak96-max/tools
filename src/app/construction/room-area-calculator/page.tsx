import Link from "next/link";
import type { Metadata } from "next";

import { RoomAreaCalculator } from "./components/RoomAreaCalculator";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

export const metadata: Metadata = {
  title: "Room Area Calculator | Square Footage with Additions & Deductions",
  description: "Calculate the exact square footage of any complex room by adding standard alcoves and subtracting islands or fireplaces.",
};

const PAGE_PATH = "/construction/room-area-calculator";

export default function RoomAreaCalculatorPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/construction" className="hover:text-primary">Construction</Link></li>
            <li>/</li>
            <li className="text-foreground">Room Area Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Construction Tool
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Room Area Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Find the exact square footage of your room. Easily piece together complex L-shaped rooms or large spaces by defining a base square and adding or subtracting smaller zones like closets and kitchen islands.
          </p>
        </div>

        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <RoomAreaCalculator />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How to measure arbitrary rooms</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Rooms are rarely perfectly square. Most contain closets, small alcoves, fireplaces, or fixed kitchen islands that you don't need flooring or painting on.
          </p>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">The Base Rectangle:</strong> Find the longest contiguous length and width of the room. Use this as your Base Dimension.</li>
            <li><strong className="text-foreground">Additions:</strong> Measure the length and width of any extra spaces outside the main rectangle (like an entryway hall or walk-in closet). Click "Add Area" and input them.</li>
            <li><strong className="text-foreground">Deductions:</strong> Measure the width and depth of obstacles inside the base rectangle that you can't walk on or don't need materials for (like a kitchen island, stairs, or hearth). Click "Add Deduction" to subtract them from the total.</li>
          </ul>
        </div>
      </section>

      <RelatedToolsSection category="Construction" categoryHref="/construction" currentPath={PAGE_PATH} />
    </div>
  );
}
