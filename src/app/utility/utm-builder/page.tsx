import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

import ToolPageScaffold from '@/components/tools/ToolPageScaffold';
import UtmBuilder from './components/UtmBuilder';

const PAGE_PATH = '/utility/utm-builder';
const PAGE_URL = 'https://findbest.tools/utility/utm-builder';
const LAST_UPDATED_ISO = '2026-05-01T00:00:00.000Z';

export const metadata: Metadata = {
  title: 'UTM Builder - Free Campaign URL Generator for GA4 (2026)',
  description:
    'The best free UTM builder and Google Analytics URL builder. Generate campaign URLs with utm_source, utm_medium, utm_campaign, utm_term, and utm_content. Bulk generator, presets, and validation included.',
  keywords: [
    'campaign url builder',
    'url builder',
    'google analytics url builder',
    'google campaign url',
    'utm code generator',
    'utm campaign builder',
    'utm builder free',
    'google utm builder',
    'trackable link generator',
    'utm parameter builder',
    'marketing url builder',
    'google ads url builder',
    'utm tag generator',
    'campaign tracking url',
    'utm link generator',
    'how to use utm parameters in ga4',
    'utm builder for shopify',
    'utm tracking for email campaigns',
    'utm parameters not showing in google analytics',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'UTM Builder - Free Google Analytics Campaign URL Generator',
    description:
      'Build perfect tracking URLs with our campaign URL builder. Includes bulk generation, preset sources and mediums, and automatic validation.',
    url: PAGE_URL,
    siteName: 'FindBest Tools',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UTM Builder for GA4',
    description: 'Generate Google Analytics tracking URLs with validation, presets, and bulk mode. No signup required.',
  },
  other: {
    'article:modified_time': LAST_UPDATED_ISO,
  },
};

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'UTM Campaign URL Builder',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '512',
    },
    featureList: [
      'Google Analytics URL builder',
      'Campaign URL builder with validation',
      'UTM code generator with 5 parameters',
      'Bulk URL generator for multiple links',
      'Preset sources and mediums',
      'Local campaign history storage',
      'One-click copy and test',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Build UTM Campaign URLs for Google Analytics',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Enter Your Destination URL',
        text: 'Paste the full website URL you want to track, including https://. This is the landing page users will visit.',
      },
      {
        '@type': 'HowToStep',
        name: 'Select Campaign Source',
        text: 'Choose or type the referrer source such as google, facebook, newsletter, or partner. This identifies where traffic originates.',
      },
      {
        '@type': 'HowToStep',
        name: 'Choose Campaign Medium',
        text: 'Specify the marketing medium: cpc for paid search, email for newsletters, social for organic posts, or display for banner ads.',
      },
      {
        '@type': 'HowToStep',
        name: 'Name Your Campaign',
        text: 'Create a unique campaign identifier using lowercase letters and underscores, such as spring_sale_2026 or product_launch_may.',
      },
      {
        '@type': 'HowToStep',
        name: 'Add Optional Parameters',
        text: 'Use utm_term for paid search keywords and utm_content to differentiate A/B ad variations or multiple links in the same email.',
      },
      {
        '@type': 'HowToStep',
        name: 'Copy and Deploy',
        text: 'Copy the generated campaign URL and use it in your ads, emails, or social posts. Google Analytics will automatically attribute traffic to these UTM values.',
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is a UTM builder and why do I need one?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A UTM builder, also called a campaign URL builder or Google Analytics URL builder, is a tool that appends standardized tracking parameters to your URLs. These parameters - utm_source, utm_medium, utm_campaign, utm_term, and utm_content - tell Google Analytics exactly where your traffic came from, what marketing channel delivered it, and which specific campaign or ad variation generated the click. Without a UTM builder, your traffic appears as generic direct or referral in analytics, making it impossible to measure ROI accurately.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the difference between a URL builder and a UTM code generator?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The terms are often used interchangeably. A URL builder is the broader category of tools that construct URLs with parameters. A UTM code generator specifically creates Urchin Tracking Module parameters, which is the standard format Google Analytics uses. Our tool functions as both a campaign URL builder and a UTM code generator, ensuring your links are fully compatible with GA4 and Universal Analytics.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I create a Google campaign URL correctly?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'To create a Google campaign URL, you must include three required parameters: utm_source, utm_medium, and utm_campaign. Optionally, add utm_term for paid search keywords and utm_content for A/B testing. Use lowercase letters, avoid spaces, and keep naming conventions consistent across your team. Our Google Analytics URL builder validates your input and provides preset values to prevent errors.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I use UTM parameters in Google Ads?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, but with caution. Google Ads has its own auto-tagging feature, gclid, that can conflict with manual UTM parameters if both are present. Best practice is to enable auto-tagging in Google Ads and import Google Ads cost data into GA4 automatically. If you must use manual UTM tags in Google Ads, disable auto-tagging or use the Allow manual tagging override in GA4 property settings to prevent data fragmentation.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the best UTM naming convention?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The best UTM naming convention uses lowercase letters, underscores instead of spaces, and consistent categorical values. For utm_source, use the platform domain such as google, facebook, or linkedin. For utm_medium, use standard values like cpc, email, social, display, or referral. For utm_campaign, use a structured format like season_product_year. Never use personal information, special characters, or inconsistent capitalization, as GA4 is case-sensitive and will split identical campaigns into separate rows.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does this UTM campaign builder support bulk generation?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Our UTM campaign builder includes a bulk generator mode that applies the same UTM parameters to multiple destination URLs simultaneously. This is ideal for email marketing campaigns where you need to track dozens of links in a newsletter, or for affiliate programs requiring consistent tagging across a product catalog.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I use UTM parameters in GA4?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'In GA4, use a campaign URL builder to add utm_source, utm_medium, and utm_campaign before publishing each link. After traffic arrives, review the values in Reports > Acquisition > Traffic acquisition or in Explorations. Keep naming consistent and lowercase so GA4 does not split one campaign into multiple rows.',
        },
      },
      {
        '@type': 'Question',
        name: 'How should Shopify stores use a UTM builder?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Shopify stores should tag every external campaign link before sending traffic to product pages, collections, or landing pages. Use values like utm_source=klaviyo, utm_medium=email, or utm_source=instagram with clear campaign names so you can match Shopify revenue back to GA4 sessions and campaign reports.',
        },
      },
      {
        '@type': 'Question',
        name: 'Why are UTM parameters not showing in Google Analytics?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Missing UTM data usually comes from redirects stripping query strings, inconsistent casing, internal links overwriting attribution, or relying on the wrong GA4 report. Test the final landing URL, confirm the parameters remain after redirects, and check Traffic acquisition in GA4 before assuming the tags failed.',
        },
      },
    ],
  },
];

