import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";

const PAGE_PATH = "/blog/track-email-campaigns-utm";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "How to Track Email Campaigns with UTM Links (+ Template)",
  description: "Email marketing ROI is invisible without proper tracking. Learn how to use UTM parameters to track every click, segment newsletters from automation, and prove your email ROI.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "How to Track Email Campaigns with UTM Links (+ Template)",
    description: "Stop guessing your email ROI. Master UTM tracking for newsletters, automated sequences, and transactional emails with our free naming convention template.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "Why does email traffic show up as 'Direct' in Google Analytics?",
    answer: "Most email clients (like Outlook or Apple Mail) do not pass referrer information. Without UTM parameters, Google Analytics has no way of knowing where the visitor came from, so it defaults to the 'Direct' category.",
  },
  {
    question: "Should I use my ESP name (e.g., Mailchimp) as the utm_source?",
    answer: "You can, but it's often more useful to use the email type, like 'newsletter' or 'onboarding_sequence'. This allows you to group traffic by the intent of the message rather than the software used to send it.",
  },
  {
    question: "How do I track different buttons in the same email?",
    answer: "Use the 'utm_content' parameter. For example, use 'utm_content=hero_button' for the main link and 'utm_content=footer_link' for the bottom link. This reveals which parts of your email design are most effective.",
  },
  {
    question: "Do I need to tag transactional emails like receipts?",
    answer: "Yes. Transactional emails have high open rates and often drive significant traffic. Tagging them with 'utm_source=transactional' ensures you're not missing a valuable part of your customer journey data.",
  },
];

export default function TrackEmailCampaignsBlogPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Email UTM Tracking", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">Email Tracking</li>
          </ol>
        </nav>
        
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold uppercase tracking-wider">
            Email Marketing · Analytics
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            How to Track Every Email Campaign with UTM Links (+ Free Template)
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Email delivers incredible ROI, but only if you can measure it. Learn how to tag every link to turn &quot;Direct&quot; traffic into actionable insights.
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
            Email marketing consistently delivers some of the highest ROI of any digital marketing channel. And yet, most email marketers can&apos;t tell you with certainty which emails are actually driving conversions — because they&apos;re not tracking their links correctly.
          </p>
          <p>
            When email links aren&apos;t tagged with UTM parameters, all that traffic lands in Google Analytics labeled as &quot;direct&quot; — as if users typed your URL directly into their browser. Your email performance is invisible. Your ROI calculation is guesswork.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Why Email Traffic Gets Misattributed</h2>
          <p>
            Most desktop email clients (Outlook, Apple Mail) and many mobile clients don&apos;t pass referrer information. Without a referrer, Google Analytics defaults to labeling the session &quot;direct/none&quot;. UTM parameters solve this by embedding the source information directly into the URL itself.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">The Right UTM Structure for Email</h2>
          <div className="grid gap-6">
            <div className="p-6 bg-card border border-border rounded-2xl">
              <h3 className="text-xl font-bold mb-2">utm_source</h3>
              <p className="text-muted-foreground">Identifies the list or email type. Recommended: <code>newsletter</code>, <code>welcome_series</code>, or <code>transactional</code>.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-2xl">
              <h3 className="text-xl font-bold mb-2">utm_medium</h3>
              <p className="text-muted-foreground">For email, this is <strong>always</strong> <code>email</code>. This ensures GA4 groups your traffic correctly under the &quot;Email&quot; channel.</p>
            </div>
            <div className="p-6 bg-card border border-border rounded-2xl">
              <h3 className="text-xl font-bold mb-2">utm_campaign</h3>
              <p className="text-muted-foreground">The specific campaign name. Format: <code>[type]_[desc]_[date]</code>. Example: <code>promo_spring_sale_apr2026</code>.</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Using utm_content for Design Insights</h2>
          <p>
            Don&apos;t just track the email — track the <em>link</em>. By using different <code>utm_content</code> values for your hero button, body links, and footer CTAs, you can see exactly which parts of your email drive the most engagement.
          </p>
          <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl font-mono text-xs overflow-x-auto my-6 border border-slate-800">
            https://yoursite.com/sale?utm_source=newsletter&utm_medium=email&utm_campaign=may_promo&<span className="text-blue-400 font-bold text-sm underline decoration-blue-500/50">utm_content=hero_button</span>
          </div>
        </section>

        <section className="mb-12 bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 p-8 rounded-3xl">
          <h2 className="text-2xl font-bold mb-6 text-blue-900 dark:text-blue-400 text-center">Email UTM Naming Convention Template</h2>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-blue-200 dark:border-blue-500/20 pb-2">
              <span className="font-bold">utm_source</span>
              <code>newsletter, welcome_series, winback</code>
            </div>
            <div className="flex justify-between border-b border-blue-200 dark:border-blue-500/20 pb-2">
              <span className="font-bold">utm_medium</span>
              <code>email</code>
            </div>
            <div className="flex justify-between border-b border-blue-200 dark:border-blue-500/20 pb-2">
              <span className="font-bold">utm_campaign</span>
              <code>[type]_[description]_[date]</code>
            </div>
            <div className="flex justify-between border-b border-blue-200 dark:border-blue-500/20 pb-2">
              <span className="font-bold">utm_content</span>
              <code>hero_button, body_link, footer_cta</code>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Tracking Automated & Transactional Emails</h2>
          <p>
            Automated flows (like onboarding) should use &quot;evergreen&quot; campaign names like <code>welcome_series_email1</code>. Transactional emails (like receipts) should be tagged with <code>utm_source=transactional</code> to keep them separate from your marketing performance in reports.
          </p>
        </section>

        <section id="faq" className="scroll-mt-20 mb-12 border-t border-border pt-12">
          <h2 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-12">Email UTM Tracking FAQ</h2>
          <div className="grid gap-6">
            {faq.map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6">
                <h4 className="text-lg font-bold text-foreground mb-3">{item.question}</h4>
                <p className="m-0 text-muted-foreground leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-20 p-10 bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-[2rem] text-center">
          <h2 className="text-3xl font-bold mb-4">Start Tracking Your Emails</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
            Ready to prove your email ROI? Use our free tool to generate clean, validated UTM links for your next campaign.
          </p>
          <Link 
            href="/utility/utm-builder" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20"
          >
            Open UTM Builder →
          </Link>
        </div>
      </div>
    </div>
  );
}
