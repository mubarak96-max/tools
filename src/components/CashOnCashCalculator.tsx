"use client";

import { useState, useMemo } from "react";
import {
  calculateCashOnCash,
  fmtUSD, fmtShort, fmtPct,
  COC_RATING_CONFIG,
  type CashOnCashInputs,
} from "@/lib/cashOnCash";
import { 
  TrendingUp, 
  DollarSign, 
  Percent, 
  Building2, 
  Briefcase, 
  Calendar, 
  Info, 
  ChevronDown,
  LayoutDashboard,
  BarChart3,
  ListChecks
} from "lucide-react";

// ─── Primitives ────────────────────────────────────────────────────

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="group">
      <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 transition-colors group-focus-within:text-blue-500">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-stone-400 mt-1.5 leading-snug font-medium italic">{hint}</p>}
    </div>
  );
}

function DollarInput({ value, onChange, step = 500 }: { value: number; onChange: (v: number) => void; step?: number }) {
  return (
    <div className="relative group/input">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 transition-colors group-focus-within/input:text-blue-400">
        <DollarSign size={14} />
      </div>
      <input 
        type="number" 
        value={value} 
        min={0} 
        step={step}
        onChange={e => onChange(Math.max(0, Number(e.target.value)))}
        className="w-full pl-8 pr-3 py-2.5 text-sm font-medium border border-stone-200 rounded-xl bg-white transition-all focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 hover:border-stone-300" 
      />
    </div>
  );
}

function PctInput({ value, onChange, max = 100, step = 0.5 }: { value: number; onChange: (v: number) => void; max?: number; step?: number }) {
  return (
    <div className="relative group/input">
      <input 
        type="number" 
        value={value} 
        min={0} 
        max={max} 
        step={step}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full pl-4 pr-10 py-2.5 text-sm font-medium border border-stone-200 rounded-xl bg-white transition-all focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 hover:border-stone-300" 
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 transition-colors group-focus-within/input:text-blue-400">
        <Percent size={14} />
      </div>
    </div>
  );
}

function SectionLabel({ children, icon: Icon }: { children: React.ReactNode; icon: any }) {
  return (
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 mb-4 mt-8 first:mt-0 flex items-center gap-2">
      <Icon size={12} className="text-blue-500" />
      {children}
    </p>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none group">
      <div 
        onClick={() => onChange(!checked)}
        className={`w-10 h-5.5 rounded-full transition-all relative flex-shrink-0 ${checked ? "bg-blue-500 shadow-lg shadow-blue-200" : "bg-stone-200"}`}
      >
        <div className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
      </div>
      <span className="text-xs font-bold text-stone-600 group-hover:text-stone-900 transition-colors">{label}</span>
    </label>
  );
}

