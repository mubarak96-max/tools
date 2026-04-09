import Link from "next/link";
import type { Metadata } from "next";

import UTMLinkBuilder from "@/app/utility/utm-link-builder/components/UTMLinkBuilder";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/utility/utm-link-builder";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What are UTM parameters?",
    answer:
      "UTM (Urchin Tracking Module) parameters are five variants of URL tags used by marketers to track the effectiveness of online marketing campaigns across traffic sources and publishing media.",
  },
  {
    question: "Do I need to fill out every UTM field?",
    answer:
      "No. At a minimum, you should provide the 'utm_source' (e.g. google, newsletter). However, providing 'utm_medium' and 'utm_campaign' will give you much better tracking data in Google Analytics.",
  },
  {
    question: "What is the difference between source and medium?",
    answer:
      "Source (utm_source) is 'where' the traffic comes from, such as a specific website or platform (e.g. facebook, twitter, newsletter). Medium (utm_medium) is 'how' the traffic got to you, describing the marketing channel (e.g. cpc, email, social).",
  },
  {
    question: "Can UTM tags mess up my website's SEO?",
    answer:
      "No. Search engines know to ignore standard UTM tracking parameters. They will not create duplicate content issues for your search ranking.",
  },
];

export const metadata: Metadata = {
  title: "UTM Link Builder | Free Campaign URL Generator",
  description:
    "Free UTM link builder. Add custom campaign parameters to your URLs so you can track Custom Campaigns in Google Analytics and measure your marketing success.",
  keywords: [
    "UTM link builder",
    "campaign URL builder",
    "create UTM link",
    "Google Analytics UTM",
    "UTM parameter generator",
    "utm_source",
    "utm_medium",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "UTM Link Builder",
    description:
      "Add custom campaign parameters to your URLs for clean Google Analytics tracking.",
  },
  twitter: {
    card: "summary_large_image",
    title: "UTM Link Builder",
    description:
      "Free UTM link builder to generate custom campaign tracking URLs.",
  },
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "UTM Link Builder",
    url: PAGE_URL,
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Easily add custom campaign parameters to URLs so you can track campaigns in Google Analytics.",
    featureList: [
      "Generates clean utm_source, utm_medium, and utm_campaign tags",
      "URL encoding built-in",
      "Instant copy to clipboard",
    ],
  };
}

export default function UTMLinkBuilderPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Utility", path: "/utility" },
    { name: "UTM Link Builder", path: PAGE_PATH },
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
            <li className="text-foreground">UTM Link Builder</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            SEO & Marketing
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            UTM Link Builder
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Add custom campaign parameters to your URLs so you can perfectly track custom campaigns and traffic sources in Google Analytics.
          </p>
        </div>
      </section>

      <UTMLinkBuilder />

      <section className="space-y-4 border-t border-border/60 pt-8">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How to use UTM parameters</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            UTM parameters are simply tags you add to the end of a URL. When someone clicks on a link with UTM parameters, those tags are sent back to your Google Analytics, allowing you to trace exactly where your traffic is coming from.
          </p>

          <h2 className="mt-8 text-xl font-semibold tracking-tight text-foreground">Parameter Guide</h2>
          <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
            <li>
              <strong className="text-foreground">utm_source (Required):</strong> Identify the advertiser, site, or publication that is sending traffic to your property, for example: <code>google</code>, <code>newsletter</code>, or <code>billboard</code>.
            </li>
            <li>
              <strong className="text-foreground">utm_medium:</strong> Identify the advertising or marketing medium, for example: <code>cpc</code>, <code>banner</code>, <code>email newsletter</code>.
            </li>
            <li>
              <strong className="text-foreground">utm_campaign:</strong> The individual campaign name, slogan, or promo code for a product, for example: <code>spring_sale</code>.
            </li>
            <li>
              <strong className="text-foreground">utm_term:</strong> Primarily used to track the paid keywords of an ad campaign if you're manually tagging search ads.
            </li>
            <li>
              <strong className="text-foreground">utm_content:</strong> Used to differentiate similar content or links within the same ad. For example, if you have two call-to-action links in the same email message, you can use utm_content to separate them to see which is more effective.
            </li>
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
