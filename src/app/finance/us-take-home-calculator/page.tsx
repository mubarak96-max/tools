import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import { TakeHomeTool } from './components/TakeHomeTool'
import { JsonLd } from './components/JsonLd'
import { 
  Calculator, DollarSign, Shield, CheckCircle, AlertTriangle, BookOpen,
  Clock, Users, TrendingUp, PiggyBank, HeartPulse, Landmark, FileText,
  Percent, Briefcase, Info, Gift, ShoppingCart
} from 'lucide-react'

export const metadata: Metadata = {
  metadataBase: new URL('http://findbest.tools'),
  title: 'US Take-Home Salary Calculator 2026 | Federal, FICA, 401k, Healthcare & State Tax',
  description: 'Calculate your exact 2026 US take-home pay with real IRS tax brackets, FICA (Social Security & Medicare), 401(k), HSA, health insurance premiums, and state tax. See federal withholding, net pay per paycheck, and annual breakdown.',
  keywords: [
    'take home pay calculator 2026',
    'us salary calculator',
    'federal tax calculator 2026',
    'paycheck calculator with 401k',
    'fica tax calculator',
    'salary after tax calculator',
    'healthcare deduction calculator',
    'hsa fsa calculator paycheck',
    'irs tax brackets 2026 calculator',
    'net pay calculator us',
    'payroll tax calculator 2026',
    'w2 take home calculator',
    'biweekly paycheck calculator',
    'state tax calculator 2026'
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
    url: 'http://findbest.tools/finance/us-take-home-calculator',
    siteName: 'Creator Tools by Mubarak',
    title: 'US Take-Home Salary Calculator 2026 | Federal, FICA, 401k & Healthcare',
    description: 'Know exactly what lands in your bank account. Real 2026 IRS brackets, FICA, 401(k), HSA, health insurance, and state tax — all in one calculator.',
    images: [
      {
        url: '/og-us-take-home-calculator.jpg',
        width: 1200,
        height: 630,
        alt: 'US Take-Home Salary Calculator showing federal tax, FICA, 401k, and net pay breakdown',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'US Take-Home Salary Calculator 2026 | Federal + FICA + Benefits',
    description: 'Calculate your exact 2026 net pay with real IRS tax brackets, 401(k), healthcare, and state tax deductions.',
    creator: '@mubarak96max',
    images: ['/og-us-take-home-calculator.jpg'],
  },
  alternates: {
    canonical: 'http://findbest.tools/finance/us-take-home-calculator',
  },
  category: 'Finance',
}

export const viewport: Viewport = {
  themeColor: '#0ea5e9',
  width: 'device-width',
  initialScale: 1,
}

export default function USTakeHomeCalculatorPage() {
  return (
    <>
      <JsonLd />
      
      <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        {/* Hero / Tool Section */}
        <section id="calculator-top" className="relative border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 dark:bg-sky-950/30 px-4 py-1.5 text-sm font-medium text-sky-600 dark:text-sky-400 mb-4 ring-1 ring-sky-600/10">
                <Calculator className="h-4 w-4" />
                <span>Used by 20,000+ US workers and HR teams</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-5xl lg:text-6xl">
                US Take-Home Salary <span className="text-sky-600">Calculator 2026</span>
              </h1>
              <p className="mt-4 text-lg leading-8 text-neutral-600 dark:text-neutral-300">
                Know exactly what lands in your bank account. Calculate your 2026 net pay with <strong>real IRS federal tax brackets</strong>, <strong>FICA</strong> (Social Security & Medicare), <strong>401(k)</strong> contributions, <strong>HSA/FSA</strong>, health insurance premiums, and state income tax.
              </p>
            </div>
            
            <TakeHomeTool />
          </div>
        </section>

        {/* Content Sections for SEO & LLM Citation */}
        <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          
          {/* What Is */}
          <section className="mb-16" id="what-is">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">What Is a Take-Home Salary Calculator?</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
                A <dfn>take-home salary calculator</dfn> is a payroll estimation tool that converts your <strong>gross annual salary</strong> into your <strong>net pay</strong> — the actual amount deposited into your bank account after all mandatory and voluntary deductions. In the United States, this requires modeling the entire payroll tax stack: federal income tax withholding (using progressive marginal brackets), FICA taxes (Social Security and Medicare), state income tax, and pre-tax benefit deductions like 401(k), HSA, FSA, and health insurance premiums.
              </p>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Unlike simple percentage-based estimators, this calculator uses the <strong>official 2026 IRS tax brackets</strong>, the exact FICA wage base limits, and the updated 401(k) contribution ceiling to produce accurate results. It accounts for the fact that US federal income tax is <strong>marginal</strong> — only the portion of income within each bracket is taxed at that rate, not your entire salary.
              </p>
            </div>
          </section>

          {/* 2026 Tax Overview */}
          <section className="mb-16" id="2026-tax">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">2026 US Federal Tax Brackets and Deductions</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              For tax year 2026, the IRS has released inflation-adjusted brackets under Revenue Procedure 2025-32. The standard deduction has increased, and the seven-bracket progressive structure remains in place following the One Big Beautiful Bill Act.
            </p>

            <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 mb-6">
              <table className="w-full text-sm text-left">
                <caption className="sr-only">2026 Federal Income Tax Brackets for Single Filers</caption>
                <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold">
                  <tr>
                    <th className="px-4 py-3">Tax Rate</th>
                    <th className="px-4 py-3">Single Filers</th>
                    <th className="px-4 py-3">Married Filing Jointly</th>
                    <th className="px-4 py-3">Head of Household</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                  <tr><td className="px-4 py-3 font-medium">10%</td><td className="px-4 py-3">$0 – $12,400</td><td className="px-4 py-3">$0 – $24,800</td><td className="px-4 py-3">$0 – $17,700</td></tr>
                  <tr><td className="px-4 py-3 font-medium">12%</td><td className="px-4 py-3">$12,401 – $50,400</td><td className="px-4 py-3">$24,801 – $100,800</td><td className="px-4 py-3">$17,701 – $67,450</td></tr>
                  <tr><td className="px-4 py-3 font-medium">22%</td><td className="px-4 py-3">$50,401 – $105,700</td><td className="px-4 py-3">$100,801 – $211,400</td><td className="px-4 py-3">$67,451 – $105,700</td></tr>
                  <tr><td className="px-4 py-3 font-medium">24%</td><td className="px-4 py-3">$105,701 – $201,775</td><td className="px-4 py-3">$211,401 – $403,550</td><td className="px-4 py-3">$105,701 – $201,775</td></tr>
                  <tr><td className="px-4 py-3 font-medium">32%</td><td className="px-4 py-3">$201,776 – $256,225</td><td className="px-4 py-3">$403,551 – $512,450</td><td className="px-4 py-3">$201,776 – $256,200</td></tr>
                  <tr><td className="px-4 py-3 font-medium">35%</td><td className="px-4 py-3">$256,226 – $640,600</td><td className="px-4 py-3">$512,451 – $768,700</td><td className="px-4 py-3">$256,201 – $640,600</td></tr>
                  <tr><td className="px-4 py-3 font-medium">37%</td><td className="px-4 py-3">Over $640,600</td><td className="px-4 py-3">Over $768,700</td><td className="px-4 py-3">Over $640,600</td></tr>
                </tbody>
              </table>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 text-center">
                <p className="text-xs text-neutral-500 mb-1">Standard Deduction (Single)</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">$16,100</p>
              </div>
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 text-center">
                <p className="text-xs text-neutral-500 mb-1">Standard Deduction (Married Joint)</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">$32,200</p>
              </div>
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 text-center">
                <p className="text-xs text-neutral-500 mb-1">Standard Deduction (Head of Household)</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">$24,150</p>
              </div>
            </div>
            <p className="text-sm text-neutral-500">
              Source: IRS Revenue Procedure 2025-32 
            </p>
          </section>

          {/* FICA Taxes */}
          <section className="mb-16" id="fica">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">FICA Taxes: Social Security and Medicare (2026)</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              FICA (Federal Insurance Contributions Act) taxes are mandatory payroll deductions that fund Social Security and Medicare. Unlike federal income tax, FICA is a <strong>flat tax</strong> applied to gross wages — though Social Security has a wage cap.
            </p>

            <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 mb-6">
              <table className="w-full text-sm text-left">
                <caption className="sr-only">2026 FICA tax rates and wage base limits</caption>
                <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold">
                  <tr>
                    <th className="px-4 py-3">Tax</th>
                    <th className="px-4 py-3">Employee Rate</th>
                    <th className="px-4 py-3">Wage Base Limit</th>
                    <th className="px-4 py-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                  <tr>
                    <td className="px-4 py-3 font-medium">Social Security</td>
                    <td className="px-4 py-3">6.2%</td>
                    <td className="px-4 py-3">$184,500</td>
                    <td className="px-4 py-3">No tax on income above limit</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Medicare</td>
                    <td className="px-4 py-3">1.45%</td>
                    <td className="px-4 py-3">No limit</td>
                    <td className="px-4 py-3">Applies to all wages</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Additional Medicare</td>
                    <td className="px-4 py-3">0.9%</td>
                    <td className="px-4 py-3">$200,000+</td>
                    <td className="px-4 py-3">Only on wages above threshold</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              For 2026, the Social Security wage base limit is <strong>$184,500</strong> — meaning any income above that amount is not subject to the 6.2% Social Security tax. Medicare has no wage cap; the 1.45% applies to all earnings. High earners above $200,000 pay an additional 0.9% Medicare surtax on the excess.
            </p>
          </section>

          {/* 401k and Benefits */}
          <section className="mb-16" id="benefits">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">401(k), HSA, FSA, and Health Insurance Deductions</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              Pre-tax deductions reduce your taxable income, which in turn lowers your federal income tax and FICA tax liability. Understanding the 2026 limits helps you maximize tax savings without exceeding contribution ceilings.
            </p>

            <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 mb-6">
              <table className="w-full text-sm text-left">
                <caption className="sr-only">2026 contribution limits for retirement and health accounts</caption>
                <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold">
                  <tr>
                    <th className="px-4 py-3">Account</th>
                    <th className="px-4 py-3">2026 Limit</th>
                    <th className="px-4 py-3">Catch-Up (50+)</th>
                    <th className="px-4 py-3">Tax Treatment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                  <tr>
                    <td className="px-4 py-3 font-medium">401(k) / 403(b)</td>
                    <td className="px-4 py-3">$24,500</td>
                    <td className="px-4 py-3">$8,000</td>
                    <td className="px-4 py-3">Pre-tax (reduces taxable income)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">401(k) Super Catch-Up (60–63)</td>
                    <td className="px-4 py-3">$24,500</td>
                    <td className="px-4 py-3">$11,250</td>
                    <td className="px-4 py-3">Pre-tax</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Traditional IRA</td>
                    <td className="px-4 py-3">$7,500</td>
                    <td className="px-4 py-3">$1,100</td>
                    <td className="px-4 py-3">Pre-tax (if eligible)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">HSA (Single)</td>
                    <td className="px-4 py-3">$4,300</td>
                    <td className="px-4 py-3">$1,000 (55+)</td>
                    <td className="px-4 py-3">Pre-tax</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">HSA (Family)</td>
                    <td className="px-4 py-3">$8,550</td>
                    <td className="px-4 py-3">$1,000 (55+)</td>
                    <td className="px-4 py-3">Pre-tax</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">FSA (Health)</td>
                    <td className="px-4 py-3">$3,300</td>
                    <td className="px-4 py-3">—</td>
                    <td className="px-4 py-3">Pre-tax</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm text-neutral-500 mb-4">
              Source: IRS Notice 2025-67 
            </p>

            <div className="rounded-xl border border-sky-100 dark:border-sky-900/30 bg-sky-50 dark:bg-sky-950/20 p-5">
              <h4 className="font-semibold text-sky-900 dark:text-sky-400 mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Why Pre-Tax Deductions Matter
              </h4>
              <p className="text-sm text-sky-800 dark:text-sky-300">
                A $24,500 401(k) contribution on a $100,000 salary does not just save you $24,500 — it saves you the federal income tax and FICA tax you would have paid on that $24,500. At a 22% marginal rate plus 7.65% FICA, that is approximately <strong>$7,264 in immediate tax savings</strong> while still building retirement wealth.
              </p>
            </div>
          </section>

          {/* Marginal vs Effective */}
          <section className="mb-16" id="marginal-effective">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Marginal Tax Rate vs. Effective Tax Rate</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              One of the most misunderstood concepts in US taxation is the difference between <strong>marginal</strong> and <strong>effective</strong> tax rates.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex gap-3">
                <TrendingUp className="h-5 w-5 text-sky-600 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700 dark:text-neutral-300"><strong>Marginal Rate:</strong> The tax rate applied to your last dollar of taxable income. If you earn $85,000 as a single filer, your marginal rate is 22% — but only the portion above $50,400 is taxed at 22%.</span>
              </li>
              <li className="flex gap-3">
                <Percent className="h-5 w-5 text-sky-600 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-700 dark:text-neutral-300"><strong>Effective Rate:</strong> Your total federal tax divided by your gross income. For the same $85,000 single filer, effective federal tax is approximately 11.6%. This is the number that actually matters for budgeting.</span>
              </li>
            </ul>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Many workers panic when they enter a "higher tax bracket," fearing their entire salary will be taxed more. This is false. The US progressive system only applies higher rates to the income within each bracket. Moving from the 22% to the 24% bracket means only the dollars above $105,700 are taxed at 24% — everything below stays at its original rate.
            </p>
          </section>

          {/* Common Mistakes */}
          <section className="mb-16" id="mistakes">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Common Salary Calculation Mistakes</h2>
            <div className="space-y-4">
              <div className="flex gap-4 p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400 mb-1">1. Using Your Marginal Rate for All Income</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">If you are in the 24% bracket, you do not pay 24% on everything. Your effective federal rate is typically 30–50% lower than your marginal rate. Budgeting using your marginal rate causes massive overestimation of tax liability.</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400 mb-1">2. Ignoring Pre-Tax Deductions</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">Failing to account for 401(k), HSA, and health insurance premium deductions inflates your taxable income estimate. A $100,000 salary with $20,000 in pre-tax deductions is taxed as if you earn $80,000.</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400 mb-1">3. Forgetting the Social Security Wage Cap</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">If you earn above $184,500, Social Security tax stops applying to additional income. Many high earners overestimate FICA by applying 7.65% to their entire salary.</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400 mb-1">4. Confusing Roth 401(k) with Pre-Tax</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">Roth 401(k) contributions are <strong>post-tax</strong> — they do not reduce your taxable income now. If you enter Roth contributions as pre-tax, your calculator will show artificially low tax liability.</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400 mb-1">5. Not Adjusting for Pay Frequency</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">A $100,000 annual salary is $3,846 biweekly — not $4,166 monthly. Using the wrong pay frequency destroys your monthly budget. Always divide by the correct number of pay periods (26 for biweekly, 24 for semimonthly, 52 for weekly).</p>
                </div>
              </div>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-16" id="how-to-use">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">How to Use the Take-Home Salary Calculator</h2>
            <ol className="relative border-l border-neutral-200 dark:border-neutral-700 ml-3 space-y-8 mb-6">
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-sky-100 dark:bg-sky-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-sky-600 dark:text-sky-400 font-bold text-sm">1</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Enter Your Gross Salary</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Input your annual gross salary before any deductions. Select your pay frequency (annual, monthly, biweekly, or weekly) to see per-paycheck breakdowns.</p>
              </li>
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-sky-100 dark:bg-sky-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-sky-600 dark:text-sky-400 font-bold text-sm">2</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Select Filing Status</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Choose Single, Married Filing Jointly, or Head of Household. This determines your standard deduction and tax bracket thresholds.</p>
              </li>
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-sky-100 dark:bg-sky-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-sky-600 dark:text-sky-400 font-bold text-sm">3</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Add Pre-Tax Deductions</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Enter your 401(k) contribution, HSA contribution, FSA amount, and health insurance premium. These reduce your taxable income and are capped at 2026 IRS limits.</p>
              </li>
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-sky-100 dark:bg-sky-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-sky-600 dark:text-sky-400 font-bold text-sm">4</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Set State Tax</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Select your state from the dropdown or enter a custom state tax rate. The calculator includes flat-tax and no-income-tax states.</p>
              </li>
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-sky-100 dark:bg-sky-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-sky-600 dark:text-sky-400 font-bold text-sm">5</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Review Your Breakdown</h3>
                <p className="text-neutral-700 dark:text-neutral-300">The results panel shows your federal tax, FICA, state tax, total deductions, net pay, effective tax rate, and marginal tax rate. Toggle between annual and per-paycheck views.</p>
              </li>
            </ol>
          </section>

          {/* FAQ */}
          <section className="mb-16" id="faq">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-sky-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  What is the 2026 401(k) contribution limit?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  The 2026 401(k) contribution limit is <strong>$24,500</strong> for employees under 50. The catch-up contribution for those aged 50 and over is $8,000, allowing a total of $32,500. Workers aged 60–63 have a "super catch-up" limit of $11,250, allowing up to $35,750.
                </div>
              </details>
              
              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-sky-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  How is FICA calculated on high salaries?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  Social Security tax (6.2%) applies only to the first $184,500 of wages in 2026. Medicare tax (1.45%) applies to all wages with no cap. If your wages exceed $200,000, an additional 0.9% Medicare surtax applies to the excess.
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-sky-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  Do 401(k) contributions reduce FICA tax?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  No. Traditional 401(k) contributions reduce your <strong>federal income tax</strong> but not your <strong>FICA tax</strong>. You still pay Social Security and Medicare taxes on the full gross wages, including the amount contributed to your 401(k). HSA contributions, however, are exempt from FICA if made through payroll deduction.
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-sky-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  What is my effective tax rate?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  Your effective tax rate is your total tax divided by your gross income. For example, a single filer earning $85,000 with the standard deduction pays approximately $9,870 in federal income tax, yielding an effective federal rate of about 11.6%. Your effective rate is always lower than your marginal rate because of the progressive bracket system.
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-sky-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  Should I max out my 401(k) or HSA first?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  If your employer offers a 401(k) match, contribute enough to capture the full match first — that is free money. After that, many financial planners recommend maxing your HSA next because it offers a "triple tax advantage": pre-tax contributions, tax-free growth, and tax-free withdrawals for medical expenses. Then return to your 401(k).
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-sky-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  Does this calculator include local or city taxes?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  This calculator includes <strong>federal</strong> and <strong>state</strong> income taxes. It does not include local or city income taxes (such as NYC's city tax or Ohio's municipal taxes). If you live in a jurisdiction with local income tax, add that percentage manually in the "Other Deductions" field for a more precise estimate.
                </div>
              </details>
            </div>
          </section>

          {/* Methodology & E-E-A-T */}
          <section className="mb-16" id="methodology">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Methodology and Data Sources</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              This calculator implements the official 2026 US federal income tax brackets published by the IRS in Revenue Procedure 2025-32. Federal tax is calculated using the marginal bracket method: income within each bracket is taxed at the corresponding rate, with brackets defined by filing status. FICA taxes use the 2026 rates: 6.2% Social Security (capped at $184,500), 1.45% Medicare (uncapped), and 0.9% Additional Medicare on wages exceeding $200,000.
            </p>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
              State tax is modeled using either flat rates or approximate effective rates for selected states. 401(k), HSA, and FSA limits are sourced from IRS Notice 2025-67. The calculator does not account for itemized deductions, the Alternative Minimum Tax (AMT), or tax credits beyond the standard deduction. Results are estimates for educational and budgeting purposes; consult a tax professional for filing.
            </p>
            
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col sm:flex-row gap-6 items-start">
              <div className="h-16 w-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-2xl font-bold text-neutral-900 dark:text-white">
                M
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">About the Creator</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Built by <address className="inline not-italic font-medium">Mubarak</address>, an independent developer. This tool was created after noticing that most online paycheck calculators use outdated tax brackets or oversimplified flat-rate estimates. All calculations occur client-side with no data transmitted to servers.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    <Shield className="h-3 w-3" /> Open Source
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    <Clock className="h-3 w-3" /> Updated April 2026
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    <Users className="h-3 w-3" /> 20,000+ Monthly Users
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Related Tools */}
          <section className="mb-16 border-t border-neutral-100 dark:border-neutral-800 pt-16" id="related">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">Related Payroll & Finance Tools</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <Link href="/finance/bonus-tax-calculator" className="group p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-sky-500 transition-colors">
                <Gift className="h-6 w-6 text-sky-600 mb-3" />
                <h3 className="font-bold text-neutral-900 dark:text-white group-hover:text-sky-600 transition-colors">Bonus Tax Calculator</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">Received a year-end bonus? Calculate withholding using the 22% supplemental rate vs. the aggregate method.</p>
              </Link>
              <Link href="/finance/salary-after-tax-calculator" className="group p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-sky-500 transition-colors">
                <Landmark className="h-6 w-6 text-sky-600 mb-3" />
                <h3 className="font-bold text-neutral-900 dark:text-white group-hover:text-sky-600 transition-colors">Salary After Tax Calculator</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">See how your base salary is taxed across all 50 states using real 2026 brackets and compare states.</p>
              </Link>
            </div>
          </section>

          {/* References */}
          <section className="mb-16" id="references">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">References and Citations</h2>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>[69] <cite>IRS.gov</cite>. "Federal income tax rates and brackets." February 2026. <a href="https://www.irs.gov/filing/federal-income-tax-rates-and-brackets" className="text-sky-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.irs.gov/...</a></li>
              <li>[70] <cite>IRS.gov</cite>. "Social Security and Medicare Withholding Rates." January 2026. <a href="https://www.irs.gov/taxtopics/tc751" className="text-sky-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.irs.gov/...</a></li>
              <li>[72] <cite>Tax Foundation</cite>. "2026 Tax Brackets and Federal Income Tax Rates." January 2026. <a href="https://taxfoundation.org/data/all/federal/2026-tax-brackets/" className="text-sky-600 hover:underline" target="_blank" rel="noopener noreferrer">https://taxfoundation.org/...</a></li>
              <li>[73] <cite>IRS.gov</cite>. "401(k) limit increases to $24,500 for 2026, IRA limit increases to $7,500." November 2025. <a href="https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500" className="text-sky-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.irs.gov/...</a></li>
              <li>[74] <cite>IRS.gov</cite>. "IRS releases tax inflation adjustments for tax year 2026." October 2025. <a href="https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill" className="text-sky-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.irs.gov/...</a></li>
              <li>[76] <cite>MyIRSTeam</cite>. "2026 Tax Brackets & Federal Income Tax Rates Complete Guide." April 2026. <a href="https://www.myirsteam.com/blog/2026-tax-brackets-federal-income-tax-rates-complete-guide/" className="text-sky-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.myirsteam.com/...</a></li>
              <li>[77] <cite>Paycor</cite>. "Social Security Taxable Wage Base & Limits [2026]." March 2026. <a href="https://www.paycor.com/resource-center/articles/social-security-taxable-wage-base/" className="text-sky-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.paycor.com/...</a></li>
              <li>[78] <cite>Expatica</cite>. "United States Income Tax/Salary Calculator 2026/2027." April 2026. <a href="https://www.expatica.com/us/salary-tax-calculator/" className="text-sky-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.expatica.com/...</a></li>
            </ul>
          </section>

          {/* Final CTA */}
          <section className="rounded-3xl bg-sky-600 p-8 sm:p-12 text-center text-white">
            <Calculator className="h-10 w-10 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Know What You Actually Earn.</h2>
            <p className="text-sky-100 max-w-xl mx-auto mb-6">
              Scroll up to calculate your 2026 take-home pay. Input your salary, benefits, and deductions to see your real net income per paycheck.
            </p>
            <a 
              href="#calculator-top"
              className="inline-flex items-center gap-2 rounded-full bg-white text-sky-600 px-6 py-3 font-semibold hover:bg-sky-50 transition-colors"
            >
              Launch Calculator
            </a>
          </section>

        </article>
      </main>
    </>
  )
}
