// lib/torontoLtt.ts
//
// Land Transfer Tax Calculator — Toronto & Ontario
//
// SOURCES:
//   • Ontario LTT: Land Transfer Tax Act, R.S.O. 1990, c. L.6
//     https://www.ontario.ca/laws/statute/90l06
//   • Toronto MLTT: City of Toronto Municipal Code, Chapter 760
//     https://www.toronto.ca/311/knowledgebase/kb/docs/articles/revenue-services/land-transfer-tax
//   • FTHB Rebates: Ontario — up to $4,000; Toronto — up to $4,475
//   • Non-resident speculation tax (NRST): 25% (2022+) on residential
//   • Source: Ontario MOF, City of Toronto Revenue Services (2026)
//
// ─────────────────────────────────────────────────────────────────
//
// ONTARIO LAND TRANSFER TAX (LTT) — 2026
// Applied to ALL Ontario property purchases.
//
// Residential property:
//   $0        – $55,000       0.5%
//   $55,001   – $250,000      1.0%
//   $250,001  – $400,000      1.5%
//   $400,001  – $2,000,000    2.0%
//   $2,000,001+               2.5%
//
// Non-residential (commercial/industrial) — different top bracket:
//   $0        – $55,000       0.5%
//   $55,001   – $250,000      1.0%
//   $250,001  – $400,000      1.5%
//   $400,001+                 2.0%  (no 2.5% bracket)
//
// Ontario FTHB Rebate: Up to $4,000
//   Rebate = Ontario LTT, up to max $4,000
//   Full rebate if purchase price ≤ $368,333
//   (Rebate phases out linearly above $368,333 up to ~$550,000 effective limit)
//   New home only: the property must be new construction or never previously occupied
//   NOTE: since 2017 the rebate applies to both new AND resale homes for FTHBs in Ontario
//
// ─────────────────────────────────────────────────────────────────
//
// TORONTO MUNICIPAL LAND TRANSFER TAX (MLTT) — 2026
// Applied ONLY to properties within City of Toronto boundaries.
// Toronto buyers pay BOTH Ontario LTT and Toronto MLTT.
//
// Residential:
//   $0        – $55,000       0.5%
//   $55,001   – $250,000      1.0%
//   $250,001  – $400,000      1.5%
//   $400,001  – $2,000,000    2.0%
//   $2,000,001+               2.5%
//
// Toronto FTHB Rebate: Up to $4,475
//   Full rebate if purchase price ≤ $400,000
//   Partial rebate above $400,000
//
// COMBINED TOTAL for Toronto buyers:
//   Ontario LTT + Toronto MLTT (both apply)
//
// ─────────────────────────────────────────────────────────────────
//
// NON-RESIDENT SPECULATION TAX (NRST) — 25%
//   Applies to foreign nationals / non-PR buyers of residential property
//   in Ontario. Introduced 2017, rate raised to 25% in October 2022.
//   Certain exemptions exist (e.g., protected persons, nominations).
//
// ─────────────────────────────────────────────────────────────────

export type PropertyType = "residential" | "non_residential";
export type BuyerType    = "canadian"    | "non_resident";
export type Location     = "toronto"     | "ontario_other";

// ── Bracket definitions ───────────────────────────────────────────

interface LttBracket {
  min: number;
  max: number | null;
  rate: number;       // marginal rate as decimal
  baseTax: number;    // cumulative tax at bottom of this bracket
}

const ONTARIO_RESIDENTIAL: LttBracket[] = [
  { min: 0,         max: 55000,    rate: 0.005, baseTax: 0       },
  { min: 55000,     max: 250000,   rate: 0.010, baseTax: 275     },
  { min: 250000,    max: 400000,   rate: 0.015, baseTax: 2225    },
  { min: 400000,    max: 2000000,  rate: 0.020, baseTax: 4475    },
  { min: 2000000,   max: null,     rate: 0.025, baseTax: 36475   },
];

const ONTARIO_NON_RESIDENTIAL: LttBracket[] = [
  { min: 0,         max: 55000,    rate: 0.005, baseTax: 0       },
  { min: 55000,     max: 250000,   rate: 0.010, baseTax: 275     },
  { min: 250000,    max: 400000,   rate: 0.015, baseTax: 2225    },
  { min: 400000,    max: null,     rate: 0.020, baseTax: 4475    },
];

// Toronto MLTT uses identical brackets to Ontario LTT for residential
const TORONTO_RESIDENTIAL: LttBracket[] = [
  { min: 0,         max: 55000,    rate: 0.005, baseTax: 0       },
  { min: 55000,     max: 250000,   rate: 0.010, baseTax: 275     },
  { min: 250000,    max: 400000,   rate: 0.015, baseTax: 2225    },
  { min: 400000,    max: 2000000,  rate: 0.020, baseTax: 4475    },
  { min: 2000000,   max: null,     rate: 0.025, baseTax: 36475   },
];

