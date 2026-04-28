"use client";

import { useState, useMemo } from "react";
import { 
  Building2, 
  Home, 
  Construction, 
  Store, 
  Factory, 
  Package, 
  Bus, 
  Hotel, 
  Landmark, 
  Trees,
  ChevronDown,
  Info,
  AlertTriangle,
  Zap,
  TrendingUp,
  LayoutDashboard,
  Search,
  BookOpen,
  Users,
  Target
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormState {
  propertyValue: string;
  propertyType: string;
  // Income
  grossRent: string;
  otherIncome: string;
  vacancyRate: string;
  // Expenses
  propertyTax: string;
  insurance: string;
  maintenance: string;
  propertyMgmt: string;
  utilities: string;
  hoa: string;
  capex: string;
  otherExpense: string;
  // Financing (for cash-on-cash)
  useFinancing: boolean;
  downPayment: string;
  closingCosts: string;
  annualDebtService: string;
}

interface CapResult {
  // Income
  grossRentalIncome: number;
  otherIncome: number;
  vacancyLoss: number;
  effectiveGrossIncome: number;
  // Expenses
  totalExpenses: number;
  expenseRatio: number;
  // NOI & Cap
  noi: number;
  capRate: number;
  // Cash on cash
  totalCashInvested: number;
  annualCashFlow: number;
  cashOnCash: number | null;
  // Derived
  impliedValue: number;
  grossRentMultiplier: number;
  breakEvenOccupancy: number;
  pricePerNOI: number;
  rating: "excellent" | "good" | "average" | "poor" | "negative";
  ratingLabel: string;
  benchmarkLow: number;
  benchmarkHigh: number;
}

// ─── Property Type Benchmarks (2026 US averages) ─────────────────────────────
const PROPERTY_BENCHMARKS: Record<string, { low: number; high: number; label: string; icon: React.ReactNode }> = {
  "multifamily":    { low: 4.5, high: 6.5,  label: "Multifamily / Apartment",   icon: <Building2 className="w-3 h-3" /> },
  "singlefamily":   { low: 3.5, high: 6.0,  label: "Single-Family Rental",       icon: <Home className="w-3 h-3" /> },
  "office":         { low: 5.5, high: 8.5,  label: "Office",                     icon: <Construction className="w-3 h-3" /> },
  "retail":         { low: 5.0, high: 8.0,  label: "Retail / Strip Mall",         icon: <Store className="w-3 h-3" /> },
  "industrial":     { low: 4.0, high: 6.5,  label: "Industrial / Warehouse",      icon: <Factory className="w-3 h-3" /> },
  "selfStorage":    { low: 5.0, high: 7.5,  label: "Self Storage",               icon: <Package className="w-3 h-3" /> },
  "mobilehome":     { low: 5.5, high: 8.0,  label: "Mobile Home Park",           icon: <Bus className="w-3 h-3" /> },
  "hospitality":    { low: 6.5, high: 10.0, label: "Hospitality / Hotel",         icon: <Hotel className="w-3 h-3" /> },
  "mixeduse":       { low: 4.5, high: 7.0,  label: "Mixed-Use",                  icon: <Landmark className="w-3 h-3" /> },
  "land":           { low: 1.0, high: 3.5,  label: "Land / Development",          icon: <Trees className="w-3 h-3" /> },
};

const n = (s: string) => parseFloat(s.replace(/,/g, "")) || 0;

// ─── Core Calculation ─────────────────────────────────────────────────────────
function calculate(f: FormState): CapResult | null {
  const propertyValue = n(f.propertyValue);
  if (propertyValue <= 0) return null;

  const grossRentalIncome = n(f.grossRent);
  const otherIncome = n(f.otherIncome);
  const vacancyRate = Math.min(100, Math.max(0, n(f.vacancyRate)));
  const vacancyLoss = grossRentalIncome * (vacancyRate / 100);
  const effectiveGrossIncome = grossRentalIncome - vacancyLoss + otherIncome;

  const propertyTax = n(f.propertyTax);
  const insurance = n(f.insurance);
  const maintenance = n(f.maintenance);
  const propertyMgmt = effectiveGrossIncome * (n(f.propertyMgmt) / 100);
  const utilities = n(f.utilities);
  const hoa = n(f.hoa) * 12;
  const capex = n(f.capex);
  const otherExpense = n(f.otherExpense);

  const totalExpenses = propertyTax + insurance + maintenance + propertyMgmt + utilities + hoa + capex + otherExpense;
  const expenseRatio = effectiveGrossIncome > 0 ? (totalExpenses / effectiveGrossIncome) * 100 : 0;

  const noi = effectiveGrossIncome - totalExpenses;
  const capRate = (noi / propertyValue) * 100;

  // Cash on cash
  let totalCashInvested: number | null = null;
  let annualCashFlow: number | null = null;
  let cashOnCash: number | null = null;
  if (f.useFinancing) {
    const dp = n(f.downPayment);
    const cc = n(f.closingCosts);
    const debt = n(f.annualDebtService);
    totalCashInvested = dp + cc;
    annualCashFlow = noi - debt;
    cashOnCash = totalCashInvested > 0 ? (annualCashFlow / totalCashInvested) * 100 : null;
  }

  // Benchmarks
  const bench = PROPERTY_BENCHMARKS[f.propertyType] || PROPERTY_BENCHMARKS["multifamily"];

  let rating: CapResult["rating"];
  let ratingLabel: string;
  if (noi < 0) { rating = "negative"; ratingLabel = "Negative NOI — Property Losing Money"; }
  else if (capRate >= bench.high) { rating = "excellent"; ratingLabel = "Excellent — Above Market"; }
  else if (capRate >= bench.low + (bench.high - bench.low) * 0.5) { rating = "good"; ratingLabel = "Good — At or Above Market Average"; }
  else if (capRate >= bench.low) { rating = "average"; ratingLabel = "Average — Within Market Range"; }
  else { rating = "poor"; ratingLabel = "Below Market — Price May Be Too High"; }

  const impliedValue = capRate > 0 ? noi / (bench.low / 100 + (bench.high - bench.low) / 100 / 2) : 0;
  const grossRentMultiplier = grossRentalIncome > 0 ? propertyValue / grossRentalIncome : 0;
  const breakEvenOccupancy = (grossRentalIncome + otherIncome) > 0 ? (totalExpenses / (grossRentalIncome + otherIncome)) * 100 : 0;
  const pricePerNOI = noi > 0 ? propertyValue / noi : 0;

  return {
    grossRentalIncome, otherIncome, vacancyLoss, effectiveGrossIncome,
    totalExpenses, expenseRatio, noi, capRate,
    totalCashInvested: totalCashInvested ?? 0,
    annualCashFlow: annualCashFlow ?? 0,
    cashOnCash,
    impliedValue, grossRentMultiplier, breakEvenOccupancy, pricePerNOI,
    rating, ratingLabel,
    benchmarkLow: bench.low,
    benchmarkHigh: bench.high,
  };
}

// ─── Formatters ───────────────────────────────────────────────────────────────
const f$ = (v: number, dec = 0) =>
  (v < 0 ? "-$" : "$") + Math.abs(v).toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
const fPct = (v: number, dec = 2) => v.toFixed(dec) + "%";
const fX = (v: number) => v.toFixed(2) + "×";

const RATING_COLORS: Record<string, string> = {
  excellent: "#00e5a0",
  good:      "#7bcc70",
  average:   "#f5c842",
  poor:      "#ff7b3a",
  negative:  "#ff3a5c",
};

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "What is a cap rate in real estate?",
    a: "A capitalization rate (cap rate) is the ratio of a property's Net Operating Income (NOI) to its current market value, expressed as a percentage. It represents the annual return a property generates as if purchased entirely with cash — no mortgage. Cap Rate = NOI ÷ Property Value × 100. A $300,000 property generating $21,000 in NOI has a 7% cap rate. It is the foundational metric for comparing income-producing properties on equal footing regardless of financing.",
  },
  {
    q: "Does cap rate include mortgage payments?",
    a: "No — mortgage payments (debt service) are explicitly excluded from cap rate calculations. Net Operating Income is always calculated before debt service. This is by design: keeping financing out of the formula lets you compare any two properties on the same basis regardless of how each is financed. If you want to factor your specific loan terms into the analysis, cash-on-cash return is the appropriate metric. You can calculate it using the financing toggle in this calculator.",
  },
  {
    q: "What is a good cap rate for rental property?",
    a: "For residential rentals, most investors target a cap rate between 5% and 10%, but the right number depends entirely on your market, property type, and risk tolerance. In high-demand urban markets, 4%–6% is typical and acceptable because demand is stable, appreciation is reliable, and vacancy is structurally low. In secondary markets or with higher-risk properties, investors want 7%–9%+ to justify the additional uncertainty. A high cap rate is not automatically good — properties trading above 9%–10% usually carry a specific reason: deferred maintenance, tenant concentration risk, or limited appreciation potential.",
  },
  {
    q: "What does a 7% cap rate mean?",
    a: "A 7% cap rate means the property generates Net Operating Income equal to 7% of its current market value each year — before any debt payments. On a $400,000 property, that's $28,000 in annual NOI. It also implies a payback period of roughly 14.3 years on an all-cash purchase (100 ÷ 7 = 14.3), though this doesn't account for rent growth, capital expenditures, or proceeds from an eventual sale. In most US markets in 2026, a 7% cap rate sits at the higher end of residential and toward the middle of commercial benchmarks.",
  },
  {
    q: "What is NOI in real estate?",
    a: "Net Operating Income (NOI) is the annual income a property generates after subtracting all operating expenses — but before mortgage payments, income taxes, and depreciation. NOI = Effective Gross Income (gross rent minus vacancy, plus other income) minus operating expenses (property tax, insurance, management fees, maintenance, CapEx reserves, utilities, HOA). Mortgage principal and interest are never included. NOI is the numerator in the cap rate formula and the foundation of virtually all commercial real estate valuation.",
  },
  {
    q: "Can I use cap rate to value a property?",
    a: "Yes — this is broadly how appraisers value income-producing properties using the income approach. If you know a property's NOI and you know the market cap rate for comparable assets in that submarket, you can calculate implied value: Implied Value = NOI ÷ Market Cap Rate. For example, a property with $25,000 in annual NOI in a market where similar assets trade at a 6.25% cap rate has an implied value of $400,000 ($25,000 ÷ 0.0625). The Implied Fair Value shown in our NOI waterfall uses this approach, dividing your calculated NOI by the midpoint of the market benchmark range for your selected property type.",
  },
  {
    q: "What is the difference between cap rate and cash-on-cash return?",
    a: "Cap rate is a property-level, financing-neutral metric. Cash-on-cash return is an investor-level metric that measures annual pre-tax cash flow as a percentage of the actual cash invested (down payment plus closing costs). If you buy a property all-cash, cap rate and cash-on-cash return are equal (before taxes). When you add financing, they diverge: if your mortgage rate is below the cap rate (positive leverage), cash-on-cash exceeds the cap rate. If your mortgage rate is above the cap rate (negative leverage), cash-on-cash will be lower — meaning debt is actually reducing your returns. Both metrics should always be calculated for financed purchases.",
  },
  {
    q: "How do I calculate cap rate for a property I already own?",
    a: "Use your actual NOI from the trailing 12 months — real income minus real operating expenses — and divide by the property's current market value, not your original purchase price. Your purchase price reflects what the market looked like when you bought; today's value reflects what the property would fetch now. Using current value gives you a much more accurate picture of how the asset is performing relative to the current market. If you're unsure of the current value, look at recent comparable sales in your submarket or request a broker opinion of value.",
  },
  {
    q: "When should I use a different metric instead of cap rate?",
    a: "Cap rate works best for stabilized rental properties with consistent income history. It breaks down in several scenarios: (1) Fix-and-flip projects — use profit margin and ROI instead. (2) Ground-up development — use IRR and equity multiple over the project timeline. (3) Properties being repositioned or with significant vacancy — current NOI doesn't reflect stabilized performance, so a pro forma cap rate at stabilization is more relevant. (4) Properties with long-term fixed leases well above or below market — the current NOI may not reflect economic reality once leases roll. In all these cases, cap rate remains a useful reference point but should be paired with deal-specific metrics.",
  },
];

