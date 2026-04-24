'use client'

export function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Meta Description Pixel Width Checker",
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD"
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "987"
        },
        description: "Free meta description checker that measures pixel width and character count. Preview Google desktop and mobile SERP snippets in real time.",
        url: "http://findbest.tools/seo/meta-description-checker",
        author: {
          "@type": "Person",
          name: "Mubarak",
          url: "https://github.com/mubarak96-max"
        },
        datePublished: "2025-02-01",
        dateModified: "2026-04-24"
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is the maximum meta description length?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Google truncates meta descriptions at approximately 920 pixels on desktop (150-158 characters) and 680 pixels on mobile (about 120 characters). To avoid truncation, keep descriptions within 120-158 characters and verify pixel width."
            }
          },
          {
            "@type": "Question",
            name: "Does meta description length affect SEO rankings?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Meta descriptions are not a direct ranking factor, but they significantly influence click-through rate (CTR), which Google uses as an engagement signal. Higher CTR can indirectly improve rankings over time."
            }
          },
          {
            "@type": "Question",
            name: "Why does Google rewrite my meta description?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Google rewrites an estimated 60-70% of meta descriptions when they don't match search intent, are too generic, contain keyword stuffing, or when page content contains a more relevant passage."
            }
          },
          {
            "@type": "Question",
            name: "What is the ideal title tag length?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The ideal title tag length is 50-60 characters or under 600 pixels wide on desktop. Google truncates based on pixel width, not character count, so always verify pixel width."
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        name: "How to Optimize Meta Descriptions Using Pixel Width",
        description: "Step-by-step guide to measuring and optimizing meta descriptions and title tags for Google SERPs.",
        step: [
          {
            "@type": "HowToStep",
            name: "Enter Your Title Tag",
            text: "Type your page title into the Title Tag field to measure pixel width against the 600px desktop limit."
          },
          {
            "@type": "HowToStep",
            name: "Enter Your Meta Description",
            text: "Paste your meta description and watch the pixel ruler update against the 920px desktop and 680px mobile limits."
          },
          {
            "@type": "HowToStep",
            name: "Simulate Keyword Bolding",
            text: "Enter your target keyword to preview how Google bolds matching terms in the SERP."
          },
          {
            "@type": "HowToStep",
            name: "Review Previews and Copy HTML",
            text: "Toggle between desktop and mobile previews, then copy the optimized HTML meta tags."
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
            name: "Meta Description Checker",
            item: "http://findbest.tools/seo/meta-description-checker"
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
