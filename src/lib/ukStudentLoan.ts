export type LoanPlan = "plan1" | "plan2" | "plan4" | "plan5" | "postgrad";

export interface PlanDefinition {
  id: LoanPlan;
  name: string;
  shortName: string;
  who: string;
  threshold2024: number;       // annual repayment threshold £
  repaymentRate: number;       // fraction e.g. 0.09
  baseInterestNote: string;
  writeOffYears: number;
  writeOffNote: string;
  colour: string;
}

export const PLANS: Record<LoanPlan, PlanDefinition> = {
  plan1: {
    id: "plan1",
    name: "Plan 1",
    shortName: "Plan 1",
    who: "England/Wales before Sept 2012 · Northern Ireland",
    threshold2024: 24990,
    repaymentRate: 0.09,
    baseInterestNote: "Lower of RPI or Bank of England base rate + 1%",
    writeOffYears: 25,
    writeOffNote: "25 years after first repayment due date (or age 65)",
    colour: "blue",
  },
  plan2: {
    id: "plan2",
    name: "Plan 2",
    shortName: "Plan 2",
    who: "England/Wales Sept 2012 – July 2023",
    threshold2024: 27295,
    repaymentRate: 0.09,
    baseInterestNote: "RPI + up to 3% (sliding scale by income)",
    writeOffYears: 30,
    writeOffNote: "30 years after first repayment due date",
    colour: "purple",
  },
  plan4: {
    id: "plan4",
    name: "Plan 4",
    shortName: "Plan 4",
    who: "Scotland (post-1998 entrants)",
    threshold2024: 31395,
    repaymentRate: 0.09,
    baseInterestNote: "RPI only (no addition)",
    writeOffYears: 30,
    writeOffNote: "30 years after first repayment due date (or age 65)",
    colour: "emerald",
  },
  plan5: {
    id: "plan5",
    name: "Plan 5",
    shortName: "Plan 5",
    who: "England, starting August 2023 onwards",
    threshold2024: 25000,
    repaymentRate: 0.09,
    baseInterestNote: "RPI only (no addition)",
    writeOffYears: 40,
    writeOffNote: "40 years after first repayment due date",
    colour: "orange",
  },
  postgrad: {
    id: "postgrad",
    name: "Postgraduate Loan",
    shortName: "PGL",
    who: "Postgraduate Master's or Doctoral loan (England/Wales)",
    threshold2024: 21000,
    repaymentRate: 0.06,
    baseInterestNote: "RPI + 3% always",
    writeOffYears: 30,
    writeOffNote: "30 years after first repayment due date",
    colour: "rose",
  },
};

// ─── Inputs ────────────────────────────────────────────────────────

export interface StudentLoanInputs {
  loanPlan: LoanPlan;
  currentBalance: number;         // £ current outstanding balance
  annualSalary: number;           // current gross annual salary £
  annualSalaryGrowthPct: number;  // expected annual salary growth %
  interestRatePct: number;        // annual interest rate % (user can adjust)
  includePostgrad: boolean;       // also has a postgrad loan?
  postgradBalance: number;        // £ postgrad outstanding balance
  postgradInterestRatePct: number;// postgrad interest rate %
  yearsUntilRepaymentStarts: number; // years until April after graduation
}

// ─── Year-by-year row ──────────────────────────────────────────────

export interface YearlyRow {
  year: number;
  openingBalance: number;
  annualSalary: number;
  monthlyRepayment: number;
  annualRepayment: number;
  interestCharged: number;
  closingBalance: number;
  isPaidOff: boolean;
  isWrittenOff: boolean;
  // Postgrad (if applicable)
  pgOpeningBalance?: number;
  pgAnnualRepayment?: number;
  pgInterestCharged?: number;
  pgClosingBalance?: number;
  pgIsPaidOff?: boolean;
}

// ─── Result ────────────────────────────────────────────────────────

export interface StudentLoanResult {
  plan: PlanDefinition;
  // Outcome
  outcome: "paid_off" | "written_off" | "in_progress";
  paidOffYear: number | null;        // year number when paid off (null if written off)
  writtenOffYear: number | null;     // year number when written off (null if paid off)
  totalRepaid: number;               // £ total actually repaid
  totalInterestPaid: number;         // £ interest included in that total
  amountWrittenOff: number;          // £ written off (0 if paid off)
  effectiveCost: number;             // totalRepaid - original balance (interest cost)

