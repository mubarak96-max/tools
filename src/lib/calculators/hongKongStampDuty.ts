// ─── TYPES ───────────────────────────────────────────────────────────────────

export type BuyerType =
  | "hk_resident_first"   // HK permanent resident, first property
  | "hk_resident_additional" // HK permanent resident, second/additional property
  | "non_resident"        // Non-HK permanent resident / company

export type PropertyType = "residential" | "non_residential"

export interface StampDutyResult {
  avd: number          // Ad Valorem Duty
  avdRate: string
  bsd: number          // Buyer's Stamp Duty (non-residents / companies)
  avd_additional: number // Additional AVD (extra 7.5% for second+ HK residents)
  total: number
  breakdown: BreakdownItem[]
  notes: string[]
  effectiveRate: string
}

export interface BreakdownItem {
  label: string
  amount: number
  rate: string
  description: string
}

// ─── CONSTANTS & LOGIC ────────────────────────────────────────────────────────

const SCALE_1_BRACKETS = [
  { max: 3_000_000,   rate: 0.015, flat: null, perBand: null },
  { max: 3_528_240,   rate: null,  flat: 45000, perBand: { over: 3_000_000, per: 1, add: 45000 } },
  { max: 4_500_000,   rate: 0.02,  flat: null, perBand: null },
  { max: 4_935_480,   rate: null,  flat: 90000, perBand: { over: 4_500_000, per: 1, add: 90000 } },
  { max: 6_000_000,   rate: 0.025, flat: null, perBand: null },
  { max: 6_642_860,   rate: null,  flat: 150000, perBand: { over: 6_000_000, per: 1, add: 150000 } },
  { max: 9_000_000,   rate: 0.03,  flat: null, perBand: null },
  { max: 10_080_000,  rate: null,  flat: 270000, perBand: { over: 9_000_000, per: 1, add: 270000 } },
  { max: 20_000_000,  rate: 0.035, flat: null, perBand: null },
  { max: 21_739_120,  rate: null,  flat: 700000, perBand: { over: 20_000_000, per: 1, add: 700000 } },
  { max: Infinity,    rate: 0.0425, flat: null, perBand: null },
]

const SCALE_2_BRACKETS = [
  { max: 2_000_000,   rate: 0.01 },
  { max: 2_351_760,   rate: null, flat: 20000 },
  { max: 3_000_000,   rate: 0.015 },
  { max: 3_290_320,   rate: null, flat: 45000 },
  { max: 4_000_000,   rate: 0.02 },
  { max: 4_428_570,   rate: null, flat: 80000 },
  { max: 6_000_000,   rate: 0.025 },
  { max: 6_720_000,   rate: null, flat: 150000 },
  { max: 20_000_000,  rate: 0.03 },
  { max: 21_739_130,  rate: null, flat: 600000 },
  { max: Infinity,    rate: 0.0375 },
]

function calcScale1(price: number): number {
  for (const b of SCALE_1_BRACKETS) {
    if (price <= b.max) {
      if (b.rate !== null) return Math.ceil(price * b.rate)
      return Math.ceil(b.perBand.add + (price - b.perBand.over))
    }
  }
  return 0
}

function calcScale2(price: number): number {
  for (const b of SCALE_2_BRACKETS) {
    if (price <= b.max) {
      if (b.rate !== null) return Math.ceil(price * b.rate)
      return b.flat!
    }
  }
  return 0
}

export function calculateStampDuty(
  price: number,
  buyerType: BuyerType,
  propertyType: PropertyType
): StampDutyResult {
  const breakdown: BreakdownItem[] = []
  const notes: string[] = []
  let avd = 0
  let bsd = 0
  let avd_additional = 0

  if (propertyType === "non_residential") {
    avd = calcScale2(price)
    const rate = (avd / price * 100).toFixed(3)
    breakdown.push({
      label: "Ad Valorem Duty (AVD)",
      amount: avd,
      rate: `${rate}%`,
      description: "Scale 2 rate applies to all non-residential properties regardless of buyer type.",
    })
    notes.push("No Buyer's Stamp Duty (BSD) applies to non-residential properties.")
  } else {
    if (buyerType === "hk_resident_first") {
      avd = calcScale1(price)
      const rate = (avd / price * 100).toFixed(3)
      breakdown.push({
        label: "AVD — Scale 1",
        amount: avd,
        rate: `${rate}%`,
        description: "Lower Scale 1 rates apply to HK permanent residents purchasing their first home.",
      })
      notes.push("Qualifies for Scale 1 (lower) rates as a first-time HK resident.")
    } else if (buyerType === "hk_resident_additional") {
      avd = calcScale2(price)
      const avdRate = (avd / price * 100).toFixed(3)
      breakdown.push({
        label: "AVD — Scale 2",
        amount: avd,
        rate: `${avdRate}%`,
        description: "Standard Scale 2 rates apply to additional property purchases.",
      })
      avd_additional = Math.ceil(price * 0.075)
      breakdown.push({
        label: "Additional AVD",
        amount: avd_additional,
        rate: "7.5%",
        description: "Additional 7.5% surcharge applies to 2nd+ residential properties.",
      })
      notes.push("7.5% Additional AVD applies (post-Feb 2024 policy).")
    } else {
      avd = calcScale2(price)
      const avdRate = (avd / price * 100).toFixed(3)
      breakdown.push({
        label: "AVD — Scale 2",
        amount: avd,
        rate: `${avdRate}%`,
        description: "Scale 2 rates apply to non-residents and companies.",
      })
      bsd = Math.ceil(price * 0.075)
      breakdown.push({
        label: "Buyer's Stamp Duty (BSD)",
        amount: bsd,
        rate: "7.5%",
        description: "7.5% surcharge applies to non-HK PRs and corporate buyers.",
      })
      notes.push("7.5% BSD applies (reduced from 15% in Feb 2024).")
    }
  }

  const total = avd + bsd + avd_additional
  const effectiveRate = price > 0 ? (total / price * 100).toFixed(2) + "%" : "0%"

  let avdRateStr = ""
  if (avd > 0 && price > 0) {
    avdRateStr = (avd / price * 100).toFixed(3) + "%"
  }

  return {
    avd, avdRate: avdRateStr, bsd, avd_additional, total, breakdown, notes, effectiveRate
  }
}

export function formatHKD(amount: number): string {
  return new Intl.NumberFormat("en-HK", {
    style: "currency", currency: "HKD", minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(amount)
}

export const SCALE1_TABLE = [
  { range: "Up to HK$3M", rate: "1.5%" },
  { range: "HK$3M – HK$4.5M", rate: "2.0%*" },
  { range: "HK$4.5M – HK$6M", rate: "2.5%*" },
  { range: "HK$6M – HK$9M", rate: "3.0%*" },
  { range: "HK$9M – HK$20M", rate: "3.5%*" },
  { range: "Above HK$20M", rate: "4.25%" },
]

export const SCALE2_TABLE = [
  { range: "Up to HK$2M", rate: "1.0%" },
  { range: "HK$2M – HK$3M", rate: "1.5%*" },
  { range: "HK$3M – HK$4M", rate: "2.0%*" },
  { range: "HK$4M – HK$6M", rate: "2.5%*" },
  { range: "HK$6M – HK$20M", rate: "3.0%*" },
  { range: "Above HK$20M", rate: "3.75%" },
]
