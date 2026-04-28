// lib/australiaTax.ts
//
// Australia Income Tax Calculator
// Financial Year 2026–26 (1 July 2026 – 30 June 2026)
//
// SOURCES:
//   • ATO tax rates: https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents
//   • Medicare levy: https://www.ato.gov.au/individuals-and-families/medicare-levy
//   • LITO/LMITO: https://www.ato.gov.au/tax-rates-and-codes/tax-offsets
//   • Stage 3 tax cuts: effective 1 July 2026
//   • Super: https://www.ato.gov.au/businesses-and-organisations/super-for-employers/work-out-if-you-have-to-pay-super/super-guarantee
//
// ─────────────────────────────────────────────────────────────────
//
// 2026–26 TAX BRACKETS (after Stage 3 cuts, effective 1 July 2026):
//   $0         – $18,200     :  0%       (tax-free threshold)
//   $18,201    – $45,000     :  19%
//   $45,001    – $120,000    :  32.5%
//   $120,001   – $180,000    :  37%
//   $180,001+               :  45%
//
// MEDICARE LEVY:
//   2% of taxable income
//   Exemption: income < $26,000 (singles), phases in between $26,000–$32,500
//   Surcharge: 1% extra if no private hospital cover and income > $93,000
//   (singles threshold 2026-26)
//
// LOW INCOME TAX OFFSET (LITO) 2026–26:
//   Income ≤ $37,500:        $700 offset
//   $37,501 – $45,000:       $700 – 5¢ per $1 above $37,500 (phase-out 1)
//   $45,001 – $66,667:       $325 – 1.5¢ per $1 above $45,000 (phase-out 2)
//   Income > $66,667:        $0
//
// LOW AND MIDDLE INCOME TAX OFFSET (LMITO):
//   LMITO was removed from 2022–23 onwards. Not applicable for 2026–26.
//
// HELP/HECS REPAYMENT (2026–26):
//   Minimum repayment threshold: $54,435
//   Rates from 1% (at $54,435) up to 10% (at $159,664+)
//
// SUPERANNUATION GUARANTEE (SG):
//   2026–26: 11.5% of ordinary time earnings (OTE)
//   2026–26: 12.0%
//
// ─────────────────────────────────────────────────────────────────

export type ResidencyStatus = "resident" | "non_resident" | "working_holiday";
export type IncomeFrequency = "annual" | "monthly" | "fortnightly" | "weekly";

// ── Tax brackets ──────────────────────────────────────────────────

interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
  baseTax: number; // cumulative tax at bottom of bracket
}

const RESIDENT_BRACKETS_2026_25: TaxBracket[] = [
  { min: 0,       max: 18200,  rate: 0.00,  baseTax: 0       },
  { min: 18201,   max: 45000,  rate: 0.19,  baseTax: 0       },
  { min: 45001,   max: 120000, rate: 0.325, baseTax: 5092    },
  { min: 120001,  max: 180000, rate: 0.37,  baseTax: 29467   },
  { min: 180001,  max: null,   rate: 0.45,  baseTax: 51667   },
];

// Non-residents pay tax from $1 (no tax-free threshold)
const NON_RESIDENT_BRACKETS_2026_25: TaxBracket[] = [
  { min: 0,       max: 120000, rate: 0.325, baseTax: 0       },
  { min: 120001,  max: 180000, rate: 0.37,  baseTax: 39000   },
  { min: 180001,  max: null,   rate: 0.45,  baseTax: 61200   },
];

// Working holiday makers: 15% on first $45,000, then resident rates
const WORKING_HOLIDAY_BRACKETS_2026_25: TaxBracket[] = [
  { min: 0,       max: 45000,  rate: 0.15,  baseTax: 0       },
  { min: 45001,   max: 120000, rate: 0.325, baseTax: 6750    },
  { min: 120001,  max: 180000, rate: 0.37,  baseTax: 31125   },
  { min: 180001,  max: null,   rate: 0.45,  baseTax: 53325   },
];

function getBrackets(status: ResidencyStatus): TaxBracket[] {
  if (status === "non_resident") return NON_RESIDENT_BRACKETS_2026_25;
  if (status === "working_holiday") return WORKING_HOLIDAY_BRACKETS_2026_25;
  return RESIDENT_BRACKETS_2026_25;
}

