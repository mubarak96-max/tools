// lib/amazonFba.ts
// Amazon FBA UK fee calculator — accurate as of 2024/2025.
//
// Fee sources:
//   • Referral fees: https://sell.amazon.co.uk/pricing/referral-fees
//   • FBA fulfilment fees: https://sell.amazon.co.uk/pricing/fba-fees
//   • Storage fees: https://sell.amazon.co.uk/pricing/fba-storage-fees
//   • VAT: HMRC standard rate 20%
//
// IMPORTANT: Amazon updates fees periodically. Always verify against
// the official Amazon Seller Central fee schedule before making
// business decisions.
// ─────────────────────────────────────────────────────────────────

// ── REFERRAL FEE TABLE ────────────────────────────────────────────
// Tiered fees: some categories have price-based tiers.
// Each entry: { minPrice?, maxPrice?, rate } — rate as decimal.

export interface ReferralTier {
  maxPrice?: number; // if undefined, applies to all prices above minPrice
  rate: number; // decimal e.g. 0.15
}

export interface CategoryDefinition {
  id: string;
  label: string;
  tiers: ReferralTier[];
  minimumFee?: number; // minimum referral fee in £
}

export const CATEGORIES: CategoryDefinition[] = [
  // Electronics / tech (7%)
  { id: "electronics", label: "Electronics", tiers: [{ rate: 0.07 }], minimumFee: 0.25 },
  { id: "computers", label: "Computers", tiers: [{ rate: 0.07 }], minimumFee: 0.25 },
  { id: "camera", label: "Camera & Photo", tiers: [{ rate: 0.07 }], minimumFee: 0.25 },
  { id: "mobile", label: "Mobile Phones & Accessories", tiers: [{ rate: 0.07 }], minimumFee: 0.25 },
  { id: "video_games_console", label: "Video Game Consoles", tiers: [{ rate: 0.07 }], minimumFee: 0.25 },

  // Media (15%)
  { id: "books", label: "Books", tiers: [{ rate: 0.15 }], minimumFee: 0.25 },
  { id: "music", label: "Music", tiers: [{ rate: 0.15 }], minimumFee: 0.25 },
  { id: "dvd", label: "DVD & Blu-ray", tiers: [{ rate: 0.15 }], minimumFee: 0.25 },
  { id: "video_games", label: "Video Games", tiers: [{ rate: 0.15 }], minimumFee: 0.25 },
  { id: "software", label: "Software", tiers: [{ rate: 0.15 }], minimumFee: 0.25 },

  // General merchandise (15%)
  { id: "toys", label: "Toys & Games", tiers: [{ rate: 0.15 }], minimumFee: 0.25 },
  { id: "baby", label: "Baby Products", tiers: [{ rate: 0.15 }], minimumFee: 0.25 },
  { id: "beauty", label: "Beauty", tiers: [{ rate: 0.15 }], minimumFee: 0.25 },
  { id: "health", label: "Health & Personal Care", tiers: [{ rate: 0.15 }], minimumFee: 0.25 },
  { id: "sports", label: "Sports & Outdoors", tiers: [{ rate: 0.15 }], minimumFee: 0.25 },
  { id: "clothing", label: "Clothing & Accessories", tiers: [{ rate: 0.15 }], minimumFee: 0.25 },
  { id: "shoes", label: "Shoes & Bags", tiers: [{ rate: 0.15 }], minimumFee: 0.25 },
  { id: "kitchen", label: "Kitchen & Home", tiers: [{ rate: 0.15 }], minimumFee: 0.25 },
  { id: "home", label: "Home & Garden", tiers: [{ rate: 0.15 }], minimumFee: 0.25 },
  { id: "pet", label: "Pet Supplies", tiers: [{ rate: 0.15 }], minimumFee: 0.25 },
  { id: "stationery", label: "Stationery & Office", tiers: [{ rate: 0.15 }], minimumFee: 0.25 },
  { id: "musical", label: "Musical Instruments", tiers: [{ rate: 0.12 }], minimumFee: 0.25 },

  // Tiered categories
  {
    id: "jewellery",
    label: "Jewellery",
    tiers: [
      { maxPrice: 225, rate: 0.20 },
      { rate: 0.05 }, // over £225
    ],
    minimumFee: 0.25,
  },
  {
    id: "watches",
    label: "Watches",
    tiers: [
      { maxPrice: 225, rate: 0.15 },
      { rate: 0.05 },
    ],
    minimumFee: 0.25,
  },
  {
    id: "furniture",
    label: "Furniture & Décor",
    tiers: [
      { maxPrice: 100, rate: 0.15 },
      { rate: 0.10 },
    ],
    minimumFee: 0.25,
  },
  {
    id: "grocery",
    label: "Grocery & Gourmet",
    tiers: [
      { maxPrice: 10, rate: 0.08 },
      { rate: 0.15 },
    ],
    minimumFee: 0,
  },

  // Lower rate categories
  { id: "diy", label: "DIY & Tools", tiers: [{ rate: 0.12 }], minimumFee: 0.25 },
  { id: "automotive", label: "Automotive", tiers: [{ rate: 0.12 }], minimumFee: 0.25 },
  { id: "industrial", label: "Industrial & Scientific", tiers: [{ rate: 0.12 }], minimumFee: 0.25 },
];

