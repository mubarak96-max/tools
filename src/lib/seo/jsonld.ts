import { absoluteUrl, SITE_NAME } from "@/lib/seo/metadata";
import { slugify } from "@/lib/slug";
import type { FAQItem, Tool } from "@/types/database";

type JsonLdRecord = Record<string, unknown>;

function cleanText(value: string | undefined) {
  return (value || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function serializeJsonLd(payload: JsonLdRecord | JsonLdRecord[]) {
  return JSON.stringify(payload).replace(/</g, "\\u003c");
}

export function buildBreadcrumbJsonLd(
  items: Array<{
    name: string;
    path: string;
  }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildFaqJsonLd(faq: FAQItem[]) {
  if (faq.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: cleanText(item.question),
      acceptedAnswer: {
        "@type": "Answer",
        text: cleanText(item.answer),
      },
    })),
  };
}

export function buildSoftwareApplicationJsonLd(tool: Tool) {
  const payload: JsonLdRecord = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    applicationCategory: tool.category,
    description: cleanText(tool.shortDescription || tool.description),
    operatingSystem: tool.platforms.join(", "),
    url: absoluteUrl(`/tools/${tool.slug}`),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };

  if (tool.website) {
    payload.sameAs = tool.website;
  }

  if (tool.startingPrice !== undefined) {
    payload.offers = {
      "@type": "Offer",
      price: tool.startingPrice,
      priceCurrency: tool.startingPriceCurrency || "USD",
    };
  }

  return payload;
}

export function buildItemListJsonLd(
  items: Array<{ name: string; path: string }>,
  listName: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

export function getUseCasePath(slugOrLabel: string) {
  const slug = slugify(slugOrLabel);
  return `/tools-for-${slug}`;
}

export const BLOG_AUTHOR = {
  name: "Mubarak Mutesasira",
  url: "https://www.linkedin.com/in/mubarak-mutesa-43a21095/",
};

export function buildBlogPostingJsonLd(post: {
  path: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
}) {
  const url = absoluteUrl(post.path);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    inLanguage: "en",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    author: {
      "@type": "Person",
      name: BLOG_AUTHOR.name,
      url: BLOG_AUTHOR.url,
      sameAs: [BLOG_AUTHOR.url],
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl("/"),
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/images/favicon.svg"),
      },
    },
  };
}
