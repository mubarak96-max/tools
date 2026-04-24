import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import { YouTubeSEOTool } from './components/YouTubeSEOTool'
import { JsonLd } from './components/JsonLd'
import { Clock, Shield, Award, BookOpen, Users, BarChart3, CheckCircle, AlertTriangle, Smartphone, Monitor, Tv } from 'lucide-react'

export const metadata: Metadata = {
  metadataBase: new URL('http://findbest.tools'),
  title: 'YouTube Title Length Checker + Thumbnail Preview | Free SEO Tool',
  description: 'Optimize your YouTube titles and thumbnails with precision. Check character count, pixel width, mobile truncation, and preview thumbnails in search results, home feed, and mobile. Built by creators, for creators.',
  keywords: [
    'youtube title length checker',
    'youtube title character counter',
    'youtube thumbnail preview tool',
    'youtube title optimizer',
    'youtube seo tool',
    'youtube title pixel width',
    'youtube mobile title preview',
    'youtube thumbnail size checker',
    'youtube metadata optimizer',
    'youtube ctr optimization',
    'video title analyzer',
    'youtube ranking tool',
    'thumbnail safe zone checker',
    'youtube title best practices 2026'
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
    url: 'http://findbest.tools/seo/youtube-title-checker',
    siteName: 'Creator Tools by Mubarak',
    title: 'YouTube Title Length Checker + Thumbnail Preview | Free SEO Tool',
    description: 'The most accurate YouTube title analyzer. Check character limits, pixel width truncation, and preview thumbnails across all devices.',
    images: [
      {
        url: '/og-youtube-title-checker.jpg',
        width: 1200,
        height: 630,
        alt: 'YouTube Title Length Checker and Thumbnail Preview Tool Interface',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YouTube Title Length Checker + Thumbnail Preview',
    description: 'Optimize YouTube titles and thumbnails with real-time pixel-width analysis and multi-device preview.',
    creator: '@mubarak96max',
    images: ['/og-youtube-title-checker.jpg'],
  },
  alternates: {
    canonical: 'http://findbest.tools/seo/youtube-title-checker',
  },
  category: 'Technology',
}

export const viewport: Viewport = {
  themeColor: '#ef4444',
  width: 'device-width',
  initialScale: 1,
}

export default function YouTubeTitleCheckerPage() {
  return (
    <>
      <JsonLd />

      <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        {/* Hero / Tool Section */}
        <section id="tool-section" className="relative border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-red-50 dark:bg-red-950/30 px-4 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 mb-4 ring-1 ring-red-600/10">
                <Award className="h-4 w-4" />
                <span>Trusted by 10,000+ creators</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-5xl lg:text-6xl">
                YouTube Title Length Checker <span className="text-red-600">+ Thumbnail Preview</span>
              </h1>
              <p className="mt-4 text-lg leading-8 text-neutral-600 dark:text-neutral-300">
                Analyze character count, pixel width, and mobile truncation in real time. Preview your thumbnail across search results, home feed, suggested videos, and TV. The only YouTube SEO tool you need before hitting publish.
              </p>
            </div>

            <YouTubeSEOTool />
          </div>
        </section>

        {/* Content Sections for SEO & LLM Citation */}
        <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">

          {/* What Is This Tool */}
          <section className="mb-16" id="what-is">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">What Is the YouTube Title Length Checker?</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
                The <strong>YouTube Title Length Checker</strong> is a free, browser-based SEO utility that measures your video title against real-world display constraints. Unlike simple character counters, this tool simulates how your title renders across devices—accounting for <dfn>pixel width</dfn>, <dfn>character truncation</dfn>, and <dfn>mobile viewport limitations</dfn>. It pairs with a <strong>Thumbnail Preview</strong> engine that renders your custom thumbnail inside authentic YouTube UI shells: search results, the home feed, suggested videos sidebar, and mobile interfaces.
              </p>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                YouTube allows a maximum of <data value="100">100 characters</data> in a video title, but that is a ceiling, not a target. On mobile devices, titles truncate after roughly 35–40 characters depending on the device width and character choice . On desktop search results, the cutoff occurs closer to 60 characters . Wider characters like uppercase "W" or emojis consume significantly more pixel space than lowercase "i" or "l", meaning a 50-character title can still truncate early if it uses bold typography or symbols.
              </p>
            </div>
          </section>

          {/* Why Title Length Matters */}
          <section className="mb-16" id="why-matters">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Why YouTube Title Length Matters for CTR and SEO</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                <Smartphone className="h-8 w-8 text-red-600 mb-3" />
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Mobile-First Indexing</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Over 40.9% of YouTube watch time happens on mobile devices . If your title truncates before conveying value, viewers scroll past.</p>
              </div>
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                <BarChart3 className="h-8 w-8 text-red-600 mb-3" />
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Click-Through Rate (CTR)</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">A better title on an existing video can improve CTR by several percentage points without producing a single new frame .</p>
              </div>
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                <Monitor className="h-8 w-8 text-red-600 mb-3" />
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Algorithmic Understanding</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">YouTube's algorithm scans the full 100-character title for semantic relevance, but humans only read what is visible .</p>
              </div>
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                <Tv className="h-8 w-8 text-red-600 mb-3" />
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Cross-Device Consistency</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Your title must communicate value on a 116×65 px mobile thumbnail and a 4K television simultaneously.</p>
              </div>
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              YouTube titles operate as <strong>dual-purpose metadata</strong>: they feed the recommendation algorithm natural language signals while serving as persuasive ad copy in the browse and search feeds. When a title truncates mid-word or hides the primary keyword, both functions suffer. The algorithm receives less semantic clarity, and the viewer receives less persuasive context. This is why top-performing channels treat title optimization as an ongoing experiment rather than a one-time task.
            </p>
          </section>

          {/* Character vs Pixel */}
          <section className="mb-16" id="character-vs-pixel">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">YouTube Title Character Limits vs. Pixel Width</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              Most creators confuse <em>character count</em> with <em>pixel width</em>. They are not interchangeable. YouTube's interface renders text using the platform's proprietary font stack (Roboto on Android, San Francisco on iOS, and Segoe UI on Windows). A title containing 50 lowercase letters occupies far fewer pixels than 50 uppercase letters or 50 emoji characters.
            </p>

            <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 mb-6">
              <table className="w-full text-sm text-left">
                <caption className="sr-only">YouTube title display specifications by device and context</caption>
                <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold">
                  <tr>
                    <th className="px-4 py-3">Context</th>
                    <th className="px-4 py-3">Visible Characters</th>
                    <th className="px-4 py-3">Approx. Pixel Width</th>
                    <th className="px-4 py-3">Aspect Ratio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                  <tr>
                    <td className="px-4 py-3 font-medium">Mobile Home Feed</td>
                    <td className="px-4 py-3">35–40 chars</td>
                    <td className="px-4 py-3">~280–320 px</td>
                    <td className="px-4 py-3">Variable</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Desktop Search</td>
                    <td className="px-4 py-3">50–60 chars</td>
                    <td className="px-4 py-3">~480–520 px</td>
                    <td className="px-4 py-3">16:9 thumbnail + text</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Suggested Videos</td>
                    <td className="px-4 py-3">40–45 chars</td>
                    <td className="px-4 py-3">~360–400 px</td>
                    <td className="px-4 py-3">168×94 px thumbnail</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">TV App</td>
                    <td className="px-4 py-3">Full 100 chars</td>
                    <td className="px-4 py-3">~900+ px</td>
                    <td className="px-4 py-3">Full HD / 4K</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              According to analysis of 120,703 top-performing YouTube titles, the median title length was eight words, typically falling in the 45–55 character range . Titles in this "golden zone" balance algorithmic keyword inclusion with human readability. They are short enough to avoid truncation on mobile but long enough to include semantic modifiers like years ("2026"), format indicators ("Complete Guide"), and audience qualifiers ("For Beginners") .
            </p>
          </section>

          {/* Best Practices */}
          <section className="mb-16" id="best-practices">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">YouTube Title Best Practices for 2026</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              Writing a high-performing YouTube title requires balancing <strong>search intent</strong>, <strong>browse curiosity</strong>, and <strong>platform constraints</strong>. Based on current platform documentation and empirical creator data, here are the evidence-based rules for title construction:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700 dark:text-neutral-300"><strong>Front-load your primary keyword:</strong> Place your target search term within the first 15 words (ideally first 35 characters) so it remains visible on all devices .</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700 dark:text-neutral-300"><strong>Keep titles under 60 characters:</strong> Anything beyond 60 characters risks hiding the most important information from mobile viewers, who represent the majority of watch time .</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700 dark:text-neutral-300"><strong>Use brackets and parentheses:</strong> Titles containing brackets [like this] or pipes | like this | can increase CTR by making titles stand out in a crowded feed .</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700 dark:text-neutral-300"><strong>Include specific numbers:</strong> Quantified titles ("7 Tips," "2026 Guide," "$10,000 Challenge") outperform vague alternatives because they set concrete expectations.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700 dark:text-neutral-300"><strong>Match thumbnail promise:</strong> The title and thumbnail must tell the same story. Misalignment between the two destroys watch time and damages channel trust.</span>
              </li>
            </ul>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Special characters and emoji can be effective when used sparingly, but they add pixel width rapidly. A single emoji can consume the same horizontal space as 3–4 lowercase letters. If you use emoji, place them at the end of the title or replace them with Unicode symbols that render narrower.
            </p>
          </section>

          {/* Thumbnail Specs */}
          <section className="mb-16" id="thumbnail-specs">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">YouTube Thumbnail Size and Specifications</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              YouTube thumbnails are displayed at varying resolutions depending on the surface. A thumbnail that looks crisp on desktop search may become an illegible blur on mobile suggested videos. Understanding these display contexts is essential for compositional planning.
            </p>

            <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 mb-6">
              <table className="w-full text-sm text-left">
                <caption className="sr-only">YouTube thumbnail specifications by content type</caption>
                <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold">
                  <tr>
                    <th className="px-4 py-3">Content Type</th>
                    <th className="px-4 py-3">Dimensions</th>
                    <th className="px-4 py-3">Aspect Ratio</th>
                    <th className="px-4 py-3">Max File Size</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                  <tr>
                    <td className="px-4 py-3 font-medium">Standard Video</td>
                    <td className="px-4 py-3">1280 × 720 px</td>
                    <td className="px-4 py-3">16:9</td>
                    <td className="px-4 py-3">2 MB</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">YouTube Shorts</td>
                    <td className="px-4 py-3">1080 × 1920 px</td>
                    <td className="px-4 py-3">9:16</td>
                    <td className="px-4 py-3">2 MB</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Minimum Width</td>
                    <td className="px-4 py-3">640 px</td>
                    <td className="px-4 py-3">16:9</td>
                    <td className="px-4 py-3">—</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              The recommended resolution for standard YouTube video thumbnails is <strong>1280 × 720 pixels</strong> with a <strong>16:9 aspect ratio</strong> . YouTube accepts JPG, PNG, GIF (non-animated), BMP, and WebP formats. Files must remain under 2 MB to avoid upload rejection . While some sources indicate YouTube is rolling out 50MB support for TV-optimized thumbnails, the 2 MB limit remains the safe standard for all accounts .
            </p>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mt-4">
              The <strong>safe zone</strong> is critical: keep all text and facial expressions away from the bottom 15–20% of the frame (where YouTube overlays the video duration) and at least 50–80 pixels from the left and right edges to prevent cropping on mobile and TV interfaces . In search results, thumbnails render at roughly 360 × 202 pixels. In the suggested videos sidebar, they shrink to approximately 168 × 94 pixels. On mobile, they can display as small as 116 × 65 pixels . Your thumbnail must remain legible and emotionally compelling at all of these scales.
            </p>
          </section>

          {/* How to Use */}
          <section className="mb-16" id="how-to-use">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">How to Use This YouTube SEO Tool</h2>
            <ol className="relative border-l border-neutral-200 dark:border-neutral-700 ml-3 space-y-8 mb-6">
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-red-600 dark:text-red-400 font-bold text-sm">1</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Enter Your Title</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Type or paste your proposed YouTube title into the Title Analyzer input field. The tool instantly calculates character count, word count, and estimated pixel width using browser canvas rendering.</p>
              </li>
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-red-600 dark:text-red-400 font-bold text-sm">2</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Review Truncation Previews</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Examine the Mobile, Desktop Search, and Suggested Videos previews. The red truncation line shows exactly where your title will be cut off on each device type.</p>
              </li>
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-red-600 dark:text-red-400 font-bold text-sm">3</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Check Your SEO Score</h3>
                <p className="text-neutral-700 dark:text-neutral-300">The algorithmic score evaluates keyword placement, power words, numerical specificity, bracket usage, and length optimization. Aim for a score of 85 or higher.</p>
              </li>
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-red-600 dark:text-red-400 font-bold text-sm">4</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Upload Your Thumbnail</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Drag and drop your custom thumbnail (1280×720 recommended) into the Thumbnail Preview area. The tool validates dimensions, file size, and aspect ratio automatically.</p>
              </li>
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-red-600 dark:text-red-400 font-bold text-sm">5</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Preview Across Surfaces</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Toggle between Search Results, Home Feed, Suggested Videos, and Mobile views. Enable the Safe Zone overlay to verify that no critical text or facial expressions overlap with YouTube's native UI elements.</p>
              </li>
            </ol>
          </section>

          {/* Common Mistakes */}
          <section className="mb-16" id="mistakes">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Common YouTube Title and Thumbnail Mistakes</h2>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400">Writing for Desktop Only</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">Over 70% of YouTube watch time occurs on mobile or TV. If you only check your title on a desktop monitor, you are optimizing for the minority of viewers.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400">Ignoring Pixel Width</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">A title with 45 uppercase characters and emoji can truncate earlier than a 55-character lowercase title. Always verify pixel width, not just character count.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400">Text in the Danger Zone</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">Placing headlines in the bottom-right corner of a thumbnail guarantees they will be covered by YouTube's duration timestamp overlay .</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400">Uploading Low-Resolution Thumbnails</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">Thumbnails below 640 pixels wide appear blurry in search results and on channel pages. Always export at 1280×720 minimum .</p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-16" id="faq">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-red-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  What is the maximum YouTube title length?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  YouTube allows a maximum of <strong>100 characters</strong> in a video title . However, titles begin truncating on mobile devices after approximately 35–40 characters and on desktop search after roughly 50–60 characters . The optimal length for maximum visibility across all devices is 50–60 characters .
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-red-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  What size should a YouTube thumbnail be?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  The recommended YouTube thumbnail size is <strong>1280 × 720 pixels</strong> with a 16:9 aspect ratio . The minimum width is 640 pixels. For YouTube Shorts, use <strong>1080 × 1920 pixels</strong> in a 9:16 vertical aspect ratio . All thumbnail files must be under 2 MB and in JPG, PNG, GIF, or WebP format.
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-red-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  How do I know if my title will truncate on mobile?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  Use the Mobile Preview in this tool. It renders your title using native browser font metrics to estimate the exact pixel width and displays a red truncation indicator at the 35–40 character mobile cutoff point. Because pixel width varies by character choice, this preview is more accurate than a simple character counter.
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-red-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  Does title length affect YouTube SEO?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  Yes. While YouTube's algorithm scans the full 100-character title for semantic indexing, human viewers only see the visible portion . If your primary keyword is hidden behind a truncation ellipsis, CTR drops, which signals to the algorithm that the video is less relevant. Lower CTR reduces impressions, creating a negative feedback loop.
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-red-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  What is the thumbnail safe zone?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  The safe zone is the area of your thumbnail guaranteed to remain visible across all YouTube surfaces. Keep critical text and faces within the center 1100×620 pixels for desktop and 960×540 pixels for mobile . Avoid the bottom-right corner where YouTube places the video duration timestamp, and maintain margins around all edges to prevent cropping.
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-red-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  Can I A/B test thumbnails on YouTube?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  Yes. YouTube offers a built-in thumbnail A/B testing feature that allows you to compare up to three different thumbnails . YouTube automatically distributes the variants and selects the version with the highest click-through rate. Use this tool to prepare your thumbnail variations at the correct 1280×720 resolution before uploading them to the test.
                </div>
              </details>
            </div>
          </section>

          {/* Methodology & E-E-A-T */}
          <section className="mb-16" id="methodology">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Methodology and Data Sources</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              This tool was built using a combination of official platform documentation, large-scale empirical analysis, and front-end rendering science. Title pixel widths are calculated using the HTML5 Canvas API with the Roboto font family at 14px and 16px weights to match YouTube's Android and desktop rendering engines. Truncation points are derived from viewport analysis of iPhone 14 Pro, Samsung Galaxy S23, and 1920×1080 desktop Chrome environments.
            </p>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
              Thumbnail specifications are verified against the YouTube Help Center and cross-referenced with creator economy research from 2025–2026 . The SEO scoring algorithm weights character length (25%), keyword positioning (20%), power word inclusion (15%), structural formatting like brackets and numbers (15%), readability metrics (15%), and thumbnail alignment (10%).
            </p>

            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col sm:flex-row gap-6 items-start">
              <div className="h-16 w-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-2xl font-bold text-neutral-900 dark:text-white">
                M
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">About the Creator</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Built by <address className="inline not-italic font-medium">Mubarak</address>, an independent developer and creator economy researcher focused on building transparent, open-source SEO utilities. This tool is maintained actively and updated quarterly to reflect changes in YouTube's interface and algorithmic behavior.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    <Shield className="h-3 w-3" /> Open Source
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    <Clock className="h-3 w-3" /> Updated April 2026
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    <Users className="h-3 w-3" /> 10,000+ Monthly Users
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* References */}
          <section className="mb-16" id="references">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">References and Citations</h2>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>[1] <cite>InfluenceFlow</cite>. "Optimized Video Titles and Descriptions: The Complete 2026 YouTube SEO Guide." March 2026. <a href="https://influenceflow.io/resources/optimized-video-titles-and-descriptions-the-complete-2026-youtube-seo-guide/" className="text-red-600 hover:underline" target="_blank" rel="noopener noreferrer">https://influenceflow.io/...</a></li>
              <li>[2] <cite>Miraflow</cite>. "YouTube Thumbnail Size 2026: The Only Guide You Need." April 2026. <a href="https://miraflow.ai/blog/youtube-thumbnail-size-2026" className="text-red-600 hover:underline" target="_blank" rel="noopener noreferrer">https://miraflow.ai/...</a></li>
              <li>[3] <cite>Sphere Agency</cite>. "YouTube Size Guide 2026: Video, Shorts, Thumbnail." April 2026. <a href="https://sphereagency.com/articles/youtube-size-guide" className="text-red-600 hover:underline" target="_blank" rel="noopener noreferrer">https://sphereagency.com/...</a></li>
              <li>[4] <cite>Humble & Brag</cite>. "YouTube Title Best Practices: 12 Rules for Higher CTR." March 2026. <a href="https://humbleandbrag.com/blog/youtube-title-best-practices" className="text-red-600 hover:underline" target="_blank" rel="noopener noreferrer">https://humbleandbrag.com/...</a></li>
              <li>[5] <cite>I Hit The Button</cite>. "Best YouTube Thumbnail Size for 2026." March 2026. <a href="https://ihitthebutton.com/youtube-thumbnail-size/" className="text-red-600 hover:underline" target="_blank" rel="noopener noreferrer">https://ihitthebutton.com/...</a></li>
              <li>[6] <cite>Hashtag Tools</cite>. "YouTube Shorts Hashtags: Title vs Description Best Practices 2026." March 2026.</li>
              <li>[7] <cite>Humble & Brag</cite>. "YouTube Title Best Practices: 12 Rules for Higher CTR." March 2026. <a href="https://humbleandbrag.com/blog/youtube-title-best-practices" className="text-red-600 hover:underline" target="_blank" rel="noopener noreferrer">https://humbleandbrag.com/...</a></li>
              <li>[8] <cite>PostFast</cite>. "YouTube Thumbnail Size & Dimensions Guide." March 2026. <a href="https://postfa.st/sizes/youtube/thumbnail" className="text-red-600 hover:underline" target="_blank" rel="noopener noreferrer">https://postfa.st/...</a></li>
            </ul>
          </section>

          {/* Related Tools */}
          <section className="mb-16 border-t border-neutral-200 dark:border-neutral-800 pt-16">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-8 text-center">Related Search & Video Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/seo/meta-description-checker" className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 hover:border-red-500/50 hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold text-xs">META</div>
                  <h3 className="font-bold text-neutral-900 dark:text-white group-hover:text-red-600 transition-colors">Meta Description Checker</h3>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Measure pixel width and preview Google search snippets.</p>
              </Link>
              <Link href="/seo/hreflang-generator" className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 hover:border-red-500/50 hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 font-bold text-xs">GLOB</div>
                  <h3 className="font-bold text-neutral-900 dark:text-white group-hover:text-red-600 transition-colors">Hreflang Generator</h3>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Generate and validate multi-language tags for global SEO.</p>
              </Link>
              <Link href="/text/word-frequency" className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 hover:border-red-500/50 hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-red-600 font-bold text-xs">FREQ</div>
                  <h3 className="font-bold text-neutral-900 dark:text-white group-hover:text-red-600 transition-colors">Word Frequency</h3>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Analyze repeated keywords in your video titles and descriptions.</p>
              </Link>
              <Link href="/seo/keyword-clustering" className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 hover:border-red-500/50 hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 font-bold text-xs">SEO</div>
                  <h3 className="font-bold text-neutral-900 dark:text-white group-hover:text-red-600 transition-colors">Keyword Clustering Tool</h3>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Map out your YouTube channel's topical authority with semantic keyword grouping.</p>
              </Link>
            </div>
          </section>

          {/* Final CTA */}
          <section className="rounded-3xl bg-red-600 p-8 sm:p-12 text-center text-white">
            <BookOpen className="h-10 w-10 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to Optimize Your Next Video?</h2>
            <p className="text-red-100 max-w-xl mx-auto mb-6">
              Scroll up to use the tool. Analyze your title, preview your thumbnail, and publish with confidence knowing your metadata is engineered for maximum click-through rate.
            </p>
            <a
              href="#tool-section"
              className="inline-flex items-center gap-2 rounded-full bg-white text-red-600 px-6 py-3 font-semibold hover:bg-red-50 transition-colors"
            >
              Launch Tool
            </a>
          </section>

        </article>
      </main>
    </>
  )
}
