'use client'

export function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "US Take-Home Salary Calculator 2026",
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
          ratingCount: "2847"
        },
        description: "Free US take-home pay calculator for 2026 with real IRS federal tax brackets, FICA taxes, 401(k), HSA, health insurance, and state tax deductions.",
        url: "http://findbest.tools/finance/us-take-home-calculator",
        author: {
          "@type": "Person",
          name: "Mubarak",
          url: "https://github.com/mubarak96-max"
        },
        datePublished: "2025-07-01",
        dateModified: "2026-04-24"
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is the 2026 401(k) contribution limit?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The 2026 401(k) contribution limit is $24,500 for employees under 50. The catch-up contribution for those aged 50 and over is $8,000, allowing a total of $32,500. Workers aged 60-63 have a super catch-up limit of $11,250."
            }
          },
          {
            "@type": "Question",
            name: "How is FICA calculated on high salaries?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Social Security tax (6.2%) applies only to the first $184,500 of wages in 2026. Medicare tax (1.45%) applies to all wages with no cap. If your wages exceed $200,000, an additional 0.9% Medicare surtax applies to the excess."
            }
          },
          {
            "@type": "Question",
            name: "Do 401(k) contributions reduce FICA tax?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Traditional 401(k) contributions reduce your federal income tax but not your FICA tax. You still pay Social Security and Medicare taxes on the full gross wages, including the amount contributed to your 401(k). HSA contributions, however, are exempt from FICA if made through payroll deduction."
            }
          },
          {
            "@type": "Question",
            name: "What is my effective tax rate?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Your effective tax rate is your total tax divided by your gross income. For example, a single filer earning $85,000 with the standard deduction pays approximately $9,870 in federal income tax, yielding an effective federal rate of about 11.6%."
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        name: "How to Calculate US Take-Home Pay for 2026",
        description: "Step-by-step guide to calculating net salary after federal tax, FICA, 401(k), healthcare, and state tax.",
        step: [
          {
            "@type": "HowToStep",
            name: "Enter Gross Salary",
            text: "Input your annual gross salary and select pay frequency."
          },
          {
            "@type": "HowToStep",
            name: "Select Filing Status",
            text: "Choose Single, Married Filing Jointly, or Head of Household."
          },
          {
            "@type": "HowToStep",
            name: "Add Pre-Tax Deductions",
            text: "Enter 401(k), HSA, FSA, and health insurance premium amounts."
          },
          {
            "@type": "HowToStep",
            name: "Review Breakdown",
            text: "See federal tax, FICA, state tax, total deductions, and net pay per paycheck."
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
            name: "US Take-Home Calculator",
            item: "http://findbest.tools/finance/us-take-home-calculator"
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
