// Saudi end of service award (EOSB) calculation.
//
// Legal basis (Saudi Labor Law, Royal Decree M/51, as amended incl. Royal
// Decree M/44 in force from 19 February 2025), checked against HRSD sources
// in October 2026:
//   Art. 2   "Wage" means the actual wage (basic wage plus allowances).
//   Art. 54  No award if the contract ends during probation.
//   Art. 80  No award on dismissal for the listed misconduct grounds.
//   Art. 81  Worker may leave without notice and keep all statutory rights.
//   Art. 84  ½ month's wage per year for the first 5 years, 1 month per year
//            after that, on the last wage, fractions of a year pro rata.
//   Art. 85  Resignation: <2 yrs none; 2–5 yrs 1/3; >5 and <10 yrs 2/3;
//            10+ yrs full.
//   Art. 86  Commissions and similar variable pay may be excluded by agreement.
//   Art. 87  Full award despite Art. 85 for force majeure, or a woman ending
//            the contract within 6 months of marriage / 3 months of delivery.
//   Art. 88  Settlement within 1 week, or 2 weeks if the worker resigned.

export type DepartureReason =
  | "termination"
  | "resignation"
  | "contract_expiry"
  | "mutual_agreement"
  | "retirement"
  | "death_disability"
  | "left_art81"
  | "dismissed_art80"
  | "probation";

export interface EosInputs {
  startDate: string;
  endDate: string;
  basicSalary: number;
  departureReason: DepartureReason;
  includeHousingAllowance: boolean;
  housingAllowance: number;
  includeTransportAllowance: boolean;
  transportAllowance: number;
  womanMarriageResignation: boolean;
  womanChildbirthResignation: boolean;
  forceMajeure: boolean;
}

export interface EosBreakdown {
  totalDays: number;
  totalYears: number;
  fullYears: number;
  remainingDays: number;
  monthlySalaryBase: number;
  dailySalaryBase: number;
  benefitForFirst5Years: number;
  benefitForYearsAfter5: number;
  partialYearBenefit: number;
  grossBenefit: number;
  reductionFactor: number;
  reductionLabel: string;
  netBenefit: number;
  totalBenefit: number;
  isFullEntitlement: boolean;
  paymentNote: string;
}

export interface YearlyRow {
  year: number;
  accrualRate: number;
  grossForYear: number;
  reductionFactor: number;
  netForYear: number;
}

export interface EosResult {
  breakdown: EosBreakdown;
  yearlySummary: YearlyRow[];
}

export const DEPARTURE_LABELS: Record<DepartureReason, string> = {
  termination:      "Terminated by employer (not Art. 80)",
  resignation:      "Resignation by employee",
  contract_expiry:  "Fixed-term contract expired (not renewed)",
  mutual_agreement: "Mutual agreement (employee-initiated)",
  retirement:       "Retirement age reached",
  death_disability: "Death or inability to work",
  left_art81:       "Left without notice due to employer breach (Art. 81)",
  dismissed_art80:  "Dismissed for misconduct (Art. 80)",
  probation:        "Contract ended during probation (Art. 54)",
};

const DAY_MS = 24 * 60 * 60 * 1000;

