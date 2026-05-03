export type WalesBuyerType = "main-residence" | "additional-property" | "company" | "trust";

export interface LTTResult {
  propertyValue: number;
  buyerType: WalesBuyerType;
  totalLTT: number;
  effectiveRate: number;
  breakdown: {
    band: string;
    rate: number;
    amount: number;
    duty: number;
  }[];
  notes: string[];
}

// Main Residential Rates (Wales) — effective from 10 October 2022
const MAIN_RESIDENTIAL_BANDS = [
  { limit: 225000, rate: 0 },
  { limit: 175000, rate: 0.06 },    // £225,001 – £400,000
  { limit: 350000, rate: 0.075 },   // £400,001 – £750,000
  { limit: 750000, rate: 0.10 },    // £750,001 – £1,500,000
  { limit: Infinity, rate: 0.12 },  // Above £1,500,000
];

// Higher Residential Rates (Additional Property) — effective from 11 December 2024
const HIGHER_RESIDENTIAL_BANDS = [
  { limit: 180000, rate: 0.05 },
  { limit: 70000, rate: 0.085 },    // £180,001 – £250,000
  { limit: 150000, rate: 0.10 },    // £250,001 – £400,000
  { limit: 350000, rate: 0.125 },   // £400,001 – £750,000
  { limit: 750000, rate: 0.15 },    // £750,001 – £1,500,000
  { limit: Infinity, rate: 0.17 },  // Above £1,500,000
];

function calculateTieredDuty(
  value: number,
  bands: { limit: number; rate: number }[]
): number {
  let duty = 0;
  let remaining = value;

  for (const band of bands) {
    const taxable = Math.min(remaining, band.limit);
    duty += taxable * band.rate;
    remaining -= taxable;
    if (remaining <= 0) break;
  }

  return Math.round(duty);
}

function getBreakdown(
  value: number,
  bands: { limit: number; rate: number }[],
  labels: string[]
): LTTResult["breakdown"] {
  const breakdown: LTTResult["breakdown"] = [];
  let remaining = value;
  let currentMin = 0;

  for (let i = 0; i < bands.length; i++) {
    const band = bands[i];
    const taxable = Math.min(remaining, band.limit);
    if (taxable <= 0) break;

    const maxVal = currentMin + band.limit;
    const label =
      band.limit === Infinity
        ? `Above £${currentMin.toLocaleString("en-GB")}`
        : `£${(currentMin + 1).toLocaleString("en-GB")} – £${Math.min(maxVal, value).toLocaleString("en-GB")}`;

    breakdown.push({
      band: labels[i] || label,
      rate: band.rate,
      amount: taxable,
      duty: Math.round(taxable * band.rate),
    });

    remaining -= taxable;
    currentMin += band.limit;
  }

  return breakdown;
}

export function calculateLTT(
  propertyValue: number,
  buyerType: WalesBuyerType
): LTTResult {
  const notes: string[] = [];
  let totalLTT = 0;
  let breakdown: LTTResult["breakdown"] = [];

  const mainLabels = [
    "Up to £225,000",
    "£225,001 – £400,000",
    "£400,001 – £750,000",
    "£750,001 – £1,500,000",
    "Above £1,500,000",
  ];

  const higherLabels = [
    "Up to £180,000",
    "£180,001 – £250,000",
    "£250,001 – £400,000",
    "£400,001 – £750,000",
    "£750,001 – £1,500,000",
    "Above £1,500,000",
  ];

  if (buyerType === "main-residence") {
    totalLTT = calculateTieredDuty(propertyValue, MAIN_RESIDENTIAL_BANDS);
    breakdown = getBreakdown(propertyValue, MAIN_RESIDENTIAL_BANDS, mainLabels);
    if (propertyValue <= 225000) {
      notes.push("No LTT is payable on main residences up to £225,000.");
    }
  } else if (buyerType === "additional-property") {
    totalLTT = calculateTieredDuty(propertyValue, HIGHER_RESIDENTIAL_BANDS);
    breakdown = getBreakdown(propertyValue, HIGHER_RESIDENTIAL_BANDS, higherLabels);
    notes.push("Higher residential rates apply. You may be able to claim a refund if you sell your previous main residence within 36 months.");
  } else if (buyerType === "company" || buyerType === "trust") {
    totalLTT = calculateTieredDuty(propertyValue, HIGHER_RESIDENTIAL_BANDS);
    breakdown = getBreakdown(propertyValue, HIGHER_RESIDENTIAL_BANDS, higherLabels);
    notes.push(
      buyerType === "company"
        ? "Companies must pay higher residential rates on all residential property purchases over £40,000 (unless the property has a short lease of 21 years or less)."
        : "Trusts may be liable for higher residential rates depending on the beneficiaries' property ownership."
    );
  }

  const effectiveRate = propertyValue > 0 ? (totalLTT / propertyValue) * 100 : 0;

  return {
    propertyValue,
    buyerType,
    totalLTT,
    effectiveRate,
    breakdown,
    notes,
  };
}

export function formatCurrencyGBP(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getBuyerTypeLabel(type: WalesBuyerType): string {
  const labels: Record<WalesBuyerType, string> = {
    "main-residence": "Main Residence / First Home",
    "additional-property": "Additional Property / Second Home / Buy-to-Let",
    company: "Company / Corporate Body",
    trust: "Trust",
  };
  return labels[type];
}
