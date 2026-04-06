export interface EMIResult {
  emi: number;
  totalPayment: number;
  totalInterest: number;
}

export interface AmortizationRow {
  month: number;
  emi: number;
  principalPaid: number;
  interest: number;
  balance: number;
}

export interface FreeToolMeta {
  name: string;
  href: string;
  description: string;
  category: "Finance" | "Converter" | "Utility";
  icon?: string;
}
