import Link from "next/link";
import { AuthorSection } from "@/components/blog/AuthorSection";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";

const PAGE_PATH = "/blog/read-utm-reports-ga4";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "How to Read UTM Reports in Google Analytics 4 (Step-by-Step)",
  description: "Learn where to find and how to interpret UTM campaign data in GA4. Master Traffic Acquisition, Explorations, and Attribution reports to measure marketing ROI.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "How to Read UTM Reports in Google Analytics 4 (Step-by-Step)",
    description: "A complete walkthrough for analyzing UTM tracking in GA4. Turn your campaign data into actionable marketing insights.",
    url: PAGE_URL,
    type: "article",
  },
};

export default function ReadUtmReportsGa4BlogPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Read UTM Reports GA4", path: PAGE_PATH },
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <JsonLd data={serializeJsonLd(breadcrumbs)} />

      <header className="mb-16">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-500 mb-8 uppercase tracking-widest font-bold">
          <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <Link href="/blog" className="hover:text-amber-600 transition-colors">Blog</Link>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span className="text-slate-900 dark:text-slate-100 uppercase tracking-widest font-black text-[10px]">Analytics Guide</span>
        </nav>
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-black uppercase tracking-widest">
            Advanced · Google Analytics 4
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
            How to Read UTM Reports in Google Analytics 4 (Step-by-Step)
          </h1>
          <div className="pt-4">
            <AuthorSection />
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 ml-1">
              Published May 2026
            </div>
          </div>
        </div>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <section className="mb-12">
          <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            You&apos;ve been tagging your campaign links with UTM parameters. Traffic is flowing. Data is being collected.
          </p>
          <p className="text-2xl font-black text-slate-900 dark:text-white my-10">Now what?</p>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            A lot of marketers set up UTM tracking and then don&apos;t know where to find the data in GA4 — or they find it, but can&apos;t interpret it correctly. GA4&apos;s reporting structure is significantly different from Universal Analytics, and even experienced marketers find it confusing at first.
          </p>
          <p>
            This guide is a complete, step-by-step walkthrough for reading UTM reports in Google Analytics 4. You&apos;ll know exactly where to look for your campaign data, how to interpret what you see, and how to use it to make better marketing decisions.
          </p>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Before You Start: Make Sure Your Links Are Tagged</h2>
          <p className="mb-8">This guide assumes you&apos;re already tagging your campaign links with UTM parameters. If you&apos;re not yet, head to <strong><Link href="/utility/utm-builder" className="text-amber-600 underline underline-offset-4 decoration-2">findbest.tools/utility/utm-builder</Link></strong> to generate properly formatted UTM URLs in seconds.</p>
          <p className="p-8 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-3xl text-sm leading-relaxed text-amber-900 dark:text-amber-200 font-medium">
            The reports in this guide only show useful data if your campaign links have <code>utm_source</code>, <code>utm_medium</code>, and <code>utm_campaign</code> parameters attached. Without them, traffic arrives as &quot;direct / none&quot; with no campaign context.
          </p>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">How GA4 Processes UTM Parameters</h2>
          <p className="mb-8">When someone clicks a UTM-tagged link and arrives on your site, GA4 captures the UTM parameter values and stores them against that session. Specifically:</p>
          
          <ul className="grid gap-4 list-none p-0 mb-10 text-sm font-mono text-amber-600 dark:text-amber-400">
            <li className="flex gap-4 items-center"><span className="w-2 h-2 rounded-full bg-amber-500" /> utm_source → stored as <strong>session source</strong></li>
            <li className="flex gap-4 items-center"><span className="w-2 h-2 rounded-full bg-amber-500" /> utm_medium → stored as <strong>session medium</strong></li>
            <li className="flex gap-4 items-center"><span className="w-2 h-2 rounded-full bg-amber-500" /> utm_campaign → stored as <strong>session campaign</strong></li>
            <li className="flex gap-4 items-center"><span className="w-2 h-2 rounded-full bg-amber-500" /> utm_content → stored as <strong>session manual ad content</strong></li>
            <li className="flex gap-4 items-center"><span className="w-2 h-2 rounded-full bg-amber-500" /> utm_term → stored as <strong>session manual term</strong></li>
          </ul>
          
          <p>One important thing to understand: GA4 uses a <strong>session-scoped</strong> attribution model for UTM parameters. This means the UTM data is attributed to the session, not to individual events within the session. The user&apos;s first touch in a session determines the session&apos;s source/medium.</p>
          <p className="italic text-slate-500">This matters for how you interpret campaign data — we&apos;ll cover this more in the section on attribution.</p>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-12 tracking-tight">The 3 Primary Reports for UTM Data</h2>
          
          <div className="space-y-12">
            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <h3 className="text-xl font-black mb-2">Report 1: Traffic Acquisition (The Starting Point)</h3>
              <p className="font-bold text-xs uppercase tracking-widest text-amber-600 mb-6">Where to find it: Reports → Acquisition → Traffic Acquisition</p>
              <p className="mb-6">This is the most important report for UTM data. It shows you a breakdown of all sessions, broken down by their source — and it respects your UTM parameters.</p>
              
              <p className="font-bold text-slate-900 dark:text-white mb-2">Default view:</p>
              <p className="mb-6">By default, the primary dimension is &quot;Session default channel group&quot; — GA4&apos;s automatic channel categorization (Organic Search, Direct, Email, Paid Social, etc.).</p>
              
              <p className="font-bold text-slate-900 dark:text-white mb-2">For UTM analysis, change the dimension:</p>
              <p className="mb-6">Click the blue dimension dropdown at the top of the table. You have several options:</p>
              <ul className="grid gap-2 list-none p-0 text-sm font-medium mb-10">
                <li>• <strong>Session source/medium</strong> → Shows <code>google / cpc</code>, <code>newsletter / email</code>, <code>facebook / paid_social</code></li>
                <li>• <strong>Session source</strong> → Shows only the source (<code>google</code>, <code>newsletter</code>, <code>facebook</code>)</li>
                <li>• <strong>Session medium</strong> → Shows only the medium (<code>cpc</code>, <code>email</code>, <code>paid_social</code>)</li>
                <li>• <strong>Session campaign</strong> → Shows your <code>utm_campaign</code> values</li>
                <li>• <strong>Session default channel group</strong> → GA4&apos;s automatic grouping (useful for sanity checking)</li>
              </ul>
              
              <p className="font-bold text-slate-900 dark:text-white mb-4">Recommended starting view for campaign analysis:</p>
              <p className="mb-10">Switch to &quot;Session source/medium&quot; first. This gives you the full picture: which platform + which type of traffic combination is sending you visitors.</p>
              
              <p className="font-bold text-slate-900 dark:text-white mb-4">What the metrics mean:</p>
              <ul className="grid gap-3 list-none p-0 text-sm text-slate-600 dark:text-slate-400">
                <li>• <strong>Sessions</strong> — Total number of sessions initiated by each source/medium</li>
                <li>• <strong>Engaged sessions</strong> — Sessions where the user was active for 10+ seconds, converted, or viewed 2+ pages</li>
                <li>• <strong>Engagement rate</strong> — Engaged sessions ÷ total sessions (replaces bounce rate in GA4)</li>
                <li>• <strong>Engaged sessions per user</strong> — Average engagement depth per user</li>
                <li>• <strong>Average engagement time</strong> — How long users were actively engaged per session</li>
                <li>• <strong>Event count</strong> — Total events triggered (page views, clicks, form fills, etc.)</li>
                <li>• <strong>Conversions</strong> — Sessions that resulted in a conversion event</li>
                <li>• <strong>Total revenue</strong> (if ecommerce is set up) — Revenue attributed to each source</li>
              </ul>
            </div>

            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <h3 className="text-xl font-black mb-2">Report 2: User Acquisition</h3>
              <p className="font-bold text-xs uppercase tracking-widest text-amber-600 mb-6">Where to find it: Reports → Acquisition → User Acquisition</p>
              <p className="mb-6 leading-relaxed">User Acquisition differs from Traffic Acquisition in a subtle but important way: it attributes data to the <strong>first-touch source</strong> — meaning the source that brought the user to your site for the very first time, ever.</p>
              <p className="mb-6 leading-relaxed">Traffic Acquisition attributes to the <strong>session source</strong> — the source that brought the user in for a particular session.</p>
              
              <div className="p-8 bg-white dark:bg-black/40 rounded-3xl border border-slate-200 dark:border-slate-800 mb-6">
                <p className="font-bold mb-4 uppercase tracking-widest text-[10px]">When to use each:</p>
                <p className="text-sm leading-relaxed mb-4">Use <strong>Traffic Acquisition</strong> when you want to know which campaigns are driving sessions and conversions now — across all return visits.</p>
                <p className="text-sm leading-relaxed m-0">Use <strong>User Acquisition</strong> when you want to know which channels are bringing in *new users* — useful for measuring the top-of-funnel reach of campaigns.</p>
              </div>
              <p className="m-0 text-xs italic opacity-60 font-medium">For most campaign analysis, Traffic Acquisition is more directly useful. User Acquisition is better for understanding your acquisition channels at a growth/funnel level.</p>
            </div>

            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <h3 className="text-xl font-black mb-2 text-slate-400">Report 3: Advertising → Traffic Acquisition (with Google Ads)</h3>
              <p className="m-0 leading-relaxed text-sm text-slate-500 italic">If you&apos;re running Google Ads, there&apos;s a separate Advertising section in GA4 that gives you more granular paid traffic analysis. This is outside the scope of UTM parameters, but worth knowing about for paid search attribution.</p>
            </div>
          </div>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-12 tracking-tight">Step-by-Step: Analyzing a Specific Campaign</h2>
          <p className="mb-10 text-lg leading-relaxed">Let&apos;s walk through analyzing the performance of a specific UTM campaign from start to finish.</p>
          <p className="p-6 bg-amber-500 text-white rounded-3xl font-bold mb-12 text-center shadow-xl shadow-amber-500/20">Scenario: You ran an email newsletter campaign in April 2026 with the UTM campaign name newsletter_product_launch_apr2026. You want to know how it performed.</p>
          
          <div className="space-y-12">
            {[
              { t: "Step 1: Go to Traffic Acquisition", d: "Reports → Acquisition → Traffic Acquisition" },
              { t: "Step 2: Change the Dimension to Session Campaign", d: "Click the blue dimension dropdown and select &quot;Session campaign.&quot; Find <code>newsletter_product_launch_apr2026</code> in the list." },
              { t: "Step 3: Set the Date Range", d: "In the top right corner, click the date range selector and set it to cover the period when your campaign was active (e.g., April 1–30, 2026)." },
              { t: "Step 4: Read the Campaign Row", d: "For your campaign row, you&apos;ll see: <strong>Sessions</strong>, <strong>Engaged sessions</strong>, <strong>Engagement rate</strong> (good benchmark: 50%+ is healthy), <strong>Average engagement time</strong> (good for email: 90+ seconds), and <strong>Conversions</strong>." },
              { t: "Step 5: Drill Down into Source/Medium", d: "To see how that campaign broke down by channel, add a secondary dimension. Click &quot;+&quot; next to the dimension dropdown and add &quot;Session source/medium&quot;. Now you can see, for example: <code>newsletter_product_launch_apr2026 | newsletter / email</code>." }
            ].map((step, i) => (
              <div key={i} className="flex gap-8 items-start">
                <span className="flex-shrink-0 w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black">{i+1}</span>
                <div>
                  <p className="text-xl font-black text-slate-900 dark:text-white mb-2">{step.t}</p>
                  <p className="text-slate-600 dark:text-slate-400 m-0 leading-relaxed" dangerouslySetInnerHTML={{ __html: step.d }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-12 tracking-tight">Step-by-Step: Comparing Multiple Campaigns</h2>
          <p className="mb-10 text-lg leading-relaxed">To compare campaigns side by side:</p>
          <ol className="grid gap-4 list-none p-0 mb-10 text-sm font-medium">
            <li className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 flex gap-4 items-center">
              <span className="text-amber-500 font-black">1.</span>
              <span>Traffic Acquisition → change dimension to Session campaign</span>
            </li>
            <li className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 flex gap-4 items-center">
              <span className="text-amber-500 font-black">2.</span>
              <span>Set your desired date range</span>
            </li>
            <li className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 flex gap-4 items-center">
              <span className="text-amber-500 font-black">3.</span>
              <span>Sort by Sessions (descending) to see highest-traffic campaigns first</span>
            </li>
            <li className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 flex gap-4 items-center">
              <span className="text-amber-500 font-black">4.</span>
              <span>Or sort by Conversions to see highest-converting campaigns</span>
            </li>
            <li className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 flex gap-4 items-center">
              <span className="text-amber-500 font-black">5.</span>
              <span>Click any campaign name to drill into it further</span>
            </li>
          </ol>
          <p className="mt-8 text-slate-600 dark:text-slate-400 italic"><strong>Pro tip:</strong> Use the search bar above the table to filter to a specific pattern. For example, type <code>email</code> to see only campaigns with &quot;email&quot; in the name — useful if you follow a consistent naming convention.</p>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-12 tracking-tight">Step-by-Step: Analyzing Content Performance (utm_content)</h2>
          <p className="mb-10">If you used <code>utm_content</code> to tag different links within an email or different ad creatives in a campaign, here&apos;s how to find that data.</p>
          
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="font-black text-slate-900 dark:text-white mb-4 uppercase tracking-widest text-[10px]">Method 1: Add Secondary Dimension</p>
              <ol className="list-decimal pl-4 space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <li>Traffic Acquisition → change dimension to Session campaign</li>
                <li>Find your campaign</li>
                <li>Add secondary dimension: &quot;Session manual ad content&quot;</li>
                <li>You&apos;ll see a breakdown of each <code>utm_content</code> value within that campaign</li>
              </ol>
            </div>
            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="font-black text-slate-900 dark:text-white mb-4 uppercase tracking-widest text-[10px]">Method 2: Explorations</p>
              <p className="mb-4 text-xs italic">For more detailed content analysis, use GA4 Explorations:</p>
              <ol className="list-decimal pl-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>Go to <strong>Explore</strong> (left sidebar) → Blank exploration</li>
                <li>Add dimensions: Session campaign + Session manual ad content</li>
                <li>Add metrics: Sessions + Conversions</li>
                <li>Drag dimensions to Rows and metrics to Values</li>
              </ol>
            </div>
          </div>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Step-by-Step: Finding Keyword Data (utm_term)</h2>
          <p className="mb-10">If you tagged paid search links with <code>utm_term</code>, you can find keyword performance data:</p>
          <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
            <ol className="list-decimal pl-6 space-y-2 text-sm leading-relaxed">
              <li>Traffic Acquisition</li>
              <li>Add secondary dimension: &quot;Session manual term&quot;</li>
              <li>This shows which keywords drove traffic, alongside their campaign context</li>
            </ol>
          </div>
          <p className="mt-8 text-sm italic opacity-60">This is especially useful for understanding which search terms are converting, not just which ones are driving clicks.</p>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Understanding GA4 Attribution Models</h2>
          <p className="mb-8 leading-relaxed">This is where a lot of marketers get confused. When a user visits your site multiple times before converting, which visit gets credit for the conversion?</p>
          <div className="p-10 bg-slate-900 rounded-[3rem] text-slate-300 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl -mr-24 -mt-24" />
            <p className="font-bold text-white mb-6">The attribution logic:</p>
            <p className="leading-relaxed mb-8">In GA4, the default attribution model for reports is <strong>data-driven attribution</strong> (for accounts with sufficient data) or <strong>last-click</strong> attribution. This means:</p>
            <ul className="list-disc pl-6 space-y-2 mb-10 text-sm italic">
              <li>The <strong>conversion</strong> is attributed to the last campaign that brought the user to the site before they converted</li>
              <li>If a user clicked an email link on Monday, came back via a Google search on Wednesday, and converted on Wednesday, the conversion is attributed to the Google search — not the email</li>
            </ul>
            <p className="m-0 font-black uppercase tracking-widest text-xs text-amber-500 mb-4">What this means for reading UTM reports:</p>
            <p className="leading-relaxed mb-10 text-sm">When you see &quot;conversions&quot; in the Traffic Acquisition report for a specific campaign, those are the conversions where that campaign was the last touchpoint before conversion. Your email campaign may have played an important role in the path even if it&apos;s not credited with the conversion.</p>
            <p className="m-0 font-black uppercase tracking-widest text-xs text-amber-500 mb-4">To see the full conversion path:</p>
            <p className="m-0 text-sm italic">Go to <strong>Advertising → Attribution → Conversion paths</strong>. This shows the multi-touch journey — including which campaigns appeared earlier in the path even if they weren&apos;t the last touch.</p>
          </div>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-12 tracking-tight">Key Metrics to Track for Each Channel</h2>
          <p className="mb-10 text-lg leading-relaxed">Different channels should be evaluated on different metrics. Here&apos;s a quick reference:</p>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-8 bg-card border border-border rounded-3xl">
              <h3 className="text-lg font-black mb-4 flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-sky-500" /> Email Campaigns</h3>
              <p className="text-sm mb-1 font-bold text-slate-500">Primary: Conversions, conversion rate</p>
              <p className="text-sm mb-4 text-slate-500">Secondary: Engaged sessions, average engagement time</p>
              <p className="text-sm m-0 italic text-rose-500 font-medium">Warning sign: Low engagement rate (&lt;40%) suggests poor email-to-landing-page relevance.</p>
            </div>
            <div className="p-8 bg-card border border-border rounded-3xl">
              <h3 className="text-lg font-black mb-4 flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-purple-500" /> Paid Social</h3>
              <p className="text-sm mb-1 font-bold text-slate-500">Primary: Conversions, cost per conversion</p>
              <p className="text-sm mb-4 text-slate-500">Secondary: Sessions, engagement rate</p>
              <p className="text-sm m-0 italic text-rose-500 font-medium">Warning sign: High sessions but low engagement rate suggests ad creative/landing page mismatch.</p>
            </div>
            <div className="p-8 bg-card border border-border rounded-3xl">
              <h3 className="text-lg font-black mb-4 flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Organic Social</h3>
              <p className="text-sm mb-1 font-bold text-slate-500">Primary: Sessions, engagement rate</p>
              <p className="text-sm mb-4 text-slate-500">Secondary: New users (check User Acquisition for this)</p>
              <p className="text-sm m-0 italic text-rose-500 font-medium">Warning sign: Very low average engagement time suggests people click and immediately leave.</p>
            </div>
            <div className="p-8 bg-card border border-border rounded-3xl">
              <h3 className="text-lg font-black mb-4 flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Paid Search</h3>
              <p className="text-sm mb-1 font-bold text-slate-500">Primary: Conversions, conversion rate</p>
              <p className="text-sm mb-4 text-slate-500">Secondary: Sessions, engagement rate per keyword</p>
              <p className="text-sm m-0 italic text-rose-500 font-medium">Warning sign: Low conversion rate from high-CPC keywords signals irrelevant traffic.</p>
            </div>
          </div>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Creating a Custom Campaign Dashboard</h2>
          <p className="mb-10">Instead of navigating to different reports every time, you can save a custom dashboard in GA4:</p>
          <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
            <ol className="list-decimal pl-6 space-y-4 text-sm font-medium leading-relaxed">
              <li>Go to Reports → Acquisition → Traffic Acquisition</li>
              <li>Set your preferred dimension (e.g., Session campaign)</li>
              <li>Customize the metrics columns to show your key metrics</li>
              <li>Click the star icon (☆) at the top right to add it to &quot;My Reports&quot;</li>
              <li>Name it something like &quot;Campaign UTM Performance&quot;</li>
            </ol>
          </div>
          <p className="mt-8 text-sm italic opacity-60">Now it&apos;s one click away every time you open GA4.</p>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-12 tracking-tight">Common GA4 UTM Reporting Questions</h2>
          <div className="grid gap-6">
            {[
              { q: "Why are some campaigns showing as \"(not set)\"?", a: "This happens when sessions arrive without a campaign UTM value but do have a source/medium. It can also occur when UTM parameters are present but get stripped by redirects. Check your tagged URLs to ensure the parameters survive any redirects." },
              { q: "Why does my data look different between Traffic Acquisition and Advertising?", a: "The Advertising section uses a different attribution model (last non-direct click with Ad platform data integration) compared to Traffic Acquisition's session-based attribution. Both are valid — they just answer different questions." },
              { q: "Why is \"Direct\" still showing high traffic even though I'm tagging everything?", a: "A few reasons: (1) You may have some untagged touchpoints (e.g., a bio link that hasn't been updated). (2) Bookmarked URLs never have UTMs. (3) Typed URLs are genuinely direct. Run an audit of all external links pointing to your site and ensure they're tagged." },
              { q: "My utm_content data isn't showing. Where is it?", a: "It's stored as \"Session manual ad content\" — you need to add this as a secondary dimension or use Explorations to see it. It doesn't appear in the default Traffic Acquisition columns." }
            ].map((faq, i) => (
              <div key={i} className="p-8 bg-card border border-border rounded-3xl shadow-sm">
                <p className="text-lg font-bold text-slate-900 dark:text-white mb-4 leading-tight">{faq.q}</p>
                <p className="m-0 text-sm leading-relaxed text-slate-600 dark:text-slate-400 pl-6 border-l-2 border-amber-500/30">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-12 tracking-tight">Monthly UTM Reporting Template</h2>
          <div className="bg-slate-950 p-10 rounded-[2.5rem] border border-slate-800 text-slate-300 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto shadow-2xl">
<pre className="m-0">
{`MONTHLY UTM CAMPAIGN REPORT — [Month Year]
==========================================

TOP CAMPAIGNS BY SESSIONS:
1. [Campaign name] — [Sessions] — [Engagement rate] — [Conversions]
2. [Campaign name] — [Sessions] — [Engagement rate] — [Conversions]
3. [Campaign name] — [Sessions] — [Engagement rate] — [Conversions]

TOP CAMPAIGNS BY CONVERSIONS:
1. [Campaign name] — [Conversions] — [Conversion rate]
2. [Campaign name] — [Conversions] — [Conversion rate]

CHANNEL BREAKDOWN (Session source/medium):
- email: [Sessions] / [Conversions]
- paid_social: [Sessions] / [Conversions]
- cpc: [Sessions] / [Conversions]
- social: [Sessions] / [Conversions]

NOTABLE FINDINGS:
[2-3 key observations from the data]

ACTION ITEMS:
[What will change next month based on this data]`}
</pre>
          </div>
          <p className="mt-8 text-center text-sm font-medium text-slate-500 italic">Fill this in monthly using GA4&apos;s Traffic Acquisition report. Over time, you&apos;ll have a clear, comparable record of campaign performance that informs planning.</p>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Putting It All Together</h2>
          <p className="mb-10 text-lg leading-relaxed">GA4&apos;s UTM reporting is powerful when you know where to look. The key reports are:</p>
          <div className="grid gap-4">
            {[
              "<strong>Traffic Acquisition</strong> → Session campaign for campaign comparison; Session source/medium for channel breakdown",
              "<strong>User Acquisition</strong> → For first-touch attribution and new user analysis",
              "<strong>Explorations</strong> → For custom, detailed breakdowns including utm_content analysis",
              "<strong>Attribution → Conversion Paths</strong> → For understanding multi-touch journeys"
            ].map((item, i) => (
              <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 flex gap-4 items-center">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-sm font-medium" dangerouslySetInnerHTML={{ __html: item }} />
              </div>
            ))}
          </div>
          <p className="mt-12 text-lg leading-relaxed">The data you see is only as good as your UTM tagging. If your links are consistently tagged using a tool like <strong><Link href="/utility/utm-builder" className="text-amber-600 underline underline-offset-4 decoration-2">findbest.tools/utility/utm-builder</Link></strong>, your GA4 reports will be clean, accurate, and genuinely useful for decision-making.</p>
          <p className="italic text-slate-500">If your tagging is inconsistent or incomplete, the reports will reflect that mess — and no amount of GA4 expertise will fix bad input data.</p>
        </section>

        <div className="mt-24 p-12 bg-amber-600 rounded-[3rem] text-center shadow-2xl relative overflow-hidden group border border-amber-500 shadow-amber-500/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="relative z-10">
            <h2 className="text-4xl font-black text-white mb-6 leading-tight tracking-tight">Start Reading Your Campaign Data Today</h2>
            <div className="max-w-2xl mx-auto space-y-6 text-amber-50 mb-12 font-bold text-left">
              <p className="flex gap-4 items-center"><span className="w-5 h-5 rounded-full bg-white text-amber-600 flex items-center justify-center text-[10px]">1</span> Open GA4</p>
              <p className="flex gap-4 items-center"><span className="w-5 h-5 rounded-full bg-white text-amber-600 flex items-center justify-center text-[10px]">2</span> Go to Reports → Acquisition → Traffic Acquisition</p>
              <p className="flex gap-4 items-center"><span className="w-5 h-5 rounded-full bg-white text-amber-600 flex items-center justify-center text-[10px]">3</span> Change the dimension to &quot;Session campaign&quot;</p>
              <p className="flex gap-4 items-center"><span className="w-5 h-5 rounded-full bg-white text-amber-600 flex items-center justify-center text-[10px]">4</span> Set your date range to the last 30 days</p>
              <p className="flex gap-4 items-center"><span className="w-5 h-5 rounded-full bg-white text-amber-600 flex items-center justify-center text-[10px]">5</span> See which campaigns have actually been driving your traffic</p>
            </div>
            <p className="text-white font-black text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
              What you find might surprise you. Build better UTM links at <Link href="/utility/utm-builder" className="underline decoration-2">findbest.tools/utility/utm-builder</Link> and start making decisions based on what&apos;s actually happening.
            </p>
            <Link 
              href="/utility/utm-builder" 
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-amber-600 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              Open UTM Builder &rarr;
            </Link>
            <div className="mt-12 pt-12 border-t border-amber-500 flex flex-col items-center gap-4">
              <p className="text-amber-200 text-xs font-bold uppercase tracking-widest">Start from the beginning</p>
              <Link 
                href="/blog/what-are-utm-parameters" 
                className="text-white font-black hover:text-amber-100 transition-colors underline underline-offset-8 decoration-2"
              >
                What Are UTM Parameters? A Beginner&apos;s Guide &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
