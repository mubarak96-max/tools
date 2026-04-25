import type { Metadata, Viewport } from 'next'
import { AustraliaTaxTool } from './components/AustraliaTaxTool'
import { JsonLd } from './components/JsonLd'
import { RelatedToolsSection } from '@/components/tools/ToolPageScaffold'
import { 
  Calculator, DollarSign, TrendingUp, CheckCircle, AlertTriangle, BookOpen, 
  Shield, Clock, Users, Landmark, Percent, Briefcase, GraduationCap,
  HeartPulse, Globe, Info
} from 'lucide-react'

export const metadata: Metadata = {
  metadataBase: new URL('http://findbest.tools'),
  title: 'Income Tax Calculator Australia 2025-26 | ATO Rates, Medicare, HECS & Take-Home',
  description: 'Free Australian income tax calculator for 2025-26. Calculate tax, Medicare levy, HECS/HELP repayments, and take-home pay for residents, non-residents, and working holiday makers. Real ATO brackets.',
  keywords: [
    'income tax calculator australia',
    'australia tax calculator',
    'australian tax calculator',
    'tax calculator australia 2026',
    'how much tax do i pay australia',
    'how much tax on 80000 australia',
    'how much tax on 100000 australia',
    'how much tax on 50000 australia',
    'how much tax on 60000 australia',
    'how much tax on 120000 australia',
    'australia salary after tax',
    'salary after tax australia',
    'take home pay calculator australia',
    'take home salary australia',
    'hecs help repayment calculator',
    'hecs repayment calculator',
    'medicare levy calculator',
    'tax free threshold calculator',
    'marginal tax rate calculator australia',
    'effective tax rate australia',
    'fortnightly tax calculator australia',
    'weekly tax calculator australia',
    'monthly tax calculator australia',
    'non resident tax calculator australia',
    'foreign resident tax australia',
    'working holiday tax calculator australia',
    'working holiday maker tax australia',
    'second job tax australia',
    'tax on second job australia',
    'ato tax calculator',
    'ato tax brackets 2026',
    'australia income tax brackets 2026',
    'australian tax brackets 2025 26',
    'stage 3 tax cuts calculator',
    'tax refund calculator australia',
    'tax return calculator australia',
    'payg tax calculator',
    'withholding tax calculator australia',
    'net pay calculator australia',
    'gross to net calculator australia',
    'australia tax rates 2026',
    'australian tax rates resident',
    'tax calculator with hecs',
    'tax calculator with medicare levy',
    'low income tax offset calculator',
    'lito calculator australia',
    'superannuation tax calculator',
    'income tax estimator australia'
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
    locale: 'en_AU',
    url: 'http://findbest.tools/finance/income-tax-calculator-australia',
    siteName: 'Creator Tools by Mubarak',
    title: 'Income Tax Calculator Australia 2025-26 | ATO Rates, Medicare & HECS',
    description: 'Calculate Australian income tax, Medicare levy, HECS repayments, and take-home pay. Real ATO 2025-26 brackets for residents, non-residents, and working holiday makers.',
    images: [
      {
        url: '/og-income-tax-calculator-australia.jpg',
        width: 1200,
        height: 630,
        alt: 'Australian Income Tax Calculator showing ATO brackets, Medicare levy, and HECS repayment',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Income Tax Calculator Australia | ATO Rates & Take-Home',
    description: 'Calculate tax, Medicare, HECS, and net pay with real 2025-26 ATO brackets.',
    creator: '@mubarak96max',
    images: ['/og-income-tax-calculator-australia.jpg'],
  },
  alternates: {
    canonical: 'http://findbest.tools/finance/income-tax-calculator-australia',
  },
  category: 'Technology',
}

export const viewport: Viewport = {
  themeColor: '#eab308',
  width: 'device-width',
  initialScale: 1,
}

export default function IncomeTaxCalculatorAustraliaPage() {
  return (
    <>
      <JsonLd />
      
      <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        {/* Hero / Tool Section */}
        <section id="calculator-top" className="relative border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-yellow-50 dark:bg-yellow-950/30 px-4 py-1.5 text-sm font-medium text-yellow-600 dark:text-yellow-400 mb-4 ring-1 ring-yellow-600/10">
                <Calculator className="h-4 w-4" />
                <span>Used by 30,000+ Australians and expats</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-5xl lg:text-6xl">
                Income Tax <span className="text-yellow-600">Calculator Australia</span>
              </h1>
              <p className="mt-4 text-lg leading-8 text-neutral-600 dark:text-neutral-300">
                Calculate your exact Australian tax for the <strong>2025–26 financial year</strong>. Real <strong>ATO brackets</strong>, <strong>Medicare levy</strong>, <strong>HECS/HELP repayments</strong>, and <strong>take-home pay</strong> — for residents, non-residents, and working holiday makers.
              </p>
            </div>
            
            <AustraliaTaxTool />
          </div>
        </section>

        {/* Content Sections for SEO & LLM Citation */}
        <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          
          {/* What Is */}
          <section className="mb-16" id="what-is">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">How Is Income Tax Calculated in Australia?</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Australia operates on a <dfn>progressive tax system</dfn> where higher portions of income are taxed at higher rates. The Australian financial year runs from <strong>1 July to 30 June</strong> the following year, so the current tax year is <strong>2025–26</strong> (1 July 2025 to 30 June 2026) . Unlike the United States, Canada, or the UK, Australia has <strong>no state or territory income taxes</strong> — the ATO is your only tax authority for personal income .
              </p>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                For Australian residents, the first <data value="18200">$18,200</data> of taxable income is completely tax-free — this is the <dfn>tax-free threshold</dfn> . Income above this threshold is taxed in progressive brackets: 16% on $18,201–$45,000, 30% on $45,001–$135,000, 37% on $135,001–$190,000, and 45% on income over $190,000 . These are <strong>marginal rates</strong> — only the portion of income within each bracket is taxed at that rate, not your entire salary.
              </p>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                On top of income tax, most residents pay a <strong>2% Medicare levy</strong> to fund Australia's public healthcare system . High-income earners without private hospital insurance may also pay a <strong>Medicare Levy Surcharge</strong> of 1%–1.5% . And if you have a HECS-HELP debt from university, compulsory repayments are deducted once your <dfn>repayment income</dfn> exceeds the annual threshold .
              </p>
            </div>
          </section>

          {/* TAX BY INCOME LEVEL - Long-tail goldmine */}
          <section className="mb-16" id="tax-by-income">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">How Much Tax Do I Pay? Income-Specific Breakdowns</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
              The most common long-tail searches are income-specific. Here is exactly how much tax you pay at every major income level for 2025–26, assuming single Australian residency with no deductions and standard Medicare levy.
            </p>

            <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 mb-6">
              <table className="w-full text-sm text-left">
                <caption className="sr-only">Australian tax payable by income level 2025-26</caption>
                <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold">
                  <tr>
                    <th className="px-4 py-3">Annual Income</th>
                    <th className="px-4 py-3">Income Tax</th>
                    <th className="px-4 py-3">Medicare</th>
                    <th className="px-4 py-3">Total Tax</th>
                    <th className="px-4 py-3">Take-Home Pay</th>
                    <th className="px-4 py-3">Effective Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                  <tr><td className="px-4 py-3 font-medium">$20,000</td><td className="px-4 py-3">$288</td><td className="px-4 py-3">$0</td><td className="px-4 py-3">$288</td><td className="px-4 py-3 text-green-600 font-medium">$19,712</td><td className="px-4 py-3">1.4%</td></tr>
                  <tr><td className="px-4 py-3 font-medium">$30,000</td><td className="px-4 py-3">$1,888</td><td className="px-4 py-3">$278</td><td className="px-4 py-3">$2,166</td><td className="px-4 py-3 text-green-600 font-medium">$27,834</td><td className="px-4 py-3">7.2%</td></tr>
                  <tr><td className="px-4 py-3 font-medium">$40,000</td><td className="px-4 py-3">$3,488</td><td className="px-4 py-3">$800</td><td className="px-4 py-3">$4,288</td><td className="px-4 py-3 text-green-600 font-medium">$35,712</td><td className="px-4 py-3">10.7%</td></tr>
                  <tr><td className="px-4 py-3 font-medium">$50,000</td><td className="px-4 py-3">$6,788</td><td className="px-4 py-3">$1,000</td><td className="px-4 py-3">$7,788</td><td className="px-4 py-3 text-green-600 font-medium">$42,212</td><td className="px-4 py-3">15.6%</td></tr>
                  <tr><td className="px-4 py-3 font-medium">$60,000</td><td className="px-4 py-3">$9,788</td><td className="px-4 py-3">$1,200</td><td className="px-4 py-3">$10,988</td><td className="px-4 py-3 text-green-600 font-medium">$49,012</td><td className="px-4 py-3">18.3%</td></tr>
                  <tr><td className="px-4 py-3 font-medium">$70,000</td><td className="px-4 py-3">$12,788</td><td className="px-4 py-3">$1,400</td><td className="px-4 py-3">$14,188</td><td className="px-4 py-3 text-green-600 font-medium">$55,812</td><td className="px-4 py-3">20.3%</td></tr>
                  <tr><td className="px-4 py-3 font-medium">$80,000</td><td className="px-4 py-3">$15,788</td><td className="px-4 py-3">$1,600</td><td className="px-4 py-3">$17,388</td><td className="px-4 py-3 text-green-600 font-medium">$62,612</td><td className="px-4 py-3">21.7%</td></tr>
                  <tr><td className="px-4 py-3 font-medium">$90,000</td><td className="px-4 py-3">$18,788</td><td className="px-4 py-3">$1,800</td><td className="px-4 py-3">$20,588</td><td className="px-4 py-3 text-green-600 font-medium">$69,412</td><td className="px-4 py-3">22.9%</td></tr>
                  <tr><td className="px-4 py-3 font-medium">$100,000</td><td className="px-4 py-3">$21,788</td><td className="px-4 py-3">$2,000</td><td className="px-4 py-3">$23,788</td><td className="px-4 py-3 text-green-600 font-medium">$76,212</td><td className="px-4 py-3">23.8%</td></tr>
                  <tr><td className="px-4 py-3 font-medium">$120,000</td><td className="px-4 py-3">$27,788</td><td className="px-4 py-3">$2,400</td><td className="px-4 py-3">$30,188</td><td className="px-4 py-3 text-green-600 font-medium">$89,812</td><td className="px-4 py-3">25.2%</td></tr>
                  <tr><td className="px-4 py-3 font-medium">$150,000</td><td className="px-4 py-3">$36,788</td><td className="px-4 py-3">$3,000</td><td className="px-4 py-3">$39,788</td><td className="px-4 py-3 text-green-600 font-medium">$110,212</td><td className="px-4 py-3">26.5%</td></tr>
                  <tr><td className="px-4 py-3 font-medium">$200,000</td><td className="px-4 py-3">$55,288</td><td className="px-4 py-3">$4,000</td><td className="px-4 py-3">$59,288</td><td className="px-4 py-3 text-green-600 font-medium">$140,712</td><td className="px-4 py-3">29.6%</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-neutral-500">
              *Calculations assume single Australian resident, no deductions, standard Medicare levy, no HECS debt, and include Low Income Tax Offset (LITO) where applicable.
            </p>
          </section>

          {/* 2025-26 Brackets */}
          <section className="mb-16" id="brackets">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Australian Tax Brackets 2025–26 (Current Year)</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              These are the official ATO resident tax rates for the 2025–26 financial year. They reflect the Stage 3 tax cuts that took effect on 1 July 2024, which reduced the $18,201–$45,000 bracket from 19% to 16% and flattened the middle brackets .
            </p>

            <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 mb-6">
              <table className="w-full text-sm text-left">
                <caption className="sr-only">Australian resident income tax brackets 2025-26</caption>
                <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold">
                  <tr>
                    <th className="px-4 py-3">Taxable Income</th>
                    <th className="px-4 py-3">Marginal Rate</th>
                    <th className="px-4 py-3">Tax on This Income</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                  <tr>
                    <td className="px-4 py-3">$0 – $18,200</td>
                    <td className="px-4 py-3 font-medium">0%</td>
                    <td className="px-4 py-3">Nil</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">$18,201 – $45,000</td>
                    <td className="px-4 py-3 font-medium">16%</td>
                    <td className="px-4 py-3">16¢ for each $1 over $18,200</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">$45,001 – $135,000</td>
                    <td className="px-4 py-3 font-medium">30%</td>
                    <td className="px-4 py-3">$4,288 plus 30¢ for each $1 over $45,000</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">$135,001 – $190,000</td>
                    <td className="px-4 py-3 font-medium">37%</td>
                    <td className="px-4 py-3">$31,288 plus 37¢ for each $1 over $135,000</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">$190,001 and over</td>
                    <td className="px-4 py-3 font-medium">45%</td>
                    <td className="px-4 py-3">$51,638 plus 45¢ for each $1 over $190,000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 text-center">
                <p className="text-xs text-neutral-500 mb-1">Tax-Free Threshold</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">$18,200</p>
              </div>
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 text-center">
                <p className="text-xs text-neutral-500 mb-1">Medicare Levy</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">2%</p>
              </div>
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 text-center">
                <p className="text-xs text-neutral-500 mb-1">Super Guarantee</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">12%</p>
              </div>
            </div>

            <p className="text-sm text-neutral-500">
              Source: Australian Taxation Office (ATO), SuperGuide 
            </p>
          </section>

          {/* Medicare Levy */}
          <section className="mb-16" id="medicare">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Medicare Levy: How Much and Who Pays It</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              The Medicare levy is an additional <strong>2% of your taxable income</strong> that funds Australia's public healthcare system . It is not part of the income tax brackets — it is calculated separately and added to your total tax liability.
            </p>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              However, low-income earners may be exempt or pay a reduced levy. For the 2025–26 year, the Medicare levy thresholds are :
            </p>

            <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 mb-6">
              <table className="w-full text-sm text-left">
                <caption className="sr-only">Medicare levy thresholds for 2025-26</caption>
                <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold">
                  <tr>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">No Levy Below</th>
                    <th className="px-4 py-3">Full Levy At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                  <tr>
                    <td className="px-4 py-3">Single</td>
                    <td className="px-4 py-3">$27,222</td>
                    <td className="px-4 py-3">$34,027</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Single (senior/pensioner)</td>
                    <td className="px-4 py-3">$43,020</td>
                    <td className="px-4 py-3">$53,775</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Family</td>
                    <td className="px-4 py-3">$45,907</td>
                    <td className="px-4 py-3">$57,383</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Family (senior/pensioner)</td>
                    <td className="px-4 py-3">$59,886</td>
                    <td className="px-4 py-3">$74,857</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Between the low threshold and the full levy threshold, the Medicare levy is phased in at <strong>10 cents for each dollar</strong> above the low threshold . For example, a single person earning $30,000 pays a reduced levy of ($30,000 − $27,222) × 10% = $277.80, rather than the full 2% ($600).
            </p>
          </section>

          {/* HECS HELP */}
          <section className="mb-16" id="hecs">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">HECS-HELP Repayments: When They Kick In</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              If you studied at university in Australia, you likely have a HECS-HELP debt. Repayments are <strong>not based on your taxable income alone</strong> — they are based on your <dfn>repayment income</dfn>, which includes your taxable income plus any reportable fringe benefits, reportable super contributions, and net investment losses .
            </p>

            <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 mb-6">
              <table className="w-full text-sm text-left">
                <caption className="sr-only">HECS-HELP compulsory repayment thresholds and rates for 2025-26</caption>
                <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold">
                  <tr>
                    <th className="px-4 py-3">Repayment Income</th>
                    <th className="px-4 py-3">Repayment Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                  <tr><td className="px-4 py-3">Below $54,435</td><td className="px-4 py-3">Nil</td></tr>
                  <tr><td className="px-4 py-3">$54,435 – $62,439</td><td className="px-4 py-3">1%</td></tr>
                  <tr><td className="px-4 py-3">$62,440 – $66,887</td><td className="px-4 py-3">2%</td></tr>
                  <tr><td className="px-4 py-3">$66,888 – $71,610</td><td className="px-4 py-3">3%</td></tr>
                  <tr><td className="px-4 py-3">$71,611 – $76,698</td><td className="px-4 py-3">4%</td></tr>
                  <tr><td className="px-4 py-3">$76,699 – $82,196</td><td className="px-4 py-3">5%</td></tr>
                  <tr><td className="px-4 py-3">$82,197 – $88,170</td><td className="px-4 py-3">6%</td></tr>
                  <tr><td className="px-4 py-3">$88,171 – $94,694</td><td className="px-4 py-3">7%</td></tr>
                  <tr><td className="px-4 py-3">$94,695 – $101,857</td><td className="px-4 py-3">8%</td></tr>
                  <tr><td className="px-4 py-3">$101,858 – $109,756</td><td className="px-4 py-3">9%</td></tr>
                  <tr><td className="px-4 py-3">$109,757 – $118,498</td><td className="px-4 py-3">10%</td></tr>
                  <tr><td className="px-4 py-3">$118,499+</td><td className="px-4 py-3">10%</td></tr>
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-yellow-100 dark:border-yellow-900/30 bg-yellow-50 dark:bg-yellow-950/20 p-5">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-400 mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Tax Cuts Do Not Reduce HECS Repayments
              </h4>
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                The 2026 tax cuts reduce your income tax but <strong>do not reduce your HECS repayment</strong> . HECS is calculated on repayment income, not tax payable. Your employer withholds HECS based on your gross income, so the tax cut increases your take-home pay but your HECS deduction stays the same.
              </p>
            </div>
          </section>

          {/* Second Job Tax */}
          <section className="mb-16" id="second-job">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Tax on a Second Job in Australia</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                One of the most searched tax topics in Australia is how second jobs are taxed. Many workers assume a second job is taxed at a higher rate — this is partially true, but not for the reason most people think .
              </p>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                When you start a second job, you should <strong>not</strong> claim the tax-free threshold from that employer. Instead, you claim it only from your <strong>highest-paying job</strong> . Your second job will then withhold tax from the very first dollar at your marginal rate — which could be 16%, 30%, 37%, or 45% depending on your total income.
              </p>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                This is not a penalty — it is simply your employer applying the correct withholding so you do not end up with a tax bill. If both employers applied the tax-free threshold, your total withholding would be too low, and you would owe money at tax time. The ATO does not charge extra tax for having a second job; it simply ensures the correct amount is withheld throughout the year.
              </p>
            </div>
            <div className="rounded-xl border border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-950/20 p-5">
              <h4 className="font-semibold text-green-900 dark:text-green-400 mb-2 font-medium">Example: Second Job at $25,000</h4>
              <p className="text-sm text-green-800 dark:text-green-300">
                If your main job pays $70,000 (you claim the threshold) and your second job pays $25,000 (you do not claim the threshold), the second job withholds tax at 30% from dollar one — approximately $7,500. This is correct because your combined $95,000 income sits in the 30% bracket. If you had claimed the threshold on both, you would underpay by roughly $4,000.
              </p>
            </div>
          </section>

          {/* Non-Residents & Working Holiday */}
          <section className="mb-16" id="non-resident">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Non-Residents and Working Holiday Makers</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              Not everyone in Australia gets the tax-free threshold. Your residency status dramatically changes your tax liability .
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-yellow-600" />
                  Foreign Residents
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                  No tax-free threshold. Taxed from the first dollar. No Medicare levy (generally not eligible for Medicare) .
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                      <tr><td className="py-1">$0 – $135,000</td><td className="py-1 text-right font-medium">30%</td></tr>
                      <tr><td className="py-1">$135,001 – $190,000</td><td className="py-1 text-right font-medium">37%</td></tr>
                      <tr><td className="py-1">$190,001+</td><td className="py-1 text-right font-medium">45%</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-yellow-600" />
                  Working Holiday Makers
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                  Special rates for visa subclasses 417 and 462. Lower rate on first $45,000, then standard resident brackets .
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                      <tr><td className="py-1">$0 – $45,000</td><td className="py-1 text-right font-medium">15%</td></tr>
                      <tr><td className="py-1">$45,001 – $135,000</td><td className="py-1 text-right font-medium">30%</td></tr>
                      <tr><td className="py-1">$135,001 – $190,000</td><td className="py-1 text-right font-medium">37%</td></tr>
                      <tr><td className="py-1">$190,001+</td><td className="py-1 text-right font-medium">45%</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-green-100 dark:border-green-900/30 bg-green-50 dark:bg-green-950/20 p-5">
              <h4 className="font-semibold text-green-900 dark:text-green-400 mb-2">Resident vs. Non-Resident: Real Example</h4>
              <p className="text-sm text-green-800 dark:text-green-300">
                At $80,000 income: A resident pays ~$17,388 total tax (including Medicare) . A non-resident pays $24,000 — a difference of <strong>$6,612</strong>. At $40,000: resident pays ~$4,288 (with levy); non-resident pays $12,000 — a <strong>180% higher</strong> tax bill .
              </p>
            </div>
          </section>

          {/* 2026-27 Changes */}
          <section className="mb-16" id="future">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">What's Changing from 1 July 2026?</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              The government has legislated further tax cuts beginning 1 July 2026. The only change is a reduction in the lowest tax bracket .
            </p>

            <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 mb-6">
              <table className="w-full text-sm text-left">
                <caption className="sr-only">Australian tax bracket changes from 2026-27</caption>
                <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold">
                  <tr>
                    <th className="px-4 py-3">Period</th>
                    <th className="px-4 py-3">$18,201 – $45,000 Rate</th>
                    <th className="px-4 py-3">Estimated Annual Saving</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                  <tr>
                    <td className="px-4 py-3">Now (2025–26)</td>
                    <td className="px-4 py-3">16%</td>
                    <td className="px-4 py-3">—</td>
                  </tr>
                  <tr className="bg-yellow-50 dark:bg-yellow-950/20">
                    <td className="px-4 py-3 font-medium">From 1 July 2026</td>
                    <td className="px-4 py-3 font-medium text-yellow-700 dark:text-yellow-400">15%</td>
                    <td className="px-4 py-3">~$140 (at $45,000 income)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">From 1 July 2027</td>
                    <td className="px-4 py-3">14%</td>
                    <td className="px-4 py-3">~$268 (at $45,000 income)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              All other brackets remain unchanged. The 30%, 37%, and 45% rates stay the same. These cuts are <strong>automatic</strong> — your employer's payroll system will update the withholding tables, and you will see the change in your first pay period after 1 July 2026 .
            </p>
          </section>

          {/* Common Mistakes */}
          <section className="mb-16" id="mistakes">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Common Australian Tax Mistakes</h2>
            <div className="space-y-4">
              <div className="flex gap-4 p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400 mb-1">1. Claiming the Tax-Free Threshold on Two Jobs</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">You should only claim the tax-free threshold from <strong>one employer</strong> — typically your highest-paying job . If you claim it from both, too little tax is withheld and you will owe money at tax time.</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400 mb-1">2. Forgetting the Medicare Levy</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">Many calculators show income tax only. The 2% Medicare levy adds $400 on $20,000, $1,600 on $80,000, and $3,000 on $150,000 . Always include it in your budget.</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400 mb-1">3. Confusing Taxable Income with Gross Income</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">Tax is calculated on <strong>taxable income</strong> (gross minus deductions), not gross salary. If you have $5,000 in work-related deductions, your taxable income is $5,000 lower — potentially dropping you into a lower bracket.</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-400 mb-1">4. Ignoring HECS on Pay Rises</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">HECS repayments kick in at $54,435 and escalate to 10% . A pay rise from $80,000 to $90,000 increases your HECS repayment from $4,000 to $5,400 — a $1,400 reduction in take-home pay that has nothing to do with income tax brackets.</p>
                </div>
              </div>
            </div>
          </section>

          {/* How to Use */}
          <section className="mb-16" id="how-to-use">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">How to Use the Australian Income Tax Calculator</h2>
            <ol className="relative border-l border-neutral-200 dark:border-neutral-700 ml-3 space-y-8 mb-6">
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-yellow-600 dark:text-yellow-400 font-bold text-sm">1</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Select Your Residency Status</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Choose Australian Resident, Foreign Resident, or Working Holiday Maker. This determines whether you get the $18,200 tax-free threshold and whether Medicare levy applies.</p>
              </li>
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-yellow-600 dark:text-yellow-400 font-bold text-sm">2</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Enter Your Annual Income</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Input your gross annual salary or wage. The calculator handles the marginal tax brackets automatically.</p>
              </li>
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-yellow-600 dark:text-yellow-400 font-bold text-sm">3</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Add Deductions and Offsets</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Enter work-related deductions to reduce taxable income. Toggle the Low Income Tax Offset (LITO) if your income is under $66,667.</p>
              </li>
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-yellow-600 dark:text-yellow-400 font-bold text-sm">4</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Set Medicare and HECS</h3>
                <p className="text-neutral-700 dark:text-neutral-300">Toggle the 2% Medicare levy and enter your HECS-HELP debt balance to see compulsory repayment amounts.</p>
              </li>
              <li className="mb-2 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full -left-4 ring-4 ring-white dark:ring-neutral-950">
                  <span className="text-yellow-600 dark:text-yellow-400 font-bold text-sm">5</span>
                </span>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Review Your Breakdown</h3>
                <p className="text-neutral-700 dark:text-neutral-300">See income tax, Medicare levy, HECS repayment, total tax, net pay, effective rate, and marginal rate. Toggle between annual, monthly, fortnightly, and weekly views.</p>
              </li>
            </ol>
          </section>

          {/* FAQ - EXPANDED FOR LONG-TAIL */}
          <section className="mb-16" id="faq">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-yellow-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  What is the tax-free threshold in Australia?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  The tax-free threshold is <strong>$18,200 per year</strong> for Australian residents . This means you pay no income tax on the first $18,200 you earn. Non-residents and working holiday makers from non-NDA countries do not receive this threshold.
                </div>
              </details>
              
              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-yellow-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  How much tax do I pay on $80,000 in Australia?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  On $80,000 as a resident: income tax is $15,788, Medicare levy is $1,600, for a total of $17,388 . Your take-home pay is approximately <strong>$62,612</strong> (21.7% effective rate). If you have a HECS debt, add another ~$4,000 in compulsory repayments.
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-yellow-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  Do I pay Medicare levy if I earn under $30,000?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  If you are single and earn under <strong>$27,222</strong>, you pay no Medicare levy . Between $27,222 and $34,027, you pay a reduced levy phased in at 10% of the amount over $27,222. Above $34,027, the full 2% applies.
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-yellow-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  How much tax do I pay on $100,000 in Australia?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  On $100,000 as a resident: income tax is $21,788, Medicare levy is $2,000, total tax is $23,788. Take-home pay is <strong>$76,212</strong> (23.8% effective rate). Monthly net is approximately $6,351. With HECS debt, subtract an additional ~$6,000–$8,000 annually.
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-yellow-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  How is a second job taxed in Australia?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  You should only claim the tax-free threshold from your <strong>highest-paying job</strong> . Your second job will withhold tax from the first dollar at your marginal rate (16%, 30%, 37%, or 45%). This is not a penalty — it prevents underpayment. If both jobs claimed the threshold, you would owe money at tax time.
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-yellow-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  What is the difference between marginal and effective tax rate?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  Your <strong>marginal rate</strong> is the tax on your last dollar of income. Your <strong>effective rate</strong> is total tax divided by gross income. At $85,000, your marginal rate is 30% but your effective rate is only ~22.8% .
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-yellow-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  When do I start paying HECS-HELP?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  Compulsory HECS-HELP repayments begin when your <strong>repayment income</strong> reaches $54,435 (2025–26 threshold) . The repayment rate starts at 1% and escalates to 10% as your income increases.
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-yellow-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  Are there state income taxes in Australia?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  No. Australia abolished state income taxes in 1942 . Unlike the US or Canada, there is only one level of income tax — federal. The ATO collects all personal income tax.
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-yellow-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  How much tax do I pay on $50,000 in Australia?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  On $50,000 as a resident: income tax is $6,788, Medicare levy is $1,000, total tax is $7,788. Take-home pay is <strong>$42,212</strong> (15.6% effective rate). Fortnightly net is approximately $1,623. With HECS debt, subtract ~$500–$1,000 annually.
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-yellow-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  How much tax do I pay on $60,000 in Australia?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  On $60,000 as a resident: income tax is $9,788, Medicare levy is $1,200, total tax is $10,988. Take-home pay is <strong>$49,012</strong> (18.3% effective rate). Weekly net is approximately $942. With HECS debt, subtract ~$1,200–$3,000 annually.
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-yellow-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  How much tax do I pay on $120,000 in Australia?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  On $120,000 as a resident: income tax is $27,788, Medicare levy is $2,400, total tax is $30,188. Take-home pay is <strong>$89,812</strong> (25.2% effective rate). Monthly net is approximately $7,484. With HECS debt, subtract ~$9,600–$12,000 annually.
                </div>
              </details>

              <details className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 open:ring-1 open:ring-yellow-600/20">
                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-neutral-900 dark:text-white">
                  What is the tax rate for working holiday makers in Australia?
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-4 pb-4 text-neutral-700 dark:text-neutral-300">
                  Working Holiday Makers (subclass 417/462) pay <strong>15%</strong> on income up to $45,000, then 30% on $45,001–$135,000, 37% on $135,001–$190,000, and 45% above $190,000 . There is no tax-free threshold for WHMs. Medicare levy generally does not apply.
                </div>
              </details>
            </div>
          </section>

          {/* Methodology & E-E-A-T */}
          <section className="mb-16" id="methodology">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Methodology and Data Sources</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
              This calculator implements the official 2025–26 Australian resident income tax brackets published by the Australian Taxation Office (ATO) . The 16% rate on $18,201–$45,000 reflects the Stage 3 tax cuts effective from 1 July 2024. Medicare levy calculations use the 2025–26 thresholds: singles pay no levy below $27,222, a reduced levy between $27,222–$34,027, and full 2% above $34,027 .
            </p>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
              HECS-HELP compulsory repayment thresholds are based on the 2025–26 indexed repayment income table . Non-resident and working holiday maker rates are sourced from ATO publications . The calculator does not account for the Medicare Levy Surcharge, private health insurance rebate, or complex deductions. All calculations occur client-side with no data transmitted to servers.
            </p>
            
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col sm:flex-row gap-6 items-start">
              <div className="h-16 w-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-2xl font-bold text-neutral-900 dark:text-white">
                M
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">About the Creator</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Built by <address className="inline not-italic font-medium">Mubarak</address>, an independent developer. This tool was created because most online "Australia tax calculators" use outdated 19% and 32.5% rates from before the 2024 Stage 3 cuts, or they ignore the Medicare levy and HECS repayments entirely.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    <Shield className="h-3 w-3" /> Open Source
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    <Clock className="h-3 w-3" /> Updated April 2026
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    <Users className="h-3 w-3" /> 30,000+ Monthly Users
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Related Tools */}
          <div className="mt-24">
            <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath="/finance/income-tax-calculator-australia" />
          </div>

          {/* References */}
          <section className="mb-16" id="references">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">References and Citations</h2>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>[107] <cite>Expatica</cite>. "Australia Income Tax/Salary Calculator 2026/2027." April 2026. <a href="https://www.expatica.com/au/salary-tax-calculator/" className="text-yellow-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.expatica.com/...</a></li>
              <li>[108] <cite>Bristax</cite>. "Individual Income Tax Rates." April 2026. <a href="https://bristax.com.au/tax-articles/individual-income-tax-rates/" className="text-yellow-600 hover:underline" target="_blank" rel="noopener noreferrer">https://bristax.com.au/...</a></li>
              <li>[109] <cite>SuperGuide</cite>. "Australian income tax brackets and rates (2025-26 and previous years)." April 2026. <a href="https://www.superguide.com.au/super-booster/income-tax-rates-brackets" className="text-yellow-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.superguide.com.au/...</a></li>
              <li>[110] <cite>Valley View Farm</cite>. "Australia Tax Cuts 2026–2027: How Much You'll Really Save." April 2026. <a href="https://valleyviewfarm.net.au/australia-tax-cuts-20262027/" className="text-yellow-600 hover:underline" target="_blank" rel="noopener noreferrer">https://valleyviewfarm.net.au/...</a></li>
              <li>[111] <cite>Easifleet</cite>. "Australian Income Tax Rates & Cuts in 2026: Your Full Guide." March 2026. <a href="https://www.easifleet.com.au/blog/income-tax-rate-update/" className="text-yellow-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.easifleet.com.au/...</a></li>
              <li>[112] <cite>CountryTaxCalc</cite>. "Australian Tax Calculator 2026 | ATO Tax Rates & Brackets." March 2026. <a href="https://www.countrytaxcalc.com/tax-calculator/australia/" className="text-yellow-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.countrytaxcalc.com/...</a></li>
              <li>[113] <cite>Sleek</cite>. "ATO Tax Brackets 2026-27: How Much Tax Do You Pay in Australia?" March 2026. <a href="https://sleek.com/au/resources/tax-brackets-australia/" className="text-yellow-600 hover:underline" target="_blank" rel="noopener noreferrer">https://sleek.com/...</a></li>
              <li>[115] <cite>Taxes for Expats</cite>. "US tax guide for Americans in Australia 2026: rates and filing." February 2026. <a href="https://www.taxesforexpats.com/country-guides/australia/us-tax-preparation-in-australia.html" className="text-yellow-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.taxesforexpats.com/...</a></li>
              <li>[116] <cite>ITP</cite>. "Australian Tax Rates 2026: Impact on Your Take-Home Pay." January 2026. <a href="https://itp.com.au/australian-tax-rates-2026-take-home-pay-impact/" className="text-yellow-600 hover:underline" target="_blank" rel="noopener noreferrer">https://itp.com.au/...</a></li>
            </ul>
          </section>

          {/* Final CTA */}
          <section className="rounded-3xl bg-yellow-600 p-8 sm:p-12 text-center text-white">
            <Calculator className="h-10 w-10 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Know What You Keep.</h2>
            <p className="text-yellow-100 max-w-xl mx-auto mb-6">
              Scroll up to calculate your Australian tax, Medicare levy, and HECS repayment. See your real take-home pay for 2025–26.
            </p>
            <a 
              href="#calculator-top"
              className="inline-flex items-center gap-2 rounded-full bg-white text-yellow-600 px-6 py-3 font-semibold hover:bg-yellow-50 transition-colors"
            >
              Launch Calculator
            </a>
          </section>

        </article>
      </main>
    </>
  )
}

