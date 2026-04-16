import Link from "next/link";
import type { Metadata } from "next";
import { StaircaseCalculator } from "./components/StaircaseCalculator";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/construction/staircase-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is the ideal rise and run for stairs?",
    answer:
      "The most comfortable stair dimensions follow the rule: 2 × rise + run = 24–25 inches. A common comfortable combination is a 7-inch rise and 11-inch run (2×7 + 11 = 25). Building codes typically require a maximum rise of 7.75 inches and minimum run of 10 inches for residential stairs.",
  },
  {
    question: "How do I calculate the number of steps?",
    answer:
      "Divide the total rise (floor-to-floor height) by your desired riser height. For a 9-foot ceiling (108 inches) with 7-inch risers: 108 / 7 = 15.4, rounded up to 16 risers. Note that the number of treads is always one less than the number of risers — 16 risers means 15 treads.",
  },
  {
    question: "What is stringer length and how is it calculated?",
    answer:
      "The stringer is the diagonal structural member that supports the treads and risers. Its length is calculated using the Pythagorean theorem: stringer length = √(total rise² + total run²). For a staircase with 112-inch total rise and 150-inch total run: √(112² + 150²) = √(12544 + 22500) = √35044 ≈ 187 inches.",
  },
  {
    question: "What is the minimum headroom for stairs?",
    answer:
      "Building codes in the US (IRC) require a minimum headroom clearance of 6 feet 8 inches (80 inches) measured vertically from the stair nosing to the ceiling or obstruction above. This applies to the entire stairway, including landings.",
  },
  {
    question: "How wide should residential stairs be?",
    answer:
      "The IRC requires a minimum clear width of 36 inches for residential stairs. For comfortable two-way traffic, 42–48 inches is recommended. Commercial stairs typically require 44 inches minimum. Handrails can project up to 4.5 inches into the required width on each side.",
  },
];

export const metadata: Metadata = {
  title: "Staircase Calculator | Rise, Run, Stringer Length & Step Count",
  description:
    "Calculate stringer length, number of steps, riser height, and tread depth for building a staircase. Includes building code compliance checks for residential stairs.",
  keywords: [
    "staircase calculator",
    "stair rise run calculator",
    "stringer length calculator",
    "step calculator",
    "stair building calculator",
    "riser tread calculator",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Staircase Calculator — Rise, Run & Stringer Length",
    description: "Calculate stringer length, step count, and riser dimensions for building a staircase.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Staircase Calculator",
    description: "Calculate rise, run, stringer length, and step count for any staircase project.",
  },
};

function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Staircase Calculator",
    url: PAGE_URL,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free staircase calculator for rise, run, stringer length, and step count.",
    featureList: ["Stringer length calculation", "Step count and riser height", "Building code compliance check"],
  };
}

