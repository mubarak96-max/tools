'use client'

import { useState, useMemo } from 'react'
import { 
  DollarSign, Calculator, Copy, Check, ChevronDown, TrendingUp,
  HeartPulse, GraduationCap, Landmark, Briefcase, Globe,
  Calendar, Info
} from 'lucide-react'

type Residency = 'resident' | 'non_resident' | 'working_holiday'
type PayFrequency = 'annual' | 'monthly' | 'fortnightly' | 'weekly'

// 2025-26 Resident brackets
const RESIDENT_BRACKETS = [
  { from: 0, to: 18200, rate: 0 },
  { from: 18201, to: 45000, rate: 0.16 },
  { from: 45001, to: 135000, rate: 0.30 },
  { from: 135001, to: 190000, rate: 0.37 },
  { from: 190001, to: Infinity, rate: 0.45 },
]

const NON_RESIDENT_BRACKETS = [
  { from: 0, to: 135000, rate: 0.30 },
  { from: 135001, to: 190000, rate: 0.37 },
  { from: 190001, to: Infinity, rate: 0.45 },
]

const WHM_BRACKETS = [
  { from: 0, to: 45000, rate: 0.15 },
  { from: 45001, to: 135000, rate: 0.30 },
  { from: 135001, to: 190000, rate: 0.37 },
  { from: 190001, to: Infinity, rate: 0.45 },
]

// HECS 2025-26 repayment thresholds
const HECS_BRACKETS = [
  { from: 0, to: 54435, rate: 0 },
  { from: 54436, to: 62439, rate: 0.01 },
  { from: 62440, to: 66887, rate: 0.02 },
  { from: 66888, to: 71610, rate: 0.03 },
  { from: 71611, to: 76698, rate: 0.04 },
  { from: 76699, to: 82196, rate: 0.05 },
  { from: 82197, to: 88170, rate: 0.06 },
  { from: 88171, to: 94694, rate: 0.07 },
  { from: 94695, to: 101857, rate: 0.08 },
  { from: 101858, to: 109756, rate: 0.09 },
  { from: 109757, to: 118498, rate: 0.10 },
  { from: 118499, to: Infinity, rate: 0.10 },
]

function calculateTax(income: number, brackets: { from: number; to: number; rate: number }[]): number {
  let tax = 0
  for (const bracket of brackets) {
    if (income <= bracket.from) break
    const taxableAtThisRate = Math.min(income, bracket.to) - bracket.from
    if (taxableAtThisRate > 0) tax += taxableAtThisRate * bracket.rate
  }
  return tax
}

function calculateMedicareLevy(taxableIncome: number): number {
  if (taxableIncome <= 27222) return 0
  if (taxableIncome >= 34027) return taxableIncome * 0.02
  // Phased: 10% of amount over 27222
  return (taxableIncome - 27222) * 0.10
}

function calculateLITO(taxableIncome: number): number {
  // Low Income Tax Offset 2025-26
  if (taxableIncome <= 37500) return 700
  if (taxableIncome <= 45000) return 700 - ((taxableIncome - 37500) * 0.05)
  if (taxableIncome <= 66667) return 325 - ((taxableIncome - 45000) * 0.015)
  return 0
}

function getMarginalRate(income: number, brackets: { from: number; to: number; rate: number }[]): number {
  for (const bracket of brackets) {
    if (income <= bracket.to) return bracket.rate
  }
  return 0.45
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(n)
}

