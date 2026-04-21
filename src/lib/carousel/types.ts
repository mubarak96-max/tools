// ==============================
// CORE ENUMS / UNIONS
// ==============================

export type SlideRole = "intro" | "content" | "outro";

export type SlideLayout =
    | "center"
    | "top"
    | "split-left"
    | "split-right"
    | "image-top"
    | "image-left"
    | "image-right"
    | "full-image"
    | "dual-column"
    | "intro-standard"
    | "intro-emoji"
    | "intro-headshot"
    | "intro-image";

export type ImageBehavior =
    | "none"
    | "hero-left"
    | "hero-right"
    | "overlap-next"
    | "framed"
    | "background-faded";

export type BackgroundType = "continuous" | "per-slide";

export type BackgroundPattern =
    | "arrows"
    | "round-arrows"
    | "waves"
    | "grid"
    | "dots"
    | "topographic"
    | "chevron"
    | "paper"
    | "glow"
    | "diagonal-lines";

export type BackgroundColorMode = "soft" | "accent" | "contrast";

// ==============================
// TEXT / FIELD STRUCTURES
// ==============================

export type SlideFields = {
    title?: string;
    body?: string;
    title2?: string;
    body2?: string;
    bullets?: string[];
    badge?: string;
    buttonText?: string;
    image?: string; 
    emoji?: string;
    imageScale?: number;
    imagePosition?: "top" | "bottom";
};

export type SlidePlaceholders = {
    title?: string;
    body?: string;
    title2?: string;
    body2?: string;
    bullets?: string[];
    badge?: string;
    buttonText?: string;
    emoji?: string;
};

// ==============================
// SLIDE PRESET (TEMPLATE LEVEL)
// ==============================

export type TemplateSlidePreset = {
    id: string;

    role: SlideRole;

    layout: SlideLayout;

    imageBehavior: ImageBehavior;

    // Which fields are active on this slide
    fields: {
        title?: boolean;
        body?: boolean;
        title2?: boolean;
        body2?: boolean;
        bullets?: boolean;
        badge?: boolean;
        buttonText?: boolean;
        image?: boolean;
        emoji?: boolean;
    };

    // Dummy content shown in preview / initial load
    dummy: SlideFields;

    // Placeholder content when user edits
    placeholders: SlidePlaceholders;

    // Optional constraints per slide
    constraints?: {
        maxTitleChars?: number;
        maxBodyLines?: number;
        maxBullets?: number;
        maxBulletChars?: number;
    };

    // Optional UI hints (badges, numbering, etc.)
    meta?: {
        showStepNumber?: boolean;
        stepIndex?: number;
        emphasisWords?: string[]; // words to highlight
    };
};

// ==============================
// TEMPLATE STYLE SYSTEM
// ==============================

export type TemplateStyles = {
    colors: {
        background: string;
        text: string;
        primary: string;
        accent: string;
    };

    typography: {
        fontTitle: string;
        fontBody: string;
        titleSize: number;
        bodySize: number;
        lineHeight: number;
        fontWeightTitle?: number;
        fontWeightBody?: number;
    };

    spacing: {
        padding: number;
        gap: number;
        radius: number;
    };

    decorations?: {
        shapes?: boolean;
        pattern?: string;
    };
};

// ==============================
// BACKGROUND SYSTEM
// ==============================

export type BackgroundPreset = {
    id: string;
    name: string;

    type: BackgroundType;

    pattern: BackgroundPattern;

    opacity: number;
    scale: number;

    colorMode: BackgroundColorMode;
};

// ==============================
// TEMPLATE (MAIN OBJECT)
// ==============================

export type CarouselTemplate = {
    id: string;
    name: string;
    description?: string;

    // Style system
    styles: TemplateStyles;

    // Default background applied
    background?: {
        presetId: string;
        opacity?: number;
        scale?: number;
    };

    // Full starter carousel (important)
    starterSlides: TemplateSlidePreset[];
};

// ==============================
// USER EDITABLE STATE
// ==============================

export type CarouselSlide = {
    id: string;

    role: SlideRole;

    layout: SlideLayout;

    imageBehavior: ImageBehavior;

    data: SlideFields;
};

export type CarouselAspectRatio = "1/1" | "4/5" | "9/16";

export type CarouselDocument = {
    templateId: string;

    slides: CarouselSlide[];

    backgroundId?: string;
    
    aspectRatio?: CarouselAspectRatio;
};

// ==============================
// AI TYPES (OPTIONAL)
// ==============================

export type GenerateCarouselInput = {
    prompt: string;
    slideCount: number;
    templateId: string;
};

export type GenerateCarouselSlide = {
    role: SlideRole;
    title?: string;
    body?: string;
    bullets?: string[];
    badge?: string;
    buttonText?: string;
};

export type GenerateCarouselResponse = {
    slides: GenerateCarouselSlide[];
};