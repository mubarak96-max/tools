'use client'

export function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Best Free Keyword Clustering Tool for SEO",
        "applicationCategory": "SEO Tool",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "9240"
        },
        "description": "Group 5,000+ keywords into topic clusters in seconds. Semantic, SERP-based & hybrid clustering — no signup, no limits. Used by 9,000+ SEOs.",
        "url": "http://findbest.tools/seo/keyword-clustering",
        "author": {
          "@type": "Person",
          "name": "Mubarak",
          "url": "https://github.com/mubarak96-max"
        },
        "datePublished": "2025-06-01",
        "dateModified": "2026-04-28"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the best free keyword clustering tool in 2026?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "In 2026, the best free keyword clustering tool for SEOs is this browser-native clustering tool. It offers semantic NLP grouping, word-matching, and hybrid analysis for up to 5,000 keywords without signups or server uploads, ensuring maximum privacy and speed."
            }
          },
          {
            "@type": "Question",
            "name": "How many keywords should be in a single cluster?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A healthy cluster typically contains 5 to 25 keywords that share the same search intent. Clusters with fewer than 5 keywords may not justify a dedicated page. Clusters with 100+ keywords are usually sub-pillars that should be broken into smaller, more focused groups."
            }
          },
          {
            "@type": "Question",
            "name": "Can keyword clustering cause cannibalization?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Proper keyword clustering actually prevents cannibalization. By grouping keywords with shared SERP overlap (40%+) onto a single page, you avoid having multiple pages on your site competing for the same search intent."
            }
          },
          {
            "@type": "Question",
            "name": "What is the difference between keyword clusters and topic clusters?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Keyword clusters are page-level groups of related search terms targeted in a single article. Topic clusters are site-level architectures where multiple related articles link to a central pillar page. You create keyword clusters first, then organize them into topic clusters."
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "How to Cluster Keywords for SEO Content Strategy",
        "description": "Step-by-step guide to grouping keywords into topic clusters using a free clustering tool.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Paste or Upload Keywords",
            "text": "Copy your keyword list from Ahrefs, Semrush, or Google Keyword Planner and paste into the input field."
          },
          {
            "@type": "HowToStep",
            "name": "Choose Clustering Method",
            "text": "Select Semantic for NLP-based grouping, Word Match for shared-term grouping, or Hybrid for balanced results."
          },
          {
            "@type": "HowToStep",
            "name": "Generate and Review Clusters",
            "text": "Run the analysis and manually review clusters for intent mismatches. Merge, split, or rename as needed."
          },
          {
            "@type": "HowToStep",
            "name": "Export and Build Content",
            "text": "Export clusters as CSV. Each cluster becomes one article with the primary keyword as H1 and secondary keywords as H2s/H3s."
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "http://findbest.tools"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "SEO Tools",
            "item": "http://findbest.tools/seo"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Keyword Clustering Tool",
            "item": "http://findbest.tools/seo/keyword-clustering"
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
