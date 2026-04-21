export type ConcreteShape = "slab" | "column" | "stairs";
export type UnitSystem = "imperial" | "metric";

export interface ConcreteInputs {
  shape: ConcreteShape;
  system: UnitSystem;
  
  // Imperial
  lengthFt: number;
  lengthIn: number;
  widthFt: number;
  widthIn: number;
  depthIn: number;
  diameterIn: number;
  
  // Stairs specific
  numSteps?: number;
  stepRiseIn?: number;
  stepRunIn?: number;
  stepWidthFt?: number;

  // Metric
  lengthM: number;
  widthM: number;
  depthCm: number;
  diameterCm: number;
  
  // Metric Stairs
  stepRiseCm?: number;
  stepRunCm?: number;
  stepWidthM?: number;

  quantity: number;
  wasteFactor: number; // percentage
  pricePerUnit: number;
}

export interface ConcreteResult {
  cubicYards: number;
  cubicMeters: number;
  cubicFeet: number;
  bags80lb: number;
  bags60lb: number;
  bags40lb: number;
  bags25kg: number;
  bags20kg: number;
  estimatedCost: number;
}

export function calculateConcrete(inputs: ConcreteInputs): ConcreteResult {
  let cubicFeet = 0;
  let cubicMeters = 0;

  if (inputs.system === "imperial") {
    const d = inputs.depthIn / 12;

    if (inputs.shape === "slab") {
      const l = inputs.lengthFt + inputs.lengthIn / 12;
      const w = inputs.widthFt + inputs.widthIn / 12;
      cubicFeet = l * w * d;
    } else if (inputs.shape === "column") {
      const radius = (inputs.diameterIn / 12) / 2;
      cubicFeet = Math.PI * radius * radius * d;
    } else if (inputs.shape === "stairs") {
      const n = inputs.numSteps || 1;
      const rise = (inputs.stepRiseIn || 7) / 12;
      const run = (inputs.stepRunIn || 11) / 12;
      const width = inputs.stepWidthFt || 3;
      // Volume = Width * Sum of step volumes
      // Step k volume = Width * Run * (k * Rise)
      for (let i = 1; i <= n; i++) {
        cubicFeet += width * run * (i * rise);
      }
    }
    
    cubicFeet *= inputs.quantity;
    cubicMeters = cubicFeet * 0.0283168;
  } else {
    // Metric
    const d = inputs.depthCm / 100;

    if (inputs.shape === "slab") {
      const l = inputs.lengthM;
      const w = inputs.widthM;
      cubicMeters = l * w * d;
    } else if (inputs.shape === "column") {
      const radius = (inputs.diameterCm / 100) / 2;
      cubicMeters = Math.PI * radius * radius * d;
    } else if (inputs.shape === "stairs") {
      const n = inputs.numSteps || 1;
      const rise = (inputs.stepRiseCm || 18) / 100;
      const run = (inputs.stepRunCm || 28) / 100;
      const width = inputs.stepWidthM || 1;
      for (let i = 1; i <= n; i++) {
        cubicMeters += width * run * (i * rise);
      }
    }
    
    cubicMeters *= inputs.quantity;
    cubicFeet = cubicMeters / 0.0283168;
  }

  const cubicYards = cubicFeet / 27;
  const multiplier = 1 + (inputs.wasteFactor / 100);
  const cfWithWaste = cubicFeet * multiplier;
  const cmWithWaste = cubicMeters * multiplier;

  return {
    cubicYards,
    cubicMeters,
    cubicFeet,
    bags80lb: Math.ceil(cfWithWaste / 0.60),
    bags60lb: Math.ceil(cfWithWaste / 0.45),
    bags40lb: Math.ceil(cfWithWaste / 0.30),
    bags25kg: Math.ceil(cmWithWaste / 0.011),
    bags20kg: Math.ceil(cmWithWaste / 0.009),
    estimatedCost: cubicYards * inputs.pricePerUnit,
  };
}
