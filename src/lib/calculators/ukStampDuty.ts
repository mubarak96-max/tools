export type BuyerType = "standard" | "first-time" | "additional" | "non-resident" | "first-time-additional";
export type PropertyLocation = "england-ni" | "scotland" | "wales";

export interface SDLTResult {
  propertyValue: number;
  buyerType: BuyerType;
  location: PropertyLocation;
  totalSDLT: number;
  effectiveRate: number;
  breakdown: {
    band: string;
    rate: number;
    amount: number;
    duty: number;
  }[];
  notes: string[];
}

// Standard Residential Rates (England & NI) — from 1 April 2025
const STANDARD_BANDS = [
  { limit: 125000, rate: 0 },
  { limit: 125000, rate: 0.02 },      // £125,001–£250,000
  { limit: 675000, rate: 0.05 },      // £250,001–£925,000
  { limit: 575000, rate: 0.10 },      // £925,001–£1,500,000
  { limit: Infinity, rate: 0.12 },    // Above £1,500,000
];

// First-Time Buyer Rates — from 1 April 2025
// 0% up to £300k, 5% on £300,001–£500,000
// If over £500,000, standard rates apply
const FIRST_TIME_BANDS = [
  { limit: 300000, rate: 0 },
  { limit: 200000, rate: 0.05 },      // £300,001–£500,000
];

// Additional Property Surcharge — 5% on every band from 31 Oct 2024
const ADDITIONAL_SURCHARGE = 0.05;

// Non-UK Resident Surcharge — 2% on every band
const NON_RESIDENT_SURCHARGE = 0.02;

function calculateTieredDuty(value: number, bands: { limit: number; rate: number }[]): number {
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

function getBandsWithSurcharge(
  baseBands: { limit: number; rate: number }[],
  surcharge: number
): { limit: number; rate: number }[] {
  return baseBands.map((b) => ({
    limit: b.limit,
    rate: b.rate + surcharge,
  }));
}

function getBreakdown(
  value: number,
  bands: { limit: number; rate: number }[]
): SDLTResult["breakdown"] {
  const breakdown: SDLTResult["breakdown"] = [];
  let remaining = value;
  let currentMin = 0;

  const labels = [
    "Up to £125,000",
    "£125,001 – £250,000",
    "£250,001 – £925,000",
    "£925,001 – £1,500,000",
    "Above £1,500,000",
  ];

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

export function calculateSDLT(
  propertyValue: number,
  buyerType: BuyerType,
  location: PropertyLocation = "england-ni"
): SDLTResult {
  const notes: string[] = [];
  let totalSDLT = 0;
  let bands: { limit: number; rate: number }[] = [];
  let breakdown: SDLTResult["breakdown"] = [];

  if (location !== "england-ni") {
    notes.push(
      location === "scotland"
        ? "Scotland uses Land and Buildings Transaction Tax (LBTT), not SDLT. This calculator shows approximate equivalent rates."
        : "Wales uses Land Transaction Tax (LTT), not SDLT. This calculator shows approximate equivalent rates."
    );
  }

  // First-time buyer logic
  if (buyerType === "first-time") {
    if (propertyValue <= 500000) {
      bands = FIRST_TIME_BANDS;
      totalSDLT = calculateTieredDuty(propertyValue, bands);
      breakdown = getBreakdown(propertyValue, bands);
      notes.push("First-time buyer relief applied: 0% on first £300,000, 5% on £300,001–£500,000.");
    } else {
      // Over £500k — standard rates apply, no relief
      buyerType = "standard";
      notes.push("First-time buyer relief not available for properties over £500,000. Standard rates apply.");
    }
  }

  // Standard buyer
  if (buyerType === "standard") {
    bands = STANDARD_BANDS;
    totalSDLT = calculateTieredDuty(propertyValue, bands);
    breakdown = getBreakdown(propertyValue, bands);
  }

  // Additional property (second home / buy-to-let)
  if (buyerType === "additional") {
    bands = getBandsWithSurcharge(STANDARD_BANDS, ADDITIONAL_SURCHARGE);
    totalSDLT = calculateTieredDuty(propertyValue, bands);
    breakdown = getBreakdown(propertyValue, bands);
    notes.push("5% additional property surcharge applied to all bands (increased from 3% on 31 October 2024).");
  }

  // Non-UK resident
  if (buyerType === "non-resident") {
    bands = getBandsWithSurcharge(STANDARD_BANDS, NON_RESIDENT_SURCHARGE);
    totalSDLT = calculateTieredDuty(propertyValue, bands);
    breakdown = getBreakdown(propertyValue, bands);
    notes.push("2% non-UK resident surcharge applied. You may reclaim this if you become UK resident within 2 years.");
  }

  // First-time buyer buying additional property (rare edge case)
  if (buyerType === "first-time-additional") {
    // No first-time relief, but also no additional property surcharge because they only own one
    bands = STANDARD_BANDS;
    totalSDLT = calculateTieredDuty(propertyValue, bands);
    breakdown = getBreakdown(propertyValue, bands);
    notes.push("As a first-time buyer purchasing a buy-to-let, you do not pay the additional property surcharge, but first-time buyer relief does not apply either.");
  }

  const effectiveRate = propertyValue > 0 ? (totalSDLT / propertyValue) * 100 : 0;

  return {
    propertyValue,
    buyerType,
    location,
    totalSDLT,
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

export function getBuyerTypeLabel(type: BuyerType): string {
  const labels: Record<BuyerType, string> = {
    standard: "Standard / Home Mover",
    "first-time": "First-Time Buyer",
    additional: "Additional Property / Buy-to-Let",
    "non-resident": "Non-UK Resident",
    "first-time-additional": "First-Time Buyer (Buy-to-Let)",
  };
  return labels[type];
}
