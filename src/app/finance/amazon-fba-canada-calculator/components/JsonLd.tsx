'use client'

export function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Amazon FBA Fee Calculator Canada",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "CAD"
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "1876"
        },
        description: "Free Amazon FBA fee calculator for Amazon.ca sellers. Calculate referral fees, FBA fulfillment fees, storage, and profit margins in Canadian Dollars with real 2026 rate cards.",
        url: "http://findbest.tools/finance/amazon-fba-canada-calculator",
        author: {
          "@type": "Person",
          name: "Mubarak",
          url: "https://github.com/mubarak96-max"
        },
        datePublished: "2025-11-01",
        dateModified: "2026-04-24"
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Did Amazon increase FBA fees in Canada for 2026?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Amazon announced no increases to Canada referral fees or FBA fulfillment fees for 2026. This is a rare year of stability for Canadian sellers."
            }
          },
          {
            "@type": "Question",
            name: "What is the referral fee on Amazon.ca?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Referral fees on Amazon.ca range from 8% to 20% depending on category. Electronics are 8%, most categories are 15%, clothing is 17% for items over $15, and jewelry is 20%."
            }
          },
          {
            "@type": "Question",
            name: "How is dimensional weight calculated on Amazon.ca?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Dimensional weight = (Length x Width x Height in cm) / 5,000. Amazon compares this to actual weight and uses the greater of the two to determine fulfillment fees."
            }
          },
          {
            "@type": "Question",
            name: "When do aged inventory surcharges start in Canada?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "In Canada, aged inventory surcharges start at 271 days of storage. This is different from the US where the threshold dropped to 181 days in 2026."
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        name: "How to Calculate Amazon FBA Fees for Canada",
        description: "Step-by-step guide to calculating Amazon.ca FBA fees in Canadian Dollars.",
        step: [
          {
            "@type": "HowToStep",
            name: "Enter Product Dimensions",
            text: "Measure packaged product in centimetres: length, width, and height."
          },
          {
            "@type": "HowToStep",
            name: "Enter Weight in Grams",
            text: "Input unit weight in grams. Calculator compares to dimensional weight."
          },
          {
            "@type": "HowToStep",
            name: "Set Price and Category",
            text: "Enter selling price in CAD and select product category for referral fee."
          },
          {
            "@type": "HowToStep",
            name: "Review Net Profit",
            text: "See referral fee, FBA fulfillment fee, storage estimate, and net profit per unit."
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
            name: "Finance",
            item: "http://findbest.tools/finance"
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Amazon FBA Canada Calculator",
            item: "http://findbest.tools/finance/amazon-fba-canada-calculator"
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
