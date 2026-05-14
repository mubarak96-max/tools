import { AuthorSection } from "@/components/blog/AuthorSection";

export default function AuthorBio() {
  return (
    <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white my-16 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
      <div className="flex flex-col gap-8 relative z-10">
        <AuthorSection variant="dark" />
        <div className="text-center md:text-left">
          <p className="text-slate-400 leading-relaxed mb-6 max-w-2xl text-sm">
            This gratuity calculator implements the formula from UAE Federal Decree-Law No. 33 of 2021
            (the New Labour Law). Calculations are based on publicly available MOHRE guidance. For
            disputes or official calculations, consult a licensed UAE employment lawyer or MOHRE directly.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-medium">
            <span className="flex items-center gap-2 text-emerald-400">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              Federal Decree-Law No. 33 of 2021
            </span>
            <span className="flex items-center gap-2 text-emerald-400">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              MOHRE Formula
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
