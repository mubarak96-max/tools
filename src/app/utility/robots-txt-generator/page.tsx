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
      "A robots.txt file gives crawling instructions to bots at the domain root, including which paths are allowed or disallowed and where the sitemap is located.",
  },
  {
    question: "Does robots.txt block pages from the web?",
    answer:
      "No. It is a crawler directive, not an access-control mechanism. Sensitive content should be protected with authentication or removed entirely.",
  },
  {
    question: "Where should robots.txt live?",
    answer:
      "It should be served from the root of the domain, for example https://example.com/robots.txt.",
  },
];

export const metadata: Metadata = {
  title: "Robots.txt Generator | Build Allow, Disallow, and Sitemap Rules",
  description:
    "Generate a clean robots.txt file with user-agent, allow, disallow, crawl-delay, and sitemap fields.",
  keywords: ["robots txt generator", "robots.txt generator", "seo robots file generator"],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Robots.txt Generator",
    description: "Build a robots.txt file with crawler rules and sitemap references.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Robots.txt Generator",
    description: "Create a clean robots.txt file for your site.",
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
    description: "Free online robots.txt generator for crawler directives and sitemap entries.",
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
            Build a simple robots.txt file for crawlers with allow, disallow, crawl-delay, and sitemap directives in one place.
          </p>
        </div>
      </section>
      <RobotsTxtGenerator />
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
