// lib/etsyCalculator.ts
// Etsy Profit Calculator — accurate fee structure as of 2024/2025.
//
// Fee sources:
//   • Etsy Transaction Fee: 6.5% of sale price + shipping + gift wrap
//   • Etsy Listing Fee: $0.20 per listing (renewed every 4 months or on sale)
//   • Etsy Payment Processing: 3% + $0.25 (US), varies by country
//   • Etsy Offsite Ads: 15% (mandatory for sellers >$10k/yr), 12% optional
//   • Etsy Plus: $10/month optional subscription
//   • Pattern (Etsy website): $15/month optional
//
// IMPORTANT: Etsy updates fees periodically. Always verify against
// etsy.com/seller-fees before making business decisions.
// ─────────────────────────────────────────────────────────────────

export interface EtsyInputs {
  // Pricing
  salePrice: number;           // item listing price
  shippingCharged: number;     // shipping you charge buyer
  // Costs
  materialCost: number;        // cost of materials/COGS
  laborCost: number;           // your labor time value
  shippingCost: number;        // actual shipping you pay
  packagingCost: number;       // packaging materials
  otherCosts: number;          // misc (photo props, tools amortized, etc.)
  // Etsy fees
  currency: CurrencyCode;
  paymentProcessingCountry: ProcessingCountry;
  useOffsiteAds: boolean;
  offsiteAdsSales: OffsiteAdsThreshold; // under or over 10k annual
  listingFeeIncluded: boolean; // include $0.20 listing fee
  etsyPlusIncluded: boolean;   // apportion $10/mo Etsy Plus
  unitsPerMonth: number;       // to apportion fixed monthly costs
}

export type CurrencyCode = "USD" | "GBP" | "EUR" | "AUD" | "CAD";
export type ProcessingCountry = "US" | "UK" | "EU" | "AU" | "CA";
export type OffsiteAdsThreshold = "under10k" | "over10k";

export const CURRENCIES: Record<CurrencyCode, { symbol: string; label: string; processingFlat: number }> = {
  USD: { symbol: "$",  label: "US Dollar",        processingFlat: 0.25 },
  GBP: { symbol: "£",  label: "British Pound",     processingFlat: 0.20 },
  EUR: { symbol: "€",  label: "Euro",              processingFlat: 0.25 },
  AUD: { symbol: "A$", label: "Australian Dollar", processingFlat: 0.25 },
  CAD: { symbol: "C$", label: "Canadian Dollar",   processingFlat: 0.25 },
};

// Payment processing rates by country (Etsy Payments)
export const PROCESSING_RATES: Record<ProcessingCountry, { rate: number; label: string }> = {
  US: { rate: 0.03,   label: "United States (3%)" },
  UK: { rate: 0.04,   label: "United Kingdom (4%)" },
  EU: { rate: 0.04,   label: "European Union (4%)" },
  AU: { rate: 0.03,   label: "Australia (3%)" },
  CA: { rate: 0.03,   label: "Canada (3%)" },
};

export const LISTING_FEE_USD = 0.20;
export const TRANSACTION_FEE_RATE = 0.065; // 6.5%
export const OFFSITE_ADS_RATE_MANDATORY = 0.15; // >$10k sales
export const OFFSITE_ADS_RATE_OPTIONAL  = 0.12; // <$10k sales
export const ETSY_PLUS_MONTHLY = 10.00;

export interface EtsyFeeBreakdown {
  transactionFee: number;
  listingFee: number;
  processingFee: number;
  offsiteAdsFee: number;
  etsyPlusFee: number;
  totalEtsyFees: number;
}

export interface EtsyResults {
  // Revenue
  grossRevenue: number;    // sale + shipping charged
  // Costs
  totalCosts: number;
  // Fees
  fees: EtsyFeeBreakdown;
  // Profit
  netProfit: number;
  netMargin: number;       // as decimal
  roi: number;             // net profit / total costs as decimal
  profitPerHour: number;   // if labor > 0
  // Breakeven
  breakevenPrice: number;
}

