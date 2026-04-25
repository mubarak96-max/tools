"use client";

import React, { useState, useMemo } from "react";
import {
  DollarSign,
  Building2,
  MapPin,
  Users,
  Shield,
  TrendingDown,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Info,
  FileText,
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
} from "recharts";

type IndustryKey =
  | "consulting"
  | "retail"
  | "restaurant"
  | "landscaping"
  | "electrician"
  | "plumber"
  | "roofing"
  | "manufacturing"
  | "realEstate"
  | "cleaning"
  | "fitness"
  | "autoRepair";

type StateKey =
  | "TX"
  | "OH"
  | "NC"
  | "GA"
  | "PA"
  | "IL"
  | "NY"
  | "CA"
  | "FL"
  | "NJ";

interface CalculatorState {
  industry: IndustryKey;
  annualRevenue: number;
  employees: number;
  yearsInBusiness: number;
  state: StateKey;
  coverageLimit: "1M-2M" | "1M-1M" | "2M-4M" | "500K-1M";
  deductible: 0 | 500 | 1000 | 2500;
  hasClaims: boolean;
  subcontractorExposure: boolean;
}

const initialState: CalculatorState = {
  industry: "consulting",
  annualRevenue: 250000,
  employees: 2,
  yearsInBusiness: 3,
  state: "TX",
  coverageLimit: "1M-2M",
  deductible: 1000,
  hasClaims: false,
  subcontractorExposure: false,
};

const INDUSTRIES: Record<
  IndustryKey,
  { label: string; baseRate: number; risk: "low" | "medium" | "high" }
> = {
  consulting: { label: "Consulting / IT Services", baseRate: 450, risk: "low" },
  realEstate: { label: "Real Estate / Property Mgmt", baseRate: 500, risk: "low" },
  retail: { label: "Retail Store", baseRate: 750, risk: "medium" },
  restaurant: { label: "Restaurant / Food Service", baseRate: 1200, risk: "medium" },
  landscaping: { label: "Landscaping / Lawn Care", baseRate: 1100, risk: "medium" },
  cleaning: { label: "Commercial Cleaning", baseRate: 900, risk: "medium" },
  electrician: { label: "Electrical Contractor", baseRate: 2000, risk: "high" },
  plumber: { label: "Plumbing Contractor", baseRate: 2200, risk: "high" },
  roofing: { label: "Roofing Contractor", baseRate: 4500, risk: "high" },
  manufacturing: { label: "Manufacturing", baseRate: 1800, risk: "high" },
  fitness: { label: "Gym / Fitness Center", baseRate: 1600, risk: "high" },
  autoRepair: { label: "Auto Repair Shop", baseRate: 1400, risk: "high" },
};

const STATES: Record<StateKey, { label: string; modifier: number }> = {
  TX: { label: "Texas", modifier: 0.92 },
  OH: { label: "Ohio", modifier: 0.95 },
  NC: { label: "North Carolina", modifier: 0.97 },
  GA: { label: "Georgia", modifier: 1.0 },
  PA: { label: "Pennsylvania", modifier: 1.05 },
  IL: { label: "Illinois", modifier: 1.18 },
  NY: { label: "New York", modifier: 1.25 },
  CA: { label: "California", modifier: 1.35 },
  FL: { label: "Florida", modifier: 1.4 },
  NJ: { label: "New Jersey", modifier: 1.22 },
};

const COVERAGE_MULTIPLIERS: Record<string, number> = {
  "500K-1M": 0.85,
  "1M-1M": 0.92,
  "1M-2M": 1.0,
  "2M-4M": 1.28,
};

const DEDUCTIBLE_DISCOUNTS: Record<number, number> = {
  0: 0,
  500: 0.02,
  1000: 0.07,
  2500: 0.14,
};

