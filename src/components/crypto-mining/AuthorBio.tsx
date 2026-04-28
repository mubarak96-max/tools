export function AuthorBio() {
  return (
    <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-4">
      <div className="flex items-start gap-5">

        <div>



          <div className=" flex flex-wrap gap-3">
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
              Validated Against Public Mining Data
            </span>
            <span className="inline-flex items-center rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400 ring-1 ring-inset ring-cyan-500/20">
              Blockchain Certified
            </span>
            <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400 ring-1 ring-inset ring-amber-500/20">
              Updated Q1 2026
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
