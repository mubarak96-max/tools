import Link from 'next/link';
import { AuthorSection } from '@/components/blog/AuthorSection';
import type { Metadata } from 'next';

import JsonLd from '@/components/seo/JsonLd';
import { absoluteUrl } from '@/lib/seo/metadata';
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from '@/lib/seo/jsonld';

const PAGE_PATH = '/blog/instagram-caption-character-limit';
const PAGE_URL = absoluteUrl(PAGE_PATH);
const LAST_UPDATED_ISO = '2026-05-01T00:00:00.000Z';

export const metadata: Metadata = {
  title: 'Instagram Caption Character Limit: Best Length Guide (2026)',
  description:
    'Learn the Instagram caption character limit, the 125-character preview cutoff, hashtag rules, and how to write captions that earn more taps on "more."',
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Instagram Caption Character Limit: Best Length Guide (2026)',
    description:
      'The real Instagram caption limit is not just 2,200 characters. Learn the preview cutoff, hashtag cap, and best writing strategy for captions that get read.',
    url: PAGE_URL,
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Instagram Caption Character Limit',
    description: 'Best caption length, preview cutoff, and hashtag rules for Instagram in 2026.',
  },
  other: {
    'article:modified_time': LAST_UPDATED_ISO,
  },
};

const faq = [
  {
    question: 'What is the Instagram caption character limit?',
    answer:
      'Instagram captions can be up to 2,200 characters long, but only the beginning of the caption is visible in the feed before users need to tap more.',
  },
  {
    question: 'How many characters show before Instagram cuts off the caption?',
    answer:
      'A practical rule of thumb is about 125 characters in the feed preview. Device, line breaks, and emoji usage can change the exact cutoff slightly.',
  },
  {
    question: 'Do Instagram hashtags count toward the caption limit?',
    answer:
      'Yes. Hashtags count as part of the full caption character total. Separately, Instagram also limits you to 30 hashtags in the caption.',
  },
  {
    question: 'Should I use the full 2,200 characters on Instagram?',
    answer:
      'Only when the post format justifies it. Educational posts, story-driven captions, and launch posts can use more room, but the first sentence still carries the most weight.',
  },
];

function buildArticleJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Instagram Caption Character Limit: Best Length Guide (2026)',
    description:
      'Learn the Instagram caption character limit, the 125-character preview cutoff, hashtag rules, and how to write captions that earn more taps on "more."',
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

export default function InstagramCaptionCharacterLimitPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: 'Instagram Caption Character Limit', path: PAGE_PATH },
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
            <li className="text-foreground font-medium">Instagram Captions</li>
          </ol>
        </nav>

        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 text-xs font-bold uppercase tracking-wider">
            Instagram Strategy · Caption Writing
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Instagram Caption Character Limit: Best Length, Preview Cutoff, and Hashtag Rules
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
            The real Instagram caption limit is not just 2,200 characters. The first 125 characters decide whether anyone taps "more."
          </p>
          <div className="pt-2">
            <AuthorSection />
            <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium mt-3">
              <span>9 min read</span>
              <span>-</span>
              <span>Published January 2026</span>
            </div>
          </div>
        </div>
      </header>

      <div className="prose prose-rose dark:prose-invert max-w-none">
        <p className="lead">
          Many creators obsess over Instagram&apos;s 2,200-character maximum, but the better question is how much text a user sees before deciding whether to expand the caption. In practice, the preview matters more than the ceiling.
        </p>

        <section className="my-12">
          <h2 className="text-3xl font-bold mb-6">The Hard Limit vs the Real Limit</h2>
          <p>
            Instagram lets you publish captions up to 2,200 characters. That is the technical maximum. The practical limit is much smaller because the feed preview usually truncates after roughly 125 characters. If your opening line is vague, the rest of the caption is hidden behind a tap that many people will never make.
          </p>
          <p>
            This is why high-performing captions are written in layers. The first sentence acts like a headline. The next lines expand the promise. The remaining space delivers proof, context, or a call to action for people who choose to read deeper.
          </p>
        </section>

        <section className="my-12">
          <h2 className="text-3xl font-bold mb-6">How Long Should an Instagram Caption Be?</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-3xl border border-border bg-card p-6">
              <h3 className="text-lg font-bold mb-2">Short-form posts</h3>
              <p className="text-sm text-muted-foreground m-0">50 to 150 characters works well for lifestyle posts, quick announcements, and meme-style content.</p>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6">
              <h3 className="text-lg font-bold mb-2">Educational posts</h3>
              <p className="text-sm text-muted-foreground m-0">150 to 600 characters gives you room for a hook, a lesson, and a CTA without overwhelming the reader.</p>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6">
              <h3 className="text-lg font-bold mb-2">Storytelling posts</h3>
              <p className="text-sm text-muted-foreground m-0">Long captions can work when the story is strong, but the first line still has to earn the expansion click.</p>
            </div>
          </div>
        </section>

        <section className="my-12">
          <h2 className="text-3xl font-bold mb-6">Hashtags: Character Limit vs Slot Limit</h2>
          <p>
            Instagram creators often mix up two different constraints. First, hashtags count toward the total caption character limit. Second, Instagram caps the number of hashtags at 30. Those are separate rules.
          </p>
          <p>
            This matters because a caption can be short enough in raw character count but still fail if it contains too many hashtags. That is why our <Link href="/utility/social-media-character-counter" className="font-semibold text-primary hover:underline">Social Media Character Counter</Link> includes a hashtag-aware mode instead of only using plain text length.
          </p>
        </section>

        <section className="my-12">
          <h2 className="text-3xl font-bold mb-6">A Better Caption Structure</h2>
          <ol className="list-decimal list-inside space-y-3">
            <li><strong>Hook:</strong> Put the core promise in the first 125 characters.</li>
            <li><strong>Context:</strong> Explain who the post is for and why it matters now.</li>
            <li><strong>Payload:</strong> Deliver the lesson, story, or proof.</li>
            <li><strong>CTA:</strong> Ask for one action: save, comment, click, or share.</li>
          </ol>
          <p>
            If you are publishing a carousel, the caption should support the slides rather than repeat them. Our <Link href="/blog/carousel-caption-guide" className="font-semibold text-primary hover:underline">carousel caption guide</Link> goes deeper on that workflow.
          </p>
        </section>

        <section className="my-12 rounded-[2rem] border border-rose-100 bg-rose-50 p-8">
          <h2 className="text-2xl font-bold mb-4 text-rose-900">Use the right workflow</h2>
          <p className="text-rose-900/80">
            Resize the creative with our <Link href="/utility/social-media-image-resizer" className="font-semibold underline">Social Media Image Resizer</Link>, validate the caption with the <Link href="/utility/social-media-character-counter" className="font-semibold underline">Social Media Character Counter</Link>, and tag links with the <Link href="/utility/utm-builder" className="font-semibold underline">UTM Builder</Link> before you publish.
          </p>
        </section>

        <section id="faq" className="my-16 scroll-mt-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Instagram Caption FAQ</h2>
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
