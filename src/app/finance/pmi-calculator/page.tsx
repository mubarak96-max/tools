import type { Metadata } from "next";
import PMICalculator from "@/components/PMICalculator";
import JsonLd from "@/components/seo/JsonLd";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { 
  Home, 
  TrendingUp, 
  RefreshCw, 
  Landmark, 
  Lightbulb, 
  AlertTriangle,
  Info,
  ChevronDown
} from "lucide-react";

const PAGE_PATH = "/finance/pmi-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faqs = [
  {
    question: "What is Private Mortgage Insurance (PMI)?",
    answer: "Private Mortgage Insurance (PMI) is a type of insurance policy that protects your mortgage lender — not you — if you default on the loan. It is required by lenders when your down payment is less than 20% of the home's purchase price on a conventional loan. PMI typically costs between 0.19% and 1.71% of your loan amount annually, added to your monthly mortgage payment.",
  },
  {
    question: "How is PMI calculated in 2026?",
    answer: "In 2026, PMI rates are determined by your loan-to-value (LTV) ratio and credit score tier, using rate cards published by private mortgage insurers like MGIC, Radian, Enact (formerly Genworth), and Arch MI. The annual rate is applied to your outstanding loan balance and divided by 12 to get your monthly PMI premium. Our calculator uses current 2026 market-average rate tables across these major PMI providers.",
  },
  {
    question: "When can I stop paying PMI?",
    answer: "Under the federal Homeowners Protection Act (HPA), lenders must automatically cancel PMI when your loan balance reaches 78% of the original purchase price (i.e., 22% equity), based on your original amortization schedule. You can also request cancellation at 80% LTV (20% equity) if you have a good payment history. You can reach 20% equity faster by making extra payments or through home appreciation — an appraisal may be required.",
  },
  {
    question: "Is PMI tax-deductible in 2026?",
    answer: "The PMI tax deduction (under IRS Form 1098 as mortgage insurance premiums) has historically been extended on a year-by-year basis by Congress. As of 2026, verify the current deductibility status with a tax professional or the IRS, as it has lapsed and been reinstated multiple times. When active, the deduction phases out for incomes above $100,000 AGI.",
  },
  {
    question: "What's the difference between PMI and MIP?",
    answer: "PMI (Private Mortgage Insurance) applies to conventional loans and is cancellable once you reach 20% equity. MIP (Mortgage Insurance Premium) is the FHA equivalent — it includes an upfront premium of 1.75% of the loan amount plus an annual premium (0.50%–0.55% in 2026). For FHA loans with less than 10% down, MIP lasts for the life of the loan unless you refinance into a conventional mortgage.",
  },
  {
    question: "How can I avoid paying PMI?",
    answer: "There are several strategies: (1) Put 20% down to eliminate PMI entirely. (2) Use a piggyback loan — an 80-10-10 structure where a second mortgage covers 10% so your first mortgage stays at 80% LTV. (3) Look for lender-paid PMI (LPMI) where the lender pays the PMI in exchange for a slightly higher interest rate. (4) Some credit unions and niche lenders offer no-PMI programs. (5) VA loans for eligible veterans have no PMI requirement.",
  },
  {
    question: "Does a higher credit score reduce my PMI payment?",
    answer: "Yes, significantly. Credit score is one of the two primary factors (along with LTV) that determines your PMI rate. For example, at 95% LTV, a borrower with a 760+ credit score might pay 0.68% annually versus 1.71% for a borrower below 660 — a difference of over $4,000/year on a $400,000 loan. Improving your credit score before applying can dramatically reduce your PMI cost.",
  },
  {
    question: "What is lender-paid PMI (LPMI)?",
    answer: "With lender-paid PMI, your mortgage lender pays the PMI premium upfront on your behalf in exchange for a higher interest rate — typically 0.25%–0.75% higher. This eliminates the separate monthly PMI line item but increases your interest rate for the life of the loan. LPMI can make sense if you plan to sell or refinance within a few years, before the accumulated higher interest outweighs what you'd have paid in PMI.",
  },
];

