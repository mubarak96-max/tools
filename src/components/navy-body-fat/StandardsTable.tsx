export function StandardsTable() {
  return (
    <div className="rounded-2xl bg-white shadow-xl ring-1 ring-slate-900/5 overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
        <h3 className="text-lg font-semibold text-slate-900">Navy Body Fat Standards (OPNAVINST 6110.1J)</h3>
        <p className="text-sm text-slate-500">Maximum body fat percentages by age and gender</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left">
              <th className="px-6 py-3 font-semibold text-slate-700">Age Bracket</th>
              <th className="px-6 py-3 font-semibold text-slate-700 text-center">Male Max %</th>
              <th className="px-6 py-3 font-semibold text-slate-700 text-center">Female Max %</th>
              <th className="px-6 py-3 font-semibold text-slate-700">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50/50">
              <td className="px-6 py-3 font-medium text-slate-900">17-20 years</td>
              <td className="px-6 py-3 text-center text-blue-600 font-bold">22%</td>
              <td className="px-6 py-3 text-center text-pink-600 font-bold">33%</td>
              <td className="px-6 py-3 text-slate-500">Entry-level standard</td>
            </tr>
            <tr className="hover:bg-slate-50/50">
              <td className="px-6 py-3 font-medium text-slate-900">21-27 years</td>
              <td className="px-6 py-3 text-center text-blue-600 font-bold">23%</td>
              <td className="px-6 py-3 text-center text-pink-600 font-bold">34%</td>
              <td className="px-6 py-3 text-slate-500">Most common active duty bracket</td>
            </tr>
            <tr className="hover:bg-slate-50/50">
              <td className="px-6 py-3 font-medium text-slate-900">28-39 years</td>
              <td className="px-6 py-3 text-center text-blue-600 font-bold">24%</td>
              <td className="px-6 py-3 text-center text-pink-600 font-bold">35%</td>
              <td className="px-6 py-3 text-slate-500">Mid-career adjustment</td>
            </tr>
            <tr className="hover:bg-slate-50/50">
              <td className="px-6 py-3 font-medium text-slate-900">40+ years</td>
              <td className="px-6 py-3 text-center text-blue-600 font-bold">26%</td>
              <td className="px-6 py-3 text-center text-pink-600 font-bold">36%</td>
              <td className="px-6 py-3 text-slate-500">Senior sailor allowance</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="border-t border-slate-100 bg-slate-50/30 px-6 py-4">
        <p className="text-xs text-slate-500">
          <strong>Note:</strong> These are maximum allowable body fat percentages. Sailors exceeding these limits fail the Body Composition Assessment (BCA) 
          and receive an overall PRT failure, regardless of performance on cardio and strength events. Three PRT failures in 4 years may result in administrative separation.
        </p>
      </div>
    </div>
  );
}
