export interface NetWorthInput {
  cash: number;
  investments: number;
  retirementAccounts: number;
  property: number;
  vehicles: number;
  otherAssets: number;
  mortgage: number;
  creditCards: number;
  studentLoans: number;
  autoLoans: number;
  otherLiabilities: number;
}

export interface NetWorthResult {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  liquidAssets: number;
  debtToAssetsRatio: number;
}

function normalize(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function calculateNetWorth(input: NetWorthInput): NetWorthResult {
  const cash = normalize(input.cash);
  const investments = normalize(input.investments);
  const retirementAccounts = normalize(input.retirementAccounts);
  const property = normalize(input.property);
  const vehicles = normalize(input.vehicles);
  const otherAssets = normalize(input.otherAssets);
  const mortgage = normalize(input.mortgage);
  const creditCards = normalize(input.creditCards);
  const studentLoans = normalize(input.studentLoans);
  const autoLoans = normalize(input.autoLoans);
  const otherLiabilities = normalize(input.otherLiabilities);

  const totalAssets =
    cash +
    investments +
    retirementAccounts +
    property +
    vehicles +
    otherAssets;
  const totalLiabilities =
    mortgage +
    creditCards +
    studentLoans +
    autoLoans +
    otherLiabilities;

  return {
    totalAssets,
    totalLiabilities,
    netWorth: totalAssets - totalLiabilities,
    liquidAssets: cash + investments,
    debtToAssetsRatio: totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0,
  };
}
