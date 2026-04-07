export interface VATResult {
  netPrice: number;
  vatAmount: number;
  grossPrice: number;
  vatRate: number;
}

export type VATMode = "add" | "remove";

export interface VATRate {
  rate: number;
  label: string;
}

export interface VATCountry {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  locale: string;
  standardRate: number;
  reducedRates: VATRate[];
  taxName: string;
  featured: boolean;
}

export function addVAT(netPrice: number, vatRate: number): VATResult {
  if (netPrice < 0 || vatRate < 0) {
    return { netPrice: 0, vatAmount: 0, grossPrice: 0, vatRate: 0 };
  }

  const rate = vatRate / 100;
  const vatAmount = netPrice * rate;
  const grossPrice = netPrice + vatAmount;

  return {
    netPrice,
    vatAmount,
    grossPrice,
    vatRate,
  };
}

export function removeVAT(grossPrice: number, vatRate: number): VATResult {
  if (grossPrice < 0 || vatRate < 0) {
    return { netPrice: 0, vatAmount: 0, grossPrice: 0, vatRate: 0 };
  }

  const vatAmount = grossPrice * (vatRate / (100 + vatRate));
  const netPrice = grossPrice - vatAmount;

  return {
    netPrice,
    vatAmount,
    grossPrice,
    vatRate,
  };
}

export const VAT_COUNTRIES: VATCountry[] = [
  {
    code: "GB",
    name: "United Kingdom",
    flag: "GB",
    currency: "GBP",
    currencySymbol: "£",
    locale: "en-GB",
    standardRate: 20,
    reducedRates: [
      { rate: 5, label: "Reduced rate" },
      { rate: 0, label: "Zero rate" },
    ],
    taxName: "VAT",
    featured: true,
  },
  {
    code: "DE",
    name: "Germany",
    flag: "DE",
    currency: "EUR",
    currencySymbol: "€",
    locale: "de-DE",
    standardRate: 19,
    reducedRates: [{ rate: 7, label: "Reduced rate" }],
    taxName: "MwSt",
    featured: true,
  },
  {
    code: "FR",
    name: "France",
    flag: "FR",
    currency: "EUR",
    currencySymbol: "€",
    locale: "fr-FR",
    standardRate: 20,
    reducedRates: [
      { rate: 10, label: "Intermediate rate" },
      { rate: 5.5, label: "Reduced rate" },
      { rate: 2.1, label: "Super reduced rate" },
    ],
    taxName: "TVA",
    featured: true,
  },
  {
    code: "NL",
    name: "Netherlands",
    flag: "NL",
    currency: "EUR",
    currencySymbol: "€",
    locale: "nl-NL",
    standardRate: 21,
    reducedRates: [{ rate: 9, label: "Reduced rate" }],
    taxName: "BTW",
    featured: true,
  },
  {
    code: "AE",
    name: "UAE",
    flag: "AE",
    currency: "AED",
    currencySymbol: "AED",
    locale: "en-AE",
    standardRate: 5,
    reducedRates: [],
    taxName: "VAT",
    featured: true,
  },
  {
    code: "AU",
    name: "Australia",
    flag: "AU",
    currency: "AUD",
    currencySymbol: "A$",
    locale: "en-AU",
    standardRate: 10,
    reducedRates: [],
    taxName: "GST",
    featured: true,
  },
  {
    code: "ES",
    name: "Spain",
    flag: "ES",
    currency: "EUR",
    currencySymbol: "€",
    locale: "es-ES",
    standardRate: 21,
    reducedRates: [
      { rate: 10, label: "Reduced rate" },
      { rate: 4, label: "Super reduced rate" },
    ],
    taxName: "IVA",
    featured: true,
  },
  {
    code: "IT",
    name: "Italy",
    flag: "IT",
    currency: "EUR",
    currencySymbol: "€",
    locale: "it-IT",
    standardRate: 22,
    reducedRates: [
      { rate: 10, label: "Reduced rate" },
      { rate: 5, label: "Second reduced rate" },
      { rate: 4, label: "Super reduced rate" },
    ],
    taxName: "IVA",
    featured: true,
  },
  {
    code: "BE",
    name: "Belgium",
    flag: "BE",
    currency: "EUR",
    currencySymbol: "€",
    locale: "nl-BE",
    standardRate: 21,
    reducedRates: [
      { rate: 12, label: "Reduced rate" },
      { rate: 6, label: "Reduced rate" },
    ],
    taxName: "BTW / TVA",
    featured: false,
  },
  {
    code: "SE",
    name: "Sweden",
    flag: "SE",
    currency: "SEK",
    currencySymbol: "kr",
    locale: "sv-SE",
    standardRate: 25,
    reducedRates: [
      { rate: 12, label: "Reduced rate" },
      { rate: 6, label: "Reduced rate" },
    ],
    taxName: "Moms",
    featured: false,
  },
  {
    code: "CH",
    name: "Switzerland",
    flag: "CH",
    currency: "CHF",
    currencySymbol: "CHF",
    locale: "de-CH",
    standardRate: 8.1,
    reducedRates: [
      { rate: 3.8, label: "Special rate" },
      { rate: 2.6, label: "Reduced rate" },
    ],
    taxName: "MWST",
    featured: false,
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    flag: "SA",
    currency: "SAR",
    currencySymbol: "SAR",
    locale: "ar-SA",
    standardRate: 15,
    reducedRates: [],
    taxName: "VAT",
    featured: false,
  },
  {
    code: "SG",
    name: "Singapore",
    flag: "SG",
    currency: "SGD",
    currencySymbol: "S$",
    locale: "en-SG",
    standardRate: 9,
    reducedRates: [],
    taxName: "GST",
    featured: false,
  },
  {
    code: "IN",
    name: "India",
    flag: "IN",
    currency: "INR",
    currencySymbol: "₹",
    locale: "en-IN",
    standardRate: 18,
    reducedRates: [
      { rate: 12, label: "Reduced rate" },
      { rate: 5, label: "Reduced rate" },
      { rate: 0, label: "Zero rate" },
    ],
    taxName: "GST",
    featured: false,
  },
  {
    code: "CA",
    name: "Canada",
    flag: "CA",
    currency: "CAD",
    currencySymbol: "CA$",
    locale: "en-CA",
    standardRate: 5,
    reducedRates: [],
    taxName: "GST",
    featured: false,
  },
  {
    code: "CUSTOM",
    name: "Custom",
    flag: "•",
    currency: "USD",
    currencySymbol: "$",
    locale: "en-US",
    standardRate: 0,
    reducedRates: [],
    taxName: "VAT",
    featured: false,
  },
];
