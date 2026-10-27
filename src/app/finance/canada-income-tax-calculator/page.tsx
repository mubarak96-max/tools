"use client";

import { useState, useMemo } from "react";
import { Building2, Mountain, Wheat, Shield, Waves, Sun, Anchor, Leaf, Palmtree, Snowflake, Landmark, Briefcase, Home, DollarSign, Baby, BookOpen } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from "recharts";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

import {
  FEDERAL_BRACKETS, PROVINCES, RRSP_DOLLAR_LIMIT, calculateCanadaTax,
} from "./taxData";
import { CanadaTaxStyles } from "./CanadaTaxStyles";

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

  const province = PROVINCES[provinceKey];

  // ── Core tax calculation ─────────────────────────────────────────────────
  const result = useMemo(() => {
    const gross = typeof income === "string" ? parseFloat(income) : income;
    const grossVal = isNaN(gross) ? 0 : gross;
    const rrspVal = typeof rrsp === "string" ? parseFloat(rrsp) : rrsp;
    const r = calculateCanadaTax(grossVal, isNaN(rrspVal) ? 0 : rrspVal, provinceKey, selfEmployed);
    const pf = PERIODS[period].factor;
    const pct = (n: number) => (grossVal > 0 ? (n / grossVal) * 100 : 0);
    return {
      ...r,
      grossPer:    grossVal    / pf,
      federalPer:  r.federalTax / pf,
      provPer:     r.provTax    / pf,
      cppPer:      r.cppTotal   / pf,
      eiPer:       r.eiPremium  / pf,
      totalTaxPer: r.totalTax   / pf,
      takeHomePer: r.takeHome   / pf,
      pctFederal:  pct(r.federalTax),
      pctProv:     pct(r.provTax),
      pctCpp:      pct(r.cppTotal),
      pctEi:       pct(r.eiPremium),
      pctTakeHome: pct(r.takeHome),
    };
  }, [income, provinceKey, period, selfEmployed, rrsp]);

  // comparison chart data (same income across key provinces)
  const comparisonData = useMemo(() => {
    const gross = typeof income === "string" ? parseFloat(income) : income;
    const grossVal = isNaN(gross) ? 0 : gross;
    return ["ON","BC","AB","QC","MB","SK"].map(pk => {
      const r = calculateCanadaTax(grossVal, 0, pk, false);
      const takeHome = grossVal - r.federalTax - r.provTax;
      return { province: pk, "Federal Tax": Math.round(r.federalTax), "Provincial Tax": Math.round(r.provTax), "Take-Home": Math.round(takeHome), fill: PROVINCES[pk].color };
    });
  }, [income]);

  const per = PERIODS[period].label;

  return (
    <>
      <CanadaTaxStyles />

      <div className="canada-tax-container">
      <div className="wrap">

        {/* ── HERO ── */}
        <header className="hero anim">
          <div className="hero-top">
            <div>
              <div className="hero-badge">🍁 2026 Tax Year</div>
              <h1>Canada <em>Income Tax</em><br />Calculator 2026</h1>
              <p className="hero-sub">
                Federal + provincial tax, CPP, and EI — calculated instantly for all 13 provinces and territories. See your exact take-home pay, effective rate, and bracket breakdown.
              </p>
            </div>
            <div className="hero-year">2026</div>
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
                  <input type="number" min="0" max={RRSP_DOLLAR_LIMIT} step="500"
                    value={rrsp} onChange={e => setRrsp(e.target.value)} />
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: 4 }}>2026 max: $33,810 or 18% of prior-year earned income</div>
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
                  <div className="bar-seg" style={{ width: result.pctEi + "%",      background: "#6366f1" }} title={(province.qpip ? "EI + QPIP: " : "EI: ") + fmtC(result.eiPremium)} />
                  <div className="bar-seg" style={{ width: result.pctTakeHome + "%",background: "var(--green)" }} title={"Take-Home: " + fmtC(result.takeHome)} />
                </div>
                <div className="bar-legend">
                  {[
                    { color: "var(--red)",    label: "Federal Tax",     val: fmtC(result.federalTax), pct: result.pctFederal },
                    { color: "var(--orange)", label: "Provincial Tax",  val: fmtC(result.provTax),    pct: result.pctProv    },
                    { color: "var(--teal)",   label: "CPP",             val: fmtC(result.cppTotal),   pct: result.pctCpp     },
                    { color: "#6366f1",       label: province.qpip ? "EI + QPIP" : "EI Premium", val: fmtC(result.eiPremium),  pct: result.pctEi      },
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
                      <div className="m-lbl">{province.qpip ? "QPP" : "CPP"}</div>
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
                      <div className="m-lbl">{province.qpip ? "EI + QPIP" : "EI Premium"}</div>
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
                      2026 federal brackets applied to taxable income of {fmtC(result.taxableIncome)}, before the basic personal amount and other credits. Highlighted = your marginal bracket.
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
                        const taxable = result.taxableIncome;
                        if (b.min >= taxable) return null;
                        const bracketIncome = Math.min(taxable, b.max) - b.min;
                        const bracketTaxAmt = bracketIncome * b.rate;
                        cum += bracketTaxAmt;
                        const isMarginal = taxable > b.min && (b.max === Infinity || taxable <= b.max);
                        return (
                          <div key={i} className={`bkt-row ${isMarginal ? "active-bracket" : ""}`}>
                            <span className="bkt-range">
                              ${(b.min).toLocaleString()} – {b.max === Infinity ? "∞" : "$" + b.max.toLocaleString()}
                              {isMarginal && <span style={{ marginLeft: 6, fontSize: "0.68rem", background: "var(--red)", color: "#fff", padding: "1px 5px", borderRadius: 3 }}>YOU</span>}
                            </span>
                            <span className="bkt-rate">{(b.rate * 100).toFixed(1)}%</span>
                            <span className="bkt-tax">{fmtC(bracketTaxAmt)}</span>
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
                The federal government sets five tax brackets for 2026, starting at 14% on the first $58,523 of taxable income and rising to 33% on income above $258,482. The lowest rate was cut from 15% to 14% effective July 1, 2025, so 2026 is the first full year at 14%. Each province then adds its own tax on top, calculated independently. The combined federal and provincial rate is what Canadians actually pay — which is why a high earner in Nova Scotia (top combined rate ~54%) pays meaningfully more than a comparable earner in Alberta (top combined rate ~48%).
              </p>
              <p>
                Beyond income tax, employed Canadians also contribute to <strong>Canada Pension Plan (CPP)</strong> and <strong>Employment Insurance (EI)</strong>. In 2026, CPP contributions are 5.95% of pensionable earnings between $3,500 (the basic exemption) and $74,600, plus a second-tier CPP2 rate of 4% on earnings between $74,600 and $85,000. EI premiums are 1.63% of insurable earnings up to $68,900. Quebec residents contribute to the Quebec Pension Plan (QPP) at 6.30% instead of CPP, and pay a lower EI rate (1.30%) because they also pay premiums to the separate Quebec Parental Insurance Plan (QPIP).
              </p>
              <h3>The Marginal Rate vs. the Effective Rate</h3>
              <p>
                One of the most common misunderstandings about Canadian income tax is confusing the <strong>marginal rate</strong> with the <strong>effective rate</strong>. Your marginal rate is the rate that applies to your next dollar of income — it is the highest bracket you have reached. Your effective rate is your total tax as a percentage of your total income. Because Canada's system is progressive, only the income within each bracket is taxed at that bracket's rate.
              </p>
              <p>
                For example, if you earn $90,000 in Ontario in 2026, your combined marginal rate is about 29.65% — but your effective income tax rate is only around 19%, because most of your income is taxed in lower brackets and the basic personal amount shelters the first part of it. The <strong>income tax calculator Ontario</strong> above shows both figures separately so you can see the full picture.
              </p>
            </div>
            <div className="cbody">
              <h3>The Basic Personal Amount</h3>
              <p>
                Every Canadian taxpayer is entitled to the federal <strong>Basic Personal Amount (BPA)</strong> — a non-refundable tax credit that effectively makes the first $16,452 (2026) of income tax-free at the federal level. The federal amount is gradually reduced to $14,829 for net income between $181,440 and $258,482. Each province has its own basic personal amount, ranging from $11,188 in Newfoundland and Labrador to $22,769 in Alberta.
              </p>
              <p>
                The BPA is not a deduction from income — it is a credit applied against the tax calculated. At the federal level, it reduces your federal tax by $16,452 × 14% = $2,303. This is why, practically speaking, the first ~$16,450 of Canadian income is federal-tax-free.
              </p>
              <h3>CPP and EI Contributions in 2026</h3>
              <p>
                <strong>CPP contributions</strong> fund your Canada Pension Plan retirement benefit. In 2026, you contribute 5.95% of earnings between $3,500 and $74,600 — a maximum employee contribution of $4,230.45. The second tier, <strong>CPP2</strong>, adds 4% on earnings between $74,600 and $85,000, up to $416 more, for a combined maximum of $4,646.45.
              </p>
              <p>
                Self-employed Canadians pay both the employee and employer share of CPP — effectively doubling their CPP contribution to 11.9% — because they have no employer to match their contribution. The <strong>paycheck calculator Canada</strong> above has a self-employed toggle that reflects this additional cost.
              </p>
              <p>
                <strong>EI premiums</strong> fund the Employment Insurance program that provides income replacement during job loss, illness, maternity, and parental leave. In 2026, employees pay 1.63% of insurable earnings up to $68,900, a maximum premium of $1,123.07. Self-employed individuals can opt into EI for access to special benefits, but they are not automatically enrolled.
              </p>
              <h3>RRSP Deductions and Tax Savings</h3>
              <p>
                The Registered Retirement Savings Plan (RRSP) is Canada's most powerful tax deduction tool. Contributions reduce your taxable income dollar-for-dollar, generating a tax refund at your marginal rate. For 2026, your RRSP deduction limit is the lower of $33,810 or 18% of your prior year's earned income, plus any unused room carried forward. Enter your planned RRSP contribution in the calculator above to see your instant tax savings — typically several thousand dollars for middle and high income earners.
              </p>
            </div>
          </div>
        </section>

        {/* ── Province deep-dives ── */}
        <section className="content-section" id="provinces">
          <div className="sec-badge">By Province</div>
          <h2 className="sec-title">Income Tax by Province — <em>2026 Guide</em></h2>
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
                bpa: "$12,989",
                note: "Ontario adds a surtax of 20% on basic Ontario tax above $5,818, plus another 36% on tax above $7,446, and charges an Ontario Health Premium of up to $900. The surtax lifts Ontario's effective top provincial rate well above its 13.16% headline rate. Combined top rate with federal: ~53.53%."
              },
              {
                flag: <Mountain size={24} strokeWidth={1.5} />, name: "British Columbia",
                tag: "income tax calculator bc",
                rate: "5.06–20.5%",
                bpa: "$13,216",
                note: "BC has seven tax brackets with a top rate of 20.5% on income over $265,545. Combined top rate with federal: ~53.5%. BC has no provincial surtax, and its 5.06% lowest rate keeps provincial tax low on middle incomes."
              },
              {
                flag: <Wheat size={24} strokeWidth={1.5} />, name: "Alberta",
                tag: "income tax calculator alberta",
                rate: "8–15%",
                bpa: "$22,769",
                note: "Alberta has the largest Basic Personal Amount in Canada ($22,769), no provincial sales tax (PST), and a new 8% bracket on the first $61,200 of taxable income. Its six brackets top out at 15% on income above $370,220. Combined top rate: ~48%."
              },
              {
                flag: <Shield size={24} strokeWidth={1.5} />, name: "Quebec",
                tag: "income tax calculator quebec",
                rate: "14–25.75%",
                bpa: "$18,952",
                note: "Quebec has the highest provincial tax rates in Canada (14–25.75%), partly offset by a 16.5% abatement of federal tax for Quebec residents. Quebec administers its own tax through Revenu Québec, and workers contribute to QPP and QPIP. Combined top rate: ~53.31%."
              },
              {
                flag: <Waves size={24} strokeWidth={1.5} />, name: "Manitoba",
                tag: "income tax calculator canada",
                rate: "10.8–17.4%",
                bpa: "$15,780",
                note: "Manitoba's three-bracket system tops out at 17.4% on income above $100,000. Its bracket thresholds and $15,780 Basic Personal Amount are not indexed for 2026, and the BPA is phased out between $200,000 and $400,000 of net income. Combined top rate with federal: ~50.4%."
              },
              {
                flag: <Sun size={24} strokeWidth={1.5} />, name: "Saskatchewan",
                tag: "income tax calculator canada",
                rate: "10.5–14.5%",
                bpa: "$20,381",
                note: "Saskatchewan has a simple three-bracket system with a top rate of 14.5% on income above $155,805. Its large Basic Personal Amount ($20,381) reduces tax significantly on lower incomes. Combined top rate: ~47.5%."
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
          <h3 style={{ fontFamily: "var(--font-d)", fontSize: "1.2rem", fontWeight: 700, marginBottom: 8, color: "var(--ink)" }}>All Province Tax Rates — 2026 Comparison</h3>
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
                  [<span className="flex items-center gap-1.5"><Building2 size={14} /> Ontario (ON)</span>,           "5",  "13.16%", "$12,989", "~53.53%", "Surtax above $5,818 of provincial tax; Health Premium"],
                  [<span className="flex items-center gap-1.5"><Mountain size={14} /> British Columbia (BC)</span>,  "7",  "20.50%", "$13,216", "~53.50%", "Low 5.06% first bracket"],
                  [<span className="flex items-center gap-1.5"><Wheat size={14} /> Alberta (AB)</span>,            "6",  "15.00%", "$22,769", "~48.00%", "No PST; highest BPA; new 8% bracket"],
                  [<span className="flex items-center gap-1.5"><Shield size={14} /> Quebec (QC)</span>,             "4",  "25.75%", "$18,952", "~53.31%", "Highest top provincial rate; 16.5% federal abatement"],
                  [<span className="flex items-center gap-1.5"><Waves size={14} /> Manitoba (MB)</span>,           "3",  "17.40%", "$15,780", "~50.40%", "Brackets and BPA not indexed"],
                  [<span className="flex items-center gap-1.5"><Sun size={14} /> Saskatchewan (SK)</span>,       "3",  "14.50%", "$20,381", "~47.50%", "Large BPA"],
                  [<span className="flex items-center gap-1.5"><Anchor size={14} /> Nova Scotia (NS)</span>,        "5",  "21.00%", "$11,932", "~54.00%", ""],
                  [<span className="flex items-center gap-1.5"><Leaf size={14} /> New Brunswick (NB)</span>,      "4",  "19.50%", "$13,664", "~52.50%", ""],
                  [<span className="flex items-center gap-1.5"><Mountain size={14} /> Newfoundland (NL)</span>,       "8",  "21.80%", "$11,188", "~54.80%", "Most brackets; highest top combined rate; lowest BPA"],
                  [<span className="flex items-center gap-1.5"><Palmtree size={14} /> PEI</span>,                    "5",  "19.00%", "$15,000", "~52.00%", "BPA raised to $15,000 for 2026"],
                  [<span className="flex items-center gap-1.5"><Mountain size={14} /> NWT</span>,                    "4",  "14.05%", "$18,198", "~47.05%", "Territory"],
                  [<span className="flex items-center gap-1.5"><Mountain size={14} /> Yukon (YT)</span>,              "5",  "15.00%", "$16,452", "~48.00%", "Territory; BPA follows federal amount"],
                  [<span className="flex items-center gap-1.5"><Snowflake size={14} /> Nunavut (NU)</span>,            "4",  "11.50%", "$19,659", "~44.50%", "Lowest combined top rate in Canada"],
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
                Quebec employees have a different payroll experience from the rest of Canada. Instead of contributing to Employment Insurance at the standard 1.63% rate, Quebec employees pay a lower EI rate of 1.30% because they also pay into the <strong>Quebec Parental Insurance Plan (QPIP)</strong> (0.43% of insurable earnings up to $103,000 in 2026), which provides more generous parental leave benefits. Quebec also administers its own provincial income tax through Revenu Québec rather than the CRA — meaning Quebec employees effectively file two separate income tax returns each year.
              </p>
              <p>
                An <strong>income tax calculator Quebec</strong> must account for both the federal return filed with CRA and the provincial return filed with Revenu Québec, plus the QPIP premium. For Quebec, our calculator applies QPP contributions at 6.30%, the lower EI rate plus QPIP premiums, and the 16.5% Quebec abatement of federal tax. The Quebec provincial figure is an estimate based on Revenu Québec&apos;s 2026 brackets and basic personal amount only.
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
          <h2 className="sec-title">Reduce Your Tax Bill — <em>Legal Strategies for 2026</em></h2>
          <p className="sec-lead">
            Canada's tax system offers several powerful tools for reducing your taxable income and, therefore, your tax bill. These are not loopholes — they are government-sanctioned incentives built into the Income Tax Act.
          </p>
          <div className="three-col">
            {[
              {
                icon: <Landmark size={24} strokeWidth={1.5} />,
                title: "RRSP Contributions",
                body: "Every dollar contributed to an RRSP reduces your taxable income dollar-for-dollar, generating a refund at your marginal rate. At a 43% marginal rate, a $10,000 RRSP contribution generates a ~$4,300 refund. The 2026 limit is $33,810 or 18% of prior year earned income, whichever is lower. Unused room carries forward indefinitely."
              },
              {
                icon: <Briefcase size={24} strokeWidth={1.5} />,
                title: "TFSA Contributions",
                body: "The Tax-Free Savings Account (TFSA) does not reduce your taxable income but shelters all growth and withdrawals from tax permanently. The 2026 TFSA dollar limit is $7,000. Total room since 2009 is $109,000 for Canadians who have been eligible since inception. Ideal for savings above the RRSP horizon."
              },
              {
                icon: <Home size={24} strokeWidth={1.5} />,
                title: "First Home Savings Account (FHSA)",
                body: "Introduced in 2023, the FHSA combines the best of RRSP (tax deduction on contributions) and TFSA (tax-free withdrawals for qualifying home purchase). Annual contribution limit is $8,000, lifetime limit $40,000. A first-time buyer contributing the max gets both an immediate tax deduction and tax-free growth."
              },
              {
                icon: <DollarSign size={24} strokeWidth={1.5} />,
                title: "Employment Expenses",
                body: "Employees who work from home may claim home office expenses using the detailed method with a T2200 signed by their employer (the temporary $2/day flat-rate method ended after 2022). Commission employees can deduct a wider range of expenses including advertising, promotional, and automobile costs."
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
            <strong>Disclaimer:</strong> This calculator provides estimates for planning purposes based on 2026 CRA and Revenu Québec rates. It does not account for all credits, deductions, or personal circumstances (for example low-income tax reductions, age, pension, dependant or tuition amounts). Always consult a qualified tax professional or the CRA website for advice specific to your situation.
          </div>
          <div style={{ maxWidth: 820 }}>
            {[
              {
                q: "How accurate is this income tax calculator for Ontario?",
                a: "The income tax calculator Ontario results are based on 2026 federal and Ontario provincial tax brackets, including the Ontario surtax and Ontario Health Premium, the federal and Ontario basic personal amounts, the Canada employment amount, and 2026 CPP, CPP2 and EI rates. Results are accurate for employment income without complex deductions (other than RRSP). For income from self-employment, capital gains, rental income, or with significant additional credits, the actual tax owed will differ. Always verify your final tax with the CRA's NETFILE-certified tax software."
              },
              {
                q: "What is the difference between the income tax calculator BC vs. Alberta?",
                a: "It depends on income. Alberta has a much higher Basic Personal Amount ($22,769 vs $13,216 in BC), but BC's lower rates on the first ~$100,000 mean BC provincial tax is slightly lower for most middle incomes in 2026 — about $1,100 less at $100,000. The two are roughly equal near $150,000. Above that, BC's top rates (up to 20.5% on income over $265,545, vs Alberta's 15% top rate) make BC more expensive: about $3,300 more provincial tax at $250,000. Alberta also has no provincial sales tax."
              },
              {
                q: "Why does the income tax calculator Quebec show different EI deductions?",
                a: "Quebec residents pay a lower EI premium rate (1.30% vs 1.63% in other provinces in 2026) because Quebec operates the Quebec Parental Insurance Plan (QPIP) separately. QPIP provides parental, maternity, and paternity benefits that are funded separately from federal EI. Quebec workers pay QPIP premiums (0.43% of earnings up to $103,000) in addition to the reduced EI premiums. The income tax calculator Quebec above includes both and shows them together as 'EI + QPIP'. Note that Quebec income tax is also administered by Revenu Québec separately from the CRA."
              },
              {
                q: "How does the paycheck calculator Canada handle CPP?",
                a: "The paycheck calculator Canada uses 2026 CPP rates: 5.95% on earnings between the basic exemption ($3,500) and the Year's Maximum Pensionable Earnings ($74,600), plus the CPP2 rate of 4% on earnings between $74,600 and the Year's Additional Maximum Pensionable Earnings ($85,000). The maximum employee contribution is $4,646.45 ($4,230.45 + $416). Self-employed Canadians pay both the employee and employer share (11.9% on the first tier and 8% on CPP2), which the self-employed toggle reflects."
              },
              {
                q: "Is the income tax calculator Alberta 2026 accurate for all income levels?",
                a: "The income tax calculator Alberta uses Alberta's 2026 brackets (8% on the first $61,200, rising through 10%, 12%, 13% and 14% to 15% on income above $370,220) and Alberta's $22,769 basic personal amount. Alberta has no PST and the largest basic personal amount of any province. Results are a close estimate for employment income; investment income, business income or additional credits will change your actual tax."
              },
              {
                q: "How much tax do I pay on a $100,000 salary in Canada?",
                a: "At a $100,000 salary in Ontario in 2026, this calculator estimates about $13,300 in federal income tax, $6,700 in Ontario tax (including the surtax and $750 Ontario Health Premium), $4,646 in CPP and CPP2, and $1,123 in EI — total deductions of roughly $25,800 and a take-home of about $74,200. In Alberta, take-home is similar at about $74,500. Use the calculator above and select your province for your own figures."
              },
              {
                q: "What is the RRSP contribution limit for 2026?",
                a: "The 2026 RRSP dollar limit is $33,810. Your personal contribution room is the lower of $33,810 or 18% of your 2025 earned income, plus any unused room carried forward from prior years. You can find your exact RRSP contribution room on your CRA My Account or on the Notice of Assessment from your 2025 tax return. RRSP contributions reduce your taxable income dollar-for-dollar, generating a refund at your marginal rate — the calculator shows your estimated tax saving based on your marginal combined rate."
              },
              {
                q: "How do I calculate my marginal tax rate in Canada?",
                a: "Your marginal tax rate is the combined federal and provincial rate that applies to your next dollar of income. To find it, identify which federal bracket your income falls into (e.g., 20.5% for income between $58,523 and $117,045 in 2026) and which provincial bracket (e.g., 9.15% for Ontario income between $53,891 and $107,785), and add them together: 20.5% + 9.15% = 29.65% combined marginal rate. Ontario's surtax can raise the provincial part at higher incomes. The calculator above shows your marginal rate automatically and breaks it into federal and provincial components."
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

        {/* ── Sources ── */}
        <section className="content-section" id="sources">
          <div className="sec-badge">Sources</div>
          <h2 className="sec-title">Sources &amp; <em>Last Checked</em></h2>
          <div className="cbody">
            <p>The 2026 brackets, credits, CPP/QPP, EI and QPIP figures used in this calculator come from these official sources:</p>
            <ul className="sources-list">
              <li><a href="https://www.canada.ca/en/revenue-agency/services/forms-publications/payroll/t4127-payroll-deductions-formulas/t4127-jan/t4127-jan-payroll-deductions-formulas-computer-programs.html" target="_blank" rel="noopener noreferrer">CRA — T4127 Payroll Deductions Formulas, January 2026</a></li>
              <li><a href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canadian-income-tax-rates-individuals-current-previous-years.html" target="_blank" rel="noopener noreferrer">CRA — Canadian income tax rates for individuals</a></li>
              <li><a href="https://www.canada.ca/en/revenue-agency/services/tax/registered-plans-administrators/pspa/mp-rrsp-dpsp-tfsa-limits-ympe.html" target="_blank" rel="noopener noreferrer">CRA — RRSP and TFSA limits, YMPE and YAMPE</a></li>
              <li><a href="https://www.revenuquebec.ca/en/businesses/source-deductions-and-employer-contributions/employers-principal-changes-for-2026/" target="_blank" rel="noopener noreferrer">Revenu Québec — Principal changes for 2026</a></li>
            </ul>
            <p style={{ color: "var(--muted)", fontSize: "0.82rem" }}>Last checked: October 2026</p>
          </div>
        </section>

        {/* Related Tools */}
        <div className="mt-20 border-t border-stone-100 pt-12">
          <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath="/finance/canada-income-tax-calculator" />
        </div>

        <footer className="footer">
          <p>Canada Income Tax Calculator · Based on 2026 CRA rates · For estimation purposes only · Not tax advice</p>
          <p style={{ marginTop: 8 }}>
            <a href="#calculator">Calculator</a> · <a href="#how-it-works">How It Works</a> · <a href="#provinces">By Province</a> · <a href="#paycheck">Paycheck Guide</a> · <a href="#planning">Tax Planning</a> · <a href="#faq">FAQ</a>
          </p>
        </footer>

      </div>
      </div>
    </>
  );
}
