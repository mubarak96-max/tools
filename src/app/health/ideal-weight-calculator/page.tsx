import type { Metadata } from "next";
import { IdealWeightCalculator } from "./components/IdealWeightCalculator";
import { HealthToolPage } from "@/app/health/components/HealthToolPage";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/health/ideal-weight-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "Which ideal weight formula is most accurate?",
    answer:
      "No single formula is universally most accurate — each was developed for a specific clinical context. The Devine formula is the most widely used in medicine for drug dosing. The Robinson formula is considered a slight refinement of Devine. For general wellness purposes, using the range across all four formulas gives a more realistic picture than relying on any one number.",
  },
  {
    question: "How is ideal weight different from BMI?",
    answer:
      "BMI (Body Mass Index) is a ratio of weight to height squared and gives a single number that places you in a category (underweight, normal, overweight, obese). Ideal weight formulas instead calculate a target weight range based on height and sex. BMI doesn't account for muscle mass, bone density, or body composition, while ideal weight formulas at least acknowledge that frame size and sex affect what a healthy weight looks like.",
  },
  {
    question: "Does frame size affect my ideal weight?",
    answer:
      "Yes. People with larger bone structures naturally weigh more at the same height. A rough way to estimate frame size is to wrap your thumb and middle finger around your wrist: if they overlap, you likely have a small frame; if they just touch, medium; if they don't meet, large. Some clinicians adjust ideal weight estimates by ±10% for small or large frames respectively.",
  },
  {
    question: "Should I try to reach my calculated ideal weight?",
    answer:
      "Not necessarily. These formulas were designed for clinical reference, not personal weight-loss targets. A weight that is healthy for you depends on your muscle mass, age, fitness level, and medical history. Many athletes and muscular individuals fall above the ideal weight range without any health risk. Always discuss weight goals with a healthcare provider.",
  },
  {
    question: "Why do the four formulas give different results?",
    answer:
      "Each formula was derived from a different study population and era. Devine (1974) was originally created to estimate drug dosing in men. Robinson (1983) and Miller (1983) were developed as refinements using different datasets. Hamwi (1964) uses a simple rule-of-thumb approach. Because they were calibrated differently, they produce slightly different outputs — which is why looking at the range rather than a single number is more informative.",
  },
];

export const metadata: Metadata = {
  title: "Ideal Weight Calculator | Devine, Robinson, Miller & Hamwi Formulas",
  description:
    "Calculate your ideal body weight using four clinical formulas — Devine, Robinson, Miller, and Hamwi. See the full range and understand what each formula means for your health.",
  keywords: [
    "ideal weight calculator",
    "ideal body weight formula",
    "Devine formula calculator",
    "Robinson formula ideal weight",
    "Hamwi formula",
    "Miller formula ideal weight",
    "healthy weight calculator",
    "IBW calculator",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Ideal Weight Calculator | Devine, Robinson, Miller & Hamwi Formulas",
    description:
      "Calculate your ideal body weight using four clinical formulas and see the full healthy weight range for your height and sex.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ideal Weight Calculator | Devine, Robinson, Miller & Hamwi Formulas",
    description:
      "See your ideal weight range using the four most widely used clinical formulas: Devine, Robinson, Miller, and Hamwi.",
  },
};

function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Ideal Weight Calculator",
    url: PAGE_URL,
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Free ideal body weight calculator using Devine, Robinson, Miller, and Hamwi formulas.",
    featureList: [
      "Four clinical formula comparison",
      "Ideal weight range output",
      "Supports metric and imperial units",
      "Frame size guidance",
    ],
  };
}

