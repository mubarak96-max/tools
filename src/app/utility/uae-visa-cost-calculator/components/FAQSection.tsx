'use client';

import { useState } from 'react';

const faqs = [
  {
    question: "How much does a UAE tourist visa cost in 2026?",
    answer: "A 30-day single-entry UAE tourist visa costs approximately AED 350 (USD 95) in 2026. A 60-day single-entry visa costs AED 500, while a 90-day single-entry visa costs AED 600. For frequent travelers, the 5-year multiple-entry tourist visa costs between AED 1,200 and AED 1,600, allowing 90-day stays per visit extendable to 180 days annually. Multiple-entry 30-day visas cost around AED 690, and 60-day multiple-entry visas cost approximately AED 950."
  },
  {
    question: "What is the total cost of a 2-year employment visa in Dubai?",
    answer: "The total cost of a 2-year Dubai employment visa ranges from AED 3,500 to AED 7,500 in 2026. This comprehensive fee includes the work permit approval (AED 1,000-2,000), medical fitness test (AED 500-800), Emirates ID for 2 years (AED 370-570), residency visa stamping (AED 500-1,500), and administrative processing (AED 500-1,000). Health insurance is mandatory and costs an additional AED 1,500-5,000 annually depending on coverage level. Free zone visas may have different fee structures compared to mainland company visas."
  },
  {
    question: "How much is the UAE Golden Visa fee for 10-year residency?",
    answer: "The UAE Golden Visa application fee ranges from AED 2,800 to AED 3,800 for applicants currently inside the UAE, and AED 3,800 to AED 4,800 for applicants applying from outside the country. However, the total all-in cost typically ranges from AED 8,000 to AED 15,000 per applicant. This includes the base application fee, medical fitness examination (AED 500-700), 10-year Emirates ID (AED 1,070), document attestation (AED 150-300 per document), and mandatory health insurance (AED 3,000-15,000 annually). Family sponsorship adds approximately AED 5,000-8,000 per dependent."
  },
  {
    question: "What are the hidden costs of UAE visa applications?",
    answer: "Beyond advertised base fees, UAE visa applicants should budget for: express/urgent processing fees (AED 150-300), document attestation including home-country foreign affairs, UAE Embassy, and MOFA attestation (AED 150-800 per document), professional translation services, typing center service charges (AED 50-150), medical fitness tests (AED 250-800), Emirates ID fees (AED 100-1,070 depending on duration), mandatory health insurance (AED 1,000-15,000 annually), visa stamping fees (AED 500-1,500), and optional PRO/consultancy fees (AED 500-2,000). For family visas, bank guarantee deposits may also apply depending on the emirate."
  },
  {
    question: "How long does UAE visa processing take in 2026?",
    answer: "Processing times vary by visa type: Tourist visas typically take 1-3 working days (or 36 hours for urgent processing). Employment visas take 5-12 working days after complete document submission. The Green Visa takes 7-14 working days. Golden Visa processing takes 2-4 weeks depending on the category—investor applications through GDRFA Dubai may be processed within 2-4 weeks, while ICP applications in Abu Dhabi can take 3-6 weeks. Professional category applications requiring MOHRE verification may take 4-8 weeks depending on credential attestation complexity."
  },
  {
    question: "Can I get a UAE visa without a job offer?",
    answer: "Yes, several UAE visa options do not require employment sponsorship. These include: the Golden Visa (for investors with AED 2M+ in real estate, entrepreneurs, scientists, and exceptional talents), the Green Visa (for skilled professionals, freelancers, and investors), property investor visas (for real estate purchases of AED 750,000+), student visas (for enrolled students), and retirement visas (for residents over 55 meeting financial criteria). These self-sponsored visas allow you to live in the UAE without a traditional employer sponsor."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="my-12" id="faq">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
        UAE Visa Cost FAQs: Expert Answers for 2026
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
            >
              <span className="font-semibold text-slate-800 pr-4">{faq.question}</span>
              <span className={`transform transition-transform flex-shrink-0 ${openIndex === idx ? 'rotate-180' : ''}`}>
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
            {openIndex === idx && (
              <div className="px-6 pb-4 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
