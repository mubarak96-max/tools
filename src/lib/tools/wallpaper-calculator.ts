export interface WallpaperInputs {
  wallWidth: number;
  wallHeight: number;
  rollWidth: number;
  rollLength: number;
  patternRepeat: number;
  waste: number;
  pricePerRoll: number;
}

export interface WallpaperResult {
  totalDrops: number;
  totalRolls: number;
  estimatedCost: number;
  squareFootage: number;
  usableRollLength: number;
}

/**
 * Calculates wallpaper based on vertical strip (drop) count
 * rather than simple area to account for pattern matching waste.
 */
export function calculateWallpaper(inputs: WallpaperInputs): WallpaperResult {
  const {
    wallWidth,
    wallHeight,
    rollWidth,
    rollLength,
    patternRepeat,
    waste,
    pricePerRoll,
  } = inputs;

  // 1. Calculate how many drops (vertical strips) are needed across the width
  // Roll width is usually in inches, wall width in feet.
  const wallWidthInches = wallWidth * 12;
  const totalDrops = Math.ceil(wallWidthInches / rollWidth);

  // 2. Calculate usable height per drop
  // We need to add a safety margin (e.g. 2-4 inches) for trimming top/bottom
  const safetyTrimInches = 4;
  const requiredHeightPerDrop = wallHeight * 12 + safetyTrimInches;

  // If there's a pattern repeat, we must account for it
  let adjustedHeightPerDrop = requiredHeightPerDrop;
  if (patternRepeat > 0) {
    // Every drop (except maybe the first) needs to align with the pattern
    // This is the number of full repeats needed to cover the wall height
    const repeatsPerHeight = Math.ceil(requiredHeightPerDrop / patternRepeat);
    adjustedHeightPerDrop = repeatsPerHeight * patternRepeat;
  }

  const adjustedHeightInFeet = adjustedHeightPerDrop / 12;

  // 3. How many drops can we get per roll?
  const dropsPerRoll = Math.floor(rollLength / adjustedHeightInFeet);

  if (dropsPerRoll <= 0) {
    // High ceiling or large repeat case
    return {
      totalDrops,
      totalRolls: totalDrops, // 1 roll per drop
      estimatedCost: totalDrops * pricePerRoll,
      squareFootage: wallWidth * wallHeight,
      usableRollLength: 0
    };
  }

  // 4. Calculate total rolls needed
  let totalRolls = Math.ceil(totalDrops / dropsPerRoll);

  // 5. Apply general waste factor (extra rolls for mistakes/future repairs)
  if (waste > 0) {
    const wasteMultiplier = 1 + (waste / 100);
    totalRolls = Math.ceil(totalRolls * wasteMultiplier);
  }

  return {
    totalDrops,
    totalRolls,
    estimatedCost: totalRolls * pricePerRoll,
    squareFootage: wallWidth * wallHeight,
    usableRollLength: dropsPerRoll * adjustedHeightInFeet
  };
}
