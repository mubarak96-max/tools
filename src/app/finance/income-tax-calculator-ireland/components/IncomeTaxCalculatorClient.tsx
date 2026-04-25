"use client";

import React, { useState, useMemo } from "react";
import {
  Euro,
  Briefcase,
  Users,
  HeartPulse,
  PiggyBank,
  Home,
  Calculator,
  TrendingDown,
  TrendingUp,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

type Frequency = "yearly" | "monthly" | "weekly";
type EmploymentType = "employee" | "selfEmployed";
type MaritalStatus =
  | "single"
  | "marriedOne"
  | "marriedTwo"
  | "singleParent";

interface CalculatorState {
  grossSalary: number;
  frequency: Frequency;
  employmentType: EmploymentType;
  maritalStatus: MaritalStatus;
  spouseIncome: number;
  age: number;
  hasMedicalCard: boolean;
  pensionPercent: number;
  pensionAmount: number;
  rentCredit: boolean;
  homeCarerCredit: boolean;
  hasChildren: boolean;
}

const initialState: CalculatorState = {
  grossSalary: 50000,
  frequency: "yearly",
  employmentType: "employee",
  maritalStatus: "single",
  spouseIncome: 0,
  age: 35,
  hasMedicalCard: false,
  pensionPercent: 0,
  pensionAmount: 0,
  rentCredit: false,
  homeCarerCredit: false,
  hasChildren: false,
};

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

function toAnnual(value: number, freq: Frequency): number {
  if (freq === "monthly") return value * 12;
  if (freq === "weekly") return value * 52;
  return value;
}

function fromAnnual(value: number, freq: Frequency): number {
  if (freq === "monthly") return value / 12;
  if (freq === "weekly") return value / 52;
  return value;
}

function formatMoney(n: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(n);
}

export function IncomeTaxCalculatorClient() {
  const [state, setState] = useState<CalculatorState>(initialState);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const annualGross = toAnnual(state.grossSalary, state.frequency);
  const annualSpouse = toAnnual(state.spouseIncome, state.frequency);

  const results = useMemo(() => {
    const gross = annualGross;
    const spouseGross = annualSpouse;

    // Pension relief
    const pensionFromPercent = gross * (state.pensionPercent / 100);
    const pensionContribution = pensionFromPercent + state.pensionAmount;
    const taxableIncome = Math.max(0, gross - pensionContribution);

    // Tax Bands
    let standardBand = 44000;
    if (state.maritalStatus === "marriedOne") standardBand = 53000;
    if (state.maritalStatus === "singleParent") standardBand = 48000;
    if (state.maritalStatus === "marriedTwo") {
      const increase = Math.min(35000, spouseGross);
      standardBand = 53000 + increase;
    }

    // Income Tax
    const standardRateAmount = Math.min(taxableIncome, standardBand);
    const higherRateAmount = Math.max(0, taxableIncome - standardBand);
    const incomeTaxBeforeCredits =
      standardRateAmount * 0.2 + higherRateAmount * 0.4;

    // Tax Credits
    let credits = 0;
    if (state.maritalStatus === "single" || state.maritalStatus === "singleParent") {
      credits += 2000; // Personal
    } else {
      credits += 4000; // Married
    }

    if (state.employmentType === "employee") {
      credits += 2000; // PAYE
    } else {
      credits += 2000; // Earned Income
    }

    if (state.maritalStatus === "singleParent" && state.hasChildren) {
      credits += 1900; // SPCCC
    }

    if (state.homeCarerCredit && state.maritalStatus.startsWith("married")) {
      credits += 1950;
    }

    if (state.rentCredit) {
      credits += state.maritalStatus.startsWith("married") ? 2000 : 1000;
    }

    const incomeTax = Math.max(0, incomeTaxBeforeCredits - credits);

    // USC
    let usc = 0;
    const uscIncome = gross; // USC on gross before pension relief generally, but pension reduces it slightly in reality. We'll use gross for simplicity.
    if (uscIncome > 13000) {
      const reducedRate =
        (state.age >= 70 || state.hasMedicalCard) && uscIncome <= 60000;

      if (reducedRate) {
        usc = Math.min(uscIncome, 12012) * 0.005;
        usc += Math.max(0, uscIncome - 12012) * 0.02;
      } else {
        usc += Math.min(uscIncome, 12012) * 0.005;
        if (uscIncome > 12012) {
          usc += Math.min(uscIncome, 28700) - 12012 > 0
            ? (Math.min(uscIncome, 28700) - 12012) * 0.02
            : 0;
        }
        if (uscIncome > 28700) {
          usc += Math.min(uscIncome, 70044) - 28700 > 0
            ? (Math.min(uscIncome, 70044) - 28700) * 0.03
            : 0;
        }
        if (uscIncome > 70044) {
          usc += (uscIncome - 70044) * 0.08;
        }
        if (state.employmentType === "selfEmployed" && uscIncome > 100000) {
          usc += (uscIncome - 100000) * 0.03; // Surcharge
        }
      }
    }

    // PRSI
    let prsi = 0;
    if (state.age < 66) {
      const prsiRate = 0.042375; // Composite 2026 rate
      if (state.employmentType === "employee") {
        if (gross > 22048) {
          prsi = gross * prsiRate;
        } else if (gross > 18304) {
          // Rough tapered credit approximation
          const weekly = gross / 52;
          const credit = Math.max(0, 12 - (weekly - 352) / 2) * 52;
          prsi = gross * prsiRate - credit;
        } else {
          prsi = 0;
        }
      } else {
        prsi = Math.max(650, gross * prsiRate);
      }
    }

    const totalDeductions = incomeTax + usc + prsi + pensionContribution;
    const netPay = gross - totalDeductions;
    const effectiveRate = gross > 0 ? (totalDeductions / gross) * 100 : 0;

    return {
      gross,
      standardRateAmount,
      higherRateAmount,
      incomeTaxBeforeCredits,
      credits,
      incomeTax,
      usc,
      prsi,
      pensionContribution,
      totalDeductions,
      netPay,
      effectiveRate,
    };
  }, [annualGross, annualSpouse, state]);

  const pieData = [
    { name: "Net Pay", value: Math.max(0, results.netPay) },
    { name: "PAYE Tax", value: results.incomeTax },
    { name: "USC", value: results.usc },
    { name: "PRSI", value: results.prsi },
    { name: "Pension", value: results.pensionContribution },
  ].filter((d) => d.value > 0);

  const handleInputChange = (
    field: keyof CalculatorState,
    value: string | number | boolean
  ) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-premium border border-slate-200">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <Calculator className="h-5 w-5 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Your Details</h2>
            </div>

            {/* Gross Salary */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <Euro className="h-4 w-4 text-emerald-600" />
                Gross Salary
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={state.grossSalary || ""}
                  onChange={(e) =>
                    handleInputChange("grossSalary", Number(e.target.value))
                  }
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="50000"
                />
                <select
                  value={state.frequency}
                  onChange={(e) =>
                    handleInputChange("frequency", e.target.value as Frequency)
                  }
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="yearly">/year</option>
                  <option value="monthly">/month</option>
                  <option value="weekly">/week</option>
                </select>
              </div>
            </div>

            {/* Employment Type */}
            <div className="mt-5 space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <Briefcase className="h-4 w-4 text-emerald-600" />
                Employment Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "employee", label: "Employee (PAYE)" },
                  { value: "selfEmployed", label: "Self-Employed" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() =>
                      handleInputChange("employmentType", opt.value)
                    }
                    className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                      state.employmentType === opt.value
                        ? "border-emerald-500 bg-emerald-100 text-emerald-700"
                        : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-600"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Marital Status */}
            <div className="mt-5 space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <Users className="h-4 w-4 text-emerald-600" />
                Marital Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "single", label: "Single" },
                  { value: "marriedOne", label: "Married (1 Income)" },
                  { value: "marriedTwo", label: "Married (2 Incomes)" },
                  { value: "singleParent", label: "Single Parent" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() =>
                      handleInputChange("maritalStatus", opt.value)
                    }
                    className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                      state.maritalStatus === opt.value
                        ? "border-emerald-500 bg-emerald-100 text-emerald-700"
                        : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-600"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Spouse Income */}
            {state.maritalStatus === "marriedTwo" && (
              <div className="mt-5 space-y-3">
                <label className="text-sm font-medium text-slate-600">
                  Spouse&apos;s Annual Gross Income
                </label>
                <input
                  type="number"
                  value={state.spouseIncome || ""}
                  onChange={(e) =>
                    handleInputChange("spouseIncome", Number(e.target.value))
                  }
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="30000"
                />
              </div>
            )}

            {/* Advanced Toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="mt-6 flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <span>Advanced Options</span>
              {showAdvanced ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                {/* Age */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600">
                    Your Age
                  </label>
                  <input
                    type="number"
                    value={state.age}
                    onChange={(e) =>
                      handleInputChange("age", Number(e.target.value))
                    }
                    className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-emerald-500 focus:outline-none"
                  />
                  <p className="text-xs text-slate-500">
                    Affects USC reduced rate eligibility and PRSI liability.
                  </p>
                </div>

                {/* Medical Card */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <HeartPulse className="h-4 w-4 text-rose-600" />
                    Full Medical Card
                  </label>
                  <button
                    onClick={() =>
                      handleInputChange("hasMedicalCard", !state.hasMedicalCard)
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      state.hasMedicalCard ? "bg-emerald-500" : "bg-slate-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        state.hasMedicalCard ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <Users className="h-4 w-4 text-blue-600" />
                    Dependent Children
                  </label>
                  <button
                    onClick={() =>
                      handleInputChange("hasChildren", !state.hasChildren)
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      state.hasChildren ? "bg-emerald-500" : "bg-slate-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        state.hasChildren ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Pension */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <PiggyBank className="h-4 w-4 text-amber-600" />
                    Pension Contribution
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={state.pensionPercent || ""}
                      onChange={(e) =>
                        handleInputChange("pensionPercent", Number(e.target.value))
                      }
                      className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-emerald-500 focus:outline-none"
                      placeholder="%"
                    />
                    <span className="flex items-center text-slate-500">%</span>
                    <input
                      type="number"
                      value={state.pensionAmount || ""}
                      onChange={(e) =>
                        handleInputChange("pensionAmount", Number(e.target.value))
                      }
                      className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-emerald-500 focus:outline-none"
                      placeholder="€"
                    />
                  </div>
                </div>

                {/* Tax Credits */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <Home className="h-4 w-4 text-violet-600" />
                    Additional Tax Credits
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={state.rentCredit}
                        onChange={(e) =>
                          handleInputChange("rentCredit", e.target.checked)
                        }
                        className="h-4 w-4 rounded border-slate-600 bg-slate-50 text-emerald-500 focus:ring-emerald-500"
                      />
                      Rent Tax Credit
                    </label>
                    <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={state.homeCarerCredit}
                        onChange={(e) =>
                          handleInputChange("homeCarerCredit", e.target.checked)
                        }
                        className="h-4 w-4 rounded border-slate-600 bg-slate-50 text-emerald-500 focus:ring-emerald-500"
                      />
                      Home Carer Tax Credit
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-7 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xl backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Net Pay
              </p>
              <p className="mt-2 text-2xl font-bold text-emerald-600">
                {formatMoney(fromAnnual(results.netPay, state.frequency))}
              </p>
              <p className="text-xs text-slate-500">per {state.frequency.slice(0, -2) || "year"}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xl backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Total Tax
              </p>
              <p className="mt-2 text-2xl font-bold text-rose-600">
                {formatMoney(fromAnnual(results.totalDeductions, state.frequency))}
              </p>
              <p className="text-xs text-slate-500">per {state.frequency.slice(0, -2) || "year"}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xl backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Effective Rate
              </p>
              <p className="mt-2 text-2xl font-bold text-amber-600">
                {results.effectiveRate.toFixed(1)}%
              </p>
              <p className="text-xs text-slate-500">of gross income</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xl backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Marginal Rate
              </p>
              <p className="mt-2 text-2xl font-bold text-blue-600">
                {results.higherRateAmount > 0 ? "48.5%" : "28.5%"}
              </p>
              <p className="text-xs text-slate-500">tax + USC + PRSI</p>
            </div>
          </div>

          {/* Chart + Breakdown */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-premium border border-slate-200">
            <h3 className="mb-4 text-lg font-bold text-slate-900">
              Where Your Money Goes
            </h3>
            <div className="grid items-center gap-6 md:grid-cols-2">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => formatMoney(value)}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        color: "#0f172a",
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      formatter={(value: string) => (
                        <span className="text-slate-600 text-sm">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                    <span className="text-sm text-slate-600">Net Take-Home Pay</span>
                  </div>
                  <span className="font-semibold text-slate-900">
                    {formatMoney(results.netPay)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <span className="text-sm text-slate-600">PAYE Income Tax</span>
                  </div>
                  <span className="font-semibold text-slate-900">
                    {formatMoney(results.incomeTax)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-amber-500" />
                    <span className="text-sm text-slate-600">Universal Social Charge</span>
                  </div>
                  <span className="font-semibold text-slate-900">
                    {formatMoney(results.usc)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="text-sm text-slate-600">PRSI</span>
                  </div>
                  <span className="font-semibold text-slate-900">
                    {formatMoney(results.prsi)}
                  </span>
                </div>
                {results.pensionContribution > 0 && (
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-violet-500" />
                      <span className="text-sm text-slate-600">Pension Contribution</span>
                    </div>
                    <span className="font-semibold text-slate-900">
                      {formatMoney(results.pensionContribution)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Breakdown Table */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-premium border border-slate-200">
            <h3 className="mb-4 text-lg font-bold text-slate-900">
              Detailed Annual Breakdown
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-2 text-sm">
                <span className="text-slate-500">Gross Income</span>
                <span className="font-medium text-slate-900">
                  {formatMoney(results.gross)}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2 text-sm">
                <span className="text-slate-500">Taxable Income (after pension)</span>
                <span className="font-medium text-slate-900">
                  {formatMoney(results.gross - results.pensionContribution)}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2 text-sm">
                <span className="text-slate-500">
                  Income Tax @ 20% (€{results.standardRateAmount.toFixed(0)})
                </span>
                <span className="font-medium text-slate-900">
                  {formatMoney(results.standardRateAmount * 0.2)}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2 text-sm">
                <span className="text-slate-500">
                  Income Tax @ 40% (€{results.higherRateAmount.toFixed(0)})
                </span>
                <span className="font-medium text-slate-900">
                  {formatMoney(results.higherRateAmount * 0.4)}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2 text-sm">
                <span className="text-slate-500">Total Tax Before Credits</span>
                <span className="font-medium text-slate-900">
                  {formatMoney(results.incomeTaxBeforeCredits)}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2 text-sm">
                <span className="text-emerald-600">Less: Tax Credits</span>
                <span className="font-medium text-emerald-600">
                  -{formatMoney(results.credits)}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2 text-sm">
                <span className="text-slate-500">PAYE Tax Payable</span>
                <span className="font-medium text-slate-900">
                  {formatMoney(results.incomeTax)}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2 text-sm">
                <span className="text-slate-500">Universal Social Charge (USC)</span>
                <span className="font-medium text-slate-900">
                  {formatMoney(results.usc)}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2 text-sm">
                <span className="text-slate-500">PRSI</span>
                <span className="font-medium text-slate-900">
                  {formatMoney(results.prsi)}
                </span>
              </div>
              {results.pensionContribution > 0 && (
                <div className="flex justify-between border-b border-slate-200 pb-2 text-sm">
                  <span className="text-slate-500">Pension Contribution</span>
                  <span className="font-medium text-slate-900">
                    {formatMoney(results.pensionContribution)}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 text-base font-bold">
                <span className="text-slate-900">Net Annual Pay</span>
                <span className="text-emerald-600">
                  {formatMoney(results.netPay)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Net Monthly Pay</span>
                <span className="font-semibold text-slate-900">
                  {formatMoney(results.netPay / 12)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Net Weekly Pay</span>
                <span className="font-semibold text-slate-900">
                  {formatMoney(results.netPay / 52)}
                </span>
              </div>
            </div>
          </div>

          {/* Tax Rate Info */}
          <div className="flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
            <div className="mt-0.5 h-5 w-5 shrink-0 text-blue-600">
              <Info className="h-5 w-5" />
            </div>
            <div className="text-sm text-slate-600">
              <p className="font-medium text-blue-600">Marginal Rate Note</p>
              <p className="mt-1">
                Your marginal tax rate is the total tax you pay on each additional
                euro earned. For most Irish employees in 2026, this is{" "}
                <strong>48.5%</strong> (40% income tax + 3% USC + 4.35% PRSI) once
                you exceed the standard rate cut-off. For self-employed individuals
                earning over €100,000, the marginal rate rises to{" "}
                <strong>51.5%</strong> due to the USC surcharge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
