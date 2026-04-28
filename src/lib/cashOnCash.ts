// lib/cashOnCash.ts
//
// Cash on Cash Return Calculator for Real Estate Investment
//
// FORMULAS & DEFINITIONS:
// ─────────────────────────────────────────────────────────────────
//
// CASH ON CASH RETURN (CoC):
//   CoC = Annual Pre-Tax Cash Flow / Total Cash Invested × 100
//
//   Annual Pre-Tax Cash Flow = Gross Rental Income
//                            − Vacancy Loss
//                            − Operating Expenses
//                            − Annual Mortgage Payments (P+I)
//
//   Total Cash Invested = Down Payment
//                       + Closing Costs
//                       + Repair/Renovation Costs
//                       + Other Upfront Costs
//
// NET OPERATING INCOME (NOI):
//   NOI = Gross Rental Income − Vacancy Loss − Operating Expenses
//   (NOI does NOT deduct mortgage payments — it is pre-financing)
//
// CAP RATE (Capitalisation Rate):
//   Cap Rate = NOI / Property Value × 100
//   (Measures property performance independent of financing)
//
// GROSS RENT MULTIPLIER (GRM):
//   GRM = Property Price / Annual Gross Rent
//   (Lower = better. <10 often considered good in the US)
//
// DSCR (Debt Service Coverage Ratio):
//   DSCR = NOI / Annual Debt Service
//   (Lenders want ≥ 1.25. Below 1.0 = negative cash flow)
//
// BREAK-EVEN RATIO:
//   BER = (Operating Expenses + Debt Service) / Gross Income
//   (Lower = safer. <85% is common lender threshold)
//
// EQUITY BUILD-UP (Year 1):
//   = Annual principal paid on mortgage
//
// TOTAL RETURN (Cash + Equity + Appreciation):
//   = Cash Flow + Equity Build-Up + Appreciation Value
//   Total Return % = Total Return / Total Cash Invested × 100
//
// ─────────────────────────────────────────────────────────────────

export interface CashOnCashInputs {
  // Purchase
  purchasePrice: number;
  downPaymentPct: number;       // e.g. 25 for 25%
  closingCostsPct: number;      // e.g. 2 for 2% of purchase price
  repairCosts: number;          // upfront renovation/repair budget
  otherUpfrontCosts: number;    // inspection, legal, etc.

  // Mortgage
  interestRatePct: number;      // annual
  loanTermYears: number;
  isInterestOnly: boolean;

  // Income
  monthlyRent: number;          // gross monthly rent
  otherMonthlyIncome: number;   // laundry, parking, pet fees, etc.
  vacancyRatePct: number;       // e.g. 5 for 5%

  // Operating expenses (monthly)
  propertyTaxMonthly: number;
  insuranceMonthly: number;
  propertyManagementPct: number; // % of gross rent
  maintenancePct: number;        // % of gross rent (reserve)
  hoaMonthly: number;
  utilitiesMonthly: number;      // landlord-paid utilities
  otherExpensesMonthly: number;

  // Appreciation
  annualAppreciationPct: number; // expected property appreciation
  annualRentGrowthPct: number;   // expected rent increase per year

  // Analysis period
  holdYears: number;             // years to analyse (1–30)
}

export interface ExpenseBreakdown {
  propertyTax: number;
  insurance: number;
  propertyManagement: number;
  maintenance: number;
  hoa: number;
  utilities: number;
  other: number;
  total: number;
}

export interface CashOnCashResult {
  // Investment summary
  downPayment: number;
  closingCosts: number;
  totalCashInvested: number;
  loanAmount: number;
  ltvRatio: number;

  // Annual income
  grossAnnualRent: number;
  grossAnnualIncome: number;     // rent + other income
  vacancyLoss: number;
  effectiveGrossIncome: number;

  // Expenses
  annualExpenses: ExpenseBreakdown;
  annualMortgagePayment: number;
  monthlyMortgagePayment: number;

  // Core metrics
  noi: number;                   // Net Operating Income
  annualCashFlow: number;        // after mortgage
  monthlyCashFlow: number;

  // Return metrics
  cashOnCashReturn: number;      // %
  capRate: number;               // %
  grm: number;                   // Gross Rent Multiplier
  dscr: number;                  // Debt Service Coverage Ratio
  breakEvenRatio: number;        // %

  // Year 1 equity & total return
  year1EquityBuildUp: number;
  year1Appreciation: number;
  year1TotalReturn: number;
  year1TotalReturnPct: number;

  // Multi-year projections
  yearlyProjections: YearlyProjection[];

  // Flags
  isPositiveCashFlow: boolean;
  isCashFlowNegative: boolean;
  cocRating: "excellent" | "good" | "fair" | "poor" | "negative";
}

