"use client";

import { useState, useMemo } from "react";
import Head from "next/head";
import { Sprout, Landmark, TrendingUp, Umbrella, Briefcase } from "lucide-react";

interface FormState {
  initialShares: string;
  sharePrice: string;
  annualDividend: string;
  dividendGrowthRate: string;
  shareGrowthRate: string;
  additionalMonthly: string;
  years: string;
  taxRate: string;
  reinvest: boolean;
}

interface YearRow {
  year: number;
  startShares: number;
  newSharesFromDRIP: number;
  newSharesFromBuys: number;
  endShares: number;
  sharePrice: number;
  dividendPerShare: number;
  annualDividendIncome: number;
  taxPaid: number;
  portfolioValue: number;
  totalDividendsEver: number;
  yieldOnCost: number;
}

interface DRIPResult {
  schedule: YearRow[];
  finalPortfolioValue: number;
  totalDividendsEarned: number;
  totalTaxPaid: number;
  totalAdditionalInvested: number;
  initialInvestment: number;
  totalContributions: number;
  noDripValue: number;
  dripAdvantage: number;
  finalShares: number;
  initialSharesN: number;
  finalAnnualIncome: number;
  totalReturnPct: number;
  yieldOnCost: number;
}

function runDRIP(f: FormState): DRIPResult | null {
  const initialShares = parseFloat(f.initialShares) || 0;
  const startPrice    = parseFloat(f.sharePrice) || 0;
  const annualDivPS   = parseFloat(f.annualDividend) || 0;
  const divGrowth     = parseFloat(f.dividendGrowthRate) / 100 || 0;
  const priceGrowth   = parseFloat(f.shareGrowthRate) / 100 || 0;
  const monthly       = parseFloat(f.additionalMonthly) || 0;
  const years         = parseInt(f.years) || 0;
  const taxRate       = parseFloat(f.taxRate) / 100 || 0;
  const reinvest      = f.reinvest;

  if (initialShares <= 0 || startPrice <= 0 || years <= 0) return null;

  const schedule: YearRow[] = [];
  let shares = initialShares;
  let totalDivsEarned = 0;
  let totalTaxPaid = 0;
  const initialInvestment = initialShares * startPrice;
  const totalAdditional = monthly * 12 * years;

  let noDripShares = initialShares;
  let noDripCash = 0;

  for (let yr = 1; yr <= years; yr++) {
    const currentPrice  = startPrice * Math.pow(1 + priceGrowth, yr);
    const currentDivPS  = annualDivPS * Math.pow(1 + divGrowth, yr - 1);
    const startShares   = shares;
    const annualDivIncome = startShares * currentDivPS;
    const taxPaid = annualDivIncome * taxRate;
    const netDiv  = reinvest ? annualDivIncome - taxPaid : 0;

    let newSharesDRIP = 0;
    if (reinvest && currentPrice > 0) newSharesDRIP = netDiv / currentPrice;

    let newSharesBuys = 0;
    if (monthly > 0 && currentPrice > 0) newSharesBuys = (monthly * 12) / currentPrice;

    shares = startShares + newSharesDRIP + newSharesBuys;
    totalDivsEarned += annualDivIncome;
    totalTaxPaid += taxPaid;

    const portfolioValue = shares * currentPrice;
    const totalContrib = initialInvestment + totalAdditional;
    const yoc = totalContrib > 0 ? (shares * currentDivPS) / totalContrib * 100 : 0;

    schedule.push({
      year: yr,
      startShares: +startShares.toFixed(4),
      newSharesFromDRIP: +newSharesDRIP.toFixed(4),
      newSharesFromBuys: +newSharesBuys.toFixed(4),
      endShares: +shares.toFixed(4),
      sharePrice: currentPrice,
      dividendPerShare: currentDivPS,
      annualDividendIncome: annualDivIncome,
      taxPaid,
      portfolioValue,
      totalDividendsEver: totalDivsEarned,
      yieldOnCost: yoc,
    });

    const noDivInc = noDripShares * currentDivPS;
    noDripCash += noDivInc * (1 - taxRate) + monthly * 12;
    if (monthly > 0 && currentPrice > 0) noDripShares += (monthly * 12) / currentPrice;
  }

  const finalPrice = startPrice * Math.pow(1 + priceGrowth, years);
  const finalDivPS = annualDivPS * Math.pow(1 + divGrowth, years - 1);
  const finalPortfolioValue = shares * finalPrice;
  const noDripValue = noDripShares * finalPrice + noDripCash;
  const totalContributions = initialInvestment + totalAdditional;
  const totalReturnPct = totalContributions > 0
    ? ((finalPortfolioValue - totalContributions) / totalContributions) * 100 : 0;
  const yocFinal = totalContributions > 0
    ? (shares * finalDivPS) / totalContributions * 100 : 0;

  return {
    schedule,
    finalPortfolioValue,
    totalDividendsEarned: totalDivsEarned,
    totalTaxPaid,
    totalAdditionalInvested: totalAdditional,
    initialInvestment,
    totalContributions,
    noDripValue,
    dripAdvantage: finalPortfolioValue - noDripValue,
    finalShares: shares,
    initialSharesN: initialShares,
    finalAnnualIncome: shares * finalDivPS,
    totalReturnPct,
    yieldOnCost: yocFinal,
  };
}

const f$ = (v: number, d = 0) =>
  (v < 0 ? "-$" : "$") + Math.abs(v).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const fPct = (v: number, d = 2) => v.toFixed(d) + "%";
const fN   = (v: number, d = 0) => v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

