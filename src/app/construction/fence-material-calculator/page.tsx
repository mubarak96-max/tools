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

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How fence material quantities are calculated</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            A wooden fence has three main structural components: posts, rails, and pickets (or boards). Each is calculated differently based on the fence dimensions and your chosen spacing.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            <strong>Posts</strong> are calculated by dividing the total fence length by the post spacing and adding 1 for the terminal post. For a 100-foot fence with 8-foot post spacing: (100 / 8) + 1 = 13.5, rounded up to 14 posts. Corner posts, gate posts, and end posts are counted separately.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            <strong>Rails</strong> run horizontally between posts. The number of rails per span depends on fence height — typically 2 rails for fences up to 4 feet, 3 rails for 5–6 foot fences. Total rails = number of spans × rails per span. Rails are typically sold in 8-foot lengths.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            <strong>Pickets</strong> are calculated by dividing the total fence length by the picket spacing (picket width + gap between pickets). A 3.5-inch picket with a 0.5-inch gap has a 4-inch spacing. For 100 feet: (100 × 12) / 4 = 300 pickets. Always add 10% for waste, cutting, and defects.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Choosing the right post spacing</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Post spacing is one of the most important decisions in fence construction. Wider spacing uses fewer posts and reduces cost, but increases the span that rails must bridge, which can cause sagging over time. Narrower spacing is stronger but more expensive.
          </p>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">6-foot spacing:</strong> The most common for residential privacy fences. Provides good structural support for 6-foot tall fences.</li>
            <li><strong className="text-foreground">8-foot spacing:</strong> Suitable for shorter fences (4 feet or less) or when using heavier lumber for rails. Reduces post count by 25% compared to 6-foot spacing.</li>
            <li><strong className="text-foreground">4-foot spacing:</strong> Used for tall fences (7–8 feet), fences in high-wind areas, or when extra rigidity is needed.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Post depth and concrete requirements</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            A general rule for post depth is one-third of the total post length, or a minimum of 2 feet below the frost line in cold climates. For a 6-foot fence, posts should be 9 feet long (6 feet above ground + 3 feet below). In areas with frost, posts must extend below the frost line to prevent heaving — this can be 3–4 feet in northern climates.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Each post hole should be approximately 3 times the post diameter in width. For a 4×4 post (3.5 inches actual), dig a 10–12 inch diameter hole. Fill with concrete to within 2 inches of the surface, sloping the top away from the post to shed water.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Wood species and durability</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Not all wood is equally suited for outdoor fence construction. Ground contact and moisture exposure accelerate decay in untreated wood. The most common options:
          </p>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">Pressure-treated pine:</strong> The most affordable option. Treated with preservatives to resist rot and insects. Suitable for posts and rails. Can be painted or stained.</li>
            <li><strong className="text-foreground">Cedar:</strong> Naturally rot-resistant and insect-repellent. More expensive than treated pine but attractive and long-lasting. Common for pickets and boards.</li>
            <li><strong className="text-foreground">Redwood:</strong> Premium option with excellent natural durability. Expensive and less widely available outside the western US.</li>
            <li><strong className="text-foreground">Composite:</strong> Wood-plastic composite materials require no painting or staining and resist rot and insects. Higher upfront cost but lower maintenance over time.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">
            {faq.map((item) => (
              <article key={item.question} className="rounded-[1.25rem] border border-border bg-background p-5">
                <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <RelatedToolsSection category="Construction" categoryHref="/construction" currentPath={PAGE_PATH} />
    </div>
  );
}