// ─── Input component ─────────────────────────────────────────────────────────
function Field({ label, hint, prefix, suffix, value, onChange, step, placeholder, min }: {
  label: string; hint?: string; prefix?: string; suffix?: string;
  value: string; onChange: (v: string) => void;
  step?: number; placeholder?: string; min?: number;
}) {
  return (
    <div className="field">
      <div className="field-top">
        <label>{label}</label>
        {hint && <span className="hint">{hint}</span>}
      </div>
      <div className="irow">
        {prefix && <span className="adorn">{prefix}</span>}
        <input type="number" value={value} step={step ?? 1} min={min ?? 0}
          placeholder={placeholder ?? "0"}
          onChange={e => onChange(e.target.value)} />
        {suffix && <span className="adorn suf">{suffix}</span>}
      </div>
    </div>
  );
}

// ─── NOI Waterfall row ───────────────────────────────────────────────────────
function WRow({ label, value, sub, accent, total, negative }: { label: string; value: number; sub?: string; accent?: boolean; total?: boolean; negative?: boolean }) {
  return (
    <div className={`wrow ${total ? "wrow-total" : ""} ${accent ? "wrow-accent" : ""}`}>
      <span className="wrow-label">{label}{sub && <small> {sub}</small>}</span>
      <span className={`wrow-val ${negative ? "neg" : ""} ${accent ? "acc" : ""}`}>{negative ? `(${f$(Math.abs(value))})` : f$(value)}</span>
    </div>
  );
}