function parseUtc(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function addYears(date: Date, years: number): Date {
  return new Date(Date.UTC(date.getUTCFullYear() + years, date.getUTCMonth(), date.getUTCDate()));
}

// Counts whole service years by calendar anniversary so that, e.g., exactly
// 10 years of service is never treated as 9 years and 365+ days.
function serviceLength(startIso: string, endIso: string) {
  const start = parseUtc(startIso);
  const end = parseUtc(endIso);
  const totalDays = Math.round((end.getTime() - start.getTime()) / DAY_MS);
  let fullYears = end.getUTCFullYear() - start.getUTCFullYear();
  if (addYears(start, fullYears) > end) fullYears--;
  fullYears = Math.max(0, fullYears);
  const remainingDays = Math.round((end.getTime() - addYears(start, fullYears).getTime()) / DAY_MS);
  return { totalDays, fullYears, remainingDays, totalYears: fullYears + remainingDays / 365 };
}

function entitlement(inputs: EosInputs, totalYears: number): { factor: number; label: string } {
  switch (inputs.departureReason) {
    case "dismissed_art80":
      return { factor: 0, label: "No award (dismissal under Art. 80)" };
    case "probation":
      return { factor: 0, label: "No award (ended during probation, Art. 54)" };
    case "resignation":
    case "mutual_agreement":
      break;
    default:
      return { factor: 1, label: "Full award (100%, Art. 84)" };
  }
  if (inputs.forceMajeure) return { factor: 1, label: "Full award (force majeure, Art. 87)" };
  if (inputs.womanMarriageResignation || inputs.womanChildbirthResignation) {
    return { factor: 1, label: "Full award (Art. 87 exception)" };
  }
  if (totalYears < 2) return { factor: 0, label: "No award (resigned with under 2 years)" };
  if (totalYears <= 5) return { factor: 1 / 3, label: "1/3 of award (2–5 years, Art. 85)" };
  if (totalYears < 10) return { factor: 2 / 3, label: "2/3 of award (over 5, under 10 years, Art. 85)" };
  return { factor: 1, label: "Full award (10+ years, Art. 85)" };
}

export function calculateEos(inputs: EosInputs): EosResult {
  const { totalDays, fullYears, remainingDays, totalYears } = serviceLength(inputs.startDate, inputs.endDate);

  let monthlySalaryBase = inputs.basicSalary;
  if (inputs.includeHousingAllowance) monthlySalaryBase += inputs.housingAllowance;
  if (inputs.includeTransportAllowance) monthlySalaryBase += inputs.transportAllowance;
  const dailySalaryBase = monthlySalaryBase / 30;

  const benefitForFirst5Years = Math.min(fullYears, 5) * monthlySalaryBase * 0.5;
  const benefitForYearsAfter5 = Math.max(0, fullYears - 5) * monthlySalaryBase;
  const partialYearRate = fullYears >= 5 ? 1 : 0.5;
  const partialYearBenefit = (remainingDays / 365) * monthlySalaryBase * partialYearRate;
  const grossBenefit = benefitForFirst5Years + benefitForYearsAfter5 + partialYearBenefit;

  const { factor: reductionFactor, label: reductionLabel } = entitlement(inputs, totalYears);
  const netBenefit = grossBenefit * reductionFactor;

  const paymentNote = inputs.departureReason === "resignation" || inputs.departureReason === "mutual_agreement"
    ? "The award is paid by the employer. Where the employee ends the contract, the employer must settle all dues within two weeks (Art. 88)."
    : "The award is paid by the employer. Wages and all dues must be settled within one week of the contract ending (Art. 88).";

  const yearlySummary: YearlyRow[] = [];
  for (let y = 1; y <= fullYears; y++) {
    const rate = y <= 5 ? 0.5 : 1;
    const gross = monthlySalaryBase * rate;
    yearlySummary.push({ year: y, accrualRate: rate, grossForYear: gross, reductionFactor, netForYear: gross * reductionFactor });
  }
  if (remainingDays > 0) {
    yearlySummary.push({
      year: fullYears + 1,
      accrualRate: partialYearRate,
      grossForYear: partialYearBenefit,
      reductionFactor,
      netForYear: partialYearBenefit * reductionFactor,
    });
  }

  return {
    breakdown: {
      totalDays,
      totalYears,
      fullYears,
      remainingDays,
      monthlySalaryBase,
      dailySalaryBase,
      benefitForFirst5Years,
      benefitForYearsAfter5,
      partialYearBenefit,
      grossBenefit,
      reductionFactor,
      reductionLabel,
      netBenefit,
      totalBenefit: netBenefit,
      isFullEntitlement: reductionFactor === 1,
      paymentNote,
    },
    yearlySummary,
  };
}

export function fmtService(fullYears: number, remainingDays: number): string {
  const parts = [];
  if (fullYears) parts.push(`${fullYears} yr${fullYears !== 1 ? "s" : ""}`);
  if (remainingDays) parts.push(`${remainingDays} day${remainingDays !== 1 ? "s" : ""}`);
  return parts.join(", ") || "0 days";
}
