const faqs = [
  {
    q: "What is an amortization schedule and how does your amortization schedule maker work?",
    a: "An amortization schedule is a complete table showing every payment over the life of a loan, breaking down how much goes to principal versus interest. Our amortization schedule maker calculates this automatically using standard financial formulas. Simply enter your loan amount, interest rate, and term, and the tool generates a month-by-month breakdown with running balances, cumulative interest, and payoff dates. You can also add extra payments to see how they accelerate your payoff.",
  },
  {
    q: "Is this loan amortization chart calculator free to use?",
    a: "Yes, our loan amortization chart calculator is completely free with no hidden fees, no registration required, and no usage limits. You can generate unlimited amortization schedules, use the interactive charts, and download CSV files at no cost. We believe financial transparency tools should be accessible to everyone.",
  },
  {
    q: "How accurate is your amortization table generator compared to bank calculations?",
    a: "Our amortization table generator uses the same standard formulas that banks and mortgage lenders use: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]. The calculations are accurate to the penny for standard fixed-rate loans. Results may vary slightly from your lender's schedule due to rounding practices or specific loan terms (such as PMI, escrow, or fees), but the principal and interest breakdown will match exactly.",
  },
  {
    q: "Can I calculate amortization with extra principal payments?",
    a: "Absolutely. Our amortization chart calculator includes an 'Extra Monthly Payment' field. Enter any additional amount you plan to pay toward principal each month, and the calculator will instantly regenerate your entire schedule showing your new payoff date and total interest savings. This is one of our most popular features for debt-free planning.",
  },
  {
    q: "What types of loans work with this amortization schedule maker?",
    a: "Our calculator supports any fixed-rate amortizing loan including mortgages (15-year, 30-year, and custom terms), auto loans, student loans, personal loans, business loans, and home equity loans. It works best for standard amortizing loans where payments are level and the balance declines to zero over the term.",
  },
  {
    q: "How do I download my amortization schedule?",
    a: "After calculating your schedule, click the 'Download CSV' button to save your complete amortization table. The CSV file includes all columns—payment number, date, total payment, principal, interest, cumulative interest, and remaining balance. It opens in Excel, Google Sheets, and any spreadsheet software.",
  },
  {
    q: "What's the difference between an amortization chart and an amortization table?",
    a: "An amortization table is the numerical spreadsheet showing each payment's details. An amortization chart is the visual representation—typically a line or area graph showing how your balance declines over time or how principal and interest portions shift. Our tool provides both: a detailed table for precise numbers and interactive charts for visual understanding.",
  },
  {
    q: "Why does so much of my early payment go to interest?",
    a: "This is how amortization works by design. Interest is calculated on your current balance, which is highest at the beginning of the loan. Early payments are applied to that large balance, resulting in high interest charges. As your balance decreases through principal payments, the interest portion shrinks and the principal portion grows. Our amortization chart calculator visualizes this transition clearly.",
  },
  {
    q: "Can I use this calculator for biweekly payments?",
    a: "While our calculator is designed for monthly payments, you can approximate biweekly schedules by calculating a loan with half the monthly payment and twice the term, then understanding that you'll make 26 half-payments (13 full payments) per year. For precise biweekly amortization, use the extra payment feature by entering your additional monthly amount.",
  },
  {
    q: "Is my financial data secure when using this calculator?",
    a: "Yes. Our amortization table generator performs all calculations client-side in your browser. Your loan amount, rate, and personal information are never sent to our servers, stored in databases, or shared with third parties. You can calculate sensitive financial scenarios with complete privacy.",
  },
];

export function FAQSection() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
        Frequently Asked Questions About Our Amortization Schedule Maker
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
            <div className="border-t border-slate-100 px-5 pb-5 pt-3 text-slate-600 leading-relaxed">
              {faq.a}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
