export function CanadaTaxStyles() {
  return (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Epilogue:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=JetBrains+Mono:wght@400;500&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap');

        /* removed global reset */

        :root {
          --bg:       #f8f7f5;
          --bg2:      #f0eeea;
          --surface:  #ffffff;
          --ink:      #0d1117;
          --ink2:     #374151;
          --muted:    #9ca3af;
          --border:   #e5e2dc;
          --border2:  #d1cdc6;
          --red:      #c0392b;
          --red2:     #e74c3c;
          --red-dim:  #fdf2f1;
          --orange:   #e67e22;
          --teal:     #0d9488;
          --green:    #059669;
          --blue:     #2563eb;
          --font-d:   'Clash Display', 'Epilogue', sans-serif;
          --font-b:   'Epilogue', sans-serif;
          --font-m:   'JetBrains Mono', monospace;
          --r:        12px;
          --shadow:   0 1px 4px rgba(13,17,23,0.07);
          --shadow-md:0 4px 20px rgba(13,17,23,0.10);
        }

        /* removed html reset */
        .canada-tax-container {
          font-family: var(--font-b);
          background: var(--bg);
          color: var(--ink);
          -webkit-font-smoothing: antialiased;
          line-height: 1.6;
          font-size: 15px;
        }

        /* subtle grid texture */
        .canada-tax-container::before {
          content: '';
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(13,17,23,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(13,17,23,0.025) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .wrap { position: relative; z-index: 1; max-width: 1180px; margin: 0 auto; padding: 0 24px; }

        /* ── Hero ── */
        .hero {
          padding: 100px 0 44px;
          border-bottom: 2px solid var(--ink);
        }
        .hero-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; flex-wrap: wrap; margin-bottom: 28px; }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--red); color: #fff;
          font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; padding: 4px 12px; border-radius: 3px;
          margin-bottom: 14px; font-family: var(--font-b);
        }
        .hero h1 {
          font-family: var(--font-d);
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          font-weight: 700; line-height: 1.05;
          color: var(--ink); letter-spacing: -0.02em;
        }
        .hero h1 em { color: var(--red); font-style: normal; }
        .hero-sub {
          font-size: 1rem; color: var(--ink2);
          max-width: 560px; line-height: 1.7; margin-top: 12px;
        }
        .hero-year {
          font-family: var(--font-d); font-size: 5rem; font-weight: 700;
          color: var(--border); line-height: 1; letter-spacing: -0.04em;
          user-select: none;
        }
        @media(max-width:600px){ .hero-year { display: none; } }

        /* province quick-select pills */
        .province-pills { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 20px; }
        .province-pill {
          padding: 5px 12px; border-radius: 3px;
          font-size: 0.76rem; font-weight: 700;
          border: 1.5px solid var(--border2);
          background: transparent; color: var(--ink2);
          cursor: pointer; transition: all 0.12s;
          font-family: var(--font-b); letter-spacing: 0.04em;
        }
        .province-pill.active {
          background: var(--ink); color: #fff; border-color: var(--ink);
        }
        .province-pill:hover:not(.active) { border-color: var(--red); color: var(--red); }

        /* ── Calculator section ── */
        .calc-section { padding: 40px 0; }
        .calc-grid { display: grid; grid-template-columns: 360px 1fr; gap: 24px; align-items: start; }
        @media(max-width:920px){ .calc-grid { grid-template-columns: 1fr; } }

        /* ── Input panel ── */
        .input-panel {
          background: var(--surface); border: 2px solid var(--ink);
          border-radius: var(--r); padding: 28px; position: sticky; top: 24px;
        }
        @media(max-width:920px){ .input-panel { position: static; } }
        .panel-title {
          font-family: var(--font-d); font-size: 0.75rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.12em;
          color: var(--muted); margin-bottom: 20px;
          display: flex; align-items: center; gap: 10px;
        }
        .panel-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }

        .field { margin-bottom: 18px; }
        .field label {
          display: block; font-size: 0.72rem; font-weight: 700;
          color: var(--ink2); text-transform: uppercase;
          letter-spacing: 0.07em; margin-bottom: 6px;
        }
        .iw {
          display: flex; align-items: center;
          background: var(--bg); border: 1.5px solid var(--border2);
          border-radius: 8px; overflow: hidden;
          transition: border-color 0.15s;
        }
        .iw:focus-within { border-color: var(--ink); }
        .ipfx {
          padding: 0 12px; height: 42px;
          font-size: 0.88rem; color: var(--muted);
          background: var(--bg2); border-right: 1.5px solid var(--border2);
          display: flex; align-items: center;
          font-family: var(--font-m); user-select: none;
        }
        .iw input, .iw select {
          flex: 1; border: none; background: transparent;
          padding: 0 12px; height: 42px;
          font-family: var(--font-m); font-size: 0.95rem;
          color: var(--ink); outline: none;
        }
        .iw select { cursor: pointer; }
        input[type=range] {
          -webkit-appearance: none; width: 100%;
          height: 4px; background: var(--border2);
          border-radius: 2px; outline: none; margin-top: 8px; cursor: pointer;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 16px; height: 16px;
          border-radius: 50%; background: var(--red); cursor: pointer;
          border: 2px solid #fff; box-shadow: 0 0 0 1px var(--red);
          transition: transform 0.12s;
        }
        input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.2); }

        .toggle-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 10px 0; border-top: 1px solid var(--border);
          font-size: 0.82rem; color: var(--ink2); font-weight: 500;
        }
        .toggle {
          position: relative; width: 38px; height: 22px;
          display: inline-block; cursor: pointer; flex-shrink: 0;
        }
        .toggle input { opacity: 0; width: 0; height: 0; }
        .t-track {
          position: absolute; inset: 0; background: var(--border2);
          border-radius: 22px; transition: background 0.2s;
        }
        .toggle input:checked + .t-track { background: var(--red); }
        .t-thumb {
          position: absolute; top: 3px; left: 3px;
          width: 16px; height: 16px; background: #fff;
          border-radius: 50%; transition: transform 0.2s; pointer-events: none;
        }
        .toggle input:checked ~ .t-thumb { transform: translateX(16px); }

        /* period tabs */
        .period-tabs { display: flex; gap: 4px; margin-bottom: 18px; }
        .ptab {
          flex: 1; padding: 6px 8px; text-align: center;
          font-size: 0.72rem; font-weight: 700;
          border: 1.5px solid var(--border2); border-radius: 6px;
          background: transparent; color: var(--muted);
          cursor: pointer; transition: all 0.12s;
          font-family: var(--font-b); letter-spacing: 0.04em;
        }
        .ptab.active { background: var(--ink); color: #fff; border-color: var(--ink); }

        /* ── Results panel ── */
        .results-panel { display: flex; flex-direction: column; gap: 16px; }

        /* Income breakdown bar */
        .bar-card {
          background: var(--surface); border: 2px solid var(--ink);
          border-radius: var(--r); padding: 24px;
          animation: fadeUp 0.4s ease both;
        }
        .bar-title {
          font-family: var(--font-d); font-size: 0.72rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted);
          margin-bottom: 16px;
        }
        .breakdown-bar {
          height: 40px; border-radius: 6px; overflow: hidden;
          display: flex; width: 100%; margin-bottom: 16px;
        }
        .bar-seg { height: 100%; transition: width 0.5s cubic-bezier(0.4,0,0.2,1); }
        .bar-legend { display: flex; gap: 16px; flex-wrap: wrap; }
        .legend-item { display: flex; align-items: center; gap: 7px; font-size: 0.78rem; }
        .legend-dot { width: 10px; height: 10px; border-radius: 2px; flex-shrink: 0; }
        .legend-label { color: var(--ink2); font-weight: 500; }
        .legend-val { color: var(--ink); font-family: var(--font-m); font-weight: 600; }

        /* Key metrics */
        .metrics-card {
          background: var(--surface); border: 2px solid var(--ink);
          border-radius: var(--r); padding: 24px;
        }
        .metrics-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 20px; flex-wrap: wrap; gap: 10px;
        }
        .metrics-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; }
        @media(max-width:600px){ .metrics-grid { grid-template-columns: 1fr 1fr; } }

        .metric {
          background: var(--bg); border: 1px solid var(--border);
          border-radius: 9px; padding: 14px 16px;
        }
        .metric.hero-m {
          background: var(--ink); border-color: var(--ink);
          grid-column: span 3;
        }
        @media(max-width:600px){ .metric.hero-m { grid-column: span 2; } }
        .m-lbl { font-size: 0.66rem; text-transform: uppercase; letter-spacing: 0.09em; font-weight: 700; color: var(--muted); margin-bottom: 6px; }
        .metric.hero-m .m-lbl { color: rgba(255,255,255,0.5); }
        .m-val { font-family: var(--font-d); font-size: 1.5rem; font-weight: 700; color: var(--ink); line-height: 1; }
        .metric.hero-m .m-val { font-size: 2.2rem; color: #fff; }
        .m-sub { font-size: 0.7rem; color: var(--muted); margin-top: 4px; }
        .metric.hero-m .m-sub { color: rgba(255,255,255,0.4); }
        .m-red  .m-val { color: var(--red); }
        .m-ora  .m-val { color: var(--orange); }
        .m-teal .m-val { color: var(--teal); }
        .m-grn  .m-val { color: var(--green); }

        /* Tabs */
        .tab-row {
          display: flex; gap: 3px; margin-bottom: 0;
          background: var(--bg2); border: 1.5px solid var(--border2);
          padding: 3px; border-radius: 8px;
        }
        .tab {
          flex: 1; padding: 7px 12px;
          font-size: 0.74rem; font-weight: 700; border: none;
          border-radius: 6px; background: transparent;
          color: var(--muted); cursor: pointer;
          transition: all 0.12s; text-align: center;
          font-family: var(--font-b); letter-spacing: 0.04em; text-transform: uppercase;
        }
        .tab.active { background: var(--surface); color: var(--ink); box-shadow: var(--shadow); }

        /* Bracket table */
        .bracket-card {
          background: var(--surface); border: 2px solid var(--ink);
          border-radius: var(--r); padding: 24px;
        }
        .bkt-row {
          display: grid; grid-template-columns: 1fr 80px 80px 100px;
          gap: 8px; padding: 10px 0;
          border-bottom: 1px solid var(--border);
          font-size: 0.82rem; align-items: center;
        }
        .bkt-row.header {
          font-size: 0.66rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.08em; color: var(--muted); padding-bottom: 8px;
        }
        .bkt-row.active-bracket { background: var(--red-dim); margin: 0 -4px; padding: 10px 4px; border-radius: 6px; }
        .bkt-range { font-family: var(--font-m); color: var(--ink2); font-size: 0.78rem; }
        .bkt-rate  { font-family: var(--font-m); font-weight: 700; color: var(--red); text-align: right; }
        .bkt-tax   { font-family: var(--font-m); color: var(--ink); text-align: right; }
        .bkt-cum   { font-family: var(--font-m); color: var(--muted); text-align: right; font-size: 0.76rem; }

        /* Chart card */
        .chart-card {
          background: var(--surface); border: 2px solid var(--ink);
          border-radius: var(--r); padding: 24px;
        }

        /* ── Content sections ── */
        .content-section { padding: 52px 0; border-top: 2px solid var(--border); }
        .content-section:first-of-type { border-top: 2px solid var(--ink); margin-top: 32px; }

        .sec-badge {
          display: inline-block; background: var(--ink); color: #fff;
          font-size: 0.66rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; padding: 3px 10px; border-radius: 3px;
          margin-bottom: 12px; font-family: var(--font-b);
        }
        .sec-title {
          font-family: var(--font-d);
          font-size: clamp(1.5rem, 3vw, 2.2rem);
          font-weight: 700; color: var(--ink); line-height: 1.15;
          margin-bottom: 10px; letter-spacing: -0.01em;
        }
        .sec-title em { color: var(--red); font-style: normal; }
        .sec-lead { font-size: 0.95rem; color: var(--ink2); line-height: 1.78; max-width: 680px; margin-bottom: 26px; }

        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
        @media(max-width:720px){ .two-col { grid-template-columns: 1fr; } }
        .three-col { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
        @media(max-width:720px){ .three-col { grid-template-columns: 1fr 1fr; } }
        @media(max-width:480px){ .three-col { grid-template-columns: 1fr; } }

        .cbody { font-size: 0.92rem; color: var(--ink2); line-height: 1.82; }
        .cbody p { margin-bottom: 14px; }
        .cbody h3 { font-family: var(--font-d); font-size: 1.15rem; font-weight: 700; color: var(--ink); margin: 24px 0 9px; }
        .cbody strong { color: var(--ink); font-weight: 600; }
        .cbody .formula {
          display: inline-block; background: var(--bg2);
          border: 1px solid var(--border2); border-radius: 5px;
          font-family: var(--font-m); font-size: 0.8rem;
          padding: 2px 9px; color: var(--red); vertical-align: middle;
        }

        .icard {
          background: var(--surface); border: 1.5px solid var(--border);
          border-radius: 10px; padding: 20px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .icard:hover { border-color: var(--ink); transform: translateY(-2px); }
        .icard-icon { font-size: 1.25rem; margin-bottom: 10px; display: block; }
        .icard h4 { font-family: var(--font-d); font-size: 1rem; font-weight: 700; color: var(--ink); margin-bottom: 6px; }
        .icard p  { font-size: 0.82rem; color: var(--ink2); line-height: 1.65; }

        .tbl-wrap { overflow-x: auto; border: 1.5px solid var(--border2); border-radius: 10px; margin-top: 18px; }
        table { width: 100%; border-collapse: collapse; font-size: 0.84rem; }
        thead { background: var(--ink); }
        thead th { padding: 10px 14px; text-align: left; color: #fff; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; }
        tbody tr { border-top: 1px solid var(--border); }
        tbody tr:hover { background: var(--bg); }
        tbody td { padding: 10px 14px; color: var(--ink2); }
        tbody td:first-child { color: var(--ink); font-weight: 600; }
        .td-red { color: var(--red) !important; font-weight: 700 !important; }
        .td-grn { color: var(--green) !important; font-weight: 600 !important; }

        .faq-item { border-bottom: 1.5px solid var(--border); padding: 18px 0; }
        .faq-q { font-family: var(--font-d); font-size: 1rem; font-weight: 700; color: var(--ink); margin-bottom: 8px; }
        .faq-a { font-size: 0.87rem; color: var(--ink2); line-height: 1.78; }

        .cta-box {
          background: var(--ink); border-radius: var(--r);
          padding: 48px 40px; text-align: center; margin: 40px 0 56px;
        }
        .cta-box h2 { font-family: var(--font-d); font-size: 2rem; color: #fff; margin-bottom: 10px; font-weight: 700; letter-spacing: -0.02em; }
        .cta-box p  { color: #6b7280; margin-bottom: 22px; font-size: 0.97rem; }
        .cta-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 12px 28px; border-radius: 6px;
          background: var(--red); color: #fff;
          font-weight: 700; font-size: 0.87rem; text-decoration: none;
          font-family: var(--font-b); border: none; cursor: pointer;
          transition: all 0.15s; letter-spacing: 0.03em;
        }
        .cta-btn:hover { background: var(--red2); }

        .footer {
          border-top: 2px solid var(--border);
          padding: 24px 0; text-align: center;
          font-size: 0.76rem; color: var(--muted);
        }
        .footer a { color: var(--ink2); text-decoration: none; }
        .footer a:hover { color: var(--red); }
        .disclaimer-box {
          background: var(--red-dim); border: 1.5px solid rgba(192,57,43,0.2);
          border-radius: 8px; padding: 12px 16px;
          font-size: 0.8rem; color: var(--ink2); line-height: 1.65;
          margin-bottom: 16px;
        }
        .disclaimer-box strong { color: var(--red); }

        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .anim { animation: fadeUp 0.4s ease both; }
        .d1 { animation-delay: 0.05s; } .d2 { animation-delay: 0.12s; } .d3 { animation-delay: 0.2s; }

        @media(max-width:600px){
          .hero { padding: 80px 0 32px; }
          .bar-card, .metrics-card, .bracket-card, .chart-card { padding: 16px; }
          .breakdown-bar { height: 28px; }
          .cta-box { padding: 32px 20px; }
        }
        .sources-list { list-style: disc; padding-left: 20px; margin-bottom: 14px; }
        .sources-list li { margin-bottom: 8px; }
        .sources-list a { color: var(--red); text-decoration: underline; }
    `}</style>
  );
}
