'use client';

import { useState, useMemo } from 'react';
import { visaTypes, categories, exchangeRate, VisaType } from '@/lib/visa-data';

export default function VisaCalculator() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVisa, setSelectedVisa] = useState<VisaType | null>(null);
  const [travelers, setTravelers] = useState(1);
  const [includeOptional, setIncludeOptional] = useState(false);
  const [currency, setCurrency] = useState<'AED' | 'USD'>('AED');

  const filteredVisas = useMemo(() => {
    if (selectedCategory === 'all') return visaTypes;
    return visaTypes.filter((v) => v.category === selectedCategory);
  }, [selectedCategory]);

  const calculation = useMemo(() => {
    if (!selectedVisa) return null;

    const baseFee = selectedVisa.baseFeeAED * travelers;
    const mandatoryCosts = selectedVisa.hiddenCosts
      .filter((c) => !c.optional)
      .reduce((sum, c) => sum + c.costAED * travelers, 0);
    const optionalCosts = includeOptional
      ? selectedVisa.hiddenCosts
          .filter((c) => c.optional)
          .reduce((sum, c) => sum + c.costAED * travelers, 0)
      : 0;

    const totalAED = baseFee + mandatoryCosts + optionalCosts;
    const totalUSD = Math.round((totalAED / exchangeRate) * 100) / 100;

    return {
      baseFee,
      mandatoryCosts,
      optionalCosts,
      totalAED,
      totalUSD,
      breakdown: [
        { name: `${selectedVisa.name} (×${travelers})`, cost: baseFee, type: 'base' },
        ...selectedVisa.hiddenCosts
          .filter((c) => !c.optional)
          .map((c) => ({
            name: `${c.name} (×${travelers})`,
            cost: c.costAED * travelers,
            type: 'mandatory' as const,
          })),
        ...(includeOptional
          ? selectedVisa.hiddenCosts
              .filter((c) => c.optional)
              .map((c) => ({
                name: `${c.name} (×${travelers})`,
                cost: c.costAED * travelers,
                type: 'optional' as const,
              }))
          : []),
      ],
    };
  }, [selectedVisa, travelers, includeOptional]);

  const formatCurrency = (aed: number, usd: number) => {
    if (currency === 'AED') return `AED ${aed.toLocaleString()}`;
    return `USD ${usd.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden" id="calculator">
      <div className="bg-gradient-to-r from-emerald-700 to-teal-600 p-6 md:p-8 text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">UAE Visa Cost Calculator 2026</h2>
        <p className="text-emerald-100 text-sm md:text-base">
          Calculate exact government fees, hidden costs, and total budgeting for Dubai & Abu Dhabi visas.
        </p>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">Select Visa Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedVisa(null);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visa Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">Select Visa Type</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredVisas.map((visa) => (
              <button
                key={visa.id}
                onClick={() => setSelectedVisa(visa)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  selectedVisa?.id === visa.id
                    ? 'border-emerald-500 bg-emerald-50 shadow-md'
                    : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold text-slate-800 text-sm">{visa.name}</div>
                <div className="text-xs text-slate-500 mt-1">{visa.duration} • {visa.processingDays}</div>
                <div className="text-emerald-700 font-bold text-sm mt-2">AED {visa.baseFeeAED.toLocaleString()}</div>
              </button>
            ))}
          </div>
        </div>

        {selectedVisa && (
          <>
            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Number of Travelers</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={travelers}
                  onChange={(e) => setTravelers(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as 'AED' | 'USD')}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="AED">AED (Dirham)</option>
                  <option value="USD">USD (Dollar)</option>
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeOptional}
                    onChange={(e) => setIncludeOptional(e.target.checked)}
                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-700 font-medium">Include optional fees</span>
                </label>
              </div>
            </div>

            {/* Results */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Cost Breakdown</h3>
              <div className="space-y-3">
                {calculation?.breakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">
                      {item.name}
                      {item.type === 'optional' && (
                        <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Optional</span>
                      )}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {currency === 'AED' ? `AED ${item.cost.toLocaleString()}` : `USD ${Math.round((item.cost / exchangeRate) * 100) / 100}`}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t-2 border-slate-200 flex justify-between items-center">
                <span className="text-lg font-bold text-slate-900">Total Estimated Cost</span>
                <span className="text-2xl font-bold text-emerald-700">
                  {formatCurrency(calculation!.totalAED, calculation!.totalUSD)}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                *Estimates based on 2026 government fee schedules. Actual costs may vary by emirate and processing center.
              </p>
            </div>

            {/* Requirements */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h3 className="text-md font-bold text-blue-900 mb-3">Required Documents</h3>
              <ul className="space-y-2">
                {selectedVisa.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-blue-800">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {req}
                  </li>
                ))}
              </ul>
              <div className="mt-3 text-xs text-blue-700">
                Processing time: <span className="font-semibold">{selectedVisa.processingDays}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
