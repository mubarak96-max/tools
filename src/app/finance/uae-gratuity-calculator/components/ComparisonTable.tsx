"use client";

import { Globe } from "lucide-react";

const comparisons = [
  { country: "UAE", formula: "21 days (1-5 yrs) / 30 days (5+ yrs)", cap: "2 years basic salary", notes: "Federal Decree-Law No. 33 of 2021" },
  { country: "Saudi Arabia", formula: "15 days (1-5 yrs) / 1 month (5+ yrs)", cap: "None specified", notes: "Labour Law Article 84" },
  { country: "Qatar", formula: "21 days (1-5 yrs) / 28 days (5+ yrs)", cap: "None specified", notes: "Labour Law No. 14 of 2004" },
  { country: "Kuwait", formula: "15 days (1-5 yrs) / 1 month (5+ yrs)", cap: "1.5 years total", notes: "Labour Law No. 6 of 2010" },
  { country: "Bahrain", formula: "15 days (1-3 yrs) / 1 month (3+ yrs)", cap: "12 months basic", notes: "Labour Law No. 36 of 2012" },
  { country: "Oman", formula: "15 days (1-3 yrs) / 1 month (3+ yrs)", cap: "None specified", notes: "Labour Law Royal Decree 35/2003" },
];

export default function ComparisonTable() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
          <Globe className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">UAE vs. GCC Gratuity Comparison</h2>
          <p className="text-sm text-slate-500">How UAE gratuity compares to other Gulf countries</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-slate-200">
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Country</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Formula</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Cap</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Legal Basis</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {comparisons.map((row, i) => (
              <tr key={i} className={i === 0 ? "bg-blue-50/50" : "hover:bg-slate-50"}>
                <td className="px-4 py-3 font-medium text-slate-900">{row.country}</td>
                <td className="px-4 py-3 text-slate-600">{row.formula}</td>
                <td className="px-4 py-3 text-slate-600">{row.cap}</td>
                <td className="px-4 py-3 text-xs text-slate-500 italic">{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-slate-500">
        * Data based on latest available labour laws for expatriate workers in the private sector.
      </p>
    </div>
  );
}