  // Monthly summary
  averageMonthlyRepayment: number;
  firstMonthlyRepayment: number;
  peakMonthlyRepayment: number;

  // Postgrad outcome (if applicable)
  pgOutcome?: "paid_off" | "written_off" | "in_progress";
  pgTotalRepaid?: number;
  pgAmountWrittenOff?: number;

  // Schedule
  schedule: YearlyRow[];

  // Write-off threshold
  writeOffYear: number;
  writeOffBalance: number;           // balance remaining at write-off
}

// ─── Core calculation ──────────────────────────────────────────────

export function calculateStudentLoan(inputs: StudentLoanInputs): StudentLoanResult {
  const plan         = PLANS[inputs.loanPlan];
  const threshold    = plan.threshold2024;
  const repayRate    = plan.repaymentRate;
  const annualRate   = inputs.interestRatePct / 100;
  const salaryGrowth = inputs.annualSalaryGrowthPct / 100;
  const writeOffAt   = plan.writeOffYears;

  const pgPlan    = PLANS["postgrad"];
  const pgRate    = inputs.postgradInterestRatePct / 100;

  let balance     = inputs.currentBalance;
  let pgBalance   = inputs.includePostgrad ? inputs.postgradBalance : 0;
  let salary      = inputs.annualSalary;

  const schedule: YearlyRow[] = [];
  let totalRepaid   = 0;
  let totalInterest = 0;
  let pgTotalRepaid = 0;
  let paidOffYear: number | null = null;
  let pgPaidOffYear: number | null = null;
  let peakMonthly = 0;

  // Simulate up to writeOffAt years (plus buffer)
  const maxYears = Math.max(writeOffAt + inputs.yearsUntilRepaymentStarts, 45);

  for (let y = 1; y <= maxYears; y++) {
    // Pre-repayment period (still studying / grace period)
    if (y <= inputs.yearsUntilRepaymentStarts) {
      // Interest accrues but no repayments
      const interest = balance * annualRate;
      const pgInterest = pgBalance * pgRate;
      balance += interest;
      pgBalance += pgInterest;
      schedule.push({
        year: y,
        openingBalance: balance - interest,
        annualSalary: 0,
        monthlyRepayment: 0,
        annualRepayment: 0,
        interestCharged: interest,
        closingBalance: balance,
        isPaidOff: false,
        isWrittenOff: false,
        ...(inputs.includePostgrad ? {
          pgOpeningBalance: pgBalance - pgInterest,
          pgAnnualRepayment: 0,
          pgInterestCharged: pgInterest,
          pgClosingBalance: pgBalance,
          pgIsPaidOff: false,
        } : {}),
      });
      continue;
    }

    const repayYear = y - inputs.yearsUntilRepaymentStarts; // 1-indexed repayment year
    const isWriteOffYear = repayYear > writeOffAt;

    const opening = balance;
    const pgOpening = pgBalance;

    // Annual repayment (main loan)
    const taxableAbove = Math.max(0, salary - threshold);
    const annualRepayment = paidOffYear ? 0 : Math.min(balance, taxableAbove * repayRate);
    const monthlyRepayment = annualRepayment / 12;
    if (monthlyRepayment > peakMonthly) peakMonthly = monthlyRepayment;

    // Postgrad repayment (separate 6% of income above £21,000)
    const pgThreshold = pgPlan.threshold2024;
    const pgAbove = Math.max(0, salary - pgThreshold);
    const pgAnnualRepayment = (inputs.includePostgrad && !pgPaidOffYear)
      ? Math.min(pgBalance, pgAbove * pgPlan.repaymentRate)
      : 0;

    // Interest (charged on opening balance before repayment in real SLC terms,
    // but we simplify to mid-year balance)
    const balanceMidYear = opening - annualRepayment / 2;
    const interest = Math.max(0, balanceMidYear * annualRate);
    balance = Math.max(0, opening - annualRepayment + interest);

    const pgBalanceMidYear = pgOpening - pgAnnualRepayment / 2;
    const pgInterest = Math.max(0, pgBalanceMidYear * pgRate);
    pgBalance = Math.max(0, pgOpening - pgAnnualRepayment + pgInterest);

    totalRepaid   += annualRepayment;
    totalInterest += interest;
    pgTotalRepaid += pgAnnualRepayment;

    if (balance <= 0 && !paidOffYear) {
      balance = 0;
      paidOffYear = y;
    }
    if (pgBalance <= 0 && inputs.includePostgrad && !pgPaidOffYear) {
      pgBalance = 0;
      pgPaidOffYear = y;
    }

    // Write-off check
    const isWrittenOff = repayYear === writeOffAt && balance > 0;
    const pgIsWrittenOff = repayYear === writeOffAt && pgBalance > 0 && inputs.includePostgrad;

    schedule.push({
      year: y,
      openingBalance: opening,
      annualSalary: salary,
      monthlyRepayment,
      annualRepayment,
      interestCharged: interest,
      closingBalance: balance,
      isPaidOff: !!paidOffYear && y >= paidOffYear,
      isWrittenOff,
      ...(inputs.includePostgrad ? {
        pgOpeningBalance: pgOpening,
        pgAnnualRepayment,
        pgInterestCharged: pgInterest,
        pgClosingBalance: pgBalance,
        pgIsPaidOff: pgPaidOffYear ? y >= pgPaidOffYear : pgIsWrittenOff,
      } : {}),
    });

    if (isWrittenOff) break;
    if (paidOffYear && (!inputs.includePostgrad || pgPaidOffYear)) break;

    // Grow salary
    salary *= 1 + salaryGrowth;
  }

  const writtenOffRow = schedule.find(r => r.isWrittenOff);
  const writtenOffYear = writtenOffRow?.year ?? null;
  const writeOffBalance = writtenOffRow?.openingBalance ?? 0;

  const outcome: StudentLoanResult["outcome"] = paidOffYear
    ? "paid_off"
    : writtenOffYear
    ? "written_off"
    : "in_progress";

  const amountWrittenOff = writtenOffYear ? writeOffBalance : 0;
  const firstMonthly = schedule.find(r => r.monthlyRepayment > 0)?.monthlyRepayment ?? 0;
  const activePeriod = schedule.filter(r => r.annualRepayment > 0).length;
  const averageMonthly = activePeriod > 0 ? (totalRepaid / activePeriod) / 12 : 0;

  // Postgrad outcome
  const pgOutcome = inputs.includePostgrad
    ? pgPaidOffYear ? "paid_off" : writtenOffYear ? "written_off" : "in_progress"
    : undefined;
  const pgWrittenOffBalance = writtenOffYear ? pgBalance : 0;

  return {
    plan,
    outcome,
    paidOffYear: paidOffYear ? paidOffYear - inputs.yearsUntilRepaymentStarts : null,
    writtenOffYear: writtenOffYear ? writtenOffYear - inputs.yearsUntilRepaymentStarts : null,
    totalRepaid,
    totalInterestPaid: totalInterest,
    amountWrittenOff,
    effectiveCost: totalRepaid - inputs.currentBalance,
    averageMonthlyRepayment: averageMonthly,
    firstMonthlyRepayment: firstMonthly,
    peakMonthlyRepayment: peakMonthly,
    pgOutcome,
    pgTotalRepaid: inputs.includePostgrad ? pgTotalRepaid : undefined,
    pgAmountWrittenOff: inputs.includePostgrad ? pgWrittenOffBalance : undefined,
    schedule,
    writeOffYear: plan.writeOffYears,
    writeOffBalance,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────

export function fmtGBP(n: number, dp = 0): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  }).format(Math.max(0, n));
}

export function fmtGBPShort(n: number): string {
  if (n >= 1_000_000) return `£${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `£${(n / 1_000).toFixed(1)}k`;
  return `£${Math.round(n)}`;
}

export const PLAN_COLOUR_CLASSES: Record<LoanPlan, { badge: string; light: string; border: string }> = {
  plan1:   { badge: "bg-blue-100 text-blue-700",    light: "bg-blue-50",   border: "border-blue-200" },
  plan2:   { badge: "bg-purple-100 text-purple-700", light: "bg-purple-50", border: "border-purple-200" },
  plan4:   { badge: "bg-emerald-100 text-emerald-700", light: "bg-emerald-50", border: "border-emerald-200" },
  plan5:   { badge: "bg-orange-100 text-orange-700", light: "bg-orange-50", border: "border-orange-200" },
  postgrad:{ badge: "bg-rose-100 text-rose-700",    light: "bg-rose-50",   border: "border-rose-200" },
};
