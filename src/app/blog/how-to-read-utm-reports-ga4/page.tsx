import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";

const PAGE_PATH = "/blog/how-to-read-utm-reports-ga4";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "How to Read UTM Reports in GA4 (Step-by-Step Guide)",
  description: "Stop guessing and start measuring. Learn exactly where to find your UTM campaign data in Google Analytics 4, how to interpret metrics, and how to build custom exploration reports.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "How to Read UTM Reports in GA4 (Step-by-Step Guide)",
    description: "Master GA4 campaign reporting. Learn to navigate Traffic Acquisition, find utm_content data, and use Explorations to measure your marketing ROI.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "Where is the UTM campaign report in GA4?",
    answer: "Go to Reports > Acquisition > Traffic Acquisition. Then, click the dimension dropdown (usually defaults to 'Session default channel group') and select 'Session campaign'. This will display a breakdown of all your UTM-tagged campaigns.",
  },
  {
    question: "What is the difference between Traffic Acquisition and User Acquisition?",
    answer: "Traffic Acquisition shows the source of the current session. User Acquisition shows the source that brought the user to your site for the very first time. For tracking specific campaign ROI, Traffic Acquisition is generally the most useful.",
  },
  {
    question: "How do I see 'utm_content' data in GA4?",
    answer: "It is not shown by default. You can find it by adding a secondary dimension (click the '+' icon) called 'Session manual ad content', or by creating a custom report in the 'Explore' section.",
  },
  {
    question: "Why do some of my campaigns show as '(not set)'?",
    answer: "This often occurs when UTM parameters are partially missing or when a URL redirect strips the query parameters before they reach your site. Always test your links to ensure the parameters remain visible in the browser address bar after landing.",
  },
];

export default function ReadUtmReportsBlogPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Read UTM Reports GA4", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">GA4 Reporting</li>
          </ol>
        </nav>
        
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold uppercase tracking-wider">
            Tutorial · Google Analytics 4
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            How to Read UTM Reports in Google Analytics 4 (Step-by-Step)
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            You&apos;ve tagged your links, now learn to find the data. A complete walkthrough for navigating GA4 and interpreting your campaign results.
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
            You&apos;ve been tagging your campaign links with UTM parameters. Traffic is flowing. Data is being collected. Now what? Many marketers struggle to find their data in GA4&apos;s new interface. This guide is a step-by-step walkthrough for reading and interpreting UTM reports in Google Analytics 4.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">The 3 Primary Reports for UTM Data</h2>
          
          <div className="grid gap-8">
            <div className="p-8 bg-card border border-border rounded-3xl">
              <h3 className="text-xl font-bold mb-4">1. Traffic Acquisition (Most Important)</h3>
              <p className="mb-4">Found at <strong>Reports &gt; Acquisition &gt; Traffic Acquisition</strong>. This report shows you which campaigns drove sessions and conversions today.</p>
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-border text-sm italic">
                Pro Tip: Change the primary dimension to &quot;Session source/medium&quot; or &quot;Session campaign&quot; to see your UTM data.
              </div>
            </div>

            <div className="p-8 bg-card border border-border rounded-3xl">
              <h3 className="text-xl font-bold mb-4">2. User Acquisition</h3>
              <p>Attributes data to the <strong>first-touch source</strong>. Use this when you want to know which campaigns are bringing in brand-new users versus returning visitors.</p>
            </div>

            <div className="p-8 bg-card border border-border rounded-3xl">
              <h3 className="text-xl font-bold mb-4">3. Explorations (Custom Reports)</h3>
              <p>For detailed analysis like <code>utm_content</code> or <code>utm_term</code>, you&apos;ll need the Explore section. This allows you to build custom tables with exactly the dimensions you need.</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Step-by-Step: Analyzing a Specific Campaign</h2>
          <ol className="space-y-6">
            <li>
              <strong>Go to Traffic Acquisition:</strong> Navigate to Reports &gt; Acquisition &gt; Traffic Acquisition.
            </li>
            <li>
              <strong>Change Dimension:</strong> Click the dropdown and select <strong>&quot;Session campaign&quot;</strong>.
            </li>
            <li>
              <strong>Search:</strong> Use the search bar to find your specific UTM campaign name (e.g., <code>newsletter_apr2026</code>).
            </li>
            <li>
              <strong>Analyze Metrics:</strong> Look at <em>Engaged Sessions</em>, <em>Engagement Rate</em>, and <em>Conversions</em> to judge success.
            </li>
          </ol>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Understanding Content Performance (utm_content)</h2>
          <p>
            To see how different links performed within the same email, add a secondary dimension to your report. Click the <strong>&quot;+&quot;</strong> icon next to the dimension dropdown and search for <strong>&quot;Session manual ad content&quot;</strong>. This will reveal your <code>utm_content</code> values.
          </p>
        </section>

        <section className="mb-12 bg-orange-50 dark:bg-orange-500/5 border border-orange-100 dark:border-orange-500/20 p-8 rounded-3xl">
          <h2 className="text-2xl font-bold mb-4 text-orange-900 dark:text-orange-400">Monthly Reporting Checklist</h2>
          <ul className="space-y-2 list-none p-0 text-sm">
            <li>✓ Top 5 campaigns by Sessions</li>
            <li>✓ Top 5 campaigns by Conversions</li>
            <li>✓ Comparison of Source/Medium performance (e.g., Email vs Social)</li>
            <li>✓ Identification of &quot;(not set)&quot; traffic to fix tracking gaps</li>
          </ul>
        </section>

        <section id="faq" className="scroll-mt-20 mb-12 border-t border-border pt-12">
          <h2 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-12">GA4 UTM Reporting FAQ</h2>
          <div className="grid gap-6">
            {faq.map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6">
                <h4 className="text-lg font-bold text-foreground mb-3">{item.question}</h4>
                <p className="m-0 text-muted-foreground leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-20 p-10 bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-[2rem] text-center">
          <h2 className="text-3xl font-bold mb-4">Optimize Your Campaigns with Data</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
            Data only works if you can find it. Use our free tool to generate clean, validated UTM links and make your GA4 reports crystal clear.
          </p>
          <Link 
            href="/utility/utm-builder" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-orange-600 text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-orange-500/20"
          >
            Open UTM Builder →
          </Link>
        </div>
      </div>
    </div>
  );
}
