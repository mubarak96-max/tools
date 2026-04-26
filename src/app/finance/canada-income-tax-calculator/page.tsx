"use client";

import { useState, useMemo } from "react";
import { Building2, Mountain, Wheat, Shield, Waves, Sun, Anchor, Leaf, Palmtree, Snowflake, Landmark, Briefcase, Home, DollarSign, Baby, BookOpen } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from "recharts";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

// ─── 2024 Federal + Provincial Tax Brackets ──────────────────────────────────
// Federal brackets
const FEDERAL_BRACKETS = [
  { min: 0,       max: 55867,   rate: 0.15   },
  { min: 55867,   max: 111733,  rate: 0.205  },
  { min: 111733,  max: 154906,  rate: 0.26   },
  { min: 154906,  max: 220000,  rate: 0.29   },
  { min: 220000,  max: Infinity,rate: 0.33   },
];
const FEDERAL_BASIC_PERSONAL = 15705;

// Provincial brackets
const PROVINCES = {
  ON: {
    name: "Ontario",
    abbr: "ON",
    slug: "income tax calculator ontario",
    brackets: [
      { min: 0,       max: 51446,  rate: 0.0505 },
      { min: 51446,   max: 102894, rate: 0.0915 },
      { min: 102894,  max: 150000, rate: 0.1116 },
      { min: 150000,  max: 220000, rate: 0.1216 },
      { min: 220000,  max: Infinity,rate: 0.1316 },
    ],
    basicPersonal: 11865,
    surtax: true, // Ontario has surtax
    color: "#c0392b",
  },
  BC: {
    name: "British Columbia",
    abbr: "BC",
    slug: "income tax calculator bc",
    brackets: [
      { min: 0,       max: 45654,  rate: 0.0506 },
      { min: 45654,   max: 91310,  rate: 0.077  },
      { min: 91310,   max: 104835, rate: 0.105  },
      { min: 104835,  max: 127299, rate: 0.1229 },
      { min: 127299,  max: 172602, rate: 0.147  },
      { min: 172602,  max: 240716, rate: 0.168  },
      { min: 240716,  max: Infinity,rate: 0.205 },
    ],
    basicPersonal: 11981,
    color: "#2980b9",
  },
  AB: {
    name: "Alberta",
    abbr: "AB",
    slug: "income tax calculator alberta",
    brackets: [
      { min: 0,       max: 148269, rate: 0.10   },
      { min: 148269,  max: 177922, rate: 0.12   },
      { min: 177922,  max: 237230, rate: 0.13   },
      { min: 237230,  max: 355845, rate: 0.14   },
      { min: 355845,  max: Infinity,rate: 0.15  },
    ],
    basicPersonal: 21003,
    color: "#8e44ad",
  },
  QC: {
    name: "Quebec",
    abbr: "QC",
    slug: "income tax calculator quebec",
    brackets: [
      { min: 0,       max: 51780,  rate: 0.14   },
      { min: 51780,   max: 103545, rate: 0.19   },
      { min: 103545,  max: 126000, rate: 0.24   },
      { min: 126000,  max: Infinity,rate: 0.2575},
    ],
    basicPersonal: 17183,
    color: "#16a085",
    qpip: true, // Quebec Parental Insurance Plan instead of EI
  },
  MB: {
    name: "Manitoba",
    abbr: "MB",
    slug: "income tax calculator canada",
    brackets: [
      { min: 0,       max: 47000,  rate: 0.108  },
      { min: 47000,   max: 100000, rate: 0.1275 },
      { min: 100000,  max: Infinity,rate: 0.174 },
    ],
    basicPersonal: 15780,
    color: "#e67e22",
  },
  SK: {
    name: "Saskatchewan",
    abbr: "SK",
    slug: "income tax calculator canada",
    brackets: [
      { min: 0,       max: 49720,  rate: 0.105  },
      { min: 49720,   max: 142058, rate: 0.125  },
      { min: 142058,  max: Infinity,rate: 0.145 },
    ],
    basicPersonal: 17661,
    color: "#d35400",
  },
  NS: {
    name: "Nova Scotia",
    abbr: "NS",
    slug: "income tax calculator canada",
    brackets: [
      { min: 0,       max: 29590,  rate: 0.0879 },
      { min: 29590,   max: 59180,  rate: 0.1495 },
      { min: 59180,   max: 93000,  rate: 0.1667 },
      { min: 93000,   max: 150000, rate: 0.175  },
      { min: 150000,  max: Infinity,rate: 0.21  },
    ],
    basicPersonal: 8481,
    color: "#1abc9c",
  },
  NB: {
    name: "New Brunswick",
    abbr: "NB",
    slug: "income tax calculator canada",
    brackets: [
      { min: 0,       max: 47715,  rate: 0.094  },
      { min: 47715,   max: 95431,  rate: 0.14   },
      { min: 95431,   max: 176756, rate: 0.16   },
      { min: 176756,  max: Infinity,rate: 0.195 },
    ],
    basicPersonal: 12458,
    color: "#f39c12",
  },
  NL: {
    name: "Newfoundland & Labrador",
    abbr: "NL",
    slug: "income tax calculator canada",
    brackets: [
      { min: 0,       max: 43198,  rate: 0.087  },
      { min: 43198,   max: 86395,  rate: 0.145  },
      { min: 86395,   max: 154244, rate: 0.158  },
      { min: 154244,  max: 215943, rate: 0.178  },
      { min: 215943,  max: 275870, rate: 0.198  },
      { min: 275870,  max: 551739, rate: 0.208  },
      { min: 551739,  max: Infinity,rate: 0.218 },
    ],
    basicPersonal: 10818,
    color: "#3498db",
  },
  PE: {
    name: "Prince Edward Island",
    abbr: "PE",
    slug: "income tax calculator canada",
    brackets: [
      { min: 0,       max: 32656,  rate: 0.096  },
      { min: 32656,   max: 64313,  rate: 0.1337 },
      { min: 64313,   max: 105000, rate: 0.167  },
      { min: 105000,  max: 140000, rate: 0.18   },
      { min: 140000,  max: Infinity,rate: 0.1875},
    ],
    basicPersonal: 12000,
    color: "#e74c3c",
  },
  NT: {
    name: "Northwest Territories",
    abbr: "NT",
    slug: "income tax calculator canada",
    brackets: [
      { min: 0,       max: 50597,  rate: 0.059  },
      { min: 50597,   max: 101198, rate: 0.086  },
      { min: 101198,  max: 164525, rate: 0.122  },
      { min: 164525,  max: Infinity,rate: 0.1405},
    ],
    basicPersonal: 16593,
    color: "#2c3e50",
  },
  YT: {
    name: "Yukon",
    abbr: "YT",
    slug: "income tax calculator canada",
    brackets: [
      { min: 0,       max: 55867,  rate: 0.064  },
      { min: 55867,   max: 111733, rate: 0.09   },
      { min: 111733,  max: 500000, rate: 0.109  },
      { min: 500000,  max: Infinity,rate: 0.15  },
    ],
    basicPersonal: 15705,
    color: "#27ae60",
  },
  NU: {
    name: "Nunavut",
    abbr: "NU",
    slug: "income tax calculator canada",
    brackets: [
      { min: 0,       max: 53268,  rate: 0.04   },
      { min: 53268,   max: 106537, rate: 0.07   },
      { min: 106537,  max: 173205, rate: 0.09   },
      { min: 173205,  max: Infinity,rate: 0.115 },
    ],
    basicPersonal: 17925,
    color: "#8e44ad",
  },
};

// ─── CPP ────────────────────────────────────────────────────────────────
const CPP = {
  exemption: 3500,
  maxPensionableEarnings: 68500,
  maxPensionableEarnings2: 73200, // CPP2 ceiling
  rate: 0.0595,
  rate2: 0.04,    // CPP2 rate on earnings between max1 and max2
  maxContribution: (68500 - 3500) * 0.0595, // ~$3,867.50
};

