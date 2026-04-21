import Link from "next/link";

import AIBackgroundRemover from "./components/AIBackgroundRemover";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 43200;

const PAGE_PATH = "/image/ai-background-remover";

export const metadata = buildMetadata({
  title: "AI Background Remover | Free Online AI Background Remover",
  description: "Remove the background from any photo instantly using local WebAssembly AI.",
  path: PAGE_PATH,
});

const faqs = [
  {
    question: "Does the background remover upload my images?",
    answer:
      "No. The tool runs the background-removal workflow in the browser and keeps the image local to your device.",
  },
  {
    question: "Which image formats work best?",
    answer:
      "PNG, JPG, and WEBP files work best. Clear subject edges and good contrast usually produce cleaner cutouts.",
  },
  {
    question: "Can I export with a transparent background?",
    answer:
      "Yes. Use PNG when you need transparency, or choose JPG when you want a flattened white or colored background.",
  },
];

const relatedTools = [
  {
    name: "Convert Image to Base64",
    href: "/image/convert-image-to-base64",
    description: "Convert an image into Base64 text or a full data URL.",
    icon: "B64",
  },
  {
    name: "Image to Text OCR",
    href: "/text/convert-image-to-text",
    description: "Extract editable text from JPG, PNG, WEBP, and BMP images.",
    icon: "OCR",
  },
];

export default function AIBackgroundRemoverPage() {
  return (
    <div className="space-y-8 sm:space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "AI Background Remover",
            description: "Remove image backgrounds in the browser with local AI processing.",
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Any",
            url: `https://findbest.tools${PAGE_PATH}`,
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />

      <section className="relative overflow-hidden pt-8 sm:pt-12">
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/image" className="primary-chip rounded-full px-3 py-1 shadow-sm drop-shadow-sm">
              Image
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-tight text-success">
              Private and browser-native
            </div>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            AI Background Remover
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
            Remove the background from photos, preview the cutout, choose transparency or a flat color, and export the result without sending the image to a server.
          </p>

          <nav aria-label="Breadcrumb" className="mt-8">
            <ol className="flex flex-wrap items-center gap-2 text-[13px] font-medium text-slate-400">
              <li><Link href="/" className="hover:text-primary">Home</Link></li>
              <li>/</li>
              <li><Link href="/image" className="hover:text-primary">Image</Link></li>
              <li>/</li>
              <li className="text-slate-900">AI Background Remover</li>
            </ol>
          </nav>
        </div>
      </section>

      <AIBackgroundRemover />

      <section className="space-y-4 border-t border-border/60 pt-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">When background removal is the right step</h2>
        <p className="max-w-3xl text-base leading-7 text-muted-foreground">
          Background removal is useful when a product photo, profile image, social post, or presentation asset needs a clean subject cutout. The most reliable outputs start with sharp source images, clear separation between subject and background, and enough resolution around edges like hair, clothing, or product outlines.
        </p>
        <p className="max-w-3xl text-base leading-7 text-muted-foreground">
          Review the exported result at the size where it will actually be used. A cutout that looks clean in a small preview can still need adjustment when placed on a bright background or used in a larger design.
        </p>
      </section>

      <section className="mt-16 space-y-8 border-t border-slate-100 pt-16">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Practical Guide and FAQ</h2>
          <p className="mt-2 text-slate-500">Review these details before exporting a final image.</p>
        </div>
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {faqs.map((item) => (
            <article key={item.question} className="rounded-3xl border border-slate-100 bg-white/30 p-6 shadow-sm backdrop-blur-sm">
              <h3 className="text-[17px] font-bold text-slate-900">{item.question}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 space-y-8 border-t border-slate-100 pt-16">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">More Tools</h2>
            <p className="mt-1 text-sm text-slate-500">Other utilities you might find helpful</p>
          </div>
          <Link href="/image" className="secondary-button px-4 py-2 text-xs">View All</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {relatedTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex flex-col gap-3 rounded-2xl border border-white/40 bg-white/40 p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/20 hover:bg-white/60 hover:shadow-hover"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[11px] font-black text-primary shadow-sm ring-1 ring-black/5">
                {tool.icon}
              </span>
              <div>
                <h3 className="text-[15px] font-bold text-slate-900 transition-colors group-hover:text-primary">
                  {tool.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