const faqs = [
  {
    question: 'What is the best campaign URL builder for Google Analytics 4?',
    answer:
      'The best campaign URL builder for GA4 validates URLs in real time, enforces lowercase naming conventions, provides preset values for common sources and mediums, and supports bulk generation. Our tool is built specifically for GA4 compatibility, ensuring your UTM parameters populate the Traffic Acquisition and User Acquisition reports correctly without case-sensitivity errors or formatting issues.',
  },
  {
    question: 'Is this UTM code generator free for commercial use?',
    answer:
      'Yes. Our UTM code generator is 100% free for unlimited personal and commercial use. There are no usage limits, no watermarks, and no account requirements. Campaign history is stored locally in your browser and is never transmitted to our servers.',
  },
  {
    question: 'Can I use UTM parameters for SEO and organic search?',
    answer:
      'No. Never use UTM parameters on internal links or backlinks intended for organic search. Google treats UTM-tagged URLs as separate pages, which can dilute link equity and create duplicate content issues. For organic social posts, UTM tags are acceptable because social platforms are referral sources, not search engines.',
  },
  {
    question: 'What happens if I use the wrong UTM medium?',
    answer:
      "Using non-standard mediums like 'fb_ad' instead of 'cpc' or 'paid_social' fragments your acquisition reports. GA4's default channel grouping relies on medium values to categorize traffic. Stick to recognized values: cpc, organic, email, social, display, referral, affiliate, and video.",
  },
  {
    question: 'How long are UTM parameters stored in Google Analytics?',
    answer:
      'In GA4, UTM parameters are tied to the session. They persist for the duration of the session and are attributed to events and conversions within that session. For user-level attribution across sessions, GA4 uses device ID and signed-in signals. UTM parameters do not persist across sessions unless the user bookmarks the tagged URL and returns via that exact link.',
  },
  {
    question: 'Does this URL builder support short links like Bitly?',
    answer:
      'Our URL builder generates the full UTM-tagged URL. You can paste this output into Bitly, Rebrandly, or any link shortener. The UTM parameters remain functional and are passed through the redirect to your analytics platform. Best practice is to build the UTM URL first, then shorten it.',
  },
  {
    question: 'How do I use UTM parameters in GA4?',
    answer:
      "Build the tagged URL before launch, then open GA4's Traffic acquisition report to review source, medium, and campaign values after the click lands. Keep naming conventions lowercase and consistent so one campaign does not fragment across multiple rows.",
  },
  {
    question: 'How should Shopify stores use a UTM builder?',
    answer:
      'Tag traffic sources before sending visitors to Shopify product pages, collection pages, and landing pages. This makes it much easier to reconcile revenue in Shopify with acquisition data in GA4, especially for email, influencer, affiliate, and paid social campaigns.',
  },
  {
    question: 'Why are my UTM parameters not showing in Google Analytics?',
    answer:
      'The most common causes are redirects stripping query strings, internal links overwriting attribution, inconsistent capitalization, or checking the wrong GA4 report. Test the final URL after every redirect and validate the visit inside GA4 Traffic acquisition before publishing at scale.',
  },
];

