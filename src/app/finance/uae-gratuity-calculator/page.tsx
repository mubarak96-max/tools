import type { Metadata } from "next";
import GratuityCalculator from "./components/GratuityCalculator";
import FAQSection from "./components/FAQSection";
import ComparisonTable from "./components/ComparisonTable";
import SchemaMarkup from "./components/SchemaMarkup";
import { Calculator, Shield, Clock, FileText, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "UAE Gratuity Calculator 2026 | Free End of Service Benefits Calculator",
  description: "Calculate your UAE end of service gratuity instantly with our free MOHRE-compliant calculator. Based on Federal Decree-Law No. 33 of 2021. Accurate for Dubai, Abu Dhabi, Sharjah & all Emirates.",
  keywords: [
    "UAE gratuity calculator",
    "end of service benefits UAE",
    "gratuity calculation UAE 2026",
    "MOHRE gratuity calculator",
    "Dubai gratuity calculator",
    "UAE labor law gratuity",
    "Federal Decree-Law No. 33 of 2021",
    "UAE end of service benefits calculator",
  ],
  alternates: {
    canonical: "https://findbest.tools/finance/uae-gratuity-calculator",
  },
  openGraph: {
    title: "UAE Gratuity Calculator 2026 | Free End of Service Benefits Calculator",
    description: "Calculate your UAE end of service gratuity instantly. MOHRE-compliant calculator based on Federal Decree-Law No. 33 of 2021.",
    url: "https://findbest.tools/finance/uae-gratuity-calculator",
    type: "website",
    images: [{ url: "/og-uae-gratuity.jpg", width: 1200, height: 630 }],
  },
};

export default function UAEGratuityPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SchemaMarkup />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-cyan-800 text-white pt-24 pb-16">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2NGgtNHpNMjAgMjBoNHY0aC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <div className="mx-auto mb-6 inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-cyan-200 ring-1 ring-white/20 backdrop-blur-sm">
            <Shield className="mr-2 h-4 w-4" />
            MOHRE-Compliant & Updated for 2026
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            UAE Gratuity Calculator
            <span className="block text-cyan-300 mt-2">2026 Edition</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100 sm:text-xl">
            Calculate your end of service benefits instantly. Free, accurate, and compliant with 
            <strong className="text-white"> Federal Decree-Law No. 33 of 2021</strong>. 
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 -mt-12 relative z-10">
        <GratuityCalculator />
      </section>

      {/* Trust Indicators */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: Shield, label: "MOHRE Compliant", desc: "Federal Law Verified" },
            { icon: Clock, label: "Instant Results", desc: "Real-time Calculation" },
            { icon: FileText, label: "Detailed Breakdown", desc: "Step-by-Step Formula" },
            { icon: Users, label: "10,000+ Users", desc: "Trusted Monthly" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-slate-200">
              <item.icon className="h-8 w-8 text-blue-600 mb-2" />
              <span className="font-semibold text-slate-900">{item.label}</span>
              <span className="text-sm text-slate-500">{item.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <article className="mx-auto max-w-4xl px-4 py-16">
        <div className="prose prose-lg prose-slate mx-auto max-w-none">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Understanding UAE Gratuity: The Complete 2026 Guide to End of Service Benefits
          </h2>
          
          <p className="text-slate-600 leading-relaxed">
            Are you planning to leave your job in the United Arab Emirates and wondering how much gratuity you are entitled to receive? 
            The <strong>UAE gratuity calculator</strong> is an essential tool for every expatriate employee working in Dubai, Abu Dhabi, Sharjah, 
            or any other Emirate. Under the <strong>Federal Decree-Law No. 33 of 2021</strong> on the Regulation of Labour Relations, 
            every private-sector employee who completes at least one year of continuous service is legally entitled to end of service benefits.
          </p>

          <h3 className="text-2xl font-bold text-slate-900 mt-10 mb-4">
            What is Gratuity in the UAE?
          </h3>
          
          <p className="text-slate-600 leading-relaxed">
            Gratuity, also referred to as <strong>end of service benefits (EOSB)</strong>, is a statutory lump-sum payment that employers must provide 
            to eligible employees upon termination of employment. Unlike a discretionary bonus, gratuity is a <strong>legal right</strong> enshrined 
            in UAE labour law. It serves as a financial safety net, rewarding employees for their years of dedicated service.
          </p>

          <h3 className="text-2xl font-bold text-slate-900 mt-10 mb-4">
            How to Calculate Gratuity in UAE: The Official Formula
          </h3>

          <div className="my-8 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 p-6 ring-1 ring-blue-100">
            <h4 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
              <Calculator className="mr-2 h-5 w-5" />
              UAE Gratuity Calculation Formula (2026)
            </h4>
            <div className="space-y-3 font-mono text-sm text-blue-800">
              <p><strong>Step 1:</strong> Daily Wage = Basic Monthly Salary ÷ 30</p>
              <p><strong>Step 2:</strong> For Years 1-5: Gratuity = 21 days × Daily Wage × Number of Years</p>
              <p><strong>Step 3:</strong> For Years 5+: Gratuity = 30 days × Daily Wage × Number of Years Beyond 5</p>
              <p><strong>Step 4:</strong> Total Gratuity = Sum of Step 2 and Step 3</p>
              <p><strong>Step 5:</strong> Apply Cap: Total cannot exceed 2 years of basic salary (Basic × 24)</p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-slate-900 mt-10 mb-4">
            Key Changes in UAE Gratuity Law: 2021 Reform
          </h3>

          <p className="text-slate-600 leading-relaxed">
            The <strong>new UAE gratuity law</strong> introduced through Federal Decree-Law No. 33 of 2021, effective from February 2, 2022, 
            brought significant changes. One of the most important updates is that <strong>resignation no longer reduces your gratuity entitlement</strong>, 
            which was a common issue under the old unlimited contract rules.
          </p>

          <div className="my-6 overflow-hidden rounded-xl ring-1 ring-slate-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 text-slate-900 font-semibold">
                <tr>
                  <th className="px-4 py-3">Aspect</th>
                  <th className="px-4 py-3">Old Law (Before 2022)</th>
                  <th className="px-4 py-3">New Law (2022 onwards)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                <tr>
                  <td className="px-4 py-3 font-medium">Contract Types</td>
                  <td className="px-4 py-3 text-slate-600">Limited & Unlimited contracts</td>
                  <td className="px-4 py-3 text-slate-600">Only limited-term contracts</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Resignation Penalty</td>
                  <td className="px-4 py-3 text-slate-600">Reductions applied for early exit</td>
                  <td className="px-4 py-3 text-green-700 font-semibold">No reduction. Full gratuity</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Payment Deadline</td>
                  <td className="px-4 py-3 text-slate-600">No strict deadline</td>
                  <td className="px-4 py-3 text-slate-600">Paid within <strong>14 days</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </article>

      {/* Comparison Section */}
      <section className="mx-auto max-w-4xl px-4 py-8">
        <ComparisonTable />
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-4xl px-4 py-8">
        <FAQSection />
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 to-cyan-800 px-6 py-12 text-center text-white">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Calculate Your UAE Gratuity Now
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-blue-100">
            Use our free, MOHRE-compliant calculator above to get your accurate end of service benefits estimate in seconds. 
          </p>
          <div className="mt-8 flex justify-center">
            <a 
              href="#calculator" 
              className="inline-flex items-center rounded-xl bg-white px-6 py-3 text-base font-semibold text-blue-900 shadow-lg hover:bg-blue-50 transition-colors"
            >
              <Calculator className="mr-2 h-5 w-5" />
              Start Calculating
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
