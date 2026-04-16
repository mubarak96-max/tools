import {
  calculateBrickQuantity,
  type BrickInputs,
  type UnitSystem,
} from "@/lib/tools/brick-block-quantity";

export type { UnitSystem };

export type BrickType =
  | "Modular"
  | "Queen"
  | "King"
  | "Standard_Block"
  | "Utility_Block";

export type BondingPattern = "Running" | "Stack" | "Flemish";

export interface MasonryInputs {
  system: UnitSystem;
  wallLength: number;
  wallHeight: number;
  brickType: BrickType;
  jointSize: number;
  pattern: BondingPattern;
  waste: number;
  pricePerUnit: number;
}

export interface MasonryResult {
  wallArea: number;
  effectiveBrickArea: number;
  totalBricks: number;
  mortarVolume: number;
  mortarBags: number;
  estimatedCost: number;
}

const BRICK_DIMENSIONS: Record<
  BrickType,
  { unitType: BrickInputs["unitType"]; length: number; height: number; depth: number }
> = {
  Modular: {
    unitType: "Modular Brick",
    length: 7.625,
    height: 2.25,
    depth: 3.625,
  },
  Queen: {
    unitType: "Standard Brick",
    length: 7.625,
    height: 2.75,
    depth: 3,
  },
  King: {
    unitType: "Jumbo Brick",
    length: 9.625,
    height: 2.625,
    depth: 3,
  },
  Standard_Block: {
    unitType: "Cinder Block (8x8x16)",
    length: 15.625,
    height: 7.625,
    depth: 7.625,
  },
  Utility_Block: {
    unitType: "Half Block",
    length: 15.625,
    height: 7.625,
    depth: 3.625,
  },
};

function toMetricInCm(valueInInches: number) {
  return valueInInches * 2.54;
}

function getAdjustedWaste(waste: number, pattern: BondingPattern) {
  switch (pattern) {
    case "Flemish":
      return waste + 5;
    case "Stack":
      return waste + 2;
    default:
      return waste;
  }
}

export function calculateMasonry(inputs: MasonryInputs): MasonryResult {
  const dimensions = BRICK_DIMENSIONS[inputs.brickType];
  const isMetric = inputs.system === "metric";

  const result = calculateBrickQuantity({
    system: inputs.system,
    wallLength: inputs.wallLength,
    wallHeight: inputs.wallHeight,
    brickLength: isMetric ? toMetricInCm(dimensions.length) : dimensions.length,
    brickHeight: isMetric ? toMetricInCm(dimensions.height) : dimensions.height,
    brickDepth: isMetric ? toMetricInCm(dimensions.depth) : dimensions.depth,
    mortarThickness: isMetric ? toMetricInCm(inputs.jointSize) : inputs.jointSize,
    wastePercent: getAdjustedWaste(inputs.waste, inputs.pattern),
    unitType: dimensions.unitType,
    pricePerUnit: inputs.pricePerUnit,
  });

  return {
    wallArea: result.wallArea,
    effectiveBrickArea: result.effectiveBrickArea,
    totalBricks: result.bricksNeeded,
    mortarVolume: result.mortarVolume,
    mortarBags: result.mortarBags,
    estimatedCost: result.estimatedCost,
  };
}