const faqs = [
  { q: "What is a Dividend Reinvestment Plan (DRIP)?", a: "A Dividend Reinvestment Plan (DRIP) automatically reinvests cash dividends back into additional shares of the same stock or fund. DRIPs allow fractional share purchases, often commission-free, and sometimes at a slight discount to market price. The core power is compounding: reinvested dividends buy more shares, which generate more dividends, creating an accelerating cycle over decades." },
  { q: "How is dividend reinvestment calculated?", a: "Each dividend payment is divided by the current share price to determine new shares purchased. If you own 100 shares paying $2.00/share annually ($200 total) and the price is $50, reinvestment buys 4 new shares ($200 ÷ $50). In year 2, you have 104 shares generating $208 in dividends. This calculator runs this math year by year for up to 50 years, accounting for dividend growth, price appreciation, and taxes." },
  { q: "What is yield on cost?", a: "Yield on cost (YOC) is your current annual dividend income divided by your original cost basis — not today's share price. Long-term investors often see dramatic YOC growth. If you invested $10,000 and those shares now pay $1,200/year, your YOC is 12% — even if the stock currently yields only 3%. YOC reveals compounding power hidden from standard yield metrics." },
  { q: "Should I reinvest dividends or take them as cash?", a: "If you don't need the income now, reinvesting almost always produces superior long-term wealth accumulation. Reinvestment harnesses compounding — you earn returns on returns. Historical studies of S&P 500 returns show dividends contributed roughly 40% of total returns over long periods, with reinvestment amplifying that contribution dramatically. The exception: retirees needing income, or situations where better investment opportunities exist elsewhere." },
  { q: "Are reinvested dividends taxable?", a: "Yes. In the US and most jurisdictions, reinvested dividends are taxable in the year received even though you didn't receive cash. Qualified dividends (most US common stocks held long-term) are taxed at 0%, 15%, or 20% based on income. For tax-advantaged accounts like IRAs or Roth IRAs, set your tax rate to 0% to model the full power of tax-free reinvestment." },
  { q: "Does dividend growth rate matter significantly?", a: "Enormously. A stock growing its dividend at 7%/year doubles its payout in ~10 years. Combined with reinvestment and price appreciation, dividend growth rate is often the most powerful long-term variable. This is why dividend growth investors specifically seek Dividend Aristocrats (25+ years of consecutive increases) and Dividend Kings (50+ years). A 2% difference in annual growth rate produces dramatically different outcomes over 30 years." },
  { q: "What is the difference between DRIP and dollar-cost averaging?", a: "They're complementary. DRIP reinvests dividends into the same stock automatically. Dollar-cost averaging (DCA) invests a fixed dollar amount at regular intervals — the 'Additional Monthly Investment' in this calculator. Used together, DRIP + DCA is one of the most effective long-term wealth-building strategies: dividends automatically compound while fresh capital steadily accumulates shares." },
  { q: "Can I DRIP ETFs and index funds?", a: "Yes. Most brokerages allow automatic dividend reinvestment for ETFs (like VYM, SCHD, DVY) and mutual funds. The math is identical to individual stocks. Many S&P 500 index funds (like VOO) also pay dividends — roughly 1.2%–1.5% annually — making DRIP effective even for passive index investors." },
];

function AreaChart({ schedule }: { schedule: YearRow[] }) {
  if (!schedule.length) return null;
  const W = 600, H = 130;
  const pad = { t: 8, r: 8, b: 24, l: 8 };
  const iW = W - pad.l - pad.r, iH = H - pad.t - pad.b;
  const maxVal = Math.max(...schedule.map(r => r.portfolioValue));
  const xs = schedule.map((_, i) => pad.l + (i / Math.max(1, schedule.length - 1)) * iW);
  const ys = schedule.map(r => pad.t + iH - (r.portfolioValue / maxVal) * iH);
  const dyYs = schedule.map(r => pad.t + iH - (r.totalDividendsEver / maxVal) * iH);
  const polyline = xs.map((x, i) => `${x},${ys[i]}`).join(" ");
  const divLine  = xs.map((x, i) => `${x},${dyYs[i]}`).join(" ");
  const area = `M ${xs[0]},${pad.t + iH} L ${polyline} L ${xs[xs.length-1]},${pad.t+iH} Z`;
  const da   = `M ${xs[0]},${pad.t + iH} L ${divLine} L ${xs[xs.length-1]},${pad.t+iH} Z`;
  const step = schedule.length <= 10 ? 1 : Math.ceil(schedule.length / 5);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 130, display: "block" }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c9933a" stopOpacity=".45"/><stop offset="100%" stopColor="#c9933a" stopOpacity=".02"/></linearGradient>
        <linearGradient id="dg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e8d5a0" stopOpacity=".3"/><stop offset="100%" stopColor="#e8d5a0" stopOpacity=".02"/></linearGradient>
      </defs>
      <path d={da}   fill="url(#dg)"/>
      <path d={area} fill="url(#pg)"/>
      <polyline points={divLine}  fill="none" stroke="#e8d5a0" strokeWidth="1.5" strokeDasharray="4 3" opacity=".6"/>
      <polyline points={polyline} fill="none" stroke="#c9933a" strokeWidth="2.5"/>
      {schedule.map((r, i) => i % step === 0 || i === schedule.length - 1 ? (
        <text key={i} x={xs[i]} y={H - 4} textAnchor="middle" fontSize="9" fill="#8a7a5a" fontFamily="serif">Yr {r.year}</text>
      ) : null)}
    </svg>
  );
}

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
        <input type="number" value={value} step={step ?? 1} min={min ?? 0} max={max}
          placeholder={placeholder ?? "0"} onChange={e => onChange(e.target.value)} />
        {suffix && <span className="ad r">{suffix}</span>}
      </div>
    </div>
  );
}

