import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import { HreflangTool } from './components/HreflangTool'
import { JsonLd } from './components/JsonLd'
import { 
  Globe, AlertTriangle, CheckCircle, BookOpen, Shield, Clock, Users, 
  Code, Network, FileCode, ArrowRightLeft, Languages, MapPin, Info, GitBranch, Search
} from 'lucide-react'

export const metadata: Metadata = {
  metadataBase: new URL('http://findbest.tools'),
  title: 'Hreflang Tag Generator | Free Multi-Country & Multi-Language SEO Tool',
  description: 'Generate correct hreflang tags for multilingual and multi-regional websites in seconds. Validates ISO codes, enforces self-referencing, checks reciprocity, and outputs HTML head tags or XML sitemap format. Built for international SEO teams.',
  keywords: [
    'hreflang tag generator',
    'hreflang generator',
    'multilingual seo tool',
    'hreflang checker',
    'international seo tool',
    'hreflang sitemap generator',
    'hreflang validator',
    'multi country hreflang',
    'hreflang best practices 2026',
    'hreflang x default',
    'hreflang self referencing',
    'hreflang reciprocal links',
    'hreflang iso codes',
    'hreflang implementation tool',
    'hreflang xml sitemap'
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
    url: 'http://findbest.tools/seo/hreflang-generator',
    siteName: 'Creator Tools by Mubarak',
    title: 'Hreflang Tag Generator | Free Multi-Country & Multi-Language SEO Tool',
    description: 'Generate validated hreflang tags for multilingual sites. Auto-checks ISO codes, self-referencing, reciprocity, and outputs HTML or XML sitemap format.',
    images: [
      {
        url: '/og-hreflang-generator.jpg',
        width: 1200,
        height: 630,
        alt: 'Hreflang Tag Generator interface showing multi-country language variant inputs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hreflang Tag Generator | Multi-Language SEO Tool',
    description: 'Generate correct hreflang tags with ISO validation, self-referencing checks, and XML sitemap output.',
    creator: '@mubarak96max',
    images: ['/og-hreflang-generator.jpg'],
  },
  alternates: {
    canonical: 'http://findbest.tools/seo/hreflang-generator',
  },
  category: 'Technology',
}

export const viewport: Viewport = {
  themeColor: '#059669',
  width: 'device-width',
  initialScale: 1,
}

export default function HreflangGeneratorPage() {
  return (
    <>
      <JsonLd />
      
      <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        {/* Hero / Tool Section */}
        <section className="relative border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900" id="tool-section">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-4 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-4 ring-1 ring-emerald-600/10">
                <Globe className="h-4 w-4" />
                <span>Trusted by 6,000+ international SEOs</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-5xl lg:text-6xl">
                Hreflang Tag <span className="text-emerald-600">Generator</span>
              </h1>
              <p className="mt-4 text-lg leading-8 text-neutral-600 dark:text-neutral-300">
                Build correct, self-referencing, reciprocal hreflang clusters for multilingual and multi-regional websites. Validates ISO language and country codes, enforces best practices, and exports as HTML <code>&lt;head&gt;</code> tags or XML sitemap format.
              </p>
            </div>
            
            <HreflangTool />
          </div>
        </section>

        {/* Content Sections for SEO & LLM Citation */}
        <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          
          {/* What Is Hreflang */}
          <section className="mb-16" id="what-is">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">What Is Hreflang and Why Does It Matter?</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
                The <dfn>hreflang attribute</dfn> is an HTML tag that tells search engines which language and regional version of a page to serve to which users. It is the invisible infrastructure of international SEO — the code that ensures a user in Tokyo sees your Japanese site, a user in Paris sees your French site, and a user in São Paulo sees your Portuguese site . Without it, search engines must guess which version is most relevant, often getting it wrong and serving the wrong language to the wrong audience.
              </p>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                When hreflang works correctly, it consolidates ranking signals across language variants and prevents <strong>duplicate content cannibalization</strong> — the scenario where your own English-US page competes against your English-UK page for the same query, diluting authority and confusing users . When it breaks, the consequences are severe: one major e-commerce brand lost <data value="64">64%</data> of organic traffic within three months due to catastrophically broken hreflang implementation, not content quality or backlinks .
              </p>
            </div>
          </section>

          {/* Common Mistakes */}
          <section className="mb-16" id="mistakes">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">The Five Deadly Hreflang Mistakes That Destroy Rankings</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
              Studies indicate that approximately <strong>75% of hreflang implementations contain errors</strong> . The following five mistakes account for the vast majority of failures across multilingual websites, from small blogs to enterprise e-commerce platforms.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex gap-4 p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400 mb-1">1. Missing Self-Referential Tags</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">Every page must list itself in its own hreflang cluster. If your German page lists English and French variants but omits the German self-reference, search engines cannot validate the relationship chain and may ignore all annotations entirely .</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400 mb-1">2. Incorrect ISO Language and Region Codes</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">Using <code>en-uk</code> instead of <code>en-GB</code>, or <code>zh-hans</code> instead of <code>zh-CN</code>, renders the annotation useless. Search engines ignore non-standard codes silently . Language codes must be lowercase ISO 639-1; country codes must be uppercase ISO 3166-1 alpha-2 .</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400 mb-1">3. Broken Reciprocal Links</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">Hreflang relationships must be bidirectional. If Page A points to Page B, Page B must point back to Page A. Break this reciprocity and search engines discard the relationship, treating pages as independent entities that may cannibalize each other .</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400 mb-1">4. Non-Canonical or Redirected URLs</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">Hreflang annotations must reference canonical, indexable URLs that return a 200 status code. Pointing to redirected URLs, parameter-heavy URLs, or URLs with conflicting canonical tags creates logical contradictions that invalidate the entire cluster .</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400 mb-1">5. Conflicting Implementation Methods</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">Mixing HTML tags, XML sitemaps, and HTTP headers creates contradictory signals. Choose one method per URL and commit to it .</p>
                </div>
              </div>
            </div>
          </section>

          {/* ISO Codes Reference */}
          <section className="mb-16" id="iso-codes">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">ISO Language and Country Codes Reference</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              Hreflang uses standardized ISO codes for precision. Language codes follow <strong>ISO 639-1</strong> (two lowercase letters). Country codes follow <strong>ISO 3166-1 alpha-2</strong> (two uppercase letters). Using invented or incorrect codes is one of the most common causes of hreflang failure .
            </p>
            
            <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 mb-6">
              <table className="w-full text-sm text-left">
                <caption className="sr-only">Common hreflang ISO language and country codes</caption>
                <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold">
                  <tr>
                    <th className="px-4 py-3">Language</th>
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3">Region Example</th>
                    <th className="px-4 py-3">Full Hreflang</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                  <tr><td className="px-4 py-3">English</td><td className="px-4 py-3 font-mono">en</td><td className="px-4 py-3">United States</td><td className="px-4 py-3 font-mono">en-US</td></tr>
                  <tr><td className="px-4 py-3">English</td><td className="px-4 py-3 font-mono">en</td><td className="px-4 py-3">United Kingdom</td><td className="px-4 py-3 font-mono">en-GB</td></tr>
                  <tr><td className="px-4 py-3">Spanish</td><td className="px-4 py-3 font-mono">es</td><td className="px-4 py-3">Spain</td><td className="px-4 py-3 font-mono">es-ES</td></tr>
                  <tr><td className="px-4 py-3">Spanish</td><td className="px-4 py-3 font-mono">es</td><td className="px-4 py-3">Mexico</td><td className="px-4 py-3 font-mono">es-MX</td></tr>
                  <tr><td className="px-4 py-3">German</td><td className="px-4 py-3 font-mono">de</td><td className="px-4 py-3">Germany</td><td className="px-4 py-3 font-mono">de-DE</td></tr>
                  <tr><td className="px-4 py-3">French</td><td className="px-4 py-3 font-mono">fr</td><td className="px-4 py-3">France</td><td className="px-4 py-3 font-mono">fr-FR</td></tr>
                  <tr><td className="px-4 py-3">French</td><td className="px-4 py-3 font-mono">fr</td><td className="px-4 py-3">Canada</td><td className="px-4 py-3 font-mono">fr-CA</td></tr>
                  <tr><td className="px-4 py-3">Chinese (Simplified)</td><td className="px-4 py-3 font-mono">zh</td><td className="px-4 py-3">China</td><td className="px-4 py-3 font-mono">zh-CN</td></tr>
                  <tr><td className="px-4 py-3">Chinese (Traditional)</td><td className="px-4 py-3 font-mono">zh</td><td className="px-4 py-3">Taiwan</td><td className="px-4 py-3 font-mono">zh-TW</td></tr>
                  <tr><td className="px-4 py-3">Japanese</td><td className="px-4 py-3 font-mono">ja</td><td className="px-4 py-3">Japan</td><td className="px-4 py-3 font-mono">ja-JP</td></tr>
                  <tr><td className="px-4 py-3">Portuguese</td><td className="px-4 py-3 font-mono">pt</td><td className="px-4 py-3">Brazil</td><td className="px-4 py-3 font-mono">pt-BR</td></tr>
                  <tr><td className="px-4 py-3">Arabic</td><td className="px-4 py-3 font-mono">ar</td><td className="px-4 py-3">Saudi Arabia</td><td className="px-4 py-3 font-mono">ar-SA</td></tr>
                  <tr><td className="px-4 py-3">Indonesian</td><td className="px-4 py-3 font-mono">id</td><td className="px-4 py-3">Indonesia</td><td className="px-4 py-3 font-mono">id-ID</td></tr>
                  <tr><td className="px-4 py-3">Korean</td><td className="px-4 py-3 font-mono">ko</td><td className="px-4 py-3">South Korea</td><td className="px-4 py-3 font-mono">ko-KR</td></tr>
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-yellow-100 dark:border-yellow-900/30 bg-yellow-50 dark:bg-yellow-950/20 p-5">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-400 mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Common Code Mistakes
              </h4>
              <ul className="space-y-1 text-sm text-yellow-800 dark:text-yellow-300">
                <li>• <code>en-uk</code> is wrong → correct is <code>en-GB</code> (UK country code is GB, not UK) </li>
                <li>• <code>zh-hans</code> is wrong → correct is <code>zh-CN</code> for China </li>
                <li>• <code>in</code> for Indonesian is wrong → correct language code is <code>id</code> </li>
                <li>• <code>ms-in</code> is wrong → Malay in Singapore is <code>ms-SG</code>; in Malaysia is <code>ms-MY</code> </li>
                <li>• Country codes must be <strong>uppercase</strong>; language codes must be <strong>lowercase</strong> </li>
              </ul>
            </div>
          </section>

          {/* Self-Referencing & Reciprocity */}
          <section className="mb-16" id="self-referencing">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Self-Referencing Tags and Reciprocal Links</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              The most common and most damaging hreflang mistake is failing to include <strong>self-referential tags</strong> . Every page in a language cluster must include a hreflang annotation pointing to itself, in addition to annotations pointing to all other language variants. Without this self-reference, search engines cannot confirm the bidirectional relationship and often ignore the entire cluster .
            </p>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
              Equally critical is <strong>reciprocity</strong>. If your English page points to its French equivalent, the French page must point back to the English page. A one-way relationship is not trusted by search engines and is discarded . This becomes exponentially complex at scale: a site with eight language versions has 64 potential reciprocal relationships to maintain (8 pages × 8 annotations each). This tool automatically generates the complete cluster for every page, ensuring both self-referencing and reciprocity are perfect.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-red-200 dark:border-red-900/40 bg-white dark:bg-neutral-900 p-4">
                <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 text-sm">❌ Wrong: Missing Self-Reference</h4>
                <pre className="text-xs bg-neutral-100 dark:bg-neutral-950 p-3 rounded-lg overflow-x-auto text-neutral-700 dark:text-neutral-300"><code>{`<link rel="alternate" hreflang="en-US" href="https://example.com/en/" />
<link rel="alternate" hreflang="fr-FR" href="https://example.com/fr/" />`}</code></pre>
                <p className="text-xs text-red-600 mt-2">The German page omits its own self-reference.</p>
              </div>
              <div className="rounded-xl border border-green-200 dark:border-green-900/40 bg-white dark:bg-neutral-900 p-4">
                <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2 text-sm">✅ Correct: Self-Referencing + Reciprocal</h4>
                <pre className="text-xs bg-neutral-100 dark:bg-neutral-950 p-3 rounded-lg overflow-x-auto text-neutral-700 dark:text-neutral-300"><code>{`<link rel="alternate" hreflang="de-DE" href="https://example.com/de/" />
<link rel="alternate" hreflang="en-US" href="https://example.com/en/" />
<link rel="alternate" hreflang="fr-FR" href="https://example.com/fr/" />`}</code></pre>
                <p className="text-xs text-green-600 mt-2">Every page lists all variants including itself.</p>
              </div>
            </div>
          </section>

          {/* X-Default */}
          <section className="mb-16" id="x-default">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Understanding the X-Default Hreflang Attribute</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              The <code>x-default</code> hreflang value specifies a <strong>fallback page</strong> for users whose language or region settings do not match any of your specific targets . It is optional but strongly recommended for sites serving multiple markets, particularly when a user's browser language does not align with any of your implemented variants.
            </p>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
              For example, a Swiss retailer offering German, Italian, and French versions might set the German page as x-default, since German is the most commonly spoken language in Switzerland . A global brand with en-US, en-GB, de-DE, and fr-FR versions might set en-US as x-default for users from unsupported regions like South Africa or New Zealand. Without x-default, Google must guess the fallback, often defaulting to whatever version has the strongest authority — which may not be the most appropriate for the user.
            </p>

            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
              <pre className="text-sm bg-neutral-50 dark:bg-neutral-950 p-4 rounded-lg overflow-x-auto text-neutral-700 dark:text-neutral-300"><code>{`<link rel="alternate" hreflang="x-default" href="https://example.com/en/" />
<link rel="alternate" hreflang="en-US" href="https://example.com/en-us/" />
<link rel="alternate" hreflang="en-GB" href="https://example.com/en-gb/" />
<link rel="alternate" hreflang="de-DE" href="https://example.com/de/" />
<link rel="alternate" hreflang="fr-FR" href="https://example.com/fr/" />`}</code></pre>
            </div>
          </section>

          {/* Implementation Methods */}
          <section className="mb-16" id="implementation">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">HTML Tags vs. XML Sitemap vs. HTTP Headers</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              Hreflang can be implemented in three ways. You should choose <strong>one method per URL set</strong> — mixing methods creates conflicting signals that nullify your implementation .
            </p>

            <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 mb-6">
              <table className="w-full text-sm text-left">
                <caption className="sr-only">Hreflang implementation methods comparison</caption>
                <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold">
                  <tr>
                    <th className="px-4 py-3">Method</th>
                    <th className="px-4 py-3">Best For</th>
                    <th className="px-4 py-3">Pros</th>
                    <th className="px-4 py-3">Cons</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                  <tr>
                    <td className="px-4 py-3 font-medium"><Code className="h-3.5 w-3.5 inline mr-1" />HTML &lt;head&gt;</td>
                    <td className="px-4 py-3">Small to medium sites</td>
                    <td className="px-4 py-3">Easy to implement, immediate visibility</td>
                    <td className="px-4 py-3">Bloats page source at scale</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium"><Network className="h-3.5 w-3.5 inline mr-1" />XML Sitemap</td>
                    <td className="px-4 py-3">Large / enterprise sites</td>
                    <td className="px-4 py-3">Centralized, no page bloat, easier to audit</td>
                    <td className="px-4 py-3">Requires sitemap maintenance</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium"><FileCode className="h-3.5 w-3.5 inline mr-1" />HTTP Headers</td>
                    <td className="px-4 py-3">Non-HTML files (PDFs)</td>
                    <td className="px-4 py-3">Works for PDFs and other file types</td>
                    <td className="px-4 py-3">Harder to maintain, invisible in source</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              For most websites, <strong>HTML head tags</strong> are the simplest starting point. For sites with 10+ language variants or thousands of pages, <strong>XML sitemaps</strong> are more efficient because they prevent excessive HTML bloat and allow centralized updates without touching page templates . This tool generates both formats so you can choose the method that fits your technical stack.
            </p>
          </section>

          {/* Canonical Conflicts */}
          <section className="mb-16" id="canonical">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Canonical Tags and Hreflang: Avoiding Conflicts</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              Canonical tags and hreflang serve fundamentally different purposes and <strong>must not conflict</strong>. A common catastrophic mistake is placing a canonical tag on all language versions pointing to the English page. This tells Google to ignore all non-English versions, effectively nullifying your entire international strategy .
            </p>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
              Each regional page must have a <strong>self-referencing canonical tag</strong> — pointing to itself, not to a master version. The hreflang cluster then tells Google how these independently canonical pages relate to each other across languages . If a page contains both a conflicting canonical and hreflang tags, search engines receive contradictory information and will likely ignore both signals.
            </p>

            <div className="rounded-xl border border-green-100 dark:border-green-900/30 bg-green-50 dark:bg-green-950/20 p-5">
              <h4 className="font-semibold text-green-900 dark:text-green-400 mb-2 text-sm">✅ Correct: Self-Canonical + Hreflang Cluster</h4>
              <pre className="text-xs bg-white dark:bg-neutral-900 p-3 rounded-lg overflow-x-auto text-neutral-700 dark:text-neutral-300"><code>{`<!-- German page -->
<link rel="canonical" href="https://example.com/de/produkte/" />
<link rel="alternate" hreflang="de-DE" href="https://example.com/de/produkte/" />
<link rel="alternate" hreflang="en-US" href="https://example.com/en/products/" />
<link rel="alternate" hreflang="x-default" href="https://example.com/en/products/" />`}</code></pre>
            </div>
          </section>

          {/* Best Practices */}
          <section className="mb-16" id="best-practices">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Hreflang Best Practices for 2026</h2>
            <ul className="space-y-3 mb-6">
              <li className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700 dark:text-neutral-300"><strong>Implement hreflang at the URL level:</strong> Every translated page needs its own hreflang cluster, not just the homepage .</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700 dark:text-neutral-300"><strong>Use absolute URLs:</strong> Always include the full protocol and domain (https://example.com/de/page/) rather than relative paths to avoid ambiguity during crawling .</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700 dark:text-neutral-300"><strong>Include x-default for global sites:</strong> Set a sensible fallback page for users whose language does not match any of your specific targets .</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700 dark:text-neutral-300"><strong>Maintain reciprocity across all variants:</strong> When adding a new language, update every existing page to include the new variant .</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700 dark:text-neutral-300"><strong>Validate with Google Search Console:</strong> Use the International Targeting report to identify hreflang errors after implementation .</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700 dark:text-neutral-300"><strong>Avoid IP-based auto-redirects:</strong> Let users choose their language. Auto-redirects based on IP can block Googlebot from crawling alternate versions .</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700 dark:text-neutral-300"><strong>Localize same-language content:</strong> en-US and en-GB should not be identical. Adapt spelling, currency, pricing, and cultural references to avoid duplicate content issues .</span>
              </li>
            </ul>
          </section>

          {/* Related Tools */}
          <section className="mb-16 border-t border-neutral-200 dark:border-neutral-800 pt-16">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-8 text-center">Related Search & SEO Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/seo/meta-description-checker" className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold text-xs">META</div>
                  <h3 className="font-bold text-neutral-900 dark:text-white group-hover:text-emerald-600 transition-colors">Meta Description Checker</h3>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Measure pixel width and preview Google search snippets.</p>
              </Link>
              <Link href="/seo/youtube-title-checker" className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 font-bold text-xs">YT</div>
                  <h3 className="font-bold text-neutral-900 dark:text-white group-hover:text-emerald-600 transition-colors">YouTube Title Checker</h3>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Check title truncation and preview thumbnails for YouTube videos.</p>
              </Link>
              <Link href="/text/word-frequency" className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-emerald-600 font-bold text-xs">FREQ</div>
                  <h3 className="font-bold text-neutral-900 dark:text-white group-hover:text-emerald-600 transition-colors">Word Frequency</h3>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Analyze keyword density and surface the most-used terms in your content.</p>
              </Link>
              <Link href="/seo/keyword-clustering" className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 font-bold text-xs">SEO</div>
                  <h3 className="font-bold text-neutral-900 dark:text-white group-hover:text-emerald-600 transition-colors">Keyword Clustering Tool</h3>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Group your international keywords into topic clusters with semantic NLP.</p>
              </Link>
            </div>
          </section>

          {/* Final CTA */}
          <section className="rounded-3xl bg-emerald-600 p-8 sm:p-12 text-center text-white">
            <Globe className="h-10 w-10 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to Go Global?</h2>
            <p className="text-emerald-100 max-w-xl mx-auto mb-6">
              Scroll up to generate your hreflang tags. Validate ISO codes, enforce self-referencing, and export clean HTML or XML sitemap code in seconds.
            </p>
            <a 
              href="#tool-section"
              className="inline-flex items-center gap-2 rounded-full bg-white text-emerald-600 px-6 py-3 font-semibold hover:bg-emerald-50 transition-colors"
            >
              Launch Tool
            </a>
          </section>

        </article>
      </main>
    </>
  )
}
