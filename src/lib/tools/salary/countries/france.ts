import { calculateProgressiveTax } from "@/lib/tools/salary/helpers";
import type { CountryCalculationDraft, SalaryCalculationInput } from "@/lib/tools/salary/types";

const brackets = [
  { upTo: 11_497, rate: 0 },
  { upTo: 29_315, rate: 0.11 },
  { upTo: 83_823, rate: 0.3 },
  { upTo: 180_294, rate: 0.41 },
  { upTo: null, rate: 0.45 },
];

export function calculateFranceSalary(input: SalaryCalculationInput, annualGross: number): CountryCalculationDraft {
  const parts = Math.max(1, input.franceParts || 1);
  const employmentType = input.franceEmploymentType || "employee";
  const socialRate = employmentType === "self-employed" ? 0.3 : 0.225;
  const employerRate = employmentType === "self-employed" ? 0 : 0.42;
  const taxableBase = Math.max(0, annualGross * (employmentType === "self-employed" ? 0.66 : 0.9));
  const perPartIncome = taxableBase / parts;
  const taxPerPart = calculateProgressiveTax(perPartIncome, brackets);
  const incomeTax = taxPerPart.totalTax * parts;
  const contributions = annualGross * socialRate;

  return {
    taxableIncome: taxableBase,
    incomeTax,
    socialContributions: contributions,
    employerContributions: annualGross * employerRate,
    marginalTaxRate: taxPerPart.marginalRate + socialRate,
    bracketBreakdown: taxPerPart.slices.map((slice) => ({
      ...slice,
      taxableAmount: slice.taxableAmount * parts,
      taxAmount: slice.taxAmount * parts,
    })),
    breakdown: [
      { label: "Income tax", amount: incomeTax, category: "tax" },
      { label: "Employee social contributions", amount: contributions, category: "contribution" },
      { label: "Employer contributions", amount: annualGross * employerRate, category: "employer" },
    ],
    notes: [`French estimate uses the quotient familial with ${parts} part${parts > 1 ? "s" : ""}.`],
  };
}
