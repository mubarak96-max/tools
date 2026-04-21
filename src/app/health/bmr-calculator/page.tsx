import type { Metadata } from "next";
import Link from "next/link";
import { BmrCalculator } from "./components/BmrCalculator";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/health/bmr-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is a good BMR?",
    answer:
      "For women, an average BMR is 1,400–1,600 kcal/day. For men, it is typically 1,600–1,800 kcal/day. Your individual BMR depends on age, weight, height, and muscle mass. Higher values indicate a faster resting metabolism.",
  },
  {
    question: "Does BMR change with age?",
    answer:
      "Yes. BMR typically decreases by about 2–8% per decade after age 30. This is primarily because muscle mass declines with age (sarcopenia), and muscle tissue burns significantly more calories at rest than fat tissue. Regular resistance training can slow this decline.",
  },
  {
    question: "What is the difference between BMR and TDEE?",
    answer:
      "BMR is the calories your body burns at complete rest — just to keep you alive. TDEE (Total Daily Energy Expenditure) is your BMR multiplied by an activity factor, representing total calories burned including all movement and exercise. TDEE is always higher than BMR.",
  },
  {
    question: "Which BMR formula is most accurate?",
    answer:
      "The Mifflin-St Jeor equation (1990) is considered the most accurate for modern populations. It outperforms the older Harris-Benedict formula (1919), particularly for people with higher body weight. The Katch-McArdle formula is more accurate if you know your lean body mass.",
  },
  {
    question: "How do I use BMR to lose weight?",
    answer:
      "Multiply your BMR by your activity factor to get your TDEE. Then eat 300–500 calories below your TDEE to create a deficit. A 500-calorie daily deficit produces approximately 0.5 kg of fat loss per week. Never eat below your BMR for extended periods as this causes muscle loss and metabolic adaptation.",
  },
];

export const metadata: Metadata = {
  title: "BMR Calculator | Basal Metabolic Rate — Mifflin-St Jeor Formula",
  description:
    "Calculate your Basal Metabolic Rate (BMR) using the Mifflin-St Jeor formula. Find out how many calories your body burns at rest and use it to set your calorie targets.",
  keywords: [
    "BMR calculator",
    "basal metabolic rate calculator",
    "Mifflin St Jeor calculator",
    "resting metabolic rate",
    "calories burned at rest",
    "BMR formula calculator",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "BMR Calculator — Basal Metabolic Rate",
    description: "Calculate how many calories your body burns at rest using the Mifflin-St Jeor formula.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BMR Calculator",
    description: "Find your Basal Metabolic Rate and use it to set accurate calorie targets for weight loss or gain.",
  },
};

function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "BMR Calculator",
    url: PAGE_URL,
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free BMR calculator using the Mifflin-St Jeor formula for men and women.",
    featureList: ["Mifflin-St Jeor formula", "Male and female calculations", "TDEE activity multipliers"],
  };
}

