const faqs = [
  {
    q: "How accurate is this crypto mining calculator compared to actual mining profits?",
    a: "Our crypto mining calculator uses standard network difficulty formulas and real-time market parameters to provide estimates accurate within 5-10% of actual earnings. Variance comes from pool luck, actual power draw fluctuations, and rapid difficulty changes. We recommend using conservative electricity rates and updating coin prices regularly for the most accurate projections.",
  },
  {
    q: "Is Bitcoin mining still profitable in 2026?",
    a: "Bitcoin mining profitability in 2026 depends entirely on your electricity costs and hardware efficiency. With modern ASICs like the Antminer S21 and electricity under $0.10/kWh, mining remains highly profitable. Above $0.15/kWh, only the most efficient operations generate returns. Use our Bitcoin mining profitability calculator with your specific parameters for an exact answer.",
  },
  {
    q: "What is the best GPU for mining altcoins in 2026?",
    a: "The NVIDIA RTX 4090 and AMD RX 7900 XTX currently offer the best balance of hash rate, power efficiency, and resale value for GPU mining. For budget-conscious miners, the RTX 3080 and RX 6800 XT remain viable on networks like Kaspa and Ravencoin. Our GPU mining calculator includes presets for all major mining GPUs.",
  },
  {
    q: "How do I calculate my crypto mining electricity costs?",
    a: "Multiply your miner's power consumption in kilowatts by your electricity rate per kWh and the number of hours operated. For example, a 3,000W ASIC at $0.12/kWh running 24/7 costs: 3.0 kW × $0.12 × 24 hours = $8.64 daily. Our crypto mining electricity cost calculator automates this and projects costs over monthly and yearly periods.",
  },
  {
    q: "What is a good hash rate for Bitcoin mining?",
    a: "For Bitcoin, modern ASICs measure hash rate in terahashes per second (TH/s). Entry-level profitable mining starts around 100 TH/s (Antminer S19k Pro), while professional operations deploy machines exceeding 200 TH/s (Antminer S21 at 234 TH/s). Our ASIC mining calculator shows exactly how different hash rates translate to daily revenue.",
  },
  {
    q: "How long does it take to break even on a mining rig?",
    a: "Break-even timelines vary from 8 months to never, depending on hardware cost, electricity rates, coin prices, and network difficulty. A $4,500 ASIC earning $20 daily net profit breaks even in 225 days. The same machine earning $5 daily requires 900 days. Our crypto mining ROI calculator shows your exact break-even day based on current conditions.",
  },
  {
    q: "Can I mine cryptocurrency with solar power?",
    a: "Yes, solar-powered mining is increasingly popular. The key is sizing your solar array to match mining consumption and accounting for nighttime grid electricity costs. Our calculator helps you model blended electricity rates (solar daytime + grid nighttime) to determine if renewable mining improves your profitability.",
  },
  {
    q: "What are mining pool fees and why do they matter?",
    a: "Mining pools charge 1-3% of your gross earnings for coordinating hash power and guaranteeing consistent payouts. On $10,000 annual revenue, a 2.5% fee costs $250. Our mining profit calculator deducts pool fees automatically, ensuring your net profit estimates reflect real take-home earnings rather than gross figures.",
  },
  {
    q: "How does network difficulty affect my mining profits?",
    a: "Network difficulty adjusts to maintain consistent block times as total network hash power changes. When difficulty increases 10%, your share of rewards decreases 10% (assuming constant hash rate). Our cryptocurrency mining estimator allows you to model difficulty scenarios, helping you prepare for market shifts that affect profitability.",
  },
  {
    q: "Should I mine Bitcoin or altcoins in 2026?",
    a: "Bitcoin offers stability and liquidity but requires expensive ASIC hardware. Altcoins allow GPU mining with lower entry costs but higher volatility. Many miners diversify: ASICs for Bitcoin base load, GPUs for speculative altcoin mining. Our crypto mining calculator supports both strategies with dedicated presets for Bitcoin ASICs and GPU altcoin configurations.",
  },
  {
    q: "Is this crypto mining calculator free to use?",
    a: "Yes, our crypto mining calculator is completely free with no registration, no usage limits, and no hidden fees. All calculations run locally in your browser for privacy. You can export unlimited CSV projections and access all features without payment.",
  },
  {
    q: "How do I report crypto mining income on taxes?",
    a: "Mined cryptocurrency is typically taxed as ordinary income at fair market value on the date received. You may also deduct operational expenses including electricity, hardware depreciation, and maintenance. Our calculator tracks daily production values, and the CSV export provides records compatible with tax software. Consult a crypto tax professional for jurisdiction-specific guidance.",
  },
];

export function FAQSection() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Crypto Mining Calculator FAQ
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group rounded-xl bg-slate-800/50 border border-slate-700 open:border-emerald-500/50 transition-all"
          >
            <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-slate-200 marker:content-none">
              <span>{faq.q}</span>
              <svg
                className="h-5 w-5 text-slate-500 transition-transform group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="border-t border-slate-700 px-5 pb-5 pt-3 text-slate-300 leading-relaxed text-sm">
              {faq.a}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
