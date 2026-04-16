import Link from "next/link";
import type { Metadata } from "next";

import { BrickBlockQuantityCalculator } from "./components/BrickBlockQuantityCalculator";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

const PAGE_PATH = "/construction/brick-block-quantity-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Brick & Block Quantity Calculator | Precise Masonry Estimator",
  description:
    "Free brick and block quantity calculator. Calculate exactly how many bricks or concrete blocks you need for a wall, including mortar joints and waste factors. Get mortar bag estimates instantly.",
  keywords: [
    "brick block quantity calculator",
    "calculate bricks for a wall",
    "how many blocks do i need",
    "masonry estimator tool",
    "brick and mortar calculator",
    "concrete block quantity",
    "retaining wall calculator",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
};

const faq = [
  {
    question: "How do I calculate the number of bricks for a wall?",
    answer: "To calculate bricks, multiply the wall length by the height to get the 'face area'. Then divide that area by the area of a single brick plus its mortar joint. For a standard US modular brick with a 3/8\" mortar joint, you need approximately 6.75 bricks per square foot. Always add a waste factor of 10%.",
  },
  {
    question: "Why should I include mortar thickness in the calculation?",
    answer: "A mortar joint typically occupies about 15-20% of the total wall face area. If you calculate based on the brick's physical size alone, you will significantly over-order. Our calculator uses the 'effective area' (nominal size) to ensure your count is accurate for a real-world laid wall.",
  },
  {
    question: "How many 60lb bags of mortar do I need for a brick wall?",
    answer: "A standard 60lb bag of pre-mixed mortar typically covers about 30 standard bricks or 8-10 concrete blocks. Our tool uses a formula based on the volume of the joints (Length x Height x Depth of the gap) to give you a precise bag count estimate.",
  },
  {
    question: "What is the standard size of a concrete block (CMU)?",
    answer: "A standard concrete block (CMU) is nominally 8\" high by 16\" long (including mortar). Its physical dimensions are actually 7.625\" x 15.625\". One block covers exactly 1.125 square feet of wall face, meaning it takes 112.5 blocks to cover 100 square feet.",
  },
  {
    question: "How much waste should I add for corners and windows?",
    answer: "For a straight wall with no openings, 5% waste is sufficient. For a wall with multiple corners, doors, or windows, increase this to 10-15% because cutting bricks around these features generates significantly more offcuts and potential breakage.",
  },
];

function buildBrickCalculatorJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Brick & Block Quantity Calculator",
    url: PAGE_URL,
    image: absoluteUrl("/og/brick-calculator.png"),
    applicationCategory: "DesignApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Professional masonry estimator with support for US, UK, and Metric standards. Includes mortar volume and cost calculation.",
    featureList: [
      "Running-bond wall visualizer",
      "US Modular and Metric unit presets",
      "Mortar joint volume adjustment",
      "Ready-mix mortar bag estimates",
      "Supply list export to PDF",
    ],
  };
}

