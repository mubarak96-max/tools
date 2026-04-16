import Link from "next/link";
import type { Metadata } from "next";
import { VolumeConverter } from "./components/VolumeConverter";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/converter/convert-volume-converter";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How many liters are in a gallon?",
    answer: "There are exactly 3.785411784 liters in one US liquid gallon. However, there are 4.54609 liters in one Imperial gallon (used in the UK)."
  },
  {
    question: "What is the difference between US and Imperial gallons?",
    answer: "Historically, both systems evolved from the British ale and wine gallons. The modern US liquid gallon is legally defined as exactly 231 cubic inches (approx 3.785L). The UK Imperial gallon was defined in 1824 as the volume of 10 pounds of water at 62°F (approx 4.546L). They are significantly different—about a 20% variation!"
  },
  {
    question: "How many milliliters are in a cup?",
    answer: "In the United States, a standard measuring cup holds approximately 236.588 mL (often rounded to 240 mL on nutrition labels). However, a metric cup (used in Australia, New Zealand, Canada) is exactly 250 mL. A UK cup (rarely used now) is half an Imperial pint, or exactly 284.13 mL."
  },
  {
    question: "What is the origin of the fluid ounce?",
    answer: "The fluid ounce derives from the volume occupied by one ounce of water. Because the US and UK use different definitions for gallons and pints, their fluid ounces are slightly different. A US fluid ounce is about 29.57 mL, while an Imperial fluid ounce is about 28.41 mL."
  }
];

export const metadata: Metadata = {
  title: "Volume Converter | Liters, Gallons, Cups, Fl Oz",
  description: "Convert instantly between metric and imperial volume units. Supports liters, milliliters, US & Imperial gallons, cups, and fluid ounces.",
  keywords: ["volume converter", "liters to gallons", "cups to ml", "fluid ounces to ml", "liquid volume calculator", "metric imperial volume"],
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", url: PAGE_URL, title: "Volume Converter — Liters, Gallons, Cups", description: "Universal liquid volume conversion tool for US, UK, and Metric units." },
};

export default function VolumeConverterPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Converter", path: "/converter" },
    { name: "Volume Converter", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">Volume Converter</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary mb-4">
            Measurement Tool
          </p>
          <h1 className="text-5xl font-black tracking-tighter text-foreground sm:text-6xl italic">
            Liquid Volume Converter
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground">
            Switch seamlessly between Metric, US Customary, and British Imperial liquid measurements. Instantly calculate liters, gallons, cups, and fluid ounces for cooking, science, and trade.
          </p>
        </div>

        <div className="mt-8 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <VolumeConverter />

      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 bg-white/40 backdrop-blur-3xl shadow-2vw">
        <div className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-muted-foreground">
          <h2 className="text-4xl text-foreground italic">The Complexity of Liquid Measurement</h2>
          <p>
            Unlike length or weight, volume measurement is uniquely complex because there isn't just a "Metric vs. Imperial" divide. There is a deep, historic split between the **United States Customary System** and the **British Imperial System**. If you try to bake a British cake using American cups, your recipe will almost certainly fail. Understanding these distinct volume systems is critical.
          </p>
          
          <h3 className="text-foreground font-black italic">01. The Metric System (SI Units)</h3>
          <p>
            The metric system for volume is straightforward, logical, and universally adopted across the scientific community and most of the world. It is based directly on the unit of length (the meter). One liter is exactly the volume of a 10cm x 10cm x 10cm cube.
          </p>
          <ul>
            <li><strong>Milliliter (mL):</strong> 1/1,000 of a liter. Equivalent to 1 cubic centimeter (cc). Standard for medicine and precise chemical volumes.</li>
            <li><strong>Liter (L):</strong> The standard base unit. A liter of water weighs exactly one kilogram at maximum density.</li>
            <li><strong>Metric Cup:</strong> Exactly 250 mL. Used in Commonwealth countries (like Australia and Canada) that have transitioned to metric.</li>
          </ul>

          <h3 className="text-foreground font-black italic">02. The US Customary System (Fluid)</h3>
          <p>
            The US system was inherited from British colonists prior to the American Revolution and is based on the historic English "wine gallon." 
          </p>
          <ul>
            <li><strong>US Fluid Ounce (fl oz):</strong> ~29.57 mL. It takes 128 US fluid ounces to make a gallon.</li>
            <li><strong>US Cup:</strong> Exactly 8 US fluid ounces (approx 236.6 mL). The backbone of American recipes.</li>
            <li><strong>US Pint:</strong> 16 US fluid ounces (2 cups).</li>
            <li><strong>US Liquid Gallon:</strong> 128 US fluid ounces or exactly 231 cubic inches (~3.785 L).</li>
          </ul>

          <div className="my-16 p-10 bg-foreground text-background rounded-[3rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <h3 className="text-primary font-black italic !mt-0 uppercase tracking-widest text-sm text-balance">The Great "Pint" Debate</h3>
             <p className="opacity-80 leading-relaxed mb-0">
               If you order a pint in London, you will get much more beer than if you order a pint in New York. A US Pint is 16 fluid ounces (~473 mL). A British Imperial Pint is 20 Imperial fluid ounces (~568 mL) — nearly 20% larger! Always check the origin of a recipe calling for "a pint" of liquid.
             </p>
          </div>

          <h3 className="text-foreground font-black italic">03. The British Imperial System</h3>
          <p>
            In 1824, the UK overhauled its measurement system to standardize trade across the British Empire, abandoning the old wine gallon the US still uses.
          </p>
          <ul>
            <li><strong>Imperial Fluid Ounce:</strong> ~28.41 mL. Slightly smaller than a US fluid ounce. It was defined as the volume occupied by one avoirdupois ounce of water.</li>
            <li><strong>Imperial Pint:</strong> 20 Imperial fluid ounces (~568 mL).</li>
            <li><strong>Imperial Gallon:</strong> 160 Imperial fluid ounces (~4.546 L). A British gallon is massive compared to a US gallon.</li>
          </ul>

          <h3 className="text-foreground font-black italic">04. The Baker's Math: Dry vs. Liquid</h3>
          <p>
            When converting volume, it is crucial to remember that <strong>Fluid Ounces measure VOLUME</strong>, while standard <strong>Ounces measure WEIGHT</strong>. 
            <br/><br/>
            In the US Customary system, "A pint's a pound the world around" only applies to water (1 pint of water = 16 fl oz = approx 16 oz weight). If you are measuring flour in a liquid measuring cup, the conversion matrix entirely breaks down. Professional bakers bypass this by weighing all dry ingredients in grams.
          </p>
        </div>
      </section>

      {/* FAQ Grid */}
      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 relative overflow-hidden bg-muted/5">
        <h2 className="text-4xl font-black tracking-tighter text-foreground text-center italic">Volume Conversion FAQ</h2>
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
