import Link from "next/link";
import type { Metadata } from "next";
import { CalendarDays, Calculator, Landmark, ShieldCheck, TrendingUp } from "lucide-react";

import EMICalculator from "@/app/finance/emi-calculator/components/EMICalculator";
import JsonLd from "@/components/seo/JsonLd";
import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";
import { absoluteUrl } from "@/lib/seo/metadata";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  serializeJsonLd,
} from "@/lib/seo/jsonld";

export const revalidate = 43200;

const PAGE_PATH = "/finance/emi-calculator";
const PAGE_URL = absoluteUrl(PAGE_PATH);

const faq = [
  {
    question: "What is EMI?",
    answer:
      "EMI stands for Equated Monthly Instalment. It is the fixed monthly loan payment that covers both principal and interest until the loan is fully repaid.",
  },
  {
    question: "How is EMI calculated?",
    answer:
      "EMI is calculated from three core inputs: loan amount, monthly interest rate, and total number of months. This page uses the standard amortizing loan formula to estimate repayments.",
  },
  {
    question: "What is a good EMI relative to income?",
    answer:
      "A common planning guideline is to keep the loan payment near 20% to 25% of monthly income, with total monthly debt often staying below roughly 40%. Actual lender rules vary by country, lender, and credit profile.",
  },
  {
    question: "How can I reduce my EMI?",
    answer:
      "You can reduce EMI by lowering the loan amount, increasing the tenure, negotiating a lower interest rate, or making a larger down payment when the loan type allows it.",
  },
  {
    question: "Why does a longer tenure lower EMI but increase total interest?",
    answer:
      "A longer term spreads the balance across more months, so each payment gets smaller. The tradeoff is that interest keeps accruing for longer, which usually increases the total repayment amount.",
  },
  {
    question: "Can this EMI calculator tell me the exact offer from a bank?",
    answer:
      "No. This tool provides planning estimates only. Lenders may apply different rates, fees, insurance, processing charges, and eligibility rules when issuing a real loan offer.",
  },
];

export const metadata: Metadata = {
  title: "EMI Calculator | Loan EMI, Total Interest, Affordability, and Repayment",
  description:
    "Use this free EMI calculator to estimate monthly loan payments, total interest, total repayment, affordability, and maximum loan size for home, car, and personal loans.",
  keywords: [
    "EMI calculator",
    "loan EMI calculator",
    "monthly loan payment calculator",
    "home loan EMI calculator",
    "car loan EMI calculator",
    "personal loan EMI calculator",
    "EMI calculator UAE",
    "loan calculator Dubai",
    "how EMI is calculated",
    "what EMI can I afford",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "EMI Calculator With Affordability and Total Interest",
    description:
      "Calculate EMI, compare repayment burden, estimate total interest, and understand what loan size may fit your budget.",
  },
  twitter: {
    card: "summary_large_image",
    title: "EMI Calculator",
    description:
      "Estimate monthly EMI, total repayment, affordability, and a rough maximum loan amount.",
  },
};

function buildEmiApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "EMI Calculator",
    url: PAGE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Free EMI calculator for home, car, and personal loans with affordability guidance, total interest, and amortization schedule.",
    featureList: [
      "Monthly EMI calculation",
      "Total interest and repayment estimate",
      "Affordability signal based on income and debts",
      "Estimated maximum affordable loan",
      "Amortization schedule",
      "Multi-currency support",
    ],
  };
}

