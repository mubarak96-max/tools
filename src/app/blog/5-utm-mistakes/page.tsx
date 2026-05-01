import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";

const PAGE_PATH = "/blog/5-utm-mistakes";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "5 UTM Mistakes Ruining Your Campaign Data (And How to Fix Them)",
  description: "Are you making these common UTM tracking errors? Learn how to fix inconsistent naming, internal link tagging, and manual typos to restore your analytics accuracy.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "5 UTM Mistakes Ruining Your Campaign Data (And How to Fix Them)",
    description: "Inaccurate data leads to bad budget decisions. Discover the 5 most common UTM tracking mistakes and how to fix them today.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "Can I use UTMs for internal link tracking?",
    answer: "No. This is one of the most common mistakes. Using UTMs on internal links resets the user's session and overwrites the original traffic source (like Google Ads), leading to broken attribution. Use Google Analytics Event tracking for internal clicks instead.",
  },
  {
    question: "What is the biggest UTM mistake marketers make?",
    answer: "Inconsistency. Using mixed cases (Facebook vs facebook) or multiple names for the same source (fb vs facebook) fragments your data and makes it impossible to see a clear picture of channel performance without manual cleanup.",
  },
  {
    question: "How do I know if my UTM tags are broken?",
    answer: "Check your 'Realtime' report in GA4. If you click a tagged link and it doesn't show the correct source/medium, or if it shows as '(not set)', there is likely a typo in your parameter keys (e.g., 'utm_souce' instead of 'utm_source').",
  },
  {
    question: "Why does my UTM traffic show up as 'Direct' in GA4?",
    answer: "This usually happens when you forget to tag links in channels that don't pass referral data reliably, such as email newsletters, mobile apps (like Slack or WhatsApp), or social media bio links.",
  },
];

