"use client";

import { useState, useMemo, useCallback } from "react";
import {
  TrendingUp, TrendingDown, Building2, PoundSterling, DollarSign,
  ArrowRight, Info, ChevronDown, ChevronUp, Copy, Check, Download,
  BarChart3, PieChart, Home, Wrench, Shield, Users, Receipt,
  AlertTriangle, Percent, Wallet, MapPin, Clock, Zap, BookOpen,
} from "lucide-react";

type Country = "uk" | "us" | "au";

interface CalculatorState {
  country: Country;
  propertyPrice: string;
  weeklyRent: string;
  monthlyRent: string;
  rentType: "weekly" | "monthly";
  deposit: string;
  stampDuty: string;
  legalFees: string;
  surveyFees: string;
  renovationCosts: string;
  otherCosts: string;
  propertyManagement: string;
  propertyManagementType: "percent" | "fixed";
  councilTax: string;
  insurance: string;
  maintenance: string;
  maintenanceType: "percent" | "fixed";
  strataFees: string;
  vacancyRate: string;
  lettingFees: string;
  groundRent: string;
  serviceCharge: string;
  mortgageInterest: string;
  incomeTaxRate: string;
  showAdvanced: boolean;
}

const COUNTRY_CONFIG = {
  uk: {
    currency: "GBP", symbol: "£", name: "United Kingdom", flag: "🇬🇧",
    rentFrequency: "monthly", taxName: "Stamp Duty", councilName: "Council Tax",
    hasStrata: false, hasGroundRent: true, hasServiceCharge: true,
    benchmarkLow: 4, benchmarkGood: 6, benchmarkExcellent: 8, medianYield: 5.2,
    cities: [
      { name: "London", median: 3.8, type: "low-yield-high-growth" },
      { name: "Manchester", median: 5.5, type: "balanced" },
      { name: "Birmingham", median: 5.8, type: "balanced" },
      { name: "Leeds", median: 6.2, type: "high-yield" },
      { name: "Liverpool", median: 6.8, type: "high-yield" },
      { name: "Newcastle", median: 6.5, type: "high-yield" },
      { name: "Glasgow", median: 6.0, type: "high-yield" },
      { name: "Cardiff", median: 5.4, type: "balanced" },
    ],
  },
  us: {
    currency: "USD", symbol: "$", name: "United States", flag: "🇺🇸",
    rentFrequency: "monthly", taxName: "Transfer Tax", councilName: "Property Tax",
    hasStrata: false, hasGroundRent: false, hasServiceCharge: true,
    benchmarkLow: 5, benchmarkGood: 7, benchmarkExcellent: 10, medianYield: 6.4,
    cities: [
      { name: "New York City", median: 4.2, type: "low-yield-high-growth" },
      { name: "Los Angeles", median: 4.8, type: "low-yield-high-growth" },
      { name: "Chicago", median: 6.5, type: "balanced" },
      { name: "Houston", median: 7.2, type: "high-yield" },
      { name: "Phoenix", median: 6.8, type: "balanced" },
      { name: "Philadelphia", median: 6.2, type: "balanced" },
      { name: "San Antonio", median: 7.5, type: "high-yield" },
      { name: "Dallas", median: 6.9, type: "balanced" },
      { name: "Detroit", median: 8.5, type: "high-yield" },
      { name: "Cleveland", median: 8.2, type: "high-yield" },
    ],
  },
  au: {
    currency: "AUD", symbol: "$", name: "Australia", flag: "🇦🇺",
    rentFrequency: "weekly", taxName: "Stamp Duty", councilName: "Council Rates",
    hasStrata: true, hasGroundRent: false, hasServiceCharge: false,
    benchmarkLow: 3, benchmarkGood: 5, benchmarkExcellent: 7, medianYield: 4.5,
    cities: [
      { name: "Sydney", median: 3.0, type: "low-yield-high-growth" },
      { name: "Melbourne", median: 3.5, type: "low-yield-high-growth" },
      { name: "Brisbane", median: 4.5, type: "balanced" },
      { name: "Perth", median: 5.3, type: "high-yield" },
      { name: "Adelaide", median: 4.8, type: "balanced" },
      { name: "Hobart", median: 4.2, type: "balanced" },
      { name: "Canberra", median: 4.0, type: "balanced" },
      { name: "Darwin", median: 6.5, type: "high-yield" },
    ],
  },
};

