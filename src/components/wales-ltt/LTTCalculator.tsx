"use client";

import React, { useState, useMemo } from "react";
import {
  calculateLTT,
  formatCurrencyGBP,
  getBuyerTypeLabel,
  type WalesBuyerType,
  type LTTResult,
} from "@/lib/calculators/walesLTT";

export default function LTTCalculator() {
  const [propertyValue, setPropertyValue] = useState<string>("350000");
  const [buyerType, setBuyerType] = useState<WalesBuyerType>("main-residence");
  const [showExamples, setShowExamples] = useState(false);

  const result: LTTResult | null = useMemo(() => {
    const value = parseFloat(propertyValue.replace(/[^0-9.]/g, "")) || 0;
    if (value <= 0) return null;
    return calculateLTT(value, buyerType);
  }, [propertyValue, buyerType]);

  const presetExamples = [
    { label: "First Home Cardiff (£280k)", value: "280000", type: "main-residence" as WalesBuyerType },
    { label: "Family Home Swansea (£420k)", value: "420000", type: "main-residence" as WalesBuyerType },
    { label: "Buy-to-Let Wrexham (£200k)", value: "200000", type: "additional-property" as WalesBuyerType },
    { label: "Holiday Home Anglesey (£350k)", value: "350000", type: "additional-property" as WalesBuyerType },
    { label: "Company Purchase (£500k)", value: "500000", type: "company" as WalesBuyerType },
  ];

  const applyExample = (ex: (typeof presetExamples)[0]) => {
    setPropertyValue(ex.value);
    setBuyerType(ex.type);
  };

  const copyResults = () => {
    if (!result) return;
    const lines = result.breakdown
      .filter((b) => b.duty > 0)
      .map((b) => `${b.band}: ${formatCurrencyGBP(b.duty)} (${(b.rate * 100).toFixed(1)}%)`);

    const text = `Wales Land Transaction Tax (LTT) Calculation
Property Value: ${formatCurrencyGBP(parseFloat(propertyValue.replace(/[^0-9.]/g, "")) || 0)}
Buyer Type: ${getBuyerTypeLabel(buyerType)}
Total LTT: ${formatCurrencyGBP(result.totalLTT)}
Effective Rate: ${result.effectiveRate.toFixed(2)}%

Breakdown:
${lines.join("\n")}
`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Calculator Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-red-700 to-rose-600 px-6 py-5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Calculate Your Wales Land Transaction Tax
          </h2>
          <p className="text-red-100 text-sm mt-1">Updated with 2026 higher rates & current main residential bands</p>
        </div>

        <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-5">
            {/* Property Value */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Property Price (£) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">£</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={propertyValue}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    setPropertyValue(raw);
                  }}
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition text-slate-900 font-medium"
                  placeholder="e.g. 350000"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Enter the agreed purchase price or market valuation</p>
            </div>

            {/* Buyer Type */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Buyer Type</label>
              <select
                value={buyerType}
                onChange={(e) => setBuyerType(e.target.value as WalesBuyerType)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition text-slate-900 bg-white"
              >
                <option value="main-residence">Main Residence (No Other Properties Owned)</option>
                <option value="additional-property">Additional Property / Second Home / Buy-to-Let</option>
                <option value="company">Company / Corporate Body</option>
                <option value="trust">Trust</option>
              </select>
              {buyerType === "main-residence" && (
                <p className="text-xs text-emerald-700 mt-2 bg-emerald-50 p-2 rounded border border-emerald-200">
                  <strong>Good news:</strong> No LTT is payable on main residences up to £225,000 in Wales.
                </p>
              )}
              {buyerType === "additional-property" && (
                <p className="text-xs text-rose-700 mt-2 bg-rose-50 p-2 rounded border border-rose-200">
                  <strong>Higher rates apply:</strong> A surcharge is added to every band. You may claim a refund if you sell your previous main residence within 36 months.
                </p>
              )}
              {buyerType === "company" && (
                <p className="text-xs text-amber-700 mt-2 bg-amber-50 p-2 rounded border border-amber-200">
                  <strong>Company rules:</strong> Companies must pay higher residential rates on all residential purchases over £40,000, unless the property has a lease of 21 years or less remaining.
                </p>
              )}
            </div>

            {/* Quick Examples */}
            <div>
              <button
                onClick={() => setShowExamples(!showExamples)}
                className="text-sm text-red-700 font-medium hover:underline flex items-center gap-1"
              >
                Quick Scenarios {showExamples ? "▲" : "▼"}
              </button>
              {showExamples && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {presetExamples.map((ex) => (
                    <button
                      key={ex.label}
                      onClick={() => applyExample(ex)}
                      className="text-left px-3 py-2 rounded-lg border border-slate-200 hover:border-red-400 hover:bg-red-50 transition text-xs font-medium text-slate-700"
                    >
                      {ex.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Results Panel */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            {result ? (
              <div className="space-y-5">
                <div className="text-center pb-4 border-b border-slate-200">
                  <p className="text-sm text-slate-500 mb-1">Total Land Transaction Tax</p>
                  <p className="text-4xl font-extrabold text-slate-900 tracking-tight">{formatCurrencyGBP(result.totalLTT)}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Effective rate: <span className="font-semibold text-slate-700">{result.effectiveRate.toFixed(2)}%</span>
                  </p>
                </div>

                {/* Breakdown Table */}
                <div className="space-y-1">
                  <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-slate-500 uppercase bg-slate-100 rounded px-2 py-1.5">
                    <span>Band</span>
                    <span className="text-right">Amount</span>
                    <span className="text-right">Rate</span>
                    <span className="text-right">Tax</span>
                  </div>
                  {result.breakdown.map((item, i) => (
                    <div
                      key={i}
                      className={`grid grid-cols-4 gap-2 text-sm px-2 py-1.5 rounded ${item.duty > 0 ? "bg-white border border-slate-100" : "text-slate-400"
                        }`}
                    >
                      <span className="text-slate-700">{item.band}</span>
                      <span className="text-right text-slate-600">{formatCurrencyGBP(item.amount)}</span>
                      <span className="text-right text-slate-600">{(item.rate * 100).toFixed(1)}%</span>
                      <span className="text-right font-semibold text-slate-900">{formatCurrencyGBP(item.duty)}</span>
                    </div>
                  ))}
                </div>

                {/* Visual Bar */}
                {result.breakdown.some((b) => b.duty > 0) && (
                  <div className="pt-2">
                    <div className="h-4 w-full rounded-full overflow-hidden flex">
                      {result.breakdown
                        .filter((b) => b.duty > 0)
                        .map((b, i) => (
                          <div
                            key={i}
                            className="h-full"
                            style={{
                              width: `${(b.duty / result.totalLTT) * 100}%`,
                              backgroundColor: ["#dc2626", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"][i % 6],
                            }}
                          />
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs">
                      {result.breakdown
                        .filter((b) => b.duty > 0)
                        .map((b, i) => (
                          <span key={i} className="flex items-center gap-1">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{
                                backgroundColor: ["#dc2626", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"][i % 6],
                              }}
                            />
                            {b.band.split("–")[0].trim()}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {result.notes.length > 0 && (
                  <div className="space-y-2">
                    {result.notes.map((note, i) => (
                      <div key={i} className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
                        {note}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={copyResults}
                    className="flex-1 py-2.5 px-4 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Results
                  </button>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                  <strong>Deadline:</strong> LTT must be paid to the Welsh Revenue Authority (WRA) within 30 days of the effective date (usually completion). Your solicitor typically files the return and pays on your behalf.
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
                <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <p className="text-sm">Enter a property price to see your LTT breakdown</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rate Tables */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Main Residential Rates
          </h3>
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
              <tr><th className="text-left py-1.5 px-2">Band</th><th className="text-right py-1.5 px-2">Rate</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { range: "Up to £225,000", rate: "0%" },
                { range: "£225,001 – £400,000", rate: "6%" },
                { range: "£400,001 – £750,000", rate: "7.5%" },
                { range: "£750,001 – £1.5M", rate: "10%" },
                { range: "Above £1.5M", rate: "12%" },
              ].map((r) => (
                <tr key={r.range} className="text-slate-700">
                  <td className="py-1.5 px-2 text-xs">{r.range}</td>
                  <td className="py-1.5 px-2 text-right font-medium text-xs">{r.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Higher Rates (Additional Property)
          </h3>
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
              <tr><th className="text-left py-1.5 px-2">Band</th><th className="text-right py-1.5 px-2">Rate</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { range: "Up to £180,000", rate: "5%" },
                { range: "£180,001 – £250,000", rate: "8.5%" },
                { range: "£250,001 – £400,000", rate: "10%" },
                { range: "£400,001 – £750,000", rate: "12.5%" },
                { range: "£750,001 – £1.5M", rate: "15%" },
                { range: "Above £1.5M", rate: "17%" },
              ].map((r) => (
                <tr key={r.range} className="text-slate-700">
                  <td className="py-1.5 px-2 text-xs">{r.range}</td>
                  <td className="py-1.5 px-2 text-right font-medium text-xs">{r.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-slate-500 mt-2">Effective from 11 December 2024</p>
        </div>
      </div>

      {/* Wales vs England Notice */}
      <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-bold text-indigo-900 text-sm">Wales vs England: Key Differences</h4>
            <p className="text-sm text-indigo-800 mt-1">
              Wales has <strong>no first-time buyer relief</strong> (unlike England's £300,000 nil-rate band for first-timers). However, Wales offers a more generous main residence threshold at <strong>£225,000</strong> vs England's £125,000. Wales also has <strong>no non-resident surcharge</strong> — overseas buyers pay the same rates as Welsh residents.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
