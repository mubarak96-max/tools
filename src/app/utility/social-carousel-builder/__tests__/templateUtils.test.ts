import {
    validateTemplate,
    validateTemplateElement,
    cloneTemplate,
    getTemplateElementById,
    updateTemplateElement,
    addElementToTemplate,
    removeElementFromTemplate,
    reorderTemplateElements,
    getTemplateBounds,
    templateFitsInDimensions,
    getTemplateComplexity
} from '../utils/templateUtils';
import { Template, TemplateElement } from '../types';

describe('Template Utils', () => {
    const mockTemplate: Template = {
        id: 'test-template',
        name: 'Test Template',
        category: 'Test',
        thumbnail: '/test.png',
        defaultDimensions: { width: 1080, height: 1080 },
        elements: [
            {
                id: 'text1',
                type: 'text',
                position: { x: 100, y: 100, z: 1 },
                dimensions: { width: 880, height: 100 },
                style: { fontSize: 24, color: '#000000' },
                content: 'Test text',
                constraints: { allowResize: true, allowMove: true }
            },
            {
                id: 'image1',
                type: 'image',
                position: { x: 200, y: 300, z: 2 },
                dimensions: { width: 400, height: 300 },
                style: {},
                content: { src: '/test.jpg', alt: 'Test image', fit: 'cover' },
                constraints: { allowResize: true, allowMove: true }
            }
        ]
    };

    describe('validateTemplate', () => {
        it('should validate a correct template', () => {
            const result = validateTemplate(mockTemplate);
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should detect missing required fields', () => {
            const invalidTemplate = {
                ...mockTemplate,
                id: '',
                name: ''
            };

            const result = validateTemplate(invalidTemplate);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Template must have an ID');
            expect(result.errors).toContain('Template must have a name');
        });

        it('should detect invalid dimensions', () => {
            const invalidTemplate = {
                ...mockTemplate,
                defaultDimensions: { width: -100, height: 0 }
            };

            const result = validateTemplate(invalidTemplate);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Template dimensions must be positive numbers');
        });

        it('should validate elements', () => {
            const invalidTemplate = {
                ...mockTemplate,
                elements: [
                    {
                        ...mockTemplate.elements[0],
                        position: { x: -10, y: -10, z: 1 }
                    }
                ]
            };

            const result = validateTemplate(invalidTemplate);
            expect(result.valid).toBe(false);
            expect(result.errors.some(error => error.includes('position cannot be negative'))).toBe(true);
        });
    });

    describe('validateTemplateElement', () => {
        it('should validate a correct text element', () => {
            const errors = validateTemplateElement(
                mockTemplate.elements[0],
                mockTemplate.defaultDimensions
            );
            expect(errors).toHaveLength(0);
        });

        it('should validate a correct image element', () => {
            const errors = validateTemplateElement(
                mockTemplate.elements[1],
                mockTemplate.defaultDimensions
            );
            expect(errors).toHaveLength(0);
        });

        it('should detect element outside bounds', () => {
            const invalidElement: TemplateElement = {
                ...mockTemplate.elements[0],
                position: { x: 1000, y: 1000, z: 1 },
                dimensions: { width: 200, height: 200 }
            };

            const errors = validateTemplateElement(invalidElement, mockTemplate.defaultDimensions);
            expect(errors).toContain('Element extends beyond template bounds');
        });

        it('should detect invalid element type', () => {
            const invalidElement = {
                ...mockTemplate.elements[0],
                type: 'invalid' as any
            };

            const errors = validateTemplateElement(invalidElement, mockTemplate.defaultDimensions);
            expect(errors).toContain('Element type must be text, image, or shape');
        });
    });

    describe('cloneTemplate', () => {
        it('should create a deep copy with new IDs', () => {
            const cloned = cloneTemplate(mockTemplate);

            expect(cloned.id).not.toBe(mockTemplate.id);
            expect(cloned.name).toBe(mockTemplate.name);
            expect(cloned.elements).toHaveLength(mockTemplate.elements.length);
            expect(cloned.elements[0].id).not.toBe(mockTemplate.elements[0].id);
            expect(cloned.elements[0].content).toBe(mockTemplate.elements[0].content);
        });

        it('should deep copy object content', () => {
            const cloned = cloneTemplate(mockTemplate);
            const originalImageContent = mockTemplate.elements[1].content as any;
            const clonedImageContent = cloned.elements[1].content as any;

            expect(clonedImageContent).toEqual(originalImageContent);
            expect(clonedImageContent).not.toBe(originalImageContent);
        });
    });

    describe('getTemplateElementById', () => {
        it('should find element by ID', () => {
            const element = getTemplateElementById(mockTemplate, 'text1');
            expect(element).toBeDefined();
            expect(element?.type).toBe('text');
        });

        it('should return undefined for non-existent ID', () => {
            const element = getTemplateElementById(mockTemplate, 'non-existent');
            expect(element).toBeUndefined();
        });
    });

    describe('updateTemplateElement', () => {
        it('should update element properties', () => {
            const updated = updateTemplateElement(mockTemplate, 'text1', {
                content: 'Updated text',
                style: { ...mockTemplate.elements[0].style, fontSize: 32 }
            });

            const updatedElement = getTemplateElementById(updated, 'text1');
            expect(updatedElement?.content).toBe('Updated text');
            expect(updatedElement?.style.fontSize).toBe(32);
        });

        it('should not modify other elements', () => {
            const updated = updateTemplateElement(mockTemplate, 'text1', {
                content: 'Updated text'
            });

            const otherElement = getTemplateElementById(updated, 'image1');
            expect(otherElement).toEqual(mockTemplate.elements[1]);
        });
    });

    describe('addElementToTemplate', () => {
        it('should add new element to template', () => {
            const newElement: TemplateElement = {
                id: 'shape1',
                type: 'shape',
                position: { x: 50, y: 50, z: 0 },
                dimensions: { width: 100, height: 100 },
                style: { backgroundColor: '#ff0000' },
                content: '',
                constraints: { allowResize: true, allowMove: true }
            };

            const updated = addElementToTemplate(mockTemplate, newElement);
            expect(updated.elements).toHaveLength(3);
            expect(updated.elements[2]).toEqual(newElement);
        });
    });

    describe('removeElementFromTemplate', () => {
        it('should remove element by ID', () => {
            const updated = removeElementFromTemplate(mockTemplate, 'text1');
            expect(updated.elements).toHaveLength(1);
            expect(getTemplateElementById(updated, 'text1')).toBeUndefined();
        });
    });

    describe('reorderTemplateElements', () => {
        it('should reorder elements correctly', () => {
            const updated = reorderTemplateElements(mockTemplate, 0, 1);
            expect(updated.elements[0].id).toBe('image1');
            expect(updated.elements[1].id).toBe('text1');
        });
    });

    describe('getTemplateBounds', () => {
        it('should calculate correct bounds', () => {
            const bounds = getTemplateBounds(mockTemplate);
            expect(bounds.minX).toBe(100);
            expect(bounds.minY).toBe(100);
            expect(bounds.maxX).toBe(980); // 100 + 880
            expect(bounds.maxY).toBe(600); // 300 + 300
        });

        it('should handle empty template', () => {
            const emptyTemplate = { ...mockTemplate, elements: [] };
            const bounds = getTemplateBounds(emptyTemplate);
            expect(bounds.minX).toBe(0);
            expect(bounds.minY).toBe(0);
            expect(bounds.maxX).toBe(1080);
            expect(bounds.maxY).toBe(1080);
        });
    });

    describe('templateFitsInDimensions', () => {
        it('should return true for template that fits', () => {
            const fits = templateFitsInDimensions(mockTemplate, { width: 1200, height: 1200 });
            expect(fits).toBe(true);
        });

        it('should return false for template that does not fit', () => {
            const fits = templateFitsInDimensions(mockTemplate, { width: 500, height: 500 });
            expect(fits).toBe(false);
        });
    });

    describe('getTemplateComplexity', () => {
        it('should calculate complexity score', () => {
            const complexity = getTemplateComplexity(mockTemplate);
            expect(complexity).toBeGreaterThan(0);
            expect(typeof complexity).toBe('number');
        });

        it('should give higher complexity for more elements', () => {
            const simpleTemplate = { ...mockTemplate, elements: [mockTemplate.elements[0]] };
            const simpleComplexity = getTemplateComplexity(simpleTemplate);
            const fullComplexity = getTemplateComplexity(mockTemplate);

            expect(fullComplexity).toBeGreaterThan(simpleComplexity);
        });
    });
});