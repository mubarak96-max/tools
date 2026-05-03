export type ScotlandBuyerType = "main-residence" | "first-time-buyer" | "additional-dwelling";
export type ScotlandPropertyType = "residential" | "non-residential";

export interface LBTTResult {
  propertyValue: number;
  propertyType: ScotlandPropertyType;
  buyerType: ScotlandBuyerType;
  totalLBTT: number;
  lbttOnly: number;
  adsOnly: number;
  effectiveRate: number;
  breakdown: {
    band: string;
    rate: number;
    amount: number;
    duty: number;
  }[];
  notes: string[];
  ftbSaving: number;
}

// Residential LBTT Bands (2024-25)
const RESIDENTIAL_BANDS = [
  { limit: 145000, rate: 0 },
  { limit: 105000, rate: 0.02 },  // £145,001 – £250,000
  { limit: 75000,  rate: 0.05 },  // £250,001 – £325,000
  { limit: 425000, rate: 0.10 },  // £325,001 – £750,000
  { limit: Infinity, rate: 0.12 }, // Above £750,000
];

// First-Time Buyer Relief (Scotland)
// Nil-rate band is raised to £175,000. 
// Relief only applies if price is above £145,000.
// If price is > £175,000, the relief is capped at the saving on the first £30k (£175k-£145k).
const FTB_THRESHOLD = 175000;
const STANDARD_NIL_THRESHOLD = 145000;

// Additional Dwelling Supplement (ADS) - 6% since Dec 2022/2024
const ADS_RATE = 0.06;
const ADS_THRESHOLD = 40000;

// Non-Residential LBTT Bands
const NON_RESIDENTIAL_BANDS = [
  { limit: 150000, rate: 0 },
  { limit: 100000, rate: 0.01 },  // £150,001 – £250,000
  { limit: Infinity, rate: 0.05 }, // Above £250,000
];

export function calculateScotlandLBTT(
  propertyValue: number,
  propertyType: ScotlandPropertyType,
  buyerType: ScotlandBuyerType
): LBTTResult {
  let totalLBTT = 0;
  let lbttOnly = 0;
  let adsOnly = 0;
  const breakdown: LBTTResult["breakdown"] = [];
  const notes: string[] = [];
  let ftbSaving = 0;

  if (propertyType === "non-residential") {
    let remainingValue = propertyValue;
    NON_RESIDENTIAL_BANDS.forEach((band, index) => {
      const taxableInBand = Math.min(remainingValue, band.limit);
      const duty = taxableInBand * band.rate;
      
      if (taxableInBand > 0 || index === 0) {
        const bandLabel = index === 0 
          ? `Up to £${band.limit.toLocaleString()}`
          : band.limit === Infinity 
            ? `Above £250,000`
            : `£150,001 – £250,000`;

        breakdown.push({
          band: bandLabel,
          rate: band.rate,
          amount: taxableInBand,
          duty: duty
        });
      }
      
      totalLBTT += duty;
      remainingValue -= taxableInBand;
    });
    lbttOnly = totalLBTT;
  } else {
    // Residential logic
    let remainingValue = propertyValue;
    
    // Calculate standard LBTT first
    RESIDENTIAL_BANDS.forEach((band, index) => {
      const taxableInBand = Math.min(remainingValue, band.limit);
      const duty = taxableInBand * band.rate;

      if (taxableInBand > 0 || index === 0) {
        let bandLabel = "";
        if (index === 0) bandLabel = `Up to £145,000`;
        else if (index === 1) bandLabel = `£145,001 – £250,000`;
        else if (index === 2) bandLabel = `£250,001 – £325,000`;
        else if (index === 3) bandLabel = `£325,001 – £750,000`;
        else bandLabel = `Above £750,000`;

        breakdown.push({
          band: bandLabel,
          rate: band.rate,
          amount: taxableInBand,
          duty: duty
        });
      }

      lbttOnly += duty;
      remainingValue -= taxableInBand;
    });

    // Apply First-Time Buyer Relief
    if (buyerType === "first-time-buyer") {
      // Standard tax on first £175k is (175,000 - 145,000) * 0.02 = £600
      // Relief wipes this £600 out.
      if (propertyValue > STANDARD_NIL_THRESHOLD) {
        const potentialSaving = Math.min(propertyValue, FTB_THRESHOLD) - STANDARD_NIL_THRESHOLD;
        ftbSaving = potentialSaving * 0.02; // Standard 2% rate in that band
        lbttOnly -= ftbSaving;
        
        // Update breakdown for the first band affected (the 2% band)
        if (breakdown[1]) {
          breakdown[1].duty -= ftbSaving;
        }
        
        notes.push("First-Time Buyer Relief applied (up to £600 saving).");
      }
    }

    // Apply ADS
    if (buyerType === "additional-dwelling" && propertyValue >= ADS_THRESHOLD) {
      adsOnly = propertyValue * ADS_RATE;
      notes.push(`Additional Dwelling Supplement (ADS) of 6% applied.`);
    }

    totalLBTT = lbttOnly + adsOnly;
  }

  const effectiveRate = propertyValue > 0 ? (totalLBTT / propertyValue) * 100 : 0;

  return {
    propertyValue,
    propertyType,
    buyerType,
    totalLBTT,
    lbttOnly,
    adsOnly,
    effectiveRate,
    breakdown,
    notes,
    ftbSaving
  };
}
