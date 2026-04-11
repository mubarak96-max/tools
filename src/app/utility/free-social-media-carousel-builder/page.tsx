import type { Metadata } from 'next';
import { DEFAULT_NICHE_CONFIG } from './_data/niches';
import { CarouselBuilderClient } from './_components/CarouselBuilderClient';
import { SEOContent } from './_components/shared/SEOContent';

export const metadata: Metadata = {
    title: DEFAULT_NICHE_CONFIG.title,
    description: DEFAULT_NICHE_CONFIG.description,
    keywords: DEFAULT_NICHE_CONFIG.keywords.join(', '),
    openGraph: {
        title: DEFAULT_NICHE_CONFIG.title,
        description: DEFAULT_NICHE_CONFIG.description,
        type: 'website',
    },
};

export default function CarouselBuilderPage() {
    return (
        <main>
            {/* SEO content block ABOVE the tool (for crawlers) */}
            <SEOContent niche={DEFAULT_NICHE_CONFIG} />
            {/* The editor itself */}
            <div id="carousel-tool">
                <CarouselBuilderClient niche={DEFAULT_NICHE_CONFIG.slug} />
            </div>
        </main>
    );
}