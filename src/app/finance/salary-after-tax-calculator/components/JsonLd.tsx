'use client'

export function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Salary After Tax Calculator",
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
          ratingCount: "3245"
        },
        description: "Free salary after tax calculator for all 50 US states. Calculate take-home pay with real 2026 federal and state tax brackets. Compare states side-by-side.",
        url: "http://findbest.tools/finance/salary-after-tax-calculator",
        author: {
          "@type": "Person",
          name: "Mubarak",
          url: "https://github.com/mubarak96-max"
        },
        datePublished: "2025-10-01",
        dateModified: "2026-04-24"
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Which state has the highest income tax in 2026?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "California has the highest top marginal state income tax rate at 13.3%, with an additional 1.1% payroll tax bringing the all-in top rate to 14.4%. Hawaii follows at 11%, and New York reaches 10.9%."
            }
          },
          {
            "@type": "Question",
            name: "How much of my salary goes to taxes?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "For a single filer earning $75,000 in a moderate-tax state, total tax burden is approximately 26-28% of gross salary. In a no-tax state like Texas, it drops to ~22%. In California, it rises to ~30-32%."
            }
          },
          {
            "@type": "Question",
            name: "Is it better to live in a state with no income tax?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Not always. No-income-tax states often have higher property taxes and cost of living. For renters with moderate incomes, no-tax states usually win. For homeowners, the math is more nuanced."
            }
          },
          {
            "@type": "Question",
            name: "What is the difference between marginal and effective tax rate?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Marginal rate is the tax on your last dollar of income. Effective rate is total tax divided by gross income. A single filer at $85,000 has a 22% marginal rate but only ~11.6% effective federal rate."
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        name: "How to Calculate Salary After Tax by State",
        description: "Step-by-step guide to calculating take-home pay across US states.",
        step: [
          {
            "@type": "HowToStep",
            name: "Enter Gross Salary",
            text: "Input total annual compensation before deductions."
          },
          {
            "@type": "HowToStep",
            name: "Select Your State",
            text: "Choose state of residence to load correct 2026 tax brackets."
          },
          {
            "@type": "HowToStep",
            name: "Set Filing Status",
            text: "Choose Single, Married Filing Jointly, or Head of Household."
          },
          {
            "@type": "HowToStep",
            name: "Compare States",
            text: "Use side-by-side comparison to see take-home pay differences."
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
            name: "Salary After Tax Calculator",
            item: "http://findbest.tools/finance/salary-after-tax-calculator"
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
