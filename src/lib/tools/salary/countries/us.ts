import { calculateProgressiveTax, cap } from "@/lib/tools/salary/helpers";
import type { CountryCalculationDraft, FilingStatus, SalaryCalculationInput } from "@/lib/tools/salary/types";

const STANDARD_DEDUCTION_2026: Record<FilingStatus, number> = {
  single: 16_100,
  married: 32_200,
  head: 24_150,
};

const FEDERAL_BRACKETS_2026: Record<FilingStatus, Array<{ upTo: number | null; rate: number }>> = {
  single: [
    { upTo: 12_400, rate: 0.1 },
    { upTo: 50_400, rate: 0.12 },
    { upTo: 105_700, rate: 0.22 },
    { upTo: 201_775, rate: 0.24 },
    { upTo: 256_225, rate: 0.32 },
    { upTo: 640_600, rate: 0.35 },
    { upTo: null, rate: 0.37 },
  ],
  married: [
    { upTo: 24_800, rate: 0.1 },
    { upTo: 100_800, rate: 0.12 },
    { upTo: 211_400, rate: 0.22 },
    { upTo: 403_550, rate: 0.24 },
    { upTo: 512_450, rate: 0.32 },
    { upTo: 769_600, rate: 0.35 },
    { upTo: null, rate: 0.37 },
  ],
  head: [
    { upTo: 17_750, rate: 0.1 },
    { upTo: 67_200, rate: 0.12 },
    { upTo: 105_700, rate: 0.22 },
    { upTo: 201_700, rate: 0.24 },
    { upTo: 256_150, rate: 0.32 },
    { upTo: 640_500, rate: 0.35 },
    { upTo: null, rate: 0.37 },
  ],
};

const SS_WAGE_BASE_2026 = 184_500;

const stateRates: Record<string, number> = {
  CA: 0.093,
  NY: 0.0685,
  NJ: 0.06,
  MA: 0.05,
  IL: 0.0495,
  PA: 0.0307,
  TX: 0,
  FL: 0,
  WA: 0,
  NV: 0,
  TN: 0,
  AK: 0,
  NH: 0,
  WY: 0,
};

function seniorThreshold(filingStatus: FilingStatus) {
  return filingStatus === "married" ? 150_000 : 75_000;
}

function workerThreshold(filingStatus: FilingStatus) {
  return filingStatus === "married" ? 300_000 : 150_000;
}

function applySeniorPhaseout(baseDeduction: number, magi: number, filingStatus: FilingStatus) {
  const threshold = seniorThreshold(filingStatus);
  if (magi <= threshold) {
    return baseDeduction;
  }

  return Math.max(0, baseDeduction - (magi - threshold) * 0.06);
}

function applyWorkerPhaseout(baseDeduction: number, magi: number, filingStatus: FilingStatus) {
  const threshold = workerThreshold(filingStatus);
  if (magi <= threshold) {
    return baseDeduction;
  }

  const reductionSteps = Math.floor((magi - threshold) / 1_000);
  return Math.max(0, baseDeduction - reductionSteps * 100);
}

export function calculateUsSalary(input: SalaryCalculationInput, annualGross: number): CountryCalculationDraft {
  const filingStatus = input.filingStatus || "single";
  const pretax = Math.max(0, input.pretaxDeductions || 0);
  const reportedTips = Math.max(0, input.usReportedTips || 0);
  const overtimePremium = Math.max(0, input.usQualifiedOvertimePremium || 0);
  const seniorCount = Number(Boolean(input.usIsSenior)) + Number(filingStatus === "married" && input.usSpouseIsSenior);

  const maxTipDeduction = Math.min(reportedTips, 25_000);
  const maxOvertimeDeduction = Math.min(
    overtimePremium,
    filingStatus === "married" ? 25_000 : 12_500,
  );

  const agiBeforeObbba = Math.max(0, annualGross - pretax);
  const tipsDeduction = applyWorkerPhaseout(maxTipDeduction, agiBeforeObbba, filingStatus);
  const overtimeDeduction = applyWorkerPhaseout(maxOvertimeDeduction, agiBeforeObbba, filingStatus);
  const magi = Math.max(0, annualGross - pretax - tipsDeduction - overtimeDeduction);
  const seniorDeduction = applySeniorPhaseout(seniorCount * 6_000, magi, filingStatus);

  const taxableIncome = Math.max(
    0,
    magi - STANDARD_DEDUCTION_2026[filingStatus] - seniorDeduction,
  );
  const federal = calculateProgressiveTax(taxableIncome, FEDERAL_BRACKETS_2026[filingStatus]);
  const stateRate = stateRates[input.usState || "CA"] ?? 0.045;
  const stateTax = taxableIncome * stateRate;
  const socialSecurity = cap(annualGross, SS_WAGE_BASE_2026) * 0.062;
  const medicare = annualGross * 0.0145 + Math.max(0, annualGross - 200_000) * 0.009;
  const employer = cap(annualGross, SS_WAGE_BASE_2026) * 0.062 + annualGross * 0.0145;

  return {
    taxableIncome,
    incomeTax: federal.totalTax + stateTax,
    socialContributions: socialSecurity + medicare,
    employerContributions: employer,
    marginalTaxRate: Math.min(0.5, federal.marginalRate + stateRate + 0.0145),
    bracketBreakdown: [
      ...federal.slices,
      {
        label: `${input.usState || "Selected"} state tax`,
        from: 0,
        to: null,
        rate: stateRate,
        taxableAmount: taxableIncome,
        taxAmount: stateTax,
      },
    ],
    breakdown: [
      { label: "Federal income tax", amount: federal.totalTax, category: "tax" },
      { label: "State income tax", amount: stateTax, category: "tax" },
      { label: "Social Security", amount: socialSecurity, category: "contribution" },
      { label: "Medicare", amount: medicare, category: "contribution" },
      { label: "Employer payroll taxes", amount: employer, category: "employer" },
      { label: "Pre-tax deductions", amount: pretax, category: "adjustment" },
      { label: "Qualified tips deduction", amount: tipsDeduction, category: "adjustment" },
      { label: "Qualified overtime deduction", amount: overtimeDeduction, category: "adjustment" },
      { label: "Senior deduction", amount: seniorDeduction, category: "adjustment" },
    ],
    notes: [
      "Estimate includes 2026 federal brackets, payroll taxes, and a simplified state-tax layer.",
      "Tips, overtime, and senior deductions are modeled against federal taxable income only.",
    ],
  };
}
