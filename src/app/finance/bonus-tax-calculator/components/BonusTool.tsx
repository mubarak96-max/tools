'use client'

import { useState, useMemo } from 'react'
import { 
  Gift, Building2, DollarSign, Percent, Copy, Check, ChevronDown,
  TrendingUp, Info, Calculator, ArrowRightLeft, Landmark
} from 'lucide-react'

type Mode = 'paycheck' | 'depreciation'
type WithholdingMethod = 'percentage' | 'aggregate'

// US 2026 FICA constants
const SS_WAGE_BASE = 184500
const SS_RATE = 0.062
const MEDICARE_RATE = 0.0145
const ADDITIONAL_MEDICARE_RATE = 0.009
const ADDITIONAL_MEDICARE_THRESHOLD = 200000

const STATE_TAX_OPTIONS = [
  { name: 'None / No Income Tax', rate: 0 },
  { name: 'California', rate: 0.093 },
  { name: 'New York', rate: 0.0645 },
  { name: 'Texas', rate: 0 },
  { name: 'Florida', rate: 0 },
  { name: 'Illinois', rate: 0.0495 },
  { name: 'Pennsylvania', rate: 0.0307 },
  { name: 'Ohio', rate: 0.0399 },
  { name: 'Georgia', rate: 0.0549 },
  { name: 'North Carolina', rate: 0.0475 },
  { name: 'Michigan', rate: 0.0425 },
  { name: 'New Jersey', rate: 0.0637 },
  { name: 'Virginia', rate: 0.0575 },
  { name: 'Washington', rate: 0 },
  { name: 'Massachusetts', rate: 0.05 },
  { name: 'Arizona', rate: 0.025 },
  { name: 'Tennessee', rate: 0 },
  { name: 'Nevada', rate: 0 },
]

