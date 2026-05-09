import { Metadata } from "next";
import { Calculator } from "@/components/crypto-mining/Calculator";
import { ContentSection } from "@/components/crypto-mining/ContentSection";
import { FAQSection } from "@/components/crypto-mining/FAQSection";
import { AuthorBio } from "@/components/crypto-mining/AuthorBio";

export const metadata: Metadata = {
  title: "Crypto Mining Calculator 2026 | Bitcoin & GPU Mining Profitability Calculator",
  description:
    "Free crypto mining calculator for Bitcoin, Ethereum, and altcoins. Calculate GPU mining profitability, ASIC mining ROI, electricity costs, and daily/monthly mining revenue. Most accurate cryptocurrency mining estimator with real-time projections.",
  keywords: [
    "crypto mining calculator",
    "bitcoin mining profitability calculator",
    "gpu mining calculator",
    "asic mining calculator",
    "cryptocurrency mining estimator",
    "mining profit calculator",
    "crypto mining roi calculator",
    "ethereum mining calculator",
    "bitcoin mining profit",
    "mining revenue calculator",
    "crypto mining electricity cost calculator",
    "gpu mining profitability",
    "bitcoin mining break even calculator",
    "cryptocurrency mining return calculator",
    "best mining calculator 2026",
  ],
  authors: [{ name: "Mubarak Mutesasira" }],
  openGraph: {
    title: "Crypto Mining Calculator 2026 | BTC & GPU Profitability",
    description:
      "Calculate exact mining profits for Bitcoin, Ethereum, and GPU rigs. Factor electricity, hardware, pool fees, and difficulty adjustments.",
    type: "website",
    url: "https://findbest.tools/finance/crypto-mining-calculator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Crypto Mining Profitability Calculator 2026",
    description:
      "Accurate Bitcoin & GPU mining calculator with ROI projections, electricity costs, and difficulty adjustments.",
  },
  alternates: {
    canonical: "https://findbest.tools/finance/crypto-mining-calculator",
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

export default function CryptoMiningCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://findbest.tools/finance/crypto-mining-calculator",
        url: "https://findbest.tools/finance/crypto-mining-calculator",
        name: "Crypto Mining Calculator 2026 | Bitcoin & GPU Mining Profitability Calculator",
        description:
          "Free crypto mining calculator for Bitcoin, Ethereum, and altcoins. Calculate GPU mining profitability, ASIC mining ROI, and electricity costs.",
        isPartOf: { "@id": "https://findbest.tools" },
        about: { "@type": "Thing", name: "Cryptocurrency Mining" },
      },
      {
        "@type": "SoftwareApplication",
        name: "Crypto Mining Profitability Calculator",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: [
          "Bitcoin mining profitability calculation",
          "GPU mining calculator for Ethereum and altcoins",
          "ASIC mining ROI projections",
          "Electricity cost analysis by region",
          "Difficulty adjustment modeling",
          "Hardware depreciation tracking",
          "Pool fee calculations",
          "Daily, monthly, and yearly profit projections",
          "Break-even analysis",
          "CSV export of mining projections",
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How is crypto mining profitability calculated?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Crypto mining profitability is calculated by subtracting your total costs (electricity, hardware, pool fees) from your mining revenue. Revenue depends on your hash rate, the network difficulty, block reward, and current cryptocurrency price. Our crypto mining calculator automates these calculations using real-time market data and network parameters.",
            },
          },
          {
            "@type": "Question",
            name: "Is Bitcoin mining still profitable in 2026?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Bitcoin mining profitability in 2026 depends on your electricity costs, hardware efficiency, and Bitcoin's market price. With modern ASIC miners and electricity under $0.10/kWh, mining remains profitable for many operations. Our Bitcoin mining profitability calculator helps you determine exact returns based on your specific circumstances.",
            },
          },
          {
            "@type": "Question",
            name: "What is the best GPU for mining in 2026?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The best GPUs for mining balance hash rate, power consumption, and purchase price. High-efficiency cards like the NVIDIA RTX 4090 and AMD RX 7900 XTX offer strong performance per watt. Our GPU mining calculator includes preset configurations for popular mining GPUs to simplify profitability analysis.",
            },
          },
          {
            "@type": "Question",
            name: "How do electricity costs affect mining profitability?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Electricity is typically the largest ongoing cost in cryptocurrency mining. At $0.15/kWh, an ASIC miner consuming 3,000W costs $324 monthly just in electricity. Our crypto mining calculator includes regional electricity rate presets and shows exactly how power costs impact your net profit and ROI timeline.",
            },
          },
        ],
      },
      {
        "@type": "HowTo",
        name: "How to Calculate Crypto Mining Profitability",
        step: [
          {
            "@type": "HowToStep",
            name: "Select Your Mining Hardware",
            text: "Choose between ASIC miners for Bitcoin or GPUs for altcoins. Enter your hash rate and power consumption, or select from our preset hardware configurations.",
          },
          {
            "@type": "HowToStep",
            name: "Enter Electricity Costs",
            text: "Input your local electricity rate per kWh. Use our regional presets for accurate estimates based on your location.",
          },
          {
            "@type": "HowToStep",
            name: "Configure Pool and Fees",
            text: "Add your mining pool fee percentage and any hardware purchase costs to calculate true ROI.",
          },
          {
            "@type": "HowToStep",
            name: "Review Profit Projections",
            text: "Analyze daily, monthly, and yearly revenue, costs, and net profit. Review the break-even timeline and download your projections.",
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
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pb-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/40 via-slate-950 to-slate-950" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-3xl text-center">

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                  Crypto Mining
                </span>
                <span className="block text-white">Profitability Calculator</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-300 sm:text-xl">
                The most accurate <strong className="text-white">crypto mining calculator</strong> for Bitcoin, Ethereum, and GPU altcoin mining. Calculate exact profits, ROI timelines, electricity costs, and break-even points for any mining rig configuration.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-slate-400">
                {[
                  "BTC & Altcoin Support",
                  "GPU & ASIC Presets",
                  "Real-Time Projections",
                  "ROI Break-Even Analysis",
                  "CSV Export",
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
        <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Calculator />
        </section>

        {/* Content Section */}
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <ContentSection />
        </section>

        {/* FAQ Section */}
        <section className="bg-slate-900/50 border-y border-slate-800">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            <FAQSection />
          </div>
        </section>

        {/* Related Tools */}
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 border-t border-slate-800">
          <h2 className="text-2xl font-bold text-white mb-8">Related Financial Tools</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { name: "Rule of 72 Calculator", href: "/finance/rule-of-72-calculator", desc: "Estimate investment doubling time." },
              { name: "Compound Interest Calculator", href: "/finance/compound-interest-calculator", desc: "Calculate long-term growth." },
              { name: "Break Even Calculator", href: "/finance/break-even-calculator", desc: "Find your business break-even point." },
              { name: "Currency Converter", href: "/finance/product-pricing-calculator", desc: "Check real-time exchange rates." },
            ].map((tool) => (
              <a
                key={tool.href}
                href={tool.href}
                className="group block rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-emerald-500/50 hover:bg-slate-800"
              >
                <h3 className="font-semibold text-white group-hover:text-emerald-400">{tool.name}</h3>
                <p className="mt-1 text-sm text-slate-400">{tool.desc}</p>
              </a>
            ))}
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
