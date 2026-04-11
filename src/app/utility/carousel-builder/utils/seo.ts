import { NICHE_CONFIGS } from '../data/niches';
import { NicheConfig } from '../types';

export const getNicheConfig = (slug: string): NicheConfig => {
    return NICHE_CONFIGS[slug] || NICHE_CONFIGS['instagram-carousel-maker'];
};

export const generateMetadata = (niche: NicheConfig) => ({
    title: niche.title,
    description: niche.description,
    keywords: niche.keywords.join(', '),
    openGraph: {
        title: niche.title,
        description: niche.description,
        images: [`/og-images/${niche.slug}.jpg`],
        type: 'website'
    },
    twitter: {
        card: 'summary_large_image',
        title: niche.title,
        description: niche.description,
        images: [`/og-images/${niche.slug}.jpg`]
    }
});

export const getToolConfig = (niche: string) => {
    const config = getNicheConfig(niche);
    return {
        templates: config.templates,
        defaultTopic: config.defaultTopic,
        placeholder: `e.g., ${config.defaultTopic}`,
        suggestedTopics: generateSuggestedTopics(niche)
    };
};

const generateSuggestedTopics = (niche: string): string[] => {
    const suggestions: Record<string, string[]> = {
        'instagram-carousel-maker': [
            'Instagram growth hacks',
            'Content creation tips',
            'Engagement strategies',
            'Hashtag research guide',
            'Story highlights ideas',
            'Reels vs carousel strategy'
        ],
        'linkedin-carousel-generator': [
            'Leadership lessons',
            'Career advancement tips',
            'Industry insights',
            'Networking strategies',
            'Professional development',
            'Business growth tactics'
        ],
        'real-estate-carousel-templates': [
            'Home buying process',
            'Market trends analysis',
            'Property investment tips',
            'Neighborhood guides',
            'First-time buyer advice',
            'Real estate market updates'
        ],
        'fitness-carousel-maker': [
            'Workout routines',
            'Nutrition tips',
            'Transformation stories',
            'Exercise form guides',
            'Fitness motivation',
            'Healthy lifestyle habits'
        ],
        'business-carousel-templates': [
            'Startup advice',
            'Business growth strategies',
            'Entrepreneurship tips',
            'Industry insights',
            'Success stories',
            'Business mistakes to avoid'
        ],
        'marketing-carousel-creator': [
            'Marketing strategies',
            'Brand building tips',
            'Campaign ideas',
            'Customer acquisition',
            'Content marketing',
            'Social media marketing'
        ]
    };

    return suggestions[niche] || ['Business tips', 'Growth strategies', 'Industry insights'];
};

export const getRelatedNiches = (currentNiche: string): NicheConfig[] => {
    const allNiches = Object.values(NICHE_CONFIGS);
    return allNiches
        .filter(niche => niche.slug !== currentNiche)
        .slice(0, 3); // Show 3 related niches
};