export function getReferralFee(category: CategoryDefinition, salePrice: number): number {
  let fee = 0;
  let remaining = salePrice;

  for (let i = 0; i < category.tiers.length; i++) {
    const tier = category.tiers[i];

    if (tier.maxPrice === undefined) {
      // Final tier — applies to full remaining amount
      fee += remaining * tier.rate;
      break;
    } else {
      const tierCap = tier.maxPrice;
      const amountInTier = Math.min(remaining, Math.max(0, tierCap - (salePrice - remaining)));
      fee += amountInTier * tier.rate;
      remaining -= amountInTier;
      if (remaining <= 0) break;
    }
  }

  return Math.max(fee, category.minimumFee ?? 0);
}

// ── FBA FULFILMENT FEE TABLE (UK 2024) ────────────────────────────
// Based on dimensional weight / actual weight (whichever is greater)
// Dimensions: length × width × height

export type SizeClass =
  | "small_envelope"
  | "standard_envelope"
  | "large_envelope_s"
  | "large_envelope_l"
  | "small_parcel"
  | "standard_parcel"
  | "oversize";

export interface FbaFeeEntry {
  sizeClass: SizeClass;
  label: string;
  maxWeight: number; // grams
  fee: number; // £
}

// Non-media fulfilment fees
export const FBA_FEE_TABLE: FbaFeeEntry[] = [
  { sizeClass: "small_envelope", label: "Small envelope (≤80g)", maxWeight: 80, fee: 1.86 },
  { sizeClass: "standard_envelope", label: "Standard envelope (81–150g)", maxWeight: 150, fee: 2.04 },
  { sizeClass: "large_envelope_s", label: "Large envelope small (151–400g)", maxWeight: 400, fee: 2.44 },
  { sizeClass: "large_envelope_l", label: "Large envelope (401–900g)", maxWeight: 900, fee: 2.83 },
  { sizeClass: "small_parcel", label: "Small parcel (≤200g)", maxWeight: 200, fee: 2.70 },
  { sizeClass: "small_parcel", label: "Small parcel (201–500g)", maxWeight: 500, fee: 3.00 },
  { sizeClass: "small_parcel", label: "Small parcel (501g–1kg)", maxWeight: 1000, fee: 3.31 },
  { sizeClass: "small_parcel", label: "Small parcel (1–1.5kg)", maxWeight: 1500, fee: 3.77 },
  { sizeClass: "small_parcel", label: "Small parcel (1.5–2kg)", maxWeight: 2000, fee: 4.17 },
  { sizeClass: "standard_parcel", label: "Standard parcel (2–3kg)", maxWeight: 3000, fee: 4.80 },
  { sizeClass: "standard_parcel", label: "Standard parcel (3–4kg)", maxWeight: 4000, fee: 5.38 },
  { sizeClass: "standard_parcel", label: "Standard parcel (4–5kg)", maxWeight: 5000, fee: 5.87 },
  { sizeClass: "standard_parcel", label: "Standard parcel (5–6kg)", maxWeight: 6000, fee: 7.12 },
  { sizeClass: "standard_parcel", label: "Standard parcel (6–7kg)", maxWeight: 7000, fee: 7.61 },
  { sizeClass: "standard_parcel", label: "Standard parcel (7–8kg)", maxWeight: 8000, fee: 8.10 },
  { sizeClass: "standard_parcel", label: "Standard parcel (8–9kg)", maxWeight: 9000, fee: 8.59 },
  { sizeClass: "standard_parcel", label: "Standard parcel (9–10kg)", maxWeight: 10000, fee: 9.08 },
  { sizeClass: "standard_parcel", label: "Standard parcel (10–11kg)", maxWeight: 11000, fee: 9.57 },
  { sizeClass: "standard_parcel", label: "Standard parcel (11–12kg)", maxWeight: 12000, fee: 10.06 },
];

