"use client";

import { useState, useCallback, useMemo } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface FormState {
  annualIncome: string;
  coIncome: string;
  downPayment: string;
  monthlyDebts: string;
  interestRate: string;
  amortization: string;
  propertyTax: string;
  condoFee: string;
  heatingCost: string;
  province: string;
}

interface QualifyResult {
  maxPurchasePrice: number;
  maxMortgage: number;
  monthlyPayment: number;
  gds: number;
  tds: number;
  gdsPass: boolean;
  tdsPass: boolean;
  stressTestRate: number;
  cmhcRequired: boolean;
  cmhcPremium: number;
  cmhcPct: number;
  totalMortgage: number;
  qualifies: boolean;
  downPct: number;
  minDownRequired: number;
  downOk: boolean;
  ltvRatio: number;
  landTransferTax: number;
  ltcFirstTimeBenefit: number;
  netLandTransfer: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const GDS_MAX = 39;
const TDS_MAX = 44;
const STRESS_TEST_FLOOR = 5.25;

const PROVINCES: { value: string; label: string }[] = [
  { value: "ON", label: "Ontario" },
  { value: "BC", label: "British Columbia" },
  { value: "AB", label: "Alberta" },
  { value: "QC", label: "Québec" },
  { value: "MB", label: "Manitoba" },
  { value: "SK", label: "Saskatchewan" },
  { value: "NS", label: "Nova Scotia" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland" },
  { value: "PE", label: "P.E.I." },
];

// ─── Land Transfer Tax ────────────────────────────────────────────────────────
function calcLandTransferTax(price: number, province: string): { tax: number; firstTimeBenefit: number } {
  let tax = 0;

  if (province === "ON") {
    if (price <= 55000) tax = price * 0.005;
    else if (price <= 250000) tax = 275 + (price - 55000) * 0.01;
    else if (price <= 400000) tax = 2225 + (price - 250000) * 0.015;
    else if (price <= 2000000) tax = 4475 + (price - 400000) * 0.02;
    else tax = 36475 + (price - 2000000) * 0.025;
    return { tax, firstTimeBenefit: Math.min(4000, tax) };
  }
  if (province === "BC") {
    if (price <= 200000) tax = price * 0.01;
    else if (price <= 2000000) tax = 2000 + (price - 200000) * 0.02;
    else tax = 38000 + (price - 2000000) * 0.03;
    return { tax, firstTimeBenefit: price <= 500000 ? tax : 0 };
  }
  if (province === "QC") {
    if (price <= 53200) tax = price * 0.005;
    else if (price <= 266200) tax = 266 + (price - 53200) * 0.01;
    else if (price <= 532400) tax = 2398 + (price - 266200) * 0.015;
    else tax = 6391 + (price - 532400) * 0.02;
    return { tax, firstTimeBenefit: 0 };
  }
  if (province === "AB") return { tax: 0, firstTimeBenefit: 0 };
  if (province === "SK") return { tax: 0, firstTimeBenefit: 0 };
  // Generic approximation for remaining provinces
  if (price <= 30000) tax = price * 0.005;
  else if (price <= 100000) tax = 150 + (price - 30000) * 0.01;
  else tax = 850 + (price - 100000) * 0.015;
  return { tax, firstTimeBenefit: 0 };
}

// ─── CMHC Premium ────────────────────────────────────────────────────────────
function calcCmhc(price: number, downPayment: number): { premium: number; pct: number } {
  const ltv = (price - downPayment) / price;
  if (ltv <= 0.8) return { premium: 0, pct: 0 };
  const mortgage = price - downPayment;
  let pct = 0;
  if (ltv <= 0.85) pct = 0.028;
  else if (ltv <= 0.9) pct = 0.031;
  else pct = 0.04;
  return { premium: mortgage * pct, pct: pct * 100 };
}

// ─── Monthly Payment ─────────────────────────────────────────────────────────
function monthlyPmt(principal: number, annualRate: number, years: number): number {
  if (annualRate === 0) return principal / (years * 12);
  // Canadian mortgages compound semi-annually
  const effectiveMonthly = Math.pow(1 + annualRate / 2, 1 / 6) - 1;
  const n = years * 12;
  return (principal * effectiveMonthly) / (1 - Math.pow(1 + effectiveMonthly, -n));
}

// ─── Min Down Payment (Canada rules) ─────────────────────────────────────────
function minDownPayment(price: number): number {
  if (price <= 500000) return price * 0.05;
  if (price <= 999999) return 25000 + (price - 500000) * 0.1;
  return price * 0.2; // $1M+ requires 20%
}

// ─── Binary search for max purchase price ────────────────────────────────────
function findMaxPrice(
  totalIncome: number,
  downPayment: number,
  monthlyDebts: number,
  rate: number,
  amortization: number,
  monthlyPropertyTax: number,
  condoFee: number,
  heating: number
): number {
  const stressRate = Math.max(rate + 2, STRESS_TEST_FLOOR);
  let lo = 0, hi = 5_000_000, best = 0;

  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const dp = Math.min(downPayment, mid);
    const { premium } = calcCmhc(mid, dp);
    const principal = mid - dp + premium;
    const pmt = monthlyPmt(principal, stressRate / 100, amortization);
    const gds = ((pmt + monthlyPropertyTax + condoFee + heating) / (totalIncome / 12)) * 100;
    const tds = ((pmt + monthlyPropertyTax + condoFee + heating + monthlyDebts) / (totalIncome / 12)) * 100;

    if (gds <= GDS_MAX && tds <= TDS_MAX) {
      best = mid;
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return best;
}

// ─── Main Calculate ───────────────────────────────────────────────────────────
function calculate(f: FormState): QualifyResult | null {
  const income = parseFloat(f.annualIncome.replace(/,/g, "")) || 0;
  const coIncome = parseFloat(f.coIncome.replace(/,/g, "")) || 0;
  const downPayment = parseFloat(f.downPayment.replace(/,/g, "")) || 0;
  const monthlyDebts = parseFloat(f.monthlyDebts.replace(/,/g, "")) || 0;
  const rate = parseFloat(f.interestRate) || 0;
  const amortization = parseInt(f.amortization) || 25;
  const annualPropertyTax = parseFloat(f.propertyTax.replace(/,/g, "")) || 0;
  const condoFee = parseFloat(f.condoFee.replace(/,/g, "")) || 0;
  const heating = parseFloat(f.heatingCost.replace(/,/g, "")) || 150;

  if (income <= 0 || rate <= 0 || downPayment < 0) return null;

  const totalIncome = income + coIncome;
  const monthlyPropertyTax = annualPropertyTax / 12;
  const stressTestRate = Math.max(rate + 2, STRESS_TEST_FLOOR);

  const maxPrice = findMaxPrice(
    totalIncome, downPayment, monthlyDebts,
    rate, amortization, monthlyPropertyTax, condoFee, heating
  );

  // Results for the actual purchase price implied by down payment
  const price = maxPrice;
  const dp = Math.min(downPayment, price);
  const downPct = price > 0 ? (dp / price) * 100 : 0;
  const minDown = minDownPayment(price);
  const downOk = dp >= minDown;

  const { premium, pct: cmhcPct } = calcCmhc(price, dp);
  const cmhcRequired = premium > 0;
  const totalMortgage = price - dp + premium;

  const stressPmt = monthlyPmt(totalMortgage, stressTestRate / 100, amortization);
  const actualPmt = monthlyPmt(totalMortgage, rate / 100, amortization);

  const monthlyIncome = totalIncome / 12;
  const gds = ((stressPmt + monthlyPropertyTax + condoFee + heating) / monthlyIncome) * 100;
  const tds = ((stressPmt + monthlyPropertyTax + condoFee + heating + monthlyDebts) / monthlyIncome) * 100;

  const gdsPass = gds <= GDS_MAX;
  const tdsPass = tds <= TDS_MAX;
  const qualifies = gdsPass && tdsPass && downOk;
  const ltvRatio = price > 0 ? ((totalMortgage) / price) * 100 : 0;

  const { tax: landTransferTax, firstTimeBenefit: ltcFirstTimeBenefit } =
    calcLandTransferTax(price, f.province);

  return {
    maxPurchasePrice: price,
    maxMortgage: totalMortgage - premium,
    monthlyPayment: actualPmt,
    gds,
    tds,
    gdsPass,
    tdsPass,
    stressTestRate,
    cmhcRequired,
    cmhcPremium: premium,
    cmhcPct,
    totalMortgage,
    qualifies,
    downPct,
    minDownRequired: minDown,
    downOk,
    ltvRatio,
    landTransferTax,
    ltcFirstTimeBenefit,
    netLandTransfer: landTransferTax - ltcFirstTimeBenefit,
  };
}

// ─── Formatters ───────────────────────────────────────────────────────────────
const fmtCAD = (n: number) =>
  "C$" + Math.round(n).toLocaleString("en-CA");
const fmtPct = (n: number) => n.toFixed(1) + "%";

// ─── FAQ Data ────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "What is the mortgage stress test in Canada?",
    a: "The Canadian mortgage stress test requires lenders to qualify you at the higher of your contract rate plus 2%, or 5.25%. This ensures you can still afford payments if rates rise. It applies to all federally regulated lenders for both insured and uninsured mortgages as of 2021.",
  },
  {
    q: "How much mortgage can I qualify for in Canada?",
    a: "Lenders use two debt service ratios: Gross Debt Service (GDS) must be ≤39% and Total Debt Service (TDS) must be ≤44% of gross income. The ratios are calculated using the stress-tested rate. Our calculator runs this math precisely and shows you the maximum purchase price you qualify for.",
  },
  {
    q: "When is CMHC mortgage insurance required in Canada?",
    a: "CMHC insurance (also called mortgage default insurance) is required when your down payment is less than 20% of the purchase price. Premiums range from 2.8% to 4.0% of the insured mortgage amount, added to your mortgage balance.",
  },
  {
    q: "What is the minimum down payment in Canada in 2026?",
    a: "For homes under $500,000: 5% minimum. For homes $500,000–$999,999: 5% on the first $500,000 plus 10% on the remainder. For homes $1,000,000 or more: 20% minimum — these purchases cannot be CMHC-insured.",
  },
  {
    q: "What is the GDS ratio and what should it be?",
    a: "The Gross Debt Service (GDS) ratio is the percentage of gross monthly income spent on housing costs (mortgage payment, property taxes, heating, and 50% of condo fees). Lenders require GDS ≤ 39%. Going over this limit is the most common reason Canadians don't qualify for the mortgage they want.",
  },
  {
    q: "What is the maximum amortization period in Canada?",
    a: "For insured mortgages (less than 20% down), the maximum amortization is 25 years. For uninsured mortgages (20%+ down), some lenders allow up to 30 years, which lowers monthly payments but significantly increases total interest paid over the life of the loan.",
  },
  {
    q: "Do I need a co-signer or co-applicant to qualify for more?",
    a: "Yes. Adding a co-borrower (spouse, partner, or family member) combines your gross incomes for GDS/TDS calculations, which typically increases the maximum mortgage you can qualify for. Both applicants' debts are also combined in the TDS calculation.",
  },
  {
    q: "How does the Bank of Canada rate affect my mortgage?",
    a: "Variable-rate mortgages are directly tied to the prime rate, which moves with the Bank of Canada's policy rate. Fixed rates are influenced more by Government of Canada bond yields. Our calculator lets you enter any rate — try different scenarios to see how rate changes affect your qualification.",
  },
];

// ─── Gauge Component ─────────────────────────────────────────────────────────
function RatioGauge({ value, max, label, pass }: { value: number; max: number; label: string; pass: boolean }) {
  const pct = Math.min(100, (value / (max * 1.3)) * 100);
  const maxLinePct = (max / (max * 1.3)) * 100;
  return (
    <div className="gauge-wrap">
      <div className="gauge-top">
        <span className="gauge-label">{label}</span>
        <span className={`gauge-val ${pass ? "green" : "red"}`}>{fmtPct(value)}</span>
      </div>
      <div className="gauge-track">
        <div className="gauge-fill" style={{ width: `${pct}%`, background: pass ? "var(--maple)" : "var(--danger)" }} />
        <div className="gauge-limit" style={{ left: `${maxLinePct}%` }} />
      </div>
      <div className="gauge-bottom">
        <span>0%</span>
        <span className={`gauge-cap ${pass ? "green" : "red"}`}>Limit: {max}%</span>
      </div>
    </div>
  );
}

// ─── Input Field ─────────────────────────────────────────────────────────────
function Field({
  label, hint, prefix, suffix, name, value, onChange,
  min, max, step, placeholder, small,
}: {
  label: string; hint?: string; prefix?: string; suffix?: string;
  name: string; value: string; onChange: (n: string, v: string) => void;
  min?: number; max?: number; step?: number; placeholder?: string; small?: boolean;
}) {
  return (
    <div className={`field ${small ? "small" : ""}`}>
      <label>{label}</label>
      {hint && <span className="hint">{hint}</span>}
      <div className="input-row">
        {prefix && <span className="adorn">{prefix}</span>}
        <input
          type="number" name={name} value={value} min={min} max={max}
          step={step ?? 1} placeholder={placeholder}
          onChange={(e) => onChange(name, e.target.value)}
        />
        {suffix && <span className="adorn right">{suffix}</span>}
      </div>
    </div>
  );
}

export default function MortgageQualifier() {
  const [form, setForm] = useState<FormState>({
    annualIncome: "95000",
    coIncome: "0",
    downPayment: "80000",
    monthlyDebts: "350",
    interestRate: "5.49",
    amortization: "25",
    propertyTax: "5000",
    condoFee: "0",
    heatingCost: "150",
    province: "ON",
  });

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const handleChange = useCallback((n: string, v: string) => setForm(p => ({ ...p, [n]: v })), []);
  const result = useMemo(() => calculate(form), [form]);

  return (
    <div className="calc-shell">
      {/* Inputs */}
      <div className="inputs">
        <div className="panel-title">Your Information</div>

        <div className="section-sep">Income</div>
        <Field label="Your Annual Gross Income" hint="Before taxes; include employment income, self-employment, rental income" prefix="C$" name="annualIncome" value={form.annualIncome} onChange={handleChange} min={0} step={1000} placeholder="95000" />
        <Field label="Co-Applicant Annual Income" hint="Spouse / partner gross income (leave 0 if none)" prefix="C$" name="coIncome" value={form.coIncome} onChange={handleChange} min={0} step={1000} placeholder="0" />

        <div className="section-sep">Down Payment & Debts</div>
        <Field label="Down Payment" hint="Your saved amount — affects CMHC insurance and minimum rules" prefix="C$" name="downPayment" value={form.downPayment} onChange={handleChange} min={0} step={5000} placeholder="80000" />
        <Field label="Total Monthly Debt Payments" hint="Car loans, student loans, credit cards, line of credit minimums" prefix="C$" name="monthlyDebts" value={form.monthlyDebts} onChange={handleChange} min={0} step={50} placeholder="350" />

        <div className="section-sep">Mortgage Terms</div>
        <div className="field-row">
          <Field label="Interest Rate" hint="Quoted 5-yr fixed" suffix="%" name="interestRate" value={form.interestRate} onChange={handleChange} min={0} max={20} step={0.05} placeholder="5.49" small />
          <Field label="Amortization" suffix="yrs" name="amortization" value={form.amortization} onChange={handleChange} min={5} max={30} step={5} placeholder="25" small />
        </div>

        <div className="section-sep">Monthly Housing Costs</div>
        <div className="field-row">
          <Field label="Annual Property Tax" prefix="C$" name="propertyTax" value={form.propertyTax} onChange={handleChange} min={0} step={100} placeholder="5000" small />
          <Field label="Condo / Strata Fee" prefix="C$" hint="/mo" name="condoFee" value={form.condoFee} onChange={handleChange} min={0} step={50} placeholder="0" small />
        </div>
        <Field label="Monthly Heating Cost" hint="CMHC uses ~$150/mo default; adjust for your situation" prefix="C$" name="heatingCost" value={form.heatingCost} onChange={handleChange} min={0} step={25} placeholder="150" />

        <div className="section-sep">Province</div>
        <div className="field">
          <label>Province</label>
          <select value={form.province} onChange={e => setForm(p => ({ ...p, province: e.target.value }))}>
            {PROVINCES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="results">
        {result ? (
          <>
            {/* Qualify Hero */}
            <div className={`qualify-hero ${result.qualifies ? "pass" : "fail"}`}>
              <div className={`qualify-badge ${result.qualifies ? "pass" : "fail"}`}>
                {result.qualifies ? "✓ Qualifies" : "✗ Does Not Qualify"}
              </div>
              <div className="qualify-price">{fmtCAD(result.maxPurchasePrice)}</div>
              <div className="qualify-sub">Maximum estimated purchase price</div>
              <div style={{ marginTop: 12 }}>
                <div className="stress-badge">
                  ⚡ Stress-tested at {fmtPct(result.stressTestRate)} (contract rate + 2%, min {STRESS_TEST_FLOOR}%)
                </div>
              </div>
            </div>

            {/* Stat Grid */}
            <div className="stat-grid">
              <div className="stat maple-card">
                <div className="s-label">Max Mortgage</div>
                <div className="s-val">{fmtCAD(result.totalMortgage)}</div>
              </div>
              <div className="stat">
                <div className="s-label">Monthly Payment</div>
                <div className="s-val">{fmtCAD(result.monthlyPayment)}/mo</div>
              </div>
              <div className="stat">
                <div className="s-label">Down Payment %</div>
                <div className="s-val" style={{ color: result.downOk ? "var(--green)" : "var(--danger)" }}>
                  {fmtPct(result.downPct)}
                </div>
              </div>
              <div className="stat">
                <div className="s-label">LTV Ratio</div>
                <div className="s-val">{fmtPct(result.ltvRatio)}</div>
              </div>
            </div>

            {/* GDS / TDS Gauges */}
            <div className="gauges-card">
              <div className="gauges-title">Debt Service Ratios (Stress-Tested)</div>
              <RatioGauge value={result.gds} max={GDS_MAX} label="GDS — Gross Debt Service" pass={result.gdsPass} />
              <RatioGauge value={result.tds} max={TDS_MAX} label="TDS — Total Debt Service" pass={result.tdsPass} />
            </div>

            {/* CMHC / Costs */}
            <div className="cmhc-card">
              <div className="panel-title" style={{ marginBottom: 12 }}>CMHC & Closing Costs</div>
              <div className="cmhc-row">
                <span className="cmhc-label">CMHC Insurance Required?</span>
                <span className="cmhc-val" style={{ color: result.cmhcRequired ? "var(--gold)" : "var(--green)" }}>
                  {result.cmhcRequired ? `Yes — ${fmtPct(result.cmhcPct)} premium` : "No (20%+ down)"}
                </span>
              </div>
              {result.cmhcRequired && (
                <div className="cmhc-row">
                  <span className="cmhc-label">CMHC Premium Amount</span>
                  <span className="cmhc-val highlight">{fmtCAD(result.cmhcPremium)}</span>
                </div>
              )}
              <div className="cmhc-row">
                <span className="cmhc-label">Est. Land Transfer Tax</span>
                <span className="cmhc-val">{fmtCAD(result.landTransferTax)}</span>
              </div>
              {result.ltcFirstTimeBenefit > 0 && (
                <div className="cmhc-row">
                  <span className="cmhc-label">First-Time Buyer Rebate</span>
                  <span className="cmhc-val" style={{ color: "var(--green)" }}>−{fmtCAD(result.ltcFirstTimeBenefit)}</span>
                </div>
              )}
              <div className="cmhc-row">
                <span className="cmhc-label">Net Land Transfer Tax</span>
                <span className="cmhc-val highlight">{fmtCAD(result.netLandTransfer)}</span>
              </div>
              {!result.downOk && (
                <div style={{ marginTop: 10, background: "var(--danger-light)", border: "1px solid rgba(255,71,87,.25)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "var(--danger)" }}>
                  ⚠️ Minimum down payment for this price is {fmtCAD(result.minDownRequired)}. Your current down payment is insufficient.
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, color: "var(--muted)", fontSize: 14, textAlign: "center", background: "var(--surface)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
            Enter your income and rate to see your qualification results.
          </div>
        )}
      </div>

      <div className="faq-list" style={{ gridColumn: "1 / -1", marginTop: 40 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", marginBottom: 20 }}>Frequently Asked Questions</h2>
        {faqs.map((f, i) => (
          <div className="faq-item" key={i}>
            <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
              {f.q}
              <span className={`faq-chev ${openFaq === i ? "open" : ""}`}>▾</span>
            </button>
            <div className={`faq-a ${openFaq === i ? "open" : ""}`}>{f.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
