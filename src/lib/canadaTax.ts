// lib/canadaTax.ts
//
// Canada GST / HST / PST / QST Calculator
//
// TAX SYSTEM OVERVIEW (2024-2026):
// ─────────────────────────────────────────────────────────────────
//
// Canada has three layers of sales tax depending on the province:
//
// 1. GST (Goods and Services Tax) — Federal, 5%
//    Applied in all provinces not part of HST.
//
// 2. HST (Harmonized Sales Tax) — Federal + Provincial combined
//    Some provinces merged their PST with the federal GST into a
//    single harmonized rate. Collected by CRA on behalf of province.
//    Provinces: ON (13%), NB (15%), NS (15%), NL (15%), PEI (15%)
//
// 3. PST (Provincial Sales Tax) — Provincial only
//    Charged separately from GST in BC, SK, MB.
//    BC: 7%, SK: 6%, MB: 7%
//
// 4. QST (Quebec Sales Tax) — Quebec's provincial tax
//    Applied on top of GST (but calculated on pre-GST amount).
//    QC: GST 5% + QST 9.975% = effective 14.975%
//
// 5. Alberta, territories (YT, NT, NU): GST only (5%)
//    No provincial sales tax.
//
// SOURCES:
//   • CRA: https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-which-rate.html
//   • BC PST: https://www2.gov.bc.ca/gov/content/taxes/sales-taxes/pst
//   • QST: https://www.revenuquebec.ca/en/businesses/consumption-taxes/gsthst-and-qst/
// ─────────────────────────────────────────────────────────────────

export type ProvinceCode =
  | "AB" | "BC" | "MB" | "NB" | "NL" | "NS"
  | "NT" | "NU" | "ON" | "PE" | "QC" | "SK" | "YT";

export type TaxType = "HST" | "GST+PST" | "GST+QST" | "GST";

export interface ProvinceDefinition {
  code: ProvinceCode;
  name: string;
  taxType: TaxType;
  gst: number;       // federal GST rate (decimal)
  pst: number;       // provincial PST/QST rate (decimal), 0 if HST province
  hst: number;       // HST combined rate (decimal), 0 if not HST province
  totalRate: number; // effective total rate (decimal)
  pstLabel: string;  // "PST", "QST", or ""
  notes?: string;
}

export const PROVINCES: ProvinceDefinition[] = [
  // HST provinces — single harmonized rate
  {
    code: "ON", name: "Ontario",
    taxType: "HST", gst: 0, pst: 0, hst: 0.13, totalRate: 0.13,
    pstLabel: "",
    notes: "HST 13% (5% federal + 8% provincial)",
  },
  {
    code: "NB", name: "New Brunswick",
    taxType: "HST", gst: 0, pst: 0, hst: 0.15, totalRate: 0.15,
    pstLabel: "",
    notes: "HST 15% (5% federal + 10% provincial)",
  },
  {
    code: "NS", name: "Nova Scotia",
    taxType: "HST", gst: 0, pst: 0, hst: 0.15, totalRate: 0.15,
    pstLabel: "",
    notes: "HST 15% (5% federal + 10% provincial)",
  },
  {
    code: "NL", name: "Newfoundland & Labrador",
    taxType: "HST", gst: 0, pst: 0, hst: 0.15, totalRate: 0.15,
    pstLabel: "",
    notes: "HST 15% (5% federal + 10% provincial)",
  },
  {
    code: "PE", name: "Prince Edward Island",
    taxType: "HST", gst: 0, pst: 0, hst: 0.15, totalRate: 0.15,
    pstLabel: "",
    notes: "HST 15% (5% federal + 10% provincial)",
  },

  // GST + PST provinces
  {
    code: "BC", name: "British Columbia",
    taxType: "GST+PST", gst: 0.05, pst: 0.07, hst: 0, totalRate: 0.12,
    pstLabel: "PST",
    notes: "GST 5% + PST 7% = 12%. PST applies to most goods but not all services.",
  },
  {
    code: "SK", name: "Saskatchewan",
    taxType: "GST+PST", gst: 0.05, pst: 0.06, hst: 0, totalRate: 0.11,
    pstLabel: "PST",
    notes: "GST 5% + PST 6% = 11%.",
  },
  {
    code: "MB", name: "Manitoba",
    taxType: "GST+PST", gst: 0.05, pst: 0.07, hst: 0, totalRate: 0.12,
    pstLabel: "RST",
    notes: "GST 5% + RST (Retail Sales Tax) 7% = 12%.",
  },

  // Quebec — GST + QST
  {
    code: "QC", name: "Quebec",
    taxType: "GST+QST", gst: 0.05, pst: 0.09975, hst: 0, totalRate: 0.14975,
    pstLabel: "QST",
    notes: "GST 5% + QST 9.975% = 14.975%. QST is calculated on the pre-tax amount (not on GST).",
  },

  // GST only — no provincial sales tax
  {
    code: "AB", name: "Alberta",
    taxType: "GST", gst: 0.05, pst: 0, hst: 0, totalRate: 0.05,
    pstLabel: "",
    notes: "GST only 5%. Alberta has no provincial sales tax — the only province without one.",
  },
  {
    code: "YT", name: "Yukon",
    taxType: "GST", gst: 0.05, pst: 0, hst: 0, totalRate: 0.05,
    pstLabel: "",
    notes: "GST only 5%.",
  },
  {
    code: "NT", name: "Northwest Territories",
    taxType: "GST", gst: 0.05, pst: 0, hst: 0, totalRate: 0.05,
    pstLabel: "",
    notes: "GST only 5%.",
  },
  {
    code: "NU", name: "Nunavut",
    taxType: "GST", gst: 0.05, pst: 0, hst: 0, totalRate: 0.05,
    pstLabel: "",
    notes: "GST only 5%.",
  },
];

