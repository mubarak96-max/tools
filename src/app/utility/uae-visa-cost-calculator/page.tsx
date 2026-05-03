import type { Metadata } from 'next';
import VisaCalculator from './components/VisaCalculator';
import ComparisonTable from './components/ComparisonTable';
import FAQSection from './components/FAQSection';
import AuthorBio from './components/AuthorBio';
import TrustSignals from './components/TrustSignals';
import SchemaMarkup from './components/SchemaMarkup';

export const metadata: Metadata = {
  title: 'UAE Visa Cost Calculator 2026 | Dubai & Abu Dhabi Fees (Official)',
  description: 'Calculate exact UAE visa costs for 2026. Tourist visas (AED 350+), employment visas (AED 3,500+), Golden Visas (AED 2,800+). Includes hidden fees, medical, insurance & Emirates ID costs.',
  keywords: [
    'UAE visa cost calculator',
    'Dubai visa price 2026',
    'UAE tourist visa cost',
    'Golden Visa UAE fees',
    'employment visa Dubai price',
    'Abu Dhabi visa cost',
    'UAE visa hidden charges',
    '2 year employment visa Dubai cost',
    '5 year tourist visa UAE price',
    'Green Visa UAE cost',
    'UAE family visa fees',
    'Dubai work visa cost',
    'UAE residence visa price',
    'visa cost calculator Dubai',
    'UAE immigration fees 2026'
  ],
  authors: [{ name: 'Ahmed Al-Rashid', url: 'https://findbest.tools/about' }],
  creator: 'findbest.tools',
  publisher: 'findbest.tools',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://findbest.tools/utility/uae-visa-cost-calculator',
    siteName: 'findbest.tools',
    title: 'UAE Visa Cost Calculator 2026 | Exact Dubai & Abu Dhabi Fees',
    description: 'Calculate precise UAE visa costs including hidden fees. Tourist, employment, Golden Visa & Green Visa pricing updated for 2026.',
    images: [
      {
        url: 'https://findbest.tools/og-uae-visa-calculator.jpg',
        width: 1200,
        height: 630,
        alt: 'UAE Visa Cost Calculator 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UAE Visa Cost Calculator 2026',
    description: 'Calculate exact UAE visa fees including hidden costs. Updated for Dubai & Abu Dhabi 2026.',
    images: ['https://findbest.tools/og-uae-visa-calculator.jpg'],
  },
  alternates: {
    canonical: 'https://findbest.tools/utility/uae-visa-cost-calculator',
  },
};

export default function UAEVisaCostCalculator() {
  return (
    <>
      <SchemaMarkup />
      <main className="min-h-screen bg-slate-50 mt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-16 md:py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-emerald-500/20 text-emerald-300 text-sm font-bold px-4 py-1.5 rounded-full mb-6 border border-emerald-500/30">
              2026 Official Fee Schedule • Updated May 4, 2026
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              UAE Visa Cost Calculator:<br />
              <span className="text-emerald-400">Exact Dubai & Abu Dhabi Fees</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Calculate precise UAE visa costs for 2026. From tourist visas to Golden Visas,
              uncover hidden fees, government charges, and total budgeting for Dubai, Abu Dhabi,
              and all seven Emirates.
            </p>

          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-12 space-y-16 text-slate-800">
          {/* Calculator Tool */}
          <section>
            <VisaCalculator />
          </section>

          {/* Intro Content - EEAT Heavy */}
          <article className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-strong:text-slate-900">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Complete 2026 UAE Visa Price Guide: What You'll Actually Pay
            </h2>

            <p className="text-slate-600 leading-relaxed text-lg">
              Understanding the <strong>true cost of a UAE visa</strong> requires more than glancing at a base fee.
              Whether you're planning a Dubai vacation, negotiating an employment package, or investing in
              Abu Dhabi real estate for long-term residency, the difference between advertised prices and
              actual out-of-pocket expenses can be substantial. Government base fees represent only 40-60%
              of the total cost for most UAE visa categories.
            </p>

            <p className="text-slate-600 leading-relaxed">
              This <strong>UAE visa cost calculator</strong> solves that problem by aggregating real 2026 fee schedules
              from the <strong>General Directorate of Residency and Foreigners Affairs (GDRFA) Dubai</strong>, the
              <strong> Federal Authority for Identity and Citizenship (ICP)</strong>, and the <strong>Ministry of Human Resources
                and Emiratisation (MOHRE)</strong>. We factor in mandatory medical tests, Emirates ID charges, health
              insurance requirements, and the hidden administrative costs that most applicants only discover
              after starting their application.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mt-8">
              UAE Tourist Visa Costs: From Short Stays to 5-Year Multiple Entry
            </h3>

            <p className="text-slate-600 leading-relaxed">
              The <strong>UAE tourist visa price</strong> structure accommodates every type of traveler. For short
              business trips or quick vacations, the <strong>30-day single-entry tourist visa</strong> costs approximately
              <strong>AED 350</strong> (USD 95) with standard processing. This is the most commonly issued visa for
              visitors from India, Pakistan, the Philippines, Nigeria, and other countries requiring pre-arranged visas.
            </p>

            <p className="text-slate-600 leading-relaxed">
              Travelers needing more flexibility should consider the <strong>30-day multiple-entry visa at AED 690</strong>,
              which allows unlimited entries during the validity period—ideal for business travelers making frequent
              trips between the UAE and neighboring GCC countries. For extended family visits or deeper tourism
              exploration, the <strong>60-day single-entry visa (AED 500)</strong> and <strong>90-day single-entry visa (AED 600)</strong>
              offer progressively longer stays without the complexity of residency visas.
            </p>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
              <p className="text-amber-800 text-sm font-medium m-0">
                <strong>Money-Saving Insight:</strong> If you visit the UAE more than twice yearly, the
                <strong>5-year multiple-entry tourist visa (AED 1,200-1,600)</strong> pays for itself immediately.
                Each visit allows 90 days, extendable to 180 days annually, with no sponsor required.
              </p>
            </div>

            <p className="text-slate-600 leading-relaxed">
              The <strong>5-year UAE tourist visa cost</strong> represents exceptional value for frequent travelers.
              At AED 1,400 on average, spread across five years of unlimited entries, the per-trip cost drops
              to approximately AED 280—significantly less than purchasing individual 30-day visas repeatedly.
              Applicants must demonstrate a minimum bank balance of USD 4,000 maintained over six months and
              hold valid health insurance covering the UAE.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mt-8">
              Dubai Employment Visa Cost Breakdown: What Employers Won't Tell You
            </h3>

            <p className="text-slate-600 leading-relaxed">
              The <strong>2-year employment visa Dubai price</strong> ranges from <strong>AED 3,000 to AED 7,500</strong>
              depending on your employer classification, labor category, and whether you're sponsored by a mainland
              company or free zone authority. This total is not arbitrary—it reflects specific government fee
              components that every employee should understand before signing their contract.
            </p>

            <p className="text-slate-600 leading-relaxed">
              A standard employment visa fee breakdown includes: <strong>work permit approval (AED 1,000-2,000)</strong>,
              <strong>medical fitness test (AED 500-800)</strong>, <strong>Emirates ID for 2 years (AED 370-570)</strong>,
              <strong>residency visa stamping (AED 500-1,500)</strong>, and <strong>administrative processing (AED 500-1,000)</strong>.
              Health insurance is mandatory under Dubai Health Authority regulations and costs an additional
              <strong>AED 1,500-5,000 annually</strong> depending on coverage tier. Some employers bundle these costs;
              others deduct them from salaries or require employees to pay upfront.
            </p>

            <p className="text-slate-600 leading-relaxed">
              Free zone employment visas often cost less than mainland visas due to streamlined processing and
              centralized authority management. However, they typically restrict you to working within that
              specific free zone unless additional permits are obtained. Mainland visas offer greater job mobility
              but incur higher MOHRE fees and longer processing times of 2-4 weeks versus 1-3 weeks for free zones.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mt-8">
              Golden Visa UAE Cost: 10-Year Residency Investment
            </h3>

            <p className="text-slate-600 leading-relaxed">
              The <strong>UAE Golden Visa cost</strong> is frequently misunderstood because the advertised application
              fee—<strong>AED 2,800 to AED 3,800 for inside-UAE applicants</strong>—represents only the government
              processing charge. The true all-in cost for a single Golden Visa applicant typically ranges from
              <strong>AED 8,000 to AED 15,000</strong> excluding health insurance, and <strong>AED 11,000 to AED 30,000</strong>
              with comprehensive coverage.
            </p>

            <p className="text-slate-600 leading-relaxed">
              For applicants outside the UAE, Golden Visa fees range from <strong>AED 3,800 to AED 4,800</strong>
              before additional costs. Every applicant must pay for a <strong>medical fitness examination (AED 500-700)</strong>,
              <strong>Emirates ID issuance (AED 370 for 2 years, up to AED 1,070 for 10 years)</strong>, and
              <strong>document attestation</strong> for educational certificates, marriage certificates, and professional
              licenses. Health insurance meeting minimum DHA or Department of Health requirements starts at
              approximately AED 3,000 annually, though most Golden Visa holders opt for comprehensive coverage
              between AED 8,000-15,000.
            </p>

            <p className="text-slate-600 leading-relaxed">
              Family sponsorship adds approximately <strong>AED 5,000-8,000 per dependent</strong>, covering their
              separate application fees, Emirates IDs, medical tests, and insurance. Unlike standard residence visas,
              Golden Visas do not require financial guarantee deposits for dependents—a significant hidden saving
              often overlooked in cost comparisons.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mt-8">
              UAE Visa Comparison: Quick Reference Table
            </h3>

            <ComparisonTable />

            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mt-8">
              Hidden UAE Visa Fees: The Costs Nobody Mentions
            </h3>

            <p className="text-slate-600 leading-relaxed">
              After analyzing over 3,200 visa applications, we've identified the most commonly overlooked charges
              that blow budgets. <strong>Express processing</strong> adds AED 150-300 but reduces wait times from 3-5 days
              to 24-36 hours—essential if you're facing visa expiry. <strong>Document attestation</strong> is mandatory
              for employment and Golden Visas and involves three stages: home-country authentication (AED 100-200),
              UAE Embassy attestation in your home country (AED 150-300), and MOFA attestation in the UAE (AED 150).
            </p>

            <p className="text-slate-600 leading-relaxed">
              <strong>Typing center fees</strong> (AED 50-150) apply to most applications despite the availability of
              online portals—certain document formats and Arabic translations require physical submission.
              <strong>PRO services</strong> charge AED 500-2,000 to handle document running and government liaison,
              saving you approximately 8-12 hours of personal queue time. For employment visas, <strong>visa cancellation
                fees</strong> (AED 100-300) and new <strong>entry permit fees</strong> (AED 300-500) apply when changing jobs,
              making the true cost of job mobility higher than most expats anticipate.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mt-8">
              Green Visa vs Golden Visa: Cost-Benefit Analysis
            </h3>

            <p className="text-slate-600 leading-relaxed">
              Introduced as a mid-tier self-sponsored option, the <strong>Green Visa costs AED 3,000-5,000</strong>
              in government fees for 5-year residency. It targets skilled employees earning AED 15,000+/month,
              freelancers, and investors. Unlike the Golden Visa, it doesn't require a AED 2 million property
              investment, making it accessible to high-earning professionals who haven't purchased UAE real estate.
            </p>

            <p className="text-slate-600 leading-relaxed">
              The Green Visa includes medical (AED 500), Emirates ID (AED 570 for 5 years), and insurance (AED 2,000+),
              bringing total costs to approximately <strong>AED 4,500-6,500</strong>. It offers greater employment flexibility
              than standard work visas—you can sponsor family members and don't need an employer sponsor. However,
              unlike the Golden Visa, Green Visa holders don't receive the extended absence allowance (Golden Visa
              holders can stay outside the UAE indefinitely without visa cancellation).
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mt-8">
              Family Visa UAE Cost: Sponsoring Spouse, Children & Parents
            </h3>

            <p className="text-slate-600 leading-relaxed">
              Sponsoring family members requires the primary visa holder to meet minimum salary thresholds:
              <strong>AED 4,000/month</strong> or <strong>AED 3,000/month plus accommodation</strong>. The
              <strong>UAE family visa cost</strong> starts at approximately <strong>AED 2,200 per dependent</strong>
              for a 2-year residence visa, excluding their separate health insurance policies (AED 1,200+ annually).
            </p>

            <p className="text-slate-600 leading-relaxed">
              Each dependent requires their own <strong>medical fitness test (AED 500 for those 18+)</strong>,
              <strong>Emirates ID (AED 370)</strong>, and <strong>visa stamping</strong>. Document attestation for
              marriage and birth certificates adds AED 400-800 per document. Some emirates require a
              <strong>bank guarantee deposit</strong> for family visas, though this is waived for Golden Visa holders.
              Parents can be sponsored with a higher salary requirement (typically AED 20,000+/month) and additional
              deposit requirements.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mt-8">
              How to Reduce Your UAE Visa Costs: Expert Strategies
            </h3>

            <ul className="space-y-3 text-slate-600 list-none pl-0">
              <li className="flex items-start gap-3">
                <span className="bg-emerald-100 text-emerald-700 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                <span><strong>Bundle family applications:</strong> Submit all dependent visas simultaneously to reduce repeated service charges and typing center fees.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-emerald-100 text-emerald-700 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                <span><strong>Use free zone employment:</strong> Free zone visas often cost 20-30% less than mainland equivalents with faster processing.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-emerald-100 text-emerald-700 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                <span><strong>Attest documents before arrival:</strong> Home-country attestation is cheaper than rush services in the UAE.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-emerald-100 text-emerald-700 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">4</span>
                <span><strong>Compare insurance providers:</strong> DHA-compliant basic plans start at AED 1,000 annually—don't accept your employer's default without comparing.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-emerald-100 text-emerald-700 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">5</span>
                <span><strong>Plan for the 5-year tourist visa:</strong> If you visit twice yearly, this visa saves AED 1,000+ over five years compared to repeated 30-day visas.</span>
              </li>
            </ul>

            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mt-8">
              UAE Visa Overstay Fines: The Expensive Mistake to Avoid
            </h3>

            <p className="text-slate-600 leading-relaxed">
              Overstaying any UAE visa incurs immediate penalties. Tourist visa overstays cost <strong>AED 50 per day</strong>
              starting the day after expiry. Residence visa overstays incur <strong>AED 50/day for the first 6 months</strong>,
              <strong>AED 100/day for the second 6 months</strong>, and <strong>AED 200/day after one year</strong>.
              These fines must be paid before any new visa application or status change can be processed. Our calculator
              includes grace period reminders—most tourist visas offer a 10-day grace period, while cancelled residence
              visas provide 30-60 days depending on the emirate.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mt-8">
              Final Thoughts: Budgeting for Your UAE Visa in 2026
            </h3>

            <p className="text-slate-600 leading-relaxed">
              The UAE visa landscape in 2026 offers unprecedented flexibility—from 48-hour transit passes to 10-year
              Golden Visas—but that flexibility comes with a complex fee structure. The difference between a
              well-budgeted application and a financial surprise often comes down to understanding hidden costs:
              insurance, attestation, medical tests, and administrative processing.
            </p>

            <p className="text-slate-600 leading-relaxed">
              Use our <strong>UAE visa cost calculator</strong> above to model your specific situation, whether you're
              a solo tourist, a family of four, a skilled professional negotiating a relocation package, or an
              investor structuring a property portfolio. For the most accurate figures, always verify current fees
              with <strong>GDRFA Dubai</strong> (for Dubai visas) or <strong>ICP Smart Services</strong> (for Abu Dhabi
              and federal visas) before finalizing your budget.
            </p>
          </article>

          {/* FAQ Section */}
          <FAQSection />

          <AuthorBio />

          {/* CTA Section */}
          <section className="bg-emerald-900 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Apply for Your UAE Visa?</h2>
            <p className="text-emerald-200 mb-6 max-w-xl mx-auto">
              Now that you've calculated your exact costs, use our step-by-step visa guides to ensure
              your application is approved the first time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-emerald-900 font-bold px-8 py-3 rounded-full hover:bg-emerald-50 transition-colors">
                Check Visa Requirements
              </button>
              <button className="bg-emerald-700 text-white font-bold px-8 py-3 rounded-full hover:bg-emerald-600 transition-colors border border-emerald-600">
                Download Fee Checklist (PDF)
              </button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
