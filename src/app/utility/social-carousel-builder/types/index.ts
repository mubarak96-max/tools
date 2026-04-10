// Core data structures for the Social Carousel Builder

export interface Position {
    x: number;
    y: number;
    z: number; // layer order
}

export interface Dimensions {
    width: number;
    height: number;
}

export interface ElementStyle {
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
    borderRadius?: number;
    opacity?: number;
    textAlign?: 'left' | 'center' | 'right';
}

export interface ImageContent {
    src: string;
    alt: string;
    fit: 'cover' | 'contain' | 'fill';
}

export interface ElementConstraints {
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    lockAspectRatio?: boolean;
    allowResize?: boolean;
    allowMove?: boolean;
}

export interface TemplateElement {
    id: string;
    type: 'text' | 'image' | 'shape';
    position: Position;
    dimensions: Dimensions;
    style: ElementStyle;
    content: string | ImageContent;
    constraints: ElementConstraints;
}

export interface Slide {
    id: string;
    elements: TemplateElement[];
    backgroundImage?: string;
    backgroundColor?: string;
}

export interface Template {
    id: string;
    name: string;
    category: string;
    thumbnail: string;
    elements: TemplateElement[];
    defaultDimensions: Dimensions;
}

export interface PlatformFormat {
    id: string;
    name: string;
    dimensions: Dimensions;
    aspectRatio: string;
}

export interface Platform {
    id: 'instagram' | 'linkedin' | 'tiktok';
    name: string;
    formats: PlatformFormat[];
}

export interface ExportOptions {
    format: 'png' | 'jpg';
    quality: number;
    includeMetadata: boolean;
    filenamePrefix: string;
}

export interface CarouselProject {
    id: string;
    name: string;
    slides: Slide[];
    template: Template;
    platform: Platform;
    format: PlatformFormat;
    createdAt: Date;
    updatedAt: Date;
}

// Component Props Interfaces
export interface TemplateSelectorProps {
    templates: Template[];
    onTemplateSelect: (template: Template) => void;
    selectedTemplate?: Template | null;
}

export interface PlatformSelectorProps {
    selectedPlatform: Platform;
    selectedFormat: PlatformFormat;
    onPlatformChange: (platform: Platform, format: PlatformFormat) => void;
}

export interface CarouselEditorProps {
    slides: Slide[];
    currentSlide: number;
    template: Template;
    platform: Platform;
    format: PlatformFormat;
    onSlideUpdate: (slideIndex: number, slide: Slide) => void;
    onCurrentSlideChange: (slideIndex: number) => void;
    onSlideAdd: () => void;
    onSlideDelete: (slideIndex: number) => void;
    onSlideReorder: (fromIndex: number, toIndex: number) => void;
    onManualSave: () => void;
    onExportCurrent: () => void;
    onExportAll: () => void;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    saveStatus: string;
    exportStatus: string;
    isExporting: boolean;
}

export interface SlideCanvasProps {
    slide: Slide;
    template: Template;
    dimensions: Dimensions;
    isEditable: boolean;
    onElementUpdate: (elementId: string, updates: Partial<TemplateElement>) => void;
}

export interface PreviewModalProps {
    slides: Slide[];
    isOpen: boolean;
    onClose: () => void;
    platform: Platform;
    format: PlatformFormat;
    initialSlide?: number;
    projectName?: string;
    autoPlay?: boolean;
    showControls?: boolean;
}

export interface ExportManagerProps {
    slides: Slide[];
    platform: Platform;
    format: PlatformFormat;
    onExport: (exportOptions: ExportOptions) => Promise<void>;
}
