import { AuthorSection } from "@/components/blog/AuthorSection";

export function AuthorBio() {
  return (
    <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-4">
      <div className="flex flex-col gap-4">
        <AuthorSection variant="dark" />
        <div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Mining profitability estimates use publicly available network difficulty and block reward data.
            Electricity costs and hardware specs are user-supplied. Results are estimates only — actual
            profitability depends on real-time network conditions and local energy prices.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
              Public Network Data
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
