import Link from "next/link";
import type { Metadata } from "next";

import { RoofingMaterialCalculator } from "./components/RoofingMaterialCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

const PAGE_PATH = "/construction/roofing-material-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Roofing Material Calculator | Precise Shingle & Bundle Estimator",
  description:
    "Free professional roofing calculator. Estimate squares, bundles, and accessory materials like ridge caps and underlayment with pitch adjustment and waste factor support.",
  keywords: [
    "roofing material calculator",
    "calculate roof shingles",
    "how many bundles per square",
    "roof pitch multiplier",
    "roofing square footage estimator",
    "shingle bundle calculator",
    "residential roofing planner",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
};

const faq = [
  {
    question: "What is a roofing 'square' and how is it used?",
    answer: "In the roofing industry, a 'square' is a unit of area equal to 100 square feet. Most roofing materials, including shingles, metal panels, and underlayment, are sold and quoted by the square. Our calculator converts your raw dimensions into squares to match industry standards.",
  },
  {
    question: "How many bundles of shingles do I need per square?",
    answer: "Standard architectural and 3-tab shingles typically require three bundles to cover one square (100 sq ft). Premium luxury shingles or wood shakes are often thicker and may require four or five bundles per square. Metal roofing is often sold in panels that cover one square each.",
  },
  {
    question: "How does roof pitch affect the amount of material I need?",
    answer: "Roof pitch describes the steepness of the roof. Because a sloped surface has more area than a flat footprint, you must apply a pitch multiplier. For example, a 6/12 pitch has a multiplier of approximately 1.118, meaning you need nearly 12% more material than the building's flat footprint suggested.",
  },
  {
    question: "What waste factor is recommended for a typical roof replacement?",
    answer: "For a simple gable roof with two planes, 5-10% waste is standard. For more complex roofs with hips, valleys, dormers, and multiple penetrations (chimneys, vents), you should use 15%. If your roof has a particularly complex geometry, 20% is safer.",
  },
  {
    question: "Can I use this calculator for metal roofing or wood shakes?",
    answer: "Yes. By selecting the 'Metal Panel' or 'Wood Shake' profile in our tool, the conversion from squares to product units (bundles or panels) will adjust to reflect the unique coverage requirements of those materials.",
  },
];

function buildRoofingCalculatorJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Roofing Material Calculator",
    url: PAGE_URL,
    image: absoluteUrl("/og/roofing-calculator.png"),
    applicationCategory: "DesignApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Professional roofing estimator with pitch multipliers, shingle bundle conversion, and accessory tracking (drip edge, underlayment).",
    featureList: [
      "Isometric roof pitch visualization",
      "Automatic pitch multiplier calculation",
      "Shingle bundle count by profile (3-Tab, Luxury, Metal)",
      "Accessory material checklist generation",
      "Contractor-ready PDF estimation report",
    ],
  };
}

