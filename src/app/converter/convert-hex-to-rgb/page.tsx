import Link from "next/link";
import type { Metadata } from "next";
import { HexToRgbConverter } from "./components/HexToRgbConverter";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

export const revalidate = 43200;

const PAGE_PATH = "/converter/convert-hex-to-rgb";

export const metadata: Metadata = {
  title: "Hex to RGB Converter | Instantly Convert Color Codes",
  description: "Convert Hex color codes to RGB values instantly. See dynamic color previews, HSL equivalents, and copy CSS color codes on the fly.",
  keywords: ["hex to rgb", "color converter", "rgb values", "hex color code", "css color converter", "hsl converter"],
  openGraph: { title: "Hex to RGB Converter", description: "Convert Hex color codes to RGB values instantly." },
};

export default function HexToRgbPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-4 py-2 sm:py-4 text-balance">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li className="opacity-50">/</li>
            <li><Link href="/converter" className="hover:text-primary transition-colors">Converter</Link></li>
            <li className="opacity-50">/</li>
            <li className="text-foreground font-medium">Hex to RGB Converter</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary mb-4">
            Developer Tool
          </p>
          <h1 className="text-5xl font-black tracking-tighter text-foreground sm:text-6xl italic">
            Hex to RGB Converter
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground">
            Translate hexadecimal web color codes into standard RGB and HSL formats. Build perfectly matched palettes for your CSS stylesheets.
          </p>
        </div>

        <div className="mt-8 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <HexToRgbConverter />

      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 bg-white/40 backdrop-blur-3xl shadow-2vw">
        <div className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-muted-foreground">
          <h2 className="text-4xl text-foreground italic">Understanding Hex and RGB</h2>
          <p>
            Whether you are styling a website using CSS or designing assets in software like Photoshop, you continually interact with color spaces. The two most prominent web color formats are Hexadecimal (Hex) and RGB (Red, Green, Blue). 
          </p>
          
          <h3 className="text-foreground font-black italic">What is a Hex Code?</h3>
          <p>
            A Hex color code is a six-digit combination of numbers and letters defined by its mix of red, green, and blue (RGB). Basically, a Hex code is shorthand for its RGB values. It starts with a pound sign (<code className="bg-muted px-1 py-0.5 rounded text-sm">#</code>), followed by three pairs: the first representing Red, the second Green, and the third Blue.
          </p>

          <h3 className="text-foreground font-black italic">How the Math Works</h3>
          <p>
            Hex uses a base-16 numerical system. This means it counts from 0 to 9, and then uses letters A through F (where A=10 and F=15). 
          </p>
          <ul>
            <li><code className="bg-muted px-1 py-0.5 rounded text-sm">#000000</code> is pure black (0 red, 0 green, 0 blue).</li>
            <li><code className="bg-muted px-1 py-0.5 rounded text-sm">#FFFFFF</code> is pure white (full red, full green, full blue, which equates to 255 in RGB).</li>
            <li>A color like <code className="bg-muted px-1 py-0.5 rounded text-sm">#FF5733</code> breaks down to: Red = FF (255), Green = 57 (87), Blue = 33 (51).</li>
          </ul>

          <div className="my-16 p-10 bg-foreground text-background rounded-[3rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <h3 className="text-primary font-black italic !mt-0 uppercase tracking-widest text-sm text-balance">Why Use RGB over Hex?</h3>
             <p className="opacity-80 leading-relaxed mb-0">
               While Hex codes are extremely compact and easy to copy-paste, RGB provides one crucial advantage in modern CSS: <strong>Opacity</strong>. By using <code className="bg-white/20 px-1 py-0.5 rounded text-sm">rgba(red, green, blue, alpha)</code>, developers can easily tint backgrounds, create shadow effects, and overlay semi-transparent layers without jumping to complex visual editors.
             </p>
          </div>
        </div>
      </section>

      <RelatedToolsSection category="Converter" categoryHref="/converter" currentPath={PAGE_PATH} />
    </div>
  );
}
