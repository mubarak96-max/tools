'use client'

export function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Hreflang Tag Generator",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD"
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "856"
        },
        description: "Free hreflang tag generator that validates ISO codes, enforces self-referencing and reciprocity, and exports HTML head tags or XML sitemap format for multilingual SEO.",
        url: "http://findbest.tools/seo/hreflang-generator",
        author: {
          "@type": "Person",
          name: "Mubarak",
          url: "https://github.com/mubarak96-max"
        },
        datePublished: "2025-03-01",
        dateModified: "2026-04-24"
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is hreflang used for?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Hreflang is an HTML attribute that tells search engines which language and regional version of a page to serve to which users. It prevents duplicate content issues across language variants and ensures users see the most relevant version."
            }
          },
          {
            "@type": "Question",
            name: "What happens if I use the wrong country code?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Search engines silently ignore invalid hreflang codes. Using en-uk instead of en-GB means that annotation is treated as if it doesn't exist, orphaning the page from your international structure."
            }
          },
          {
            "@type": "Question",
            name: "Can I use hreflang on a page with a canonical tag?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, but the canonical tag must be self-referencing — pointing to the page itself. If your canonical points to a different language version, search engines will likely ignore both signals."
            }
          },
          {
            "@type": "Question",
            name: "Should I use HTML tags or XML sitemap for hreflang?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "For small to medium sites, HTML head tags are simplest. For large sites with many language variants, XML sitemaps are more efficient. Do not mix methods — choose one and stick to it."
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        name: "How to Generate Hreflang Tags for a Multilingual Website",
        description: "Step-by-step guide to generating correct hreflang tags with ISO validation and self-referencing.",
        step: [
          {
            "@type": "HowToStep",
            name: "Add Language Variants",
            text: "Click Add Variant for each language or regional version of your page."
          },
          {
            "@type": "HowToStep",
            name: "Enter Canonical URLs",
            text: "Paste the absolute URL for each variant."
          },
          {
            "@type": "HowToStep",
            name: "Set X-Default",
            text: "Designate one variant as your x-default fallback for unmatched users."
          },
          {
            "@type": "HowToStep",
            name: "Export and Implement",
            text: "Copy HTML head tags or download XML sitemap format."
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "http://findbest.tools"
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "SEO Tools",
            item: "http://findbest.tools/seo"
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Hreflang Generator",
            item: "http://findbest.tools/seo/hreflang-generator"
          }
        ]
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
