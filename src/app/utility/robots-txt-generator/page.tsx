import Link from "next/link";
import type { Metadata } from "next";

import RobotsTxtGenerator from "@/app/utility/robots-txt-generator/components/RobotsTxtGenerator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/utility/robots-txt-generator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What does robots.txt do?",
    answer:
      "A robots.txt file gives crawling instructions to web robots (like Googlebot) at the domain root. It dictates which paths are allowed or disallowed for crawling and specifies where the site's XML sitemap is located.",
  },
  {
    question: "Does robots.txt block pages from the web?",
    answer:
      "No. It is a crawler directive, not an access-control mechanism. It politely asks legitimate bots not to crawl specific pages. However, malicious bots might ignore it, and if a disallowed page is linked from elsewhere, it can still be indexed. Sensitive content should be protected with a password or strict authentication.",
  },
  {
    question: "Where should robots.txt live?",
    answer:
      "Your robots.txt file MUST be served from the top-level directory (the root) of your domain, for example: https://example.com/robots.txt. Subdirectories like https://example.com/blog/robots.txt will be ignored by crawlers.",
  },
  {
    question: "Do I need a robots.txt file for my website?",
    answer:
      "While not strictly mandatory, it is highly recommended. Without it, search engines will attempt to crawl every page they find. A robots.txt file helps optimize your \"crawl budget\" by steering bots away from admin panels, internal search results, and duplicate content.",
  },
  {
    question: "What is the difference between robots.txt and meta noindex?",
    answer:
      "Robots.txt stops crawlers from browsing a page entirely, meaning it won't be crawled but might still be indexed if linked elsewhere. A 'noindex' meta tag allows the crawler to read the page but explicitly tells search engines not to show it in search results. Never use both on the same page, or the search engine won't see the noindex tag!",
  },
  {
    question: "Can I include multiple sitemaps in one robots.txt file?",
    answer:
      "Yes! You can list as many Sitemap directives as you need. This is especially common for large websites spanning millions of pages or e-commerce sites that segregate sitemaps by category, blog, or product type.",
  },
  {
    question: "What does Crawl-Delay mean?",
    answer:
      "Crawl-Delay tells bots how many seconds they should wait between consecutive requests to your server. This avoids server overloads. Note that Googlebot ignores Crawl-Delay (they prefer you adjust crawl limits in Google Search Console), but Bing, Yandex, and Baidu still respect it.",
  },
  {
    question: "Should I block CSS and JavaScript files in robots.txt?",
    answer:
      "No, you should explicitly avoid blocking CSS and JavaScript files. Modern search engines like Google render your web pages almost exactly like a visual browser. If they cannot access the CSS or JS files, they cannot “see” the page properly, which can severely harm your SEO rankings as they will consider the page poorly designed or mobile-unfriendly.",
  },
  {
    question: "Why is a page blocked in robots.txt still showing up in Google Search?",
    answer:
      "This happens because robots.txt prevents crawling, but not indexing. If another website links to your URL, Google learns that the page exists and may index it based purely on the anchor text of the incoming link, without ever crawling the page contents. To remove it from search, you must allow crawling, and add a 'noindex' meta tag.",
  }
];

export const metadata: Metadata = {
  title: "Robots.txt Generator | Build Allow, Disallow, and Sitemap Rules",
  description:
    "Generate a clean robots.txt file with user-agent, allow, disallow, crawl-delay, and sitemap fields to control search engine crawling efficiently.",
  keywords: ["robots txt generator", "robots.txt creator", "seo robots file generator", "allow disallow generator", "crawl delay"],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Robots.txt Generator | SEO Rule Builder",
    description: "Build a customized robots.txt file with crawler rules, user-agent directives, and sitemap references.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Robots.txt Generator",
    description: "Create a clean, functional robots.txt file for your site in seconds.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Robots.txt Generator",
    url: PAGE_URL,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free online robots.txt generator for crawler directives, User-Agents, and sitemap entries.",
  };
}

