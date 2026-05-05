"use client";

import { useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  ChevronDown,
  ChevronUp,
  Compass,
  Home,
  Landmark,
  PiggyBank,
  Scale,
  Sunrise,
  TrendingUp,
  UserRound,
} from "lucide-react";

const ROTH_LIMIT_2026 = 7_500;
const ROTH_CATCHUP_2026 = 8_600;
const PHASE_OUT_SINGLE_LOW = 153_000;
const PHASE_OUT_SINGLE_HIGH = 168_000;
const PHASE_OUT_MFJ_LOW = 242_000;
const PHASE_OUT_MFJ_HIGH = 252_000;
const PHASE_OUT_MFS_HIGH = 10_000;

interface FormState {
  currentAge: string;
  retirementAge: string;
  currentBalance: string;
  annualContribution: string;
  annualIncome: string;
  filingStatus: "single" | "mfj" | "mfs";
  annualReturn: string;
  taxRateNow: string;
  taxRateRetirement: string;
  inflationRate: string;
  catchupEnabled: boolean;
}

interface YearRow {
  age: number;
  year: number;
  contribution: number;
  growth: number;
  balance: number;
  totalContributed: number;
  totalGrowth: number;
}

interface RothResult {
  finalBalance: number;
  finalBalanceReal: number;
  totalContributed: number;
  totalGrowth: number;
  yearsInvesting: number;
  schedule: YearRow[];
  traditionalBalance: number;
  traditionalAfterTax: number;
  rothAdvantage: number;
  maxContribution: number;
  phaseOutPct: number;
  isEligible: boolean;
  reducedLimit: number;
  monthlyContribution: number;
}

function money(value: number, digits = 0) {
  return `${value < 0 ? "-$" : "$"}${Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`;
}

function percent(value: number, digits = 1) {
  return `${value.toFixed(digits)}%`;
}

function calcPhaseOut(income: number, status: FormState["filingStatus"]) {
  if (status === "mfs") {
    if (income >= PHASE_OUT_MFS_HIGH) {
      return { eligible: false, reducedLimit: 0, phaseOutPct: 100, maxContrib: 0 };
    }

    const pct = Math.min(1, income / PHASE_OUT_MFS_HIGH);
    const reduced = Math.max(0, Math.floor((ROTH_LIMIT_2026 * (1 - pct)) / 10) * 10);
    return { eligible: reduced > 0, reducedLimit: reduced, phaseOutPct: pct * 100, maxContrib: reduced };
  }

  const low = status === "single" ? PHASE_OUT_SINGLE_LOW : PHASE_OUT_MFJ_LOW;
  const high = status === "single" ? PHASE_OUT_SINGLE_HIGH : PHASE_OUT_MFJ_HIGH;

  if (income <= low) {
    return { eligible: true, reducedLimit: ROTH_LIMIT_2026, phaseOutPct: 0, maxContrib: ROTH_LIMIT_2026 };
  }

  if (income >= high) {
    return { eligible: false, reducedLimit: 0, phaseOutPct: 100, maxContrib: 0 };
  }

  const pct = (income - low) / (high - low);
  const reduced = Math.max(0, Math.floor((ROTH_LIMIT_2026 * (1 - pct)) / 10) * 10);
  return { eligible: reduced > 0, reducedLimit: reduced, phaseOutPct: pct * 100, maxContrib: reduced };
}

