import type { Metadata } from "next";
import MortgageQualifier from "@/components/MortgageQualifier";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Canadian Mortgage Qualifier Calculator 2026 — Stress Test, CMHC, GDS/TDS",
  description:
    "Find out exactly how much mortgage you qualify for in Canada. Includes 2026 mortgage stress test (contract rate +2%, min 5.25%), CMHC insurance premiums, GDS/TDS ratios, and land transfer tax by province. Free, no login.",
  path: "/real-estate/mortgage-qualifier-canada",
});

const icons = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  refresh: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }}>
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/>
    </svg>
  ),
  investor: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }}>
      <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M14.32 7a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  construction: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }}>
      <rect x="2" y="14" width="20" height="8" rx="2"/><rect x="6" y="4" width="12" height="10" rx="2"/><path d="M12 2v2"/>
    </svg>
  ),
};

const useCases = [
  { icon: icons.home, title: "First-Time Home Buyers", desc: "Understand exactly what you qualify for before talking to a realtor. Know your numbers — and your land transfer tax rebate — before you start shopping." },
  { icon: icons.refresh, title: "Renewers Stress-Testing Rates", desc: "Your renewal is coming and rates are higher. Run your numbers at today's rate to see how your affordability has changed and whether you need to adjust your purchase price expectations." },
  { icon: icons.investor, title: "Real Estate Investors", desc: "Model rental income scenarios. Add rental income to the co-applicant field and see how it affects qualification for your next investment property." },
  { icon: icons.users, title: "Couples Combining Incomes", desc: "See the exact dollar impact of combining incomes. Run it solo, then add your partner's income to see the qualification gap you bridge together." },
  { icon: icons.construction, title: "Pre-Construction Buyers", desc: "Pre-con closings are 2–4 years out. Stress-test your qualification at a higher rate to ensure you'll still qualify when the unit is ready to close." },
];

