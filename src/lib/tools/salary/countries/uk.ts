import { calculateProgressiveTax } from "@/lib/tools/salary/helpers";
import type { CountryCalculationDraft, SalaryCalculationInput } from "@/lib/tools/salary/types";

const restOfUkBrackets = [
  { upTo: 37_700, rate: 0.2 },
  { upTo: 125_140, rate: 0.4 },
  { upTo: null, rate: 0.45 },
];

const scotlandBrackets = [
  { upTo: 2_827, rate: 0.19 },
  { upTo: 14_921, rate: 0.2 },
  { upTo: 31_092, rate: 0.21 },
  { upTo: 62_430, rate: 0.42 },
  { upTo: null, rate: 0.47 },
];

const studentThresholds = {
  none: Number.POSITIVE_INFINITY,
  plan1: 26_575,
  plan2: 27_295,
  plan4: 32_745,
  plan5: 25_000,
} as const;

export function calculateUkSalary(input: SalaryCalculationInput, annualGross: number): CountryCalculationDraft {
  const pension = Math.max(0, input.pensionContribution || 0);
  let allowance = 12_570;
  if (annualGross > 100_000) {
    allowance = Math.max(0, 12_570 - (annualGross - 100_000) / 2);
  }
  const taxableIncome = Math.max(0, annualGross - pension - allowance);
  const tax = calculateProgressiveTax(taxableIncome, input.isScotland ? scotlandBrackets : restOfUkBrackets);
  const ni = Math.max(0, Math.min(annualGross, 50_270) - 12_570) * 0.08 + Math.max(0, annualGross - 50_270) * 0.02;
  const threshold = studentThresholds[input.studentLoanPlan || "none"];
  const studentLoan = threshold === Number.POSITIVE_INFINITY ? 0 : Math.max(0, annualGross - threshold) * 0.09;
  const employer = Math.max(0, annualGross - 9_100) * 0.138;

  return {
    taxableIncome,
    incomeTax: tax.totalTax,
    socialContributions: ni,
    otherDeductions: studentLoan,
    employerContributions: employer,
    marginalTaxRate: tax.marginalRate + (annualGross > 50_270 ? 0.02 : 0.08),
    bracketBreakdown: tax.slices,
    breakdown: [
      { label: "Income tax", amount: tax.totalTax, category: "tax" },
      { label: "National Insurance", amount: ni, category: "contribution" },
      { label: "Student loan repayments", amount: studentLoan, category: "contribution" },
      { label: "Employer National Insurance", amount: employer, category: "employer" },
      { label: "Pension contributions", amount: pension, category: "adjustment" },
    ],
    notes: [input.isScotland ? "Scottish tax rates selected." : "England, Wales, and Northern Ireland rates selected."],
  };
}
