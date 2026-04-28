// lib/auAffordability.ts
//
// Australian House Affordability Calculator
//
// SOURCES:
//   • APRA lending guidelines: serviceability buffer 3% above rate (from Oct 2021)
//   • Stamp duty: each state/territory's Revenue Office (2024 rates)
//   • LMI: based on Genworth/QBE published LMI estimate tables
//   • FHBG (First Home Buyer Guarantee): 5% deposit, 15% govt guarantee
//   • FHOG: varies by state
//   • HEM: Household Expenditure Measure (ABA/RBA benchmark)
//
// STAMP DUTY (2024) — varies significantly by state.
// Each state has its own thresholds, rates, and FHB concessions.
//
// ─────────────────────────────────────────────────────────────────

export type AustralianState =
  | "NSW" | "VIC" | "QLD" | "WA" | "SA" | "TAS" | "ACT" | "NT";

export interface StateDefinition {
  code: AustralianState;
  name: string;
  // Stamp duty brackets for owner-occupier purchase
  stampDutyBrackets: StampDutyBracket[];
  // FHB stamp duty concession
  fhbStampDutyThreshold: number;   // property value — full exemption below
  fhbStampDutyConcessThreshold: number; // partial concession up to
  fhbStampDutyExemptionNote: string;
  // FHOG amount
  fhogAmount: number;
  fhogPropertyPriceCap: number;
  // Land tax (not modelled in detail — info only)
  landTaxNote: string;
  // Council rates estimate (annual %)
  councilRatesAnnualPct: number;
}

export interface StampDutyBracket {
  min: number;
  max: number | null;
  rate: number;       // marginal rate on excess over min
  baseDuty: number;   // fixed duty at bottom of bracket
}

// ── State stamp duty data (owner-occupier, 2024) ──────────────────

