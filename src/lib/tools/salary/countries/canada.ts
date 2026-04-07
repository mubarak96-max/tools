import { calculateProgressiveTax, cap } from "@/lib/tools/salary/helpers";
import type { CountryCalculationDraft, SalaryCalculationInput } from "@/lib/tools/salary/types";

const federalBrackets = [
  { upTo: 57_375, rate: 0.15 },
  { upTo: 114_750, rate: 0.205 },
  { upTo: 158_519, rate: 0.26 },
  { upTo: 220_000, rate: 0.29 },
  { upTo: null, rate: 0.33 },
];

const provinceRates: Record<string, number> = {
  Ontario: 0.0915,
  "British Columbia": 0.077,
  Alberta: 0.1,
  Quebec: 0.14,
  Manitoba: 0.108,
  Saskatchewan: 0.105,
  "Nova Scotia": 0.125,
  "New Brunswick": 0.11,
  "Prince Edward Island": 0.098,
  "Newfoundland and Labrador": 0.112,
};

export function calculateCanadaSalary(input: SalaryCalculationInput, annualGross: number): CountryCalculationDraft {
  const rrsp = Math.max(0, input.rrspContribution || 0);
  const taxableIncome = Math.max(0, annualGross - rrsp);
  const federal = calculateProgressiveTax(taxableIncome, federalBrackets);
  const federalTax = Math.max(0, federal.totalTax - 16_129 * 0.15);
  const provinceRate = provinceRates[input.province || "Ontario"] ?? 0.09;
  const provincialTax = taxableIncome * provinceRate;
  const cpp = Math.max(0, Math.min(annualGross, 73_200) - 3_500) * 0.0595;
  const ei = cap(annualGross, 65_700) * 0.0166;
  const employer = cpp + cap(annualGross, 65_700) * 0.0232;

  return {
    taxableIncome,
    incomeTax: federalTax + provincialTax,
    socialContributions: cpp + ei,
    employerContributions: employer,
    marginalTaxRate: federal.marginalRate + provinceRate,
    bracketBreakdown: federal.slices,
    breakdown: [
      { label: "Federal income tax", amount: federalTax, category: "tax" },
      { label: "Provincial income tax", amount: provincialTax, category: "tax" },
      { label: "CPP", amount: cpp, category: "contribution" },
      { label: "EI", amount: ei, category: "contribution" },
      { label: "Employer payroll contributions", amount: employer, category: "employer" },
      { label: "RRSP deduction", amount: rrsp, category: "adjustment" },
    ],
    notes: ["Estimate uses federal brackets and a simplified provincial tax layer."],
  };
}
