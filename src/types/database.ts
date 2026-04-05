export type RecordStatus = "draft" | "review" | "published";
export type PricingModel = "free" | "freemium" | "paid" | "custom";
export type DifficultyLevel = "beginner" | "intermediate" | "advanced";
export type PageType =
  | "curated-list"
  | "comparison"
  | "alternatives"
  | "category"
  | "audience"
  | "use-case"
  | "editorial";
export type TaxonomyType =
  | "category"
  | "audience"
  | "use-case"
  | "integration"
  | "platform"
  | "pricing-model";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface AIInsights {
  whyThisToolFits: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  antiRecommendation: string;
  comparisonSummary: string;
}

export interface Tool {
  id?: string;
  slug: string;
  name: string;
  website?: string;
  logoUrl?: string;
  category: string;
  categories: string[];
  subcategories: string[];
  shortDescription: string;
  longDescription?: string;
  bestFor?: string;
  notIdealFor?: string;
  useCases: string[];
  audiences: string[];
  platforms: string[];
  pricingModel: PricingModel;
  startingPrice?: number;
  startingPriceCurrency?: string;
  billingPeriod?: string;
  hasFreePlan: boolean;
  hasFreeTrial: boolean;
  difficultyLevel: DifficultyLevel;
  setupTime?: string;
  teamFit: string[];
  integrations: string[];
  features: string[];
  pros: string[];
  cons: string[];
  alternatives: string[];
  competitors: string[];
  screenshots: string[];
  editorialSummary?: string;
  faq: FAQItem[];
  status: RecordStatus;
  sourceConfidence?: number;
  factsLastVerifiedAt?: string;
  aiLastGeneratedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  description: string;
  pricing: "Free" | "Freemium" | "Paid" | "Custom";
  pricingRange: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  aiInsights?: AIInsights;
}

export interface CustomPage {
  id?: string;
  slug: string;
  title: string;
  metaDescription: string;
  pageType: PageType;
  category?: string;
  audience?: string;
  useCase?: string;
  toolSlugs: string[];
  intro?: string;
  bodySections: string[];
  faq: FAQItem[];
  editorialVerdict?: string;
  status: RecordStatus;
  qualityScore?: number;
  sourceMethod?: "manual" | "ai-assisted" | "reviewed" | "imported";
  createdAt?: string;
  updatedAt?: string;
  templateType: "curated-list" | "comparison" | "alternatives";
}

export interface ComparisonRecord {
  id?: string;
  slug: string;
  toolA: string;
  toolB: string;
  title: string;
  intro?: string;
  winnerSummary?: string;
  bestForA?: string;
  bestForB?: string;
  faq: FAQItem[];
  status: RecordStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaxonomyRecord {
  id?: string;
  slug: string;
  name: string;
  description: string;
  taxonomyType: TaxonomyType;
  iconId?: string;
  synonyms: string[];
  status: RecordStatus;
  createdAt?: string;
  updatedAt?: string;
}

export type ToolCategory = TaxonomyRecord;
