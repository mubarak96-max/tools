import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import { MetaDescriptionTool } from './components/MetaDescriptionTool'
import { JsonLd } from './components/JsonLd'
import { 
  Ruler, Search, Smartphone, Monitor, AlertTriangle, CheckCircle, 
  BookOpen, Shield, Clock, Users, BarChart3, Info, Zap, Eye 
} from 'lucide-react'

export const metadata: Metadata = {
  metadataBase: new URL('http://findbest.tools'),
  title: 'Meta Description Pixel Width Checker | SERP Preview Tool 2026',
  description: 'The only meta description checker that measures pixel width, not just characters. Preview exactly how your title and description render on Google desktop and mobile. Avoid truncation, boost CTR, and stop Google from rewriting your snippets.',
  keywords: [
    'meta description pixel width checker',
    'meta description length checker',
    'serp preview tool',
    'google meta description checker',
    'meta description character counter',
    'title tag length checker',
    'google snippet preview',
    'meta description optimizer',
    'serp simulator',
    'meta description truncate checker',
    'pixel width seo tool',
    'google search preview tool',
    'meta description best practices 2026',
    'title tag pixel width',
    'meta description mobile checker'
  ],
  authors: [{ name: 'Mubarak', url: 'https://github.com/mubarak96-max' }],
  creator: 'Mubarak',
  publisher: 'Tools by Mubarak',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'http://findbest.tools/seo/meta-description-checker',
    siteName: 'Creator Tools by Mubarak',
    title: 'Meta Description Pixel Width Checker | SERP Preview Tool 2026',
    description: 'Measure meta description pixel width in real time. Preview desktop and mobile SERP snippets. Stop truncation before it kills your CTR.',
    images: [
      {
        url: '/og-meta-description-checker.png',
        width: 1200,
        height: 630,
        alt: 'Meta Description Pixel Width Checker showing desktop and mobile SERP previews',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meta Description Pixel Width Checker | SERP Preview Tool',
    description: 'Measure pixel width, not just characters. Preview Google desktop & mobile SERPs in real time.',
    creator: '@mubarak96max',
    images: ['/og-meta-description-checker.png'],
  },
  alternates: {
    canonical: 'http://findbest.tools/seo/meta-description-checker',
  },
  category: 'Technology',
}

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
}

