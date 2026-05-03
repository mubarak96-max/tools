import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";

const PAGE_PATH = "/blog/social-media-utm-tracking";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "UTM Tracking for Social Media: Facebook, Instagram, LinkedIn & Twitter",
  description: "Master social media attribution. Learn how to track organic posts, Stories, bio links, and paid ads across Facebook, Instagram, LinkedIn, and Twitter.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "UTM Tracking for Social Media: Facebook, Instagram, LinkedIn & Twitter",
    description: "A complete guide to tracking social media performance with UTM parameters. Includes platform-specific tips and naming conventions.",
    url: PAGE_URL,
    type: "article",
  },
};

export default function SocialMediaUtmTrackingBlogPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Social Media UTM Tracking", path: PAGE_PATH },
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <JsonLd data={serializeJsonLd(breadcrumbs)} />

      <header className="mb-16">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-500 mb-8 uppercase tracking-widest font-bold">
          <Link href="/" className="hover:text-purple-600 transition-colors">Home</Link>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <Link href="/blog" className="hover:text-purple-600 transition-colors">Blog</Link>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span className="text-slate-900 dark:text-slate-100">Social Media UTM Tracking</span>
        </nav>
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 text-xs font-black uppercase tracking-widest">
            Social Media · Attribution
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
            UTM Tracking for Social Media: Facebook, Instagram, LinkedIn & Twitter
          </h1>
        </div>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <section className="mb-12">
          <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            Social media is one of the most complex channels to attribute accurately. Between organic posts, paid ads, stories, bio links, DMs, shares, and reposts — traffic from social arrives through dozens of different paths. Without UTM parameters, all of that nuance collapses into vague entries like &quot;social&quot; or &quot;referral&quot; in your analytics — or worse, gets misattributed as &quot;direct.&quot;
          </p>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            This guide breaks down exactly how to structure UTM tracking for the four major social platforms: Facebook, Instagram, LinkedIn, and Twitter/X. For each platform, you&apos;ll get the recommended parameter values, real URL examples, and platform-specific tips that most UTM guides skip.
          </p>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Why Social Media UTM Tracking Is Different</h2>
          <p className="mb-10 leading-relaxed">Social media tracking has a few characteristics that make it trickier than email or paid search.</p>
          
          <div className="grid gap-6">
            {[
              { t: "The referrer problem", d: "Some social platforms — particularly apps on mobile — don&apos;t pass referrer data reliably to the destination site. A click from the Instagram app, for example, often arrives without any referrer signal. Without UTM parameters, this traffic lands as &quot;direct.&quot;" },
              { t: "Paid vs. organic on the same platform", d: "Facebook is both a source of free organic traffic (from posts and shares) and paid traffic (from ads). Without UTM parameters, both get lumped together as &quot;facebook / referral&quot; — making it impossible to compare the ROI of your organic content to your ad spend." },
              { t: "Multiple content types", d: "A single platform might send traffic from a feed post, a story, a bio link, a comment, or a paid ad. UTM parameters let you distinguish between all of these." },
              { t: "Shares and reshares", d: "When someone shares your post and another user clicks through, that traffic came from social but the referring URL may not be what you expect. UTM parameters travel with the URL regardless of how it was shared." }
            ].map((item, i) => (
              <div key={i} className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 flex gap-6">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-black">{i+1}</span>
                <div>
                  <p className="font-black text-slate-900 dark:text-white mb-2 leading-tight">{item.t}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 m-0 leading-relaxed">{item.d}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-12 text-lg font-bold text-center">The solution to all of these is the same: tag every link with UTM parameters before you post it. Use <strong><Link href="/utility/utm-builder" className="text-purple-600 underline underline-offset-4 decoration-2">findbest.tools/utility/utm-builder</Link></strong> to generate your tagged URLs in seconds — then use the platform-specific conventions below.</p>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-12 tracking-tight">Facebook UTM Tracking</h2>
          <p className="mb-10">Facebook is the most complex social platform to track because it has so many different traffic surfaces: feed posts, Stories, Groups, Pages, Reels, Messenger, and paid ads.</p>

          <h3 className="text-xl font-bold mb-6">Recommended UTM Structure for Facebook</h3>
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm mb-12">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Parameter</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Organic Posts</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Paid Ads</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
                {[
                  { p: "utm_source", o: "facebook", pa: "facebook" },
                  { p: "utm_medium", o: "social", pa: "paid_social" },
                  { p: "utm_campaign", o: "[campaign_name]", pa: "[campaign_name]" },
                  { p: "utm_content", o: "[post_type]", pa: "[ad_creative]" }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-black text-slate-900 dark:text-white">{row.p}</td>
                    <td className="px-6 py-4 text-purple-600 font-bold">{row.o}</td>
                    <td className="px-6 py-4 text-purple-600 font-bold">{row.pa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-bold mb-6">Example URLs</h3>
          <div className="space-y-4 mb-12">
            {[
              { t: "Organic Facebook post:", url: "https://yoursite.com/blog-post?utm_source=facebook&utm_medium=social&utm_campaign=may2026_content&utm_content=feed_post" },
              { t: "Facebook paid ad:", url: "https://yoursite.com/landing-page?utm_source=facebook&utm_medium=paid_social&utm_campaign=spring_promo_apr2026&utm_content=carousel_v1" },
              { t: "Facebook Story link:", url: "https://yoursite.com/offer?utm_source=facebook&utm_medium=social&utm_campaign=may2026_content&utm_content=story" }
            ].map((ex, i) => (
              <div key={i} className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[10px] sm:text-xs text-purple-400 break-all">
                <p className="m-0 text-slate-500 font-sans font-bold mb-2 uppercase tracking-widest text-[9px]">{ex.t}</p>
                {ex.url}
              </div>
            ))}
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-black mb-6 uppercase tracking-widest text-xs text-purple-600">Facebook-Specific Tips</h3>
            <ul className="grid gap-6 list-none p-0 m-0">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-purple-500 mt-2" />
                <span><strong>Use <code>paid_social</code> for ads, <code>social</code> for organic</strong>: Keeping these mediums separate is critical. It lets you compare organic reach to paid performance at a glance in GA4 without filtering.</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-purple-500 mt-2" />
                <span><strong>Tag your Facebook Page &quot;Website&quot; button</strong>: Most businesses have a website link in their Facebook Page header. Tag this with a stable evergreen URL: <code>utm_source=facebook&utm_medium=social&utm_campaign=bio_link_evergreen</code></span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-purple-500 mt-2" />
                <span><strong>For Facebook Ads, consider auto-tagging</strong>: Facebook Ads Manager has its own UTM builder built in — but it doesn&apos;t always populate correctly, especially for off-platform placements. Manually set UTMs in the &quot;URL Parameters&quot; field of each ad to ensure accuracy. The manually set UTMs take precedence.</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-purple-500 mt-2" />
                <span><strong>Group links</strong>: If you share links in Facebook Groups (your own or others&apos;), tag them with: <code>utm_source=facebook&utm_medium=social&utm_campaign=[campaign]&utm_content=group_post</code></span>
              </li>
            </ul>
          </div>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-12 tracking-tight">Instagram UTM Tracking</h2>
          <p className="mb-10 leading-relaxed">Instagram is arguably the hardest social platform to track because, unlike most platforms, it doesn&apos;t allow clickable links in regular posts. You have limited options for where links can live — and UTM tracking needs to be set up differently for each.</p>

          <h3 className="text-xl font-bold mb-6">Where You Can Put Links on Instagram</h3>
          <ul className="grid grid-cols-2 gap-3 list-none p-0 mb-12 font-bold text-sm text-slate-500">
            {["Bio link", "Stories", "Link in bio tools", "Paid ads", "DMs", "Reels"].map((item, i) => (
              <li key={item} className="flex gap-4 items-center">
                <span className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">{i+1}</span>
                {item}
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-bold mb-6">Recommended UTM Structure for Instagram</h3>
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm mb-12">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Parameter</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Bio Link</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Stories</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Paid Ads</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
                {[
                  { p: "utm_source", b: "instagram", s: "instagram", pa: "instagram" },
                  { p: "utm_medium", b: "social", s: "social", pa: "paid_social" },
                  { p: "utm_campaign", b: "bio_link", s: "[campaign_name]", pa: "[campaign_name]" },
                  { p: "utm_content", b: "profile", s: "story", pa: "[ad_creative]" }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-black text-slate-900 dark:text-white">{row.p}</td>
                    <td className="px-6 py-4 text-purple-600 font-bold">{row.b}</td>
                    <td className="px-6 py-4 text-purple-600 font-bold">{row.s}</td>
                    <td className="px-6 py-4 text-purple-600 font-bold">{row.pa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-bold mb-6">Example URLs</h3>
          <div className="space-y-4 mb-12">
            {[
              { t: "Instagram bio link:", url: "https://yoursite.com?utm_source=instagram&utm_medium=social&utm_campaign=bio_link_evergreen&utm_content=profile" },
              { t: "Instagram Story:", url: "https://yoursite.com/product?utm_source=instagram&utm_medium=social&utm_campaign=spring_launch_may2026&utm_content=story" },
              { t: "Instagram paid ad:", url: "https://yoursite.com/landing?utm_source=instagram&utm_medium=paid_social&utm_campaign=spring_launch_may2026&utm_content=single_image_v2" }
            ].map((ex, i) => (
              <div key={i} className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[10px] sm:text-xs text-purple-400 break-all">
                <p className="m-0 text-slate-500 font-sans font-bold mb-2 uppercase tracking-widest text-[9px]">{ex.t}</p>
                {ex.url}
              </div>
            ))}
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-black mb-6 uppercase tracking-widest text-xs text-purple-600">Instagram-Specific Tips</h3>
            <ul className="grid gap-6 list-none p-0 m-0">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-purple-500 mt-2" />
                <span><strong>Update your bio link UTM when running a campaign</strong>: Your bio link should normally point to your homepage or most important page with an evergreen tag. When you&apos;re actively running a campaign, update it to a campaign-specific URL with a campaign tag. Announce this to followers with &quot;link in bio&quot; in your posts.</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-purple-500 mt-2" />
                <span><strong>Tag each Story separately if you post multiple Stories per campaign</strong>: Use <code>utm_content</code> to distinguish between them: <code>utm_content=story_day1</code>, <code>utm_content=story_day2</code>, <code>utm_content=story_swipeup</code>.</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-purple-500 mt-2" />
                <span><strong>Don&apos;t tag links in captions</strong>: Links in Instagram captions aren&apos;t clickable, so UTM tagging them is pointless. Focus your tagging energy on bio links and Stories.</span>
              </li>
            </ul>
          </div>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-12 tracking-tight">LinkedIn UTM Tracking</h2>
          <p className="mb-10 leading-relaxed">LinkedIn is the most valuable platform for B2B marketers and deserves its own careful UTM strategy. LinkedIn traffic can come from personal posts, Company Page posts, articles, sponsored content, and InMail.</p>

          <h3 className="text-xl font-bold mb-6">Recommended UTM Structure for LinkedIn</h3>
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm mb-12">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Parameter</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Personal Posts</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Company Posts</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Paid (Sponsored)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
                {[
                  { p: "utm_source", b: "linkedin", s: "linkedin", pa: "linkedin" },
                  { p: "utm_medium", b: "social", s: "social", pa: "paid_social" },
                  { p: "utm_campaign", b: "[campaign]", s: "[campaign]", pa: "[campaign_name]" },
                  { p: "utm_content", b: "personal_post", s: "company_post", pa: "[ad_type]" }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-black text-slate-900 dark:text-white">{row.p}</td>
                    <td className="px-6 py-4 text-purple-600 font-bold">{row.b}</td>
                    <td className="px-6 py-4 text-purple-600 font-bold">{row.s}</td>
                    <td className="px-6 py-4 text-purple-600 font-bold">{row.pa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-bold mb-6">Example URLs</h3>
          <div className="space-y-4 mb-12">
            {[
              { t: "LinkedIn personal post:", url: "https://yoursite.com/blog?utm_source=linkedin&utm_medium=social&utm_campaign=thought_leadership_may2026&utm_content=personal_post" },
              { t: "LinkedIn Company Page post:", url: "https://yoursite.com/product?utm_source=linkedin&utm_medium=social&utm_campaign=product_launch_apr2026&utm_content=company_post" },
              { t: "LinkedIn Sponsored Content ad:", url: "https://yoursite.com/demo?utm_source=linkedin&utm_medium=paid_social&utm_campaign=demo_request_q2_2026&utm_content=single_image_ad" },
              { t: "LinkedIn profile \"Website\" link:", url: "https://yoursite.com?utm_source=linkedin&utm_medium=social&utm_campaign=profile_link_evergreen" }
            ].map((ex, i) => (
              <div key={i} className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[10px] sm:text-xs text-purple-400 break-all">
                <p className="m-0 text-slate-500 font-sans font-bold mb-2 uppercase tracking-widest text-[9px]">{ex.t}</p>
                {ex.url}
              </div>
            ))}
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-black mb-6 uppercase tracking-widest text-xs text-purple-600">LinkedIn-Specific Tips</h3>
            <ul className="grid gap-6 list-none p-0 m-0">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-purple-500 mt-2" />
                <span><strong>Tag your profile URL and Company Page &quot;Website&quot; button</strong>: These generate consistent, ongoing traffic that&apos;s often miscounted as direct. Use evergreen UTMs on both.</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-purple-500 mt-2" />
                <span><strong>Distinguish personal vs. company posts</strong>: If both you and your company&apos;s LinkedIn page are posting about the same campaign, use <code>utm_content=personal_post</code> vs <code>utm_content=company_post</code> to see which source drives more traffic.</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-purple-500 mt-2" />
                <span><strong>LinkedIn auto-populates some UTM data for paid ads</strong>: LinkedIn Campaign Manager allows you to set UTM parameters at the campaign or ad level. Always set these manually to ensure consistency with your wider UTM convention.</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-purple-500 mt-2" />
                <span><strong>Articles drive different traffic than posts</strong>: LinkedIn articles (long-form content published natively) can drive steady traffic long after publication. Tag links within articles with: <code>utm_source=linkedin&utm_medium=social&utm_campaign=[article_topic]&utm_content=article</code></span>
              </li>
            </ul>
          </div>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-12 tracking-tight">Twitter/X UTM Tracking</h2>
          <p className="mb-10 leading-relaxed">Twitter/X is a high-volume, fast-moving platform where links get shared, retweeted, and clicked rapidly. UTM tracking is essential here because Twitter&apos;s referral data is inconsistent, and &quot;t.co&quot; shortened links often don&apos;t pass referrer data correctly.</p>

          <h3 className="text-xl font-bold mb-6">Recommended UTM Structure for Twitter/X</h3>
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm mb-12">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Parameter</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Organic Tweets</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Paid (Promoted)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
                {[
                  { p: "utm_source", o: "twitter", pa: "twitter" },
                  { p: "utm_medium", o: "social", pa: "paid_social" },
                  { p: "utm_campaign", o: "[campaign_name]", pa: "[campaign_name]" },
                  { p: "utm_content", o: "tweet", pa: "[ad_type]" }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-black text-slate-900 dark:text-white">{row.p}</td>
                    <td className="px-6 py-4 text-purple-600 font-bold">{row.o}</td>
                    <td className="px-6 py-4 text-purple-600 font-bold">{row.pa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-bold mb-6">Example URLs</h3>
          <div className="space-y-4 mb-12">
            {[
              { t: "Organic tweet:", url: "https://yoursite.com/article?utm_source=twitter&utm_medium=social&utm_campaign=content_may2026&utm_content=tweet" },
              { t: "Twitter/X paid promoted tweet:", url: "https://yoursite.com/landing?utm_source=twitter&utm_medium=paid_social&utm_campaign=brand_awareness_q2_2026&utm_content=promoted_tweet" },
              { t: "Twitter/X profile bio link:", url: "https://yoursite.com?utm_source=twitter&utm_medium=social&utm_campaign=bio_link_evergreen" }
            ].map((ex, i) => (
              <div key={i} className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[10px] sm:text-xs text-purple-400 break-all">
                <p className="m-0 text-slate-500 font-sans font-bold mb-2 uppercase tracking-widest text-[9px]">{ex.t}</p>
                {ex.url}
              </div>
            ))}
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-black mb-6 uppercase tracking-widest text-xs text-purple-600">Twitter/X-Specific Tips</h3>
            <ul className="grid gap-6 list-none p-0 m-0">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-purple-500 mt-2" />
                <span><strong>Tag every link you tweet — without exception</strong>: Twitter is notorious for inconsistent referrer passing. Even tweets that technically pass a referrer can end up as &quot;direct&quot; in GA4. UTMs are the only reliable way to capture Twitter traffic.</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-purple-500 mt-2" />
                <span><strong>Keep tweet UTM URLs short</strong>: Twitter posts are character-limited (280 characters). A long UTM URL can take up most of your character count. Options: (1) Use a URL shortener after generating your UTM URL, (2) Keep campaign names short, (3) Use abbreviations in utm_content (e.g., <code>tw</code> instead of <code>tweet</code>).</span>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-purple-500 mt-2" />
                <span><strong>Tag thread links</strong>: If you write a Twitter thread with links at the end, tag them. Thread traffic often represents your most engaged readers — and you want to know how they convert.</span>
              </li>
            </ul>
          </div>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-12 tracking-tight">Building a Social Media UTM URL: Step by Step</h2>
          <p className="mb-10 text-lg leading-relaxed">Regardless of platform, the process is the same:</p>
          
          <ol className="grid gap-4 list-none p-0 m-0 text-sm font-medium">
            {[
              "Open **[findbest.tools/utility/utm-builder](https://findbest.tools/utility/utm-builder)**",
              "Enter your destination URL",
              "Select your utm_source (e.g., `facebook`)",
              "Set utm_medium (`social` or `paid_social`)",
              "Enter a descriptive utm_campaign name",
              "Add utm_content to identify the specific post type or creative",
              "Copy the generated URL",
              "For social posts where length matters, run it through a URL shortener",
              "Paste into your post, story, ad, or bio"
            ].map((item, i) => (
              <li key={i} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">{i+1}</span>
                <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*\[(.*?)\]\((.*?)\)\*\*/g, '<strong><a href="$2" class="underline">$1</a></strong>').replace(/`([^`]+)`/g, '<code>$1</code>') }} />
              </li>
            ))}
          </ol>
          <p className="mt-8 text-center text-slate-500 font-medium italic">This takes under 60 seconds and gives you clean, attributable data for every click.</p>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Evergreen Bio Link UTM Template</h2>
          <p className="mb-8">Each platform profile should have a permanent, tagged link. Here&apos;s the template for each:</p>
          
          <div className="bg-slate-950 p-10 rounded-[2.5rem] border border-slate-800 text-slate-300 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto shadow-2xl">
            <div className="space-y-6">
              {[
                { l: "Facebook Page", u: "utm_source=facebook&utm_medium=social&utm_campaign=bio_link_evergreen" },
                { l: "Instagram Bio", u: "utm_source=instagram&utm_medium=social&utm_campaign=bio_link_evergreen" },
                { l: "LinkedIn Profile", u: "utm_source=linkedin&utm_medium=social&utm_campaign=bio_link_evergreen" },
                { l: "LinkedIn Company Page", u: "utm_source=linkedin&utm_medium=social&utm_campaign=company_page_evergreen" },
                { l: "Twitter/X Bio", u: "utm_source=twitter&utm_medium=social&utm_campaign=bio_link_evergreen" }
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-purple-500 font-black mb-2">{item.l}:</p>
                  <p className="m-0 break-all opacity-80">{item.u}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-8 text-sm text-slate-500 leading-relaxed">Update the campaign name when you&apos;re actively promoting something specific (e.g., <code>utm_campaign=spring_launch_may2026</code>). Revert to the evergreen tag after the campaign ends.</p>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Reading Social UTM Data in GA4</h2>
          <p className="mb-10">To analyze social UTM performance in GA4:</p>
          
          <div className="grid gap-6">
            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="font-black text-slate-900 dark:text-white mb-2 leading-tight uppercase tracking-widest text-[10px]">Channel-level view:</p>
              <p className="m-0 text-sm leading-relaxed text-slate-600 dark:text-slate-400">Reports → Acquisition → Traffic Acquisition → filter or group by &quot;Session medium&quot; → look for <code>social</code> and <code>paid_social</code></p>
            </div>
            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="font-black text-slate-900 dark:text-white mb-2 leading-tight uppercase tracking-widest text-[10px]">Platform breakdown:</p>
              <p className="m-0 text-sm leading-relaxed text-slate-600 dark:text-slate-400">Change dimension to &quot;Session source/medium&quot; → compare <code>facebook / social</code>, <code>instagram / social</code>, <code>linkedin / social</code>, <code>twitter / social</code></p>
            </div>
            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="font-black text-slate-900 dark:text-white mb-2 leading-tight uppercase tracking-widest text-[10px]">Campaign comparison across social:</p>
              <p className="m-0 text-sm leading-relaxed text-slate-600 dark:text-slate-400">Dimension: Session campaign → filter medium = social</p>
            </div>
            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="font-black text-slate-900 dark:text-white mb-2 leading-tight uppercase tracking-widest text-[10px]">Content performance:</p>
              <p className="m-0 text-sm leading-relaxed text-slate-600 dark:text-slate-400">Use Explorations → add dimensions: Session source + Session manual ad content → see which specific post types (feed post, story, bio link) drive the most valuable traffic</p>
            </div>
          </div>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-12 tracking-tight">Social UTM Quick Reference Sheet</h2>
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Platform</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Surface</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">utm_source</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">utm_medium</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">utm_content</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                {[
                  { p: "Facebook", s: "Organic post", so: "facebook", m: "social", c: "feed_post" },
                  { p: "Facebook", s: "Story", so: "facebook", m: "social", c: "story" },
                  { p: "Facebook", s: "Paid ad", so: "facebook", m: "paid_social", c: "[creative]" },
                  { p: "Facebook", s: "Bio/Page link", so: "facebook", m: "social", c: "page_link" },
                  { p: "Instagram", s: "Bio link", so: "instagram", m: "social", c: "profile" },
                  { p: "Instagram", s: "Story", so: "instagram", m: "social", c: "story" },
                  { p: "Instagram", s: "Paid ad", so: "instagram", m: "paid_social", c: "[creative]" },
                  { p: "LinkedIn", s: "Personal post", so: "linkedin", m: "social", c: "personal_post" },
                  { p: "LinkedIn", s: "Company post", so: "linkedin", m: "social", c: "company_post" },
                  { p: "LinkedIn", s: "Paid ad", so: "linkedin", m: "paid_social", c: "[ad_type]" },
                  { p: "Twitter/X", s: "Tweet", so: "twitter", m: "social", c: "tweet" },
                  { p: "Twitter/X", s: "Paid tweet", so: "twitter", m: "paid_social", c: "promoted_tweet" }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-3 font-sans font-black text-slate-900 dark:text-white">{row.p}</td>
                    <td className="px-6 py-3 font-sans text-slate-500 italic">{row.s}</td>
                    <td className="px-6 py-3 text-purple-600 font-bold">{row.so}</td>
                    <td className="px-6 py-3 text-purple-600 font-bold">{row.m}</td>
                    <td className="px-6 py-3 text-purple-600 font-bold">{row.c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-8 text-sm text-center text-slate-500 font-medium">Build all of these using <strong><Link href="/utility/utm-builder" className="underline">findbest.tools/utility/utm-builder</Link></strong> — it generates the correctly formatted URL for any combination in seconds.</p>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Final Thoughts</h2>
          <p>Social media UTM tracking isn&apos;t just about knowing that &quot;social&quot; sent you 500 sessions this month. It&apos;s about knowing that LinkedIn personal posts drove 3x more conversions than company posts, that Instagram Stories outperformed bio link clicks for the spring campaign, and that Twitter brought high-volume but low-conversion traffic compared to Facebook.</p>
          <p className="text-lg leading-relaxed font-black text-slate-900 dark:text-white my-8">That level of insight is what transforms social media from a channel you manage by feel into one you optimize with data.</p>
          <p>Start tagging every social link today. Your analytics — and your strategy — will never look the same.</p>
        </section>

        <div className="mt-24 p-12 bg-purple-600 rounded-[3rem] text-center shadow-2xl relative overflow-hidden group border border-purple-500 shadow-purple-500/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="relative z-10">
            <h2 className="text-4xl font-black text-white mb-6 leading-tight tracking-tight">Master Your Social Attribution</h2>
            <p className="text-purple-100 mb-10 max-w-2xl mx-auto text-lg leading-relaxed font-medium opacity-90">
              Ready to track your next social post? Use our free UTM builder to ensure every link is tagged correctly for Facebook, Instagram, LinkedIn, and Twitter.
            </p>
            <Link 
              href="/utility/utm-builder" 
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-purple-600 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              Open UTM Builder &rarr;
            </Link>
            <div className="mt-12 pt-12 border-t border-purple-500 flex flex-col items-center gap-4">
              <p className="text-purple-200 text-xs font-bold uppercase tracking-widest">Next up</p>
              <Link 
                href="/blog/read-utm-reports-ga4" 
                className="text-white font-black hover:text-purple-100 transition-colors underline underline-offset-8 decoration-2"
              >
                How to Read UTM Reports in Google Analytics 4 (Step-by-Step) &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
