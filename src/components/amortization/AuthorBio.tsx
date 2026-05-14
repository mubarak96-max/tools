import { AuthorSection } from "../blog/AuthorSection";

export function AuthorBio() {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-8">
      <div className="flex flex-col gap-6">
        <AuthorSection showBio={true} />
        <div className="border-t border-slate-200 pt-6">
          <p className="text-slate-600 text-sm leading-relaxed">
            Our team consists of financial analysts and software engineers with 
            over 15 years of combined experience in mortgage lending and fintech 
            development. We build calculators that meet the highest standards of accuracy 
            and usability. This <strong>amortization chart calculator</strong> was developed 
            to produce results consistent with industry standards.
          </p>
          <div className="mt-4 flex gap-3">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              Verified Financial Tool
            </span>
            <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              Bank-Grade Accuracy
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
