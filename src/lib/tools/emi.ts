import type { EMIAmortizationRow, EMIResult } from "@/types/tools";

export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number,
): EMIResult {
  if (tenureMonths <= 0) {
    return {
      emi: 0,
      totalInterest: 0,
      totalPayment: 0,
    };
  }

  if (annualRate === 0) {
    return {
      emi: principal / tenureMonths,
      totalInterest: 0,
      totalPayment: principal,
    };
  }

  const monthlyRate = annualRate / 12 / 100;
  const months = tenureMonths;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  const totalPayment = emi * months;

  return {
    emi,
    totalPayment,
    totalInterest: totalPayment - principal,
  };
}

export function buildAmortization(
  principal: number,
  annualRate: number,
  tenureMonths: number,
): EMIAmortizationRow[] {
  if (tenureMonths <= 0) {
    return [];
  }

  const monthlyRate = annualRate / 12 / 100;
  const { emi } = calculateEMI(principal, annualRate, tenureMonths);
  let balance = principal;

  return Array.from({ length: tenureMonths }, (_, index) => {
    const interest = annualRate === 0 ? 0 : balance * monthlyRate;
    const principalPaid = emi - interest;
    balance = Math.max(0, balance - principalPaid);

    return {
      month: index + 1,
      emi,
      principalPaid,
      interest,
      balance,
    };
  });
}

export const CURRENCIES = [
  {
    code: "USD",
    symbol: "$",
    label: "US Dollar",
    locale: "en-US",
    defaultLoan: 200_000,
    defaultRate: 7.5,
    defaultTenure: 240,
    minLoan: 1_000,
    maxLoan: 2_000_000,
    loanStep: 1_000,
    carDefaults: {
      vehiclePrice: 35_000,
      downPayment: 5_000,
      tradeIn: 0,
      newCarRate: 6.5,
      usedCarRate: 9.5,
      tenure: 60,
    },
  },
  {
    code: "EUR",
    symbol: "EUR",
    label: "Euro",
    locale: "de-DE",
    defaultLoan: 150_000,
    defaultRate: 4.5,
    defaultTenure: 240,
    minLoan: 1_000,
    maxLoan: 2_000_000,
    loanStep: 1_000,
    carDefaults: {
      vehiclePrice: 25_000,
      downPayment: 3_000,
      tradeIn: 0,
      newCarRate: 5.5,
      usedCarRate: 8.0,
      tenure: 48,
    },
  },
  {
    code: "GBP",
    symbol: "GBP",
    label: "British Pound",
    locale: "en-GB",
    defaultLoan: 200_000,
    defaultRate: 5.5,
    defaultTenure: 300,
    minLoan: 1_000,
    maxLoan: 2_000_000,
    loanStep: 1_000,
    carDefaults: {
      vehiclePrice: 25_000,
      downPayment: 3_000,
      tradeIn: 0,
      newCarRate: 7.5,
      usedCarRate: 10.0,
      tenure: 48,
    },
  },
  {
    code: "AED",
    symbol: "AED",
    label: "UAE Dirham",
    locale: "en-AE",
    defaultLoan: 800_000,
    defaultRate: 5.0,
    defaultTenure: 240,
    minLoan: 10_000,
    maxLoan: 10_000_000,
    loanStep: 5_000,
    carDefaults: {
      vehiclePrice: 100_000,
      downPayment: 20_000,
      tradeIn: 0,
      newCarRate: 4.5,
      usedCarRate: 7.0,
      tenure: 60,
    },
  },
  {
    code: "INR",
    symbol: "INR",
    label: "Indian Rupee",
    locale: "en-IN",
    defaultLoan: 5_000_000,
    defaultRate: 8.5,
    defaultTenure: 240,
    minLoan: 100_000,
    maxLoan: 50_000_000,
    loanStep: 50_000,
    carDefaults: {
      vehiclePrice: 800_000,
      downPayment: 100_000,
      tradeIn: 0,
      newCarRate: 8.5,
      usedCarRate: 12.0,
      tenure: 60,
    },
  },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];
export type Currency = (typeof CURRENCIES)[number];
