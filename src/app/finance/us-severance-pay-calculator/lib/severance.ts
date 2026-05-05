export type PayType = "salary" | "hourly";
export type SeveranceFormula =
  | "one_week_per_year"
  | "two_weeks_per_year"
  | "one_month_per_year"
  | "custom";
export type FilingStatus =
  | "single"
  | "married_joint"
  | "married_separate"
  | "head_household";

export interface SeveranceInputs {
  payType: PayType;
  annualSalary: number;
  hourlyRate: number;
  hoursPerWeek: number;
  yearsOfService: number;
  formula: SeveranceFormula;
  customWeeks: number;
  unpaidPtoHours: number;
  unpaidPtoDays: number;
  cobraMonths: number;
  signingBonusForfeited: number;
  bonusProRata: number;
  filingStatus: FilingStatus;
  otherAnnualIncome: number;
  stateCode: keyof typeof STATE_TAX_RATES;
}

export interface SeveranceBreakdownItem {
  label: string;
  amount: number;
  sign: "+" | "-";
  note: string;
}

export interface SeveranceResult {
  weeklyPay: number;
  severanceWeeks: number;
  baseSeverance: number;
  ptoPayout: number;
  cobraCost: number;
  bonusProRata: number;
  signingBonusForfeited: number;
  federalTaxEstimate: number;
  stateTaxEstimate: number;
  ficaEstimate: number;
  netSeverance: number;
  totalPackageGross: number;
  totalPackageNet: number;
  effectiveTaxRate: string;
  breakdown: SeveranceBreakdownItem[];
  notes: string[];
}

const FEDERAL_RATES = [0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37] as const;
const SOCIAL_SECURITY_RATE = 0.062;
const MEDICARE_RATE = 0.0145;
const ADDITIONAL_MEDICARE_RATE = 0.009;
const SOCIAL_SECURITY_WAGE_BASE_2024 = 168_600;

const FEDERAL_BRACKETS_2024: Record<FilingStatus, number[]> = {
  single: [11_600, 47_150, 100_525, 191_950, 243_725, 609_350],
  married_joint: [23_200, 94_300, 201_050, 383_900, 487_450, 731_200],
  married_separate: [11_600, 47_150, 100_525, 191_950, 243_725, 365_600],
  head_household: [16_550, 63_100, 100_500, 191_950, 243_700, 609_350],
};

const ADDITIONAL_MEDICARE_THRESHOLDS: Record<FilingStatus, number> = {
  single: 200_000,
  married_joint: 250_000,
  married_separate: 125_000,
  head_household: 200_000,
};

export const COBRA_MONTHLY = {
  individual: 622,
  family: 1_779,
};

export const FORMULA_OPTIONS = [
  {
    value: "one_week_per_year" as const,
    label: "1 week per year",
    sub: "Common floor for IC and hourly roles",
  },
  {
    value: "two_weeks_per_year" as const,
    label: "2 weeks per year",
    sub: "Typical manager and white-collar package",
  },
  {
    value: "one_month_per_year" as const,
    label: "1 month per year",
    sub: "Executive-style package",
  },
  {
    value: "custom" as const,
    label: "Custom weeks",
    sub: "Use your offer letter or separation agreement",
  },
];

export const FILING_OPTIONS = [
  { value: "single" as const, label: "Single" },
  { value: "married_joint" as const, label: "Married filing jointly" },
  { value: "married_separate" as const, label: "Married filing separately" },
  { value: "head_household" as const, label: "Head of household" },
];

