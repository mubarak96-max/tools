import Link from "next/link";
import type { Metadata } from "next";
import { FenceMaterialCalculator } from "./components/FenceMaterialCalculator";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/construction/fence-material-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How many fence posts do I need per linear foot?",
    answer:
      "Standard fence post spacing is 6–8 feet on centre. For a 6-foot spacing, divide your total fence length by 6 and add 1 for the end post. For a 100-foot fence at 6-foot spacing, you need 17 posts (16 spans + 1). Corner and gate posts are additional.",
  },
  {
    question: "How many rails does a wooden fence need?",
    answer:
      "Most wooden privacy fences use 2 horizontal rails for fences up to 4 feet tall, and 3 rails for fences 5–6 feet tall. Taller fences (7–8 feet) typically need 4 rails. Rails are typically 8 feet long and span between posts.",
  },
  {
    question: "How do I calculate the number of pickets?",
    answer:
      "Divide the total fence length by the picket spacing (picket width + gap). For example, a 100-foot fence with 3.5-inch pickets and 0.5-inch gaps uses 4-inch spacing: 100 × 12 / 4 = 300 pickets. Always add 10% for waste and cutting.",
  },
  {
    question: "What is the standard height for a privacy fence?",
    answer:
      "Standard privacy fence height is 6 feet in most residential areas. Some municipalities allow up to 8 feet in backyards. Front yard fences are typically limited to 3–4 feet. Always check local zoning regulations before building.",
  },
  {
    question: "How much concrete do I need per fence post?",
    answer:
      "A standard rule is one 50 lb bag of concrete mix per post for posts up to 4 feet tall, and two bags for taller posts. For a 6-foot fence with posts set 2 feet deep in a 10-inch diameter hole, approximately 0.09 cubic feet of concrete is needed per post.",
  },
];

export const metadata: Metadata = {
  title: "Fence Material Calculator | Posts, Rails & Pickets Estimator",
  description:
    "Calculate the exact number of fence posts, rails, and pickets needed for your wooden fence project. Includes waste allowance and standard spacing options.",
  keywords: [
    "fence material calculator",
    "fence post calculator",
    "fence picket calculator",
    "wooden fence calculator",
    "fence rail calculator",
    "fence materials estimator",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Fence Material Calculator — Posts, Rails & Pickets",
    description: "Calculate exactly how many posts, rails, and pickets you need for your fence project.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fence Material Calculator",
    description: "Estimate fence posts, rails, and pickets for any wooden fence project.",
  },
};

function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Fence Material Calculator",
    url: PAGE_URL,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free fence material calculator for posts, rails, and pickets with waste allowance.",
    featureList: ["Post count calculation", "Rail quantity estimation", "Picket count with spacing options"],
  };
}

