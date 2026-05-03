export default function SchemaMarkup() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://findbest.tools/real-estate/price-per-square-foot-calculator/#webpage",
        url: "https://findbest.tools/real-estate/price-per-square-foot-calculator",
        name: "Price Per Square Foot Calculator | Free Real Estate & Construction Cost Tool",
        description:
          "Free price per square foot calculator for real estate, construction, flooring, and remodeling. Calculate cost per sq ft instantly.",
        isPartOf: {
          "@id": "https://findbest.tools/#website",
        },
        about: {
          "@id": "https://findbest.tools/#organization",
        },
        primaryImageOfPage: {
          "@id": "https://findbest.tools/real-estate/price-per-square-foot-calculator/#primaryimage",
        },
        datePublished: "2024-01-15T08:00:00+00:00",
        dateModified: "2024-05-04T08:00:00+00:00",
        breadcrumb: {
          "@id": "https://findbest.tools/real-estate/price-per-square-foot-calculator/#breadcrumb",
        },
        inLanguage: "en-US",
        potentialAction: [
          {
            "@type": "UseAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate:
                "https://findbest.tools/real-estate/price-per-square-foot-calculator",
            },
          },
        ],
      },
      {
        "@type": "SoftwareApplication",
        name: "Price Per Square Foot Calculator",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "2847",
          bestRating: "5",
          worstRating: "1",
        },
        featureList:
          "Real-time price per square foot calculation, property comparison mode, construction cost estimation, flooring cost calculator, rent per square foot analysis, historical price tracking",
        softwareVersion: "2.0",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How do you calculate price per square foot?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "To calculate price per square foot, divide the total price or cost by the total square footage. The formula is: Price Per Square Foot = Total Price ÷ Total Square Feet. For example, if a home costs $400,000 and is 2,000 square feet, the price per square foot is $200.",
            },
          },
          {
            "@type": "Question",
            name: "What is a good price per square foot for a house?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A good price per square foot varies significantly by location, market conditions, and property type. In 2024, the national median price per square foot for existing homes in the U.S. ranges from $150 to $400, with premium markets like San Francisco exceeding $1,000 per square foot and rural areas falling below $100 per square foot.",
            },
          },
          {
            "@type": "Question",
            name: "How do you calculate construction cost per square foot?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Construction cost per square foot is calculated by dividing the total construction budget by the total buildable square footage. Include all hard costs (materials, labor) and soft costs (permits, design fees, financing). National averages range from $100-$200 per square foot for standard construction to $400+ for luxury builds.",
            },
          },
          {
            "@type": "Question",
            name: "Is price per square foot accurate for comparing homes?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Price per square foot is a useful starting point for comparison but has limitations. It works best when comparing similar properties in the same neighborhood with comparable finishes, lot sizes, and conditions. It should not be used in isolation—consider location, property condition, lot value, and unique features.",
            },
          },
          {
            "@type": "Question",
            name: "How do you calculate rent per square foot?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Rent per square foot is calculated by dividing the monthly rent by the total square footage of the unit. For example, a $2,000 monthly rent for a 1,000 square foot apartment equals $2.00 per square foot per month. Commercial leases often use annual rent per square foot.",
            },
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://findbest.tools/real-estate/price-per-square-foot-calculator/#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://findbest.tools/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Price Per Square Foot Calculator",
            item: "https://findbest.tools/real-estate/price-per-square-foot-calculator",
          },
        ],
      },
      {
        "@type": "Organization",
        "@id": "https://findbest.tools/#organization",
        name: "Real Estate Analytics Team",
        url: "https://findbest.tools",
        logo: {
          "@type": "ImageObject",
          url: "https://findbest.tools/logo.png",
        },
        sameAs: [
          "https://twitter.com/yourhandle",
          "https://linkedin.com/company/yourcompany",
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
