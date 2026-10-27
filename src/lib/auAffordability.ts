// lib/auAffordability.ts
//
// Australian House Affordability Calculator
//
// SOURCES (last checked October 2026):
//   • APRA serviceability buffer: 3 percentage points, held in APRA's 28 May 2026 review
//   • Stamp duty: each state/territory revenue office, owner-occupier rates in force Oct 2026
//   • LMI: approximate rates by LVR band (actual premiums vary by lender and insurer)
//   • FHOG / first home grants: state revenue offices — new homes only
//   • 5% Deposit Scheme (from 1 Oct 2025): firsthomebuyers.gov.au
//
// ─────────────────────────────────────────────────────────────────

export type AustralianState =
  | "NSW" | "VIC" | "QLD" | "WA" | "SA" | "TAS" | "ACT" | "NT";

export interface StateDefinition {
  code: AustralianState;
  name: string;
  // Owner-occupier duty brackets (principal place of residence where the state has a separate scale)
  stampDutyBrackets: StampDutyBracket[];
  // Returns concessional duty for an eligible first home buyer, or null if no concession applies
  fhbDuty: (value: number, fullDuty: number, isNewHome: boolean) => number | null;
  fhbStampDutyExemptionNote: string;
  // First home grant — every state limits it to new homes
  fhogAmount: number;
  fhogPropertyPriceCap: number | null; // null = no price cap
  // Council rates estimate (annual %)
  councilRatesAnnualPct: number;
}

export interface StampDutyBracket {
  min: number;
  max: number | null;
  rate: number;       // marginal rate on excess over min, or rate on whole value if flat
  baseDuty: number;   // fixed duty at bottom of bracket
  flat?: boolean;     // rate applies to the entire dutiable value (VIC, ACT, NT top bands)
}

// Linear taper of full duty between the exemption cap and the concession cap
function taper(value: number, duty: number, exemptUpTo: number, concessionUpTo: number): number | null {
  if (value <= exemptUpTo) return 0;
  if (value < concessionUpTo) return duty * (value - exemptUpTo) / (concessionUpTo - exemptUpTo);
  return null;
}

// ── State duty data (owner-occupier, rates in force October 2026) ──

