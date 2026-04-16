import Link from "next/link";
import type { Metadata } from "next";
import { TemperatureConverter } from "./components/TemperatureConverter";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/converter/convert-temperature-converter";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is absolute zero in each scale?",
    answer: "Absolute zero is the theoretical lowest temperature possible. In Kelvin, it is 0K. In Celsius, it is -273.15°C. In Fahrenheit, it is -459.67°F. At this temperature, molecular motion reaches its minimum."
  },
  {
    question: "Why is Kelvin used in science?",
    answer: "Kelvin is an absolute scale, meaning 0K represents the total absence of thermal energy. This makes it essential for physical laws and thermodynamic calculations (like the Ideal Gas Law), as it avoids negative numbers that would break mathematical proportionalities."
  },
  {
    question: "What is the freezing point of water in each scale?",
    answer: "Pure water at standard sea-level pressure freezes at 0°C, 32°F, and 273.15K. Conversely, it boils at 100°C, 212°F, and 373.15K."
  },
  {
    question: "How do I convert Celsius to Fahrenheit quickly?",
    answer: "A quick mental approximation: Double the Celsius temperature and add 30. (e.g., 20°C × 2 = 40 + 30 = 70°F). The exact formula is (C × 1.8) + 32, which would be 68°F."
  }
];

export const metadata: Metadata = {
  title: "Temperature Converter | Celsius, Fahrenheit, Kelvin",
  description: "Convert between Celsius, Fahrenheit, and Kelvin instantly. Real-time temperature conversion with formulas, reference points, and absolute zero warnings.",
  keywords: ["temperature converter", "celsius to fahrenheit", "fahrenheit to celsius", "kelvin converter", "thermodynamic scale", "absolute zero", "temperature conversion formula"],
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", url: PAGE_URL, title: "Temperature Converter — Celsius, Fahrenheit, Kelvin", description: "Universal temperature conversion tool with real-time updates." },
};

export default function TemperatureConverterPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Converter", path: "/converter" },
    { name: "Temperature Converter", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">Temperature Converter</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary mb-4">
            Thermodynamics Tool
          </p>
          <h1 className="text-5xl font-black tracking-tighter text-foreground sm:text-6xl italic">
            Temperature Converter
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground">
            Switch between the world's most common temperature scales instantly. Our tool provides precision mapping between Celsius, Fahrenheit, and Kelvin, complete with thermodynamic formulas.
          </p>
        </div>

        <div className="mt-8 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <TemperatureConverter />

      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 bg-white/40 backdrop-blur-3xl shadow-2vw">
        <div className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-muted-foreground">
          <h2 className="text-4xl text-foreground italic">Understanding Temperature Scales: A Science-First Approach</h2>
          <p>
            Temperature is a measure of the average kinetic energy of the particles in a substance. While it feels simple—hot or cold—the way we quantify it depends on historical context and intended use. Whether you are baking a cake, checking the weather, or conducting a laboratory experiment, knowing the difference between the three primary scales is vital.
          </p>
          
          <h3 className="text-foreground font-black italic">01. Celsius (°C): The Global Standard</h3>
          <p>
            The Celsius scale, also known as the centigrade scale, is part of the International System of Units (SI). It was originally defined by the freezing point (0°C) and boiling point (100°C) of water at sea level. Today, it is used by almost every country in the world for daily applications, from weather reports to thermostat settings.
          </p>

          <h3 className="text-foreground font-black italic">02. Fahrenheit (°F): The US Legacy</h3>
          <p>
            Invented by Daniel Gabriel Fahrenheit in 1724, this scale is primarily used in the United States, its territories, and a few Caribbean nations. On this scale, water freezes at 32°F and boils at 212°F. While scientists find the 180-degree interval between freezing and boiling cumbersome, many Americans prefer it for weather because it provides a more granular human-centric range (0°F is very cold, 100°F is very hot).
          </p>

          <div className="my-16 p-10 bg-foreground text-background rounded-[3rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <h3 className="text-primary font-black italic !mt-0 uppercase tracking-widest text-sm text-balance">The Mystery of -40 Degrees</h3>
             <p className="opacity-80 leading-relaxed mb-0">
               Did you know that **-40 degrees** is the unique point where the Celsius and Fahrenheit scales cross? If the thermometer reads -40, it is exactly the same temperature regardless of which scale you are using. This is a common "trick" question in physics and engineering.
             </p>
          </div>

          <h3 className="text-foreground font-black italic">03. Kelvin (K): The Absolute Scale</h3>
          <p>
            Unlike Celsius and Fahrenheit, Kelvin is an <strong>Absolute Scale</strong>. It does not use the "degree" symbol (°) because it begins at Absolute Zero (0 K), the point at which all thermal motion stops. In the world of science, particularly physics and astronomy, Kelvin is the preferred scale because it directly correlates temperature with energy. 
            <br/><br/>
            Conversion is straightforward: Simply add 273.15 to the Celsius measurement to reach Kelvin.
          </p>

          <h3 className="text-foreground font-black italic">04. Mathematical Formulas for Conversion</h3>
          <div className="overflow-x-auto my-10 border border-border rounded-3xl bg-muted/5">
            <table className="w-full text-sm">
              <thead className="bg-muted/20 text-foreground font-black uppercase text-[10px] tracking-widest text-left">
                <tr>
                  <th className="p-6">Desired Output</th>
                  <th className="p-6">Input Source</th>
                  <th className="p-6">Formula</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-6 font-bold text-foreground italic">Fahrenheit</td>
                  <td className="p-6">Celsius</td>
                  <td className="p-6 font-mono">(°C × 9/5) + 32</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold text-foreground italic">Celsius</td>
                  <td className="p-6">Fahrenheit</td>
                  <td className="p-6 font-mono">(°F − 32) × 5/9</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold text-foreground italic">Kelvin</td>
                  <td className="p-6">Celsius</td>
                  <td className="p-6 font-mono">°C + 273.15</td>
                </tr>
                <tr>
                  <td className="p-6 font-bold text-foreground italic">Celsius</td>
                  <td className="p-6">Kelvin</td>
                  <td className="p-6 font-mono">K − 273.15</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-foreground font-black italic text-balance">05. Famous Temperature Landmarks</h3>
          <ul>
            <li><strong>Surface of the Sun:</strong> ~5,500°C / ~9,900°F</li>
            <li><strong>Average Human Body:</strong> 37°C / 98.6°F</li>
            <li><strong>Liquid Nitrogen:</strong> -196°C / -321°F</li>
            <li><strong>Highest Recorded Earth Temp:</strong> 56.7°C (Death Valley, 1913)</li>
          </ul>
        </div>
      </section>

      {/* FAQ Grid */}
      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 relative overflow-hidden bg-muted/5">
        <h2 className="text-4xl font-black tracking-tighter text-foreground text-center italic">Temperature Insights FAQ</h2>
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3 text-balance">
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
