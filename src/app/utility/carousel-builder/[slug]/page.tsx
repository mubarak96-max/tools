import { Metadata } from 'next';
import { getNicheConfig, generateMetadata as buildNicheMetadata } from '../utils/seo';
import { SEOContent } from '../components/SEOContent';
import { CarouselBuilder } from '../components/CarouselBuilder';
import { NICHE_CONFIGS } from '../data/niches';

interface NichePageProps {
    params: {
        slug: string;
    };
}

export async function generateStaticParams() {
    return Object.keys(NICHE_CONFIGS).map((slug) => ({
        slug,
    }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await props.params;
    const niche = getNicheConfig(slug);
    return buildNicheMetadata(niche) as Metadata;
}

export default async function NichePage(props: { params: Promise<{ slug: string }> }) {
    const { slug } = await props.params;
    const niche = getNicheConfig(slug);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* SEO Content Block */}
            <SEOContent niche={niche} />

            {/* Carousel Builder Tool */}
            <div id="carousel-tool" className="border-t border-gray-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            {niche.seoContent.h1} Tool
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Create your {niche.title.toLowerCase()} in under 30 seconds with our AI-powered tool
                        </p>
                    </div>

                    <CarouselBuilder niche={niche.slug} />
                </div>
            </div>
        </div>
    );
}