import Link from "next/link";
import type { Metadata } from "next";

import { PaintCoverageCalculator } from "./components/PaintCoverageCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

const PAGE_PATH = "/construction/paint-coverage-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Professional Paint Coverage Calculator | Room & Ceiling Estimator",
  description:
    "Calculate exactly how much paint you need for any room. Includes surface texture modifiers, primer estimates, and multi-coat planning. Get gallons or liters instantly.",
  keywords: [
    "paint coverage calculator",
    "how much paint for a room",
    "calculate paint gallons",
    "paint primer calculator",
    "painting cost estimator",
    "interior painting guide",
    "latex vs oil vs acrylic paint",
    "paint coverage per square foot",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
};

const faq = [
  {
    question: "Why do I need primer? Does it affect paint coverage?",
    answer: "Primer creates a uniform surface for paint to adhere to, especially on fresh drywall, patches, or dark-to-light color changes. Using a primer can actually *save* you money because it is cheaper than high-end paint and reduces the number of finish coats needed to reach full opacity.",
  },
  {
    question: "How many coats of paint do I need? Coverage by paint type",
    answer: "Most interior projects require two coats to ensure consistent sheen and color depth. If you are using a similar color to the existing one, a single coat may suffice. However, transitioning from a dark color to a light one may require three coats or a high-opacity primer.",
  },
  {
    question: "What's the spread rate for different paint types?",
    answer: "Standard interior latex paint covers about 350-400 sq ft per gallon. Oil-based paints are often thicker and may cover closer to 300-350 sq ft, while specialized acrylics and high-gloss finishes can vary significantly. Always check the label on the specific can you purchase.",
  },
  {
    question: "How do surface textures like masonry or plaster affect paint needs?",
    answer: "Porous surfaces like masonry, brick, or fresh plaster absorb liquid much faster than sealed drywall. For these surfaces, increase your paint estimate by 20-30% and always use a masonry-specific primer to seal the surface first.",
  },
  {
    question: "Should I include the ceiling in my paint calculation?",
    answer: "If you plan to refresh the ceiling with the same or a different color, you should calculate it separately or use the 'Paint Ceiling' toggle in our tool. Ceilings often use a different 'Flat' finish to minimize light reflection and hide imperfections.",
  },
];

function buildPaintCalculatorJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Paint Coverage Calculator",
    url: PAGE_URL,
    image: absoluteUrl("/og/paint-calculator.png"),
    applicationCategory: "DesignApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Professional paint estimator with room visualizer, surface absorption modifiers, and primer calculation support.",
    featureList: [
      "2D Room Visualizer",
      "Surface texture modifiers (Drywall, Masonry, etc.)",
      "Primer and finish coat estimation",
      "Cost per room calculation",
      "Shopping list export to PDF",
    ],
  };
}

