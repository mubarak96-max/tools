export type UAEGratuityWorkerType = "expatriate" | "uae-national";
export type UAEGratuityLeavingReason = "resignation" | "termination";
export type UAEGratuityContractType = "current-fixed-term" | "legacy-unlimited" | "not-sure";

export type UAEGratuityInput = {
  basicSalary: number;
  startDate: string;
  endDate: string;
  unpaidLeaveDays: number;
  workerType: UAEGratuityWorkerType;
  leavingReason?: UAEGratuityLeavingReason;
  contractType?: UAEGratuityContractType;
  workPatternRatio?: number;
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
  capApplied: boolean;
  workPatternRatio: number;
  leavingReason: UAEGratuityLeavingReason;
  contractType: UAEGratuityContractType;
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
  const workPatternRatio = Math.min(1, Math.max(0.01, Number(input.workPatternRatio) || 1));
  const leavingReason = input.leavingReason ?? "resignation";
  const contractType = input.contractType ?? "current-fixed-term";

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
  const maxCap = basicSalary * 24 * workPatternRatio;

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
      capApplied: false,
      workPatternRatio,
      leavingReason,
      contractType,
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
      capApplied: false,
      workPatternRatio,
      leavingReason,
      contractType,
    };
  }

  const firstBandYears = Math.min(serviceYears, 5);
  const secondBandYears = Math.max(serviceYears - 5, 0);
  const gratuityDays = 21 * firstBandYears + 30 * secondBandYears;
  const uncappedGratuity = gratuityDays * dailyBasicSalary * workPatternRatio;
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
    capApplied: uncappedGratuity > maxCap,
    workPatternRatio,
    leavingReason,
    contractType,
  };
}

export function calculateUAEGratuityFromYears(
  input: Omit<UAEGratuityInput, "startDate" | "endDate" | "unpaidLeaveDays"> & {
    serviceYears: number;
  },
): UAEGratuityResult {
  const today = new Date();
  const endDate = today.toISOString().slice(0, 10);
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - Math.max(0, input.serviceYears) * 365);

  return calculateUAEGratuity({
    ...input,
    startDate: startDate.toISOString().slice(0, 10),
    endDate,
    unpaidLeaveDays: 0,
  });
}

export function formatServiceYears(value: number) {
  return value >= 10 ? value.toFixed(1) : value.toFixed(2);
}
