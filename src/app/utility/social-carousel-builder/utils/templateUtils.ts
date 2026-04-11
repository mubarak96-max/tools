import { PremiumTemplate, PremiumSlide, PremiumElement, Dimensions } from '../types/premium';

export interface TemplateApplicationOptions {
    targetDimensions?: Dimensions;
    preserveAspectRatio?: boolean;
    adaptColors?: boolean;
    adaptFonts?: boolean;
}

/**
 * Apply a template to create new slides with proper scaling and adaptation
 */
export const applyTemplate = (
    template: PremiumTemplate,
    options: TemplateApplicationOptions = {}
): PremiumSlide[] => {
    const {
        targetDimensions,
        preserveAspectRatio = true,
        adaptColors = false,
        adaptFonts = false
    } = options;

    return template.slides.map((slide, index) => {
        const newSlide: PremiumSlide = {
            ...slide,
            id: generateId(),
            name: `${slide.name} ${index + 1}`,
            elements: slide.elements.map(element => adaptElement(element, slide.dimensions, targetDimensions, {
                preserveAspectRatio,
                adaptColors,
                adaptFonts
            })),
            dimensions: targetDimensions || slide.dimensions,
            metadata: {
                ...slide.metadata,
                name: `${slide.name} ${index + 1}`,
                createdAt: new Date(),
                modifiedAt: new Date(),
                version: 1
            }
        };

        return newSlide;
    });
};

/**
 * Adapt a single element for new dimensions
 */
const adaptElement = (
    element: PremiumElement,
    originalDimensions: Dimensions,
    targetDimensions?: Dimensions,
    options: {
        preserveAspectRatio: boolean;
        adaptColors: boolean;
        adaptFonts: boolean;
    } = {
            preserveAspectRatio: true,
            adaptColors: false,
            adaptFonts: false
        }
): PremiumElement => {
    if (!targetDimensions) {
        return {
            ...element,
            id: generateId()
        };
    }

    const scaleX = targetDimensions.width / originalDimensions.width;
    const scaleY = targetDimensions.height / originalDimensions.height;

    // Use uniform scaling if preserving aspect ratio
    const scale = options.preserveAspectRatio ? Math.min(scaleX, scaleY) : { x: scaleX, y: scaleY };
    const uniformScale = typeof scale === 'number' ? scale : 1;

    const adaptedElement: PremiumElement = {
        ...element,
        id: generateId(),
        position: {
            x: typeof scale === 'number' ? element.position.x * scale : element.position.x * scale.x,
            y: typeof scale === 'number' ? element.position.y * scale : element.position.y * scale.y,
            z: element.position.z
        },
        dimensions: {
            width: typeof scale === 'number' ? element.dimensions.width * scale : element.dimensions.width * scale.x,
            height: typeof scale === 'number' ? element.dimensions.height * scale : element.dimensions.height * scale.y
        },
        style: {
            ...element.style
        }
    };

    // Adapt font sizes for text elements
    if (element.type === 'text' && element.style.fontSize && options.adaptFonts) {
        adaptedElement.style.fontSize = Math.round(element.style.fontSize * uniformScale);
    }

    // Adapt border radius
    if (element.style.borderRadius && typeof element.style.borderRadius === 'number') {
        adaptedElement.style.borderRadius = Math.round(element.style.borderRadius * uniformScale);
    }

    return adaptedElement;
};

/**
 * Create a new project from a template
 */
export const createProjectFromTemplate = (
    template: PremiumTemplate,
    projectName: string,
    options: TemplateApplicationOptions = {}
) => {
    const slides = applyTemplate(template, options);

    return {
        id: generateId(),
        name: projectName,
        slides,
        settings: {
            defaultDimensions: options.targetDimensions || template.slides[0]?.dimensions || { width: 1080, height: 1080 },
            platform: {
                id: 'instagram',
                name: 'Instagram',
                icon: 'instagram',
                color: '#E4405F',
                formats: [{
                    id: 'square',
                    name: 'Square Post',
                    dimensions: options.targetDimensions || { width: 1080, height: 1080 },
                    aspectRatio: '1:1'
                }]
            },
            colorProfile: 'sRGB' as const,
            exportSettings: {
                format: 'png' as const,
                quality: 0.9,
                scale: 1,
                includeMetadata: false
            },
            gridSettings: {
                enabled: true,
                size: 20,
                subdivisions: 4,
                color: '#e5e7eb',
                opacity: 0.5
            },
            snapSettings: {
                enabled: true,
                snapToGrid: true,
                snapToElements: true,
                snapToGuides: true,
                threshold: 5
            },
            autoSave: true,
            autoSaveInterval: 30
        },
        metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            version: '1.0.0',
            totalSlides: slides.length,
            totalElements: slides.reduce((total, slide) => total + slide.elements.length, 0),
            fileSize: 0,
            exportCount: 0
        }
    };
};

/**
 * Adapt template for different platform dimensions
 */
export const adaptTemplateForPlatform = (
    template: PremiumTemplate,
    platformDimensions: Dimensions
): PremiumTemplate => {
    const adaptedSlides = applyTemplate(template, {
        targetDimensions: platformDimensions,
        preserveAspectRatio: true,
        adaptFonts: true
    });

    return {
        ...template,
        slides: adaptedSlides
    };
};

/**
 * Extract color palette from template
 */