const schemaData = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebPage", "@id": "https://findbest.tools/finance/dividend-reinvestment-calculator", "name": "Dividend Reinvestment Calculator (DRIP) 2026", "description": "Free DRIP calculator. Model compound dividend growth, share accumulation, yield on cost, and portfolio value year by year." },
    { "@type": "FAQPage", "mainEntity": faqs.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })) },
    { "@type": "SoftwareApplication", "name": "Dividend Reinvestment Calculator", "applicationCategory": "FinanceApplication", "operatingSystem": "Web", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" } },
  ],
};

export default function Page() {
  const [form, setForm] = useState<FormState>({
    initialShares: "100", sharePrice: "50", annualDividend: "2.00",
    dividendGrowthRate: "5", shareGrowthRate: "7",
    additionalMonthly: "200", years: "25", taxRate: "15", reinvest: true,
  });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);

  const set = (k: keyof FormState) => (v: string) => setForm(p => ({ ...p, [k]: v }));
  const result = useMemo(() => runDRIP(form), [form]);

  const currentYield = form.sharePrice && form.annualDividend
    ? fPct((parseFloat(form.annualDividend) / parseFloat(form.sharePrice)) * 100)
    : "—";

  return (
    <>
      <Head>
        <title>Dividend Reinvestment Calculator (DRIP) 2026 — Compound Growth & Yield on Cost</title>
        <meta name="description" content="Free dividend reinvestment calculator. Model DRIP compound growth, share accumulation, yield on cost, and portfolio value year by year. Compare reinvesting vs. taking dividends as cash. No sign-up." />
        <meta name="keywords" content="dividend reinvestment calculator, DRIP calculator, dividend reinvestment plan calculator, compound dividend growth, yield on cost calculator, dividend growth calculator 2026, DRIP compound interest, reinvest dividends calculator" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://findbest.tools/finance/dividend-reinvestment-calculator" />
        <meta property="og:title" content="Dividend Reinvestment Calculator (DRIP) 2026" />
        <meta property="og:description" content="See how reinvesting dividends compounds your wealth over decades. Year-by-year share accumulation, yield on cost, DRIP vs cash." />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      </Head>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Nunito:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --p:#fdf6e8;--cream:#f5ead4;--warm:#ede0c4;--border:#d4b97a;--border2:#c4a660;
          --ink:#2a2016;--muted:#7a6a48;--faint:#b8a880;--gold:#c9933a;--gold2:#e8b84b;
          --gold-lt:#f5e4b5;--gold-dk:#8a5e1a;--olive:#5a6a2a;--olive-lt:#dde8c0;
          --sh:0 2px 20px rgba(42,32,22,.09);
        }
        body{font-family:'Nunito',sans-serif;background:var(--p);color:var(--ink);line-height:1.65;font-size:15px;background-image:radial-gradient(ellipse at 20% 0%,rgba(201,147,58,.06) 0%,transparent 60%),radial-gradient(ellipse at 80% 100%,rgba(201,147,58,.04) 0%,transparent 60%)}
        .page{max-width:1040px;margin:0 auto;padding:0 20px 100px}

        /* Hero */
        .hero{padding:60px 0 44px;border-bottom:2px solid var(--border);margin-bottom:48px;position:relative}
        .hero::before{content:'◆';position:absolute;right:0;top:50px;font-size:180px;color:rgba(201,147,58,.05);line-height:1;pointer-events:none}
        .eyebrow{display:flex;align-items:center;gap:12px;margin-bottom:18px}
        .ey-line{flex:0 0 40px;height:2px;background:var(--gold)}
        .ey-text{font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--gold)}
        h1{font-family:'Libre Baskerville',serif;font-size:clamp(2.2rem,5vw,3.8rem);font-weight:700;line-height:1.1;color:var(--ink);margin-bottom:14px;letter-spacing:-.01em}
        h1 em{font-style:italic;color:var(--gold)}
        .hero-sub{font-size:16px;color:var(--muted);max-width:540px;font-weight:300}
        .hero-orn{display:flex;align-items:center;gap:10px;margin-top:22px}
        .orn-line{height:1px;background:var(--border);flex:1;max-width:120px}
        .hero-pills{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
        .pill{background:var(--cream);border:1px solid var(--border);border-radius:100px;padding:4px 14px;font-size:12px;color:var(--muted);font-weight:500}
        .pill strong{color:var(--gold-dk)}

        /* Layout */
        .layout{display:grid;grid-template-columns:390px 1fr;gap:24px;margin-bottom:64px;animation:riseUp .45s ease both}
        @media(max-width:820px){.layout{grid-template-columns:1fr}}
        @keyframes riseUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}

        /* Input card */
        .ic{background:#fff;border:1.5px solid var(--border);border-radius:12px;overflow:hidden;box-shadow:var(--sh)}
        .ic-hd{background:var(--ink);padding:14px 22px;display:flex;align-items:center;gap:10px}
        .ic-hd-title{font-family:'Libre Baskerville',serif;font-size:.9rem;color:var(--gold2);font-style:italic;flex:1}
        .ic-gem{color:var(--gold);font-size:14px}
        .ic-body{padding:22px 20px}
        .sec{font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--faint);margin:18px 0 11px;display:flex;align-items:center;gap:8px}
        .sec::before{content:'—';color:var(--gold);opacity:.5}
        .sec:first-of-type{margin-top:0}

        .field{margin-bottom:12px}
        .fl{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px}
        .field label{font-size:12.5px;font-weight:600;color:var(--ink)}
        .fhint{font-size:10.5px;color:var(--faint)}
        .iw{display:flex;align-items:center;background:var(--p);border:1.5px solid var(--border);border-radius:6px;overflow:hidden;transition:border-color .15s}
        .iw:focus-within{border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,147,58,.1)}
        .ad{padding:0 10px;font-size:13px;color:var(--muted);background:var(--warm);border-right:1px solid var(--border);height:38px;display:flex;align-items:center;font-family:'Libre Baskerville',serif;flex-shrink:0}
        .ad.r{border-right:none;border-left:1px solid var(--border)}
        .iw input{flex:1;border:none;outline:none;padding:0 10px;height:38px;font-size:13.5px;font-family:'Nunito',sans-serif;color:var(--ink);background:transparent;-moz-appearance:textfield;font-weight:500}
        .iw input::-webkit-outer-spin-button,.iw input::-webkit-inner-spin-button{-webkit-appearance:none}
        .fp{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .trow{display:flex;align-items:center;gap:10px;background:var(--cream);border:1.5px solid var(--border);border-radius:8px;padding:12px 14px;margin-bottom:4px}
        .tog{position:relative;width:40px;height:22px;flex-shrink:0}
        .tog input{opacity:0;width:0;height:0}
        .tog-sl{position:absolute;inset:0;background:var(--warm);border-radius:100px;cursor:pointer;transition:background .2s;border:1.5px solid var(--border)}
        .tog-sl::before{content:'';position:absolute;width:14px;height:14px;left:3px;top:3px;background:var(--faint);border-radius:50%;transition:all .2s}
        .tog input:checked+.tog-sl{background:var(--gold);border-color:var(--gold-dk)}
        .tog input:checked+.tog-sl::before{transform:translateX(18px);background:#fff}
        .tog-lbl{font-size:13px;font-weight:600;color:var(--ink)}
        .tog-sub{font-size:11px;color:var(--muted);margin-left:auto}

        /* Results */
        .rc{display:flex;flex-direction:column;gap:16px}
        .rh{background:var(--ink);border-radius:12px;padding:26px 24px 20px;position:relative;overflow:hidden}
        .rh::before{content:'◆';position:absolute;right:-20px;bottom:-30px;font-size:140px;color:rgba(201,147,58,.06);line-height:1;pointer-events:none}
        .rh::after{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--gold),var(--gold2),var(--gold))}
        .rh-top{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;position:relative;z-index:1}
        .rh-lbl{font-size:11px;color:rgba(255,255,255,.4);letter-spacing:.14em;text-transform:uppercase;margin-bottom:6px;font-family:'Libre Baskerville',serif;font-style:italic}
        .rh-val{font-family:'Libre Baskerville',serif;font-size:clamp(2.5rem,6vw,4rem);font-weight:700;color:var(--gold2);line-height:1}
        .rh-sub{font-size:12px;color:rgba(255,255,255,.3);margin-top:5px}
        .rh-badges{display:flex;flex-direction:column;gap:8px;align-items:flex-end;flex-shrink:0}
        .rh-badge{background:rgba(201,147,58,.12);border:1px solid rgba(201,147,58,.25);border-radius:6px;padding:8px 14px;text-align:right}
        .rh-badge .bl{font-size:10px;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.08em;margin-bottom:2px}
        .rh-badge .bv{font-size:15px;font-weight:700;color:var(--gold2);font-family:'Libre Baskerville',serif}
        .rh-badge.grn{background:rgba(90,106,42,.2);border-color:rgba(90,106,42,.4)}
        .rh-badge.grn .bv{color:#a8cc68}

        .sg{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
        @media(max-width:500px){.sg{grid-template-columns:1fr 1fr}}
        .bs{background:#fff;border:1.5px solid var(--border);border-radius:10px;padding:14px 16px;box-shadow:0 1px 8px rgba(42,32,22,.05)}
        .bs.gd{background:var(--gold-lt);border-color:var(--border2)}
        .bs-lbl{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px;font-weight:600}
        .bs-val{font-family:'Libre Baskerville',serif;font-size:1.3rem;font-weight:700;color:var(--ink);line-height:1.2}
        .bs.gd .bs-val{color:var(--gold-dk)}
        .bs-sub{font-size:10.5px;color:var(--faint);margin-top:3px}

        .chart-card{background:#fff;border:1.5px solid var(--border);border-radius:12px;padding:18px 20px;box-shadow:var(--sh)}
        .chart-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px}
        .chart-title{font-family:'Libre Baskerville',serif;font-size:.95rem;font-weight:700;color:var(--ink);font-style:italic}
        .chart-leg{display:flex;gap:14px}
        .cl-item{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--muted)}
        .cl-dot{height:3px;width:12px;border-radius:100px}

        .cmp{background:#fff;border:1.5px solid var(--border);border-radius:12px;overflow:hidden;box-shadow:var(--sh)}
        .cmp-hd{background:var(--warm);padding:11px 18px;font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);border-bottom:1px solid var(--border)}
        .cmp-row{display:flex;justify-content:space-between;align-items:center;padding:10px 18px;border-bottom:1px solid rgba(212,185,122,.3);font-size:13.5px}
        .cmp-row:last-child{border-bottom:none}
        .cr-lbl{color:var(--muted)}
        .cr-vals{display:flex;gap:20px}
        .crv{text-align:center;min-width:90px}
        .crv .cvl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;margin-bottom:2px}
        .crv.drip .cvl{color:var(--gold-dk)}
        .crv.cash .cvl{color:var(--muted)}
        .crv .cvv{font-weight:700;font-size:14px}
        .crv.drip .cvv{color:var(--ink)}
        .crv.cash .cvv{color:var(--muted)}
        .win-t{font-size:10px;background:var(--gold-lt);color:var(--gold-dk);border:1px solid var(--border2);border-radius:100px;padding:2px 8px;font-weight:700}

        .stbtn{background:none;border:1.5px solid var(--border);border-radius:8px;padding:10px 20px;font-family:'Nunito',sans-serif;font-size:13.5px;color:var(--gold-dk);font-weight:600;cursor:pointer;display:block;width:100%;transition:all .15s}
        .stbtn:hover{background:var(--gold-lt);border-color:var(--gold)}

        .tbl-wrap{overflow-x:auto;border:1.5px solid var(--border);border-radius:10px;box-shadow:var(--sh);margin-bottom:64px}
        .tbl{width:100%;border-collapse:collapse;font-size:12.5px}
        .tbl th{background:var(--ink);color:var(--gold2);padding:10px 12px;text-align:right;font-size:10px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;white-space:nowrap;font-family:'Libre Baskerville',serif}
        .tbl th:first-child{text-align:left}
        .tbl td{padding:9px 12px;border-bottom:1px solid rgba(212,185,122,.25);color:var(--muted);text-align:right;white-space:nowrap}
        .tbl td:first-child{text-align:left;color:var(--ink);font-weight:600}
        .tbl tr:last-child td{border-bottom:none}
        .tbl tr:nth-child(even) td{background:rgba(245,234,212,.4)}
        .tbl tr:hover td{background:var(--gold-lt)}
        .tbl td.hl{color:var(--gold-dk);font-weight:700}

        /* Prose */
        .prose{margin-bottom:60px}
        .prose-rule{display:flex;align-items:center;gap:14px;margin-bottom:16px}
        .prose-rule::before,.prose-rule::after{content:'';flex:1;height:1px;background:var(--border)}
        .prose h2{font-family:'Libre Baskerville',serif;font-size:clamp(1.6rem,3.5vw,2.3rem);font-weight:700;color:var(--ink);letter-spacing:-.01em;text-align:center;margin-bottom:20px}
        .prose h2 em{font-style:italic;color:var(--gold)}
        .prose h3{font-family:'Libre Baskerville',serif;font-size:1.15rem;font-weight:700;color:var(--ink);margin:24px 0 8px}
        .prose p{color:var(--muted);margin-bottom:14px;font-size:15px;font-weight:300;line-height:1.75}
        .prose strong{color:var(--ink);font-weight:600}
        .prose ul{margin:0 0 14px 20px}
        .prose ul li{margin-bottom:7px;font-size:14.5px;color:var(--muted);font-weight:300;line-height:1.6}
        .callout{background:var(--gold-lt);border:1.5px solid var(--border);border-left:4px solid var(--gold);border-radius:8px;padding:14px 18px;margin:16px 0;font-size:14.5px;color:var(--ink);font-weight:400;line-height:1.7}
        .formula{background:var(--cream);border:1.5px solid var(--border);border-left:4px solid var(--gold);border-radius:8px;padding:16px 18px;margin:16px 0;font-family:'Libre Baskerville',serif;font-size:14px;color:var(--ink);line-height:2}
        .formula strong{color:var(--gold-dk)}
        .dt{width:100%;border-collapse:collapse;font-size:13.5px;border-radius:8px;overflow:hidden;border:1.5px solid var(--border);margin:16px 0}
        .dt th{background:var(--ink);color:var(--gold2);padding:10px 14px;text-align:left;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;font-family:'Libre Baskerville',serif}
        .dt td{padding:10px 14px;border-bottom:1px solid rgba(212,185,122,.3);color:var(--muted);font-weight:300}
        .dt tr:last-child td{border-bottom:none}
        .dt tr:hover td{background:var(--cream)}
        .steps{counter-reset:st;display:flex;flex-direction:column;gap:12px}
        .step{display:flex;gap:16px;counter-increment:st;background:#fff;border:1.5px solid var(--border);border-radius:10px;padding:16px 18px}
        .step-n{width:30px;height:30px;border-radius:50%;background:var(--gold);color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-family:'Libre Baskerville',serif}
        .step-n::before{content:counter(st)}
        .step-body h4{font-size:14.5px;font-weight:700;color:var(--ink);margin-bottom:4px;font-family:'Libre Baskerville',serif}
        .step-body p{font-size:13px;color:var(--muted);margin:0;font-weight:300}
        .ucg{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px}
        .uc{background:#fff;border:1.5px solid var(--border);border-radius:10px;padding:20px;transition:border-color .2s,box-shadow .2s}
        .uc:hover{border-color:var(--gold);box-shadow:0 4px 20px rgba(201,147,58,.1)}
        .uc-icon{font-size:1.8rem;margin-bottom:10px;color:var(--gold)}
        .uc h4{font-family:'Libre Baskerville',serif;font-size:1rem;font-weight:700;color:var(--ink);margin-bottom:7px}
        .uc p{font-size:13px;color:var(--muted);margin:0;font-weight:300}
        .faq-list{display:flex;flex-direction:column;gap:8px}
        .faq-item{background:#fff;border:1.5px solid var(--border);border-radius:8px;overflow:hidden}
        .faq-q{width:100%;text-align:left;padding:15px 20px;font-size:14.5px;font-weight:600;color:var(--ink);background:none;border:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:12px;font-family:'Nunito',sans-serif;transition:background .1s}
        .faq-q:hover{background:var(--cream)}
        .faq-chev{flex-shrink:0;color:var(--faint);transition:transform .22s}
        .faq-chev.open{transform:rotate(180deg);color:var(--gold)}
        .faq-a{max-height:0;overflow:hidden;transition:max-height .32s ease,padding .32s;font-size:14.5px;color:var(--muted);line-height:1.75;padding:0 20px;font-weight:300}
        .faq-a.open{max-height:400px;padding:0 20px 16px}
        .footer{text-align:center;font-size:12px;color:var(--faint);padding:32px 0 20px;border-top:1.5px solid var(--border);line-height:1.9;font-weight:300;font-family:'Libre Baskerville',serif;font-style:italic}
      `}</style>

      <div className="page">

        {/* Hero */}
        <header className="hero">
          <div className="eyebrow">
            <div className="ey-line" /><div className="ey-text">DRIP Calculator · Compound Growth · 2026</div><div className="ey-line" />
          </div>
          <h1>Dividend <em>Reinvestment</em><br />Calculator</h1>
          <p className="hero-sub">See how reinvesting dividends compounds wealth over decades — share accumulation, yield on cost, and year-by-year projections.</p>
          <div className="hero-orn">
            <div className="orn-line" /><span style={{ color: "var(--gold)", fontSize: 12 }}>◆</span><div className="orn-line" />
          </div>
          <div className="hero-pills">
            <div className="pill"><strong>DRIP</strong> vs. Cash dividends</div>
            <div className="pill"><strong>Yield on cost</strong> projection</div>
            <div className="pill"><strong>Year-by-year</strong> share accumulation</div>
            <div className="pill"><strong>Tax-aware</strong> reinvestment math</div>
          </div>
        </header>

        {/* Calculator */}
        <div className="layout">

          {/* Inputs */}
          <div className="ic">
            <div className="ic-hd">
              <span className="ic-gem">◆</span>
              <div className="ic-hd-title">Investment Parameters</div>
            </div>
            <div className="ic-body">
              <div className="sec">Initial Position</div>
              <div className="fp">
                <Field label="Shares Owned" value={form.initialShares} onChange={set("initialShares")} step={1} placeholder="100" />
                <Field label="Share Price" prefix="$" value={form.sharePrice} onChange={set("sharePrice")} step={0.5} placeholder="50.00" />
              </div>

              <div className="sec">Dividend Details</div>
              <Field label="Annual Dividend per Share" prefix="$" hint={`Current yield: ${currentYield}`} value={form.annualDividend} onChange={set("annualDividend")} step={0.01} placeholder="2.00" />
              <div className="fp">
                <Field label="Dividend Growth Rate" hint="annual %" suffix="%" value={form.dividendGrowthRate} onChange={set("dividendGrowthRate")} step={0.5} placeholder="5" />
                <Field label="Share Price Growth" hint="annual %" suffix="%" value={form.shareGrowthRate} onChange={set("shareGrowthRate")} step={0.5} placeholder="7" />
              </div>

              <div className="sec">Additional Investing</div>
              <Field label="Additional Monthly Investment" hint="DCA on top of DRIP" prefix="$" value={form.additionalMonthly} onChange={set("additionalMonthly")} step={25} placeholder="200" />

              <div className="sec">Settings</div>
              <div className="fp">
                <Field label="Investment Horizon" suffix="yrs" value={form.years} onChange={set("years")} step={1} placeholder="25" min={1} max={50} />
                <Field label="Dividend Tax Rate" hint="0% for IRA/Roth" suffix="%" value={form.taxRate} onChange={set("taxRate")} step={1} placeholder="15" min={0} max={50} />
              </div>
              <div className="trow">
                <label className="tog">
                  <input type="checkbox" checked={form.reinvest} onChange={e => setForm(p => ({ ...p, reinvest: e.target.checked }))} />
                  <span className="tog-sl" />
                </label>
                <span className="tog-lbl">Reinvest Dividends (DRIP)</span>
                <span className="tog-sub">{form.reinvest ? "ON" : "OFF — cash only"}</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="rc">
            {result ? (
              <>
                <div className="rh">
                  <div className="rh-top">
                    <div>
                      <div className="rh-lbl">Final Portfolio Value</div>
                      <div className="rh-val">{f$(result.finalPortfolioValue)}</div>
                      <div className="rh-sub">after {form.years} yrs · {fN(result.finalShares, 2)} total shares</div>
                    </div>
                    <div className="rh-badges">
                      <div className="rh-badge grn"><div className="bl">DRIP Advantage</div><div className="bv">+{f$(result.dripAdvantage)}</div></div>
                      <div className="rh-badge"><div className="bl">Total Return</div><div className="bv">{fPct(result.totalReturnPct, 0)}</div></div>
                    </div>
                  </div>
                </div>

                <div className="sg">
                  {[
                    { l: "Annual Income (Final Year)", v: f$(result.finalAnnualIncome), s: "dividend income", g: true },
                    { l: "Yield on Cost", v: fPct(result.yieldOnCost), s: "vs. total invested" },
                    { l: "Total Dividends Earned", v: f$(result.totalDividendsEarned), s: "cumulative lifetime" },
                    { l: "Initial Investment", v: f$(result.initialInvestment), s: `${fN(result.initialSharesN)} shares × ${f$(parseFloat(form.sharePrice)||0)}` },
                    { l: "Additional Invested", v: f$(result.totalAdditionalInvested), s: "monthly contributions" },
                    { l: "Shares Accumulated", v: `+${fN(result.finalShares - result.initialSharesN, 1)}`, s: "from DRIP + purchases", g: true },
                  ].map((s, i) => (
                    <div className={`bs ${s.g ? "gd" : ""}`} key={i}>
                      <div className="bs-lbl">{s.l}</div>
                      <div className="bs-val">{s.v}</div>
                      <div className="bs-sub">{s.s}</div>
                    </div>
                  ))}
                </div>

                <div className="chart-card">
                  <div className="chart-hd">
                    <div className="chart-title">Portfolio Growth Over {form.years} Years</div>
                    <div className="chart-leg">
                      <div className="cl-item"><div className="cl-dot" style={{ background: "#c9933a" }} />Value</div>
                      <div className="cl-item"><div className="cl-dot" style={{ background: "#e8d5a0" }} />Dividends</div>
                    </div>
                  </div>
                  <AreaChart schedule={result.schedule} />
                </div>

                <div className="cmp">
                  <div className="cmp-hd">DRIP Reinvestment vs. Cash Dividends — After {form.years} Years</div>
                  {[
                    { l: "Final Portfolio Value", d: f$(result.finalPortfolioValue), c: f$(result.noDripValue), dWins: true },
                    { l: "Shares Owned", d: fN(result.finalShares, 1), c: fN(result.initialSharesN, 1), dWins: true },
                    { l: "Annual Dividend Income", d: f$(result.finalAnnualIncome), c: f$(result.initialSharesN * parseFloat(form.annualDividend) * Math.pow(1 + parseFloat(form.dividendGrowthRate)/100, parseInt(form.years)-1)), dWins: true },
                    { l: "DRIP Advantage", d: `+${f$(result.dripAdvantage)}`, c: "—", dWins: true },
                  ].map((row, i) => (
                    <div className="cmp-row" key={i}>
                      <span className="cr-lbl">{row.l}</span>
                      <div className="cr-vals">
                        <div className="crv drip">
                          <div className="cvl">DRIP {row.dWins && <span className="win-t">✓ better</span>}</div>
                          <div className="cvv">{row.d}</div>
                        </div>
                        <div className="crv cash">
                          <div className="cvl">Cash</div>
                          <div className="cvv">{row.c}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="stbtn" onClick={() => setShowTable(s => !s)}>
                  {showTable ? "▲ Hide" : "▼ Show"} Year-by-Year Schedule ({form.years} rows)
                </button>
              </>
            ) : (
              <div style={{ background: "#fff", border: "1.5px solid var(--border)", borderRadius: 12, padding: 40, textAlign: "center", color: "var(--muted)", fontFamily: "'Libre Baskerville',serif", fontSize: 15, fontStyle: "italic" }}>
                Enter your shares and dividend to see projections.
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        {showTable && result && (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Year</th><th>Start Shares</th><th>DRIP Shares</th><th>Bought Shares</th>
                  <th>Total Shares</th><th>Share Price</th><th>Div/Share</th>
                  <th>Annual Div</th><th>Tax Paid</th><th>Portfolio Value</th><th>Yield on Cost</th>
                </tr>
              </thead>
              <tbody>
                {result.schedule.map(r => (
                  <tr key={r.year}>
                    <td>{r.year}</td>
                    <td>{fN(r.startShares, 2)}</td>
                    <td>{fN(r.newSharesFromDRIP, 3)}</td>
                    <td>{fN(r.newSharesFromBuys, 3)}</td>
                    <td className="hl">{fN(r.endShares, 2)}</td>
                    <td>{f$(r.sharePrice, 2)}</td>
                    <td>{f$(r.dividendPerShare, 2)}</td>
                    <td>{f$(r.annualDividendIncome, 0)}</td>
                    <td>{f$(r.taxPaid, 0)}</td>
                    <td className="hl">{f$(r.portfolioValue, 0)}</td>
                    <td>{fPct(r.yieldOnCost, 1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Content */}
        <section className="prose">
          <div className="prose-rule"><span style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 14, color: "var(--gold)", letterSpacing: ".1em" }}>◆ ◆ ◆</span></div>
          <h2>The Quiet Power of <em>Dividend Reinvestment</em></h2>
          <p>There is nothing dramatic about dividend reinvestment. Every quarter, a small deposit arrives in your brokerage account and instead of sitting as idle cash, it purchases a few more shares. A fraction more ownership. Almost imperceptible in any single quarter. And yet, accumulated across ten, twenty, thirty years, this quiet mechanical process produces outcomes that feel, in retrospect, almost unreasonable in their magnitude.</p>
          <p>The mathematics underlying DRIP is the mathematics of compounding applied to a self-reinforcing system. More shares produce more dividends. More dividends buy more shares. Each cycle is slightly larger than the last. In the early years, the incremental gains are modest. In the later years, the acceleration becomes visceral: shares purchased through reinvestment begin to rival the original position in size, and dividend income reaches levels that would have seemed fanciful at the outset.</p>
          <div className="callout">💡 Research consistently shows that <strong>dividend reinvestment accounts for a disproportionate share of total stock market returns</strong> over long periods. Studies of S&P 500 history show dividends contributed roughly 40% of total returns over multi-decade periods — and reinvesting that income compounds the contribution dramatically.</div>

          <h3>The DRIP Calculation, Step by Step</h3>
          <p>The mechanics are straightforward. Each year, your dividend income is determined by your share count multiplied by the current dividend per share. After accounting for taxes, the net amount is divided by the current share price to compute fractional new shares.</p>
          <div className="formula">
            <strong>Dividend Income</strong> = Shares Owned × Annual Dividend per Share<br/>
            <strong>After-Tax Dividend</strong> = Dividend Income × (1 − Tax Rate)<br/>
            <strong>New DRIP Shares</strong> = After-Tax Dividend ÷ Share Price<br/>
            <strong>New Total Shares</strong> = Previous Shares + DRIP Shares + Additional Purchases<br/>
            <strong>Portfolio Value</strong> = New Total Shares × Current Share Price
          </div>

          <h3>Why Dividend Growth Rate Is the Most Powerful Variable</h3>
          <p>The dividend growth rate is often the single most impactful input in long-term DRIP projections. A company growing its dividend at 7%/year doubles its payout in about 10 years. Over 30 years, even a modest 5% grower pays 4.3× its starting dividend — dramatically increasing the income available for reinvestment each year.</p>
          <p>This is why investors in <strong>Dividend Aristocrats</strong> (S&amp;P 500 companies with 25+ consecutive years of dividend increases) cite their yield on cost — not current yield — as evidence of the strategy. A position entered at 2.5% yield that grows 8%/year reaches 10.7% yield on cost after 20 years. The power isn't visible at the start. It compounds in silence.</p>
        </section>

        <section className="prose">
          <h2>Yield on Cost: <em>The Hidden Reward</em></h2>
          <p>Yield on cost (YOC) is a metric that confuses newcomers but delights long-term dividend investors. It is simply: current annual dividend income ÷ original cost basis. When you buy a dividend stock yielding 3%, your YOC starts at 3%. If that dividend grows 7%/year and you hold for 20 years, the dividend has grown ~3.9× — making your YOC approximately 11.7%.</p>
          <p>This is the compounding of dividend income divorced from share price volatility. Even if the share price barely moves, a steadily growing dividend means your income relative to original capital grows year after year. Investors who held Coca-Cola (KO) or Johnson &amp; Johnson (JNJ) for 30+ years often have yields on cost above 10%–20% today — from what were originally 2%–3% yielding positions.</p>
        </section>

        <section className="prose">
          <h2>How to Use This <em>DRIP Calculator</em></h2>
          <div className="steps">
            {[
              { t: "Enter Your Current Position", p: "Input shares owned and current share price. For a hypothetical investment, divide your planned investment by share price (e.g., $5,000 ÷ $50 = 100 shares)." },
              { t: "Set Your Dividend Details", p: "Enter annual dividend per share (dollar amount, not yield percentage). Find this on your broker's stock page. Set a dividend growth rate based on the company's 5–10 year history." },
              { t: "Set Share Price Appreciation", p: "Your assumption for annual price growth. 7% is a rough S&P 500 long-run average. Dividend growth stocks often appreciate 5%–10%. Use conservative assumptions to stress-test projections." },
              { t: "Add Monthly Contributions", p: "If you plan to dollar-cost average, enter your monthly additional investment. This compounds alongside DRIP — the combination is especially powerful over long horizons." },
              { t: "Set Tax Rate", p: "US qualified dividends (held 60+ days) are taxed at 0%, 15%, or 20% by income bracket. For IRAs or Roth IRAs, enter 0% to model the full power of tax-free compounding." },
              { t: "Toggle DRIP to Compare", p: "Disable DRIP to see the portfolio value taking all dividends as cash. The DRIP Advantage metric shows the exact dollar value that reinvestment adds — often hundreds of thousands over decades." },
            ].map((s, i) => (
              <div className="step" key={i}><div className="step-n" /><div className="step-body"><h4>{s.t}</h4><p>{s.p}</p></div></div>
            ))}
          </div>
        </section>

        <section className="prose">
          <h2>Who Benefits Most From <em>DRIP Investing</em></h2>
          <div className="ucg">
            {[
              { icon: <Sprout size={28} strokeWidth={1.5} />, title: "Young Investors with Long Horizons", desc: "The compounding effect is exponential. Investors in their 20s–30s have the longest runway — even small DRIP positions grow into substantial wealth over 30+ years." },
              { icon: <Landmark size={28} strokeWidth={1.5} />, title: "IRA and Roth IRA Holders", desc: "Tax-advantaged accounts let you reinvest 100% of dividends with no tax drag. Set tax rate to 0% to model the full power of DRIP in a retirement account." },
              { icon: <TrendingUp size={28} strokeWidth={1.5} />, title: "Dividend Growth Investors", desc: "Track Dividend Aristocrats and Kings in this calculator. Model what 25–50 years of consecutive dividend increases does to your yield on cost and annual income." },
              { icon: <Umbrella size={28} strokeWidth={1.5} />, title: "Pre-Retirees Building Income", desc: "See exactly what annual dividend income your portfolio generates at retirement. The 'Final Annual Income' stat shows your projected quarterly dividend check." },
              { icon: <Briefcase size={28} strokeWidth={1.5} />, title: "Direct DRIP Program Participants", desc: "Many companies offer direct DRIP enrollment — sometimes at a 1%–5% discount and commission-free. Model how that discount compounds over your holding period." },
            ].map((uc, i) => (
              <div className="uc" key={i}><div className="uc-icon">{uc.icon}</div><h4>{uc.title}</h4><p>{uc.desc}</p></div>
            ))}
          </div>
        </section>

        <section className="prose">
          <h2>Frequently Asked <em>Questions</em></h2>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <div className="faq-item" key={i}>
                <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                  {f.q}<span className={`faq-chev ${openFaq === i ? "open" : ""}`}>▾</span>
                </button>
                <div className={`faq-a ${openFaq === i ? "open" : ""}`}>{f.a}</div>
              </div>
            ))}
          </div>
        </section>

        <footer className="footer">
          This calculator is for educational and informational purposes only and does not constitute investment, financial, or tax advice.<br/>
          Projections assume constant growth rates and are not a guarantee of future results. Past dividend history does not guarantee future payments.<br/>
          Consult a qualified financial advisor and tax professional before making investment decisions.
        </footer>
      </div>
    </>
  );
}
