export type ConcreteShape = "slab" | "column";
export type UnitSystem = "imperial" | "metric";

export interface ConcreteInputs {
  shape: ConcreteShape;
  system: UnitSystem;
  
  // Imperial
  lengthFt: number;
  lengthIn: number;
  widthFt: number;
  widthIn: number;
  depthIn: number; // usually depth is just in inches for slabs
  diameterIn: number;
  
  // Metric
  lengthM: number;
  widthM: number;
  depthCm: number;
  diameterCm: number;
  
  quantity: number;
}

export interface ConcreteResult {
  cubicYards: number;
  cubicMeters: number;
  cubicFeet: number;
  bags80lb: number; // 0.60 cu ft
  bags60lb: number; // 0.45 cu ft
  bags40lb: number; // 0.30 cu ft
  bags25kg: number; // 0.011 cu m
  bags20kg: number; // 0.009 cu m
}

export function calculateConcrete(inputs: ConcreteInputs): ConcreteResult {
  let cubicFeet = 0;
  let cubicMeters = 0;

  if (inputs.system === "imperial") {
    const l = inputs.lengthFt + inputs.lengthIn / 12;
    const w = inputs.widthFt + inputs.widthIn / 12;
    const d = inputs.depthIn / 12; // depth primarily in inches
    const diam = inputs.diameterIn / 12;

    if (inputs.shape === "slab") {
      cubicFeet = l * w * d * inputs.quantity;
    } else if (inputs.shape === "column") {
      const radius = diam / 2;
      cubicFeet = Math.PI * radius * radius * d * inputs.quantity;
    }
    
    cubicMeters = cubicFeet * 0.0283168; // exact conversion
  } else {
    // Metric
    const l = inputs.lengthM;
    const w = inputs.widthM;
    const d = inputs.depthCm / 100;
    const diam = inputs.diameterCm / 100;

    if (inputs.shape === "slab") {
      cubicMeters = l * w * d * inputs.quantity;
    } else if (inputs.shape === "column") {
      const radius = diam / 2;
      cubicMeters = Math.PI * radius * radius * d * inputs.quantity;
    }
    
    cubicFeet = cubicMeters / 0.0283168;
  }

  const cubicYards = cubicFeet / 27;

  // Add 5% waste factor for bags calculation as an industry standard
  const wasteFactor = 1.05;
  const cfWithWaste = cubicFeet * wasteFactor;
  const cmWithWaste = cubicMeters * wasteFactor;

  return {
    cubicYards: cubicYards,
    cubicMeters: cubicMeters,
    cubicFeet: cubicFeet,
    // standard pre-mixed concrete yields
    bags80lb: Math.ceil(cfWithWaste / 0.60),
    bags60lb: Math.ceil(cfWithWaste / 0.45),
    bags40lb: Math.ceil(cfWithWaste / 0.30),
    bags25kg: Math.ceil(cmWithWaste / 0.011),
    bags20kg: Math.ceil(cmWithWaste / 0.009),
  };
}
