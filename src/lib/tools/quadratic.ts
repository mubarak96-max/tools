export interface QuadraticInput {
  a: number;
  b: number;
  c: number;
}

export interface QuadraticResult {
  discriminant: number;
  hasRealRoots: boolean;
  roots: string[];
  axisOfSymmetry: number | null;
  vertexX: number | null;
  vertexY: number | null;
}

function normalize(value: number) {
  return Number.isFinite(value) ? value : 0;
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? value.toString() : value.toFixed(6).replace(/\.?0+$/, "");
}

export function solveQuadratic(input: QuadraticInput): QuadraticResult {
  const a = normalize(input.a);
  const b = normalize(input.b);
  const c = normalize(input.c);

  if (a === 0) {
    return {
      discriminant: NaN,
      hasRealRoots: false,
      roots: ["Coefficient a must not be zero for a quadratic equation."],
      axisOfSymmetry: null,
      vertexX: null,
      vertexY: null,
    };
  }

  const discriminant = b * b - 4 * a * c;
  const axisOfSymmetry = -b / (2 * a);
  const vertexY = a * axisOfSymmetry * axisOfSymmetry + b * axisOfSymmetry + c;

  if (discriminant > 0) {
    const sqrtDiscriminant = Math.sqrt(discriminant);
    return {
      discriminant,
      hasRealRoots: true,
      roots: [
        formatNumber((-b + sqrtDiscriminant) / (2 * a)),
        formatNumber((-b - sqrtDiscriminant) / (2 * a)),
      ],
      axisOfSymmetry,
      vertexX: axisOfSymmetry,
      vertexY,
    };
  }

  if (discriminant === 0) {
    const root = -b / (2 * a);
    return {
      discriminant,
      hasRealRoots: true,
      roots: [formatNumber(root), formatNumber(root)],
      axisOfSymmetry,
      vertexX: axisOfSymmetry,
      vertexY,
    };
  }

  const realPart = -b / (2 * a);
  const imaginaryPart = Math.sqrt(Math.abs(discriminant)) / (2 * a);

  return {
    discriminant,
    hasRealRoots: false,
    roots: [
      `${formatNumber(realPart)} + ${formatNumber(imaginaryPart)}i`,
      `${formatNumber(realPart)} - ${formatNumber(imaginaryPart)}i`,
    ],
    axisOfSymmetry,
    vertexX: axisOfSymmetry,
    vertexY,
  };
}
