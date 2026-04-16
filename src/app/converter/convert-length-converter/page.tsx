import Link from "next/link";
import type { Metadata } from "next";
import { LengthConverter } from "./components/LengthConverter";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/converter/convert-length-converter";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How many meters are in a mile?",
    answer: "There are exactly 1,609.344 meters in one international mile. This is a crucial conversion factor for athletics and modern transportation systems."
  },
  {
    question: "What is the difference between metric and imperial systems?",
    answer: "The Metric system (SI) is a decimal-based system created in France in 1799, where units are scaled by factors of 10 (millimeters, centimeters, meters, kilometers). The Imperial system, standardized by the British Empire in 1824, uses historical ad-hoc relationships (12 inches in a foot, 3 feet in a yard, 1760 yards in a mile)."
  },
  {
    question: "Why does the US still use imperial units?",
    answer: "The United States uses the 'US Customary System', which is very similar to the Imperial system. The US never fully mandated the metric system due to the massive cost of re-tooling industrial manufacturing during the 19th and 20th centuries. However, science, medicine, and military in the US operate almost entirely on the metric system."
  },
  {
    question: "Is a nautical mile the same as a regular mile?",
    answer: "No. A land mile (statute mile) is 5,280 feet. A nautical mile is based on the circumference of the Earth, representing one minute of latitude. It equals exactly 1.852 kilometers or roughly 6,076 feet."
  }
];

export const metadata: Metadata = {
  title: "Length Converter | Metric & Imperial Dimensions",
  description: "Convert instantly between millimeters, meters, kilometers, inches, feet, yards, and miles. View complete conversion chains and precision factors.",
  keywords: ["length converter", "metric to imperial", "meters to miles", "inches to cm", "distance calculator", "unit conversion"],
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", url: PAGE_URL, title: "Length Converter — Metric & Imperial", description: "Universal length and distance conversion tool." },
};

export default function LengthConverterPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Converter", path: "/converter" },
    { name: "Length Converter", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">Length Converter</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary mb-4">
            Measurement Tool
          </p>
          <h1 className="text-5xl font-black tracking-tighter text-foreground sm:text-6xl italic">
            Length & Distance Converter
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground">
            Translate dimensions across the world's measuring systems. Convert instantly between metric (mm to km) and imperial scales (inches to miles) with multi-unit synchronized outputs.
          </p>
        </div>

        <div className="mt-8 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <LengthConverter />

      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 bg-white/40 backdrop-blur-3xl shadow-2vw">
        <div className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-muted-foreground">
          <h2 className="text-4xl text-foreground italic">Bridging the Gap: Metric vs. Imperial Lengths</h2>
          <p>
            The world effectively operates on two separate systems of measurement. Understanding how to seamlessly convert length and distance between them is critical for engineering, global trade, construction, and travel. 
          </p>
          
          <h3 className="text-foreground font-black italic">01. The Metric System (SI Units)</h3>
          <p>
            The International System of Units (SI) is utilized by 95% of the global population. Its beauty lies in its base-10 structure, making scale conversions a simple matter of shifting a decimal point. The base unit of length is the <strong>meter (m)</strong>.
          </p>
          <ul>
            <li><strong>Millimeter (mm):</strong> 1/1,000 of a meter. Used for high-precision engineering and rainfall measurement.</li>
            <li><strong>Centimeter (cm):</strong> 1/100 of a meter. Common for everyday object measurements and human height.</li>
            <li><strong>Meter (m):</strong> The standard unit. Roughly equivalent to 3.28 feet.</li>
            <li><strong>Kilometer (km):</strong> 1,000 meters. The global standard for geographical distance.</li>
          </ul>

          <h3 className="text-foreground font-black italic">02. The Imperial / US Customary System</h3>
          <p>
            Rooted in historical Roman and British traditions, the imperial system uses body parts and ad-hoc historical references as base units. It lacks a uniform scaling factor, requiring the memorization of distinct relationships.
          </p>
          <ul>
            <li><strong>Inch (in):</strong> Historically the width of a human thumb. Exactly defined today as 25.4 millimeters.</li>
            <li><strong>Foot (ft):</strong> 12 inches. Historically the length of an adult male foot.</li>
            <li><strong>Yard (yd):</strong> 3 feet or 36 inches. Often used in textiles and American football.</li>
            <li><strong>Mile (mi):</strong> 5,280 feet. Originally 'mille passus' (1,000 paces) of a Roman legion.</li>
          </ul>

          <div className="my-16 p-10 bg-foreground text-background rounded-[3rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <h3 className="text-primary font-black italic !mt-0 uppercase tracking-widest text-sm text-balance">The $125 Million Conversion Error</h3>
             <p className="opacity-80 leading-relaxed mb-0">
               In 1999, NASA lost the Mars Climate Orbiter due to a units mix-up. One engineering team used metric units (Newton-seconds) for thrust calculations, while another team used imperial units (pound-seconds) to write the software. The spacecraft burned up in the Martian atmosphere—a stark reminder of the critical importance of conversion tools.
             </p>
          </div>

          <h3 className="text-foreground font-black italic">03. The Critical Anchor: 25.4mm</h3>
          <p>
            How do these two vastly different systems mathematically connect? In 1959, the United States, United Kingdom, and other Commonwealth nations agreed to the "International Yard and Pound Agreement." 
            <br/><br/>
            This treaty legally redefined the imperial inch to be <strong>exactly 25.4 millimeters</strong>. Every other imperial conversion (feet to meters, miles to kilometers) is biologically derived from this single fixed ratio. 
          </p>

          <h3 className="text-foreground font-black italic">04. Standard Conversion Factors</h3>
          <div className="overflow-x-auto my-10 border border-border rounded-3xl bg-muted/5">
            <table className="w-full text-sm">
              <thead className="bg-muted/20 text-foreground font-black uppercase text-[10px] tracking-widest text-left">
                <tr>
                  <th className="p-6">Imperial Unit</th>
                  <th className="p-6">Metric Equivalent</th>
                  <th className="p-6">Common Use Case</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-6 font-bold text-foreground italic">1 Inch</td>
                  <td className="p-6">25.4 mm / 2.54 cm</td>
                  <td className="p-6">Screen sizes, pipe diameters</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold text-foreground italic">1 Foot</td>
                  <td className="p-6">0.3048 m</td>
                  <td className="p-6">Aviation altitude, building heights</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold text-foreground italic">1 Yard</td>
                  <td className="p-6">0.9144 m</td>
                  <td className="p-6">Textiles, sports fields</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold text-foreground italic">1 Mile</td>
                  <td className="p-6">1.60934 km</td>
                  <td className="p-6">Highway speed limits (US/UK)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Grid */}
      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 relative overflow-hidden bg-muted/5">
        <h2 className="text-4xl font-black tracking-tighter text-foreground text-center italic">Measurement FAQ</h2>
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