export const STATES: Record<AustralianState, StateDefinition> = {
  NSW: {
    code: "NSW", name: "New South Wales",
    stampDutyBrackets: [
      { min: 0,        max: 16000,    rate: 0.0125, baseDuty: 0       },
      { min: 16000,    max: 35000,    rate: 0.015,  baseDuty: 200     },
      { min: 35000,    max: 93000,    rate: 0.0175, baseDuty: 485     },
      { min: 93000,    max: 351000,   rate: 0.035,  baseDuty: 1500    },
      { min: 351000,   max: 1168000,  rate: 0.045,  baseDuty: 10530   },
      { min: 1168000,  max: 3505000,  rate: 0.055,  baseDuty: 47295   },
      { min: 3505000,  max: null,     rate: 0.07,   baseDuty: 175830  },
    ],
    fhbStampDutyThreshold: 800000,
    fhbStampDutyConcessThreshold: 1000000,
    fhbStampDutyExemptionNote: "Full exemption for new/existing homes ≤ $800k. Concession $800k–$1M.",
    fhogAmount: 10000,
    fhogPropertyPriceCap: 600000,
    landTaxNote: "Land tax applies to investment properties. Threshold ~$969k (2024).",
    councilRatesAnnualPct: 0.0025,
  },
  VIC: {
    code: "VIC", name: "Victoria",
    stampDutyBrackets: [
      { min: 0,        max: 25000,    rate: 0.014,  baseDuty: 0       },
      { min: 25000,    max: 130000,   rate: 0.024,  baseDuty: 350     },
      { min: 130000,   max: 960000,   rate: 0.06,   baseDuty: 2870    },
      { min: 960000,   max: null,     rate: 0.055,  baseDuty: 52670   },
    ],
    fhbStampDutyThreshold: 600000,
    fhbStampDutyConcessThreshold: 750000,
    fhbStampDutyExemptionNote: "Full exemption ≤ $600k. Concession $600k–$750k. Principal place of residence only.",
    fhogAmount: 10000,
    fhogPropertyPriceCap: 750000,
    landTaxNote: "Land tax from $300k threshold. Principal residence exempt.",
    councilRatesAnnualPct: 0.002,
  },
  QLD: {
    code: "QLD", name: "Queensland",
    stampDutyBrackets: [
      { min: 0,        max: 5000,     rate: 0,      baseDuty: 0       },
      { min: 5000,     max: 75000,    rate: 0.015,  baseDuty: 0       },
      { min: 75000,    max: 540000,   rate: 0.035,  baseDuty: 1050    },
      { min: 540000,   max: 1000000,  rate: 0.045,  baseDuty: 17325   },
      { min: 1000000,  max: null,     rate: 0.0575, baseDuty: 38025   },
    ],
    fhbStampDutyThreshold: 500000,
    fhbStampDutyConcessThreshold: 550000,
    fhbStampDutyExemptionNote: "Full concession for first home ≤ $500k (new homes). Partial $500k–$550k.",
    fhogAmount: 30000,
    fhogPropertyPriceCap: 750000,
    landTaxNote: "Land tax from $600k threshold. Home exempt.",
    councilRatesAnnualPct: 0.003,
  },
  WA: {
    code: "WA", name: "Western Australia",
    stampDutyBrackets: [
      { min: 0,        max: 120000,   rate: 0.019,  baseDuty: 0       },
      { min: 120000,   max: 150000,   rate: 0.0285, baseDuty: 2280    },
      { min: 150000,   max: 360000,   rate: 0.03,   baseDuty: 3135    },
      { min: 360000,   max: 725000,   rate: 0.05,   baseDuty: 9435    },
      { min: 725000,   max: null,     rate: 0.051,  baseDuty: 27685   },
    ],
    fhbStampDutyThreshold: 430000,
    fhbStampDutyConcessThreshold: 530000,
    fhbStampDutyExemptionNote: "Full exemption ≤ $430k (established) / $530k (new). Concession up to these caps.",
    fhogAmount: 10000,
    fhogPropertyPriceCap: 750000,
    landTaxNote: "Land tax from $300k threshold. Principal residence exempt.",
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
    fhbStampDutyThreshold: 650000,
    fhbStampDutyConcessThreshold: 700000,
    fhbStampDutyExemptionNote: "Full exemption for new homes ≤ $650k (off-the-plan) from 2024.",
    fhogAmount: 15000,
    fhogPropertyPriceCap: 650000,
    landTaxNote: "Land tax from $723k threshold.",
    councilRatesAnnualPct: 0.003,
  },
  TAS: {
    code: "TAS", name: "Tasmania",
    stampDutyBrackets: [
      { min: 0,        max: 3000,     rate: 0.01,   baseDuty: 0       },
      { min: 3000,     max: 25000,    rate: 0.015,  baseDuty: 30      },
      { min: 25000,    max: 75000,    rate: 0.0225, baseDuty: 360     },
      { min: 75000,    max: 200000,   rate: 0.035,  baseDuty: 1485    },
      { min: 200000,   max: 375000,   rate: 0.04,   baseDuty: 5860    },
      { min: 375000,   max: 725000,   rate: 0.0425, baseDuty: 12860   },
      { min: 725000,   max: null,     rate: 0.045,  baseDuty: 27735   },
    ],
    fhbStampDutyThreshold: 600000,
    fhbStampDutyConcessThreshold: 600000,
    fhbStampDutyExemptionNote: "50% duty concession for first homes up to $600k.",
    fhogAmount: 30000,
    fhogPropertyPriceCap: 600000,
    landTaxNote: "Land tax from $25k. Principal residence generally exempt.",
    councilRatesAnnualPct: 0.004,
  },
  ACT: {
    code: "ACT", name: "Australian Capital Territory",
    stampDutyBrackets: [
      { min: 0,        max: 260000,   rate: 0.0112, baseDuty: 0       },
      { min: 260000,   max: 300000,   rate: 0.024,  baseDuty: 2912    },
      { min: 300000,   max: 500000,   rate: 0.032,  baseDuty: 3872    },
      { min: 500000,   max: 750000,   rate: 0.0385, baseDuty: 10272   },
      { min: 750000,   max: 1000000,  rate: 0.0472, baseDuty: 19897   },
      { min: 1000000,  max: 1455000,  rate: 0.051,  baseDuty: 31697   },
      { min: 1455000,  max: null,     rate: 0.054,  baseDuty: 54892   },
    ],
    fhbStampDutyThreshold: 1000000,
    fhbStampDutyConcessThreshold: 1000000,
    fhbStampDutyExemptionNote: "Full stamp duty exemption for FHBs on properties ≤ $1M (subject to income test).",
    fhogAmount: 10000,
    fhogPropertyPriceCap: 750000,
    landTaxNote: "ACT has a land value tax (general rates). Principal residence not fully exempt.",
    councilRatesAnnualPct: 0.0035,
  },
  NT: {
    code: "NT", name: "Northern Territory",
    stampDutyBrackets: [
      { min: 0,        max: 525000,   rate: 0,      baseDuty: 0       }, // formula-based
      { min: 525000,   max: null,     rate: 0.0495, baseDuty: 0       },
    ],
    fhbStampDutyThreshold: 650000,
    fhbStampDutyConcessThreshold: 650000,
    fhbStampDutyExemptionNote: "FHB discount: $10,000 off duty if buying/building new home.",
    fhogAmount: 10000,
    fhogPropertyPriceCap: 650000,
    landTaxNote: "No land tax in the NT.",
    councilRatesAnnualPct: 0.003,
  },
};

