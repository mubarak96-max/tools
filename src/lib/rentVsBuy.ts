// lib/rentVsBuy.ts
//
// Rent vs Buy calculator engine with mortgage interest tax deduction modelling.
//
// ─── TAX DEDUCTION SYSTEMS ───────────────────────────────────────────────────
//
// UNITED STATES
//   • Mortgage Interest Deduction (MID): taxpayers who itemise can deduct
//     interest paid on up to $750,000 of mortgage debt (post-2017
//     TCJA limit; $1M for loans originated before Dec 16 2017).
//   • Property tax deduction: SALT deduction capped at $10,000/year.
//   • To benefit from itemising, deductions must exceed the standard deduction
//     ($14,600 single / $29,200 married filing jointly, 2024).
//   • Capital gains exclusion on sale: $250,000 single / $500,000 MFJ if
//     owned and lived in for 2 of last 5 years.
//
// UNITED KINGDOM
//   • Mortgage interest relief for primary residences was abolished in 1999.
//   • No property tax deduction for homeowners (Council Tax is not deductible).
//   • Buy-to-let landlords: mortgage interest is a 20% tax credit (Section 24).
//   • Annual Exempt Amount for CGT: £3,000 (2024/25).
//   • Primary Residence Relief (PRR): CGT-free on main home.
//
// UAE / GCC
//   • No income tax, so no mortgage interest or property tax deductions.
//   • No capital gains tax on residential property.
//
// This calculator models the US system (most complex, most searched) with a
// "No tax relief" toggle for UK/UAE users. The logic is clearly documented
// so developers can extend it to other jurisdictions.
// ─────────────────────────────────────────────────────────────────────────────

export type TaxRegime = "us_itemise" | "us_standard" | "uk" | "none";
export type FilingStatus = "single" | "married";

export interface RentVsBuyInputs {
  // Property
  homePrice: number;
  downPaymentPct: number; // e.g. 20 for 20%
  mortgageRatePct: number; // annual, e.g. 6.5
  mortgageTermYears: number; // 15 or 30
  propertyTaxRatePct: number; // annual as % of home value, e.g. 1.2
  homeInsuranceAnnual: number;
  maintenancePct: number; // annual as % of home value, e.g. 1.0
  hoaMonthly: number;
  homeAppreciationPct: number; // annual, e.g. 3.0
  sellingCostPct: number; // agent fees + closing costs on sale, e.g. 6.0

  // Renting
  monthlyRent: number;
  rentIncreaseAnnualPct: number; // e.g. 3.0
  rentersInsuranceMonthly: number;

  // Investment / opportunity cost
  investmentReturnPct: number; // what the down payment could earn if invested
  marginalTaxRatePct: number; // federal + state marginal income tax rate
  filingStatus: FilingStatus;

  // Tax regime
  taxRegime: TaxRegime;

  // Time horizon
  yearsToAnalyse: number; // 1–30
}

export interface YearlySnapshot {
  year: number;
  // Buying
  buyMortgagePayment: number; // annual P+I
  buyInterestPaid: number;
  buyPrincipalPaid: number;
  buyPropertyTax: number;
  buyInsurance: number;
  buyMaintenance: number;
  buyHoa: number;
  buyTaxSaving: number; // interest + property tax deduction value
  buyNetAnnualCost: number; // gross costs minus tax saving
  buyEquity: number; // home value minus remaining balance
  buyHomeValue: number;
  buyMortgageBalance: number;
  buyCumulativeCost: number; // total out-of-pocket to date (net of tax savings)
  buyNetWorth: number; // equity minus cumulative net cost

  // Renting
  rentMonthly: number;
  rentAnnual: number;
  rentInsurance: number;
  rentInvestmentValue: number; // what down payment + monthly savings would be worth
  rentCumulativeCost: number;
  rentNetWorth: number; // investment value minus cumulative rent paid

  // Crossover
  buyAhead: boolean; // true if buying has higher net worth this year
}

export interface RentVsBuyResult {
  // Summary
  breakEvenYear: number | null; // year buying becomes cheaper, null if never
  winner: "buy" | "rent" | "tie";
  winnerMargin: number; // net worth difference at end of analysis period
  totalBuyCost: number; // total net cost of buying over period
  totalRentCost: number; // total cost of renting over period
  totalTaxSavings: number; // cumulative tax savings from deductions

