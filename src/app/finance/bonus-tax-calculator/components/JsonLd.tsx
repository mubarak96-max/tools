'use client'

export function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Bonus Tax Calculator 2026",
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
          ratingCount: "3124"
        },
        description: "Free bonus tax calculator for 2026. Calculate employee bonus paycheck withholding with 22% supplemental rate, FICA, and state tax. Or calculate business bonus depreciation under Section 168(k).",
        url: "http://findbest.tools/finance/bonus-tax-calculator",
        author: {
          "@type": "Person",
          name: "Mubarak",
          url: "https://github.com/mubarak96-max"
        },
        datePublished: "2025-09-01",
        dateModified: "2026-04-24"
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Why is my bonus taxed at 22%?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The IRS classifies bonuses as supplemental wages. For supplemental wages under $1 million per year, employers may withhold federal income tax at a flat 22% rate. This is not your actual tax rate — it is a convenience withholding method."
            }
          },
          {
            "@type": "Question",
            name: "What is the bonus depreciation rate for 2026?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Under current law, bonus depreciation is 20% for assets placed in service in 2026. This is down from 100% (2018–2022) and phases out completely to 0% beginning in 2027."
            }
          },
          {
            "@type": "Question",
            name: "Do I pay Social Security tax on my bonus?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, bonuses are subject to the full FICA tax stack: 6.2% Social Security (up to the $184,500 wage base), 1.45% Medicare (no cap), and potentially 0.9% Additional Medicare if total wages exceed $200,000."
            }
          },
          {
            "@type": "Question",
            name: "What qualifies for bonus depreciation?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Qualifying property includes tangible personal property with a MACRS recovery period of 20 years or less, qualified improvement property, computer software, and specified plants. Used property qualifies as long as it is new to the taxpayer."
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        name: "How to Calculate Bonus Tax Withholding or Bonus Depreciation",
        description: "Step-by-step guide to calculating employee bonus tax or business bonus depreciation.",
        step: [
          {
            "@type": "HowToStep",
            name: "Choose Calculator",
            text: "Select Employee Bonus Tax or Business Bonus Depreciation."
          },
          {
            "@type": "HowToStep",
            name: "Enter Amount",
            text: "Input bonus amount or asset cost basis."
          },
          {
            "@type": "HowToStep",
            name: "Add Details",
            text: "Select withholding method, state tax, 401k, or property class and recovery period."
          },
          {
            "@type": "HowToStep",
            name: "Review Results",
            text: "See net bonus or first-year depreciation deduction with full breakdown."
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
            name: "Bonus Tax Calculator",
            item: "http://findbest.tools/finance/bonus-tax-calculator"
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