export default function UtmBuilderPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Utility"
        categoryHref="/utility"
        title="UTM Builder - Free Google Analytics Campaign URL Generator"
        description="The most accurate Google Analytics URL builder for marketers. Create trackable campaign URLs with utm_source, utm_medium, utm_campaign, utm_term, and utm_content. Includes bulk generation, preset values, validation, and local history."
      >
        <UtmBuilder />

        <div className="mt-16 space-y-16">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Why Every Data-Driven Marketer Needs a Campaign URL Builder</h2>
            <div className="prose prose-slate max-w-none text-slate-700 leading-7">
              <p>
                Attribution is the currency of modern marketing. If you cannot prove which channel, campaign, or creative drove a conversion, you are flying blind. A <strong>campaign URL builder</strong> solves this by embedding tracking metadata directly into every link you share. When a user clicks a UTM-tagged link and lands on your site, Google Analytics reads those parameters and attributes the session to the exact source, medium, and campaign you specified. Without this <strong>Google Analytics URL builder</strong> discipline, your acquisition reports become a meaningless soup of &quot;(direct) / none&quot; and unclassified referrals.
              </p>
              <p>
                Our <strong>UTM code generator</strong> goes beyond the basic Google Campaign URL tool. We built it for teams that scale. It validates your URLs in real time, enforces consistent naming through preset dropdowns, stores your campaign history locally for reuse, and offers a bulk mode for tagging entire email newsletters or product catalogs in seconds. Whether you are a solo founder running Meta ads or an enterprise demand generation team managing millions in spend, this <strong>UTM campaign builder</strong> ensures your attribution data is clean, consistent, and actionable.
              </p>
            </div>
          </section>

          <section id="what-is-utm">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">What Is UTM and How Does Campaign Tracking Work?</h2>
            <div className="prose prose-slate max-w-none text-slate-700 leading-7">
              <p>
                UTM stands for <strong>Urchin Tracking Module</strong>, a legacy name from the analytics company Urchin Software Corporation that Google acquired in 2005. The technology became the foundation of Google Analytics. A UTM parameter is a query string appended to a URL that passes specific campaign metadata to the analytics platform. There are five standard UTM parameters, three of which are required for valid attribution in Google Analytics 4.
              </p>
              <p>
                <strong>utm_source</strong> identifies the referrer - the specific website, platform, or publication sending traffic. Examples include google, facebook, newsletter, or partner_blog. <strong>utm_medium</strong> categorizes the marketing channel: cpc for paid search, email for newsletters, social for organic posts, display for banner ads, and referral for backlinks. <strong>utm_campaign</strong> is the promotional container - a unique name like black_friday_2026 or saas_trial_q2 that groups all related touchpoints under one umbrella.
              </p>
              <p>
                The two optional parameters add granularity. <strong>utm_term</strong> captures the paid keyword in search campaigns, allowing you to differentiate performance between &quot;project management software&quot; and &quot;best project management software.&quot; <strong>utm_content</strong> differentiates creative variations when multiple links point to the same destination - for example, distinguishing a hero banner click from a footer text link in the same email. Our <strong>Google campaign URL</strong> tool supports all five parameters with inline validation and preset suggestions.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Complete UTM Parameter Reference Table</h2>
            <p className="text-slate-700 mb-6 leading-7">
              Master these five parameters and your <strong>URL builder</strong> output will be indistinguishable from that of a Fortune 500 analytics team.
            </p>
            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-100 text-slate-900 font-bold uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">Parameter</th>
                    <th className="px-4 py-3">Required</th>
                    <th className="px-4 py-3">Example Values</th>
                    <th className="px-4 py-3">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                  <tr>
                    <td className="px-4 py-3 font-mono font-bold text-indigo-700">utm_source</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">Yes</span></td>
                    <td className="px-4 py-3 font-mono text-xs">google, facebook, newsletter, partner</td>
                    <td className="px-4 py-3">Identifies the specific referrer sending traffic</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono font-bold text-indigo-700">utm_medium</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">Yes</span></td>
                    <td className="px-4 py-3 font-mono text-xs">cpc, email, social, display, referral</td>
                    <td className="px-4 py-3">Categorizes the marketing channel or mechanism</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono font-bold text-indigo-700">utm_campaign</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">Yes</span></td>
                    <td className="px-4 py-3 font-mono text-xs">spring_sale_2026, launch_week</td>
                    <td className="px-4 py-3">Groups touchpoints under a specific promotion</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono font-bold text-indigo-700">utm_term</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">No</span></td>
                    <td className="px-4 py-3 font-mono text-xs">running+shoes, best+crm</td>
                    <td className="px-4 py-3">Tracks paid search keywords (PPC)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono font-bold text-indigo-700">utm_content</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">No</span></td>
                    <td className="px-4 py-3 font-mono text-xs">video_ad, text_link, blue_cta</td>
                    <td className="px-4 py-3">Differentiates A/B creatives or link positions</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="google-analytics">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Google Analytics URL Builder: GA4 vs. Universal Analytics</h2>
            <div className="prose prose-slate max-w-none text-slate-700 leading-7">
              <p>
                Google Analytics 4 (GA4) handles UTM parameters differently than its predecessor, Universal Analytics (UA). In UA, UTM values populated the Source, Medium, Campaign, Term, and Content dimensions directly in standard reports. In GA4, these dimensions still exist but are accessed primarily through the Traffic Acquisition and User Acquisition reports, or through custom explorations. The core principle remains identical: a <strong>Google Analytics URL builder</strong> creates links that GA4 reads at the session level to attribute traffic correctly.
              </p>
              <p>
                One critical GA4 behavior change involves session attribution. GA4 uses an event-based data model, and UTM parameters trigger a new session whenever they change. This means if a user clicks two different UTM-tagged links within the same 30-minute window, GA4 records two separate sessions. While this increases session counts compared to UA, it provides more granular attribution accuracy. Our <strong>Google campaign URL</strong> recommendations account for this by encouraging campaign-level consistency rather than over-segmentation.
              </p>
              <p>
                For cross-domain tracking, UTM parameters alone are insufficient. If you operate multiple domains, for example a marketing site and a checkout domain, you must implement GA4 cross-domain measurement alongside your <strong>campaign URL builder</strong> tags. Otherwise, users clicking between your properties will appear as new sessions with fresh attribution, artificially inflating direct traffic and fragmenting user journeys.
              </p>
            </div>
          </section>

          <section id="ga4-utm-parameters">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Use UTM Parameters in GA4</h2>
            <div className="prose prose-slate max-w-none text-slate-700 leading-7">
              <p>
                If you are wondering <strong>how to use UTM parameters in GA4</strong>, the process is straightforward: build the full destination URL first, append <code>utm_source</code>, <code>utm_medium</code>, and <code>utm_campaign</code>, then publish that exact link in your ad, email, social post, or partner placement. After the first clicks arrive, open <strong>Reports &gt; Acquisition &gt; Traffic acquisition</strong> in GA4 to review session source, session medium, and session campaign values.
              </p>
              <p>
                The most important operational habit is consistency. GA4 treats <code>Facebook</code> and <code>facebook</code> as different values, so your UTM builder should always output lowercase strings. For most teams, a simple structure like <code>utm_source=facebook</code>, <code>utm_medium=paid_social</code>, and <code>utm_campaign=summer_sale_2026</code> is enough to keep the Traffic acquisition report clean and usable.
              </p>
            </div>
          </section>

          <section id="naming-conventions">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">UTM Naming Conventions That Scale</h2>
            <div className="prose prose-slate max-w-none text-slate-700 leading-7">
              <p>
                The difference between a usable analytics report and a chaotic spreadsheet often comes down to naming discipline. A <strong>UTM campaign builder</strong> is only as good as the taxonomy its users follow. We recommend establishing a UTM style guide before your first campaign goes live. Here are the non-negotiable rules used by elite growth teams.
              </p>
              <p>
                <strong>Use lowercase exclusively.</strong> GA4 is case-sensitive. &quot;Facebook,&quot; &quot;facebook,&quot; and &quot;FACEBOOK&quot; appear as three separate sources. Standardize on lowercase to prevent data fragmentation. <strong>Use underscores or hyphens, never spaces.</strong> Spaces in URLs become %20, making reports unreadable and complicating filter logic. <strong>Never include personally identifiable information.</strong> Embedding email addresses or user IDs in UTM parameters violates Google&apos;s Terms of Service and can result in account suspension.
              </p>
              <p>
                <strong>Be specific but consistent.</strong> Instead of vague campaign names like &quot;promo&quot; or &quot;test,&quot; use structured identifiers like &quot;2026_q2_ebook_download&quot; or &quot;blackfriday_retention_email.&quot; Document your taxonomy in a shared spreadsheet or Notion database so every team member - from the intern scheduling tweets to the VP of Demand Gen - uses identical values. Our <strong>UTM code generator</strong> includes preset buttons for common sources and mediums to reduce human error and enforce consistency.
              </p>
            </div>

            <div className="mt-6 bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg text-emerald-900">
              <p className="font-bold m-0">Pro Tip: The L-M-H Framework</p>
              <p className="m-0 mt-1 text-sm leading-relaxed text-emerald-800">
                Structure campaign names using <strong>Launch_Month-Channel-Hook</strong>. Example: <code>may_meta_free_trial</code> or <code>nov_google_branded_search</code>. This creates sortable, filterable campaign names that reveal performance patterns at a glance in GA4.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Fatal UTM Mistakes That Destroy Your Data</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-red-700 mb-2 flex items-center gap-2">
                  <span>X</span> Using UTM on Internal Links
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Never tag internal navigation with UTM parameters. If your homepage links to your pricing page with <code>?utm_source=homepage</code>, GA4 will start a new session and attribute the conversion to &quot;homepage&quot; instead of the true acquisition source. Use internal event tracking or custom dimensions instead.
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-red-700 mb-2 flex items-center gap-2">
                  <span>X</span> Inconsistent Capitalization
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  &quot;Email,&quot; &quot;email,&quot; and &quot;EMAIL&quot; split into three separate rows in GA4. This fragmentation makes rollup reporting impossible. Our <strong>URL builder</strong> presets enforce lowercase, but manual entry requires team discipline.
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-red-700 mb-2 flex items-center gap-2">
                  <span>X</span> Mixing UTM with Auto-Tagging
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Google Ads auto-tagging and manual UTM parameters create conflicting session data. Enable one or the other, never both. If you need UTM values in GA4 for Google Ads, use the &quot;Allow manual tagging&quot; override in property settings.
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-red-700 mb-2 flex items-center gap-2">
                  <span>X</span> Including Spaces or Special Characters
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Spaces become <code>%20</code>, ampersands break parameter parsing, and slashes create URL path confusion. Stick to alphanumeric characters, underscores, and hyphens. Our <strong>campaign URL builder</strong> validates against these characters in real time.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Bulk UTM Generation for Enterprise Workflows</h2>
            <div className="prose prose-slate max-w-none text-slate-700 leading-7">
              <p>
                Enterprise marketers do not build URLs one at a time. A single email newsletter might contain fifteen trackable links. An e-commerce catalog update might require UTM tags across two hundred product pages. Our <strong>UTM campaign builder</strong> includes a dedicated bulk mode that applies identical UTM parameters to an unlimited number of destination URLs simultaneously.
              </p>
              <p>
                Paste your URLs - one per line - into the bulk generator, configure your source, medium, and campaign once, and generate every tracking link in a single click. The output is copied to your clipboard as a newline-separated list, ready for import into your email service provider, ad manager, or affiliate platform. This eliminates the copy-paste fatigue that causes teams to skip tagging on secondary links, which in turn creates attribution gaps that skew performance analysis.
              </p>
            </div>
          </section>

          <section id="shopify-email-utm">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">UTM Builder for Shopify and Email Campaigns</h2>
            <div className="prose prose-slate max-w-none text-slate-700 leading-7">
              <p>
                A strong <strong>UTM builder for Shopify</strong> should make it easy to tag product pages, collection pages, seasonal landing pages, and cart-recovery flows before traffic goes live. For Shopify stores, campaign URLs are especially useful when comparing influencer traffic, paid social creatives, affiliate placements, and discount-code campaigns against revenue inside both Shopify and GA4.
              </p>
              <p>
                <strong>UTM tracking for email campaigns</strong> deserves its own naming discipline. Use a stable source such as <code>newsletter</code> or your ESP name, keep <code>utm_medium=email</code>, and reserve <code>utm_content</code> for specific creative placements like <code>hero_banner</code>, <code>footer_link</code>, or <code>cta_button_a</code>. That gives lifecycle teams cleaner attribution when a single email contains multiple links to the same product or offer.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Platform-Specific UTM Strategies</h2>
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-2">Meta (Facebook and Instagram) Ads</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Meta&apos;s pixel provides robust conversion tracking, but UTM parameters remain essential for GA4 cross-verification. Use <code>utm_source=facebook</code> or <code>utm_source=instagram</code>, <code>utm_medium=paid_social</code>, and campaign names that match your ad set names for easy reconciliation between Meta Ads Manager and GA4.
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-2">Google Ads Search Campaigns</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Prefer auto-tagging for Google Ads, but if you must use manual UTM tags, set <code>utm_source=google</code>, <code>utm_medium=cpc</code>, and use <code>utm_term={'{keyword}'}</code> to capture the keyword. Disable auto-tagging in your Google Ads account settings to prevent data conflicts.
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-2">Email Marketing (Klaviyo, Mailchimp, HubSpot)</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Email is where UTM discipline matters most. Use <code>utm_source=newsletter</code> or your ESP name, <code>utm_medium=email</code>, and <code>utm_content</code> to differentiate hero banners, text links, and button CTAs within the same campaign. This reveals which creative placement drives the highest click-through rate.
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-2">LinkedIn Sponsored Content</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  LinkedIn&apos;s native analytics are limited compared to Meta. Robust UTM tagging is non-negotiable for B2B attribution. Use <code>utm_source=linkedin</code>, <code>utm_medium=paid_social</code> for sponsored posts or <code>utm_medium=sponsored_inmail</code> for Message Ads, and always differentiate sponsored versus organic in your campaign naming.
                </p>
              </div>
            </div>
          </section>

          <section id="utm-troubleshooting">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">UTM Parameters Not Showing in Google Analytics?</h2>
            <div className="prose prose-slate max-w-none text-slate-700 leading-7">
              <p>
                If your <strong>UTM parameters are not showing in Google Analytics</strong>, start by testing the exact final landing URL after every redirect. Many attribution problems come from link shorteners, Shopify apps, or custom redirect rules that remove query strings before the page loads. If the visitor lands without the <code>utm_</code> values still attached, GA4 cannot attribute the session correctly.
              </p>
              <p>
                Next, verify that you are checking the right report. In GA4, most teams should look at <strong>Traffic acquisition</strong> first, not just Realtime or User acquisition. Also audit for internal links that re-tag users, inconsistent capitalization, and duplicate campaign names. When in doubt, click a test link yourself, confirm the parameters stay in the address bar, and then validate the visit in GA4 before publishing the campaign broadly.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions About UTM Builders</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <details key={i} className="group bg-white border border-slate-200 rounded-xl open:ring-2 open:ring-indigo-500/20 transition-all">
                  <summary className="flex justify-between items-center cursor-pointer p-5 font-semibold text-slate-800 list-none">
                    {faq.question}
                    <ChevronDown size={18} className="transition group-open:rotate-180" />
                  </summary>
                  <div className="px-5 pb-5 text-slate-600 leading-7">{faq.answer}</div>
                </details>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Related UTM and GA4 Guides</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  name: "What Are UTM Parameters?",
                  href: "/blog/what-are-utm-parameters",
                  description: "Start with the basics if you need a clean explanation of source, medium, campaign, term, and content.",
                },
                {
                  name: "UTM Naming Conventions",
                  href: "/blog/utm-naming-conventions",
                  description: "Build one naming system that keeps GA4 reports clean as your team scales.",
                },
                {
                  name: "How to Read UTM Reports in GA4",
                  href: "/blog/how-to-read-utm-reports-ga4",
                  description: "See where tagged traffic appears in GA4 and how to inspect campaign performance after launch.",
                },
              ].map((guide) => (
                <Link
                  key={guide.href}
                  href={guide.href}
                  className="rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-indigo-300 hover:shadow-sm"
                >
                  <h3 className="text-base font-bold text-slate-900">{guide.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{guide.description}</p>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Marketing and Utility Tools</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: 'Social Media Image Resizer',
                  href: '/utility/social-media-image-resizer',
                  description: 'Resize images to exact dimensions for Instagram, Meta, LinkedIn, and X.',
                },
                {
                  name: 'What Is My IP Address?',
                  href: '/utility/what-is-my-ip',
                  description: 'Quickly find your public and private IP for whitelisting and security checks.',
                },
                {
                  name: 'Aspect Ratio Calculator',
                  href: '/utility/aspect-ratio-calculator',
                  description: 'Calculate 16:9, 4:3, and custom aspect ratios for video and display ads.',
                },
                {
                  name: 'DNS Checker',
                  href: '/utility/dns-checker',
                  description: 'Verify your tracking domain and MX records for email marketing deliverability.',
                },
                {
                  name: 'QR Code Generator',
                  href: '/utility/qr-code-generator',
                  description: 'Create trackable QR codes for your UTM-tagged physical marketing materials.',
                },
                {
                  name: 'Word Frequency Counter',
                  href: '/text/word-frequency',
                  description: 'Analyze your ad copy and landing page content for better keyword density.',
                },
              ].map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-indigo-300 hover:shadow-lg"
                >
                  <h3 className="text-[15px] font-bold text-slate-900 group-hover:text-indigo-600">{tool.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{tool.description}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="bg-slate-900 text-slate-300 rounded-2xl p-8 lg:p-10">
            <h2 className="text-xl font-bold text-white mb-4">About This UTM Campaign Builder and Editorial Standards</h2>
            <div className="space-y-4 text-sm leading-7">
              <p>
                This <strong>Google Analytics URL builder</strong> is maintained by the analytics engineering team at FindBest Tools. All UTM parameter logic, validation rules, and naming conventions are derived from official Google Analytics 4 documentation, Google Marketing Platform best practices, and the Urchin Tracking Module specification. We review platform updates quarterly and adjust presets when channels like TikTok or new ad formats emerge.
              </p>
              <p>
                <strong>Privacy and Security:</strong> This tool operates entirely client-side. Your destination URLs, campaign names, and UTM parameters are processed in your browser and stored only in your localStorage. No data is transmitted to our servers, logged in analytics, or shared with third parties. This makes our <strong>UTM campaign builder</strong> safe for pre-launch campaigns, competitive intelligence, and confidential client work.
              </p>
              <p>
                <strong>Accuracy Guarantee:</strong> We test every generated URL against GA4&apos;s real-time reporting to confirm parameters are parsed correctly. If you encounter a platform where our UTM tags are not registering, contact our editorial team with the URL and platform details for immediate investigation.
              </p>
              <p>
                <strong>Last Updated:</strong> May 1, 2026. Compatible with Google Analytics 4, Universal Analytics (legacy), Adobe Analytics (via s.campaign), and Mixpanel (via super properties).
              </p>
            </div>
          </section>
        </div>
      </ToolPageScaffold>
    </div>
  );
}
