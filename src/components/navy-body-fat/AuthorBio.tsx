export function AuthorBio() {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-8">
      <div className="flex items-start gap-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-black text-primary">
          MM
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Mubarak Mutesasira</h3>
          <p className="text-sm text-slate-500 mb-3">Developer, FindBest Tools</p>
          <p className="text-slate-600 text-sm leading-relaxed">
            This calculator implements the official US Navy body fat formula from OPNAVINST 6110.1J.
            Calculations are based on the circumference-based method used in Navy Physical Readiness Tests.
            For official PRT assessments, always use your command&apos;s certified fitness leader.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              OPNAVINST 6110.1J Formula
            </span>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-600/20">
              Official Navy Standards
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
