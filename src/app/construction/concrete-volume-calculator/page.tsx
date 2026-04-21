import Link from "next/link";
import type { Metadata } from "next";

import { ConcreteVolumeCalculator } from "./components/ConcreteVolumeCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

const PAGE_PATH = "/construction/concrete-volume-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Professional Concrete Volume Calculator | Yards & Bags Estimate",
  description:
    "Calculate cubic yards of concrete needed for slabs, footings, stairs, and columns. Includes 10% waste factor, cost estimation, and multiple project sections.",
  keywords: [
    "concrete calculator",
    "concrete volume calculator",
    "calculate cubic yards concrete",
    "how many bags of concrete",
    "concrete slab calculator",
    "concrete cost estimator",
    "ready mix vs bagged concrete",
    "concrete mix ratios",
    "stair concrete calculator",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
};

const faq = [
  {
    question: "What's a typical waste factor for concrete? Why do contractors add 5–10%?",
    answer: "A standard waste factor is 5% to 10%. Contractors add this to account for uneven subgrade, absorption into the ground, spillage during the pour, and errors in excavation. For smaller jobs using bagged concrete, 10% is safer because minor measuring errors can lead to a shortage that halts the project mid-pour.",
  },
  {
    question: "How much does concrete cost per cubic yard? Regional price comparison",
    answer: "On average, ready-mix concrete costs between $125 and $175 per cubic yard. Prices vary by region and volume; rural areas may charge a 'short-load' fee for delivery under 4–5 yards. Bagged concrete is significantly more expensive per yard (roughly $200–$300) but avoids delivery and minimum fees.",
  },
  {
    question: "What's the difference between ready-mix and bagged concrete?",
    answer: "Ready-mix is mixed at a plant and delivered by truck, ensuring professional-grade consistency and strength; it's ideal for projects over 1 cubic yard. Bagged concrete requires manual mixing on-site and is best for small fence posts, stepping stones, or minor repairs.",
  },
  {
    question: "How do I calculate concrete for steps and stairs?",
    answer: "To calculate steps, treat each step as a small rectangle (Width * Run * Height_from_ground). Sum these volumes. If you have 3 steps, the first is 1 step high, the second is 2 steps high, and the third is 3 steps high. Our calculator automates this math for you.",
  },
  {
    question: "Can I use this calculator for foundations and footings?",
    answer: "Yes. Use the 'Column/Hole' shape for cylindrical footings or 'Slab' for square/rectangular foundations. Always verify structural dimensions with your local building code or structural engineer before purchasing materials.",
  },
];

function buildConcreteCalculatorJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Concrete Volume Calculator",
    url: PAGE_URL,
    image: absoluteUrl("/og/concrete-calculator.png"),
    applicationCategory: "BusinessApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Professional-grade concrete calculator with support for slabs, columns, and stairs. Includes cost estimates and PDF report exports.",
    featureList: [
      "Multi-section project planning",
      "Staircase and step calculation",
      "Waste factor adjustment (0-30%)",
      "Cost per yard estimation",
      "Bags of concrete (40lb, 60lb, 80lb, 25kg) calculator",
      "PDF export for contractor reports",
    ],
  };
}

