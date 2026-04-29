const faqs = [
  {
    q: "How do I calculate net pay from gross salary using this calculator?",
    a: "To calculate net pay from gross salary, enter your gross annual income in the 'Gross Annual Salary' field, select your federal filing status (Single, Married, or Head of Household), choose your state of residence, and enter any pre-tax deductions like 401k contributions or health insurance. Click 'Calculate Net Pay from Gross' to see your complete breakdown including federal tax, state tax, FICA, and take-home pay across multiple frequencies.",
  },
  {
    q: "What is the difference between gross income and net income?",
    a: "Gross income is your total earnings before any deductions or taxes. Net income (take-home pay) is what remains after subtracting federal income tax, state income tax, Social Security, Medicare, and any pre-tax deductions. Our gross to net salary calculator shows exactly how much is withheld and what you keep.",
  },
  {
    q: "Can this calculator work backwards from net to gross income?",
    a: "Yes. Switch to the 'Net to Gross' tab and enter your desired take-home pay. The net to gross income calculator will iteratively solve for the gross salary required to produce that net amount after all taxes and deductions, accounting for your filing status and state.",
  },
  {
    q: "Are the tax calculations accurate for 2026?",
    a: "Yes. Our calculator uses 2026 federal tax brackets, standard deductions ($15,000 single, $30,000 married, $22,500 HOH), FICA wage bases, and current state tax rates. We update the calculator annually when the IRS releases official inflation-adjusted figures.",
  },
  {
    q: "Which states have no income tax?",
    a: "Alaska, Florida, Nevada, South Dakota, Tennessee, Texas, Washington, Wyoming, and New Hampshire impose no state income tax on wages. If you select one of these states in our gross to net calculator, state tax will show as $0.",
  },
  {
    q: "What pre-tax deductions should I include?",
    a: "Include any deductions taken from your paycheck before taxes are calculated: traditional 401k or 403b contributions, Health Savings Account (HSA) contributions, Flexible Spending Account (FSA) contributions, and health insurance premiums. These reduce your taxable income and increase net pay compared to post-tax contributions.",
  },
  {
    q: "How does filing status affect my net pay?",
    a: "Filing status determines your standard deduction and tax bracket thresholds. Married couples filing jointly receive a $30,000 standard deduction (2026) and wider tax brackets, typically resulting in lower tax than two single individuals with the same combined income. Head of Household offers a $22,500 standard deduction and favorable brackets for unmarried individuals with dependents.",
  },
  {
    q: "What is FICA and why is it deducted from my paycheck?",
    a: "FICA (Federal Insurance Contributions Act) funds Social Security and Medicare. Employees pay 6.2% for Social Security (up to the wage base of $176,100 in 2026) and 1.45% for Medicare (no cap). High earners pay an additional 0.9% Medicare surtax. Our calculate net pay from gross tool includes all FICA components automatically.",
  },
  {
    q: "Can I use this calculator if I'm paid hourly?",
    a: "Yes. Enter your gross annual salary (hourly rate × hours worked per year). The pay frequency table shows your hourly equivalent, and you can compare how different annual hour assumptions affect net pay. For standard full-time work, use 2,080 hours (40 hours × 52 weeks).",
  },
  {
    q: "Is my salary data stored or shared?",
    a: "No. All calculations happen locally in your browser. Your salary, state, deductions, and results are never sent to our servers, stored in databases, or shared with anyone. You can use our net salary calculator with complete privacy.",
  },
  {
    q: "Why is my actual paycheck slightly different from the calculator?",
    a: "Minor differences can occur due to rounding, exact pay period calculations, employer-specific benefits, local taxes not modeled here, or year-to-date withholding adjustments. Our calculator provides estimates within 1-2% of actual paychecks for most W-2 employees.",
  },
  {
    q: "How can I increase my net pay without getting a raise?",
    a: "Increase pre-tax deductions like 401k contributions and HSA deposits (which reduce taxable income), move to a state with lower or no income tax, adjust your W-4 withholding if you consistently receive large refunds, or negotiate for tax-advantaged benefits like employer-sponsored health insurance or transit benefits.",
  },
];

export function FAQSection() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
        Net Salary Calculator FAQ
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group rounded-xl bg-white border border-slate-200 shadow-sm open:ring-2 open:ring-emerald-500/20 transition-all"
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
