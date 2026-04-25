"use client";

import React, { useState, useMemo } from "react";
import {
  IndianRupee,
  Calculator,
  Building2,
  User,
  FileText,
  Percent,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
  Landmark,
  Receipt,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type TDSSection =
  | "192"
  | "194A"
  | "194C"
  | "194H"
  | "194I"
  | "194J"
  | "194IB"
  | "194O"
  | "195";

type RecipientType = "individual" | "company" | "huf" | "nri" | "firm";
type PANStatus = "available" | "notAvailable";

interface CalculatorState {
  section: TDSSection;
  amount: number;
  recipientType: RecipientType;
  panStatus: PANStatus;
  hasThreshold: boolean;
  salaryRegime: "new" | "old";
  annualSalary: number;
  deductions: number;
  showAdvanced: boolean;
}

const initialState: CalculatorState = {
  section: "194J",
  amount: 500000,
  recipientType: "individual",
  panStatus: "available",
  hasThreshold: true,
  salaryRegime: "new",
  annualSalary: 1200000,
  deductions: 150000,
  showAdvanced: false,
};

const SECTIONS: Record<
  TDSSection,
  {
    label: string;
    description: string;
    rate: number;
    rateCompany: number;
    threshold: number;
    thresholdType: "perTransaction" | "annual";
  }
> = {
  "192": { label: "192 - Salary", description: "TDS on salary income", rate: 0, rateCompany: 0, threshold: 0, thresholdType: "annual" },
  "194A": { label: "194A - Interest", description: "Interest other than banks", rate: 0.10, rateCompany: 0.10, threshold: 5000, thresholdType: "annual" },
  "194C": { label: "194C - Contractor", description: "Contractor payments", rate: 0.01, rateCompany: 0.02, threshold: 30000, thresholdType: "perTransaction" },
  "194H": { label: "194H - Commission", description: "Commission or brokerage", rate: 0.05, rateCompany: 0.05, threshold: 15000, thresholdType: "annual" },
  "194I": { label: "194I - Rent", description: "Rent on land/building/plant", rate: 0.10, rateCompany: 0.10, threshold: 240000, thresholdType: "annual" },
  "194J": { label: "194J - Professional Fees", description: "Professional/technical fees", rate: 0.10, rateCompany: 0.10, threshold: 30000, thresholdType: "annual" },
  "194IB": { label: "194IB - Rent (Individual)", description: "Rent by individual/HUF", rate: 0.05, rateCompany: 0.05, threshold: 50000, thresholdType: "perTransaction" },
  "194O": { label: "194O - E-commerce", description: "E-commerce participant", rate: 0.01, rateCompany: 0.01, threshold: 500000, thresholdType: "annual" },
  "195": { label: "195 - NRI Payment", description: "Payment to non-residents", rate: 0.20, rateCompany: 0.20, threshold: 0, thresholdType: "annual" },
};

const RECIPIENTS: Record<RecipientType, string> = {
  individual: "Individual",
  company: "Company / LLP",
  huf: "HUF",
  nri: "Non-Resident",
  firm: "Firm / AOP",
};

const COLORS = ["#10b981", "#06b6d4", "#f59e0b", "#ef4444"];

function formatMoney(n: number): string {
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`;
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

function formatFullMoney(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function calculateSurcharge(tdsAmount: number, recipient: RecipientType, totalPayment: number): number {
  if (recipient === "company" || recipient === "firm") {
    if (totalPayment > 1_00_00_000) return tdsAmount * 0.12;
    return 0;
  }
  // Individual/HUF/NRI
  if (totalPayment > 10_00_00_000) return tdsAmount * 0.37;
  if (totalPayment > 5_00_00_000) return tdsAmount * 0.25;
  if (totalPayment > 2_00_00_000) return tdsAmount * 0.15;
  if (totalPayment > 1_00_00_000) return tdsAmount * 0.10;
  if (totalPayment > 50_00_000) return tdsAmount * 0.10;
  return 0;
}

function calculateSalaryTDS(annualIncome: number, regime: "new" | "old", deductions: number): number {
  let taxableIncome = annualIncome;
  
  if (regime === "new") {
    taxableIncome = Math.max(0, annualIncome - 75000); // Standard deduction
    let tax = 0;
    if (taxableIncome <= 400000) tax = 0;
    else if (taxableIncome <= 800000) tax = (taxableIncome - 400000) * 0.05;
    else if (taxableIncome <= 1200000) tax = 20000 + (taxableIncome - 800000) * 0.10;
    else if (taxableIncome <= 1600000) tax = 60000 + (taxableIncome - 1200000) * 0.15;
    else if (taxableIncome <= 2000000) tax = 120000 + (taxableIncome - 1600000) * 0.20;
    else if (taxableIncome <= 2400000) tax = 200000 + (taxableIncome - 2000000) * 0.25;
    else tax = 300000 + (taxableIncome - 2400000) * 0.30;
    
    // Rebate 87A
    if (taxableIncome <= 1200000) tax = Math.max(0, tax - 60000);
    
    // Surcharge
    let surcharge = 0;
    if (annualIncome > 5_00_00_000) surcharge = tax * 0.37;
    else if (annualIncome > 2_00_00_000) surcharge = tax * 0.25;
    else if (annualIncome > 1_00_00_000) surcharge = tax * 0.15;
    else if (annualIncome > 50_00_000) surcharge = tax * 0.10;
    
    const cess = (tax + surcharge) * 0.04;
    return Math.round(tax + surcharge + cess);
  } else {
    // Old regime
    taxableIncome = Math.max(0, annualIncome - 50000 - deductions);
    let tax = 0;
    if (taxableIncome <= 300000) tax = 0;
    else if (taxableIncome <= 500000) tax = (taxableIncome - 300000) * 0.05;
    else if (taxableIncome <= 1000000) tax = 10000 + (taxableIncome - 500000) * 0.20;
    else tax = 110000 + (taxableIncome - 1000000) * 0.30;
    
    // Rebate 87A
    if (taxableIncome <= 500000) tax = Math.max(0, tax - 12500);
    
    let surcharge = 0;
    if (annualIncome > 5_00_00_000) surcharge = tax * 0.37;
    else if (annualIncome > 2_00_00_000) surcharge = tax * 0.25;
    else if (annualIncome > 1_00_00_000) surcharge = tax * 0.15;
    else if (annualIncome > 50_00_000) surcharge = tax * 0.10;
    
    const cess = (tax + surcharge) * 0.04;
    return Math.round(tax + surcharge + cess);
  }
}

export function IndiaTDSCalculatorClient() {
  const [state, setState] = useState<CalculatorState>(initialState);

  const results = useMemo(() => {
    if (state.section === "192") {
      const annualTDS = calculateSalaryTDS(state.annualSalary, state.salaryRegime, state.deductions);
      const monthlyTDS = Math.round(annualTDS / 12);
      return {
        tdsAmount: annualTDS,
        surcharge: 0,
        cess: 0,
        totalTDS: annualTDS,
        netPayment: state.annualSalary - annualTDS,
        effectiveRate: state.annualSalary > 0 ? (annualTDS / state.annualSalary) * 100 : 0,
        thresholdMet: true,
        monthlyTDS,
      };
    }

    const section = SECTIONS[state.section];
    let rate = state.recipientType === "company" ? section.rateCompany : section.rate;
    
    // No PAN
    if (state.panStatus === "notAvailable") {
      rate = Math.max(rate, 0.20);
    }

    // Threshold check
    const thresholdMet = !state.hasThreshold || state.amount > section.threshold;
    
    let tdsAmount = thresholdMet ? state.amount * rate : 0;
    const surcharge = calculateSurcharge(tdsAmount, state.recipientType, state.amount);
    const cess = (tdsAmount + surcharge) * 0.04;
    const totalTDS = Math.round(tdsAmount + surcharge + cess);
    
    return {
      tdsAmount: Math.round(tdsAmount),
      surcharge: Math.round(surcharge),
      cess: Math.round(cess),
      totalTDS,
      netPayment: state.amount - totalTDS,
      effectiveRate: state.amount > 0 ? (totalTDS / state.amount) * 100 : 0,
      thresholdMet,
      monthlyTDS: 0,
    };
  }, [state]);

  const pieData = [
    { name: "Net Payment", value: Math.max(0, results.netPayment), color: "#10b981" },
    { name: "TDS", value: results.totalTDS, color: "#06b6d4" },
  ].filter((d) => d.value > 0);

  const handleChange = <K extends keyof CalculatorState>(field: K, value: CalculatorState[K]) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-premium">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 shadow-sm ring-1 ring-cyan-100">
                <Calculator className="h-6 w-6 text-cyan-600" />
              </div>
              <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Payment Details</h2>
            </div>

            <div className="space-y-6">
              {/* Section */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <FileText className="h-3 w-3" />
                  TDS Section
                </label>
                <div className="relative group">
                  <select
                    value={state.section}
                    onChange={(e) => handleChange("section", e.target.value as TDSSection)}
                    className="block w-full appearance-none rounded-2xl border-2 border-slate-50 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-900 transition-all focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-500/10 group-hover:border-slate-200"
                  >
                    {Object.entries(SECTIONS).map(([key, val]) => (
                      <option key={key} value={key}>
                        {val.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-[11px] font-medium text-slate-500 italic pl-1">{SECTIONS[state.section].description}</p>
              </div>

              {/* Salary-specific inputs */}
              {state.section === "192" ? (
                <>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Tax Regime</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleChange("salaryRegime", "new")}
                        className={`rounded-2xl border-2 px-4 py-3.5 text-xs font-black uppercase tracking-widest transition-all ${
                          state.salaryRegime === "new"
                            ? "border-cyan-500 bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                            : "border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200"
                        }`}
                      >
                        New Regime
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChange("salaryRegime", "old")}
                        className={`rounded-2xl border-2 px-4 py-3.5 text-xs font-black uppercase tracking-widest transition-all ${
                          state.salaryRegime === "old"
                            ? "border-cyan-500 bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                            : "border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200"
                        }`}
                      >
                        Old Regime
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
                      <IndianRupee className="h-3 w-3" />
                      Annual Salary (CTC)
                    </label>
                    <input
                      type="number"
                      value={state.annualSalary}
                      onChange={(e) => handleChange("annualSalary", Number(e.target.value))}
                      className="block w-full rounded-2xl border-2 border-slate-50 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-900 transition-all focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-500/10 hover:border-slate-200"
                    />
                  </div>
                  {state.salaryRegime === "old" && (
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Total Deductions (80C, 80D, etc.)</label>
                      <input
                        type="number"
                        value={state.deductions}
                        onChange={(e) => handleChange("deductions", Number(e.target.value))}
                        className="block w-full rounded-2xl border-2 border-slate-50 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-900 transition-all focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-500/10 hover:border-slate-200"
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Amount */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
                      <IndianRupee className="h-3 w-3" />
                      Payment Amount
                    </label>
                    <input
                      type="number"
                      value={state.amount}
                      onChange={(e) => handleChange("amount", Number(e.target.value))}
                      className="block w-full rounded-2xl border-2 border-slate-50 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-900 transition-all focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-500/10 hover:border-slate-200"
                    />
                  </div>

                  {/* Recipient Type */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
                      <User className="h-3 w-3" />
                      Recipient Type
                    </label>
                    <div className="relative group">
                      <select
                        value={state.recipientType}
                        onChange={(e) => handleChange("recipientType", e.target.value as RecipientType)}
                        className="block w-full appearance-none rounded-2xl border-2 border-slate-50 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-900 transition-all focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-500/10 group-hover:border-slate-200"
                      >
                        {Object.entries(RECIPIENTS).map(([key, val]) => (
                          <option key={key} value={key}>
                            {val}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  {/* PAN Status */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">PAN Status</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleChange("panStatus", "available")}
                        className={`flex items-center justify-center gap-2 rounded-2xl border-2 px-3 py-3.5 text-[10px] font-black uppercase tracking-widest transition-all ${
                          state.panStatus === "available"
                            ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                            : "border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200"
                        }`}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        Available
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChange("panStatus", "notAvailable")}
                        className={`flex items-center justify-center gap-2 rounded-2xl border-2 px-3 py-3.5 text-[10px] font-black uppercase tracking-widest transition-all ${
                          state.panStatus === "notAvailable"
                            ? "border-rose-500 bg-rose-500 text-white shadow-lg shadow-rose-500/20"
                            : "border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200"
                        }`}
                      >
                        <AlertTriangle className="h-3 w-3" />
                        No PAN
                      </button>
                    </div>
                    {state.panStatus === "notAvailable" && (
                      <p className="text-[10px] font-bold text-rose-500 italic pl-1 uppercase tracking-wider">TDS at 20% or higher (Section 206AA)</p>
                    )}
                  </div>

                  {/* Threshold */}
                  <div className="pt-2">
                    <label className="flex items-center gap-3 rounded-[1.5rem] border-2 border-slate-50 bg-slate-50/50 px-4 py-4 text-xs font-bold text-slate-600 cursor-pointer hover:border-slate-200 transition-all">
                      <input
                        type="checkbox"
                        checked={state.hasThreshold}
                        onChange={(e) => handleChange("hasThreshold", e.target.checked)}
                        className="h-5 w-5 rounded-lg border-2 border-slate-200 bg-white text-cyan-600 focus:ring-cyan-500/20"
                      />
                      Apply threshold (₹{SECTIONS[state.section].threshold.toLocaleString("en-IN")})
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-7 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-premium text-center">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                {state.section === "192" ? "Annual TDS" : "Total TDS"}
              </p>
              <p className="mt-2 text-2xl font-black text-cyan-600 italic tracking-tighter tabular-nums">{formatMoney(results.totalTDS)}</p>
              <p className="mt-1 text-[9px] font-black text-slate-300 uppercase tracking-widest">{results.effectiveRate.toFixed(2)}% effective</p>
            </div>
            <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-premium text-center">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Base TDS</p>
              <p className="mt-2 text-2xl font-black text-slate-900 italic tracking-tighter tabular-nums">{formatMoney(results.tdsAmount)}</p>
            </div>
            <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-premium text-center">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Net Payment</p>
              <p className="mt-2 text-2xl font-black text-emerald-600 italic tracking-tighter tabular-nums">{formatMoney(results.netPayment)}</p>
            </div>
            <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-premium text-center">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                {state.section === "192" ? "Monthly TDS" : "Add-ons"}
              </p>
              <p className="mt-2 text-2xl font-black text-amber-500 italic tracking-tighter tabular-nums">
                {state.section === "192" ? formatMoney(results.monthlyTDS) : formatMoney(results.surcharge + results.cess)}
              </p>
            </div>
          </div>

          {/* Threshold Warning */}
          {!results.thresholdMet && state.section !== "192" && (
            <div className="flex items-start gap-4 rounded-[2rem] border-2 border-amber-100 bg-amber-50/30 p-6">
              <Info className="mt-0.5 h-6 w-6 shrink-0 text-amber-500" />
              <div className="text-sm font-medium text-slate-600 leading-relaxed">
                <p className="text-sm font-black text-amber-700 uppercase tracking-tight italic">Threshold Not Exceeded</p>
                <p className="mt-1">
                  The payment of {formatMoney(state.amount)} is below the threshold limit of ₹{SECTIONS[state.section].threshold.toLocaleString("en-IN")} for {SECTIONS[state.section].label}. No TDS is required.
                </p>
              </div>
            </div>
          )}

          {/* Breakdown */}
          {results.thresholdMet && (
            <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-premium">
              <h3 className="mb-6 text-lg font-black text-slate-900 uppercase italic tracking-tight">TDS Ledger</h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-slate-50 pb-4 text-sm font-bold">
                  <span className="text-slate-400 uppercase tracking-widest text-[10px]">Payment Amount</span>
                  <span className="text-slate-900 tabular-nums">{formatMoney(state.section === "192" ? state.annualSalary : state.amount)}</span>
                </div>
                {state.section !== "192" && (
                  <div className="flex justify-between border-b border-slate-50 pb-4 text-sm font-bold">
                    <span className="text-slate-400 uppercase tracking-widest text-[10px]">Applicable Rate</span>
                    <span className="text-slate-900">
                      {(results.tdsAmount / state.amount * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-b border-slate-50 pb-4 text-sm font-bold">
                  <span className="text-slate-400 uppercase tracking-widest text-[10px]">Base TDS</span>
                  <span className="text-slate-900 tabular-nums">{formatMoney(results.tdsAmount)}</span>
                </div>
                {results.surcharge > 0 && (
                  <div className="flex justify-between border-b border-slate-50 pb-4 text-sm font-bold">
                    <span className="text-amber-500 uppercase tracking-widest text-[10px]">Surcharge</span>
                    <span className="text-amber-500 tabular-nums">+{formatMoney(results.surcharge)}</span>
                  </div>
                )}
                {results.cess > 0 && (
                  <div className="flex justify-between border-b border-slate-50 pb-4 text-sm font-bold">
                    <span className="text-amber-500 uppercase tracking-widest text-[10px]">Health & Cess (4%)</span>
                    <span className="text-amber-500 tabular-nums">+{formatMoney(results.cess)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 text-xl font-black text-slate-900 italic tracking-tight">
                  <span className="uppercase tracking-tight">Total Deduction</span>
                  <span className="text-cyan-600 tabular-nums">{formatMoney(results.totalTDS)}</span>
                </div>
                <div className="flex justify-between pt-1 text-sm font-black text-emerald-600 uppercase tracking-widest">
                  <span>Net Payable</span>
                  <span className="tabular-nums">{formatMoney(results.netPayment)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Visuals */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Pie Chart */}
            {results.thresholdMet && (
              <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-premium">
                <h3 className="mb-4 text-xs font-black text-slate-400 uppercase tracking-widest">Payment Split</h3>
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
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: any) => formatFullMoney(Number(value) || 0)} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-cyan-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">TDS</span>
                  </div>
                </div>
              </div>
            )}

            {/* Compliance Info */}
            <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-premium flex flex-col justify-center">
               <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 mb-6">
                  <Landmark className="h-6 w-6 text-cyan-600" />
               </div>
               <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tight mb-4">Compliance</h3>
               <p className="text-sm font-medium text-slate-500 leading-relaxed">
                  Deposit TDS by the <span className="text-slate-900 font-bold">7th of next month</span> using Challan 281. File quarterly returns (Form 24Q/26Q) by July, Oct, Jan, and May.
               </p>
            </div>
          </div>

          {/* Section Matrix */}
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-premium">
            <h3 className="mb-8 text-lg font-black text-slate-900 uppercase italic tracking-tight">Section Matrix</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Provision</p>
                <p className="text-sm font-bold text-slate-900">{SECTIONS[state.section].label}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Individual Rate</p>
                <p className="text-sm font-bold text-cyan-600">{(SECTIONS[state.section].rate * 100).toFixed(0)}%</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Threshold</p>
                <p className="text-sm font-bold text-slate-900">₹{SECTIONS[state.section].threshold.toLocaleString("en-IN")}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Entity Rate</p>
                <p className="text-sm font-bold text-slate-900">{(SECTIONS[state.section].rateCompany * 100).toFixed(0)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
