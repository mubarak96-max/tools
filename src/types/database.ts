export type PricingModel = 'Free' | 'Freemium' | 'Paid';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface CustomPage {
  id?: string;
  slug: string;
  title: string;
  metaDescription: string;
  templateType: 'curated-list' | 'comparison' | 'alternatives';
  toolSlugs: string[];
  editorialVerdict?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface ToolCategory {
  id?: string;
  slug: string;
  name: string;
  description: string;
  iconId?: string;
  createdAt?: any;
  updatedAt?: any;
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
  name: string;
  slug: string;
  category: string;
  useCases: string[];
  pricing: PricingModel;
  pricingRange: string;
  difficulty: DifficultyLevel;
  platforms: string[];
  features: string[];
  integrations: string[];
  description: string;
  // Embedded for performance (1 read per page)
  aiInsights?: AIInsights;
  createdAt?: any;
  updatedAt?: any;
}
