// lib/saudiEos.ts
//
// Saudi Arabia End of Service Benefit (EOSB) Calculator
//
// LEGAL BASIS:
// ─────────────────────────────────────────────────────────────────
// Saudi Labor Law — Royal Decree No. M/51, Articles 84–88
// (as amended by Royal Decree No. M/46 dated 5/6/1436H)
//
// Article 84: Employee leaving voluntarily
// Article 85: Employee dismissed / contract ends by employer
//
// KEY RULES (2024):
// ─────────────────────────────────────────────────────────────────
//
// 1. CALCULATION BASE:
//    Last drawn basic salary only (NOT including housing, transport,
//    or other allowances — unless the employment contract stipulates
//    that allowances are included in the EOSB calculation base).
//
// 2. STANDARD ACCRUAL RATE:
//    • First 5 years:       ½ month salary per year of service
//    • After 5 years:       1 month salary per year of service
//    (The "after 5 years" rate applies to the entire duration,
//     not just the years after 5.)
//
// 3. RESIGNATION (Article 84) — VOLUNTARY DEPARTURE:
//    Years 1–2:      No entitlement
//    Years 2–5:      1/3 of calculated benefit
//    Years 5–10:     2/3 of calculated benefit
//    Years 10+:      Full calculated benefit
//
//    Special case: Woman resigning within 6 months of marriage
//    or 3 months of childbirth is entitled to FULL benefit.
//
// 4. TERMINATION BY EMPLOYER (Article 85):
//    Full calculated benefit regardless of years of service.
//    (Unless terminated for cause under Article 80 — serious
//    misconduct — in which case no benefit is payable.)
//
// 5. CONTRACT EXPIRY (fixed-term contract not renewed):
//    Full calculated benefit.
//
// 6. MUTUAL AGREEMENT / EARLY RETIREMENT:
//    Treated as resignation for calculation purposes unless
//    the contract specifies otherwise.
//
// 7. PARTIAL YEAR:
//    Prorated proportionally (days/365 × monthly salary × applicable rate)
//
// 8. GOSI (General Organisation for Social Insurance):
//    As of 2022+, GOSI covers Saudi nationals' EOSB through the
//    'Muʿāwadha' programme. Non-Saudi employees remain under
//    the direct employer obligation. This calculator covers the
//    statutory calculation for both — actual payment mechanism
//    differs for Saudis enrolled in the scheme.
//
// ─────────────────────────────────────────────────────────────────

export type DepartureReason =
  | "termination"       // Dismissed by employer (full benefit)
  | "resignation"       // Voluntary resignation (reduced per years)
  | "contract_expiry"   // Fixed-term contract ended (full benefit)
  | "mutual_agreement"  // Treated like resignation
  | "retirement"        // Full benefit
  | "death_disability"; // Full benefit payable to estate/employee

export type Nationality = "saudi" | "non_saudi";

export interface EosInputs {
  // Employment details
  startDate: string;      // ISO date e.g. "2015-03-15"
  endDate: string;        // ISO date e.g. "2024-11-01"
  basicSalary: number;    // Monthly basic salary in SAR
  departureReason: DepartureReason;
  nationality: Nationality;

  // Optional components
  includeHousingAllowance: boolean;  // if contract specifies inclusion
  housingAllowance: number;          // monthly SAR
  includeTransportAllowance: boolean;
  transportAllowance: number;        // monthly SAR

  // Special cases
  womanMarriageResignation: boolean; // woman resigning within 6 months of marriage
  womanChildbirthResignation: boolean; // woman resigning within 3 months of childbirth
}

export interface EosBreakdown {
  // Duration
  totalDays: number;
  totalYears: number;         // exact decimal
  fullYears: number;          // whole years completed
  remainingDays: number;      // days after last complete year

  // Salary base
  monthlySalaryBase: number;  // the base used for calculation
  dailySalaryBase: number;    // monthly / 30

  // Accrual calculation
  benefitForFirst5Years: number;    // up to 5 years at ½ month/year
  benefitForYearsAfter5: number;    // years 5+ at 1 month/year
  grossBenefit: number;             // full entitlement before reduction

  // Reduction for resignation
  reductionFactor: number;          // 0, 1/3, 2/3, or 1
  reductionLabel: string;
  netBenefit: number;               // after reduction

  // Pro-rata for partial year
  partialYearBenefit: number;

  // Final
  totalBenefit: number;             // SAR

  // Informational
  isFullEntitlement: boolean;
  gosiNote: string;
}

export interface EosResult {
  inputs: EosInputs;
  breakdown: EosBreakdown;
  yearlySummary: YearlyRow[];
}

export interface YearlyRow {
  year: number;             // year of employment (1, 2, 3 ...)
  salaryBase: number;
  accrualRate: number;      // 0.5 or 1.0
  grossForYear: number;
  reductionFactor: number;
  netForYear: number;
}

// ─── Core calculation ──────────────────────────────────────────────

