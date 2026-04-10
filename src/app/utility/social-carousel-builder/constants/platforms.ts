import { Platform } from '../types';

// Platform specifications with dimensions and format options
export const PLATFORM_SPECS: Record<string, Platform> = {
    instagram: {
        id: 'instagram',
        name: 'Instagram',
        formats: [
            {
                id: 'square',
                name: 'Square Post',
                dimensions: { width: 1080, height: 1080 },
                aspectRatio: '1:1'
            },
            {
                id: 'portrait',
                name: 'Portrait (3:4)',
                dimensions: { width: 1080, height: 1350 },
                aspectRatio: '3:4'
            },
            {
                id: 'stories',
                name: 'Stories',
                dimensions: { width: 1080, height: 1920 },
                aspectRatio: '9:16'
            }
        ]
    },
    linkedin: {
        id: 'linkedin',
        name: 'LinkedIn',
        formats: [
            {
                id: 'standard',
                name: 'Standard Post',
                dimensions: { width: 1200, height: 1200 },
                aspectRatio: '1:1'
            }
        ]
    },
    tiktok: {
        id: 'tiktok',
        name: 'TikTok',
        formats: [
            {
                id: 'vertical',
                name: 'Vertical Video',
                dimensions: { width: 1080, height: 1920 },
                aspectRatio: '9:16'
            }
        ]
    }
};

// Helper function to get all platforms as array
export const getAllPlatforms = (): Platform[] => {
    return Object.values(PLATFORM_SPECS);
};

// Helper function to get platform by ID
export const getPlatformById = (id: string): Platform | undefined => {
    return PLATFORM_SPECS[id];
};

// Helper function to get format by platform and format ID
export const getFormatById = (platformId: string, formatId: string) => {
    const platform = getPlatformById(platformId);
    return platform?.formats.find(format => format.id === formatId);
};