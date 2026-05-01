import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/metadata";

const PAGE_PATH = "/blog/social-media-utm-tracking";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "UTM Tracking for Social Media: Facebook, Instagram, LinkedIn & X",
  description: "Social media attribution is complex. Learn how to structure UTM parameters for Facebook, Instagram, LinkedIn, and Twitter/X to distinguish paid from organic and stories from feed posts.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "UTM Tracking for Social Media: Facebook, Instagram, LinkedIn & X",
    description: "Master social media attribution. Learn the exact UTM structure for Every platform to stop misattributing social traffic as 'Direct'.",
    url: PAGE_URL,
    type: "article",
  },
};

const faq = [
  {
    question: "Why should I use 'paid_social' instead of 'social' for ads?",
    answer: "Using 'paid_social' as the medium for ads and 'social' for organic posts allows you to compare performance at a glance in Google Analytics. This keeps your paid ROI data clean and separate from your organic community growth metrics.",
  },
  {
    question: "Do I need to tag links in Instagram captions?",
    answer: "No. Links in Instagram captions are not clickable, so users can't click them to reach your site. Focus your tagging efforts on your 'Link in Bio' and Instagram Stories, which are the primary drivers of site traffic.",
  },
  {
    question: "How do I track LinkedIn personal posts vs Company Page posts?",
    answer: "Use the 'utm_content' parameter. For both, set utm_source to 'linkedin', but use 'utm_content=personal_post' and 'utm_content=company_post' respectively. This reveals which voice is more effective for your brand.",
  },
  {
    question: "Why does Twitter traffic often show up as 'Direct'?",
    answer: "Twitter's 't.co' shortener and various mobile apps often fail to pass referrer data. UTM parameters are the only way to ensure Twitter traffic is correctly identified in your analytics.",
  },
];

export default function SocialMediaUtmBlogPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Social UTM Tracking", path: PAGE_PATH },
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
            <li className="text-foreground font-medium">Social Tracking</li>
          </ol>
        </nav>
        
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-xs font-bold uppercase tracking-wider">
            Social Media · Attribution
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            UTM Tracking for Social Media: Facebook, Instagram, LinkedIn & X
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Social attribution is messy. Learn how to tag every post, story, and ad to finally understand which platform actually drives your business growth.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium pt-2">
            <span>15 min read</span>
            <span>•</span>
            <span>Published May 2026</span>
          </div>
        </div>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <section className="mb-12">
          <p className="lead text-lg text-muted-foreground">
            Social media is one of the most complex channels to attribute accurately. Between organic posts, paid ads, stories, and bio links, traffic arrives through dozens of paths. Without UTM parameters, all of that nuance collapses into vague entries in your analytics — or worse, gets misattributed as &quot;direct.&quot;
          </p>
          <p>
            This guide breaks down exactly how to structure UTM tracking for the four major social platforms: Facebook, Instagram, LinkedIn, and Twitter/X.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Why Social UTM Tracking Is Different</h2>
          <p>
            Mobile social apps often don&apos;t pass referrer data. A click from the Instagram app often arrives with zero signal. Furthermore, platforms like Facebook are used for both free organic reach and paid advertising. UTMs allow you to separate these completely in your reports.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Platform-Specific UTM Structures</h2>
          
          <div className="space-y-8 mt-8">
            <div className="p-8 bg-card border border-border rounded-[2rem]">
              <h3 className="text-2xl font-bold mb-4">Facebook</h3>
              <p className="mb-4">Use <code>utm_medium=paid_social</code> for ads and <code>utm_medium=social</code> for organic. Differentiate content with <code>utm_content=feed_post</code>, <code>story</code>, or <code>group_post</code>.</p>
              <div className="bg-muted p-4 rounded-xl font-mono text-xs overflow-x-auto border border-border">
                https://site.com?utm_source=facebook&utm_medium=social&utm_campaign=summer&utm_content=feed_post
              </div>
            </div>

            <div className="p-8 bg-card border border-border rounded-[2rem]">
              <h3 className="text-2xl font-bold mb-4">Instagram</h3>
              <p className="mb-4">Since posts aren&apos;t clickable, focus on your bio and stories. Use <code>utm_content=profile</code> for your bio link and <code>utm_content=story</code> for link stickers.</p>
              <div className="bg-muted p-4 rounded-xl font-mono text-xs overflow-x-auto border border-border">
                https://site.com?utm_source=instagram&utm_medium=social&utm_campaign=bio_link&utm_content=profile
              </div>
            </div>

            <div className="p-8 bg-card border border-border rounded-[2rem]">
              <h3 className="text-2xl font-bold mb-4">LinkedIn</h3>
              <p className="mb-4">B2B marketers should distinguish personal brand vs. company reach. Use <code>utm_content=personal_post</code> or <code>company_post</code> to see which drives better conversion.</p>
              <div className="bg-muted p-4 rounded-xl font-mono text-xs overflow-x-auto border border-border">
                https://site.com?utm_source=linkedin&utm_medium=social&utm_campaign=thought_leadership&utm_content=personal_post
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground text-center">Evergreen Bio Link Template</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { platform: "Facebook", code: "utm_source=facebook&utm_medium=social&utm_campaign=bio_link_evergreen" },
              { platform: "Instagram", code: "utm_source=instagram&utm_medium=social&utm_campaign=bio_link_evergreen" },
              { platform: "LinkedIn", code: "utm_source=linkedin&utm_medium=social&utm_campaign=bio_link_evergreen" },
              { platform: "Twitter/X", code: "utm_source=twitter&utm_medium=social&utm_campaign=bio_link_evergreen" },
            ].map((item, i) => (
              <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl">
                <p className="text-xs font-bold uppercase text-muted-foreground mb-2">{item.platform}</p>
                <code className="text-[10px] break-all">{item.code}</code>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="scroll-mt-20 mb-12 border-t border-border pt-12">
          <h2 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-12">Social Media UTM FAQ</h2>
          <div className="grid gap-6">
            {faq.map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6">
                <h4 className="text-lg font-bold text-foreground mb-3">{item.question}</h4>
                <p className="m-0 text-muted-foreground leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-20 p-10 bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-[2rem] text-center">
          <h2 className="text-3xl font-bold mb-4">Stop Guessing Social ROI</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
            Ready to master social attribution? Use our free tool to generate clean, validated UTM links for every platform.
          </p>
          <Link 
            href="/utility/utm-builder" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-600 text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-cyan-500/20"
          >
            Open UTM Builder →
          </Link>
        </div>
      </div>
    </div>
  );
}
