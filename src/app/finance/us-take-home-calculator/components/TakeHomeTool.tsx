'use client'

import { useState, useMemo } from 'react'
import { 
  DollarSign, Landmark, HeartPulse, PiggyBank, Briefcase, Percent,
  Copy, Check, ChevronDown, TrendingUp, Info, Calculator,
  Calendar, ArrowDown
} from 'lucide-react'

type FilingStatus = 'single' | 'married' | 'head'
type PayFrequency = 'annual' | 'monthly' | 'biweekly' | 'weekly'

interface TaxBracket {
  rate: number
  from: number
  to: number
}

const BRACKETS: Record<FilingStatus, TaxBracket[]> = {
  single: [
    { rate: 0.10, from: 0, to: 12400 },
    { rate: 0.12, from: 12401, to: 50400 },
    { rate: 0.22, from: 50401, to: 105700 },
    { rate: 0.24, from: 105701, to: 201775 },
    { rate: 0.32, from: 201776, to: 256225 },
    { rate: 0.35, from: 256226, to: 640600 },
    { rate: 0.37, from: 640601, to: Infinity },
  ],
  married: [
    { rate: 0.10, from: 0, to: 24800 },
    { rate: 0.12, from: 24801, to: 100800 },
    { rate: 0.22, from: 100801, to: 211400 },
    { rate: 0.24, from: 211401, to: 403550 },
    { rate: 0.32, from: 403551, to: 512450 },
    { rate: 0.35, from: 512451, to: 768700 },
    { rate: 0.37, from: 768701, to: Infinity },
  ],
  head: [
    { rate: 0.10, from: 0, to: 17700 },
    { rate: 0.12, from: 17701, to: 67450 },
    { rate: 0.22, from: 67451, to: 105700 },
    { rate: 0.24, from: 105701, to: 201775 },
    { rate: 0.32, from: 201776, to: 256200 },
    { rate: 0.35, from: 256201, to: 640600 },
    { rate: 0.37, from: 640601, to: Infinity },
  ],
}

const STANDARD_DEDUCTION: Record<FilingStatus, number> = {
  single: 16100,
  married: 32200,
  head: 24150,
}

const SS_WAGE_BASE = 184500
const SS_RATE = 0.062
const MEDICARE_RATE = 0.0145
const ADDITIONAL_MEDICARE_RATE = 0.009
const ADDITIONAL_MEDICARE_THRESHOLD = 200000

const STATE_TAX_OPTIONS = [
  { name: 'None / No Income Tax', rate: 0 },
  { name: 'Alabama', rate: 0.05 },
  { name: 'Arizona', rate: 0.025 },
  { name: 'Arkansas', rate: 0.047 },
  { name: 'California', rate: 0.093 },
  { name: 'Colorado', rate: 0.044 },
  { name: 'Connecticut', rate: 0.05 },
  { name: 'Delaware', rate: 0.052 },
  { name: 'Florida', rate: 0 },
  { name: 'Georgia', rate: 0.0549 },
  { name: 'Hawaii', rate: 0.0825 },
  { name: 'Idaho', rate: 0.058 },
  { name: 'Illinois', rate: 0.0495 },
  { name: 'Indiana', rate: 0.0315 },
  { name: 'Iowa', rate: 0.0575 },
  { name: 'Kansas', rate: 0.057 },
  { name: 'Kentucky', rate: 0.045 },
  { name: 'Louisiana', rate: 0.0425 },
  { name: 'Maine', rate: 0.0715 },
  { name: 'Maryland', rate: 0.0575 },
  { name: 'Massachusetts', rate: 0.05 },
  { name: 'Michigan', rate: 0.0425 },
  { name: 'Minnesota', rate: 0.076 },
  { name: 'Mississippi', rate: 0.05 },
  { name: 'Missouri', rate: 0.0495 },
  { name: 'Montana', rate: 0.0675 },
  { name: 'Nebraska', rate: 0.0664 },
  { name: 'Nevada', rate: 0 },
  { name: 'New Hampshire', rate: 0 },
  { name: 'New Jersey', rate: 0.0637 },
  { name: 'New Mexico', rate: 0.049 },
  { name: 'New York', rate: 0.0645 },
  { name: 'North Carolina', rate: 0.0475 },
  { name: 'North Dakota', rate: 0.0227 },
  { name: 'Ohio', rate: 0.0399 },
  { name: 'Oklahoma', rate: 0.0475 },
  { name: 'Oregon', rate: 0.0875 },
  { name: 'Pennsylvania', rate: 0.0307 },
  { name: 'Rhode Island', rate: 0.0599 },
  { name: 'South Carolina', rate: 0.064 },
  { name: 'South Dakota', rate: 0 },
  { name: 'Tennessee', rate: 0 },
  { name: 'Texas', rate: 0 },
  { name: 'Utah', rate: 0.0465 },
  { name: 'Vermont', rate: 0.0875 },
  { name: 'Virginia', rate: 0.0575 },
  { name: 'Washington', rate: 0 },
  { name: 'Washington DC', rate: 0.085 },
  { name: 'West Virginia', rate: 0.0512 },
  { name: 'Wisconsin', rate: 0.065 },
  { name: 'Wyoming', rate: 0 },
]

