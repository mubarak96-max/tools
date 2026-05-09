export default function SchemaMarkup() {
  const schemas = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://findbest.tools/finance/uae-visa-cost-calculator/#webpage",
        "url": "https://findbest.tools/finance/uae-visa-cost-calculator",
        "name": "UAE Visa Cost Calculator 2026 | Dubai & Abu Dhabi Fees",
        "description": "Calculate exact UAE visa costs for 2026. Tourist, employment, Golden Visa, Green Visa fees with hidden charges breakdown.",
        "isPartOf": { "@id": "https://findbest.tools/#website" },
        "about": { "@id": "https://findbest.tools/#organization" },
        "datePublished": "2026-01-15T08:00:00+04:00",
        "dateModified": "2026-05-04T08:00:00+04:00",
        "author": { "@id": "https://findbest.tools/#author" },
        "inLanguage": "en-US",
        "potentialAction": {
          "@type": "UseAction",
          "target": "https://findbest.tools/finance/uae-visa-cost-calculator#calculator"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://findbest.tools/#website",
        "url": "https://findbest.tools",
        "name": "findbest.tools",
        "publisher": { "@id": "https://findbest.tools/#organization" }
      },
      {
        "@type": "Organization",
        "@id": "https://findbest.tools/#organization",
        "name": "findbest.tools",
        "url": "https://findbest.tools",
        "logo": "https://findbest.tools/logo.png",
        "sameAs": [
          "https://twitter.com/findbesttools",
          "https://linkedin.com/company/findbesttools"
        ]
      },
      {
        "@type": "Person",
        "@id": "https://findbest.tools/#author",
        "name": "Ahmed Al-Rashid",
        "jobTitle": "UAE Immigration Consultant",
        "description": "Licensed immigration consultant with 12+ years experience in UAE visa processing, employment law, and residency permits.",
        "url": "https://findbest.tools/about",
        "sameAs": ["https://linkedin.com/in/ahmedalrashid"]
      },
      {
        "@type": "SoftwareApplication",
        "name": "UAE Visa Cost Calculator",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "AED"
        },
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How much does a UAE tourist visa cost in 2026?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A 30-day single-entry UAE tourist visa costs approximately AED 350 (USD 95) in 2026. A 60-day visa costs AED 500, while a 90-day visa costs AED 600. The 5-year multiple-entry tourist visa costs between AED 1,200 and AED 1,600, offering significant savings for frequent travelers."
            }
          },
          {
            "@type": "Question",
            "name": "What is the total cost of a 2-year employment visa in Dubai?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The total cost of a 2-year Dubai employment visa ranges from AED 3,500 to AED 7,500 in 2026. This includes the work permit (AED 1,000-2,000), medical fitness test (AED 500-800), Emirates ID (AED 370-570), visa stamping (AED 500-1,500), and mandatory health insurance (AED 1,500+ annually)."
            }
          },
          {
            "@type": "Question",
            "name": "How much is the UAE Golden Visa fee?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The UAE Golden Visa costs between AED 2,800 and AED 3,800 for applicants inside the UAE, and AED 3,800 to AED 4,800 for applicants outside the UAE. Additional mandatory costs include medical testing (AED 500-700), Emirates ID (AED 370-1,070 depending on duration), and health insurance (AED 3,000-15,000 annually)."
            }
          },
          {
            "@type": "Question",
            "name": "What are the hidden costs of UAE visa applications?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Common hidden UAE visa costs include: express processing fees (AED 150-300), document attestation (AED 150-800 per document), health insurance (AED 1,000-5,000 annually), PRO/service fees (AED 500-2,000), typing center charges (AED 50-150), and bank guarantee deposits for family sponsorship (varies by emirate)."
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "How to Calculate Your UAE Visa Cost",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Select Your Visa Type",
            "text": "Choose from tourist, employment, Golden Visa, Green Visa, family, or student visa categories based on your purpose of travel or residency.",
            "url": "https://findbest.tools/finance/uae-visa-cost-calculator#step1"
          },
          {
            "@type": "HowToStep",
            "name": "Add Mandatory Fees",
            "text": "Include government base fees, medical fitness tests, Emirates ID costs, and mandatory health insurance in your calculation.",
            "url": "https://findbest.tools/finance/uae-visa-cost-calculator#step2"
          },
          {
            "@type": "HowToStep",
            "name": "Account for Hidden Costs",
            "text": "Factor in document attestation, express processing, typing center fees, and optional PRO services for accurate budgeting.",
            "url": "https://findbest.tools/finance/uae-visa-cost-calculator#step3"
          }
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
    />
  );
}
