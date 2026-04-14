import type { Metadata } from "next";
import { AgeGradingCalculator } from "./components/AgeGradingCalculator";
import { HealthToolPage } from "@/app/health/components/HealthToolPage";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/health/age-grading-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is a good age grade percentage?",
    answer:
      "Age grade percentages above 90% are world-class. 80–89% is national class. 70–79% is regional class. 60–69% is local class. 40–59% is typical for recreational runners. Most club runners fall in the 50–70% range. A percentage above 60% generally indicates a competitive performance for your age group.",
  },
  {
    question: "How are age grading factors calculated?",
    answer:
      "The World Masters Athletics (WMA) maintains tables of age factors derived from world record performances at each age. The factor represents the ratio of the open world record to the age-group world record. Your time is divided by the open world record, then multiplied by the age factor to produce a percentage.",
  },
  {
    question: "Can I use age grading to compare performances across different distances?",
    answer:
      "Yes, but with caution. Age grading normalises for age and sex, but different distances have different physiological demands. A runner who excels at 5K may have a higher age grade at that distance than at the marathon. Cross-distance comparisons are approximate rather than exact.",
  },
  {
    question: "Does age grading work the same for men and women?",
    answer:
      "Yes. The WMA tables have separate factors for men and women, each calibrated against the respective world records. This means a 60-year-old woman and a 60-year-old man with the same age grade percentage are performing equally well relative to the world's best in their respective categories.",
  },
  {
    question: "How often are the WMA age grading tables updated?",
    answer:
      "The WMA updates the tables periodically as world records are broken. The most recent major revision was in 2015, with updates in subsequent years. Older calculators may use outdated factors, which can produce slightly different results from newer versions.",
  },
];

export const metadata: Metadata = {
  title: "Race Age Grading Calculator | Compare Running Times Across Ages",
  description:
    "Calculate your age grade percentage for any running distance. Compare your race time against world-class performances for your age and gender using WMA age grading tables.",
  keywords: [
    "age grading calculator",
    "race age grading",
    "WMA age grading",
    "running age factor",
    "age adjusted race time",
    "masters running calculator",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Race Age Grading Calculator",
    description: "Find your age grade percentage and compare your running performance across ages and genders.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Race Age Grading Calculator",
    description: "Calculate your WMA age grade percentage for any running distance.",
  },
};

function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Race Age Grading Calculator",
    url: PAGE_URL,
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free age grading calculator using WMA tables for running distances.",
    featureList: ["WMA age grading tables", "Multiple distances", "Male and female factors"],
  };
}

export default function AgeGradingCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Health", path: "/health" },
    { name: "Age Grading Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}
      <HealthToolPage
        title="Race Age Grading Calculator"
        description="Calculate your age grade percentage for any running distance. Compare your performance against world-class standards for your age and gender using World Masters Athletics tables."
        category="Health"
        path={PAGE_PATH}
        infoSection={
          <>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">What is age grading?</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Age grading is a method of adjusting athletic performances to account for the natural decline in physical capacity that occurs with age. It allows runners of different ages and genders to compare their performances on a level playing field — a 65-year-old running a 45-minute 10K can be compared fairly against a 25-year-old running 35 minutes.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The World Masters Athletics (WMA) organisation maintains the official age grading tables used in masters athletics worldwide. These tables are derived from world record performances at each age group, providing a scientifically grounded basis for comparison.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How the age grade percentage is calculated</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The calculation involves three steps. First, the open world record for the distance is identified. Second, an age factor is applied — this factor represents how much slower the world's best performance at your age is compared to the open world record. Third, your time is compared against this age-adjusted standard.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The formula: <strong>Age Grade % = (Age Standard Time / Your Time) × 100</strong>, where Age Standard Time = Open World Record × Age Factor.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              For example, if the open world record for 10K is 26:17 (men) and the age factor for a 60-year-old man is 1.35, the age standard is 26:17 × 1.35 = 35:28. A 60-year-old man running 35:28 would score exactly 100%. Running 40:00 would score 35:28/40:00 × 100 = 88.7% — a national-class performance.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Age grade performance categories</h2>
            <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
              <li><strong className="text-foreground">90–100% (World class):</strong> Among the best in the world for your age group. Competitive at international masters championships.</li>
              <li><strong className="text-foreground">80–89% (National class):</strong> Competitive at national masters level. Likely to place well in age group categories at major races.</li>
              <li><strong className="text-foreground">70–79% (Regional class):</strong> Strong regional competitor. Consistently competitive in local and regional age group races.</li>
              <li><strong className="text-foreground">60–69% (Local class):</strong> Competitive at local level. A solid performance that most club runners aspire to.</li>
              <li><strong className="text-foreground">40–59% (Recreational):</strong> Typical range for recreational runners who train regularly but are not primarily competitive.</li>
              <li><strong className="text-foreground">Below 40%:</strong> Beginner or occasional runner. Significant room for improvement with consistent training.</li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Using age grading to track improvement over time</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              One of the most valuable uses of age grading is tracking fitness improvement over time, especially for masters athletes. As you age, your absolute times will naturally slow — but your age grade percentage can remain stable or even improve if your fitness is genuinely getting better relative to your age peers.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              A runner who ran a 40-minute 10K at age 40 and runs 43 minutes at age 50 might actually have a higher age grade at 50 than at 40, because the age factor accounts for the expected decline. This makes age grading a more meaningful measure of athletic development than raw times for older athletes.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Age grading is also useful for setting realistic goals. If you know your current age grade percentage, you can calculate what time you would need to run to achieve a target percentage — giving you a concrete, age-appropriate goal rather than chasing times from your younger years.
            </p>

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
        <AgeGradingCalculator />
      </HealthToolPage>
    </>
  );
}