function formatMoney(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function GeneralLiabilityCalculatorClient() {
  const [state, setState] = useState<CalculatorState>(initialState);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const results = useMemo(() => {
    const industry = INDUSTRIES[state.industry];
    const stateMod = STATES[state.state];

    let premium = industry.baseRate;

    // Revenue factor (scales roughly with square root of revenue ratio from baseline $250k)
    const revenueRatio = Math.sqrt(state.annualRevenue / 250000);
    premium *= revenueRatio;

    // Employee factor
    const employeeFactor = 1 + (state.employees - 1) * 0.08;
    premium *= employeeFactor;

    // State modifier
    premium *= stateMod.modifier;

    // Coverage limit
    premium *= COVERAGE_MULTIPLIERS[state.coverageLimit];

    // Deductible discount
    const deductibleDiscount = DEDUCTIBLE_DISCOUNTS[state.deductible];
    premium *= 1 - deductibleDiscount;

    // Years in business (new businesses pay more)
    if (state.yearsInBusiness < 2) premium *= 1.15;
    else if (state.yearsInBusiness < 5) premium *= 1.05;
    else if (state.yearsInBusiness >= 10) premium *= 0.95;

    // Claims history
    if (state.hasClaims) premium *= 1.35;

    // Subcontractor exposure
    if (state.subcontractorExposure) premium *= 1.25;

    // Minimum premium floor
    premium = Math.max(350, premium);

    const monthly = premium / 12;

    // Breakdown
    const basePremium = industry.baseRate * revenueRatio * employeeFactor * stateMod.modifier;
    const coverageAdjustment = basePremium * (COVERAGE_MULTIPLIERS[state.coverageLimit] - 1);
    const deductibleSavings = basePremium * COVERAGE_MULTIPLIERS[state.coverageLimit] * deductibleDiscount;
    const experienceModifier = premium - (basePremium * COVERAGE_MULTIPLIERS[state.coverageLimit] * (1 - deductibleDiscount));
    const claimsSurcharge = state.hasClaims ? basePremium * COVERAGE_MULTIPLIERS[state.coverageLimit] * (1 - deductibleDiscount) * 0.35 : 0;
    const subSurcharge = state.subcontractorExposure ? (basePremium * COVERAGE_MULTIPLIERS[state.coverageLimit] * (1 - deductibleDiscount) + claimsSurcharge) * 0.25 : 0;

    return {
      annual: premium,
      monthly,
      basePremium,
      coverageAdjustment,
      deductibleSavings,
      experienceModifier,
      claimsSurcharge,
      subSurcharge,
    };
  }, [state]);

  const barData = [
    { name: "Base Premium", value: Math.max(0, results.basePremium), color: "#3b82f6" },
    { name: "Coverage Adj", value: Math.max(0, results.coverageAdjustment), color: "#8b5cf6" },
    { name: "Experience", value: Math.max(0, results.experienceModifier), color: "#f59e0b" },
    { name: "Claims", value: Math.max(0, results.claimsSurcharge), color: "#ef4444" },
    { name: "Subcontractors", value: Math.max(0, results.subSurcharge), color: "#ec4899" },
  ].filter((d) => d.value > 10);

  const handleChange = <K extends keyof CalculatorState>(
    field: K,
    value: CalculatorState[K]
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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Business Details</h2>
            </div>

            {/* Industry */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <Building2 className="h-4 w-4 text-blue-600" />
                Industry / Business Type
              </label>
              <select
                value={state.industry}
                onChange={(e) => handleChange("industry", e.target.value as IndustryKey)}
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {Object.entries(INDUSTRIES).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    INDUSTRIES[state.industry].risk === "low"
                      ? "bg-emerald-100 text-emerald-700"
                      : INDUSTRIES[state.industry].risk === "medium"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {INDUSTRIES[state.industry].risk.charAt(0).toUpperCase() +
                    INDUSTRIES[state.industry].risk.slice(1)}{" "}
                  Risk
                </span>
              </div>
            </div>

            {/* Revenue */}
            <div className="mt-5 space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <DollarSign className="h-4 w-4 text-blue-600" />
                Annual Revenue
              </label>
              <input
                type="number"
                value={state.annualRevenue || ""}
                onChange={(e) => handleChange("annualRevenue", Number(e.target.value))}
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="250000"
              />
            </div>

            {/* Employees */}
            <div className="mt-5 space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <Users className="h-4 w-4 text-blue-600" />
                Number of Employees
              </label>
              <input
                type="number"
                value={state.employees}
                onChange={(e) => handleChange("employees", Number(e.target.value))}
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                min={1}
              />
            </div>

            {/* State */}
            <div className="mt-5 space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <MapPin className="h-4 w-4 text-blue-600" />
                State
              </label>
              <select
                value={state.state}
                onChange={(e) => handleChange("state", e.target.value as StateKey)}
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {Object.entries(STATES).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Coverage Limit */}
            <div className="mt-5 space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <Shield className="h-4 w-4 text-blue-600" />
                Coverage Limits
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "500K-1M", label: "$500K / $1M" },
                  { value: "1M-1M", label: "$1M / $1M" },
                  { value: "1M-2M", label: "$1M / $2M" },
                  { value: "2M-4M", label: "$2M / $4M" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleChange("coverageLimit", opt.value as any)}
                    className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                      state.coverageLimit === opt.value
                        ? "border-blue-500 bg-blue-100 text-blue-700"
                        : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-600"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500">
                Per Occurrence / Aggregate
              </p>
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
                    className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none"
                    min={0}
                  />
                  <p className="text-xs text-slate-500">
                    New businesses (under 2 years) typically pay 15% more.
                  </p>
                </div>

                {/* Deductible */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600">
                    Deductible
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 500, 1000, 2500].map((d) => (
                      <button
                        key={d}
                        onClick={() => handleChange("deductible", d as any)}
                        className={`rounded-lg border px-2 py-2 text-sm font-medium transition ${
                          state.deductible === d
                            ? "border-blue-500 bg-blue-100 text-blue-700"
                            : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-600"
                        }`}
                      >
                        {d === 0 ? "$0" : `$${d.toLocaleString()}`}
                      </button>
                    ))}
                  </div>
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

                {/* Subcontractors */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <Users className="h-4 w-4 text-amber-600" />
                    Use Subcontractors
                  </label>
                  <button
                    onClick={() => handleChange("subcontractorExposure", !state.subcontractorExposure)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      state.subcontractorExposure ? "bg-amber-500" : "bg-slate-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        state.subcontractorExposure ? "translate-x-6" : "translate-x-1"
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
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xl backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Estimated Annual Premium
              </p>
              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {formatMoney(results.annual)}
              </p>
              <div className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-600">
                <TrendingDown className="h-3 w-3" />
                <span>Estimate only</span>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xl backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Estimated Monthly
              </p>
              <p className="mt-2 text-3xl font-bold text-blue-600">
                {formatMoney(results.monthly)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {state.deductible > 0
                  ? `$${state.deductible.toLocaleString()} deductible`
                  : "No deductible"}
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-premium border border-slate-200">
            <h3 className="mb-4 text-lg font-bold text-slate-900">
              Premium Breakdown
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
                    width={100}
                  />
                  <Tooltip
                    formatter={(value: any) => formatMoney(value)}
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      color: "#0f172a",
                    }}
                  />
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
              Detailed Cost Breakdown
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-2 text-sm">
                <span className="text-slate-500">Base Premium ({INDUSTRIES[state.industry].label})</span>
                <span className="font-medium text-slate-900">
                  {formatMoney(results.basePremium)}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2 text-sm">
                <span className="text-slate-500">Coverage Limit Adjustment</span>
                <span className="font-medium text-slate-900">
                  +{formatMoney(results.coverageAdjustment)}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2 text-sm">
                <span className="text-slate-500">Experience Modifier</span>
                <span className="font-medium text-slate-900">
                  {results.experienceModifier >= 0 ? "+" : ""}
                  {formatMoney(results.experienceModifier)}
                </span>
              </div>
              {results.claimsSurcharge > 0 && (
                <div className="flex justify-between border-b border-slate-200 pb-2 text-sm">
                  <span className="text-rose-600">Claims History Surcharge</span>
                  <span className="font-medium text-rose-600">
                    +{formatMoney(results.claimsSurcharge)}
                  </span>
                </div>
              )}
              {results.subSurcharge > 0 && (
                <div className="flex justify-between border-b border-slate-200 pb-2 text-sm">
                  <span className="text-amber-600">Subcontractor Exposure</span>
                  <span className="font-medium text-amber-600">
                    +{formatMoney(results.subSurcharge)}
                  </span>
                </div>
              )}
              {results.deductibleSavings > 0 && (
                <div className="flex justify-between border-b border-slate-200 pb-2 text-sm">
                  <span className="text-emerald-600">Deductible Discount</span>
                  <span className="font-medium text-emerald-600">
                    -{formatMoney(results.deductibleSavings)}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-b border-slate-200 pb-2 text-sm">
                <span className="text-slate-500">State Modifier ({STATES[state.state].label})</span>
                <span className="font-medium text-slate-900">
                  × {STATES[state.state].modifier}
                </span>
              </div>
              <div className="flex justify-between pt-2 text-base font-bold">
                <span className="text-slate-900">Estimated Annual Premium</span>
                <span className="text-emerald-600">
                  {formatMoney(results.annual)}
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

          {/* Comparison Context */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-premium border border-slate-200">
            <h3 className="mb-4 text-lg font-bold text-slate-900">
              How Your Estimate Compares
            </h3>
            <div className="space-y-4">
              {Object.entries(INDUSTRIES)
                .filter(([key]) => key !== state.industry)
                .slice(0, 3)
                .map(([key, val]) => {
                  const base = val.baseRate * STATES[state.state].modifier;
                  const diff = ((results.annual - base) / base) * 100;
                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3"
                    >
                      <span className="text-sm text-slate-600">{val.label}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-900">
                          {formatMoney(base)}
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            diff > 0 ? "text-rose-600" : "text-emerald-600"
                          }`}
                        >
                          {diff > 0 ? "+" : ""}
                          {diff.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-50 p-4">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div className="text-sm text-slate-600">
              <p className="font-medium text-amber-600">Estimate Disclaimer</p>
              <p className="mt-1">
                This calculator provides indicative estimates based on aggregate
                market data. Actual premiums depend on carrier-specific
                underwriting, exact classification codes, credit history (where
                permitted), and individual risk factors. For binding quotes,
                contact a licensed commercial insurance agent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
