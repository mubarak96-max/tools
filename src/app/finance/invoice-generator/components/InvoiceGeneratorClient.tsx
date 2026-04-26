"use client";

import { useState, useMemo, useRef, useCallback } from "react";

// ─── Tax regimes by country ───────────────────────────────────────────────────
const TAX_REGIMES = [
  { code: "GB",  label: "United Kingdom",  taxName: "VAT",  rate: 20,   currency: "GBP", symbol: "£",  placeholder: "GB123456789",   regLabel: "VAT Number",    dateFormat: "DD/MM/YYYY" },
  { code: "AU",  label: "Australia",       taxName: "GST",  rate: 10,   currency: "AUD", symbol: "A$", placeholder: "12 345 678 901", regLabel: "ABN",           dateFormat: "DD/MM/YYYY" },
  { code: "CA",  label: "Canada",          taxName: "HST",  rate: 13,   currency: "CAD", symbol: "CA$",placeholder: "123456789 RT0001",regLabel: "GST/HST Number",dateFormat: "YYYY-MM-DD" },
  { code: "NZ",  label: "New Zealand",     taxName: "GST",  rate: 15,   currency: "NZD", symbol: "NZ$",placeholder: "123-456-789",    regLabel: "GST Number",    dateFormat: "DD/MM/YYYY" },
  { code: "SG",  label: "Singapore",       taxName: "GST",  rate: 9,    currency: "SGD", symbol: "S$", placeholder: "M12345678A",     regLabel: "GST Reg. No.", dateFormat: "DD/MM/YYYY" },
  { code: "ZA",  label: "South Africa",    taxName: "VAT",  rate: 15,   currency: "ZAR", symbol: "R",  placeholder: "4123456789",     regLabel: "VAT Number",    dateFormat: "YYYY/MM/DD" },
  { code: "DE",  label: "Germany",         taxName: "VAT",  rate: 19,   currency: "EUR", symbol: "€",  placeholder: "DE123456789",    regLabel: "USt-IdNr.",     dateFormat: "DD.MM.YYYY" },
  { code: "AE",  label: "UAE",             taxName: "VAT",  rate: 5,    currency: "AED", symbol: "د.إ",placeholder: "100123456789003",regLabel: "TRN",           dateFormat: "DD/MM/YYYY" },
  { code: "US",  label: "United States",   taxName: "Tax",  rate: 0,    currency: "USD", symbol: "$",  placeholder: "—",              regLabel: "EIN",           dateFormat: "MM/DD/YYYY" },
  { code: "CUSTOM", label: "Custom",       taxName: "Tax",  rate: 0,    currency: "USD", symbol: "$",  placeholder: "",               regLabel: "Tax Number",    dateFormat: "MM/DD/YYYY" },
];

