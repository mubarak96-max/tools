"use client";

import React, { useState, useMemo } from "react";
import {
  DollarSign,
  Briefcase,
  Users,
  Calculator,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type FilingStatus = "single" | "mfj" | "mfs" | "hoh";

interface CalculatorState {
  netProfit: number;
  w2Wages: number;
  filingStatus: FilingStatus;
  otherIncome: number;
  retirementContrib: number;
  showAdvanced: boolean;
}

const initialState: CalculatorState = {
  netProfit: 80000,
  w2Wages: 0,
  filingStatus: "single",
  otherIncome: 0,
  retirementContrib: 0,
  showAdvanced: false,
};

const FILING_STATUS: Record<FilingStatus, { label: string; amtThreshold: number }> = {
  single: { label: "Single", amtThreshold: 200000 },
  mfj: { label: "Married Filing Jointly", amtThreshold: 250000 },
  mfs: { label: "Married Filing Separately", amtThreshold: 125000 },
  hoh: { label: "Head of Household", amtThreshold: 200000 },
};

const SS_WAGE_BASE_2026 = 183000;
const SS_RATE = 0.124;
const MEDICARE_RATE = 0.029;
const AMT_RATE = 0.009;
const SE_MULTIPLIER = 0.9235;

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

function formatMoney(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function SelfEmploymentTaxCalculatorClient() {
  const [state, setState] = useState<CalculatorState>(initialState);

  const results = useMemo(() => {
    const netEarnings = Math.max(0, state.netProfit * SE_MULTIPLIER);
    const remainingSSBase = Math.max(0, SS_WAGE_BASE_2026 - state.w2Wages);
    const ssTaxable = Math.min(netEarnings, remainingSSBase);
    const ssTax = ssTaxable * SS_RATE;
    const medicareTax = netEarnings * MEDICARE_RATE;

    const totalIncome = state.w2Wages + netEarnings + state.otherIncome;
    const amtThreshold = FILING_STATUS[state.filingStatus].amtThreshold;
    const amtTaxable = Math.max(0, totalIncome - amtThreshold);
    const amtTax = amtTaxable * AMT_RATE;

    const totalSETax = ssTax + medicareTax + amtTax;
    const deduction = totalSETax * 0.5;

    const quarterly = totalSETax / 4;

    // Effective rates
    const effectiveSE = state.netProfit > 0 ? (totalSETax / state.netProfit) * 100 : 0;
    const effectiveAfterDeduction = state.netProfit > 0 ? ((totalSETax - deduction) / state.netProfit) * 100 : 0;

    // W-2 comparison
    const w2Fica = Math.min(state.w2Wages, SS_WAGE_BASE_2026) * 0.062 + state.w2Wages * 0.0145;
    const w2EmployerMatch = w2Fica;
    const totalW2Burden = w2Fica + w2EmployerMatch;

    return {
      netEarnings,
      ssTaxable,
      ssTax,
      medicareTax,
      amtTax,
      totalSETax,
      deduction,
      quarterly,
      effectiveSE,
      effectiveAfterDeduction,
      totalIncome,
      w2Fica,
      totalW2Burden,
    };
  }, [state]);

  const pieData = [
    { name: "Social Security", value: results.ssTax },
    { name: "Medicare", value: results.medicareTax },
    { name: "Add. Medicare Tax", value: results.amtTax },
  ].filter((d) => d.value > 0);

  const handleChange = <K extends keyof CalculatorState>(field: K, value: CalculatorState[K]) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-premium">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Calculator className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Your Details</h2>
            </div>

            {/* Net Profit */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <DollarSign className="h-4 w-4 text-blue-600" />
                Net Business Profit (Schedule C)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input
                  type="number"
                  value={state.netProfit || ""}
                  onChange={(e) => handleChange("netProfit", Number(e.target.value))}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                  placeholder="80000"
                />
              </div>
              <p className="text-xs text-slate-500">After all business deductions</p>
            </div>

            {/* W-2 Wages */}
            <div className="mt-5 space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Briefcase className="h-4 w-4 text-blue-600" />
                W-2 Wages (if any)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input
                  type="number"
                  value={state.w2Wages || ""}
                  onChange={(e) => handleChange("w2Wages", Number(e.target.value))}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-4 py-3 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                  placeholder="0"
                />
              </div>
              <p className="text-xs text-slate-500">Counts toward Social Security wage base</p>
            </div>

            {/* Filing Status */}
            <div className="mt-5 space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Users className="h-4 w-4 text-blue-600" />
                Filing Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(FILING_STATUS).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => handleChange("filingStatus", key as FilingStatus)}
                    className={`rounded-xl border px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                      state.filingStatus === key
                        ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {val.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Toggle */}
            <button
              onClick={() => handleChange("showAdvanced", !state.showAdvanced)}
              className="mt-6 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all"
            >
              <span>Advanced Options</span>
              {state.showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {state.showAdvanced && (
              <div className="mt-4 space-y-5 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Other Income (spouse, investments, etc.)</label>
                  <input
                    type="number"
                    value={state.otherIncome || ""}
                    onChange={(e) => handleChange("otherIncome", Number(e.target.value))}
                    className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-500 outline-none"
                    placeholder="0"
                  />
                  <p className="text-xs text-slate-500">Used for Additional Medicare Tax threshold</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Retirement Contribution (Solo 401k / SEP)</label>
                  <input
                    type="number"
                    value={state.retirementContrib || ""}
                    onChange={(e) => handleChange("retirementContrib", Number(e.target.value))}
                    className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-500 outline-none"
                    placeholder="0"
                  />
                  <p className="text-xs text-slate-500">Reduces income tax but not SE tax directly</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-7 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-premium">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Net SE Earnings</p>
              <p className="mt-2 text-xl font-black text-blue-600">{formatMoney(results.netEarnings)}</p>
              <p className="text-[10px] text-slate-500">92.35% of profit</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-premium">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total SE Tax</p>
              <p className="mt-2 text-xl font-black text-rose-600">{formatMoney(results.totalSETax)}</p>
              <p className="text-[10px] text-slate-500">before deduction</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-premium">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">50% Deduction</p>
              <p className="mt-2 text-xl font-black text-emerald-600">{formatMoney(results.deduction)}</p>
              <p className="text-[10px] text-slate-500">above-the-line</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-premium">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quarterly</p>
              <p className="mt-2 text-xl font-black text-amber-600">{formatMoney(results.quarterly)}</p>
              <p className="text-[10px] text-slate-500">per quarter</p>
            </div>
          </div>

          {/* Charts */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-premium">
            <h3 className="mb-6 text-lg font-bold text-slate-900">SE Tax Breakdown</h3>
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => formatMoney(value)}
                      contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <span className="text-sm font-bold text-slate-700">Social Security</span>
                  </div>
                  <span className="font-black text-slate-900">{formatMoney(results.ssTax)}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                    <span className="text-sm font-bold text-slate-700">Medicare</span>
                  </div>
                  <span className="font-black text-slate-900">{formatMoney(results.medicareTax)}</span>
                </div>
                {results.amtTax > 0 && (
                  <div className="flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3.5 border border-amber-100">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-amber-500" />
                      <span className="text-sm font-bold text-amber-700">Additional Medicare</span>
                    </div>
                    <span className="font-black text-amber-900">{formatMoney(results.amtTax)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-slate-100 pt-4 text-lg font-black">
                  <span className="text-slate-900">Total SE Tax</span>
                  <span className="text-rose-600">{formatMoney(results.totalSETax)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-premium">
            <h3 className="mb-4 text-lg font-bold text-slate-900">Step-by-Step Calculation</h3>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-slate-50 pb-2 text-sm">
                <span className="text-slate-500">Net Business Profit</span>
                <span className="font-bold text-slate-900">{formatMoney(state.netProfit)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2 text-sm">
                <span className="text-slate-500">× SE Multiplier (IRS standard)</span>
                <span className="font-bold text-slate-900">92.35%</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2 text-sm">
                <span className="text-slate-500">Net Earnings from SE</span>
                <span className="font-bold text-blue-600">{formatMoney(results.netEarnings)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2 text-sm">
                <span className="text-slate-500">SS Wage Base (2026 Estimate)</span>
                <span className="font-bold text-slate-900">{formatMoney(SS_WAGE_BASE_2026)}</span>
              </div>
              {state.w2Wages > 0 && (
                <div className="flex justify-between border-b border-slate-50 pb-2 text-sm">
                  <span className="text-slate-500">Less: W-2 Wages Already Paid</span>
                  <span className="font-bold text-rose-500">−{formatMoney(state.w2Wages)}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-slate-50 pb-2 text-sm">
                <span className="text-slate-500">Remaining SS Base available</span>
                <span className="font-bold text-slate-900">{formatMoney(Math.max(0, SS_WAGE_BASE_2026 - state.w2Wages))}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2 text-sm">
                <span className="text-slate-500">Social Security Tax (12.4%)</span>
                <span className="font-bold text-slate-900">{formatMoney(results.ssTax)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2 text-sm">
                <span className="text-slate-500">Medicare Tax (2.9% - Unlimited)</span>
                <span className="font-bold text-slate-900">{formatMoney(results.medicareTax)}</span>
              </div>
              {results.amtTax > 0 && (
                <div className="flex justify-between border-b border-amber-50 pb-2 text-sm">
                  <span className="text-amber-700 font-medium">Add. Medicare Tax (0.9%)</span>
                  <span className="font-bold text-amber-700">{formatMoney(results.amtTax)}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-slate-50 pb-2 text-sm">
                <span className="text-slate-500">Employer-Equivalent Deduction (50%)</span>
                <span className="font-bold text-emerald-600">−{formatMoney(results.deduction)}</span>
              </div>
              <div className="flex justify-between pt-2 text-lg font-black">
                <span className="text-slate-900">Net SE Tax Liability</span>
                <span className="text-rose-600">{formatMoney(results.totalSETax)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest pt-2">
                <span>Effective Rate on Profit</span>
                <span>{results.effectiveSE.toFixed(2)}%</span>
              </div>
            </div>
          </div>

          {/* Quarterly Schedule */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-premium">
            <h3 className="mb-6 text-lg font-bold text-slate-900">2026 Quarterly Estimates</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { quarter: "Q1", date: "Apr 15, 2026", amount: results.quarterly },
                { quarter: "Q2", date: "Jun 15, 2026", amount: results.quarterly },
                { quarter: "Q3", date: "Sep 15, 2026", amount: results.quarterly },
                { quarter: "Q4", date: "Jan 15, 2027", amount: results.quarterly },
              ].map((q) => (
                <div key={q.quarter} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{q.quarter}</p>
                  <p className="text-base font-black text-slate-900 mt-1">{formatMoney(q.amount)}</p>
                  <p className="text-[10px] font-bold text-slate-500 mt-1">{q.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* W-2 Comparison */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-inner">
            <h3 className="mb-4 text-lg font-bold text-slate-900">W-2 Employee vs Self-Employed</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 text-xs">Your SE Tax (Employer + Employee)</span>
                <span className="font-bold text-slate-900">{formatMoney(results.totalSETax)}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-bold">
                <span className="text-xs">Less: Tax Deduction Benefit (50%)</span>
                <span>−{formatMoney(results.deduction)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-3">
                <span className="text-slate-600 text-xs">Equivalent W-2 Employee Withholding</span>
                <span className="font-bold text-slate-900">{formatMoney(results.w2Fica)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 text-xs">+ Employer Match (Hidden)</span>
                <span className="font-bold text-slate-900">{formatMoney(results.w2Fica)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-200">
                <span className="font-black text-slate-900 uppercase tracking-tighter">Total W-2 FICA Burden</span>
                <span className="font-black text-blue-600">{formatMoney(results.totalW2Burden)}</span>
              </div>
            </div>
            <div className="mt-6 flex items-start gap-3 rounded-xl bg-blue-600 p-4 text-white shadow-lg shadow-blue-200">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="text-xs font-bold leading-relaxed">
                The total tax burden is virtually identical to a W-2 job. As self-employed, you simply pay the employer&apos;s share yourself but get a 50% deduction to offset the cost.
              </p>
            </div>
          </div>

          {/* AMT Notice */}
          {results.amtTax > 0 && (
            <div className="flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <Info className="mt-1 h-5 w-5 shrink-0 text-amber-600" />
              <div className="text-sm">
                <p className="font-black text-amber-900 uppercase tracking-tight">Additional Medicare Tax Applies</p>
                <p className="mt-2 text-amber-800 leading-relaxed font-medium">
                  Your total income of <strong>{formatMoney(results.totalIncome)}</strong> exceeds the {FILING_STATUS[state.filingStatus].label} threshold of {formatMoney(FILING_STATUS[state.filingStatus].amtThreshold)}. An additional 0.9% tax applies to earnings above this limit.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