export const PROVINCE_MAP = Object.fromEntries(
  PROVINCES.map((p) => [p.code, p])
) as Record<ProvinceCode, ProvinceDefinition>;

// ─── Calculation modes ─────────────────────────────────────────────
export type CalcMode = "add_tax" | "remove_tax";
// add_tax:    user enters pre-tax amount → calculate tax on top
// remove_tax: user enters tax-inclusive amount → extract the tax

export interface TaxResult {
  province: ProvinceDefinition;
  mode: CalcMode;
  inputAmount: number;

  // Pre-tax
  preTaxAmount: number;

  // Tax components
  gstAmount: number;      // GST or federal portion of HST
  pstAmount: number;      // PST / QST / provincial portion of HST
  hstAmount: number;      // total HST (if HST province)
  totalTaxAmount: number;

  // Post-tax
  totalWithTax: number;

  // Rates for display
  gstRate: number;
  pstRate: number;
  hstRate: number;
  totalRate: number;

  // Labels
  pstLabel: string;
  taxTypeLabel: string;
}

export function calculateTax(
  amount: number,
  provinceCode: ProvinceCode,
  mode: CalcMode
): TaxResult {
  const province = PROVINCE_MAP[provinceCode];
  let preTaxAmount: number;

  if (mode === "add_tax") {
    preTaxAmount = amount;
  } else {
    // Remove tax: pre-tax = total / (1 + totalRate)
    preTaxAmount = amount / (1 + province.totalRate);
  }

  let gstAmount = 0;
  let pstAmount = 0;
  let hstAmount = 0;

  if (province.taxType === "HST") {
    hstAmount = preTaxAmount * province.hst;
    // Split HST into federal/provincial for display
    gstAmount = preTaxAmount * 0.05;
    pstAmount = hstAmount - gstAmount;
  } else if (province.taxType === "GST+QST") {
    // QST is calculated on the pre-GST amount (not stacked on GST)
    gstAmount = preTaxAmount * province.gst;
    pstAmount = preTaxAmount * province.pst;
  } else if (province.taxType === "GST+PST") {
    gstAmount = preTaxAmount * province.gst;
    pstAmount = preTaxAmount * province.pst;
  } else {
    // GST only
    gstAmount = preTaxAmount * province.gst;
  }

  const totalTaxAmount = province.taxType === "HST" ? hstAmount : gstAmount + pstAmount;
  const totalWithTax = preTaxAmount + totalTaxAmount;

  const taxTypeLabel =
    province.taxType === "HST" ? "HST" :
    province.taxType === "GST+QST" ? "GST + QST" :
    province.taxType === "GST+PST" ? `GST + ${province.pstLabel}` :
    "GST";

  return {
    province,
    mode,
    inputAmount: amount,
    preTaxAmount,
    gstAmount,
    pstAmount,
    hstAmount,
    totalTaxAmount,
    totalWithTax,
    gstRate: province.taxType === "HST" ? 0.05 : province.gst,
    pstRate: province.pst,
    hstRate: province.hst,
    totalRate: province.totalRate,
    pstLabel: province.pstLabel,
    taxTypeLabel,
  };
}

// ─── Bulk / split calculation ──────────────────────────────────────
// Useful for showing tax on multiple items or comparing provinces

export function compareAllProvinces(amount: number, mode: CalcMode) {
  return PROVINCES.map((p) => calculateTax(amount, p.code, mode));
}

// ─── Formatting ────────────────────────────────────────────────────
export function fmtCAD(n: number, dp = 2): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  }).format(n);
}

export function fmtPct(n: number, dp = 3): string {
  // Remove trailing zeros e.g. 5.000% → 5%, 9.975% → 9.975%
  const str = (n * 100).toFixed(dp).replace(/\.?0+$/, "");
  return `${str}%`;
}
