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

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Why pattern repeat is the most important variable</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Wallpaper is hung in vertical strips called drops. If your wallpaper has a repeating pattern, each strip must be cut so the pattern aligns perfectly with the adjacent strip. This alignment requires trimming material from the top of each roll, and that trimmed material is wasted. The larger the pattern repeat, the more waste per strip.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            For a straight match pattern with a 12-inch repeat, you waste up to 12 inches per strip. For a drop match with a 24-inch repeat, you can waste up to 24 inches per strip. On a room with 10 strips, a 24-inch drop match wastes up to 20 feet of wallpaper — potentially an entire roll.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Types of pattern match</h2>
          <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">Free match (no repeat):</strong> Solid colours, textures, and some abstract designs. No waste from pattern matching. The most economical option.</li>
            <li><strong className="text-foreground">Straight match:</strong> The pattern repeats horizontally at the same height across all strips. Each strip starts at the same point in the pattern. Waste equals up to one full repeat per strip.</li>
            <li><strong className="text-foreground">Half-drop match:</strong> The pattern drops by half the repeat height on alternating strips. Creates a diagonal visual effect. Waste can equal up to one full repeat per strip, and you need to cut from two different points in the pattern alternately.</li>
            <li><strong className="text-foreground">Random match:</strong> The pattern is designed to be hung without alignment. Rare in modern wallpaper but common in some grasscloth and natural fibre wallcoverings.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Standard roll sizes and coverage</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Wallpaper roll sizes vary by country and manufacturer. Common standards:
          </p>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">US single roll:</strong> Typically 27 inches wide × 13.5 feet long = 30.4 sq ft. Often sold as double rolls (60.8 sq ft).</li>
            <li><strong className="text-foreground">European roll:</strong> Typically 20.5 inches (52 cm) wide × 33 feet (10 m) long = 56.4 sq ft (5.25 m²).</li>
            <li><strong className="text-foreground">UK roll:</strong> Typically 20.5 inches (52 cm) wide × 33 feet (10 m) long, same as European standard.</li>
          </ul>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Always verify the exact dimensions of your chosen wallpaper before ordering. Some designer wallpapers come in non-standard widths (24", 27", 36") and lengths. This calculator uses the specific dimensions you enter, bypassing standard size assumptions entirely.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How to measure your room accurately</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Accurate room measurement is critical for ordering the right amount of wallpaper. Follow these steps:
          </p>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Measure the perimeter of the room (sum of all wall widths) in feet or metres.</li>
            <li>Measure the ceiling height from floor to ceiling.</li>
            <li>Measure the width and height of all doors and windows. Subtract these from the total wall area.</li>
            <li>For rooms with sloped ceilings (attics, dormers), measure the average height.</li>
            <li>Add 10–15% to your final roll count as a safety margin for mistakes, future repairs, and dye lot matching.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">
            {[
              { question: "How many rolls of wallpaper do I need for a 12×12 room?", answer: "A 12×12 room with 8-foot ceilings has approximately 384 sq ft of wall area. Subtract doors (typically 21 sq ft each) and windows (typically 15 sq ft each). For a room with one door and two windows, net area is about 333 sq ft. At 30 sq ft per single roll with 10% waste, you need approximately 12 single rolls (6 double rolls)." },
              { question: "Should I order extra wallpaper?", answer: "Always order 10–15% extra. Wallpaper is produced in batches (dye lots), and colours can vary slightly between batches. If you run short and need to reorder, the new batch may not match perfectly. Extra rolls are also useful for future repairs." },
              { question: "Can I wallpaper over existing wallpaper?", answer: "It is generally not recommended. Old wallpaper can bubble, peel, or show through the new layer. The added weight can also cause both layers to fall. Remove existing wallpaper before applying new wallpaper for the best results." },
              { question: "What is the difference between wallpaper and wallcovering?", answer: "Wallpaper traditionally refers to paper-based products. Wallcovering is a broader term that includes vinyl, fabric, grasscloth, and other materials. Vinyl wallcoverings are more durable and washable than paper, making them popular for kitchens and bathrooms." },
              { question: "How do I calculate wallpaper for a ceiling?", answer: "Measure the ceiling area (length × width). Divide by the usable area per roll (accounting for pattern repeat waste). Ceiling installation is more challenging than walls — consider adding 20% waste allowance for the difficulty of aligning patterns overhead." },
            ].map((item) => (
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
