import { AuthorSection } from "@/components/blog/AuthorSection";

export default function AuthorBio() {
  return (
    <aside className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 my-10">
      <div className="flex flex-col gap-6">
        <AuthorSection />
        <div>
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
