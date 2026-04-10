export interface OneRepMaxInputs {
  weight: number;
  reps: number;
}

export interface OneRepMaxResult {
  oneRepMax: number;
  percentages: { percentage: number; weight: number }[];
}

/**
 * Calculates 1RM using the Brzycki Formula: Weight / (1.0278 - (0.0278 * Reps))
 * This is generally considered accurate for reps under 10.
 */
export function calculateOneRepMax(inputs: OneRepMaxInputs): OneRepMaxResult {
  const { weight, reps } = inputs;
  
  if (reps <= 0) return { oneRepMax: 0, percentages: [] };
  if (reps === 1) return { 
    oneRepMax: weight, 
    percentages: generatePercentages(weight) 
  };

  const oneRepMax = weight / (1.0278 - (0.0278 * reps));
  
  return {
    oneRepMax,
    percentages: generatePercentages(oneRepMax)
  };
}

function generatePercentages(max: number) {
  const p = [100, 95, 90, 85, 80, 75, 70, 65, 60, 50];
  return p.map(pct => ({
    percentage: pct,
    weight: max * (pct / 100)
  }));
}
