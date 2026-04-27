// lib/indiaTax.ts
//
// India Income Tax Calculator — FY 2025–26 (AY 2026–27)
//
// SOURCES:
//   • Income Tax Act, 1961 (as amended by Finance Act 2025)
//   • New Tax Regime: Section 115BAC (default from FY 2023–24)
//   • Old Tax Regime: Legacy slabs with deductions
//   • Budget 2025 changes: Standard deduction ₹75,000 (new regime)
//   • Surcharge: Finance Act 2025
//   • Health & Education Cess: 4% on income tax + surcharge
//
// ─────────────────────────────────────────────────────────────────
//
// NEW TAX REGIME (Section 115BAC) — Default from FY 2023–24:
//   ₹0        – ₹3,00,000   :  0%
//   ₹3,00,001 – ₹7,00,000   :  5%
//   ₹7,00,001 – ₹10,00,000  :  10%
//   ₹10,00,001– ₹12,00,000  :  15%
//   ₹12,00,001– ₹15,00,000  :  20%
//   ₹15,00,001+             :  30%
//
//   Standard deduction: ₹75,000 (for salaried; Budget 2025)
//   Rebate u/s 87A: Up to ₹25,000 if net taxable income ≤ ₹7,00,000
//   No deductions allowed (80C, 80D, HRA, LTA etc.)
//
// OLD TAX REGIME — Optional (must opt-in):
//   ₹0        – ₹2,50,000   :  0%
//   ₹2,50,001 – ₹5,00,000   :  5%
//   ₹5,00,001 – ₹10,00,000  :  20%
//   ₹10,00,001+             :  30%
//
//   Standard deduction: ₹50,000
//   Rebate u/s 87A: Up to ₹12,500 if net taxable income ≤ ₹5,00,000
//   Deductions allowed: 80C (₹1,50,000), 80D, HRA, LTA, NPS (80CCD), etc.
//
// SURCHARGE (both regimes):
//   Income ₹50L – ₹1Cr  :  10%
//   Income ₹1Cr – ₹2Cr  :  15%
//   Income ₹2Cr – ₹5Cr  :  25% (new regime: 25%)
//   Income > ₹5Cr        :  37% (old regime) / 25% (new regime, capped)
//
// HEALTH & EDUCATION CESS: 4% on (income tax + surcharge)
//
// ─────────────────────────────────────────────────────────────────

export type TaxRegime = "new" | "old";
export type EmploymentType = "salaried" | "self_employed";
export type AgeGroup = "below60" | "60to80" | "above80"; // for old regime only

// ── Tax brackets ──────────────────────────────────────────────────

interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
}

const NEW_REGIME_BRACKETS: TaxBracket[] = [
  { min: 0,         max: 300000,   rate: 0.00 },
  { min: 300001,    max: 700000,   rate: 0.05 },
  { min: 700001,    max: 1000000,  rate: 0.10 },
  { min: 1000001,   max: 1200000,  rate: 0.15 },
  { min: 1200001,   max: 1500000,  rate: 0.20 },
  { min: 1500001,   max: null,     rate: 0.30 },
];

// Old regime — below 60
const OLD_REGIME_BRACKETS_BELOW60: TaxBracket[] = [
  { min: 0,         max: 250000,   rate: 0.00 },
  { min: 250001,    max: 500000,   rate: 0.05 },
  { min: 500001,    max: 1000000,  rate: 0.20 },
  { min: 1000001,   max: null,     rate: 0.30 },
];

// Old regime — 60 to 80 (Senior Citizen)
const OLD_REGIME_BRACKETS_60TO80: TaxBracket[] = [
  { min: 0,         max: 300000,   rate: 0.00 },
  { min: 300001,    max: 500000,   rate: 0.05 },
  { min: 500001,    max: 1000000,  rate: 0.20 },
  { min: 1000001,   max: null,     rate: 0.30 },
];

// Old regime — above 80 (Super Senior Citizen)
const OLD_REGIME_BRACKETS_ABOVE80: TaxBracket[] = [
  { min: 0,         max: 500000,   rate: 0.00 },
  { min: 500001,    max: 1000000,  rate: 0.20 },
  { min: 1000001,   max: null,     rate: 0.30 },
];

function getBrackets(regime: TaxRegime, age: AgeGroup): TaxBracket[] {
  if (regime === "new") return NEW_REGIME_BRACKETS;
  if (age === "60to80")  return OLD_REGIME_BRACKETS_60TO80;
  if (age === "above80") return OLD_REGIME_BRACKETS_ABOVE80;
  return OLD_REGIME_BRACKETS_BELOW60;
}

