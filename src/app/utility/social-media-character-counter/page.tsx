import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BarChart3, BookOpen, CheckCircle2, Edit3, HelpCircle, Search, Table2 } from 'lucide-react';

import JsonLd from '@/components/seo/JsonLd';
import ToolPageScaffold from '@/components/tools/ToolPageScaffold';
import { buildMetadata } from '@/lib/seo/metadata';
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from '@/lib/seo/jsonld';
import CharacterCounter from './components/CharacterCounter';
import { PLATFORMS } from './platforms';

const PAGE_PATH = '/utility/social-media-character-counter';
const PAGE_URL = 'https://findbest.tools/utility/social-media-character-counter';
const LAST_UPDATED_ISO = '2026-05-01T00:00:00.000Z';

const baseMetadata = buildMetadata({
  title: 'Social Media Character Counter - Instagram, X, LinkedIn and Threads Limits',
  description:
    'Check Instagram caption length, X character count with URLs, LinkedIn post limits, Threads, Bluesky, TikTok, and more. Real-time counting, preview thresholds, and cross-platform comparison.',
  path: PAGE_PATH,
});

export const metadata: Metadata = {
  ...baseMetadata,
  keywords: [
    'social media character counter',
    'instagram caption character counter',
    'instagram caption character limit',
    'x character limit with links',
    'instagram character limit',
    'twitter character count',
    'linkedin character limit',
    'linkedin post character limit',
    'tiktok character counter',
    'threads character limit',
    'bluesky character limit',
    'facebook character limit',
    'character count for social media',
    'caption length checker',
    'social media manager tools',
  ],
  other: {
    'article:modified_time': LAST_UPDATED_ISO,
  },
};

const faqItems = [
  {
    question: 'How many characters can an Instagram caption be?',
    answer:
      "Instagram captions can be up to 2,200 characters long, but the more practical number is 125 because that's where the feed preview usually truncates before the user taps more.",
  },
  {
    question: 'What is the X character limit?',
    answer:
      'Standard X posts are limited to 280 characters, and every URL is weighted as 23 characters regardless of how long the visible link actually is.',
  },
  {
    question: 'Do emojis count as characters on social media?',
    answer:
      'Yes. Emojis count toward platform limits, and some platforms treat combined emoji sequences differently. This tool uses grapheme-aware counting where the platform behavior calls for it, such as Bluesky posts.',
  },
  {
    question: 'Does character count include spaces and line breaks?',
    answer:
      'Yes. Spaces, punctuation, and line breaks all count toward most platform limits, so formatting choices can push a draft over the line even when the wording stays the same.',
  },
  {
    question: 'Why does the hashtag field count feel different from caption count?',
    answer:
      'Some platform fields are not plain character limits. Instagram hashtag slots are capped by the number of hashtags, not the number of caption characters, so this tool counts hashtag tokens separately for those fields.',
  },
  {
    question: 'Can I compare one draft across multiple platforms?',
    answer:
      'Yes. Write once, then switch platforms and fields to see how the same draft performs against different post, bio, title, and caption limits without rewriting from scratch.',
  },
];

function buildApplicationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Social Media Character Counter',
    url: PAGE_URL,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'Free browser-based social media character counter for Instagram, X, LinkedIn, TikTok, Threads, Bluesky, YouTube, Pinterest, Facebook, Snapchat, and Mastodon.',
    featureList: [
      'Platform-specific character counting',
      'Weighted X URL handling',
      'Hashtag-count limits for Instagram',
      'Bluesky grapheme-aware counting',
      'Real-time status warnings',
      'Draft cleanup and trim actions',
    ],
  };
}

const comparisonRows = [
  {
    platform: 'Instagram',
    field: 'Caption',
    preview: 'About 125 chars',
    max: '2,200 chars',
    counts: 'Characters, spaces, emojis, line breaks',
    trap: 'Writing the hook after the preview cutoff',
    href: '/blog/instagram-caption-character-limit',
  },
  {
    platform: 'Instagram',
    field: 'Hashtags',
    preview: 'Visible anywhere in caption',
    max: '30 hashtags',
    counts: 'Hashtag tokens, not raw characters',
    trap: 'Confusing hashtag slots with caption length',
    href: '/blog/instagram-caption-character-limit',
  },
  {
    platform: 'X',
    field: 'Post',
    preview: 'Usually fully visible',
    max: '280 chars',
    counts: 'Characters with each URL weighted as 23',
    trap: 'Using plain text length for link-heavy posts',
    href: '/blog/x-character-limit-with-links',
  },
  {
    platform: 'LinkedIn',
    field: 'Post',
    preview: 'About 210 chars',
    max: '3,000 chars',
    counts: 'Characters, spaces, line breaks, emojis',
    trap: 'Burying the value prop below "see more"',
    href: '/blog/linkedin-post-character-limit',
  },
  {
    platform: 'Threads',
    field: 'Post',
    preview: 'Varies by device',
    max: '500 chars',
    counts: 'Characters and line breaks',
    trap: 'Treating Threads like X instead of a roomier caption format',
    href: '/blog/threads-bluesky-character-limits',
  },
  {
    platform: 'Bluesky',
    field: 'Post',
    preview: 'Usually fully visible',
    max: '300 chars',
    counts: 'Grapheme-aware characters for emoji-heavy text',
    trap: 'Assuming emoji sequences always count like plain letters',
    href: '/blog/threads-bluesky-character-limits',
  },
];

