export type CompoundFrequency = "daily" | "weekly" | "monthly" | "quarterly" | "semi-annual" | "annual";
export type ContributionTiming = "end" | "start"; // end of period (ordinary) vs start (annuity due)
export type ContributionFrequency = "monthly" | "quarterly" | "annually";

export const COMPOUND_FREQUENCIES: Record<CompoundFrequency, { label: string; n: number }> = {
  daily:        { label: "Daily",       n: 365 },
  weekly:       { label: "Weekly",      n: 52  },
  monthly:      { label: "Monthly",     n: 12  },
  quarterly:    { label: "Quarterly",   n: 4   },
  "semi-annual":{ label: "Semi-annual", n: 2   },
  annual:       { label: "Annually",    n: 1   },
};

export const CONTRIBUTION_FREQUENCIES: Record<ContributionFrequency, { label: string; perYear: number }> = {
  monthly:    { label: "Monthly",   perYear: 12 },
  quarterly:  { label: "Quarterly", perYear: 4  },
  annually:   { label: "Annually",  perYear: 1  },
};

export interface CompoundInputs {
  principal: number;              // initial lump sum
  annualRatePercent: number;      // e.g. 7 for 7%
  years: number;                  // investment horizon
  compoundFrequency: CompoundFrequency;
  contributionAmount: number;     // periodic contribution amount
  contributionFrequency: ContributionFrequency;
  contributionTiming: ContributionTiming;
  inflationRatePercent: number;   // for real return calculation, e.g. 2.5
}

export interface YearlySnapshot {
  year: number;
  startBalance: number;
  contributions: number;         // total contributions this year
  interestEarned: number;        // interest earned this year
  endBalance: number;
  totalContributions: number;    // cumulative contributions to date (inc. principal)
  totalInterest: number;         // cumulative interest to date
  realBalance: number;           // inflation-adjusted end balance
}

export interface CompoundResult {
  // Final values
  finalBalance: number;
  totalPrincipal: number;         // initial deposit only
  totalContributions: number;     // all periodic contributions (excl. principal)
  totalDeposited: number;         // principal + all contributions
  totalInterestEarned: number;
  realFinalBalance: number;       // inflation-adjusted

  // Ratios
  interestToDepositRatio: number; // interest / total deposited
  doublingYears: number;          // rule of 72 approximation

  // Schedule
  yearlySchedule: YearlySnapshot[];

  // Monthly schedule (first 24 months for detailed view)
  monthlySchedule: MonthlySnapshot[];
}

export interface MonthlySnapshot {
  month: number;
  year: number;
  startBalance: number;
  contribution: number;
  interestEarned: number;
  endBalance: number;
  totalContributions: number;
  totalInterest: number;
}

