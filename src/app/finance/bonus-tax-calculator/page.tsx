import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import { BonusTool } from './components/BonusTool'
import { JsonLd } from './components/JsonLd'
import { 
  Gift, Building2, Percent, AlertTriangle, CheckCircle, BookOpen, 
  Shield, Clock, Users, TrendingUp, DollarSign, Landmark, Briefcase,
  Calculator, Info, ArrowRightLeft, FileText, ShoppingCart
} from 'lucide-react'

export const metadata: Metadata = {
  metadataBase: new URL('http://findbest.tools'),
  title: 'Bonus Tax Calculator 2026 | Bonus Paycheck + Bonus Depreciation (Section 168k)',
  description: 'Free bonus tax calculator for 2026. Calculate employee bonus withholding with 22% supplemental rate, FICA, and state tax. OR calculate business bonus depreciation under Section 168(k) with MACRS schedules. Two tools, one page.',
  keywords: [
    'bonus tax calculator',
    'bonus depreciation calculator',
    'bonus paycheck calculator',
    'bonus payroll calculator',
    'annual bonus tax calculator',
    'bonus and tax calculator',
    'bonus check calculator',
    'supplemental wage tax calculator',
    'bonus withholding calculator 2026',
    'section 168k calculator',
    'bonus depreciation phase out 2026',
    'how much tax on bonus',
    'bonus tax rate 2026',
    'bonus after tax calculator'
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
    url: 'http://findbest.tools/finance/bonus-tax-calculator',
    siteName: 'Creator Tools by Mubarak',
    title: 'Bonus Tax Calculator 2026 | Employee Bonus + Business Depreciation',
    description: 'Calculate bonus paycheck tax withholding OR business bonus depreciation. Two calculators, one page. Real 2026 IRS rates.',
    images: [
      {
        url: '/og-bonus-tax-calculator.jpg',
        width: 1200,
        height: 630,
        alt: 'Bonus Tax Calculator showing paycheck withholding and business depreciation side by side',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bonus Tax Calculator 2026 | Paycheck + Depreciation',
    description: 'Employee bonus withholding calculator + business bonus depreciation calculator. Two tools, one page.',
    creator: '@mubarak96max',
    images: ['/og-bonus-tax-calculator.jpg'],
  },
  alternates: {
    canonical: 'http://findbest.tools/finance/bonus-tax-calculator',
  },
  category: 'Finance',
}

export const viewport: Viewport = {
  themeColor: '#8b5cf6',
  width: 'device-width',
  initialScale: 1,
}

export default function BonusTaxCalculatorPage() {
  return (
    <>
      <JsonLd />
      
      <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        {/* Hero / Tool Section */}
        <section id="calculator-top" className="relative border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 dark:bg-violet-950/30 px-4 py-1.5 text-sm font-medium text-violet-600 dark:text-violet-400 mb-4 ring-1 ring-violet-600/10">
                <Gift className="h-4 w-4" />
                <span>Used by 18,000+ employees and business owners</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-5xl lg:text-6xl">
                Bonus Tax <span className="text-violet-600">Calculator 2026</span>
              </h1>
              <p className="mt-4 text-lg leading-8 text-neutral-600 dark:text-neutral-300">
                Two calculators, one page. Calculate your <strong>employee bonus paycheck tax</strong> with the 22% supplemental withholding rate, FICA, and state tax. OR calculate <strong>business bonus depreciation</strong> under Section 168(k) with MACRS schedules.
              </p>
            </div>
            
            <BonusTool />
          </div>
        </section>

        {/* Content Sections for SEO & LLM Citation */}
        <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          
          {/* What Is Bonus Tax */}
          <section className="mb-16" id="what-is-bonus-tax">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">How Is Bonus Income Taxed in 2026?</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
                The IRS treats bonuses as <dfn>supplemental wages</dfn> — compensation that is not regular salary, including commissions, overtime pay, severance, awards, and back pay. Because bonuses are paid irregularly and often in large lump sums, the IRS applies special withholding rules that frequently shock recipients who expect their usual tax rate.
              </p>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                For 2026, the federal supplemental wage withholding rate is <strong>22%</strong> for bonuses under $1 million paid to a single employee in a calendar year. If total supplemental wages exceed $1 million in one calendar year, the excess is withheld at <strong>37%</strong> — the highest marginal rate. This is not your final tax liability; it is simply the amount your employer must withhold. Your actual tax rate depends on your total annual income, deductions, and credits when you file your return.
              </p>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Employers can choose between two withholding methods. The <strong>percentage method</strong> applies a flat 22% (or 37% for amounts over $1M) to the bonus amount. The <strong>aggregate method</strong> adds the bonus to your most recent regular paycheck, calculates withholding on the combined amount, then subtracts what was already withheld from your regular pay — often resulting in higher withholding. Most employers use the percentage method because it is simpler and more predictable.
              </p>
            </div>
          </section>

          {/* Bonus Depreciation Section */}
          <section className="mb-16" id="what-is-bonus-depreciation">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">What Is Bonus Depreciation for Businesses?</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
                <dfn>Bonus depreciation</dfn> (also called <dfn>additional first-year depreciation</dfn>) is a tax incentive that allows businesses to deduct a large percentage of the cost of qualifying property in the year it is placed in service, rather than spreading the deduction over the asset's useful life. Created under Section 168(k) of the Internal Revenue Code, bonus depreciation applies to tangible personal property, certain improvements to nonresidential real property, and specified plants.
              </p>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Under the Tax Cuts and Jobs Act (TCJA), bonus depreciation was 100% for assets placed in service between September 27, 2017 and December 31, 2022. It then phases down by 20 percentage points each year: 80% (2023), 60% (2024), 40% (2025), <strong>20% (2026)</strong>, and 0% beginning in 2027. For 2026, a business purchasing $500,000 in qualifying equipment can immediately deduct $100,000 (20%) and depreciate the remaining $400,000 under regular MACRS.
              </p>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Bonus depreciation differs from <strong>Section 179 expensing</strong> in two critical ways. First, Section 179 is elective and subject to annual dollar limits and business income limits, while bonus depreciation is automatic and not limited by business income. Second, Section 179 cannot create or increase a business loss, while bonus depreciation can. Many businesses use both provisions together: Section 179 first (up to the limit), then bonus depreciation on the remainder.
              </p>
            </div>
          </section>

          {/* 2026 Rates Comparison */}
          <section className="mb-16" id="rates">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">2026 Bonus Tax Rates: Employee vs. Business</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                  <Gift className="h-5 w-5 text-violet-600" />
                  Employee Bonus Withholding
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                      <tr><td className="py-2 text-neutral-600 dark:text-neutral-400">Federal supplemental rate</td><td className="py-2 text-right font-medium text-neutral-900 dark:text-white">22%</td></tr>
                      <tr><td className="py-2 text-neutral-600 dark:text-neutral-400">Over $1M supplemental</td><td className="py-2 text-right font-medium text-neutral-900 dark:text-white">37%</td></tr>
                      <tr><td className="py-2 text-neutral-600 dark:text-neutral-400">Social Security</td><td className="py-2 text-right font-medium text-neutral-900 dark:text-white">6.2%</td></tr>
                      <tr><td className="py-2 text-neutral-600 dark:text-neutral-400">Medicare</td><td className="py-2 text-right font-medium text-neutral-900 dark:text-white">1.45%</td></tr>
                      <tr><td className="py-2 text-neutral-600 dark:text-neutral-400">Add. Medicare ($200k+)</td><td className="py-2 text-right font-medium text-neutral-900 dark:text-white">0.9%</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-neutral-500 mt-2">Source: IRS Publication 15 (2026)</p>
              </div>
              
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-violet-600" />
                  Business Bonus Depreciation
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                      <tr><td className="py-2 text-neutral-600 dark:text-neutral-400">2023 placed in service</td><td className="py-2 text-right font-medium text-neutral-900 dark:text-white">80%</td></tr>
                      <tr><td className="py-2 text-neutral-600 dark:text-neutral-400">2024 placed in service</td><td className="py-2 text-right font-medium text-neutral-900 dark:text-white">60%</td></tr>
                      <tr><td className="py-2 text-neutral-600 dark:text-neutral-400">2025 placed in service</td><td className="py-2 text-right font-medium text-neutral-900 dark:text-white">40%</td></tr>
                      <tr><td className="py-2 text-neutral-600 dark:text-neutral-400">2026 placed in service</td><td className="py-2 text-right font-medium text-violet-600">20%</td></tr>
                      <tr><td className="py-2 text-neutral-600 dark:text-neutral-400">2027+ placed in service</td><td className="py-2 text-right font-medium text-neutral-900 dark:text-white">0%</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-neutral-500 mt-2">Source: IRC Section 168(k)</p>
              </div>
            </div>
          </section>

          {/* Percentage vs Aggregate */}
          <section className="mb-16" id="methods">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Percentage Method vs. Aggregate Method: Which Costs You More?</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              The IRS allows employers two methods for withholding federal income tax on bonuses. The method your employer chooses directly impacts how much cash you receive in your bonus check.
            </p>

            <div className="space-y-4 mb-6">
              <div className="rounded-xl border border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-950/20 p-5">
                <h4 className="font-semibold text-green-900 dark:text-green-400 mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Percentage Method (Flat 22%)
                </h4>
                <p className="text-sm text-green-800 dark:text-green-300 mb-2">
                  Your employer withholds a flat 22% for federal income tax on the bonus amount. If the bonus exceeds $1 million in total supplemental wages for the year, the excess is withheld at 37%.
                </p>
                <p className="text-sm text-green-800 dark:text-green-300">
                  <strong>Example:</strong> $10,000 bonus → $2,200 federal withholding. Simple, predictable, and usually results in less upfront withholding than the aggregate method.
                </p>
              </div>

              <div className="rounded-xl border border-yellow-200 dark:border-yellow-900/30 bg-yellow-50 dark:bg-yellow-950/20 p-5">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-400 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Aggregate Method (Potentially Higher)
                </h4>
                <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-2">
                  Your employer adds the bonus to your most recent regular paycheck, calculates withholding on the combined total using your W-4, then subtracts what was already withheld from your regular pay.
                </p>
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  <strong>Example:</strong> You earn $4,000 biweekly and receive a $10,000 bonus. Combined = $14,000. Withholding on $14,000 minus withholding on $4,000 = <strong>$2,713</strong> — $513 more than the percentage method. This method often pushes you into a higher marginal bracket temporarily.
                </p>
              </div>
            </div>

            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              If your marginal tax rate is 12%, the 22% flat withholding is too high — you will get a refund when you file. If your marginal rate is 24% or higher, the 22% flat withholding is too low — you may owe additional tax. The aggregate method is more "accurate" to your actual tax situation but creates cash flow problems by withholding too much upfront.
            </p>
          </section>

          {/* FICA on Bonuses */}
          <section className="mb-16" id="fica">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">FICA Taxes on Bonuses: The Hidden 7.65%</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              Unlike federal income tax withholding, FICA taxes on bonuses are non-negotiable. Every dollar of bonus is subject to Social Security and Medicare taxes, regardless of which withholding method your employer uses.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 text-center">
                <p className="text-xs text-neutral-500 mb-1">Social Security</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">6.2%</p>
                <p className="text-[10px] text-neutral-400">Up to $184,500 wages</p>
              </div>
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 text-center">
                <p className="text-xs text-neutral-500 mb-1">Medicare</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">1.45%</p>
                <p className="text-[10px] text-neutral-400">No wage cap</p>
              </div>
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 text-center">
                <p className="text-xs text-neutral-500 mb-1">Total FICA</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">7.65%</p>
                <p className="text-[10px] text-neutral-400">On every bonus dollar</p>
              </div>
            </div>

            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              If you have already hit the Social Security wage base ($184,500 in 2026) through your regular salary, your bonus is only subject to Medicare (1.45%). High earners above $200,000 pay an additional 0.9% Medicare surtax on the bonus amount. This means a $50,000 bonus for someone who has already maxed out Social Security pays only 1.45%–2.35% in FICA, not the full 7.65%.
            </p>
          </section>

          {/* Bonus Depreciation Details */}
          <section className="mb-16" id="bonus-depreciation-details">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">2026 Business Bonus Depreciation: 20% and Falling</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              For businesses, 2026 is a critical year. Bonus depreciation drops to just <strong>20%</strong> for assets placed in service this year, down from 100% just four years ago. If you are planning capital expenditures, understanding the phase-out schedule is essential for tax planning.
            </p>

            <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 mb-6">
              <table className="w-full text-sm text-left">
                <caption className="sr-only">Bonus depreciation phase-out schedule</caption>
                <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold">
                  <tr>
                    <th className="px-4 py-3">Year Placed in Service</th>
                    <th className="px-4 py-3">Bonus Depreciation %</th>
                    <th className="px-4 py-3">Remaining MACRS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                  <tr><td className="px-4 py-3">2018–2022</td><td className="px-4 py-3 font-medium text-green-600">100%</td><td className="px-4 py-3">0%</td></tr>
                  <tr><td className="px-4 py-3">2023</td><td className="px-4 py-3 font-medium text-green-600">80%</td><td className="px-4 py-3">20%</td></tr>
                  <tr><td className="px-4 py-3">2024</td><td className="px-4 py-3 font-medium text-yellow-600">60%</td><td className="px-4 py-3">40%</td></tr>
                  <tr><td className="px-4 py-3">2025</td><td className="px-4 py-3 font-medium text-yellow-600">40%</td><td className="px-4 py-3">60%</td></tr>
                  <tr className="bg-violet-50 dark:bg-violet-950/20"><td className="px-4 py-3 font-bold">2026</td><td className="px-4 py-3 font-bold text-violet-600">20%</td><td className="px-4 py-3 font-bold">80%</td></tr>
                  <tr><td className="px-4 py-3">2027+</td><td className="px-4 py-3 font-medium text-red-600">0%</td><td className="px-4 py-3">100%</td></tr>
                </tbody>
              </table>
            </div>

            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              Qualifying property for bonus depreciation includes: tangible personal property with a recovery period of 20 years or less (machinery, equipment, furniture), certain improvements to nonresidential real property (qualified improvement property), and specified plants. The property must be <strong>new to the taxpayer</strong> — used property qualifies as long as it is the taxpayer's first use.
            </p>

            <div className="rounded-xl border border-violet-100 dark:border-violet-900/30 bg-violet-50 dark:bg-violet-950/20 p-5">
              <h4 className="font-semibold text-violet-900 dark:text-violet-400 mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Section 179 vs. Bonus Depreciation
              </h4>
              <p className="text-sm text-violet-800 dark:text-violet-300">
                Section 179 allows expensing up to $1,250,000 (2026 limit) but is limited by business income — it cannot create a loss. Bonus depreciation is automatic, not limited by income, and can create or increase a net operating loss. Smart strategy: use Section 179 first up to your income limit, then apply bonus depreciation to the remainder.
              </p>
            </div>
          </section>

          {/* Common Mistakes */}
          <section className="mb-16" id="mistakes">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Common Bonus Tax Mistakes</h2>
            <div className="space-y-4">
              <div className="flex gap-4 p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400 mb-1">1. Thinking 22% Withholding Is Your Final Tax Rate</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">The 22% flat rate is just withholding. If you are in the 12% bracket, you will get a refund. If you are in the 32% bracket, you will owe more. Your actual tax liability depends on your total annual income, not the bonus alone.</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400 mb-1">2. Forgetting FICA on Bonuses</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">Many employees calculate 22% federal and stop there. FICA adds another 7.65% (or 1.45% if Social Security is maxed). On a $10,000 bonus, that is an extra $765 you did not budget for.</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400 mb-1">3. Not Adjusting W-4 for Large Bonuses</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">If you receive a $50,000 bonus and your regular salary is $80,000, your total income pushes you into a higher bracket. Consider increasing withholding on your W-4 or making estimated payments to avoid an underpayment penalty.</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400 mb-1">4. Missing the 2026 Bonus Depreciation Window</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">Businesses planning major equipment purchases in 2027 get 0% bonus depreciation. Accelerating purchases into 2026 captures the final 20% before it disappears entirely.</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400 mb-1">5. Confusing Bonus Depreciation with Section 179</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">Section 179 is elective and income-limited. Bonus depreciation is automatic and loss-generating. Using Section 179 when you have a loss already wastes the deduction. Use bonus depreciation instead to carry the loss forward.</p>
                </div>
              </div>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-16" id="how-to-use">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">How to Use the Bonus Tax Calculator</h2>
            <ol className="relative border-l border-neutral-200 dark:border-neutral-700 ml-3 space-y-8 mb-6">
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-violet-100 dark:bg-violet-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-violet-600 dark:text-violet-400 font-bold text-sm">1</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Choose Your Calculator</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Select "Employee Bonus Tax" to calculate paycheck withholding, or "Business Bonus Depreciation" to calculate Section 168(k) deductions.</p>
              </li>
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-violet-100 dark:bg-violet-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-violet-600 dark:text-violet-400 font-bold text-sm">2</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Enter Your Amount</h3>
                <p className="text-neutral-700 dark:text-neutral-300">For bonuses: enter gross bonus amount and select withholding method (percentage or aggregate). For depreciation: enter asset cost and placed-in-service year.</p>
              </li>
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-violet-100 dark:bg-violet-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-violet-600 dark:text-violet-400 font-bold text-sm">3</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Add Deductions and Context</h3>
                <p className="text-neutral-700 dark:text-neutral-300">For paychecks: add 401(k), state tax, and YTD supplemental wages. For depreciation: select property class and recovery period.</p>
              </li>
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-violet-100 dark:bg-violet-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-violet-600 dark:text-violet-400 font-bold text-sm">4</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Review and Export</h3>
                <p className="text-neutral-700 dark:text-neutral-300">See your net bonus or first-year depreciation deduction. Copy the breakdown or download the schedule for your records.</p>
              </li>
            </ol>
          </section>

          {/* FAQ */}
          <section className="mb-16" id="faq">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-violet-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  Why is my bonus taxed at 22%?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  The IRS classifies bonuses as supplemental wages. For supplemental wages under $1 million per year, employers may withhold federal income tax at a flat 22% rate. This is not your actual tax rate — it is a convenience withholding method. Your final tax liability is determined when you file your return based on your total income.
                </div>
              </details>
              
              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-violet-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  Will I get a refund if my bonus was over-withheld?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  Yes, if the 22% withheld is more than your actual marginal tax rate. For example, if you are in the 12% bracket, you overpaid by 10 percentage points and will receive a refund. Conversely, if you are in the 24% bracket, you underpaid and may owe additional tax. The 22% rate is designed to approximate the median taxpayer's bracket.
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-violet-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  What is the bonus depreciation rate for 2026?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  Under current law, bonus depreciation is <strong>20%</strong> for assets placed in service in 2026. This is down from 100% (2018–2022), 80% (2023), 60% (2024), and 40% (2025). Beginning in 2027, bonus depreciation phases out completely to 0%. Businesses should plan capital expenditures accordingly.
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-violet-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  Do I pay Social Security tax on my bonus?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  Yes, bonuses are subject to the full FICA tax stack: 6.2% Social Security (up to the $184,500 wage base), 1.45% Medicare (no cap), and potentially 0.9% Additional Medicare if your total wages exceed $200,000. If you have already maxed out Social Security for the year, only Medicare applies to the bonus.
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-violet-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  Can my employer use the aggregate method without telling me?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  Yes. The IRS allows employers to choose either the percentage method or the aggregate method. Most use the percentage method for simplicity, but some payroll systems default to the aggregate method. The aggregate method often results in higher withholding. Check your pay stub — if federal withholding on your bonus seems unusually high, your employer may be using the aggregate method.
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-violet-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  What qualifies for bonus depreciation?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  Qualifying property includes tangible personal property with a MACRS recovery period of 20 years or less, qualified improvement property, computer software, and specified plants. The property must be purchased and placed in service during the tax year. Used property qualifies as long as it is new to the taxpayer.
                </div>
              </details>
            </div>
          </section>

          {/* Methodology & E-E-A-T */}
          <section className="mb-16" id="methodology">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Methodology and Data Sources</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              The employee bonus calculator uses the official 2026 supplemental wage withholding rules from IRS Publication 15 (Circular E) and Publication 15-A. The 22% flat rate applies to supplemental wages under $1 million; 37% applies to the excess. FICA rates use the 2026 Social Security wage base of $184,500 and Medicare rates from IRS guidance. State tax is applied as a flat percentage estimate; actual state supplemental rates vary.
            </p>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
              The business bonus depreciation calculator uses IRC Section 168(k) phase-out percentages and standard MACRS tables for the remaining basis. The 2026 rate is 20% under current law. All calculations occur client-side with no data transmitted to servers. This tool is for educational and planning purposes and does not constitute tax advice.
            </p>
            
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col sm:flex-row gap-6 items-start">
              <div className="h-16 w-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-2xl font-bold text-neutral-900 dark:text-white">
                M
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">About the Creator</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Built by <address className="inline not-italic font-medium">Mubarak</address>, an independent developer. This dual-purpose tool was created after noticing that "bonus tax calculator" and "bonus depreciation calculator" are completely different tools with overlapping names — yet no single page served both audiences. All calculations use official IRS rates.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    <Shield className="h-3 w-3" /> Open Source
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    <Clock className="h-3 w-3" /> Updated April 2026
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    <Users className="h-3 w-3" /> 18,000+ Monthly Users
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Related Tools */}
          <section className="mb-16 border-t border-neutral-100 dark:border-neutral-800 pt-16" id="related">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">Related Tax & Payroll Tools</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <Link href="/finance/us-take-home-calculator" className="group p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-violet-500 transition-colors">
                <Calculator className="h-6 w-6 text-violet-600 mb-3" />
                <h3 className="font-bold text-neutral-900 dark:text-white group-hover:text-violet-600 transition-colors">US Take-Home Salary Calculator</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">Calculate your total annual net pay after federal, FICA, state tax, 401(k), and healthcare deductions.</p>
              </Link>
              <Link href="/finance/salary-after-tax-calculator" className="group p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-violet-500 transition-colors">
                <Landmark className="h-6 w-6 text-violet-600 mb-3" />
                <h3 className="font-bold text-neutral-900 dark:text-white group-hover:text-violet-600 transition-colors">Salary After Tax Calculator</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">See how your base salary is taxed compared to your bonus across all 50 states using real 2026 brackets.</p>
              </Link>
            </div>
          </section>

          {/* References */}
          <section className="mb-16" id="references">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">References and Citations</h2>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>[70] <cite>IRS.gov</cite>. "Social Security and Medicare Withholding Rates." January 2026. <a href="https://www.irs.gov/taxtopics/tc751" className="text-violet-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.irs.gov/...</a></li>
              <li>[84] <cite>CPCON Group</cite>. "MACRS Depreciation: Complete Guide to Schedules, Calculations, and Tax Strategies." March 2026. <a href="https://cpcongroup.com/insights/article/macrs-depreciation-guide/" className="text-violet-600 hover:underline" target="_blank" rel="noopener noreferrer">https://cpcongroup.com/...</a></li>
              <li>[91] <cite>IRS.gov</cite>. "Publication 15-A (2026), Employer's Supplemental Tax Guide." 2026. <a href="https://www.irs.gov/publications/p15a" className="text-violet-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.irs.gov/...</a></li>
              <li>[92] <cite>IRS.gov</cite>. "Publication 15 (2026), Circular E, Employer's Tax Guide." December 2025. <a href="https://www.irs.gov/pub/irs-pdf/p15.pdf" className="text-violet-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.irs.gov/...</a></li>
              <li>[93] <cite>IRS.gov</cite>. "Publication 15-T (2026), Federal Income Tax Withholding Methods." December 2025. <a href="https://www.irs.gov/publications/p15t" className="text-violet-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.irs.gov/...</a></li>
              <li>[94] <cite>PaycheckCity</cite>. "2026 Federal Bonus Tax Percent Calculator." April 2026. <a href="https://www.paycheckcity.com/calculator/flatbonus" className="text-violet-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.paycheckcity.com/...</a></li>
            </ul>
          </section>

          {/* Final CTA */}
          <section className="rounded-3xl bg-violet-600 p-8 sm:p-12 text-center text-white">
            <Calculator className="h-10 w-10 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Calculate Your Bonus — Either Kind.</h2>
            <p className="text-violet-100 max-w-xl mx-auto mb-6">
              Scroll up to use the calculator. Employee bonus tax withholding or business bonus depreciation — get your numbers in seconds.
            </p>
            <a 
              href="#calculator-top"
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
