import Link from "next/link";
import type { Metadata } from "next";
import { SpeedConverter } from "./components/SpeedConverter";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/converter/convert-speed-converter";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How do you convert mph to km/h?",
    answer: "To convert miles per hour (mph) to kilometers per hour (km/h), multiply the mph value by 1.60934. For a quick mental approximation, simply multiply the mph by 1.6."
  },
  {
    question: "Why do ships and aircraft use knots?",
    answer: "Knots are tied directly to global geography. One knot equals one nautical mile per hour. A nautical mile is exactly one minute of latitude on the Earth's surface. This allows sailors and pilots to navigate using the coordinate grid of a map rather than arbitrary land measurements."
  },
  {
    question: "What is the speed of light in different units?",
    answer: "In a vacuum, the speed of light (c) is exactly 299,792,458 meters per second. This translates to roughly 1,079,252,848 km/h, or 670,616,629 miles per hour."
  },
  {
    question: "What is Mach 1?",
    answer: "Mach 1 is the speed of sound in a given medium. In dry air at sea level (at 20°C / 68°F), Mach 1 is approximately 343 meters per second, 1,235 km/h, or 767 mph. Because the speed of sound changes with temperature and air density, Mach is a ratio, not a fixed absolute speed."
  }
];

export const metadata: Metadata = {
  title: "Speed Converter | km/h, mph, knots, Mach",
  description: "Convert speed and velocity units instantly. Translate between mph, km/h, meters per second, knots, and Mach numbers for driving, aviation, and science.",
  keywords: ["speed converter", "kmh to mph", "mph to knots", "mach speed calculator", "velocity converter", "meters per second"],
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", url: PAGE_URL, title: "Speed Converter — km/h, mph, knots", description: "Universal velocity conversion tool for automotive, aviation, and physics." },
};

export default function SpeedConverterPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Converter", path: "/converter" },
    { name: "Speed Converter", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">Speed Converter</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary mb-4">
            Kinematics Tool
          </p>
          <h1 className="text-5xl font-black tracking-tighter text-foreground sm:text-6xl italic">
            Speed & Velocity Converter
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground">
            Translate velocity perfectly across automotive, aviation, marine, and scientific standards. Convert between km/h, mph, knots, and meters per second instantly.
          </p>
        </div>

        <div className="mt-8 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <SpeedConverter />

      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 bg-white/40 backdrop-blur-3xl shadow-2vw">
        <div className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-muted-foreground">
          <h2 className="text-4xl text-foreground italic">Understanding Velocity: From Highways to Hypersonic</h2>
          <p>
            Speed is simply the rate at which an object covers distance over time. However, the units we use to describe it vary wildly depending on the application—whether we are monitoring the wind, driving a car, sailing a ship, or launching a rocket.
          </p>
          
          <h3 className="text-foreground font-black italic">01. Terrestrial Speed: Automotive & Rail</h3>
          <p>
            The vast majority of the world's population measures daily speed relative to land travel, primarily in motor vehicles.
          </p>
          <ul>
            <li><strong>Kilometers per hour (km/h):</strong> The global standard for speed limits and automotive speedometers. Used by almost all nations except the US and UK.</li>
            <li><strong>Miles per hour (mph):</strong> The standard in the United States, United Kingdom, and a few Caribbean nations. Remember: 100 km/h is exactly 62.137 mph—a common highway speed.</li>
          </ul>

          <h3 className="text-foreground font-black italic">02. Marine & Aviation: The Knot</h3>
          <p>
            When navigating vast oceans or the sky, miles and kilometers lose their geometric context. Enter the <strong>Knot (kn or kt)</strong>.
          </p>
          <ul>
            <li>One knot is exactly one nautical mile per hour.</li>
            <li>A nautical mile is tied exactly to the Earth's coordinate system—it represents one minute (1/60th of a degree) of latitude along a meridian.</li>
            <li>This means a ship traveling at 15 knots due South will cross exactly 15 minutes of latitude in one hour. This mathematical elegance is why aviation and marine operations universally rely on knots.</li>
            <li>One knot equals 1.15 mph or 1.852 km/h.</li>
          </ul>

          <div className="my-16 p-10 bg-foreground text-background rounded-[3rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <h3 className="text-primary font-black italic !mt-0 uppercase tracking-widest text-sm text-balance">Why is it called a "Knot"?</h3>
             <p className="opacity-80 leading-relaxed mb-0">
               In the 17th century, sailors measured ship speed using a "chip log." They tied a heavy piece of wood (the chip) to a rope with knots tied at specific intervals. The wood was thrown overboard, and a sailor manually counted how many knots passed through their hands as a 28-second hourglass ran out.
             </p>
          </div>

          <h3 className="text-foreground font-black italic">03. Science & Physics: Meters per Second</h3>
          <p>
            In physics, engineering, and meteorology, speed is fundamentally measured in <strong>Meters per Second (m/s)</strong>. It is the base SI unit of velocity.
          </p>
          <ul>
            <li>When calculating kinetic energy (E = ½mv²), velocity *must* be in m/s to yield Joules.</li>
            <li>Hurricane and tornado wind speeds in scientific literature are often recorded in m/s before being translated to mph or km/h for public broadcast.</li>
          </ul>

          <h3 className="text-foreground font-black italic">04. Hypersonic & Aerodynamics: The Mach Number</h3>
          <p>
             <strong>Mach</strong> is not a fixed speed unit. It is a dimensionless ratio comparing an object's speed to the local speed of sound.
          </p>
          <ul>
            <li><strong>Mach 1 (Transonic):</strong> The speed of sound. At sea level and 68°F, this is ~767 mph.</li>
            <li>Because cold air is denser than warm air, the speed of sound drops at high altitudes. A jet flying at 35,000 feet will hit Mach 1 at only ~660 mph.</li>
            <li>Our calculator provides a generic Mach conversion assuming sea-level dry air at 20°C (343 m/s).</li>
          </ul>
        </div>
      </section>

      {/* FAQ Grid */}
      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 relative overflow-hidden bg-muted/5">
        <h2 className="text-4xl font-black tracking-tighter text-foreground text-center italic">Speed Conversion FAQ</h2>
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