export function AustraliaTaxTool() {
  const [income, setIncome] = useState(85000)
  const [residency, setResidency] = useState<Residency>('resident')
  const [deductions, setDeductions] = useState(0)
  const [hasHECS, setHasHECS] = useState(false)
  const [includeMedicare, setIncludeMedicare] = useState(true)
  const [includeLITO, setIncludeLITO] = useState(true)
  const [frequency, setFrequency] = useState<PayFrequency>('annual')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [copied, setCopied] = useState(false)

  const results = useMemo(() => {
    const taxableIncome = Math.max(0, income - deductions)
    
    let incomeTax = 0
    let marginalRate = 0
    let brackets = RESIDENT_BRACKETS
    
    if (residency === 'resident') {
      brackets = RESIDENT_BRACKETS
      incomeTax = calculateTax(taxableIncome, RESIDENT_BRACKETS)
      marginalRate = getMarginalRate(taxableIncome, RESIDENT_BRACKETS)
    } else if (residency === 'non_resident') {
      brackets = NON_RESIDENT_BRACKETS
      incomeTax = calculateTax(taxableIncome, NON_RESIDENT_BRACKETS)
      marginalRate = getMarginalRate(taxableIncome, NON_RESIDENT_BRACKETS)
    } else {
      brackets = WHM_BRACKETS
      incomeTax = calculateTax(taxableIncome, WHM_BRACKETS)
      marginalRate = getMarginalRate(taxableIncome, WHM_BRACKETS)
    }
    
    const medicare = (residency === 'resident' && includeMedicare) ? calculateMedicareLevy(taxableIncome) : 0
    const lito = (residency === 'resident' && includeLITO) ? calculateLITO(taxableIncome) : 0
    const hecs = hasHECS ? calculateTax(taxableIncome, HECS_BRACKETS) : 0
    
    const totalTax = Math.max(0, incomeTax + medicare - lito + hecs)
    const netPay = income - totalTax
    const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0
    
    const periods = { annual: 1, monthly: 12, fortnightly: 26, weekly: 52 }
    const p = periods[frequency]
    
    return {
      taxableIncome,
      incomeTax,
      medicare,
      lito,
      hecs,
      totalTax,
      netPay,
      marginalRate,
      effectiveRate,
      perPeriod: {
        gross: income / p,
        tax: totalTax / p,
        net: netPay / p,
      }
    }
  }, [income, residency, deductions, hasHECS, includeMedicare, includeLITO, frequency])

  const handleCopy = async () => {
    const text = `AUSTRALIAN INCOME TAX CALCULATION - 2025-26
Residency: ${residency === 'resident' ? 'Australian Resident' : residency === 'non_resident' ? 'Foreign Resident' : 'Working Holiday Maker'}
Gross Income: ${formatCurrency(income)}
Deductions: ${formatCurrency(deductions)}
Taxable Income: ${formatCurrency(results.taxableIncome)}

Income Tax: ${formatCurrency(results.incomeTax)}
Medicare Levy: ${formatCurrency(results.medicare)}
Low Income Offset: -${formatCurrency(results.lito)}
HECS Repayment: ${formatCurrency(results.hecs)}
Total Tax: ${formatCurrency(results.totalTax)}

NET PAY: ${formatCurrency(results.netPay)}
Effective Rate: ${results.effectiveRate.toFixed(1)}%
Marginal Rate: ${(results.marginalRate * 100).toFixed(0)}%`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const freqLabel = { annual: 'Annual', monthly: 'Monthly', fortnightly: 'Fortnightly', weekly: 'Weekly' }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid lg:grid-cols-5 gap-8">
        {/* LEFT: Inputs */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Basic Info */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-yellow-600" />
              Income & Residency
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Annual Gross Income (AUD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">$</span>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 pl-7 pr-3 py-2.5 text-lg font-semibold text-neutral-900 dark:text-slate-900 focus:border-yellow-500 outline-none"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">Residency Status</label>
                  <select
                    value={residency}
                    onChange={(e) => setResidency(e.target.value as Residency)}
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-sm text-neutral-900 dark:text-slate-900 focus:border-yellow-500 outline-none"
                  >
                    <option value="resident">🇦🇺 Australian Resident</option>
                    <option value="non_resident">🌏 Foreign Resident</option>
                    <option value="working_holiday">🎒 Working Holiday Maker</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">Pay Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as PayFrequency)}
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-sm text-neutral-900 dark:text-slate-900 focus:border-yellow-500 outline-none"
                  >
                    <option value="annual">Annual</option>
                    <option value="monthly">Monthly</option>
                    <option value="fortnightly">Fortnightly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">Tax Deductions (AUD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
                  <input
                    type="number"
                    value={deductions}
                    onChange={(e) => setDeductions(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 pl-6 pr-3 py-2 text-sm text-neutral-900 dark:text-slate-900 focus:border-yellow-500 outline-none"
                  />
                </div>
                <p className="text-[10px] text-neutral-400 mt-0.5">Work-related expenses, donations, etc.</p>
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 text-sm">Deductions & Levies</h3>
            <div className="space-y-3">
              {residency === 'resident' && (
                <>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeMedicare}
                      onChange={(e) => setIncludeMedicare(e.target.checked)}
                      className="rounded border-neutral-300 text-yellow-600 focus:ring-yellow-500 h-4 w-4"
                    />
                    <div>
                      <span className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">Include Medicare Levy (2%)</span>
                      <p className="text-[10px] text-neutral-400">Exempt below $27,222; reduced $27,222–$34,027</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeLITO}
                      onChange={(e) => setIncludeLITO(e.target.checked)}
                      className="rounded border-neutral-300 text-yellow-600 focus:ring-yellow-500 h-4 w-4"
                    />
                    <div>
                      <span className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">Include Low Income Tax Offset (LITO)</span>
                      <p className="text-[10px] text-neutral-400">Up to $700 for incomes under $66,667</p>
                    </div>
                  </label>
                </>
              )}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasHECS}
                  onChange={(e) => setHasHECS(e.target.checked)}
                  className="rounded border-neutral-300 text-yellow-600 focus:ring-yellow-500 h-4 w-4"
                />
                <div>
                  <span className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">Include HECS-HELP Repayment</span>
                  <p className="text-[10px] text-neutral-400">Compulsory repayment from $54,435 (1%–10%)</p>
                </div>
              </label>
            </div>
          </div>

          {/* Residency Info */}
          {residency === 'non_resident' && (
            <div className="rounded-xl border border-yellow-200 dark:border-yellow-900/30 bg-yellow-50 dark:bg-yellow-950/20 p-4">
              <p className="text-xs text-yellow-800 dark:text-yellow-300 flex items-start gap-2">
                <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                Foreign residents pay 30% from the first dollar with no tax-free threshold and no Medicare levy.
              </p>
            </div>
          )}
          {residency === 'working_holiday' && (
            <div className="rounded-xl border border-yellow-200 dark:border-yellow-900/30 bg-yellow-50 dark:bg-yellow-950/20 p-4">
              <p className="text-xs text-yellow-800 dark:text-yellow-300 flex items-start gap-2">
                <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                Working Holiday Makers (visa 417/462) pay 15% on the first $45,000, then standard resident brackets above.
              </p>
            </div>
          )}
        </div>

        {/* RIGHT: Results */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Net Pay Big Number */}
          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-950/20 p-6 text-center">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-600 mb-1">
              {freqLabel[frequency]} Take-Home Pay
            </p>
            <p className="text-4xl font-bold text-emerald-700 dark:text-emerald-600">
              {formatCurrency(results.perPeriod.net)}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">
              {formatCurrency(results.netPay)} annually
            </p>
          </div>

          {/* Rates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 text-center">
              <p className="text-xs text-neutral-500 mb-1">Marginal Rate</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">{(results.marginalRate * 100).toFixed(0)}%</p>
              <p className="text-[10px] text-neutral-400">on next dollar</p>
            </div>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 text-center">
              <p className="text-xs text-neutral-500 mb-1">Effective Rate</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">{results.effectiveRate.toFixed(1)}%</p>
              <p className="text-[10px] text-neutral-400">of gross income</p>
            </div>
          </div>

          {/* Breakdown */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 text-sm">Tax Breakdown (AUD)</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Gross Income</span>
                <span className="text-neutral-900 dark:text-white font-medium">{formatCurrency(income)}</span>
              </div>
              {deductions > 0 && (
                <div className="flex justify-between text-sm text-neutral-400">
                  <span>Deductions</span>
                  <span>-{formatCurrency(deductions)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500 pl-4">Taxable Income</span>
                <span className="text-neutral-900 dark:text-white">{formatCurrency(results.taxableIncome)}</span>
              </div>
              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2 mt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Income Tax</span>
                  <span className="text-red-600">-{formatCurrency(results.incomeTax)}</span>
                </div>
                {results.medicare > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Medicare Levy</span>
                    <span className="text-red-600">-{formatCurrency(results.medicare)}</span>
                  </div>
                )}
                {results.lito > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">LITO Offset</span>
                    <span className="text-green-600">+{formatCurrency(results.lito)}</span>
                  </div>
                )}
                {results.hecs > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">HECS Repayment</span>
                    <span className="text-red-600">-{formatCurrency(results.hecs)}</span>
                  </div>
                )}
              </div>
              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2 flex justify-between font-semibold">
                <span className="text-neutral-900 dark:text-white">Total Tax</span>
                <span className="text-red-600">{formatCurrency(results.totalTax)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-neutral-900 dark:text-white">Net Pay</span>
                <span className="text-emerald-600">{formatCurrency(results.netPay)}</span>
              </div>
            </div>
          </div>

          {/* Bracket Fill */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-3 text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-yellow-600" />
              Bracket Progress
            </h3>
            <div className="space-y-2">
              {(residency === 'resident' ? RESIDENT_BRACKETS : residency === 'non_resident' ? NON_RESIDENT_BRACKETS : WHM_BRACKETS).map((bracket, i) => {
                const fillAmount = Math.max(0, Math.min(results.taxableIncome, bracket.to) - bracket.from)
                const fillPercent = bracket.to === Infinity 
                  ? (results.taxableIncome > bracket.from ? 100 : 0)
                  : (fillAmount / (bracket.to - bracket.from)) * 100
                
                if (fillAmount <= 0 && results.taxableIncome < bracket.from) return null
                
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-600 dark:text-neutral-400">
                        {(bracket.rate * 100).toFixed(0)}% bracket
                      </span>
                      <span className="text-neutral-500">
                        {formatCurrency(fillAmount)} taxed
                      </span>
                    </div>
                    <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-500 rounded-full"
                        style={{ width: `${Math.min(fillPercent, 100)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Copy */}
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 py-3 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Report Copied!' : 'Copy Breakdown'}
          </button>
        </div>
      </div>
    </div>
  )
}
