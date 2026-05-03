export type BuyerType =
  | "hk_resident_first"
  | "hk_resident_additional"
  | "non_resident";

export type PropertyType = "residential" | "non_residential";

export interface StampDutyResult {
  avd: number;
  avdRate: string;
  bsd: number;
  avd_additional: number;
  total: number;
  breakdown: BreakdownItem[];
  notes: string[];
  effectiveRate: string;
}

export interface BreakdownItem {
  label: string;
  amount: number;
  rate: string;
  description: string;
}

interface Scale1RateBracket {
  max: number;
  rate: number;
  flat: null;
  perBand: null;
}

interface Scale1ReliefBracket {
  max: number;
  rate: null;
  flat: number;
  perBand: { over: number; add: number };
}

type Scale1Bracket = Scale1RateBracket | Scale1ReliefBracket;

interface Scale2RateBracket {
  max: number;
  rate: number;
  flat: null;
}

interface Scale2ReliefBracket {
  max: number;
  rate: null;
  flat: number;
}

type Scale2Bracket = Scale2RateBracket | Scale2ReliefBracket;

const SCALE_1_BRACKETS: Scale1Bracket[] = [
  { max: 3_000_000, rate: 0.015, flat: null, perBand: null },
  { max: 3_528_240, rate: null, flat: 45_000, perBand: { over: 3_000_000, add: 45_000 } },
  { max: 4_500_000, rate: 0.02, flat: null, perBand: null },
  { max: 4_935_480, rate: null, flat: 90_000, perBand: { over: 4_500_000, add: 90_000 } },
  { max: 6_000_000, rate: 0.025, flat: null, perBand: null },
  { max: 6_642_860, rate: null, flat: 150_000, perBand: { over: 6_000_000, add: 150_000 } },
  { max: 9_000_000, rate: 0.03, flat: null, perBand: null },
  { max: 10_080_000, rate: null, flat: 270_000, perBand: { over: 9_000_000, add: 270_000 } },
  { max: 20_000_000, rate: 0.035, flat: null, perBand: null },
  { max: 21_739_120, rate: null, flat: 700_000, perBand: { over: 20_000_000, add: 700_000 } },
  { max: Number.POSITIVE_INFINITY, rate: 0.0425, flat: null, perBand: null },
] ;

const SCALE_2_BRACKETS: Scale2Bracket[] = [
  { max: 2_000_000, rate: 0.01, flat: null },
  { max: 2_351_760, rate: null, flat: 20_000 },
  { max: 3_000_000, rate: 0.015, flat: null },
  { max: 3_290_320, rate: null, flat: 45_000 },
  { max: 4_000_000, rate: 0.02, flat: null },
  { max: 4_428_570, rate: null, flat: 80_000 },
  { max: 6_000_000, rate: 0.025, flat: null },
  { max: 6_720_000, rate: null, flat: 150_000 },
  { max: 20_000_000, rate: 0.03, flat: null },
  { max: 21_739_130, rate: null, flat: 600_000 },
  { max: Number.POSITIVE_INFINITY, rate: 0.0375, flat: null },
] ;

function calcScale1(price: number): number {
  for (const bracket of SCALE_1_BRACKETS) {
    if (price <= bracket.max) {
      if (bracket.rate !== null) return Math.ceil(price * bracket.rate);
      return Math.ceil(bracket.perBand.add + (price - bracket.perBand.over));
    }
  }

  return 0;
}

function calcScale2(price: number): number {
  for (const bracket of SCALE_2_BRACKETS) {
    if (price <= bracket.max) {
      if (bracket.rate !== null) return Math.ceil(price * bracket.rate);
      return bracket.flat ?? 0;
    }
  }

  return 0;
}

