"use client";

import { useState, useMemo } from "react";
import {
  calculateLtt,
  getLttAtPricePoints,
  fmtCAD,
  fmtCADShort,
  fmtPct,
  type LttInputs,
  type Location,
  type PropertyType,
  type BuyerType,
} from "@/lib/torontoLtt";

// ─── Primitives ────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3 mt-6 first:mt-0">{children}</p>;
}

function Toggle({ checked, onChange, label, hint }: {
  checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string;
}) {
  return (
    <div>
      <label className="flex items-center gap-2.5 cursor-pointer select-none">
        <div onClick={() => onChange(!checked)}
          className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${checked ? "bg-red-500" : "bg-stone-200"}`}>
          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
        </div>
        <span className="text-xs text-stone-600">{label}</span>
      </label>
      {hint && <p className="text-[11px] text-stone-400 mt-1 pl-[46px] leading-snug">{hint}</p>}
    </div>
  );
}

function InfoBox({ children, colour = "amber" }: { children: React.ReactNode; colour?: "amber" | "blue" | "green" | "red" }) {
  const cls = {
    amber: "bg-amber-50 border-amber-200 text-amber-800",
    blue:  "bg-blue-50 border-blue-200 text-blue-800",
    green: "bg-green-50 border-green-200 text-green-800",
    red:   "bg-red-50 border-red-200 text-red-800",
  }[colour];
  return <div className={`border rounded-xl p-3.5 text-xs leading-relaxed ${cls}`}>{children}</div>;
}

// ─── Main component ────────────────────────────────────────────────

export default function LttCalculator() {
  const [price,         setPrice]         = useState(850000);
  const [location,      setLocation]      = useState<Location>("toronto");
  const [propType,      setPropType]      = useState<PropertyType>("residential");
  const [isFthb,        setIsFthb]        = useState(false);
  const [buyerType,     setBuyerType]     = useState<BuyerType>("canadian");
  const [hasCoBuyer,    setHasCoBuyer]    = useState(false);
  const [fthbShare,     setFthbShare]     = useState(50);

  const [tab, setTab] = useState<"result" | "breakdown" | "compare">("result");

  const inputs: LttInputs = {
    purchasePrice: price,
    location, propertyType: propType,
    isFirstTimeBuyer: isFthb,
    buyerType,
    hasNonFthbCoBuyer: hasCoBuyer,
    fthbOwnershipPct: fthbShare,
  };

  const r = useMemo(() => calculateLtt(inputs), [
    price, location, propType, isFthb, buyerType, hasCoBuyer, fthbShare,
  ]);

  const compareData = useMemo(() =>
    getLttAtPricePoints(location, propType, isFthb),
  [location, propType, isFthb]);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">

      {/* Banner */}
      <div className="bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-100 px-5 py-4">
        <div className="flex flex-wrap gap-6 items-center">
          <div>
            <p className="text-xs text-stone-400 mb-0.5">Total land transfer tax</p>
            <p className="text-4xl font-bold text-stone-900 leading-none">
              {fmtCAD(r.totalTaxAfterRebates)}
            </p>
            {r.totalRebates > 0 && (
              <p className="text-xs text-green-600 font-medium mt-1">
                Saved {fmtCAD(r.totalRebates)} in FTHB rebates
              </p>
            )}
          </div>
          <div className="h-10 w-px bg-red-200 hidden sm:block" />
          {[
            { label: "Ontario LTT",     value: fmtCAD(r.ontarioLttNet),          cls: "text-stone-700" },
            { label: "Toronto MLTT",    value: location === "toronto" ? fmtCAD(r.torontoMlttNet) : "N/A", cls: location === "toronto" ? "text-red-600" : "text-stone-400" },
            { label: "Effective rate",  value: fmtPct(r.effectiveRate),           cls: "text-stone-700" },
            ...(r.nrstApplies ? [{ label: "NRST (25%)", value: fmtCAD(r.nrst), cls: "text-red-700" }] : []),
          ].map(m => (
            <div key={m.label}>
              <p className="text-xs text-stone-400 mb-0.5">{m.label}</p>
              <p className={`text-xl font-semibold ${m.cls}`}>{m.value}</p>
            </div>
          ))}
        </div>

        {/* Split bar: Ontario vs Toronto */}
        {location === "toronto" && (
          <div className="mt-3">
            <div className="flex rounded-full overflow-hidden h-3">
              <div className="bg-blue-400 h-full transition-all duration-500"
                style={{ width: `${r.totalTaxAfterRebates > 0 ? (r.ontarioLttNet / r.totalTaxAfterRebates) * 100 : 50}%` }} />
              <div className="bg-red-400 h-full flex-1 transition-all duration-500" />
            </div>
            <div className="flex gap-4 mt-1.5 text-[10px] text-stone-400">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-blue-400 inline-block" />Ontario LTT {fmtCAD(r.ontarioLttNet)}</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-400 inline-block" />Toronto MLTT {fmtCAD(r.torontoMlttNet)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">

        {/* ── Inputs ──────────────────────────────────────────── */}
        <div className="border-r border-stone-100 p-5 overflow-y-auto lg:max-h-[750px]">

          <SectionLabel>Purchase price</SectionLabel>
          <div className="relative mb-4">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-medium pointer-events-none">$</span>
            <input type="number" value={price} min={0} step={5000}
              onChange={e => setPrice(Math.max(0, Number(e.target.value)))}
              className="w-full pl-7 pr-3 py-3 text-xl font-semibold border border-stone-200 rounded-xl bg-white focus:outline-none focus:border-red-400" />
          </div>

          <SectionLabel>Location</SectionLabel>
          <div className="flex flex-col gap-2 mb-1">
            {([
              { v: "toronto" as Location,       l: "Toronto",         note: "Ontario + Toronto MLTT" },
              { v: "ontario_other" as Location, l: "Rest of Ontario",  note: "Ontario LTT only" },
            ]).map(o => (
              <button key={o.v} onClick={() => setLocation(o.v)}
                className={`flex-1 py-2.5 px-3 rounded-xl border text-left text-xs transition-colors ${location === o.v ? "bg-red-50 border-red-300" : "border-stone-200 hover:bg-stone-50"}`}>
                <span className={`font-semibold ${location === o.v ? "text-red-700" : "text-stone-700"}`}>{o.l}</span>
                <p className={`mt-0.5 ${location === o.v ? "text-red-500" : "text-stone-400"}`}>{o.note}</p>
              </button>
            ))}
          </div>

          <SectionLabel>Property type</SectionLabel>
          <div className="flex gap-2 mb-1">
            {([
              { v: "residential" as PropertyType,     l: "Residential" },
              { v: "non_residential" as PropertyType, l: "Commercial / other" },
            ]).map(o => (
              <button key={o.v} onClick={() => setPropType(o.v)}
                className={`flex-1 py-2 text-xs rounded-lg border transition-colors ${propType === o.v ? "bg-red-50 border-red-300 text-red-700 font-medium" : "border-stone-200 text-stone-500 hover:bg-stone-50"}`}>
                {o.l}
              </button>
            ))}
          </div>

          <SectionLabel>Buyer details</SectionLabel>
          <div className="space-y-4">
            <Toggle
              checked={isFthb} onChange={setIsFthb}
              label="First-time home buyer"
              hint="Eligible for Ontario rebate (up to $4,000) and Toronto rebate (up to $4,475)"
            />

            {isFthb && (
              <div className="ml-11 space-y-3 pt-1">
                <Toggle
                  checked={hasCoBuyer} onChange={setHasCoBuyer}
                  label="Co-buyer who is NOT a first-time buyer"
                  hint="Rebate is proportional to your ownership share"
                />
                {hasCoBuyer && (
                  <div className="pt-1">
                    <label className="block text-xs text-stone-500 mb-2">Your ownership share (%)</label>
                    <div className="flex items-center gap-3">
                      <input type="range" min={1} max={99} step={1} value={fthbShare}
                        onChange={e => setFthbShare(Number(e.target.value))}
                        className="flex-1 accent-red-500 h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer" />
                      <span className="text-sm font-semibold text-stone-700 min-w-[40px]">{fthbShare}%</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <Toggle
              checked={buyerType === "non_resident"}
              onChange={v => setBuyerType(v ? "non_resident" : "canadian")}
              label="Non-resident / foreign buyer"
              hint="Non-Resident Speculation Tax (NRST) of 25% applies on residential"
            />
          </div>

          {/* Quick facts card */}
          <div className="mt-8 bg-stone-50 rounded-xl p-4 text-xs space-y-2.5 text-stone-500 border border-stone-100">
            <p className="font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Quick reference
            </p>
            <div className="flex justify-between">
              <span>Ontario LTT (gross)</span>
              <span className="font-medium text-stone-700">{fmtCAD(r.ontarioLtt)}</span>
            </div>
            {location === "toronto" && (
              <div className="flex justify-between">
                <span>Toronto MLTT (gross)</span>
                <span className="font-medium text-stone-700">{fmtCAD(r.torontoMltt)}</span>
              </div>
            )}
            {r.totalRebates > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Total FTHB rebates</span>
                <span className="font-medium">− {fmtCAD(r.totalRebates)}</span>
              </div>
            )}
            {r.nrstApplies && (
              <div className="flex justify-between text-red-600">
                <span>NRST (25%)</span>
                <span className="font-medium">{fmtCAD(r.nrst)}</span>
              </div>
            )}
            <div className="border-t border-stone-200 pt-3 flex justify-between font-bold text-stone-800">
              <span>Total payable</span>
              <span>{fmtCAD(r.totalTaxAfterRebates)}</span>
            </div>
          </div>
        </div>

        {/* ── Results ──────────────────────────────────────────── */}
        <div className="p-5 sm:p-6">
          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-stone-100 rounded-xl p-1">
            {(["result", "breakdown", "compare"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all capitalize ${tab === t ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}>
                {t === "compare" ? "Price comparison" : t === "breakdown" ? "Bracket detail" : "Result"}
              </button>
            ))}
          </div>

          {/* ── Result ──────────── */}
          {tab === "result" && (
            <div className="space-y-5 animate-in fade-in duration-500">
              {/* Main breakdown */}
              <div className="rounded-2xl border border-stone-200 overflow-hidden bg-white">
                <div className="bg-stone-50/50 px-5 py-3.5 border-b border-stone-200">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                    LTT calculation summary
                  </p>
                </div>
                <div className="divide-y divide-stone-100">
                  {[
                    { label: "Purchase price",              value: fmtCAD(price),                        cls: "text-stone-900 font-bold" },
                    { label: "Ontario LTT (gross)",         value: fmtCAD(r.ontarioLtt),                 cls: "text-red-600 font-medium" },
                    ...(r.ontarioFthbRebate > 0 ? [{ label: "  Less: Ontario FTHB rebate", value: `− ${fmtCAD(r.ontarioFthbRebate)}`, cls: "text-green-600" }] : []),
                    { label: "Ontario LTT (net)",           value: fmtCAD(r.ontarioLttNet),              cls: "text-stone-900 font-semibold", divider: true },
                    ...(location === "toronto" ? [
                      { label: "Toronto MLTT (gross)",      value: fmtCAD(r.torontoMltt),               cls: "text-red-600 font-medium" },
                      ...(r.torontoFthbRebate > 0 ? [{ label: "  Less: Toronto MLTT rebate", value: `− ${fmtCAD(r.torontoFthbRebate)}`, cls: "text-green-600" }] : []),
                      { label: "Toronto MLTT (net)",        value: fmtCAD(r.torontoMlttNet),            cls: "text-stone-900 font-semibold", divider: true },
                    ] : []),
                    ...(r.nrstApplies ? [{ label: "Non-Resident Speculation Tax (25%)", value: fmtCAD(r.nrst), cls: "text-red-700 font-medium" }] : []),
                    { label: "TOTAL land transfer tax",    value: fmtCAD(r.totalTaxAfterRebates),        cls: "text-red-700 font-extrabold text-lg", divider: true },
                    { label: "Effective tax rate",          value: fmtPct(r.effectiveRate),               cls: "text-stone-500 font-medium" },
                  ].map((row, i) => (
                    <div key={i} className={`flex items-center justify-between px-5 py-4 ${(row as any).divider ? "bg-stone-50/30" : ""}`}>
                      <p className={`text-sm ${(row as any).divider ? "font-semibold text-stone-700" : row.label.startsWith("  ") ? "pl-5 text-stone-400" : "text-stone-500"}`}>
                        {row.label.replace(/^\s+/, "")}
                      </p>
                      <p className={`text-sm tabular-nums ${row.cls}`}>{row.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toronto vs Ontario callout */}
              {location === "toronto" && (
                <InfoBox colour="amber">
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                    <div>
                      <strong className="block mb-1">Toronto "Double" Tax</strong>
                      <span>Buyers in Toronto pay both provincial and municipal LTT. On this purchase, the Toronto MLTT adds <strong>{fmtCAD(r.torontoMltt)}</strong> on top of the provincial tax — making your total tax burden <strong>{fmtPct(r.torontoTaxVsOntarioPct, 0)} higher</strong> than if you bought elsewhere in Ontario.</span>
                    </div>
                  </div>
                </InfoBox>
              )}

              {isFthb && (
                <InfoBox colour="green">
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                    <div>
                      <strong className="block mb-1">First-Time Buyer Rebates Applied</strong>
                      <span>You've saved a total of <strong>{fmtCAD(r.totalRebates)}</strong>. This includes the Ontario rebate ({fmtCAD(r.ontarioFthbRebate)}){location === "toronto" ? ` and the Toronto rebate (${fmtCAD(r.torontoFthbRebate)})` : ""}.
                      {hasCoBuyer && ` (Adjusted for ${fthbShare}% ownership)`}</span>
                    </div>
                  </div>
                </InfoBox>
              )}

              {r.nrstApplies && (
                <InfoBox colour="red">
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                    <div>
                      <strong className="block mb-1">Non-Resident Speculation Tax</strong>
                      <span>NRST of 25% (<strong>{fmtCAD(r.nrst)}</strong>) is calculated on the full purchase price. This is due in addition to standard LTT. Consult a real estate lawyer for potential exemptions.</span>
                    </div>
                  </div>
                </InfoBox>
              )}
            </div>
          )}

          {/* ── Bracket detail ──────── */}
          {tab === "breakdown" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Ontario brackets */}
              <div>
                <p className="text-xs font-bold text-stone-500 mb-3 uppercase tracking-wider">Ontario LTT Brackets</p>
                <div className="rounded-xl border border-stone-200 overflow-hidden shadow-sm">
                  <table className="w-full text-xs">
                    <thead className="bg-blue-50/50 border-b border-stone-200">
                      <tr>
                        <th className="py-3 px-4 text-left font-semibold text-stone-600">Bracket Range</th>
                        <th className="py-3 px-4 text-right font-semibold text-stone-600">Rate</th>
                        <th className="py-3 px-4 text-right font-semibold text-stone-600">Taxable</th>
                        <th className="py-3 px-4 text-right font-semibold text-stone-600">Tax</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {r.ontarioLttBrackets.map((b, i) => (
                        <tr key={i} className="hover:bg-stone-50 transition-colors">
                          <td className="py-3 px-4 text-stone-600 font-medium">{b.range}</td>
                          <td className="py-3 px-4 text-right"><span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">{b.rate}</span></td>
                          <td className="py-3 px-4 text-right text-stone-500 tabular-nums">{fmtCAD(b.taxableAmount)}</td>
                          <td className="py-3 px-4 text-right font-bold text-blue-700 tabular-nums">{fmtCAD(b.marginalTax)}</td>
                        </tr>
                      ))}
                      <tr className="bg-stone-50/80">
                        <td colSpan={2} className="py-3 px-4 font-bold text-stone-800 text-sm">Ontario LTT Total (Gross)</td>
                        <td />
                        <td className="py-3 px-4 text-right font-extrabold text-blue-800 text-sm tabular-nums">{fmtCAD(r.ontarioLtt)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {r.ontarioFthbRebate > 0 && (
                  <div className="flex justify-between items-center mt-2.5 px-2 text-[11px]">
                    <span className="text-stone-400">Less Ontario FTHB Rebate</span>
                    <span className="text-green-600 font-bold">− {fmtCAD(r.ontarioFthbRebate)}</span>
                  </div>
                )}
              </div>

              {/* Toronto brackets */}
              {location === "toronto" && r.torontoMlttBrackets.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-stone-500 mb-3 uppercase tracking-wider">Toronto MLTT Brackets</p>
                  <div className="rounded-xl border border-stone-200 overflow-hidden shadow-sm">
                    <table className="w-full text-xs">
                      <thead className="bg-red-50/50 border-b border-stone-200">
                        <tr>
                          <th className="py-3 px-4 text-left font-semibold text-stone-600">Bracket Range</th>
                          <th className="py-3 px-4 text-right font-semibold text-stone-600">Rate</th>
                          <th className="py-3 px-4 text-right font-semibold text-stone-600">Taxable</th>
                          <th className="py-3 px-4 text-right font-semibold text-stone-600">Tax</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {r.torontoMlttBrackets.map((b, i) => (
                          <tr key={i} className="hover:bg-stone-50 transition-colors">
                            <td className="py-3 px-4 text-stone-600 font-medium">{b.range}</td>
                            <td className="py-3 px-4 text-right"><span className="px-1.5 py-0.5 rounded bg-red-50 text-red-700 font-bold">{b.rate}</span></td>
                            <td className="py-3 px-4 text-right text-stone-500 tabular-nums">{fmtCAD(b.taxableAmount)}</td>
                            <td className="py-3 px-4 text-right font-bold text-red-700 tabular-nums">{fmtCAD(b.marginalTax)}</td>
                          </tr>
                        ))}
                        <tr className="bg-stone-50/80">
                          <td colSpan={2} className="py-3 px-4 font-bold text-stone-800 text-sm">Toronto MLTT Total (Gross)</td>
                          <td />
                          <td className="py-3 px-4 text-right font-extrabold text-red-800 text-sm tabular-nums">{fmtCAD(r.torontoMltt)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {r.torontoFthbRebate > 0 && (
                    <div className="flex justify-between items-center mt-2.5 px-2 text-[11px]">
                      <span className="text-stone-400">Less Toronto FTHB Rebate</span>
                      <span className="text-green-600 font-bold">− {fmtCAD(r.torontoFthbRebate)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── Price comparison ────── */}
          {tab === "compare" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs text-stone-500 leading-relaxed max-w-[400px]">
                  Estimated taxes at common purchase prices for your selected {location === "toronto" ? "Toronto" : "Ontario"} location.
                </p>
                <div className="flex items-center gap-2 text-[10px] text-stone-400">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> Current selection
                </div>
              </div>
              <div className="rounded-xl border border-stone-200 overflow-hidden shadow-sm lg:max-h-[500px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-white border-b border-stone-200 z-10">
                    <tr>
                      <th className="py-3.5 px-4 text-left font-bold text-stone-900">Purchase Price</th>
                      <th className="py-3.5 px-4 text-right font-semibold text-blue-600 bg-blue-50/30">Ontario LTT</th>
                      {location === "toronto" && <th className="py-3.5 px-4 text-right font-semibold text-red-600 bg-red-50/30">Toronto MLTT</th>}
                      <th className="py-3.5 px-4 text-right font-bold text-stone-900">Total Net Tax</th>
                      <th className="py-3.5 px-4 text-right font-medium text-stone-400">Eff. Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {compareData.map((row, i) => {
                      const isCurrent = row.price === price;
                      const effRate = row.price > 0 ? (row.totalNet / row.price) * 100 : 0;
                      return (
                        <tr key={i} className={`transition-colors ${isCurrent ? "bg-red-50/40" : "hover:bg-stone-50"}`}>
                          <td className="py-3.5 px-4 font-bold text-stone-800">
                            {fmtCADShort(row.price)}
                            {isCurrent && <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-red-500" />}
                          </td>
                          <td className="py-3.5 px-4 text-right text-blue-700 font-medium tabular-nums">{fmtCADShort(row.ontario)}</td>
                          {location === "toronto" && <td className="py-3.5 px-4 text-right text-red-600 font-medium tabular-nums">{fmtCADShort(row.toronto)}</td>}
                          <td className="py-3.5 px-4 text-right font-extrabold text-stone-900 tabular-nums">{fmtCADShort(row.totalNet)}</td>
                          <td className="py-3.5 px-4 text-right text-stone-400 font-medium">{fmtPct(effRate, 1)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
