import Link from "next/link";
import type { Metadata } from "next";

import { FlooringMaterialCalculator } from "./components/FlooringMaterialCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

const PAGE_PATH = "/construction/flooring-material-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Precision Flooring Material Calculator | Sq Ft & Box Planner",
  description:
    "Free flooring calculator for hardwood, LVP, laminate, and tile. Calculate exact box counts, adjusted waste margins, and project costs across multiple rooms.",
  keywords: [
    "flooring material calculator",
    "calculate flooring square feet",
    "how many boxes of flooring do i need",
    "LVP flooring calculator",
    "hardwood flooring estimator",
    "tile project planner",
    "flooring waste factor guide",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
};

const faq = [
  {
    question: "What is a waste factor and why is it essential?",
    answer: "A waste factor is an extra percentage of material added to your net square footage to account for cutting loss, damaged pieces, and layout complexity. For a straight-lay project, 5-10% is standard. For herringbone or diagonal patterns, you may need up to 20-25%.",
  },
  {
    question: "How many boxes of flooring should I buy for 200 sq ft?",
    answer: "First, add your waste factor (e.g., 10% waste on 200 sq ft = 220 total sq ft). Then divide by the coverage per box found on the product label. If a box covers 22 sq ft, you would need exactly 10 boxes. If it covers 24 sq ft, 220/24 = 9.16, which means you must buy 10 boxes.",
  },
  {
    question: "Should I purchase all my flooring at once?",
    answer: "Yes. Flooring is produced in 'dye lots' or batches. Variations in temperature and humidity during manufacturing can cause slight tone differences between lots. Buying enough material in one order ensures visual consistency across your home.",
  },
  {
    question: "How do I calculate flooring for an L-shaped room?",
    answer: "The easiest method is to divide the 'L' into two rectangular sections. Calculate the area of each (Length x Width), add them together to get the net area, and then apply your waste margin to the total.",
  },
  {
    question: "Does this calculator support metric units?",
    answer: "Yes. Our tool allows you to toggle between Imperial (feet/sq ft) and Metric (meters/sq m) systems instantly, ensuring accurate calculations regardless of your location or product labeling.",
  },
];

function buildFlooringCalculatorJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Flooring Material Calculator",
    url: PAGE_URL,
    image: absoluteUrl("/og/flooring-calculator.png"),
    applicationCategory: "BusinessApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Professional flooring estimator for hardwood, LVP, and tile projects. Support for multiple rooms, adjustable waste factors, and box rounding.",
    featureList: [
      "Multi-room project planning",
      "Box-count rounding and estimation",
      "Material-specific waste presets",
      "Cost per square foot tracking",
      "Detailed PDF data exports",
    ],
  };
}