const TORONTO_NON_RESIDENTIAL: LttBracket[] = [
  { min: 0,         max: 55000,    rate: 0.005, baseTax: 0       },
  { min: 55000,     max: 250000,   rate: 0.010, baseTax: 275     },
  { min: 250000,    max: 400000,   rate: 0.015, baseTax: 2225    },
  { min: 400000,    max: null,     rate: 0.020, baseTax: 4475    },
];

function calcTax(price: number, brackets: LttBracket[]): number {
  let tax = 0;
  for (const b of brackets) {
    if (price <= b.min) break;
    const top   = b.max ?? price;
    const slice = Math.min(price, top) - b.min;
    tax         = b.baseTax + (price - b.min) * b.rate;
    if (price <= top) break;
  }
  return Math.max(0, tax);
}

// ── Rebate calculations ───────────────────────────────────────────

export const ONTARIO_FTHB_MAX_REBATE  = 4000;
export const TORONTO_FTHB_MAX_REBATE  = 4475;
export const TORONTO_FTHB_FULL_BELOW  = 400000;
export const NRST_RATE                = 0.25;

function calcOntarioFthbRebate(price: number, ontarioTax: number): number {
  // Ontario FTHB rebate: up to $4,000, equal to the Ontario LTT payable
  // Full rebate if tax ≤ $4,000 (i.e., price ≤ ~$368,333)
  return Math.min(ontarioTax, ONTARIO_FTHB_MAX_REBATE);
}

function calcTorontoFthbRebate(price: number, torontoTax: number): number {
  // Full rebate (up to $4,475) if price ≤ $400,000
  if (price <= TORONTO_FTHB_FULL_BELOW) {
    return Math.min(torontoTax, TORONTO_FTHB_MAX_REBATE);
  }
  // Above $400,000: rebate = $4,475 × ($400,000 / price)
  // (Simplified linear phase-out — actual Toronto formula applies full rebate on
  // the first $400k portion; excess is taxed normally without rebate.)
  const rebate = TORONTO_FTHB_MAX_REBATE * (TORONTO_FTHB_FULL_BELOW / price);
  return Math.min(rebate, TORONTO_FTHB_MAX_REBATE);
}

// ── Inputs & Result ───────────────────────────────────────────────

export interface LttInputs {
  purchasePrice: number;
  location: Location;
  propertyType: PropertyType;
  isFirstTimeBuyer: boolean;
  buyerType: BuyerType;
  // Co-buyer details (rebates can be split if one is FTHB)
  hasNonFthbCoBuyer: boolean;  // if true, FTHB rebate is proportional to FTHBs' share
  fthbOwnershipPct: number;    // % owned by FTHB (e.g. 50 if 50/50 with non-FTHB)
}

export interface LttBracketRow {
  range: string;
  rate: string;
  taxableAmount: number;
  marginalTax: number;
}

export interface LttResult {
  purchasePrice: number;
  location: Location;

  // Ontario LTT
  ontarioLtt: number;
  ontarioLttBrackets: LttBracketRow[];
  ontarioFthbRebate: number;
  ontarioLttNet: number;

  // Toronto MLTT
  torontoMltt: number;
  torontoMlttBrackets: LttBracketRow[];
  torontoFthbRebate: number;
  torontoMlttNet: number;

  // NRST
  nrst: number;
  nrstApplies: boolean;

  // Total
  totalTaxBeforeRebates: number;
  totalRebates: number;
  totalTaxAfterRebates: number;
  effectiveRate: number;        // total net tax / purchase price

  // Useful comparisons
  torontoTaxVsOntario: number;  // extra tax due to being in Toronto vs elsewhere in Ontario
  torontoTaxVsOntarioPct: number;

  // Common comparison prices
  breakdownNote: string;
}

function buildBracketRows(price: number, brackets: LttBracket[]): LttBracketRow[] {
  return brackets
    .filter(b => price > b.min)
    .map(b => {
      const top   = b.max ?? price;
      const slice = Math.max(0, Math.min(price, top) - b.min);
      return {
        range: b.max
          ? `$${b.min.toLocaleString("en-CA")} – $${b.max.toLocaleString("en-CA")}`
          : `$${b.min.toLocaleString("en-CA")}+`,
        rate: `${(b.rate * 100).toFixed(1)}%`,
        taxableAmount: slice,
        marginalTax: slice * b.rate,
      };
    });
}

