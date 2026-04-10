export interface ClvInput {
  averageRevenuePerCustomer: number;
  grossMarginPercent: number;
  purchaseFrequencyPerYear: number;
  customerLifespanYears: number;
}

export interface ClvResult {
  annualRevenuePerCustomer: number;
  annualGrossProfitPerCustomer: number;
  customerLifetimeValue: number;
}

function normalize(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function calculateClv(input: ClvInput): ClvResult {
  const averageRevenuePerCustomer = normalize(input.averageRevenuePerCustomer);
  const grossMarginPercent = normalize(input.grossMarginPercent);
  const purchaseFrequencyPerYear = normalize(input.purchaseFrequencyPerYear);
  const customerLifespanYears = normalize(input.customerLifespanYears);
  const annualRevenuePerCustomer =
    averageRevenuePerCustomer * purchaseFrequencyPerYear;
  const annualGrossProfitPerCustomer =
    annualRevenuePerCustomer * (grossMarginPercent / 100);

  return {
    annualRevenuePerCustomer,
    annualGrossProfitPerCustomer,
    customerLifetimeValue: annualGrossProfitPerCustomer * customerLifespanYears,
  };
}
