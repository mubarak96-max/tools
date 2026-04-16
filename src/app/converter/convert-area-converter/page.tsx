import Link from "next/link";
import type { Metadata } from "next";
import { AreaConverter } from "./components/AreaConverter";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/converter/convert-area-converter";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "How many square feet are in an acre?",
    answer: "There are exactly 43,560 square feet in one acre. Historically, an acre was defined as the amount of land a yoke of oxen could plow in one day. A modern American football field (including the end zones) is about 1.32 acres."
  },
  {
    question: "What is a hectare in comparison to an acre?",
    answer: "A hectare is a metric unit of area exactly equal to 10,000 square meters (or a square 100 meters on each side). One hectare is equivalent to approximately 2.47 acres. Hectares are the global standard for measuring large land plots outside the US."
  },
  {
    question: "How do you calculate area?",
    answer: "For a simple rectangle or square, you calculate area by multiplying the length by its width (Length × Width = Area). If a room is 10 feet long and 12 feet wide, its area is 120 square feet."
  },
  {
    question: "Why does squaring a number drastically change the conversion rate?",
    answer: "Because you are squaring the linear conversion rate. For example, there are 3 feet in a yard. However, in a square yard (which is 3 feet long AND 3 feet wide), there are 9 square feet (3 × 3). Therefore, to convert square feet to square yards, you divide by 9, not 3."
  }
];

export const metadata: Metadata = {
  title: "Area Converter | Sq Meters, Acres, Hectares & Sq Ft",
  description: "Convert land and surface area instantly. Translate between acres, hectares, square meters, square feet, and square miles for real estate and construction.",
  keywords: ["area converter", "acres to square feet", "hectares to acres", "square meters calculator", "land area conversion", "square miles to acres"],
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", url: PAGE_URL, title: "Area Converter — Meters, Acres, Hectares", description: "Universal area and land conversion tool for real estate and agriculture." },
};

export default function AreaConverterPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Converter", path: "/converter" },
    { name: "Area Converter", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">Area Converter</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary mb-4">
            Geometry Tool
          </p>
          <h1 className="text-5xl font-black tracking-tighter text-foreground sm:text-6xl italic">
            Surface Area Converter
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground">
            Calculate precise surface areas for real estate, agriculture, and construction. Seamlessly convert between square meters, hectares, acres, and square feet.
          </p>
        </div>

        <div className="mt-8 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <AreaConverter />

      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 bg-white/40 backdrop-blur-3xl shadow-2vw">
        <div className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-muted-foreground">
          <h2 className="text-4xl text-foreground italic">Understanding Area: Dimensions Squared</h2>
          <p>
            Unlike linear measurement (which measures distance in one direction), area measures the two-dimensional surface space within a boundary. Area is expressed in "square" units. A common stumbling block is realizing that conversion factors for area are the <em>square of the linear conversion factors</em>. 
          </p>
          
          <h3 className="text-foreground font-black italic">01. The Metric System (SI) and Land</h3>
          <p>
            The metric system applies its standard base-10 logic to area, making scaling up from a sheet of paper to a national forest incredibly simple.
          </p>
          <ul>
            <li><strong>Square Meter (m²):</strong> The SI derived unit of area. To envision a square meter, imagine a massive floor tile that is exactly one meter wide and one meter long.</li>
            <li><strong>Hectare (ha):</strong> From the Greek word "hekaton" (meaning 100). A hectare is exactly 10,000 square meters (a square measuring 100m x 100m). It is the global standard for measuring land, estates, and farms.</li>
            <li><strong>Square Kilometer (km²):</strong> Primarily used to measure the geographic area of cities, states, and countries. One square kilometer contains 100 hectares.</li>
          </ul>

          <h3 className="text-foreground font-black italic">02. The Imperial & US Customary Systems</h3>
          <p>
            The US and UK measure land based on ancient traditions of farming and surveying, resulting in highly irregular conversion factors.
          </p>
          <ul>
            <li><strong>Square Foot (sq ft):</strong> The standard unit for real estate, flooring, and interior architecture in the United States.</li>
            <li><strong>Square Yard (sq yd):</strong> Exactly 9 square feet. Commonly used in the US and UK for selling carpet and certain textiles.</li>
            <li><strong>Acre (ac):</strong> An acre is exactly 43,560 square feet. It was historically defined as the amount of land that could be plowed by a team of oxen in one day. </li>
            <li><strong>Square Mile (sq mi):</strong> Exactly 640 acres. Used for tracking county borders, large ranches, and vast geographical regions.</li>
          </ul>

          <div className="my-16 p-10 bg-foreground text-background rounded-[3rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <h3 className="text-primary font-black italic !mt-0 uppercase tracking-widest text-sm text-balance">The Trap of "Squaring" Linear Units</h3>
             <p className="opacity-80 leading-relaxed mb-0">
               If 1 meter equals exactly 100 centimeters, how many square centimeters are in a square meter? A common mistake is answering 100. However, because you are dealing with two dimensions (length x width), you must square the linear number. Therefore, 1 square meter = 100 cm × 100 cm = **10,000 square centimeters**.
             </p>
          </div>

          <h3 className="text-foreground font-black italic">03. Real Estate: The US vs Global Standard</h3>
          <p>
            If you are looking at housing markets internationally, understanding the conversion between <strong>Square Feet</strong> and <strong>Square Meters</strong> is crucial. 
            <br/><br/>
            One square meter equals approximately <strong>10.764 square feet</strong>. If a European apartment is listed at 100 m², it is roughly 1,076 sq ft—a comfortable two-bedroom apartment in the United States.
          </p>

          <h3 className="text-foreground font-black italic">04. Agriculture: Acres vs Hectares</h3>
          <p>
             The agricultural industry frequently bridges the gap between US producers and global markets. The essential conversion to memorize is:
             <br/><br/>
             <strong>1 Hectare = 2.471 Acres</strong>
             <br/><br/>
             Therefore, a 1,000-acre farm in the American Midwest equates to approximately 404 hectares on the international market.
          </p>
        </div>
      </section>

      {/* FAQ Grid */}
      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 relative overflow-hidden bg-muted/5">
        <h2 className="text-4xl font-black tracking-tighter text-foreground text-center italic">Area & Geometry FAQ</h2>
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
