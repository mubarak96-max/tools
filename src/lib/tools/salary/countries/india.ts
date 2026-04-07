import { calculateProgressiveTax, cap } from "@/lib/tools/salary/helpers";
import type { CountryCalculationDraft, SalaryCalculationInput } from "@/lib/tools/salary/types";

const newRegime = [
  { upTo: 400_000, rate: 0 },
  { upTo: 800_000, rate: 0.05 },
  { upTo: 1_200_000, rate: 0.1 },
  { upTo: 1_600_000, rate: 0.15 },
  { upTo: 2_000_000, rate: 0.2 },
  { upTo: 2_400_000, rate: 0.25 },
  { upTo: null, rate: 0.3 },
];

const oldRegime = [
  { upTo: 250_000, rate: 0 },
  { upTo: 500_000, rate: 0.05 },
  { upTo: 1_000_000, rate: 0.2 },
  { upTo: null, rate: 0.3 },
];

export function calculateIndiaSalary(input: SalaryCalculationInput, annualGross: number): CountryCalculationDraft {
  const regime = input.indiaRegime || "new";
  const standardDeduction = 75_000;
  const extraDeductions = regime === "old" ? Math.max(0, input.oldRegimeDeductions || 0) : 0;
  const taxableIncome = Math.max(0, annualGross - standardDeduction - extraDeductions);
  const tax = calculateProgressiveTax(taxableIncome, regime === "old" ? oldRegime : newRegime);
  const cess = tax.totalTax * 0.04;
  const epfBase = Math.min(180_000, annualGross * 0.5);
  const epfEmployee = cap(epfBase, 180_000) * 0.12;
  const epfEmployer = epfEmployee;

  return {
    taxableIncome,
    incomeTax: tax.totalTax + cess,
    socialContributions: epfEmployee,
    employerContributions: epfEmployer,
    marginalTaxRate: tax.marginalRate + 0.12,
    bracketBreakdown: [
      ...tax.slices,
      {
        label: "Health and education cess",
        from: 0,
        to: null,
        rate: 0.04,
        taxableAmount: tax.totalTax,
        taxAmount: cess,
      },
    ],
    breakdown: [
      { label: "Income tax", amount: tax.totalTax, category: "tax" },
      { label: "Cess", amount: cess, category: "tax" },
      { label: "Employee EPF", amount: epfEmployee, category: "contribution" },
      { label: "Employer EPF", amount: epfEmployer, category: "employer" },
      ...(extraDeductions > 0 ? [{ label: "Old regime deductions", amount: extraDeductions, category: "adjustment" as const }] : []),
    ],
    notes: [regime === "old" ? "Old tax regime selected." : "New tax regime selected."],
  };
}
