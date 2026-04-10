export interface StatisticsResult {
  values: number[];
  count: number;
  sum: number;
  min: number;
  max: number;
  range: number;
  mean: number;
  median: number;
  modes: number[];
  variancePopulation: number;
  stdDevPopulation: number;
  varianceSample: number | null;
  stdDevSample: number | null;
}

export function parseStatisticsValues(input: string) {
  const matches = input.match(/-?\d*\.?\d+(?:e[+-]?\d+)?/gi) ?? [];
  return matches.map((value) => Number(value)).filter((value) => Number.isFinite(value));
}

export function calculateStatistics(values: number[]): StatisticsResult | null {
  if (!values.length) {
    return null;
  }

  const sorted = [...values].sort((left, right) => left - right);
  const count = sorted.length;
  const sum = sorted.reduce((total, value) => total + value, 0);
  const mean = sum / count;
  const median =
    count % 2 === 1
      ? sorted[(count - 1) / 2]
      : (sorted[count / 2 - 1] + sorted[count / 2]) / 2;
  const min = sorted[0];
  const max = sorted[count - 1];
  const range = max - min;

  const frequencies = new Map<number, number>();
  sorted.forEach((value) => {
    frequencies.set(value, (frequencies.get(value) ?? 0) + 1);
  });
  const highestFrequency = Math.max(...frequencies.values());
  const modes =
    highestFrequency > 1
      ? Array.from(frequencies.entries())
          .filter(([, frequency]) => frequency === highestFrequency)
          .map(([value]) => value)
      : [];

  const variancePopulation =
    sorted.reduce((total, value) => total + (value - mean) ** 2, 0) / count;
  const stdDevPopulation = Math.sqrt(variancePopulation);
  const varianceSample =
    count > 1
      ? sorted.reduce((total, value) => total + (value - mean) ** 2, 0) / (count - 1)
      : null;

  return {
    values: sorted,
    count,
    sum,
    min,
    max,
    range,
    mean,
    median,
    modes,
    variancePopulation,
    stdDevPopulation,
    varianceSample,
    stdDevSample: varianceSample !== null ? Math.sqrt(varianceSample) : null,
  };
}
