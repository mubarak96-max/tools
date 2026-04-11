import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://findbest.tools';

    return {
        rules: {
            userAgent: '*',
            allow: [
                '/utility/carousel-builder',
                '/utility/carousel-builder/*',
            ],
            disallow: [
                '/api/carousel-generate', // Don't index API endpoints
            ],
        },
        sitemap: `${baseUrl}/utility/carousel-builder/sitemap.xml`,
    };
}