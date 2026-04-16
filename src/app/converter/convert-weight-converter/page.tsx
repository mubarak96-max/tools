import Link from "next/link";
import type { Metadata } from "next";
import { WeightConverter } from "./components/WeightConverter";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/converter/convert-weight-converter";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How many kilograms are in a pound?",
    answer: "There are exactly 0.45359237 kilograms in one international avoirdupois pound. Conversely, one kilogram is equal to approximately 2.20462 pounds."
  },
  {
    question: "What is the difference between weight and mass?",
    answer: "In strict scientific terms, 'mass' is the amount of matter in an object (measured in kilograms) and does not change based on location. 'Weight' is the force exerted on that mass by gravity (measured in Newtons). On Earth, weight and mass are commonly used interchangeably for everyday purposes."
  },
  {
    question: "How many ounces are in a pound?",
    answer: "There are 16 avoirdupois ounces in one pound. This is the standard measurement for weight in the US. Note: This is different from 'fluid ounces', which measure volume, or 'Troy ounces', which are used for precious metals (where 1 Troy pound = 12 Troy ounces)."
  },
  {
    question: "What is the difference between a metric ton, an Imperial ton, and a US ton?",
    answer: "A US 'Short Ton' is 2,000 pounds. A UK 'Long Ton' (Imperial) is 2,240 pounds. A Metric Ton (Tonne) is 1,000 kilograms, which equals about 2,204.6 pounds. Make sure you know which 'ton' is being referenced in your shipping or materials contract!"
  }
];

export const metadata: Metadata = {
  title: "Weight Converter | Metric & Imperial Mass",
  description: "Convert instantly between grams, kilograms, ounces, pounds, and tons. Precision weight metrics for logistics, baking, and fitness.",
  keywords: ["weight converter", "kg to lbs", "pounds to kilograms", "ounces to grams", "mass calculator", "unit conversion"],
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", url: PAGE_URL, title: "Weight Converter — Metric & Imperial", description: "Universal mass and weight conversion tool." },
};

