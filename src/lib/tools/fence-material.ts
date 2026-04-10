export interface FenceInputs {
  fenceLength: number; // in feet or meters
  postSpacing: number; // in feet or meters
  railCount: number; // number of horizontal rails
  picketWidth: number; // in inches or centimeters
  picketSpacing: number; // in inches or centimeters
  system: "imperial" | "metric";
}

export interface FenceResult {
  posts: number;
  rails: number;
  pickets: number;
}

export function calculateFenceMaterial(inputs: FenceInputs): FenceResult {
  const { fenceLength, postSpacing, railCount, picketWidth, picketSpacing, system } = inputs;

  // Posts: Length / Spacing + 1 (starting post)
  const posts = postSpacing > 0 ? Math.ceil(fenceLength / postSpacing) + 1 : 0;

  // Rails: Number of sections * rails per section
  const sections = postSpacing > 0 ? Math.ceil(fenceLength / postSpacing) : 0;
  const rails = sections * railCount;

  // Pickets:
  // Convert picket width and spacing to the same unit as fence length
  let effectivePicketWidth = 0;
  if (system === "imperial") {
    // Length is in feet, picket dims in inches
    effectivePicketWidth = (picketWidth + picketSpacing) / 12;
  } else {
    // Length is in meters, picket dims in cm
    effectivePicketWidth = (picketWidth + picketSpacing) / 100;
  }

  const pickets = effectivePicketWidth > 0 ? Math.ceil(fenceLength / effectivePicketWidth) : 0;

  return {
    posts,
    rails,
    pickets,
  };
}
