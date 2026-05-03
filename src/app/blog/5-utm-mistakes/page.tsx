import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
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

export default function UtmMistakesBlogPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "5 UTM Mistakes", path: PAGE_PATH },
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <JsonLd data={serializeJsonLd(breadcrumbs)} />

      <header className="mb-16">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-500 mb-8 uppercase tracking-widest font-bold">
          <Link href="/" className="hover:text-rose-600 transition-colors">Home</Link>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <Link href="/blog" className="hover:text-rose-600 transition-colors">Blog</Link>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span className="text-slate-900 dark:text-slate-100 uppercase tracking-widest font-black text-[10px]">Critical Guide</span>
        </nav>
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-xs font-black uppercase tracking-widest">
            Campaign Tracking · Data Integrity
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
            5 UTM Mistakes That Are Ruining Your Campaign Data (And How to Fix Them)
          </h1>
        </div>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <section className="mb-12">
          <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            UTM tracking is one of the most valuable things a marketer can implement. And yet, most teams are doing it wrong — not because they don&apos;t care, but because the mistakes are subtle, easy to make, and often invisible until the damage is already done.
          </p>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            By the time you realize your campaign data is unreliable, you may have already made budget decisions, channel reallocations, or strategy pivots based on numbers that don&apos;t reflect reality.
          </p>
          <p>
            This guide covers the five most damaging UTM mistakes, what they look like in your analytics, and exactly how to fix them — starting today.
          </p>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-rose-600 mb-12 tracking-tight">Mistake #1: Inconsistent Naming (The Silent Data Killer)</h2>
          
          <div className="space-y-8">
            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="font-black text-slate-900 dark:text-white mb-4 uppercase tracking-widest text-[10px]">What it looks like:</p>
              <p>You open your GA4 Traffic Acquisition report and find this for your Facebook traffic:</p>
              <div className="bg-white dark:bg-black/40 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 font-mono text-sm space-y-1 my-6 shadow-sm">
                <p className="m-0 flex justify-between"><span>• <code>facebook / paid_social</code></span> <span className="font-bold">1,240 sessions</span></p>
                <p className="m-0 flex justify-between opacity-60"><span>• <code>Facebook / Paid_Social</code></span> <span>340 sessions</span></p>
                <p className="m-0 flex justify-between opacity-60"><span>• <code>fb / social</code></span> <span>210 sessions</span></p>
                <p className="m-0 flex justify-between opacity-60"><span>• <code>facebook-ads / paid</code></span> <span>180 sessions</span></p>
              </div>
              <p className="m-0 leading-relaxed">That&apos;s 1,970 sessions from Facebook — but because they were tagged inconsistently, they appear as four separate rows. You see 1,240 sessions from your biggest entry and think Facebook underperformed. In reality, it drove nearly 2,000 sessions.</p>
            </div>

            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="font-black text-slate-900 dark:text-white mb-4 uppercase tracking-widest text-[10px]">Why it happens:</p>
              <p className="m-0 leading-relaxed">Different team members build links differently. There&apos;s no shared standard. One person uses <code>facebook</code>, another uses <code>Facebook</code>, a third uses <code>fb</code>. Each seems fine in isolation. Collectively, they destroy your data.</p>
            </div>

            <div className="p-8 bg-emerald-600 rounded-3xl text-white shadow-xl shadow-emerald-500/20">
              <p className="font-black mb-4 uppercase tracking-[0.3em] text-[10px]">The Fix</p>
              <p className="text-xl font-bold leading-relaxed mb-8">Create a UTM naming convention document that lists every approved value for <code>utm_source</code> and <code>utm_medium</code> — and make it mandatory. Then use a single, shared tool for building all campaign URLs.</p>
              <p className="text-lg font-black leading-relaxed m-0">
                <Link href="/utility/utm-builder" className="underline underline-offset-4 decoration-2">findbest.tools/utility/utm-builder</Link> ensures every URL is built in a consistent format. Keep it bookmarked, share it with your team, and make it the only place anyone builds UTM links.
              </p>
              <p className="mt-8 font-black uppercase tracking-widest text-[10px]">Key rules:</p>
              <ul className="grid grid-cols-2 gap-2 list-none p-0 m-0 mt-4 text-xs font-bold opacity-90">
                <li className="flex gap-2 items-center"><span className="w-1.5 h-1.5 rounded-full bg-white" /> Always lowercase</li>
                <li className="flex gap-2 items-center"><span className="w-1.5 h-1.5 rounded-full bg-white" /> No spaces (use underscores or hyphens)</li>
                <li className="flex gap-2 items-center"><span className="w-1.5 h-1.5 rounded-full bg-white" /> Same spelling every time</li>
                <li className="flex gap-2 items-center"><span className="w-1.5 h-1.5 rounded-full bg-white" /> One canonical source name per platform</li>
              </ul>
            </div>
          </div>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-rose-600 mb-12 tracking-tight">Mistake #2: Tagging Internal Links (Session Hijacking)</h2>
          
          <div className="space-y-8">
            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="font-black text-slate-900 dark:text-white mb-4 uppercase tracking-widest text-[10px]">What it looks like:</p>
              <p className="mb-8 leading-relaxed">You add UTM parameters to links that go from one page of your website to another. For example, your homepage has a banner linking to a product page, and you tag it with <code>utm_source=homepage&utm_medium=internal</code>.</p>
              <p className="m-0 text-slate-600 dark:text-slate-400">This sounds harmless — even useful. But it triggers one of the most damaging behaviors in Google Analytics: <strong>session overwriting</strong>.</p>
            </div>

            <div className="p-10 bg-rose-600 rounded-[2.5rem] text-white shadow-xl shadow-rose-500/20 relative overflow-hidden italic text-lg leading-relaxed">
              &quot;When someone lands on your website from a Google ad (correctly tagged as <code>utm_source=google&utm_medium=cpc</code>), then clicks that internal banner and gets hit with new UTM parameters, Google Analytics starts a new session. The original Google Ads source is wiped. The conversion that happens three pages later now gets credited to your internal banner, not to Google.&quot;
            </div>

            <p className="font-bold text-center text-slate-500 my-10">Your Google Ads ROI looks terrible. Your internal banner looks like a conversion powerhouse. Neither is true.</p>

            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="font-black text-slate-900 dark:text-white mb-4 uppercase tracking-widest text-[10px]">Why it happens:</p>
              <p className="m-0 leading-relaxed text-slate-600 dark:text-slate-400">Marketers add UTMs to internal links thinking more tracking is always better. The logic makes sense intuitively — but it breaks the session model that Google Analytics uses for attribution.</p>
            </div>

            <div className="p-8 bg-emerald-600 rounded-3xl text-white shadow-xl shadow-emerald-500/20">
              <p className="font-black mb-4 uppercase tracking-[0.3em] text-[10px]">The Fix</p>
              <p className="text-xl font-bold leading-relaxed mb-8">Remove all UTM parameters from internal links. Full stop. UTM parameters are for tracking where traffic comes from <em>outside your site</em>. Once a user is on your website, let them navigate naturally without resetting their session.</p>
              <p className="m-0 leading-relaxed opacity-90">To track internal link performance, use Google Analytics events instead. Add click tracking to specific elements (banners, CTAs, navigation links) to measure engagement without disrupting attribution.</p>
            </div>

            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="font-black text-slate-900 dark:text-white mb-4 uppercase tracking-widest text-[10px]">Quick audit:</p>
              <p className="m-0 italic text-sm text-slate-600 dark:text-slate-400">Do a search across your codebase, email templates, and ad systems for <code>utm_</code> and check whether any tagged URLs point to other pages on your own domain. If they do, remove the UTM parameters.</p>
            </div>
          </div>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-rose-600 mb-12 tracking-tight">Mistake #3: Not Tagging Everything (Partial Tracking = Useless Tracking)</h2>
          
          <div className="space-y-8">
            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="font-black text-slate-900 dark:text-white mb-4 uppercase tracking-widest text-[10px]">What it looks like:</p>
              <p className="mb-6">You tag your paid ads meticulously with UTM parameters, but you forget to tag:</p>
              <ul className="grid gap-2 list-none pl-0 text-sm font-medium text-slate-500">
                <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> The bio link in your Instagram profile</li>
                <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> The links in your weekly email newsletter</li>
                <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> The link you posted in a LinkedIn comment thread</li>
                <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> The URL in your podcast show notes</li>
                <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> The link you sent in a guest post</li>
              </ul>
              <p className="mt-8 m-0 leading-relaxed">All of that traffic lands in GA4 as &quot;direct&quot; — which means it looks like people typed your URL directly into their browser. Your email and organic social performance is drastically undercounted. Your &quot;direct&quot; traffic is inflated and meaningless.</p>
            </div>

            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="font-black text-slate-900 dark:text-white mb-4 uppercase tracking-widest text-[10px]">Why it happens:</p>
              <p className="m-0 leading-relaxed text-slate-600 dark:text-slate-400">Teams are diligent about tagging planned campaigns (like paid ads) but forget about always-on traffic sources. There&apos;s no checklist for every channel, so things get missed.</p>
            </div>

            <div className="p-8 bg-emerald-600 rounded-3xl text-white shadow-xl shadow-emerald-500/20">
              <p className="font-black mb-4 uppercase tracking-[0.3em] text-[10px]">The Fix</p>
              <p className="text-xl font-bold leading-relaxed mb-8">Build a comprehensive tagging checklist that covers every channel you use — not just paid campaigns. For every piece of content you create that includes a link to your website, ask: <em>does this link have UTM parameters?</em></p>
              
              <p className="font-black uppercase tracking-widest text-[10px] mb-6">Channels to always tag:</p>
              <div className="grid grid-cols-2 gap-3 mb-10 text-[11px] font-bold">
                {[
                  "Email newsletters and drip sequences", "Social media bio links (Instagram, Twitter/X, TikTok, LinkedIn)",
                  "Social media posts and stories", "Podcast show notes",
                  "Guest blog posts and contributed articles", "YouTube video descriptions",
                  "Press releases", "SMS campaigns", "Push notifications", "QR codes in physical materials"
                ].map(ch => (
                  <div key={ch} className="px-3 py-2 bg-white/10 rounded-lg border border-white/20">{ch}</div>
                ))}
              </div>
              
              <p className="mb-6 opacity-90 leading-relaxed italic">For channels where you don&apos;t run &quot;campaigns&quot; per se (like your Instagram bio), use a consistent evergreen tag like:</p>
              <div className="bg-white p-6 rounded-2xl border border-white/20 text-emerald-950 font-mono text-xs overflow-x-auto shadow-sm mb-10">
                utm_source=instagram&utm_medium=social&utm_campaign=bio_link_evergreen
              </div>
              <p className="mb-8 opacity-90 leading-relaxed">Update it to a more specific campaign name when you&apos;re actively promoting something.</p>
              <p className="m-0 font-black">
                Use <strong><Link href="/utility/utm-builder" className="underline underline-offset-4 decoration-2">findbest.tools/utility/utm-builder</Link></strong> to quickly generate these evergreen tags — it takes under 30 seconds per channel.
              </p>
            </div>
          </div>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-rose-600 mb-12 tracking-tight">Mistake #4: Using Vague Campaign Names (Making Future-You&apos;s Life Miserable)</h2>
          
          <div className="space-y-8">
            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="font-black text-slate-900 dark:text-white mb-4 uppercase tracking-widest text-[10px]">What it looks like:</p>
              <p className="mb-6">You&apos;re reviewing Q4 campaign performance in February and you find these entries in your reports:</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["promo", "launch", "sale", "summer", "test", "new_campaign", "email1"].map(v => (
                  <code key={v} className="px-3 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg border border-rose-500/20 text-xs font-bold">{v}</code>
                ))}
              </div>
              <p className="m-0 leading-relaxed italic text-slate-500">Which promo? From which month? Which product launch? Which sale? You have no idea — and neither does anyone else on your team.</p>
            </div>

            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="font-black text-slate-900 dark:text-white mb-4 uppercase tracking-widest text-[10px]">Why it happens:</p>
              <p className="m-0 leading-relaxed text-slate-600 dark:text-slate-400">Campaign names are often assigned in a hurry when someone is in the middle of setting up a campaign. They default to whatever makes sense to them in the moment — which usually means vague shorthand that means nothing three months later.</p>
            </div>

            <div className="p-8 bg-emerald-600 rounded-3xl text-white shadow-xl shadow-emerald-500/20">
              <p className="font-black mb-4 uppercase tracking-[0.3em] text-[10px]">The Fix</p>
              <p className="text-xl font-bold leading-relaxed mb-10">Enforce a campaign naming format that includes enough context to be self-explanatory later. A good format includes:</p>
              
              <ol className="grid gap-3 list-none p-0 mb-10 text-sm font-bold opacity-90">
                <li className="flex gap-4 items-center"><span className="w-6 h-6 rounded-lg bg-white text-emerald-600 flex items-center justify-center text-[10px] font-black">1</span> The channel or type — email, paid, social, etc.</li>
                <li className="flex gap-4 items-center"><span className="w-6 h-6 rounded-lg bg-white text-emerald-600 flex items-center justify-center text-[10px] font-black">2</span> A description of the initiative — product launch, seasonal promo, brand awareness</li>
                <li className="flex gap-4 items-center"><span className="w-6 h-6 rounded-lg bg-white text-emerald-600 flex items-center justify-center text-[10px] font-black">3</span> The time period — month and year, or quarter and year</li>
              </ol>

              <p className="font-black uppercase tracking-widest text-[10px] mb-4">Formula:</p>
              <div className="bg-emerald-950 p-6 rounded-2xl border border-emerald-900 font-mono text-lg text-emerald-400 mb-10">
                [type]_[description]_[month][year]
              </div>

              <div className="grid gap-4">
                <p className="m-0 font-bold text-xs uppercase tracking-widest opacity-80">Examples:</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  <div className="p-4 bg-white/10 rounded-xl border border-white/20 text-sm font-mono">email_welcome_series_jan2026 ✅</div>
                  <div className="p-4 bg-white/10 rounded-xl border border-white/20 text-sm font-mono">paid_retargeting_apr2026 ✅</div>
                  <div className="p-4 bg-white/10 rounded-xl border border-white/20 text-sm font-mono">social_summer_giveaway_jun2026 ✅</div>
                  <div className="p-4 bg-rose-500/20 rounded-xl border border-rose-500/30 text-sm font-mono opacity-60">launch ❌</div>
                  <div className="p-4 bg-rose-500/20 rounded-xl border border-rose-500/30 text-sm font-mono opacity-60">promo2 ❌</div>
                </div>
              </div>
              
              <p className="mt-10 m-0 opacity-90 leading-relaxed text-sm">This naming format means that when you look at your data in six months, every entry in your reports is immediately understandable without needing to consult anyone.</p>
            </div>
          </div>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-rose-600 mb-12 tracking-tight">Mistake #5: Building UTM URLs Manually (Inviting Human Error)</h2>
          
          <div className="space-y-8">
            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="font-black text-slate-900 dark:text-white mb-4 uppercase tracking-widest text-[10px]">What it looks like:</p>
              <p className="mb-6 leading-relaxed">A marketing team member opens a spreadsheet, types out the base URL, then manually appends UTM parameters. They&apos;re working fast, so they accidentally type:</p>
              <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-2xl font-mono text-xs text-rose-600 dark:text-rose-400 break-all mb-8 shadow-sm">
                https://example.com?utm_souce=google&utm_medium=cpc&utm_campaing=spring_launch
              </div>
              <p className="m-0 leading-relaxed italic text-sm text-slate-500">Do you see the typos? <code>utm_souce</code> instead of <code>utm_source</code>. <code>utm_campaing</code> instead of <code>utm_campaign</code>. Both parameters are now broken — the data will either not be tracked or will show up as unknown/unset in GA4.</p>
            </div>

            <div className="p-10 bg-slate-950 rounded-[2.5rem] text-slate-300 border border-slate-800 italic leading-relaxed text-lg shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl -mr-16 -mt-16" />
              &quot;These typos are nearly invisible in a long URL. They&apos;re easy to make and hard to catch. And if this URL runs in a paid campaign for two weeks before anyone notices, two weeks of attribution data is lost.&quot;
            </div>

            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="font-black text-slate-900 dark:text-white mb-4 uppercase tracking-widest text-[10px]">Why it happens:</p>
              <p className="m-0 leading-relaxed text-slate-600 dark:text-slate-400">Manual URL building is error-prone by nature. Humans make typos. Parameter names are specific and unforgiving. Even experienced marketers make these mistakes when working at speed.</p>
            </div>

            <div className="p-8 bg-emerald-600 rounded-3xl text-white shadow-xl shadow-emerald-500/20">
              <p className="font-black mb-4 uppercase tracking-[0.3em] text-[10px]">The Fix</p>
              <p className="text-xl font-bold leading-relaxed mb-10">Stop building UTM URLs by hand. Use a dedicated UTM builder tool that generates the URL for you — with correct parameter names, proper formatting, and no risk of typos in the parameter keys.</p>
              
              <p className="mb-8 opacity-90 leading-relaxed">
                <strong><Link href="/utility/utm-builder" className="underline underline-offset-4 decoration-2">findbest.tools/utility/utm-builder</Link></strong> is built specifically for this. You enter your URL and fill in the fields — the tool handles the rest. The parameter names are pre-filled correctly. The formatting is handled automatically. All you need to do is copy the output.
              </p>
              
              <p className="m-0 leading-relaxed italic text-sm opacity-90 font-medium">This should be the only way your team builds UTM URLs. Add it to your team&apos;s bookmarks, your onboarding docs, and your campaign checklist.</p>
            </div>
          </div>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">The Combined Effect: What Bad UTM Data Costs You</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-12">
            Each of these mistakes on its own causes problems. Together, they make your analytics fundamentally unreliable.
          </p>
          
          <div className="bg-slate-50 dark:bg-slate-900/50 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 mb-12 shadow-sm">
            <p className="font-black uppercase tracking-widest text-[10px] text-rose-600 mb-6">Consider this scenario:</p>
            <ul className="grid gap-3 list-none p-0 m-0 text-sm font-medium text-slate-600 dark:text-slate-400">
              <li className="flex gap-4 items-center"><span className="w-2 h-2 rounded-full bg-rose-500" /> Your email campaigns are untagged → email traffic shows as direct</li>
              <li className="flex gap-4 items-center"><span className="w-2 h-2 rounded-full bg-rose-500" /> Your Facebook links use inconsistent naming → Facebook data is fragmented</li>
              <li className="flex gap-4 items-center"><span className="w-2 h-2 rounded-full bg-rose-500" /> You have UTMs on internal links → attribution is overwritten mid-session</li>
              <li className="flex gap-4 items-center"><span className="w-2 h-2 rounded-full bg-rose-500" /> Your campaign names are vague → historical analysis is impossible</li>
              <li className="flex gap-4 items-center"><span className="w-2 h-2 rounded-full bg-rose-500" /> Manual typos broke 3 campaign tags last month → 3 weeks of data is untracked</li>
            </ul>
          </div>
          
          <p className="text-lg leading-relaxed mb-8">You open your dashboard and see a mix of inflated direct traffic, fragmented channel data, and missing campaign performance. You make a budget decision based on this data — reallocating spend away from channels that look underperforming, but are actually performing well and just not tracked correctly.</p>
          
          <div className="p-8 bg-rose-600 rounded-3xl text-white text-center shadow-xl shadow-rose-500/20">
            <p className="text-2xl font-black m-0 tracking-tight leading-tight uppercase">This is the real cost of bad UTM hygiene: **misdirected marketing spend based on faulty data**.</p>
          </div>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-12 tracking-tight">UTM Health Audit: A 15-Minute Checkup</h2>
          <p className="mb-10">Here&apos;s a quick audit you can run right now to diagnose your UTM data quality:</p>
          
          <div className="grid gap-6">
            {[
              { t: "1. Check for capitalization inconsistencies", d: "In GA4, go to Traffic Acquisition. Sort by source. Look for the same platform listed multiple ways (e.g., <code>facebook</code>, <code>Facebook</code>, <code>FB</code>)." },
              { t: "2. Check your direct traffic volume", d: "If direct traffic is unusually high (over 30% for most B2B sites), it&apos;s likely catching untagged email and social traffic. This is a signal that many links are untagged." },
              { t: "3. Audit your most recent email campaign", d: "Find the links you sent in your last newsletter. Do they all have UTM parameters? Are the values consistent and lowercase?" },
              { t: "4. Check for internal link UTMs", d: "Search your codebase or CMS for <code>utm_source</code> and verify that no results point to internal pages." },
              { t: "5. Review your most recent campaign names", d: "Look at the last 10 campaign names in your reports. Can you tell what each one was, just from the name? If not, your naming convention needs work." }
            ].map((item, i) => (
              <div key={i} className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 flex gap-6 items-start">
                <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black">{i+1}</span>
                <div>
                  <p className="font-black text-slate-900 dark:text-white mb-2 leading-tight">{item.t}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 m-0 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.d }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-12 tracking-tight">Your Action Plan</h2>
          <p className="mb-10 font-bold uppercase tracking-widest text-xs text-rose-600">Fix these mistakes in order of impact:</p>
          
          <ol className="grid gap-4 list-none p-0 m-0">
            {[
              "Stop building URLs manually. Start using <strong>[findbest.tools/utility/utm-builder](https://findbest.tools/utility/utm-builder)</strong> today.",
              "Remove UTMs from all internal links. Do a site-wide audit this week.",
              "Create a naming convention document and share it with your team.",
              "Build an evergreen tagging list for every channel you use.",
              "Run a monthly data audit to catch inconsistencies before they accumulate."
            ].map((item, i) => (
              <li key={i} className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 flex gap-6 items-center">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black">{i+1}</span>
                <p className="m-0 font-black text-slate-900 dark:text-white leading-tight">
                  {item.split("**").map((part, idx) => idx % 2 === 1 ? <Link key={idx} href="/utility/utm-builder" className="underline decoration-emerald-200 decoration-2 underline-offset-4">{part}</Link> : part)}
                </p>
              </li>
            ))}
          </ol>
          
          <p className="mt-12 text-center text-slate-500 font-medium leading-relaxed italic">None of this requires a technical background. It requires discipline, documentation, and the right tool.</p>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-12 tracking-tight">Summary</h2>
          
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-900">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Mistake</th>
                  <th className="px-6 py-4 text-left text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Impact</th>
                  <th className="px-6 py-4 text-left text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Fix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[
                  { m: "Inconsistent naming", i: "Fragmented channel data", f: "Naming convention + shared UTM builder" },
                  { m: "UTMs on internal links", i: "Broken attribution", f: "Remove all internal UTM tags" },
                  { m: "Not tagging everything", i: "Inflated direct traffic", f: "Tag all external links" },
                  { m: "Vague campaign names", i: "Uninterpretable historical data", f: "Use descriptive naming format" },
                  { m: "Manual URL building", i: "Typos breaking tracking", f: "Use findbest.tools/utility/utm-builder" }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-black text-rose-600">{row.m}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{row.i}</td>
                    <td className="px-6 py-4 text-sm text-slate-900 dark:text-white italic">{row.f}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-16 text-center">
          <p className="text-lg leading-relaxed font-bold text-slate-900 dark:text-white mb-12">Fix these five mistakes and your analytics data becomes something you can actually trust — and make decisions from.</p>
          
          <div className="pt-12 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-4">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Next read</p>
            <Link 
              href="/blog/social-media-utm-tracking" 
              className="text-rose-600 font-black hover:text-rose-500 transition-colors underline underline-offset-8 decoration-2"
            >
              UTM Tracking for Social Media: Facebook, Instagram, LinkedIn & Twitter &rarr;
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
