import Link from "next/link";
import { AuthorSection } from "@/components/blog/AuthorSection";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
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
    description: "Build a bulletproof UTM naming convention. Ensure your marketing reports are clean, consistent, and easy to analyze.",
    url: PAGE_URL,
    type: "article",
  },
};

export default function UtmNamingConventionsBlogPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "UTM Naming Conventions", path: PAGE_PATH },
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <JsonLd data={serializeJsonLd(breadcrumbs)} />

      <header className="mb-16">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-500 mb-8 uppercase tracking-widest font-bold">
          <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <Link href="/blog" className="hover:text-emerald-600 transition-colors">Blog</Link>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span className="text-slate-900 dark:text-slate-100">UTM Naming Conventions</span>
        </nav>
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-black uppercase tracking-widest">
            Advanced Tracking Guide
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
            UTM Naming Conventions: The One Rule That Keeps Your Analytics Clean
          </h1>
          <div className="pt-4">
            <AuthorSection />
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 ml-1">
              Published March 2026
            </div>
          </div>
        </div>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <section className="mb-12">
          <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            You&apos;ve set up UTM tracking. Your team is tagging links. The data is flowing into Google Analytics.
          </p>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            And then you open your campaign report and see this:
          </p>
          <div className="bg-rose-50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/10 p-6 rounded-2xl my-8 font-mono text-sm space-y-1 shadow-sm">
            <p className="m-0 text-slate-500">• <code>email</code></p>
            <p className="m-0 text-slate-500">• <code>Email</code></p>
            <p className="m-0 text-slate-500">• <code>E-Mail</code></p>
            <p className="m-0 text-slate-500">• <code>e_mail</code></p>
            <p className="m-0 text-slate-500">• <code>EMAIL</code></p>
          </div>
          <p>
            Five entries. Five different ways your team spelled the same thing. Five separate rows in your report, when there should be one.
          </p>
          <p>
            This is the UTM naming convention problem — and it quietly ruins analytics for thousands of marketing teams every single day. This guide will show you how to fix it, prevent it, and build a system that keeps your campaign data clean no matter how many people are building links.
          </p>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Why Naming Conventions Matter More Than You Think</h2>
          
          <p>UTM parameters are case-sensitive and exact-match. Your analytics platform doesn&apos;t know that <code>Facebook</code> and <code>facebook</code> are the same thing. It treats them as two completely different traffic sources.</p>
          
          <p className="font-bold text-slate-900 dark:text-white mt-8 mb-4">The consequences go beyond messy reports. When your data is fragmented:</p>
          
          <ul className="grid gap-3 list-none pl-0">
            <li className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 flex gap-4">
              <span className="text-emerald-500 font-black">•</span>
              <span>You undercount channel performance (because traffic is split across multiple entries)</span>
            </li>
            <li className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 flex gap-4">
              <span className="text-emerald-500 font-black">•</span>
              <span>You make budget decisions based on incomplete numbers</span>
            </li>
            <li className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 flex gap-4">
              <span className="text-emerald-500 font-black">•</span>
              <span>Attribution models break down</span>
            </li>
            <li className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 flex gap-4">
              <span className="text-emerald-500 font-black">•</span>
              <span>A/B test results become unreliable</span>
            </li>
            <li className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 flex gap-4">
              <span className="text-emerald-500 font-black">•</span>
              <span>You can&apos;t trust your own dashboards</span>
            </li>
          </ul>
          
          <p className="mt-8">The fix isn&apos;t technical. It&apos;s organizational. You need one shared system that every person on your team follows every time they build a UTM link.</p>
          <p>That system is a naming convention — and it starts with one rule.</p>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">The One Rule: Always Lowercase, Always Consistent</h2>
          
          <p>If you implement nothing else from this guide, implement this:</p>
          
          <div className="bg-emerald-600 p-8 rounded-3xl text-white shadow-xl shadow-emerald-500/20 my-12">
            <p className="text-xl font-bold leading-relaxed m-0 text-center">
              Every UTM parameter value must be lowercase, with no spaces, and spelled the same way every time.
            </p>
          </div>
          
          <p className="font-bold text-slate-900 dark:text-white mb-6">That means:</p>
          
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="m-0 text-rose-500 font-bold mb-2">❌ <code>utm_source=Facebook</code></p>
              <p className="m-0 text-emerald-500 font-bold">✅ <code>utm_source=facebook</code></p>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="m-0 text-rose-500 font-bold mb-2">❌ <code>utm_medium=Paid Social</code></p>
              <p className="m-0 text-emerald-500 font-bold">✅ <code>utm_medium=paid_social</code></p>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="m-0 text-rose-500 font-bold mb-2">❌ <code>utm_campaign=Summer Sale</code></p>
              <p className="m-0 text-emerald-500 font-bold">✅ <code>utm_campaign=summer_sale_2026</code></p>
            </div>
          </div>
          
          <p className="mt-8">This single rule eliminates the majority of UTM data quality problems. Everything else in this guide builds on top of it.</p>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-12 tracking-tight">Building Your UTM Naming Convention System</h2>
          
          <p>A naming convention is only useful if it&apos;s written down, shared, and enforced. Here&apos;s how to build one that actually works for your team.</p>

          <div className="space-y-16 mt-16">
            <div>
              <h3 className="text-xl font-black mb-6">Step 1: Define Your Standard Values for Each Parameter</h3>
              <p className="mb-8">Start by listing every possible value you&apos;ll use for <code>utm_source</code> and <code>utm_medium</code>. These should be finite, controlled lists — not freeform fields.</p>
              
              <p className="font-bold text-slate-900 dark:text-white mb-4">Recommended utm_source values:</p>
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm mb-10">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                  <thead className="bg-slate-50 dark:bg-slate-900/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Platform/Origin</th>
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Standard Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {[
                      { p: "Google Ads", v: "google" },
                      { p: "Facebook Ads", v: "facebook" },
                      { p: "Instagram Ads", v: "instagram" },
                      { p: "LinkedIn Ads", v: "linkedin" },
                      { p: "Twitter/X Ads", v: "twitter" },
                      { p: "Email Newsletter", v: "newsletter" },
                      { p: "Transactional Email", v: "email" },
                      { p: "YouTube", v: "youtube" },
                      { p: "Partner/Affiliate", v: "[partner_name]" },
                      { p: "Podcast", v: "[podcast_name]" }
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">{row.p}</td>
                        <td className="px-6 py-4 text-sm font-mono text-emerald-600 font-black"><code>{row.v}</code></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="font-bold text-slate-900 dark:text-white mb-4">Recommended utm_medium values:</p>
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm mb-10">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                  <thead className="bg-slate-50 dark:bg-slate-900/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Channel Type</th>
                      <th className="px-6 py-4 text-left text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Standard Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {[
                      { p: "Paid search", v: "cpc" },
                      { p: "Paid social", v: "paid_social" },
                      { p: "Organic social", v: "social" },
                      { p: "Email marketing", v: "email" },
                      { p: "Display advertising", v: "display" },
                      { p: "Affiliate/referral", v: "referral" },
                      { p: "Video", v: "video" },
                      { p: "Influencer", v: "influencer" },
                      { p: "SMS", v: "sms" },
                      { p: "Push notification", v: "push" }
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">{row.p}</td>
                        <td className="px-6 py-4 text-sm font-mono text-emerald-600 font-black"><code>{row.v}</code></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>Publish this list somewhere your whole team can access it — a shared Notion page, a Google Doc, a Confluence page. Make it the official reference.</p>
            </div>

            <hr className="border-slate-100 dark:border-slate-800" />

            <div>
              <h3 className="text-xl font-black mb-6">Step 2: Establish a Campaign Naming Format</h3>
              <p>Campaign names are where the most inconsistency happens, because they&apos;re created fresh for every campaign. Without a defined format, you end up with everything from <code>utm_campaign=launch</code> to <code>utm_campaign=Big_Product_Launch_Campaign_FINAL_v2</code>.</p>
              <p className="mb-10">A good campaign naming format balances being descriptive with being readable. Here are two formats that work well:</p>
              
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
                  <p className="font-black text-slate-900 dark:text-white mb-2 text-xs uppercase tracking-widest">Format A: Type + Description + Date</p>
                  <code className="block bg-slate-950 text-emerald-400 p-4 rounded-xl text-sm mb-6">[type]_[description]_[month][year]</code>
                  <p className="font-bold text-xs text-slate-500 mb-3">Examples:</p>
                  <ul className="list-none p-0 m-0 space-y-1 text-sm font-mono">
                    <li>• email_welcome_series_jan2026</li>
                    <li>• paid_spring_promo_mar2026</li>
                    <li>• social_brand_awareness_q2_2026</li>
                  </ul>
                </div>
                <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
                  <p className="font-black text-slate-900 dark:text-white mb-2 text-xs uppercase tracking-widest">Format B: Department + Campaign + Date</p>
                  <code className="block bg-slate-950 text-emerald-400 p-4 rounded-xl text-sm mb-6">[dept]_[campaign_name]_[quarter][year]</code>
                  <p className="font-bold text-xs text-slate-500 mb-3">Examples:</p>
                  <ul className="list-none p-0 m-0 space-y-1 text-sm font-mono">
                    <li>• mktg_product_launch_q1_2026</li>
                    <li>• growth_retargeting_q2_2026</li>
                    <li>• content_ebook_promo_q3_2026</li>
                  </ul>
                </div>
              </div>
              <p className="mt-8">Pick one format and stick to it. The specific format matters less than consistency.</p>
            </div>

            <hr className="border-slate-100 dark:border-slate-800" />

            <div>
              <h3 className="text-xl font-black mb-6">Step 3: Define utm_content Conventions for A/B Testing</h3>
              <p className="mb-6"><code>utm_content</code> is used to distinguish between different creative versions, CTAs, or placements in the same campaign. Define a standard format here too.</p>
              <p className="font-bold text-slate-900 dark:text-white mb-4">Common approaches:</p>
              <ul className="grid gap-2 list-none pl-0 font-mono text-sm">
                <li>• By creative type: <code>utm_content=image_v1</code>, <code>utm_content=image_v2</code></li>
                <li>• By CTA: <code>utm_content=cta_signup</code>, <code>utm_content=cta_learnmore</code></li>
                <li>• By placement: <code>utm_content=header</code>, <code>utm_content=footer</code>, <code>utm_content=sidebar</code></li>
                <li>• By audience: <code>utm_content=segment_smb</code>, <code>utm_content=segment_enterprise</code></li>
              </ul>
            </div>

            <hr className="border-slate-100 dark:border-slate-800" />

            <div>
              <h3 className="text-xl font-black mb-6">Step 4: Document Everything in a UTM Style Guide</h3>
              <p>Write all of this down in a single document. Your UTM style guide should include:</p>
              <ol className="grid gap-4 list-none pl-0">
                {[
                  "The core rule (lowercase, no spaces, consistent spelling)",
                  "Your approved utm_source values and what each means",
                  "Your approved utm_medium values and what each means",
                  "Your campaign naming format with examples",
                  "Your utm_content format with examples",
                  "What to do when a new source or medium isn&apos;t on the list (who to ask, how to get it added)",
                  "How to build URLs (link to your UTM builder tool)"
                ].map((item, i) => (
                  <li key={i} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 flex gap-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black">{i+1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-8">Keep this document updated and make it mandatory reading for anyone who builds campaign links.</p>
            </div>
          </div>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-12 tracking-tight">Common Naming Convention Mistakes (and How to Fix Them)</h2>
          
          <div className="space-y-12">
            <div>
              <h3 className="text-xl font-black mb-4">Mistake 1: Using Different Names for the Same Source</h3>
              <p><strong>Problem:</strong> One person uses <code>utm_source=fb</code>, another uses <code>utm_source=facebook</code>, a third uses <code>utm_source=Facebook-Ads</code>.</p>
              <p><strong>Fix:</strong> Define and enforce a single canonical value for every source. Publish the list. Use <Link href="/utility/utm-builder" className="font-bold underline decoration-emerald-200 decoration-2 underline-offset-4">findbest.tools/utility/utm-builder</Link> so everyone is building from the same tool with the same reference.</p>
            </div>
            <hr className="border-slate-100 dark:border-slate-800" />
            <div>
              <h3 className="text-xl font-black mb-4">Mistake 2: Vague Campaign Names</h3>
              <p><strong>Problem:</strong> <code>utm_campaign=promo</code> tells you nothing when you&apos;re reviewing data three months later. Which promo? When? What channel?</p>
              <p><strong>Fix:</strong> Use descriptive, dateable names. <code>utm_campaign=spring_sale_apr2026</code> is unambiguous even six months later.</p>
            </div>
            <hr className="border-slate-100 dark:border-slate-800" />
            <div>
              <h3 className="text-xl font-black mb-4">Mistake 3: Using Spaces</h3>
              <p><strong>Problem:</strong> <code>utm_campaign=Spring Sale 2026</code> becomes <code>utm_campaign=Spring%20Sale%202026</code> in the URL — which looks ugly and may be interpreted inconsistently across platforms.</p>
              <p><strong>Fix:</strong> Replace all spaces with underscores (<code>_</code>) or hyphens (<code>-</code>). Pick one and be consistent. Underscores are more readable in reports; hyphens are more URL-friendly. Either works.</p>
            </div>
            <hr className="border-slate-100 dark:border-slate-800" />
            <div>
              <h3 className="text-xl font-black mb-4">Mistake 4: Not Documenting the Convention</h3>
              <p><strong>Problem:</strong> The naming convention exists in one person&apos;s head. When they go on holiday, the next person makes up their own system. By the time the original person returns, the data is fragmented.</p>
              <p><strong>Fix:</strong> Write it down. Keep it somewhere central and visible. Link to it from your team&apos;s marketing playbook or onboarding docs.</p>
            </div>
            <hr className="border-slate-100 dark:border-slate-800" />
            <div>
              <h3 className="text-xl font-black mb-4">Mistake 5: Not Auditing Your Data Regularly</h3>
              <p><strong>Problem:</strong> Even with a documented convention, mistakes happen. A new team member doesn&apos;t know the standard, or someone builds a link in a hurry without checking the guide.</p>
              <p><strong>Fix:</strong> Run a quarterly audit of your UTM data. In GA4, go to Traffic Acquisition and look for unusual source or medium values that don&apos;t match your convention. Track down where they came from and fix the convention documentation if needed.</p>
            </div>
          </div>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">UTM Naming Convention Template</h2>
          <p className="mb-8">Here&apos;s a ready-to-use template you can copy for your team:</p>
          <pre className="bg-slate-950 p-10 rounded-[2.5rem] border border-slate-800 text-slate-300 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto shadow-2xl">
{`UTM NAMING CONVENTION — [COMPANY NAME]
Last updated: [Date]

CORE RULE: All UTM values must be lowercase, with no spaces, spelled consistently.

APPROVED SOURCES:
- google (Google Ads)
- facebook (Facebook Ads)
- instagram (Instagram Ads)
- linkedin (LinkedIn Ads)
- twitter (Twitter/X)
- newsletter (Email newsletter)
- email (Transactional email)
- youtube (YouTube)
- [partner_name] (Use partner's domain, e.g. techcrunch)

APPROVED MEDIUMS:
- cpc (Paid search)
- paid_social (Paid social media)
- social (Organic social)
- email (Email campaigns)
- display (Display/banner ads)
- referral (Partners/affiliates)
- video (Video ads)
- influencer (Influencer campaigns)

CAMPAIGN FORMAT:
[type]_[description]_[month][year]
Example: email_product_launch_may2026

CONTENT FORMAT (for A/B testing):
[creative_type]_[version]
Example: image_v1, cta_signup, header_banner

HOW TO BUILD URLS:
Use the UTM builder at: https://findbest.tools/utility/utm-builder

TO ADD A NEW SOURCE OR MEDIUM:
Contact [name/slack channel] before using anything not on this list.`}
          </pre>
          <p className="mt-8 text-center text-sm font-medium text-slate-500">Copy this, fill in your details, and share it with your team today.</p>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-12 tracking-tight">How to Enforce Naming Conventions at Scale</h2>
          <p className="mb-10">Documentation helps, but it doesn&apos;t fully prevent mistakes — especially as your team grows.</p>
          <p>Here are ways to enforce conventions more systematically:</p>

          <div className="space-y-12 mt-12">
            <div>
              <h3 className="text-xl font-bold mb-4">Use a Centralized UTM Builder</h3>
              <p>When everyone uses the same tool to build UTM links, you have one place to enforce standards. <strong><Link href="/utility/utm-builder" className="text-emerald-600 font-black underline underline-offset-4 decoration-2">findbest.tools/utility/utm-builder</Link></strong> makes it easy to generate clean, properly formatted URLs every time — reducing the chance of manual errors or invented values.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Create a Pre-Launch Checklist</h3>
              <p className="mb-6">Before any campaign goes live, require a UTM audit as part of the checklist:</p>
              <ul className="grid gap-2 list-none pl-0 text-sm font-medium">
                <li className="flex gap-4 items-center">
                  <div className="w-5 h-5 rounded border border-slate-300 flex-shrink-0" />
                  <span>All links have UTM parameters</span>
                </li>
                <li className="flex gap-4 items-center">
                  <div className="w-5 h-5 rounded border border-slate-300 flex-shrink-0" />
                  <span>All values are lowercase</span>
                </li>
                <li className="flex gap-4 items-center">
                  <div className="w-5 h-5 rounded border border-slate-300 flex-shrink-0" />
                  <span>No spaces in any values</span>
                </li>
                <li className="flex gap-4 items-center">
                  <div className="w-5 h-5 rounded border border-slate-300 flex-shrink-0" />
                  <span>Campaign name follows the standard format</span>
                </li>
                <li className="flex gap-4 items-center">
                  <div className="w-5 h-5 rounded border border-slate-300 flex-shrink-0" />
                  <span>UTM source and medium are from the approved list</span>
                </li>
                <li className="flex gap-4 items-center">
                  <div className="w-5 h-5 rounded border border-slate-300 flex-shrink-0" />
                  <span>URLs were built using the official UTM builder</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Build a UTM Spreadsheet Log</h3>
              <p>Keep a master log of every UTM URL you create, with columns for: campaign name, source, medium, content, the full URL, the date created, and who created it. This makes auditing easy and gives you a searchable record of every tracking link you&apos;ve ever used.</p>
            </div>
          </div>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-12 tracking-tight">Fixing Existing UTM Data Chaos</h2>
          <p className="mb-10 text-lg">If your historical data is already a mess, don&apos;t panic. You can&apos;t change the past in Google Analytics, but you can protect the future.</p>
          
          <div className="space-y-8">
            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="font-bold text-slate-900 dark:text-white mb-2">Option 1: Channel Groupings in GA4</p>
              <p className="m-0 leading-relaxed text-sm text-slate-600 dark:text-slate-400">GA4 allows you to create custom channel groupings that map multiple values to a single channel. For example, you can tell GA4 that <code>facebook</code>, <code>Facebook</code>, <code>fb</code>, and <code>facebook-ads</code> should all be treated as &quot;Facebook.&quot; This doesn&apos;t fix the underlying data, but it cleans up your reports.</p>
            </div>
            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="font-bold text-slate-900 dark:text-white mb-2">Option 2: Data Transformation</p>
              <p className="m-0 leading-relaxed text-sm text-slate-600 dark:text-slate-400">If you export your raw data to BigQuery or another data warehouse, you can apply transformations to normalize inconsistent values before reporting.</p>
            </div>
            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="font-bold text-slate-900 dark:text-white mb-2">Option 3: Start Fresh</p>
              <p className="m-0 leading-relaxed text-sm text-slate-600 dark:text-slate-400">Set a cutoff date, implement your new naming convention, and begin clean from that point. Flag the historical data as &quot;pre-convention&quot; and avoid comparing it directly to the new clean data.</p>
            </div>
          </div>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">The Payoff: What Clean UTM Data Looks Like</h2>
          <p>When naming conventions are working, your GA4 Traffic Acquisition report is clean, readable, and trustworthy. You see:</p>
          <ul className="list-none pl-0 font-bold text-emerald-600 dark:text-emerald-400 space-y-2 mb-8">
            <li className="flex gap-4 items-center"><span className="w-1 h-1 rounded-full bg-emerald-500" /> One row for facebook / paid_social</li>
            <li className="flex gap-4 items-center"><span className="w-1 h-1 rounded-full bg-emerald-500" /> One row for newsletter / email</li>
            <li className="flex gap-4 items-center"><span className="w-1 h-1 rounded-full bg-emerald-500" /> One row for google / cpc</li>
          </ul>
          <p>Not 15 variations of each. Not mysterious &quot;other&quot; buckets. Not data that requires cleanup before you can use it.</p>
          <p className="text-lg leading-relaxed italic border-l-4 border-emerald-500 pl-8 font-medium my-10">
            &quot;Our email campaigns drove 2,400 sessions this month, with a 4.2% conversion rate.&quot;
          </p>
          <p>And you know that number is accurate, because every email link was tagged consistently.</p>
          <p>That&apos;s the power of a naming convention. It&apos;s not glamorous, but it&apos;s the foundation that everything else in your marketing analytics sits on.</p>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Start Building Clean UTM Links Right Now</h2>
          <p>Take 10 minutes this week to:</p>
          <ol className="grid gap-4 list-none pl-0">
            {[
              "Download the naming convention template above",
              "Fill in your approved source and medium values",
              "Share it with your team",
              "Bookmark <strong>findbest.tools/utility/utm-builder</strong> as the official tool for building all campaign URLs"
            ].map((item, i) => (
              <li key={i} className="flex gap-6 items-center">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">{i+1}</span>
                <span dangerouslySetInnerHTML={{ __html: item }} />
              </li>
            ))}
          </ol>
          <p className="mt-12 text-center font-black text-slate-900 dark:text-white leading-relaxed">
            Your future self — the one trying to make budget decisions from last quarter&apos;s data — will thank you.
          </p>
          <div className="mt-16 pt-12 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-4">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Continue reading</p>
            <Link 
              href="/blog/5-utm-mistakes" 
              className="text-emerald-600 font-black hover:text-emerald-500 transition-colors underline underline-offset-8 decoration-2"
            >
              5 UTM Mistakes That Are Ruining Your Campaign Data &rarr;
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
