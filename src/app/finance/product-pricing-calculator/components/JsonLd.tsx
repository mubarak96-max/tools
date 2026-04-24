'use client'

export function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Product Pricing Calculator",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD"
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "2156"
        },
        description: "Free product pricing calculator for Shopify, Etsy, and Amazon with real 2026 platform fees, target margin mode, and multi-currency support.",
        url: "http://findbest.tools/finance/product-pricing-calculator",
        author: {
          "@type": "Person",
          name: "Mubarak",
          url: "https://github.com/mubarak96-max"
        },
        datePublished: "2025-05-01",
        dateModified: "2026-04-24"
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is a good profit margin for ecommerce?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A healthy ecommerce net profit margin typically ranges from 10% to 25% after all platform fees, payment processing, shipping, and advertising. Amazon FBA sellers should target 15-25% net margin; dropshippers often operate at 10-20%."
            }
          },
          {
            "@type": "Question",
            name: "How do I calculate my break-even selling price?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Break-even price = Total Cost Per Unit divided by (1 minus Total Fee Percentage). For example, if your product plus shipping costs $10 and platform fees total 20%, your break-even price is $12.50."
            }
          },
          {
            "@type": "Question",
            name: "Why are Amazon FBA fees so much higher than Shopify?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Amazon provides end-to-end fulfillment, storage, customer service, and access to 300+ million customers. These services are funded by referral fees (7-15%), FBA fulfillment fees, and storage costs. Shopify is software-only with fees limited to payment processing (2.5-2.9% + 30 cents)."
            }
          },
          {
            "@type": "Question",
            name: "Should I use the same price on Etsy and my own Shopify store?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Generally no. Etsy fees total approximately 12-15% of revenue while Shopify fees are roughly 3% + 30 cents per sale. To maintain equal net profit, your Etsy price should be 8-12% higher than your Shopify price."
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        name: "How to Calculate Product Pricing Across Ecommerce Platforms",
        description: "Step-by-step guide to calculating true selling prices for Shopify, Etsy, and Amazon with platform-specific fees.",
        step: [
          {
            "@type": "HowToStep",
            name: "Select Your Platform",
            text: "Choose Shopify, Etsy, or Amazon FBA to load the correct fee structure."
          },
          {
            "@type": "HowToStep",
            name: "Set Your Currency",
            text: "Pick your selling currency. All fee calculations adjust to regional processing rates."
          },
          {
            "@type": "HowToStep",
            name: "Input Costs and Choose Mode",
            text: "Enter product cost, shipping, and expenses. Choose Forward Mode (target margin) or Reverse Mode (set price, see margin)."
          },
          {
            "@type": "HowToStep",
            name: "Compare Across Platforms",
            text: "Use side-by-side comparison to optimize pricing per channel."
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
            name: "Finance Tools",
            item: "http://findbest.tools/finance"
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Product Pricing Calculator",
            item: "http://findbest.tools/finance/product-pricing-calculator"
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
