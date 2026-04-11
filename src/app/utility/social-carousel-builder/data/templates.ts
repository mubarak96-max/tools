import { PremiumTemplate, TemplateCategory, PremiumSlide } from '../types/premium';

export const templateCategories: TemplateCategory[] = [
    {
        id: 'business',
        name: 'Business',
        description: 'Professional templates for business presentations and marketing',
        icon: '💼',
        color: '#3B82F6',
        order: 1
    },
    {
        id: 'education',
        name: 'Education',
        description: 'Educational content and learning materials',
        icon: '📚',
        color: '#10B981',
        order: 2
    },
    {
        id: 'marketing',
        name: 'Marketing',
        description: 'Marketing campaigns and promotional content',
        icon: '📈',
        color: '#F59E0B',
        order: 3
    },
    {
        id: 'social',
        name: 'Social Media',
        description: 'Social media posts and stories',
        icon: '📱',
        color: '#EF4444',
        order: 4
    },
    {
        id: 'personal',
        name: 'Personal',
        description: 'Personal projects and creative content',
        icon: '🎨',
        color: '#8B5CF6',
        order: 5
    },
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Clean and minimalist designs',
        icon: '⚪',
        color: '#6B7280',
        order: 6
    }
];

// Sample template data
export const sampleTemplates: PremiumTemplate[] = [
    {
        id: 'business-pitch-deck',
        name: 'Business Pitch Deck',
        category: templateCategories[0],
        tags: ['business', 'presentation', 'startup', 'professional'],
        preview: {
            thumbnail: '/templates/business-pitch-deck/thumbnail.jpg',
            fullPreview: [
                '/templates/business-pitch-deck/slide-1.jpg',
                '/templates/business-pitch-deck/slide-2.jpg',
                '/templates/business-pitch-deck/slide-3.jpg'
            ]
        },
        slides: [
            {
                id: 'slide-1',
                name: 'Title Slide',
                elements: [
                    {
                        id: 'title-text',
                        type: 'text',
                        position: { x: 100, y: 200, z: 1 },
                        dimensions: { width: 880, height: 120 },
                        style: {
                            fontSize: 48,
                            fontWeight: 'bold',
                            color: '#1F2937',
                            textAlign: 'center'
                        },
                        content: 'Your Business Name',
                        constraints: {
                            allowMove: true,
                            allowResize: true,
                            allowRotate: false,
                            allowDelete: false
                        }
                    },
                    {
                        id: 'subtitle-text',
                        type: 'text',
                        position: { x: 100, y: 350, z: 2 },
                        dimensions: { width: 880, height: 60 },
                        style: {
                            fontSize: 24,
                            fontWeight: 'normal',
                            color: '#6B7280',
                            textAlign: 'center'
                        },
                        content: 'Innovative Solutions for Modern Challenges',
                        constraints: {
                            allowMove: true,
                            allowResize: true,
                            allowRotate: false,
                            allowDelete: true
                        }
                    }
                ],
                background: {
                    type: 'gradient',
                    value: {
                        type: 'linear',
                        angle: 135,
                        stops: [
                            { color: '#F8FAFC', position: 0 },
                            { color: '#E2E8F0', position: 100 }
                        ]
                    }
                },
                dimensions: { width: 1080, height: 1080 },
                metadata: {
                    name: 'Title Slide',
                    createdAt: new Date('2024-01-01'),
                    modifiedAt: new Date('2024-01-01'),
                    version: 1
                }
            },
            {
                id: 'slide-2',
                name: 'Problem Statement',
                elements: [
                    {
                        id: 'problem-title',
                        type: 'text',
                        position: { x: 80, y: 120, z: 1 },
                        dimensions: { width: 920, height: 80 },
                        style: {
                            fontSize: 36,
                            fontWeight: 'bold',
                            color: '#1F2937',
                            textAlign: 'left'
                        },
                        content: 'The Problem',
                        constraints: {
                            allowMove: true,
                            allowResize: true,
                            allowRotate: false,
                            allowDelete: false
                        }
                    },
                    {
                        id: 'problem-description',
                        type: 'text',
                        position: { x: 80, y: 220, z: 2 },
                        dimensions: { width: 920, height: 400 },
                        style: {
                            fontSize: 20,
                            fontWeight: 'normal',
                            color: '#4B5563',
                            textAlign: 'left',
                            lineHeight: 1.6
                        },
                        content: 'Many businesses struggle with inefficient processes that waste time and resources. Traditional solutions are often complex, expensive, and difficult to implement.',
                        constraints: {
                            allowMove: true,
                            allowResize: true,
                            allowRotate: false,
                            allowDelete: true
                        }
                    }
                ],
                background: {
                    type: 'color',
                    value: '#FFFFFF'
                },
                dimensions: { width: 1080, height: 1080 },
                metadata: {
                    name: 'Problem Statement',
                    createdAt: new Date('2024-01-01'),
                    modifiedAt: new Date('2024-01-01'),
                    version: 1
                }
            }
        ],
        metadata: {
            author: 'Premium Templates',
            description: 'A professional business pitch deck template perfect for startups and established companies',
            tags: ['business', 'presentation', 'startup', 'professional'],
            difficulty: 'intermediate',
            estimatedTime: 30,
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-15'),
            version: '1.2.0',
            downloads: 1250,
            rating: 4.8
        },
        premium: true
    },
    {
        id: 'social-media-pack',
        name: 'Social Media Pack',
        category: templateCategories[3],
        tags: ['social', 'instagram', 'modern', 'colorful'],
        preview: {
            thumbnail: '/templates/social-media-pack/thumbnail.jpg',
            fullPreview: [
                '/templates/social-media-pack/slide-1.jpg',
                '/templates/social-media-pack/slide-2.jpg'
            ]
        },
        slides: [
            {
                id: 'social-slide-1',
                name: 'Quote Post',
                elements: [
                    {
                        id: 'quote-bg',
                        type: 'shape',
                        position: { x: 0, y: 0, z: 0 },
                        dimensions: { width: 1080, height: 1080 },
                        style: {
                            backgroundColor: '#3B82F6',
                            borderRadius: 0
                        },
                        content: {
                            type: 'rectangle'
                        },
                        constraints: {
                            allowMove: false,
                            allowResize: false,
                            allowRotate: false,
                            allowDelete: false
                        }
                    },
                    {
                        id: 'quote-text',
                        type: 'text',
                        position: { x: 120, y: 400, z: 1 },
                        dimensions: { width: 840, height: 200 },
                        style: {
                            fontSize: 42,
                            fontWeight: 'bold',
                            color: '#FFFFFF',
                            textAlign: 'center'
                        },
                        content: '"Success is not final, failure is not fatal: it is the courage to continue that counts."',
                        constraints: {
                            allowMove: true,
                            allowResize: true,
                            allowRotate: false,
                            allowDelete: false
                        }
                    },
                    {
                        id: 'quote-author',
                        type: 'text',
                        position: { x: 120, y: 650, z: 2 },
                        dimensions: { width: 840, height: 60 },
                        style: {
                            fontSize: 24,
                            fontWeight: 'normal',
                            color: '#E5E7EB',
                            textAlign: 'center'
                        },
                        content: '— Winston Churchill',
                        constraints: {
                            allowMove: true,
                            allowResize: true,
                            allowRotate: false,
                            allowDelete: true
                        }
                    }
                ],
                background: {
                    type: 'color',
                    value: '#3B82F6'
                },
                dimensions: { width: 1080, height: 1080 },
                metadata: {
                    name: 'Quote Post',
                    createdAt: new Date('2024-01-01'),
                    modifiedAt: new Date('2024-01-01'),
                    version: 1
                }
            }
        ],
        metadata: {
            author: 'Social Templates',
            description: 'Eye-catching social media templates for Instagram, Facebook, and other platforms',
            tags: ['social', 'instagram', 'modern', 'colorful'],
            difficulty: 'beginner',
            estimatedTime: 15,
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-10'),
            version: '1.0.0',
            downloads: 2100,
            rating: 4.6
        },
        premium: false
    },
    {
        id: 'minimal-portfolio',
        name: 'Minimal Portfolio',
        category: templateCategories[5],
        tags: ['minimal', 'portfolio', 'clean', 'professional'],
        preview: {
            thumbnail: '/templates/minimal-portfolio/thumbnail.jpg',
            fullPreview: [
                '/templates/minimal-portfolio/slide-1.jpg',
                '/templates/minimal-portfolio/slide-2.jpg',
                '/templates/minimal-portfolio/slide-3.jpg'
            ]
        },
        slides: [
            {
                id: 'portfolio-slide-1',
                name: 'Cover',
                elements: [
                    {
                        id: 'portfolio-title',
                        type: 'text',
                        position: { x: 80, y: 300, z: 1 },
                        dimensions: { width: 920, height: 100 },
                        style: {
                            fontSize: 48,
                            fontWeight: 'light',
                            color: '#1F2937',
                            textAlign: 'left'
                        },
                        content: 'Creative Portfolio',
                        constraints: {
                            allowMove: true,
                            allowResize: true,
                            allowRotate: false,
                            allowDelete: false
                        }
                    },
                    {
                        id: 'portfolio-name',
                        type: 'text',
                        position: { x: 80, y: 420, z: 2 },
                        dimensions: { width: 920, height: 60 },
                        style: {
                            fontSize: 24,
                            fontWeight: 'normal',
                            color: '#6B7280',
                            textAlign: 'left'
                        },
                        content: 'Your Name Here',
                        constraints: {
                            allowMove: true,
                            allowResize: true,
                            allowRotate: false,
                            allowDelete: true
                        }
                    },
                    {
                        id: 'portfolio-line',
                        type: 'shape',
                        position: { x: 80, y: 520, z: 3 },
                        dimensions: { width: 200, height: 2 },
                        style: {
                            backgroundColor: '#E5E7EB'
                        },
                        content: {
                            type: 'rectangle'
                        },
                        constraints: {
                            allowMove: true,
                            allowResize: true,
                            allowRotate: false,
                            allowDelete: true
                        }
                    }
                ],
                background: {
                    type: 'color',
                    value: '#FFFFFF'
                },
                dimensions: { width: 1080, height: 1080 },
                metadata: {
                    name: 'Cover',
                    createdAt: new Date('2024-01-01'),
                    modifiedAt: new Date('2024-01-01'),
                    version: 1
                }
            }
        ],
        metadata: {
            author: 'Minimal Design Co.',
            description: 'Clean and minimal portfolio template for creatives and professionals',
            tags: ['minimal', 'portfolio', 'clean', 'professional'],
            difficulty: 'beginner',
            estimatedTime: 20,
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-05'),
            version: '1.1.0',
            downloads: 890,
            rating: 4.9
        },
        premium: true
    },
    {
        id: 'education-infographic',
        name: 'Education Infographic',
        category: templateCategories[1],
        tags: ['education', 'infographic', 'data', 'learning'],
        preview: {
            thumbnail: '/templates/education-infographic/thumbnail.jpg',
            fullPreview: [
                '/templates/education-infographic/slide-1.jpg',
                '/templates/education-infographic/slide-2.jpg'
            ]
        },
        slides: [
            {
                id: 'edu-slide-1',
                name: 'Statistics',
                elements: [
                    {
                        id: 'edu-title',
                        type: 'text',
                        position: { x: 80, y: 80, z: 1 },
                        dimensions: { width: 920, height: 80 },
                        style: {
                            fontSize: 36,
                            fontWeight: 'bold',
                            color: '#1F2937',
                            textAlign: 'center'
                        },
                        content: 'Education Statistics 2024',
                        constraints: {
                            allowMove: true,
                            allowResize: true,
                            allowRotate: false,
                            allowDelete: false
                        }
                    },
                    {
                        id: 'stat-1',
                        type: 'text',
                        position: { x: 80, y: 200, z: 2 },
                        dimensions: { width: 400, height: 150 },
                        style: {
                            fontSize: 48,
                            fontWeight: 'bold',
                            color: '#10B981',
                            textAlign: 'center'
                        },
                        content: '85%',
                        constraints: {
                            allowMove: true,
                            allowResize: true,
                            allowRotate: false,
                            allowDelete: true
                        }
                    },
                    {
                        id: 'stat-1-desc',
                        type: 'text',
                        position: { x: 80, y: 350, z: 3 },
                        dimensions: { width: 400, height: 100 },
                        style: {
                            fontSize: 18,
                            fontWeight: 'normal',
                            color: '#4B5563',
                            textAlign: 'center'
                        },
                        content: 'Students prefer visual learning',
                        constraints: {
                            allowMove: true,
                            allowResize: true,
                            allowRotate: false,
                            allowDelete: true
                        }
                    }
                ],
                background: {
                    type: 'color',
                    value: '#F9FAFB'
                },
                dimensions: { width: 1080, height: 1080 },
                metadata: {
                    name: 'Statistics',
                    createdAt: new Date('2024-01-01'),
                    modifiedAt: new Date('2024-01-01'),
                    version: 1
                }
            }
        ],
        metadata: {
            author: 'EduDesign',
            description: 'Educational infographic template perfect for presenting data and statistics',
            tags: ['education', 'infographic', 'data', 'learning'],
            difficulty: 'intermediate',
            estimatedTime: 25,
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-08'),
            version: '1.0.1',
            downloads: 650,
            rating: 4.7
        },
        premium: false
    }
];