const parseNum = (v: string) => {
  const n = parseFloat(v.replace(/,/g, ""));
  return isNaN(n) ? 0 : n;
};

const fmtMoney = (n: number, symbol: string) => {
  if (n === 0) return `${symbol}0`;
  if (Math.abs(n) >= 1_000_000) return `${symbol}${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `${symbol}${(n / 1_000).toFixed(1)}k`;
  return `${symbol}${n.toFixed(0)}`;
};

const fmtPct = (n: number) => `${n.toFixed(2)}%`;

function estimateUKBTLStampDuty(price: number): number {
  let duty = 0;
  if (price > 0) duty += Math.min(price, 250_000) * 0.03;
  if (price > 250_000) duty += Math.min(price - 250_000, 675_000) * 0.08;
  if (price > 925_000) duty += Math.min(price - 925_000, 575_000) * 0.13;
  if (price > 1_500_000) duty += (price - 1_500_000) * 0.15;
  return duty;
}

function estimateUKStampDuty(price: number): number {
  if (price <= 250_000) return 0;
  if (price <= 925_000) return (price - 250_000) * 0.05;
  if (price <= 1_500_000) return 33_750 + (price - 925_000) * 0.10;
  return 91_250 + (price - 1_500_000) * 0.12;
}

function estimateAUStampDuty(price: number): number {
  if (price <= 350_000) return price * 0.014;
  if (price <= 450_000) return 4_900 + (price - 350_000) * 0.024;
  if (price <= 700_000) return 7_300 + (price - 450_000) * 0.045;
  if (price <= 1_000_000) return 18_550 + (price - 700_000) * 0.055;
  if (price <= 3_000_000) return 35_050 + (price - 1_000_000) * 0.065;
  return 165_050 + (price - 3_000_000) * 0.07;
}

function estimateUSTransferTax(price: number): number {
  return price * 0.0075;
}

const DEFAULT_STATE: CalculatorState = {
  country: "uk",
  propertyPrice: "250000",
  weeklyRent: "400",
  monthlyRent: "1200",
  rentType: "monthly",
  deposit: "50000",
  stampDuty: "",
  legalFees: "1500",
  surveyFees: "600",
  renovationCosts: "",
  otherCosts: "",
  propertyManagement: "10",
  propertyManagementType: "percent",
  councilTax: "1800",
  insurance: "400",
  maintenance: "1",
  maintenanceType: "percent",
  strataFees: "",
  vacancyRate: "5",
  lettingFees: "",
  groundRent: "",
  serviceCharge: "",
  mortgageInterest: "5",
  incomeTaxRate: "20",
  showAdvanced: false,
};

export default function RentalYieldCalculator() {
  const [state, setState] = useState<CalculatorState>(DEFAULT_STATE);
  const [copied, setCopied] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(true);

  const config = COUNTRY_CONFIG[state.country];

  const propertyPrice = parseNum(state.propertyPrice);
  const deposit = parseNum(state.deposit);
  const legalFees = parseNum(state.legalFees);
  const surveyFees = parseNum(state.surveyFees);
  const renovationCosts = parseNum(state.renovationCosts);
  const otherCosts = parseNum(state.otherCosts);

  const annualRent = useMemo(() => {
    if (state.rentType === "weekly") return parseNum(state.weeklyRent) * 52;
    return parseNum(state.monthlyRent) * 12;
  }, [state.weeklyRent, state.monthlyRent, state.rentType]);

  const stampDuty = useMemo(() => {
    if (state.stampDuty !== "") return parseNum(state.stampDuty);
    if (propertyPrice === 0) return 0;
    switch (state.country) {
      case "uk": return estimateUKBTLStampDuty(propertyPrice);
      case "us": return estimateUSTransferTax(propertyPrice);
      case "au": return estimateAUStampDuty(propertyPrice);
      default: return 0;
    }
  }, [state.stampDuty, propertyPrice, state.country]);

  const totalPropertyCost = propertyPrice + stampDuty + legalFees + surveyFees + renovationCosts + otherCosts;
  const totalCashInvested = deposit + stampDuty + legalFees + surveyFees + renovationCosts + otherCosts;

  const propertyManagementFee = state.propertyManagementType === "percent"
    ? annualRent * (parseNum(state.propertyManagement) / 100)
    : parseNum(state.propertyManagement) * (state.country === "au" ? 52 : 12);

  const maintenanceCost = state.maintenanceType === "percent"
    ? propertyPrice * (parseNum(state.maintenance) / 100)
    : parseNum(state.maintenance);

  const councilTax = parseNum(state.councilTax);
  const insurance = parseNum(state.insurance);
  const strataFees = parseNum(state.strataFees);
  const vacancyRate = parseNum(state.vacancyRate) / 100;
  const lettingFees = parseNum(state.lettingFees);
  const groundRent = parseNum(state.groundRent);
  const serviceCharge = parseNum(state.serviceCharge);
  const mortgageInterestRate = parseNum(state.mortgageInterest) / 100;
  const incomeTaxRate = parseNum(state.incomeTaxRate) / 100;

  const loanAmount = propertyPrice - deposit;
  const annualMortgageInterest = loanAmount * mortgageInterestRate;
  const effectiveAnnualRent = annualRent * (1 - vacancyRate);
  const vacancyLoss = annualRent * vacancyRate;

  const totalAnnualExpenses = propertyManagementFee + councilTax + insurance + maintenanceCost + strataFees + lettingFees + groundRent + serviceCharge + annualMortgageInterest;
  const netOperatingIncome = effectiveAnnualRent - totalAnnualExpenses;
  const taxLiability = Math.max(0, netOperatingIncome * incomeTaxRate);
  const afterTaxIncome = netOperatingIncome - taxLiability;

  const grossYield = totalPropertyCost > 0 ? (annualRent / totalPropertyCost) * 100 : 0;
  const netYield = totalPropertyCost > 0 ? (netOperatingIncome / totalPropertyCost) * 100 : 0;
  const afterTaxYield = totalPropertyCost > 0 ? (afterTaxIncome / totalPropertyCost) * 100 : 0;
  const cashOnCash = totalCashInvested > 0 ? (afterTaxIncome / totalCashInvested) * 100 : 0;
  const capRate = propertyPrice > 0 ? (netOperatingIncome / propertyPrice) * 100 : 0;

  const getYieldQuality = (yieldVal: number) => {
    if (yieldVal >= config.benchmarkExcellent) return { label: "Excellent", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" };
    if (yieldVal >= config.benchmarkGood) return { label: "Good", color: "text-emerald-500", bg: "bg-emerald-50/70", border: "border-emerald-100" };
    if (yieldVal >= config.benchmarkLow) return { label: "Fair", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" };
    return { label: "Low", color: "text-red-500", bg: "bg-red-50", border: "border-red-200" };
  };

  const grossQuality = getYieldQuality(grossYield);
  const netQuality = getYieldQuality(netYield);

  const monthlyRentIncome = annualRent / 12;
  const monthlyNetIncome = netOperatingIncome / 12;
  const monthlyMortgagePayment = loanAmount > 0
    ? (loanAmount * (mortgageInterestRate / 12) * Math.pow(1 + mortgageInterestRate / 12, 360)) / (Math.pow(1 + mortgageInterestRate / 12, 360) - 1)
    : 0;
  const monthlyCashFlow = monthlyNetIncome - monthlyMortgagePayment + (annualMortgageInterest / 12);

  const updateField = useCallback(<K extends keyof CalculatorState>(field: K, value: CalculatorState[K]) => {
    setState((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleCountryChange = (country: Country) => {
    const newConfig = COUNTRY_CONFIG[country];
    setState((prev) => ({
      ...prev, country,
      rentType: newConfig.rentFrequency === "weekly" ? "weekly" : "monthly",
      stampDuty: "",
      groundRent: newConfig.hasGroundRent ? prev.groundRent : "",
      serviceCharge: newConfig.hasServiceCharge ? prev.serviceCharge : "",
      strataFees: newConfig.hasStrata ? prev.strataFees : "",
    }));
  };

  const copyResults = () => {
    const text = `Rental Yield Results (${config.name})
Gross Yield: ${fmtPct(grossYield)}
Net Yield: ${fmtPct(netYield)}
After-Tax Yield: ${fmtPct(afterTaxYield)}
Cash-on-Cash Return: ${fmtPct(cashOnCash)}
Cap Rate: ${fmtPct(capRate)}
Annual Rent: ${fmtMoney(annualRent, config.symbol)}
Net Operating Income: ${fmtMoney(netOperatingIncome, config.symbol)}
Total Property Cost: ${fmtMoney(totalPropertyCost, config.symbol)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const CurrencyIcon = () => state.country === "uk" ? <PoundSterling className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />;
  const inputClass = "w-full px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";
  const labelClass = "text-xs font-medium text-stone-500 mb-1.5 block";

  return (
    <div className="w-full">
      {/* Country Selector */}
      <div className="flex gap-2 mb-6 p-1.5 bg-stone-100 rounded-2xl w-fit mx-auto sm:mx-0">
        {(["uk", "us", "au"] as Country[]).map((c) => (
          <button key={c} onClick={() => handleCountryChange(c)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${state.country === c ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}>
            <span className="mr-1.5">{COUNTRY_CONFIG[c].flag}</span>{COUNTRY_CONFIG[c].name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUTS PANEL */}
        <div className="lg:col-span-5 space-y-5">
          {/* Property Details */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="p-2 bg-primary/10 rounded-lg"><Home className="w-4 h-4 text-primary" /></div>
              <h3 className="font-semibold text-stone-900">Property Details</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Property Price ({config.symbol})</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"><CurrencyIcon /></span>
                  <input type="text" value={state.propertyPrice} onChange={(e) => updateField("propertyPrice", e.target.value)} className={`${inputClass} pl-9`} placeholder="250,000" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>{state.rentType === "weekly" ? "Weekly Rent" : "Monthly Rent"} ({config.symbol})</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"><CurrencyIcon /></span>
                    <input type="text" value={state.rentType === "weekly" ? state.weeklyRent : state.monthlyRent}
                      onChange={(e) => updateField(state.rentType === "weekly" ? "weeklyRent" : "monthlyRent", e.target.value)}
                      className={`${inputClass} pl-9`} placeholder={state.rentType === "weekly" ? "400" : "1,200"} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Rent Frequency</label>
                  <select value={state.rentType} onChange={(e) => updateField("rentType", e.target.value as "weekly" | "monthly")} className={inputClass}>
                    <option value="weekly">Per Week</option>
                    <option value="monthly">Per Month</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Deposit / Down Payment ({config.symbol})</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"><CurrencyIcon /></span>
                  <input type="text" value={state.deposit} onChange={(e) => updateField("deposit", e.target.value)} className={`${inputClass} pl-9`} placeholder="50,000" />
                </div>
                {propertyPrice > 0 && deposit > 0 && (
                  <p className="text-xs text-stone-400 mt-1">LTV: {((1 - deposit / propertyPrice) * 100).toFixed(1)}%</p>
                )}
              </div>
            </div>
          </div>

          {/* Purchase Costs */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg"><Receipt className="w-4 h-4 text-primary" /></div>
                <h3 className="font-semibold text-stone-900">Purchase Costs</h3>
              </div>
              {stampDuty > 0 && state.stampDuty === "" && (
                <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">Auto-estimated {config.taxName}</span>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>{config.taxName} ({config.symbol}) {state.stampDuty === "" && <span className="text-stone-400 font-normal">(auto-calculated)</span>}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"><CurrencyIcon /></span>
                  <input type="text" value={state.stampDuty} onChange={(e) => updateField("stampDuty", e.target.value)} className={`${inputClass} pl-9`} placeholder={stampDuty > 0 ? stampDuty.toFixed(0) : "0"} />
                </div>
                {state.country === "uk" && (
                  <p className="text-xs text-stone-400 mt-1">Includes 3% second home surcharge. Standard SDLT: {fmtMoney(estimateUKStampDuty(propertyPrice), config.symbol)}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>Legal Fees ({config.symbol})</label><input type="text" value={state.legalFees} onChange={(e) => updateField("legalFees", e.target.value)} className={inputClass} placeholder="1,500" /></div>
                <div><label className={labelClass}>Survey/Inspection ({config.symbol})</label><input type="text" value={state.surveyFees} onChange={(e) => updateField("surveyFees", e.target.value)} className={inputClass} placeholder="600" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>Renovation ({config.symbol})</label><input type="text" value={state.renovationCosts} onChange={(e) => updateField("renovationCosts", e.target.value)} className={inputClass} placeholder="0" /></div>
                <div><label className={labelClass}>Other Costs ({config.symbol})</label><input type="text" value={state.otherCosts} onChange={(e) => updateField("otherCosts", e.target.value)} className={inputClass} placeholder="0" /></div>
              </div>
            </div>
          </div>

          {/* Operating Expenses */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="p-2 bg-primary/10 rounded-lg"><Wrench className="w-4 h-4 text-primary" /></div>
              <h3 className="font-semibold text-stone-900">Annual Operating Expenses</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Property Management</label>
                  <div className="flex gap-2">
                    <input type="text" value={state.propertyManagement} onChange={(e) => updateField("propertyManagement", e.target.value)} className={`${inputClass} flex-1`} placeholder="10" />
                    <select value={state.propertyManagementType} onChange={(e) => updateField("propertyManagementType", e.target.value as "percent" | "fixed")} className={`${inputClass} w-20`}>
                      <option value="percent">%</option><option value="fixed">{config.symbol}</option>
                    </select>
                  </div>
                </div>
                <div><label className={labelClass}>{config.councilName} ({config.symbol})</label><input type="text" value={state.councilTax} onChange={(e) => updateField("councilTax", e.target.value)} className={inputClass} placeholder="1,800" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>Insurance ({config.symbol})</label><input type="text" value={state.insurance} onChange={(e) => updateField("insurance", e.target.value)} className={inputClass} placeholder="400" /></div>
                <div>
                  <label className={labelClass}>Maintenance</label>
                  <div className="flex gap-2">
                    <input type="text" value={state.maintenance} onChange={(e) => updateField("maintenance", e.target.value)} className={`${inputClass} flex-1`} placeholder="1" />
                    <select value={state.maintenanceType} onChange={(e) => updateField("maintenanceType", e.target.value as "percent" | "fixed")} className={`${inputClass} w-20`}>
                      <option value="percent">%</option><option value="fixed">{config.symbol}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>Vacancy Rate (%)</label><input type="text" value={state.vacancyRate} onChange={(e) => updateField("vacancyRate", e.target.value)} className={inputClass} placeholder="5" /></div>
                <div><label className={labelClass}>Letting Fees ({config.symbol})</label><input type="text" value={state.lettingFees} onChange={(e) => updateField("lettingFees", e.target.value)} className={inputClass} placeholder="0" /></div>
              </div>
              {config.hasStrata && <div><label className={labelClass}>Strata / Body Corporate ({config.symbol})</label><input type="text" value={state.strataFees} onChange={(e) => updateField("strataFees", e.target.value)} className={inputClass} placeholder="2,000" /></div>}
              {config.hasGroundRent && <div><label className={labelClass}>Ground Rent ({config.symbol})</label><input type="text" value={state.groundRent} onChange={(e) => updateField("groundRent", e.target.value)} className={inputClass} placeholder="200" /></div>}
              {config.hasServiceCharge && <div><label className={labelClass}>Service Charge / HOA ({config.symbol})</label><input type="text" value={state.serviceCharge} onChange={(e) => updateField("serviceCharge", e.target.value)} className={inputClass} placeholder="0" /></div>}
            </div>
          </div>

          {/* Advanced */}
          <button onClick={() => updateField("showAdvanced", !state.showAdvanced)}
            className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-stone-200 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors">
            <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-primary" />Mortgage & Tax Settings (Advanced)</div>
            {state.showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {state.showAdvanced && (
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>Mortgage Interest Rate (%)</label><input type="text" value={state.mortgageInterest} onChange={(e) => updateField("mortgageInterest", e.target.value)} className={inputClass} placeholder="5" /></div>
                <div><label className={labelClass}>Income Tax Rate (%)</label><input type="text" value={state.incomeTaxRate} onChange={(e) => updateField("incomeTaxRate", e.target.value)} className={inputClass} placeholder="20" /></div>
              </div>
              <p className="text-xs text-stone-400">Mortgage interest is included in net yield calculation. Tax is applied to net operating income for after-tax yield.</p>
            </div>
          )}
        </div>

        {/* RESULTS PANEL */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`bg-white rounded-2xl border-2 ${grossQuality.border} p-6 shadow-sm relative overflow-hidden`}>
              <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-xs font-bold ${grossQuality.bg} ${grossQuality.color}`}>{grossQuality.label}</div>
              <div className="flex items-center gap-2 mb-3"><TrendingUp className="w-5 h-5 text-stone-400" /><span className="text-sm font-medium text-stone-500">Gross Rental Yield</span></div>
              <div className="text-4xl font-bold text-stone-900 mb-1">{fmtPct(grossYield)}</div>
              <p className="text-xs text-stone-400">Annual rent ÷ Total property cost</p>
              <div className="mt-4 pt-4 border-t border-stone-100">
                <div className="flex justify-between text-sm"><span className="text-stone-500">Annual Rent</span><span className="font-semibold text-stone-700">{fmtMoney(annualRent, config.symbol)}</span></div>
                <div className="flex justify-between text-sm mt-1"><span className="text-stone-500">Total Property Cost</span><span className="font-semibold text-stone-700">{fmtMoney(totalPropertyCost, config.symbol)}</span></div>
              </div>
            </div>
            <div className={`bg-white rounded-2xl border-2 ${netQuality.border} p-6 shadow-sm relative overflow-hidden`}>
              <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-xs font-bold ${netQuality.bg} ${netQuality.color}`}>{netQuality.label}</div>
              <div className="flex items-center gap-2 mb-3"><TrendingDown className="w-5 h-5 text-stone-400" /><span className="text-sm font-medium text-stone-500">Net Rental Yield</span></div>
              <div className="text-4xl font-bold text-stone-900 mb-1">{fmtPct(netYield)}</div>
              <p className="text-xs text-stone-400">(Rent - expenses) ÷ Total property cost</p>
              <div className="mt-4 pt-4 border-t border-stone-100">
                <div className="flex justify-between text-sm"><span className="text-stone-500">Net Operating Income</span><span className={`font-semibold ${netOperatingIncome >= 0 ? "text-emerald-600" : "text-red-500"}`}>{fmtMoney(netOperatingIncome, config.symbol)}</span></div>
                <div className="flex justify-between text-sm mt-1"><span className="text-stone-500">Annual Expenses</span><span className="font-semibold text-stone-700">{fmtMoney(totalAnnualExpenses, config.symbol)}</span></div>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm">
              <div className="flex items-center gap-1.5 mb-2"><Percent className="w-3.5 h-3.5 text-primary" /><span className="text-xs font-medium text-stone-500">After-Tax Yield</span></div>
              <div className="text-xl font-bold text-stone-900">{fmtPct(afterTaxYield)}</div>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm">
              <div className="flex items-center gap-1.5 mb-2"><Wallet className="w-3.5 h-3.5 text-primary" /><span className="text-xs font-medium text-stone-500">Cash-on-Cash</span></div>
              <div className="text-xl font-bold text-stone-900">{fmtPct(cashOnCash)}</div>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm">
              <div className="flex items-center gap-1.5 mb-2"><BarChart3 className="w-3.5 h-3.5 text-primary" /><span className="text-xs font-medium text-stone-500">Cap Rate</span></div>
              <div className="text-xl font-bold text-stone-900">{fmtPct(capRate)}</div>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm">
              <div className="flex items-center gap-1.5 mb-2"><Clock className="w-3.5 h-3.5 text-primary" /><span className="text-xs font-medium text-stone-500">Payback (yrs)</span></div>
              <div className="text-xl font-bold text-stone-900">{netYield > 0 ? (100 / netYield).toFixed(1) : "∞"}</div>
            </div>
          </div>

          {/* Monthly Cash Flow */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2"><div className="p-2 bg-primary/10 rounded-lg"><PieChart className="w-4 h-4 text-primary" /></div><h3 className="font-semibold text-stone-900">Monthly Cash Flow Breakdown</h3></div>
              <button onClick={() => setShowBreakdown(!showBreakdown)} className="text-xs text-primary font-medium hover:underline">{showBreakdown ? "Hide" : "Show"}</button>
            </div>
            {showBreakdown && (
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-stone-100"><span className="text-sm text-stone-600">Gross Monthly Rent</span><span className="text-sm font-semibold text-stone-900">{fmtMoney(monthlyRentIncome, config.symbol)}</span></div>
                <div className="flex justify-between items-center py-2 border-b border-stone-100"><span className="text-sm text-stone-600">Less: Vacancy ({state.vacancyRate}%)</span><span className="text-sm font-semibold text-red-500">-{fmtMoney(vacancyLoss / 12, config.symbol)}</span></div>
                <div className="flex justify-between items-center py-2 border-b border-stone-100"><span className="text-sm text-stone-600">Less: Operating Expenses</span><span className="text-sm font-semibold text-red-500">-{fmtMoney(totalAnnualExpenses / 12, config.symbol)}</span></div>
                <div className="flex justify-between items-center py-3 bg-stone-50 rounded-xl px-3"><span className="text-sm font-semibold text-stone-800">Net Monthly Income</span><span className={`text-sm font-bold ${monthlyNetIncome >= 0 ? "text-emerald-600" : "text-red-500"}`}>{fmtMoney(monthlyNetIncome, config.symbol)}</span></div>
                {loanAmount > 0 && (
                  <>
                    <div className="flex justify-between items-center py-2 border-b border-stone-100"><span className="text-sm text-stone-600">Less: Mortgage Payment (P&I)</span><span className="text-sm font-semibold text-red-500">-{fmtMoney(monthlyMortgagePayment, config.symbol)}</span></div>
                    <div className="flex justify-between items-center py-3 bg-emerald-50 rounded-xl px-3 border border-emerald-100"><span className="text-sm font-semibold text-emerald-900">Monthly Cash Flow</span><span className={`text-sm font-bold ${monthlyCashFlow >= 0 ? "text-emerald-600" : "text-red-500"}`}>{fmtMoney(monthlyCashFlow, config.symbol)}</span></div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Expense Breakdown */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <h3 className="font-semibold text-stone-900 mb-4">Annual Expense Breakdown</h3>
            <div className="space-y-3">
              {[
                { label: "Property Management", value: propertyManagementFee, icon: Users },
                { label: config.councilName, value: councilTax, icon: Building2 },
                { label: "Insurance", value: insurance, icon: Shield },
                { label: "Maintenance", value: maintenanceCost, icon: Wrench },
                { label: "Mortgage Interest", value: annualMortgageInterest, icon: Receipt },
                ...(strataFees > 0 ? [{ label: "Strata/Body Corp", value: strataFees, icon: Building2 }] : []),
                ...(groundRent > 0 ? [{ label: "Ground Rent", value: groundRent, icon: Home }] : []),
                ...(serviceCharge > 0 ? [{ label: "Service Charge/HOA", value: serviceCharge, icon: Home }] : []),
                ...(lettingFees > 0 ? [{ label: "Letting Fees", value: lettingFees, icon: Users }] : []),
              ].filter((item) => item.value > 0).sort((a, b) => b.value - a.value).map((item) => {
                const pct = totalAnnualExpenses > 0 ? (item.value / totalAnnualExpenses) * 100 : 0;
                return (
                  <div key={item.label}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2"><item.icon className="w-3.5 h-3.5 text-stone-400" /><span className="text-sm text-stone-600">{item.label}</span></div>
                      <span className="text-sm font-medium text-stone-800">{fmtMoney(item.value, config.symbol)} ({pct.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} /></div>
                  </div>
                );
              })}
              {totalAnnualExpenses === 0 && <p className="text-sm text-stone-400 text-center py-4">Enter expenses above to see the breakdown</p>}
            </div>
          </div>

          {/* Market Comparison */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4"><div className="p-2 bg-primary/10 rounded-lg"><MapPin className="w-4 h-4 text-primary" /></div><h3 className="font-semibold text-stone-900">How Your Yield Compares — {config.name} Cities</h3></div>
            <div className="space-y-2">
              {config.cities.map((city) => {
                const diff = grossYield - city.median;
                const isBetter = diff >= 0;
                return (
                  <div key={city.name} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-stone-50 transition-colors">
                    <div className="flex items-center gap-3"><span className="text-sm font-medium text-stone-700 w-28">{city.name}</span><span className="text-xs text-stone-400">Median: {city.median}%</span></div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-stone-100 rounded-full overflow-hidden relative">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min((city.median / 10) * 100, 100)}%`, backgroundColor: city.median >= config.benchmarkGood ? "#10b981" : city.median >= config.benchmarkLow ? "#f59e0b" : "#ef4444" }} />
                        {grossYield > 0 && <div className="absolute top-0 w-1 h-full bg-stone-800 rounded-full" style={{ left: `${Math.min((grossYield / 10) * 100, 100)}%` }} />}
                      </div>
                      <span className={`text-xs font-semibold w-16 text-right ${isBetter ? "text-emerald-600" : "text-red-500"}`}>{isBetter ? "+" : ""}{diff.toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs text-stone-400 px-3">
              <div className="flex items-center gap-1.5"><div className="w-3 h-1 bg-stone-800 rounded-full" /><span>Your yield</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-1 bg-emerald-500 rounded-full" /><span>Good yield zone</span></div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={copyResults} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors">
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}{copied ? "Copied!" : "Copy Results"}
            </button>
            <button onClick={() => {
              const data = { country: config.name, grossYield: fmtPct(grossYield), netYield: fmtPct(netYield), afterTaxYield: fmtPct(afterTaxYield), cashOnCash: fmtPct(cashOnCash), capRate: fmtPct(capRate), annualRent: fmtMoney(annualRent, config.symbol), netOperatingIncome: fmtMoney(netOperatingIncome, config.symbol), totalPropertyCost: fmtMoney(totalPropertyCost, config.symbol), totalAnnualExpenses: fmtMoney(totalAnnualExpenses, config.symbol), monthlyCashFlow: fmtMoney(monthlyCashFlow, config.symbol) };
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url; a.download = `rental-yield-${state.country}-${new Date().toISOString().split("T")[0]}.json`; a.click(); URL.revokeObjectURL(url);
            }} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors">
              <Download className="w-4 h-4" />Export JSON
            </button>
          </div>

          {/* Yield Quality Guide */}
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5">
            <h4 className="text-sm font-semibold text-stone-800 mb-3">Yield Quality Guide for {config.name}</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="text-center p-3 bg-red-50 rounded-xl border border-red-100"><div className="text-lg font-bold text-red-500">&lt;{config.benchmarkLow}%</div><div className="text-xs text-stone-500 mt-1">Low Yield</div></div>
              <div className="text-center p-3 bg-amber-50 rounded-xl border border-amber-100"><div className="text-lg font-bold text-amber-600">{config.benchmarkLow}-{config.benchmarkGood}%</div><div className="text-xs text-stone-500 mt-1">Fair Yield</div></div>
              <div className="text-center p-3 bg-emerald-50 rounded-xl border border-emerald-100"><div className="text-lg font-bold text-emerald-500">{config.benchmarkGood}-{config.benchmarkExcellent}%</div><div className="text-xs text-stone-500 mt-1">Good Yield</div></div>
              <div className="text-center p-3 bg-emerald-100 rounded-xl border border-emerald-200"><div className="text-lg font-bold text-emerald-700">{config.benchmarkExcellent}%+</div><div className="text-xs text-stone-500 mt-1">Excellent</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
