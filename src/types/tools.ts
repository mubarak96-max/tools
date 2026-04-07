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

export interface SalaryCalculatorFormState {
  countryCode:
    | "US"
    | "CA"
    | "GB"
    | "DE"
    | "FR"
    | "NL"
    | "ES"
    | "IT"
    | "AE"
    | "SG"
    | "IN"
    | "JP";
  payPeriod: "annual" | "monthly" | "weekly" | "hourly";
  salaryAmount: number;
  hoursPerWeek: number;
  weeksPerYear: number;
}

export interface DiscountFromPercentResult {
  discountAmount: number;
  finalPrice: number;
  savingPercent: number;
}

export interface DiscountFromPricesResult {
  discountPercent: number;
  amountSaved: number;
  isGoodDeal: boolean;
}

export type DiscountMode = "percent-to-price" | "price-to-percent";

export interface VATResult {
  netPrice: number;
  vatAmount: number;
  grossPrice: number;
  vatRate: number;
}

export type VATMode = "add" | "remove";

export interface MarginFromPricesResult {
  grossProfit: number;
  marginPercent: number;
  markupPercent: number;
  costPrice: number;
  sellingPrice: number;
}

export interface PriceFromMarginResult {
  sellingPrice: number;
  grossProfit: number;
  markupPercent: number;
  costPrice: number;
  targetMargin: number;
}

export interface PriceFromMarkupResult {
  sellingPrice: number;
  grossProfit: number;
  marginPercent: number;
  costPrice: number;
  markupPercent: number;
}

export type MarginMode = "margin-from-prices" | "price-from-margin" | "price-from-markup";

export interface FreeToolMeta {
  name: string;
  href: string;
  description: string;
  category: "Finance" | "Converter" | "Utility";
  icon?: string;
}
