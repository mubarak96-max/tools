import { calculateEMI } from "@/lib/tools/emi";

export interface CarLoanInput {
  vehiclePrice: number;
  downPayment: number;
  tradeIn: number;
  annualRate: number;
  tenureMonths: number;
}

export interface CarLoanResult {
  amountFinanced: number;
  emi: number;
  totalLoanCost: number;
  totalInterest: number;
  totalCarCost: number;
  effectiveRate: number;
}

export function calculateCarLoan(input: CarLoanInput): CarLoanResult {
  const { vehiclePrice, downPayment, tradeIn, annualRate, tenureMonths } = input;
  const amountFinanced = Math.max(0, vehiclePrice - downPayment - tradeIn);

  if (amountFinanced === 0) {
    return {
      amountFinanced: 0,
      emi: 0,
      totalLoanCost: 0,
      totalInterest: 0,
      totalCarCost: downPayment + tradeIn,
      effectiveRate: 0,
    };
  }

  const { emi, totalPayment, totalInterest } = calculateEMI(
    amountFinanced,
    annualRate,
    tenureMonths,
  );

  return {
    amountFinanced,
    emi,
    totalLoanCost: totalPayment,
    totalInterest,
    totalCarCost: downPayment + tradeIn + totalPayment,
    effectiveRate: annualRate,
  };
}

export const CAR_LOAN_TENURES = [
  { months: 12, label: "12 months (1 year)" },
  { months: 24, label: "24 months (2 years)" },
  { months: 36, label: "36 months (3 years)" },
  { months: 48, label: "48 months (4 years)" },
  { months: 60, label: "60 months (5 years)" },
  { months: 72, label: "72 months (6 years)" },
  { months: 84, label: "84 months (7 years)" },
] as const;

export type CarType = "new" | "used";
