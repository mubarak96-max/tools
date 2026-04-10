export const FX_CURRENCIES = [
  { code: "USD", label: "US Dollar", locale: "en-US" },
  { code: "EUR", label: "Euro", locale: "de-DE" },
  { code: "GBP", label: "British Pound", locale: "en-GB" },
  { code: "AED", label: "UAE Dirham", locale: "en-AE" },
  { code: "INR", label: "Indian Rupee", locale: "en-IN" },
  { code: "CAD", label: "Canadian Dollar", locale: "en-CA" },
  { code: "AUD", label: "Australian Dollar", locale: "en-AU" },
  { code: "JPY", label: "Japanese Yen", locale: "ja-JP" },
  { code: "CHF", label: "Swiss Franc", locale: "de-CH" },
  { code: "SGD", label: "Singapore Dollar", locale: "en-SG" },
  { code: "NZD", label: "New Zealand Dollar", locale: "en-NZ" },
  { code: "SAR", label: "Saudi Riyal", locale: "ar-SA" },
] as const;

export type FxCurrency = (typeof FX_CURRENCIES)[number];

export interface FxFeeCalculationInput {
  amount: number;
  rate: number;
  bankChargePercent: number;
}

export interface FxFeeCalculationResult {
  convertedAmount: number;
  bankFeeAmount: number;
  finalAmountReceived: number;
  effectiveRate: number;
}

function normalize(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function calculateForeignExchangeFee(
  input: FxFeeCalculationInput,
): FxFeeCalculationResult {
  const amount = normalize(input.amount);
  const rate = normalize(input.rate);
  const bankChargePercent = normalize(input.bankChargePercent);
  const convertedAmount = amount * rate;
  const bankFeeAmount = convertedAmount * (bankChargePercent / 100);
  const finalAmountReceived = Math.max(0, convertedAmount - bankFeeAmount);

  return {
    convertedAmount,
    bankFeeAmount,
    finalAmountReceived,
    effectiveRate: amount > 0 ? finalAmountReceived / amount : 0,
  };
}
