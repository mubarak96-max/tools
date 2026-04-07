import { calculateProgressiveTax } from "@/lib/tools/salary/helpers";
import type { CountryCalculationDraft, SalaryCalculationInput } from "@/lib/tools/salary/types";

const brackets = [
  { upTo: 12_450, rate: 0.19 },
  { upTo: 20_200, rate: 0.24 },
  { upTo: 35_200, rate: 0.3 },
  { upTo: 60_000, rate: 0.37 },
  { upTo: 300_000, rate: 0.45 },
  { upTo: null, rate: 0.47 },
];

const regionalSurcharge: Record<string, number> = {
  Madrid: -0.01,
  Catalonia: 0.015,
  Andalusia: -0.005,
  "Valencian Community": 0.01,
};

export function calculateSpainSalary(input: SalaryCalculationInput, annualGross: number): CountryCalculationDraft {
  const allowance = (input.age || 0) >= 65 ? 8_100 : 5_550;
  const taxableIncome = Math.max(0, annualGross - allowance);
  const tax = calculateProgressiveTax(taxableIncome, brackets);
  const regionalRate = regionalSurcharge[input.spainRegion || "Madrid"] || 0;
  const regionalTax = Math.max(0, taxableIncome * regionalRate);
  const social = annualGross * 0.0647;
  const employer = annualGross * 0.3;

  return {
    taxableIncome,
    incomeTax: tax.totalTax + regionalTax,
    socialContributions: social,
    employerContributions: employer,
    marginalTaxRate: tax.marginalRate + 0.0647 + Math.max(0, regionalRate),
    bracketBreakdown: [
      ...tax.slices,
      ...(regionalTax > 0
        ? [{
            label: `${input.spainRegion || "Regional"} surcharge`,
            from: 0,
            to: null,
            rate: regionalRate,
            taxableAmount: taxableIncome,
            taxAmount: regionalTax,
          }]
        : []),
    ],
    breakdown: [
      { label: "Income tax", amount: tax.totalTax, category: "tax" },
      { label: "Regional adjustment", amount: regionalTax, category: "tax" },
      { label: "Social Security", amount: social, category: "contribution" },
      { label: "Employer Social Security", amount: employer, category: "employer" },
    ],
    notes: ["Spanish estimate uses national brackets with a simplified regional adjustment."],
  };
}
