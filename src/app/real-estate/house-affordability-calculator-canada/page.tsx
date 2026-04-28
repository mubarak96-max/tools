import type { Metadata } from "next";
import CanadaHouseAffordabilityCalculator from "@/components/CanadaHouseAffordabilityCalculator";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "House Affordability Calculator Canada (2026)",
  description:
    "Calculate how much home you can afford in Canada. Includes 2026 mortgage stress test, CMHC insurance, and land transfer tax for all provinces.",
  path: "/real-estate/house-affordability-calculator-canada",
});

export default function HouseAffordabilityCanadaPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "House Affordability Calculator Canada",
    "operatingSystem": "All",
    "applicationCategory": "FinanceApplication",
    "description": "Professional house affordability calculator for Canada. Includes GDS/TDS ratios, mortgage stress test, CMHC premiums, and land transfer taxes for all provinces.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "CAD"
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        :root {
          --bg:        #f5f3ef;
          --bg2:       #edeae3;
          --surface:   #fefcf9;
          --surface2:  #f5f3ef;
          --ink:       #0e1c2e;
          --ink2:      #2a3d54;
          --muted:     #7a8fa8;
          --muted2:    #5a7080;
          --border:    #d8d2c5;
          --border2:   #c4bbaa;
          --blue:      #0e4d8a;
          --blue2:     #1a6ab8;
          --blue3:     #4a9ad4;
          --blue-dim:  #e8f0f9;
          --blue-faint:rgba(14,77,138,0.06);
          --copper:    #b8621a;
          --copper2:   #d4820a;
          --copper-dim:#fdf3e8;
          --green:     #1a7a4a;
          --green2:    #2d9e6b;
          --green-dim: #e8f5ee;
          --red:       #c03a2b;
          --red-dim:   #fdf0ed;
          --font-d:    'Lora', Georgia, serif;
          --font-b:    'Geist', 'Helvetica Neue', sans-serif;
          --font-m:    'JetBrains Mono', monospace;
          --r:         12px;
          --shadow:    0 1px 6px rgba(14,28,46,0.08);
          --shadow-md: 0 6px 24px rgba(14,28,46,0.11);
        }

        .wrap { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; padding: 0 22px; }

        .hero { padding: 56px 0 44px; border-bottom: 2px solid var(--ink); }
        .hero-eyebrow { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
        .badge { display: inline-flex; align-items: center; background: var(--blue); color: #fff; font-size: 0.66rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 4px 11px; border-radius: 3px; font-family: var(--font-b); }
        .badge-outline { display: inline-flex; align-items: center; background: transparent; color: var(--copper); border: 1px solid var(--copper); font-size: 0.66rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 10px; border-radius: 3px; font-family: var(--font-b); }
        .hero h1 { font-family: var(--font-d); font-size: clamp(2.2rem, 5vw, 3.9rem); font-weight: 600; line-height: 1.08; color: var(--ink); max-width: 860px; margin-bottom: 14px; letter-spacing: -0.01em; }
        .hero h1 em { color: var(--blue2); font-style: italic; }
        .hero-sub { font-size: 0.97rem; color: var(--ink2); max-width: 600px; line-height: 1.75; margin-bottom: 28px; }
        .hero-stats { display: flex; gap: 0; flex-wrap: wrap; }
        .hstat { padding: 10px 24px; border-right: 1px solid var(--border2); display: flex; flex-direction: column; }
        .hstat:first-child { padding-left: 0; }
        .hstat:last-child  { border-right: none; }
        .hstat-num { font-family: var(--font-d); font-size: 1.6rem; color: var(--blue); line-height: 1; font-weight: 600; }
        .hstat-lbl { font-size: 0.7rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 2px; }

        .mode-toggle { display: inline-flex; border: 2px solid var(--ink); border-radius: 6px; overflow: hidden; margin-top: 20px; }
        .mode-btn { padding: 10px 22px; font-size: 0.82rem; font-weight: 700; border: none; background: transparent; color: var(--muted2); cursor: pointer; transition: all 0.15s; font-family: var(--font-b); letter-spacing: 0.03em; border-right: 1px solid var(--border); }
        .mode-btn:last-child { border-right: none; }
        .mode-btn.active { background: var(--ink); color: #fff; }

        .calc-grid { display: grid; grid-template-columns: 380px 1fr; gap: 24px; padding: 32px 0; align-items: start; }
        @media(max-width:960px){ .calc-grid { grid-template-columns: 1fr; } }

        .input-panel { background: var(--surface); border: 1.5px solid var(--border2); border-radius: var(--r); box-shadow: var(--shadow); position: sticky; top: 20px; overflow: hidden; }
        @media(max-width:960px){ .input-panel { position: static; } }
        .panel-header { background: var(--ink); padding: 16px 22px; display: flex; align-items: center; gap: 10px; }
        .panel-header-title { font-family: var(--font-d); font-size: 0.9rem; color: #fff; font-weight: 600; }
        .panel-header-sub { font-size: 0.7rem; color: rgba(255,255,255,0.45); margin-top: 1px; }
        .panel-body { padding: 20px 22px; }
        .section-label { font-size: 0.62rem; font-weight: 700; letter-spacing: 0.13em; text-transform: uppercase; color: var(--blue); margin: 16px 0 10px; display: flex; align-items: center; gap: 8px; font-family: var(--font-b); }
        .section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }
        .field { margin-bottom: 12px; }
        .field label { display: flex; justify-content: space-between; align-items: baseline; font-size: 0.72rem; font-weight: 600; color: var(--muted2); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 5px; }
        .field-hint { font-size: 0.68rem; color: var(--muted); font-weight: 400; text-transform: none; letter-spacing: 0; }
        .iw { display: flex; align-items: center; background: var(--bg); border: 1.5px solid var(--border2); border-radius: 7px; overflow: hidden; transition: border-color 0.15s; }
        .iw:focus-within { border-color: var(--blue); }
        .ipfx { padding: 0 10px; height: 36px; font-size: 0.82rem; color: var(--muted); background: var(--bg2); border-right: 1.5px solid var(--border2); display: flex; align-items: center; font-family: var(--font-m); min-width: 32px; justify-content: center; }
        .iw input, .iw select { flex: 1; border: none; background: transparent; padding: 0 10px; height: 36px; font-family: var(--font-m); font-size: 0.88rem; color: var(--ink); outline: none; }
        input[type=range] { -webkit-appearance: none; width: 100%; height: 3px; background: var(--border2); border-radius: 2px; outline: none; margin-top: 7px; cursor: pointer; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: var(--blue); cursor: pointer; border: 2px solid var(--surface); box-shadow: 0 0 0 1px var(--blue); }
        .toggle-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-top: 1px solid var(--border); font-size: 0.78rem; color: var(--ink2); font-weight: 500; }
        .toggle { position: relative; width: 36px; height: 20px; display: inline-block; cursor: pointer; }
        .toggle input { opacity: 0; width: 0; height: 0; }
        .t-track { position: absolute; inset: 0; background: var(--border2); border-radius: 20px; transition: background 0.2s; }
        .toggle input:checked + .t-track { background: var(--blue); }
        .t-thumb { position: absolute; top: 3px; left: 3px; width: 14px; height: 14px; background: #fff; border-radius: 50%; transition: transform 0.2s; }
        .toggle input:checked ~ .t-thumb { transform: translateX(16px); }

        .result-panel { display: flex; flex-direction: column; gap: 18px; }
        .gauge-card { background: var(--surface); border: 1.5px solid var(--border2); border-radius: var(--r); box-shadow: var(--shadow-md); padding: 28px; display: grid; grid-template-columns: 200px 1fr; gap: 24px; align-items: center; }
        @media(max-width:640px){ .gauge-card { grid-template-columns: 1fr; text-align: center; } }
        .gauge-wrap { position: relative; width: 180px; height: 100px; }
        @media(max-width:640px){ .gauge-wrap { margin: 0 auto; } }
        .gauge-score { font-family: var(--font-d); font-size: 2.4rem; font-weight: 600; line-height: 1; }
        .gauge-label { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); text-align: center; }
        .gauge-sublabel { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin-top: 2px; }
        .verdict { font-family: var(--font-d); font-size: 1.55rem; font-weight: 600; line-height: 1.2; color: var(--ink); }
        .verdict-sub { font-size: 0.84rem; color: var(--ink2); line-height: 1.6; margin-top: 4px; }
        .ratio-bar-group { display: flex; flex-direction: column; gap: 8px; }
        .ratio-item { display: flex; flex-direction: column; gap: 4px; }
        .ratio-top { display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 600; }
        .ratio-name { color: var(--muted2); text-transform: uppercase; letter-spacing: 0.06em; }
        .ratio-track { height: 7px; background: var(--bg2); border-radius: 4px; overflow: visible; position: relative; }
        .ratio-fill { height: 100%; border-radius: 4px; transition: width 0.6s cubic-bezier(0.4,0,0.2,1); }

        .metrics-card { background: var(--surface); border: 1.5px solid var(--border2); border-radius: var(--r); box-shadow: var(--shadow); padding: 22px; }
        .card-title { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 8px; }
        .card-title-text { font-family: var(--font-d); font-size: 0.95rem; font-weight: 600; color: var(--ink); }
        .tabs { display: flex; gap: 3px; background: var(--bg2); border: 1.5px solid var(--border2); padding: 3px; border-radius: 7px; }
        .tab { flex: 1; padding: 6px 10px; font-size: 0.7rem; font-weight: 700; border: none; border-radius: 5px; background: transparent; color: var(--muted); cursor: pointer; transition: all 0.12s; text-align: center; font-family: var(--font-b); text-transform: uppercase; letter-spacing: 0.05em; }
        .tab.active { background: var(--surface); color: var(--blue); box-shadow: var(--shadow); border: 1px solid var(--border2); }
        .metrics-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
        @media(max-width:640px){ .metrics-grid { grid-template-columns: 1fr 1fr; } }
        .metric { background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 12px 14px; }
        .metric.hero-m { background: var(--ink); border-color: var(--ink); grid-column: span 3; }
        @media(max-width:640px){ .metric.hero-m { grid-column: span 2; } }
        .m-lbl { font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.09em; font-weight: 700; color: var(--muted); margin-bottom: 5px; }
        .metric.hero-m .m-lbl { color: rgba(255,255,255,0.4); }
        .m-val { font-family: var(--font-d); font-size: 1.45rem; color: var(--ink); line-height: 1; font-weight: 600; }
        .metric.hero-m .m-val { font-size: 2.2rem; color: #fff; }
        .cost-row { display: flex; justify-content: space-between; align-items: center; padding: 9px 0; border-bottom: 1px solid var(--border); font-size: 0.84rem; }
        .cost-row.total { border-top: 2px solid var(--ink); margin-top: 4px; padding-top: 10px; font-weight: 700; }

        .csection { padding: 52px 0; border-top: 1px solid var(--border2); }
        .sec-badge { display: inline-block; background: var(--blue-dim); color: var(--blue); border: 1px solid rgba(14,77,138,0.2); font-size: 0.62rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; padding: 3px 10px; border-radius: 3px; margin-bottom: 10px; font-family: var(--font-b); }
        .sec-title { font-family: var(--font-d); font-size: clamp(1.6rem, 3.5vw, 2.4rem); font-weight: 600; color: var(--ink); line-height: 1.18; margin-bottom: 10px; }
        .sec-title em { color: var(--blue2); font-style: italic; }
        .sec-lead { font-size: 0.94rem; color: var(--ink2); line-height: 1.8; max-width: 700px; margin-bottom: 26px; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
        @media(max-width:760px){ .two-col { grid-template-columns: 1fr; } }
        .cbody { font-size: 0.92rem; color: var(--ink2); line-height: 1.82; }
        .cbody p { margin-bottom: 14px; }
        .cbody h3 { font-family: var(--font-d); font-size: 1.15rem; font-weight: 600; color: var(--ink); margin: 24px 0 9px; font-style: italic; }
        .pill { display: inline-block; background: var(--blue-dim); color: var(--blue); font-family: var(--font-m); font-size: 0.78rem; padding: 1px 8px; border-radius: 4px; border: 1px solid rgba(14,77,138,0.2); }
        .tbl-wrap { overflow-x: auto; border: 1px solid var(--border2); border-radius: 10px; margin-top: 16px; }
        table { width: 100%; border-collapse: collapse; font-size: 0.84rem; }
        thead { background: var(--ink); }
        thead th { padding: 10px 14px; text-align: left; color: #fff; font-size: 0.67rem; text-transform: uppercase; letter-spacing: 0.09em; font-weight: 700; }
        tbody tr { border-top: 1px solid var(--border); }
        tbody td { padding: 10px 14px; color: var(--ink2); }
        .td-blue { color: var(--blue) !important; font-weight: 700 !important; }
        .td-green { color: var(--green) !important; font-weight: 600 !important; }
        .td-copper { color: var(--copper) !important; font-weight: 600 !important; }
        .td-red { color: var(--red) !important; font-weight: 600 !important; }
        .three-col { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
        @media(max-width:760px){ .three-col { grid-template-columns: 1fr 1fr; } }
        @media(max-width:480px){ .three-col { grid-template-columns: 1fr; } }
        .icard { background: var(--surface); border: 1.5px solid var(--border); border-radius: 10px; padding: 20px; transition: all 0.2s; }
        .icard:hover { border-color: var(--blue); transform: translateY(-2px); }
        .icard-icon { font-size: 1.3rem; margin-bottom: 10px; display: block; }
        .icard h4 { font-family: var(--font-d); font-size: 1rem; color: var(--blue2); margin-bottom: 7px; font-style: italic; font-weight: 600; }
        .icard p { font-size: 0.82rem; color: var(--ink2); line-height: 1.65; }
        .faq-item { border-bottom: 1.5px solid var(--border); padding: 18px 0; }
        .faq-q { font-family: var(--font-d); font-size: 1.02rem; color: var(--ink); margin-bottom: 8px; font-style: italic; font-weight: 600; }
        .faq-a { font-size: 0.86rem; color: var(--ink2); line-height: 1.78; }
        .cta-box { background: var(--ink); border-radius: var(--r); padding: 44px 36px; text-align: center; margin: 36px 0 56px; }
        .cta-box h2 { font-family: var(--font-d); font-size: 2rem; color: #fff; margin-bottom: 10px; font-weight: 600; }
        .cta-box h2 em { color: var(--blue3); font-style: italic; }
        .cta-btn { display: inline-flex; align-items: center; gap: 6px; padding: 11px 28px; border-radius: 7px; background: var(--blue); color: #fff; font-weight: 700; font-size: 0.87rem; border: none; cursor: pointer; transition: all 0.15s; text-decoration: none; }
        .footer { border-top: 1px solid var(--border2); padding: 24px 0; text-align: center; font-size: 0.74rem; color: var(--muted); }
        .footer a { color: var(--muted2); text-decoration: none; }
      `}</style>

      <div className="wrap">
        <header className="hero">
          <div className="hero-eyebrow">
            <span className="badge">🍁 Canada · 2026</span>
            <span className="badge-outline">Updated for 2026 Stress Test Rules</span>
          </div>
          <h1>House Affordability<br /><em>Calculator Canada</em></h1>
          <p className="hero-sub">
            Calculate how much home you can afford in Canada — using the official GDS and TDS ratios, 2026 mortgage stress test, CMHC insurance, and land transfer tax for every province.
          </p>
          <div className="hero-stats">
            {[
              { num: "39%",   label: "Max GDS ratio" },
              { num: "44%",   label: "Max TDS ratio" },
              { num: "5.25%", label: "Min stress test rate" },
              { num: "4.00%", label: "Max CMHC premium" },
            ].map(s => (
              <div className="hstat" key={s.label}>
                <span className="hstat-num">{s.num}</span>
                <span className="hstat-lbl">{s.label}</span>
              </div>
            ))}
          </div>
        </header>

        <CanadaHouseAffordabilityCalculator />

        {/* ── CONTENT SECTIONS ── */}
        <section className="csection" id="how-it-works">
          <div className="sec-badge">How It Works</div>
          <h2 className="sec-title">How Canadian Lenders Calculate <em>Home Affordability</em></h2>
          <p className="sec-lead">
            Canadian mortgage lenders use two debt-service ratios — GDS and TDS — to determine how much house you can afford.
          </p>
          <div className="two-col">
            <div className="cbody">
              <h3>The GDS Ratio — Gross Debt Service</h3>
              <p>The <strong>GDS ratio</strong> measures the percentage of your gross monthly income that goes toward housing costs. The maximum allowed is <span className="pill">39%</span>.</p>
              <h3>The TDS Ratio — Total Debt Service</h3>
              <p>The <strong>TDS ratio</strong> adds all other monthly debt obligations to your housing costs. The maximum allowed is <span className="pill">44%</span>.</p>
            </div>
            <div className="cbody">
              <h3>The Mortgage Stress Test Canada 2026</h3>
              <p>The qualifying rate is the greater of: <span className="pill">Your contract rate + 2%</span> or <span className="pill">5.25%</span>.</p>
            </div>
          </div>
        </section>

        <section className="csection" id="down-payment">
          <div className="sec-badge">Down Payment & CMHC</div>
          <h2 className="sec-title">Minimum Down Payment & <em>CMHC Mortgage Insurance</em></h2>
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>Home Price</th><th>Min. Down</th><th>CMHC Required?</th></tr></thead>
              <tbody>
                <tr><td>$400,000</td><td className="td-blue">5.0%</td><td className="td-copper">Yes</td></tr>
                <tr><td>$800,000</td><td className="td-blue">7.5%</td><td className="td-copper">Yes</td></tr>
                <tr><td>$1,000,000+</td><td className="td-blue">20.0%</td><td className="td-green">No</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="csection" id="faq">
          <div className="sec-badge">FAQ</div>
          <h2 className="sec-title">Frequently Asked <em>Questions</em></h2>
          <div style={{ maxWidth: 840 }}>
            {[
              { q: "How much house can I afford on a $100,000 salary?", a: "Typically $440k–$520k depending on debts and interest rates." },
              { q: "What is the mortgage stress test for 2026?", a: "Qualifying at your rate + 2% or 5.25%, whichever is higher." }
            ].map(item => (
              <div key={item.q} className="faq-item">
                <p className="faq-q">{item.q}</p>
                <p className="faq-a">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="csection">
          <div className="sec-badge">Related</div>
          <h2 className="sec-title">Related <em>Calculators</em></h2>
          <div className="three-col">
            {[
              { name: "Mortgage Qualifier Canada", href: "/real-estate/mortgage-qualifier-canada", desc: "Professional GDS/TDS mortgage qualification with the 2024 stress test." },
              { name: "Canada Income Tax Calculator", href: "/finance/canada-income-tax-calculator", desc: "Calculate your take-home pay to see how much you can afford for a mortgage." },
              { name: "Rent vs Buy Calculator", href: "/real-estate/rent-vs-buy-calculator", desc: "Compare the long-term costs of renting versus buying." },
            ].map(t => (
              <a key={t.href} href={t.href} style={{ textDecoration: "none" }}>
                <div className="icard"><h4>{t.name}</h4><p>{t.desc}</p></div>
              </a>
            ))}
          </div>
        </section>

        <div className="cta-box">
          <h2>Find Out <em>How Much House You Can Afford</em></h2>
          <p>Enter your details above to get an instant estimate.</p>
          <a href="#calculator" className="cta-btn">Calculate Now ↑</a>
        </div>

        <footer className="footer">
          <p>House Affordability Calculator Canada 2026 · Based on OSFI/CMHC guidelines · Not financial advice</p>
        </footer>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </div>
    </>
  );
}
