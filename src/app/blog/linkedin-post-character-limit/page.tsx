import Link from 'next/link';
import type { Metadata } from 'next';

import JsonLd from '@/components/seo/JsonLd';
import { absoluteUrl } from '@/lib/seo/metadata';
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from '@/lib/seo/jsonld';

const PAGE_PATH = '/blog/linkedin-post-character-limit';
const PAGE_URL = absoluteUrl(PAGE_PATH);
const LAST_UPDATED_ISO = '2026-05-01T00:00:00.000Z';

export const metadata: Metadata = {
  title: 'LinkedIn Post Character Limit: Best Length Guide (2026)',
  description:
    'Learn the LinkedIn post character limit, the practical 210-character preview cutoff, and how to write stronger hooks for B2B posts and document promotions.',
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'LinkedIn Post Character Limit: Best Length Guide (2026)',
    description:
      'The real LinkedIn challenge is not 3,000 characters. It is making the first 210 do the heavy lifting before users click "see more."',
    url: PAGE_URL,
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkedIn Post Character Limit',
    description: 'Best LinkedIn post length, preview cutoff, and post-writing strategy for 2026.',
  },
  other: {
    'article:modified_time': LAST_UPDATED_ISO,
  },
};

const faq = [
  {
    question: 'What is the LinkedIn post character limit?',
    answer:
      'LinkedIn posts can be up to 3,000 characters long, but most readers only see the opening lines before they have to click "see more."',
  },
  {
    question: 'How many characters show before LinkedIn cuts off a post?',
    answer:
      'A practical benchmark is around 210 characters, though exact display can vary by device width, line breaks, and formatting.',
  },
  {
    question: 'Should I write short or long LinkedIn posts?',
    answer:
      'Both can work. The deciding factor is whether the first visible portion earns the click to expand the rest of the post.',
  },
  {
    question: 'Does the LinkedIn PDF document title matter too?',
    answer:
      'Yes. For document posts and carousels, the document title acts like a second headline and deserves the same care as the opening post text.',
  },
];

function buildArticleJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'LinkedIn Post Character Limit: Best Length Guide (2026)',
    description:
      'Learn the LinkedIn post character limit, the practical 210-character preview cutoff, and how to write stronger hooks for B2B posts and document promotions.',
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

export default function LinkedInPostCharacterLimitPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: 'LinkedIn Post Character Limit', path: PAGE_PATH },
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
            <li className="text-foreground font-medium">LinkedIn Posts</li>
          </ol>
        </nav>

        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 text-xs font-bold uppercase tracking-wider">
            LinkedIn Strategy · B2B Content
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            LinkedIn Post Character Limit: Best Length, Preview Cutoff, and Writing Strategy
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
            LinkedIn gives you plenty of space, but the first 210 characters still decide whether your audience reads the rest.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium pt-2">
            <span>9 min read</span>
            <span>-</span>
            <span>Updated May 2026</span>
          </div>
        </div>
      </header>

      <div className="prose prose-blue dark:prose-invert max-w-none">
        <p className="lead">
          The LinkedIn post limit is generous enough to tempt people into writing essays. That is usually the wrong instinct. The real constraint is not the 3,000-character ceiling. It is the visible opening that has to earn a click on "see more."
        </p>

        <section className="my-12">
          <h2 className="text-3xl font-bold mb-6">The LinkedIn limit that matters most</h2>
          <p>
            Technically, LinkedIn allows up to 3,000 characters in a post. Practically, many readers decide whether to keep reading after the first two or three lines. A reliable working benchmark is about 210 characters.
          </p>
          <p>
            That means the opening needs a job. It should frame the problem, promise the value, or create enough tension that a professional audience wants the rest.
          </p>
        </section>

        <section className="my-12">
          <h2 className="text-3xl font-bold mb-6">What long posts do well on LinkedIn</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-6">
              <h3 className="text-lg font-bold mb-2">Narrative posts</h3>
              <p className="text-sm text-muted-foreground m-0">Short story arcs, lessons learned, and founder reflections can justify longer copy.</p>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6">
              <h3 className="text-lg font-bold mb-2">Educational breakdowns</h3>
              <p className="text-sm text-muted-foreground m-0">Frameworks, teardown posts, and process summaries often benefit from more detail and better structure.</p>
            </div>
          </div>
        </section>

        <section className="my-12">
          <h2 className="text-3xl font-bold mb-6">A cleaner LinkedIn structure</h2>
          <ol className="list-decimal list-inside space-y-3">
            <li><strong>Opening line:</strong> State the problem, tension, or surprising result.</li>
            <li><strong>Expansion:</strong> Give context and relevance fast.</li>
            <li><strong>Proof:</strong> Add the lesson, example, or framework.</li>
            <li><strong>CTA:</strong> End with one question or action, not a pile of asks.</li>
          </ol>
          <p>
            If you are promoting a document post, check your caption with the <Link href="/utility/social-media-character-counter" className="font-semibold text-primary hover:underline">Social Media Character Counter</Link> and build the slides with our <Link href="/design/free-social-media-carousel-builder" className="font-semibold text-primary hover:underline">Carousel Builder</Link>.
          </p>
        </section>

        <section className="my-12">
          <h2 className="text-3xl font-bold mb-6">Document posts need two hooks</h2>
          <p>
            A LinkedIn carousel or PDF post has two separate pieces of copy that matter: the opening text above the post and the document title itself. Many creators optimize one and neglect the other.
          </p>
          <p>
            If the post text is weak, nobody opens the document. If the document title is vague, the asset loses click value even after the post earns attention. Treat both pieces as entry points.
          </p>
        </section>

        <section className="my-12 rounded-[2rem] border border-blue-100 bg-blue-50 p-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">Repurposing from LinkedIn to Instagram or Threads</h2>
          <p className="text-blue-900/80">
            Long LinkedIn posts often need heavier editing before they fit other channels. Compare the same draft against the <Link href="/blog/instagram-caption-character-limit" className="font-semibold underline">Instagram caption guide</Link> and the <Link href="/blog/threads-bluesky-character-limits" className="font-semibold underline">Threads and Bluesky guide</Link> before you cross-post it.
          </p>
        </section>

        <section id="faq" className="my-16 scroll-mt-20">
          <h2 className="text-3xl font-bold mb-8 text-center">LinkedIn Post Length FAQ</h2>
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
