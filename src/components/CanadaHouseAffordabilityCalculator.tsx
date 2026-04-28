"use client";

import { useState, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";

// ─── 2026 Canadian Mortgage Constants ────────────────────────────────────────
const STRESS_TEST_RATE   = 0.07;       // 5.25% or contract + 2%, currently ~7% applies
const CMHC_PREMIUM_TIERS = [
  { minDown: 0.05, maxDown: 0.0999, rate: 0.0400 },
  { minDown: 0.10, maxDown: 0.1499, rate: 0.0310 },
  { minDown: 0.15, maxDown: 0.1999, rate: 0.0280 },
  { minDown: 0.20, maxDown: 1.0000, rate: 0.0000 }, // 20%+ no CMHC
];
const CMHC_MAX_PRICE = 1_500_000;

const LTT = {
  ON: {
    name: "Ontario",
    provincial: (price: number) => {
      let t = 0;
      const tiers = [[55000,0.005],[250000,0.01],[400000,0.015],[2000000,0.02],[Infinity,0.025]];
      let prev = 0;
      for (const [cap, rate] of tiers) {
        if (price <= prev) break;
        t += (Math.min(price, cap) - prev) * rate;
        prev = cap;
      }
      return t;
    },
    toronto: (price: number) => { // Toronto MLTT (same brackets)
      let t = 0;
      const tiers = [[55000,0.005],[250000,0.01],[400000,0.015],[2000000,0.02],[Infinity,0.025]];
      let prev = 0;
      for (const [cap, rate] of tiers) {
        if (price <= prev) break;
        t += (Math.min(price, cap) - prev) * rate;
        prev = cap;
      }
      return t;
    },
    firstTimeBuyerRebate: (price: number) => Math.min(price <= 368000 ? price * 0.005 : 1850 + (price - 368000) * 0, 4000),
  },
  BC: {
    name: "British Columbia",
    provincial: (price: number) => {
      let t = 0;
      if (price <= 200000)  t = price * 0.01;
      else if (price <= 2000000) t = 2000 + (price - 200000) * 0.02;
      else if (price <= 3000000) t = 38000 + (price - 2000000) * 0.03;
      else t = 68000 + (price - 3000000) * 0.05;
      return t;
    },
    firstTimeBuyerRebate: (price: number) => price <= 500000 ? price * 0.01 + (price > 200000 ? (price-200000)*0.02 : 0) : 0,
  },
  AB: { name: "Alberta",       provincial: () => 0, note: "No provincial land transfer tax" },
  QC: {
    name: "Quebec",
    provincial: (price: number) => {
      let t = 0;
      if (price <= 58900)      t = price * 0.005;
      else if (price <= 294600) t = 294.5 + (price - 58900) * 0.01;
      else if (price <= 517900) t = 2650.5 + (price - 294600) * 0.015;
      else if (price <= 1035800)t = 6003 + (price - 517900) * 0.02;
      else                      t = 16359 + (price - 1035800) * 0.025;
      return t;
    },
    firstTimeBuyerRebate: () => 0,
  },
  MB: {
    name: "Manitoba",
    provincial: (price: number) => {
      if (price <= 30000)  return 0;
      if (price <= 90000)  return (price - 30000) * 0.005;
      if (price <= 150000) return 300 + (price - 90000) * 0.01;
      if (price <= 200000) return 900 + (price - 150000) * 0.015;
      return 1650 + (price - 200000) * 0.02;
    },
    firstTimeBuyerRebate: (price: number) => price <= 150000 ? Math.min(price*0.01, 1500) : 0,
  },
  NS: { name: "Nova Scotia",    provincial: (price: number) => price * 0.015, firstTimeBuyerRebate: () => 0 },
  SK: { name: "Saskatchewan",   provincial: () => 0, note: "Title transfer fee (flat ~$500)" },
  NB: { name: "New Brunswick",  provincial: (price: number) => price * 0.01, firstTimeBuyerRebate: () => 0 },
  NL: { name: "Newfoundland",   provincial: (price: number) => price * 0.015 * 0.5, firstTimeBuyerRebate: () => 0 },
  PE: { name: "PEI",            provincial: (price: number) => price * 0.01, firstTimeBuyerRebate: () => 0 },
};

const fmtC = (n: number, d = 0) => {
  if (isNaN(n) || !isFinite(n)) return "$0";
  return "$" + Math.abs(n).toLocaleString("en-CA", { minimumFractionDigits: d, maximumFractionDigits: d });
};
const fmtPct = (n: number, d = 1) => (isNaN(n) ? "0" : n.toFixed(d)) + "%";

const monthlyPayment = (principal: number, annualRate: number, amortYears: number) => {
  if (annualRate === 0) return principal / (amortYears * 12);
  const r = annualRate / 2;
  const em = Math.pow(1 + r, 1/6) - 1;
  const n  = amortYears * 12;
  return principal * em * Math.pow(1 + em, n) / (Math.pow(1 + em, n) - 1);
};

const minDownPayment = (price: number) => {
  if (price < 500000)  return price * 0.05;
  if (price < 1000000) return 25000 + (price - 500000) * 0.10;
  return price * 0.20;
};

const cmhcPremium = (price: number, downAmt: number) => {
  if (price > CMHC_MAX_PRICE) return 0;
  if (downAmt < 0) return 0;
  const ratio = downAmt / price;
  const tier = CMHC_PREMIUM_TIERS.find(t => ratio >= t.minDown && ratio <= t.maxDown);
  if (!tier || tier.rate === 0) return 0;
  const insuredAmt = price - downAmt;
  return insuredAmt * tier.rate;
};

const maxPriceFromIncome = (grossIncome: number, otherDebt: number, rate: number, amort: number, downPct: number, taxesInsurance: number) => {
  const monthlyIncome = grossIncome / 12;
  const maxMonthlyTotal = monthlyIncome * 0.44;
  const maxMortgagePayment = maxMonthlyTotal - taxesInsurance - otherDebt;
  if (maxMortgagePayment <= 0) return 0;
  const stressRate = Math.max(rate + 0.02, STRESS_TEST_RATE);
  const em = Math.pow(1 + stressRate / 2, 1/6) - 1;
  const n  = amort * 12;
  const principal = maxMortgagePayment * (Math.pow(1 + em, n) - 1) / (em * Math.pow(1 + em, n));
  const price = principal / (1 - Math.min(downPct, 1));
  return Math.max(0, price);
};

const buildAmortChart = (principal: number, annualRate: number, amortYears: number) => {
  const em = annualRate > 0 ? Math.pow(1 + annualRate / 2, 1/6) - 1 : 0;
  const pmt = monthlyPayment(principal, annualRate, amortYears);
  let balance = principal;
  const data = [];
  for (let yr = 0; yr <= amortYears; yr++) {
    data.push({ year: yr, Balance: Math.round(Math.max(0, balance)), Principal: Math.round(principal - balance) });
    for (let m = 0; m < 12 && balance > 0; m++) {
      const interest = balance * em;
      const princ    = Math.min(pmt - interest, balance);
      balance = Math.max(0, balance - princ);
    }
  }
  return data;
};

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0e1c2e", border: "1px solid #1e3550", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#b8cfe0" }}>
      <p style={{ fontWeight: 700, color: "#fff", marginBottom: 4 }}>Year {label}</p>
      {payload.map((p: any) => <p key={p.name} style={{ color: p.color }}>{p.name}: {fmtC(p.value)}</p>)}
    </div>
  );
};

