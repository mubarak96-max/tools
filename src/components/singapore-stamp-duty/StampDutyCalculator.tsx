"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  calculateTotalStampDuty,
  formatCurrency,
  getProfileLabel,
  type BuyerProfile,
  type PropertyType,
  type StampDutyResult,
} from "@/lib/calculators/singaporeStampDuty";

export default function StampDutyCalculator() {
  const [propertyValue, setPropertyValue] = useState<string>("1500000");
  const [profile, setProfile] = useState<BuyerProfile>("sc-first");
  const [propertyType, setPropertyType] = useState<PropertyType>("residential");
  const [includeSSD, setIncludeSSD] = useState(false);
  const [acquisitionDate, setAcquisitionDate] = useState("");
  const [disposalDate, setDisposalDate] = useState("");
  const [showExamples, setShowExamples] = useState(false);

  const result: StampDutyResult | null = useMemo(() => {
    const value = parseFloat(propertyValue.replace(/[^0-9.]/g, "")) || 0;
    if (value <= 0) return null;

    const ssdInput =
      includeSSD && acquisitionDate && disposalDate
        ? {
            acquisitionDate,
            disposalDate,
            propertyValue: value,
          }
        : undefined;

    return calculateTotalStampDuty(value, profile, propertyType, ssdInput);
  }, [propertyValue, profile, propertyType, includeSSD, acquisitionDate, disposalDate]);

  const presetExamples = [
    { label: "HDB Resale ($600k)", value: "600000", profile: "pr-first" as BuyerProfile },
    { label: "EC Upgrade ($1.2M)", value: "1200000", profile: "sc-second" as BuyerProfile },
    { label: "Condo Foreigner ($2M)", value: "2000000", profile: "foreigner" as BuyerProfile },
    { label: "Landed 3rd Property ($5M)", value: "5000000", profile: "sc-third" as BuyerProfile },
  ];

  const applyExample = (ex: (typeof presetExamples)[0]) => {
    setPropertyValue(ex.value);
    setProfile(ex.profile);
    setPropertyType("residential");
    setIncludeSSD(false);
  };

  const copyResults = () => {
    if (!result) return;
    const text = `Singapore Property Stamp Duty Calculation
Property Value: ${formatCurrency(parseFloat(propertyValue.replace(/[^0-9.]/g, "")) || 0)}
Profile: ${getProfileLabel(profile)}
BSD: ${formatCurrency(result.bsd)}
${result.absd > 0 ? `ABSD: ${formatCurrency(result.absd)} (${(result.absdRate * 100).toFixed(0)}%)\n` : ""}${result.ssd > 0 ? `SSD: ${formatCurrency(result.ssd)} (${(result.ssdRate * 100).toFixed(0)}%)\n` : ""}Total Duty: ${formatCurrency(result.totalDuty)}
Effective Rate: ${result.effectiveRate.toFixed(2)}%
`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Calculator Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-700 to-teal-600 px-6 py-5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Calculate Your Singapore Property Stamp Duty
          </h2>
          <p className="text-emerald-100 text-sm mt-1">Updated with July 2025 SSD changes & current ABSD rates</p>
        </div>

        <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-5">
            {/* Property Value */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Property Value (SGD) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={propertyValue}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    setPropertyValue(raw);
                  }}
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-slate-900 font-medium"
                  placeholder="e.g. 1500000"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Use the higher of purchase price or market valuation</p>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Property Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPropertyType("residential")}
                  className={`py-2.5 px-4 rounded-lg border text-sm font-medium transition ${
                    propertyType === "residential"
                      ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                      : "border-slate-300 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Residential
                </button>
                <button
                  onClick={() => setPropertyType("non-residential")}
                  className={`py-2.5 px-4 rounded-lg border text-sm font-medium transition ${
                    propertyType === "non-residential"
                      ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                      : "border-slate-300 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Commercial / Industrial
                </button>
              </div>
            </div>

            {/* Buyer Profile */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Buyer Profile</label>
              <select
                value={profile}
                onChange={(e) => setProfile(e.target.value as BuyerProfile)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-slate-900 bg-white"
              >
                <optgroup label="Singapore Citizens">
                  <option value="sc-first">1st Residential Property (0% ABSD)</option>
                  <option value="sc-second">2nd Residential Property (20% ABSD)</option>
                  <option value="sc-third">3rd or Subsequent Property (30% ABSD)</option>
                </optgroup>
                <optgroup label="Permanent Residents">
                  <option value="pr-first">1st Residential Property (5% ABSD)</option>
                  <option value="pr-second">2nd Residential Property (30% ABSD)</option>
                  <option value="pr-third">3rd or Subsequent Property (35% ABSD)</option>
                </optgroup>
                <optgroup label="Foreigners & Entities">
                  <option value="foreigner">Foreigner — Non-FTA (60% ABSD)</option>
                  <option value="foreigner-fta">Foreigner — FTA National (0%/20%/30%)</option>
                  <option value="entity">Company / Trust (65% ABSD)</option>
                  <option value="developer">Housing Developer (35% + 5%)</option>
                </optgroup>
              </select>
              {profile === "foreigner-fta" && (
                <p className="text-xs text-amber-700 mt-1.5 bg-amber-50 p-2 rounded border border-amber-200">
                  <strong>FTA Nationals:</strong> US citizens, and nationals of Switzerland, Norway, Iceland, and Liechtenstein are treated as Singapore Citizens for ABSD purposes.
                </p>
              )}
            </div>

            {/* SSD Toggle */}
            {propertyType === "residential" && (
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSSD}
                    onChange={(e) => setIncludeSSD(e.target.checked)}
                    className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Include Seller's Stamp Duty (SSD) estimate</span>
                </label>

                {includeSSD && (
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Acquisition Date</label>
                      <input
                        type="date"
                        value={acquisitionDate}
                        onChange={(e) => setAcquisitionDate(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Disposal Date</label>
                      <input
                        type="date"
                        value={disposalDate}
                        onChange={(e) => setDisposalDate(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Examples */}
            <div>
              <button
                onClick={() => setShowExamples(!showExamples)}
                className="text-sm text-emerald-700 font-medium hover:underline flex items-center gap-1"
              >
                Quick Scenarios {showExamples ? "▲" : "▼"}
              </button>
              {showExamples && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {presetExamples.map((ex) => (
                    <button
                      key={ex.label}
                      onClick={() => applyExample(ex)}
                      className="text-left px-3 py-2 rounded-lg border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 transition text-xs font-medium text-slate-700"
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
                  <p className="text-sm text-slate-500 mb-1">Total Stamp Duty Payable</p>
                  <p className="text-4xl font-extrabold text-slate-900 tracking-tight">{formatCurrency(result.totalDuty)}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Effective rate: <span className="font-semibold text-slate-700">{result.effectiveRate.toFixed(2)}%</span>
                  </p>
                </div>

                <div className="space-y-3">
                  {result.breakdown.map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-slate-700">{item.label}</p>
                        {item.rate && <p className="text-xs text-slate-400">{item.rate}</p>}
                      </div>
                      <p className="text-sm font-bold text-slate-900">{formatCurrency(item.amount)}</p>
                    </div>
                  ))}
                </div>

                {/* Visual Bar */}
                <div className="pt-2">
                  <div className="h-4 w-full rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full"
                      style={{ width: `${(result.bsd / result.totalDuty) * 100}%` }}
                    />
                    {result.absd > 0 && (
                      <div
                        className="bg-amber-500 h-full"
                        style={{ width: `${(result.absd / result.totalDuty) * 100}%` }}
                      />
                    )}
                    {result.ssd > 0 && (
                      <div
                        className="bg-rose-500 h-full"
                        style={{ width: `${(result.ssd / result.totalDuty) * 100}%` }}
                      />
                    )}
                  </div>
                  <div className="flex gap-3 mt-2 text-xs">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> BSD</span>
                    {result.absd > 0 && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> ABSD</span>}
                    {result.ssd > 0 && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> SSD</span>}
                  </div>
                </div>

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

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
                  <strong>Note:</strong> ABSD must be paid within 14 days of signing the Sale & Purchase Agreement (30 days if signed overseas). CPF Ordinary Account funds can be used for ABSD and BSD after reimbursement.
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
                <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">Enter a property value to see your stamp duty breakdown</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rate Tables */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            BSD Rates (Residential)
          </h3>
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
              <tr>
                <th className="text-left py-2 px-2">Property Value</th>
                <th className="text-right py-2 px-2">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { range: "First $180,000", rate: "1%" },
                { range: "Next $180,000", rate: "2%" },
                { range: "Next $640,000", rate: "3%" },
                { range: "Next $500,000", rate: "4%" },
                { range: "Next $1,500,000", rate: "5%" },
                { range: "Above $3,000,000", rate: "6%" },
              ].map((row) => (
                <tr key={row.range} className="text-slate-700">
                  <td className="py-2 px-2">{row.range}</td>
                  <td className="py-2 px-2 text-right font-medium">{row.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            ABSD Rates (2025–2026)
          </h3>
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
              <tr>
                <th className="text-left py-2 px-2">Buyer Profile</th>
                <th className="text-right py-2 px-2">1st</th>
                <th className="text-right py-2 px-2">2nd</th>
                <th className="text-right py-2 px-2">3rd+</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { profile: "Singapore Citizen", first: "0%", second: "20%", third: "30%" },
                { profile: "PR", first: "5%", second: "30%", third: "35%" },
                { profile: "Foreigner", first: "60%", second: "60%", third: "60%" },
                { profile: "Entity / Trust", first: "65%", second: "65%", third: "65%" },
              ].map((row) => (
                <tr key={row.profile} className="text-slate-700">
                  <td className="py-2 px-2 font-medium">{row.profile}</td>
                  <td className="py-2 px-2 text-right">{row.first}</td>
                  <td className="py-2 px-2 text-right">{row.second}</td>
                  <td className="py-2 px-2 text-right">{row.third}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SSD Notice */}
      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h4 className="font-bold text-amber-900 text-sm">SSD Changes Effective 4 July 2025</h4>
            <p className="text-sm text-amber-800 mt-1">
              The holding period has been extended from 3 to 4 years, and rates increased by 4 percentage points per tier. 
              New rates: <strong>16%</strong> (≤1 year), <strong>12%</strong> (&gt;1–2 years), <strong>8%</strong> (&gt;2–3 years), <strong>4%</strong> (&gt;3–4 years).
              Properties acquired before 4 July 2025 still follow the old 3-year schedule.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