function calcIncomeTax(taxableIncome: number, regime: TaxRegime, age: AgeGroup): number {
  const brackets = getBrackets(regime, age);
  let tax = 0;
  for (const b of brackets) {
    if (taxableIncome <= (b.min === 0 ? 0 : b.min - 1)) break;
    const top = b.max ?? taxableIncome;
    const slice = Math.min(taxableIncome, top) - b.min + (b.min === 0 ? 0 : 1);
    if (slice <= 0) continue;
    tax += slice * b.rate;
  }
  return Math.max(0, tax);
}

// ── Section 87A Rebate ────────────────────────────────────────────

function calc87ARebate(taxableIncome: number, incomeTax: number, regime: TaxRegime): number {
  if (regime === "new") {
    // New regime: rebate up to ₹25,000 if income ≤ ₹7,00,000
    if (taxableIncome <= 700000) return Math.min(incomeTax, 25000);
  } else {
    // Old regime: rebate up to ₹12,500 if income ≤ ₹5,00,000
    if (taxableIncome <= 500000) return Math.min(incomeTax, 12500);
  }
  return 0;
}

// ── Surcharge ─────────────────────────────────────────────────────

function calcSurcharge(income: number, incomeTax: number, regime: TaxRegime): number {
  let surchargeRate = 0;
  if (income > 50000000) {       // > ₹5 Cr
    surchargeRate = regime === "new" ? 0.25 : 0.37;
  } else if (income > 20000000) { // > ₹2 Cr
    surchargeRate = 0.25;
  } else if (income > 10000000) { // > ₹1 Cr
    surchargeRate = 0.15;
  } else if (income > 5000000) {  // > ₹50 L
    surchargeRate = 0.10;
  }

  // Marginal relief: surcharge cannot exceed the income above the threshold
  const surcharge = incomeTax * surchargeRate;

  // Basic marginal relief (simplified)
  if (income > 5000000 && income <= 10000000) {
    const relief = (income - 5000000) - surcharge;
    if (relief < 0) return Math.max(0, surcharge + relief);
  }

  return surcharge;
}

// ── Cess ──────────────────────────────────────────────────────────
const CESS_RATE = 0.04; // 4% Health & Education Cess

// ── Standard Deduction ────────────────────────────────────────────
const STANDARD_DEDUCTION_NEW = 75000;  // Budget 2025
const STANDARD_DEDUCTION_OLD = 50000;

// ── Inputs & Result ───────────────────────────────────────────────

export interface OldRegimeDeductions {
  section80C: number;      // PPF, ELSS, LIC, EPF etc. Max ₹1,50,000
  section80D: number;      // Health insurance premium. Max varies
  hra: number;             // House Rent Allowance (exempt portion)
  lta: number;             // Leave Travel Allowance
  nps80CCD: number;        // NPS employer contribution u/s 80CCD(2) — no cap
  homeLoanInterest: number;// Section 24(b) — max ₹2,00,000 self-occ
  otherDeductions: number; // 80E, 80G, 80TTA etc.
}

export interface IndiaTaxInputs {
  grossIncome: number;          // ₹ annual gross salary / income
  employmentType: EmploymentType;
  age: AgeGroup;

  // Old regime deductions
  deductions: OldRegimeDeductions;

  // Compare both
  showComparison: boolean;
}

export interface RegimeResult {
  regime: TaxRegime;
  grossIncome: number;
  standardDeduction: number;
  totalDeductions: number;       // old regime only
  taxableIncome: number;
  grossIncomeTax: number;
  rebate87A: number;
  netIncomeTax: number;          // after rebate
  surcharge: number;
  cess: number;
  totalTax: number;              // netIncomeTax + surcharge + cess
  effectiveRate: number;         // totalTax / grossIncome * 100
  marginalRate: number;
  takeHomePay: number;           // grossIncome - totalTax
  monthlyTakeHome: number;
  monthlyTax: number;

  // Bracket breakdown
  brackets: BracketRow[];

  // Deduction detail (old regime)
  deductionBreakdown?: DeductionRow[];
}

export interface BracketRow {
  range: string;
  rate: string;
  taxableSlice: number;
  tax: number;
}

export interface DeductionRow {
  label: string;
  amount: number;
}

export interface IndiaTaxResult {
  newRegime: RegimeResult;
  oldRegime: RegimeResult;
  betterRegime: TaxRegime;
  savingsAmount: number; // ₹ saved by choosing better regime
}

// ─── Core calculation ──────────────────────────────────────────────

