export interface WordFrequencyItem {
  word: string;
  count: number;
}

export interface WordFrequencyComparisonItem {
  word: string;
  primaryCount: number;
  secondaryCount: number;
  primaryDensity: number;
  secondaryDensity: number;
  countDelta: number;
}

export type HumanizerStatus = "idle" | "queued" | "processing" | "done" | "error";

export interface EMIResult {
  emi: number;
  totalPayment: number;
  totalInterest: number;
}

export interface EMIAmortizationRow {
  month: number;
  emi: number;
  principalPaid: number;
  interest: number;
  balance: number;
}

export interface FreeToolMeta {
  name: string;
  href: string;
  description: string;
  category: "Utility" | "Text" | "Image" | "Real Estate" | "Health";
  /** Short label for compact badges (legacy); prefer Iconify via `iconify` or automatic resolver */
  icon?: string;
  /** Optional Iconify id (e.g. lucide:wallet) — overrides slug/title rules when set */
  iconify?: string;
}
