export type UnitSystem = "imperial" | "metric";

export interface FlooringInputs {
  system: UnitSystem;
  length: number;
  width: number;
  wastePercent: number;
  boxCoverage: number; // Coverage per box in sq ft or sq m depending on system
}

export interface FlooringResult {
  netArea: number;
  grossArea: number; // with waste
  boxesNeeded: number;
}

export function calculateFlooring(inputs: FlooringInputs): FlooringResult {
  const area = inputs.length * inputs.width;
  const wasteMultiplier = 1 + (inputs.wastePercent / 100);
  const totalArea = area * wasteMultiplier;
  
  const boxes = inputs.boxCoverage > 0 ? Math.ceil(totalArea / inputs.boxCoverage) : 0;

  return {
    netArea: area,
    grossArea: totalArea,
    boxesNeeded: boxes,
  };
}