export interface YearlyProjection {
  year: number;
  grossRent: number;
  vacancy: number;
  operatingExpenses: number;
  noi: number;
  debtService: number;
  cashFlow: number;
  propertyValue: number;
  loanBalance: number;
  equity: number;
  cumulativeCashFlow: number;
  totalEquity: number;           // equity + cumulative cash flow
  cocReturn: number;             // CoC for that year
}

// ─── Core calculation ──────────────────────────────────────────────

export function calculateCashOnCash(inputs: CashOnCashInputs): CashOnCashResult {
  const {
    purchasePrice, downPaymentPct, closingCostsPct,
    repairCosts, otherUpfrontCosts,
    interestRatePct, loanTermYears, isInterestOnly,
    monthlyRent, otherMonthlyIncome, vacancyRatePct,
    propertyTaxMonthly, insuranceMonthly,
    propertyManagementPct, maintenancePct,
    hoaMonthly, utilitiesMonthly, otherExpensesMonthly,
    annualAppreciationPct, annualRentGrowthPct,
    holdYears,
  } = inputs;

  // ── Upfront costs ──────────────────────────────────────────────
  const downPayment    = purchasePrice * (downPaymentPct / 100);
  const closingCosts   = purchasePrice * (closingCostsPct / 100);
  const totalCashInvested = downPayment + closingCosts + repairCosts + otherUpfrontCosts;
  const loanAmount     = purchasePrice - downPayment;
  const ltvRatio       = purchasePrice > 0 ? (loanAmount / purchasePrice) * 100 : 0;

  // ── Mortgage ───────────────────────────────────────────────────
  const monthlyRate    = interestRatePct / 100 / 12;
  const nPayments      = loanTermYears * 12;

  let monthlyMortgagePayment = 0;
  if (isInterestOnly) {
    monthlyMortgagePayment = loanAmount * monthlyRate;
  } else if (monthlyRate === 0) {
    monthlyMortgagePayment = loanAmount / nPayments;
  } else {
    monthlyMortgagePayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, nPayments))
      / (Math.pow(1 + monthlyRate, nPayments) - 1);
  }
  const annualMortgagePayment = monthlyMortgagePayment * 12;

  // ── Income ─────────────────────────────────────────────────────
  const grossAnnualRent    = monthlyRent * 12;
  const grossAnnualIncome  = (monthlyRent + otherMonthlyIncome) * 12;
  const vacancyLoss        = grossAnnualIncome * (vacancyRatePct / 100);
  const effectiveGrossIncome = grossAnnualIncome - vacancyLoss;

  // ── Operating expenses (annual) ────────────────────────────────
  const propMgmtAmount  = grossAnnualRent * (propertyManagementPct / 100);
  const maintenanceAmt  = grossAnnualRent * (maintenancePct / 100);
  const expenses: ExpenseBreakdown = {
    propertyTax:       propertyTaxMonthly * 12,
    insurance:         insuranceMonthly * 12,
    propertyManagement: propMgmtAmount,
    maintenance:       maintenanceAmt,
    hoa:               hoaMonthly * 12,
    utilities:         utilitiesMonthly * 12,
    other:             otherExpensesMonthly * 12,
    total: 0,
  };
  expenses.total = Object.values(expenses).reduce((a, b) => (typeof b === 'number' ? a + b : a), 0);

  // ── Core metrics ───────────────────────────────────────────────
  const noi            = effectiveGrossIncome - expenses.total;
  const annualCashFlow = noi - annualMortgagePayment;
  const monthlyCashFlow = annualCashFlow / 12;

  // Return metrics
  const cashOnCashReturn = totalCashInvested > 0 ? (annualCashFlow / totalCashInvested) * 100 : 0;
  const capRate          = purchasePrice > 0 ? (noi / purchasePrice) * 100 : 0;
  const grm              = grossAnnualRent > 0 ? purchasePrice / grossAnnualRent : 0;
  const dscr             = annualMortgagePayment > 0 ? noi / annualMortgagePayment : 999;
  const breakEvenRatio   = grossAnnualIncome > 0
    ? ((expenses.total + annualMortgagePayment) / grossAnnualIncome) * 100 : 0;

  // Year 1 equity build-up (principal paid)
  let year1EquityBuildUp = 0;
  if (!isInterestOnly) {
    let bal = loanAmount;
    for (let m = 0; m < 12; m++) {
      const interest  = bal * monthlyRate;
      const principal = monthlyMortgagePayment - interest;
      year1EquityBuildUp += principal;
      bal = Math.max(0, bal - principal);
    }
  }
  const year1Appreciation  = purchasePrice * (annualAppreciationPct / 100);
  const year1TotalReturn   = annualCashFlow + year1EquityBuildUp + year1Appreciation;
  const year1TotalReturnPct = totalCashInvested > 0 ? (year1TotalReturn / totalCashInvested) * 100 : 0;

  // CoC rating
  let cocRating: CashOnCashResult["cocRating"] = "negative";
  if (cashOnCashReturn >= 12)      cocRating = "excellent";
  else if (cashOnCashReturn >= 8)  cocRating = "good";
  else if (cashOnCashReturn >= 4)  cocRating = "fair";
  else if (cashOnCashReturn >= 0)  cocRating = "poor";

  // ── Multi-year projections ────────────────────────────────────
  const yearlyProjections: YearlyProjection[] = [];
  let loanBalance        = loanAmount;
  let currentRent        = monthlyRent + otherMonthlyIncome;
  let currentExpenses    = expenses.total;
  let cumulativeCashFlow = 0;
  let propertyVal        = purchasePrice;

  for (let y = 1; y <= Math.min(holdYears, 30); y++) {
    propertyVal   *= 1 + annualAppreciationPct / 100;
    currentRent   *= 1 + annualRentGrowthPct / 100;

    const yearGrossIncome    = currentRent * 12;
    const yearVacancy        = yearGrossIncome * (vacancyRatePct / 100);
    const yearEGI            = yearGrossIncome - yearVacancy;
    currentExpenses          *= 1 + 0.03; // assume 3% expense inflation
    const yearNOI            = yearEGI - currentExpenses;
    const yearDebtService    = annualMortgagePayment;
    const yearCashFlow       = yearNOI - yearDebtService;
    cumulativeCashFlow       += yearCashFlow;

    // Loan balance
    let yearPrincipal = 0;
    if (!isInterestOnly) {
      let bal = loanBalance;
      for (let m = 0; m < 12; m++) {
        const interest  = bal * monthlyRate;
        const principal = monthlyMortgagePayment - interest;
        yearPrincipal  += principal;
        bal             = Math.max(0, bal - principal);
      }
      loanBalance = Math.max(0, loanBalance - yearPrincipal);
    }

    const equity      = propertyVal - loanBalance;
    const totalEquity = equity; // property equity only (not including cash flow)
    const cocReturn   = totalCashInvested > 0 ? (yearCashFlow / totalCashInvested) * 100 : 0;

    yearlyProjections.push({
      year: y,
      grossRent:         yearGrossIncome,
      vacancy:           yearVacancy,
      operatingExpenses: currentExpenses,
      noi:               yearNOI,
      debtService:       yearDebtService,
      cashFlow:          yearCashFlow,
      propertyValue:     propertyVal,
      loanBalance,
      equity,
      cumulativeCashFlow,
      totalEquity,
      cocReturn,
    });
  }

  return {
    downPayment, closingCosts, totalCashInvested, loanAmount, ltvRatio,
    grossAnnualRent, grossAnnualIncome, vacancyLoss, effectiveGrossIncome,
    annualExpenses: expenses,
    annualMortgagePayment, monthlyMortgagePayment,
    noi, annualCashFlow, monthlyCashFlow,
    cashOnCashReturn, capRate, grm, dscr, breakEvenRatio,
    year1EquityBuildUp, year1Appreciation, year1TotalReturn, year1TotalReturnPct,
    yearlyProjections,
    isPositiveCashFlow: annualCashFlow > 0,
    isCashFlowNegative: annualCashFlow < 0,
    cocRating,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────

export function fmtUSD(n: number, dp = 0): string {
  const sign = n < 0 ? "-" : "";
  return sign + new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD",
    minimumFractionDigits: dp, maximumFractionDigits: dp,
  }).format(Math.abs(n));
}

export function fmtShort(n: number): string {
  const abs  = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000)     return `${sign}$${Math.round(abs / 1_000)}k`;
  return `${sign}$${Math.round(abs)}`;
}

export function fmtPct(n: number, dp = 2): string {
  return `${n.toFixed(dp)}%`;
}

export const COC_RATING_CONFIG = {
  excellent: { label: "Excellent",  colour: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", note: "≥ 12% — strong investment" },
  good:      { label: "Good",       colour: "text-green-700",   bg: "bg-green-50",   border: "border-green-200",   note: "8–12% — solid return" },
  fair:      { label: "Fair",       colour: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200",   note: "4–8% — acceptable" },
  poor:      { label: "Below average", colour: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", note: "0–4% — consider alternatives" },
  negative:  { label: "Negative",   colour: "text-red-600",     bg: "bg-red-50",     border: "border-red-200",     note: "< 0% — losing money" },
};
