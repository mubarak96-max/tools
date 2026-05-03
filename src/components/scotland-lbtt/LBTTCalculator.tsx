"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  Info, 
  Home, 
  Building2, 
  CheckCircle2, 
  Calculator, 
  ArrowRight, 
  Copy, 
  Check, 
  FileText,
  AlertCircle
} from "lucide-react";
import { calculateScotlandLBTT, ScotlandBuyerType, ScotlandPropertyType } from "@/lib/calculators/scotlandLBTT";

export default function LBTTCalculator() {
  const [propertyValue, setPropertyValue] = useState("350000");
  const [propertyType, setPropertyType] = useState<ScotlandPropertyType>("residential");
  const [buyerType, setBuyerType] = useState<ScotlandBuyerType>("main-residence");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const value = parseFloat(propertyValue.replace(/[^0-9.]/g, "")) || 0;
    return calculateScotlandLBTT(value, propertyType, buyerType);
  }, [propertyValue, propertyType, buyerType]);

  const formatCurrencyGBP = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleCopy = () => {
    const lines = result.breakdown
      .filter((b) => b.duty > 0)
      .map((b) => `${b.band}: ${formatCurrencyGBP(b.duty)} (${(b.rate * 100).toFixed(1)}%)`);
    
    const text = `Scotland Land & Buildings Transaction Tax (LBTT) Calculation
Property Value: ${formatCurrencyGBP(parseFloat(propertyValue.replace(/[^0-9.]/g, "")) || 0)}
Property Type: ${propertyType === "residential" ? "Residential" : "Non-Residential"}
Buyer Type: ${getBuyerTypeLabel(buyerType)}
--------------------------------------
Total LBTT Due: ${formatCurrencyGBP(result.totalLBTT)}
Effective Rate: ${result.effectiveRate.toFixed(2)}%
LBTT Component: ${formatCurrencyGBP(result.lbttOnly)}
${result.adsOnly > 0 ? `ADS (6%): ${formatCurrencyGBP(result.adsOnly)}` : ""}
${result.ftbSaving > 0 ? `FTB Saving: ${formatCurrencyGBP(result.ftbSaving)}` : ""}
--------------------------------------
Calculated via findbest.tools`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  function getBuyerTypeLabel(type: ScotlandBuyerType) {
    switch (type) {
      case "main-residence": return "Main Residence";
      case "first-time-buyer": return "First-Time Buyer";
      case "additional-dwelling": return "Additional Dwelling (ADS)";
      default: return "";
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 md:p-8 text-white">
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
            <Calculator className="w-6 h-6" />
          </div>
          Scotland LBTT Calculator
        </h2>
        <p className="text-blue-100 text-sm mt-1">Updated with 2024–25 Revenue Scotland rates</p>
      </div>

      <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-6">
          {/* Property Type Toggle */}
          <div>
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 block">
              Property Type
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-xl">
              <button
                onClick={() => setPropertyType("residential")}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                  propertyType === "residential"
                    ? "bg-white text-blue-700 shadow-md"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                }`}
              >
                <Home className="w-4 h-4" />
                Residential
              </button>
              <button
                onClick={() => setPropertyType("non-residential")}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                  propertyType === "non-residential"
                    ? "bg-white text-blue-700 shadow-md"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                }`}
              >
                <Building2 className="w-4 h-4" />
                Commercial
              </button>
            </div>
          </div>

          {/* Property Value */}
          <div>
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2 block">
              Purchase Price
            </label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium group-focus-within:text-blue-600 transition-colors">
                £
              </span>
              <input
                type="text"
                value={propertyValue}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  setPropertyValue(val);
                }}
                className="w-full pl-9 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all text-lg font-bold text-slate-800"
                placeholder="e.g. 350,000"
              />
            </div>
            <input
              type="range"
              min="0"
              max="2000000"
              step="10000"
              value={parseFloat(propertyValue) || 0}
              onChange={(e) => setPropertyValue(e.target.value)}
              className="w-full mt-4 accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Buyer Type (Only for Residential) */}
          {propertyType === "residential" && (
            <div>
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 block">
                Buyer Profile
              </label>
              <div className="space-y-2">
                {[
                  { id: "main-residence", label: "Main Residence", icon: Home },
                  { id: "first-time-buyer", label: "First-Time Buyer", icon: CheckCircle2 },
                  { id: "additional-dwelling", label: "Additional Dwelling (ADS)", icon: AlertCircle },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setBuyerType(option.id as ScotlandBuyerType)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                      buyerType === option.id
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-100 bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <option.icon className={`w-5 h-5 ${buyerType === option.id ? "text-blue-600" : "text-slate-400"}`} />
                      <span className="font-semibold text-sm">{option.label}</span>
                    </div>
                    {buyerType === option.id && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Presets */}
          <div>
            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 block">
              Quick Price Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {[150000, 250000, 350000, 500000, 1000000].map((p) => (
                <button
                  key={p}
                  onClick={() => setPropertyValue(p.toString())}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-all bg-white"
                >
                  {p >= 1000000 ? `£${p/1000000}M` : `£${p/1000}K`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
                Total LBTT Due
              </h3>
              <div className="text-4xl font-black text-slate-900 tracking-tight">
                {formatCurrencyGBP(result.totalLBTT)}
              </div>
              <div className="flex items-center gap-2 mt-3 text-sm font-medium text-slate-600 bg-white/60 w-fit px-3 py-1.5 rounded-full border border-slate-100">
                <Info className="w-4 h-4 text-blue-500" />
                Effective Rate: <span className="text-blue-700">{result.effectiveRate.toFixed(2)}%</span>
              </div>
            </div>
            {/* Visual background element */}
            <div className="absolute -right-6 -bottom-6 opacity-5">
              <Calculator className="w-32 h-32" />
            </div>
          </div>

          {/* Tax Distribution Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400 px-1">
              <span>Tax Distribution</span>
              <span>100% of Due</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full flex overflow-hidden">
              {result.lbttOnly > 0 && (
                <div 
                  className="h-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${(result.lbttOnly / result.totalLBTT) * 100}%` }}
                />
              )}
              {result.adsOnly > 0 && (
                <div 
                  className="h-full bg-indigo-400 transition-all duration-500 border-l border-white/20"
                  style={{ width: `${(result.adsOnly / result.totalLBTT) * 100}%` }}
                />
              )}
            </div>
            <div className="flex gap-4 px-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                <div className="w-2 h-2 rounded-full bg-blue-600" /> Standard LBTT
              </div>
              {result.adsOnly > 0 && (
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                  <div className="w-2 h-2 rounded-full bg-indigo-400" /> ADS Surcharge
                </div>
              )}
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Rate Band Breakdown
              </span>
              <FileText className="w-4 h-4 text-slate-300" />
            </div>
            <div className="p-2 space-y-1">
              {result.breakdown.map((item, i) => (
                <div 
                  key={i}
                  className={`grid grid-cols-4 gap-2 text-sm px-2 py-2 rounded-lg transition-colors ${
                    item.duty > 0 ? "bg-blue-50/50" : "text-slate-400"
                  }`}
                >
                  <span className="text-[13px] font-medium truncate" title={item.band}>{item.band}</span>
                  <span className="text-right text-[13px] text-slate-500">{formatCurrencyGBP(item.amount)}</span>
                  <span className="text-right text-[13px] text-slate-400">{(item.rate * 100).toFixed(0)}%</span>
                  <span className={`text-right text-[13px] font-bold ${item.duty > 0 ? "text-blue-700" : "text-slate-300"}`}>
                    {item.duty > 0 ? formatCurrencyGBP(item.duty) : "Nil"}
                  </span>
                </div>
              ))}
              
              {result.adsOnly > 0 && (
                <div className="grid grid-cols-4 gap-2 text-sm px-2 py-2 rounded-lg bg-indigo-50 border border-indigo-100/50 mt-1">
                  <span className="text-[13px] font-semibold text-indigo-800">ADS Surcharge</span>
                  <span className="text-right text-[13px] text-indigo-500">{formatCurrencyGBP(result.propertyValue)}</span>
                  <span className="text-right text-[13px] text-indigo-400">6%</span>
                  <span className="text-right text-[13px] font-bold text-indigo-700">{formatCurrencyGBP(result.adsOnly)}</span>
                </div>
              )}

              {result.ftbSaving > 0 && (
                <div className="grid grid-cols-2 gap-2 text-sm px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-100/50 mt-1">
                  <span className="text-[13px] font-semibold text-emerald-800">FTB Relief Saving</span>
                  <span className="text-right text-[13px] font-bold text-emerald-700">-{formatCurrencyGBP(result.ftbSaving)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-black transition-all active:scale-[0.98]"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy Result"}
            </button>
            <button 
              onClick={() => window.print()}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-all active:scale-[0.98]"
            >
              <FileText className="w-4 h-4" />
              Get PDF
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-slate-50 p-6 border-t border-slate-100">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 rounded-lg shrink-0">
            <Info className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-1">About LBTT Scotland</h4>
            <p className="text-[13px] text-slate-600 leading-relaxed">
              LBTT replaced UK Stamp Duty in Scotland on 1 April 2015. It is a progressive tax, meaning you only pay the rate on the portion of the price within each band. 
              {propertyType === "residential" && " First-time buyers benefit from a nil-rate threshold of £175,000, while the ADS surcharge of 6% applies to additional dwellings."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