export default function EMICalculatorPage() {
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: "EMI Calculator", path: PAGE_PATH },
  ]);
  const faqJsonLd = buildFaqJsonLd(faq);

  return (
    <div className="space-y-8">
      <JsonLd data={serializeJsonLd(buildEmiApplicationJsonLd())} />
      <JsonLd data={serializeJsonLd(breadcrumbs)} />
      {faqJsonLd ? <JsonLd data={serializeJsonLd(faqJsonLd)} /> : null}

      <section className="space-y-4 py-2 sm:py-4">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/finance" className="hover:text-primary">
                Finance
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground">EMI Calculator</li>
          </ol>
        </nav>

        <div className="max-w-4xl">
          <p className="primary-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Loan planning tool
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            EMI Calculator
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            EMI is the fixed monthly payment used to repay a loan over time. This calculator goes
            beyond the basic number by showing total interest, total repayment, affordability
            signals, and a rough estimate of the loan size your budget can support.
          </p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Results are estimates only and do not include lender-specific fees, insurance,
            processing charges, or approval criteria.
          </p>
        </div>

        <div className="mt-6 max-w-2xl">
          <PrivacyNote />
        </div>
      </section>

      <EMICalculator />

      {/* ── EDUCATIONAL EXPANSION ── */}
      <section className="mx-auto max-w-4xl space-y-24 px-4 py-16">
        
        {/* Section 1: The Anatomy of EMI */}
        <article className="prose prose-slate max-w-none">
          <h2 className="text-3xl font-black text-slate-900">Understanding the Anatomy of an EMI</h2>
          <p className="text-lg text-slate-600 leading-relaxed font-medium">
            An <strong>Equated Monthly Instalment (EMI)</strong> is more than just a number on a bill. It is the lifeblood of a loan repayment agreement, designed to be a constant, predictable value that ensures a loan is repaid to zero within a specific timeframe. However, the internal mechanics of that payment change every single month.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Every payment you make is split into two components: <strong>Principal Repayment</strong> (which reduces the actual balance you owe) and <strong>Interest Expense</strong> (the cost of borrowing that balance). In the early years of a long-term loan — such as a 25-year mortgage — your EMI is heavily weighted toward interest. As the balance decreases, the interest portion shrinks, and the principal portion accelerates. This process is known as <strong>Amortization</strong>.
          </p>

          <div className="grid sm:grid-cols-2 gap-8 not-prose my-16">
             {[
               { icon: <Landmark className="h-7 w-7" />, title: "Principal Portion", body: "The slice of your EMI that actually pays off the 'debt'. In early stages, this is small, but it grows exponentially as the loan matures." },
               { icon: <TrendingUp className="h-7 w-7" />, title: "Interest Expense", body: "The profit the lender earns. This is calculated on the remaining balance each month, which is why it decreases over time." },
               { icon: <CalendarDays className="h-7 w-7" />, title: "Tenure Impact", body: "Short tenures mean high EMIs but low total interest. Long tenures provide monthly relief but can double the total cost of the asset." },
               { icon: <ShieldCheck className="h-7 w-7" />, title: "Amortization", body: "The systematic reduction of debt. Our calculator provides a full schedule so you can see exactly when you truly 'own' your asset." },
             ].map((box) => (
                <div key={box.title} className="p-8 rounded-3xl bg-white border border-slate-100 hover:border-primary/30 hover:shadow-2xl transition-all group">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/10 bg-primary/5 text-primary transition-transform group-hover:scale-110">
                    {box.icon}
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mb-3">{box.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">{box.body}</p>
                </div>
             ))}
          </div>
        </article>

        {/* Section 2: Calculating EMI like a Pro */}
        <section className="prose prose-slate max-w-none">
          <h2 className="text-3xl font-black text-slate-900">The Mathematical Truth: How EMI is Calculated</h2>
          <p className="text-slate-600">
            Lenders use a specialized mathematical formula to ensure the EMI remains 'equated' across the term. While our calculator handles the heavy lifting, understanding the formula is essential for financial literacy:
          </p>
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white font-mono text-sm shadow-2xl my-10 overflow-hidden relative group">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
               <Calculator className="w-32 h-32" />
             </div>
             <p className="text-[10px] font-bold uppercase tracking-widest mb-3 opacity-50 text-indigo-400"># Standard Amortization Formula</p>
             <p className="text-xl sm:text-2xl font-bold mb-6">EMI = [P × r × (1 + r)^n] / [(1 + r)^n − 1]</p>
             <ul className="space-y-2 text-indigo-100/70 text-xs">
                <li><strong className="text-white">P:</strong> Principal Loan Amount (The amount you borrow)</li>
                <li><strong className="text-white">r:</strong> Monthly Interest Rate (Annual Rate / 12 / 100)</li>
                <li><strong className="text-white">n:</strong> Loan Tenure in Months (Number of instalments)</li>
             </ul>
          </div>
          <p className="text-slate-600">
            <strong>The Factor of Compounding:</strong> Because the interest is calculated on a "Reducing Balance" basis, your EMI is slightly lower than if interest were calculated on the original amount for the whole term. This is the fairest way to borrow, as you are only paying interest on the money you haven't yet returned.
          </p>
        </section>

        {/* Section 3: Professional Loan Planning */}
        <section className="bg-slate-900 rounded-[3.5rem] p-10 sm:p-20 text-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
             <ShieldCheck className="w-64 h-64" />
          </div>
          
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-black mb-8 leading-tight">Beyond the EMI: Managing Your Debt-to-Income (DTI) Ratio</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              Banks don't just look at whether you can pay the EMI; they look at your <strong>resilience</strong> is. The Debt-to-Income (DTI) ratio is the primary tool used by underwriters to assess risk.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-8 text-left">
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl group-hover:bg-white/10 transition-colors">
                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" /> The 28/36 Rule
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">A gold standard in mortgage planning. Your housing payment should not exceed 28% of gross income, and total debt (EMI + car loans + credit cards) should not exceed 36%.</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl group-hover:bg-white/10 transition-colors">
                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" /> Net Cash Flow
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">Lenders in high-cost cities (like Dubai or London) often use "Residual Income" tests. They subtract your EMI from your Net Income to ensure you have enough 'living money' left.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Deep Dive into Interest Types */}
        <article className="prose prose-slate max-w-none">
          <h2 className="text-3xl font-black text-slate-900">Reducing Balance vs. Flat Rate: The Flat Rate Trap</h2>
          <p className="text-slate-600">
            When comparing loans, you might see two different interest rates. Understanding the difference is critical to avoiding expensive mistakes.
          </p>

          <div className="grid sm:grid-cols-2 gap-8 my-10 not-prose">
            <div className="p-8 rounded-3xl border border-slate-100 bg-white">
              <h4 className="font-black text-slate-900 mb-4">Reducing Balance Rate</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Calculated on the declining principal. As you pay off the loan, the interest charge drops. This is the global standard for mortgages and standard bank loans.
              </p>
            </div>
            <div className="p-8 rounded-3xl border border-rose-100 bg-rose-50/30">
              <h4 className="font-black text-rose-900 mb-4">Flat Rate (The Trap)</h4>
              <p className="text-sm text-rose-800 leading-relaxed">
                Calculated on the full loan amount for the entire duration. Even when you owe only $1, they charge you interest on the full $100. A 5% Flat Rate is often equivalent to a ~9% Reducing Rate.
              </p>
            </div>
          </div>
          
          <p className="text-slate-600 italic">
            <strong>Expert Tip:</strong> Always ask your lender for the <strong>APR (Annual Percentage Rate)</strong> or the <strong>Reducing Equivalent Rate</strong>. This is the only way to compare loans apples-to-apples.
          </p>
        </article>

        {/* Section 5: Optimization Framework - How to Save Thousands */}
        <section className="prose prose-slate max-w-none">
          <h2 className="text-3xl font-black text-slate-900">Optimization Strategies: Reducing Your Total Payment</h2>
          <p className="text-slate-600">You are not stuck with your EMI forever. Here are four strategies professional investors use to minimize interest costs:</p>

          <div className="space-y-8 mt-12">
            {[
              { step: "01", name: "The 'One Extra EMI' Strategy", txt: "Making just one extra EMI payment toward your principal once a year can reduce a 25-year mortgage by nearly 5 years. By targeting the principal early, you drastically reduce the interest base." },
              { step: "02", name: "Round-Up Repayments", txt: "If your EMI is $1,840, round it up to $2,000. This subtle adjustement goes 100% toward principal and has a massive compounding effect over time." },
              { step: "03", name: "Balance Transfers (Refinancing)", txt: "If interest rates drop by 0.75% or more, consider a balance transfer. While there are processing fees, the long-term interest savings often outweigh the upfront cost within 12-18 months." },
              { step: "04", name: "Step-Up EMIs", txt: "If your career path involves consistent salary growth, choose a 'Step-Up' plan. You start with a lower EMI and increase it by 5-10% every year as your income grows." },
            ].map((item) => (
              <div key={item.step} className="flex gap-8 items-start group">
                <div className="text-3xl font-black text-indigo-600/20 group-hover:text-indigo-600 transition-colors shrink-0">{item.step}</div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">{item.name}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">{item.txt}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6: Hidden Costs of Borrowing */}
        <section className="prose prose-slate max-w-none pt-16 border-t border-slate-100">
          <h2 className="text-3xl font-black text-slate-900">The "Real" Cost: Fees and Charges</h2>
          <p className="text-slate-600">
            An EMI calculator tells you the math, but the bank will add 'friction costs' to your agreement. Before signing, ensure you understand:
          </p>
          <ul className="text-slate-600 space-y-4 font-medium">
             <li><strong className="text-slate-900">Processing Fees:</strong> Often 0.5% to 2% of the loan amount, usually deducted from the disbursement.</li>
             <li><strong className="text-slate-900">Credit Life Insurance:</strong> Many lenders require insurance that pays off the loan if you pass away. This can be a significant one-time or monthly cost.</li>
             <li><strong className="text-slate-900">Prepayment Penalties:</strong> High-interest loans often charge you for paying them off early (lock-in periods). Always negotiate for zero prepayment penalties.</li>
             <li><strong className="text-slate-900">Valuation & Legal Fees:</strong> Specific to home loans, these are upfront out-of-pocket costs that don't show up in your EMI calculation.</li>
          </ul>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="space-y-16">
          <div className="text-center">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Advanced Loan FAQ</h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg leading-relaxed">Master the nuances of debt management and interest optimizations with expert guidance.</p>
          </div>
          
          <div className="grid gap-6">
             {[
               { q: "Can I use an EMI calculator for credit card debt?", a: "Yes, but be careful. Credit cards have extremely high interest rates (often 20-40% APR) and different compounding logic. Switch the calculator to 'Personal Loan' mode, enter your balance as the principal, and your card's APR to see how long it takes to clear at different payment levels." },
               { q: "What is the 'Rule of 72' in debt?", a: "The Rule of 72 is usually for investing, but in debt, it tells you how fast your debt doubles if you don't pay interest. Divide 72 by your interest rate. If you have a 12% loan and stop paying, your debt balance will double every 6 years." },
               { q: "Is a variable rate better than a fixed rate?", a: "Variable rates (or 'Reducing' rates) fluctuate with market indexes. They are usually cheaper initially but carry risk if inflation rises. Fixed rates provide peace of mind and budgeting certainty but often come at a 0.5% to 1% premium over variable rates." },
               { q: "Does checking my EMI impact my credit score?", a: "No. Using this calculator is a 'No-Impact' activity. Only when you formally apply for a loan and the lender performs a 'Hard Inquiry' does your credit score take a minor, temporary dip." },
             ].map((item) => (
                <div key={item.q} className="p-10 rounded-[3rem] border border-slate-100 bg-white hover:border-primary/40 hover:shadow-2xl transition-all group">
                   <h3 className="text-xl font-black text-slate-900 mb-4 group-hover:text-primary transition-colors">{item.q}</h3>
                   <p className="text-base text-slate-600 leading-relaxed font-medium">{item.a}</p>
                </div>
             ))}
          </div>
        </section>

      </section>

      <RelatedToolsSection category="Finance" categoryHref="/finance" currentPath={PAGE_PATH} />
    </div>
  );
}
