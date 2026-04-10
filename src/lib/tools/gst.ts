export type GstMode = "add" | "remove";
export type SingaporeSupplyType = "standard-rated" | "zero-rated" | "exempt";

export interface GstResult {
  netAmount: number;
  gstAmount: number;
  grossAmount: number;
  gstRate: number;
}

export const SINGAPORE_GST_RATE = 9;

export function getSingaporeGstRate(supplyType: SingaporeSupplyType) {
  return supplyType === "standard-rated" ? SINGAPORE_GST_RATE : 0;
}

export function addSingaporeGst(netAmount: number, supplyType: SingaporeSupplyType): GstResult {
  const safeNetAmount = Math.max(0, netAmount);
  const gstRate = getSingaporeGstRate(supplyType);
  const gstAmount = safeNetAmount * (gstRate / 100);
  const grossAmount = safeNetAmount + gstAmount;

  return {
    netAmount: safeNetAmount,
    gstAmount,
    grossAmount,
    gstRate,
  };
}

export function removeSingaporeGst(grossAmount: number, supplyType: SingaporeSupplyType): GstResult {
  const safeGrossAmount = Math.max(0, grossAmount);
  const gstRate = getSingaporeGstRate(supplyType);

  if (gstRate === 0) {
    return {
      netAmount: safeGrossAmount,
      gstAmount: 0,
      grossAmount: safeGrossAmount,
      gstRate,
    };
  }

  const gstAmount = safeGrossAmount * (gstRate / (100 + gstRate));
  const netAmount = safeGrossAmount - gstAmount;

  return {
    netAmount,
    gstAmount,
    grossAmount: safeGrossAmount,
    gstRate,
  };
}