export function calculateCompoundInterest(inputs: CompoundInputs): CompoundResult {
  const {
    principal,
    annualRatePercent,
    years,
    compoundFrequency,
    contributionAmount,
    contributionFrequency,
    contributionTiming,
    inflationRatePercent,
  } = inputs;

  const r      = annualRatePercent / 100;
  const n      = COMPOUND_FREQUENCIES[compoundFrequency].n;
  const inf    = inflationRatePercent / 100;
  const contribPerYear = CONTRIBUTION_FREQUENCIES[contributionFrequency].perYear;

  // Rate per compounding period
  const ratePerPeriod = r / n;
  // Contribution amount per compounding period (convert if different frequencies)
  // We'll simulate period by period for accuracy

  const totalPeriods = Math.round(n * years);

  // Monthly simulation for the monthly schedule (always use monthly steps)
  const monthlySnapshots: MonthlySnapshot[] = [];
  const yearlySnapshots: YearlySnapshot[] = [];

  let balance = principal;
  let totalContribsMade = 0; // periodic contributions only (not principal)
  let totalInterestAccum = 0;

  // Determine contribution amount per compounding period
  // Convert annual contribution total to per-compounding-period
  const annualContribTotal = contributionAmount * contribPerYear;
  const contribPerPeriod   = annualContribTotal / n;

  // Monthly tracking (for first 24 months detailed view)
  // We'll also track monthly regardless of compound frequency
  const monthlyRateForDisplay = r / 12;
  const monthlyContrib = annualContribTotal / 12;
  let monthBalance = principal;
  let monthTotalContribs = 0;
  let monthTotalInterest = 0;

  for (let m = 1; m <= Math.min(years * 12, 360); m++) {
    const startBal = monthBalance;

    // Add contribution at start if annuity due
    if (contributionTiming === "start") {
      monthBalance += monthlyContrib;
      monthTotalContribs += monthlyContrib;
    }

    const interestThisMonth = monthBalance * monthlyRateForDisplay;
    monthBalance += interestThisMonth;
    monthTotalInterest += interestThisMonth;

    // Add contribution at end if ordinary annuity
    if (contributionTiming === "end") {
      monthBalance += monthlyContrib;
      monthTotalContribs += monthlyContrib;
    }

    if (m <= 24) {
      monthlySnapshots.push({
        month: m,
        year: Math.ceil(m / 12),
        startBalance: startBal,
        contribution: monthlyContrib,
        interestEarned: interestThisMonth,
        endBalance: monthBalance,
        totalContributions: principal + monthTotalContribs,
        totalInterest: monthTotalInterest,
      });
    }
  }

  // Yearly schedule using exact formula per period for accuracy
  balance = principal;
  totalContribsMade = 0;
  totalInterestAccum = 0;

  for (let y = 1; y <= years; y++) {
    const startBalance = balance;
    let yearlyContribs = 0;
    let yearlyInterest = 0;
    const periodsThisYear = n; // compounding periods per year

    for (let p = 0; p < periodsThisYear; p++) {
      // Add contribution at start of period
      if (contributionTiming === "start") {
        balance += contribPerPeriod;
        yearlyContribs += contribPerPeriod;
        totalContribsMade += contribPerPeriod;
      }

      const interest = balance * ratePerPeriod;
      balance += interest;
      yearlyInterest += interest;
      totalInterestAccum += interest;

      // Add contribution at end of period
      if (contributionTiming === "end") {
        balance += contribPerPeriod;
        yearlyContribs += contribPerPeriod;
        totalContribsMade += contribPerPeriod;
      }
    }

    // Inflation-adjusted balance using Fisher equation
    const realBalance = balance / Math.pow(1 + inf, y);

    yearlySnapshots.push({
      year: y,
      startBalance,
      contributions: yearlyContribs,
      interestEarned: yearlyInterest,
      endBalance: balance,
      totalContributions: principal + totalContribsMade,
      totalInterest: totalInterestAccum,
      realBalance,
    });
  }

  const finalBalance = balance;
  const totalDeposited = principal + totalContribsMade;
  const realFinalBalance = finalBalance / Math.pow(1 + inf, years);

  // Rule of 72 — approximate years to double
  const doublingYears = r > 0 ? 72 / annualRatePercent : Infinity;

  return {
    finalBalance,
    totalPrincipal: principal,
    totalContributions: totalContribsMade,
    totalDeposited,
    totalInterestEarned: totalInterestAccum,
    realFinalBalance,
    interestToDepositRatio: totalDeposited > 0 ? totalInterestAccum / totalDeposited : 0,
    doublingYears,
    yearlySchedule: yearlySnapshots,
    monthlySchedule: monthlySnapshots,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────

export function fmtUSD(n: number, dp = 0): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  }).format(n);
}

export function fmtShort(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000)     return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)         return `$${(n / 1_000).toFixed(1)}k`;
  return `$${n.toFixed(0)}`;
}

export function fmtPct(n: number, dp = 2): string {
  return `${n.toFixed(dp)}%`;
}
