"use client";

import { useState, useMemo } from "react";
import {
  calculateTax,
  compareAllProvinces,
  fmtCAD,
  fmtPct,
  PROVINCE_MAP,
  type ProvinceCode,
  type CalcMode,
} from "@/lib/canadaTax";

const PROVINCE_GROUPS = [
  { label: "HST Provinces",       codes: ["ON","NB","NS","NL","PE"] as ProvinceCode[] },
  { label: "GST + PST Provinces", codes: ["BC","SK","MB"] as ProvinceCode[] },
  { label: "GST + QST",           codes: ["QC"] as ProvinceCode[] },
  { label: "GST Only",            codes: ["AB","YT","NT","NU"] as ProvinceCode[] },
];

const TYPE_COLOUR: Record<string, string> = {
  HST:       "bg-blue-100 text-blue-700",
  "GST+PST": "bg-emerald-100 text-emerald-700",
  "GST+QST": "bg-purple-100 text-purple-700",
  GST:       "bg-stone-100 text-stone-600",
};

const QUICK = [10, 20, 25, 50, 100, 250, 500, 1000];

export default function CanadaTaxCalculator() {
  const [amount,   setAmount]   = useState(100);
  const [province, setProvince] = useState<ProvinceCode>("ON");
  const [mode,     setMode]     = useState<CalcMode>("add_tax");
  const [tab,      setTab]      = useState<"result"|"breakdown"|"compare">("result");

  const result       = useMemo(() => calculateTax(amount, province, mode),  [amount, province, mode]);
  const allProvinces = useMemo(() => compareAllProvinces(amount, mode),      [amount, mode]);
  const quickRows    = useMemo(() => QUICK.map(v => calculateTax(v, province, "add_tax")), [province]);

  const prov  = PROVINCE_MAP[province];
  const isHST = prov.taxType === "HST";

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">

      {/* Banner */}
      <div className="bg-red-50 border-b border-red-100 px-5 py-4">
        <div className="flex flex-wrap gap-6 items-center">
          <div>
            <p className="text-xs text-stone-400 mb-0.5">
              {mode === "add_tax" ? "Total including tax" : "Pre-tax amount"}
            </p>
            <p className="text-4xl font-bold text-stone-900 leading-none">
              {mode === "add_tax" ? fmtCAD(result.totalWithTax) : fmtCAD(result.preTaxAmount)}
            </p>
          </div>
          <div className="h-10 w-px bg-red-200 hidden sm:block" />
          <div><p className="text-xs text-stone-400 mb-0.5">Tax amount</p><p className="text-2xl font-semibold text-red-600">{fmtCAD(result.totalTaxAmount)}</p></div>
          <div><p className="text-xs text-stone-400 mb-0.5">Tax rate</p><p className="text-2xl font-semibold text-stone-700">{fmtPct(result.totalRate)}</p></div>
          <span className={`text-sm font-semibold px-2.5 py-1 rounded-full self-center ${TYPE_COLOUR[prov.taxType]}`}>
            {result.taxTypeLabel}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">

        {/* Inputs */}
        <div className="border-r border-stone-100 p-5 space-y-5">

          {/* Mode toggle */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Calculate</p>
            <div className="flex gap-1 bg-stone-100 rounded-lg p-1">
              {([{v:"add_tax",l:"Add tax"},{v:"remove_tax",l:"Remove tax"}] as {v:CalcMode,l:string}[]).map(o=>(
                <button key={o.v} onClick={()=>setMode(o.v)}
                  className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${mode===o.v?"bg-white text-stone-800 shadow-sm":"text-stone-500 hover:text-stone-700"}`}>
                  {o.l}
                </button>
              ))}
            </div>
            <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
              {mode==="add_tax" ? "Enter a pre-tax price to see what to charge the customer." : "Enter a price with tax included to extract the tax."}
            </p>
          </div>

          {/* Amount */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">
              {mode==="add_tax" ? "Pre-tax amount (CAD)" : "Tax-inclusive amount (CAD)"}
            </p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-medium pointer-events-none">$</span>
              <input type="number" value={amount} min={0} step={0.01}
                onChange={e=>setAmount(Math.max(0,Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-3 text-xl font-semibold border border-stone-200 rounded-xl bg-white focus:outline-none focus:border-red-400" />
            </div>
          </div>

          {/* Province */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Province / Territory</p>
            <select value={province} onChange={e=>setProvince(e.target.value as ProvinceCode)}
              className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:border-red-400">
              {PROVINCE_GROUPS.map(group=>(
                <optgroup key={group.label} label={group.label}>
                  {group.codes.map(code=>{
                    const p=PROVINCE_MAP[code];
                    return <option key={code} value={code}>{p.name} — {fmtPct(p.totalRate)}</option>;
                  })}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Province card */}
          <div className="bg-stone-50 rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-stone-800">{prov.name}</p>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_COLOUR[prov.taxType]}`}>{prov.taxType}</span>
            </div>
            <div className="space-y-1 text-xs text-stone-500">
              {isHST ? (
                <>
                  <div className="flex justify-between"><span>HST (combined)</span><span className="font-semibold text-stone-700">{fmtPct(prov.hst)}</span></div>
                  <div className="flex justify-between pl-3 text-stone-400"><span>↳ Federal (GST portion)</span><span>5%</span></div>
                  <div className="flex justify-between pl-3 text-stone-400"><span>↳ Provincial portion</span><span>{fmtPct(prov.hst-0.05)}</span></div>
                </>
              ) : (
                <>
                  <div className="flex justify-between"><span>GST (federal)</span><span className="font-semibold text-stone-700">{fmtPct(prov.gst)}</span></div>
                  {prov.pst>0 && <div className="flex justify-between"><span>{prov.pstLabel} (provincial)</span><span className="font-semibold text-stone-700">{fmtPct(prov.pst)}</span></div>}
                  <div className="flex justify-between border-t border-stone-200 pt-1 mt-1">
                    <span className="font-medium text-stone-600">Total</span>
                    <span className="font-bold text-stone-800">{fmtPct(prov.totalRate)}</span>
                  </div>
                </>
              )}
            </div>
            {prov.notes && <p className="text-xs text-stone-400 mt-2 leading-relaxed">{prov.notes}</p>}
          </div>
        </div>

        {/* Results */}
        <div className="p-5">
          {/* Tabs */}
          <div className="flex gap-1 mb-5 bg-stone-100 rounded-lg p-1">
            {(["result","breakdown","compare"] as const).map(t=>(
              <button key={t} onClick={()=>setTab(t)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${tab===t?"bg-white text-stone-800 shadow-sm":"text-stone-500 hover:text-stone-700"}`}>
                {t==="compare"?"All provinces":t==="breakdown"?"Breakdown":"Result"}
              </button>
            ))}
          </div>

          {/* Result tab */}
          {tab==="result" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-stone-200 overflow-hidden">
                <div className="bg-stone-50 px-4 py-2.5 border-b border-stone-200">
                  <p className="text-xs font-medium text-stone-500">
                    {mode==="add_tax" ? `Adding ${result.taxTypeLabel} in ${prov.name}` : `Extracting ${result.taxTypeLabel} from ${prov.name}`}
                  </p>
                </div>
                <div className="divide-y divide-stone-100">
                  {[
                    {label: mode==="add_tax"?"Pre-tax amount":"Tax-inclusive price", value: fmtCAD(mode==="add_tax"?result.preTaxAmount:result.inputAmount), bold:false, cls:"text-stone-700", sub:""},
                    ...(isHST
                      ? [{label:`HST (${fmtPct(prov.hst)})`, value:fmtCAD(result.hstAmount), bold:false, cls:"text-red-600", sub:`Federal: ${fmtCAD(result.gstAmount)} · Provincial: ${fmtCAD(result.pstAmount)}`}]
                      : [
                          {label:`GST (${fmtPct(prov.gst)})`, value:fmtCAD(result.gstAmount), bold:false, cls:"text-red-600", sub:""},
                          ...(prov.pst>0?[{label:`${prov.pstLabel} (${fmtPct(prov.pst)})`, value:fmtCAD(result.pstAmount), bold:false, cls:"text-red-600", sub:""}]:[]),
                        ]
                    ),
                    {label:"Total tax", value:fmtCAD(result.totalTaxAmount), bold:true, cls:"text-red-600", sub:""},
                    {label:mode==="add_tax"?"Total with tax":"Pre-tax amount", value:mode==="add_tax"?fmtCAD(result.totalWithTax):fmtCAD(result.preTaxAmount), bold:true, cls:"text-stone-900", sub:""},
                  ].map((row,i)=>(
                    <div key={i} className={`px-4 py-3 flex items-center justify-between ${row.bold?"bg-stone-50":""}`}>
                      <div>
                        <p className={`text-sm ${row.bold?"font-semibold text-stone-800":"text-stone-600"}`}>{row.label}</p>
                        {row.sub && <p className="text-xs text-stone-400 mt-0.5">{row.sub}</p>}
                      </div>
                      <p className={`text-sm font-semibold tabular-nums ${row.cls}`}>{row.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {label:"Pre-tax",  value:fmtCAD(result.preTaxAmount),   bg:"bg-stone-50", cls:"text-stone-900"},
                  {label:"Tax",      value:fmtCAD(result.totalTaxAmount),  bg:"bg-red-50",   cls:"text-red-600"},
                  {label:"Total",    value:fmtCAD(result.totalWithTax),    bg:"bg-stone-50", cls:"text-stone-900"},
                  {label:"Rate",     value:fmtPct(result.totalRate),       bg:"bg-stone-50", cls:"text-stone-900"},
                ].map(m=>(
                  <div key={m.label} className={`${m.bg} rounded-xl p-3.5`}>
                    <p className="text-xs text-stone-400 mb-1">{m.label}</p>
                    <p className={`text-xl font-bold ${m.cls}`}>{m.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Breakdown tab */}
          {tab==="breakdown" && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-stone-400 mb-2">How {fmtCAD(result.totalWithTax)} breaks down</p>
                <div className="flex rounded-full overflow-hidden h-8">
                  <div className="bg-teal-500 flex items-center justify-center text-white text-xs font-medium"
                    style={{width:`${(result.preTaxAmount/result.totalWithTax)*100}%`}}>
                    {((result.preTaxAmount/result.totalWithTax)*100).toFixed(1)}%
                  </div>
                  {isHST ? (
                    <div className="bg-red-400 flex-1 flex items-center justify-center text-white text-xs font-medium">
                      HST {((result.hstAmount/result.totalWithTax)*100).toFixed(1)}%
                    </div>
                  ) : (
                    <>
                      <div className="bg-red-400 flex items-center justify-center text-white text-xs font-medium"
                        style={{width:`${(result.gstAmount/result.totalWithTax)*100}%` }}>GST</div>
                      {result.pstAmount>0 && (
                        <div className="bg-orange-400 flex-1 flex items-center justify-center text-white text-xs font-medium">
                          {prov.pstLabel}
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 mt-2 text-xs text-stone-500">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-teal-500 inline-block"/>Pre-tax {fmtCAD(result.preTaxAmount)}</span>
                  {isHST
                    ? <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-400 inline-block"/>HST {fmtCAD(result.hstAmount)}</span>
                    : <>
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-400 inline-block"/>GST {fmtCAD(result.gstAmount)}</span>
                        {result.pstAmount>0 && <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-orange-400 inline-block"/>{prov.pstLabel} {fmtCAD(result.pstAmount)}</span>}
                      </>
                  }
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-stone-400 mb-2">Common amounts — {prov.name} ({fmtPct(prov.totalRate)})</p>
                <div className="rounded-xl border border-stone-200 overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200">
                      <tr>
                        <th className="py-2 px-3 text-left font-medium text-stone-500">Pre-tax</th>
                        {isHST
                          ? <th className="py-2 px-3 text-right font-medium text-stone-500">HST</th>
                          : <>
                              <th className="py-2 px-3 text-right font-medium text-stone-500">GST</th>
                              {prov.pst>0 && <th className="py-2 px-3 text-right font-medium text-stone-500">{prov.pstLabel}</th>}
                            </>
                        }
                        <th className="py-2 px-3 text-right font-medium text-stone-500">Tax</th>
                        <th className="py-2 px-3 text-right font-medium text-stone-500">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quickRows.map((r2,i)=>(
                        <tr key={i} className={`border-b border-stone-100 last:border-0 ${QUICK[i]===amount?"bg-red-50/60":"hover:bg-stone-50"}`}>
                          <td className="py-2 px-3 text-stone-600">{fmtCAD(QUICK[i],0)}{QUICK[i]===amount?" ★":""}</td>
                          {isHST
                            ? <td className="py-2 px-3 text-right text-red-600">{fmtCAD(r2.hstAmount)}</td>
                            : <>
                                <td className="py-2 px-3 text-right text-red-600">{fmtCAD(r2.gstAmount)}</td>
                                {prov.pst>0 && <td className="py-2 px-3 text-right text-orange-600">{fmtCAD(r2.pstAmount)}</td>}
                              </>
                          }
                          <td className="py-2 px-3 text-right font-medium text-stone-700">{fmtCAD(r2.totalTaxAmount)}</td>
                          <td className="py-2 px-3 text-right font-semibold text-stone-900">{fmtCAD(r2.totalWithTax)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-stone-400 mt-1.5">★ = your entered amount</p>
              </div>
            </div>
          )}

          {/* Compare tab */}
          {tab==="compare" && (
            <div>
              <p className="text-xs font-medium text-stone-400 mb-3">Tax on {fmtCAD(amount)} across all Canadian provinces and territories</p>
              <div className="rounded-xl border border-stone-200 overflow-hidden max-h-[500px] overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-stone-50 border-b border-stone-200">
                    <tr>
                      <th className="py-2.5 px-3 text-left font-medium text-stone-500">Province / Territory</th>
                      <th className="py-2.5 px-3 text-center font-medium text-stone-500">Type</th>
                      <th className="py-2.5 px-3 text-right font-medium text-stone-500">Rate</th>
                      <th className="py-2.5 px-3 text-right font-medium text-stone-500">Tax</th>
                      <th className="py-2.5 px-3 text-right font-medium text-stone-500">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allProvinces.sort((a,b)=>b.totalRate-a.totalRate).map(r2=>(
                      <tr key={r2.province.code}
                        className={`border-b border-stone-100 last:border-0 ${r2.province.code===province?"bg-red-50/70":"hover:bg-stone-50"}`}>
                        <td className="py-2.5 px-3 font-medium text-stone-700">
                          {r2.province.name}{r2.province.code===province?" ★":""}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${TYPE_COLOUR[r2.province.taxType]}`}>
                            {r2.province.taxType}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right text-stone-600">{fmtPct(r2.totalRate)}</td>
                        <td className="py-2.5 px-3 text-right text-red-600 font-medium">{fmtCAD(r2.totalTaxAmount)}</td>
                        <td className="py-2.5 px-3 text-right font-semibold text-stone-900">{fmtCAD(r2.totalWithTax)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-stone-400 mt-2">Sorted highest to lowest. ★ = your selected province.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
