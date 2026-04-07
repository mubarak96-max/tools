import { calculateProgressiveTax, cap } from "@/lib/tools/salary/helpers";
import type { CountryCalculationDraft, SalaryCalculationInput } from "@/lib/tools/salary/types";

const classAllowance: Record<string, number> = {
  "1": 12_348,
  "2": 16_500,
  "3": 24_696,
  "4": 12_348,
  "5": 0,
  "6": 0,
};

const brackets = [
  { upTo: 12_348, rate: 0 },
  { upTo: 30_000, rate: 0.14 },
  { upTo: 68_430, rate: 0.24 },
  { upTo: 277_826, rate: 0.42 },
  { upTo: null, rate: 0.45 },
];

export function calculateGermanySalary(input: SalaryCalculationInput, annualGross: number): CountryCalculationDraft {
  const allowance = classAllowance[input.germanTaxClass || "1"] ?? classAllowance["1"];
  const taxableIncome = Math.max(0, annualGross - allowance);
  const incomeTaxCalc = calculateProgressiveTax(taxableIncome, brackets);
  const solidarity = annualGross > 136_000 ? incomeTaxCalc.totalTax * 0.055 : 0;
  const churchTax = input.churchMember ? incomeTaxCalc.totalTax * ((input.germanyState || "") === "Bavaria" ? 0.08 : 0.09) : 0;
  const pension = cap(annualGross, 101_400) * 0.093;
  const health = (input.germanHealthInsuranceType || "public") === "public" ? cap(annualGross, 69_750) * 0.09 : 0;
  const unemployment = cap(annualGross, 101_400) * 0.013;
  const care = cap(annualGross, 69_750) * ((input.germanyChildren || 0) > 0 ? 0.018 : 0.024);
  const employer = pension + health + unemployment + cap(annualGross, 69_750) * 0.018;

  return {
    taxableIncome,
    incomeTax: incomeTaxCalc.totalTax + solidarity + churchTax,
    socialContributions: pension + health + unemployment + care,
    employerContributions: employer,
    marginalTaxRate: incomeTaxCalc.marginalRate + 0.2,
    bracketBreakdown: incomeTaxCalc.slices,
    breakdown: [
      { label: "Income tax", amount: incomeTaxCalc.totalTax, category: "tax" },
      { label: "Solidarity surcharge", amount: solidarity, category: "tax" },
      { label: "Church tax", amount: churchTax, category: "tax" },
      { label: "Pension insurance", amount: pension, category: "contribution" },
      { label: "Health insurance", amount: health, category: "contribution" },
      { label: "Unemployment insurance", amount: unemployment, category: "contribution" },
      { label: "Long-term care", amount: care, category: "contribution" },
      { label: "Employer social contributions", amount: employer, category: "employer" },
    ],
    notes: ["Estimate uses a simplified progressive-tax model and payroll contribution caps."],
  };
}