export const extractTemplateColors = (template: PremiumTemplate): string[] => {
    const colors = new Set<string>();

    template.slides.forEach(slide => {
        // Extract background colors
        if (slide.background.type === 'color' && typeof slide.background.value === 'string') {
            colors.add(slide.background.value);
        } else if (slide.background.type === 'gradient' && typeof slide.background.value === 'object') {
            const gradient = slide.background.value;
            if ('stops' in gradient) {
                gradient.stops.forEach(stop => colors.add(stop.color));
            }
        }

        // Extract element colors
        slide.elements.forEach(element => {
            if (element.style.color) colors.add(element.style.color);
            if (element.style.backgroundColor) colors.add(element.style.backgroundColor);

            // Extract gradient colors
            if (element.style.gradient && 'stops' in element.style.gradient) {
                element.style.gradient.stops.forEach(stop => colors.add(stop.color));
            }

            // Extract border colors
            if (element.style.border?.color) colors.add(element.style.border.color);

            // Extract shadow colors
            if (element.style.boxShadow) {
                element.style.boxShadow.forEach(shadow => colors.add(shadow.color));
            }
        });
    });

    return Array.from(colors).filter(color => color && color !== 'transparent');
};

/**
 * Extract font families from template
 */
export const extractTemplateFonts = (template: PremiumTemplate): string[] => {
    const fonts = new Set<string>();

    template.slides.forEach(slide => {
        slide.elements.forEach(element => {
            if (element.type === 'text' && element.style.fontFamily) {
                fonts.add(element.style.fontFamily);
            }
        });
    });

    return Array.from(fonts);
};

/**
 * Validate template structure
 */
export const validateTemplate = (template: PremiumTemplate): {
    valid: boolean;
    errors: string[];
    warnings: string[];
} => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required fields
    if (!template.id) errors.push('Template ID is required');
    if (!template.name) errors.push('Template name is required');
    if (!template.category) errors.push('Template category is required');
    if (!template.slides || template.slides.length === 0) errors.push('Template must have at least one slide');

    // Check slides
    template.slides.forEach((slide, slideIndex) => {
        if (!slide.id) errors.push(`Slide ${slideIndex + 1} is missing ID`);
        if (!slide.name) warnings.push(`Slide ${slideIndex + 1} is missing name`);
        if (!slide.dimensions) errors.push(`Slide ${slideIndex + 1} is missing dimensions`);

        // Check elements
        slide.elements.forEach((element, elementIndex) => {
            if (!element.id) errors.push(`Element ${elementIndex + 1} in slide ${slideIndex + 1} is missing ID`);
            if (!element.type) errors.push(`Element ${elementIndex + 1} in slide ${slideIndex + 1} is missing type`);
            if (!element.position) errors.push(`Element ${elementIndex + 1} in slide ${slideIndex + 1} is missing position`);
            if (!element.dimensions) errors.push(`Element ${elementIndex + 1} in slide ${slideIndex + 1} is missing dimensions`);

            // Check for overlapping elements
            slide.elements.forEach((otherElement, otherIndex) => {
                if (elementIndex !== otherIndex && elementsOverlap(element, otherElement)) {
                    warnings.push(`Elements ${elementIndex + 1} and ${otherIndex + 1} in slide ${slideIndex + 1} may be overlapping`);
                }
            });
        });
    });

    // Check metadata
    if (!template.metadata) {
        warnings.push('Template metadata is missing');
    } else {
        if (!template.metadata.author) warnings.push('Template author is missing');
        if (!template.metadata.description) warnings.push('Template description is missing');
        if (!template.metadata.tags || template.metadata.tags.length === 0) {
            warnings.push('Template tags are missing');
        }
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
};

/**
 * Check if two elements overlap
 */
const elementsOverlap = (element1: PremiumElement, element2: PremiumElement): boolean => {
    const rect1 = {
        left: element1.position.x,
        right: element1.position.x + element1.dimensions.width,
        top: element1.position.y,
        bottom: element1.position.y + element1.dimensions.height
    };

    const rect2 = {
        left: element2.position.x,
        right: element2.position.x + element2.dimensions.width,
        top: element2.position.y,
        bottom: element2.position.y + element2.dimensions.height
    };

    return !(rect1.right <= rect2.left ||
        rect2.right <= rect1.left ||
        rect1.bottom <= rect2.top ||
        rect2.bottom <= rect1.top);
};

/**
 * Generate unique ID
 */
const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

/**
 * Clone template with new IDs
 */
export const cloneTemplate = (template: PremiumTemplate): PremiumTemplate => {
    return {
        ...template,
        id: generateId(),
        slides: template.slides.map(slide => ({
            ...slide,
            id: generateId(),
            elements: slide.elements.map(element => ({
                ...element,
                id: generateId()
            }))
        }))
    };
};

/**
 * Merge templates (combine slides from multiple templates)
 */
export const mergeTemplates = (templates: PremiumTemplate[]): PremiumTemplate => {
    if (templates.length === 0) {
        throw new Error('Cannot merge empty template array');
    }

    const baseTemplate = templates[0];
    const allSlides = templates.flatMap(template => template.slides);

    return {
        ...baseTemplate,
        id: generateId(),
        name: `Merged Template`,
        slides: allSlides.map(slide => ({
            ...slide,
            id: generateId(),
            elements: slide.elements.map(element => ({
                ...element,
                id: generateId()
            }))
        })),
        metadata: {
            ...baseTemplate.metadata,
            name: 'Merged Template',
            description: `Merged template from ${templates.length} templates`,
            createdAt: new Date(),
            updatedAt: new Date(),
            version: '1.0.0'
        }
    };
};