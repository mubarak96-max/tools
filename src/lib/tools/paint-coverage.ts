export type UnitSystem = "imperial" | "metric";
export type SurfaceType = "Drywall" | "Plaster" | "Masonry" | "Wood";
export type PaintType = "Latex" | "Oil-Based" | "Acrylic";

export interface PaintInputs {
  system: UnitSystem;
  length: number;
  width: number;
  height: number;
  paintCeiling: boolean;
  doors: number;
  windows: number;
  coats: number;
  surfaceType: SurfaceType;
  paintType: PaintType;
  pricePerUnit: number; // per gallon/liter
}

export interface PaintResult {
  totalArea: number; 
  paintAmount: number; 
  primerAmount: number;
  estimatedCost: number;
}

const COVERAGE_RATES = {
  imperial: 350, // base sq ft per gallon
  metric: 10,    // base sq m per liter
};

const SURFACE_MULTIPLIERS: Record<SurfaceType, number> = {
  Drywall: 1.0,
  Plaster: 0.85,  // absorbs more
  Masonry: 0.7,   // very porous
  Wood: 0.9,      // moderate absorption
};

const PAINT_MODIFIERS: Record<PaintType, number> = {
  Latex: 1.0,
  "Oil-Based": 1.15, // often thicker coverage
  Acrylic: 1.05,
};

export function calculatePaintCoverage(inputs: PaintInputs): PaintResult {
  let wallArea = 2 * (inputs.length + inputs.width) * inputs.height;
  let ceilingArea = inputs.paintCeiling ? (inputs.length * inputs.width) : 0;
  
  let doorDeduction = inputs.system === "imperial" ? inputs.doors * 21 : inputs.doors * 2;
  let windowDeduction = inputs.system === "imperial" ? inputs.windows * 15 : inputs.windows * 1.4;

  let baseRatio = inputs.system === "imperial" ? COVERAGE_RATES.imperial : COVERAGE_RATES.metric;
  let adjustedRatio = baseRatio * SURFACE_MULTIPLIERS[inputs.surfaceType] * PAINT_MODIFIERS[inputs.paintType];

  let netArea = wallArea + ceilingArea - doorDeduction - windowDeduction;
  if (netArea < 0) netArea = 0;

  // Single coat paintable area
  let singleCoatArea = netArea;
  
  // Total area including coats
  let totalArea = singleCoatArea * inputs.coats;
  
  let paintAmount = totalArea / adjustedRatio;
  
  // Primer is usually needed for 1 coat equivalent on fresh/porous surfaces
  // We'll estimate primer as 1 coat worth of paintable area, slightly less efficient
  let primerAmount = singleCoatArea / (adjustedRatio * 0.8); 

  return {
    totalArea,
    paintAmount,
    primerAmount,
    estimatedCost: paintAmount * inputs.pricePerUnit,
  };
}
