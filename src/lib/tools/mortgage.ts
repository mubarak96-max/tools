import type { MortgageAmortizationRow, MortgageResult } from "@/types/tools";

export function calculateMortgage(
  principal: number,
  annualRate: number,
  tenureMonths: number,
  propertyTax = 0,
  insurance = 0,
): MortgageResult {
  if (tenureMonths <= 0) {
    return {
      monthlyPayment: 0,
      monthlyPITI: 0,
      totalPayment: 0,
      totalInterest: 0,
    };
  }

  if (annualRate === 0) {
    const monthlyPayment = principal / tenureMonths;
    return {
      monthlyPayment,
      monthlyPITI: monthlyPayment + propertyTax / 12 + insurance / 12,
      totalPayment: principal,
      totalInterest: 0,
    };
  }

  const monthlyRate = annualRate / 12 / 100;
  const months = tenureMonths;
  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  const totalPayment = monthlyPayment * months;

  return {
    monthlyPayment,
    monthlyPITI: monthlyPayment + propertyTax / 12 + insurance / 12,
    totalPayment,
    totalInterest: totalPayment - principal,
  };
}

export function buildMortgageAmortization(
  principal: number,
  annualRate: number,
  tenureMonths: number,
): MortgageAmortizationRow[] {
  if (tenureMonths <= 0) {
    return [];
  }

  const monthlyRate = annualRate / 12 / 100;
  const { monthlyPayment } = calculateMortgage(principal, annualRate, tenureMonths);
  let balance = principal;

  return Array.from({ length: tenureMonths }, (_, index) => {
    const interest = annualRate === 0 ? 0 : balance * monthlyRate;
    const principalPaid = monthlyPayment - interest;
    balance = Math.max(0, balance - principalPaid);

    return {
      month: index + 1,
      payment: monthlyPayment,
      principalPaid,
      interest,
      balance,
    };
  });
}

export const MORTGAGE_CURRENCIES = [
  {
    code: "USD",
    symbol: "$",
    label: "US Dollar",
    locale: "en-US",
    defaultHomePrice: 400_000,
    defaultDownPayment: 80_000,
    defaultRate: 6.5,
    defaultTenure: 360,
    defaultPropertyTax: 4_800,
    defaultInsurance: 1_200,
    minHomePrice: 50_000,
    maxHomePrice: 5_000_000,
    homePriceStep: 5_000,
    taxMax: 20_000,
    taxStep: 100,
    insuranceMax: 10_000,
    insuranceStep: 50,
  },
  {
    code: "EUR",
    symbol: "EUR",
    label: "Euro",
    locale: "de-DE",
    defaultHomePrice: 350_000,
    defaultDownPayment: 70_000,
    defaultRate: 4.0,
    defaultTenure: 240,
    defaultPropertyTax: 2_000,
    defaultInsurance: 800,
    minHomePrice: 50_000,
    maxHomePrice: 5_000_000,
    homePriceStep: 5_000,
    taxMax: 20_000,
    taxStep: 100,
    insuranceMax: 10_000,
    insuranceStep: 50,
  },
  {
    code: "GBP",
    symbol: "GBP",
    label: "British Pound",
    locale: "en-GB",
    defaultHomePrice: 300_000,
    defaultDownPayment: 45_000,
    defaultRate: 5.0,
    defaultTenure: 300,
    defaultPropertyTax: 1_500,
    defaultInsurance: 600,
    minHomePrice: 50_000,
    maxHomePrice: 5_000_000,
    homePriceStep: 5_000,
    taxMax: 20_000,
    taxStep: 100,
    insuranceMax: 10_000,
    insuranceStep: 50,
  },
  {
    code: "AED",
    symbol: "AED",
    label: "UAE Dirham",
    locale: "en-AE",
    defaultHomePrice: 1_500_000,
    defaultDownPayment: 375_000,
    defaultRate: 4.5,
    defaultTenure: 300,
    defaultPropertyTax: 0,
    defaultInsurance: 3_000,
    minHomePrice: 100_000,
    maxHomePrice: 15_000_000,
    homePriceStep: 10_000,
    taxMax: 0,
    taxStep: 0,
    insuranceMax: 25_000,
    insuranceStep: 100,
  },
  {
    code: "INR",
    symbol: "INR",
    label: "Indian Rupee",
    locale: "en-IN",
    defaultHomePrice: 8_000_000,
    defaultDownPayment: 1_600_000,
    defaultRate: 8.5,
    defaultTenure: 240,
    defaultPropertyTax: 10_000,
    defaultInsurance: 5_000,
    minHomePrice: 1_000_000,
    maxHomePrice: 100_000_000,
    homePriceStep: 100_000,
    taxMax: 100_000,
    taxStep: 1_000,
    insuranceMax: 50_000,
    insuranceStep: 500,
  },
] as const;

export type MortgageCurrencyCode = (typeof MORTGAGE_CURRENCIES)[number]["code"];
export type MortgageCurrency = (typeof MORTGAGE_CURRENCIES)[number];
