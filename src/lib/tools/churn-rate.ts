export interface ChurnRateInput {
  customersAtStart: number;
  customersLost: number;
  newCustomers: number;
  monthlyRecurringRevenueAtStart: number;
  monthlyRecurringRevenueLost: number;
}

export interface ChurnRateResult {
  customerChurnRate: number;
  netCustomerChange: number;
  endingCustomers: number;
  revenueChurnRate: number;
}

function normalize(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function calculateChurnRate(input: ChurnRateInput): ChurnRateResult {
  const customersAtStart = normalize(input.customersAtStart);
  const customersLost = normalize(input.customersLost);
  const newCustomers = normalize(input.newCustomers);
  const monthlyRecurringRevenueAtStart = normalize(input.monthlyRecurringRevenueAtStart);
  const monthlyRecurringRevenueLost = normalize(input.monthlyRecurringRevenueLost);

  return {
    customerChurnRate:
      customersAtStart > 0 ? (customersLost / customersAtStart) * 100 : 0,
    netCustomerChange: newCustomers - customersLost,
    endingCustomers: Math.max(0, customersAtStart - customersLost + newCustomers),
    revenueChurnRate:
      monthlyRecurringRevenueAtStart > 0
        ? (monthlyRecurringRevenueLost / monthlyRecurringRevenueAtStart) * 100
        : 0,
  };
}
