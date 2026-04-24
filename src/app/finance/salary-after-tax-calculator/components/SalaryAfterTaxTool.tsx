'use client'

import { useState } from 'react'
import { 
  DollarSign, MapPin, Copy, Check, ChevronDown, TrendingUp, 
  Calculator, ArrowRightLeft, BarChart3, Landmark
} from 'lucide-react'

type FilingStatus = 'single' | 'married' | 'head'

interface TaxBracket {
  rate: number
  from: number
  to: number
}

const FEDERAL_BRACKETS: Record<FilingStatus, TaxBracket[]> = {
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
const ADDITIONAL_MEDICARE_THRESHOLD = 200000

// State tax data - simplified progressive for major states, flat for others
// Based on Tax Foundation 2026 data
const STATE_TAX_DATA: Record<string, { name: string; type: 'flat' | 'progressive'; rate: number; brackets?: TaxBracket[]; stdDeduction?: number }> = {
  'none': { name: 'No State Income Tax', type: 'flat', rate: 0 },
  'alabama': { name: 'Alabama', type: 'progressive', rate: 0, brackets: [{rate:0.02,from:0,to:500},{rate:0.04,from:501,to:3000},{rate:0.05,from:3001,to:Infinity}], stdDeduction: 3000 },
  'arizona': { name: 'Arizona', type: 'flat', rate: 0.025 },
  'arkansas': { name: 'Arkansas', type: 'progressive', rate: 0, brackets: [{rate:0.02,from:0,to:4600},{rate:0.039,from:4601,to:Infinity}], stdDeduction: 2470 },
  'california': { name: 'California', type: 'progressive', rate: 0, brackets: [{rate:0.01,from:0,to:11079},{rate:0.02,from:11080,to:26264},{rate:0.04,from:26265,to:41452},{rate:0.06,from:41453,to:57542},{rate:0.08,from:57543,to:72724},{rate:0.093,from:72725,to:371479},{rate:0.103,from:371480,to:445771},{rate:0.113,from:445772,to:742953},{rate:0.123,from:742954,to:1000000},{rate:0.133,from:1000001,to:Infinity}], stdDeduction: 5540 },
  'colorado': { name: 'Colorado', type: 'flat', rate: 0.044 },
  'connecticut': { name: 'Connecticut', type: 'progressive', rate: 0, brackets: [{rate:0.02,from:0,to:10000},{rate:0.045,from:10001,to:50000},{rate:0.055,from:50001,to:100000},{rate:0.06,from:100001,to:200000},{rate:0.065,from:200001,to:250000},{rate:0.069,from:250001,to:500000},{rate:0.0699,from:500001,to:Infinity}] },
  'delaware': { name: 'Delaware', type: 'progressive', rate: 0, brackets: [{rate:0.022,from:0,to:2000},{rate:0.039,from:2001,to:5000},{rate:0.048,from:5001,to:10000},{rate:0.052,from:10001,to:20000},{rate:0.0555,from:20001,to:25000},{rate:0.066,from:25001,to:Infinity}], stdDeduction: 3250 },
  'florida': { name: 'Florida', type: 'flat', rate: 0 },
  'georgia': { name: 'Georgia', type: 'flat', rate: 0.0519 },
  'hawaii': { name: 'Hawaii', type: 'progressive', rate: 0, brackets: [{rate:0.014,from:0,to:9600},{rate:0.032,from:9601,to:14400},{rate:0.055,from:14401,to:19200},{rate:0.064,from:19201,to:24000},{rate:0.068,from:24001,to:36000},{rate:0.072,from:36001,to:48000},{rate:0.076,from:48001,to:96000},{rate:0.079,from:96001,to:125000},{rate:0.0825,from:125001,to:175000},{rate:0.09,from:175001,to:225000},{rate:0.10,from:225001,to:275000},{rate:0.11,from:275001,to:Infinity}], stdDeduction: 4400 },
  'idaho': { name: 'Idaho', type: 'progressive', rate: 0, brackets: [{rate:0.053,from:0,to:4811},{rate:0.058,from:4812,to:Infinity}], stdDeduction: 16100 },
  'illinois': { name: 'Illinois', type: 'flat', rate: 0.0495 },
  'indiana': { name: 'Indiana', type: 'flat', rate: 0.0295 },
  'iowa': { name: 'Iowa', type: 'progressive', rate: 0, brackets: [{rate:0.038,from:0,to:Infinity}], stdDeduction: 16100 },
  'kansas': { name: 'Kansas', type: 'progressive', rate: 0, brackets: [{rate:0.052,from:0,to:23000},{rate:0.0558,from:23001,to:Infinity}], stdDeduction: 3605 },
  'kentucky': { name: 'Kentucky', type: 'flat', rate: 0.035 },
  'louisiana': { name: 'Louisiana', type: 'progressive', rate: 0, brackets: [{rate:0.03,from:0,to:Infinity}], stdDeduction: 12875 },
  'maine': { name: 'Maine', type: 'progressive', rate: 0, brackets: [{rate:0.058,from:0,to:27399},{rate:0.0675,from:27400,to:64849},{rate:0.0715,from:64850,to:Infinity}], stdDeduction: 8350 },
  'maryland': { name: 'Maryland', type: 'progressive', rate: 0, brackets: [{rate:0.02,from:0,to:1000},{rate:0.03,from:1001,to:2000},{rate:0.04,from:2001,to:3000},{rate:0.0475,from:3001,to:100000},{rate:0.05,from:100001,to:125000},{rate:0.0525,from:125001,to:150000},{rate:0.055,from:150001,to:250000},{rate:0.0575,from:250001,to:500000},{rate:0.0625,from:500001,to:1000000},{rate:0.065,from:1000001,to:Infinity}], stdDeduction: 3350 },
  'massachusetts': { name: 'Massachusetts', type: 'progressive', rate: 0, brackets: [{rate:0.05,from:0,to:1083150},{rate:0.09,from:1083151,to:Infinity}] },
  'michigan': { name: 'Michigan', type: 'flat', rate: 0.0425 },
  'minnesota': { name: 'Minnesota', type: 'progressive', rate: 0, brackets: [{rate:0.0535,from:0,to:33310},{rate:0.068,from:33311,to:109430},{rate:0.0785,from:109431,to:203150},{rate:0.0985,from:203151,to:Infinity}], stdDeduction: 15300 },
  'mississippi': { name: 'Mississippi', type: 'flat', rate: 0.04 },
  'missouri': { name: 'Missouri', type: 'progressive', rate: 0, brackets: [{rate:0.02,from:0,to:1348},{rate:0.025,from:1349,to:2696},{rate:0.03,from:2697,to:4044},{rate:0.035,from:4045,to:5392},{rate:0.04,from:5393,to:6740},{rate:0.045,from:6741,to:8088},{rate:0.047,from:8089,to:Infinity}], stdDeduction: 16100 },
  'montana': { name: 'Montana', type: 'progressive', rate: 0, brackets: [{rate:0.047,from:0,to:47500},{rate:0.0565,from:47501,to:Infinity}], stdDeduction: 16100 },
  'nebraska': { name: 'Nebraska', type: 'progressive', rate: 0, brackets: [{rate:0.0246,from:0,to:4130},{rate:0.0351,from:4131,to:24760},{rate:0.0455,from:24761,to:Infinity}], stdDeduction: 8850 },
  'nevada': { name: 'Nevada', type: 'flat', rate: 0 },
  'new_jersey': { name: 'New Jersey', type: 'progressive', rate: 0, brackets: [{rate:0.014,from:0,to:20000},{rate:0.0175,from:20001,to:35000},{rate:0.035,from:35001,to:40000},{rate:0.0553,from:40001,to:75000},{rate:0.0637,from:75001,to:500000},{rate:0.0897,from:500001,to:1000000},{rate:0.1075,from:1000001,to:Infinity}] },
  'new_mexico': { name: 'New Mexico', type: 'progressive', rate: 0, brackets: [{rate:0.015,from:0,to:5500},{rate:0.032,from:5501,to:16500},{rate:0.043,from:16501,to:33500},{rate:0.047,from:33501,to:66500},{rate:0.049,from:66501,to:210000},{rate:0.059,from:210001,to:Infinity}], stdDeduction: 16100 },
  'new_york': { name: 'New York', type: 'progressive', rate: 0, brackets: [{rate:0.039,from:0,to:8500},{rate:0.044,from:8501,to:11700},{rate:0.0515,from:11701,to:13900},{rate:0.054,from:13901,to:80650},{rate:0.059,from:80651,to:215400},{rate:0.0685,from:215401,to:1077550},{rate:0.0965,from:1077551,to:5000000},{rate:0.103,from:5000001,to:25000000},{rate:0.109,from:25000001,to:Infinity}], stdDeduction: 8000 },
  'north_carolina': { name: 'North Carolina', type: 'flat', rate: 0.0399 },
  'north_dakota': { name: 'North Dakota', type: 'progressive', rate: 0, brackets: [{rate:0.0195,from:0,to:48475},{rate:0.025,from:48476,to:244825},{rate:0.025,from:244826,to:Infinity}], stdDeduction: 16100 },
  'ohio': { name: 'Ohio', type: 'progressive', rate: 0, brackets: [{rate:0.0275,from:0,to:26050},{rate:0.035,from:26051,to:Infinity}] },
  'oklahoma': { name: 'Oklahoma', type: 'progressive', rate: 0, brackets: [{rate:0.025,from:0,to:3750},{rate:0.035,from:3751,to:4900},{rate:0.045,from:4901,to:7200},{rate:0.045,from:7201,to:Infinity}], stdDeduction: 6350 },
  'oregon': { name: 'Oregon', type: 'progressive', rate: 0, brackets: [{rate:0.0475,from:0,to:4550},{rate:0.0675,from:4551,to:11400},{rate:0.0875,from:11401,to:125000},{rate:0.099,from:125001,to:Infinity}], stdDeduction: 2910 },
  'pennsylvania': { name: 'Pennsylvania', type: 'flat', rate: 0.0307 },
  'rhode_island': { name: 'Rhode Island', type: 'progressive', rate: 0, brackets: [{rate:0.0375,from:0,to:82050},{rate:0.0475,from:82051,to:186450},{rate:0.0599,from:186451,to:Infinity}], stdDeduction: 11200 },
  'south_carolina': { name: 'South Carolina', type: 'progressive', rate: 0, brackets: [{rate:0.00,from:0,to:3640},{rate:0.03,from:3641,to:18230},{rate:0.06,from:18231,to:Infinity}], stdDeduction: 8350 },
  'south_dakota': { name: 'South Dakota', type: 'flat', rate: 0 },
  'tennessee': { name: 'Tennessee', type: 'flat', rate: 0 },
  'texas': { name: 'Texas', type: 'flat', rate: 0 },
  'utah': { name: 'Utah', type: 'flat', rate: 0.045 },
  'vermont': { name: 'Vermont', type: 'progressive', rate: 0, brackets: [{rate:0.0335,from:0,to:49400},{rate:0.066,from:49401,to:119700},{rate:0.076,from:119701,to:249700},{rate:0.0875,from:249701,to:Infinity}], stdDeduction: 7650 },
  'virginia': { name: 'Virginia', type: 'progressive', rate: 0, brackets: [{rate:0.02,from:0,to:3000},{rate:0.03,from:3001,to:5000},{rate:0.05,from:5001,to:17000},{rate:0.0575,from:17001,to:Infinity}], stdDeduction: 8750 },
  'washington': { name: 'Washington', type: 'flat', rate: 0 },
  'west_virginia': { name: 'West Virginia', type: 'progressive', rate: 0, brackets: [{rate:0.0222,from:0,to:10000},{rate:0.0296,from:10001,to:25000},{rate:0.0333,from:25001,to:40000},{rate:0.0444,from:40001,to:60000},{rate:0.0482,from:60001,to:Infinity}] },
  'wisconsin': { name: 'Wisconsin', type: 'progressive', rate: 0, brackets: [{rate:0.035,from:0,to:15110},{rate:0.044,from:15111,to:51950},{rate:0.053,from:51951,to:332720},{rate:0.0765,from:332721,to:Infinity}], stdDeduction: 13960 },
  'wyoming': { name: 'Wyoming', type: 'flat', rate: 0 },
  'dc': { name: 'Washington DC', type: 'progressive', rate: 0, brackets: [{rate:0.04,from:0,to:10000},{rate:0.06,from:10001,to:40000},{rate:0.065,from:40001,to:60000},{rate:0.085,from:60001,to:250000},{rate:0.0925,from:250001,to:500000},{rate:0.0975,from:500001,to:1000000},{rate:0.1075,from:1000001,to:Infinity}], stdDeduction: 16100 },
}

function calculateFederalTax(taxableIncome: number, status: FilingStatus): number {
  let tax = 0
  for (const bracket of FEDERAL_BRACKETS[status]) {
    if (taxableIncome <= bracket.from) break
    const taxableAtThisRate = Math.min(taxableIncome, bracket.to) - bracket.from
    if (taxableAtThisRate > 0) tax += taxableAtThisRate * bracket.rate
  }
  return tax
}

function calculateStateTax(taxableIncome: number, stateKey: string): number {
  const state = STATE_TAX_DATA[stateKey]
  if (!state || state.type === 'flat') return taxableIncome * (state?.rate || 0)
  
  if (state.brackets) {
    let tax = 0
    for (const bracket of state.brackets) {
      if (taxableIncome <= bracket.from) break
      const taxableAtThisRate = Math.min(taxableIncome, bracket.to) - bracket.from
      if (taxableAtThisRate > 0) tax += taxableAtThisRate * bracket.rate
    }
    return tax
  }
  return 0
}

function getMarginalRate(taxableIncome: number, status: FilingStatus): number {
  for (const bracket of FEDERAL_BRACKETS[status]) {
    if (taxableIncome <= bracket.to) return bracket.rate
  }
  return 0.37
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export function SalaryAfterTaxTool() {
  const [salary, setSalary] = useState(85000)
  const [status, setStatus] = useState<FilingStatus>('single')
  const [stateKey, setStateKey] = useState('california')
  const [compareState, setCompareState] = useState('texas')
  const [showCompare, setShowCompare] = useState(false)
  const [copied, setCopied] = useState(false)

  const stateOptions = Object.entries(STATE_TAX_DATA).sort((a, b) => a[1].name.localeCompare(b[1].name))

  const calculateResults = (s: number, st: FilingStatus, sk: string) => {
    const fedStdDed = STANDARD_DEDUCTION[st]
    const stateStdDed = STATE_TAX_DATA[sk]?.stdDeduction || 0
    
    const fedTaxable = Math.max(0, s - fedStdDed)
    const federalTax = calculateFederalTax(fedTaxable, st)
    
    const stateTaxable = Math.max(0, s - stateStdDed)
    const stateTax = calculateStateTax(stateTaxable, sk)
    
    const ssTax = Math.min(s, SS_WAGE_BASE) * SS_RATE
    const medicareTax = s * MEDICARE_RATE
    const additionalMedicare = s > ADDITIONAL_MEDICARE_THRESHOLD ? (s - ADDITIONAL_MEDICARE_THRESHOLD) * 0.009 : 0
    const totalFica = ssTax + medicareTax + additionalMedicare
    
    const totalTax = federalTax + stateTax + totalFica
    const netPay = s - totalTax
    
    return {
      federalTax,
      stateTax,
      ssTax,
      medicareTax,
      additionalMedicare,
      totalFica,
      totalTax,
      netPay,
      effectiveRate: s > 0 ? (totalTax / s) * 100 : 0,
      marginalRate: getMarginalRate(fedTaxable, st),
      fedTaxable,
      stateTaxable
    }
  }

  const results = calculateResults(salary, status, stateKey)
  const compareResults = calculateResults(salary, status, compareState)

  const handleCopy = async () => {
    const text = `SALARY AFTER TAX - 2026
Gross Salary: ${formatCurrency(salary)}
Filing Status: ${status}
State: ${STATE_TAX_DATA[stateKey]?.name}

Federal Tax: ${formatCurrency(results.federalTax)}
State Tax: ${formatCurrency(results.stateTax)}
FICA: ${formatCurrency(results.totalFica)}
Total Tax: ${formatCurrency(results.totalTax)}

NET SALARY: ${formatCurrency(results.netPay)}
Effective Rate: ${results.effectiveRate.toFixed(1)}%
Marginal Rate: ${(results.marginalRate * 100).toFixed(0)}%`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid lg:grid-cols-5 gap-8">
        {/* LEFT: Inputs */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Basic Info */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-cyan-600" />
              Salary & Filing
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
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 pl-7 pr-3 py-2.5 text-lg font-semibold text-neutral-900 dark:text-white focus:border-cyan-500 outline-none"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">Filing Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as FilingStatus)}
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-cyan-500 outline-none"
                  >
                    <option value="single">Single</option>
                    <option value="married">Married Filing Jointly</option>
                    <option value="head">Head of Household</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1">State</label>
                  <select
                    value={stateKey}
                    onChange={(e) => setStateKey(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-cyan-500 outline-none"
                  >
                    {stateOptions.map(([key, data]) => (
                      <option key={key} value={key}>{data.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* State Comparison Toggle */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <button
              onClick={() => setShowCompare(!showCompare)}
              className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <ArrowRightLeft className="h-4 w-4" />
              {showCompare ? 'Hide' : 'Show'} State Comparison
            </button>
            
            {showCompare && (
              <div className="mt-4">
                <label className="block text-xs font-medium text-neutral-500 mb-1">Compare With</label>
                <select
                  value={compareState}
                  onChange={(e) => setCompareState(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:border-cyan-500 outline-none"
                >
                  {stateOptions.map(([key, data]) => (
                    <option key={key} value={key}>{data.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Results */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Net Pay Big Number */}
          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-950/20 p-6 text-center">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-1">Annual Take-Home Pay</p>
            <p className="text-4xl font-bold text-emerald-700 dark:text-emerald-400">{formatCurrency(results.netPay)}</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">
              {results.effectiveRate.toFixed(1)}% effective tax rate
            </p>
          </div>

          {/* Rates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 text-center">
              <p className="text-xs text-neutral-500 mb-1">Marginal Rate</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">{(results.marginalRate * 100).toFixed(0)}%</p>
              <p className="text-[10px] text-neutral-400">federal only</p>
            </div>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 text-center">
              <p className="text-xs text-neutral-500 mb-1">Monthly Net</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">{formatCurrency(results.netPay / 12)}</p>
              <p className="text-[10px] text-neutral-400">approximate</p>
            </div>
          </div>

          {/* Breakdown */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 text-sm">Tax Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Gross Salary</span>
                <span className="text-neutral-900 dark:text-white font-medium">{formatCurrency(salary)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Federal Std Deduction</span>
                <span className="text-neutral-400">-{formatCurrency(STANDARD_DEDUCTION[status])}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500 pl-4">Fed Taxable Income</span>
                <span className="text-neutral-900 dark:text-white">{formatCurrency(results.fedTaxable)}</span>
              </div>
              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2 mt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Federal Income Tax</span>
                  <span className="text-red-600">-{formatCurrency(results.federalTax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Social Security</span>
                  <span className="text-red-600">-{formatCurrency(results.ssTax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Medicare</span>
                  <span className="text-red-600">-{formatCurrency(results.medicareTax)}</span>
                </div>
                {results.additionalMedicare > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Add. Medicare</span>
                    <span className="text-red-600">-{formatCurrency(results.additionalMedicare)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">{STATE_TAX_DATA[stateKey]?.name} Tax</span>
                  <span className="text-red-600">-{formatCurrency(results.stateTax)}</span>
                </div>
              </div>
              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2 flex justify-between font-semibold">
                <span className="text-neutral-900 dark:text-white">Total Tax</span>
                <span className="text-red-600">{formatCurrency(results.totalTax)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-neutral-900 dark:text-white">Net Salary</span>
                <span className="text-emerald-600">{formatCurrency(results.netPay)}</span>
              </div>
            </div>
          </div>

          {/* Comparison */}
          {showCompare && (
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-cyan-600" />
                State Comparison
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">{STATE_TAX_DATA[stateKey]?.name}</span>
                  <span className="text-sm font-semibold text-neutral-900 dark:text-white">{formatCurrency(results.netPay)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">{STATE_TAX_DATA[compareState]?.name}</span>
                  <span className="text-sm font-semibold text-neutral-900 dark:text-white">{formatCurrency(compareResults.netPay)}</span>
                </div>
                <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Difference</span>
                  <span className={`text-sm font-bold ${compareResults.netPay > results.netPay ? 'text-green-600' : 'text-red-600'}`}>
                    {compareResults.netPay > results.netPay ? '+' : ''}{formatCurrency(compareResults.netPay - results.netPay)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>Effective Rate ({STATE_TAX_DATA[stateKey]?.name})</span>
                  <span>{results.effectiveRate.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>Effective Rate ({STATE_TAX_DATA[compareState]?.name})</span>
                  <span>{compareResults.effectiveRate.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          )}

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
