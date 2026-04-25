"use client";

import React, { useState, useMemo } from "react";
import {
  DollarSign,
  Building2,
  MapPin,
  Users,
  Shield,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Info,
  Calculator,
  Award,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";

type IndustryKey =
  | "clerical"
  | "sales"
  | "medicalOffice"
  | "retail"
  | "restaurant"
  | "janitorial"
  | "landscaping"
  | "plumbing"
  | "carpentry"
  | "roofing"
  | "manufacturing"
  | "autoRepair";

type StateKey =
  | "TX"
  | "IN"
  | "VA"
  | "GA"
  | "PA"
  | "FL"
  | "IL"
  | "CA"
  | "NY"
  | "OH"
  | "ND"
  | "WA"
  | "WY";

interface CalculatorState {
  industry: IndustryKey;
  annualPayroll: number;
  employees: number;
  state: StateKey;
  emr: number;
  yearsInBusiness: number;
  safetyProgram: boolean;
  drugFree: boolean;
  hasClaims: boolean;
}

const initialState: CalculatorState = {
  industry: "retail",
  annualPayroll: 250000,
  employees: 5,
  state: "TX",
  emr: 1.0,
  yearsInBusiness: 3,
  safetyProgram: false,
  drugFree: false,
  hasClaims: false,
};

const INDUSTRIES: Record<
  IndustryKey,
  { label: string; classCode: string; baseRate: number; risk: "low" | "medium" | "high" | "veryHigh" }
> = {
  clerical: { label: "Clerical Office", classCode: "8810", baseRate: 0.35, risk: "low" },
  sales: { label: "Outside Sales", classCode: "8742", baseRate: 0.45, risk: "low" },
  medicalOffice: { label: "Medical Office", classCode: "8832", baseRate: 0.55, risk: "low" },
  retail: { label: "Retail Store", classCode: "8017", baseRate: 1.85, risk: "medium" },
  restaurant: { label: "Restaurant / Food Service", classCode: "9082", baseRate: 2.10, risk: "medium" },
  janitorial: { label: "Janitorial Services", classCode: "9014", baseRate: 2.85, risk: "medium" },
  landscaping: { label: "Landscaping", classCode: "0042", baseRate: 4.20, risk: "high" },
  plumbing: { label: "Plumbing Contractor", classCode: "5183", baseRate: 5.75, risk: "high" },
  carpentry: { label: "Residential Carpentry", classCode: "5645", baseRate: 8.50, risk: "high" },
  roofing: { label: "Roofing Contractor", classCode: "5551", baseRate: 18.50, risk: "veryHigh" },
  manufacturing: { label: "Manufacturing", classCode: "3632", baseRate: 6.20, risk: "high" },
  autoRepair: { label: "Auto Repair Shop", classCode: "8380", baseRate: 5.10, risk: "high" },
};

const STATES: Record<StateKey, { label: string; modifier: number; monopolistic: boolean }> = {
  TX: { label: "Texas", modifier: 0.85, monopolistic: false },
  IN: { label: "Indiana", modifier: 0.90, monopolistic: false },
  VA: { label: "Virginia", modifier: 0.95, monopolistic: false },
  GA: { label: "Georgia", modifier: 1.00, monopolistic: false },
  PA: { label: "Pennsylvania", modifier: 1.15, monopolistic: false },
  FL: { label: "Florida", modifier: 1.25, monopolistic: false },
  IL: { label: "Illinois", modifier: 1.30, monopolistic: false },
  CA: { label: "California", modifier: 1.55, monopolistic: false },
  NY: { label: "New York", modifier: 1.65, monopolistic: false },
  OH: { label: "Ohio", modifier: 1.10, monopolistic: true },
  ND: { label: "North Dakota", modifier: 0.95, monopolistic: true },
  WA: { label: "Washington", modifier: 1.45, monopolistic: true },
  WY: { label: "Wyoming", modifier: 1.05, monopolistic: true },
};

const RISK_COLORS = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#ef4444",
  veryHigh: "#dc2626",
};

