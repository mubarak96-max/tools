"use client";

import React, { useState, useMemo } from "react";
import {
  Globe,
  PoundSterling,
  DollarSign,
  Euro,
  Users,
  Home,
  Heart,
  TrendingDown,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Info,
  Landmark,
  Calculator,
  Building2,
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
  PieChart,
  Pie,
  Legend,
} from "recharts";

type CountryKey =
  | "uk"
  | "usa"
  | "ireland"
  | "france"
  | "germany"
  | "spain"
  | "italy"
  | "canada"
  | "australia"
  | "india";

type RelationshipKey =
  | "spouse"
  | "child"
  | "grandchild"
  | "sibling"
  | "parent"
  | "other";

interface CalculatorState {
  country: CountryKey;
  estateValue: number;
  debts: number;
  relationship: RelationshipKey;
  numBeneficiaries: number;
  mainResidenceValue: number;
  mainResidenceToDescendants: boolean;
  charityPercent: number;
  yearsOwnedBusiness: number;
  isBusinessProperty: boolean;
  isAgricultural: boolean;
  priorGifts: number;
}

const initialState: CalculatorState = {
  country: "uk",
  estateValue: 800000,
  debts: 0,
  relationship: "child",
  numBeneficiaries: 2,
  mainResidenceValue: 400000,
  mainResidenceToDescendants: true,
  charityPercent: 0,
  yearsOwnedBusiness: 0,
  isBusinessProperty: false,
  isAgricultural: false,
  priorGifts: 0,
};

const COUNTRIES: Record<
  CountryKey,
  {
    label: string;
    flag: string;
    currency: string;
    currencySymbol: string;
    icon: typeof PoundSterling;
  }
> = {
  uk: { label: "United Kingdom", flag: "🇬🇧", currency: "GBP", currencySymbol: "£", icon: PoundSterling },
  usa: { label: "United States", flag: "🇺🇸", currency: "USD", currencySymbol: "$", icon: DollarSign },
  ireland: { label: "Ireland", flag: "🇮🇪", currency: "EUR", currencySymbol: "€", icon: Euro },
  france: { label: "France", flag: "🇫🇷", currency: "EUR", currencySymbol: "€", icon: Euro },
  germany: { label: "Germany", flag: "🇩🇪", currency: "EUR", currencySymbol: "€", icon: Euro },
  spain: { label: "Spain", flag: "🇪🇸", currency: "EUR", currencySymbol: "€", icon: Euro },
  italy: { label: "Italy", flag: "🇮🇹", currency: "EUR", currencySymbol: "€", icon: Euro },
  canada: { label: "Canada", flag: "🇨🇦", currency: "CAD", currencySymbol: "C$", icon: DollarSign },
  australia: { label: "Australia", flag: "🇦🇺", currency: "AUD", currencySymbol: "A$", icon: DollarSign },
  india: { label: "India", flag: "🇮🇳", currency: "INR", currencySymbol: "₹", icon: Landmark },
};

const RELATIONSHIPS: Record<RelationshipKey, string> = {
  spouse: "Spouse / Civil Partner",
  child: "Child / Direct Descendant",
  grandchild: "Grandchild",
  sibling: "Sibling",
  parent: "Parent / Ascendant",
  other: "Other / Unrelated",
};

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

function formatMoney(n: number, symbol: string): string {
  if (n >= 1_000_000) return `${symbol}${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${symbol}${(n / 1_000).toFixed(0)}k`;
  return `${symbol}${n.toFixed(0)}`;
}

function formatFullMoney(n: number, symbol: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })
    .format(n)
    .replace("$", symbol);
}

