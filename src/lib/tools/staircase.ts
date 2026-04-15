export type StaircaseSystem = "imperial" | "metric";

export interface StaircaseInputs {
  totalRise: number;   // inches (imperial) or cm (metric)
  targetRise: number;  // inches or cm — desired riser height
  targetRun: number;   // inches or cm — desired tread depth
  nosing: number;      // inches or cm — nosing overhang
  stairWidth: number;  // inches or cm — width of staircase
  stringerCount: number; // 2 or 3 stringers
  system: StaircaseSystem;
}

export interface CodeCheck {
  label: string;
  pass: boolean;
  value: string;
  limit: string;
}

export interface StaircaseResult {
  stepCount: number;       // number of risers
  treadCount: number;      // treads = risers - 1
  actualRise: number;      // exact rise per step
  actualRun: number;       // same as targetRun
  totalRun: number;        // total horizontal run (treadCount × actualRun)
  totalRise: number;       // echo back
  stringerLength: number;  // diagonal stringer length
  angle: number;           // staircase angle in degrees
  // comfort
  comfortScore: number;    // 2r+t result (target: 24-25 in imperial, 60-64 cm metric)
  comfortOk: boolean;
  // lumber
  treadLumberLength: number; // total tread material: treadCount × stairWidth
  stringerBoardLength: number; // stringer length + safety margin
  // code checks
  codeChecks: CodeCheck[];
  allCodePass: boolean;
}

export function calculateStaircase(inp: StaircaseInputs): StaircaseResult {
  const { totalRise, targetRise, targetRun, nosing, stairWidth, stringerCount, system } = inp;

  const isImperial = system === "imperial";

  // Guard
  if (targetRise <= 0 || targetRun <= 0 || totalRise <= 0) {
    return {
      stepCount: 0, treadCount: 0, actualRise: 0, actualRun: targetRun,
      totalRun: 0, totalRise, stringerLength: 0, angle: 0,
      comfortScore: 0, comfortOk: false,
      treadLumberLength: 0, stringerBoardLength: 0,
      codeChecks: [], allCodePass: false,
    };
  }

  // Steps & actual rise
  const stepCount = Math.ceil(totalRise / targetRise);
  const actualRise = totalRise / stepCount;
  const actualRun = targetRun;
  const treadCount = stepCount - 1;

  // Geometry
  const totalRun = actualRun * treadCount;
  const stringerLength = Math.sqrt(totalRise ** 2 + totalRun ** 2);
  const angle = (Math.atan(actualRise / actualRun) * 180) / Math.PI;

  // Comfort formula: 2r + t (target 24-25 in / 60-64 cm)
  const comfortScore = 2 * actualRise + actualRun;
  const [comfortLo, comfortHi] = isImperial ? [24, 25] : [61, 64];
  const comfortOk = comfortScore >= comfortLo && comfortScore <= comfortHi;

  // Lumber
  const treadLumberLength = treadCount * stairWidth; // e.g. inches total board material
  // Add 10% margin to stringer
  const stringerBoardLength = stringerLength * 1.1;

  // Code checks (IRC / metric equivalents)
  let codeChecks: CodeCheck[];
  if (isImperial) {
    codeChecks = [
      {
        label: "Max riser height",
        pass: actualRise <= 7.75,
        value: `${actualRise.toFixed(2)} in`,
        limit: "≤ 7.75 in",
      },
      {
        label: "Min tread depth",
        pass: actualRun >= 10,
        value: `${actualRun.toFixed(2)} in`,
        limit: "≥ 10 in",
      },
      {
        label: "Riser consistency",
        pass: true, // actualRise is uniform by design
        value: "Uniform",
        limit: "< 3/8 in variance",
      },
      {
        label: "Min stair width",
        pass: stairWidth >= 36,
        value: `${stairWidth} in`,
        limit: "≥ 36 in",
      },
      {
        label: "Ideal angle (30°–37°)",
        pass: angle >= 30 && angle <= 37,
        value: `${angle.toFixed(1)}°`,
        limit: "30°–37°",
      },
    ];
  } else {
    codeChecks = [
      {
        label: "Max riser height",
        pass: actualRise <= 19.7, // 7.75 in ≈ 19.7 cm
        value: `${actualRise.toFixed(1)} cm`,
        limit: "≤ 19.7 cm",
      },
      {
        label: "Min tread depth",
        pass: actualRun >= 25.4, // 10 in ≈ 25.4 cm
        value: `${actualRun.toFixed(1)} cm`,
        limit: "≥ 25.4 cm",
      },
      {
        label: "Riser consistency",
        pass: true,
        value: "Uniform",
        limit: "< 1 cm variance",
      },
      {
        label: "Min stair width",
        pass: stairWidth >= 91.4, // 36 in ≈ 91.4 cm
        value: `${stairWidth} cm`,
        limit: "≥ 91.4 cm",
      },
      {
        label: "Ideal angle (30°–37°)",
        pass: angle >= 30 && angle <= 37,
        value: `${angle.toFixed(1)}°`,
        limit: "30°–37°",
      },
    ];
  }

  const allCodePass = codeChecks.every((c) => c.pass);

  return {
    stepCount,
    treadCount,
    actualRise,
    actualRun,
    totalRun,
    totalRise,
    stringerLength,
    angle,
    comfortScore,
    comfortOk,
    treadLumberLength,
    stringerBoardLength,
    codeChecks,
    allCodePass,
  };
}
