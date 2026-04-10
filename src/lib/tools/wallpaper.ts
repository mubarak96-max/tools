export type UnitSystem = "imperial" | "metric";

export interface WallpaperInputs {
  system: UnitSystem;
  roomPerimeter: number;
  roomHeight: number;
  
  rollWidth: number;
  rollLength: number;
  
  patternRepeat: number; // e.g. 18 inch repeat
}

export interface WallpaperResult {
  wallArea: number;
  singleRollArea: number;
  stripsPerRoll: number;
  totalStripsNeeded: number;
  rollsNeeded: number;
}

export function calculateWallpaper(inputs: WallpaperInputs): WallpaperResult {
  // A strict professional method vs a simple area method.
  // The professional method calculates how many usable strips you get per roll,
  // and how many strips it takes to cover the perimeter.

  let wallArea = inputs.roomPerimeter * inputs.roomHeight;
  
  let rollWidthConverted = inputs.rollWidth;
  let patternRepeatConverted = inputs.patternRepeat;
  
  if (inputs.system === "imperial") {
    // Width & Repeat are likely given in INCHES. Perimeter, Height, and RollLength in FEET.
    rollWidthConverted = inputs.rollWidth / 12; // converting inches to feet
    patternRepeatConverted = inputs.patternRepeat / 12; 
  } else {
    // Width & Repeat are likely given in CM. Perimeter, Height, and RollLength in METERS.
    rollWidthConverted = inputs.rollWidth / 100;
    patternRepeatConverted = inputs.patternRepeat / 100;
  }

  const singleRollArea = rollWidthConverted * inputs.rollLength;

  // Total width to cover = perimeter. 
  // Strips needed to cover perimeter = ceil(Perimeter / Strip Width)
  const totalStripsNeeded = rollWidthConverted > 0 ? Math.ceil(inputs.roomPerimeter / rollWidthConverted) : 0;

  // Length of one strip = Room Height + Pattern Repeat (to allow alignment)
  const lengthPerStrip = inputs.roomHeight + patternRepeatConverted;

  // How many such strips can we cut from ONE roll?
  const stripsPerRoll = lengthPerStrip > 0 ? Math.floor(inputs.rollLength / lengthPerStrip) : 0;

  // Total rolls needed
  let rollsNeeded = 0;
  if(stripsPerRoll > 0) {
    rollsNeeded = Math.ceil(totalStripsNeeded / stripsPerRoll);
  }

  return {
    wallArea,
    singleRollArea,
    stripsPerRoll,
    totalStripsNeeded,
    rollsNeeded
  };
}
