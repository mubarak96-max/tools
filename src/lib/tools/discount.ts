export interface DiscountFromPercentResult {
  discountAmount: number;
  finalPrice: number;
  savingPercent: number;
}

export interface DiscountFromPricesResult {
  discountPercent: number;
  amountSaved: number;
  isGoodDeal: boolean;
}

export type CalculatorMode = "percent-to-price" | "price-to-percent";

export function calculateFinalPrice(
  originalPrice: number,
  discountPercent: number,
): DiscountFromPercentResult {
  if (originalPrice <= 0) {
    return { discountAmount: 0, finalPrice: 0, savingPercent: 0 };
  }

  const clampedDiscount = Math.min(Math.max(discountPercent, 0), 100);
  const discountAmount = (originalPrice * clampedDiscount) / 100;
  const finalPrice = Math.max(0, originalPrice - discountAmount);

  return {
    discountAmount,
    finalPrice,
    savingPercent: clampedDiscount,
  };
}

export function calculateDiscountPercent(
  originalPrice: number,
  salePrice: number,
): DiscountFromPricesResult {
  if (originalPrice <= 0 || salePrice < 0) {
    return { discountPercent: 0, amountSaved: 0, isGoodDeal: false };
  }

  const clampedSalePrice = Math.min(salePrice, originalPrice);
  const amountSaved = Math.max(0, originalPrice - clampedSalePrice);
  const discountPercent = originalPrice > 0 ? (amountSaved / originalPrice) * 100 : 0;

  return {
    discountPercent,
    amountSaved,
    isGoodDeal: discountPercent >= 20,
  };
}