// ─── Gauge ────────────────────────────────────────────────────────────────────
function CapGauge({ capRate, low, high }: { capRate: number; low: number; high: number }) {
  const max = high * 1.6;
  const pct = Math.min(100, (capRate / max) * 100);
  const lowPct = (low / max) * 100;
  const highPct = (high / max) * 100;
  const color = capRate >= high ? "#00e5a0" : capRate >= low ? "#7bcc70" : capRate > 0 ? "#f5c842" : "#ff3a5c";

  return (
    <div className="gauge-wrap">
      <div className="gauge-track">
        <div className="gauge-zone" style={{ left: `${lowPct}%`, width: `${highPct - lowPct}%` }} />
        <div className="gauge-fill" style={{ width: `${pct}%`, background: color }} />
        <div className="gauge-needle" style={{ left: `${pct}%`, background: color }} />
      </div>
      <div className="gauge-labels">
        <span>0%</span>
        <span className="gl-low" style={{ left: `${lowPct}%` }}>{low}%</span>
        <span className="gl-high" style={{ left: `${highPct}%` }}>{high}%</span>
        <span>{max.toFixed(0)}%</span>
      </div>
    </div>
  );
}

export default function CapRatePage() {
  const [form, setForm] = useState<FormState>({
    propertyValue: "650000",
    propertyType: "multifamily",
    grossRent: "60000",
    otherIncome: "1200",
    vacancyRate: "7",
    propertyTax: "8500",
    insurance: "2800",
    maintenance: "3600",
    propertyMgmt: "8",
    utilities: "0",
    hoa: "0",
    capex: "3000",
    otherExpense: "600",
    useFinancing: false,
    downPayment: "162500",
    closingCosts: "9750",
    annualDebtService: "28800",
  });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const result = useMemo(() => calculate(form), [form]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600&family=Barlow:wght@300;400;500&display=swap');

        .cap-page {
          --void:    #ffffff;
          --base:    #f8fafc;
          --raised:  #f1f5f9;
          --panel:   #ffffff;
          --rim:     #e2e8f0;
          --rim2:    #cbd5e1;
          --text:    #0f172a;
          --muted:   #64748b;
          --faint:   #f1f5f9;
          --green:   #10b981;
          --green2:  #059669;
          --yellow:  #f59e0b;
          --orange:  #f97316;
          --red:     #ef4444;
          --blue:    #3b82f6;
          --accent:  #10b981;
          --radius:  12px;

          font-family: 'Barlow', sans-serif;
          background: var(--void);
          color: var(--text);
          line-height: 1.6;
          font-size: 15px;
          min-height: 100vh;
        }

        .container { max-width: 1100px; margin: 0 auto; padding: 0 20px 100px; }

        .hero {
          padding: 80px 0 60px;
          border-bottom: 1px solid var(--rim);
          margin-bottom: 48px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 40px;
          align-items: end;
        }
        @media (max-width: 900px) { 
          .hero { grid-template-columns: 1fr; padding: 40px 0 30px; text-align: center; justify-items: center; } 
          .hero-ticker { display: none; }
          .hero-sub { margin: 0 auto; }
        }

        .hero-tag {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          color: var(--green);
          letter-spacing: .14em;
          text-transform: uppercase;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        @media (max-width: 900px) { .hero-tag { justify-content: center; } }
        .hero-tag::before { content: '//'; opacity: .4; }

        .cap-page h1 {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 900;
          line-height: .95;
          color: var(--text);
          text-transform: uppercase;
          letter-spacing: -.02em;
          margin-bottom: 18px;
        }
        .cap-page h1 .accent-word { display: block; color: var(--green); font-style: italic; }
        .hero-sub { font-size: 16px; color: var(--muted); max-width: 580px; font-weight: 400; }

        .hero-ticker { text-align: right; flex-shrink: 0; }
        .ticker-row { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
        .ticker-item { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--muted); display: flex; align-items: center; gap: 8px; border: 1px solid var(--rim); padding: 4px 10px; border-radius: 6px; background: var(--base); }
        .ticker-dot { width: 6px; height: 6px; border-radius: 50%; }

        .main-grid { display: grid; grid-template-columns: 440px 1fr; gap: 24px; margin-bottom: 72px; }
        @media (max-width: 1000px) { .main-grid { grid-template-columns: 1fr; } }

        .input-panel { background: var(--panel); border: 1px solid var(--rim); border-radius: 16px; box-shadow: 0 4px 20px -10px rgba(0,0,0,0.05); overflow: hidden; }
        .panel-bar { background: var(--base); border-bottom: 1px solid var(--rim); padding: 16px 24px; display: flex; align-items: center; gap: 10px; }
        .panel-bar-title { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--text); font-weight: 600; letter-spacing: .1em; text-transform: uppercase; flex: 1; }
        .panel-bar-dot { width: 8px; height: 8px; background: var(--green); border-radius: 50%; box-shadow: 0 0 10px var(--green); }
        .panel-body { padding: 24px; }

        .sec-head { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: .14em; margin: 24px 0 16px; padding-bottom: 8px; border-bottom: 1px solid var(--rim); display: flex; align-items: center; gap: 8px; }
        .sec-head:first-of-type { margin-top: 0; }
        .sec-head span { color: var(--green); font-weight: 700; }

        .field { margin-bottom: 16px; }
        .field-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
        .field label { font-size: 13px; font-weight: 600; color: var(--text); }
        .hint { font-size: 10.5px; color: var(--muted); font-family: 'IBM Plex Mono', monospace; }
        .irow { display: flex; align-items: center; background: var(--void); border: 1px solid var(--rim); border-radius: 8px; overflow: hidden; transition: all .2s; }
        .irow:focus-within { border-color: var(--green); box-shadow: 0 0 0 3px rgba(16,185,129,.1); }
        .adorn { padding: 0 12px; font-size: 14px; color: var(--muted); background: var(--base); border-right: 1px solid var(--rim); height: 42px; display: flex; align-items: center; font-family: 'IBM Plex Mono', monospace; flex-shrink: 0; }
        .adorn.suf { border-right: none; border-left: 1px solid var(--rim); }
        .irow input { flex: 1; border: none; outline: none; padding: 0 12px; height: 42px; font-size: 14px; font-family: 'IBM Plex Mono', monospace; color: var(--text); background: transparent; min-width: 0; }
        
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 480px) { .field-row { grid-template-columns: 1fr; } }

        .cap-page select {
          width: 100%; height: 42px;
          background: var(--void); border: 1px solid var(--rim);
          border-radius: 8px; color: var(--text);
          font-family: 'IBM Plex Mono', monospace; font-size: 13px;
          padding: 0 12px; outline: none; cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2364748b' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 32px;
          transition: all .2s;
        }
        .cap-page select:focus { border-color: var(--green); box-shadow: 0 0 0 3px rgba(16,185,129,.1); }

        .toggle-row { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; padding: 12px; background: var(--base); border-radius: 10px; border: 1px solid var(--rim); }
        .toggle { position: relative; width: 40px; height: 22px; flex-shrink: 0; }
        .toggle input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; inset: 0; background: var(--rim2); border-radius: 100px; cursor: pointer; transition: background .2s; }
        .slider::before { content: ''; position: absolute; width: 16px; height: 16px; left: 3px; top: 3px; background: #fff; border-radius: 50%; transition: all .2s; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .toggle input:checked + .slider { background: var(--green); }
        .toggle input:checked + .slider::before { transform: translateX(18px); }
        .toggle-label { font-size: 13px; color: var(--text); font-weight: 600; }

        .results-col { display: flex; flex-direction: column; gap: 20px; }

        .cap-hero {
          background: var(--panel);
          border: 1px solid var(--rim);
          border-radius: 16px;
          padding: 32px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 30px -15px rgba(0,0,0,0.08);
        }
        .cap-hero-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; flex-wrap: wrap; }
        .cap-rate-label { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: .12em; margin-bottom: 8px; }
        .cap-rate-number {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(4rem, 10vw, 7rem);
          font-weight: 900;
          line-height: 1;
          letter-spacing: -.03em;
        }
        .cap-rate-sub { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--muted); margin-top: 8px; }

        .rating-chip {
          display: inline-flex; align-items: center; gap: 8px;
          border: 1px solid; border-radius: 8px;
          padding: 8px 16px; font-size: 12px; font-weight: 700;
          font-family: 'IBM Plex Mono', monospace;
          text-transform: uppercase; letter-spacing: .08em;
        }

        .gauge-wrap { margin-top: 24px; }
        .gauge-track { height: 10px; background: var(--base); border-radius: 100px; position: relative; margin-bottom: 10px; border: 1px solid var(--rim); }
        .gauge-zone { position: absolute; top: 0; height: 100%; background: rgba(16,185,129,.1); border-left: 1px solid var(--green); border-right: 1px solid var(--green); opacity: 0.5; }
        .gauge-fill { height: 100%; border-radius: 100px; transition: width .5s; }
        .gauge-needle { position: absolute; top: -4px; width: 3px; height: 18px; border-radius: 2px; transform: translateX(-50%); transition: left .5s; z-index: 2; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .gauge-labels { position: relative; height: 20px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--muted); display: flex; justify-content: space-between; }
        .gl-low, .gl-high { position: absolute; transform: translateX(-50%); color: var(--green); font-weight: 600; }

        .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        @media (max-width: 640px) { .stats-row { grid-template-columns: 1fr 1fr; } }
        .stat { background: var(--panel); border: 1px solid var(--rim); border-radius: 12px; padding: 20px 16px; box-shadow: 0 4px 12px -6px rgba(0,0,0,0.05); }
        .stat .s-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: .1em; margin-bottom: 8px; }
        .stat .s-val { font-family: 'Barlow Condensed', sans-serif; font-size: 2rem; font-weight: 700; color: var(--text); line-height: 1; }
        .stat .s-sub { font-size: 11px; color: var(--muted); margin-top: 6px; }

        .waterfall { background: var(--panel); border: 1px solid var(--rim); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px -6px rgba(0,0,0,0.05); }
        .waterfall-head { background: var(--base); padding: 16px 24px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--text); font-weight: 600; letter-spacing: .1em; text-transform: uppercase; border-bottom: 1px solid var(--rim); }
        .wrow { display: flex; justify-content: space-between; align-items: center; padding: 12px 24px; border-bottom: 1px solid var(--faint); font-size: 14px; gap: 12px; }
        @media (max-width: 400px) { .wrow { flex-wrap: wrap; } .wrow-val { margin-left: auto; } }
        .wrow-total { background: var(--base); border-top: 1px solid var(--rim); font-weight: 700; color: var(--text); }
        .wrow-accent { background: rgba(16,185,129,.03); border-top: 1px solid rgba(16,185,129,.1); }
        .wrow-label { color: var(--muted); font-size: 13px; font-weight: 500; min-width: 120px; }
        .wrow-label small { color: var(--muted); opacity: 0.7; font-size: 11px; font-family: 'IBM Plex Mono', monospace; margin-left: 6px; display: inline-block; }
        .wrow-val { font-family: 'IBM Plex Mono', monospace; font-size: 14px; color: var(--text); font-weight: 500; white-space: nowrap; }
        .wrow-val.neg { color: var(--orange); }
        .wrow-val.acc { color: var(--green2); font-size: 16px; font-weight: 700; }

        .coc-card { background: var(--panel); border: 1px solid var(--rim); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px -6px rgba(0,0,0,0.05); margin-top: 20px; }

        .bench-card { background: var(--panel); border: 1px solid var(--rim); border-radius: 16px; padding: 24px; box-shadow: 0 4px 12px -6px rgba(0,0,0,0.05); }
        .bench-head { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: .1em; margin-bottom: 18px; font-weight: 600; }
        .bench-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
        @media (max-width: 480px) { .bench-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 360px) { .bench-grid { grid-template-columns: 1fr; } }
        .bench-item { background: var(--base); border: 1px solid var(--rim); border-radius: 10px; padding: 14px; cursor: pointer; transition: all .2s; }
        .bench-item:hover { border-color: var(--green); transform: translateY(-2px); box-shadow: 0 4px 12px -6px rgba(0,0,0,0.1); }
        .bench-item.active { border-color: var(--green); background: rgba(16,185,129,.05); box-shadow: 0 4px 12px -6px rgba(16,185,129,0.2); }
        .bench-item .bi-type { font-size: 11px; color: var(--muted); margin-bottom: 6px; display: flex; align-items: center; gap: 8px; font-weight: 600; }
        .bench-item .bi-range { font-family: 'IBM Plex Mono', monospace; font-size: 14px; color: var(--text); font-weight: 700; }
        .bench-item.active .bi-range { color: var(--green2); }

        .cap-page .prose { margin-top: 100px; margin-bottom: 80px; max-width: 800px; margin-left: auto; margin-right: auto; }
        .cap-page .prose h2 { font-family: 'Barlow Condensed', sans-serif; font-size: clamp(2.2rem, 5vw, 3.5rem); font-weight: 900; text-transform: uppercase; letter-spacing: -.02em; color: var(--text); margin-bottom: 24px; line-height: 1.1; border-left: 6px solid var(--green); padding-left: 20px; }
        .cap-page .prose h2 em { font-style: italic; color: var(--green2); }
        .cap-page .prose h3 { font-family: 'Barlow Condensed', sans-serif; font-size: 1.6rem; font-weight: 800; text-transform: uppercase; letter-spacing: .02em; color: var(--text); margin: 40px 0 16px; }
        .cap-page .prose p { color: #334155; margin-bottom: 20px; font-size: 17px; font-weight: 400; line-height: 1.8; }
        .cap-page .prose strong { color: var(--text); font-weight: 700; }
        .cap-page .prose ul { margin: 0 0 24px 24px; list-style-type: none; }
        .cap-page .prose ul li { margin-bottom: 12px; font-size: 17px; color: var(--muted); font-weight: 400; position: relative; padding-left: 28px; }
        .cap-page .prose ul li::before { content: '→'; position: absolute; left: 0; color: var(--green); font-weight: 900; }

        .formula-box { background: var(--base); border: 1px solid var(--rim); border-left: 4px solid var(--green); border-radius: 12px; padding: 24px; margin: 32px 0; font-family: 'IBM Plex Mono', monospace; font-size: 15px; color: var(--text); line-height: 2; box-shadow: 0 4px 12px -6px rgba(0,0,0,0.05); }
        .formula-box strong { color: var(--green2); }

        .callout { background: rgba(16,185,129,.05); border: 1px solid rgba(16,185,129,.15); border-radius: 12px; padding: 20px 24px; margin: 32px 0; font-size: 16px; color: var(--text); font-weight: 400; line-height: 1.7; position: relative; }
        .callout strong { color: var(--green2); }

        .data-table { width: 100%; border-collapse: collapse; font-size: 14px; border-radius: 12px; overflow: hidden; border: 1px solid var(--rim); margin: 32px 0; font-family: 'IBM Plex Mono', monospace; box-shadow: 0 4px 12px -6px rgba(0,0,0,0.05); }
        .data-table th { background: var(--base); color: var(--text); padding: 14px 18px; text-align: left; font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; border-bottom: 2px solid var(--rim); }
        .data-table td { padding: 14px 18px; border-bottom: 1px solid var(--faint); color: var(--muted); font-weight: 500; }
        .data-table tr:last-child td { border-bottom: none; }

        .steps { counter-reset: s; display: flex; flex-direction: column; gap: 16px; margin: 32px 0; }
        .step { display: flex; gap: 20px; counter-increment: s; background: var(--panel); border: 1px solid var(--rim); border-radius: 16px; padding: 24px; transition: all .2s; }
        .step:hover { border-color: var(--green); transform: translateX(8px); }
        .step-n { width: 36px; height: 36px; border-radius: 10px; background: var(--green); color: #fff; font-size: 18px; font-weight: 900; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-family: 'Barlow Condensed', sans-serif; box-shadow: 0 4px 12px -4px var(--green); }
        .step-n::before { content: counter(s); }
        .step-body h4 { font-size: 18px; font-weight: 800; color: var(--text); margin-bottom: 6px; font-family: 'Barlow Condensed', sans-serif; text-transform: uppercase; letter-spacing: .03em; }
        .step-body p { font-size: 15px; color: var(--muted); margin: 0; font-weight: 400; line-height: 1.6; }

        .faq-list { margin-top: 32px; }
        .faq-item { background: var(--panel); border: 1px solid var(--rim); border-radius: 12px; overflow: hidden; margin-bottom: 12px; transition: all .2s; }
        .faq-item:hover { border-color: var(--green); }
        .faq-q { width: 100%; text-align: left; padding: 18px 24px; font-size: 16px; font-weight: 700; color: var(--text); background: none; border: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 16px; font-family: 'Barlow Condensed', sans-serif; text-transform: uppercase; letter-spacing: .02em; }
        .faq-a { padding: 0 24px 20px; font-size: 15px; color: var(--muted); font-weight: 400; display: none; line-height: 1.7; }
        .faq-item.open { border-color: var(--green); box-shadow: 0 4px 12px -6px rgba(16,185,129,0.1); }
        .faq-item.open .faq-a { display: block; }
        .faq-item.open .faq-q { color: var(--green2); border-bottom: 1px solid var(--faint); margin-bottom: 15px; }
        .faq-item.open .faq-chev { transform: rotate(180deg); color: var(--green2); }

        .footer { text-align: center; font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--muted); padding: 48px 0 30px; border-top: 1px solid var(--rim); line-height: 2; margin-top: 100px; background: var(--base); margin-left: -20px; margin-right: -20px; }

        .uc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; }
        .uc { background: var(--base); border: 1px solid var(--rim); border-radius: 8px; padding: 18px; }
        .uc-icon { font-size: 1.6rem; margin-bottom: 10px; color: var(--green); }
        .uc h4 { font-family: 'Barlow Condensed', sans-serif; font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; color: var(--text); margin-bottom: 6px; }
        .uc p { font-size: 13px; color: var(--muted); margin: 0; font-weight: 300; }
      `}</style>

      <main className="cap-page">
        <div className="container">
          <header className="hero">
            <div>
              <div className="hero-tag">Real Estate Investment Tool · 2026 Benchmarks</div>
              <h1>Cap Rate<span className="accent-word">Calculator</span></h1>
              <p className="hero-sub">
                Calculate your property&apos;s capitalization rate, Net Operating Income, cash-on-cash return, and GRM — with live benchmarks by property type.
              </p>
            </div>
            <div className="hero-ticker">
              <div className="ticker-row">
                {Object.entries(PROPERTY_BENCHMARKS).slice(0, 5).map(([k, v]) => (
                  <div className="ticker-item" key={k}>
                    <div className="ticker-dot" style={{ background: "var(--green)", opacity: .4 }} />
                    {v.label}: {v.low}–{v.high}%
                  </div>
                ))}
                <div className="ticker-item" style={{ color: "var(--green)", marginTop: 4 }}>
                  <div className="ticker-dot" style={{ background: "var(--green)" }} />
                  2026 US Market Averages
                </div>
              </div>
            </div>
          </header>

          <div className="main-grid">
            {/* Inputs */}
            <div className="input-panel">
              <div className="panel-bar">
                <div className="panel-bar-dot" />
                <div className="panel-bar-title">INPUT_PARAMETERS</div>
              </div>
              <div className="panel-body">
                <div className="sec-head"><span>#01</span> Property</div>
                <Field label="Purchase Price / Market Value" prefix="$" value={form.propertyValue} onChange={v => setForm(p => ({ ...p, propertyValue: v }))} step={5000} placeholder="650000" />
                <div className="field">
                  <div className="field-top"><label>Property Type</label><span className="hint">sets benchmark</span></div>
                  <select value={form.propertyType} onChange={e => setForm(p => ({ ...p, propertyType: e.target.value }))}>
                    {Object.entries(PROPERTY_BENCHMARKS).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>

                <div className="sec-head"><span>#02</span> Annual Income</div>
                <Field label="Gross Rental Income" hint="before vacancy" prefix="$" value={form.grossRent} onChange={v => setForm(p => ({ ...p, grossRent: v }))} step={1000} />
                <div className="field-row">
                  <Field label="Other Income" hint="laundry, parking…" prefix="$" value={form.otherIncome} onChange={v => setForm(p => ({ ...p, otherIncome: v }))} step={100} />
                  <Field label="Vacancy Rate" hint="% of gross rent" suffix="%" value={form.vacancyRate} onChange={v => setForm(p => ({ ...p, vacancyRate: v }))} step={0.5} min={0} placeholder="7" />
                </div>

                <div className="sec-head"><span>#03</span> Annual Operating Expenses</div>
                <div className="field-row">
                  <Field label="Property Tax" prefix="$" value={form.propertyTax} onChange={v => setForm(p => ({ ...p, propertyTax: v }))} step={100} />
                  <Field label="Insurance" prefix="$" value={form.insurance} onChange={v => setForm(p => ({ ...p, insurance: v }))} step={100} />
                </div>
                <div className="field-row">
                  <Field label="Repairs / Maintenance" prefix="$" value={form.maintenance} onChange={v => setForm(p => ({ ...p, maintenance: v }))} step={100} />
                  <Field label="Prop. Management" hint="% of EGI" suffix="%" value={form.propertyMgmt} onChange={v => setForm(p => ({ ...p, propertyMgmt: v }))} step={0.5} placeholder="8" />
                </div>
                <div className="field-row">
                  <Field label="Utilities (annual)" prefix="$" value={form.utilities} onChange={v => setForm(p => ({ ...p, utilities: v }))} step={100} />
                  <Field label="HOA (monthly)" prefix="$" value={form.hoa} onChange={v => setForm(p => ({ ...p, hoa: v }))} step={25} placeholder="0" />
                </div>
                <div className="field-row">
                  <Field label="CapEx Reserve" hint="annual" prefix="$" value={form.capex} onChange={v => setForm(p => ({ ...p, capex: v }))} step={100} />
                  <Field label="Other Expenses" prefix="$" value={form.otherExpense} onChange={v => setForm(p => ({ ...p, otherExpense: v }))} step={100} />
                </div>

                <div className="sec-head"><span>#04</span> Cash-on-Cash (Optional)</div>
                <div className="toggle-row">
                  <label className="toggle">
                    <input type="checkbox" checked={form.useFinancing} onChange={e => setForm(p => ({ ...p, useFinancing: e.target.checked }))} />
                    <span className="slider" />
                  </label>
                  <span className="toggle-label">Include financing for cash-on-cash return</span>
                </div>
                {form.useFinancing && (
                  <>
                    <div className="field-row">
                      <Field label="Down Payment" prefix="$" value={form.downPayment} onChange={v => setForm(p => ({ ...p, downPayment: v }))} step={5000} />
                      <Field label="Closing Costs" prefix="$" value={form.closingCosts} onChange={v => setForm(p => ({ ...p, closingCosts: v }))} step={500} />
                    </div>
                    <Field label="Annual Debt Service" hint="total mortgage payments / yr" prefix="$" value={form.annualDebtService} onChange={v => setForm(p => ({ ...p, annualDebtService: v }))} step={500} />
                  </>
                )}
              </div>
            </div>

            {/* Results */}
            <div className="results-col">
              {result ? (() => {
                const rColor = RATING_COLORS[result.rating];
                return (
                  <>
                    <div className="cap-hero">
                      <div className="cap-hero-top">
                        <div className="cap-rate-display">
                          <div className="cap-rate-label">Capitalization Rate</div>
                          <div className="cap-rate-number" style={{ color: rColor }}>
                            {fPct(result.capRate, 2)}
                          </div>
                          <div className="cap-rate-sub">NOI: {f$(result.noi)} / Value: {f$(n(form.propertyValue))}</div>
                        </div>
                        <div className="rating-chip" style={{ color: rColor, borderColor: rColor, background: `${rColor}12` }}>
                          <span>■</span> {result.ratingLabel}
                        </div>
                      </div>
                      <CapGauge capRate={result.capRate} low={result.benchmarkLow} high={result.benchmarkHigh} />
                    </div>

                    <div className="stats-row">
                      <div className="stat" style={{ borderColor: "var(--green)" }}>
                        <div className="s-label">Net Op. Income</div>
                        <div className="s-val" style={{ color: "var(--green)", fontSize: "1.3rem" }}>{f$(result.noi)}</div>
                        <div className="s-sub">annual NOI</div>
                      </div>
                      <div className="stat">
                        <div className="s-label">GRM</div>
                        <div className="s-val">{fX(result.grossRentMultiplier)}</div>
                        <div className="s-sub">gross rent multiplier</div>
                      </div>
                      <div className="stat">
                        <div className="s-label">Break-even Occ.</div>
                        <div className="s-val" style={{ color: "var(--yellow)" }}>{fPct(result.breakEvenOccupancy, 0)}</div>
                        <div className="s-sub">min occupancy</div>
                      </div>
                      <div className="stat">
                        <div className="s-label">Price / NOI</div>
                        <div className="s-val">{fX(result.pricePerNOI)}</div>
                        <div className="s-sub">value multiple</div>
                      </div>
                    </div>

                    <div className="waterfall">
                      <div className="waterfall-head">// NOI_WATERFALL</div>
                      <WRow label="Gross Rental Income" value={result.grossRentalIncome} />
                      {result.otherIncome > 0 && <WRow label="Other Income" value={result.otherIncome} />}
                      <WRow label="Vacancy Loss" value={result.vacancyLoss} negative sub={`(${fPct(n(form.vacancyRate), 0)} rate)`} />
                      <WRow label="Effective Gross Income" value={result.effectiveGrossIncome} total />
                      <WRow label="Total Operating Expenses" value={result.totalExpenses} negative sub={`(${fPct(result.expenseRatio, 0)} expense ratio)`} />
                      <WRow label="NET OPERATING INCOME" value={result.noi} total accent />
                      <WRow label="Implied Fair Value" value={result.impliedValue} sub={`at market avg cap rate`} />
                    </div>

                    {form.useFinancing && result.cashOnCash !== null && (
                      <div className="coc-card">
                        <div className="waterfall-head">// CASH_ON_CASH_RETURN</div>
                        <WRow label="Net Operating Income" value={result.noi} />
                        <WRow label="Annual Debt Service" value={n(form.annualDebtService)} negative />
                        <WRow label="Annual Cash Flow" value={result.annualCashFlow} total />
                        <WRow label="Total Cash Invested" value={result.totalCashInvested} />
                        <div className="wrow wrow-accent">
                          <span className="wrow-label" style={{ fontFamily: "monospace", textTransform: "uppercase", fontSize: 11 }}>Cash-on-Cash Return</span>
                          <span className="wrow-val acc" style={{ fontSize: 18 }}>{fPct(result.cashOnCash, 2)}</span>
                        </div>
                      </div>
                    )}

                    <div className="bench-card">
                      <div className="bench-head">// 2026_MARKET_BENCHMARKS — click to switch</div>
                      <div className="bench-grid">
                        {Object.entries(PROPERTY_BENCHMARKS).map(([k, v]) => (
                          <div key={k} className={`bench-item ${form.propertyType === k ? "active" : ""}`}
                            onClick={() => setForm(p => ({ ...p, propertyType: k }))}>
                            <div className="bi-type"><span>{v.icon}</span>{v.label}</div>
                            <div className="bi-range">{v.low}%–{v.high}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                );
              })() : (
                <div style={{ background: "var(--base)", border: "1px solid var(--rim)", borderRadius: 8, padding: 40, textAlign: "center", color: "var(--muted)", fontFamily: "monospace", fontSize: 13 }}>
                  // Enter property value to calculate cap rate
                </div>
              )}
            </div>
          </div>

          <article className="prose">
            <h2>What Is a <em>Cap Rate</em> in Real Estate?</h2>
            <p>
              The <strong>capitalization rate</strong> — universally shortened to &quot;cap rate&quot; — is the single most important metric in income-producing real estate. It quantifies the relationship between a property&apos;s annual Net Operating Income (NOI) and its current market value, expressed as a percentage. Unlike gross rent or price-per-unit, cap rate strips away all the noise and answers one direct question: <strong>how much does this property earn relative to what it costs?</strong>
            </p>
            <p>
              Cap rate is entirely financing-neutral. It assumes an all-cash purchase — no mortgage, no debt service. This makes it the universal language of real estate comparison. A broker who says a property &quot;trades at a 6 cap&quot; means buyers pay roughly 16.7× the annual NOI for it (100 ÷ 6 = 16.7). That multiple encodes everything: location quality, tenant stability, market demand, and risk perception — all in a single number.
            </p>
            <p>
              For residential buy-and-hold investors, cap rate is typically the first number calculated when screening a deal. It won&apos;t tell you everything — financing terms, appreciation potential, and local rent growth all matter — but it gives you an instant, consistent basis for comparing any two properties, anywhere, regardless of size or price.
            </p>

            <h2>The <em>Cap Rate Formula</em>: Step by Step</h2>
            <p>
              The cap rate formula requires just two inputs, but both must be calculated carefully. Optimistic assumptions at either step — inflated income or understated expenses — will produce a misleadingly high cap rate and a bad investment decision.
            </p>
            <div className="formula-box">
              <strong>Cap Rate</strong> = Net Operating Income (NOI) ÷ Current Market Value × 100<br /><br />
              <strong>Step 1 — Gross Income:</strong> Total scheduled rent + other income (parking, laundry, storage)<br />
              <strong>Step 2 — Effective Gross Income (EGI):</strong> Gross Income − Vacancy &amp; Credit Loss<br />
              <strong>Step 3 — NOI:</strong> EGI − All Operating Expenses (taxes, insurance, mgmt, maintenance, CapEx)<br />
              <strong>Step 4 — Cap Rate:</strong> NOI ÷ Property Value × 100
            </div>

            <h3>Worked Example</h3>
            <p>
              Consider a duplex listed at <strong>$420,000</strong> in a mid-sized US city. Each unit rents for $1,400/month, and there&apos;s a coin-operated laundry generating $800/year.
            </p>
            <ul>
              <li><strong>Gross Rental Income:</strong> $1,400 × 2 × 12 = $33,600/year</li>
              <li><strong>Vacancy Loss (6%):</strong> −$2,016</li>
              <li><strong>Other Income:</strong> +$800</li>
              <li><strong>Effective Gross Income:</strong> $32,384</li>
              <li><strong>Operating Expenses:</strong> Property tax $4,200 + Insurance $1,600 + Management (9%) $2,915 + Maintenance $2,000 + CapEx Reserve $1,500 = $12,215</li>
              <li><strong>NOI:</strong> $32,384 − $12,215 = <strong>$20,169</strong></li>
              <li><strong>Cap Rate:</strong> $20,169 ÷ $420,000 × 100 = <strong>4.80%</strong></li>
            </ul>
            <p>
              At 4.80%, this deal sits at the lower end of the 2026 single-family/small multifamily benchmark range of 3.5%–6.0%. Whether that&apos;s acceptable depends on the market&apos;s appreciation trajectory, local vacancy trends, and your investment thesis. Use the calculator above to stress-test inputs — try raising vacancy to 10% or adding a $3,000 roof reserve and see how quickly the cap rate shifts.
            </p>

            <h2>What Is a <em>Good Cap Rate</em> in 2026?</h2>
            <p>
              The honest answer is: it depends on what you&apos;re buying and where. A 4.5% cap rate on a Class A multifamily building in a supply-constrained coastal market may represent exceptional value, while a 4.5% cap rate on a rural retail strip with a single anchor tenant could be financially catastrophic. Context is everything.
            </p>
            <p>
              That said, here are practical 2026 benchmarks broken down by asset class:
            </p>
            <table className="data-table">
              <thead>
                <tr><th>Property Type</th><th>2026 Cap Rate Range</th><th>Risk Level</th><th>Key Drivers</th></tr>
              </thead>
              <tbody>
                <tr><td>Multifamily (5+ units)</td><td>4.5% – 6.5%</td><td>Low–Moderate</td><td>Demand stability, low vacancy in urban cores</td></tr>
                <tr><td>Single-Family Rental</td><td>3.5% – 6.0%</td><td>Low</td><td>Appreciation-driven; lower yields common</td></tr>
                <tr><td>Industrial / Warehouse</td><td>4.0% – 6.5%</td><td>Low–Moderate</td><td>E-commerce tailwinds; long-term NNN leases</td></tr>
                <tr><td>Retail / Strip Mall</td><td>5.0% – 8.0%</td><td>Moderate–High</td><td>Tenant mix quality; anchor stability critical</td></tr>
                <tr><td>Office</td><td>5.5% – 8.5%</td><td>High</td><td>Remote work pressure; market-by-market risk</td></tr>
                <tr><td>Self Storage</td><td>5.0% – 7.5%</td><td>Moderate</td><td>Recession-resistant; low operating costs</td></tr>
                <tr><td>Mobile Home Park</td><td>5.5% – 8.0%</td><td>Moderate</td><td>Affordable housing demand; low supply growth</td></tr>
                <tr><td>Hospitality / Hotel</td><td>6.5% – 10.0%</td><td>High</td><td>RevPAR sensitivity; operational complexity</td></tr>
              </tbody>
            </table>
            <div className="callout">
              <strong>A higher cap rate is not automatically better.</strong> Properties trading above 9%–10% almost always carry an elevated reason: concentrated tenant risk, deferred maintenance, an economically challenged location, or limited near-term appreciation. A 4.5% cap in a high-barrier-to-entry market often delivers stronger total returns over a 10-year hold than an 8% cap in a stagnant secondary market.
            </div>

            <h2>5 Factors That <em>Drive Cap Rates</em></h2>
            <h3>1. Location and Market Strength</h3>
            <p>
              Nothing compresses cap rates faster than strong demand. Investors accept lower returns in markets where vacancy is structurally low, population is growing, and future rent increases are reliable. Conversely, markets with economic uncertainty, high crime, or declining population demand higher cap rates to compensate for the additional risk. The same physical building in San Jose vs. a rural Midwest town might trade at a 4.5% vs. 8.0% cap rate for this reason alone.
            </p>
            <h3>2. Property Type and Income Reliability</h3>
            <p>
              The more predictable and durable the income stream, the lower the cap rate investors accept. Triple-net (NNN) leased industrial buildings with 10-year corporate tenants trade at very compressed rates because the income is near-certain. By contrast, hospitality properties — where occupancy can swing 30 percentage points in a recession — demand premium returns to justify the volatility.
            </p>
            <h3>3. Property Condition and Capital Requirements</h3>
            <p>
              A well-maintained, recently-renovated property has lower near-term capital requirements and attracts better tenants. That predictability reduces risk and suppresses cap rates. Older or distressed properties are priced with higher cap rates to reflect the likely capital expenditure pipeline — roof replacement, HVAC, electrical upgrades — that will erode net cash flow in the coming years. Always model CapEx reserves honestly; seller pro formas frequently omit them.
            </p>
            <h3>4. Rental Strategy (Long-Term vs. Short-Term)</h3>
            <p>
              Short-term rental (STR) properties such as Airbnb-style vacation rentals typically generate significantly higher gross income than equivalent long-term rentals — but the operational complexity is proportionately higher. Dynamic pricing, cleaning costs, platform fees, and seasonal vacancy all reduce the net margin. STR cap rates should reflect that management burden. If you&apos;re comparing an STR opportunity to a long-term rental, make sure your expense assumptions capture the full operating cost.
            </p>
            <h3>5. Prevailing Interest Rates</h3>
            <p>
              Cap rates and interest rates are closely correlated over long periods. Historically, cap rates tend to trade 150–300 basis points above the 10-year Treasury yield. During the ultra-low-rate environment of 2020–2022, cap rates compressed dramatically as capital flooded into real estate. As rates rose through 2023–2025, cap rates expanded. In 2026, with 10-year Treasuries in the 4.0%–4.5% range, real estate cap rates have stabilized at levels that again offer meaningful spreads over risk-free alternatives — making the income math more straightforward than it was two years ago.
            </p>

            <h2>Cap Rate <em>Limitations</em></h2>
            <p>
              Cap rate is an essential starting point — but experienced investors never use it as the only metric. Understanding what it does not capture is just as important as understanding what it does.
            </p>
            <ul>
              <li><strong>It ignores financing entirely.</strong> A property with a 6% cap rate financed at 7% is cash-flow negative from day one. Always pair cap rate analysis with cash-on-cash return to understand what your debt structure does to actual returns.</li>
              <li><strong>It is a snapshot, not a projection.</strong> Cap rate measures current income against current value. It tells you nothing about rent growth potential, near-term capital requirements, or whether the current tenant roll is expiring. A 7% cap today can easily become a 4% cap in two years if rents fall or a major tenant leaves.</li>
              <li><strong>Garbage in, garbage out.</strong> Cap rates are only as reliable as the expense data behind them. Sellers routinely present pro forma NOI figures that exclude CapEx reserves, use below-market management fees (or none at all), and apply zero vacancy. Run the numbers with your own conservative assumptions, not the seller&apos;s.</li>
              <li><strong>Cross-market comparisons are misleading.</strong> A 7% cap rate in Phoenix reflects entirely different market dynamics than a 7% cap rate in Detroit. Always benchmark against comparable properties in the same submarket, not national averages.</li>
              <li><strong>Not suitable for all deal types.</strong> Fix-and-flip projects, ground-up development, and repositioning plays don&apos;t have stable current NOI to anchor a cap rate. Use IRR, profit margin, or equity multiple for those deal types instead.</li>
            </ul>

            <h2>Cap Rate vs. <em>Other Key Metrics</em></h2>
            <h3>Cap Rate vs. Cash-on-Cash Return</h3>
            <p>
              Cap rate and cash-on-cash return are often confused but answer very different questions. Cap rate is property-level and financing-neutral — it tells you how productive the asset itself is. Cash-on-cash return is investor-level — it tells you what your equity earns after the mortgage is paid. If your debt costs less than the cap rate (positive leverage), cash-on-cash will exceed the cap rate. If your debt costs more (negative leverage), cash-on-cash will lag. Both numbers should always be calculated when financing is involved.
            </p>
            <h3>Cap Rate vs. Gross Rent Multiplier (GRM)</h3>
            <p>
              The Gross Rent Multiplier (GRM = Property Price ÷ Annual Gross Rent) is faster to calculate — you don&apos;t need expense data — which makes it a useful first screen. A property with a GRM of 10× generates annual gross rents of one-tenth its price. But because GRM ignores all operating expenses, two properties with identical GRMs can have dramatically different cap rates if their tax bills, management costs, or CapEx profiles diverge. GRM is a quick filter; cap rate is the actual decision tool.
            </p>
            <h3>Cap Rate vs. DSCR</h3>
            <p>
              The Debt Service Coverage Ratio (DSCR = NOI ÷ Annual Debt Service) is critical for financed acquisitions. Most lenders require a minimum DSCR of 1.20–1.25 before approving a loan — meaning the property&apos;s NOI must cover debt payments by at least 20–25%. A property can have an attractive cap rate but still fail DSCR underwriting if the loan amount is too large or the interest rate is too high. Always check DSCR alongside cap rate when modeling a leveraged purchase.
            </p>
            <h3>Cap Rate vs. Total Return (ROI)</h3>
            <p>
              Cap rate measures only current income yield. Total return (or ROI) adds appreciation and principal paydown to the picture. A property with a modest 4.5% cap rate in a market growing at 5% annually may deliver a 9–10% total return over a 5-year hold — far outpacing a static 7% cap rate property in a flat market. For long-hold strategies, model total return rather than relying on cap rate alone.
            </p>

            <h2>How to Use This <em>Cap Rate Calculator</em></h2>
            <div className="steps">
              <div className="step"><div className="step-n" /><div className="step-body"><h4>Enter Purchase Price or Market Value</h4><p>For deals you&apos;re evaluating, use the asking price. For properties you already own, use today&apos;s estimated market value — not your original purchase price. Dividing by what you paid tells you historical yield; dividing by today&apos;s value tells you current market performance.</p></div></div>
              <div className="step"><div className="step-n" /><div className="step-body"><h4>Select Property Type</h4><p>This determines which 2026 benchmark range appears on the gauge and comparison table. You can also click any card in the benchmarks panel to switch property types and instantly see where your deal sits relative to market norms for that category.</p></div></div>
              <div className="step"><div className="step-n" /><div className="step-body"><h4>Enter Realistic Gross Income</h4><p>Use current market rents — not pro forma aspirational rents. Check Zillow Rentals, Apartments.com, or CoStar for comparable leases. Set a vacancy rate that reflects the submarket: 5%–7% is typical for stable multifamily; 10%–15% is reasonable for retail or office in uncertain markets.</p></div></div>
              <div className="step"><div className="step-n" /><div className="step-body"><h4>Enter All Operating Expenses</h4><p>This is the step most investors get wrong. Include property tax at the post-purchase reassessed value (not the current owner&apos;s bill), management fees even if self-managing, and a realistic CapEx reserve (typically 5%–10% of gross rent). Sellers&apos; pro formas routinely exclude these to inflate NOI. Don&apos;t let them inflate yours.</p></div></div>
              <div className="step"><div className="step-n" /><div className="step-body"><h4>Review the NOI Waterfall</h4><p>The waterfall shows exactly how gross income flows to NOI, your expense ratio, and the implied fair value at current market cap rates. If the implied fair value is significantly below the asking price, the seller is pricing in future rent growth that may or may not materialize.</p></div></div>
              <div className="step"><div className="step-n" /><div className="step-body"><h4>Toggle Cash-on-Cash Return</h4><p>Enable the financing section and enter your down payment, closing costs, and total annual mortgage payments. This bridges the gap between the property-level cap rate and your actual investor return once debt service is accounted for.</p></div></div>
            </div>

            <h2 style={{ marginTop: 60 }}>Frequently Asked <em>Questions</em></h2>
            <div className="faq-list">
              {faqs.map((f, i) => (
                <div className={`faq-item ${openFaq === i ? 'open' : ''}`} key={i}>
                  <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    {f.q}<ChevronDown className="w-4 h-4 faq-chev" />
                  </button>
                  <div className="faq-a">{f.a}</div>
                </div>
              ))}
            </div>
          </article>

          <footer className="footer">
            // DISCLAIMER: This calculator is for educational and informational purposes only.<br />
            // Cap rate benchmarks reflect 2026 US market averages and vary significantly by submarket.<br />
            // Consult a licensed real estate professional before making investment decisions.
          </footer>
        </div>
      </main>
    </>
  );
}
