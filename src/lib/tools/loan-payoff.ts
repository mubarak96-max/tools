export interface LoanPayoffInput {
  principal: number;
  annualRate: number;
  remainingMonths: number;
  extraPayment: number;
}

export interface LoanPayoffRow {
  month: number;
  payment: number;
  principalPaid: number;
  interest: number;
  balance: number;
}

export interface LoanPayoffResult {
  scheduledPayment: number;
  standardMonths: number;
  standardTotalInterest: number;
  standardTotalPaid: number;
  acceleratedMonths: number;
  acceleratedTotalInterest: number;
  acceleratedTotalPaid: number;
  monthsSaved: number;
  interestSaved: number;
  schedule: LoanPayoffRow[];
}

const MAX_MONTHS = 1200;

function normalize(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function calculateScheduledLoanPayment(principal: number, annualRate: number, months: number) {
  const safePrincipal = normalize(principal);
  const safeMonths = Math.max(1, Math.round(normalize(months)));
  const monthlyRate = normalize(annualRate) / 100 / 12;

  if (safePrincipal === 0) {
    return 0;
  }

  if (monthlyRate === 0) {
    return safePrincipal / safeMonths;
  }

  return (
    (safePrincipal * monthlyRate) /
    (1 - Math.pow(1 + monthlyRate, -safeMonths))
  );
}

function buildSchedule({
  principal,
  annualRate,
  basePayment,
  extraPayment,
}: {
  principal: number;
  annualRate: number;
  basePayment: number;
  extraPayment: number;
}) {
  const monthlyRate = annualRate / 100 / 12;
  const rows: LoanPayoffRow[] = [];
  let balance = principal;
  let month = 0;
  let totalInterest = 0;
  let totalPaid = 0;

  while (balance > 0.005 && month < MAX_MONTHS) {
    month += 1;
    const interest = monthlyRate > 0 ? balance * monthlyRate : 0;
    const payment = Math.min(basePayment + extraPayment, balance + interest);
    const principalPaid = Math.max(0, payment - interest);

    balance = Math.max(0, balance + interest - payment);
    totalInterest += interest;
    totalPaid += payment;

    rows.push({
      month,
      payment,
      principalPaid,
      interest,
      balance,
    });
  }

  return {
    rows,
    months: rows.length,
    totalInterest,
    totalPaid,
  };
}

export function calculateLoanPayoff(input: LoanPayoffInput): LoanPayoffResult {
  const principal = normalize(input.principal);
  const annualRate = normalize(input.annualRate);
  const remainingMonths = Math.max(1, Math.round(normalize(input.remainingMonths)));
  const extraPayment = normalize(input.extraPayment);
  const scheduledPayment = calculateScheduledLoanPayment(principal, annualRate, remainingMonths);

  const standard = buildSchedule({
    principal,
    annualRate,
    basePayment: scheduledPayment,
    extraPayment: 0,
  });
  const accelerated = buildSchedule({
    principal,
    annualRate,
    basePayment: scheduledPayment,
    extraPayment,
  });

  return {
    scheduledPayment,
    standardMonths: standard.months,
    standardTotalInterest: standard.totalInterest,
    standardTotalPaid: standard.totalPaid,
    acceleratedMonths: accelerated.months,
    acceleratedTotalInterest: accelerated.totalInterest,
    acceleratedTotalPaid: accelerated.totalPaid,
    monthsSaved: Math.max(0, standard.months - accelerated.months),
    interestSaved: Math.max(0, standard.totalInterest - accelerated.totalInterest),
    schedule: accelerated.rows,
  };
}
