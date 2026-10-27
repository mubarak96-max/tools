// Scoped styles for ZakatCalculatorClient, kept separate to hold the component under 1000 lines.
export const ZAKAT_CSS = `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        :root {
          --bg:       #0e1a0e;
          --bg2:      #132013;
          --bg3:      #162816;
          --surface:  #1a2e1a;
          --surface2: #1f3620;
          --border:   #2a4a2a;
          --border2:  #3a6040;
          --gold:     #c9a84c;
          --gold2:    #e8c97a;
          --gold-dim: #2a1f05;
          --gold-faint: rgba(201,168,76,0.08);
          --text:     #e8d5a0;
          --muted:    #7a9a7a;
          --muted2:   #a8c4a8;
          --white:    #f5edd8;
          --red:      #c0392b;
          --red-dim:  #2a0e0e;
          --green-ok: #27ae60;
          --font-d:   'Cormorant Garamond', Georgia, serif;
          --font-b:   'Plus Jakarta Sans', sans-serif;
          --font-m:   'JetBrains Mono', monospace;
          --r:        14px;
        }

        .zakat-wrapper {
          font-family: var(--font-b);
          background: var(--bg);
          color: var(--text);
          -webkit-font-smoothing: antialiased;
          line-height: 1.65;
          position: relative;
        }

        /* ── Arabesque geometric overlay ── */
        .zakat-wrapper::before {
          content: '';
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 30px,
              rgba(201,168,76,0.018) 30px,
              rgba(201,168,76,0.018) 31px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 30px,
              rgba(201,168,76,0.018) 30px,
              rgba(201,168,76,0.018) 31px
            );
        }

        .zwrap { position: relative; z-index: 1; max-width: 1160px; margin: 0 auto; padding: 0 20px; }

        /* ── Hero ── */
        .zhero {
          padding: 60px 0 52px;
          border-bottom: 1px solid var(--border);
          position: relative; overflow: hidden;
        }
        .zhero::after {
          content: '';
          position: absolute; top: -100px; right: -80px;
          width: 480px; height: 480px;
          background: radial-gradient(circle, rgba(201,168,76,0.09) 0%, transparent 65%);
          pointer-events: none;
        }
        .zbismillah {
          font-family: var(--font-d);
          font-size: 1.4rem; font-style: italic;
          color: var(--gold); opacity: 0.8;
          margin-bottom: 18px; letter-spacing: 0.04em;
        }
        .zbadge {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--gold-dim);
          color: var(--gold);
          border: 1px solid rgba(201,168,76,0.3);
          font-size: 0.69rem; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; padding: 4px 13px; border-radius: 20px;
          margin-bottom: 18px; font-family: var(--font-b);
        }
        .zhero h1 {
          font-family: var(--font-d);
          font-size: clamp(2.4rem, 5.5vw, 4rem);
          font-weight: 700; line-height: 1.1;
          color: var(--white); max-width: 820px; margin-bottom: 16px;
          letter-spacing: -0.01em;
        }
        .zhero h1 em { color: var(--gold); font-style: italic; }
        .zhero-sub {
          font-size: 1rem; color: var(--muted2);
          max-width: 620px; line-height: 1.75; margin-bottom: 32px;
        }
        .zhero-stats { display: flex; gap: 44px; flex-wrap: wrap; }
        .zhstat { display: flex; flex-direction: column; }
        .zhstat-num {
          font-family: var(--font-d);
          font-size: 2rem; font-weight: 700; color: var(--gold);
        }
        .zhstat-lbl { font-size: 0.74rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; }

        /* ── Section ── */
        .zsection { padding: 56px 0; border-top: 1px solid var(--border); }

        /* ── Sec title ── */
        .zsec-badge {
          display: inline-block;
          font-size: 0.68rem; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--gold);
          font-family: var(--font-b); margin-bottom: 10px;
        }
        .zsec-title {
          font-family: var(--font-d);
          font-size: clamp(1.7rem, 3.5vw, 2.4rem);
          font-weight: 700; color: var(--white); line-height: 1.18;
          margin-bottom: 10px;
        }
        .zsec-title em { color: var(--gold); font-style: italic; }
        .zsec-lead {
          font-size: 0.96rem; color: var(--muted2);
          line-height: 1.78; max-width: 680px; margin-bottom: 28px;
        }

        /* ── Card ── */
        .zcard {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r); padding: 24px;
        }
        .zcard-title {
          font-family: var(--font-d);
          font-size: 1.1rem; font-weight: 600;
          color: var(--gold); margin-bottom: 18px;
          display: flex; align-items: center; gap: 10px;
          letter-spacing: 0.01em;
        }
        .zcard-title-line {
          flex: 1; height: 1px; background: linear-gradient(90deg, var(--border2), transparent);
        }

        /* ── Ornament ── */
        .zornament {
          display: flex; align-items: center; gap: 10px;
          margin: 8px 0 20px;
        }
        .zornament-line { flex: 1; height: 1px; background: var(--border); }
        .zornament-diamond {
          width: 6px; height: 6px; background: var(--gold);
          transform: rotate(45deg); flex-shrink: 0;
        }

        /* ── Nisab toggle ── */
        .znisab-toggle {
          display: flex; gap: 0; margin-bottom: 22px;
          border: 1px solid var(--border2); border-radius: 10px; overflow: hidden;
        }
        .znisab-btn {
          flex: 1; padding: 11px 16px; border: none;
          background: transparent; color: var(--muted2);
          font-family: var(--font-b); font-size: 0.84rem; font-weight: 600;
          cursor: pointer; transition: all 0.15s; text-align: center;
        }
        .znisab-btn.zactive {
          background: var(--gold-dim);
          color: var(--gold);
          border-right: none;
        }
        .znisab-btn:first-child { border-right: 1px solid var(--border2); }

        /* ── Fields ── */
        .zfield { margin-bottom: 14px; }
        .zfield label {
          display: block; font-size: 0.74rem; font-weight: 600;
          color: var(--muted); text-transform: uppercase;
          letter-spacing: 0.07em; margin-bottom: 5px;
        }
        .ziw {
          display: flex; align-items: center;
          background: var(--bg2); border: 1px solid var(--border2);
          border-radius: 8px; overflow: hidden;
          transition: border-color 0.15s;
        }
        .ziw:focus-within { border-color: var(--gold); }
        .zipfx {
          padding: 0 11px; height: 38px;
          font-size: 0.82rem; color: var(--muted);
          background: var(--surface2);
          border-right: 1px solid var(--border2);
          display: flex; align-items: center;
          font-family: var(--font-m); user-select: none; min-width: 38px;
          justify-content: center;
        }
        .ziw input, .ziw select {
          flex: 1; border: none; background: transparent;
          padding: 0 12px; height: 38px;
          font-family: var(--font-m); font-size: 0.88rem;
          color: var(--white); outline: none;
        }
        .ziw select option { background: var(--bg2); }

        /* ── Asset rows ── */
        .zasset-row {
          display: grid; grid-template-columns: 1fr 160px;
          gap: 10px; align-items: center;
          padding: 10px 0; border-bottom: 1px solid var(--border);
        }
        .zasset-row:last-of-type { border-bottom: none; }
        .zasset-label { font-size: 0.87rem; color: var(--text); font-weight: 500; }
        .zasset-hint  { font-size: 0.72rem; color: var(--muted); margin-top: 2px; }

        /* ── Tabs ── */
        .ztabs {
          display: flex; gap: 3px;
          background: var(--bg2); border: 1px solid var(--border);
          padding: 4px; border-radius: 10px; margin-bottom: 22px;
        }
        .ztab {
          flex: 1; padding: 8px 12px;
          font-size: 0.79rem; font-weight: 600; border: none;
          border-radius: 7px; background: transparent;
          color: var(--muted); cursor: pointer;
          transition: all 0.15s; text-align: center;
          font-family: var(--font-b);
        }
        .ztab.zactive {
          background: var(--surface2);
          color: var(--gold);
          border: 1px solid var(--border2);
        }

        /* ── Result display ── */
        .zresult-hero {
          background: linear-gradient(135deg, #1f3205 0%, var(--surface) 100%);
          border: 1px solid rgba(201,168,76,0.35);
          border-radius: 12px; padding: 28px 24px;
          text-align: center; margin-bottom: 16px;
          position: relative; overflow: hidden;
        }
        .zresult-hero::before {
          content: '◆';
          position: absolute; top: 10px; left: 50%; transform: translateX(-50%);
          font-size: 0.5rem; color: var(--gold); opacity: 0.5;
          letter-spacing: 12px;
        }
        .zresult-lbl {
          font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;
          color: var(--muted); font-weight: 600; margin-bottom: 8px;
          font-family: var(--font-b);
        }
        .zresult-amt {
          font-family: var(--font-d);
          font-size: 3rem; font-weight: 700;
          color: var(--gold); line-height: 1;
        }
        .zresult-sub {
          font-size: 0.8rem; color: var(--muted2); margin-top: 8px;
        }

        .zmetric-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
        .zmetric {
          background: var(--bg2); border: 1px solid var(--border);
          border-radius: 9px; padding: 13px 14px;
        }
        .zmetric-lbl { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); margin-bottom: 5px; font-weight: 600; }
        .zmetric-val { font-family: var(--font-d); font-size: 1.3rem; font-weight: 600; color: var(--white); }

        .znisab-status {
          border-radius: 9px; padding: 12px 16px;
          font-size: 0.84rem; margin-bottom: 14px;
          display: flex; align-items: center; gap: 10px;
        }
        .znisab-status.zabove {
          background: rgba(39,174,96,0.1);
          border: 1px solid rgba(39,174,96,0.3);
          color: #6fcf97;
        }
        .znisab-status.zpending {
          background: var(--gold-dim);
          border: 1px solid rgba(201,168,76,0.3);
          color: var(--gold2);
        }
        .znisab-status.zbelow {
          background: var(--red-dim);
          border: 1px solid rgba(192,57,43,0.3);
          color: #e57373;
        }

        /* ── Grids ── */
        .ztwo-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }
        @media(max-width:860px){ .ztwo-col { grid-template-columns: 1fr; } }
        .zthree-col { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
        @media(max-width:800px){ .zthree-col { grid-template-columns: 1fr 1fr; } }
        @media(max-width:500px){ .zthree-col { grid-template-columns: 1fr; } }

        /* ── Content body ── */
        .zcbody { font-size: 0.93rem; color: var(--muted2); line-height: 1.82; }
        .zcbody p { margin-bottom: 15px; }
        .zcbody h3 {
          font-family: var(--font-d); font-size: 1.25rem;
          font-weight: 600; font-style: italic;
          color: var(--white); margin: 26px 0 10px;
        }
        .zcbody strong { color: var(--text); font-weight: 600; }

        /* ── Info cards ── */
        .zicard {
          background: var(--bg2); border: 1px solid var(--border);
          border-radius: 10px; padding: 20px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .zicard:hover { border-color: rgba(201,168,76,0.35); transform: translateY(-2px); }
        .zicard-icon {
          font-size: 1.3rem; margin-bottom: 11px; display: block;
        }
        .zicard h4 { font-family: var(--font-d); font-size: 1.05rem; font-weight: 600; color: var(--gold2); margin-bottom: 7px; }
        .zicard p  { font-size: 0.83rem; color: var(--muted2); line-height: 1.65; }

        /* ── Table ── */
        .ztbl-wrap {
          overflow-x: auto; border: 1px solid var(--border);
          border-radius: var(--r); margin-top: 20px;
        }
        .ztbl-wrap table { width: 100%; border-collapse: collapse; font-size: 0.86rem; }
        .ztbl-wrap thead { background: var(--surface2); }
        .ztbl-wrap thead th {
          padding: 11px 14px; text-align: left;
          font-family: var(--font-b); font-weight: 700;
          font-size: 0.73rem; text-transform: uppercase;
          letter-spacing: 0.07em; color: var(--gold);
        }
        .ztbl-wrap tbody tr { border-top: 1px solid var(--border); }
        .ztbl-wrap tbody tr:hover { background: var(--surface); }
        .ztbl-wrap tbody td { padding: 11px 14px; color: var(--muted2); vertical-align: top; }
        .ztbl-wrap tbody td:first-child { color: var(--text); font-weight: 500; }
        .ztd-gold { color: var(--gold) !important; font-weight: 600 !important; }
        .ztd-yes  { color: #6fcf97 !important; font-weight: 600 !important; }
        .ztd-no   { color: #e57373 !important; }
        .ztd-cond { color: #f2c94c !important; }

        /* ── Steps ── */
        .zsteps { list-style: none; counter-reset: steps; }
        .zstep { display: flex; gap: 16px; margin-bottom: 22px; }
        .zstep-num {
          width: 30px; height: 30px; border-radius: 50%;
          background: var(--gold-dim); border: 1px solid rgba(201,168,76,0.4);
          color: var(--gold); font-size: 0.78rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 2px; font-family: var(--font-b);
        }
        .zstep h4 { font-weight: 600; font-size: 0.93rem; color: var(--white); margin-bottom: 4px; }
        .zstep p  { font-size: 0.87rem; color: var(--muted2); line-height: 1.65; }

        /* ── FAQ ── */
        .zfaq-item { border-bottom: 1px solid var(--border); padding: 19px 0; }
        .zfaq-q { font-family: var(--font-d); font-size: 1.05rem; font-weight: 600; color: var(--white); margin-bottom: 8px; }
        .zfaq-a { font-size: 0.87rem; color: var(--muted2); line-height: 1.78; }

        /* ── Disclaimer ── */
        .zdisclaimer {
          background: var(--gold-dim); border: 1px solid rgba(201,168,76,0.2);
          border-radius: 10px; padding: 14px 18px;
          font-size: 0.8rem; color: var(--muted2); line-height: 1.65;
          margin-bottom: 20px;
        }
        .zdisclaimer strong { color: var(--gold); }

        /* ── CTA ── */
        .zcta {
          background: linear-gradient(135deg, var(--surface2) 0%, var(--bg2) 100%);
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 16px; padding: 48px 40px;
          text-align: center; margin: 20px 0 40px;
          position: relative; overflow: hidden;
        }
        .zcta::before {
          content: '';
          position: absolute; top: -60px; left: 50%; transform: translateX(-50%);
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .zcta h2 { font-family: var(--font-d); font-size: 2rem; color: var(--white); margin-bottom: 10px; font-style: italic; }
        .zcta p  { color: var(--muted2); margin-bottom: 22px; font-size: 0.97rem; }
        .zbtn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 11px 28px; border-radius: 8px;
          font-size: 0.85rem; font-weight: 700;
          cursor: pointer; border: none; transition: all 0.15s;
          font-family: var(--font-b); text-decoration: none;
        }
        .zbtn-gold { background: var(--gold); color: #0e1a0e; }
        .zbtn-gold:hover { background: var(--gold2); transform: translateY(-1px); }

        /* ── Footer ── */
        .zfooter {
          border-top: 1px solid var(--border);
          padding: 28px 0; text-align: center;
          font-size: 0.78rem; color: var(--muted);
        }
        .zfooter a { color: var(--muted2); text-decoration: none; }
        .zfooter a:hover { color: var(--gold); }

        /* ── Anim ── */
        @keyframes zfadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .zanim { animation: zfadeUp 0.5s ease both; }
        .zd1 { animation-delay: 0.05s; }
        .zd2 { animation-delay: 0.12s; }
        .zd3 { animation-delay: 0.2s; }

        @media(max-width:600px){
          .zhero { padding: 40px 0 36px; }
          .zcard { padding: 16px; }
          .zcta  { padding: 32px 20px; }
          .zresult-amt { font-size: 2.2rem; }
          .zmetric-grid { grid-template-columns: 1fr 1fr; }
          .zasset-row { grid-template-columns: 1fr; }
        }
      `;
