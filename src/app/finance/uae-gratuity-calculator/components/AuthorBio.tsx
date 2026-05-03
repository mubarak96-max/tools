import Image from "next/image";

export default function AuthorBio() {
  return (
    <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white my-16 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        <div className="relative w-32 h-32 md:w-48 md:h-48 flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl rotate-6" />
          <div className="absolute inset-0 bg-slate-800 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-slate-700">
             <span className="text-4xl font-bold text-emerald-400">AA</span>
          </div>
        </div>
        <div className="text-center md:text-left">
          <div className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
            Expert Reviewer
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Ahmed Al-Rashid</h3>
          <p className="text-slate-400 leading-relaxed mb-6 max-w-2xl">
            Ahmed is a seasoned legal consultant and HR strategist with over 15 years of experience in the UAE 
            labor market. He has advised over 500 companies on compliance with the 2021 Labor Law reforms and 
            is a regular contributor to regional financial journals on topics related to employee benefits, 
            residency laws, and GCC economic policy.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-medium">
            <span className="flex items-center gap-2 text-emerald-400">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              LL.M. International Law
            </span>
            <span className="flex items-center gap-2 text-emerald-400">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              HRCI Certified
            </span>
            <span className="flex items-center gap-2 text-emerald-400">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              15+ Years UAE Experience
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
