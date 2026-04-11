import { MetadataRoute } from 'next';
import { NICHE_CONFIGS } from './data/niches';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://findbest.tools';

    // Main carousel builder page
    const mainPage = {
        url: `${baseUrl}/utility/carousel-builder`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    };

    // Niche-specific pages
    const nichePages = Object.keys(NICHE_CONFIGS).map((slug) => ({
        url: `${baseUrl}/utility/carousel-builder/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9, // Higher priority for niche pages
    }));

    return [mainPage, ...nichePages];
}