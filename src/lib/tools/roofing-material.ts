export type UnitSystem = "imperial" | "metric";
export type ShingleProfile = "3-Tab" | "Architectural" | "Luxury" | "Wood Shake" | "Metal Panel";
export type RoofingMaterialType = "Asphalt" | "Metal" | "Tile" | "Wood";

export interface RoofingInputs {
  system?: UnitSystem;
  baseLength?: number;
  baseWidth?: number;
  pitchRise?: number;
  overhang?: number;
  wastePercent?: number;
  profile?: ShingleProfile;
  pricePerSquare?: number;
  length?: number;
  width?: number;
  pitch?: number;
  waste?: number;
  materialType?: RoofingMaterialType;
  bundlesPerSq?: number;
  pricePerSq?: number;
}

export interface RoofingResult {
  totalLength: number;
  totalWidth: number;
  perimeter: number;
  baseArea: number;
  pitchMultiplier: number;
  roofArea: number;
  roofAreaWithWaste: number;
  totalArea: number;
  squares: number;
  totalSquares: number;
  bundles: number;
  totalBundles: number;
  underlaymentRolls: number;
  ridgeCapLength: number;
  starterStripLength: number;
  dripEdgeLength: number;
  fastenerBoxes: number;
  estimatedCost: number;
}

const BUNDLES_PER_SQUARE: Record<ShingleProfile, number> = {
  "3-Tab": 3,
  Architectural: 3,
  Luxury: 4,
  "Wood Shake": 5,
  "Metal Panel": 1, // Sheets are usually 1 square per unit for estimation
};

export const PITCH_MULTIPLIERS: Record<number, number> = Object.fromEntries(
  Array.from({ length: 13 }, (_, pitch) => [
    pitch,
    Math.sqrt(Math.pow(12, 2) + Math.pow(pitch, 2)) / 12,
  ]),
) as Record<number, number>;

function normalizeProfile(materialType?: RoofingMaterialType): ShingleProfile {
  switch (materialType) {
    case "Metal":
      return "Metal Panel";
    case "Tile":
      return "Luxury";
    case "Wood":
      return "Wood Shake";
    default:
      return "Architectural";
  }
}

export function calculateRoofing(inputs: RoofingInputs): RoofingResult {
  const system = inputs.system ?? "imperial";
  const baseLength = inputs.baseLength ?? inputs.length ?? 0;
  const baseWidth = inputs.baseWidth ?? inputs.width ?? 0;
  const pitchRise = inputs.pitchRise ?? inputs.pitch ?? 0;
  const overhang = inputs.overhang ?? 0;
  const wastePercent = inputs.wastePercent ?? inputs.waste ?? 0;
  const profile = inputs.profile ?? normalizeProfile(inputs.materialType);
  const pricePerSquare = inputs.pricePerSquare ?? inputs.pricePerSq ?? 0;

  const totalLength = baseLength + (overhang * 2);
  const totalWidth = baseWidth + (overhang * 2);
  const perimeter = (totalLength * 2) + (totalWidth * 2);
  
  const baseArea = totalLength * totalWidth;
  const pitchMultiplier = PITCH_MULTIPLIERS[pitchRise] ?? (Math.sqrt(Math.pow(12, 2) + Math.pow(pitchRise, 2)) / 12);

  const roofArea = baseArea * pitchMultiplier;
  
  const conversionFactor = system === "imperial" ? 100 : 9.2903;
  let squaresCount = roofArea / conversionFactor;

  const wasteMultiplier = 1 + (wastePercent / 100);
  const totalSquaresWithWaste = squaresCount * wasteMultiplier;
  const roofAreaWithWaste = roofArea * wasteMultiplier;
  
  const bundlesPerSquare = inputs.bundlesPerSq ?? BUNDLES_PER_SQUARE[profile];
  const bundlesCount = Math.ceil(totalSquaresWithWaste * bundlesPerSquare);
  
  const underlaymentRolls = Math.ceil(roofAreaWithWaste / (system === "imperial" ? 400 : 37.16));
  const ridgeCapLength = totalLength; 
  const starterStripLength = perimeter;
  const dripEdgeLength = Math.ceil(perimeter * 1.05);
  const fastenerBoxes = Math.max(1, Math.ceil(totalSquaresWithWaste / 20));

  return {
    totalLength,
    totalWidth,
    perimeter,
    baseArea,
    pitchMultiplier,
    roofArea,
    roofAreaWithWaste,
    totalArea: roofAreaWithWaste,
    squares: Math.ceil(totalSquaresWithWaste),
    totalSquares: totalSquaresWithWaste,
    bundles: bundlesCount,
    totalBundles: bundlesCount,
    underlaymentRolls,
    ridgeCapLength,
    starterStripLength,
    dripEdgeLength,
    fastenerBoxes,
    estimatedCost: totalSquaresWithWaste * pricePerSquare,
  };
}
