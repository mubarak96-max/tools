export type UAEGratuityWorkerType = "expatriate" | "uae-national";

export type UAEGratuityInput = {
  basicSalary: number;
  startDate: string;
  endDate: string;
  unpaidLeaveDays: number;
  workerType: UAEGratuityWorkerType;
};

export type UAEGratuityResult = {
  eligible: boolean;
  reason?: string;
  rawServiceDays: number;
  eligibleServiceDays: number;
  serviceYears: number;
  firstBandYears: number;
  secondBandYears: number;
  dailyBasicSalary: number;
  gratuityDays: number;
  uncappedGratuity: number;
  cappedGratuity: number;
  maxCap: number;
};

const MILLIS_PER_DAY = 24 * 60 * 60 * 1000;

function toUtcDateParts(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/u);
  if (!match) {
    throw new Error("Enter valid start and end dates.");
  }

  const [, yearRaw, monthRaw, dayRaw] = match;
  return {
    year: Number(yearRaw),
    month: Number(monthRaw),
    day: Number(dayRaw),
  };
}

function diffDays(startDate: string, endDate: string) {
  const start = toUtcDateParts(startDate);
  const end = toUtcDateParts(endDate);

  const startUtc = Date.UTC(start.year, start.month - 1, start.day);
  const endUtc = Date.UTC(end.year, end.month - 1, end.day);

  if (endUtc <= startUtc) {
    throw new Error("End date must be later than the start date.");
  }

  return Math.floor((endUtc - startUtc) / MILLIS_PER_DAY);
}

export function calculateUAEGratuity(input: UAEGratuityInput): UAEGratuityResult {
  const basicSalary = Number(input.basicSalary) || 0;
  const unpaidLeaveDays = Math.max(0, Math.floor(Number(input.unpaidLeaveDays) || 0));

  if (basicSalary <= 0) {
    throw new Error("Enter a valid monthly basic salary.");
  }

  const rawServiceDays = diffDays(input.startDate, input.endDate);

  if (unpaidLeaveDays >= rawServiceDays) {
    throw new Error("Unpaid leave days cannot be equal to or greater than the service period.");
  }

  const eligibleServiceDays = Math.max(0, rawServiceDays - unpaidLeaveDays);
  const serviceYears = eligibleServiceDays / 365;
  const dailyBasicSalary = basicSalary / 30;
  const maxCap = basicSalary * 24;

  if (input.workerType === "uae-national") {
    return {
      eligible: false,
      reason: "UAE nationals usually follow pension and social-security rules instead of the standard private-sector gratuity formula.",
      rawServiceDays,
      eligibleServiceDays,
      serviceYears,
      firstBandYears: 0,
      secondBandYears: 0,
      dailyBasicSalary,
      gratuityDays: 0,
      uncappedGratuity: 0,
      cappedGratuity: 0,
      maxCap,
    };
  }

  if (serviceYears < 1) {
    return {
      eligible: false,
      reason: "Traditional UAE gratuity starts after one full year of continuous service.",
      rawServiceDays,
      eligibleServiceDays,
      serviceYears,
      firstBandYears: 0,
      secondBandYears: 0,
      dailyBasicSalary,
      gratuityDays: 0,
      uncappedGratuity: 0,
      cappedGratuity: 0,
      maxCap,
    };
  }

  const firstBandYears = Math.min(serviceYears, 5);
  const secondBandYears = Math.max(serviceYears - 5, 0);
  const gratuityDays = 21 * firstBandYears + 30 * secondBandYears;
  const uncappedGratuity = gratuityDays * dailyBasicSalary;
  const cappedGratuity = Math.min(uncappedGratuity, maxCap);

  return {
    eligible: true,
    rawServiceDays,
    eligibleServiceDays,
    serviceYears,
    firstBandYears,
    secondBandYears,
    dailyBasicSalary,
    gratuityDays,
    uncappedGratuity,
    cappedGratuity,
    maxCap,
  };
}

export function formatServiceYears(value: number) {
  return value >= 10 ? value.toFixed(1) : value.toFixed(2);
}