export function calculateEtsy(inputs: EtsyInputs): EtsyResults {
  const cur = CURRENCIES[inputs.currency];
  const processingRate = PROCESSING_RATES[inputs.paymentProcessingCountry].rate;

  const grossRevenue = inputs.salePrice + inputs.shippingCharged;

  // ── Etsy Fees ────────────────────────────────────────────────────
  // Transaction fee: 6.5% on sale price + shipping + gift wrap
  const transactionFee = grossRevenue * TRANSACTION_FEE_RATE;

  // Listing fee: $0.20 per listing, charged in USD equivalent
  const listingFee = inputs.listingFeeIncluded ? LISTING_FEE_USD : 0;

  // Payment processing: rate% + flat fee on total
  const processingFee = inputs.paymentProcessingCountry !== "US"
    ? grossRevenue * processingRate + cur.processingFlat
    : grossRevenue * processingRate + cur.processingFlat;

  // Offsite ads: only on the sale price (not shipping)
  let offsiteAdsFee = 0;
  if (inputs.useOffsiteAds) {
    const adsRate = inputs.offsiteAdsSales === "over10k"
      ? OFFSITE_ADS_RATE_MANDATORY
      : OFFSITE_ADS_RATE_OPTIONAL;
    offsiteAdsFee = inputs.salePrice * adsRate;
  }

  // Etsy Plus: apportion monthly cost per unit
  const units = Math.max(inputs.unitsPerMonth, 1);
  const etsyPlusFee = inputs.etsyPlusIncluded ? ETSY_PLUS_MONTHLY / units : 0;

  const totalEtsyFees = transactionFee + listingFee + processingFee + offsiteAdsFee + etsyPlusFee;

  // ── Total Costs ──────────────────────────────────────────────────
  const totalCosts =
    inputs.materialCost +
    inputs.laborCost +
    inputs.shippingCost +
    inputs.packagingCost +
    inputs.otherCosts;

  // ── Profit ───────────────────────────────────────────────────────
  const netProfit = grossRevenue - totalEtsyFees - totalCosts;
  const netMargin = grossRevenue > 0 ? netProfit / grossRevenue : 0;
  const roi = totalCosts > 0 ? netProfit / totalCosts : 0;
  const profitPerHour = inputs.laborCost > 0 && netProfit > 0
    ? netProfit  // caller can divide by hours if desired
    : 0;

  // ── Break-even price (min sale price to cover all non-price costs) ─
  // Solve: price - 6.5%*price - processingRate*price - processingFlat - offsiteRate*price = totalCosts + listingFee
  // price * (1 - 0.065 - processingRate - offsiteRate) = totalCosts + listingFee + processingFlat
  const offsiteRateForBreakeven = inputs.useOffsiteAds
    ? (inputs.offsiteAdsSales === "over10k" ? OFFSITE_ADS_RATE_MANDATORY : OFFSITE_ADS_RATE_OPTIONAL)
    : 0;
  const deductionRate = TRANSACTION_FEE_RATE + processingRate + offsiteRateForBreakeven;
  const fixedFees = listingFee + cur.processingFlat + etsyPlusFee + inputs.shippingCost;
  const breakevenPrice = (totalCosts - inputs.shippingCost + fixedFees) / (1 - deductionRate);

  return {
    grossRevenue,
    totalCosts,
    fees: {
      transactionFee,
      listingFee,
      processingFee,
      offsiteAdsFee,
      etsyPlusFee,
      totalEtsyFees,
    },
    netProfit,
    netMargin,
    roi,
    profitPerHour,
    breakevenPrice: Math.max(breakevenPrice, 0),
  };
}

export function formatCurrency(amount: number, currency: CurrencyCode): string {
  return `${CURRENCIES[currency].symbol}${Math.abs(amount).toFixed(2)}`;
}

export function formatPct(decimal: number): string {
  return `${(decimal * 100).toFixed(1)}%`;
}