const RISK_LABELS = {
  low: "Low Risk",
  medium: "Medium Risk",
  high: "High Risk",
  veryHigh: "Very High Risk",
};

function formatMoney(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function WorkersCompCalculatorClient() {
  const [state, setState] = useState<CalculatorState>(initialState);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const results = useMemo(() => {
    const industry = INDUSTRIES[state.industry];
    const stateData = STATES[state.state];

    // Base manual premium
    const manualPremium = (state.annualPayroll / 100) * industry.baseRate;

    // State modifier
    let premium = manualPremium * stateData.modifier;

    // EMR
    premium *= state.emr;

    // Years in business (new business surcharge)
    if (state.yearsInBusiness < 2) premium *= 1.10;
    else if (state.yearsInBusiness >= 10) premium *= 0.95;

    // Safety program discount
    if (state.safetyProgram) premium *= 0.93;

    // Drug-free workplace discount
    if (state.drugFree) premium *= 0.95;

    // Claims surcharge
    if (state.hasClaims) premium *= 1.15;

    // Minimum premium floor
    premium = Math.max(750, premium);

    const monthly = premium / 12;
    const perEmployee = state.employees > 0 ? premium / state.employees : 0;
    const per100Payroll = state.annualPayroll > 0 ? (premium / state.annualPayroll) * 100 : 0;

    return {
      manualPremium,
      premium,
      monthly,
      perEmployee,
      per100Payroll,
      stateModifier: stateData.modifier,
      emrImpact: manualPremium * stateData.modifier * (state.emr - 1),
      safetySavings: state.safetyProgram ? manualPremium * stateData.modifier * state.emr * 0.07 : 0,
      drugSavings: state.drugFree ? manualPremium * stateData.modifier * state.emr * (state.safetyProgram ? 0.93 : 1) * 0.05 : 0,
      claimsSurcharge: state.hasClaims ? manualPremium * stateData.modifier * state.emr * 0.15 : 0,
    };
  }, [state]);

  const barData = [
    { name: "Base Manual", value: Math.max(0, results.manualPremium), color: "#3b82f6" },
    { name: "State Adj", value: Math.max(0, results.manualPremium * (results.stateModifier - 1)), color: "#8b5cf6" },
    { name: "EMR Impact", value: Math.max(0, results.emrImpact), color: "#f59e0b" },
    { name: "Claims", value: Math.max(0, results.claimsSurcharge), color: "#ef4444" },
    { name: "Safety", value: Math.max(0, -(results.safetySavings + results.drugSavings)), color: "#10b981" },
  ].filter((d) => Math.abs(d.value) > 10);

  const handleChange = <K extends keyof CalculatorState>(
    field: K,
    value: CalculatorState[K]
  ) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  const isMonopolistic = STATES[state.state].monopolistic;

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
              <h2 className="text-xl font-bold text-slate-900">Business Details</h2>
            </div>

            {/* Industry */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <Building2 className="h-4 w-4 text-emerald-600" />
                Industry / Class Code
              </label>
              <select
                value={state.industry}
                onChange={(e) => handleChange("industry", e.target.value as IndustryKey)}
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {Object.entries(INDUSTRIES).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label} (Code {val.classCode})
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: `${RISK_COLORS[INDUSTRIES[state.industry].risk]}20`,
                    color: RISK_COLORS[INDUSTRIES[state.industry].risk],
                  }}
                >
                  {RISK_LABELS[INDUSTRIES[state.industry].risk]}
                </span>
                <span className="text-xs text-slate-500">
                  ${INDUSTRIES[state.industry].baseRate.toFixed(2)} per $100 payroll
                </span>
              </div>
            </div>

            {/* Payroll */}
            <div className="mt-5 space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                Annual Payroll
              </label>
              <input
                type="number"
                value={state.annualPayroll || ""}
                onChange={(e) => handleChange("annualPayroll", Number(e.target.value))}
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="250000"
              />
            </div>

            {/* Employees */}
            <div className="mt-5 space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <Users className="h-4 w-4 text-emerald-600" />
                Number of Employees
              </label>
              <input
                type="number"
                value={state.employees}
                onChange={(e) => handleChange("employees", Number(e.target.value))}
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                min={1}
              />
            </div>

            {/* State */}
            <div className="mt-5 space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <MapPin className="h-4 w-4 text-emerald-600" />
                State
              </label>
              <select
                value={state.state}
                onChange={(e) => handleChange("state", e.target.value as StateKey)}
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {Object.entries(STATES).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label} {val.monopolistic ? "(Monopolistic)" : ""}
                  </option>
                ))}
              </select>
              {isMonopolistic && (
                <p className="text-xs text-blue-600">
                  Monopolistic state — private insurance not available for standard coverage.
                </p>
              )}
            </div>

            {/* EMR */}
            <div className="mt-5 space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <Award className="h-4 w-4 text-emerald-600" />
                Experience Mod Rate (EMR)
              </label>
              <input
                type="number"
                step="0.01"
                value={state.emr}
                onChange={(e) => handleChange("emr", Number(e.target.value))}
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <div className="flex items-center gap-2 text-xs">
                <span className={state.emr < 1 ? "text-emerald-600" : state.emr > 1 ? "text-rose-600" : "text-slate-500"}>
                  {state.emr < 1 ? "↓ Discount" : state.emr > 1 ? "↑ Surcharge" : "→ Average"}
                </span>
                <span className="text-slate-500">| 1.00 is industry average</span>
              </div>
            </div>

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
                {/* Years in Business */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600">
                    Years in Business
                  </label>
                  <input
                    type="number"
                    value={state.yearsInBusiness}
                    onChange={(e) => handleChange("yearsInBusiness", Number(e.target.value))}
                    className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-emerald-500 focus:outline-none"
                    min={0}
                  />
                  <p className="text-xs text-slate-500">
                    Under 2 years: +10% surcharge. Over 10 years: 5% discount.
                  </p>
                </div>

                {/* Safety Program */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <Shield className="h-4 w-4 text-emerald-600" />
                    Formal Safety Program
                  </label>
                  <button
                    onClick={() => handleChange("safetyProgram", !state.safetyProgram)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      state.safetyProgram ? "bg-emerald-500" : "bg-slate-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        state.safetyProgram ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Drug Free */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <Award className="h-4 w-4 text-blue-600" />
                    Drug-Free Workplace
                  </label>
                  <button
                    onClick={() => handleChange("drugFree", !state.drugFree)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      state.drugFree ? "bg-blue-500" : "bg-slate-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        state.drugFree ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Claims */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <AlertTriangle className="h-4 w-4 text-rose-600" />
                    Claims in Past 3 Years
                  </label>
                  <button
                    onClick={() => handleChange("hasClaims", !state.hasClaims)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      state.hasClaims ? "bg-rose-500" : "bg-slate-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        state.hasClaims ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
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
                Est. Annual Premium
              </p>
              <p className="mt-2 text-2xl font-bold text-emerald-600">
                {formatMoney(results.premium)}
              </p>
              <p className="text-xs text-slate-500">before taxes & fees</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xl backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Est. Monthly
              </p>
              <p className="mt-2 text-2xl font-bold text-blue-600">
                {formatMoney(results.monthly)}
              </p>
              <p className="text-xs text-slate-500">estimated payment</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xl backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Per Employee
              </p>
              <p className="mt-2 text-2xl font-bold text-amber-600">
                {formatMoney(results.perEmployee)}
              </p>
              <p className="text-xs text-slate-500">annual avg.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xl backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Rate per $100
              </p>
              <p className="mt-2 text-2xl font-bold text-violet-600">
                ${results.per100Payroll.toFixed(2)}
              </p>
              <p className="text-xs text-slate-500">of payroll</p>
            </div>
          </div>

          {/* Chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-premium border border-slate-200">
            <h3 className="mb-4 text-lg font-bold text-slate-900">
              Premium Composition
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis
                    type="number"
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    stroke="#64748b"
                    fontSize={12}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={12}
                    width={90}
                  />
                  <Tooltip
                    formatter={(value: any) => formatMoney(Math.abs(value))}
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      color: "#0f172a",
                    }}
                  />
                  <ReferenceLine x={0} stroke="#475569" />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-premium border border-slate-200">
            <h3 className="mb-4 text-lg font-bold text-slate-900">
              Detailed Calculation
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-2 text-sm">
                <span className="text-slate-500">
                  Manual Premium ({INDUSTRIES[state.industry].classCode})
                </span>
                <span className="font-medium text-slate-900">
                  {formatMoney(results.manualPremium)}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2 text-sm">
                <span className="text-slate-500">
                  State Modifier ({STATES[state.state].label})
                </span>
                <span className="font-medium text-slate-900">
                  × {results.stateModifier.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2 text-sm">
                <span className="text-slate-500">
                  Experience Mod (EMR)
                </span>
                <span className="font-medium text-slate-900">
                  × {state.emr.toFixed(2)}
                </span>
              </div>
              {results.safetySavings > 0 && (
                <div className="flex justify-between border-b border-slate-200 pb-2 text-sm">
                  <span className="text-emerald-600">Safety Program Discount</span>
                  <span className="font-medium text-emerald-600">
                    -{formatMoney(results.safetySavings)}
                  </span>
                </div>
              )}
              {results.drugSavings > 0 && (
                <div className="flex justify-between border-b border-slate-200 pb-2 text-sm">
                  <span className="text-emerald-600">Drug-Free Workplace Discount</span>
                  <span className="font-medium text-emerald-600">
                    -{formatMoney(results.drugSavings)}
                  </span>
                </div>
              )}
              {results.claimsSurcharge > 0 && (
                <div className="flex justify-between border-b border-slate-200 pb-2 text-sm">
                  <span className="text-rose-600">Claims History Surcharge</span>
                  <span className="font-medium text-rose-600">
                    +{formatMoney(results.claimsSurcharge)}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 text-base font-bold">
                <span className="text-slate-900">Estimated Annual Premium</span>
                <span className="text-emerald-600">
                  {formatMoney(results.premium)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Estimated Monthly</span>
                <span className="font-semibold text-slate-900">
                  {formatMoney(results.monthly)}
                </span>
              </div>
            </div>
          </div>

          {/* Industry Comparison */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-premium border border-slate-200">
            <h3 className="mb-4 text-lg font-bold text-slate-900">
              Cost Comparison by Industry
            </h3>
            <p className="mb-4 text-sm text-slate-500">
              Estimated annual premium for ${state.annualPayroll.toLocaleString()} payroll in {STATES[state.state].label} with EMR 1.0:
            </p>
            <div className="space-y-3">
              {Object.entries(INDUSTRIES)
                .sort((a, b) => a[1].baseRate - b[1].baseRate)
                .map(([key, val]) => {
                  const est = (state.annualPayroll / 100) * val.baseRate * STATES[state.state].modifier;
                  const isActive = key === state.industry;
                  return (
                    <div
                      key={key}
                      className={`flex items-center justify-between rounded-lg px-4 py-2.5 text-sm ${
                        isActive ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-slate-500">{val.classCode}</span>
                        <span className={isActive ? "text-white font-medium" : "text-slate-600"}>
                          {val.label}
                        </span>
                      </div>
                      <span className={isActive ? "font-bold text-emerald-600" : "font-medium text-slate-500"}>
                        {formatMoney(est)}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Monopolistic Warning */}
          {isMonopolistic && (
            <div className="flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
              <div className="text-sm text-slate-600">
                <p className="font-medium text-blue-600">Monopolistic State Notice</p>
                <p className="mt-1">
                  {STATES[state.state].label} operates a monopolistic workers
                  compensation fund. Employers must purchase coverage through the
                  state fund. Private insurance is not available for standard
                  workers comp, though stop-gap employer's liability coverage may
                  be obtained separately.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