function calcRegime(
  regime: TaxRegime,
  inputs: IndiaTaxInputs,
): RegimeResult {
  const { grossIncome, age, deductions, employmentType } = inputs;

  const stdDeduction = employmentType === "salaried"
    ? (regime === "new" ? STANDARD_DEDUCTION_NEW : STANDARD_DEDUCTION_OLD)
    : 0; // self-employed don't get standard deduction

  // Total deductions (old regime only)
  let totalDeductions = 0;
  const deductionBreakdown: DeductionRow[] = [];

  if (regime === "old") {
    const items: { label: string; value: number; cap?: number }[] = [
      { label: "Standard deduction", value: stdDeduction },
      { label: "Section 80C (PPF, ELSS, LIC etc.)", value: deductions.section80C, cap: 150000 },
      { label: "Section 80D (health insurance)", value: deductions.section80D },
      { label: "HRA exemption", value: deductions.hra },
      { label: "Leave Travel Allowance (LTA)", value: deductions.lta },
      { label: "NPS — Section 80CCD(2)", value: deductions.nps80CCD },
      { label: "Home loan interest — Sec 24(b)", value: deductions.homeLoanInterest, cap: 200000 },
      { label: "Other deductions (80E, 80G etc.)", value: deductions.otherDeductions },
    ];
    for (const item of items) {
      const capped = item.cap ? Math.min(item.value, item.cap) : item.value;
      if (capped > 0) {
        totalDeductions += capped;
        deductionBreakdown.push({ label: item.label, amount: capped });
      }
    }
  } else {
    // New regime: only standard deduction
    totalDeductions = stdDeduction;
    if (stdDeduction > 0) {
      deductionBreakdown.push({ label: "Standard deduction", amount: stdDeduction });
    }
  }

  const taxableIncome = Math.max(0, grossIncome - totalDeductions);

  const grossIncomeTax = calcIncomeTax(taxableIncome, regime, age);
  const rebate87A      = calc87ARebate(taxableIncome, grossIncomeTax, regime);
  const netIncomeTax   = Math.max(0, grossIncomeTax - rebate87A);
  const surcharge      = calcSurcharge(taxableIncome, netIncomeTax, regime);
  const cess           = (netIncomeTax + surcharge) * CESS_RATE;
  const totalTax       = netIncomeTax + surcharge + cess;
  const takeHomePay    = grossIncome - totalTax;
  const effectiveRate  = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;

  // Marginal rate
  const brackets = getBrackets(regime, age);
  let marginalRate = 0;
  for (const b of brackets) {
    if (taxableIncome >= b.min) marginalRate = b.rate * 100;
  }

  // Bracket rows
  const bracketRows: BracketRow[] = getBrackets(regime, age)
    .filter(b => taxableIncome >= (b.min === 0 ? 0 : b.min))
    .map(b => {
      const top = b.max ?? taxableIncome;
      const taxableSlice = Math.max(0, Math.min(taxableIncome, top) - b.min + (b.min === 0 ? 0 : 1));
      return {
        range: b.max
          ? `₹${(b.min === 0 ? 0 : b.min).toLocaleString("en-IN")} – ₹${b.max.toLocaleString("en-IN")}`
          : `₹${b.min.toLocaleString("en-IN")}+`,
        rate: `${(b.rate * 100).toFixed(0)}%`,
        taxableSlice,
        tax: taxableSlice * b.rate,
      };
    });

  return {
    regime,
    grossIncome,
    standardDeduction: stdDeduction,
    totalDeductions,
    taxableIncome,
    grossIncomeTax,
    rebate87A,
    netIncomeTax,
    surcharge,
    cess,
    totalTax,
    effectiveRate,
    marginalRate,
    takeHomePay,
    monthlyTakeHome: takeHomePay / 12,
    monthlyTax: totalTax / 12,
    brackets: bracketRows,
    deductionBreakdown,
  };
}

export function calculateIndiaTax(inputs: IndiaTaxInputs): IndiaTaxResult {
  const newRegime = calcRegime("new", inputs);
  const oldRegime = calcRegime("old", inputs);

  const betterRegime: TaxRegime = newRegime.totalTax <= oldRegime.totalTax ? "new" : "old";
  const savingsAmount = Math.abs(newRegime.totalTax - oldRegime.totalTax);

  return { newRegime, oldRegime, betterRegime, savingsAmount };
}

// ─── Helpers ──────────────────────────────────────────────────────

export function fmtINR(n: number, dp = 0): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  }).format(Math.max(0, n));
}

export function fmtINRShort(n: number): string {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(2)} L`;
  if (n >= 1_000)      return `₹${(n / 1_000).toFixed(1)}k`;
  return `₹${Math.round(n)}`;
}

export function fmtPct(n: number, dp = 2): string {
  return `${n.toFixed(dp)}%`;
}

export const AGE_LABELS: Record<AgeGroup, string> = {
  below60: "Below 60 years",
  "60to80": "60–80 years (Senior Citizen)",
  above80: "Above 80 years (Super Senior Citizen)",
};