function calculate(form: FormState): RothResult | null {
  const currentAge = Number.parseInt(form.currentAge, 10) || 0;
  const retirementAge = Number.parseInt(form.retirementAge, 10) || 0;
  const currentBalance = Number.parseFloat(form.currentBalance.replace(/,/g, "")) || 0;
  const annualContribution = Number.parseFloat(form.annualContribution.replace(/,/g, "")) || 0;
  const income = Number.parseFloat(form.annualIncome.replace(/,/g, "")) || 0;
  const returnRate = (Number.parseFloat(form.annualReturn) || 0) / 100;
  const taxRateNow = (Number.parseFloat(form.taxRateNow) || 0) / 100;
  const taxRateRetirement = (Number.parseFloat(form.taxRateRetirement) || 0) / 100;
  const inflationRate = (Number.parseFloat(form.inflationRate) || 0) / 100;

  if (currentAge <= 0 || retirementAge <= currentAge) {
    return null;
  }

  const years = retirementAge - currentAge;
  const phaseOut = calcPhaseOut(income, form.filingStatus);
  const currentLimit = currentAge >= 50 && form.catchupEnabled ? ROTH_CATCHUP_2026 : ROTH_LIMIT_2026;
  const limitUsed = Math.min(annualContribution, phaseOut.eligible ? phaseOut.reducedLimit : 0, currentLimit);

  const schedule: YearRow[] = [];
  let balance = currentBalance;
  let totalContributed = 0;
  let totalGrowth = 0;

  for (let index = 0; index < years; index += 1) {
    const age = currentAge + index;
    const year = new Date().getFullYear() + index;
    const ageLimit = age >= 50 && form.catchupEnabled ? ROTH_CATCHUP_2026 : ROTH_LIMIT_2026;
    const contribution = Math.min(annualContribution, phaseOut.eligible ? phaseOut.reducedLimit : 0, ageLimit);
    const growth = (balance + contribution) * returnRate;

    balance += contribution + growth;
    totalContributed += contribution;
    totalGrowth += growth;

    schedule.push({
      age,
      year,
      contribution,
      growth,
      balance,
      totalContributed,
      totalGrowth,
    });
  }

  let traditionalBalance = currentBalance;
  for (let index = 0; index < years; index += 1) {
    const age = currentAge + index;
    const ageLimit = age >= 50 && form.catchupEnabled ? ROTH_CATCHUP_2026 : ROTH_LIMIT_2026;
    const pretaxContribution = Math.min(annualContribution / Math.max(0.0001, 1 - taxRateNow), ageLimit);
    traditionalBalance = (traditionalBalance + pretaxContribution) * (1 + returnRate);
  }

  return {
    finalBalance: balance,
    finalBalanceReal: balance / Math.pow(1 + inflationRate, years),
    totalContributed,
    totalGrowth,
    yearsInvesting: years,
    schedule,
    traditionalBalance,
    traditionalAfterTax: traditionalBalance * (1 - taxRateRetirement),
    rothAdvantage: balance - traditionalBalance * (1 - taxRateRetirement),
    maxContribution: phaseOut.maxContrib,
    phaseOutPct: phaseOut.phaseOutPct,
    isEligible: phaseOut.eligible,
    reducedLimit: phaseOut.reducedLimit,
    monthlyContribution: limitUsed / 12,
  };
}

