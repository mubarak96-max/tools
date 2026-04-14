import type { Metadata } from "next";
import { WaistToHipCalculator } from "./components/WaistToHipCalculator";
import { HealthToolPage } from "@/app/health/components/HealthToolPage";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/health/waist-to-hip-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is a healthy waist-to-hip ratio?",
    answer:
      "The WHO defines healthy WHR as below 0.90 for men and below 0.85 for women. Ratios above these thresholds are associated with substantially increased risk of cardiovascular disease, type 2 diabetes, and metabolic syndrome.",
  },
  {
    question: "Why is waist-to-hip ratio a better health indicator than BMI?",
    answer:
      "BMI cannot distinguish between fat and muscle, or between fat stored in different locations. WHR specifically measures abdominal fat distribution, which is more metabolically harmful than fat stored in the hips and thighs. Two people with identical BMI can have very different health risks based on where they carry fat.",
  },
  {
    question: "What is the difference between apple and pear body shapes?",
    answer:
      "Apple-shaped bodies carry more fat around the abdomen (high WHR), while pear-shaped bodies carry more fat around the hips and thighs (low WHR). Abdominal (visceral) fat is metabolically active and releases inflammatory compounds, making apple-shaped fat distribution more harmful to health.",
  },
  {
    question: "How do I measure my waist and hips correctly?",
    answer:
      "Measure your waist at the narrowest point, usually just above the navel, after exhaling normally. Measure your hips at the widest point around the buttocks. Keep the tape parallel to the floor and snug but not compressing the skin. Take measurements in the morning before eating for consistency.",
  },
  {
    question: "Can I change my waist-to-hip ratio?",
    answer:
      "Yes. Aerobic exercise and a caloric deficit reduce visceral abdominal fat, which lowers your waist measurement and improves WHR. Resistance training builds muscle in the hips and glutes, which can increase hip measurement and further improve the ratio. Spot reduction of abdominal fat is not possible, but overall fat loss preferentially reduces visceral fat.",
  },
];

export const metadata: Metadata = {
  title: "Waist-to-Hip Ratio Calculator | Assess Your Health Risk",
  description:
    "Calculate your waist-to-hip ratio (WHR) and assess your cardiovascular and metabolic health risk. Based on WHO guidelines for men and women.",
  keywords: [
    "waist to hip ratio calculator",
    "WHR calculator",
    "waist hip ratio health risk",
    "abdominal obesity calculator",
    "body shape health calculator",
    "visceral fat calculator",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Waist-to-Hip Ratio Calculator",
    description: "Calculate your WHR and see your cardiovascular health risk category based on WHO guidelines.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Waist-to-Hip Ratio Calculator",
    description: "Assess your health risk from abdominal fat distribution using your waist and hip measurements.",
  },
};

function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Waist-to-Hip Ratio Calculator",
    url: PAGE_URL,
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free waist-to-hip ratio calculator with WHO health risk categories.",
    featureList: ["WHR calculation", "WHO risk categories", "Male and female thresholds"],
  };
}

export default function WaistToHipCalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Health", path: "/health" },
    { name: "Waist-to-Hip Ratio Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <>
      <JsonLd data={serializeJsonLd(buildJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}
      <HealthToolPage
        title="Waist-to-Hip Ratio Calculator"
        description="Calculate your waist-to-hip ratio and assess your cardiovascular and metabolic health risk based on World Health Organization guidelines."
        category="Health"
        path={PAGE_PATH}
        infoSection={
          <>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Why fat distribution matters more than total fat</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Not all body fat is equally harmful. Fat stored subcutaneously (just under the skin) in the hips, thighs, and buttocks is relatively inert metabolically. Visceral fat — stored deep in the abdomen around internal organs — is metabolically active and releases inflammatory cytokines, free fatty acids, and hormones that disrupt insulin signalling and increase cardiovascular risk.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The waist-to-hip ratio is a simple proxy for visceral fat distribution. A high ratio indicates more abdominal fat relative to hip fat, which correlates strongly with increased risk of type 2 diabetes, heart disease, stroke, and certain cancers — independent of total body weight or BMI.
            </p>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">WHO risk categories</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The World Health Organization defines the following risk categories:
            </p>
            <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
              <li><strong className="text-foreground">Low risk — Men below 0.90, Women below 0.80:</strong> Fat distribution is predominantly peripheral (hips and thighs). Metabolic risk is low.</li>
              <li><strong className="text-foreground">Moderate risk — Men 0.90–0.99, Women 0.80–0.84:</strong> Some abdominal fat accumulation. Lifestyle modifications are advisable.</li>
              <li><strong className="text-foreground">High risk — Men 1.00+, Women 0.85+:</strong> Significant abdominal obesity. Substantially elevated risk of metabolic and cardiovascular disease.</li>
            </ul>

            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Waist-to-hip ratio vs waist circumference alone</h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Some health organisations prefer waist circumference alone as a simpler measure of abdominal obesity. The NHS recommends action when waist circumference exceeds 94 cm (37 inches) for men and 80 cm (31.5 inches) for women. The advantage of WHR is that it accounts for body frame size — a taller person naturally has a larger waist, but their hip measurement also scales accordingly.
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Both measures are useful. Waist circumference is simpler; WHR provides context by comparing waist to hip size. Using both together gives the most complete picture of abdominal fat distribution.
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
        <WaistToHipCalculator />
      </HealthToolPage>
    </>
  );
}
