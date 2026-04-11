// High-Performance Carousel Builder Types

export interface Slide {
    id: string;
    headline: string;
    body: string;
}

export interface Project {
    id: string;
    slides: Slide[];
    templateId: string;
    paletteId: string;
    createdAt: number;
    updatedAt: number;
}

export interface Template {
    id: string;
    name: string;
    description: string;
    slideCount: number;
    structure: string[];
    niches: string[];
    viralScore: number;
    slides: {
        headline: string;
        body: string;
        placeholder: string;
    }[];
}

export interface Palette {
    id: string;
    name: string;
    background: string;
    accent: string;
    textPrimary: string;
    textSecondary: string;
}

export interface AIUsage {
    count: number;
    limit: 2;
    resetTime: number;
    isBlocked: boolean;
}

export interface NicheConfig {
    slug: string;
    title: string;
    description: string;
    keywords: string[];
    templates: string[];
    defaultTopic: string;
    seoContent: {
        h1: string;
        intro: string;
        benefits: string[];
        examples: string[];
        faqs: FAQ[];
    };
}

export interface FAQ {
    question: string;
    answer: string;
}

// AI Types
export interface CarouselSlide {
    headline: string;
    body: string;
}

export interface GenerateCarouselRequest {
    topic: string;
    niche?: string;
}

export interface GenerateCarouselResponse {
    slides: CarouselSlide[];
    error?: string;
}

// Editor State
export interface EditorState {
    // Core state
    slides: Slide[];
    activeSlideIndex: number;
    selectedTemplate: Template | null;
    selectedPalette: Palette;

    // AI state
    aiUsage: AIUsage;
    isGenerating: boolean;

    // Project state
    currentProject: Project | null;
    savedProjects: Project[];

    // UI state
    isExporting: boolean;

    // Actions
    setSlides: (slides: Slide[]) => void;
    setActiveSlide: (index: number) => void;
    addSlide: () => void;
    duplicateSlide: (index: number) => void;
    deleteSlide: (index: number) => void;
    updateSlide: (index: number, updates: Partial<Slide>) => void;

    // Template actions
    applyTemplate: (template: Template) => void;

    // Palette actions
    setPalette: (palette: Palette) => void;

    // AI actions
    generateCarousel: (topic: string, niche?: string) => Promise<void>;
    updateAIUsage: (usage: Partial<AIUsage>) => void;

    // Project actions
    saveProject: () => void;
    loadProject: (project: Project) => void;
    createNewProject: () => void;

    // Export actions
    setExporting: (isExporting: boolean) => void;
}