export type FenceSystem = "imperial" | "metric";

export interface FenceInputs {
  fenceLength: number;   // ft  or m
  fenceHeight: number;   // ft  or m
  postSpacing: number;   // ft  or m
  gateCount: number;     // number of gate openings
  picketWidth: number;   // in  or cm
  picketSpacing: number; // in  or cm
  wastePct: number;      // e.g. 10 for 10 %
  system: FenceSystem;
}

export interface FenceResult {
  // derived
  sections: number;
  railsPerSection: number;
  // main counts (before waste)
  postsBase: number;
  railsBase: number;
  picketsBase: number;
  // with waste
  posts: number;
  rails: number;
  pickets: number;
  // concrete for posts
  bags80lb: number;
  bags60lb: number;
  bags25kg: number;
  bags20kg: number;
  // linear material
  totalRailLength: number;  // ft or m
  picketCoverage: number;   // ft or m (total fence face coverage per picket span)
}

export function calculateFenceMaterial(inp: FenceInputs): FenceResult {
  const { fenceLength, fenceHeight, postSpacing, gateCount, picketWidth, picketSpacing, wastePct, system } = inp;

  const safeDivide = (a: number, b: number) => (b > 0 ? a / b : 0);
  const wasteMultiplier = 1 + wastePct / 100;

  // --- Sections & rails per section ---
  const sections = postSpacing > 0 ? Math.ceil(fenceLength / postSpacing) : 0;

  // Rails per section: 2 for ≤4 ft, 3 for 5-6 ft, 4 for 7-8 ft (imperial)
  // Convert height to feet for the threshold logic regardless of system
  const heightFt = system === "imperial" ? fenceHeight : fenceHeight * 3.28084;
  const railsPerSection = heightFt <= 4 ? 2 : heightFt <= 6 ? 3 : 4;

  // --- Posts ---
  const postsBase = sections + 1 + gateCount * 2; // gate openings need 2 posts each
  const posts = Math.ceil(postsBase * wasteMultiplier);

  // --- Rails ---
  const railsBase = sections * railsPerSection;
  const rails = Math.ceil(railsBase * wasteMultiplier);

  // Total rail length (each rail spans one section)
  const totalRailLength = rails * postSpacing;

  // --- Pickets ---
  // Picket gap = picketWidth + picketSpacing (both in inches or cm)
  let pitchInLength: number; // pitch in same unit as fenceLength
  if (system === "imperial") {
    pitchInLength = (picketWidth + picketSpacing) / 12; // inches → feet
  } else {
    pitchInLength = (picketWidth + picketSpacing) / 100; // cm → m
  }
  const picketsBase = pitchInLength > 0 ? Math.ceil(safeDivide(fenceLength, pitchInLength)) : 0;
  const pickets = Math.ceil(picketsBase * wasteMultiplier);
  const picketCoverage = picketsBase * pitchInLength;

  // --- Concrete bags per post ---
  // Rule: 1 bag of 80 lb per post for fences ≤6 ft, 2 bags for taller
  const bagsPerPost = heightFt <= 6 ? 1 : 2;
  if (system === "imperial") {
    return {
      sections,
      railsPerSection,
      postsBase,
      railsBase,
      picketsBase,
      posts,
      rails,
      pickets,
      bags80lb: Math.ceil(posts * bagsPerPost),
      bags60lb: Math.ceil(posts * bagsPerPost * (80 / 60)),
      bags25kg: 0,
      bags20kg: 0,
      totalRailLength,
      picketCoverage,
    };
  } else {
    // Metric: 25 kg ≈ 80 lb, 20 kg ≈ 60 lb
    return {
      sections,
      railsPerSection,
      postsBase,
      railsBase,
      picketsBase,
      posts,
      rails,
      pickets,
      bags80lb: 0,
      bags60lb: 0,
      bags25kg: Math.ceil(posts * bagsPerPost),
      bags20kg: Math.ceil(posts * bagsPerPost * (25 / 20)),
      totalRailLength,
      picketCoverage,
    };
  }
}
