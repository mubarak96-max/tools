import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import UtmAdsBlogClient from "./UtmAdsBlogClient";

const PAGE_PATH = "/blog/utm-ads";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faqItems = [
  {
    question: "What UTM parameters should I use for Google Ads?",
    answer: "For Google Ads, use utm_source=google, utm_medium=cpc, utm_campaign={campaignid} or your campaign name, and utm_term={keyword} for search ads. Enable auto-tagging for GA4 attribution, but also set manual UTMs in the Final URL Suffix so non-GA4 tools can read campaign data."
  },
  {
    question: "What is the best UTM medium for paid ads?",
    answer: "Use utm_medium=cpc for all paid ad placements — search, social, display, and shopping. GA4 recognizes 'cpc' as Paid Search or Paid Social depending on the source. Avoid 'paid', 'paid-social', or 'ads' as these push traffic into GA4's Unassigned channel."
  },
  {
    question: "How do I add UTM parameters to Facebook Ads?",
    answer: "In Meta Ads Manager, go to the Ad level, scroll to URL Parameters, and enter your UTM string. Use dynamic parameters like {{campaign.name}}, {{adset.name}}, and {{site_source_name}} to auto-populate values. The recommended template is: utm_source={{site_source_name}}&utm_medium=cpc&utm_campaign={{campaign.name}}&utm_content={{ad.name}}"
  },
  {
    question: "Should I use manual UTMs or auto-tagging in Google Ads?",
    answer: "Use both. Auto-tagging (gclid) gives GA4 full cost and bid data from Google Ads. Manual UTMs in the Final URL Suffix give non-GA4 tools (CRMs, Shopify, third-party analytics) campaign context they can't read from gclid. They coexist without conflict."
  },
  {
    question: "Do UTM parameters affect ad Quality Score?",
    answer: "No. UTM parameters are appended after the URL and are not evaluated by ad platforms when calculating Quality Score or Ad Rank. They have no effect on your ad delivery, bid prices, or rankings."
  }
];

export const metadata: Metadata = {
  title: "UTM Ads: How to Track Every Ad Campaign Across Every Platform (2026)",
  description: "The complete guide to UTM tracking for ads — Google Ads, Meta, TikTok, LinkedIn and more. Platform-by-platform setup, dynamic parameters, naming conventions, and copy-paste templates.",
  keywords: [
    "utm ads",
    "utm parameters for ads",
    "utm tracking ads",
    "utm google ads",
    "utm facebook ads",
    "utm ad tracking",
    "utm campaign ads"
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "UTM Ads: How to Track Every Ad Campaign Across Every Platform (2026)",
    description: "Platform-by-platform UTM setup for Google Ads, Meta, TikTok, LinkedIn, Pinterest and more. Includes dynamic parameter templates and copy-paste URLs.",
    url: PAGE_URL,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "UTM Ads: How to Track Every Ad Campaign Across Every Platform (2026)",
    description: "Platform-by-platform UTM setup for Google Ads, Meta, TikTok, LinkedIn, Pinterest and more. Includes dynamic parameter templates and copy-paste URLs.",
  },
};

export default function UtmAdsBlogPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "UTM Ads", path: PAGE_PATH },
  ]);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "UTM Ads: How to Track Every Ad Campaign Across Every Platform (2026)",
    description: "The complete guide to UTM tracking for ads — setup, dynamic parameters, naming conventions, and platform templates for Google, Meta, TikTok, LinkedIn and more.",
    author: { "@type": "Organization", name: "FindBest.Tools" },
    publisher: { "@type": "Organization", name: "FindBest.Tools" },
    datePublished: "2026-05-01",
    dateModified: "2026-05-01",
    mainEntityOfPage: PAGE_URL,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8">
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      <JsonLd data={serializeJsonLd(articleJsonLd)} />
      <JsonLd data={serializeJsonLd(faqJsonLd)} />
      <UtmAdsBlogClient />
    </div>
  );
}