export const FBA_OVERSIZE_BASE = 10.06;
export const FBA_OVERSIZE_PER_KG = 0.49;

export function getFbaFulfilmentFee(weightGrams: number): { fee: number; label: string; sizeClass: SizeClass } {
  for (const entry of FBA_FEE_TABLE) {
    if (weightGrams <= entry.maxWeight) {
      return { fee: entry.fee, label: entry.label, sizeClass: entry.sizeClass };
    }
  }
  // Oversize
  const extraKg = Math.max(0, (weightGrams - 12000) / 1000);
  const fee = FBA_OVERSIZE_BASE + extraKg * FBA_OVERSIZE_PER_KG;
  return { fee, label: "Oversize", sizeClass: "oversize" };
}

// ── STORAGE FEE CALCULATION ───────────────────────────────────────
// Amazon charges per cubic foot per month.
// Standard: £0.50/ft³ Jan–Sep, £1.50/ft³ Oct–Dec
// We convert cm³ → ft³: 1 ft³ = 28,316.8 cm³

const CM3_PER_FT3 = 28316.8;

export function getMonthlyStorageFee(
  lengthCm: number,
  widthCm: number,
  heightCm: number,
  isPeakSeason: boolean // Oct–Dec
): number {
  const volumeCm3 = lengthCm * widthCm * heightCm;
  const volumeFt3 = volumeCm3 / CM3_PER_FT3;
  const ratePerFt3 = isPeakSeason ? 1.50 : 0.50;
  return volumeFt3 * ratePerFt3;
}

// ── MAIN CALCULATION ──────────────────────────────────────────────

export interface FbaInputs {
  // Product & pricing
  salePrice: number; // selling price inc VAT if VAT registered
  costPrice: number; // your cost per unit (what you pay supplier)
  categoryId: string;

  // Product dimensions & weight
  weightGrams: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;

  // Additional costs
  inboundShippingPerUnit: number; // cost to ship to Amazon FBA warehouse
  prepCostPerUnit: number; // labelling, bagging, prep costs
  otherCostsPerUnit: number; // PPC advertising, photography, etc.

  // Storage
  monthsStorage: number; // estimated months in storage per unit
  isPeakStorage: boolean; // Oct–Dec peak storage pricing

  // VAT
  vatRegistered: boolean; // if true, VAT on sale price is collected but not profit
  vatRatePct: number; // 20 standard, 5 reduced, 0 zero-rated

  // Seller plan
  sellerPlan: "individual" | "professional"; // individual = £0.75/sale, professional = £25/month (amortised)
  monthlyUnitsSold?: number; // needed to amortise professional plan fee
}

export interface FbaResult {
  // Revenue
  salePrice: number;
  salePriceExVat: number;
  vatOnSale: number;

  // Fees
  referralFee: number;
  referralFeePct: number;
  fbaFulfilmentFee: number;
  fbaFulfilmentLabel: string;
  storageFeemonthly: number;
  storageFeeTotalForHold: number;
  sellerPlanFeePerUnit: number;

  // Your costs
  costPrice: number;
  inboundShipping: number;
  prepCost: number;
  otherCosts: number;

  // Summary
  totalAmazonFees: number;
  totalCosts: number; // all costs inc Amazon fees
  netProfit: number;
  roi: number; // profit / cost price * 100
  margin: number; // profit / sale price * 100 (on ex-VAT price if VAT registered)
  breakEvenPrice: number; // minimum price to break even

  // Fee breakdown as % of sale price
  referralPctOfSale: number;
  fbaFulfilmentPctOfSale: number;
  storagePctOfSale: number;

  // Monthly projection (at given units/month)
  monthlyRevenue?: number;
  monthlyProfit?: number;
  monthlyAmazonFees?: number;
}

