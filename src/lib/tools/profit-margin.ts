export interface MarginFromPricesResult {
  grossProfit: number;
  marginPercent: number;
  markupPercent: number;
  costPrice: number;
  sellingPrice: number;
}

export interface PriceFromMarginResult {
  sellingPrice: number;
  grossProfit: number;
  markupPercent: number;
  costPrice: number;
  targetMargin: number;
}

export interface PriceFromMarkupResult {
  sellingPrice: number;
  grossProfit: number;
  marginPercent: number;
  costPrice: number;
  markupPercent: number;
}

export interface MarginHealth {
  label: string;
  color: "green" | "amber" | "red";
  description: string;
}

export type MarginMode = "margin-from-prices" | "price-from-margin" | "price-from-markup";

export function calcMarginFromPrices(
  costPrice: number,
  sellingPrice: number,
): MarginFromPricesResult {
  if (costPrice < 0 || sellingPrice <= 0) {
    return {
      grossProfit: 0,
      marginPercent: 0,
      markupPercent: 0,
      costPrice,
      sellingPrice,
    };
  }

  const grossProfit = sellingPrice - costPrice;
  const marginPercent = (grossProfit / sellingPrice) * 100;
  const markupPercent = costPrice > 0 ? (grossProfit / costPrice) * 100 : 0;

  return {
    grossProfit,
    marginPercent,
    markupPercent,
    costPrice,
    sellingPrice,
  };
}

export function calcPriceFromMargin(
  costPrice: number,
  targetMargin: number,
): PriceFromMarginResult {
  if (costPrice < 0 || targetMargin < 0 || targetMargin >= 100) {
    return {
      sellingPrice: 0,
      grossProfit: 0,
      markupPercent: 0,
      costPrice,
      targetMargin,
    };
  }

  const sellingPrice = costPrice / (1 - targetMargin / 100);
  const grossProfit = sellingPrice - costPrice;
  const markupPercent = costPrice > 0 ? (grossProfit / costPrice) * 100 : 0;

  return {
    sellingPrice,
    grossProfit,
    markupPercent,
    costPrice,
    targetMargin,
  };
}

export function calcPriceFromMarkup(
  costPrice: number,
  markupPercent: number,
): PriceFromMarkupResult {
  if (costPrice < 0 || markupPercent < 0) {
    return {
      sellingPrice: 0,
      grossProfit: 0,
      marginPercent: 0,
      costPrice,
      markupPercent,
    };
  }

  const sellingPrice = costPrice * (1 + markupPercent / 100);
  const grossProfit = sellingPrice - costPrice;
  const marginPercent = sellingPrice > 0 ? (grossProfit / sellingPrice) * 100 : 0;

  return {
    sellingPrice,
    grossProfit,
    marginPercent,
    costPrice,
    markupPercent,
  };
}

export function getMarginHealth(marginPercent: number): MarginHealth {
  if (marginPercent < 0) {
    return { label: "Loss", color: "red", description: "Selling below cost" };
  }

  if (marginPercent < 5) {
    return { label: "Very thin", color: "red", description: "High risk and vulnerable to cost increases" };
  }

  if (marginPercent < 15) {
    return { label: "Thin", color: "amber", description: "Below average for many industries" };
  }

  if (marginPercent < 30) {
    return { label: "Healthy", color: "green", description: "Typical of many retail and service businesses" };
  }

  if (marginPercent < 50) {
    return { label: "Strong", color: "green", description: "Common in higher-margin service and software businesses" };
  }

  return { label: "Excellent", color: "green", description: "Very high margin business model" };
}
