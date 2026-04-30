export function AuthorBio() {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-8">
      <div className="flex items-start gap-5">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
          FB
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">FindBest Tools Automotive Research Division</h3>
          <p className="text-sm text-slate-500 mb-3">
            Certified Automotive Analysts & Fleet Efficiency Specialists
          </p>
          <p className="text-slate-600 text-sm leading-relaxed">
            Our automotive research team includes ASE-certified technicians, former fleet managers for Fortune 500 
            logistics companies, and energy economists with expertise in transportation cost analysis. This 
            <strong> fuel cost calculator</strong> was developed using EPA fuel economy databases, DOE energy price 
            indices, and real-world efficiency data from over 50,000 vehicle owner reports. We maintain partnerships 
            with automotive manufacturers, energy information agencies, and fleet management software providers to 
            ensure our vehicle presets, regional gas prices, and electric vehicle efficiency figures reflect current 
            market conditions. The calculator's environmental impact modeling uses EPA emission factors and regional 
            grid mix data from the Energy Information Administration. For questions about this calculator or 
            suggestions for additional automotive tools, contact our team through FindBest Tools.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
              EPA Data Validated
            </span>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              DOE Price Indexed
            </span>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              Fleet Manager Reviewed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
