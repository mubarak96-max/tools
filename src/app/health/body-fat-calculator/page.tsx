import type { Metadata } from "next";
import { BodyFatCalculator } from "./components/BodyFatCalculator";
import { HealthToolPage } from "@/app/health/components/HealthToolPage";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/health/body-fat-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is the US Navy body fat method?",
    answer:
      "The US Navy method estimates body fat percentage using circumference measurements — neck, waist, and hips (for women) — along with height. It uses a logarithmic formula developed by Hodgdon and Beckett in 1984 and is widely used because it requires only a tape measure rather than expensive equipment.",
  },
  {
    question: "What is a healthy body fat percentage?",
    answer:
      "For men, essential fat is 2–5%, athletes are typically 6–13%, fitness range is 14–17%, acceptable is 18–24%, and obese is 25%+. For women, essential fat is 10–13%, athletes are 14–20%, fitness range is 21–24%, acceptable is 25–31%, and obese is 32%+. Women naturally carry more essential fat due to hormonal and reproductive functions.",
  },
  {
    question: "How accurate is the circumference method?",
    answer:
      "The US Navy method has a margin of error of approximately 3–4 percentage points compared to DEXA scans. It is less accurate than hydrostatic weighing or DEXA but far more practical for everyday use. Consistency in measurement technique matters more than absolute accuracy for tracking changes over time.",
  },
  {
    question: "How do I measure correctly for this calculator?",
    answer:
      "Measure your neck at the narrowest point, just below the larynx. Measure your waist at the narrowest point (usually just above the navel for men, at the navel for women). Women should also measure hips at the widest point. Keep the tape parallel to the floor and snug but not compressing the skin.",
  },
  {
    question: "Can I reduce body fat in a specific area?",
    answer:
      "Spot reduction — losing fat from a specific area through targeted exercise — is a myth. Fat loss occurs systemically throughout the body based on genetics and overall caloric deficit. However, resistance training can build muscle in specific areas, which changes body composition and appearance even without spot fat loss.",
  },
];

export const metadata: Metadata = {
  title: "Body Fat Percentage Calculator | US Navy Circumference Method",
  description:
    "Estimate your body fat percentage using the US Navy circumference method. Enter your neck, waist, and hip measurements for an instant result.",
  keywords: [
    "body fat calculator",
    "body fat percentage calculator",
    "US Navy body fat method",
    "circumference body fat",
    "body fat estimator",
    "body composition calculator",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Body Fat Percentage Calculator — US Navy Method",
    description: "Estimate body fat percentage using neck, waist, and hip measurements. Fast, free, and accurate.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Body Fat Percentage Calculator",
    description: "Use the US Navy circumference method to estimate your body fat percentage instantly.",
  },
};

function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Body Fat Percentage Calculator",
    url: PAGE_URL,
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free body fat percentage estimator using the US Navy circumference method.",
    featureList: ["US Navy formula", "Male and female calculations", "Body fat category classification"],
  };
}

export default function BodyFatCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Health", path: "/health" },
    { name: "Body Fat Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}
      <HealthToolPage
        title="Body Fat Percentage Calculator"
        description="Estimate your body fat percentage using the US Navy circumference method — just a tape measure required, no expensive equipment needed."
        category="Health"
        path={PAGE_PATH}
        infoSection={
          <>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">How the US Navy body fat formula works</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The US Navy method was developed by Hodgdon and Beckett in 1984 as a practical field test for military fitness assessments. It uses circumference measurements and height to estimate body density, then converts that to a body fat percentage. The formula differs slightly for men and women to account for natural differences in fat distribution.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              For men: <code>%BF = 86.010 × log10(waist − neck) − 70.041 × log10(height) + 36.76</code>
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              For women: <code>%BF = 163.205 × log10(waist + hip − neck) − 97.684 × log10(height) − 78.387</code>
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              All measurements are in centimetres. The logarithmic nature of the formula means that small measurement errors have a proportionally larger effect at lower body fat percentages, so measurement technique is especially important for lean individuals.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Body fat percentage categories</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Body fat percentage is categorised differently for men and women because women require more essential fat for hormonal and reproductive health. The American Council on Exercise (ACE) defines the following ranges:
            </p>
            <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
              <li><strong className="text-foreground">Essential fat (men 2–5%, women 10–13%):</strong> The minimum fat required for basic physiological function. Going below this is dangerous.</li>
              <li><strong className="text-foreground">Athletes (men 6–13%, women 14–20%):</strong> Typical of competitive athletes who train intensively and follow strict nutrition protocols.</li>
              <li><strong className="text-foreground">Fitness (men 14–17%, women 21–24%):</strong> Lean and healthy, with visible muscle definition. Achievable with consistent training and good nutrition.</li>
              <li><strong className="text-foreground">Acceptable (men 18–24%, women 25–31%):</strong> Within a healthy range but with less muscle definition. Most healthy adults fall here.</li>
              <li><strong className="text-foreground">Obese (men 25%+, women 32%+):</strong> Associated with increased risk of metabolic disease, cardiovascular disease, and joint problems.</li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Body fat vs BMI — which is more useful?</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              BMI (Body Mass Index) is calculated from height and weight alone and cannot distinguish between muscle and fat. A muscular athlete may have a high BMI but very low body fat, while a sedentary person with normal BMI may carry excess fat. Body fat percentage is a more direct measure of body composition and a better predictor of metabolic health.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              That said, body fat percentage measurements also have limitations. The circumference method is less precise than DEXA (dual-energy X-ray absorptiometry) or hydrostatic weighing. For most people, the circumference method is accurate enough to track trends over time, which is more useful than a single precise measurement.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How to reduce body fat effectively</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Sustainable body fat reduction requires a combination of a moderate caloric deficit, adequate protein intake, and resistance training. Crash diets that severely restrict calories cause muscle loss alongside fat loss, which lowers your metabolic rate and makes it harder to maintain results.
            </p>
            <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
              <li><strong className="text-foreground">Caloric deficit:</strong> A deficit of 300–500 calories per day produces steady fat loss of roughly 0.3–0.5 kg per week without excessive muscle loss.</li>
              <li><strong className="text-foreground">Protein intake:</strong> Aim for 1.6–2.2 g of protein per kg of body weight to preserve muscle during a deficit.</li>
              <li><strong className="text-foreground">Resistance training:</strong> Lifting weights preserves and builds muscle, which keeps your metabolic rate higher and improves body composition even without large weight changes.</li>
              <li><strong className="text-foreground">Cardio:</strong> Aerobic exercise increases caloric expenditure and improves cardiovascular health, but is less effective than diet for fat loss.</li>
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
        <BodyFatCalculator />
      </HealthToolPage>
    </>
  );
}