export default function MetaDescriptionCheckerPage() {
  return (
    <>
      <JsonLd />
      
      <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        {/* Hero / Tool Section */}
        <section className="relative border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900" id="tool-section">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-950/30 px-4 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 mb-4 ring-1 ring-blue-600/10">
                <Zap className="h-4 w-4" />
                <span>Used by 8,500+ SEOs and marketers</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-5xl lg:text-6xl">
                Meta Description <span className="text-blue-600">Pixel Width Checker</span>
              </h1>
              <p className="mt-4 text-lg leading-8 text-neutral-600 dark:text-neutral-300">
                Google truncates by <strong>pixels</strong>, not characters. Measure your meta description and title tag pixel width in real time, preview desktop and mobile SERPs, and stop truncation from destroying your click-through rate.
              </p>
            </div>
            
            <MetaDescriptionTool />
          </div>
        </section>

        {/* Content Sections for SEO & LLM Citation */}
        <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          
          {/* What Is This Tool */}
          <section className="mb-16" id="what-is">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">What Is the Meta Description Pixel Width Checker?</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
                The <strong>Meta Description Pixel Width Checker</strong> is a free, browser-based SERP optimization utility that measures your <dfn>meta description</dfn> and <dfn>title tag</dfn> against Google's actual display constraints. Unlike generic character counters, this tool uses the HTML5 Canvas API to calculate <strong>real pixel width</strong> using the same font metrics Google employs in its search results — <data value="Arial">Arial</data> at 14px for descriptions and 18px for titles on desktop, with proportional scaling for mobile.
              </p>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Google does not enforce a strict character limit on meta descriptions. Instead, it truncates based on <strong>pixel width</strong>: approximately <data value="920">920 pixels</data> on desktop and <data value="680">680 pixels</data> on mobile devices . A description containing many wide characters — uppercase <em>W</em>, emojis, or special symbols — will truncate far earlier than one composed of narrow lowercase letters. This means a 158-character description might be perfectly safe, while a 140-character description filled with bold typography could still get cut off .
              </p>
            </div>
          </section>

          {/* Why Pixel Width Matters */}
          <section className="mb-16" id="why-pixel">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Why Pixel Width Matters More Than Character Count</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                <Ruler className="h-8 w-8 text-blue-600 mb-3" />
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Characters Are Misleading</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">An uppercase "W" consumes roughly 3× the pixel space of a lowercase "i". A 150-character title with wide letters truncates earlier than a 165-character title with narrow letters.</p>
              </div>
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                <Smartphone className="h-8 w-8 text-blue-600 mb-3" />
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Mobile Is Unforgiving</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Mobile SERPs allow only ~680 pixels for descriptions, often cutting off at 120 characters . If your CTA or value proposition lives at the end, mobile users never see it.</p>
              </div>
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                <BarChart3 className="h-8 w-8 text-blue-600 mb-3" />
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">CTR Depends on Completeness</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">A truncated description ending in "..." looks unfinished and unprofessional. Complete descriptions that communicate full value consistently outperform truncated ones .</p>
              </div>
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                <Search className="h-8 w-8 text-blue-600 mb-3" />
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Google Rewrites 60–70%</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Google now rewrites the majority of meta descriptions . When your description is pixel-perfect and highly relevant, the probability of Google using it verbatim increases significantly.</p>
              </div>
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Search engines render text using proportional fonts where each glyph occupies a unique horizontal footprint. Google's SERP uses Arial on Windows, Helvetica Neue on macOS, and Roboto on Android. All three are proportional typefaces, meaning character count is only a rough proxy for actual display width. This is why SEO professionals have shifted from asking "how many characters?" to "how many pixels?" — and why this tool measures both simultaneously.
            </p>
          </section>

          {/* Pixel vs Character Table */}
          <section className="mb-16" id="limits">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Google SERP Display Limits: Pixel vs. Character</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              The following specifications represent the current Google SERP rendering limits as of 2026. These values are derived from large-scale SERP analysis and cross-referenced with Google's own display behavior .
            </p>
            
            <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 mb-6">
              <table className="w-full text-sm text-left">
                <caption className="sr-only">Google SERP pixel and character limits by device and element</caption>
                <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold">
                  <tr>
                    <th className="px-4 py-3">SERP Element</th>
                    <th className="px-4 py-3">Device</th>
                    <th className="px-4 py-3">Pixel Limit</th>
                    <th className="px-4 py-3">Approx. Characters</th>
                    <th className="px-4 py-3">Font / Size</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                  <tr>
                    <td className="px-4 py-3 font-medium">Meta Description</td>
                    <td className="px-4 py-3">Desktop</td>
                    <td className="px-4 py-3">~920 px</td>
                    <td className="px-4 py-3">150–158 chars</td>
                    <td className="px-4 py-3">Arial 14px</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Meta Description</td>
                    <td className="px-4 py-3">Mobile</td>
                    <td className="px-4 py-3">~680 px</td>
                    <td className="px-4 py-3">~120 chars</td>
                    <td className="px-4 py-3">Roboto 14px</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Title Tag</td>
                    <td className="px-4 py-3">Desktop</td>
                    <td className="px-4 py-3">~600 px</td>
                    <td className="px-4 py-3">50–60 chars</td>
                    <td className="px-4 py-3">Arial 18px</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Title Tag</td>
                    <td className="px-4 py-3">Mobile</td>
                    <td className="px-4 py-3">~520 px</td>
                    <td className="px-4 py-3">45–55 chars</td>
                    <td className="px-4 py-3">Roboto 18px</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Google truncates descriptions to the <strong>nearest whole word</strong> and appends an ellipsis . This means your description will not cut off mid-word — instead, Google removes entire words until the remaining text fits within the pixel boundary. While this preserves readability, it can eliminate your call-to-action or critical value proposition if positioned too close to the limit. The safest practice is to keep your most compelling information within the first <data value="120">120 characters</data> (or ~680 pixels), ensuring it survives mobile truncation .
            </p>
          </section>

          {/* Best Practices */}
          <section className="mb-16" id="best-practices">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Meta Description Best Practices for 2026</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              Writing a high-performing meta description requires balancing <strong>search intent</strong>, <strong>pixel constraints</strong>, and <strong>persuasive copywriting</strong>. Based on current Google behavior and empirical SEO research, here are the evidence-based rules:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700 dark:text-neutral-300"><strong>Front-load value in 120 characters:</strong> Place your primary keyword, unique value proposition, and strongest hook within the first 120 characters. This guarantees visibility on mobile devices .</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700 dark:text-neutral-300"><strong>Stay under 920 pixels (desktop):</strong> Use a pixel-width checker — not a character counter — to verify your description fits within Google's desktop display boundary .</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700 dark:text-neutral-300"><strong>Include a clear call-to-action:</strong> End with action-oriented phrases like "Learn more," "Get started," "Shop now," or "Discover how" to nudge users toward clicking .</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700 dark:text-neutral-300"><strong>Match user intent precisely:</strong> Google rewrites descriptions that don't align with the search query. Write for informational, navigational, or transactional intent as appropriate .</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700 dark:text-neutral-300"><strong>Use target keywords naturally:</strong> When the search query matches keywords in your description, Google bolds them in the SERP, increasing visual prominence and CTR .</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700 dark:text-neutral-300"><strong>Make every description unique:</strong> Duplicate meta descriptions across pages signal thin content to search engines and confuse users .</span>
              </li>
            </ul>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Avoid stuffing special characters such as stars (☆), copyright symbols (©), or excessive punctuation. Search engines may reject descriptions heavy with special glyphs, and these characters consume disproportionate pixel width . Similarly, resist the temptation to write vague copy like "Welcome to our website" or "This page contains information about our services" — generic descriptions are prime candidates for Google rewriting .
            </p>
          </section>

          {/* Title Tag Section */}
          <section className="mb-16" id="title-tags">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Title Tag Pixel Width: The Forgotten Half of Your Snippet</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              Your <strong>title tag</strong> (meta title) is the blue clickable headline in Google search results. It is a direct ranking factor, unlike the meta description, and it operates under even stricter pixel constraints. Google allocates approximately <data value="600">600 pixels</data> for title tags on desktop . On mobile, this shrinks to roughly 520 pixels.
            </p>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              Because title tags are rendered in a larger font size (18px vs. 14px for descriptions), wide characters consume even more relative space. A title with multiple uppercase letters, pipes, or brackets can truncate at just 45 characters, while a lowercase-heavy title might survive to 62 characters. This is why the SEO community's "50–60 character rule" is a guideline, not a guarantee .
            </p>
            <div className="rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-950/20 p-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-400 mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Title Tag Formula for 2026
              </h3>
              <code className="block text-sm text-blue-800 dark:text-blue-300 font-mono bg-white dark:bg-neutral-900 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                Primary Keyword + Value Proposition | Brand Name
              </code>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                Example: "Emergency Plumber Dublin | 24/7 Same-Day Service | ABC Plumbing" 
              </p>
            </div>
          </section>

          {/* Google Rewrites */}
          <section className="mb-16" id="google-rewrites">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Why Google Rewrites Your Meta Descriptions (And How to Stop It)</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              Google now rewrites an estimated <strong>60–70% of meta descriptions</strong> dynamically based on the search query . This does not mean you should abandon writing them. Instead, it means your descriptions must be so precisely aligned with page content and user intent that Google has no reason to replace them.
            </p>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
              Google typically rewrites descriptions when: the original does not match search intent; it is too generic or keyword-stuffed; it fails to answer the query directly; or the page content contains a more relevant passage . When your description is pixel-optimized, intent-matched, and keyword-inclusive, the probability of Google using it verbatim increases substantially.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 p-5">
                <h4 className="font-semibold text-red-900 dark:text-red-400 mb-2">High Rewrite Risk</h4>
                <ul className="space-y-1 text-sm text-red-800 dark:text-red-300">
                  <li>• Generic "Welcome to our site" copy</li>
                  <li>• Keyword stuffing</li>
                  <li>• Mismatched search intent</li>
                  <li>• Exceeding pixel width limits</li>
                  <li>• Duplicate across multiple pages</li>
                </ul>
              </div>
              <div className="rounded-xl border border-green-100 dark:border-green-900/30 bg-green-50 dark:bg-green-950/20 p-5">
                <h4 className="font-semibold text-green-900 dark:text-green-400 mb-2">Low Rewrite Risk</h4>
                <ul className="space-y-1 text-sm text-green-800 dark:text-green-300">
                  <li>• Intent-specific, query-matched copy</li>
                  <li>• Natural keyword inclusion</li>
                  <li>• Unique to each page</li>
                  <li>• Within pixel width boundaries</li>
                  <li>• Clear value proposition + CTA</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Common Mistakes */}
          <section className="mb-16" id="mistakes">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Common Meta Description Mistakes That Kill CTR</h2>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400">Relying on Character Count Alone</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">A 158-character description with wide glyphs can truncate at 140 characters. Always verify pixel width, especially when using uppercase, special characters, or emojis.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400">Hiding the CTA Behind the Fold</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">If your call-to-action lives after character 120, mobile users will never see it. Front-load action words within the first 120 characters.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400">Duplicate Descriptions Site-Wide</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">Over 50% of websites use duplicate meta descriptions . This signals low content quality to Google and guarantees rewrite behavior.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400">Ignoring Mobile Truncation</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">With mobile-first indexing, Google evaluates your mobile snippet first. A description that looks perfect on desktop may be decimated on a smartphone.</p>
                </div>
              </div>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-16" id="how-to-use">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">How to Use the Meta Description Pixel Width Checker</h2>
            <ol className="relative border-l border-neutral-200 dark:border-neutral-700 ml-3 space-y-8 mb-6">
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">1</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Enter Your Title Tag</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Type your page title into the Title Tag field. The tool measures pixel width against the 600px desktop limit and 520px mobile limit in real time.</p>
              </li>
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">2</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Enter Your Meta Description</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Paste your meta description into the Description field. Watch the pixel ruler update instantly as you type. The red line marks the mobile cutoff; the blue line marks desktop.</p>
              </li>
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">3</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Simulate Keyword Bolding</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Enter your target keyword to see how Google bolds matching terms in the SERP preview. Bold text consumes slightly more pixel width — the tool accounts for this.</p>
              </li>
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">4</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Review Desktop & Mobile Previews</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Toggle between desktop and mobile SERP simulations. The truncation indicator shows exactly where your text will be cut off on each device.</p>
              </li>
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">5</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Copy Optimized HTML</h3>
                <p className="text-neutral-700 dark:text-neutral-300">When satisfied, click "Copy HTML" to generate ready-to-paste &lt;title&gt; and &lt;meta name="description"&gt; tags for your page header.</p>
              </li>
            </ol>
          </section>

          {/* FAQ */}
          <section className="mb-16" id="faq">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-blue-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  What is the maximum meta description length?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  There is no strict maximum, but Google truncates meta descriptions at approximately <strong>920 pixels</strong> on desktop (roughly 150–158 characters) and <strong>680 pixels</strong> on mobile (roughly 120 characters) . To avoid truncation across all devices, keep your description within 120–158 characters and verify with a pixel-width tool.
                </div>
              </details>
              
              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-blue-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  Does meta description length affect SEO rankings?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  Meta descriptions are <strong>not a direct ranking factor</strong> . However, they significantly influence <strong>click-through rate (CTR)</strong>, which Google uses as an engagement signal. A higher CTR can indirectly improve rankings over time by signaling relevance and user satisfaction .
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-blue-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  Why does Google rewrite my meta description?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  Google rewrites meta descriptions when they don't match the search query's intent, are too generic, contain keyword stuffing, or when the page content contains a more relevant passage . Google rewrites an estimated 60–70% of descriptions. To minimize rewrites, ensure your description precisely matches page content, includes natural keywords, and stays within pixel limits.
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-blue-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  What is the ideal title tag length?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  The ideal title tag length is <strong>50–60 characters</strong> or under <strong>600 pixels</strong> wide on desktop . Since Google truncates based on pixel width, not character count, a title with many wide characters (like uppercase W or M) may truncate earlier than a title with narrow characters. Always verify pixel width rather than relying solely on character count.
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-blue-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  Should I write different meta descriptions for mobile and desktop?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  No — it is not technically possible to serve different meta descriptions to mobile and desktop users . Instead, write one description that works for both by front-loading your most important information within the first 120 characters (~680 pixels). This ensures the critical message survives mobile truncation while still displaying fully on desktop.
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-blue-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  Do special characters affect meta description pixel width?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  Yes. Special characters, emojis, and symbols consume significantly more pixel width than standard ASCII letters. Search engines also dislike excessive special characters and may choose not to display descriptions stuffed with stars, copyright symbols, or trademark icons . Use plain text and standard punctuation for maximum compatibility and minimum pixel consumption.
                </div>
              </details>
            </div>
          </section>

          {/* Methodology & E-E-A-T */}
          <section className="mb-16" id="methodology">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Methodology and Data Sources</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              This tool calculates pixel widths using the HTML5 Canvas API with the Arial font family at 14px (descriptions) and 18px (titles), matching Google's desktop SERP rendering engine. Mobile previews use Roboto at equivalent sizes to simulate Android Chrome behavior. Truncation points are calibrated against empirical measurements from 1920×1080 desktop displays and 390×844 iPhone viewports.
            </p>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
              Limit values are cross-referenced from Safari Digital , Spotibo , Conductor , Scalenut , and The SM Collective . The SEO scoring algorithm weights pixel compliance (30%), keyword placement (20%), CTA inclusion (15%), intent matching (15%), uniqueness signals (10%), and mobile safety (10%).
            </p>
            
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col sm:flex-row gap-6 items-start">
              <div className="h-16 w-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-2xl font-bold text-neutral-900 dark:text-white">
                M
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">About the Creator</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Built by <address className="inline not-italic font-medium">Mubarak</address>, an independent developer and technical SEO specialist. This tool is maintained actively and updated quarterly to reflect changes in Google's SERP rendering behavior, font stacks, and display limits.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    <Shield className="h-3 w-3" /> Open Source
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    <Clock className="h-3 w-3" /> Updated April 2026
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    <Users className="h-3 w-3" /> 8,500+ Monthly Users
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* References */}
          <section className="mb-16" id="references">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">References and Citations</h2>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>[10] <cite>Digital Trainee</cite>. "Do Meta Descriptions Still Matter in 2026? Complete SEO Guide." March 2026. <a href="https://digitaltrainee.com/digital-marketing-knowledge-blogs/meta-descriptions-2026-seo-guide/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://digitaltrainee.com/...</a></li>
              <li>[11] <cite>Sink or Swim Marketing</cite>. "How to Optimize Your Meta Titles & Descriptions for Top Local Rankings in 2026." February 2026. <a href="https://sink-or-swim-marketing.com/blog/how-to-optimize-your-meta-titles-descriptions-for-top-local-rankings-in-2026/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://sink-or-swim-marketing.com/...</a></li>
              <li>[12] <cite>Safari Digital</cite>. "Ideal Meta Description Length [2026 Updated]." February 2026. <a href="https://www.safaridigital.com.au/blog/meta-description-length/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.safaridigital.com.au/...</a></li>
              <li>[14] <cite>Scalenut</cite>. "Meta Title Length Best Practices, 2026: What You Should Know." March 2026. <a href="https://www.scalenut.com/blogs/meta-title-length-best-practices-2026" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.scalenut.com/...</a></li>
              <li>[15] <cite>MRS Digital</cite>. "Meta Length Checker - SERP Preview Tool 2026." December 2025. <a href="https://mrs.digital/tools/meta-length-checker/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://mrs.digital/...</a></li>
              <li>[16] <cite>Perth Digital Edge</cite>. "Meta Title Length Checker | SERP Preview Tool 2026." March 2026. <a href="https://perthdigitaledge.com.au/tools/title-tag-and-meta-description-length-tool/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://perthdigitaledge.com.au/...</a></li>
              <li>[17] <cite>The SM Collective</cite>. "How To Write Click-Worthy Title Tags and Meta Descriptions for SEO in 2026." February 2026. <a href="https://thesmcollective.com/blog/seo-title-tags-meta-descriptions/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://thesmcollective.com/...</a></li>
              <li>[18] <cite>The SEO Engine</cite>. "Meta Description Länge: Best Practices & Limits 2026." March 2026. <a href="https://blog.theseoengine.com/meta-description-lange-what-actually-happens-when-you-get-the-length-wrong-and-the-exact-limits-that-work-in-2026" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://blog.theseoengine.com/...</a></li>
              <li>[19] <cite>Spotibo</cite>. "Meta Description Length Checker, 2024." March 2024. <a href="https://spotibo.com/meta-description-length/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://spotibo.com/...</a></li>
              <li>[20] <cite>Straight North</cite>. "How to Optimize Title Tags & Meta Descriptions in 2026." December 2025. <a href="https://www.straightnorth.com/blog/title-tags-and-meta-descriptions-how-to-write-and-optimize-them-in-2026/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.straightnorth.com/...</a></li>
              <li>[22] <cite>Conductor</cite>. "Meta description: the ultimate reference guide." March 2026. <a href="https://www.conductor.com/academy/meta-description/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.conductor.com/...</a></li>
            </ul>
          </section>

          {/* Related Tools */}
          <section className="mb-16 border-t border-neutral-200 dark:border-neutral-800 pt-16">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-8 text-center">Related Search & Content Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/seo/youtube-title-checker" className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 font-bold text-xs">YT</div>
                  <h3 className="font-bold text-neutral-900 dark:text-white group-hover:text-blue-600 transition-colors">YouTube Title Checker</h3>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Check title truncation and preview thumbnails for YouTube videos.</p>
              </Link>
              <Link href="/seo/hreflang-generator" className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 font-bold text-xs">GLOB</div>
                  <h3 className="font-bold text-neutral-900 dark:text-white group-hover:text-blue-600 transition-colors">Hreflang Generator</h3>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Generate and validate multi-language hreflang tags for global SEO.</p>
              </Link>
              <Link href="/text/word-frequency" className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-blue-600 font-bold text-xs">FREQ</div>
                  <h3 className="font-bold text-neutral-900 dark:text-white group-hover:text-blue-600 transition-colors">Word Frequency</h3>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Analyze keyword density and surface the most-used terms in your content.</p>
              </Link>
              <Link href="/seo/keyword-clustering" className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 font-bold text-xs">SEO</div>
                  <h3 className="font-bold text-neutral-900 dark:text-white group-hover:text-blue-600 transition-colors">Keyword Clustering Tool</h3>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Group keywords into topic clusters to build authority after optimizing your meta tags.</p>
              </Link>
            </div>
          </section>

          {/* Final CTA */}
          <section className="rounded-3xl bg-blue-600 p-8 sm:p-12 text-center text-white">
            <Eye className="h-10 w-10 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Stop Guessing. Start Measuring Pixels.</h2>
            <p className="text-blue-100 max-w-xl mx-auto mb-6">
              Scroll up to use the tool. Preview your title and description on real Google SERPs, measure exact pixel width, and publish metadata engineered for maximum click-through rate.
            </p>
            <a 
              href="#tool-section"
              className="inline-flex items-center gap-2 rounded-full bg-white text-blue-600 px-6 py-3 font-semibold hover:bg-blue-50 transition-colors"
            >
              Launch Tool
            </a>
          </section>

        </article>
      </main>
    </>
  )
}