function Metric({ label, value, sub, accent, icon: Icon }: { label: string; value: string; sub?: string; accent?: "green" | "red" | "amber" | "blue" | "stone" | "emerald"; icon?: any }) {
  const bg  = { green: "bg-green-50", red: "bg-red-50", amber: "bg-amber-50", blue: "bg-blue-50", stone: "bg-stone-50", emerald: "bg-emerald-50" }[accent ?? "stone"];
  const border = { green: "border-green-100", red: "border-red-100", amber: "border-amber-100", blue: "border-blue-100", stone: "border-stone-100", emerald: "border-emerald-100" }[accent ?? "stone"];
  const txt = { green: "text-green-700", red: "text-red-600", amber: "text-amber-700", blue: "text-blue-700", stone: "text-stone-800", emerald: "text-emerald-700" }[accent ?? "stone"];
  const iconColor = { green: "text-green-400", red: "text-red-400", amber: "text-amber-400", blue: "text-blue-400", stone: "text-stone-400", emerald: "text-emerald-400" }[accent ?? "stone"];

  return (
    <div className={`${bg} ${border} border rounded-2xl p-4 transition-all hover:scale-[1.02] hover:shadow-sm`}>
      <div className="flex justify-between items-start mb-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">{label}</p>
        {Icon && <Icon size={14} className={iconColor} />}
      </div>
      <p className={`text-2xl font-black leading-tight tracking-tight ${txt}`}>{value}</p>
      {sub && <p className="text-[10px] font-semibold text-stone-400 mt-1 uppercase tracking-wide">{sub}</p>}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────

export default function CashOnCashCalculator() {
  // Purchase
  const [price,        setPrice]        = useState(350000);
  const [dpPct,        setDpPct]        = useState(25);
  const [closingPct,   setClosingPct]   = useState(2);
  const [repairs,      setRepairs]      = useState(10000);
  const [otherUpfront, setOtherUpfront] = useState(2000);

  // Mortgage
  const [rate,         setRate]         = useState(7.0);
  const [term,         setTerm]         = useState(30);
  const [interestOnly, setInterestOnly] = useState(false);

  // Income
  const [rent,         setRent]         = useState(2200);
  const [otherIncome,  setOtherIncome]  = useState(0);
  const [vacancy,      setVacancy]      = useState(5);

  // Expenses
  const [propTax,      setPropTax]      = useState(350);
  const [insurance,    setInsurance]    = useState(120);
  const [mgmtPct,      setMgmtPct]      = useState(10);
  const [maintPct,     setMaintPct]     = useState(5);
  const [hoa,          setHoa]          = useState(0);
  const [utilities,    setUtilities]    = useState(0);
  const [otherExp,     setOtherExp]     = useState(50);

  // Projection
  const [appreciation, setAppreciation] = useState(3);
  const [rentGrowth,   setRentGrowth]   = useState(2);
  const [holdYears,    setHoldYears]    = useState(10);

  const [tab, setTab] = useState<"summary" | "cashflow" | "projection">("summary");

  const inputs: CashOnCashInputs = {
    purchasePrice: price, downPaymentPct: dpPct, closingCostsPct: closingPct,
    repairCosts: repairs, otherUpfrontCosts: otherUpfront,
    interestRatePct: rate, loanTermYears: term, isInterestOnly: interestOnly,
    monthlyRent: rent, otherMonthlyIncome: otherIncome, vacancyRatePct: vacancy,
    propertyTaxMonthly: propTax, insuranceMonthly: insurance,
    propertyManagementPct: mgmtPct, maintenancePct: maintPct,
    hoaMonthly: hoa, utilitiesMonthly: utilities, otherExpensesMonthly: otherExp,
    annualAppreciationPct: appreciation, annualRentGrowthPct: rentGrowth,
    holdYears,
  };

  const r = useMemo(() => calculateCashOnCash(inputs), [
    price, dpPct, closingPct, repairs, otherUpfront,
    rate, term, interestOnly, rent, otherIncome, vacancy,
    propTax, insurance, mgmtPct, maintPct, hoa, utilities, otherExp,
    appreciation, rentGrowth, holdYears,
  ]);

  const rating = COC_RATING_CONFIG[r.cocRating];

  return (
    <div className="bg-white rounded-[2rem] border border-stone-200 overflow-hidden shadow-2xl shadow-stone-200/50">

      {/* Banner */}
      <div className={`px-8 py-8 ${rating.bg} transition-colors duration-500`}>
        <div className="flex flex-wrap gap-x-12 gap-y-8 items-center justify-between">
          <div className="min-w-[200px]">
            <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-2">Cash on Cash Return</p>
            <div className="flex items-baseline gap-2">
              <p className={`text-7xl font-black leading-none tracking-tighter ${rating.colour}`}>
                {fmtPct(r.cashOnCashReturn, 1)}
              </p>
              <span className={`text-xl font-bold ${rating.colour}`}>%</span>
            </div>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full mt-4 text-[11px] font-black uppercase tracking-wider ${rating.bg} ${rating.colour} border border-current opacity-80`}>
              {rating.label} · {rating.note}
            </div>
          </div>
          
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { label: "Mo. Cash Flow",  value: fmtUSD(r.monthlyCashFlow),   cls: r.monthlyCashFlow >= 0 ? "text-emerald-600" : "text-rose-500", icon: TrendingUp },
              { label: "Cap Rate",       value: fmtPct(r.capRate),            cls: "text-stone-800", icon: Building2 },
              { label: "Annual NOI",     value: fmtShort(r.noi),              cls: "text-stone-800", icon: Briefcase },
              { label: "Cash Invested",  value: fmtShort(r.totalCashInvested), cls: "text-stone-800", icon: ListChecks },
            ].map(m => {
              const StatIcon = m.icon;
              return (
                <div key={m.label} className="group/stat">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1.5 flex items-center gap-1.5">
                    <StatIcon size={10} className="group-hover/stat:text-blue-500 transition-colors" />
                    {m.label}
                  </p>
                  <p className={`text-2xl font-black tracking-tight ${m.cls}`}>{m.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr]">

        {/* ── Inputs ──────────────────────────────────────────── */}
        <div className="border-r border-stone-100 p-8 overflow-y-auto max-h-[850px] space-y-2 bg-stone-50/50">

          <SectionLabel icon={DollarSign}>Purchase Details</SectionLabel>
          <div className="space-y-4">
            <Field label="Purchase price"><DollarInput value={price} onChange={setPrice} step={5000} /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Down payment" hint={`= ${fmtShort(price * dpPct / 100)}`}><PctInput value={dpPct} onChange={setDpPct} max={100} /></Field>
              <Field label="Closing costs" hint={`= ${fmtShort(price * closingPct / 100)}`}><PctInput value={closingPct} onChange={setClosingPct} max={10} /></Field>
            </div>
            <Field label="Renovation budget"><DollarInput value={repairs} onChange={setRepairs} /></Field>
            <Field label="Misc upfront costs" hint="Inspection, legal, setup"><DollarInput value={otherUpfront} onChange={setOtherUpfront} /></Field>
          </div>

          <SectionLabel icon={Calendar}>Financing</SectionLabel>
          <div className="space-y-4">
            <Field label="Mortgage rate"><PctInput value={rate} onChange={setRate} max={20} step={0.05} /></Field>
            <Field label="Loan term">
              <div className="grid grid-cols-3 gap-2">
                {[15, 20, 30].map(y => (
                  <button key={y} onClick={() => setTerm(y)}
                    className={`py-2 text-[11px] font-black uppercase tracking-wider rounded-xl border-2 transition-all ${term === y ? "bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-200" : "border-stone-200 text-stone-400 hover:border-stone-300"}`}>
                    {y} yr
                  </button>
                ))}
              </div>
            </Field>
            <div className="pt-2">
              <Toggle checked={interestOnly} onChange={setInterestOnly} label="Interest-only loan" />
            </div>
          </div>

          <SectionLabel icon={TrendingUp}>Monthly Income</SectionLabel>
          <div className="space-y-4">
            <Field label="Gross rent"><DollarInput value={rent} onChange={setRent} step={50} /></Field>
            <Field label="Other income" hint="Laundry, parking, pets"><DollarInput value={otherIncome} onChange={setOtherIncome} step={25} /></Field>
            <Field label="Vacancy reserve"><PctInput value={vacancy} onChange={setVacancy} max={50} /></Field>
          </div>

          <SectionLabel icon={Briefcase}>Operating Expenses</SectionLabel>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Property tax"><DollarInput value={propTax} onChange={setPropTax} step={25} /></Field>
              <Field label="Insurance"><DollarInput value={insurance} onChange={setInsurance} step={10} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Management %"><PctInput value={mgmtPct} onChange={setMgmtPct} max={30} /></Field>
              <Field label="Maintenance %"><PctInput value={maintPct} onChange={setMaintPct} max={20} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="HOA / Fees"><DollarInput value={hoa} onChange={setHoa} step={25} /></Field>
              <Field label="Landlord Util."><DollarInput value={utilities} onChange={setUtilities} step={25} /></Field>
            </div>
            <Field label="Misc monthly"><DollarInput value={otherExp} onChange={setOtherExp} step={25} /></Field>
          </div>

          <SectionLabel icon={BarChart3}>Projections</SectionLabel>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Appreciation"><PctInput value={appreciation} onChange={setAppreciation} max={20} /></Field>
              <Field label="Rent growth"><PctInput value={rentGrowth} onChange={setRentGrowth} max={15} /></Field>
            </div>
            <Field label="Hold period">
              <div className="flex items-center gap-5 mt-2">
                <input type="range" min={1} max={30} step={1} value={holdYears}
                  onChange={e => setHoldYears(Number(e.target.value))}
                  className="flex-1 h-1.5 bg-stone-200 rounded-full appearance-none cursor-pointer accent-blue-500" />
                <span className="text-sm font-black text-stone-700 min-w-[50px] bg-white border border-stone-200 px-2 py-1 rounded-lg text-center">{holdYears}Y</span>
              </div>
            </Field>
          </div>
        </div>

        {/* ── Results ──────────────────────────────────────────── */}
        <div className="p-8">

          {/* Tabs */}
          <div className="flex gap-2 mb-8 bg-stone-100/50 rounded-2xl p-1.5">
            {[
              { id: "summary", icon: LayoutDashboard, label: "Investment Summary" },
              { id: "cashflow", icon: DollarSign, label: "Cash Flow Breakdown" },
              { id: "projection", icon: BarChart3, label: `${holdYears}-Yr Projection` }
            ].map(t => {
              const TabIcon = t.icon;
              return (
                <button 
                  key={t.id} 
                  onClick={() => setTab(t.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${tab === t.id ? "bg-white text-stone-900 shadow-xl shadow-stone-200/50" : "text-stone-400 hover:text-stone-600"}`}
                >
                  <TabIcon size={14} />
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* ── Summary ─────────────────── */}
          {tab === "summary" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                <Metric label="Cash on Cash"      value={fmtPct(r.cashOnCashReturn, 1)}         accent={r.cocRating === "excellent" ? "emerald" : r.cocRating === "good" ? "green" : r.cocRating === "negative" ? "red" : "amber"} icon={TrendingUp} />
                <Metric label="Cap Rate"          value={fmtPct(r.capRate, 1)}                   sub="Independent of debt"   accent="blue" icon={Building2} />
                <Metric label="Monthly Cash Flow" value={fmtUSD(r.monthlyCashFlow)}            accent={r.monthlyCashFlow >= 0 ? "green" : "red"} icon={DollarSign} />
                <Metric label="DSCR"              value={r.dscr.toFixed(2)}                    sub={r.dscr >= 1.25 ? "Lender Acceptable" : "High Risk Zone"} accent={r.dscr >= 1.25 ? "green" : "red"} icon={Briefcase} />
                <Metric label="Gross Multiplier"  value={r.grm.toFixed(1)}                     sub="Price / Annual Rent" accent="stone" icon={LayoutDashboard} />
                <Metric label="Break-Even Ratio"  value={fmtPct(r.breakEvenRatio, 0)}             sub={r.breakEvenRatio <= 85 ? "Healthy Margin" : "Tight Margin"} accent={r.breakEvenRatio <= 85 ? "green" : "amber"} icon={Percent} />
              </div>

              {/* Year 1 total return */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                    <TrendingUp size={20} className="text-white" />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-widest">Year 1 Total Investor Return</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                  {[
                    { label: "Cash Flow",        value: r.annualCashFlow,       pct: r.totalCashInvested > 0 ? r.annualCashFlow / r.totalCashInvested * 100 : 0 },
                    { label: "Equity Build-Up",  value: r.year1EquityBuildUp,   pct: r.totalCashInvested > 0 ? r.year1EquityBuildUp / r.totalCashInvested * 100 : 0 },
                    { label: "Appreciation",     value: r.year1Appreciation,    pct: r.totalCashInvested > 0 ? r.year1Appreciation / r.totalCashInvested * 100 : 0 },
                  ].map(row => (
                    <div key={row.label} className="space-y-3">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">{row.label}</span>
                        <span className="text-xl font-black">{fmtPct(row.pct, 1)}</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                        <div className="h-full bg-white rounded-full shadow-[0_0_10px_#fff]" style={{ width: `${Math.min(100, Math.max(0, row.pct * 4))}%` }} />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-tighter opacity-80">{fmtUSD(row.value)} Annual Value</p>
                    </div>
                  ))}
                </div>

                <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap justify-between items-end gap-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Combined First Year Return</p>
                    <p className="text-4xl font-black tracking-tighter">{fmtUSD(r.year1TotalReturn)}</p>
                  </div>
                  <div className="bg-white text-blue-600 px-6 py-3 rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-0.5">Total Return Pct</p>
                    <p className="text-3xl font-black leading-none">{fmtPct(r.year1TotalReturnPct, 1)}</p>
                  </div>
                </div>
              </div>

              {/* Investment summary table */}
              <div className="bg-stone-50/50 rounded-3xl border border-stone-200 overflow-hidden">
                <div className="px-6 py-4 bg-stone-100/50 border-b border-stone-200 flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Acquisition & Basis Summary</p>
                  <Building2 size={14} className="text-stone-300" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  {[
                    { label: "Purchase Price",       value: fmtUSD(price),                  },
                    { label: "Down Payment",         value: `${fmtUSD(r.downPayment)} (${dpPct}%)` },
                    { label: "Closing Costs",        value: fmtUSD(r.closingCosts)           },
                    { label: "Renovation Budget",    value: fmtUSD(repairs)                  },
                    { label: "Total Cash Invested",  value: fmtUSD(r.totalCashInvested),     bold: true },
                    { label: "Loan Amount",          value: fmtUSD(r.loanAmount),            },
                    { label: "Loan to Value (LTV)",   value: fmtPct(r.ltvRatio, 1)            },
                    { label: "Monthly Principal & Int.", value: fmtUSD(r.monthlyMortgagePayment, 2) },
                  ].map((row, i) => (
                    <div key={i} className={`flex justify-between px-6 py-4 border-b border-stone-100 last:border-0 hover:bg-stone-100/30 transition-colors ${(row as any).bold ? "bg-blue-50/50" : ""}`}>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">{row.label}</span>
                      <span className={`text-sm font-black text-stone-800 ${(row as any).bold ? "text-blue-600" : ""}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Cash flow ─────────────────── */}
          {tab === "cashflow" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Income statement */}
              <div className="bg-white rounded-3xl border-2 border-stone-100 overflow-hidden shadow-sm">
                <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex justify-between items-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Year 1 Performance Waterfall</p>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <div className="w-2 h-2 rounded-full bg-stone-300" />
                    <div className="w-2 h-2 rounded-full bg-stone-300" />
                  </div>
                </div>
                <div className="divide-y divide-stone-50">
                  {[
                    { label: "Gross Potential Rent",      value: r.grossAnnualRent,       cls: "text-emerald-600", indent: 0, icon: TrendingUp },
                    { label: "Other Income",              value: (otherIncome * 12),       cls: "text-emerald-600", indent: 0, skip: otherIncome === 0, icon: DollarSign },
                    { label: "Vacancy Loss",              value: -r.vacancyLoss,           cls: "text-rose-500",   indent: 0, icon: ChevronDown },
                    { label: "Effective Gross Income",    value: r.effectiveGrossIncome,   cls: "text-stone-900 font-black", indent: 0, divider: true },
                    { label: "Real Estate Taxes",         value: -r.annualExpenses.propertyTax,      cls: "text-stone-500", indent: 1 },
                    { label: "Property Insurance",        value: -r.annualExpenses.insurance,        cls: "text-stone-500", indent: 1 },
                    { label: "Management Fees",           value: -r.annualExpenses.propertyManagement, cls: "text-stone-500", indent: 1 },
                    { label: "Maintenance & Repairs",     value: -r.annualExpenses.maintenance,      cls: "text-stone-500", indent: 1 },
                    { label: "HOA Dues",                  value: -r.annualExpenses.hoa,              cls: "text-stone-500", indent: 1, skip: hoa === 0 },
                    { label: "Utilities (Owner Paid)",    value: -r.annualExpenses.utilities,        cls: "text-stone-500", indent: 1, skip: utilities === 0 },
                    { label: "Misc Operating Expenses",    value: -r.annualExpenses.other,            cls: "text-stone-500", indent: 1, skip: otherExp === 0 },
                    { label: "Net Operating Income (NOI)", value: r.noi,                  cls: "text-blue-600 font-black", indent: 0, divider: true },
                    { label: "Annual Debt Service",       value: -r.annualMortgagePayment, cls: "text-rose-500", indent: 0 },
                    { label: "ANNUAL PRE-TAX CASH FLOW",  value: r.annualCashFlow,         cls: r.annualCashFlow >= 0 ? "text-emerald-600 font-black" : "text-rose-600 font-black", indent: 0, divider: true, large: true },
                    { label: "Monthly Cash Flow",         value: r.monthlyCashFlow,        cls: r.monthlyCashFlow >= 0 ? "text-emerald-500 font-bold" : "text-rose-500 font-bold", indent: 0 },
                  ].filter(row => !(row as any).skip).map((row, i) => {
                    const RowIcon = (row as any).icon;
                    return (
                      <div key={i} className={`flex items-center justify-between py-4 px-6 transition-colors hover:bg-stone-50/50 ${(row as any).divider ? "bg-stone-50/50" : ""}`}>
                        <div className="flex items-center gap-3">
                          {RowIcon && <div className={`p-1.5 rounded-lg bg-white shadow-sm ${(row as any).cls.includes('emerald') ? 'text-emerald-500' : (row as any).cls.includes('rose') ? 'text-rose-500' : 'text-stone-400'}`}><RowIcon size={12} /></div>}
                          <span className={`text-[11px] font-bold uppercase tracking-wider ${(row as any).indent > 0 ? "ml-8 text-stone-400" : "text-stone-600"}`}>{row.label}</span>
                        </div>
                        <span className={`text-sm tabular-nums font-black ${row.cls} ${(row as any).large ? "text-lg" : ""}`}>
                          {row.value < 0 ? `(${fmtUSD(-row.value)})` : fmtUSD(row.value)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Visual expense breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-6">Operating Expense Allocation</h4>
                  <div className="space-y-4">
                    {[
                      { label: "Taxes",       value: r.annualExpenses.propertyTax, color: "bg-blue-400" },
                      { label: "Insurance",   value: r.annualExpenses.insurance, color: "bg-indigo-400" },
                      { label: "Management",  value: r.annualExpenses.propertyManagement, color: "bg-emerald-400" },
                      { label: "Maintenance", value: r.annualExpenses.maintenance, color: "bg-amber-400" },
                      { label: "HOA/Other",   value: r.annualExpenses.hoa + r.annualExpenses.utilities + r.annualExpenses.other, color: "bg-stone-400" },
                    ].filter(item => item.value > 0).sort((a, b) => b.value - a.value).map(item => {
                      const pct = r.annualExpenses.total > 0 ? (item.value / r.annualExpenses.total) * 100 : 0;
                      return (
                        <div key={item.label} className="space-y-1.5 group">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
                            <span className="text-stone-500 group-hover:text-stone-900 transition-colors">{item.label}</span>
                            <span className="text-stone-800">{pct.toFixed(0)}%</span>
                          </div>
                          <div className="h-2 bg-white rounded-full overflow-hidden border border-stone-100">
                            <div className={`h-full transition-all duration-1000 ${item.color}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="flex flex-col justify-center bg-blue-50/50 rounded-3xl p-8 border border-blue-100">
                  <Info size={24} className="text-blue-400 mb-4" />
                  <h4 className="text-sm font-black uppercase tracking-wider text-blue-900 mb-2">Did you know?</h4>
                  <p className="text-xs text-blue-700/80 leading-relaxed font-medium">
                    Operating expenses typically range from <span className="font-bold">35% to 50%</span> of gross income. If your total expenses are significantly lower, you might be underestimating maintenance or vacancy reserves.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Projection ─────────────────── */}
          {tab === "projection" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="overflow-hidden rounded-3xl border border-stone-200 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-200">
                        <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-stone-500">Year</th>
                        <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-stone-500 text-right">Rent</th>
                        <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-stone-500 text-right">Cash Flow</th>
                        <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-stone-500 text-right">Prop Value</th>
                        <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-stone-500 text-right">Equity</th>
                        <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-stone-500 text-right">CoC Return</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {r.yearlyProjections.map(row => (
                        <tr key={row.year} className="hover:bg-blue-50/30 transition-colors group">
                          <td className="py-4 px-4 text-[11px] font-black text-stone-400 group-hover:text-blue-500">{row.year}</td>
                          <td className="py-4 px-4 text-right text-xs font-bold text-stone-600">{fmtShort(row.grossRent)}</td>
                          <td className={`py-4 px-4 text-right text-xs font-black ${row.cashFlow >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
                            {fmtUSD(row.cashFlow / 12)}<span className="text-[10px] font-bold opacity-50 ml-0.5">/mo</span>
                          </td>
                          <td className="py-4 px-4 text-right text-xs font-bold text-stone-700">{fmtShort(row.propertyValue)}</td>
                          <td className="py-4 px-4 text-right text-xs font-black text-blue-600">{fmtShort(row.equity)}</td>
                          <td className="py-4 px-4 text-right">
                            <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${row.cocReturn >= 8 ? "bg-emerald-50 text-emerald-700" : row.cocReturn >= 4 ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"}`}>
                              {fmtPct(row.cocReturn, 1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-stone-50 border-t-2 border-stone-200">
                      <tr>
                        <td className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-stone-900" colSpan={2}>Aggregate Result</td>
                        <td className="py-6 px-4 text-right">
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter mb-1">Total Profit</p>
                          <p className="text-lg font-black text-emerald-600">{fmtShort(r.yearlyProjections[r.yearlyProjections.length - 1]?.cumulativeCashFlow ?? 0)}</p>
                        </td>
                        <td className="py-6 px-4 text-right">
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter mb-1">Final Value</p>
                          <p className="text-lg font-black text-stone-800">{fmtShort(r.yearlyProjections[r.yearlyProjections.length - 1]?.propertyValue ?? 0)}</p>
                        </td>
                        <td className="py-6 px-4 text-right" colSpan={2}>
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter mb-1">Portfolio Equity</p>
                          <p className="text-lg font-black text-blue-700">{fmtShort(r.yearlyProjections[r.yearlyProjections.length - 1]?.equity ?? 0)}</p>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-stone-50 rounded-[2rem] border border-stone-200 flex items-start gap-4">
                <div className="p-2 bg-white rounded-xl shadow-sm"><Info size={16} className="text-blue-500" /></div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Projection Logic</p>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Estimates assume <span className="font-bold text-stone-900">3% annual expense inflation</span>. Rental growth of <span className="font-bold text-stone-900">{rentGrowth}%</span> and appreciation of <span className="font-bold text-stone-900">{appreciation}%</span> are compounded annually over the <span className="font-bold text-stone-900">{holdYears}-year</span> hold period.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
