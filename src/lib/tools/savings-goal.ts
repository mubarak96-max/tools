export const SAVINGS_GOAL_COMPOUNDING_FREQUENCIES = [
  { label: "Annually", timesPerYear: 1 },
  { label: "Semi-Annually", timesPerYear: 2 },
  { label: "Quarterly", timesPerYear: 4 },
  { label: "Monthly", timesPerYear: 12 },
  { label: "Daily", timesPerYear: 365 },
] as const;

export interface SavingsGoalInput {
  goalAmount: number;
  initialSavings: number;
  annualRate: number;
  years: number;
  compoundingFrequency: number;
}

export interface SavingsGoalScheduleRow {
  year: number;
  balance: number;
  totalContributions: number;
  totalInterest: number;
}

export interface SavingsGoalResult {
  requiredMonthlyContribution: number;
  requiredAnnualContribution: number;
  projectedBalance: number;
  totalContributions: number;
  totalInterest: number;
  months: number;
  shortfallWithoutContributions: number;
  principalOnlyFutureValue: number;
  schedule: SavingsGoalScheduleRow[];
}

function clampNumber(value: number) {
  return Number.isFinite(value) ? value : 0;
}

function getMonthlyEffectiveRate(annualRate: number, compoundingFrequency: number) {
  if (annualRate <= 0 || compoundingFrequency <= 0) {
    return 0;
  }

  return Math.pow(1 + annualRate / 100 / compoundingFrequency, compoundingFrequency / 12) - 1;
}

function projectBalance({
  initialSavings,
  monthlyContribution,
  monthlyRate,
  months,
}: {
  initialSavings: number;
  monthlyContribution: number;
  monthlyRate: number;
  months: number;
}) {
  if (months <= 0) {
    return initialSavings;
  }

  if (monthlyRate === 0) {
    return initialSavings + monthlyContribution * months;
  }

  const growthFactor = Math.pow(1 + monthlyRate, months);
  return (
    initialSavings * growthFactor +
    monthlyContribution * ((growthFactor - 1) / monthlyRate)
  );
}

export function calculateSavingsGoal(input: SavingsGoalInput): SavingsGoalResult {
  const goalAmount = Math.max(0, clampNumber(input.goalAmount));
  const initialSavings = Math.max(0, clampNumber(input.initialSavings));
  const annualRate = Math.max(0, clampNumber(input.annualRate));
  const years = Math.max(0, clampNumber(input.years));
  const compoundingFrequency = Math.max(1, Math.round(clampNumber(input.compoundingFrequency) || 12));

  const months = Math.max(0, Math.round(years * 12));
  const monthlyRate = getMonthlyEffectiveRate(annualRate, compoundingFrequency);
  const principalOnlyFutureValue = projectBalance({
    initialSavings,
    monthlyContribution: 0,
    monthlyRate,
    months,
  });
  const shortfallWithoutContributions = Math.max(0, goalAmount - principalOnlyFutureValue);

  let requiredMonthlyContribution = 0;

  if (months > 0 && shortfallWithoutContributions > 0) {
    if (monthlyRate === 0) {
      requiredMonthlyContribution = shortfallWithoutContributions / months;
    } else {
      const growthFactor = Math.pow(1 + monthlyRate, months);
      requiredMonthlyContribution =
        shortfallWithoutContributions /
        ((growthFactor - 1) / monthlyRate);
    }
  }

  const projectedBalance = projectBalance({
    initialSavings,
    monthlyContribution: requiredMonthlyContribution,
    monthlyRate,
    months,
  });
  const totalContributions = initialSavings + requiredMonthlyContribution * months;
  const totalInterest = projectedBalance - totalContributions;

  let balance = initialSavings;
  let contributed = initialSavings;
  let elapsedMonths = 0;
  const schedule: SavingsGoalScheduleRow[] = [];

  while (elapsedMonths < months) {
    const monthsThisStep = Math.min(12, months - elapsedMonths);

    for (let month = 0; month < monthsThisStep; month += 1) {
      balance = balance * (1 + monthlyRate) + requiredMonthlyContribution;
      contributed += requiredMonthlyContribution;
    }

    elapsedMonths += monthsThisStep;

    schedule.push({
      year: elapsedMonths / 12,
      balance,
      totalContributions: contributed,
      totalInterest: balance - contributed,
    });
  }

  return {
    requiredMonthlyContribution,
    requiredAnnualContribution: requiredMonthlyContribution * 12,
    projectedBalance,
    totalContributions,
    totalInterest,
    months,
    shortfallWithoutContributions,
    principalOnlyFutureValue,
    schedule,
  };
}
