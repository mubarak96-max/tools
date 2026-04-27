'use client'

export function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Income Tax Calculator Australia",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "AUD"
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "4523"
        },
        description: "Free Australian income tax calculator for 2025-26. Calculate tax, Medicare levy, HECS/HELP repayments, and take-home pay for residents, non-residents, and working holiday makers.",
        url: "http://findbest.tools/finance/income-tax-calculator-australia",
        author: {
          "@type": "Person",
          name: "Mubarak",
          url: "https://github.com/mubarak96-max"
        },
        datePublished: "2025-12-01",
        dateModified: "2026-04-24"
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is the tax-free threshold in Australia?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The tax-free threshold is $18,200 per year for Australian residents. This means you pay no income tax on the first $18,200 you earn. Non-residents do not receive this threshold."
            }
          },
          {
            "@type": "Question",
            name: "How much tax do I pay on $80,000 in Australia?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "On $80,000 as a resident: income tax is $14,788, Medicare levy is $1,600, for a total of $16,388. Take-home pay is approximately $63,612 (21.7% effective rate)."
            }
          },
          {
            "@type": "Question",
            name: "How much tax do I pay on $100,000 in Australia?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "On $100,000 as a resident: income tax is $21,788, Medicare levy is $2,000, total tax is $23,788. Take-home pay is approximately $76,212 (23.8% effective rate)."
            }
          },
          {
            "@type": "Question",
            name: "How is a second job taxed in Australia?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You should only claim the tax-free threshold from your highest-paying job. Your second job will withhold tax from the first dollar at your marginal rate. This prevents underpayment and a tax bill at year-end."
            }
          },
          {
            "@type": "Question",
            name: "How much tax do I pay on $50,000 in Australia?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "On $50,000 as a resident: income tax is $6,788, Medicare levy is $1,000, total tax is $7,788. Take-home pay is $42,212 (15.6% effective rate)."
            }
          },
          {
            "@type": "Question",
            name: "What is the tax rate for working holiday makers in Australia?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Working Holiday Makers pay 15% on income up to $45,000, then 30% on $45,001-$135,000, 37% on $135,001-$190,000, and 45% above $190,000. There is no tax-free threshold."
            }
          },
          {
            "@type": "Question",
            name: "Do I pay Medicare levy if I earn under $30,000?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "If you are single and earn under $27,222, you pay no Medicare levy. Between $27,222 and $34,027, you pay a reduced levy. Above $34,027, the full 2% applies."
            }
          },
          {
            "@type": "Question",
            name: "Are there state income taxes in Australia?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Australia abolished state income taxes in 1942. There is only one level of income tax — federal. The ATO collects all personal income tax."
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        name: "How to Calculate Australian Income Tax",
        description: "Step-by-step guide to calculating Australian income tax, Medicare levy, and take-home pay.",
        step: [
          {
            "@type": "HowToStep",
            name: "Select Residency Status",
            text: "Choose Australian Resident, Foreign Resident, or Working Holiday Maker."
          },
          {
            "@type": "HowToStep",
            name: "Enter Annual Income",
            text: "Input gross annual salary or wage."
          },
          {
            "@type": "HowToStep",
            name: "Add Deductions and Offsets",
            text: "Enter work-related deductions and toggle Low Income Tax Offset."
          },
          {
            "@type": "HowToStep",
            name: "Set Medicare and HECS",
            text: "Toggle Medicare levy and enter HECS-HELP debt for compulsory repayments."
          },
          {
            "@type": "HowToStep",
            name: "Review Breakdown",
            text: "See income tax, Medicare, HECS, total tax, net pay, and effective rate."
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
            name: "Income Tax Calculator Australia",
            item: "http://findbest.tools/finance/income-tax-calculator-australia"
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
