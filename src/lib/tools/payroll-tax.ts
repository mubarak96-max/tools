export const US_PAYROLL_TAX_RULES_2026 = {
  socialSecurityRateEmployee: 0.062,
  socialSecurityRateEmployer: 0.062,
  socialSecurityWageBase: 184_500,
  medicareRateEmployee: 0.0145,
  medicareRateEmployer: 0.0145,
  additionalMedicareRateEmployee: 0.009,
  additionalMedicareThresholdEmployerWithholding: 200_000,
  futaRateBeforeCredit: 0.06,
  futaMaxCredit: 0.054,
  futaWageBase: 7_000,
} as const;

export interface PayrollTaxInput {
  annualGrossWages: number;
}

export interface PayrollTaxResult {
  taxableSocialSecurityWages: number;
  employeeSocialSecurity: number;
  employerSocialSecurity: number;
  employeeMedicare: number;
  employerMedicare: number;
  employeeAdditionalMedicare: number;
  futaBeforeCredit: number;
  futaAfterMaxCredit: number;
  employeePayrollTaxes: number;
  employerPayrollTaxesExcludingBenefits: number;
}

function normalize(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function calculatePayrollTax(input: PayrollTaxInput): PayrollTaxResult {
  const annualGrossWages = normalize(input.annualGrossWages);
  const taxableSocialSecurityWages = Math.min(
    annualGrossWages,
    US_PAYROLL_TAX_RULES_2026.socialSecurityWageBase,
  );
  const employeeSocialSecurity =
    taxableSocialSecurityWages * US_PAYROLL_TAX_RULES_2026.socialSecurityRateEmployee;
  const employerSocialSecurity =
    taxableSocialSecurityWages * US_PAYROLL_TAX_RULES_2026.socialSecurityRateEmployer;
  const employeeMedicare =
    annualGrossWages * US_PAYROLL_TAX_RULES_2026.medicareRateEmployee;
  const employerMedicare =
    annualGrossWages * US_PAYROLL_TAX_RULES_2026.medicareRateEmployer;
  const employeeAdditionalMedicare =
    Math.max(
      0,
      annualGrossWages -
        US_PAYROLL_TAX_RULES_2026.additionalMedicareThresholdEmployerWithholding,
    ) * US_PAYROLL_TAX_RULES_2026.additionalMedicareRateEmployee;
  const futaTaxableWages = Math.min(
    annualGrossWages,
    US_PAYROLL_TAX_RULES_2026.futaWageBase,
  );
  const futaBeforeCredit =
    futaTaxableWages * US_PAYROLL_TAX_RULES_2026.futaRateBeforeCredit;
  const futaAfterMaxCredit =
    futaTaxableWages *
    (US_PAYROLL_TAX_RULES_2026.futaRateBeforeCredit -
      US_PAYROLL_TAX_RULES_2026.futaMaxCredit);

  return {
    taxableSocialSecurityWages,
    employeeSocialSecurity,
    employerSocialSecurity,
    employeeMedicare,
    employerMedicare,
    employeeAdditionalMedicare,
    futaBeforeCredit,
    futaAfterMaxCredit,
    employeePayrollTaxes:
      employeeSocialSecurity +
      employeeMedicare +
      employeeAdditionalMedicare,
    employerPayrollTaxesExcludingBenefits:
      employerSocialSecurity + employerMedicare + futaAfterMaxCredit,
  };
}
