import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";
import { Check, Info, MousePointer2, TrendingUp, Presentation } from "lucide-react";

const PAGE_PATH = "/blog/how-to-make-a-linkedin-carousel";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "How to Make a LinkedIn Carousel in 2026: The Complete Guide | FindBest Tools",
  description: "Learn how to make high-engagement LinkedIn carousels. Complete guide to PDF document posts, dimensions, best practices, and viral slide structures for 2026.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "How to Make a LinkedIn Carousel — Complete 2026 Guide",
    description: "Master the art of LinkedIn carousels. From PDF specs to the 'One Idea' rule, here is how to drive 22%+ engagement on your B2B posts.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "How many slides should a LinkedIn carousel have?",
    answer: "For most content, 5 to 10 slides is the sweet spot. Enough to deliver genuine value, short enough to hold attention to the end. High-performing educational carousels occasionally run to 15 slides.",
  },
  {
    question: "Do LinkedIn carousels need to be a PDF?",
    answer: "PDF is the most common and cleanest format, but LinkedIn also accepts PowerPoint and Word files. PDF is recommended because it renders consistently across all devices.",
  },
  {
    question: "Can I post the same carousel on LinkedIn and Instagram?",
    answer: "Yes, but they use different formats. LinkedIn requires a PDF (Document post), while Instagram requires individual images (JPG/PNG). Standard Square (1080x1080) works best for cross-posting.",
  },
  {
    question: "What are the best dimensions for a LinkedIn carousel?",
    answer: "The safest dimension is Square (1080 x 1080 px). For more mobile presence, use Portrait (1080 x 1350 px). For full-screen mobile impact, 1080 x 1920 (9:16) is increasingly popular.",
  },
];

export default function LinkedInCarouselBlogPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "How to Make a LinkedIn Carousel", path: PAGE_PATH },
  ]);

  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <header className="mb-12">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">LinkedIn Guide</li>
          </ol>
        </nav>
        
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 text-xs font-bold uppercase tracking-wider">
            LinkedIn Marketing · 2026 Strategy
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            How to Make a LinkedIn Carousel in 2026: The Complete Guide
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
            LinkedIn carousels consistently outperform every other format for reach and dwell time. Here is exactly how to build them.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium pt-2">
            <span>12 min read</span>
            <span>•</span>
            <span>Published April 2026</span>
          </div>
        </div>
      </header>

      <div className="prose prose-blue dark:prose-invert max-w-none">
        <p className="lead">
          LinkedIn carousels (technically "Document Posts") are the single most effective organic content format on the platform right now. Not polls. Not text posts. Not even video.
        </p>

        <p>
          The reason is simple: every swipe is a signal to the algorithm that the viewer is engaged. The longer they stay, the more the algorithm rewards the post with additional reach. This guide covers the correct specs, design rules, and the fastest way to viral B2B visibility.
        </p>

        <section className="my-12 scroll-mt-20">
          <h2 className="text-3xl font-bold mb-6">LinkedIn Carousel Specs for 2026</h2>
          <p>Getting your dimensions right before you start designing saves a lot of time. Here are the 2026 requirements:</p>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 my-8">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <div className="aspect-square bg-white border border-slate-200 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-slate-400">1:1</span>
                </div>
                <h4 className="font-bold text-sm mb-1">Square (Safe)</h4>
                <p className="text-[11px] text-muted-foreground">1080 x 1080 px</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <div className="aspect-[4/5] bg-white border border-slate-200 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-slate-400">4:5</span>
                </div>
                <h4 className="font-bold text-sm mb-1">Portrait (Mobile)</h4>
                <p className="text-[11px] text-muted-foreground">1080 x 1350 px</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <div className="aspect-[9/16] bg-white border border-slate-200 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-slate-400">9:16</span>
                </div>
                <h4 className="font-bold text-sm mb-1">Full Height</h4>
                <p className="text-[11px] text-muted-foreground">1080 x 1920 px</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 my-8">
             <h4 className="text-blue-900 font-bold mb-3 flex items-center gap-2">
                <Info className="h-4 w-4" /> Technical Requirements
             </h4>
             <ul className="text-sm text-blue-800 space-y-2 m-0 p-0 list-none">
                <li className="flex gap-2"><strong>Format:</strong> PDF (best), PowerPoint, or Word</li>
                <li className="flex gap-2"><strong>Resolution:</strong> 150–300 DPI for sharp text</li>
                <li className="flex gap-2"><strong>Max Size:</strong> 100 MB</li>
             </ul>
          </div>
        </section>

        <section className="my-16">
          <h2 className="text-3xl font-bold mb-8">The Anatomy of a High-Performing Slide Deck</h2>
          <p>Top-performing LinkedIn carousels follow a consistent structure. Here is the slide-by-slide strategy used by the top 1% of creators.</p>

          <div className="space-y-12 my-12">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shrink-0">01</div>
                <div>
                   <h3 className="text-xl font-bold mb-3 text-blue-600">The Hook (Slide 1)</h3>
                   <p className="text-slate-600 leading-relaxed">
                      Your cover determines whether someone engages or scrolls past. Use a bold, counter-intuitive claim or a specific number. Keep it minimal and treat it like a billboard: one message, high contrast.
                   </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shrink-0">02</div>
                <div>
                   <h3 className="text-xl font-bold mb-3 text-blue-600">The Value (One Idea Per Slide)</h3>
                   <p className="text-slate-600 leading-relaxed">
                      This is where most creators fail. <strong>Do not use text walls</strong>. If a slide takes more than five seconds to read, people will swipe past it. Aim for maximum 30 words per slide and use bold headers with clear bullet points.
                   </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shrink-0">03</div>
                <div>
                   <h3 className="text-xl font-bold mb-3 text-blue-600">The CTA (Final Slide)</h3>
                   <p className="text-slate-600 leading-relaxed">
                      Never let your carousel end abruptly. Ask a question, direct them to follow your profile, or drive to a resource linked in the comments. Carousels with a specific CTA see 30% higher conversion rates.
                   </p>
                </div>
            </div>
          </div>
        </section>

        <section className="my-16 bg-gradient-to-br from-blue-900 to-indigo-950 rounded-[2.5rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl transition-all group-hover:bg-white/10" />
            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1">
                    <h3 className="text-3xl font-bold mb-6">Master the Continuous Background</h3>
                    <p className="text-blue-100 mb-8 leading-relaxed max-w-lg">
                        Our secret engagement weapon: patterns that flow across slide boundaries. This creates a psychological "open loop" that drives users to keep swiping to resolve the visual.
                    </p>
                    <Link 
                        href="/design/free-social-media-carousel-builder" 
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-900 font-bold rounded-2xl hover:scale-[1.03] active:scale-[0.98] transition-all shadow-xl shadow-black/20"
                    >
                        <TrendingUp className="h-5 w-5" />
                        Built for B2B Creators →
                    </Link>
                </div>
                <div className="w-full md:w-56 shrink-0 grid grid-cols-2 gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    <div className="aspect-square bg-white/10 rounded-xl border border-white/10 flex items-center justify-center">
                        <Check className="h-6 w-6 text-blue-300" />
                    </div>
                    <div className="aspect-square bg-white/10 rounded-xl border border-white/10 flex items-center justify-center">
                        <Check className="h-6 w-6 text-blue-300" />
                    </div>
                    <div className="aspect-square bg-white/10 rounded-xl border border-white/10 flex items-center justify-center">
                        <Check className="h-6 w-6 text-blue-300" />
                    </div>
                    <div className="aspect-square bg-white/10 rounded-xl border border-white/10 flex items-center justify-center">
                        <Check className="h-6 w-6 text-blue-300" />
                    </div>
                </div>
            </div>
        </section>

        <section className="my-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-muted-foreground uppercase tracking-widest text-sm">How to Post Step-by-Step</h2>
          <div className="space-y-4">
             {[
                { title: "Design & Export", desc: "Create your slides at 1080px width and export as a PDF document (standard resolution 150-300 DPI)." },
                { title: "Select Document Post", desc: "On LinkedIn, click the 'Document' icon (not Image) in the create post toolbar." },
                { title: "Title the PDF", desc: "LinkedIn displays your PDF filename. Use a keyword-rich, Descriptive title instead of 'export_v1.pdf'." },
                { title: "Add the Text Hook", desc: "Write 2-4 lines of punchy copy above the document to draw people in." }
             ].map((item, i) => (
                <div key={i} className="flex items-center gap-6 p-6 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 transition-colors">
                    <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-blue-600 font-bold shrink-0">{i+1}</div>
                    <div>
                        <h4 className="font-bold text-slate-900">{item.title}</h4>
                        <p className="text-sm text-slate-500 m-0">{item.desc}</p>
                    </div>
                </div>
             ))}
          </div>
        </section>

        <section id="faq" className="my-16 scroll-mt-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {faq.map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-[1.5rem] p-6 hover:shadow-lg transition-all">
                <h4 className="font-bold text-foreground mb-3">{item.question}</h4>
                <p className="m-0 text-muted-foreground leading-relaxed text-sm">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-20 p-10 bg-slate-50 border border-slate-100 rounded-[2.5rem] text-center">
          <Presentation className="h-10 w-10 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Build Your LinkedIn Carousel for Free</h2>
          <p className="text-slate-500 mb-8 max-w-lg mx-auto leading-relaxed">
            Create high-authority B2B carousels without complex software. PDF export, no watermarks, no sign-up.
          </p>
          <Link 
            href="/design/free-social-media-carousel-builder" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20"
          >
            Start Designing →
          </Link>
        </div>
      </div>
    </div>
  );
}