export function calculateEos(inputs: EosInputs): EosResult {
  const start = new Date(inputs.startDate);
  const end   = new Date(inputs.endDate);

  // Total days of service
  const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const totalYears = totalDays / 365.25;
  const fullYears  = Math.floor(totalYears);
  const remainingDays = totalDays - fullYears * 365; // approximate

  // Salary base
  let monthlySalaryBase = inputs.basicSalary;
  if (inputs.includeHousingAllowance)  monthlySalaryBase += inputs.housingAllowance;
  if (inputs.includeTransportAllowance) monthlySalaryBase += inputs.transportAllowance;
  const dailySalaryBase = monthlySalaryBase / 30;

  // Determine if full entitlement applies
  const isSpecialWomanCase =
    inputs.womanMarriageResignation || inputs.womanChildbirthResignation;

  const isFullEntitlement =
    inputs.departureReason === "termination" ||
    inputs.departureReason === "contract_expiry" ||
    inputs.departureReason === "retirement" ||
    inputs.departureReason === "death_disability" ||
    (inputs.departureReason === "resignation" && totalYears >= 10) ||
    (inputs.departureReason === "mutual_agreement" && totalYears >= 10) ||
    isSpecialWomanCase;

  // Gross benefit calculation
  // First 5 years: ½ month per year
  // After 5 years: 1 month per year (entire duration recalculated)

  let benefitForFirst5Years  = 0;
  let benefitForYearsAfter5  = 0;

  if (fullYears <= 5) {
    benefitForFirst5Years = fullYears * (monthlySalaryBase / 2);
    benefitForYearsAfter5 = 0;
  } else {
    // After 5 years, the ENTIRE period gets 1 month/year
    // (Saudi law: once you exceed 5 years, the rate is 1 month for ALL years)
    // First 5 years portion at ½ month
    benefitForFirst5Years = 5 * (monthlySalaryBase / 2);
    // Remaining years at 1 month
    benefitForYearsAfter5 = (fullYears - 5) * monthlySalaryBase;
  }

  const grossBenefit = benefitForFirst5Years + benefitForYearsAfter5;

  // Partial year (remaining days after last complete year)
  const partialYearRate = fullYears >= 5 ? 1.0 : 0.5;
  const partialYearBenefit = remainingDays > 0
    ? (remainingDays / 365) * monthlySalaryBase * partialYearRate
    : 0;

  const totalGross = grossBenefit + partialYearBenefit;

  // Reduction factor for resignation / mutual agreement
  let reductionFactor = 1;
  let reductionLabel  = "Full entitlement (100%)";

  if (
    (inputs.departureReason === "resignation" || inputs.departureReason === "mutual_agreement")
    && !isSpecialWomanCase
  ) {
    if (totalYears < 2) {
      reductionFactor = 0;
      reductionLabel  = "No entitlement (less than 2 years)";
    } else if (totalYears < 5) {
      reductionFactor = 1 / 3;
      reductionLabel  = "1/3 of benefit (2–5 years of service)";
    } else if (totalYears < 10) {
      reductionFactor = 2 / 3;
      reductionLabel  = "2/3 of benefit (5–10 years of service)";
    } else {
      reductionFactor = 1;
      reductionLabel  = "Full entitlement (10+ years of service)";
    }
  }

  const netBenefit  = totalGross * reductionFactor;

  // GOSI note
  const gosiNote = inputs.nationality === "saudi"
    ? "Saudi nationals enrolled in GOSI's Muʿāwadha programme receive their EOSB through GOSI upon leaving employment, rather than directly from the employer. The calculated amount represents the statutory entitlement — actual disbursement is through GOSI."
    : "As a non-Saudi employee, your EOSB is paid directly by your employer. Your employer is required to maintain a reserve fund or equivalent provision for your EOSB entitlement.";

  // Yearly summary (for the table)
  const yearlySummary: YearlyRow[] = [];
  for (let y = 1; y <= fullYears; y++) {
    const rate = y <= 5 ? 0.5 : 1.0;
    const gross = monthlySalaryBase * rate;
    const net   = gross * reductionFactor;
    yearlySummary.push({
      year: y,
      salaryBase: monthlySalaryBase,
      accrualRate: rate,
      grossForYear: gross,
      reductionFactor,
      netForYear: net,
    });
  }
  // Add partial year row
  if (remainingDays > 0) {
    yearlySummary.push({
      year: fullYears + 1,
      salaryBase: monthlySalaryBase,
      accrualRate: partialYearRate,
      grossForYear: partialYearBenefit,
      reductionFactor,
      netForYear: partialYearBenefit * reductionFactor,
    });
  }

  return {
    inputs,
    breakdown: {
      totalDays,
      totalYears,
      fullYears,
      remainingDays,
      monthlySalaryBase,
      dailySalaryBase,
      benefitForFirst5Years,
      benefitForYearsAfter5,
      grossBenefit: totalGross,
      reductionFactor,
      reductionLabel,
      netBenefit,
      partialYearBenefit,
      totalBenefit: netBenefit,
      isFullEntitlement,
      gosiNote,
    },
    yearlySummary,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────

export function fmtSAR(n: number): string {
  return new Intl.NumberFormat("en-SA", {
    style: "currency",
    currency: "SAR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function fmtYears(totalDays: number): string {
  const years  = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);
  const days   = totalDays % 30;
  const parts  = [];
  if (years)  parts.push(`${years} yr${years !== 1 ? "s" : ""}`);
  if (months) parts.push(`${months} mo`);
  if (days)   parts.push(`${days} day${days !== 1 ? "s" : ""}`);
  return parts.join(", ") || "0 days";
}

export const DEPARTURE_LABELS: Record<DepartureReason, string> = {
  termination:      "Terminated by employer",
  resignation:      "Voluntary resignation",
  contract_expiry:  "Contract expiry (not renewed)",
  mutual_agreement: "Mutual agreement",
  retirement:       "Retirement",
  death_disability: "Death or permanent disability",
};