// NT uses a unique formula-based approach
function calcNTStampDuty(value: number): number {
  if (value <= 525000) {
    // NT formula: (0.06571441 × V² + 15 × V) / 1000 (approx)
    return Math.max(0, (0.06571441 * value * value / 1000 + 15 * value) / 1000);
  }
  return value * 0.0495;
}

// ── Stamp duty calculation ────────────────────────────────────────

export function calcStampDuty(
  propertyValue: number,
  state: AustralianState,
  isFirstHomeBuyer: boolean,
): { duty: number; concessionApplied: boolean; concessionNote: string } {
  if (state === "NT") {
    let duty = calcNTStampDuty(propertyValue);
    const concession = isFirstHomeBuyer && propertyValue <= STATES.NT.fhbStampDutyConcessThreshold;
    if (concession) duty = Math.max(0, duty - 10000);
    return { duty, concessionApplied: concession, concessionNote: STATES.NT.fhbStampDutyExemptionNote };
  }

  const stateDef = STATES[state];
  let duty = 0;

  for (const b of stateDef.stampDutyBrackets) {
    if (propertyValue <= (b.min === 0 ? 0 : b.min - 1)) break;
    const top = b.max ?? propertyValue;
    const slice = Math.min(propertyValue, top) - b.min;
    if (slice <= 0) continue;
    duty = b.baseDuty + (propertyValue - b.min) * b.rate;
  }

  // FHB concessions
  let concessionApplied = false;
  if (isFirstHomeBuyer) {
    if (propertyValue <= stateDef.fhbStampDutyThreshold) {
      // Full exemption
      duty = 0;
      concessionApplied = true;
    } else if (propertyValue <= stateDef.fhbStampDutyConcessThreshold) {
      // Linear taper between threshold and concess threshold
      const range = stateDef.fhbStampDutyConcessThreshold - stateDef.fhbStampDutyThreshold;
      const over = propertyValue - stateDef.fhbStampDutyThreshold;
      const reduction = (1 - over / range) * duty;
      duty = duty - reduction;
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
// Based on published Genworth LMI rate cards (approximations).
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
// Banks assess serviceability at rate + 3% (APRA buffer, Oct 2021)

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
    isFirstHomeBuyer, isApartment,
    interestRate, loanTermYears,
    additionalUpfrontCosts,
  } = inputs;

  const stateDef = STATES[state];

  // Upfront costs
  const { duty: stampDuty, concessionApplied, concessionNote } = calcStampDuty(
    propertyValue, state, isFirstHomeBuyer
  );
  const lmi = calcLMI(propertyValue, Math.max(0, savings - stampDuty - additionalUpfrontCosts));
  const fhogGrant = (isFirstHomeBuyer && propertyValue <= stateDef.fhogPropertyPriceCap)
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
