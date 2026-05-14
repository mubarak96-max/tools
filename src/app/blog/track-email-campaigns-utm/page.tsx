import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";
import { AuthorSection } from "@/components/blog/AuthorSection";

const PAGE_PATH = "/blog/track-email-campaigns-utm";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "How to Track Every Email Campaign with UTM Links (+ Free Template)",
  description: "Stop flying blind with your email marketing. Learn how to use UTM parameters to track every click, calculate true ROI, and optimize your email sequences.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "How to Track Every Email Campaign with UTM Links (+ Free Template)",
    description: "A complete system for tracking email marketing performance. Includes naming convention templates and GA4 reporting tips.",
    url: PAGE_URL,
    type: "article",
  },
};

export default function EmailUtmTrackingBlogPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Email UTM Tracking", path: PAGE_PATH },
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <JsonLd data={serializeJsonLd(breadcrumbs)} />

      <header className="mb-16">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-500 mb-8 uppercase tracking-widest font-bold">
          <Link href="/" className="hover:text-sky-600 transition-colors">Home</Link>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <Link href="/blog" className="hover:text-sky-600 transition-colors">Blog</Link>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span className="text-slate-900 dark:text-slate-100">Email UTM Tracking</span>
        </nav>
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-sky-500/10 text-sky-500 text-xs font-black uppercase tracking-widest">
            Email Marketing · Analytics
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
            How to Track Every Email Campaign with UTM Links (+ Free Template)
          </h1>
          <div className="pt-4">
            <AuthorSection />
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 ml-1">
              Published April 2026
            </div>
          </div>
        </div>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <section className="mb-12">
          <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            Email marketing consistently delivers some of the highest ROI of any digital marketing channel. Studies from the Data & Marketing Association have long placed email ROI in the range of $36–$42 for every $1 spent. And yet, most email marketers can&apos;t tell you with certainty which emails are actually driving conversions — because they&apos;re not tracking their links correctly.
          </p>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            The culprit? Missing or poorly structured UTM parameters.
          </p>
          <p>
            When email links aren&apos;t tagged with UTMs, all that traffic lands in Google Analytics labeled as &quot;direct&quot; — as if users typed your URL directly into their browser. Your email performance is invisible. Your ROI calculation is guesswork.
          </p>
          <p>
            This guide shows you how to fix that: a complete system for tracking every email campaign with UTM parameters, including a naming convention template and a step-by-step walkthrough for setting it up.
          </p>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Why Email Traffic Gets Misattributed</h2>
          
          <p>Before diving into the how, it&apos;s worth understanding why this problem exists.</p>
          
          <p>When someone clicks a link in a web browser, the referring URL is passed to the destination site — which is how Google Analytics knows the visit came from, say, a Facebook post. But email clients don&apos;t work the same way. Most desktop email clients (Outlook, Apple Mail) and many mobile clients don&apos;t pass referrer information at all. When the link is clicked, there&apos;s no HTTP referrer to capture.</p>
          
          <p>Without a referrer, Google Analytics defaults to labeling the session &quot;direct/none&quot; — the catch-all bucket for sessions where the source is unknown.</p>
          
          <p className="font-bold text-slate-900 dark:text-white mt-8">UTM parameters solve this entirely.</p>
          <p>Instead of relying on referrer data (which email clients don&apos;t send), you&apos;re embedding the source information directly into the URL. The analytics platform doesn&apos;t need to guess — the data is right there in the link.</p>
          
          <p>This is why UTM tagging is non-negotiable for email campaigns. Without it, you&apos;re flying blind.</p>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-12 tracking-tight">The Right UTM Structure for Email</h2>
          
          <p>For email campaigns, there are three to five parameters you&apos;ll use:</p>

          <div className="space-y-12 mt-12">
            <div>
              <h3 className="text-xl font-black mb-6 text-sky-600 uppercase tracking-widest text-xs">Required Parameters</h3>
              
              <div className="space-y-8">
                <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
                  <p className="font-black text-slate-900 dark:text-white mb-2">utm_source</p>
                  <p className="mb-4">Identifies which email list, platform, or email type sent the traffic.</p>
                  <p className="text-sm font-bold mb-2">Options:</p>
                  <ul className="grid gap-1 list-none p-0 text-sm text-slate-500">
                    <li>• <code>newsletter</code> — for your main subscriber newsletter</li>
                    <li>• <code>email</code> — generic email traffic</li>
                    <li>• <code>mailchimp</code>, <code>klaviyo</code>, <code>hubspot</code>, <code>activecampaign</code> — if you want to track by platform</li>
                    <li>• <code>drip</code>, <code>onboarding</code>, <code>winback</code> — for specific automated sequences</li>
                  </ul>
                  <p className="mt-6 text-xs italic">Best practice: use <code>newsletter</code> for broadcast emails and the sequence name (e.g., <code>welcome_sequence</code>) for automated flows. This gives you cleaner segmentation.</p>
                </div>

                <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
                  <p className="font-black text-slate-900 dark:text-white mb-2">utm_medium</p>
                  <p className="mb-4">For email, this is always <code>email</code>. No exceptions, no variations.</p>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-sky-400 font-mono text-sm inline-block">
                    utm_medium=email
                  </div>
                  <p className="mt-6 text-sm leading-relaxed text-slate-500">Consistent use of this value means all email traffic gets grouped together correctly in GA4&apos;s channel reporting — under &quot;Email&quot; — regardless of the source variation.</p>
                </div>

                <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
                  <p className="font-black text-slate-900 dark:text-white mb-2">utm_campaign</p>
                  <p className="mb-4">Identifies the specific email or campaign. This is where most of the useful differentiation happens.</p>
                  <p className="text-xs font-black uppercase tracking-widest mb-2">Use this format:</p>
                  <code className="block bg-slate-950 p-4 rounded-xl border border-slate-800 text-sky-400 text-sm mb-6">[email_type]_[description]_[date]</code>
                  <p className="font-bold text-xs text-slate-500 mb-3">Examples:</p>
                  <ul className="list-none p-0 m-0 space-y-1 text-xs font-mono text-slate-500">
                    <li>• newsletter_weekly_digest_may2026</li>
                    <li>• promo_spring_sale_apr2026</li>
                    <li>• drip_onboarding_email3_evergreen</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-black mb-6 text-slate-500 uppercase tracking-widest text-xs">Optional Parameters</h3>
              
              <div className="space-y-8">
                <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
                  <p className="font-black text-slate-900 dark:text-white mb-2">utm_content</p>
                  <p className="mb-6">Use this to differentiate between multiple links in the same email. This is especially valuable for emails with more than one CTA.</p>
                  <p className="font-bold text-xs text-slate-500 mb-3">Examples:</p>
                  <ul className="list-none p-0 m-0 space-y-1 text-sm font-mono text-slate-500">
                    <li>• <code>utm_content=hero_cta</code> — the main button at the top</li>
                    <li>• <code>utm_content=body_link</code> — a text link mid-email</li>
                    <li>• <code>utm_content=footer_cta</code> — a secondary CTA at the bottom</li>
                  </ul>
                  <p className="mt-8 m-0 leading-relaxed text-slate-600 dark:text-slate-400 italic">With <code>utm_content</code>, you can see not just that an email drove traffic, but *which specific link* drove the most clicks. This informs your email design — if the footer CTA outperforms the hero button, that&apos;s a design insight worth acting on.</p>
                </div>

                <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
                  <p className="font-black text-slate-900 dark:text-white mb-2">utm_term</p>
                  <p className="mb-6">Rarely used in email, but can be useful for personalized or segmented emails. For example:</p>
                  <ul className="list-none p-0 m-0 space-y-2 text-sm text-slate-500">
                    <li className="flex gap-4">
                      <span className="text-sky-500 font-black">•</span>
                      <span><code>utm_term=enterprise</code> vs <code>utm_term=smb</code> if you&apos;re sending segmented versions to different audiences</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Email UTM Naming Convention Template</h2>
          <p className="mb-8 text-lg">Here&apos;s a ready-to-use template for your team:</p>
          <pre className="bg-slate-950 p-10 rounded-[2.5rem] border border-slate-800 text-slate-300 font-mono text-xs leading-relaxed overflow-x-auto shadow-2xl">
{`EMAIL UTM CONVENTION
====================

utm_source options:
  newsletter        → Broadcast newsletter emails
  welcome_series    → Welcome/onboarding sequence
  winback           → Win-back/re-engagement sequence
  [promo_name]      → Named promotional campaigns (e.g., spring_sale)
  transactional     → Order confirmations, receipts, shipping notifications

utm_medium:
  Always: email

utm_campaign format:
  [type]_[description]_[month][year]
  Examples:
    newsletter_weekly_may2026
    promo_black_friday_nov2026
    drip_onboarding_email1_evergreen

utm_content (use when email has multiple links):
  hero_button       → Primary CTA button
  body_link_1       → First in-text link
  body_link_2       → Second in-text link
  footer_cta        → Footer call-to-action
  ps_link           → P.S. section link
  banner_image      → Clickable image/banner

utm_term (optional, for segmented sends):
  [segment_name]    → e.g., enterprise, smb, free_trial, paid_user`}
          </pre>
          <p className="mt-8 text-center text-sm font-medium text-slate-500">Copy this into your team&apos;s internal documentation and reference it every time a new email campaign is built.</p>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-12 tracking-tight">Step-by-Step: Building UTM Links for an Email Campaign</h2>
          <p className="mb-10 text-lg leading-relaxed">Let&apos;s walk through a real example. You&apos;re sending a promotional email for a product sale. The email has three links: a hero button, a body text link, and a P.S. link.</p>
          
          <div className="space-y-12">
            <div className="flex gap-6 items-start">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-black">1</span>
              <div>
                <p className="text-xl font-black text-slate-900 dark:text-white mb-2">Open the UTM Builder</p>
                <p className="text-slate-600 dark:text-slate-400">Go to <strong><Link href="/utility/utm-builder" className="text-sky-600 underline underline-offset-4 decoration-2">findbest.tools/utility/utm-builder</Link></strong>.</p>
              </div>
            </div>
            
            <div className="flex gap-6 items-start">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-black">2</span>
              <div>
                <p className="text-xl font-black text-slate-900 dark:text-white mb-2">Build the hero button link</p>
                <ul className="list-none p-0 m-0 space-y-1 text-sm text-slate-500">
                  <li>• Destination URL: <code>https://yoursite.com/spring-sale</code></li>
                  <li>• utm_source: <code>newsletter</code></li>
                  <li>• utm_medium: <code>email</code></li>
                  <li>• utm_campaign: <code>promo_spring_sale_apr2026</code></li>
                  <li>• utm_content: <code>hero_button</code></li>
                </ul>
                <div className="mt-6 p-4 bg-slate-900 rounded-xl border border-slate-800 font-mono text-[10px] sm:text-xs text-sky-400 break-all">
                  https://yoursite.com/spring-sale?utm_source=newsletter&utm_medium=email&utm_campaign=promo_spring_sale_apr2026&utm_content=hero_button
                </div>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-black">3</span>
              <div>
                <p className="text-xl font-black text-slate-900 dark:text-white mb-2">Build the body text link</p>
                <p>Same parameters, but change utm_content:</p>
                <ul className="list-none p-0 m-0 space-y-1 text-sm text-slate-500">
                  <li>• utm_content: <code>body_link</code></li>
                </ul>
                <div className="mt-6 p-4 bg-slate-900 rounded-xl border border-slate-800 font-mono text-[10px] sm:text-xs text-sky-400 break-all">
                  https://yoursite.com/spring-sale?utm_source=newsletter&utm_medium=email&utm_campaign=promo_spring_sale_apr2026&utm_content=body_link
                </div>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-black">4</span>
              <div>
                <p className="text-xl font-black text-slate-900 dark:text-white mb-2">Build the P.S. link</p>
                <ul className="list-none p-0 m-0 space-y-1 text-sm text-slate-500">
                  <li>• utm_content: <code>ps_link</code></li>
                </ul>
                <div className="mt-6 p-4 bg-slate-900 rounded-xl border border-slate-800 font-mono text-[10px] sm:text-xs text-sky-400 break-all">
                  https://yoursite.com/spring-sale?utm_source=newsletter&utm_medium=email&utm_campaign=promo_spring_sale_apr2026&utm_content=ps_link
                </div>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-black">5</span>
              <div>
                <p className="text-xl font-black text-slate-900 dark:text-white mb-2">Place the URLs in your email</p>
                <p className="m-0 leading-relaxed text-slate-600 dark:text-slate-400">Replace the plain destination URLs in your email template with the UTM-tagged versions. Each link is unique — so you&apos;ll know exactly which one drove each click.</p>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Tracking Automated Email Sequences</h2>
          
          <p>For automated email sequences (welcome series, onboarding flows, re-engagement campaigns), the approach is slightly different because these emails run continuously.</p>
          
          <p className="font-bold text-slate-900 dark:text-white mt-10 mb-4">Use evergreen campaign names:</p>
          <p>Instead of date-stamping evergreen emails, use a sequence identifier:</p>
          <ul className="list-none p-0 m-0 space-y-2 font-mono text-sm text-sky-600">
            <li>• utm_campaign=welcome_series_email1</li>
            <li>• utm_campaign=welcome_series_email2</li>
            <li>• utm_campaign=welcome_series_email3</li>
          </ul>
          
          <p className="mt-8">This lets you see which email in the sequence drives the most site visits and conversions — an invaluable insight for optimizing your automation.</p>
          
          <p className="font-bold text-slate-900 dark:text-white mt-10 mb-4">Include the email number or stage:</p>
          <p>For long sequences, number your emails in the campaign name so you can compare performance across the funnel:</p>
          <ul className="list-none p-0 m-0 space-y-2 font-mono text-sm text-slate-500">
            <li>• drip_trial_onboarding_day1</li>
            <li>• drip_trial_onboarding_day3</li>
            <li>• drip_trial_onboarding_day7</li>
            <li>• drip_trial_onboarding_day14</li>
          </ul>
          
          <p className="mt-8">If Day 14 emails drive the most conversions, that tells you something important about when your audience is ready to buy.</p>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Tracking Transactional Emails</h2>
          
          <p>Transactional emails — order confirmations, shipping notifications, account alerts — are often overlooked for UTM tracking because they&apos;re not &quot;marketing&quot; emails. But they still contain links, and those links drive real traffic.</p>
          
          <p className="font-bold text-slate-900 dark:text-white mt-10 mb-4">Tag transactional email links with:</p>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 font-mono text-sm mb-8 space-y-1">
            <p className="m-0">utm_source=transactional</p>
            <p className="m-0">utm_medium=email</p>
            <p className="m-0">utm_campaign=[email_type]</p>
          </div>
          
          <p className="font-bold text-slate-900 dark:text-white mb-4">For example:</p>
          <ul className="list-none p-0 m-0 space-y-1 font-mono text-sm text-slate-500">
            <li>• <code>utm_campaign=order_confirmation</code></li>
            <li>• <code>utm_campaign=shipping_notification</code></li>
            <li>• <code>utm_campaign=password_reset</code></li>
          </ul>
          
          <p className="mt-8">This keeps transactional traffic separate from marketing email traffic in your reports, so each bucket is clean and attributable.</p>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Where to Find Email UTM Data in GA4</h2>
          
          <p>Once your UTM-tagged emails are sending, here&apos;s how to find the data:</p>

          <div className="space-y-8 mt-10">
            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="font-black text-slate-900 dark:text-white mb-4">Traffic Acquisition Report</p>
              <ol className="list-decimal pl-6 m-0 text-sm space-y-2">
                <li>Go to Reports → Acquisition → Traffic Acquisition</li>
                <li>Change the primary dimension to <strong>Session source/medium</strong></li>
                <li>Look for <code>newsletter / email</code>, <code>welcome_series / email</code>, etc.</li>
              </ol>
            </div>
            
            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="font-black text-slate-900 dark:text-white mb-4">Campaign Performance</p>
              <ol className="list-decimal pl-6 m-0 text-sm space-y-2">
                <li>In the same report, change the dimension to <strong>Session campaign</strong></li>
                <li>Filter by medium = email to see only email campaigns</li>
              </ol>
            </div>

            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="font-black text-slate-900 dark:text-white mb-4">Content Performance (utm_content)</p>
              <ol className="list-decimal pl-6 m-0 text-sm space-y-2">
                <li>In Explore (GA4&apos;s analysis tool), create a free-form exploration</li>
                <li>Add dimensions: Session campaign + Session manual ad content</li>
                <li>This shows you which specific links within each email drove traffic</li>
              </ol>
            </div>
          </div>
          
          <p className="mt-12 text-slate-600 dark:text-slate-400 leading-relaxed italic border-l-4 border-sky-500 pl-8 font-medium">
            This breakdown is where the real power of utm_content becomes visible. You can see, for example, that your P.S. links consistently outperform hero buttons — and redesign your emails accordingly.
          </p>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-12 tracking-tight">Common Email UTM Mistakes to Avoid</h2>
          
          <div className="grid gap-6">
            <div className="p-6 bg-rose-50/50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-100/10 rounded-2xl">
              <p className="font-black text-slate-900 dark:text-white mb-2 text-sm uppercase tracking-widest">Mistake #1</p>
              <p className="font-bold mb-2">Don&apos;t use utm_source=email as your only source</p>
              <p className="m-0 text-sm text-slate-600 dark:text-slate-400">If everything is tagged <code>utm_source=email</code>, you lose the ability to distinguish between your newsletter, your onboarding sequence, and your promotional campaigns. Use specific source names to maintain granularity.</p>
            </div>
            <div className="p-6 bg-rose-50/50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-100/10 rounded-2xl">
              <p className="font-black text-slate-900 dark:text-white mb-2 text-sm uppercase tracking-widest">Mistake #2</p>
              <p className="font-bold mb-2">Don&apos;t forget to tag every link in the email</p>
              <p className="m-0 text-sm text-slate-600 dark:text-slate-400">If your email has five links and you only tag three, the untagged two will show as direct traffic. Tag every link that points to your website.</p>
            </div>
            <div className="p-6 bg-rose-50/50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-100/10 rounded-2xl">
              <p className="font-black text-slate-900 dark:text-white mb-2 text-sm uppercase tracking-widest">Mistake #3</p>
              <p className="font-bold mb-2">Don&apos;t use the same campaign name for every email</p>
              <p className="m-0 text-sm text-slate-600 dark:text-slate-400"><code>utm_campaign=newsletter</code> tells you nothing. Tag each issue or campaign with a specific, date-stamped name.</p>
            </div>
            <div className="p-6 bg-rose-50/50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-100/10 rounded-2xl">
              <p className="font-black text-slate-900 dark:text-white mb-2 text-sm uppercase tracking-widest">Mistake #4</p>
              <p className="font-bold mb-2">Don&apos;t put UTMs on unsubscribe or preference center links</p>
              <p className="m-0 text-sm text-slate-600 dark:text-slate-400">These go to email service provider pages, not your website. UTM parameters on these links are pointless and add visual noise to your URLs.</p>
            </div>
            <div className="p-6 bg-rose-50/50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-100/10 rounded-2xl">
              <p className="font-black text-slate-900 dark:text-white mb-2 text-sm uppercase tracking-widest">Mistake #5</p>
              <p className="font-bold mb-2">Don&apos;t skip testing before you send</p>
              <p className="m-0 text-sm text-slate-600 dark:text-slate-400">Always click every link in a test send to verify that the UTM parameters are there and correct before you hit send to your full list.</p>
            </div>
          </div>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Email UTM Checklist (Pre-Send)</h2>
          <p className="mb-8">Print this out or add it to your email QA process:</p>
          <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 text-slate-100 shadow-2xl">
            <p className="text-sky-400 font-black text-xs uppercase tracking-[0.3em] mb-10">EMAIL UTM PRE-SEND CHECKLIST</p>
            <ul className="grid gap-6 list-none pl-0 m-0">
              {[
                "Every link pointing to your website has UTM parameters",
                "utm_medium=email on all links (lowercase)",
                "utm_source matches your approved naming convention",
                "utm_campaign is descriptive and date-stamped",
                "utm_content is unique for each link in the email",
                "All values are lowercase with no spaces",
                "URLs built using findbest.tools/utility/utm-builder",
                "Test email sent and all links verified by clicking through",
                "Destination pages load correctly with UTM parameters in the URL"
              ].map((item, i) => (
                <li key={i} className="flex gap-6 items-center">
                  <div className="w-5 h-5 rounded border border-white/20 flex-shrink-0" />
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <hr className="border-slate-100 dark:border-slate-800 my-16" />

        <section className="mb-16">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">The Long-Term Payoff</h2>
          
          <p>Once you&apos;ve been consistently tagging email campaigns for a few months, the insights compound. You&apos;ll be able to:</p>
          
          <ul className="grid gap-4 list-none pl-0 mt-8">
            {[
              "Compare email revenue contribution quarter-over-quarter",
              "Identify which email types (newsletters vs. promos vs. sequences) drive the highest-value traffic",
              "Optimize email send cadence based on conversion data",
              "Prove email ROI to stakeholders with hard numbers",
              "Identify which CTAs and link placements get the most clicks"
            ].map((item, i) => (
              <li key={i} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 flex gap-4">
                <span className="text-sky-500 font-black">•</span>
                <span className="text-sm font-medium">{item}</span>
              </li>
            ))}
          </ul>
          
          <p className="mt-12 text-lg leading-relaxed">Email marketing is already one of the highest-ROI channels available to marketers. UTM tracking is what transforms it from a channel you <em>feel</em> is working to a channel you can <em>prove</em> is working — with data.</p>
        </section>

        <div className="mt-24 p-12 bg-sky-600 rounded-[3rem] text-center shadow-2xl relative overflow-hidden group border border-sky-500 shadow-sky-500/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="relative z-10">
            <h2 className="text-4xl font-black text-white mb-6 leading-tight tracking-tight">Build Your First Tagged Email Link Right Now</h2>
            <p className="text-sky-100 mb-10 max-w-2xl mx-auto text-lg leading-relaxed font-medium opacity-90">
              Head to <strong><Link href="/utility/utm-builder" className="underline underline-offset-4 decoration-2">findbest.tools/utility/utm-builder</Link></strong>, build a tagged version of your next email&apos;s primary CTA, and save the convention template from this guide to your team&apos;s shared docs.
            </p>
            <Link 
              href="/utility/utm-builder" 
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-sky-600 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              Open UTM Builder &rarr;
            </Link>
            <p className="mt-10 text-white font-black text-lg">Your email data will never be invisible again.</p>
            <div className="mt-12 pt-12 border-t border-sky-500 flex flex-col items-center gap-4">
              <p className="text-sky-200 text-xs font-bold uppercase tracking-widest">Continue reading</p>
              <Link 
                href="/blog/social-media-utm-tracking" 
                className="text-white font-black hover:text-sky-100 transition-colors underline underline-offset-8 decoration-2"
              >
                UTM Tracking for Social Media: Facebook, Instagram, LinkedIn & Twitter &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
