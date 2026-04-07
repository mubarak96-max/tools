import type { CountryCalculationDraft, SalaryCalculationInput } from "@/lib/tools/salary/types";

export function calculateUaeSalary(input: SalaryCalculationInput, annualGross: number): CountryCalculationDraft {
  const national = input.uaeEmploymentType === "national";
  const monthlyBasic = Math.max(0, input.uaeBasicSalary || 0);
  const monthlyHousing = Math.max(0, input.uaeHousingAllowance || 0);
  const monthlyTransport = Math.max(0, input.uaeTransportAllowance || 0);
  const monthlyOther = Math.max(0, input.uaeOtherAllowances || 0);
  const monthlyOvertime = Math.max(0, input.uaeOvertimePay || 0);
  const monthlyDeductions = Math.max(0, input.uaeTotalDeductions || 0);
  const monthlyGross = monthlyBasic + monthlyHousing + monthlyTransport + monthlyOther + monthlyOvertime;
  const grossAnnual = monthlyGross > 0 ? monthlyGross * 12 : annualGross;
  const annualDeductionPack = monthlyDeductions * 12;
  const employeeContribution = national ? grossAnnual * 0.05 : 0;
  const employerContribution = national ? grossAnnual * 0.125 : 0;
  const annualNet = Math.max(0, grossAnnual - annualDeductionPack - employeeContribution);

  return {
    taxableIncome: grossAnnual,
    incomeTax: 0,
    socialContributions: employeeContribution,
    otherDeductions: annualDeductionPack,
    employerContributions: employerContribution,
    grossAnnualOverride: grossAnnual,
    annualNetOverride: annualNet,
    marginalTaxRate: national ? 0.05 : 0,
    bracketBreakdown: [],
    breakdown: [
      { label: "Income tax", amount: 0, category: "tax" },
      { label: "Basic salary", amount: monthlyBasic * 12, category: "adjustment" },
      { label: "Housing allowance", amount: monthlyHousing * 12, category: "adjustment" },
      { label: "Transport allowance", amount: monthlyTransport * 12, category: "adjustment" },
      { label: "Other allowances", amount: monthlyOther * 12, category: "adjustment" },
      { label: "Overtime pay", amount: monthlyOvertime * 12, category: "adjustment" },
      { label: "Salary deductions", amount: annualDeductionPack, category: "contribution" },
      { label: "Employee pension contribution", amount: employeeContribution, category: "contribution" },
      { label: "Employer pension contribution", amount: employerContribution, category: "employer" },
    ],
    notes: [
      national
        ? "UAE nationals may have pension contributions. Expats generally have no income tax or payroll tax."
        : "UAE salary packages are typically modeled as basic salary plus allowances, with no personal income tax.",
    ],
  };
}
