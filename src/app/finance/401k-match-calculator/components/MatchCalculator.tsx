"use client";

import { useState, useCallback } from "react";
import { 
  Briefcase, 
  TrendingUp, 
  Umbrella, 
  Heart, 
  GraduationCap, 
  Calculator, 
  Lightbulb, 
  AlertTriangle,
  CheckCircle2,
  ChevronDown
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface FormState {
  salary: string;
  contribution: string;
  matchRate: string;
  matchCap: string;
  vestingYears: string;
  currentAge: string;
  retirementAge: string;
  annualReturn: string;
}

interface Results {
  yourAnnualContrib: number;
  employerAnnualMatch: number;
  totalAnnualSavings: number;
  unvestedWarning: boolean;
  projectedBalance: number;
  freeMoney: number;
  effectiveRate: number;
  monthlyContrib: number;
  monthlyMatch: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmt(n: number, decimals = 0) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
function fmtDollar(n: number) {
  return "$" + fmt(Math.round(n));
}
function fmtPct(n: number) {
  return fmt(n, 2) + "%";
}

function calculate(f: FormState): Results | null {
  const salary = parseFloat(f.salary.replace(/,/g, ""));
  const contribPct = parseFloat(f.contribution);
  const matchRate = parseFloat(f.matchRate) / 100;
  const matchCap = parseFloat(f.matchCap);
  const vestingYears = parseInt(f.vestingYears);
  const currentAge = parseInt(f.currentAge);
  const retirementAge = parseInt(f.retirementAge);
  const annualReturn = parseFloat(f.annualReturn) / 100;

  if (
    isNaN(salary) || isNaN(contribPct) || isNaN(matchRate) ||
    isNaN(matchCap) || isNaN(vestingYears) || isNaN(currentAge) ||
    isNaN(retirementAge) || isNaN(annualReturn) ||
    salary <= 0 || contribPct < 0 || contribPct > 100 ||
    matchRate < 0 || matchCap < 0 || currentAge >= retirementAge
  ) return null;

  const IRS_BASE_LIMIT = 23000;
  const IRS_CATCH_UP = 7500;
  const limit = currentAge >= 50 ? IRS_BASE_LIMIT + IRS_CATCH_UP : IRS_BASE_LIMIT;

  const yourAnnualContrib = Math.min((contribPct / 100) * salary, limit);
  const eligibleContrib = Math.min(contribPct, matchCap);
  const employerAnnualMatch = (eligibleContrib / 100) * salary * matchRate;
  const totalAnnualSavings = yourAnnualContrib + employerAnnualMatch;
  const years = retirementAge - currentAge;
  const monthlyRate = annualReturn / 12;
  const months = years * 12;
  const monthlyTotal = totalAnnualSavings / 12;

  let projectedBalance = 0;
  if (annualReturn === 0) {
    projectedBalance = totalAnnualSavings * years;
  } else {
    projectedBalance =
      monthlyTotal * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  }

  const freeMoney = employerAnnualMatch * years;
  const effectiveRate = salary > 0 ? (totalAnnualSavings / salary) * 100 : 0;

  return {
    yourAnnualContrib,
    employerAnnualMatch,
    totalAnnualSavings,
    unvestedWarning: vestingYears > 0,
    projectedBalance,
    freeMoney,
    effectiveRate,
    monthlyContrib: yourAnnualContrib / 12,
    monthlyMatch: employerAnnualMatch / 12,
  };
}

// ─── Input Component ──────────────────────────────────────────────────────────
function Field({
  label, hint, icon: Icon, prefix, suffix, name, value, onChange, min, max, step, placeholder,
}: {
  label: string; hint?: string; icon?: any; prefix?: string; suffix?: string;
  name: string; value: string; onChange: (n: string, v: string) => void;
  min?: number; max?: number; step?: number; placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-primary/60" />}
        <label className="text-sm font-semibold text-foreground/80">{label}</label>
      </div>
      {hint && <p className="text-[11px] text-muted-foreground leading-tight">{hint}</p>}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          {prefix ? (
            <span className="text-sm font-bold text-muted-foreground group-focus-within:text-primary transition-colors">{prefix}</span>
          ) : null}
        </div>
        <input
          type="number"
          name={name}
          value={value}
          min={min}
          max={max}
          step={step ?? 1}
          placeholder={placeholder}
          onChange={(e) => onChange(name, e.target.value)}
          className={`
            w-full bg-background border border-border/60 rounded-2xl py-3.5 
            ${prefix ? 'pl-8' : 'pl-4'} ${suffix ? 'pr-12' : 'pr-4'}
            text-sm font-medium text-foreground shadow-sm 
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary 
            transition-all placeholder:text-muted-foreground/50
          `}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          {suffix ? (
            <span className="text-sm font-bold text-muted-foreground group-focus-within:text-primary transition-colors">{suffix}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ─── FAQ Data ─────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "What does 401(k) employer match mean?",
    a: "An employer match is free money your company contributes to your 401(k) based on how much you contribute. For example, a 100% match up to 5% of salary means if you earn $80,000 and contribute 5% ($4,000), your employer adds another $4,000 — doubling your retirement savings at no extra cost to you.",
  },
  {
    q: "How is the 401(k) employer match calculated?",
    a: "The formula is: Employer Match = (Your Contribution % up to Cap) × Match Rate × Salary. Example: $70,000 salary, 50% match on up to 6% of pay = 6% × 50% × $70,000 = $2,100/year employer match.",
  },
  {
    q: "What is the 401(k) contribution limit for 2024?",
    a: "The IRS limit for employee 401(k) contributions in 2024 is $23,000. Workers aged 50+ can add a $7,500 catch-up contribution, bringing their total to $30,500. Our calculator automatically caps your employee contribution at the $23,000 limit.",
  },
  {
    q: "What does vesting mean in a 401(k)?",
    a: "Vesting refers to how long you must work at a company before the employer match is truly 'yours.' Many employers use cliff vesting (you own 0% until year 3, then 100%) or graded vesting (20% per year for 5 years). If you leave before full vesting, you forfeit unvested employer contributions.",
  },
  {
    q: "Should I contribute enough to get the full employer match?",
    a: "Almost always yes — it's an instant 50%–100% return on your contribution, which no investment can reliably beat. Financial advisors universally recommend contributing at least enough to capture the full match before directing money elsewhere.",
  },
  {
    q: "What if my employer doesn't match 401(k) contributions?",
    a: "A 401(k) still offers valuable pre-tax (traditional) or after-tax (Roth) growth. Consider maxing out an IRA ($7,000 limit in 2024) first if there's no employer match, as IRAs sometimes offer more investment flexibility.",
  },
  {
    q: "How does the 2024 IRS 401(k) limit affect my match?",
    a: "The $23,000 employee limit only caps what you put in — your employer's match is separate and not counted against that limit. The combined employee + employer limit is $69,000 in 2024.",
  },
  {
    q: "Can I lose my employer 401(k) match?",
    a: "Yes — through vesting schedules. If you leave your job before meeting the vesting requirements, you forfeit unvested employer contributions. Always check your plan's vesting schedule before making career moves.",
  },
];

// ─── Use Cases ────────────────────────────────────────────────────────────────
const useCases = [
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: "New Employee Evaluating a Job Offer",
    desc: "Compare two job offers side-by-side. A $5,000 salary difference can be erased if one employer offers a 6% full match and the other offers nothing. Use this calculator to quantify the real compensation difference.",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Deciding How Much to Contribute",
    desc: "See exactly what contribution percentage captures your employer's full match. Contributing even 1% less than the match cap leaves guaranteed money on the table — this tool shows you the exact dollar cost of under-contributing.",
  },
  {
    icon: <Umbrella className="w-6 h-6" />,
    title: "Planning Early Retirement (FIRE)",
    desc: "Modeling financial independence? Adjust the retirement age slider to see how your projected balance changes if you retire at 50 vs. 65. Compound growth differences are often staggering.",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Newlyweds Combining Finances",
    desc: "Run both partners' numbers separately. Maximizing both employer matches before other investing goals is a high-ROI strategy that many couples overlook.",
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    title: "Recent Graduates Starting Their Career",
    desc: "Even contributing $200/month in your mid-20s, when matched by an employer, can grow to several hundred thousand dollars by retirement. This calculator makes the case for starting early viscerally clear.",
  },
];

// ─── Main Component ────────────────────────────────────────────────────────────
export default function MatchCalculator() {
  const [form, setForm] = useState<FormState>({
    salary: "75000",
    contribution: "6",
    matchRate: "100",
    matchCap: "6",
    vestingYears: "3",
    currentAge: "30",
    retirementAge: "65",
    annualReturn: "7",
  });

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const results = calculate(form);

  const handleChange = useCallback((name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  return (
    <div className="calculator-container">
      <style jsx>{`
        .calculator-container {
          --primary: #c8972a;
          --primary-soft: #f5e4b5;
          --success: #6edba6;
          --warning: #f5a0a0;
        }

        /* Results Panel Specifics */
        .result-hero {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 32px;
          text-align: center;
          margin-bottom: 24px;
        }
        .result-hero .label {
          font-size: 11px;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 8px;
          font-weight: 800;
        }
        .result-hero .big {
          font-family: 'Fraunces', serif;
          font-size: 3rem;
          font-weight: 800;
          color: #fff;
          line-height: 1;
        }
        .result-hero .sub {
          font-size: 12px;
          color: rgba(255,255,255,0.3);
          margin-top: 8px;
        }

        .result-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 24px;
        }
        .result-cell {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 20px;
          padding: 16px;
          transition: all 0.2s;
        }
        .result-cell:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.1);
        }
        .result-cell .label {
          font-size: 10px;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 4px;
          font-weight: 700;
        }
        .result-cell .val {
          font-size: 1.15rem;
          font-weight: 700;
          color: #fff;
        }
        .result-cell.accent { border-color: rgba(200,151,42,0.2); background: rgba(200,151,42,0.05); }
        .result-cell.accent .val { color: var(--primary-soft); }
        .result-cell.success-cell { border-color: rgba(110,219,166,0.2); background: rgba(110,219,166,0.05); }
        .result-cell.success-cell .val { color: var(--success); }

        .vesting-warn {
          background: rgba(184,50,50,0.1);
          border: 1px solid rgba(184,50,50,0.2);
          border-radius: 16px;
          padding: 16px;
          font-size: 12px;
          color: var(--warning);
          line-height: 1.6;
          display: flex;
          gap: 12px;
        }

        /* Bar Chart */
        .bar-wrap { margin-bottom: 20px; }
        .bar-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: rgba(255,255,255,0.4);
          margin-bottom: 6px;
          font-weight: 600;
        }
        .bar-track {
          height: 6px;
          background: rgba(255,255,255,0.05);
          border-radius: 100px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          border-radius: 100px;
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .bar-you { background: var(--primary); }
        .bar-employer { background: var(--success); }

        /* Prose Content Styling */
        .prose-section { margin-bottom: 64px; }
        .prose-section :global(h2) {
          font-family: 'Fraunces', serif;
          font-size: 2rem;
          font-weight: 900;
          margin-bottom: 20px;
          color: #0f1117;
          letter-spacing: -0.02em;
        }
        .prose-section :global(h3) {
          font-family: 'Fraunces', serif;
          font-size: 1.25rem;
          font-weight: 800;
          margin: 32px 0 12px;
          color: #0f1117;
        }
        .prose-section :global(p) {
          color: #4b5563;
          margin-bottom: 20px;
          line-height: 1.75;
          font-size: 1.05rem;
        }

        .formula-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-left: 4px solid var(--primary);
          border-radius: 16px;
          padding: 24px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 14px;
          margin: 24px 0;
          color: #1e293b;
          line-height: 1.8;
        }

        .callout {
          background: #f0fdf4;
          border: 1px solid #dcfce7;
          border-radius: 20px;
          padding: 20px 24px;
          margin: 24px 0;
          font-size: 1rem;
          color: #166534;
          font-weight: 500;
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        /* Step List */
        .steps { counter-reset: step; display: flex; flex-direction: column; gap: 12px; }
        .step {
          display: flex;
          gap: 20px;
          background: #fff;
          border: 1px solid #f1f5f9;
          border-radius: 20px;
          padding: 24px;
          transition: all 0.2s;
        }
        .step:hover { border-color: #e2e8f0; transform: translateX(4px); }
        .step-num {
          counter-increment: step;
          width: 36px; height: 36px;
          border-radius: 12px;
          background: var(--primary);
          color: #fff;
          font-weight: 800;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(200, 151, 42, 0.2);
        }
        .step-num::before { content: counter(step); }
        .step-body h4 { font-weight: 800; margin-bottom: 4px; font-size: 1.05rem; color: #0f1117; }
        .step-body p { font-size: 0.95rem; color: #64748b; margin: 0; line-height: 1.6; }

        /* Use Case Cards */
        .use-case-card {
          background: #fff;
          border: 1px solid #f1f5f9;
          border-radius: 24px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .use-case-card:hover { 
          transform: translateY(-8px); 
          border-color: rgba(200, 151, 42, 0.1); 
          shadow: 0 20px 40px rgba(0,0,0,0.05);
        }
        .use-case-card :global(.uc-icon) { 
          margin-bottom: 20px; 
          color: var(--primary);
          background: rgba(200, 151, 42, 0.05);
          padding: 16px;
          border-radius: 20px;
        }
        .use-case-card h4 {
          font-family: 'Fraunces', serif;
          font-size: 1.1rem;
          font-weight: 800;
          margin-bottom: 12px;
          color: #0f1117;
        }
        .use-case-card p { font-size: 0.9rem; color: #64748b; margin: 0; line-height: 1.7; }

        /* FAQ Styling */
        .faq-item {
          background: #fff;
          border: 1px solid #f1f5f9;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        .faq-q {
          width: 100%;
          text-align: left;
          padding: 20px 24px;
          font-size: 1rem;
          font-weight: 700;
          color: #0f1117;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          transition: background 0.2s;
        }
        .faq-q:hover { background: #f8fafc; }
        .faq-a {
          padding: 0 24px;
          max-height: 0;
          overflow: hidden;
          transition: all 0.3s ease;
          font-size: 0.95rem;
          color: #4b5563;
          line-height: 1.8;
        }
        .faq-a.open { max-height: 500px; padding: 0 24px 24px; }

        .match-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          font-size: 14px;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #f1f5f9;
          margin: 32px 0;
        }
        .match-table th {
          background: #0f1117;
          color: var(--primary-soft);
          padding: 16px 20px;
          text-align: left;
          font-weight: 800;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .match-table td {
          padding: 16px 20px;
          border-bottom: 1px solid #f1f5f9;
          color: #4b5563;
          font-weight: 500;
        }
        .match-table tr:last-child td { border-bottom: none; }
        .match-table tr:nth-child(even) td { background: #f8fafc; }
      `}</style>

      <div className="glass-card overflow-hidden border border-border/80 shadow-2xl rounded-[2.5rem] mb-16">
        <div className="grid lg:grid-cols-[1fr_420px] gap-0">
          {/* Inputs */}
          <div className="p-8 sm:p-12 space-y-10">
            <div>
              <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
                <span className="w-2 h-8 bg-primary rounded-full" />
                Calculation Parameters
              </h2>
              <p className="mt-2 text-muted-foreground text-sm">Adjust your details below to see your 401(k) growth projection.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="text-[10px] font-black text-primary tracking-widest uppercase">Income & Savings</div>
                <Field label="Annual Salary" icon={Briefcase} prefix="$" name="salary" value={form.salary} onChange={handleChange} min={0} step={1000} placeholder="75000" />
                <Field label="Your Contribution" icon={Heart} suffix="%" name="contribution" value={form.contribution} onChange={handleChange} min={0} max={100} step={0.5} placeholder="6" />
              </div>
              
              <div className="space-y-6">
                <div className="text-[10px] font-black text-primary tracking-widest uppercase">Match Rules</div>
                <Field label="Employer Match Rate" icon={TrendingUp} suffix="%" name="matchRate" value={form.matchRate} onChange={handleChange} min={0} max={300} step={25} placeholder="100" />
                <Field label="Match Cap" icon={Umbrella} suffix="%" name="matchCap" value={form.matchCap} onChange={handleChange} min={0} max={100} step={0.5} placeholder="6" />
                <Field label="Vesting Period" icon={GraduationCap} suffix="yrs" name="vestingYears" value={form.vestingYears} onChange={handleChange} min={0} max={6} step={1} placeholder="3" />
              </div>
            </div>

            <div className="pt-8 border-t border-border/40">
              <div className="text-[10px] font-black text-primary tracking-widest uppercase mb-6">Market & Timeline</div>
              <div className="grid sm:grid-cols-3 gap-6">
                <Field label="Current Age" name="currentAge" value={form.currentAge} onChange={handleChange} min={16} max={80} />
                <Field label="Retire Age" name="retirementAge" value={form.retirementAge} onChange={handleChange} min={17} max={90} />
                <Field label="Return Rate" suffix="%" name="annualReturn" value={form.annualReturn} onChange={handleChange} min={0} max={20} step={0.5} />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-slate-950 p-8 sm:p-12 text-white flex flex-col">
            <h2 className="text-xl font-bold text-primary-soft mb-8 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Projected Outcome
            </h2>
            {results ? (
              <>
                <div className="result-hero">
                  <div className="label">Projected Retirement Balance</div>
                  <div className="big">{fmtDollar(results.projectedBalance)}</div>
                  <div className="sub">in {parseInt(form.retirementAge) - parseInt(form.currentAge)} years at {form.annualReturn}% avg return</div>
                </div>

                <div className="result-grid">
                  <div className="result-cell">
                    <div className="label">Your Annual Contrib</div>
                    <div className="val">{fmtDollar(results.yourAnnualContrib)}</div>
                  </div>
                  <div className="result-cell accent">
                    <div className="label">Employer Match / yr</div>
                    <div className="val">{fmtDollar(results.employerAnnualMatch)}</div>
                  </div>
                  <div className="result-cell">
                    <div className="label">Monthly You Save</div>
                    <div className="val">{fmtDollar(results.monthlyContrib)}</div>
                  </div>
                  <div className="result-cell accent">
                    <div className="label">Monthly Match</div>
                    <div className="val">{fmtDollar(results.monthlyMatch)}</div>
                  </div>
                  <div className="result-cell success-cell">
                    <div className="label">Total "Free Money"</div>
                    <div className="val">{fmtDollar(results.freeMoney)}</div>
                  </div>
                  <div className="result-cell">
                    <div className="label">Effective Savings Rate</div>
                    <div className="val">{fmtPct(results.effectiveRate)}</div>
                  </div>
                </div>

                {/* Visual bar */}
                <div className="bar-wrap">
                  <div className="bar-label-row">
                    <span>Your contributions</span>
                    <span>{fmtDollar(results.yourAnnualContrib)}/yr</span>
                  </div>
                  <div className="bar-track">
                    <div
                      className="bar-fill bar-you"
                      style={{ width: `${Math.min(100, (results.yourAnnualContrib / (parseInt(form.currentAge) >= 50 ? 30500 : 23000)) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="bar-wrap">
                  <div className="bar-label-row">
                    <span>Employer match</span>
                    <span>{fmtDollar(results.employerAnnualMatch)}/yr</span>
                  </div>
                  <div className="bar-track">
                    <div
                      className="bar-fill bar-employer"
                      style={{ width: `${Math.min(100, (results.employerAnnualMatch / (parseInt(form.currentAge) >= 50 ? 30500 : 23000)) * 100)}%` }}
                    />
                  </div>
                </div>

                {results.unvestedWarning && (
                  <div className="vesting-warn">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Your employer uses a {form.vestingYears}-year vesting schedule. Employer match contributions may be forfeited if you leave before vesting is complete.</span>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <Calculator className="w-12 h-12" />
                <p>Enter valid inputs to see your personalized results.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── What Is a 401k Match ─── */}
      <section className="prose-section" aria-labelledby="what-is">
        <h2 id="what-is">What Is a 401(k) Employer Match — and Why Does It Matter?</h2>
        <p>
          A <strong>401(k) employer match</strong> is one of the most valuable benefits your employer can offer. When you contribute a portion of your salary to your 401(k) retirement account, your employer agrees to match that contribution up to a certain percentage of your salary. In plain terms: it&apos;s free money added to your retirement savings.
        </p>
        <p>
          Here&apos;s why it&apos;s extraordinary: no other investment vehicle guarantees an immediate 50%–100% return on your money the moment it hits your account. A traditional savings account might earn 5% in a strong rate environment. The stock market historically returns around 7–10% annually. But an employer match that&apos;s 100% of your contributions delivers a 100% instant return before a single dollar of investment growth occurs. Financial advisors often call it the <strong>"single best investment most Americans can make."</strong>
        </p>
        <p>
          Despite this, millions of employees leave employer match money on the table every year — either by not contributing enough to capture the full match, or by not understanding how their specific plan works. This calculator is designed to give you total clarity.
        </p>

        <div className="callout">
          <Lightbulb className="icon w-6 h-6" />
          <span>Employees who don&apos;t contribute enough to capture their full employer match are effectively giving themselves a pay cut. If your match cap is 5% of salary and you only contribute 3%, you&apos;re leaving 2% of free compensation unclaimed every single year.</span>
        </div>
      </section>

      {/* ─── How It's Calculated ─── */}
      <section className="prose-section" aria-labelledby="formula">
        <h2 id="formula">How the 401(k) Match Is Calculated</h2>
        <p>
          Every employer structures their match differently, which makes it confusing to compare plans. The most common structure you&apos;ll see is expressed as: <em>"We match X% of your contributions, up to Y% of your salary."</em>
        </p>

        <div className="formula-box">
          <strong>Employer Annual Match</strong> =<br />
          &nbsp;&nbsp;(Your Contribution % capped at Match Cap %) × Match Rate % × Annual Salary<br /><br />
          <strong>Example:</strong><br />
          Salary: $80,000 | Contribution: 8% | Match: 50% up to 6% of pay<br />
          → Eligible: min(8%, 6%) = 6% → 6% × 50% × $80,000 = <strong>$2,400/year</strong>
        </div>

        <h3>Common 401(k) Match Structures Explained</h3>
        <p>Employers use several different formulas. Here are the most common ones you&apos;ll encounter:</p>

        <table className="match-table">
          <thead>
            <tr>
              <th>Match Structure</th>
              <th>Example ($80k salary, 6% contrib)</th>
              <th>Annual Match</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>100% match up to 3% of salary</td>
              <td>3% × 100% × $80,000</td>
              <td>$2,400</td>
            </tr>
            <tr>
              <td>50% match up to 6% of salary</td>
              <td>6% × 50% × $80,000</td>
              <td>$2,400</td>
            </tr>
            <tr>
              <td>100% match up to 6% of salary</td>
              <td>6% × 100% × $80,000</td>
              <td>$4,800</td>
            </tr>
            <tr>
              <td>Dollar-for-dollar up to $3,000</td>
              <td>Flat cap regardless of %</td>
              <td>$3,000</td>
            </tr>
            <tr>
              <td>25% match up to 10% of salary</td>
              <td>10% × 25% × $80,000</td>
              <td>$2,000</td>
            </tr>
          </tbody>
        </table>

        <p style={{ marginTop: 16 }}>
          Notice that the first two examples produce the same $2,400 annual match despite having different stated rates. This is why comparing plans purely by the match rate percentage is misleading — always look at both the rate and the cap together.
        </p>

        <h3>The 2024 IRS 401(k) Contribution Limits</h3>
        <p>
          The IRS sets annual limits on how much employees can contribute to a 401(k). For <strong>2024</strong>, the employee contribution limit is <strong>$23,000</strong>. Workers aged 50 and over can contribute an additional <strong>$7,500</strong> in "catch-up contributions," bringing their total to $30,500.
        </p>
        <p>
          Importantly, the employer match does <em>not</em> count toward the employee limit. The <strong>combined</strong> limit (employee + employer) is $69,000 in 2024, or $76,500 for those 50+. Our calculator automatically caps your employee contribution at $23,000 to reflect this IRS rule.
        </p>
      </section>

      {/* ─── How to Use ─── */}
      <section className="prose-section" aria-labelledby="how-to-use">
        <h2 id="how-to-use">How to Use This 401(k) Match Calculator</h2>
        <p>
          Getting your results takes about 60 seconds. Here&apos;s exactly what each input means and where to find the information:
        </p>
        <div className="steps">
          <div className="step">
            <div className="step-num" />
            <div className="step-body">
              <h4>Enter Your Annual Salary</h4>
              <p>Use your gross salary (before taxes). Check your offer letter, W-2, or payroll portal. This is the base for calculating match eligibility.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-num" />
            <div className="step-body">
              <h4>Set Your Contribution Rate</h4>
              <p>Enter the percentage of your salary you want to defer to your 401(k). If you&apos;re not sure what to enter, try your employer&apos;s match cap first — that&apos;s the minimum to capture all free money.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-num" />
            <div className="step-body">
              <h4>Enter Your Employer&apos;s Match Rate</h4>
              <p>Find this in your benefits summary, onboarding packet, or HR portal. It will say something like &quot;50% match&quot; or &quot;dollar-for-dollar match.&quot; Enter 50 for 50% or 100 for dollar-for-dollar.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-num" />
            <div className="step-body">
              <h4>Enter the Match Cap (% of Salary)</h4>
              <p>This is the upper limit your employer will match on. If your plan says &quot;up to 6% of pay,&quot; enter 6. You won&apos;t receive additional match by contributing more than this percentage.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-num" />
            <div className="step-body">
              <h4>Specify Your Vesting Period</h4>
              <p>Check your plan documents for the vesting schedule. If employer contributions are yours immediately, enter 0. If there&apos;s a 3-year cliff, enter 3. This affects how much you risk losing if you leave early.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-num" />
            <div className="step-body">
              <h4>Set Your Ages and Expected Return</h4>
              <p>Enter your current age and planned retirement age. The expected annual return defaults to 7%, which approximates the long-run S&P 500 return adjusted for inflation. Adjust conservatively to 5–6% for a more cautious projection.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Vesting ─── */}
      <section className="prose-section" aria-labelledby="vesting">
        <h2 id="vesting">Understanding 401(k) Vesting Schedules</h2>
        <p>
          <strong>Vesting</strong> determines when employer contributions permanently belong to you. Even if your employer deposits match money into your account, you may not own it yet if you haven&apos;t met the vesting schedule.
        </p>

        <h3>Types of Vesting Schedules</h3>
        <p><strong>Immediate vesting:</strong> 100% of employer contributions are yours from day one. Common at companies competing hard for talent.</p>
        <p><strong>Cliff vesting:</strong> You own 0% of the match until a specific date (typically 3 years), then you instantly own 100%. The most common structure. If you leave at year 2, you forfeit all employer contributions.</p>
        <p><strong>Graded vesting:</strong> Ownership percentage increases incrementally over time (e.g., 20%/year over 5 years). If you leave at year 3 with graded vesting, you keep 60% of accumulated employer contributions.</p>

        <div className="callout">
          <AlertTriangle className="icon w-6 h-6" />
          <span>Always check vesting before resigning. Leaving two months before your 3-year cliff could cost you tens of thousands of dollars in forfeited employer contributions. Some employers also have plan loan repayment clauses tied to vesting.</span>
        </div>

        <h3>Vesting and Job Hoppers</h3>
        <p>
          If you change jobs frequently, cliff vesting schedules can effectively eliminate your employer match benefit. Factor vesting terms heavily into job offers and resignation timing. If you&apos;re close to a vesting date, it&apos;s often worth waiting it out before leaving.
        </p>
      </section>

      {/* ─── Use Cases ─── */}
      <section className="prose-section" aria-labelledby="use-cases">
        <h2 id="use-cases">Who Should Use This Calculator</h2>
        <p>This tool is designed for anyone making decisions where their 401(k) match matters:</p>
        <div className="use-cases">
          {useCases.map((uc, i) => (
            <div className="use-case-card" key={i}>
              <div className="uc-icon">{uc.icon}</div>
              <h4>{uc.title}</h4>
              <p>{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="prose-section" aria-labelledby="faq">
        <h2 id="faq">Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div className="faq-item" key={i}>
              <button
                className="faq-q"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
              >
                {faq.q}
                <ChevronDown className={`faq-chevron w-5 h-5 ${openFaq === i ? "open" : ""}`} />
              </button>
              <div className={`faq-a ${openFaq === i ? "open" : ""}`}>{faq.a}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
