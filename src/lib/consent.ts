export const CONSENT_STORAGE_KEY = "findbest-consent-choice";
export const CONSENT_CHANGE_EVENT = "findbest:consent-change";
export const CONSENT_OPEN_EVENT = "findbest:consent-open";

export type ConsentChoice = "accepted" | "declined";

export const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-8237514940582521";