export default function RobotsTxtGeneratorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Utility", path: "/utility" },
    { name: "Robots.txt Generator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li><Link href="/utility" className="hover:text-primary">Utility</Link></li>
            <li>/</li>
            <li className="text-foreground">Robots.txt Generator</li>
          </ol>
        </nav>
        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">SEO Utility</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Robots.txt Generator</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Build a comprehensive robots.txt file for crawlers with allow, disallow, crawl-delay, and sitemap directives in one structured place. Prevent search bots from overloading your server or indexing admin pages.
          </p>
        </div>
      </section>

      <RobotsTxtGenerator />

      <section className="space-y-8 border-t border-border/60 pt-8 mt-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="tool-frame p-6">
            <h2 className="text-xl font-bold tracking-tight text-foreground">What is the Robots Exclusion Protocol?</h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              The Robots Exclusion Protocol (REP) is a fundamental, web-wide standard that regulates how web crawlers and automated bots traverse the World Wide Web. Before an ethical bot—like Googlebot, Bingbot, or DuckDuckBot—examines a single page of your website, it performs one crucial action: it requests your `robots.txt` file. 
            </p>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Think of `robots.txt` as a digital “No Trespassing” or “Public Access” sign at the front door of your website. By establishing these ground rules, webmasters can protect server resources, keep sensitive staging environments hidden, and guide search engines directly toward the most valuable content on the site via explicitly declared Sitemaps.
            </p>
          </div>
          
          <div className="tool-frame p-6">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Why Do You Need a Robots.txt File?</h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              <strong>Crawl Budget Optimization:</strong> Search engines do not have infinite processing power. For large websites, Google allocates a specific "crawl budget"—a calculated limit on how many server requests a bot makes to your website in a given timeframe. 
            </p>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              If your site has thousands of autogenerated internal search results, paginated archives, or duplicate tracking URLs, Googlebot might waste its entire budget crawling useless pages while completely missing your brand-new, high-value articles. A well-constructed `robots.txt` file systematically disallows access to these low-value directories, forcing the crawlers to spend their budget exclusively on your most critical, revenue-generating pages.
            </p>
          </div>
        </div>

        <div className="tool-frame p-6 mt-8 border-primary/10 bg-primary/[0.02]">
          <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">The Anatomy of a Perfect Robots.txt File</h2>
          <div className="space-y-6">
            
            <div>
              <h3 className="text-base font-semibold text-foreground">1. User-Agent</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                The `User-Agent` directive identifies the specific bot to which the following rules apply. Using the asterisk (`*`) is universally accepted as a wildcard that targets all web crawlers. If you need hyper-specific rules, you can create isolated blocks for different agents. For example, you could allow `Googlebot-Image` to crawl a photo directory while simultaneously locking out standard web crawlers.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-foreground">2. Allow and Disallow Rules</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                `Disallow` is the primary command used in robots.txt. It explicitly tells the specified user agent not to request a given URL path. The `Allow` directive is generally used to create deliberate exceptions within a blocked directory. A textbook example is blocking an entire `/admin/` folder, but utilizing an `Allow` directive to permit access to a publicly shareable file nested deep inside that folder.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-foreground">3. Crawl-Delay Directives</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                If your backend infrastructure is fragile or heavily trafficked, rapid-fire bot requests can cause debilitating server bottlenecks. The `Crawl-Delay` rule explicitly forces the bot to wait a designated number of seconds between server requests. While Google deprecates this specific rule in favor of their Search Console throttling tools, engines like Bing, Yandex, and Baidu largely still respect it.
              </p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-foreground">4. XML Sitemap Declaration</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                At the very end of your `robots.txt` document, you should formally declare the absolute URL of your XML sitemap (`Sitemap: https://yourdomain.com/sitemap.xml`). This allows automated agents exploring the web to immediately locate the structural mapping of your entire site without having to blindly crawl the site architecture to find links.
              </p>
            </div>

          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 mt-8">
          <div className="tool-frame p-6">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Common SEO Pitfalls to Avoid</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground list-disc pl-4">
              <li><strong>The Accidental Block out:</strong> Accidentally leaving `Disallow: /` in the file. This single slash blocks entire search engines from your website, effectively removing your business from search results entirely.</li>
              <li><strong>Blocking CSS and JavaScript:</strong> Never block scripts or style folders. Google's modern rendering engine needs to visually process your website. Blocking these resources stops mobile usability assessment and craters rankings.</li>
              <li><strong>Treating robots.txt as Security:</strong> Malicious scrapers, hackers, and aggressive scraping bots ignore robots.txt entirely. Never use it to hide sensitive data, banking portals, or private documents.</li>
            </ul>
          </div>
          
          <div className="tool-frame p-6">
            <h2 className="text-xl font-bold tracking-tight text-foreground">How To Test Your Robots.txt File</h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Generating your file is only the first step. After uploading the file to your root domain (e.g., `https://yourdomain.com/robots.txt`), you must validate it rigorously.
            </p>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Always use the <strong>Google Search Console Robots.txt Tester</strong>. This native tool highlights syntax warnings, confirms whether specific critical URLs are successfully blocked, and alerts you if Googlebot is encountering unexpected rendering traps. Continual monitoring prevents devastating traffic losses.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6 border-t border-border/60 pt-8 mt-12">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Frequently asked questions</h2>
        <div className="mt-6 space-y-4">
          {faq.map((item, index) => (
            <article key={item.question} className={`py-4 ${index === 0 ? "" : "border-t border-border/50"}`}>
              <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <RelatedToolsSection category="Utility" categoryHref="/utility" currentPath={PAGE_PATH} />
    </div>
  );
}