export const STATES: Record<AustralianState, StateDefinition> = {
  NSW: {
    code: "NSW", name: "New South Wales",
    // Revenue NSW 2026/27 thresholds (CPI-indexed each financial year)
    stampDutyBrackets: [
      { min: 0,        max: 18000,    rate: 0.0125, baseDuty: 0       },
      { min: 18000,    max: 38000,    rate: 0.015,  baseDuty: 225     },
      { min: 38000,    max: 103000,   rate: 0.0175, baseDuty: 525     },
      { min: 103000,   max: 387000,   rate: 0.035,  baseDuty: 1662    },
      { min: 387000,   max: 1290000,  rate: 0.045,  baseDuty: 11602   },
      { min: 1290000,  max: 3870000,  rate: 0.055,  baseDuty: 52237   },
      { min: 3870000,  max: null,     rate: 0.07,   baseDuty: 194137  },
    ],
    fhbDuty: (v, duty) => taper(v, duty, 800000, 1000000),
    fhbStampDutyExemptionNote: "No duty on homes ≤ $800k; concessional duty $800k–$1M (estimated here as a linear taper). FHOG $10,000 for new homes ≤ $600k.",
    fhogAmount: 10000,
    fhogPropertyPriceCap: 600000,
    councilRatesAnnualPct: 0.0025,
  },
  VIC: {
    code: "VIC", name: "Victoria",
    // SRO principal place of residence rates to $550k, general rates above
    stampDutyBrackets: [
      { min: 0,        max: 25000,    rate: 0.014,  baseDuty: 0       },
      { min: 25000,    max: 130000,   rate: 0.024,  baseDuty: 350     },
      { min: 130000,   max: 440000,   rate: 0.05,   baseDuty: 2870    },
      { min: 440000,   max: 550000,   rate: 0.06,   baseDuty: 18370   },
      { min: 550000,   max: 960000,   rate: 0.06,   baseDuty: 28070   },
      { min: 960000,   max: 2000000,  rate: 0.055,  baseDuty: 0, flat: true },
      { min: 2000000,  max: null,     rate: 0.065,  baseDuty: 110000  },
    ],
    fhbDuty: (v, duty) => taper(v, duty, 600000, 750000),
    fhbStampDutyExemptionNote: "No duty on homes ≤ $600k; sliding concession $600k–$750k. Principal place of residence only. FHOG $10,000 for new homes ≤ $750k.",
    fhogAmount: 10000,
    fhogPropertyPriceCap: 750000,
    councilRatesAnnualPct: 0.002,
  },
  QLD: {
    code: "QLD", name: "Queensland",
    // QRO home concession rates (buying a home to live in)
    stampDutyBrackets: [
      { min: 0,        max: 350000,   rate: 0.01,   baseDuty: 0       },
      { min: 350000,   max: 540000,   rate: 0.035,  baseDuty: 3500    },
      { min: 540000,   max: 1000000,  rate: 0.045,  baseDuty: 10150   },
      { min: 1000000,  max: null,     rate: 0.0575, baseDuty: 30850   },
    ],
    fhbDuty: (v, duty, isNewHome) => {
      if (isNewHome) return 0;
      if (v >= 800000) return null;
      // QRO first home concession: $17,350 max, reducing $1,735 per $10k band from $710k
      const steps = v < 710000 ? 0 : Math.floor((v - 700000) / 10000);
      return Math.max(0, duty - (17350 - 1735 * steps));
    },
    fhbStampDutyExemptionNote: "New homes: no duty, no price cap (from 1 May 2025). Established homes: no duty ≤ $700k, phasing out by $800k. FHOG $30,000 for new homes under $750k.",
    fhogAmount: 30000,
    fhogPropertyPriceCap: 749999,
    councilRatesAnnualPct: 0.003,
  },
  WA: {
    code: "WA", name: "Western Australia",
    stampDutyBrackets: [
      { min: 0,        max: 120000,   rate: 0.019,  baseDuty: 0       },
      { min: 120000,   max: 150000,   rate: 0.0285, baseDuty: 2280    },
      { min: 150000,   max: 360000,   rate: 0.038,  baseDuty: 3135    },
      { min: 360000,   max: 725000,   rate: 0.0475, baseDuty: 11115   },
      { min: 725000,   max: null,     rate: 0.0515, baseDuty: 28453   },
    ],
    // First home owner rate for agreements from 7 May 2026: $16.15 per $100 over $600k
    fhbDuty: (v) => (v <= 600000 ? 0 : v <= 800000 ? (v - 600000) * 0.1615 : null),
    fhbStampDutyExemptionNote: "No duty on homes ≤ $600k; first home owner rate $600k–$800k (agreements from 7 May 2026). FHOG $10,000 for new homes ≤ $800k ($1M north of the 26th parallel).",
    fhogAmount: 10000,
    fhogPropertyPriceCap: 800000,
    councilRatesAnnualPct: 0.003,
  },
  SA: {
    code: "SA", name: "South Australia",
    stampDutyBrackets: [
      { min: 0,        max: 12000,    rate: 0.01,   baseDuty: 0       },
      { min: 12000,    max: 30000,    rate: 0.02,   baseDuty: 120     },
      { min: 30000,    max: 50000,    rate: 0.03,   baseDuty: 480     },
      { min: 50000,    max: 100000,   rate: 0.035,  baseDuty: 1080    },
      { min: 100000,   max: 200000,   rate: 0.04,   baseDuty: 2830    },
      { min: 200000,   max: 250000,   rate: 0.0425, baseDuty: 6830    },
      { min: 250000,   max: 300000,   rate: 0.0475, baseDuty: 8955    },
      { min: 300000,   max: 500000,   rate: 0.05,   baseDuty: 11330   },
      { min: 500000,   max: null,     rate: 0.055,  baseDuty: 21330   },
    ],
    fhbDuty: (_v, _duty, isNewHome) => (isNewHome ? 0 : null),
    fhbStampDutyExemptionNote: "New homes: no duty and no price cap (contracts from 6 June 2024). No first home concession on established homes. FHOG $15,000 for new homes, no price cap.",
    fhogAmount: 15000,
    fhogPropertyPriceCap: null,
    councilRatesAnnualPct: 0.003,
  },
  TAS: {
    code: "TAS", name: "Tasmania",
    stampDutyBrackets: [
      { min: 0,        max: 3000,     rate: 0,      baseDuty: 50      },
      { min: 3000,     max: 25000,    rate: 0.0175, baseDuty: 50      },
      { min: 25000,    max: 75000,    rate: 0.0225, baseDuty: 435     },
      { min: 75000,    max: 200000,   rate: 0.035,  baseDuty: 1560    },
      { min: 200000,   max: 375000,   rate: 0.04,   baseDuty: 5935    },
      { min: 375000,   max: 725000,   rate: 0.0425, baseDuty: 12935   },
      { min: 725000,   max: null,     rate: 0.045,  baseDuty: 27810   },
    ],
    fhbDuty: () => null,
    fhbStampDutyExemptionNote: "The established-home duty exemption ended for settlements after 30 June 2026. FHOG $20,000 for new homes (transactions 1 July 2026 – 30 June 2027).",
    fhogAmount: 20000,
    fhogPropertyPriceCap: null,
    councilRatesAnnualPct: 0.004,
  },
  ACT: {
    code: "ACT", name: "Australian Capital Territory",
    // Eligible owner-occupier rates, DI2026-155 (from 1 July 2026)
    stampDutyBrackets: [
      { min: 0,        max: 260000,   rate: 0.0028, baseDuty: 0       },
      { min: 260000,   max: 300000,   rate: 0.022,  baseDuty: 728     },
      { min: 300000,   max: 500000,   rate: 0.034,  baseDuty: 1608    },
      { min: 500000,   max: 750000,   rate: 0.0432, baseDuty: 8408    },
      { min: 750000,   max: 1000000,  rate: 0.059,  baseDuty: 19208   },
      { min: 1000000,  max: 1455000,  rate: 0.064,  baseDuty: 33958   },
      { min: 1455000,  max: null,     rate: 0.0454, baseDuty: 0, flat: true },
    ],
    // Home Buyer Concession Scheme, DI2026-157: nil duty, no price cap or income test from 1 July 2026
    fhbDuty: () => 0,
    fhbStampDutyExemptionNote: "Home Buyer Concession Scheme: nil duty from 1 July 2026 with no price cap or income test, if you haven't owned property in the last 5 years. The ACT has no FHOG.",
    fhogAmount: 0,
    fhogPropertyPriceCap: null,
    councilRatesAnnualPct: 0.0035,
  },
  NT: {
    code: "NT", name: "Northern Territory",
    // Formula up to $525k, then flat rates — see calcNTStampDuty
    stampDutyBrackets: [],
    fhbDuty: () => null,
    fhbStampDutyExemptionNote: "No general first home duty concession. HomeGrown Territory Grant of $50,000 for first home buyers of new homes, no price cap.",
    fhogAmount: 50000,
    fhogPropertyPriceCap: null,
    councilRatesAnnualPct: 0.003,
  },
};