export const STATE_TAX_RATES = {
  AL: { name: "Alabama", rate: 0.05, hasNoTax: false },
  AK: { name: "Alaska", rate: 0, hasNoTax: true },
  AZ: { name: "Arizona", rate: 0.025, hasNoTax: false },
  AR: { name: "Arkansas", rate: 0.044, hasNoTax: false },
  CA: { name: "California", rate: 0.093, hasNoTax: false },
  CO: { name: "Colorado", rate: 0.044, hasNoTax: false },
  CT: { name: "Connecticut", rate: 0.06, hasNoTax: false },
  DE: { name: "Delaware", rate: 0.066, hasNoTax: false },
  FL: { name: "Florida", rate: 0, hasNoTax: true },
  GA: { name: "Georgia", rate: 0.0549, hasNoTax: false },
  HI: { name: "Hawaii", rate: 0.0825, hasNoTax: false },
  ID: { name: "Idaho", rate: 0.058, hasNoTax: false },
  IL: { name: "Illinois", rate: 0.0495, hasNoTax: false },
  IN: { name: "Indiana", rate: 0.0305, hasNoTax: false },
  IA: { name: "Iowa", rate: 0.057, hasNoTax: false },
  KS: { name: "Kansas", rate: 0.057, hasNoTax: false },
  KY: { name: "Kentucky", rate: 0.045, hasNoTax: false },
  LA: { name: "Louisiana", rate: 0.03, hasNoTax: false },
  ME: { name: "Maine", rate: 0.0715, hasNoTax: false },
  MD: { name: "Maryland", rate: 0.0575, hasNoTax: false },
  MA: { name: "Massachusetts", rate: 0.05, hasNoTax: false },
  MI: { name: "Michigan", rate: 0.0425, hasNoTax: false },
  MN: { name: "Minnesota", rate: 0.0785, hasNoTax: false },
  MS: { name: "Mississippi", rate: 0.047, hasNoTax: false },
  MO: { name: "Missouri", rate: 0.0495, hasNoTax: false },
  MT: { name: "Montana", rate: 0.059, hasNoTax: false },
  NE: { name: "Nebraska", rate: 0.0584, hasNoTax: false },
  NV: { name: "Nevada", rate: 0, hasNoTax: true },
  NH: { name: "New Hampshire", rate: 0, hasNoTax: true },
  NJ: { name: "New Jersey", rate: 0.0637, hasNoTax: false },
  NM: { name: "New Mexico", rate: 0.059, hasNoTax: false },
  NY: { name: "New York", rate: 0.0685, hasNoTax: false },
  NC: { name: "North Carolina", rate: 0.045, hasNoTax: false },
  ND: { name: "North Dakota", rate: 0.025, hasNoTax: false },
  OH: { name: "Ohio", rate: 0.035, hasNoTax: false },
  OK: { name: "Oklahoma", rate: 0.0475, hasNoTax: false },
  OR: { name: "Oregon", rate: 0.0875, hasNoTax: false },
  PA: { name: "Pennsylvania", rate: 0.0307, hasNoTax: false },
  RI: { name: "Rhode Island", rate: 0.0599, hasNoTax: false },
  SC: { name: "South Carolina", rate: 0.064, hasNoTax: false },
  SD: { name: "South Dakota", rate: 0, hasNoTax: true },
  TN: { name: "Tennessee", rate: 0, hasNoTax: true },
  TX: { name: "Texas", rate: 0, hasNoTax: true },
  UT: { name: "Utah", rate: 0.0465, hasNoTax: false },
  VT: { name: "Vermont", rate: 0.066, hasNoTax: false },
  VA: { name: "Virginia", rate: 0.0575, hasNoTax: false },
  WA: { name: "Washington", rate: 0, hasNoTax: true },
  WV: { name: "West Virginia", rate: 0.0512, hasNoTax: false },
  WI: { name: "Wisconsin", rate: 0.053, hasNoTax: false },
  WY: { name: "Wyoming", rate: 0, hasNoTax: true },
} as const;

export function parseNumber(raw: string) {
  const normalized = raw.replace(/[^0-9.-]/g, "");
  const value = Number.parseFloat(normalized);
  return Number.isFinite(value) ? value : 0;
}

