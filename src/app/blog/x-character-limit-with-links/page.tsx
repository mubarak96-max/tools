import Link from 'next/link';
import type { Metadata } from 'next';

import JsonLd from '@/components/seo/JsonLd';
import { absoluteUrl } from '@/lib/seo/metadata';
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from '@/lib/seo/jsonld';

const PAGE_PATH = '/blog/x-character-limit-with-links';
const PAGE_URL = absoluteUrl(PAGE_PATH);
const LAST_UPDATED_ISO = '2026-05-01T00:00:00.000Z';

export const metadata: Metadata = {
  title: 'X Character Limit With Links: 280 Characters Explained',
  description:
    'Understand the X character limit, why every URL still counts as 23 characters, and how to write shorter launch posts, replies, and link-driven tweets.',
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'X Character Limit With Links: 280 Characters Explained',
    description:
      'Most X counters get link-heavy posts wrong. Learn how 23-character URL weighting affects your available room and how to write around it.',
    url: PAGE_URL,
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'X Character Limit With Links',
    description: 'Why every URL costs 23 characters on X and how to write around the 280-character cap.',
  },
  other: {
    'article:modified_time': LAST_UPDATED_ISO,
  },
};

const faq = [
  {
    question: 'What is the current X character limit?',
    answer:
      'For standard posts, the X character limit is 280 characters. Some premium account features allow longer posts, but 280 remains the default public constraint most writers optimize around.',
  },
  {
    question: 'How many characters does a link count for on X?',
    answer:
      'A URL is weighted as 23 characters regardless of how long the visible link appears in the draft.',
  },
  {
    question: 'Do hashtags and mentions count on X?',
    answer:
      'Yes. Mentions, hashtags, spaces, punctuation, and emojis all count toward the 280-character total.',
  },
  {
    question: 'Why does a plain character counter disagree with X?',
    answer:
      'Because a plain counter measures visible text length, while X applies a fixed rule to URLs. That creates a gap on link-heavy posts.',
  },
];

function buildArticleJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'X Character Limit With Links: 280 Characters Explained',
    description:
      'Understand the X character limit, why every URL still counts as 23 characters, and how to write shorter launch posts, replies, and link-driven tweets.',
    dateModified: LAST_UPDATED_ISO,
    datePublished: LAST_UPDATED_ISO,
    author: {
      '@type': 'Organization',
      name: 'FindBest Tools',
    },
    publisher: {
      '@type': 'Organization',
      name: 'FindBest Tools',
    },
    mainEntityOfPage: PAGE_URL,
  };
}

export default function XCharacterLimitWithLinksPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: 'X Character Limit With Links', path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <JsonLd data={serializeJsonLd(buildArticleJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <header className="mb-12">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">X Writing</li>
          </ol>
        </nav>

        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-slate-900/10 text-slate-700 text-xs font-bold uppercase tracking-wider">
            X Strategy · Social Copy
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            X Character Limit With Links: Why a URL Still Costs 23 Characters
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
            The 280-character cap is simple. The way links are counted is not. That is where most generic counters fail.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium pt-2">
            <span>8 min read</span>
            <span>-</span>
            <span>Updated May 2026</span>
          </div>
        </div>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p className="lead">
          If you publish product launches, newsletter drops, or traffic-driving posts on X, links are where your available space disappears. The platform does not care whether the visible URL is short or long. It applies a fixed weight.
        </p>

        <section className="my-12">
          <h2 className="text-3xl font-bold mb-6">The Basic X Character Rule</h2>
          <p>
            Standard X posts allow 280 characters. Every visible element matters: letters, spaces, punctuation, hashtags, mentions, and emojis. The mistake is assuming the URL behaves the same way. It does not.
          </p>
        </section>

        <section className="my-12">
          <h2 className="text-3xl font-bold mb-6">Why Links Count as 23 Characters</h2>
          <p>
            X runs URLs through its own wrapping and tracking system, so it normalizes them to a fixed character allowance. In practice, that means a long UTM-tagged campaign URL and a short branded link both consume 23 characters in the post.
          </p>
          <p>
            This is why a raw text-length counter becomes unreliable as soon as a link enters the draft. Our <Link href="/utility/social-media-character-counter" className="font-semibold text-primary hover:underline">Social Media Character Counter</Link> uses X-style weighted URL logic so launch posts and promo tweets are judged against the real platform rule.
          </p>
        </section>

        <section className="my-12">
          <h2 className="text-3xl font-bold mb-6">A Better Way to Budget Space</h2>
          <div className="overflow-x-auto rounded-3xl border border-border">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 font-bold">Element</th>
                  <th className="px-6 py-4 font-bold">Space to reserve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr><td className="px-6 py-4">One URL</td><td className="px-6 py-4">23 characters</td></tr>
                <tr><td className="px-6 py-4">One @mention</td><td className="px-6 py-4">Visible handle length</td></tr>
                <tr><td className="px-6 py-4">One hashtag</td><td className="px-6 py-4">Visible hashtag length</td></tr>
                <tr><td className="px-6 py-4">Two-line safety margin</td><td className="px-6 py-4">10 to 20 characters</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="my-12">
          <h2 className="text-3xl font-bold mb-6">Best Practices for Link-Heavy X Posts</h2>
          <ul className="space-y-3">
            <li>Lead with the hook before the link.</li>
            <li>Use one CTA, not three competing actions.</li>
            <li>Cut filler words first because they steal space without adding meaning.</li>
            <li>Build your campaign URL with the <Link href="/utility/utm-builder" className="font-semibold text-primary hover:underline">UTM Builder</Link>, then validate the full post in the counter.</li>
          </ul>
        </section>

        <section className="my-12 rounded-[2rem] border border-slate-200 bg-slate-50 p-8">
          <h2 className="text-2xl font-bold mb-4">Cross-posting from X to other networks</h2>
          <p className="text-slate-700">
            A draft that fits X often has extra room on Threads and much more on LinkedIn. Before reusing the same copy elsewhere, test it in the live checker and compare it against our <Link href="/blog/linkedin-post-character-limit" className="font-semibold underline">LinkedIn post length guide</Link> and <Link href="/blog/threads-bluesky-character-limits" className="font-semibold underline">Threads and Bluesky guide</Link>.
          </p>
        </section>

        <section id="faq" className="my-16 scroll-mt-20">
          <h2 className="text-3xl font-bold mb-8 text-center">X Character Limit FAQ</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {faq.map((item) => (
              <div key={item.question} className="rounded-3xl border border-border bg-card p-6">
                <h3 className="font-bold text-foreground mb-3">{item.question}</h3>
                <p className="m-0 text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
