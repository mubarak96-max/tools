import Link from "next/link";
import type { Metadata } from "next";
import { RandomColorGenerator } from "./components/RandomColorGenerator";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/image/random-color-generator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Random Color Generator | Hex, RGB & HSL Color Codes",
  description: "Generate beautiful random colors instantly. Get Hex, RGB, HSL, and CMYK color codes with one click. Lock favorite colors, generate palettes, and copy CSS values.",
  keywords: ["random color generator", "color palette generator", "hex color generator", "rgb color generator", "random hex color", "color picker"],
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", url: PAGE_URL, title: "Random Color Generator — Palette Tool", description: "Generate random colors and palettes with Hex, RGB, HSL values." },
};

export default function RandomColorGeneratorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Image", path: "/image" },
    { name: "Random Color Generator", path: PAGE_PATH },
  ]);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(breadcrumbs)} />

      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li className="opacity-50">/</li>
            <li><Link href="/image" className="hover:text-primary transition-colors">Image</Link></li>
            <li className="opacity-50">/</li>
            <li className="text-foreground font-medium">Random Color Generator</li>
          </ol>
        </nav>
        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary mb-4">Design Tool</p>
          <h1 className="text-5xl font-black tracking-tighter text-foreground sm:text-6xl italic">Random Color Generator</h1>
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground">Generate beautiful random colors with a single click. Get instant Hex, RGB, HSL, and CMYK values — lock your favorites and build entire palettes.</p>
        </div>
        <div className="mt-8 max-w-2xl"><PrivacyNote /></div>
      </section>

      <RandomColorGenerator />

      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 bg-white/40 backdrop-blur-3xl shadow-2vw">
        <div className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-muted-foreground">
          <h2 className="text-4xl text-foreground italic">Color Theory for Designers</h2>
          <p>A random color generator does more than pick a random value — it is a creative spark for building harmonious palettes. Understanding how color formats relate to each other makes you a more effective designer and developer.</p>
          <h3 className="text-foreground font-black italic">01. Hex — The Web Developer Standard</h3>
          <p>Hex color codes (e.g., <code className="bg-muted px-1 py-0.5 rounded">#3B82F6</code>) are the dominant format in web CSS. The six-digit code encodes Red, Green, and Blue as two-digit hexadecimal pairs (base-16), ranging from 00 to FF (0 to 255 in decimal). They are compact, universally recognized, and easy to copy-paste between tools.</p>
          <h3 className="text-foreground font-black italic">02. RGB — The Programmer's Palette</h3>
          <p>The RGB model defines color using three channels: Red, Green, and Blue, each ranging from 0 to 255. It is the native model of all computer monitors. The huge advantage of <code className="bg-muted px-1 py-0.5 rounded">rgba()</code> in CSS is the ability to add alpha transparency, making it the go-to format for overlay effects, shadows, and backgrounds.</p>
          <h3 className="text-foreground font-black italic">03. HSL — The Designer's Intuition</h3>
          <p>HSL (Hue, Saturation, Lightness) is widely regarded as the most human-readable color format. Hue is the actual color angle on the color wheel (0–360°), Saturation is the intensity (0%–100%), and Lightness is how dark or light the color is. Adjusting lightness to create tints and shades of a color is trivially simple in HSL — far more intuitive than modifying RGB channels manually.</p>
          <div className="my-16 p-10 bg-foreground text-background rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <h3 className="text-primary font-black italic !mt-0 uppercase tracking-widest text-sm">The Lock Feature Explained</h3>
            <p className="opacity-80 leading-relaxed mb-0">The lock feature on a color palette generator lets you pin colors you love while regenerating the remaining slots. This is how professional designers build harmonious multi-color palettes: fix one anchor color that matches a brand, then generate companions until a natural-feeling palette emerges. It turns a random guess into a deliberate creative process.</p>
          </div>
        </div>
      </section>

      <RelatedToolsSection category="Image" categoryHref="/image" currentPath={PAGE_PATH} />
    </div>
  );
}