// ─── EI ────────────────────────────────────────────────────────────────
const EI = {
  rate: 0.0166,
  maxInsurableEarnings: 63200,
  maxPremium: 63200 * 0.0166, // ~$1,049.12
  qcRate: 0.0129,             // Quebec rate (lower, QPIP covers parental separately)
  qcMaxPremium: 63200 * 0.0129,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const calcBracketTax = (income: number, brackets: {min: number, max: number, rate: number}[], personalAmount: number) => {
  const taxable = Math.max(0, income - personalAmount);
  let tax = 0;
  for (const b of brackets) {
    if (taxable <= b.min) break;
    tax += (Math.min(taxable, b.max) - b.min) * b.rate;
  }
  return Math.max(0, tax);
};

const fmt = (n: number) => n.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtC = (n: number) => "$" + fmt(Math.abs(n));
const fmtPct = (n: number) => n.toFixed(1) + "%";

const PERIODS = [
  { label: "Annual",     factor: 1    },
  { label: "Monthly",    factor: 12   },
  { label: "Bi-Weekly",  factor: 26   },
  { label: "Weekly",     factor: 52   },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "var(--ink2)", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <p style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.fill || "var(--ink2)" }}>
            {p.name}: {fmtC(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CanadaTaxCalculatorPage() {
  const [income,      setIncome]      = useState<number | string>(85000);
  const [provinceKey, setProvinceKey] = useState<string>("ON");
  const [period,      setPeriod]      = useState<number>(0); // index into PERIODS
  const [selfEmployed,setSelfEmployed]= useState<boolean>(false);
  const [rrsp,        setRrsp]        = useState<number | string>(0);
  const [activeTab,   setActiveTab]   = useState<string>("summary");

  const province = PROVINCES[provinceKey as keyof typeof PROVINCES];

  // ── Core tax calculation ─────────────────────────────────────────────────
  const result = useMemo(() => {
    const gross = typeof income === "string" ? parseFloat(income) : income;
    const finalGross = isNaN(gross) ? 0 : gross;
    const grossVal = finalGross;
    const rrspVal = typeof rrsp === "string" ? parseFloat(rrsp) : rrsp;
    const rrspDeduction = Math.min(isNaN(rrspVal) ? 0 : rrspVal, grossVal * 0.18, 31560); // Current RRSP limit
    const taxableIncome = Math.max(0, grossVal - rrspDeduction);

    // CPP
    const cppBase = selfEmployed
      ? Math.min(Math.max(0, taxableIncome - CPP.exemption), CPP.maxPensionableEarnings - CPP.exemption) * CPP.rate * 2
      : Math.min(Math.max(0, taxableIncome - CPP.exemption), CPP.maxPensionableEarnings - CPP.exemption) * CPP.rate;
    const cpp2 = selfEmployed
      ? Math.min(Math.max(0, taxableIncome - CPP.maxPensionableEarnings), CPP.maxPensionableEarnings2 - CPP.maxPensionableEarnings) * CPP.rate2 * 2
      : Math.min(Math.max(0, taxableIncome - CPP.maxPensionableEarnings), CPP.maxPensionableEarnings2 - CPP.maxPensionableEarnings) * CPP.rate2;
    const cppTotal = cppBase + cpp2;

    // EI
    const eiRate = (province as any).qpip ? EI.qcRate : EI.rate;
    const eiMax  = (province as any).qpip ? EI.qcMaxPremium : EI.maxPremium;
    const eiPremium = selfEmployed ? 0 : Math.min(taxableIncome * eiRate, eiMax);

    // Federal tax
    // CPP & EI deductions reduce federal tax via non-refundable credits
    const cppCredit = (selfEmployed ? cppBase / 2 : cppBase) * 0.15; // federal credit at 15%
    const eiCredit  = eiPremium * 0.15;
    const federalBasic = FEDERAL_BASIC_PERSONAL * 0.15;
    const federalGross = calcBracketTax(taxableIncome, FEDERAL_BRACKETS, 0);
    const federalTax   = Math.max(0, federalGross - federalBasic - cppCredit - eiCredit);

    // Provincial tax
    const provTax = calcBracketTax(taxableIncome, province.brackets, province.basicPersonal);

    // Ontario surtax (simplified)
    let provSurtax = 0;
    if ((province as any).surtax && provTax > 5315) {
      provSurtax += (provTax - 5315) * 0.20;
    }
    if ((province as any).surtax && provTax > 6802) {
      provSurtax += (provTax - 6802) * 0.36;
    }
    const provTotal = provTax + provSurtax;

    const totalTax = federalTax + provTotal;
    const totalDeductions = totalTax + cppTotal + eiPremium;
    const takeHome = Math.max(0, grossVal - totalDeductions);

    const effectiveRate = grossVal > 0 ? (totalTax / grossVal) * 100 : 0;
    const marginalFederal = (() => {
      for (let i = FEDERAL_BRACKETS.length - 1; i >= 0; i--) {
        if (taxableIncome > FEDERAL_BRACKETS[i].min) return FEDERAL_BRACKETS[i].rate * 100;
      }
      return 0;
    })();
    const marginalProvincial = (() => {
      for (let i = province.brackets.length - 1; i >= 0; i--) {
        if (taxableIncome > province.brackets[i].min) return province.brackets[i].rate * 100;
      }
      return 0;
    })();
    const marginalTotal = marginalFederal + marginalProvincial;

    const pf = PERIODS[period].factor;
    return {
      gross: grossVal, taxableIncome, rrspDeduction,
      federalTax, provTax: provTotal,
      cppTotal, eiPremium,
      totalTax, totalDeductions, takeHome,
      effectiveRate, marginalFederal, marginalProvincial, marginalTotal,
      // per period
      grossPer:      grossVal      / pf,
      federalPer:    federalTax / pf,
      provPer:       provTotal  / pf,
      cppPer:        cppTotal   / pf,
      eiPer:         eiPremium  / pf,
      totalTaxPer:   totalTax   / pf,
      takeHomePer:   takeHome   / pf,
      // bar percentages (of gross)
      pctFederal:  grossVal > 0 ? (federalTax / grossVal) * 100 : 0,
      pctProv:     grossVal > 0 ? (provTotal  / grossVal) * 100 : 0,
      pctCpp:      grossVal > 0 ? (cppTotal   / grossVal) * 100 : 0,
      pctEi:       grossVal > 0 ? (eiPremium  / grossVal) * 100 : 0,
      pctTakeHome: grossVal > 0 ? (takeHome   / grossVal) * 100 : 0,
    };
  }, [income, provinceKey, period, selfEmployed, rrsp, province]);

  // comparison chart data (same income across key provinces)
  const comparisonData = useMemo(() => {
    const gross = typeof income === "string" ? parseFloat(income) : income;
    const grossVal = isNaN(gross) ? 0 : gross;
    return ["ON","BC","AB","QC","MB","SK"].map(pk => {
      const prov = PROVINCES[pk as keyof typeof PROVINCES];
      const federal = Math.max(0, calcBracketTax(grossVal, FEDERAL_BRACKETS, 0) - FEDERAL_BASIC_PERSONAL * 0.15);
      const provincial = calcBracketTax(grossVal, prov.brackets, prov.basicPersonal);
      const takeHome = grossVal - federal - provincial;
      return { province: pk, "Federal Tax": Math.round(federal), "Provincial Tax": Math.round(provincial), "Take-Home": Math.round(takeHome), fill: prov.color };
    });
  }, [income]);

  const per = PERIODS[period].label;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Epilogue:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=JetBrains+Mono:wght@400;500&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap');

        /* removed global reset */

        :root {
          --bg:       #f8f7f5;
          --bg2:      #f0eeea;
          --surface:  #ffffff;
          --ink:      #0d1117;
          --ink2:     #374151;
          --muted:    #9ca3af;
          --border:   #e5e2dc;
          --border2:  #d1cdc6;
          --red:      #c0392b;
          --red2:     #e74c3c;
          --red-dim:  #fdf2f1;
          --orange:   #e67e22;
          --teal:     #0d9488;
          --green:    #059669;
          --blue:     #2563eb;
          --font-d:   'Clash Display', 'Epilogue', sans-serif;
          --font-b:   'Epilogue', sans-serif;
          --font-m:   'JetBrains Mono', monospace;
          --r:        12px;
          --shadow:   0 1px 4px rgba(13,17,23,0.07);
          --shadow-md:0 4px 20px rgba(13,17,23,0.10);
        }

        /* removed html reset */
        .canada-tax-container {
          font-family: var(--font-b);
          background: var(--bg);
          color: var(--ink);
          -webkit-font-smoothing: antialiased;
          line-height: 1.6;
          font-size: 15px;
        }

        /* subtle grid texture */
        .canada-tax-container::before {
          content: '';
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(13,17,23,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(13,17,23,0.025) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .wrap { position: relative; z-index: 1; max-width: 1180px; margin: 0 auto; padding: 0 24px; }

        /* ── Hero ── */
        .hero {
          padding: 100px 0 44px;
          border-bottom: 2px solid var(--ink);
        }
        .hero-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; flex-wrap: wrap; margin-bottom: 28px; }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--red); color: #fff;
          font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; padding: 4px 12px; border-radius: 3px;
          margin-bottom: 14px; font-family: var(--font-b);
        }
        .hero h1 {
          font-family: var(--font-d);
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          font-weight: 700; line-height: 1.05;
          color: var(--ink); letter-spacing: -0.02em;
        }
        .hero h1 em { color: var(--red); font-style: normal; }
        .hero-sub {
          font-size: 1rem; color: var(--ink2);
          max-width: 560px; line-height: 1.7; margin-top: 12px;
        }
        .hero-year {
          font-family: var(--font-d); font-size: 5rem; font-weight: 700;
          color: var(--border); line-height: 1; letter-spacing: -0.04em;
          user-select: none;
        }
        @media(max-width:600px){ .hero-year { display: none; } }

        /* province quick-select pills */
        .province-pills { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 20px; }
        .province-pill {
          padding: 5px 12px; border-radius: 3px;
          font-size: 0.76rem; font-weight: 700;
          border: 1.5px solid var(--border2);
          background: transparent; color: var(--ink2);
          cursor: pointer; transition: all 0.12s;
          font-family: var(--font-b); letter-spacing: 0.04em;
        }
        .province-pill.active {
          background: var(--ink); color: #fff; border-color: var(--ink);
        }
        .province-pill:hover:not(.active) { border-color: var(--red); color: var(--red); }

        /* ── Calculator section ── */
        .calc-section { padding: 40px 0; }
        .calc-grid { display: grid; grid-template-columns: 360px 1fr; gap: 24px; align-items: start; }
        @media(max-width:920px){ .calc-grid { grid-template-columns: 1fr; } }

        /* ── Input panel ── */
        .input-panel {
          background: var(--surface); border: 2px solid var(--ink);
          border-radius: var(--r); padding: 28px; position: sticky; top: 24px;
        }
        @media(max-width:920px){ .input-panel { position: static; } }
        .panel-title {
          font-family: var(--font-d); font-size: 0.75rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.12em;
          color: var(--muted); margin-bottom: 20px;
          display: flex; align-items: center; gap: 10px;
        }
        .panel-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }

        .field { margin-bottom: 18px; }
        .field label {
          display: block; font-size: 0.72rem; font-weight: 700;
          color: var(--ink2); text-transform: uppercase;
          letter-spacing: 0.07em; margin-bottom: 6px;
        }
        .iw {
          display: flex; align-items: center;
          background: var(--bg); border: 1.5px solid var(--border2);
          border-radius: 8px; overflow: hidden;
          transition: border-color 0.15s;
        }
        .iw:focus-within { border-color: var(--ink); }
        .ipfx {
          padding: 0 12px; height: 42px;
          font-size: 0.88rem; color: var(--muted);
          background: var(--bg2); border-right: 1.5px solid var(--border2);
          display: flex; align-items: center;
          font-family: var(--font-m); user-select: none;
        }
        .iw input, .iw select {
          flex: 1; border: none; background: transparent;
          padding: 0 12px; height: 42px;
          font-family: var(--font-m); font-size: 0.95rem;
          color: var(--ink); outline: none;
        }
        .iw select { cursor: pointer; }
        input[type=range] {
          -webkit-appearance: none; width: 100%;
          height: 4px; background: var(--border2);
          border-radius: 2px; outline: none; margin-top: 8px; cursor: pointer;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 16px; height: 16px;
          border-radius: 50%; background: var(--red); cursor: pointer;
          border: 2px solid #fff; box-shadow: 0 0 0 1px var(--red);
          transition: transform 0.12s;
        }
        input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.2); }

        .toggle-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 10px 0; border-top: 1px solid var(--border);
          font-size: 0.82rem; color: var(--ink2); font-weight: 500;
        }
        .toggle {
          position: relative; width: 38px; height: 22px;
          display: inline-block; cursor: pointer; flex-shrink: 0;
        }
        .toggle input { opacity: 0; width: 0; height: 0; }
        .t-track {
          position: absolute; inset: 0; background: var(--border2);
          border-radius: 22px; transition: background 0.2s;
        }
        .toggle input:checked + .t-track { background: var(--red); }
        .t-thumb {
          position: absolute; top: 3px; left: 3px;
          width: 16px; height: 16px; background: #fff;
          border-radius: 50%; transition: transform 0.2s; pointer-events: none;
        }
        .toggle input:checked ~ .t-thumb { transform: translateX(16px); }

        /* period tabs */
        .period-tabs { display: flex; gap: 4px; margin-bottom: 18px; }
        .ptab {
          flex: 1; padding: 6px 8px; text-align: center;
          font-size: 0.72rem; font-weight: 700;
          border: 1.5px solid var(--border2); border-radius: 6px;
          background: transparent; color: var(--muted);
          cursor: pointer; transition: all 0.12s;
          font-family: var(--font-b); letter-spacing: 0.04em;
        }
        .ptab.active { background: var(--ink); color: #fff; border-color: var(--ink); }

        /* ── Results panel ── */
        .results-panel { display: flex; flex-direction: column; gap: 16px; }

        /* Income breakdown bar */
        .bar-card {
          background: var(--surface); border: 2px solid var(--ink);
          border-radius: var(--r); padding: 24px;
          animation: fadeUp 0.4s ease both;
        }
        .bar-title {
          font-family: var(--font-d); font-size: 0.72rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted);
          margin-bottom: 16px;
        }
        .breakdown-bar {
          height: 40px; border-radius: 6px; overflow: hidden;
          display: flex; width: 100%; margin-bottom: 16px;
        }
        .bar-seg { height: 100%; transition: width 0.5s cubic-bezier(0.4,0,0.2,1); }
        .bar-legend { display: flex; gap: 16px; flex-wrap: wrap; }
        .legend-item { display: flex; align-items: center; gap: 7px; font-size: 0.78rem; }
        .legend-dot { width: 10px; height: 10px; border-radius: 2px; flex-shrink: 0; }
        .legend-label { color: var(--ink2); font-weight: 500; }
        .legend-val { color: var(--ink); font-family: var(--font-m); font-weight: 600; }

        /* Key metrics */
        .metrics-card {
          background: var(--surface); border: 2px solid var(--ink);
          border-radius: var(--r); padding: 24px;
        }
        .metrics-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 20px; flex-wrap: wrap; gap: 10px;
        }
        .metrics-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; }
        @media(max-width:600px){ .metrics-grid { grid-template-columns: 1fr 1fr; } }

        .metric {
          background: var(--bg); border: 1px solid var(--border);
          border-radius: 9px; padding: 14px 16px;
        }
        .metric.hero-m {
          background: var(--ink); border-color: var(--ink);
          grid-column: span 3;
        }
        @media(max-width:600px){ .metric.hero-m { grid-column: span 2; } }
        .m-lbl { font-size: 0.66rem; text-transform: uppercase; letter-spacing: 0.09em; font-weight: 700; color: var(--muted); margin-bottom: 6px; }
        .metric.hero-m .m-lbl { color: rgba(255,255,255,0.5); }
        .m-val { font-family: var(--font-d); font-size: 1.5rem; font-weight: 700; color: var(--ink); line-height: 1; }
        .metric.hero-m .m-val { font-size: 2.2rem; color: #fff; }
        .m-sub { font-size: 0.7rem; color: var(--muted); margin-top: 4px; }
        .metric.hero-m .m-sub { color: rgba(255,255,255,0.4); }
        .m-red  .m-val { color: var(--red); }
        .m-ora  .m-val { color: var(--orange); }
        .m-teal .m-val { color: var(--teal); }
        .m-grn  .m-val { color: var(--green); }

        /* Tabs */
        .tab-row {
          display: flex; gap: 3px; margin-bottom: 0;
          background: var(--bg2); border: 1.5px solid var(--border2);
          padding: 3px; border-radius: 8px;
        }
        .tab {
          flex: 1; padding: 7px 12px;
          font-size: 0.74rem; font-weight: 700; border: none;
          border-radius: 6px; background: transparent;
          color: var(--muted); cursor: pointer;
          transition: all 0.12s; text-align: center;
          font-family: var(--font-b); letter-spacing: 0.04em; text-transform: uppercase;
        }
        .tab.active { background: var(--surface); color: var(--ink); box-shadow: var(--shadow); }

        /* Bracket table */
        .bracket-card {
          background: var(--surface); border: 2px solid var(--ink);
          border-radius: var(--r); padding: 24px;
        }
        .bkt-row {
          display: grid; grid-template-columns: 1fr 80px 80px 100px;
          gap: 8px; padding: 10px 0;
          border-bottom: 1px solid var(--border);
          font-size: 0.82rem; align-items: center;
        }
        .bkt-row.header {
          font-size: 0.66rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.08em; color: var(--muted); padding-bottom: 8px;
        }
        .bkt-row.active-bracket { background: var(--red-dim); margin: 0 -4px; padding: 10px 4px; border-radius: 6px; }
        .bkt-range { font-family: var(--font-m); color: var(--ink2); font-size: 0.78rem; }
        .bkt-rate  { font-family: var(--font-m); font-weight: 700; color: var(--red); text-align: right; }
        .bkt-tax   { font-family: var(--font-m); color: var(--ink); text-align: right; }
        .bkt-cum   { font-family: var(--font-m); color: var(--muted); text-align: right; font-size: 0.76rem; }

        /* Chart card */
        .chart-card {
          background: var(--surface); border: 2px solid var(--ink);
          border-radius: var(--r); padding: 24px;
        }

        /* ── Content sections ── */
        .content-section { padding: 52px 0; border-top: 2px solid var(--border); }
        .content-section:first-of-type { border-top: 2px solid var(--ink); margin-top: 32px; }

        .sec-badge {
          display: inline-block; background: var(--ink); color: #fff;
          font-size: 0.66rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; padding: 3px 10px; border-radius: 3px;
          margin-bottom: 12px; font-family: var(--font-b);
        }
        .sec-title {
          font-family: var(--font-d);
          font-size: clamp(1.5rem, 3vw, 2.2rem);
          font-weight: 700; color: var(--ink); line-height: 1.15;
          margin-bottom: 10px; letter-spacing: -0.01em;
        }
        .sec-title em { color: var(--red); font-style: normal; }
        .sec-lead { font-size: 0.95rem; color: var(--ink2); line-height: 1.78; max-width: 680px; margin-bottom: 26px; }

        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
        @media(max-width:720px){ .two-col { grid-template-columns: 1fr; } }
        .three-col { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
        @media(max-width:720px){ .three-col { grid-template-columns: 1fr 1fr; } }
        @media(max-width:480px){ .three-col { grid-template-columns: 1fr; } }

        .cbody { font-size: 0.92rem; color: var(--ink2); line-height: 1.82; }
        .cbody p { margin-bottom: 14px; }
        .cbody h3 { font-family: var(--font-d); font-size: 1.15rem; font-weight: 700; color: var(--ink); margin: 24px 0 9px; }
        .cbody strong { color: var(--ink); font-weight: 600; }
        .cbody .formula {
          display: inline-block; background: var(--bg2);
          border: 1px solid var(--border2); border-radius: 5px;
          font-family: var(--font-m); font-size: 0.8rem;
          padding: 2px 9px; color: var(--red); vertical-align: middle;
        }

        .icard {
          background: var(--surface); border: 1.5px solid var(--border);
          border-radius: 10px; padding: 20px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .icard:hover { border-color: var(--ink); transform: translateY(-2px); }
        .icard-icon { font-size: 1.25rem; margin-bottom: 10px; display: block; }
        .icard h4 { font-family: var(--font-d); font-size: 1rem; font-weight: 700; color: var(--ink); margin-bottom: 6px; }
        .icard p  { font-size: 0.82rem; color: var(--ink2); line-height: 1.65; }

        .tbl-wrap { overflow-x: auto; border: 1.5px solid var(--border2); border-radius: 10px; margin-top: 18px; }
        table { width: 100%; border-collapse: collapse; font-size: 0.84rem; }
        thead { background: var(--ink); }
        thead th { padding: 10px 14px; text-align: left; color: #fff; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; }
        tbody tr { border-top: 1px solid var(--border); }
        tbody tr:hover { background: var(--bg); }
        tbody td { padding: 10px 14px; color: var(--ink2); }
        tbody td:first-child { color: var(--ink); font-weight: 600; }
        .td-red { color: var(--red) !important; font-weight: 700 !important; }
        .td-grn { color: var(--green) !important; font-weight: 600 !important; }

        .faq-item { border-bottom: 1.5px solid var(--border); padding: 18px 0; }
        .faq-q { font-family: var(--font-d); font-size: 1rem; font-weight: 700; color: var(--ink); margin-bottom: 8px; }
        .faq-a { font-size: 0.87rem; color: var(--ink2); line-height: 1.78; }

        .cta-box {
          background: var(--ink); border-radius: var(--r);
          padding: 48px 40px; text-align: center; margin: 40px 0 56px;
        }
        .cta-box h2 { font-family: var(--font-d); font-size: 2rem; color: #fff; margin-bottom: 10px; font-weight: 700; letter-spacing: -0.02em; }
        .cta-box p  { color: #6b7280; margin-bottom: 22px; font-size: 0.97rem; }
        .cta-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 12px 28px; border-radius: 6px;
          background: var(--red); color: #fff;
          font-weight: 700; font-size: 0.87rem; text-decoration: none;
          font-family: var(--font-b); border: none; cursor: pointer;
          transition: all 0.15s; letter-spacing: 0.03em;
        }
        .cta-btn:hover { background: var(--red2); }

        .footer {
          border-top: 2px solid var(--border);
          padding: 24px 0; text-align: center;
          font-size: 0.76rem; color: var(--muted);
        }
        .footer a { color: var(--ink2); text-decoration: none; }
        .footer a:hover { color: var(--red); }
        .disclaimer-box {
          background: var(--red-dim); border: 1.5px solid rgba(192,57,43,0.2);
          border-radius: 8px; padding: 12px 16px;
          font-size: 0.8rem; color: var(--ink2); line-height: 1.65;
          margin-bottom: 16px;
        }
        .disclaimer-box strong { color: var(--red); }

        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .anim { animation: fadeUp 0.4s ease both; }
        .d1 { animation-delay: 0.05s; } .d2 { animation-delay: 0.12s; } .d3 { animation-delay: 0.2s; }

        @media(max-width:600px){
          .hero { padding: 80px 0 32px; }
          .bar-card, .metrics-card, .bracket-card, .chart-card { padding: 16px; }
          .breakdown-bar { height: 28px; }
          .cta-box { padding: 32px 20px; }
        }
      `}</style>

      <div className="canada-tax-container">
      <div className="wrap">

        {/* ── HERO ── */}
        <header className="hero anim">
          <div className="hero-top">
            <div>
              <div className="hero-badge">🍁 Current Tax Year</div>
              <h1>Canada <em>Income Tax</em><br />Calculator</h1>
              <p className="hero-sub">
                Federal + provincial tax, CPP, and EI — calculated instantly for all 13 provinces and territories. See your exact take-home pay, effective rate, and bracket breakdown.
              </p>
            </div>
            <div className="hero-year">Current</div>
          </div>

          {/* Province quick-select */}
          <div className="province-pills">
            {Object.entries(PROVINCES).map(([key, prov]) => (
              <button
                key={key}
                className={`province-pill ${provinceKey === key ? "active" : ""}`}
                onClick={() => setProvinceKey(key)}
              >
                {prov.abbr}
              </button>
            ))}
          </div>
        </header>

        {/* ── CALCULATOR ── */}
        <section className="calc-section" id="calculator">
          <div className="calc-grid">

            {/* LEFT: Inputs */}
            <div className="input-panel anim d1">
              <div className="panel-title">Your Details</div>

              <div className="field">
                <label>Province / Territory</label>
                <div className="iw">
                  <select value={provinceKey} onChange={e => setProvinceKey(e.target.value)}>
                    {Object.entries(PROVINCES).map(([key, p]) => (
                      <option key={key} value={key}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field">
                <label>Annual Employment Income</label>
                <div className="iw">
                  <span className="ipfx">CA$</span>
                  <input type="number" min="0" max="2000000" step="1000"
                    value={income} onChange={e => setIncome(e.target.value)} />
                </div>
                <input type="range" min="0" max="300000" step="1000"
                  value={Math.min(typeof income === 'string' ? parseFloat(income) : income, 300000)} onChange={e => setIncome(e.target.value)} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--muted)", marginTop: 4 }}>
                  <span>$0</span><span>$300,000+</span>
                </div>
              </div>

              <div className="field">
                <label>RRSP Contribution (Annual)</label>
                <div className="iw">
                  <span className="ipfx">CA$</span>
                  <input type="number" min="0" max="31560" step="500"
                    value={rrsp} onChange={e => setRrsp(e.target.value)} />
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: 4 }}>2024 max: $31,560 or 18% of prior year income</div>
              </div>

              <div style={{ marginBottom: 18 }}>
                <div className="panel-title" style={{ marginBottom: 10 }}>View Results As</div>
                <div className="period-tabs">
                  {PERIODS.map((p, i) => (
                    <button key={p.label} className={`ptab ${period === i ? "active" : ""}`}
                      onClick={() => setPeriod(i)}>{p.label}</button>
                  ))}
                </div>
              </div>

              <div className="toggle-row">
                <span>Self-Employed (double CPP)</span>
                <label className="toggle">
                  <input type="checkbox" checked={selfEmployed} onChange={e => setSelfEmployed(e.target.checked)} />
                  <div className="t-track" /><div className="t-thumb" />
                </label>
              </div>

              {/* Summary box in panel */}
              <div style={{ marginTop: 20, background: "var(--bg)", border: "1.5px solid var(--border2)", borderRadius: 9, padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: "0.78rem", color: "var(--ink2)", fontWeight: 500 }}>Gross ({per})</span>
                  <span style={{ fontFamily: "var(--font-m)", fontWeight: 700, color: "var(--ink)" }}>{fmtC(result.grossPer)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: "0.78rem", color: "var(--ink2)", fontWeight: 500 }}>Total Tax ({per})</span>
                  <span style={{ fontFamily: "var(--font-m)", fontWeight: 700, color: "var(--red)" }}>{fmtC(result.totalTaxPer)}</span>
                </div>
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--ink)" }}>Take-Home ({per})</span>
                  <span style={{ fontFamily: "var(--font-d)", fontWeight: 700, fontSize: "1.1rem", color: "var(--green)" }}>{fmtC(result.takeHomePer)}</span>
                </div>
              </div>
            </div>

            {/* RIGHT: Results */}
            <div className="results-panel">

              {/* ── Breakdown bar ── */}
              <div className="bar-card anim d2">
                <div className="bar-title">Income Breakdown — {fmtC(result.gross)} Annual</div>
                <div className="breakdown-bar">
                  <div className="bar-seg" style={{ width: result.pctFederal + "%", background: "var(--red)" }} title={"Federal Tax: " + fmtC(result.federalTax)} />
                  <div className="bar-seg" style={{ width: result.pctProv + "%",    background: "var(--orange)" }} title={"Provincial Tax: " + fmtC(result.provTax)} />
                  <div className="bar-seg" style={{ width: result.pctCpp + "%",     background: "var(--teal)" }} title={"CPP: " + fmtC(result.cppTotal)} />
                  <div className="bar-seg" style={{ width: result.pctEi + "%",      background: "#6366f1" }} title={"EI: " + fmtC(result.eiPremium)} />
                  <div className="bar-seg" style={{ width: result.pctTakeHome + "%",background: "var(--green)" }} title={"Take-Home: " + fmtC(result.takeHome)} />
                </div>
                <div className="bar-legend">
                  {[
                    { color: "var(--red)",    label: "Federal Tax",     val: fmtC(result.federalTax), pct: result.pctFederal },
                    { color: "var(--orange)", label: "Provincial Tax",  val: fmtC(result.provTax),    pct: result.pctProv    },
                    { color: "var(--teal)",   label: "CPP",             val: fmtC(result.cppTotal),   pct: result.pctCpp     },
                    { color: "#6366f1",       label: "EI Premium",      val: fmtC(result.eiPremium),  pct: result.pctEi      },
                    { color: "var(--green)",  label: "Take-Home",       val: fmtC(result.takeHome),   pct: result.pctTakeHome},
                  ].map(l => (
                    <div className="legend-item" key={l.label}>
                      <span className="legend-dot" style={{ background: l.color }} />
                      <span className="legend-label">{l.label}</span>
                      <span className="legend-val">{l.val} <span style={{ color: "var(--muted)", fontWeight: 400 }}>({fmtPct(l.pct)})</span></span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Metrics ── */}
              <div className="metrics-card anim d2">
                <div className="metrics-header">
                  <div style={{ fontFamily: "var(--font-d)", fontSize: "0.95rem", fontWeight: 700, color: "var(--ink)" }}>
                    {province.name} · {per} View
                  </div>
                  <div className="tab-row">
                    {[["summary","Summary"],["brackets","Brackets"],["chart","Compare"]].map(([v,l]) => (
                      <button key={v} className={`tab ${activeTab===v?"active":""}`} onClick={() => setActiveTab(v)}>{l}</button>
                    ))}
                  </div>
                </div>

                {activeTab === "summary" && (
                  <div className="metrics-grid">
                    <div className="metric hero-m">
                      <div className="m-lbl">Take-Home Pay — {per}</div>
                      <div className="m-val">{fmtC(result.takeHomePer)}</div>
                      <div className="m-sub">{fmtPct(result.pctTakeHome)} of gross · {fmtC(result.takeHome)} annually</div>
                    </div>
                    <div className="metric m-red">
                      <div className="m-lbl">Federal Tax</div>
                      <div className="m-val" style={{ fontSize: "1.2rem" }}>{fmtC(result.federalPer)}</div>
                      <div className="m-sub">{fmtC(result.federalTax)} / year</div>
                    </div>
                    <div className="metric m-ora">
                      <div className="m-lbl">{province.name} Tax</div>
                      <div className="m-val" style={{ fontSize: "1.2rem" }}>{fmtC(result.provPer)}</div>
                      <div className="m-sub">{fmtC(result.provTax)} / year</div>
                    </div>
                    <div className="metric m-teal">
                      <div className="m-lbl">CPP</div>
                      <div className="m-val" style={{ fontSize: "1.2rem" }}>{fmtC(result.cppPer)}</div>
                      <div className="m-sub">{fmtC(result.cppTotal)} / year</div>
                    </div>
                    <div className="metric">
                      <div className="m-lbl">Effective Rate</div>
                      <div className="m-val" style={{ fontSize: "1.2rem" }}>{fmtPct(result.effectiveRate)}</div>
                      <div className="m-sub">Total tax ÷ gross</div>
                    </div>
                    <div className="metric">
                      <div className="m-lbl">Marginal Rate</div>
                      <div className="m-val" style={{ fontSize: "1.2rem" }}>{fmtPct(result.marginalTotal)}</div>
                      <div className="m-sub">{fmtPct(result.marginalFederal)} fed + {fmtPct(result.marginalProvincial)} prov</div>
                    </div>
                    <div className="metric">
                      <div className="m-lbl">EI Premium</div>
                      <div className="m-val" style={{ fontSize: "1.2rem" }}>{fmtC(result.eiPer)}</div>
                      <div className="m-sub">{fmtC(result.eiPremium)} / year</div>
                    </div>
                    {result.rrspDeduction > 0 && (
                      <div className="metric m-grn" style={{ gridColumn: "span 2" }}>
                        <div className="m-lbl">RRSP Tax Savings</div>
                        <div className="m-val" style={{ fontSize: "1.2rem" }}>{fmtC(result.rrspDeduction * result.marginalTotal / 100)}</div>
                        <div className="m-sub">On ${fmt(result.rrspDeduction)} RRSP contribution at {fmtPct(result.marginalTotal)} marginal rate</div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "brackets" && (
                  <div>
                    <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: 12 }}>
                      Federal brackets applied to taxable income of {fmtC(result.taxableIncome)}. Highlighted = your marginal bracket.
                    </div>
                    <div className="bkt-row header">
                      <span>Bracket</span>
                      <span style={{ textAlign: "right" }}>Rate</span>
                      <span style={{ textAlign: "right" }}>Tax</span>
                      <span style={{ textAlign: "right" }}>Cumulative</span>
                    </div>
                    {(() => {
                      let cum = 0;
                      return FEDERAL_BRACKETS.map((b, i) => {
                        const taxable = Math.max(0, result.taxableIncome - FEDERAL_BASIC_PERSONAL);
                        if (b.min >= taxable) return null;
                        const bracketIncome = Math.min(taxable, b.max) - b.min;
                        const bracketTax = bracketIncome * b.rate;
                        cum += bracketTax;
                        const isMarginal = taxable > b.min && (b.max === Infinity || taxable <= b.max);
                        return (
                          <div key={i} className={`bkt-row ${isMarginal ? "active-bracket" : ""}`}>
                            <span className="bkt-range">
                              ${(b.min).toLocaleString()} – {b.max === Infinity ? "∞" : "$" + b.max.toLocaleString()}
                              {isMarginal && <span style={{ marginLeft: 6, fontSize: "0.68rem", background: "var(--red)", color: "#fff", padding: "1px 5px", borderRadius: 3 }}>YOU</span>}
                            </span>
                            <span className="bkt-rate">{(b.rate * 100).toFixed(1)}%</span>
                            <span className="bkt-tax">{fmtC(bracketTax)}</span>
                            <span className="bkt-cum">{fmtC(cum)}</span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                )}

                {activeTab === "chart" && (
                  <div>
                    <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: 12 }}>
                      Take-home pay at {fmtC(result.gross)} income across major provinces.
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={comparisonData} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis dataKey="province" tick={{ fontSize: 11, fontFamily: "var(--font-b)", fill: "var(--ink2)" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fontFamily: "var(--font-m)", fill: "var(--muted)" }} axisLine={false} tickLine={false} tickFormatter={v => "$" + (v/1000).toFixed(0) + "k"} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(13,17,23,0.03)" }} />
                        <Bar dataKey="Take-Home" radius={[5, 5, 0, 0]} name="Take-Home">
                          {comparisonData.map((d, i) => (
                            <Cell key={i} fill={d.province === provinceKey ? "var(--green)" : "var(--border2)"} />
                          ))}
                        </Bar>
                        <Bar dataKey="Federal Tax" radius={[5, 5, 0, 0]} name="Federal Tax" fill="var(--red)" opacity={0.7} />
                        <Bar dataKey="Provincial Tax" radius={[5, 5, 0, 0]} name="Provincial Tax" fill="var(--orange)" opacity={0.7} />
                      </BarChart>
                    </ResponsiveContainer>
                    <div style={{ fontSize: "0.74rem", color: "var(--muted)", marginTop: 8, textAlign: "center" }}>
                      Green = currently selected province. Tax only — CPP and EI not shown in comparison.
                    </div>
                  </div>
                )}
              </div>

            </div>{/* end results-panel */}
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            CONTENT SECTIONS
        ══════════════════════════════════════════════ */}

        {/* ── How Canadian Income Tax Works ── */}
        <section className="content-section" id="how-it-works">
          <div className="sec-badge">The Basics</div>
          <h2 className="sec-title">How <em>Canadian Income Tax</em> Works</h2>
          <p className="sec-lead">
            Canada uses a progressive federal income tax system layered on top of separate provincial and territorial taxes. Understanding how these interact is essential for accurate paycheck calculation — and for making smart financial decisions around RRSPs, deductions, and employment income.
          </p>
          <div className="two-col">
            <div className="cbody">
              <p>
                Every Canadian resident pays <strong>two layers of income tax</strong>: federal tax administered by the Canada Revenue Agency (CRA), and provincial or territorial tax administered by the province. Both are progressive — meaning higher income is taxed at higher rates — but the brackets, rates, and credits differ significantly between jurisdictions. Quebec is unique in that it administers its own provincial tax through Revenu Québec rather than the CRA.
              </p>
              <p>
                The federal government sets five tax brackets for the current year, starting at 15% on the first $55,867 of taxable income and rising to 33% on income above $220,000. Each province then adds its own tax on top, calculated independently. The combined federal and provincial rate is what Canadians actually pay — which is why a high earner in Nova Scotia (top combined rate ~54%) pays meaningfully more than a comparable earner in Alberta (top combined rate ~48%).
              </p>
              <p>
                Beyond income tax, employed Canadians also contribute to <strong>Canada Pension Plan (CPP)</strong> and <strong>Employment Insurance (EI)</strong>. CPP contributions currently are 5.95% of pensionable earnings between $3,500 (the basic exemption) and $68,500, plus a new CPP2 rate of 4% on earnings between $68,500 and $73,200. EI premiums are 1.66% of insurable earnings up to $63,200. Quebec residents pay lower EI premiums (1.29%) because they participate in the separate Quebec Parental Insurance Plan (QPIP).
              </p>
              <h3>The Marginal Rate vs. the Effective Rate</h3>
              <p>
                One of the most common misunderstandings about Canadian income tax is confusing the <strong>marginal rate</strong> with the <strong>effective rate</strong>. Your marginal rate is the rate that applies to your next dollar of income — it is the highest bracket you have reached. Your effective rate is your total tax as a percentage of your total income. Because Canada's system is progressive, only the income within each bracket is taxed at that bracket's rate.
              </p>
              <p>
                For example, if you earn $90,000 in Ontario currently, your marginal combined rate is approximately 43.41% — but your effective rate is significantly lower (roughly 28–30%), because most of your income was taxed at lower brackets. The <strong>income tax calculator Ontario</strong> above shows both figures separately so you can see the full picture.
              </p>
            </div>
            <div className="cbody">
              <h3>The Basic Personal Amount</h3>
              <p>
                Every Canadian taxpayer is entitled to the federal <strong>Basic Personal Amount (BPA)</strong> — a non-refundable tax credit that effectively makes the first $15,705 (2024) of income tax-free at the federal level. Each province has its own basic personal amount, ranging from $8,481 in Nova Scotia to $21,003 in Alberta.
              </p>
              <p>
                The BPA is not a deduction from income — it is a credit applied against the tax calculated. At the federal level, it reduces your federal tax by $15,705 × 15% = $2,356. This is why, practically speaking, the first ~$15,700 of Canadian income is federal-tax-free.
              </p>
              <h3>CPP and EI Contributions currently</h3>
              <p>
                <strong>CPP contributions</strong> fund your Canada Pension Plan retirement benefit. Currently, you contribute 5.95% of earnings between $3,500 and $68,500 — a maximum employee contribution of approximately $3,867. A new <strong>CPP2</strong> tier introduced currently requires an additional 4% on earnings between $68,500 and $73,200, adding up to $188 in additional contributions at the maximum.
              </p>
              <p>
                Self-employed Canadians pay both the employee and employer share of CPP — effectively doubling their CPP contribution to 11.9% — because they have no employer to match their contribution. The <strong>paycheck calculator Canada</strong> above has a self-employed toggle that reflects this additional cost.
              </p>
              <p>
                <strong>EI premiums</strong> fund the Employment Insurance program that provides income replacement during job loss, illness, maternity, and parental leave. Currently, employees pay 1.66% of insurable earnings up to $63,200. Self-employed individuals can opt into EI for access to special benefits, but they are not automatically enrolled.
              </p>
              <h3>RRSP Deductions and Tax Savings</h3>
              <p>
                The Registered Retirement Savings Plan (RRSP) is Canada's most powerful tax deduction tool. Contributions reduce your taxable income dollar-for-dollar, generating a tax refund at your marginal rate. The 2024 RRSP contribution limit is the lower of $31,560 or 18% of your prior year's earned income. Enter your planned RRSP contribution in the calculator above to see your instant tax savings — typically several thousand dollars for middle and high income earners.
              </p>
            </div>
          </div>
        </section>

        {/* ── Province deep-dives ── */}
        <section className="content-section" id="provinces">
          <div className="sec-badge">By Province</div>
          <h2 className="sec-title">Income Tax by Province — <em>Current Guide</em></h2>
          <p className="sec-lead">
            Provincial income tax rates vary dramatically across Canada. Here is what you need to know about the five most-searched provincial income tax calculators, plus a comparison of all provinces.
          </p>

          {/* Province cards */}
          <div className="three-col" style={{ marginBottom: 36 }}>
            {[
              {
                flag: <Building2 size={24} strokeWidth={1.5} />, name: "Ontario",
                tag: "income tax calculator ontario",
                rate: "5.05–13.16%",
                bpa: "$11,865",
                note: "Ontario has a unique surtax on provincial tax above $5,315 — an extra 20% surtax plus an additional 36% on tax above $6,802. This makes Ontario's effective top provincial rate one of the highest in Canada despite moderate headline rates. Combined top rate with federal: ~53.53%."
              },
              {
                flag: <Mountain size={24} strokeWidth={1.5} />, name: "British Columbia",
                tag: "income tax calculator bc",
                rate: "5.06–20.5%",
                bpa: "$11,981",
                note: "BC has seven tax brackets with a top rate of 20.5% on income over $240,716 — the highest top provincial rate in Canada as of 2024. Combined top rate with federal: ~53.5%. BC has no provincial surtax, and offers competitive rates on middle incomes."
              },
              {
                flag: <Wheat size={24} strokeWidth={1.5} />, name: "Alberta",
                tag: "income tax calculator alberta",
                rate: "10–15%",
                bpa: "$21,003",
                note: "Alberta has the most generous Basic Personal Amount in Canada ($21,003), no provincial sales tax (PST), and competitive flat income tax rates. For most income levels, Alberta is the lowest-taxed province — a significant reason for interprovincial migration. Combined top rate: ~48%."
              },
              {
                flag: <Shield size={24} strokeWidth={1.5} />, name: "Quebec",
                tag: "income tax calculator quebec",
                rate: "14–25.75%",
                bpa: "$17,183",
                note: "Quebec has the highest provincial tax rates in Canada (14–25.75%) but offsets this with superior public services, subsidized childcare ($10/day), and the lowest post-secondary tuition in North America. Quebec administers its own tax separately through Revenu Québec. Combined top rate: ~53.31%."
              },
              {
                flag: <Waves size={24} strokeWidth={1.5} />, name: "Manitoba",
                tag: "income tax calculator canada",
                rate: "10.8–17.4%",
                bpa: "$15,780",
                note: "Manitoba's three-bracket system tops out at 17.4% on income above $100,000. The province has significantly reduced its lowest bracket rate in recent years. Combined top rate with federal: ~50.4%. Manitoba offers relatively affordable housing and cost of living."
              },
              {
                flag: <Sun size={24} strokeWidth={1.5} />, name: "Saskatchewan",
                tag: "income tax calculator canada",
                rate: "10.5–14.5%",
                bpa: "$17,661",
                note: "Saskatchewan has one of the simpler three-bracket provincial systems with a competitive top rate of 14.5%. The large Basic Personal Amount reduces the tax burden significantly on lower incomes. Combined top rate: ~47.5% — one of the most competitive in Canada."
              },
            ].map(p => (
              <div className="icard" key={p.name}>
                <span className="icard-icon">{p.flag}</span>
                <h4>{p.name}</h4>
                <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.7rem", background: "var(--red-dim)", color: "var(--red)", padding: "2px 7px", borderRadius: 3, fontWeight: 700 }}>Rate: {p.rate}</span>
                  <span style={{ fontSize: "0.7rem", background: "var(--bg2)", color: "var(--ink2)", padding: "2px 7px", borderRadius: 3, fontWeight: 600 }}>BPA: {p.bpa}</span>
                </div>
                <p style={{ fontSize: "0.81rem" }}>{p.note}</p>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <h3 style={{ fontFamily: "var(--font-d)", fontSize: "1.2rem", fontWeight: 700, marginBottom: 8, color: "var(--ink)" }}>All Province Tax Rates — Current Comparison</h3>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Province</th>
                  <th>Prov. Brackets</th>
                  <th>Top Prov. Rate</th>
                  <th>Basic Personal Amt</th>
                  <th>Top Combined Rate</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [<span className="flex items-center gap-1.5"><Building2 size={14} /> Ontario (ON)</span>,           "5",  "13.16%", "$11,865", "~53.53%", "Surtax applies above $5,315 provincial tax"],
                  [<span className="flex items-center gap-1.5"><Mountain size={14} /> British Columbia (BC)</span>,  "7",  "20.50%", "$11,981", "~53.50%", "Highest top provincial rate"],
                  [<span className="flex items-center gap-1.5"><Wheat size={14} /> Alberta (AB)</span>,            "5",  "15.00%", "$21,003", "~48.00%", "No PST; highest BPA; lowest overall tax"],
                  [<span className="flex items-center gap-1.5"><Shield size={14} /> Quebec (QC)</span>,             "4",  "25.75%", "$17,183", "~53.31%", "Self-administered; QPIP instead of EI"],
                  [<span className="flex items-center gap-1.5"><Waves size={14} /> Manitoba (MB)</span>,           "3",  "17.40%", "$15,780", "~50.40%", "Recent bracket reforms"],
                  [<span className="flex items-center gap-1.5"><Sun size={14} /> Saskatchewan (SK)</span>,       "3",  "14.50%", "$17,661", "~47.50%", "Competitive mid-range province"],
                  [<span className="flex items-center gap-1.5"><Anchor size={14} /> Nova Scotia (NS)</span>,        "5",  "21.00%", "$8,481",  "~54.00%", "Highest top combined rate; lowest BPA"],
                  [<span className="flex items-center gap-1.5"><Leaf size={14} /> New Brunswick (NB)</span>,      "4",  "19.50%", "$12,458", "~52.50%", ""],
                  [<span className="flex items-center gap-1.5"><Mountain size={14} /> Newfoundland (NL)</span>,       "7",  "21.80%", "$10,818", "~54.80%", "Most brackets of any province"],
                  [<span className="flex items-center gap-1.5"><Palmtree size={14} /> PEI</span>,                    "5",  "18.75%", "$12,000", "~51.75%", "Smallest province by population"],
                  [<span className="flex items-center gap-1.5"><Mountain size={14} /> NWT</span>,                    "4",  "14.05%", "$16,593", "~47.05%", "Territory"],
                  [<span className="flex items-center gap-1.5"><Mountain size={14} /> Yukon (YT)</span>,              "4",  "15.00%", "$15,705", "~48.00%", "Territory; mirrors federal brackets"],
                  [<span className="flex items-center gap-1.5"><Snowflake size={14} /> Nunavut (NU)</span>,            "4",  "11.50%", "$17,925", "~44.50%", "Lowest combined top rate in Canada"],
                ].map(([prov, bkts, top, bpa, combined, notes], i) => (
                  <tr key={i}>
                    <td>{prov as React.ReactNode}</td>
                    <td style={{ textAlign: "center" }}>{bkts as React.ReactNode}</td>
                    <td className="td-red">{top}</td>
                    <td>{bpa}</td>
                    <td className="td-red">{combined}</td>
                    <td style={{ fontSize: "0.79rem" }}>{notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Paycheck calculator explainer ── */}
        <section className="content-section" id="paycheck">
          <div className="sec-badge">Paycheck Guide</div>
          <h2 className="sec-title"><em>Paycheck Calculator Canada</em> — What Gets Deducted</h2>
          <p className="sec-lead">
            Every pay stub in Canada shows a series of deductions between gross pay and net pay. Here is exactly what each line means, how it is calculated, and how to verify your employer is withholding the right amount.
          </p>
          <div className="two-col">
            <div className="cbody">
              <h3>Federal Income Tax Withholding</h3>
              <p>
                Your employer uses the CRA's payroll deduction tables (or the Payroll Deductions Online Calculator) to determine how much federal income tax to withhold from each paycheque. The withholding is an estimate based on your annualized earnings — meaning the tax withheld each pay period assumes you will earn the same amount all year.
              </p>
              <p>
                If your income varies significantly throughout the year — due to bonuses, seasonal work, or changes in employment — your withholding may be over or under the final amount owed. Canadians who owe more than $3,000 at tax time for two consecutive years may be required to make quarterly tax installments. Use a <strong>paycheck calculator Canada</strong> like the one above to estimate your annual tax and adjust your RRSP contributions to reduce any shortfall.
              </p>
              <h3>TD1 Personal Tax Credits Return</h3>
              <p>
                When you start a new job in Canada, you complete a TD1 Federal form and a TD1 Provincial form (e.g., TD1ON for Ontario, TD1BC for BC). These forms tell your employer which personal tax credits you are claiming — primarily the Basic Personal Amount but also credits for tuition, disability, caregiver status, and others. Your employer uses these to calculate your withholding.
              </p>
              <p>
                If you work multiple jobs simultaneously, you should only claim the full BPA on one TD1 (your primary employer). At your other jobs, claim zero credits — otherwise both employers will each under-withhold, resulting in a large balance owing at tax time.
              </p>
              <h3>Reading Your Pay Stub</h3>
              <p>
                A Canadian pay stub typically shows: <strong>Gross Pay</strong> (total earnings before deductions), then deductions for <strong>Federal Income Tax</strong>, <strong>Provincial Income Tax</strong>, <strong>CPP Contributions</strong>, and <strong>EI Premiums</strong>, then any other voluntary deductions (group benefits, pension plan), resulting in <strong>Net Pay</strong> (your take-home amount). The calculator above matches this structure exactly, broken out by pay period.
              </p>
            </div>
            <div className="cbody">
              <h3>Bonus and Irregular Income Withholding</h3>
              <p>
                When your employer pays a bonus, commission, or other irregular income, CRA rules require withholding at a higher rate — often at your marginal rate rather than your average rate. This is why a bonus cheque often looks like it was "taxed at 50%." It was not — your employer withheld more to ensure you do not end up owing tax. When you file your return, the actual tax is recalculated on your total annual income, and you may receive a refund if too much was withheld.
              </p>
              <h3>Quebec Payroll Deductions</h3>
              <p>
                Quebec employees have a different payroll experience from the rest of Canada. Instead of contributing to Employment Insurance at the standard 1.66% rate, Quebec employees pay a lower EI rate of 1.29% because they also pay into the <strong>Quebec Parental Insurance Plan (QPIP)</strong>, which provides more generous parental leave benefits. Quebec also administers its own provincial income tax through Revenu Québec rather than the CRA — meaning Quebec employees effectively file two separate income tax returns each year.
              </p>
              <p>
                An <strong>income tax calculator Quebec</strong> must account for both the federal return filed with CRA and the provincial return filed with Revenu Québec, plus the QPIP premium. Our calculator models this correctly — the EI premium shown for Quebec reflects the lower rate.
              </p>
              <h3>Employer Payroll Obligations</h3>
              <p>
                Canadian employers match CPP contributions dollar-for-dollar (5.95% employer + 5.95% employee) and pay 1.4 times the employee EI premium as their employer EI contribution. These employer costs are not deducted from employee paycheques — they are additional labour costs borne by the employer. For self-employed Canadians, there is no employer to make this match, which is why self-employed individuals pay the full CPP rate of 11.9%.
              </p>
            </div>
          </div>
        </section>

        {/* ── Tax planning ── */}
        <section className="content-section" id="planning">
          <div className="sec-badge">Tax Planning</div>
          <h2 className="sec-title">Reduce Your Tax Bill — <em>Legal Strategies for the current year</em></h2>
          <p className="sec-lead">
            Canada's tax system offers several powerful tools for reducing your taxable income and, therefore, your tax bill. These are not loopholes — they are government-sanctioned incentives built into the Income Tax Act.
          </p>
          <div className="three-col">
            {[
              {
                icon: <Landmark size={24} strokeWidth={1.5} />,
                title: "RRSP Contributions",
                body: "Every dollar contributed to an RRSP reduces your taxable income dollar-for-dollar, generating a refund at your marginal rate. At a 43% marginal rate, a $10,000 RRSP contribution generates a ~$4,300 refund. The 2024 limit is $31,560 or 18% of prior year earned income. Unused room carries forward indefinitely."
              },
              {
                icon: <Briefcase size={24} strokeWidth={1.5} />,
                title: "TFSA Contributions",
                body: "The Tax-Free Savings Account (TFSA) does not reduce your taxable income but shelters all growth and withdrawals from tax permanently. The 2024 TFSA contribution room is $7,000. Total lifetime room since 2009 is $95,000 for Canadians who have been eligible since inception. Ideal for savings above the RRSP horizon."
              },
              {
                icon: <Home size={24} strokeWidth={1.5} />,
                title: "First Home Savings Account (FHSA)",
                body: "Introduced in 2023, the FHSA combines the best of RRSP (tax deduction on contributions) and TFSA (tax-free withdrawals for qualifying home purchase). Annual contribution limit is $8,000, lifetime limit $40,000. A first-time buyer contributing the max gets both an immediate tax deduction and tax-free growth."
              },
              {
                icon: <DollarSign size={24} strokeWidth={1.5} />,
                title: "Employment Expenses",
                body: "Employees who work from home may claim home office expenses (simplified $2/day method or detailed actual cost method with T2200 from employer). Commission employees can deduct a wider range of expenses including advertising, promotional, and automobile costs."
              },
              {
                icon: <Baby size={24} strokeWidth={1.5} />,
                title: "Childcare Expenses",
                body: "Childcare expenses are deductible from income (not a tax credit) for the lower-income spouse. The deduction limit is $8,000/year for children under 7 and $5,000 for children 7–16. This deduction can significantly reduce the effective tax rate for families with young children."
              },
              {
                icon: <BookOpen size={24} strokeWidth={1.5} />,
                title: "Moving Expenses & Professional Dues",
                body: "Moving expenses are deductible if you move at least 40km closer to a new employer or university. Annual professional membership dues, union dues, and required licensing fees are fully deductible from employment income — claim these on your T1 even if your employer does not remind you."
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

        {/* ── FAQ ── */}
        <section className="content-section" id="faq">
          <div className="sec-badge">FAQ</div>
          <h2 className="sec-title">Frequently Asked <em>Questions</em></h2>
          <div className="disclaimer-box">
            <strong>Disclaimer:</strong> This calculator provides estimates for planning purposes based on Current CRA rates. It does not account for all credits, deductions, or personal circumstances. Always consult a qualified tax professional or the CRA website for advice specific to your situation.
          </div>
          <div style={{ maxWidth: 820 }}>
            {[
              {
                q: "How accurate is this income tax calculator for Ontario?",
                a: "The income tax calculator Ontario results are based on 2024 federal and Ontario provincial tax brackets, including the Ontario surtax, the federal and Ontario basic personal amounts, and standard CPP and EI rates. Results are accurate for employment income without complex deductions (other than RRSP). For income from self-employment, capital gains, rental income, or with significant additional credits, the actual tax owed will differ. Always verify your final tax with the CRA's NETFILE-certified tax software."
              },
              {
                q: "What is the difference between the income tax calculator BC vs. Alberta?",
                a: "The income tax calculator BC shows significantly higher combined tax than Alberta for most income levels. British Columbia's top provincial rate reaches 20.5% on income above $240,716, while Alberta's top rate is 15%. Alberta also has a much higher Basic Personal Amount ($21,003 vs $11,981 in BC) and no provincial sales tax. For a $150,000 earner, the take-home difference between Alberta and BC is roughly $5,000–$8,000 per year after provincial tax differences — a meaningful factor for interprovincial migration decisions."
              },
              {
                q: "Why does the income tax calculator Quebec show different EI deductions?",
                a: "Quebec residents pay a lower EI premium rate (1.29% vs 1.66% in other provinces) because Quebec operates the Quebec Parental Insurance Plan (QPIP) separately. QPIP provides parental, maternity, and paternity benefits that are funded separately from federal EI. Quebec workers pay QPIP premiums in addition to the reduced EI premiums. The income tax calculator Quebec above reflects the correct lower EI rate. Note that Quebec income tax is also administered by Revenu Québec separately from the CRA."
              },
              {
                q: "How does the paycheck calculator Canada handle CPP?",
                a: "The paycheck calculator Canada uses 2024 CPP rates: 5.95% on earnings between the basic exemption ($3,500) and the Year's Maximum Pensionable Earnings ($68,500), plus the new CPP2 rate of 4% on earnings between $68,500 and $73,200. For salaried employees, the maximum combined CPP contribution is approximately $4,055. Self-employed Canadians pay both the employee and employer share (11.9% total on the base tier), which the self-employed toggle in the calculator reflects."
              },
              {
                q: "Is the income tax calculator Alberta 2024 accurate for all income levels?",
                a: "Yes — the income tax calculator Alberta uses 2024 provincial brackets (10% on first $148,269, rising to 15% on income above $355,845) and Alberta's $21,003 basic personal amount. Alberta is unique in Canada for having no PST and the most generous basic personal amount. For most income levels from $50,000 to $500,000, Alberta produces the lowest provincial tax of any province. The calculator is accurate for employment income; complex situations involving investment income, business income, or Alberta's SR&ED credits may produce different results."
              },
              {
                q: "How much tax do I pay on a $100,000 salary in Canada?",
                a: "At $100,000 in Ontario (2024), you would pay approximately $19,500 in federal income tax, $8,200 in Ontario provincial tax, $3,867 in CPP, and $1,049 in EI — for a total deduction of roughly $32,600 and a take-home of approximately $67,400. In Alberta, the total deduction is lower at roughly $28,000 (take-home ~$72,000) due to lower provincial rates and a higher BPA. Use the calculator above and select your province for precise figures."
              },
              {
                q: "What is the RRSP contribution limit for the current year?",
                a: "The 2024 RRSP dollar limit is $31,560. Your personal contribution room is the lower of $31,560 or 18% of your 2023 earned income, plus any unused room carried forward from prior years. You can find your exact RRSP contribution room on your CRA My Account or on the Notice of Assessment from your 2023 tax return. RRSP contributions reduce your taxable income dollar-for-dollar, generating a refund at your marginal rate — the calculator shows your estimated tax saving based on your marginal combined rate."
              },
              {
                q: "How do I calculate my marginal tax rate in Canada?",
                a: "Your marginal tax rate is the combined federal and provincial rate that applies to your next dollar of income. To find it, identify which federal bracket your income falls into (e.g., 20.5% for income between $55,867 and $111,733 currently) and which provincial bracket (e.g., 9.15% for Ontario income between $51,446 and $102,894), and add them together: 20.5% + 9.15% = 29.65% combined marginal rate. The calculator above shows your marginal rate automatically and breaks it into federal and provincial components."
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
          <h2>Know Your Exact Take-Home Pay</h2>
          <p>Select your province, enter your income — see federal tax, provincial tax, CPP, EI, and take-home pay instantly.</p>
          <button className="cta-btn" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Calculate My Tax ↑
          </button>
        </div>

        {/* Related Tools */}
        <div className="mt-20 border-t border-stone-100 pt-12">
          <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath="/finance/canada-income-tax-calculator" />
        </div>

        <footer className="footer">
          <p>Canada Income Tax Calculator · Based on CRA rates · For estimation purposes only · Not tax advice</p>
          <p style={{ marginTop: 8 }}>
            <a href="#calculator">Calculator</a> · <a href="#how-it-works">How It Works</a> · <a href="#provinces">By Province</a> · <a href="#paycheck">Paycheck Guide</a> · <a href="#planning">Tax Planning</a> · <a href="#faq">FAQ</a>
          </p>
        </footer>

      </div>
      </div>
    </>
  );
}