export default function BmrCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Health", path: "/health" },
    { name: "BMR Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}
      <div className="space-y-8">
        <section className="space-y-4 py-2 sm:py-4">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary">Home</Link></li>
              <li>/</li>
              <li><Link href="/health" className="hover:text-primary">Health</Link></li>
              <li>/</li>
              <li className="text-foreground">BMR Calculator</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
              Health Tool
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              BMR Calculator
            </h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
              Calculate your Basal Metabolic Rate - the number of calories your body burns at complete rest - using the Mifflin-St Jeor formula. Use it as the foundation for setting accurate calorie targets.
            </p>
          </div>

          <div className="mt-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-tight text-success">
              Private and browser-native
            </div>
          </div>
        </section>

        <BmrCalculator />

        <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
          <div className="prose prose-slate max-w-none prose-invert">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">What is Basal Metabolic Rate?</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Basal Metabolic Rate (BMR) is the number of calories your body requires to maintain basic physiological functions while at complete rest — breathing, circulation, cell production, protein synthesis, ion transport, and temperature regulation. It represents the minimum energy needed to keep you alive if you did nothing but lie still all day.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              BMR accounts for approximately 60–70% of total daily energy expenditure in sedentary individuals. It is the largest single component of your caloric needs, which is why understanding it is fundamental to any nutrition or weight management strategy.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">The Mifflin-St Jeor formula</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              This calculator uses the Mifflin-St Jeor equation, published in 1990 and validated as the most accurate predictive formula for modern populations. It was developed by MD Mifflin and ST St Jeor using data from 498 subjects and outperforms the older Harris-Benedict equation (1919) by approximately 5% in accuracy.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              <strong>Men:</strong> BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in years) + 5<br />
              <strong>Women:</strong> BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in years) − 161
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The formula accounts for the fact that women have a lower BMR than men of the same weight and height, primarily due to differences in muscle mass and body composition. The −161 constant for women reflects this systematic difference.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">What affects your BMR</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Several factors influence your resting metabolic rate beyond the variables in the formula:
            </p>
            <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
              <li><strong className="text-foreground">Muscle mass:</strong> Muscle tissue burns approximately 13 kcal per kg per day at rest, compared to roughly 4.5 kcal per kg for fat tissue. More muscle means a higher BMR — this is the primary reason resistance training supports long-term weight management.</li>
              <li><strong className="text-foreground">Age:</strong> BMR declines approximately 2–3% per decade after age 20, largely due to progressive muscle loss (sarcopenia). A 60-year-old has roughly 10–15% lower BMR than they did at 20, all else being equal.</li>
              <li><strong className="text-foreground">Thyroid function:</strong> The thyroid gland regulates metabolic rate through hormones T3 and T4. Hypothyroidism (underactive thyroid) can reduce BMR by 30–40%; hyperthyroidism can increase it by a similar amount.</li>
              <li><strong className="text-foreground">Body temperature:</strong> Fever increases BMR by approximately 7% for each degree Celsius rise in body temperature. Cold environments also slightly increase BMR as the body generates heat.</li>
              <li><strong className="text-foreground">Genetics:</strong> Twin studies suggest that 40–70% of variation in BMR between individuals is genetically determined, independent of body composition.</li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">From BMR to TDEE: activity multipliers</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Your BMR is multiplied by an activity factor to estimate your Total Daily Energy Expenditure (TDEE) — the actual number of calories you burn each day:
            </p>
            <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
              <li><strong className="text-foreground">Sedentary (×1.2):</strong> Desk job, little or no exercise.</li>
              <li><strong className="text-foreground">Lightly active (×1.375):</strong> Light exercise 1–3 days per week.</li>
              <li><strong className="text-foreground">Moderately active (×1.55):</strong> Moderate exercise 3–5 days per week.</li>
              <li><strong className="text-foreground">Very active (×1.725):</strong> Hard exercise 6–7 days per week.</li>
              <li><strong className="text-foreground">Extra active (×1.9):</strong> Very hard exercise or physical job, twice-daily training.</li>
            </ul>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Most people overestimate their activity level. If you exercise 3–4 times per week but have a desk job, lightly active (×1.375) is usually more accurate than moderately active.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Metabolic adaptation during dieting</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              One of the most important — and frustrating — aspects of weight loss is metabolic adaptation. When you eat in a caloric deficit, your body responds by lowering BMR beyond what is explained by weight loss alone. This adaptive thermogenesis can reduce BMR by an additional 10–15% below predicted values.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              This is why weight loss slows over time even when maintaining the same caloric deficit. Strategies to minimise metabolic adaptation include: avoiding very large deficits (stay above 500 kcal/day below TDEE), maintaining high protein intake, continuing resistance training, and incorporating diet breaks (periods at maintenance calories) every 8–12 weeks.
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
          </div>
        </section>

        <section className="mt-16 space-y-8 border-t border-slate-100 pt-16">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">More Health Tools</h2>
              <p className="mt-1 text-sm text-slate-500">Other utilities you might find helpful</p>
            </div>
            <Link href="/health" className="secondary-button px-4 py-2 text-xs">View All</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/text/readability-flesch-kincaid-calculator"
              className="group flex flex-col gap-3 rounded-2xl border border-white/40 bg-white/40 p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/20 hover:bg-white/60 hover:shadow-hover"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[11px] font-black text-primary shadow-sm ring-1 ring-black/5">
                READ
              </span>
              <div>
                <h3 className="text-[15px] font-bold text-slate-900 transition-colors group-hover:text-primary">
                  Readability / Flesch-Kincaid Calculator
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                  Score pasted text for reading ease, grade level, and sentence complexity.
                </p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
