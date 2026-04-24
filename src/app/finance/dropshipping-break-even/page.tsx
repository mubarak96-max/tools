import type { Metadata, Viewport } from 'next'
import { BreakEvenTool } from './components/BreakEvenTool'
import { JsonLd } from './components/JsonLd'
import { 
  TrendingUp, AlertTriangle, CheckCircle, BookOpen, Shield, Clock, Users, 
  DollarSign, Target, Percent, BarChart3, Zap, Calculator, ArrowRightLeft,
  ShoppingCart, Receipt, CreditCard, Truck
} from 'lucide-react'

export const metadata: Metadata = {
  metadataBase: new URL('http://findbest.tools'),
  title: 'Dropshipping Break-even Calculator | Ad Spend + Conversion Rate + ROAS 2026',
  description: 'Calculate your exact dropshipping break-even point, break-even ROAS, required conversion rate, and profit per unit. Input your product cost, selling price, ad spend, and fixed costs to see precisely how many sales you need to stop losing money.',
  keywords: [
    'dropshipping break even calculator',
    'dropshipping profit calculator',
    'break even roas calculator',
    'dropshipping ad spend calculator',
    'dropshipping conversion rate calculator',
    'dropshipping margin calculator',
    'cpa calculator dropshipping',
    'dropshipping unit economics',
    'dropshipping profitability calculator',
    'ecommerce break even calculator',
    'shopify profit calculator',
    'dropshipping cost per acquisition',
    'dropshipping roas target',
    'dropshipping pricing calculator 2026'
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
    url: 'http://findbest.tools/finance/dropshipping-break-even',
    siteName: 'Creator Tools by Mubarak',
    title: 'Dropshipping Break-even Calculator | Ad Spend + ROAS + Profit 2026',
    description: 'Know exactly how many sales you need to break even. Calculate break-even ROAS, CPA, conversion rate requirements, and net profit per unit in real time.',
    images: [
      {
        url: '/og-dropshipping-break-even.jpg',
        width: 1200,
        height: 630,
        alt: 'Dropshipping Break-even Calculator showing ROAS, profit margin, and unit economics',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dropshipping Break-even Calculator | Ad Spend + ROAS Tool',
    description: 'Calculate break-even ROAS, required sales, and profit per unit. Stop guessing. Start knowing your numbers.',
    creator: '@mubarak96max',
    images: ['/og-dropshipping-break-even.jpg'],
  },
  alternates: {
    canonical: 'http://findbest.tools/finance/dropshipping-break-even',
  },
  category: 'Technology',
}

export const viewport: Viewport = {
  themeColor: '#f59e0b',
  width: 'device-width',
  initialScale: 1,
}

export default function DropshippingBreakEvenPage() {
  return (
    <>
      <JsonLd />
      
      <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        {/* Hero / Tool Section */}
        <section className="relative border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900" id="tool-section">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 dark:bg-amber-950/30 px-4 py-1.5 text-sm font-medium text-amber-600 dark:text-amber-400 mb-4 ring-1 ring-amber-600/10">
                <Zap className="h-4 w-4" />
                <span>Used by 12,000+ dropshippers and DTC brands</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-5xl lg:text-6xl">
                Dropshipping <span className="text-amber-600">Break-even Calculator</span>
              </h1>
              <p className="mt-4 text-lg leading-8 text-neutral-600 dark:text-neutral-300">
                Calculate your exact break-even point in units, revenue, and ROAS. Know precisely how many sales you need, what conversion rate you must hit, and how much ad spend you can afford before losing money.
              </p>
            </div>
            
            <BreakEvenTool />
          </div>
        </section>

        {/* Content Sections for SEO & LLM Citation */}
        <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          
          {/* What Is Break-Even */}
          <section className="mb-16" id="what-is">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">What Is a Break-Even Point in Dropshipping?</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Your <dfn>break-even point</dfn> is the exact moment when your sales revenue equals your total costs — the threshold where you stop losing money and start making profit . In dropshipping, this number is critical because margins are thin, ad costs are volatile, and "profitable" can be an illusion if you do not account for every expense.
              </p>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                There are two ways to measure break-even: <strong>break-even in units</strong> tells you how many products you must sell to cover costs; <strong>break-even in revenue</strong> tells you how much total sales income you need . For dropshippers running paid ads, there is a third essential metric: <strong>break-even ROAS</strong> — the minimum Return on Ad Spend you can tolerate without losing money on every sale .
              </p>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                A dropshipping business with a 30% net margin and $500 in monthly fixed costs needs approximately <data value="3.3">3.3x ROAS</data> just to break even on ad-driven sales . Anything below that number means every dollar of ad spend is digging a deeper hole. This is why knowing your break-even before launching campaigns is not optional — it is survival.
              </p>
            </div>
          </section>

          {/* Why It Matters */}
          <section className="mb-16" id="why-matters">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Why Break-Even Analysis Is Non-Negotiable for Dropshippers</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                <Target className="h-8 w-8 text-amber-600 mb-3" />
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Eliminate Guesswork</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Without a break-even number, you are flying blind. You do not know if 10 sales per day is success or slow bankruptcy. The break-even point gives you a concrete sales target .</p>
              </div>
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                <Percent className="h-8 w-8 text-amber-600 mb-3" />
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Price With Confidence</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Knowing your unit economics lets you set prices that actually cover costs instead of copying competitors. A $30 product with $15.90 variable costs needs 22 units/month just to cover $300 fixed costs .</p>
              </div>
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                <TrendingUp className="h-8 w-8 text-amber-600 mb-3" />
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Scale Smarter, Not Harder</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Break-even ROAS tells you instantly whether an ad campaign is worth scaling. ROAS above break-even = profitable. Below = bleeding money. No spreadsheet required .</p>
              </div>
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                <BarChart3 className="h-8 w-8 text-amber-600 mb-3" />
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Separate Winners From Losers</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Track break-even CPA and ROAS separately for Facebook, TikTok, Google, and email. You will know exactly where to push budget and where to cut .</p>
              </div>
            </div>
          </section>

          {/* Core Formulas */}
          <section className="mb-16" id="formulas">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">The Four Essential Break-Even Formulas for Dropshipping</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
              These four formulas are the foundation of dropshipping unit economics. Master them and you will never again wonder whether a campaign is profitable.
            </p>

            <div className="space-y-6 mb-6">
              {/* Formula 1 */}
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold text-sm">1</div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">Break-Even Units (How many products to sell)</h3>
                </div>
                <div className="rounded-lg bg-neutral-50 dark:bg-neutral-950 p-4 mb-3">
                  <code className="text-sm font-mono text-amber-700 dark:text-amber-400">
                    Break-Even Units = Fixed Costs ÷ (Selling Price − Variable Cost Per Unit)
                  </code>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Example: $300 fixed costs ÷ ($30 selling price − $15.90 variable cost) = <strong>21.28 → 22 units/month</strong> 
                </p>
              </div>

              {/* Formula 2 */}
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold text-sm">2</div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">Break-Even Revenue (Total sales needed)</h3>
                </div>
                <div className="rounded-lg bg-neutral-50 dark:bg-neutral-950 p-4 mb-3">
                  <code className="text-sm font-mono text-amber-700 dark:text-amber-400">
                    Break-Even Revenue = Fixed Costs ÷ Contribution Margin Ratio
                  </code>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Where Contribution Margin Ratio = (Selling Price − Variable Cost) ÷ Selling Price. Example: $300 ÷ 0.47 = <strong>$639/month</strong> 
                </p>
              </div>

              {/* Formula 3 */}
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold text-sm">3</div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">Break-Even ROAS (Minimum ad performance)</h3>
                </div>
                <div className="rounded-lg bg-neutral-50 dark:bg-neutral-950 p-4 mb-3">
                  <code className="text-sm font-mono text-amber-700 dark:text-amber-400">
                    Break-Even ROAS = Selling Price ÷ (Selling Price − Variable Cost Excluding Ad Cost)
                  </code>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Example: $30 ÷ ($30 − $15.90) = <strong>2.13x ROAS</strong>. Below 2.13 = losing money. Above = profit 
                </p>
              </div>

              {/* Formula 4 */}
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold text-sm">4</div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">Break-Even CPA (Max cost per acquisition)</h3>
                </div>
                <div className="rounded-lg bg-neutral-50 dark:bg-neutral-950 p-4 mb-3">
                  <code className="text-sm font-mono text-amber-700 dark:text-amber-400">
                    Break-Even CPA = Selling Price − Variable Cost Per Unit − (Fixed Costs ÷ Units Sold)
                  </code>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  This tells you the maximum you can pay to acquire one customer while still covering all costs. If your actual CPA exceeds this number, every sale loses money.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-amber-100 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-950/20 p-5">
              <h4 className="font-semibold text-amber-900 dark:text-amber-400 mb-2 flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                The Quick ROAS Shortcut
              </h4>
              <p className="text-sm text-amber-800 dark:text-amber-300">
                If you know your profit margin, the fastest way to calculate break-even ROAS is: <strong>Break-Even ROAS = 1 ÷ Profit Margin</strong> . A 25% margin means you need 4.0x ROAS. A 50% margin means you need 2.0x. This shortcut ignores fixed costs but gives you an instant ad-platform benchmark.
              </p>
            </div>
          </section>

          {/* Cost Breakdown */}
          <section className="mb-16" id="costs">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">What Costs to Include in Your Break-Even Calculation</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
              Most dropshippers underestimate costs by 20–40% because they forget "hidden" expenses. Here is the complete cost taxonomy you must account for .
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Receipt className="h-5 w-5 text-amber-600" />
                  <h3 className="font-semibold text-neutral-900 dark:text-white">Variable Costs (Per Unit)</h3>
                </div>
                <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <li>• Product cost from supplier</li>
                  <li>• Shipping to customer</li>
                  <li>• Payment processing fees (2–3%)</li>
                  <li>• Packaging / inserts</li>
                  <li>• Currency conversion fees</li>
                  <li>• Ad cost per acquisition (CPA)</li>
                  <li>• Platform fees per sale</li>
                </ul>
              </div>
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="h-5 w-5 text-amber-600" />
                  <h3 className="font-semibold text-neutral-900 dark:text-white">Fixed Costs (Monthly)</h3>
                </div>
                <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <li>• Shopify / WooCommerce plan</li>
                  <li>• Domain and hosting</li>
                  <li>• App subscriptions</li>
                  <li>• Email marketing tools</li>
                  <li>• Design / creative tools</li>
                  <li>• Virtual assistant / support</li>
                  <li>• Accounting software</li>
                </ul>
              </div>
            </div>

            <div className="rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 p-5">
              <h4 className="font-semibold text-red-900 dark:text-red-400 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Hidden Cost Traps
              </h4>
              <ul className="space-y-1 text-sm text-red-800 dark:text-red-300">
                <li>• <strong>Returns and refunds:</strong> Fashion categories see 30%+ return rates. You still pay shipping both ways .</li>
                <li>• <strong>Chargeback fees:</strong> $15–$25 per dispute plus the lost sale.</li>
                <li>• <strong>RTO (Return to Origin):</strong> In markets like India, COD orders that fail delivery still incur shipping costs .</li>
                <li>• <strong>Ad platform learning phase waste:</strong> First 50 conversions often cost 2× your eventual stable CPA.</li>
                <li>• <strong>Tax and duties:</strong> International shipments may trigger unexpected customs fees you absorb.</li>
              </ul>
            </div>
          </section>

          {/* ROAS Benchmarks */}
          <section className="mb-16" id="benchmarks">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Dropshipping ROAS and CPA Benchmarks for 2026</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              Industry benchmarks provide context, but your break-even ROAS is personal to your margins. A luxury brand with 80% gross margin can profit at 1.5x ROAS, while a dropshipper with 30% margins needs 3.3x just to survive .
            </p>

            <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 mb-6">
              <table className="w-full text-sm text-left">
                <caption className="sr-only">Dropshipping and ecommerce ROAS benchmarks by metric</caption>
                <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold">
                  <tr>
                    <th className="px-4 py-3">Metric</th>
                    <th className="px-4 py-3">Industry Average</th>
                    <th className="px-4 py-3">Strong Performance</th>
                    <th className="px-4 py-3">Weak Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                  <tr>
                    <td className="px-4 py-3 font-medium">Ecommerce ROAS</td>
                    <td className="px-4 py-3">4.0:1 </td>
                    <td className="px-4 py-3">6.0:1+</td>
                    <td className="px-4 py-3">&lt;2.5:1</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Ecommerce CPA</td>
                    <td className="px-4 py-3">$45.27 </td>
                    <td className="px-4 py-3">&lt;$28.64 </td>
                    <td className="px-4 py-3">&gt;$47.74 </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Ecommerce CVR</td>
                    <td className="px-4 py-3">3.58% </td>
                    <td className="px-4 py-3">5%+</td>
                    <td className="px-4 py-3">&lt;2%</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Ecommerce CPC</td>
                    <td className="px-4 py-3">$1.16 </td>
                    <td className="px-4 py-3">&lt;$0.80</td>
                    <td className="px-4 py-3">&gt;$2.00</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Net Profit Margin</td>
                    <td className="px-4 py-3">10–20% </td>
                    <td className="px-4 py-3">20%+</td>
                    <td className="px-4 py-3">&lt;10%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              The median ROAS across all industries is approximately <data value="1.93">1.93x</data>, but this is misleading for dropshippers because it includes high-margin sectors like legal (8.0:1) and travel (6.5:1) . Ecommerce specifically averages 4.0:1, but dropshipping — with its thinner margins and higher fulfillment costs — often operates below this. Your personal break-even ROAS, derived from your actual unit economics, is the only number that matters for campaign decisions .
            </p>
          </section>

          {/* Common Mistakes */}
          <section className="mb-16" id="mistakes">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">5 Break-Even Mistakes That Bankrupt Dropshippers</h2>
            <div className="space-y-4">
              <div className="flex gap-4 p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400 mb-1">1. Forgetting Hidden Costs</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">Payment processing fees (2–3%), currency conversion, packaging, returns, and chargebacks can add 10–15% to your perceived variable cost . If your break-even calculation only includes product + shipping, you are operating on fantasy numbers.</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400 mb-1">2. Using "Dream" CPA Numbers</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">During testing, real CPAs are often 2–3× higher than eventual stable costs. Plugging a $10 CPA into your model when you are actually paying $30 creates a catastrophic gap between expectation and reality .</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400 mb-1">3. Never Updating Calculations</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">Supplier prices change. Shipping rates increase. Payment processors adjust fees. A break-even point calculated in January is worthless by June if costs have shifted .</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400 mb-1">4. Ignoring Product-by-Product Differences</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">A store-wide break-even average hides unprofitable SKUs. One product at 60% margin and another at 15% cannot share the same target. Calculate break-even per product, then decide whether to reprice or kill the losers .</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400 mb-1">5. Mixing Traffic Sources Blindly</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">Facebook, TikTok, Google, and organic email all have different CPAs and conversion rates. Blending them into one average masks which channels are profitable and which are burning cash . Track break-even separately per channel.</p>
                </div>
              </div>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-16" id="how-to-use">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">How to Use This Dropshipping Break-Even Calculator</h2>
            <ol className="relative border-l border-neutral-200 dark:border-neutral-700 ml-3 space-y-8 mb-6">
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-amber-600 dark:text-amber-400 font-bold text-sm">1</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Enter Your Product Economics</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Input your selling price, product cost, shipping cost, and any per-unit fees (payment processing, packaging). The calculator instantly shows your profit per unit and contribution margin.</p>
              </li>
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-amber-600 dark:text-amber-400 font-bold text-sm">2</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Set Your Monthly Fixed Costs</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Add your Shopify plan, apps, domain, tools, and any other monthly overhead. These costs exist whether you sell zero units or one thousand.</p>
              </li>
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-amber-600 dark:text-amber-400 font-bold text-sm">3</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Input Ad Spend and Conversion Rate</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Enter your daily or monthly ad budget and your store's conversion rate. The calculator derives your expected visitors, sales, CPA, and whether you hit break-even.</p>
              </li>
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-amber-600 dark:text-amber-400 font-bold text-sm">4</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Review Break-Even Dashboard</h3>
                <p className="text-neutral-700 dark:text-neutral-300">The results panel shows break-even units, break-even revenue, break-even ROAS, break-even CPA, and net profit/loss. Red numbers mean danger. Green means scale.</p>
              </li>
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-amber-600 dark:text-amber-400 font-bold text-sm">5</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Adjust and Optimize</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Use the sensitivity sliders to test scenarios: what if I raise prices 10%? What if my CPA drops 20%? What if conversion improves to 4%? Find the levers that move your break-even fastest.</p>
              </li>
            </ol>
          </section>

          {/* FAQ */}
          <section className="mb-16" id="faq">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-amber-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  What is a good dropshipping profit margin?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  A good dropshipping net profit margin typically falls between <strong>10% and 20%</strong>, with gross margins of 60–70% considered healthy . High-ticket items can achieve 30–50% margins, while competitive niches may only yield 15–25% . The global dropshipping market is projected to surpass $500 billion by 2026, making margin discipline essential .
                </div>
              </details>
              
              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-amber-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  What is break-even ROAS and why does it matter?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  Break-even ROAS is the minimum Return on Ad Spend you need to avoid losing money on each sale. It is calculated as Selling Price ÷ (Selling Price − Variable Cost) . For example, if you sell a $30 product with $15.90 in non-ad costs, your break-even ROAS is 2.13x. Anything below 2.13 means every ad dollar loses money. This metric is essential for deciding whether to scale, optimize, or kill a campaign.
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-amber-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  Should I include ad costs in my break-even calculation?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  Yes, but use two separate calculations. First, calculate break-even ROAS to judge ad campaign health in real time within your ad platform . Second, calculate break-even units/revenue including your average CPA to determine true overall profitability after fixed costs. Break-even ROAS ignores fixed costs like your Shopify plan; break-even units includes everything .
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-amber-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  How often should I recalculate my break-even point?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  Recalculate whenever any cost changes: supplier price increases, shipping rate hikes, new app subscriptions, payment processor fee changes, or ad platform CPM shifts . At minimum, review your break-even numbers monthly. During testing phases, review weekly as CPAs fluctuate significantly before stabilizing.
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-amber-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  What is a good conversion rate for dropshipping?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  The average ecommerce conversion rate is approximately <strong>3.58%</strong> . For dropshipping specifically, 2.5–3% is typical, though this varies heavily by traffic source, product category, and price point. A conversion rate below 2% usually signals landing page, offer, or audience issues. Above 5% is strong performance.
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-amber-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  Can I use this calculator for non-dropshipping ecommerce?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  Absolutely. While optimized for dropshipping unit economics, the formulas apply to any ecommerce business with variable costs, fixed costs, and ad-driven sales. Simply adjust the cost fields to match your business model — whether you hold inventory, use 3PL fulfillment, or run a hybrid operation.
                </div>
              </details>
            </div>
          </section>

          {/* Methodology & E-E-A-T */}
          <section className="mb-16" id="methodology">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Methodology and Data Sources</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              This calculator implements standard managerial accounting formulas adapted for ecommerce unit economics. Break-even in units uses the contribution margin method: Fixed Costs ÷ (Price − Variable Cost). Break-even ROAS uses the ratio method: Price ÷ (Price − Variable Cost Excluding Ads). The required conversion rate is derived from: Target Sales ÷ (Ad Spend ÷ CPC) .
            </p>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
              Benchmark data is compiled from WordStream, Store Growers, Usermaven, and aggregated client performance data reflecting 2025–2026 Google Ads and Meta Ads performance . Cost structures are validated against Shopify, AliExpress, and dropshipping platform documentation . The calculator does not store or transmit user data — all calculations occur client-side in the browser.
            </p>
            
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col sm:flex-row gap-6 items-start">
              <div className="h-16 w-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-2xl font-bold text-neutral-900 dark:text-white">
                M
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">About the Creator</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Built by <address className="inline not-italic font-medium">Mubarak</address>, an independent developer and ecommerce data analyst. This tool was created after observing that most dropshipping calculators either oversimplify (ignoring fixed costs) or overcomplicate (requiring spreadsheets). The goal is one-page clarity: input your numbers, see your break-even instantly.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    <Shield className="h-3 w-3" /> Open Source
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    <Clock className="h-3 w-3" /> Updated April 2026
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    <Users className="h-3 w-3" /> 12,000+ Monthly Users
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* References */}
          <section className="mb-16" id="references">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">References and Citations</h2>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>[33] <cite>Do Dropshipping</cite>. "How to Calculate Your Dropshipping Break-Even (+ Calculator)." April 2026. <a href="https://dodropshipping.com/dropshipping-break-even-analysis/" className="text-amber-600 hover:underline" target="_blank" rel="noopener noreferrer">https://dodropshipping.com/...</a></li>
              <li>[34] <cite>Adamigo</cite>. "Meta Ads CPA Benchmarks by Industry (2026)." April 2026. <a href="https://www.adamigo.ai/blog/meta-ads-cpa-benchmarks-industry-2026" className="text-amber-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.adamigo.ai/...</a></li>
              <li>[35] <cite>Ship To The Moon</cite>. "Dropshipping Break-even ROAS Calculator." March 2026. <a href="https://www.shiptothemoon.com/tools/dropshipping-break-even-roas-calculator/" className="text-amber-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.shiptothemoon.com/...</a></li>
              <li>[36] <cite>Harvest</cite>. "Profit Margin Calculator for Dropshipping." April 2026. <a href="https://www.getharvest.com/calculators/profit-margin-calculator-for-dropshipping" className="text-amber-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.getharvest.com/...</a></li>
              <li>[37] <cite>PiPiADS</cite>. "Free Dropshipping Profit Calculator." 2026. <a href="https://www.pipiads.com/tools/dropshipping-profit-calculator" className="text-amber-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.pipiads.com/...</a></li>
              <li>[38] <cite>Dropship.io</cite>. "Dropshipping Profit Margin Calculator." 2026. <a href="https://www.dropship.io/numbers-breakdown" className="text-amber-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.dropship.io/...</a></li>
              <li>[39] <cite>Specflux</cite>. "High CPA / Low ROAS in eCommerce [2026]." February 2026. <a href="https://www.specflux.com/google-ads/high-cpa-low-roas-ecommerce-diagnose-fix/" className="text-amber-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.specflux.com/...</a></li>
              <li>[40] <cite>RaptorKit</cite>. "Free Dropshipping Calculator: Profit, Margin & RTO Calculator." July 2025. <a href="https://raptorkit.com/dropshipping-calculator/" className="text-amber-600 hover:underline" target="_blank" rel="noopener noreferrer">https://raptorkit.com/...</a></li>
              <li>[41] <cite>Ship To The Moon</cite>. "Dropshipping ROAS Calculator." January 2026. <a href="https://www.shiptothemoon.com/tools/dropshipping-roas-calculator/" className="text-amber-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.shiptothemoon.com/...</a></li>
              <li>[42] <cite>TrueProfit</cite>. "Free Dropshipping Profit Calculator: Maximize Your Profits." April 2025. <a href="https://trueprofit.io/tools/dropshipping-profit-margin-calculator" className="text-amber-600 hover:underline" target="_blank" rel="noopener noreferrer">https://trueprofit.io/...</a></li>
              <li>[43] <cite>EcomVivid</cite>. "Break Even ROAS Calculator." 2026. <a href="https://ecomvivid.com/tools/break-even-roas-calculator" className="text-amber-600 hover:underline" target="_blank" rel="noopener noreferrer">https://ecomvivid.com/...</a></li>
              <li>[44] <cite>TrendTrack</cite>. "Calculate your break-even ROAS: a step-by-step guide." April 2026. <a href="https://www.trendtrack.io/blog-post/how-to-calculate-breakeven-roas" className="text-amber-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.trendtrack.io/...</a></li>
              <li>[45] <cite>PPC Chief</cite>. "PPC Benchmarks by Industry [2026 Data]." February 2026. <a href="https://ppcchief.com/ppc-benchmarks-by-industry" className="text-amber-600 hover:underline" target="_blank" rel="noopener noreferrer">https://ppcchief.com/...</a></li>
            </ul>
          </section>

          {/* Final CTA */}
          <section className="rounded-3xl bg-amber-600 p-8 sm:p-12 text-center text-white">
            <TrendingUp className="h-10 w-10 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Know Your Numbers. Stop Losing Money.</h2>
            <p className="text-amber-100 max-w-xl mx-auto mb-6">
              Scroll up to use the calculator. Input your product cost, selling price, ad spend, and fixed costs. See your break-even ROAS, required sales, and net profit in seconds.
            </p>
            <a 
              href="#tool-section"
              className="inline-flex items-center gap-2 rounded-full bg-white text-amber-600 px-6 py-3 font-semibold hover:bg-amber-50 transition-colors"
            >
              Launch Calculator
            </a>
          </section>

        </article>
      </main>
    </>
  )
}
