export type UnitSystem = "imperial" | "metric";
export type MaterialType = "gravel" | "mulch" | "soil";

export interface GravelMulchInputs {
  system: UnitSystem;
  material: MaterialType;
  
  lengthFt: number;
  lengthIn: number;
  widthFt: number;
  widthIn: number;
  depthIn: number;
  
  lengthM: number;
  widthM: number;
  depthCm: number;
}

export interface GravelMulchResult {
  cubicYards: number;
  cubicMeters: number;
  cubicFeet: number;
  tons: number; // estimated weight
  pounds: number;
  kilograms: number;
}

export function calculateGravelMulch(inputs: GravelMulchInputs): GravelMulchResult {
  let cubicFeet = 0;
  let cubicMeters = 0;

  if (inputs.system === "imperial") {
    const l = inputs.lengthFt + inputs.lengthIn / 12;
    const w = inputs.widthFt + inputs.widthIn / 12;
    const d = inputs.depthIn / 12;

    cubicFeet = l * w * d;
    cubicMeters = cubicFeet * 0.0283168; 
  } else {
    // Metric
    const l = inputs.lengthM;
    const w = inputs.widthM;
    const d = inputs.depthCm / 100;

    cubicMeters = l * w * d;
    cubicFeet = cubicMeters / 0.0283168;
  }

  const cubicYards = cubicFeet / 27;

  // Approximate densities per cubic yard in tons
  const densities: Record<MaterialType, { tonsPerYd: number; kgPerCbm: number }> = {
    gravel: { tonsPerYd: 1.35, kgPerCbm: 1602 },   // Crushed stone ~2700 lbs/yd
    soil: { tonsPerYd: 1.1, kgPerCbm: 1305 },      // Topsoil ~2200 lbs/yd
    mulch: { tonsPerYd: 0.4, kgPerCbm: 474 },      // Wood mulch ~800 lbs/yd
  };

  const selectedDensity = densities[inputs.material];
  
  const totalTons = cubicYards * selectedDensity.tonsPerYd;
  const totalLbs = totalTons * 2000;
  const totalKg = cubicMeters * selectedDensity.kgPerCbm;

  return {
    cubicYards: cubicYards,
    cubicMeters: cubicMeters,
    cubicFeet: cubicFeet,
    tons: totalTons,
    pounds: totalLbs,
    kilograms: totalKg,
  };
}
