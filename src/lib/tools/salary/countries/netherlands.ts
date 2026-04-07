import { calculateProgressiveTax } from "@/lib/tools/salary/helpers";
import type { CountryCalculationDraft, SalaryCalculationInput } from "@/lib/tools/salary/types";

const brackets = [
  { upTo: 75_518, rate: 0.3697 },
  { upTo: null, rate: 0.495 },
];

export function calculateNetherlandsSalary(input: SalaryCalculationInput, annualGross: number): CountryCalculationDraft {
  const taxableIncome = input.netherlandsThirtyRuling ? annualGross * 0.7 : annualGross;
  const tax = calculateProgressiveTax(taxableIncome, brackets);
  const generalCredit = Math.max(0, 3_362 - Math.max(0, taxableIncome - 28_000) * 0.06);
  const labourCredit = Math.min(5_500, taxableIncome * 0.045);
  const incomeTax = Math.max(0, tax.totalTax - generalCredit - labourCredit);
  const employer = annualGross * 0.18;

  return {
    taxableIncome,
    incomeTax,
    socialContributions: 0,
    employerContributions: employer,
    marginalTaxRate: tax.marginalRate,
    bracketBreakdown: tax.slices,
    breakdown: [
      { label: "Box 1 income tax", amount: tax.totalTax, category: "tax" },
      { label: "General tax credit", amount: generalCredit, category: "adjustment" },
      { label: "Labour tax credit", amount: labourCredit, category: "adjustment" },
      { label: "Employer social costs", amount: employer, category: "employer" },
    ],
    notes: [input.netherlandsThirtyRuling ? "30% ruling applied as a simplified taxable-income reduction." : "Estimate includes simplified Dutch tax credits."],
  };
}