export default function ConcreteVolumeCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Construction", path: "/construction" },
    { name: "Concrete Volume Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="space-y-12 pb-20">
      <JsonLd data={serializeJsonLd(buildConcreteCalculatorJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      {/* Hero Section */}
      <section className="space-y-6 py-4 sm:py-6">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/construction" className="hover:text-primary transition-colors">Construction</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">Concrete Volume Calculator</li>
          </ol>
        </nav>

        <div className="max-w-4xl">
          <p className="primary-chip inline-flex rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] bg-primary/10 text-primary">
            Engineering & Construction
          </p>
          <h1 className="mt-6 text-5xl font-black tracking-tighter text-foreground sm:text-7xl">
            Ultimate Concrete Volume Calculator
          </h1>
          <p className="mt-8 text-lg leading-relaxed text-muted-foreground sm:text-2xl font-light">
            Plan your entire project in one place. Calculate slabs, footings, and stairs using multiple sections, adjustable waste factors, and instant cost estimation.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm font-bold text-success capitalize">
               <span className="w-2 h-2 rounded-full bg-success animate-pulse" /> Ready-Mix Optimized
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-primary capitalize">
               <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Precision Bag Estimator
            </div>
          </div>
        </div>
      </section>

      <ConcreteVolumeCalculator />

      {/* 1,200 World Guide Section */}
      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 bg-white/40 backdrop-blur-3xl shadow-2xl">
        <div className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground">
          <h2 className="text-4xl text-foreground">How to Calculate Concrete Volume: Professional Engineering Guide</h2>
          <p>
            Whether you are pouring a simple backdoor patio or a complex set of structural stairs, calculating the exact volume of concrete is the difference between a smooth finish and a mid-project disaster. In the construction industry, concrete is measured in <strong>cubic yards (yd³)</strong> or <strong>cubic meters (m³)</strong>. Estimating too little leads to "cold joints," where new concrete is poured against half-dried material, creating a structural weakness. Estimating too much is a waste of money and a disposal headache.
          </p>
          
          <h3 className="text-foreground">01. Calculating Slabs and Footings (Rectangular)</h3>
          <p>
            The most common pour is the slab. The formula is straightforward: <code>Length × Width × Thickness</code>. However, the thickness is usually measured in inches, while length and width are in feet. To find cubic feet, you must convert inches to feet by dividing by 12. 
            <br/><br/>
            <strong>Comprehensive Example:</strong> Imagine a 20ft × 20ft driveway at 4 inches thick. 
            <ol>
              <li>Convert thickness: 4 inches / 12 = 0.333 feet.</li>
              <li>Calculate cubic feet: 20 × 20 × 0.333 = 133.33 ft³.</li>
              <li>Convert to yards: 133.33 / 27 = 4.94 yd³.</li>
              <li>Add 10% Waste: 4.94 × 1.10 = <strong>5.44 cubic yards</strong>.</li>
            </ol>
            Always round up to the nearest 1/4 yard when ordering from a ready-mix supplier.
          </p>

          <h3 className="text-foreground">02. Reinforcement: How Rebar and Mesh Affect Volume</h3>
          <p>
            Many people ask if rebar or wire mesh reduces the amount of concrete needed. Technically, yes, steel takes up space. However, in residential applications, the volume of steel is so negligible (typically less than 0.5%) that it is ignored. In fact, most pros add *more* concrete when using mesh because the mesh often gets pushed down into the subgrade, requiring a slightly thicker pour to ensure it is properly embedded in the center of the slab.
          </p>

          <h3 className="text-foreground">03. Calculating Circular Columns and Holes</h3>
          <p>
            For fence posts, deck footings, or circular pillars, you use the cylinder volume formula: <code>π × r² × Height</code>.
            The radius (r) is half the diameter. In most residential cases, holes are 8, 10, or 12 inches wide. 
            <br/><br/>
            <strong>The "Bell Footing" Factor:</strong> If you are digging footings for a deck, many building codes require a "belled" bottom—a wider base to prevent frost heave. If your hole is 12 inches wide but bells out to 18 inches at the bottom 6 inches, our calculator's multi-section feature allows you to add that small cylinder separately for extreme accuracy.
          </p>

          <div className="my-16 p-10 bg-primary/5 rounded-[2.5rem] border border-primary/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <h2 className="text-primary !mt-0 italic font-black">Concrete Mix Ratios: Strength and Durability</h2>
            <p className="text-primary/80">
              The ratio of cement, sand, and stone (aggregate) determines the "PSI" or compressive strength. Here's a quick cheat sheet for on-site mixing using 80lb bags or bulk raw materials:
            </p>
            <div className="grid md:grid-cols-3 gap-6 not-prose mt-8">
              <div className="bg-white p-6 rounded-3xl border border-primary/10 shadow-sm">
                <span className="text-[10px] font-bold text-primary uppercase">M10 / 2000 PSI</span>
                <h4 className="font-black text-foreground text-xl">1:3:6</h4>
                <p className="text-xs text-muted-foreground mt-2">1 part Cement, 3 parts Sand, 6 parts Gravel. Best for non-structural fill or light fence posts.</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-primary/10 shadow-sm ring-2 ring-primary/20">
                <span className="text-[10px] font-bold text-primary uppercase">M20 / 3000 PSI</span>
                <h4 className="font-black text-foreground text-xl">1:2:4</h4>
                <p className="text-xs text-muted-foreground mt-2">The "Standard Mix." Ideal for driveways, patios, and most residential slabs.</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-primary/10 shadow-sm">
                <span className="text-[10px] font-bold text-primary uppercase">M25 / 4000 PSI</span>
                <h4 className="font-black text-foreground text-xl">1:1.5:3</h4>
                <p className="text-xs text-muted-foreground mt-2">Heavy-duty. Used for structural foundations, beams, and columns.</p>
              </div>
            </div>
          </div>

          <h3 className="text-foreground">04. The Art of Calculating Stairs</h3>
          <p>
            Calculating stairs is often the most confusing part for homeowners. You must calculate the volume of each step separately. 
            Imagine each step as a block that extends down to the landing or the ground. 
            <br/><br/>
            <strong>Step Calculation Logic:</strong>
            <ul>
              <li><strong>Step 1:</strong> Rise × Run × Width</li>
              <li><strong>Step 2:</strong> (Rise × 2) × Run × Width</li>
              <li><strong>Step 3:</strong> (Rise × 3) × Run × Width</li>
            </ul>
            Our calculator automates this math instantly. Don't forget to include the <em>landing</em> (the flat area at the top or bottom) as a separate "Slab" section in our tool to get the total project volume.
          </p>

          <h3 className="text-foreground">05. Ordering Tips: Ready-Mix vs. Bagged</h3>
          <p>
            <strong>When to order a Truck:</strong> Generally, if your project is larger than 1 cubic yard (approx 45-50 bags of 80lb concrete), order a ready-mix truck. The labor of hand-mixing 50 bags is massive, and the consistency of the pour will suffer.
            <br/><br/>
            <strong>"Short-Load" Fees:</strong> Be aware that many suppliers charge a "short-load" fee (often $100-$200) for deliveries less than 5 or 6 yards. Sometimes it is cheaper to order 6 yards and dump the extra on a small secondary project than to order exactly 4 yards.
          </p>

          <h3 className="text-foreground">06. Weather Considerations and Curing</h3>
          <p>
            Concrete chemistry is temperature-dependent. 
            <ul>
              <li><strong>Hot Weather (90°F+):</strong> Concrete sets too fast, leading to surface cracking. Use ice in the mix or pour in the early morning.</li>
              <li><strong>Cold Weather (&lt;40°F):</strong> The hydration process slows drastically. Use "high-early" cement or insulated blankets. Never pour concrete on frozen ground.</li>
            </ul>
          </p>

          <div className="mt-16 p-10 bg-foreground text-background rounded-[3rem]">
            <h3 className="text-background !mt-0 font-black">Pro Tip: The Slump Test</h3>
            <p className="opacity-80 leading-relaxed italic">
              "If you're ordering a truck, ask for a '4-inch slump.' This provides a workable consistency that isn't too runny (which weakens the concrete) but isn't so stiff that it is impossible to level. For stairs, you want a stiffer '3-inch slump' so the concrete stays in the forms without bulging at the bottom."
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Grid */}
      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16">
        <h2 className="text-4xl font-black tracking-tighter text-foreground text-center">Frequently Asked Questions</h2>
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
