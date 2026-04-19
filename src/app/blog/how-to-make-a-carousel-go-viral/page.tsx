import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";
import { Check, Info, TrendingUp, Heart, Share2, Bookmark } from "lucide-react";

const PAGE_PATH = "/blog/how-to-make-a-carousel-go-viral";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "How to Make a Carousel Go Viral in 2026: Engagement Tactics | FindBest Tools",
  description: "Learn the secret tactics to make your carousels go viral. Engineered strategy for swipe depth, dwell time, and the algorithms of Instagram and LinkedIn in 2026.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "How to Make a Carousel Go Viral — 2026 Tactics",
    description: "Don't just post. Engineer virality. Learn how to stack engagement signals like swipe depth and save rate to explode your reach.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "How many slides does a carousel need to go viral?",
    answer: "7 to 10 slides is the data-backed sweet spot. Fewer than 7 gives the algorithm fewer swipe events to score. More than 10 requires a high completion rate—if you can't hold attention, 7 is better.",
  },
  {
    question: "Do saves or likes matter more for carousel reach?",
    answer: "Saves matter significantly more in 2026. Saves signal reference value, which is a massive distribution signal. DM shares are even more powerful on Instagram, currently weighted 3-5x higher than likes.",
  },
  {
    question: "Why is my carousel getting impressions but low engagement?",
    answer: "Usually one of three things: a misleading cover (fix the value delay), too much text per slide (apply the 30-word limit), or a missing CTA on the final slide.",
  },
  {
    question: "Does posting time affect carousel reach?",
    answer: "Yes, especially on LinkedIn where the first hour determines 70% of total reach. Post when your specific audience is active, and protect the first 2 hours by replying to every comment.",
  },
];

