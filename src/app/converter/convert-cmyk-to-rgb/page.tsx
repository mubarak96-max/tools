import Link from "next/link";
import type { Metadata } from "next";
import { CmykToRgbConverter } from "./components/CmykToRgbConverter";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/converter/convert-cmyk-to-rgb";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "Why do colors look different in print vs. digital?",
    answer: "Digital screens emit light and use the RGB (Red, Green, Blue) color model. This is an additive model where adding all colors creates white. Print relies on ink absorbing light, using the CMYK (Cyan, Magenta, Yellow, Key/Black) color model. This is a subtractive model where adding all colors creates black. Because they create colors differently, some vibrant RGB colors simply cannot be printed."
  },
  {
    question: "What's the difference between CMYK and RGB?",
    answer: "RGB is an 'additive' color space used for digital displays (adding full red, green, and blue light creates white). CMYK is a 'subtractive' color space used in color printing (adding cyan, magenta, and yellow ink theoretically creates black, but practically requires a Key/Black cartridge to make true black). RGB has a much wider color gamut than CMYK."
  },
  {
    question: "Can I perfectly convert CMYK to RGB?",
    answer: "Converting CMYK to RGB is generally accurate because the RGB color space is larger and contains almost all CMYK colors. However, converting from RGB to CMYK often results in duller colors because CMYK cannot reproduce the highly saturated, bright colors seen on screens."
  },
  {
    question: "What does the 'K' in CMYK stand for?",
    answer: "The 'K' stands for 'Key'. In traditional printing, cyan, magenta, and yellow plates are carefully aligned or 'keyed' with the key of the black key plate. Using a dedicated black ink saves the other colored inks and produces much deeper blacks."
  }
];

export const metadata: Metadata = {
  title: "CMYK to RGB Converter | Print to Digital Color",
  description: "Convert CMYK color values to RGB and Hex codes instantly. Bridge the gap between print and digital color spaces with accurate color matching.",
  keywords: ["cmyk to rgb", "print to digital color", "color converter", "cmyk to hex", "rgb color code", "color space conversion"],
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", url: PAGE_URL, title: "CMYK to RGB Converter — Print to Digital Color", description: "Universal CMYK to RGB color format converter." },
};

export default function CmykToRgbPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Converter", path: "/converter" },
    { name: "CMYK to RGB Converter", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">CMYK to RGB Converter</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary mb-4">
            Design Tool
          </p>
          <h1 className="text-5xl font-black tracking-tighter text-foreground sm:text-6xl italic">
            CMYK to RGB Converter
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground">
            Translate print-ready CMYK values into digital RGB and Hex codes. Overcome the color gap between paper and screens instantly.
          </p>
        </div>

        <div className="mt-8 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <CmykToRgbConverter />

      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 bg-white/40 backdrop-blur-3xl shadow-2vw">
        <div className="prose prose-slate prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-muted-foreground">
          <h2 className="text-4xl text-foreground italic">CMYK to RGB: Moving from Ink to Pixels</h2>
          <p>
            If you've ever designed a flyer on your computer and printed it out, only to find the colors look dull, you've experienced the limitations of color profiles. The transition between the <strong>CMYK (Cyan, Magenta, Yellow, Key/Black)</strong> profile of physical printers and the <strong>RGB (Red, Green, Blue)</strong> profile of digital screens requires careful calculation.
          </p>
          
          <h3 className="text-foreground font-black italic">01. The Subtractive World of CMYK</h3>
          <p>
            The CMYK color model is used in color printing. It is called a "subtractive" process because inks subtract (or absorb) brightness from white paper. 
          </p>
          <ul>
            <li><strong>Cyan (C):</strong> Absorbs red light, reflects green and blue.</li>
            <li><strong>Magenta (M):</strong> Absorbs green light, reflects blue and red.</li>
            <li><strong>Yellow (Y):</strong> Absorbs blue light, reflects red and green.</li>
            <li><strong>Key (K):</strong> Black ink used to add depth and shadow, saving the other colored inks from being wasted trying to mix a muddy black.</li>
          </ul>

          <h3 className="text-foreground font-black italic">02. The Additive World of RGB</h3>
          <p>
            Every screen you look at—from your phone to your television—uses the RGB color model. This is an "additive" process. The screen begins completely dark, and light is added to create color. 
          </p>
          <ul>
            <li>Mixing 100% Red, 100% Green, and 100% Blue light creates pure white light.</li>
            <li>Because it utilizes direct light, the RGB gamut (the range of colors it can display) is vastly wider and brighter than CMYK.</li>
          </ul>

          <div className="my-16 p-10 bg-foreground text-background rounded-[3rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <h3 className="text-primary font-black italic !mt-0 uppercase tracking-widest text-sm text-balance">The Conversion Danger Zone</h3>
             <p className="opacity-80 leading-relaxed mb-0">
               Converting **from CMYK to RGB** is easy. Because the RGB gamut is much larger, it has no problem accurately displaying CMYK colors. However, converting **from RGB to CMYK** is dangerous. Highly saturated neon greens, bright royal blues, and vivid reds simply cannot be printed with standard CMYK inks. They will "shift" to duller, muddy colors in print. Always design print materials in CMYK from the start!
             </p>
          </div>

          <h3 className="text-foreground font-black italic">03. The Math Behind the Conversion</h3>
          <p>
            When converting CMYK percentages to RGB values (which operate on a 0-255 scale), the formula calculates how much of each RGB light channel remains after the CMYK inks have "absorbed" their respective colors.
          </p>
          <ul>
            <li><strong>Red</strong> = 255 × (1 - Cyan/100) × (1 - Black/100)</li>
            <li><strong>Green</strong> = 255 × (1 - Magenta/100) × (1 - Black/100)</li>
            <li><strong>Blue</strong> = 255 × (1 - Yellow/100) × (1 - Black/100)</li>
          </ul>
        </div>
      </section>

      {/* FAQ Grid */}
      <section className="glass-card rounded-[3rem] border border-border/80 p-8 sm:p-16 relative overflow-hidden bg-muted/5">
        <h2 className="text-4xl font-black tracking-tighter text-foreground text-center italic">Color Conversion FAQ</h2>
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