export default function RoofingMaterialCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Construction", path: "/construction" },
    { name: "Roofing Material Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="space-y-12 pb-20">
      <JsonLd data={serializeJsonLd(buildRoofingCalculatorJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-6 py-4 sm:py-6">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary transition-colors font-medium">Home</Link></li>
            <li>/</li>
            <li><Link href="/construction" className="hover:text-primary transition-colors font-medium">Construction</Link></li>
            <li>/</li>
            <li className="text-foreground font-bold">Roofing Material Calculator</li>
          </ol>
        </nav>

        <div className="max-w-4xl">
          <p className="primary-chip inline-flex rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] bg-primary/10 text-primary border border-primary/20">
            Professional Estimator
          </p>
          <h1 className="mt-8 text-5xl font-black tracking-tighter text-foreground sm:text-7xl italic">
            Roofing Material <span className="text-primary tracking-normal not-italic">Calculator</span>
          </h1>
          <p className="mt-8 text-lg leading-relaxed text-muted-foreground sm:text-2xl font-light">
            Plan your roof replacement with surgical precision. Calculate squares, bundles, and every necessary accessory from drip edges to underlayment rolls using our pitch-adjusted logic.
          </p>
        </div>
      </section>

      <RoofingMaterialCalculator />

      {/* 1,000+ Word Guide Section */}
      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 bg-white/40 backdrop-blur-3xl shadow-2vw">
        <div className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-muted-foreground">
          <h2 className="text-4xl text-foreground italic">Roofing Material Calculation: The Ultimate Engineering Guide</h2>
          <p>
            Replacing a roof is one of the most critical structural investments a property owner can make. In the construction industry, precision prevents massive budget overruns. Understanding the math behind your contractor's quote—specifically how "Squares," "Pitch Multipliers," and "Deductions" work—is the best way to ensure you are getting a fair price.
          </p>
          
          <h3 className="text-foreground">01. What is a 'Square'? The Industry Standard</h3>
          <p>
            In roofing, we don't use standard square footage because the numbers are too large for efficient quoting. Instead, we use "Squares."  
            <strong>One square = 100 square feet (10' x 10' area).</strong> 
            <br/><br/>
            If your roof measures 2,800 square feet, a builder will refer to it as a "28-square roof." Our calculator automates this conversion, allowing you to enter ground-level dimensions and translate them into a material order that a local lumber yard or shingle supplier understands.
          </p>

          <h3 className="text-foreground">02. The "Steepness Tax": Understanding Pitch Multipliers</h3>
          <p>
            Roof pitch is the "slope," expressed as <code>Rise / 12</code>. A 6/12 pitch means the roof rises 6 inches for every 12 inches it runs horizontally. 
            <br/><br/>
            Because sloped surfaces have more area than the flat footprint (the building's "plan view"), you must apply a <strong>slope adjustment factor</strong>. A 12/12 pitch (45-degree angle) actually has 41.4% more surface area than a flat roof covering the same house. 
            <br/><br/>
            <strong>Geometric Multipliers:</strong>
            <ul>
              <li>4/12 Pitch: 1.054 Multiplier</li>
              <li>6/12 Pitch: 1.118 Multiplier</li>
              <li>9/12 Pitch: 1.250 Multiplier</li>
              <li>12/12 Pitch: 1.414 Multiplier</li>
            </ul>
          </p>

          <div className="my-16 p-10 bg-foreground text-background rounded-[3rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <h3 className="text-primary font-black italic !mt-0">Pro Secret: The Ice & Water Shield</h3>
             <p className="opacity-80 leading-relaxed mb-0">
               If you live in a climate with snow (Northern US, Canada, Europe), your calculation *must* include an "Ice and Water" shield. This is a self-adhering membrane installed along the eaves (bottom edges). Most building codes require it to extend 2 feet past the interior wall line. If you have 2-foot overhangs, you need at least 2 rows of 3-foot wide membrane (6 feet total) to pass inspection.
             </p>
          </div>

          <h3 className="text-foreground">03. Calculating Shingle Bundles and Squares</h3>
          <p>
            Shingles are bundled for easy transport. For standard architectural shingles, it takes <strong>3 bundles to cover 1 square</strong>. If you are using luxury, heavy-weight shingles, you may need 4 to 5 bundles per square because the material is thicker and higher-density.
            <br/><br/>
            <strong>Material Density Guide:</strong>
            <ul>
              <li><strong>3-Tab Shingles:</strong> approx 240 lbs/square</li>
              <li><strong>Architectural Shingles:</strong> approx 260–300 lbs/square</li>
              <li><strong>Luxury Shingles:</strong> approx 450 lbs/square. (Note: Ensure your roof rafters can handle this weight!)</li>
            </ul>
          </p>

          <h3 className="text-foreground">04. The Ventilation Equation: Ridge Vents and Airflow</h3>
          <p>
            A roof replacement is the perfect time to optimize attic ventilation. Standard code requires 1 square foot of ventilation for every 150 square feet of attic floor area. 
            <br/><br/>
            Our tool estimates <strong>Ridge Vent</strong> length based on your roof's main ridge line. Ridge vents provide superior exhaust ventilation compared to traditional "turtle vents" because they run the entire length of the peak, allowing hot air to escape naturally through the thermal chimney effect.
          </p>

          <h3 className="text-foreground">05. Flashing Systems: Protecting the Weak Points</h3>
          <p>
            90% of roof leaks occur at "penetrations" (chimneys, skylights, vents) or "changes in plane" (valleys, eaves). 
            <ul>
              <li><strong>Step Flashing:</strong> Used where a roof meets a vertical wall. These are individual "L" shaped pieces of metal (usually 5"x7") that overlap each shingle.</li>
              <li><strong>Valley Flashing:</strong> Usually a 20-inch wide metal roll (W-flashing) or "closed-cut" shingles. Valleys carry the highest volume of water and require double underlayment.</li>
              <li><strong>Drip Edge:</strong> Metal installed along the rafters to prevent water from wicking back into the wooden fascia and rotting the roof deck.</li>
            </ul>
          </p>

          <h3 className="text-foreground">06. Waste Factors: Simple vs. Complex Roofs</h3>
          <p>
            You cannot install 100% of the material you buy. When you reach a hip or a valley, you must cut shingles at an angle. The scrap is often unusable. 
            <br/><br/>
            <strong>Standard Guidelines:</strong>
            <ul>
              <li><strong>Simple Gable (2 planes):</strong> 10% Waste Factor</li>
              <li><strong>Hipped Roof (4 planes):</strong> 15% Waste Factor</li>
              <li><strong>Complex (Dormers, Turrets, Multiple Valleys):</strong> 20% Waste Factor</li>
            </ul>
          </p>

          <div className="mt-16 p-10 bg-primary/5 border border-primary/10 rounded-[4rem] text-center">
             <h3 className="text-primary !mt-0 font-black">Material Comparison: Asphalt vs. Metal</h3>
             <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
               Asphalt shingles remain the #1 choice due to cost ($300–$600 per square installed). Standing Seam Metal roofing is a "lifetime" solution ($900–$1,500 per square) that offers superior fire resistance and energy efficiency by reflecting solar heat.
             </p>
          </div>
        </div>
      </section>

      {/* FAQ Grid */}
      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <h2 className="text-4xl font-black tracking-tighter text-foreground text-center">Roofing Intelligence FAQ</h2>
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {faq.map((item) => (
            <article key={item.question} className="p-8 rounded-[2.5rem] border border-border bg-background hover:border-primary/50 transition-all shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-black text-foreground mb-4 leading-tight">{item.question}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-border flex items-center gap-2 text-[10px] font-black uppercase text-primary tracking-widest">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Expert Answer
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="pb-10">
        <RelatedToolsSection category="Construction" categoryHref="/construction" currentPath={PAGE_PATH} />
      </div>
    </div>
  );
}