export const getTemplatesByCategory = (categoryId: string): PremiumTemplate[] => {
    if (categoryId === 'all') {
        return sampleTemplates;
    }
    return sampleTemplates.filter(template => template.category.id === categoryId);
};

export const searchTemplates = (query: string): PremiumTemplate[] => {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return sampleTemplates;

    return sampleTemplates.filter(template =>
        template.name.toLowerCase().includes(searchTerm) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        template.category.name.toLowerCase().includes(searchTerm) ||
        template.metadata.description?.toLowerCase().includes(searchTerm)
    );
};

export const getTemplateById = (id: string): PremiumTemplate | undefined => {
    return sampleTemplates.find(template => template.id === id);
};

export const getFeaturedTemplates = (): PremiumTemplate[] => {
    return sampleTemplates
        .filter(template => template.metadata.rating && template.metadata.rating >= 4.5)
        .sort((a, b) => (b.metadata.rating || 0) - (a.metadata.rating || 0))
        .slice(0, 6);
};

export const getPopularTemplates = (): PremiumTemplate[] => {
    return sampleTemplates
        .sort((a, b) => (b.metadata.downloads || 0) - (a.metadata.downloads || 0))
        .slice(0, 8);
};

export const getRecentTemplates = (): PremiumTemplate[] => {
    return sampleTemplates
        .sort((a, b) => new Date(b.metadata.updatedAt).getTime() - new Date(a.metadata.updatedAt).getTime())
        .slice(0, 8);
};