export type UnitSystem = "imperial" | "metric";
export type FlooringMaterial = "Hardwood" | "LVP" | "Laminate" | "Tile" | "Vinyl" | "Carpet";
export type FloorType = FlooringMaterial;
export type LayoutPattern = "Straight" | "Diagonal" | "Herringbone";

export interface FlooringInputs {
  system: UnitSystem;
  length: number;
  width: number;
  wastePercent?: number;
  boxCoverage?: number;
  material?: FlooringMaterial;
  customWaste?: number;
  boxSize?: number;
  materialType?: FloorType;
  pattern?: LayoutPattern;
  pricePerUnit: number; // per sq ft or sq m
}

export interface FlooringResult {
  netArea: number;
  grossArea: number;
  totalArea: number;
  boxesNeeded: number;
  boxesRequired: number;
  estimatedCost: number;
}

export function calculateFlooring(inputs: FlooringInputs): FlooringResult {
  const area = inputs.length * inputs.width;
  const wastePercent = inputs.customWaste ?? inputs.wastePercent ?? 0;
  const boxCoverage = inputs.boxSize ?? inputs.boxCoverage ?? 0;
  const wasteMultiplier = 1 + (wastePercent / 100);
  const totalArea = area * wasteMultiplier;

  const boxes = boxCoverage > 0 ? Math.ceil(totalArea / boxCoverage) : 0;

  return {
    netArea: area,
    grossArea: totalArea,
    totalArea,
    boxesNeeded: boxes,
    boxesRequired: boxes,
    estimatedCost: totalArea * inputs.pricePerUnit,
  };
}
