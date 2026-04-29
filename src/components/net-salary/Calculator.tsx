"use client";

import { useState, useCallback, useMemo } from "react";
import { TaxBreakdown } from "./TaxBreakdown";
import { PayFrequencyTable } from "./PayFrequencyTable";

interface TaxResult {
  grossAnnual: number;
  federalTax: number;
  stateTax: number;
  socialSecurity: number;
  medicare: number;
  additionalMedicare: number;
  ficaTotal: number;
  totalTax: number;
  netAnnual: number;
  effectiveFederalRate: number;
  effectiveStateRate: number;
  effectiveTotalRate: number;
  taxableIncome: number;
  standardDeduction: number;
}

const FEDERAL_BRACKETS_2026 = {
  single: [
    { limit: 11925, rate: 0.10 },
    { limit: 48475, rate: 0.12 },
    { limit: 103350, rate: 0.22 },
    { limit: 197300, rate: 0.24 },
    { limit: 250525, rate: 0.32 },
    { limit: 626350, rate: 0.35 },
    { limit: Infinity, rate: 0.37 },
  ],
  married: [
    { limit: 23850, rate: 0.10 },
    { limit: 96950, rate: 0.12 },
    { limit: 206700, rate: 0.22 },
    { limit: 394600, rate: 0.24 },
    { limit: 501050, rate: 0.32 },
    { limit: 752600, rate: 0.35 },
    { limit: Infinity, rate: 0.37 },
  ],
  hoh: [
    { limit: 17975, rate: 0.10 },
    { limit: 64850, rate: 0.12 },
    { limit: 103350, rate: 0.22 },
    { limit: 197300, rate: 0.24 },
    { limit: 250525, rate: 0.32 },
    { limit: 626350, rate: 0.35 },
    { limit: Infinity, rate: 0.37 },
  ],
};

const STANDARD_DEDUCTION_2026 = {
  single: 15000,
  married: 30000,
  hoh: 22500,
};