export default function StaircaseCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Construction", path: "/construction" },
    { name: "Staircase Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/construction" className="hover:text-primary">Construction</Link></li>
            <li>/</li>
            <li className="text-foreground">Staircase Calculator</li>
          </ol>
        </nav>
        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Construction Tool
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Staircase Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Calculate stringer length, number of steps, riser height, and tread depth for building a staircase. Enter your total rise and desired step dimensions to get a complete stair layout.
          </p>
        </div>
        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <StaircaseCalculator />

      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 bg-white/40 backdrop-blur-3xl shadow-2vw">
        <div className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-muted-foreground">
          <h2 className="text-4xl text-foreground italic">Gravity vs. Geometry: The Professional Stair Builder's Manual</h2>
          <p>
            Staircases are the most complex intersection of geometry and safety in any construction project. A mistake of just 1/4 inch in riser height inconsistency can cause a "trip hazard," as the human brain builds a subconscious muscle memory of the step height within the first two strides. Precision is not just an aesthetic choice—it is a legal and safety requirement.
          </p>
          
          <h3 className="text-foreground">01. The "Rule of 25" and Ergonomic Comfort</h3>
          <p>
            Why do some stairs feel "natural" while others feel exhausting or awkward? It comes down to the <strong>Blondel's Formula</strong>, often called the "Rule of 25." 
            <br/><br/>
            The formula states: <strong>(2 × Rise) + (1 × Run) = 24 to 25 inches</strong>. 
            <br/><br/>
            This matches the average human gait. If your rise is 7 inches, your run should be 11 inches (2x7 + 11 = 25). If your rise is lower, say 6 inches, your run must be longer (13 inches) to maintain the comfortable stride length. Our calculator automatically flags dimensions that fall outside this "comfort zone."
          </p>

          <h3 className="text-foreground">02. Stringer Geometry: The Backbone of the Stair</h3>
          <p>
            The <strong>Stringer</strong> is the diagonal board (usually a 2x12) that supports the steps. When you "notch" a stringer, you remove wood, which weakens the board.
            <ul>
              <li><strong>Effective Depth:</strong> You must leave at least 3.5 inches of solid wood *below* the notches. This is called the "effective depth." If your notches are too deep, the stringer will crack under the weight of a person.</li>
              <li><strong>The Bottom Riser Adjustment:</strong> A common amateur error is forgetting to subtract the thickness of the tread from the bottom of the stringer. If you don't, the first step will be too high, and the top step will be too low once the flooring is installed.</li>
            </ul>
          </p>

          <div className="my-16 p-10 bg-foreground text-background rounded-[3rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <h3 className="text-primary font-black italic !mt-0">Headroom: The 80-Inch Rule</h3>
             <p className="opacity-80 leading-relaxed mb-0">
               Building codes (IRC) require a minimum **80 inches (6' 8")** of vertical clearance. This is measured from the "plane" of the stair nosings to the ceiling above. If you are building a staircase into an existing floor opening, you must calculate the "Total Run" to ensure the ceiling opening is long enough so that a tall person doesn't hit their head on the way down.
             </p>
          </div>

          <h3 className="text-foreground">03. Complex Layouts: Landings and Returns</h3>
          <p>
            Rarely does a staircase go in a single straight line for more than 12 feet.
            <ul>
              <li><strong>Landings:</strong> Codes require a landing every 12 feet of vertical rise. A landing must be at least as wide as the stairs (typically 36").</li>
              <li><strong>U-Shaped & L-Shaped:</strong> When stairs turn, the landing acts as the "Zero Point" for a second calculation. Treat the landing like a floor, and run our calculator twice—once for the bottom flight and once for the top.</li>
            </ul>
          </p>

          <h3 className="text-foreground">04. The Baluster & Handrail Safety Mesh</h3>
          <p>
            A staircase isn't finished until it's safe.
            <ul>
              <li><strong>The 4-Inch Sphere Rule:</strong> Balusters (the vertical spindles) must be spaced so that a 4-inch sphere cannot pass through them. This prevents small children from getting their heads stuck.</li>
              <li><strong>Handrail Grip:</strong> Handrails must be between 34 and 38 inches high and must be "graspable"—meaning you can wrap your fingers around them. A 2x4 is *not* a legal handrail.</li>
            </ul>
          </p>
        </div>
      </section>

      {/* FAQ Grid */}
      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 relative overflow-hidden bg-muted/5">
        <h2 className="text-4xl font-black tracking-tighter text-foreground text-center italic">Master Staircase FAQ</h2>
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3 text-balance">
          {[
            { 
              question: "What is the maximum allowed rise in residential building code?", 
              answer: "The International Residential Code (IRC) specifies a maximum rise of 7.75 inches. Anything higher is considered too steep and dangerous for standard home use." 
            },
            { 
              question: "How do I calculate for the thickness of the tread?", 
              answer: "Subtract the thickness of one tread (usually 1 inch for oak or 1.5 inches for 2x lumber) from the bottom of your stringer. This ensures the first step height matches all others once finished." 
            },
            { 
              question: "What is a 'Nosing' and do I need one?", 
              answer: "A nosing is the part of the tread that hangs over the riser below. It provides more surface area for your foot without increasing the horizontal 'run' of the stairs. Codes usually require a nosing of 0.75 to 1.25 inches if your tread is less than 11 inches deep." 
            },
            {
              question: "How many stringers do I need for a 36-inch wide stair?", 
              answer: "For standard 1-inch thick treads, you need a stringer every 12 to 16 inches. For a 36-inch wide staircase, use 3 stringers (one on each side and one in the center) to prevent the treads from flexing or 'bouncing.'"
            },
            {
              question: "Can I build stairs with different heights to save space?",
              answer: "Absolutely not. This is the #1 cause of staircase falls. Code allows for a maximum deviation of only 3/8 inch between the tallest and shortest riser in a single flight. Consistency is the foundation of stair safety."
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