export default function UtmMistakesBlogPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "5 UTM Mistakes", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">Common Mistakes</li>
          </ol>
        </nav>
        
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-xs font-bold uppercase tracking-wider">
            Critical · Data Hygiene
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            5 UTM Mistakes That Are Ruining Your Campaign Data
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Inaccurate data leads to expensive mistakes. Learn the five subtle errors that sabotage your marketing analytics and how to fix them.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium pt-2">
            <span>12 min read</span>
            <span>•</span>
            <span>Published May 2026</span>
          </div>
        </div>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <section className="mb-12">
          <p className="lead text-lg text-muted-foreground">
            UTM tracking is one of the most valuable things a marketer can implement. And yet, most teams are doing it wrong — not because they don&apos;t care, but because the mistakes are subtle, easy to make, and often invisible until the damage is already done.
          </p>
          <p>
            By the time you realize your campaign data is unreliable, you may have already made budget decisions, channel reallocations, or strategy pivots based on numbers that don&apos;t reflect reality.
          </p>
        </section>

        <section className="mb-12 border-l-4 border-rose-500 pl-8 py-2">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Mistake #1: Inconsistent Naming (The Silent Data Killer)</h2>
          <p>
            If your GA4 report shows <code>facebook / paid_social</code>, <code>Facebook / Paid_Social</code>, and <code>fb / social</code> as separate rows, your data is fragmented. You undercount channel performance and make budget decisions based on incomplete numbers.
          </p>
          <p className="font-bold text-rose-600 dark:text-rose-400 mt-4">The Fix:</p>
          <p>Standardize on lowercase values, avoid spaces, and use a centralized builder like our <strong><Link href="/utility/utm-builder" className="underline decoration-rose-500/30 hover:decoration-rose-500">UTM Builder Tool</Link></strong> to enforce consistency.</p>
        </section>

        <section className="mb-12 border-l-4 border-rose-500 pl-8 py-2">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Mistake #2: Tagging Internal Links (Session Hijacking)</h2>
          <p>
            Adding UTMs to links within your own site resets the user session. This overwrites the original source (e.g., Google Ads) mid-visit, destroying your attribution and making ROI reporting impossible.
          </p>
          <p className="font-bold text-rose-600 dark:text-rose-400 mt-4">The Fix:</p>
          <p>Remove all internal UTM tags immediately. Use Google Analytics 4 Events or GTM click tracking to measure internal interactions instead.</p>
        </section>

        <section className="mb-12 border-l-4 border-rose-500 pl-8 py-2">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Mistake #3: Not Tagging Everything (Partial Tracking)</h2>
          <p>
            If you only tag paid ads, your email newsletters, social bio links, and guest posts will appear as &quot;Direct&quot; traffic. This results in huge undercounting of organic channel performance.
          </p>
          <p className="font-bold text-rose-600 dark:text-rose-400 mt-4">The Fix:</p>
          <p>Implement a tagging checklist for every channel, including bio links, YouTube descriptions, and podcast show notes.</p>
        </section>

        <section className="mb-12 border-l-4 border-rose-500 pl-8 py-2">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Mistake #4: Using Vague Campaign Names</h2>
          <p>
            Entries like <code>promo</code> or <code>launch</code> tell you nothing months later. Which product? Which season? Which year?
          </p>
          <p className="font-bold text-rose-600 dark:text-rose-400 mt-4">The Fix:</p>
          <p>Use a date-based descriptive format: <code>[type]_[desc]_[month][year]</code>. Example: <code>email_spring_sale_apr2026</code>.</p>
        </section>

        <section className="mb-12 border-l-4 border-rose-500 pl-8 py-2">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Mistake #5: Building UTM URLs Manually</h2>
          <p>
            Manual typing invites human error. Typos like <code>utm_souce</code> (missing &apos;r&apos;) break tracking entirely, and these errors are nearly impossible to catch in long URL strings.
          </p>
          <p className="font-bold text-rose-600 dark:text-rose-400 mt-4">The Fix:</p>
          <p>Mandate the use of a validated UTM generator. <strong><Link href="/utility/utm-builder" className="underline decoration-rose-500/30 hover:decoration-rose-500">UTM Builder Tool</Link></strong> handles the formatting and prevents parameter typos automatically.</p>
        </section>

        <section className="mb-12 bg-slate-50 dark:bg-slate-900 border border-border p-8 rounded-3xl">
          <h2 className="text-2xl font-bold mb-4 text-foreground text-center">UTM Health Audit Checklist</h2>
          <ul className="space-y-4 list-none p-0">
            <li className="flex items-start gap-3">
              <span className="mt-1 w-5 h-5 rounded border border-border flex items-center justify-center text-[10px] text-primary">✔</span>
              <span>Check for capitalization inconsistencies in GA4 Source/Medium reports.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 w-5 h-5 rounded border border-border flex items-center justify-center text-[10px] text-primary">✔</span>
              <span>Verify your direct traffic volume isn&apos;t artificially high (30%+).</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 w-5 h-5 rounded border border-border flex items-center justify-center text-[10px] text-primary">✔</span>
              <span>Search your CMS/codebase for any internal links containing <code>utm_</code>.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 w-5 h-5 rounded border border-border flex items-center justify-center text-[10px] text-primary">✔</span>
              <span>Ensure every link in your bio and signatures is tagged.</span>
            </li>
          </ul>
        </section>

        <section id="faq" className="scroll-mt-20 mb-12 border-t border-border pt-12">
          <h2 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-12">Common UTM Mistakes FAQ</h2>
          <div className="grid gap-6">
            {faq.map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h4 className="text-lg font-bold text-foreground mb-3">{item.question}</h4>
                <p className="m-0 text-muted-foreground leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-20 p-10 bg-gradient-to-br from-rose-500/10 to-transparent border border-rose-500/20 rounded-[2rem] text-center">
          <h2 className="text-3xl font-bold mb-4">Fix Your Tracking Today</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
            Don&apos;t let typos and inconsistent naming ruin your reports. Use our free tool to generate clean, validated UTM links.
          </p>
          <Link 
            href="/utility/utm-builder" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-rose-600 text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-rose-500/20"
          >
            Open UTM Builder →
          </Link>
        </div>
      </div>
    </div>
  );
}
