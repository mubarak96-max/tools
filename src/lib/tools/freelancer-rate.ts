export interface FreelancerRateInput {
  targetAnnualPay: number;
  annualBusinessOverhead: number;
  taxSetAsidePercent: number;
  billableHoursPerWeek: number;
  workingWeeksPerYear: number;
}

export interface FreelancerRateResult {
  requiredAnnualRevenue: number;
  billableHoursPerYear: number;
  hourlyRate: number;
  dayRate: number;
  weeklyRevenueTarget: number;
}

function normalize(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function calculateFreelancerRate(input: FreelancerRateInput): FreelancerRateResult {
  const targetAnnualPay = normalize(input.targetAnnualPay);
  const annualBusinessOverhead = normalize(input.annualBusinessOverhead);
  const taxSetAsidePercent = Math.min(95, normalize(input.taxSetAsidePercent));
  const billableHoursPerWeek = normalize(input.billableHoursPerWeek);
  const workingWeeksPerYear = normalize(input.workingWeeksPerYear);
  const billableHoursPerYear = billableHoursPerWeek * workingWeeksPerYear;
  const preTaxRevenueNeed = targetAnnualPay + annualBusinessOverhead;
  const requiredAnnualRevenue =
    taxSetAsidePercent >= 100
      ? 0
      : preTaxRevenueNeed / (1 - taxSetAsidePercent / 100);
  const hourlyRate =
    billableHoursPerYear > 0 ? requiredAnnualRevenue / billableHoursPerYear : 0;

  return {
    requiredAnnualRevenue,
    billableHoursPerYear,
    hourlyRate,
    dayRate: hourlyRate * 8,
    weeklyRevenueTarget: workingWeeksPerYear > 0 ? requiredAnnualRevenue / workingWeeksPerYear : 0,
  };
}