const fmtMoney = (n: number, sym = "$") => {
  if (isNaN(n)) return sym + "0.00";
  return sym + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

let _id = 1;
const newLine = () => ({ id: _id++, desc: "", qty: 1, rate: 0 });

const today = () => new Date().toISOString().split("T")[0];
const addDays = (d: string, n: number) => {
  const dt = new Date(d); dt.setDate(dt.getDate() + n);
  return dt.toISOString().split("T")[0];
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function InvoiceGeneratorClient() {
  const printRef = useRef<HTMLDivElement>(null);

  // Country / tax
  const [countryCode, setCountryCode]     = useState("GB");
  const [customTaxName, setCustomTaxName] = useState("Tax");
  const [customRate, setCustomRate]       = useState(10);
  const [customSymbol, setCustomSymbol]   = useState("$");
  const [taxEnabled, setTaxEnabled]       = useState(true);
  const [taxInclusive, setTaxInclusive]   = useState(false);

  const regime = useMemo(() => {
    const r = TAX_REGIMES.find(t => t.code === countryCode) || TAX_REGIMES[0];
    if (countryCode === "CUSTOM") return { ...r, taxName: customTaxName, rate: Number(customRate) || 0, symbol: customSymbol };
    return r;
  }, [countryCode, customTaxName, customRate, customSymbol]);

  // Invoice fields
  const [invNumber,  setInvNumber]  = useState("INV-001");
  const [invDate,    setInvDate]    = useState(today());
  const [dueDate,    setDueDate]    = useState(addDays(today(), 30));
  const [logo,       setLogo]       = useState<string | null>(null);   // base64
  const [fromName,   setFromName]   = useState("");
  const [fromAddr,   setFromAddr]   = useState("");
  const [fromEmail,  setFromEmail]  = useState("");
  const [fromTaxNum, setFromTaxNum] = useState("");
  const [toName,     setToName]     = useState("");
  const [toAddr,     setToAddr]     = useState("");
  const [toEmail,    setToEmail]    = useState("");
  const [notes,      setNotes]      = useState("Payment is due within 30 days. Thank you for your business.");
  const [lines,      setLines]      = useState([newLine(), newLine()]);

  // Logo upload
  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => setLogo(ev.target?.result as string);
    r.readAsDataURL(f);
  };

  // Line item CRUD
  const updateLine = (id: number, field: string, val: string | number) =>
    setLines(ls => ls.map(l => l.id === id ? { ...l, [field]: val } : l));
  const addLine    = () => setLines(ls => [...ls, newLine()]);
  const removeLine = (id: number) => setLines(ls => ls.filter(l => l.id !== id));

  // Totals
  const totals = useMemo(() => {
    const subtotal = lines.reduce((s, l) => s + (Number(l.qty) || 0) * (Number(l.rate) || 0), 0);
    const rate = taxEnabled ? (regime.rate / 100) : 0;
    let taxAmt, grandTotal;
    if (taxInclusive) {
      taxAmt    = subtotal * rate / (1 + rate);
      grandTotal = subtotal;
    } else {
      taxAmt    = subtotal * rate;
      grandTotal = subtotal + taxAmt;
    }
    return { subtotal, taxAmt, grandTotal };
  }, [lines, regime.rate, taxEnabled, taxInclusive]);

  // Print / PDF
  const handlePrint = useCallback(() => window.print(), []);

  const sym = regime.symbol;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,600&family=Figtree:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:       #f4f3ef;
          --sidebar:  #1a1f2e;
          --surface:  #ffffff;
          --ink:      #0f1117;
          --ink2:     #3a3f4d;
          --muted:    #8a909f;
          --border:   #e2e0da;
          --border2:  #c8c4bb;
          --blue:     #2d6be4;
          --blue-dim: #eaf0fd;
          --blue-dk:  #1a4db5;
          --red:      #d63031;
          --green:    #00897b;
          --amber:    #e67e22;
          --font-d:   'Fraunces', Georgia, serif;
          --font-b:   'Figtree', sans-serif;
          --font-m:   'JetBrains Mono', monospace;
          --r:        10px;
          --shadow:   0 2px 12px rgba(15,17,23,0.08);
          --shadow-lg:0 8px 40px rgba(15,17,23,0.13);
        }

        html { font-size: 15px; scroll-behavior: smooth; }
        body {
          font-family: var(--font-b);
          background: var(--bg);
          color: var(--ink);
          -webkit-font-smoothing: antialiased;
          line-height: 1.6;
        }

        /* ── Page shell ── */
        .shell {
          display: grid;
          grid-template-columns: 340px 1fr;
          min-height: 100vh;
        }
        @media(max-width:900px){ .shell { grid-template-columns: 1fr; } }

        /* ── Sidebar ── */
        .sidebar {
          background: var(--sidebar);
          padding: 0;
          position: sticky; top: 0;
          height: 100vh; overflow-y: auto;
          display: flex; flex-direction: column;
        }
        @media(max-width:900px){ .sidebar { position: static; height: auto; } }
        .sidebar-head {
          padding: 24px 24px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .sidebar-logo-mark {
          width: 32px; height: 32px; border-radius: 8px;
          background: var(--blue); display: flex;
          align-items: center; justify-content: center;
          font-size: 0.9rem; color: #fff; font-weight: 700;
          margin-bottom: 12px;
        }
        .sidebar-title {
          font-family: var(--font-d);
          font-size: 1.15rem; font-weight: 600;
          color: #fff; margin-bottom: 2px;
        }
        .sidebar-sub { font-size: 0.75rem; color: #6b7280; }

        .sidebar-body { padding: 20px 24px; flex: 1; }

        .s-section { margin-bottom: 24px; }
        .s-section-title {
          font-size: 0.65rem; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; color: #4b5563;
          margin-bottom: 10px; font-family: var(--font-b);
        }

        /* Sidebar inputs */
        .sf { margin-bottom: 10px; }
        .sf label {
          display: block; font-size: 0.72rem; font-weight: 600;
          color: #9ca3af; margin-bottom: 4px; text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .sf input, .sf select, .sf textarea {
          width: 100%; background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 7px; padding: 7px 10px;
          font-family: var(--font-b); font-size: 0.83rem;
          color: #e5e7eb; outline: none;
          transition: border-color 0.15s;
        }
        .sf input::placeholder, .sf textarea::placeholder { color: #4b5563; }
        .sf input:focus, .sf select:focus, .sf textarea:focus {
          border-color: var(--blue);
        }
        .sf select option { background: #1a1f2e; }
        .sf textarea { resize: vertical; min-height: 60px; }

        .toggle-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 9px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
          font-size: 0.8rem; color: #d1d5db;
        }
        .toggle-row:last-child { border-bottom: none; }

        .toggle {
          position: relative; width: 36px; height: 20px;
          display: inline-block; cursor: pointer;
        }
        .toggle input { opacity: 0; width: 0; height: 0; }
        .toggle-track {
          position: absolute; inset: 0;
          background: rgba(255,255,255,0.12);
          border-radius: 20px; transition: background 0.2s;
        }
        .toggle input:checked + .toggle-track { background: var(--blue); }
        .toggle-thumb {
          position: absolute; top: 3px; left: 3px;
          width: 14px; height: 14px; background: #fff;
          border-radius: 50%; transition: transform 0.2s;
          pointer-events: none;
        }
        .toggle input:checked ~ .toggle-thumb { transform: translateX(16px); }

        /* Sidebar actions */
        .sidebar-actions {
          padding: 16px 24px 24px;
          border-top: 1px solid rgba(255,255,255,0.07);
          display: flex; flex-direction: column; gap: 8px;
        }
        .btn {
          display: flex; align-items: center; justify-content: center;
          gap: 7px; padding: 10px 16px; border-radius: 8px;
          font-size: 0.83rem; font-weight: 600;
          cursor: pointer; border: none; transition: all 0.15s;
          font-family: var(--font-b); width: 100%;
        }
        .btn-primary { background: var(--blue); color: #fff; }
        .btn-primary:hover { background: var(--blue-dk); }
        .btn-outline {
          background: transparent; color: #9ca3af;
          border: 1px solid rgba(255,255,255,0.12);
        }
        .btn-outline:hover { color: #fff; border-color: rgba(255,255,255,0.3); }

        /* ── Main content area ── */
        .main { padding: 32px 40px 60px; overflow-x: auto; }
        @media(max-width:600px){ .main { padding: 20px 16px 60px; } }

        /* ── Invoice preview ── */
        .invoice-wrap {
          max-width: 820px; margin: 0 auto;
        }
        .invoice-toolbar {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 20px; flex-wrap: wrap; gap: 10px;
        }
        .inv-toolbar-left { display: flex; flex-direction: column; }
        .inv-breadcrumb { font-size: 0.72rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; }
        .inv-title {
          font-family: var(--font-d); font-size: 1.5rem;
          font-weight: 600; color: var(--ink); font-style: italic;
        }
        .toolbar-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 16px; border-radius: 7px;
          font-size: 0.8rem; font-weight: 600; cursor: pointer;
          font-family: var(--font-b); border: none; transition: all 0.15s;
        }
        .tbtn-print { background: var(--blue); color: #fff; }
        .tbtn-print:hover { background: var(--blue-dk); }
        .tbtn-clear { background: var(--surface); color: var(--ink2); border: 1px solid var(--border2); }
        .tbtn-clear:hover { border-color: var(--red); color: var(--red); }

        /* ── The actual invoice document ── */
        .invoice-doc {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          box-shadow: var(--shadow-lg);
          overflow: hidden;
        }

        /* Invoice header band */
        .inv-header {
          display: grid; grid-template-columns: 1fr auto;
          gap: 24px; align-items: start;
          padding: 36px 40px 28px;
          border-bottom: 2px solid var(--ink);
        }
        @media(max-width:600px){ .inv-header { grid-template-columns: 1fr; padding: 24px 20px 20px; } }

        .inv-logo-area { display: flex; flex-direction: column; gap: 12px; }
        .inv-logo-img { max-height: 64px; max-width: 180px; object-fit: contain; }
        .inv-logo-placeholder {
          width: 64px; height: 64px; border: 2px dashed var(--border2);
          border-radius: 8px; display: flex; align-items: center;
          justify-content: center; cursor: pointer;
          color: var(--muted); font-size: 0.72rem; text-align: center;
          transition: border-color 0.15s; padding: 8px;
        }
        .inv-logo-placeholder:hover { border-color: var(--blue); color: var(--blue); }
        .inv-logo-placeholder input { display: none; }

        .inv-from-name {
          font-family: var(--font-d); font-size: 1.3rem; font-weight: 600;
          color: var(--ink); margin-bottom: 4px; min-width: 160px;
        }
        .inv-from-detail { font-size: 0.82rem; color: var(--ink2); line-height: 1.6; }
        .inv-tax-num { font-size: 0.78rem; color: var(--muted); margin-top: 4px; font-family: var(--font-m); }

        .inv-meta { text-align: right; }
        .inv-word {
          font-family: var(--font-d); font-size: 2.4rem;
          font-weight: 700; color: var(--ink); letter-spacing: -0.02em;
          line-height: 1; margin-bottom: 16px;
          display: flex; align-items: center; justify-content: flex-end; gap: 10px;
        }
        .inv-tax-badge {
          font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.08em; padding: 3px 9px; border-radius: 20px;
          background: var(--blue-dim); color: var(--blue);
          font-family: var(--font-b); align-self: flex-end; margin-bottom: 6px;
        }
        .inv-meta-row { display: flex; justify-content: flex-end; gap: 20px; margin-bottom: 4px; }
        .inv-meta-lbl { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.07em; color: var(--muted); }
        .inv-meta-val { font-size: 0.82rem; font-weight: 600; color: var(--ink); font-family: var(--font-m); }

        /* Inline editable fields */
        [contenteditable] {
          outline: none; cursor: text;
          border-radius: 4px; transition: background 0.12s;
        }
        [contenteditable]:hover { background: rgba(45,107,228,0.05); }
        [contenteditable]:focus { background: var(--blue-dim); }
        [contenteditable]:empty::before {
          content: attr(data-placeholder);
          color: var(--border2); pointer-events: none;
        }

        /* Bill to */
        .inv-bill {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 24px; padding: 24px 40px;
          border-bottom: 1px solid var(--border);
        }
        @media(max-width:600px){ .inv-bill { grid-template-columns: 1fr; padding: 20px; } }
        .inv-bill-label {
          font-size: 0.65rem; text-transform: uppercase;
          letter-spacing: 0.1em; font-weight: 700;
          color: var(--muted); margin-bottom: 8px;
        }

        /* Line items table */
        .inv-table { padding: 0 40px 20px; }
        @media(max-width:600px){ .inv-table { padding: 0 20px 16px; } }

        .inv-table-head {
          display: grid; gap: 8px;
          grid-template-columns: 1fr 80px 100px 100px 32px;
          padding: 10px 0; border-bottom: 2px solid var(--ink);
          font-size: 0.65rem; text-transform: uppercase;
          letter-spacing: 0.1em; font-weight: 700; color: var(--muted);
        }
        .inv-line {
          display: grid; gap: 8px;
          grid-template-columns: 1fr 80px 100px 100px 32px;
          padding: 10px 0; border-bottom: 1px solid var(--border);
          align-items: center;
        }
        .inv-line:last-of-type { border-bottom: none; }

        .line-input {
          background: transparent; border: none;
          font-family: var(--font-b); font-size: 0.87rem;
          color: var(--ink); outline: none; width: 100%;
          padding: 3px 5px; border-radius: 4px;
          transition: background 0.12s;
        }
        .line-input:hover { background: rgba(45,107,228,0.05); }
        .line-input:focus { background: var(--blue-dim); }
        .line-input.num { font-family: var(--font-m); text-align: right; }
        .line-input::placeholder { color: var(--border2); }

        .line-total {
          font-family: var(--font-m); font-size: 0.87rem;
          font-weight: 600; color: var(--ink); text-align: right;
          padding: 3px 5px;
        }
        .remove-btn {
          background: transparent; border: none; cursor: pointer;
          color: var(--border2); font-size: 0.9rem;
          border-radius: 4px; width: 24px; height: 24px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.12s;
        }
        .remove-btn:hover { background: #fef2f2; color: var(--red); }

        .add-line-btn {
          display: flex; align-items: center; gap: 6px;
          background: transparent; border: 1px dashed var(--border2);
          border-radius: 7px; padding: 9px 14px;
          font-size: 0.8rem; color: var(--muted);
          cursor: pointer; transition: all 0.15s;
          margin: 8px 40px 0;
          font-family: var(--font-b); font-weight: 500;
        }
        .add-line-btn:hover { border-color: var(--blue); color: var(--blue); }

        /* Totals */
        .inv-totals {
          display: flex; justify-content: flex-end;
          padding: 20px 40px 28px;
          border-top: 1px solid var(--border);
        }
        @media(max-width:600px){ .inv-totals { padding: 16px 20px 20px; } }
        .totals-box { width: 260px; }
        .total-row {
          display: flex; justify-content: space-between;
          align-items: center; padding: 6px 0;
          font-size: 0.86rem;
        }
        .total-row.subtotal { border-bottom: 1px solid var(--border); padding-bottom: 10px; margin-bottom: 4px; }
        .total-row.grand {
          border-top: 2px solid var(--ink);
          margin-top: 8px; padding-top: 12px;
        }
        .total-lbl { color: var(--ink2); }
        .total-val { font-family: var(--font-m); font-weight: 600; color: var(--ink); }
        .grand .total-lbl { font-family: var(--font-d); font-size: 1rem; font-weight: 600; color: var(--ink); font-style: italic; }
        .grand .total-val { font-size: 1.1rem; color: var(--blue); }
        .tax-inclusive-note { font-size: 0.7rem; color: var(--muted); text-align: right; margin-top: 4px; }

        /* Notes / footer */
        .inv-notes {
          padding: 20px 40px 32px;
          border-top: 1px solid var(--border);
        }
        @media(max-width:600px){ .inv-notes { padding: 16px 20px 24px; } }
        .inv-notes-lbl { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; color: var(--muted); margin-bottom: 8px; }
        .inv-notes-text { font-size: 0.82rem; color: var(--ink2); line-height: 1.7; }

        /* ── Content sections below invoice ── */
        .content-area { max-width: 820px; margin: 56px auto 0; }
        .section { padding: 48px 0; border-top: 1px solid var(--border); }
        .sec-badge {
          display: inline-block; font-size: 0.66rem; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase; color: var(--blue);
          margin-bottom: 8px; font-family: var(--font-b);
        }
        .sec-title {
          font-family: var(--font-d); font-size: clamp(1.5rem, 3vw, 2.1rem);
          font-weight: 600; color: var(--ink); line-height: 1.2;
          margin-bottom: 10px;
        }
        .sec-title em { font-style: italic; color: var(--blue); }
        .sec-lead { font-size: 0.95rem; color: var(--ink2); line-height: 1.78; margin-bottom: 24px; max-width: 640px; }

        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; align-items: start; }
        @media(max-width:720px){ .two-col { grid-template-columns: 1fr; } }
        .three-col { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
        @media(max-width:720px){ .three-col { grid-template-columns: 1fr 1fr; } }
        @media(max-width:500px){ .three-col { grid-template-columns: 1fr; } }

        .cbody { font-size: 0.92rem; color: var(--ink2); line-height: 1.82; }
        .cbody p { margin-bottom: 14px; }
        .cbody h3 { font-family: var(--font-d); font-size: 1.15rem; font-weight: 600; color: var(--ink); margin: 22px 0 8px; font-style: italic; }
        .cbody strong { color: var(--ink); font-weight: 600; }

        .icard {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 10px; padding: 20px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .icard:hover { border-color: var(--blue); box-shadow: 0 4px 16px rgba(45,107,228,0.08); }
        .icard-icon { font-size: 1.25rem; margin-bottom: 10px; display: block; }
        .icard h4 { font-family: var(--font-d); font-size: 1rem; font-weight: 600; color: var(--ink); margin-bottom: 6px; }
        .icard p  { font-size: 0.82rem; color: var(--ink2); line-height: 1.65; }

        .tbl-wrap { overflow-x: auto; border: 1px solid var(--border); border-radius: 10px; margin-top: 16px; }
        table { width: 100%; border-collapse: collapse; font-size: 0.86rem; }
        thead { background: var(--ink); }
        thead th { padding: 11px 14px; text-align: left; color: #fff; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.07em; font-weight: 600; }
        tbody tr { border-top: 1px solid var(--border); }
        tbody tr:nth-child(even) { background: var(--bg); }
        tbody td { padding: 10px 14px; color: var(--ink2); }
        tbody td:first-child { color: var(--ink); font-weight: 500; }
        .td-blue { color: var(--blue) !important; font-weight: 600 !important; }

        .faq-item { border-bottom: 1px solid var(--border); padding: 18px 0; }
        .faq-q { font-weight: 600; font-size: 0.95rem; color: var(--ink); margin-bottom: 7px; }
        .faq-a { font-size: 0.86rem; color: var(--ink2); line-height: 1.78; }

        .cta-box {
          background: var(--sidebar); border-radius: 14px;
          padding: 44px 36px; text-align: center; margin: 32px 0 48px;
        }
        .cta-box h2 { font-family: var(--font-d); font-size: 1.8rem; color: #fff; margin-bottom: 10px; font-style: italic; }
        .cta-box p  { color: #6b7280; margin-bottom: 22px; font-size: 0.97rem; }
        .cta-btn { display: inline-flex; align-items: center; gap: 6px; padding: 11px 28px; border-radius: 8px; background: var(--blue); color: #fff; font-weight: 700; font-size: 0.87rem; text-decoration: none; font-family: var(--font-b); border: none; cursor: pointer; transition: all 0.15s; }
        .cta-btn:hover { background: var(--blue-dk); }

        .footer-strip {
          background: var(--surface); border-top: 1px solid var(--border);
          padding: 20px 40px; text-align: center;
          font-size: 0.76rem; color: var(--muted);
        }
        .footer-strip a { color: var(--ink2); text-decoration: none; }
        .footer-strip a:hover { color: var(--blue); }

        /* ── Print styles ── */
        @media print {
          body { background: #fff !important; }
          .sidebar, .inv-toolbar, .add-line-btn,
          .remove-btn, .content-area, .cta-box, .footer-strip,
          .main > .content-area { display: none !important; }
          .shell { display: block !important; }
          .main { padding: 0 !important; }
          .invoice-doc {
            border: none !important; box-shadow: none !important;
            border-radius: 0 !important;
          }
          [contenteditable]::before { display: none !important; }
          @page { margin: 15mm; size: A4; }
        }

        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .anim { animation: fadeUp 0.4s ease both; }
        .d1 { animation-delay: 0.04s; } .d2 { animation-delay: 0.1s; } .d3 { animation-delay: 0.17s; }
      `}</style>

      <div className="shell">

        {/* ══════════════════════════════════════════
            SIDEBAR — Controls
        ══════════════════════════════════════════ */}
        <aside className="sidebar">
          <div className="sidebar-head">
            <div className="sidebar-logo-mark">IV</div>
            <div className="sidebar-title">Invoice Generator</div>
            <div className="sidebar-sub">VAT · GST · HST · Tax</div>
          </div>

          <div className="sidebar-body">

            {/* Country / Tax */}
            <div className="s-section">
              <div className="s-section-title">Country &amp; Tax</div>
              <div className="sf">
                <label>Country</label>
                <select value={countryCode} onChange={e => setCountryCode(e.target.value)}>
                  {TAX_REGIMES.map(r => <option key={r.code} value={r.code}>{r.label}</option>)}
                </select>
              </div>
              {countryCode === "CUSTOM" && <>
                <div className="sf"><label>Tax Name</label>
                  <input value={customTaxName} onChange={e => setCustomTaxName(e.target.value)} placeholder="e.g. VAT, GST, HST" />
                </div>
                <div className="sf"><label>Tax Rate (%)</label>
                  <input type="number" value={customRate} onChange={e => setCustomRate(Number(e.target.value))} min="0" max="100" />
                </div>
                <div className="sf"><label>Currency Symbol</label>
                  <input value={customSymbol} onChange={e => setCustomSymbol(e.target.value)} maxLength={4} />
                </div>
              </>}
              <div className="toggle-row">
                <span>Apply {regime.taxName} ({regime.rate}%)</span>
                <label className="toggle">
                  <input type="checkbox" checked={taxEnabled} onChange={e => setTaxEnabled(e.target.checked)} />
                  <div className="toggle-track" /><div className="toggle-thumb" />
                </label>
              </div>
              {taxEnabled && (
                <div className="toggle-row">
                  <span>Tax Inclusive (prices include tax)</span>
                  <label className="toggle">
                    <input type="checkbox" checked={taxInclusive} onChange={e => setTaxInclusive(e.target.checked)} />
                    <div className="toggle-track" /><div className="toggle-thumb" />
                  </label>
                </div>
              )}
            </div>

            {/* Invoice Details */}
            <div className="s-section">
              <div className="s-section-title">Invoice Details</div>
              <div className="sf"><label>Invoice Number</label>
                <input value={invNumber} onChange={e => setInvNumber(e.target.value)} />
              </div>
              <div className="sf"><label>Invoice Date</label>
                <input type="date" value={invDate} onChange={e => setInvDate(e.target.value)} />
              </div>
              <div className="sf"><label>Due Date</label>
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
              </div>
              {[
                { label: "Quick Due", options: [
                  { label: "Net 7",  days: 7  },
                  { label: "Net 14", days: 14 },
                  { label: "Net 30", days: 30 },
                  { label: "Net 60", days: 60 },
                ]},
              ].map(g => (
                <div key={g.label} style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
                  {g.options.map(o => (
                    <button key={o.label}
                      onClick={() => setDueDate(addDays(invDate, o.days))}
                      style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "3px 9px", fontSize: "0.72rem", color: "#9ca3af", cursor: "pointer", fontFamily: "var(--font-b)", fontWeight: 600 }}>
                      {o.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* From */}
            <div className="s-section">
              <div className="s-section-title">From (Your Details)</div>
              <div className="sf"><label>Business Name</label>
                <input value={fromName} onChange={e => setFromName(e.target.value)} placeholder="Acme Ltd" />
              </div>
              <div className="sf"><label>Address</label>
                <textarea value={fromAddr} onChange={e => setFromAddr(e.target.value)} placeholder={"123 Main Street\nLondon, UK EC1A 1BB"} rows={3} />
              </div>
              <div className="sf"><label>Email</label>
                <input type="email" value={fromEmail} onChange={e => setFromEmail(e.target.value)} placeholder="hello@acme.com" />
              </div>
              <div className="sf"><label>{regime.regLabel}</label>
                <input value={fromTaxNum} onChange={e => setFromTaxNum(e.target.value)} placeholder={regime.placeholder} />
              </div>
            </div>

            {/* To */}
            <div className="s-section">
              <div className="s-section-title">Bill To (Client)</div>
              <div className="sf"><label>Client Name</label>
                <input value={toName} onChange={e => setToName(e.target.value)} placeholder="Client Company Ltd" />
              </div>
              <div className="sf"><label>Address</label>
                <textarea value={toAddr} onChange={e => setToAddr(e.target.value)} placeholder={"456 Client Road\nManchester, UK M1 1AA"} rows={3} />
              </div>
              <div className="sf"><label>Client Email</label>
                <input type="email" value={toEmail} onChange={e => setToEmail(e.target.value)} placeholder="accounts@client.com" />
              </div>
            </div>

            {/* Notes */}
            <div className="s-section">
              <div className="s-section-title">Notes &amp; Payment Terms</div>
              <div className="sf">
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} />
              </div>
            </div>

          </div>{/* end sidebar-body */}

          <div className="sidebar-actions">
            <button className="btn btn-primary" onClick={handlePrint}>
              ⬇ Download / Print PDF
            </button>
            <button className="btn btn-outline" onClick={() => {
              setFromName(""); setFromAddr(""); setFromEmail(""); setFromTaxNum("");
              setToName(""); setToAddr(""); setToEmail("");
              setLines([newLine(), newLine()]);
              setNotes("Payment is due within 30 days. Thank you for your business.");
              setInvNumber("INV-001"); setInvDate(today()); setDueDate(addDays(today(), 30));
              setLogo(null);
            }}>
              ↺ Reset Invoice
            </button>
          </div>
        </aside>

        {/* ══════════════════════════════════════════
            MAIN — Invoice preview + content
        ══════════════════════════════════════════ */}
        <main className="main">
          <div className="invoice-wrap">

            {/* Toolbar */}
            <div className="inv-toolbar anim">
              <div className="inv-toolbar-left">
                <span className="inv-breadcrumb">Invoice Generator</span>
                <span className="inv-title">Live Preview</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="toolbar-btn tbtn-clear" onClick={() => setLines([newLine(), newLine()])}>
                  Clear Lines
                </button>
                <button className="toolbar-btn tbtn-print" onClick={handlePrint}>
                  ⬇ PDF
                </button>
              </div>
            </div>

            {/* ── INVOICE DOCUMENT ── */}
            <div className="invoice-doc anim d1" ref={printRef}>

              {/* Header */}
              <div className="inv-header">
                <div className="inv-logo-area">
                  {logo
                    ? <img src={logo} alt="Logo" className="inv-logo-img" onClick={() => setLogo(null)} title="Click to remove" style={{ cursor: "pointer" }} />
                    : (
                      <label className="inv-logo-placeholder">
                        <input type="file" accept="image/*" onChange={handleLogo} />
                        <span>＋<br/>Add Logo</span>
                      </label>
                    )
                  }
                  <div>
                    <div className="inv-from-name"
                      contentEditable suppressContentEditableWarning
                      data-placeholder="Your Business Name"
                      onBlur={e => setFromName(e.currentTarget.innerText)}
                      dangerouslySetInnerHTML={{ __html: fromName }}
                    />
                    <div className="inv-from-detail"
                      contentEditable suppressContentEditableWarning
                      data-placeholder="Address · Email · Phone"
                      style={{ whiteSpace: "pre-wrap" }}
                      onBlur={e => setFromAddr(e.currentTarget.innerText)}
                      dangerouslySetInnerHTML={{ __html: fromAddr || (fromEmail ? fromEmail : "") }}
                    />
                    {fromTaxNum && (
                      <div className="inv-tax-num">{regime.regLabel}: {fromTaxNum}</div>
                    )}
                  </div>
                </div>

                <div className="inv-meta">
                  <div className="inv-word">
                    INVOICE
                    {taxEnabled && <span className="inv-tax-badge">{regime.taxName} {regime.rate}%</span>}
                  </div>
                  <div className="inv-meta-row">
                    <span className="inv-meta-lbl">Number</span>
                    <span className="inv-meta-val"
                      contentEditable suppressContentEditableWarning
                      onBlur={e => setInvNumber(e.currentTarget.innerText)}
                      dangerouslySetInnerHTML={{ __html: invNumber }}
                    />
                  </div>
                  <div className="inv-meta-row">
                    <span className="inv-meta-lbl">Date</span>
                    <span className="inv-meta-val" style={{ fontFamily: "var(--font-m)", fontSize: "0.8rem" }}>
                      {new Date(invDate + "T12:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <div className="inv-meta-row">
                    <span className="inv-meta-lbl">Due</span>
                    <span className="inv-meta-val" style={{ fontFamily: "var(--font-m)", fontSize: "0.8rem" }}>
                      {new Date(dueDate + "T12:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bill To */}
              <div className="inv-bill">
                <div>
                  <div className="inv-bill-label">Bill To</div>
                  <div style={{ fontWeight: 600, fontSize: "0.97rem", marginBottom: 4 }}
                    contentEditable suppressContentEditableWarning
                    data-placeholder="Client Name"
                    onBlur={e => setToName(e.currentTarget.innerText)}
                    dangerouslySetInnerHTML={{ __html: toName }}
                  />
                  <div style={{ fontSize: "0.83rem", color: "var(--ink2)", whiteSpace: "pre-wrap" }}
                    contentEditable suppressContentEditableWarning
                    data-placeholder={"Address\nEmail"}
                    onBlur={e => setToAddr(e.currentTarget.innerText)}
                    dangerouslySetInnerHTML={{ __html: toAddr || (toEmail ? toEmail : "") }}
                  />
                </div>
                <div>
                  <div className="inv-bill-label">Amount Due</div>
                  <div style={{ fontFamily: "var(--font-d)", fontSize: "2rem", fontWeight: 700, color: "var(--blue)", fontStyle: "italic" }}>
                    {fmtMoney(totals.grandTotal, sym)}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 3 }}>
                    Due {new Date(dueDate + "T12:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </div>
                </div>
              </div>

              {/* Line items */}
              <div className="inv-table">
                <div className="inv-table-head">
                  <span>Description</span>
                  <span style={{ textAlign: "right" }}>Qty</span>
                  <span style={{ textAlign: "right" }}>Unit Price</span>
                  <span style={{ textAlign: "right" }}>Amount</span>
                  <span />
                </div>

                {lines.map(line => (
                  <div key={line.id} className="inv-line">
                    <input className="line-input" placeholder="Service or product description…"
                      value={line.desc} onChange={e => updateLine(line.id, "desc", e.target.value)} />
                    <input className="line-input num" type="number" min="0" step="1"
                      value={line.qty} onChange={e => updateLine(line.id, "qty", e.target.value)} />
                    <input className="line-input num" type="number" min="0" step="0.01"
                      value={line.rate} onChange={e => updateLine(line.id, "rate", e.target.value)} />
                    <div className="line-total">
                      {fmtMoney((Number(line.qty) || 0) * (Number(line.rate) || 0), sym)}
                    </div>
                    <button className="remove-btn" onClick={() => removeLine(line.id)} title="Remove line">✕</button>
                  </div>
                ))}
              </div>

              <button className="add-line-btn" onClick={addLine}>
                ＋ Add line item
              </button>

              {/* Totals */}
              <div className="inv-totals">
                <div className="totals-box">
                  <div className="total-row subtotal">
                    <span className="total-lbl">Subtotal</span>
                    <span className="total-val">{fmtMoney(totals.subtotal, sym)}</span>
                  </div>
                  {taxEnabled && (
                    <div className="total-row">
                      <span className="total-lbl">
                        {regime.taxName} {regime.rate}%{taxInclusive ? " (incl.)" : ""}
                      </span>
                      <span className="total-val">{fmtMoney(totals.taxAmt, sym)}</span>
                    </div>
                  )}
                  <div className="total-row grand">
                    <span className="total-lbl">Total Due</span>
                    <span className="total-val">{fmtMoney(totals.grandTotal, sym)}</span>
                  </div>
                  {taxInclusive && taxEnabled && (
                    <div className="tax-inclusive-note">* Prices include {regime.taxName}</div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {notes && (
                <div className="inv-notes">
                  <div className="inv-notes-lbl">Notes &amp; Payment Terms</div>
                  <div className="inv-notes-text"
                    contentEditable suppressContentEditableWarning
                    onBlur={e => setNotes(e.currentTarget.innerText)}
                    dangerouslySetInnerHTML={{ __html: notes }}
                  />
                </div>
              )}

            </div>{/* end invoice-doc */}

            {/* ══════════════════════════════════════════
                CONTENT SECTIONS — SEO / EEAT
            ══════════════════════════════════════════ */}
            <div className="content-area">

              {/* ── What This Tool Does ── */}
              <section className="section" id="about">
                <div className="sec-badge">Free Tool</div>
                <h2 className="sec-title">Professional <em>Invoice Generator</em><br />with Automatic Tax Calculation</h2>
                <p className="sec-lead">
                  Create, customise, and download professional invoices with correct VAT, GST, or HST
                  calculations for the UK, Australia, Canada, New Zealand, Singapore, UAE, and more —
                  all in your browser, free, with no account required.
                </p>
                <div className="three-col" style={{ marginBottom: 24 }}>
                  {[
                    { icon: "🇬🇧", title: "UK VAT Invoice", body: "Generate compliant UK VAT invoices at the standard 20% rate with your VAT registration number. Includes all required fields for HMRC compliance." },
                    { icon: "🇦🇺", title: "Australia GST Invoice", body: "Create GST-compliant tax invoices for Australia at 10%. Includes your ABN prominently — required for invoices over A$82.50." },
                    { icon: "🇨🇦", title: "Canada HST Invoice", body: "Build HST invoices for Canada at 13% (Ontario). Toggle between GST-only, HST, and province-specific rates. Includes your GST/HST registration number." },
                  ].map(c => (
                    <div className="icard" key={c.title}>
                      <span className="icard-icon">{c.icon}</span>
                      <h4>{c.title}</h4>
                      <p>{c.body}</p>
                    </div>
                  ))}
                </div>
                <div className="two-col">
                  <div className="cbody">
                    <p>
                      This <strong>free invoice generator online</strong> is built for freelancers, consultants, agencies, and small business owners who need to issue professional invoices quickly — without subscribing to expensive accounting software. Everything happens in your browser: no data is sent to a server, no account is needed, and your invoice details are never stored or shared.
                    </p>
                    <p>
                      The tool supports <strong>invoice with VAT calculator</strong> functionality for UK businesses, <strong>GST invoice generator</strong> output for Australian and New Zealand businesses, and <strong>HST invoice Canada</strong> compliance for Canadian businesses — all from a single interface. Switch countries using the dropdown in the sidebar and all tax labels, rates, and registration number fields update instantly.
                    </p>
                    <p>
                      When you are ready, click "Download / Print PDF" to save a professional, print-ready invoice. The PDF uses your browser's native print engine — no third-party PDF libraries, no watermarks, no limits.
                    </p>
                  </div>
                  <div className="cbody">
                    <h3>Key Features</h3>
                    <p>
                      <strong>Live preview.</strong> The invoice updates in real time as you type — every field in the sidebar reflects immediately in the document. You can also click directly on the invoice to edit text inline.
                    </p>
                    <p>
                      <strong>Tax-inclusive pricing.</strong> Toggle between tax-exclusive (adding tax on top) and tax-inclusive (prices already include tax) modes. Useful for retail and consumer-facing businesses where displayed prices must include VAT or GST.
                    </p>
                    <p>
                      <strong>Your logo.</strong> Upload your business logo directly onto the invoice. Supports JPG, PNG, and SVG.
                    </p>
                    <p>
                      <strong>Quick due dates.</strong> One-click Net 7, Net 14, Net 30, and Net 60 payment terms set the due date automatically from your invoice date.
                    </p>
                  </div>
                </div>
              </section>

              {/* ── Country tax reference ── */}
              <section className="section" id="tax-by-country">
                <div className="sec-badge">Tax by Country</div>
                <h2 className="sec-title">VAT, GST &amp; HST <em>by Country</em></h2>
                <p className="sec-lead">
                  Indirect taxes on goods and services — called VAT, GST, or HST depending on the jurisdiction — vary significantly by country and sometimes by province or state. This reference covers the most common scenarios for invoicing internationally.
                </p>
                <div className="tbl-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Country</th>
                        <th>Tax Name</th>
                        <th>Standard Rate</th>
                        <th>Registration Number Label</th>
                        <th>Invoicing Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["🇬🇧 United Kingdom", "VAT", "20%", "VAT Number (GB + 9 digits)", "Required on invoices over £250. Must show tax point date, VAT number, and breakdown."],
                        ["🇦🇺 Australia", "GST", "10%", "ABN (11 digits)", "Tax invoice required for transactions over A$82.50. Must show ABN and word 'Tax Invoice'."],
                        ["🇨🇦 Canada", "GST / HST", "5% GST / 13–15% HST", "GST/HST Registration Number", "HST applies in Ontario (13%), Nova Scotia (15%), NB, NL, PEI. Alberta: GST only at 5%."],
                        ["🇳🇿 New Zealand", "GST", "15%", "GST Number (9 digits)", "Required when annual turnover exceeds NZ$60,000. Must show GST number and amount."],
                        ["🇸🇬 Singapore", "GST", "9%", "GST Registration No.", "Mandatory registration when annual taxable turnover exceeds S$1 million."],
                        ["🇩🇪 Germany / EU", "VAT (MwSt)", "19%", "USt-IdNr. (DE + 9 digits)", "B2B cross-border EU invoices may be zero-rated with reverse charge mechanism."],
                        ["🇦🇪 UAE", "VAT", "5%", "TRN (15 digits)", "Introduced January 2018. Tax invoice required for B2B transactions over AED 10,000."],
                        ["🇿🇦 South Africa", "VAT", "15%", "VAT Number (10 digits)", "Required when annual turnover exceeds R1 million. Invoices must show VAT number."],
                        ["🇺🇸 United States", "Sales Tax", "Varies (0–10.25%)", "EIN / State Tax ID", "No federal VAT. Sales tax varies by state, county, and city. Typically not shown on B2B invoices."],
                      ].map(([c, t, r, reg, n]) => (
                        <tr key={c}>
                          <td>{c}</td>
                          <td className="td-blue">{t}</td>
                          <td><strong>{r}</strong></td>
                          <td style={{ fontFamily: "var(--font-m)", fontSize: "0.78rem" }}>{reg}</td>
                          <td style={{ fontSize: "0.8rem" }}>{n}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* ── UK VAT deep-dive ── */}
              <section className="section" id="uk-vat">
                <div className="sec-badge">UK VAT</div>
                <h2 className="sec-title"><em>UK VAT Invoice</em> — What Must Be Included</h2>
                <p className="sec-lead">
                  A valid UK VAT invoice must contain specific information as required by HMRC. Missing any of these fields can mean your customer cannot reclaim VAT — and can expose you to penalties.
                </p>
                <div className="two-col">
                  <div className="cbody">
                    <p>
                      Every <strong>UK VAT invoice template</strong> must include: a unique sequential invoice number, your business name and address, your VAT registration number (formatted as GB followed by 9 digits), the tax point date (the date the supply was made), your customer's name and address, a description of the goods or services supplied, the quantity and unit price, the net amount (excluding VAT), the VAT rate applied, the VAT amount in sterling, and the gross total including VAT.
                    </p>
                    <p>
                      For invoices under £250 (at the point of supply), you may issue a simplified VAT invoice that omits the customer's name and address and shows only the VAT-inclusive total — but it must still include your VAT number and the rate applied.
                    </p>
                    <p>
                      <strong>How to add VAT to an invoice</strong> in the UK: multiply the net subtotal by 0.20 (20%) to get the VAT amount, then add it to the net to get the gross total. This calculator does this automatically. For VAT-inclusive pricing — common in retail — the VAT element is extracted using the formula: VAT = Total × 20/120 (or more generally, Total × rate/(100+rate)).
                    </p>
                    <h3>UK VAT Rates at a Glance</h3>
                    <p>
                      The <strong>standard rate</strong> is 20% and applies to most goods and services. The <strong>reduced rate</strong> of 5% applies to certain categories including domestic energy, children's car seats, and some residential renovation work. A <strong>zero rate</strong> (0%, but still VAT-registered) applies to most food, children's clothing, books, and printed matter. Some supplies are <strong>exempt from VAT</strong> entirely — financial services, insurance, and most education — and these cannot be reclaimed by registered businesses.
                    </p>
                  </div>
                  <div className="cbody">
                    <h3>VAT Registration Threshold</h3>
                    <p>
                      You must register for VAT in the UK when your taxable turnover exceeds £90,000 in any 12-month period (2024/25 threshold). Once registered, you must charge VAT on all taxable supplies, file VAT returns (typically quarterly), and maintain digital VAT records under Making Tax Digital (MTD) rules. Voluntary registration is available below the threshold and is often advantageous if your customers are VAT-registered businesses who can reclaim the VAT you charge.
                    </p>
                    <h3>What About VAT on Exports?</h3>
                    <p>
                      Exports of goods from the UK to non-UK countries are generally zero-rated for VAT — you charge 0% but retain the right to reclaim input VAT. Services supplied to businesses outside the UK are typically outside the scope of UK VAT under the place of supply rules. Our invoice generator lets you set a custom rate of 0% for zero-rated or exempt invoices while still displaying your VAT number for compliance.
                    </p>
                    <h3>Making Tax Digital (MTD)</h3>
                    <p>
                      Since April 2019, all VAT-registered businesses with turnover above the threshold must keep digital VAT records and submit returns using MTD-compatible software. Our <strong>free invoice generator online</strong> produces invoices you can print and save as PDFs — for full MTD compliance, you will need to integrate invoicing with compatible accounting software such as Xero, QuickBooks, or FreeAgent.
                    </p>
                  </div>
                </div>
              </section>

              {/* ── Australia GST ── */}
              <section className="section" id="australia-gst">
                <div className="sec-badge">Australia GST</div>
                <h2 className="sec-title"><em>Australia GST Invoice</em> — ABN &amp; Tax Invoice Rules</h2>
                <p className="sec-lead">
                  Australian businesses supplying taxable goods and services must issue tax invoices for transactions over A$82.50. Here is everything required for a compliant GST invoice in Australia.
                </p>
                <div className="two-col">
                  <div className="cbody">
                    <p>
                      A valid <strong>Australia GST invoice</strong> — formally called a "tax invoice" — must include: the words "Tax Invoice" prominently, your business name, your Australian Business Number (ABN), the date the invoice was issued, a description of what was sold, the GST-inclusive price, and either the GST amount or a statement that the total price includes GST.
                    </p>
                    <p>
                      The <strong>GST rate in Australia is 10%</strong> on most goods and services. To calculate GST on a price: multiply the net (ex-GST) amount by 0.10. To find the GST component within a GST-inclusive price: divide the total by 11. Our <strong>GST invoice generator</strong> handles both modes — toggle "Tax Inclusive" in the sidebar for the latter.
                    </p>
                    <p>
                      GST-free supplies (equivalent to zero-rated in VAT terminology) include most basic food items, some health services, education courses, and exports. These are not exempt — they are zero-rated, meaning you can still claim GST credits on your business inputs related to those sales.
                    </p>
                    <h3>ABN Requirement on Australian Invoices</h3>
                    <p>
                      If you do not include your ABN on an invoice to another business, the payer is legally required to withhold 47% of the payment (the top marginal tax rate) and remit it to the ATO. This "no-ABN withholding" rule makes including your ABN on every invoice essential. Our <strong>invoice template with GST</strong> includes a dedicated ABN field that prints prominently on the document.
                    </p>
                  </div>
                  <div className="cbody">
                    <h3>When Do You Need to Register for GST?</h3>
                    <p>
                      You must register for GST in Australia when your GST turnover (gross income from business, excluding GST) is A$75,000 or more per year (or A$150,000 for non-profit organisations). If you are below the threshold, GST registration is voluntary — but advisable if you deal primarily with other registered businesses, as you will be able to claim GST credits on your business purchases.
                    </p>
                    <h3>Invoicing Amounts Under A$82.50</h3>
                    <p>
                      For supplies that are A$82.50 (GST-inclusive) or less, a recipient-created tax invoice or full tax invoice is not required — a simple document showing the amount and that GST is included is sufficient. However, for all practical purposes, issuing a proper tax invoice for every transaction is best practice and avoids any disputes about whether the threshold was met.
                    </p>
                    <h3>Recipient-Created Tax Invoices (RCTI)</h3>
                    <p>
                      In some arrangements, the buyer rather than the supplier issues the tax invoice — this is called a recipient-created tax invoice (RCTI). RCTIs are common in agricultural and primary production industries. They require a written agreement between the parties and both parties must be GST-registered.
                    </p>
                  </div>
                </div>
              </section>

              {/* ── Canada HST ── */}
              <section className="section" id="canada-hst">
                <div className="sec-badge">Canada HST / GST</div>
                <h2 className="sec-title"><em>HST Invoice Canada</em> — GST, HST &amp; Provincial Rules</h2>
                <p className="sec-lead">
                  Canada's tax system is more complex than most, with a federal GST combined with provincial sales taxes that are either harmonised (HST) or separate (PST). Here's what you need to know for compliant Canadian invoicing.
                </p>
                <div className="two-col">
                  <div className="cbody">
                    <p>
                      Canada levies a federal <strong>Goods and Services Tax (GST) of 5%</strong> on most supplies. In five provinces — Ontario, Nova Scotia, New Brunswick, Newfoundland &amp; Labrador, and Prince Edward Island — the provincial sales tax is combined with the federal GST into a single <strong>Harmonised Sales Tax (HST)</strong>. The <strong>HST rate</strong> varies: Ontario charges 13%, Nova Scotia and Newfoundland charge 15%, and PEI and New Brunswick charge 15%.
                    </p>
                    <p>
                      Provinces not participating in HST (British Columbia, Manitoba, Saskatchewan, and Quebec) have their own provincial sales tax (PST or QST) which is levied separately from GST. Alberta has no provincial sales tax at all, making it the only major province where only the 5% federal GST applies — making Alberta invoices the simplest to calculate.
                    </p>
                    <p>
                      A valid <strong>HST invoice Canada</strong> must include: the supplier's name (or trade name), the date, a description of the supply, the total amount paid or payable, and if the total exceeds CA$30, the GST/HST registration number. For invoices over CA$150, the invoice must also show the GST/HST rate and the breakdown of tax by rate.
                    </p>
                  </div>
                  <div className="cbody">
                    <h3>GST/HST Registration in Canada</h3>
                    <p>
                      Most businesses with annual worldwide taxable revenues exceeding CA$30,000 must register for GST/HST. Small suppliers below this threshold may register voluntarily. Registration gives you a 9-digit Business Number with a program identifier suffix — for example, 123456789 RT0001 — which must appear on all invoices for registered businesses.
                    </p>
                    <h3>Input Tax Credits (ITCs)</h3>
                    <p>
                      Canadian GST/HST-registered businesses can claim Input Tax Credits (ITCs) to recover GST/HST paid on business purchases — equivalent to the input VAT reclaim mechanism in the UK and EU. To claim ITCs, you must hold a valid tax invoice from your supplier with their registration number.
                    </p>
                    <h3>Quebec Sales Tax (QST)</h3>
                    <p>
                      Quebec levies its own provincial tax — the QST — at 9.975% on most supplies, applied on top of the 5% GST. The combined effective rate in Quebec is 14.975%. QST has its own registration system administered by Revenu Québec, separate from the federal CRA registration for GST. Our custom tax option lets you set a combined rate and label for Quebec or any other province.
                    </p>
                  </div>
                </div>
              </section>

              {/* ── FAQ ── */}
              <section className="section" id="faq">
                <div className="sec-badge">FAQ</div>
                <h2 className="sec-title">Frequently Asked <em>Questions</em></h2>
                <div style={{ maxWidth: 760, marginTop: 8 }}>
                  {[
                    {
                      q: "Is this invoice generator really free?",
                      a: "Yes — completely free, forever. There is no sign-up, no subscription, no watermark on the PDF, and no limit on how many invoices you can create. This is a free invoice generator online that runs entirely in your browser. Your invoice data is never sent to or stored on any server."
                    },
                    {
                      q: "How do I create a VAT invoice for the UK?",
                      a: "Select 'United Kingdom' from the Country dropdown in the sidebar. The tool automatically sets VAT at 20%, labels the tax column correctly, and adds a field for your VAT registration number. Fill in your details, add line items, enter your VAT number, and click Download / Print PDF. The resulting invoice meets HMRC requirements for a valid VAT invoice."
                    },
                    {
                      q: "How do I add GST to an invoice for Australia?",
                      a: "Select 'Australia' from the Country dropdown. The GST rate is set to 10% automatically, the registration label changes to 'ABN', and the tax calculation updates live. Enter your ABN in the sidebar — it will appear prominently on the invoice as required by the ATO. Toggle 'Tax Inclusive' if your prices already include GST and you need to extract the GST component."
                    },
                    {
                      q: "Can I use this for Canada HST invoicing?",
                      a: "Yes. Select 'Canada' from the dropdown — it defaults to Ontario's 13% HST rate. If you are in a different province (e.g. Nova Scotia at 15%, or Alberta where only 5% GST applies), use the 'Custom' option to set the correct combined rate. Enter your GST/HST registration number in the sidebar. It will print on the invoice as required by the CRA."
                    },
                    {
                      q: "What is the difference between tax-exclusive and tax-inclusive invoicing?",
                      a: "Tax-exclusive means your line item prices do not include tax — the tax is calculated and added on top (subtotal + VAT = total). This is standard for most B2B invoicing. Tax-inclusive means your prices already include the tax — useful for retail or consumer-facing invoices where your displayed price is the amount customers pay. Toggle 'Tax Inclusive' in the sidebar to switch modes. The tax is then extracted from the total rather than added to it."
                    },
                    {
                      q: "What information must be on a professional invoice with tax?",
                      a: "Regardless of country, a professional invoice with tax calculation should include: unique invoice number, invoice date, payment due date, your business name and address, your tax registration number (VAT, ABN, GST number etc.), your client's name and address, a clear description of goods or services, quantity and unit price per line, subtotal, tax rate and tax amount as a separate line, and the grand total. Our invoice generator includes all of these fields automatically."
                    },
                    {
                      q: "Can I invoice in currencies other than my home currency?",
                      a: "Yes. The currency symbol updates when you select a country, but you can use the 'Custom' option to set any currency symbol you need. Note that for UK VAT, HMRC generally requires VAT to be expressed in sterling — if you issue foreign currency invoices, you must convert the VAT amount to GBP for your VAT return using HMRC's approved exchange rate."
                    },
                    {
                      q: "How do I download the invoice as a PDF?",
                      a: "Click 'Download / Print PDF' in the sidebar or the toolbar above the invoice. This opens your browser's print dialog. Select 'Save as PDF' as the destination (available in Chrome, Firefox, Edge, and Safari). Choose A4 paper size and set margins to minimum or none for best results. The sidebar and editing controls are hidden automatically in the PDF output."
                    },
                  ].map(item => (
                    <div key={item.q} className="faq-item">
                      <p className="faq-q">{item.q}</p>
                      <p className="faq-a">{item.a}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* CTA */}
              <div className="cta-box">
                <h2>Your Invoice is Ready</h2>
                <p>Fill in your details above and download a professional PDF in seconds — free, no account needed.</p>
                <button className="cta-btn" onClick={handlePrint}>⬇ Download PDF Now</button>
              </div>

            </div>{/* end content-area */}
          </div>{/* end invoice-wrap */}

          <div className="footer-strip">
            <p>Free invoice generator with VAT, GST &amp; HST. No data stored. No account required.</p>
            <p style={{ marginTop: 6 }}>
              <a href="#about">About</a> · <a href="#tax-by-country">Tax by Country</a> · <a href="#uk-vat">UK VAT</a> · <a href="#australia-gst">Australia GST</a> · <a href="#canada-hst">Canada HST</a> · <a href="#faq">FAQ</a>
            </p>
          </div>
        </main>

      </div>
    </>
  );
}