const guideCards = [
  {
    title: 'Instagram Caption Character Limit',
    description: 'Best caption length, the 125-character preview cutoff, and how hashtag limits differ from caption limits.',
    href: '/blog/instagram-caption-character-limit',
    label: 'Instagram guide',
  },
  {
    title: 'X Character Limit With Links',
    description: 'Why a URL still costs 23 characters, how mentions affect space, and when plain character counters fail.',
    href: '/blog/x-character-limit-with-links',
    label: 'X guide',
  },
  {
    title: 'LinkedIn Post Character Limit',
    description: 'How to write for the 210-character preview without wasting the extra room available in long-form posts.',
    href: '/blog/linkedin-post-character-limit',
    label: 'LinkedIn guide',
  },
  {
    title: 'Threads and Bluesky Character Limits',
    description: 'A practical guide to writing short-form posts for newer platforms with different norms and counting behavior.',
    href: '/blog/threads-bluesky-character-limits',
    label: 'Threads and Bluesky guide',
  },
];

export default function SocialMediaCharacterCounterPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Utility', path: '/utility' },
    { name: 'Social Media Character Counter', path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faqItems);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <ToolPageScaffold
        path={PAGE_PATH}
        category="Utility"
        categoryHref="/utility"
        title="Social Media Character Counter for Instagram Captions, X Posts, LinkedIn and More"
        description="Write once and instantly check whether your caption, post, bio, title, or hashtag set fits Instagram, X, LinkedIn, TikTok, Threads, Bluesky, YouTube, and other major platform limits."
        relatedGuides={guideCards}
      >
        <CharacterCounter />

        <div className="mt-20 space-y-24">
          <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shadow-sm border border-slate-200">
                  <Search size={20} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">How to Use This Character Counter</h2>
              </div>

              <div className="space-y-5 text-slate-600 leading-7 max-w-3xl">
                <p>
                  Write or paste your draft, choose the platform, and then switch between fields like caption, post, bio, title, or hashtags. The checker updates in real time so you can see whether the same draft fits Instagram, X, LinkedIn, Threads, Bluesky, TikTok, YouTube, and other major platforms.
                </p>
                <p>
                  The goal is not just to stay under the hard limit. It is to catch the places where counting rules differ. Instagram captions have a much shorter preview window than the full limit. X counts each URL as a fixed-length token. LinkedIn posts need a strong opening before the "see more" break. Bluesky can behave differently with emoji-heavy text.
                </p>
                <p>
                  If you are repurposing the same copy across channels, pair this checker with our <Link href="/utility/social-media-image-resizer" className="font-semibold text-indigo-600 hover:text-indigo-700">Social Media Image Resizer</Link> for visual specs, <Link href="/text/word-frequency" className="font-semibold text-indigo-600 hover:text-indigo-700">Word Frequency Counter</Link> to tighten repetition, and <Link href="/utility/utm-builder" className="font-semibold text-indigo-600 hover:text-indigo-700">UTM Builder</Link> to tag the links you publish.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-5">What this tool helps you catch</h3>
              <div className="grid gap-3">
                {[
                  'Captions that are under the hard limit but too long for the preview',
                  'X posts that miscount links when you use a plain text counter',
                  'LinkedIn openings that bury the hook below the fold',
                  'Hashtag sets that exceed slot-based limits',
                  'Cross-posted drafts that fit one platform but overflow another',
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <span className="text-sm font-semibold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                <BookOpen size={20} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Platform Character Limits (2026)</h2>
            </div>

            <p className="text-slate-600 leading-7 max-w-3xl mb-8">
              These reference cards come from the same platform rules used by the tool itself, so the supporting content and the live checker stay aligned instead of drifting apart over time.
            </p>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {PLATFORMS.map((platform) => (
                <div key={platform.id} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-6">
                    <platform.icon size={24} style={{ color: platform.color }} />
                    <h3 className="text-xl font-bold text-slate-900">{platform.name}</h3>
                  </div>
                  <div className="space-y-4">
                    {Object.values(platform.limits).slice(0, 3).map((limit) => (
                      <div key={limit.label} className="flex justify-between items-baseline gap-4 border-b border-slate-50 pb-4">
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{limit.label}</span>
                          <span className="text-[10px] text-slate-400 font-medium italic leading-none">{limit.note}</span>
                        </div>
                        <span className="text-lg font-black text-slate-800 font-mono shrink-0">{limit.max.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm border border-amber-100">
                <Table2 size={20} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Preview Limits vs Hard Limits</h2>
            </div>

            <p className="text-slate-600 leading-7 max-w-3xl mb-8">
              Hard limits tell you when a platform blocks a post. Preview limits tell you when the most important part of your copy disappears behind a truncation control or weakens readability. That is why social copy should be optimized to the visible threshold first and the technical maximum second.
            </p>

            <div className="overflow-x-auto rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <table className="w-full min-w-[960px] text-left text-sm">
                <thead className="bg-slate-100 text-slate-900">
                  <tr>
                    <th className="px-6 py-4 font-bold">Platform</th>
                    <th className="px-6 py-4 font-bold">Field</th>
                    <th className="px-6 py-4 font-bold">Practical preview</th>
                    <th className="px-6 py-4 font-bold">Hard limit</th>
                    <th className="px-6 py-4 font-bold">What counts differently</th>
                    <th className="px-6 py-4 font-bold">Common mistake</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {comparisonRows.map((row) => (
                    <tr key={`${row.platform}-${row.field}`} className="align-top">
                      <td className="px-6 py-4 font-semibold text-slate-900">{row.platform}</td>
                      <td className="px-6 py-4 text-slate-700">{row.field}</td>
                      <td className="px-6 py-4 text-slate-700">{row.preview}</td>
                      <td className="px-6 py-4 font-mono text-slate-800">{row.max}</td>
                      <td className="px-6 py-4 text-slate-600">{row.counts}</td>
                      <td className="px-6 py-4 text-slate-600">
                        {row.trap}{' '}
                        <Link href={row.href} className="font-semibold text-indigo-600 hover:text-indigo-700">
                          Learn more
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="grid lg:grid-cols-2 gap-10">
            <div className="bg-gradient-to-br from-rose-50 to-white rounded-[2rem] border border-rose-100 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-5">Instagram caption character counter</h2>
              <p className="text-slate-600 leading-7 mb-4">
                Instagram gives you 2,200 characters, but the first 125 do most of the work. If the hook is weak or hidden, the rest of the caption rarely gets read. That is why our counter separates hard-limit compliance from writing strategy.
              </p>
              <p className="text-slate-600 leading-7 mb-6">
                It also handles the common confusion around hashtags. Caption length and hashtag slots are not the same problem. You can be well under 2,200 characters and still exceed the 30-hashtag cap.
              </p>
              <Link href="/blog/instagram-caption-character-limit" className="inline-flex items-center gap-2 font-semibold text-rose-600 hover:text-rose-700">
                Read the Instagram limit guide <ArrowRight size={16} />
              </Link>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-5">X character limit with links</h2>
              <p className="text-slate-600 leading-7 mb-4">
                X is the easiest platform to miscount because URLs are not treated by visible length. A short branded link and a long raw URL both consume the same 23-character allowance, so generic counters overstate your available room.
              </p>
              <p className="text-slate-600 leading-7 mb-6">
                The live tool uses weighted URL logic for X posts. That makes it materially more useful for launch posts, thread intros, and link-heavy promotional copy than plain character count widgets.
              </p>
              <Link href="/blog/x-character-limit-with-links" className="inline-flex items-center gap-2 font-semibold text-slate-900 hover:text-slate-700">
                Read the X character guide <ArrowRight size={16} />
              </Link>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white rounded-[2rem] border border-blue-100 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-5">LinkedIn post character limit</h2>
              <p className="text-slate-600 leading-7 mb-4">
                LinkedIn gives you plenty of room at the technical level, but only a fraction of that space is visible before the "see more" break. Strong LinkedIn writers therefore optimize the first 210 characters as if they were a headline, subhead, and proof point combined.
              </p>
              <p className="text-slate-600 leading-7 mb-6">
                If you publish document posts, carousels, founder notes, or B2B education threads, the real job is not just staying under the limit. It is making the first screen impossible to ignore.
              </p>
              <Link href="/blog/linkedin-post-character-limit" className="inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700">
                Read the LinkedIn length guide <ArrowRight size={16} />
              </Link>
            </div>

            <div className="bg-gradient-to-br from-sky-50 to-white rounded-[2rem] border border-sky-100 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-5">Threads and Bluesky character limits</h2>
              <p className="text-slate-600 leading-7 mb-4">
                Newer platforms are not just smaller versions of X. Threads tolerates roomier conversational copy. Bluesky is shorter and more sensitive to concise phrasing, especially when emoji sequences and handles compete for space.
              </p>
              <p className="text-slate-600 leading-7 mb-6">
                This is exactly where a cross-platform counter earns its keep: one draft, multiple destinations, different length rules, and no guesswork about which version fits where.
              </p>
              <Link href="/blog/threads-bluesky-character-limits" className="inline-flex items-center gap-2 font-semibold text-sky-600 hover:text-sky-700">
                Read the Threads and Bluesky guide <ArrowRight size={16} />
              </Link>
            </div>
          </section>

          <section className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                  <CheckCircle2 size={20} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">How This Counter Works</h2>
              </div>

              <div className="grid gap-6">
                {[
                  {
                    title: 'Field-specific counting',
                    text: 'The active limit is calculated against the field you selected, not just the platform default. A LinkedIn headline, Instagram hashtag set, and X post can all count differently.',
                  },
                  {
                    title: 'Weighted X URLs',
                    text: 'For X posts, links are treated as 23 characters instead of their visible length. That makes the X post counter materially more accurate than a plain text-length check.',
                  },
                  {
                    title: 'Hashtag-slot limits',
                    text: 'Instagram hashtag mode counts hashtag tokens instead of raw characters, because that field is constrained by count rather than by caption length.',
                  },
                  {
                    title: 'Grapheme-aware behavior',
                    text: 'Bluesky can behave differently around emoji and combined Unicode sequences, so the tool uses grapheme-aware counting where that distinction matters.',
                  },
                ].map((item) => (
                  <div key={item.title} className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                  <Edit3 size={20} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Writing Strategy by Platform</h2>
              </div>

              <div className="grid gap-6">
                {[
                  {
                    title: 'Instagram',
                    text: 'Write for the first 125 characters first. The full 2,200-character limit matters less than the preview hook that determines whether someone expands the caption.',
                  },
                  {
                    title: 'X',
                    text: 'Assume every link costs 23 characters and keep extra room for mentions, hashtags, and punctuation. Tight copy beats maxing out 280 every time.',
                  },
                  {
                    title: 'LinkedIn',
                    text: "Treat the first 210 characters as your real headline. That's the decision point before the user chooses whether to click see more.",
                  },
                  {
                    title: 'TikTok and Threads',
                    text: 'Short hooks still matter even when the hard limit is larger. Front-load the payoff, then use the rest of the caption for context or CTA.',
                  },
                  {
                    title: 'Bluesky and Mastodon',
                    text: 'Open-web platforms often reward denser writing and clearer context. A concise first sentence does more work than a long setup.',
                  },
                  {
                    title: 'YouTube and Pinterest',
                    text: 'Titles often truncate well before the technical maximum. Optimize for visible preview length, not just the full field allowance.',
                  },
                ].map((tip) => (
                  <div key={tip.title} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-indigo-200 transition-all">
                    <h3 className="font-bold text-slate-900 mb-2">{tip.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{tip.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-slate-900 rounded-[3rem] p-12 lg:p-20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-600/10 blur-[120px] rounded-full -ml-48 -mb-48" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-12">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shadow-sm border border-white/20 backdrop-blur-md">
                  <HelpCircle size={20} />
                </div>
                <h2 className="text-3xl font-black tracking-tight">Frequently Asked Questions</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                {faqItems.map((faq) => (
                  <div key={faq.question} className="space-y-4">
                    <h3 className="text-lg font-bold text-indigo-300">{faq.question}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shadow-sm border border-slate-200">
                <BarChart3 size={20} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Tools for Content Creators</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'YouTube Title Checker', href: '/seo/youtube-title-checker', desc: 'Check visible title length and truncation' },
                { name: 'Social Media Image Resizer', href: '/utility/social-media-image-resizer', desc: 'Fix image dimensions for each platform' },
                { name: 'UTM Builder', href: '/utility/utm-builder', desc: 'Tag campaign links before posting' },
                { name: 'Word Frequency Counter', href: '/text/word-frequency', desc: 'Tighten repeated words in your captions' },
              ].map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className="group p-6 bg-white border border-slate-200 rounded-3xl hover:border-indigo-200 hover:shadow-lg transition-all"
                >
                  <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">{tool.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{tool.desc}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </ToolPageScaffold>
    </div>
  );
}