function GrowthChart({ schedule }: { schedule: YearRow[] }) {
  if (schedule.length === 0) {
    return null;
  }

  const width = 700;
  const height = 170;
  const pad = { t: 10, r: 10, b: 30, l: 10 };
  const innerWidth = width - pad.l - pad.r;
  const innerHeight = height - pad.t - pad.b;
  const maxBalance = Math.max(...schedule.map((row) => row.balance));
  const xs = schedule.map((_, index) => pad.l + (index / Math.max(1, schedule.length - 1)) * innerWidth);
  const balanceYs = schedule.map((row) => pad.t + innerHeight - (row.balance / maxBalance) * innerHeight);
  const contributionYs = schedule.map((row) => pad.t + innerHeight - (row.totalContributed / maxBalance) * innerHeight);
  const balancePath = xs.map((x, index) => `${x},${balanceYs[index]}`).join(" ");
  const contributionPath = xs.map((x, index) => `${x},${contributionYs[index]}`).join(" ");
  const balanceArea = `M ${xs[0]},${pad.t + innerHeight} L ${balancePath} L ${xs[xs.length - 1]},${pad.t + innerHeight} Z`;
  const contributionArea = `M ${xs[0]},${pad.t + innerHeight} L ${contributionPath} L ${xs[xs.length - 1]},${pad.t + innerHeight} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="roth-chart" preserveAspectRatio="none">
      <defs>
        <linearGradient id="rothBalanceGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f08a4b" stopOpacity="0.58" />
          <stop offset="100%" stopColor="#f08a4b" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="rothContributionGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#86a7ff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#86a7ff" stopOpacity="0.03" />
        </linearGradient>
      </defs>
      <path d={contributionArea} fill="url(#rothContributionGradient)" />
      <path d={balanceArea} fill="url(#rothBalanceGradient)" />
      <polyline points={contributionPath} fill="none" stroke="#86a7ff" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.8" />
      <polyline points={balancePath} fill="none" stroke="#f08a4b" strokeWidth="2.5" />
    </svg>
  );
}

export default function RothIraCalculatorClient() {
  const [form, setForm] = useState<FormState>({
    currentAge: "30",
    retirementAge: "65",
    currentBalance: "15000",
    annualContribution: "7500",
    annualIncome: "85000",
    filingStatus: "single",
    annualReturn: "7",
    taxRateNow: "22",
    taxRateRetirement: "20",
    inflationRate: "3",
    catchupEnabled: true,
  });
  const [showTable, setShowTable] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const result = useMemo(() => calculate(form), [form]);
  const phaseOutData = useMemo(
    () => calcPhaseOut(Number.parseFloat(form.annualIncome.replace(/,/g, "")) || 0, form.filingStatus),
    [form.annualIncome, form.filingStatus],
  );

  const setFieldValue = (key: keyof FormState) => (value: string) =>
    setForm((previous) => ({ ...previous, [key]: value }));

  const faqs = [
    {
      q: "What is the Roth IRA contribution limit for 2026?",
      a: "For 2026, the IRS direct Roth IRA limit is $7,500 if you are under age 50 and $8,600 if you are age 50 or older.",
    },
    {
      q: "What are the 2026 Roth IRA income limits?",
      a: "For 2026, direct Roth contributions phase out from $153,000 to $168,000 for single filers and from $242,000 to $252,000 for married filing jointly.",
    },
    {
      q: "What is a backdoor Roth IRA?",
      a: "A backdoor Roth IRA is a strategy where a saver makes a non-deductible traditional IRA contribution and then converts it to a Roth IRA when direct Roth eligibility is unavailable.",
    },
    {
      q: "Roth IRA vs Traditional IRA - which is better?",
      a: "The key tradeoff is when you pay tax. Traditional IRA contributions may reduce taxes now, while Roth IRA qualified withdrawals are tax-free later. If you expect higher tax pressure or want more flexibility in retirement, Roth can be more attractive.",
    },
    {
      q: "When can I withdraw from my Roth IRA tax-free?",
      a: "Qualified Roth IRA withdrawals are generally tax-free once the account has satisfied the 5-year rule and you meet a qualifying condition such as reaching age 59 1/2. Contribution basis can usually be withdrawn earlier without tax.",
    },
    {
      q: "Can I have both a Roth IRA and a 401(k)?",
      a: "Yes. Roth IRA limits are separate from workplace plan limits, so many savers contribute to both when cash flow and eligibility allow.",
    },
    {
      q: "What investments should I hold in my Roth IRA?",
      a: "Many investors use a Roth IRA for assets they expect to compound the most over long periods because qualified growth can be withdrawn tax-free.",
    },
    {
      q: "Does a Roth IRA have required minimum distributions?",
      a: "No. Roth IRAs do not impose required minimum distributions during the original owner's lifetime, which is one of their biggest planning advantages.",
    },
  ];

  const useCases = [
    {
      icon: Sunrise,
      title: "Young Professionals Starting Out",
      desc: "Time is the Roth IRA's greatest advantage. Even modest monthly contributions started early can compound for decades with no tax drag on qualified withdrawals.",
    },
    {
      icon: UserRound,
      title: "High Earners Near the Phase-Out",
      desc: "See exactly how much direct Roth contribution room remains at your income level and when a backdoor Roth discussion becomes relevant.",
    },
    {
      icon: Scale,
      title: "Roth vs Traditional Deciders",
      desc: "The comparison panel shows how after-tax retirement value can differ when you change your assumed tax rates today and in retirement.",
    },
    {
      icon: TrendingUp,
      title: "Catch-Up Savers Age 50+",
      desc: "Model the larger direct contribution limit and see how extra late-career savings still meaningfully change the end balance.",
    },
    {
      icon: Home,
      title: "First-Time Home Buyers",
      desc: "Some savers value the Roth IRA's flexibility because contribution basis remains more accessible than many other retirement account dollars.",
    },
    {
      icon: Compass,
      title: "Retirement Income Planners",
      desc: "Use the Roth projection as one piece of a broader tax-diversified retirement income strategy alongside pretax and taxable accounts.",
    },
  ];

  return (
    <>
      <div className="roth-page">
        <div className="roth-shell">
          <header className="roth-hero">
            <div className="hero-orb" />
            <div className="hero-badge">Official 2026 IRS limits</div>
            <h1>Roth IRA <em>Calculator</em></h1>
            <p className="hero-copy">
              Project tax-free retirement growth, check direct Roth eligibility, and compare Roth versus
              traditional IRA outcomes using 2026 IRS limits.
            </p>
            <div className="hero-chips">
              <div className="chip"><Landmark size={14} />{money(ROTH_LIMIT_2026)} annual limit</div>
              <div className="chip"><TrendingUp size={14} />{money(ROTH_CATCHUP_2026)} age 50+</div>
              <div className="chip"><PiggyBank size={14} />Tax-free qualified withdrawals</div>
              <div className="chip"><Compass size={14} />No lifetime RMDs</div>
            </div>
          </header>

          <div className="layout">
            <aside className="input-panel">
              <div className="panel-head"><BriefcaseBusiness size={16} /><span>Your Roth IRA details</span></div>
              <div className="panel-body">
                <div className="section-label">Profile</div>
                <div className="field-grid">
                  <div className="field"><label>Current Age</label><input value={form.currentAge} onChange={(event) => setFieldValue("currentAge")(event.target.value)} /></div>
                  <div className="field"><label>Retirement Age</label><input value={form.retirementAge} onChange={(event) => setFieldValue("retirementAge")(event.target.value)} /></div>
                </div>
                <div className="field"><label>Current Roth IRA Balance</label><input value={form.currentBalance} onChange={(event) => setFieldValue("currentBalance")(event.target.value)} /></div>

                <div className="section-label">Contributions</div>
                <div className="field"><label>Annual Contribution</label><input value={form.annualContribution} onChange={(event) => setFieldValue("annualContribution")(event.target.value)} /></div>
                <button type="button" className={`toggle-btn ${form.catchupEnabled ? "on" : ""}`} onClick={() => setForm((previous) => ({ ...previous, catchupEnabled: !previous.catchupEnabled }))}>
                  <span />
                  Enable age-50 catch-up
                </button>

                <div className="section-label">Income Eligibility</div>
                <div className="field"><label>Modified AGI</label><input value={form.annualIncome} onChange={(event) => setFieldValue("annualIncome")(event.target.value)} /></div>
                <div className="filing-grid">
                  {[
                    { key: "single" as const, label: "Single", sub: "$153K-$168K" },
                    { key: "mfj" as const, label: "Married / Joint", sub: "$242K-$252K" },
                    { key: "mfs" as const, label: "Married / Separate", sub: "$0-$10K" },
                  ].map((option) => (
                    <button type="button" key={option.key} className={`filing-btn ${form.filingStatus === option.key ? "active" : ""}`} onClick={() => setForm((previous) => ({ ...previous, filingStatus: option.key }))}>
                      <span className="filing-sub">{option.sub}</span>
                      <span className="filing-label">{option.label}</span>
                    </button>
                  ))}
                </div>

                <div className="section-label">Assumptions</div>
                <div className="field-grid">
                  <div className="field"><label>Annual Return %</label><input value={form.annualReturn} onChange={(event) => setFieldValue("annualReturn")(event.target.value)} /></div>
                  <div className="field"><label>Inflation %</label><input value={form.inflationRate} onChange={(event) => setFieldValue("inflationRate")(event.target.value)} /></div>
                </div>
                <div className="field-grid">
                  <div className="field"><label>Tax Rate Today %</label><input value={form.taxRateNow} onChange={(event) => setFieldValue("taxRateNow")(event.target.value)} /></div>
                  <div className="field"><label>Retirement Tax Rate %</label><input value={form.taxRateRetirement} onChange={(event) => setFieldValue("taxRateRetirement")(event.target.value)} /></div>
                </div>
              </div>
            </aside>

            <div className="results-col">
              {result ? (
                <>
                  <section className="hero-result">
                    <div>
                      <div className="result-label">Projected Roth balance</div>
                      <div className="result-value">{money(result.finalBalance)}</div>
                      <div className="result-sub">At age {form.retirementAge} after {result.yearsInvesting} years</div>
                      <div className="result-real">About {money(result.finalBalanceReal)} in today&apos;s dollars</div>
                    </div>
                    <div className="badge-stack">
                      <div className="metric-badge"><div className="metric-label">Total growth</div><div className="metric-value">{money(result.totalGrowth)}</div></div>
                      <div className="metric-badge"><div className="metric-label">Monthly contribution</div><div className="metric-value">{money(result.monthlyContribution)}/mo</div></div>
                    </div>
                  </section>

                  <section className="card">
                    <div className="card-head">
                      <div className="card-title">2026 direct contribution eligibility</div>
                      <div className="card-pill">{phaseOutData.eligible ? (phaseOutData.phaseOutPct === 0 ? "Fully eligible" : "Partially eligible") : "Direct Roth blocked"}</div>
                    </div>
                    <div className="elig-line">{phaseOutData.eligible ? `${percent(100 - phaseOutData.phaseOutPct)} eligible` : "0.0% eligible"}</div>
                    <div className="stats-grid">
                      <div className="stat-card"><div className="stat-label">Your max direct contribution</div><div className="stat-value">{phaseOutData.eligible ? money(phaseOutData.maxContrib) : "$0"}</div></div>
                      <div className="stat-card"><div className="stat-label">Phase-out range</div><div className="stat-value">{form.filingStatus === "single" ? "$153K-$168K" : form.filingStatus === "mfj" ? "$242K-$252K" : "$0-$10K"}</div></div>
                      <div className="stat-card"><div className="stat-label">Current annual limit</div><div className="stat-value">{Number.parseInt(form.currentAge, 10) >= 50 && form.catchupEnabled ? money(ROTH_CATCHUP_2026) : money(ROTH_LIMIT_2026)}</div></div>
                    </div>
                    {!phaseOutData.eligible ? <div className="callout"><Scale size={16} />Direct Roth contributions are phased out at this income. A backdoor Roth strategy may still be relevant.</div> : null}
                  </section>

                  <section className="card">
                    <div className="card-head"><div className="card-title">Growth projection</div></div>
                    <GrowthChart schedule={result.schedule} />
                  </section>

                  <section className="card compare-card">
                    <div className="card-head"><div className="card-title">Roth versus traditional IRA</div></div>
                    <div className="compare-row"><span>Roth projected balance</span><strong>{money(result.finalBalance)}</strong></div>
                    <div className="compare-row"><span>Traditional after-tax value</span><strong>{money(result.traditionalAfterTax)}</strong></div>
                    <div className="compare-row"><span>Roth advantage</span><strong>{money(result.rothAdvantage)}</strong></div>
                  </section>

                  <button type="button" className="table-toggle" onClick={() => setShowTable((previous) => !previous)}>
                    {showTable ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    {showTable ? "Hide" : "Show"} year-by-year schedule
                  </button>

                  {showTable ? (
                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr><th>Age / Year</th><th>Contribution</th><th>Growth</th><th>Balance</th></tr>
                        </thead>
                        <tbody>
                          {result.schedule.map((row) => (
                            <tr key={row.year}>
                              <td>Age {row.age} · {row.year}</td>
                              <td>{money(row.contribution)}</td>
                              <td>{money(row.growth)}</td>
                              <td>{money(row.balance)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : null}
                </>
              ) : (
                <section className="card empty-card">Enter your ages and contribution assumptions to see a projection.</section>
              )}
            </div>
          </div>

          <section className="prose-section">
            <h2>What Is a Roth IRA - and Why Does <em>Tax-Free</em> Matter So Much?</h2>
            <p>
              A Roth IRA is an individual retirement account built around one powerful feature:
              qualified withdrawals are completely tax-free. You pay tax before the money goes
              into the account, and after that, future qualified growth and withdrawals can avoid
              income tax entirely. That is a fundamentally different outcome from both taxable
              brokerage accounts and pretax retirement accounts.
            </p>
            <p>
              The real advantage is not just the annual contribution. It is the compounding.
              A long runway lets every year of returns stay inside the account without creating
              an annual tax drag. For savers with decades before retirement, that tax-free
              compounding can materially change the amount ultimately available to spend.
            </p>
            <div className="editorial-callout">
              The Roth IRA is often most powerful for younger savers with long horizons, but it
              can also be valuable for anyone who wants more tax flexibility in retirement and no
              lifetime required minimum distributions on the original account.
            </div>

            <h3>The Five Key Advantages of a Roth IRA</h3>
            <ul>
              <li><strong>Tax-free qualified withdrawals.</strong> Future qualified distributions can be taken without federal income tax.</li>
              <li><strong>No lifetime RMDs for the original owner.</strong> Roth IRAs are not forced into annual withdrawals the way pretax IRA balances can be.</li>
              <li><strong>Contribution-basis flexibility.</strong> Contributions are generally more accessible than earnings, which many savers value.</li>
              <li><strong>Tax diversification.</strong> Holding both Roth and pretax assets can create more control over taxable income in retirement.</li>
              <li><strong>Estate planning value.</strong> A Roth IRA can be an efficient asset to leave behind because the tax treatment is different from pretax accounts.</li>
            </ul>
          </section>

          <section className="prose-section">
            <h2>Roth IRA <em>Contribution Limits</em> and Income Phase-Outs for 2026</h2>
            <p>
              The IRS limits both how much you can contribute and, for direct Roth contributions,
              whether your income allows the full amount. Here are the current 2026 direct Roth
              limits used by this calculator.
            </p>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Age</th>
                  <th>Contribution Limit 2026</th>
                  <th>Single Phase-Out</th>
                  <th>Married / Joint Phase-Out</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Under 50</td>
                  <td>$7,500</td>
                  <td>$153,000 - $168,000</td>
                  <td>$242,000 - $252,000</td>
                </tr>
                <tr>
                  <td>50 and older</td>
                  <td>$8,600</td>
                  <td>$153,000 - $168,000</td>
                  <td>$242,000 - $252,000</td>
                </tr>
                <tr>
                  <td>Married filing separately</td>
                  <td>$7,500 / $8,600</td>
                  <td colSpan={2}>$0 - $10,000</td>
                </tr>
              </tbody>
            </table>
            <p>
              Within the phase-out range, allowed direct Roth contributions decline proportionally.
              If income rises above the range, direct Roth contributions are generally no longer
              available for that year. This calculator applies that reduction automatically so the
              projection uses the allowed direct contribution rather than the requested input.
            </p>
            <div className="editorial-callout blue">
              Roth IRA limits are per person across IRAs. If you contribute to both a Traditional
              IRA and a Roth IRA for the same tax year, the combined total still cannot exceed the
              applicable annual IRA limit.
            </div>

            <h3>The Backdoor Roth IRA for High Earners</h3>
            <p>
              If direct Roth eligibility is phased out, some savers consider the backdoor Roth
              strategy: a non-deductible Traditional IRA contribution followed by a Roth
              conversion. The strategy can work cleanly when there are no other pretax IRA
              balances, but the pro-rata rule can complicate the tax result when pretax IRA money
              already exists.
            </p>
          </section>

          <section className="prose-section">
            <h2>Roth IRA vs. Traditional IRA: <em>Which Wins?</em></h2>
            <p>
              The Roth versus Traditional choice usually comes down to tax timing. Traditional IRA
              contributions may help now, while Roth IRA contributions trade that immediate tax
              benefit for the possibility of tax-free qualified withdrawals later. The correct
              answer depends on expected tax rates, time horizon, and the value you place on Roth
              flexibility.
            </p>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Factor</th>
                  <th>Roth IRA</th>
                  <th>Traditional IRA</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Contribution tax treatment</td>
                  <td>After-tax</td>
                  <td>Potentially pretax or deductible, depending on eligibility</td>
                </tr>
                <tr>
                  <td>Growth taxation</td>
                  <td>Tax-free if qualified</td>
                  <td>Tax-deferred</td>
                </tr>
                <tr>
                  <td>Withdrawal taxation</td>
                  <td>Tax-free if qualified</td>
                  <td>Taxed as ordinary income</td>
                </tr>
                <tr>
                  <td>Required minimum distributions</td>
                  <td>None for the original owner</td>
                  <td>Can apply later in life</td>
                </tr>
                <tr>
                  <td>Income limits for direct contributions</td>
                  <td>Yes</td>
                  <td>No direct contribution limit, though deductibility can phase out</td>
                </tr>
              </tbody>
            </table>
            <div className="editorial-callout green">
              For many savers, the Roth IRA is not only about projected tax brackets. It is also
              about optionality: no lifetime RMDs, tax-free qualified withdrawals, and a cleaner
              source of tax diversification in retirement.
            </div>
          </section>

          <section className="prose-section">
            <h2>How to Use This <em>Roth IRA Calculator</em></h2>
            <div className="steps">
              {[
                {
                  title: "Enter your age and retirement horizon",
                  body: "The difference between starting early and starting late is often larger than most savers expect because each extra year extends compounding.",
                },
                {
                  title: "Add your current Roth IRA balance",
                  body: "Existing balances matter because the account compounds on the full base, not just on future contributions.",
                },
                {
                  title: "Set an annual contribution target",
                  body: "The tool will cap the projection based on the applicable 2026 direct Roth limit and any income-based reduction.",
                },
                {
                  title: "Enter income and filing status",
                  body: "This controls direct Roth eligibility and lets the calculator reduce or block contributions when phase-out rules apply.",
                },
                {
                  title: "Set return, inflation, and tax assumptions",
                  body: "These assumptions shape both the real-dollar projection and the Roth-versus-Traditional comparison.",
                },
                {
                  title: "Review the year-by-year schedule",
                  body: "Use the growth schedule to see exactly when balances accelerate and how the contribution limit changes once age 50 catch-up eligibility begins.",
                },
              ].map((step, index) => (
                <div key={step.title} className="step-card">
                  <div className="step-number">{index + 1}</div>
                  <div>
                    <h4>{step.title}</h4>
                    <p>{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="prose-section">
            <h2>Who Benefits Most From a <em>Roth IRA</em></h2>
          </section>

          <section className="use-grid">
            {useCases.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="use-card">
                  <div className="use-icon"><Icon size={18} /></div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              );
            })}
          </section>

          <section className="faq-list">
            <h2>Frequently asked questions</h2>
            {faqs.map((faq, index) => (
              <div key={faq.q} className="faq-item">
                <button type="button" className="faq-btn" onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                  <span>{faq.q}</span>
                  {openFaq === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openFaq === index ? <div className="faq-answer">{faq.a}</div> : null}
              </div>
            ))}
          </section>

          <footer className="editorial-footer">
            This calculator is for educational purposes only and does not constitute tax,
            investment, or financial advice. Roth IRA rules can change, and your actual outcome
            depends on account eligibility, investment performance, and tax law.
          </footer>
        </div>
      </div>

      <style>{`
        .roth-page {
          --bg: #13192d;
          --panel: #1c243a;
          --panel-2: #212d49;
          --line: rgba(255,255,255,0.1);
          --muted: #8594b3;
          --text: #dce7fb;
          --orange: #f08a4b;
          --amber: #ffd382;
          --blue: #86a7ff;
          --green: #4ade80;
          color: var(--text);
          background:
            radial-gradient(circle at top, rgba(240,138,75,0.1), transparent 34%),
            radial-gradient(circle at right top, rgba(134,167,255,0.1), transparent 26%),
            var(--bg);
          border-radius: 28px;
          padding: 24px;
        }
        .roth-page * { box-sizing: border-box; }
        .roth-shell { max-width: 1180px; margin: 0 auto; }
        .roth-hero { text-align: center; padding: 30px 0 44px; }
        .hero-orb { width: 82px; height: 82px; margin: 0 auto 18px; border-radius: 999px; background: radial-gradient(circle, #ffd382 0%, #f08a4b 42%, rgba(240,138,75,0.02) 70%); box-shadow: 0 0 60px rgba(240,138,75,0.25); }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; border: 1px solid rgba(240,138,75,0.3); background: rgba(240,138,75,0.08); color: var(--amber); border-radius: 999px; padding: 6px 12px; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; margin-bottom: 16px; }
        .roth-hero h1 { font-size: clamp(2.4rem, 6vw, 4.2rem); line-height: 1.05; margin: 0 0 16px; color: white; letter-spacing: -0.03em; }
        .roth-hero h1 em { color: var(--orange); font-style: italic; }
        .hero-copy { max-width: 620px; margin: 0 auto 24px; color: var(--muted); line-height: 1.75; }
        .hero-chips { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; }
        .chip { display: inline-flex; align-items: center; gap: 8px; padding: 7px 14px; border-radius: 999px; background: rgba(255,255,255,0.04); border: 1px solid var(--line); color: var(--muted); font-size: 0.82rem; }
        .layout { display: grid; grid-template-columns: 390px minmax(0, 1fr); gap: 20px; align-items: start; }
        .input-panel, .card, .hero-result, .use-card, .faq-list { background: var(--panel); border: 1px solid var(--line); border-radius: 18px; }
        .input-panel { overflow: hidden; position: sticky; top: 84px; }
        .panel-head { display: flex; align-items: center; gap: 8px; padding: 16px 20px; background: var(--panel-2); color: var(--amber); font-weight: 700; }
        .panel-body { padding: 20px; }
        .section-label { margin: 18px 0 12px; font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); font-weight: 700; display: flex; align-items: center; gap: 8px; }
        .section-label::after { content: ""; flex: 1; height: 1px; background: var(--line); }
        .section-label:first-child { margin-top: 0; }
        .field { margin-bottom: 12px; }
        .field label { display: block; margin-bottom: 5px; font-size: 0.8rem; font-weight: 600; color: var(--text); }
        .field input { width: 100%; height: 40px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.14); background: rgba(0,0,0,0.16); color: white; padding: 0 12px; outline: none; }
        .field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .toggle-btn { width: 100%; margin-bottom: 14px; border-radius: 10px; border: 1px solid var(--line); background: rgba(255,255,255,0.04); color: white; height: 42px; display: inline-flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; position: relative; }
        .toggle-btn span { width: 18px; height: 18px; border-radius: 999px; background: white; position: absolute; left: 12px; transition: transform 0.18s ease; }
        .toggle-btn.on span { transform: translateX(18px); background: var(--orange); }
        .filing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; }
        .filing-btn { border-radius: 10px; border: 1px solid var(--line); background: rgba(0,0,0,0.12); color: var(--muted); padding: 10px 8px; cursor: pointer; text-align: center; }
        .filing-btn.active { border-color: rgba(240,138,75,0.55); background: rgba(240,138,75,0.09); color: var(--amber); }
        .filing-sub { display: block; font-size: 0.61rem; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 2px; }
        .filing-label { display: block; font-size: 0.72rem; font-weight: 700; }
        .results-col { display: flex; flex-direction: column; gap: 16px; }
        .hero-result { display: flex; justify-content: space-between; gap: 18px; padding: 24px; }
        .result-label { text-transform: uppercase; letter-spacing: 0.12em; font-size: 0.68rem; color: var(--muted); margin-bottom: 8px; font-weight: 700; }
        .result-value { font-size: clamp(2.4rem, 6vw, 4rem); line-height: 1; color: var(--orange); margin-bottom: 8px; font-weight: 700; }
        .result-sub, .result-real { color: var(--muted); }
        .badge-stack { display: flex; flex-direction: column; gap: 10px; min-width: 200px; }
        .metric-badge { border-radius: 12px; padding: 10px 14px; border: 1px solid var(--line); background: rgba(255,255,255,0.04); }
        .metric-label, .stat-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); margin-bottom: 4px; font-weight: 700; }
        .metric-value, .stat-value { font-size: 1rem; font-weight: 700; color: white; }
        .card { padding: 20px; }
        .card-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 12px; }
        .card-title { font-size: 1rem; font-weight: 700; color: white; }
        .card-pill { padding: 5px 10px; border-radius: 999px; font-size: 0.72rem; font-weight: 700; background: rgba(255,255,255,0.08); }
        .elig-line { color: var(--muted); font-size: 0.82rem; margin-bottom: 12px; }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .stat-card { padding: 12px; border-radius: 12px; background: rgba(255,255,255,0.04); border: 1px solid var(--line); }
        .callout { display: flex; align-items: flex-start; gap: 8px; margin-top: 12px; padding: 11px 14px; border-radius: 10px; font-size: 0.82rem; line-height: 1.65; background: rgba(134,167,255,0.08); color: #b5c8ff; border: 1px solid rgba(134,167,255,0.22); }
        .roth-chart { width: 100%; height: 170px; display: block; }
        .compare-row { display: flex; justify-content: space-between; gap: 12px; padding: 10px 0; border-top: 1px solid var(--line); color: var(--muted); }
        .compare-row strong { color: white; }
        .table-toggle { width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 16px; border-radius: 14px; border: 1px solid var(--line); background: rgba(255,255,255,0.03); color: var(--amber); font-weight: 700; cursor: pointer; }
        .table-wrap { overflow: auto; border: 1px solid var(--line); border-radius: 16px; background: var(--panel); }
        .table-wrap table { width: 100%; border-collapse: collapse; }
        .table-wrap th, .table-wrap td { padding: 10px 12px; border-top: 1px solid rgba(255,255,255,0.04); color: #c0cbe5; font-size: 0.8rem; text-align: right; }
        .table-wrap th:first-child, .table-wrap td:first-child { text-align: left; }
        .empty-card { text-align: center; color: var(--muted); font-style: italic; }
        .use-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 18px; }
        .use-card { padding: 18px; }
        .use-icon { width: 38px; height: 38px; border-radius: 12px; background: rgba(240,138,75,0.08); color: var(--orange); display: flex; align-items: center; justify-content: center; margin-bottom: 10px; }
        .use-card h3 { margin: 0 0 6px; color: white; font-size: 0.96rem; }
        .use-card p, .faq-answer { color: var(--muted); line-height: 1.72; }
        .prose-section { margin-top: 28px; padding: 24px; background: rgba(255,255,255,0.03); border: 1px solid var(--line); border-radius: 18px; }
        .prose-section h2 { margin: 0 0 14px; font-size: clamp(1.8rem, 3vw, 2.5rem); color: white; line-height: 1.14; }
        .prose-section h2 em { color: var(--orange); font-style: italic; }
        .prose-section h3 { margin: 20px 0 10px; color: var(--text); font-size: 1.1rem; }
        .prose-section p, .prose-section li { color: var(--muted); line-height: 1.8; font-size: 0.96rem; }
        .prose-section ul { margin: 0 0 0 18px; padding: 0; }
        .prose-section li + li { margin-top: 8px; }
        .editorial-callout { margin: 16px 0; padding: 14px 16px; border-radius: 12px; background: rgba(240,138,75,0.08); border: 1px solid rgba(240,138,75,0.22); color: #ffd8bd; line-height: 1.72; }
        .editorial-callout.blue { background: rgba(134,167,255,0.09); border-color: rgba(134,167,255,0.22); color: #c4d4ff; }
        .editorial-callout.green { background: rgba(74,222,128,0.08); border-color: rgba(74,222,128,0.22); color: #bff4cf; }
        .data-table { width: 100%; border-collapse: collapse; margin: 16px 0; border: 1px solid var(--line); border-radius: 14px; overflow: hidden; }
        .data-table th { text-align: left; padding: 10px 12px; background: var(--panel-2); color: var(--amber); font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.06em; }
        .data-table td { padding: 10px 12px; border-top: 1px solid rgba(255,255,255,0.05); color: var(--muted); font-size: 0.9rem; }
        .steps { display: grid; gap: 12px; }
        .step-card { display: flex; gap: 14px; padding: 16px; border-radius: 14px; background: var(--panel); border: 1px solid var(--line); }
        .step-number { width: 32px; height: 32px; flex-shrink: 0; border-radius: 999px; display: flex; align-items: center; justify-content: center; background: var(--orange); color: white; font-weight: 700; }
        .step-card h4 { margin: 0 0 4px; color: white; font-size: 0.98rem; }
        .step-card p { margin: 0; }
        .faq-list { margin-top: 20px; padding: 20px; }
        .faq-list h2 { margin: 0 0 12px; color: white; font-size: 1.5rem; }
        .faq-item + .faq-item { border-top: 1px solid var(--line); }
        .faq-btn { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 16px 0; color: white; background: transparent; border: none; text-align: left; cursor: pointer; font-size: 0.94rem; font-weight: 600; }
        .faq-answer { padding: 0 0 16px; font-size: 0.84rem; }
        .editorial-footer { margin-top: 24px; padding: 24px 0 8px; border-top: 1px solid var(--line); color: var(--muted); text-align: center; line-height: 1.8; font-size: 0.85rem; }
        @media (max-width: 980px) {
          .layout { grid-template-columns: 1fr; }
          .input-panel { position: static; }
          .hero-result, .stats-grid, .use-grid { grid-template-columns: 1fr; flex-direction: column; }
          .badge-stack { width: 100%; min-width: 0; }
        }
        @media (max-width: 760px) {
          .field-grid, .filing-grid, .stats-grid, .use-grid { grid-template-columns: 1fr; }
          .roth-page { padding: 18px; }
        }
      `}</style>
    </>
  );
}