export default function MortgageQualifierPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Canadian Mortgage Qualifier Calculator",
    "operatingSystem": "All",
    "applicationCategory": "FinanceApplication",
    "description": "Professional mortgage qualification calculator for Canada. Includes GDS/TDS ratios, mortgage stress test, CMHC premiums, and land transfer taxes for all provinces.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "CAD"
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;800&family=Outfit:wght@400;500;600&display=swap');

        .page-container {
          font-family: 'Outfit', sans-serif;
          background: #f8fafc;
          color: #1e293b;
          line-height: 1.6;
          font-size: 16px;
          --maple: #e8472a;
          --danger: #ef4444;
          --green: #10b981;
          --gold: #f5c842;
        }

        .wrap { max-width: 1080px; margin: 0 auto; padding: 0 20px 80px; }

        /* ── Hero ── */
        .hero { padding: 80px 0 40px; position: relative; overflow: hidden; }
        .hero::before {
          content: '🍁';
          position: absolute; top: 10px; right: -20px;
          font-size: 200px; opacity: .03; line-height: 1;
          pointer-events: none; user-select: none;
        }
        .badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: #fee2e2; border: 1px solid #fecaca;
          color: #b91c1c; font-size: 12px; font-weight: 700;
          letter-spacing: .08em; text-transform: uppercase;
          padding: 6px 14px; border-radius: 100px; margin-bottom: 20px;
        }
        h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.2rem, 6vw, 3.8rem);
          font-weight: 800; line-height: 1.1;
          color: #0f172a; margin-bottom: 20px;
          max-width: 800px;
        }
        h1 em { font-style: italic; color: #e8472a; }
        .hero-sub { font-size: clamp(17px, 2vw, 19px); color: #475569; max-width: 600px; margin-bottom: 24px; }
        .hero-pills { display: flex; flex-wrap: wrap; gap: 10px; }
        .pill {
          background: #fff; border: 1px solid #e2e8f0;
          border-radius: 100px; padding: 6px 16px;
          font-size: 13px; color: #64748b; font-weight: 500;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .pill strong { color: #0f172a; font-weight: 700; }

        /* ── Calculator Layout ── */
        .calc-shell { 
          display: grid; 
          grid-template-columns: 380px 1fr; 
          gap: 24px; 
          margin-bottom: 80px;
          align-items: start;
        }
        @media (max-width: 920px) { 
          .calc-shell { grid-template-columns: 1fr; } 
          .wrap { padding: 0 16px 60px; }
          .hero { padding: 40px 0 32px; }
        }

        .inputs { 
          background: #fff; 
          border: 1px solid #e2e8f0; 
          border-radius: 20px; 
          padding: 32px 24px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03);
        }
        .panel-title { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 700; color: #0f172a; margin-bottom: 24px; display: flex; align-items: center; gap: 10px; }
        .panel-title::before { content: ''; display: block; width: 10px; height: 10px; background: #e8472a; border-radius: 50%; }
        
        .section-sep { 
          font-size: 11px; font-weight: 800; letter-spacing: .1em; 
          text-transform: uppercase; color: #94a3b8; 
          margin: 24px 0 12px; padding-bottom: 8px; 
          border-bottom: 1px solid #f1f5f9; 
        }
        
        .field { margin-bottom: 18px; }
        .field label { display: block; font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 4px; }
        .hint { display: block; font-size: 11px; color: #64748b; margin-bottom: 6px; line-height: 1.4; }
        
        .input-row { 
          display: flex; align-items: center; 
          background: #f8fafc; border: 1.5px solid #e2e8f0; 
          border-radius: 12px; overflow: hidden; 
          transition: all .2s;
        }
        .input-row:focus-within { border-color: #e8472a; background: #fff; box-shadow: 0 0 0 4px rgba(232,71,42,0.1); }
        
        .adorn { 
          padding: 0 12px; font-size: 14px; color: #64748b; 
          background: #f1f5f9; border-right: 1.5px solid #e2e8f0; 
          height: 42px; display: flex; align-items: center; 
          font-weight: 600; 
        }
        .adorn.right { border-right: none; border-left: 1.5px solid #e2e8f0; }
        
        .input-row input { 
          flex: 1; border: none; outline: none; 
          padding: 0 14px; height: 42px; 
          font-size: 15px; color: #0f172a; 
          background: transparent; 
          font-weight: 500;
        }
        
        .field-row { display: flex; gap: 12px; }
        @media (max-width: 420px) { .field-row { flex-direction: column; gap: 18px; } }

        select { 
          width: 100%; height: 44px; 
          background: #f8fafc; border: 1.5px solid #e2e8f0; 
          border-radius: 12px; color: #0f172a; 
          font-size: 15px; padding: 0 12px; 
          font-family: inherit; font-weight: 500;
        }

        .results { display: flex; flex-direction: column; gap: 16px; }
        
        .qualify-hero { 
          background: #fff; border: 1px solid #e2e8f0; 
          border-radius: 20px; padding: 40px 32px; 
          text-align: center; 
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
        }
        .qualify-hero.pass { border-top: 5px solid #10b981; }
        .qualify-hero.fail { border-top: 5px solid #ef4444; }
        
        .qualify-badge { 
          display: inline-flex; align-items: center; gap: 8px; 
          border-radius: 100px; padding: 6px 18px; 
          font-size: 13px; font-weight: 800; 
          text-transform: uppercase; margin-bottom: 20px; 
        }
        .qualify-badge.pass { background: #dcfce7; color: #15803d; }
        .qualify-badge.fail { background: #fee2e2; color: #b91c1c; }
        
        .qualify-price { 
          font-family: 'Playfair Display', serif; 
          font-size: clamp(2.4rem, 5vw, 3.2rem); 
          font-weight: 800; color: #0f172a; 
          line-height: 1;
        }
        .qualify-sub { font-size: 14px; color: #64748b; margin-top: 8px; font-weight: 500; }
        
        .stress-badge { 
          display: inline-flex; align-items: center; justify-content: center; gap: 8px; 
          background: #fffbeb; border: 1px solid #fde68a; 
          border-radius: 12px; padding: 12px 16px; 
          font-size: 14px; color: #92400e; margin-top: 16px; 
          width: 100%; font-weight: 500;
        }

        .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
        .stat { 
          background: #fff; border: 1px solid #e2e8f0; 
          border-radius: 16px; padding: 20px; 
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .stat .s-label { font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 6px; }
        .stat .s-val { font-size: 1.4rem; font-weight: 700; color: #0f172a; }
        .stat.maple-card { background: #fff1f2; border-color: #fecaca; }
        .stat.maple-card .s-val { color: #e8472a; }

        .gauges-card { 
          background: #fff; border: 1px solid #e2e8f0; 
          border-radius: 20px; padding: 24px; 
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .gauge-wrap { margin-bottom: 20px; }
        .gauge-wrap:last-child { margin-bottom: 0; }
        .gauge-top { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .gauge-label { font-size: 14px; font-weight: 700; color: #334155; }
        .gauge-val { font-size: 14px; font-weight: 800; }
        .gauge-val.green { color: #10b981; }
        .gauge-val.red { color: #ef4444; }
        
        .gauge-track { height: 10px; background: #f1f5f9; border-radius: 100px; position: relative; }
        .gauge-fill { height: 100%; border-radius: 100px; transition: width 0.6s ease; }
        .gauge-limit { position: absolute; top: -4px; width: 3px; height: 18px; background: #94a3b8; border-radius: 2px; z-index: 2; }
        .gauge-bottom { display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8; margin-top: 6px; font-weight: 600; }

        .cmhc-card { 
          background: #fff; border: 1px solid #e2e8f0; 
          border-radius: 20px; padding: 24px; 
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .cmhc-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
        .cmhc-row:last-child { border-bottom: none; }
        .cmhc-label { font-size: 14px; color: #64748b; font-weight: 500; }
        .cmhc-val { font-size: 14px; font-weight: 700; color: #0f172a; }
        .cmhc-val.highlight { color: #e8472a; font-size: 16px; }

        .faq-item { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 12px; }
        .faq-q { 
          width: 100%; text-align: left; padding: 18px 24px; 
          font-size: 15px; font-weight: 700; color: #0f172a; 
          background: none; border: none; cursor: pointer; 
          display: flex; justify-content: space-between; align-items: center;
          transition: background 0.2s;
        }
        .faq-q:hover { background: #f8fafc; }
        .faq-a { font-size: 14.5px; color: #475569; line-height: 1.7; padding: 0 24px 20px; }

        /* ── Prose ── */
        .prose { margin-bottom: 80px; }
        .prose h2 { font-family: 'Playfair Display', serif; font-size: clamp(1.8rem, 4vw, 2.4rem); font-weight: 800; color: #0f172a; margin-bottom: 20px; }
        .prose h3 { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 700; color: #0f172a; margin: 32px 0 12px; }
        .prose p { color: #475569; margin-bottom: 18px; font-size: 16px; }
        .prose ul { margin: 0 0 20px 24px; color: #475569; }
        .prose ul li { margin-bottom: 8px; font-size: 15.5px; }
        .prose strong { color: #0f172a; font-weight: 700; }

        .info-box { 
          background: #f1f5f9; border-left: 4px solid #e8472a; 
          border-radius: 12px; padding: 24px; 
          margin: 32px 0; font-size: 15.5px; color: #334155; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        
        .data-table-wrap { overflow-x: auto; margin: 24px 0; border-radius: 12px; border: 1px solid #e2e8f0; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 14.5px; min-width: 500px; }
        .data-table th { background: #f8fafc; color: #475569; padding: 14px 16px; text-align: left; font-weight: 700; border-bottom: 1px solid #e2e8f0; }
        .data-table td { padding: 14px 16px; border-bottom: 1px solid #f1f5f9; color: #475569; }
        .data-table tr:last-child td { border-bottom: none; }

        .steps { display: flex; flex-direction: column; gap: 16px; }
        .step { display: flex; gap: 20px; background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .step-n { width: 36px; height: 36px; border-radius: 50%; background: #e8472a; color: #fff; font-size: 16px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .step-body h4 { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
        .step-body p { font-size: 14px; color: #64748b; margin: 0; }

        .use-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
        .uc { background: #fff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 28px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); transition: transform 0.2s; }
        .uc:hover { transform: translateY(-4px); }
        .uc-icon { font-size: 2.4rem; margin-bottom: 16px; }
        .uc h4 { font-family: 'Playfair Display', serif; font-size: 1.15rem; color: #0f172a; font-weight: 700; margin-bottom: 10px; }
        .uc p { font-size: 14px; color: #64748b; line-height: 1.6; }

        .footer { text-align: center; font-size: 13px; color: #94a3b8; padding: 48px 0 32px; border-top: 1px solid #e2e8f0; }
        
        @media (max-width: 640px) {
          h1 { font-size: 1.8rem; }
          .qualify-price { font-size: 2.2rem; }
          .stat-grid { grid-template-columns: 1fr; }
          .panel-title { font-size: 1.1rem; }
          .info-box { padding: 16px; }
        }
      `}</style>

      <div className="page-container">
        <div className="wrap">
          {/* Hero */}
          <header className="hero">
            <div className="badge">🍁 Canada · 2026 Rules · Stress Test Included</div>
            <h1>How Much Mortgage Can You <em>Actually</em> Qualify For in Canada?</h1>
            <p className="hero-sub">
              The most complete Canadian mortgage qualifier — stress test, CMHC, GDS/TDS ratios, and land transfer tax by province.
            </p>
            <div className="hero-pills">
              <div className="pill"><strong>2026</strong> Stress Test: 5.25% floor</div>
              <div className="pill"><strong>GDS</strong> ≤ 39% | <strong>TDS</strong> ≤ 44%</div>
              <div className="pill"><strong>CMHC</strong> auto-calculated</div>
              <div className="pill">All <strong>provinces</strong> supported</div>
            </div>
          </header>

          <MortgageQualifier />

          {/* ── Use Cases ── */}
          <section className="prose">
            <h2>Who This Calculator Is For</h2>
            <div className="use-grid">
              {useCases.map((uc, i) => (
                <div className="uc" key={i}>
                  <div className="uc-icon">{uc.icon}</div>
                  <h4>{uc.title}</h4>
                  <p>{uc.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Qualification Deep Dive ── */}
          <section className="prose">
            <h2>How Canadian Mortgage Qualification Works</h2>
            <p>
              Qualifying for a mortgage in Canada involves more than just having a good credit score. Canadian lenders — and the federal stress test — require your debt service ratios to stay within strict limits, your down payment to meet minimums based on purchase price, and your numbers to survive a rate increase you may never actually experience. Here&apos;s how it all works.
            </p>
            <h3>The Two Ratios That Determine Everything</h3>
            <p>
              Every federally regulated lender in Canada uses two ratios to assess your affordability:
            </p>
            <ul>
              <li><strong>Gross Debt Service (GDS) Ratio:</strong> The percentage of your gross monthly income used to cover housing costs — mortgage payment (stress-tested), property taxes, heating, and 50% of condo fees. Must be ≤ 39%.</li>
              <li><strong>Total Debt Service (TDS) Ratio:</strong> GDS plus all other monthly debt obligations (car payments, student loans, credit card minimums, lines of credit). Must be ≤ 44%.</li>
            </ul>
            <p>
              Both ratios are calculated using the <strong>stress-tested rate</strong>, not your actual contract rate. This means even if you lock in at 5.49%, the bank qualifies you as if you were paying 7.49% (or 5.25% at minimum). Our calculator runs both.
            </p>

            <div className="info-box">
              💡 <strong>Tip:</strong> The most common reason Canadians are declined isn&apos;t credit score — it&apos;s a TDS ratio over 44% caused by car loans and credit card debt. Paying down consumer debt before applying for a mortgage can dramatically increase your qualifying amount.
            </div>
          </section>

          {/* ── Stress Test ── */}
          <section className="prose">
            <h2>The Canadian Mortgage Stress Test Explained</h2>
            <p>
              Introduced by OSFI (the Office of the Superintendent of Financial Institutions), the mortgage stress test requires lenders to qualify borrowers at <strong>the higher of: their contract rate + 2%, or 5.25%</strong>.
            </p>
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr><th>Contract Rate</th><th>Stress Test Rate</th><th>Impact on Qualification</th></tr>
                </thead>
                <tbody>
                  <tr><td>3.00%</td><td>5.25% (floor)</td><td>Qualifies for significantly less than contract rate suggests</td></tr>
                  <tr><td>4.00%</td><td>6.00%</td><td>Monthly payment at qual rate ~20% higher than actual</td></tr>
                  <tr><td>5.49%</td><td>7.49%</td><td>Monthly payment at qual rate ~15% higher than actual</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ── CMHC ── */}
          <section className="prose">
            <h2>CMHC Mortgage Insurance: What You Need to Know</h2>
            <p>
              Mortgage default insurance — commonly called CMHC insurance after its largest provider — is mandatory when your down payment is less than 20% of the purchase price. The premium is calculated as a percentage of your insured mortgage amount and added directly to your mortgage balance.
            </p>
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr><th>Down Payment</th><th>LTV Ratio</th><th>CMHC Premium (% of mortgage)</th></tr>
                </thead>
                <tbody>
                  <tr><td>5% – 9.99%</td><td>90.01% – 95%</td><td>4.00%</td></tr>
                  <tr><td>10% – 14.99%</td><td>85.01% – 90%</td><td>3.10%</td></tr>
                  <tr><td>15% – 19.99%</td><td>80.01% – 85%</td><td>2.80%</td></tr>
                  <tr><td>20%+</td><td>≤ 80%</td><td>No insurance required</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Down Payment Rules ── */}
          <section className="prose">
            <h2>Canada Minimum Down Payment Rules (2026)</h2>
            <p>The minimum down payment in Canada is tiered based on the purchase price of the home:</p>
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr><th>Purchase Price</th><th>Minimum Down Payment</th><th>CMHC Required?</th></tr>
                </thead>
                <tbody>
                  <tr><td>Under $500,000</td><td>5% of purchase price</td><td>Yes</td></tr>
                  <tr><td>$500,000 – $999,999</td><td>5% on first $500K + 10% on remainder</td><td>Yes</td></tr>
                  <tr><td>$1,000,000+</td><td>20% minimum</td><td>No (ineligible)</td></tr>
                </tbody>
              </table>
            </div>
            <p>
              For example, on an $800,000 home: the minimum down payment is $25,000 (5% of $500,000) + $30,000 (10% of $300,000) = <strong>$55,000</strong>.
            </p>
          </section>

          {/* ── How to Use ── */}
          <section className="prose">
            <h2>How to Use This Mortgage Qualifier</h2>
            <div className="steps">
              <div className="step">
                <div className="step-n">1</div>
                <div className="step-body">
                  <h4>Enter Your Gross Annual Income</h4>
                  <p>Use your pre-tax income. Lenders accept employment income, self-employment income (2-year average), rental income (typically 50–80%), pension, and some investment income.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-n">2</div>
                <div className="step-body">
                  <h4>Add Co-Applicant Income (if applicable)</h4>
                  <p>Adding a spouse or partner combines your qualifying income, often the single biggest lever to increase your maximum mortgage.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-n">3</div>
                <div className="step-body">
                  <h4>Enter Your Down Payment Savings</h4>
                  <p>Include all sources: RRSP Home Buyers&apos; Plan (up to $35,000 per applicant), FHSA funds, gifted down payments from immediate family, and personal savings.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-n">4</div>
                <div className="step-body">
                  <h4>List All Monthly Debt Obligations</h4>
                  <p>Include minimum credit card payments, car loan payments, student loan payments, personal line of credit minimums, and any spousal/child support obligations.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-n">5</div>
                <div className="step-body">
                  <h4>Set Your Rate and Amortization</h4>
                  <p>Use a current rate quote from your bank or broker. Remember: lenders will qualify you at rate + 2%. Try 5-year fixed vs. variable to compare scenarios.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-n">6</div>
                <div className="step-body">
                  <h4>Enter Housing Costs and Select Province</h4>
                  <p>Property taxes vary widely by municipality. CMHC uses $150/month for heating. Condo fees use 50% in GDS calculations. Province determines land transfer tax.</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── Related Tools ── */}
          <section className="prose" style={{ borderTop: "1px solid #e2e8f0", paddingTop: 48 }}>
            <h2 style={{ fontSize: "1.5rem" }}>Related <em>Calculators</em></h2>
            <div className="use-grid">
              {[
                { name: "House Affordability Canada", href: "/real-estate/house-affordability-calculator-canada", desc: "Calculate exactly how much home you can afford in Canada." },
                { name: "Canada Income Tax Calculator", href: "/finance/canada-income-tax-calculator", desc: "Calculate your take-home pay and tax brackets for 2026." },
                { name: "Rent vs Buy Calculator", href: "/real-estate/rent-vs-buy-calculator", desc: "Compare the long-term cost of renting versus buying a home." },
              ].map((t, i) => (
                <a key={i} href={t.href} style={{ textDecoration: "none" }}>
                  <div className="uc" style={{ height: "100%" }}>
                    <h4 style={{ color: "#e8472a", marginBottom: 8 }}>{t.name}</h4>
                    <p style={{ fontSize: "13px" }}>{t.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>

          <footer className="footer">
            <p>
              This calculator provides estimates for educational purposes only and does not constitute financial, mortgage, or legal advice.<br />
              Actual qualification depends on credit score, employment history, property type, lender-specific policies, and other factors.<br />
              Data reflects 2026 OSFI guidelines and CMHC premium rates.
            </p>
          </footer>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