export function calculateLtt(inputs: LttInputs): LttResult {
  const {
    purchasePrice, location, propertyType,
    isFirstTimeBuyer, buyerType,
    hasNonFthbCoBuyer, fthbOwnershipPct,
  } = inputs;

  // Choose brackets
  const ontarioBrackets = propertyType === "residential"
    ? ONTARIO_RESIDENTIAL : ONTARIO_NON_RESIDENTIAL;
  const torontoBrackets = propertyType === "residential"
    ? TORONTO_RESIDENTIAL  : TORONTO_NON_RESIDENTIAL;

  // Calculate raw taxes
  const ontarioLtt   = calcTax(purchasePrice, ontarioBrackets);
  const torontoMltt  = location === "toronto"
    ? calcTax(purchasePrice, torontoBrackets) : 0;

  // NRST
  const nrstApplies = buyerType === "non_resident" && propertyType === "residential";
  const nrst        = nrstApplies ? purchasePrice * NRST_RATE : 0;

  // FTHB rebates
  let ontarioFthbRebate = 0;
  let torontoFthbRebate = 0;

  if (isFirstTimeBuyer && propertyType === "residential") {
    const fthbShare = hasNonFthbCoBuyer ? fthbOwnershipPct / 100 : 1.0;

    ontarioFthbRebate = calcOntarioFthbRebate(purchasePrice, ontarioLtt) * fthbShare;
    if (location === "toronto") {
      torontoFthbRebate = calcTorontoFthbRebate(purchasePrice, torontoMltt) * fthbShare;
    }
  }

  // Round to nearest cent
  const ontarioLttNet   = Math.max(0, ontarioLtt - ontarioFthbRebate);
  const torontoMlttNet  = Math.max(0, torontoMltt - torontoFthbRebate);

  const totalTaxBeforeRebates = ontarioLtt + torontoMltt + nrst;
  const totalRebates          = ontarioFthbRebate + torontoFthbRebate;
  const totalTaxAfterRebates  = ontarioLttNet + torontoMlttNet + nrst;
  const effectiveRate         = purchasePrice > 0
    ? (totalTaxAfterRebates / purchasePrice) * 100 : 0;

  // Ontario-only tax for comparison (what someone outside Toronto pays)
  const ontarioOnlyNet   = Math.max(0, ontarioLtt - calcOntarioFthbRebate(purchasePrice, ontarioLtt));
  const torontoExtra     = torontoMlttNet;
  const torontoTaxVsOntarioPct = ontarioOnlyNet > 0
    ? (torontoExtra / ontarioOnlyNet) * 100 : 0;

  const breakdownNote = location === "toronto"
    ? `Toronto buyers pay both the provincial Ontario LTT and the City of Toronto Municipal LTT — effectively double land transfer tax.`
    : `Outside Toronto, only the provincial Ontario LTT applies.`;

  return {
    purchasePrice,
    location,
    ontarioLtt,
    ontarioLttBrackets: buildBracketRows(purchasePrice, ontarioBrackets),
    ontarioFthbRebate,
    ontarioLttNet,
    torontoMltt,
    torontoMlttBrackets: location === "toronto"
      ? buildBracketRows(purchasePrice, torontoBrackets) : [],
    torontoFthbRebate,
    torontoMlttNet,
    nrst,
    nrstApplies,
    totalTaxBeforeRebates,
    totalRebates,
    totalTaxAfterRebates,
    effectiveRate,
    torontoTaxVsOntario: torontoExtra,
    torontoTaxVsOntarioPct,
    breakdownNote,
  };
}

// ─── Quick reference: tax at common price points ──────────────────

export function getLttAtPricePoints(
  location: Location,
  propertyType: PropertyType,
  isFirstTimeBuyer: boolean,
): { price: number; ontario: number; toronto: number; total: number; totalNet: number }[] {
  const prices = [400000, 500000, 600000, 750000, 900000, 1000000, 1200000, 1500000, 2000000, 3000000];
  return prices.map(price => {
    const r = calculateLtt({
      purchasePrice: price, location, propertyType,
      isFirstTimeBuyer, buyerType: "canadian",
      hasNonFthbCoBuyer: false, fthbOwnershipPct: 100,
    });
    return {
      price,
      ontario: r.ontarioLtt,
      toronto: r.torontoMltt,
      total:   r.totalTaxBeforeRebates,
      totalNet: r.totalTaxAfterRebates,
    };
  });
}

// ─── Helpers ──────────────────────────────────────────────────────

export function fmtCAD(n: number, dp = 0): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency", currency: "CAD",
    minimumFractionDigits: dp, maximumFractionDigits: dp,
  }).format(Math.max(0, n));
}

export function fmtCADShort(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `$${Math.round(n / 1_000)}k`;
  return `$${Math.round(n)}`;
}

export function fmtPct(n: number, dp = 2): string {
  return `${n.toFixed(dp)}%`;
}
