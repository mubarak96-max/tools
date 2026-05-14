import { AuthorSection } from "@/components/blog/AuthorSection";

export function AuthorBio() {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-8">
      <div className="flex flex-col gap-6">
        <AuthorSection />
        <div>
          <p className="text-slate-600 text-sm leading-relaxed">
            This fuel cost calculator uses EPA fuel economy data and DOE energy price indices.
            Vehicle efficiency figures are sourced from publicly available EPA fuel economy databases.
            Gas price estimates are regional averages and will vary from current local prices.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
              EPA Data Sources
            </span>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              DOE Price Indices
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
