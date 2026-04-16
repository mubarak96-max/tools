import Link from "next/link";
import type { Metadata } from "next";
import { TrimTransparentPixels } from "./components/TrimTransparentPixels";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/image/trim-transparent-pixels";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Trim Transparent Pixels & Auto-Crop Images Online",
  description: "Instantly remove excess transparent pixels from images. Auto-crop your PNGs to their natural boundaries. Free online image cropping tool with transparent background support.",
  keywords: ["trim transparent pixels", "auto crop image online", "trim png image", "remove blank space from image", "crop transparent background"],
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", url: PAGE_URL, title: "Trim Transparent Pixels — Image Auto-Crop", description: "Instantly strip excess transparent space from PNG files." },
};

export default function TrimTransparentPixelsPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Image", path: "/image" },
    { name: "Trim Transparent Pixels", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">Trim Transparent Pixels</li>
          </ol>
        </nav>
        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary mb-4">Image Optimization Tool</p>
          <h1 className="text-5xl font-black tracking-tighter text-foreground sm:text-6xl italic">Trim Transparent Pixels</h1>
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground">Remove unwanted transparent areas surrounding your images. Auto-crop logos and icons down to their exact visual boundaries in one click.</p>
        </div>
        <div className="mt-8 max-w-2xl"><PrivacyNote /></div>
      </section>

      <TrimTransparentPixels />

      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 bg-white/40 backdrop-blur-3xl shadow-2vw">
        <div className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-muted-foreground">
          <h2 className="text-4xl text-foreground italic">Why Trim Your Images?</h2>
          <p>When artists export graphics—like logos, vector illustrations, or UI icons—from design software, they typically include large amounts of empty, transparent padding to fit artboards. Trimming removes this waste.</p>
          
          <h3 className="text-foreground font-black italic">01. Better CSS Layout Control</h3>
          <p>In web development, excessive transparent padding acts as a rogue boundary that ruins flexbox and grid layouts. Trimming forces the image's bounding box to directly snap to the visible pixels, giving precise margin and padding control through CSS rather than relying on invisible image data.</p>
          
          <h3 className="text-foreground font-black italic">02. Perfectly Centered UI Elements</h3>
          <p>Applying transforms (like CSS <code className="bg-muted px-1 py-0.5 rounded">transform: rotate()</code> or <code className="bg-muted px-1 py-0.5 rounded">scale()</code>) behaves unpredictably if the graphic's visual weight is extremely off-center due to asymmetrical transparent padding. Trimming resets the geometric origin to align perfectly with the visual origin.</p>
          
          <h3 className="text-foreground font-black italic">03. Reduced File Size</h3>
          <p>While transparent black (<code className="bg-muted px-1 py-0.5 rounded">rgba(0,0,0,0)</code>) compresses very efficiently in PNG formats via Run-Length Encoding, it still takes up bytes. Stripping out thousands of empty pixels across countless assets results in smaller overarching UI bundles.</p>

          <div className="my-16 p-10 bg-foreground text-background rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <h3 className="text-primary font-black italic !mt-0 uppercase tracking-widest text-sm">How it Works</h3>
            <p className="opacity-80 leading-relaxed mb-0">Our tool loops through your image's raw pixel data via HTML5 canvas, scanning from all four edges inward to locate the first occurrence of an opaque pixel. Once it locates the bounds left, right, top, and bottom, it slices out exactly that rectangular coordinate space.</p>
          </div>
        </div>
      </section>

      <RelatedToolsSection category="Image" categoryHref="/image" currentPath={PAGE_PATH} />
    </div>
  );
}
