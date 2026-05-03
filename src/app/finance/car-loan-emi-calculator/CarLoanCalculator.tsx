"use client";

import { useState, useMemo } from "react";
import { 
  Car, 
  RefreshCw, 
  Scale, 
  Calculator, 
  Landmark, 
  BarChart3, 
  Lightbulb, 
  AlertTriangle,
  ChevronDown,
  Play
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormState {
  carPrice: string;
  downPayment: string;
  tradeIn: string;
  loanTerm: string;
  interestRate: string;
  creditScore: string;
  includeInsurance: boolean;
  monthlyInsurance: string;
  salesTaxRate: string;
  dealerFees: string;
  startMonth: string;
  startYear: string;
}

interface EMIResult {
  loanAmount: number;
  emi: number;
  totalInterest: number;
  totalPayment: number;
  totalCost: number;
  effectiveRate: number;
  interestRatio: number;
  monthlyBreakdown: { principal: number; interest: number };
  payoffDate: string;
  schedule: AmortRow[];
  salesTax: number;
  dealerFees: number;
}

interface AmortRow {
  month: number;
  label: string;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
  cumulativeInterest: number;
}

// ─── Credit score → typical APR (2026 market) ────────────────────────────────
const CREDIT_RATE_MAP: Record<string, { range: string; newRate: string; usedRate: string }> = {
  "exceptional": { range: "800–850", newRate: "5.2",  usedRate: "6.8"  },
  "verygood":    { range: "740–799", newRate: "6.1",  usedRate: "8.2"  },
  "good":        { range: "670–739", newRate: "7.4",  usedRate: "10.5" },
  "fair":        { range: "580–669", newRate: "10.8", usedRate: "14.9" },
  "poor":        { range: "300–579", newRate: "15.2", usedRate: "20.4" },
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ─── EMI Formula ──────────────────────────────────────────────────────────────
// EMI = P × r × (1+r)^n / ((1+r)^n − 1)
function calcEMI(principal: number, annualRate: number, months: number): number {
  if (annualRate === 0) return principal / months;
  const r = annualRate / 100 / 12;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

function buildSchedule(
  principal: number,
  annualRate: number,
  months: number,
  startMonth: number,
  startYear: number
): AmortRow[] {
  const emi = calcEMI(principal, annualRate, months);
  const r = annualRate / 100 / 12;
  let balance = principal;
  let cumInterest = 0;
  const rows: AmortRow[] = [];

  for (let i = 1; i <= months; i++) {
    const interest = balance * r;
    const princ = Math.min(emi - interest, balance);
    balance = Math.max(0, balance - princ);
    cumInterest += interest;
    const mIdx = (startMonth + i - 1) % 12;
    const yr = startYear + Math.floor((startMonth + i - 1) / 12);
    rows.push({
      month: i,
      label: `${MONTHS[mIdx]} ${yr}`,
      emi: emi,
      principal: princ,
      interest,
      balance,
      cumulativeInterest: cumInterest,
    });
  }
  return rows;
}

function calculate(f: FormState): EMIResult | null {
  const carPrice      = parseFloat(f.carPrice.replace(/,/g, "")) || 0;
  const downPayment   = parseFloat(f.downPayment.replace(/,/g, "")) || 0;
  const tradeIn       = parseFloat(f.tradeIn.replace(/,/g, "")) || 0;
  const loanTerm      = parseInt(f.loanTerm) || 60;
  const interestRate  = parseFloat(f.interestRate) || 0;
  const salesTaxPct   = parseFloat(f.salesTaxRate) || 0;
  const dealerFees    = parseFloat(f.dealerFees.replace(/,/g, "")) || 0;
  const monthlyIns    = f.includeInsurance ? (parseFloat(f.monthlyInsurance) || 0) : 0;
  const startMonth    = parseInt(f.startMonth) || 0;
  const startYear     = parseInt(f.startYear) || new Date().getFullYear();

  if (carPrice <= 0) return null;

  const salesTax    = carPrice * (salesTaxPct / 100);
  const totalCarCost = carPrice + salesTax + dealerFees;
  const loanAmount  = Math.max(0, totalCarCost - downPayment - tradeIn);

  if (loanAmount <= 0) return null;

  const emi = calcEMI(loanAmount, interestRate, loanTerm);
  const totalPayment = emi * loanTerm;
  const totalInterest = totalPayment - loanAmount;
  const totalCost = totalCarCost + totalInterest + monthlyIns * loanTerm;
  const interestRatio = (totalInterest / totalPayment) * 100;

  const schedule = buildSchedule(loanAmount, interestRate, loanTerm, startMonth, startYear);
  const lastRow = schedule[schedule.length - 1];

  const r = interestRate / 100 / 12;
  const monthlyPrincipal = emi - loanAmount * r;
  const monthlyInterest  = loanAmount * r;

  return {
    loanAmount,
    emi,
    totalInterest,
    totalPayment,
    totalCost,
    effectiveRate: interestRate,
    interestRatio,
    monthlyBreakdown: { principal: monthlyPrincipal, interest: monthlyInterest },
    payoffDate: lastRow?.label || "",
    schedule,
    salesTax,
    dealerFees,
  };
}

// ─── Formatters ───────────────────────────────────────────────────────────────
const f$ = (v: number, d = 0) =>
  "$" + Math.abs(v).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const fPct = (v: number, d = 1) => v.toFixed(d) + "%";

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "What is a car loan EMI?",
    a: "EMI stands for Equated Monthly Installment — the fixed monthly payment you make to repay your car loan. Each EMI consists of two components: principal repayment (reducing your loan balance) and interest charges. In the early months of your loan, a larger share of each EMI goes toward interest; by the final months, most of each payment reduces the principal. This is called an amortizing loan structure.",
  },
  {
    q: "What is the car loan EMI formula?",
    a: "The standard car loan EMI formula is: EMI = P × r × (1+r)^n ÷ [(1+r)^n − 1], where P is the principal loan amount, r is the monthly interest rate (annual rate ÷ 12 ÷ 100), and n is the number of monthly installments. For example: $25,000 loan at 7% annual rate for 60 months → r = 7/12/100 = 0.00583 → EMI = $495.03.",
  },
  {
    q: "How is car loan interest calculated?",
    a: "Car loan interest is calculated monthly on the outstanding balance using the reducing balance method (also called amortization). Each month: Interest = Outstanding Balance × Monthly Rate. Principal Repaid = EMI − Interest. New Balance = Previous Balance − Principal Repaid. This continues until the balance reaches zero at the end of the loan term.",
  },
  {
    q: "What credit score do I need for a good car loan rate in 2026?",
    a: "In 2026, borrowers with credit scores of 740+ (Very Good/Exceptional) typically qualify for the best new car loan rates, around 5.2%–6.1% APR. Good credit (670–739) sees rates of 7%–10%. Fair credit (580–669) may pay 11%–15%, and poor credit (below 580) often faces rates of 15%–20%+. Even a 1% rate difference on a $30,000 loan over 60 months costs you roughly $800 in extra interest.",
  },
  {
    q: "How much should I put down on a car?",
    a: "Financial advisors typically recommend a down payment of 20% on a new car and 10% on a used car. A larger down payment reduces your loan principal (lowering EMI and total interest), prevents being 'upside-down' on your loan (owing more than the car is worth due to depreciation), and may help you qualify for better rates. However, putting too much cash down can deplete emergency funds — balance the math against your liquidity needs.",
  },
  {
    q: "What is the best car loan term length?",
    a: "The optimal loan term balances monthly affordability with total interest paid. Shorter terms (36–48 months) have higher EMIs but save significantly on interest and ensure you build equity faster than the car depreciates. Longer terms (72–84 months) lower your monthly payment but cost thousands more in interest and risk putting you underwater on the loan. For most buyers, 48–60 months is the sweet spot in 2026.",
  },
  {
    q: "Should I finance through a dealer or bank?",
    a: "Both options have merits. Bank/credit union financing: often lower rates, transparent terms, pre-approval gives bargaining power at the dealership, you know your rate before you negotiate the car price. Dealer financing: convenience, sometimes offers promotional 0% APR deals on new vehicles, but markups are common and the process can obscure the true cost. Always get pre-approved by a bank or credit union first, then see if the dealer can beat it.",
  },
  {
    q: "What fees are included in a car loan?",
    a: "Beyond the car's sticker price, expect: sales tax (varies by state, typically 2%–10%), dealer documentation fees ($100–$500+), registration and title fees ($50–$200+), dealer prep fees (sometimes negotiable), extended warranty costs if rolled in, and GAP insurance if you finance more than 80% of the car's value. Our calculator lets you include sales tax rate and dealer fees for a realistic total cost picture.",
  },
  {
    q: "What is GAP insurance and do I need it?",
    a: "GAP (Guaranteed Asset Protection) insurance covers the 'gap' between what you owe on your loan and what your car is worth if it's totaled or stolen. New cars can depreciate 15%–25% in the first year, meaning you could owe more than the car's value for the first 1–2 years. If you put less than 20% down, financed more than the car's value (by rolling in fees), or have a loan term over 60 months, GAP insurance is worth considering.",
  },
];

// ─── Use Cases ────────────────────────────────────────────────────────────────
const useCases = [
  { icon: <Car className="uc-icon-svg" />, title: "New Car Buyers", desc: "See your exact EMI before walking into the dealership. Knowing your numbers prevents you from being upsold on longer terms or higher rates." },
  { icon: <RefreshCw className="uc-icon-svg" />, title: "Refinance Candidates", desc: "If interest rates have dropped or your credit improved, model your new EMI after refinancing. Even a 1% rate drop can save hundreds over your remaining term." },
  { icon: <Scale className="uc-icon-svg" />, title: "Comparing Loan Offers", desc: "Run multiple scenarios side by side — different terms, rates, and down payments. The total interest column reveals what cheap monthly payments really cost." },
  { icon: <Calculator className="uc-icon-svg" />, title: "Budget Planners", desc: "Work backwards from your target monthly payment to find the right combination of price, down payment, and term that fits your budget." },
  { icon: <Landmark className="uc-icon-svg" />, title: "Credit Union vs. Dealer Finance", desc: "Enter your bank's pre-approval rate alongside the dealer's offer to see the exact dollar savings from each option over the full loan term." },
  { icon: <BarChart3 className="uc-icon-svg" />, title: "Pre-Purchase Research", desc: "Model used vs. new car scenarios. Factor in higher used car rates vs. lower purchase price to find the total cost winner for your situation." },
];

// ─── Speedometer Gauge SVG ────────────────────────────────────────────────────
function SpeedometerGauge({ value, max, label, unit, color }: {
  value: number; max: number; label: string; unit: string; color: string;
}) {
  const pct = Math.min(1, value / max);
  const startAngle = -225;
  const sweepAngle = 270;
  const angle = startAngle + pct * sweepAngle;
  const r = 44;
  const cx = 60, cy = 64;
  const toXY = (deg: number, radius: number) => {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };
  const arcStart = toXY(startAngle, r);
  const arcEnd   = toXY(startAngle + sweepAngle, r);
  const needleEnd = toXY(angle, r - 10);
  const largeArc = sweepAngle > 180 ? 1 : 0;

  return (
    <div className="gauge-container">
      <svg viewBox="0 0 120 90" className="gauge-svg">
        {/* Track */}
        <path
          d={`M ${arcStart.x} ${arcStart.y} A ${r} ${r} 0 ${largeArc} 1 ${arcEnd.x} ${arcEnd.y}`}
          fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="6" strokeLinecap="round"
        />
        {/* Fill */}
        {pct > 0 && (() => {
          const fillEnd = toXY(angle, r);
          const filledSweep = pct * sweepAngle;
          const filledLarge = filledSweep > 180 ? 1 : 0;
          return (
            <path
              d={`M ${arcStart.x} ${arcStart.y} A ${r} ${r} 0 ${filledLarge} 1 ${fillEnd.x} ${fillEnd.y}`}
              fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 4px ${color})` }}
            />
          );
        })()}
        {/* Needle */}
        <line x1={cx} y1={cy} x2={needleEnd.x} y2={needleEnd.y}
          stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity=".8" />
        <circle cx={cx} cy={cy} r="3" fill={color} />
      </svg>
      <div className="gauge-label-wrap">
        <div className="gauge-value" style={{ color }}>{unit}{Math.round(value).toLocaleString()}</div>
        <div className="gauge-name">{label}</div>
      </div>
    </div>
  );
}

// ─── Donut Chart ──────────────────────────────────────────────────────────────
function DonutChart({ principal, interest, fees }: { principal: number; interest: number; fees: number }) {
  const total = principal + interest + fees;
  if (total === 0) return null;
  const R = 52, cx = 64, cy = 64;
  const circ = 2 * Math.PI * R;

  const segs = [
    { val: principal, color: "#00d4ff", label: "Principal" },
    { val: interest,  color: "#ff6b35", label: "Interest"  },
    { val: fees,      color: "#ffd700", label: "Tax & Fees" },
  ].filter(s => s.val > 0);

  let offset = 0;
  const arcs = segs.map(s => {
    const dash = (s.val / total) * circ;
    const arc = { ...s, dash, offset: -offset };
    offset += dash;
    return arc;
  });

  return (
    <div className="donut-wrap">
      <svg viewBox="0 0 128 128" className="donut-svg">
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="18" />
        {arcs.map((arc, i) => (
          <circle key={i} cx={cx} cy={cy} r={R}
            fill="none" stroke={arc.color} strokeWidth="18"
            strokeDasharray={`${arc.dash} ${circ - arc.dash}`}
            strokeDashoffset={arc.offset}
            style={{ transform: "rotate(-90deg)", transformOrigin: "64px 64px", filter: `drop-shadow(0 0 3px ${arc.color}40)` }}
          />
        ))}
        <circle cx={cx} cy={cy} r={R - 12} fill="#0d1117" />
      </svg>
      <div className="donut-legend">
        {arcs.map((arc, i) => (
          <div className="dl-item" key={i}>
            <div className="dl-dot" style={{ background: arc.color, boxShadow: `0 0 6px ${arc.color}80` }} />
            <span className="dl-label">{arc.label}</span>
            <span className="dl-val">{f$(arc.val)}</span>
          </div>
        ))}
        <div className="dl-item dl-total">
          <div className="dl-dot" style={{ background: "transparent" }} />
          <span className="dl-label">Total Cost</span>
          <span className="dl-val">{f$(total)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Input Field ─────────────────────────────────────────────────────────────
function Field({ label, hint, prefix, suffix, value, onChange, step, placeholder, min, max }: {
  label: string; hint?: string; prefix?: string; suffix?: string;
  value: string; onChange: (v: string) => void;
  step?: number; placeholder?: string; min?: number; max?: number;
}) {
  return (
    <div className="field">
      <div className="fl">
        <label>{label}</label>
        {hint && <span className="fhint">{hint}</span>}
      </div>
      <div className="iw">
        {prefix && <span className="ad">{prefix}</span>}
        <input type="number" value={value} step={step ?? 1}
          min={min ?? 0} max={max} placeholder={placeholder ?? "0"}
          onChange={e => onChange(e.target.value)} />
        {suffix && <span className="ad r">{suffix}</span>}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CarLoanCalculator() {
  const now = new Date();
  const [form, setForm] = useState<FormState>({
    carPrice:         "35000",
    downPayment:      "5000",
    tradeIn:          "0",
    loanTerm:         "60",
    interestRate:     "7.4",
    creditScore:      "good",
    includeInsurance: false,
    monthlyInsurance: "150",
    salesTaxRate:     "8",
    dealerFees:       "800",
    startMonth:       String(now.getMonth()),
    startYear:        String(now.getFullYear()),
  });
  const [openFaq, setOpenFaq]     = useState<number | null>(null);
  const [showAmort, setShowAmort] = useState(false);
  const [activeTab, setActiveTab] = useState<"monthly" | "yearly">("monthly");

  const set = (k: keyof FormState) => (v: string) => setForm(p => ({ ...p, [k]: v }));
  const result = useMemo(() => calculate(form), [form]);

  const currentYear = now.getFullYear();
  const years = Array.from({ length: 8 }, (_, i) => currentYear + i);

  const yearlySchedule = useMemo(() => {
    if (!result) return [];
    const yearly: { year: string; principal: number; interest: number; balance: number }[] = [];
    let idx = 0;
    while (idx < result.schedule.length) {
      const yr = result.schedule[idx].label.split(" ")[1];
      let yp = 0, yi = 0, yb = 0;
      while (idx < result.schedule.length && result.schedule[idx].label.split(" ")[1] === yr) {
        yp += result.schedule[idx].principal;
        yi += result.schedule[idx].interest;
        yb  = result.schedule[idx].balance;
        idx++;
      }
      yearly.push({ year: yr, principal: yp, interest: yi, balance: yb });
    }
    return yearly;
  }, [result]);

  return (
    <div className="car-emi-app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,300;0,400;0,600;0,700;0,900;1,400&family=JetBrains+Mono:wght@400;500;700&display=swap');

        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

        .car-emi-app {
          font-family: 'Exo 2', sans-serif;
          background: var(--void);
          color: var(--text);
          line-height: 1.6;
          font-size: 15px;
          background-image:
            radial-gradient(ellipse 80% 40% at 50% -10%, rgba(0,212,255,.07) 0%, transparent 70%),
            repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(0,212,255,.015) 60px, rgba(0,212,255,.015) 61px),
            repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(0,212,255,.015) 60px, rgba(0,212,255,.015) 61px);

          /* Theme Overrides for Children */
          --foreground:       #c8d8e8;
          --muted-foreground: #5a7a9a;
          --border:           #1e2a38;
          --card:             #111820;
          --primary:          #00d4ff;
        }

        :root {
          --void:    #080b10;
          --base:    #0d1117;
          --panel:   #111820;
          --raised:  #161e28;
          --rim:     #1e2a38;
          --rim2:    #263548;
          --text:    #c8d8e8;
          --muted:   #5a7a9a;
          --faint:   #2a3a50;
          --blue:    #00d4ff;
          --blue2:   #0099cc;
          --blue-lt: rgba(0,212,255,.1);
          --orange:  #ff6b35;
          --orange-lt: rgba(255,107,53,.1);
          --gold:    #ffd700;
          --gold-lt: rgba(255,215,0,.08);
          --green:   #00e87a;
          --green-lt: rgba(0,232,122,.08);
          --red:     #ff3a3a;
        }

        .page { max-width: 1060px; margin: 0 auto; padding: 0 20px 100px; }

        /* ── Hero ── */
        .hero {
          padding: 60px 0 48px;
          position: relative;
          overflow: hidden;
        }
        .hero::before {
          content: 'EMI';
          position: absolute;
          right: -20px; top: 20px;
          font-family: 'Exo 2', sans-serif;
          font-size: 200px;
          font-weight: 900;
          font-style: italic;
          color: rgba(0,212,255,.025);
          line-height: 1;
          pointer-events: none;
          letter-spacing: -.05em;
        }

        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--blue-lt); border: 1px solid rgba(0,212,255,.2);
          color: var(--blue); font-size: 11px; font-weight: 600;
          letter-spacing: .14em; text-transform: uppercase;
          padding: 5px 14px; border-radius: 4px;
          margin-bottom: 20px;
          font-family: 'JetBrains Mono', monospace;
        }
        .hero-badge-icon { width: 10px; height: 10px; color: var(--blue); }

        h1.hero-h1 {
          font-family: 'Exo 2', sans-serif;
          font-size: clamp(2.4rem, 6vw, 4.5rem);
          font-weight: 900;
          font-style: italic;
          line-height: 1;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: -.02em;
          margin-bottom: 16px;
        }
        h1.hero-h1 .hl { color: var(--blue); }

        .hero-sub {
          font-size: 16px; color: var(--muted);
          max-width: 560px; font-weight: 300;
          margin-bottom: 24px;
        }

        .hero-stats {
          display: flex; gap: 24px; flex-wrap: wrap;
        }
        .hs-item {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; color: var(--muted);
          display: flex; align-items: center; gap: 6px;
        }
        .hs-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--blue); }
        .hs-item strong { color: var(--blue); }

        /* ── Layout ── */
        .main-layout {
          display: grid;
          grid-template-columns: 400px 1fr;
          gap: 20px;
          margin-bottom: 72px;
          animation: slideUp .5s cubic-bezier(.2,0,.2,1) both;
        }
        @media (max-width: 860px) { .main-layout { grid-template-columns: 1fr; } }
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }

        /* ── Input Panel ── */
        .input-panel {
          background: var(--panel);
          border: 1px solid var(--rim);
          border-radius: 12px;
          overflow: hidden;
          position: relative;
        }
        .input-panel::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--blue), transparent);
        }
        .ip-header {
          padding: 16px 22px;
          background: var(--raised);
          border-bottom: 1px solid var(--rim);
          display: flex; align-items: center; gap: 10px;
        }
        .ip-title {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; color: var(--blue);
          letter-spacing: .12em; text-transform: uppercase; flex: 1;
        }
        .ip-led { width: 8px; height: 8px; border-radius: 50%; background: var(--blue); box-shadow: 0 0 8px var(--blue); animation: pulse 2s ease infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        .ip-body { padding: 22px 20px; }

        .sec {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9.5px; color: var(--muted);
          text-transform: uppercase; letter-spacing: .18em;
          margin: 20px 0 12px;
          display: flex; align-items: center; gap: 8px;
        }
        .sec::after { content: ''; flex: 1; height: 1px; background: var(--faint); }
        .sec:first-of-type { margin-top: 0; }

        .field { margin-bottom: 12px; }
        .fl { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
        .field label { font-size: 12px; font-weight: 600; color: var(--text); letter-spacing: .02em; }
        .fhint { font-size: 10px; color: var(--muted); font-family: 'JetBrains Mono', monospace; }
        .iw {
          display: flex; align-items: center;
          background: var(--void); border: 1px solid var(--rim);
          border-radius: 6px; overflow: hidden; transition: border-color .15s;
        }
        .iw:focus-within { border-color: var(--blue); box-shadow: 0 0 0 2px rgba(0,212,255,.1); }
        .ad {
          padding: 0 10px; font-size: 13px; color: var(--muted);
          background: var(--faint); border-right: 1px solid var(--rim);
          height: 38px; display: flex; align-items: center;
          font-family: 'JetBrains Mono', monospace; flex-shrink: 0;
        }
        .ad.r { border-right: none; border-left: 1px solid var(--rim); }
        .iw input {
          flex: 1; border: none; outline: none;
          padding: 0 10px; height: 38px;
          font-size: 13.5px; font-family: 'JetBrains Mono', monospace;
          color: #fff; background: transparent;
          -moz-appearance: textfield; font-weight: 500;
        }
        .iw input::-webkit-outer-spin-button, .iw input::-webkit-inner-spin-button { -webkit-appearance: none; }

        .fp { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

        select.emi-select {
          width: 100%; height: 38px;
          background: var(--void); border: 1px solid var(--rim);
          border-radius: 6px; color: var(--text);
          font-family: 'JetBrains Mono', monospace; font-size: 12px;
          padding: 0 10px; outline: none; cursor: pointer;
          transition: border-color .15s;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%235a7a9a' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 10px center;
          padding-right: 28px;
        }
        select.emi-select:focus { border-color: var(--blue); }

        .credit-grid {
          display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px;
          margin-bottom: 10px;
        }
        .credit-btn {
          padding: 7px 4px; border-radius: 5px;
          border: 1px solid var(--rim); background: var(--void);
          cursor: pointer; text-align: center; transition: all .13s;
          font-family: 'JetBrains Mono', monospace;
        }
        .credit-btn .cb-label { font-size: 9px; color: var(--muted); display: block; margin-bottom: 2px; letter-spacing: .06em; }
        .credit-btn .cb-rate { font-size: 11px; font-weight: 700; color: var(--text); }
        .credit-btn:hover { border-color: var(--rim2); }
        .credit-btn.active { border-color: var(--blue); background: var(--blue-lt); }
        .credit-btn.active .cb-label { color: var(--blue); }
        .credit-btn.active .cb-rate { color: var(--blue); }

        .toggle-row {
          display: flex; align-items: center; gap: 10px;
          background: var(--void); border: 1px solid var(--rim);
          border-radius: 6px; padding: 10px 12px; margin-bottom: 10px;
        }
        .tog { position: relative; width: 36px; height: 20px; flex-shrink: 0; }
        .tog input { opacity: 0; width: 0; height: 0; }
        .tog-sl { position: absolute; inset: 0; background: var(--faint); border-radius: 100px; cursor: pointer; transition: background .2s; }
        .tog-sl::before { content: ''; position: absolute; width: 14px; height: 14px; left: 3px; top: 3px; background: var(--muted); border-radius: 50%; transition: all .2s; }
        .tog input:checked + .tog-sl { background: var(--blue); }
        .tog input:checked + .tog-sl::before { transform: translateX(16px); background: #fff; }
        .tog-lbl { font-size: 12px; font-weight: 600; color: var(--text); flex: 1; }

        /* ── Results ── */
        .results-col { display: flex; flex-direction: column; gap: 14px; }

        /* EMI Hero */
        .emi-hero {
          background: var(--panel);
          border: 1px solid var(--rim);
          border-radius: 12px;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }
        .emi-hero::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, var(--blue), var(--blue2), transparent);
        }
        .emi-top {
          display: flex; justify-content: space-between;
          align-items: center; flex-wrap: wrap; gap: 16px;
          margin-bottom: 20px;
        }
        .emi-main { }
        .emi-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; color: var(--muted);
          text-transform: uppercase; letter-spacing: .16em;
          margin-bottom: 6px;
        }
        .emi-amount {
          font-family: 'Exo 2', sans-serif;
          font-size: clamp(2.8rem, 7vw, 4.5rem);
          font-weight: 900; font-style: italic;
          color: var(--blue); line-height: 1;
          text-shadow: 0 0 30px rgba(0,212,255,.3);
        }
        .emi-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; color: var(--muted); margin-top: 4px;
        }
        .emi-badges { display: flex; flex-direction: column; gap: 8px; }
        .emi-badge {
          background: var(--raised); border: 1px solid var(--rim2);
          border-radius: 6px; padding: 8px 14px; text-align: right;
        }
        .eb-label { font-size: 9px; color: var(--muted); text-transform: uppercase; letter-spacing: .1em; margin-bottom: 2px; font-family: 'JetBrains Mono', monospace; }
        .eb-val { font-size: 15px; font-weight: 700; color: var(--text); font-family: 'JetBrains Mono', monospace; }
        .emi-badge.orange { background: var(--orange-lt); border-color: rgba(255,107,53,.25); }
        .emi-badge.orange .eb-val { color: var(--orange); }
        .emi-badge.green { background: var(--green-lt); border-color: rgba(0,232,122,.25); }
        .emi-badge.green .eb-val { color: var(--green); }

        /* Gauges */
        .gauges-row {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 10px; margin-bottom: 0;
        }
        @media (max-width: 500px) { .gauges-row { grid-template-columns: 1fr 1fr; } }
        .gauge-container { background: var(--raised); border: 1px solid var(--rim); border-radius: 10px; padding: 14px 10px 10px; text-align: center; }
        .gauge-svg { width: 100%; height: 80px; display: block; }
        .gauge-label-wrap { }
        .gauge-value { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; line-height: 1; }
        .gauge-name { font-size: 9.5px; color: var(--muted); text-transform: uppercase; letter-spacing: .1em; margin-top: 3px; }

        /* Donut */
        .donut-card { background: var(--panel); border: 1px solid var(--rim); border-radius: 12px; padding: 18px 20px; }
        .donut-title { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: .12em; margin-bottom: 14px; }
        .donut-wrap { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
        .donut-svg { width: 110px; height: 110px; flex-shrink: 0; }
        .donut-legend { flex: 1; min-width: 160px; }
        .dl-item { display: flex; align-items: center; gap: 8px; padding: 5px 0; border-bottom: 1px solid var(--faint); }
        .dl-item:last-child { border-bottom: none; }
        .dl-total { margin-top: 4px; }
        .dl-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
        .dl-label { flex: 1; font-size: 12px; color: var(--muted); }
        .dl-val { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: var(--text); }
        .dl-total .dl-val { color: var(--blue); }

        /* Stats bar */
        .stats-bar { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        @media (max-width: 500px) { .stats-bar { grid-template-columns: 1fr 1fr; } }
        .stat { background: var(--panel); border: 1px solid var(--rim); border-radius: 8px; padding: 13px 14px; }
        .stat .s-lbl { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--muted); text-transform: uppercase; letter-spacing: .12em; margin-bottom: 5px; }
        .stat .s-val { font-family: 'Exo 2', sans-serif; font-size: 1.25rem; font-weight: 700; color: #fff; }
        .stat.blue .s-val { color: var(--blue); }
        .stat.orange .s-val { color: var(--orange); }
        .stat.gold .s-val { color: var(--gold); }
        .stat.green .s-val { color: var(--green); }

        /* Rate suggestion card */
        .rate-card {
          background: var(--panel); border: 1px solid var(--rim);
          border-radius: 10px; padding: 14px 18px;
          display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
        }
        .rate-card-icon { width: 22px; height: 22px; color: var(--gold); flex-shrink: 0; }
        .rate-card-body { flex: 1; }
        .rate-card-title { font-size: 12px; font-weight: 700; color: var(--text); margin-bottom: 2px; }
        .rate-card-sub { font-size: 11.5px; color: var(--muted); font-weight: 300; }
        .rate-chip {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px; font-weight: 700; color: var(--blue);
          background: var(--blue-lt); border: 1px solid rgba(0,212,255,.2);
          border-radius: 4px; padding: 4px 10px; flex-shrink: 0;
        }

        /* Amort toggle */
        .amort-toggle {
          background: none; border: 1px solid var(--rim);
          border-radius: 6px; padding: 10px 20px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px; color: var(--blue); cursor: pointer;
          display: block; width: 100%; transition: all .15s;
          text-transform: uppercase; letter-spacing: .1em;
        }
        .amort-toggle:hover { background: var(--blue-lt); border-color: var(--blue); }

        /* Tab bar */
        .tab-bar { display: flex; background: var(--panel); border: 1px solid var(--rim); border-radius: 8px; padding: 4px; gap: 4px; width: fit-content; margin-bottom: 12px; }
        .tab-btn { padding: 7px 18px; border-radius: 5px; border: none; cursor: pointer; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .1em; transition: all .15s; background: transparent; color: var(--muted); }
        .tab-btn.active { background: var(--blue); color: #000; }

        /* Amort table */
        .tbl-wrap { overflow-x: auto; border: 1px solid var(--rim); border-radius: 10px; margin-bottom: 60px; }
        .amort-tbl { width: 100%; border-collapse: collapse; font-size: 12.5px; }
        .amort-tbl th { background: var(--raised); color: var(--blue); padding: 10px 12px; text-align: right; font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; white-space: nowrap; font-family: 'JetBrains Mono', monospace; }
        .amort-tbl th:first-child { text-align: left; }
        .amort-tbl td { padding: 9px 12px; border-bottom: 1px solid var(--faint); color: var(--muted); text-align: right; white-space: nowrap; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; }
        .amort-tbl td:first-child { text-align: left; color: var(--text); font-weight: 600; }
        .amort-tbl tr:last-child td { border-bottom: none; }
        .amort-tbl tr:hover td { background: var(--raised); }
        .amort-tbl td.p-col { color: var(--blue); }
        .amort-tbl td.i-col { color: var(--orange); }
        .amort-tbl td.b-col { color: var(--text); font-weight: 700; }

        /* ── Prose ── */
        .prose { margin-bottom: 60px; }
        .prose h2 {
          font-family: 'Exo 2', sans-serif;
          font-size: clamp(1.6rem, 3.5vw, 2.4rem);
          font-weight: 900; font-style: italic;
          text-transform: uppercase; letter-spacing: -.01em;
          color: #fff; margin-bottom: 16px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--rim);
        }
        .prose h2 em { font-style: normal; color: var(--blue); }
        .prose h3 { font-family: 'Exo 2', sans-serif; font-size: 1.1rem; font-weight: 700; color: var(--text); margin: 24px 0 8px; text-transform: uppercase; letter-spacing: .04em; }
        .prose p { color: var(--muted); margin-bottom: 14px; font-size: 15px; font-weight: 300; line-height: 1.75; }
        .prose strong { color: var(--text); font-weight: 600; }
        .prose ul { margin: 0 0 14px 18px; }
        .prose ul li { margin-bottom: 7px; font-size: 14.5px; color: var(--muted); font-weight: 300; }

        .formula-block {
          background: var(--void); border: 1px solid var(--rim);
          border-left: 3px solid var(--blue);
          border-radius: 6px; padding: 16px 18px;
          margin: 16px 0; font-family: 'JetBrains Mono', monospace;
          font-size: 13px; color: var(--text); line-height: 2;
        }
        .formula-block .key { color: var(--blue); }

        .callout {
          background: var(--blue-lt); border: 1px solid rgba(0,212,255,.15);
          border-radius: 6px; padding: 14px 18px;
          margin: 16px 0; font-size: 14.5px; color: var(--text);
          font-weight: 300; line-height: 1.7; display: flex; gap: 12px; align-items: center;
        }
        .callout-icon { width: 18px; height: 18px; color: var(--blue); flex-shrink: 0; }
        .callout.warn { background: var(--orange-lt); border-color: rgba(255,107,53,.2); color: #ffc4a8; }
        .callout.warn .callout-icon { color: var(--orange); }

        .dt { width: 100%; border-collapse: collapse; font-size: 13.5px; border-radius: 6px; overflow: hidden; border: 1px solid var(--rim); margin: 16px 0; }
        .dt th { background: var(--raised); color: var(--blue); padding: 10px 14px; text-align: left; font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; font-family: 'JetBrains Mono', monospace; }
        .dt td { padding: 10px 14px; border-bottom: 1px solid var(--faint); color: var(--muted); font-weight: 300; }
        .dt tr:last-child td { border-bottom: none; }
        .dt tr:hover td { background: var(--raised); }

        .steps { counter-reset: s; display: flex; flex-direction: column; gap: 10px; }
        .step { display: flex; gap: 14px; counter-increment: s; background: var(--panel); border: 1px solid var(--rim); border-radius: 8px; padding: 16px 18px; transition: border-color .15s; }
        .step:hover { border-color: var(--rim2); }
        .step-n { width: 28px; height: 28px; border-radius: 4px; background: var(--blue); color: #000; font-size: 13px; font-weight: 900; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-family: 'Exo 2', sans-serif; font-style: italic; }
        .step-n::before { content: counter(s); }
        .step-body h4 { font-size: 13.5px; font-weight: 700; color: var(--text); margin-bottom: 4px; text-transform: uppercase; letter-spacing: .04em; }
        .step-body p { font-size: 13px; color: var(--muted); margin: 0; font-weight: 300; }

        .ucg { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; }
        .uc { background: var(--panel); border: 1px solid var(--rim); border-radius: 8px; padding: 18px; transition: border-color .15s, background .15s; }
        .uc:hover { border-color: var(--rim2); background: var(--raised); }
        .uc-icon-svg { width: 24px; height: 24px; color: var(--blue); margin-bottom: 10px; }
        .uc h4 { font-family: 'Exo 2', sans-serif; font-size: .95rem; font-weight: 700; color: var(--text); margin-bottom: 6px; text-transform: uppercase; letter-spacing: .04em; }
        .uc p { font-size: 13px; color: var(--muted); margin: 0; font-weight: 300; }

        .faq-list { display: flex; flex-direction: column; gap: 6px; }
        .faq-item { background: var(--panel); border: 1px solid var(--rim); border-radius: 6px; overflow: hidden; }
        .faq-q { width: 100%; text-align: left; padding: 14px 18px; font-size: 14px; font-weight: 600; color: var(--text); background: none; border: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 12px; font-family: 'Exo 2', sans-serif; transition: background .1s; }
        .faq-q:hover { background: var(--raised); }
        .faq-chev { flex-shrink: 0; color: var(--muted); transition: transform .22s; width: 16px; height: 16px; }
        .faq-chev.open { transform: rotate(180deg); color: var(--blue); }
        .faq-a { max-height: 0; overflow: hidden; transition: max-height .32s ease, padding .32s; font-size: 14px; color: var(--muted); line-height: 1.75; padding: 0 18px; font-weight: 300; }
        .faq-a.open { max-height: 400px; padding: 0 18px 15px; }

        .footer { text-align: center; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--muted); padding: 32px 0 20px; border-top: 1px solid var(--rim); line-height: 2; }
      `}</style>

      <div className="page">
        {/* Hero */}
        <header className="hero">
          <div className="hero-badge">
            <Play className="hero-badge-icon" />
            Free Car Loan Calculator · 2026 Updated
          </div>
          <h1 className="hero-h1">Car Loan <span className="hl">EMI</span><br />Calculator</h1>
          <p className="hero-sub">
            Calculate your exact monthly car payment, total interest, amortization schedule — with 2026 rates by credit score, sales tax, and dealer fees built in.
          </p>
          <div className="hero-stats">
            <div className="hs-item"><div className="hs-dot" /><strong>EMI Formula</strong> included</div>
            <div className="hs-item"><div className="hs-dot" /><strong>Full amortization</strong> table</div>
            <div className="hs-item"><div className="hs-dot" /><strong>2026 APR</strong> by credit score</div>
            <div className="hs-item"><div className="hs-dot" />No sign-up</div>
          </div>
        </header>

        {/* Main Calculator */}
        <div className="main-layout">

          {/* Inputs */}
          <div className="input-panel">
            <div className="ip-header">
              <div className="ip-led" />
              <div className="ip-title">// LOAN_PARAMETERS</div>
            </div>
            <div className="ip-body">

              <div className="sec">Vehicle</div>
              <Field label="Car Price (Sticker / OTD)" prefix="$" value={form.carPrice} onChange={set("carPrice")} step={500} placeholder="35000" />
              <div className="fp">
                <Field label="Down Payment" prefix="$" value={form.downPayment} onChange={set("downPayment")} step={500} placeholder="5000" />
                <Field label="Trade-In Value" prefix="$" value={form.tradeIn} onChange={set("tradeIn")} step={500} placeholder="0" />
              </div>
              <div className="fp">
                <Field label="Sales Tax Rate" hint="varies by state" suffix="%" value={form.salesTaxRate} onChange={set("salesTaxRate")} step={0.25} placeholder="8" />
                <Field label="Dealer / Doc Fees" prefix="$" value={form.dealerFees} onChange={set("dealerFees")} step={50} placeholder="800" />
              </div>

              <div className="sec">Loan Terms</div>
              <div className="fp">
                <div className="field">
                  <div className="fl"><label>Loan Term</label></div>
                  <select className="emi-select" value={form.loanTerm} onChange={e => setForm(p => ({ ...p, loanTerm: e.target.value }))}>
                    <option value="24">24 months (2 yr)</option>
                    <option value="36">36 months (3 yr)</option>
                    <option value="48">48 months (4 yr)</option>
                    <option value="60">60 months (5 yr)</option>
                    <option value="72">72 months (6 yr)</option>
                    <option value="84">84 months (7 yr)</option>
                  </select>
                </div>
                <Field label="Interest Rate (APR)" suffix="%" value={form.interestRate} onChange={set("interestRate")} step={0.05} placeholder="7.4" min={0} max={40} />
              </div>

              <div className="sec">Credit Score → Est. APR</div>
              <div className="credit-grid">
                {Object.entries(CREDIT_RATE_MAP).map(([key, val]) => (
                  <div key={key} className={`credit-btn ${form.creditScore === key ? "active" : ""}`}
                    onClick={() => {
                      setForm(p => ({ ...p, creditScore: key, interestRate: val.newRate }));
                    }}>
                    <span className="cb-label">{key === "exceptional" ? "800+" : key === "verygood" ? "740-799" : key === "good" ? "670-739" : key === "fair" ? "580-669" : "<580"}</span>
                    <span className="cb-rate">{val.newRate}%</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 10, color: "var(--muted)", fontFamily: "'JetBrains Mono',monospace", marginBottom: 10 }}>
                ↑ Click to auto-fill 2026 avg new car APR
              </div>

              <div className="sec">First Payment Date</div>
              <div className="fp">
                <div className="field">
                  <div className="fl"><label>Month</label></div>
                  <select className="emi-select" value={form.startMonth} onChange={e => setForm(p => ({ ...p, startMonth: e.target.value }))}>
                    {MONTHS.map((m, i) => <option key={i} value={String(i)}>{m}</option>)}
                  </select>
                </div>
                <div className="field">
                  <div className="fl"><label>Year</label></div>
                  <select className="emi-select" value={form.startYear} onChange={e => setForm(p => ({ ...p, startYear: e.target.value }))}>
                    {years.map(y => <option key={y} value={String(y)}>{y}</option>)}
                  </select>
                </div>
              </div>

              <div className="sec">Optional</div>
              <div className="toggle-row">
                <label className="tog">
                  <input type="checkbox" checked={form.includeInsurance}
                    onChange={e => setForm(p => ({ ...p, includeInsurance: e.target.checked }))} />
                  <span className="tog-sl" />
                </label>
                <span className="tog-lbl">Include Monthly Insurance</span>
              </div>
              {form.includeInsurance && (
                <Field label="Monthly Insurance Cost" prefix="$" value={form.monthlyInsurance} onChange={set("monthlyInsurance")} step={10} placeholder="150" />
              )}
            </div>
          </div>

          {/* Results */}
          <div className="results-col">
            {result ? (
              <>
                {/* EMI Hero */}
                <div className="emi-hero">
                  <div className="emi-top">
                    <div className="emi-main">
                      <div className="emi-label">// Monthly EMI Payment</div>
                      <div className="emi-amount">{f$(result.emi, 2)}</div>
                      <div className="emi-sub">
                        for {form.loanTerm} months · payoff: {result.payoffDate}
                      </div>
                    </div>
                    <div className="emi-badges">
                      <div className="emi-badge orange">
                        <div className="eb-label">Total Interest</div>
                        <div className="eb-val">{f$(result.totalInterest)}</div>
                      </div>
                      <div className="emi-badge green">
                        <div className="eb-label">Loan Amount</div>
                        <div className="eb-val">{f$(result.loanAmount)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Gauges */}
                  <div className="gauges-row">
                    <SpeedometerGauge value={result.emi} max={2000} label="Monthly EMI" unit="$" color="var(--blue)" />
                    <SpeedometerGauge value={result.totalInterest} max={result.loanAmount} label="Total Interest" unit="$" color="var(--orange)" />
                    <SpeedometerGauge value={result.interestRatio} max={60} label="Interest Ratio" unit="" color="var(--gold)" />
                  </div>
                </div>

                {/* Stats bar */}
                <div className="stats-bar">
                  <div className="stat blue">
                    <div className="s-lbl">Loan Amount</div>
                    <div className="s-val">{f$(result.loanAmount)}</div>
                  </div>
                  <div className="stat orange">
                    <div className="s-lbl">Total Payment</div>
                    <div className="s-val">{f$(result.totalPayment)}</div>
                  </div>
                  <div className="stat gold">
                    <div className="s-lbl">Interest %</div>
                    <div className="s-val">{fPct(result.interestRatio)}</div>
                  </div>
                  <div className="stat green">
                    <div className="s-lbl">True Total Cost</div>
                    <div className="s-val">{f$(result.totalCost)}</div>
                  </div>
                </div>

                {/* Donut */}
                <div className="donut-card">
                  <div className="donut-title">// COST_BREAKDOWN</div>
                  <DonutChart
                    principal={result.loanAmount}
                    interest={result.totalInterest}
                    fees={result.salesTax + result.dealerFees}
                  />
                </div>

                {/* Rate suggestion */}
                <div className="rate-card">
                  <Lightbulb className="rate-card-icon" />
                  <div className="rate-card-body">
                    <div className="rate-card-title">2026 Rate Context</div>
                    <div className="rate-card-sub">
                      {form.creditScore === "exceptional" ? "Excellent credit — you're getting near the best available new car rates." :
                       form.creditScore === "verygood" ? "Very good credit — 1 point score improvement could save $300–$500 over the loan." :
                       form.creditScore === "good" ? "Consider a credit union — rates often run 0.5%–1.5% lower than big banks." :
                       form.creditScore === "fair" ? "Improving your score 20–30 points before buying could save $2,000–$4,000." :
                       "Work with a specialist lender; improving your score first will dramatically lower your rate."}
                    </div>
                  </div>
                  <div className="rate-chip">{form.interestRate}% APR</div>
                </div>

                {/* Amort toggle */}
                <button className="amort-toggle" onClick={() => setShowAmort(s => !s)}>
                  {showAmort ? "▲ HIDE" : "▼ SHOW"} AMORTIZATION SCHEDULE ({form.loanTerm} PAYMENTS)
                </button>
              </>
            ) : (
              <div style={{ background: "var(--panel)", border: "1px solid var(--rim)", borderRadius: 12, padding: 40, textAlign: "center", color: "var(--muted)", fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>
                // Enter car price to calculate EMI
              </div>
            )}
          </div>
        </div>

        {/* Amortization Table */}
        {showAmort && result && (
          <div style={{ marginBottom: 20 }}>
            <div className="tab-bar" style={{ marginBottom: 12 }}>
              <button className={`tab-btn ${activeTab === "monthly" ? "active" : ""}`} onClick={() => setActiveTab("monthly")}>Monthly</button>
              <button className={`tab-btn ${activeTab === "yearly" ? "active" : ""}`} onClick={() => setActiveTab("yearly")}>Yearly</button>
            </div>
            <div className="tbl-wrap">
              <table className="amort-tbl">
                <thead>
                  <tr>
                    <th>{activeTab === "monthly" ? "Period" : "Year"}</th>
                    <th>EMI</th>
                    <th>Principal</th>
                    <th>Interest</th>
                    <th>Balance</th>
                    <th>Cum. Interest</th>
                  </tr>
                </thead>
                <tbody>
                  {activeTab === "monthly"
                    ? result.schedule.map(r => (
                        <tr key={r.month}>
                          <td>{r.label}</td>
                          <td>{f$(r.emi, 2)}</td>
                          <td className="p-col">{f$(r.principal, 2)}</td>
                          <td className="i-col">{f$(r.interest, 2)}</td>
                          <td className="b-col">{f$(r.balance, 2)}</td>
                          <td>{f$(r.cumulativeInterest, 2)}</td>
                        </tr>
                      ))
                    : yearlySchedule.map(r => (
                        <tr key={r.year}>
                          <td>{r.year}</td>
                          <td>—</td>
                          <td className="p-col">{f$(r.principal)}</td>
                          <td className="i-col">{f$(r.interest)}</td>
                          <td className="b-col">{f$(r.balance)}</td>
                          <td>{f$(result.schedule.find(s => s.label.includes(r.year))?.cumulativeInterest || 0)}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Content Sections */}
        <section className="prose">
          <h2>What Is a Car Loan <em>EMI</em>?</h2>
          <p>
            EMI — <strong>Equated Monthly Installment</strong> — is the fixed monthly payment you make to repay your car loan over the agreed term. Unlike a revolving credit line where payments fluctuate, an EMI is fixed for the life of the loan: same dollar amount, every month, until the balance reaches zero. What changes month by month is how that payment is <em>split</em> between principal repayment and interest charges.
          </p>
          <p>
            In the early months of an amortizing car loan, a larger share of your EMI goes to interest — because you have a high outstanding balance, and interest is charged as a percentage of that balance. As you pay down the loan, the balance shrinks, the interest portion of each EMI decreases, and more of your payment goes to principal. By the final month, almost your entire last payment is principal.
          </p>
          <div className="callout">
            <Lightbulb className="callout-icon" />
            <span>
              On a <strong>$30,000 car loan at 7% APR for 60 months</strong>: Month 1 EMI = $594 → $175 interest, $419 principal. Month 60 EMI = $594 → $3 interest, $591 principal. The EMI never changes; only the split does.
            </span>
          </div>

          <h3>The Car Loan EMI Formula</h3>
          <p>The car loan EMI is calculated using the standard loan amortization formula:</p>
          <div className="formula-block">
            <span className="key">EMI</span> = P × r × (1 + r)^n ÷ [(1 + r)^n − 1]<br/><br/>
            <span className="key">Where:</span><br/>
            P = Loan Principal (car price − down payment − trade-in + tax + fees)<br/>
            r = Monthly Interest Rate (Annual APR ÷ 12 ÷ 100)<br/>
            n = Total Number of Monthly Payments (loan term in months)<br/><br/>
            <span className="key">Example:</span> $25,000 @ 7% for 60 months<br/>
            r = 7 ÷ 12 ÷ 100 = 0.005833<br/>
            EMI = 25000 × 0.005833 × (1.005833)^60 ÷ [(1.005833)^60 − 1] = <span className="key">$495.03</span>
          </div>
        </section>

        <section className="prose">
          <h2>2026 Car Loan <em>Interest Rates</em> by Credit Score</h2>
          <p>
            Car loan interest rates in 2026 are heavily influenced by your credit score, with the best borrowers paying dramatically less than those with poor credit. Here are current average new car APRs across lenders:
          </p>
          <table className="dt">
            <thead>
              <tr><th>Credit Score</th><th>Rating</th><th>New Car APR (2026)</th><th>Used Car APR (2026)</th><th>$30K/60mo Interest Cost</th></tr>
            </thead>
            <tbody>
              <tr><td>800–850</td><td>Exceptional</td><td>5.2%</td><td>6.8%</td><td>~$4,140</td></tr>
              <tr><td>740–799</td><td>Very Good</td><td>6.1%</td><td>8.2%</td><td>~$4,880</td></tr>
              <tr><td>670–739</td><td>Good</td><td>7.4%</td><td>10.5%</td><td>~$5,980</td></tr>
              <tr><td>580–669</td><td>Fair</td><td>10.8%</td><td>14.9%</td><td>~$8,780</td></tr>
              <tr><td>300–579</td><td>Poor</td><td>15.2%</td><td>20.4%</td><td>~$12,550</td></tr>
            </tbody>
          </table>
          <p>
            The difference between exceptional and poor credit on the same loan is over <strong>$8,400 in interest</strong>. Even moving from "good" to "very good" credit saves roughly $1,100 over five years. If you're close to a threshold, spending a few months improving your score before buying a car can be one of the highest-return financial moves available.
          </p>

          <h3>How to Get the Best Car Loan Rate in 2026</h3>
          <ul>
            <li><strong>Get pre-approved before visiting the dealership.</strong> Banks and credit unions often offer lower rates than dealer financing, and pre-approval gives you negotiating leverage.</li>
            <li><strong>Shop multiple lenders.</strong> Rate-shop within a 14-day window — multiple credit inquiries for the same loan type count as one inquiry on your FICO score.</li>
            <li><strong>Negotiate the car price separately from financing.</strong> Dealers profit from financing too; mixing them lets one subsidize the other and obscures the true cost.</li>
            <li><strong>Consider a shorter term.</strong> Lenders often offer lower rates for 36- or 48-month loans than 72- or 84-month loans, reflecting lower default risk.</li>
            <li><strong>Put more down.</strong> A larger down payment reduces your LTV (loan-to-value ratio), which some lenders reward with better rates.</li>
          </ul>
        </section>

        <section className="prose">
          <h2>Loan Term: How <em>Length Affects</em> Your EMI and Cost</h2>
          <p>
            One of the most important — and most misunderstood — car financing decisions is loan term length. Dealers often steer buyers toward longer terms to make expensive cars seem affordable. Here's what the math actually shows on a $30,000 loan at 7% APR:
          </p>
          <table className="dt">
            <thead>
              <tr><th>Term</th><th>Monthly EMI</th><th>Total Interest</th><th>Total Cost</th><th>Interest %</th></tr>
            </thead>
            <tbody>
              <tr><td>36 months</td><td>$926</td><td>$3,367</td><td>$33,367</td><td>11.2%</td></tr>
              <tr><td>48 months</td><td>$718</td><td>$4,481</td><td>$34,481</td><td>14.9%</td></tr>
              <tr><td>60 months</td><td>$594</td><td>$5,641</td><td>$35,641</td><td>18.8%</td></tr>
              <tr><td>72 months</td><td>$513</td><td>$6,896</td><td>$36,896</td><td>23.0%</td></tr>
              <tr><td>84 months</td><td>$455</td><td>$8,207</td><td>$38,207</td><td>27.4%</td></tr>
            </tbody>
          </table>
          <div className="callout warn">
            <AlertTriangle className="callout-icon" />
            <span>
              The 84-month loan saves only $471/month vs. the 36-month loan — but costs an extra $4,840 in interest. Additionally, new cars depreciate roughly 20% in their first year and 15% in year two. On a 7-year loan, you could owe more than the car is worth for the first 3–4 years — a condition called being "upside-down" or "underwater" on your loan.
            </span>
          </div>
        </section>

        <section className="prose">
          <h2>How to Use This <em>EMI Calculator</em></h2>
          <div className="steps">
            {[
              { t: "Enter Vehicle Price", p: "Use the out-the-door (OTD) price if you have it, or the sticker price if still negotiating. The calculator adds sales tax and dealer fees separately so you can see the full picture." },
              { t: "Set Down Payment and Trade-In", p: "Both reduce your loan principal. Enter your cash down payment separately from trade-in value — dealers sometimes blend these to obscure negotiation." },
              { t: "Add Sales Tax and Dealer Fees", p: "Sales tax is typically 2%–10% depending on your state and is rolled into the loan amount unless you pay it upfront. Dealer doc fees vary from $100–$800." },
              { t: "Select Credit Score for Auto-Fill Rate", p: "Click your credit score tier to auto-fill the 2026 average APR. Then manually adjust if you have a specific rate quote from a lender." },
              { t: "Choose Loan Term", p: "Start with 60 months as a baseline. Then switch to 48 or 36 months to see how much interest you save — often the EMI difference is smaller than you expect." },
              { t: "Review Amortization Schedule", p: "Click 'Show Amortization Schedule' to see every payment's principal/interest split. Switch to Yearly view to quickly see your balance at the end of each year." },
            ].map((s, i) => (
              <div className="step" key={i}><div className="step-n" /><div className="step-body"><h4>{s.t}</h4><p>{s.p}</p></div></div>
            ))}
          </div>
        </section>

        <section className="prose">
          <h2>Who Is This <em>Calculator</em> For?</h2>
          <div className="ucg">
            {useCases.map((uc, i) => (
              <div className="uc" key={i}>
                <div className="uc-icon">{uc.icon}</div>
                <h4>{uc.title}</h4>
                <p>{uc.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="prose">
          <h2>Frequently Asked <em>Questions</em></h2>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <div className="faq-item" key={i}>
                <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                  {f.q}
                  <ChevronDown className={`faq-chev ${openFaq === i ? "open" : ""}`} />
                </button>
                <div className={`faq-a ${openFaq === i ? "open" : ""}`}>{f.a}</div>
              </div>
            ))}
          </div>
        </section>

        <footer className="footer">
          // This calculator is for educational purposes only and does not constitute financial or loan advice.<br />
          // APR estimates reflect 2026 U.S. market averages and vary by lender, region, and loan specifics.<br />
          // Always get a formal loan estimate from a licensed lender before making financial commitments.
        </footer>
      </div>
    </div>
  );
}
