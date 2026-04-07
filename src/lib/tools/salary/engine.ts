import { annualizeSalary, finalizeSalaryResult } from "@/lib/tools/salary/helpers";
import { calculateCanadaSalary } from "@/lib/tools/salary/countries/canada";
import { calculateFranceSalary } from "@/lib/tools/salary/countries/france";
import { calculateGermanySalary } from "@/lib/tools/salary/countries/germany";
import { calculateIndiaSalary } from "@/lib/tools/salary/countries/india";
import { calculateItalySalary } from "@/lib/tools/salary/countries/italy";
import { calculateJapanSalary } from "@/lib/tools/salary/countries/japan";
import { calculateNetherlandsSalary } from "@/lib/tools/salary/countries/netherlands";
import { calculateSingaporeSalary } from "@/lib/tools/salary/countries/singapore";
import { calculateSpainSalary } from "@/lib/tools/salary/countries/spain";
import { calculateUaeSalary } from "@/lib/tools/salary/countries/uae";
import { calculateUkSalary } from "@/lib/tools/salary/countries/uk";
import { calculateUsSalary } from "@/lib/tools/salary/countries/us";
import type { SalaryCalculationInput, SalaryCalculationResult } from "@/lib/tools/salary/types";

export function calculateSalary(input: SalaryCalculationInput): SalaryCalculationResult {
  const annualGross = annualizeSalary(
    input.salaryAmount,
    input.payPeriod,
    input.hoursPerWeek,
    input.weeksPerYear,
  );

  const draft = (() => {
    switch (input.countryCode) {
      case "US":
        return calculateUsSalary(input, annualGross);
      case "CA":
        return calculateCanadaSalary(input, annualGross);
      case "GB":
        return calculateUkSalary(input, annualGross);
      case "DE":
        return calculateGermanySalary(input, annualGross);
      case "FR":
        return calculateFranceSalary(input, annualGross);
      case "NL":
        return calculateNetherlandsSalary(input, annualGross);
      case "ES":
        return calculateSpainSalary(input, annualGross);
      case "IT":
        return calculateItalySalary(input, annualGross);
      case "AE":
        return calculateUaeSalary(input, annualGross);
      case "SG":
        return calculateSingaporeSalary(input, annualGross);
      case "IN":
        return calculateIndiaSalary(input, annualGross);
      case "JP":
        return calculateJapanSalary(input, annualGross);
      default:
        return calculateUsSalary(input, annualGross);
    }
  })();

  return finalizeSalaryResult({
    countryCode: input.countryCode,
    annualGross,
    draft,
    hoursPerWeek: input.hoursPerWeek,
    weeksPerYear: input.weeksPerYear,
  });
}
