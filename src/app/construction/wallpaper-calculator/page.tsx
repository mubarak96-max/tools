import Link from "next/link";
import type { Metadata } from "next";

import { WallpaperCalculator } from "./components/WallpaperCalculator";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/construction/wallpaper-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Wallpaper Calculator | Rolls Estimator with Pattern Repeat",
  description: "Calculate how many rolls of wallpaper you need for your room. Enter dimensions, roll size, and pattern repeat for an accurate estimate including waste.",
  keywords: ["wallpaper calculator", "wallpaper rolls calculator", "wallpaper estimator", "pattern repeat calculator", "how many rolls of wallpaper", "wallpaper quantity calculator"],
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", url: PAGE_URL, title: "Wallpaper Calculator — Rolls & Pattern Repeat", description: "Calculate wallpaper rolls needed for any room with pattern repeat waste allowance." },
  twitter: { card: "summary_large_image", title: "Wallpaper Calculator", description: "Find out how many wallpaper rolls you need including pattern repeat waste." },
};

export default function WallpaperCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Construction", path: "/construction" },
    { name: "Wallpaper Calculator", path: PAGE_PATH },
  ]);
  const webAppJsonLd = { "@context": "https://schema.org", "@type": "WebApplication", name: "Wallpaper Calculator", url: PAGE_URL, applicationCategory: "UtilityApplication", operatingSystem: "All", browserRequirements: "Requires JavaScript", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Free wallpaper rolls calculator with pattern repeat waste allowance." };

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

      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 bg-white/40 backdrop-blur-3xl shadow-2vw">
        <div className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-muted-foreground">
          <h2 className="text-4xl text-foreground italic">The Science of Wallpaper Calculation: Avoiding the "Short One Roll" Nightmare</h2>
          <p>
            Wallpapering is one of the most transformative interior design projects you can undertake, yet it is often the most frustrating due to poor planning. Ordering too little wallpaper can be a catastrophe, as separate manufacturing batches (dye lots) often have subtle color variations. Ordering too much is a waste of money. 
          </p>
          
          <h3 className="text-foreground">01. Why Pattern Repeat is Your Biggest Variable</h3>
          <p>
            Wallpaper is hung in vertical strips called "drops." If your wallpaper has a repeating pattern, every strip must be shifted upward or downward to align perfectly with the adjacent piece. This shift creates <strong>"pattern waste."</strong>
            <br/><br/>
            The larger the pattern repeat (the vertical distance before the design starts over), the more waste you will generate per strip. A 24-inch repeat on a 9-foot wall might result in 15-20% material loss. Our calculator accounts for this by calculating "usable height" rather than just raw area.
          </p>

          <h3 className="text-foreground">02. Deciphering Pattern Match Types</h3>
          <p>The label on your roll will indicate one of three match types. Choosing the wrong one in your calculation will lead to an incorrect order:</p>
          <ul>
            <li><strong>Free Match (No Repeat):</strong> Typically textures or solid colors. The easiest to calculate as no alignment is needed.</li>
            <li><strong>Straight Match:</strong> The pattern repeats horizontally at the same height across every strip. Each strip starts at the same point in the cycle.</li>
            <li><strong>Drop Match / Half-Drop:</strong> To create a larger, more complex visual, the pattern alternates. Strip 1 and Strip 3 match, while Strip 2 is shifted down by half the repeat length. This requires the most careful calculation.</li>
          </ul>

          <div className="my-16 p-10 bg-foreground text-background rounded-[3rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <h3 className="text-primary font-black italic !mt-0">Pro Secret: The "Batch Match" Rule</h3>
             <p className="opacity-80 leading-relaxed mb-0">
               Always check the **Dye Lot Number** or **Run Number** on every roll before you open the plastic. Even the most expensive brands have slight color shifts between production runs. If you realize you are short and order one more roll three weeks later, the new roll may look like a different shade of blue once it dries on your wall. Always order 1 bonus roll to keep in the attic for future repairs.
             </p>
          </div>

          <h3 className="text-foreground">03. Usable Area vs. Total Area</h3>
          <p>
            A standard European/UK roll is usually 20.5 inches wide and 33 feet long (covering roughly 56 sq ft). However, once you account for trimming at the ceiling, the baseboard, and the pattern shift, you rarely get more than 45-50 square feet of <strong>usable coverage</strong> out of that roll. 
            <br/><br/>
            Our tool uses a "Drop Count" logic rather than the "Area Method" used by basic calculators. We determine how many full vertical strips you can get out of a single roll. If your wall is 8 feet high and your roll is 33 feet, you can theoretically get 4 strips—but if you have a 12-inch repeat, you might only get 3 strips.
          </p>

          <h3 className="text-foreground">04. How to Measure Complex Rooms</h3>
          <p>
            Don't just measure the floor area. Measure the <strong>Perimeter</strong> (the total distance around all walls).
            <ul>
              <li><strong>Windows & Doors:</strong> For standard small windows, don't subtract them from your calculation. The extra wallpaper acts as your safety margin. Only subtract large features like 8-foot sliding glass doors or double entryways.</li>
              <li><strong>Wait for the Surface:</strong> Ensure your walls are primed with a "wallpaper primer" or "sizer" before installation. This prevents the adhesive from soaking into the drywall and making the paper impossible to adjust.</li>
            </ul>
          </p>

          <h3 className="text-foreground">05. Standard Roll Reference Chart</h3>
          <div className="not-prose grid sm:grid-cols-2 gap-6 my-10">
             <div className="p-8 rounded-3xl bg-muted/10 border border-border">
                <span className="text-[10px] font-black uppercase text-primary">Standard US Roll</span>
                <p className="text-sm font-bold mt-2 text-foreground">27" Wide x 13.5' Long</p>
                <p className="text-xs text-muted-foreground mt-1">Covers ~30 sq ft total. Usable ~25 sq ft.</p>
             </div>
             <div className="p-8 rounded-3xl bg-muted/10 border border-border">
                <span className="text-[10px] font-black uppercase text-primary">Standard Euro/UK Roll</span>
                <p className="text-sm font-bold mt-2 text-foreground">20.5" Wide x 33' Long</p>
                <p className="text-xs text-muted-foreground mt-1">Covers ~56 sq ft total. Usable ~48 sq ft.</p>
             </div>
          </div>
        </div>
      </section>

      {/* FAQ Grid */}
      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 relative overflow-hidden bg-muted/5">
        <h2 className="text-4xl font-black tracking-tighter text-foreground text-center italic">Wallpaper Precision FAQ</h2>
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3 text-balance">
          {[
            { 
              question: "How do I calculate for sloped or vaulted ceilings?", 
              answer: "Measure the wall at its highest point. It's better to calculate based on the tall section for every strip that touches the slope. You will have more waste, but you guarantee that the pattern continuous perfectly across the angle." 
            },
            { 
              question: "What is 'Sizing' and do I need to include it in cost?", 
              answer: "Sizing is a primer that makes the wall 'slippery' so you can slide the wallpaper into place to match the pattern. It costs about $15 per gallon and covers 400 sq ft. Absolutely include it for a professional finish." 
            },
            { 
              question: "Can I use 'Peel and Stick' wallpaper with this calculator?", 
              answer: "Yes. The math for coverage and pattern repeat remains identical. However, peel-and-stick is harder to adjust if you miss a match, so we recommend increasing your waste factor by 5%." 
            },
            {
              question: "How many rolls of wallpaper do I need for a 12×12 room?", 
              answer: "Assuming 8-foot ceilings and one door: A 12x12 room has 48 linear feet of wall. At 21-inch width, you need 28 drops. If using Euro rolls (33ft), you get 4 drops per roll (if no repeat). 28 / 4 = 7 rolls. Safely order 8."
            },
            {
              question: "What's the difference between a single and double roll?",
              answer: "This is a common source of confusion in the US. Most wallpaper is *priced* in single rolls but only *sold* in double rolls (one continuous long roll). Our calculator asks for the actual length to avoid this confusion."
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