function calculateFederalTax(taxableIncome: number, status: FilingStatus): number {
  let tax = 0
  for (const bracket of BRACKETS[status]) {
    if (taxableIncome <= bracket.from) break
    const taxableAtThisRate = Math.min(taxableIncome, bracket.to) - bracket.from
    if (taxableAtThisRate > 0) {
      tax += taxableAtThisRate * bracket.rate
    }
  }
  return tax
}

function getMarginalRate(taxableIncome: number, status: FilingStatus): number {
  for (const bracket of BRACKETS[status]) {
    if (taxableIncome <= bracket.to) return bracket.rate
  }
  return 0.37
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

export function TakeHomeTool() {
  const [salary, setSalary] = useState(85000)
  const [frequency, setFrequency] = useState<PayFrequency>('biweekly')
  const [status, setStatus] = useState<FilingStatus>('single')
  
  // Pre-tax deductions
  const [amount401k, setAmount401k] = useState(0)
  const [hsaAmount, setHsaAmount] = useState(0)
  const [fsaAmount, setFsaAmount] = useState(0)
  const [healthPremium, setHealthPremium] = useState(0)
  
  // Post-tax / other
  const [roth401k, setRoth401k] = useState(0)
  const [otherDeductions, setOtherDeductions] = useState(0)
  
  // State
  const [stateRate, setStateRate] = useState(0)
  const [customStateRate, setCustomStateRate] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [copied, setCopied] = useState(false)

  const results = useMemo(() => {
    const totalPreTax = Math.min(amount401k, 24500) + Math.min(hsaAmount, 8550) + Math.min(fsaAmount, 3300) + healthPremium
    const totalPostTax = Math.min(roth401k, 24500) + otherDeductions
    
    const adjustedGross = Math.max(0, salary - totalPreTax)
    const standardDeduction = STANDARD_DEDUCTION[status]
    const taxableIncome = Math.max(0, adjustedGross - standardDeduction)
    
    const federalTax = calculateFederalTax(taxableIncome, status)
    const marginalRate = getMarginalRate(taxableIncome, status)
    
    // FICA
    const ssTax = Math.min(salary, SS_WAGE_BASE) * SS_RATE
    const medicareTax = salary * MEDICARE_RATE
    const additionalMedicare = salary > ADDITIONAL_MEDICARE_THRESHOLD 
      ? (salary - ADDITIONAL_MEDICARE_THRESHOLD) * ADDITIONAL_MEDICARE_RATE 
      : 0
    const totalFica = ssTax + medicareTax + additionalMedicare
    
    // State tax
    const effectiveStateRate = stateRate > 0 ? stateRate : (Number(customStateRate) || 0) / 100
    const stateTax = adjustedGross * effectiveStateRate
    
    const totalTax = federalTax + totalFica + stateTax
    const netPay = salary - totalTax - totalPreTax - totalPostTax
    
    const effectiveFederalRate = salary > 0 ? federalTax / salary : 0
    const effectiveTotalRate = salary > 0 ? (totalTax + totalPreTax + totalPostTax) / salary : 0
    
    // Per-paycheck
    const periods = { annual: 1, monthly: 12, biweekly: 26, weekly: 52 }
    const periodCount = periods[frequency]
    
    return {
      gross: salary,
      totalPreTax,
      totalPostTax,
      adjustedGross,
      standardDeduction,
      taxableIncome,
      federalTax,
      marginalRate,
      ssTax,
      medicareTax,
      additionalMedicare,
      totalFica,
      stateTax,
      totalTax,
      netPay,
      effectiveFederalRate,
      effectiveTotalRate,
      perPaycheck: {
        gross: salary / periodCount,
        federalTax: federalTax / periodCount,
        fica: totalFica / periodCount,
        stateTax: stateTax / periodCount,
        preTax: totalPreTax / periodCount,
        postTax: totalPostTax / periodCount,
        netPay: netPay / periodCount,
      }
    }
  }, [salary, frequency, status, amount401k, hsaAmount, fsaAmount, healthPremium, roth401k, otherDeductions, stateRate, customStateRate])

  const handleCopy = async () => {
    const text = `2026 TAKE-HOME PAY ESTIMATE
Gross Salary: ${formatCurrency(results.gross)}
Filing Status: ${status}
Pay Frequency: ${frequency}

DEDUCTIONS:
401(k) Pre-Tax: ${formatCurrency(Math.min(amount401k, 24500))}
HSA: ${formatCurrency(Math.min(hsaAmount, 8550))}
FSA: ${formatCurrency(Math.min(fsaAmount, 3300))}
Health Premium: ${formatCurrency(healthPremium)}
Roth 401(k): ${formatCurrency(Math.min(roth401k, 24500))}

TAXES:
Federal Income Tax: ${formatCurrency(results.federalTax)}
Social Security: ${formatCurrency(results.ssTax)}
Medicare: ${formatCurrency(results.medicareTax)}
Additional Medicare: ${formatCurrency(results.additionalMedicare)}
State Tax: ${formatCurrency(results.stateTax)}

NET PAY:
Annual: ${formatCurrency(results.netPay)}
Per Paycheck: ${formatCurrency(results.perPaycheck.netPay)}
Effective Tax Rate: ${(results.effectiveTotalRate * 100).toFixed(1)}%`
    
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const freqLabel = { annual: 'Annual', monthly: 'Monthly', biweekly: 'Biweekly', weekly: 'Weekly' }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid lg:grid-cols-5 gap-8">
        {/* LEFT: Inputs (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Salary & Status */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-sky-600" />
              Salary & Filing Status
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Annual Gross Salary</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">$</span>
                  <input
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 pl-7 pr-3 py-2.5 text-lg font-semibold text-neutral-900 dark:text-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Pay Frequency</label>
                  <div className="relative">
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value as PayFrequency)}
                      className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2.5 text-sm text-neutral-900 dark:text-white focus:border-sky-500 outline-none appearance-none"
                    >
                      <option value="annual">Annual</option>
                      <option value="monthly">Monthly (12)</option>
                      <option value="biweekly">Biweekly (26)</option>
                      <option value="weekly">Weekly (52)</option>
                    </select>
                    <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Filing Status</label>
                  <div className="relative">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as FilingStatus)}
                      className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2.5 text-sm text-neutral-900 dark:text-white focus:border-sky-500 outline-none appearance-none"
                    >
                      <option value="single">Single</option>
                      <option value="married">Married Filing Jointly</option>
                      <option value="head">Head of Household</option>
                    </select>
                    <Briefcase className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pre-Tax Deductions */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <PiggyBank className="h-4 w-4 text-sky-600" />
              Pre-Tax Deductions
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">401(k) Pre-Tax</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
                  <input
                    type="number"
                    value={amount401k}
                    onChange={(e) => setAmount401k(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 pl-6 pr-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-sky-500 outline-none"
                  />
                </div>
                <p className="text-[10px] text-neutral-400 mt-0.5">2026 limit: $24,500</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">HSA Contribution</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
                  <input
                    type="number"
                    value={hsaAmount}
                    onChange={(e) => setHsaAmount(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 pl-6 pr-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-sky-500 outline-none"
                  />
                </div>
                <p className="text-[10px] text-neutral-400 mt-0.5">Limit: $4,300 (single) / $8,550 (family)</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">FSA (Health)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
                  <input
                    type="number"
                    value={fsaAmount}
                    onChange={(e) => setFsaAmount(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 pl-6 pr-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-sky-500 outline-none"
                  />
                </div>
                <p className="text-[10px] text-neutral-400 mt-0.5">2026 limit: $3,300</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1">Health Insurance Premium</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
                  <input
                    type="number"
                    value={healthPremium}
                    onChange={(e) => setHealthPremium(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 pl-6 pr-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-sky-500 outline-none"
                  />
                </div>
                <p className="text-[10px] text-neutral-400 mt-0.5">Annual amount</p>
              </div>
            </div>
          </div>

          {/* State Tax */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <Landmark className="h-4 w-4 text-sky-600" />
              State Income Tax
            </h3>
            <div className="space-y-3">
              <div className="relative">
                <select
                  value={stateRate}
                  onChange={(e) => {
                    setStateRate(Number(e.target.value))
                    setCustomStateRate('')
                  }}
                  className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2.5 text-sm text-neutral-900 dark:text-white focus:border-sky-500 outline-none appearance-none"
                >
                  <option value={0}>Select your state...</option>
                  {STATE_TAX_OPTIONS.map((s, i) => (
                    <option key={i} value={s.rate}>{s.name} ({(s.rate * 100).toFixed(2)}%)</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500">Or enter custom rate:</span>
                <div className="relative flex-1">
                  <input
                    type="number"
                    step="0.01"
                    value={customStateRate}
                    onChange={(e) => {
                      setCustomStateRate(e.target.value)
                      setStateRate(0)
                    }}
                    placeholder="e.g. 5.5"
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-1.5 text-sm text-neutral-900 dark:text-white focus:border-sky-500 outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              {showAdvanced ? <ChevronDown className="h-4 w-4" /> : <ChevronDown className="h-4 w-4 rotate-[-90deg]" />}
              Advanced Deductions
            </button>
            
            {showAdvanced && (
              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">Roth 401(k)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
                    <input
                      type="number"
                      value={roth401k}
                      onChange={(e) => setRoth401k(Number(e.target.value))}
                      className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 pl-6 pr-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-sky-500 outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Post-tax (does not reduce taxable income)</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">Other Deductions</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
                    <input
                      type="number"
                      value={otherDeductions}
                      onChange={(e) => setOtherDeductions(Number(e.target.value))}
                      className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 pl-6 pr-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-sky-500 outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Life insurance, union dues, etc.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Results (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Net Pay Big Number */}
          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-950/20 p-6 text-center">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-1">
              Net {freqLabel[frequency]} Pay
            </p>
            <p className="text-4xl font-bold text-emerald-700 dark:text-emerald-400">
              {formatCurrency(results.perPaycheck.netPay)}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">
              {formatCurrency(results.netPay)} annually
            </p>
          </div>

          {/* Tax Rates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 text-center">
              <p className="text-xs text-neutral-500 mb-1">Marginal Rate</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">{(results.marginalRate * 100).toFixed(0)}%</p>
              <p className="text-[10px] text-neutral-400">federal only</p>
            </div>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 text-center">
              <p className="text-xs text-neutral-500 mb-1">Effective Rate</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">{(results.effectiveTotalRate * 100).toFixed(1)}%</p>
              <p className="text-[10px] text-neutral-400">all deductions</p>
            </div>
          </div>

          {/* Breakdown */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 text-sm">Annual Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Gross Salary</span>
                <span className="text-neutral-900 dark:text-white font-medium">{formatCurrency(results.gross)}</span>
              </div>
              <div className="flex justify-between text-sm text-red-600">
                <span className="flex items-center gap-1"><ArrowDown className="h-3 w-3" /> Pre-Tax Deductions</span>
                <span>-{formatCurrency(results.totalPreTax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500 pl-4">Adjusted Gross</span>
                <span className="text-neutral-900 dark:text-white">{formatCurrency(results.adjustedGross)}</span>
              </div>
              <div className="flex justify-between text-sm text-red-600">
                <span className="flex items-center gap-1"><ArrowDown className="h-3 w-3" /> Standard Deduction</span>
                <span>-{formatCurrency(results.standardDeduction)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500 pl-4">Taxable Income</span>
                <span className="text-neutral-900 dark:text-white font-medium">{formatCurrency(results.taxableIncome)}</span>
              </div>
              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2 mt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Federal Income Tax</span>
                  <span className="text-red-600">-{formatCurrency(results.federalTax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Social Security (6.2%)</span>
                  <span className="text-red-600">-{formatCurrency(results.ssTax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Medicare (1.45%)</span>
                  <span className="text-red-600">-{formatCurrency(results.medicareTax)}</span>
                </div>
                {results.additionalMedicare > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Add. Medicare (0.9%)</span>
                    <span className="text-red-600">-{formatCurrency(results.additionalMedicare)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">State Income Tax</span>
                  <span className="text-red-600">-{formatCurrency(results.stateTax)}</span>
                </div>
                {results.totalPostTax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Post-Tax Deductions</span>
                    <span className="text-red-600">-{formatCurrency(results.totalPostTax)}</span>
                  </div>
                )}
              </div>
              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2 flex justify-between font-semibold">
                <span className="text-neutral-900 dark:text-white">Net Pay</span>
                <span className="text-emerald-600">{formatCurrency(results.netPay)}</span>
              </div>
            </div>
          </div>

          {/* Per Paycheck */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 text-sm">
              Per {freqLabel[frequency]} Breakdown
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Gross</span>
                <span className="text-neutral-900 dark:text-white">{formatCurrency(results.perPaycheck.gross)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Federal Tax</span>
                <span className="text-red-600">-{formatCurrency(results.perPaycheck.federalTax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">FICA</span>
                <span className="text-red-600">-{formatCurrency(results.perPaycheck.fica)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">State Tax</span>
                <span className="text-red-600">-{formatCurrency(results.perPaycheck.stateTax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Pre-Tax Deductions</span>
                <span className="text-red-600">-{formatCurrency(results.perPaycheck.preTax)}</span>
              </div>
              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2 flex justify-between font-semibold">
                <span className="text-neutral-900 dark:text-white">Net Pay</span>
                <span className="text-emerald-600">{formatCurrency(results.perPaycheck.netPay)}</span>
              </div>
            </div>
          </div>

          {/* Bracket Visualization */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-3 text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-sky-600" />
              Federal Bracket Fill
            </h3>
            <div className="space-y-2">
              {BRACKETS[status].map((bracket, i) => {
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
                        className="h-full bg-sky-500 rounded-full"
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
            {copied ? 'Report Copied!' : 'Copy Full Report'}
          </button>
        </div>
      </div>
    </div>
  )
}
