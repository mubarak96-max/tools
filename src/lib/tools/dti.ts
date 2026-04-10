export interface DtiInput {
  grossMonthlyIncome: number;
  housingPayment: number;
  autoLoans: number;
  studentLoans: number;
  creditCards: number;
  personalLoans: number;
  otherDebts: number;
}

export interface DtiResult {
  totalMonthlyDebt: number;
  dtiRatio: number;
  remainingGrossIncome: number;
  annualGrossIncome: number;
}

export function calculateDti(input: DtiInput): DtiResult {
  const grossMonthlyIncome = Math.max(0, input.grossMonthlyIncome);
  const housingPayment = Math.max(0, input.housingPayment);
  const autoLoans = Math.max(0, input.autoLoans);
  const studentLoans = Math.max(0, input.studentLoans);
  const creditCards = Math.max(0, input.creditCards);
  const personalLoans = Math.max(0, input.personalLoans);
  const otherDebts = Math.max(0, input.otherDebts);

  const totalMonthlyDebt =
    housingPayment +
    autoLoans +
    studentLoans +
    creditCards +
    personalLoans +
    otherDebts;

  const dtiRatio =
    grossMonthlyIncome > 0 ? (totalMonthlyDebt / grossMonthlyIncome) * 100 : 0;

  return {
    totalMonthlyDebt,
    dtiRatio,
    remainingGrossIncome: Math.max(0, grossMonthlyIncome - totalMonthlyDebt),
    annualGrossIncome: grossMonthlyIncome * 12,
  };
}
