import { calculateProgressiveTax, cap } from "@/lib/tools/salary/helpers";
import type { CountryCalculationDraft, SalaryCalculationInput } from "@/lib/tools/salary/types";

const residentBrackets = [
  { upTo: 20_000, rate: 0 },
  { upTo: 30_000, rate: 0.02 },
  { upTo: 40_000, rate: 0.035 },
  { upTo: 80_000, rate: 0.07 },
  { upTo: 120_000, rate: 0.115 },
  { upTo: 160_000, rate: 0.15 },
  { upTo: 200_000, rate: 0.18 },
  { upTo: 240_000, rate: 0.19 },
  { upTo: 280_000, rate: 0.195 },
  { upTo: 320_000, rate: 0.2 },
  { upTo: 500_000, rate: 0.22 },
  { upTo: 1_000_000, rate: 0.23 },
  { upTo: null, rate: 0.24 },
];

export function calculateSingaporeSalary(input: SalaryCalculationInput, annualGross: number): CountryCalculationDraft {
  const resident = (input.singaporeResidency || "resident") === "resident";
  const cpfEligible = resident && Boolean(input.cpfEligible);
  const tax = resident ? calculateProgressiveTax(annualGross, residentBrackets) : { totalTax: annualGross * 0.15, marginalRate: 0.15, slices: [] };
  const cpfBase = cap(annualGross, 8_000 * 12);
  const cpfEmployee = cpfEligible ? cpfBase * 0.2 : 0;
  const cpfEmployer = cpfEligible ? cpfBase * 0.17 : 0;

  return {
    taxableIncome: annualGross,
    incomeTax: tax.totalTax,
    socialContributions: cpfEmployee,
    employerContributions: cpfEmployer,
    marginalTaxRate: tax.marginalRate + (cpfEligible ? 0.2 : 0),
    bracketBreakdown: tax.slices,
    breakdown: [
      { label: "Income tax", amount: tax.totalTax, category: "tax" },
      { label: "Employee CPF", amount: cpfEmployee, category: "contribution" },
      { label: "Employer CPF", amount: cpfEmployer, category: "employer" },
    ],
    notes: [resident ? "Resident tax bands applied." : "Non-resident estimate uses a flat 15% tax assumption."],
  };
}
