import Link from "next/link";
import type { Metadata } from "next";

import { RoomAreaCalculator } from "./components/RoomAreaCalculator";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/construction/room-area-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Room Area Calculator | Square Footage with Additions & Deductions",
  description: "Calculate the exact square footage of any complex room by adding alcoves and subtracting islands or fireplaces. Supports L-shaped and irregular rooms.",
  keywords: ["room area calculator", "square footage calculator", "room size calculator", "floor area calculator", "L-shaped room calculator", "square feet calculator"],
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", url: PAGE_URL, title: "Room Area Calculator", description: "Calculate exact square footage for complex rooms with additions and deductions." },
  twitter: { card: "summary_large_image", title: "Room Area Calculator", description: "Find the exact square footage of any room including L-shapes and irregular layouts." },
};

export default function RoomAreaCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Construction", path: "/construction" },
    { name: "Room Area Calculator", path: PAGE_PATH },
  ]);
  const webAppJsonLd = { "@context": "https://schema.org", "@type": "WebApplication", name: "Room Area Calculator", url: PAGE_URL, applicationCategory: "UtilityApplication", operatingSystem: "All", browserRequirements: "Requires JavaScript", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Free room area calculator for complex rooms with additions and deductions." };

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

      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 bg-white/40 backdrop-blur-3xl shadow-2vw">
        <div className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-muted-foreground">
          <h2 className="text-4xl text-foreground italic">Mastering the Map: A Professional Approach to Floor Area</h2>
          <p>
            Whether you are a homeowner preparing for a DIY flooring project or a real estate agent listing a property, "Total Square Footage" is the single most important number you'll calculate. However, calculating it correctly is more than just length times width—it's about understanding how to piece together architectural geometry.
          </p>
          
          <h3 className="text-foreground">01. The "Deconstruction" Method for Irregular Rooms</h3>
          <p>
            Most modern rooms aren't perfect rectangles. They feature alcoves, chimney breasts, or L-shaped layouts. The professional secret to 100% accuracy is <strong>Deconstruction</strong>.
            <br/><br/>
            Divide your room into the fewest number of large rectangles possible. Calculate the area of each "Zone" separately and then sum them up. Our calculator simplifies this by allowing you to add "Zones" in real-time, instantly totaling your aggregate floor space.
          </p>

          <h3 className="text-foreground">02. Additions vs. Deductions: The Math of Features</h3>
          <p>Floor area isn't just about the walls; it's about what occupies the floor:</p>
          <ul>
            <li><strong>Additions:</strong> Walk-in closets, bay windows, and entry nooks. These are areas you *do* want to include in flooring and paint calculations.</li>
            <li><strong>Deductions:</strong> Kitchen islands, permanent fireplaces, and built-in floor-to-ceiling cabinetry. These subtract from your usable flooring area. If you subtract a 4x6 island, you save 24 square feet of expensive hardwood!</li>
          </ul>

          <div className="my-16 p-10 bg-foreground text-background rounded-[3rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <h3 className="text-primary font-black italic !mt-0">ANSI Standards vs. Material Ordering</h3>
             <p className="opacity-80 leading-relaxed mb-0">
               **Real Estate (ANSI Z765):** Measures from the *outside* of exterior walls. It includes the thickness of the walls themselves.
               <br/><br/>
               **Construction/Remodeling:** Measures the *interior* finish-to-finish surfaces. This is what our calculator uses, as it reflects the actual surface area you need to cover with carpet, tile, or wood.
             </p>
          </div>

          <h3 className="text-foreground">03. The Complexity Factor & Waste Overage</h3>
          <p>
            Once you have your "Net Area," you must apply a waste factor. The more complex the room layout, the more waste you will generate:
          </p>
          <div className="grid sm:grid-cols-3 gap-6 my-10 border border-border rounded-3xl p-8 bg-muted/5">
             <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-primary">Simple Rect</span>
                <p className="text-lg font-bold text-foreground">5% Waste</p>
                <p className="text-xs text-muted-foreground italic">Standard 4-wall room</p>
             </div>
             <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-primary">L-Shaped</span>
                <p className="text-lg font-bold text-foreground">10% Waste</p>
                <p className="text-xs text-muted-foreground italic">Contains alcoves/angles</p>
             </div>
             <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-primary">Diagonal/Herringbone</span>
                <p className="text-lg font-bold text-foreground">15-20% Waste</p>
                <p className="text-xs text-muted-foreground italic">Complex installation patterns</p>
             </div>
          </div>
        </div>
      </section>

      {/* FAQ Grid */}
      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 relative overflow-hidden bg-muted/5">
        <h2 className="text-4xl font-black tracking-tighter text-foreground text-center italic">Area Precision FAQ</h2>
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3 text-balance">
          {[
            { 
              question: "How do I measure a room with curved walls?", 
              answer: "Treat the curve as a rectangle for the main body, then for the circular cap, measure the radius (center to edge) and use (Radius × Radius × 3.14) divide by 2 for a semi-circle. It's best to round up to the nearest foot to cover the waste from curving material." 
            },
            { 
              question: "Should I include the area under doors?", 
              answer: "For flooring installers, yes. The door threshold usually requires a transition strip and extra material. For paint, doors are subtracted from wall area, but don't impact the floor area calculation." 
            },
            { 
              question: "Does finished basement area count as square footage?", 
              answer: "In real estate, only areas above ground (Grade) are typically counted in 'Gross Living Area.' However, for construction and property tax assessments, finished basements are absolutely counted as finished square footage." 
            },
            {
              question: "How do I calculate for staircases?", 
              answer: "Treat each tread (the part you step on) as an individual rectangle. Width of stair × depth of tread × number of steps. Don't forget to include the landing as a separate section."
            },
            {
              question: "How many square feet is a 12x12 room?",
              answer: "A clear 12x12 room is exactly 144 square feet. However, if you have a 2x3 foot closet bump-out, the area might be 150 square feet. This demonstrates why measuring every nook is vital."
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