export default function ViralCarouselBlogPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "How to Make a Carousel Go Viral", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">Growth Strategy</li>
          </ol>
        </nav>
        
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 text-xs font-bold uppercase tracking-wider">
            Viral Marketing · Algorithm Insight
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            How to Make a Carousel Go Viral in 2026: Tactics That Actually Work
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
            Stop chasing likes. Learn how to engineer your carousel for the specific signals that Instagram and LinkedIn algorithms reward with massive distribution.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium pt-2">
            <span>13 min read</span>
            <span>•</span>
            <span>Published April 2026</span>
          </div>
        </div>
      </header>

      <div className="prose prose-rose dark:prose-invert max-w-none">
        <p className="lead">
          In 2026, a carousel that goes viral is not the result of luck. It is the result of deliberate design decisions that stack engagement signals: swipe depth, dwell time, and completion rate.
        </p>

        <section className="my-16">
          <h2 className="text-3xl font-bold mb-8">The 3 Signals of Viral Reach</h2>
          <p>Before you design your first slide, you need to know what the algorithm is looking for. In 2026, these are the heavy hitters:</p>
          
          <div className="grid gap-6 sm:grid-cols-3 my-12">
             <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl text-center">
                <Heart className="h-8 w-8 text-rose-500 mx-auto mb-4" />
                <h4 className="font-bold text-slate-900 mb-2">Dwell Time</h4>
                <p className="text-xs text-slate-600 m-0">Seconds spent on post</p>
             </div>
             <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl text-center">
                <Bookmark className="h-8 w-8 text-rose-500 mx-auto mb-4" />
                <h4 className="font-bold text-slate-900 mb-2">Save Rate</h4>
                <p className="text-xs text-slate-600 m-0">Reference value signal</p>
             </div>
             <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl text-center">
                <Share2 className="h-8 w-8 text-rose-500 mx-auto mb-4" />
                <h4 className="font-bold text-slate-900 mb-2">Share Velocity</h4>
                <p className="text-xs text-slate-600 m-0">DM and story shares</p>
             </div>
          </div>
        </section>

        <section className="my-16">
          <h2 className="text-3xl font-bold mb-6">Tactic: The "Value Delay" Structure</h2>
          <p>Most creators deliver the payoff too early. Viral carousels delay the main insight until slide 5 or 6, using the earlier slides to frame the problem and build tension.</p>
          <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl my-8">
             <h4 className="font-bold mb-6 text-rose-600 text-sm uppercase tracking-widest">The Viral Framework</h4>
             <ul className="space-y-4 m-0 p-0 list-none">
                <li className="flex gap-4"><strong>Slide 1:</strong> The Curiosity Hook (Open Loop)</li>
                <li className="flex gap-4"><strong>Slide 2-3:</strong> Relationship & Problem Framed</li>
                <li className="flex gap-4"><strong>Slide 4:</strong> The Tension Break ("Here is the fix...")</li>
                <li className="flex gap-4"><strong>Slide 5-8:</strong> The Actual Insight/Value</li>
                <li className="flex gap-4"><strong>Slide 10:</strong> Targeted Signal CTA</li>
             </ul>
          </div>
        </section>

        <section className="my-16">
          <h2 className="text-3xl font-bold mb-6">Tactic: Engineer the One-Idea Slide</h2>
          <p>
            If a slide takes more than 5 seconds to read, you've lost the viewer. This is the #1 killer of dwell time scores. Applying a <strong>30-word limit per slide</strong> forces you to split long ideas into more swipeable pages, which boosts your "Swipe Depth" metric automatically.
          </p>
        </section>

        <section className="my-20 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group">
             <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1">
                    <TrendingUp className="h-10 w-10 text-rose-500 mb-6" />
                    <h2 className="text-3xl font-bold text-white mb-6 leading-tight">Engineered for Completion Rates.</h2>
                    <p className="text-slate-300 mb-8 max-w-lg leading-relaxed">
                        Don't let your drop-off kill your reach. Use our built-in templates designed for the 7-10 slide sweet spot, featuring <strong>Continuous Backgrounds</strong> that pull the viewer from one slide to the next.
                    </p>
                    <Link 
                        href="/design/free-social-media-carousel-builder" 
                        className="inline-flex items-center gap-2 px-8 py-4 bg-rose-500 text-white font-bold rounded-2xl hover:bg-rose-400 transition-all shadow-xl shadow-rose-500/20"
                    >
                        Try the Viral Builder →
                    </Link>
                </div>
                <div className="hidden md:block w-full md:w-64 aspect-[4/5] bg-slate-800/50 rounded-2xl border border-white/10 p-6 flex flex-col gap-4">
                    <div className="h-4 w-2/3 bg-white/10 rounded-full" />
                    <div className="flex-1 bg-white/5 rounded-xl flex items-center justify-center">
                        <Share2 className="h-8 w-8 text-white/10" />
                    </div>
                    <div className="h-8 w-full bg-rose-500/30 rounded-lg flex items-center justify-center text-[10px] font-bold">CTA SLIDE</div>
                </div>
             </div>
        </section>

        <section className="my-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-muted-foreground uppercase tracking-widest text-sm">Engagement Signals Weighting</h2>
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-bold">Signal</th>
                  <th className="px-6 py-4 font-bold">Weighting (Est.)</th>
                  <th className="px-6 py-4 font-bold">Primary Platform</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                    <td className="px-6 py-4 font-bold">DM Share</td>
                    <td className="px-6 py-4 text-emerald-500 font-bold">Very High (5x)</td>
                    <td className="px-6 py-4">Instagram</td>
                </tr>
                <tr>
                    <td className="px-6 py-4 font-bold">Save Rate</td>
                    <td className="px-6 py-4 text-emerald-500 font-bold">High (3x)</td>
                    <td className="px-6 py-4">LinkedIn / IG</td>
                </tr>
                <tr>
                    <td className="px-6 py-4 font-bold">Dwell Time</td>
                    <td className="px-6 py-4 text-blue-500 font-bold">Medium</td>
                    <td className="px-6 py-4">LinkedIn</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="faq" className="my-16 scroll-mt-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid gap-6">
            {faq.map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-3xl p-8 hover:shadow-xl transition-all duration-300">
                <h4 className="font-bold text-foreground mb-3 text-lg">{item.question}</h4>
                <p className="m-0 text-muted-foreground leading-relaxed text-sm">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-16 pt-8 border-t border-border text-center">
            <p className="text-muted-foreground italic max-w-2xl mx-auto">
               Viral carousels are not accidents. They are engineered. Use the right tools, apply the right pacing, and let the algorithm do the rest.
            </p>
        </footer>
      </div>
    </div>
  );
}
