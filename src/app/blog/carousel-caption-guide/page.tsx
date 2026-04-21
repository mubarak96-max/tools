import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";
import { Check, Info, MousePointer2, MessageSquare, Quote, FileText } from "lucide-react";

const PAGE_PATH = "/blog/carousel-caption-guide";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "How to Write a Carousel Caption That Gets Engagement (2026 Guide) | FindBest Tools",
  description: "Don't let a weak caption kill your reach. Learn the cross-platform formula for carousel captions on Instagram, LinkedIn, and TikTok. Patterns, hooks, and 10 templates.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "The Ultimate Carousel Caption Guide (2026)",
    description: "Master the double hook. Learn how to write captions that work with your slides to drive maximum saves, shares, and comments.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "How long should an Instagram carousel caption be?",
    answer: "For educational carousels, longer captions (300-600 characters) work best to add context. For lifestyle, stay under 150. Most importantly, the first 125 characters must contain your hook before truncation.",
  },
  {
    question: "How many hashtags should I use on LinkedIn?",
    answer: "Stick to 3-5 relevant hashtags. Using more can trigger spam filters and doesn't provide additional reach. Mix broad industry terms with your specific niche.",
  },
  {
    question: "Should the caption repeat what's in the slides?",
    answer: "No. The caption should provide the context and the 'why', while the slides provide the 'how' and the substance. If your caption tells the whole story, no one will swipe.",
  },
  {
    question: "Does the document title on LinkedIn matter?",
    answer: "Yes, immensely. It appears as a bold, clickable headline directly above the carousel. It acts as a second hook and should be written as a value-driven headline.",
  },
];

