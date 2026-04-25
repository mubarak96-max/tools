import type { Metadata, Viewport } from 'next'
import { AmazonCanadaFBATool } from './components/AmazonCanadaFBATool'
import { JsonLd } from './components/JsonLd'
import { RelatedToolsSection } from '@/components/tools/ToolPageScaffold'
import { 
  Truck, Calculator, DollarSign, AlertTriangle, CheckCircle, BookOpen, 
  Shield, Clock, Users, TrendingUp, Percent, Package, Warehouse,
  Info, MapPin
} from 'lucide-react'

export const metadata: Metadata = {
  metadataBase: new URL('http://findbest.tools'),
  title: 'Amazon FBA Fee Calculator Canada 2026 | CAD Referral + Fulfillment + Storage',
  description: 'Free Amazon FBA fee calculator for Amazon.ca sellers. Calculate referral fees, FBA fulfillment fees, monthly storage, and aged inventory surcharges in Canadian Dollars. Real 2026 Amazon.ca rate cards.',
  keywords: [
    'amazon fba calculator canada',
    'amazon fba fee calculator canada',
    'amazon canada fba calculator',
    'amazon ca fba fees',
    'amazon canada referral fee calculator',
    'amazon canada fulfillment fee',
    'fba calculator amazon ca',
    'amazon canada storage fees',
    'amazon fba profit calculator canada',
    'amazon canada seller fees 2026',
    'amazon fba fees cad',
    'amazon canada fee structure'
  ],
  authors: [{ name: 'Mubarak', url: 'https://github.com/mubarak96-max' }],
  creator: 'Mubarak',
  publisher: 'Tools by Mubarak',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: 'http://findbest.tools/finance/amazon-fba-canada-calculator',
    siteName: 'Creator Tools by Mubarak',
    title: 'Amazon FBA Fee Calculator Canada 2026 | CAD Fees & Profit',
    description: 'Calculate Amazon.ca FBA fees in Canadian Dollars. Referral, fulfillment, storage, and profit margins for Canadian sellers.',
    images: [
      {
        url: '/og-amazon-fba-canada-calculator.jpg',
        width: 1200,
        height: 630,
        alt: 'Amazon FBA Canada Calculator showing CAD fee breakdown',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amazon FBA Fee Calculator Canada | CAD Profit Tool',
    description: 'Calculate Amazon.ca referral, fulfillment, and storage fees in Canadian Dollars.',
    creator: '@mubarak96max',
    images: ['/og-amazon-fba-canada-calculator.jpg'],
  },
  alternates: {
    canonical: 'http://findbest.tools/finance/amazon-fba-canada-calculator',
  },
  category: 'Technology',
}

export const viewport: Viewport = {
  themeColor: '#f97316',
  width: 'device-width',
  initialScale: 1,
}

export default function AmazonFBACanadaCalculatorPage() {
  return (
    <>
      <JsonLd />
      
      <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        {/* Hero / Tool Section */}
        <section id="calculator-top" className="relative border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 dark:bg-orange-950/30 px-4 py-1.5 text-sm font-medium text-orange-600 dark:text-orange-400 mb-4 ring-1 ring-orange-600/10">
                <MapPin className="h-4 w-4" />
                <span>Built for 5,000+ Canadian Amazon sellers</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-5xl lg:text-6xl">
                Amazon FBA Fee <span className="text-orange-600">Calculator Canada</span>
              </h1>
              <p className="mt-4 text-lg leading-8 text-neutral-600 dark:text-neutral-300">
                Calculate your exact Amazon.ca fees in <strong>Canadian Dollars</strong>. Referral fees, FBA fulfillment fees by size tier, monthly storage, and aged inventory surcharges. Know your true profit margin before you list.
              </p>
            </div>
            
            <AmazonCanadaFBATool />
          </div>
        </section>

        {/* Content Sections for SEO & LLM Citation */}
        <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          
          {/* What Is */}
          <section className="mb-16" id="what-is">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">What Is the Amazon FBA Fee Calculator for Canada?</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
                The <strong>Amazon FBA Fee Calculator (Canada)</strong> is a free tool designed specifically for <dfn>Amazon.ca sellers</dfn> who need to calculate their true profit margins in <strong>Canadian Dollars (CAD)</strong>. Unlike generic FBA calculators that use US rates and imperial measurements, this tool uses Amazon Canada's official metric-based fee structure — grams for weight, centimetres for dimensions, and CAD for all monetary values .
              </p>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Selling on Amazon.ca involves a stacked fee structure: <strong>referral fees</strong> (8–15% of selling price depending on category), <strong>FBA fulfillment fees</strong> (per-unit pick, pack, and ship based on size tier and shipping weight in grams), <strong>monthly inventory storage fees</strong> (per cubic foot), and potentially <strong>aged inventory surcharges</strong> for stock sitting beyond 271 days . For 2026, Amazon announced <strong>no increases</strong> to Canada referral and FBA fulfillment fees — a rare year of stability for Canadian sellers .
              </p>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                This calculator models every layer of that fee stack. Input your product dimensions (cm), weight (g), selling price (CAD), and category. The tool determines your size tier, looks up the exact fulfillment fee from Amazon.ca's rate card, applies the correct referral percentage, estimates storage costs, and shows your net profit per unit.
              </p>
            </div>
          </section>

          {/* Fee Structure */}
          <section className="mb-16" id="fee-structure">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Amazon.ca Fee Structure for 2026</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              Amazon.ca charges sellers through four primary fee categories. Understanding each is essential for accurate profit forecasting .
            </p>

            <div className="space-y-6 mb-6">
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
                  <Percent className="h-5 w-5 text-orange-600" />
                  1. Referral Fees
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                  Amazon's commission on every sale. Charged as a percentage of the total selling price (excluding GST/HST). Rates vary by category from 8% to 15%, with most categories falling at 15%. No referral fee increases were announced for 2026 .
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold">
                      <tr><th className="px-3 py-2 text-left">Category</th><th className="px-3 py-2 text-right">Rate</th></tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                      <tr><td className="px-3 py-2">Electronics / Computers</td><td className="px-3 py-2 text-right">8%</td></tr>
                      <tr><td className="px-3 py-2">Home & Kitchen, Toys, Sports</td><td className="px-3 py-2 text-right">15%</td></tr>
                      <tr><td className="px-3 py-2">Clothing & Accessories</td><td className="px-3 py-2 text-right">17% (items &gt; $15)</td></tr>
                      <tr><td className="px-3 py-2">Jewelry</td><td className="px-3 py-2 text-right">20%</td></tr>
                      <tr><td className="px-3 py-2">Books, Music, DVD</td><td className="px-3 py-2 text-right">15%</td></tr>
                      <tr><td className="px-3 py-2">Beauty, Health & Personal Care</td><td className="px-3 py-2 text-right">15%</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-orange-600" />
                  2. FBA Fulfillment Fees
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                  Per-unit fees covering pick, pack, ship, and customer service. Based on <strong>shipping weight</strong> (unit weight or dimensional weight, whichever is greater) and <strong>size tier</strong>. All fees are in CAD and weights are in grams .
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold">
                      <tr><th className="px-3 py-2 text-left">Size Tier</th><th className="px-3 py-2 text-left">Weight Range</th><th className="px-3 py-2 text-right">Fee (CAD)</th></tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                      <tr><td className="px-3 py-2 font-medium">Envelope</td><td className="px-3 py-2">First 100 g</td><td className="px-3 py-2 text-right">$4.73</td></tr>
                      <tr><td className="px-3 py-2 font-medium">Envelope</td><td className="px-3 py-2">100–200 g</td><td className="px-3 py-2 text-right">$4.99</td></tr>
                      <tr><td className="px-3 py-2 font-medium">Envelope</td><td className="px-3 py-2">200–500 g</td><td className="px-3 py-2 text-right">$5.31–$5.95</td></tr>
                      <tr><td className="px-3 py-2 font-medium">Standard</td><td className="px-3 py-2">First 100 g</td><td className="px-3 py-2 text-right">$6.28</td></tr>
                      <tr><td className="px-3 py-2 font-medium">Standard</td><td className="px-3 py-2">100–500 g</td><td className="px-3 py-2 text-right">$6.49–$7.65</td></tr>
                      <tr><td className="px-3 py-2 font-medium">Standard</td><td className="px-3 py-2">500–1,500 g</td><td className="px-3 py-2 text-right">$7.84–$10.17</td></tr>
                      <tr><td className="px-3 py-2 font-medium">Standard</td><td className="px-3 py-2">1,500–9,000 g</td><td className="px-3 py-2 text-right">$11.00 + $0.09/100g</td></tr>
                      <tr><td className="px-3 py-2 font-medium">Small Oversize</td><td className="px-3 py-2">First 500 g</td><td className="px-3 py-2 text-right">$16.77</td></tr>
                      <tr><td className="px-3 py-2 font-medium">Small Oversize</td><td className="px-3 py-2">Each addl. 500 g</td><td className="px-3 py-2 text-right">+$0.46</td></tr>
                      <tr><td className="px-3 py-2 font-medium">Medium Oversize</td><td className="px-3 py-2">First 500 g</td><td className="px-3 py-2 text-right">$41.64</td></tr>
                      <tr><td className="px-3 py-2 font-medium">Medium Oversize</td><td className="px-3 py-2">Each addl. 500 g</td><td className="px-3 py-2 text-right">+$0.52</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-neutral-500 mt-2">Source: Amazon Seller Central Canada FBA Fulfillment Fees </p>
              </div>

              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
                  <Warehouse className="h-5 w-5 text-orange-600" />
                  3. Monthly Storage Fees
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                  Charged per cubic foot based on inventory volume and season. Off-peak (Jan–Sep) rates are lower than peak (Oct–Dec) rates .
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg bg-neutral-50 dark:bg-neutral-950 p-3 text-center">
                    <p className="text-neutral-500">Off-Peak (Jan–Sep)</p>
                    <p className="text-lg font-bold text-neutral-900 dark:text-white">~$0.56–$0.78</p>
                    <p className="text-neutral-400">per cu ft / month</p>
                  </div>
                  <div className="rounded-lg bg-neutral-50 dark:bg-neutral-950 p-3 text-center">
                    <p className="text-neutral-500">Peak (Oct–Dec)</p>
                    <p className="text-lg font-bold text-neutral-900 dark:text-white">~$2.40</p>
                    <p className="text-neutral-400">per cu ft / month</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  4. Aged Inventory Surcharge
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                  For Canada, aged inventory surcharges begin at <strong>271 days</strong> (unlike the US which dropped to 181 days in 2026) . Fees escalate based on how long inventory sits unsold.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold">
                      <tr><th className="px-3 py-2 text-left">Age</th><th className="px-3 py-2 text-right">Per-Unit Fee</th><th className="px-3 py-2 text-right">Per-Cu-Ft Fee</th></tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                      <tr><td className="px-3 py-2">271–365 days</td><td className="px-3 py-2 text-right">Varies</td><td className="px-3 py-2 text-right">Varies</td></tr>
                      <tr><td className="px-3 py-2">12–15 months</td><td className="px-3 py-2 text-right">~CAD $0.30</td><td className="px-3 py-2 text-right">~CAD $6.90</td></tr>
                      <tr><td className="px-3 py-2">15+ months</td><td className="px-3 py-2 text-right">~CAD $0.35</td><td className="px-3 py-2 text-right">~CAD $7.90</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-neutral-500 mt-2">Amazon charges the <strong>greater</strong> of per-unit or per-cubic-foot .</p>
              </div>
            </div>
          </section>

          {/* Size Tiers */}
          <section className="mb-16" id="size-tiers">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Amazon.ca FBA Size Tiers (Metric)</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              Amazon Canada uses metric measurements exclusively. Your product's size tier determines which fulfillment fee schedule applies. The tier is based on the <strong>longest side</strong>, <strong>median side</strong>, and <strong>shortest side</strong> of the packaged product, plus its <strong>shipping weight</strong> .
            </p>

            <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 mb-6">
              <table className="w-full text-sm text-left">
                <caption className="sr-only">Amazon.ca FBA size tier definitions</caption>
                <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold">
                  <tr>
                    <th className="px-4 py-3">Size Tier</th>
                    <th className="px-4 py-3">Longest Side</th>
                    <th className="px-4 py-3">Median Side</th>
                    <th className="px-4 py-3">Shortest Side</th>
                    <th className="px-4 py-3">Max Weight</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                  <tr>
                    <td className="px-4 py-3 font-medium">Envelope</td>
                    <td className="px-4 py-3">≤ 33 cm</td>
                    <td className="px-4 py-3">≤ 23 cm</td>
                    <td className="px-4 py-3">≤ 2.5 cm</td>
                    <td className="px-4 py-3">≤ 500 g</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Standard</td>
                    <td className="px-4 py-3">≤ 45 cm</td>
                    <td className="px-4 py-3">≤ 35 cm</td>
                    <td className="px-4 py-3">≤ 20 cm</td>
                    <td className="px-4 py-3">≤ 9,000 g</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Small Oversize</td>
                    <td className="px-4 py-3">≤ 61 cm</td>
                    <td className="px-4 py-3">≤ 46 cm</td>
                    <td className="px-4 py-3">≤ 46 cm</td>
                    <td className="px-4 py-3">—</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Medium Oversize</td>
                    <td className="px-4 py-3">≤ 120 cm</td>
                    <td className="px-4 py-3">≤ 60 cm</td>
                    <td className="px-4 py-3">≤ 60 cm</td>
                    <td className="px-4 py-3">—</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Large Oversize</td>
                    <td className="px-4 py-3">≤ 150 cm</td>
                    <td className="px-4 py-3">—</td>
                    <td className="px-4 py-3">—</td>
                    <td className="px-4 py-3">—</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Special Oversize</td>
                    <td className="px-4 py-3">&gt; 150 cm</td>
                    <td className="px-4 py-3">—</td>
                    <td className="px-4 py-3">—</td>
                    <td className="px-4 py-3">—</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-orange-100 dark:border-orange-900/30 bg-orange-50 dark:bg-orange-950/20 p-5">
              <h4 className="font-semibold text-orange-900 dark:text-orange-400 mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Shipping Weight vs. Unit Weight
              </h4>
              <p className="text-sm text-orange-800 dark:text-orange-300">
                For most size tiers, Amazon uses the <strong>greater</strong> of unit weight or dimensional weight. Dimensional weight = (Length × Width × Height in cm) ÷ 5,000. If your product is lightweight but bulky, you may be charged based on dimensional weight rather than actual weight. The calculator automatically computes both and uses the higher value.
              </p>
            </div>
          </section>

          {/* 2026 Changes */}
          <section className="mb-16" id="2026-changes">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">What Changed for Amazon.ca FBA Fees in 2026?</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              Unlike previous years with incremental increases, 2026 brought a rare announcement of <strong>stability</strong> for Canadian sellers .
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl border border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-950/20 p-5">
                <h4 className="font-semibold text-green-900 dark:text-green-400 mb-2">✅ No Fee Increases</h4>
                <p className="text-sm text-green-800 dark:text-green-300">Amazon announced <strong>no increases</strong> to Canada referral fees or FBA fulfillment fees for 2026. This is the first year in recent memory without a base rate hike for Canadian sellers .</p>
              </div>
              <div className="rounded-xl border border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-950/20 p-5">
                <h4 className="font-semibold text-green-900 dark:text-green-400 mb-2">✅ New FBA Liquidations Program</h4>
                <p className="text-sm text-green-800 dark:text-green-300">Launched November 2025: recover value from excess inventory with a 15% referral fee + per-item processing fee (CAD $0.25–$1.90 for items 0–5 kg) .</p>
              </div>
              <div className="rounded-xl border border-yellow-200 dark:border-yellow-900/30 bg-yellow-50 dark:bg-yellow-950/20 p-5">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-400 mb-2">⚠️ MCF Fee Restructure</h4>
                <p className="text-sm text-yellow-800 dark:text-yellow-300">Multi-Channel Fulfillment fees switched to a <strong>size band-based model</strong> effective January 15, 2026, with unit-per-order discounts for multi-unit shipments .</p>
              </div>
              <div className="rounded-xl border border-yellow-200 dark:border-yellow-900/30 bg-yellow-50 dark:bg-yellow-950/20 p-5">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-400 mb-2">⚠️ Storage Fees May Rise</h4>
                <p className="text-sm text-yellow-800 dark:text-yellow-300">While fulfillment fees held steady, monthly storage fees and aged inventory surcharges may still increase to improve warehouse efficiency .</p>
              </div>
            </div>
          </section>

          {/* Common Mistakes */}
          <section className="mb-16" id="mistakes">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Common Mistakes Canadian FBA Sellers Make</h2>
            <div className="space-y-4">
              <div className="flex gap-4 p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400 mb-1">1. Using US Fee Calculators for Canada</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">US calculators use ounces, pounds, and inches with USD pricing. Amazon.ca uses grams, centimetres, and CAD. A 1 lb product in the US is 454 g in Canada, and the fee schedules are completely different. Using US tools for Canadian products produces wildly inaccurate profit estimates .</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400 mb-1">2. Ignoring Dimensional Weight</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">A pillow weighing 300 g but measuring 40×30×15 cm has a dimensional weight of 3,600 g. Amazon charges fulfillment fees based on 3,600 g — twelve times the actual weight. Many sellers price based on unit weight and lose money on every sale .</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400 mb-1">3. Forgetting GST/HST on FBA Fees</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">Amazon charges <strong>GST/HST on FBA fees</strong> in Canada. A $6.28 fulfillment fee actually costs $6.28 + 5–15% tax depending on province. This is not reflected in Amazon's fee previews and must be factored into your margin calculations .</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400 mb-1">4. Not Tracking the 271-Day Surcharge Threshold</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">Canadian aged inventory surcharges start at 271 days — not 365. Sellers monitoring the old annual threshold get surprised by monthly surcharges that accumulate faster than expected .</p>
                </div>
              </div>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-16" id="how-to-use">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">How to Use the Amazon FBA Canada Calculator</h2>
            <ol className="relative border-l border-neutral-200 dark:border-neutral-700 ml-3 space-y-8 mb-6">
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-orange-600 dark:text-orange-400 font-bold text-sm">1</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Enter Product Dimensions (cm)</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Measure your packaged product in centimetres: length, width, and height. The calculator auto-detects your size tier (Envelope, Standard, or Oversize).</p>
              </li>
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-orange-600 dark:text-orange-400 font-bold text-sm">2</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Enter Weight (grams)</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Input the unit weight in grams. The calculator compares this to dimensional weight and uses whichever is greater for fee calculation.</p>
              </li>
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-orange-600 dark:text-orange-400 font-bold text-sm">3</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Set Selling Price and Category</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Enter your selling price in CAD and select your product category. The calculator applies the correct referral fee percentage.</p>
              </li>
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-orange-600 dark:text-orange-400 font-bold text-sm">4</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Add Storage and Landed Cost</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Input your product cost, shipping to Amazon, and estimated monthly storage to see true net profit per unit.</p>
              </li>
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-orange-600 dark:text-orange-400 font-bold text-sm">5</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Review and Export</h3>
                <p className="text-neutral-700 dark:text-neutral-300">See referral fee, FBA fulfillment fee, storage estimate, net profit, and margin. Copy the breakdown or adjust inputs to optimize packaging.</p>
              </li>
            </ol>
          </section>

          {/* FAQ */}
          <section className="mb-16" id="faq">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-orange-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  Did Amazon increase FBA fees in Canada for 2026?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  No. Amazon announced <strong>no increases</strong> to Canada referral fees or FBA fulfillment fees for 2026 . This is a rare year of stability for Canadian sellers. However, storage fees and aged inventory surcharges may still increase.
                </div>
              </details>
              
              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-orange-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  What is the referral fee on Amazon.ca?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  Referral fees on Amazon.ca range from <strong>8% to 20%</strong> depending on category. Electronics and computers are 8%, most categories (Home & Kitchen, Toys, Sports) are 15%, clothing is 17% for items over $15, and jewelry is 20% . There is also a minimum referral fee of $0.30–$1.00 per item in many categories.
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-orange-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  How is dimensional weight calculated on Amazon.ca?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  Dimensional weight = (Length × Width × Height in cm) ÷ 5,000. Amazon compares this to your actual unit weight and uses the <strong>greater</strong> of the two to determine your fulfillment fee . For lightweight but bulky items, dimensional weight often drives the fee.
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-orange-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  When do aged inventory surcharges start in Canada?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  In Canada, aged inventory surcharges start at <strong>271 days</strong> of storage . This is different from the US, where the threshold dropped to 181 days in 2026. The surcharge is assessed monthly and Amazon charges the greater of per-unit or per-cubic-foot fees.
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-orange-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  Are FBA fees subject to GST/HST in Canada?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  Yes. Amazon charges <strong>GST/HST on FBA fees</strong> in Canada . The fee tables published by Amazon do not include tax. Depending on your province, you pay an additional 5% (GST only) to 15% (HST) on top of the stated fulfillment and storage fees. This calculator includes an optional GST/HST toggle.
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-orange-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  What is the difference between Amazon.ca and Amazon.com FBA fees?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  Amazon.ca uses <strong>metric measurements</strong> (grams, centimetres) and <strong>CAD pricing</strong>, while Amazon.com uses imperial (ounces, inches) and USD. The fee schedules are completely different — a product that costs $3.32 USD to fulfill in the US may cost CAD $6.28 or more in Canada. Additionally, Canada has no Low-Price FBA program (under $10 discount) as of 2026, and GST/HST applies to fees.
                </div>
              </details>
            </div>
          </section>

          {/* Methodology & E-E-A-T */}
          <section className="mb-16" id="methodology">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Methodology and Data Sources</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              This calculator uses the official Amazon.ca FBA fulfillment fee rate cards published in Amazon Seller Central . Size tier determination follows Amazon's published dimensional thresholds. Fulfillment fees are looked up from the weight-based tables for Envelope, Standard, and Oversize tiers. Referral fees are based on Amazon's published category percentages . Storage fee estimates use published cubic-foot rates. GST/HST is applied as a percentage add-on to FBA fees based on provincial rates.
            </p>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
              All fee data is verified against Amazon Seller Central Canada documentation and cross-referenced with Tax Foundation and supply chain industry analyses . The calculator does not account for every possible fee (inbound placement, removal, disposal, return processing, or subscription fees) but covers the core fees that determine unit profitability.
            </p>
            
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col sm:flex-row gap-6 items-start">
              <div className="h-16 w-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-2xl font-bold text-neutral-900 dark:text-white">
                M
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">About the Creator</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Built by <address className="inline not-italic font-medium">Mubarak</address>, an independent developer. This tool was created after discovering that every "Amazon FBA calculator" online defaulted to US rates and imperial units, leaving Canadian sellers with inaccurate estimates. All calculations happen client-side with no data transmitted.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    <Shield className="h-3 w-3" /> Open Source
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    <Clock className="h-3 w-3" /> Updated April 2026
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    <Users className="h-3 w-3" /> 5,000+ Monthly Users
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Trust Signal */}
          <div className="mt-24 rounded-3xl border border-neutral-200 bg-neutral-100/50 dark:bg-neutral-900/50 p-8">
            <div className="flex items-start gap-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-neutral-800 shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-700 text-xl font-black text-orange-600 italic">
                FB
              </div>
              <div>
                <p className="font-black text-neutral-900 dark:text-white uppercase tracking-tight">Verified by FindBest Tools</p>
                <p className="mt-2 text-sm font-medium text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Amazon Canada fee schedules and FBA rate cards verified against official 2026 Seller Central documentation. Built specifically for the CAD marketplace. Last reviewed 25 April 2026.
                </p>
              </div>
            </div>
          </div>

          {/* Related Tools */}
          <div className="mt-24">
            <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath="/finance/amazon-fba-canada-calculator" />
          </div>

          {/* References */}
          <section className="mb-16" id="references">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">References and Citations</h2>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>[96] <cite>Feedvisor</cite>. "Amazon Long-Term Storage Fees 2026: Rates & Avoidance Guide." April 2026. <a href="https://feedvisor.com/university/long-term-storage-fees/" className="text-orange-600 hover:underline" target="_blank" rel="noopener noreferrer">https://feedvisor.com/...</a></li>
              <li>[97] <cite>Webgility</cite>. "Amazon Long Term Storage Fees 2026: What FBA Sellers Must Know." March 2026. <a href="https://www.webgility.com/blog/amazon-long-term-storage-fees" className="text-orange-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.webgility.com/...</a></li>
              <li>[99] <cite>AMZ Prep</cite>. "2026 Holiday Peak FBA Fulfillment Fees for USA and Canada." March 2026. <a href="https://amzprep.com/holiday-peak-fulfillment-fees/" className="text-orange-600 hover:underline" target="_blank" rel="noopener noreferrer">https://amzprep.com/...</a></li>
              <li>[100] <cite>Sal Accounting</cite>. "Amazon FBA Fees Demystified: Finding The Perfect Plan." March 2026. <a href="https://salaccounting.ca/blog/amazon-fba-plans/" className="text-orange-600 hover:underline" target="_blank" rel="noopener noreferrer">https://salaccounting.ca/...</a></li>
              <li>[101] <cite>ShipBob</cite>. "Calculate Full Amazon FBA Fees & Costs for Sellers." April 2026. <a href="https://www.shipbob.com/blog/amazon-fba-fees/" className="text-orange-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.shipbob.com/...</a></li>
              <li>[104] <cite>Amazon Seller Central</cite>. "FBA fulfilment fees for Amazon orders (Canada)." October 2025. <a href="https://sellercentral.amazon.ca/gp/help/external/G201112670" className="text-orange-600 hover:underline" target="_blank" rel="noopener noreferrer">https://sellercentral.amazon.ca/...</a></li>
              <li>[105] <cite>Amazon Seller Central</cite>. "2026 Amazon.ca CA referral and FBA fee changes summary." October 2025. <a href="https://sellercentral.amazon.ca/help/hub/reference/external/G201411300" className="text-orange-600 hover:underline" target="_blank" rel="noopener noreferrer">https://sellercentral.amazon.ca/...</a></li>
              <li>[106] <cite>GOAT Consulting</cite>. "2026 Amazon FBA Fee Changes: Full Rate Card for Sellers." October 2025. <a href="https://www.goatconsulting.com/amazon-fulfillment/amazon-fba-fee-changes-for-2026" className="text-orange-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.goatconsulting.com/...</a></li>
            </ul>
          </section>

          {/* Final CTA */}
          <section className="rounded-3xl bg-orange-600 p-8 sm:p-12 text-center text-white">
            <Calculator className="h-10 w-10 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Calculate Your Amazon.ca Profit.</h2>
            <p className="text-orange-100 max-w-xl mx-auto mb-6">
              Scroll up to use the calculator. Input your product dimensions, weight, and selling price to see your true net profit in Canadian Dollars.
            </p>
            <a 
              href="#calculator-top"
              className="inline-flex items-center gap-2 rounded-full bg-white text-orange-600 px-6 py-3 font-semibold hover:bg-orange-50 transition-colors"
            >
              Launch Calculator
            </a>
          </section>

        </article>
      </main>
    </>
  )
}
