export interface CreditCardPayoffInput {
  balance: number;
  annualRate: number;
  monthlyPayment: number;
  extraPayment?: number;
  targetMonths?: number;
}

export interface CreditCardPayoffRow {
  month: number;
  payment: number;
  principalPaid: number;
  interest: number;
  balance: number;
}

export interface CreditCardPayoffResult {
  payoffPossible: boolean;
  monthsToPayoff: number | null;
  totalInterest: number;
  totalPaid: number;
  paymentUsed: number;
  paymentForTargetMonths: number;
  totalCostForTargetMonths: number;
  schedule: CreditCardPayoffRow[];
  reason?: "payment-too-low";
}

const DEFAULT_TARGET_MONTHS = 36;
const MAX_MONTHS = 1200;

function normalize(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function calculatePaymentForMonths({
  balance,
  annualRate,
  months,
}: {
  balance: number;
  annualRate: number;
  months: number;
}) {
  const safeBalance = normalize(balance);
  const safeMonths = Math.max(1, Math.round(months));
  const monthlyRate = normalize(annualRate) / 100 / 12;

  if (safeBalance === 0) {
    return 0;
  }

  if (monthlyRate === 0) {
    return safeBalance / safeMonths;
  }

  return (
    (safeBalance * monthlyRate) /
    (1 - Math.pow(1 + monthlyRate, -safeMonths))
  );
}

export function calculateCreditCardPayoff(input: CreditCardPayoffInput): CreditCardPayoffResult {
  const balance = normalize(input.balance);
  const annualRate = normalize(input.annualRate);
  const monthlyPayment = normalize(input.monthlyPayment);
  const extraPayment = normalize(input.extraPayment ?? 0);
  const targetMonths = Math.max(1, Math.round(input.targetMonths ?? DEFAULT_TARGET_MONTHS));

  const paymentUsed = monthlyPayment + extraPayment;
  const monthlyRate = annualRate / 100 / 12;
  const paymentForTargetMonths = calculatePaymentForMonths({
    balance,
    annualRate,
    months: targetMonths,
  });
  const totalCostForTargetMonths = paymentForTargetMonths * targetMonths;

  if (balance === 0) {
    return {
      payoffPossible: true,
      monthsToPayoff: 0,
      totalInterest: 0,
      totalPaid: 0,
      paymentUsed,
      paymentForTargetMonths,
      totalCostForTargetMonths,
      schedule: [],
    };
  }

  if (paymentUsed <= 0) {
    return {
      payoffPossible: false,
      monthsToPayoff: null,
      totalInterest: 0,
      totalPaid: 0,
      paymentUsed,
      paymentForTargetMonths,
      totalCostForTargetMonths,
      schedule: [],
      reason: "payment-too-low",
    };
  }

  const firstMonthInterest = balance * monthlyRate;
  if (monthlyRate > 0 && paymentUsed <= firstMonthInterest) {
    return {
      payoffPossible: false,
      monthsToPayoff: null,
      totalInterest: 0,
      totalPaid: 0,
      paymentUsed,
      paymentForTargetMonths,
      totalCostForTargetMonths,
      schedule: [],
      reason: "payment-too-low",
    };
  }

  let currentBalance = balance;
  let totalInterest = 0;
  let totalPaid = 0;
  let month = 0;
  const schedule: CreditCardPayoffRow[] = [];

  while (currentBalance > 0.005 && month < MAX_MONTHS) {
    month += 1;

    const interest = monthlyRate > 0 ? currentBalance * monthlyRate : 0;
    const scheduledPayment = Math.min(paymentUsed, currentBalance + interest);
    const principalPaid = Math.max(0, scheduledPayment - interest);
    currentBalance = Math.max(0, currentBalance + interest - scheduledPayment);
    totalInterest += interest;
    totalPaid += scheduledPayment;

    schedule.push({
      month,
      payment: scheduledPayment,
      principalPaid,
      interest,
      balance: currentBalance,
    });
  }

  if (currentBalance > 0.005) {
    return {
      payoffPossible: false,
      monthsToPayoff: null,
      totalInterest,
      totalPaid,
      paymentUsed,
      paymentForTargetMonths,
      totalCostForTargetMonths,
      schedule,
      reason: "payment-too-low",
    };
  }

  return {
    payoffPossible: true,
    monthsToPayoff: month,
    totalInterest,
    totalPaid,
    paymentUsed,
    paymentForTargetMonths,
    totalCostForTargetMonths,
    schedule,
  };
}
