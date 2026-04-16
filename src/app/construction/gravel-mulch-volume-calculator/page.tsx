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

      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 bg-white/40 backdrop-blur-3xl shadow-2vw">
        <div className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-muted-foreground">
          <h2 className="text-4xl text-foreground italic">Beyond the Surface: The Professional's Guide to Landscaping Volume</h2>
          <p>
            Whether you are installing a gravel driveway, refreshing your garden's mulch, or leveling a yard with topsoil, the most common mistake is underestimating the volume needed for settlement and compaction. Buying in bulk is significantly cheaper than buying by the bag, but it requires precision calculation to avoid the high cost of a "short-load" delivery fee for a second trip.
          </p>
          
          <h3 className="text-foreground">01. Volume vs. Weight: Why Quarries Sell by the Ton</h3>
          <p>
            While we think in <strong>Cubic Yards</strong> (volume), most quarries sell bulk material by <strong>Weight (Tons)</strong>. This is because their loader scales measure weight in real-time. 
            <br/><br/>
            One cubic yard of gravel typically weighs about 1.4 tons (2,800 lbs). However, a cubic yard of mulch only weighs about 0.4 tons (800 lbs). Our calculator bridging this gap by using standard material density constants, ensuring you know exactly what your delivery truck will be carrying.
          </p>

          <h3 className="text-foreground">02. The Compaction Factor: The "Hidden" 20%</h3>
          <p>Loose material occupies more space than settled material. Professionals always add a compaction factor based on the application:</p>
          <ul>
            <li><strong>Driveway Gravel:</strong> Needs 20-30% extra. As cars drive over the stones, they lock together and the "air voids" disappear, effectively lowering the surface level.</li>
            <li><strong>Garden Mulch:</strong> Needs 10-15% extra. While it doesn't compact under weight, it settles quickly after the first rain.</li>
            <li><strong>Topsoil for Lawns:</strong> Needs 25% extra. Soil contains air pockets that vanish as the ground is watered or rolled before seeding.</li>
          </ul>

          <div className="my-16 p-10 bg-foreground text-background rounded-[3rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <h3 className="text-primary font-black italic !mt-0">Pro Tip: Measuring Irregular Shapes</h3>
             <p className="opacity-80 leading-relaxed mb-0 text-balance">
               Landscapes are rarely perfect rectangles. To calculate irregular beds:
               <br/><br/>
               • **Circles:** Calculate (Radius × Radius × 3.14).
               <br/>
               • **Triangles:** Calculate (Base × Height ÷ 2).
               <br/>
               • **Kidney Shapes:** Measure the length, then measure the width at 3 different points. Average those widths and treat it like a rectangle.
             </p>
          </div>

          <h3 className="text-foreground">03. Material Reference & Density Table</h3>
          <div className="overflow-x-auto my-10 border border-border rounded-3xl bg-muted/5">
            <table className="w-full text-sm">
              <thead className="bg-muted/20 text-foreground font-black uppercase text-[10px] tracking-widest text-left">
                <tr>
                  <th className="p-6">Material Type</th>
                  <th className="p-6">Lbs per Yard</th>
                  <th className="p-6">Tons per Yard</th>
                  <th className="p-6">Best Use</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { name: "Pea Gravel", lbs: "2,800", tons: "1.4", use: "Walkways/Drainage" },
                  { name: "Crushed Stone", lbs: "2,950", tons: "1.48", use: "Driveway Base" },
                  { name: "Shredded Mulch", lbs: "800", tons: "0.4", use: "Gardens/Moisture" },
                  { name: "Screened Topsoil", lbs: "2,200", tons: "1.1", use: "Lawn Leveling" },
                  { name: "Sharp Sand", lbs: "2,700", tons: "1.35", use: "Paver Base" }
                ].map((row) => (
                  <tr key={row.name} className="hover:bg-primary/5 transition-colors">
                    <td className="p-6 font-bold text-foreground">{row.name}</td>
                    <td className="p-6 italic">{row.lbs}</td>
                    <td className="p-6 font-black">{row.tons}</td>
                    <td className="p-6 text-muted-foreground">{row.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-foreground">04. Determining the Right Depth</h3>
          <p>
            Correct depth is critical for both function and cost-efficiency:
            <ul>
              <li><strong>Weed Suppression (Mulch):</strong> 3 inches is the "goldilocks" zone. Less than 2 inches allows sunlight to hit seeds; more than 4 inches can choke plant roots.</li>
              <li><strong>Walking Paths (Gravel):</strong> 2 inches of pea gravel is sufficient. Any deeper and your feet will "sink" into the stones, making it difficult to walk or push a stroller.</li>
              <li><strong>Driveway (Gravel):</strong> 4-6 inches. A new driveway requires a 4-inch base of "Crusher Run" (coarse) and a 2-inch top layer of decorative stone.</li>
            </ul>
          </p>
        </div>
      </section>

      {/* FAQ Grid */}
      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 relative overflow-hidden bg-muted/5">
        <h2 className="text-4xl font-black tracking-tighter text-foreground text-center italic">Landscape Estimator FAQ</h2>
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3 text-balance">
          {[
            { 
              question: "How many cubic yards are in a standard dump truck?", 
              answer: "A standard small dump truck (single axle) typically holds 5-7 cubic yards. A large 'Tri-axle' commercial truck can carry 15-20 yards. Always confirm access for large trucks before ordering." 
            },
            { 
              question: "What's the difference between mulch and compost?", 
              answer: "Mulch is a protective 'blanket' for the surface (bark, straw, stones). Compost is an organic 'amendment' designed to be mixed into the soil to provide nutrients. You calculate volume for both using the same formula." 
            },
            { 
              question: "Why does my gravel look dusty/dirty when delivered?", 
              answer: "Quarry gravel (like 57 stone or crusher run) is unwashed and contains 'fines' (rock dust). These fines are actually beneficial for driveways as they help lock the stones together. Rain will wash the dust off decorative stones within a week." 
            },
            {
              question: "Can I put mulch directly over weeds?", 
              answer: "No. While 3 inches of mulch might slow them down, established weeds will grow right through. For best results, clear the area, apply a pre-emergent herbicide or landscape fabric, then calculate your mulch volume."
            },
            {
              question: "Should I buy by the bag or in bulk?",
              answer: "Bulk is almost always 40-60% cheaper if you need more than 1 cubic yard. One yard equals 27 bags (1 cubic foot each) or 13.5 large bags (2 cubic feet each). If your calculation says you need more than 25 small bags, order bulk."
            }
          ].map((item) => (
            <article key={item.question} className="p-8 rounded-[2.5rem] border border-border bg-background hover:shadow-2xl transition-all flex flex-col justify-between group">
              <div>
                <h3 className="text-lg font-black text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">{item.question}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-border flex items-center gap-2 text-[10px] font-black uppercase text-primary tracking-widest">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Expert Answer
              </div>
            </article>
          ))}
        </div>
      </section>

      <RelatedToolsSection category="Construction" categoryHref="/construction" currentPath={PAGE_PATH} />
    </div>
  );
}
