import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NICHE_CONFIGS } from '../_data/niches';
import { CarouselBuilderClient } from '../_components/CarouselBuilderClient';
import { SEOContent } from '../_components/shared/SEOContent';

// Pre-generate all niche pages at build time
export function generateStaticParams() {
    return Object.keys(NICHE_CONFIGS).map((slug) => ({ niche: slug }));
}

export async function generateMetadata(
    { params }: { params: Promise<{ niche: string }> }
): Promise<Metadata> {
    const { niche } = await params;
    const config = NICHE_CONFIGS[niche];
    if (!config) return {};

    return {
        title: config.title,
        description: config.description,
        keywords: config.keywords.join(', '),
        openGraph: {
            title: config.title,
            description: config.description,
            type: 'website',
        },
    };
}

export default async function NicheCarouselPage(
    { params }: { params: Promise<{ niche: string }> }
) {
    const { niche } = await params;
    const config = NICHE_CONFIGS[niche];

    if (!config) notFound();

    return (
        <main>
            <SEOContent niche={config} />
            <div id="carousel-tool">
                <CarouselBuilderClient
                    niche={config.slug}
                    preselectedTemplates={config.templates}
                    defaultTopic={config.defaultTopic}
                />
            </div>
        </main>
    );
}