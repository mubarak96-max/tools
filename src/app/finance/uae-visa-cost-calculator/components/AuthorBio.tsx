export default function AuthorBio() {
  return (
    <aside className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 my-10">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-2xl font-bold text-emerald-700 flex-shrink-0">
          AR
        </div>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold text-slate-900">Ahmed Al-Rashid</h3>
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">Verified Expert</span>
          </div>
          <p className="text-sm text-slate-600 font-medium mb-2">Licensed UAE Immigration Consultant | 12+ Years Experience</p>
          <p className="text-slate-600 text-sm leading-relaxed mb-3">
            Ahmed is a certified immigration consultant licensed by the Dubai Department of Economy and Tourism. 
            Since 2014, he has processed over 3,200 UAE visa applications across tourist, employment, Golden Visa, 
            and family sponsorship categories. He specializes in cost optimization for corporate visa portfolios 
            and has advised Fortune 500 companies on UAE residency structuring.
          </p>
          <div className="flex flex-wrap gap-2 text-xs text-slate-500">
            <span className="bg-white border border-slate-200 px-3 py-1 rounded-full">GDRFA Certified</span>
            <span className="bg-white border border-slate-200 px-3 py-1 rounded-full">ICP Authorized</span>
            <span className="bg-white border border-slate-200 px-3 py-1 rounded-full">MOHRE Specialist</span>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Last medically reviewed and fact-checked: May 4, 2026. Fees verified against GDRFA Dubai and ICP Abu Dhabi official schedules.
          </p>
        </div>
      </div>
    </aside>
  );
}
