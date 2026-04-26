
"use client";

import { useState, useMemo } from "react";
import { TrendingUp, Building2, Home, Bitcoin, Briefcase, Package, Hourglass, TrendingDown, Gift, Landmark, Users, Leaf, Wheat } from "lucide-react";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, BarChart, Bar, Cell, Legend,
} from "recharts";

// ─── 2024 Federal Brackets ────────────────────────────────────────────────────
const FEDERAL_BRACKETS = [
  { max: 55867,   rate: 0.15   },
  { max: 111733,  rate: 0.205  },
  { max: 154906,  rate: 0.26   },
  { max: 220000,  rate: 0.29   },
  { max: Infinity,rate: 0.33   },
];
const FEDERAL_BPA = 15705;

// ─── Provincial top marginal rates (combined fed+prov at top bracket, 2024) ──
const PROVINCES = [
  { code: "AB", name: "Alberta",                  topRate: 0.48,   provRate: 0.15   },
  { code: "BC", name: "British Columbia",          topRate: 0.535,  provRate: 0.205  },
  { code: "MB", name: "Manitoba",                  topRate: 0.504,  provRate: 0.174  },
  { code: "NB", name: "New Brunswick",             topRate: 0.523,  provRate: 0.195  },
  { code: "NL", name: "Newfoundland & Labrador",   topRate: 0.548,  provRate: 0.218  },
  { code: "NS", name: "Nova Scotia",               topRate: 0.54,   provRate: 0.21   },
  { code: "NT", name: "Northwest Territories",     topRate: 0.4705, provRate: 0.1405 },
  { code: "NU", name: "Nunavut",                   topRate: 0.445,  provRate: 0.115  },
  { code: "ON", name: "Ontario",                   topRate: 0.5353, provRate: 0.1316 },
  { code: "PE", name: "Prince Edward Island",      topRate: 0.5175, provRate: 0.1875 },
  { code: "QC", name: "Quebec",                    topRate: 0.5353, provRate: 0.2575 },
  { code: "SK", name: "Saskatchewan",              topRate: 0.475,  provRate: 0.145  },
  { code: "YT", name: "Yukon",                     topRate: 0.48,   provRate: 0.15   },
];

// ─── Inclusion rates (2024 Budget — Bill C-69 proposal) ──────────────────────
// Pre-June 25 2024: 50% for everyone
// Post-June 25 2024: 50% for individuals up to $250,000; 66.67% above $250k
//   Corporations & trusts: 66.67% on ALL gains
const INCLUSION_SCENARIOS = {
  individual_under:  { rate: 0.5,    label: "50%",    desc: "Individual — gain ≤ $250,000" },
  individual_over:   { rate: 0.6667, label: "66.67%", desc: "Individual — gain > $250,000" },
  corporation:       { rate: 0.6667, label: "66.67%", desc: "Corporation / Trust" },
};

