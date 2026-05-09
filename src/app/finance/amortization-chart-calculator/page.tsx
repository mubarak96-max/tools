import { Metadata } from "next";
import { Calculator } from "@/components/amortization/Calculator";
import { ContentSection } from "@/components/amortization/ContentSection";
import { FAQSection } from "@/components/amortization/FAQSection";
import { AuthorBio } from "@/components/amortization/AuthorBio";

export const metadata: Metadata = {
  title: "Amortization Chart Calculator | Free Loan Amortization Schedule Maker 2026",
  description:
    "Free amortization chart calculator and amortization schedule maker. Generate detailed loan amortization tables, visualize payment breakdowns, and download your amortization schedule. Supports mortgages, auto loans, student loans & more.",
  keywords: [
    "amortization schedule maker",
    "amortization table generator",
    "loan amortization chart calculator",
    "mortgage amortization calculator",
    "loan payment schedule",
    "amortization chart",
    "principal interest breakdown",
    "loan repayment calculator",
    "free amortization tool",
    "printable amortization schedule",
  ],
  authors: [{ name: "FindBest Tools" }],
  openGraph: {
    title: "Free Amortization Chart Calculator & Schedule Maker",
    description:
      "Create professional loan amortization schedules with interactive charts. Calculate principal, interest, and balance for any loan type.",
    type: "website",
    url: "https://findbest.tools/finance/amortization-chart-calculator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Amortization Chart Calculator & Schedule Maker",
    description:
      "Generate detailed loan amortization tables with interactive charts. Free, fast, and accurate.",
  },
  alternates: {
    canonical: "https://findbest.tools/finance/amortization-chart-calculator",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function AmortizationCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://findbest.tools/finance/amortization-chart-calculator",
        url: "https://findbest.tools/finance/amortization-chart-calculator",
        name: "Amortization Chart Calculator | Free Loan Amortization Schedule Maker",
        description:
          "Free amortization chart calculator and amortization schedule maker. Generate detailed loan amortization tables and visualize payment breakdowns.",
        isPartOf: {
          "@id": "https://findbest.tools",
        },
        about: {
          "@type": "Thing",
          name: "Loan Amortization",
        },
      },
      {
        "@type": "SoftwareApplication",
        name: "Amortization Chart Calculator",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: [
          "Interactive amortization chart",
          "Detailed payment schedule table",
          "Principal vs interest breakdown",
          "Extra payment calculations",
          "Downloadable CSV export",
          "Multiple loan type support",
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is an amortization schedule?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "An amortization schedule is a complete table of periodic loan payments, showing the amount of principal and interest that comprise each payment until the loan is paid off at the end of its term. Our amortization schedule maker generates these tables automatically.",
            },
          },
          {
            "@type": "Question",
            name: "How do I calculate loan amortization?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Loan amortization is calculated using the formula: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ], where M is the monthly payment, P is the principal loan amount, i is the monthly interest rate, and n is the number of payments. Our loan amortization chart calculator performs these calculations instantly and displays the results in an easy-to-read table and chart.",
            },
          },
          {
            "@type": "Question",
            name: "Can I make an amortization schedule for extra payments?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, our amortization table generator supports extra payment calculations. By adding additional principal payments, you can see how much interest you'll save and how many years you'll shave off your loan term. The calculator updates the entire schedule in real-time.",
            },
          },
          {
            "@type": "Question",
            name: "Is this amortization calculator free to use?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, our amortization chart calculator is completely free to use. There are no hidden fees, no registration required, and no limits on the number of schedules you can generate. You can also download your amortization table as a CSV file at no cost.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-900 text-white">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-800/90" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="block text-blue-400">Amortization Chart</span>
                <span className="block">Calculator & Schedule Maker</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-300 sm:text-xl">
                The most accurate free{" "}
                <strong className="text-white">amortization schedule maker</strong> and{" "}
                <strong className="text-white">amortization table generator</strong>.
                Calculate your loan payments, visualize principal vs interest, and
                download professional amortization schedules in seconds.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  100% Free
                </span>
                <span className="flex items-center gap-1">
                  <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  No Sign-Up
                </span>
                <span className="flex items-center gap-1">
                  <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Instant Results
                </span>
                <span className="flex items-center gap-1">
                  <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  CSV Export
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Calculator />
        </section>

        {/* Content Section */}
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <ContentSection />
        </section>

        {/* FAQ Section */}
        <section className="bg-slate-50">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            <FAQSection />
          </div>
        </section>

        {/* Author Bio */}
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <AuthorBio />
        </section>
      </main>
    </>
  );
}
