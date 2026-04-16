export type UnitSystem = "imperial" | "metric";
export type MasonryUnit = "Standard Brick" | "Modular Brick" | "Jumbo Brick" | "Cinder Block (8x8x16)" | "Half Block" | "Metric Standard";

export interface BrickInputs {
  system: UnitSystem;
  wallLength: number;
  wallHeight: number;
  brickLength: number;
  brickHeight: number;
  brickDepth: number; // for mortar volume
  mortarThickness: number; 
  wastePercent: number;
  unitType: MasonryUnit;
  pricePerUnit: number;
}

export interface BrickResult {
  wallArea: number;
  effectiveBrickArea: number; 
  bricksNeeded: number;
  mortarVolume: number; // in cubic feet or cubic meters
  mortarBags: number; // 60lb bags estimate
  estimatedCost: number;
}

export function calculateBrickQuantity(inputs: BrickInputs): BrickResult {
  const wallArea = inputs.wallLength * inputs.wallHeight;
  
  let effBrickLength = 0;
  let effBrickHeight = 0;
  
  if (inputs.system === "imperial") {
    effBrickLength = (inputs.brickLength + inputs.mortarThickness) / 12;
    effBrickHeight = (inputs.brickHeight + inputs.mortarThickness) / 12;
  } else {
    effBrickLength = (inputs.brickLength + inputs.mortarThickness) / 100;
    effBrickHeight = (inputs.brickHeight + inputs.mortarThickness) / 100;
  }

  const effectiveBrickArea = effBrickLength * effBrickHeight;
  const rawBricks = effectiveBrickArea > 0 ? wallArea / effectiveBrickArea : 0;
  const wasteMultiplier = 1 + (inputs.wastePercent / 100);
  const bricksNeeded = Math.ceil(rawBricks * wasteMultiplier);

  // Mortar estimation: roughly (Total Area - (Number of Bricks * Actual Face Area)) * Depth
  // Simplified rule of thumb for standard bricks: ~0.5 cu ft per 100 bricks at 3/8" joint
  let mortarVolume = 0;
  if (inputs.system === "imperial") {
    // Volume in cubic feet
    const actualArea = (inputs.brickLength * inputs.brickHeight) / 144;
    const jointArea = effectiveBrickArea - actualArea;
    mortarVolume = jointArea * (inputs.brickDepth / 12) * rawBricks;
  } else {
    // Volume in cubic meters
    const actualArea = (inputs.brickLength * inputs.brickHeight) / 10000;
    const jointArea = effectiveBrickArea - actualArea;
    mortarVolume = jointArea * (inputs.brickDepth / 100) * rawBricks;
  }

  // 1 standard 60lb mortar bag yields approx 0.45 cubic feet
  const mortarBags = inputs.system === "imperial" 
    ? Math.ceil(mortarVolume / 0.45) 
    : Math.ceil(mortarVolume / 0.0127); // approx conversion

  return {
    wallArea,
    effectiveBrickArea,
    bricksNeeded,
    mortarVolume,
    mortarBags,
    estimatedCost: bricksNeeded * inputs.pricePerUnit,
  };
}