// NT: D = 0.06571441·V² + 15·V (V = value / 1000) up to $525k, then a flat rate on the whole value
function calcNTStampDuty(value: number): number {
  if (value <= 525000) {
    const v = value / 1000;
    return 0.06571441 * v * v + 15 * v;
  }
  if (value < 3000000) return value * 0.0495;
  if (value < 5000000) return value * 0.0575;
  return value * 0.0595;
}

// ── Stamp duty calculation ────────────────────────────────────────

export function calcStampDuty(
  propertyValue: number,
  state: AustralianState,
  isFirstHomeBuyer: boolean,
  isNewHome: boolean,
): { duty: number; concessionApplied: boolean; concessionNote: string } {
  const stateDef = STATES[state];
  let duty = 0;

  if (state === "NT") {
    duty = calcNTStampDuty(propertyValue);
  } else {
    const b = stateDef.stampDutyBrackets.find(br => br.max === null || propertyValue <= br.max)!;
    duty = b.flat ? propertyValue * b.rate : b.baseDuty + (propertyValue - b.min) * b.rate;
  }

  let concessionApplied = false;
  if (isFirstHomeBuyer) {
    const concessional = stateDef.fhbDuty(propertyValue, duty, isNewHome);
    if (concessional !== null && concessional < duty) {
      duty = concessional;
      concessionApplied = true;
    }
  }

  return {
    duty: Math.max(0, Math.round(duty)),
    concessionApplied,
    concessionNote: stateDef.fhbStampDutyExemptionNote,
  };
}

