interface TaxResult {
  grossAnnual: number;
  federalTax: number;
  stateTax: number;
  socialSecurity: number;
  medicare: number;
  additionalMedicare: number;
  ficaTotal: number;
  totalTax: number;
  netAnnual: number;
}

export function PayFrequencyTable({ result }: { result: TaxResult }) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);

  const frequencies = [
    { name: "Annual", divisor: 1 },
    { name: "Monthly", divisor: 12 },
    { name: "Biweekly", divisor: 26 },
    { name: "Weekly", divisor: 52 },
    { name: "Daily", divisor: 260 }, // 5 days × 52 weeks
    { name: "Hourly", divisor: 2080 }, // 40 hrs × 52 weeks
  ];

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-900/5">
      <div className="border-b border-slate-100 px-6 py-4">
        <h3 className="text-lg font-semibold text-slate-900">Pay Frequency Breakdown</h3>
        <p className="text-sm text-slate-500">Your salary across different pay periods</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left">
              <th className="px-6 py-3 font-semibold text-slate-700">Frequency</th>
              <th className="px-6 py-3 font-semibold text-slate-700 text-right">Gross Pay</th>
              <th className="px-6 py-3 font-semibold text-slate-700 text-right">Federal Tax</th>
              <th className="px-6 py-3 font-semibold text-slate-700 text-right">State Tax</th>
              <th className="px-6 py-3 font-semibold text-slate-700 text-right">FICA</th>
              <th className="px-6 py-3 font-semibold text-slate-700 text-right">Net Pay</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {frequencies.map((freq) => (
              <tr key={freq.name} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-3 font-medium text-slate-900">{freq.name}</td>
                <td className="px-6 py-3 text-right text-slate-700">{formatCurrency(result.grossAnnual / freq.divisor)}</td>
                <td className="px-6 py-3 text-right text-blue-600">{formatCurrency(result.federalTax / freq.divisor)}</td>
                <td className="px-6 py-3 text-right text-violet-600">{formatCurrency(result.stateTax / freq.divisor)}</td>
                <td className="px-6 py-3 text-right text-amber-600">{formatCurrency(result.ficaTotal / freq.divisor)}</td>
                <td className="px-6 py-3 text-right font-bold text-emerald-600">{formatCurrency(result.netAnnual / freq.divisor)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
