export type BuyerProfile = 
  | "sc-first" 
  | "sc-second" 
  | "sc-third" 
  | "pr-first" 
  | "pr-second" 
  | "pr-third" 
  | "foreigner" 
  | "foreigner-fta" 
  | "entity" 
  | "developer";

export type PropertyType = "residential" | "non-residential";

export interface StampDutyResult {
  bsd: number;
  absd: number;
  absdRate: number;
  ssd: number;
  ssdRate: number;
  totalDuty: number;
  effectiveRate: number;
  breakdown: {
    label: string;
    amount: number;
    rate?: string;
  }[];
}

export interface SSDInput {
  acquisitionDate: string; // YYYY-MM-DD
  disposalDate: string; // YYYY-MM-DD
  propertyValue: number;
}

// BSD Rates (Residential) - Updated 2023, valid 2025-2026
// 1% on first $180k, 2% on next $180k, 3% on next $640k, 
// 4% on next $500k, 5% on next $1.5M, 6% on remainder
export function calculateBSD(value: number, propertyType: PropertyType): number {
  if (propertyType === "non-residential") {
    // Non-residential: 1% first $180k, 2% next $180k, 3% remainder, max 5%
    let duty = 0;
    let remaining = value;
    
    const tiers = [
      { limit: 180000, rate: 0.01 },
      { limit: 180000, rate: 0.02 },
      { limit: Infinity, rate: 0.03 },
    ];
    
    for (const tier of tiers) {
      const taxable = Math.min(remaining, tier.limit);
      duty += taxable * tier.rate;
      remaining -= taxable;
      if (remaining <= 0) break;
    }
    
    // Cap at 5% for non-residential (simplified - actually tiered to 5% max)
    return Math.min(duty, value * 0.05);
  }

  let duty = 0;
  let remaining = value;

  const tiers = [
    { limit: 180000, rate: 0.01 },
    { limit: 180000, rate: 0.02 },
    { limit: 640000, rate: 0.03 },
    { limit: 500000, rate: 0.04 },
    { limit: 1500000, rate: 0.05 },
    { limit: Infinity, rate: 0.06 },
  ];

  for (const tier of tiers) {
    const taxable = Math.min(remaining, tier.limit);
    duty += taxable * tier.rate;
    remaining -= taxable;
    if (remaining <= 0) break;
  }

  return Math.floor(duty);
}

// ABSD Rates (as of 27 April 2023, valid 2025-2026)
export function getABSDRate(profile: BuyerProfile): number {
  const rates: Record<BuyerProfile, number> = {
    "sc-first": 0,
    "sc-second": 0.20,
    "sc-third": 0.30,
    "pr-first": 0.05,
    "pr-second": 0.30,
    "pr-third": 0.35,
    "foreigner": 0.60,
    "foreigner-fta": 0, // FTA nationals treated as SC
    "entity": 0.65,
    "developer": 0.40, // 35% + 5% non-remittable
  };
  return rates[profile] ?? 0;
}

export function calculateABSD(value: number, profile: BuyerProfile): number {
  const rate = getABSDRate(profile);
  return Math.floor(value * rate);
}

// SSD Rates - Major change 4 July 2025
// Pre-4 July 2025: 12% (≤1yr), 8% (>1-≤2yr), 4% (>2-≤3yr), 0% (>3yr)
// Post-4 July 2025: 16% (≤1yr), 12% (>1-≤2yr), 8% (>2-≤3yr), 4% (>3-≤4yr), 0% (>4yr)
export function calculateSSD(input: SSDInput): { amount: number; rate: number } {
  const { acquisitionDate, disposalDate, propertyValue } = input;
  
  const acquired = new Date(acquisitionDate);
  const disposed = new Date(disposalDate);
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysHeld = Math.floor((disposed.getTime() - acquired.getTime()) / msPerDay);
  const yearsHeld = daysHeld / 365.25;

  // Determine which regime applies
  const regimeChangeDate = new Date("2025-07-04");
  const isNewRegime = acquired >= regimeChangeDate;

  let rate = 0;

  if (isNewRegime) {
    if (yearsHeld <= 1) rate = 0.16;
    else if (yearsHeld <= 2) rate = 0.12;
    else if (yearsHeld <= 3) rate = 0.08;
    else if (yearsHeld <= 4) rate = 0.04;
    else rate = 0;
  } else {
    // Properties acquired between 11 Mar 2017 and 3 Jul 2025
    if (yearsHeld <= 1) rate = 0.12;
    else if (yearsHeld <= 2) rate = 0.08;
    else if (yearsHeld <= 3) rate = 0.04;
    else rate = 0;
  }

  return {
    amount: Math.floor(propertyValue * rate),
    rate,
  };
}

export function calculateTotalStampDuty(
  propertyValue: number,
  profile: BuyerProfile,
  propertyType: PropertyType,
  ssdInput?: SSDInput
): StampDutyResult {
  const bsd = calculateBSD(propertyValue, propertyType);
  const absd = propertyType === "residential" ? calculateABSD(propertyValue, profile) : 0;
  const absdRate = propertyType === "residential" ? getABSDRate(profile) : 0;
  
  let ssd = 0;
  let ssdRate = 0;
  
  if (ssdInput && propertyType === "residential") {
    const ssdResult = calculateSSD(ssdInput);
    ssd = ssdResult.amount;
    ssdRate = ssdResult.rate;
  }

  const totalDuty = bsd + absd + ssd;
  const effectiveRate = propertyValue > 0 ? (totalDuty / propertyValue) * 100 : 0;

  const breakdown = [
    { label: "Buyer's Stamp Duty (BSD)", amount: bsd, rate: propertyType === "residential" ? "1%–6%" : "1%–5%" },
  ];

  if (absd > 0) {
    breakdown.push({ 
      label: "Additional Buyer's Stamp Duty (ABSD)", 
      amount: absd, 
      rate: `${(absdRate * 100).toFixed(0)}%` 
    });
  }

  if (ssd > 0) {
    breakdown.push({ 
      label: "Seller's Stamp Duty (SSD)", 
      amount: ssd, 
      rate: `${(ssdRate * 100).toFixed(0)}%` 
    });
  }

  return {
    bsd,
    absd,
    absdRate,
    ssd,
    ssdRate,
    totalDuty,
    effectiveRate,
    breakdown,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getProfileLabel(profile: BuyerProfile): string {
  const labels: Record<BuyerProfile, string> = {
    "sc-first": "Singapore Citizen — 1st Property",
    "sc-second": "Singapore Citizen — 2nd Property",
    "sc-third": "Singapore Citizen — 3rd Property+",
    "pr-first": "Permanent Resident — 1st Property",
    "pr-second": "Permanent Resident — 2nd Property",
    "pr-third": "Permanent Resident — 3rd Property+",
    "foreigner": "Foreigner (Non-FTA)",
    "foreigner-fta": "Foreigner (FTA National — US/EFTA)",
    "entity": "Company / Entity / Trust",
    "developer": "Housing Developer",
  };
  return labels[profile];
}
