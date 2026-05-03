import type { Metadata } from "next";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import LBTTCalculator from "@/components/scotland-lbtt/LBTTCalculator";
import { absoluteUrl } from "@/lib/seo/metadata";
import { RelatedToolsSection } from "@/components/tools/ToolPageScaffold";

const PAGE_PATH = "/real-estate/scotland-lbtt-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: "Scotland LBTT Calculator 2025–2026 | Scottish Property Tax",
  description:
    "Free Scotland Land and Buildings Transaction Tax (LBTT) calculator for 2025–2026. Calculate residential, ADS surcharge (6%), and first-time buyer relief. Accurate for Edinburgh, Glasgow, Aberdeen & all Scottish property.",
  keywords: [
    "scotland lbtt calculator",
    "lbtt calculator scotland",
    "scottish stamp duty calculator",
    "additional dwelling supplement calculator",
    "lbtt first time buyer relief scotland",
    "scotland property tax calculator",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
};

export default function ScotlandLBTTPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-16 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wide">
              Updated 2026
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wide">
              Revenue Scotland Rates
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
            Scotland LBTT <span className="text-blue-700">Calculator</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Calculate <strong>Land and Buildings Transaction Tax (LBTT)</strong> for property in Scotland. 
            Includes the <strong>6% ADS surcharge</strong> and First-Time Buyer relief thresholds.
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-12 md:py-16 px-4">
        <LBTTCalculator />
      </section>

      {/* Long-Form SEO Content */}
      <article className="max-w-4xl mx-auto px-4 py-12 md:py-16 space-y-12">
        
        {/* Introduction */}
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold text-slate-900">Understanding Land & Buildings Transaction Tax in Scotland</h2>
          <p className="text-slate-600 leading-relaxed">
            Land and Buildings Transaction Tax (LBTT) replaced UK Stamp Duty Land Tax (SDLT) in Scotland on 1 April 2015. 
            It is a progressive tax paid when you buy a property or land in Scotland over a certain value. 
            Administered by <strong>Revenue Scotland</strong>, LBTT is fundamentally different from the system in England and Wales, 
            using its own specific rate bands and surcharges.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Whether you are buying your first home in Glasgow, an investment property in Edinburgh, or commercial premises in Aberdeen, 
            accurately estimating your tax liability is a critical step in your financial planning.
          </p>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">How is LBTT Calculated?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                LBTT is calculated on a "slice-by-slice" basis. You only pay the specific rate on the portion of the purchase price 
                that falls within each band.
              </p>
              <ul className="space-y-3">
                {[
                  { range: "Up to £145,000", rate: "0%" },
                  { range: "£145,001 to £250,000", rate: "2%" },
                  { range: "£250,001 to £325,000", rate: "5%" },
                  { range: "£325,001 to £750,000", rate: "10%" },
                  { range: "Over £750,000", rate: "12%" },
                ].map((band, i) => (
                  <li key={i} className="flex items-center justify-between text-sm border-b border-slate-100 pb-2">
                    <span className="text-slate-700 font-medium">{band.range}</span>
                    <span className="font-bold text-blue-700">{band.rate}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-blue-50 rounded-xl p-6">
              <h4 className="font-bold text-blue-900 text-sm mb-3">Example: £350,000 Main Residence</h4>
              <p className="text-xs text-blue-800 leading-relaxed space-y-2">
                • First £145,000: <span className="font-bold">£0</span> (0%)<br/>
                • Next £105,000 (£145k-£250k): <span className="font-bold">£2,100</span> (2%)<br/>
                • Next £75,000 (£250k-£325k): <span className="font-bold">£3,750</span> (5%)<br/>
                • Remaining £25,000 (£325k-£350k): <span className="font-bold">£2,500</span> (10%)<br/>
                <span className="text-sm font-black mt-2 block border-t border-blue-200 pt-2">
                  Total LBTT: £8,350
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* First-Time Buyer Relief */}
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold text-slate-900">First-Time Buyer Relief in Scotland</h2>
          <p className="text-slate-600 leading-relaxed">
            Scotland offers a specific relief for first-time buyers. The nil-rate threshold (the price at which you start paying tax) 
            is raised from <strong>£145,000 to £175,000</strong>.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 my-6">
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
              <h4 className="text-emerald-900 font-bold text-sm mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Eligibility
              </h4>
              <p className="text-emerald-800 text-xs leading-relaxed">
                Every buyer must be a first-time buyer. You must never have owned a home anywhere else in the world and 
                must intend to live in the property as your main residence.
              </p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <h4 className="text-blue-900 font-bold text-sm mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" /> The Saving
              </h4>
              <p className="text-blue-800 text-xs leading-relaxed">
                The maximum saving from this relief is <strong>£600</strong>. If your property costs more than £175,000, 
                you still benefit from the £600 reduction on the first portion of the price.
              </p>
            </div>
          </div>
        </div>

        {/* ADS Surcharge */}
        <div className="bg-slate-900 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-400" />
            Additional Dwelling Supplement (ADS)
          </h2>
          <p className="text-slate-300 leading-relaxed mb-6">
            If you are buying a second home, a holiday home, or a buy-to-let investment property in Scotland, 
            you will likely need to pay the <strong>Additional Dwelling Supplement (ADS)</strong>.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <h4 className="font-bold text-white mb-2">The Rate</h4>
              <p className="text-xs text-slate-400">Currently <strong>6%</strong> of the total purchase price.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <h4 className="font-bold text-white mb-2">The Threshold</h4>
              <p className="text-xs text-slate-400">Applies to all purchases over <strong>£40,000</strong>.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <h4 className="font-bold text-white mb-2">Refunds</h4>
              <p className="text-xs text-slate-400">Can be reclaimed if you sell your previous main residence within 36 months.</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-slate-800 text-sm mb-2">When do I pay LBTT?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                LBTT must be paid within 30 days of the "effective date" of the transaction, which is usually the date of completion (the day you get the keys). Your solicitor typically handles the payment on your behalf.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm mb-2">Is LBTT the same as Council Tax?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                No. LBTT is a one-off tax paid when you buy a property. Council Tax is an ongoing monthly tax paid to your local authority for local services.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm mb-2">How does LBTT compare to England's Stamp Duty?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Scottish LBTT tends to be more expensive for mid-to-high value properties than English SDLT. For example, a £500,000 house in Scotland has a higher tax bill than the same house in England, primarily due to Scotland's higher rate bands (10% starting at £325k vs 5% in England).
              </p>
            </div>
          </div>
        </div>

        {/* Related Tools */}
        <div className="border-t border-slate-200 pt-12">
          <RelatedToolsSection 
            category="Real Estate" 
            categoryHref="/real-estate" 
            currentPath={PAGE_PATH} 
          />
        </div>

      </article>

      {/* Footer Disclaimer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs text-slate-400 leading-relaxed italic">
            Disclaimer: This calculator is for illustrative purposes only and does not constitute financial or legal advice. 
            Tax rates and rules can change. Always consult with a qualified Scottish conveyancing solicitor or tax advisor 
            before making financial decisions. Data aligned with Revenue Scotland guidance for 2024–2025 and 2025–2026.
          </p>
        </div>
      </footer>
    </main>
  );
}