const useCases = [
  { icon: <Home className="w-6 h-6" />, title: "First-Time Buyers Evaluating Down Payments", desc: "Compare the monthly cost of putting 5%, 10%, or 20% down. See exactly how much PMI you'd pay and when it ends — versus the opportunity cost of a larger down payment." },
  { icon: <TrendingUp className="w-6 h-6" />, title: "Homeowners Tracking Equity for PMI Removal", desc: "Already have a mortgage? Estimate when your balance will cross the 80% LTV threshold so you know when to request PMI cancellation and save hundreds per month." },
  { icon: <RefreshCw className="w-6 h-6" />, title: "Refinance Candidates", desc: "If home values have risen, you may now have 20%+ equity and can refinance out of PMI. Use this calculator to see your current estimated LTV and potential savings." },
  { icon: <Landmark className="w-6 h-6" />, title: "Comparing Loan Programs", desc: "Run conventional PMI side-by-side with FHA MIP. For some borrowers with lower credit scores, FHA's flat MIP rate is cheaper than conventional PMI — this calculator shows the difference." },
  { icon: <Lightbulb className="w-6 h-6" />, title: "Piggyback Loan Strategy Evaluation", desc: "Considering an 80-10-10 loan structure? Calculate your PMI cost on a high-LTV loan versus the second mortgage payment to find which approach costs less over your planned holding period." },
];

export const metadata: Metadata = {
  ...buildMetadata({
    title: "PMI Calculator 2026 — Private Mortgage Insurance Calculator",
    description: "Free PMI insurance calculator using 2026 rate tables. Calculate your monthly private mortgage insurance cost, see when PMI drops off, and find out how much you'll pay in total. No sign-up required.",
    path: PAGE_PATH,
  }),
  keywords: [
    "pmi calculator",
    "pmi insurance calculator",
    "private mortgage insurance calculator",
    "how much is pmi",
    "when does pmi go away",
    "pmi rate calculator 2026",
    "mortgage insurance calculator",
    "pmi rate by credit score",
    "pmi vs mip calculator",
    "how to get rid of pmi",
  ],
};

function buildApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Private Mortgage Insurance Calculator",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "url": PAGE_URL,
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  };
}

