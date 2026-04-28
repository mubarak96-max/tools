"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import { 
  Home, Key, BarChart3, PartyPopper, Star, 
  ClipboardList, Scale, Search, Banknote, ScrollText, 
  MapPin, Info, ArrowRight, Calculator 
} from "lucide-react";

// ─── NSW Transfer Duty (Stamp Duty) 2026 Rates ───────────────────────────────
// Revenue NSW – general transfer duty rates
const NSW_DUTY_BRACKETS = [
  { min: 0,         max: 17000,    base: 0,       rate: 0.0125 },
  { min: 17000,     max: 36000,    base: 212.50,  rate: 0.015  },
  { min: 36000,     max: 97000,    base: 497.50,  rate: 0.0175 },
  { min: 97000,     max: 366000,   base: 1564.00, rate: 0.035  },
  { min: 366000,    max: 625000,   base: 10985.00,rate: 0.045  },
  { min: 625000,    max: 1000000,  base: 22667.50,rate: 0.055  },
  { min: 1000000,   max: 3000000,  base: 43232.50,rate: 0.065  },
  { min: 3000000,   max: Infinity, base: 173232.50,rate:0.07   },
];

// First Home Buyer thresholds (as of 2026)
const FHB_FULL_EXEMPT_EXISTING   = 800000;
const FHB_FULL_EXEMPT_NEW        = 800000;
const FHB_CONCESSION_MAX         = 1000000;

// Foreign buyer surcharge
const FOREIGN_SURCHARGE_RATE = 0.08; // 8% surcharge

// Annual property tax (opt-in for eligible buyers)
const ANNUAL_PROPERTY_TAX_BASE     = 400;   // $ per year base
const ANNUAL_PROPERTY_TAX_RATE     = 0.003; // 0.3% of unimproved land value (approx)
const ANNUAL_PROPERTY_TAX_MAX_INV  = 1500;  // $ base for investors