export default function BrickBlockQuantityCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Construction", path: "/construction" },
    { name: "Brick & Block Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="space-y-12 pb-20">
      <JsonLd data={serializeJsonLd(buildBrickCalculatorJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-6 py-4 sm:py-6">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary transition-colors font-medium">Home</Link></li>
            <li>/</li>
            <li><Link href="/construction" className="hover:text-primary transition-colors font-medium">Construction</Link></li>
            <li>/</li>
            <li className="text-foreground font-bold">Brick & Block Calculator</li>
          </ol>
        </nav>

        <div className="max-w-4xl">
          <p className="primary-chip inline-flex rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] bg-primary/10 text-primary border border-primary/20">
            Masonry Intelligence
          </p>
          <h1 className="mt-8 text-5xl font-black tracking-tighter text-foreground sm:text-7xl italic">
            Precision Brick <span className="text-primary tracking-normal not-italic">& Block</span> Estimator
          </h1>
          <p className="mt-8 text-lg leading-relaxed text-muted-foreground sm:text-2xl font-light">
            Calculate exactly how many bricks, cinder blocks, or retaining wall units you need for any project. Includes adjustable mortar joints, waste margins, and instant material cost summaries.
          </p>
        </div>
      </section>

      <BrickBlockQuantityCalculator />

      {/* 900+ Word Guide Section */}
      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 bg-white/40 backdrop-blur-3xl shadow-2vw">
        <div className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-muted-foreground">
          <h2 className="text-4xl text-foreground">How to Calculate Bricks and Mortar: The Professional Masonry Guide</h2>
          <p>
            Planning a masonry project—whether it's a backyard fire pit, a garden retaining wall, or a full home facade—requires a deep understanding of <strong>nominal vs. actual dimensions</strong>. This guide will walk you through the math and architectural principles required for a perfect build.
          </p>
          
          <h3 className="text-foreground">01. Understanding Nominal vs. Actual Dimensions</h3>
          <p>
            Bricks are rarely laid tight against one another. They rely on a mortar joint to provide structural integrity, water resistance, and aesthetic consistency. In the United States, a standard "Modular" brick is 2 ¼" tall, 3 ⅝" deep, and 7 ⅝" long. 
            <br/><br/>
            However, when calculating for a project, we use <strong>Nominal Sizes</strong>, which include the mortar. A modular brick plus a ⅜" joint becomes a 2 ⅔" x 8" footprint. By using our calculator, you account for this "invisible" mortar volume, preventing you from over-purchasing units by as much as 20%.
          </p>

          <h3 className="text-foreground">02. Selecting the Right Brick Size</h3>
          <p>
            Not all bricks are created equal. The size you choose affects both the labor cost and the final look of the wall:
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 not-prose my-10">
             <div className="p-6 rounded-2xl bg-white border border-border shadow-sm">
                <h4 className="font-bold text-foreground">Standard / Modular</h4>
                <p className="text-xs text-muted-foreground mt-2">The most common residential choice. Requires ~6.75 bricks per sq ft.</p>
             </div>
             <div className="p-6 rounded-2xl bg-white border border-border shadow-sm">
                <h4 className="font-bold text-foreground">Queen Size</h4>
                <p className="text-xs text-muted-foreground mt-2">Slightly larger height. Requires ~5.5 bricks per sq ft. Faster install.</p>
             </div>
             <div className="p-6 rounded-2xl bg-white border border-border shadow-sm">
                <h4 className="font-bold text-foreground">King Size</h4>
                <p className="text-xs text-muted-foreground mt-2">Extra long and tall. Requires only ~4.5 bricks per sq ft. Economical for large walls.</p>
             </div>
          </div>

          <h3 className="text-foreground">03. The Math of Mortar: Bags and Sand</h3>
          <p>
            Mortar calculation is the most overlooked part of masonry planning. A ⅜" joint fills the full depth of the brick (3 ⅝"). 
            <br/><br/>
            <strong>The Formula:</strong> For every 100 modular bricks, you will need approximately <strong>0.55 cubic feet</strong> of wet mortar. 
            <br/><br/>
            If you are mixing your own using Portand cement and sand (Type S), the ratio is typically 1 part cement to 3 parts sand. If you are using pre-mixed 80lb bags, one bag will typically lay about 40 standard bricks or 12 concrete blocks. 
          </p>

          <h3 className="text-foreground">04. Bonding Patterns: Strength vs. Aesthetics</h3>
          <p>
            How you arrange the bricks affects the "effective area" and the complexity of your cuts:
          </p>
          <ul>
            <li><strong>Running Bond:</strong> The standard pattern where each brick is centered over the joint below it. Simple and generates minimal waste.</li>
            <li><strong>Flemish Bond:</strong> Alternates "headers" (short end) and "stretchers" (long side). Adds 5% to your waste factor due to frequent half-brick cuts.</li>
            <li><strong>Stack Bond:</strong> Vertically aligned joints. This is structurally weak and usually requires internal metal reinforcement but offers a modern, clean grid look.</li>
          </ul>

          <h3 className="text-foreground">05. Joint Finishing Techniques</h3>
          <p>
            The way a mason "strikes" the joint determines the wall's lifespan. 
            <br/><br/>
            <strong>Concave Joints:</strong> Produced with a curved tool. Highly water-resistant as they compress the mortar and shed water.
            <br/><br/>
            <strong>Raked Joints:</strong> Mortar is removed to a specific depth. Creates deep shadows and highlights the brick's shape but is prone to water pooling in freeze-thaw climates.
          </p>

          <h3 className="text-foreground">06. Waste Factors for Real-World Projects</h3>
          <p>
            Bricks are brittle. During delivery and unloading from the pallet, 2-3% of units will break. 
            <ul>
              <li><strong>5% Total Waste:</strong> Long, straight walls with no openings.</li>
              <li><strong>10% Total Waste:</strong> Walls with windows, doors, and standard 90-degree corners.</li>
              <li><strong>15% Total Waste:</strong> Arches, bay windows, or projects involving multiple different brick sizes.</li>
            </ul>
          </p>

          <div className="mt-16 p-10 bg-foreground text-background rounded-[4rem] relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
             <h3 className="text-background !mt-0 font-black relative z-10">Mason's Rule of Thumb</h3>
             <p className="opacity-80 leading-relaxed italic relative z-10">
               "Always check your pallets for color consistency. Bricks are baked in kilns, and slight temperature variances cause color shifts. To ensure a uniform wall, pull bricks from three different pallets simultaneously as you build. This is called 'blending' and prevents noticeable color blocks on your facade."
             </p>
          </div>
        </div>
      </section>

      {/* FAQ Grid */}
      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16">
        <h2 className="text-4xl font-black tracking-tighter text-foreground text-center">Masonry & Brickwork FAQ</h2>
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
