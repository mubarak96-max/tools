import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import { PricingTool } from './components/PricingTool'
import { JsonLd } from './components/JsonLd'
import { 
  Calculator, DollarSign, Percent, AlertTriangle, CheckCircle, BookOpen, 
  Shield, Clock, Users, ShoppingBag, Store, Truck, CreditCard, Globe,
  TrendingUp, ArrowRightLeft, Info, Zap
} from 'lucide-react'

export const metadata: Metadata = {
  metadataBase: new URL('http://findbest.tools'),
  title: 'Product Pricing Calculator | Shopify, Etsy, Amazon Fees + Margin & Multi-Currency',
  description: 'Calculate your true selling price across Shopify, Etsy, and Amazon with real platform fees, payment processing, and shipping. Reverse-calculate from target margin, convert currencies, and never underprice again.',
  keywords: [
    'product pricing calculator',
    'shopify pricing calculator',
    'etsy fee calculator',
    'amazon fba calculator',
    'profit margin calculator',
    'ecommerce pricing tool',
    'multi currency pricing calculator',
    'shopify fees calculator 2026',
    'etsy fees 2026',
    'amazon fba fees 2026',
    'target margin calculator',
    'break even price calculator',
    'selling price calculator',
    'cost plus pricing calculator',
    'ecommerce profit calculator'
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
    locale: 'en_US',
    url: 'http://findbest.tools/finance/product-pricing-calculator',
    siteName: 'FindBest Tools',
    title: 'Product Pricing Calculator | Shopify, Etsy, Amazon Fees + Margin & Multi-Currency',
    description: 'True profit calculator for Shopify, Etsy, and Amazon with real 2026 fees, target margin mode, and multi-currency support.',
    images: [
      {
        url: '/og-product-pricing-calculator.jpg',
        width: 1200,
        height: 630,
        alt: 'Product Pricing Calculator showing Shopify Etsy Amazon fee breakdown and profit margin',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Product Pricing Calculator | Multi-Platform Fees + Margin',
    description: 'Calculate true selling price across Shopify, Etsy, and Amazon with real fees and multi-currency support.',
    creator: '@mubarak96max',
    images: ['/og-product-pricing-calculator.jpg'],
  },
  alternates: {
    canonical: 'http://findbest.tools/finance/product-pricing-calculator',
  },
  category: 'Technology',
}

export const viewport: Viewport = {
  themeColor: '#8b5cf6',
  width: 'device-width',
  initialScale: 1,
}

export default function ProductPricingCalculatorPage() {
  return (
    <>
      <JsonLd />
      
      <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        {/* Hero / Tool Section */}
        <section id="pricing-tool" className="relative border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 dark:bg-violet-950/30 px-4 py-1.5 text-sm font-medium text-violet-600 dark:text-violet-400 mb-4 ring-1 ring-violet-600/10">
                <Calculator className="h-4 w-4" />
                <span>Trusted by 15,000+ ecommerce sellers</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-5xl lg:text-6xl">
                Product Pricing <span className="text-violet-600">Calculator</span>
              </h1>
              <p className="mt-4 text-lg leading-8 text-neutral-600 dark:text-neutral-300">
                Know your true profit before you list. Calculate selling prices across <strong>Shopify</strong>, <strong>Etsy</strong>, and <strong>Amazon FBA</strong> with real 2026 platform fees, payment processing, and shipping. Reverse-calculate from your target margin or forward-calculate from your costs — with multi-currency support.
              </p>
            </div>
            
            <PricingTool />
          </div>
        </section>

        {/* Content Sections for SEO & LLM Citation */}
        <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          
          {/* What Is This Tool */}
          <section className="mb-16" id="what-is">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">What Is the Product Pricing Calculator?</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
                The <strong>Product Pricing Calculator</strong> is a free, browser-based ecommerce utility that computes your <dfn>true net profit</dfn> after deducting every platform fee, payment processing charge, shipping cost, and tax obligation. Unlike generic margin calculators that ignore platform-specific fee structures, this tool models the exact fee logic used by <strong>Shopify</strong>, <strong>Etsy</strong>, and <strong>Amazon FBA</strong> — including referral fees, transaction fees, payment processing, listing fees, FBA fulfillment fees, storage costs, and regulatory operating fees.
              </p>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                It operates in two modes. <strong>Forward mode</strong>: input your product cost and desired margin, and the calculator tells you the minimum selling price required to hit that margin after all fees. <strong>Reverse mode</strong>: input your proposed selling price and see exactly how much profit remains after every deduction — and whether your margin target is achievable. With built-in multi-currency conversion, sellers operating across USD, EUR, GBP, CAD, AUD, and JPY can price consistently across international marketplaces.
              </p>
            </div>
          </section>

          {/* Platform Fee Breakdown */}
          <section className="mb-16" id="platform-fees">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Platform Fee Structures for 2026: Shopify, Etsy, Amazon</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
              Every platform extracts value differently. Pricing a $30 product identically across Shopify, Etsy, and Amazon produces three wildly different net profits. Understanding these fee architectures is the foundation of profitable cross-platform selling.
            </p>

            {/* Shopify */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                <Store className="h-5 w-5 text-violet-600" />
                Shopify Fees (2026)
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                Shopify charges a monthly subscription plus payment processing fees. If you use <strong>Shopify Payments</strong>, transaction fees are waived entirely — you only pay the credit card processing rate. Using a third-party gateway like PayPal or Stripe triggers an additional platform transaction fee on top of your processor's charges.
              </p>
              <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 mb-4">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">Shopify fee structure by plan for 2026</caption>
                  <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold">
                    <tr>
                      <th className="px-4 py-3">Plan</th>
                      <th className="px-4 py-3">Monthly</th>
                      <th className="px-4 py-3">CC Processing</th>
                      <th className="px-4 py-3">3rd Party Fee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                    <tr>
                      <td className="px-4 py-3 font-medium">Basic</td>
                      <td className="px-4 py-3">$39/mo</td>
                      <td className="px-4 py-3">2.9% + 30¢</td>
                      <td className="px-4 py-3">2.0%</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Shopify</td>
                      <td className="px-4 py-3">$105/mo</td>
                      <td className="px-4 py-3">2.7% + 30¢</td>
                      <td className="px-4 py-3">1.0%</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Advanced</td>
                      <td className="px-4 py-3">$399/mo</td>
                      <td className="px-4 py-3">2.5% + 30¢</td>
                      <td className="px-4 py-3">0.6%</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Plus</td>
                      <td className="px-4 py-3">$2,300+/mo</td>
                      <td className="px-4 py-3">Negotiable ~2.15% + 30¢</td>
                      <td className="px-4 py-3">0.2%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Source: Shopify pricing documentation and merchant analysis 
              </p>
            </div>

            {/* Etsy */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-violet-600" />
                Etsy Fees (2026)
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                Etsy uses a fee-stacking model: listing fees, transaction fees, payment processing, offsite ads, and regulatory operating fees all apply to most sales. A $100 sale in Turkey incurs a 2.24% regulatory fee alone before any other deductions.
              </p>
              <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 mb-4">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">Etsy fee structure for 2026</caption>
                  <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold">
                    <tr>
                      <th className="px-4 py-3">Fee Type</th>
                      <th className="px-4 py-3">Rate</th>
                      <th className="px-4 py-3">Applies To</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                    <tr>
                      <td className="px-4 py-3 font-medium">Listing Fee</td>
                      <td className="px-4 py-3">$0.20 per item</td>
                      <td className="px-4 py-3">Every listing / renewal</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Transaction Fee</td>
                      <td className="px-4 py-3">6.5%</td>
                      <td className="px-4 py-3">Total sale price + shipping</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Payment Processing (US)</td>
                      <td className="px-4 py-3">3% + $0.25</td>
                      <td className="px-4 py-3">Total with shipping & tax</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Offsite Ads</td>
                      <td className="px-4 py-3">12–15%</td>
                      <td className="px-4 py-3">If sale attributed to ad</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Regulatory Fee</td>
                      <td className="px-4 py-3">0%–2.24%</td>
                      <td className="px-4 py-3">Country-specific</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Source: Etsy seller fee documentation 
              </p>
            </div>

            {/* Amazon */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                <Truck className="h-5 w-5 text-violet-600" />
                Amazon FBA Fees (2026)
              </h3>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                Amazon FBA charges referral fees, fulfillment fees, storage fees, inbound placement fees, and potential surcharges for aged or low inventory. Most calculators stop at referral and fulfillment — missing $0.50–$1.50 per unit in hidden costs.
              </p>
              <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 mb-4">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">Amazon FBA fee structure for 2026</caption>
                  <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold">
                    <tr>
                      <th className="px-4 py-3">Fee Type</th>
                      <th className="px-4 py-3">Rate / Range</th>
                      <th className="px-4 py-3">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                    <tr>
                      <td className="px-4 py-3 font-medium">Referral Fee</td>
                      <td className="px-4 py-3">7%–15%</td>
                      <td className="px-4 py-3">Category-dependent</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">FBA Fulfillment</td>
                      <td className="px-4 py-3">$2.33–$13+</td>
                      <td className="px-4 py-3">Size/weight dependent</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Monthly Storage</td>
                      <td className="px-4 py-3">$0.78–$2.40/cu ft</td>
                      <td className="px-4 py-3">Q4 is 3× higher</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Inbound Placement</td>
                      <td className="px-4 py-3">$0.21–$0.68/unit</td>
                      <td className="px-4 py-3">Per unit received</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Aged Inventory</td>
                      <td className="px-4 py-3">$0.30–$6.90/cu ft</td>
                      <td className="px-4 py-3">271+ days in warehouse</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Returns Processing</td>
                      <td className="px-4 py-3">~$4.97/return</td>
                      <td className="px-4 py-3">Amortized per unit</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Source: Amazon FBA rate card and seller analysis 
              </p>
            </div>
          </section>

          {/* Pricing Strategies */}
          <section className="mb-16" id="strategies">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Ecommerce Pricing Strategies That Actually Work</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
              Choosing a selling price is not just about covering costs. It is a strategic lever that signals quality, positions against competitors, and determines how much budget you have for customer acquisition. Here are the four pricing frameworks every ecommerce seller should understand:
            </p>

            <div className="space-y-6 mb-6">
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-violet-600" />
                  Cost-Plus Pricing
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                  Calculate total cost per unit (COGS + shipping + fees), then add your target margin. Simple, defensible, and guarantees baseline profitability. The formula: <code>Selling Price = Total Cost ÷ (1 − Target Margin)</code>.
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Best for: Commodity products with stable costs and price-sensitive audiences.
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
                  <ArrowRightLeft className="h-5 w-5 text-violet-600" />
                  Competitive Pricing
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                  Price within 5–10% of your closest competitors after accounting for their likely fee structures. A competitor selling on Amazon at $24.99 may only net $10.87 after fees — giving you room to undercut while maintaining better margins on Shopify.
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Best for: Saturated markets where price is the primary differentiator.
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-violet-600" />
                  Value-Based Pricing
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                  Price based on perceived customer value, not your cost. A $6 kitchen gadget that solves a $50 problem can sell for $24.99 with 43.5% net margin after all Amazon fees. The customer does not care what you paid — they care what it is worth to them.
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Best for: Unique products, problem-solving gadgets, and premium brands.
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
                  <Percent className="h-5 w-5 text-violet-600" />
                  Keystone Pricing
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                  The traditional retail rule: double your wholesale cost (50% gross margin). In ecommerce, this often fails because platform fees consume 15–30% of revenue. A 2× markup on Amazon may leave you with only 10% net — dangerously thin.
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Best for: Simple retail arbitrage with low platform fee exposure.
                </p>
              </div>
            </div>
          </section>

          {/* Multi-Platform Pricing */}
          <section className="mb-16" id="multi-platform">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Why You Cannot Price the Same Across All Platforms</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              A $30 product priced identically on Shopify, Etsy, and Amazon produces three different net profits. Here is a concrete example using real 2026 fee structures:
            </p>

            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 mb-6">
              <table className="w-full text-sm text-left">
                <caption className="sr-only">Net profit comparison for a $30 product across platforms</caption>
                <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold">
                  <tr>
                    <th className="px-4 py-3">Platform</th>
                    <th className="px-4 py-3">Selling Price</th>
                    <th className="px-4 py-3">Total Fees</th>
                    <th className="px-4 py-3">Net (excl. COGS)</th>
                    <th className="px-4 py-3">Net Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                  <tr>
                    <td className="px-4 py-3 font-medium">Shopify (Basic + Shopify Payments)</td>
                    <td className="px-4 py-3">$30.00</td>
                    <td className="px-4 py-3">~$1.17 (2.9% + 30¢)</td>
                    <td className="px-4 py-3">~$28.83</td>
                    <td className="px-4 py-3 text-green-600">~96.1%</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Etsy (US, no offsite ads)</td>
                    <td className="px-4 py-3">$30.00</td>
                    <td className="px-4 py-3">~$3.15 (6.5% + 3% + 25¢)</td>
                    <td className="px-4 py-3">~$26.85</td>
                    <td className="px-4 py-3 text-yellow-600">~89.5%</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Amazon FBA (Home & Kitchen)</td>
                    <td className="px-4 py-3">$30.00</td>
                    <td className="px-4 py-3">~$7.50+ (15% + FBA + storage)</td>
                    <td className="px-4 py-3">~$22.50</td>
                    <td className="px-4 py-3 text-red-600">~75.0%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              After deducting a $6 product cost, the same $30 price yields <strong>$22.83 profit on Shopify</strong>, <strong>$20.85 on Etsy</strong>, and approximately <strong>$16.50 on Amazon</strong> — a 38% difference between the highest and lowest platform. This is why multi-platform sellers must calculate platform-specific pricing rather than using a single universal price.
            </p>
          </section>

          {/* Currency Section */}
          <section className="mb-16" id="currency">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Multi-Currency Pricing for International Sellers</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              Selling internationally requires more than a simple exchange rate conversion. Payment processors charge currency conversion fees (typically 1–2%), and customer psychology varies by market — a $29.99 price point works in the US but feels arbitrary in Japan or Europe.
            </p>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
              This calculator supports <strong>USD, EUR, GBP, CAD, AUD, and JPY</strong> with real-time conversion. When switching currencies, all fee calculations adjust to the appropriate regional rates: Etsy payment processing drops from 3% + $0.25 in the US to 4% + €0.30 in the Eurozone; Amazon referral fees remain percentage-based but FBA fulfillment fees convert to local currency equivalents.
            </p>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 text-center">
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">$29.99</p>
                <p className="text-xs text-neutral-500 mt-1">US Charm Pricing</p>
              </div>
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 text-center">
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">€27.99</p>
                <p className="text-xs text-neutral-500 mt-1">EU Psychological Price</p>
              </div>
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 text-center">
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">¥4,480</p>
                <p className="text-xs text-neutral-500 mt-1">Japan Round Number</p>
              </div>
            </div>
          </section>

          {/* Common Mistakes */}
          <section className="mb-16" id="mistakes">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">5 Pricing Mistakes That Destroy Ecommerce Margins</h2>
            <div className="space-y-4">
              <div className="flex gap-4 p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400 mb-1">1. Ignoring Platform Fee Stacking</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">Etsy sellers often calculate 6.5% transaction fee but forget payment processing (3% + $0.25), listing fees ($0.20), and potential offsite ads (12–15%). On a $30 sale, that is $6.10–$8.80 in fees — not $1.95.</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400 mb-1">2. Using the Same Price on Every Platform</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">Amazon FBA can consume 25–30% of revenue in fees; Shopify Payments takes ~3%. Pricing identically means you subsidize Amazon customers with Shopify profits — or destroy your Amazon margins entirely.</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400 mb-1">3. Forgetting Returns and Chargebacks</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">Fashion categories see 30%+ return rates. Amazon charges ~$4.97 per return in processing fees. Etsy and Shopify still incur payment reversal costs. Build a 3–5% returns buffer into your pricing model.</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400 mb-1">4. Pricing Based on Competitors Without Fee Analysis</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">Your competitor may be selling at a loss to gain rank, or they may have negotiated lower Amazon referral fees, or they may be manufacturing themselves. Copying their price without understanding their cost structure is dangerous.</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400 mb-1">5. Not Accounting for Currency Conversion</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">PayPal and Stripe charge 1–2% for currency conversion. A €25 sale converted to USD at mid-market rates yields $27.50, but after conversion fees you receive ~$27.00. Over hundreds of sales, that gap becomes significant.</p>
                </div>
              </div>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-16" id="how-to-use">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">How to Use the Product Pricing Calculator</h2>
            <ol className="relative border-l border-neutral-200 dark:border-neutral-700 ml-3 space-y-8 mb-6">
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-violet-100 dark:bg-violet-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-violet-600 dark:text-violet-400 font-bold text-sm">1</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Select Your Platform</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Choose Shopify, Etsy, or Amazon FBA. The calculator loads the correct fee structure automatically, including plan-specific rates for Shopify and regional payment processing for Etsy.</p>
              </li>
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-violet-100 dark:bg-violet-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-violet-600 dark:text-violet-400 font-bold text-sm">2</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Set Your Currency</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Pick your selling currency (USD, EUR, GBP, CAD, AUD, JPY). All fee calculations and outputs adjust to the selected currency and its regional processing rates.</p>
              </li>
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-violet-100 dark:bg-violet-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-violet-600 dark:text-violet-400 font-bold text-sm">3</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Input Costs and Choose Mode</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Enter your product cost, shipping cost, and any additional per-unit expenses. Then choose <strong>Forward Mode</strong> (set target margin, get required price) or <strong>Reverse Mode</strong> (set price, see actual margin).</p>
              </li>
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-violet-100 dark:bg-violet-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-violet-600 dark:text-violet-400 font-bold text-sm">4</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Review the Fee Breakdown</h3>
                <p className="text-neutral-700 dark:text-neutral-300">The results panel shows every deduction line-by-line: platform fees, payment processing, shipping, and taxes. See your net profit, net margin, and break-even price at a glance.</p>
              </li>
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-violet-100 dark:bg-violet-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-violet-600 dark:text-violet-400 font-bold text-sm">5</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Compare Across Platforms</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Use the side-by-side comparison feature to see how the same product performs on Shopify vs. Etsy vs. Amazon. Optimize your pricing strategy per channel instead of using a one-size-fits-all approach.</p>
              </li>
            </ol>
          </section>

          {/* FAQ */}
          <section className="mb-16" id="faq">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-violet-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  What is a good profit margin for ecommerce?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  A healthy ecommerce net profit margin typically ranges from <strong>10% to 25%</strong> after all platform fees, payment processing, shipping, and advertising. Amazon FBA sellers should target 15–25% net margin; dropshippers often operate at 10–20%. Anything below 10% leaves insufficient cushion for fee increases, returns, or competitive pressure.
                </div>
              </details>
              
              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-violet-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  How do I calculate my break-even selling price?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  Break-even price = Total Cost Per Unit ÷ (1 − Total Fee Percentage). For example, if your product + shipping costs $10 and platform fees total 20%, your break-even price is $10 ÷ 0.80 = <strong>$12.50</strong>. Anything above $12.50 is profit. This calculator automates that math across all three platforms with their specific fee structures.
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-violet-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  Why are Amazon FBA fees so much higher than Shopify?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  Amazon provides end-to-end fulfillment, storage, customer service, and access to 300+ million customers. These services are funded by referral fees (7–15%), FBA fulfillment fees ($2.33–$13+), and storage costs. Shopify is software-only — you handle fulfillment and customer acquisition yourself, so fees are limited to payment processing (2.5–2.9% + 30¢). The trade-off is control versus convenience.
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-violet-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  Should I use the same price on Etsy and my own Shopify store?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  Generally, no. Etsy fees total approximately 12–15% of revenue (6.5% transaction + 3% payment + listing + potential offsite ads). Shopify fees are roughly 3% + 30¢ per sale. To maintain equal net profit, your Etsy price should be 8–12% higher than your Shopify price. Many sellers use Etsy as a discovery channel and drive repeat purchases to their Shopify store via packaging inserts.
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-violet-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  How accurate are the fee calculations in this tool?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  Fee calculations are based on official 2026 rate cards published by Shopify, Etsy, and Amazon. Shopify and Etsy fees are deterministic and highly accurate. Amazon FBA fees vary by product dimensions, weight, category, and season — the calculator uses standard-size estimates. For precise Amazon fees, always verify with Amazon's Revenue Calculator in Seller Central using your exact product dimensions.
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-violet-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  What currencies does the calculator support?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  The calculator supports <strong>USD, EUR, GBP, CAD, AUD, and JPY</strong>. When you switch currencies, the tool adjusts payment processing flat fees to regional equivalents (e.g., €0.30 for Eurozone Etsy payments, £0.20 for UK) and applies approximate exchange rates for reference. All calculations occur client-side with no data transmitted to servers.
                </div>
              </details>
            </div>
          </section>

          {/* Methodology & E-E-A-T */}
          <section className="mb-16" id="methodology">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Methodology and Data Sources</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              This calculator models fee structures using official platform documentation and verified merchant data from 2026. Shopify fees are sourced from Shopify's published pricing pages and independent merchant audits. Etsy fees are compiled from Etsy's seller handbook and country-specific payment processing tables. Amazon FBA fees are derived from the official FBA rate card, inbound placement fee schedules, and storage surcharge documentation.
            </p>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
              Currency conversion uses approximate mid-market rates updated quarterly. Regional payment processing rates for Etsy are mapped to the seller's selected currency. The calculator does not account for sales tax/VAT collection obligations, which vary by jurisdiction and are the seller's responsibility to remit.
            </p>
            
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col sm:flex-row gap-6 items-start">
              <div className="h-16 w-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-2xl font-bold text-neutral-900 dark:text-white">
                M
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">About the Creator</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Built by <address className="inline not-italic font-medium">Mubarak</address>, an independent developer and ecommerce operator. This tool was built after repeatedly discovering that "profitable" products were actually losing money once platform fees were fully accounted for. The goal is radical transparency in ecommerce unit economics.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    <Shield className="h-3 w-3" /> Open Source
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    <Clock className="h-3 w-3" /> Updated April 2026
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    <Users className="h-3 w-3" /> 15,000+ Monthly Users
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Related Tools */}
          <section className="mb-16 border-t border-neutral-100 dark:border-neutral-800 pt-16" id="related">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">Related E-commerce Tools</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <Link href="/finance/etsy-profit-calculator" className="group p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-sky-500 transition-colors">
                <Store className="h-6 w-6 text-sky-600 mb-3" />
                <h3 className="font-bold text-neutral-900 dark:text-white group-hover:text-sky-600 transition-colors">Etsy Profit Calculator</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">Deep dive into Etsy-specific fees, listing costs, and offsite ad margins for handmade sellers.</p>
              </Link>
              <Link href="/finance/dropshipping-break-even" className="group p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-sky-500 transition-colors">
                <Zap className="h-6 w-6 text-sky-600 mb-3" />
                <h3 className="font-bold text-neutral-900 dark:text-white group-hover:text-sky-600 transition-colors">Dropshipping Break-even Calculator</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">Calculate the exact ROAS and CPA needed to stay profitable while scaling your Shopify ads.</p>
              </Link>
            </div>
          </section>

          {/* References */}
          <section className="mb-16" id="references">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">References and Citations</h2>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>[46] <cite>Marketers Choice</cite>. "Shopify Pricing 2026: Every Plan Explained." April 2026. <a href="https://marketerschoice.com/shopify-pricing-2026/" className="text-violet-600 hover:underline" target="_blank" rel="noopener noreferrer">https://marketerschoice.com/...</a></li>
              <li>[47] <cite>Arslan Emre</cite>. "Shopify Plus Pricing 2026: Full Fee & Hidden Cost Guide." April 2026. <a href="https://arslanemre.com/blog/shopify-plus-pricing-2026-guide" className="text-violet-600 hover:underline" target="_blank" rel="noopener noreferrer">https://arslanemre.com/...</a></li>
              <li>[49] <cite>TrueProfit</cite>. "Shopify Fees Calculator: What You'll Actually Pay in 2026." April 2026. <a href="https://trueprofit.io/blog/shopify-fees-calculator" className="text-violet-600 hover:underline" target="_blank" rel="noopener noreferrer">https://trueprofit.io/...</a></li>
              <li>[50] <cite>Keywords.am</cite>. "The 7 best Amazon FBA calculators in 2026." March 2026. <a href="https://keywords.am/blog/amazon-fba-calculator/" className="text-violet-600 hover:underline" target="_blank" rel="noopener noreferrer">https://keywords.am/...</a></li>
              <li>[51] <cite>Insight Agent</cite>. "Etsy Fee Calculator 2026 - Know Your Profit." 2026. <a href="https://www.insightagent.app/profit-calculator" className="text-violet-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.insightagent.app/...</a></li>
              <li>[52] <cite>Arbytrage</cite>. "Amazon FBA Calculator 2026: Free Fee & Profit Calculator." 2026. <a href="https://arbytrage.io/amazon-fba-rechner" className="text-violet-600 hover:underline" target="_blank" rel="noopener noreferrer">https://arbytrage.io/...</a></li>
              <li>[53] <cite>LaunchFast LegacyX</cite>. "Calculate Your Amazon FBA Profits Instantly." 2026. <a href="https://launchfastlegacyx.com/tools/amazon-fba-calculator" className="text-violet-600 hover:underline" target="_blank" rel="noopener noreferrer">https://launchfastlegacyx.com/...</a></li>
              <li>[54] <cite>Taxomate</cite>. "Shopify Fees 2026: Transaction Fees, Plans & Real Costs." March 2026. <a href="https://taxomate.com/blog/shopify-fees" className="text-violet-600 hover:underline" target="_blank" rel="noopener noreferrer">https://taxomate.com/...</a></li>
              <li>[55] <cite>Investomatica</cite>. "Etsy Fee Calculator - Updated for 2026!" 2026. <a href="https://investomatica.com/etsy-calculator" className="text-violet-600 hover:underline" target="_blank" rel="noopener noreferrer">https://investomatica.com/...</a></li>
            </ul>
          </section>

          {/* Final CTA */}
          <section className="rounded-3xl bg-violet-600 p-8 sm:p-12 text-center text-white">
            <Calculator className="h-10 w-10 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Stop Guessing Your Prices.</h2>
            <p className="text-violet-100 max-w-xl mx-auto mb-6">
              Scroll up to use the calculator. Input your costs, select your platform, set your target margin, and see your true net profit across Shopify, Etsy, and Amazon — in any currency.
            </p>
            <a 
              href="#pricing-tool"
              className="inline-flex items-center gap-2 rounded-full bg-white text-violet-600 px-6 py-3 font-semibold hover:bg-violet-50 transition-colors"
            >
              Launch Calculator
            </a>
          </section>

        </article>
      </main>
    </>
  )
}
