export type UnitSystem = "imperial" | "metric";

export interface RoofingInputs {
  system: UnitSystem;
  baseLength: number;
  baseWidth: number;
  pitchRise: number; // e.g., 4 or 6 (for 4/12 or 6/12 pitch)
  overhang: number; // e.g., 1.5 ft overhang on all sides
}

export interface RoofingResult {
  baseArea: number;
  pitchMultiplier: number;
  roofArea: number;
  squares: number; // 1 square = 100 sq ft or approx. 9.29 sq m
  bundles: number; // typically 3 bundles per square
}

export function calculateRoofing(inputs: RoofingInputs): RoofingResult {
  // If base dimensions are given, add overhang to all 4 sides. 
  // Length + 2*overhang, Width + 2*overhang
  const totalLength = inputs.baseLength + (inputs.overhang * 2);
  const totalWidth = inputs.baseWidth + (inputs.overhang * 2);
  
  const baseArea = totalLength * totalWidth;

  // The pitch multiplier is calculated using the Pythagorean theorem where run is always 12 (in imperial)
  // Multiplier = sqrt(run^2 + rise^2) / run
  // A standard rule is that 12 is the denominator, so sqrt(12^2 + pitchRise^2) / 12
  const pitchMultiplier = Math.sqrt(Math.pow(12, 2) + Math.pow(inputs.pitchRise, 2)) / 12;

  const roofArea = baseArea * pitchMultiplier;
  
  let squares = 0;
  if(inputs.system === "imperial") {
    // 1 Square = 100 sq ft
    squares = roofArea / 100;
  } else {
    // 1 Square approx 9.29 sq m
    squares = roofArea / 9.2903;
  }

  // Multiply by a 10% waste factor
  const totalSquaresWithWaste = squares * 1.10;
  
  // Standard 3-tab or architectural shingles typically require 3 bundles per square
  const bundles = Math.ceil(totalSquaresWithWaste * 3);

  return {
    baseArea,
    pitchMultiplier,
    roofArea,
    squares: Math.ceil(totalSquaresWithWaste),
    bundles
  };
}
