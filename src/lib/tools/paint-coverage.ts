export type UnitSystem = "imperial" | "metric";

export interface PaintInputs {
  system: UnitSystem;
  
  // Dimensions
  length: number;
  width: number;
  height: number;
  
  paintCeiling: boolean;
  doors: number;
  windows: number;
  coats: number;
}

export interface PaintResult {
  totalArea: number; // sq ft or sq meters
  paintAmount: number; // gallons or liters
}

export function calculatePaintCoverage(inputs: PaintInputs): PaintResult {
  // Industry standards
  // Imperial: 1 Gallon covers ~350-400 sq ft. We use a conservative 350 sq ft per gallon.
  // Metric: 1 Liter covers ~10-12 sq meters. We use a conservative 10 sq meters per liter.
  // Door: ~21 sq ft (imperial) or ~2 sq m (metric)
  // Window: ~15 sq ft (imperial) or ~1.4 sq m (metric)
  
  let wallArea = 2 * (inputs.length + inputs.width) * inputs.height;
  let ceilingArea = inputs.paintCeiling ? (inputs.length * inputs.width) : 0;
  
  let doorDeduction = 0;
  let windowDeduction = 0;
  let coverageRatio = 0;

  if (inputs.system === "imperial") {
    doorDeduction = inputs.doors * 21;
    windowDeduction = inputs.windows * 15;
    coverageRatio = 350; // sq ft per gallon
  } else {
    doorDeduction = inputs.doors * 2;
    windowDeduction = inputs.windows * 1.4;
    coverageRatio = 10; // sq meters per liter
  }

  // Calculate net area
  let netArea = wallArea + ceilingArea - doorDeduction - windowDeduction;
  if (netArea < 0) netArea = 0;

  let totalAreaToPaint = netArea * inputs.coats;
  
  let paintAmount = totalAreaToPaint / coverageRatio;

  return {
    totalArea: totalAreaToPaint,
    paintAmount: paintAmount
  };
}
