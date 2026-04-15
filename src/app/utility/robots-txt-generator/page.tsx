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
    question: "What is robots.txt used for?",
    answer:
      "A robots.txt file gives crawl instructions to bots at the domain root. It is commonly used to block low-value areas such as admin, account, checkout, search, or duplicate parameter paths and to point crawlers to the site's XML sitemap.",
  },
  {
    question: "Does robots.txt stop pages from appearing in Google?",
    answer:
      "Not reliably. Robots.txt controls crawling, not guaranteed indexing. A blocked URL can still appear in search if search engines discover it elsewhere. Use a crawlable page with a noindex directive when the goal is removal from search results.",
  },
  {
    question: "Where should robots.txt be placed?",
    answer:
      "It should live at the root of the domain, for example https://example.com/robots.txt. Putting the file in a subfolder does not work the same way.",
  },
  {
    question: "Should I block CSS and JavaScript in robots.txt?",
    answer:
      "Usually no. Blocking important CSS or JavaScript resources can interfere with rendering, technical SEO checks, and how search engines evaluate your pages.",
  },
  {
    question: "What are the most important robots.txt rules?",
    answer:
      "The core directives are User-agent, Disallow, Allow, and Sitemap. Some websites also use Crawl-delay for non-Google crawlers, but support varies by search engine.",
  },
  {
    question: "Can I block AI crawlers with robots.txt?",
    answer:
      "Yes. You can add user-agent specific blocks for bots such as GPTBot, CCBot, Google-Extended, anthropic-ai, or ClaudeBot. Whether every bot respects the file depends on the bot operator.",
  },
];

export const metadata: Metadata = {
  title: "Robots.txt Generator | Create, Explain, and Test Crawl Rules",
  description:
    "Generate a robots.txt file with presets, validation warnings, rule explanations, AI bot blocks, and URL testing. Build safer crawl rules for SEO and technical site management.",
  keywords: [
    "robots.txt generator",
    "create robots.txt file",
    "robots.txt example",
    "robots.txt for wordpress",
    "robots.txt SEO",
    "technical seo tool",
    "block ai bots robots.txt",
    "robots.txt tester",
    "allow disallow generator",
    "sitemap robots.txt",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Robots.txt Generator",
    description:
      "Generate, understand, and test robots.txt rules with presets, explanations, and validation warnings.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Robots.txt Generator",
    description:
      "Create a safer robots.txt file with technical SEO guidance and line-by-line explanations.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Robots.txt Generator",
    url: PAGE_URL,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Free robots.txt generator with presets, validation warnings, rule explanations, AI bot blocks, and a simple path tester.",
    featureList: [
      "Robots.txt presets for common site types",
      "Allow, disallow, sitemap, and crawl-delay controls",
      "Line-by-line explanations",
      "Validation warnings for risky setups",
      "AI bot block helper",
      "Simple URL path tester",
    ],
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

        <div className="max-w-4xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Technical SEO tool
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Robots.txt Generator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Generate a robots.txt file, understand what each rule does, and catch obvious crawl mistakes before they
            affect your site. This page is built for developers, SEO specialists, and site owners who need clarity,
            not just a code block.
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Important: robots.txt helps control crawling. It does not act as access control and it does not reliably
            remove URLs from search results by itself.
          </p>
        </div>
      </section>

      <RobotsTxtGenerator />

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">What is robots.txt?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            The robots.txt file is part of the robots exclusion protocol. It sits at the root of your domain and tells
            compliant crawlers which parts of your website they should or should not crawl. Search engines typically
            request this file before crawling the rest of the site.
          </p>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">How robots.txt works</h2>
          <ol className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>A crawler visits your domain and looks for `/robots.txt`.</li>
            <li>It reads the `User-agent` block that matches the bot.</li>
            <li>It applies `Allow` and `Disallow` rules to decide which paths to crawl.</li>
            <li>It may also use the `Sitemap` directive to find important URLs faster.</li>
          </ol>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">The most important directives</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li><strong className="text-foreground">User-agent:</strong> names the crawler a rule block applies to.</li>
            <li><strong className="text-foreground">Disallow:</strong> blocks matching paths from being crawled.</li>
            <li><strong className="text-foreground">Allow:</strong> opens specific paths even inside broader blocked areas.</li>
            <li><strong className="text-foreground">Sitemap:</strong> points crawlers to your XML sitemap.</li>
            <li><strong className="text-foreground">Crawl-delay:</strong> asks some crawlers to slow down, though support varies.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Robots.txt best practices</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Do not block the full site unless you are intentionally taking it out of crawl access.</li>
            <li>Do not rely on robots.txt to protect private data. Use authentication instead.</li>
            <li>Be careful about blocking CSS and JavaScript needed for rendering.</li>
            <li>Keep the file readable so teams can understand what it is doing later.</li>
            <li>Test important paths before uploading the file to production.</li>
          </ul>

          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">Examples of common robots.txt use cases</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-muted-foreground">
            <li>Block admin, account, cart, and checkout areas from routine crawling.</li>
            <li>Reduce crawl waste on internal search and filtered URLs.</li>
            <li>Point bots to your XML sitemap after launching a new site section.</li>
            <li>Add explicit user-agent blocks for AI crawlers when that matches your policy.</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6 border-t border-border/60 pt-8">
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
