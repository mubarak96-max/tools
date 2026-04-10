export interface RoiInput {
  initialInvestment: number;
  finalValue: number;
  additionalCosts: number;
  yearsHeld: number;
}

export interface RoiResult {
  totalCostBasis: number;
  netProfit: number;
  roiPercent: number;
  totalReturnMultiple: number;
  annualizedReturnPercent: number | null;
}

function normalize(value: number) {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRoi(input: RoiInput): RoiResult {
  const initialInvestment = Math.max(0, normalize(input.initialInvestment));
  const finalValue = Math.max(0, normalize(input.finalValue));
  const additionalCosts = Math.max(0, normalize(input.additionalCosts));
  const yearsHeld = Math.max(0, normalize(input.yearsHeld));
  const totalCostBasis = initialInvestment + additionalCosts;
  const netProfit = finalValue - totalCostBasis;
  const roiPercent = totalCostBasis > 0 ? (netProfit / totalCostBasis) * 100 : 0;
  const totalReturnMultiple = totalCostBasis > 0 ? finalValue / totalCostBasis : 0;

  let annualizedReturnPercent: number | null = null;
  if (totalCostBasis > 0 && finalValue > 0 && yearsHeld > 0) {
    annualizedReturnPercent =
      (Math.pow(finalValue / totalCostBasis, 1 / yearsHeld) - 1) * 100;
  }

  return {
    totalCostBasis,
    netProfit,
    roiPercent,
    totalReturnMultiple,
    annualizedReturnPercent,
  };
}
