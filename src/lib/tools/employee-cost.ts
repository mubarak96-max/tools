import { calculatePayrollTax } from "@/lib/tools/payroll-tax";

export interface EmployeeCostInput {
  annualGrossSalary: number;
  annualBenefitsCost: number;
  employerRetirementContributionPercent: number;
}

export interface EmployeeCostResult {
  annualGrossSalary: number;
  annualBenefitsCost: number;
  employerRetirementContribution: number;
  employerPayrollTaxes: number;
  totalAnnualEmployerCost: number;
  monthlyEmployerCost: number;
}

function normalize(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function calculateEmployeeCost(input: EmployeeCostInput): EmployeeCostResult {
  const annualGrossSalary = normalize(input.annualGrossSalary);
  const annualBenefitsCost = normalize(input.annualBenefitsCost);
  const employerRetirementContributionPercent = normalize(
    input.employerRetirementContributionPercent,
  );
  const payroll = calculatePayrollTax({ annualGrossWages: annualGrossSalary });
  const employerRetirementContribution =
    annualGrossSalary * (employerRetirementContributionPercent / 100);
  const totalAnnualEmployerCost =
    annualGrossSalary +
    payroll.employerPayrollTaxesExcludingBenefits +
    annualBenefitsCost +
    employerRetirementContribution;

  return {
    annualGrossSalary,
    annualBenefitsCost,
    employerRetirementContribution,
    employerPayrollTaxes: payroll.employerPayrollTaxesExcludingBenefits,
    totalAnnualEmployerCost,
    monthlyEmployerCost: totalAnnualEmployerCost / 12,
  };
}
