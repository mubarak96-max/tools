import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";

const PAGE_PATH = "/blog/utm-naming-conventions";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "UTM Naming Conventions: The One Rule for Clean Analytics",
  description: "Stop data fragmentation in Google Analytics. Learn how to build a UTM naming convention that keeps your campaign tracking organized, reliable, and actionable.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "UTM Naming Conventions: The One Rule for Clean Analytics",
    description: "Messy UTM data ruins reports. Learn the simple naming convention rules that ensure your campaign data is always clean and accurate.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "Why should I use underscores instead of spaces in UTMs?",
    answer: "Spaces in URLs are encoded as %20 or +, which can be handled inconsistently by different browsers, platforms, and analytics tools. Underscores (_) or hyphens (-) are standard URL-safe characters that ensure your values are read correctly everywhere.",
  },
  {
    question: "Are UTM parameters case-sensitive?",
    answer: "Yes. Google Analytics treats 'Email', 'email', and 'EMAIL' as three completely different mediums. This is why a 'lowercase only' rule is the single most important part of any naming convention.",
  },
  {
    question: "How do I fix historical messy UTM data?",
    answer: "You can't change data already collected in Google Analytics, but you can use 'Custom Channel Groupings' in GA4 to map inconsistent values (like 'fb' and 'facebook') into a single bucket for your reports.",
  },
  {
    question: "What is the best format for campaign names?",
    answer: "A common and effective format is [type]_[description]_[date], such as 'email_summer_sale_june2026'. This ensures the campaign is easily identifiable and sortable in your reports even months later.",
  },
];

export default function UtmNamingConventionsBlogPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "UTM Naming Conventions", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">Naming Conventions</li>
          </ol>
        </nav>
        
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-wider">
            Strategy · Data Quality
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            UTM Naming Conventions: The One Rule That Keeps Your Analytics Clean
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Stop data fragmentation from ruining your reports. Learn how to build a rock-solid tracking system for your entire team.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium pt-2">
            <span>10 min read</span>
            <span>•</span>
            <span>Published May 2026</span>
          </div>
        </div>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <section className="mb-12">
          <p className="lead text-lg text-muted-foreground">
            You&apos;ve set up UTM tracking. Your team is tagging links. The data is flowing into Google Analytics. And then you open your campaign report and see five different rows for the same email campaign because of inconsistent spelling and capitalization.
          </p>
          <p>
            This is the UTM naming convention problem — and it quietly ruins analytics for thousands of marketing teams every single day. This guide will show you how to fix it, prevent it, and build a system that keeps your campaign data clean no matter how many people are building links.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Why Naming Conventions Matter More Than You Think</h2>
          <p>
            UTM parameters are <strong>case-sensitive</strong> and <strong>exact-match</strong>. Your analytics platform doesn&apos;t know that <code>Facebook</code> and <code>facebook</code> are the same thing. It treats them as two completely different traffic sources.
          </p>
          <p>When your data is fragmented, you undercount channel performance, make budget decisions based on incomplete numbers, and your attribution models break down. The fix isn&apos;t technical; it&apos;s organizational.</p>
        </section>

        <section className="mb-12 bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/20 p-8 rounded-3xl">
          <h2 className="text-2xl font-bold mb-4 text-emerald-900 dark:text-emerald-400">The One Rule: Always Lowercase, Always Consistent</h2>
          <p className="text-emerald-800 dark:text-emerald-300 mb-6">
            If you implement nothing else from this guide, implement this: <strong>Every UTM parameter value must be lowercase, with no spaces, and spelled the same way every time.</strong>
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white/50 dark:bg-white/5 p-4 rounded-xl border border-emerald-200/50">
              <p className="text-xs font-bold uppercase text-rose-500 mb-2">❌ Avoid</p>
              <code className="text-sm block">utm_source=Facebook</code>
              <code className="text-sm block">utm_medium=Paid Social</code>
            </div>
            <div className="bg-white/50 dark:bg-white/5 p-4 rounded-xl border border-emerald-200/50">
              <p className="text-xs font-bold uppercase text-emerald-500 mb-2">✅ Standardize</p>
              <code className="text-sm block">utm_source=facebook</code>
              <code className="text-sm block">utm_medium=paid_social</code>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Step 1: Define Your Standard Values</h2>
          <p>Start by listing every possible value you&apos;ll use for <code>utm_source</code> and <code>utm_medium</code>. These should be finite, controlled lists — not freeform fields.</p>
          
          <div className="overflow-x-auto my-8 border border-border rounded-2xl">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-bold text-foreground">Channel Type</th>
                  <th className="px-6 py-4 font-bold text-foreground">Standard Medium Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr><td className="px-6 py-3">Paid Search</td><td className="px-6 py-3"><code>cpc</code></td></tr>
                <tr><td className="px-6 py-3">Paid Social</td><td className="px-6 py-3"><code>paid_social</code></td></tr>
                <tr><td className="px-6 py-3">Organic Social</td><td className="px-6 py-3"><code>social</code></td></tr>
                <tr><td className="px-6 py-3">Email Marketing</td><td className="px-6 py-3"><code>email</code></td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Step 2: Establish a Campaign Naming Format</h2>
          <p>Campaign names are where the most inconsistency happens. A good format balances being descriptive with being readable.</p>
          <div className="bg-card border border-border p-6 rounded-2xl my-6">
            <p className="font-bold mb-2">Recommended Format:</p>
            <code className="text-lg text-primary">[type]_[description]_[month][year]</code>
            <p className="mt-4 text-sm text-muted-foreground">Example: <code>email_welcome_series_jan2026</code></p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Step 3: Document in a Style Guide</h2>
          <p>Write your rules down. A UTM style guide should include your core rules, approved source/medium values, and examples of correct vs incorrect usage. Keep this document central and mandatory for all team members.</p>
        </section>

        <section className="mb-12 bg-slate-900 text-slate-300 p-8 rounded-3xl">
          <h2 className="text-2xl font-bold text-white mb-6">UTM Naming Convention Template</h2>
          <pre className="text-xs sm:text-sm font-mono leading-relaxed bg-slate-800/50 p-6 rounded-xl border border-slate-700 overflow-x-auto">
{`UTM NAMING CONVENTION — [COMPANY NAME]

CORE RULE: All UTM values must be lowercase, no spaces.

APPROVED SOURCES:
- google (Google Ads)
- facebook (Facebook Ads)
- newsletter (Email list)

APPROVED MEDIUMS:
- cpc (Paid search)
- paid_social (Paid social ads)
- social (Organic posts)
- email (Email campaigns)

CAMPAIGN FORMAT: [type]_[desc]_[date]
Example: email_promo_may2026`}
          </pre>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">How to Enforce Conventions</h2>
          <p>Documentation helps, but it doesn&apos;t prevent every mistake. Use a centralized builder like our <strong><Link href="/utility/utm-builder" className="text-primary font-bold underline">Free UTM Builder Tool</Link></strong> to ensure everyone starts from the same clean foundation.</p>
          <p>Additionally, create a pre-launch checklist for campaigns that requires a UTM audit before any link goes live.</p>
        </section>

        <section id="faq" className="scroll-mt-20 mb-12 border-t border-border pt-12">
          <h2 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-12">Frequently Asked Questions</h2>
          <div className="grid gap-6">
            {faq.map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6">
                <h4 className="text-lg font-bold text-foreground mb-3">{item.question}</h4>
                <p className="m-0 text-muted-foreground leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-20 p-10 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-[2rem] text-center">
          <h2 className="text-3xl font-bold mb-4">Build Clean Tracking Links</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
            Ready to implement your naming convention? Use our free tool to generate clean, validated UTM links for your team.
          </p>
          <Link 
            href="/utility/utm-builder" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
          >
            Go to UTM Builder →
          </Link>
        </div>
      </div>
    </div>
  );
}