export default function IdealWeightCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Health", path: "/health" },
    { name: "Ideal Weight Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}
      <HealthToolPage
        title="Ideal Weight Calculator"
        description="Enter your height and sex to calculate your ideal body weight using the four most widely referenced clinical formulas: Devine, Robinson, Miller, and Hamwi."
        category="Health"
        path={PAGE_PATH}
        infoSection={
          <>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">The four ideal weight formulas explained</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Ideal body weight (IBW) formulas were developed primarily for clinical use — specifically to help clinicians calculate appropriate drug doses, ventilator settings, and nutritional requirements without being skewed by excess body fat. The four most commonly cited formulas are Devine, Robinson, Miller, and Hamwi, each developed independently between the 1960s and 1980s.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The <strong>Devine formula</strong> (1974) is the oldest and most widely used in clinical practice. For men, it starts at 50 kg for 5 feet of height and adds 2.3 kg per inch above that. For women, it starts at 45.5 kg and adds the same 2.3 kg per inch. Despite its age, it remains the default in many pharmacokinetic calculations and ICU protocols.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The <strong>Robinson formula</strong> (1983) was developed as a refinement of Devine using a broader dataset. It starts at 52 kg for men (5 feet) and adds 1.9 kg per inch, and 49 kg for women adding 1.7 kg per inch. Robinson tends to produce slightly lower estimates than Devine for taller individuals, reflecting the observation that the linear relationship between height and ideal weight flattens somewhat at greater heights.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The <strong>Miller formula</strong> (1983) is the most conservative of the four, producing the lowest ideal weight estimates. It uses 56.2 kg as the base for men and 53.1 kg for women, adding 1.41 kg per inch above 5 feet. Miller's formula is sometimes preferred when a more conservative estimate is needed, such as in obese patients where using a higher IBW might lead to overdosing.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The <strong>Hamwi formula</strong> (1964) is the oldest and uses a simple rule-of-thumb approach. Men start at 106 lbs for 5 feet and add 6 lbs per inch; women start at 100 lbs and add 5 lbs per inch. It's the easiest to calculate mentally and is still taught in many clinical nutrition programs, though it tends to produce higher estimates than the other three formulas for taller individuals.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Clinical use vs. personal health goals</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              It's important to understand that these formulas were never designed as personal weight-loss targets. They were created to solve a specific clinical problem: how do you estimate a patient's lean body mass when you can't directly measure it? In that context, a single reference number is useful. For personal health, however, a range is far more meaningful.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Because the four formulas produce different results, looking at the spread between the lowest and highest estimate gives you a practical healthy weight range. For a 5'8" man, for example, the formulas produce estimates ranging from roughly 63 kg (Miller) to 72 kg (Hamwi) — a 9 kg spread. Somewhere within that range is likely appropriate for most people of that height, but where exactly depends on individual factors like muscle mass, age, and fitness level.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Athletes and people with significant muscle mass will often fall above all four formula estimates without any health concern. Conversely, someone who is sedentary might be within the ideal weight range but still have an unhealthy body composition due to low muscle mass and high body fat. This is why IBW formulas are best used as a rough reference point, not a definitive target.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Frame size and its effect on ideal weight</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Bone structure varies significantly between individuals of the same height. A person with a large skeletal frame will naturally weigh more than someone with a small frame at the same height, even if both have identical body fat percentages. The standard IBW formulas don't account for this directly, but a common clinical adjustment is to add or subtract 10% from the calculated IBW for large or small frames respectively.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Frame size can be estimated using wrist circumference relative to height, or by the simple thumb-and-finger test: wrap your dominant hand's thumb and middle finger around the opposite wrist. If they overlap, you likely have a small frame. If they just touch, medium. If there's a gap, large. While imprecise, this gives a useful directional adjustment to apply to your IBW estimate.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Some clinicians also use elbow breadth (measured with a caliper) as a more objective frame size indicator. The Metropolitan Life Insurance tables, which were influential in early ideal weight research, included separate weight ranges for small, medium, and large frames — an acknowledgment that a single number is insufficient.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Ideal weight vs. BMI: which is more useful?</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              BMI and ideal weight formulas are both imperfect proxies for healthy body composition, but they have different strengths. BMI is useful at the population level for identifying trends in overweight and obesity, and it's easy to calculate. However, it famously misclassifies muscular individuals as overweight and can miss unhealthy body fat levels in people with low muscle mass (a condition sometimes called "normal weight obesity").
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Ideal weight formulas have the advantage of producing an absolute weight target rather than a category, which some people find more actionable. They also implicitly account for sex differences in body composition by using different base values for men and women. However, they share BMI's blind spot around muscle mass and don't account for age-related changes in body composition.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              For the most complete picture, consider using IBW formulas alongside BMI, waist circumference, and if available, a body fat percentage measurement. No single metric tells the whole story, but together they provide a much clearer view of where you stand and what, if anything, needs to change.
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
        <IdealWeightCalculator />
      </HealthToolPage>
    </>
  );
}
