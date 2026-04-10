export interface ProbabilityBasicInput {
  favorableOutcomes: number;
  totalOutcomes: number;
}

export interface ProbabilityCombinatoricsInput {
  n: number;
  r: number;
}

export interface BinomialInput {
  trials: number;
  successes: number;
  successProbabilityPercent: number;
}

function normalize(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function factorial(value: number) {
  const safeValue = Math.floor(normalize(value));
  let result = 1;
  for (let current = 2; current <= safeValue; current += 1) {
    result *= current;
  }
  return result;
}

export function calculateBasicProbability(input: ProbabilityBasicInput) {
  const favorableOutcomes = normalize(input.favorableOutcomes);
  const totalOutcomes = normalize(input.totalOutcomes);

  if (totalOutcomes <= 0) {
    return { probability: 0, complement: 0 };
  }

  const probability = favorableOutcomes / totalOutcomes;
  return {
    probability,
    complement: 1 - probability,
  };
}

export function calculatePermutation(input: ProbabilityCombinatoricsInput) {
  const n = Math.floor(normalize(input.n));
  const r = Math.floor(normalize(input.r));

  if (r > n) {
    return 0;
  }

  return factorial(n) / factorial(n - r);
}

export function calculateCombination(input: ProbabilityCombinatoricsInput) {
  const n = Math.floor(normalize(input.n));
  const r = Math.floor(normalize(input.r));

  if (r > n) {
    return 0;
  }

  return factorial(n) / (factorial(r) * factorial(n - r));
}

export function calculateBinomialProbability(input: BinomialInput) {
  const trials = Math.floor(normalize(input.trials));
  const successes = Math.floor(normalize(input.successes));
  const successProbability = normalize(input.successProbabilityPercent) / 100;

  if (successes > trials || successProbability > 1) {
    return 0;
  }

  return (
    calculateCombination({ n: trials, r: successes }) *
    Math.pow(successProbability, successes) *
    Math.pow(1 - successProbability, trials - successes)
  );
}
