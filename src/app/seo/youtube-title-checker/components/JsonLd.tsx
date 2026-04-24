'use client'

export function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "YouTube Title Length Checker + Thumbnail Preview",
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
          ratingCount: "1247"
        },
        description: "Free YouTube title analyzer that checks character count, pixel width, mobile truncation, and thumbnail preview across search results, home feed, and mobile devices.",
        url: "http://findbest.tools/seo/youtube-title-checker",
        author: {
          "@type": "Person",
          name: "Mubarak",
          url: "https://github.com/mubarak96-max"
        },
        datePublished: "2025-01-15",
        dateModified: "2026-04-24"
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is the maximum YouTube title length?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "YouTube allows a maximum of 100 characters in a video title. However, titles begin truncating on mobile devices after approximately 35-40 characters and on desktop search after roughly 50-60 characters. The optimal length is 50-60 characters."
            }
          },
          {
            "@type": "Question",
            name: "What size should a YouTube thumbnail be?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The recommended YouTube thumbnail size is 1280 × 720 pixels with a 16:9 aspect ratio. The minimum width is 640 pixels. For YouTube Shorts, use 1080 × 1920 pixels in a 9:16 vertical aspect ratio. Files must be under 2 MB."
            }
          },
          {
            "@type": "Question",
            name: "Does title length affect YouTube SEO?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. While YouTube's algorithm scans the full 100-character title for semantic indexing, human viewers only see the visible portion. If your primary keyword is hidden behind truncation, CTR drops, signaling lower relevance to the algorithm."
            }
          },
          {
            "@type": "Question",
            name: "What is the thumbnail safe zone?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The safe zone is the area of your thumbnail guaranteed to remain visible. Keep critical text and faces within the center 1100×620 pixels for desktop and 960×540 pixels for mobile. Avoid the bottom-right corner where YouTube places the video duration timestamp."
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        name: "How to Optimize a YouTube Title and Thumbnail",
        description: "Step-by-step guide to analyzing and optimizing YouTube video titles and thumbnails for maximum CTR.",
        step: [
          {
            "@type": "HowToStep",
            name: "Enter Your Title",
            text: "Type your proposed YouTube title into the Title Analyzer input field."
          },
          {
            "@type": "HowToStep",
            name: "Review Truncation Previews",
            text: "Examine Mobile, Desktop Search, and Suggested Videos previews for truncation points."
          },
          {
            "@type": "HowToStep",
            name: "Check SEO Score",
            text: "Review the algorithmic score evaluating keyword placement, power words, and length."
          },
          {
            "@type": "HowToStep",
            name: "Upload Thumbnail",
            text: "Drag and drop your custom thumbnail to validate dimensions and preview across surfaces."
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
            name: "SEO",
            item: "http://findbest.tools/seo"
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "YouTube Title Checker",
            item: "http://findbest.tools/seo/youtube-title-checker"
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
