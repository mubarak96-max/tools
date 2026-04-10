export interface BudgetPlannerInput {
  salaryIncome: number;
  sideIncome: number;
  otherIncome: number;
  housing: number;
  utilities: number;
  groceries: number;
  transport: number;
  insurance: number;
  debtPayments: number;
  savings: number;
  entertainment: number;
  otherExpenses: number;
}

export interface BudgetPlannerResult {
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  needsTotal: number;
  wantsTotal: number;
  savingsTotal: number;
  needsShare: number;
  wantsShare: number;
  savingsShare: number;
}

function normalize(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function calculateBudgetPlanner(input: BudgetPlannerInput): BudgetPlannerResult {
  const salaryIncome = normalize(input.salaryIncome);
  const sideIncome = normalize(input.sideIncome);
  const otherIncome = normalize(input.otherIncome);
  const housing = normalize(input.housing);
  const utilities = normalize(input.utilities);
  const groceries = normalize(input.groceries);
  const transport = normalize(input.transport);
  const insurance = normalize(input.insurance);
  const debtPayments = normalize(input.debtPayments);
  const savings = normalize(input.savings);
  const entertainment = normalize(input.entertainment);
  const otherExpenses = normalize(input.otherExpenses);

  const totalIncome = salaryIncome + sideIncome + otherIncome;
  const needsTotal =
    housing +
    utilities +
    groceries +
    transport +
    insurance +
    debtPayments;
  const wantsTotal = entertainment + otherExpenses;
  const savingsTotal = savings;
  const totalExpenses = needsTotal + wantsTotal + savingsTotal;

  return {
    totalIncome,
    totalExpenses,
    netCashFlow: totalIncome - totalExpenses,
    needsTotal,
    wantsTotal,
    savingsTotal,
    needsShare: totalIncome > 0 ? (needsTotal / totalIncome) * 100 : 0,
    wantsShare: totalIncome > 0 ? (wantsTotal / totalIncome) * 100 : 0,
    savingsShare: totalIncome > 0 ? (savingsTotal / totalIncome) * 100 : 0,
  };
}
