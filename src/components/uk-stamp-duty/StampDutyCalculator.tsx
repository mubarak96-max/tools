"use client";

import React, { useState, useMemo } from "react";
import {
  calculateSDLT,
  formatCurrencyGBP,
  getBuyerTypeLabel,
  type BuyerType,
  type PropertyLocation,
  type SDLTResult,
} from "@/lib/calculators/ukStampDuty";

export default function StampDutyCalculator() {
  const [propertyValue, setPropertyValue] = useState<string>("450000");
  const [buyerType, setBuyerType] = useState<BuyerType>("standard");
  const [location, setLocation] = useState<PropertyLocation>("england-ni");
  const [showExamples, setShowExamples] = useState(false);

  const result: SDLTResult | null = useMemo(() => {
    const value = parseFloat(propertyValue.replace(/[^0-9.]/g, "")) || 0;
    if (value <= 0) return null;
    return calculateSDLT(value, buyerType, location);
  }, [propertyValue, buyerType, location]);

  const presetExamples = [
    { label: "First Home (£300k)", value: "300000", type: "first-time" as BuyerType },
    { label: "Home Mover (£450k)", value: "450000", type: "standard" as BuyerType },
    { label: "Buy-to-Let (£350k)", value: "350000", type: "additional" as BuyerType },
    { label: "Luxury Home (£1.2M)", value: "1200000", type: "standard" as BuyerType },
    { label: "Non-Resident (£600k)", value: "600000", type: "non-resident" as BuyerType },
  ];

  const applyExample = (ex: (typeof presetExamples)[0]) => {
    setPropertyValue(ex.value);
    setBuyerType(ex.type);
    setLocation("england-ni");
  };

  const copyResults = () => {
    if (!result) return;
    const lines = result.breakdown
      .filter((b) => b.duty > 0)
      .map((b) => `${b.band}: ${formatCurrencyGBP(b.duty)} (${(b.rate * 100).toFixed(0)}%)`);
    
    const text = `UK Stamp Duty Calculation (England & NI)
Property Value: ${formatCurrencyGBP(parseFloat(propertyValue.replace(/[^0-9.]/g, "")) || 0)}
Buyer Type: ${getBuyerTypeLabel(buyerType)}
Total SDLT: ${formatCurrencyGBP(result.totalSDLT)}
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
        <div className="bg-gradient-to-r from-blue-800 to-indigo-700 px-6 py-5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Calculate Your UK Stamp Duty
          </h2>
          <p className="text-blue-100 text-sm mt-1">Updated with April 2025 SDLT changes & 5% second home surcharge</p>
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
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-900 font-medium"
                  placeholder="e.g. 450000"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Enter the agreed purchase price or market value</p>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Property Location</label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { value: "england-ni", label: "England & NI" },
                  { value: "scotland", label: "Scotland" },
                  { value: "wales", label: "Wales" },
                ] as { value: PropertyLocation; label: string }[]).map((loc) => (
                  <button
                    key={loc.value}
                    onClick={() => setLocation(loc.value)}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium transition ${
                      location === loc.value
                        ? "bg-blue-50 border-blue-500 text-blue-800"
                        : "border-slate-300 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {loc.label}
                  </button>
                ))}
              </div>
              {location !== "england-ni" && (
                <p className="text-xs text-amber-700 mt-2 bg-amber-50 p-2 rounded border border-amber-200">
                  <strong>Note:</strong> {location === "scotland" ? "Scotland uses LBTT" : "Wales uses LTT"}. This calculator provides approximate SDLT equivalents.
                </p>
              )}
            </div>

            {/* Buyer Type */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Buyer Type</label>
              <select
                value={buyerType}
                onChange={(e) => setBuyerType(e.target.value as BuyerType)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-900 bg-white"
              >
                <option value="first-time">First-Time Buyer (Main Residence)</option>
                <option value="standard">Standard / Home Mover (Main Residence)</option>
                <option value="additional">Additional Property / Buy-to-Let / Second Home</option>
                <option value="non-resident">Non-UK Resident (Main Residence)</option>
                <option value="first-time-additional">First-Time Buyer (Buy-to-Let)</option>
              </select>
              {buyerType === "first-time" && (
                <p className="text-xs text-emerald-700 mt-2 bg-emerald-50 p-2 rounded border border-emerald-200">
                  <strong>First-Time Buyer Relief:</strong> 0% on first £300,000 and 5% on £300,001–£500,000. Relief lost above £500,000.
                </p>
              )}
              {buyerType === "additional" && (
                <p className="text-xs text-rose-700 mt-2 bg-rose-50 p-2 rounded border border-rose-200">
                  <strong>5% Surcharge:</strong> A 5% additional property surcharge applies to all bands (increased from 3% on 31 October 2024).
                </p>
              )}
            </div>

            {/* Quick Examples */}
            <div>
              <button
                onClick={() => setShowExamples(!showExamples)}
                className="text-sm text-blue-700 font-medium hover:underline flex items-center gap-1"
              >
                Quick Scenarios {showExamples ? "▲" : "▼"}
              </button>
              {showExamples && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {presetExamples.map((ex) => (
                    <button
                      key={ex.label}
                      onClick={() => applyExample(ex)}
                      className="text-left px-3 py-2 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition text-xs font-medium text-slate-700"
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
                  <p className="text-sm text-slate-500 mb-1">Total Stamp Duty Land Tax</p>
                  <p className="text-4xl font-extrabold text-slate-900 tracking-tight">{formatCurrencyGBP(result.totalSDLT)}</p>
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
                    <span className="text-right">Duty</span>
                  </div>
                  {result.breakdown.map((item, i) => (
                    <div
                      key={i}
                      className={`grid grid-cols-4 gap-2 text-sm px-2 py-1.5 rounded ${
                        item.duty > 0 ? "bg-white border border-slate-100" : "text-slate-400"
                      }`}
                    >
                      <span className="text-slate-700">{item.band}</span>
                      <span className="text-right text-slate-600">{formatCurrencyGBP(item.amount)}</span>
                      <span className="text-right text-slate-600">{(item.rate * 100).toFixed(0)}%</span>
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
                              width: `${(b.duty / result.totalSDLT) * 100}%`,
                              backgroundColor: ["#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef"][i % 5],
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
                                backgroundColor: ["#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef"][i % 5],
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
                  <strong>Deadline:</strong> SDLT must be paid to HMRC within 14 days of completion. Your conveyancing solicitor typically handles this as part of the purchase process.
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
                <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <p className="text-sm">Enter a property price to see your SDLT breakdown</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rate Tables */}
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Standard Rates
          </h3>
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
              <tr><th className="text-left py-1.5 px-2">Band</th><th className="text-right py-1.5 px-2">Rate</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { range: "Up to £125,000", rate: "0%" },
                { range: "£125,001 – £250,000", rate: "2%" },
                { range: "£250,001 – £925,000", rate: "5%" },
                { range: "£925,001 – £1.5M", rate: "10%" },
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
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            First-Time Buyer
          </h3>
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
              <tr><th className="text-left py-1.5 px-2">Band</th><th className="text-right py-1.5 px-2">Rate</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { range: "Up to £300,000", rate: "0%" },
                { range: "£300,001 – £500,000", rate: "5%" },
                { range: "Above £500,000", rate: "Standard rates" },
              ].map((r) => (
                <tr key={r.range} className="text-slate-700">
                  <td className="py-1.5 px-2 text-xs">{r.range}</td>
                  <td className="py-1.5 px-2 text-right font-medium text-xs">{r.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-slate-500 mt-2">Relief lost if price exceeds £500,000</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Additional Property
          </h3>
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
              <tr><th className="text-left py-1.5 px-2">Band</th><th className="text-right py-1.5 px-2">Rate</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { range: "Up to £125,000", rate: "5%" },
                { range: "£125,001 – £250,000", rate: "7%" },
                { range: "£250,001 – £925,000", rate: "10%" },
                { range: "£925,001 – £1.5M", rate: "15%" },
                { range: "Above £1.5M", rate: "17%" },
              ].map((r) => (
                <tr key={r.range} className="text-slate-700">
                  <td className="py-1.5 px-2 text-xs">{r.range}</td>
                  <td className="py-1.5 px-2 text-right font-medium text-xs">{r.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-slate-500 mt-2">+5% surcharge on all bands</p>
        </div>
      </div>

      {/* April 2025 Changes Notice */}
      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h4 className="font-bold text-amber-900 text-sm">Major SDLT Changes Effective 1 April 2025</h4>
            <p className="text-sm text-amber-800 mt-1">
              The nil-rate threshold dropped from £250,000 to <strong>£125,000</strong>. First-time buyer relief reduced from £425,000 to <strong>£300,000</strong> (cap down from £625,000 to <strong>£500,000</strong>). The additional property surcharge increased from 3% to <strong>5%</strong> from 31 October 2024.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
