export type SalaryCountryCode =
  | "US"
  | "CA"
  | "GB"
  | "DE"
  | "FR"
  | "NL"
  | "ES"
  | "IT"
  | "AE"
  | "SG"
  | "IN"
  | "JP";

export type PayPeriod = "annual" | "monthly" | "weekly" | "hourly";

export type FilingStatus = "single" | "married" | "head";
export type StudentLoanPlan = "none" | "plan1" | "plan2" | "plan4" | "plan5";
export type GermanTaxClass = "1" | "2" | "3" | "4" | "5" | "6";
export type GermanHealthInsuranceType = "public" | "private";
export type IndiaTaxRegime = "new" | "old";
export type UAEEmploymentType = "expat" | "national";
export type SingaporeResidency = "resident" | "non-resident";
export type JapanResidence = "tokyo" | "other";
export type FranceEmploymentType = "employee" | "self-employed";

export interface SalaryCountryMeta {
  code: SalaryCountryCode;
  name: string;
  currency: string;
  currencySymbol: string;
  locale: string;
  region: "north-america" | "europe" | "asia";
  slug: string;
  defaultSalary: number;
  taxYear: string;
}

export interface BracketSlice {
  label: string;
  from: number;
  to: number | null;
  rate: number;
  taxableAmount: number;
  taxAmount: number;
}

export interface SalaryBreakdownItem {
  label: string;
  amount: number;
  category: "tax" | "contribution" | "employer" | "adjustment";
}

export interface SalaryCalculationInput {
  countryCode: SalaryCountryCode;
  salaryAmount: number;
  payPeriod: PayPeriod;
  hoursPerWeek?: number;
  weeksPerYear?: number;
  uaeBasicSalary?: number;
  uaeHousingAllowance?: number;
  uaeTransportAllowance?: number;
  uaeOtherAllowances?: number;
  uaeOvertimePay?: number;
  uaeTotalDeductions?: number;
  filingStatus?: FilingStatus;
  usState?: string;
  pretaxDeductions?: number;
  usIsSenior?: boolean;
  usSpouseIsSenior?: boolean;
  usReportedTips?: number;
  usQualifiedOvertimePremium?: number;
  province?: string;
  rrspContribution?: number;
  isScotland?: boolean;
  studentLoanPlan?: StudentLoanPlan;
  pensionContribution?: number;
  germanTaxClass?: GermanTaxClass;
  germanyState?: string;
  germanyChildren?: number;
  churchMember?: boolean;
  germanHealthInsuranceType?: GermanHealthInsuranceType;
  franceParts?: number;
  franceEmploymentType?: FranceEmploymentType;
  netherlandsThirtyRuling?: boolean;
  spainRegion?: string;
  age?: number;
  italyRegion?: string;
  uaeEmploymentType?: UAEEmploymentType;
  singaporeResidency?: SingaporeResidency;
  cpfEligible?: boolean;
  indiaRegime?: IndiaTaxRegime;
  oldRegimeDeductions?: number;
  japanResidence?: JapanResidence;
  japanDependents?: number;
}

export interface SalaryPeriodAmounts {
  gross: number;
  net: number;
}

export interface SalaryCalculationResult {
  countryCode: SalaryCountryCode;
  annualGross: number;
  taxableIncome: number;
  annualNet: number;
  incomeTax: number;
  socialContributions: number;
  otherDeductions: number;
  totalDeductions: number;
  employerContributions: number;
  employerCost: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  periods: Record<PayPeriod, SalaryPeriodAmounts>;
  bracketBreakdown: BracketSlice[];
  breakdown: SalaryBreakdownItem[];
  notes: string[];
}

export interface CountryCalculationDraft {
  taxableIncome: number;
  incomeTax: number;
  socialContributions: number;
  otherDeductions?: number;
  employerContributions?: number;
  grossAnnualOverride?: number;
  annualNetOverride?: number;
  marginalTaxRate: number;
  bracketBreakdown: BracketSlice[];
  breakdown: SalaryBreakdownItem[];
  notes?: string[];
}
