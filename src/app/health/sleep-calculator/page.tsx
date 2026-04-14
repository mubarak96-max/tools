import type { Metadata } from "next";
import { SleepCalculator } from "./components/SleepCalculator";
import { HealthToolPage } from "@/app/health/components/HealthToolPage";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/health/sleep-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How many sleep cycles do I need per night?",
    answer:
      "Most adults need 5–6 complete sleep cycles per night, totalling 7.5–9 hours. Fewer than 4 cycles (6 hours) consistently leads to sleep debt and impaired cognitive function. The exact number varies by individual — some people function well on 5 cycles while others need 6.",
  },
  {
    question: "What happens if I wake up in the middle of a sleep cycle?",
    answer:
      "Waking during deep sleep (N3 stage) causes sleep inertia — the grogginess and disorientation that can last 15–60 minutes. Waking at the end of a cycle, during light sleep (N1 or N2), produces a much more alert awakening. This is why timing your alarm to the end of a cycle can make a significant difference to how you feel.",
  },
  {
    question: "Does the 90-minute cycle length vary between people?",
    answer:
      "Yes. Sleep cycles average 90 minutes but range from 70–120 minutes between individuals and even vary within the same person across the night. Earlier cycles tend to be shorter; later cycles are longer. The 90-minute figure is a useful approximation but not exact for everyone.",
  },
  {
    question: "How much sleep do different age groups need?",
    answer:
      "The National Sleep Foundation recommends: newborns 14–17 hours, infants 12–15 hours, toddlers 11–14 hours, school-age children 9–11 hours, teenagers 8–10 hours, adults 7–9 hours, and older adults 7–8 hours. Individual variation within these ranges is normal.",
  },
  {
    question: "Can I catch up on lost sleep at the weekend?",
    answer:
      "Partially. Weekend recovery sleep can reduce some of the cognitive impairment from weekday sleep restriction, but it does not fully reverse all effects. Chronic sleep debt accumulates over time and cannot be completely repaid. Consistent sleep timing is more beneficial than irregular patterns with weekend catch-up.",
  },
];

export const metadata: Metadata = {
  title: "Sleep Cycle Calculator | Best Time to Wake Up or Go to Bed",
  description:
    "Calculate the best times to wake up or go to sleep based on 90-minute sleep cycles. Avoid morning grogginess by waking at the end of a complete cycle.",
  keywords: [
    "sleep cycle calculator",
    "best time to wake up",
    "sleep calculator",
    "90 minute sleep cycle",
    "when to go to sleep",
    "sleep inertia calculator",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Sleep Cycle Calculator — Wake Up Refreshed",
    description: "Find the best wake-up times based on 90-minute sleep cycles to avoid morning grogginess.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sleep Cycle Calculator",
    description: "Calculate optimal wake-up times based on your sleep cycles for a more refreshed morning.",
  },
};

function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Sleep Cycle Calculator",
    url: PAGE_URL,
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free sleep cycle calculator based on 90-minute sleep cycles.",
    featureList: ["Wake-up time recommendations", "Bedtime calculator", "Sleep cycle count"],
  };
}

export default function SleepCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Health", path: "/health" },
    { name: "Sleep Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}
      <HealthToolPage
        title="Sleep Cycle Calculator"
        description="Find the best times to wake up or go to bed by aligning with your body's natural 90-minute sleep cycles. Wake at the end of a cycle to feel alert and refreshed."
        category="Health"
        path={PAGE_PATH}
        infoSection={
          <>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">The science of sleep cycles</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Sleep is not a uniform state — it is a dynamic process that cycles through distinct stages throughout the night. A complete sleep cycle lasts approximately 90 minutes and consists of four stages: N1 (light sleep), N2 (deeper light sleep), N3 (deep slow-wave sleep), and REM (Rapid Eye Movement) sleep.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The proportion of each stage changes across the night. Early cycles contain more N3 deep sleep, which is critical for physical restoration, immune function, and memory consolidation. Later cycles contain more REM sleep, which is associated with emotional processing, creativity, and procedural memory.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">The four stages of sleep</h2>
            <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
              <li><strong className="text-foreground">N1 — Light sleep (5% of total sleep):</strong> The transition between wakefulness and sleep. Easily disrupted. Muscle twitches (hypnic jerks) are common. Brain produces theta waves.</li>
              <li><strong className="text-foreground">N2 — Deeper light sleep (45–55% of total sleep):</strong> Heart rate slows, body temperature drops. Sleep spindles and K-complexes appear in brain activity. Memory consolidation begins. Most of the night is spent here.</li>
              <li><strong className="text-foreground">N3 — Deep slow-wave sleep (15–25% of total sleep):</strong> The most restorative stage. Growth hormone is released. Immune system is strengthened. Hardest to wake from — this is where sleep inertia originates. Decreases with age.</li>
              <li><strong className="text-foreground">REM — Rapid Eye Movement (20–25% of total sleep):</strong> Brain activity resembles wakefulness. Vivid dreaming occurs. Emotional memories are processed. Motor paralysis prevents acting out dreams. Increases in proportion through the night.</li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Why waking at the end of a cycle matters</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Sleep inertia — the grogginess and impaired performance immediately after waking — is most severe when you are woken from N3 deep sleep. It can last anywhere from 15 minutes to over an hour and significantly impairs cognitive performance, reaction time, and decision-making.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              By timing your alarm to coincide with the end of a 90-minute cycle, you are more likely to wake during N1 or N2 light sleep, when the brain is already transitioning toward wakefulness. The result is a more alert, less groggy awakening — even if the total sleep time is slightly less than waking mid-cycle.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Sleep and health: the evidence</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Chronic sleep deprivation (consistently below 7 hours for adults) is associated with a wide range of health consequences. Research links insufficient sleep to increased risk of obesity, type 2 diabetes, cardiovascular disease, depression, and impaired immune function. Even a single night of poor sleep measurably impairs glucose metabolism and increases appetite-stimulating hormones.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Cognitive effects are equally significant. Sleep-deprived individuals show impaired attention, working memory, and executive function comparable to being legally drunk. Critically, sleep-deprived people consistently underestimate their own impairment — they feel less tired than they actually are.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The good news is that sleep quality and quantity can be significantly improved through consistent sleep hygiene: maintaining a regular sleep schedule, keeping the bedroom cool and dark, avoiding caffeine after early afternoon, limiting alcohol (which disrupts REM sleep), and reducing screen exposure before bed.
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
        <SleepCalculator />
      </HealthToolPage>
    </>
  );
}
