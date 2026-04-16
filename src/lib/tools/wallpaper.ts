export type UnitSystem = "imperial" | "metric";
export type WallpaperStandard = "US Single" | "US Double" | "European (52cm)" | "Wide Width (70cm)";

export interface WallpaperInputs {
  system: UnitSystem;
  roomPerimeter: number;
  roomHeight: number;
  rollWidth: number;
  rollLength: number;
  patternRepeat: number; 
  doors: number;
  windows: number;
  pricePerRoll: number;
  wastePercent: number;
}

export interface WallpaperResult {
  wallArea: number;
  netWallArea: number;
  usableRollArea: number;
  stripsPerRoll: number;
  totalStripsNeeded: number;
  rollsNeeded: number;
  estimatedCost: number;
}

export function calculateWallpaper(inputs: WallpaperInputs): WallpaperResult {
  const wallArea = inputs.roomPerimeter * inputs.roomHeight;
  
  // Deductions
  const doorArea = inputs.system === "imperial" ? inputs.doors * 21 : inputs.doors * 2;
  const windowArea = inputs.system === "imperial" ? inputs.windows * 15 : inputs.windows * 1.4;
  const netWallArea = Math.max(0, wallArea - doorArea - windowArea);

  let rollWidFT = 0;
  let repeatFT = 0;
  
  if (inputs.system === "imperial") {
    rollWidFT = inputs.rollWidth / 12;
    repeatFT = inputs.patternRepeat / 12; 
  } else {
    rollWidFT = inputs.rollWidth / 100;
    repeatFT = inputs.patternRepeat / 100;
  }

  // Number of strips to cover perimeter
  const totalStripsNeeded = rollWidFT > 0 ? Math.ceil(inputs.roomPerimeter / rollWidFT) : 0;

  // Length needed for one strip including pattern alignment
  const lengthPerStrip = inputs.roomHeight + repeatFT;

  // How many strips per roll?
  const stripsPerRoll = lengthPerStrip > 0 ? Math.floor(inputs.rollLength / lengthPerStrip) : 0;

  let baseRolls = stripsPerRoll > 0 ? Math.ceil(totalStripsNeeded / stripsPerRoll) : 0;
  
  // Add safety waste factor
  const wasteMultiplier = 1 + (inputs.wastePercent / 100);
  const rollsNeeded = Math.ceil(baseRolls * wasteMultiplier);

  return {
    wallArea,
    netWallArea,
    usableRollArea: stripsPerRoll * rollWidFT * inputs.roomHeight,
    stripsPerRoll,
    totalStripsNeeded,
    rollsNeeded,
    estimatedCost: rollsNeeded * inputs.pricePerRoll,
  };
}

export const ROLL_PRESETS: Record<WallpaperStandard, { w: number, l: number }> = {
  "US Single": { w: 27, l: 13.5 },
  "US Double": { w: 27, l: 27 },
  "European (52cm)": { w: 20.5, l: 33 },
  "Wide Width (70cm)": { w: 27.5, l: 16.5 },
};