export default function WeightConverterPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Converter", path: "/converter" },
    { name: "Weight Converter", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd && <JsonLd data={serializeJsonLd(faqJsonLd)} />}

      <section className="space-y-4 py-2 sm:py-4 text-balance">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li className="opacity-50">/</li>
            <li><Link href="/converter" className="hover:text-primary transition-colors">Converter</Link></li>
            <li className="opacity-50">/</li>
            <li className="text-foreground font-medium">Weight Converter</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary mb-4">
            Measurement Tool
          </p>
          <h1 className="text-5xl font-black tracking-tighter text-foreground sm:text-6xl italic">
            Mass & Weight Converter
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground">
            Switch flawlessly between metric (grams, kg) and imperial (ounces, pounds) weight scales. Ideal for international recipes, logistics planning, and fitness tracking.
          </p>
        </div>

        <div className="mt-8 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <WeightConverter />

      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 bg-white/40 backdrop-blur-3xl shadow-2vw">
        <div className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-muted-foreground">
          <h2 className="text-4xl text-foreground italic">The Gravity of Measurement: Understanding Weight Conversion</h2>
          <p>
            Whether you're lifting weights at the gym, baking a European cake in an American kitchen, or calculating the payload capacity of a commercial truck, weight conversions are a daily necessity. Due to the divergence of the metric and US customary systems, learning how to quickly translate these values is essential.
          </p>
          
          <h3 className="text-foreground font-black italic">01. The Metric System (SI Units)</h3>
          <p>
            The metric system for weight (technically mass) is built on an incredibly elegant foundation. Originally, one kilogram was defined as the exact mass of one liter of water. Like all metric measurements, it scales perfectly by factors of 10.
          </p>
          <ul>
            <li><strong>Milligram (mg):</strong> 1/1,000 of a gram. Used primarily for medication dosages and chemical measurements.</li>
            <li><strong>Gram (g):</strong> 1/1,000 of a kilogram. The standard unit for baking, portion control, and light shipping.</li>
            <li><strong>Kilogram (kg):</strong> The base SI unit of mass. Equal to roughly 2.2 pounds.</li>
            <li><strong>Metric Ton (t):</strong> 1,000 kilograms. Used for industrial shipping and heavy machinery.</li>
          </ul>

          <h3 className="text-foreground font-black italic">02. The Imperial / US Customary System</h3>
          <p>
            The imperial weight system relies on the Avoirdupois system, which was established by international wool merchants in the 13th century. Unlike the metric system, its scaling ratios are irregular.
          </p>
          <ul>
            <li><strong>Ounce (oz):</strong> 1/16 of a pound. Commonly used for food portions and postal weight.</li>
            <li><strong>Pound (lb):</strong> The standard US unit. The abbreviation "lb" comes from the Roman word "libra" (balance).</li>
            <li><strong>Stone (st):</strong> 14 pounds. Still widely used in the UK and Ireland to represent human body weight, but almost entirely unused in the US.</li>
            <li><strong>Short Ton (ton):</strong> 2,000 pounds. The standard US ton.</li>
          </ul>

          <div className="my-16 p-10 bg-foreground text-background rounded-[3rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <h3 className="text-primary font-black italic !mt-0 uppercase tracking-widest text-sm text-balance">The Gold Exception: Troy Ounces</h3>
             <p className="opacity-80 leading-relaxed mb-0">
               If you are buying gold, silver, or platinum, the standard 'avoirdupois' system does not apply. Precious metals are weighed in **Troy Ounces**. A Troy Ounce is heavier than a standard ounce (31.1 grams vs 28.35 grams), and a Troy Pound consists of only 12 ounces, not 16. Always verify the weighing system used in jewelry and bullion trading!
             </p>
          </div>

          <h3 className="text-foreground font-black italic">03. The Official Conversion Law</h3>
          <p>
            Just like length measurements, weight measurements between imperial and metric systems are bound by the International Yard and Pound Agreement of 1959. This agreement legally defined the exact conversion rate that forms the math of our calculator:
            <br/><br/>
            <strong>1 International Pound = Exactly 0.45359237 Kilograms</strong>
          </p>

          <h3 className="text-foreground font-black italic">04. Standard Conversion Factors</h3>
          <div className="overflow-x-auto my-10 border border-border rounded-3xl bg-muted/5">
            <table className="w-full text-sm">
              <thead className="bg-muted/20 text-foreground font-black uppercase text-[10px] tracking-widest text-left">
                <tr>
                  <th className="p-6">Imperial Unit</th>
                  <th className="p-6">Metric Equivalent</th>
                  <th className="p-6">Mental Math Trick</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-6 font-bold text-foreground italic">1 Ounce (oz)</td>
                  <td className="p-6">28.3495 grams</td>
                  <td className="p-6">Think of it as slightly less than 30 grams.</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold text-foreground italic">1 Pound (lb)</td>
                  <td className="p-6">0.4536 kg (453.6 g)</td>
                  <td className="p-6">Slightly less than half a kilo.</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold text-foreground italic">Kilogram to lbs</td>
                  <td className="p-6">1 kg = 2.2046 lbs</td>
                  <td className="p-6">Multiply by 2, then add 10% of that result.</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold text-foreground italic">Tons (US to Metric)</td>
                  <td className="p-6">1 Short Ton = 0.907 Metric Tons</td>
                  <td className="p-6">A Metric Ton is roughly 10% heavier than a US Ton.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Grid */}
      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 relative overflow-hidden bg-muted/5">
        <h2 className="text-4xl font-black tracking-tighter text-foreground text-center italic">Weight Conversion FAQ</h2>
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-2 text-balance">
          {faq.map((item) => (
            <article key={item.question} className="p-8 rounded-[2.5rem] border border-border bg-background hover:shadow-2xl transition-all flex flex-col justify-between group">
              <div>
                <h3 className="text-lg font-black text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">{item.question}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-border flex items-center gap-2 text-[10px] font-black uppercase text-primary tracking-widest">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Expert Analysis
              </div>
            </article>
          ))}
        </div>
      </section>

      <RelatedToolsSection category="Converter" categoryHref="/converter" currentPath={PAGE_PATH} />
    </div>
  );
}