function calcIncomeTax(income: number, status: ResidencyStatus): number {
  const brackets = getBrackets(status);
  let tax = 0;
  for (const b of brackets) {
    if (income <= b.min - 1) break;
    const taxableInBracket = Math.min(income, b.max ?? Infinity) - b.min + 1;
    if (taxableInBracket <= 0) continue;
    tax = b.baseTax + (income - b.min) * b.rate;
  }
  return Math.max(0, tax);
}

// ── Low Income Tax Offset (LITO) ──────────────────────────────────

function calcLITO(income: number, status: ResidencyStatus): number {
  if (status !== "resident") return 0; // LITO only for residents
  if (income <= 37500) return 700;
  if (income <= 45000) return Math.max(0, 700 - (income - 37500) * 0.05);
  if (income <= 66667) return Math.max(0, 325 - (income - 45000) * 0.015);
  return 0;
}

// ── Medicare Levy ─────────────────────────────────────────────────

const MEDICARE_RATE             = 0.02;
const MEDICARE_LOWER_THRESHOLD  = 26000;  // 2026-26 singles
const MEDICARE_UPPER_THRESHOLD  = 32500;  // phase-in complete
const MEDICARE_SURCHARGE_RATE   = 0.01;
const MEDICARE_SURCHARGE_THRESH = 93000;  // singles 2026-26

function calcMedicareLevy(
  income: number,
  status: ResidencyStatus,
  hasMedicareExemption: boolean,
  hasMedicareSurcharge: boolean,
): { levy: number; surcharge: number } {
  if (status !== "resident" || hasMedicareExemption) {
    return { levy: 0, surcharge: 0 };
  }

  let levy = 0;
  if (income <= MEDICARE_LOWER_THRESHOLD) {
    levy = 0;
  } else if (income <= MEDICARE_UPPER_THRESHOLD) {
    // Shade-in: 10% of (income - lower threshold)
    levy = (income - MEDICARE_LOWER_THRESHOLD) * 0.10;
  } else {
    levy = income * MEDICARE_RATE;
  }

  const surcharge =
    hasMedicareSurcharge && income > MEDICARE_SURCHARGE_THRESH
      ? income * MEDICARE_SURCHARGE_RATE
      : 0;

  return { levy, surcharge };
}

// ── HELP/HECS Repayment ───────────────────────────────────────────

interface HelpBracket {
  min: number;
  max: number | null;
  rate: number;
}

const HELP_BRACKETS_2026_25: HelpBracket[] = [
  { min: 0,       max: 54434,  rate: 0    },
  { min: 54435,   max: 62849,  rate: 0.01 },
  { min: 62850,   max: 66620,  rate: 0.02 },
  { min: 66621,   max: 70618,  rate: 0.025},
  { min: 70619,   max: 74855,  rate: 0.03 },
  { min: 74856,   max: 79346,  rate: 0.035},
  { min: 79347,   max: 84107,  rate: 0.04 },
  { min: 84108,   max: 88086,  rate: 0.045},
  { min: 88087,   max: 91569,  rate: 0.05 },
  { min: 91570,   max: 100000, rate: 0.055},
  { min: 100001,  max: 110000, rate: 0.06 },
  { min: 110001,  max: 120000, rate: 0.065},
  { min: 120001,  max: 130000, rate: 0.07 },
  { min: 130001,  max: 140000, rate: 0.075},
  { min: 140001,  max: 159663, rate: 0.08 },
  { min: 159664,  max: null,   rate: 0.10 },
];

function calcHelpRepayment(income: number): number {
  for (const b of HELP_BRACKETS_2026_25) {
    if (income <= (b.max ?? Infinity) && income >= b.min) {
      return income * b.rate;
    }
  }
  return 0;
}

// ── Superannuation ────────────────────────────────────────────────

const SUPER_RATE_2026_25 = 0.115; // 11.5%

// ── Main calculation ──────────────────────────────────────────────

export interface AuTaxInputs {
  grossIncome: number;
  residencyStatus: ResidencyStatus;
  includeHelp: boolean;
  helpDebt: number;               // total HECS/HELP debt for context
  hasMedicareExemption: boolean;  // Medicare levy exemption (e.g. some visa holders)
  hasMedicareSurcharge: boolean;  // no private hospital cover + income > threshold
  includeSuper: boolean;          // show super on top of salary
  frequency: IncomeFrequency;
}

export interface AuTaxResult {
  // Income
  grossAnnual: number;
  grossInFrequency: number;

