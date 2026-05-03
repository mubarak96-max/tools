'use client';

import { visaTypes } from '@/lib/visa-data';

export default function ComparisonTable() {
  const mainVisas = visaTypes.filter((v) => 
    ['tourist-30-single', 'tourist-60-single', 'tourist-5year', 'employment-2year', 'golden-10year', 'green'].includes(v.id) ||
    v.category === 'golden' || v.category === 'employment'
  ).slice(0, 6);

  return (
    <div className="overflow-x-auto my-8">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="bg-slate-100 border-b-2 border-slate-300">
            <th className="p-4 font-bold text-slate-800">Visa Type</th>
            <th className="p-4 font-bold text-slate-800">Duration</th>
            <th className="p-4 font-bold text-slate-800">Base Fee (AED)</th>
            <th className="p-4 font-bold text-slate-800">Total Est. (AED)</th>
            <th className="p-4 font-bold text-slate-800">Processing</th>
            <th className="p-4 font-bold text-slate-800">Best For</th>
          </tr>
        </thead>
        <tbody>
          {mainVisas.map((visa, idx) => {
            const totalEst = visa.baseFeeAED + visa.hiddenCosts.filter(c => !c.optional).reduce((s, c) => s + c.costAED, 0);
            return (
              <tr key={visa.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="p-4 font-semibold text-slate-900">{visa.name}</td>
                <td className="p-4 text-slate-700">{visa.duration}</td>
                <td className="p-4 text-slate-700">AED {visa.baseFeeAED.toLocaleString()}</td>
                <td className="p-4 font-bold text-emerald-700">AED {totalEst.toLocaleString()}</td>
                <td className="p-4 text-slate-700">{visa.processingDays}</td>
                <td className="p-4 text-slate-600 text-xs">{visa.description.slice(0, 60)}...</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
