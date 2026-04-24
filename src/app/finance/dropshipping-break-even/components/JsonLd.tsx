'use client'

export function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Dropshipping Break-even Calculator",
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
          ratingCount: "1847"
        },
        description: "Free dropshipping calculator for break-even units, revenue, ROAS, CPA, and profit margin. Input product cost, selling price, ad spend, and fixed costs.",
        url: "http://findbest.tools/finance/dropshipping-break-even",
        author: {
          "@type": "Person",
          name: "Mubarak",
          url: "https://github.com/mubarak96-max"
        },
        datePublished: "2025-04-01",
        dateModified: "2026-04-24"
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is a good dropshipping profit margin?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A good dropshipping net profit margin typically falls between 10% and 20%, with gross margins of 60-70% considered healthy. High-ticket items can achieve 30-50% margins."
            }
          },
          {
            "@type": "Question",
            name: "What is break-even ROAS and why does it matter?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Break-even ROAS is the minimum Return on Ad Spend needed to avoid losing money on each sale. It is calculated as Selling Price divided by (Selling Price minus Variable Cost). For example, a $30 product with $15.90 in non-ad costs has a break-even ROAS of 2.13x."
            }
          },
          {
            "@type": "Question",
            name: "Should I include ad costs in my break-even calculation?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, but use two calculations. Break-even ROAS judges ad campaign health in real time. Break-even units/revenue including CPA determines true overall profitability after fixed costs."
            }
          },
          {
            "@type": "Question",
            name: "What is a good conversion rate for dropshipping?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The average ecommerce conversion rate is approximately 3.58%. For dropshipping specifically, 2.5-3% is typical. Above 5% is strong performance; below 2% signals landing page or audience issues."
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        name: "How to Calculate Dropshipping Break-Even Point",
        description: "Step-by-step guide to calculating break-even units, revenue, ROAS, and CPA for dropshipping businesses.",
        step: [
          {
            "@type": "HowToStep",
            name: "Enter Product Economics",
            text: "Input selling price, product cost, shipping, and per-unit fees to see profit per unit and contribution margin."
          },
          {
            "@type": "HowToStep",
            name: "Set Monthly Fixed Costs",
            text: "Add Shopify plan, apps, domain, and other monthly overhead costs."
          },
          {
            "@type": "HowToStep",
            name: "Input Ad Spend and Conversion Rate",
            text: "Enter daily/monthly ad budget and store conversion rate to derive expected visitors and sales."
          },
          {
            "@type": "HowToStep",
            name: "Review and Optimize",
            text: "Check break-even units, revenue, ROAS, and net profit. Use sensitivity sliders to test pricing and cost scenarios."
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
            name: "Dropshipping Break-even Calculator",
            item: "http://findbest.tools/finance/dropshipping-break-even"
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
