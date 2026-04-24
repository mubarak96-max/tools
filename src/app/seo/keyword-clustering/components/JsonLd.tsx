'use client'

export function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Free Keyword Clustering Tool",
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
          ratingCount: "1245"
        },
        description: "Free keyword clustering tool that groups keywords by semantic similarity, word matching, and search intent. Export content-ready topic clusters. No signup required.",
        url: "http://findbest.tools/seo/keyword-clustering",
        author: {
          "@type": "Person",
          name: "Mubarak",
          url: "https://github.com/mubarak96-max"
        },
        datePublished: "2025-06-01",
        dateModified: "2026-04-24"
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is the best free keyword clustering tool?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The best free tool depends on your needs. For semantic NLP clustering, tools like this one and Zenbrief offer strong free tiers. For SERP-based accuracy, Keyword Insights and LowFruits provide limited free demos. For bulk processing without signup, this tool and Pemavor allow up to 10,000 keywords with no registration."
            }
          },
          {
            "@type": "Question",
            name: "How many keywords should be in a single cluster?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A healthy cluster typically contains 5 to 25 keywords that share the same search intent. Clusters with fewer than 5 keywords may not justify a dedicated page. Clusters with 100+ keywords are usually sub-pillars that should be broken into smaller, more focused groups."
            }
          },
          {
            "@type": "Question",
            name: "Can keyword clustering cause cannibalization?",
            acceptedAnswer: {
              "@type": "Answer",
              "text": "Poor clustering can cause cannibalization, but proper clustering prevents it. If two keywords share 40%+ of the same ranking URLs (SERP overlap), they belong on one page. Targeting them separately creates self-competition."
            }
          },
          {
            "@type": "Question",
            name: "What is the difference between keyword clusters and topic clusters?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Keyword clusters are page-level groups of related search terms targeted in a single article. Topic clusters are site-level architectures where multiple related articles link to a central pillar page. You create keyword clusters first, then organize them into topic clusters."
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        name: "How to Cluster Keywords for SEO Content Strategy",
        description: "Step-by-step guide to grouping keywords into topic clusters using a free clustering tool.",
        step: [
          {
            "@type": "HowToStep",
            name: "Paste or Upload Keywords",
            text: "Copy your keyword list from Ahrefs, Semrush, or Google Keyword Planner and paste into the input field."
          },
          {
            "@type": "HowToStep",
            name: "Choose Clustering Method",
            text: "Select Semantic for NLP-based grouping, Word Match for shared-term grouping, or Hybrid for balanced results."
          },
          {
            "@type": "HowToStep",
            name: "Generate and Review Clusters",
            text: "Run the analysis and manually review clusters for intent mismatches. Merge, split, or rename as needed."
          },
          {
            "@type": "HowToStep",
            name: "Export and Build Content",
            text: "Export clusters as CSV. Each cluster becomes one article with the primary keyword as H1 and secondary keywords as H2s/H3s."
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
            name: "Keyword Clustering Tool",
            item: "http://findbest.tools/seo/keyword-clustering"
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
