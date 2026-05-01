import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";

const PAGE_PATH = "/blog/what-are-utm-parameters";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "What Are UTM Parameters? A Beginner's Guide to Campaign Tracking",
  description: "Learn what UTM parameters are, how they work, and why they are essential for tracking your marketing campaign performance in Google Analytics 4.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "What Are UTM Parameters? A Beginner's Guide to Campaign Tracking",
    description: "Master the basics of UTM tracking. Learn to use source, medium, and campaign tags to measure ROI accurately.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "Do UTM parameters affect SEO?",
    answer: "No. UTM parameters are query strings used for tracking and do not influence search engine rankings. Search engines like Google typically ignore these parameters when crawling and indexing pages, especially if you have a proper canonical tag set up.",
  },
  {
    question: "Do UTM parameters work with platforms other than Google Analytics?",
    answer: "Yes. Most modern analytics platforms, including Adobe Analytics, Mixpanel, Matomo, and HubSpot, recognize and process standard UTM parameters automatically.",
  },
  {
    question: "Should I shorten UTM-tagged URLs?",
    answer: "For social media or print materials, yes. Long URLs with multiple UTM parameters can look messy. You can use a URL shortener (like Bitly or Rebrandly) after generating your UTM link to keep things clean while preserving tracking data.",
  },
  {
    question: "What happens if I miss a required parameter?",
    answer: "While Google Analytics 4 is more flexible than older versions, missing utm_source, utm_medium, or utm_campaign can lead to 'Unassigned' or 'Direct' traffic in your reports. It is best practice to always include all three.",
  },
  {
    question: "Is there a limit to how many UTM parameters I can use?",
    answer: "Technically no, but most analytics tools support the 5 standard ones (source, medium, campaign, term, content). Adding too many custom parameters can make your URLs excessively long and may be truncated by some browsers or platforms.",
  },
];