export default function FenceMaterialCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Construction", path: "/construction" },
    { name: "Fence Material Calculator", path: PAGE_PATH },
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
            <li className="text-foreground">Fence Material Calculator</li>
          </ol>
        </nav>
        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Construction Tool
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Fence Material Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Calculate the exact number of posts, rails, and pickets needed for your wooden fence. Enter your fence dimensions and spacing preferences for an accurate material list with waste allowance.
          </p>
        </div>
        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <FenceMaterialCalculator />

      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 bg-white/40 backdrop-blur-3xl shadow-2vw">
        <div className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-muted-foreground">
          <h2 className="text-4xl text-foreground italic">The Architect's Perimeter: A Deep Dive into Fencing Materials</h2>
          <p>
            A fence is more than a boundary; it is a structural project that must withstand wind loads, soil movement, and the relentless elements. Calculating the materials for a fence requires a breakdown of four distinct systems: the Foundation (Concrete), the Core Support (Posts), the Framing (Rails), and the Facade (Pickets). Missing a single bag of concrete or a few dozen nails can halt a project for hours.
          </p>
          
          <h3 className="text-foreground">01. The Foundation: Beyond the Surface</h3>
          <p>
            The longevity of your fence starts underground. In many climates, the <strong>Frost Line</strong> is your biggest enemy. If you set your posts only 2 feet deep but the frost line is 3 feet, the freezing ground will "heave" your posts upward, causing your fence to lean or crack within three seasons.
            <br/><br/>
            Professionals follow the "1/3 Rule": At least 1/3 of the total post length should be buried. For a 6-foot fence, you need an 8-foot or 9-foot post, with 2-3 feet of it encased in concrete.
          </p>

          <h3 className="text-foreground">02. Framing & Spanning: Avoiding the "Sway"</h3>
          <p>The "Rail" system is what provides lateral stability. Choosing the right number of rails is dependent on height:</p>
          <ul>
            <li><strong>4 Ft Fence:</strong> 2 horizontal rails (Top and Bottom).</li>
            <li><strong>6 Ft Privacy Fence:</strong> 3 horizontal rails. Without the middle rail, your pickets will warp and "cup" toward the sun within 12 months.</li>
            <li><strong>8 Ft Fence:</strong> 4 horizontal rails. Wind load on an 8-foot tall "wall" is immense; the extra rail distributes the pressure evenly across the posts.</li>
          </ul>

          <div className="my-16 p-10 bg-foreground text-background rounded-[3rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <h3 className="text-primary font-black italic !mt-0">Pro Tip: The Staining "Dry Time" Rule</h3>
             <p className="opacity-80 leading-relaxed mb-0">
               If you use pressure-treated (PT) lumber, **do not stain it immediately.** Fresh PT wood is saturated with chemical preservatives and water. If you seal it too early, the stain will peel within weeks. Wait for the "Bead Test": Splash water on the wood. If it soaks in, the wood is dry enough to stain. This usually takes 2-4 months of outdoor exposure.
             </p>
          </div>

          <h3 className="text-foreground">03. Property Lines & Legal Setbacks</h3>
          <p>
            Before buying a single post, you must know your <strong>Setback Requirements</strong>. Many municipalities require fences to be placed 2-6 inches inside your property line. 
            <br/><br/>
            Additionally, the "Good side" rule is common law in many areas: the finished, attractive side of the fence must face your neighbors, while the structural rails and posts face your own property. Our calculator helps you account for the extra pickets needed for "Shadowbox" or "Double-Sided" fences where both sides look finished.
          </p>

          <h3 className="text-foreground">04. Material Quality & Fasteners</h3>
          <p>
             Choosing the wrong nails is why most fences fail. Using "Standard" nails with pressure-treated wood causes a chemical reaction that eats the metal, leading to black streaks and falling boards.
             <ul>
               <li><strong>Hot-Dipped Galvanized:</strong> The minimum standard for exterior fencing.</li>
               <li><strong>Stainless Steel:</strong> Mandatory if you live within 5 miles of the ocean to prevent salt-air corrosion.</li>
               <li><strong>Screws vs. Nails:</strong> While nails are faster, exterior-grade screws prevent pickets from "popping" off as the wood expands and contracts seasonally.</li>
             </ul>
          </p>
        </div>
      </section>

      {/* FAQ Grid */}
      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 relative overflow-hidden bg-muted/5">
        <h2 className="text-4xl font-black tracking-tighter text-foreground text-center italic">Fence Planning FAQ</h2>
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3 text-balance">
          {[
            { 
              question: "How much concrete do I need per post?", 
              answer: "For a standard 4x4 post, expect to use 1.5 to 2 bags (80lb each) of high-strength concrete. This provides a 10-inch diameter base that provides the weight necessary to anchor against high winds." 
            },
            { 
              question: "What is the best wood for a long-lasting fence?", 
              answer: "Western Red Cedar is the industry gold standard for pickets due to natural oils that resist rot. For posts, Pressure-Treated Pine is preferred as it handles ground contact better than untreated cedar." 
            },
            { 
              question: "How do I calculate for a hilly or sloped yard?", 
              answer: "You have two choices: 'Racked' (where the fence follows the ground slope) or 'Stepped' (where each section is level but drops down like stairs). Stepped fences require longer posts for the downhill side—calculate for an extra 2 feet of post length." 
            },
            {
              question: "What's the difference between a corner post and a line post?", 
              answer: "Line posts have rails passing through or attaching to two sides. Corner posts must handle tension from two different directions at a 90-degree angle and usually need a larger concrete footer (3 bags instead of 2)."
            },
            {
              question: "How many pickets should I buy for a shadowbox fence?",
              answer: "A shadowbox fence (also called 'Board on Board') uses alternating pickets on both sides. You need approximately 70% more pickets than a standard privacy fence. Our calculator includes a 'Board on Board' toggle for this exact reason."
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