export function calculateFba(inputs: FbaInputs): FbaResult {
  const category = CATEGORIES.find((c) => c.id === inputs.categoryId) ?? CATEGORIES[0];

  // Sale price and VAT
  const vatRate = inputs.vatRegistered ? inputs.vatRatePct / 100 : 0;
  const salePriceExVat = inputs.vatRegistered
    ? inputs.salePrice / (1 + vatRate)
    : inputs.salePrice;
  const vatOnSale = inputs.salePrice - salePriceExVat;

  // Amazon referral fee is on the total sale price (inc VAT in UK)
  const referralFee = getReferralFee(category, inputs.salePrice);
  const referralFeePct = (referralFee / inputs.salePrice) * 100;

  // FBA fulfilment fee
  const { fee: fbaFulfilmentFee, label: fbaFulfilmentLabel } = getFbaFulfilmentFee(inputs.weightGrams);

  // Storage fee
  const storageFeemonthly = getMonthlyStorageFee(
    inputs.lengthCm,
    inputs.widthCm,
    inputs.heightCm,
    inputs.isPeakStorage
  );
  const storageFeeTotalForHold = storageFeemonthly * inputs.monthsStorage;

  // Seller plan fee per unit
  let sellerPlanFeePerUnit = 0;
  if (inputs.sellerPlan === "individual") {
    sellerPlanFeePerUnit = 0.75;
  } else {
    // Professional: £25/month inc VAT amortised across units sold
    const units = Math.max(1, inputs.monthlyUnitsSold ?? 1);
    sellerPlanFeePerUnit = 25 / units;
  }

  // Total Amazon fees
  const totalAmazonFees = referralFee + fbaFulfilmentFee + storageFeeTotalForHold + sellerPlanFeePerUnit;

  // Total all costs
  const totalCosts =
    inputs.costPrice +
    inputs.inboundShippingPerUnit +
    inputs.prepCostPerUnit +
    inputs.otherCostsPerUnit +
    totalAmazonFees;

  // Profit is on ex-VAT revenue (VAT collected goes to HMRC, not profit)
  const netProfit = salePriceExVat - totalCosts;

  const roi = inputs.costPrice > 0 ? (netProfit / inputs.costPrice) * 100 : 0;
  const margin = salePriceExVat > 0 ? (netProfit / salePriceExVat) * 100 : 0;

  // Break-even: find minimum sale price where profit = 0
  // salePriceExVat - referralFee - fbaFulfilmentFee - storage - plan - costPrice - shipping - prep - other = 0
  // This requires iterative solve since referral fee depends on price
  // Approximate: breakEven = (costPrice + inbound + prep + other + fbaFulfilmentFee + storage + plan) / (1 - referralRate)
  const primaryRate = category.tiers[0].rate;
  const fixedCosts = inputs.costPrice + inputs.inboundShippingPerUnit + inputs.prepCostPerUnit + inputs.otherCostsPerUnit + fbaFulfilmentFee + storageFeeTotalForHold + sellerPlanFeePerUnit;
  const breakEvenPrice = fixedCosts / (1 - primaryRate);

  // Monthly projections
  const units = inputs.monthlyUnitsSold ?? 0;
  const monthlyRevenue = units > 0 ? salePriceExVat * units : undefined;
  const monthlyProfit = units > 0 ? netProfit * units : undefined;
  const monthlyAmazonFees = units > 0 ? totalAmazonFees * units : undefined;

  return {
    salePrice: inputs.salePrice,
    salePriceExVat,
    vatOnSale,
    referralFee,
    referralFeePct,
    fbaFulfilmentFee,
    fbaFulfilmentLabel,
    storageFeemonthly,
    storageFeeTotalForHold,
    sellerPlanFeePerUnit,
    costPrice: inputs.costPrice,
    inboundShipping: inputs.inboundShippingPerUnit,
    prepCost: inputs.prepCostPerUnit,
    otherCosts: inputs.otherCostsPerUnit,
    totalAmazonFees,
    totalCosts,
    netProfit,
    roi,
    margin,
    breakEvenPrice,
    referralPctOfSale: (referralFee / inputs.salePrice) * 100,
    fbaFulfilmentPctOfSale: (fbaFulfilmentFee / inputs.salePrice) * 100,
    storagePctOfSale: (storageFeeTotalForHold / inputs.salePrice) * 100,
    monthlyRevenue,
    monthlyProfit,
    monthlyAmazonFees,
  };
}

export function formatGBP(n: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatPct(n: number, dp = 1): string {
  return `${n.toFixed(dp)}%`;
}