const STATE_TAX_RATES: Record<string, { rate: number; type: "flat" | "progressive"; brackets?: { limit: number; rate: number }[] }> = {
  AL: { rate: 0.05, type: "flat" },
  AK: { rate: 0, type: "flat" },
  AZ: { rate: 0.025, type: "flat" },
  AR: { rate: 0.039, type: "flat" },
  CA: { rate: 0, type: "progressive", brackets: [
    { limit: 10099, rate: 0.01 }, { limit: 23942, rate: 0.02 }, { limit: 37788, rate: 0.04 },
    { limit: 52455, rate: 0.06 }, { limit: 66295, rate: 0.08 }, { limit: 338639, rate: 0.093 },
    { limit: 406364, rate: 0.103 }, { limit: 677275, rate: 0.113 }, { limit: Infinity, rate: 0.123 },
  ]},
  CO: { rate: 0.044, type: "flat" },
  CT: { rate: 0.0499, type: "flat" },
  DE: { rate: 0, type: "progressive", brackets: [
    { limit: 2000, rate: 0.022 }, { limit: 5000, rate: 0.039 }, { limit: 10000, rate: 0.048 },
    { limit: 20000, rate: 0.052 }, { limit: 25000, rate: 0.0555 }, { limit: 60000, rate: 0.066 },
    { limit: Infinity, rate: 0.069 },
  ]},
  FL: { rate: 0, type: "flat" },
  GA: { rate: 0.0549, type: "flat" },
  HI: { rate: 0, type: "progressive", brackets: [
    { limit: 2400, rate: 0.014 }, { limit: 4800, rate: 0.032 }, { limit: 9600, rate: 0.055 },
    { limit: 14400, rate: 0.064 }, { limit: 19200, rate: 0.068 }, { limit: 24000, rate: 0.072 },
    { limit: 36000, rate: 0.076 }, { limit: 48000, rate: 0.079 }, { limit: 150000, rate: 0.0825 },
    { limit: 175000, rate: 0.09 }, { limit: 200000, rate: 0.10 }, { limit: Infinity, rate: 0.11 },
  ]},
  ID: { rate: 0.058, type: "flat" },
  IL: { rate: 0.0495, type: "flat" },
  IN: { rate: 0.0305, type: "flat" },
  IA: { rate: 0.036, type: "flat" },
  KS: { rate: 0.054, type: "flat" },
  KY: { rate: 0.04, type: "flat" },
  LA: { rate: 0.03, type: "flat" },
  ME: { rate: 0, type: "progressive", brackets: [
    { limit: 26000, rate: 0.058 }, { limit: 61450, rate: 0.0675 }, { limit: Infinity, rate: 0.0715 },
  ]},
  MD: { rate: 0, type: "progressive", brackets: [
    { limit: 1000, rate: 0.02 }, { limit: 2000, rate: 0.03 }, { limit: 3000, rate: 0.04 },
    { limit: 100000, rate: 0.0475 }, { limit: 125000, rate: 0.05 }, { limit: 150000, rate: 0.0525 },
    { limit: 250000, rate: 0.055 }, { limit: Infinity, rate: 0.0575 },
  ]},
  MA: { rate: 0.05, type: "flat" },
  MI: { rate: 0.0405, type: "flat" },
  MN: { rate: 0, type: "progressive", brackets: [
    { limit: 31690, rate: 0.0535 }, { limit: 104090, rate: 0.068 }, { limit: 193240, rate: 0.0785 },
    { limit: Infinity, rate: 0.0985 },
  ]},
  MS: { rate: 0.05, type: "flat" },
  MO: { rate: 0.048, type: "flat" },
  MT: { rate: 0.054, type: "flat" },
  NE: { rate: 0, type: "progressive", brackets: [
    { limit: 3700, rate: 0.023 }, { limit: 22170, rate: 0.0351 }, { limit: 35730, rate: 0.0501 },
    { limit: Infinity, rate: 0.0584 },
  ]},
  NV: { rate: 0, type: "flat" },
  NH: { rate: 0, type: "flat" },
  NJ: { rate: 0, type: "progressive", brackets: [
    { limit: 20000, rate: 0.014 }, { limit: 35000, rate: 0.0175 }, { limit: 40000, rate: 0.035 },
    { limit: 75000, rate: 0.05525 }, { limit: 500000, rate: 0.0637 }, { limit: 1000000, rate: 0.0897 },
    { limit: Infinity, rate: 0.1075 },
  ]},
  NM: { rate: 0, type: "progressive", brackets: [
    { limit: 5500, rate: 0.017 }, { limit: 11000, rate: 0.032 }, { limit: 16000, rate: 0.047 },
    { limit: 21000, rate: 0.049 }, { limit: Infinity, rate: 0.059 },
  ]},
  NY: { rate: 0, type: "progressive", brackets: [
    { limit: 8500, rate: 0.04 }, { limit: 11700, rate: 0.045 }, { limit: 13900, rate: 0.0525 },
    { limit: 80650, rate: 0.0585 }, { limit: 215400, rate: 0.0625 }, { limit: 1077550, rate: 0.0685 },
    { limit: 5000000, rate: 0.0965 }, { limit: Infinity, rate: 0.109 },
  ]},
  NC: { rate: 0.0475, type: "flat" },
  ND: { rate: 0, type: "progressive", brackets: [
    { limit: 51925, rate: 0.0195 }, { limit: 210825, rate: 0.025 }, { limit: 458350, rate: 0.0295 },
    { limit: Infinity, rate: 0.0325 },
  ]},
  OH: { rate: 0.0299, type: "flat" },
  OK: { rate: 0.045, type: "flat" },
  OR: { rate: 0, type: "progressive", brackets: [
    { limit: 4300, rate: 0.0475 }, { limit: 10750, rate: 0.0675 }, { limit: 125000, rate: 0.0875 },
    { limit: Infinity, rate: 0.099 },
  ]},
  PA: { rate: 0.0307, type: "flat" },
  RI: { rate: 0, type: "progressive", brackets: [
    { limit: 77450, rate: 0.0375 }, { limit: 176050, rate: 0.0475 }, { limit: Infinity, rate: 0.0599 },
  ]},
  SC: { rate: 0.064, type: "flat" },
  SD: { rate: 0, type: "flat" },
  TN: { rate: 0, type: "flat" },
  TX: { rate: 0, type: "flat" },
  UT: { rate: 0.0465, type: "flat" },
  VT: { rate: 0, type: "progressive", brackets: [
    { limit: 40950, rate: 0.0335 }, { limit: 99200, rate: 0.066 }, { limit: 206950, rate: 0.076 },
    { limit: Infinity, rate: 0.0875 },
  ]},
  VA: { rate: 0.0575, type: "flat" },
  WA: { rate: 0.07, type: "flat" },
  WV: { rate: 0.0478, type: "flat" },
  WI: { rate: 0, type: "progressive", brackets: [
    { limit: 14930, rate: 0.0354 }, { limit: 29860, rate: 0.0465 }, { limit: 331310, rate: 0.053 },
    { limit: Infinity, rate: 0.0765 },
  ]},
  WY: { rate: 0, type: "flat" },
  DC: { rate: 0, type: "progressive", brackets: [
    { limit: 10000, rate: 0.04 }, { limit: 40000, rate: 0.06 }, { limit: 60000, rate: 0.065 },
    { limit: 250000, rate: 0.085 }, { limit: 500000, rate: 0.0925 }, { limit: 1000000, rate: 0.0975 },
    { limit: Infinity, rate: 0.1075 },
  ]},
};

