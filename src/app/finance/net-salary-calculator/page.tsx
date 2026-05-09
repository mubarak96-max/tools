import { Metadata } from "next";
import { Calculator } from "@/components/net-salary/Calculator";
import { ContentSection } from "@/components/net-salary/ContentSection";
import { FAQSection } from "@/components/net-salary/FAQSection";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

export const metadata: Metadata = {
  title: "Net Salary Calculator 2026 | Gross to Net Salary Calculator & Net to Gross Income Calculator",
  description:
    "Free gross to net salary calculator and net to gross income calculator for 2026. Calculate net pay from gross income with federal, state, FICA taxes. Accurate paycheck estimator with hourly, weekly, biweekly, and monthly breakdowns.",
  keywords: [
    "net salary calculator",
    "gross to net salary calculator",
    "gross to net calculator",
    "net to gross income calculator",
    "calculate net pay from gross",
    "paycheck calculator",
    "take home pay calculator",
    "salary after tax calculator",
    "income tax calculator",
    "federal tax calculator",
    "hourly to salary calculator",
    "wage calculator after taxes",
    "net income estimator",
    "salary tax calculator 2026",
    "how to calculate net pay",
  ],
  authors: [{ name: "Mubarak Mutesasira" }],
  openGraph: {
    title: "Net Salary Calculator 2026 | Gross to Net & Net to Gross",
    description:
      "Calculate your exact take-home pay with our free gross to net salary calculator. Includes federal, state, and FICA tax estimates for 2026.",
    type: "website",
    url: "https://findbest.tools/finance/net-salary-calculator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Net Salary Calculator 2026 | Gross to Net Pay",
    description:
      "Accurate paycheck calculator with federal, state, and FICA taxes. Calculate net pay from gross income instantly.",
  },
  alternates: {
    canonical: "https://findbest.tools/finance/net-salary-calculator",
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

export default function NetSalaryCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://findbest.tools/finance/net-salary-calculator",
        url: "https://findbest.tools/finance/net-salary-calculator",
        name: "Net Salary Calculator 2026 | Gross to Net Salary Calculator",
        description:
          "Free gross to net salary calculator and net to gross income calculator for 2026. Calculate net pay from gross income with federal, state, FICA taxes.",
        isPartOf: { "@id": "https://findbest.tools" },
        about: { "@type": "Thing", name: "Income Tax Calculation" },
      },
      {
        "@type": "SoftwareApplication",
        name: "Net Salary Calculator",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: [
          "Gross to net salary calculation",
          "Net to gross income reverse calculation",
          "Federal tax bracket estimation",
          "State income tax calculation",
          "FICA tax computation",
          "Pay frequency breakdowns",
          "Hourly wage conversion",
          "Tax visualization charts",
          "CSV export of pay breakdown",
          "2026 tax year updated",
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How do I calculate net pay from gross salary?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "To calculate net pay from gross salary, subtract federal income tax, state income tax, FICA taxes (Social Security and Medicare), and any other deductions (health insurance, 401k, etc.) from your gross income. Our gross to net salary calculator automates this process using current 2026 tax brackets and rates.",
            },
          },
          {
            "@type": "Question",
            name: "What is the difference between gross and net income?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Gross income is your total earnings before any taxes or deductions are taken out. Net income (or take-home pay) is the amount you actually receive after all deductions. Our gross to net calculator shows exactly how much is withheld and what you keep.",
            },
          },
          {
            "@type": "Question",
            name: "Can I calculate gross income from my net pay?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, our net to gross income calculator reverses the calculation. By entering your desired net pay, filing status, state, and deductions, the calculator determines the gross salary required to achieve that take-home amount. This is useful for salary negotiation and job offer evaluation.",
            },
          },
        ],
      },
      {
        "@type": "HowTo",
        name: "How to Calculate Net Salary from Gross Income",
        step: [
          {
            "@type": "HowToStep",
            name: "Enter Gross Annual Salary",
            text: "Input your gross annual salary or hourly wage into the calculator.",
          },
          {
            "@type": "HowToStep",
            name: "Select Filing Status",
            text: "Choose your federal tax filing status: Single, Married Filing Jointly, or Head of Household.",
          },
          {
            "@type": "HowToStep",
            name: "Choose Your State",
            text: "Select your state of residence to calculate applicable state income taxes.",
          },
          {
            "@type": "HowToStep",
            name: "Add Deductions",
            text: "Enter pre-tax deductions such as 401k contributions, health insurance premiums, and HSA contributions.",
          },
          {
            "@type": "HowToStep",
            name: "Review Net Pay Breakdown",
            text: "Analyze your federal tax, state tax, FICA, and net take-home pay across multiple pay frequencies.",
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
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-800/90" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-3xl text-center">

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="block text-emerald-400">Net Salary</span>
                <span className="block">Calculator</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-300 sm:text-xl">
                The most accurate <strong className="text-white">gross to net salary calculator</strong> and{" "}
                <strong className="text-white">net to gross income calculator</strong>. Calculate net pay from gross
                income instantly with federal, state, and FICA tax estimates for 2026.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-slate-400">
                {[
                  "Federal & State Taxes",
                  "FICA Calculations",
                  "Bidirectional",
                  "Hourly & Salary",
                  "Free & Private",
                ].map((item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </span>
                ))}
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
        <section className="bg-slate-50 border-y border-slate-200">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            <FAQSection />
          </div>
        </section>

        {/* Related Tools */}
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath="/finance/net-salary-calculator" />
        </section>
      </main>
    </>
  );
}
