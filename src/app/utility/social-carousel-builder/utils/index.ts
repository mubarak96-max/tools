import { Dimensions, Platform, PlatformFormat, Slide, Template, TemplateElement } from '../types';

// Utility functions for the Social Carousel Builder

/**
 * Generate a unique ID for slides, elements, etc.
 */
export const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

/**
 * Create a new slide based on a template
 */
export const createSlideFromTemplate = (template: Template): Slide => {
    return {
        id: generateId(),
        elements: template.elements.map(element => ({
            ...element,
            id: generateId() // Generate new IDs for elements
        })),
        backgroundColor: '#ffffff'
    };
};

/**
 * Validate if dimensions are valid
 */
export const isValidDimensions = (dimensions: Dimensions): boolean => {
    return dimensions.width > 0 && dimensions.height > 0;
};

/**
 * Calculate aspect ratio from dimensions
 */
export const calculateAspectRatio = (dimensions: Dimensions): number => {
    return dimensions.width / dimensions.height;
};

/**
 * Scale dimensions to fit within bounds while maintaining aspect ratio
 */
export const scaleToFit = (
    original: Dimensions,
    bounds: Dimensions
): Dimensions => {
    const originalRatio = calculateAspectRatio(original);
    const boundsRatio = calculateAspectRatio(bounds);

    if (originalRatio > boundsRatio) {
        // Original is wider, scale by width
        return {
            width: bounds.width,
            height: bounds.width / originalRatio
        };
    } else {
        // Original is taller, scale by height
        return {
            width: bounds.height * originalRatio,
            height: bounds.height
        };
    }
};

/**
 * Validate file type for image uploads
 */
export const isValidImageType = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return validTypes.includes(file.type);
};

/**
 * Validate file size (max 10MB)
 */
export const isValidFileSize = (file: File, maxSizeMB: number = 10): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
};

/**
 * Convert file to base64 data URL
 */
export const fileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

/**
 * Deep clone an object (for immutable updates)
 */
export const deepClone = <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
};

/**
 * Update an element in a slide
 */
export const updateSlideElement = (
    slide: Slide,
    elementId: string,
    updates: Partial<TemplateElement>
): Slide => {
    return {
        ...slide,
        elements: slide.elements.map(element =>
            element.id === elementId
                ? { ...element, ...updates }
                : element
        )
    };
};

/**
 * Reorder slides in an array
 */
export const reorderSlides = (
    slides: Slide[],
    fromIndex: number,
    toIndex: number
): Slide[] => {
    const result = [...slides];
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    return result;
};

/**
 * Generate filename for export
 */
export const generateExportFilename = (
    prefix: string,
    slideIndex: number,
    platform: Platform,
    format: PlatformFormat,
    extension: string
): string => {
    const paddedIndex = (slideIndex + 1).toString().padStart(2, '0');
    return `${prefix}_${platform.id}_${format.id}_slide_${paddedIndex}.${extension}`;
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

/**
 * Check if a point is within bounds
 */
export const isPointInBounds = (
    x: number,
    y: number,
    bounds: { x: number; y: number; width: number; height: number }
): boolean => {
    return (
        x >= bounds.x &&
        x <= bounds.x + bounds.width &&
        y >= bounds.y &&
        y <= bounds.y + bounds.height
    );
};

/**
 * Clamp a value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
};