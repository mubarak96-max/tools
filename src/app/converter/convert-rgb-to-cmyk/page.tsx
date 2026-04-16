import Link from "next/link";
import type { Metadata } from "next";
import { RgbToCmykConverter } from "./components/RgbToCmykConverter";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/converter/convert-rgb-to-cmyk";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "RGB to CMYK Converter | Digital to Print Color",
  description: "Accurately convert RGB color values to CMYK. Optimize your digital designs for physical printing and view side-by-side color comparisons.",
  keywords: ["rgb to cmyk", "digital to print color", "color converter", "rgb values", "print color converter", "cmyk color code"],
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", url: PAGE_URL, title: "RGB to CMYK Converter — Digital to Print Color", description: "Convert RGB color values to CMYK for accurate printing." },
};

export default function RgbToCmykPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Converter", path: "/converter" },
    { name: "RGB to CMYK Converter", path: PAGE_PATH },
  ]);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(breadcrumbs)} />

      <section className="space-y-4 py-2 sm:py-4 text-balance">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li className="opacity-50">/</li>
            <li><Link href="/converter" className="hover:text-primary transition-colors">Converter</Link></li>
            <li className="opacity-50">/</li>
            <li className="text-foreground font-medium">RGB to CMYK Converter</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary mb-4">
            Design Tool
          </p>
          <h1 className="text-5xl font-black tracking-tighter text-foreground sm:text-6xl italic">
            RGB to CMYK Converter
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground">
            Translate digital RGB display colors into print-ready CMYK values. Visualize color shifts and prepare your artwork for professional physical printing.
          </p>
        </div>

        <div className="mt-8 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <RgbToCmykConverter />

      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 bg-white/40 backdrop-blur-3xl shadow-2vw">
        <div className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-muted-foreground">
          <h2 className="text-4xl text-foreground italic">RGB to CMYK: Designing for Print</h2>
          <p>
            When preparing digital assets for physical media (like business cards, brochures, or packaging), you must jump across color spaces—from <strong>RGB (Red, Green, Blue)</strong> used by screens, to <strong>CMYK (Cyan, Magenta, Yellow, Key/Black)</strong> used by commercial printers.
          </p>
          
          <h3 className="text-foreground font-black italic">The Gamut Warning</h3>
          <p>
            The RGB color space uses light to create colors, allowing for incredibly vibrant, saturated neons and rich darks. The CMYK color space uses physical ink to absorb light, which inherently produces a much smaller range of visible colors.
          </p>
          <ul>
            <li><strong>Colors that shift heavily:</strong> Bright lime green, deep royal blue, neon pink, and brilliant cyan often look dull or muddy when converted to CMYK.</li>
            <li><strong>Colors that transfer well:</strong> Earth tones, pastels, and muted colors generally convert quite accurately since they are well within the CMYK gamut limit.</li>
          </ul>

          <div className="my-16 p-10 bg-foreground text-background rounded-[3rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <h3 className="text-primary font-black italic !mt-0 uppercase tracking-widest text-sm text-balance">The Total Ink Limit rule</h3>
             <p className="opacity-80 leading-relaxed mb-0">
               When checking your CMYK output, add the four percentages together (C + M + Y + K). Commercial printers usually require a maximum <strong>Total Ink Coverage</strong> of about 300%. If your values add up higher than 300%, the ink will saturate the paper, resulting in smudging, muddy colors, and extended drying times.
             </p>
          </div>
        </div>
      </section>

      <RelatedToolsSection category="Converter" categoryHref="/converter" currentPath={PAGE_PATH} />
    </div>
  );
}