  // Tax components
  incomeTax: number;
  lito: number;
  netIncomeTax: number;       // incomeTax - lito (capped at 0)
  medicareLevy: number;
  medicareSurcharge: number;
  helpRepayment: number;
  totalDeductions: number;    // netIncomeTax + medicare + surcharge + help

  // Super
  superContribution: number;  // employer super on top of salary

  // Net
  netAnnual: number;
  netInFrequency: number;
  effectiveTaxRate: number;   // totalDeductions / gross
  marginalRate: number;       // rate at last dollar of income

  // Bracket detail
  brackets: BracketRow[];

  // Per-frequency breakdown
  perFrequency: {
    incomeTax: number;
    medicare: number;
    help: number;
    super: number;
    net: number;
  };
}

export interface BracketRow {
  label: string;
  rate: string;
  taxableAmount: number;
  taxAmount: number;
}

export function calculateAuTax(inputs: AuTaxInputs): AuTaxResult {
  const {
    grossIncome,
    residencyStatus,
    includeHelp,
    hasMedicareExemption,
    hasMedicareSurcharge,
    includeSuper,
    frequency,
  } = inputs;

  // Annualise if not already annual
  const multiplier: Record<IncomeFrequency, number> = {
    annual: 1, monthly: 12, fortnightly: 26, weekly: 52,
  };
  const gross = grossIncome * multiplier[frequency];

  const incomeTax    = calcIncomeTax(gross, residencyStatus);
  const lito         = calcLITO(gross, residencyStatus);
  const netIncomeTax = Math.max(0, incomeTax - lito);

  const { levy: medicareLevy, surcharge: medicareSurcharge } = calcMedicareLevy(
    gross, residencyStatus, hasMedicareExemption, hasMedicareSurcharge
  );

  const helpRepayment = includeHelp ? calcHelpRepayment(gross) : 0;
  const totalDeductions = netIncomeTax + medicareLevy + medicareSurcharge + helpRepayment;
  const netAnnual = gross - totalDeductions;

  const superContribution = includeSuper ? gross * SUPER_RATE_2026_25 : 0;

  // Effective & marginal rates
  const effectiveTaxRate = gross > 0 ? (totalDeductions / gross) * 100 : 0;

  const brackets = getBrackets(residencyStatus);
  let marginalRate = 0;
  for (const b of brackets) {
    if (gross >= b.min) marginalRate = b.rate * 100;
  }

  // Bracket detail rows
  const bracketRows: BracketRow[] = getBrackets(residencyStatus)
    .filter(b => gross >= b.min)
    .map(b => {
      const taxableInBracket = Math.min(gross, b.max ?? gross) - b.min + 1;
      return {
        label: b.max
          ? `$${b.min.toLocaleString("en-AU")} – $${b.max.toLocaleString("en-AU")}`
          : `$${b.min.toLocaleString("en-AU")}+`,
        rate: `${(b.rate * 100).toFixed(1)}%`,
        taxableAmount: Math.max(0, taxableInBracket),
        taxAmount: Math.max(0, taxableInBracket * b.rate),
      };
    });

  // Per-frequency figures
  const div = multiplier[frequency];
  const perFrequency = {
    incomeTax: netIncomeTax / div,
    medicare:  (medicareLevy + medicareSurcharge) / div,
    help:      helpRepayment / div,
    super:     superContribution / div,
    net:       netAnnual / div,
  };

  return {
    grossAnnual: gross,
    grossInFrequency: grossIncome,
    incomeTax,
    lito,
    netIncomeTax,
    medicareLevy,
    medicareSurcharge,
    helpRepayment,
    totalDeductions,
    superContribution,
    netAnnual,
    netInFrequency: netAnnual / div,
    effectiveTaxRate,
    marginalRate,
    brackets: bracketRows,
    perFrequency,
  };
}

// ── Helpers ───────────────────────────────────────────────────────

export function fmtAUD(n: number, dp = 0): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  }).format(Math.round(n));
}

export function fmtAUDShort(n: number): string {
  if (n >= 1_000_000) return `A$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `A$${(n / 1_000).toFixed(1)}k`;
  return `A$${Math.round(n)}`;
}

export function fmtPct(n: number, dp = 2): string {
  return `${n.toFixed(dp)}%`;
}

export const FREQUENCY_LABELS: Record<IncomeFrequency, string> = {
  annual:      "Annual",
  monthly:     "Monthly",
  fortnightly: "Fortnightly",
  weekly:      "Weekly",
};
