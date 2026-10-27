import type { HubContent } from "./types";

export const financeHub: HubContent = {
  path: "/finance",
  label: "Finance Tools",
  metaTitle: "Free Finance Calculators: Tax, Salary, Loans & Seller Fees",
  metaDescription:
    "52 free finance calculators for take-home pay, income tax, loans, investing, GCC end-of-service pay, sales tax and online seller margins. Each one shows its formula and runs in your browser.",
  h1: "Finance calculators for pay, tax, loans and small business",
  lead:
    "Work out take-home pay, compare loan offers, check a seller margin or estimate an end-of-service payout. Every calculator shows the formula and assumptions behind its result, so you can check the maths instead of trusting a black box.",
  notice:
    "These calculators give estimates for planning. Tax rules change and individual circumstances vary, so confirm important numbers with the official source or a qualified adviser.",
  intro: [
    "Most money questions come down to a few repeat calculations: how much of a salary you actually keep, what a loan really costs over its full term, how fast savings grow, and whether a product makes a profit once every fee comes out. This section groups the calculators by the job you're trying to do rather than alphabetically, so you can find the right one quickly.",
    "Country-specific tools (the UK, US, Canada, Australia, India, Ireland, the UAE and Saudi Arabia) are built around each country's published rates and thresholds. Check the tax year shown on each tool page, and compare it with the government source if a budget has been announced since.",
    "Everything runs in your browser. Salary, loan and business figures you enter aren't sent to a server or stored, and you don't need an account.",
  ],
  groups: [
    {
      heading: "Salary, take-home pay and income tax",
      intro:
        "Turn a gross salary into net pay after income tax and payroll deductions, or check how a bonus is taxed. Choose the calculator for your country, because thresholds and contributions differ a lot.",
      hrefs: [
        "/finance/us-take-home-pay-calculator",
        "/finance/salary-after-tax-calculator",
        "/finance/net-salary-calculator",
        "/finance/bonus-tax-calculator",
        "/finance/us-self-employment-tax-calculator",
        "/finance/canada-income-tax-calculator",
        "/finance/cpp-ei-calculator",
        "/finance/income-tax-calculator-australia",
        "/finance/income-tax-calculator-india",
        "/finance/india-tds-calculator",
        "/finance/income-tax-calculator-ireland",
        "/finance/uk-student-loan-repayment-calculator",
      ],
    },
    {
      heading: "End-of-service, gratuity and severance pay",
      intro:
        "Estimate what you're owed when a job ends. The UAE and Saudi calculators follow each country's labour law formula, covering basic salary, years of service and the resignation versus termination rules. The UK and US tools model statutory and negotiated severance.",
      hrefs: [
        "/finance/uae-gratuity-calculator",
        "/finance/saudi-end-of-service-calculator",
        "/finance/uk-severance-pay-calculator",
        "/finance/us-severance-pay-calculator",
        "/finance/uae-visa-cost-calculator",
      ],
    },
    {
      heading: "Islamic finance",
      intro:
        "Work out zakat due on savings, gold and business assets, and compare the total cost of halal home finance structures (Ijara, Murabaha, Diminishing Musharaka) with a conventional mortgage.",
      hrefs: ["/finance/zakat-calculator", "/finance/halal-mortgage-calculator"],
    },
    {
      heading: "Loans, mortgages and repayments",
      intro:
        "See the real cost of borrowing: monthly payments, total interest, and how the balance falls over time. Use the amortization calculator to test overpayments, and the PMI calculator to see when private mortgage insurance drops off.",
      hrefs: [
        "/finance/emi-calculator",
        "/finance/car-loan-emi-calculator",
        "/finance/amortization-chart-calculator",
        "/finance/pmi-calculator",
        "/finance/house-affordability-calculator-australia",
        "/finance/australia-stamp-duty-calculator",
        "/finance/car-depreciation-calculator",
      ],
    },
    {
      heading: "Saving, investing and retirement",
      intro:
        "Project how money grows with compound interest, regular contributions and reinvested dividends. The retirement tools apply the current contribution limits, and the rule of 72 gives a quick doubling-time check.",
      hrefs: [
        "/finance/compound-interest-calculator",
        "/finance/rule-of-72-calculator",
        "/finance/dividend-reinvestment-calculator",
        "/finance/cd-ladder-calculator",
        "/finance/401k-match-calculator",
        "/finance/roth-ira-calculator",
        "/finance/india-sip-calculator",
        "/finance/capital-gains-tax-canada-calculator",
        "/finance/inheritance-tax-calculator",
        "/finance/crypto-mining-calculator",
      ],
    },
    {
      heading: "Sales tax, GST and VAT",
      intro:
        "Add tax to a price or strip it back out of a tax-inclusive total. The rates are kept up to date for California cities and counties, Canadian provinces (GST, HST, PST, QST) and Australian GST.",
      hrefs: [
        "/finance/sales-tax-california-calculator",
        "/finance/sales-tax-canada-calculator",
        "/finance/canada-hst-gst-calculator",
        "/finance/australia-gst-calculator",
        "/finance/tip-calculator",
      ],
    },
    {
      heading: "Online sellers and small business",
      intro:
        "Check whether a product or business makes money before you commit. The marketplace calculators itemise referral, fulfilment and listing fees. The break-even and pricing tools show how many units you need to sell and at what price.",
      hrefs: [
        "/finance/amazon-fba-calculator-uk",
        "/finance/amazon-fba-canada-calculator",
        "/finance/etsy-profit-calculator",
        "/finance/dropshipping-break-even",
        "/finance/product-pricing-calculator",
        "/finance/break-even-calculator",
        "/finance/equity-dilution-calculator",
        "/finance/invoice-generator",
      ],
    },
    {
      heading: "Business insurance and risk",
      intro:
        "Get a ballpark figure for general liability and workers' compensation premiums by industry and payroll, and score your overall risk exposure before you ask brokers for quotes.",
      hrefs: [
        "/finance/general-liability-insurance-cost-estimator",
        "/finance/workers-comp-premium-calculator",
        "/finance/business-risk-exposure-score-calculator",
      ],
    },
  ],
  methodology: {
    heading: "How these calculators are built",
    points: [
      {
        title: "Official rates, cited",
        body: "Tax bands, contribution limits and fee schedules come from government or platform sources (IRS, HMRC, CRA, ATO, MOHRE, Amazon Seller Central), not from third-party summaries.",
      },
      {
        title: "The formula is shown",
        body: "Results come with the steps used to reach them, so you can check the logic against your own payslip, contract or statement.",
      },
      {
        title: "Dated and reviewed",
        body: "Each tool states the tax year or rate period it covers. When a budget or fee change is announced, the affected tools are updated and re-dated.",
      },
      {
        title: "Private by default",
        body: "Calculations run locally in your browser. The numbers you type aren't uploaded or saved.",
      },
    ],
  },
  guides: [
    { title: "Halal mortgage structures compared", href: "/blog/halal-mortgage-structure-comparison" },
    { title: "Hidden costs of Islamic mortgages in the UK", href: "/blog/hidden-costs-of-islamic-mortgages-uk" },
    { title: "First-time buyer halal mortgage guide (UK)", href: "/blog/first-time-buyer-halal-mortgage-guide-uk" },
  ],
  faqs: [
    {
      question: "Are these finance calculators accurate enough to rely on?",
      answer:
        "They use published rates and show their working, so they're accurate for planning and for checking a figure someone has given you. They can't account for every personal circumstance, such as tax credits, salary sacrifice or contract terms, so treat the result as an estimate and confirm big decisions with the official source or an adviser.",
    },
    {
      question: "Which tax year do the income tax calculators use?",
      answer:
        "Each calculator states its tax year near the top of the page. Country tools are updated when new rates are published, usually after each national budget.",
    },
    {
      question: "Do you store the salary or financial data I enter?",
      answer:
        "No. The calculations run in your browser and the figures you enter are never sent to our servers.",
    },
    {
      question: "How is UAE gratuity calculated?",
      answer:
        "Under the UAE Labour Law (Federal Decree-Law No. 33 of 2021), private-sector employees qualify after one year of continuous service. Gratuity is based on your last basic salary, not including allowances: 21 days' basic pay for each of the first five years of service, and 30 days for each year after that, capped at two years' total wages. The UAE gratuity calculator applies these rules and shows the breakdown.",
    },
    {
      question: "What's the difference between a gross and a net salary calculator?",
      answer:
        "Gross salary is what your employer agrees to pay. Net (take-home) salary is what reaches your bank account after income tax, social security and other deductions. The salary tools start from gross and work down to net, showing each deduction separately.",
    },
  ],
};
