"use client";

import { useState, useMemo } from "react";
import { Leaf, Landmark, ClipboardList, UserCheck, CheckCircle, XCircle, ArrowUp } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, BarChart, Bar, Cell, Legend,
} from "recharts";

// ─── 2024 CPP Constants ───────────────────────────────────────────────────────
const CPP_2024 = {
  maxPensionableEarnings: 68500,   // YMPE
  maxPensionableEarnings2: 73200,   // Year's Additional Maximum Pensionable Earnings (YAMPE)
  basicExemption: 3500,
  employeeRate: 0.0595,
  employerRate: 0.0595,
  selfEmployedRate: 0.119,
  cpp2Rate: 0.04,
  maxMonthlyRetirement: 1364.60, // Maximum CPP retirement pension at 65 (2024)
  avgMonthlyRetirement: 758.32,  // Average CPP retirement pension (2024)
  maxMonthlyDisability: 1606.78,
  maxMonthlySurvivor65: 818.76,
  maxMonthlyChildren: 294.12,
  maxMonthlyDeath: 2500,    // Death benefit (one-time)
  // Age adjustment factors
  earlyReductionPerMonth: 0.006,   // 0.6% per month before 65
  lateIncreasePerMonth: 0.007,   // 0.7% per month after 65
};

// ─── 2024 OAS Constants ───────────────────────────────────────────────────────
const OAS_2024 = {
  maxMonthly65to74: 713.34,
  maxMonthly75plus: 784.67,
  clawbackThreshold: 90997,   // Income where OAS starts being clawed back
  clawbackRate: 0.15,
  deferralIncreasePerMonth: 0.006, // 0.6% per month, max 36% at 70
};

// ─── 2024 EI Constants ───────────────────────────────────────────────────────
const EI_2024 = {
  maxInsurableEarnings: 63200,
  employeeRate: 0.0166,
  employerRate: 0.0232,   // 1.4× employee rate
  qcEmployeeRate: 0.0129,
  qcEmployerRate: 0.0180,
  replacementRate: 0.55,
  qpipRate: 0.00494,  // Quebec QPIP (employee)
  minWeeks: { low: 420, high: 700 },   // hours thresholds
  maxWeeklyBenefit: 668,      // 55% × $63,200 / 52 = $668/wk (2024)
  // Benefit duration by regional rate (simplified)
  // Actual duration depends on regional unemployment rate + hours worked
};

// Regional unemployment rates (simplified, for EI weeks calculation)
const EI_REGIONS = [
  { label: "Atlantic Canada / Northern regions (≥13.1%)", minHours: 420, maxWeeks: 45 },
  { label: "High unemployment region (11.1–13%)", minHours: 455, maxWeeks: 43 },
  { label: "Medium-high region (9.1–11%)", minHours: 490, maxWeeks: 40 },
  { label: "Medium region (7.1–9%)", minHours: 560, maxWeeks: 36 },
  { label: "Lower unemployment region (6.1–7%)", minHours: 595, maxWeeks: 33 },
  { label: "Toronto / Calgary / low region (≤6%)", minHours: 700, maxWeeks: 14 },
];

