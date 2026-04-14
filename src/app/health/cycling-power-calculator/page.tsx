import type { Metadata } from "next";
import { CyclingPowerCalculator } from "./components/CyclingPowerCalculator";
import { HealthToolPage } from "@/app/health/components/HealthToolPage";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/health/cycling-power-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is a good watts per kilogram for cycling?",
    answer:
      "For untrained cyclists, 1.5–2.5 W/kg is typical. Recreational cyclists average 2.5–3.5 W/kg. Cat 4/5 racers are around 3.5–4.0 W/kg. Cat 1/2 racers reach 4.5–5.5 W/kg. Professional cyclists typically sustain 5.5–6.5 W/kg for an hour, with elite climbers exceeding 6.5 W/kg.",
  },
  {
    question: "What is FTP and how does it relate to W/kg?",
    answer:
      "FTP (Functional Threshold Power) is the maximum average power you can sustain for approximately one hour. W/kg is simply your FTP divided by your body weight in kilograms. It is the standard metric for comparing cycling fitness across riders of different sizes.",
  },
  {
    question: "How do I improve my W/kg?",
    answer:
      "You can improve W/kg by increasing your FTP through structured training (threshold intervals, VO2 max work, and base endurance), or by reducing body weight while maintaining power. Both approaches work, but increasing power is generally more sustainable than aggressive weight loss.",
  },
  {
    question: "Why does W/kg matter more than absolute watts for climbing?",
    answer:
      "On flat terrain, absolute power output determines speed. On climbs, gravity becomes the dominant resistance force, and the power required to overcome gravity scales with body weight. A lighter rider with the same W/kg as a heavier rider will climb at the same speed, but the lighter rider achieves this with lower absolute watts.",
  },
  {
    question: "How do I measure my FTP accurately?",
    answer:
      "The most common field test is a 20-minute all-out effort on a power meter, then multiplying the average power by 0.95. Ramp tests (increasing power every minute until failure) are also popular and less mentally demanding. Both require a calibrated power meter for accuracy.",
  },
];

export const metadata: Metadata = {
  title: "Cycling Power to Weight Ratio Calculator | W/kg for Cyclists",
  description:
    "Calculate your cycling power-to-weight ratio (W/kg) from your FTP and body weight. Compare your result against cycling performance categories from untrained to professional.",
  keywords: [
    "cycling power to weight ratio",
    "watts per kilogram calculator",
    "W/kg cycling calculator",
    "FTP calculator",
    "cycling performance calculator",
    "cycling fitness calculator",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Cycling Power to Weight Ratio Calculator",
    description: "Calculate your W/kg from FTP and body weight. See where you rank against cycling performance categories.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cycling Power to Weight Ratio (W/kg)",
    description: "Find your cycling W/kg and compare against performance categories from recreational to professional.",
  },
};

function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Cycling Power to Weight Ratio Calculator",
    url: PAGE_URL,
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free cycling W/kg calculator with performance category comparison.",
    featureList: ["W/kg calculation", "Performance category comparison", "FTP and weight inputs"],
  };
}

export default function CyclingPowerCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Health", path: "/health" },
    { name: "Cycling Power Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}
      <HealthToolPage
        title="Cycling Power to Weight Ratio Calculator"
        description="Calculate your watts per kilogram (W/kg) from your FTP and body weight. Compare your result against performance categories from untrained to professional cyclist."
        category="Health"
        path={PAGE_PATH}
        infoSection={
          <>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Why W/kg is the key cycling metric</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Power-to-weight ratio (W/kg) is the single most important performance metric in cycling, particularly for climbing and sustained efforts. It normalises power output for body weight, allowing fair comparison between riders of different sizes. A 60 kg rider producing 240 W and an 80 kg rider producing 320 W have identical W/kg (4.0) and will climb at the same speed.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              On flat terrain, aerodynamics and absolute power matter more. But as gradient increases, gravity becomes the dominant resistance, and W/kg becomes the primary determinant of climbing speed. This is why elite climbers in the Tour de France are typically lighter riders with exceptional power outputs.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Cycling performance categories by W/kg</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              These categories are based on sustained one-hour power (FTP) divided by body weight:
            </p>
            <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
              <li><strong className="text-foreground">Untrained (below 2.0 W/kg):</strong> New to cycling or returning after a long break. Focus on building aerobic base with consistent riding.</li>
              <li><strong className="text-foreground">Recreational (2.0–3.0 W/kg):</strong> Regular cyclists who ride for fitness. Can complete sportives and century rides comfortably.</li>
              <li><strong className="text-foreground">Trained (3.0–4.0 W/kg):</strong> Dedicated cyclists with structured training. Competitive in local events and gran fondos.</li>
              <li><strong className="text-foreground">Competitive (4.0–5.0 W/kg):</strong> Category 3–4 racers. Serious training commitment with periodised plans.</li>
              <li><strong className="text-foreground">Elite (5.0–6.0 W/kg):</strong> Category 1–2 racers and domestic professionals. Full-time training.</li>
              <li><strong className="text-foreground">World class (above 6.0 W/kg):</strong> Professional peloton level. Exceptional genetics combined with years of elite training.</li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How to improve your W/kg</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              There are two levers: increase power or reduce weight. For most cyclists, increasing FTP through structured training is more effective and sustainable than aggressive weight loss. The most evidence-based training approaches for FTP improvement include:
            </p>
            <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
              <li><strong className="text-foreground">Sweet spot training (88–93% FTP):</strong> High training stimulus with manageable fatigue. Effective for building FTP with moderate volume.</li>
              <li><strong className="text-foreground">Threshold intervals (95–105% FTP):</strong> Direct FTP training. Typically 2×20 minutes or 3×15 minutes at threshold.</li>
              <li><strong className="text-foreground">VO2 max intervals (106–120% FTP):</strong> Short, intense efforts that raise your aerobic ceiling, allowing FTP to follow.</li>
              <li><strong className="text-foreground">Base endurance (60–75% FTP):</strong> Long, easy rides that build aerobic efficiency and fat oxidation capacity.</li>
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
          </>
        }
      >
        <CyclingPowerCalculator />
      </HealthToolPage>
    </>
  );
}