function calculateFederalTax(taxableIncome: number, status: "single" | "married" | "hoh"): number {
  const brackets = FEDERAL_BRACKETS_2026[status];
  let tax = 0;
  let previousLimit = 0;

  for (const bracket of brackets) {
    if (taxableIncome <= previousLimit) break;
    const taxableAtThisRate = Math.min(taxableIncome, bracket.limit) - previousLimit;
    tax += taxableAtThisRate * bracket.rate;
    previousLimit = bracket.limit;
  }

  return Math.max(0, tax);
}

function calculateStateTax(income: number, state: string): number {
  const stateData = STATE_TAX_RATES[state];
  if (!stateData || stateData.rate === 0) return 0;

  if (stateData.type === "flat") {
    return income * stateData.rate;
  }

  if (stateData.brackets) {
    let tax = 0;
    let previousLimit = 0;
    for (const bracket of stateData.brackets) {
      if (income <= previousLimit) break;
      const taxableAtThisRate = Math.min(income, bracket.limit) - previousLimit;
      tax += taxableAtThisRate * bracket.rate;
      previousLimit = bracket.limit;
    }
    return tax;
  }

  return 0;
}

export function Calculator() {
  const [mode, setMode] = useState<"gross-to-net" | "net-to-gross">("gross-to-net");
  const [grossSalary, setGrossSalary] = useState<string>("75000");
  const [netTarget, setNetTarget] = useState<string>("55000");
  const [filingStatus, setFilingStatus] = useState<"single" | "married" | "hoh">("single");
  const [state, setState] = useState<string>("CA");
  const [pretaxDeductions, setPretaxDeductions] = useState<string>("5000");
  const [showResults, setShowResults] = useState(false);

  const calculateGrossToNet = useCallback((): TaxResult => {
    const gross = parseFloat(grossSalary) || 0;
    const deductions = parseFloat(pretaxDeductions) || 0;
    const standardDeduction = STANDARD_DEDUCTION_2026[filingStatus];
    const taxableIncome = Math.max(0, gross - standardDeduction - deductions);
    
    const federalTax = calculateFederalTax(taxableIncome, filingStatus);
    const stateTax = calculateStateTax(Math.max(0, gross - deductions), state);
    
    // FICA
    const socialSecurityWage = Math.min(gross - deductions, 176100); // 2026 estimated wage base
    const socialSecurity = socialSecurityWage * 0.062;
    const medicare = (gross - deductions) * 0.0145;
    const additionalMedicare = filingStatus === "married" 
      ? (Math.max(0, gross - deductions - 250000) * 0.009)
      : (Math.max(0, gross - deductions - 200000) * 0.009);
    
    const ficaTotal = socialSecurity + medicare + additionalMedicare;
    const totalTax = federalTax + stateTax + ficaTotal;
    const netAnnual = gross - totalTax - deductions;

    return {
      grossAnnual: gross,
      federalTax,
      stateTax,
      socialSecurity,
      medicare,
      additionalMedicare,
      ficaTotal,
      totalTax,
      netAnnual,
      effectiveFederalRate: gross > 0 ? (federalTax / gross) * 100 : 0,
      effectiveStateRate: gross > 0 ? (stateTax / gross) * 100 : 0,
      effectiveTotalRate: gross > 0 ? (totalTax / gross) * 100 : 0,
      taxableIncome,
      standardDeduction,
    };
  }, [grossSalary, filingStatus, state, pretaxDeductions]);

  // Net to gross uses iterative approximation
  const calculateNetToGross = useCallback((): TaxResult => {
    const targetNet = parseFloat(netTarget) || 0;
    let estimatedGross = targetNet * 1.35; // Starting estimate
    let result: TaxResult | null = null;

    for (let i = 0; i < 50; i++) {
      const deductions = parseFloat(pretaxDeductions) || 0;
      const standardDeduction = STANDARD_DEDUCTION_2026[filingStatus];
      const taxableIncome = Math.max(0, estimatedGross - standardDeduction - deductions);
      
      const federalTax = calculateFederalTax(taxableIncome, filingStatus);
      const stateTax = calculateStateTax(Math.max(0, estimatedGross - deductions), state);
      
      const socialSecurityWage = Math.min(estimatedGross - deductions, 176100);
      const socialSecurity = socialSecurityWage * 0.062;
      const medicare = (estimatedGross - deductions) * 0.0145;
      const additionalMedicare = filingStatus === "married" 
        ? (Math.max(0, estimatedGross - deductions - 250000) * 0.009)
        : (Math.max(0, estimatedGross - deductions - 200000) * 0.009);
      
      const ficaTotal = socialSecurity + medicare + additionalMedicare;
      const totalTax = federalTax + stateTax + ficaTotal;
      const netAnnual = estimatedGross - totalTax - deductions;

      result = {
        grossAnnual: estimatedGross,
        federalTax,
        stateTax,
        socialSecurity,
        medicare,
        additionalMedicare,
        ficaTotal,
        totalTax,
        netAnnual,
        effectiveFederalRate: estimatedGross > 0 ? (federalTax / estimatedGross) * 100 : 0,
        effectiveStateRate: estimatedGross > 0 ? (stateTax / estimatedGross) * 100 : 0,
        effectiveTotalRate: estimatedGross > 0 ? (totalTax / estimatedGross) * 100 : 0,
        taxableIncome,
        standardDeduction,
      };

      if (Math.abs(netAnnual - targetNet) < 1) break;
      estimatedGross = estimatedGross + (targetNet - netAnnual) * 1.2;
    }

    return result || calculateGrossToNet();
  }, [netTarget, filingStatus, state, pretaxDeductions, calculateGrossToNet]);

  const result = useMemo(() => {
    return mode === "gross-to-net" ? calculateGrossToNet() : calculateNetToGross();
  }, [mode, calculateGrossToNet, calculateNetToGross]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);

  const downloadCSV = () => {
    const headers = ["Category", "Annual", "Monthly", "Biweekly", "Weekly"];
    const rows = [
      ["Gross Pay", result.grossAnnual, result.grossAnnual / 12, result.grossAnnual / 26, result.grossAnnual / 52],
      ["Federal Tax", result.federalTax, result.federalTax / 12, result.federalTax / 26, result.federalTax / 52],
      ["State Tax", result.stateTax, result.stateTax / 12, result.stateTax / 26, result.stateTax / 52],
      ["Social Security", result.socialSecurity, result.socialSecurity / 12, result.socialSecurity / 26, result.socialSecurity / 52],
      ["Medicare", result.medicare, result.medicare / 12, result.medicare / 26, result.medicare / 52],
      ["FICA Total", result.ficaTotal, result.ficaTotal / 12, result.ficaTotal / 26, result.ficaTotal / 52],
      ["Total Tax", result.totalTax, result.totalTax / 12, result.totalTax / 26, result.totalTax / 52],
      ["Net Pay", result.netAnnual, result.netAnnual / 12, result.netAnnual / 26, result.netAnnual / 52],
    ];
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `salary-breakdown-${mode}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8">
      {/* Mode Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-xl bg-slate-100 p-1 shadow-inner">
          <button
            onClick={() => { setMode("gross-to-net"); setShowResults(false); }}
            className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition-all ${
              mode === "gross-to-net"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Gross to Net
          </button>
          <button
            onClick={() => { setMode("net-to-gross"); setShowResults(false); }}
            className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition-all ${
              mode === "net-to-gross"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Net to Gross
          </button>
        </div>
      </div>

      {/* Input Card */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-900/5">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {mode === "gross-to-net" ? "Gross to Net Salary Calculator" : "Net to Gross Income Calculator"}
          </h2>
          <p className="text-sm text-slate-500">
            {mode === "gross-to-net" 
              ? "Enter your gross salary to calculate take-home pay after taxes" 
              : "Enter your desired net income to find the required gross salary"}
          </p>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Salary Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              {mode === "gross-to-net" ? "Gross Annual Salary ($)" : "Desired Net Annual Income ($)"}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
              <input
                type="number"
                value={mode === "gross-to-net" ? grossSalary : netTarget}
                onChange={(e) => mode === "gross-to-net" ? setGrossSalary(e.target.value) : setNetTarget(e.target.value)}
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-8 pr-4 text-slate-900 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder={mode === "gross-to-net" ? "75000" : "55000"}
              />
            </div>
          </div>

          {/* Filing Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Filing Status</label>
            <select
              value={filingStatus}
              onChange={(e) => setFilingStatus(e.target.value as any)}
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-4 pr-10 text-slate-900 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="single">Single</option>
              <option value="married">Married Filing Jointly</option>
              <option value="hoh">Head of Household</option>
            </select>
          </div>

          {/* State */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">State</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-4 pr-10 text-slate-900 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {Object.keys(STATE_TAX_RATES).sort().map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Pre-tax Deductions */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Pre-Tax Deductions ($/yr)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
              <input
                type="number"
                value={pretaxDeductions}
                onChange={(e) => setPretaxDeductions(e.target.value)}
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-8 pr-4 text-slate-900 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="5000"
              />
            </div>
            <p className="text-xs text-slate-500">401k, HSA, health insurance premiums</p>
          </div>

          {/* Calculate Button */}
          <div className="flex items-end sm:col-span-2 lg:col-span-2">
            <button
              onClick={() => setShowResults(true)}
              className="w-full rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:shadow-emerald-600/30 active:scale-[0.98]"
            >
              {mode === "gross-to-net" ? "Calculate Net Pay from Gross" : "Calculate Required Gross Income"}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {showResults && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-lg ring-1 ring-slate-900/5">
              <div className="absolute top-0 left-0 h-1 w-full bg-blue-500" />
              <p className="text-sm font-medium text-slate-500">{mode === "gross-to-net" ? "Gross Salary" : "Required Gross"}</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(result.grossAnnual)}</p>
              <p className="text-xs text-slate-500 mt-1">Annual base</p>
            </div>
            <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-lg ring-1 ring-slate-900/5">
              <div className="absolute top-0 left-0 h-1 w-full bg-red-500" />
              <p className="text-sm font-medium text-slate-500">Total Taxes</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(result.totalTax)}</p>
              <p className="text-xs text-slate-500 mt-1">{result.effectiveTotalRate.toFixed(1)}% effective rate</p>
            </div>
            <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-lg ring-1 ring-slate-900/5">
              <div className="absolute top-0 left-0 h-1 w-full bg-emerald-500" />
              <p className="text-sm font-medium text-slate-500">Net Take-Home Pay</p>
              <p className="mt-2 text-2xl font-bold text-emerald-600">{formatCurrency(result.netAnnual)}</p>
              <p className="text-xs text-slate-500 mt-1">
                {((result.netAnnual / result.grossAnnual) * 100).toFixed(1)}% of gross
              </p>
            </div>
            <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-lg ring-1 ring-slate-900/5">
              <div className="absolute top-0 left-0 h-1 w-full bg-amber-500" />
              <p className="text-sm font-medium text-slate-500">Monthly Net</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(result.netAnnual / 12)}</p>
              <p className="text-xs text-slate-500 mt-1">Per month</p>
            </div>
          </div>

          <TaxBreakdown result={result} />
          <PayFrequencyTable result={result} />

          <div className="flex justify-end gap-3">
            <button
              onClick={downloadCSV}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-slate-900 active:scale-[0.98]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