const fmtC = (n: number, d: number = 2) => {
  if (isNaN(n) || !isFinite(n)) return "$0.00";
  return "$" + Math.abs(n).toLocaleString("en-CA", { minimumFractionDigits: d, maximumFractionDigits: d });
};
const fmtN = (n: number, d: number = 0) => isNaN(n) ? "0" : n.toLocaleString("en-CA", { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtPct = (n: number, d: number = 1) => (isNaN(n) ? "0" : n.toFixed(d)) + "%";

// CPP age adjustment factor
const cppAgeFactor = (startAge: number) => {
  const monthsDiff = (startAge - 65) * 12;
  if (monthsDiff < 0) {
    // Early: 0.6% reduction per month before 65 (max 36% reduction at 60)
    return Math.max(1 + monthsDiff * CPP_2024.earlyReductionPerMonth, 0.64);
  } else {
    // Late: 0.7% increase per month after 65 (max 42% increase at 70)
    return Math.min(1 + monthsDiff * CPP_2024.lateIncreasePerMonth, 1.42);
  }
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1b2e3a", border: "1px solid #2a4455", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#c5d8e8" }}>
      <p style={{ fontWeight: 700, color: "#fff", marginBottom: 4 }}>Age {label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color || "#94b8c8" }}>{p.name}: {fmtC(p.value)}/mo</p>
      ))}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CppEiCalculatorPage() {

  // CPP inputs
  const [avgEarnings, setAvgEarnings] = useState(65000);
  const [yearsContrib, setYearsContrib] = useState(30);
  const [startAge, setStartAge] = useState(65);
  const [selfEmployed, setSelfEmployed] = useState(false);
  const [currentAge, setCurrentAge] = useState(45);

  // EI inputs
  const [weeklyEarnings, setWeeklyEarnings] = useState(1400);
  const [hoursWorked, setHoursWorked] = useState(900);
  const [regionIdx, setRegionIdx] = useState(3);
  const [isQC, setIsQC] = useState(false);
  const [eiReason, setEiReason] = useState("layoff");

  // OAS
  const [oasAge, setOasAge] = useState(65);
  const [oasIncome, setOasIncome] = useState(75000);

  // UI
  const [activeSection, setActiveSection] = useState("cpp");
  const [cppTab, setCppTab] = useState("pension");

  // ─── CPP Calculations ─────────────────────────────────────────────────────
  const cpp = useMemo(() => {
    const earnings = Math.max(0, Number(avgEarnings) || 0);
    const years = Math.min(39, Math.max(1, Number(yearsContrib) || 0));
    const age = Number(startAge) || 65;
    const curAge = Number(currentAge) || 45;

    // CPP base: proportional to years contributed and earnings relative to YMPE
    const earningsRatio = Math.min(earnings, CPP_2024.maxPensionableEarnings) / CPP_2024.maxPensionableEarnings;
    const yearsRatio = years / 39; // 39 best years used
    const basePension = CPP_2024.maxMonthlyRetirement * earningsRatio * yearsRatio;

    const ageFactor = cppAgeFactor(age);
    const monthlyPension = basePension * ageFactor;

    // CPP2 additional benefit (simplified)
    const cpp2Earnings = Math.max(0, Math.min(earnings, CPP_2024.maxPensionableEarnings2) - CPP_2024.maxPensionableEarnings);
    const cpp2Benefit = cpp2Earnings > 0 ? (cpp2Earnings / CPP_2024.maxPensionableEarnings) * 45 * yearsRatio : 0;

    const totalMonthly = monthlyPension + cpp2Benefit;
    const annualPension = totalMonthly * 12;

    // Current year contribution
    const insurable = Math.max(0, Math.min(earnings, CPP_2024.maxPensionableEarnings) - CPP_2024.basicExemption);
    const employeeContrib = insurable * CPP_2024.employeeRate;
    const employerContrib = insurable * CPP_2024.employerRate;
    const selfContrib = insurable * CPP_2024.selfEmployedRate;
    const cpp2Contrib = cpp2Earnings * CPP_2024.cpp2Rate;
    const totalContrib = selfEmployed ? selfContrib + cpp2Contrib : employeeContrib + cpp2Contrib;
    const employerTotal = selfEmployed ? 0 : employerContrib;

    // Age comparison data
    const ageComparison = [];
    for (let a = 60; a <= 70; a += 1) {
      const f = cppAgeFactor(a);
      ageComparison.push({
        age: a,
        "Monthly Pension": Math.round(basePension * f),
        "Annual Pension": Math.round(basePension * f * 12),
        factor: f,
      });
    }

    // Breakeven analysis (vs taking at 65)
    const at65 = basePension * cppAgeFactor(65);
    const ageBreakeven = [];
    for (let a = 60; a <= 70; a += 1) {
      const monthly = basePension * cppAgeFactor(a);
      // Years to accumulate more total lifetime payments than at-65 option
      // Solve: monthly * (lifeAge - a)*12 = at65 * (lifeAge - 65)*12
      const breakevenAge = a < 65
        ? (at65 * 65 - monthly * a) / (at65 - monthly)
        : a === 65 ? null
          : (monthly * a - at65 * 65) / (monthly - at65);
      ageBreakeven.push({ age: a, breakeven: breakevenAge ? Math.round(breakevenAge * 10) / 10 : null, monthly: Math.round(monthly) });
    }

    // Lifetime total received (to age 85) at each start age
    const lifetimeData = [];
    for (let a = 60; a <= 70; a++) {
      const m = basePension * cppAgeFactor(a);
      const total = m * Math.max(0, (85 - a)) * 12;
      lifetimeData.push({ age: "Age " + a, total: Math.round(total), monthly: Math.round(m) });
    }

    return {
      basePension, ageFactor, monthlyPension: totalMonthly,
      annualPension, cpp2Benefit,
      employeeContrib, employerContrib: employerTotal, selfContrib,
      cpp2Contrib, totalContrib,
      ageComparison, ageBreakeven, lifetimeData,
      yearsToContrib: Math.max(0, 65 - curAge),
    };
  }, [avgEarnings, yearsContrib, startAge, selfEmployed, currentAge]);

  // ─── OAS Calculations ─────────────────────────────────────────────────────
  const oas = useMemo(() => {
    const age = Math.max(65, Math.min(70, Number(oasAge) || 65));
    const income = Number(oasIncome) || 0;
    const base = age >= 75 ? OAS_2024.maxMonthly75plus : OAS_2024.maxMonthly65to74;
    const deferralMonths = (age - 65) * 12;
    const deferralBonus = Math.min(deferralMonths * OAS_2024.deferralIncreasePerMonth, 0.36);
    const grossMonthly = base * (1 + deferralBonus);
    const clawbackIncome = Math.max(0, income - OAS_2024.clawbackThreshold);
    const annualClawback = clawbackIncome * OAS_2024.clawbackRate;
    const monthlyClawback = Math.min(annualClawback / 12, grossMonthly);
    const netMonthly = Math.max(0, grossMonthly - monthlyClawback);
    return { grossMonthly, netMonthly, monthlyClawback, deferralBonus: deferralBonus * 100, annualClawback };
  }, [oasAge, oasIncome]);

  // ─── EI Calculations ─────────────────────────────────────────────────────
  const ei = useMemo(() => {
    const weekly = Number(weeklyEarnings) || 0;
    const hours = Number(hoursWorked) || 0;
    const region = EI_REGIONS[regionIdx] || EI_REGIONS[3];
    const rate = isQC ? EI_2024.qcEmployeeRate : EI_2024.employeeRate;
    const emplRate = isQC ? EI_2024.qcEmployerRate : EI_2024.employerRate;

    const annualInsurable = Math.min(weekly * 52, EI_2024.maxInsurableEarnings);
    const weeklyInsurable = Math.min(weekly, EI_2024.maxInsurableEarnings / 52);
    const annualPremium = annualInsurable * rate;
    const weeklyPremium = weekly * rate;
    const employerPremium = annualInsurable * emplRate;

    const eligible = hours >= region.minHours;
    const weeklyBenefit = Math.min(weeklyInsurable * EI_2024.replacementRate, EI_2024.maxWeeklyBenefit);
    const monthlyBenefit = weeklyBenefit * (52 / 12);

    // Benefit duration (simplified: scales between min and max based on hours above minimum)
    const extraHours = Math.max(0, hours - region.minHours);
    const maxExtraHours = 700 - region.minHours;
    const durationWeeks = eligible
      ? Math.min(region.maxWeeks, Math.round(region.maxWeeks * 0.6 + (extraHours / Math.max(maxExtraHours, 1)) * region.maxWeeks * 0.4))
      : 0;

    const totalBenefit = weeklyBenefit * durationWeeks;
    const waitingPeriod = 1; // 1 week waiting period (the 2-week period was reduced)

    // Breakdown chart
    const breakdownData = [
      { name: "Net Take-Home", value: Math.round((weekly - weeklyPremium) * 52 - annualPremium) },
      { name: "EI Premium", value: Math.round(annualPremium) },
    ];

    return {
      annualInsurable, weeklyInsurable, annualPremium, weeklyPremium,
      employerPremium, eligible, weeklyBenefit, monthlyBenefit,
      durationWeeks, totalBenefit, waitingPeriod,
      region, rate, breakdownData,
    };
  }, [weeklyEarnings, hoursWorked, regionIdx, isQC, eiReason]);

  // ─── Combined retirement income ───────────────────────────────────────────
  const retirementTotal = cpp.monthlyPension + oas.netMonthly;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:        #f0ede8;
          --bg2:       #e8e4de;
          --surface:   #faf8f5;
          --surface2:  #f0ede8;
          --ink:       #1a2230;
          --ink2:      #344055;
          --muted:     #8a96a8;
          --muted2:    #6a7888;
          --border:    #d8d2c8;
          --border2:   #c4bdb0;
          --teal:      #1a6b82;
          --teal2:     #2490a8;
          --teal3:     #5ab8cc;
          --teal-dim:  #e0f2f7;
          --teal-faint:rgba(26,107,130,0.07);
          --maple:     #c23b22;
          --maple-dim: #fdf0ed;
          --green:     #1e7a4a;
          --green2:    #2da866;
          --green-dim: #e8f5ee;
          --amber:     #c87820;
          --amber-dim: #fef3e2;
          --font-d:    'DM Serif Display', Georgia, serif;
          --font-b:    'Public Sans', 'Helvetica Neue', sans-serif;
          --font-m:    'JetBrains Mono', monospace;
          --r:         12px;
          --shadow:    0 2px 8px rgba(26,34,48,0.07);
          --shadow-md: 0 6px 24px rgba(26,34,48,0.10);
        }

        html { font-size: 15px; scroll-behavior: smooth; }
        body {
          font-family: var(--font-b);
          background: var(--bg);
          color: var(--ink);
          -webkit-font-smoothing: antialiased;
          line-height: 1.6;
        }

        /* subtle linen texture */
        body::before {
          content: '';
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='4' height='4' fill='%23f0ede8'/%3E%3Crect x='0' y='0' width='1' height='1' fill='%23e8e4de' opacity='0.6'/%3E%3Crect x='2' y='2' width='1' height='1' fill='%23e8e4de' opacity='0.6'/%3E%3C/svg%3E");
        }

        .wrap { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; padding: 0 22px; }

        /* ── Hero ── */
        .hero {
          padding: 56px 0 44px;
          border-bottom: 2px solid var(--ink);
          position: relative;
        }
        .hero-flag {
          font-size: 1.4rem; margin-bottom: 12px; display: block; line-height: 1;
        }
        .hero-kicker {
          display: inline-flex; align-items: center; gap: 7px;
          background: var(--teal); color: #fff;
          font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; padding: 4px 12px; border-radius: 3px;
          margin-bottom: 16px; font-family: var(--font-b);
        }
        .hero h1 {
          font-family: var(--font-d);
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          font-weight: 400; line-height: 1.1;
          color: var(--ink); max-width: 820px;
          margin-bottom: 14px;
        }
        .hero h1 em { color: var(--teal2); font-style: italic; }
        .hero-sub {
          font-size: 0.97rem; color: var(--ink2);
          max-width: 600px; line-height: 1.75; margin-bottom: 28px;
        }
        .hero-stats { display: flex; gap: 0; flex-wrap: wrap; }
        .hstat {
          padding: 12px 24px; border-right: 1px solid var(--border2);
          display: flex; flex-direction: column;
        }
        .hstat:first-child { padding-left: 0; }
        .hstat:last-child  { border-right: none; }
        @media(max-width:500px){ .hstat { padding: 10px 16px 10px 0; border-right: none; border-bottom: 1px solid var(--border); width: 50%; } }
        .hstat-num {
          font-family: var(--font-d); font-size: 1.7rem;
          color: var(--teal2); line-height: 1;
        }
        .hstat-lbl { font-size: 0.72rem; color: var(--muted2); text-transform: uppercase; letter-spacing: 0.07em; margin-top: 2px; }

        /* ── Main section tabs ── */
        .section-nav {
          display: flex; gap: 0; margin: 28px 0 0;
          border-bottom: 2px solid var(--border2);
        }
        .snav-btn {
          padding: 12px 24px; font-size: 0.84rem; font-weight: 700;
          border: none; background: transparent; color: var(--muted2);
          cursor: pointer; transition: all 0.15s;
          font-family: var(--font-b); letter-spacing: 0.03em;
          border-bottom: 2px solid transparent; margin-bottom: -2px;
        }
        .snav-btn:hover { color: var(--ink); }
        .snav-btn.active { color: var(--teal); border-bottom-color: var(--teal); }

        /* ── Grid ── */
        .calc-grid {
          display: grid; grid-template-columns: 340px 1fr;
          gap: 24px; padding: 32px 0; align-items: start;
        }
        @media(max-width:900px){ .calc-grid { grid-template-columns: 1fr; } }

        /* ── Input card ── */
        .input-card {
          background: var(--surface); border: 1px solid var(--border2);
          border-radius: var(--r); padding: 24px;
          box-shadow: var(--shadow); position: sticky; top: 20px;
        }
        @media(max-width:900px){ .input-card { position: static; } }

        .panel-title {
          font-size: 0.62rem; font-weight: 700; letter-spacing: 0.13em;
          text-transform: uppercase; color: var(--teal);
          margin-bottom: 14px; display: flex; align-items: center; gap: 8px;
          font-family: var(--font-b);
        }
        .panel-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }

        .field { margin-bottom: 14px; }
        .field label {
          display: block; font-size: 0.7rem; font-weight: 600;
          color: var(--muted2); text-transform: uppercase;
          letter-spacing: 0.07em; margin-bottom: 5px;
        }
        .iw {
          display: flex; align-items: center;
          background: var(--bg); border: 1.5px solid var(--border2);
          border-radius: 8px; overflow: hidden; transition: border-color 0.15s;
        }
        .iw:focus-within { border-color: var(--teal); }
        .ipfx {
          padding: 0 10px; height: 38px;
          font-size: 0.82rem; color: var(--muted);
          background: var(--bg2); border-right: 1.5px solid var(--border2);
          display: flex; align-items: center;
          font-family: var(--font-m); user-select: none; min-width: 34px;
          justify-content: center; flex-shrink: 0;
        }
        .iw input, .iw select {
          flex: 1; border: none; background: transparent;
          padding: 0 11px; height: 38px;
          font-family: var(--font-m); font-size: 0.9rem;
          color: var(--ink); outline: none;
        }
        .iw select { cursor: pointer; }
        .iw select option { background: #fff; }
        input[type=range] {
          -webkit-appearance: none; width: 100%;
          height: 4px; background: var(--border2);
          border-radius: 2px; outline: none; margin-top: 7px; cursor: pointer;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 16px; height: 16px;
          border-radius: 50%; background: var(--teal);
          cursor: pointer; border: 2px solid var(--surface);
          box-shadow: 0 0 0 1px var(--teal);
          transition: transform 0.12s;
        }
        input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.2); }

        .toggle-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 9px 0; border-top: 1px solid var(--border);
          font-size: 0.8rem; color: var(--ink2); font-weight: 500;
        }
        .toggle { position: relative; width: 36px; height: 20px; display: inline-block; cursor: pointer; }
        .toggle input { opacity: 0; width: 0; height: 0; }
        .t-track { position: absolute; inset: 0; background: var(--border2); border-radius: 20px; transition: background 0.2s; }
        .toggle input:checked + .t-track { background: var(--teal); }
        .t-thumb { position: absolute; top: 3px; left: 3px; width: 14px; height: 14px; background: #fff; border-radius: 50%; transition: transform 0.2s; pointer-events: none; }
        .toggle input:checked ~ .t-thumb { transform: translateX(16px); }

        /* Age slider — hero element */
        .age-slider-block {
          background: linear-gradient(135deg, var(--teal-dim), var(--surface));
          border: 1.5px solid rgba(26,107,130,0.25);
          border-radius: 10px; padding: 16px 18px; margin-bottom: 14px;
        }
        .age-display {
          font-family: var(--font-d); font-size: 3rem; line-height: 1;
          color: var(--teal); text-align: center; margin-bottom: 4px;
        }
        .age-sublabel { text-align: center; font-size: 0.72rem; color: var(--muted2); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; }
        .age-factor-bar {
          height: 8px; background: var(--border); border-radius: 4px;
          overflow: hidden; margin-top: 10px;
        }
        .age-factor-fill {
          height: 100%; border-radius: 4px; transition: width 0.4s ease;
          background: linear-gradient(90deg, var(--maple), var(--teal));
        }
        .age-labels {
          display: flex; justify-content: space-between;
          font-size: 0.68rem; color: var(--muted); margin-top: 4px;
        }

        /* ── Result panel ── */
        .result-panel { display: flex; flex-direction: column; gap: 18px; }

        /* Hero result card */
        .result-hero {
          background: var(--ink); border-radius: var(--r);
          padding: 28px; display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0; box-shadow: var(--shadow-md);
        }
        @media(max-width:640px){ .result-hero { grid-template-columns: 1fr 1fr; } }
        .rh-item {
          padding: 0 20px; border-right: 1px solid rgba(255,255,255,0.08);
          display: flex; flex-direction: column;
        }
        .rh-item:first-child { padding-left: 0; }
        .rh-item:last-child  { border-right: none; }
        @media(max-width:640px){
          .rh-item:nth-child(2){ border-right: none; }
          .rh-item:nth-child(3){ padding-left: 0; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; margin-top: 16px; grid-column: span 2; }
        }
        .rh-lbl { font-size: 0.64rem; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; color: rgba(255,255,255,0.4); margin-bottom: 6px; }
        .rh-val { font-family: var(--font-d); font-size: 2rem; color: #fff; line-height: 1; }
        .rh-val.accent { color: var(--teal3); }
        .rh-val.maple  { color: #f08070; }
        .rh-sub { font-size: 0.72rem; color: rgba(255,255,255,0.35); margin-top: 5px; }

        /* Tabs */
        .tab-row {
          display: flex; gap: 3px;
          background: var(--bg2); border: 1.5px solid var(--border2);
          padding: 3px; border-radius: 8px; margin-bottom: 18px;
        }
        .tab {
          flex: 1; padding: 7px 10px; font-size: 0.72rem; font-weight: 700;
          border: none; border-radius: 6px; background: transparent;
          color: var(--muted2); cursor: pointer; transition: all 0.12s;
          text-align: center; font-family: var(--font-b);
          text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap;
        }
        .tab.active { background: var(--surface); color: var(--teal); box-shadow: var(--shadow); border: 1px solid var(--border2); }

        /* Cards */
        .card {
          background: var(--surface); border: 1px solid var(--border2);
          border-radius: var(--r); padding: 24px; box-shadow: var(--shadow);
        }
        .card-title {
          font-family: var(--font-d); font-size: 0.95rem;
          color: var(--ink); margin-bottom: 16px;
          display: flex; align-items: center; justify-content: space-between;
        }

        /* Metric grid */
        .metrics-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
        @media(max-width:600px){ .metrics-grid { grid-template-columns: 1fr 1fr; } }
        .metric {
          background: var(--bg); border: 1px solid var(--border);
          border-radius: 9px; padding: 12px 14px;
        }
        .m-lbl { font-size: 0.63rem; text-transform: uppercase; letter-spacing: 0.09em; font-weight: 700; color: var(--muted); margin-bottom: 5px; }
        .m-val { font-family: var(--font-d); font-size: 1.4rem; color: var(--ink); line-height: 1; }
        .m-sub { font-size: 0.68rem; color: var(--muted); margin-top: 3px; }
        .m-teal  .m-val { color: var(--teal2); }
        .m-green .m-val { color: var(--green); }
        .m-maple .m-val { color: var(--maple); }
        .m-amber .m-val { color: var(--amber); }

        /* Age comparison table */
        .age-table { width: 100%; }
        .at-row {
          display: grid; grid-template-columns: 60px 1fr 90px 80px 100px;
          gap: 8px; padding: 9px 6px; border-bottom: 1px solid var(--border);
          font-size: 0.82rem; align-items: center;
        }
        .at-row.header {
          font-size: 0.63rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.09em; color: var(--muted); padding-bottom: 8px;
        }
        .at-row.selected { background: var(--teal-dim); border-radius: 6px; margin: 0 -4px; padding: 9px 10px; }
        .at-bar-wrap { background: var(--border); border-radius: 2px; height: 6px; overflow: hidden; }
        .at-bar-fill { height: 100%; background: var(--teal2); border-radius: 2px; transition: width 0.4s; }
        .at-monthly { font-family: var(--font-m); font-weight: 600; color: var(--ink); text-align: right; }
        .at-factor  { font-family: var(--font-m); font-size: 0.76rem; text-align: right; }
        .at-factor.up   { color: var(--green); }
        .at-factor.down { color: var(--maple); }
        .at-age { font-weight: 700; color: var(--teal); }
        .at-brkeven { font-size: 0.75rem; color: var(--muted2); text-align: right; font-family: var(--font-m); }

        /* Contribution breakdown */
        .contrib-rows { display: flex; flex-direction: column; }
        .cr {
          display: flex; justify-content: space-between; align-items: center;
          padding: 9px 0; border-bottom: 1px solid var(--border);
          font-size: 0.84rem;
        }
        .cr:last-child { border-bottom: none; padding-bottom: 0; }
        .cr-lbl { color: var(--ink2); }
        .cr-val { font-family: var(--font-m); font-weight: 600; color: var(--ink); }
        .cr.total { border-top: 2px solid var(--ink); margin-top: 4px; padding-top: 11px; }
        .cr.total .cr-lbl { font-weight: 700; color: var(--ink); }
        .cr.total .cr-val { color: var(--teal); font-size: 1rem; }

        /* EI status */
        .ei-status {
          border-radius: 9px; padding: 14px 16px;
          font-size: 0.86rem; margin-bottom: 16px;
          display: flex; align-items: center; gap: 11px;
        }
        .ei-status.eligible { background: var(--green-dim); border: 1px solid rgba(30,122,74,0.25); color: var(--green); }
        .ei-status.ineligible { background: var(--maple-dim); border: 1px solid rgba(194,59,34,0.25); color: var(--maple); }
        .ei-icon { font-size: 1.3rem; flex-shrink: 0; }

        /* OAS clawback meter */
        .clawback-meter {
          background: var(--bg); border: 1.5px solid var(--border2);
          border-radius: 10px; padding: 16px; margin-top: 14px;
        }
        .clawback-bar { height: 10px; background: var(--border); border-radius: 5px; overflow: hidden; margin: 10px 0 6px; }
        .clawback-fill { height: 100%; border-radius: 5px; transition: width 0.4s; background: linear-gradient(90deg, var(--teal2), var(--maple)); }

        /* Content sections */
        .content-area { padding-bottom: 60px; }
        .csection { padding: 52px 0; border-top: 1px solid var(--border2); }

        .sec-badge {
          display: inline-block; background: var(--teal-dim);
          color: var(--teal); border: 1px solid rgba(26,107,130,0.25);
          font-size: 0.63rem; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; padding: 3px 10px; border-radius: 4px;
          margin-bottom: 10px; font-family: var(--font-b);
        }
        .sec-title {
          font-family: var(--font-d);
          font-size: clamp(1.6rem, 3.5vw, 2.4rem);
          font-weight: 400; color: var(--ink);
          line-height: 1.18; margin-bottom: 10px;
        }
        .sec-title em { color: var(--teal2); font-style: italic; }
        .sec-lead { font-size: 0.94rem; color: var(--ink2); line-height: 1.8; max-width: 700px; margin-bottom: 26px; }

        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
        @media(max-width:740px){ .two-col { grid-template-columns: 1fr; } }
        .three-col { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
        @media(max-width:740px){ .three-col { grid-template-columns: 1fr 1fr; } }
        @media(max-width:480px){ .three-col { grid-template-columns: 1fr; } }

        .cbody { font-size: 0.92rem; color: var(--ink2); line-height: 1.82; }
        .cbody p { margin-bottom: 14px; }
        .cbody h3 { font-family: var(--font-d); font-size: 1.18rem; color: var(--ink); margin: 24px 0 9px; font-style: italic; }
        .cbody strong { color: var(--ink); font-weight: 600; }
        .cbody .pill {
          display: inline-block; background: var(--teal-dim); color: var(--teal);
          font-family: var(--font-m); font-size: 0.78rem; padding: 1px 8px;
          border-radius: 4px; border: 1px solid rgba(26,107,130,0.2); vertical-align: middle;
        }
        .cbody .pill-red {
          display: inline-block; background: var(--maple-dim); color: var(--maple);
          font-family: var(--font-m); font-size: 0.78rem; padding: 1px 8px;
          border-radius: 4px; border: 1px solid rgba(194,59,34,0.2); vertical-align: middle;
        }

        .icard {
          background: var(--surface); border: 1.5px solid var(--border);
          border-radius: 10px; padding: 20px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .icard:hover { border-color: var(--teal); transform: translateY(-2px); }
        .icard-icon { font-size: 1.3rem; margin-bottom: 10px; display: block; }
        .icard h4 { font-family: var(--font-d); font-size: 1rem; color: var(--teal2); margin-bottom: 7px; font-style: italic; }
        .icard p  { font-size: 0.82rem; color: var(--ink2); line-height: 1.65; }

        .tbl-wrap { overflow-x: auto; border: 1px solid var(--border2); border-radius: 10px; margin-top: 16px; }
        table { width: 100%; border-collapse: collapse; font-size: 0.84rem; }
        thead { background: var(--ink); }
        thead th { padding: 10px 14px; text-align: left; color: #fff; font-size: 0.67rem; text-transform: uppercase; letter-spacing: 0.09em; font-weight: 700; }
        tbody tr { border-top: 1px solid var(--border); }
        tbody tr:hover { background: var(--teal-faint); }
        tbody td { padding: 10px 14px; color: var(--ink2); }
        tbody td:first-child { color: var(--ink); font-weight: 600; }
        .td-teal  { color: var(--teal2)  !important; font-weight: 700 !important; }
        .td-green { color: var(--green)  !important; font-weight: 600 !important; }
        .td-maple { color: var(--maple)  !important; font-weight: 600 !important; }

        .steps { list-style: none; }
        .step { display: flex; gap: 14px; margin-bottom: 20px; }
        .step-num {
          width: 28px; height: 28px; border-radius: 50%;
          background: var(--teal-dim); border: 1.5px solid rgba(26,107,130,0.3);
          color: var(--teal); font-size: 0.76rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 2px; font-family: var(--font-b);
        }
        .step h4 { font-weight: 700; font-size: 0.9rem; color: var(--ink); margin-bottom: 4px; }
        .step p  { font-size: 0.85rem; color: var(--ink2); line-height: 1.65; }

        .faq-item { border-bottom: 1.5px solid var(--border); padding: 18px 0; }
        .faq-q { font-family: var(--font-d); font-size: 1.02rem; color: var(--ink); margin-bottom: 8px; font-style: italic; }
        .faq-a { font-size: 0.86rem; color: var(--ink2); line-height: 1.78; }

        .info-box {
          background: var(--teal-faint); border: 1px solid rgba(26,107,130,0.2);
          border-radius: 9px; padding: 14px 18px;
          font-size: 0.82rem; color: var(--ink2); line-height: 1.65; margin-bottom: 16px;
        }
        .info-box strong { color: var(--teal); }

        .cta-box {
          background: var(--ink); border-radius: var(--r);
          padding: 44px 36px; text-align: center; margin: 36px 0 52px;
        }
        .cta-box h2 { font-family: var(--font-d); font-size: 1.9rem; color: #fff; margin-bottom: 10px; }
        .cta-box h2 em { color: var(--teal3); font-style: italic; }
        .cta-box p  { color: rgba(255,255,255,0.5); margin-bottom: 22px; }
        .cta-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 11px 28px; border-radius: 7px;
          background: var(--teal); color: #fff;
          font-weight: 700; font-size: 0.87rem;
          font-family: var(--font-b); border: none; cursor: pointer;
          transition: all 0.15s; letter-spacing: 0.03em; text-decoration: none;
        }
        .cta-btn:hover { background: var(--teal2); }

        .footer {
          border-top: 1px solid var(--border2);
          padding: 24px 0; text-align: center;
          font-size: 0.74rem; color: var(--muted);
        }
        .footer a { color: var(--muted2); text-decoration: none; }
        .footer a:hover { color: var(--teal); }

        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .anim { animation: fadeUp 0.45s ease both; }
        .d1 { animation-delay: 0.05s; } .d2 { animation-delay: 0.13s; } .d3 { animation-delay: 0.22s; }

        @media(max-width:600px){
          .hero { padding: 36px 0 30px; }
          .input-card, .card { padding: 16px; }
          .result-hero { padding: 20px 16px; }
          .cta-box { padding: 28px 18px; }
        }
      `}</style>

      <div className="wrap">

        {/* ── HERO ── */}
        <header className="hero anim">
          <span className="hero-flag flex justify-center lg:justify-start"><Leaf className="w-8 h-8" style={{ color: "var(--maple)" }} /></span>
          <div className="hero-kicker">Canada · Official Rates</div>
          <h1>CPP & EI <em>Calculator</em><br />Canada Pension Plan & Employment Insurance</h1>
          <p className="hero-sub">
            Calculate your CPP retirement pension at any age from 60 to 70, your annual CPP and EI contributions,
            OAS entitlement, and EI benefit amount.
          </p>
          <div className="hero-stats">
            {[
              { num: fmtC(CPP_2024.maxMonthlyRetirement), label: "Max CPP/month (2024)" },
              { num: fmtC(OAS_2024.maxMonthly65to74), label: "Max OAS/month (65–74)" },
              { num: fmtC(EI_2024.maxWeeklyBenefit), label: "Max EI/week (2024)" },
              { num: fmtPct(CPP_2024.employeeRate * 100, 2), label: "CPP employee rate" },
            ].map(s => (
              <div className="hstat" key={s.label}>
                <span className="hstat-num">{s.num}</span>
                <span className="hstat-lbl">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Section nav */}
          <div className="section-nav">
            {[
              { id: "cpp", label: "CPP Calculator", icon: Landmark },
              { id: "ei", label: "EI Calculator", icon: ClipboardList },
              { id: "oas", label: "OAS Pension", icon: UserCheck }
            ].map(({ id, label, icon: Icon }) => (
              <button key={id} className={`snav-btn ${activeSection === id ? "active" : ""}`}
                onClick={() => setActiveSection(id)}>
                <Icon className="w-4 h-4 inline-block mr-2 -mt-0.5" />
                {label}
              </button>
            ))}
          </div>
        </header>

        {/* ══════════════════════ CPP SECTION ══════════════════════ */}
        {activeSection === "cpp" && (
          <div className="calc-grid" id="cpp-calculator">
            <div className="input-card anim d1">

              {/* Age slider — hero element */}
              <div className="panel-title">CPP Start Age</div>
              <div className="age-slider-block">
                <div className="age-display">{startAge}</div>
                <div className="age-sublabel">
                  {startAge < 65 ? `${((65 - startAge) * 12)} months early — ${fmtPct(Math.abs((cppAgeFactor(startAge) - 1) * 100))} reduction` :
                    startAge > 65 ? `${((startAge - 65) * 12)} months late — ${fmtPct((cppAgeFactor(startAge) - 1) * 100)} increase` :
                      "Standard age — no adjustment"}
                </div>
                <input type="range" min="60" max="70" step="1"
                  value={startAge} onChange={e => setStartAge(Number(e.target.value))} />
                <div className="age-labels"><span>60 (−36%)</span><span>65</span><span>70 (+42%)</span></div>
                <div className="age-factor-bar">
                  <div className="age-factor-fill" style={{ width: ((cppAgeFactor(startAge) - 0.64) / (1.42 - 0.64) * 100) + "%" }} />
                </div>
              </div>

              <div className="panel-title" style={{ marginTop: 6 }}>Your Earnings</div>
              <div className="field">
                <label>Average Annual Earnings (career)</label>
                <div className="iw"><span className="ipfx">CA$</span>
                  <input type="number" min="0" max="200000" value={avgEarnings} onChange={e => setAvgEarnings(Number(e.target.value))} />
                </div>
                <input type="range" min="0" max="120000" step="1000"
                  value={Math.min(avgEarnings, 120000)} onChange={e => setAvgEarnings(Number(e.target.value))} />
                <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: 3 }}>
                  2024 YMPE: {fmtC(CPP_2024.maxPensionableEarnings, 0)} · Max CPP pension applies at or above this level
                </div>
              </div>
              <div className="field">
                <label>Years Contributed to CPP</label>
                <div className="iw"><span className="ipfx">#</span>
                  <input type="number" min="1" max="39" value={yearsContrib} onChange={e => setYearsContrib(Number(e.target.value))} />
                </div>
                <input type="range" min="1" max="39" step="1"
                  value={yearsContrib} onChange={e => setYearsContrib(Number(e.target.value))} />
                <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: 3 }}>Maximum is 39 years. Dropout provisions apply for low-income years.</div>
              </div>
              <div className="field">
                <label>Current Age</label>
                <div className="iw"><span className="ipfx">#</span>
                  <input type="number" min="18" max="70" value={currentAge} onChange={e => setCurrentAge(Number(e.target.value))} />
                </div>
              </div>
              <div className="toggle-row">
                <span>Self-Employed (pay both shares)</span>
                <label className="toggle">
                  <input type="checkbox" checked={selfEmployed} onChange={e => setSelfEmployed(e.target.checked)} />
                  <div className="t-track" /><div className="t-thumb" />
                </label>
              </div>
            </div>

            {/* CPP Results */}
            <div className="result-panel">
              <div className="result-hero anim d2">
                <div className="rh-item">
                  <div className="rh-lbl">Monthly CPP at Age {startAge}</div>
                  <div className="rh-val accent">{fmtC(cpp.monthlyPension)}</div>
                  <div className="rh-sub">{fmtC(cpp.annualPension)} per year</div>
                </div>
                <div className="rh-item">
                  <div className="rh-lbl">Age Adjustment</div>
                  <div className={`rh-val ${startAge >= 65 ? "accent" : "maple"}`}>
                    {startAge === 65 ? "None" : startAge < 65 ? `−${fmtPct(Math.abs((cpp.ageFactor - 1) * 100))}` : `+${fmtPct((cpp.ageFactor - 1) * 100)}`}
                  </div>
                  <div className="rh-sub">vs. taking at 65</div>
                </div>
                <div className="rh-item">
                  <div className="rh-lbl">Combined Retirement Income</div>
                  <div className="rh-val">{fmtC(retirementTotal)}</div>
                  <div className="rh-sub">CPP + OAS (est.) per month</div>
                </div>
              </div>

              <div className="card anim d2">
                <div className="card-title">
                  <span>CPP Analysis</span>
                  <div className="tab-row" style={{ marginBottom: 0 }}>
                    {[["pension", "Pension"], ["age", "Age Comparison"], ["contrib", "Contributions"], ["chart", "Chart"]].map(([v, l]) => (
                      <button key={v} className={`tab ${cppTab === v ? "active" : ""}`} onClick={() => setCppTab(v)}>{l}</button>
                    ))}
                  </div>
                </div>

                {cppTab === "pension" && (
                  <div className="metrics-grid">
                    <div className="metric m-teal" style={{ gridColumn: "span 3" }}>
                      <div className="m-lbl">Estimated Monthly Pension at Age {startAge}</div>
                      <div className="m-val" style={{ fontSize: "2.2rem" }}>{fmtC(cpp.monthlyPension)}</div>
                      <div className="m-sub">{fmtC(cpp.annualPension, 0)} annually · Based on {yearsContrib} years contributing, avg {fmtC(avgEarnings, 0)} earnings</div>
                    </div>
                    <div className="metric">
                      <div className="m-lbl">Base Pension (at 65)</div>
                      <div className="m-val" style={{ fontSize: "1.2rem" }}>{fmtC(cpp.basePension)}</div>
                      <div className="m-sub">Before age adjustment</div>
                    </div>
                    <div className="metric">
                      <div className="m-lbl">CPP2 Enhancement</div>
                      <div className="m-val" style={{ fontSize: "1.2rem" }}>{fmtC(cpp.cpp2Benefit)}</div>
                      <div className="m-sub">On earnings above YMPE</div>
                    </div>
                    <div className="metric">
                      <div className="m-lbl">% of Maximum CPP</div>
                      <div className="m-val" style={{ fontSize: "1.2rem" }}>{fmtPct(cpp.monthlyPension / CPP_2024.maxMonthlyRetirement * 100)}</div>
                      <div className="m-sub">Max is {fmtC(CPP_2024.maxMonthlyRetirement)}/mo</div>
                    </div>
                    <div className="metric m-amber">
                      <div className="m-lbl">Max Disability (CPP-D)</div>
                      <div className="m-val" style={{ fontSize: "1.2rem" }}>{fmtC(CPP_2024.maxMonthlyDisability)}</div>
                      <div className="m-sub">Per month if eligible</div>
                    </div>
                    <div className="metric">
                      <div className="m-lbl">Survivor Benefit (65+)</div>
                      <div className="m-val" style={{ fontSize: "1.2rem" }}>{fmtC(CPP_2024.maxMonthlySurvivor65)}</div>
                      <div className="m-sub">Max monthly</div>
                    </div>
                    <div className="metric">
                      <div className="m-lbl">Death Benefit</div>
                      <div className="m-val" style={{ fontSize: "1.2rem" }}>{fmtC(CPP_2024.maxMonthlyDeath, 0)}</div>
                      <div className="m-sub">One-time payment</div>
                    </div>
                  </div>
                )}

                {cppTab === "age" && (
                  <div>
                    <div className="info-box">
                      <strong>Breakeven insight:</strong> Taking CPP early means smaller cheques but more of them. Taking it late means larger cheques starting later. The breakeven age — where lifetime totals equal — is typically around 74–76 when comparing age 65 vs. 70.
                    </div>
                    <div className="at-row header">
                      <span>Age</span>
                      <span>Monthly Amount</span>
                      <span style={{ textAlign: "right" }}>Monthly</span>
                      <span style={{ textAlign: "right" }}>Adjustment</span>
                      <span style={{ textAlign: "right" }}>Breakeven</span>
                    </div>
                    {cpp.ageComparison.map((row, i) => {
                      const base65 = cpp.ageComparison.find(r => r.age === 65)?.["Monthly Pension"] || 1;
                      const pct = row["Monthly Pension"] / base65;
                      const bk = cpp.ageBreakeven.find(b => b.age === row.age);
                      return (
                        <div key={row.age} className={`at-row ${row.age === startAge ? "selected" : ""}`}>
                          <span className="at-age">{row.age}{row.age === startAge ? " ←" : ""}</span>
                          <div className="at-bar-wrap">
                            <div className="at-bar-fill" style={{ width: (pct * 100) + "%" }} />
                          </div>
                          <span className="at-monthly">{fmtC(row["Monthly Pension"])}</span>
                          <span className={`at-factor ${row.age > 65 ? "up" : row.age < 65 ? "down" : ""}`}>
                            {row.age === 65 ? "Base" : row.age < 65 ? `−${((1 - row.factor) * 100).toFixed(1)}%` : `+${((row.factor - 1) * 100).toFixed(1)}%`}
                          </span>
                          <span className="at-brkeven">
                            {bk?.breakeven ? `≈ Age ${bk.breakeven}` : "—"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {cppTab === "contrib" && (
                  <div>
                    <div className="contrib-rows">
                      {[
                        { lbl: "Pensionable earnings", val: fmtC(Math.min(avgEarnings || 0, CPP_2024.maxPensionableEarnings)) },
                        { lbl: "− Basic exemption", val: `− ${fmtC(CPP_2024.basicExemption, 0)}` },
                        { lbl: "= Contributory earnings", val: fmtC(Math.max(0, Math.min(avgEarnings || 0, CPP_2024.maxPensionableEarnings) - CPP_2024.basicExemption)) },
                        { lbl: `× Employee rate (${fmtPct(CPP_2024.employeeRate * 100, 2)})`, val: "", sep: true },
                        {
                          lbl: selfEmployed ? "Self-employed CPP (both shares)" : "Employee CPP contribution",
                          val: fmtC(selfEmployed ? cpp.selfContrib : cpp.employeeContrib)
                        },
                        { lbl: "CPP2 contribution", val: fmtC(cpp.cpp2Contrib) },
                        ...(!selfEmployed ? [{ lbl: "Employer CPP contribution", val: fmtC(cpp.employerContrib) }] : []),
                      ].map((r, i) => r.sep ? null : (
                        <div key={i} className="cr">
                          <span className="cr-lbl">{r.lbl}</span>
                          <span className="cr-val">{r.val}</span>
                        </div>
                      ))}
                      <div className="cr total">
                        <span className="cr-lbl">Your Total CPP Contributions (2024)</span>
                        <span className="cr-val">{fmtC(cpp.totalContrib)}</span>
                      </div>
                    </div>
                    <div style={{ marginTop: 16, fontSize: "0.8rem", color: "var(--muted2)", lineHeight: 1.65 }}>
                      {selfEmployed
                        ? "As self-employed, you pay both the employee (5.95%) and employer (5.95%) share — total 11.9%. You can deduct half as a business expense."
                        : "Your employer matches your CPP contribution dollar-for-dollar. The combined contribution is " + fmtC(cpp.totalContrib + cpp.employerContrib) + "."}
                    </div>
                  </div>
                )}

                {cppTab === "chart" && (
                  <div>
                    <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: 12 }}>
                      Monthly CPP pension at each start age, based on your inputs. The 42% difference between age 60 and 70 is dramatic.
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={cpp.ageComparison} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis dataKey="age" tick={{ fontSize: 11, fontFamily: "var(--font-b)", fill: "var(--muted2)" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fontFamily: "var(--font-m)", fill: "var(--muted)" }} axisLine={false} tickLine={false} tickFormatter={v => "$" + v} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--teal-faint)" }} />
                        <ReferenceLine y={cpp.ageComparison.find(r => r.age === 65)?.["Monthly Pension"]} stroke="var(--muted2)" strokeDasharray="4 3" label={{ value: "Age 65 base", fill: "var(--muted)", fontSize: 10 }} />
                        <Bar dataKey="Monthly Pension" name="Monthly Pension" radius={[5, 5, 0, 0]}>
                          {cpp.ageComparison.map((d) => (
                            <Cell key={d.age} fill={d.age === startAge ? "var(--teal)" : d.age < 65 ? "var(--maple)" : "var(--teal3)"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════ EI SECTION ══════════════════════ */}
        {activeSection === "ei" && (
          <div className="calc-grid" id="ei-calculator">
            <div className="input-card anim d1">
              <div className="panel-title">Employment Details</div>

              <div className="field">
                <label>Weekly Earnings (before deductions)</label>
                <div className="iw"><span className="ipfx">CA$</span>
                  <input type="number" min="0" value={weeklyEarnings} onChange={e => setWeeklyEarnings(Number(e.target.value))} />
                </div>
                <input type="range" min="0" max="3000" step="50" value={Math.min(weeklyEarnings, 3000)} onChange={e => setWeeklyEarnings(Number(e.target.value))} />
                <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: 3 }}>Max insurable: {fmtC(EI_2024.maxInsurableEarnings / 52, 0)}/week</div>
              </div>

              <div className="field">
                <label>Insurable Hours Worked (last 52 weeks)</label>
                <div className="iw"><span className="ipfx">hrs</span>
                  <input type="number" min="0" max="2000" value={hoursWorked} onChange={e => setHoursWorked(Number(e.target.value))} />
                </div>
                <input type="range" min="0" max="2000" step="10" value={hoursWorked} onChange={e => setHoursWorked(Number(e.target.value))} />
              </div>

              <div className="field">
                <label>Region / Local Unemployment Rate</label>
                <div className="iw">
                  <select value={regionIdx} onChange={e => setRegionIdx(Number(e.target.value))}>
                    {EI_REGIONS.map((r, i) => <option key={i} value={i}>{r.label}</option>)}
                  </select>
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: 3 }}>
                  Minimum hours needed: {EI_REGIONS[regionIdx].minHours} · Max weeks: {EI_REGIONS[regionIdx].maxWeeks}
                </div>
              </div>

              <div className="field">
                <label>Reason for Claim</label>
                <div className="iw">
                  <select value={eiReason} onChange={e => setEiReason(e.target.value)}>
                    <option value="layoff">Job loss / layoff</option>
                    <option value="illness">Illness / injury (up to 15 weeks)</option>
                    <option value="maternity">Maternity (up to 15 weeks)</option>
                    <option value="parental">Parental leave (up to 40/69 weeks)</option>
                    <option value="compassionate">Compassionate care (up to 26 weeks)</option>
                    <option value="family">Family caregiver (up to 35 weeks)</option>
                  </select>
                </div>
              </div>

              <div className="toggle-row">
                <span>Quebec Resident (lower EI, pays QPIP)</span>
                <label className="toggle">
                  <input type="checkbox" checked={isQC} onChange={e => setIsQC(e.target.checked)} />
                  <div className="t-track" /><div className="t-thumb" />
                </label>
              </div>
            </div>

            {/* EI Results */}
            <div className="result-panel">
              <div className="result-hero anim d2">
                <div className="rh-item">
                  <div className="rh-lbl">Weekly EI Benefit</div>
                  <div className={`rh-val ${ei.eligible ? "accent" : "maple"}`}>{ei.eligible ? fmtC(ei.weeklyBenefit) : "Not eligible"}</div>
                  <div className="rh-sub">{ei.eligible ? fmtC(ei.monthlyBenefit) + "/month" : "Need " + EI_REGIONS[regionIdx].minHours + " hrs"}</div>
                </div>
                <div className="rh-item">
                  <div className="rh-lbl">Benefit Duration</div>
                  <div className="rh-val accent">{ei.eligible ? ei.durationWeeks + " weeks" : "—"}</div>
                  <div className="rh-sub">{ei.eligible ? "After 1-week waiting period" : "Insufficient insurable hours"}</div>
                </div>
                <div className="rh-item">
                  <div className="rh-lbl">Total EI Benefit</div>
                  <div className="rh-val">{ei.eligible ? fmtC(ei.totalBenefit, 0) : "—"}</div>
                  <div className="rh-sub">55% of insurable weekly earnings</div>
                </div>
              </div>

              <div className="card anim d2">
                <div className={`ei-status ${ei.eligible ? "eligible" : "ineligible"}`}>
                  <span className="ei-icon">{ei.eligible ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}</span>
                  <div>
                    <strong>{ei.eligible ? "EI Eligible" : "Not Currently EI Eligible"}</strong>
                    <div style={{ fontSize: "0.8rem", marginTop: 2, opacity: 0.8 }}>
                      {ei.eligible
                        ? `${hoursWorked} insurable hours meets the ${EI_REGIONS[regionIdx].minHours}-hour minimum for your region.`
                        : `You need ${EI_REGIONS[regionIdx].minHours - hoursWorked} more insurable hours to qualify in your region.`}
                    </div>
                  </div>
                </div>

                <div className="metrics-grid">
                  <div className="metric m-teal" style={{ gridColumn: "span 3" }}>
                    <div className="m-lbl">Your Annual EI Premium (Employee)</div>
                    <div className="m-val" style={{ fontSize: "2rem" }}>{fmtC(ei.annualPremium)}</div>
                    <div className="m-sub">{fmtPct(ei.rate * 100, 2)} × {fmtC(Math.min(weeklyEarnings * 52, EI_2024.maxInsurableEarnings), 0)} insurable earnings</div>
                  </div>
                  <div className="metric">
                    <div className="m-lbl">Weekly EI Premium</div>
                    <div className="m-val" style={{ fontSize: "1.2rem" }}>{fmtC(ei.weeklyPremium)}</div>
                    <div className="m-sub">Per paycheque (weekly)</div>
                  </div>
                  <div className="metric">
                    <div className="m-lbl">Employer EI Premium</div>
                    <div className="m-val" style={{ fontSize: "1.2rem" }}>{fmtC(ei.employerPremium)}</div>
                    <div className="m-sub">1.4× your premium</div>
                  </div>
                  <div className="metric">
                    <div className="m-lbl">Waiting Period</div>
                    <div className="m-val" style={{ fontSize: "1.2rem" }}>1 week</div>
                    <div className="m-sub">No benefits paid week 1</div>
                  </div>
                  <div className="metric m-green">
                    <div className="m-lbl">Replacement Rate</div>
                    <div className="m-val" style={{ fontSize: "1.2rem" }}>55%</div>
                    <div className="m-sub">Of insurable earnings</div>
                  </div>
                  <div className="metric">
                    <div className="m-lbl">Max Weekly Benefit</div>
                    <div className="m-val" style={{ fontSize: "1.2rem" }}>{fmtC(EI_2024.maxWeeklyBenefit)}</div>
                    <div className="m-sub">2024 maximum</div>
                  </div>
                  <div className="metric">
                    <div className="m-lbl">Max Insurable Earnings</div>
                    <div className="m-val" style={{ fontSize: "1.2rem" }}>{fmtC(EI_2024.maxInsurableEarnings, 0)}</div>
                    <div className="m-sub">Annual (2024)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════ OAS SECTION ══════════════════════ */}
        {activeSection === "oas" && (
          <div className="calc-grid" id="oas-calculator">
            <div className="input-card anim d1">
              <div className="panel-title">OAS Details</div>

              <div className="age-slider-block">
                <div className="age-display">{oasAge}</div>
                <div className="age-sublabel">
                  {oasAge === 65 ? "Standard start age" :
                    oasAge >= 75 ? `${((oasAge - 65) * 6)}% deferral bonus · 75+ enhanced rate` :
                      `${((oasAge - 65) * 12)} months deferred · ${fmtPct(oas.deferralBonus)} bonus`}
                </div>
                <input type="range" min="65" max="70" step="1"
                  value={oasAge} onChange={e => setOasAge(Number(e.target.value))} />
                <div className="age-labels"><span>65 (standard)</span><span>70 (+36%)</span></div>
              </div>

              <div className="field">
                <label>Annual Net Income (for clawback)</label>
                <div className="iw"><span className="ipfx">CA$</span>
                  <input type="number" min="0" value={oasIncome} onChange={e => setOasIncome(Number(e.target.value))} />
                </div>
                <input type="range" min="0" max="200000" step="1000"
                  value={Math.min(oasIncome, 200000)} onChange={e => setOasIncome(Number(e.target.value))} />
                <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: 3 }}>
                  OAS clawback starts at {fmtC(OAS_2024.clawbackThreshold, 0)} (2024)
                </div>
              </div>

              <div style={{ marginTop: 16, background: "var(--teal-faint)", border: "1px solid rgba(26,107,130,0.15)", borderRadius: 9, padding: "14px 16px", fontSize: "0.8rem", color: "var(--ink2)", lineHeight: 1.65 }}>
                <strong style={{ color: "var(--teal)" }}>Age 75+ note:</strong> Canadians who are 75+ as of July 2022 receive a permanent 10% increase in their OAS pension. Change the slider to 75+ to see this enhanced rate.
              </div>
            </div>

            <div className="result-panel">
              <div className="result-hero anim d2">
                <div className="rh-item">
                  <div className="rh-lbl">Gross OAS Monthly</div>
                  <div className="rh-val accent">{fmtC(oas.grossMonthly)}</div>
                  <div className="rh-sub">{fmtC(oas.grossMonthly * 12)} per year</div>
                </div>
                <div className="rh-item">
                  <div className="rh-lbl">OAS Clawback (monthly)</div>
                  <div className={`rh-val ${oas.monthlyClawback > 0 ? "maple" : "accent"}`}>{oas.monthlyClawback > 0 ? `− ${fmtC(oas.monthlyClawback)}` : "None"}</div>
                  <div className="rh-sub">{oas.monthlyClawback > 0 ? "Income above threshold" : "Below clawback threshold"}</div>
                </div>
                <div className="rh-item">
                  <div className="rh-lbl">Net OAS Monthly</div>
                  <div className="rh-val">{fmtC(oas.netMonthly)}</div>
                  <div className="rh-sub">{fmtC(oas.netMonthly * 12)} per year after clawback</div>
                </div>
              </div>

              <div className="card anim d2">
                <div className="metrics-grid">
                  <div className="metric m-teal" style={{ gridColumn: "span 3" }}>
                    <div className="m-lbl">Net Monthly OAS at Age {oasAge}</div>
                    <div className="m-val" style={{ fontSize: "2.2rem" }}>{fmtC(oas.netMonthly)}</div>
                    <div className="m-sub">{fmtC(oas.grossMonthly)} gross · {fmtC(oas.monthlyClawback)} clawback</div>
                  </div>
                  <div className="metric">
                    <div className="m-lbl">Deferral Bonus</div>
                    <div className="m-val" style={{ fontSize: "1.2rem" }}>{fmtPct(oas.deferralBonus)}</div>
                    <div className="m-sub">0.6%/month after 65</div>
                  </div>
                  <div className="metric">
                    <div className="m-lbl">Annual OAS</div>
                    <div className="m-val" style={{ fontSize: "1.2rem" }}>{fmtC(oas.netMonthly * 12, 0)}</div>
                    <div className="m-sub">Net annual</div>
                  </div>
                  <div className="metric m-maple">
                    <div className="m-lbl">Annual Clawback</div>
                    <div className="m-val" style={{ fontSize: "1.2rem" }}>{fmtC(oas.annualClawback, 0)}</div>
                    <div className="m-sub">At {fmtC(oasIncome, 0)} income</div>
                  </div>
                </div>

                {/* Clawback meter */}
                {oasIncome > OAS_2024.clawbackThreshold * 0.8 && (
                  <div className="clawback-meter">
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--muted2)" }}>
                      <span>OAS Clawback Meter</span>
                      <span>Clawback starts at {fmtC(OAS_2024.clawbackThreshold, 0)}</span>
                    </div>
                    <div className="clawback-bar">
                      <div className="clawback-fill" style={{ width: Math.min(100, Math.max(0, (oasIncome - OAS_2024.clawbackThreshold * 0.8) / (OAS_2024.clawbackThreshold * 0.4) * 100)) + "%" }} />
                    </div>
                    <div style={{ fontSize: "0.74rem", color: "var(--muted)", display: "flex", justifyContent: "space-between" }}>
                      <span>{fmtC(OAS_2024.clawbackThreshold * 0.8, 0)}</span>
                      <span>Full clawback ≈ {fmtC(OAS_2024.clawbackThreshold + oas.grossMonthly * 12 / OAS_2024.clawbackRate, 0)}</span>
                    </div>
                  </div>
                )}

                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: "0.8rem", color: "var(--muted2)", lineHeight: 1.65 }}>
                    <strong style={{ color: "var(--ink)" }}>GIS (Guaranteed Income Supplement):</strong> Low-income seniors may also qualify for GIS on top of OAS. In 2024, the maximum monthly GIS for a single person is $1,065.47. GIS is income-tested and not calculated here — apply through Service Canada.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            CONTENT SECTIONS
        ══════════════════════════════════════════ */}
        <div className="content-area">

          {/* ── What is CPP ── */}
          <section className="csection" id="about-cpp">
            <div className="sec-badge">Canada Pension Plan</div>
            <h2 className="sec-title">Understanding the <em>Canada Pension Plan</em></h2>
            <p className="sec-lead">
              The Canada Pension Plan (CPP) is a mandatory contributory retirement income program
              that provides monthly pension payments to Canadians who have worked and contributed
              to the plan. It is one of three pillars of Canada's retirement income system, alongside
              Old Age Security (OAS) and personal savings.
            </p>
            <div className="two-col">
              <div className="cbody">
                <p>
                  The <strong>Canada Pension Plan</strong> is administered by Employment and Social Development Canada (ESDC) and Service Canada. Almost every Canadian who works outside Quebec and earns more than $3,500 per year must contribute. Quebec has its own equivalent plan — the Quebec Pension Plan (QPP) — which provides similar benefits under provincial administration.
                </p>
                <p>
                  CPP contributions are mandatory during your working years — you cannot opt out. The contributions fund a diversified investment portfolio managed by the CPP Investments board, which had assets of over $590 billion as of 2024. The plan is designed to replace approximately 33% of your pre-retirement income (up from 25% before the CPP enhancement began in 2019), assuming you contributed at or above the YMPE for your career.
                </p>
                <p>
                  The <strong>CPP retirement pension</strong> is the most commonly received CPP benefit, but the plan also covers disability (CPP-D), survivor pensions for spouses of deceased contributors, children's benefits, and a one-time death benefit. This <strong>Canada pension plan calculator</strong> focuses on the retirement pension — use Service Canada's My Account for disability and survivor estimates.
                </p>
                <h3>CPP Enhancement — CPP2</h3>
                <p>
                  Since 2019, the federal government has been gradually enhancing the CPP. The first phase ran from 2019 to 2023, increasing the income replacement rate from 25% to 33% and raising the contribution rate from 4.95% to 5.95%. A second enhancement phase began in 2024, introducing <strong>CPP2</strong> — an additional tier of contributions and benefits on earnings between the Year's Maximum Pensionable Earnings ($68,500) and a new Year's Additional Maximum Pensionable Earnings ($73,200). CPP2 contributions are 4% on this band, building toward additional future benefits.
                </p>
                <h3>How Your CPP Amount Is Calculated</h3>
                <p>
                  The CPP retirement pension is based on three factors: how long you contributed, how much you earned relative to the YMPE, and what age you start receiving it. Service Canada uses your best 39 years of earnings (after excluding up to 8 low-income or zero-income years under the "dropout provisions") to calculate your average earnings. Dropout provisions also apply for periods of disability, low income while raising children under 7, and years after age 65 if you continue working.
                </p>
              </div>
              <div className="cbody">
                <h3>CPP vs. 65 vs. 70 — When Should You Take CPP?</h3>
                <p>
                  One of the most important and personal retirement decisions Canadians face is <strong>when to take CPP</strong>. The standard age is 65, but you can start as early as 60 (with a permanent reduction) or as late as 70 (with a permanent increase). The decision hinges on health, other income sources, longevity expectations, and tax planning.
                </p>
                <p>
                  <strong>Taking CPP early at 60:</strong> Your pension is permanently reduced by 0.6% for each month before 65 — a maximum reduction of 36% at age 60. You receive 36% less per month, for more months. If you need income and have no other sources, or have health concerns that reduce life expectancy, taking it early may be advantageous.
                </p>
                <p>
                  <strong>Taking CPP at 65:</strong> The standard option — no adjustment. Your pension reflects your contribution history directly.
                </p>
                <p>
                  <strong>Delaying CPP to 70:</strong> Your pension increases by 0.7% for each month after 65 — a maximum increase of 42% at age 70. You receive 42% more per month, for fewer months. If you are healthy, have other income sources to bridge the gap, and expect to live past 75–76, delaying is typically the mathematically superior choice. The break-even point against taking at 65 is approximately age 74–76, depending on assumptions.
                </p>
                <p>
                  The <strong>CPP benefit calculator</strong> tab above — specifically the "Age Comparison" sub-tab — shows your exact monthly pension at each age from 60 to 70 and calculates the break-even age against taking at 65.
                </p>
                <h3>CPP While Still Working</h3>
                <p>
                  Canadians between 60 and 70 who are receiving CPP and still working can contribute to the Post-Retirement Benefit (PRB). Each year of contributions builds additional PRB amounts that are added to your annual pension. You can stop contributing to CPP after age 65 by filing a CPT30 form with your employer. Under 65, contributions are mandatory even if you are already receiving CPP.
                </p>
              </div>
            </div>
          </section>

          {/* ── CPP Application ── */}
          <section className="csection" id="cpp-application">
            <div className="sec-badge">Canada Pension Plan Application</div>
            <h2 className="sec-title"><em>CPP Application Canada</em> — How to Apply</h2>
            <p className="sec-lead">
              Applying for CPP retirement pension requires planning — Service Canada recommends applying
              six months before you want your pension to start. Here is exactly how the
              Canada pension plan application process works.
            </p>
            <div className="two-col">
              <div>
                <ol className="steps">
                  {[
                    { title: "Confirm Your Start Date", body: "Decide at what age you want to start receiving CPP. Remember that CPP is not automatic — you must apply. If you delay your application past 65, benefits do not accrue retroactively beyond 12 months (you can receive up to 12 months of retroactive payments if you apply late)." },
                    { title: "Gather Required Information", body: "You will need your Social Insurance Number (SIN), banking information for direct deposit, your children's SINs if applicable for the child-rearing dropout provision, and information about your spouse for survivor benefit coordination." },
                    { title: "Apply Online via My Service Canada Account", body: "The fastest method is through My Service Canada Account (MSCA) at canada.ca. The online application takes approximately 20 minutes. You can also apply by mailing Form ISP1000 to Service Canada, or visiting a Service Canada Centre in person." },
                    { title: "Apply 6 Months in Advance", body: "Service Canada recommends applying 6 months before you want your pension to start. Processing typically takes 7–14 weeks for complete applications. Apply early to avoid gaps in income." },
                    { title: "Review Your Statement of Contributions", body: "Before applying, review your CPP Statement of Contributions through My Service Canada Account to verify your contribution history is accurate. Errors in your contribution record can reduce your pension. Report any discrepancies to Service Canada." },
                    { title: "Set Up Direct Deposit", body: "CPP is paid on a monthly schedule (last banking day of each month for most recipients). Set up direct deposit during the application to receive funds promptly. The first payment typically arrives 2–3 months after your application is approved." },
                  ].map((s, i) => (
                    <li key={i} className="step">
                      <span className="step-num">{i + 1}</span>
                      <div><h4>{s.title}</h4><p>{s.body}</p></div>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="cbody">
                <h3>CPP Payment Dates 2024</h3>
                <p>CPP retirement pensions are paid on the last banking day of each month. Key 2024 payment dates:</p>
                <div className="tbl-wrap">
                  <table>
                    <thead><tr><th>Month</th><th>Payment Date</th></tr></thead>
                    <tbody>
                      {[
                        ["January", "Jan 29, 2024"], ["February", "Feb 27, 2024"],
                        ["March", "Mar 26, 2024"], ["April", "Apr 26, 2024"],
                        ["May", "May 29, 2024"], ["June", "Jun 26, 2024"],
                        ["July", "Jul 29, 2024"], ["August", "Aug 28, 2024"],
                        ["September", "Sep 25, 2024"], ["October", "Oct 29, 2024"],
                        ["November", "Nov 27, 2024"], ["December", "Dec 20, 2024"],
                      ].map(([m, d]) => <tr key={m}><td>{m}</td><td className="td-teal">{d}</td></tr>)}
                    </tbody>
                  </table>
                </div>

                <h3 style={{ marginTop: 24 }}>CPP Disability Benefit</h3>
                <p>
                  The CPP Disability benefit pays <strong>{fmtC(CPP_2024.maxMonthlyDisability)}/month</strong> (2024 maximum) to contributors who have a severe and prolonged mental or physical disability. To qualify, you must have contributed to CPP in at least 4 of the last 6 years (or 3 of the last 6 years if you have 25+ years of contributions). The benefit automatically converts to a CPP retirement pension at age 65.
                </p>
                <h3>Children's Benefit and Survivor Pension</h3>
                <p>
                  Dependent children of CPP disability recipients or deceased CPP contributors can receive a monthly flat-rate benefit of <strong>{fmtC(CPP_2024.maxMonthlyChildren)}/month</strong> (2024). The surviving spouse or common-law partner of a deceased contributor may receive a survivor's pension of up to <strong>{fmtC(CPP_2024.maxMonthlySurvivor65)}/month</strong> at age 65+, or a lower amount under 65. A one-time death benefit of up to <strong>{fmtC(CPP_2024.maxMonthlyDeath, 0)}</strong> is paid to the estate.
                </p>
              </div>
            </div>
          </section>

          {/* ── OAS Section ── */}
          <section className="csection" id="about-oas">
            <div className="sec-badge">Canada Old Age Pension</div>
            <h2 className="sec-title"><em>Canada Old Age Pension</em> — OAS & GIS Guide</h2>
            <p className="sec-lead">
              Old Age Security (OAS) is Canada's largest pension program, providing monthly payments
              to most Canadians aged 65 and over regardless of work history. Understanding how OAS,
              the Guaranteed Income Supplement (GIS), and the Allowance programs work is essential
              for retirement planning.
            </p>
            <div className="two-col">
              <div className="cbody">
                <p>
                  Unlike CPP, <strong>Canada old age pension</strong> (OAS) does not depend on employment history or contributions. It is funded from general government revenues and is based primarily on how long you have lived in Canada after age 18. To receive the full OAS pension, you must have lived in Canada for at least 40 years after age 18. Partial pensions (1/40th for each year of residence) are available with a minimum of 10 years of Canadian residence.
                </p>
                <p>
                  The maximum <strong>OAS pension in 2024</strong> is <strong>{fmtC(OAS_2024.maxMonthly65to74)}/month</strong> for ages 65 to 74, and <strong>{fmtC(OAS_2024.maxMonthly75plus)}/month</strong> for those 75 and older — a 10% permanent increase that was introduced in 2022 for Canadians 75+. OAS amounts are indexed to inflation quarterly.
                </p>
                <p>
                  You can defer OAS beyond 65 by up to 5 years (to age 70), receiving an additional 0.6% per month deferred — a maximum 36% increase at age 70. Unlike CPP, you cannot take OAS before 65.
                </p>
                <h3>The OAS Clawback (Recovery Tax)</h3>
                <p>
                  Higher-income retirees may have part or all of their OAS clawed back through the OAS Recovery Tax. In 2024, the clawback begins when net income exceeds <strong>{fmtC(OAS_2024.clawbackThreshold, 0)}</strong>. For each dollar above this threshold, 15 cents of OAS is recovered. The full OAS pension is eliminated at approximately $148,000 in income (for those receiving the full pension at 65).
                </p>
                <p>
                  Tax planning strategies to minimize the OAS clawback include income splitting with a spouse, RRSP-to-RRIF withdrawals timed to lower-income years, TFSA withdrawals (which do not count as income), and deferring capital gains realizations.
                </p>
              </div>
              <div className="cbody">
                <h3>Guaranteed Income Supplement (GIS)</h3>
                <p>
                  The GIS is a non-taxable monthly benefit paid to low-income OAS recipients who live in Canada. In 2024, the maximum GIS for a single person is approximately <strong>$1,065.47/month</strong> (combined with OAS, the maximum for a single low-income senior is over $1,778/month). GIS is income-tested — you must reapply each year and it is based on the previous year's income tax return.
                </p>
                <p>
                  Many eligible seniors do not receive GIS because they either don't apply or don't file a tax return. Service Canada encourages all seniors to file a tax return even with zero income to ensure automatic GIS eligibility assessment.
                </p>
                <h3>The Allowance Program</h3>
                <p>
                  The Allowance is a benefit for low-income Canadians aged 60–64 whose spouse or common-law partner receives OAS and GIS. The Allowance for the Survivor is a similar benefit for those aged 60–64 whose spouse or partner has died. These programs bridge the income gap between a partner's retirement at 65 and the younger partner's own OAS eligibility at 65.
                </p>
                <h3>How to Apply for OAS</h3>
                <p>
                  Many Canadians are automatically enrolled in OAS at 65 — Service Canada will send a notification letter if you are automatically enrolled. If you are not automatically enrolled (typically those without a long Canadian tax filing history), you must apply through My Service Canada Account or by mailing Form ISP3550. Apply 6 months before you want your pension to start. If you want to defer past 65, you must actively inform Service Canada that you are deferring.
                </p>
              </div>
            </div>
          </section>

          {/* ── EI Guide ── */}
          <section className="csection" id="about-ei">
            <div className="sec-badge">Employment Insurance</div>
            <h2 className="sec-title">Employment Insurance <em>Benefits Canada</em> — Complete Guide</h2>
            <p className="sec-lead">
              Employment Insurance (EI) provides temporary income replacement to Canadians who lose their job,
              become ill, or take parental leave. Here is everything you need to know about qualifying,
              applying, and calculating your benefit amount.
            </p>
            <div className="two-col">
              <div className="cbody">
                <h3>How Much EI Will I Get?</h3>
                <p>
                  Your <strong>EI benefit</strong> is calculated as 55% of your average insurable weekly earnings, up to the maximum insurable amount of <strong>{fmtC(EI_2024.maxInsurableEarnings, 0)}</strong> in 2024. This produces a maximum weekly benefit of <strong>{fmtC(EI_2024.maxWeeklyBenefit)}/week</strong>. Low-income claimants with children (family net income under $25,921 and a Family Supplement) may receive up to 80% replacement.
                </p>
                <p>
                  The average weekly earnings used are calculated from the best 14 to 22 weeks of earnings in the qualifying period (52 weeks or since the last claim), depending on your regional unemployment rate. Higher-unemployment regions use fewer best weeks, which tends to produce higher weekly benefit amounts for workers with variable earnings.
                </p>
                <h3>EI Waiting Period</h3>
                <p>
                  There is a mandatory <strong>1-week waiting period</strong> at the beginning of every EI claim for which no benefits are paid. This applies to regular (job loss), sickness, and most special benefits. It functions as a deductible — you are responsible for your own income during the first week. Some employer severance packages and vacation pay can also delay when EI benefits begin if they cover the same period.
                </p>
                <h3>EI Benefit Duration</h3>
                <p>
                  How long you receive EI benefits depends on two factors: the number of insurable hours accumulated in the qualifying period, and the regional unemployment rate where you live. Higher-unemployment regions require fewer hours to qualify and offer more weeks of benefits (up to 45 weeks). Lower-unemployment areas like Toronto and Calgary require 700 hours to qualify and provide as few as 14 weeks. The maximum duration for regular EI is 45 weeks.
                </p>
              </div>
              <div className="cbody">
                <h3>EI Special Benefits</h3>
                <p>
                  Beyond regular job-loss benefits, EI covers several special benefit categories:
                </p>
                <p>
                  <strong>Sickness Benefits:</strong> Up to 15 weeks at 55% of earnings for those unable to work due to illness, injury, or quarantine. A medical certificate is required.
                </p>
                <p>
                  <strong>Maternity Benefits:</strong> Up to 15 weeks for the birth mother or surrogate, starting up to 12 weeks before the expected birth date.
                </p>
                <p>
                  <strong>Parental Benefits:</strong> Either Standard (up to 40 weeks at 55% replacement, shared between parents, up to 35 weeks per parent) or Extended (up to 69 weeks at 33% replacement, up to 61 weeks per parent). Cannot be combined with the other option.
                </p>
                <p>
                  <strong>Compassionate Care Benefits:</strong> Up to 26 weeks for those caring for a gravely ill family member at significant risk of dying.
                </p>
                <p>
                  <strong>Family Caregiver Benefits:</strong> Up to 35 weeks for those caring for a critically ill or injured family member (adult or child).
                </p>
                <h3>Quebec QPIP vs. EI</h3>
                <p>
                  Quebec residents pay a lower EI rate (1.29% vs 1.66%) because Quebec operates the <strong>Quebec Parental Insurance Plan (QPIP)</strong> separately. QPIP provides more generous parental benefits than federal EI: a higher replacement rate (70–75% vs 55%), no waiting period for maternity/paternity, and paternity benefits exclusively for fathers/second parents. Quebec employees and employers pay both the reduced EI premium and the QPIP premium.
                </p>
                <h3>Applying for EI</h3>
                <p>
                  Apply online at canada.ca as soon as you stop working — do not wait for your Record of Employment (ROE) from your employer. Service Canada can access your ROE electronically. Apply within 4 weeks of your last day of work; late applications may result in a delay or loss of benefits. You will need your SIN, banking information, employer contact details, and the dates and reason for separation.
                </p>
              </div>
            </div>

            {/* EI rates comparison */}
            <div className="tbl-wrap" style={{ marginTop: 28 }}>
              <table>
                <thead>
                  <tr>
                    <th>Province</th>
                    <th>Employee EI Rate</th>
                    <th>Annual Premium ($63,200)</th>
                    <th>Employer Rate</th>
                    <th>Annual Employer Premium</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["All provinces except QC", "1.66%", fmtC(63200 * 0.0166), "2.32%", fmtC(63200 * 0.0232), "Standard rate"],
                    ["Quebec (QC)", "1.29%", fmtC(63200 * 0.0129), "1.81%", fmtC(63200 * 0.0181), "Lower due to QPIP"],
                  ].map(r => <tr key={r[0]}><td>{r[0]}</td><td className="td-teal">{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td><td>{r[4]}</td><td style={{ fontSize: "0.79rem" }}>{r[5]}</td></tr>)}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="csection" id="faq">
            <div className="sec-badge">FAQ</div>
            <h2 className="sec-title">Frequently Asked <em>Questions</em></h2>
            <div style={{ maxWidth: 840 }}>
              {[
                {
                  q: "What is the maximum CPP pension in 2024?",
                  a: "The maximum CPP retirement pension in 2024 for a new recipient starting at age 65 is $1,364.60 per month ($16,375.20 per year). The average new CPP retirement pension in 2024 is approximately $758.32 per month — significantly lower than the maximum because most Canadians did not contribute at the maximum level for their entire career. To receive the maximum, you would need to have contributed at or above the YMPE ($68,500 in 2024) for approximately 39 years. Use the Canada pension plan calculator above to estimate your specific pension based on your actual earnings and contribution years."
                },
                {
                  q: "How is the Canada pension plan calculator used for retirement planning?",
                  a: "A Canada pension plan calculator helps you estimate your CPP retirement pension based on your average career earnings, years contributed, and the age you plan to start receiving the pension. You should compare your estimated CPP pension against your retirement income needs, factoring in OAS (which adds approximately $713/month at 65), any workplace pension, RRSPs/TFSAs, and other savings. A comprehensive retirement plan typically targets 70–80% of pre-retirement income. CPP + OAS together can replace approximately 40–50% of an average Canadian worker's income — meaning personal savings must bridge the remainder."
                },
                {
                  q: "When should I start CPP — at 60, 65, or 70?",
                  a: "The optimal start age for CPP depends on your health, other income sources, and longevity expectations. Taking CPP at 60 gives you 60% of the amount you would receive at 65 — but you receive it for 5 more years. The break-even point against taking at 65 is approximately age 74. If you expect to live past 74 and don't need the money immediately, waiting is typically advantageous. Delaying to 70 gives you 142% of your age-65 amount. The break-even against taking at 65 is approximately age 74–76 as well — meaning if you live past that age, you come out ahead by delaying. The CPP at 60 vs 65 vs 70 comparison tab in the calculator above shows your exact numbers."
                },
                {
                  q: "How do I apply for the Canada Pension Plan?",
                  a: "You apply for CPP through Service Canada. The fastest method is online via My Service Canada Account (MSCA) at canada.ca — the application takes about 20 minutes and you can track its status online. Apply 6 months before you want payments to start; processing takes 6–12 weeks. You can also apply by mailing Form ISP1000 or visiting a Service Canada Centre. Note that CPP is not automatic — you must proactively apply even after paying into the plan for decades."
                },
                {
                  q: "What is the Canada old age pension amount for 2024?",
                  a: "The Canada old age pension (OAS) maximum monthly amount in 2024 is $713.34 for those aged 65 to 74, and $784.67 for those aged 75 and over (reflecting the 10% permanent enhancement for 75+ that began in July 2022). These amounts are indexed to the Consumer Price Index and adjusted quarterly. The OAS clawback begins at $90,997 in net income (2024), with 15 cents recovered for each dollar above the threshold. You can also defer OAS past 65 to increase the amount by 0.6% per month, up to 36% more at age 70."
                },
                {
                  q: "How much EI will I get if I'm laid off in Canada?",
                  a: "Your EI benefit is 55% of your average insurable weekly earnings, to a maximum of $668/week in 2024 (based on the $63,200 annual maximum insurable earnings limit). The average weekly earnings used in the calculation are your best weeks over the last 52 weeks — from 14 to 22 weeks depending on your region's unemployment rate. To qualify, you typically need 420 to 700 insurable hours depending on your region. Benefits last from 14 to 45 weeks. Use the EI calculator tab above to get your specific estimated weekly benefit and duration."
                },
                {
                  q: "What is CPP2 and how does it affect my contributions?",
                  a: "CPP2 is a second tier of Canada Pension Plan contributions that began in 2024. It applies to earnings between the Year's Maximum Pensionable Earnings ($68,500) and the new Year's Additional Maximum Pensionable Earnings ($73,200). Employees and employers each contribute 4% on earnings in this band ($188 maximum per party in 2024). CPP2 contributions build toward additional future pension benefits on top of the base CPP. If your earnings are below $68,500, CPP2 does not apply to you."
                },
                {
                  q: "Can I receive CPP while still working?",
                  a: "Yes. You can receive your CPP retirement pension while continuing to work. If you are under 65 and still working while receiving CPP, you and your employer must continue making CPP contributions — these build Post-Retirement Benefits (PRB) that are added to your pension annually. After age 65, contributions are optional: you can file a CPT30 election with your employer to stop contributing. Each year of PRB contributions adds a small permanent monthly amount to your pension."
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
            <h2>Plan Your <em>Canadian Retirement</em></h2>
            <p>Use the CPP, OAS, and EI calculators above.</p>
            <button className="cta-btn" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              Calculate My Benefits <ArrowUp className="w-4 h-4 ml-1" />
            </button>
          </div>

        </div>

        <footer className="footer">
          <p>CPP & EI Calculator Canada 2024 · Based on Service Canada rates · For estimation only · Not official benefit determination</p>
          <p style={{ marginTop: 8 }}>
            <a href="#cpp-calculator">CPP Calculator</a> · <a href="#ei-calculator">EI Calculator</a> · <a href="#oas-calculator">OAS</a> · <a href="#about-cpp">About CPP</a> · <a href="#cpp-application">CPP Application</a> · <a href="#about-oas">Old Age Pension</a> · <a href="#faq">FAQ</a>
          </p>
        </footer>

      </div>
    </>
  );
}