export default function PaintCoverageCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Construction", path: "/construction" },
    { name: "Paint Coverage Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="space-y-12 pb-20">
      <JsonLd data={serializeJsonLd(buildPaintCalculatorJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-6 py-4 sm:py-6">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/construction" className="hover:text-primary transition-colors">Construction</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">Paint Coverage Calculator</li>
          </ol>
        </nav>

        <div className="max-w-4xl">
          <p className="primary-chip inline-flex rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] bg-primary/10 text-primary">
            Smart Estimation Tool
          </p>
          <h1 className="mt-6 text-5xl font-black tracking-tighter text-foreground sm:text-7xl">
            Professional Paint Calculator
          </h1>
          <p className="mt-8 text-lg leading-relaxed text-muted-foreground sm:text-2xl font-light">
            Don't guess how much paint you need. Plan your room transformation with precision using our visual estimator, taking into account surface types, deductions, and primer needs.
          </p>
        </div>
      </section>

      <PaintCoverageCalculator />

      {/* 900+ Word Guide Section */}
      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 bg-white/40 backdrop-blur-3xl shadow-2xl">
        <div className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-muted-foreground">
          <h2 className="text-4xl text-foreground">How Much Paint Do I Need? The Definitive Professional Guide</h2>
          <p>
            Whether you are freshening up a guest bedroom or repainting an entire open-concept living space, the most common hurdle is the shopping trip. Buying too little paint means an extra trip to the store and potential color mismatching due to batch variance. Buying too much is a waste of money and storage space. This guide will walk you through the professional math used by industrial painters to ensure a perfect project.
          </p>
          
          <h3 className="text-foreground">01. Understanding Spread Rates and Real-World Coverage</h3>
          <p>
            The industry standard for interior paint coverage is <strong>350 to 400 square feet per gallon</strong>. This is the "theoretical spread rate." However, real-world variables like wall texture, the color you are covering, and your application method (roller vs. sprayer) will affect this number significantly.
          </p>
          <ul>
            <li><strong>Smooth Drywall:</strong> Highest efficiency, usually reaching the 400 sq ft mark.</li>
            <li><strong>Textured Walls (Orange Peel or Knockdown):</strong> 15-20% more paint is required because the peaks and valleys increase the surface area.</li>
            <li><strong>Fresh Plaster or Masonry:</strong> Can absorb liquid so fast that coverage drops to 250 sq ft per gallon without a sealer. Always account for 30% more paint on unsealed masonry.</li>
          </ul>

          <h3 className="text-foreground">02. Paint Finishes: How Sheen Affects Perception and Durability</h3>
          <p>
            The finish (or sheen) you choose isn't just about looks—it affects how much paint you need and how long it lasts. Higher sheens contain more resins, which can sometimes result in slightly lower spread rates but higher durability.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 not-prose my-10">
            <div className="p-4 rounded-2xl bg-white border border-border">
              <span className="text-[10px] font-bold text-primary uppercase">Matte/Flat</span>
              <p className="text-[11px] mt-1 text-muted-foreground">No sheen. Hides imperfections but is hard to clean. Best for low-traffic areas.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-border">
              <span className="text-[10px] font-bold text-primary uppercase">Eggshell/Satin</span>
              <p className="text-[11px] mt-1 text-muted-foreground">Low sheen. The standard for living rooms and hallways. Durable and washable.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-border border-primary/20 bg-primary/5">
              <span className="text-[10px] font-bold text-primary uppercase">Semi-Gloss</span>
              <p className="text-[11px] mt-1 text-muted-foreground">High shine. Ideal for kitchens, bathrooms, and trim where moisture resistance is key.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-border">
              <span className="text-[10px] font-bold text-primary uppercase">High Gloss</span>
              <p className="text-[11px] mt-1 text-muted-foreground">Mirror-like finish. Extremely durable but shows every wall flaw.</p>
            </div>
          </div>

          <h3 className="text-foreground">03. The Critical Role of Primer</h3>
          <p>
            Is "Self-Priming" paint enough? For same-color refreshes, yes. But for new drywall, patches, or drastic color shifts, a <strong>dedicated primer</strong> is essential. It prevents "flashing"—uneven sheen spots—and ensures the expensive topcoat sticks properly. Our calculator estimates primer separately as it is typically applied in a single, thinner layer (approx 300 sq ft per gallon).
          </p>

          <h3 className="text-foreground">04. Application Techniques: Brush, Roller, or Spray?</h3>
          <p>
            How you apply the paint determines your "transfer efficiency." 
            <br/><br/>
            <strong>Rollers:</strong> The most common DIY method. A 3/8-inch nap is standard for smooth walls, while a 3/4-inch nap is used for textured surfaces. Rollers are very efficient with minimal waste.
            <br/><br/>
            <strong>Sprayers:</strong> Provide a smooth, "factory" finish but waste 20-40% of the paint through overspray. If you use a sprayer, increase your calculator estimate by at least 25%.
          </p>

          <h3 className="text-foreground">05. Environmental Impacts: Humidity and Temperature</h3>
          <p>
            <strong>Humidity:</strong> High humidity slows the evaporation of water in latex paint, leading to runs and sags. Ideally, keep humidity between 40% and 50%.
            <br/><br/>
            <strong>Temperature:</strong> Never paint if the temperature is below 50°F or above 90°F. Extreme heat can cause the paint to dry before it can "level," leaving ugly brush marks.
          </p>

          <h3 className="text-foreground">06. Step-by-Step Room Calculation Math</h3>
          <ol>
            <li><strong>Measure Perimeter:</strong> Add up the length of all four walls (e.g., 10+10+12+12 = 44 ft).</li>
            <li><strong>Multiply by Height:</strong> 44 ft × 8 ft height = 352 sq ft Gross Area.</li>
            <li><strong>Subtract Deductions:</strong> Remove Doors (avg 21 sq ft) and Windows (avg 15 sq ft). 352 - (21 + 15) = 316 sq ft Net Area.</li>
            <li><strong>Multiply by Coats:</strong> 316 × 2 coats = 632 total sq ft needed.</li>
            <li><strong>Divide by 400:</strong> 632 / 400 = 1.58 Gallons. Total order: <strong>2 Gallons</strong>.</li>
          </ol>

          <div className="mt-16 p-10 bg-foreground text-background rounded-[3rem] relative overflow-hidden">
             <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mb-32 -mr-32"></div>
             <h3 className="text-background !mt-0 font-black relative z-10">Pro Tip: The Batch Code Rule</h3>
             <p className="opacity-80 leading-relaxed italic relative z-10">
               "Even with digital tinting, two gallons from different boxes can have slight variances. To ensure a perfect color match in a large room, 'box' your paint by mixing all the gallons into one large 5-gallon bucket before you start rolling."
             </p>
          </div>
        </div>
      </section>

      {/* FAQ Grid */}
      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16">
        <h2 className="text-4xl font-black tracking-tighter text-foreground text-center">Home Painting FAQs</h2>
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {faq.map((item) => (
            <article key={item.question} className="p-8 rounded-[2rem] border border-border bg-background hover:border-primary/30 transition-all group">
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{item.question}</h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">{item.answer}</p>
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
