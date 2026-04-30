const faqs = [
  {
    q: "How do I calculate fuel cost for a road trip?",
    a: "To calculate fuel cost for a road trip, divide your total trip distance by your vehicle's MPG to get gallons needed, then multiply by current fuel price per gallon. For a 500-mile trip in a 25 MPG vehicle at $3.50/gallon: 500 ÷ 25 = 20 gallons, 20 × $3.50 = $70. Our fuel cost calculator includes round-trip options, state gas prices, and vehicle presets for accurate planning.",
  },
  {
    q: "How much does it cost to drive per mile?",
    a: "Cost per mile depends on your MPG and local gas prices. At $3.50/gallon: 30 MPG = $0.117/mile, 25 MPG = $0.140/mile, 20 MPG = $0.175/mile, 15 MPG = $0.233/mile. Electric vehicles typically cost $0.03-$0.06 per mile depending on electricity rates. Our gas cost calculator shows your exact cost per mile instantly.",
  },
  {
    q: "How do I calculate annual fuel costs for my commute?",
    a: "Multiply your daily round-trip commute distance by work days per month (typically 22), then by 12 months to get annual miles. Divide by MPG and multiply by gas price. Example: 40 miles/day × 22 days × 12 months = 10,560 miles. At 28 MPG and $3.45/gallon: 10,560 ÷ 28 × $3.45 = $1,302 annually. Our calculator automates this with adjustable work days.",
  },
  {
    q: "Is it cheaper to drive or fly for my trip?",
    a: "For solo travelers under 500 miles, driving is often cheaper when you factor in airfare, airport parking, rental cars, and time value. For families, driving becomes economical up to 1,000 miles. Our trip fuel cost calculator helps you compare exact driving costs against flight prices for informed decisions.",
  },
  {
    q: "How much do electric vehicles cost to charge compared to gas?",
    a: "EVs typically cost 60-70% less per mile than gasoline vehicles. A Tesla Model 3 at 25 kWh/100mi with $0.14/kWh electricity costs $3.50 per 100 miles—equivalent to a 100 MPG gas car. A comparable BMW 3 Series at 28 MPG with $3.45/gallon gas costs $12.32 per 100 miles. Our calculator supports direct EV vs. gas comparison.",
  },
  {
    q: "Why do gas prices vary so much between states?",
    a: "State gas price differences stem from: state fuel taxes (ranging from $0.08 in Alaska to $0.77 in Pennsylvania), environmental regulations requiring special blends (California), refinery proximity and capacity, transportation costs from supply centers, and local market competition. Our fuel cost calculator includes current averages for all 50 states.",
  },
  {
    q: "How can I improve my vehicle's fuel economy?",
    a: "Improve MPG by: maintaining proper tire pressure (saves 0.6% per PSI), removing excess weight (100 lbs = 1-2% improvement), using cruise control on highways (7-14% improvement), avoiding rapid acceleration (saves 15-30% in traffic), combining errands into single trips, and keeping your engine properly tuned. Our calculator shows exactly how much each strategy saves annually.",
  },
  {
    q: "What is the IRS mileage rate for 2026?",
    a: "The 2026 IRS standard mileage rate is approximately $0.67 per mile for business use, which combines fuel, maintenance, insurance, and depreciation. For actual expense method taxpayers, fuel costs must be tracked separately. Our calculator's CSV export supports tax documentation requirements.",
  },
  {
    q: "How accurate are EPA fuel economy ratings?",
    a: "EPA ratings are typically 15-25% optimistic compared to real-world driving due to standardized laboratory testing that cannot fully replicate traffic, weather, driving behavior, and accessory use. We recommend using your actual observed MPG rather than EPA ratings in our fuel cost estimator for accurate budgeting.",
  },
  {
    q: "Does premium gasoline improve fuel economy?",
    a: "Premium gasoline (91-93 octane) provides no fuel economy benefit in vehicles designed for regular (87 octane). Only high-performance engines with high compression ratios require premium fuel. Using premium in a regular-grade vehicle wastes approximately $0.50-$0.70 per gallon with zero performance or efficiency gain.",
  },
  {
    q: "How do I calculate diesel fuel costs versus gasoline?",
    a: "Diesel calculation uses the same formula (distance ÷ MPG × price), but diesel engines typically achieve 20-35% better MPG than comparable gas engines. However, diesel fuel often costs $0.30-$0.50 more per gallon and diesel vehicles have higher purchase prices. Our calculator supports both fuel types for direct comparison.",
  },
  {
    q: "Is this fuel cost calculator free to use?",
    a: "Yes, our fuel cost calculator is completely free with no registration required. Calculate unlimited trips, compare unlimited vehicles, and export results to CSV at no cost. All calculations run locally in your browser for privacy—your driving data is never transmitted or stored externally.",
  },
];

export function FAQSection() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
        Fuel Cost Calculator FAQ
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group rounded-xl bg-white border border-slate-200 shadow-sm open:ring-2 open:ring-amber-500/20 transition-all"
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
