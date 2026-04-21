import Link from "next/link";

import ImageToBase64Tool from "./components/ImageToBase64Tool";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 43200;

const PAGE_PATH = "/image/convert-image-to-base64";

export const metadata = buildMetadata({
  title: "Convert Image to Base64 | Free Online Convert Image to Base64",
  description:
    "Convert any image into a Base64 string or data URL directly in your browser. Copy the output for use in CSS, HTML, or JSON.",
  path: PAGE_PATH,
});

const relatedTools = [
  {
    name: "AI Background Remover",
    href: "/image/ai-background-remover",
    description: "Remove the background from photos using browser-based AI.",
    icon: "AI",
  },
  {
    name: "Image to Text OCR",
    href: "/text/convert-image-to-text",
    description: "Extract editable text from JPG, PNG, WEBP, and BMP images.",
    icon: "OCR",
  },
];

const faqs = [
  {
    question: "What is an image Base64 string?",
    answer:
      "It is the binary image data encoded as text so it can be pasted into HTML, CSS, JSON, or another text-only destination.",
  },
  {
    question: "Should I use a raw Base64 string or a full data URL?",
    answer:
      "Use the raw string when another system already knows the MIME type. Use the full data URL when pasting into HTML, CSS, or previews that need the prefix.",
  },
  {
    question: "Does this upload my image?",
    answer:
      "No. The conversion happens in your browser by reading the selected file locally.",
  },
];

export default function ConvertImageToBase64Page() {
  return (
    <div className="space-y-8 sm:space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Convert Image to Base64",
            description: "Convert an image file into Base64 text or a full data URL in the browser.",
            applicationCategory: "UtilityApplication",
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
            Convert Image to Base64
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
            Convert any image into a Base64 string or data URL directly in your browser. Copy the output for use in CSS, HTML, JSON, or API payloads.
          </p>

          <nav aria-label="Breadcrumb" className="mt-8">
            <ol className="flex flex-wrap items-center gap-2 text-[13px] font-medium text-slate-400">
              <li><Link href="/" className="hover:text-primary">Home</Link></li>
              <li>/</li>
              <li><Link href="/image" className="hover:text-primary">Image</Link></li>
              <li>/</li>
              <li className="text-slate-900">Convert Image to Base64</li>
            </ol>
          </nav>
        </div>
      </section>

      <ImageToBase64Tool />

      <section className="space-y-4 border-t border-border/60 pt-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">When Base64 image conversion is useful</h2>
        <p className="max-w-3xl text-base leading-7 text-muted-foreground">
          Base64 is useful when an image needs to travel through a text-only workflow: inline CSS, HTML email snippets, JSON fixtures, quick demos, or documentation examples. It keeps the image and the markup together, which is convenient for small assets and prototypes.
        </p>
        <p className="max-w-3xl text-base leading-7 text-muted-foreground">
          The tradeoff is file size. Base64 output is usually larger than the original file, so keep regular image files for production pages unless embedding the asset is genuinely useful.
        </p>
      </section>

      <section className="mt-16 space-y-8 border-t border-slate-100 pt-16">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Practical Guide and FAQ</h2>
          <p className="mt-2 text-slate-500">Key details before copying the converted output.</p>
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
