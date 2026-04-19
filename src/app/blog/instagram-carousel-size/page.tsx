import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";
import { Check, Info, AlertTriangle } from "lucide-react";

const PAGE_PATH = "/blog/instagram-carousel-size";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Instagram Carousel Size Guide for 2026: Every Dimension & Format | FindBest Tools",
  description: "Master Instagram carousel sizes for 2026. Complete guide to 4:5 portrait, 1:1 square, landscape, and the new 3:4 format. Safe zones, export settings, and sharp text tips.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Instagram Carousel Size Guide for 2026 (Complete Dimensions)",
    description: "Every dimension you need for high-engagement Instagram carousels. Coverage of portrait, square, and the new 1440px format.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "What is the best size for an Instagram carousel in 2026?",
    answer: "The best size is 1080 x 1350 pixels (4:5 portrait). This format takes up the most vertical space in the mobile feed, generating more dwell time and typically higher engagement than square or landscape options.",
  },
  {
    question: "Do all carousel slides have to be the same size?",
    answer: "Yes. Instagram locks the aspect ratio of your carousel to the first slide and automatically crops all subsequent slides to match. Design all slides at the same dimensions before uploading.",
  },
  {
    question: "Can I use portrait for Instagram and then reuse the same slides on LinkedIn?",
    answer: "Not without resizing. LinkedIn renders carousels as PDF document posts, and square (1:1) slides display best there. Portrait slides will appear with black bars or be cropped. If you need one set of slides for both platforms, design at 1080 x 1080 px.",
  },
  {
    question: "What file format should I export carousel slides in?",
    answer: "PNG is best for text-heavy carousels (sharpest rendering). JPG at 85–95% quality is best for photo-heavy carousels (smaller file sizes). Both are accepted by Instagram.",
  },
  {
    question: "How many slides can an Instagram carousel have?",
    answer: "Instagram supports between 2 and 20 slides per carousel post. For engagement, most top-performing carousels run between 5 and 10 slides — enough to deliver value without losing viewers.",
  },
];

