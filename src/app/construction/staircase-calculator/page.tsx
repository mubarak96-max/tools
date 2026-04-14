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

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Staircase terminology explained</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Understanding stair terminology is essential before building. The key terms:
          </p>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">Rise:</strong> The vertical height of a single step. Also called riser height.</li>
            <li><strong className="text-foreground">Run:</strong> The horizontal depth of a single step (the part you walk on). Also called tread depth.</li>
            <li><strong className="text-foreground">Total rise:</strong> The total vertical distance from the lower floor to the upper floor.</li>
            <li><strong className="text-foreground">Total run:</strong> The total horizontal distance the staircase covers from the first riser to the last.</li>
            <li><strong className="text-foreground">Stringer:</strong> The diagonal structural board that supports the treads and risers. Most staircases use two or three stringers.</li>
            <li><strong className="text-foreground">Nosing:</strong> The front edge of the tread that overhangs the riser below. Typically 0.75–1.25 inches.</li>
            <li><strong className="text-foreground">Headroom:</strong> The vertical clearance above the stair nosing to any overhead obstruction.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">The rise-run formula for comfortable stairs</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            The most widely used formula for comfortable stair proportions is: <strong>2 × rise + run = 24–25 inches</strong>. This formula, attributed to French architect François Blondel in 1675, produces stairs that feel natural to climb because they match the average human stride.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Common comfortable combinations: 7" rise + 11" run (2×7+11=25), 7.5" rise + 10" run (2×7.5+10=25), 6.5" rise + 11" run (2×6.5+11=24). Steeper stairs (higher rise, shorter run) are more compact but tiring to climb. Shallower stairs (lower rise, longer run) are easier to climb but require more horizontal space.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Building code requirements for residential stairs</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            The International Residential Code (IRC) sets minimum standards for residential stair construction in the US. Key requirements:
          </p>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">Maximum riser height:</strong> 7.75 inches (196 mm)</li>
            <li><strong className="text-foreground">Minimum tread depth:</strong> 10 inches (254 mm)</li>
            <li><strong className="text-foreground">Minimum headroom:</strong> 6 feet 8 inches (2032 mm)</li>
            <li><strong className="text-foreground">Minimum stair width:</strong> 36 inches (914 mm)</li>
            <li><strong className="text-foreground">Riser consistency:</strong> The greatest riser height in any flight must not exceed the smallest by more than 3/8 inch</li>
            <li><strong className="text-foreground">Handrail height:</strong> 34–38 inches above the stair nosing</li>
          </ul>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Always verify requirements with your local building department, as some jurisdictions have stricter standards than the IRC minimums.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How to cut a stair stringer</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Cutting a stringer accurately is the most technically demanding part of stair construction. The process:
          </p>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Mark the rise and run dimensions on a framing square using stair gauges (small clamps that attach to the square).</li>
            <li>Position the square at the top of the stringer board and trace the first step. Slide the square down and repeat for each step.</li>
            <li>The bottom cut must be reduced by the thickness of the tread material so the first step has the same effective rise as all others.</li>
            <li>Use a circular saw to make the cuts, stopping short of the corner and finishing with a handsaw to avoid weakening the stringer.</li>
            <li>The minimum remaining stringer depth after cutting (the "effective depth") should be at least 3.5 inches for structural integrity.</li>
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
