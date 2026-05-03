export type BuyerProfile =
  | "sc_first"
  | "sc_second"
  | "sc_third"
  | "spr_first"
  | "spr_second"
  | "foreigner"
  | "entity";

export type PropertyType = "residential" | "non_residential";

export interface StampDutyResult {
  bsd: number;
  bsdRate: string;
  absd: number;
  absdRate: string;
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

const BSD_BRACKETS = [
  { upTo: 180_000, rate: 0.01 },
  { upTo: 360_000, rate: 0.02 },
  { upTo: 1_000_000, rate: 0.03 },
  { upTo: 1_500_000, rate: 0.04 },
  { upTo: 3_000_000, rate: 0.05 },
  { upTo: Number.POSITIVE_INFINITY, rate: 0.06 },
] as const;

const ABSD_RATES: Record<BuyerProfile, number> = {
  sc_first: 0,
  sc_second: 0.2,
  sc_third: 0.3,
  spr_first: 0.05,
  spr_second: 0.3,
  foreigner: 0.6,
  entity: 0.65,
};

function calcBSD(price: number): number {
  let duty = 0;
  let previousUpper = 0;

  for (const bracket of BSD_BRACKETS) {
    const band = Math.min(price, bracket.upTo) - previousUpper;
    if (band <= 0) break;

    duty += band * bracket.rate;
    previousUpper = bracket.upTo;

    if (price <= bracket.upTo) break;
  }

  return Math.ceil(duty);
}

export function calculateStampDuty(
  price: number,
  profile: BuyerProfile,
  propertyType: PropertyType,
): StampDutyResult {
  const breakdown: BreakdownItem[] = [];
  const notes: string[] = [];
  const isResidential = propertyType === "residential";

  const bsd = calcBSD(price);
  const bsdEffectiveRate = price > 0 ? ((bsd / price) * 100).toFixed(3) : "0";

  breakdown.push({
    label: "Buyer's Stamp Duty (BSD)",
    amount: bsd,
    rate: `${bsdEffectiveRate}% effective`,
    description: isResidential
      ? "Progressive BSD: 1% on first S$180k, 2% on next S$180k, 3% on next S$640k, 4% on next S$500k, 5% on next S$1.5M, 6% above S$3M. Rates effective 15 Feb 2023."
      : "BSD on non-residential property follows the same progressive bands used here. No ABSD applies to non-residential property purchases.",
  });

  let absd = 0;
  let absdRate = 0;

  if (isResidential) {
    absdRate = ABSD_RATES[profile];
    absd = Math.ceil(price * absdRate);

    if (absdRate > 0) {
      breakdown.push({
        label: "Additional Buyer's Stamp Duty (ABSD)",
        amount: absd,
        rate: `${(absdRate * 100).toFixed(0)}%`,
        description: getAbsdDescription(profile),
      });
    } else {
      notes.push("No ABSD applies. Singapore Citizens buying their first residential property are exempt.");
    }

    notes.push(...getProfileNotes(profile));
  } else {
    notes.push("No ABSD applies to non-residential commercial or industrial property purchases.");
    notes.push("Seller's Stamp Duty may still apply if the property is resold within the holding period. Confirm the treatment with your conveyancer.");
  }

  const total = bsd + absd;

  return {
    bsd,
    bsdRate: `${bsdEffectiveRate}%`,
    absd,
    absdRate: `${(absdRate * 100).toFixed(0)}%`,
    total,
    breakdown,
    notes,
    effectiveRate: price > 0 ? `${((total / price) * 100).toFixed(2)}%` : "0%",
  };
}

function getAbsdDescription(profile: BuyerProfile): string {
  const descriptions: Record<BuyerProfile, string> = {
    sc_first: "",
    sc_second:
      "Singapore Citizens pay 20% ABSD on the purchase price of their second residential property. Raised from 17% on 27 Apr 2023.",
    sc_third:
      "Singapore Citizens pay 30% ABSD on their third and any subsequent residential property. Raised from 25% on 27 Apr 2023.",
    spr_first:
      "Singapore Permanent Residents pay 5% ABSD on their first residential property purchase.",
    spr_second:
      "Singapore Permanent Residents pay 30% ABSD on their second and subsequent residential property. Raised from 25% on 27 Apr 2023.",
    foreigner:
      "Foreigners pay 60% ABSD on any residential property purchase in Singapore. Raised from 30% on 27 Apr 2023.",
    entity:
      "Entities including companies and certain trusts pay 65% ABSD on residential property. Housing developers may apply for remission subject to conditions.",
  };

  return descriptions[profile];
}

function getProfileNotes(profile: BuyerProfile): string[] {
  const profileNotes: Record<BuyerProfile, string[]> = {
    sc_first: [
      "As a Singapore Citizen buying a first home, you benefit from 0% ABSD and pay BSD only.",
      "BSD still applies on a progressive basis across the full purchase price.",
    ],
    sc_second: [
      "The 20% ABSD applies even if the second property is intended as a replacement home.",
      "Married Singapore Citizen couples may qualify for ABSD remission on a replacement property if they meet the disposal timeline.",
    ],
    sc_third: [
      "The 30% ABSD applies from the contract date on third and later residential purchases.",
      "Replacement-property remission can still be relevant for some Singapore Citizen couples, but only if the statutory conditions are met.",
    ],
    spr_first: [
      "Singapore Permanent Residents pay 5% ABSD on a first residential property in addition to BSD.",
      "Later conversion to Singapore Citizenship does not create a refund of ABSD already paid on that first purchase.",
    ],
    spr_second: [
      "From the second residential purchase onward, Singapore PRs face a 30% ABSD rate under this schedule.",
      "Singapore PRs do not generally access the same replacement-property remission framework available to some Singapore Citizen couples.",
    ],
    foreigner: [
      "The 60% ABSD rate for foreigners was introduced on 27 April 2023 as part of Singapore's cooling measures.",
      "Nationals of Iceland, Liechtenstein, Norway, Switzerland, and the United States are treated as Singapore Citizens for ABSD purposes under the relevant free trade agreements.",
      "Becoming a Singapore PR or Citizen after purchase does not reverse ABSD already paid.",
    ],
    entity: [
      "Entities include companies, limited liability partnerships, and certain trust structures.",
      "Housing developers may qualify for ABSD remission if they satisfy redevelopment and sale conditions.",
      "Trust and corporate acquisitions need specialist legal and tax review because the relief rules are highly technical.",
    ],
  };

  return profileNotes[profile];
}

export function formatSGD(amount: number): string {
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function parsePrice(input: string): number {
  const cleaned = input.replace(/[S$,\s]/gi, "");
  const parsed = Number.parseFloat(cleaned);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export const BSD_TABLE = [
  { range: "First S$180,000", rate: "1%" },
  { range: "Next S$180,000", rate: "2%" },
  { range: "Next S$640,000", rate: "3%" },
  { range: "Next S$500,000", rate: "4%" },
  { range: "Next S$1,500,000", rate: "5%" },
  { range: "Remaining amount", rate: "6%" },
];

export const ABSD_TABLE = [
  { profile: "Singapore Citizen - 1st property", rate: "0%" },
  { profile: "Singapore Citizen - 2nd property", rate: "20%" },
  { profile: "Singapore Citizen - 3rd+ property", rate: "30%" },
  { profile: "Singapore PR - 1st property", rate: "5%" },
  { profile: "Singapore PR - 2nd+ property", rate: "30%" },
  { profile: "Foreigner", rate: "60%" },
  { profile: "Entity / Company", rate: "65%" },
];

export const BUYER_PROFILES: Array<{
  value: BuyerProfile;
  label: string;
  sub: string;
  group: "citizen" | "pr" | "other";
}> = [
  { value: "sc_first", label: "SC - 1st Property", sub: "0% ABSD", group: "citizen" },
  { value: "sc_second", label: "SC - 2nd Property", sub: "20% ABSD", group: "citizen" },
  { value: "sc_third", label: "SC - 3rd+ Property", sub: "30% ABSD", group: "citizen" },
  { value: "spr_first", label: "SPR - 1st Property", sub: "5% ABSD", group: "pr" },
  { value: "spr_second", label: "SPR - 2nd+ Property", sub: "30% ABSD", group: "pr" },
  { value: "foreigner", label: "Foreigner", sub: "60% ABSD", group: "other" },
  { value: "entity", label: "Entity / Company", sub: "65% ABSD", group: "other" },
];
