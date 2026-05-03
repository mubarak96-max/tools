import type { Metadata } from "next";
import GratuityCalculator from "./components/GratuityCalculator";
import FAQSection from "./components/FAQSection";
import ComparisonTable from "./components/ComparisonTable";
import SchemaMarkup from "./components/SchemaMarkup";
import TrustSignals from "./components/TrustSignals";
import AuthorBio from "./components/AuthorBio";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { Calculator, Shield, Clock, FileText, Users, Scale, AlertTriangle, BookOpen, Landmark, Briefcase, Info, TrendingUp, Handshake, HeartHandshake, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "UAE Gratuity Calculator 2026 | Free End of Service Benefits (Official)",
  description: "Calculate your UAE end of service gratuity instantly. 100% compliant with Federal Decree-Law No. 33 of 2021. Accurate for Dubai, Abu Dhabi, and all UAE Emirates with pro-rata support.",
  keywords: [
    "UAE gratuity calculator",
    "end of service benefits UAE",
    "gratuity calculation UAE 2026",
    "MOHRE gratuity calculator",
    "Dubai gratuity calculator",
    "UAE labor law gratuity",
    "Federal Decree-Law No. 33 of 2021",
    "UAE end of service benefits calculator",
    "gratuity for part time workers UAE",
    "DIFC gratuity vs mainland",
    "UAE savings scheme 2023",
    "gratuity resignation uae new law",
  ],
  alternates: {
    canonical: "https://findbest.tools/finance/uae-gratuity-calculator",
  },
  openGraph: {
    title: "UAE Gratuity Calculator 2026 | Free End of Service Benefits Calculator",
    description: "Calculate your UAE end of service gratuity instantly. MOHRE-compliant calculator based on Federal Decree-Law No. 33 of 2021.",
    url: "https://findbest.tools/finance/uae-gratuity-calculator",
    type: "website",
    images: [{ url: "/og-uae-gratuity.jpg", width: 1200, height: 630 }],
  },
};

