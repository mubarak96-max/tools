export const COMPOUNDING_FREQUENCIES = [
  { label: "Annually", timesPerYear: 1 },
  { label: "Semi-Annually", timesPerYear: 2 },
  { label: "Quarterly", timesPerYear: 4 },
  { label: "Monthly", timesPerYear: 12 },
  { label: "Daily", timesPerYear: 365 },
] as const;

export const CONTRIBUTION_FREQUENCIES = [
  { label: "Monthly", paymentsPerYear: 12 },
  { label: "Annually", paymentsPerYear: 1 },
] as const;

export type CompoundingFrequency = typeof COMPOUNDING_FREQUENCIES[number];
export type ContributionFrequency = typeof CONTRIBUTION_FREQUENCIES[number];

export interface CompoundInterestInput {
  principal: number;
  annualRate: number;
  years: number;
  contribution: number;
  contributionFrequency: number;
  compoundingFrequency: number;
  inflationRate?: number;
}

export interface YearlySnapshot {
  year: number;
  balance: number;
  totalContributions: number;
  totalInterest: number;
  realBalance?: number;
}

export interface CompoundInterestResult {
  futureValue: number;
  totalContributions: number;
  totalInterest: number;
  realFutureValue?: number;
  schedule: YearlySnapshot[];
}

export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestResult {
  const {
    principal,
    annualRate,
    years,
    contribution,
    contributionFrequency,
    compoundingFrequency,
    inflationRate,
  } = input;

  if (principal < 0 || annualRate < 0 || years < 0 || contribution < 0) {
    return {
      futureValue: 0,
      totalContributions: 0,
      totalInterest: 0,
      realFutureValue: 0,
      schedule: [],
    };
  }

  const ratePerPeriod = annualRate / 100 / compoundingFrequency;
  const contributionPerPeriod = (contribution * contributionFrequency) / compoundingFrequency;
  const totalPeriods = Math.max(0, Math.round(years * compoundingFrequency));
  let balance = principal;
  let totalContributions = principal;
  const schedule: YearlySnapshot[] = [];

  for (let period = 1; period <= totalPeriods; period += 1) {
    balance = balance * (1 + ratePerPeriod) + contributionPerPeriod;
    totalContributions += contributionPerPeriod;

    if (period % compoundingFrequency === 0) {
      const year = period / compoundingFrequency;
      const totalInterest = balance - totalContributions;
      const realBalance =
        inflationRate !== undefined
          ? balance / Math.pow(1 + inflationRate / 100, year)
          : undefined;

      schedule.push({
        year,
        balance,
        totalContributions,
        totalInterest,
        realBalance,
      });
    }
  }

  const futureValue = schedule.at(-1)?.balance ?? principal;
  const totalInterest = futureValue - totalContributions;
  const realFutureValue =
    inflationRate !== undefined ? futureValue / Math.pow(1 + inflationRate / 100, years) : undefined;

  return {
    futureValue,
    totalContributions,
    totalInterest,
    realFutureValue,
    schedule,
  };
}
