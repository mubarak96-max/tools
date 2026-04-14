import Link from "next/link";
import type { Metadata } from "next";

import { GravelMulchVolumeCalculator } from "./components/GravelMulchVolumeCalculator";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/construction/gravel-mulch-volume-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Gravel & Mulch Volume Calculator | Cubic Yards & Weight Estimator",
  description: "Calculate the exact volume and weight of gravel, crushed stone, mulch, or topsoil needed for landscaping. Get cubic yards and estimated delivery weight.",
  keywords: ["gravel calculator", "mulch calculator", "cubic yards calculator", "landscaping material calculator", "gravel volume calculator", "topsoil calculator"],
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", url: PAGE_URL, title: "Gravel & Mulch Volume Calculator", description: "Calculate cubic yards and weight of gravel, mulch, or topsoil for landscaping." },
  twitter: { card: "summary_large_image", title: "Gravel & Mulch Calculator", description: "Estimate volume and weight of landscaping materials in cubic yards and tons." },
};

export default function GravelMulchVolumeCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Construction", path: "/construction" },
    { name: "Gravel & Mulch Calculator", path: PAGE_PATH },
  ]);
  const webAppJsonLd = { "@context": "https://schema.org", "@type": "WebApplication", name: "Gravel & Mulch Volume Calculator", url: PAGE_URL, applicationCategory: "UtilityApplication", operatingSystem: "All", browserRequirements: "Requires JavaScript", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Free gravel and mulch volume calculator with weight estimation." };

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
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Why weight matters as much as volume</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            While volume (cubic yards or cubic metres) tells you how much space the material will fill, most quarries and landscaping suppliers sell bulk materials by weight (tons). Knowing the weight also prevents overloading your vehicle — a standard pickup truck has a payload capacity of 1,000–2,000 lbs, while a cubic yard of gravel weighs approximately 2,700 lbs. That is more than most trucks can safely carry in a single load.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            The volume-to-weight conversion uses bulk density, which varies significantly between materials and is affected by moisture content. Wet gravel can weigh 10–15% more than dry gravel. Always ask your supplier for the specific density of the material you are ordering.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Standard material densities</h2>
          <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">Pea gravel / crushed stone:</strong> 1.35–1.45 tons per cubic yard (1,800–1,950 kg/m³). Dense and heavy. Commonly used for driveways, drainage, and decorative ground cover.</li>
            <li><strong className="text-foreground">River rock / decorative stone:</strong> 1.35–1.50 tons per cubic yard. Similar to crushed stone but rounded. Used for landscaping beds and water features.</li>
            <li><strong className="text-foreground">Topsoil:</strong> 1.00–1.20 tons per cubic yard (1,350–1,620 kg/m³). Density varies with moisture and organic content. Dry topsoil is lighter; wet topsoil is heavier.</li>
            <li><strong className="text-foreground">Fill dirt / subsoil:</strong> 1.10–1.30 tons per cubic yard. Denser than topsoil due to lower organic content and finer particle size.</li>
            <li><strong className="text-foreground">Wood mulch (shredded):</strong> 0.35–0.45 tons per cubic yard (470–610 kg/m³). Very light. A cubic yard covers approximately 100 sq ft at 3-inch depth.</li>
            <li><strong className="text-foreground">Bark mulch (nuggets):</strong> 0.40–0.50 tons per cubic yard. Slightly denser than shredded mulch. Lasts longer but allows more weed growth.</li>
            <li><strong className="text-foreground">Sand:</strong> 1.30–1.50 tons per cubic yard. Used for levelling, drainage, and as a base for pavers.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Recommended depths by application</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            The depth of material you need depends on its purpose:
          </p>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">Decorative gravel (pathways, beds):</strong> 2–3 inches (5–7.5 cm). Enough to suppress weeds and provide visual coverage.</li>
            <li><strong className="text-foreground">Driveway gravel:</strong> 4–6 inches (10–15 cm) for a new driveway. 2–3 inches for a top-up layer.</li>
            <li><strong className="text-foreground">Drainage gravel:</strong> 6–12 inches (15–30 cm) depending on drainage requirements.</li>
            <li><strong className="text-foreground">Mulch (weed suppression):</strong> 2–3 inches (5–7.5 cm). More than 4 inches can prevent water penetration and cause root problems.</li>
            <li><strong className="text-foreground">Topsoil (lawn or garden):</strong> 4–6 inches (10–15 cm) for new lawns; 6–12 inches for vegetable gardens.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Compaction factor</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Loose materials compact when loaded, transported, and placed. Gravel typically compacts by 15–20% from its loose volume. If you need 10 cubic yards of compacted gravel, order 11.5–12 cubic yards of loose material. Topsoil compacts by 20–30% when settled. Mulch compacts very little (5–10%) as it is already loose.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            For critical applications like driveway bases or structural fill, always account for compaction in your calculations. This calculator provides loose volume — add the appropriate compaction factor for your material and application.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">
            {[
              { question: "How many cubic yards in a ton of gravel?", answer: "One ton of gravel is approximately 0.74 cubic yards (1 cubic yard weighs about 1.35 tons). For a quick estimate, divide the number of tons by 1.35 to get cubic yards, or multiply cubic yards by 1.35 to get tons." },
              { question: "How much does a cubic yard of mulch cover?", answer: "One cubic yard of mulch covers approximately 100 square feet at 3-inch depth, 150 square feet at 2-inch depth, or 75 square feet at 4-inch depth. For most landscaping beds, 2–3 inches is the recommended depth." },
              { question: "How do I calculate cubic yards from square feet?", answer: "Multiply the area in square feet by the depth in inches, then divide by 324. For example, 500 sq ft at 3 inches deep: (500 × 3) / 324 = 4.63 cubic yards." },
              { question: "Can I pick up gravel in my truck?", answer: "A standard half-ton pickup can safely carry about 1,000 lbs (0.37 cubic yards of gravel). A three-quarter ton truck can carry about 1,500 lbs (0.55 cubic yards). For larger quantities, arrange delivery or make multiple trips." },
              { question: "How much does gravel delivery cost?", answer: "Delivery costs vary by location and quantity. Most suppliers charge a flat delivery fee of $50–$150 for local deliveries, with minimum order quantities of 1–5 cubic yards. Bulk orders (10+ yards) often qualify for reduced delivery rates." },
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
