
// ─── Categories ───────────────────────────────────────────────────────────────

export type CategoryId =
  | 'business'
  | 'social'
  | 'educational'
  | 'marketing'
  | 'personal'
  | 'lists'
  | 'before_after'
  | 'statistics';

export interface Category {
  id: CategoryId;
  label: string;
  color: string;
  templateTypes: string[];
}

// ─── Templates ────────────────────────────────────────────────────────────────

export type LayoutId = 'centered' | 'left' | 'top_accent' | 'split' | 'minimal' | 'bold';

export type FontId = 'syne' | 'dm_sans' | 'dm_serif' | 'space_mono';

export interface SlideTemplate {
  id: string;
  name: string;
  categoryId: CategoryId;
  background: string;       // CSS gradient string or hex
  accentColor: string;      // hex
  tagText: string;          // badge label e.g. 'PITCH DECK'
  defaultHeadline: string;
  defaultSubtitle: string;
  defaultBody: string;
  layout: LayoutId;
  darkText: boolean;        // true = dark text (for light backgrounds)
  fontFamily: FontId;
}

export interface FontOption {
  id: FontId;
  label: string;
  css: string;              // CSS font-family string
}

export interface Palette {
  id: string;
  background: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
}

// ─── Slide ────────────────────────────────────────────────────────────────────

export interface IconOverlay {
  id: string;
  content: string;          // emoji character
  x: number;               // 0-100 percent from left
  y: number;               // 0-100 percent from top
  size: number;            // px
}

export interface Slide {
  id: string;
  templateId: string;
  headline: string;
  subtitle: string;
  body: string;
  tagText: string;
  background: string;
  accentColor: string;
  fontId: FontId;
  layout: LayoutId;
  darkText: boolean;
  icons: IconOverlay[];
}

// ─── AI ───────────────────────────────────────────────────────────────────────

export interface AIGeneratedSlide {
  headline: string;
  body: string;
}

export interface AIUsage {
  count: number;
  resetTime: number;        // unix ms timestamp
}

// ─── SEO Niches ───────────────────────────────────────────────────────────────

export interface FAQ {
  question: string;
  answer: string;
}

export interface NicheConfig {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  templates: string[];      // template IDs to preselect
  defaultTopic: string;
  seoContent: {
    h1: string;
    intro: string;
    benefits: string[];
    examples: string[];
    faqs: FAQ[];
  };
}

// ─── Editor State ─────────────────────────────────────────────────────────────

export type ActiveSheet =
  | 'slides'
  | 'templates'
  | 'design'
  | 'text'
  | 'icons'
  | 'export'
  | null;

export interface EditorState {
  // State
  slides: Slide[];
  activeSlideIndex: number;
  activeSheet: ActiveSheet;
  activeCategoryId: CategoryId | 'all';
  aiUsage: AIUsage;
  isGenerating: boolean;
  generationError: string | null;

  // Navigation
  setActiveSlide: (index: number) => void;
  setActiveSheet: (sheet: ActiveSheet) => void;
  setActiveCategory: (id: CategoryId | 'all') => void;

  // Slide CRUD
  addSlide: (templateId: string) => void;
  duplicateSlide: (index: number) => void;
  deleteSlide: (index: number) => void;
  reorderSlides: (fromIndex: number, toIndex: number) => void;

  // Slide content
  applyTemplate: (templateId: string) => void;
  updateSlideText: (field: 'headline' | 'subtitle' | 'body' | 'tagText', value: string) => void;
  updateSlideBackground: (background: string) => void;
  updateSlideAccent: (accent: string) => void;
  updateSlideFont: (fontId: FontId) => void;
  updateSlideLayout: (layout: LayoutId) => void;

  // Icons
  addIconToSlide: (icon: Omit<IconOverlay, 'id'>) => void;
  updateIconPosition: (iconId: string, x: number, y: number) => void;
  removeIconFromSlide: (iconId: string) => void;

  // AI
  generateFromAI: (topic: string, niche?: string) => Promise<void>;
  canUseAI: () => boolean;

  // Persistence
  saveToStorage: () => void;
  loadFromStorage: () => void;
  setSlides: (slides: Slide[]) => void;
}