export type UnitSystem = "imperial" | "metric";

export interface Rectangle {
  id: string;
  name: string;
  length: number;
  width: number;
}

export interface RoomAreaInputs {
  system: UnitSystem;
  
  // Base Room
  baseLength: number;
  baseWidth: number;
  
  // Modifications
  additions: Rectangle[];
  deductions: Rectangle[];
}

export interface RoomAreaResult {
  baseArea: number;
  addedArea: number;
  deductedArea: number;
  totalArea: number; // net final area
}

export function calculateRoomArea(inputs: RoomAreaInputs): RoomAreaResult {
  const baseArea = inputs.baseLength * inputs.baseWidth;
  
  let addedArea = 0;
  for (const rect of inputs.additions) {
    addedArea += (rect.length * rect.width);
  }
  
  let deductedArea = 0;
  for (const rect of inputs.deductions) {
    deductedArea += (rect.length * rect.width);
  }
  
  const totalArea = baseArea + addedArea - deductedArea;
  
  return {
    baseArea,
    addedArea,
    deductedArea,
    totalArea: totalArea > 0 ? totalArea : 0
  };
}