  // Buying summary
  finalHomeValue: number;
  finalEquity: number;
  finalMortgageBalance: number;
  buyNetWorthFinal: number;

  // Renting summary
  rentInvestmentFinal: number;
  rentNetWorthFinal: number;

  // Year-by-year data
  schedule: YearlySnapshot[];

  // Inputs echo (for display)
  downPaymentAmount: number;
  financeAmount: number;
  monthlyMortgagePayment: number;
  standardDeduction: number;
}

// US Standard deductions 2024
const STANDARD_DEDUCTION: Record<FilingStatus, number> = {
  single: 14600,
  married: 29200,
};

// SALT cap
const SALT_CAP = 10000;

// MID loan limit (post-TCJA)
const MID_LOAN_LIMIT = 750000;

export function calculateRentVsBuy(inputs: RentVsBuyInputs): RentVsBuyResult {
  const {
    homePrice,
    downPaymentPct,
    mortgageRatePct,
    mortgageTermYears,
    propertyTaxRatePct,
    homeInsuranceAnnual,
    maintenancePct,
    hoaMonthly,
    homeAppreciationPct,
    sellingCostPct,
    monthlyRent,
    rentIncreaseAnnualPct,
    rentersInsuranceMonthly,
    investmentReturnPct,
    marginalTaxRatePct,
    filingStatus,
    taxRegime,
    yearsToAnalyse,
  } = inputs;

  const downPayment = homePrice * (downPaymentPct / 100);
  const loanAmount = homePrice - downPayment;
  const monthlyRate = mortgageRatePct / 100 / 12;
  const nPayments = mortgageTermYears * 12;
  const taxRate = marginalTaxRatePct / 100;
  const stdDeduction = STANDARD_DEDUCTION[filingStatus];

  // Monthly mortgage payment (P+I)
  const monthlyMortgagePayment =
    monthlyRate === 0
      ? loanAmount / nPayments
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, nPayments)) /
        (Math.pow(1 + monthlyRate, nPayments) - 1);

  const annualMortgagePayment = monthlyMortgagePayment * 12;

  // Investment return rate (monthly, for down payment opportunity cost)
  const monthlyInvestReturn = investmentReturnPct / 100 / 12;

  const schedule: YearlySnapshot[] = [];
  let mortgageBalance = loanAmount;
  let homeValue = homePrice;
  let currentRent = monthlyRent;
  let buyCumulativeCost = downPayment; // down payment is upfront cost
  let rentCumulativeCost = 0;
  let totalTaxSavings = 0;

  // Down payment invested grows at investment return rate
  let rentInvestmentValue = downPayment;

  // For tracking break-even
  let breakEvenYear: number | null = null;
  let prevBuyAhead = false;

  for (let y = 1; y <= yearsToAnalyse; y++) {
    // ── BUYING ──────────────────────────────────────────────
    homeValue *= 1 + homeAppreciationPct / 100;

    let yearInterest = 0;
    let yearPrincipal = 0;

    const paymentsThisYear = Math.min(12, Math.max(0, nPayments - (y - 1) * 12));

    for (let m = 0; m < paymentsThisYear; m++) {
      const interestM = mortgageBalance * monthlyRate;
      const principalM = monthlyMortgagePayment - interestM;
      yearInterest += interestM;
      yearPrincipal += principalM;
      mortgageBalance = Math.max(0, mortgageBalance - principalM);
    }

    const propertyTax = homeValue * (propertyTaxRatePct / 100);
    const insurance = homeInsuranceAnnual;
    const maintenance = homeValue * (maintenancePct / 100);
    const hoa = hoaMonthly * 12;

    // Tax savings calculation
    let taxSaving = 0;
    if (taxRegime === "us_itemise" || taxRegime === "us_standard") {
      // Deductible interest is limited to MID loan limit proportion
      const deductibleProportion = Math.min(1, MID_LOAN_LIMIT / Math.max(loanAmount, 1));
      const deductibleInterest = yearInterest * deductibleProportion;
      const deductiblePropertyTax = Math.min(propertyTax, SALT_CAP);
      const totalItemisedDeductions = deductibleInterest + deductiblePropertyTax;

      if (taxRegime === "us_itemise") {
        // User is itemising — full deduction value
        taxSaving = totalItemisedDeductions * taxRate;
      } else {
        // us_standard: only the amount ABOVE the standard deduction is a marginal benefit
        const marginalDeduction = Math.max(0, totalItemisedDeductions - stdDeduction);
        taxSaving = marginalDeduction * taxRate;
      }
    }
    // UK and "none" regimes: taxSaving = 0

    totalTaxSavings += taxSaving;

    const grossBuyCost = annualMortgagePayment + propertyTax + insurance + maintenance + hoa;
    const netBuyCost = grossBuyCost - taxSaving;
    buyCumulativeCost += netBuyCost;

    const buyEquity = homeValue - mortgageBalance;

    // Net worth for buyer: equity (net of selling costs) minus cumulative net costs
    const netSaleProceeds = homeValue * (1 - sellingCostPct / 100) - mortgageBalance;
    const buyNetWorth = netSaleProceeds - buyCumulativeCost + downPayment; // add back down payment as it's in cumulative

    // ── RENTING ─────────────────────────────────────────────
    const rentAnnual = currentRent * 12;
    const rentInsuranceAnnual = rentersInsuranceMonthly * 12;
    rentCumulativeCost += rentAnnual + rentInsuranceAnnual;

    // Monthly savings: if rent is cheaper than buying, renter can invest the difference
    const monthlySavings = Math.max(0, monthlyMortgagePayment + propertyTax / 12 + insurance / 12 + maintenance / 12 + hoaMonthly - currentRent - rentersInsuranceMonthly);

    // Grow existing investment + add monthly savings
    for (let m = 0; m < 12; m++) {
      rentInvestmentValue *= 1 + monthlyInvestReturn;
      rentInvestmentValue += monthlySavings;
    }

    // Renter net worth: investment value minus cumulative rent paid
    const rentNetWorth = rentInvestmentValue - rentCumulativeCost;

    // Break-even detection
    const buyAhead = buyNetWorth > rentNetWorth;
    if (buyAhead && !prevBuyAhead && breakEvenYear === null && y > 1) {
      breakEvenYear = y;
    }
    prevBuyAhead = buyAhead;

    schedule.push({
      year: y,
      buyMortgagePayment: annualMortgagePayment,
      buyInterestPaid: yearInterest,
      buyPrincipalPaid: yearPrincipal,
      buyPropertyTax: propertyTax,
      buyInsurance: insurance,
      buyMaintenance: maintenance,
      buyHoa: hoa,
      buyTaxSaving: taxSaving,
      buyNetAnnualCost: netBuyCost,
      buyEquity,
      buyHomeValue: homeValue,
      buyMortgageBalance: mortgageBalance,
      buyCumulativeCost,
      buyNetWorth,
      rentMonthly: currentRent,
      rentAnnual,
      rentInsurance: rentInsuranceAnnual,
      rentInvestmentValue,
      rentCumulativeCost,
      rentNetWorth,
      buyAhead,
    });

    // Escalate rent
    currentRent *= 1 + rentIncreaseAnnualPct / 100;
  }

  const last = schedule[schedule.length - 1];
  const winner =
    last.buyNetWorth > last.rentNetWorth
      ? "buy"
      : last.rentNetWorth > last.buyNetWorth
      ? "rent"
      : "tie";

  return {
    breakEvenYear,
    winner,
    winnerMargin: Math.abs(last.buyNetWorth - last.rentNetWorth),
    totalBuyCost: last.buyCumulativeCost,
    totalRentCost: last.rentCumulativeCost,
    totalTaxSavings,
    finalHomeValue: last.buyHomeValue,
    finalEquity: last.buyEquity,
    finalMortgageBalance: last.buyMortgageBalance,
    buyNetWorthFinal: last.buyNetWorth,
    rentInvestmentFinal: last.rentInvestmentValue,
    rentNetWorthFinal: last.rentNetWorth,
    schedule,
    downPaymentAmount: downPayment,
    financeAmount: loanAmount,
    monthlyMortgagePayment,
    standardDeduction: stdDeduction,
  };
}

export function formatUSD(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

export function formatShort(n: number, currency = "$"): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}${currency}${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}${currency}${Math.round(abs / 1_000)}k`;
  return `${sign}${currency}${Math.round(abs)}`;
}
