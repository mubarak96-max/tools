export interface LogarithmInput {
  value: number;
  base: number;
}

export interface LogarithmResult {
  logBaseValue: number | null;
  naturalLog: number | null;
  commonLog: number | null;
}

function normalize(value: number) {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLogarithms(input: LogarithmInput): LogarithmResult {
  const value = normalize(input.value);
  const base = normalize(input.base);

  if (value <= 0) {
    return {
      logBaseValue: null,
      naturalLog: null,
      commonLog: null,
    };
  }

  const naturalLog = Math.log(value);
  const commonLog = Math.log10(value);
  const logBaseValue =
    base > 0 && base !== 1 ? naturalLog / Math.log(base) : null;

  return {
    logBaseValue,
    naturalLog,
    commonLog,
  };
}