export default function UtmParametersBlogPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "What Are UTM Parameters?", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">UTM Guide</li>
          </ol>
        </nav>
        
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-bold uppercase tracking-wider">
            Marketing · Analytics
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            What Are UTM Parameters? A Beginner&apos;s Guide to Campaign Tracking
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Stop guessing where your traffic comes from. Learn how to use UTM tags to track every click with surgical precision.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium pt-2">
            <span>8 min read</span>
            <span>•</span>
            <span>Published May 2026</span>
          </div>
        </div>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <section className="mb-12">
          <p className="lead">
            If you&apos;ve ever clicked a link in a marketing email, a social media post, or a paid ad, there&apos;s a good chance that link had invisible tracking code attached to it. That code is made up of UTM parameters — and they&apos;re one of the most powerful, underused tools in digital marketing.
          </p>
          <p>
            This guide explains everything you need to know about UTM parameters: what they are, how they work, what each one means, and how to start using them to finally understand where your traffic is really coming from.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">What Are UTM Parameters?</h2>
          <p>
            UTM stands for <strong>Urchin Tracking Module</strong>. The name comes from Urchin Software, a web analytics company that Google acquired in 2005 — and whose technology became the foundation of Google Analytics.
          </p>
          <p>
            UTM parameters are small snippets of text that you add to the end of any URL. When someone clicks that URL, the parameters are read by your analytics platform (like Google Analytics 4, Adobe Analytics, Mixpanel, or Kissmetrics) and recorded against that session. This tells you exactly which campaign, channel, or piece of content drove that visit.
          </p>
          <p>Here&apos;s what a UTM-tagged URL looks like:</p>
          <div className="bg-slate-900 text-slate-100 p-6 rounded-xl font-mono text-xs overflow-x-auto my-6 shadow-lg shadow-indigo-500/10 border border-slate-800">
            https://findbest.tools/utility/utm-builder<span className="text-indigo-400">?utm_source=newsletter&utm_medium=email&utm_campaign=may2026_launch</span>
          </div>
          <p>
            Everything after the <code>?</code> is the UTM data. The base URL stays the same — the parameters just add context for your analytics tool to capture.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Why Do UTM Parameters Matter?</h2>
          <p>
            Without UTM parameters, your analytics platform tries to guess where traffic came from. And it often guesses wrong.
          </p>
          <p>For example:</p>
          <ul className="space-y-2">
            <li>A link shared in a private Slack message shows up as <strong>direct</strong> traffic</li>
            <li>A link from a LinkedIn post might show as <strong>referral</strong> or even <strong>organic</strong></li>
            <li>Email clicks frequently get misattributed as <strong>direct</strong></li>
          </ul>
          <p>
            This means without UTM tracking, you could have a hugely successful email campaign and never know it — because all that traffic gets lumped into &quot;direct&quot; with no context.
          </p>
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 my-8 rounded-r-xl">
            <p className="m-0 text-indigo-900 font-medium">
              UTM parameters fix this. They tell your analytics platform, with certainty: <em className="italic">&quot;This person came from our May newsletter, via email, as part of our product launch campaign.&quot;</em>
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">The 5 UTM Parameters Explained</h2>
          <p>There are five standard UTM parameters. Three are required, two are optional.</p>

          <div className="space-y-8 mt-8">
            <div className="p-6 bg-card border border-border rounded-2xl">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-3">
                <span className="text-indigo-600">1.</span> utm_source (Required)
              </h3>
              <p className="text-muted-foreground"><strong>What it tracks:</strong> Where the traffic is coming from — the website, platform, or publisher that sent the visitor.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <code className="text-xs bg-slate-100 px-2 py-1 rounded">google</code>
                <code className="text-xs bg-slate-100 px-2 py-1 rounded">newsletter</code>
                <code className="text-xs bg-slate-100 px-2 py-1 rounded">facebook</code>
              </div>
            </div>

            <div className="p-6 bg-card border border-border rounded-2xl">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-3">
                <span className="text-indigo-600">2.</span> utm_medium (Required)
              </h3>
              <p className="text-muted-foreground"><strong>What it tracks:</strong> The marketing channel or type of traffic — the method used to deliver the message.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <code className="text-xs bg-slate-100 px-2 py-1 rounded">email</code>
                <code className="text-xs bg-slate-100 px-2 py-1 rounded">cpc</code>
                <code className="text-xs bg-slate-100 px-2 py-1 rounded">social</code>
              </div>
            </div>

            <div className="p-6 bg-card border border-border rounded-2xl">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-3">
                <span className="text-indigo-600">3.</span> utm_campaign (Required)
              </h3>
              <p className="text-muted-foreground"><strong>What it tracks:</strong> The specific campaign, promotion, or initiative that the link belongs to.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <code className="text-xs bg-slate-100 px-2 py-1 rounded">spring_sale_2026</code>
                <code className="text-xs bg-slate-100 px-2 py-1 rounded">product_launch</code>
              </div>
            </div>

            <div className="p-6 bg-card border border-border rounded-2xl">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-3">
                <span className="text-indigo-600">4.</span> utm_term (Optional)
              </h3>
              <p className="text-muted-foreground"><strong>What it tracks:</strong> The keyword that triggered a paid search ad. Used primarily for PPC.</p>
            </div>

            <div className="p-6 bg-card border border-border rounded-2xl">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-3">
                <span className="text-indigo-600">5.</span> utm_content (Optional)
              </h3>
              <p className="text-muted-foreground"><strong>What it tracks:</strong> The specific piece of content or creative that was clicked — useful for A/B testing variations.</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">How to Build a UTM-Tagged URL</h2>
          <p>
            Manually typing UTM parameters into URLs is error-prone. A missing <code>&amp;</code>, a capital letter where there shouldn&apos;t be one, or a space in a value can break your tracking or create fragmented data in your reports.
          </p>
          <p>The smarter approach is to use a UTM builder tool.</p>
          <p>
            <strong><Link href="/utility/utm-builder" className="text-indigo-600 font-bold underline">Use the free UTM Builder at findbest.tools</Link></strong> to generate properly formatted, error-free UTM URLs in seconds. Just enter your destination URL and fill in the parameters — the tool builds the complete tracking URL for you.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">UTM Parameters Best Practices</h2>
          <div className="grid gap-6 my-8">
            <div className="border-l-4 border-emerald-500 pl-6">
              <h4 className="font-bold mb-2">Always Use Lowercase</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">UTM parameters are case-sensitive. &quot;Facebook&quot; and &quot;facebook&quot; are separate. Standardize on lowercase.</p>
            </div>
            <div className="border-l-4 border-emerald-500 pl-6">
              <h4 className="font-bold mb-2">Never Use Spaces</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">Spaces break URLs. Use underscores (<code>_</code>) or hyphens (<code>-</code>) instead.</p>
            </div>
            <div className="border-l-4 border-emerald-500 pl-6">
              <h4 className="font-bold mb-2">Don&apos;t Tag Internal Links</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">Never tag links inside your site. It resets sessions and destroys attribution accuracy.</p>
            </div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-20 mb-12">
          <h2 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-12">Common UTM Questions</h2>
          <div className="grid gap-6">
            {faq.map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <h4 className="text-lg font-bold text-foreground mb-3">{item.question}</h4>
                <p className="m-0 text-muted-foreground leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-20 p-10 bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 rounded-[2rem] text-center">
          <h2 className="text-3xl font-bold mb-4">Start Tracking Your Campaigns</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
            Ready to build your first tracking URL? Use our free tool to generate clean, validated UTM links.
          </p>
          <Link 
            href="/utility/utm-builder" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-500/20"
          >
            Open UTM Builder →
          </Link>
        </div>
      </div>
    </div>
  );
}