export function calculateStampDuty(
  price: number,
  buyerType: BuyerType,
  propertyType: PropertyType,
): StampDutyResult {
  const breakdown: BreakdownItem[] = [];
  const notes: string[] = [];
  let avd = 0;
  let bsd = 0;
  let avdAdditional = 0;

  if (propertyType === "non_residential") {
    avd = calcScale2(price);
    const rate = price > 0 ? ((avd / price) * 100).toFixed(3) : "0";
    breakdown.push({
      label: "Ad Valorem Duty (AVD)",
      amount: avd,
      rate: `${rate}%`,
      description: "Scale 2 applies to all non-residential property purchases regardless of buyer type.",
    });
    notes.push("No Buyer's Stamp Duty applies to non-residential property.");
    notes.push("Special Stamp Duty for non-residential property was abolished on 28 October 2023.");
  } else if (buyerType === "hk_resident_first") {
    avd = calcScale1(price);
    const rate = price > 0 ? ((avd / price) * 100).toFixed(3) : "0";
    breakdown.push({
      label: "Ad Valorem Duty - Scale 1",
      amount: avd,
      rate: `${rate}%`,
      description: "Lower Scale 1 rates apply to Hong Kong permanent residents purchasing their first residential property.",
    });
    notes.push("Scale 1 applies because this scenario assumes a Hong Kong permanent resident buying a sole residential property.");
    notes.push("Buyer's Stamp Duty does not apply to this first-home Hong Kong permanent resident scenario.");
    notes.push("Special Stamp Duty on residential property was abolished on 26 February 2024.");
  } else if (buyerType === "hk_resident_additional") {
    avd = calcScale2(price);
    const rate = price > 0 ? ((avd / price) * 100).toFixed(3) : "0";
    breakdown.push({
      label: "Ad Valorem Duty - Scale 2",
      amount: avd,
      rate: `${rate}%`,
      description: "Scale 2 rates apply when a Hong Kong permanent resident already owns another residential property.",
    });
    avdAdditional = Math.ceil(price * 0.075);
    breakdown.push({
      label: "Additional Ad Valorem Duty",
      amount: avdAdditional,
      rate: "7.5%",
      description: "An additional 7.5% surcharge applies to a second or additional residential property purchase.",
    });
    notes.push("Additional AVD was reduced from 15% to 7.5% on 26 February 2024.");
    notes.push("This route models a second-plus residential purchase by a Hong Kong permanent resident.");
    notes.push("Special Stamp Duty on residential property was abolished on 26 February 2024.");
  } else {
    avd = calcScale2(price);
    const rate = price > 0 ? ((avd / price) * 100).toFixed(3) : "0";
    breakdown.push({
      label: "Ad Valorem Duty - Scale 2",
      amount: avd,
      rate: `${rate}%`,
      description: "Scale 2 rates apply to non-residents and corporate buyers.",
    });
    bsd = Math.ceil(price * 0.075);
    breakdown.push({
      label: "Buyer's Stamp Duty (BSD)",
      amount: bsd,
      rate: "7.5%",
      description: "BSD at 7.5% applies to non-Hong Kong permanent residents and companies buying residential property.",
    });
    notes.push("BSD was reduced from 15% to 7.5% effective 26 February 2024.");
    notes.push("If the buyer later becomes a Hong Kong permanent resident and the property remains the only residential holding, a BSD refund may be available.");
    notes.push("Special Stamp Duty on residential property was abolished on 26 February 2024.");
  }

  const total = avd + bsd + avdAdditional;
  const effectiveRate = price > 0 ? `${((total / price) * 100).toFixed(2)}%` : "0%";
  const avdRate = avd > 0 && price > 0 ? `${((avd / price) * 100).toFixed(3)}%` : "0%";

  return {
    avd,
    avdRate,
    bsd,
    avd_additional: avdAdditional,
    total,
    breakdown,
    notes,
    effectiveRate,
  };
}

export function formatHKD(amount: number): string {
  return new Intl.NumberFormat("en-HK", {
    style: "currency",
    currency: "HKD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function parsePrice(input: string): number {
  const cleaned = input.replace(/[HK$,\s]/gi, "");
  const parsed = Number.parseFloat(cleaned);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export const SCALE1_TABLE = [
  { range: "Up to HK$3,000,000", rate: "1.5%" },
  { range: "HK$3,000,001 - HK$4,500,000", rate: "2.0% with marginal relief" },
  { range: "HK$4,500,001 - HK$6,000,000", rate: "2.5% with marginal relief" },
  { range: "HK$6,000,001 - HK$9,000,000", rate: "3.0% with marginal relief" },
  { range: "HK$9,000,001 - HK$20,000,000", rate: "3.5% with marginal relief" },
  { range: "Above HK$20,000,000", rate: "4.25%" },
];

export const SCALE2_TABLE = [
  { range: "Up to HK$2,000,000", rate: "1.0%" },
  { range: "HK$2,000,001 - HK$3,000,000", rate: "1.5% with marginal relief" },
  { range: "HK$3,000,001 - HK$4,000,000", rate: "2.0% with marginal relief" },
  { range: "HK$4,000,001 - HK$6,000,000", rate: "2.5% with marginal relief" },
  { range: "HK$6,000,001 - HK$20,000,000", rate: "3.0% with marginal relief" },
  { range: "Above HK$20,000,000", rate: "3.75%" },
];
