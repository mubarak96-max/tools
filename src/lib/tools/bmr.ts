export type Gender = "male" | "female";

export interface BMRInputs {
  gender: Gender;
  weight: number; // in kg
  height: number; // in cm
  age: number;
}

/**
 * Calculates BMR using the Mifflin-St Jeor Equation, which is considered the most 
 * accurate for the general population.
 */
export function calculateBMR(inputs: BMRInputs): number {
  const { gender, weight, height, age } = inputs;
  
  if (gender === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

export type ActivityLevel = 
  | "sedentary"     // 1.2
  | "light"         // 1.375
  | "moderate"      // 1.55
  | "active"        // 1.725
  | "very-active";  // 1.9

export interface TDEEInputs extends BMRInputs {
  activityLevel: ActivityLevel;
}

export function calculateTDEE(inputs: TDEEInputs): number {
  const bmr = calculateBMR(inputs);
  const multipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    "very-active": 1.9,
  };
  
  return bmr * multipliers[inputs.activityLevel];
}
