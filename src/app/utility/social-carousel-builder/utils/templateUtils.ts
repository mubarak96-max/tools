import { Template, TemplateElement, Dimensions } from '../types';
import { generateId } from './index';

/**
 * Validate template structure and elements
 */
export const validateTemplate = (template: Template): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Check required fields
    if (!template.id) errors.push('Template must have an ID');
    if (!template.name) errors.push('Template must have a name');
    if (!template.category) errors.push('Template must have a category');
    if (!template.elements || !Array.isArray(template.elements)) {
        errors.push('Template must have elements array');
    }
    if (!template.defaultDimensions) {
        errors.push('Template must have default dimensions');
    }

    // Validate dimensions
    if (template.defaultDimensions) {
        if (template.defaultDimensions.width <= 0 || template.defaultDimensions.height <= 0) {
            errors.push('Template dimensions must be positive numbers');
        }
    }

    // Validate elements
    if (template.elements && Array.isArray(template.elements)) {
        template.elements.forEach((element, index) => {
            const elementErrors = validateTemplateElement(element, template.defaultDimensions);
            elementErrors.forEach(error => {
                errors.push(`Element ${index + 1}: ${error}`);
            });
        });
    }

    return {
        valid: errors.length === 0,
        errors
    };
};

/**
 * Validate individual template element
 */
export const validateTemplateElement = (
    element: TemplateElement,
    templateDimensions: Dimensions
): string[] => {
    const errors: string[] = [];

    // Check required fields
    if (!element.id) errors.push('Element must have an ID');
    if (!element.type) errors.push('Element must have a type');
    if (!['text', 'image', 'shape'].includes(element.type)) {
        errors.push('Element type must be text, image, or shape');
    }

    // Validate position
    if (!element.position) {
        errors.push('Element must have position');
    } else {
        if (element.position.x < 0 || element.position.y < 0) {
            errors.push('Element position cannot be negative');
        }
        if (element.position.x >= templateDimensions.width ||
            element.position.y >= templateDimensions.height) {
            errors.push('Element position is outside template bounds');
        }
    }

    // Validate dimensions
    if (!element.dimensions) {
        errors.push('Element must have dimensions');
    } else {
        if (element.dimensions.width <= 0 || element.dimensions.height <= 0) {
            errors.push('Element dimensions must be positive');
        }
        if (element.position &&
            (element.position.x + element.dimensions.width > templateDimensions.width ||
                element.position.y + element.dimensions.height > templateDimensions.height)) {
            errors.push('Element extends beyond template bounds');
        }
    }

    // Type-specific validation
    switch (element.type) {
        case 'text':
            if (!element.content || typeof element.content !== 'string') {
                errors.push('Text element must have string content');
            }
            if (element.style?.fontSize && element.style.fontSize <= 0) {
                errors.push('Font size must be positive');
            }
            break;

        case 'image':
            if (element.content && typeof element.content === 'object') {
                if (!element.content.src) {
                    errors.push('Image element must have src');
                }
                if (element.content.fit && !['cover', 'contain', 'fill'].includes(element.content.fit)) {
                    errors.push('Image fit must be cover, contain, or fill');
                }
            }
            break;
    }

    return errors;
};

/**
 * Create a deep copy of a template with new IDs
 */
export const cloneTemplate = (template: Template): Template => {
    return {
        ...template,
        id: generateId(),
        elements: template.elements.map(element => ({
            ...element,
            id: generateId(),
            style: { ...element.style },
            position: { ...element.position },
            dimensions: { ...element.dimensions },
            constraints: element.constraints ? { ...element.constraints } : element.constraints,
            content: typeof element.content === 'object' && element.content !== null
                ? { ...element.content }
                : element.content
        }))
    };
};

/**
 * Get template element by ID
 */
export const getTemplateElementById = (
    template: Template,
    elementId: string
): TemplateElement | undefined => {
    return template.elements.find(element => element.id === elementId);
};

/**
 * Update template element
 */
export const updateTemplateElement = (
    template: Template,
    elementId: string,
    updates: Partial<TemplateElement>
): Template => {
    return {
        ...template,
        elements: template.elements.map(element =>
            element.id === elementId
                ? { ...element, ...updates }
                : element
        )
    };
};

/**
 * Add element to template
 */
export const addElementToTemplate = (
    template: Template,
    element: TemplateElement
): Template => {
    return {
        ...template,
        elements: [...template.elements, element]
    };
};

/**
 * Remove element from template
 */
export const removeElementFromTemplate = (
    template: Template,
    elementId: string
): Template => {
    return {
        ...template,
        elements: template.elements.filter(element => element.id !== elementId)
    };
};

/**
 * Reorder template elements
 */
export const reorderTemplateElements = (
    template: Template,
    fromIndex: number,
    toIndex: number
): Template => {
    const newElements = [...template.elements];
    const [movedElement] = newElements.splice(fromIndex, 1);
    newElements.splice(toIndex, 0, movedElement);

    return {
        ...template,
        elements: newElements
    };
};

/**
 * Get template bounds (min/max positions)
 */
export const getTemplateBounds = (template: Template) => {
    if (template.elements.length === 0) {
        return {
            minX: 0,
            minY: 0,
            maxX: template.defaultDimensions.width,
            maxY: template.defaultDimensions.height
        };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    template.elements.forEach(element => {
        const elementMinX = element.position.x;
        const elementMinY = element.position.y;
        const elementMaxX = element.position.x + element.dimensions.width;
        const elementMaxY = element.position.y + element.dimensions.height;

        minX = Math.min(minX, elementMinX);
        minY = Math.min(minY, elementMinY);
        maxX = Math.max(maxX, elementMaxX);
        maxY = Math.max(maxY, elementMaxY);
    });

    return { minX, minY, maxX, maxY };
};

/**
 * Check if template fits within dimensions
 */
export const templateFitsInDimensions = (
    template: Template,
    dimensions: Dimensions
): boolean => {
    const bounds = getTemplateBounds(template);
    return bounds.maxX <= dimensions.width && bounds.maxY <= dimensions.height;
};

/**
 * Get template complexity score (for performance optimization)
 */
export const getTemplateComplexity = (template: Template): number => {
    let complexity = 0;

    // Base complexity from element count
    complexity += template.elements.length;

    // Additional complexity for different element types
    template.elements.forEach(element => {
        switch (element.type) {
            case 'text':
                complexity += 1;
                if (element.style?.fontSize && element.style.fontSize > 48) complexity += 0.5;
                break;
            case 'image':
                complexity += 2; // Images are more complex to render
                break;
            case 'shape':
                complexity += 0.5;
                break;
        }

        // Additional complexity for styling
        if (element.style?.backgroundColor) complexity += 0.2;
        if (element.style?.borderRadius) complexity += 0.2;
        if (element.style?.opacity && element.style.opacity < 1) complexity += 0.3;
    });

    return complexity;
};