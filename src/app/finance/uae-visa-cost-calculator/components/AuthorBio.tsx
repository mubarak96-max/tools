export default function AuthorBio() {
  return (
    <aside className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 my-10">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary flex-shrink-0">
          MM
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Mubarak Mutesasira</h3>
          <p className="text-sm text-slate-600 font-medium mb-2">Developer, FindBest Tools</p>
          <p className="text-slate-600 text-sm leading-relaxed mb-3">
            UAE visa fee estimates are sourced from publicly available GDRFA Dubai and ICP Abu Dhabi
            official fee schedules. Costs are indicative and subject to change — always verify current
            fees directly with the relevant UAE government authority before applying.
          </p>
          <p className="text-xs text-slate-400">
            Last updated: May 2026. Source: GDRFA Dubai and ICP Abu Dhabi official portals.
          </p>
        </div>
      </div>
    </aside>
  );
}
