import { Template } from '../types';

// Viral format-based templates (not generic categories)
export const TEMPLATES: Template[] = [
    {
        id: 'hook-value-cta',
        name: 'Hook → Value → CTA',
        description: 'Start with a strong hook, deliver value, end with clear CTA',
        slideCount: 5,
        structure: ['Hook', 'Problem', 'Solution', 'Proof', 'CTA'],
        niches: ['instagram', 'linkedin', 'business', 'marketing'],
        viralScore: 95,
        slides: [
            {
                headline: 'Nobody tells you this about [TOPIC]',
                body: '',
                placeholder: 'Strong hook that grabs attention'
            },
            {
                headline: 'Most people struggle with [PROBLEM]',
                body: '',
                placeholder: 'Identify the main problem'
            },
            {
                headline: 'Here\'s what actually works',
                body: '',
                placeholder: 'Present your solution'
            },
            {
                headline: 'This changed everything for me',
                body: '',
                placeholder: 'Social proof or results'
            },
            {
                headline: 'Follow for more [TOPIC] tips',
                body: '',
                placeholder: 'Clear call to action'
            }
        ]
    },

    {
        id: 'mistakes-list',
        name: 'Mistakes List',
        description: 'Common mistakes people make and how to avoid them',
        slideCount: 6,
        structure: ['Hook', 'Mistake 1', 'Mistake 2', 'Mistake 3', 'Solution', 'CTA'],
        niches: ['business', 'personal-growth', 'education'],
        viralScore: 88,
        slides: [
            {
                headline: '5 mistakes killing your [RESULTS]',
                body: '',
                placeholder: 'Hook with specific number'
            },
            {
                headline: 'Mistake #1: [COMMON ERROR]',
                body: '',
                placeholder: 'First common mistake'
            },
            {
                headline: 'Mistake #2: [ANOTHER ERROR]',
                body: '',
                placeholder: 'Second common mistake'
            },
            {
                headline: 'Mistake #3: [THIRD ERROR]',
                body: '',
                placeholder: 'Third common mistake'
            },
            {
                headline: 'Here\'s what to do instead',
                body: '',
                placeholder: 'Correct approach'
            },
            {
                headline: 'Save this for later',
                body: '',
                placeholder: 'Engagement CTA'
            }
        ]
    },

    {
        id: 'step-by-step',
        name: 'Step-by-Step Guide',
        description: 'Break down complex processes into simple steps',
        slideCount: 6,
        structure: ['Hook', 'Step 1', 'Step 2', 'Step 3', 'Results', 'CTA'],
        niches: ['education', 'business', 'how-to'],
        viralScore: 85,
        slides: [
            {
                headline: 'How to [ACHIEVE GOAL] in 3 steps',
                body: '',
                placeholder: 'Promise a clear outcome'
            },
            {
                headline: 'Step 1: [FIRST ACTION]',
                body: '',
                placeholder: 'First actionable step'
            },
            {
                headline: 'Step 2: [SECOND ACTION]',
                body: '',
                placeholder: 'Second actionable step'
            },
            {
                headline: 'Step 3: [THIRD ACTION]',
                body: '',
                placeholder: 'Third actionable step'
            },
            {
                headline: 'Results you can expect',
                body: '',
                placeholder: 'What they\'ll achieve'
            },
            {
                headline: 'Try this and let me know',
                body: '',
                placeholder: 'Engagement CTA'
            }
        ]
    },

    {
        id: 'before-after',
        name: 'Before / After',
        description: 'Show transformation and results',
        slideCount: 5,
        structure: ['Hook', 'Before', 'Journey', 'After', 'CTA'],
        niches: ['fitness', 'business', 'personal-growth'],
        viralScore: 92,
        slides: [
            {
                headline: 'My [TRANSFORMATION] journey',
                body: '',
                placeholder: 'Personal transformation story'
            },
            {
                headline: 'Where I started',
                body: '',
                placeholder: 'Before state/situation'
            },
            {
                headline: 'What I changed',
                body: '',
                placeholder: 'Key actions taken'
            },
            {
                headline: 'Where I am now',
                body: '',
                placeholder: 'After state/results'
            },
            {
                headline: 'You can do this too',
                body: '',
                placeholder: 'Motivational CTA'
            }
        ]
    },

    {
        id: 'controversial-opinion',
        name: 'Controversial Opinion',
        description: 'Challenge common beliefs to spark engagement',
        slideCount: 5,
        structure: ['Hook', 'Common Belief', 'Why Wrong', 'Truth', 'CTA'],
        niches: ['business', 'marketing', 'personal-growth'],
        viralScore: 90,
        slides: [
            {
                headline: 'Unpopular opinion about [TOPIC]',
                body: '',
                placeholder: 'Controversial hook'
            },
            {
                headline: 'Everyone says [COMMON BELIEF]',
                body: '',
                placeholder: 'What most people think'
            },
            {
                headline: 'But here\'s the problem',
                body: '',
                placeholder: 'Why it\'s wrong'
            },
            {
                headline: 'The real truth is',
                body: '',
                placeholder: 'Your contrarian view'
            },
            {
                headline: 'What do you think?',
                body: '',
                placeholder: 'Discussion CTA'
            }
        ]
    }
];

export const getTemplateById = (id: string): Template | undefined => {
    return TEMPLATES.find(template => template.id === id);
};

export const getTemplatesByNiche = (niche: string): Template[] => {
    return TEMPLATES.filter(template => template.niches.includes(niche));
};

export const getTopTemplates = (limit: number = 5): Template[] => {
    return TEMPLATES
        .sort((a, b) => b.viralScore - a.viralScore)
        .slice(0, limit);
};