export function formatUSD(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function clampNonNegative(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function getAnnualizedPay(inputs: SeveranceInputs) {
  if (inputs.payType === "salary") {
    return clampNonNegative(inputs.annualSalary);
  }

  return clampNonNegative(inputs.hourlyRate) * clampNonNegative(inputs.hoursPerWeek) * 52;
}

function getSeveranceWeeks(inputs: SeveranceInputs) {
  const years = clampNonNegative(inputs.yearsOfService);

  switch (inputs.formula) {
    case "one_week_per_year":
      return years;
    case "two_weeks_per_year":
      return years * 2;
    case "one_month_per_year":
      return years * (52 / 12);
    case "custom":
      return clampNonNegative(inputs.customWeeks);
    default:
      return 0;
  }
}

function calculateMarginalTax(taxableIncome: number, thresholds: number[]) {
  if (taxableIncome <= 0) {
    return 0;
  }

  let tax = 0;
  let lowerBound = 0;

  for (let i = 0; i < FEDERAL_RATES.length; i += 1) {
    const upperBound = thresholds[i] ?? Number.POSITIVE_INFINITY;
    const bracketIncome = Math.max(0, Math.min(taxableIncome, upperBound) - lowerBound);

    if (bracketIncome > 0) {
      tax += bracketIncome * FEDERAL_RATES[i];
    }

    if (taxableIncome <= upperBound) {
      break;
    }

    lowerBound = upperBound;
  }

  return tax;
}

function calculateIncrementalFederalTax(amount: number, baseIncome: number, filingStatus: FilingStatus) {
  if (amount <= 0) {
    return 0;
  }

  const thresholds = FEDERAL_BRACKETS_2024[filingStatus];
  return (
    calculateMarginalTax(baseIncome + amount, thresholds) -
    calculateMarginalTax(baseIncome, thresholds)
  );
}

function calculateAdditionalMedicareTax(amount: number, baseIncome: number, filingStatus: FilingStatus) {
  const threshold = ADDITIONAL_MEDICARE_THRESHOLDS[filingStatus];

  if (amount <= 0 || baseIncome >= threshold + amount) {
    return 0;
  }

  const priorAbove = Math.max(0, baseIncome - threshold);
  const afterAbove = Math.max(0, baseIncome + amount - threshold);
  return Math.max(0, afterAbove - priorAbove) * ADDITIONAL_MEDICARE_RATE;
}

export function calculateSeverance(inputs: SeveranceInputs): SeveranceResult {
  const annualizedPay = getAnnualizedPay(inputs);
  const weeklyPay = annualizedPay / 52;
  const hourlyPay = inputs.payType === "salary"
    ? annualizedPay / 2_080
    : clampNonNegative(inputs.hourlyRate);
  const dailyPay = annualizedPay / 260;
  const severanceWeeks = getSeveranceWeeks(inputs);
  const baseSeverance = weeklyPay * severanceWeeks;
  const ptoPayout =
    clampNonNegative(inputs.unpaidPtoHours) * hourlyPay +
    clampNonNegative(inputs.unpaidPtoDays) * dailyPay;
  const cobraCost = clampNonNegative(inputs.cobraMonths) * COBRA_MONTHLY.individual;
  const bonusProRata = clampNonNegative(inputs.bonusProRata);
  const signingBonusForfeited = clampNonNegative(inputs.signingBonusForfeited);

  const cashGross = Math.max(0, baseSeverance + ptoPayout + bonusProRata - signingBonusForfeited);
  const totalPackageGross = cashGross + cobraCost;
  const taxableIncomeBase = clampNonNegative(inputs.otherAnnualIncome);

  const federalTaxEstimate = calculateIncrementalFederalTax(
    cashGross,
    taxableIncomeBase,
    inputs.filingStatus,
  );

  const stateConfig = STATE_TAX_RATES[inputs.stateCode];
  const stateTaxEstimate = stateConfig.hasNoTax ? 0 : cashGross * stateConfig.rate;

  const remainingSocialSecurityWageBase = Math.max(
    0,
    SOCIAL_SECURITY_WAGE_BASE_2024 - taxableIncomeBase,
  );
  const socialSecurityTax = Math.min(cashGross, remainingSocialSecurityWageBase) * SOCIAL_SECURITY_RATE;
  const medicareTax = cashGross * MEDICARE_RATE;
  const additionalMedicareTax = calculateAdditionalMedicareTax(
    cashGross,
    taxableIncomeBase,
    inputs.filingStatus,
  );
  const ficaEstimate = socialSecurityTax + medicareTax + additionalMedicareTax;

  const totalTaxes = federalTaxEstimate + stateTaxEstimate + ficaEstimate;
  const netSeverance = Math.max(0, cashGross - totalTaxes);
  const totalPackageNet = netSeverance + cobraCost;
  const effectiveTaxRate = cashGross > 0 ? `${((totalTaxes / cashGross) * 100).toFixed(1)}%` : "0.0%";

  const breakdown: SeveranceBreakdownItem[] = [
    {
      label: "Base severance",
      amount: baseSeverance,
      sign: "+",
      note: `${severanceWeeks.toFixed(1)} weeks at ${formatUSD(weeklyPay)}/week`,
    },
  ];

  if (ptoPayout > 0) {
    breakdown.push({
      label: "Unused PTO payout",
      amount: ptoPayout,
      sign: "+",
      note: "Unused vacation or PTO converted to wages",
    });
  }

  if (bonusProRata > 0) {
    breakdown.push({
      label: "Pro-rata bonus",
      amount: bonusProRata,
      sign: "+",
      note: "Partial-year bonus value included in package",
    });
  }

  if (cobraCost > 0) {
    breakdown.push({
      label: "Employer-paid COBRA value",
      amount: cobraCost,
      sign: "+",
      note: "Health coverage value, generally not taxed like wages",
    });
  }

  if (signingBonusForfeited > 0) {
    breakdown.push({
      label: "Signing bonus clawback",
      amount: signingBonusForfeited,
      sign: "-",
      note: "Repayment or offset against your cash package",
    });
  }

  const notes: string[] = [];

  if (stateConfig.hasNoTax) {
    notes.push(`${stateConfig.name} has no state tax on wage income, so this estimate excludes state withholding.`);
  }

  if (cobraCost > 0) {
    notes.push("COBRA value is treated here as a non-cash benefit and not included in taxable wage estimates.");
  }

  if (taxableIncomeBase >= SOCIAL_SECURITY_WAGE_BASE_2024) {
    notes.push("Your entered year-to-date income already reaches the 2024 Social Security wage base, so only Medicare remains in FICA.");
  } else if (taxableIncomeBase + cashGross > SOCIAL_SECURITY_WAGE_BASE_2024) {
    notes.push("Part of this package crosses the 2024 Social Security wage base, so only part of the severance is charged the 6.2% Social Security tax.");
  }

  if (inputs.formula === "custom") {
    notes.push("Custom severance weeks override the default per-year formula.");
  }

  return {
    weeklyPay,
    severanceWeeks,
    baseSeverance,
    ptoPayout,
    cobraCost,
    bonusProRata,
    signingBonusForfeited,
    federalTaxEstimate,
    stateTaxEstimate,
    ficaEstimate,
    netSeverance,
    totalPackageGross,
    totalPackageNet,
    effectiveTaxRate,
    breakdown,
    notes,
  };
}