export default function FlooringMaterialCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Construction", path: "/construction" },
    { name: "Flooring Material Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="space-y-12 pb-20">
      <JsonLd data={serializeJsonLd(buildFlooringCalculatorJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-6 py-4 sm:py-6">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/construction" className="hover:text-primary transition-colors">Construction</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">Flooring Material Calculator</li>
          </ol>
        </nav>

        <div className="max-w-4xl">
          <p className="primary-chip inline-flex rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] bg-primary/10 text-primary">
            Installation Intelligence
          </p>
          <h1 className="mt-6 text-5xl font-black tracking-tighter text-foreground sm:text-7xl">
            Ultimate Flooring Material Calculator
          </h1>
          <p className="mt-8 text-lg leading-relaxed text-muted-foreground sm:text-2xl font-light">
            Estimate your square footage, box counts, and budget in seconds. Our tool helps you plan complex multi-room renovations with material-specific waste margins and Cost-per-SqFt tracking.
          </p>
        </div>
      </section>

      <FlooringMaterialCalculator />

      {/* 1,000+ Word Guide Section */}
      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 bg-white/40 backdrop-blur-3xl shadow-2xl">
        <div className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-muted-foreground">
          <h2 className="text-4xl text-foreground">How to Calculate Flooring: A Contractor's Definitive Guide</h2>
          <p>
            The difference between a successful DIY flooring project and a frustrating one often comes down to the initial math. Ordering precisely the right amount of material requires understanding three key figures: <strong>Net Area</strong>, <strong>Waste Margin</strong>, and <strong>Box Coverage</strong>. This guide will help you navigate the complexities of subfloor prep, material choices, and layout strategy.
          </p>
          
          <h3 className="text-foreground">01. Measuring Your Space: Beyond Simple Rectangles</h3>
          <p>
            While a simple length-times-width (L x W) calculation works for square rooms, most modern homes feature alcoves, bay windows, and doorways that complicate the math. 
            <br/><br/>
            <strong>Pro Strategy:</strong> Divide your room into "Section A," "Section B," etc. Measure each rectangle individually. For rounded areas, measure the maximum width and treat it as a square—the excess will fall into your waste factor. Don't forget to include closets! Doorways typically require a "transition strip," but you should still calculate the flooring as if it continues through the jam to ensure pattern continuity.
          </p>

          <h3 className="text-foreground">02. The Subfloor Secret: Leveling and Moisture</h3>
          <p>
            Before you buy a single plank, you must inspect your subfloor. Even the most expensive hardwood will fail if the subfloor is uneven or damp.
          </p>
          <ul>
            <li><strong>Leveling:</strong> Use a 10ft straight-edge. If you find a dip greater than 3/16", you need a self-leveling compound.</li>
            <li><strong>Moisture Test:</strong> On concrete, tape a 2'x2' piece of plastic wrap to the floor. If condensation appears after 24 hours, you need a high-quality moisture barrier.</li>
            <li><strong>Underlayment:</strong> Not all flooring needs separate underlayment. Many Luxury Vinyl Planks (LVP) come with a pre-attached cork or foam pad. Adding a second pad can actually void your warranty by making the floor too "bouncy," which snaps the locking mechanisms.</li>
          </ul>

          <h3 className="text-foreground">03. Choosing Your Waste Factor: Pattern Complexity</h3>
          <p>
            You cannot install 100% of the material you buy. When you reach a wall, you must cut segments of wood or tile to fit. The offcuts are often unusable.
          </p>
          <div className="grid md:grid-cols-2 gap-8 not-prose my-12">
             <div className="p-8 rounded-[3rem] bg-foreground text-background">
                <h4 className="font-bold text-lg mb-2">Straight Patterns (5–10%)</h4>
                <p className="text-sm opacity-80">Ideal for parallel plank installation or standard square tile layouts in regular rooms.</p>
             </div>
             <div className="p-8 rounded-[3rem] bg-primary text-primary-foreground shadow-xl shadow-primary/20">
                <h4 className="font-bold text-lg mb-2">Complex Patterns (15–25%)</h4>
                <p className="text-sm opacity-80">Herringbone, Chevron, and diagonal layouts create significantly more small scrap material during perimeter cuts.</p>
             </div>
          </div>

          <h3 className="text-foreground">04. Material Deep-Dive: Hardwood, LVP, and Laminate</h3>
          <p>
            <strong>Luxury Vinyl Plank (LVP):</strong> The current king of residential flooring. It is 100% waterproof, making it suitable for basements and bathrooms. It mimics the look of wood through high-definition printing and textured "wear layers."
            <br/><br/>
            <strong>Hardwood:</strong> The only flooring that adds significant long-term resale value to a home. It can be sanded and refinished multiple times. However, it is susceptible to scratches and water damage.
            <br/><br/>
            <strong>Laminate:</strong> A middle-ground option. It is more scratch-resistant than hardwood and cheaper than quality LVP, but it is not waterproof. If the core gets wet, the planks will "peak" at the seams and cannot be repaired.
          </p>

          <h3 className="text-foreground">05. The Expansion Gap Rule</h3>
          <p>
            Floating floors (LVP and Laminate) expand and contract with temperature and humidity changes. You must leave a 1/4" to 3/8" gap between the floor and every wall or fixed object. This gap is hidden by your baseboards or "quarter-round" molding. If you pin the floor against the wall, it will "buckle" in the center during summer months.
          </p>

          <h3 className="text-foreground">06. Understanding Box Ratios and Dye Lots</h3>
          <p>
            Most modern flooring is sold by the carton, not individual planks. Each carton has a unique coverage area (e.g., 22.4 sq ft). 
            <br/><br/>
            <strong>The Golden Rule:</strong> Always round up to the next full box. Our calculator does this automatically. If your project requires 10.1 boxes worth of material, you must order 11 boxes. 
            <br/><br/>
            <strong>Dye Lots:</strong> Flooring is produced in batches. Colors can shift slightly between batches. By using our calculator to find the *full* project requirement up front, you ensure all your boxes come from the same production run, preventing a "patchy" look.
          </p>

          <div className="mt-16 p-10 bg-primary/5 border border-primary/10 rounded-[3rem] relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
             <h3 className="text-primary !mt-0 font-black">Contractor's Tip: Acclimation</h3>
             <p className="text-primary/80 leading-relaxed italic">
               "Never install flooring the day it arrives. Wood and LVP should 'acclimate' to your home's humidity for 48 to 72 hours. Open the boxes and stack them in the room where they will be installed. This prevents the planks from shrinking or expanding after they've been locked together."
             </p>
          </div>
        </div>
      </section>

      {/* FAQ Grid */}
      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16">
        <h2 className="text-4xl font-black tracking-tighter text-foreground text-center italic underline decoration-primary decoration-4 underline-offset-8">Common Flooring Questions</h2>
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {faq.map((item) => (
            <article key={item.question} className="p-8 rounded-[2.5rem] border border-border bg-background hover:shadow-xl transition-all border-b-4 border-b-primary shadow-sm hover:-translate-y-1">
              <h3 className="text-lg font-black text-foreground mb-4 leading-tight">{item.question}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
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