const BONUS_DEPRECIATION_RATES: Record<number, number> = {
  2023: 80, 2024: 60, 2025: 40, 2026: 20, 2027: 0,
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export function BonusTool() {
  const [mode, setMode] = useState<Mode>('paycheck')
  
  // Paycheck state
  const [bonusAmount, setBonusAmount] = useState(10000)
  const [method, setMethod] = useState<WithholdingMethod>('percentage')
  const [regularSalary, setRegularSalary] = useState(4000)
  const [payFrequency, setPayFrequency] = useState('biweekly')
  const [ytdSupplemental, setYtdSupplemental] = useState(0)
  const [stateRate, setStateRate] = useState(0)
  const [customStateRate, setCustomStateRate] = useState('')
  const [percent401k, setPercent401k] = useState(0)
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  // Depreciation state
  const [assetCost, setAssetCost] = useState(500000)
  const [placedInServiceYear, setPlacedInServiceYear] = useState(2026)
  const [propertyClass, setPropertyClass] = useState('5') // 5-year MACRS
  const [section179, setSection179] = useState(0)
  
  const [copied, setCopied] = useState(false)

  // Paycheck calculations
  const paycheckResults = useMemo(() => {
    const effectiveStateRate = stateRate > 0 ? stateRate : (Number(customStateRate) || 0) / 100
    
    let federalWithholding = 0
    let federalRate = 0
    
    if (method === 'percentage') {
      const remainingUnder1M = Math.max(0, 1000000 - ytdSupplemental)
      const amountAt22 = Math.min(bonusAmount, remainingUnder1M)
      const amountAt37 = bonusAmount - amountAt22
      
      federalWithholding = amountAt22 * 0.22 + amountAt37 * 0.37
      federalRate = amountAt37 > 0 ? 37 : 22
    } else {
      // Aggregate method: simplified estimate
      // Add bonus to regular pay, estimate withholding on total, subtract regular withholding
      const combined = regularSalary + bonusAmount
      // Simplified progressive estimate for aggregate
      const annualized = combined * 26 // assume biweekly for simplicity
      let taxOnCombined = 0
      if (annualized <= 12400) taxOnCombined = 0
      else if (annualized <= 50400) taxOnCombined = (annualized - 12400) * 0.12
      else if (annualized <= 105700) taxOnCombined = 4560 + (annualized - 50400) * 0.22
      else if (annualized <= 201775) taxOnCombined = 16726 + (annualized - 105700) * 0.24
      else taxOnCombined = 39814 + (annualized - 201775) * 0.32
      
      const regularAnnualized = regularSalary * 26
      let taxOnRegular = 0
      if (regularAnnualized <= 12400) taxOnRegular = 0
      else if (regularAnnualized <= 50400) taxOnRegular = (regularAnnualized - 12400) * 0.12
      else if (regularAnnualized <= 105700) taxOnRegular = 4560 + (regularAnnualized - 50400) * 0.22
      else if (regularAnnualized <= 201775) taxOnRegular = 16726 + (regularAnnualized - 105700) * 0.24
      else taxOnRegular = 39814 + (regularAnnualized - 201775) * 0.32
      
      federalWithholding = (taxOnCombined - taxOnRegular) / 26
      federalRate = (federalWithholding / bonusAmount) * 100
    }
    
    const preTax401k = bonusAmount * (percent401k / 100)
    const taxableBonus = bonusAmount - preTax401k
    
    // Recalculate federal on taxable amount if using percentage
    if (method === 'percentage') {
      const remainingUnder1M = Math.max(0, 1000000 - ytdSupplemental)
      const amountAt22 = Math.min(taxableBonus, remainingUnder1M)
      const amountAt37 = taxableBonus - amountAt22
      federalWithholding = amountAt22 * 0.22 + amountAt37 * 0.37
    }
    
    // FICA on full bonus (before 401k for SS/Medicare)
    const ssTax = Math.min(bonusAmount, Math.max(0, SS_WAGE_BASE - (regularSalary * 26))) * SS_RATE
    const medicareTax = bonusAmount * MEDICARE_RATE
    const additionalMedicare = (regularSalary * 26 + bonusAmount) > ADDITIONAL_MEDICARE_THRESHOLD 
      ? Math.max(0, (regularSalary * 26 + bonusAmount) - ADDITIONAL_MEDICARE_THRESHOLD) * ADDITIONAL_MEDICARE_RATE 
      : 0
    const totalFica = ssTax + medicareTax + additionalMedicare
    
    const stateTax = taxableBonus * effectiveStateRate
    const totalDeductions = federalWithholding + totalFica + stateTax + preTax401k
    const netBonus = bonusAmount - totalDeductions
    
    return {
      federalWithholding,
      federalRate,
      ssTax,
      medicareTax,
      additionalMedicare,
      totalFica,
      stateTax,
      preTax401k,
      totalDeductions,
      netBonus,
      effectiveRate: bonusAmount > 0 ? (totalDeductions / bonusAmount) * 100 : 0
    }
  }, [bonusAmount, method, regularSalary, ytdSupplemental, stateRate, customStateRate, percent401k])

  // Depreciation calculations
  const depreciationResults = useMemo(() => {
    const bonusRate = BONUS_DEPRECIATION_RATES[placedInServiceYear] || 0
    const afterSection179 = Math.max(0, assetCost - section179)
    const bonusDeduction = afterSection179 * (bonusRate / 100)
    const remainingBasis = afterSection179 - bonusDeduction
    
    // Simplified MACRS for remaining basis (first year only, half-year convention)
    const macrsRate = propertyClass === '3' ? 0.3333 : propertyClass === '5' ? 0.20 : propertyClass === '7' ? 0.1429 : 0.10
    const regularDepreciation = remainingBasis * macrsRate
    const totalFirstYear = bonusDeduction + regularDepreciation + section179
    
    return {
      bonusRate,
      afterSection179,
      bonusDeduction,
      remainingBasis,
      regularDepreciation,
      totalFirstYear,
      section179
    }
  }, [assetCost, placedInServiceYear, propertyClass, section179])

  const handleCopy = async () => {
    let text = ''
    if (mode === 'paycheck') {
      text = `BONUS PAYCHECK CALCULATION
Gross Bonus: ${formatCurrency(bonusAmount)}
Method: ${method === 'percentage' ? 'Percentage (22% flat)' : 'Aggregate'}

Federal Withholding: ${formatCurrency(paycheckResults.federalWithholding)}
Social Security: ${formatCurrency(paycheckResults.ssTax)}
Medicare: ${formatCurrency(paycheckResults.medicareTax)}
State Tax: ${formatCurrency(paycheckResults.stateTax)}
401(k) Pre-Tax: ${formatCurrency(paycheckResults.preTax401k)}

Total Deductions: ${formatCurrency(paycheckResults.totalDeductions)}
Net Bonus: ${formatCurrency(paycheckResults.netBonus)}
Effective Rate: ${paycheckResults.effectiveRate.toFixed(1)}%`
    } else {
      text = `BONUS DEPRECIATION CALCULATION
Asset Cost: ${formatCurrency(assetCost)}
Placed in Service: ${placedInServiceYear}
Property Class: ${propertyClass}-year MACRS

Section 179: ${formatCurrency(depreciationResults.section179)}
Bonus Depreciation (${depreciationResults.bonusRate}%): ${formatCurrency(depreciationResults.bonusDeduction)}
Regular MACRS (Year 1): ${formatCurrency(depreciationResults.regularDepreciation)}

Total First-Year Deduction: ${formatCurrency(depreciationResults.totalFirstYear)}
Remaining Basis: ${formatCurrency(depreciationResults.remainingBasis)}`
    }
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-full bg-neutral-100 dark:bg-neutral-800 p-1">
          <button
            onClick={() => setMode('paycheck')}
            className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
              mode === 'paycheck' 
                ? 'bg-white dark:bg-neutral-700 text-violet-600 dark:text-violet-400 shadow-sm' 
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Gift className="h-4 w-4" />
            Employee Bonus Tax
          </button>
          <button
            onClick={() => setMode('depreciation')}
            className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
              mode === 'depreciation' 
                ? 'bg-white dark:bg-neutral-700 text-violet-600 dark:text-violet-400 shadow-sm' 
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Building2 className="h-4 w-4" />
            Business Bonus Depreciation
          </button>
        </div>
      </div>

      {mode === 'paycheck' ? (
        <div className="grid lg:grid-cols-5 gap-8">
          {/* LEFT: Inputs */}
          <div className="lg:col-span-3 space-y-6">
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                <Gift className="h-4 w-4 text-violet-600" />
                Bonus Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Gross Bonus Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">$</span>
                    <input
                      type="number"
                      value={bonusAmount}
                      onChange={(e) => setBonusAmount(Number(e.target.value))}
                      className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 pl-7 pr-3 py-2.5 text-lg font-semibold text-neutral-900 dark:text-white focus:border-violet-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1">Withholding Method</label>
                    <select
                      value={method}
                      onChange={(e) => setMethod(e.target.value as WithholdingMethod)}
                      className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-violet-500 outline-none"
                    >
                      <option value="percentage">Percentage (22% flat)</option>
                      <option value="aggregate">Aggregate Method</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1">YTD Supplemental Wages</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
                      <input
                        type="number"
                        value={ytdSupplemental}
                        onChange={(e) => setYtdSupplemental(Number(e.target.value))}
                        className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 pl-6 pr-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-violet-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {method === 'aggregate' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 mb-1">Regular Pay Per Period</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
                        <input
                          type="number"
                          value={regularSalary}
                          onChange={(e) => setRegularSalary(Number(e.target.value))}
                          className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 pl-6 pr-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-violet-500 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 mb-1">Pay Frequency</label>
                      <select
                        value={payFrequency}
                        onChange={(e) => setPayFrequency(e.target.value)}
                        className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-violet-500 outline-none"
                      >
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Biweekly</option>
                        <option value="semimonthly">Semimonthly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">State Income Tax</label>
                  <div className="space-y-2">
                    <select
                      value={stateRate}
                      onChange={(e) => {
                        setStateRate(Number(e.target.value))
                        setCustomStateRate('')
                      }}
                      className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-violet-500 outline-none"
                    >
                      <option value={0}>Select state...</option>
                      {STATE_TAX_OPTIONS.map((s, i) => (
                        <option key={i} value={s.rate}>{s.name}</option>
                      ))}
                    </select>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-500">Or custom %:</span>
                      <input
                        type="number"
                        step="0.1"
                        value={customStateRate}
                        onChange={(e) => {
                          setCustomStateRate(e.target.value)
                          setStateRate(0)
                        }}
                        className="flex-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-1.5 text-sm text-neutral-900 dark:text-white focus:border-violet-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  <ChevronDown className={`h-3 w-3 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                  Advanced (401k, etc.)
                </button>

                {showAdvanced && (
                  <div className="space-y-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 mb-1">401(k) Contribution (% of bonus)</label>
                      <input
                        type="number"
                        value={percent401k}
                        onChange={(e) => setPercent401k(Number(e.target.value))}
                        className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-violet-500 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Results */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-950/20 p-6 text-center">
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-1">Net Bonus</p>
              <p className="text-4xl font-bold text-emerald-700 dark:text-emerald-400">{formatCurrency(paycheckResults.netBonus)}</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">
                {paycheckResults.effectiveRate.toFixed(1)}% effective rate
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 text-sm">Deduction Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Gross Bonus</span>
                  <span className="text-neutral-900 dark:text-white font-medium">{formatCurrency(bonusAmount)}</span>
                </div>
                {paycheckResults.preTax401k > 0 && (
                  <div className="flex justify-between text-sm text-neutral-500">
                    <span>401(k) Pre-Tax</span>
                    <span>-{formatCurrency(paycheckResults.preTax401k)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Federal Withholding</span>
                  <span className="text-red-600">-{formatCurrency(paycheckResults.federalWithholding)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Social Security</span>
                  <span className="text-red-600">-{formatCurrency(paycheckResults.ssTax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Medicare</span>
                  <span className="text-red-600">-{formatCurrency(paycheckResults.medicareTax)}</span>
                </div>
                {paycheckResults.additionalMedicare > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Add. Medicare</span>
                    <span className="text-red-600">-{formatCurrency(paycheckResults.additionalMedicare)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">State Tax</span>
                  <span className="text-red-600">-{formatCurrency(paycheckResults.stateTax)}</span>
                </div>
                <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2 mt-2 flex justify-between font-semibold">
                  <span className="text-neutral-900 dark:text-white">Total Deductions</span>
                  <span className="text-red-600">{formatCurrency(paycheckResults.totalDeductions)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-neutral-900 dark:text-white">Net Bonus</span>
                  <span className="text-emerald-600">{formatCurrency(paycheckResults.netBonus)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 py-3 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy Breakdown'}
            </button>
          </div>
        </div>
      ) : (
        /* DEPRECIATION MODE */
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-violet-600" />
                Asset Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Asset Cost Basis</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">$</span>
                    <input
                      type="number"
                      value={assetCost}
                      onChange={(e) => setAssetCost(Number(e.target.value))}
                      className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 pl-7 pr-3 py-2.5 text-lg font-semibold text-neutral-900 dark:text-white focus:border-violet-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1">Placed in Service Year</label>
                    <select
                      value={placedInServiceYear}
                      onChange={(e) => setPlacedInServiceYear(Number(e.target.value))}
                      className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-violet-500 outline-none"
                    >
                      <option value={2023}>2023 (80%)</option>
                      <option value={2024}>2024 (60%)</option>
                      <option value={2025}>2025 (40%)</option>
                      <option value={2026}>2026 (20%)</option>
                      <option value={2027}>2027 (0%)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1">Property Class</label>
                    <select
                      value={propertyClass}
                      onChange={(e) => setPropertyClass(e.target.value)}
                      className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-violet-500 outline-none"
                    >
                      <option value="3">3-year MACRS</option>
                      <option value="5">5-year MACRS</option>
                      <option value="7">7-year MACRS</option>
                      <option value="10">10-year MACRS</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">Section 179 Expense</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
                    <input
                      type="number"
                      value={section179}
                      onChange={(e) => setSection179(Number(e.target.value))}
                      className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 pl-6 pr-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-violet-500 outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-0.5">2026 limit: $1,250,000</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-violet-200 dark:border-violet-900/30 bg-violet-50 dark:bg-violet-950/20 p-6 text-center">
              <p className="text-sm font-medium text-violet-700 dark:text-violet-400 mb-1">Total First-Year Deduction</p>
              <p className="text-4xl font-bold text-violet-700 dark:text-violet-400">{formatCurrency(depreciationResults.totalFirstYear)}</p>
              <p className="text-xs text-violet-600 dark:text-violet-500 mt-1">
                {assetCost > 0 ? ((depreciationResults.totalFirstYear / assetCost) * 100).toFixed(1) : 0}% of cost
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 text-sm">Deduction Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Asset Cost</span>
                  <span className="text-neutral-900 dark:text-white font-medium">{formatCurrency(assetCost)}</span>
                </div>
                {depreciationResults.section179 > 0 && (
                  <div className="flex justify-between text-sm text-violet-600">
                    <span>Section 179</span>
                    <span>-{formatCurrency(depreciationResults.section179)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Remaining Basis</span>
                  <span className="text-neutral-900 dark:text-white">{formatCurrency(depreciationResults.afterSection179)}</span>
                </div>
                <div className="flex justify-between text-sm text-violet-600">
                  <span>Bonus Depreciation ({depreciationResults.bonusRate}%)</span>
                  <span>-{formatCurrency(depreciationResults.bonusDeduction)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Remaining for MACRS</span>
                  <span className="text-neutral-900 dark:text-white">{formatCurrency(depreciationResults.remainingBasis)}</span>
                </div>
                <div className="flex justify-between text-sm text-violet-600">
                  <span>Regular MACRS (Yr 1)</span>
                  <span>-{formatCurrency(depreciationResults.regularDepreciation)}</span>
                </div>
                <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2 mt-2 flex justify-between font-semibold">
                  <span className="text-neutral-900 dark:text-white">Total Year 1</span>
                  <span className="text-violet-600">{formatCurrency(depreciationResults.totalFirstYear)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-yellow-200 dark:border-yellow-900/30 bg-yellow-50 dark:bg-yellow-950/20 p-4">
              <p className="text-xs text-yellow-800 dark:text-yellow-300 flex items-start gap-2">
                <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                {placedInServiceYear === 2026 
                  ? '2026 is the last year with bonus depreciation (20%). In 2027, it drops to 0%.' 
                  : `Bonus depreciation for ${placedInServiceYear} is ${depreciationResults.bonusRate}%.`}
              </p>
            </div>

            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 py-3 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy Breakdown'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
