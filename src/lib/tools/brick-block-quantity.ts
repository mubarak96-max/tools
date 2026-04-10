export type UnitSystem = "imperial" | "metric";

export interface BrickInputs {
  system: UnitSystem;
  wallLength: number;
  wallHeight: number;
  
  brickLength: number;
  brickHeight: number;
  
  mortarThickness: number; // usually 0.375 inches or 1 cm
  wastePercent: number; // 5-10% is standard
}

export interface BrickResult {
  wallArea: number;
  effectiveBrickArea: number; // area including mortar
  bricksNeeded: number;
}

export function calculateBrickQuantity(inputs: BrickInputs): BrickResult {
  const wallArea = inputs.wallLength * inputs.wallHeight;
  
  // Brick dimensions should be in the same units as wall if we normalize properly.
  // Wait, normally Wall inputs are in FEET, but Brick inputs are in INCHES.
  // In Metric, Wall is in METERS, Brick is in CENTIMETERS.
  
  let effBrickLength = 0;
  let effBrickHeight = 0;
  
  if (inputs.system === "imperial") {
    // Convert inch dimensions to feet to match wall area (which is sq ft)
    effBrickLength = (inputs.brickLength + inputs.mortarThickness) / 12;
    effBrickHeight = (inputs.brickHeight + inputs.mortarThickness) / 12;
  } else {
    // Convert cm dimensions to meters to match wall area (which is sq m)
    effBrickLength = (inputs.brickLength + inputs.mortarThickness) / 100;
    effBrickHeight = (inputs.brickHeight + inputs.mortarThickness) / 100;
  }

  const effectiveBrickArea = effBrickLength * effBrickHeight;

  // Raw count
  const rawBricks = effectiveBrickArea > 0 ? wallArea / effectiveBrickArea : 0;
  
  // With waste
  const wasteMultiplier = 1 + (inputs.wastePercent / 100);
  const bricksNeeded = Math.ceil(rawBricks * wasteMultiplier);

  return {
    wallArea,
    effectiveBrickArea,
    bricksNeeded
  };
}
