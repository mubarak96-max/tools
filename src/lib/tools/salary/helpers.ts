import type {
  BracketSlice,
  CountryCalculationDraft,
  PayPeriod,
  SalaryCalculationResult,
} from "@/lib/tools/salary/types";

export type TaxBracket = {
  upTo: number | null;
  rate: number;
  label?: string;
};

export function annualizeSalary(amount: number, payPeriod: PayPeriod, hoursPerWeek = 40, weeksPerYear = 52) {
  switch (payPeriod) {
    case "monthly":
      return amount * 12;
    case "weekly":
      return amount * weeksPerYear;
    case "hourly":
      return amount * hoursPerWeek * weeksPerYear;
    default:
      return amount;
  }
}

export function periodizeAnnual(annualAmount: number, hoursPerWeek = 40, weeksPerYear = 52): Record<PayPeriod, number> {
  return {
    annual: annualAmount,
    monthly: annualAmount / 12,
    weekly: annualAmount / weeksPerYear,
    hourly: annualAmount / (hoursPerWeek * weeksPerYear),
  };
}

export function calculateProgressiveTax(income: number, brackets: TaxBracket[]) {
  let previousLimit = 0;
  let totalTax = 0;
  let marginalRate = 0;
  const slices: BracketSlice[] = [];

  for (const bracket of brackets) {
    const upperLimit = bracket.upTo ?? Number.POSITIVE_INFINITY;
    const taxableAmount = Math.max(0, Math.min(income, upperLimit) - previousLimit);

    if (taxableAmount > 0) {
      const taxAmount = taxableAmount * bracket.rate;
      totalTax += taxAmount;
      marginalRate = bracket.rate;
      slices.push({
        label: bracket.label || `${Math.round(bracket.rate * 100)}% bracket`,
        from: previousLimit,
        to: Number.isFinite(upperLimit) ? upperLimit : null,
        rate: bracket.rate,
        taxableAmount,
        taxAmount,
      });
    }

    if (income <= upperLimit) {
      break;
    }

    previousLimit = upperLimit;
  }

  return { totalTax, marginalRate, slices };
}

export function cap(value: number, max: number, floor = 0) {
  return Math.max(floor, Math.min(value, max));
}

export function finalizeSalaryResult(params: {
  countryCode: SalaryCalculationResult["countryCode"];
  annualGross: number;
  draft: CountryCalculationDraft;
  hoursPerWeek?: number;
  weeksPerYear?: number;
}): SalaryCalculationResult {
  const annualGross = Math.max(0, params.annualGross);
  const incomeTax = Math.max(0, params.draft.incomeTax);
  const socialContributions = Math.max(0, params.draft.socialContributions);
  const otherDeductions = Math.max(0, params.draft.otherDeductions || 0);
  const employerContributions = Math.max(0, params.draft.employerContributions || 0);
  const grossAnnual = Math.max(0, params.draft.grossAnnualOverride ?? annualGross);
  const totalDeductions = incomeTax + socialContributions + otherDeductions;
  const annualNet = Math.max(0, params.draft.annualNetOverride ?? (grossAnnual - totalDeductions));
  const grossByPeriod = periodizeAnnual(grossAnnual, params.hoursPerWeek, params.weeksPerYear);
  const netByPeriod = periodizeAnnual(annualNet, params.hoursPerWeek, params.weeksPerYear);

  return {
    countryCode: params.countryCode,
    annualGross: grossAnnual,
    taxableIncome: Math.max(0, params.draft.taxableIncome),
    annualNet,
    incomeTax,
    socialContributions,
    otherDeductions,
    totalDeductions,
    employerContributions,
    employerCost: annualGross + employerContributions,
    effectiveTaxRate: annualGross > 0 ? totalDeductions / annualGross : 0,
    marginalTaxRate: params.draft.marginalTaxRate,
    periods: {
      annual: { gross: grossByPeriod.annual, net: netByPeriod.annual },
      monthly: { gross: grossByPeriod.monthly, net: netByPeriod.monthly },
      weekly: { gross: grossByPeriod.weekly, net: netByPeriod.weekly },
      hourly: { gross: grossByPeriod.hourly, net: netByPeriod.hourly },
    },
    bracketBreakdown: params.draft.bracketBreakdown,
    breakdown: params.draft.breakdown,
    notes: params.draft.notes || [],
  };
}