export function InheritanceTaxCalculatorClient() {
  const [state, setState] = useState<CalculatorState>(initialState);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const country = COUNTRIES[state.country];

  const results = useMemo(() => {
    const netEstate = Math.max(0, state.estateValue - state.debts);
    let tax = 0;
    let taxable = 0;
    let exempt = 0;
    let effectiveRate = 0;
    let details: string[] = [];

    switch (state.country) {
      case "uk": {
        const nrb = 325000;
        let rnrb = 0;
        if (state.mainResidenceToDescendants && state.mainResidenceValue > 0) {
          rnrb = Math.min(175000, state.mainResidenceValue);
          // Taper for estates over £2M
          if (netEstate > 2000000) {
            const taper = Math.min(rnrb, (netEstate - 2000000) / 2);
            rnrb -= taper;
            rnrb = Math.max(0, rnrb);
          }
        }
        const totalExempt = nrb + rnrb;
        exempt = Math.min(netEstate, totalExempt);
        taxable = Math.max(0, netEstate - totalExempt);

        // Charity reduction
        const charityAmount = netEstate * (state.charityPercent / 100);
        const netTaxable = Math.max(0, taxable - charityAmount);
        let rate = 0.40;
        if (state.charityPercent >= 10) rate = 0.36;

        tax = netTaxable * rate;
        effectiveRate = netEstate > 0 ? (tax / netEstate) * 100 : 0;

        details = [
          `Nil-Rate Band: £${nrb.toLocaleString()}`,
          `Residence NRB: £${Math.round(rnrb).toLocaleString()}`,
          `Total exempt: £${Math.round(exempt).toLocaleString()}`,
          `Taxable estate: £${Math.round(taxable).toLocaleString()}`,
          `Charity gift: ${state.charityPercent}%`,
          `Tax rate: ${(rate * 100).toFixed(0)}%`,
        ];
        break;
      }

      case "usa": {
        // 2026 exemption (estimated inflation-adjusted from 2025 $13.61M)
        const exemption = 13990000;
        const spouseExemption = state.relationship === "spouse" ? netEstate : 0;
        exempt = Math.min(netEstate, exemption + spouseExemption);
        taxable = Math.max(0, netEstate - exemption);

        if (taxable > 0) {
          // Progressive estate tax brackets (simplified)
          if (taxable <= 10000) tax = taxable * 0.18;
          else if (taxable <= 20000) tax = 1800 + (taxable - 10000) * 0.20;
          else if (taxable <= 40000) tax = 3800 + (taxable - 20000) * 0.22;
          else if (taxable <= 60000) tax = 8200 + (taxable - 40000) * 0.24;
          else if (taxable <= 80000) tax = 13000 + (taxable - 60000) * 0.26;
          else if (taxable <= 100000) tax = 18200 + (taxable - 80000) * 0.28;
          else if (taxable <= 150000) tax = 23800 + (taxable - 100000) * 0.30;
          else if (taxable <= 250000) tax = 38800 + (taxable - 150000) * 0.32;
          else if (taxable <= 500000) tax = 70800 + (taxable - 250000) * 0.34;
          else if (taxable <= 750000) tax = 155800 + (taxable - 500000) * 0.37;
          else if (taxable <= 1000000) tax = 248300 + (taxable - 750000) * 0.39;
          else tax = 345800 + (taxable - 1000000) * 0.40;
        }

        effectiveRate = netEstate > 0 ? (tax / netEstate) * 100 : 0;

        details = [
          `Federal exemption: $${exemption.toLocaleString()}`,
          `Spousal deduction: ${state.relationship === "spouse" ? "Unlimited" : "None"}`,
          `Taxable estate: $${Math.round(taxable).toLocaleString()}`,
          `Progressive rate applied up to 40%`,
        ];
        break;
      }

      case "ireland": {
        let threshold = 16250; // Group C default
        if (state.relationship === "spouse") threshold = 0; // Limited spouse exemption handled differently; use small threshold for calc
        if (state.relationship === "child") threshold = 335000;
        if (state.relationship === "parent" || state.relationship === "grandchild" || state.relationship === "sibling") threshold = 32500;

        // Prior gifts reduce threshold
        const availableThreshold = Math.max(0, threshold - state.priorGifts);
        exempt = Math.min(netEstate, availableThreshold);
        taxable = Math.max(0, netEstate - availableThreshold);

        // Dwelling house exemption (simplified)
        if (state.mainResidenceValue > 0 && state.relationship === "child") {
          const dwellingExempt = Math.min(state.mainResidenceValue, netEstate);
          // Simplified: assume qualifies if child
          exempt += dwellingExempt;
          exempt = Math.min(exempt, netEstate);
          taxable = netEstate - exempt;
        }

        // Business relief
        if (state.isBusinessProperty && state.yearsOwnedBusiness >= 2) {
          const brRelief = taxable * 0.90;
          exempt += brRelief;
          exempt = Math.min(exempt, netEstate);
          taxable = netEstate - exempt;
        }

        tax = taxable * 0.33;
        effectiveRate = netEstate > 0 ? (tax / netEstate) * 100 : 0;

        details = [
          `Group threshold: €${threshold.toLocaleString()}`,
          `Prior gifts offset: €${state.priorGifts.toLocaleString()}`,
          `Available threshold: €${availableThreshold.toLocaleString()}`,
          `CAT rate: 33% flat`,
        ];
        break;
      }

      case "france": {
        let allowance = 1594; // Default stranger
        if (state.relationship === "spouse") allowance = netEstate; // Fully exempt
        else if (state.relationship === "child") allowance = 100000 * state.numBeneficiaries;
        else if (state.relationship === "grandchild") allowance = 31865 * state.numBeneficiaries;
        else if (state.relationship === "sibling") allowance = 15932;

        exempt = Math.min(netEstate, allowance);
        taxable = Math.max(0, netEstate - exempt);

        if (state.relationship === "spouse") {
          tax = 0;
        } else {
          // Progressive rates for direct line (simplified)
          if (taxable <= 8072) tax = taxable * 0.05;
          else if (taxable <= 12109) tax = 404 + (taxable - 8072) * 0.10;
          else if (taxable <= 15932) tax = 808 + (taxable - 12109) * 0.15;
          else if (taxable <= 552324) tax = 1382 + (taxable - 15932) * 0.20;
          else if (taxable <= 902838) tax = 109460 + (taxable - 552324) * 0.30;
          else if (taxable <= 1805677) tax = 214614 + (taxable - 902838) * 0.40;
          else tax = 575750 + (taxable - 1805677) * 0.45;
        }

        effectiveRate = netEstate > 0 ? (tax / netEstate) * 100 : 0;

        details = [
          `Spouse: fully exempt`,
          `Child allowance: €100,000 each`,
          `Taxable after allowances: €${Math.round(taxable).toLocaleString()}`,
          `Progressive rate up to 45%`,
        ];
        break;
      }

      case "germany": {
        let allowance = 20000;
        if (state.relationship === "spouse") allowance = 500000;
        else if (state.relationship === "child") allowance = 400000;
        else if (state.relationship === "grandchild") allowance = 200000;
        else if (state.relationship === "parent") allowance = 100000;
        else if (state.relationship === "sibling") allowance = 20000;

        exempt = Math.min(netEstate, allowance);
        taxable = Math.max(0, netEstate - exempt);

        // Tax class I rates (spouse, children, parents in some cases)
        if (taxable <= 75000) tax = taxable * 0.07;
        else if (taxable <= 300000) tax = 5250 + (taxable - 75000) * 0.11;
        else if (taxable <= 600000) tax = 30000 + (taxable - 300000) * 0.15;
        else if (taxable <= 6000000) tax = 75000 + (taxable - 600000) * 0.19;
        else if (taxable <= 13000000) tax = 1080000 + (taxable - 6000000) * 0.23;
        else if (taxable <= 26000000) tax = 2690000 + (taxable - 13000000) * 0.27;
        else tax = 6200000 + (taxable - 26000000) * 0.30;

        effectiveRate = netEstate > 0 ? (tax / netEstate) * 100 : 0;

        details = [
          `Personal allowance: €${allowance.toLocaleString()}`,
          `Taxable: €${Math.round(taxable).toLocaleString()}`,
          `Tax Class I rate (7%-30%)`,
        ];
        break;
      }

      case "spain": {
        // Simplified: use state rates with Madrid-style close family reduction
        let allowance = 15957; // State minimum
        if (state.relationship === "spouse" || state.relationship === "child") allowance = 15957 + 15956; // Simplified combined

        exempt = Math.min(netEstate, allowance);
        taxable = Math.max(0, netEstate - exempt);

        // State scale
        if (taxable <= 7975) tax = taxable * 0.0765;
        else if (taxable <= 11947) tax = 610 + (taxable - 7975) * 0.0850;
        else if (taxable <= 15898) tax = 948 + (taxable - 11947) * 0.0950;
        else if (taxable <= 23970) tax = 1323 + (taxable - 15898) * 0.1020;
        else if (taxable <= 39871) tax = 2146 + (taxable - 23970) * 0.1150;
        else if (taxable <= 79755) tax = 3974 + (taxable - 39871) * 0.1470;
        else if (taxable <= 119390) tax = 9839 + (taxable - 79755) * 0.1850;
        else if (taxable <= 159151) tax = 17166 + (taxable - 119390) * 0.1950;
        else tax = 24924 + (taxable - 159151) * 0.3650;

        // Regional reduction for close family (simplified 99% reduction for Madrid-style)
        if (state.relationship === "spouse" || state.relationship === "child") {
          tax *= 0.01; // 99% reduction
        }

        effectiveRate = netEstate > 0 ? (tax / netEstate) * 100 : 0;

        details = [
          `State allowance: €${allowance.toLocaleString()}`,
          `Regional reduction may apply`,
          `Taxable: €${Math.round(taxable).toLocaleString()}`,
          `State rate up to 36.5%`,
        ];
        break;
      }

      case "italy": {
        let allowance = 0;
        if (state.relationship === "spouse" || state.relationship === "child") allowance = 1000000 * state.numBeneficiaries;
        else if (state.relationship === "sibling") allowance = 100000 * state.numBeneficiaries;
        else if (state.relationship === "parent") allowance = 100000;
        else allowance = 0;

        exempt = Math.min(netEstate, allowance);
        taxable = Math.max(0, netEstate - exempt);

        let rate = 0.08;
        if (state.relationship === "spouse" || state.relationship === "child" || state.relationship === "parent") rate = 0.04;
        else if (state.relationship === "sibling") rate = 0.06;

        tax = taxable * rate;
        effectiveRate = netEstate > 0 ? (tax / netEstate) * 100 : 0;

        details = [
          `Spouse/child exemption: €1M each`,
          `Tax rate: ${(rate * 100).toFixed(0)}%`,
          `Taxable: €${Math.round(taxable).toLocaleString()}`,
        ];
        break;
      }

      case "canada": {
        // Deemed disposition - simplified as 25% of 50% of gains on non-principal residence
        const assumedGain = netEstate * 0.30; // Assume 30% unrealized gain
        taxable = assumedGain * 0.50; // 50% inclusion rate
        tax = taxable * 0.535; // Top combined fed/prov rate
        exempt = netEstate - assumedGain;
        effectiveRate = netEstate > 0 ? (tax / netEstate) * 100 : 0;

        details = [
          `No inheritance tax`,
          `Deemed disposition on death`,
          `Assumed unrealized gain: 30%`,
          `Capital gains inclusion: 50%`,
          `Top combined rate: ~53.5%`,
        ];
        break;
      }

      case "australia": {
        tax = 0;
        taxable = 0;
        exempt = netEstate;
        effectiveRate = 0;

        details = [
          `No inheritance tax in Australia`,
          `CGT may apply on sale of inherited assets`,
          `Principal residence exemption available`,
        ];
        break;
      }

      case "india": {
        const stampDuty = netEstate * 0.05; // Average 5% stamp duty
        tax = stampDuty;
        taxable = netEstate;
        exempt = 0;
        effectiveRate = 5;

        details = [
          `No inheritance tax`,
          `Stamp duty: ~5% on immovable property`,
          `Varies by state (3-8%)`,
        ];
        break;
      }
    }

    return { tax, taxable, exempt, effectiveRate, netEstate, details };
  }, [state]);

  const pieData = [
    { name: "Net to Beneficiaries", value: Math.max(0, results.netEstate - results.tax), color: "#10b981" },
    { name: "Tax Payable", value: results.tax, color: "#ef4444" },
    { name: "Exempt / Allowances", value: results.exempt, color: "#3b82f6" },
  ].filter((d) => d.value > 0);

  const handleChange = <K extends keyof CalculatorState>(
    field: K,
    value: CalculatorState[K]
  ) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  const CurrencyIcon = country.icon;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-premium border border-slate-200">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
                <Globe className="h-5 w-5 text-violet-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Estate Details</h2>
            </div>

            {/* Country */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <Globe className="h-4 w-4 text-violet-600" />
                Country / Jurisdiction
              </label>
              <select
                value={state.country}
                onChange={(e) => handleChange("country", e.target.value as CountryKey)}
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                {Object.entries(COUNTRIES).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.flag} {val.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Estate Value */}
            <div className="mt-5 space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <CurrencyIcon className="h-4 w-4 text-violet-600" />
                Gross Estate Value
              </label>
              <input
                type="number"
                value={state.estateValue || ""}
                onChange={(e) => handleChange("estateValue", Number(e.target.value))}
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                placeholder="800000"
              />
            </div>

            {/* Debts */}
            <div className="mt-5 space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <TrendingDown className="h-4 w-4 text-violet-600" />
                Debts & Liabilities
              </label>
              <input
                type="number"
                value={state.debts || ""}
                onChange={(e) => handleChange("debts", Number(e.target.value))}
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                placeholder="0"
              />
            </div>

            {/* Relationship */}
            <div className="mt-5 space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <Heart className="h-4 w-4 text-violet-600" />
                Relationship to Deceased
              </label>
              <select
                value={state.relationship}
                onChange={(e) => handleChange("relationship", e.target.value as RelationshipKey)}
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                {Object.entries(RELATIONSHIPS).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val}
                  </option>
                ))}
              </select>
            </div>

            {/* Beneficiaries */}
            <div className="mt-5 space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <Users className="h-4 w-4 text-violet-600" />
                Number of Beneficiaries
              </label>
              <input
                type="number"
                value={state.numBeneficiaries}
                onChange={(e) => handleChange("numBeneficiaries", Number(e.target.value))}
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                min={1}
              />
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
                {/* Main Residence */}
                {(state.country === "uk" || state.country === "ireland") && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600">
                        Main Residence Value
                      </label>
                      <input
                        type="number"
                        value={state.mainResidenceValue || ""}
                        onChange={(e) => handleChange("mainResidenceValue", Number(e.target.value))}
                        className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-violet-500 focus:outline-none"
                      />
                    </div>
                    <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={state.mainResidenceToDescendants}
                        onChange={(e) => handleChange("mainResidenceToDescendants", e.target.checked)}
                        className="h-4 w-4 rounded border-slate-600 bg-slate-50 text-violet-500 focus:ring-violet-500"
                      />
                      Main residence passing to direct descendants
                    </label>
                  </>
                )}

                {/* Charity */}
                {state.country === "uk" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">
                      % of Estate to Charity
                    </label>
                    <input
                      type="number"
                      value={state.charityPercent}
                      onChange={(e) => handleChange("charityPercent", Number(e.target.value))}
                      className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-violet-500 focus:outline-none"
                      min={0}
                      max={100}
                    />
                    <p className="text-xs text-slate-500">
                      10%+ reduces IHT rate from 40% to 36%
                    </p>
                  </div>
                )}

                {/* Prior Gifts */}
                {state.country === "ireland" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">
                      Prior Taxable Gifts (lifetime)
                    </label>
                    <input
                      type="number"
                      value={state.priorGifts || ""}
                      onChange={(e) => handleChange("priorGifts", Number(e.target.value))}
                      className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-violet-500 focus:outline-none"
                    />
                    <p className="text-xs text-slate-500">
                      Reduces available group threshold
                    </p>
                  </div>
                )}

                {/* Business Property */}
                {(state.country === "uk" || state.country === "ireland") && (
                  <>
                    <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={state.isBusinessProperty}
                        onChange={(e) => handleChange("isBusinessProperty", e.target.checked)}
                        className="h-4 w-4 rounded border-slate-600 bg-slate-50 text-violet-500 focus:ring-violet-500"
                      />
                      Includes qualifying business property
                    </label>
                    {state.isBusinessProperty && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-600">
                          Years Owned
                        </label>
                        <input
                          type="number"
                          value={state.yearsOwnedBusiness}
                          onChange={(e) => handleChange("yearsOwnedBusiness", Number(e.target.value))}
                          className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:border-violet-500 focus:outline-none"
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Agricultural */}
                {state.country === "uk" && (
                  <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.isAgricultural}
                      onChange={(e) => handleChange("isAgricultural", e.target.checked)}
                      className="h-4 w-4 rounded border-slate-600 bg-slate-50 text-violet-500 focus:ring-violet-500"
                    />
                    Includes agricultural property (APR may apply)
                  </label>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-7 space-y-6">
          {/* Score Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xl backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Net Estate
              </p>
              <p className="mt-2 text-xl font-bold text-slate-900">
                {formatMoney(results.netEstate, country.currencySymbol)}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xl backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Tax Payable
              </p>
              <p className="mt-2 text-xl font-bold text-rose-600">
                {formatMoney(results.tax, country.currencySymbol)}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xl backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Effective Rate
              </p>
              <p className="mt-2 text-xl font-bold text-amber-600">
                {results.effectiveRate.toFixed(1)}%
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xl backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Net to Heirs
              </p>
              <p className="mt-2 text-xl font-bold text-emerald-600">
                {formatMoney(results.netEstate - results.tax, country.currencySymbol)}
              </p>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-premium border border-slate-200">
            <h3 className="mb-4 text-lg font-bold text-slate-900">Estate Distribution</h3>
            <div className="grid items-center gap-6 md:grid-cols-2">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => formatFullMoney(value, country.currencySymbol)}
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
                {results.details.map((detail, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                    {detail}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Per Beneficiary */}
          {state.numBeneficiaries > 1 && results.tax > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-premium border border-slate-200">
              <h3 className="mb-4 text-lg font-bold text-slate-900">Per Beneficiary Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Share per beneficiary</span>
                  <span className="font-medium text-slate-900">
                    {formatMoney(results.netEstate / state.numBeneficiaries, country.currencySymbol)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Tax per beneficiary</span>
                  <span className="font-medium text-rose-600">
                    {formatMoney(results.tax / state.numBeneficiaries, country.currencySymbol)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold">
                  <span className="text-slate-900">Net per beneficiary</span>
                  <span className="text-emerald-600">
                    {formatMoney((results.netEstate - results.tax) / state.numBeneficiaries, country.currencySymbol)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Country Comparison */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-premium border border-slate-200">
            <h3 className="mb-4 text-lg font-bold text-slate-900">
              Tax Comparison by Country
            </h3>
            <p className="mb-4 text-sm text-slate-500">
              Estimated tax on {country.currencySymbol}{state.estateValue.toLocaleString()} estate to a {RELATIONSHIPS[state.relationship].toLowerCase()}:
            </p>
            <div className="space-y-2">
              {(["uk", "usa", "ireland", "france", "germany", "spain", "italy"] as CountryKey[])
                .map((c) => {
                  const cData = COUNTRIES[c];
                  // Quick estimate for comparison
                  let estTax = 0;
                  const val = state.estateValue;
                  if (c === "uk") estTax = Math.max(0, val - 500000) * 0.40;
                  if (c === "usa") estTax = Math.max(0, val - 13990000) * 0.40;
                  if (c === "ireland") estTax = Math.max(0, val - 335000) * 0.33;
                  if (c === "france") estTax = Math.max(0, val - 100000) * 0.20;
                  if (c === "germany") estTax = Math.max(0, val - 400000) * 0.11;
                  if (c === "spain") estTax = val * 0.01; // With reduction
                  if (c === "italy") estTax = Math.max(0, val - 1000000) * 0.04;

                  const isActive = c === state.country;
                  return (
                    <div
                      key={c}
                      className={`flex items-center justify-between rounded-lg px-4 py-2.5 text-sm ${
                        isActive ? "bg-violet-500/10 border border-violet-500/20" : "bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{cData.flag}</span>
                        <span className={isActive ? "text-white font-medium" : "text-slate-600"}>
                          {cData.label}
                        </span>
                      </div>
                      <span className={isActive ? "font-bold text-violet-600" : "font-medium text-slate-500"}>
                        {formatMoney(estTax, cData.currencySymbol)}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-50 p-4">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div className="text-sm text-slate-600">
              <p className="font-medium text-amber-600">Estimate Only</p>
              <p className="mt-1">
                Actual tax liability depends on domicile, residency, treaty
                relief, specific asset types, and individual circumstances.
                Consult a qualified tax advisor or estate planning attorney
                for advice tailored to your situation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
