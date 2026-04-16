import Link from "next/link";
import type { Metadata } from "next";
import { SplitImageTool } from "./components/SplitImageTool";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/image/split-images-online";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Split Images Online | Divide Image into Grid & Tiles",
  description: "Split images into equal grid sections online. Divide images for Instagram grids, 3x3 tiles, or custom rows and columns. High-quality image splitting with instant download.",
  keywords: ["split image online", "image splitter", "grid photo maker", "divide image into tiles", "instagram grid splitter", "cut image into pieces"],
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", url: PAGE_URL, title: "Split Images Online — Grid Maker", description: "Divide any image into a custom grid of tiles instantly." },
};

export default function SplitImagesPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Image", path: "/image" },
    { name: "Split Images Online", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">Split Images Online</li>
          </ol>
        </nav>
        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary mb-4">Image Tool</p>
          <h1 className="text-5xl font-black tracking-tighter text-foreground sm:text-6xl italic">Split Images Online</h1>
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground">Divide your images into a perfect grid of tiles. Perfect for Instagram grids, puzzle photos, or creating sectional wall art. Precise, fast, and completely in your browser.</p>
        </div>
        <div className="mt-8 max-w-2xl"><PrivacyNote /></div>
      </section>

      <SplitImageTool />

      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 bg-white/40 backdrop-blur-3xl shadow-2vw">
        <div className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-muted-foreground">
          <h2 className="text-4xl text-foreground italic">Why Split Your Images?</h2>
          <p>Image splitting is a powerful technique for social media marketing, web design, and digital art. By breaking a large, high-resolution image into a grid of smaller tiles, you can create immersive visual experiences that encourage engagement.</p>
          
          <h3 className="text-foreground font-black italic">01. The Instagram Grid Effect</h3>
          <p>One of the most popular uses for an image splitter is the Instagram "Giant Square" grid. By splitting a single panoramic or high-contrast photo into a 3x3 or 3x1 grid, you can create a striking mosaic on your profile page that captures attention as users scroll through your feed.</p>
          
          <h3 className="text-foreground font-black italic">02. Progressive Loading & User Experience</h3>
          <p>In web development, splitting a very large image into tiles can sometimes improve perceived performance. By loading tiles individually, the user starts seeing parts of the image immediately rather than waiting for one monolithic file to download. This is the same logic used by digital maps (Google Maps) to provide seamless zooming and panning.</p>
          
          <h3 className="text-foreground font-black italic">03. Print and Large-Scale Decor</h3>
          <p>If you want to print a large photo but only have access to standard-sized paper (like A4 or Letter), our tool allows you to split that image into tiles that you can print individually and assemble into a large-scale poster or mural.</p>

          <div className="my-16 p-10 bg-foreground text-background rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <h3 className="text-primary font-black italic !mt-0 uppercase tracking-widest text-sm">Pro Tip: Aspect Ratios</h3>
            <p className="opacity-80 leading-relaxed mb-0">For the best results on social media, ensure your original image matches the final aspect ratio of your grid. For a 3x3 grid, a square (1:1) original is best. For a 3x2 grid, a 3:2 landscape original will provide the most natural-looking split without distorting your subjects.</p>
          </div>
        </div>
      </section>

      <RelatedToolsSection category="Image" categoryHref="/image" currentPath={PAGE_PATH} />
    </div>
  );
}