// ─── Asset types ──────────────────────────────────────────────────────────────
const ASSET_TYPES = [
  { id: "investment",  label: "Stocks & Investments",    icon: <TrendingUp size={16} />, hint: "Shares, ETFs, mutual funds, bonds" },
  { id: "realestate",  label: "Real Estate (non-primary)",icon: <Building2 size={16} />, hint: "Rental, cottage, investment property" },
  { id: "primary",     label: "Primary Residence",       icon: <Home size={16} />, hint: "May qualify for principal residence exemption" },
  { id: "crypto",      label: "Cryptocurrency",          icon: <Bitcoin size={16} />,  hint: "Bitcoin, ETH, altcoins — treated as property" },
  { id: "business",    label: "Business / QSBC Shares",  icon: <Briefcase size={16} />, hint: "May qualify for LCGE" },
  { id: "other",       label: "Other Capital Property",  icon: <Package size={16} />, hint: "Art, collectibles, foreign property" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtC = (n: number, dec: number = 0) => {
  if (isNaN(n) || !isFinite(n)) return "$0";
  const abs = Math.abs(n);
  return (n < 0 ? "-$" : "$") + abs.toLocaleString("en-CA", { minimumFractionDigits: dec, maximumFractionDigits: dec });
};
const fmtPct = (n: number, d: number = 2) => (isNaN(n) ? "0" : n.toFixed(d)) + "%";

// Progressive tax on an amount starting from a base income
const calcMarginalTax = (base: number, additional: number, brackets: any[], bpa: number) => {
  const totalTaxable = Math.max(0, base + additional - bpa);
  const baseTaxable  = Math.max(0, base - bpa);
  let totalTax = 0, baseTax = 0, prev = 0;
  for (const b of brackets) {
    const lo = prev;
    const hi = b.max;
    if (totalTaxable > lo) totalTax += (Math.min(totalTaxable, hi) - lo) * b.rate;
    if (baseTaxable  > lo) baseTax  += (Math.min(baseTaxable,  hi) - lo) * b.rate;
    prev = hi;
    if (prev >= totalTaxable && prev >= baseTaxable) break;
  }
  return totalTax - baseTax;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "var(--muted2)", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
      <p style={{ fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{label ? fmtC(Number(label)) : ""}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color ?? "var(--muted2)" }}>{p.name}: {fmtC(p.value)}</p>
      ))}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CapitalGainsTaxCanadaPage() {
  const [proceeds,    setProceeds]    = useState<any>(250000);
  const [acb,         setAcb]         = useState<any>(120000);
  const [expenses,    setExpenses]    = useState<any>(5000);
  const [otherIncome, setOtherIncome] = useState<any>(85000);
  const [province,    setProvince]    = useState<any>("ON");
  const [assetType,   setAssetType]   = useState<any>("investment");
  const [entityType,  setEntityType]  = useState<any>("individual");
  const [lcgeUsed,    setLcgeUsed]    = useState<any>(0);
  const [yearsOwned,  setYearsOwned]  = useState<any>(5);
  const [primaryYears,setPrimaryYears]= useState<any>(5);
  const [scenario,    setScenario]    = useState("post2024"); // "pre2024" | "post2024"
  const [activeTab,   setActiveTab]   = useState("results");

  const prov = PROVINCES.find(p => p.code === province) || PROVINCES[8];

  // ─── Core calculation ───────────────────────────────────────────────────
  const calc = useMemo(() => {
    const proc  = parseFloat(proceeds)    || 0;
    const cost  = parseFloat(acb)         || 0;
    const exp   = parseFloat(expenses)    || 0;
    const other = parseFloat(otherIncome) || 0;
    const lcge  = Math.max(0, parseFloat(lcgeUsed) || 0);

    const rawGain = Math.max(0, proc - cost - exp);

    // Principal residence exemption (PRE)
    let preExemption = 0;
    let netGain = rawGain;
    if (assetType === "primary") {
      const totalYears = Math.max(1, parseFloat(yearsOwned) || 1);
      const primaryYrs = Math.min(parseFloat(primaryYears) || totalYears, totalYears);
      const exemptFraction = Math.min(1, (primaryYrs + 1) / totalYears);
      preExemption = rawGain * exemptFraction;
      netGain = Math.max(0, rawGain - preExemption);
    }

    // LCGE (qualified small business / farm / fishing)
    const lcgeMax = 1016602; // 2024 lifetime limit for QSBC
    const lcgeAvailable = Math.max(0, lcgeMax - lcge);
    let lcgeExemption = 0;
    if (assetType === "business") {
      lcgeExemption = Math.min(netGain, lcgeAvailable);
      netGain = Math.max(0, netGain - lcgeExemption);
    }

    // Inclusion rate
    let inclusionRate;
    if (entityType === "corporation") {
      inclusionRate = 0.6667;
    } else if (scenario === "pre2024") {
      inclusionRate = 0.5;
    } else {
      // post-June 25 2024: 50% up to $250k, 66.67% above
      if (netGain <= 250000) {
        inclusionRate = 0.5;
      } else {
        inclusionRate = (250000 * 0.5 + (netGain - 250000) * 0.6667) / netGain;
      }
    }

    const taxableGain   = netGain * inclusionRate;
    const nonTaxableGain = netGain - taxableGain;

    // Federal tax on the taxable gain
    const fedTax = calcMarginalTax(other, taxableGain, FEDERAL_BRACKETS, FEDERAL_BPA);

    // Provincial tax (simplified: apply provincial top rate proportionally to the additional income)
    // More accurate: use marginal rate on the extra income
    // We'll use the proportion of combined top rate minus federal
    const fedTopRate  = 0.33;
    const provTopRate = prov.topRate - fedTopRate;
    const provTax     = taxableGain * provTopRate * (fedTax / (taxableGain * fedTopRate || 1));
    // Simpler & more honest: estimate provincial as % of the taxable gain
    const provTaxEst  = taxableGain * provTopRate;

    const totalTax = fedTax + provTaxEst;
    const effectiveRate = rawGain > 0 ? (totalTax / rawGain) * 100 : 0;
    const effectiveOnProceeds = proc > 0 ? (totalTax / proc) * 100 : 0;
    const netProfit = proc - cost - exp - totalTax;

    // Marginal rate on last dollar (post-calculation)
    const combinedMarginal = prov.topRate; // approximation for display

    // Chart data: tax at various gain levels
    const chartData = [];
    for (let g = 0; g <= Math.max(rawGain * 1.5, 500000); g += 10000) {
      const tg = scenario === "pre2024" || entityType === "corporation"
        ? g * (entityType === "corporation" ? 0.6667 : 0.5)
        : g <= 250000 ? g * 0.5 : 250000 * 0.5 + (g - 250000) * 0.6667;
      const ft = calcMarginalTax(other, tg, FEDERAL_BRACKETS, FEDERAL_BPA);
      const pt = tg * provTopRate;
      chartData.push({
        gain: g,
        "Tax Owed": Math.round(ft + pt),
        "Net Kept": Math.round(Math.max(0, g - ft - pt)),
      });
    }

    return {
      rawGain, preExemption, lcgeExemption, netGain,
      inclusionRate: inclusionRate * 100,
      taxableGain, nonTaxableGain,
      fedTax, provTax: provTaxEst, totalTax,
      effectiveRate, effectiveOnProceeds,
      netProfit, proc, cost, exp,
      combinedMarginal: combinedMarginal * 100,
      chartData,
      lcgeAvailable,
    };
  }, [proceeds, acb, expenses, otherIncome, province, assetType, entityType,
      lcgeUsed, yearsOwned, primaryYears, scenario, prov]);

  const isPrimary  = assetType === "primary";
  const isBusiness = assetType === "business";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Nunito:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        /* removed global reset */

        :root {
          --bg:       #fdfaf6;
          --bg2:      #f5f0e6;
          --bg3:      #ece6da;
          --surface:  #ffffff;
          --surface2: #faf8f5;
          --border:   #e8e2d8;
          --border2:  #d8cebd;
          --amber:    #d97706;
          --amber2:   #b45309;
          --amber3:   #92400e;
          --amber-dim: #fef3c7;
          --amber-faint: rgba(217, 119, 6, 0.05);
          --text:     #1c1917;
          --muted:    #a8a29e;
          --muted2:   #57534e;
          --green:    #15803d;
          --green2:   #16a34a;
          --red:      #b91c1c;
          --red2:     #dc2626;
          --blue:     #1d4ed8;
          --font-d:   'Instrument Serif', Georgia, serif;
          --font-b:   'Nunito', sans-serif;
          --font-m:   'JetBrains Mono', monospace;
          --r:        12px;
          --glow:     0 4px 20px rgba(0,0,0,0.04);
        }

        /* removed html reset */
        
        .cg-container {
          font-family: var(--font-b);
          background: var(--bg);
          color: var(--text);
          -webkit-font-smoothing: antialiased;
          line-height: 1.6;
          font-size: 15px;
        }

        /* diagonal rule texture */
        .cg-container::before {
          content: '';
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image: repeating-linear-gradient(
            -55deg,
            transparent 0px, transparent 28px,
            rgba(0,0,0,0.025) 28px, rgba(0,0,0,0.025) 29px
          );
        }

        .wrap { position: relative; z-index: 1; max-width: 1180px; margin: 0 auto; padding: 0 22px; }

        /* ── Hero ── */
        .hero {
          padding: 100px 0 48px;
          border-bottom: 1px solid var(--border2);
          position: relative; overflow: hidden;
        }
        .hero::after {
          content: '';
          position: absolute; top: -80px; right: -60px;
          width: 420px; height: 420px;
          background: radial-gradient(circle, rgba(217,119,6,0.1) 0%, transparent 68%);
          pointer-events: none;
        }
        .hero-eyebrow {
          display: flex; align-items: center; gap: 10px; margin-bottom: 16px;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 5px;
          background: var(--amber-dim); color: var(--amber2);
          border: 1px solid rgba(217,119,6,0.3);
          font-size: 0.68rem; font-weight: 800; letter-spacing: 0.1em;
          text-transform: uppercase; padding: 4px 11px; border-radius: 4px;
          font-family: var(--font-b);
        }
        .hero-update {
          font-size: 0.72rem; color: var(--muted); font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase;
        }
        .hero h1 {
          font-family: var(--font-d);
          font-size: clamp(2.2rem, 5.5vw, 4rem);
          font-weight: 400; line-height: 1.1;
          color: var(--text); max-width: 860px;
          margin-bottom: 14px; letter-spacing: -0.01em;
        }
        .hero h1 em { color: var(--amber2); font-style: italic; }
        .hero-sub {
          font-size: 0.97rem; color: var(--muted2);
          max-width: 620px; line-height: 1.75; margin-bottom: 28px;
        }
        .hero-stats { display: flex; gap: 40px; flex-wrap: wrap; }
        .hstat { border-left: 2px solid var(--border2); padding-left: 16px; }
        .hstat-num {
          font-family: var(--font-d); font-size: 1.65rem;
          color: var(--amber2); line-height: 1;
        }
        .hstat-lbl { font-size: 0.72rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.07em; margin-top: 2px; }

        /* ── Layout ── */
        .main-grid {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 24px; padding: 36px 0 20px;
          align-items: start;
        }
        @media(max-width:960px){ .main-grid { grid-template-columns: 1fr; } }

        /* ── Input card ── */
        .input-card {
          background: var(--surface);
          border: 1px solid var(--border2);
          border-radius: var(--r); padding: 24px;
          position: sticky; top: 20px;
          box-shadow: var(--glow);
        }
        @media(max-width:960px){ .input-card { position: static; } }

        .card-section { margin-bottom: 22px; }
        .card-section-title {
          font-size: 0.65rem; font-weight: 800; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--amber);
          margin-bottom: 12px; display: flex; align-items: center; gap: 8px;
          font-family: var(--font-b);
        }
        .card-section-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }

        /* Asset type pills */
        .asset-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 6px; margin-bottom: 4px;
        }
        .asset-pill {
          display: flex; flex-direction: column;
          align-items: flex-start; gap: 2px;
          padding: 9px 10px; border-radius: 8px;
          border: 1.5px solid var(--border2);
          background: transparent; color: var(--muted2);
          cursor: pointer; transition: all 0.13s;
          font-family: var(--font-b); text-align: left;
        }
        .asset-pill .ap-icon { font-size: 0.95rem; display: flex; }
        .asset-pill .ap-label { font-size: 0.76rem; font-weight: 700; line-height: 1.2; }
        .asset-pill .ap-hint  { font-size: 0.65rem; color: var(--muted); line-height: 1.3; }
        .asset-pill:hover { border-color: var(--amber); color: var(--text); }
        .asset-pill.active { border-color: var(--amber); background: var(--amber-dim); color: var(--amber2); }
        .asset-pill.active .ap-hint { color: var(--amber); opacity: 0.7; }

        /* Inputs */
        .field { margin-bottom: 13px; }
        .field label {
          display: block; font-size: 0.7rem; font-weight: 700;
          color: var(--muted); text-transform: uppercase;
          letter-spacing: 0.07em; margin-bottom: 5px;
        }
        .iw {
          display: flex; align-items: center;
          background: var(--bg2); border: 1px solid var(--border2);
          border-radius: 8px; overflow: hidden; transition: border-color 0.13s;
        }
        .iw:focus-within { border-color: var(--amber); }
        .ipfx {
          padding: 0 10px; height: 38px;
          font-size: 0.82rem; color: var(--muted);
          background: var(--surface2);
          border-right: 1px solid var(--border2);
          display: flex; align-items: center;
          font-family: var(--font-m); user-select: none; min-width: 34px;
          justify-content: center;
        }
        .iw input, .iw select {
          flex: 1; border: none; background: transparent;
          padding: 0 11px; height: 38px;
          font-family: var(--font-m); font-size: 0.9rem;
          color: var(--text); outline: none;
        }
        .iw select { cursor: pointer; }
        .iw select option { background: var(--bg2); }
        input[type=range] {
          -webkit-appearance: none; width: 100%;
          height: 3px; background: var(--border2);
          border-radius: 2px; outline: none; margin-top: 7px; cursor: pointer;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 15px; height: 15px;
          border-radius: 50%; background: var(--amber);
          cursor: pointer; border: 2px solid var(--bg2);
          transition: transform 0.12s;
        }
        input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.3); }

        /* Entity toggle */
        .entity-row { display: flex; gap: 6px; margin-bottom: 4px; }
        .entity-btn {
          flex: 1; padding: 7px 10px; text-align: center;
          font-size: 0.74rem; font-weight: 700; border-radius: 6px;
          border: 1.5px solid var(--border2); background: transparent;
          color: var(--muted2); cursor: pointer; transition: all 0.13s;
          font-family: var(--font-b); letter-spacing: 0.04em;
        }
        .entity-btn.active { border-color: var(--amber); background: var(--amber-dim); color: var(--amber2); }

        /* Scenario toggle */
        .scenario-row { display: flex; gap: 0; border: 1px solid var(--border2); border-radius: 8px; overflow: hidden; margin-bottom: 14px; }
        .scenario-btn {
          flex: 1; padding: 8px 12px; text-align: center;
          font-size: 0.74rem; font-weight: 700;
          border: none; background: transparent;
          color: var(--muted2); cursor: pointer; transition: all 0.13s;
          font-family: var(--font-b); border-right: 1px solid var(--border2);
        }
        .scenario-btn:last-child { border-right: none; }
        .scenario-btn.active { background: var(--amber-dim); color: var(--amber2); }

        /* ── Result panel ── */
        .result-panel { display: flex; flex-direction: column; gap: 20px; }

        /* Waterfall bar */
        .waterfall-card {
          background: var(--surface); border: 1px solid var(--border2);
          border-radius: var(--r); padding: 24px;
        }
        .wf-title {
          font-size: 0.65rem; font-weight: 800; text-transform: uppercase;
          letter-spacing: 0.12em; color: var(--muted); margin-bottom: 18px;
          font-family: var(--font-b);
        }
        .waterfall-bar {
          height: 52px; border-radius: 8px; overflow: hidden;
          display: flex; width: 100%; margin-bottom: 14px;
          box-shadow: inset 0 1px 0 rgba(0,0,0,0.05);
        }
        .wf-seg { height: 100%; transition: width 0.55s cubic-bezier(0.4,0,0.2,1); display: flex; align-items: center; justify-content: center; }
        .wf-seg-label { font-size: 0.68rem; font-weight: 800; color: #ffffff; letter-spacing: 0.06em; white-space: nowrap; overflow: hidden; font-family: var(--font-b); }
        .wf-legend { display: flex; gap: 14px; flex-wrap: wrap; }
        .wf-item { display: flex; align-items: center; gap: 7px; }
        .wf-dot { width: 9px; height: 9px; border-radius: 2px; flex-shrink: 0; }
        .wf-lbl { font-size: 0.76rem; color: var(--muted2); font-weight: 600; }
        .wf-val { font-size: 0.82rem; font-family: var(--font-m); color: var(--text); font-weight: 500; }
        .wf-pct { font-size: 0.72rem; color: var(--muted); }

        /* Key metrics */
        .metrics-card {
          background: var(--surface); border: 1px solid var(--border2);
          border-radius: var(--r); padding: 24px;
        }
        .metrics-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 18px; flex-wrap: wrap; gap: 10px;
        }
        .metrics-title { font-family: var(--font-d); font-size: 1rem; color: var(--text); }

        .tab-row {
          display: flex; gap: 3px;
          background: var(--bg2); border: 1px solid var(--border2);
          padding: 3px; border-radius: 7px;
        }
        .tab {
          flex: 1; padding: 6px 12px;
          font-size: 0.72rem; font-weight: 700; border: none;
          border-radius: 5px; background: transparent;
          color: var(--muted); cursor: pointer;
          transition: all 0.12s; text-align: center;
          font-family: var(--font-b); text-transform: uppercase; letter-spacing: 0.05em;
          white-space: nowrap;
        }
        .tab.active { background: var(--surface2); color: var(--amber2); border: 1px solid var(--border2); }

        .metrics-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 11px; }
        @media(max-width:640px){ .metrics-grid { grid-template-columns: 1fr 1fr; } }

        .metric {
          background: var(--bg2); border: 1px solid var(--border);
          border-radius: 9px; padding: 14px 15px;
          transition: border-color 0.15s;
        }
        .metric:hover { border-color: var(--border2); }
        .metric.hero-m {
          background: var(--amber-dim);
          border: 1px solid rgba(217,119,6,0.35);
          grid-column: span 3;
        }
        @media(max-width:640px){ .metric.hero-m { grid-column: span 2; } }
        .m-lbl { font-size: 0.64rem; text-transform: uppercase; letter-spacing: 0.09em; font-weight: 800; color: var(--muted); margin-bottom: 5px; font-family: var(--font-b); }
        .metric.hero-m .m-lbl { color: var(--amber); opacity: 0.8; }
        .m-val { font-family: var(--font-d); font-size: 1.55rem; color: var(--text); line-height: 1; }
        .metric.hero-m .m-val { font-size: 2.4rem; color: var(--amber3); }
        .m-sub { font-size: 0.68rem; color: var(--muted); margin-top: 4px; font-family: var(--font-b); }
        .m-green .m-val { color: var(--green2); }
        .m-red   .m-val { color: var(--red2); }
        .m-amber .m-val { color: var(--amber2); }

        /* Gain breakdown rows */
        .breakdown-rows { display: flex; flex-direction: column; gap: 0; }
        .bdr {
          display: flex; justify-content: space-between; align-items: center;
          padding: 10px 0; border-bottom: 1px solid var(--border);
          font-size: 0.86rem;
        }
        .bdr:last-child { border-bottom: none; }
        .bdr-lbl { color: var(--muted2); }
        .bdr-val { font-family: var(--font-m); font-weight: 600; color: var(--text); }
        .bdr.total .bdr-lbl { color: var(--text); font-weight: 700; }
        .bdr.total .bdr-val { color: var(--red2); font-size: 1rem; }
        .bdr.keeprow .bdr-val { color: var(--green2); font-size: 1rem; }
        .bdr.highlight { background: var(--amber-faint); margin: 0 -4px; padding: 10px 4px; border-radius: 6px; }

        /* Chart */
        .chart-card {
          background: var(--surface); border: 1px solid var(--border2);
          border-radius: var(--r); padding: 24px;
        }

        /* ── Content sections ── */
        .content-area { padding: 20px 0 60px; }
        .csection { padding: 52px 0; border-top: 1px solid var(--border2); }
        .csection:first-child { border-top: 1px solid var(--border2); margin-top: 16px; }

        .sec-badge {
          display: inline-block; background: var(--amber-dim);
          color: var(--amber2); border: 1px solid rgba(217,119,6,0.25);
          font-size: 0.65rem; font-weight: 800; letter-spacing: 0.12em;
          text-transform: uppercase; padding: 3px 10px; border-radius: 4px;
          margin-bottom: 10px; font-family: var(--font-b);
        }
        .sec-title {
          font-family: var(--font-d);
          font-size: clamp(1.6rem, 3.5vw, 2.4rem);
          font-weight: 400; color: var(--text);
          line-height: 1.18; margin-bottom: 10px;
        }
        .sec-title em { color: var(--amber2); font-style: italic; }
        .sec-lead { font-size: 0.94rem; color: var(--muted2); line-height: 1.8; max-width: 700px; margin-bottom: 26px; }

        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
        @media(max-width:760px){ .two-col { grid-template-columns: 1fr; } }
        .three-col { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
        @media(max-width:760px){ .three-col { grid-template-columns: 1fr 1fr; } }
        @media(max-width:480px){ .three-col { grid-template-columns: 1fr; } }

        .cbody { font-size: 0.92rem; color: var(--muted2); line-height: 1.82; }
        .cbody p { margin-bottom: 14px; }
        .cbody h3 { font-family: var(--font-d); font-size: 1.2rem; color: var(--text); margin: 24px 0 9px; font-style: italic; }
        .cbody strong { color: var(--text); font-weight: 700; }
        .cbody .pill {
          display: inline-block; background: var(--amber-dim); color: var(--amber2);
          font-family: var(--font-m); font-size: 0.78rem; padding: 1px 8px;
          border-radius: 4px; border: 1px solid rgba(217,119,6,0.25); vertical-align: middle;
        }

        .icard {
          background: var(--bg2); border: 1px solid var(--border);
          border-radius: 10px; padding: 20px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .icard:hover { border-color: rgba(217,119,6,0.4); transform: translateY(-2px); }
        .icard-icon { font-size: 1.3rem; margin-bottom: 10px; display: block; color: var(--amber2); }
        .icard h4 { font-family: var(--font-d); font-size: 1rem; color: var(--amber2); margin-bottom: 7px; font-style: italic; }
        .icard p  { font-size: 0.82rem; color: var(--muted2); line-height: 1.65; }

        .tbl-wrap { overflow-x: auto; border: 1px solid var(--border2); border-radius: 10px; margin-top: 18px; }
        table { width: 100%; border-collapse: collapse; font-size: 0.84rem; }
        thead { background: var(--surface2); }
        thead th { padding: 11px 14px; text-align: left; color: var(--amber2); font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.09em; font-weight: 800; font-family: var(--font-b); }
        tbody tr { border-top: 1px solid var(--border); }
        tbody tr:hover { background: var(--surface); }
        tbody td { padding: 10px 14px; color: var(--muted2); vertical-align: top; }
        tbody td:first-child { color: var(--text); font-weight: 600; }
        .td-amber { color: var(--amber2) !important; font-weight: 700 !important; }
        .td-green { color: var(--green2) !important; font-weight: 600 !important; }
        .td-red   { color: var(--red2)   !important; font-weight: 600 !important; }

        .faq-item { border-bottom: 1px solid var(--border2); padding: 19px 0; }
        .faq-q { font-family: var(--font-d); font-size: 1.05rem; color: var(--text); margin-bottom: 8px; font-style: italic; }
        .faq-a { font-size: 0.86rem; color: var(--muted2); line-height: 1.78; }

        .alert-box {
          background: rgba(217,119,6,0.08); border: 1px solid rgba(217,119,6,0.25);
          border-radius: 9px; padding: 14px 18px; margin-bottom: 20px;
          font-size: 0.82rem; color: var(--text); line-height: 1.65;
        }
        .alert-box strong { color: var(--amber2); }

        .cta-box {
          background: var(--surface2); border: 1px solid var(--border2);
          border-radius: var(--r); padding: 44px 36px;
          text-align: center; margin: 32px 0 48px;
          position: relative; overflow: hidden;
        }
        .cta-box::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(217,119,6,0.08) 0%, transparent 65%);
          pointer-events: none;
        }
        .cta-box h2 { font-family: var(--font-d); font-size: 2rem; color: var(--text); margin-bottom: 10px; }
        .cta-box h2 em { color: var(--amber2); font-style: italic; }
        .cta-box p  { color: var(--muted2); margin-bottom: 22px; font-size: 0.95rem; }
        .cta-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 11px 28px; border-radius: 7px;
          background: var(--amber); color: #ffffff;
          font-weight: 800; font-size: 0.85rem;
          font-family: var(--font-b); border: none; cursor: pointer;
          transition: all 0.15s; letter-spacing: 0.04em; text-decoration: none;
        }
        .cta-btn:hover { background: var(--amber2); }

        .footer {
          border-top: 1px solid var(--border);
          padding: 24px 0; text-align: center;
          font-size: 0.74rem; color: var(--muted);
        }
        .footer a { color: var(--muted2); text-decoration: none; }
        .footer a:hover { color: var(--amber); }

        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .anim { animation: fadeUp 0.45s ease both; }
        .d1 { animation-delay: 0.06s; } .d2 { animation-delay: 0.13s; } .d3 { animation-delay: 0.21s; }

        @media(max-width:600px){
          .hero { padding: 80px 0 30px; }
          .input-card, .waterfall-card, .metrics-card, .chart-card { padding: 16px; }
          .waterfall-bar { height: 36px; }
          .cta-box { padding: 28px 18px; }
        }
      `}</style>

      <div className="cg-container">
      <div className="wrap">

        {/* ── HERO ── */}
        <header className="hero anim">
          <div className="hero-eyebrow">
            <span className="hero-badge"><Leaf size={12} strokeWidth={2.5} /> Canada</span>
            <span className="hero-update">Updated for current inclusion rate</span>
          </div>
          <h1>Capital Gains Tax<br /><em>Canada Calculator</em></h1>
          <p className="hero-sub">
            Calculate your exact capital gains tax — on investments, real estate, cryptocurrency, and
            business shares. Includes the current inclusion rate changes, principal residence exemption,
            and lifetime capital gains exemption. All 13 provinces.
          </p>
          <div className="hero-stats">
            {[
              { num: "50%",       label: "Inclusion rate ≤ $250K" },
              { num: "66.67%",    label: "Inclusion rate > $250K" },
              { num: "$1,016,602",label: "LCGE limit (QSBC)" },
            ].map(s => (
              <div className="hstat" key={s.label}>
                <div className="hstat-num">{s.num}</div>
                <div className="hstat-lbl">{s.label}</div>
              </div>
            ))}
          </div>
        </header>

        {/* ── CALCULATOR ── */}
        <div className="main-grid" id="calculator">

          {/* LEFT: Inputs */}
          <div className="input-card anim d1">

            {/* Asset type */}
            <div className="card-section">
              <div className="card-section-title">Asset Type</div>
              <div className="asset-grid">
                {ASSET_TYPES.map(a => (
                  <button key={a.id}
                    className={`asset-pill ${assetType === a.id ? "active" : ""}`}
                    onClick={() => setAssetType(a.id)}>
                    <span className="ap-icon">{a.icon}</span>
                    <span className="ap-label">{a.label}</span>
                    <span className="ap-hint">{a.hint}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Entity type */}
            <div className="card-section">
              <div className="card-section-title">Who Is Selling?</div>
              <div className="entity-row">
                {[["individual","Individual"],["corporation","Corporation / Trust"]].map(([v,l]) => (
                  <button key={v} className={`entity-btn ${entityType===v?"active":""}`}
                    onClick={() => setEntityType(v)}>{l}</button>
                ))}
              </div>
            </div>

            {/* Scenario */}
            <div className="card-section">
              <div className="card-section-title">Inclusion Rate Scenario</div>
              <div className="scenario-row">
                {[["pre2024","Pre-June 2024 (50%)"],["post2024","Post-June 2024 (New Rules)"]].map(([v,l]) => (
                  <button key={v} className={`scenario-btn ${scenario===v?"active":""}`}
                    onClick={() => setScenario(v)}>{l}</button>
                ))}
              </div>
            </div>

            {/* Province */}
            <div className="card-section">
              <div className="card-section-title">Province</div>
              <div className="field">
                <div className="iw">
                  <select value={province} onChange={e => setProvince(e.target.value)}>
                    {PROVINCES.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Sale details */}
            <div className="card-section">
              <div className="card-section-title">Sale Details</div>
              <div className="field">
                <label>Sale Proceeds</label>
                <div className="iw"><span className="ipfx">CA$</span>
                  <input type="number" min="0" value={proceeds} onChange={e => setProceeds(e.target.value)} />
                </div>
                <input type="range" min="0" max="2000000" step="5000" value={Math.min(proceeds,2000000)} onChange={e => setProceeds(e.target.value)} />
              </div>
              <div className="field">
                <label>Adjusted Cost Base (ACB)</label>
                <div className="iw"><span className="ipfx">CA$</span>
                  <input type="number" min="0" value={acb} onChange={e => setAcb(e.target.value)} />
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: 3 }}>Original purchase price + capital improvements</div>
              </div>
              <div className="field">
                <label>Selling Expenses</label>
                <div className="iw"><span className="ipfx">CA$</span>
                  <input type="number" min="0" value={expenses} onChange={e => setExpenses(e.target.value)} />
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: 3 }}>Commissions, legal fees, closing costs</div>
              </div>
            </div>

            {/* Other income */}
            <div className="card-section">
              <div className="card-section-title">Your Other Income</div>
              <div className="field">
                <label>Employment / Business Income (annual)</label>
                <div className="iw"><span className="ipfx">CA$</span>
                  <input type="number" min="0" value={otherIncome} onChange={e => setOtherIncome(e.target.value)} />
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: 3 }}>Affects which marginal bracket your gain falls into</div>
              </div>
            </div>

            {/* Primary residence fields */}
            {isPrimary && (
              <div className="card-section">
                <div className="card-section-title">Principal Residence Exemption</div>
                <div className="field">
                  <label>Total Years Owned</label>
                  <div className="iw"><span className="ipfx">#</span>
                    <input type="number" min="1" value={yearsOwned} onChange={e => setYearsOwned(e.target.value)} />
                  </div>
                </div>
                <div className="field">
                  <label>Years Used as Primary Residence</label>
                  <div className="iw"><span className="ipfx">#</span>
                    <input type="number" min="0" value={primaryYears} onChange={e => setPrimaryYears(e.target.value)} />
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: 3 }}>
                    Exemption = (Primary Yrs + 1) ÷ Total Yrs × Gain
                  </div>
                </div>
              </div>
            )}

            {/* LCGE fields */}
            {isBusiness && (
              <div className="card-section">
                <div className="card-section-title">Lifetime Capital Gains Exemption</div>
                <div className="alert-box">
                  <strong>LCGE:</strong> $1,016,602 lifetime limit for qualifying small business corporation shares (QSBC), farming, and fishing property.
                </div>
                <div className="field">
                  <label>LCGE Already Used (prior years)</label>
                  <div className="iw"><span className="ipfx">CA$</span>
                    <input type="number" min="0" max="1016602" value={lcgeUsed} onChange={e => setLcgeUsed(e.target.value)} />
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: 3 }}>
                    Remaining available: {fmtC(calc.lcgeAvailable)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Results */}
          <div className="result-panel">

            {/* Waterfall bar */}
            <div className="waterfall-card anim d2">
              <div className="wf-title">Capital Gain — {fmtC(calc.rawGain)} Breakdown</div>
              {calc.rawGain > 0 ? (
                <>
                  <div className="waterfall-bar">
                    {/* Federal tax */}
                    <div className="wf-seg" style={{ width: (calc.rawGain > 0 ? calc.fedTax/calc.rawGain*100 : 0) + "%", background: "var(--red2)" }}>
                      {(calc.fedTax/calc.rawGain*100) > 8 && <span className="wf-seg-label">Federal</span>}
                    </div>
                    {/* Provincial tax */}
                    <div className="wf-seg" style={{ width: (calc.rawGain > 0 ? calc.provTax/calc.rawGain*100 : 0) + "%", background: "var(--amber)" }}>
                      {(calc.provTax/calc.rawGain*100) > 8 && <span className="wf-seg-label">Prov.</span>}
                    </div>
                    {/* Non-taxable portion (excluded by inclusion rate) */}
                    <div className="wf-seg" style={{ width: (calc.rawGain > 0 ? calc.nonTaxableGain/calc.rawGain*100 : 0) + "%", background: "var(--green)" }}>
                      {(calc.nonTaxableGain/calc.rawGain*100) > 8 && <span className="wf-seg-label">Excluded</span>}
                    </div>
                    {/* Keep (after tax) */}
                    <div className="wf-seg" style={{ width: (calc.rawGain > 0 ? Math.max(0,(calc.rawGain - calc.totalTax - calc.nonTaxableGain))/calc.rawGain*100 : 0) + "%", background: "var(--green2)" }}>
                      {(Math.max(0,calc.rawGain - calc.totalTax - calc.nonTaxableGain)/calc.rawGain*100) > 10 && <span className="wf-seg-label">Keep</span>}
                    </div>
                  </div>
                  <div className="wf-legend">
                    {[
                      { color: "var(--red2)", label: "Federal Tax",        val: fmtC(calc.fedTax),         pct: calc.rawGain>0?calc.fedTax/calc.rawGain*100:0 },
                      { color: "var(--amber)", label: "Provincial Tax",     val: fmtC(calc.provTax),        pct: calc.rawGain>0?calc.provTax/calc.rawGain*100:0 },
                      { color: "var(--green)", label: "Excluded (non-taxable)", val: fmtC(calc.nonTaxableGain), pct: calc.rawGain>0?calc.nonTaxableGain/calc.rawGain*100:0 },
                      { color: "var(--green2)", label: "Net Gain Kept",      val: fmtC(Math.max(0,calc.rawGain-calc.totalTax)), pct: calc.rawGain>0?Math.max(0,calc.rawGain-calc.totalTax)/calc.rawGain*100:0 },
                    ].map(l => (
                      <div className="wf-item" key={l.label}>
                        <span className="wf-dot" style={{ background: l.color }} />
                        <span className="wf-lbl">{l.label}</span>
                        <span className="wf-val">{l.val}</span>
                        <span className="wf-pct">({l.pct.toFixed(1)}%)</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center", color: "var(--muted)", fontSize: "0.87rem", padding: "24px 0" }}>
                  Enter sale proceeds and cost base to see breakdown.
                </div>
              )}
            </div>

            {/* Metrics */}
            <div className="metrics-card anim d2">
              <div className="metrics-header">
                <div className="metrics-title">{prov.name} — Results</div>
                <div className="tab-row">
                  {[["results","Results"],["breakdown","Breakdown"],["chart","Chart"]].map(([v,l]) => (
                    <button key={v} className={`tab ${activeTab===v?"active":""}`} onClick={() => setActiveTab(v)}>{l}</button>
                  ))}
                </div>
              </div>

              {activeTab === "results" && (
                <div className="metrics-grid">
                  <div className="metric hero-m">
                    <div className="m-lbl">Capital Gains Tax Owed</div>
                    <div className="m-val">{fmtC(calc.totalTax)}</div>
                    <div className="m-sub">Federal + {prov.name} provincial · Inclusion rate {fmtPct(calc.inclusionRate, 1)}</div>
                  </div>
                  <div className="metric m-green">
                    <div className="m-lbl">Net Profit After Tax</div>
                    <div className="m-val" style={{ fontSize: "1.25rem" }}>{fmtC(Math.max(0,calc.rawGain - calc.totalTax))}</div>
                    <div className="m-sub">Gain kept after tax</div>
                  </div>
                  <div className="metric m-red">
                    <div className="m-lbl">Effective Tax Rate</div>
                    <div className="m-val" style={{ fontSize: "1.25rem" }}>{fmtPct(calc.effectiveRate)}</div>
                    <div className="m-sub">Tax ÷ capital gain</div>
                  </div>
                  <div className="metric">
                    <div className="m-lbl">Capital Gain</div>
                    <div className="m-val" style={{ fontSize: "1.25rem" }}>{fmtC(calc.rawGain)}</div>
                    <div className="m-sub">Proceeds − ACB − expenses</div>
                  </div>
                  <div className="metric m-amber">
                    <div className="m-lbl">Taxable Portion</div>
                    <div className="m-val" style={{ fontSize: "1.25rem" }}>{fmtC(calc.taxableGain)}</div>
                    <div className="m-sub">At {fmtPct(calc.inclusionRate, 1)} inclusion rate</div>
                  </div>
                  <div className="metric">
                    <div className="m-lbl">Federal Tax</div>
                    <div className="m-val" style={{ fontSize: "1.25rem" }}>{fmtC(calc.fedTax)}</div>
                    <div className="m-sub">On taxable gain</div>
                  </div>
                  <div className="metric">
                    <div className="m-lbl">Provincial Tax</div>
                    <div className="m-val" style={{ fontSize: "1.25rem" }}>{fmtC(calc.provTax)}</div>
                    <div className="m-sub">{prov.name}</div>
                  </div>
                  <div className="metric">
                    <div className="m-lbl">Marginal Rate (Combined)</div>
                    <div className="m-val" style={{ fontSize: "1.25rem" }}>{fmtPct(calc.combinedMarginal)}</div>
                    <div className="m-sub">At top bracket</div>
                  </div>
                  {isPrimary && calc.preExemption > 0 && (
                    <div className="metric m-green" style={{ gridColumn: "span 3" }}>
                      <div className="m-lbl">Principal Residence Exemption Applied</div>
                      <div className="m-val" style={{ fontSize: "1.25rem" }}>{fmtC(calc.preExemption)}</div>
                      <div className="m-sub">Tax-free gain under PRE · Remaining taxable gain: {fmtC(calc.netGain)}</div>
                    </div>
                  )}
                  {isBusiness && calc.lcgeExemption > 0 && (
                    <div className="metric m-green" style={{ gridColumn: "span 3" }}>
                      <div className="m-lbl">Lifetime Capital Gains Exemption (LCGE) Applied</div>
                      <div className="m-val" style={{ fontSize: "1.25rem" }}>{fmtC(calc.lcgeExemption)}</div>
                      <div className="m-sub">Tax-free under LCGE · Remaining taxable: {fmtC(calc.netGain)}</div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "breakdown" && (
                <div className="breakdown-rows">
                  {[
                    { label: "Sale Proceeds",               val: fmtC(calc.proc),          cls: "" },
                    { label: "− Adjusted Cost Base (ACB)",  val: "− " + fmtC(calc.cost),   cls: "" },
                    { label: "− Selling Expenses",          val: "− " + fmtC(calc.exp),    cls: "" },
                    { label: "= Capital Gain",              val: fmtC(calc.rawGain),        cls: "highlight" },
                    ...(isPrimary && calc.preExemption > 0 ? [{ label: `− Principal Residence Exemption`, val: "− " + fmtC(calc.preExemption), cls: "" }] : []),
                    ...(isBusiness && calc.lcgeExemption > 0 ? [{ label: `− Lifetime Capital Gains Exemption`, val: "− " + fmtC(calc.lcgeExemption), cls: "" }] : []),
                    { label: "= Net Taxable Capital Gain",  val: fmtC(calc.netGain),        cls: "" },
                    { label: `× Inclusion Rate (${fmtPct(calc.inclusionRate,1)})`, val: fmtC(calc.taxableGain), cls: "highlight" },
                    { label: "Federal Income Tax",          val: fmtC(calc.fedTax),         cls: "" },
                    { label: `${prov.name} Provincial Tax`, val: fmtC(calc.provTax),        cls: "" },
                    { label: "Total Capital Gains Tax",     val: fmtC(calc.totalTax),       cls: "total" },
                    { label: "Net Gain After Tax",          val: fmtC(Math.max(0,calc.rawGain-calc.totalTax)), cls: "keeprow" },
                  ].map((r, i) => (
                    <div key={i} className={`bdr ${r.cls}`}>
                      <span className="bdr-lbl">{r.label}</span>
                      <span className="bdr-val">{r.val}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "chart" && (
                <div>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: 12 }}>
                    Tax owed vs. net gain kept across different capital gain amounts. Your gain: {fmtC(calc.rawGain)}.
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={calc.chartData.filter(d => d.gain <= Math.max(calc.rawGain * 1.5, 300000))} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                      <defs>
                        <linearGradient id="taxGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="var(--red2)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--red2)" stopOpacity={0.03} />
                        </linearGradient>
                        <linearGradient id="keepGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="var(--green2)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--green2)" stopOpacity={0.03} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="gain" tick={{ fontSize: 10, fill: "var(--muted)", fontFamily: "var(--font-m)" }} tickFormatter={v => "$" + (v/1000).toFixed(0) + "k"} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "var(--muted)", fontFamily: "var(--font-m)" }} tickFormatter={v => "$" + (v/1000).toFixed(0) + "k"} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      {calc.rawGain > 0 && <ReferenceLine x={calc.rawGain} stroke="var(--amber)" strokeDasharray="5 3" label={{ value: "You", fill: "var(--amber2)", fontSize: 11 }} />}
                      {scenario === "post2024" && entityType === "individual" && <ReferenceLine x={250000} stroke="rgba(217,119,6,0.4)" strokeDasharray="4 4" label={{ value: "$250K", fill: "var(--muted)", fontSize: 10 }} />}
                      <Area type="monotone" dataKey="Tax Owed" stroke="var(--red2)" fill="url(#taxGrad)" strokeWidth={2} dot={false} />
                      <Area type="monotone" dataKey="Net Kept" stroke="var(--green2)" fill="url(#keepGrad)" strokeWidth={2} dot={false} />
                      <Legend wrapperStyle={{ fontFamily: "var(--font-b)", fontSize: 12, color: "var(--muted2)" }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            CONTENT SECTIONS
        ══════════════════════════════════════════ */}
        <div className="content-area">

          {/* ── What is Capital Gains Tax ── */}
          <section className="csection" id="what-is">
            <div className="sec-badge">The Basics</div>
            <h2 className="sec-title">Capital Gains Tax Canada — <em>How It Works</em></h2>
            <p className="sec-lead">
              Canada does not have a standalone capital gains tax. Instead, a portion of your capital gain
              is added to your regular income and taxed at your marginal income tax rate. Understanding
              the inclusion rate is the key to understanding how to calculate capital gains tax in Canada.
            </p>
            <div className="two-col">
              <div className="cbody">
                <p>
                  A <strong>capital gain</strong> occurs when you sell a capital property — shares, real estate, cryptocurrency, or other investments — for more than its <strong>adjusted cost base (ACB)</strong>. The ACB is your original purchase price plus any additional costs incurred to acquire the asset (commissions, legal fees, capital improvements for real estate). Selling expenses such as real estate commissions and legal fees at sale are also deductible from proceeds before calculating the gain.
                </p>
                <p>
                  Canada does not tax 100% of capital gains. Instead, only a fraction — the <strong>capital gains inclusion rate</strong> — is included in your taxable income. That taxable portion is then taxed at your marginal rate, just like employment income. This is what makes capital gains more tax-efficient than salary income in Canada.
                </p>
                <p>
                  Historically, Canada's capital gains inclusion rate has changed several times. It was 100% before 1972 (no capital gains tax existed), moved to 50% in 1990 when the rate was last changed, briefly reached 75% in 2000 before reverting to 50%. As of the 2024 federal budget, the rate structure changed again — making the current rules more complex than ever.
                </p>
                <h3>The Inclusion Rate Change</h3>
                <p>
                  In the 2024 federal budget (Bill C-69), the government proposed increasing the capital gains inclusion rate for realizations after June 24, 2024. The new structure for individuals:
                </p>
                <p>
                  <span className="pill">50%</span> inclusion on the first <strong>$250,000</strong> of capital gains per year.
                  <br /><span className="pill">66.67%</span> inclusion on capital gains <strong>above $250,000</strong> per year.
                </p>
                <p>
                  For corporations and trusts, the inclusion rate is <span className="pill">66.67%</span> on all capital gains with no threshold. This asymmetry between individuals and corporations has significant planning implications for business owners who were holding investments inside a corporation.
                </p>
              </div>
              <div className="cbody">
                <h3>How to Calculate Capital Gains Tax in Canada</h3>
                <p>
                  The step-by-step calculation for <strong>how to calculate capital gains tax Canada</strong>:
                </p>
                <p>
                  <strong>Step 1:</strong> Calculate the capital gain: Sale Proceeds − ACB − Selling Expenses = Capital Gain.
                </p>
                <p>
                  <strong>Step 2:</strong> Apply any exemptions — principal residence exemption for a home, or lifetime capital gains exemption for qualifying business shares.
                </p>
                <p>
                  <strong>Step 3:</strong> Multiply the remaining gain by the inclusion rate (50% for gains up to $250K for individuals; 66.67% above $250K; or 66.67% flat for corporations).
                </p>
                <p>
                  <strong>Step 4:</strong> Add the taxable capital gain to your other income and calculate tax at your marginal rate — both federal and provincial.
                </p>
                <p>
                  <strong>Step 5:</strong> The resulting combined tax is your capital gains tax owing.
                </p>
                <h3>Capital Gains Rates by Province — Top Combined Rate</h3>
                <p>
                  Because capital gains are taxed at marginal income tax rates, the effective capital gains tax rate differs significantly by province. At the top combined marginal rate in each province (federal + provincial), applied to the taxable portion of the gain:
                </p>
                <div className="tbl-wrap" style={{ marginTop: 12 }}>
                  <table>
                    <thead><tr><th>Province</th><th>Top Marginal</th><th>Effective CGT (50%)</th><th>Effective CGT (66.67%)</th></tr></thead>
                    <tbody>
                      {PROVINCES.sort((a,b) => a.topRate - b.topRate).map(p => (
                        <tr key={p.code}>
                          <td>{p.name}</td>
                          <td className="td-amber">{fmtPct(p.topRate*100,2)}</td>
                          <td>{fmtPct(p.topRate*50,2)}</td>
                          <td className="td-red">{fmtPct(p.topRate*66.67,2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* ── Asset-specific guides ── */}
          <section className="csection" id="asset-types">
            <div className="sec-badge">By Asset Type</div>
            <h2 className="sec-title"><em>Capital Gains Tax</em> by Asset Type</h2>
            <p className="sec-lead">
              The same fundamental capital gains rules apply across most asset types, but important differences exist in exemptions, ACB calculation, and reporting — especially for real estate, cryptocurrency, and business shares.
            </p>
            <div className="three-col">
              {[
                {
                  icon: <TrendingUp size={24} strokeWidth={1.5} />,
                  title: "Stocks & Investments",
                  content: `Capital gains on investments in Canada — including stocks, ETFs, mutual funds, and bonds — are realized when you sell (not while you hold). Your ACB is the average cost of all shares including reinvested distributions. For foreign securities, gains must be reported in Canadian dollars using the Bank of Canada exchange rate on the transaction dates. Capital losses can be used to offset capital gains in the same year, or carried back 3 years / forward indefinitely.`
                },
                {
                  icon: <Building2 size={24} strokeWidth={1.5} />,
                  title: "Capital Gains on Real Estate Canada",
                  content: `Capital gains on real estate in Canada apply to investment properties, rental properties, cottages, and vacation homes. The ACB includes purchase price, legal fees, land transfer taxes, and capital improvements (not repairs). Selling costs (realtor commission, legal fees) reduce proceeds. Depreciation (CCA) claimed during ownership is recaptured as income — separate from the capital gain. Capital gains on real estate Canada can be significant for long-held properties in major markets.`
                },
                {
                  icon: <Home size={24} strokeWidth={1.5} />,
                  title: "Capital Gains Tax on Sale of House Canada",
                  content: `The sale of your principal residence is one of the most valuable exemptions in Canadian tax law. The principal residence exemption (PRE) can eliminate capital gains tax on the sale of house Canada entirely if the property was your principal residence for every year you owned it. The formula is: (Years as principal residence + 1) ÷ Total years owned × Capital gain = Exempt portion. The +1 accounts for the year of purchase. You must report the sale on your T1 even if fully exempt.`
                },
                {
                  icon: <Bitcoin size={24} strokeWidth={1.5} />,
                  title: "Capital Gains on Crypto Canada",
                  content: `The CRA treats cryptocurrency as a commodity, not currency — meaning every crypto transaction (sale, exchange, or using crypto to buy goods) is a taxable event. Capital gains on crypto Canada are calculated using the same inclusion rate rules as other capital property. Your ACB is the CAD value paid per coin at acquisition. Crypto-to-crypto trades (ETH for BTC, for example) are also taxable dispositions — you're deemed to have sold at fair market value. Mining income is generally taxed as business income, not capital gains.`
                },
                {
                  icon: <Briefcase size={24} strokeWidth={1.5} />,
                  title: "Lifetime Capital Gains Exemption",
                  content: `The lifetime capital gains exemption (LCGE) shelters capital gains on qualifying small business corporation (QSBC) shares, qualifying farming property, and qualifying fishing property from tax entirely. The LCGE limit for QSBC shares is $1,016,602 — indexed to inflation annually. A shareholder can receive up to this amount in capital gains completely tax-free, making the LCGE one of the most powerful tax planning tools available to Canadian entrepreneurs. Qualification conditions are complex — the company must be a CCPC with at least 90% of assets used in active business at time of sale.`
                },
                {
                  icon: <Wheat size={24} strokeWidth={1.5} />,
                  title: "Farming & Fishing Property",
                  content: `Qualifying farming and fishing properties have a separate LCGE limit of $1,250,000 — higher than the QSBC limit. The property must have been used principally in a farming or fishing business by you, your spouse, or your parent. Intergenerational transfers of farming and fishing businesses have been subject to significant legislative changes in recent years, with Bill C-208 and its successors attempting to provide more equitable treatment compared to arm's-length sales.`
                },
              ].map(c => (
                <div className="icard" key={c.title}>
                  <span className="icard-icon">{c.icon}</span>
                  <h4>{c.title}</h4>
                  <p>{c.content}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── PRE deep dive ── */}
          <section className="csection" id="principal-residence">
            <div className="sec-badge">Real Estate</div>
            <h2 className="sec-title">Principal Residence Exemption & <em>Capital Gains on Real Estate Canada</em></h2>
            <p className="sec-lead">
              The principal residence exemption (PRE) is the most valuable tax exemption available to most Canadian homeowners. Here is how it works, when it applies partially, and what the 2023 anti-flipping rule means for sellers.
            </p>
            <div className="two-col">
              <div className="cbody">
                <p>
                  Under the PRE, a property qualifies as a principal residence for a year if it was ordinarily inhabited by you, your spouse, or your children at any time during that year. Only one property per family unit can be designated as principal residence per year — meaning a married couple cannot each claim different properties as their principal residence for the same year.
                </p>
                <p>
                  The formula — <strong>(Years Designated + 1) ÷ Total Years Owned × Gain = Exempt Portion</strong> — is applied to determine what fraction of the gain is exempt. The "plus 1" rule is a historical provision that provides relief for buyers who owned two homes simultaneously while transitioning between properties. If the property qualified as principal residence for every year of ownership, the entire gain is exempt.
                </p>
                <p>
                  Since 2016, you must report the sale of your principal residence on your T1 return in Schedule 3, even if the full gain is exempt. Failure to report can result in the CRA denying the exemption. The property designation is made on Form T2091.
                </p>
                <h3>Partial PRE — Cottage and Mixed-Use Properties</h3>
                <p>
                  If you own a cottage that you use as a vacation property but also rent out during parts of the year, the PRE may only partially apply. If you change a property from personal use to income-producing use (or vice versa), a deemed disposition at fair market value may occur. Properties with both personal use and rental history require careful tracking of which years qualify for PRE designation.
                </p>
                <p>
                  A family with both a primary home in Toronto and a cottage in Muskoka can only designate one property as principal residence per year. In practice, most families designate the more valuable property — typically the city home — for the years with the largest accrued gains, and accept the capital gains tax on the other property.
                </p>
              </div>
              <div className="cbody">
                <h3>The Anti-Flipping Rule</h3>
                <p>
                  Effective January 1, 2023, the federal government introduced the <strong>residential property flipping rule</strong>. If you sell a property that you have owned for less than <strong>365 days</strong>, the entire profit is treated as <strong>business income</strong> — not a capital gain — and taxed at 100% (full inclusion). This rule applies even if the property was your principal residence, effectively eliminating the PRE for short-hold sales.
                </p>
                <p>
                  Exceptions apply for certain life events: death of the owner or a related person, a breakdown of a marriage or common-law partnership, threats to personal safety, disability or illness, employment changes requiring a relocation of at least 40km, insolvency, or involuntary disposition (expropriation or destruction).
                </p>
                <h3>Capital Gains on Sale of House Canada — Deemed Dispositions</h3>
                <p>
                  Even if you don't sell your property, several events trigger a <strong>deemed disposition</strong> at fair market value, which can create a capital gain: death of the owner (the estate is deemed to have disposed of all assets at FMV), emigration from Canada (departure tax), transfer to a corporation, and certain trust distributions. Planning around these deemed dispositions — especially for long-held real estate with large embedded gains — is a core estate planning concern.
                </p>
                <h3>Capital Gains Tax Ontario — Real Estate Example</h3>
                <p>
                  Consider an investment property purchased in Ontario in 2010 for $350,000, now worth $980,000. Selling expenses of $35,000 bring net proceeds to $945,000. Capital gain: $945,000 − $350,000 = $595,000. With the inclusion rule: first $250,000 at 50% + next $345,000 at 66.67% = $125,000 + $230,000 = $355,000 taxable gain. At Ontario's top combined rate of 53.53%, the capital gains tax on this property would be approximately $190,000. Using the calculator above with your actual other income will produce a more precise result based on your actual marginal bracket.
                </p>
              </div>
            </div>
          </section>

          {/* ── Planning strategies ── */}
          <section className="csection" id="planning">
            <div className="sec-badge">Tax Planning</div>
            <h2 className="sec-title">Strategies to <em>Reduce Capital Gains Tax</em> in Canada</h2>
            <p className="sec-lead">
              Several legal strategies exist to minimize or defer capital gains tax in Canada. None of these are loopholes — they are provisions explicitly built into the Income Tax Act.
            </p>
            <div className="three-col">
              {[
                {
                  icon: <Hourglass size={24} strokeWidth={1.5} />,
                  title: "Timing Your Disposition",
                  body: "If your capital gain will be close to the $250,000 threshold, timing matters. Spreading a gain across two calendar years — by making a sale at year-end and a second in January — can keep each year under $250K, preserving the lower 50% inclusion rate on both. For large gains, installment sale agreements (if legally available for the asset) can spread proceeds over multiple years."
                },
                {
                  icon: <TrendingDown size={24} strokeWidth={1.5} />,
                  title: "Capital Loss Harvesting",
                  body: "Capital losses can offset capital gains realized in the same year. Unused losses carry back 3 years and carry forward indefinitely. Strategically triggering losses in underperforming positions to offset gains elsewhere is called tax-loss harvesting. The superficial loss rule (30-day rule) prevents you from claiming a loss if you repurchase the same or identical security within 30 days."
                },
                {
                  icon: <Gift size={24} strokeWidth={1.5} />,
                  title: "Donation of Publicly-Traded Securities",
                  body: "Donating appreciated publicly-traded securities directly to a registered charity eliminates the capital gain entirely (0% inclusion rate on the donated portion) while generating a charitable tax credit on the full FMV. This is significantly more tax-efficient than selling the securities, paying capital gains tax, and donating the after-tax proceeds."
                },
                {
                  icon: <Landmark size={24} strokeWidth={1.5} />,
                  title: "TFSA and RRSP Sheltering",
                  body: "Investments held inside a TFSA or RRSP are sheltered from capital gains tax. TFSA growth and withdrawals are completely tax-free. RRSP gains are tax-deferred until withdrawal, at which point they are taxed as income. Holding high-growth, high-gain assets inside registered accounts rather than non-registered accounts can eliminate capital gains tax over a lifetime of investing."
                },
                {
                  icon: <Users size={24} strokeWidth={1.5} />,
                  title: "Spousal RRSP and Income Splitting",
                  body: "Transferring future capital gains to a lower-income spouse through spousal RRSP contributions or joint asset ownership can reduce the combined family tax on gains. Attribution rules prevent the simple transfer of existing assets between spouses to split income, but forward-planning around future asset contributions is legitimate. Family trusts are another mechanism for distributing capital gains to lower-bracket family members."
                },
                {
                  icon: <Briefcase size={24} strokeWidth={1.5} />,
                  title: "Lifetime Capital Gains Exemption Planning",
                  body: "For business owners, the LCGE on QSBC shares ($1,016,602 in 2024) is the crown jewel of Canadian tax planning. Ensuring a business qualifies — through the two-year holding rule, the 90% active asset test, and the CCPC status — is a years-long planning exercise. Crystallizing the exemption before selling (freezing the gain and issuing new shares at current value) and multiplying the exemption across family members through a family trust can shelter millions in gains from tax."
                },
              ].map(c => (
                <div className="icard" key={c.title}>
                  <span className="icard-icon">{c.icon}</span>
                  <h4>{c.title}</h4>
                  <p style={{ fontSize: "0.82rem", color: "var(--muted2)", lineHeight: 1.65 }}>{c.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="csection" id="faq">
            <div className="sec-badge">FAQ</div>
            <h2 className="sec-title">Frequently Asked <em>Questions</em></h2>
            <div className="alert-box" style={{ marginBottom: 24 }}>
              <strong>Disclaimer:</strong> This calculator provides estimates based on current CRA rates and inclusion rate changes. The inclusion rate increase has had a complex legislative history — always consult a qualified tax professional or the CRA for advice on your specific situation.
            </div>
            <div style={{ maxWidth: 840 }}>
              {[
                {
                  q: "What is the capital gains tax rate in Canada?",
                  a: "Canada does not have a flat capital gains tax rate — capital gains are taxed at your marginal income tax rate applied to the 'inclusion rate' portion of your gain. Individuals pay tax on 50% of capital gains up to $250,000 per year, and 66.67% on gains above $250,000. Corporations and trusts pay on 66.67% of all capital gains. Because both federal and provincial income tax applies, your effective capital gains tax rate depends on your province and total income."
                },
                {
                  q: "What is the capital gains inclusion rate in Canada?",
                  a: "The capital gains inclusion rate is the fraction of a capital gain that must be included in taxable income. Since the 2024 federal budget (effective June 25, 2024), the inclusion rate for individuals is 50% on the first $250,000 of annual capital gains and 66.67% on gains above that threshold. For corporations and trusts, the rate is a flat 66.67% on all capital gains. The rate had been 50% for all taxpayers since 2000 before the 2024 change."
                },
                {
                  q: "Do I pay capital gains tax on the sale of my house in Canada?",
                  a: "If the home was your principal residence for every year you owned it, you generally pay no capital gains tax on the sale — the principal residence exemption (PRE) eliminates the gain entirely. If the property was only your principal residence for some of the years owned (e.g., you rented it out for a period, or it was an investment property that you later moved into), a partial exemption applies. If you sold within 12 months of purchase and it was not due to certain life events, the 2023 anti-flipping rule may reclassify the entire profit as business income. You must still report the sale on your T1 return even if fully exempt."
                },
                {
                  q: "How are capital gains on cryptocurrency taxed in Canada?",
                  a: "The CRA treats cryptocurrency as a commodity (capital property in most cases), not as currency. Capital gains on crypto Canada arise on every taxable disposition — sale for CAD, exchange for another cryptocurrency, or use of crypto to purchase goods or services. Each transaction triggers a capital gain or loss based on the FMV at the time of disposal versus your ACB. Mining, staking rewards, and airdrops are generally treated as business or employment income at FMV when received. The same inclusion rate rules apply: 50% inclusion up to $250K, 66.67% above."
                },
                {
                  q: "What is the lifetime capital gains exemption in Canada?",
                  a: "The lifetime capital gains exemption (LCGE) shields capital gains on qualifying small business corporation (QSBC) shares and qualifying farming and fishing property from tax entirely. The limit is indexed to inflation annually (e.g., $1,016,602 for QSBC shares in 2024). To qualify, QSBC shares must be shares of a Canadian-controlled private corporation (CCPC) where at least 90% of assets are used in active business at sale and in the 24 months preceding sale. The LCGE is a lifetime limit — any portion used in prior years reduces the available exemption in subsequent years."
                },
                {
                  q: "Can capital losses offset capital gains in Canada?",
                  a: "Yes. Capital losses can be applied against capital gains realized in the same taxation year to reduce your net capital gains. If your losses exceed gains in the current year, the net capital loss can be carried back to any of the 3 preceding years (to offset capital gains in those years and receive a tax refund) or carried forward indefinitely to offset future capital gains. Capital losses cannot be applied against other types of income (employment, rental, business) — only against capital gains. Be aware of the superficial loss rule: if you sell a security at a loss and repurchase the same or identical security within 30 days before or after the sale, the loss is denied."
                },
                {
                  q: "How is capital gains tax calculated in Ontario specifically?",
                  a: "Capital gains tax Ontario is calculated the same way as in other provinces, with Ontario's provincial income tax rates applied to the taxable portion of the gain. Ontario's top combined marginal rate is approximately 53.53% (including the Ontario surtax). Applied to a capital gain under $250K at 50% inclusion: effective capital gains tax rate of ~26.77%. Applied to gains above $250K at 66.67% inclusion: effective rate of ~35.69%. Use the calculator above — select Ontario from the province dropdown — to get precise figures based on your income level and gain amount."
                },
                {
                  q: "When do I report and pay capital gains tax in Canada?",
                  a: "Capital gains are reported on Schedule 3 of your T1 individual income tax return, filed by April 30 of the year following the disposition. If you are self-employed, the filing deadline is June 15, but any tax owing is still due April 30. If a significant capital gain creates a large tax balance, you may be required to make quarterly tax installments in subsequent years if your balance owing exceeds $3,000 for two consecutive years. Corporations report capital gains on the T2 corporate return. There is no separate capital gains tax return — everything is reported through the normal income tax process."
                },
              ].map(item => (
                <div key={item.q} className="faq-item">
                  <p className="faq-q">{item.q}</p>
                  <p className="faq-a">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="cta-box">
            <h2>Calculate Your <em>Capital Gains Tax</em></h2>
            <p>Enter your sale details above — see federal tax, provincial tax, and your net gain instantly.</p>
            <button className="cta-btn" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              Calculate My Capital Gains Tax ↑
            </button>
          </div>

          <div className="mt-20 border-t border-stone-100 pt-12">
            <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath="/finance/capital-gains-tax-canada-calculator" />
          </div>

        </div>{/* end content-area */}

        <footer className="footer">
          <p>Capital Gains Tax Canada Calculator · Based on CRA rates and current inclusion rate rules · For estimation only · Not tax advice</p>
          <p style={{ marginTop: 8 }}>
            <a href="#calculator">Calculator</a> · <a href="#what-is">How It Works</a> · <a href="#asset-types">By Asset</a> · <a href="#principal-residence">Real Estate</a> · <a href="#planning">Tax Planning</a> · <a href="#faq">FAQ</a>
          </p>
        </footer>

      </div>
      </div>
    </>
  );
}
