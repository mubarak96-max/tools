import { Template, TemplateElement } from '../types';

// Basic template configurations - 8 distinct templates
export const DEFAULT_TEMPLATES: Template[] = [
    {
        id: 'minimal-text',
        name: 'Minimal Text',
        category: 'Text-focused',
        thumbnail: '/templates/minimal-text.png',
        defaultDimensions: { width: 1080, height: 1080 },
        elements: [
            {
                id: 'title',
                type: 'text',
                position: { x: 100, y: 200, z: 1 },
                dimensions: { width: 880, height: 120 },
                style: {
                    fontSize: 48,
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    color: '#1a1a1a',
                    textAlign: 'center'
                },
                content: 'Your Title Here',
                constraints: {
                    allowResize: true,
                    allowMove: true
                }
            },
            {
                id: 'subtitle',
                type: 'text',
                position: { x: 100, y: 350, z: 1 },
                dimensions: { width: 880, height: 80 },
                style: {
                    fontSize: 24,
                    fontFamily: 'Inter',
                    fontWeight: 'normal',
                    color: '#666666',
                    textAlign: 'center'
                },
                content: 'Your subtitle or description',
                constraints: {
                    allowResize: true,
                    allowMove: true
                }
            }
        ]
    },
    {
        id: 'image-overlay',
        name: 'Image Overlay',
        category: 'Image-focused',
        thumbnail: '/templates/image-overlay.png',
        defaultDimensions: { width: 1080, height: 1080 },
        elements: [
            {
                id: 'background',
                type: 'image',
                position: { x: 0, y: 0, z: 0 },
                dimensions: { width: 1080, height: 1080 },
                style: {
                    opacity: 0.8
                },
                content: {
                    src: '/placeholder-image.jpg',
                    alt: 'Background image',
                    fit: 'cover'
                },
                constraints: {
                    allowResize: false,
                    allowMove: false
                }
            },
            {
                id: 'overlay-text',
                type: 'text',
                position: { x: 100, y: 800, z: 2 },
                dimensions: { width: 880, height: 100 },
                style: {
                    fontSize: 36,
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    textAlign: 'left',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    borderRadius: 8
                },
                content: 'Overlay Text',
                constraints: {
                    allowResize: true,
                    allowMove: true
                }
            }
        ]
    },
    {
        id: 'split-layout',
        name: 'Split Layout',
        category: 'Mixed',
        thumbnail: '/templates/split-layout.png',
        defaultDimensions: { width: 1080, height: 1080 },
        elements: [
            {
                id: 'left-image',
                type: 'image',
                position: { x: 0, y: 0, z: 0 },
                dimensions: { width: 540, height: 1080 },
                style: {},
                content: {
                    src: '/placeholder-image.jpg',
                    alt: 'Left side image',
                    fit: 'cover'
                },
                constraints: {
                    allowResize: true,
                    allowMove: true
                }
            },
            {
                id: 'right-content',
                type: 'shape',
                position: { x: 540, y: 0, z: 0 },
                dimensions: { width: 540, height: 1080 },
                style: {
                    backgroundColor: '#f8f9fa'
                },
                content: '',
                constraints: {
                    allowResize: true,
                    allowMove: true
                }
            },
            {
                id: 'right-title',
                type: 'text',
                position: { x: 580, y: 400, z: 1 },
                dimensions: { width: 460, height: 120 },
                style: {
                    fontSize: 32,
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    color: '#1a1a1a',
                    textAlign: 'left'
                },
                content: 'Split Layout Title',
                constraints: {
                    allowResize: true,
                    allowMove: true
                }
            },
            {
                id: 'right-text',
                type: 'text',
                position: { x: 580, y: 550, z: 1 },
                dimensions: { width: 460, height: 200 },
                style: {
                    fontSize: 18,
                    fontFamily: 'Inter',
                    fontWeight: 'normal',
                    color: '#666666',
                    textAlign: 'left'
                },
                content: 'Add your description or key points here.',
                constraints: {
                    allowResize: true,
                    allowMove: true
                }
            }
        ]
    },
    {
        id: 'quote-card',
        name: 'Quote Card',
        category: 'Text-focused',
        thumbnail: '/templates/quote-card.png',
        defaultDimensions: { width: 1080, height: 1080 },
        elements: [
            {
                id: 'background',
                type: 'shape',
                position: { x: 0, y: 0, z: 0 },
                dimensions: { width: 1080, height: 1080 },
                style: {
                    backgroundColor: '#667eea'
                },
                content: '',
                constraints: {
                    allowResize: false,
                    allowMove: false
                }
            },
            {
                id: 'quote-mark',
                type: 'text',
                position: { x: 100, y: 200, z: 1 },
                dimensions: { width: 100, height: 100 },
                style: {
                    fontSize: 72,
                    fontFamily: 'Georgia',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    textAlign: 'left',
                    opacity: 0.3
                },
                content: '"',
                constraints: {
                    allowResize: false,
                    allowMove: true
                }
            },
            {
                id: 'quote-text',
                type: 'text',
                position: { x: 100, y: 350, z: 1 },
                dimensions: { width: 880, height: 300 },
                style: {
                    fontSize: 28,
                    fontFamily: 'Inter',
                    fontWeight: 'normal',
                    color: '#ffffff',
                    textAlign: 'center'
                },
                content: 'Your inspiring quote goes here',
                constraints: {
                    allowResize: true,
                    allowMove: true
                }
            },
            {
                id: 'author',
                type: 'text',
                position: { x: 100, y: 750, z: 1 },
                dimensions: { width: 880, height: 60 },
                style: {
                    fontSize: 20,
                    fontFamily: 'Inter',
                    fontWeight: 'normal',
                    color: '#ffffff',
                    textAlign: 'center',
                    opacity: 0.8
                },
                content: '— Author Name',
                constraints: {
                    allowResize: true,
                    allowMove: true
                }
            }
        ]
    },
    {
        id: 'stats-showcase',
        name: 'Stats Showcase',
        category: 'Data',
        thumbnail: '/templates/stats-showcase.png',
        defaultDimensions: { width: 1080, height: 1080 },
        elements: [
            {
                id: 'header',
                type: 'text',
                position: { x: 100, y: 100, z: 1 },
                dimensions: { width: 880, height: 80 },
                style: {
                    fontSize: 32,
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    color: '#1a1a1a',
                    textAlign: 'center'
                },
                content: 'Key Statistics',
                constraints: {
                    allowResize: true,
                    allowMove: true
                }
            },
            {
                id: 'stat1-number',
                type: 'text',
                position: { x: 100, y: 300, z: 1 },
                dimensions: { width: 350, height: 120 },
                style: {
                    fontSize: 64,
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    color: '#667eea',
                    textAlign: 'center'
                },
                content: '85%',
                constraints: {
                    allowResize: true,
                    allowMove: true
                }
            },
            {
                id: 'stat1-label',
                type: 'text',
                position: { x: 100, y: 420, z: 1 },
                dimensions: { width: 350, height: 60 },
                style: {
                    fontSize: 18,
                    fontFamily: 'Inter',
                    fontWeight: 'normal',
                    color: '#666666',
                    textAlign: 'center'
                },
                content: 'Success Rate',
                constraints: {
                    allowResize: true,
                    allowMove: true
                }
            },
            {
                id: 'stat2-number',
                type: 'text',
                position: { x: 630, y: 300, z: 1 },
                dimensions: { width: 350, height: 120 },
                style: {
                    fontSize: 64,
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    color: '#f093fb',
                    textAlign: 'center'
                },
                content: '2.5K',
                constraints: {
                    allowResize: true,
                    allowMove: true
                }
            },
            {
                id: 'stat2-label',
                type: 'text',
                position: { x: 630, y: 420, z: 1 },
                dimensions: { width: 350, height: 60 },
                style: {
                    fontSize: 18,
                    fontFamily: 'Inter',
                    fontWeight: 'normal',
                    color: '#666666',
                    textAlign: 'center'
                },
                content: 'Happy Customers',
                constraints: {
                    allowResize: true,
                    allowMove: true
                }
            }
        ]
    },
    {
        id: 'step-by-step',
        name: 'Step by Step',
        category: 'Educational',
        thumbnail: '/templates/step-by-step.png',
        defaultDimensions: { width: 1080, height: 1080 },
        elements: [
            {
                id: 'step-number',
                type: 'shape',
                position: { x: 100, y: 100, z: 1 },
                dimensions: { width: 80, height: 80 },
                style: {
                    backgroundColor: '#667eea',
                    borderRadius: 40
                },
                content: '',
                constraints: {
                    allowResize: true,
                    allowMove: true
                }
            },
            {
                id: 'step-number-text',
                type: 'text',
                position: { x: 120, y: 120, z: 2 },
                dimensions: { width: 40, height: 40 },
                style: {
                    fontSize: 24,
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    textAlign: 'center'
                },
                content: '1',
                constraints: {
                    allowResize: false,
                    allowMove: true
                }
            },
            {
                id: 'step-title',
                type: 'text',
                position: { x: 220, y: 100, z: 1 },
                dimensions: { width: 760, height: 80 },
                style: {
                    fontSize: 32,
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    color: '#1a1a1a',
                    textAlign: 'left'
                },
                content: 'Step Title',
                constraints: {
                    allowResize: true,
                    allowMove: true
                }
            },
            {
                id: 'step-description',
                type: 'text',
                position: { x: 100, y: 250, z: 1 },
                dimensions: { width: 880, height: 400 },
                style: {
                    fontSize: 20,
                    fontFamily: 'Inter',
                    fontWeight: 'normal',
                    color: '#666666',
                    textAlign: 'left'
                },
                content: 'Detailed description of this step goes here. Explain what the user needs to do.',
                constraints: {
                    allowResize: true,
                    allowMove: true
                }
            }
        ]
    },
    {
        id: 'before-after',
        name: 'Before & After',
        category: 'Comparison',
        thumbnail: '/templates/before-after.png',
        defaultDimensions: { width: 1080, height: 1080 },
        elements: [
            {
                id: 'divider',
                type: 'shape',
                position: { x: 535, y: 0, z: 1 },
                dimensions: { width: 10, height: 1080 },
                style: {
                    backgroundColor: '#e5e7eb'
                },
                content: '',
                constraints: {
                    allowResize: false,
                    allowMove: false
                }
            },
            {
                id: 'before-label',
                type: 'text',
                position: { x: 50, y: 50, z: 2 },
                dimensions: { width: 435, height: 60 },
                style: {
                    fontSize: 24,
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    color: '#ef4444',
                    textAlign: 'center'
                },
                content: 'BEFORE',
                constraints: {
                    allowResize: true,
                    allowMove: true
                }
            },
            {
                id: 'after-label',
                type: 'text',
                position: { x: 595, y: 50, z: 2 },
                dimensions: { width: 435, height: 60 },
                style: {
                    fontSize: 24,
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    color: '#10b981',
                    textAlign: 'center'
                },
                content: 'AFTER',
                constraints: {
                    allowResize: true,
                    allowMove: true
                }
            },
            {
                id: 'before-content',
                type: 'text',
                position: { x: 50, y: 200, z: 1 },
                dimensions: { width: 435, height: 600 },
                style: {
                    fontSize: 18,
                    fontFamily: 'Inter',
                    fontWeight: 'normal',
                    color: '#374151',
                    textAlign: 'center'
                },
                content: 'Before state or condition',
                constraints: {
                    allowResize: true,
                    allowMove: true
                }
            },
            {
                id: 'after-content',
                type: 'text',
                position: { x: 595, y: 200, z: 1 },
                dimensions: { width: 435, height: 600 },
                style: {
                    fontSize: 18,
                    fontFamily: 'Inter',
                    fontWeight: 'normal',
                    color: '#374151',
                    textAlign: 'center'
                },
                content: 'After state or condition',
                constraints: {
                    allowResize: true,
                    allowMove: true
                }
            }
        ]
    },
    {
        id: 'product-feature',
        name: 'Product Feature',
        category: 'Product',
        thumbnail: '/templates/product-feature.png',
        defaultDimensions: { width: 1080, height: 1080 },
        elements: [
            {
                id: 'product-image',
                type: 'image',
                position: { x: 100, y: 100, z: 1 },
                dimensions: { width: 880, height: 400 },
                style: {
                    borderRadius: 12
                },
                content: {
                    src: '/placeholder-product.jpg',
                    alt: 'Product image',
                    fit: 'cover'
                },
                constraints: {
                    allowResize: true,
                    allowMove: true
                }
            },
            {
                id: 'feature-title',
                type: 'text',
                position: { x: 100, y: 550, z: 1 },
                dimensions: { width: 880, height: 100 },
                style: {
                    fontSize: 36,
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    color: '#1a1a1a',
                    textAlign: 'center'
                },
                content: 'Amazing Feature',
                constraints: {
                    allowResize: true,
                    allowMove: true
                }
            },
            {
                id: 'feature-description',
                type: 'text',
                position: { x: 100, y: 680, z: 1 },
                dimensions: { width: 880, height: 200 },
                style: {
                    fontSize: 20,
                    fontFamily: 'Inter',
                    fontWeight: 'normal',
                    color: '#666666',
                    textAlign: 'center'
                },
                content: 'Describe the key benefit or feature that makes your product special.',
                constraints: {
                    allowResize: true,
                    allowMove: true
                }
            }
        ]
    }
];

// Helper function to get template by ID
export const getTemplateById = (id: string): Template | undefined => {
    return DEFAULT_TEMPLATES.find(template => template.id === id);
};

// Helper function to get templates by category
export const getTemplatesByCategory = (category: string): Template[] => {
    return DEFAULT_TEMPLATES.filter(template => template.category === category);
};

// Helper function to get all categories
export const getTemplateCategories = (): string[] => {
    const categories = DEFAULT_TEMPLATES.map(template => template.category);
    return [...new Set(categories)];
};