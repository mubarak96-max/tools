import Link from "next/link";
import type { Metadata } from "next";

import MetaTagsGenerator from "@/app/utility/meta-tags-generator/components/MetaTagsGenerator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/utility/meta-tags-generator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What are Meta Tags?",
    answer:
      "Meta tags are invisible snippets of HTML code that describe a web page's content. They don't appear on the page itself, but are embedded in the page's code to tell search engines (like Google) and social networks (like Twitter and Facebook) what the page is about.",
  },
  {
    question: "What is Open Graph (OG)?",
    answer:
      "Open Graph is a protocol originally created by Facebook that standardizes how website links appear when shared on social media. Without Open Graph tags, a shared link usually just looks like plain text. With them, it becomes a rich, clickable card with an image, bold title, and description.",
  },
  {
    question: "How long should a meta description be?",
    answer:
      "Google typically truncates meta descriptions after 155–160 characters. Our tool includes Character Counters to ensure your descriptions and titles fit perfectly inside the search result window without getting cut off with an ellipsis (...).",
  },
  {
    question: "Where do I paste this HTML code?",
    answer:
      "Once you copy the generated code, you must paste it directly inside the <head> section of your website's HTML document. If you are using a CMS like WordPress, it is easier to use an SEO plugin to manage these tags rather than hardcoding them.",
  },
];

export const metadata: Metadata = {
  title: "Meta Tags Generator | Open Graph & SEO Code Maker",
  description:
    "Free online Meta Tags and Open Graph tool. Generate proper SEO titles, descriptions, and Twitter Card tags while previewing exactly how they will look.",
  keywords: [
    "meta tags generator",
    "open graph generator",
    "seo tags maker",
    "twitter card generator",
    "meta description preview",
    "html head tags",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Meta Tags Generator",
    description:
      "Visually construct, preview, and generate your website's Meta Tags and Open Graph data.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meta Tags Generator",
    description:
      "Preview what your website will look like on Google and Twitter, then copy the SEO HTML code.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Meta Tags Generator",
    url: PAGE_URL,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "A developer utility to visually construct, preview, and export standard HTML Meta Tags and social media Open Graph definitions.",
    featureList: [
      "Live Google Search results preview",
      "Live Twitter & Open Graph card preview",
      "Character length warnings",
      "Instant copyable HTML output",
    ],
  };
}

export default function MetaTagsGeneratorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Utility", path: "/utility" },
    { name: "Meta Tags Generator", path: PAGE_PATH },
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
            <li className="text-foreground">Meta Tags Generator</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            SEO Utility
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Meta Tags Generator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Create exact SEO meta tags and social media Open Graph cards for your website. Preview exactly how your link will look when shared on Google, Facebook, and Twitter.
          </p>
        </div>
      </section>

      <MetaTagsGenerator />

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Why do you need Open Graph Meta Tags?</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Have you ever pasted a website URL into a chat app like Slack or Discord, and watched it magically expand into a beautiful card with a summary and a hero image? That isn't magic—the website has perfectly constructed Open Graph (OG) tags.
          </p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            When you fail to include these tags, social networks are forced to guess what your page is about. They often pull random, contextless text and stretch tiny logos into blurry backgrounds. Implementing the code generated above ensures that every time someone shares your content, it looks professional and compels others to click.
          </p>
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
