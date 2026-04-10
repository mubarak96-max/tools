export interface TipInput {
  billAmount: number;
  tipPercent: number;
  splitCount: number;
}

export interface TipResult {
  tipAmount: number;
  totalAmount: number;
  tipPerPerson: number;
  totalPerPerson: number;
}

function normalize(value: number, fallback = 0) {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(0, value);
}

export function calculateTip(input: TipInput): TipResult {
  const billAmount = normalize(input.billAmount);
  const tipPercent = normalize(input.tipPercent);
  const splitCount = Math.max(1, Math.round(normalize(input.splitCount, 1)));
  const tipAmount = (billAmount * tipPercent) / 100;
  const totalAmount = billAmount + tipAmount;

  return {
    tipAmount,
    totalAmount,
    tipPerPerson: tipAmount / splitCount,
    totalPerPerson: totalAmount / splitCount,
  };
}
