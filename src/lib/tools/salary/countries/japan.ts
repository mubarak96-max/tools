import { calculateProgressiveTax } from "@/lib/tools/salary/helpers";
import type { CountryCalculationDraft, SalaryCalculationInput } from "@/lib/tools/salary/types";

const brackets = [
  { upTo: 1_950_000, rate: 0.05 },
  { upTo: 3_300_000, rate: 0.1 },
  { upTo: 6_950_000, rate: 0.2 },
  { upTo: 9_000_000, rate: 0.23 },
  { upTo: 18_000_000, rate: 0.33 },
  { upTo: 40_000_000, rate: 0.4 },
  { upTo: null, rate: 0.45 },
];

export function calculateJapanSalary(input: SalaryCalculationInput, annualGross: number): CountryCalculationDraft {
  const dependents = input.japanDependents || 0;
  const employmentDeduction = Math.min(1_950_000, annualGross * 0.3);
  const dependentAllowance = dependents * 380_000;
  const taxableIncome = Math.max(0, annualGross - 480_000 - employmentDeduction - dependentAllowance);
  const tax = calculateProgressiveTax(taxableIncome, brackets);
  const residentTax = taxableIncome * ((input.japanResidence || "tokyo") === "tokyo" ? 0.1 : 0.095);
  const social = annualGross * 0.145;
  const employer = annualGross * 0.15;

  return {
    taxableIncome,
    incomeTax: tax.totalTax + residentTax,
    socialContributions: social,
    employerContributions: employer,
    marginalTaxRate: tax.marginalRate + 0.145 + 0.1,
    bracketBreakdown: [
      ...tax.slices,
      {
        label: "Resident tax",
        from: 0,
        to: null,
        rate: (input.japanResidence || "tokyo") === "tokyo" ? 0.1 : 0.095,
        taxableAmount: taxableIncome,
        taxAmount: residentTax,
      },
    ],
    breakdown: [
      { label: "National income tax", amount: tax.totalTax, category: "tax" },
      { label: "Resident tax", amount: residentTax, category: "tax" },
      { label: "Employee social insurance", amount: social, category: "contribution" },
      { label: "Employer social insurance", amount: employer, category: "employer" },
    ],
    notes: ["Japanese estimate includes resident tax and simplified social insurance."],
  };
}
