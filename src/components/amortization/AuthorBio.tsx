export function AuthorBio() {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-8">
      <div className="flex items-start gap-5">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
          FB
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">FindBest Tools Editorial Team</h3>
          <p className="text-sm text-slate-500 mb-3">
            Financial Technology & Consumer Lending Specialists
          </p>
          <p className="text-slate-600 text-sm leading-relaxed">
            Our team consists of financial analysts, software engineers, and consumer advocates with 
            over 15 years of combined experience in mortgage lending, personal finance, and fintech 
            development. We build calculators and tools that meet the highest standards of accuracy 
            and usability. This <strong>amortization chart calculator</strong> was developed in consultation 
            with certified mortgage professionals to ensure it produces results consistent with industry 
            standards. We regularly update our tools to reflect current lending practices and user feedback. 
            For questions about this calculator or suggestions for improvement, contact our team through 
            the FindBest Tools website.
          </p>
          <div className="mt-4 flex gap-3">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              Verified Financial Tool
            </span>
            <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              Bank-Grade Accuracy
            </span>
            <span className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
              Updated 2026
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