export default function CanadaHouseAffordabilityCalculator() {
  const [grossIncome,   setGrossIncome]   = useState<any>(120000);
  const [coIncome,      setCoIncome]      = useState<any>(0);
  const [downPayment,   setDownPayment]   = useState<any>(80000);
  const [homePrice,     setHomePrice]     = useState<any>(600000);
  const [mortgageRate,  setMortgageRate]  = useState<any>(5.24);
  const [amortization,  setAmortization]  = useState<any>(25);
  const [otherDebt,     setOtherDebt]     = useState<any>(500);
  const [propertyTax,   setPropertyTax]   = useState<any>(400);
  const [condoFees,     setCondoFees]     = useState<any>(0);
  const [heatingCost,   setHeatingCost]   = useState<any>(150);
  const [province,      setProvince]      = useState<any>("ON");
  const [isTorontoCity, setIsTorontoCity] = useState(false);
  const [isFirstTime,   setIsFirstTime]   = useState(false);
  const [mode,          setMode]          = useState("check");
  const [activeTab,     setActiveTab]     = useState("summary");

  const ltt = (LTT as any)[province] || LTT.ON;
  const totalIncome = (parseFloat(grossIncome) || 0) + (parseFloat(coIncome) || 0);
  const rate        = (parseFloat(mortgageRate) || 5.24) / 100;
  const amort       = parseInt(amortization) || 25;
  const price       = parseFloat(homePrice) || 0;
  const down        = parseFloat(downPayment) || 0;

  const calc = useMemo(() => {
    const monthlyIncome = totalIncome / 12;
    const downAmt   = mode === "find" ? price * 0.10 : down;
    const downPct   = price > 0 ? downAmt / price : 0;
    const minDown   = minDownPayment(price);
    const isInsured = price <= CMHC_MAX_PRICE && downAmt < price * 0.20;
    const cmhc    = cmhcPremium(price, downAmt);
    const mortgage = price - downAmt + cmhc;
    const stressRate = Math.max(rate + 0.02, 0.0525);
    const monthlyMortgage = monthlyPayment(mortgage, rate, amort);
    const monthlyStress   = monthlyPayment(mortgage, stressRate, amort);
    const monthlyHeat    = parseFloat(heatingCost) || 150;
    const monthlyTax     = parseFloat(propertyTax) || 0;
    const monthlyCondo   = parseFloat(condoFees)   || 0;
    const monthlyOther   = parseFloat(otherDebt)   || 0;
    const gdsNum   = monthlyStress + monthlyTax + monthlyHeat + monthlyCondo;
    const gds      = monthlyIncome > 0 ? (gdsNum / monthlyIncome) * 100 : 0;
    const gdsLimit = 39;
    const tdsNum   = gdsNum + monthlyOther;
    const tds      = monthlyIncome > 0 ? (tdsNum / monthlyIncome) * 100 : 0;
    const tdsLimit = 44;
    const gdsPass  = gds <= gdsLimit;
    const tdsPass  = tds <= tdsLimit;
    const gdsScore  = Math.max(0, 100 - Math.max(0, gds - gdsLimit) * 10);
    const tdsScore  = Math.max(0, 100 - Math.max(0, tds - tdsLimit) * 10);
    const downScore = Math.min(100, (downAmt / price) * 500);
    const affordabilityScore = Math.round((gdsScore * 0.4 + tdsScore * 0.4 + downScore * 0.2));
    const monthlyFixed = monthlyTax + monthlyHeat + monthlyCondo;
    const maxPrice = maxPriceFromIncome(totalIncome, monthlyOther, stressRate, amort, downPct || 0.10, monthlyFixed);
    const provLTT = ltt.provincial ? ltt.provincial(price) : 0;
    const cityLTT = isTorontoCity && province === "ON" && ltt.toronto ? ltt.toronto(price) : 0;
    const ftbRebate = isFirstTime && ltt.firstTimeBuyerRebate ? ltt.firstTimeBuyerRebate(price) : 0;
    const netLTT   = Math.max(0, provLTT + cityLTT - ftbRebate);
    const legalFees = 1500;
    const inspection = 500;
    const titleInsurance = 300;
    const movingCosts = 2000;
    const totalClosing = netLTT + legalFees + inspection + titleInsurance + movingCosts + cmhc * 0.08;
    const monthlyTotal = monthlyMortgage + monthlyTax + monthlyHeat + monthlyCondo + mortgage * 0.001 / 12;
    const amortData = buildAmortChart(mortgage, rate, amort);
    const totalPaid    = monthlyMortgage * amort * 12;
    const totalInterest = totalPaid - mortgage;

    return {
      downAmt, downPct, minDown, isInsured, cmhc, mortgage, monthlyMortgage, monthlyStress,
      stressRate, gds, tds, gdsPass, tdsPass, affordabilityScore, maxPrice, provLTT, cityLTT,
      ftbRebate, netLTT, legalFees, inspection, titleInsurance, movingCosts, totalClosing,
      monthlyTotal, amortData, totalPaid, totalInterest, monthlyIncome, monthlyTax, monthlyHeat,
      monthlyCondo, monthlyOther, gdsNum, tdsNum, gdsLimit, tdsLimit,
    };
  }, [totalIncome, down, homePrice, mortgageRate, amortization, otherDebt, propertyTax, condoFees, heatingCost, province, isTorontoCity, isFirstTime, mode, ltt, rate, amort, price, down]);

  const gaugeColor = calc.affordabilityScore >= 70 ? "#2d9e6b" : calc.affordabilityScore >= 45 ? "#d4820a" : "#c03a2b";
  const gaugeAngle = (calc.affordabilityScore / 100) * 180;

  return (
    <div id="calculator">
      <div className="mode-toggle mb-8">
        <button className={`mode-btn ${mode==="check"?"active":""}`} onClick={() => setMode("check")}>
          ✓ Check a Specific Price
        </button>
        <button className={`mode-btn ${mode==="find"?"active":""}`} onClick={() => setMode("find")}>
          ⌖ Find My Max Price
        </button>
      </div>

      <div className="calc-grid">
        <div className="input-panel">
          <div className="panel-header">
            <div>
              <div className="panel-header-title">Your Information</div>
              <div className="panel-header-sub">
                {mode === "check" ? "Check affordability for a target price" : "Find your maximum purchase price"}
              </div>
            </div>
          </div>
          <div className="panel-body">
            <SectionLabel>Income</SectionLabel>
            <div className="field">
              <label>Annual Gross Income <span className="field-hint">Before tax</span></label>
              <div className="iw"><span className="ipfx">CA$</span>
                <input type="number" min="0" value={grossIncome} onChange={e => setGrossIncome(e.target.value)} />
              </div>
              <input type="range" min="0" max="500000" step="5000" value={Math.min(grossIncome,500000)} onChange={e => setGrossIncome(e.target.value)} />
            </div>
            <div className="field">
              <label>Co-Applicant Income <span className="field-hint">Spouse / partner</span></label>
              <div className="iw"><span className="ipfx">CA$</span>
                <input type="number" min="0" value={coIncome} onChange={e => setCoIncome(e.target.value)} />
              </div>
            </div>

            <SectionLabel>Property</SectionLabel>
            {mode === "check" && (
              <div className="field">
                <label>Home Price</label>
                <div className="iw"><span className="ipfx">CA$</span>
                  <input type="number" min="0" value={homePrice} onChange={e => setHomePrice(e.target.value)} />
                </div>
                <input type="range" min="100000" max="3000000" step="10000" value={Math.min(homePrice,3000000)} onChange={e => setHomePrice(e.target.value)} />
              </div>
            )}
            <div className="field">
              <label>Down Payment <span className="field-hint">{mode==="check" && price > 0 ? fmtPct(calc.downPct*100) + " of price" : ""}</span></label>
              <div className="iw"><span className="ipfx">CA$</span>
                <input type="number" min="0" value={downPayment} onChange={e => setDownPayment(e.target.value)} />
              </div>
              {mode === "check" && <input type="range" min="0" max={Math.min(price*0.5||500000,1000000)} step="5000" value={Math.min(downPayment,1000000)} onChange={e => setDownPayment(e.target.value)} />}
            </div>
            <div className="field">
              <label>Province</label>
              <div className="iw">
                <select value={province} onChange={e => setProvince(e.target.value)}>
                  {Object.entries(LTT).map(([code, p]) => <option key={code} value={code}>{p.name} ({code})</option>)}
                </select>
              </div>
            </div>
            {province === "ON" && (
              <div className="toggle-row">
                <span>Purchasing in City of Toronto (+MLTT)</span>
                <label className="toggle"><input type="checkbox" checked={isTorontoCity} onChange={e => setIsTorontoCity(e.target.checked)} /><div className="t-track"/><div className="t-thumb"/></label>
              </div>
            )}
            <div className="toggle-row">
              <span>First-Time Home Buyer (LTT rebate)</span>
              <label className="toggle"><input type="checkbox" checked={isFirstTime} onChange={e => setIsFirstTime(e.target.checked)} /><div className="t-track"/><div className="t-thumb"/></label>
            </div>

            <SectionLabel>Mortgage</SectionLabel>
            <div className="field">
              <label>Interest Rate <span className="field-hint">Annual</span></label>
              <div className="iw"><span className="ipfx">%</span>
                <input type="number" min="0.1" max="20" step="0.05" value={mortgageRate} onChange={e => setMortgageRate(e.target.value)} />
              </div>
              <input type="range" min="2" max="12" step="0.05" value={Math.min(mortgageRate,12)} onChange={e => setMortgageRate(e.target.value)} />
            </div>
            <div className="field">
              <label>Amortization Period</label>
              <div className="iw">
                <select value={amortization} onChange={e => setAmortization(e.target.value)}>
                  {[5,10,15,20,25,30].map(y => <option key={y} value={y}>{y} years{y===25?" (insured max)":y===30?" (uninsured)":""}</option>)}
                </select>
              </div>
            </div>

            <SectionLabel>Monthly Obligations</SectionLabel>
            <div className="field">
              <label>Property Tax</label>
              <div className="iw"><span className="ipfx">CA$</span>
                <input type="number" min="0" value={propertyTax} onChange={e => setPropertyTax(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>Heating Costs</label>
              <div className="iw"><span className="ipfx">CA$</span>
                <input type="number" min="0" value={heatingCost} onChange={e => setHeatingCost(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>Condo/Strata Fees</label>
              <div className="iw"><span className="ipfx">CA$</span>
                <input type="number" min="0" value={condoFees} onChange={e => setCondoFees(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>Other Monthly Debt</label>
              <div className="iw"><span className="ipfx">CA$</span>
                <input type="number" min="0" value={otherDebt} onChange={e => setOtherDebt(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="result-panel">
          <div className="gauge-card">
            <div className="gauge-wrap">
              <svg className="gauge-svg" viewBox="0 0 180 100" width="180" height="100">
                <path d="M 20 90 A 70 70 0 0 1 160 90" fill="none" stroke="var(--bg2)" strokeWidth="16" strokeLinecap="round" />
                <path d="M 20 90 A 70 70 0 0 1 160 90" fill="none" stroke={gaugeColor} strokeWidth="16" strokeLinecap="round" strokeDasharray="220" strokeDashoffset={220 - (gaugeAngle / 180) * 220} />
              </svg>
              <div className="gauge-label">
                <div className="gauge-score" style={{ color: gaugeColor }}>{calc.affordabilityScore}</div>
                <div className="gauge-sublabel">Affordability</div>
              </div>
            </div>
            <div className="gauge-right">
              <div className="verdict" style={{ color: gaugeColor }}>
                {calc.affordabilityScore >= 70 ? "Affordable ✓" : calc.affordabilityScore >= 45 ? "Borderline" : "Stretched ✗"}
              </div>
              <div className="verdict-sub">
                {mode === "find"
                  ? `You can afford up to approximately ${fmtC(calc.maxPrice)} based on your income and debts.`
                  : `Based on ${fmtC(price)} home price with ${fmtC(calc.downAmt)} down (${fmtPct(calc.downPct*100)}).`}
              </div>
              <div className="ratio-bar-group">
                {[
                  { name: "GDS Ratio", val: calc.gds, limit: calc.gdsLimit, color: calc.gds <= 39 ? "var(--green)" : "var(--red)" },
                  { name: "TDS Ratio", val: calc.tds, limit: calc.tdsLimit, color: calc.tds <= 44 ? "var(--green)" : "var(--red)" },
                ].map(r => (
                  <div key={r.name} className="ratio-item">
                    <div className="ratio-top">
                      <span className="ratio-name">{r.name}</span>
                      <span className="ratio-val" style={{ color: r.color }}>{fmtPct(r.val)} / {r.limit}% max</span>
                    </div>
                    <div className="ratio-track">
                      <div className="ratio-fill" style={{ width: Math.min(r.val, 60) / 60 * 100 + "%", background: r.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="metrics-card">
            <div className="card-title">
              <span className="card-title-text">{mode === "check" ? `${ltt.name} · ${fmtC(price)} Home` : `Max Affordable · ${ltt.name}`}</span>
              <div className="tabs">
                {[["summary","Summary"],["costs","Closing Costs"],["amort","Amortization"],["stress","Stress Test"]].map(([v,l]) => (
                  <button key={v} className={`tab ${activeTab===v?"active":""}`} onClick={() => setActiveTab(v)}>{l}</button>
                ))}
              </div>
            </div>

            {activeTab === "summary" && (
              <div className="metrics-grid">
                <div className="metric hero-m">
                  <div className="m-lbl">{mode==="find" ? "Maximum Affordable Home Price" : "Monthly Mortgage Payment"}</div>
                  <div className="m-val">{mode==="find" ? fmtC(calc.maxPrice) : fmtC(calc.monthlyMortgage)}</div>
                </div>
                <div className="metric m-blue"><div className="m-lbl">Mortgage Principal</div><div className="m-val">{fmtC(calc.mortgage)}</div></div>
                <div className="metric"><div className="m-lbl">Total Monthly Cost</div><div className="m-val">{fmtC(calc.monthlyTotal)}</div></div>
                <div className="metric"><div className="m-lbl">CMHC Premium</div><div className="m-val">{calc.isInsured ? fmtC(calc.cmhc) : "None"}</div></div>
                <div className={`metric ${calc.gdsPass ? "m-green" : "m-red"}`}><div className="m-lbl">GDS Ratio</div><div className="m-val">{fmtPct(calc.gds)}</div></div>
                <div className={`metric ${calc.tdsPass ? "m-green" : "m-red"}`}><div className="m-lbl">TDS Ratio</div><div className="m-val">{fmtPct(calc.tds)}</div></div>
              </div>
            )}

            {activeTab === "costs" && (
              <div>
                <div className="cost-row"><span>Provincial LTT</span><span className="cost-val">{fmtC(calc.provLTT)}</span></div>
                {province === "ON" && isTorontoCity && <div className="cost-row"><span>Toronto MLTT</span><span className="cost-val">{fmtC(calc.cityLTT)}</span></div>}
                {isFirstTime && calc.ftbRebate > 0 && <div className="cost-row"><span className="cost-lbl">FHB Rebate</span><span className="cost-val green">− {fmtC(calc.ftbRebate)}</span></div>}
                <div className="cost-row"><span>Legal & Other</span><span className="cost-val">{fmtC(calc.legalFees + calc.inspection + calc.titleInsurance + calc.movingCosts)}</span></div>
                <div className="cost-row total"><span>Estimated Closing Costs</span><span className="cost-val">{fmtC(calc.totalClosing)}</span></div>
              </div>
            )}

            {activeTab === "amort" && (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={calc.amortData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={v => "$" + (v/1000) + "k"} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="Balance" stroke="#0e4d8a" fill="#0e4d8a" fillOpacity={0.1} />
                  <Area type="monotone" dataKey="Principal" stroke="#1a7a4a" fill="#1a7a4a" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            )}

            {activeTab === "stress" && (
              <div>
                <div className="cost-row"><span>Qualifying Rate</span><span className="cost-val">{fmtPct(calc.stressRate * 100)}</span></div>
                <div className="cost-row"><span>Stress Payment</span><span className="cost-val">{fmtC(calc.monthlyStress)}</span></div>
                <div className="cost-row"><span>GDS @ Stress</span><span className="cost-val">{fmtPct(calc.gds)}</span></div>
                <div className="cost-row"><span>TDS @ Stress</span><span className="cost-val">{fmtPct(calc.tds)}</span></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="section-label">{children}</div>;
}