export default function CarouselCaptionBlogPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Carousel Caption Guide", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">Copywriting</li>
          </ol>
        </nav>
        
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold uppercase tracking-wider">
            Copywriting · Social Media Strategy
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            How to Write a Carousel Caption That Actually Gets Engagement (2026 Guide)
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
            A weak caption on a strong carousel is the #1 reason posts underperform. Master the four-part formula that drives clicks, swipes, and saves.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium pt-2">
            <span>9 min read</span>
            <span>•</span>
            <span>Published April 2026</span>
          </div>
        </div>
      </header>

      <div className="prose prose-amber dark:prose-invert max-w-none">
        <p className="lead">
          Most creators spend 90% of their time on slide design and 10% on the caption. This is a mistake. Your caption is the first thing the algorithm reads—and the second hook your audience sees.
        </p>

        <section className="my-16">
          <h2 className="text-3xl font-bold mb-8">Platform Limitations: The Truncation Point</h2>
          <p>Before writing, you must understand where your text gets cut off. If your hook isn't in the visible area, your post is dead in the water.</p>
          
          <div className="grid gap-6 sm:grid-cols-2 my-12">
             <div className="p-8 bg-card border border-border rounded-3xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-rose-400 flex items-center justify-center text-white">IG</div>
                    <h4 className="font-bold m-0">Instagram</h4>
                </div>
                <p className="text-sm font-bold text-rose-500 mb-2">125 Characters</p>
                <p className="text-xs text-muted-foreground m-0 leading-relaxed">Everything that earns the swipe must fit in the first sentence. The rest is hidden behind "...more".</p>
             </div>
             <div className="p-8 bg-card border border-border rounded-3xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">IN</div>
                    <h4 className="font-bold m-0">LinkedIn</h4>
                </div>
                <p className="text-sm font-bold text-blue-600 mb-2">210 Characters (~3 lines)</p>
                <p className="text-xs text-muted-foreground m-0 leading-relaxed">B2B audiences want professional context and data. Use the space for authority building.</p>
             </div>
          </div>
        </section>

        <section className="my-16">
          <h2 className="text-3xl font-bold mb-8">The 4-Part Carousel Caption Formula</h2>
          <div className="space-y-8">
             <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl">
                <h4 className="text-amber-900 font-bold mb-2">1. The Hook (Char 1-125)</h4>
                <p className="text-sm text-amber-800 m-0 leading-relaxed">One bold claim, specific number, or open loop. <em>Example: "73% of B2B buyers ignore your first email..."</em></p>
             </div>
             <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl">
                <h4 className="text-amber-900 font-bold mb-2">2. The Setup</h4>
                <p className="text-sm text-amber-800 m-0 leading-relaxed">Expand the promise. Who is this for? Why does it matter right now? Keep sentences short.</p>
             </div>
             <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl">
                <h4 className="text-amber-900 font-bold mb-2">3. The Swipe Prompt</h4>
                <p className="text-sm text-amber-800 m-0 leading-relaxed">Explicit instructions. "Swipe for the full breakdown →" or "The secret is on slide 7."</p>
             </div>
             <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl">
                <h4 className="text-amber-900 font-bold mb-2">4. The Single CTA</h4>
                <p className="text-sm text-amber-800 m-0 leading-relaxed">One clear ask. "Save this" is the highest-weight signal for both platforms.</p>
             </div>
          </div>
        </section>

        <section className="my-20 bg-amber-900 rounded-[2.5rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('/images/dots.svg')] opacity-10" />
            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1">
                    <MessageSquare className="h-10 w-10 text-amber-400 mb-6" />
                    <h3 className="text-3xl font-bold text-white mb-6">Designed for Better Engagement.</h3>
                    <p className="text-amber-100/80 mb-8 leading-relaxed max-w-lg">
                        Our free tool builds carousels that are naturally easy to caption. Choose your platform, select a template, and export slides that deliver exactly what your hook promises.
                    </p>
                    <Link 
                        href="/design/free-social-media-carousel-builder" 
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-900 font-bold rounded-2xl hover:scale-[1.03] active:scale-[0.98] transition-all shadow-xl shadow-black/20"
                    >
                        Try the Free Builder →
                    </Link>
                </div>
                <div className="hidden lg:flex w-full md:w-56 shrink-0 flex-col gap-3">
                    <div className="p-4 bg-white/10 border border-white/20 rounded-xl">
                        <div className="h-2 w-1/2 bg-amber-400/50 rounded-full mb-2" />
                        <div className="h-2 w-full bg-white/20 rounded-full" />
                    </div>
                    <div className="p-4 bg-white/10 border border-white/20 rounded-xl">
                        <div className="h-2 w-1/3 bg-amber-400/50 rounded-full mb-2" />
                        <div className="h-2 w-full bg-white/20 rounded-full" />
                    </div>
                </div>
            </div>
        </section>

        <section className="my-16">
          <h2 className="text-3xl font-bold mb-6">10 Ready-to-Adapt Caption Templates</h2>
          <div className="space-y-4">
             {[
                { title: "The Specific Result", text: "[Specific outcome] in [timeframe] using one format. Here's the exact [system] → Swipe to see it. Save for your next post." },
                { title: "The Counter-Intuitive Opener", text: "[Common belief] is wrong. Here's what actually works in 2026: [brief tease]. Full breakdown below ↓" },
                { title: "The Relatable Problem", text: "If your [content] is stuck at [metric], here is why. I've broken down the fix in [number] slides. ↓ Which one hits hardest?" },
                { title: "The Data Lead", text: "[Specific stat]. Most [audience] are missing this. Here's what the data actually says about [topic] — save this." },
                { title: "The Personal Story", text: "[Time period] ago, I [failed at X]. Then I changed [one thing]. Here's exactly what I changed and why it worked →" },
                { title: "The Checklist Tease", text: "[Number]-point checklist for [outcome]. Framework behind every [result]. Slide [number] is key. Don't skip it." },
                { title: "The Before/After", text: "Before: [problem state]. After: [outcome]. The only thing that changed was [variable]. Full breakdown in [number] slides." },
                { title: "The Myth-Buster", text: "\"[Common advice]\" is outdated. Here's what's actually working in 2026 for [outcome]. Swipe for the full list." },
                { title: "The Lesson Learned", text: "I made [mistake]. It cost me [cost]. Here's the framework I used to fix it. Slide [number] is the one I use every week." },
                { title: "The Direct Value", text: "Swipe for the exact [system] I use to [outcome]. [Number] slides. [Read time]. No fluff. Save it for [use case]." }
             ].map((item, i) => (
                <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-amber-200 transition-colors">
                    <h4 className="font-bold text-slate-900 mb-2 truncate">{item.title}</h4>
                    <pre className="text-sm text-slate-600 m-0 whitespace-pre-wrap font-mono bg-white p-4 rounded-xl border border-slate-200 group-hover:shadow-sm transition-all">
                        {item.text}
                    </pre>
                </div>
             ))}
          </div>
        </section>

        <section id="faq" className="my-16 scroll-mt-20">
          <h2 className="text-3xl font-bold mb-8 text-center uppercase tracking-widest text-sm text-muted-foreground">Common Questions</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {faq.map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
                <h4 className="font-bold text-foreground mb-3">{item.question}</h4>
                <p className="m-0 text-muted-foreground leading-relaxed text-sm">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-16 pt-8 border-t border-border text-center">
            <p className="text-muted-foreground italic max-w-2xl mx-auto">
               The design stops the scroll. The caption earns the swipe. Build your next high-performing carousel at FindBest Tools.
            </p>
        </footer>
      </div>
    </div>
  );
}
