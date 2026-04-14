import Link from "next/link";
import type { Metadata } from "next";

import { BrickBlockQuantityCalculator } from "./components/BrickBlockQuantityCalculator";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/construction/brick-block-quantity-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Brick & Block Quantity Calculator | Masonry Material Estimator",
  description: "Calculate the exact number of bricks or concrete blocks required for a wall project including mortar joint allowance and standard waste percentage.",
  keywords: ["brick calculator", "block quantity calculator", "masonry calculator", "brick count calculator", "concrete block calculator", "mortar calculator"],
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", url: PAGE_URL, title: "Brick & Block Quantity Calculator", description: "Calculate bricks or blocks needed for any wall project with mortar allowance." },
  twitter: { card: "summary_large_image", title: "Brick & Block Calculator", description: "Estimate bricks, blocks, and mortar for masonry wall projects." },
};

export default function BrickBlockQuantityCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Construction", path: "/construction" },
    { name: "Brick & Block Calculator", path: PAGE_PATH },
  ]);
  const webAppJsonLd = { "@context": "https://schema.org", "@type": "WebApplication", name: "Brick & Block Quantity Calculator", url: PAGE_URL, applicationCategory: "UtilityApplication", operatingSystem: "All", browserRequirements: "Requires JavaScript", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Free brick and block quantity calculator with mortar allowance." };

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(webAppJsonLd)} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
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
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How mortar joint size affects brick count</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            In masonry, the true size of a brick or block in a wall is its nominal (physical) size plus the mortar joint on one side and top. This is called the nominal or coursing size. Standard modular bricks in the US are 8" × 2.25" actual, but with a 3/8" mortar joint the effective laid size becomes 8.375" × 2.625". Over a large wall, this difference significantly reduces the brick count compared to dry stacking.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            The formula for brick count is: <strong>Number of bricks = (Wall area) / (Brick face area including mortar)</strong>. For a wall 10 feet wide × 8 feet tall (80 sq ft) using modular bricks with 3/8" joints: brick face area = 8.375" × 2.625" = 21.98 sq in = 0.1526 sq ft. Bricks needed = 80 / 0.1526 ≈ 524 bricks. Add 10% for waste: 577 bricks.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Standard masonry unit sizes</h2>
          <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">Modular brick (US):</strong> 7.625" × 2.25" × 3.625" actual. With 3/8" mortar: 8" × 2.625" nominal. Approximately 6.75 bricks per square foot of wall face.</li>
            <li><strong className="text-foreground">Standard CMU (concrete block):</strong> 15.625" × 7.625" × 7.625" actual. With 3/8" mortar: 16" × 8" nominal. Approximately 1.125 blocks per square foot.</li>
            <li><strong className="text-foreground">Metric brick (UK/Australia):</strong> 215mm × 65mm × 102.5mm actual. With 10mm mortar: 225mm × 75mm nominal. Approximately 59 bricks per square metre.</li>
            <li><strong className="text-foreground">Retaining wall block:</strong> Varies by manufacturer. Common sizes are 12" × 4" face. Always verify with your specific product.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Mortar quantity estimation</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Mortar is typically estimated at 0.3–0.5 cubic feet per 100 standard bricks, depending on joint thickness and brick size. For a 3/8" joint with modular bricks, plan for approximately 7 bags of 60 lb mortar mix per 100 square feet of wall. Pre-mixed mortar bags typically cover 25–30 bricks each.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Mortar has a working time of approximately 1–2 hours after mixing. Mix only what you can use in that time. In hot or windy conditions, working time is shorter. In cold weather (below 40°F / 4°C), mortar should not be used without cold-weather additives or heating measures.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Waste allowance and ordering tips</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Always order more bricks than your calculated quantity. Standard waste allowances:
          </p>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">Straight walls:</strong> Add 5–10% for cuts, breakage, and defects.</li>
            <li><strong className="text-foreground">Walls with openings (doors/windows):</strong> Add 10–15% as cuts around openings generate significant waste.</li>
            <li><strong className="text-foreground">Curved or angled walls:</strong> Add 15–20% due to the higher proportion of cut bricks required.</li>
            <li><strong className="text-foreground">Pattern work (herringbone, basket weave):</strong> Add 20–25% as diagonal cuts waste more material.</li>
          </ul>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Order from the same production batch (lot number) when possible. Bricks from different batches can vary slightly in colour and size, which is noticeable in finished work.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">
            {[
              { question: "How many bricks per square foot?", answer: "Standard modular bricks with 3/8\" mortar joints cover approximately 6.75 bricks per square foot of wall face. Metric bricks cover approximately 59 bricks per square metre. CMU concrete blocks cover approximately 1.125 blocks per square foot." },
              { question: "How do I calculate bricks for a wall with windows?", answer: "Calculate the total wall area, subtract the area of all openings (doors and windows), then apply your brick count formula to the net area. Add 10–15% waste allowance for the additional cuts required around openings." },
              { question: "What is the difference between a brick and a block?", answer: "Bricks are smaller solid or cored clay or concrete units, typically used for facing and structural walls. Blocks (CMU) are larger hollow concrete units used primarily for structural walls, foundations, and retaining walls. Blocks are faster to lay but less aesthetically refined than brick." },
              { question: "How much does a brick weigh?", answer: "A standard modular brick weighs approximately 4.5 lbs (2 kg). A standard CMU concrete block weighs approximately 28–35 lbs (13–16 kg) depending on whether it is lightweight or normal weight aggregate." },
              { question: "Can I use this calculator for retaining walls?", answer: "Yes. Enter the wall face dimensions and your specific block size. For retaining walls, also account for the batter (backward lean) of the wall, which reduces the effective face area slightly. Most retaining wall blocks have a built-in setback of 1/2\" to 1\" per course." },
            ].map((item) => (
              <article key={item.question} className="rounded-[1.25rem] border border-border bg-background p-5">
                <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <RelatedToolsSection category="Construction" categoryHref="/construction" currentPath={PAGE_PATH} />
    </div>
  );
}
