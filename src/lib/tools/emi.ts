import type { AmortizationRow, EMIResult } from "@/types/tools";

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
): AmortizationRow[] {
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
  },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];
export type Currency = (typeof CURRENCIES)[number];
