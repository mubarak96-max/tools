import Link from 'next/link';
import type { Metadata } from 'next';

import JsonLd from '@/components/seo/JsonLd';
import { absoluteUrl } from '@/lib/seo/metadata';
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from '@/lib/seo/jsonld';

const PAGE_PATH = '/blog/threads-bluesky-character-limits';
const PAGE_URL = absoluteUrl(PAGE_PATH);
const LAST_UPDATED_ISO = '2026-05-01T00:00:00.000Z';

export const metadata: Metadata = {
  title: 'Threads and Bluesky Character Limits: Practical Guide',
  description:
    'Compare Threads and Bluesky character limits, practical writing lengths, and when a cross-platform draft needs trimming before you publish.',
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Threads and Bluesky Character Limits: Practical Guide',
    description:
      'Threads gives you more room. Bluesky rewards tighter writing. Learn the limits, differences, and cross-posting strategy.',
    url: PAGE_URL,
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Threads and Bluesky Character Limits',
    description: 'A practical guide to writing for Threads and Bluesky without guessing at the limits.',
  },
  other: {
    'article:modified_time': LAST_UPDATED_ISO,
  },
};

const faq = [
  {
    question: 'What is the Threads character limit?',
    answer:
      'Threads posts can be up to 500 characters, giving writers more room than X for conversational and story-driven posts.',
  },
  {
    question: 'What is the Bluesky character limit?',
    answer:
      'Bluesky posts are limited to 300 characters, which pushes most drafts toward tighter, more concise phrasing.',
  },
  {
    question: 'Can I post the same copy on Threads and Bluesky?',
    answer:
      'Sometimes, but not always. A Threads post may need trimming or restructuring before it fits comfortably on Bluesky.',
  },
  {
    question: 'Why can emoji-heavy posts behave differently on Bluesky?',
    answer:
      'Some emoji sequences are made of multiple underlying code points. Grapheme-aware counting helps better reflect how users experience those visible characters.',
  },
];

function buildArticleJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Threads and Bluesky Character Limits: Practical Guide',
    description:
      'Compare Threads and Bluesky character limits, practical writing lengths, and when a cross-platform draft needs trimming before you publish.',
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

export default function ThreadsAndBlueskyCharacterLimitsPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: 'Threads and Bluesky Character Limits', path: PAGE_PATH },
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
            <li className="text-foreground font-medium">Threads and Bluesky</li>
          </ol>
        </nav>

        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-sky-500/10 text-sky-700 text-xs font-bold uppercase tracking-wider">
            Social Platforms · Short-form Writing
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Threads and Bluesky Character Limits: How to Write for Both Without Guessing
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
            Threads gives you more room to talk. Bluesky rewards tighter phrasing. A draft that fits one does not automatically fit the other.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium pt-2">
            <span>8 min read</span>
            <span>-</span>
            <span>Updated May 2026</span>
          </div>
        </div>
      </header>

      <div className="prose prose-sky dark:prose-invert max-w-none">
        <p className="lead">
          Threads and Bluesky often get lumped together as "alternatives to X," but the writing style that works on each platform is not identical. The limit itself pushes the tone in different directions.
        </p>

        <section className="my-12">
          <h2 className="text-3xl font-bold mb-6">Threads vs Bluesky at a glance</h2>
          <div className="overflow-x-auto rounded-3xl border border-border">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 font-bold">Platform</th>
                  <th className="px-6 py-4 font-bold">Hard limit</th>
                  <th className="px-6 py-4 font-bold">Typical style</th>
                  <th className="px-6 py-4 font-bold">What to watch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr><td className="px-6 py-4">Threads</td><td className="px-6 py-4">500 characters</td><td className="px-6 py-4">Roomier, conversational</td><td className="px-6 py-4">Avoid turning every post into a mini blog entry</td></tr>
                <tr><td className="px-6 py-4">Bluesky</td><td className="px-6 py-4">300 characters</td><td className="px-6 py-4">Compact, context-rich</td><td className="px-6 py-4">Emoji clusters and handles can crowd the draft fast</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="my-12">
          <h2 className="text-3xl font-bold mb-6">How Threads changes your writing</h2>
          <p>
            With 500 characters, Threads gives you more freedom to sound conversational. You can fit a hook, a clearer setup, and a longer payoff without immediately feeling cramped. That extra room makes the platform friendlier for narrative posts, reactions, and short educational breakdowns.
          </p>
        </section>

        <section className="my-12">
          <h2 className="text-3xl font-bold mb-6">How Bluesky changes your writing</h2>
          <p>
            Bluesky is tighter. The 300-character limit forces clearer word choice and faster context. That often leads to stronger opening lines, but it also means recycled Threads copy will regularly overrun the limit.
          </p>
          <p>
            Our <Link href="/utility/social-media-character-counter" className="font-semibold text-primary hover:underline">Social Media Character Counter</Link> uses grapheme-aware counting for Bluesky so emoji-heavy drafts behave closer to how users perceive the visible text.
          </p>
        </section>

        <section className="my-12">
          <h2 className="text-3xl font-bold mb-6">A safer cross-posting workflow</h2>
          <ol className="list-decimal list-inside space-y-3">
            <li>Write the fuller version for Threads.</li>
            <li>Trim repeated phrases and soft qualifiers.</li>
            <li>Check the Bluesky version separately.</li>
            <li>Keep image specs aligned with our <Link href="/utility/social-media-image-resizer" className="font-semibold text-primary hover:underline">Social Media Image Resizer</Link> if the same visual goes to both platforms.</li>
          </ol>
        </section>

        <section className="my-12 rounded-[2rem] border border-sky-100 bg-sky-50 p-8">
          <h2 className="text-2xl font-bold mb-4 text-sky-900">Where this fits with the rest of your social stack</h2>
          <p className="text-sky-900/80">
            Use this guide with our <Link href="/blog/x-character-limit-with-links" className="font-semibold underline">X length guide</Link> and <Link href="/blog/instagram-caption-character-limit" className="font-semibold underline">Instagram caption guide</Link> if you repurpose the same announcement, thread intro, or creator note across multiple networks.
          </p>
        </section>

        <section id="faq" className="my-16 scroll-mt-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Threads and Bluesky FAQ</h2>
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
