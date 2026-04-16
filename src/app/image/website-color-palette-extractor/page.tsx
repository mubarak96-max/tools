import Link from "next/link";
import type { Metadata } from "next";
import { WebsiteColorPaletteExtractor } from "./components/WebsiteColorPaletteExtractor";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/image/website-color-palette-extractor";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Website Color Palette Extractor | Find Colors Used on Any URL",
  description: "Extract the exact Hex, RGB, and HSL color palette from any website URL. Analyze design systems and see the percentage breakdown of brand colors.",
  keywords: ["website color extractor", "find colors from url", "extract css colors", "website color palette", "design inspector", "steal colors from website"],
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", url: PAGE_URL, title: "Website Color Palette Extractor", description: "Extract the exact Hex and RGB color palette from any website URL." },
};

export default function WebsiteColorPaletteExtractorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Image", path: "/image" },
    { name: "Website Color Palette Extractor", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">Website Color Palette Extractor</li>
          </ol>
        </nav>
        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary mb-4">Design Tool</p>
          <h1 className="text-5xl font-black tracking-tighter text-foreground sm:text-6xl italic">Website Palette Extractor</h1>
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground">Enter any URL to extract the primary color palette used in its design. Get Hex, RGB, and HSL values instantly, complete with usage percentages to understand the brand's true color distribution.</p>
        </div>
        <div className="mt-8 max-w-2xl"><PrivacyNote /></div>
      </section>

      <WebsiteColorPaletteExtractor />

      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 bg-white/40 backdrop-blur-3xl shadow-2vw">
        <div className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-muted-foreground">
          <h2 className="text-4xl text-foreground italic">Stealing Like an Artist</h2>
          <p>Analyzing the color palettes of successful websites is one of the fastest ways to improve your own design sense. A great palette relies on more than just the colors themselves; the <strong>distribution</strong> of those colors is what makes a design feel harmonious.</p>
          
          <h3 className="text-foreground font-black italic">01. The 60-30-10 Rule</h3>
          <p>Many professional websites follow the timeless 60-30-10 design rule. 60% of the palette should be a dominant background color (usually white, light gray, or dark charcoal), 30% should be a secondary color (often used for typography and UI cards), and 10% should be an accent color (reserved exclusively for primary buttons, links, and alerts).</p>
          
          <h3 className="text-foreground font-black italic">02. Extracting the DNA</h3>
          <p>By extracting colors directly from the source HTML and CSS, you can uncover exactly which specific hex codes a brand uses for their specific "vibe". You will often find they do not use pure black (<code className="bg-muted px-1 py-0.5 rounded">#000000</code>) for text, but rather a tinted dark gray that is softer on the eyes.</p>
          
          <h3 className="text-foreground font-black italic">03. Generating CSS Variables</h3>
          <p>Modern web development relies heavily on CSS variables (or custom properties). Using an extractor allows you to easily grab an entire palette and immediately define it in your <code className="bg-muted px-1 py-0.5 rounded">:root</code> block, creating a foundational design system in seconds.</p>

          <div className="my-16 p-10 bg-foreground text-background rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <h3 className="text-primary font-black italic !mt-0 uppercase tracking-widest text-sm">How The Extractor Works</h3>
            <p className="opacity-80 leading-relaxed mb-0">Our tool crawls the provided URL and parses the raw HTML and inline stylesheets, using regular expressions to capture standard Hex codes and <code className="bg-white/20 px-1 py-0.5 rounded">rgb()</code> / <code className="bg-white/20 px-1 py-0.5 rounded">rgba()</code> values. It groups duplicate colors and maps their frequency to reconstruct the site's prevailing palette.</p>
          </div>
        </div>
      </section>

      <RelatedToolsSection category="Image" categoryHref="/image" currentPath={PAGE_PATH} />
    </div>
  );
}
