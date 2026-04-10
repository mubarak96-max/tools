export interface StaircaseInputs {
  totalRise: number; // in inches or cm
  targetRise: number; // in inches or cm (e.g., 7.5 in or 18 cm)
  targetRun: number; // in inches or cm (e.g., 10 in or 25 cm)
  system: "imperial" | "metric";
}

export interface StaircaseResult {
  stepCount: number;
  actualRise: number;
  actualRun: number;
  totalRun: number;
  stringerLength: number;
  angle: number;
}

export function calculateStaircase(inputs: StaircaseInputs): StaircaseResult {
  const { totalRise, targetRise, targetRun } = inputs;

  if (targetRise <= 0) {
    return {
      stepCount: 0,
      actualRise: 0,
      actualRun: 0,
      totalRun: 0,
      stringerLength: 0,
      angle: 0,
    };
  }

  // Calculate number of steps
  const stepCount = Math.ceil(totalRise / targetRise);

  // Actual rise for each step to hit the total rise perfectly
  const actualRise = totalRise / stepCount;

  // Actual run matches target run (usually constant)
  const actualRun = targetRun;

  // Total horizontal run calculation
  // Usually, stairs have (stepCount - 1) treads if the top tread is one level below the top floor
  const horizontalRun = actualRun * (stepCount - 1);

  // Stringer length using Pythagorean theorem
  const stringerLength = Math.sqrt(Math.pow(totalRise, 2) + Math.pow(horizontalRun, 2));

  // Angle in degrees
  const angle = (Math.atan(actualRise / actualRun) * 180) / Math.PI;

  return {
    stepCount,
    actualRise,
    actualRun,
    totalRun: horizontalRun,
    stringerLength,
    angle,
  };
}
