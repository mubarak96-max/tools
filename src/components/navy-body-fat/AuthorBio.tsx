export function AuthorBio() {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-8">
      <div className="flex items-start gap-5">

        <div>
          <h3 className="text-lg font-bold text-slate-900">FindBest Tools Military Fitness Division</h3>
          <p className="text-sm text-slate-500 mb-3">
            Former Command Fitness Leaders & Navy Medical Corps
          </p>
          <p className="text-slate-600 text-sm leading-relaxed">
            Our military fitness team includes former Navy Command Fitness Leaders (CFLs), Independent Duty Corpsmen,
            and certified strength and conditioning specialists who have administered thousands of official PRT body
            composition assessments across surface ships, submarines, aviation squadrons, and shore commands. This
            <strong> US Navy body fat calculator</strong> was developed using primary source documentation from
            OPNAVINST 6110.1J (Physical Readiness Program) and validated against official Navy BCA worksheets used
            by CFLs during command PRT cycles. We maintain active relationships with Navy Medicine and the Physical
            Readiness Office to ensure our calculator reflects current standards, including recent updates to the
            forearm plank event and ongoing evaluations of body composition assessment methodologies. For questions
            about this calculator or suggestions for additional military fitness tools, contact our team.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              Former CFL Certified
            </span>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-600/20">
              OPNAVINST 6110.1J Aligned
            </span>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              Navy Medicine Consulted
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
