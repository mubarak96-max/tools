"use client";

export default function SchemaMarkup() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "UAE Gratuity Calculator 2026",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "AED"
    },
    "description": "Calculate your UAE end of service gratuity instantly with our free MOHRE-compliant calculator based on Federal Decree-Law No. 33 of 2021."
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How is gratuity calculated in the UAE under the new labour law?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Under Federal Decree-Law No. 33 of 2021, UAE gratuity is calculated based on your last drawn basic salary. For the first 5 years of service, you receive 21 days' basic salary per year. For each additional year beyond 5 years, you receive 30 days' basic salary per year."
        }
      },
      {
        "@type": "Question",
        "name": "Is gratuity calculated on basic salary or total salary in the UAE?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Gratuity in the UAE is calculated exclusively on your basic salary, not your total salary package. Basic salary excludes housing allowance, transportation allowance, utility allowance, and other benefits."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
