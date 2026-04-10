import Link from "next/link";
import type { Metadata } from "next";

import { WallpaperCalculator } from "./components/WallpaperCalculator";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

export const metadata: Metadata = {
  title: "Wallpaper Calculator | Drops and Rolls Estimator",
  description: "Calculate how many rolls of wallpaper you need for your room dimensions, roll size, and pattern repeat.",
};

const PAGE_PATH = "/construction/wallpaper-calculator";

export default function WallpaperCalculatorPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/construction" className="hover:text-primary">Construction</Link></li>
            <li>/</li>
            <li className="text-foreground">Wallpaper Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Construction Tool
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Wallpaper Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Find out exactly how many rolls of wallpaper or wall-coverings you'll need. Input the perimeter of your room, ceiling height, and your specific roll and pattern repeat details.
          </p>
        </div>

        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <WallpaperCalculator />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Why does Pattern Repeat matter?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Wallpaper isn't sold purely by the square foot. Instead, it is hung in vertical "strips" or "drops". If your wallpaper has a repeating pattern (like a floral or geometric design), you will often have to trim off and discard several inches from the top of the roll just to ensure the pattern aligns perfectly with the adjacent strip.
          </p>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">Solid or Texture:</strong> 0" pattern repeat (no extra waste).</li>
            <li><strong className="text-foreground">Straight Match:</strong> The design repeats horizontally across the strip at exactly the same place.</li>
            <li><strong className="text-foreground">Drop Match:</strong> The most complex. The design aligns diagonally across strips, meaning you often need to waste up to a full pattern repeat (18-24") per strip cut!</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">A Note on Standard Rolls</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            In North America and the UK, standard single wallpaper rolls usually cover around 28 square feet. However, they are often packaged as "Double Rolls" yielding ~56 square feet. Always verify exactly how your chosen roll is priced and packaged. This calculator uses the specific dimensions you input to bypass standard size confusion completely.
          </p>
        </div>
      </section>

      <RelatedToolsSection category="Construction" categoryHref="/construction" currentPath={PAGE_PATH} />
    </div>
  );
}