// ── LMI estimate ──────────────────────────────────────────────────
// Approximate rates by LVR band; actual premiums vary by lender and insurer.
// LMI is payable when LVR > 80%.

export function calcLMI(propertyValue: number, depositAmount: number): number {
  const lvr = (1 - depositAmount / propertyValue);
  if (lvr <= 0.80) return 0;

  const loanAmount = propertyValue - depositAmount;
  // Approximate LMI rates by LVR band
  let rate = 0;
  if (lvr <= 0.85)      rate = 0.0058;
  else if (lvr <= 0.90) rate = 0.0124;
  else if (lvr <= 0.95) rate = 0.0280;
  else                  rate = 0.0390;

  return Math.round(loanAmount * rate);
}

// ── Mortgage repayment ────────────────────────────────────────────

export function calcMonthlyRepayment(
  principal: number,
  annualRatePct: number,
  termYears: number,
): number {
  const r = annualRatePct / 100 / 12;
  const n = termYears * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

// ── APRA serviceability ───────────────────────────────────────────
// Banks assess serviceability at rate + 3 percentage points (APRA buffer since Oct 2021, held May 2026)

export const APRA_BUFFER = 3.0;

export function calcMaxBorrowingCapacity(
  netMonthlyIncome: number,
  monthlyExpenses: number,
  existingDebts: number, // monthly payments on other debts
  assessmentRate: number, // actual rate + 3%
  termYears: number,
): number {
  // Max monthly mortgage = net income - expenses - other debts
  // Use 30% of gross as a stress test (some lenders use up to 35%)
  const availableForMortgage = netMonthlyIncome - monthlyExpenses - existingDebts;
  if (availableForMortgage <= 0) return 0;

  const r = assessmentRate / 100 / 12;
  const n = termYears * 12;
  if (r === 0) return availableForMortgage * n;
  // Reverse the repayment formula to find principal
  return availableForMortgage * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
}

// ── Ongoing costs ─────────────────────────────────────────────────

export interface OngoingCosts {
  councilRates: number;       // annual
  bodyCorpFees: number;       // annual (0 for houses)
  homeInsurance: number;      // annual estimate
  maintenancePct: number;     // % of property value annually
  waterRates: number;         // annual estimate
}

export function estimateOngoingCosts(
  propertyValue: number,
  state: AustralianState,
  isApartment: boolean,
): OngoingCosts {
  const stateDef = STATES[state];
  return {
    councilRates: Math.round(propertyValue * stateDef.councilRatesAnnualPct),
    bodyCorpFees: isApartment ? 4800 : 0,   // typical apartment body corp
    homeInsurance: isApartment ? 600 : 1800,
    maintenancePct: isApartment ? 0.005 : 0.01,
    waterRates: 1200,
  };
}

// ── Main inputs & result ──────────────────────────────────────────

export interface AffordabilityInputs {
  // Income
  grossAnnualIncome: number;         // combined household
  partnerIncome: number;             // partner/spouse gross annual
  otherIncome: number;               // rental, dividends etc.

  // Expenses & debts
  monthlyLivingExpenses: number;
  existingDebtMonthly: number;       // car loans, HECS, credit cards

  // Purchase
  savings: number;                   // total available savings
  propertyValue: number;             // target property price
  state: AustralianState;
  isFirstHomeBuyer: boolean;
  isNewHome: boolean;                // never lived in — first home grants only apply to new homes
  isApartment: boolean;

  // Mortgage
  interestRate: number;              // % p.a.
  loanTermYears: number;

  // Costs included in savings
  additionalUpfrontCosts: number;    // legal fees, inspections, moving
}

export interface AffordabilityResult {
  // Upfront costs
  stampDuty: number;
  stampDutyConcessionApplied: boolean;
  stampDutyConcessionNote: string;
  lmi: number;
  fhogGrant: number;
  additionalCosts: number;
  totalUpfrontCosts: number;

  // Deposit
  depositAmount: number;             // savings minus upfront costs (minus LMI if capitalised)
  depositPct: number;                // % of property value
  loanAmount: number;
  lvr: number;                       // loan-to-value ratio

  // Repayments
  monthlyRepayment: number;
  annualRepayment: number;
  assessmentRate: number;            // rate + APRA buffer
  monthlyRepaymentAtAssessment: number;

  // Affordability metrics
  combinedGrossMonthly: number;
  netMonthlyIncome: number;          // approximate
  repaymentToIncomeRatio: number;    // monthly repay / gross monthly
  maxBorrowingCapacity: number;      // APRA-based estimate
  canAfford: boolean;
  affordabilityGap: number;          // positive = surplus, negative = shortfall

  // Ongoing costs (annual)
  ongoingCosts: OngoingCosts;
  totalAnnualOngoing: number;
  totalMonthlyOngoing: number;

  // Summary
  savingsShortfall: number;          // 0 if savings enough for upfront
  yearsToSaveForDeposit: number;     // if savings insufficient (at current savings rate)

  // Schedules
  yearlySchedule: YearlyMortgageRow[];
}

export interface YearlyMortgageRow {
  year: number;
  openingBalance: number;
  principalPaid: number;
  interestPaid: number;
  closingBalance: number;
  equity: number;
  propertyValue: number; // if appreciating
}

export function calculateAffordability(inputs: AffordabilityInputs): AffordabilityResult {
  const {
    grossAnnualIncome, partnerIncome, otherIncome,
    monthlyLivingExpenses, existingDebtMonthly,
    savings, propertyValue, state,
    isFirstHomeBuyer, isNewHome, isApartment,
    interestRate, loanTermYears,
    additionalUpfrontCosts,
  } = inputs;

  const stateDef = STATES[state];

  // Upfront costs
  const { duty: stampDuty, concessionApplied, concessionNote } = calcStampDuty(
    propertyValue, state, isFirstHomeBuyer, isNewHome
  );
  const lmi = calcLMI(propertyValue, Math.max(0, savings - stampDuty - additionalUpfrontCosts));
  const withinGrantCap = stateDef.fhogPropertyPriceCap === null || propertyValue <= stateDef.fhogPropertyPriceCap;
  const fhogGrant = (isFirstHomeBuyer && isNewHome && withinGrantCap)
    ? stateDef.fhogAmount : 0;
  const totalUpfrontCosts = stampDuty + additionalUpfrontCosts + lmi;

  const effectiveSavings = savings + fhogGrant;
  const depositAmount = Math.max(0, effectiveSavings - stampDuty - additionalUpfrontCosts);
  const depositPct = propertyValue > 0 ? (depositAmount / propertyValue) * 100 : 0;
  const loanAmount = Math.max(0, propertyValue - depositAmount);
  const lvr = propertyValue > 0 ? (loanAmount / propertyValue) * 100 : 0;

  // Repayments
  const monthlyRepayment = calcMonthlyRepayment(loanAmount, interestRate, loanTermYears);
  const assessmentRate = interestRate + APRA_BUFFER;
  const monthlyRepaymentAtAssessment = calcMonthlyRepayment(loanAmount, assessmentRate, loanTermYears);

  // Income
  const combinedGrossAnnual = grossAnnualIncome + partnerIncome + otherIncome;
  const combinedGrossMonthly = combinedGrossAnnual / 12;
  // Approximate net (rough: 70% of gross after tax — varies by income)
  const netMonthlyIncome = combinedGrossMonthly * 0.72;

  // Max borrowing capacity (APRA-based)
  const maxBorrowingCapacity = calcMaxBorrowingCapacity(
    netMonthlyIncome,
    monthlyLivingExpenses,
    existingDebtMonthly,
    assessmentRate,
    loanTermYears,
  );

  const repaymentToIncomeRatio = combinedGrossMonthly > 0
    ? (monthlyRepayment / combinedGrossMonthly) * 100 : 0;

  // Affordability: can they borrow enough at APRA rates?
  const canAfford = loanAmount <= maxBorrowingCapacity;
  const affordabilityGap = maxBorrowingCapacity - loanAmount;

  // Savings shortfall
  const savingsShortfall = Math.max(0, totalUpfrontCosts - effectiveSavings);
  const annualSavingsCapacity = (netMonthlyIncome - monthlyLivingExpenses - existingDebtMonthly) * 12 * 0.3;
  const yearsToSaveForDeposit = savingsShortfall > 0 && annualSavingsCapacity > 0
    ? savingsShortfall / annualSavingsCapacity : 0;

  // Ongoing costs
  const ongoingCosts = estimateOngoingCosts(propertyValue, state, isApartment);
  const maintenance = propertyValue * ongoingCosts.maintenancePct;
  const totalAnnualOngoing = ongoingCosts.councilRates + ongoingCosts.bodyCorpFees
    + ongoingCosts.homeInsurance + maintenance + ongoingCosts.waterRates;
  const totalMonthlyOngoing = totalAnnualOngoing / 12;

  // Yearly amortisation schedule
  const yearlySchedule: YearlyMortgageRow[] = [];
  let balance = loanAmount;
  const monthlyRate = interestRate / 100 / 12;
  for (let y = 1; y <= loanTermYears; y++) {
    const opening = balance;
    let yearInterest = 0, yearPrincipal = 0;
    for (let m = 0; m < 12; m++) {
      const interest = balance * monthlyRate;
      const principal = monthlyRepayment - interest;
      yearInterest += interest;
      yearPrincipal += Math.min(principal, balance);
      balance = Math.max(0, balance - principal);
    }
    const propValue = propertyValue * Math.pow(1.04, y); // assume 4% p.a. growth
    yearlySchedule.push({
      year: y,
      openingBalance: opening,
      principalPaid: yearPrincipal,
      interestPaid: yearInterest,
      closingBalance: balance,
      equity: propValue - balance,
      propertyValue: propValue,
    });
    if (balance <= 0) break;
  }

  return {
    stampDuty,
    stampDutyConcessionApplied: concessionApplied,
    stampDutyConcessionNote: concessionNote,
    lmi,
    fhogGrant,
    additionalCosts: additionalUpfrontCosts,
    totalUpfrontCosts,
    depositAmount,
    depositPct,
    loanAmount,
    lvr,
    monthlyRepayment,
    annualRepayment: monthlyRepayment * 12,
    assessmentRate,
    monthlyRepaymentAtAssessment,
    combinedGrossMonthly,
    netMonthlyIncome,
    repaymentToIncomeRatio,
    maxBorrowingCapacity,
    canAfford,
    affordabilityGap,
    ongoingCosts,
    totalAnnualOngoing,
    totalMonthlyOngoing,
    savingsShortfall,
    yearsToSaveForDeposit,
    yearlySchedule,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────

export function fmtAUD(n: number, dp = 0): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  }).format(Math.max(0, n));
}

export function fmtAUDShort(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `$${Math.round(n / 1_000)}k`;
  return `$${Math.round(n)}`;
}

export function fmtPct(n: number, dp = 1): string {
  return `${n.toFixed(dp)}%`;
}
