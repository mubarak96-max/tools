const faqs = [
  {
    q: "How does the Navy calculate body fat percentage?",
    a: "The Navy calculates body fat using circumference measurements per OPNAVINST 6110.1J. For males: measure neck and abdomen, then apply %BF = 86.010 × log10(abdomen - neck) - 70.041 × log10(height) + 36.76. For females: measure neck, waist, and hips, then apply %BF = 163.205 × log10(waist + hip - neck) - 97.684 × log10(height) - 78.387. All measurements in inches.",
  },
  {
    q: "What are the Navy body fat standards for 2026?",
    a: "Navy body fat maximums are age-adjusted: Males—22% (17-20), 23% (21-27), 24% (28-39), 26% (40+). Females—33% (17-20), 34% (21-27), 35% (28-39), 36% (40+). Exceeding these limits results in PRT failure and FEP enrollment.",
  },
  {
    q: "What happens if I fail the Navy body fat tape test?",
    a: "Failing the BCA means automatic PRT failure regardless of cardio/strength performance. You'll enter the Fitness Enhancement Program (FEP) for remedial training. Three PRT failures in 4 years can trigger administrative separation from the Navy.",
  },
  {
    q: "Can I use this Navy body fat calculator for official PRT documentation?",
    a: "This calculator provides accurate self-assessment using official formulas, but only Command Fitness Leaders (CFLs) can administer official BCA measurements. Use this tool for training and preparation, then verify with your command's official measurement.",
  },
  {
    q: "How accurate is the Navy tape test compared to other methods?",
    a: "The Navy circumference method correlates within 3-4% of hydrostatic weighing (underwater weighing). It's less accurate than DEXA scans (±1-2%) but far more practical for fleet-wide deployment. Proper technique is essential—improper measurement causes most errors.",
  },
  {
    q: "Where exactly do I measure for the Navy body fat test?",
    a: "Males: Neck below larynx (perpendicular), abdomen at navel level (horizontal, after exhale). Females: Neck below larynx (perpendicular), waist at natural narrowest point (horizontal), hips at widest buttocks point (horizontal). All measurements use non-stretch tape, snug but not compressing.",
  },
  {
    q: "How can I reduce my Navy body fat measurement quickly?",
    a: "Sustainable fat loss requires 500-750 calorie daily deficit through diet and exercise. Focus on: reducing sodium 48 hours before measurement (reduces water retention), consistent cardio (150+ min/week moderate), resistance training (preserves muscle), adequate sleep (7-9 hours regulates hormones). Avoid crash diets—they cause muscle loss and rebound gain.",
  },
  {
    q: "Does muscle mass affect the Navy body fat calculator?",
    a: "Yes, but favorably. The circumference method accounts for muscular builds better than height-weight tables. However, extremely muscular sailors with large necks may show lower body fat percentages because the formula subtracts neck circumference from abdomen/waist measurements.",
  },
  {
    q: "What is the difference between Navy male and female body fat standards?",
    a: "Female standards are approximately 10-11 percentage points higher than male standards across all age brackets. This reflects essential physiological differences—women require higher body fat for hormonal function, reproductive health, and essential organ protection. The 33% female max (17-20) versus 22% male max is medically appropriate, not a fitness disparity.",
  },
  {
    q: "Can pregnant sailors take the body fat test?",
    a: "Pregnant sailors and those within 6 months postpartum receive PRT/BCA exemptions. After the exemption period, normal standards apply. Medical officers provide specific guidance for return-to-fitness timelines based on individual recovery.",
  },
  {
    q: "How often is the Navy PRT conducted?",
    a: "The PRT is conducted twice yearly (biannually) for active duty and annually for reservists. Commands may conduct additional mock PRTs for training. BCA measurements can occur during monthly weigh-ins or command fitness assessments.",
  },
  {
    q: "Is this Navy body fat calculator free to use?",
    a: "Yes, our US Navy body fat calculator is completely free with no registration required. All calculations run locally in your browser for operational security—your measurements are never transmitted to external servers. Export results to CSV for personal record-keeping.",
  },
];

export function FAQSection() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
        Navy Body Fat Calculator FAQ
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group rounded-xl bg-white border border-slate-200 shadow-sm open:ring-2 open:ring-blue-500/20 transition-all"
          >
            <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-slate-900 marker:content-none">
              <span>{faq.q}</span>
              <svg
                className="h-5 w-5 text-slate-400 transition-transform group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="border-t border-slate-100 px-5 pb-5 pt-3 text-slate-600 leading-relaxed text-sm">
              {faq.a}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
