import type { Metadata } from "next";
import { SwimPaceCalculator } from "./components/SwimPaceCalculator";
import { HealthToolPage } from "@/app/health/components/HealthToolPage";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/health/swim-pace-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is a good swimming pace per 100m?",
    answer:
      "For recreational swimmers, 2:00–2:30 per 100m is typical. Competitive club swimmers average 1:20–1:45 per 100m. Elite open water swimmers sustain around 1:05–1:15 per 100m. For triathlon, a 1:30–1:45 per 100m pace is competitive at the amateur level.",
  },
  {
    question: "How does pool pace compare to open water pace?",
    answer:
      "Open water swimming is typically 5–10% slower than pool swimming due to the absence of walls to push off, navigation demands, waves, currents, and wetsuit buoyancy (which can partially offset the difference). Most triathletes add 10–15 seconds per 100m when estimating open water times from pool training.",
  },
  {
    question: "What is CSS (Critical Swim Speed)?",
    answer:
      "Critical Swim Speed is the theoretical maximum pace you can sustain aerobically — roughly equivalent to your lactate threshold pace. It is calculated from your best 400m and 200m times: CSS = (400m time − 200m time) / 200. Training at CSS pace builds aerobic capacity efficiently.",
  },
  {
    question: "How do I convert between 25m and 50m pool paces?",
    answer:
      "Times in a 25m pool are typically 1–3 seconds per 100m faster than in a 50m pool due to more frequent turns and push-offs. When comparing times, add approximately 2 seconds per 100m when converting from a 25m pool to a 50m pool equivalent.",
  },
  {
    question: "How many lengths is 1500m in a 25m pool?",
    answer:
      "1500m in a 25m pool is 60 lengths (30 laps). In a 50m pool it is 30 lengths (15 laps). The Olympic triathlon swim distance is 1500m; the Ironman 70.3 is 1900m (76 lengths in a 25m pool); the full Ironman is 3800m (152 lengths).",
  },
];

export const metadata: Metadata = {
  title: "Swim Pace Calculator | Swimming Speed per 100m and 100 Yards",
  description:
    "Calculate your swimming pace per 100m or 100 yards from any distance and time. Convert between pool lengths and estimate open water and triathlon swim times.",
  keywords: [
    "swim pace calculator",
    "swimming pace per 100m",
    "swim speed calculator",
    "triathlon swim pace",
    "CSS calculator swimming",
    "pool pace calculator",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Swim Pace Calculator — Speed per 100m",
    description: "Calculate your swimming pace per 100m or 100 yards and estimate triathlon swim times.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Swim Pace Calculator",
    description: "Find your swimming pace per 100m and convert between pool distances and open water times.",
  },
};

function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Swim Pace Calculator",
    url: PAGE_URL,
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free swimming pace calculator for pool and open water distances.",
    featureList: ["Pace per 100m and 100yd", "Distance and time inputs", "Triathlon distance estimates"],
  };
}

export default function SwimPaceCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Health", path: "/health" },
    { name: "Swim Pace Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}
      <HealthToolPage
        title="Swim Pace Calculator"
        description="Calculate your swimming pace per 100m or 100 yards from any distance and time. Useful for triathlon planning, training zone setting, and comparing pool vs open water performance."
        category="Health"
        path={PAGE_PATH}
        infoSection={
          <>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Why pace per 100m is the standard swimming metric</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Unlike running, where pace per kilometre or mile is standard, swimming uses pace per 100 metres (or 100 yards in the US) as the primary performance metric. This is because swimming distances are typically measured in pool lengths, and 100m represents a round number of lengths in both 25m and 50m pools. It also provides a granular enough unit to meaningfully compare performances across different distances.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Knowing your pace per 100m allows you to predict finish times for any distance, set training zones, and compare your performance against benchmarks. A swimmer who knows they average 1:45 per 100m can immediately calculate that a 1500m swim will take approximately 26:15.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Swimming training zones</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Effective swim training uses different intensity zones, each targeting different physiological adaptations. The most practical framework for recreational and competitive swimmers uses CSS (Critical Swim Speed) as the reference point:
            </p>
            <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
              <li><strong className="text-foreground">Zone 1 — Easy (CSS + 20s/100m or slower):</strong> Recovery swimming and aerobic base building. Should feel comfortable and conversational.</li>
              <li><strong className="text-foreground">Zone 2 — Aerobic (CSS + 10–20s/100m):</strong> The foundation of endurance training. Builds aerobic capacity without excessive fatigue.</li>
              <li><strong className="text-foreground">Zone 3 — Threshold (CSS ± 5s/100m):</strong> CSS pace training. Highly effective for improving lactate threshold and race pace endurance.</li>
              <li><strong className="text-foreground">Zone 4 — VO2 max (CSS − 5–15s/100m):</strong> Short, hard intervals. Raises aerobic ceiling and improves speed.</li>
              <li><strong className="text-foreground">Zone 5 — Sprint (CSS − 15s/100m or faster):</strong> Maximum effort sprints. Develops neuromuscular power and top-end speed.</li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Common triathlon swim distances and target paces</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              For triathletes, swim pace directly affects overall race time and energy expenditure for the bike and run legs. Here are the standard distances and typical competitive amateur paces:
            </p>
            <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
              <li><strong className="text-foreground">Sprint triathlon (750m):</strong> Competitive amateurs aim for 1:30–1:45 per 100m, finishing in 11–13 minutes.</li>
              <li><strong className="text-foreground">Olympic triathlon (1500m):</strong> Target 1:35–1:50 per 100m for a 24–28 minute swim.</li>
              <li><strong className="text-foreground">Ironman 70.3 (1900m):</strong> Aim for 1:40–1:55 per 100m for a 32–37 minute swim.</li>
              <li><strong className="text-foreground">Full Ironman (3800m):</strong> Sustainable pace of 1:45–2:00 per 100m for a 66–76 minute swim.</li>
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
        <SwimPaceCalculator />
      </HealthToolPage>
    </>
  );
}
