import type { SalaryCountryCode, SalaryCountryMeta } from "@/lib/tools/salary/types";

export const COUNTRIES: SalaryCountryMeta[] = [
  { code: "US", name: "United States", currency: "USD", currencySymbol: "$", locale: "en-US", region: "north-america", slug: "us", defaultSalary: 75_000, taxYear: "2026" },
  { code: "CA", name: "Canada", currency: "CAD", currencySymbol: "CA$", locale: "en-CA", region: "north-america", slug: "canada", defaultSalary: 70_000, taxYear: "2025" },
  { code: "GB", name: "United Kingdom", currency: "GBP", currencySymbol: "GBP", locale: "en-GB", region: "europe", slug: "uk", defaultSalary: 40_000, taxYear: "2025/26" },
  { code: "DE", name: "Germany", currency: "EUR", currencySymbol: "EUR", locale: "de-DE", region: "europe", slug: "germany", defaultSalary: 55_000, taxYear: "2026" },
  { code: "FR", name: "France", currency: "EUR", currencySymbol: "EUR", locale: "fr-FR", region: "europe", slug: "france", defaultSalary: 38_000, taxYear: "2025" },
  { code: "NL", name: "Netherlands", currency: "EUR", currencySymbol: "EUR", locale: "nl-NL", region: "europe", slug: "netherlands", defaultSalary: 50_000, taxYear: "2025" },
  { code: "ES", name: "Spain", currency: "EUR", currencySymbol: "EUR", locale: "es-ES", region: "europe", slug: "spain", defaultSalary: 34_000, taxYear: "2025" },
  { code: "IT", name: "Italy", currency: "EUR", currencySymbol: "EUR", locale: "it-IT", region: "europe", slug: "italy", defaultSalary: 33_000, taxYear: "2025" },
  { code: "AE", name: "United Arab Emirates", currency: "AED", currencySymbol: "AED", locale: "en-AE", region: "asia", slug: "uae", defaultSalary: 180_000, taxYear: "2026" },
  { code: "SG", name: "Singapore", currency: "SGD", currencySymbol: "SGD", locale: "en-SG", region: "asia", slug: "singapore", defaultSalary: 72_000, taxYear: "2025" },
  { code: "IN", name: "India", currency: "INR", currencySymbol: "INR", locale: "en-IN", region: "asia", slug: "india", defaultSalary: 1_200_000, taxYear: "2025/26" },
  { code: "JP", name: "Japan", currency: "JPY", currencySymbol: "JPY", locale: "ja-JP", region: "asia", slug: "japan", defaultSalary: 6_500_000, taxYear: "2026" },
];

export const US_FILING_STATUSES = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married filing jointly" },
  { value: "head", label: "Head of household" },
] as const;

export const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DC","DE","FL","GA","HI","IA","ID","IL","IN","KS","KY","LA","MA","MD","ME","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VA","VT","WA","WI","WV","WY",
] as const;

export const CANADA_PROVINCES = [
  "Ontario",
  "British Columbia",
  "Alberta",
  "Quebec",
  "Manitoba",
  "Saskatchewan",
  "Nova Scotia",
  "New Brunswick",
  "Prince Edward Island",
  "Newfoundland and Labrador",
] as const;

export const GERMANY_STATES = [
  "Bavaria",
  "Berlin",
  "Hamburg",
  "Hesse",
  "North Rhine-Westphalia",
  "Saxony",
] as const;

export const SPAIN_REGIONS = ["Madrid", "Catalonia", "Andalusia", "Valencian Community"] as const;
export const ITALY_REGIONS = ["Lombardy", "Lazio", "Veneto", "Emilia-Romagna", "Sicily"] as const;

export function getCountryMeta(code: SalaryCountryCode) {
  return COUNTRIES.find((country) => country.code === code) ?? COUNTRIES[0];
}