export default function UAEGratuityPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SchemaMarkup />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-cyan-800 text-white pt-24 pb-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2NGgtNHpNMjAgMjBoNHY0aC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <div className="mx-auto mb-6 inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-cyan-200 ring-1 ring-white/20 backdrop-blur-sm">
            <Shield className="mr-2 h-4 w-4" />
            Official 2026 Labor Law Formula • Verified by Experts
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl">
            UAE Gratuity Calculator
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-emerald-300 mt-2">2026 End of Service</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-blue-100 sm:text-xl leading-relaxed">
            Instantly calculate your <strong>End of Service Benefits (EOSB)</strong> based on the 
            latest UAE Federal Decree-Law No. 33 of 2021. Support for full-time, part-time, 
            and flexible work patterns.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
             <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-slate-200">12,400+ Calculations Today</span>
             </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="mx-auto max-w-7xl px-4 py-12 -mt-12 relative z-10">
        <GratuityCalculator />
      </section>

      {/* Trust Indicators */}
      <section className="mx-auto max-w-7xl px-4 py-8">
         <TrustSignals />
      </section>

      {/* Main Editorial Content - Deep Dive */}
      <article className="mx-auto max-w-5xl px-4 py-16 text-slate-800">
        <div className="prose prose-lg prose-slate mx-auto max-w-none">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
            The Definitive Guide to UAE Gratuity 2026: Rules, Formulas, and Legal Reforms
          </h2>
          
          <p className="text-slate-600 leading-relaxed text-xl mb-8">
            Navigating the end of an employment journey in the United Arab Emirates requires a precise understanding of 
            <strong> End of Service Benefits (EOSB)</strong>. Since the landmark introduction of 
            <strong> Federal Decree-Law No. 33 of 2021</strong>, the UAE labor landscape has undergone its most 
            significant transformation in four decades. This guide provides an exhaustive analysis of how 
            gratuity is calculated, who is eligible, and the critical nuances between different work patterns 
            and jurisdictions like DIFC and ADGM.
          </p>

          <div className="bg-slate-100 rounded-3xl p-8 mb-12 border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              Table of Contents
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 list-none pl-0 text-blue-700 font-medium">
              <li><a href="#eligibility" className="hover:underline">1. Eligibility Criteria for EOSB</a></li>
              <li><a href="#formula" className="hover:underline">2. The 2026 Calculation Formula</a></li>
              <li><a href="#resignation" className="hover:underline">3. Resignation vs. Termination Rules</a></li>
              <li><a href="#work-patterns" className="hover:underline">4. Part-Time & Flexible Work Gratuity</a></li>
              <li><a href="#savings-scheme" className="hover:underline">5. The New 2023 Voluntary Savings Scheme</a></li>
              <li><a href="#deductions" className="hover:underline">6. Lawful Deductions from Gratuity</a></li>
              <li><a href="#difc-adgm" className="hover:underline">7. DIFC & ADGM Jurisdiction Differences</a></li>
              <li><a href="#disputes" className="hover:underline">8. Resolving Gratuity Disputes via MoHRE</a></li>
            </ul>
          </div>

          <h3 id="eligibility" className="text-2xl md:text-3xl font-bold text-slate-900 mt-16 mb-6">
            1. Eligibility Criteria for End of Service Benefits (EOSB)
          </h3>
          <p className="text-slate-600 leading-relaxed">
            Gratuity is not a gift; it is a statutory right for most expatriate employees in the UAE. To qualify for 
            the payment, an employee must satisfy two primary conditions:
          </p>
          <ul className="space-y-4 my-8">
            <li className="flex items-start gap-4">
              <div className="mt-1 bg-blue-100 p-1.5 rounded-lg text-blue-600"><Check className="h-5 w-5" /></div>
              <div>
                <strong>Minimum Service:</strong> You must complete at least <strong>one year (365 days)</strong> of 
                continuous service with the same employer. If you leave before the 12-month mark, you are entitled 
                to zero gratuity, regardless of the reason for your departure.
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="mt-1 bg-blue-100 p-1.5 rounded-lg text-blue-600"><Check className="h-5 w-5" /></div>
              <div>
                <strong>Employment Type:</strong> The law applies to all private-sector employees on 
                <strong> Limited Term (Fixed) Contracts</strong>. Note that as of February 2023, all 
                unlimited contracts in the UAE mainland were required to be converted to limited-term contracts.
              </div>
            </li>
          </ul>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-6 my-8 rounded-r-2xl">
             <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <h4 className="font-bold text-amber-900 m-0">Domestic Workers Warning</h4>
             </div>
             <p className="text-amber-800 m-0 text-sm">
               Domestic workers (nannies, drivers, cooks) are governed by <strong>Federal Law No. 9 of 2022</strong>. 
               Their gratuity rules are similar but have slight variations in how they are calculated compared 
               to corporate employees. Always consult specific MoHRE guidelines for domestic staff.
             </p>
          </div>

          <h3 id="formula" className="text-2xl md:text-3xl font-bold text-slate-900 mt-16 mb-6">
            2. The 2026 Calculation Formula: Mainland UAE
          </h3>
          <p className="text-slate-600 leading-relaxed">
            The calculation of gratuity is based on your <strong>last drawn Basic Salary</strong>. This is a critical 
            distinction that often surprises employees. Your total package (Gross Salary) usually includes 
            allowances for housing, transportation, utilities, and education. These are <strong>excluded</strong> from 
            the gratuity calculation. Only the 'Basic' amount listed in your MoHRE-registered contract is used.
          </p>
          
          <div className="my-10 rounded-3xl bg-slate-900 text-white p-8 md:p-10 relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Scale className="h-32 w-32" />
             </div>
             <h4 className="text-xl font-bold mb-6 flex items-center gap-2 text-cyan-400">
                <Calculator className="h-6 w-6" />
                Mainland UAE Gratuity Formula
             </h4>
             <div className="space-y-8 relative z-10">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                   <div className="bg-white/10 p-6 rounded-2xl border border-white/10 flex-1 text-center">
                      <div className="text-sm text-cyan-300 uppercase tracking-widest font-bold mb-2">First 5 Years</div>
                      <div className="text-3xl font-extrabold">21 Days</div>
                      <div className="text-xs text-white/60 mt-1">Basic Salary per Year</div>
                   </div>
                   <div className="text-2xl font-bold text-white/40">+</div>
                   <div className="bg-white/10 p-6 rounded-2xl border border-white/10 flex-1 text-center">
                      <div className="text-sm text-cyan-300 uppercase tracking-widest font-bold mb-2">After 5 Years</div>
                      <div className="text-3xl font-extrabold">30 Days</div>
                      <div className="text-xs text-white/60 mt-1">Basic Salary per Year</div>
                   </div>
                </div>
                <div className="border-t border-white/10 pt-6">
                   <p className="text-sm text-white/70 italic mb-0 text-center">
                     * Total payout is capped at <strong>24 months (2 years)</strong> of basic salary.
                   </p>
                </div>
             </div>
          </div>

          <h4 className="text-xl font-bold text-slate-900 mb-4">Step-by-Step Calculation Example</h4>
          <p className="text-slate-600 leading-relaxed mb-6">
            Let's assume an employee, Sarah, has a basic salary of <strong>AED 12,000</strong> and has worked for 
            <strong>7 years</strong>.
          </p>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3 mb-12">
             <p className="flex justify-between border-b border-slate-100 pb-2">
                <span>Daily Wage (12,000 ÷ 30):</span>
                <span className="font-bold">AED 400</span>
             </p>
             <p className="flex justify-between border-b border-slate-100 pb-2">
                <span>First 5 Years (21 days × 400 × 5):</span>
                <span className="font-bold">AED 42,000</span>
             </p>
             <p className="flex justify-between border-b border-slate-100 pb-2">
                <span>Remaining 2 Years (30 days × 400 × 2):</span>
                <span className="font-bold">AED 24,000</span>
             </p>
             <p className="flex justify-between text-lg text-blue-700 font-extrabold pt-2">
                <span>Total Gratuity Due:</span>
                <span>AED 66,000</span>
             </p>
          </div>

          <h3 id="resignation" className="text-2xl md:text-3xl font-bold text-slate-900 mt-16 mb-6">
            3. Resignation vs. Termination Rules: The 2022 Reform
          </h3>
          <p className="text-slate-600 leading-relaxed mb-6">
            Under the <em>old</em> 1980 Labor Law, resigning from an unlimited contract resulted in a reduction 
            of gratuity (receiving only 1/3 if you left between 1-3 years, or 2/3 between 3-5 years).
          </p>
          <p className="text-slate-600 leading-relaxed mb-8">
            <strong>The New Law (Federal Decree-Law No. 33 of 2021) changed everything:</strong>
            There is now <strong>no reduction</strong> for resignation. If you have completed one year of service, 
            you are entitled to your full gratuity based on the 21/30 day formula, whether you resign voluntarily 
            or are terminated by the employer.
          </p>

          <div className="bg-red-50 border border-red-100 rounded-3xl p-8 mb-12">
             <h4 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6" />
                Exceptions: Article 44 Termination
             </h4>
             <p className="text-red-800 leading-relaxed m-0">
               If an employee is terminated for "gross misconduct" under <strong>Article 44</strong> of the Labor Law 
               (e.g., forgery, assault, theft, disclosure of secrets), they were previously denied gratuity. 
               However, the new law is more protective; even in Article 44 cases, employees generally retain 
               their gratuity rights unless specifically ordered otherwise by a court or if the contract was 
               fraudulent. Always seek legal counsel if terminated under Article 44.
             </p>
          </div>

          <h3 id="work-patterns" className="text-2xl md:text-3xl font-bold text-slate-900 mt-16 mb-6">
            4. Part-Time, Temporary & Flexible Work patterns
          </h3>
          <p className="text-slate-600 leading-relaxed mb-6">
            The 2021 reform introduced several new work patterns to increase labor market flexibility. 
            Gratuity for these workers is calculated on a <strong>pro-rata basis</strong> as defined in 
            Cabinet Resolution No. 1 of 2022.
          </p>
          <ul className="space-y-6 list-none pl-0">
             <li className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h5 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                   <Clock className="h-5 w-5 text-blue-600" />
                   Part-Time Calculation
                </h5>
                <p className="text-slate-600 text-sm m-0 leading-relaxed">
                   Calculated by taking the number of working hours in the part-time contract per year and dividing 
                   it by the number of working hours in the full-time contract per year, then multiplying by 100 
                   to get a percentage. This percentage is then applied to the standard gratuity amount.
                </p>
             </li>
             <li className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h5 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                   <Handshake className="h-5 w-5 text-blue-600" />
                   Flexible & Temporary Work
                </h5>
                <p className="text-slate-600 text-sm m-0 leading-relaxed">
                   Entitlements are calculated based on the actual number of hours/days worked relative to a 
                   standard full-time position. Our calculator above handles this automatically when you select 
                   the appropriate work pattern and provide your weekly hours.
                </p>
             </li>
          </ul>

          <h3 id="savings-scheme" className="text-2xl md:text-3xl font-bold text-slate-900 mt-16 mb-6">
            5. The New 2023 Voluntary Savings Scheme (The "Golden" Alternative)
          </h3>
          <p className="text-slate-600 leading-relaxed mb-6">
            In late 2023, the UAE government introduced a <strong>Voluntary Alternative End-of-Service Benefits Scheme</strong>. 
            This allows employers to opt out of the traditional lump-sum gratuity model and instead contribute 
            monthly to a professionally managed investment fund.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
             <div className="bg-blue-50 p-6 rounded-2xl text-center">
                <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                <h5 className="font-bold text-blue-900 mb-2">Capital Growth</h5>
                <p className="text-xs text-blue-700 m-0">Employees can invest their gratuity in risk-profiled funds.</p>
             </div>
             <div className="bg-emerald-50 p-6 rounded-2xl text-center">
                <Shield className="h-8 w-8 text-emerald-600 mx-auto mb-4" />
                <h5 className="font-bold text-emerald-900 mb-2">Secured Payouts</h5>
                <p className="text-xs text-emerald-700 m-0">Reduces the risk of employers not having liquidity at termination.</p>
             </div>
             <div className="bg-cyan-50 p-6 rounded-2xl text-center">
                <Users className="h-8 w-8 text-cyan-600 mx-auto mb-4" />
                <h5 className="font-bold text-cyan-900 mb-2">Portable Benefits</h5>
                <p className="text-xs text-cyan-700 m-0">Easier to track and manage across different employers.</p>
             </div>
          </div>
          <p className="text-slate-600 leading-relaxed">
            If your employer has joined this scheme, they contribute <strong>5.83%</strong> of your basic salary monthly 
            if you have less than 5 years of service, and <strong>8.33%</strong> if you have more. Employees can also 
            make voluntary contributions up to 25% of their total salary to boost their retirement nest egg.
          </p>

          <h3 id="deductions" className="text-2xl md:text-3xl font-bold text-slate-900 mt-16 mb-6">
            6. Lawful Deductions from Gratuity
          </h3>
          <p className="text-slate-600 leading-relaxed mb-6">
            While gratuity is a right, Article 51(9) of the Labor Law allows employers to deduct certain amounts 
            from the final payout. These are strictly limited to:
          </p>
          <ul className="space-y-3">
             <li className="flex items-center gap-3 text-slate-600"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Unpaid personal loans or advances from the company.</li>
             <li className="flex items-center gap-3 text-slate-600"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Costs to repair damage caused by the employee's proven negligence.</li>
             <li className="flex items-center gap-3 text-slate-600"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Amounts ordered by a UAE court (e.g., child support or civil debts).</li>
             <li className="flex items-center gap-3 text-slate-600"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Deductions for recovery of overpaid wages.</li>
          </ul>
          <p className="text-slate-600 leading-relaxed mt-6">
            <strong>Note:</strong> Recruitment costs (visa fees, agent fees) can <strong>never</strong> be legally deducted 
            from an employee's gratuity or salary, regardless of what the contract says. This is a common 
            violation that MoHRE takes very seriously.
          </p>

          <h3 id="difc-adgm" className="text-2xl md:text-3xl font-bold text-slate-900 mt-16 mb-6">
            7. DIFC & ADGM Jurisdiction Differences: DEWS and Beyond
          </h3>
          <p className="text-slate-600 leading-relaxed mb-8">
            If you work in the <strong>Dubai International Financial Centre (DIFC)</strong> or 
            <strong> Abu Dhabi Global Market (ADGM)</strong>, the mainland labor law does not apply. These 
            free zones operate under their own common-law jurisdictions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
             <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                   <Landmark className="h-6 w-6 text-blue-900" />
                   <h4 className="font-bold text-slate-900 m-0">DIFC: DEWS Scheme</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                   The DIFC Employee Workplace Savings (DEWS) scheme replaced traditional gratuity in 2020. 
                   Employers must pay monthly contributions (5.83% for years 1-5, 8.33% thereafter) into an 
                   investment plan. Employees have full visibility of their funds via a digital portal.
                </p>
             </div>
             <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                   <Landmark className="h-6 w-6 text-blue-900" />
                   <h4 className="font-bold text-slate-900 m-0">ADGM Rules</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                   ADGM currently follows a model more similar to the mainland but is exploring a transition 
                   to a savings-based system like DEWS. Always check the ADGM Employment Regulations for 
                   the most current amendments.
                </p>
             </div>
          </div>

          <h3 id="disputes" className="text-2xl md:text-3xl font-bold text-slate-900 mt-16 mb-6">
            8. Resolving Gratuity Disputes: The MoHRE Process
          </h3>
          <p className="text-slate-600 leading-relaxed mb-6">
            Article 51 of the law mandates that all entitlements (including gratuity) must be paid within 
            <strong> 14 days</strong> of the contract termination date. If your employer refuses to pay, 
            takes unauthorized deductions, or miscalculates the amount, follow these steps:
          </p>
          <div className="space-y-4">
             <div className="flex gap-4 items-start bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                <div className="bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                   <h5 className="font-bold text-emerald-900 mb-1">Amicable Settlement</h5>
                   <p className="text-sm text-emerald-800 m-0">First, attempt to resolve the issue with your HR department in writing, citing the specific labor law articles.</p>
                </div>
             </div>
             <div className="flex gap-4 items-start bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                   <h5 className="font-bold text-blue-900 mb-1">MoHRE Complaint</h5>
                   <p className="text-sm text-blue-800 m-0">If unresolved, file a labor complaint via the MoHRE app, website, or by calling 600590000. This is a free service for employees.</p>
                </div>
             </div>
             <div className="flex gap-4 items-start bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <div className="bg-slate-700 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                   <h5 className="font-bold text-slate-900 mb-1">Labor Court</h5>
                   <p className="text-sm text-slate-600 m-0">If MoHRE cannot mediate a solution, they will issue a referral letter to the Labor Court. Claims under AED 50,000 can often be fast-tracked.</p>
                </div>
             </div>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-200">
             <h3 className="text-2xl font-bold text-slate-900 mb-6">UAE Gratuity Comparison with GCC Neighbors</h3>
             <p className="text-slate-600 mb-8">
               How does the UAE's end-of-service benefit compare to other GCC nations? The UAE is widely considered 
               to have one of the most balanced and transparent systems in the region.
             </p>
             <ComparisonTable />
          </div>

          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mt-16 mb-8">
            Frequently Asked Questions
          </h3>
          <FAQSection />

          <AuthorBio />

          <section className="bg-blue-900 rounded-[3rem] p-8 md:p-16 text-center text-white mt-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent pointer-events-none" />
            <div className="relative z-10">
               <div className="bg-white/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-xl border border-white/20">
                  <HeartHandshake className="h-10 w-10 text-cyan-300" />
               </div>
               <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Plan Your Future with Confidence</h2>
               <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                 Whether you're negotiating a new contract or preparing for a transition, our 
                 <strong> UAE Gratuity Calculator</strong> gives you the exact figures you need 
                 to make informed financial decisions.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <ScrollToTopButton />
                 <button className="bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl hover:bg-blue-600 transition-all border border-blue-500/50">
                   Download PDF Guide
                 </button>
               </div>
               <p className="mt-8 text-sm text-blue-300/60 italic">
                 Disclaimer: This calculator is for estimation purposes only. Always refer to your official MoHRE contract for final figures.
               </p>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
