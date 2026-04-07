export interface EMIResult {
  emi: number;
  totalPayment: number;
  totalInterest: number;
}

export interface EMIAmortizationRow {
  month: number;
  emi: number;
  principalPaid: number;
  interest: number;
  balance: number;
}

export interface MortgageResult {
  monthlyPayment: number;
  monthlyPITI: number;
  totalPayment: number;
  totalInterest: number;
}

export interface MortgageAmortizationRow {
  month: number;
  payment: number;
  principalPaid: number;
  interest: number;
  balance: number;
}

export interface CarLoanFormState {
  vehiclePrice: number;
  downPayment: number;
  tradeIn: number;
  rate: number;
  tenureMonths: number;
  carType: "new" | "used";
}

export interface FreeToolMeta {
  name: string;
  href: string;
  description: string;
  category: "Finance" | "Converter" | "Utility";
  icon?: string;
}