// LMI (Lenders' Mortgage Insurance) approximate
const lmiEstimate = (price: number, deposit: number) => {
  const lvr = ((price - deposit) / price) * 100;
  if (lvr <= 80) return 0;
  if (lvr <= 85) return (price - deposit) * 0.006;
  if (lvr <= 90) return (price - deposit) * 0.016;
  if (lvr <= 95) return (price - deposit) * 0.032;
  return (price - deposit) * 0.04;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtA = (n: number, d = 0) => {
  if (isNaN(n) || !isFinite(n)) return "A$0";
  return "A$" + Math.abs(n).toLocaleString("en-AU", { minimumFractionDigits: d, maximumFractionDigits: d });
};
const fmtPct = (n: number, d = 2) => (isNaN(n) ? "0" : n.toFixed(d)) + "%";

// Calculate standard duty
const calcDuty = (price: number) => {
  if (price <= 0) return 0;
  for (const b of NSW_DUTY_BRACKETS) {
    if (price > b.min && price <= b.max) {
      return b.base + (price - b.min) * b.rate;
    }
  }
  return 0;
};

// First home buyer duty (concession on $800K–$1M for existing homes)
const calcFHBDuty = (price: number, isNew: boolean) => {
  const threshold = isNew ? FHB_FULL_EXEMPT_NEW : FHB_FULL_EXEMPT_EXISTING;
  if (price <= threshold) return 0; // full exemption
  if (price <= FHB_CONCESSION_MAX) {
    // Sliding concession between $800K and $1M
    const fullDuty = calcDuty(price);
    // Reduction = full duty × (1M - price) / (1M - 800K)
    const reduction = fullDuty * (FHB_CONCESSION_MAX - price) / (FHB_CONCESSION_MAX - threshold);
    return Math.max(0, fullDuty - reduction);
  }
  return calcDuty(price); // no concession above $1M
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1c2a3a", border: "1px solid #2e4055", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#c8d8e8" }}>
      <p style={{ fontWeight: 700, color: "#fff", marginBottom: 4 }}>{label}</p>
      {payload.map((p: any) => <p key={p.name} style={{ color: p.fill || "#94b4c8" }}>{p.name}: {fmtA(p.value)}</p>)}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SydneyStampDutyPage() {
  const [price,         setPrice]         = useState<any>(1000000);
  const [buyerType,     setBuyerType]     = useState("owner"); // owner | fhb | investor
  const [propertyType,  setPropertyType]  = useState("existing"); // existing | new | vacant
  const [isForeign,     setIsForeign]     = useState(false);
  const [deposit,       setDeposit]       = useState<any>(200000);
  const [optPropertyTax,setOptPropertyTax]= useState(false);
  const [activeTab,     setActiveTab]     = useState("summary");

  // ── Core calculation ────────────────────────────────────────────────────
  const calc = useMemo(() => {
    const p = parseFloat(price) || 0;
    const d = parseFloat(deposit) || 0;
    const isFHB = buyerType === "fhb";
    const isNew  = propertyType === "new" || propertyType === "vacant";

    // Transfer duty
    let duty = 0;
    let fhbExempt = false;
    let fhbConcession = false;

    if (isFHB) {
      const threshold = FHB_FULL_EXEMPT_EXISTING;
      if (p <= threshold) { duty = 0; fhbExempt = true; }
      else if (p <= FHB_CONCESSION_MAX) {
        duty = calcFHBDuty(p, isNew);
        fhbConcession = true;
      } else {
        duty = calcDuty(p);
      }
    } else {
      duty = calcDuty(p);
    }

    const standardDuty = calcDuty(p);
    const saving = Math.max(0, standardDuty - duty);

    // Foreign surcharge
    const foreignSurcharge = isForeign ? p * FOREIGN_SURCHARGE_RATE : 0;
    const totalDuty = duty + foreignSurcharge;

    // Other buying costs
    const conveyancing    = 1800;
    const pestBuilding    = propertyType === "existing" ? 700 : 0;
    const titleInsurance  = 400;
    const lmi             = lmiEstimate(p, d);
    const mortgage_reg    = 170;
    const title_search    = 120;
    const miscFees        = conveyancing + pestBuilding + titleInsurance + mortgage_reg + title_search;

    const totalCost = p + totalDuty + miscFees + (d < p * 0.20 ? lmi : 0);
    const lvr = p > 0 ? ((p - d) / p) * 100 : 0;

    // Property tax opt-in (annual)
    const annualPropertyTax = buyerType === "investor"
      ? ANNUAL_PROPERTY_TAX_MAX_INV + p * 0.0011
      : ANNUAL_PROPERTY_TAX_BASE + p * ANNUAL_PROPERTY_TAX_RATE * 0.4; // land value ~40% of total
    // Break-even: years until cumulative annual tax > upfront duty
    const breakEvenYears = annualPropertyTax > 0 ? Math.ceil(duty / annualPropertyTax) : 99;

    // Duty as % of price
    const dutyPct = p > 0 ? (totalDuty / p) * 100 : 0;

    // Comparison chart across price points
    const pricePoints = [500000, 750000, 1000000, 1250000, 1500000, 2000000, 3000000];
    const comparisonData = pricePoints.map(pp => ({
      price: pp >= 1000000 ? `$${(pp/1000000).toFixed(pp % 1000000 === 0 ? 0 : 1)}M` : `$${pp/1000}K`,
      "Standard Duty": Math.round(calcDuty(pp)),
      "FHB Duty": Math.round(calcFHBDuty(pp, false)),
    }));

    return {
      p, d, duty, standardDuty, saving, foreignSurcharge, totalDuty,
      fhbExempt, fhbConcession,
      conveyancing, pestBuilding, titleInsurance, lmi, mortgage_reg, title_search, miscFees,
      totalCost, lvr, annualPropertyTax, breakEvenYears,
      dutyPct, comparisonData,
    };
  }, [price, buyerType, propertyType, isForeign, deposit, optPropertyTax]);

  const isFHB = buyerType === "fhb";

  // Waterfall bar segments
  const totalBarWidth = calc.p + calc.totalDuty + calc.miscFees + (calc.lvr > 80 ? calc.lmi : 0);
  const seg = (v: number) => totalBarWidth > 0 ? (v / totalBarWidth * 100).toFixed(2) + "%" : "0%";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,700&family=Satoshi:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,600,700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --sand:     #f7f2ea;
          --sand2:    #efe8db;
          --sand3:    #e4d9c8;
          --surface:  #fefcf8;
          --ink:      #1a2330;
          --ink2:     #2e3d50;
          --muted:    #8a9aaa;
          --muted2:   #6a7f92;
          --border:   #ddd4c4;
          --border2:  #ccc0ac;
          --ocean:    #0a4d6e;
          --ocean2:   #1470a0;
          --ocean3:   #4aa8d0;
          --ocean-dim:#e4f0f7;
          --ocean-faint:rgba(10,77,110,0.06);
          --coral:    #d4541a;
          --coral2:   #e8742a;
          --coral-dim:#fdf0e8;
          --green:    #1a6e42;
          --green2:   #2a9e60;
          --green-dim:#e8f5ee;
          --gold:     #b8860a;
          --gold-dim: #fef8e8;
          --font-d:   'Playfair Display', Georgia, serif;
          --font-b:   'Satoshi', 'Helvetica Neue', sans-serif;
          --font-m:   'JetBrains Mono', monospace;
          --r:        12px;
          --shadow:   0 2px 8px rgba(26,35,48,0.08);
          --shadow-md:0 6px 28px rgba(26,35,48,0.12);
        }

        html { font-size: 15px; scroll-behavior: smooth; }
        body {
          font-family: var(--font-b);
          background: var(--sand);
          color: var(--ink);
          -webkit-font-smoothing: antialiased;
          line-height: 1.65;
        }

        /* Subtle sun-ray overlay */
        body::before {
          content: '';
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(ellipse 120% 60% at 80% -10%, rgba(212,84,26,0.06) 0%, transparent 60%);
        }

        .wrap { position: relative; z-index: 1; max-width: 1180px; margin: 0 auto; padding: 0 22px; }

        /* ── Hero ── */
        .hero {
          padding: 56px 0 44px;
          border-bottom: 2px solid var(--ink);
          display: grid; grid-template-columns: 1fr auto;
          gap: 20px; align-items: end;
        }
        @media(max-width:700px){ .hero { grid-template-columns: 1fr; } }

        .hero-left {}
        .hero-kicker {
          display: inline-flex; align-items: center; gap: 8px;
          margin-bottom: 14px;
        }
        .badge {
          display: inline-flex; align-items: center;
          background: var(--ocean); color: #fff;
          font-size: 0.66rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; padding: 4px 11px; border-radius: 3px;
          font-family: var(--font-b);
        }
        .badge-coral {
          display: inline-flex; align-items: center;
          background: var(--coral-dim); color: var(--coral);
          border: 1px solid rgba(212,84,26,0.3);
          font-size: 0.66rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; padding: 3px 10px; border-radius: 3px;
          font-family: var(--font-b);
        }
        .hero h1 {
          font-family: var(--font-d);
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          font-weight: 700; line-height: 1.1;
          color: var(--ink); max-width: 760px;
          margin-bottom: 14px; letter-spacing: -0.01em;
        }
        .hero h1 em { color: var(--ocean); font-style: italic; }
        .hero-sub { font-size: 0.97rem; color: var(--ink2); max-width: 560px; line-height: 1.75; }

        /* Hero right — big duty display */
        .hero-duty {
          text-align: right; padding-bottom: 4px;
        }
        @media(max-width:700px){ .hero-duty { text-align: left; padding-top: 16px; } }
        .hero-duty-label { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); font-weight: 700; margin-bottom: 4px; }
        .hero-duty-amount {
          font-family: var(--font-d);
          font-size: clamp(2.8rem, 6vw, 4.5rem);
          font-weight: 700; color: var(--coral); line-height: 1;
          letter-spacing: -0.02em;
        }
        .hero-duty-sub { font-size: 0.78rem; color: var(--muted); margin-top: 5px; }

        /* ── Layout ── */
        .calc-grid {
          display: grid; grid-template-columns: 360px 1fr;
          gap: 24px; padding: 32px 0; align-items: start;
        }
        @media(max-width:960px){ .calc-grid { grid-template-columns: 1fr; } }

        /* ── Input panel ── */
        .input-panel {
          background: var(--surface); border: 1.5px solid var(--border2);
          border-radius: var(--r); box-shadow: var(--shadow);
          position: sticky; top: 20px; overflow: hidden;
        }
        @media(max-width:960px){ .input-panel { position: static; } }

        .panel-cap {
          background: var(--ink); padding: 18px 22px;
        }
        .panel-cap-title { font-family: var(--font-d); font-size: 1rem; color: #fff; font-weight: 600; font-style: italic; }
        .panel-cap-sub   { font-size: 0.7rem; color: rgba(255,255,255,0.4); margin-top: 1px; }
        .panel-body { padding: 20px 22px; }

        /* Buyer type pills */
        .buyer-pills { display: flex; gap: 0; border: 1.5px solid var(--border2); border-radius: 8px; overflow: hidden; margin-bottom: 14px; }
        .buyer-pill {
          flex: 1; padding: 9px 10px; text-align: center;
          font-size: 0.76rem; font-weight: 700;
          border: none; background: transparent; color: var(--muted2);
          cursor: pointer; transition: all 0.13s;
          font-family: var(--font-b); border-right: 1px solid var(--border2);
        }
        .buyer-pill:last-child { border-right: none; }
        .buyer-pill.active { background: var(--ink); color: #fff; }

        /* Property type */
        .prop-pills { display: flex; gap: 6px; margin-bottom: 14px; flex-wrap: wrap; }
        .prop-pill {
          flex: 1; min-width: 80px; padding: 7px 10px; text-align: center;
          font-size: 0.74rem; font-weight: 700; border-radius: 6px;
          border: 1.5px solid var(--border2); background: transparent; color: var(--muted2);
          cursor: pointer; transition: all 0.13s; font-family: var(--font-b);
        }
        .prop-pill.active { border-color: var(--ocean); background: var(--ocean-dim); color: var(--ocean); }

        .slabel {
          font-size: 0.62rem; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--ocean);
          margin: 16px 0 10px; display: flex; align-items: center; gap: 8px;
          font-family: var(--font-b);
        }
        .slabel::after { content: ''; flex: 1; height: 1px; background: var(--border); }
        .slabel:first-child { margin-top: 0; }

        .field { margin-bottom: 12px; }
        .field label {
          display: flex; justify-content: space-between; align-items: baseline;
          font-size: 0.7rem; font-weight: 600; color: var(--muted2);
          text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 5px;
        }
        .field-hint { font-size: 0.68rem; color: var(--muted); font-weight: 400; text-transform: none; }
        .iw {
          display: flex; align-items: center;
          background: var(--sand); border: 1.5px solid var(--border2);
          border-radius: 7px; overflow: hidden; transition: border-color 0.15s;
        }
        .iw:focus-within { border-color: var(--ocean); }
        .ipfx {
          padding: 0 10px; height: 37px; font-size: 0.82rem; color: var(--muted);
          background: var(--sand2); border-right: 1.5px solid var(--border2);
          display: flex; align-items: center; font-family: var(--font-m);
          user-select: none; min-width: 34px; justify-content: center; flex-shrink: 0;
        }
        .iw input {
          flex: 1; border: none; background: transparent;
          padding: 0 11px; height: 37px;
          font-family: var(--font-m); font-size: 0.9rem;
          color: var(--ink); outline: none;
        }
        input[type=range] {
          -webkit-appearance: none; width: 100%; height: 3px;
          background: var(--border2); border-radius: 2px;
          outline: none; margin-top: 8px; cursor: pointer;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 15px; height: 15px;
          border-radius: 50%; background: var(--ocean);
          cursor: pointer; border: 2px solid var(--surface);
          box-shadow: 0 0 0 1.5px var(--ocean);
          transition: transform 0.12s;
        }
        input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.25); }

        .toggle-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 9px 0; border-top: 1px solid var(--border);
          font-size: 0.78rem; color: var(--ink2); font-weight: 500;
        }
        .toggle { position: relative; width: 36px; height: 20px; display: inline-block; cursor: pointer; }
        .toggle input { opacity: 0; width: 0; height: 0; }
        .t-track { position: absolute; inset: 0; background: var(--border2); border-radius: 20px; transition: background 0.2s; }
        .toggle input:checked + .t-track { background: var(--ocean); }
        .t-thumb { position: absolute; top: 3px; left: 3px; width: 14px; height: 14px; background: #fff; border-radius: 50%; transition: transform 0.2s; pointer-events: none; }
        .toggle input:checked ~ .t-thumb { transform: translateX(16px); }

        /* ── Results ── */
        .result-panel { display: flex; flex-direction: column; gap: 18px; }

        /* Waterfall bar */
        .waterfall-card {
          background: var(--surface); border: 1.5px solid var(--border2);
          border-radius: var(--r); box-shadow: var(--shadow-md); padding: 26px;
        }
        .wf-title { font-family: var(--font-d); font-size: 0.95rem; font-weight: 600; color: var(--ink); margin-bottom: 6px; font-style: italic; }
        .wf-sub   { font-size: 0.78rem; color: var(--muted2); margin-bottom: 18px; }

        .waterfall-bar {
          height: 56px; border-radius: 8px; overflow: hidden;
          display: flex; width: 100%; margin-bottom: 16px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.3), var(--shadow);
        }
        .wf-seg { height: 100%; transition: width 0.55s cubic-bezier(0.4,0,0.2,1); display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .wf-seg-label { font-size: 0.68rem; font-weight: 700; color: rgba(255,255,255,0.9); letter-spacing: 0.04em; white-space: nowrap; padding: 0 8px; font-family: var(--font-b); }

        .wf-legend { display: flex; gap: 16px; flex-wrap: wrap; }
        .wf-item { display: flex; align-items: center; gap: 7px; }
        .wf-dot  { width: 10px; height: 10px; border-radius: 2px; flex-shrink: 0; }
        .wf-lbl  { font-size: 0.75rem; color: var(--muted2); font-weight: 600; }
        .wf-item span { display: inline-flex; align-items: center; }
        .wf-val  { font-family: var(--font-m); font-size: 0.8rem; color: var(--ink); font-weight: 600; }
        .wf-pct  { font-size: 0.7rem; color: var(--muted); }

        /* Metrics */
        .metrics-card {
          background: var(--surface); border: 1.5px solid var(--border2);
          border-radius: var(--r); box-shadow: var(--shadow); padding: 22px;
        }
        .card-head {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 18px; flex-wrap: wrap; gap: 10px;
        }
        .card-head-title { font-family: var(--font-d); font-size: 0.98rem; font-weight: 600; color: var(--ink); font-style: italic; }

        .tabs { display: flex; gap: 3px; background: var(--sand2); border: 1.5px solid var(--border2); padding: 3px; border-radius: 8px; }
        .tab {
          flex: 1; padding: 6px 10px; font-size: 0.69rem; font-weight: 700;
          border: none; border-radius: 6px; background: transparent;
          color: var(--muted); cursor: pointer; transition: all 0.12s;
          text-align: center; font-family: var(--font-b);
          text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap;
        }
        .tab.active { background: var(--surface); color: var(--ocean); box-shadow: var(--shadow); border: 1px solid var(--border2); }

        .metrics-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
        @media(max-width:600px){ .metrics-grid { grid-template-columns: 1fr 1fr; } }

        .metric {
          background: var(--sand); border: 1px solid var(--border);
          border-radius: 9px; padding: 13px 14px; transition: border-color 0.15s;
        }
        .metric.hero-m { background: var(--ink); border-color: var(--ink); grid-column: span 3; }
        @media(max-width:600px){ .metric.hero-m { grid-column: span 2; } }
        .m-lbl { font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.09em; font-weight: 700; color: var(--muted); margin-bottom: 5px; }
        .metric.hero-m .m-lbl { color: rgba(255,255,255,0.4); }
        .m-val { font-family: var(--font-d); font-size: 1.5rem; color: var(--ink); line-height: 1; font-weight: 700; }
        .metric.hero-m .m-val { font-size: 2.3rem; color: #fff; }
        .m-sub { font-size: 0.67rem; color: var(--muted); margin-top: 3px; }
        .metric.hero-m .m-sub { color: rgba(255,255,255,0.35); }
        .m-coral  .m-val { color: var(--coral); }
        .m-ocean  .m-val { color: var(--ocean2); }
        .m-green  .m-val { color: var(--green); }
        .m-gold   .m-val { color: var(--gold); }

        /* Cost rows */
        .cr { display: flex; justify-content: space-between; align-items: center; padding: 9px 0; border-bottom: 1px solid var(--border); font-size: 0.84rem; }
        .cr:last-child { border-bottom: none; }
        .cr.total { border-top: 2px solid var(--ink); margin-top: 4px; padding-top: 11px; }
        .cr.total .cr-lbl { font-weight: 700; font-family: var(--font-d); font-size: 0.95rem; font-style: italic; }
        .cr.total .cr-val { color: var(--ocean); font-size: 1.05rem; }
        .cr-lbl { color: var(--ink2); }
        .cr-val { font-family: var(--font-m); font-weight: 600; color: var(--ink); }
        .cr-val.green  { color: var(--green); }
        .cr-val.coral  { color: var(--coral); }
        .cr-val.muted  { color: var(--muted); }

        /* Exemption banner */
        .exempt-banner {
          background: var(--green-dim); border: 1.5px solid rgba(26,110,66,0.25);
          border-radius: 9px; padding: 14px 18px; margin-bottom: 14px;
          display: flex; align-items: center; gap: 12px;
          font-size: 0.85rem; color: var(--green);
        }
        .exempt-icon { font-size: 1.5rem; flex-shrink: 0; display: flex; align-items: center; }

        .info-box {
          background: var(--ocean-faint); border: 1px solid rgba(10,77,110,0.15);
          border-radius: 9px; padding: 13px 16px;
          font-size: 0.81rem; color: var(--ink2); line-height: 1.65; margin-bottom: 14px;
        }
        .info-box strong { color: var(--ocean); }

        .warn-box {
          background: var(--coral-dim); border: 1px solid rgba(212,84,26,0.2);
          border-radius: 9px; padding: 13px 16px;
          font-size: 0.81rem; color: var(--ink2); line-height: 1.65; margin-bottom: 14px;
        }
        .warn-box strong { color: var(--coral); }

        /* ── Content sections ── */
        .csection { padding: 52px 0; border-top: 1px solid var(--border2); }

        .sec-badge {
          display: inline-block; background: var(--ocean-dim); color: var(--ocean2);
          border: 1px solid rgba(10,77,110,0.2);
          font-size: 0.62rem; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; padding: 3px 10px; border-radius: 3px;
          margin-bottom: 10px; font-family: var(--font-b);
        }
        .sec-title { font-family: var(--font-d); font-size: clamp(1.7rem, 3.5vw, 2.5rem); font-weight: 700; color: var(--ink); line-height: 1.18; margin-bottom: 10px; }
        .sec-title em { color: var(--ocean); font-style: italic; }
        .sec-lead { font-size: 0.94rem; color: var(--ink2); line-height: 1.8; max-width: 700px; margin-bottom: 26px; }

        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
        @media(max-width:760px){ .two-col { grid-template-columns: 1fr; } }
        .three-col { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
        @media(max-width:760px){ .three-col { grid-template-columns: 1fr 1fr; } }
        @media(max-width:480px){ .three-col { grid-template-columns: 1fr; } }

        .cbody { font-size: 0.92rem; color: var(--ink2); line-height: 1.82; }
        .cbody p { margin-bottom: 14px; }
        .cbody h3 { font-family: var(--font-d); font-size: 1.18rem; font-weight: 700; color: var(--ink); margin: 24px 0 9px; font-style: italic; }
        .cbody strong { color: var(--ink); font-weight: 600; }
        .cbody .pill {
          display: inline-block; background: var(--ocean-dim); color: var(--ocean);
          font-family: var(--font-m); font-size: 0.78rem; padding: 1px 8px;
          border-radius: 4px; border: 1px solid rgba(10,77,110,0.2); vertical-align: middle;
        }
        .cbody .pill-coral {
          display: inline-block; background: var(--coral-dim); color: var(--coral);
          font-family: var(--font-m); font-size: 0.78rem; padding: 1px 8px;
          border-radius: 4px; border: 1px solid rgba(212,84,26,0.2); vertical-align: middle;
        }

        .icard {
          background: var(--surface); border: 1.5px solid var(--border);
          border-radius: 10px; padding: 20px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .icard:hover { border-color: var(--ocean); transform: translateY(-2px); }
        .icard-icon { font-size: 1.3rem; margin-bottom: 10px; display: flex; align-items: center; color: var(--ocean2); }
        .icard h4 { font-family: var(--font-d); font-size: 1rem; color: var(--ocean); margin-bottom: 7px; font-style: italic; font-weight: 600; }
        .icard p  { font-size: 0.82rem; color: var(--ink2); line-height: 1.65; }

        .tbl-wrap { overflow-x: auto; border: 1px solid var(--border2); border-radius: 10px; margin-top: 16px; }
        table { width: 100%; border-collapse: collapse; font-size: 0.84rem; }
        thead { background: var(--ink); }
        thead th { padding: 10px 14px; text-align: left; color: #fff; font-size: 0.67rem; text-transform: uppercase; letter-spacing: 0.09em; font-weight: 700; }
        tbody tr { border-top: 1px solid var(--border); }
        tbody tr:hover { background: var(--ocean-faint); }
        tbody td { padding: 10px 14px; color: var(--ink2); vertical-align: top; }
        tbody td:first-child { color: var(--ink); font-weight: 600; }
        .td-ocean  { color: var(--ocean2)  !important; font-weight: 700 !important; }
        .td-green  { color: var(--green)   !important; font-weight: 600 !important; }
        .td-coral  { color: var(--coral)   !important; font-weight: 600 !important; }
        .td-gold   { color: var(--gold)    !important; font-weight: 600 !important; }

        .faq-item { border-bottom: 1.5px solid var(--border); padding: 19px 0; }
        .faq-q { font-family: var(--font-d); font-size: 1.05rem; color: var(--ink); margin-bottom: 8px; font-style: italic; font-weight: 600; }
        .faq-a { font-size: 0.86rem; color: var(--ink2); line-height: 1.78; }

        .cta-box {
          background: var(--ink); border-radius: var(--r);
          padding: 44px 36px; text-align: center; margin: 36px 0 56px;
          position: relative; overflow: hidden;
        }
        .cta-box::before {
          content: '';
          position: absolute; top: -60px; right: -60px;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(212,84,26,0.12) 0%, transparent 65%);
          pointer-events: none;
        }
        .cta-box h2 { font-family: var(--font-d); font-size: 2rem; color: #fff; margin-bottom: 10px; font-weight: 700; }
        .cta-box h2 em { color: var(--ocean3); font-style: italic; }
        .cta-box p  { color: rgba(255,255,255,0.45); margin-bottom: 22px; }
        .cta-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 11px 28px; border-radius: 7px;
          background: var(--coral); color: #fff;
          font-weight: 700; font-size: 0.87rem; font-family: var(--font-b);
          border: none; cursor: pointer; transition: all 0.15s;
          text-decoration: none; letter-spacing: 0.03em;
        }
        .cta-btn:hover { background: var(--coral2); }

        .footer {
          border-top: 1px solid var(--border2); padding: 24px 0;
          text-align: center; font-size: 0.74rem; color: var(--muted);
        }
        .footer a { color: var(--muted2); text-decoration: none; }
        .footer a:hover { color: var(--ocean); }

        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .anim { animation: fadeUp 0.45s ease both; }
        .d1 { animation-delay: 0.05s; } .d2 { animation-delay: 0.12s; } .d3 { animation-delay: 0.2s; }

        @media(max-width:600px){
          .hero { padding: 36px 0 30px; }
          .waterfall-card, .metrics-card { padding: 16px; }
          .cta-box { padding: 28px 18px; }
          .hero-duty-amount { font-size: 2.4rem; }
        }
      `}</style>

      <div className="wrap">

        {/* ── HERO ── */}
        <header className="hero anim">
          <div className="hero-left">
            <div className="hero-kicker">
              <span className="badge"><MapPin size={10} className="mr-1" /> NSW · Sydney · 2026</span>
              <span className="badge-coral">Updated Transfer Duty Rates</span>
            </div>
            <h1>Sydney Stamp Duty<br /><em>Calculator NSW</em></h1>
            <p className="hero-sub">
              Instant NSW transfer duty (stamp duty) calculation for any Sydney or New South Wales property — including first home buyer exemptions, foreign buyer surcharge, and the annual property tax opt-in.
            </p>
          </div>
          <div className="hero-duty">
            <div className="hero-duty-label">Transfer Duty</div>
            <div className="hero-duty-amount">{fmtA(calc.totalDuty)}</div>
            <div className="hero-duty-sub">
              On {fmtA(price)} · {fmtPct(calc.dutyPct)} of purchase price
            </div>
          </div>
        </header>

        {/* ── CALCULATOR ── */}
        <div className="calc-grid" id="calculator">

          {/* LEFT: Inputs */}
          <div className="input-panel anim d1">
            <div className="panel-cap">
              <div className="panel-cap-title">Calculate Your Stamp Duty</div>
              <div className="panel-cap-sub">NSW transfer duty — 2026 rates</div>
            </div>
            <div className="panel-body">

              <div className="slabel" style={{ marginTop: 0 }}>Buyer Type</div>
              <div className="buyer-pills">
                {[["fhb", "First Home"],["owner","Owner-Occ."],["investor","Investor"]].map(([v,l]) => (
                  <button key={v} className={`buyer-pill ${buyerType===v?"active":""}`} onClick={() => setBuyerType(v)}>
                    {v === "fhb" ? <Home size={12} className="inline mr-1" /> : 
                     v === "owner" ? <Key size={12} className="inline mr-1" /> : 
                     <BarChart3 size={12} className="inline mr-1" />}
                    {l}
                  </button>
                ))}
              </div>

              <div className="slabel">Property Type</div>
              <div className="prop-pills">
                {[["existing","Established Home"],["new","New Home / Off-Plan"],["vacant","Vacant Land"]].map(([v,l]) => (
                  <button key={v} className={`prop-pill ${propertyType===v?"active":""}`} onClick={() => setPropertyType(v)}>{l}</button>
                ))}
              </div>

              <div className="slabel">Property Details</div>
              <div className="field">
                <label>Purchase Price</label>
                <div className="iw"><span className="ipfx">A$</span>
                  <input type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} />
                </div>
                <input type="range" min="100000" max="5000000" step="10000"
                  value={Math.min(price, 5000000)} onChange={e => setPrice(e.target.value)} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "var(--muted)", marginTop: 3 }}>
                  <span>$100K</span><span>$5M</span>
                </div>
              </div>

              <div className="field">
                <label>Deposit / Savings <span className="field-hint">For LMI estimate</span></label>
                <div className="iw"><span className="ipfx">A$</span>
                  <input type="number" min="0" value={deposit} onChange={e => setDeposit(e.target.value)} />
                </div>
                <input type="range" min="0" max={Math.min(price*0.4||400000,1000000)} step="5000"
                  value={Math.min(deposit,1000000)} onChange={e => setDeposit(e.target.value)} />
                <div style={{ fontSize: "0.7rem", color: calc.lvr > 80 ? "var(--coral)" : "var(--green)", marginTop: 3 }}>
                  LVR: {fmtPct(calc.lvr, 1)} {calc.lvr > 80 ? "— LMI applies" : "— No LMI required"}
                </div>
              </div>

              <div className="toggle-row">
                <span>Foreign Buyer (+8% surcharge)</span>
                <label className="toggle"><input type="checkbox" checked={isForeign} onChange={e => setIsForeign(e.target.checked)} /><div className="t-track"/><div className="t-thumb"/></label>
              </div>
              <div className="toggle-row">
                <span>Opt into Annual Property Tax</span>
                <label className="toggle"><input type="checkbox" checked={optPropertyTax} onChange={e => setOptPropertyTax(e.target.checked)} /><div className="t-track"/><div className="t-thumb"/></label>
              </div>
            </div>
          </div>

          {/* RIGHT: Results */}
          <div className="result-panel">

            {/* FHB exemption banner */}
            {isFHB && calc.fhbExempt && (
              <div className="exempt-banner anim">
                <span className="exempt-icon text-green-600"><PartyPopper size={24} /></span>
                <div>
                  <strong>Full Exemption — No Stamp Duty!</strong>
                  <div style={{ fontSize: "0.8rem", marginTop: 3 }}>
                    As a first home buyer purchasing a property under {fmtA(800000)}, you pay <strong>A$0</strong> in transfer duty. You save {fmtA(calc.standardDuty)}.
                  </div>
                </div>
              </div>
            )}
            {isFHB && calc.fhbConcession && (
              <div className="exempt-banner anim" style={{ background: "var(--gold-dim)", borderColor: "rgba(184,134,10,0.25)", color: "var(--gold)" }}>
                <span className="exempt-icon text-gold-600"><Star size={24} /></span>
                <div>
                  <strong>Partial Concession Applied</strong>
                  <div style={{ fontSize: "0.8rem", marginTop: 3 }}>
                    First home buyer concession saves you {fmtA(calc.saving)}. Reduced duty: {fmtA(calc.duty)} (standard would be {fmtA(calc.standardDuty)}).
                  </div>
                </div>
              </div>
            )}

            {/* Waterfall bar */}
            <div className="waterfall-card anim d2">
              <div className="wf-title">Total Purchase Cost Breakdown</div>
              <div className="wf-sub">{fmtA(calc.totalCost)} all-in cost for {fmtA(price)} property</div>
              <div className="waterfall-bar">
                <div className="wf-seg" style={{ width: seg(price), background: "#0a4d6e" }}>
                  {(price / (calc.totalCost||1) * 100) > 10 && <span className="wf-seg-label">Property Price</span>}
                </div>
                <div className="wf-seg" style={{ width: seg(calc.totalDuty), background: "#d4541a" }}>
                  {(calc.totalDuty / (calc.totalCost||1) * 100) > 4 && <span className="wf-seg-label">Stamp Duty</span>}
                </div>
                <div className="wf-seg" style={{ width: seg(calc.lmi), background: "#b8860a" }}>
                  {(calc.lmi / (calc.totalCost||1) * 100) > 2 && <span className="wf-seg-label">LMI</span>}
                </div>
                <div className="wf-seg" style={{ width: seg(calc.miscFees), background: "#2a9e60" }}>
                  {(calc.miscFees / (calc.totalCost||1) * 100) > 1.5 && <span className="wf-seg-label">Fees</span>}
                </div>
              </div>
              <div className="wf-legend">
                {[
                  { color: "#0a4d6e", label: "Property Price", val: fmtA(price),          pct: price/(calc.totalCost||1)*100 },
                  { color: "#d4541a", label: "Transfer Duty",  val: fmtA(calc.totalDuty), pct: calc.totalDuty/(calc.totalCost||1)*100 },
                  { color: "#b8860a", label: "LMI",            val: fmtA(calc.lmi),        pct: calc.lmi/(calc.totalCost||1)*100 },
                  { color: "#2a9e60", label: "Legal & Fees",   val: fmtA(calc.miscFees),   pct: calc.miscFees/(calc.totalCost||1)*100 },
                ].map(l => (
                  <div className="wf-item" key={l.label}>
                    <span className="wf-dot" style={{ background: l.color }} />
                    <span className="wf-lbl">{l.label}</span>
                    <span className="wf-val">{l.val}</span>
                    <span className="wf-pct">({l.pct.toFixed(1)}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Main metrics */}
            <div className="metrics-card anim d3">
              <div className="card-head">
                <span className="card-head-title">Transfer Duty Results</span>
                <div className="tabs">
                  {[["summary","Summary"],["breakdown","Breakdown"],["compare","Compare"],["ptax","Property Tax"]].map(([v,l]) => (
                    <button key={v} className={`tab ${activeTab===v?"active":""}`} onClick={() => setActiveTab(v)}>{l}</button>
                  ))}
                </div>
              </div>

              {activeTab === "summary" && (
                <div className="metrics-grid">
                  <div className="metric hero-m">
                    <div className="m-lbl">Transfer Duty (Stamp Duty NSW)</div>
                    <div className="m-val">{fmtA(calc.totalDuty)}</div>
                    <div className="m-sub">
                      {isFHB && calc.fhbExempt ? "Full exemption — $0 duty" :
                       isFHB && calc.fhbConcession ? `Concession applied — saved ${fmtA(calc.saving)}` :
                       `${fmtPct(calc.dutyPct)} of purchase price`}
                    </div>
                  </div>
                  <div className="metric m-coral">
                    <div className="m-lbl">Standard Duty</div>
                    <div className="m-val" style={{ fontSize: "1.2rem" }}>{fmtA(calc.standardDuty)}</div>
                    <div className="m-sub">Before concessions</div>
                  </div>
                  {isFHB && (
                    <div className="metric m-green">
                      <div className="m-lbl">FHB Saving</div>
                      <div className="m-val" style={{ fontSize: "1.2rem" }}>{fmtA(calc.saving)}</div>
                      <div className="m-sub">{calc.fhbExempt ? "Full exemption" : "Concession"}</div>
                    </div>
                  )}
                  {isForeign && (
                    <div className="metric m-coral">
                      <div className="m-lbl">Foreign Surcharge (8%)</div>
                      <div className="m-val" style={{ fontSize: "1.2rem" }}>{fmtA(calc.foreignSurcharge)}</div>
                      <div className="m-sub">On top of standard duty</div>
                    </div>
                  )}
                  {!isFHB && !isForeign && (
                    <div className="metric">
                      <div className="m-lbl">Duty Rate</div>
                      <div className="m-val" style={{ fontSize: "1.2rem" }}>{fmtPct(calc.dutyPct)}</div>
                      <div className="m-sub">Of purchase price</div>
                    </div>
                  )}
                  <div className="metric m-ocean">
                    <div className="m-lbl">Total Upfront (incl. deposit)</div>
                    <div className="m-val" style={{ fontSize: "1.2rem" }}>{fmtA(deposit + calc.totalDuty + calc.miscFees + (calc.lvr > 80 ? calc.lmi : 0))}</div>
                    <div className="m-sub">Cash needed at settlement</div>
                  </div>
                  <div className="metric">
                    <div className="m-lbl">Legal & Conveyancing</div>
                    <div className="m-val" style={{ fontSize: "1.2rem" }}>{fmtA(calc.conveyancing)}</div>
                    <div className="m-sub">Estimate</div>
                  </div>
                  <div className="metric">
                    <div className="m-lbl">LMI Premium</div>
                    <div className="m-val" style={{ fontSize: "1.2rem" }}>{calc.lvr > 80 ? fmtA(calc.lmi) : "Nil"}</div>
                    <div className="m-sub">LVR: {fmtPct(calc.lvr, 1)}</div>
                  </div>
                </div>
              )}

              {activeTab === "breakdown" && (
                <div>
                  <div className="cr"><span className="cr-lbl">Purchase price</span><span className="cr-val">{fmtA(price)}</span></div>
                  <div className="cr"><span className="cr-lbl">Base transfer duty</span><span className="cr-val coral">{fmtA(calc.standardDuty)}</span></div>
                  {isFHB && calc.saving > 0 && (
                    <div className="cr"><span className="cr-lbl">FHB exemption / concession</span><span className="cr-val green">− {fmtA(calc.saving)}</span></div>
                  )}
                  {isForeign && (
                    <div className="cr"><span className="cr-lbl">Foreign buyer surcharge (8%)</span><span className="cr-val coral">+ {fmtA(calc.foreignSurcharge)}</span></div>
                  )}
                  <div className="cr"><span className="cr-lbl"><strong>Total transfer duty</strong></span><span className="cr-val coral"><strong>{fmtA(calc.totalDuty)}</strong></span></div>
                  <div className="cr"><span className="cr-lbl">Conveyancing / solicitor fees</span><span className="cr-val">{fmtA(calc.conveyancing)}</span></div>
                  {propertyType === "existing" && <div className="cr"><span className="cr-lbl">Building & pest inspection</span><span className="cr-val">{fmtA(calc.pestBuilding)}</span></div>}
                  <div className="cr"><span className="cr-lbl">Title insurance</span><span className="cr-val">{fmtA(calc.titleInsurance)}</span></div>
                  <div className="cr"><span className="cr-lbl">Mortgage registration</span><span className="cr-val">{fmtA(calc.mortgage_reg)}</span></div>
                  <div className="cr"><span className="cr-lbl">Title search & certificates</span><span className="cr-val">{fmtA(calc.title_search)}</span></div>
                  {calc.lvr > 80 && <div className="cr"><span className="cr-lbl">LMI premium (est.)</span><span className="cr-val coral">{fmtA(calc.lmi)}</span></div>}
                  <div className="cr total">
                    <span className="cr-lbl">Total buying costs (excl. price)</span>
                    <span className="cr-val">{fmtA(calc.totalDuty + calc.miscFees + (calc.lvr > 80 ? calc.lmi : 0))}</span>
                  </div>
                </div>
              )}

              {activeTab === "compare" && (
                <div>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: 12 }}>
                    Standard duty vs. first home buyer duty across NSW price points.
                  </div>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={calc.comparisonData} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="price" tick={{ fontSize: 10, fontFamily: "var(--font-b)", fill: "var(--muted2)" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fontFamily: "var(--font-m)", fill: "var(--muted)" }} axisLine={false} tickLine={false} tickFormatter={v => "$" + (v/1000).toFixed(0) + "K"} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--ocean-faint)" }} />
                      <Bar dataKey="Standard Duty" fill="var(--coral)" radius={[4,4,0,0]} />
                      <Bar dataKey="FHB Duty" fill="var(--green2)" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: "0.76rem" }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}><span style={{ width: 10, height: 10, borderRadius: 2, background: "var(--coral)", display: "inline-block" }}/> Standard duty</div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}><span style={{ width: 10, height: 10, borderRadius: 2, background: "var(--green2)", display: "inline-block" }}/> First home buyer duty</div>
                  </div>
                </div>
              )}

              {activeTab === "ptax" && (
                <div>
                  <div className="info-box">
                    <strong>NSW Annual Property Tax (opt-in):</strong> Eligible buyers purchasing a property under $1.5M can opt into an annual property tax instead of paying stamp duty upfront. This was introduced in 2023 as part of the NSW government's housing affordability reforms.
                  </div>
                  <div className="cr"><span className="cr-lbl">Upfront stamp duty (standard)</span><span className="cr-val coral">{fmtA(calc.totalDuty)}</span></div>
                  <div className="cr"><span className="cr-lbl">Estimated annual property tax</span><span className="cr-val">{fmtA(calc.annualPropertyTax)}/yr</span></div>
                  <div className="cr"><span className="cr-lbl">Stamp duty break-even</span><span className="cr-val">{calc.breakEvenYears < 50 ? calc.breakEvenYears + " years" : "50+ years"}</span></div>
                  <div style={{ marginTop: 16, background: "var(--sand2)", border: "1px solid var(--border)", borderRadius: 8, padding: "14px 16px", fontSize: "0.8rem", color: "var(--ink2)", lineHeight: 1.65 }}>
                    <strong style={{ display: "block", marginBottom: 6, color: "var(--ink)" }}>When to choose annual property tax:</strong>
                    If you plan to sell within {calc.breakEvenYears < 50 ? calc.breakEvenYears : "many"} years, the annual tax option means you pay less in total. If you plan to hold long-term, paying stamp duty upfront is typically better value. Discuss with your conveyancer before choosing.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ════════════ CONTENT SECTIONS ════════════ */}

        {/* ── What is stamp duty NSW ── */}
        <section className="csection" id="what-is">
          <div className="sec-badge">NSW Transfer Duty</div>
          <h2 className="sec-title">What Is <em>Stamp Duty NSW?</em></h2>
          <p className="sec-lead">
            Stamp duty in NSW — officially called transfer duty — is a state government tax levied on the purchase of property and land. It is one of the largest upfront costs of buying a home in Sydney and across New South Wales, and understanding how it is calculated is essential for any buyer.
          </p>
          <div className="two-col">
            <div className="cbody">
              <p>
                Transfer duty is calculated on the greater of the purchase price or the market value of the property. It is paid by the buyer at or shortly after settlement, and must be paid before the transfer of title can be registered with NSW Land Registry Services. Failure to pay on time attracts interest charges from Revenue NSW.
              </p>
              <p>
                The term "stamp duty" is the colloquial name — the tax was literally stamped on documents in earlier centuries to indicate duty had been paid. NSW renamed it "transfer duty" but the terms are used interchangeably. When Sydneysiders search for a <strong>stamp duty calculator NSW</strong>, they are looking for exactly what this tool calculates.
              </p>
              <p>
                NSW transfer duty is one of the most significant property taxes in Australia. On a median Sydney house price of approximately $1.4 million (2026), the stamp duty bill approaches $70,000 — a sum that takes most buyers years to save and dramatically impacts purchasing power, particularly for first-time buyers entering the market.
              </p>
              <h3>How Much Is Stamp Duty in Sydney?</h3>
              <p>
                <strong>How much is stamp duty in Sydney</strong> depends entirely on the purchase price. NSW uses a progressive rate structure — the duty rate increases as the purchase price rises through brackets. At the current rates, buyers can expect to pay approximately:
              </p>
              <p>
                <span className="pill">$500,000 property</span> — approximately $17,990 in duty<br/>
                <span className="pill">$750,000 property</span> — approximately $29,077 in duty<br/>
                <span className="pill">$1,000,000 property</span> — approximately $40,507 in duty<br/>
                <span className="pill">$1,500,000 property</span> — approximately $73,257 in duty<br/>
                <span className="pill">$2,000,000 property</span> — approximately $106,007 in duty
              </p>
              <p>
                Use the <strong>stamp duty calculator NSW 2026</strong> above to get an exact figure for any price point — the calculator uses the current Revenue NSW rate tables.
              </p>
            </div>
            <div className="cbody">
              <h3>NSW Transfer Duty Rate Table 2026</h3>
              <div className="tbl-wrap" style={{ marginTop: 0 }}>
                <table>
                  <thead><tr><th>Property Value</th><th>Duty Payable</th></tr></thead>
                  <tbody>
                    {[
                      ["$0 – $17,000",          "$1.25 for every $100"],
                      ["$17,001 – $36,000",     "$212.50 + $1.50 per $100 over $17,000"],
                      ["$36,001 – $97,000",     "$497.50 + $1.75 per $100 over $36,000"],
                      ["$97,001 – $366,000",    "$1,564 + $3.50 per $100 over $97,000"],
                      ["$366,001 – $625,000",   "$10,985 + $4.50 per $100 over $366,000"],
                      ["$625,001 – $1,000,000", "$22,667.50 + $5.50 per $100 over $625,000"],
                      ["$1,000,001 – $3,000,000","$43,232.50 + $6.50 per $100 over $1,000,000"],
                      ["Over $3,000,000",        "$173,232.50 + $7.00 per $100 over $3,000,000"],
                    ].map(([range, duty]) => (
                      <tr key={range}><td>{range}</td><td className="td-coral">{duty}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 10, lineHeight: 1.6 }}>
                Source: Revenue NSW. Rates current as of 2026. These are general transfer duty rates for residential property. Different rates apply to certain commercial property and business transfers.
              </div>
            </div>
          </div>
        </section>

        {/* ── First home buyer ── */}
        <section className="csection" id="first-home-buyer">
          <div className="sec-badge">First Home Buyer</div>
          <h2 className="sec-title">First Home Buyer <em>Stamp Duty NSW</em> — Full Guide</h2>
          <p className="sec-lead">
            NSW's first home buyer stamp duty exemption and concession is one of the most generous in Australia — saving eligible buyers tens of thousands of dollars. Here is exactly how it works in 2026.
          </p>
          <div className="two-col">
            <div className="cbody">
              <h3>First Home Buyer Assistance Scheme NSW</h3>
              <p>
                The <strong>First Home Buyer Assistance Scheme (FHBAS)</strong> provides either a full exemption or a concessional rate of transfer duty for eligible first home buyers purchasing in NSW. The scheme was significantly expanded in July 2023. Key thresholds:
              </p>
              <p>
                <strong>Full exemption (no stamp duty):</strong> Applies to properties valued at or below <span className="pill">$800,000</span> for both new and existing homes. At the median unit price in many Sydney suburbs, this exemption is transformative — a buyer purchasing an $750,000 unit pays $0 in stamp duty rather than approximately $29,000.
              </p>
              <p>
                <strong>Concessional rate:</strong> For properties valued between $800,001 and $1,000,000, a sliding concession applies. The concession reduces linearly from full exemption at $800,000 to nil at $1,000,000. A property at $900,000, for example, attracts approximately 50% of the standard duty rate.
              </p>
              <p>
                <strong>No concession above $1,000,000:</strong> Properties valued at $1,000,000 or more attract standard transfer duty with no first home buyer benefit. At this level, buyers pay the full rate — over $40,000 for a $1 million property.
              </p>
              <h3>Eligibility Requirements</h3>
              <p>
                To qualify for the first home buyer stamp duty exemption NSW, all buyers on the contract must:
              </p>
              <p>
                Be an Australian citizen or permanent resident. Be aged 18 or over. Never have previously owned or co-owned residential property in Australia. Never have previously received a first home buyer grant or duty concession in any Australian state or territory. Intend to move into the property as your principal place of residence within 12 months of settlement and live there for a continuous period of at least 6 months.
              </p>
            </div>
            <div className="cbody">
              <h3>First Home Owner Grant (FHOG) NSW</h3>
              <p>
                Separately from stamp duty concessions, first home buyers purchasing or building a brand new home may be eligible for the First Home Owner Grant — a one-off payment of <strong>$10,000</strong> toward the purchase or construction of a new home valued at or under $600,000 (or total value of land and build up to $750,000 for new constructions).
              </p>
              <p>
                The FHOG and the FHBAS stamp duty concession are separate benefits and can both be received simultaneously where eligible. Apply for both through your conveyancer at settlement or directly through Revenue NSW.
              </p>
              <h3>First Home Buyers and Vacant Land</h3>
              <p>
                First home buyers purchasing vacant land to build a first home may be eligible for transfer duty exemption on land valued up to $400,000, or a concessional rate on land between $400,001 and $500,000. The concession requires that a new home be built on the land and become the buyer's principal place of residence.
              </p>
              <h3>Stamp Duty Exemption NSW — Common Mistakes</h3>
              <p>
                The most common disqualifying mistakes: having a former spouse or partner on the contract who has previously owned property (even decades ago in another state); purchasing an investment property as your "first" property before your actual first home; purchasing in a company or trust name; and failing to move in within 12 months of settlement. All buyers on the contract must individually satisfy every eligibility criterion.
              </p>
            </div>
          </div>
        </section>

        {/* ── Foreign buyer surcharge ── */}
        <section className="csection" id="foreign-buyer">
          <div className="sec-badge">Foreign Buyers</div>
          <h2 className="sec-title"><em>Foreign Buyer Stamp Duty NSW</em> — 8% Surcharge</h2>
          <p className="sec-lead">
            Foreign buyers purchasing residential property in NSW must pay an 8% surcharge purchaser duty on top of standard transfer duty — one of the highest foreign buyer surcharges in the world.
          </p>
          <div className="two-col">
            <div className="cbody">
              <p>
                Since July 2023, the NSW foreign buyer surcharge was raised from 8% to 9% for a brief period before being adjusted back. As of 2026, the <strong>foreign buyer stamp duty NSW</strong> surcharge is <strong>8% of the purchase price</strong>, paid in addition to standard transfer duty. On a $1.5 million property, this adds $120,000 to an already significant stamp duty bill.
              </p>
              <p>
                A "foreign person" for NSW duty purposes includes: a non-Australian citizen, a non-permanent resident, a foreign corporation, and certain trusts where foreign persons have a substantial interest. Australian citizens living abroad are generally not considered foreign persons for this purpose — citizenship, not residency, is the key test for individuals.
              </p>
              <p>
                Temporary residents (holders of temporary visas) are foreign persons and subject to the surcharge on residential property. This catches many skilled migrant workers on 457/482 visas who purchase a home in Sydney during their working years. The surcharge applies to the purchase price of the property, not just the residential component.
              </p>
              <h3>Surcharge Land Tax</h3>
              <p>
                Foreign buyers who hold residential land in NSW also face an annual <strong>surcharge land tax</strong> of 4% of the taxable land value, in addition to the standard land tax. This makes long-term investment property holding by foreign persons particularly expensive in NSW compared to other jurisdictions. The surcharge land tax cannot be offset against rental income for tax purposes.
              </p>
            </div>
            <div className="cbody">
              <h3>Exemptions from the Foreign Buyer Surcharge</h3>
              <p>
                Certain foreign buyers may be exempt from or entitled to a refund of the surcharge:
              </p>
              <p>
                <strong>New Zealand citizens</strong> holding a Special Category Visa (SCV) are treated as Australian residents for property duty purposes and are not subject to the foreign buyer surcharge.
              </p>
              <p>
                <strong>Former foreign persons</strong> who become Australian permanent residents or citizens after purchase may be entitled to a refund of the surcharge, provided they apply within a specified period and meet residency requirements.
              </p>
              <p>
                <strong>Tax treaty provisions:</strong> Some bilateral tax treaties between Australia and foreign countries may affect the application of the surcharge. German and New Zealand citizens have specific exemptions. Consult a specialist property tax advisor if you hold citizenship or strong ties to a country with an Australian tax treaty.
              </p>
              <p>
                <strong>Foreign Investment Review Board (FIRB) approval</strong> does not exempt buyers from the surcharge — these are separate regulatory systems. FIRB approval allows the purchase; the surcharge is still payable.
              </p>
            </div>
          </div>
        </section>

        {/* ── Property tax opt-in ── */}
        <section className="csection" id="property-tax">
          <div className="sec-badge">NSW Property Tax Reform</div>
          <h2 className="sec-title">Annual Property Tax NSW — <em>The New Opt-In Option</em></h2>
          <p className="sec-lead">
            Since January 2023, eligible NSW buyers have had the option to pay an annual property tax instead of upfront stamp duty. This is a significant structural reform that changes the economics of home ownership for some buyers.
          </p>
          <div className="two-col">
            <div className="cbody">
              <p>
                The annual property tax is available to buyers of properties valued under <strong>$1.5 million</strong> who are purchasing their principal place of residence (owner-occupiers) or an investment property. The annual tax rate differs for each:
              </p>
              <p>
                <strong>Owner-occupiers:</strong> $400 per year + 0.3% of the unimproved land value of the property.
              </p>
              <p>
                <strong>Investors:</strong> $1,500 per year + 1.1% of the unimproved land value.
              </p>
              <p>
                The unimproved land value is the Valuer General's assessed value of the land only — not the total property value including the building. For a typical Sydney house, the land value might represent 40–60% of the total purchase price. The annual tax is indexed to CPI, so it increases over time.
              </p>
              <h3>Is the Property Tax Option Worth It?</h3>
              <p>
                The break-even analysis depends on your holding period. If you plan to sell within a relatively short window (typically 7–15 years depending on the property and price), the annual property tax option means you pay less in total tax over the ownership period than if you paid upfront stamp duty.
              </p>
              <p>
                If you plan to hold the property long-term (20+ years), paying stamp duty upfront is almost always better value — the cumulative annual tax payments eventually exceed the one-time stamp duty cost, and then continue indefinitely. The "Property Tax" tab in the calculator above shows the break-even year for your specific purchase.
              </p>
            </div>
            <div className="cbody">
              <h3>Key Conditions for the Annual Property Tax</h3>
              <p>
                The opt-in decision is made at purchase and is binding for that property and that buyer. You cannot switch back to stamp duty after choosing the annual tax option. If you sell the property, the new buyer can choose either option independently — the choice does not transfer with the property.
              </p>
              <p>
                For first home buyers below the $800,000 threshold, the annual property tax option is largely irrelevant — full stamp duty exemption is clearly superior (paying $0 beats paying annual property tax every year). For buyers between $800,000 and $1,000,000 receiving a partial concession, the comparison becomes more nuanced and depends on individual circumstances.
              </p>
              <p>
                <strong>Important:</strong> First home buyers who choose the annual property tax option do not receive the first home buyer stamp duty exemption — these benefits cannot be combined. If you are eligible for a full stamp duty exemption, you should not choose the annual property tax option.
              </p>
              <p>
                The annual property tax option was introduced to improve housing affordability by lowering the barrier to entry — the cash required at settlement. For buyers who are cash-constrained and confident they will not hold long-term, it provides a genuine financial advantage. For long-term holders and those with sufficient deposit savings, standard stamp duty remains the better financial choice.
              </p>
            </div>
          </div>
        </section>

        {/* ── Buying costs guide ── */}
        <section className="csection" id="buying-costs">
          <div className="sec-badge">Complete Cost Guide</div>
          <h2 className="sec-title">All the Costs of <em>Buying Property in Sydney</em></h2>
          <p className="sec-lead">
            Stamp duty is the largest additional cost but far from the only one. Here is a complete breakdown of every cost a Sydney buyer faces — so your budget reflects reality before you sign anything.
          </p>
          <div className="three-col">
            {[
              {
                icon: <ClipboardList size={20} />,
                title: "Transfer Duty (Stamp Duty)",
                body: "The largest non-price cost. Calculated on purchase price using NSW progressive rates. Due within 3 months of settlement (or at settlement if using mortgage finance). Cannot be added to your mortgage — must come from savings. First home buyers under $800K pay $0. Use the stamp duty calculator NSW above for your exact figure."
              },
              {
                icon: <Scale size={20} />,
                title: "Conveyancing / Legal Fees",
                body: "A solicitor or licensed conveyancer handles title searches, contract review, settlement, and title transfer. Typically $1,500–$2,500 in Sydney depending on complexity. Fixed-fee conveyancers offer cost certainty. Do not use the cheapest option available — errors in conveyancing can cost far more than the saving."
              },
              {
                icon: <Search size={20} />,
                title: "Building & Pest Inspection",
                body: "Essential for any existing property — $400–$700 for a combined inspection by a licensed inspector. Reveals structural issues, pest damage, safety hazards, and moisture. Never waive this in a hot market. Auction bidders should arrange pre-auction inspections — conditions cannot be added to auction contracts."
              },
              {
                icon: <Banknote size={20} />,
                title: "Lenders' Mortgage Insurance (LMI)",
                body: "Required when your deposit is less than 20% of the purchase price (LVR > 80%). The premium is calculated on the loan amount and can range from 0.6% to 4%+ depending on LVR. LMI protects the lender, not you. It can often be capitalised into the loan. A 10% deposit on a $900,000 property might attract $12,000–$18,000 in LMI."
              },
              {
                icon: <ScrollText size={20} />,
                title: "Strata Search & Other Searches",
                body: "For apartments and townhouses, a strata report ($200–$400) reveals the financial health of the owners corporation, any planned levies, ongoing disputes, and building defects. Your conveyancer will order standard property searches (title, zoning, drainage) for $200–$500. A Section 10.7 planning certificate ($53 from council) reveals development controls."
              },
              {
                icon: <Home size={20} />,
                title: "Immediate Move-In Costs",
                body: "Budget 1–2% of the purchase price for immediate costs after settlement: moving ($1,500–$4,000), utility connections, minor repairs, paint, blinds, appliances for unfurnished properties. First-time buyers consistently underestimate these costs. Sydney's older housing stock often has maintenance deferred, making a building inspection even more critical."
              },
            ].map(c => (
              <div className="icard" key={c.title}>
                <span className="icard-icon">{c.icon}</span>
                <h4>{c.title}</h4>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Compare all states ── */}
        <section className="csection" id="compare">
          <div className="sec-badge">Australia Comparison</div>
          <h2 className="sec-title">Stamp Duty Australia — <em>State by State Comparison</em></h2>
          <p className="sec-lead">
            NSW stamp duty rates are among the highest in Australia. Here's how transfer duty compares across states on a $1,000,000 property, including first home buyer concessions.
          </p>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>State / Territory</th>
                  <th>Duty on $750K</th>
                  <th>Duty on $1M</th>
                  <th>Duty on $1.5M</th>
                  <th>FHB Threshold</th>
                  <th>Foreign Surcharge</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["NSW (Sydney)",    "$29,077", "$40,507", "$73,257", "$800K (full exempt)", "8%"],
                  ["VIC (Melbourne)", "$40,070", "$55,000", "$95,500", "$600K (full exempt)", "8%"],
                  ["QLD (Brisbane)",  "$21,850", "$32,850", "$63,100", "$700K (full exempt)", "8%"],
                  ["WA (Perth)",      "$26,730", "$37,135", "$60,985", "$430K (full exempt)", "7%"],
                  ["SA (Adelaide)",   "$26,830", "$37,455", "$62,455", "$650K (various)",     "7%"],
                  ["ACT (Canberra)",  "~$23,000","~$34,000","~$62,000","~$1M (home buyer conc.)", "N/A"],
                  ["TAS (Hobart)",    "$28,945", "$41,680", "$72,680", "$600K (50% conc.)",   "N/A"],
                  ["NT (Darwin)",     "$23,730", "$34,730", "$62,230", "Various grants",       "N/A"],
                ].map(r => (
                  <tr key={r[0]}>
                    <td>{r[0]}</td>
                    <td className="td-coral">{r[1]}</td>
                    <td className="td-coral">{r[2]}</td>
                    <td className="td-coral">{r[3]}</td>
                    <td className="td-green">{r[4]}</td>
                    <td className="td-gold">{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: "0.76rem", color: "var(--muted)", marginTop: 10 }}>Figures are approximate. Stamp duty calculations are complex and vary by property type, buyer status, and concessions. Always use a state-specific calculator for precise figures. This stamp duty calculator Australia comparison is for general guidance only.</div>
        </section>

        {/* ── FAQ ── */}
        <section className="csection" id="faq">
          <div className="sec-badge">FAQ</div>
          <h2 className="sec-title">Frequently Asked <em>Questions</em></h2>
          <div style={{ maxWidth: 840 }}>
            {[
              {
                q: "How much stamp duty do I pay on a $1 million property in NSW?",
                a: "On a $1,000,000 property in NSW, the standard transfer duty is $43,232.50 — calculated as $22,667.50 (duty on the first $625,000) plus $20,625 (5.5% on the $375,000 between $625,001 and $1,000,000). This equals $43,232.50. If you are a first home buyer, there is no exemption or concession at $1,000,000 — the concession only applies below $1,000,000. The stamp duty calculator NSW above provides exact figures for any price."
              },
              {
                q: "Do first home buyers pay stamp duty in NSW?",
                a: "First home buyers in NSW pay no stamp duty on properties valued at or below $800,000 — this is a full exemption under the First Home Buyer Assistance Scheme (FHBAS). For properties between $800,001 and $1,000,000, a sliding concession reduces the duty compared to the standard rate. Above $1,000,000, there is no first home buyer stamp duty concession in NSW and the full standard rate applies. All buyers on the contract must individually meet the eligibility requirements including never having previously owned residential property in Australia."
              },
              {
                q: "When do I pay stamp duty in NSW?",
                a: "Transfer duty in NSW must be paid within 3 months of the date of the contract for the purchase of property (or within 3 months of when the duty liability arises). In practice, if you are using mortgage finance, the lender typically requires duty to be paid at or before settlement. If purchasing at auction, the settlement date (typically 42 days after the auction) determines the payment deadline. You cannot register the transfer of title at NSW Land Registry Services until duty has been assessed and paid."
              },
              {
                q: "What is the foreign buyer stamp duty surcharge in NSW?",
                a: "Foreign buyers purchasing residential property in NSW pay an 8% surcharge purchaser duty on the purchase price, in addition to the standard transfer duty. On a $1 million property, this adds $80,000 to the standard duty of approximately $43,000 — a total of over $123,000 in duties. 'Foreign person' means a non-Australian citizen or non-permanent resident individual, a foreign corporation, or certain trusts with foreign beneficiaries. New Zealand citizens holding a Special Category Visa are generally exempt from the surcharge."
              },
              {
                q: "Can I add stamp duty to my home loan in NSW?",
                a: "No — you cannot add stamp duty to your mortgage in NSW. Transfer duty must be paid from your own savings at or before settlement. This means that your effective deposit requirement is your actual deposit plus the stamp duty amount plus other closing costs. Many first home buyers underestimate this and find themselves short at settlement. One of the primary benefits of the first home buyer stamp duty exemption is precisely that it reduces this cash requirement significantly — sometimes by $20,000–$40,000."
              },
              {
                q: "What is the annual property tax option in NSW and who should use it?",
                a: "The NSW annual property tax is an opt-in alternative to paying upfront stamp duty, available to buyers of properties under $1.5 million. Owner-occupiers pay $400 per year plus 0.3% of the land value; investors pay $1,500 per year plus 1.1% of the land value. The decision is made at purchase and is binding — you cannot later switch back to having paid stamp duty. Generally, the annual tax is financially better if you plan to sell within approximately 7–15 years (the break-even point). Long-term holders are almost always better off paying stamp duty upfront. First home buyers who qualify for full exemption should never choose the annual property tax option — paying $0 in stamp duty is clearly superior to annual payments."
              },
              {
                q: "How is stamp duty calculated on investment properties in NSW?",
                a: "Stamp duty on investment property NSW is calculated exactly the same way as for owner-occupied property — the same rate table applies regardless of intended use. There are no concessions for investment property purchases (unlike first home buyers). Foreign investors also pay the 8% foreign buyer surcharge. If the property is subsequently rented, the stamp duty paid is not deductible against rental income, but it can be included in the property's cost base for capital gains tax purposes when you eventually sell, reducing the taxable capital gain."
              },
              {
                q: "How do I use this stamp duty calculator for Sydney properties?",
                a: "Enter the purchase price of the Sydney or NSW property you are considering. Select your buyer type — First Home Buyer if eligible, Owner-Occupier for a primary residence, or Investor if renting it out. Select the property type (established home, new home, or vacant land). Toggle the foreign buyer surcharge if applicable. The calculator instantly shows your exact transfer duty under current NSW rates, any first home buyer savings, LMI if your deposit is under 20%, and a complete breakdown of all buying costs. Use the 'Compare' tab to see how duty changes across price points, and the 'Property Tax' tab to evaluate the annual tax opt-in option."
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
          <h2>Calculate Your <em>NSW Stamp Duty</em></h2>
          <p>Enter your purchase price above — get your exact transfer duty, first home buyer savings, and total buying costs.</p>
          <button className="cta-btn" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <Calculator size={18} className="mr-2" /> Calculate Stamp Duty ↑
          </button>
        </div>

        <footer className="footer">
          <p>Sydney Stamp Duty Calculator · NSW Transfer Duty 2026 · Based on Revenue NSW rates · Estimates only · Not legal or financial advice</p>
          <p style={{ marginTop: 8 }}>
            <a href="#calculator">Calculator</a> · <a href="#what-is">NSW Duty Rates</a> · <a href="#first-home-buyer">First Home Buyer</a> · <a href="#foreign-buyer">Foreign Buyers</a> · <a href="#property-tax">Annual Property Tax</a> · <a href="#compare">All States</a> · <a href="#faq">FAQ</a>
          </p>
        </footer>

      </div>
    </>
  );
}
