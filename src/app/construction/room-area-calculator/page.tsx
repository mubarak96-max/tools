import Link from "next/link";
import type { Metadata } from "next";

import { RoomAreaCalculator } from "./components/RoomAreaCalculator";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/construction/room-area-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Room Area Calculator | Square Footage with Additions & Deductions",
  description: "Calculate the exact square footage of any complex room by adding alcoves and subtracting islands or fireplaces. Supports L-shaped and irregular rooms.",
  keywords: ["room area calculator", "square footage calculator", "room size calculator", "floor area calculator", "L-shaped room calculator", "square feet calculator"],
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", url: PAGE_URL, title: "Room Area Calculator", description: "Calculate exact square footage for complex rooms with additions and deductions." },
  twitter: { card: "summary_large_image", title: "Room Area Calculator", description: "Find the exact square footage of any room including L-shapes and irregular layouts." },
};

export default function RoomAreaCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Construction", path: "/construction" },
    { name: "Room Area Calculator", path: PAGE_PATH },
  ]);
  const webAppJsonLd = { "@context": "https://schema.org", "@type": "WebApplication", name: "Room Area Calculator", url: PAGE_URL, applicationCategory: "UtilityApplication", operatingSystem: "All", browserRequirements: "Requires JavaScript", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Free room area calculator for complex rooms with additions and deductions." };

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
            <li className="text-foreground">Room Area Calculator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Construction Tool
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Room Area Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Find the exact square footage of your room. Easily piece together complex L-shaped rooms or large spaces by defining a base square and adding or subtracting smaller zones like closets and kitchen islands.
          </p>
        </div>

        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <RoomAreaCalculator />

      <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How to measure complex rooms accurately</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Rooms are rarely perfectly rectangular. Most contain alcoves, closets, bay windows, kitchen islands, fireplaces, or other features that add or subtract from the usable floor area. The most reliable approach is to break the room into rectangles, calculate each separately, and add or subtract as appropriate.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Start by identifying the largest rectangle that fits within the room — this is your base dimension. Then identify any areas outside this rectangle (additions like closets or alcoves) and any areas inside the rectangle that are not usable floor space (deductions like kitchen islands, stairs, or hearths).
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Step-by-step measurement guide</h2>
          <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">Base rectangle:</strong> Find the longest contiguous length and width of the room. Measure from wall to wall at the widest points. This is your base area.</li>
            <li><strong className="text-foreground">Additions:</strong> Measure any spaces outside the base rectangle — walk-in closets, bay windows, alcoves, or attached hallways. Record each as a separate length × width.</li>
            <li><strong className="text-foreground">Deductions:</strong> Measure any fixed obstacles inside the base rectangle that you cannot walk on or do not need flooring for — kitchen islands, stair openings, fireplaces, or built-in furniture bases. Record each as a separate length × width to subtract.</li>
            <li><strong className="text-foreground">Verify:</strong> Walk the perimeter of the room and check that your measurements account for every wall segment. Walls that are not parallel to each other indicate an irregular room that may need additional rectangles.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Why accurate square footage matters</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Accurate room area is essential for ordering the right amount of flooring, paint, carpet, or tile. Ordering too little means a second trip to the store — and potentially a different dye lot that does not match. Ordering too much wastes money. For most materials, a 10% overage is recommended to account for cuts, waste, and future repairs.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Room area is also used for HVAC sizing, paint coverage calculations, and real estate listings. For real estate purposes, finished square footage typically excludes garages, unfinished basements, and areas with ceiling height below 7 feet.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Material coverage by room area</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Once you have your room area, use these standard coverage rates to estimate material quantities:
          </p>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">Paint:</strong> One gallon covers approximately 350–400 sq ft per coat. For two coats on walls and ceiling, divide total surface area by 175–200 sq ft per gallon.</li>
            <li><strong className="text-foreground">Hardwood flooring:</strong> Order floor area + 10% for cuts and waste. For diagonal installation, add 15%.</li>
            <li><strong className="text-foreground">Tile:</strong> Order floor area + 10% for standard layouts, + 15% for diagonal layouts, + 20% for complex patterns.</li>
            <li><strong className="text-foreground">Carpet:</strong> Carpet is sold in 12-foot wide rolls. Calculate the number of strips needed and multiply by strip length. Add 10% for seams and waste.</li>
            <li><strong className="text-foreground">Laminate flooring:</strong> Order floor area + 10% for cuts. For rooms with many angles or obstacles, add 15%.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">
            {[
              { question: "How do I measure an L-shaped room?", answer: "Divide the L-shape into two rectangles. Measure each rectangle separately (length × width) and add the two areas together. Alternatively, measure the overall bounding rectangle and subtract the missing corner rectangle." },
              { question: "Should I include closets in room square footage?", answer: "For flooring purposes, include closets as they need flooring too. For real estate listings, closets are typically included in bedroom square footage. For paint calculations, closets are separate rooms with their own wall area." },
              { question: "How do I measure a room with a bay window?", answer: "Measure the main room rectangle first. Then measure the bay window as a separate addition — typically a rectangle or trapezoid. Add the bay window area to the main room area for total floor area." },
              { question: "What is the difference between gross and net floor area?", answer: "Gross floor area includes all enclosed space within the exterior walls, including walls, columns, and structural elements. Net floor area (usable area) excludes walls, columns, and non-usable spaces. For flooring and paint, use net floor area." },
              { question: "How accurate does my measurement need to be?", answer: "For material ordering, measure to the nearest inch (or centimetre). Small errors compound over large areas — a 2-inch error in a 20-foot measurement is 0.8%, which on a 500 sq ft room is 4 sq ft. Always add a 10% waste allowance to cover measurement imprecision and cutting waste." },
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
