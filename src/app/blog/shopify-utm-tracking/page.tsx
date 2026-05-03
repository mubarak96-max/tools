import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import ShopifyUtmTrackingBlogClient from "./ShopifyUtmTrackingBlogClient";

const PAGE_PATH = "/blog/shopify-utm-tracking";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faqItems = [
  {
    question: "Does Shopify support UTM tracking natively?",
    answer:
      "Shopify partially supports UTM tracking. It reads UTM parameters from incoming URLs and stores them on orders when a customer converts in the same session. However, for full campaign analysis — including multi-session attribution and engagement metrics — you need Google Analytics 4 connected to your Shopify store.",
  },
  {
    question: "Why does my Shopify Analytics show different numbers than GA4?",
    answer:
      "Shopify uses last-click attribution and stores UTM data at the session level. GA4 defaults to data-driven attribution with a different attribution window. The two systems disagree on which campaign earned a sale when multiple touchpoints are involved. Standardizing your UTM naming conventions reduces but doesn't eliminate the gap.",
  },
  {
    question: "Will UTM parameters hurt my Shopify store's SEO?",
    answer:
      "No. UTM parameters are ignored by search engine crawlers and do not affect rankings. Shopify automatically adds canonical tags to prevent duplicate content issues from UTM-tagged URLs.",
  },
  {
    question: "How do I build UTM links for my Shopify store?",
    answer:
      "Use a UTM builder tool like findbest.tools/utility/utm-builder. Enter your Shopify store URL, fill in the UTM parameters (source, medium, campaign), and copy the generated URL. Never build UTM URLs manually — typos in parameter names break tracking silently.",
  },
];

export const metadata: Metadata = {
  title: "Shopify UTM Tracking: Complete Setup Guide for 2026",
  description:
    "Learn how to set up UTM tracking for your Shopify store. Complete guide to UTM parameters, GA4 integration, channel templates, and fixing Shopify vs GA4 attribution gaps.",
  keywords: [
    "shopify utm tracking",
    "utm parameters shopify",
    "shopify utm builder",
    "shopify campaign tracking",
    "shopify google analytics utm",
    "utm tracking shopify store",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Shopify UTM Tracking: Complete Setup Guide for 2026",
    description:
      "Everything Shopify merchants need to know about UTM tracking — parameters, templates, GA4 setup, and fixing attribution gaps.",
    url: PAGE_URL,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shopify UTM Tracking: Complete Setup Guide for 2026",
    description:
      "Everything Shopify merchants need to know about UTM tracking — parameters, templates, GA4 setup, and fixing attribution gaps.",
  },
};

export default function ShopifyUtmTrackingBlogPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Shopify UTM Tracking", path: PAGE_PATH },
  ]);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Shopify UTM Tracking: Complete Setup Guide for 2026",
    description:
      "Everything Shopify merchants need to know about UTM tracking — parameters, templates, GA4 setup, and fixing attribution gaps.",
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
      <ShopifyUtmTrackingBlogClient />
    </div>
  );
}