export default function InstagramSizeBlogPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Instagram Carousel Size Guide", path: PAGE_PATH },
  ]);

  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <header className="mb-12 text-center md:text-left">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">Instagram Guide</li>
          </ol>
        </nav>
        
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-violet-500/10 text-violet-500 text-xs font-bold uppercase tracking-wider">
            Design Guide · 2026 Update
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Instagram Carousel Size Guide for 2026: Every Dimension You Need to Get Right
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
            Complete masterclass on aspect ratios, safe zones, and the secret export settings that keep your carousel text sharp.
          </p>
          <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground font-medium pt-2">
            <span>10 min read</span>
            <span>•</span>
            <span>Published April 2026</span>
          </div>
        </div>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p className="lead">
          If you have ever uploaded an Instagram carousel and noticed your text getting clipped, your faces cropped, or your design looking blurry — the problem almost certainly started before you hit post. It started with the wrong dimensions.
        </p>

        <p>
          Instagram is strict about aspect ratios. It locks the format of your entire carousel to whatever your first slide uses. Get slide one wrong, and every subsequent slide is automatically cropped to match. No warning. No preview. Just cropped content.
        </p>

        <section className="my-12 scroll-mt-20">
          <h2 className="text-3xl font-bold mb-6">The Three Instagram Carousel Formats</h2>
          <p>Instagram supports three aspect ratios for carousel posts. Every slide in a carousel must use the same one. Here is what each looks like in practice.</p>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 my-8">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="aspect-[4/5] bg-violet-50 rounded-lg mb-4 flex items-center justify-center border border-violet-100">
                    <span className="text-xs font-bold text-violet-600">4:5 PORTRAIT</span>
                </div>
                <h4 className="font-bold mb-1">Portrait</h4>
                <p className="text-xs text-muted-foreground mb-4">1080 x 1350 px</p>
                <ul className="text-xs space-y-2 text-slate-600 p-0 m-0 list-none">
                    <li>✓ Max vertical space</li>
                    <li>✓ Higher engagement</li>
                    <li>✓ Best for text/info</li>
                </ul>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="aspect-square bg-blue-50 rounded-lg mb-4 flex items-center justify-center border border-blue-100">
                    <span className="text-xs font-bold text-blue-600">1:1 SQUARE</span>
                </div>
                <h4 className="font-bold mb-1">Square</h4>
                <p className="text-xs text-muted-foreground mb-4">1080 x 1080 px</p>
                <ul className="text-xs space-y-2 text-slate-600 p-0 m-0 list-none">
                    <li>✓ Cross-platform safe</li>
                    <li>✓ Standard classic</li>
                    <li>✓ Clean and tidy</li>
                </ul>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="aspect-[1.91/1] bg-emerald-50 rounded-lg mb-4 flex items-center justify-center border border-emerald-100">
                    <span className="text-xs font-bold text-emerald-600">1.91:1 LANDSCAPE</span>
                </div>
                <h4 className="font-bold mb-1">Landscape</h4>
                <p className="text-xs text-muted-foreground mb-4">1080 x 566 px</p>
                <ul className="text-xs space-y-2 text-slate-600 p-0 m-0 list-none">
                    <li>✓ Panoramic photos</li>
                    <li>✓ Data visualizations</li>
                    <li>⚠ Low engagement</li>
                </ul>
            </div>
          </div>
        </section>

        <section className="my-12 scroll-mt-20">
          <h2 className="text-3xl font-bold mb-6">Portrait (4:5) — The Engagement King</h2>
          <p>
            Portrait is the recommended format for the vast majority of Instagram carousels in 2026. It takes up the maximum vertical space in the mobile feed, which means users see less of the posts above and below yours as they scroll. More screen real estate means more attention, more dwell time, and more engagement.
          </p>
          <div className="bg-violet-500/5 border-l-4 border-violet-500 p-6 my-8 rounded-r-xl">
             <div className="flex gap-4">
                <Info className="h-6 w-6 text-violet-500 shrink-0" />
                <div>
                    <h4 className="text-violet-900 font-bold mb-2">Why it works</h4>
                    <p className="text-violet-800 text-sm m-0">
                        Portrait carousels take up roughly 25% more screen space than square posts. Studies consistently show this format generates more saves, shares, and comments than square or landscape equivalents.
                    </p>
                </div>
             </div>
          </div>
        </section>

        <section className="my-12 scroll-mt-20">
          <h2 className="text-3xl font-bold mb-6">The 2026 Format Update: 1080 x 1440 px</h2>
          <p>
            Instagram rolled out a new carousel dimension in early 2026 that many creators have not yet picked up on. The new format — <strong>1080 x 1440 pixels at a 3:4 ratio</strong> — sits between the traditional portrait and square options, offering more vertical space than square without hitting the 4:5 cap.
          </p>
          <p>
            The extra vertical space gives you more room to increase font sizes and line spacing, making your content more readable on mobile. It aligns naturally with how many phone screens render content.
          </p>
        </section>

        <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 my-16 text-rose-900">
            <div className="flex gap-4 items-start mb-4">
                <AlertTriangle className="h-8 w-8 text-rose-600 shrink-0" />
                <h3 className="text-2xl font-bold m-0">The Most Expensive Carousel Mistake</h3>
            </div>
            <p className="leading-relaxed mb-6">
                When you upload a carousel, Instagram <strong>locks the aspect ratio to whatever your first image uses</strong>. Every subsequent image is automatically cropped to match — without any warning.
            </p>
            <p className="bg-white/50 p-4 rounded-xl border border-rose-200 text-sm italic m-0">
                If your first slide is 4:5 (Portrait) and your second is 1:1 (Square), Instagram will crop the top and bottom of your square image to force it into 4:5. Content will disappear!
            </p>
        </div>

        <section className="my-12 scroll-mt-20">
          <h2 className="text-3xl font-bold mb-6">Safe Zones: Protecting Your Text and Faces</h2>
          <p>Even within the correct dimensions, there are areas of your slides that are at risk of being cropped in different contexts — profile grid view, Explore page previews, or shared links.</p>
          <p>
            For portrait carousels (1080 x 1350 px), keep all essential content — text, logos, faces — within the central <strong>1012 x 1350 px</strong> area. This accounts for the 3:4 crop applied in the profile grid view.
          </p>
          <p className="font-bold underline">Rules of thumb:</p>
          <ul>
            <li>Leave 150 pixels of "breathing room" on all four sides.</li>
            <li>Avoid text in the extreme corners.</li>
            <li>Test how your cover slide looks in the 1:1 profile grid.</li>
          </ul>
        </section>

        <section className="my-12 scroll-mt-20">
          <h2 className="text-3xl font-bold mb-6">Preserving Image Quality</h2>
          <p>
            Instagram recompresses every upload. To keep your text sharp, export as <strong>PNG</strong>. PNG is lossless and preserves the sharp edges of text characters far better than JPG at equivalent file sizes.
          </p>
        </section>

        <section className="my-16 bg-slate-900 rounded-[2rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
             <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                    <h2 className="text-3xl font-bold text-white mb-4">Never get the size wrong again.</h2>
                    <p className="text-slate-300 mb-8 leading-relaxed">
                        Our free Carousel Builder handles the dimensions automatically. Every template is perfectly sized for 4:5 Portrait, ensuring your exports are tack-sharp every time.
                    </p>
                    <Link 
                        href="/design/free-social-media-carousel-builder" 
                        className="inline-flex items-center gap-2 px-8 py-4 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-500 transition-all"
                    >
                        Try the Free Carousel Builder →
                    </Link>
                </div>
                <div className="w-full md:w-64 aspect-[4/5] bg-slate-800 rounded-xl border border-slate-700 p-4 shadow-inner flex flex-col gap-2">
                    <div className="flex-[0.5] w-full bg-slate-700/50 rounded-lg animate-pulse" />
                    <div className="flex-1 w-full bg-slate-700/50 rounded-lg animate-pulse" />
                    <div className="flex-[0.3] w-full bg-slate-700/50 rounded-lg animate-pulse" />
                </div>
             </div>
        </section>

        <section className="my-12 scroll-mt-20">
          <h2 className="text-3xl font-bold mb-8 text-center uppercase tracking-widest text-sm text-muted-foreground">Quick Reference Table</h2>
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-bold">Format</th>
                  <th className="px-6 py-4 font-bold">Dimensions</th>
                  <th className="px-6 py-4 font-bold">Best For</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                    <td className="px-6 py-4 font-bold">Portrait</td>
                    <td className="px-6 py-4 font-mono">1080 x 1350 px</td>
                    <td className="px-6 py-4">Max engagement, text guides</td>
                </tr>
                <tr>
                    <td className="px-6 py-4 font-bold">Square</td>
                    <td className="px-6 py-4 font-mono">1080 x 1080 px</td>
                    <td className="px-6 py-4">LinkedIn cross-posting</td>
                </tr>
                <tr>
                    <td className="px-6 py-4 font-bold">New 1440</td>
                    <td className="px-6 py-4 font-mono">1080 x 1440 px</td>
                    <td className="px-6 py-4">High-res vertical guides</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="faq" className="scroll-mt-20 my-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid gap-6">
            {faq.map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h4 className="text-lg font-bold text-foreground mb-3">{item.question}</h4>
                <p className="m-0 text-muted-foreground leading-relaxed text-sm">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-16 pt-8 border-t border-border text-center">
            <p className="text-muted-foreground italic max-w-2xl mx-auto">
                Getting your carousel dimensions right is the foundation everything else is built on. Design your next carousel at <strong>FindBest Tools</strong> — free, no watermark, no sign-up.
            </p>
        </footer>
      </div>
    </div>
  );
}
