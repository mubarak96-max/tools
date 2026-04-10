import Link from "next/link";
import type { Metadata } from "next";

import SitemapGenerator from "@/app/utility/sitemap-generator/components/SitemapGenerator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/utility/sitemap-generator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What does a sitemap.xml file do?",
    answer:
      "A sitemap lists the important URLs on a site in XML format so search engines can discover and crawl them more efficiently.",
  },
  {
    question: "Can I mix full URLs and paths?",
    answer:
      "Yes. Relative paths are combined with the site URL you enter, while full URLs are kept as-is.",
  },
  {
    question: "Is this a sitemap index generator?",
    answer:
      "No. This page creates a basic URL set sitemap for a list of URLs or paths. Large sites may need sitemap indexes and multiple files.",
  },
];

export const metadata: Metadata = {
  title: "Sitemap Generator | Basic sitemap.xml Builder",
  description:
    "Generate a basic sitemap.xml file from a site URL and a list of paths or full URLs.",
  keywords: ["sitemap generator", "sitemap xml generator", "basic sitemap builder"],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Sitemap Generator",
    description: "Build a basic sitemap.xml file from a list of URLs or paths.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sitemap Generator",
    description: "Generate a basic XML sitemap for your site.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Sitemap Generator",
    url: PAGE_URL,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free basic sitemap.xml generator from paths or full URLs.",
  };
}

export default function SitemapGeneratorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Utility", path: "/utility" },
    { name: "Sitemap Generator", path: PAGE_PATH },
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
            <li className="text-foreground">Sitemap Generator</li>
          </ol>
        </nav>
        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">SEO Utility</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Sitemap Generator</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Build a basic sitemap.xml file from a site URL and a list of paths or URLs, then copy the generated XML directly.
          </p>
        </div>
      </section>
      <SitemapGenerator />
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
