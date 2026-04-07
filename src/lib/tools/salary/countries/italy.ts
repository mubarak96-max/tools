import { calculateProgressiveTax } from "@/lib/tools/salary/helpers";
import type { CountryCalculationDraft, SalaryCalculationInput } from "@/lib/tools/salary/types";

const brackets = [
  { upTo: 28_000, rate: 0.23 },
  { upTo: 50_000, rate: 0.35 },
  { upTo: null, rate: 0.43 },
];

const regionalRates: Record<string, number> = {
  Lombardy: 0.014,
  Lazio: 0.021,
  Veneto: 0.015,
  "Emilia-Romagna": 0.017,
  Sicily: 0.016,
};

export function calculateItalySalary(input: SalaryCalculationInput, annualGross: number): CountryCalculationDraft {
  const taxableIncome = Math.max(0, annualGross - 1_880);
  const tax = calculateProgressiveTax(taxableIncome, brackets);
  const inps = annualGross * 0.0919;
  const regionalRate = regionalRates[input.italyRegion || "Lombardy"] || 0.015;
  const regionalTax = taxableIncome * regionalRate;
  const employer = annualGross * 0.3;

  return {
    taxableIncome,
    incomeTax: tax.totalTax + regionalTax,
    socialContributions: inps,
    employerContributions: employer,
    marginalTaxRate: tax.marginalRate + regionalRate + 0.0919,
    bracketBreakdown: [
      ...tax.slices,
      {
        label: `${input.italyRegion || "Regional"} surcharge`,
        from: 0,
        to: null,
        rate: regionalRate,
        taxableAmount: taxableIncome,
        taxAmount: regionalTax,
      },
    ],
    breakdown: [
      { label: "IRPEF income tax", amount: tax.totalTax, category: "tax" },
      { label: "Regional surcharge", amount: regionalTax, category: "tax" },
      { label: "INPS employee contributions", amount: inps, category: "contribution" },
      { label: "Employer social contributions", amount: employer, category: "employer" },
    ],
    notes: ["Italian estimate includes IRPEF, INPS, and a simplified regional surcharge."],
  };
}