export default function PMICalculatorPage() {
  const faqJsonLd = buildFaqJsonLd(faqs.map(f => ({ question: f.question, answer: f.answer })));

  return (
    <>
      <JsonLd data={serializeJsonLd(buildApplicationJsonLd())} />
      <JsonLd
        data={serializeJsonLd(
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Finance Tools", path: "/finance" },
            { name: "PMI Calculator", path: PAGE_PATH },
          ]),
        )}
      />
      {faqJsonLd && <JsonLd data={serializeJsonLd(faqJsonLd)} />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');

        .pmi-page {
          font-family: 'Jost', sans-serif;
          background: #f5f1ea;
          color: #1a1712;
          line-height: 1.65;
          font-size: 16px;
          --paper:    #f5f1ea;
          --cream:    #ede8de;
          --linen:    #e4ddd0;
          --forest:   #1e4020;
          --forest2:  #2d5a27;
          --sage:     #4a7c59;
          --sage-lt:  #d6e8da;
          --rust:     #c8541a;
          --rust-lt:  #f7e8df;
          --gold:     #8a6b1e;
          --gold-lt:  #f0e8d0;
          --ink:      #1a1712;
          --muted:    #6b6254;
          --border:   #d4ccc0;
          --radius:   10px;
          --sh:       0 2px 24px rgba(26,23,18,.09);
        }

        .pmi-container { max-width: 1020px; margin: 0 auto; padding: 0 20px 100px; }

        .hero {
          padding: 64px 0 52px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 40px;
          align-items: end;
          border-bottom: 1.5px solid var(--border);
          margin-bottom: 52px;
        }
        @media (max-width: 640px) { .hero { grid-template-columns: 1fr; } .hero-aside { display: none; } }
        .hero-kicker {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: var(--rust);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .hero-kicker::after {
          content: '';
          display: block;
          height: 1px;
          width: 40px;
          background: var(--rust);
          opacity: .5;
        }
        .pmi-page h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.4rem, 5.5vw, 4rem);
          font-weight: 700;
          line-height: 1.08;
          color: var(--ink);
          margin-bottom: 18px;
          letter-spacing: -.01em;
        }
        .pmi-page h1 em { font-style: italic; color: var(--forest2); }
        .hero-sub {
          font-size: 16px;
          color: var(--muted);
          max-width: 500px;
          font-weight: 300;
        }
        .hero-aside { text-align: right; flex-shrink: 0; }
        .hero-aside .year-badge {
          font-family: 'Cormorant Garamond', serif;
          font-size: 5rem;
          font-weight: 700;
          color: var(--linen);
          line-height: 1;
          display: block;
        }
        .hero-aside .year-sub {
          font-size: 12px;
          color: var(--muted);
          letter-spacing: .1em;
          text-transform: uppercase;
        }

        .calc-grid {
          display: grid;
          grid-template-columns: 420px 1fr;
          gap: 24px;
          margin-bottom: 64px;
        }
        @media (max-width: 800px) { .calc-grid { grid-template-columns: 1fr; } }

        .inputs-panel {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 30px 26px;
          box-shadow: var(--sh);
        }
        .panel-head {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--forest);
          margin-bottom: 22px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--linen);
          display: flex;
          align-items: center;
          gap: 9px;
        }
        .panel-head .dot { width: 8px; height: 8px; background: var(--rust); border-radius: 50%; flex-shrink: 0; }

        .sec-label {
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: var(--muted);
          margin: 20px 0 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .sec-label::after { content: ''; flex: 1; height: 1px; background: var(--linen); }

        .field { margin-bottom: 15px; }
        .field label { display: block; font-size: 13px; font-weight: 500; color: var(--ink); margin-bottom: 4px; }
        .hint { font-size: 11.5px; color: var(--muted); margin-bottom: 5px; font-weight: 300; }

        .input-wrap {
          display: flex;
          align-items: center;
          background: var(--paper);
          border: 1.5px solid var(--border);
          border-radius: 7px;
          overflow: hidden;
          transition: border-color .15s;
        }
        .input-wrap:focus-within { border-color: var(--forest2); box-shadow: 0 0 0 3px rgba(45,90,39,.08); }
        .adorn {
          padding: 0 10px;
          font-size: 13px;
          color: var(--muted);
          background: var(--cream);
          border-right: 1px solid var(--border);
          height: 40px;
          display: flex; align-items: center;
          font-weight: 500;
          flex-shrink: 0;
        }
        .adorn.suf { border-right: none; border-left: 1px solid var(--border); }
        .input-wrap input {
          flex: 1; border: none; outline: none;
          padding: 0 12px; height: 40px;
          font-size: 14px;
          font-family: 'Jost', sans-serif;
          color: var(--ink);
          background: transparent;
        }

        .dp-toggle { display: flex; gap: 6px; margin-bottom: 10px; }
        .dp-btn {
          flex: 1; padding: 7px; border-radius: 6px;
          border: 1.5px solid var(--border);
          background: none; cursor: pointer;
          font-family: 'Jost', sans-serif;
          font-size: 13px; font-weight: 500;
          color: var(--muted);
          transition: all .13s;
        }
        .dp-btn.on { background: var(--forest); color: #fff; border-color: var(--forest); }

        .pmi-page select {
          width: 100%; height: 40px;
          background: var(--paper);
          border: 1.5px solid var(--border);
          border-radius: 7px;
          color: var(--ink);
          font-family: 'Jost', sans-serif;
          font-size: 14px;
          padding: 0 12px;
          outline: none; cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='7'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b6254' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 32px;
        }

        .results-panel { display: flex; flex-direction: column; gap: 16px; }

        .pmi-hero {
          background: var(--forest);
          border-radius: 14px;
          padding: 28px 26px;
          color: #fff;
          position: relative;
          overflow: hidden;
        }
        .pmi-hero-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; position: relative; z-index: 1; }
        .pmi-main-stat .label { font-size: 11px; color: rgba(255,255,255,.5); letter-spacing: .1em; text-transform: uppercase; margin-bottom: 6px; }
        .pmi-main-stat .amount {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 6vw, 3.8rem);
          font-weight: 700;
          line-height: 1;
        }
        .pmi-main-stat .per { font-size: 14px; color: rgba(255,255,255,.45); margin-top: 4px; }
        .pmi-badges { display: flex; flex-direction: column; gap: 8px; align-items: flex-end; }
        .pmi-badge {
          background: rgba(255,255,255,.1);
          border: 1px solid rgba(255,255,255,.15);
          border-radius: 8px;
          padding: 8px 14px;
          text-align: right;
        }
        .pmi-badge .b-label { font-size: 10px; color: rgba(255,255,255,.45); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 2px; }
        .pmi-badge .b-val { font-size: 15px; font-weight: 600; }
        .pmi-badge.highlight { background: rgba(200,84,26,.25); border-color: rgba(200,84,26,.4); }
        .pmi-badge.highlight .b-val { color: #f5b08a; }
        .pmi-hero-tier { font-size: 11.5px; color: rgba(255,255,255,.4); margin-top: 12px; position: relative; z-index: 1; font-style: italic; }

        .no-pmi-banner { background: var(--sage-lt); border: 1.5px solid var(--sage); border-radius: 14px; padding: 22px 24px; display: flex; align-items: center; gap: 14px; }
        .no-pmi-icon { font-size: 2rem; }
        .no-pmi-title { font-family: 'Cormorant Garamond', serif; font-size: 1.25rem; font-weight: 700; color: var(--forest); }
        .no-pmi-sub { font-size: 13px; color: var(--sage); }

        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .stat {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 15px 16px;
          box-shadow: 0 1px 8px rgba(26,23,18,.04);
        }
        .stat .s-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: .07em; margin-bottom: 4px; font-weight: 500; }
        .stat .s-val { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 700; color: var(--ink); }
        .stat.rust .s-val { color: var(--rust); }
        .stat.forest .s-val { color: var(--forest2); }
        .stat.gold .s-val { color: var(--gold); }

        .equity-card { background: #fff; border: 1px solid var(--border); border-radius: 10px; padding: 18px; box-shadow: 0 1px 8px rgba(26,23,18,.04); }
        .equity-card-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px; }
        .equity-card-title { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; }
        .equity-bar-track { height: 10px; background: var(--linen); border-radius: 100px; position: relative; }
        .equity-fill { height: 100%; background: linear-gradient(90deg, var(--forest2), var(--sage)); border-radius: 100px; transition: width .6s; }
        .target-line { position: absolute; top: -4px; width: 2px; height: 18px; background: var(--rust); z-index: 2; }
        .equity-labels { position: relative; height: 20px; margin-top: 4px; }
        .eq-label { position: absolute; font-size: 11px; color: var(--forest2); font-weight: 600; transform: translateX(-50%); }
        .eq-target { position: absolute; left: 20%; font-size: 10px; color: var(--rust); transform: translateX(-50%); top: 4px; white-space: nowrap; }

        .donut-card { background: #fff; border: 1px solid var(--border); border-radius: 10px; padding: 18px; display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
        .donut-svg { width: 100px; height: 100px; }
        .donut-legend { flex: 1; min-width: 160px; }
        .legend-item { display: flex; align-items: center; gap: 8px; margin-bottom: 7px; font-size: 13px; }
        .legend-dot { width: 10px; height: 10px; border-radius: 50%; }
        .legend-label { flex: 1; color: var(--muted); }
        .legend-val { font-weight: 600; }

        .timeline-btn { display: block; background: none; border: 1.5px solid var(--border); border-radius: 7px; padding: 9px 20px; font-size: 13px; color: var(--forest2); font-weight: 500; cursor: pointer; width: 100%; margin-top: 4px; }
        .timeline-wrap { background: #fff; border: 1px solid var(--border); border-radius: 10px; padding: 16px; margin-top: 4px; }
        .timeline-title { font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--muted); margin-bottom: 14px; }
        .timeline-chart { display: flex; align-items: flex-end; gap: 2px; height: 80px; }
        .t-bar { flex: 1; border-radius: 2px 2px 0 0; min-height: 4px; }
        .timeline-legend { display: flex; gap: 16px; margin-top: 10px; font-size: 11px; color: var(--muted); }
        .tl-item { display: flex; align-items: center; gap: 5px; }
        .tl-dot { width: 8px; height: 8px; border-radius: 50%; }

        .prose { margin-bottom: 60px; }
        .prose h2 { font-family: 'Cormorant Garamond', serif; font-size: clamp(1.7rem, 3.5vw, 2.4rem); font-weight: 700; margin-bottom: 16px; letter-spacing: -.01em; }
        .prose h3 { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 700; color: var(--forest); margin: 24px 0 8px; }
        .prose p { color: var(--muted); margin-bottom: 14px; font-size: 15.5px; font-weight: 300; }
        .prose strong { color: var(--ink); font-weight: 600; }
        .prose ul { margin: 0 0 16px 20px; color: var(--muted); }
        .prose li { margin-bottom: 7px; font-size: 15px; font-weight: 300; }

        .callout { background: var(--sage-lt); border-left: 3px solid var(--sage); border-radius: 9px; padding: 15px 18px; margin: 16px 0; font-size: 14.5px; color: var(--forest); }
        .callout.rust { background: var(--rust-lt); border-left-color: var(--rust); color: #7a2f0a; }

        .data-table { width: 100%; border-collapse: collapse; font-size: 14px; border: 1px solid var(--border); margin: 16px 0; border-radius: 10px; overflow: hidden; }
        .data-table th { background: var(--forest); color: rgba(255,255,255,.75); padding: 10px 14px; text-align: left; font-size: 11.5px; font-weight: 600; text-transform: uppercase; }
        .data-table td { padding: 10px 14px; border-bottom: 1px solid var(--border); color: var(--muted); font-weight: 300; }
        .data-table .emphasis { color: var(--rust); font-weight: 600; }

        .step { display: flex; gap: 16px; background: #fff; border: 1px solid var(--border); border-radius: 11px; padding: 18px 20px; margin-bottom: 12px; }
        .step-n { width: 30px; height: 30px; border-radius: 50%; background: var(--forest); color: #fff; font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .step-body h4 { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
        .step-body p { font-size: 13.5px; color: var(--muted); margin: 0; font-weight: 300; }

        .uc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; }
        .uc { background: #fff; border: 1px solid var(--border); border-radius: 11px; padding: 20px; }
        .uc-icon { font-size: 1.7rem; margin-bottom: 10px; }
        .uc h4 { font-family: 'Cormorant Garamond', serif; font-size: 1.05rem; font-weight: 700; color: var(--forest); margin-bottom: 7px; }
        .uc p { font-size: 13.5px; color: var(--muted); margin: 0; font-weight: 300; }

        .faq-item { background: #fff; border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin-bottom: 8px; }
        .faq-q { width: 100%; text-align: left; padding: 16px 20px; font-size: 14.5px; font-weight: 500; display: flex; justify-content: space-between; align-items: center; border: none; background: none; cursor: pointer; }
        .faq-a { padding: 0 20px 16px; font-size: 14.5px; color: var(--muted); font-weight: 300; }

        .footer { text-align: center; font-size: 12px; color: var(--muted); padding: 36px 0; border-top: 1px solid var(--border); font-weight: 300; }
      `}</style>

      <main className="pmi-page">
        <div className="pmi-container">
          <header className="hero">
            <div>
              <div className="hero-kicker">Free Calculator · 2026 PMI Rates</div>
              <h1>Private Mortgage <em>Insurance</em> Calculator</h1>
              <p className="hero-sub">
                See your exact monthly PMI cost, when it drops off, and how much you&apos;ll pay in total — using 2026 rate tables from MGIC, Radian, and Enact.
              </p>
            </div>
            <div className="hero-aside">
              <span className="year-badge">2026</span>
              <span className="year-sub">Updated Rates</span>
            </div>
          </header>

          <PMICalculator />

          {/* ─────────────── CONTENT ─────────────── */}
          <section className="prose mt-16">
            <h2>What Is Private Mortgage Insurance (PMI)?</h2>
            <p>
              <strong>Private Mortgage Insurance (PMI)</strong> is an insurance policy required by conventional mortgage lenders when a homebuyer makes a down payment of less than 20% of the home&apos;s purchase price. Despite its name, PMI protects the <em>lender</em> — not you — against financial loss if you default on the loan. If you stop making payments and the lender forecloses, PMI compensates the lender for the gap between the outstanding loan balance and what they recover from selling the property.
            </p>
            <p>
              From a borrower&apos;s perspective, PMI is simply an additional monthly cost that makes homeownership possible without a full 20% down payment. Without PMI, lenders would take on far too much risk with high-LTV loans and either refuse to issue them or charge prohibitively high interest rates. PMI unlocks homeownership for millions of first-time buyers who haven&apos;t yet saved a full 20% — it&apos;s the price of buying sooner rather than waiting years to accumulate a larger down payment.
            </p>
            <div className="callout flex gap-3 items-start">
              <Lightbulb className="w-5 h-5 mt-0.5 shrink-0" />
              <span>In 2026, typical PMI costs range from <strong>0.19% to 1.71%</strong> of your loan amount annually, depending on your loan-to-value ratio and credit score. On a $400,000 loan at 10% down, that&apos;s roughly <strong>$62 to $228 per month</strong> — a wide range that makes shopping your rate worthwhile.</span>
            </div>

            <h3>PMI vs. MIP: What&apos;s the Difference?</h3>
            <p>
              PMI applies only to <strong>conventional loans</strong>. Government-backed FHA loans use their own version called <strong>MIP (Mortgage Insurance Premium)</strong>, which works very differently:
            </p>
            <ul>
              <li><strong>Conventional PMI:</strong> Rate set by private insurers (MGIC, Radian, Enact), varies by LTV and credit score, and is fully cancellable once you reach 20% equity. No upfront premium.</li>
              <li><strong>FHA MIP:</strong> A fixed annual premium (0.50%–0.55% in 2026) plus a mandatory 1.75% upfront premium rolled into your loan balance. For loans with less than 10% down, MIP lasts the entire life of the loan — it never cancels automatically.</li>
              <li><strong>VA Funding Fee:</strong> VA loans (for eligible veterans and service members) have no PMI or MIP at all. Instead, a one-time funding fee of 1.25%–3.3% applies. For most eligible borrowers, this is far cheaper than years of PMI.</li>
            </ul>
            <p>
              For borrowers with credit scores above 720 and moderate LTVs, conventional PMI is usually cheaper over the long run — especially since it eventually cancels. Our calculator lets you switch between loan types to compare the real cost difference.
            </p>
          </section>

          <section className="prose">
            <h2>How PMI Rates Are Determined in 2026</h2>
            <p>
              PMI rates are set by private mortgage insurance companies — primarily <strong>MGIC, Radian, Enact (formerly Genworth), Arch MI, and National MI</strong>. Each lender chooses which insurer to use, and rates vary slightly between providers. The rate you pay is based on two primary factors: your <strong>loan-to-value (LTV) ratio</strong> and your <strong>credit score tier</strong>.
            </p>
            <table className="data-table">
              <thead>
                <tr>
                  <th>LTV Range</th>
                  <th>Credit 760+</th>
                  <th>Credit 720–739</th>
                  <th>Credit 680–699</th>
                  <th>Credit Below 660</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>80.01%–85%</td><td>0.19%</td><td>0.26%</td><td>0.38%</td><td>0.58%</td></tr>
                <tr><td>85.01%–90%</td><td>0.37%</td><td>0.50%</td><td>0.68%</td><td>0.97%</td></tr>
                <tr><td>90.01%–95%</td><td>0.52%</td><td>0.69%</td><td>0.95%</td><td>1.35%</td></tr>
                <tr><td>95.01%–97%</td><td>0.68%</td><td>0.90%</td><td><span className="emphasis">1.22%</span></td><td><span className="emphasis">1.71%</span></td></tr>
              </tbody>
            </table>
            <p>
              Rates above are annual percentages applied to your <em>outstanding loan balance</em>, then divided by 12 for your monthly premium. This means your PMI cost gradually decreases over time as your loan balance falls — though the reduction is modest month-to-month. Highlighted cells show where high LTV combined with lower credit scores creates significantly elevated PMI costs.
            </p>

            <h3>How Monthly PMI Is Calculated</h3>
            <p>
              The formula is straightforward: <strong>Monthly PMI = (Outstanding Loan Balance × Annual PMI Rate) ÷ 12</strong>. For example, a $360,000 loan balance with a 0.52% annual PMI rate works out to $360,000 × 0.0052 ÷ 12 = <strong>$156/month</strong>. Our calculator applies this formula to each month of your amortization schedule, showing you the exact month your balance crosses the 80% LTV threshold and PMI drops off.
            </p>
            <p>
              One thing many borrowers don&apos;t realize: you can sometimes request that your lender check multiple PMI providers. Rate differences of 0.10%–0.20% between providers are common at the same LTV and credit tier. On a $350,000 loan, that difference is worth $350–$700 per year. It&apos;s worth asking.
            </p>
          </section>

          <section className="prose">
            <h2>When Does PMI Go Away? The Complete HPA Guide</h2>
            <p>
              The federal <strong>Homeowners Protection Act (HPA)</strong>, enacted in 1999, gives borrowers clear legal rights around PMI cancellation. There are three distinct scenarios under which your lender must remove PMI:
            </p>
            <ul>
              <li>
                <strong>Automatic cancellation at 78% LTV:</strong> Your lender is legally required to cancel PMI automatically once your scheduled payments bring your loan balance to 78% of the original purchase price — that&apos;s 22% equity. This applies to your <em>scheduled</em> payment date, not when you actually pay down to that level, and it is a federal legal requirement with no opt-out for the lender.
              </li>
              <li>
                <strong>Borrower-requested cancellation at 80% LTV:</strong> You can proactively request PMI removal once your balance drops to 80% of the original purchase price (20% equity). The lender may require: (a) a written request, (b) a good payment history — typically no payments 60+ days late in the past two years, and (c) possibly a new appraisal confirming the home value hasn&apos;t declined.
              </li>
              <li>
                <strong>Midpoint cancellation:</strong> If your loan&apos;s normal amortization never reaches 80% LTV — rare, but possible on interest-only loans — lenders must cancel PMI at the midpoint of the repayment term. On a 30-year mortgage, that means month 180, regardless of your current balance.
              </li>
            </ul>
            <div className="callout rust flex gap-3 items-start">
              <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
              <span><strong>Critical detail:</strong> The HPA&apos;s automatic cancellation rules are tied to the <em>original purchase price</em> — not your home&apos;s current market value. Even if your home has appreciated 30% since purchase, automatic cancellation still triggers based on when your amortization schedule reaches 78% of the original price. To use appreciation for early cancellation, you must submit a formal written request and typically provide a lender-approved appraisal.</span>
            </div>

            <h3>Cancelling PMI Early Using Home Appreciation</h3>
            <p>
              If your home&apos;s value has risen significantly, you may be able to cancel PMI well ahead of schedule. Here&apos;s the typical lender process:
            </p>
            <ul>
              <li>Order a new appraisal from a lender-approved appraiser (usually $400–$700).</li>
              <li>Submit a written cancellation request to your mortgage servicer.</li>
              <li>Demonstrate that the current LTV — based on the appraised value — is 80% or below.</li>
              <li>Most lenders require you to have owned the home for at least 2 years and have no 30-day late payments in the past 12 months.</li>
            </ul>
            <p>
              Example: You paid $400,000 for your home, put 10% down, and now have a $345,000 balance. Your home is now appraised at $460,000. Your new LTV is $345,000 ÷ $460,000 = 74.9% — well below 80%. You can request PMI removal immediately, potentially saving thousands in remaining premiums.
            </p>
          </section>

          <section className="prose">
            <h2>Strategies to Reduce or Eliminate PMI</h2>

            <h3>1. Put 20% Down</h3>
            <p>
              The simplest path — but not always the most practical. On a $500,000 home, 20% down requires $100,000 in cash. For many first-time buyers, that would mean delaying homeownership by several years. The real question isn&apos;t &quot;should I avoid PMI?&quot; but rather &quot;does waiting to save more down payment cost more than PMI itself?&quot; Factor in rising home prices, missed equity appreciation, and the rent you&apos;d continue paying while saving.
            </p>

            <h3>2. Piggyback Loans (80-10-10)</h3>
            <p>
              A piggyback loan uses two mortgages simultaneously: an 80% primary mortgage (no PMI), a 10% home equity loan or HELOC (second mortgage), and your 10% down payment. Because the first mortgage is at exactly 80% LTV, conventional PMI is never triggered. The second mortgage carries a higher interest rate (typically prime + 1–2%), but it may cost less than PMI — and you can pay it off aggressively. Use our calculator to compare your PMI monthly cost against an estimated second mortgage payment to see which makes more financial sense for your situation.
            </p>

            <h3>3. Lender-Paid PMI (LPMI)</h3>
            <p>
              Some lenders offer to pay your PMI upfront in exchange for a higher interest rate — typically 0.25%–0.75% higher. This eliminates the separate monthly PMI line item but permanently embeds the cost into your rate for the entire loan term. LPMI makes sense when you plan to sell or refinance within 5–7 years, before accumulated higher interest payments exceed what you&apos;d have paid in PMI. If you intend to stay long-term, borrower-paid PMI that eventually cancels is almost always the better deal.
            </p>

            <h3>4. VA Loans for Eligible Borrowers</h3>
            <p>
              VA loans — available to active-duty military, veterans, and surviving spouses — require zero down payment and <strong>never require PMI</strong>. A VA funding fee applies instead (typically 1.25%–3.3% of the loan amount, financed into the loan). For most eligible borrowers, even accounting for the funding fee, the lifetime cost of a VA loan is dramatically lower than a conventional loan with years of PMI. If you or your spouse qualifies, using VA benefits is almost always the right financial decision.
            </p>

            <h3>5. Make Extra Principal Payments</h3>
            <p>
              Extra payments directly accelerate your equity buildup, moving you toward the 80% LTV threshold faster. Even an additional $100–$200/month applied to principal can shave 1–3 years off your PMI period, depending on your loan size and interest rate. The amortization timeline in our calculator shows exactly when your balance crosses 80% — experiment with the inputs to see how different down payment amounts change that timeline.
            </p>
          </section>

          <section className="prose">
            <h2>How to Use This PMI Calculator</h2>
            <div className="step">
              <div className="step-n">1</div>
              <div className="step-body">
                <h4>Enter Your Home Price and Down Payment</h4>
                <p>Input the purchase price you&apos;re considering or have under contract. Toggle between entering a dollar amount or a percentage for your down payment. Try different amounts — moving from 5% to 10% down typically cuts your PMI rate by 30–40% and shortens the PMI period by several years.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-n">2</div>
              <div className="step-body">
                <h4>Select Your Loan Type and Credit Score</h4>
                <p>Choose conventional PMI, FHA MIP, or VA (no PMI). Your credit score is the second-biggest driver of your PMI rate after LTV — the difference between a 680 and a 760 FICO score at 90% LTV is about 0.31% annually, or over $1,000/year on a $350,000 loan.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-n">3</div>
              <div className="step-body">
                <h4>Add Property Tax and Insurance (Optional)</h4>
                <p>Adding annual property tax and homeowners insurance gives you the full PITI+PMI monthly payment — the number lenders use to calculate your debt-to-income ratio. Enter your gross annual income to also see your housing DTI.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-n">4</div>
              <div className="step-body">
                <h4>Review Your PMI Timeline</h4>
                <p>Click &quot;Show Balance &amp; PMI Timeline&quot; to see a bar chart of your loan balance over time. Red bars indicate months where PMI is active; green bars show when PMI has been cancelled. The goal is to shorten the red section as much as possible.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-n">5</div>
              <div className="step-body">
                <h4>Compare Scenarios</h4>
                <p>Run the calculator multiple times with different down payment percentages, credit score tiers, or loan types. Compare total PMI paid across scenarios. Sometimes putting an extra 2–3% down meaningfully changes the rate tier and total cost — other times, the difference is minimal and the cash is better kept in reserves.</p>
              </div>
            </div>

            <h3>Who This PMI Calculator Is For</h3>
            <div className="uc-grid" style={{ marginTop: 16 }}>
              {useCases.map((uc, i) => (
                <div className="uc" key={i}>
                  <div className="uc-icon text-forest">{uc.icon}</div>
                  <h4>{uc.title}</h4>
                  <p>{uc.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="prose">
            <h2>PMI and Your Debt-to-Income Ratio (DTI)</h2>
            <p>
              Lenders evaluate your mortgage affordability using your <strong>debt-to-income ratio</strong> — the percentage of your gross monthly income consumed by housing costs (PITI + PMI) plus all other monthly debt payments. Most conventional lenders cap the total DTI at 43–45%, while some allow up to 50% with compensating factors like excellent credit or large cash reserves.
            </p>
            <p>
              PMI directly inflates your DTI because it&apos;s included in your monthly housing payment. On a $400,000 loan at 95% LTV with a 720 credit score, PMI adds approximately $207/month. At a $90,000 gross annual income, that&apos;s the equivalent of 2.8% DTI — which could be the difference between qualifying and being declined, or between your preferred loan amount and a lower one.
            </p>
            <p>
              Enter your annual income in this calculator to see your exact housing DTI. If it exceeds 36%, consider whether a larger down payment (to lower PMI) or a less expensive home would put you in a more comfortable financial position.
            </p>
          </section>

          <section className="prose">
            <h2>Frequently Asked Questions About PMI</h2>
            <div className="faq-list">
              {faqs.map((f, i) => (
                <details key={i} className="faq-item group">
                  <summary className="faq-q font-medium text-forest cursor-pointer list-none flex justify-between items-center">
                    {f.question}
                    <ChevronDown className="w-4 h-4 opacity-50 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="faq-a">{f.answer}</div>
                </details>
              ))}
            </div>
          </section>

          <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath={PAGE_PATH} />

          <footer className="footer">
            <p>
              This PMI calculator uses 2026 market-average rate tables and is provided for informational purposes only.<br />
              Consult a licensed mortgage professional for a formal loan estimate.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
